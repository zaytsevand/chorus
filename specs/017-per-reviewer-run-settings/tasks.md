# Tasks: Per-reviewer run settings through the host's own agent files

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

**Status**: Draft. **Not for build** until R-16 is lifted.

## Phase 0: Read

- [ ] T002 Read `README.md` and the project-setup part of `skill/chorus-learn/SKILL.md` (~lines 117–136) and decide where the section and the pointer sit (open question 1).

## Phase 1: Smoke check the recipe

- [ ] T001 Follow the recipe's steps once on this repository (in a throwaway copy of the repo, outside the main checkout): copy one shipped reviewer to `.claude/agents/<same name>.md`, change `model` or `effort`, keep the body, add a reason comment; dispatch that reviewer by name with a plain `Agent` call and a trivial prompt. Record in `specs/017-per-reviewer-run-settings/research.md`: host version; the steps as run; whether the reviewer ran with the changed setting and how that was observed; any key (`effort`, `tools`) that could not be observed (labelled "documented, not verified"). If the recipe does not work, stop: record the finding, comment on issue #10, and do not do T003/T004.

## Phase 2: Document

- [ ] T003 Add the README section "Retuning a reviewer for one project": the recipe (same name; change only `model`, `effort`, `tools`; keep the body; reason as a comment; re-compare with the shipped file after a plugin update), the cost statement (the copy forks the persona; the chorus installer will not update it), and a link to the host's agent documentation for everything about which file the host uses. No claim about host resolution beyond the link (SC-004). Name the host version from T001.
- [ ] T004 [P] Add one pointer sentence to `skill/chorus-learn/SKILL.md` at project setup, linking the README section (no restatement).

## Phase 3: Check

- [ ] T005 Run `scripts/check-suite-integrity.sh` (all green) and check `git diff --stat origin/main` shows only `README.md`, `skill/chorus-learn/SKILL.md` and `specs/017-per-reviewer-run-settings/*` (SC-001).

## Dependencies

- T002 before T003 and T004. T001 before T003. T005 last.

## Independent tests per story

- **US1:** T005 (the diff). **US2:** T001. **US3:** a reader follows the README section alone (SC-003).
