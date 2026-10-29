#!/usr/bin/env node
/**
 * The conductor's mechanical half, as a program. The agent running a round
 * loops on `next`, does what the action says (dispatch personas, ask the
 * operator, provide an input, run speckit), and feeds the result back. Every
 * mechanical rule — seating, quorum, retry then ABSTAIN, who votes on what,
 * NEED_INFO hold and routing, the Stage-4 count, gate cycles and the bound,
 * the record itself — is computed here from the run log, never by the agent.
 *
 *   conduct init review    --target <t> --context <text|@file> [--pr <n>] [--roster a,b] [--python] [--date YYYY-MM-DD] [--dir docs/reviews]
 *   conduct init sdlc      --feature <0NN-name> [--corpus a,b] [--roster a,b] [--date …]
 *   conduct init challenge --target <t> [--corpus a,b] [--roster a,b] [--date …] [--dir docs/reviews]
 *   conduct next   <run.json>                         # the next action, as JSON
 *   conduct submit <run.json> <persona> <reply.json>  # a persona's reply to the current action
 *   conduct fail   <run.json> <persona> <failure> <reason>
 *   conduct ack    <run.json> <persona>               # a free-form step (explore, memory) done
 *   conduct answer <run.json> <topic> <data.json>     # an input the action asked for
 *   conduct status <run.json>
 *   conduct record <run.json>                         # write <stem>.json and <stem>.md
 *
 *   exit: 0 ok · 1 refused (a reply failed validation: logged as a failure) ·
 *         2 usage, or input the current action did not ask for (nothing logged) ·
 *         3 version mismatch (nothing logged, never charged to the persona)
 *
 * State is a pure function of the log: derive(log) → { action, ... }. No clock,
 * no randomness, so the same log always yields the same record.
 * Zero dependencies; Node 20+.
 */

import { existsSync, readFileSync, readdirSync, realpathSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ACTION, CONFIDENCE, DECISION_EVIDENCE, DECISION_RESOLUTION, DECISION_STATUS, EVENT, FAILURE, GATE, GATE_NAME_OF,
  GATE_QUORUM, GATE_RESULT, HELD_ROUTE, LENS_OF, OPTIONAL_LENSES, PHASE, RECORD_KIND, RECOVERY, RED_DISPOSITION,
  REVIEW_MODE, REVIEW_QUORUM, RSVP, RUN_MODE, SCOPE, SDLC_MODE, SDLC_STATUS, SEAT, SEATING_BAND, SEVERITY, TALLY_STATUS,
  TOPIC, VOCAB, VOTE,
} from "./vocab.mjs";
import {
  BEFORE_GATE, CASCADE, CYCLE_BOUND, QUORUM, RETRIES, SEAT_CAP, ballot, count, gateOutcome, gatingSet, quorate, rankable,
  register, registerDerived, seat, sideNotes,
} from "./engine.mjs";
import { SCHEMA_MAJOR, conforms, validate } from "./validate.mjs";
import { bindings } from "./bindings.mjs";
import { render } from "./render.mjs";

const SCHEMA_VERSION = `${SCHEMA_MAJOR}.0`;

/** The reply kind each phase expects; need-info expects a revision (round 1) then a re-vote (round 2). */
const KIND_OF = {
  [PHASE.RSVP]: RECORD_KIND.RSVP,
  [PHASE.AUTHOR]: RECORD_KIND.FINDING_REPORT,
  [PHASE.VOTE]: RECORD_KIND.VOTE_REPORT,
};
const kindFor = (phase, round) => (phase === PHASE.NEED_INFO ? (round === 1 ? RECORD_KIND.FINDING_REPORT : RECORD_KIND.VOTE_REPORT) : KIND_OF[phase] ?? null);

/** Where each answer topic's data contract lives. */
const RUN = "run-log.schema.json#/$defs/";
const ANSWER_SCHEMA = {
  [TOPIC.GATE_ANSWERS]: `${RUN}gate_answers`,
  [TOPIC.PROVISION]: `${RUN}provision`,
  [TOPIC.CONFLICTS]: "review-record.schema.json#/properties/conflicts",
  [TOPIC.RANKING]: `${RUN}ranking`,
  [TOPIC.SIGNOFF]: `${RUN}signoff`,
  [TOPIC.PREMISE_PASS]: "sdlc-log.schema.json#/properties/gates/items/properties/premise_pass",
  [TOPIC.INCORPORATED]: `${RUN}incorporated`,
  [TOPIC.SKILL_DONE]: `${RUN}skill_done`,
  [TOPIC.MEMORY_UPDATE]: "sdlc-log.schema.json#/properties/memory_update",
  [TOPIC.OPERATOR_RULING]: `${RUN}operator_ruling`,
};

/* ── per-persona step status ─────────────────────────────────────────────── */

const PENDING = 0, REPLIED = 1, RETRYING = 2, ABSTAINED = 3;

const roundOf = (e) => e.round ?? 1;
const sameCtx = (ctx) => (e) => e.gate === ctx.gate && e.cycle === ctx.cycle;

/** Where one persona stands on one ask: replied, retrying once, abstained under the failure rule, or pending. */
function status(evs, phase, persona, round = 1, finding) {
  const mine = evs.filter((e) => e.phase === phase && e.persona === persona && roundOf(e) === round && e.finding === finding);
  const reply = mine.filter((e) => e.type === EVENT.REPLY || e.type === EVENT.ACK).at(-1);
  if (reply) return { st: REPLIED, reply: reply.data };
  const fails = mine.filter((e) => e.type === EVENT.FAILURE);
  const last = fails.at(-1);
  if (last && (last.failure === FAILURE.NOT_INSTALLED || fails.length > RETRIES)) return { st: ABSTAINED, failure: last.failure, reason: last.reason, fails };
  if (last) return { st: RETRYING, reason: last.reason, fails };
  return { st: PENDING };
}

/** Status of many asks at once. asks: [{persona, round?, finding?, ...context}]. */
function group(evs, phase, asks) {
  const g = { pending: [], retries: [], replies: new Map(), abstained: new Map() };
  for (const a of asks) {
    const s = status(evs, phase, a.persona, a.round ?? 1, a.finding);
    if (s.st === PENDING) g.pending.push(a);
    else if (s.st === RETRYING) g.retries.push({ ...a, reason: s.reason });
    else if (s.st === ABSTAINED) g.abstained.set(a.persona, s);
    else g.replies.set(a.persona, s.reply);
  }
  return g;
}

