# Understanding — Mark Richards — project
Built: 2026-06-07 · Updated: 2026-06-10 (007 Gate A cycle-3 incremental) · Base: (none — no CHORUS-PROJECT.md)

Target: the `chorus-review` skill repo — a **prompt-orchestration / documentation
artifact**, no build step, no runtime. "The architecture" is the layered hierarchy
of skill docs an LLM orchestrator reads at runtime. No `docs/reviews/CHORUS-PROJECT.md`
addendum exists (re-confirmed 2026-06-10: `ls docs/reviews/` → only a review artifact
and a coverage map), so the `## Cached` tier stays empty by construction.

## Project-scoped (carried forward; re-validated where 007 touches it)

### Referenced
- **Architecture style as-built (need 2)** → layered hierarchical-abstraction of prose
  docs, one canonical definition per concept, lower layers referenced not restated.
  Locator: `skill/chorus-review/SKILL.md` (entry) → `INTEGRATION-LAYER.md` "The
  discipline cascade" → `GATE-PRIMITIVE.md` → `EXPLORATORY-PHASE.md`. [carried 06-07;
  007 conforms — see delta]
- **Existing fitness functions / governance (need 6)** → profile-coverage FF
  (`EXPLORATORY-PHASE.md` ~L172), artefact-chain terminus rule (`SKILL.md` L264-289),
  discipline-cascade audit (`INTEGRATION-LAYER.md`). [carried 06-07]
