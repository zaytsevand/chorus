# Parity baseline — pre-split observable behavior (RED reference)

Captured BEFORE any file move (T002), from the single `skill/chorus-review/`
(SKILL.md + INTEGRATION-LAYER.md + SDLC-LAYER.md + GATE/DECISION/EXPLORATORY
primitives). This is the RED reference every post-split parity scenario asserts
against. "Same procedure, relocated source" is the bar (spec Assumptions).

Source of record at capture time (commit HEAD of branch
`014-chorus-suite-decomposition`):

- `skill/chorus-review/SKILL.md` — base round, Phases 0–5, + "Two modes" framing
  + SDLC pointer.
- `skill/chorus-review/INTEGRATION-LAYER.md` — integration-layer discipline,
  per-phase pre/post, `I1–I9` catalog, refusals, conductor voice.
- `skill/chorus-review/SDLC-LAYER.md` — lifecycle pipeline, gate mechanics,
  `S1–S7`, ledger.
- `skill/chorus-review/GATE-PRIMITIVE.md` — four-stage mechanic, `S8–S10`.
- `skill/chorus-review/DECISION-PRIMITIVE.md` — decision banding, `D1–D5`.
- `skill/chorus-review/EXPLORATORY-PHASE.md` — per-lens persisted understanding.

## Observable behavior 1 — project-state review round

**Trigger**: "spawn the chorus".

**Phase sequence (the observable procedure)** — from SKILL.md "The procedure":

1. **Phase 0 — Brief**: load addendum (or interview), confirm scope-exclusion
   list, confirm roster/lenses, confirm date stamp.
2. **Phase 0.5 — RSVP**: every roster member replies JOIN/ABSTAIN with the
   two-axis signal; joiner count `J` → quorum branch (`J≥5` / `J∈{3,4}` /
   `J<3`).
3. **Phase 0.7 — Exploratory phase**: each joiner builds persisted
   lens-specific understanding; one batched operator interview; profile-coverage
   fitness function passes.
4. **Phase 1 — Round 1**: joiners author findings uncapped (gate-primitive
   stages 1–2); evidence check (I8: file:line or principle tag).
5. **Phase 2 — Cross-evaluation**: findings register + consolidation matrix;
   Round-2 reactions (gate-primitive stage 3 vote); deterministic stage-4 tally
   (net = P − O) sets severity.
6. **Phase 3 — Conflict reconciliation**: genuine conflicts framed `Cn`; one
   `advisor()` call.
7. **Phase 4 — Ranking**: Cost / Value / Constitutional ROI / Convergence →
   top-5.
8. **Phase 5 — Sign-off**: TL;DR, pre-public-rollout gate, next-chorus baseline;
   `advisor()` final sanity pass; commit.

**Artifact (observable output)**: `docs/reviews/YYYY-MM-DD-chorus-review.md`
(abstain-only round → `docs/reviews/YYYY-MM-DD-chorus-abstained.md`).

**Phase-gate discipline**: a phase does not start until the previous phase's
postcondition holds (I4 — never merge phases). Each phase's pre/post is defined
in INTEGRATION-LAYER.md "Per-phase pre/post-conditions".

## Observable behavior 2 — agent-SDLC lifecycle gate

**Trigger**: "run the agent-SDLC on feature 0NN".

**Gate pipeline (the observable procedure)** — from SDLC-LAYER.md "The
pipeline":

1. `/speckit-plan → plan.md`
2. **Gate A · design review** (loops on 🔴 via clarify→plan; clears →)
3. `/speckit-tasks → tasks.md`
4. **Gate B · plan/tasks review** (loops on 🔴 via clarify→plan→tasks; clears →)
5. `/speckit-implement → code + tests`
6. **Gate C · implementation review** (loops on 🔴; clears → feature reviewed)

No acceptance gate. Each gate runs the four-stage primitive
(`GATE-PRIMITIVE.md`: extract → uncapped author → real vote → deterministic
tally), with per-gate RSVP + seating, exploratory phase, block-on-🔴 self-heal
loop (bounded at 3 cycles), incorporation via spec regeneration (S5).

**Artifact (observable output / ledger)**: `specs/<feature>/agent-sdlc-log.md`
— appended once per gate execution. NOT under `docs/reviews/`.

**Invariant discipline**: S1–S7 (lifecycle) extend I1–I9; S8–S10 (gate
primitive); D1–D5 (decisions). The ledger ends with the S1–S9 self-audit
checklist.

## Invariant catalog (the single source — pre-split residence)

At capture time, ALL of these are defined in `skill/chorus-review/`:

- `I1–I9` — defined in `INTEGRATION-LAYER.md` ("## Invariants").
- `S8–S10` — defined in `GATE-PRIMITIVE.md` (referenced from INTEGRATION-LAYER).
- `D1–D5` — defined in `DECISION-PRIMITIVE.md` (referenced from
  INTEGRATION-LAYER).
- `S1–S7` — defined in `SDLC-LAYER.md` ("## Invariants (lifecycle level)"),
  each tagged "(Extends In.)" as a reference to the I-catalog.

**Post-split residence bar** (what parity must preserve): `I`/`D`/`S8–S10` move
to `chorus-core`; `S1–S7` stay in `chorus-sdlc` as references only; the phase
sequences and artifact/ledger paths above are unchanged.
