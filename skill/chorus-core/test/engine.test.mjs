import { test } from "node:test";
import assert from "node:assert/strict";
import * as engine from "../bin/engine.mjs";
import { applyRevision, ballot, count, gateOutcome, gateWait, provisionRoute, quorate, quorateAfterEvidence, rankable, register, seat, sideNotes, tally, unseat } from "../bin/engine.mjs";
import { readFileSync } from "node:fs";
import { FAILURE, FINAL_SEVERITY, GATE_RESULT, HELD_ROUTE, MOVEMENT, RSVP, SEAT, SEATING_BAND, SEVERITY, SIDE_NOTE, TALLY_STATUS, VOTE } from "../bin/vocab.mjs";

const { RED, YELLOW, GREEN } = SEVERITY;
const join = (persona, applies = 1, stakes = YELLOW) => ({ persona, decision: RSVP.JOIN, applies: Array.from({ length: applies }, (_, i) => `delta ${i}`), expected: stakes });

/* ── seating (DECISION-PRIMITIVE.md § Seating) ───────────────────────────── */

test("3–5 joiners: every joiner seats, band 🟢", () => {
  const s = seat(["a", "b", "c"].map((p) => join(p)));
  assert.equal(s.band, SEATING_BAND.GREEN);
  assert.deepEqual(s.rows.map((r) => r.seat), [SEAT.ORDINARY, SEAT.ORDINARY, SEAT.ORDINARY]);
});

test("six joiners, strict order at the fifth seat: the weakest is out, band 🟢", () => {
  const s = seat([join("a", 3), join("b", 3), join("c", 2), join("d", 2), join("e", 2, RED), join("f", 1)]);
  assert.equal(s.band, SEATING_BAND.GREEN);
  assert.deepEqual(s.rows.filter((r) => r.seated).map((r) => r.persona).sort(), ["a", "b", "c", "d", "e"]);
});

test("six joiners tied across the fifth seat: band 🟡, five still seated (recorded default)", () => {
  const s = seat(["a", "b", "c", "d", "e", "f"].map((p) => join(p)));
  assert.equal(s.band, SEATING_BAND.YELLOW);
  assert.equal(s.rows.filter((r) => r.seated).length, 5);
});

test("exceptional entries seat beyond the cap, one per distinct uncovered delta", () => {
  const ex = (persona, delta) => ({ persona, decision: RSVP.EXCEPTIONAL, applies: [delta], uncovered_delta: delta });
  const s = seat([...["a", "b", "c"].map((p) => join(p)), ex("x", "files leave the boundary"), ex("y", "Files leave the boundary ")]);
  assert.equal(s.rows.find((r) => r.persona === "x").seat, SEAT.EXCEPTIONAL);
  assert.equal(s.rows.find((r) => r.persona === "y").seated, false);
});

test("an abstainer is never seated (I3)", () => {
  const s = seat([join("a"), join("b"), join("c"), { persona: "d", decision: RSVP.ABSTAIN }]);
  assert.equal(s.rows.find((r) => r.persona === "d").seated, false);
});

test("quorum is three joiners", () => {
  assert.equal(quorate(2), false);
  assert.equal(quorate(3), true);
});

/* ── register and ballot ─────────────────────────────────────────────────── */

const f = (over) => ({ id: "F1", lens: "l", locator: "a.py:1", claim: "a claim here", evidence: [{ kind: "file_line", ref: "a.py:1" }], proposed_severity: YELLOW, pull_quote: "a quote", confidence_on_hand: "high", need_info: false, ...over });

test("register renumbers across personas and marks evidence-free findings unsupported (I8)", () => {
  const r = register([{ persona: "a", findings: [f(), f({ evidence: [] })] }, { persona: "b", findings: [f({ locator: "b.py:2" })] }]).map((x) => x.entry);
  assert.deepEqual(r.map((e) => e.id), ["F1", "F2", "F3"]);
  assert.equal(r[1].unsupported, true);
  assert.deepEqual(r.map((e) => e.author), ["a", "a", "b"]);
});

test("a ballot never holds the voter's own findings or unsupported ones (S8, I8)", () => {
  const r = register([{ persona: "a", findings: [f(), f({ evidence: [] })] }, { persona: "b", findings: [f({ locator: "b.py:2" })] }]).map((x) => x.entry);
  assert.deepEqual(ballot(r, "a").map((e) => e.id), ["F3"]);
  assert.deepEqual(ballot(r, "c").map((e) => e.id), ["F1", "F3"]);
});

test("findings at the same locator group under one entry; every author keeps its severity and none votes on it", () => {
  const r = register([{ persona: "a", findings: [f()] }, { persona: "b", findings: [f({ proposed_severity: RED, pull_quote: "b's quote" })] }, { persona: "c", findings: [f({ locator: "c.py:3" })] }]).map((x) => x.entry);
  assert.deepEqual(r.map((e) => e.id), ["F1", "F2"]);
  assert.equal(r[0].author, "a");
  assert.deepEqual(r[0].co_authors, [{ persona: "b", lens: "l", authored_severity: RED, pull_quote: "b's quote" }]);
  assert.equal(r[0].authored_severity, RED, "counted at the most severe author's proposal");
  assert.deepEqual(ballot(r, "b").map((e) => e.id), ["F2"], "a co-author never votes on the grouped entry (S8)");
});

