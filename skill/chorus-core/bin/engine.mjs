/**
 * The mechanical rules of a chorus board, as pure functions: no I/O, no clock,
 * no model. The canon defines each rule once; each function names the section
 * it implements. conduct.mjs composes them; validate.mjs re-checks their output.
 *
 * Zero dependencies; Node 20+.
 */

import {
  FINAL_SEVERITY, NEED_INFO_STAGE, GATE, GATE_RESULT, HELD_ROUTE, MOVEMENT, RSVP, SEAT, SEATING_BAND,
  SEVERITY, SEVERITY_LADDER, SIDE_NOTE, SPECKIT, TALLY_STATUS, VOTE,
} from "./vocab.mjs";

/** Ordinary seats per board (DECISION-PRIMITIVE.md § Seating). */
export const SEAT_CAP = 5;
/** Fewest joiners a board runs with (I3). */
export const QUORUM = 3;
/** Gate cycles before the bound (S7). */
export const CYCLE_BOUND = 3;
/** Retries a failed persona reply gets before it counts as ABSTAIN (CONDUCTOR.md § Ports). */
export const RETRIES = 1;

/* ── Stage 4 (GATE-PRIMITIVE.md § Stage 4) ───────────────────────────────── */

/** The Stage-4 rule. Returns what a tally row must say. */
export function tally(authored, n, p, c, o) {
  const net = p - o;
  const threshold = Math.max(1, Math.floor(n / 2));
  const voted = p + c + o;
  const i = SEVERITY_LADDER.indexOf(authored);
  let final = authored, movement;
  if (voted === 0) movement = MOVEMENT.UNVOTED;
  else if (net >= threshold) { movement = MOVEMENT.ESCALATE; final = SEVERITY_LADDER[Math.min(2, i + 1)]; }
  else if (net <= -threshold) { movement = MOVEMENT.DEMOTE; final = i === 0 ? FINAL_SEVERITY.DROPPED : SEVERITY_LADDER[i - 1]; }
  else movement = c > 0 ? MOVEMENT.AGREED : MOVEMENT.UNMOVED;
  return { net, threshold, final_severity: final, movement, convergence: p + c, gating: final === SEVERITY.RED, status: voted === 0 ? TALLY_STATUS.UNVOTED : TALLY_STATUS.GRADED };
}

/* ── Seating (DECISION-PRIMITIVE.md § Seating, § The RSVP signal) ────────── */

const stakesRank = (r) => SEVERITY_LADDER.indexOf(r.expected?.stakes ?? r.expected) + 1;
/** The two-axis sort key: count of cited deltas, then expected stakes. Higher seats first. */
const signal = (r) => [(r.applies ?? []).length, stakesRank(r)];
const cmp = (a, b) => b[0] - a[0] || b[1] - a[1];

/**
 * Seat a board from RSVP rows ({persona, decision, applies, expected, uncovered_delta, failure?}).
 * Returns { rows (each with seated/seat), band, joiners, tie }. Roster order breaks
 * nothing: a tie spanning the fifth seat is band 🟡 and seats the roster-order
 * default, recorded for async override (catalog row 2).
 */
export function seat(replies) {
  const rows = replies.map((r) => ({ ...r, seated: false }));
  const joins = rows.filter((r) => r.decision === RSVP.JOIN);
  let band = SEATING_BAND.GREEN, tie = false;
  let seatedJoins = joins;
  if (joins.length > SEAT_CAP) {
    const sorted = [...joins].sort((a, b) => cmp(signal(a), signal(b)));
    tie = cmp(signal(sorted[SEAT_CAP - 1]), signal(sorted[SEAT_CAP])) === 0;
    if (tie) band = SEATING_BAND.YELLOW;
    seatedJoins = sorted.slice(0, SEAT_CAP);
  }
  const ordinary = new Set(seatedJoins.map((r) => r.persona));
  for (const r of rows) if (r.decision === RSVP.JOIN && !ordinary.has(r.persona)) r.capped = true;
  const deltas = new Set();
  for (const r of rows) {
    if (r.decision === RSVP.JOIN && ordinary.has(r.persona)) Object.assign(r, { seated: true, seat: SEAT.ORDINARY });
    if (r.decision === RSVP.EXCEPTIONAL && r.uncovered_delta) {
      const d = r.uncovered_delta.trim().toLowerCase();
      if (!deltas.has(d)) { deltas.add(d); Object.assign(r, { seated: true, seat: SEAT.EXCEPTIONAL }); }
    }
  }
  return { rows, band, tie, joiners: joins.length };
}

