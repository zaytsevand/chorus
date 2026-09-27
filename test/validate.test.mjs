import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validate, tally, KINDS } from "../bin/validate.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (name) => JSON.parse(readFileSync(join(ROOT, "examples", name), "utf8"));
const clone = (x) => structuredClone(x);
const messages = (r) => r.errors.map((e) => `${e.path}: ${e.message}`).join("\n");
const expectError = (kind, data, re) => {
  const r = validate(kind, data);
  assert.equal(r.valid, false, `expected invalid, got valid`);
  assert.match(messages(r), re);
};
const cli = (...args) => spawnSync(process.execPath, [join(ROOT, "bin", "validate.mjs"), ...args], { encoding: "utf8" });

/* ── every kind: one valid, one invalid example ─────────────────────────── */

for (const kind of KINDS) {
  test(`${kind}: valid example passes`, () => {
    const r = validate(kind, load(`${kind}.valid.json`));
    assert.equal(r.valid, true, messages(r));
  });
  test(`${kind}: invalid example fails`, () => {
    assert.equal(validate(kind, load(`${kind}.invalid.json`)).valid, false);
  });
}

test("unknown field comes back as did-you-mean", () => {
  const r = validate("rsvp", load("rsvp.invalid.json"));
  const e = r.errors.find((x) => /unknown field "apllies"/.test(x.message));
  assert.ok(e);
  assert.match(e.hint, /did you mean "applies"/);
});

/* ── the Stage-4 rule itself (GATE-PRIMITIVE.md § Stage 4) ──────────────── */

test("tally: T = max(1, floor(N/2)), one level per tally, symmetric", () => {
  assert.equal(tally("🟡", 4, 1, 0, 0).final_severity, "🟡"); // net 1 < T 2
  assert.equal(tally("🟡", 4, 2, 0, 0).final_severity, "🔴"); // net 2 ≥ T 2
  assert.equal(tally("🔴", 4, 3, 0, 0).final_severity, "🔴"); // capped
  assert.equal(tally("🔴", 4, 0, 0, 4).final_severity, "🟡"); // 4–0 demotes one level only
  assert.equal(tally("🟢", 4, 0, 0, 2).final_severity, "dropped");
  assert.equal(tally("🟡", 5, 2, 0, 0).threshold, 2);
  assert.equal(tally("🟡", 2, 1, 0, 0).threshold, 1);
  assert.equal(tally("🟡", 1, 0, 0, 0).threshold, 1); // floor holds at 1
  const agreed = tally("🟡", 3, 0, 3, 0);
  assert.equal(agreed.movement, "agreed");
  assert.equal(agreed.convergence, 3);
  assert.equal(agreed.net, 0); // CONFIRM excluded from net
  assert.equal(tally("🟡", 3, 0, 0, 0).status, "unvoted");
  assert.equal(tally("🟡", 4, 2, 1, 1).movement, "agreed"); // held with CONFIRM votes
  assert.equal(tally("🟡", 4, 1, 0, 0).movement, "hold");
});

/* ── arithmetic violations in a review record ───────────────────────────── */

const rr = () => load("review-record.valid.json");
const row = (d, id) => d.tally.find((r) => r.finding === id);

test("net must be P − O", () => { const d = rr(); row(d, "F4").net = 1; expectError("review-record", d, /tally\[3\] → net: is 1, the arithmetic gives 0/); });
test("threshold must follow N", () => { const d = rr(); row(d, "F1").threshold = 2; expectError("review-record", d, /threshold: is 2, the arithmetic gives 1/); });
test("final severity follows the threshold rule", () => { const d = rr(); row(d, "F2").final_severity = "🟢"; expectError("review-record", d, /final_severity: is "🟢", the arithmetic gives "🟡"/); });
test("convergence must be P + C", () => { const d = rr(); row(d, "F1").convergence = 2; expectError("review-record", d, /convergence: is 2, the arithmetic gives 3/); });
test("gating iff final 🔴", () => { const d = rr(); row(d, "F1").gating = false; expectError("review-record", d, /gating: is false/); });
test("no tally at N < 2", () => {
  const d = rr(); Object.assign(row(d, "F4"), { n: 1, p: 1, c: 0, o: 0, net: 1, threshold: 1, movement: "escalate", final_severity: "🔴", convergence: 1, gating: true });
  expectError("review-record", d, /must not run at N < 2/);
});
test("votes cannot outnumber N", () => { const d = rr(); row(d, "F4").n = 2; expectError("review-record", d, /exceeds N = 2/); });
test("N cannot exceed seated non-authors (S8)", () => { const d = rr(); row(d, "F6").n = 4; row(d, "F6").threshold = 2; expectError("review-record", d, /exceeds the seated non-author personas/); });
test("votes cast but status unvoted", () => { const d = rr(); row(d, "F4").status = "unvoted"; expectError("review-record", d, /status is unvoted, but votes were cast/); });
test("authored severity must match the register", () => { const d = rr(); row(d, "F4").authored_severity = "🔴"; expectError("review-record", d, /differs from the register/); });