/* ── the count (GATE-PRIMITIVE.md § Stage 4) ─────────────────────────────── */

const entry = (id, author = "a", sev = YELLOW, over = {}) => ({ id, author, authored_severity: sev, graded: true, need_info: false, ...over });
const v = (voter, finding, vote) => ({ voter, finding, vote });

test("convergent PRIORITIZE escalates one level; gating iff 🔴", () => {
  const { rows } = count([entry("F1")], [v("b", "F1", VOTE.PRIORITIZE), v("c", "F1", VOTE.PRIORITIZE), v("d", "F1", VOTE.CONFIRM), v("e", "F1", VOTE.CONFIRM)]);
  assert.equal(rows[0].final_severity, RED);
  assert.equal(rows[0].gating, true);
  assert.equal(rows[0].convergence, 4);
});

test("a 🟢 demoted is dropped", () => {
  const { rows } = count([entry("F1", "a", GREEN)], [v("b", "F1", VOTE.OVER_RATE), v("c", "F1", VOTE.OVER_RATE)]);
  assert.equal(rows[0].final_severity, FINAL_SEVERITY.DROPPED);
  assert.equal(rows[0].movement, MOVEMENT.DEMOTE);
});

test("one non-author voter is a minority report: not counted, never gating", () => {
  const { rows } = count([entry("F1", "a", RED)], [v("b", "F1", VOTE.PRIORITIZE)]);
  assert.equal(rows[0].status, TALLY_STATUS.MINORITY_REPORT);
  assert.equal(rows[0].gating, false);
});

test("no votes: unvoted, non-gating", () => {
  const { rows } = count([entry("F1", "a", RED)], []);
  assert.equal(rows[0].status, TALLY_STATUS.UNVOTED);
  assert.equal(rows[0].final_severity, RED);
});

test("a NEED_INFO vote holds the finding; held carries no severity (S11)", () => {
  const { rows, raised } = count([entry("F1")], [v("b", "F1", VOTE.NEED_INFO), v("c", "F1", VOTE.PRIORITIZE), v("d", "F1", VOTE.PRIORITIZE)]);
  assert.equal(rows[0].status, TALLY_STATUS.HELD);
  assert.equal(rows[0].final_severity, undefined);
  assert.equal(raised.get("F1")[0].raiser, "b");
});

test("the author's own vote is never counted (S8)", () => {
  const { rows } = count([entry("F1")], [v("a", "F1", VOTE.PRIORITIZE), v("b", "F1", VOTE.CONFIRM), v("c", "F1", VOTE.CONFIRM)]);
  assert.equal(rows[0].n, 2);
  assert.equal(rows[0].p, 0);
});

test("R2- findings are ungraded; unsupported findings get no row", () => {
  const { rows } = count([entry("R2-1", "a", RED, { graded: false }), entry("F1", "a", YELLOW, { unsupported: true })], []);
  assert.deepEqual(rows.map((r) => [r.finding, r.status]), [["R2-1", TALLY_STATUS.UNGRADED]]);
});

test("count agrees with tally() row by row", () => {
  const { rows } = count([entry("F1")], [v("b", "F1", VOTE.PRIORITIZE), v("c", "F1", VOTE.OVER_RATE), v("d", "F1", VOTE.CONFIRM)]);
  const want = tally(YELLOW, 3, 1, 1, 1);
  for (const k of ["net", "threshold", "movement", "final_severity", "convergence", "gating"]) assert.equal(rows[0][k], want[k]);
});

/* ── ranking, side-notes, gate outcome ───────────────────────────────────── */

test("held, minority and unsupported findings are not rankable", () => {
  const es = [entry("F1"), entry("F2"), entry("F3"), entry("F4", "a", YELLOW, { unsupported: true })];
  const rows = [{ finding: "F1", status: TALLY_STATUS.GRADED }, { finding: "F2", status: TALLY_STATUS.HELD }, { finding: "F3", status: TALLY_STATUS.MINORITY_REPORT }];
  assert.deepEqual(rankable(es, rows), ["F1"]);
});

test("side-notes flag the threshold boundary and same-brief unanimity, flag-only", () => {
  const { rows } = count([entry("F1"), entry("F2")], [v("b", "F1", VOTE.PRIORITIZE), v("c", "F1", VOTE.CONFIRM), v("b", "F2", VOTE.OVER_RATE), v("c", "F2", VOTE.OVER_RATE), v("d", "F2", VOTE.OVER_RATE)]);
  const notes = sideNotes(rows, []);
  assert.deepEqual(notes.map((n) => [n.regime, n.findings]), [[SIDE_NOTE.THRESHOLD_BOUNDARY, ["F1"]], [SIDE_NOTE.UNANIMOUS_SAME_BRIEF, ["F2"]]]);
  assert.equal(rows[0].final_severity, SEVERITY.RED, "a side-note never changes the count");
});

