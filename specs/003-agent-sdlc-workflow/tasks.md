---
description: "Task list for Agent-SDLC Workflow implementation"
---

# Tasks: Agent-SDLC Workflow

**Input**: Design documents from `specs/003-agent-sdlc-workflow/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: This feature has no code and was not requested with TDD. "Tests" here
are **procedural validation** — a dogfood dry-run plus structural smoke checks
(`quickstart.md`), not unit tests. Validation tasks appear per story.

**Deliverable**: Markdown skill artifacts. No `src/`/`tests/` tree. Files
touched: new `skill/chorus-review/GATE-PRIMITIVE.md`, new
`skill/chorus-review/SDLC-LAYER.md`, edits to
`skill/chorus-review/INTEGRATION-LAYER.md`, `skill/chorus-review/SKILL.md`, and
`README.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different file, no dependency on an incomplete task)
- **[Story]**: US1 / US2 / US3 (omitted for Setup, Foundational, Polish)

---

## Phase 1: Setup

**Purpose**: create the two new skill docs as skeletons so later tasks fill sections.

- [X] T001 Create `skill/chorus-review/GATE-PRIMITIVE.md` with title and section skeleton (Stage 1 Extract, Stage 2 Author, Stage 3 Vote, Stage 4 Tally, Adoption note) mirroring `specs/003-agent-sdlc-workflow/contracts/gate-primitive.md`
- [X] T002 [P] Create `skill/chorus-review/SDLC-LAYER.md` with title and section skeleton (Position in the system, Pipeline, Gate mechanics, Invariants S1–S9, Ledger) mirroring design §2–§9 in `docs/superpowers/specs/2026-06-06-agent-sdlc-workflow-design.md`

---

## Phase 2: Foundational (the shared gate primitive — BLOCKS all stories)

**Purpose**: author the single canonical four-stage primitive that both the SDLC
gates (US1) and the base round (US3) reference. No story can be meaningful until
this exists.

**⚠️ CRITICAL**: complete before US1/US2/US3.

- [X] T003 Author Stages 1–4 (actor, input, output, success criterion, must-not) plus the **extract-record schema** in `skill/chorus-review/GATE-PRIMITIVE.md`, per `contracts/gate-primitive.md`
- [X] T004 Author the deterministic **symmetric tally** in `skill/chorus-review/GATE-PRIMITIVE.md` Stage 4 — `net = P − O`, `±2` escalate/demote one level, gating = post-tally 🔴, no tally ties — per `research.md` D2
- [X] T005 [P] Add invariants **S8** (author ≠ grader) and **S9** (no synthesized vote; deterministic tally) to `skill/chorus-review/GATE-PRIMITIVE.md`, per `contracts/sdlc-invariants.md`
- [X] T006 [P] Add the **Adoption note** to `skill/chorus-review/GATE-PRIMITIVE.md` requiring both `INTEGRATION-LAYER.md` and `SDLC-LAYER.md` to reference it rather than restate the mechanic

**Checkpoint**: the primitive is canonical and complete; stories can begin.

---

## Phase 3: User Story 1 — Gated lifecycle pipeline (Priority: P1) 🎯 MVP

**Goal**: an operator can drive a feature through specify → plan → Gate A → tasks
→ Gate B → implement → Gate C, halting on 🔴, with a per-feature ledger.

**Independent Test**: invoke SDLC mode on a small feature; confirm the ordered
pipeline runs, halts on an open 🔴, proceeds when none, and writes a
reconstructable ledger.

