---
description: "Task list — feature 011 Slice 1 (gate workflow runner)"
---

# Tasks: Gate Execution on a Native Workflow Substrate (Slice 1)

**Input**: Design documents from `specs/011-gate-workflow-execution/`
**Prerequisites**: plan.md, spec.md (rev 2), research.md, data-model.md, contracts/gate-return.md, quickstart.md

**Tests**: No separate TDD suite requested. Per Constitution V/X, the **conformance stanzas**
(`quickstart.md` C1–C11) are the first-class, non-optional verification surface — each is a falsifiable
red, placed after the content it verifies and before the owning story is done.

**Scope**: Slice 1 only (Author → Vote → Tally + integrity guards). Self-heal + Extract are deferred to
Slice 2 behind a passed SC-001 (spec § Deferred obligations) — no tasks here.

**Single-file constraint**: the runner is one file, `skill/chorus/workflows/gate-runner.mjs`. Implementation
tasks that touch it are therefore **sequential, not [P]**, even across user stories. Only the separate
conformance-check/fixture files are parallelizable.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create `skill/chorus/workflows/` and a `gate-runner.mjs` skeleton (Workflow `meta` with name/description/`phases: [Author, Vote, Tally]`; reads `args = {runId, bands, brief, corpusLocators, seated[]}`; returns the GateReturn shape stub) per plan.md Structure Decision
- [ ] T002 [P] Create `skill/chorus/workflows/conformance/fixtures/frozen-gate.json` — a frozen `{findings, votes}` + expected-bands fixture derived from `contracts/gate-return.md` (the deterministic input for C1/C3/C8/C9/C11)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: blocks all user stories.

- [ ] T003 Encode the canon finding schema and the vote-ballot schema as the runner's `agent({schema})` objects in `skill/chorus/workflows/gate-runner.mjs`, by reference to `contracts/gate-return.md` `$defs` (finding = `{id,lens,evidence,pull_quote,proposed_severity,...}`; ballot = `PRIORITIZE|CONFIRM|OVER-RATE`)
- [ ] T004 Implement the pure tally function `tally(votes, bands) → {P, O, net, band}` in `skill/chorus/workflows/gate-runner.mjs` — reads injected `args.bands` thresholds, **no hardcoded threshold literals** (FR-004/FR-004a; research U1)
- [ ] T005 Add canon wiring subsection "Gate execution on the Workflow substrate (Slice 1, SC-001-gated)" to `skill/chorus/SDLC-LAYER.md`: how the orchestrator reads canon thresholds → builds `args` → invokes `gate-runner.mjs` → re-derives bands with the same thresholds (FR-004b) → consumes fail-closed (FR-007) → persists the ledger; cite spec.md + contracts/gate-return.md (Principle I — cite, don't restate)

**Checkpoint**: schema + tally + seam documented — story work can begin.

---

## Phase 3: User Story 1 — Author/Vote/Tally on the substrate (Priority: P1) 🎯 MVP

**Goal**: A seated panel's findings are authored, voted (author-excluded), tallied in code, and returned
finding-centric; the orchestrator re-derives and persists.

**Independent Test**: run conformance C1–C4, C8–C11 green against the frozen fixture and one live gate.

- [ ] T006 [US1] Implement the Author stage in `skill/chorus/workflows/gate-runner.mjs`: one author `agent()` per `args.seated` lens, schema-validated, labelled `author:<lens>` (FR-002)
- [ ] T007 [US1] Implement S8 routing + Vote stage in `gate-runner.mjs`: route each finding to voters where `voter != finding.lens`, fan out schema-validated ballots labelled `vote:<lens>` (FR-003)
- [ ] T008 [US1] Wire the T004 tally into each finding (compute `votes`→`tally`→`band` with injected thresholds) in `gate-runner.mjs` (FR-004)
- [ ] T009 [US1] Assemble the finding-centric `GateReturn` in `gate-runner.mjs`: each finding carries `votes/tally/band/evidence/pull_quote/transcriptHandle`; top-level `runId`, `gaps[]`, `stageOutcomes` (FR-008, FR-013)
- [ ] T010 [P] [US1] Conformance C1 in `skill/chorus/workflows/conformance/c1-tally-parity.mjs` — frozen fixture bands == `GATE-PRIMITIVE.md` band table; no escape hatch (SC-001)
- [ ] T011 [P] [US1] Conformance C2 in `conformance/c2-threshold-lock.mjs` — `args.bands` == canon band table byte-for-byte AND no threshold literal in `gate-runner.mjs` (FR-004a)
- [ ] T012 [P] [US1] Conformance C3 in `conformance/c3-s8.mjs` — no `votes[].voter == findings[].lens` over the fixture (SC-002 / FR-003a)
- [ ] T013 [P] [US1] Conformance C4 in `conformance/c4-structural-honesty.mjs` — static check that `gate-runner.mjs` has no finding/vote-authoring path (only `agent()` + compute) (SC-002 / FR-005)
- [ ] T014 [P] [US1] Conformance C8 in `conformance/c8-determinism.mjs` — tally twice on identical frozen inputs+args → byte-identical bands (SC-006)
- [ ] T015 [P] [US1] Conformance C9 in `conformance/c9-rederive.mjs` — orchestrator re-derive (same injected thresholds) == returned band (SC-007 / FR-004b)
- [ ] T016 [P] [US1] Conformance C10 in `conformance/c10-transcript-handles.mjs` — every finding+vote carries a resolvable `{runId, agentLabel}` (SC-008)
- [ ] T017 [P] [US1] Conformance C11 in `conformance/c11-reconstructable.mjs` — render ledger body from frozen return; every value byte-traceable to a return field, 0 orchestrator-supplied beyond formatting (SC-009)

**Checkpoint**: US1 (the SC-001 parity experiment) is independently runnable — this is the MVP.

---

## Phase 4: User Story 2 — Fault isolation, quorum floor, bounded hang (Priority: P1)

**Goal**: A dead/hung subagent never aborts the gate silently and never hangs it indefinitely.

**Independent Test**: conformance C6, C7 green (injected failure + injected hang).

- [ ] T018 [US2] Implement fault isolation in `gate-runner.mjs`: a `null` author/voter is filtered and recorded in `gaps[]` with `reason` (never silently dropped) (FR-006)
- [ ] T019 [US2] Implement the quorum floor in `gate-runner.mjs`: if surviving authors < 3, set `stageOutcomes.author = quorum-failed` rather than returning a hollow gate (FR-006)
- [ ] T020 [US2] Implement hang handling in `gate-runner.mjs`: surface substrate infra-timeout `null`s into `gaps[]`; set `stageOutcomes.*=stage-timeout` where the substrate signals it; pin a default run-level bound via `args.timeoutMs` (single-digit minutes) — resolves held 🟡 "FR-006a pins no value"; record the U3 residual inline (substrate may not distinguish timeout-vs-error) (FR-006a; research U3)
- [ ] T021 [P] [US2] Conformance C6 in `conformance/c6-fault-quorum.mjs` — injected failure appears in `gaps[]`; <3 authors → `quorum-failed` (SC-004)
- [ ] T022 [P] [US2] Conformance C7 in `conformance/c7-hang-bounded.mjs` — injected non-returning author surfaces as a recorded gap, never an indefinite hang; assert the U3 residual is documented (SC-004)

**Checkpoint**: US1 + US2 work independently.

---

## Phase 5: User Story 3 — A gating 🔴 is never silently released (Priority: P1)

**Goal**: Absence of an explicit non-🔴 band is treated as gating (fail-closed).

**Independent Test**: conformance C5 green (injected null band).

- [ ] T023 [US3] Ensure `gate-runner.mjs` serializes a missing/unresolved terminal band as `band: null` (never an implicit pass) (FR-007)
- [ ] T024 [US3] Document + specify the orchestrator's fail-closed consumption in `skill/chorus/SDLC-LAYER.md` (T005's subsection): any `null`/absent band is consumed as **gating**; only an explicit non-🔴 band releases a finding (FR-007, Principle VII)
- [ ] T025 [P] [US3] Conformance C5 in `conformance/c5-fail-closed.mjs` — injected `band:null` consumed as gating, 0 released without an explicit non-🔴 band (SC-003)

