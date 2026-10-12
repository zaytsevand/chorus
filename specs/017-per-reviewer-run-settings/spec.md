# Feature Specification: Per-reviewer run settings as deliberate exceptions

**Feature Branch**: `017-per-reviewer-run-settings`

**Created**: 2026-10-12

**Status**: Draft. Specified only; **do not build yet** (R-16: wait with the development of Q-32 / Q-33).

**Input**: GitHub issue #10 ("Per-persona runtime config layer (model / effort / tools), separate from the persona canon"), as narrowed by brief rulings Q-33 ("Reviewers run as the session does, unless deliberately changed"), R-14 (Claude Code only; Markdown + zero-dependency Node; no runtime services) and R-15 (one sensible answer: do not escalate it).

> **Departure from the issue.** Issue #10 proposed a three-layer cascade (baseline for every persona, project overlay, per-round override) with baselines filled for all ten personas. Q-33 re-ruled this: the **session's settings come first**, and a per-reviewer value exists only as a **deliberate exception with a reason**. A baseline for every persona is dropped, and so is the per-round override (nothing in the ruling asks for it; see Out of scope).

## Motivation

Every reviewer runs on the session's model and effort with the same tool surface. `agents/*.md` frontmatter holds `model: inherit` and nothing else operational. Two consequences:

- Retuning one reviewer (stronger model for the constraint lens, a cheaper tier for a language idiom check, no network tools for one lens) means editing the file that also holds its voice, gates and relationships, a file reviewed for voice fidelity.
- Someone using the published plugin (Q-19) cannot turn a reviewer down for their own project without forking it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Nothing written, nothing changes (Priority: P1)

An operator who writes no exceptions gets exactly today's behaviour: every reviewer runs with the session's model, effort and tools.

**Why this priority**: It is the default and the regression guard. Most users never touch this feature.

**Independent Test**: Run a round on a project with no exceptions anywhere. Compare dispatch settings and the review record with a pre-feature run: identical, and the record shows no run-setting notes.

**Acceptance Scenarios**:

1. **Given** all agent files carry `model: inherit` and no other run field, and the project file has no exceptions section, **When** a round is dispatched, **Then** every reviewer runs with the session's settings and the record carries no run-setting field on any roster row.
2. **Given** the project file is absent, **When** a round is dispatched, **Then** the round proceeds exactly as before (no new ask, no new failure).

---

### User Story 2 - One reviewer deliberately changed for one project (Priority: P1)

An operator writes, in `docs/reviews/CHORUS-PROJECT.md`, that one reviewer runs on a different model or effort on this project, with a reason. The next round honours it, and the record says so.

**Why this priority**: This is the feature: the retune that today needs a fork.

**Independent Test**: Add one exception (reviewer, field, value, reason). Run a round. Confirm that reviewer is dispatched with the value, all others with the session's, and the roster row records the difference and its source.

**Acceptance Scenarios**:

1. **Given** an exception `goldratt: model=opus, effort=high, reason: "gate C is red-dense on this repo"`, **When** the round dispatches Goldratt, **Then** it runs with those values and the others do not.
2. **Given** the same reviewer also has an exception in its agent file, **When** both apply, **Then** the project file wins and the record shows the project file as the source.
3. **Given** an exception with no reason, **When** the project file is read, **Then** it is rejected as malformed, named in the round's first line to the operator, and the round runs with the session's settings for that reviewer (it does not abort).
4. **Given** the exception names a reviewer not on the roster, **When** read, **Then** it is ignored and reported once; no other effect.

---

### User Story 3 - A shipped exception in the agent file (Priority: P2)

The maintainer deliberately changes a reviewer for everyone (for example `tools` narrowed on a lens that must never write) by adding the field and a reason to that agent file's frontmatter. It applies to every project unless a project exception overrides it.

**Independent Test**: Add `effort` (or `tools`) with a reason to one agent file; run a round on a project with no exceptions; the reviewer runs with it and the record notes the source as the agent file.

**Acceptance Scenarios**:

1. **Given** a frontmatter exception on one agent, **When** dispatched, **Then** that agent uses it and the record notes it; the other nine are unaffected.
2. **Given** a frontmatter exception with no reason, **When** the conformance check runs, **Then** it fails (see FR-009).

---

### User Story 4 - The record shows who ran differently (Priority: P1)

Whoever reads a review record can tell, per reviewer, whether it ran as the session did, and if not, with what and why.

**Independent Test**: Run Stories 1–3; render the record; only reviewers that differed carry a run note, each naming values, source and reason.

**Acceptance Scenarios**:

1. **Given** a round with one differing reviewer, **When** the record is validated, **Then** the roster row for that reviewer carries a `run` object and passes the schema; rows for the rest have none.
2. **Given** a pre-feature record (no `run` anywhere), **When** validated against the new schema, **Then** it still passes (the field is optional; the schema change is additive).

### Edge Cases

