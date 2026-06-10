# Implementation Plan: `chorus learn` — Interactive Staged Onboarding

**Branch**: `007-chorus-learn-onboarding` | **Date**: 2026-06-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-chorus-learn-onboarding/spec.md`

## Summary

Add a third operating mode to the chorus-review skill — **`chorus learn`** — an
interactive, staged onboarding tutorial driven by the AskUserQuestion tool. Five stages
(orient / set up / run a round / agent-SDLC / work with results) teach a newcomer how to
set up the chorus and work with it, with choose-your-path navigation, one opt-in write
(the addendum scaffold), and cite-not-restate pointers into the canonical docs.

Technical approach: author a new companion doc `skill/chorus-review/LEARN.md` holding the
staged tutorial procedure (the single canonical definition of the mode), register the
mode in `SKILL.md`'s mode list and the README (FR-013), and extend `install.sh` to deploy
the addendum template with the skill so the scaffold action (FR-007) works in any
installed project. No runtime code; the "implementation" is skill/prompt authoring, the
same shape as features 003–006.

## Technical Context

**Language/Version**: Markdown (Claude Code skill/prompt authoring); Bash only for the
`install.sh` template-deployment edit

**Primary Dependencies**:
- The chorus canon the tutorial cites: `SKILL.md`, `INTEGRATION-LAYER.md`,
  `SDLC-LAYER.md`, `GATE-PRIMITIVE.md`, `EXPLORATORY-PHASE.md`, `DECISION-PRIMITIVE.md`
- **Feature 006 (PR #5, open)** — `DECISION-PRIMITIVE.md` and the three-mode-aware
  `SKILL.md` exist only on that branch; 007 must land after it (see research.md R8)
- The AskUserQuestion tool (Claude Code harness primitive; ≤4 options per question plus a
  built-in "Other") — the navigation contract is designed to fit it
- `templates/CHORUS-PROJECT.template.md` (scaffold source) and `install.sh` (deployment)

**Storage**: none — resume state is lightweight, in-conversation only (FR-010 assumption);
the sole write surface is the opt-in scaffold `docs/reviews/CHORUS-PROJECT.md` (FR-005/007)

**Testing**: structural checks in `quickstart.md` (mode registered, stages present,
cite-resolution, no-restatement scan, scaffold preconditions) + a dogfood walkthrough of
the tutorial in this repo

**Target Platform**: a Claude Code session in any user project (the skill is
project-agnostic; project facts come from the addendum or are absent)

**Project Type**: skill/prompt repository — documentation-mode addition (no app, no
runtime code, no test harness beyond structural checks)

**Performance Goals**: N/A — interaction-bounded; ≈5 stages, one AskUserQuestion
interaction's worth of content per stage (SC-002)

**Constraints**:
- Non-mutating by default; exactly one opt-in write (FR-005/FR-007, SC-004)
- Cite-not-restate for every canon-defined mechanic (FR-008, SC-005)
- Navigation must offer advance / jump / deeper / exit within the AskUserQuestion
  4-option budget (FR-004, SC-003)
- Usable by a non-expert; terms introduced before use (FR-012)

**Scale/Scope**: 1 new companion doc (`LEARN.md`, est. 8–12 KB), a mode-list edit in
`SKILL.md`, a README discoverability edit, an `install.sh` edit (template deployment);
5 stages, ~6 canonical pointers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is the unfilled speckit template — **no ratified
project constitution exists** (same finding as features 003–006). The operative
governance is the chorus invariant set, and this feature touches it directly:

| De-facto principle | How this plan honors it | Status |
|---|---|---|
| One canonical definition; layers reference, never restate (GATE-PRIMITIVE/DECISION-PRIMITIVE adoption notes) | The tutorial **cites** the canon for every mechanic (FR-008); `LEARN.md` is itself the single definition of the learn mode, referenced from `SKILL.md` | ✅ |
| Mode-of-one-skill shape (SDLC-LAYER: "an operating mode … not a new skill") | `chorus learn` is registered as a third mode, not a new skill (spec Assumption 1) | ✅ |
| Operator decisions banded, never inferred (D1–D5) | The tutorial's one mutating action is an explicit opt-in confirmation (a 🔴-style ask by design: a write to the user's repo); everything else proceeds without writes | ✅ |
| Orchestrator authors nothing it shouldn't (S1) | Plan artefacts produced via speckit phase-runners; tutorial content authored at implement, gated A/B/C | ✅ |

No violations → Complexity Tracking is empty. **Re-checked after Phase 1 design: still
passing** — the contracts introduce no new canonical definitions (they bind the tutorial
to existing ones) and no new write surfaces beyond the scaffold.

## Project Structure

### Documentation (this feature)

```text
specs/007-chorus-learn-onboarding/
├── spec.md              # Feature specification (committed 55f3fff)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── learn-mode.md    #   mode trigger + stage map + per-stage contract
│   ├── navigation.md    #   the AskUserQuestion navigation contract
│   └── scaffold.md      #   the opt-in addendum-scaffold contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (committed)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
skill/chorus-review/
├── SKILL.md             # EDIT: mode list gains "chorus learn" trigger → points to LEARN.md
├── LEARN.md             # NEW: the staged tutorial — single canonical definition of the mode
├── INTEGRATION-LAYER.md # cited (unchanged)
├── SDLC-LAYER.md        # cited (unchanged)
├── GATE-PRIMITIVE.md    # cited (unchanged)
├── EXPLORATORY-PHASE.md # cited (unchanged)
└── DECISION-PRIMITIVE.md# cited (unchanged; arrives via 006 / PR #5)

templates/
└── CHORUS-PROJECT.template.md  # unchanged; becomes deployed by install.sh

install.sh               # EDIT: also deploy templates/ → $SKILL_DST/templates/
README.md                # EDIT: name the third mode (FR-013)
```

**Structure Decision**: single-repo skill layout, unchanged from features 003–006. The
learn mode follows the established companion-doc pattern: `SKILL.md` lists the mode and
points to `LEARN.md`, which holds the whole procedure once. The only structural addition
outside `skill/` is the install.sh deployment of the existing template (research.md R6).
There is no repo `CLAUDE.md`, so the speckit agent-context update step is a recorded
no-op for this repo.

## Complexity Tracking

> No constitution-check violations; table intentionally empty.