- **Change rate (need 7)** → low volume, high density; `skill/chorus-review/` is the
  churn hotspot. NEW 06-10: feature 006 (PR #5, open) is in flight touching the same
  SKILL.md mode area 007 must edit. Load = orchestrator context budget (SKILL.md is
  ~15 KB read every round — research.md R1 prices this). [refreshed 06-10]
- **Prior decisions (need 8)** → ADR-style in each feature's research.md; no docs/adr.
  [carried 06-07]

### Inferred
- **Ranked characteristics, project tier (need 1)** → 1 evolvability/modifiability,
  2 maintainability/understandability, 3 testability/conformance, 4 auditability,
  5 operator-control. Not optimised: performance/scalability (no runtime).
  [provisional — no addendum to confirm; carried 06-07]
- **Data ownership (need 4)** → addendum = operator-authoritative; per-advisor record =
  lens-owned; write-back = eventual consistency, addendum wins. [carried 06-07]
- **Workflow shape (need 5)** → orchestrated, not choreographed; orchestrator owns all
  operator I/O. [carried 06-07]

## Feature 007 delta — `chorus learn` (Gate A exploratory, 2026-06-10)

### Referenced
- **Feature-local characteristic ranking (need 1)** → the spec's SCs rank:
  1 learnability/usability (SC-001 zero raw-doc reading; SC-002 one-interaction
  stages), 2 safety/least-privilege write surface (SC-004 zero writes unless opted-in),
  3 evolvability/anti-drift (SC-005 cite-not-restate). Locator:
  `specs/007-chorus-learn-onboarding/spec.md` §Success Criteria. Consistent with the
  project tier — evolvability is the guard, learnability the goal.
- **Style conformance (need 2)** → LEARN.md as new companion doc, mode registered in
  SKILL.md's list, content NOT inlined (hot-path token cost priced explicitly).
  Locators: `plan.md` §Project Structure; `research.md` R1.
- **Seams + contract types (need 3)** → three contract docs:
  (a) mode-registration seam — `contracts/learn-mode.md` §Trigger & registration
  (SKILL.md one-paragraph pointer → LEARN.md single canonical definition);
  (b) harness-tool seam — `contracts/navigation.md` (4-option AskUserQuestion budget,
  two-step jump, invariants N1–N5); external coupling to the Claude Code harness;
  (c) write seam — `contracts/scaffold.md` (three guards: opt-in / no-overwrite /
  in-repo; failure-honesty clause forbids reconstructing the template from memory);
  (d) deployment seam — install.sh → $SKILL_DST; R6 extends it to templates/.
- **Data ownership / write surface (need 4)** → ResumeState: conversation-owned, zero
  disk writes (`research.md` R4; `data-model.md` §ResumeState). AddendumScaffold:
  user-repo-owned, the mode's ONLY write (`contracts/scaffold.md`). Template: dual
  location — repo source + installed copy, refresh at install time, installed-first
  read with repo fallback (`contracts/scaffold.md` §Source).
- **Workflow shape (need 5)** → explicit 5-stage state machine with named transitions
  (advance/deeper(≤1 level)/jump(2-step)/exit) — `data-model.md` §NavigationChoice.
- **Fitness functions (need 6)** → C1–C6 in `quickstart.md`: mode-registered,
  stages-present, cite-resolution, no-restatement scan, scaffold safety, non-mutating
  default. C3 doubles as a mechanical enforcement of R8 sequencing (a
  DECISION-PRIMITIVE.md cite breaks on the pre-006 branch).
- **Sequencing coupling (needs 7/8)** → `research.md` R8: 007 lands after 006 (PR #5).
  RUNTIME-VERIFIED 06-10: branch `skill/chorus-review/` has NO DECISION-PRIMITIVE.md;
  installed `~/.claude/skills/chorus-review/` HAS it; branch SKILL.md L33 and README
  L22 both still say "## Two modes"; installed (006-era) SKILL.md says "## Two modes"
  at L41 with decision-discipline text inserted above — so the 006/007 merge conflict
  is real but localized to that region, as R8 claims.
- **install.sh:36 (need 3, runtime-verified)** → `cp -f "$SKILL_SRC"/*.md "$SKILL_DST/"`
  — exactly as R6 states; template unreachable from an installed skill today;
  install.sh:57-60 "Next:" prose already documents the manual copy the scaffold
  automates. Template sections verified: §2 exclusions, §3 anchors, §5 security —
  matches scaffold contract's flagged set.
- **Prior decisions (need 8)** → R1–R8 in `research.md`, each
  Decision/Rationale/Alternatives — ADR-quality.

### Inferred
- **C3 coverage seam** → C3's regex `[A-Z-]+\.md` cannot match
  `CHORUS-PROJECT.template.md` (mixed case), so the template citation escapes the
  cite-resolution check. C5 covers repo-side template existence + greps install.sh for
  the deployment line, but the INSTALLED-side copy ($SKILL_DST/templates/) has no
  post-install assertion anywhere. Mitigated by scaffold.md's failure-honesty clause
  (runtime miss degrades to citing the repo path, never reconstruction). [my analysis;
  candidate finding for authoring phase, severity low]
- **Harness-budget coupling** → the entire navigation contract is sized to
  AskUserQuestion's "exactly 4 options + built-in Other" — asserted in plan.md
  Technical Context, not verifiable from any repo artifact. If the harness budget
  changes, navigation.md breaks wholesale. No fitness function can test it here
  (no runtime); the dogfood walkthrough (plan §Testing) is the only verification.
  [my analysis]

### Open gaps (007)
- AskUserQuestion option-budget assertion unverifiable from repo [lens-specific,
  non-blocking — dogfood walkthrough verifies at implement].
- Post-merge SKILL.md mode-area shape unknown until 006 merges [lens-specific,
  non-blocking — R8 sequences it; conflict locus verified localized].
- ~~No post-install assertion for installed-side template~~ CLOSED cycle 2: C5 now
  asserts installed side; install.sh:15 honors `CLAUDE_HOME` override (runtime-verified
  06-10), so the check is implementable as written.
- No ratified constitution (unfilled speckit template) — standing fact since 003
  [project-wide, non-blocking; operative governance = invariant set].

## Feature 007 cycle-2 delta (Gate A cycle 2, 2026-06-10, commits 5e15677→33ccdcb)

### Closures verified (referenced)
- **C3 → structured Cites** — `quickstart.md` C3 (:102-108) greps `^Cites:` lines only,
  no bare-filename regex; scaffold-target false positive and rename escape both closed
  (FR-008 + SC-005 revised; R7). My cycle-1 red resolved.
- **FR-004/S1/S5** — `navigation.md`: N5 struck (:47-48); exit wrap-up IS the S1
  cheat-sheet (slot 4); S5 jump = S1–S4 no "back" by rule (:28-33); post-deeper slot
  re-presents as "recap" (family L). Spec FR-004 restated to match. Closed.
- **SC-003 unit + consent exclusion** — navigation.md:21-24 "Consent is not navigation";
  unit = ≤2 AskUserQuestion interactions, scoped to the navigation question; sub-step
  confirms are sanctioned extra calls. My third open item closed.
- **FR-014/R9 SCAFFOLDED ternary** — marker + Phase-0 note; locus runtime-verified
  correct: installed `SKILL.md:68-79` "Project addendum" owns the consumer instruction
  ("orchestrator reads it before Phase 0"). Dogfood declines scaffold by default (F61).
- **R10 cite-failure clause** + dual-channel R5 detection — design-level closure of
  the plugin-channel misdetection (family F).
- **R8 corrected per F25** — 007 itself performs the two→three reframe. Re-verified on
  disk 06-10: branch `SKILL.md:33` + `README.md:22` still "## Two modes" (correct —
  the reframe is 007 implementation work); install.sh:36 still ships only
  `skill/chorus-review/*.md`.

### NEW candidate findings (mine, runtime-verified — for the authoring stage)
1. **C6 write-idiom regex broken** (yellow) — `quickstart.md:138` uses ERE `\|`
   (literal pipe), so the cp/tee/mkdir branch matches only the literal string
   `cp |tee |mkdir `. Empirically tested: `cp source target`, `tee file`,
   `mkdir -p docs` all pass undetected. The sole-write invariant (FR-005/SC-008) is
   guarded by a non-firing scan — same defect class (H/K) as cycle-1's C3.
2. **Plugin-channel template path unresolvable as stated** (yellow) — `plugin.json`
   roots the skill at `skill/chorus-review/`; `templates/` is at repo root, two levels
   above the plugin-channel skill base path. scaffold.md:32 claims "both install
   channels work"; C5 asserts file-path side only. Safe degradation exists
   (failure-honesty clause) but the claim is unverified and likely false for plugin
   installs unless the resolution rule names the plugin root.
3. **C1 staleness grep coverage** (nit) — pins `^## Two modes` + "Both modes are
   built" but misses `SKILL.md:30` "Both modes run it", which goes ambiguous in a
   three-mode world.
4. **C5 vestigial lines** (nit) — quickstart.md:127-128 reference undefined
   `$CLAUDE_HOME_TMP_CHECK` and run install.sh twice; half-finished draft left in.
5. **plugin.json agents stale** (green, adjacent) — lists 7 agents; `agents/` has 10
   (missing security-and-trust, constraint-and-flow, guido). 007's S1 probe will
   surface this honestly for plugin users; the defect predates 007.
6. **FR-014 second consumer** (green) — EXPLORATORY-PHASE.md's per-advisor Cached
   tier also consumes the addendum; FR-014's note covers the orchestrator path only.
   Mitigated in-band: the marker text is self-describing in the file itself.

## Feature 007 cycle-3 delta (Gate A cycle 3, 2026-06-10, commits 96218cc→045f540)

### Closures verified (referenced — all six of my cycle-2 candidates addressed at design level)
- **C6 regex (was yellow #1)** → quickstart.md §C6: corrected ERE (one alternation,
  no escaped pipes) + fixture self-test per my G13 — six known-bad lines must all
  fire or suite fails. I traced the fixture against the SCAN; mechanically sound. CLOSED.
- **Plugin template path (was yellow #2) + agents 7/10 (was green #5)** → FR-015
  (spec.md:383) + SC-009 (:447) + R11 (research.md:243): plugin channel is now a
  *delivery* surface; plugin.json = named edit surface gaining templates/ + 3 missing
  agents; new check C5b (quickstart §C5b) compares packaged list vs agents/ dir.
  Resolution order pinned in scaffold.md §Source: (1) repo checkout templates/ →
  (2) <skill-base>/templates/ → (3) plugin root. Live plugin.json verified TODAY:
  still 7 agents, no templates — expected pre-implementation state, C5b is the gate. CLOSED.
- **C1 staleness (was nit #3)** → quickstart §C1 broadened per my G14: `Two
  modes|[Bb]oth modes` over SKILL.md + README.md — catches "Both modes run it". CLOSED.
- **C5 vestigial lines (was nit #4)** → dead stanza deleted per my G15; one clean
  mktemp stanza, no $CLAUDE_HOME_TMP_CHECK. CLOSED.
- **FR-014 second consumer (was green #6)** → FR-014 (spec.md:375) + learn-mode.md
  Phase-0-note row name BOTH consumers (orchestrator + per-advisor exploratory
  cache) per my G17. CLOSED.
- **R12 navigation normativity** (research.md:267; navigation.md header) — contract
  now owns labels/ordering/depth-state; quickstart demoted to illustrative. Fixes
  the inverted binding surface (walkthrough was normative de facto). Sound seam move.

### Residual (carried, non-gating)
- C5b's `grep '"templates' plugin.json` asserts a manifest *declaration*; whether the
  plugin loader honors a templates key vs shipping the whole repo anyway is harness
  behavior, unverifiable from this repo. Physical delivery works either way (plugin
  install = whole repo; resolution step 3 = plugin root). [my analysis; nit-class]

## Operator-confirmed
- (none this round — exploratory phase does not interview.)

## Cached (from addendum)
- (empty — no addendum exists for this repo.)