- **Session settings unknown to the conductor.** The conductor does not need them: "as the session does" means passing no override. Nothing is recorded for a reviewer that received no override.
- **Value the host rejects** (unknown model alias, tool name that does not exist). The reviewer falls back to the session's settings, the record notes the attempted value and `failure: "run-setting-rejected"`, and the round continues. This is recoverable, so it does not become a question to the operator (R-11, R-15).
- **`tools` in the project file.** The Agent dispatch call can override model and effort but not an agent's tool list (to confirm in plan). If so, `tools` exceptions are valid only in agent frontmatter, and a `tools` entry in the project file is reported as unsupported there rather than silently ignored.
- **Reviewer joins by exceptional entry or abstains.** Exceptions apply only to a reviewer that is dispatched; an abstainer's row carries no `run`.
- **Cost.** A stronger model for one reviewer raises that round's cost; the existing per-dispatch budget (SKILL.md Dispatch rules) is unchanged and still stops an overlong dispatch.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A reviewer MUST run with the session's model, effort and tools unless an exception applies. Agent files keep `model: inherit`; no baseline values are added for any persona.
- **FR-002**: An **exception** is one reviewer, one field (`model`, `effort` or `tools`), one value, and a **reason** (one line). An exception without a reason is invalid.
- **FR-003**: Exceptions MAY be declared in two places: an agent file's frontmatter (applies to every project) and a new section of `docs/reviews/CHORUS-PROJECT.md` (applies to one project). The addendum template gains this as item 8, "Reviewer run exceptions".
- **FR-004**: Resolution per field, per reviewer: `project exception ?? agent-file exception ?? session`. Resolution is deterministic, with no judgement by the conductor.
- **FR-005**: The conductor passes a resolved value to the host only where the host accepts it at dispatch; it never applies one "by hand" (for example by instructing the persona to think harder in prose). Where a field cannot be overridden at dispatch, the exception is valid only in the place the host reads it (agent frontmatter) and a mis-placed one is reported, not ignored.
- **FR-006**: The review record's roster row (`common.schema.json#/$defs/rsvp_row`) gains an optional `run` object: the values used, the `source` (`agent-file` or `project`) and the `reason`. It is present only on a reviewer that ran differently from the session. The same applies to the agent-SDLC ledger's rows.
- **FR-007**: The schema change is additive and bumps the schema's minor version under the existing contract-versioning rule (Q-26). Existing records stay valid.
- **FR-008**: A malformed, unknown-reviewer, unsupported-field or host-rejected exception MUST NOT abort or block a round. The reviewer runs with the session's settings, the problem is stated once to the operator and recorded; it is not put as a question (R-11, R-15).
- **FR-009**: The suite's conformance check (the existing integrity workflow and fitness harness) MUST fail an agent file that has a run field other than `model: inherit` without a reason, and MUST NOT require any run field to be present.
- **FR-010**: Run settings MUST NOT change which reviewer is seated, the RSVP, the vote arithmetic or any invariant; they change only how a seated reviewer is run. No invariant text changes.
- **FR-011**: Baseline persona files MUST carry no project markers; project-specific exceptions live only in the project file (existing contributing rule, restated for this feature).
- **FR-012**: The feature uses Markdown and zero-dependency Node only, relies on Claude Code's native agent fields, and adds no file beyond the existing project file (R-14; no separate roster file).

### Key Entities

- **Exception**: reviewer, field (`model` | `effort` | `tools`), value, reason, plus the place it was declared.
- **Run note** (`run` on a roster row): the effective values for the fields that differed, their source, and the reason.
- **Session settings**: whatever the host session uses; never stored by chorus.

## Success Criteria *(mandatory)*

- **SC-001**: With no exceptions anywhere, a round's dispatches and record are byte-comparable to a pre-feature round apart from the schema version.
- **SC-002**: One exception changes exactly one reviewer's run and is visible in that reviewer's roster row, with its source and reason; no other row changes.
- **SC-003**: A malformed or rejected exception never stops a round (0 aborted rounds across the test cases in User Stories 2 and the edge cases).
- **SC-004**: Retuning a reviewer for one project requires editing only the project file, never an agent file.
- **SC-005**: Every pre-feature record in the repository still validates.

## Out of scope

- **A baseline for every persona** (issue #10 item 1): dropped by Q-33; the session is the baseline.
- **A per-round override by the conductor** (issue #10 item 3): not in the ruling. It would let the conductor spend budget on its own judgement; revisit only if an operator asks to raise one gate in a round, and then as an operator instruction, not a conductor power.
- **A central roster file** (rejected option in Q-33).
- **Tool enforcement or sandboxing**: tools are declared and passed where the host honours them; nothing here claims containment.
- **Memory informing config** (the speculative note in issue #10, aligned with #9): not specified.

## Open questions (resolved in plan, not escalated)

1. Does the Agent dispatch call accept `effort` as well as `model` at dispatch time, and does agent frontmatter accept `effort` and `tools` on the Claude Code versions the plugin supports? The answer fixes which fields FR-005 allows in the project file. If effort is not overridable at dispatch, it is frontmatter-only, like `tools`.
2. Exact home of the resolution step: the dispatch rules in `skill/chorus-review/SKILL.md` (all phases) and the matching step in `skill/chorus-sdlc/SKILL.md`, with the shared wording in `skill/chorus-core` once, so the rule has one owner.

## Assumptions

- Q-33's ruling stands as written: session first, exceptions only, record shows the difference.
- Issue #9's typed result tail is already largely delivered by the JSON replies in PR #32, so this spec adds its field to the existing schema and does not wait on #9.
- The ten current agent files all carry `model: inherit` (verified 2026-10-12).
