// Drift between the chorus canon and what this skill encodes from it.
//
// The canon owns the rules (CONDUCTOR.md § Ports, GATE-PRIMITIVE.md § Stage 4);
// the validator and schema re-encode some of them. These tests parse the
// canon's tables and lists, never its prose, and fail when the two part ways.
// The canon wins: fix this skill, not the test.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validate, tally, SCHEMA_MAJOR } from "../bin/validate.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CORE = join(ROOT, "..", "chorus-core");
const read = (p) => readFileSync(p, "utf8");
const load = (name) => JSON.parse(read(join(ROOT, "examples", name)));

/** The lines of one `## ` section, heading excluded. */
function section(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  assert.ok(start >= 0, `canon section "## ${heading}" not found`);
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end);
}

/** Rows of the first markdown table in `lines`, as arrays of trimmed cells. */
function tableRows(lines) {
  const rows = [];
  let inTable = false;
  for (const l of lines) {
    const t = l.trim();
    if (!t.startsWith("|")) { if (inTable) break; continue; }
    inTable = true;
    const cells = t.slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim());
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue;
    rows.push(cells);
  }
  return rows.slice(1); // drop the header row
}

/** "record renderer / publisher" → "record-renderer", as the schema spells it. */
const portId = (name) => name.split("/")[0].trim().toLowerCase().replace(/\s+/g, "-");

const conductor = read(join(CORE, "CONDUCTOR.md"));
const ports = tableRows(section(conductor, "Ports"));
const stage4 = section(read(join(CORE, "GATE-PRIMITIVE.md")), "Stage 4 — Tally");

/* ── CONDUCTOR § Ports ──────────────────────────────────────────────────── */

test("the schema knows exactly the ports CONDUCTOR § Ports declares", () => {
  const canon = ports.map((r) => portId(r[0])).sort();
  const common = JSON.parse(read(join(ROOT, "schema", "common.schema.json")));
  const schema = [...common.$defs.bindings.properties.ports.items.properties.port.enum].sort();
  assert.deepEqual(schema, canon);
});

test("SKILL.md binds exactly the ports CONDUCTOR § Ports declares", () => {
  const skill = tableRows(section(read(join(ROOT, "SKILL.md")), "Bindings"));
  assert.deepEqual(skill.map((r) => portId(r[0])).sort(), ports.map((r) => portId(r[0])).sort());
});

test("the validator supports the schema major the canon expects", () => {
  const row = ports.find((r) => portId(r[0]) === "record-validator");
  assert.ok(row, "no record validator row in CONDUCTOR § Ports");
  const m = row[1].match(/schema major (\d+)/);
  assert.ok(m, "the record validator row states no schema major");
  assert.equal(SCHEMA_MAJOR, Number(m[1]));
});

/* SKILL.md restates the record validator row's failure policy as an exit-code
   table, because agents do not open the canon from a project. The restated
   cells must carry the canon's own clauses, word for word. */
test("SKILL.md's exit-code table carries the canon's failure policy verbatim", () => {
  const row = ports.find((r) => portId(r[0]) === "record-validator");
  assert.ok(row, "no record validator row in CONDUCTOR § Ports");
  const retry = row[1].match(/a failing persona reply gets (.+?)\.(?:\s|$)/);
  assert.ok(retry, "the record validator row states no retry rule for a failing reply");
  const drift = row[1].match(/a "version mismatch" is (.+?)\.?\s*$/);
  assert.ok(drift, "the record validator row states no rule for a version mismatch");
  const exits = tableRows(section(read(join(ROOT, "SKILL.md")), "Finding the tools"));
  const cell = (code) => {
    const r = exits.find((x) => x[0] === code);
    assert.ok(r, `SKILL.md § Finding the tools has no exit ${code} row`);
    return r[r.length - 1];
  };
  assert.ok(cell("1").includes(retry[1]), `exit 1 row must contain the canon's "${retry[1]}"`);
  assert.ok(cell("3").includes(drift[1]), `exit 3 row must contain the canon's "${drift[1]}"`);
});

/* ── GATE-PRIMITIVE § Stage 4 ───────────────────────────────────────────── */

