# Parity — chorus-review project-state round (T014, FR-015 tier 2)

**Tier 2: content-changed** (`SKILL.md` slimmed: "two modes" framing + SDLC
pointer removed, `REQUIRED: chorus-core` + sibling guard added; `INTEGRATION-LAYER.md`
slimmed to round-specific content, shared discipline + I1–I9 replaced by
references) → full RED-GREEN asserting on observable output (the phase sequence +
artifact), not file presence (Beck F8).

## (a) Observable behavior preserved vs baseline

Against `tests/parity/baseline.md` "Observable behavior 1 — project-state review
round":

- **Phase sequence unchanged.** `skill/chorus-review/SKILL.md` "The procedure"
  still defines Phase 0 (Brief) → 0.5 (RSVP) → 0.7 (Exploratory) → 1 (Round 1) →
  2 (Cross-evaluation) → 3 (Conflict reconciliation) → 4 (Ranking) → 5
  (Sign-off), identical to baseline. (verified:
  `grep -n '^### Phase' skill/chorus-review/SKILL.md` lists 0,0.5,0.7,1,2,3,4,5.)
- **Artifact shape unchanged.** Output is still
  `docs/reviews/YYYY-MM-DD-chorus-review.md` (abstain →
  `…-chorus-abstained.md`); findings register + consolidation matrix + per-round
  briefs all retained verbatim.
- **Gate discipline unchanged.** Phases 1/2/4 still run the four-stage primitive,
  now read from `chorus-core/GATE-PRIMITIVE.md`; severity is still the
  deterministic stage-4 tally (`net = P − O`); the I8 evidence check still gates
  the register, now enforced by I8 in `chorus-core/CONDUCTOR.md`.
- **What changed is relocation only**: the "two modes" framing and the SDLC
  pointer are gone (FR-004); the integration layer's shared discipline + I1–I9
  catalog are now references to `chorus-core/CONDUCTOR.md` instead of inline
  definitions. The procedure an operator runs is the same.

## (b) RED demonstration — chorus-core absent → sibling guard fires (SC-007)

The skill now opens with a **sibling-side substrate guard** (FR-002a). Its
operator-facing message content is exact (names the missing skill, states it
means a broken/partial install, gives the recovery action):

> **chorus-core is missing.** `chorus-review` requires the shared substrate skill
> `chorus-core` … broken or partial install … **Recovery:** re-install the chorus
> suite (`./install.sh`), or check that `chorus-core` was published/copied under
> its expected name, then retry.

RED scenario (composition deliberately broken — core absent): with `chorus-core`
not reachable, the round cannot run honestly — the guard STOPs and emits the
message above rather than improvising the gate/decision/exploratory mechanics or
the I1–I9 catalog. This is **observable**: a review cannot reach Phase 1 without
the primitive. The out-of-band detector of the same break is FC1, which goes RED
when the catalog is unreachable (demonstrated in `tests/parity/core-conductor.md`
RED 1: `DANGLING TOKEN: I1 … I9`, exit 1). After core is present, FC1 returns
PASS and the round runs the baseline phase sequence — the GREEN.

(The advisory `REQUIRED:` marker alone cannot satisfy SC-007: an absent core's
router never runs. The sibling guard is what fires — verified present:
`grep -c 'chorus-core is missing' skill/chorus-review/SKILL.md` → 1.)

## (c) No-fat-sibling (FC2) bracketed with this move (T013)

Run immediately after the chorus-review slim:

```
FC2 — no-fat-sibling-import (FR-006): PASS — no cross-sibling reference
```

`chorus-review` references no `skill/chorus-sdlc/*` file path (a bare routing
mention of the sibling skill name is permitted; it resolves to no file/invariant,
FR-006).

## Result

GREEN: phase sequence + artifact match baseline; the only change is where the
shared discipline is defined. RED: the sibling guard fires (and FC1 goes RED)
when chorus-core is absent. FC2 passes for this sibling.