/** Whether a board may proceed (I3): J ≥ 3. */
export const quorate = (joiners) => joiners >= QUORUM;

/**
 * The one failure rule (CONDUCTOR.md § Ports): a seated persona that fails counts
 * as ABSTAIN, its reason recorded, its seat given up and never refilled. Returns new rows.
 */
export function unseat(rows, persona, failure) {
  return rows.map((r) => {
    if (r.persona !== persona) return r;
    const { seat: _seat, ...rest } = r;
    return { ...rest, decision: RSVP.ABSTAIN, failure: failure.failure, reason: failure.reason, seated: false };
  });
}

/** I3 after the evidence check (chorus-review Phase 1 post): fewer than QUORUM authors left aborts the board. */
export const quorateAfterEvidence = (authors) => authors >= QUORUM;

/**
 * S10: where one author's round stands. reply: its validated finding-report, or
 * undefined; answered: whether the operator answered that round's gate questions.
 * → "final" (findings count), "ask" (the round waits on the operator), "next" (re-author at round + 1).
 */
export function gateWait(reply, answered) {
  if (!reply.gate_questions?.length) return "final";
  return answered ? "next" : "ask";
}

/* ── Register (GATE-PRIMITIVE.md § Stage 2, I8) ──────────────────────────── */

/**
 * Register findings from validated finding reports, in report order.
 * reports: [{persona, lens, findings: [...]}]. Ids are renumbered F1.. in order
 * so two personas' F1 never collide; `source` keeps the persona's own id.
 */
export function register(reports) {
  const out = [];
  for (const rep of reports) {
    for (const f of rep.findings ?? []) {
      // BRIEFS.md § Findings register: duplicates group only when they cite the same locator.
      const same = out.find((x) => x.entry.locator === f.locator && x.entry.author !== rep.persona && !x.entry.co_authors?.some((c) => c.persona === rep.persona));
      if (same) {
        const e = same.entry;
        (e.co_authors ??= []).push({ persona: rep.persona, lens: f.lens, authored_severity: f.proposed_severity, pull_quote: f.pull_quote });
        // The entry is counted at its most severe author's proposal; every author's own stays on the entry.
        if (SEVERITY_LADDER.indexOf(f.proposed_severity) > SEVERITY_LADDER.indexOf(e.authored_severity)) e.authored_severity = f.proposed_severity;
        e.evidence = e.evidence.concat(f.evidence ?? []);
        if (e.evidence.length) delete e.unsupported;
        if (f.need_info === true) {
          e.need_info = true;
          (e.need_info_reasons ??= []).push({ raiser: rep.persona, reason: f.need_info_reason, stage: NEED_INFO_STAGE.AUTHOR });
        }
        same.sources.push({ persona: rep.persona, source: f.id });
        continue;
      }
      const e = {
        id: `F${out.length + 1}`,
        author: rep.persona,
        lens: f.lens,
        authored_severity: f.proposed_severity,
        locator: f.locator,
        pull_quote: f.pull_quote,
        evidence: f.evidence ?? [],
        confidence_on_hand: f.confidence_on_hand,
        need_info: f.need_info === true,
        graded: true,
      };
      if (!e.evidence.length) e.unsupported = true;
      if (e.need_info) e.need_info_reasons = [{ raiser: rep.persona, reason: f.need_info_reason, stage: NEED_INFO_STAGE.AUTHOR }];
      if (f.scope !== undefined) e.scope = f.scope;
      out.push({ entry: e, source: f.id, claim: f.claim, sources: [{ persona: rep.persona, source: f.id }] });
    }
  }
  return out;
}

