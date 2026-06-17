# Tasks: Chorus RSVP — Exceptional Entry & Board-Scaled Promotion

**Feature**: 012-rsvp-exceptional-entry | **Spec**: spec.md (v3) | **Plan**: plan.md | **Contract**: contracts/canon-edits.md

> Gate B (plan/tasks review) **skipped per operator direction**. Tasks derive directly from the canon-edit contract (C1–C8) and the conformance stanzas (CS-001..009).
> `[P]` = parallelizable (different files / no shared edit). Canon edits to the **same file** are sequential.

## Phase 1 — Setup
- [ ] T001 Confirm the change surface exists and is the worktree copy: `skill/chorus/{SDLC-LAYER,GATE-PRIMITIVE,SKILL,INTEGRATION-LAYER,DECISION-PRIMITIVE}.md`. Re-read the exact lines named in `contracts/canon-edits.md` before editing.

## Phase 2 — Foundational (the single-home rule edits)
*These define the new rules; reconciliation (Phase 3) depends on them.*
- [ ] T002 **C3** — `GATE-PRIMITIVE.md` Stage 4 tally: replace fixed `net≥+2 / net≤−2` with `T = max(1, floor(N/2))` over non-author `N`; escalate `net≥T`, demote `net≤−T`; note `T=2` at `N=4` (canon-compatible); no tally at `N<2`. (FR-006..011)
- [ ] T003 **C1** — `SDLC-LAYER.md` seating: cap = 5 ordinary JOIN seats; add **exceptional entry** (additive, uncapped, evidence-bar: cite an uncovered delta or be refused; distinct deltas; no adjudicator; voice-not-weight); board-size formula. (FR-001/002/002a/002b/004)
- [ ] T004 **C2** — `SDLC-LAYER.md` S3 invariant: reword to "no **ordinary** panel exceeds 5; exceptional additive (evidence-anchored, D5); board ≤ roster". (same file as T003 → sequential)
- [ ] T005 [P] **C7** — `INTEGRATION-LAYER.md`: add the conductor **side-note** safety net (3 declared regimes; recorded + routed to operator; never alters severity; flag-only, gating version deferred to a separate spec). (FR-012..015)

## Phase 3 — Canon reconciliation (FR-016 / G2) — depends on Phase 2
- [ ] T006 **C5** — `SKILL.md` Phase-2 tally prose (~L507–510): remove the restated `net≥+2 / net≤−2`; **cite** GATE-PRIMITIVE Stage 4; keep the CONFIRM/convergence explanation at summary altitude. (FR-016)
- [ ] T007 **C6** — `SKILL.md` RSVP (Phase 0.5): add the **exceptional-entry** answer (cite an uncovered delta; voice-not-weight; un-anchored refused); cite SDLC-LAYER for seating. (same file as T006 → sequential) (FR-002/002a)
- [ ] T008 [P] **C4** — `GATE-PRIMITIVE.md`:130: tighten "SDLC cap-5 seating" → "SDLC ordinary-seat cap" (citation). (FR-016)
- [ ] T009 [P] **C8** — `DECISION-PRIMITIVE.md`: CHECK seating rows + D5 still describe exceptional entry (self-selected, evidence-anchored); edit only if a row misstates it.

## Phase 4 — Verification (conformance stanzas as the test surface)
- [ ] T010 Author/finalize `quickstart.md` CS-001..009 against the implemented canon (already drafted in Phase 1; reconcile line refs to the post-edit text).
- [ ] T011 Run **CS-009** (canon hygiene): `grep` the canon for `net ≥ +2` / `net ≤ −2` / standalone cap-5 defs; assert the only homes are GATE-PRIMITIVE Stage 4 (threshold) and SDLC-LAYER (seating); all else citations. (G2 gate)
- [ ] T012 Run **CS-004** (backward-compat regression): frozen 5-seat (N=4) fixture → severities identical to pre-feature canon.
- [ ] T013 Run **CS-008** (evidence bar): seated/refused/duplicate fixtures decided by cited evidence, no adjudicator.
- [ ] T014 [P] Run remaining stanzas CS-001/002/003/005/006/007; record pass/red per stanza in the ledger.

## Phase 5 — Gate C
- [ ] T015 `spec-walkthrough` headless (`<NNN> headless`) over the implemented canon; ingest the digest as Gate-C extract records.
- [ ] T016 Gate C chorus (implementation review): author → vote → tally over the canon edits + conformance results; record in `agent-sdlc-log.md`.

## Dependencies
- T002–T005 (define homes) → T006–T009 (reconcile/cite) → T010–T014 (verify) → T015–T016 (Gate C).
- Same-file edits sequential: T003→T004 (SDLC-LAYER); T006→T007 (SKILL); T002 before T008 (GATE-PRIMITIVE).
