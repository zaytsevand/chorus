import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ack, answer, assemble, derive, freeStem, submit } from "../bin/conduct.mjs";
import { validate } from "../bin/validate.mjs";
import { ACTION, EXIT, FAILURE, GATE, GATE_RESULT, PHASE, RECOVERY, REVIEW_QUORUM, RSVP, RUN_MODE, SDLC_STATUS, SEVERITY, TALLY_STATUS, TOPIC, VOTE } from "../bin/vocab.mjs";
import { ROSTER6, drive, finding, newRun, report, rsvp, votes } from "./kit.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const steps = (t) => t.map((a) => `${a.action}:${a.phase ?? ""}${a.gate ? `@${a.gate}${a.cycle}` : ""}`);
const valid = (rec) => {
  const r = validate(rec.kind, rec);
  assert.equal(r.valid, true, r.errors.map((e) => `${e.path}: ${e.message}`).join("\n"));
  return rec;
};

/* ── review rounds ───────────────────────────────────────────────────────── */

test("review: the default round runs the phases in order and its record validates", () => {
  const run = newRun(RUN_MODE.REVIEW);
  const { transcript } = drive(run);
  assert.deepEqual(steps(transcript), ["dispatch:rsvp", "dispatch:explore", "provide:explore", "dispatch:author", "dispatch:vote", "provide:conflicts", "provide:rank", "provide:signoff", "done:"]);
  const rec = valid(assemble(run.log));
  assert.equal(rec.register.length, 5, "six tied joiners seat five, each authoring one finding");
  assert.equal(rec.top_five[0].pull_quote, rec.register.find((e) => e.id === rec.top_five[0].finding).pull_quote, "the script copies the quote (I6)");
});

test("review: replaying the same log yields the same record byte for byte", () => {
  const run = newRun(RUN_MODE.REVIEW);
  drive(run);
  const again = JSON.parse(readFileSync(run.file, "utf8"));
  assert.equal(JSON.stringify(assemble(again)), JSON.stringify(assemble(run.log)));
});

test("review: six tied joiners seat five and record a 🟡 seating decision", () => {
  const run = newRun(RUN_MODE.REVIEW);
  drive(run);
  const rec = valid(assemble(run.log));
  assert.equal(rec.roster.filter((r) => r.seated).length, 5);
  assert.equal(rec.decisions[0].band, SEVERITY.YELLOW);
  assert.equal(rec.seating_decision, rec.decisions[0].id);
});

test("review: below quorum the abstainers are re-asked once, then the round aborts (I3)", () => {
  const run = newRun(RUN_MODE.REVIEW);
  const joiners = new Set(ROSTER6.slice(0, 2));
  const { transcript } = drive(run, { rsvp: (p, a) => rsvp(p, a, joiners.has(p) ? RSVP.JOIN : RSVP.ABSTAIN) });
  const asks = transcript.filter((a) => a.phase === PHASE.RSVP);
  assert.equal(asks.length, 2);
  assert.equal(asks[1].reask, true);
  assert.deepEqual(asks[1].asks.map((x) => x.persona), ROSTER6.slice(2));
  assert.equal(transcript.at(-1).aborted, true);
  const rec = valid(assemble(run.log));
  assert.equal(rec.quorum.branch, REVIEW_QUORUM.ABORTED);
});

test("review: a re-ask that reaches quorum proceeds as re-asked-proceed", () => {
  const run = newRun(RUN_MODE.REVIEW);
  const { transcript } = drive(run, { rsvp: (p, a) => rsvp(p, a, p === ROSTER6[0] || (a.reask && p === ROSTER6[2]) || p === ROSTER6[1] || (a.reask && p === ROSTER6[3]) ? RSVP.JOIN : RSVP.ABSTAIN) });
  assert.equal(transcript.at(-1).action, ACTION.DONE);
  assert.equal(valid(assemble(run.log)).quorum.branch, REVIEW_QUORUM.RE_ASKED_PROCEED);
});

test("review: an invalid reply gets one retry carrying the reason; a second failure is ABSTAIN, recorded", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 5) });
  const bad = ROSTER6[4];
  const { transcript, results } = drive(run, { author: (p, a) => (p === bad ? { ...report(p, a, [finding()]), tool_uses: 0 } : report(p, a, [finding({ locator: `src/${p}.py:1` })])) });
  const retry = transcript.find((a) => a.action === ACTION.RETRY);
  assert.equal(retry.asks[0].persona, bad);
  assert.match(retry.asks[0].reason, /tool_uses/);
  assert.equal(results.filter((r) => r.exit === 1).length, 2);
  const rec = valid(assemble(run.log));
  const row = rec.roster.find((r) => r.persona === bad);
  assert.deepEqual([row.decision, row.failure, row.seated], [RSVP.ABSTAIN, FAILURE.NO_EVIDENCE, false]);
  assert.deepEqual(rec.bindings.recoveries.map((x) => x.kind), [RECOVERY.RETRY, RECOVERY.ABSTENTION]);
});

