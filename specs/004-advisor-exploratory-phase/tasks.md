# Tasks: Advisor Exploratory Phase

**Input**: Design documents from `specs/004-advisor-exploratory-phase/`
**Prerequisites**: plan.md, spec.md, research.md (D1–D12), data-model.md, contracts/, quickstart.md
**Gate status**: Gate A (design) PASSED at cycle 2/3 — see `agent-sdlc-log.md`. Residual **R2** (freshness-fingerprint granularity) is carried into T005 below.

**Tests**: No unit-test framework (Markdown skill/prompt feature). The "test layer" is the **dogfood run + profile-coverage fitness function + structural smoke checks** from `quickstart.md` (Phase 7).

**Delivery**: editing the installed-from skill at `skill/chorus-review/`, the ten persona files under `agents/`, the addendum template, and `README.md`. No `src/` or runtime.

> **Implementation status (2026-06-07):** T001–T028 + T030 complete (authoring +
> structural validation pass). **T029 (live dogfood)** and **T031 (behavioral
> SC-001…010 validation)** require an actual chorus round + operator interview —
> an operator-driven acceptance step, left unchecked rather than fabricated.
> Note: 5 of the 10 profile sub-agents initially wrote to the parent checkout;
> moved into the worktree and the main checkout was restored.

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: parallelizable (different file, no dependency on an incomplete task)
- **[Story]**: US1 / US2 / US3 (Setup, Foundational, Polish carry no story label)

---

## Phase 1: Setup

- [X] T001 Create `skill/chorus-review/EXPLORATORY-PHASE.md` with a section scaffold (Overview · Procedure · Two-tier memory · Memory-as-index · Staleness & reconciliation · Incremental deltas · Profile-coverage fitness function · Provenance), mirroring the house style of `skill/chorus-review/GATE-PRIMITIVE.md`. Cross-link `specs/004-advisor-exploratory-phase/` as provenance.

---

## Phase 2: Foundational (blocking — the phase mechanic both modes reference)

**These edit the single new mechanic doc sequentially (same file → not parallel).** They must complete before the mode-wiring (US1) and per-lens profiles depend on them.

- [X] T002 Write the per-advisor procedure (steps 1–6: load profile → reuse + deltas → reference-first harvest, addendum-first → bounded analysis → gap-questions → emit record) plus orchestrator steps (7 sessioned batch interview, 8 coverage check), in **cheapest-subset-first** order, into `skill/chorus-review/EXPLORATORY-PHASE.md` (per `contracts/exploratory-phase.md`; FR-002/003/006/007/020).
- [X] T003 Document the **two-tier memory model** in `skill/chorus-review/EXPLORATORY-PHASE.md`: addendum = **authoritative system of record**; per-advisor records MAY denormalize/cache project-wide facts with a reconciliation locator; **confirmed-fact scope** (`project-wide` | `lens-specific`) fixes the home; weak/eventual consistency, addendum-wins (FR-005/014/016/023; `data-model.md`).
- [X] T004 Document the **memory-as-index-never-the-evidentiary-endpoint** principle and the reference-not-duplicate threshold (≤2-sentence quote = navigational hint only) in `skill/chorus-review/EXPLORATORY-PHASE.md` (FR-004/021; SC-001/002).
- [X] T005 Document **staleness/freshness + reconciliation** (re-validate on drift, addendum-wins) and **incremental delta reuse** (round-context paragraph) in `skill/chorus-review/EXPLORATORY-PHASE.md`, and **decide & state the fingerprint granularity** — commit-hash vs mtime vs short content-digest (Gate A residual **R2**; record the choice and its false-stale trade-off) (FR-010/012; D5/D6).
- [X] T006 Document the **profile-coverage fitness function** (every profile item → a tagged record entry; every cached project-wide fact → a reconciliation locator) and the **sessioned, re-entrant, operator-paced interview** (≤5 Q/session, educational preamble full-first/brief-on-resume, degradation summary) in `skill/chorus-review/EXPLORATORY-PHASE.md` (FR-019/022; SC-009/010).

**Checkpoint**: the mechanic doc is complete and self-contained; both modes can now reference it.

---

## Phase 3: User Story 1 — Grounded review via persisted lens understanding (P1) 🎯 MVP

**Goal**: before authoring, a participating advisor builds and persists a lens-specific understanding and reviews from it; a later round reuses it.
**Independent test**: run an advisor through the phase on a target; confirm an understanding record covering its profile needs, findings tracing to that record, and a second round reusing (not rebuilding) it.

