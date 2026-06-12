---
description: "Task list for feature 007 — chorus learn interactive staged onboarding"
---

# Tasks: `chorus learn` — Interactive Staged Onboarding

**Input**: Design documents from `/specs/007-chorus-learn-onboarding/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: This feature's "tests" are the structural conformance checks **C1–C7 + C5b**
authored in `quickstart.md` and mandated by **SC-008** (named owner + trigger: the Gate C
dogfood and pre-merge, ledger-recorded). They are in scope by the spec itself — not the
optional-TDD case — so each user story ends with a task that runs the checks it is
responsible for. The checks already exist; implementation makes them pass (zero `FAIL:`
tokens).

**Organization**: Tasks are grouped by user story. The implementation artifact is Markdown
+ Bash (no runtime code). Note that `skill/chorus/LEARN.md` is a **shared file**
written across US1/US2/US3/US4 — tasks that touch it are **not** parallel-safe with each
other; only distinct-file tasks carry `[P]`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3, US4 (maps to spec.md user stories)
- File paths are repo-root-relative (worktree root)

## Path Conventions

Single-repo skill layout (unchanged from features 003–006). Edit surfaces:
`skill/chorus/LEARN.md` (new), `skill/chorus/SKILL.md`, `README.md`,
`install.sh`, `plugin.json`, `templates/CHORUS-PROJECT.template.md`. Normative contracts
live under `specs/007-chorus-learn-onboarding/contracts/`.

---

## Phase 1: Setup

**Purpose**: Establish the dependency baseline and a red test surface before authoring.

- [X] T001 Verify feature 006 / PR #5 status (`skill/chorus/DECISION-PRIMITIVE.md` arrives on that branch — research.md R8) and record the PR #5 **merge horizon** as the open operator item in `specs/007-chorus-learn-onboarding/plan.md` (run-2 GOLD-1); 007 lands after 006.
- [X] T002 Run the conformance suite C1–C7+C5b from `specs/007-chorus-learn-onboarding/quickstart.md` against the current tree to capture the **pre-implementation baseline** (expect `FAIL:` tokens — `LEARN.md` absent); confirm each stanza emits `FAIL:` rather than silent output (SC-008 suite-wide rule).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The mode must be routable and its file spine must exist before any story is meaningful.

**⚠️ CRITICAL**: No user-story work begins until this phase is complete.

- [X] T003 Create `skill/chorus/LEARN.md` with the **five step headings** (`### S1 orient` / `set up` / `run a round` / `agent-SDLC` / `work with results`) matching C2's regex, each followed by a placeholder `Cites:` line and a navigation-question block — the shared spine all stories fill (data-model.md §Step map; FR-002).
- [X] T004 Register the mode in `skill/chorus/SKILL.md`: add the third entry to the mode list, add the `chorus learn` trigger to the **YAML frontmatter description** (the harness routing surface), and reframe the "Two modes" heading region to **three modes**, removing every phrase in C1's stated stale-phrasing family (FR-001/FR-013).

**Checkpoint**: The mode routes and `LEARN.md` has its five-step skeleton — stories can now proceed.

---

## Phase 3: User Story 1 - Zero-to-first-round, guided in steps (Priority: P1) 🎯 MVP

**Goal**: A newcomer runs `chorus learn` and is walked from never-having-used-chorus to a working setup and a first round, one concise step + navigation choice at a time.

**Independent Test**: A user who has read no skill doc invokes `chorus learn`, proceeds through the steps, and ends able to (a) locate/install the skill, (b) author/scaffold the addendum, (c) spawn a first round and read its artifact.

