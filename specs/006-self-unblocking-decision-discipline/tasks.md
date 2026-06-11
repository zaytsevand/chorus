# Tasks: Self-Unblocking Decision Discipline

**Feature**: 006-self-unblocking-decision-discipline · **Input**: spec.md, plan.md, research.md (R1–R7), data-model.md, contracts/*, quickstart.md

This is Markdown skill/prompt-orchestration authoring — "tasks" are document edits, not
code. `[P]` = parallelizable (different files, no ordering dep). Each task names its file
and the contract/FR it satisfies.

## Phase 1 — Foundational (the canonical primitive)

- **T001** — Create `skill/chorus-review/DECISION-PRIMITIVE.md` skeleton: title, provenance
  (this design 2026-06-08; supersedes 005), and the "referenced by both modes, not
  restated" adoption note (mirror `GATE-PRIMITIVE.md`). [R1/FR-016]
- **T002** — DECISION-PRIMITIVE.md §the-sensor: catalog-lookup → predicate-eval → act-by-
  band procedure, including **unclassified → 🔴** (FR-006). [contracts/decision-primitive.md]
- **T003** — DECISION-PRIMITIVE.md §bands: the 🟢/🟡/🔴 table + behavior; the
  finding-severity-🔴 vs decision-band distinction. [FR-001..004]
- **T004** — DECISION-PRIMITIVE.md §DecisionRecord + §review-surfaces (render by band: audit
  row / queue card / live framed card). [FR-007/008, data-model]
- **T005** — DECISION-PRIMITIVE.md §invariants **D1–D5** (extend I1–I8 / S1–S9). [FR-018]
- **T006** — DECISION-PRIMITIVE.md §catalog: the 11-row declared-band table with predicates
  + reversibility justifications. [contracts/decision-catalog.md, FR-005]
- **T006a** *(Gate B / F1)* — **Catalog-correctness fitness function**, authored as a smoke
  check that GATES T009–T013 (must pass before any layer doc consumes a band): (a) every
  operator-ask string in SDLC-LAYER/INTEGRATION-LAYER/SKILL resolves to a catalog row or is
  provably 🔴 (coverage); (b) every 🔴/🔴-escalating row (5, 8, 11) declares **no
  auto-default**; (c) every 🟡 row names a concrete override path. The check is mechanical
  over the catalog table + a grep of the layer docs. [research R2, decision-catalog.md
  acceptance checks]

## Phase 2 — US5 (P3): the sharper RSVP signal *(foundational for seating)*

- **T007** [P] — DECISION-PRIMITIVE.md §signal: the two evidence-anchored axes (applicability
  + expected stakes), replacing 0–3; sort key + recording. [contracts/rsvp-signal.md, FR-014/015]
- **T008** — `skill/chorus-review/SKILL.md` Phase 0.5: replace the `relevance 0–3` reply
  field with the two axes; reference DECISION-PRIMITIVE.md for banding. [FR-014, US5]

## Phase 3 — US1 + US2 (P1): bands wired into the SDLC seating

- **T009** — `skill/chorus-review/SDLC-LAYER.md` RSVP/seating section: adopt the two-axis
  signal + 🟢-clean-sort / 🟡-tie-default banding; **remove the S3 operator-tie-break**;
  seating tie is 🟡 (recorded default + override), never a 🔴 ask. [FR-010, catalog rows 1–2]
- **T010** — SDLC-LAYER.md: update S3's wording to the declared-band rule (no orchestrator
  lens-merit judgment, now via DECISION-PRIMITIVE.md). [D1, FR-017]

## Phase 4 — US3 (P2): the 🔴 self-heal loop

*(Gate B / F4 — T011 split along its three independent axes of change.)*

- **T011a** — SDLC-LAYER.md block-on-🔴: the **banding rule** — a gating 🔴 is a 🟡 *decision*
  while `cycle < 3`. [FR-011, catalog row 5]
- **T011b** — SDLC-LAYER.md: the **cycle counter + bound** — counter is per-gate-invocation
  (not per-finding-identity, so a finding that mutates each cycle still hits the bound);
  escalate to a 🔴 operator ask at `cycle == 3` **or** when a waiver is the only path.
  Preserve S4/S5/S7 explicitly. [FR-012/013, S7]
- **T011c** — SDLC-LAYER.md: the **re-run-gate-as-verifying-sensor** mechanism (the re-run
  tally is what confirms the 🔴 cleared). [FR-013, R4]
- **T011d** *(Gate B / F3)* — DECISION-PRIMITIVE.md + SDLC-LAYER.md: the **in-flight
  signifier** — each self-heal cycle emits its DecisionRecord **before the next cycle
  starts** (not batched at loop end), surfacing "cycle N of 3 + gate verdict" so an
  in-flight self-heal reads as progress, not runaway. Pass-bar: surfaced before cycle 2.
  [research R4, contract §review-surfaces]
- **T011e** *(Gate B / F8)* — DECISION-PRIMITIVE.md: extend the DecisionRecord `resolution`
  enum with an **in-progress** state so the transient 🟡-while-cycling decision is
  representable (not only the settled rest-states). [FR-007, data-model]

## Phase 5 — US4 (P2): review surfaces + base-round adoption

- **T012** — SDLC-LAYER.md ledger section + `specs/003-agent-sdlc-workflow/contracts/sdlc-ledger.md`:
  add `## Provisional decisions (review & override)` + the DecisionRecord schema. [FR-007/008/009]
- **T013** [P] — `skill/chorus-review/INTEGRATION-LAYER.md`: base-round decision points
  (Phase 0 scope/exclusion, Phase 0.5 quorum) get declared bands; reference
  DECISION-PRIMITIVE.md; note D1–D5 in the invariant set. [R7/FR-016, catalog rows 9–10]

## Phase 6 — Wiring & polish

- **T014** — Add the cite-not-restate reference to DECISION-PRIMITIVE.md from SDLC-LAYER.md,
  SKILL.md, INTEGRATION-LAYER.md (and a one-line mention in `README.md`). [FR-016/SC-007]
- **T015** — Supersession note: mark `specs/005-*/` and issue #3 as superseded-by-006 in the
  006 spec's relationship section (already in spec §10); add a pointer from SDLC-LAYER.md
  seating section that axis-coverage was retired. [FR-019]

## Phase 7 — Validation

- **T016** — Structural smoke checks: exactly one DECISION-PRIMITIVE.md; referenced by both
  modes; no restated band table; unclassified→🔴 present; ledger gains the provisional-
  decisions section; two-axis RSVP replaces 0–3 in both SKILL.md and SDLC-LAYER.md. [SC-007]
- **T016a** *(Gate B / F10)* — Reference-resolution check: every cite of DECISION-PRIMITIVE.md
  from the layer docs + README points at a section heading that exists (anti-rot); and the
  🟢/🟡/🔴 band table tokens appear in **no** file other than DECISION-PRIMITIVE.md
  (anti-restatement). [SC-007]
- **T017** — `./install.sh --force` redeploy; confirm DECISION-PRIMITIVE.md + edited docs
  install to `~/.claude/skills/chorus-review/`. *(Gate B / F6)* State in the task what
  `--force` removes vs writes, and the rollback (re-install from the prior tag / retain the
  prior skill dir).
- **T017a** *(Gate B / F5)* — **Re-run the T016/T016a structural checks against the
  INSTALLED tree** (`~/.claude/skills/chorus-review/`), not the worktree — the chorus runs
  from the installed copy; a glob-miss or stale copy must be caught here.
- **T018** [dogfood] — Run decisions through the sensor on a real gate; produce
  DecisionRecords; verify SC-001/002/004/006/009. Must include: a **seating tie** (🟡 default
  + a **working override** exercised, F7) and a **clearable 🔴** (self-heal cycle 1).
  *(Live acceptance — not fabricated.)*
- **T018a** *(Gate B / F2 — the fail-safe test)* — **Hand-replayable bound case**: construct a
  🔴 that does NOT clear in 3 cycles; assert the cycle counter increments 1→2→3, the
  per-cycle DecisionRecords emit in order (F3 ordering), and **escalation to a 🔴 operator
  ask hard-blocks with no auto-default** (D2). Plus a 🟡-regresses-to-new-🔴 mid-loop case.
  This exercises the loop's only fail-safe. [catalog row 5, D2, quickstart Ex.3]
- **T018b** *(Gate B / F9)* — **Unclassified→🔴 replay**: run a decision with no catalog row;
  assert it lands 🔴 (the "safe direction is the lazy direction" guarantee), not a presence-
  grep. [FR-006]

## Dependencies

- T001 → T002–T006 (skeleton first).
- **T006a (catalog-correctness) GATES T009–T013** — the catalog is adjudicated before any
  layer doc consumes a band (Gate B / F1).
- T007 before T008/T009 (signal defined before seating consumes it; T007 is a predecessor,
  not `[P]` — Gate B / Bob #6).
- T002–T006a before T009–T013 (primitive + catalog gate defined before layers reference it).
- T011a → T011b → T011c → T011d → T011e (the split self-heal axes, in order).
- T014 after all referencing edits exist.
- T016/T016a after T001–T015; **T017 → T017a (smoke the installed tree)**; T018/T018a/T018b
  after T017a.