test("review: a not-installed persona abstains with no retry", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 4) });
  const { transcript } = drive(run, { rsvp: (p, a) => (p === ROSTER6[3] ? { fail: [FAILURE.NOT_INSTALLED, "agent file not found"] } : rsvp(p, a)) });
  assert.equal(transcript.some((a) => a.action === ACTION.RETRY), false);
  const rec = valid(assemble(run.log));
  assert.equal(rec.roster.find((r) => r.persona === ROSTER6[3]).failure, FAILURE.NOT_INSTALLED);
});

test("review: a vote on one's own finding is refused and charged as a failure (S8)", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  let refused;
  drive(run, {
    vote: (p, a, ask) => {
      const own = a.register.find((e) => e.author === p).id;
      if (!refused) { refused = p; return votes(p, a, [[own, VOTE.PRIORITIZE]]); }
      return votes(p, a, ask.ballot.map((f) => [f, VOTE.CONFIRM]));
    },
  });
  const failure = run.log.events.find((e) => e.type === "failure");
  assert.equal(failure.persona, refused);
  assert.match(failure.reason, /S8/);
  valid(assemble(run.log));
});

test("review: a low-confidence vote must be NEED_INFO (S11)", () => {
  const fresh = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  let tried = false;
  drive(fresh, {
    vote: (p, a, ask) => {
      const r = votes(p, a, ask.ballot.map((f) => [f, VOTE.CONFIRM]));
      if (!tried) { tried = true; r.votes[0].confidence_on_hand = "low"; }
      return r;
    },
  });
  assert.match(fresh.log.events.find((e) => e.type === "failure").reason, /NEED_INFO/);
});

test("review: NEED_INFO goes to a peer, the author revises, the others re-vote, and it is counted (S11)", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 4) });
  const { transcript } = drive(run, {
    vote: (p, a, ask) => votes(p, a, ask.ballot.map((f) => [f, f === "F1" && p === ROSTER6[1] ? VOTE.NEED_INFO : VOTE.CONFIRM])),
  });
  const provide = transcript.find((a) => a.topic === TOPIC.PROVISION);
  assert.equal(provide.finding, "F1");
  assert.deepEqual(provide.peers, [ROSTER6[2], ROSTER6[3]], "neither the author nor the raiser");
  assert.ok(transcript.some((a) => a.phase === PHASE.NEED_INFO && a.asks?.[0].round === 1), "the author revises");
  assert.ok(transcript.some((a) => a.phase === PHASE.NEED_INFO && a.asks?.[0].round === 2), "the others re-vote");
  const rec = valid(assemble(run.log));
  assert.equal(rec.tally.find((r) => r.finding === "F1").status, TALLY_STATUS.GRADED);
  assert.equal(rec.held.length, 0);
});

test("review: NEED_INFO nobody can supply stays held, routed to the operator, out of the top five", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 4) });
  const { transcript } = drive(run, {
    vote: (p, a, ask) => votes(p, a, ask.ballot.map((f) => [f, f === "F1" && p === ROSTER6[1] ? VOTE.NEED_INFO : VOTE.CONFIRM])),
    answers: { [TOPIC.PROVISION]: (a) => ({ finding: a.finding, route: a.route, supplied: false, note: "Nobody has the export size." }) },
  });
  assert.ok(transcript.some((a) => a.action === ACTION.ASK_OPERATOR && a.topic === TOPIC.PROVISION));
  const rec = valid(assemble(run.log));
  assert.deepEqual(rec.held.map((h) => [h.finding, h.route]), [["F1", "operator"]]);
  assert.equal(rec.top_five.some((t) => t.finding === "F1"), false);
});

test("review: a persona with an unmet gate returns its questions; the operator answers; it re-authors with them (S10)", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  const asker = ROSTER6[0];
  const { transcript } = drive(run, {
    author: (p, a, ask) => (p === asker && ask.round === 1
      ? report(p, a, [], { gate_questions: [{ need: "the grading bar", question: "Internal tool or customer-facing?" }] })
      : report(p, a, [finding({ locator: `src/${p}.py:1` })])),
  });
  const q = transcript.find((a) => a.action === ACTION.ASK_OPERATOR);
  assert.equal(q.topic, TOPIC.GATE_ANSWERS);
  const redispatch = transcript.find((a) => a.phase === PHASE.AUTHOR && a.asks?.some((x) => x.persona === asker && x.round === 2));
  assert.equal(redispatch.asks[0].gate_answers[0].answer, "Internal tool, ten users.");
  valid(assemble(run.log));
});

