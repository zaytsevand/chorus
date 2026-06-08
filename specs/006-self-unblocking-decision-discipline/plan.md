# Implementation Plan: Self-Unblocking Decision Discipline

**Branch**: `006-self-unblocking-decision-discipline` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-self-unblocking-decision-discipline/spec.md` (derived from the approved design `docs/superpowers/specs/2026-06-08-self-unblocking-decision-discipline-design.md`)

## Summary

Introduce a **decision-banding discipline** to the chorus-review agent-SDLC: every
operator-facing decision routes through a sensor that bands it 🟢 (mechanically decidable
→ auto-resolve), 🟡 (reversible judgment → proceed with a recorded default + async
review), or 🔴 (irreducible judgment → hard-block + instant minimal ask). The workflow
runs forward by default, stopping the human only for 🔴. Banding is by **declared
predicate**, never orchestrator inference (the invariant that keeps it from re-importing
parked 005's failure). The blunt 0–3 RSVP score is replaced by **two evidence-anchored
axes**; gating 🔴 findings **self-heal** (auto-incorporate + re-run gate) up to the loop
bound; every decision emits a **DecisionRecord** rendered to a band-scaled review surface.
Authored once in a canonical `DECISION-PRIMITIVE.md` referenced by both modes. Markdown
skill/prompt-orchestration authoring — no runtime code.

## Technical Context

**Language/Version**: N/A — Markdown skill, persona prompts, orchestration procedure.

**Primary Dependencies**: the chorus-review skill artefacts —
`skill/chorus-review/SDLC-LAYER.md` (RSVP/seating + block-on-🔴 + incorporation loop),
`SKILL.md` (Phase 0.5 RSVP), `INTEGRATION-LAYER.md` (base-round decision points + I1–I8),
`GATE-PRIMITIVE.md` (the tally sensor this generalizes from), and the per-feature ledger
`specs/<feature>/agent-sdlc-log.md`.

**Storage**: plain Markdown. DecisionRecords live in the ledger; RSVP replies are
ephemeral agent outputs.

**Testing**: structural smoke checks (one canonical `DECISION-PRIMITIVE.md` referenced by
both modes; no second copy; unclassified-→🔴 default present; ledger gains the
provisional-decisions section) plus hand-replayable worked examples. No automated harness
— consistent with 003/004/005.

**Target Platform**: Claude Code skill, deployed via `install.sh --force`.

**Project Type**: single project — documentation/skill authoring.

**Performance Goals**: collapse operator touchpoints to 🔴-only; gating 🔴s self-heal
without per-cycle operator action; seating ties cause 0 interruptions.

**Constraints**: every band assignment must trace to a **declared predicate or a
persona-declared flag** — the orchestrator counts and routes, never judges (I2/S3/S9 +
new D1/D4). 🔴 never auto-proceeds (S4 + D2). The base round's user-facing flow is
preserved (only decision points are re-pointed to bands).

**Scale/Scope**: 9-lens roster + opt-in language lenses; the agent-SDLC's ~6 operator
touchpoints + the base round's ~2. Edits confined to the four named skill files + a new
canonical doc + the ledger schema.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is the unfilled template (as for 002–005); the binding
invariants are the skill's own. This plan is checked against them:

| Invariant | Gate | Status |
|-----------|------|--------|
| **I2 / S3** — orchestrator never decides RSVP nor judges lens merit | Bands come from declared predicates / persona flags; the two-axis signal is self-declared and evidence-anchored (D1/D4/D5) | ✅ PASS |
| **S4** — never pass a 🔴 silently | 🔴 *decisions* hard-block (D2); a severity-🔴 finding is *resolved* by auto-incorporation + verified by gate re-run, never passed; waiver still escalates | ✅ PASS |
| **S5** — incorporation revises spec, regenerates downstream (no hand-patch) | The self-heal loop reuses the existing speckit incorporation cascade | ✅ PASS |
| **S7** — loop bounded at 3 cycles | The self-heal loop's RED-escalation trigger is exactly the S7 bound | ✅ PASS |
| **S9** — no synthesized judgment | Banding adds no judgment surface; unclassified → 🔴 (FR-006), never auto-resolved | ✅ PASS |
| **One-definition discipline** (cf. GATE-PRIMITIVE.md) | The model is authored once in `DECISION-PRIMITIVE.md`, referenced by both modes (FR-016) | ✅ PASS |

No violations. The design's central risk is **catalog correctness** (a mis-declared
band), not an invariant breach — surfaced in research R2/R7 for the Gate to scrutinize
per-entry.

## Project Structure

### Documentation (this feature)

```text
specs/006-self-unblocking-decision-discipline/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions R1–R7
├── data-model.md        # Phase 1 — entities: band, sensor signal, DecisionRecord, catalog entry, review queue
├── quickstart.md        # Phase 1 — worked examples: a seating tie (🟡), a self-healing 🔴, a waiver (🔴)
├── contracts/           # Phase 1
│   ├── decision-primitive.md   # the three-band model + DecisionRecord + review surfaces
│   ├── rsvp-signal.md          # the two evidence-anchored axes
│   └── decision-catalog.md     # declared band + predicate per decision point
└── tasks.md             # Phase 2 — /speckit-tasks (NOT created here)
```

### Source (skill artefacts edited by this feature)

```text
skill/chorus-review/
├── DECISION-PRIMITIVE.md   # NEW — canonical: three bands, two-axis signal, DecisionRecord, catalog, D1–D5
├── SDLC-LAYER.md           # RSVP/seating → two-axis signal + 🟢/🟡 banding (replaces S3 operator-tie-break);
│                           #   block-on-🔴 → self-heal loop; references DECISION-PRIMITIVE.md
├── SKILL.md                # Phase 0.5 RSVP reply schema → two axes; references the primitive
└── INTEGRATION-LAYER.md    # base-round decision points (scope confirm, quorum) get declared bands; references primitive

specs/<feature>/agent-sdlc-log.md   # ledger gains the `## Provisional decisions (review & override)` section + DecisionRecord schema
```

**Structure Decision**: single-project documentation change. The model lives in a new
canonical `DECISION-PRIMITIVE.md` (it is cross-cutting across both modes, like
`GATE-PRIMITIVE.md`); every touchpoint references it. The seating-specific and
catalog-specific contracts are co-located under `contracts/`. See research R1.

## Complexity Tracking

No constitution violations to justify. The most consequential decision — the 🔴
**self-heal loop** (auto-incorporate without per-cycle operator approval) — is justified
in research R4: it stays inside S4/S5/S7, surfaces every cycle on the review queue, and
escalates at the bound or on a waiver. It adds no new artefact beyond the DecisionRecord
and no new judgment surface.
