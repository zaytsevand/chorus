# Implementation Plan: Chorus RSVP — Exceptional Entry & Board-Scaled Promotion

**Branch**: `012-rsvp-exceptional-entry` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/012-rsvp-exceptional-entry/spec.md` (v3, Gate A cleared at cycle 2; ledger `agent-sdlc-log.md`)

## Summary

Three canon refinements to the chorus seating + tally, all expressed as edits to existing canon docs plus conformance stanzas (no runtime code):

1. **US1 — capped board (5 ordinary) + uncapped exceptional entry**, gated by an *evidence bar* (cite a concrete uncovered delta; un-anchored claims refused; distinct deltas self-limit packing; no adjudicator). Entry buys a voice, not weight.
2. **US2 — board-scaled promotion threshold** `T = max(1, floor(N/2))` over non-author voters `N`, replacing the fixed `net ≥ +2`. Reduces to the canon at `N=4`.
3. **US3 — conductor side-notes** (flag-only, non-binding safety net). The gating ("do more") version is deferred to a separate spec.

Plus **FR-016 canon hygiene**: reconcile every restatement of a changed rule (cap-5, `net≥+2`) to a citation of its single home (Principle I).

## Technical Context

**Language/Version**: Markdown (Claude Code skill/prompt authoring). No runtime language.

**Primary Dependencies**: the chorus canon under `skill/chorus/` (`GATE-PRIMITIVE.md`, `SDLC-LAYER.md`, `SKILL.md`, `INTEGRATION-LAYER.md`, `DECISION-PRIMITIVE.md`).

**Storage**: N/A (prose canon + the per-feature ledger).

**Testing**: `quickstart.md` **conformance stanzas** — the first-class verification surface (constitution Principle V / Authoring Constraints). These are human-runnable check procedures over the canon text, not executable code.

**Target Platform**: the `chorus` skill as installed by `install.sh`.

**Project Type**: single project — a Markdown methodology repo. No src/tests trees.

**Performance/Scale**: N/A — the "runtime" is the operator dispatching persona agents per gate; the feature is designed to keep boards near 5 (exceptional entry rare + evidence-bar gated), bounding per-gate cost.

**Unknowns**: none blocking. Two residuals carried from Gate A (resolved to deferrable defaults in research.md): R1 = how "distinct delta" is judged (H1 🟡); R2 = the exact set of canon restatement sites FR-016 must reconcile.

## Constitution Check

*GATE: must pass before Phase 0. Re-checked after Phase 1.*

- **I — Cite, never restate**: ✅ Each new rule gets a single canonical home (seating→SDLC-LAYER; threshold→GATE-PRIMITIVE Stage 4; side-note→INTEGRATION-LAYER; RSVP answer→SKILL.md). FR-016 + SC-009 actively *remove* drift by reconciling existing restatements. This feature improves Principle-I compliance rather than risking it.
- **V — Evidence**: ✅ `quickstart.md` conformance stanzas (SC-001..SC-009) are the named verification surface; every spec claim about the canon carries a doc reference.
- **VIII — Spec is source of truth**: ✅ The implementation edits canon docs to match the spec; no downstream artefact is hand-patched outside the speckit flow. (Gate A incorporation was itself spec-sourced.)
- **IX — Build on the constraint**: ✅ The binding constraint is keeping the gate's vote honest as boards flex; US2 is on it. The side-note *gating* version and any semantic "distinct delta" validator are explicitly deferred (research R1).
- **Authoring constraints**: ✅ Markdown-only; no runtime code beyond `install.sh` + check stanzas; this is a refinement of the existing `chorus` skill canon, not a new skill.

**Result: PASS, no violations.** Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/012-rsvp-exceptional-entry/
├── spec.md              # v3 (Gate A cleared)
├── plan.md              # this file
├── research.md          # Phase 0 — residual decisions R1/R2
├── data-model.md        # Phase 1 — entities (RSVP answer, board, N, threshold, side-note, uncovered delta)
├── quickstart.md        # Phase 1 — conformance stanzas SC-001..SC-009
├── contracts/
│   └── canon-edits.md   # Phase 1 — the exact canon-doc edit contract (which rule lands where)
├── checklists/requirements.md
└── agent-sdlc-log.md    # Gate ledger
```

### Source (the change surface — canon docs, repository root)

```text
skill/chorus/
├── SDLC-LAYER.md        # EDIT: seating — cap 5 ordinary + uncapped exceptional entry (evidence bar); board-size formula
├── GATE-PRIMITIVE.md    # EDIT: Stage 4 tally — T = max(1, floor(N/2)) over non-author N (replaces fixed +2); T≥1, no tally at N<2
├── SKILL.md             # EDIT: RSVP — exceptional-entry answer (cite uncovered delta); reconcile net≥+2 restatements (FR-016)
├── INTEGRATION-LAYER.md # EDIT: conductor side-notes (flag-only safety net regimes)
└── DECISION-PRIMITIVE.md# CHECK: seating-decision rows still consistent (exceptional entry is self-selected, evidence-anchored per D5)
```

**Structure Decision**: No `src/`/`tests/` — the artefacts ARE the canon Markdown docs; the conformance stanzas in `quickstart.md` are the test surface. Each rule edits exactly one canonical home (Principle I); FR-016 reconciles restatements elsewhere to citations.

## Complexity Tracking

> Empty — Constitution Check passed with no violations.