/** The dispatch or retry action a group still needs, or null when every ask is settled. */
function outstanding(g, phase, ctx, extra = {}) {
  const base = { phase, ...ctxOf(ctx), ...extra };
  if (g.pending.length) return { action: ACTION.DISPATCH, ...base, asks: g.pending.map((a) => ({ kind: kindFor(phase, a.round ?? 1), ...a })) };
  if (g.retries.length) return { action: ACTION.RETRY, ...base, asks: g.retries.map((a) => ({ kind: kindFor(phase, a.round ?? 1), ...a })) };
  return null;
}

const ctxOf = (ctx) => (ctx.gate ? { gate: ctx.gate, cycle: ctx.cycle } : {});
const answersOf = (evs, topic) => evs.filter((e) => e.type === EVENT.ANSWER && e.topic === topic).map((e) => e.data);
const lastAnswer = (evs, topic) => answersOf(evs, topic).at(-1);

/* ── one board: RSVP → explore → author → vote → need-info ──────────────── */

function rsvpRow(rosterRow, reply, abst) {
  if (abst) return { persona: rosterRow.persona, lens: rosterRow.lens, decision: RSVP.ABSTAIN, reason: abst.reason, failure: abst.failure };
  const r = { persona: rosterRow.persona, lens: reply.lens ?? rosterRow.lens, decision: reply.decision, reason: reply.reason };
  if (reply.applies?.length) r.applies = reply.applies;
  if (reply.expected) { r.expected = reply.expected.stakes; r.hook = reply.expected.hook; }
  if (reply.uncovered_delta) r.uncovered_delta = reply.uncovered_delta;
  return r;
}

/**
 * Run one board as far as the log allows. Returns { action } while work is
 * outstanding, else { board } with everything the record needs.
 */
function board(log, ctx) {
  const evs = log.events.filter(sameCtx(ctx));
  const roster = log.header.roster;
  const recoveries = [];

  // Phase 0.5 — RSVP, with one re-ask of every abstainer below quorum (I3).
  const g1 = group(evs, PHASE.RSVP, roster.map((r) => ({ persona: r.persona, round: 1 })));
  let a = outstanding(g1, PHASE.RSVP, ctx);
  if (a) return { action: a };
  const replies = new Map(g1.replies), abst = new Map(g1.abstained);
  const rowsNow = () => roster.map((r) => rsvpRow(r, replies.get(r.persona), abst.get(r.persona)));
  let seating = seat(rowsNow());
  let reasked = false;
  if (!quorate(seating.joiners)) {
    reasked = true;
    const abstainers = roster.filter((r) => replies.get(r.persona)?.decision === RSVP.ABSTAIN).map((r) => ({ persona: r.persona, round: 2 }));
    const g2 = group(evs, PHASE.RSVP, abstainers);
    a = outstanding(g2, PHASE.RSVP, ctx, { reask: true });
    if (a) return { action: a };
    for (const [p, r] of g2.replies) replies.set(p, r);
    for (const [p, s] of g2.abstained) abst.set(p, s);
    seating = seat(rowsNow());
  }
  const rows = seating.rows;
  const quorum = !quorate(seating.joiners) ? REVIEW_QUORUM.ABORTED : reasked ? REVIEW_QUORUM.RE_ASKED_PROCEED : REVIEW_QUORUM.PROCEED;
  const base = { rows, seating, quorum, recoveries, evs };
  if (quorum === REVIEW_QUORUM.ABORTED) return { board: { ...base, aborted: true, entries: [], tally: [], held: [], notes: [] } };

  const seated = rows.filter((r) => r.seated).map((r) => r.persona);
  const drop = (persona, s) => {
    const row = rows.find((r) => r.persona === persona);
    Object.assign(row, { decision: RSVP.ABSTAIN, failure: s.failure, reason: s.reason, seated: false });
    delete row.seat;
  };

  // Phase 0.7 — exploratory phase: each seated persona builds its understanding (free-form, acked).
  const ge = group(evs, PHASE.EXPLORE, seated.map((p) => ({ persona: p })));
  a = outstanding(ge, PHASE.EXPLORE, ctx);
  if (a) return { action: a };
  for (const [p, s] of ge.abstained) drop(p, s);
  let active = seated.filter((p) => !ge.abstained.has(p));

  // Stage 2 — author, uncapped; an unmet gate returns its questions and the round waits (S10).
  const finals = new Map(), pend = [], retr = [], asks = [];
  for (const p of active) {
    for (let r = 1; ; r++) {
      const s = status(evs, PHASE.AUTHOR, p, r);
      if (s.st === PENDING) {
        const prior = r > 1 ? answersOf(evs, TOPIC.GATE_ANSWERS).filter((x) => x.persona === p && x.round === r - 1).at(-1) : undefined;
        pend.push({ persona: p, round: r, ...(prior ? { gate_answers: prior.answers } : {}) });
        break;
      }
      if (s.st === RETRYING) { retr.push({ persona: p, round: r, reason: s.reason }); break; }
      if (s.st === ABSTAINED) { drop(p, s); break; }
      if (s.reply.gate_questions?.length) {
        const answered = answersOf(evs, TOPIC.GATE_ANSWERS).some((x) => x.persona === p && x.round === r);
        if (!answered) { asks.push(...s.reply.gate_questions.map((q) => ({ persona: p, round: r, ...q }))); break; }
        continue;
      }
      finals.set(p, s.reply);
      break;
    }
  }
  a = outstanding({ pending: pend, retries: retr }, PHASE.AUTHOR, ctx);
  if (a) return { action: a };
  if (asks.length) {
    return { action: { action: ACTION.ASK_OPERATOR, phase: PHASE.AUTHOR, ...ctxOf(ctx), topic: TOPIC.GATE_ANSWERS, questions: asks,
      rule: "S10: blocking questions; at most four per AskUserQuestion call; the round waits. Answer one persona's round at a time." } };
  }
  active = active.filter((p) => finals.has(p));
  if (active.length < QUORUM) return { board: { ...base, aborted: true, entries: [], tally: [], held: [], notes: [], afterEvidence: true } };

  let entries = register(active.map((p) => ({ persona: p, findings: finals.get(p).findings }))).map((x) => x.entry);

  // Stage 3 — vote: every active persona, on every finding but its own (S8).
  const gv = group(evs, PHASE.VOTE, active.map((p) => ({ persona: p, ballot: ballot(entries, p).map((e) => e.id) })));
  a = outstanding(gv, PHASE.VOTE, ctx, { register: entries.map(publicEntry) });
  if (a) return { action: a };
  const voters = active.filter((p) => gv.replies.has(p));
  let votes = voters.flatMap((p) => gv.replies.get(p).votes.map((v) => ({ voter: p, ...v })));
  entries = entries.concat(registerDerived(entries, voters.map((p) => ({ persona: p, derived: gv.replies.get(p).derived }))).map((x) => x.entry));

  // S11 — each held finding: peer provision, else operator; then the author revises and the others re-vote.
  const first = count(entries, votes);
  const routes = new Map();
  for (const row of first.rows.filter((r) => r.status === TALLY_STATUS.HELD)) {
    const f = row.finding;
    const e = entries.find((x) => x.id === f);
    const raisers = new Set([...(e.need_info_reasons ?? []), ...(first.raised.get(f) ?? [])].map((x) => x.raiser));
    const reasons = [...(e.need_info_reasons ?? []), ...(first.raised.get(f) ?? [])];
    const peers = active.filter((p) => p !== e.author && !raisers.has(p));
    const prov = answersOf(evs, TOPIC.PROVISION).filter((x) => x.finding === f);
    const peer = prov.filter((x) => x.route === HELD_ROUTE.PEER).at(-1);
    const op = prov.filter((x) => x.route === HELD_ROUTE.OPERATOR).at(-1);
    const supply = (route) => ({ action: { action: route === HELD_ROUTE.PEER ? ACTION.PROVIDE : ACTION.ASK_OPERATOR, phase: PHASE.NEED_INFO, ...ctxOf(ctx),
      topic: TOPIC.PROVISION, finding: f, route, reasons, ...(route === HELD_ROUTE.PEER ? { peers } : {}),
      rule: "S11: route, never resolve. Relay the reasons verbatim; record what was supplied, or supplied: false." } });
    if (peers.length && !peer) return supply(HELD_ROUTE.PEER);
    let supplied = peer?.supplied ? peer : null;
    routes.set(f, { route: supplied ? HELD_ROUTE.PEER : HELD_ROUTE.OPERATOR, reasons });
    if (!supplied) {
      if (!op) return supply(HELD_ROUTE.OPERATOR);
      supplied = op.supplied ? op : null;
    }
    if (!supplied) continue;
    const rev = status(evs, PHASE.NEED_INFO, e.author, 1, f);
    if (rev.st === PENDING || rev.st === RETRYING) {
      return { action: { action: rev.st === PENDING ? ACTION.DISPATCH : ACTION.RETRY, phase: PHASE.NEED_INFO, ...ctxOf(ctx),
        asks: [{ kind: RECORD_KIND.FINDING_REPORT, persona: e.author, round: 1, finding: f, provision: supplied.note, ...(rev.reason ? { reason: rev.reason } : {}) }],
        rule: "the author revises or confirms this one finding, in one finding-report holding exactly that finding" } };
    }
    if (rev.st === ABSTAINED) continue;
    const revised = rev.reply.findings[0];
    if (revised.need_info) continue;
    Object.assign(e, { authored_severity: revised.proposed_severity, locator: revised.locator, pull_quote: revised.pull_quote,
      evidence: revised.evidence, confidence_on_hand: revised.confidence_on_hand, need_info: false });
    delete e.need_info_reasons;
    if (!e.evidence.length) e.unsupported = true;
    const gr = group(evs, PHASE.NEED_INFO, active.filter((p) => p !== e.author).map((p) => ({ persona: p, round: 2, finding: f, ballot: [f] })));
    a = outstanding(gr, PHASE.NEED_INFO, ctx, { register: [publicEntry(e)] });
    if (a) return { action: a };
    votes = votes.filter((v) => v.finding !== f).concat([...gr.replies].flatMap(([p, rep]) => rep.votes.filter((v) => v.finding === f).map((v) => ({ voter: p, ...v }))));
    routes.delete(f);
  }

  // Stage 4 — the count.
  const final = count(entries, votes);
  for (const [f, rs] of final.raised) {
    const e = entries.find((x) => x.id === f);
    e.need_info = true;
    e.need_info_reasons = [...(e.need_info_reasons ?? []), ...rs];
  }
  const held = final.rows.filter((r) => r.status === TALLY_STATUS.HELD).map((r) => {
    const e = entries.find((x) => x.id === r.finding);
    return { finding: r.finding, reasons: e.need_info_reasons, route: routes.get(r.finding)?.route ?? HELD_ROUTE.OPERATOR };
  });
  const notes = sideNotes(final.rows, rows.filter((r) => r.seated));
  return { board: { ...base, active, finals, voteReplies: gv.replies, entries, tally: final.rows, held, notes } };
}

