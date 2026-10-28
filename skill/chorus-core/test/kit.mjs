/**
 * Test kit for the conductor: persona-reply builders and a driver that plays
 * the agent's side of the `next` loop against a policy. A scenario states only
 * what differs from the default policy; the driver does the rest and returns
 * the transcript of actions, so tests assert both the path and the record.
 */

import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ack, answer, derive, fail, initLog, submit } from "../bin/conduct.mjs";
import { ACTION, CONFIDENCE, EVIDENCE_KIND, PHASE, RECORD_KIND, REPORT_MODE, RSVP, RUN_MODE, SEVERITY, TOPIC, VOCAB, VOTE } from "../bin/vocab.mjs";

export const BINDINGS = { ports: VOCAB.port.map((port) => ({ port, provider: "default" })), recoveries: [] };
export const ROSTER6 = VOCAB.roster.slice(0, 6);

export function newRun(mode, over = {}) {
  const dir = mkdtempSync(join(tmpdir(), "conduct-"));
  const opts = { date: "2026-10-28", target: "specs/099-example/spec.md", feature: "099-example", context: "Commit abc123 added the export path; spec 099 landed.",
    roster: ROSTER6, dir, stem: mode === RUN_MODE.SDLC ? "agent-sdlc-log" : "2026-10-28-chorus-review", bindings: BINDINGS, ...over };
  const log = initLog(mode, opts);
  const file = join(dir, `${opts.stem}.run.json`);
  writeFileSync(file, JSON.stringify(log, null, 2));
  return { file, log, dir };
}

const reportMode = (action) => (action.gate === undefined ? REPORT_MODE.REVIEW : action.gate === VOCAB.gate[3] ? REPORT_MODE.CHALLENGE : REPORT_MODE.SDLC);
const round = (action) => (action.gate ? `gate-${action.gate}/cycle-${action.cycle}` : "2026-10-28");

export const rsvp = (persona, action, decision = RSVP.JOIN, extra = {}) => ({
  kind: RECORD_KIND.RSVP, schema_version: "1", persona, lens: "lens", round: round(action), decision,
  ...(decision === RSVP.ABSTAIN ? {} : { applies: ["the export path"], expected: { stakes: SEVERITY.YELLOW, hook: "the export path is new" } }),
  reason: decision === RSVP.ABSTAIN ? "Nothing in the deltas touches my lens." : "The export path is in my territory.", ...extra,
});

export const finding = (over = {}) => ({
  id: "F1", lens: "lens", locator: "src/export.py:10", claim: "The export path writes without a bound on rows.",
  evidence: [{ kind: EVIDENCE_KIND.FILE_LINE, ref: "src/export.py:10" }], proposed_severity: SEVERITY.YELLOW,
  pull_quote: "Nothing bounds how many rows an export writes.", confidence_on_hand: CONFIDENCE.HIGH, need_info: false, ...over,
});

export const report = (persona, action, findings, extra = {}) => ({
  kind: RECORD_KIND.FINDING_REPORT, schema_version: "1", mode: reportMode(action), round: round(action), persona, lens: "lens", tool_uses: 5,
  findings: findings.map((f, i) => ({ ...f, id: `F${i + 1}` })), ...extra,
});

export const votes = (persona, action, list, extra = {}) => ({
  kind: RECORD_KIND.VOTE_REPORT, schema_version: "1", mode: reportMode(action), round: round(action), persona, lens: "lens", tool_uses: 3,
  own_findings: [], votes: list.map(([f, vote]) => ({ finding: f, confidence_on_hand: vote === VOTE.NEED_INFO ? CONFIDENCE.LOW : CONFIDENCE.HIGH, vote, reason: "Read the cited lines; this is my call." })),
  derived: [], ...extra,
});

const RT = VOCAB.red_team_item;

