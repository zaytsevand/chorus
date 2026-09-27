#!/usr/bin/env node
/**
 * Validate a chorus record, or a shared decision/ruling, before anything counts,
 * publishes or renders it.
 *
 *   node validate.mjs <kind> <file.json> [--json]
 *
 *   kinds: rsvp, finding-report, vote-report, review-record, sdlc-log,
 *          decision, ruling
 *   exit:  0 valid · 1 invalid · 2 usage or unreadable input
 *
 * Two passes:
 *   1. The schema (schema/<kind>.schema.json). Types, required fields, enums,
 *      patterns and unknown fields — an unknown field is matched against the
 *      known ones and comes back as "did you mean".
 *   2. Rules a schema cannot express: the Stage-4 tally arithmetic
 *      (GATE-PRIMITIVE.md), unique ids, R2- findings ungraded, held findings out
 *      of the top five, word limits, cross-references, ruling_ref shape.
 *
 * A program, never a model reading the JSON. Zero dependencies; Node 18+.
 * Only the JSON Schema keywords the bundled schemas use are implemented; any
 * other keyword is reported, not silently ignored.
 */

import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(HERE, "..", "schema");

export const KINDS = ["rsvp", "finding-report", "vote-report", "review-record", "sdlc-log", "decision", "ruling"];

/* ── schemas ─────────────────────────────────────────────────────────────── */

let SCHEMAS = null;
function schemas() {
  if (SCHEMAS) return SCHEMAS;
  SCHEMAS = {};
  for (const f of readdirSync(SCHEMA_DIR)) {
    if (f.endsWith(".schema.json")) SCHEMAS[f] = JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf8"));
  }
  return SCHEMAS;
}

/* ── near-miss field names ───────────────────────────────────────────────── */

