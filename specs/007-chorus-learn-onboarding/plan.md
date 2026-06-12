# Implementation Plan: `chorus learn` — Interactive Staged Onboarding

**Branch**: `007-chorus-learn-onboarding` | **Date**: 2026-06-10 (cycle-3 regen) | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-chorus-learn-onboarding/spec.md`
(Gate A cycle-2-revised: +10 gate-sourced clarifications, FR-015/SC-009 added)

## Summary

Add a third operating mode to the chorus-review skill — **`chorus learn`** — an
interactive onboarding tutorial of five **steps** (orient / set up / run a round /
agent-SDLC / work with results) driven by the AskUserQuestion tool: four navigation
affordances at every step (advance / jump / deeper / exit — labels, ordering, and
per-step depth state **pinned by the normative navigation contract**), one opt-in
write (the addendum scaffold, behind a dedicated confirm, emitting a SCAFFOLDED
marker), structured per-step `Cites:` lists (≥1 per step, cardinality-asserted) with
runtime failure pointers resolved via the **running skill's base path**, and
dual-channel install detection **with dual-channel delivery** (FR-015).

Technical approach: author a new companion doc `skill/chorus-review/LEARN.md` (the
single canonical definition of the mode); register the mode across **all** cold-start
surfaces — `SKILL.md` mode list **and YAML frontmatter**, the three-mode reframe of the
"Two modes" heading, a Phase-0 note defining the scaffolded-addendum state for both
consumers (FR-014), README quick-start, `install.sh` "Next:" text; extend `install.sh`
to deploy the template **and `plugin.json` to package the template and the full
persona-agent set** (FR-015). No runtime code; same authoring shape as features
003–006.

## Technical Context

**Language/Version**: Markdown (Claude Code skill/prompt authoring); Bash only for the
`install.sh` template-deployment edit

**Primary Dependencies**:
- The chorus canon the tutorial cites: `SKILL.md`, `INTEGRATION-LAYER.md`,
  `SDLC-LAYER.md`, `GATE-PRIMITIVE.md`, `EXPLORATORY-PHASE.md`, `DECISION-PRIMITIVE.md`
- **Feature 006 (PR #5, open)** — `DECISION-PRIMITIVE.md` exists only on that branch;
  007 lands after it (research.md R8). Note: 006 does **not** deliver a three-mode
  SKILL.md — its SKILL.md still lists two modes; **007 itself performs the
  two→three-modes reframe** (R8 corrected per finding F25). The PR #5 **merge
  horizon is an open operator item** (run-2 GOLD-1, held 🟡): the serialized path to
  the first newcomer session starts at that merge; record the horizon when known
- The AskUserQuestion tool (≤4 options per question plus built-in "Other") — the
  navigation rules in FR-004 are designed against this hard budget
- `templates/CHORUS-PROJECT.template.md` (scaffold source), `install.sh` (file-path
  deployment), and **`plugin.json`** (plugin-channel packaging — today it roots the
  skill at `skill/chorus-review/`, ships 7 of 10 persona agents, and does not carry
  `templates/`; FR-015 names it an edit surface)
- **Both documented install channels**: file-path (`./install.sh` → `~/.claude`) and
  plugin — detection, **delivery**, and scaffold-source resolution must work on each
  (R5/R6/R11): the template resolves `<skill-base>/templates/` first, plugin root as
  fallback

**Storage**: none — resume state is conversation-scoped, updated at every step
transition (FR-010); the sole write surface is the opt-in scaffold
`docs/reviews/CHORUS-PROJECT.md` (FR-005/007)

**Testing**: structural checks **C1–C7** in `quickstart.md` (mode + frontmatter
registered, steps present, structured-cites resolution **with cardinality assert**,
no-restatement with pinned table delimiters, scaffold deployment asserted on **both
channels** — repo/installed side **and C5b plugin-side packaging** — write-idiom scan
**self-tested against fixture lines**, four-path scaffold matrix) + a dogfood
walkthrough (scaffold declined by default — spec Assumptions). **Ownership (SC-008)**:
C1–C7 execute at the Gate C dogfood and before merge; results recorded in the gate
ledger. Checks contain no dead assertions and parse structural units, never fixed
line windows.

**Target Platform**: a Claude Code session in any user project (the skill is
project-agnostic; project facts come from the addendum or are absent)

**Project Type**: skill/prompt repository — documentation-mode addition (no app, no
runtime code)

**Performance Goals**: N/A — interaction-bounded; ≈5 steps, one AskUserQuestion
interaction's worth of content per step (SC-002)

**Constraints**:
- Non-mutating by default; exactly one opt-in write behind a dedicated confirm
  (FR-005/FR-007, SC-004); install sub-step instruct-only with **channel-branched
  remedy text** (FR-006)
- Cite-not-restate via structured `Cites:` lists (≥1/step) + runtime failure clause
  with base-path pointers (FR-008, SC-005)
- All four affordances at every step within the 4-option budget — S1 fast-exit rides
  the exit wrap-up (label signifies it); S5 advance = **Finish**, declared-convergent
  with exit; S5 jump lists S1–S4 without "back", free-text escape disclosed;
  **per-step** depth state drives the recap re-present (FR-004, SC-003: one navigation
  action = ≤2 interactions; resume question outside the unit). All labels/orderings
  pinned by `contracts/navigation.md` — the normative surface (R12)
- Non-expert floor + step/stage vocabulary disambiguation (FR-012)

**Scale/Scope**: 1 new companion doc (`LEARN.md`, est. 10–14 KB); `SKILL.md` edits
(mode list, frontmatter description, "Two modes"→three-mode heading, Phase-0
scaffolded-state note covering both consumers); README quick-start edit; `install.sh`
edits (template deployment + "Next:" text); **`plugin.json` edit** (templates/ +
3 missing persona agents + stale description); template preamble made copy-safe;
5 steps, ~7 canonical pointers; checks C1–C7 (+C5b) with fixture self-test

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` remains the unfilled speckit template — **no ratified
project constitution** (standing fact since feature 003). Operative governance is the
chorus invariant set:

