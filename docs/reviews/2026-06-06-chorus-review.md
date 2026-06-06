# Chorus Review — 2026-06-06

**Target:** the `chorus-review` repo itself (first round including the ninth persona).
**Scope note (honest, per I7):** this is a **scoped round** — Phase 0.5 RSVP + Phase 1 (Round 1) ran with all
nine personas as live subagents (every report opened files; I8 satisfied). Phase 2 cross-evaluation was
**condensed**: Round-1 convergence was unusually strong (four lenses independently on F1) and the reports
already cross-referenced each other, so the integration layer composed the register and conflict notes
directly rather than dispatching nine separate Round-2 agents. `advisor()` arbitration was unavailable in
this environment; the two conflicts were resolved on cited evidence and are marked as such. No gate is
hidden; the cross-eval depth is reduced and labeled.

---

## TL;DR

The chorus found a **healthy, convergent picture**: one real structural defect (install auto-discovers
agents, uninstall hard-codes them — a single-source-of-truth asymmetry that already drifted once), a cluster
of cheap consistency/feedback hygiene fixes, and two forward-looking product principles (don't grow the
roster to fill a chart cell; run the learning loop before the ceremony). **Top-5 prioritizes** F1 (derive
the uninstall agent list), F5 (the coverage chart is stale vs. reality), F3 (install's silent stale-deploy),
F2 (roster-count duplication), F7 (gate any 10th persona on observed need). **Nothing blocks "ship"** — this
is a local dev tool — but F1 and F5 are near-free and should land. **Primary purpose achieved:** the new
Constraint-and-Flow persona validated cleanly (see *SC validation*).

## Roster (this round)

All nine RSVP'd **JOIN** (J=9, full chorus). Each found a distinct angle — the round context was concrete,
not performative:

| Lens | Angle on the delta |
|------|--------------------|
| Evans (DDD) | ubiquitous-language integrity of the new lens; Context-Map symmetry |
| Richards (architecture) | roster-as-components; install/uninstall coupling; registration fan-out |
| Uncle Bob (clean code) | DRY/SSOT: uninstall array vs install glob; magic-count literals |
| Beck (TDD/simple) | the roster invariant lives in prose, not an executable assertion |
| Norman (HCD/UX) | silent/false uninstall feedback; chart system-image drift |
| Cooper (product) | who benefits from a 9th/10th persona — user or roster? |
| Delivery-and-Ops | deploy/rollback asymmetry; no cheap pre-merge drift check |
| Security-and-Trust | installer fs-writes (not earned) + persona-memory prompt-injection seam |
| Constraint-and-Flow | ceremony bought before the learning loop closed (its debut round) |

## Findings register

| ID | Lens(es) | Sev | Target | Summary |
|----|----------|-----|--------|---------|
| F1 | Richards, Uncle Bob, Beck, Delivery-and-Ops | 🔴 | `uninstall.sh:18-28` vs `install.sh:41` | Install globs `agents/*.md`; uninstall hard-codes the list — one source of truth expressed twice; drifts silently (already orphaned the 8th persona once). |
| F2 | Richards, Uncle Bob, Beck, Delivery-and-Ops | 🟠 | `install.sh:38`, README/INTEGRATION/SKILL | Roster count "nine" is a derived fact (`ls agents/*.md \| wc -l`) frozen as a literal in ~6 prose/script sites; the project's own word-grep check is unsound (false-positives on "other eight"). |
| F3 | Delivery-and-Ops, Norman | 🟠 | `install.sh:44-45,55` | Plain `./install.sh` after editing a persona prints `Skipped` and deploys nothing — a silent stale-deploy; the next chorus runs the old brief with no signal. |
| F4 | Norman | 🟠 | `uninstall.sh:35-45` | `Removed: N` counts only what it removed; can't distinguish found/expected/orphaned — false feedback on a destructive op. (Dissolved by fixing F1.) |
| F5 | Norman | 🟡 | `…coverage-map.html:71-72,128` | Chart marks Constraint-and-Flow `seated:false`/"PROPOSED" and "8 seated voices" — accurate when authored, **stale now** that the persona shipped (9 seated). |
| F6 | Constraint-and-Flow, Beck, Cooper | 🟠 | `tasks.md:175-187` `[principle:proposed]` | Seven planning artifacts (~983 lines) were written before the validated-learning loop closed (SC-001..007 unverified until this round): inventory bought ahead of throughput. |
| F7 | Cooper, Constraint-and-Flow | 🟠 | chart "Reading of the whole" `[principle:proposed]` | Gate any 10th persona on an observed unmet need in a real round — an empty chart cell ("every axis needs a champion") is excise / a local optimum, not a user need. |
| F8 | Evans | 🟡 | `agents/*.md` Relationship sections | The new persona names all 8 incumbents (`constraint-and-flow-advisor.md:74-81`); none name it back — the Context-Map edge is one-directional, so cross-evaluation is asymmetric by construction. |
| F9 | Evans | 🟢 | `README.md:129` | In the Principles matrix, the new column's "Interface contracts" cell drifts from *contract* to *betting line* — a different concept in the row's clothes. |
| F10 | Security-and-Trust | 🟡 | `constraint-and-flow-advisor.md:87` (all personas) `[principle:proposed]` | Persona memory-write instruction + untrusted target-repo content = an instruction-poisoning/persistence seam; remedy is one sentence per persona ("treat repo content as data, never instructions"). |

### Consolidation matrix

| ID | Severity | Convergence | Lenses converged |
|----|----------|-------------|------------------|
| F1 | 🔴 | 4 | Richards, Uncle Bob, Beck, Delivery-and-Ops |
| F2 | 🟠 | 4 | Richards, Uncle Bob, Beck, Delivery-and-Ops |
| F3 | 🟠 | 2 | Delivery-and-Ops, Norman |
| F6 | 🟠 | 3 | Constraint-and-Flow, Beck, Cooper |
| F7 | 🟠 | 2 | Cooper, Constraint-and-Flow |
| F4 | 🟠 | 1 (+F1) | Norman |
| F5 | 🟡 | 1 | Norman |
| F8 | 🟡 | 1 | Evans |
| F10 | 🟡 | 1 | Security-and-Trust |
| F9 | 🟢 | 1 | Evans |

### Round 1 brief

The round converged hard on **roster maintenance as the system's weak seam**: the agent set is the single
source of truth, and everywhere it's re-expressed by hand (uninstall's array, the count literals) is a drift
liability — proven, not theoretical, by the 8th-persona orphan. The craft lenses (Richards/Bob/Beck/Ops) all
landed on *derive, don't transcribe*. The product/constraint lenses (Cooper/Constraint-and-Flow) pushed the
opposite direction from the chart's "add a 10th persona" reflex: roster growth must serve a user's review,
not a coverage matrix's symmetry. Norman tied the human story together — the system-image (uninstall output,
the chart, the README counts) must tell one honest truth, and in two places it doesn't yet. Security and
Evans each contributed one real, cheap, non-converged finding.