function distance(a, b) {
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const row = [i];
    for (let j = 1; j <= n; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[n];
}

export function nearest(word, candidates) {
  let best = null, bestD = Infinity;
  for (const c of candidates) {
    const d = distance(word.toLowerCase(), c.toLowerCase());
    if (d < bestD) { bestD = d; best = c; }
  }
  return bestD <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
}

/* ── schema walk ─────────────────────────────────────────────────────────── */

const KNOWN_KEYWORDS = new Set([
  "$schema", "$id", "$ref", "$defs", "title", "description", "default",
  "type", "required", "properties", "additionalProperties", "items",
  "enum", "const", "pattern", "format",
  "minLength", "maxLength", "minItems", "maxItems", "minimum", "maximum",
  "allOf", "if", "then",
]);

const typeOf = (v) =>
  v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v === "number" ? "number" : typeof v;
const matchesType = (v, t) => (t === "integer" ? Number.isInteger(v) : t === "number" ? typeof v === "number" : typeOf(v) === t);

const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const isTimestamp = (v) => TIMESTAMP.test(v) && !Number.isNaN(Date.parse(v));
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const article = (t) => (/^[aeiou]/.test(t) ? `an ${t}` : `a ${t}`);
const join2 = (p, k) => (p ? `${p} → ${k}` : k);

class SchemaWalker {
  constructor() { this.errors = []; }
  add(path, message, hint) { this.errors.push({ path: path || "(root)", message, hint }); }

  resolve(ref, doc) {
    const [file, frag] = ref.split("#");
    const docName = file || doc;
    let node = schemas()[docName];
    if (!node) throw new Error(`schema reference ${ref} names an unknown file`);
    for (const p of (frag || "").replace(/^\//, "").split("/").filter(Boolean)) node = node?.[p];
    if (!node) throw new Error(`schema reference ${ref} does not resolve`);
    return { schema: node, doc: docName };
  }

  check(value, schema, path, doc) {
    if (schema.$ref) {
      const r = this.resolve(schema.$ref, doc);
      this.check(value, r.schema, path, r.doc);
      return;
    }
    for (const k of Object.keys(schema)) {
      if (!KNOWN_KEYWORDS.has(k)) this.add(path, `the schema uses "${k}", which this validator does not implement`, "extend the validator or simplify the schema");
    }
    if (schema.type && !matchesType(value, schema.type)) {
      this.add(path, `should be ${article(schema.type)}, but is ${article(typeOf(value))}`);
      return;
    }
    if (schema.enum && !schema.enum.includes(value)) this.add(path, `${JSON.stringify(value)} is not allowed here`, `use one of: ${schema.enum.join(", ")}`);
    if (schema.const !== undefined && value !== schema.const) this.add(path, `must be ${JSON.stringify(schema.const)}, is ${JSON.stringify(value)}`);

    if (typeof value === "string") {
      if (schema.minLength && value.length < schema.minLength) this.add(path, `is too short — ${value.length} characters, at least ${schema.minLength}`, schema.description);
      if (schema.maxLength && value.length > schema.maxLength) this.add(path, `is too long — ${value.length} characters, at most ${schema.maxLength}`, schema.description);
      if (schema.pattern && !new RegExp(schema.pattern, "u").test(value)) this.add(path, `"${value}" is not the right shape`, `expected to match ${schema.pattern}`);
      if (schema.format === "date" && !isDate(value)) this.add(path, `"${value}" is not a date`, "write it as YYYY-MM-DD");
      if (schema.format === "date-time" && !isTimestamp(value)) this.add(path, `"${value}" is not a timestamp`, "write it as YYYY-MM-DDTHH:MM with a zone, e.g. 2026-09-15T09:40Z");
    }
    if (typeof value === "number") {
      if (schema.minimum !== undefined && value < schema.minimum) this.add(path, `${value} is below the minimum of ${schema.minimum}`);
      if (schema.maximum !== undefined && value > schema.maximum) this.add(path, `${value} is above the maximum of ${schema.maximum}`);
    }
    if (Array.isArray(value)) {
      if (schema.minItems && value.length < schema.minItems) this.add(path, `needs at least ${schema.minItems} item(s), has ${value.length}`, schema.description);
      if (schema.maxItems !== undefined && value.length > schema.maxItems) this.add(path, `allows at most ${schema.maxItems} item(s), has ${value.length}`, schema.description);
      if (schema.items) value.forEach((v, i) => this.check(v, schema.items, `${path}[${i}]`, doc));
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const props = schema.properties ?? {};
      for (const req of schema.required ?? []) {
        if (value[req] === undefined) this.add(path, `is missing "${req}"`, props[req]?.description);
      }
      for (const [k, v] of Object.entries(value)) {
        if (props[k]) this.check(v, props[k], join2(path, k), doc);
        else if (schema.additionalProperties === false) {
          const known = Object.keys(props);
          const guess = nearest(k, known);
          this.add(path, `has an unknown field "${k}"`, guess ? `did you mean "${guess}"?` : `known fields here: ${known.join(", ")}`);
        }
      }
    }
    for (const clause of schema.allOf ?? []) {
      if (clause.if) {
        if (this.quiet(value, clause.if, doc) && clause.then) this.check(value, clause.then, path, doc);
      } else this.check(value, clause, path, doc);
    }
  }

  quiet(value, schema, doc) {
    const keep = this.errors;
    this.errors = [];
    this.check(value, schema, "", doc);
    const ok = this.errors.length === 0;
    this.errors = keep;
    return ok;
  }
}

/* ── semantic checks ─────────────────────────────────────────────────────── */

const SEV = ["🟢", "🟡", "🔴"];

/** The Stage-4 rule, GATE-PRIMITIVE.md § Stage 4. Returns what a tally row must say. */
export function tally(authored, n, p, c, o) {
  const net = p - o;
  const threshold = Math.max(1, Math.floor(n / 2));
  const voted = p + c + o;
  let final = authored, movement;
  if (voted === 0) movement = "unvoted";
  else if (net >= threshold) { movement = "escalate"; final = SEV[Math.min(2, SEV.indexOf(authored) + 1)]; }
  else if (net <= -threshold) { movement = "demote"; const i = SEV.indexOf(authored); final = i === 0 ? "dropped" : SEV[i - 1]; }
  else movement = c > 0 ? "agreed" : "hold";
  return { net, threshold, final_severity: final, movement, convergence: p + c, gating: final === "🔴", status: voted === 0 ? "unvoted" : "graded" };
}

function words(...texts) {
  return texts.flat(Infinity).filter((t) => typeof t === "string").join(" ").split(/\s+/).filter(Boolean).length;
}

class Semantics {
  constructor() { this.errors = []; this.warnings = []; }
  err(path, message, hint) { this.errors.push({ path: path || "(root)", message, hint }); }
  warn(path, message, hint) { this.warnings.push({ path: path || "(root)", message, hint }); }

  unique(list, key, path, what) {
    const seen = new Map();
    (list ?? []).forEach((x, i) => {
      const v = typeof key === "function" ? key(x) : x?.[key];
      if (v === undefined) return;
      if (seen.has(v)) this.err(`${path}[${i}]`, `duplicate ${what} "${v}"`, `first used at ${path}[${seen.get(v)}]; ids are never reused`);
      else seen.set(v, i);
    });
  }

  /** Every ruling_ref-shaped object: well-formed, and '#' must resolve locally. */
  rulingRefs(root) {
    const local = new Set((root.local_rulings ?? []).map((r) => r.id));
    const visit = (node, path) => {
      if (Array.isArray(node)) return node.forEach((v, i) => visit(v, `${path}[${i}]`));
      if (!node || typeof node !== "object") return;
      for (const [k, v] of Object.entries(node)) {
        const p = join2(path, k);
        if (["ruling_ref", "entry_ref", "operator_ref"].includes(k)) this.ruling(v, p, local);
        else if (k === "rulings_cited" && Array.isArray(v)) v.forEach((r, i) => this.ruling(r, `${p}[${i}]`, local));
        else if (k !== "local_rulings") visit(v, p);
      }
    };
    visit(root, "");
  }

  ruling(ref, path, local) {
    if (!ref || typeof ref !== "object" || typeof ref.id !== "string" || typeof ref.record !== "string") return; // schema reports it
    if (ref.record === "#") {
      if (!local.has(ref.id)) this.err(path, `ruling_ref "${ref.id}" points at this record, which holds no such local ruling`, "add it to local_rulings, or point record at the brief that holds it");
    } else if (!/^https?:\/\/\S+$/.test(ref.record) && !/\.json$/.test(ref.record)) {
      this.err(path, `ruling_ref record "${ref.record}" is not a JSON record path, a URL, or "#"`, "cite the brief's JSON file, e.g. docs/briefs/<subject>/brief.json");
    }
    if (/^([a-z0-9-]+\/)?Q-/.test(ref.id) && path.endsWith("ruling_ref")) {
      this.warn(path, `ruling_ref cites an entry (${ref.id}) rather than a ruling`, "fine when the entry's decision is the ruling; prefer the R-n it produced");
    }
  }

  decision(d, path) {
    if (!d || typeof d !== "object") return;
    const sols = d.solutions ?? [];
    this.unique(sols, "id", join2(path, "solutions"), "solution id");
    const rec = sols.map((s, i) => (s.recommended ? i : -1)).filter((i) => i >= 0);
    if (rec.length > 1) this.err(join2(path, "solutions"), "more than one solution is recommended", "exactly one default");
    if (rec.length === 1 && rec[0] !== 0) this.err(join2(path, `solutions[${rec[0]}]`), "the recommended (default) solution must be listed first", "move it to the top — a brief entry derived from this requires it");
    if ((d.band === "🟡" || d.band === "🔴") && rec.length === 0) this.err(join2(path, "solutions"), `a ${d.band} decision needs a default marked recommended: true`, "DECISION-PRIMITIVE.md § Review surfaces");
    if (d.catalog_row === undefined && d.band && d.band !== "🔴") this.err(join2(path, "band"), `an unlisted decision point is ${d.band}, but no catalog row means 🔴`, "set catalog_row, or band 🔴 (DECISION-PRIMITIVE.md § The sensor)");
    if (d.decision && !sols.some((s) => s.id === d.decision.chose)) this.err(join2(path, "decision → chose"), `"${d.decision.chose}" is not one of this decision's solutions`, `use one of: ${sols.map((s) => s.id).join(", ")}`);
    if (d.resolution === "in-progress" && d.cycle === undefined) this.err(path, "an in-progress (self-heal) decision must say which cycle", "set cycle: N of 3");
    if (d.band === "🔴" && d.status && d.status !== "open" && !d.ruling_ref) this.err(path, "a 🔴 decision that is no longer open must cite the operator's ruling", "add ruling_ref (only the operator settles a 🔴, D2)");
  }

  /** Register + tally for one board. seated: Set of seated personas, or null. */
  board(register, tallyRows, seated, rpath, tpath) {
    register = register ?? []; tallyRows = tallyRows ?? [];
    this.unique(register, "id", rpath, "finding id");
    this.unique(tallyRows, "finding", tpath, "tally row for finding");
    const byId = new Map(register.map((e) => [e.id, e]));
    register.forEach((e, i) => {
      const p = `${rpath}[${i}]`;
      if (seated && e.author && !seated.has(e.author)) this.err(p, `author "${e.author}" is not seated on this board`, "only seated personas author findings");
      const noEvidence = !e.evidence || e.evidence.length === 0;
      if (noEvidence && e.unsupported !== true) this.err(p, "a finding with no file:line and no principle tag must be marked unsupported: true", "I8: it stays visible but outside the vote, the tally and the ranking");
      if (e.id?.startsWith("F") && e.graded === false) this.err(p, "only R2- derived findings are ungraded", "set graded: true");
      for (const [j, cn] of (e.convergence_notes ?? []).entries()) {
        if (cn.persona === e.author) this.err(`${p} → convergence_notes[${j}]`, "the author converges with its own finding", "S8: the author of a finding is never its grader");
      }
      if (e.derived_from && !byId.has(e.derived_from)) this.err(p, `derived_from "${e.derived_from}" is not in the register`);
    });
    const rows = new Map();
    tallyRows.forEach((r, i) => {
      const p = `${tpath}[${i}]`;
      rows.set(r.finding, r);
      const e = byId.get(r.finding);
      if (!e) return this.err(p, `tally row for "${r.finding}", which is not in the register`);
      if (e.unsupported) this.err(p, `"${r.finding}" is unsupported and must not be in the tally`, "I8: unsupported rows are outside the matrix");
      if (r.authored_severity !== e.authored_severity) this.err(p, `authored severity ${r.authored_severity} differs from the register's ${e.authored_severity}`, "the matrix projects the register; it re-authors nothing");
      this.tallyRow(r, e, seated, p);
    });
    register.forEach((e, i) => {
      if (!e.unsupported && !rows.has(e.id)) this.err(`${rpath}[${i}]`, `"${e.id}" has no tally row`, "every supported register entry gets exactly one row in the matrix");
    });
    return { byId, rows };
  }

  tallyRow(r, e, seated, p) {
    const derived = e.id?.startsWith("R2-");
    if (derived && r.status !== "ungraded") this.err(p, `R2- finding "${e.id}" must have status ungraded`, "no second lens has voted on it (graded: false)");
    if (!derived && r.status === "ungraded") this.err(p, "only R2- derived findings are ungraded");
    if (r.status === "held") {
      if (!e.need_info) this.err(p, "status held, but the register shows no open NEED_INFO", "held means need_info is still open (S11)");
      if (r.final_severity !== undefined || r.gating !== undefined) this.err(p, "a held finding has no post-tally severity", "S11: it must not tally until need_info clears");
      return;
    }
    if (e.need_info && !derived) this.err(p, `"${e.id}" has an open NEED_INFO but was counted`, "set status held; tally only after the flag clears (S11)");
    if (r.status === "ungraded") {
      if (r.final_severity !== undefined && r.final_severity !== e.authored_severity) this.err(p, "an ungraded finding keeps its author's severity", `final_severity must be ${e.authored_severity}`);
      for (const k of ["p", "c", "o", "net"]) if (r[k] !== undefined) this.err(p, `an ungraded finding carries no vote count ("${k}")`);
      return;
    }
    const { n, p: P, c: C, o: O } = r;
    if (![n, P, C, O].every(Number.isInteger)) return; // schema reports it
    if (P + C + O !== n) this.err(p, `N = ${n}, but P + C + O = ${P + C + O}`, "N counts exactly the non-author voters on this finding: N = P + C + O (GATE-PRIMITIVE.md § Stage 4, settled case 1)");
    if (seated && n > seated.size - 1) this.err(p, `N = ${n} exceeds the seated non-author personas (${seated.size - 1})`, "S8: the author never votes on its own finding");
    const want = tally(r.authored_severity, n, P, C, O);
    if (want.status === "graded" && n < 2) this.err(p, `a tally must not run at N < 2 (N = ${n})`, "GATE-PRIMITIVE.md § Stage 4");
    if (r.status !== want.status) this.err(p, `status is ${r.status}, but ${P + C + O === 0 ? "no votes were cast (unvoted)" : "votes were cast (graded)"}`, `set status ${want.status}`);
    for (const k of ["net", "threshold", "movement", "final_severity", "convergence", "gating"]) {
      if (r[k] !== undefined && r[k] !== want[k]) {
        const why = {
          net: "net = P − O (CONFIRM excluded)",
          threshold: "T = max(1, floor(N / 2))",
          movement: "net ≥ T escalates, net ≤ −T demotes, otherwise holds (agreed when CONFIRM votes hold it)",
          final_severity: `authored ${r.authored_severity}, net ${want.net}, T ${want.threshold}: one level at most`,
          convergence: "convergence = P + C",
          gating: "gating iff post-tally severity is 🔴",
        }[k];
        this.err(join2(p, k), `is ${JSON.stringify(r[k])}, the arithmetic gives ${JSON.stringify(want[k])}`, why);
      }
    }
  }

  roster(roster, path) {
    this.unique(roster, "persona", path, "roster persona");
    const seated = new Set();
    let ordinary = 0; const deltas = new Map();
    (roster ?? []).forEach((r, i) => {
      const p = `${path}[${i}]`;
      if (r.failure && r.decision !== "ABSTAIN") this.err(p, `a failure-rule persona (${r.failure}) counts as ABSTAIN`, "set decision ABSTAIN");
      if (r.seated) {
        if (r.decision === "ABSTAIN") this.err(p, "an abstainer is seated", "I3: never draft an abstainer");
        if (r.decision === "JOIN" && r.seat !== "ordinary") this.err(p, "a JOIN takes an ordinary seat");
        if (r.decision === "EXCEPTIONAL" && r.seat !== "exceptional") this.err(p, "an exceptional entry takes an exceptional seat");
        seated.add(r.persona);
        if (r.seat === "ordinary") ordinary++;
      }
      if (r.decision === "EXCEPTIONAL" && r.uncovered_delta) {
        const d = r.uncovered_delta.trim().toLowerCase();
        if (deltas.has(d)) this.err(p, "two exceptional entries cite the same uncovered delta", `already cited at ${path}[${deltas.get(d)}]; distinct entries need distinct deltas`);
        else deltas.set(d, i);
      }
    });
    if (ordinary > 5) this.err(path, `${ordinary} ordinary seats; the cap is five`, "DECISION-PRIMITIVE.md § Seating");
    const joins = (roster ?? []).filter((r) => r.decision === "JOIN");
    if (joins.length <= 5) joins.forEach((r) => { if (r.seated === false) this.err(path, `"${r.persona}" joined but is not seated`, "3 ≤ J ≤ 5 seats every joiner"); });
    return { seated, joiners: joins.length };
  }
}

function checkRsvp(d, s) {
  const n = words(d.reason, d.expected?.hook, d.applies ?? [], d.uncovered_delta);
  if (n > 80) s.err("", `the reply is ${n} words; the limit is 80`, "chorus-review Phase 0.5; an over-length reply counts as ABSTAIN");
  if (d.decision === "ABSTAIN" && (d.applies?.length || d.expected)) s.warn("", "an ABSTAIN carries applicability or stakes", "fine, but the reply will not be seated");
  if (d.decision === "EXCEPTIONAL" && d.uncovered_delta && !(d.applies ?? []).includes(d.uncovered_delta)) s.warn("uncovered_delta", "the uncovered delta is not among the cited applies deltas");
}

function reportFindings(list, path, s, { derived }) {
  s.unique(list, "id", path, "finding id");
  (list ?? []).forEach((f, i) => {
    const p = `${path}[${i}]`;
    if (!derived && f.id?.startsWith("R2-")) s.err(join2(p, "id"), "R2- ids belong to Round-2 derived findings", "use Fn");
    if (!derived && (f.derived_from !== undefined || f.graded !== undefined)) s.err(p, "derived_from and graded belong to Round-2 derived findings only");
    if (!f.evidence || f.evidence.length === 0) s.warn(p, "no file:line and no principle tag", "it will be registered [unsupported] and kept out of the vote (I8)");
  });
}

function reportWords(d, list) {
  return words(
    (list ?? []).map((f) => [f.claim, f.pull_quote, f.need_info_reason, f.conditional_on, f.experiment, (f.evidence ?? []).map((e) => e.note)]),
    (d.gate_questions ?? []).map((g) => [g.need, g.question, g.assumption]),
    (d.votes ?? []).map((v) => [v.reason, v.pull_quote, (v.evidence ?? []).map((e) => e.note)]),
  );
}

function checkFindingReport(d, s) {
  reportFindings(d.findings, "findings", s, { derived: false });
  if (d.tool_uses === 0) s.err("tool_uses", "a report with zero tool uses fails the evidence check", "re-dispatch once with the artefacts to read first (chorus-review Phase 1 evidence check)");
  if (d.mode === "review") {
    const n = reportWords(d, d.findings);
    if (n > 700) s.err("", `the report is ${n} words of prose; the limit is 700`, "the limit bounds prose per finding, not the number of findings");
  }
  (d.findings ?? []).forEach((f, i) => {
    if (f.conditional_on && !(d.gate_questions ?? []).length) s.err(`findings[${i}]`, "a conditional finding needs the gate question it is conditional on", "add it to gate_questions (S10)");
    if ((f.scope || f.attack_form) && d.mode === "review") s.warn(`findings[${i}]`, "scope and attack_form belong to the premise pass (sdlc Gate A or challenge)");
  });
}

function checkVoteReport(d, s) {
  s.unique(d.votes, "finding", "votes", "vote on finding");
  const own = new Set(d.own_findings ?? []);
  (d.votes ?? []).forEach((v, i) => {
    if (own.has(v.finding)) s.err(`votes[${i}]`, `votes on its own finding "${v.finding}"`, "S8: the author of a finding is never its grader");
    if (v.finding?.startsWith("R2-")) s.err(`votes[${i}]`, `votes on derived finding "${v.finding}"`, "R2- findings are ungraded: they are not voted on this round");
  });
  reportFindings(d.derived, "derived", s, { derived: true });
  if (d.tool_uses === 0) s.err("tool_uses", "a report with zero tool uses fails the evidence check");
  if (d.mode === "review") {
    const n = reportWords(d, d.derived);
    if (n > 600) s.err("", `the report is ${n} words of prose; the limit is 600`, "chorus-review Phase 2");
  }
}

function checkDecisions(list, path, s) {
  s.unique(list, "id", path, "decision id");
  (list ?? []).forEach((d, i) => s.decision(d, `${path}[${i}]`));
  return new Set((list ?? []).map((d) => d.id));
}

function checkReviewRecord(d, s) {
  const { seated, joiners } = s.roster(d.roster, "roster");
  if (d.quorum) {
    if (d.quorum.joiners !== joiners) s.err("quorum → joiners", `says ${d.quorum.joiners}, the roster has ${joiners} JOIN replies`);
    const ok = d.quorum.joiners >= 3;
    if (d.quorum.branch === "aborted" && ok) s.err("quorum → branch", "aborted with J ≥ 3");
    if (d.quorum.branch !== "aborted" && !ok) s.err("quorum → branch", `${d.quorum.branch} with J < 3`, "below quorum the round aborts (I3)");
  }
  const decisions = checkDecisions(d.decisions, "decisions", s);
  if (joiners >= 6 && !d.seating_decision) s.err("", "J ≥ 6 needs a seating decision", "set seating_decision to the DecisionRecord id");
  if (d.seating_decision && !decisions.has(d.seating_decision)) s.err("seating_decision", `"${d.seating_decision}" is not in decisions`);
  const { byId, rows } = s.board(d.register, d.tally, seated, "register", "tally");

  s.unique(d.conflicts, "id", "conflicts", "conflict id");
  (d.conflicts ?? []).forEach((c, i) => {
    const p = `conflicts[${i}]`;
    for (const f of c.findings ?? []) if (!byId.has(f)) s.err(p, `touches "${f}", which is not in the register`);
    if (c.decision_ref && !decisions.has(c.decision_ref)) s.err(join2(p, "decision_ref"), `"${c.decision_ref}" is not in decisions`);
    if (c.outcome === "unresolved" && !c.decision_ref) s.warn(p, "unresolved for the operator but not carried to the decision sink", "add a decision and decision_ref");
  });

  const heldRows = new Set([...rows.values()].filter((r) => r.status === "held").map((r) => r.finding));
  s.unique(d.top_five, "finding", "top_five", "top-five finding");
  s.unique(d.top_five, "rank", "top_five", "rank");
  (d.top_five ?? []).forEach((t, i) => {
    const p = `top_five[${i}]`;
    if (t.rank !== i + 1) s.err(join2(p, "rank"), `rank ${t.rank} at position ${i + 1}`, "list the top five in rank order, 1 first");
    const e = byId.get(t.finding), r = rows.get(t.finding);
    if (!e) return s.err(p, `"${t.finding}" is not in the register`, "each top-five entry traces to its register entry");
    if (heldRows.has(t.finding) || e.need_info) s.err(p, `"${t.finding}" is held (NEED_INFO open) and must be excluded from the top five`, "list it under held instead");
    if (e.unsupported) s.err(p, `"${t.finding}" is unsupported and cannot be ranked`);
    if (t.pull_quote !== e.pull_quote) s.err(join2(p, "pull_quote"), "differs from the register's pull-quote", "copy the persona's span verbatim (I6)");
    if (t.locator !== e.locator) s.err(join2(p, "locator"), "differs from the register's locator");
    if (r && r.final_severity !== undefined && t.final_severity !== r.final_severity) s.err(join2(p, "final_severity"), `${t.final_severity}, the tally says ${r.final_severity}`, "the ranking renders the tally; it never re-computes severity");
    if (r && r.convergence !== undefined && t.convergence !== r.convergence) s.err(join2(p, "convergence"), `${t.convergence}, the tally says ${r.convergence}`);
  });

  s.unique(d.held, "finding", "held", "held finding");
  const listed = new Set((d.held ?? []).map((h) => h.finding));
  for (const f of heldRows) if (!listed.has(f)) s.err("held", `"${f}" is held in the tally but not listed under held findings`);
  (d.held ?? []).forEach((h, i) => {
    if (!heldRows.has(h.finding)) s.err(`held[${i}]`, `"${h.finding}" is listed as held, but its tally row is not held`);
    if (h.decision_ref && !decisions.has(h.decision_ref)) s.err(`held[${i}] → decision_ref`, `"${h.decision_ref}" is not in decisions`);
    if (h.route === "operator" && !h.decision_ref) s.warn(`held[${i}]`, "routed to the operator but not carried to the decision sink", "add a decision and decision_ref");
  });

  const redBlocking = [...rows.values()].filter((r) => r.gating).length;
  if (redBlocking && d.tldr && !/🔴/.test(d.tldr[2] ?? "")) s.warn("tldr[2]", "the third TL;DR sentence should name the 🔴 findings that block rollout");
  s.unique(d.appendix, "persona", "appendix", "appendix persona");
  for (const p of seated) if (!(d.appendix ?? []).some((a) => a.persona === p)) s.warn("appendix", `no report link for seated persona "${p}"`);
  s.unique(d.local_rulings, "id", "local_rulings", "ruling id");
}

function checkSdlcLog(d, s) {
  const decisions = checkDecisions(d.decisions, "decisions", s);
  const lastCycle = {};
  (d.gates ?? []).forEach((g, gi) => {
    const gp = `gates[${gi}]`;
    const expect = (lastCycle[g.gate] ?? 0) + 1;
    if (g.cycle !== expect) s.err(join2(gp, "cycle"), `gate ${g.gate} is at cycle ${g.cycle} where cycle ${expect} was expected`, "cycles are numbered 1, 2, 3 and appended, never edited away");
    lastCycle[g.gate] = g.cycle;
    const names = { A: "design", B: "plan-tasks", C: "implementation", challenge: "premise" };
    if (names[g.gate] && g.name !== names[g.gate]) s.err(join2(gp, "name"), `gate ${g.gate} is "${names[g.gate]}", not "${g.name}"`);
    if (g.premise_pass && !["A", "challenge"].includes(g.gate)) s.err(join2(gp, "premise_pass"), "only Gate A (or a challenge) runs the premise pass");
    if (g.gate === "A" && !g.premise_pass) s.err(gp, "Gate A records its premise pass first", "chorus-sdlc § The ledger");
    if (g.premise_pass) s.unique(g.premise_pass.red_team, "item", join2(gp, "premise_pass → red_team"), "checklist item");
    const { seated } = s.roster(g.rsvp, join2(gp, "rsvp"));
    if (g.seating?.band === "🟡") {
      if (!g.seating.decision_ref) s.err(join2(gp, "seating"), "a 🟡 seating tie needs its DecisionRecord", "set decision_ref");
      else if (!decisions.has(g.seating.decision_ref)) s.err(join2(gp, "seating → decision_ref"), `"${g.seating.decision_ref}" is not in decisions`);
    }
    const { byId, rows } = s.board(g.register, g.tally, seated, join2(gp, "register"), join2(gp, "tally"));
    const res = new Map();
    (g.red_resolutions ?? []).forEach((r, i) => {
      if (!byId.has(r.finding)) s.err(`${gp} → red_resolutions[${i}]`, `"${r.finding}" is not in this gate's register`);
      else if (!rows.get(r.finding)?.gating) s.warn(`${gp} → red_resolutions[${i}]`, `"${r.finding}" is not gating`);
      res.set(r.finding, r.disposition);
    });
    const gating = [...rows.values()].filter((r) => r.gating).map((r) => r.finding);
    const uncleared = gating.filter((f) => !["resolved", "waived"].includes(res.get(f)));
    if (d.status === "complete") for (const f of gating) if (!["resolved", "waived"].includes(res.get(f))) s.err(join2(gp, "red_resolutions"), `gating 🔴 "${f}" has no resolved/waived row, yet the run is complete`, "S4: no gate passes with an open 🔴");
    const result = g.outcome?.result;
    if (result === "pass" && uncleared.length) s.err(join2(gp, "outcome"), `passes with open 🔴: ${uncleared.join(", ")}`, "S4");
    if (g.cycle === 3 && uncleared.length && !["escalated", "halt"].includes(result)) s.err(join2(gp, "outcome"), "the third cycle left a 🔴 uncleared and did not escalate", "S7: record escalated");
    if (result === "escalated" && g.cycle !== 3) s.err(join2(gp, "outcome"), "escalated before the third cycle", "S7: the bound is 3 cycles; a waiver-only path is a halt");
    if (result === "self-heal" && g.cycle === 3) s.err(join2(gp, "outcome"), "no self-heal past the third cycle", "S7");
    for (const f of g.outcome?.awaiting ?? []) if (!byId.has(f)) s.err(join2(gp, "outcome → awaiting"), `"${f}" is not in this gate's register`);
  });
  s.unique(d.self_audit, "rule", "self_audit", "self-audit rule");
  if (d.status === "complete") {
    const have = new Set((d.self_audit ?? []).map((a) => a.rule));
    const missing = Array.from({ length: 11 }, (_, i) => `S${i + 1}`).filter((r) => !have.has(r));
    if (missing.length) s.err("self_audit", `a complete run audits S1–S11; missing ${missing.join(", ")}`);
    if (d.mode === "agent-sdlc" && !d.memory_update) s.err("", "a complete lifecycle records its memory update (sign-off)", "chorus-sdlc § Memory update phase");
    const lastC = [...(d.gates ?? [])].reverse().find((g) => g.gate === "C");
    if (d.mode === "agent-sdlc" && lastC?.outcome?.result !== "pass") s.err("status", "complete, but Gate C has not passed");
  }
  (d.self_audit ?? []).forEach((a, i) => { if (a.pass === false) s.warn(`self_audit[${i}]`, `${a.rule} did not hold`); });
  (d.memory_update?.personas ?? []).forEach((m, i) => {
    if (m.written === 0 && !m.noop) s.err(`memory_update → personas[${i}]`, "a no-op must name the test that produced it", "set noop");
  });
  s.unique(d.local_rulings, "id", "local_rulings", "ruling id");
}

const SEMANTIC = {
  rsvp: checkRsvp,
  "finding-report": checkFindingReport,
  "vote-report": checkVoteReport,
  "review-record": checkReviewRecord,
  "sdlc-log": checkSdlcLog,
  decision: (d, s) => s.decision(d, ""),
  ruling: (d, s) => { if (d.replacedBy && d.replacedBy === d.id) s.err("replacedBy", "a ruling cannot replace itself"); },
};

/** Validate parsed data as <kind>. Returns { valid, errors, warnings }. */
export function validate(kind, data) {
  if (!KINDS.includes(kind)) throw new Error(`unknown kind "${kind}"`);
  const w = new SchemaWalker();
  w.check(data, schemas()[`${kind}.schema.json`], "", `${kind}.schema.json`);
  const s = new Semantics();
  // Semantic rules are written for the right shape. On a malformed record they
  // still run, so one pass reports as much as it can; if the shape is too broken
  // for them, the schema errors already explain why.
  try {
    SEMANTIC[kind](data, s);
    s.rulingRefs(data);
  } catch {
    if (w.errors.length === 0) throw new Error("semantic check crashed on a schema-valid record");
  }
  const errors = [...w.errors, ...s.errors];
  return { valid: errors.length === 0, errors, warnings: s.warnings };
}

/* ── CLI ─────────────────────────────────────────────────────────────────── */

function usage(msg) {
  if (msg) process.stderr.write(`${msg}\n`);
  process.stderr.write(`usage: validate <kind> <file.json> [--json]\n  kinds: ${KINDS.join(", ")}\n`);
  process.exit(2);
}

function main(argv) {
  const json = argv.includes("--json");
  const args = argv.filter((a) => a !== "--json");
  if (args.length !== 2) usage();
  const [kind, file] = args;
  if (!KINDS.includes(kind)) {
    const g = nearest(kind, KINDS);
    usage(`unknown kind "${kind}"${g ? ` — did you mean "${g}"?` : ""}`);
  }
  let data;
  try { data = JSON.parse(readFileSync(file, "utf8")); } catch (e) { usage(`cannot read ${file}: ${e.message}`); }
  const r = validate(kind, data);
  if (json) process.stdout.write(JSON.stringify({ kind, file, ...r }, null, 2) + "\n");
  else {
    const line = (x, tag) => `  ${tag} ${x.path}: ${x.message}${x.hint ? `\n      → ${x.hint}` : ""}`;
    if (r.valid) process.stdout.write(`${file}: valid ${kind}${r.warnings.length ? `, ${r.warnings.length} warning(s)` : ""}\n`);
    else process.stdout.write(`${file}: invalid ${kind} — ${r.errors.length} error(s)\n`);
    for (const e of r.errors) process.stdout.write(line(e, "✗") + "\n");
    for (const x of r.warnings) process.stdout.write(line(x, "!") + "\n");
  }
  process.exit(r.valid ? 0 : 1);
}

const invoked = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (invoked) main(process.argv.slice(2));