const publicEntry = (e) => ({ id: e.id, author: e.author, lens: e.lens, authored_severity: e.authored_severity, locator: e.locator, pull_quote: e.pull_quote });

/* ── modes ───────────────────────────────────────────────────────────────── */

/** derive(log) → { action, boards, ... }: where the run stands and what is next. */
export function derive(log) {
  return log.mode === RUN_MODE.REVIEW ? deriveReview(log) : deriveLifecycle(log);
}

function deriveReview(log) {
  const b = board(log, {});
  if (b.action) return { action: b.action };
  const B = b.board;
  if (B.aborted) return { action: { action: ACTION.DONE, aborted: true, reason: B.afterEvidence ? "fewer than three joiners passed the evidence check" : "fewer than three joiners after one re-ask (I3)" }, board: B };
  const evs = log.events;
  const conflicts = lastAnswer(evs, TOPIC.CONFLICTS);
  if (!conflicts) {
    return { action: { action: ACTION.PROVIDE, phase: PHASE.CONFLICTS, topic: TOPIC.CONFLICTS, register: B.entries.map(publicEntry), tally: B.tally,
      rule: "Phase 3: genuine conflicts only, framed as Cn and sent to advisor() once; [] when there are none. Rulings never change counted severity." } };
  }
  const ranking = lastAnswer(evs, TOPIC.RANKING);
  if (!ranking) {
    const eligible = rankable(B.entries, B.tally).map((id) => ({ ...publicEntry(B.entries.find((e) => e.id === id)), ...pick(B.tally.find((r) => r.finding === id), ["final_severity", "convergence", "status"]) }));
    return { action: { action: ACTION.PROVIDE, phase: PHASE.RANK, topic: TOPIC.RANKING, eligible,
      rule: "Phase 4: up to five, in rank order, scored on cost, value, constitutional ROI (only with an addendum's principles) and convergence. Give scores only; the script copies quote, locator and severity." } };
  }
  const signoff = lastAnswer(evs, TOPIC.SIGNOFF);
  if (!signoff?.tldr || !signoff?.baseline) {
    return { action: { action: ACTION.PROVIDE, phase: PHASE.SIGNOFF, topic: TOPIC.SIGNOFF, needs: ["tldr", "baseline"],
      rule: "Phase 5: three TL;DR sentences (found; top five; which 🔴 block rollout) and the baseline for the next round." } };
  }
  return { action: { action: ACTION.DONE }, board: B, conflicts, ranking, signoff };
}

