# Tasks: Chorus `challenge` — a premise pass in Gate A

**Feature**: `013-premise-challenge` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)
**Input**: plan.md, research.md, data-model.md, contracts/canon-edits.md, quickstart.md

This is a **markdown methodology** feature: "implementation" = canon prose edits under `skill/chorus/` + conformance verification. There is no runtime code. Tests = the `quickstart.md` conformance stanzas (the project's first-class verification surface, Principle V). All paths are relative to the repo root (`.claude/worktrees/013-premise-challenge/`).

> ⚠ Edits E1/E2/E3 all land in **`skill/chorus/SDLC-LAYER.md`** — they are **sequential, not `[P]`** (same file). E4/E5 touch different files and can parallelize against the ledger/README work.

---

## Phase 1: Setup

- [x] T001 Re-ground edit targets (Principle V): re-confirm current line numbers in `skill/chorus/SDLC-LAYER.md` for the insertion point (after `### Exploratory phase (per gate)`, before `### Block on 🔴`), the `## The ledger` schema block, and the expected-attendance paragraph; and in `skill/chorus/SKILL.md` for `## Three modes` (line ~42) and the `description:` frontmatter (line ~3). **Also verify the `Loop bound` / S7 anchor text exists in `SDLC-LAYER.md` and is stable to cite** (T010/R5 cites it — Gate B Richards B5); if absent, the N=3 re-run cite is unverified. Record confirmed lines in `contracts/canon-edits.md` if drifted.
- [x] T002 Capture **section-scoped** baselines for C-CITE (Gate B Richards B3 / Delivery F2): whole-file hash `skill/chorus/GATE-PRIMITIVE.md` and `skill/chorus/DECISION-PRIMITIVE.md`; for the Gate B/C assertion in `SDLC-LAYER.md` (a file 013 edits), capture an **anchored section extract** (header-boundary slice of `### Block on 🔴` through end of Gate-C/`### Memory update phase`) so SC-008 is machine-verifiable, not eyeballed.

## Phase 2: Foundational (the canonical home — blocks US1/US2/US3)

**Goal**: create the single canonical subsection all three stories cite. Nothing else can be authored or cited until this exists.

- [x] T003 In `skill/chorus/SDLC-LAYER.md`, insert the new subsection `### Gate A — premise pass (runs first)` at the T001-confirmed point, with the **brief skeleton only** (the five labelled parts: brief, scope-tag, red-team checklist, honest-null, outcome — headers/placeholders), per `contracts/canon-edits.md` E1. Content of each part lands in US-specific tasks below.

**Checkpoint**: the canonical home exists; US1/US2/US3 can now fill and cite it.

## Phase 3: User Story 1 — Gate A runs a premise pass first (P1) 🎯 MVP

**Goal**: the premise pass runs before within-frame review; premise findings tagged and surfaced first.
**Independent test**: run Gate A on a shaky-premise fixture; confirm the premise pass executes first and premise-tagged findings precede within-frame findings in the ledger.

- [x] T004 [US1] Author **part 1 (the brief)** of the premise-pass subsection in `skill/chorus/SDLC-LAYER.md`: panel attacks premise (problem/necessity-now/framing/assumptions) + steelmans null/alternative; each premise finding carries ≥1 of steelman/reframe/root-cause-doubt/assumption+cheapest-test (FR-001, FR-003; cite `chorus-and-repo-stats-v2.md` §4d).
- [x] T005 [US1] Author **part 5 (outcome)** in the same subsection: premise outcome = `GATE-PRIMITIVE.md` Stage 4 tally over premise-tagged findings (cite, do not restate); a premise 🔴 = premise-level block, operator-owned & self-unblocking (cite `DECISION-PRIMITIVE.md`); **explicitly: no new verdict, no severity→band mapping, no new doc** (FR-007).
- [x] T006 [US1] Add the **ledger-ordering note** to `skill/chorus/SDLC-LAYER.md` `## The ledger` (E2): Gate A records premise pass → within-frame → parked-from-premise, reconstructable end-to-end; reuses existing schema (FR-010).
- [x] T007 [US1] Add the **expected-attendance clause** (E3): Gate A's expected panel runs the premise pass first (one clause; may be folded into T004 if cleaner).

**Checkpoint**: US1 independently testable via C-001.

## Phase 4: User Story 3 — The divergence guarantee (P1)

**Goal**: the pass cannot collapse into within-frame help. Three mechanisms (vote-classification, red-team checklist, substantive honest-null). Authored into the same subsection — **sequential after US1 parts**.
**Independent test**: on a fixture, a within-frame finding is parked (vote-classified) and excluded; the honest-null entries each carry lens+steelman; the checklist items are recorded.

- [x] T008 [US3] Author **part 2 (scope-in-vote)** in `skill/chorus/SDLC-LAYER.md`: finding `scope ∈ {premise, within-frame}` is **author-declared + vote-confirmed** (cite `GATE-PRIMITIVE.md` S8/S9); a within-frame finding is **parked**, not counted as premise divergence; **no regex/stanza** classifies scope (FR-004).
- [x] T009 [US3] Author **part 3 (red-team checklist)**: insert RT-1..RT-6 **verbatim** from `data-model.md`; require each item's outcome recorded every pass; frame as the §4d author-independent out-of-distribution floor (FR-005).
- [x] T010 [US3] Author **part 4 (honest-null + bound)**: substantive entries (each lens + steelman/reframe/doubt) + RT outcomes; a no-attack pass is a **failed pass, re-run, bounded N=3 then escalate** (cite `SDLC-LAYER.md` Loop bound/S7 — closes residual R5); a bare/boilerplate `sound` fails (FR-006).

**Checkpoint**: US3 independently testable via C-002/C-003/C-004.

## Phase 5: User Story 2 — `chorus challenge` standalone (P2)

**Goal**: the premise-pass brief invocable directly, citing the canonical home (no restatement).
**Independent test**: `chorus challenge <paragraph>` returns premise-tagged findings + honest-null, writes a durable artifact, no feature dir required.

- [x] T011 [P] [US2] Register `chorus challenge` in `skill/chorus/SKILL.md`: add the fourth-mode bullet to `## Three modes` and a `## When to use` line; **cite** the SDLC-LAYER premise-pass subsection (Principle I — do not restate the brief) (E4, FR-002).
- [x] T012 [P] [US2] Append the `chorus challenge` clause to the `description:` frontmatter in `skill/chorus/SKILL.md` (E4).
- [x] T013 [P] [US2] Add `chorus challenge` to the mode list in `README.md` and verify `install.sh` deploys the edited `SDLC-LAYER.md`/`SKILL.md` (no new file to copy) (E5).

**Checkpoint**: US2 testable via C-MODE.

## Phase 6: Polish & conformance (cross-cutting)

- [x] T014 Soften `spec.md:97` wording per residual R1: "directly addressing the §4d circularity" → "lowers the §4d blind-spot floor" (accept the same-model limit as stated, not overclaimed).
- [x] T015 [P] Run conformance stanzas C-001, C-002, C-003, C-004, C-005, C-006, C-008, C-CITE, C-MODE from `quickstart.md` against the edited canon; record pass/fail. C-CITE compares against the T002 baselines — whole-file for the two primitives, **anchored-section extract** for the SDLC-LAYER Gate B/C slice (SC-008 byte-unchanged).
- [x] T016 [P] Execute C-007: run the shaky-premise fixture through the premise-pass brief; confirm it surfaces a premise 🔴/reframe + steelman (does not return `sound`).
- [x] T017 [P] **(R3 — promoted to mandatory; Gate B Beck + Goldratt convergence: the contrapositive is on the constraint, an adversarial brief's riskiest failure is the false red)** Add conformance check **C-008** + a sound-premise contrapositive fixture to `quickstart.md`: a sound premise ⇒ a **substantive honest-null**, NOT a manufactured red. This proves the pass *discriminates* rather than reflexively attacks (guards green-by-coincidence + the R2 asymptotic-sincerity admission).
- [x] T018 Update `agent-sdlc-log.md` readiness note: plan + tasks authored, ready for Gate B.

---

## Dependencies & execution order

- **Setup (T001–T002)** → **Foundational (T003)** → everything.
- **US1 (T004–T007)** before **US3 (T008–T010)**: both author the same E1 subsection — **sequential, no `[P]`**.
- **US2 (T011–T013)** edits `SKILL.md`/`README.md` — `[P]` against each other and against the SDLC-LAYER work, but must cite a home that exists (after T003).
- **Polish (T014–T018)** last; T015/T016/T017 parallelizable (distinct checks).

## Implementation strategy

- **MVP = US1** (T001–T007): Gate A runs a premise pass first. Independently shippable and testable (C-001).
- **+US3** (T008–T010) hardens it against collapse (the divergence guarantee — the load-bearing invariant F17). Strongly recommended with US1 since the spec's core risk is collapse.
- **+US2** (T011–T013) adds the standalone ergonomics.
- The **dogfood** (running this very SDLC) already exercises the charter on 013 itself — `agent-sdlc-log.md` is live evidence the pass produces divergence.

## Notes

- **No `GATE-PRIMITIVE.md` / `DECISION-PRIMITIVE.md` edits** — byte-unchanged, cited only (SC-008/C-CITE).
- **No new canon file** (SC-005). **No persona/agent edits.**
- Total: **18 tasks** — US1: 4 · US3: 3 · US2: 3 · Setup/Foundational: 3 · Polish: 5.
