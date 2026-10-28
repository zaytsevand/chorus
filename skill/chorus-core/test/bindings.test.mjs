import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bindings } from "../bin/bindings.mjs";
import { validate } from "../bin/validate.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = () => mkdtempSync(join(tmpdir(), "chorus-bindings-"));
const brief = (skills) => { mkdirSync(join(skills, "problem-brief"), { recursive: true }); writeFileSync(join(skills, "problem-brief", "SKILL.md"), "x"); };
const provider = (b, port) => b.block.ports.find((p) => p.port === port).provider;
const empty = () => { const h = tmp(); return { cwd: tmp(), env: { CLAUDE_HOME: h, HOME: h } }; };

test("no brief anywhere: decision sink and ruling lookup take the defaults", () => {
  const b = bindings(empty());
  assert.equal(b.brief, null);
  assert.equal(provider(b, "decision-sink"), "default");
  assert.equal(provider(b, "ruling-lookup"), "default");
  assert.equal(provider(b, "record-validator"), "chorus-core");
});

test("a brief in the project's .claude/skills is found first", () => {
  const o = empty(); brief(join(o.cwd, ".claude", "skills")); brief(join(o.env.CLAUDE_HOME, "skills"));
  const b = bindings(o);
  assert.equal(b.brief, join(o.cwd, ".claude", "skills", "problem-brief"));
  assert.equal(provider(b, "decision-sink"), "problem-brief");
  assert.equal(provider(b, "ruling-lookup"), "problem-brief");
});

test("a brief under CLAUDE_HOME is found", () => {
  const o = empty(); brief(join(o.env.CLAUDE_HOME, "skills"));
  assert.equal(bindings(o).brief, join(o.env.CLAUDE_HOME, "skills", "problem-brief"));
});

test("a brief in a CHORUS_SKILL_PATH dir is found", () => {
  const o = empty(); const a = tmp(), b = tmp(); brief(b);
  o.env.CHORUS_SKILL_PATH = `${a}::${b}`;
  assert.equal(bindings(o).brief, join(b, "problem-brief"));
});

test("a problem-brief dir without SKILL.md does not count", () => {
  const o = empty(); mkdirSync(join(o.env.CLAUDE_HOME, "skills", "problem-brief"), { recursive: true });
  assert.equal(bindings(o).brief, null);
});

test("the block is a valid review-record bindings block, and the CLI prints it", () => {
  const o = empty(); brief(join(o.env.CLAUDE_HOME, "skills"));
  const r = spawnSync(process.execPath, [join(ROOT, "bin", "bindings.mjs")], { cwd: o.cwd, env: { ...process.env, ...o.env, CHORUS_SKILL_PATH: "" }, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stderr, /problem-brief: found/);
  const block = JSON.parse(r.stdout);
  assert.deepEqual(block, bindings(o).block);
  const d = JSON.parse(readFileSync(join(ROOT, "examples", "review-record.valid.json"), "utf8"));
  d.bindings.ports = block.ports; // keep the example's recoveries: they match its abstentions
  const v = validate("review-record", d);
  assert.equal(v.valid, true, JSON.stringify(v.errors));
});