test("gate outcome: pass when nothing gates, self-heal below the bound, bound-reached at cycle 3 (S7)", () => {
  assert.equal(gateOutcome(1, []), GATE_RESULT.PASS);
  assert.equal(gateOutcome(2, ["F1"]), GATE_RESULT.SELF_HEAL);
  assert.equal(gateOutcome(3, ["F1"]), GATE_RESULT.BOUND_REACHED);
});

/* ── rules extracted from the sequencer (S10, S11, I3, the failure rule) ── */

test("S11: peers first (not an author, not a raiser), then the operator", () => {
  const e = { id: "F1", author: "a", co_authors: [{ persona: "b" }] };
  const reasons = [{ raiser: "c" }];
  assert.deepEqual(provisionRoute(e, reasons, ["a", "b", "c", "d"], []), { ask: HELD_ROUTE.PEER, peers: ["d"] });
  const peerNo = { route: HELD_ROUTE.PEER, supplied: false };
  assert.equal(provisionRoute(e, reasons, ["a", "b", "c", "d"], [peerNo]).ask, HELD_ROUTE.OPERATOR);
  const peerYes = { route: HELD_ROUTE.PEER, supplied: true, note: "10k rows" };
  assert.deepEqual(provisionRoute(e, reasons, ["a", "b", "c", "d"], [peerYes]), { route: HELD_ROUTE.PEER, supplied: peerYes });
  assert.equal(provisionRoute(e, reasons, ["a", "b", "c"], []).ask, HELD_ROUTE.OPERATOR, "no peer left: straight to the operator");
  const opNo = { route: HELD_ROUTE.OPERATOR, supplied: false };
  assert.deepEqual(provisionRoute(e, reasons, ["a", "b", "c"], [opNo]), { route: HELD_ROUTE.OPERATOR, supplied: null });
});

test("S11: a revision returns a new entry, clears the flag, and marks evidence-free revisions unsupported", () => {
  const e = { id: "F1", author: "a", authored_severity: YELLOW, locator: "a.py:1", pull_quote: "old", evidence: [{ kind: "file_line", ref: "a.py:1" }], need_info: true, need_info_reasons: [{ raiser: "a" }], graded: true };
  const next = applyRevision(e, { proposed_severity: GREEN, locator: "a.py:2", pull_quote: "new", evidence: [], confidence_on_hand: "high" });
  assert.equal(e.pull_quote, "old", "the original entry is untouched");
  assert.deepEqual([next.authored_severity, next.locator, next.need_info, next.need_info_reasons, next.unsupported], [GREEN, "a.py:2", false, undefined, true]);
});

test("S10: an author round with gate questions waits until answered, then re-authors", () => {
  assert.equal(gateWait({ findings: [] }, false), "final");
  assert.equal(gateWait({ gate_questions: [{ need: "n", question: "q?" }] }, false), "ask");
  assert.equal(gateWait({ gate_questions: [{ need: "n", question: "q?" }] }, true), "next");
});

test("I3 after evidence, and the failure rule: unseat returns new rows and never refills the seat", () => {
  assert.equal(quorateAfterEvidence(2), false);
  assert.equal(quorateAfterEvidence(3), true);
  const rows = [{ persona: "a", decision: RSVP.JOIN, seated: true, seat: SEAT.ORDINARY }, { persona: "b", decision: RSVP.JOIN, seated: false, capped: true }];
  const out = unseat(rows, "a", { failure: FAILURE.SILENT, reason: "no reply" });
  assert.equal(rows[0].seated, true, "input untouched");
  assert.deepEqual([out[0].decision, out[0].seated, out[0].seat, out[0].failure], [RSVP.ABSTAIN, false, undefined, FAILURE.SILENT]);
  assert.equal(out[1].seated, false, "the capped joiner is not seated in its place");
});

test("seat marks joiners the cap left out as capped", () => {
  const rows = ["a", "b", "c", "d", "e", "f"].map((p, i) => ({ persona: p, decision: RSVP.JOIN, applies: Array(6 - i).fill("d"), expected: "🟡" }));
  const s = seat(rows);
  assert.deepEqual(s.rows.filter((r) => r.capped).map((r) => r.persona), ["f"]);
});

test("every rule the conductor loop names has its engine export", () => {
  const loop = readFileSync(new URL("../CONDUCTOR.md", import.meta.url), "utf8");
  assert.match(loop, /### The conductor loop/);
  for (const name of ["seat", "quorate", "unseat", "ballot", "provisionRoute", "applyRevision", "count", "tally", "gateOutcome", "gateWait", "quorateAfterEvidence", "sideNotes"]) {
    assert.equal(typeof engine[name], "function", `engine.mjs exports ${name}`);
  }
});