/** Every persona who authored an entry: its author and any co-author (none of them votes on it, S8). */
export const authorsOf = (e) => [e.author, ...(e.co_authors ?? []).map((c) => c.persona)];

/**
 * S11 routing for one held finding (GATE-PRIMITIVE.md § S11, catalog row 14).
 * Peers are the active personas that neither authored the finding nor raised the
 * flag; the peer path comes first, then the operator. provisions: this finding's
 * logged provision answers, oldest first.
 * → { ask: route, peers } while a provision is outstanding, else
 *   { route, supplied } with supplied the provision that closed the gap, or null.
 */
export function provisionRoute(entry, reasons, active, provisions) {
  const raisers = new Set(reasons.map((x) => x.raiser));
  const peers = active.filter((p) => !authorsOf(entry).includes(p) && !raisers.has(p));
  const last = (route) => provisions.filter((x) => x.route === route).at(-1);
  const peer = last(HELD_ROUTE.PEER), op = last(HELD_ROUTE.OPERATOR);
  if (peers.length && !peer) return { ask: HELD_ROUTE.PEER, peers };
  if (peer?.supplied) return { route: HELD_ROUTE.PEER, supplied: peer };
  if (!op) return { ask: HELD_ROUTE.OPERATOR, peers };
  return { route: HELD_ROUTE.OPERATOR, supplied: op.supplied ? op : null };
}

/** S11: an author's revised finding applied to its register entry. Returns a new entry; the flag is cleared. */
export function applyRevision(entry, revised) {
  const { need_info_reasons: _r, unsupported: _u, ...rest } = entry;
  const e = { ...rest, authored_severity: revised.proposed_severity, locator: revised.locator, pull_quote: revised.pull_quote,
    evidence: revised.evidence ?? [], confidence_on_hand: revised.confidence_on_hand, need_info: false };
  if (!e.evidence.length) e.unsupported = true;
  return e;
}

/** Register R2- derived findings from vote reports (Round 2): ungraded, never voted. */
export function registerDerived(entries, reports) {
  const out = [];
  for (const rep of reports) {
    for (const f of rep.derived ?? []) {
      const e = {
        id: `R2-${out.length + 1}`, author: rep.persona, lens: f.lens, authored_severity: f.proposed_severity,
        locator: f.locator, pull_quote: f.pull_quote, evidence: f.evidence ?? [], confidence_on_hand: f.confidence_on_hand,
        need_info: false, graded: false, derived_from: f.derived_from,
      };
      if (!e.evidence.length) e.unsupported = true;
      out.push({ entry: e, source: f.id, claim: f.claim });
    }
  }
  return out;
}

/** Findings a voter may vote on: supported, graded, not its own (S8, I8). */
export const ballot = (entries, voter) => entries.filter((e) => !authorsOf(e).includes(voter) && !e.unsupported && e.graded);

/* ── Count (GATE-PRIMITIVE.md § Stage 3–4, settled cases) ────────────────── */

/**
 * Count votes into tally rows. votes: [{voter, finding, vote, reason, confidence_on_hand}].
 * A vote by the author, on an unknown finding, or on an unsupported/ungraded
 * finding is ignored here; conduct refuses such replies before they are logged.
 * A NEED_INFO vote holds the finding (S11); conduct refuses a low-confidence
 * vote of any other value before it is logged.
 */
export function count(entries, votes) {
  const rows = [];
  const raised = new Map();
  for (const e of entries) {
    if (e.unsupported) continue;
    if (!e.graded) { rows.push({ finding: e.id, authored_severity: e.authored_severity, status: TALLY_STATUS.UNGRADED, final_severity: e.authored_severity }); continue; }
    const mine = votes.filter((v) => v.finding === e.id && !authorsOf(e).includes(v.voter));
    const needs = mine.filter((v) => v.vote === VOTE.NEED_INFO);
    if (needs.length) raised.set(e.id, needs.map((v) => ({ raiser: v.voter, reason: v.reason, stage: NEED_INFO_STAGE.VOTE })));
    if (e.need_info || needs.length) { rows.push({ finding: e.id, authored_severity: e.authored_severity, status: TALLY_STATUS.HELD }); continue; }
    const p = mine.filter((v) => v.vote === VOTE.PRIORITIZE).length;
    const c = mine.filter((v) => v.vote === VOTE.CONFIRM).length;
    const o = mine.filter((v) => v.vote === VOTE.OVER_RATE).length;
    const n = p + c + o;
    if (n === 1) { rows.push({ finding: e.id, authored_severity: e.authored_severity, status: TALLY_STATUS.MINORITY_REPORT, n, p, c, o, final_severity: e.authored_severity, gating: false }); continue; }
    rows.push({ finding: e.id, authored_severity: e.authored_severity, n, p, c, o, ...tally(e.authored_severity, n, p, c, o) });
  }
  return { rows, raised };
}