test("review: a reply nobody asked for is refused and nothing is logged", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  const action = derive(run.log).action;
  const r = submit(run.file, run.log, "not-on-the-roster", rsvp("not-on-the-roster", action));
  assert.equal(r.exit, EXIT.NOT_ASKED);
  assert.match(r.message, /run: conduct next /, "a refusal names the command to run next");
  assert.equal(run.log.events.length, 0);
});

test("review: a reply sent where an acknowledgement is asked names the ack command", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  let a = derive(run.log).action;
  for (const x of a.asks) submit(run.file, run.log, x.persona, rsvp(x.persona, a));
  a = derive(run.log).action;
  assert.equal(a.phase, PHASE.EXPLORE);
  const who = a.asks[0].persona;
  const r = submit(run.file, run.log, who, rsvp(who, a));
  assert.equal(r.exit, EXIT.NOT_ASKED);
  assert.ok(r.message.includes(`run: conduct ack ${run.file} ${who}`), r.message);
  assert.equal(ack(run.file, run.log, who).exit, EXIT.OK);
});

test("review: a version mismatch is exit 3, logged nowhere, never charged", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  const action = derive(run.log).action;
  const r = submit(run.file, run.log, ROSTER6[0], { ...rsvp(ROSTER6[0], action), schema_version: "2" });
  assert.equal(r.exit, 3);
  assert.equal(run.log.events.length, 0);
});

test("review: ranking a held finding is refused", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 4) });
  assert.throws(() => drive(run, {
    vote: (p, a, ask) => votes(p, a, ask.ballot.map((f) => [f, f === "F1" && p === ROSTER6[1] ? VOTE.NEED_INFO : VOTE.CONFIRM])),
    answers: {
      [TOPIC.PROVISION]: (a) => ({ finding: a.finding, route: a.route, supplied: false, note: "Nobody has it." }),
      [TOPIC.RANKING]: () => [{ finding: "F1", cost: "low", value: "held, so not rankable" }],
    },
  }), /not rankable/);
});

/* ── lifecycle ───────────────────────────────────────────────────────────── */

test("sdlc: speckit, three gates, memory update and the operator's sign-off; the ledger validates", () => {
  const run = newRun(RUN_MODE.SDLC);
  const { transcript } = drive(run);
  const order = transcript.filter((a) => [ACTION.RUN_SKILL, ACTION.ASK_OPERATOR].includes(a.action) || a.phase === PHASE.MEMORY).map((a) => a.skill ?? a.phase);
  assert.deepEqual(order, ["speckit-plan", "speckit-tasks", "speckit-implement", "memory", "memory", "signoff"]);
  const rec = valid(assemble(run.log));
  assert.equal(rec.status, SDLC_STATUS.COMPLETE);
  assert.ok(rec.gates[0].premise_pass, "Gate A records its premise pass");
  assert.equal(rec.self_audit.every((a) => a.pass), true);
});

const escalateAtGateA = (cyclesRed) => (p, a, ask) =>
  votes(p, a, ask.ballot.map((f) => [f, a.gate === GATE.A && a.cycle <= cyclesRed && f === "F1" ? VOTE.PRIORITIZE : VOTE.CONFIRM]));
const redAuthor = (p, a) => report(p, a, [finding({ locator: `src/${p}.py:1`, proposed_severity: SEVERITY.RED })]);

test("sdlc: a gating 🔴 self-heals through the speckit cascade and the gate re-runs", () => {
  const run = newRun(RUN_MODE.SDLC, { roster: ROSTER6.slice(0, 4) });
  const { transcript } = drive(run, { author: redAuthor, vote: (p, a, ask) => votes(p, a, ask.ballot.map((f) => [f, a.gate === GATE.A && a.cycle === 1 && f === "F1" ? VOTE.CONFIRM : VOTE.OVER_RATE])) });
  const inc = transcript.find((a) => a.action === ACTION.INCORPORATE);
  assert.deepEqual([inc.gate, inc.cycle, inc.skills], [GATE.A, 1, ["speckit-clarify", "speckit-plan"]]);
  const rec = valid(assemble(run.log));
  const a = rec.gates.filter((g) => g.gate === GATE.A);
  assert.deepEqual(a.map((g) => g.outcome.result), [GATE_RESULT.SELF_HEAL, GATE_RESULT.PASS]);
  assert.equal(rec.decisions.find((d) => d.id === "A-self-heal-1").cycle, 1);
});