/** A gate records the same quorum branch under its own names (vocab: review_quorum vs gate_quorum). */
const GATE_QUORUM_OF = { [REVIEW_QUORUM.PROCEED]: GATE_QUORUM.OK, [REVIEW_QUORUM.RE_ASKED_PROCEED]: GATE_QUORUM.RE_PINGED, [REVIEW_QUORUM.ABORTED]: GATE_QUORUM.ABORTED };

const GATES = { [RUN_MODE.SDLC]: [GATE.A, GATE.B, GATE.C], [RUN_MODE.CHALLENGE]: [GATE.CHALLENGE] };
const PREMISE_GATES = [GATE.A, GATE.CHALLENGE];

function deriveLifecycle(log) {
  const cycles = [];
  const evs = log.events;
  const at = (gate, cycle) => evs.filter((e) => e.gate === gate && e.cycle === cycle);
  let halted = null;
  for (const gate of GATES[log.mode]) {
    if (log.mode === RUN_MODE.SDLC) {
      const done = answersOf(evs.filter((e) => e.gate === gate && e.cycle === undefined), TOPIC.SKILL_DONE).some((x) => x.skill === BEFORE_GATE[gate]);
      if (!done) return { action: { action: ACTION.RUN_SKILL, phase: PHASE.SPECKIT, gate, skill: BEFORE_GATE[gate], topic: TOPIC.SKILL_DONE }, cycles };
    }
    for (let cycle = 1; cycle <= CYCLE_BOUND; cycle++) {
      const ctx = { gate, cycle };
      const b = board(log, ctx);
      if (b.action) return { action: b.action, cycles };
      const B = b.board;
      const entry = { gate, cycle, board: B };
      cycles.push(entry);
      if (B.aborted) { entry.result = GATE_RESULT.ABORTED; halted = "quorum not met"; break; }
      if (PREMISE_GATES.includes(gate)) {
        entry.premise = lastAnswer(at(gate, cycle), TOPIC.PREMISE_PASS);
        if (!entry.premise) {
          return { action: { action: ACTION.PROVIDE, phase: PHASE.PREMISE, ...ctxOf(ctx), topic: TOPIC.PREMISE_PASS,
            rule: "chorus-sdlc § Gate A — premise pass: the RT-1..RT-6 outcomes and the honest-null, from the panel's own reports." } };
        }
      }
      const gating = gatingSet(B.tally);
      entry.gating = gating;
      entry.result = gateOutcome(cycle, gating);
      if (entry.result === GATE_RESULT.PASS) break;
      if (entry.result === GATE_RESULT.SELF_HEAL) {
        entry.incorporated = lastAnswer(at(gate, cycle), TOPIC.INCORPORATED);
        if (!entry.incorporated) {
          return { action: { action: ACTION.INCORPORATE, phase: PHASE.INCORPORATE, ...ctxOf(ctx), topic: TOPIC.INCORPORATED, skills: CASCADE[gate] ?? [], findings: gating,
            rule: "S5: revise the spec and regenerate downstream through speckit; never hand-patch. The gate then re-runs." } };
        }
        continue;
      }
      // bound reached: the operator rules (S7, D2); a waiver is never applied automatically.
      entry.ruling = lastAnswer(at(gate, cycle), TOPIC.OPERATOR_RULING);
      if (!entry.ruling) {
        return { action: { action: ACTION.ASK_OPERATOR, phase: PHASE.INCORPORATE, ...ctxOf(ctx), topic: TOPIC.OPERATOR_RULING, findings: gating, band: SEVERITY.RED,
          rule: "S7: three cycles left these 🔴 uncleared. A blocking question: waive each (with rationale) or leave it open, which halts the run." } };
      }
      const open = entry.ruling.findings.filter((x) => x.disposition !== RED_DISPOSITION.WAIVED);
      if (open.length || gating.some((f) => !entry.ruling.findings.some((x) => x.finding === f))) halted = "operator left a 🔴 open";
      break;
    }
    if (halted) return { action: { action: ACTION.HALT, reason: halted }, cycles, halted };
  }
  if (log.mode === RUN_MODE.SDLC) {
    const last = cycles.filter((c) => c.gate === GATE.C).at(-1).board;
    const seated = last.rows.filter((r) => r.seated).map((r) => r.persona);
    const mem = evs.filter((e) => e.gate === undefined);
    const gm = group(mem, PHASE.MEMORY, seated.map((p) => ({ persona: p })));
    const a = outstanding(gm, PHASE.MEMORY, {}, { rule: "Each seated lens updates its own .claude/agent-memory/<persona>/ record; the secret pre-filter runs first." });
    if (a) return { action: a, cycles };
    const memory = lastAnswer(mem, TOPIC.MEMORY_UPDATE);
    if (!memory) return { action: { action: ACTION.PROVIDE, phase: PHASE.MEMORY, topic: TOPIC.MEMORY_UPDATE, personas: seated }, cycles };
    const signoff = lastAnswer(mem, TOPIC.SIGNOFF);
    if (!signoff) {
      return { action: { action: ACTION.ASK_OPERATOR, phase: PHASE.SIGNOFF, topic: TOPIC.SIGNOFF, band: SEVERITY.RED,
        rule: "Catalog row 11: final sign-off is always the operator's." }, cycles, memory };
    }
    return { action: { action: ACTION.DONE }, cycles, memory, signoff };
  }
  return { action: { action: ACTION.DONE }, cycles };
}

const pick = (o, keys) => Object.fromEntries(keys.filter((k) => o?.[k] !== undefined).map((k) => [k, o[k]]));

/* ── record assembly ─────────────────────────────────────────────────────── */