- [X] T007 [US1] Wire the exploratory phase into `skill/chorus-review/SKILL.md`: a new step after Phase 0.5 (RSVP) and before Phase 1 (Round 1); reference `EXPLORATORY-PHASE.md`; note it in the "Two modes" section (FR-013; Assumptions/placement).
- [X] T008 [US1] Wire the exploratory phase into `skill/chorus-review/SDLC-LAYER.md`: runs before a gate's Author stage; project base reused across gates with per-gate deltas; reference `EXPLORATORY-PHASE.md` (FR-014; D8).
- [X] T009 [US1] Cross-link the understanding-record format and the reuse/delta rules (`contracts/understanding-record.md`) from `EXPLORATORY-PHASE.md`; confirm the record's `Cached (from addendum)` and scope fields are described (FR-005/009/010).
- [X] T010 [P] [US1] Add the `## Information needs (exploratory phase)` profile to `agents/mark-richards-architect.md`, seeded from `information-needs-profiles.md` (item tags ref/infer/op; one most-load-bearing need).
- [X] T011 [P] [US1] Same profile section into `agents/alan-cooper-advisor.md` (from `information-needs-profiles.md`).
- [X] T012 [P] [US1] Same profile section into `agents/don-norman-advisor.md`.
- [X] T013 [P] [US1] Same profile section into `agents/eric-evans-advisor.md`.
- [X] T014 [P] [US1] Same profile section into `agents/uncle-bob-architect.md`.
- [X] T015 [P] [US1] Same profile section into `agents/kent-beck-persona.md`.
- [X] T016 [P] [US1] Same profile section into `agents/delivery-and-ops-advisor.md`.
- [X] T017 [P] [US1] Same profile section into `agents/security-and-trust-advisor.md`.
- [X] T018 [P] [US1] Same profile section into `agents/constraint-and-flow-advisor.md`.
- [X] T019 [P] [US1] Same profile section into `agents/guido-python-reviewer.md` (opt-in language lens; may mark items that exist only because it is a language lens).
- [X] T020 [US1] Add the orchestrator's grounded-findings invariants to `skill/chorus-review/INTEGRATION-LAYER.md`: findings re-ground in the live source (not persisted memory), run the profile-coverage fitness function, flag provisional findings (FR-021/022; SC-001/006/010).

**Checkpoint**: US1 is independently testable — profiles exist, the phase is wired into both modes, records persist and reuse.

---

## Phase 4: User Story 2 — Reference existing knowledge, don't duplicate it (P2)

**Goal**: the advisor records pointers to what the repo already documents; memory holds references, synthesis, and gaps — never a copy.
**Independent test**: point an advisor at a target that documents its needs; confirm the record references those docs (not reproductions) and that the addendum is consulted first.

- [X] T021 [US2] Add the **"Project understanding"** section (section 7) to `templates/CHORUS-PROJECT.template.md` per `contracts/addendum-project-understanding.md` — operator-owned, authoritative, scope-tagged, operator-accepted-only writes, cache-reconciliation rules, one-fact-one-line (FR-018/023).
- [X] T022 [US2] Reflect **addendum-first harvest** and the "phase supersedes per-round cold-reading by persisting what anchor-discovery surfaces" interplay in `skill/chorus-review/SKILL.md` (and the anchor-discovery procedure note), so reference-first is the default move (FR-003/016; Assumptions).
- [X] T023 [US2] Confirm each agent profile's source tags (ref/infer/op) and the conflicting-sources → drift rule are consistent with reference-not-duplicate across `agents/*.md` and `EXPLORATORY-PHASE.md` (FR-015; SC-002).

**Checkpoint**: US2 testable — references-not-copies, addendum as the first reference surface, drift surfaced.

---

## Phase 5: User Story 3 — Fill gaps by analysis, then a targeted interview (P3)

**Goal**: where the repo can't answer, run bounded analysis; for what remains, the orchestrator runs one sessioned operator interview; answers persist.
**Independent test**: point an advisor at an undocumented need; confirm analysis-first, then a ≤5-question session for the residual gap, the answer persisted, and no re-ask next round.

