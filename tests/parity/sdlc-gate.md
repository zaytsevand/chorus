# Parity — chorus-sdlc lifecycle gate (T018, FR-015 tier 2)

**Tier 2: content-changed** (`SDLC-LAYER.md` promoted to `chorus-sdlc/SKILL.md`:
frontmatter added, line-3 "companion to INTEGRATION-LAYER.md" rewritten to point
at chorus-core, all primitive cross-refs re-pointed to `chorus-core/*`,
`REQUIRED: chorus-core` + sibling guard added) → full RED-GREEN asserting on the
observable ledger + gate sequence.

## (a) Observable behavior preserved vs baseline

Against `tests/parity/baseline.md` "Observable behavior 2 — agent-SDLC lifecycle
gate":

- **Gate pipeline unchanged.** `chorus-sdlc/SKILL.md` "The pipeline" retains the
  exact flow: `/speckit-plan` → **Gate A** → `/speckit-tasks` → **Gate B** →
  `/speckit-implement` → **Gate C** → done; no acceptance gate; each gate runs
  the four-stage primitive.
- **Ledger shape unchanged.** Output is still `specs/<feature>/agent-sdlc-log.md`
  (NOT under `docs/reviews/`), same schema: RSVP table, findings register, vote
  tally, 🔴 resolution/waiver log, unclaimed extract records, loop-cycle count,
  `## Provisional decisions` section, end-of-run S1–S9 self-audit checklist.
  (verified: `grep -c 'specs/<feature>/agent-sdlc-log.md' skill/chorus-sdlc/SKILL.md`
  → 2.)
- **Gate mechanics unchanged.** Per-gate RSVP + seating (cap 5, mandate
  guardrail, Goldratt never out-seated on a buildout), exploratory phase reused
  across gates, block-on-🔴 self-heal loop bounded at 3 cycles, incorporation via
  spec regeneration (S5), `spec-walkthrough` fixed viewpoint at Gate C.
- **S1–S7 reference core, never redefine (FR-005/FR-006).** All seven lifecycle
  invariants are defined in `chorus-sdlc/SKILL.md` and each **extends** core's
  `I1–I9` as a reference ("(Extends I1.)" etc.). S8/S9/S10 are referenced from
  `chorus-core/GATE-PRIMITIVE.md`; D1–D5 from `chorus-core/DECISION-PRIMITIVE.md`.
  No `I`/`D`/`S8–S10` token is defined here (FC1 residence: PASS).
- **What changed is relocation only**: the line-3 framing now reads "the
  lifecycle-mode member of the chorus suite … composes the shared substrate skill
  chorus-core … independent of chorus-review", and every primitive path is
  `chorus-core/*`. The lifecycle an operator runs is the same.

## (b) RED 1 — runs with chorus-review absent (FR-006 / SC-002)

The structural promise: the lifecycle gate completes with the **review skill
absent**. `chorus-sdlc/SKILL.md` references **no** `skill/chorus-review/*` file
path or invariant — FC2 confirms:

```
FC2 — no-fat-sibling-import (FR-006): PASS — no cross-sibling reference
```

(verified: `grep -E 'skill/chorus-review|INTEGRATION-LAYER\.md' skill/chorus-sdlc/SKILL.md`
returns nothing. The guard text even states "This guard does not reference
chorus-review in any way; the lifecycle runs with the review skill absent.") So a
gate's primitive, decision banding, exploratory phase, and I1–I9 catalog all
resolve into `chorus-core` — never into the review sibling. With `chorus-review`
deleted, every reference in `chorus-sdlc` still resolves; the gate sequence and
ledger above are unaffected. This is the GREEN for SC-002.

## (c) RED 2 — chorus-core absent → sibling guard fires (SC-007)

Same sibling-side guard as chorus-review, same exact operator-facing message
content (only the self-naming differs):

> **chorus-core is missing.** `chorus-sdlc` requires the shared substrate skill
> `chorus-core` … broken or partial install … **Recovery:** re-install the chorus
> suite (`./install.sh`), or check that `chorus-core` was published/copied under
> its expected name, then retry.

RED scenario (core deliberately absent): the gate cannot run the four-stage
primitive or reach S8/S9 (which extend the core catalog) — the guard STOPs and
emits the message rather than improvising. Out-of-band, FC1 goes RED (dangling
I-tokens) when the catalog is unreachable; PASS when core is present (the GREEN).
(verified: `grep -c 'chorus-core is missing' skill/chorus-sdlc/SKILL.md` → 1.)

## Result

GREEN: gate pipeline + ledger match baseline; S1–S7 reference (never redefine)
core's I1–I9; the lifecycle is free of chorus-review (FC2 PASS, SC-002). RED: the
sibling guard fires (and FC1 goes RED) when chorus-core is absent.
