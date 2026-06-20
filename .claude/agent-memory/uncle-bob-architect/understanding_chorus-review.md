---
name: understanding-chorus-review
description: Uncle Bob lens understanding record for the chorus-review repo — project-scoped facts + per-feature deltas (currently feature 007 Gate A)
metadata:
  type: project
---

# Understanding record — chorus-review repo (Uncle Bob / clean-code lens)

Locator index, not copies. Findings must re-ground in live files.
Worktree under review (007): `/home/az/code/chorus-review/.claude/worktrees/007-chorus-learn-onboarding`

## Project-scoped (stable until canon changes) — validated 2026-06-10

- **Repo nature**: markdown skill/persona repo; no runtime app, no test harness. "Tests" are structural checks in each feature's quickstart.md (precedent: features 004/006 — cited in `specs/007.../research.md` R7).
- **Dependency-direction rule (the repo's DIP)**: one canonical definition per mechanic; layers reference, never restate. Stated at `skill/chorus-review/SKILL.md:22-31` (gate primitive defined once in GATE-PRIMITIVE.md; exploratory phase once in EXPLORATORY-PHASE.md) and as the de-facto constitution row in `specs/007.../plan.md` (Constitution Check table). No ratified speckit constitution exists (plan.md, same section — recurring fact since 003).
- **Mode registration seam**: `SKILL.md` "## Two modes" (branch SKILL.md:33; installed `~/.claude/skills/chorus-review/SKILL.md:41`) + the YAML frontmatter `description:` (SKILL.md:3) which is Claude Code's actual skill-routing surface. Companion docs per mode (SDLC-LAYER.md pattern).
- **Deployment seam**: `install.sh:36` — `cp -f "$SKILL_SRC"/*.md "$SKILL_DST/"` — ships ONLY skill/chorus-review/*.md. Agents preserved unless `--force` (install.sh:41-52). Installer "Next:" prose tells humans to hand-copy the template (install.sh:57-60).
- **Addendum**: `templates/CHORUS-PROJECT.template.md` — sections 2/3/5 required (template:9-13); section 7 is the exploratory-phase system of record (template:106-118). This repo itself has NO `docs/reviews/CHORUS-PROJECT.md` (absence verified 2026-06-10) and no repo CLAUDE.md.
- **Existing addendum-creation path**: project-state round Phase 5 already offers to write `docs/reviews/CHORUS-PROJECT.md` distilling Phase-0 interview answers (`skill/chorus-review/SKILL.md:488-491`). Remember this whenever a second creation path appears.
- **Domain vocabulary (load-bearing)**: round, gate, RSVP, quorum, lens/persona, findings register, consolidation matrix, baseline, addendum, exploratory phase, bands (🔴🟠🟡🟢), decision discipline (006: DECISION-PRIMITIVE.md, installed copy only on this branch).

## Feature 007 delta — `chorus learn` (Gate A, design review) — recorded 2026-06-10

Corpus: `specs/007-chorus-learn-onboarding/{spec,plan,research,data-model,quickstart}.md` + `contracts/{learn-mode,navigation,scaffold}.md`.

### Needs resolution (lens profile)

1. **Axes of change** — REFERENCED. Canon mechanics evolve independently of tutorial altitude; cite-not-restate isolates exactly that axis. spec.md US4 (spec.md:109-132), FR-008, research.md R1 (LEARN.md companion keeps tutorial out of SKILL.md hot path), R7 (drift made mechanically scannable). Second axis: install-target vs source-repo (R6).
2. **Dependency direction** — REFERENCED. LEARN.md = single canonical definition of the mode; SKILL.md points to it, never inlines (contracts/learn-mode.md "Definition locus"; plan.md Constitution Check row 1).
3. **Contract seams** — REFERENCED. Three explicit contracts: learn-mode (registration + normative behavior + refusals), navigation (4-option budget, invariants N1-N5), scaffold (3 guards + failure honesty). install.sh edit is contract-bound (scaffold.md "Deployment precondition"). No generated artefacts in this repo.
4. **Test strategy** — REFERENCED. quickstart.md C1-C6 structural checks + worked walkthrough; acceptance mapping table at quickstart.md:114-123. C6 is manual-inspection only (weakest link).
5. **Naming/vocabulary** — REFERENCED. data-model.md entities Stage/NavigationChoice/ResumeState/AddendumScaffold/CanonicalPointer; fixed stage ids S1-S5 (data-model.md:11-36). Names are honest and match spec Key Entities.
6. **Known compromises** — REFERENCED. R4: resume state in-conversation only (persistence traded away to keep non-mutating default). R8: 007 lands after 006 merges; branch lacks DECISION-PRIMITIVE.md (verified: branch skill dir = 5 files, installed = 6). C3 cite-resolution would fail pre-merge by design.
7. **Public vs internal surface** — INFERRED. Public: trigger phrases, SKILL.md mode list + frontmatter description, README. Internal: LEARN.md stage prose. The frontmatter `description:` is NOT named as an edit target by any contract — see watch item W2.
8. **Effect boundaries** — REFERENCED. Write surface explicitly enumerated and closed: exactly one opt-in write (learn-mode.md "Write surface"; scaffold.md guards 1-3 + failure-honesty clause; R5 probes read-only). This is the design's best seam — preserve it.

### Watch items for the findings round (candidates, evidence on the page; re-ground before authoring)

- **W1 — navigation arithmetic overflows at S5**: jump follow-up claims ≤4 options ("5 − current − next-already-offered = 3, plus back") — research.md R3 / contracts/navigation.md "The jump follow-up". At S5 there is no next stage in slot 1 ("Finish" per quickstart walkthrough), so other stages = 4 + "back" = 5 > the 4-option budget. Contract doesn't fit the primitive at the boundary stage.
- **W2 — frontmatter routing seam unnamed**: SKILL.md:3 YAML description lists the other two modes' triggers; FR-013/contracts name only "mode list" + README. If "chorus learn" never enters the description, skill routing for the trigger is doubtful; C1's grep would pass anyway (it greps the whole file). Registration contract misses the real seam.
- **W3 — SC-003 "one navigation choice" vs two-interaction jump**: navigation.md N2 and quickstart walkthrough call the S1 jump→follow-up path "one navigation choice"; it is two AskUserQuestion interactions. research.md R3 acknowledges "≤2 interactions". Spec ambiguity: choice = decision or interaction?
- **W4 — C3 false positives**: quickstart.md C3 greps `[A-Z-]+\.md` in LEARN.md and requires each hit to exist under skill/chorus-review/. "CHORUS-PROJECT.md" (the scaffold target LEARN.md must mention) matches the regex and will be flagged BROKEN. The check as written cries wolf.
- **W5 — C4 scans 3 of its 4 named blocks**: comment names tally rule, band table, decision catalog, RSVP quorum table; only three greps follow — the quorum table has no scan (quickstart.md:89-97).
- **W6 — duplicate addendum-creation responsibility**: learn-mode S2 scaffold (template copy, TO-FILL flags) vs project-state Phase 5 offer (distilled interview answers) — SKILL.md:488-491. Two creation paths, two content semantics, one target file; no doc says which is canonical or cross-references the other. Coexistence is guarded (no-overwrite) but the responsibility is duplicated, not factored.
- **Good seams to say so about**: closed write surface (need 8); LEARN.md-as-single-definition (R1) honors the repo's DIP; R6 fixes a real reachability hole instead of duplicating the template into LEARN.md (rejected alternative was the DRY violation).

### Gate A findings authored 2026-06-10 (for Gate B/C continuity)

All of W1–W6 confirmed live and authored. Three additions found at authoring time:
- **W7 — deeper-cap vs N1 collision**: navigation.md:13 re-presents the 4-option question after one deeper pass; offering deeper again breaks the one-level cap, dropping it breaks N1. Unspecified.
- **W8 — install sub-step effects unspecified**: learn-mode.md write-surface clause ("This is the whole list") vs R5.1 routing to "clone + ./install.sh" — executes or instructs? never stated.
- **W9 — plan.md:30-31 false claim**: "three-mode-aware SKILL.md" attributed to 006; verified installed 006-era SKILL.md still lists two modes, no "three mode"/"chorus learn" hits. 007 itself creates the third mode.
Severities filed: red = W1 (S5 jump overflow), W2 (frontmatter routing seam), W4 (C3 false positive vs FR-007). Verified for W5: quorum table exists at installed SKILL.md:224-246. Verified for the §-anchor finding: §addendum/§procedure/§artifact/§review-surfaces all resolve today (installed SKILL.md:68/166/545, DECISION-PRIMITIVE.md:91) — C3 checks files only.

### Gate A cross-vote (2026-06-10) — severity lines I held

- **FR-004 vs N5 contradiction = RED** (confirmed across Norman/Richards/Cooper): flat MUST-contradiction in the normative corpus, not fudge-able; tasks cut from spec vs contract diverge.
- **SC-003 "one navigation choice" = YELLOW, not red** (over-rated Norman F2 / Cooper F50; prioritized Evans/Richards yellow versions): resolution is a spec-wording amendment ("≤2 interactions"); the two-step jump design itself is sound. Consistent with my own W3 filing.
- **Outside-repo scaffold suppression = GREEN, not yellow** (over-rated Cooper F58): S2 stays explanatory and still teaches the addendum; only the automation offer is hidden.
- Other lenses independently hit my W1 (S5 overflow → Richards F42), W4 (C3 false positive → Evans F30 red, Richards F43), W5 (C4 gaps → Evans F36), W7 (deeper re-select → Norman F11), W8 (install sub-step effects → Norman F5). Convergence is high; expect the tally to consolidate these clusters.

### Gate A CYCLE 2 (2026-06-10) — incremental pass DONE; all claims verified on page

Self-heal commits 5e15677→33ccdcb. Every carried watch item verified FIXED in the live corpus:

- **W1 fixed**: navigation.md "The jump follow-up" — S5 → S1-S4, no "back" slot, "back" rides built-in Other; arithmetic = exactly 4. S1-S4 = 3 remaining + back = 4.
- **W2 fixed**: spec FR-013 names YAML frontmatter description as routing surface; quickstart C1 asserts it via `sed -n '1,6p' | grep "chorus learn"` + staleness grep ("Two modes" must return nothing).
- **W3 fixed**: SC-003 unit defined exactly on my yellow line — one selection + follow-up, ≤2 AskUserQuestion interactions; restated in US2 test and navigation.md N2.
- **W4 fixed**: C3 scoped to structured `^Cites:` lines only; prose `CHORUS-PROJECT.md` explicitly must NOT trip; doc-granularity limitation recorded.
- **W5 fixed AND pins verified real**: C4 has all four greps. Pin-to-canon match confirmed: "net ≥ +2" = branch SKILL.md:429 + GATE-PRIMITIVE.md:93; "J ∈ {3, 4}" = branch SKILL.md:217; "auto-resolve · audit" = substring of installed DECISION-PRIMITIVE.md:22; "| 1 | RSVP seating" = installed DECISION-PRIMITIVE.md:143. (Latter two installed-side only — R8 sequencing, known.)
- **W6 addressed**: FR-007 + scaffold.md "Two creation paths, one structure" — scaffold = pre-round structural form, Phase 5 = post-interview distillation, template = single source of structure for both (F22).
- **W7 fixed**: navigation.md slot 2 — post-deeper re-presents as "Recap this step"; quickstart S4 trace shows it.
- **W8 fixed**: FR-006 instruct-only; data-model.md SubStep entity with declared effects (install: none; scaffold: exactly one write); union of SubStep effects = whole write surface.
- **W9 fixed**: plan.md:33-36 — 006 does NOT deliver three-mode SKILL.md; 007 performs the reframe (corrected per F25). R8 at research.md:149.

New seams probed: FR-014 SCAFFOLDED marker (exact comment text in scaffold.md Content row; Phase-0 consumer note = SKILL.md edit; R9 at research.md:162) — coherent across spec US3 sc.4 / scaffold.md / data-model AddendumScaffold.marker / relationship diagram. R10 runtime cite-failure (research.md:186) consistent in FR-008, SC-005, CanonicalPointer.runtime_failure, scaffold.md Failure honesty. install.sh:15 honors `CLAUDE_HOME` env var — C5's installed-side assertion mechanism is sound.

### Cycle-2 verdict round FILED (2026-06-10) — family verdicts + new findings

Verdicts: A-J, L-N resolved (L with walkthrough residue); **K NOT resolved** (C6 residue).
Findings filed at the cycle-2 verdict round:

- **W10 (RED, filed) — C6 write-idiom regex is vacuous for 3 of 5 idioms** (quickstart.md:138): `grep -nE "Write tool|Edit tool|\bcp \|\btee \|mkdir |> docs/|>> "` — the `\|` escapes make `\bcp \|\btee \|mkdir ` ONE literal branch ("cp |tee |mkdir ") that can never match. Empirically re-verified at verdict time: `cp …`, `tee …`, `mkdir …` lines pass undetected; only "Write tool", "> docs/", ">> " hit. SC-008's "mechanically checked" claim (spec.md:354-358) is false as written. Fix: unescape the pipes. Family K residue.
- **W11 (YELLOW, filed) — C5 vestigial first stanza** (quickstart.md:127-128): undefined `$CLAUDE_HOME_TMP_CHECK`, redundant install run, leaked mktemp dir; second stanza (quickstart.md:129-131) is the real check. Regen artifact; delete stanza 1.
- **W12 (YELLOW, filed) — walkthrough S5 contradicts the per-step deeper rule** (quickstart.md:60 vs navigation.md:14): S5 shows "Recap this step" though the deeper pass was at S4. Contract wins; fix the walkthrough.
- **W13 (YELLOW, filed) — C2/C3 pass vacuously on zero `Cites:` lines**: C2 greps headings only (quickstart.md:91-93); C3's while-loop over `^Cites:` emits nothing when no lines exist (quickstart.md:102-105). FR-008 (spec.md:278-279) requires a Cites: list per step; no check asserts cardinality ≥1/step. Fix: assert `grep -c "^Cites:"` = 5.
- **W14 (GREEN, filed) — S5 advance-label unspecified**: navigation.md:13 defines slot 1 as "Continue → <next step name>"; S5 has none; walkthrough invents "Finish" (quickstart.md:60), and at S5 slots 1 and 4 both deliver the wrap-up. Name the S5 label in the contract.
- Watch note (out of 007's blast radius): tally formula duplicated in canon itself — branch SKILL.md:429 AND GATE-PRIMITIVE.md:93. Pre-existing; C4 scans only LEARN.md. Not a 007 finding; remember if a canon-refactor feature appears.

### Gate A CYCLE 3 (2026-06-10) — fix-verification exploratory pass DONE

Self-heal commits 96218cc (spec: 10 clarifications, FR-015 + SC-009 added) → 045f540 (plan regen: R1-R12, C1-C7+C5b, navigation.md declared normative). All five cycle-2 filings verified FIXED on the page:

- **W10 (was RED) fixed + empirically verified**: C6 ERE corrected, no escaped pipes (quickstart.md:166); I ran the fixture — 6/6 known-bad lines hit, 0 on clean prose. Better: fixture self-test now runs FIRST so a dead scan fails the suite itself (quickstart.md:167-170). SC-008's "mechanically checked" (spec.md:437-440) is now true. Family K residue closed.
- **W11 fixed**: C5 is one clean stanza (quickstart.md:140-147); mktemp dir rm'd; `^cp .*templates` grep pins the deploy idiom (G8). No `$CLAUDE_HOME_TMP_CHECK`.
- **W12 fixed**: walkthrough S5 shows "Go deeper on results" with per-step depth note (quickstart.md:66-70); navigation.md:19 pins depth state per-step (G24).
- **W13 fixed**: C3 cardinality floor `[ "$n" -ge 5 ]` before resolution loop (quickstart.md:116-118); FR-008 mandates ≥1 Cites/step + check-asserted (spec.md:343-345).
- **W14 fixed**: S5 slot-1 label "Finish the tutorial" pinned in navigation.md:18 with DECLARED Finish/Exit convergence (G3/G27); FR-004 restates (spec.md:312-314).

Structural upgrades this round: navigation.md now the normative surface, walkthroughs illustrative (navigation.md:6-9, R12) — closes contract-vs-example precedence. Need 7 (public/internal surface) upgraded INFERRED→REFERENCED: FR-013 names frontmatter description as routing surface; C1 parses the whole `---`-delimited block via awk (G11) + any-two-mode-phrasing staleness grep (G14). New seam: FR-015/SC-009/C5b plugin packaging — plugin.json exists at repo root, agents/ has 10 .md files; C5b asserts templates + 10/10 packaged.

Re-ground candidates for the verdict round (minor, not pre-judged): C2 still eyeballs "expect: 5 step headings" without a count assertion (quickstart.md:104-108) — cardinality floor went to C3 only; C6's "hits ONLY inside S2 accept branch" remains human-inspected (flagged in-text, consistent with repo precedent); C7 stays a manual dogfood matrix with named owner/trigger (G9, quickstart.md:85-87).

### Stale-by-merge notes

- After 006 merges into this branch, re-validate: SKILL.md mode-list line numbers (currently branch:33, installed:41 differ), and that LEARN.md cites the 006-era band vocabulary. R8 is the gate on this.
