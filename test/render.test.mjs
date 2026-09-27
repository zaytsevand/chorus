import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../bin/render.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (name) => JSON.parse(readFileSync(join(ROOT, "examples", name), "utf8"));
const run = (...args) => spawnSync(process.execPath, [join(ROOT, "bin", "render.mjs"), ...args], { encoding: "utf8" });

test("review record renders the skeleton in canon order", () => {
  const md = render("review-record", load("review-record.valid.json"));
  const order = ["## 1. TL;DR", "## 2. Roster (this round)", "## 3. Findings register", "## 4. Consolidation matrix",
    "## 5. Conflicts", "## 6. Top five", "## 7. Held findings", "## 8. Next-chorus baseline", "## Appendix"];
  let at = -1;
  for (const h of order) { const i = md.indexOf(h); assert.ok(i > at, `${h} missing or out of order`); at = i; }
  assert.match(md, /"The Order aggregate has no root to enforce its invariants\."/);
  assert.match(md, /\| F1 \| 🟡 \| 2 \| 1 \| 0 \| 2 \| 🔴 \| 3 \| graded \|/);
  assert.match(md, /R2-1\*\* \[ungraded\]/);
  assert.match(md, /\[unsupported\]/);
});

test("sdlc log renders gates, tally and self-audit", () => {
  const md = render("sdlc-log", load("sdlc-log.valid.json"));
  for (const h of ["# Agent-SDLC Ledger: checkout-retry", "## Gate A — design — cycle 1", "### Premise pass", "## Gate B — plan/tasks — cycle 2",
    "### 🔴 resolution log", "## Provisional decisions (review & override)", "## Memory update (sign-off)", "## Self-audit (S1–S11)"]) {
    assert.ok(md.includes(h), `${h} missing`);
  }
  assert.match(md, /B-self-heal-1/);
});

test("renderer refuses invalid input and writes nothing", () => {
  const out = join(mkdtempSync(join(tmpdir(), "cr-")), "out.md");
  const r = run("review-record", join(ROOT, "examples/review-record.invalid.json"), out);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /refusing to render/);
  assert.equal(existsSync(out), false);
});

test("renderer cli writes a page", () => {
  const out = join(mkdtempSync(join(tmpdir(), "cr-")), "out.md");
  const r = run("sdlc-log", join(ROOT, "examples/sdlc-log.valid.json"), out);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(readFileSync(out, "utf8").startsWith("# Agent-SDLC Ledger"));
  assert.equal(run("rsvp", "x", "y").status, 2);
});
