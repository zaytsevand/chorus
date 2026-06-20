# Tasks: Chorus Suite Decomposition

**Feature**: 014-chorus-suite-decomposition | **Branch**: `014-chorus-suite-decomposition`
**Inputs**: plan.md, spec.md (incl. Gate-A clarifications), research.md, data-model.md, contracts/, quickstart.md
**Source root**: `/home/az/code/chorus-review`

> Discipline (writing-skills Iron Law): no skill edit is "done" without its parity
> proof. Per FR-015 (tiered): byte-identical moves get structural-equivalence +
> reachability; content-changed skills get full RED-GREEN. Every parity scenario
> asserts on observable output (ledger/artifact/phase sequence) and demonstrates its
> own RED.

## Phase 1 — Setup

- [X] T001 Create `skill/chorus-core/` and `skill/chorus-sdlc/` directories.
- [X] T002 Capture the **pre-split behavior baseline** for parity (FR-015): record, from the current single `skill/chorus-review/`, the observable outputs a review round and an SDLC gate produce (phase sequence, artifact shape, ledger shape) into `tests/parity/baseline.md` BEFORE any file moves. This is the RED reference; it must exist before Phase 2.

## Phase 2 — Foundational: chorus-core substrate (BLOCKS all siblings)

- [X] T003 [P] Move `skill/chorus-review/GATE-PRIMITIVE.md` → `skill/chorus-core/GATE-PRIMITIVE.md` byte-identical (owns S8–S10).
- [X] T004 [P] Move `skill/chorus-review/DECISION-PRIMITIVE.md` → `skill/chorus-core/DECISION-PRIMITIVE.md` byte-identical (owns D1–D5).
- [X] T005 [P] Move `skill/chorus-review/EXPLORATORY-PHASE.md` → `skill/chorus-core/EXPLORATORY-PHASE.md` byte-identical.
- [X] T006 Extract the shared discipline from `skill/chorus-review/INTEGRATION-LAYER.md` into `skill/chorus-core/CONDUCTOR.md`: EWD-340 methodology, conductor voice/shtick, "the chair decides nothing" + slippage table, discipline cascade, system-boundary refusals, AND the full `I1–I9` invariant catalog (the single source). (FR-001)
- [X] T007 Write `skill/chorus-core/SKILL.md` as a lean router: description marks it substrate (no operator trigger, FR-003); body is a small index → on-demand reads of the four files; opens with the **reachability self-check** that fails loudly naming any missing substrate file (FR-002).
- [X] T008 Verify FR-008a residence: confirm `I`/`D`/`S8–S10` are now defined ONLY in chorus-core (grep for stray definitions left in chorus-review). Canonicalize the residence rule statement so FC1/FR-008a/SC-001 cite one source (Richards Gate-A residual).
- [X] T009 Parity (structural, byte-identical moves T003–T005): `diff` each moved primitive against its pre-split content (must be identical) + assert each is reachable via composition. Record in `tests/parity/core-primitives.md`. (FR-015 tier 1)
- [X] T010 Parity (full RED-GREEN, content-changed T006–T007): pressure scenario — an agent invoking chorus-core must reach the I1–I9 catalog and the conductor discipline through the router; demonstrate RED against a deliberately-missing CONDUCTOR.md (self-check fires). Record in `tests/parity/core-conductor.md`. (FR-015 tier 2)

## Phase 3 — US1 (P1): project-state review without lifecycle baggage