- [X] T005 [US1] Author **S1 orient** in `skill/chorus/LEARN.md`: the what-is-the-chorus + three-modes summary, plus the read-only **dual-channel** detection probes (template reachable via base path, persona agents, addendum present + marker state, in-repo) — read-only, routes accordingly (FR-006).
- [X] T006 [US1] Author the concise newcomer-altitude explanations for **S2/S3/S4/S5** in `skill/chorus/LEARN.md`, each ≤ one AskUserQuestion interaction's worth (FR-003), including the **S3 step/stage disambiguation** line (FR-012).
- [X] T007 [US1] Author the **FR-011 wrap-up** in `skill/chorus/LEARN.md` for every completed/exited path (concrete next command + step reached + resume scope + canon pointers); make the **S1 exit wrap-up the expert cheat-sheet** (addendum checklist + command list + "any step is one jump away").
- [X] T008 [P] [US1] Edit `README.md`: name all three modes and lead the quick-start with `chorus learn`, keeping the manual template copy as the cited fallback citing the **installed template path as deployed** (no environment-specific literals) (FR-013).
- [X] T009 [P] [US1] Edit `install.sh` "Next:" prose to lead with `chorus learn` (manual fallback cites the installed template location) (FR-013).
- [X] T010 [US1] Run **C1 + C2** from `quickstart.md`; confirm registration/staleness and the five steps present & reachable pass with zero `FAIL:` (US1 independent-test surface).

**Checkpoint**: A newcomer can complete the guided arc end-to-end; C1/C2 green.

---

## Phase 4: User Story 2 - Self-paced, choose-your-path navigation (Priority: P2)

**Goal**: At each step the question tool lets the user advance, jump, go deeper, or exit — so expert and newcomer both get a non-redundant path; the tutorial is resumable in-conversation.

**Independent Test**: A user with the skill installed performs **one navigation action** at S1 (Jump → "run a round", ≤2 interactions) and lands in S3 with setup not replayed; re-invoking after exit in the same conversation offers resume-or-restart.

- [X] T011 [US2] Author the per-step **NavigationChoice** in `skill/chorus/LEARN.md` per `contracts/navigation.md`: all four affordances (advance / jump / deeper / exit) at **every** step incl. S1; S1 exit label **signifies the cheat-sheet** before selection; S5 advance = **Finish** (declared-convergent with exit on the wrap-up); S5 jump lists S1–S4 with **no "back"** and discloses free-text stays at S5 (FR-004).
- [X] T012 [US2] Author the **per-step depth state + deeper rule** in `skill/chorus/LEARN.md`: after one deeper pass on a step, that step's slot 2 re-presents as "recap this step"; depth is per-step (a step with no deeper pass never shows recap) (FR-004; data-model.md §NavigationChoice).
- [X] T013 [US2] Author **ResumeState** behavior in `skill/chorus/LEARN.md`: track `last_step` at **every** transition (incl. silent abandonment), offer resume-or-restart on same-conversation re-invocation, disclose conversation-scope in the wrap-up; the resume question is **outside** the SC-003 navigation-action unit (FR-010, SC-003/SC-007).
- [X] T014 [US2] Reconcile `skill/chorus/LEARN.md` against `contracts/navigation.md` (labels, ordering, per-step depth) — the normative pins; nav conformance is **dogfood-only** by recorded decision (verified at the Gate C walkthrough, no mechanical check).

**Checkpoint**: One-navigation-action reach to any step works; resume/restart works in-conversation.

---

## Phase 5: User Story 3 - Setup is optionally *done*, not only explained (Priority: P2)

**Goal**: At S2, after explaining the addendum, the tutorial offers to scaffold `docs/reviews/CHORUS-PROJECT.md` from the template behind a dedicated confirm — the tutorial's sole write — and instructs (never executes) the missing-artefact user.

**Independent Test**: At S2 the user accepts on the dedicated confirm → a `CHORUS-PROJECT.md` is created with SCAFFOLDED marker + sections 2/3/5 flagged; declining or running outside a repo writes nothing (with a stated unavailability notice outside a repo).

