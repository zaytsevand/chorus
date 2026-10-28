// The vocabulary registry (schema/vocab.schema.json) is the one home of every
// closed token set. These tests fail when a schema, the code or the prose spells
// a vocabulary by hand instead of pointing at the registry.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VOCAB, codeName } from "../bin/vocab.mjs";

const CORE = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = join(CORE, "..", "..");
const read = (p) => readFileSync(p, "utf8");
const MEMBERS = new Set(Object.values(VOCAB).flat());
const setsOf = (m) => Object.entries(VOCAB).filter(([, l]) => l.includes(m)).map(([k]) => k);

/* ── schemas: enums live only in the registry ────────────────────────────── */

/** Every enum/const in a schema, with whether it sits in an if/then clause. */
function walk(node, path, inCond, out) {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`, inCond, out));
  if (!node || typeof node !== "object") return;
  if (node.enum) out.push({ path, values: node.enum, inCond });
  if (typeof node.const === "string") out.push({ path, values: [node.const], inCond, isConst: true });
  for (const [k, v] of Object.entries(node)) walk(v, `${path}/${k}`, inCond || k === "if" || k === "then", out);
}

const SCHEMAS = readdirSync(join(CORE, "schema")).filter((f) => f.endsWith(".schema.json") && f !== "vocab.schema.json");

test("no inline enum outside the registry; conditions and consts use registry members only", () => {
  const bad = [];
  for (const f of SCHEMAS) {
    const found = [];
    walk(JSON.parse(read(join(CORE, "schema", f))), "", false, found);
    for (const x of found) {
      if (!x.inCond && !x.isConst) bad.push(`${f}${x.path}: inline enum ${JSON.stringify(x.values)} — $ref a vocab.schema.json $def`);
      for (const v of x.values) if (!MEMBERS.has(v)) bad.push(`${f}${x.path}: "${v}" is not in any registry vocabulary`);
    }
  }
  assert.deepEqual(bad, []);
});

test("every registry vocabulary is a non-empty list of unique strings with unique code names", () => {
  const vocab = JSON.parse(read(join(CORE, "schema", "vocab.schema.json"))).$defs;
  for (const [name, def] of Object.entries(vocab)) {
    assert.ok(def.enum.length > 0, name);
    assert.equal(new Set(def.enum).size, def.enum.length, `${name} repeats a member`);
    const names = def.enum.map((m) => codeName(m, def["x-names"]));
    assert.equal(new Set(names).size, names.length, `${name}: two members share a code name`);
    for (const n of names) assert.match(n, /^[A-Z][A-Z0-9_]*$/, `${name}: "${n}" is not a usable code name; add x-names`);
  }
  assert.equal(VOCAB.gate.length, VOCAB.gate_name.length, "gate and gate_name pair by position");
});

/* ── code: no hand-rolled vocabulary literals in bin/ ────────────────────── */

/** A member that cannot be ordinary English or a field name: an emoji, a hyphen, or ALL-CAPS. */
const distinctive = (m) => /\p{Extended_Pictographic}/u.test(m) || m.includes("-") || /^[A-Z][A-Z0-9_]+$/.test(m);

/** Blank comments in place, so line numbers survive. */
const blank = (t) => t.replace(/[^\n]/g, " ");
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|[^:"'`\\])(\/\/.*)$/gm, (_, a, c) => a + blank(c));

/** String literals with their position: '…', "…", and template literals without substitutions. */
function literals(src) {
  const out = [];
  const re = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m;
  while ((m = re.exec(src))) if (!(m[1] === "`" && m[2].includes("${"))) out.push({ value: m[2], at: m.index, end: m.index + m[0].length });
  return out;
}

const lineOf = (src, at) => src.slice(0, at).split("\n").length;

export function codeFindings(file, src) {
  const s = stripComments(src);
  const bad = [];
  for (const l of literals(s)) {
    if (!MEMBERS.has(l.value)) continue;
    const before = s.slice(Math.max(0, l.at - 6), l.at), after = s.slice(l.end, l.end + 4);
    const compared = /[!=]==\s*$/.test(before) || /^\s*[!=]==/.test(after) || /case\s+$/.test(before);
    const inIncludes = /^[^\]\n]*\]\.includes\(/.test(s.slice(l.end, l.end + 200)) && /\[[^\[\]\n]*$/.test(s.slice(Math.max(0, l.at - 200), l.at));
    if (distinctive(l.value) || compared || inIncludes) {
      bad.push(`${file}:${lineOf(s, l.at)}: "${l.value}" is a ${setsOf(l.value).join("/")} member — import it from vocab.mjs`);
    }
  }
  return bad;
}