test("the threshold is the canon's T = max(a, floor(N / b))", () => {
  const m = stage4.join("\n").match(/`T = max\((\d+), floor\(N \/ (\d+)\)\)`/);
  assert.ok(m, "Stage 4 states no threshold formula");
  const [a, b] = [Number(m[1]), Number(m[2])];
  for (let n = 1; n <= 12; n++) assert.equal(tally("🟡", n, 0, 0, 0).threshold, Math.max(a, Math.floor(n / b)), `N = ${n}`);
});

test("movement follows the canon's condition table", () => {
  const rows = tableRows(stage4);
  const effect = (cond) => {
    const r = rows.find((x) => x[0].replace(/\\/g, "") === cond);
    assert.ok(r, `Stage 4 table has no row "${cond}"`);
    return r[1].replace(/\*/g, "").split(/[\s:]/)[0].toLowerCase();
  };
  assert.equal(rows.length, 3, "Stage 4 table changed shape");
  // One sample per region at N = 4 (T = 2), CONFIRM kept at zero.
  assert.equal(tally("🟡", 4, 3, 0, 1).movement, effect("`net ≥ T`"));
  assert.equal(tally("🟡", 4, 0, 0, 2).movement, effect("`net ≤ −T`"));
  assert.equal(tally("🟡", 4, 1, 0, 0).movement, effect("`|net| < T`"));
});

test("escalation walks the canon's severity chain one level, capped", () => {
  const up = tableRows(stage4).find((r) => /net ≥ T/.test(r[0]))[1];
  const chain = [...up.matchAll(/🟢|🟡|🔴/gu)].map((m) => m[0]).slice(0, 3);
  for (let i = 0; i < chain.length; i++) {
    const want = chain[Math.min(i + 1, chain.length - 1)];
    assert.equal(tally(chain[i], 4, 4, 0, 0).final_severity, want, `from ${chain[i]}`);
  }
});

/* Each settled case the canon lists, and how the validator holds it. A case
   the validator cannot hold is listed with null and the reason. Adding or
   removing a case in the canon fails the first test until this map follows. */

const rr = () => load("review-record.valid.json");
const row = (d, id) => d.tally.find((r) => r.finding === id);
const refused = (kind, d, re) => {
  const r = validate(kind, d);
  assert.equal(r.valid, false);
  assert.match(r.errors.map((e) => e.message + " " + (e.hint ?? "")).join("\n"), re);
};

const SETTLED = {
  1: () => { const d = rr(); row(d, "F1").n = 4; refused("review-record", d, /P \+ C \+ O/); },
  2: () => assert.equal(tally("🟡", 4, 2, 1, 1).movement, "agreed"),
  3: () => { const d = rr(); d.tally = d.tally.filter((r) => r.finding !== "F2"); refused("review-record", d, /"F2" has no tally row/); },
  4: () => { const d = rr(); row(d, "R2-1").status = "graded"; refused("review-record", d, /must have status ungraded/); },
  5: null, // reply caps are upper bounds: nothing in a record to check
  6: () => { const d = load("sdlc-log.valid.json"); d.gates[2].cycle = 3; refused("sdlc-log", d, /cycle 2 was expected/); },
  7: () => { const d = rr(); Object.assign(row(d, "F4"), { n: 1, p: 1, c: 0, o: 0, net: 1 }); refused("review-record", d, /minority-report/); },
};

test("every settled case in the canon is accounted for here", () => {
  const start = stage4.findIndex((l) => /\*\*Settled cases\*\*/.test(l));
  assert.ok(start >= 0, "Stage 4 lists no settled cases");
  const nums = [];
  for (const l of stage4.slice(start + 1)) {
    if (/^\s*- \*\*/.test(l)) break; // the next bullet of Stage 4
    const m = l.match(/^\s+(\d+)\.\s/);
    if (m) nums.push(Number(m[1]));
  }
  assert.deepEqual(nums, Object.keys(SETTLED).map(Number));
});

for (const [n, check] of Object.entries(SETTLED)) {
  if (check) test(`settled case ${n} is held by the validator`, check);
}