- [X] T015 [P] [US3] Make `templates/CHORUS-PROJECT.template.md`'s copy-instructions preamble **copy-safe** (comment-wrapped) so the scaffolded file reads correctly post-copy (FR-007, family G).
- [X] T016 [US3] Author the **S2 scaffold offer** in `skill/chorus/LEARN.md` per `contracts/scaffold.md`: dedicated confirm **before** the navigation question; the pinned `#### On accept` branch performs **exactly one write**; SCAFFOLDED marker as first line after the title; sections 2/3/5 `<!-- TO FILL -->`; the three guards (opt-in / no-overwrite / outside-repo notice); source resolution order (repo → `<skill-base>/templates/` → plugin root) (FR-005/FR-007).
- [X] T017 [US3] Author the **S1 install sub-step** in `skill/chorus/LEARN.md` as **instruct-only** (effects: none — never executes, never writes) with remedy text **branched by detected channel** (file-path: clone + `./install.sh`; plugin: reinstall/update the plugin) (FR-006).
- [X] T018 [US3] Extend `install.sh` to deploy `templates/` → `$SKILL_DST/templates/` (file-path channel delivery; asserted installed-side by C5) (FR-015/R6). **Not `[P]`**: edits `install.sh`, the same file as T009 — sequence them (run-2 Gate B RICH-1).
- [X] T019 [P] [US3] Edit `plugin.json` (FR-015): package `templates/` and **every file in `agents/`** (the directory is the authoritative roster — **no filename enumeration**); refresh the stale advisor-count description.
- [X] T020 [US3] Add the **Phase-0 note** to `skill/chorus/SKILL.md` defining scaffolded-addendum consumer behavior for **both** consumers — the Phase-0 orchestrator and the per-advisor exploratory cache (marker-bearing = structure, never operator-confirmed facts) (FR-014).
- [X] T021 [US3] Run **C5, C5b, C6, C7** from `quickstart.md`; confirm template delivery on both channels, the write-idiom scan fires on its fixtures **and** finds no write outside the `#### On accept` branch, and the four-path scaffold matrix (accept/decline/existing-target/outside-repo) records its expected outcomes — zero `FAIL:`.

**Checkpoint**: Scaffold accept/decline/existing/outside-repo all behave; both channels deliver the template.

---

## Phase 6: User Story 4 - Teaches both review modes, cites the canon (Priority: P3)

**Goal**: The tutorial covers both review modes at newcomer altitude and **cites** the canonical docs rather than restating them, so it cannot drift.

**Independent Test**: S3/S4 summarize the flows and link `GATE-PRIMITIVE.md` / `SDLC-LAYER.md` / `DECISION-PRIMITIVE.md`; the structured `Cites:` lists resolve; an inspection finds no restated canonical definition.