**Checkpoint**: all three P1 stories independently functional.

---

## Phase 6: Polish & Cross-Cutting

- [ ] T026 [P] Add a conformance entry point `skill/chorus/workflows/conformance/run-all.mjs` that runs C1–C11 and reports pass/fail; reference it from `quickstart.md`
- [ ] T027 [P] Record Gate B inputs in `specs/011-gate-workflow-execution/agent-sdlc-log.md`: the U3 timeout residual + the 3 standing held 🟡 (throughput-axis SC unmeasured, CF-4 fixture is Slice 2, FR-006a value now pinned in T020)
- [ ] T028 Run the full `quickstart.md` conformance suite (C1–C11) and confirm all green before Slice 1 is called done (SC gate)
- [ ] T029 [P] Add a Slice-2 deferral pointer in `skill/chorus/SDLC-LAYER.md` (self-heal + extract behind a passed SC-001; CF-4/CF-11 obligations) so the boundary is discoverable from canon

---

## Dependencies & Execution Order

- **Setup (T001–T002)** → **Foundational (T003–T005)** → **US1 (T006–T017)** → **US2 (T018–T022)** → **US3 (T023–T025)** → **Polish (T026–T029)**.
- US2 and US3 depend on US1's return assembly (T009) since they extend the same return/runner; they are **not** independently startable before T009 despite all being P1.
- Within each story: runner edits (sequential, same file) before that story's conformance checks.

### Parallel opportunities

- T002 is [P] with T001-adjacent setup.
- **Conformance checks are the real parallel surface**: T010–T017 (US1), T021–T022 (US2), T025 (US3) are each separate files → [P] within their story.
- Runner-editing tasks (T006–T009, T018–T020, T023) are **sequential** — one file, `gate-runner.mjs`.

## Implementation Strategy

**MVP = US1** (T001–T017): the SC-001 parity experiment. Build it, run C1–C4/C8–C11 green, and that alone
retires-or-refutes the prior "orchestration strictly negative" verdict — **stop and validate before US2/US3**.
US2 (resilience) and US3 (fail-closed) are independent hardening increments on top. Slice 2 (self-heal,
extract) is out of scope until SC-001 passes.

## Notes

- [P] = different files, no dependency. The runner is one file → most implementation tasks are sequential.
- Adoption (replacing plain-Agent dispatch) is **not** in these tasks — it remains a separate operator call
  gated on a passed SC-001 (spec § Out of scope; memory [[no-ultracode-mode]]).
- Commit after each task or logical group; never push to main.