test("bin/ spells no vocabulary member as a bare literal (vocab.mjs is the only reader of the registry)", () => {
  const files = readdirSync(join(CORE, "bin")).filter((f) => f.endsWith(".mjs") && f !== "vocab.mjs");
  const bad = files.flatMap((f) => codeFindings(`bin/${f}`, read(join(CORE, "bin", f))));
  assert.deepEqual(bad, []);
});

test("the code lint catches what it is for, and leaves prose and field names alone", () => {
  const src = [
    'if (r.status === "held") x();',
    'const v = "OVER-RATE";',
    'if (["pass", "halt"].includes(r)) y();',
    'switch (k) { case "graded": break; }',
    'err("held", "a held finding is not counted");', // a path and a message: fine
    'const msg = "votes OVER-RATE twice";',           // prose containing a token: fine
  ].join("\n");
  const found = codeFindings("t.mjs", src).map((x) => x.match(/"([^"]+)"/)[1]);
  assert.deepEqual(found, ["held", "OVER-RATE", "pass", "halt", "graded"]);
});

/* ── prose: no near-miss spellings of a vocabulary member ────────────────── */

const norm = (t) => t.toLowerCase().replace(/[-_\s]+/g, "");

/** Field names in any schema: `need_info` is a field, not a misspelt NEED_INFO. */
function fieldNames() {
  const names = new Set();
  const visit = (n) => {
    if (Array.isArray(n)) return n.forEach(visit);
    if (!n || typeof n !== "object") return;
    for (const [k, v] of Object.entries(n)) { if (k === "properties") Object.keys(v).forEach((p) => names.add(p)); visit(v); }
  };
  for (const f of readdirSync(join(CORE, "schema"))) if (f.endsWith(".json")) visit(JSON.parse(read(join(CORE, "schema", f))));
  return names;
}

const NEAR = new Map();
for (const m of MEMBERS) if (m.length >= 4) NEAR.set(norm(m), [...(NEAR.get(norm(m)) ?? []), m]);
const FIELDS = fieldNames();

export function proseFindings(file, text) {
  const bad = [];
  for (const m of text.matchAll(/`([^`\n]{3,40})`/g)) {
    const tok = m[1].trim();
    const want = NEAR.get(norm(tok));
    if (!want || want.includes(tok) || FIELDS.has(tok)) continue;
    // A capitalised plain word (`Explore`, the agent) is a name, not a misspelt `explore`.
    if (want.every((w) => /^[a-z]+$/.test(w)) && tok.toLowerCase() === want[0]) continue;
    bad.push(`${file}:${lineOf(text, m.index)}: \`${tok}\` — the registry spells it ${want.map((w) => `\`${w}\``).join(" or ")}`);
  }
  return bad;
}

function markdown(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) markdown(p, out);
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

test("skill and agent prose spells every backticked vocabulary token exactly as the registry does", () => {
  const files = [...markdown(join(REPO, "skill")), ...markdown(join(REPO, "agents")), join(REPO, "README.md"), join(REPO, "CONTRIBUTING.md")].filter(existsSync);
  const bad = files.flatMap((f) => proseFindings(f.slice(REPO.length + 1), read(f)));
  assert.deepEqual(bad, []);
});

test("the prose lint flags near-misses and passes exact members and field names", () => {
  const found = proseFindings("t.md", "`OVER_RATE` `NEED-INFO` `Bound-Reached` `OVER-RATE` `need_info` `minority-report`");
  assert.equal(found.length, 3);
  assert.match(found.join("\n"), /`OVER_RATE`.*`OVER-RATE`[\s\S]*`NEED-INFO`[\s\S]*`Bound-Reached`/);
});

/* ── the roster: registry = plugin manifest = agents/ ────────────────────── */

test("the roster registry, plugin.json agents and agents/*.md name the same personas, each with a lens", () => {
  const plugin = JSON.parse(read(join(REPO, ".claude-plugin", "plugin.json")));
  const manifest = plugin.agents.map((a) => a.replace(/^.*\/|\.md$/g, "")).sort();
  const files = readdirSync(join(REPO, "agents")).filter((f) => f.endsWith(".md")).map((f) => read(join(REPO, "agents", f)).match(/^name:\s*["']?([^"'\s]+)/m)?.[1]).sort();
  const registry = [...VOCAB.roster].sort();
  assert.deepEqual(manifest, registry, "plugin.json agents ≠ vocab roster");
  assert.deepEqual(files, registry, "agents/*.md names ≠ vocab roster");
  const lens = JSON.parse(read(join(CORE, "schema", "vocab.schema.json"))).$defs.roster["x-lens"];
  assert.deepEqual(Object.keys(lens).sort(), registry, "every persona has a lens in x-lens");
});