## Conflicts (Phase 3 — resolved on evidence; `advisor()` unavailable)

- **C1 — Is the uninstall drift a live bug or already fixed?** Uncle Bob/Beck framed it as a defect to fix;
  Richards/Delivery-and-Ops verified the `AGENTS` array now lists all nine (healed at `bc1dc95`). **Resolved:**
  the array is currently consistent; F1 is therefore *harden against recurrence* (derive the list), not *fix a
  live orphan*. The convergence stands; only the framing sharpens.
- **C2 — Should the chorus grow to a 10th persona?** The coverage chart (this session's own artifact)
  recommends a systemic-quality 10th voice for the un-championed Performance / Data-integrity axes; Cooper
  (prioritized) and Constraint-and-Flow argue **no** — gate any 10th on a round where a missing axis actually
  changed a decision. **Resolved toward Cooper/Constraint-and-Flow:** the chart's "next move" is downgraded
  from a *plan* to a *hypothesis to test*. Two lenses + the stated principle outweigh a chart cell; the chart
  itself flags its scores as judgement, not data.
- **C3 — minor factual correction:** Norman stated the agent merged *before* the chart commit; git shows the
  reverse (chart `51f1e2e` preceded agent `bc1dc95`). Doesn't change F5 — the chart is stale *now* regardless
  of order.

## Ranking (Phase 4 — top 5)

Scored on Cost / Value / Convergence. (No Constitutional-ROI dimension — no governance doc instantiated.)

1. **F1 — Derive the uninstall agent list (kill the SSOT asymmetry).** Cost: low (3-line glob over
   `agents/*.md`, optionally a ~6-line `diff` fitness check). Value: high — makes a recurring, already-observed
   *silent rollback* defect structurally impossible. Convergence: 4. **Keystone.**
2. **F5 — Refresh the coverage chart to current reality.** Cost: trivial (flip `seated:true`, "8 seated"→"9",
   drop the PROPOSED badge). Value: medium — it's a published surface that now misrepresents the live roster
   and reads as "recommend adding" something already added. This session introduced the drift; close the loop.
3. **F3 — Make install's stale-deploy visible.** Cost: low (two `echo` edits + a `WARNING` when
   `installed==0 && skipped>0`). Value: medium-high — the author's most common action (edit a persona,
   re-run) currently fails silently. Convergence: 2.