- [X] T024 [US3] Add the **orchestrator-batched, sessioned interview** to `skill/chorus-review/INTEGRATION-LAYER.md`: collect + dedupe gap-questions across joiners; ≤5-Q re-entrant operator-paced sessions; educational preamble (full first / brief on resume); write-back routing by scope (project-wide→addendum, operator-accepted; lens-specific→record); **degradation summary** on a deferred session (FR-007/017/019; `contracts/gap-interview.md`).
- [X] T025 [US3] Surface the **operator-budget-controlled bounded analysis** and the sessioned interview in both modes — note in `skill/chorus-review/SKILL.md` and `skill/chorus-review/SDLC-LAYER.md` (FR-006/020).

**Checkpoint**: US3 testable — analysis-before-interview, sessioned/paced operator interaction, persisted answers, no re-ask.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T026 [P] Update `README.md`: brief mention of the exploratory phase + two-tier memory, listing it in the workflow without implying the SDLC mode depends on speckit.
- [X] T027 [P] Add a standing grep arch-test (script or documented check) for profile-coverage so the fitness function survives its author — `quickstart.md` smoke-check block + a runnable snippet (Gate A residual; Richards' cycle-2 suggestion).
- [X] T028 Reconcile repo ↔ installed skill: confirm `install.sh` deploys `EXPLORATORY-PHASE.md` and the updated `agents/*.md`; update the uninstall/agent list if it enumerates files (avoid the known install/uninstall drift).

---

## Phase 7: Validation (the test layer — `quickstart.md`)

- [ ] T029 Run the **dogfood exploratory phase** on this repo (chorus-review itself) for a sample of lenses per `quickstart.md`; produce understanding records.
- [X] T030 Run the **profile-coverage fitness function** across all ten `agents/*.md` profiles and the structural smoke checks (profile section present; `EXPLORATORY-PHASE.md` referenced by both modes; template has section 7); record pass/fail.
- [ ] T031 Validate **SC-001…SC-010** against the dogfood output (grounded + re-grounds-in-source; references-not-copies; genuine-gaps-only; delta-only reuse; every advisor profiled; provisional flagging; zero-questions-when-documented; addendum authoritative + caches reconcile; sessioned interview + degradation summary; coverage FF passes); record results in `agent-sdlc-log.md` or a validation note.

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002–T006)** block everything; the mechanic doc must exist and be complete first.
- **US1 (T007–T020)** depends on Foundational. The ten profile transcriptions (T010–T019) are fully parallel (distinct files). T007/T008/T020 edit shared skill docs — sequence them after the profiles or serialize among themselves (same files touched again in US3).
- **US2 (T021–T023)** depends on Foundational; T021 (template) is independent of US1 and can run in parallel with US1's profile tasks.
- **US3 (T024–T025)** depends on Foundational; T024/T025 edit `INTEGRATION-LAYER.md` / `SKILL.md` / `SDLC-LAYER.md` — serialize with US1's T007/T008/T020 (same files).
- **Polish (T026–T028)** after the stories.
- **Validation (T029–T031)** last; T029 → T030 → T031 in order.

⚠️ **Shared-file note**: `SKILL.md`, `INTEGRATION-LAYER.md`, `SDLC-LAYER.md` are each edited by multiple tasks across US1/US2/US3 — those edits are **not** `[P]` with each other. Only the ten `agents/*.md` profile tasks and the independent template/README tasks are truly parallel.

## Parallel Execution Examples

- **Profiles (US1)**: T010–T019 — ten advisor files in parallel.
- **Cross-story parallel**: T021 (template, US2) ∥ T010–T019 (profiles, US1) — different files.
- **Polish**: T026 (README) ∥ T027 (arch-test snippet) — different files.

## Implementation Strategy

- **MVP = US1** (T001–T020): the phase mechanic + both-mode wiring + the ten lens profiles + grounded-findings invariants. This alone delivers "grounded, persisted, reused understanding."
- **Increment 2 = US2** (reference-not-duplicate + addendum section): makes memory a thin index over the project's own docs.
- **Increment 3 = US3** (gap analysis + sessioned interview): closes the loop for undocumented projects.
- **Then** Polish + Validation. Carry residuals **R1** (does grounding lift verdict quality? — an A/B after first real use) and **R3** (cached-quote-as-anchor, bounded) as post-implementation observations; **R2** is resolved in T005.

## Next gate

After implementation, **Gate B** (plan/tasks review) is owed before/around `/speckit-implement` per the agent-SDLC lifecycle — T005's fingerprint-granularity decision and the shared-file sequencing are natural Gate-B inputs.