test("sdlc: three uncleared cycles reach the bound; an open ruling halts the run (S7)", () => {
  const run = newRun(RUN_MODE.SDLC, { roster: ROSTER6.slice(0, 4) });
  const { transcript, last } = drive(run, {
    author: (p, a) => report(p, a, [finding({ locator: `src/${p}.py:1`, proposed_severity: a.gate === GATE.A ? SEVERITY.RED : SEVERITY.YELLOW })]),
    answers: { [TOPIC.OPERATOR_RULING]: (a) => ({ findings: a.findings.map((f) => ({ finding: f, disposition: "open", detail: "Not acceptable for v1." })) }) },
  });
  assert.equal(transcript.filter((a) => a.action === ACTION.INCORPORATE).length, 2);
  assert.equal(last.action, ACTION.HALT);
  const rec = valid(assemble(run.log));
  assert.equal(rec.status, SDLC_STATUS.HALTED_AWAITING_OPERATOR);
  assert.equal(rec.gates.at(-1).outcome.result, GATE_RESULT.BOUND_REACHED);
  assert.ok(rec.gates.at(-1).outcome.awaiting.length);
});

test("sdlc: waiving every 🔴 at the bound lets the run continue to Gate B", () => {
  const run = newRun(RUN_MODE.SDLC, { roster: ROSTER6.slice(0, 4) });
  const { last } = drive(run, { author: (p, a) => report(p, a, [finding({ locator: `src/${p}.py:1`, proposed_severity: a.gate === GATE.A ? SEVERITY.RED : SEVERITY.YELLOW })]) });
  assert.equal(last.action, ACTION.DONE);
  const rec = valid(assemble(run.log));
  assert.equal(rec.local_rulings[0].id, "R-1");
  assert.deepEqual(rec.gates.find((g) => g.outcome.result === GATE_RESULT.BOUND_REACHED).red_resolutions[0].ruling_ref, { id: "R-1", record: "#" });
});

test("sdlc: a waiver without the operator's ruling is refused", () => {
  const run = newRun(RUN_MODE.SDLC, { roster: ROSTER6.slice(0, 4) });
  assert.throws(() => drive(run, {
    author: (p, a) => report(p, a, [finding({ locator: `src/${p}.py:1`, proposed_severity: a.gate === GATE.A ? SEVERITY.RED : SEVERITY.YELLOW })]),
    answers: { [TOPIC.OPERATOR_RULING]: (a) => ({ findings: a.findings.map((f) => ({ finding: f, disposition: "waived", detail: "Accepted for v1." })) }) },
  }), /waiver cites the operator's ruling/);
});

test("challenge: one premise gate, no speckit; the ledger validates", () => {
  const run = newRun(RUN_MODE.CHALLENGE, { roster: ROSTER6.slice(0, 3) });
  const { transcript } = drive(run);
  assert.equal(transcript.some((a) => a.action === ACTION.RUN_SKILL), false);
  const rec = valid(assemble(run.log));
  assert.deepEqual(rec.gates.map((g) => g.gate), [GATE.CHALLENGE]);
});

/* ── CLI ─────────────────────────────────────────────────────────────────── */

const cli = (...args) => spawnSync(process.execPath, [join(ROOT, "bin", "conduct.mjs"), ...args], { encoding: "utf8" });

test("cli: next prints the action; record writes JSON and page once the run is done", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  const first = JSON.parse(cli("next", run.file).stdout);
  assert.equal(first.action, ACTION.DISPATCH);
  assert.ok(first.asks.every((x) => x.command === `conduct submit ${run.file} ${x.persona} <${x.kind}.json>`), "each ask carries its command");
  assert.equal(cli("record", run.file).status, EXIT.NOT_FINISHED, "refuses before the run is done");
  drive(run);
  const r = cli("record", run.file);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(join(run.dir, "2026-10-28-chorus-review.md")));
});

test("cli: each failure has its own exit code", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  assert.equal(cli("bogus", run.file).status, EXIT.USAGE);
  writeFileSync(run.file, readFileSync(run.file, "utf8").slice(0, 40));
  const torn = cli("next", run.file);
  assert.equal(torn.status, EXIT.UNREADABLE_LOG, "a torn log is not a usage error");
  assert.match(torn.stderr, /git checkout --/);
  const bad = spawnSync(process.execPath, [join(ROOT, "bin", "conduct.mjs"), "init", "review", "--target", "x", "--context", "short ctx", "--dir", run.dir, "--date", "2026-10-30"], { encoding: "utf8" });
  assert.equal(bad.status, EXIT.BAD_INIT, bad.stderr);
  assert.match(bad.stderr, /^init refused, nothing written/);
  assert.ok(!existsSync(join(run.dir, "2026-10-30-chorus-review.run.json")), "a refused init writes nothing");
});

