#!/usr/bin/env node
/**
 * Render a chorus record from JSON into a markdown page.
 *
 *   node render.mjs <kind> <file.json> <out.md>
 *
 *   kinds: review-record (the chorus-review artifact skeleton),
 *          sdlc-log (the per-feature ledger)
 *   exit:  0 written · 1 input invalid (nothing written) · 2 usage
 *
 * The JSON is the record; the page is a projection of it. The layout is fixed
 * and nothing on the page is computed here: severities, counts and ranks are
 * printed as the validated record states them. Invalid input is refused.
 * Zero dependencies; Node 18+.
 */

import { readFileSync, writeFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validate } from "./validate.mjs";

export const RENDER_KINDS = ["review-record", "sdlc-log"];

const cell = (v) => (v === undefined || v === null || v === "" ? "—" : String(v).replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " "));
const table = (head, rows) =>
  [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join("\n");
const quote = (q) => `"${q}"`;
const ref = (r) => (r ? `${r.id} (${r.record === "#" ? "this record" : r.record})` : "—");
const tagOf = (e) => {
  if (e.unsupported) return "[unsupported]";
  const kinds = new Set((e.evidence ?? []).map((x) => x.kind));
  if (kinds.has("file_line")) return "";
  if (kinds.has("principle")) return "[principle]";
  if (kinds.has("principle_proposed")) return "[principle:proposed]";
  return "";
};
const needInfo = (e) => (e.need_info ? `open · ${(e.need_info_reasons ?? []).map((r) => `${r.raiser}: ${r.reason}`).join("; ")}` : "—");

function decisionBlock(d) {
  const out = [`#### ${d.id} — ${d.title} (${d.band})`, "", d.problem, ""];
  if (d.brief) out.push(d.brief, "");
  out.push(`- **Point**: ${d.point}${d.catalog_row ? ` (catalog row ${d.catalog_row})` : " (unlisted)"}`);
  if (d.sensor) out.push(`- **Sensor**: ${d.sensor.signal} → ${d.sensor.reading}${d.sensor.evidence?.length ? ` (${d.sensor.evidence.join(", ")})` : ""}`);
  out.push(`- **Resolution**: ${d.resolution}${d.cycle ? ` — cycle ${d.cycle} of 3` : ""} · **Status**: ${d.status}`);
  for (const s of d.solutions) {
    out.push(`- ${s.recommended ? "**Default** — " : ""}${s.label} (\`${s.id}\`${s.reversible === false ? ", irreversible" : ""}): ${s.summary} *Cost*: ${s.cost.work}${s.cost.risk ? ` *Risk*: ${s.cost.risk}` : ""}`);
  }
  if (d.override) out.push(`- **Override**: ${d.override.how} (cost: ${d.override.cost})`);
  if (d.decision) out.push(`- **Chosen**: \`${d.decision.chose}\` on ${d.decision.date}${d.decision.note ? ` — ${d.decision.note}` : ""}`);
  if (d.ruling_ref) out.push(`- **Operator ruling**: ${ref(d.ruling_ref)}`);
  if (d.entry_ref) out.push(`- **Published as**: ${ref(d.entry_ref)}`);
  out.push(`- **Evidence**: ${d.evidence.map((e) => `${e.ref}${e.note ? ` — ${e.note}` : ""}`).join("; ")}`);
  return out.join("\n");
}

function registerTable(register) {
  return table(
    ["ID", "Advisor · Lens", "Authored severity", "Target (locator)", "Pull-quote (verbatim)", "confidence_on_hand", "need_info · reason", "graded"],
    register.map((e) => [e.id, `${e.author} · ${e.lens}`, e.authored_severity, `\`${e.locator}\``,
      `${quote(e.pull_quote)}${tagOf(e) ? ` ${tagOf(e)}` : ""}${e.scope ? ` (${e.scope}${e.parked ? ", parked" : ""})` : ""}`,
      e.confidence_on_hand, needInfo(e), e.graded ? "true" : "false [ungraded]"]));
}

function convergence(register) {
  const out = [];
  for (const e of register) {
    if (!e.convergence_notes?.length && !e.derived_from) continue;
    out.push(`- **${e.id}**${e.derived_from ? ` (derived from ${e.derived_from})` : ""}`);
    for (const n of e.convergence_notes ?? []) out.push(`  - ${n.persona}: ${quote(n.pull_quote)}`);
  }
  return out.length ? ["", "Converging lenses, in their own words:", "", ...out].join("\n") : "";
}

function matrix(rows) {
  return table(
    ["ID", "Authored severity", "P", "C", "O", "net", "Final severity", "Convergence (P + C)", "Status"],
    rows.map((r) => [r.finding, r.authored_severity, r.p, r.c, r.o, r.net, r.final_severity, r.convergence, r.status === "ungraded" ? "ungraded [ungraded]" : r.status]));
}

function rsvpTable(rows) {
  return table(
    ["Lens", "Persona", "Decision", "Applies (cited deltas)", "Expected stakes", "Seat", "Reason"],
    rows.map((r) => [r.lens, r.persona, r.decision, r.applies?.length ? r.applies.join("; ") : "—",
      r.expected ? `${r.expected}${r.decision !== "ABSTAIN" ? "-potential" : ""}${r.hook ? ` — ${r.hook}` : ""}` : "—",
      r.seated ? r.seat : "not seated", `${r.reason}${r.failure ? ` (failure rule: ${r.failure})` : ""}`]));
}

function bindingsBlock(b) {
  const ports = b.ports.length ? b.ports.map((p) => `${p.port}: ${p.provider}`).join(" · ") : "none recorded";
  const rec = b.recoveries.length
    ? b.recoveries.map((x) => `${x.kind} — ${x.subject}${x.phase ? ` (${x.phase})` : ""}: ${x.reason}`).join("; ")
    : "none";
  return [`**Bindings.** ${ports}`, "", `**Recovered without asking.** ${rec}`].join("\n");
}

function sideNotes(list) {
  return list.map((n) => `- **${n.regime}**: ${n.note}${n.findings?.length ? ` (${n.findings.join(", ")})` : ""}`).join("\n");
}

export function renderReviewRecord(d) {
  const tallyBy = new Map(d.tally.map((r) => [r.finding, r]));
  const L = [];
  L.push(`# Chorus review — ${d.date}`, "", `- **Target**: ${d.target}`, `- **Mode**: ${d.mode === "pr-design" ? "design review of the PR's approach, not a line-by-line diff review" : "project-state review"}`);
  if (d.baseline_ref) L.push(`- **Baseline**: ${d.baseline_ref}`);
  L.push("", `**Round context.** ${d.round_context}`, "", bindingsBlock(d.bindings), "");
  L.push("## 1. TL;DR", "", d.tldr.join(" "), "");
  L.push("## 2. Roster (this round)", "", rsvpTable(d.roster), "",
    `Joiners: ${d.quorum.joiners}. Quorum: ${d.quorum.branch}.${d.seating_decision ? ` Seating decision: ${d.seating_decision}.` : ""}`, "");
  L.push("## 3. Findings register", "", registerTable(d.register), convergence(d.register), "");
  L.push("## 4. Consolidation matrix", "", "`net = P − O` over non-author voters (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = P + C.", "", matrix(d.tally), "");
  L.push("## 5. Conflicts", "");
  if (!d.conflicts.length) L.push("No genuine conflicts this round; phase skipped.", "");
  for (const c of d.conflicts) {
    L.push(`- **${c.id}** — ${c.advisors.join(" vs ")} on ${c.findings.join(", ")}: ${c.disputed}`,
      `  - ${c.outcome === "arbiter-ruled" ? `Arbiter ruling: ${c.arbiter_ruling}` : `Unresolved for the operator${c.decision_ref ? ` (${c.decision_ref})` : ""}`}`);
  }
  if (d.conflicts.length) L.push("");
  L.push("## 6. Top five", "");
  if (!d.top_five.length) L.push("No findings ranked.");
  for (const t of d.top_five) {
    const ungraded = tallyBy.get(t.finding)?.status === "ungraded" ? " [ungraded]" : "";
    L.push(`${t.rank}. **${t.finding}**${ungraded} ${t.final_severity} — ${quote(t.pull_quote)} \`${t.locator}\``,
      `   Cost ${t.cost} · Value: ${t.value}${t.constitutional_roi ? ` · Constitutional ROI: ${t.constitutional_roi}` : ""} · Convergence ${t.convergence}${t.arbiter_note ? ` · ${t.arbiter_note}` : ""}`);
  }
  L.push("", "## 7. Held findings and minority reports", "");
  if (!d.held.length) L.push("None.");
  for (const h of d.held) L.push(`- **${h.finding}** (route: ${h.route}${h.decision_ref ? `, ${h.decision_ref}` : ""}): ${h.reasons.map((r) => `${r.raiser} — ${r.reason}`).join("; ")}`);
  const minority = d.tally.filter((t) => t.status === "minority-report");
  L.push("", "**Minority reports** (one voter each; not counted, never gating, authored severity kept):", "");
  if (!minority.length) L.push("None.");
  for (const t of minority) { const e = d.register.find((x) => x.id === t.finding); L.push(`- **${t.finding}** ${t.authored_severity} — ${e ? `${quote(e.pull_quote)} \`${e.locator}\`` : ""} (P ${t.p} · C ${t.c} · O ${t.o})`); }
  L.push("", "## 8. Next-chorus baseline", "");
  const list = (title, xs) => L.push(`**${title}**: ${xs.length ? xs.join("; ") : "none"}`, "");
  list("Assume closed", d.baseline.assume_closed);
  list("In progress", d.baseline.in_progress);
  list("Re-evaluate", d.baseline.re_evaluate);
  if (d.decisions?.length) L.push("### Decisions", "", ...d.decisions.flatMap((x) => [decisionBlock(x), ""]));
  if (d.side_notes?.length) L.push("### Side-notes (flag-only)", "", sideNotes(d.side_notes), "");
  if (d.rulings_cited?.length) L.push("### Operator rulings relied on", "", ...d.rulings_cited.map((r) => `- ${ref(r)}`), "");
  if (d.local_rulings?.length) L.push("### Local rulings (no ruling sink bound)", "", ...d.local_rulings.map((r) => `- **${r.id}** — ${r.about} — "${r.said}" (${r.source})`), "");
  L.push("## Appendix — lens reports", "");
  if (!d.appendix.length) L.push("None linked.");
  for (const a of d.appendix) L.push(`- ${a.persona}: ${a.reports.map((p) => `\`${p}\``).join(", ")}`);
  return L.join("\n") + "\n";
}

const GATE_TITLE = { A: "Gate A — design", B: "Gate B — plan/tasks", C: "Gate C — implementation", challenge: "Chorus challenge — premise" };

export function renderSdlcLog(d) {
  const L = [];
  L.push(`# Agent-SDLC Ledger: ${d.feature}`, "", `- **Feature**: ${d.feature_dir}`, `- **Run started**: ${d.run_started}`,
    `- **Mode**: ${d.mode === "challenge" ? "chorus challenge" : "agent-SDLC (lifecycle)"}`, `- **Status**: ${d.status}`, "");
  for (const g of d.gates) {
    L.push(`## ${GATE_TITLE[g.gate]} — cycle ${g.cycle}`, "", `**Corpus**: ${g.corpus.join(", ")}`, "");
    if (g.premise_pass) {
      const p = g.premise_pass;
      L.push("### Premise pass", "", table(["#", "Outcome"], p.red_team.map((r) => [r.item, r.outcome])), "",
        `Premise survives: ${p.honest_null.premise_survives ? "yes" : "no"}.${p.pass_ok === false ? " **Failed pass — re-run.**" : ""}`);
      for (const t of p.honest_null.tried) L.push(`- ${t.persona} (${t.attack_form}): ${t.note}`);
      L.push("");
    }
    L.push("### RSVP", "", rsvpTable(g.rsvp), "",
      `Seated: ${g.rsvp.filter((r) => r.seated).map((r) => r.persona).join(", ") || "none"}. Seating decision: ${g.seating.band === "🟢" ? "🟢 strict sort" : `🟡 tie → default panel (${g.seating.decision_ref})`}. Quorum: ${g.quorum}.`, "");
    const byId = new Map(g.tally.map((r) => [r.finding, r]));
    const sections = g.gate === "A"
      ? [["Premise findings", (e) => e.scope === "premise"], ["Within-frame findings", (e) => e.scope !== "premise" && !e.parked], ["Parked from premise", (e) => e.parked]]
      : [["Findings register", () => true]];
    for (const [title, pick] of sections) {
      const rows = g.register.filter(pick);
      if (!rows.length && g.gate === "A") continue;
      L.push(`### ${title}`, "", table(["ID", "Lens", "Evidence", "Proposed", "Post-tally", "Gating?", "Pull-quote"],
        rows.map((e) => { const r = byId.get(e.id); return [e.id, e.lens, `\`${e.locator}\`${tagOf(e) ? ` ${tagOf(e)}` : ""}`, e.authored_severity,
          r?.final_severity ?? (r?.status ?? "—"), r?.gating ? "yes" : "no", quote(e.pull_quote)]; })), "");
    }
    L.push("### Vote tally", "", "`net = PRIORITIZE − OVER-RATE` (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = PRIORITIZE + CONFIRM.", "",
      table(["ID", "N", "PRIORITIZE", "CONFIRM", "OVER-RATE", "net", "T", "Result"],
        g.tally.map((r) => [r.finding, r.n, r.p, r.c, r.o, r.net, r.threshold, r.movement ?? r.status])), "");
    L.push("### 🔴 resolution log", "");
    L.push(g.red_resolutions.length ? table(["ID", "Disposition", "Detail", "Operator ruling"], g.red_resolutions.map((r) => [r.finding, r.disposition, r.detail, ref(r.ruling_ref)])) : "No gating 🔴.", "");
    if (g.unclaimed_records?.length) {
      L.push("### Unclaimed extract records", "", table(["Source", "Location", "Observation"], g.unclaimed_records.map((r) => [r.source, `\`${r.location}\``, r.observation])), "");
    }
    if (g.side_notes?.length) L.push("### Side-notes (flag-only)", "", sideNotes(g.side_notes), "");
    const o = g.outcome;
    const text = { pass: `pass → proceeding to ${o.next ?? "next phase"}`, halt: `halt → awaiting operator on ${(o.awaiting ?? []).join(", ")}`,
      "bound-reached": `bound reached after 3 cycles, 🔴 goes to the operator${o.awaiting?.length ? ` (${o.awaiting.join(", ")})` : ""}`,
      "self-heal": "self-heal → incorporating and re-running", aborted: "aborted: quorum not met" }[o.result];
    L.push("### Outcome", "", text, "");
  }
  const provisional = d.decisions.filter((x) => x.band === "🟡");
  const other = d.decisions.filter((x) => x.band !== "🟡");
  L.push("## Provisional decisions (review & override)", "");
  L.push(provisional.length ? table(["id", "point", "band", "sensor.evidence", "resolution", "chosen / alternatives", "override (+ cost)"],
    provisional.map((x) => { const def = x.solutions.find((s) => s.recommended) ?? x.solutions[0];
      return [x.id, x.point, x.band, (x.sensor?.evidence ?? []).join(", "), `${x.resolution}${x.cycle ? ` (cycle ${x.cycle} of 3)` : ""}`,
        `${def.id} vs ${x.solutions.filter((s) => s !== def).map((s) => s.id).join(", ") || "—"}`, `${x.override.how} (${x.override.cost})`]; })) : "None.", "");
  if (other.length) L.push("## Other decisions", "", ...other.flatMap((x) => [decisionBlock(x), ""]));
  if (d.memory_update) {
    const m = d.memory_update;
    L.push("## Memory update (sign-off)", "", table(["Persona", "Written", "No-op test"], m.personas.map((p) => [p.persona, p.written, p.noop])), "",
      `Project-wide proposal: ${m.project_wide_diff ?? "none"} — operator: ${m.operator}${m.operator_ref ? ` (${ref(m.operator_ref)})` : ""}.`,
      `Pending proposals: ${m.pending?.length ? m.pending.join("; ") : "none"}. Secret-filter drops: ${m.secret_drops ?? 0}.`, "");
  }
  L.push("## Self-audit (S1–S11)", "", d.self_audit.length ? table(["Rule", "Pass", "Evidence"], d.self_audit.map((a) => [a.rule, a.pass ? "pass" : "FAIL", a.evidence])) : "Not yet run.", "");
  if (d.rulings_cited?.length) L.push("## Operator rulings relied on", "", ...d.rulings_cited.map((r) => `- ${ref(r)}`), "");
  if (d.local_rulings?.length) L.push("## Local rulings (no ruling sink bound)", "", ...d.local_rulings.map((r) => `- **${r.id}** — ${r.about} — "${r.said}" (${r.source})`), "");
  return L.join("\n");
}

export function render(kind, data, opts = {}) {
  const r = validate(kind, data, opts);
  if (!r.valid) { const e = new Error("invalid input"); e.errors = r.errors; throw e; }
  return kind === "review-record" ? renderReviewRecord(data) : renderSdlcLog(data);
}

function main(argv) {
  const usage = (m) => { if (m) process.stderr.write(`${m}\n`); process.stderr.write(`usage: render <${RENDER_KINDS.join("|")}> <file.json> <out.md>\n`); process.exit(2); };
  if (argv.length !== 3) usage();
  const [kind, file, out] = argv;
  if (!RENDER_KINDS.includes(kind)) usage(`cannot render "${kind}"`);
  let data;
  try { data = JSON.parse(readFileSync(file, "utf8")); } catch (e) { usage(`cannot read ${file}: ${e.message}`); }
  try {
    writeFileSync(out, render(kind, data, { file }));
  } catch (e) {
    if (!e.errors) throw e;
    process.stderr.write(`${file}: refusing to render an invalid ${kind} — ${e.errors.length} error(s); run validate.mjs for details\n`);
    for (const x of e.errors) process.stderr.write(`  ✗ ${x.path}: ${x.message}\n`);
    process.exit(1);
  }
  process.stdout.write(`${out}: written from ${file}\n`);
}

const invoked = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (invoked) main(process.argv.slice(2));