- [X] T011 [US1] Rewrite `skill/chorus-review/SKILL.md` to the base round only (Phases 0–5): remove the "two modes" framing and the SDLC pointer; add `REQUIRED: chorus-core`. (FR-004)
- [X] T012 [US1] Slim `skill/chorus-review/INTEGRATION-LAYER.md` to round-specific content (position-in-system for a round, per-phase pre/post 0–5, sees/does-not-see); replace the shared discipline + I1–I9 catalog with references to `chorus-core/CONDUCTOR.md` (do not redefine). (FR-004)
- [X] T013 [US1] Add the **sibling-side substrate guard** to chorus-review: before relying on any core mechanic, assert chorus-core is reachable and fail loudly. The guard MUST specify the **exact operator-facing message content** — names the missing skill, states it means a broken/partial install, and gives the recovery action (re-install / check published name) — not merely "fail loudly." (FR-002a; Gate B GB2/Norman) Then run the FC2 no-fat-sibling check on this sibling immediately (bracket the move, don't wait for Phase 6).
- [X] T014 [US1] Parity (full RED-GREEN): pressure scenario proving a review round fires every phase gate post-split and produces the same artifact shape as `tests/parity/baseline.md`; assert on observable output, not file presence (Beck F8); demonstrate RED with chorus-core absent (sibling guard fires, SC-007). Record in `tests/parity/review-round.md`.

## Phase 4 — US2 (P1): agent-SDLC lifecycle, composing only the substrate

- [X] T015 [US2] Create `skill/chorus-sdlc/SKILL.md` from the current `skill/chorus-review/SDLC-LAYER.md` (pipeline, gate mechanics, S1–S7, ledger, refusals, memory-update phase); add `REQUIRED: chorus-core`; rewrite the line-3 "companion to INTEGRATION-LAYER.md" framing to point at chorus-core. (FR-005)
- [X] T016 [US2] Ensure `S1–S7` in chorus-sdlc only **reference** core's `I1–I9` (no redefinition); remove the old `skill/chorus-review/SDLC-LAYER.md`. (FR-005, FR-006)
- [X] T017 [US2] Add the **sibling-side substrate guard** to chorus-sdlc, with the same exact operator-facing message content as T013 (missing skill + meaning + recovery action). (FR-002a; Gate B GB2) Then run the FC2 no-fat-sibling check on this sibling immediately (bracket the move).
- [X] T018 [US2] Parity (full RED-GREEN): pressure scenario proving an SDLC gate runs the primitive from core and produces the same ledger shape as baseline, **with chorus-review absent** (proves no dependency on the review sibling, FR-006/SC-002); demonstrate RED with chorus-core absent. Record in `tests/parity/sdlc-gate.md`.

## Phase 5 — US3 (P2): extend without touching siblings (reserved seams)

- [X] T019 [P] [US3] Document the reserved-seam contracts in `skill/chorus-core/` as **named contracts** (Published Language across the boundary, not merely documented shapes): extract-stage record contract (`file:line`+`source:`-tagged); agent-memory layout convention; two-tier memory model. So future skills compose them without editing siblings. (FR-017; Gate B GB6/Evans)
- [X] T020 [US3] Confirm the dependency graph is acyclic siblings→core with no review↔sdlc edge. NOTE: the binding acyclicity gate is the per-sibling FC2 run bracketed into T013/T017 (Gate B GB1/Richards — don't let the only check trail in Phase 6 after both siblings are built); this task is the final whole-graph confirmation.

## Phase 6 — US4 (P2): behavior parity + fitness checks

- [X] T021 [P] [US4] Write `scripts/check-suite-integrity.sh` implementing FC1 (invariant-resolution + **residence**: fail on any `I`/`D`/`S8–S10` definition outside chorus-core, FR-008a), FC2 (no-fat-sibling-import), FC3 (manifest-disk + advisor-count). Greppable, exits non-zero on violation, prints locators. (FR-014; harness deferred, FR-019)
- [X] T022 [US4] Run `scripts/check-suite-integrity.sh`; all three checks exit 0 (SC-001, SC-002, SC-005). Fix any violation at its source.
- [X] T023 [US4] Confirm all `tests/parity/*.md` scenarios pass post-split and each demonstrated its own RED (SC-004).

## Phase 7 — US5 (P3): findings→memory configuration contract (seam; impl deferred)

- [X] T024 [P] [US5] Add a findings→memory section to `templates/CHORUS-PROJECT.template.md` (targets + policy; references the secret pre-filter). (FR-009)
- [X] T025 [US5] In `skill/chorus-core/`, document the findings-artifact shape + agent-memory layout as the consuming contract, with **FR-010a** secret pre-filter as a deny-default behavioral obligation (named detector + audit line + hard precondition on the deferred callback) and **FR-010b** sole-reach fence. (FR-010/010a/010b)
- [X] T026 [US5] Confirm NO callback/hook wiring is implemented (FR-011/FR-019); SC-006 negative case documented (a secret-shaped excerpt would be dropped+audited).

## Phase 8 — Polish & cross-cutting

- [X] T027 Update `install.sh` to iterate `skill/*/` → `~/.claude/skills/<name>/` (no hardcoded dir); keep the agents `--force` guard; NO stale-file migration (FR-012). 
- [X] T028 [P] Add the F6-waiver manual upgrade step to `quickstart.md`/README (delete old `~/.claude/skills/chorus-review/` before re-install). (FR-012 waiver)
- [X] T029 Fix `plugin.json`: list all suite skills; add the three unlisted on-disk agents (security-and-trust, goldratt, guido); correct the description advisor count (FR-013). Re-run FC3 (T021) to confirm.
- [X] T030 [P] Record the FR-016 naming-reconciliation task (published `chorus` vs source `chorus-review`); do not silently rename.
- [X] T031 Update `README.md` "Two modes"/install sections for the suite shape (three skills + reserved seams).

## Dependencies & order

- Phase 1 → Phase 2 (baseline T002 before any move). 
- Phase 2 (chorus-core) BLOCKS Phases 3, 4 (siblings compose core).
- Phase 3 (US1) and Phase 4 (US2) are independent of each other (no review↔sdlc edge) — parallelizable once core exists.
- Phase 6 fitness checks (T021–T023) require Phases 2–5 complete.
- Phase 8 polish after siblings exist.

## Parallel opportunities

- T003/T004/T005 (independent byte-identical moves) [P].
- After core (Phase 2): US1 (T011–T014) ∥ US2 (T015–T018).
- T019, T024, T030 [P] (independent docs).

## MVP scope

US1 + US2 over chorus-core (Phases 1–4) = the working split. US3–US5 + polish harden and seam it.

## Format validation

All tasks: checkbox + Tn ID + [P]/[Story] where applicable + explicit file path. ✓