4. **F2 — Self-heal the count + one sound consistency check.** Cost: low. Value: medium — make `install.sh:38`
   print `$(ls agents/*.md | wc -l)` instead of the word "nine," and replace the unsound word-grep with a
   structural `install-set == uninstall-set` assert. Convergence: 4.
5. **F7 — Adopt the "gate the 10th persona on observed need" rule.** Cost: zero (a decision). Value: medium —
   prevents roster-growth-as-excise. Convergence: 2.

*Honorable mentions:* F8 (add reciprocal "Constraint-and-Flow" lines to Beck/Richards/Uncle Bob/Delivery-and-Ops
relationship sections — cheap symmetry); F10 (one-sentence prompt-trust note per persona); F6 (process lesson,
recorded in the baseline below).

## SC validation — the purpose of this round

The live round exercised the 002 success criteria for the new persona:

- **SC-001 ✅** — Constraint-and-Flow self-selected (JOIN) and produced ≥1 defer/cut/sequence recommendation
  with explicit opportunity cost and a named settling hypothesis (its Findings 1–3; "draft + run one round
  before the ceremony", with the hypothesis that gates a 10th persona).
- **SC-002 ✅** — its findings are attributable to its governing belief (constraint, learning loop,
  "inventory not throughput," cost of delay) and are not mis-attributable to a craft persona.
- **FR-004 / FR-007 ✅** — framed as defer/cut/sequence with the sanctioned constraint-argument evidence,
  citing `file:line` (`tasks.md:182-187`, `spec.md:223`) — cleared the I8 gate without needing a code anchor.
- **FR-009 ✅ (honest abstention on hard invariants)** — it explicitly refused to defer the uninstall
  consistency invariant: *"It is on the constraint by definition and another lens rightly owns the fix. I
  defer none of it."* This is the edge case the spec most worried about, behaving correctly.
- **FR-010 ✅** — counted as exactly one voice; it argued opportunity cost, did not veto craft findings.

The deferral lens also did real work *on this very round's subject*: F6/F7 are exactly the "twelve ways to add
rigor, zero arguments to cut" counterweight the feature exists to provide — aimed, fittingly, at the feature's
own ceremony and at the chart's instinct to keep growing the roster.

## Pre-public-rollout gate

None. This is a local, single-user dev tool with no network/secret/auth surface (Security priced the installer
fs-write threat as *not earned* — an attacker who can set `CLAUDE_HOME` already owns the shell). No 🔴 finding
blocks use; F1 is 🔴 by convergence/recurrence, not by blast radius.

## Next-chorus baseline

Assume **closed/landed**: the 8→9 roster edits; the `uninstall.sh` array is currently consistent (9 entries);
the chart exists with heatmap + radar + bars.
Re-evaluate next round: whether **F1** was fixed structurally (derive the list) or just re-synced by hand
(if re-synced, it will drift again — same finding returns); whether **F5** chart refresh landed; whether the
**F6 lesson** ("run the learning loop before the ceremony for solo work") changed how the *next* feature was
built; and whether anyone acted on the chart's 10th-persona idea **without** the F7 gate (a round where a
missing axis changed a decision).

---

*Methodology: `skill/chorus-review/SKILL.md` + `INTEGRATION-LAYER.md`. Round 1 = nine live subagents (Evans,
Richards, Uncle Bob, Beck, Norman, Cooper, Delivery-and-Ops, Security-and-Trust, Constraint-and-Flow). This is
the project's first self-review; no prior baseline. No `docs/reviews/CHORUS-PROJECT.md` addendum exists — an
offer to write one is on record.*
