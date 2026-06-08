# Implementation Plan: RSVP Axis-Coverage Tie-Break

**Branch**: `005-rsvp-axis-coverage-tiebreak` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-rsvp-axis-coverage-tiebreak/spec.md`

## Summary

Insert a mechanical **axis-coverage tie-break** into the capped RSVP seating
procedure, between the relevance sort and the operator hand-off: when a relevance-
score tie spans the final seat(s), seat the panel by maximum distinct-axis coverage
(coverage maximization → axis-rarity sub-rule), and consult the operator only for the
residual tie that coverage and rarity cannot separate. The axis taxonomy is the
existing README 12-axis grid; the per-lens mapping is **self-declared by each joiner
at RSVP time** (FR-016), keeping the orchestrator merit-neutral (S3/I2). The cascade
is authored **once** in `SDLC-LAYER.md` and referenced by `SKILL.md` Phase 0.5
(FR-010/SC-006). This is Markdown skill/prompt authoring — no runtime code.

**⚠ One spec-affecting decision (research R1)**: working the issue-#3 motivating
example (004 Gate A) shows a naive max-coverage objective does **not** reproduce the
operator's historical slate (it prefers multi-axis generalists → a 7-axis panel vs
the operator's 5-axis specialist slate). FR-014/SC-001 are therefore reframed: the
worked example asserts *zero operator prompts on a deterministic coverage panel*, and
**documents** the divergence from the operator's gate-relevance-driven pick rather
than claiming to reproduce it. **Pending operator confirmation** (natural Gate A
adjudication) — see research.md R1.

## Technical Context

**Language/Version**: N/A — Markdown skill, persona prompts, and orchestration
procedure (no executable code).

**Primary Dependencies**: The chorus-review skill's existing artefacts —
`skill/chorus-review/SDLC-LAYER.md` (S3 + cap-of-5 seating), `skill/chorus-review/SKILL.md`
(Phase 0.5 RSVP), `skill/chorus-review/INTEGRATION-LAYER.md` (I2 + refusals),
`README.md` (the 12-axis Lens-coverage grid, the taxonomy seed), and the per-feature
ledger `specs/<feature>/agent-sdlc-log.md`.

**Storage**: Plain Markdown. RSVP replies are ephemeral agent outputs; the durable
record is the ledger.

**Testing**: Structural smoke checks (one canonical cascade definition referenced by
both modes; no second copy; base-round flow intact; ledger schema present) plus a
hand-replayable worked example. No automated test harness — consistent with 003/004.

**Target Platform**: Claude Code skill, deployed via `install.sh --force`.

**Project Type**: Single project — documentation/skill authoring.

**Performance Goals**: Reduce operator interruptions on uniform-score capped gates to
only the genuinely-undecidable residual tie (SC-002/SC-003). Seating remains
deterministic (SC-004).

**Constraints**: Every seating step must stay merit-neutral — it may sort only
persona-supplied integers (relevance, declared-axis coverage counts, champion counts)
or defer to the operator (S3/I2). No orchestrator judgment of lens merit.

**Scale/Scope**: 9-lens core roster + opt-in language lenses; panels capped at 5.
Edits confined to the four named skill files + the ledger schema.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The repository's `.specify/memory/constitution.md` is an unfilled template — there are
no ratified numbered principles to gate against (same posture as features 002–004).
The **binding invariants** for this feature are the skill's own, and this plan is
checked against them:

| Invariant | Gate | Status |
|-----------|------|--------|
| **S3** — no panel > 5; overflow seated by persona-declared signal, never orchestrator lens-merit judgment | The new cascade sorts only persona-supplied integers (relevance, declared-axis coverage, champion counts) and defers to the operator otherwise | ✅ PASS |
| **I2** — the integration layer never decides RSVP for a persona | Axes are self-declared in the JOIN reply; the orchestrator counts, never assigns (R4) | ✅ PASS |
| **FR-015** — no behaviour change outside capped seating | Base round stays uncapped by default; cascade bites only when a cap forces eviction (R3) | ✅ PASS |
| **One-definition discipline** (cf. GATE-PRIMITIVE.md) | Cascade authored once in SDLC-LAYER.md, referenced by SKILL.md (R2) | ✅ PASS |

**Spec-fidelity flag (not a constitution violation)**: research R1 reframes
FR-014/SC-001. This is surfaced for operator confirmation before Phase 1 design is
locked; it does not breach any invariant.

## Project Structure

### Documentation (this feature)

```text
specs/005-rsvp-axis-coverage-tiebreak/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions R1–R6 (R1 is spec-affecting)
├── data-model.md        # Phase 1 — entities: joiner, taxonomy, mapping, rarity, seating decision
├── quickstart.md        # Phase 1 — the 004 Gate A worked example, replayed
├── contracts/           # Phase 1 — seating-cascade, rsvp-reply, seating-ledger contracts
│   ├── seating-cascade.md
│   ├── rsvp-reply.md
│   └── seating-ledger.md
└── tasks.md             # Phase 2 — /speckit-tasks (NOT created here)
```

### Source (skill artefacts edited by this feature)

```text
skill/chorus-review/
├── SDLC-LAYER.md        # CANONICAL: "Capped-seating cascade" block + S3 update (R2)
├── SKILL.md             # Phase 0.5 references the cascade (cap-gated); RSVP reply gains primary_axes (R3, R4)
└── INTEGRATION-LAYER.md # I2 note: axis self-declaration is the persona's, not inferred

README.md                # Lens-coverage grid cited as the taxonomy seed (no behavioural change)
specs/<feature>/agent-sdlc-log.md   # Ledger seating section gains axes + rarity + per-seat provenance (R6)
```

**Structure Decision**: Single-project documentation change. The canonical cascade
lives in `SDLC-LAYER.md` (it already owns the cap and S3); every other touchpoint
references it. No new shared file is introduced (the cascade is small and belongs
beside S3) — see research R2.

## Complexity Tracking

No constitution violations to justify. The one notable decision — adding an
axis-rarity sub-rule (FR-006a) rather than going straight to the operator on a
different-axis tie — is justified in research R5: it is mechanical, merit-neutral, and
directly serves the feature's goal (fewer operator interruptions). It does not add a
new artefact or a new judgment surface.