/* ── Ranking eligibility (chorus-review Phase 4) ─────────────────────────── */

/** Findings a top five may hold: counted (graded or unvoted) or ungraded R2-; never held, minority, unsupported. */
export function rankable(entries, rows) {
  const byId = new Map(rows.map((r) => [r.finding, r]));
  return entries.filter((e) => {
    const r = byId.get(e.id);
    return r && !e.unsupported && ![TALLY_STATUS.HELD, TALLY_STATUS.MINORITY_REPORT].includes(r.status);
  }).map((e) => e.id);
}

/* ── Side-notes (CONDUCTOR.md § Side-notes) — the regimes a program can see ─ */

export function sideNotes(rows, seatedRows) {
  const notes = [];
  for (const r of seatedRows.filter((x) => x.seat === SEAT.EXCEPTIONAL)) {
    notes.push({ regime: SIDE_NOTE.EXCEPTIONAL_SEAT, note: `${r.persona} was seated beyond the cap by exceptional entry, citing: ${r.uncovered_delta}` });
  }
  const edge = rows.filter((r) => r.status === TALLY_STATUS.GRADED && r.net !== 0 && Math.abs(r.net) === r.threshold);
  if (edge.length) notes.push({ regime: SIDE_NOTE.THRESHOLD_BOUNDARY, note: "Moved at exactly the threshold: |net| == T.", findings: edge.map((r) => r.finding) });
  const unanimous = rows.filter((r) => r.status === TALLY_STATUS.GRADED && r.n >= 2 && (r.p === r.n || r.o === r.n));
  if (unanimous.length) notes.push({ regime: SIDE_NOTE.UNANIMOUS_SAME_BRIEF, note: "Unanimous among voters who read the same brief: one datum, not several.", findings: unanimous.map((r) => r.finding) });
  return notes;
}

/* ── Gate outcome (DECISION-PRIMITIVE.md § The self-heal loop, S4, S7) ───── */

/** The gating 🔴 findings of a tallied board. */
export const gatingSet = (rows) => rows.filter((r) => r.gating === true).map((r) => r.finding);

/** A gate cycle's result: pass when nothing gates; self-heal below the bound; bound-reached at it. */
export function gateOutcome(cycle, gating) {
  if (!gating.length) return GATE_RESULT.PASS;
  return cycle < CYCLE_BOUND ? GATE_RESULT.SELF_HEAL : GATE_RESULT.BOUND_REACHED;
}

/** The speckit cascade that incorporates a gate's 🔴 (chorus-sdlc § Incorporation loop, S5). */
export const CASCADE = Object.freeze({
  [GATE.A]: [SPECKIT.SPECKIT_CLARIFY, SPECKIT.SPECKIT_PLAN],
  [GATE.B]: [SPECKIT.SPECKIT_CLARIFY, SPECKIT.SPECKIT_PLAN, SPECKIT.SPECKIT_TASKS],
  [GATE.C]: [SPECKIT.SPECKIT_CLARIFY, SPECKIT.SPECKIT_IMPLEMENT],
});

/** What a lifecycle runs before each gate (chorus-sdlc § The pipeline). */
export const BEFORE_GATE = Object.freeze({ [GATE.A]: SPECKIT.SPECKIT_PLAN, [GATE.B]: SPECKIT.SPECKIT_TASKS, [GATE.C]: SPECKIT.SPECKIT_IMPLEMENT });