/** The default policy: everyone joins, authors one 🟡, confirms every ballot entry; inputs are minimal and valid. */
export const DEFAULT = {
  rsvp: (persona, action) => rsvp(persona, action),
  author: (persona, action) => report(persona, action, [finding({ locator: `src/${persona}.py:1`, evidence: [{ kind: EVIDENCE_KIND.FILE_LINE, ref: `src/${persona}.py:1` }] })]),
  vote: (persona, action, ask) => votes(persona, action, ask.ballot.map((f) => [f, VOTE.CONFIRM])),
  revise: (persona, action, ask) => report(persona, action, [finding({ need_info: false })]),
  revote: (persona, action, ask) => votes(persona, action, [[ask.finding, VOTE.CONFIRM]]),
  answers: {
    [TOPIC.GATE_ANSWERS]: (a) => { const q = a.questions[0]; return { persona: q.persona, round: q.round, answers: a.questions.filter((x) => x.persona === q.persona && x.round === q.round).map((x) => ({ question: x.question, answer: "Internal tool, ten users." })) }; },
    [TOPIC.PROVISION]: (a) => ({ finding: a.finding, route: a.route, supplied: true, ...(a.peers ? { by: a.peers[0] } : {}), note: "Exports are capped at 10k rows by the spec." }),
    [TOPIC.CONFLICTS]: () => [],
    [TOPIC.RANKING]: (a) => a.eligible.slice(0, 3).map((e) => ({ finding: e.id, cost: "low", value: "Removes the unbounded write." })),
    [TOPIC.SIGNOFF]: (a) => (a.needs ? { tldr: ["The chorus found the export path unbounded.", "The top five prioritizes bounding writes.", "No 🔴 findings block rollout."], baseline: { assume_closed: [], in_progress: [], re_evaluate: [] } } : {}),
    [TOPIC.PREMISE_PASS]: () => ({ red_team: RT.map((item) => ({ item, outcome: "observed, evidenced" })), honest_null: { premise_survives: true, tried: [{ persona: ROSTER6[0], attack_form: VOCAB.attack_form[0], note: "Steelmanned not building; the cost of inaction is evidenced." }] } }),
    [TOPIC.INCORPORATED]: (a) => ({ skills: a.skills, detail: "Spec revised; plan regenerated." }),
    [TOPIC.SKILL_DONE]: (a) => ({ skill: a.skill }),
    [TOPIC.MEMORY_UPDATE]: (a) => ({ personas: a.personas.map((persona) => ({ persona, written: 1 })), operator: "none-proposed", secret_filter: { ran: true, drops: 0 } }),
    [TOPIC.OPERATOR_RULING]: (a) => ({ findings: a.findings.map((finding) => ({ finding, disposition: "waived", detail: "Accepted risk for v1." })),
      local_ruling: { id: "R-1", created: "2026-10-28T10:00Z", updated: "2026-10-28T10:00Z", about: "Gate A 🔴 at the bound", said: "Waive for v1; revisit after launch.", source: "operator in chat" } }),
  },
};

/**
 * Play the agent's side until done or halt. policy overrides DEFAULT per hook;
 * a hook may return { fail: [failure, reason] } instead of a reply.
 * Returns { transcript: [action...], last, results: [submit results] }.
 */
export function drive(run, over = {}, maxSteps = 400) {
  const P = { ...DEFAULT, ...over, answers: { ...DEFAULT.answers, ...(over.answers ?? {}) } };
  const transcript = [], results = [];
  for (let i = 0; i < maxSteps; i++) {
    const { action } = derive(run.log);
    transcript.push(action);
    if (action.action === ACTION.DONE || action.action === ACTION.HALT) return { transcript, last: action, results };
    if (action.action === ACTION.DISPATCH || action.action === ACTION.RETRY) {
      for (const ask of action.asks) {
        if (!ask.kind) { results.push(ack(run.file, run.log, ask.persona)); continue; }
        const hook = action.phase === PHASE.RSVP ? P.rsvp : action.phase === PHASE.AUTHOR ? P.author : action.phase === PHASE.VOTE ? P.vote
          : ask.round === 1 ? P.revise : P.revote;
        const out = hook(ask.persona, action, ask);
        results.push(out.fail ? fail(run.file, run.log, ask.persona, ...out.fail) : submit(run.file, run.log, ask.persona, out));
      }
      continue;
    }
    const data = P.answers[action.topic](action);
    const r = answer(run.file, run.log, action.topic, data);
    results.push(r);
    if (r.exit !== 0) throw new Error(`answer ${action.topic} refused: ${r.message}`);
  }
  throw new Error(`no done/halt after ${maxSteps} steps; last: ${JSON.stringify(transcript.at(-1)).slice(0, 300)}`);
}