- [X] T022 [US4] Author the structured per-step **`Cites:` lists** in `skill/chorus/LEARN.md`: **≥1 per step**, channel-resolvable (annotate `install.sh` as file-path/checkout-channel-only), onboarding-altitude summaries (not definitions), plus the **runtime-failure clause** (doc missing at runtime → state plainly, continue at summary altitude, point to the source resolved via the **running skill's base path**; never reconstruct from memory) (FR-008, SC-005; data-model.md §CanonicalPointer).
- [X] T023 [US4] Ensure **S3 (round)** and **S4 (agent-SDLC)** in `skill/chorus/LEARN.md` summarize the four-stage flow / the gate pipeline + block-on-🔴 at newcomer altitude and link the canon — with **no** restated tally rule, band table, decision catalog, or quorum table (FR-009/FR-008).
- [X] T024 [US4] Run **C3 + C4** from `quickstart.md`; confirm per-step cite cardinality + resolution (incl. channel-resolvable entries) and no-restatement (pinned delimiters) pass with zero `FAIL:`.

**Checkpoint**: Both modes taught; every mechanic resolves through a cite; nothing restated.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Whole-suite verification, dogfood, and the post-merge validated-learning obligations.

- [X] T025 Run the **full** conformance suite C1–C7+C5b from the repo root; confirm **zero `FAIL:` tokens** suite-wide and no dead/vestigial assertions; record the run in `specs/007-chorus-learn-onboarding/agent-sdlc-log.md` (SC-008 ownership: Gate C dogfood + pre-merge).
- [X] T026 Perform the **dogfood walkthrough** in this repo — **decline** the scaffold by default (spec Assumptions); confirm all five steps present & reachable, the four navigation affordances behave, the S1 exit wrap-up reads as the cheat-sheet, **and the SKILL.md Phase-0 note (T020/FR-014) treats a marker-bearing addendum as structure-not-facts for both consumers** (run-2 Gate B BECK-2) (US1/US2; SC-001/002/003/006).
- [X] T027 [P] Record the **SC-010** obligation in `specs/007-chorus-learn-onboarding/agent-sdlc-log.md`: within 30 days of merge, capture one **real external newcomer** session (channel used + outcome); until then the ledger states the loop is open.
- [X] T028 [P] Apply the **GOLD-6** fix at SC-010's day-30 expiry in `specs/007-chorus-learn-onboarding/spec.md`: name the reader (operator) and the decision (continue / extend / retire) so the verdict-closer cannot expire unread (non-gating amber carried from Gate A).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies — start immediately.
- **Foundational (Phase 2)**: depends on Setup; **blocks all user stories** (LEARN.md spine + mode registration).
- **User Stories (Phase 3–6)**: all depend on Foundational. US1 is the MVP. US2/US3/US4 are independently testable but **share `LEARN.md`** with US1 and each other — sequence their LEARN.md edits (do not run two LEARN.md tasks in parallel).
- **Polish (Phase 7)**: depends on the user stories whose checks it aggregates (T025 after T010/T021/T024).

### User Story Dependencies

- **US1 (P1)**: after Foundational. The MVP; delivers the guided arc.
- **US2 (P2)**: after Foundational. Builds the navigation/resume layer onto the LEARN.md spine.
- **US3 (P2)**: after Foundational. Adds the scaffold write + install sub-step + delivery surfaces; the only story touching `templates/`, `plugin.json`, and the SKILL.md Phase-0 note.
- **US4 (P3)**: after Foundational. Hardens cite-not-restate; logically follows US1's explanations existing.

### Within Each User Story

- LEARN.md content before its check task (the check verifies the content).
- Distinct-file edits ([P]) may run alongside LEARN.md authoring.

### Parallel Opportunities

- T008 (README) ∥ T009 (install.sh Next:) — but **not** with each other vs T018 (install.sh deploy edits the same file as T009).
- T015 (template) ∥ T018 (install.sh) ∥ T019 (plugin.json) — three distinct files, all in US3.
- T027 ∥ T028 — distinct concerns (ledger record vs spec edit).
- All same-file `LEARN.md` tasks are strictly sequential.

---

## Parallel Example: User Story 3 distinct-file edits

```bash
# These edit two different files and can proceed together:
Task: "T015 copy-safe preamble in templates/CHORUS-PROJECT.template.md"
Task: "T019 package templates/ + agents/ in plugin.json"
# T018 edits install.sh (shared with T009) — NOT parallel; sequence it (RICH-1).
# LEARN.md tasks (T016, T017) run sequentially, not in this batch.
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 Setup → Phase 2 Foundational (LEARN.md spine + SKILL.md registration).
2. Phase 3 US1 → the guided five-step arc.
3. **STOP and VALIDATE**: run C1/C2 and a manual walkthrough; a newcomer can reach a first round.

### Incremental Delivery

1. Foundational ready → US1 (MVP, C1/C2 green).
2. US2 → navigation + resume (dogfood walkthrough).
3. US3 → scaffold + dual-channel delivery (C5/C5b/C6/C7 green).
4. US4 → cite-not-restate (C3/C4 green).
5. Phase 7 → full suite green, dogfood, post-merge SC-010/GOLD-6 obligations recorded.

---

## Notes

- `[P]` = different files, no dependencies. `LEARN.md` is shared — its tasks never carry `[P]`.
- The conformance checks are the spec's mandated tests (SC-008); they run at the Gate C dogfood and pre-merge, ledger-recorded.
- No runtime code, no test harness beyond the bash checks; `install.sh`/`plugin.json` are the delivery surfaces (FR-015).
- Gate B (plan/tasks review) reviews **this file** next; T001's PR #5 horizon and the per-step C3/C5b preservation are flagged baseline items.
