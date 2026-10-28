import { test } from "node:test";
import assert from "node:assert/strict";
import { ballot, count, gateOutcome, quorate, rankable, register, seat, sideNotes, tally } from "../bin/engine.mjs";
import { FINAL_SEVERITY, GATE_RESULT, MOVEMENT, RSVP, SEAT, SEATING_BAND, SEVERITY, SIDE_NOTE, TALLY_STATUS, VOTE } from "../bin/vocab.mjs";

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
  const r = register([{ persona: "a", findings: [f(), f({ evidence: [] })] }, { persona: "b", findings: [f()] }]).map((x) => x.entry);
  assert.deepEqual(r.map((e) => e.id), ["F1", "F2", "F3"]);
  assert.equal(r[1].unsupported, true);
  assert.deepEqual(r.map((e) => e.author), ["a", "a", "b"]);
});

test("a ballot never holds the voter's own findings or unsupported ones (S8, I8)", () => {
  const r = register([{ persona: "a", findings: [f(), f({ evidence: [] })] }, { persona: "b", findings: [f()] }]).map((x) => x.entry);
  assert.deepEqual(ballot(r, "a").map((e) => e.id), ["F3"]);
  assert.deepEqual(ballot(r, "c").map((e) => e.id), ["F1", "F3"]);
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
