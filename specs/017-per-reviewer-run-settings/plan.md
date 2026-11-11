# Implementation Plan: Per-reviewer run settings through the host's own agent files

**Branch**: `017-per-reviewer-run-settings` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Status**: Draft plan. **Not for build** until R-16 is lifted.

## Summary

No chorus mechanism. A per-project retune of a reviewer is a project-level `.claude/agents/<name>.md` of the same name; which file the host uses is the host's job. This feature writes the recipe once in the README, links the host's documentation for anything about resolution, states the fork-and-staleness cost, and runs the recipe once on this repository to prove the README does not publish untried steps. Agent files, canon, schemas, validator, renderer and installer are untouched.

## Technical Context

**Language/Version**: Markdown only.

**Primary Dependencies**: The host's agent files and documentation; none added.

**Storage**: A project's own `.claude/agents/`; chorus stores nothing.

**Testing**: One smoke run of the recipe (T001) recorded in `research.md`; `scripts/check-suite-integrity.sh` (README references must still resolve).

**Target Platform**: Claude Code only (R-14).

**Constraints**: No code; no new file beyond `research.md`; the recipe cites, `chorus-learn` points and does not restate.

## Constitution Check

- **I — Cite, never restate**: the recipe lives only in `README.md`; host behaviour is a link; `chorus-learn` points. Pass.
- **V — Evidence**: the recipe's steps are run once and logged with the host version; host behaviour is cited from the host's documentation, not asserted. Pass.
- **VIII — Spec is source of truth**: changes follow the tasks. Pass.
- **IX — Build on the constraint**: the smallest slice: a recipe run once, no machinery. Pass.
- **Authoring constraints**: canon untouched. Pass.

## Design decisions

1. **The agent file is the source of truth** (operator, 2026-10-12). Chorus dispatches by name; the host resolves.
2. **Chorus does not test or document host resolution** (operator, 2026-10-12): link, don't restate.
3. **No record change**: showing "ran differently" would make the conductor read run settings; ruled not its job.
4. **Cost accepted openly**: a copy forks the persona and the installer will not update it; the recipe says so and gives the re-compare step.

## Project Structure

```text
specs/017-per-reviewer-run-settings/
├── spec.md
├── plan.md
├── tasks.md
└── research.md   # written by T001

README.md                          # new section "Retuning a reviewer for one project"
skill/chorus-learn/SKILL.md        # one pointer at project setup
```

Nothing else changes.

## Phases

- **Phase 0, read.** Read the README and `chorus-learn` project-setup part to place the section and the pointer (T002).
- **Phase 1, smoke check the recipe (T001).** Follow the recipe once on this repository for one reviewer with a changed `model` or `effort`; dispatch it by name; note the host version and that the reviewer ran with the changed setting.
- **Phase 2, document (T003, T004).** README section; `chorus-learn` pointer.
- **Phase 3, check (T005).** Integrity script green; the diff contains only the allowed files.

## Risks

| Risk | Mitigation |
|------|-----------|
| The smoke run shows the recipe does not produce a retuned reviewer | Stop: write the finding into `research.md` and comment on issue #10; do not publish the section |
| `effort` or `tools` cannot be observed taking effect | The recipe labels that key "documented, not verified" and links the host's documentation |
| Users copy the whole file and edit the voice | The recipe says to change only the three keys and why |
| Stale copies after plugin updates | Stated cost plus the re-compare step; no tooling (out of scope) |

## Complexity Tracking

None. No constitution violation.