/* ── other review-record rules ──────────────────────────────────────────── */

test("held finding excluded from the top five", () => {
  const d = rr();
  d.top_five[4] = { rank: 5, finding: "F5", pull_quote: "I cannot tell whether backpressure is intended here.", locator: "src/export/csv.py:60-90", final_severity: "🟡", cost: "low", value: "Unknown until ruled.", convergence: 0 };
  expectError("review-record", d, /"F5" is held .* excluded from the top five/);
});
test("held tally row must be listed under held", () => { const d = rr(); d.held = []; expectError("review-record", d, /held in the tally but not listed/); });
test("held row carries no post-tally severity", () => { const d = rr(); row(d, "F5").final_severity = "🟡"; expectError("review-record", d, /held finding has no post-tally severity/); });
test("open NEED_INFO cannot be counted", () => {
  const d = rr(); Object.assign(row(d, "F5"), { status: "graded", n: 3, p: 0, c: 1, o: 0, net: 0, threshold: 1, movement: "agreed", final_severity: "🟡", convergence: 1, gating: false });
  expectError("review-record", d, /open NEED_INFO but was counted/);
});
test("derived findings are graded:false", () => { const d = rr(); d.register.find((e) => e.id === "R2-1").graded = true; expectError("review-record", d, /graded: must be false/); });
test("derived findings are not tallied", () => {
  const d = rr(); Object.assign(row(d, "R2-1"), { status: "graded", n: 3, p: 0, c: 1, o: 0, net: 0, threshold: 1, movement: "agreed", convergence: 1, gating: false });
  expectError("review-record", d, /R2- finding "R2-1" must have status ungraded/);
});
test("unique finding ids", () => { const d = rr(); d.register[1].id = "F1"; expectError("review-record", d, /duplicate finding id "F1"/); });
test("unsupported findings stay out of the tally", () => {
  const d = rr(); d.tally.push({ finding: "F7", authored_severity: "🟡", status: "unvoted", n: 3, p: 0, c: 0, o: 0, net: 0, threshold: 1, movement: "unvoted", final_severity: "🟡", convergence: 0, gating: false });
  expectError("review-record", d, /unsupported and must not be in the tally/);
});
test("evidence-less finding must be marked unsupported", () => { const d = rr(); delete d.register[6].unsupported; expectError("review-record", d, /must be marked unsupported/); });
test("every supported entry has a tally row", () => { const d = rr(); d.tally = d.tally.filter((r) => r.finding !== "F6"); expectError("review-record", d, /"F6" has no tally row/); });
test("top-five pull-quote is verbatim", () => { const d = rr(); d.top_five[0].pull_quote = "The aggregate lacks a root."; expectError("review-record", d, /differs from the register's pull-quote/); });
test("author never converges with own finding", () => {
  const d = rr(); d.register[0].convergence_notes.push({ persona: "eric-evans-advisor", pull_quote: "I agree with myself." });
  expectError("review-record", d, /converges with its own finding/);
});
test("quorum branch agrees with J", () => { const d = rr(); d.quorum.joiners = 2; expectError("review-record", d, /the roster has 4 JOIN replies/); });

/* ── ruling_ref ─────────────────────────────────────────────────────────── */

test("ruling_ref '#' must resolve to a local ruling", () => {
  const d = rr(); d.rulings_cited.push({ id: "R-1", record: "#" });
  expectError("review-record", d, /holds no such local ruling/);
  d.local_rulings = [{ id: "R-1", created: "2026-09-27T09:00Z", updated: "2026-09-27T09:00Z", about: "Is the export size capped?", said: "Cap it at one million rows.", source: "chat, 2026-09-27" }];
  assert.equal(validate("review-record", d).valid, true);
});
test("ruling_ref id must be well-formed", () => { const d = rr(); d.rulings_cited[0].id = "ruling 3"; expectError("review-record", d, /rulings_cited\[0\] → id/); });
test("ruling_ref record must be a JSON path, URL or '#'", () => { const d = rr(); d.rulings_cited[0].record = "the brief"; expectError("review-record", d, /not a JSON record path/); });

/* ── persona outputs ────────────────────────────────────────────────────── */

test("vote on own finding is refused (S8)", () => {
  const d = load("vote-report.valid.json"); d.votes.push({ finding: "F4", confidence_on_hand: "high", vote: "CONFIRM", reason: "Mine, and right." });
  expectError("vote-report", d, /votes on its own finding "F4"/);
});
test("low confidence must vote NEED_INFO", () => { const d = load("vote-report.valid.json"); d.votes[2].vote = "CONFIRM"; expectError("vote-report", d, /must be "NEED_INFO"/); });
test("rsvp word limit is 80", () => { const d = load("rsvp.valid.json"); d.reason = "word ".repeat(80).trim(); expectError("rsvp", d, /limit is 80/); });
test("JOIN needs a cited delta", () => { const d = load("rsvp.valid.json"); d.decision = "JOIN"; d.applies = []; expectError("rsvp", d, /applies: needs at least 1/); });
test("finding report word limit is 700 in review mode only", () => {
  const d = load("finding-report.valid.json"); d.findings[0].claim = "word ".repeat(700).trim();
  expectError("finding-report", d, /limit is 700/);
  d.mode = "sdlc";
  assert.equal(validate("finding-report", d).valid, true);
});
test("low confidence finding must raise NEED_INFO", () => { const d = load("finding-report.valid.json"); d.findings[1].need_info = false; expectError("finding-report", d, /need_info: must be true/); });

/* ── ledger ─────────────────────────────────────────────────────────────── */

const sl = () => load("sdlc-log.valid.json");
test("complete run with an open gating 🔴 is refused (S4)", () => { const d = sl(); d.gates[1].red_resolutions[0].disposition = "open"; expectError("sdlc-log", d, /no resolved\/waived row, yet the run is complete/); });
test("third uncleared cycle must escalate (S7)", () => {
  const d = sl(); const g = clone(d.gates[1]); g.cycle = 3; g.red_resolutions[0].disposition = "open"; g.outcome = { result: "self-heal" };
  d.status = "in-progress"; d.gates.splice(3, 0, g);
  expectError("sdlc-log", d, /third cycle left a 🔴 uncleared/);
});
test("escalation before the third cycle is refused", () => { const d = sl(); d.status = "halted-awaiting-operator"; d.gates[1].outcome = { result: "escalated" }; expectError("sdlc-log", d, /escalated before the third cycle/); });
test("cycles are consecutive", () => { const d = sl(); d.gates[2].cycle = 3; expectError("sdlc-log", d, /where cycle 2 was expected/); });
test("waiver needs the operator's ruling_ref", () => { const d = sl(); d.gates[1].red_resolutions[0].disposition = "waived"; expectError("sdlc-log", d, /missing "ruling_ref"/); });

/* ── decisions ──────────────────────────────────────────────────────────── */

test("an unlisted decision point is 🔴", () => { const d = load("decision.invalid.json"); delete d.catalog_row; expectError("decision", d, /no catalog row means 🔴/); });
test("a settled 🔴 cites the operator's ruling", () => { const d = load("decision.valid.json"); delete d.ruling_ref; expectError("decision", d, /must cite the operator's ruling/); });

/* ── schema hygiene ─────────────────────────────────────────────────────── */

test("every schema object is closed and every field described", () => {
  const problems = [];
  const walk = (node, path, inClause) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`, inClause));
    if (node.properties && !inClause) {
      if (node.additionalProperties !== false) problems.push(`${path}: not closed`);
      for (const [k, v] of Object.entries(node.properties)) if (!v.description) problems.push(`${path}.${k}: no description`);
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === "properties") for (const [pk, pv] of Object.entries(v)) walk(pv, `${path}.${pk}`, inClause);
      else walk(v, `${path}/${k}`, inClause || ["allOf", "if", "then"].includes(k));
    }
  };
  for (const f of readdirSync(join(ROOT, "schema"))) walk(JSON.parse(readFileSync(join(ROOT, "schema", f), "utf8")), f, false);
  assert.deepEqual(problems, []);
});

/* ── CLI contract ───────────────────────────────────────────────────────── */

test("cli: exit 0 valid, 1 invalid, 2 usage", () => {
  assert.equal(cli("ruling", join(ROOT, "examples/ruling.valid.json")).status, 0);
  assert.equal(cli("ruling", join(ROOT, "examples/ruling.invalid.json")).status, 1);
  assert.equal(cli("ruling").status, 2);
  const bad = cli("rulling", join(ROOT, "examples/ruling.valid.json"));
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /did you mean "ruling"/);
  assert.equal(cli("ruling", "/nonexistent.json").status, 2);
});
test("cli: --json output", () => {
  const r = cli("review-record", join(ROOT, "examples/review-record.invalid.json"), "--json");
  assert.equal(r.status, 1);
  const out = JSON.parse(r.stdout);
  assert.equal(out.valid, false);
  assert.ok(out.errors.length > 0);
});