/** Recoveries from the log: one retry per (persona, phase, round) that failed once, one abstention per failure-rule ABSTAIN. */
function recoveriesOf(evs, rows) {
  const out = [];
  const seen = new Set();
  for (const e of evs.filter((x) => x.type === EVENT.FAILURE && x.failure !== FAILURE.NOT_INSTALLED)) {
    const phase = `${e.phase}${roundOf(e) > 1 ? `-${roundOf(e)}` : ""}${e.finding ? `-${e.finding}` : ""}`;
    const k = `${e.persona}@${phase}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ kind: RECOVERY.RETRY, subject: e.persona, phase, reason: e.reason });
  }
  for (const r of rows.filter((x) => x.failure)) out.push({ kind: RECOVERY.ABSTENTION, subject: r.persona, reason: r.reason });
  return out;
}

function seatingDecision(id, B, date) {
  const tie = B.seating.band === SEATING_BAND.YELLOW;
  const seated = B.rows.filter((r) => r.seated).map((r) => r.persona);
  return {
    id, point: tie ? "RSVP seating — tie at the cap" : "RSVP seating — clean two-axis sort", catalog_row: tie ? 2 : 1, band: tie ? SEVERITY.YELLOW : SEVERITY.GREEN,
    title: tie ? "Seating tie at the fifth seat: default panel seated" : "More than five joined: seated by the two-axis sort",
    problem: `${B.seating.joiners} personas joined for five ordinary seats; the two-axis signal (cited deltas, then expected stakes) ${tie ? "ties across the fifth seat" : "orders them strictly"}.`,
    sensor: { signal: "strict order at the cap boundary (DECISION-PRIMITIVE.md § Seating)", evidence: seated, reading: tie ? "tie" : "strict" },
    evidence: [{ kind: DECISION_EVIDENCE.RUN, ref: "conduct.mjs seat()" }],
    solutions: [{ id: "sorted-panel", label: "Seat the sorted panel", recommended: true, summary: `Seat ${seated.join(", ")}.`, cost: { work: "none" } },
      ...(tie ? [{ id: "swap-seat", label: "Swap a tied seat", summary: "Re-seat one tied persona in place of another and re-run the board.", cost: { work: "re-run the board" } }] : [])],
    resolution: tie ? DECISION_RESOLUTION.DEFAULT_APPLIED : DECISION_RESOLUTION.AUTO_RESOLVED,
    ...(tie ? { override: { how: "Name the tied persona to seat instead; the board re-runs.", cost: "one board re-run" } } : {}),
    status: DECISION_STATUS.COMPLETE, decision: { chose: "sorted-panel", date },
  };
}

function selfHealDecision(gate, cycle, gating, incorporated, date) {
  return {
    id: `${gate}-self-heal-${cycle}`, point: "Gating 🔴 finding", catalog_row: 5, band: SEVERITY.YELLOW,
    title: `Gate ${gate}, cycle ${cycle}: incorporate the gating 🔴 and re-run`,
    problem: `The tally left ${gating.join(", ")} gating at cycle ${cycle} of ${CYCLE_BOUND}; below the bound the default is to incorporate through speckit and re-run the gate.`,
    sensor: { signal: "cycle < 3 (DECISION-PRIMITIVE.md § The self-heal loop)", evidence: gating, reading: `cycle ${cycle}` },
    evidence: gating.map((f) => ({ kind: DECISION_EVIDENCE.FINDING, ref: f })),
    solutions: [{ id: "incorporate", label: "Incorporate and re-run", recommended: true, summary: incorporated.detail, cost: { work: incorporated.skills.join(" → ") } },
      { id: "waive", label: "Waive", summary: "The operator waives the 🔴 with a recorded rationale.", cost: { work: "an operator ruling", risk: "a real concern ships" } }],
    resolution: DECISION_RESOLUTION.IN_PROGRESS, cycle,
    override: { how: "Rule a waiver for the finding instead; the gate passes on the ruling.", cost: "the concern ships unresolved" },
    status: DECISION_STATUS.COMPLETE, decision: { chose: "incorporate", date },
  };
}

function assembleReview(log) {
  const d = derive(log);
  if (d.action.action !== ACTION.DONE) throw new Error(`the run is not finished: next action is ${d.action.action}`);
  const h = log.header, B = d.board;
  const decisions = [];
  if (B.seating.joiners > SEAT_CAP) decisions.push(seatingDecision("seating-1", B, h.date));
  const byId = new Map(B.entries.map((e) => [e.id, e]));
  const tallyBy = new Map(B.tally.map((r) => [r.finding, r]));
  const quorum = { joiners: B.rows.filter((r) => r.decision === RSVP.JOIN).length,
    branch: B.aborted ? REVIEW_QUORUM.ABORTED : B.quorum };
  const rec = {
    kind: RECORD_KIND.REVIEW_RECORD, schema_version: SCHEMA_VERSION, date: h.date, target: h.target, mode: h.review_mode, round_context: h.round_context,
    bindings: { ports: h.bindings.ports, recoveries: recoveriesOf(log.events, B.rows) },
    secret_filter: d.signoff?.secret_filter ?? { ran: false, note: "No memory writes went through the conductor this round." },
    ...(d.signoff?.baseline_ref ? { baseline_ref: d.signoff.baseline_ref } : {}),
    tldr: d.signoff?.tldr ?? abortedTldr(B),
    roster: B.rows,
    quorum,
    ...(decisions.length ? { seating_decision: decisions[0].id } : {}),
    register: B.entries,
    tally: B.tally,
    conflicts: d.conflicts ?? [],
    top_five: (d.ranking ?? []).map((t, i) => {
      const e = byId.get(t.finding), r = tallyBy.get(t.finding);
      return { rank: i + 1, finding: t.finding, pull_quote: e?.pull_quote, locator: e?.locator, final_severity: r?.final_severity,
        cost: t.cost, value: t.value, ...pick(t, ["constitutional_roi"]), convergence: r?.convergence ?? 0, ...pick(t, ["arbiter_note"]) };
    }),
    held: B.held,
    baseline: d.signoff?.baseline ?? { assume_closed: [], in_progress: [], re_evaluate: [] },
    appendix: B.rows.filter((r) => r.seated).map((r) => ({ persona: r.persona, reports: [`${h.dir}/${h.stem}.run.json`] })),
    ...(decisions.length ? { decisions } : {}),
    ...(B.notes.length ? { side_notes: B.notes } : {}),
  };
  return rec;
}

const abortedTldr = (B) => [
  `The round aborted: ${B.rows.filter((r) => r.decision === RSVP.JOIN).length} joiners, fewer than the quorum of ${QUORUM}.`,
  "No findings were registered, voted on or ranked.",
  "No 🔴 findings: nothing was reviewed; revisit at the next cadence.",
];

function assembleLifecycle(log) {
  const d = derive(log);
  if (![ACTION.DONE, ACTION.HALT].includes(d.action.action)) throw new Error(`the run is not finished: next action is ${d.action.action}`);
  const h = log.header;
  const decisions = [], localRulings = [];
  const gates = d.cycles.map((c) => {
    const B = c.board;
    const g = {
      gate: c.gate, name: GATE_NAME_OF[c.gate], cycle: c.cycle, corpus: h.corpus ?? [h.target],
      rsvp: B.rows,
      seating: { band: B.seating.band },
      quorum: B.aborted ? GATE_QUORUM.ABORTED : GATE_QUORUM_OF[B.quorum],
      ...(c.premise ? { premise_pass: c.premise } : {}),
      register: B.entries.map((e) => (c.gate === GATE.A && e.scope === SCOPE.WITHIN_FRAME ? { ...e, parked: true } : e)),
      tally: B.tally,
      red_resolutions: [],
      ...(B.notes.length ? { side_notes: B.notes } : {}),
      outcome: { result: c.result },
    };
    if (B.seating.joiners > SEAT_CAP) {
      const dec = seatingDecision(`${c.gate}-seating-${c.cycle}`, B, h.date);
      decisions.push(dec);
      if (B.seating.band === SEATING_BAND.YELLOW) g.seating.decision_ref = dec.id;
    }
    if (c.result === GATE_RESULT.SELF_HEAL) {
      g.red_resolutions = c.gating.map((f) => ({ finding: f, disposition: RED_DISPOSITION.RESOLVED, detail: c.incorporated.detail }));
      decisions.push(selfHealDecision(c.gate, c.cycle, c.gating, c.incorporated, h.date));
    }
    if (c.result === GATE_RESULT.BOUND_REACHED) {
      const cite = c.ruling.ruling_ref ?? (c.ruling.local_ruling ? { id: c.ruling.local_ruling.id, record: "#" } : undefined);
      if (c.ruling.local_ruling) localRulings.push(c.ruling.local_ruling);
      g.red_resolutions = c.gating.map((f) => {
        const x = c.ruling.findings.find((y) => y.finding === f);
        return { finding: f, disposition: x?.disposition ?? RED_DISPOSITION.OPEN, detail: x?.detail ?? "not ruled", ...(cite ? { ruling_ref: cite } : {}) };
      });
      const open = g.red_resolutions.filter((r) => r.disposition !== RED_DISPOSITION.WAIVED).map((r) => r.finding);
      if (open.length) g.outcome.awaiting = open;
    }
    return g;
  });
  const complete = d.action.action === ACTION.DONE;
  const rec = {
    kind: RECORD_KIND.SDLC_LOG, schema_version: SCHEMA_VERSION, feature: h.feature ?? h.target, feature_dir: h.dir, run_started: h.date,
    mode: log.mode === RUN_MODE.CHALLENGE ? SDLC_MODE.CHALLENGE : SDLC_MODE.AGENT_SDLC,
    status: complete ? SDLC_STATUS.COMPLETE : SDLC_STATUS.HALTED_AWAITING_OPERATOR,
    gates, decisions,
    ...(d.memory ? { memory_update: d.memory } : {}),
    self_audit: complete ? selfAudit(log, d) : [],
    ...(localRulings.length ? { local_rulings: localRulings } : {}),
  };
  return rec;
}

/** The S1–S11 self-audit, from what the log shows. */
function selfAudit(log, d) {
  const evs = log.events;
  const gates = new Set(d.cycles.map((c) => `${c.gate}#${c.cycle}`));
  const rsvpPerGate = [...gates].every((k) => evs.some((e) => e.phase === PHASE.RSVP && `${e.gate}#${e.cycle}` === k));
  const incorporations = answersOf(evs, TOPIC.INCORPORATED);
  const maxCycle = Math.max(...d.cycles.map((c) => c.cycle));
  const passedOpen = d.cycles.filter((c) => c.result === GATE_RESULT.PASS && c.gating.length);
  const unsupportedCounted = d.cycles.flatMap((c) => c.board.entries.filter((e) => e.unsupported && c.board.tally.some((r) => r.finding === e.id)));
  const heldCounted = d.cycles.flatMap((c) => c.board.tally.filter((r) => r.status === TALLY_STATUS.HELD && r.final_severity !== undefined));
  const gateQs = answersOf(evs, TOPIC.GATE_ANSWERS).length;
  const ownVotes = d.cycles.flatMap((c) => [...(c.board.voteReplies ?? new Map())].flatMap(([p, rep]) => rep.votes.filter((v) => c.board.entries.find((e) => e.id === v.finding)?.author === p)));
  const rule = VOCAB.sdlc_rule;
  return [
    { rule: rule[0], pass: true, evidence: `${incorporations.length} incorporation(s), each through a speckit cascade; the conductor authored no artefact.` },
    { rule: rule[1], pass: rsvpPerGate, evidence: `RSVP logged at each of ${gates.size} gate cycle(s).` },
    { rule: rule[2], pass: d.cycles.every((c) => c.board.rows.filter((r) => r.seat === SEAT.ORDINARY).length <= SEAT_CAP), evidence: "Seated by engine.seat(): cap of five ordinary seats, exceptional entries by distinct cited delta." },
    { rule: rule[3], pass: passedOpen.length === 0, evidence: passedOpen.length ? `passed with open 🔴 at ${passedOpen.map((c) => `${c.gate}#${c.cycle}`).join(", ")}` : "No gate passed with a gating 🔴." },
    { rule: rule[4], pass: incorporations.every((x) => x.skills.every((s) => s.startsWith("speckit-"))), evidence: "Every incorporation ran speckit skills only." },
    { rule: rule[5], pass: unsupportedCounted.length === 0, evidence: "Findings without evidence were registered unsupported and left out of the count." },
    { rule: rule[6], pass: maxCycle <= CYCLE_BOUND, evidence: `Most cycles at one gate: ${maxCycle} of ${CYCLE_BOUND}.` },
    { rule: rule[7], pass: ownVotes.length === 0, evidence: "Every ballot excluded the voter's own findings; no own-finding vote was logged." },
    { rule: rule[8], pass: true, evidence: "Every counted vote is a logged, validated vote-report from a dispatched persona." },
    { rule: rule[9], pass: true, evidence: `${gateQs} gate-question answer(s) from the operator; no finding was authored past an open gate.` },
    { rule: rule[10], pass: heldCounted.length === 0, evidence: "Held findings carry no post-tally severity." },
  ];
}

export function assemble(log) {
  return log.mode === RUN_MODE.REVIEW ? assembleReview(log) : assembleLifecycle(log);
}

/* ── submissions: the trust boundary between the agent and the run ──────── */

/** The ask in the current action for this persona, or null. */
function askFor(action, persona) {
  if (![ACTION.DISPATCH, ACTION.RETRY].includes(action.action)) return null;
  return action.asks.find((a) => a.persona === persona) ?? null;
}

const failureKind = (errors) =>
  errors.some((e) => /tool_uses/.test(e.path) || /zero tool uses/.test(e.message)) ? FAILURE.NO_EVIDENCE
    : errors.some((e) => /words; the limit is/.test(e.message)) ? FAILURE.OVER_LENGTH : FAILURE.MALFORMED;

/** Checks a schema cannot make: identity, the ballot (S8), declared confidence (S11), the need-info shape. */
function contractErrors(action, ask, persona, data) {
  const errs = [];
  if (data.persona !== persona) errs.push(`the reply is signed by "${data.persona}", not "${persona}"`);
  if (ask.kind === RECORD_KIND.VOTE_REPORT) {
    const allowed = new Set(ask.ballot);
    for (const v of data.votes) {
      if (!allowed.has(v.finding)) errs.push(`votes on "${v.finding}", which is not on its ballot (S8: never its own finding; only supported, graded findings)`);
      if (v.confidence_on_hand === CONFIDENCE.LOW && v.vote !== VOTE.NEED_INFO) errs.push(`a low-confidence vote on "${v.finding}" must be NEED_INFO (S11)`);
    }
    if (action.phase === PHASE.NEED_INFO && (data.votes.length !== 1 || data.derived.length)) errs.push("a re-vote holds exactly one vote, on the held finding, and derives nothing");
  }
  if (ask.kind === RECORD_KIND.FINDING_REPORT && action.phase === PHASE.NEED_INFO && data.findings.length !== 1) errs.push("a revision holds exactly the one held finding");
  return errs;
}

function appendTo(file, log, event) {
  log.events.push(event);
  const r = validate(RECORD_KIND.RUN_LOG, log);
  if (!r.valid) throw new Error(`refusing to write an invalid run log: ${r.errors.map((e) => `${e.path}: ${e.message}`).join("; ")}`);
  writeFileSync(file, JSON.stringify(log, null, 2) + "\n");
}

const eventCtx = (action, ask) => ({ phase: action.phase, ...pick(action, ["gate", "cycle"]), ...(ask && (ask.round ?? 1) > 1 ? { round: ask.round } : {}), ...(ask?.finding ? { finding: ask.finding } : {}) });

export function submit(file, log, persona, data) {
  const { action } = derive(log);
  const ask = askFor(action, persona);
  if (!ask || !ask.kind) return { exit: 2, message: `nothing asks ${persona} for a reply now; the next action is ${action.action}${action.phase ? ` (${action.phase})` : ""}` };
  const r = validate(ask.kind, data);
  if (r.reason === "version mismatch") return { exit: 3, message: `version mismatch: ${r.errors[0].message}. Install drift: reported once, not charged to ${persona}.` };
  const errs = r.valid ? contractErrors(action, ask, persona, data) : [];
  if (!r.valid || errs.length) {
    const reason = (r.valid ? errs : r.errors.slice(0, 3).map((e) => `${e.path}: ${e.message}`)).join("; ");
    appendTo(file, log, { type: EVENT.FAILURE, ...eventCtx(action, ask), persona, failure: r.valid ? FAILURE.MALFORMED : failureKind(r.errors), reason });
    return { exit: 1, message: `${persona}: refused — ${reason}` };
  }
  appendTo(file, log, { type: EVENT.REPLY, ...eventCtx(action, ask), persona, data });
  return { exit: 0, message: `${persona}: ${ask.kind} logged` };
}

export function fail(file, log, persona, failure, reason) {
  const { action } = derive(log);
  const ask = askFor(action, persona);
  if (!ask) return { exit: 2, message: `nothing asks ${persona} for anything now` };
  if (!VOCAB.failure.includes(failure)) return { exit: 2, message: `unknown failure "${failure}"; one of: ${VOCAB.failure.join(", ")}` };
  appendTo(file, log, { type: EVENT.FAILURE, ...eventCtx(action, ask), persona, failure, reason });
  return { exit: 0, message: `${persona}: ${failure} logged` };
}

export function ack(file, log, persona) {
  const { action } = derive(log);
  const ask = askFor(action, persona);
  if (!ask || ask.kind) return { exit: 2, message: `nothing asks ${persona} for an acknowledgement now` };
  appendTo(file, log, { type: EVENT.ACK, ...eventCtx(action, ask), persona });
  return { exit: 0, message: `${persona}: ${action.phase} done` };
}

export function answer(file, log, topic, data) {
  const { action } = derive(log);
  if (action.topic !== topic) return { exit: 2, message: `the current action does not ask for "${topic}"; it is ${action.action}${action.topic ? ` (${action.topic})` : ""}` };
  const errors = conforms(ANSWER_SCHEMA[topic], data);
  if (topic === TOPIC.GATE_ANSWERS && !errors.length && !action.questions.some((q) => q.persona === data.persona && q.round === data.round)) {
    errors.push({ path: "persona", message: `no open gate questions from ${data.persona} at round ${data.round}` });
  }
  if (topic === TOPIC.PROVISION && !errors.length && (data.finding !== action.finding || data.route !== action.route)) {
    errors.push({ path: "finding", message: `the action asks for ${action.route} provision on ${action.finding}` });
  }
  if (topic === TOPIC.OPERATOR_RULING && !errors.length) {
    if (data.local_ruling && data.ruling_ref && data.ruling_ref.record !== "#") errors.push({ path: "ruling_ref", message: "a local ruling is cited as record \"#\"" });
    if (data.findings.some((x) => x.disposition === RED_DISPOSITION.WAIVED) && !data.ruling_ref && !data.local_ruling) errors.push({ path: "ruling_ref", message: "a waiver cites the operator's ruling (S4, D2): give ruling_ref, or local_ruling when no decision sink is bound" });
  }
  if (topic === TOPIC.RANKING && !errors.length) {
    const ok = new Set(action.eligible.map((e) => e.id));
    data.forEach((t, i) => { if (!ok.has(t.finding)) errors.push({ path: `[${i}]`, message: `"${t.finding}" is not rankable (held, minority report, unsupported or unknown)` }); });
  }
  if (errors.length) return { exit: 1, message: `refused: ${errors.map((e) => `${e.path}: ${e.message}`).join("; ")}` };
  appendTo(file, log, { type: EVENT.ANSWER, phase: action.phase, ...pick(action, ["gate", "cycle"]), topic, data });
  return { exit: 0, message: `${topic} logged` };
}

/* ── init ────────────────────────────────────────────────────────────────── */

/** The lowest free stem: <base>, else <base>-2, -3, … when any <stem>* file exists. */
export function freeStem(dir, base) {
  const taken = (s) => existsSync(dir) && readdirSync(dir).some((f) => f.startsWith(s) && (f === s || /^[.]/.test(f.slice(s.length))));
  if (!taken(base)) return base;
  for (let n = 2; ; n++) if (!taken(`${base}-${n}`)) return `${base}-${n}`;
}

export function initLog(mode, opts) {
  const roster = (opts.roster ?? VOCAB.roster.filter((p) => opts.python || !OPTIONAL_LENSES.includes(p))).map((p) => ({ persona: p, lens: LENS_OF[p] ?? "unlisted lens" }));
  const header = { date: opts.date, target: opts.target ?? opts.feature, dir: opts.dir, stem: opts.stem, roster, bindings: opts.bindings };
  if (mode === RUN_MODE.REVIEW) Object.assign(header, { review_mode: opts.pr ? REVIEW_MODE.PR_DESIGN : REVIEW_MODE.PROJECT_STATE, round_context: opts.context });
  if (mode !== RUN_MODE.REVIEW) Object.assign(header, { corpus: opts.corpus ?? [opts.target ?? opts.feature] });
  if (mode === RUN_MODE.SDLC) header.feature = opts.feature;
  const log = { kind: RECORD_KIND.RUN_LOG, schema_version: SCHEMA_VERSION, mode, header, events: [] };
  const r = validate(RECORD_KIND.RUN_LOG, log);
  if (!r.valid) throw new Error(r.errors.map((e) => `${e.path}: ${e.message}${e.hint ? ` (${e.hint})` : ""}`).join("\n"));
  return log;
}

/* ── CLI ─────────────────────────────────────────────────────────────────── */

function flags(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { out._.push(a); continue; }
    const k = a.slice(2);
    if (k === "python") out.python = true;
    else out[k] = argv[++i];
  }
  return out;
}

const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
const today = () => new Date().toISOString().slice(0, 10);
const text = (v) => (v?.startsWith("@") ? readFileSync(v.slice(1), "utf8").trim() : v);

function usage(msg) {
  if (msg) process.stderr.write(`${msg}\n`);
  process.stderr.write("usage: conduct init <review|sdlc|challenge> … | next|status|record <run.json> | submit <run.json> <persona> <reply.json> | fail <run.json> <persona> <failure> <reason> | ack <run.json> <persona> | answer <run.json> <topic> <data.json>\n");
  process.exit(2);
}

function main(argv) {
  const [cmd, ...rest] = argv;
  const f = flags(rest);
  if (cmd === "init") {
    const mode = f._[0];
    if (!VOCAB.run_mode.includes(mode)) usage(`init needs a mode: ${VOCAB.run_mode.join(", ")}`);
    const date = f.date ?? today();
    const opts = { date, target: f.target, feature: f.feature, pr: f.pr, python: f.python, context: text(f.context),
      roster: f.roster?.split(",").filter(Boolean), corpus: f.corpus?.split(",").filter(Boolean), bindings: bindings().block };
    if (mode === RUN_MODE.SDLC) {
      if (!f.feature) usage("init sdlc needs --feature");
      Object.assign(opts, { dir: f.dir ?? `specs/${f.feature}`, stem: "agent-sdlc-log" });
    } else {
      if (!f.target) usage(`init ${mode} needs --target`);
      if (mode === RUN_MODE.REVIEW && !opts.context) usage("init review needs --context (the round's concrete deltas)");
      opts.dir = f.dir ?? "docs/reviews";
      opts.stem = freeStem(opts.dir, `${date}-chorus-${mode === RUN_MODE.REVIEW ? "review" : "challenge"}${f.pr ? `-pr${f.pr}` : ""}`);
    }
    const log = initLog(mode, opts);
    const file = join(opts.dir, `${opts.stem}.run.json`);
    if (existsSync(file)) usage(`${file} exists; continue it with: conduct next ${file}`);
    mkdirSync(opts.dir, { recursive: true });
    writeFileSync(file, JSON.stringify(log, null, 2) + "\n");
    process.stdout.write(`${file}\n`);
    return 0;
  }
  const file = f._[0];
  if (!file) usage();
  let log;
  try { log = readJson(file); } catch (e) { usage(`cannot read ${file}: ${e.message}`); }
  const shape = validate(RECORD_KIND.RUN_LOG, log);
  if (!shape.valid) usage(`${file} is not a valid run log: ${shape.errors.map((e) => `${e.path}: ${e.message}`).join("; ")}`);
  const say = (r) => { (r.exit === 0 ? process.stdout : process.stderr).write(`${r.message}\n`); return r.exit; };
  const input = (path) => { try { return readJson(path); } catch (e) { return usage(`cannot read ${path}: ${e.message}`); } };
  // CLI verbs are their own vocabulary; keys here, never compared as strings.
  const COMMANDS = {
    next: () => { process.stdout.write(JSON.stringify(derive(log).action, null, 2) + "\n"); return 0; },
    status: () => {
      const d = derive(log);
      process.stdout.write(`${log.mode} · ${log.header.target} · ${log.events.length} event(s) · next: ${d.action.action}${d.action.phase ? ` (${d.action.phase})` : ""}\n`);
      return 0;
    },
    submit: ([persona, reply]) => (persona && reply ? say(submit(file, log, persona, input(reply))) : usage()),
    fail: ([persona, failure, ...why]) => (persona && failure && why.length ? say(fail(file, log, persona, failure, why.join(" "))) : usage()),
    ack: ([persona]) => (persona ? say(ack(file, log, persona)) : usage()),
    answer: ([topic, data]) => {
      if (!VOCAB.answer_topic.includes(topic) || !data) usage(`answer needs a topic (${VOCAB.answer_topic.join(", ")}) and a JSON file`);
      return say(answer(file, log, topic, input(data)));
    },
    record: () => {
      let rec;
      try { rec = assemble(log); } catch (e) { process.stderr.write(`${e.message}\n`); return 2; }
      const r = validate(rec.kind, rec, { file });
      if (!r.valid) {
        process.stderr.write(`the assembled ${rec.kind} is invalid — not written:\n${r.errors.map((e) => `  ✗ ${e.path}: ${e.message}`).join("\n")}\n`);
        return 1;
      }
      const out = join(dirname(file), log.header.stem);
      writeFileSync(`${out}.json`, JSON.stringify(rec, null, 2) + "\n");
      writeFileSync(`${out}.md`, render(rec.kind, rec, { file: `${out}.json` }));
      process.stdout.write(`${out}.json\n${out}.md\n`);
      return 0;
    },
  };
  if (!Object.hasOwn(COMMANDS, cmd)) usage(cmd ? `unknown command "${cmd}"` : undefined);
  return COMMANDS[cmd](f._.slice(1));
}

const invoked = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (invoked) process.exit(main(process.argv.slice(2)));
