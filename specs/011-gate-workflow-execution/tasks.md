---
description: "Task list — feature 011 Slice 1 (gate workflow runner)"
---

# Tasks: Gate Execution on a Native Workflow Substrate (Slice 1)

**Input**: Design documents from `specs/011-gate-workflow-execution/`
**Prerequisites**: plan.md, spec.md (rev 2), research.md, data-model.md, contracts/gate-return.md, quickstart.md

**Status (2026-06-17)**: Slice 1 implemented. Deterministic conformance **10 pass / 0 fail / 1
runtime-deferred skip** (`node skill/chorus/workflows/conformance/run-all.mjs`). Two honest
deviations recorded: (a) the 11 per-file conformance stanzas are implemented as **one suite**
(`run-all.mjs`) for Slice-1 pragmatism; (b) C7 (hang) is a runtime-deferred SKIP and C10 is verified
statically (live resolution needs the Workflow runtime). Awaiting Gate C.

**Tests**: conformance stanzas (`quickstart.md` C1–C11) are the first-class verification surface.
**Scope**: Slice 1 only; self-heal + Extract deferred to Slice 2.
**Single-file constraint**: runner edits are sequential (one file); conformance checks are the [P] surface.

## Phase 1: Setup

- [X] T001 Create `skill/chorus/workflows/` and `gate-runner.mjs` skeleton (Workflow `meta` + `phases: [Author, Vote, Tally]`; reads `args`)
- [X] T002 [P] Create `skill/chorus/workflows/conformance/fixtures/frozen-gate.json` (frozen `{findings,votes}` + expected bands; covers escalate/demote/hold/cap/null)

## Phase 2: Foundational

- [X] T003 Encode finding + vote-ballot schemas as the runner's `agent({schema})` objects in `gate-runner.mjs` (per contracts/gate-return.md)
- [X] T004 Implement pure `tally(votes)` + `deriveBand(proposed, net, bands)` in `skill/chorus/workflows/gate-core.mjs` — injected thresholds, no literals (FR-004/FR-004a; research U1)
- [X] T005 Add canon wiring subsection "Gate execution on the Workflow substrate (Slice 1, SC-001-gated)" to `skill/chorus/SDLC-LAYER.md` (orchestrator: build args → invoke → re-derive → fail-closed → persist)

## Phase 3: User Story 1 — Author/Vote/Tally (P1) 🎯 MVP

- [X] T006 [US1] Author stage in `gate-runner.mjs`: one author `agent()` per seated lens, schema-validated, labelled `author:<lens>` (FR-002)
- [X] T007 [US1] S8 routing + Vote stage in `gate-runner.mjs`: voters where `voter != finding.lens`, schema-validated ballots (FR-003)
- [X] T008 [US1] Wire `gate-core` tally/band into each finding with injected thresholds (FR-004)
- [X] T009 [US1] Assemble finding-centric `GateReturn` (votes/tally/band/evidence/pull_quote/transcriptHandle + runId/gaps/stageOutcomes) (FR-008, FR-013)
- [X] T010 [P] [US1] C1 tally parity (frozen fixture → expected bands; no escape hatch) — SC-001 ✓ PASS
- [X] T011 [P] [US1] C2 thresholds canon-locked + no literals — FR-004a ✓ PASS
- [X] T012 [P] [US1] C3 executable S8 (clean + planted self-vote) — SC-002 ✓ PASS
- [X] T013 [P] [US1] C4 structural honesty (runner delegates, no authoring/tally path) — SC-002/FR-005 ✓ PASS *(comment/string-stripping added after a real first-run false positive)*
- [X] T014 [P] [US1] C8 determinism (byte-identical bands) — SC-006 ✓ PASS
- [X] T015 [P] [US1] C9 re-derive consistency (clean + planted corruption) — SC-007/FR-004b ✓ PASS
- [X] T016 [P] [US1] C10 diagnosable handles (runner constructs `{runId,agentLabel}`) — SC-008 ✓ PASS *(static; live resolution deferred)*
- [X] T017 [P] [US1] C11 ledger reconstructable (provenance for every rendered value) — SC-009 ✓ PASS

## Phase 4: User Story 2 — fault isolation, quorum, bounded hang (P1)

- [X] T018 [US2] Fault isolation: `null` author/voter filtered + recorded in `gaps[]` (FR-006)
- [X] T019 [US2] Quorum floor: <3 surviving authors → `stageOutcomes.author = quorum-failed` (FR-006)
- [X] T020 [US2] Hang handling: substrate infra-timeout `null` → `gaps[]`; U3 residual (substrate may not distinguish timeout vs error) recorded; run-level bound is the orchestrator's `args` concern (FR-006a) *(partial — in-runner mechanism done; clock-bound timeout cannot live in the runner, see research U3)*
- [X] T021 [P] [US2] C6 fault recorded + quorum floor — SC-004 ✓ PASS
- [~] T022 [P] [US2] C7 hang bounded — SC-004 **SKIP (runtime-deferred)**: needs the live Workflow runtime to inject a non-returning agent; documented in run-all.mjs + research U3

## Phase 5: User Story 3 — fail-closed 🔴 (P1)

- [X] T023 [US3] `gate-core` serializes missing/unresolved terminal band as `band: null` (never implicit pass) (FR-007)
- [X] T024 [US3] Orchestrator fail-closed consumption documented in `SDLC-LAYER.md` (null/absent → gating; only explicit non-🔴 releases) (FR-007/Principle VII)
- [X] T025 [P] [US3] C5 fail-closed on null band — SC-003 ✓ PASS

## Phase 6: Polish & Cross-Cutting

- [X] T026 [P] Conformance entry point `conformance/run-all.mjs` running C1–C11; referenced from quickstart.md
- [X] T027 [P] Record Gate B inputs in `agent-sdlc-log.md` (U3 residual; 3 standing held 🟡; the per-file→suite + C7/C10 deviations)
- [X] T028 Run full conformance suite — **10 pass / 0 fail / 1 skip** (exit 0)
- [X] T029 [P] Slice-2 deferral pointer added to `SDLC-LAYER.md` (self-heal + extract behind passed SC-001; CF-4/CF-11)

## Notes

- Adoption (replacing plain-Agent dispatch) is **not** here — separate operator call gated on a passed
  live SC-001 ([[no-ultracode-mode]]). The deterministic core is proven; the **live fan-out** (the runtime
  half of SC-001, and C7/C10) is the experiment itself and is intentionally not run in this implement step.