- [X] T007 [US1] Author the lifecycle pipeline and phase ordering (specify → optional clarify → plan → Gate A → tasks → Gate B → implement → Gate C) in `skill/chorus-review/SDLC-LAYER.md`, per design §3 (FR-002)
- [X] T008 [US1] Author the per-gate **RSVP + cap-5 seating** rule (independent per gate; relevance score 0–3; overflow→operator; `<3` quorum) in `skill/chorus-review/SDLC-LAYER.md`, per `contracts/rsvp-and-panel.md` (FR-008, FR-009)
- [X] T009 [US1] Author **block-on-🔴** semantics and the **incorporation loops** (Gate A: clarify→plan; Gate B: clarify→plan→tasks; Gate C: code fix or clarify→re-implement) with **loop bound N=3 → escalate** in `skill/chorus-review/SDLC-LAYER.md`, per `research.md` D8 (FR-010, FR-011, FR-012)
- [X] T010 [US1] Author lifecycle invariants **S1–S7** in `skill/chorus-review/SDLC-LAYER.md`, per `contracts/sdlc-invariants.md`
- [X] T011 [US1] Specify the **per-feature ledger** format and location `specs/<feature>/agent-sdlc-log.md` in `skill/chorus-review/SDLC-LAYER.md`, per `contracts/sdlc-ledger.md` (FR-015)
- [X] T012 [P] [US1] Add the SDLC-mode **trigger and section** ("run the agent-SDLC on feature 0NN") to `skill/chorus-review/SKILL.md`, pointing at `SDLC-LAYER.md` (FR-001)
- [X] T013 [P] [US1] Add the SDLC-mode **subsection** to `README.md` (lifecycle mode vs base round; when to use which)
- [X] T014 [US1] Validation: produce a worked **sample ledger** in `quickstart.md` demonstrating SC-001 (no orchestrator-authored artifacts), SC-002 (no silent 🔴), SC-007 (reconstructable), SC-008 (≤5 panel)

**Checkpoint**: the pipeline is usable end-to-end and auditable via the ledger.

---

## Phase 4: User Story 2 — Trustworthy verdicts via stage separation (Priority: P2)

**Goal**: every gate's verdict is produced by separated stages — author never
grades, orchestrator never invents a vote.

**Independent Test**: run a single gate; confirm extract → uncapped author →
vote (by non-authors) → deterministic tally, with no author grading its own
finding and no synthesized vote.

- [X] T015 [US2] Author the **vote-dispatch rule** that excludes each finding's author from its vote (S8) and forbids synthesized/predicted votes (S9), in `skill/chorus-review/SDLC-LAYER.md` (referencing `GATE-PRIMITIVE.md` Stage 3) (FR-006, FR-007)
- [X] T016 [US2] Wire the **headless `spec-walkthrough`** fixed viewpoint at **Gate C** (`Skill(skill: "spec-walkthrough", args: "<NNN> headless")`; ingest digest as `source: "spec-walkthrough"` extract records; log unclaimed DRIFT/SURPRISE as non-gating) in `skill/chorus-review/SDLC-LAYER.md`, per `research.md` D7 (FR-018)
- [X] T017 [US2] Add the end-of-run **S1–S9 self-audit checklist** to the ledger usage in `skill/chorus-review/SDLC-LAYER.md`, per `contracts/sdlc-invariants.md`
- [X] T018 [US2] Validation: extend the `quickstart.md` worked example to demonstrate SC-003 (no author grades own finding; votes are real) and SC-004 (uncapped authoring — count tracks the artifact)

**Checkpoint**: gate verdicts are demonstrably honest; the back-test failure mode is structurally prevented.

---

## Phase 5: User Story 3 — One shared primitive, no drift (Priority: P3)

**Goal**: the base project-state round adopts the same primitive; exactly one
definition exists.

**Independent Test**: confirm one canonical `GATE-PRIMITIVE.md`, the base round
references it (finding caps removed), and "spawn the chorus" still behaves the same.

- [X] T019 [US3] Refactor `skill/chorus-review/INTEGRATION-LAYER.md` Phases 1/2/4 to **reference `GATE-PRIMITIVE.md`** (name the Extract stage, route through tally, author≠grader) and add **S8/S9** to its invariant set
- [X] T020 [US3] Update `skill/chorus-review/SKILL.md` Phase 1/2/4 text to the four-stage primitive and state authoring is **uncapped** — clarify the Phase-1 500–700 word limit bounds prose density, not finding count (FR-005, FR-017)
- [X] T021 [US3] Verify the **single canonical definition** (SC-006): both `INTEGRATION-LAYER.md` and `SDLC-LAYER.md` reference `GATE-PRIMITIVE.md`; the mechanic is not restated anywhere
- [X] T022 [P] [US3] Verify the base-round **user-facing flow is unchanged** (FR-017): "spawn the chorus" path in `SKILL.md` still reads the same to the operator; only internal phase mechanics defer to the primitive

