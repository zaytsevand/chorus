# Tasks: Per-reviewer run settings as deliberate exceptions

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

**Status**: Draft. **Not for build** until R-16 is lifted.

`[P]` = can run in parallel (different files, no dependency). Story tags map to the spec's user stories.

## Phase 0: Verify the host

- [ ] T001 Verify on the supported Claude Code versions which of `model`, `effort`, `tools` the `Agent` call accepts per dispatch, which agent frontmatter reads, and whether an unknown key (`run_reason`) is tolerated. Write the answer, with version and evidence, to `specs/017-per-reviewer-run-settings/research.md`. **Blocks every task below that names a field.**

## Phase 1: Contract (tests first)

- [ ] T002 [P] [US4] Add validator fixtures: a record with no `run` (old shape) passes; a record with `run` (values, source, reason) passes; `run` without `reason` fails; `source` outside `agent-file|project` fails. Under `skill/coryphaeus/` fixtures.
- [ ] T003 [US4] Add optional `run` to `rsvp_row` and the `run-setting-rejected` value to its `failure` enum in `skill/coryphaeus/schema/common.schema.json`; make `reason` required when `run` is present. Bump the schema's minor version (Q-26). T002 must fail before, pass after.
- [ ] T004 [P] [US4] Mirror `run` in `skill/coryphaeus/schema/sdlc-log.schema.json` if the ledger row does not reuse `rsvp_row`; add its fixture.
- [ ] T005 [US4] Run the whole existing record set through the validator (SC-005); fix the schema, not the records, if any fails.

## Phase 2: Canon

- [ ] T006 [US2] Add a "Run settings" subsection to `skill/chorus-core/CONDUCTOR.md`: exception shape, resolution `project ?? agent-file ?? session`, pass-only-what-the-host-accepts, fall-back-and-record on rejection, never a question to the operator. This is the single owner of the rule.
- [ ] T007 [P] [US2] Add one citing line to the Dispatch rules in `skill/chorus-review/SKILL.md` (no restatement).
- [ ] T008 [P] [US2] Add the matching dispatch line to `skill/chorus-sdlc/SKILL.md`.
- [ ] T009 [P] [US2] Add item 8, "Reviewer run exceptions" (table: reviewer, field, value, reason), to the CHORUS-PROJECT.md contents list in `skill/chorus-review/ADDENDUM-AND-SCOPE.md`; state that absence means no exceptions and that fields the host cannot override at dispatch are reported if placed here.
- [ ] T010 [US3] Document the frontmatter form (field plus reason key, per T001) once, in `CONTRIBUTING.md`, with the rule that baseline agent files carry no project markers (FR-011). Leave all ten `agents/*.md` at `model: inherit`.

## Phase 3: Conformance

- [ ] T011 [US3] Add the FR-009 check to `scripts/check-suite-integrity.sh`: fail an agent file with a run field other than `model: inherit` and no reason; require no run field to be present. Include a negative fixture proving it fires.
- [ ] T012 [US1] Add a round-trip fixture (or extend `scripts/test-install-roundtrip.sh`) showing that with no exceptions the dispatch settings and record equal the pre-feature output apart from schema version (SC-001).
- [ ] T013 Run `integrity` locally and in CI; both green.

## Phase 4: Dogfood (R-7)

- [ ] T014 Install through the real channel (`install.sh`), add one project exception for one reviewer in this repo's `docs/reviews/CHORUS-PROJECT.md`, run a round with plain `Agent` dispatches.
- [ ] T015 Read the produced record: only that reviewer carries `run`, with source and reason (SC-002, SC-004); then add a malformed exception and confirm the round still completes (SC-003).
- [ ] T016 Remove the dogfood exception; record the outcome in the feature's ledger.

## Dependencies

- T001 → T003, T006, T009, T010 (field list).
- T002 → T003 → T005. T004 follows T003.
- T006 → T007, T008. T009 and T010 are independent after T001.
- T011 after T010. T012 after T003 and T006. T013 after T011 and T012. Phase 4 after T013.

## Independent tests per story

- **US1:** T012. **US2:** T014/T015. **US3:** T011. **US4:** T002/T005.