test("cli: a run log from another engine version is refused, never replayed", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  const log = JSON.parse(readFileSync(run.file, "utf8"));
  assert.equal(log.header.engine, readFileSync(join(ROOT, "VERSION"), "utf8").trim(), "init stamps the engine version");
  for (const engine of ["0.0.1", undefined]) {
    const h = { ...log.header, engine };
    if (engine === undefined) delete h.engine;
    writeFileSync(run.file, JSON.stringify({ ...log, header: h }));
    const r = cli("next", run.file);
    assert.equal(r.status, EXIT.ENGINE_MISMATCH, r.stderr);
    assert.match(r.stderr, /replayed only by the version that wrote it/);
  }
});

test("plugin.json and chorus-core/VERSION name the same release", () => {
  const plugin = JSON.parse(readFileSync(join(ROOT, "..", "..", ".claude-plugin", "plugin.json"), "utf8"));
  assert.equal(plugin.version, readFileSync(join(ROOT, "VERSION"), "utf8").trim());
});

test("the run log is written whole: no temp file is left behind", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  drive(run);
  assert.ok(!existsSync(`${run.file}.tmp`));
});

test("freeStem takes the lowest free -N", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  assert.equal(freeStem(run.dir, "2026-10-28-chorus-review"), "2026-10-28-chorus-review-2");
  assert.equal(freeStem(run.dir, "2026-10-29-chorus-review"), "2026-10-29-chorus-review");
});

test("review: the interview runs once after exploration; an unanswered [gate] question is refused", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  let a = derive(run.log).action;
  for (const x of a.asks) submit(run.file, run.log, x.persona, rsvp(x.persona, a));
  for (const x of derive(run.log).action.asks) ack(run.file, run.log, x.persona);
  a = derive(run.log).action;
  assert.equal(a.topic, TOPIC.INTERVIEW);
  const q = { persona: a.personas[0], scope: "project-wide", gate: true, question: "Who installs this?" };
  assert.equal(answer(run.file, run.log, TOPIC.INTERVIEW, { sessions: 1, questions: [{ ...q, deferred: true }], degradation: "Findings assume strangers." }).exit, EXIT.REFUSED);
  assert.equal(answer(run.file, run.log, TOPIC.INTERVIEW, { sessions: 1, questions: [{ ...q, answer: "Strangers, via install.sh." }] }).exit, EXIT.OK);
  assert.equal(derive(run.log).action.phase, PHASE.AUTHOR);
  drive(run);
  assert.equal(valid(assemble(run.log)).interview.questions[0].answer, "Strangers, via install.sh.");
});

test("review: held findings are revised in one dispatch and re-voted on one ballot (S11, batched)", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 4) });
  const { transcript } = drive(run, {
    vote: (p, a, ask) => votes(p, a, ask.ballot.map((f) => [f, ["F1", "F2"].includes(f) && p === ROSTER6[3] ? VOTE.NEED_INFO : VOTE.CONFIRM])),
  });
  const revise = transcript.filter((a) => a.phase === PHASE.NEED_INFO && a.action === ACTION.DISPATCH && a.asks[0].round === 1);
  assert.equal(revise.length, 1, "one revision dispatch");
  assert.deepEqual(revise[0].asks.map((x) => x.finding).sort(), ["F1", "F2"]);
  const revote = transcript.filter((a) => a.phase === PHASE.NEED_INFO && a.action === ACTION.DISPATCH && a.asks[0].round === 2);
  assert.equal(revote.length, 1, "one re-vote dispatch");
  const rec = valid(assemble(run.log));
  assert.deepEqual(rec.held, []);
});

test("review: an unresolved conflict is carried to the decision sink", () => {
  const run = newRun(RUN_MODE.REVIEW, { roster: ROSTER6.slice(0, 3) });
  drive(run, { answers: { [TOPIC.CONFLICTS]: () => [{ id: "C1", advisors: [ROSTER6[0], ROSTER6[1]], disputed: "Whether the cap is real, which changes the fix.", outcome: "unresolved", findings: ["F1"] }] } });
  const rec = valid(assemble(run.log));
  assert.equal(rec.conflicts[0].decision_ref, "conflict-1");
  assert.equal(rec.decisions.find((d) => d.id === "conflict-1").status, "open");
  assert.equal(validate(rec.kind, rec).warnings?.length ?? 0, 0, "no 'not carried to the decision sink' warning");
});
