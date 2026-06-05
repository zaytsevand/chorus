---
description: "Task list for Constraint-and-Flow Advisor (002-rational-product-voice)"
---

# Tasks: Constraint-and-Flow Advisor (Rational Product-First Counterweight)

**Input**: Design documents from `specs/002-rational-product-voice/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: No automated test tasks are generated. This is a prompt/persona repository with no test
harness; the spec requests **behavioural validation** (a chorus dry-run), captured in `quickstart.md`.
Validation tasks below run those checks rather than unit tests.

**Organization**: Tasks are grouped by user story. Because a persona is one coherent artifact whose
conduct spans all three stories, the full agent file is authored once in **Foundational**; each user
story is then an independently-testable behavioural slice of that persona.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 / US2 / US3 (user-story phases only)

## Path Conventions

Docs-as-code single project. Real paths: `agents/`, `skill/chorus-review/`, `README.md`, `install.sh`,
`templates/`. No `src/`/`tests/` tree applies (see plan.md → Structure Decision).

---

## Phase 1: Setup

**Purpose**: Gather the inputs needed to author a coherent persona.

- [ ] T001 Re-read `specs/002-rational-product-voice/research.md` (8 decisions) and the canonical persona anatomy in `agents/security-and-trust-advisor.md`; pick an unused frontmatter `color` (peers use yellow/etc.) for `agents/constraint-and-flow-advisor.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the persona and make it a live, dispatchable chorus member. **No user story can be validated until this phase is complete.**

**⚠️ CRITICAL**: The persona file and its RSVP registration block all three stories.