**Checkpoint**: both modes share one primitive; no drift; base round preserved.

---

## Phase 6: Polish & Cross-Cutting

- [X] T023 [P] Run the structural smoke checks from `quickstart.md` (`test -f skill/chorus-review/GATE-PRIMITIVE.md`; both layers grep-reference it; `grep` finds no per-author finding cap in `SKILL.md`)
- [X] T024 [P] Cross-link `docs/superpowers/specs/2026-06-06-agent-sdlc-workflow-design.md`, this spec, and the contracts from `SDLC-LAYER.md` / `GATE-PRIMITIVE.md` for traceability
- [ ] T025 Full dogfood **live run** of the agent-SDLC on a small real feature; write the resulting `specs/<that-feature>/agent-sdlc-log.md` with the S1–S9 self-audit — **operator acceptance step** (a real multi-agent run; an illustrative ledger is in `quickstart.md`, but a live run is not fabricated here)
- [X] T026 [P] Final consistency pass on `README.md` (headline/principles mention SDLC mode; counts and links correct)

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (P1)**: none.
- **Foundational (P2)**: depends on Setup; **blocks all stories** (the primitive is the shared substrate).
- **US1 / US2 / US3**: depend on Foundational. US1 is the MVP. US2 deepens the gate internals US1 invokes; US3 backports the primitive to the base round.
- **Polish (P6)**: depends on US1–US3.

### Story dependencies

- **US1 (P1)** — needs the primitive (Phase 2). Independently testable: the pipeline + ledger.
- **US2 (P2)** — needs the primitive (Phase 2); sharpens the vote/tally honesty US1's gates rely on. Independently testable on a single gate.
- **US3 (P3)** — needs the primitive (Phase 2); edits the base-round docs. Independent of US1/US2 content; touches different files (`INTEGRATION-LAYER.md`, `SKILL.md` phase text).

### Within stories

- Author the primitive (Phase 2) before any gate doc references it.
- In US1: pipeline (T007) before gate mechanics (T008–T011) before SKILL/README wiring (T012–T013) before validation (T014).

### Parallel opportunities

- T005, T006 (Phase 2) — different sections, parallel after T003/T004.
- T012, T013 (US1) — `SKILL.md` and `README.md`, parallel.
- T022 (US3) parallel with T023/T024/T026 (Polish) — different files.
- US3 (base-round docs) can proceed in parallel with US1/US2 (new docs) since they touch different files — but keep T021's single-definition check last.

---

## Parallel Example: User Story 1

```text
# After T007 (pipeline) lands, these touch different files / sections:
Task: T012 — SDLC trigger + section in skill/chorus-review/SKILL.md
Task: T013 — SDLC subsection in README.md
```

---

## Implementation Strategy

### MVP first (US1 only)

1. Phase 1 Setup → Phase 2 Foundational (the primitive).
2. Phase 3 US1 → the gated pipeline + ledger.
3. **STOP and validate** US1 independently (run it on a small feature; read the ledger).

### Incremental delivery

1. Setup + Foundational → primitive ready.
2. US1 → operable gated pipeline (MVP).
3. US2 → demonstrably honest verdicts (stage separation, self-audit).
4. US3 → base round adopts the primitive; one definition, no drift.
5. Polish → smoke checks + worked dogfood example.

---

## Notes

- [P] = different file, no dependency on an incomplete task.
- "Validation" tasks are procedural (dogfood dry-run + structural greps), not unit tests.
- Commit after each task or logical group.
- The primitive (Phase 2) is the load-bearing artifact — author it carefully before anything references it.
