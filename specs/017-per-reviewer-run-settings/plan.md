# Implementation Plan: Per-reviewer run settings as deliberate exceptions

**Branch**: `017-per-reviewer-run-settings` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Status**: Draft plan. **Not for build** until R-16 is lifted.

## Summary

Reviewers keep running as the session does. A reviewer's model, effort or tools change only through a written exception (one reviewer, one field, one value, one reason), declared in the agent file's frontmatter (all projects) or in item 8 of `docs/reviews/CHORUS-PROJECT.md` (one project). The dispatch step resolves `project ?? agent-file ?? session` per field and passes only what the host accepts; the review record notes any reviewer that ran differently. Default behaviour (no exceptions) is unchanged.

## Technical Context

**Language/Version**: Markdown canon; zero-dependency Node (ES modules) for the validator, as today.

**Primary Dependencies**: Claude Code's native agent frontmatter and `Agent` dispatch parameters; none added.

**Storage**: Existing files only: `agents/*.md`, `docs/reviews/CHORUS-PROJECT.md`, the record JSON.

**Testing**: `scripts/check-suite-integrity.sh` (CI `integrity.yml`), `tests/parity/`, the coryphaeus validator's own fixtures.

**Target Platform**: Claude Code only (R-14).

**Project Type**: Skill suite (canon + validator).

**Constraints**: No runtime service, no new file beyond the project file, no change to invariants (FR-010, FR-012).

**Scale/Scope**: Ten agent files, three canon documents, two schema `$defs`, one conformance check.

## Constitution Check

- **I — Cite, never restate**: the resolution rule is written once in `skill/chorus-core/CONDUCTOR.md` (new short subsection under § Ports' neighbour, "Run settings"); `chorus-review` and `chorus-sdlc` dispatch rules cite it by name. Pass.
- **V — Evidence**: host behaviour (can dispatch override effort/tools?) is *verified in Phase 0*, not assumed; the answer is recorded in `research.md` with the Claude Code version. Pass, conditional on T001.
- **VIII — Spec is source of truth**: agent files and templates change only via the tasks below. Pass.
- **IX — Build on the constraint**: the binding constraint here is that the Q-33 ruling is unbuilt and unproven by use; the plan ships the smallest slice (exceptions + record note) and defers a per-round override and any enforcement. Deferrals are stated in the spec's Out of scope.
- **Authoring constraints**: canon stays Markdown; the schema/validator live in coryphaeus behind the existing ports; no new skill. Pass.

## Design decisions

1. **No baseline values.** `model: inherit` stays the only run field on all ten agents. An absent field is the session.
2. **Exception = reviewer + field + value + reason.** In frontmatter it is a documented comment-free pair: the field itself plus a sibling `run_reason:` key (the host ignores unknown keys; to confirm in T001). In `CHORUS-PROJECT.md` item 8 it is a small table: `reviewer | field | value | reason`.
3. **Resolution is mechanical**, field by field, in the dispatch step; the conductor never paraphrases a setting into a brief.
4. **Where the host cannot override at dispatch** (expected: `tools`, possibly `effort`) the field is frontmatter-only; a project-file entry for it is reported once and ignored (FR-005, edge case).
5. **Record** gains optional `run: {model?, effort?, tools?, source, reason}` on `rsvp_row` (and the ledger's equivalent), plus a `failure` enum value `run-setting-rejected`. Minor schema bump under the existing versioning rule (Q-26).
6. **Failure is recoverable and silent to the operator** except one line in the round's opening and the record (FR-008).

## Project Structure

### Documentation (this feature)

```text
specs/017-per-reviewer-run-settings/
├── spec.md
├── plan.md      # this file
├── tasks.md
└── research.md  # written by T001 (host-field verification)
```

### Source changes (repository root)

```text
agents/*.md                                    # unchanged by default; frontmatter exceptions only if the maintainer adds one
skill/chorus-core/CONDUCTOR.md                 # new "Run settings" subsection: the one owner of the rule
skill/chorus-review/SKILL.md                   # Dispatch rules: one line citing it
skill/chorus-sdlc/SKILL.md                     # matching dispatch line
skill/chorus-review/ADDENDUM-AND-SCOPE.md      # item 8 "Reviewer run exceptions" in the CHORUS-PROJECT.md contents
skill/coryphaeus/schema/common.schema.json     # rsvp_row.run, failure enum, minor version bump
skill/coryphaeus/schema/sdlc-log.schema.json   # ledger row run, if it does not reuse rsvp_row
skill/coryphaeus/bin/validate.mjs              # only if the schema is not enough (e.g. reason required when run present)
scripts/check-suite-integrity.sh               # FR-009 check
tests/parity/ + validator fixtures             # old record still valid; record with run valid; run without reason invalid
```

## Phases

- **Phase 0, verify the host (T001).** Confirm on the supported Claude Code versions: which of `model`, `effort`, `tools` the `Agent` call accepts per dispatch; which are read from agent frontmatter; whether an unknown frontmatter key (`run_reason`) is tolerated. Output: `research.md`. This fixes FR-005's field list; every later task depends on it.
- **Phase 1, contract.** Schema `run` field, version bump, fixtures (tests first).
- **Phase 2, canon.** Conductor subsection, two dispatch lines, addendum item 8.
- **Phase 3, conformance.** FR-009 check and a round-trip fixture proving SC-001 (no exceptions = unchanged).
- **Phase 4, dogfood** (R-7: a version is done once dogfooded through the real install channel). Install, add one exception on this repo, run a round, read the record.

## Risks

| Risk | Mitigation |
|------|-----------|
| Host cannot override effort at dispatch | Frontmatter-only for that field; spec already allows it |
| Unknown frontmatter key breaks agent loading | T001 decides; if it is not tolerated, frontmatter exceptions are not offered and only project-file exceptions ship (no new file is added to carry the reason) |
| Schema bump breaks old records | Additive optional field; SC-005 fixture runs the whole existing record set |
| Setting looks applied but is not | FR-005: only host-accepted values are passed; rejected ones fall back and are recorded |

## Complexity Tracking

None. No constitution violation.