- [ ] T002 Author the complete persona file `agents/constraint-and-flow-advisor.md` per `data-model.md` E1+E2: YAML frontmatter (`name: constraint-and-flow-advisor`, `description` with Goldratt+Reinertsen lineage / Ries-Duke-Cagan cited + 3 `<example>` contexts, `model: inherit`, `color`, `memory: user`) and all eight body sections — Your Central Thesis · Your Three Convictions · Accusations You Are Built To Make · Five Whys (worked trace + bedrock = "a 99%-defensible claim that work is off the learning constraint") · Scope and Anchor Files · What You Do Not Do · Relationship to Other Personas · Memory and Project Context (`~/.claude/agent-memory/constraint-and-flow-advisor/`). Absorb the three cross-cutting concerns natively (E2). **Additive-only: do not edit any existing persona file.**
- [ ] T003 Register the persona in the RSVP roster so the chorus dispatches it: in `skill/chorus-review/SKILL.md`, add it to the `description` persona list AND change the Phase 0 Brief "Default chorus roster is **eight**:" → "**nine**:" with a new enumerated entry. (Behaviour-gating: without this, the persona is never RSVP'd.)
- [ ] T004 Reinstall and confirm liveness: run `./install.sh --force`; verify `~/.claude/agents/constraint-and-flow-advisor.md` exists and the installer reports nine agents (quickstart.md §0).

**Checkpoint**: Persona is authored, registered, and installed — a dispatchable ninth lens.

---

## Phase 3: User Story 1 — A deferral voice in the room (Priority: P1) 🎯 MVP

**Goal**: The advisor self-selects via RSVP and emits at least one defer / cut / sequence recommendation with an explicit opportunity cost, a named hypothesis, and the sanctioned constraint-argument evidence — and abstains honestly when nothing is deferrable.

**Independent Test**: Run a chorus round on an area where craft personas recommend non-trivial investment; confirm the new voice participates and produces a defensible deferral with the right evidence form (and abstains on a load-bearing-only round).

- [ ] T005 [US1] Validate participation + deferral (SC-001, SC-002): run a chorus round (`/chorus-review`) on a target where craft personas recommend new abstractions/tests/structure; confirm the advisor RSVPs JOIN, reads the same anchor files, and emits ≥1 defer/cut/sequence recommendation carrying opportunity cost + named hypothesis + the falsifiable constraint argument, attributable to its governing belief — per `quickstart.md` §2 and `contracts/persona-contract.md` (Phase 0.5 + Phase 1).
- [ ] T006 [US1] Validate honest abstention (US1 scenario 2, FR-003): run a round where every finding is load-bearing; confirm the advisor replies ABSTAIN or states "nothing deferrable this round" instead of manufacturing a cut — per `quickstart.md` §3.
- [ ] T007 [US1] If T005/T006 fail, refine the relevant persona sections (Accusations / Five Whys / evidence form / What You Do Not Do) in `agents/constraint-and-flow-advisor.md`, rerun `./install.sh --force`, and re-validate until SC-001 and SC-002 pass.

**Checkpoint**: MVP — the missing deferral axis is in the room and behaving. Shippable on its own.

---

## Phase 4: User Story 2 — Opportunity cost made explicit in reconciliation (Priority: P2)

**Goal**: A conflict between the advisor and a craft persona is recorded as an explicit priced trade-off (both positions, costs, resolving experiment), and hard invariants override deferral.

**Independent Test**: Construct a round with a direct "invest now" vs "defer behind a test" conflict; confirm the reconciliation output prices both sides and leaves the decision open; confirm a hard invariant is marked ineligible for deferral.

- [ ] T008 [US2] Validate priced trade-off (SC-003, FR-008): construct a round with a craft "invest now" finding vs the advisor's "defer behind a test"; confirm Phase 3 reconciliation records both positions, cost-now vs cost-of-deferring, and the resolving experiment — no auto-resolution — per `quickstart.md` §4.
- [ ] T009 [US2] Validate hard-invariant override (SC-004, FR-009): have the advisor propose deferring an item another persona flagged as a hard correctness/security/data-integrity invariant; confirm the artifact marks it **ineligible for deferral** — per `quickstart.md` §5.
- [ ] T010 [US2] Only if T008/T009 reveal the machinery silently auto-resolves or omits the priced form: add a minimal clarifying note to the reconciliation step in `skill/chorus-review/SKILL.md` (Phase 3) and/or `skill/chorus-review/INTEGRATION-LAYER.md` stating conflicts involving the advisor record a priced trade-off and hard invariants override (FR-008/FR-009). Otherwise record "reused unchanged" in the task notes.

**Checkpoint**: The advisor's dissent survives reconciliation as a priced, user-decidable trade-off.

---

## Phase 5: User Story 3 — Deferability as a ranking dimension (Priority: P3)

**Goal**: Final ranking reflects a cost-of-learning / iteration-speed dimension (CD3 / cost of delay), so a cheap high-information experiment can outrank an expensive low-information correctness investment.

**Independent Test**: Take a completed round through Phase 4 ranking with one cheap experiment and one expensive correctness item of comparable severity; confirm the cheap experiment can rank higher with a recorded rationale.

- [ ] T011 [US3] Validate deferability ranking (SC-007, FR-011): run a round through Phase 4 with a cheap hypothesis test vs an expensive correctness investment; confirm the ranking surfaces the CD3/cost-of-delay deferability dimension and can place the cheap experiment higher with recorded rationale — per `quickstart.md` §6.
- [ ] T012 [US3] Only if T011 shows the dimension is not surfaced: add a minimal note to the ranking step in `skill/chorus-review/SKILL.md` (Phase 4 — Cost / Value / Convergence + deferability/cost-of-learning sourced from the advisor; FR-011). Otherwise record "reused unchanged."

**Checkpoint**: All three behavioural slices independently validated.

---

## Phase 6: Polish & Cross-Cutting — Roster consistency (SC-005/SC-006) & docs

**Purpose**: Make every enumeration surface agree on "nine" and name the advisor (FR-013/SC-005). Required, not optional. See `contracts/roster-consistency.md`.

- [ ] T013 Update `README.md` in three spots: headline "**Eight** persona advisors …" → "**Nine** …" + add the advisor name; Install section "the **eight** persona agents" → "the **nine**"; Principles matrix → add a **"Constraint-and-Flow reads it as"** column giving its read of each cross-cutting concern (Interface Contracts / Local Purity & Explicit Effects / Behavioural Assertions per `data-model.md` E2).
- [ ] T014 [P] Update `skill/chorus-review/INTEGRATION-LAYER.md`: "**Eight** lenses" and "**eight-lens** composition" → "Nine" / "nine-lens" (both occurrences).
- [ ] T015 [P] Update `install.sh` line 4 comment and line 38 echo: "**seven** persona agents" → "**nine** persona agents" (corrects pre-existing stale count).
- [ ] T016 [P] Verify `templates/CHORUS-PROJECT.template.md` for any default-roster/count reference; update if present, else record "verified — no roster count to change."
- [ ] T017 Run the roster-consistency grep (`quickstart.md` §1) across SKILL.md, INTEGRATION-LAYER.md, README.md, install.sh, CHORUS-PROJECT.template.md; confirm no surface states seven/eight for the default roster and every enumerating surface names `constraint-and-flow-advisor` (SC-005); confirm additive-only — every existing persona entry unchanged except the inserted ninth (SC-006).
- [ ] T018 Final acceptance: `./install.sh --force` then run `quickstart.md` §0–§7 end-to-end; confirm the coverage map (`docs/reviews/2026-06-05-chorus-coverage-map.html`) now shows the prioritization/deferral axis owned at level 3 by the new voice.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: no dependencies.
- **Foundational (T002→T003→T004)**: sequential (author file → register in roster → reinstall). **Blocks all user stories.**
- **User Stories (Phase 3/4/5)**: each depends only on Foundational (T004). US1, US2, US3 are independently testable and may be validated in any order or in parallel (different chorus rounds).
- **Polish/Consistency (Phase 6)**: T013–T016 depend only on the persona existing (T002) and may run in parallel with the user-story validations. T017 depends on T013–T016. T018 depends on everything.

### Within a story

- US1: T005 and T006 are independent validations; T007 (refine) only if either fails.
- US2: T008, T009 independent; T010 conditional.
- US3: T011; T012 conditional.

### Parallel Opportunities

- T014, T015, T016 touch different files → run in parallel. (T013 edits README.md as a single task to avoid same-file conflicts.)
- US1/US2/US3 validation rounds are independent of each other and of the doc-consistency edits.

---

## Parallel Example: Phase 6 consistency edits

```bash
# Different files, no interdependency — run together:
Task: "Update INTEGRATION-LAYER.md lens count eight→nine"     # T014
Task: "Update install.sh count text seven→nine"               # T015
Task: "Verify CHORUS-PROJECT.template.md roster references"    # T016
# README.md edited separately as T013 (single file, 3 spots)
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup (T001) → Phase 2 Foundational (T002–T004): persona authored, registered, installed.
2. Phase 3 US1 (T005–T007): validate participation, deferral evidence, and honest abstention.
3. **STOP and VALIDATE**: the missing deferral axis is live and behaving — shippable MVP.

### Incremental Delivery

- MVP (Setup + Foundational + US1) → demo a real round showing a defer/cut/sequence finding.
- Add US2 (priced trade-off in reconciliation) → validate independently.
- Add US3 (deferability ranking) → validate independently.
- Phase 6 consistency sweep → SC-005/SC-006 green → final acceptance (T018).

### Note on minimal skill changes

The spec's "Mechanism reuse" assumption means the chorus phases are reused unchanged. T010 and T012 are
**conditional** — touch the skill mechanics only if a dry-run proves the existing machinery doesn't
already surface the priced trade-off (US2) or the deferability dimension (US3). Prefer encoding behaviour
in the persona file over editing shared machinery.

---

## Notes

- [P] = different files, no incomplete-task dependency.
- The persona file is a single coherent voice — authored once (T002), refined only if a validation fails
  (T007). Avoid fragmenting its authoring.
- Additive-only is a hard constraint (FR-014/SC-006): no existing persona file or entry is edited beyond
  inserting the ninth.
- Commit after each phase (the speckit `after_*` hooks offer this).
- Total: 18 tasks — Setup 1 · Foundational 3 · US1 3 · US2 3 · US3 2 · Polish/Consistency 6.