| De-facto principle | How this plan honors it | Status |
|---|---|---|
| One canonical definition; layers reference, never restate | `LEARN.md` cites via structured `Cites:` lists (FR-008); C3/C4 mechanically enforce; the template stays the single source of addendum structure for both creation paths (FR-007) | ✅ |
| Mode-of-one-skill shape | third mode registered, not a new skill; all registry surfaces named as edit targets (FR-013) | ✅ |
| Operator decisions banded, never inferred (D1–D5) | the sole write sits behind a dedicated explicit confirm (consent isolated from navigation); everything else read-only; scaffolded-state consumer behavior declared (FR-014) | ✅ |
| Orchestrator authors nothing it shouldn't (S1) | artefacts produced via speckit phase-runners; tutorial content authored at implement, gated A/B/C | ✅ |

No violations → Complexity Tracking empty. **Re-checked after Phase 1 regen: passing** —
the contracts bind the tutorial to existing canonical definitions and declare every
write/probe surface.

## Project Structure

### Documentation (this feature)

```text
specs/007-chorus-learn-onboarding/
├── spec.md              # Cycle-3 revision (Gate A clarifications encoded)
├── plan.md              # This file
├── research.md          # Phase 0 output (R1–R12)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output (checks C1–C7 + C5b + walkthrough; owned per SC-008)
├── contracts/
│   ├── learn-mode.md    #   mode trigger + registration surfaces (incl. plugin.json) + step contract
│   ├── navigation.md    #   the NORMATIVE AskUserQuestion navigation contract (labels, ordering, depth state)
│   └── scaffold.md      #   the opt-in addendum-scaffold contract (confirm, marker, matrix, resolution order)
├── checklists/requirements.md
├── agent-sdlc-log.md    # Gate ledger (cycle 1 BLOCKED → cycle 2 BLOCKED → cycle 3)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
skill/chorus-review/
├── SKILL.md             # EDIT: mode list + YAML frontmatter description + "Two modes"→
│                        #   three-mode heading + Phase-0 scaffolded-addendum note (FR-014)
├── LEARN.md             # NEW: the staged tutorial — single canonical definition of the mode
├── INTEGRATION-LAYER.md # cited (unchanged)
├── SDLC-LAYER.md        # cited (unchanged)
├── GATE-PRIMITIVE.md    # cited (unchanged)
├── EXPLORATORY-PHASE.md # cited (unchanged)
└── DECISION-PRIMITIVE.md# cited (unchanged; arrives via 006 / PR #5)

templates/
└── CHORUS-PROJECT.template.md  # EDIT: copy-safe preamble (comment-wrapped copy instructions)

install.sh               # EDIT: deploy templates/ → $SKILL_DST/templates/ + "Next:" leads
                         #   with `chorus learn`
plugin.json              # EDIT (FR-015): package templates/ + every file in agents/
                         #   (the directory is the authoritative roster — no filename
                         #   enumeration here or anywhere); refresh the stale description
README.md                # EDIT: three modes named; quick-start leads with `chorus learn`;
                         #   manual copy remains as cited fallback (installed template path)
```

**Structure Decision**: single-repo skill layout, unchanged from 003–006. `LEARN.md`
holds the whole mode once; `SKILL.md` carries registration only (mode list +
frontmatter + the FR-014 Phase-0 note — a consumer-contract addition, not tutorial
content). The template edit (copy-safe preamble) is part of this feature because the
scaffold copies it verbatim; the `plugin.json` edit is part of this feature because
FR-015 makes the plugin channel a delivery surface, not just a detection target. No
repo `CLAUDE.md` exists; the speckit agent-context update step is a recorded no-op.

## Complexity Tracking

> No constitution-check violations; table intentionally empty.
