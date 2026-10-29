# Feature Specification: Per-reviewer run settings through the host's own agent files

**Feature Branch**: `017-per-reviewer-run-settings`

**Created**: 2026-10-12

**Status**: Draft. Specified only; **do not build yet** (R-16: wait with the development of Q-32 / Q-33).

**Input**: GitHub issue #10 ("Per-persona runtime config layer (model / effort / tools), separate from the persona canon"), as narrowed by brief ruling Q-33 ("Reviewers run as the session does, unless deliberately changed"), R-14 (Claude Code only; Markdown + zero-dependency Node; no runtime services) and R-15 (one sensible answer: do not escalate it).

> **Departures from the issue.** Issue #10 proposed a config layer chorus reads and applies (baseline for every persona, project overlay, per-round override). The 2026-10-12 walkthrough replaced it with **no chorus mechanism at all**: in Claude Code the agent file is the source of truth, so a per-project retune is a project-level agent file of the same name, resolved by the host. Chorus writes the recipe down and checks that its own steps work. Everything about which agent file the host picks is the host's job.

## Clarifications

### Session 2026-10-12

- Q: When an update finds a locally changed run setting, how does the user consent to overwrite? → A: `--force` only. *Moot after the entries below: there is no run setting in a chorus-shipped file to protect.*
- Q: Where do exceptions live? → A: One place, the project file. *Superseded by the next entry.*
- Q: How should a per-project retune work in Claude Code? → A: **Native only.** Operator: "No duplicates in tables that conductor reads. Just the files. Conductor is a machinery and doesn't know how to finetune the parts. It's not his job." A retune is a project-level `.claude/agents/<name>.md` of the same name. Chorus adds no table, no dispatch logic, no record note, and no schema, validator, renderer or installer change.
- Q: Does chorus solve project-versus-global override conflicts? → A: **No.** Operator: "don't try to solve a project-level override issues. If a user chose to have both global and prj installs, it's not our responsibility anymore. We rely on the Claude Code to properly pick the right agent, and our settings are piggy-backing to CC being good at ITS part of the job." Chorus does not test or re-document the host's agent resolution; the recipe cites the host's own documentation for it. The only check is that the recipe's own steps work once.
- This narrows Q-33 twice: exceptions are not written in `CHORUS-PROJECT.md`, and **the review record no longer shows which reviewer ran differently** (it would need the conductor to know). Both are recorded here because the brief is retired.

## Motivation

Every reviewer runs on the session's model and effort with the same tools. Someone using the published plugin (Q-19) cannot retune one reviewer for their project without knowing the host's mechanism. The host already has one: an agent file placed in the project. Nobody has written that down for the chorus.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Nothing written, nothing changes (Priority: P1)

An operator who retunes nothing gets exactly today's behaviour: every reviewer runs with the session's model, effort and tools.

**Why this priority**: It is the default and the regression guard.

**Independent Test**: This feature adds no code, so the test is that no shipped file changes behaviour: the diff touches only documentation.

**Acceptance Scenarios**:

1. **Given** no project-level agent file for any chorus reviewer, **When** a round is dispatched, **Then** every reviewer runs as today.
2. **Given** the merged change, **When** its diff is read, **Then** no agent file, skill canon, schema, validator, renderer or installer file is modified.

---

### User Story 2 - Retune one reviewer for one project (Priority: P1)

An operator follows a short written recipe, puts a changed copy of one reviewer's agent file in their project's `.claude/agents/`, and the next round runs that reviewer with the new settings.

**Why this priority**: This is the feature: the retune that today needs a fork of the plugin.

**Independent Test**: Follow the README recipe once in this repository for one reviewer (a different `model` or `effort`); dispatch that reviewer; confirm it ran with the changed value. This checks our recipe, not the host.

**Acceptance Scenarios**:

1. **Given** the recipe followed for one reviewer, **When** the round dispatches that reviewer, **Then** it runs with the changed setting and the other reviewers run as the session does.
2. **Given** a changed `tools` list in the copy, **When** dispatched, **Then** the reviewer has that tool list (the dispatch call cannot set tools; the file can).

*Host behaviour the recipe relies on is the host's, cited from its documentation and not tested here: which file wins for a name, that the project copy replaces the whole file, that unknown frontmatter keys are ignored, and that the installer writes only under the Claude home.*

---

### User Story 3 - A person can find and follow the recipe (Priority: P2)

Someone who wants to retune a reviewer finds one short section that says what to do, what to change, what not to touch, and what it costs.

**Independent Test**: A reader with only the README can perform Story 2 without opening any other file.

**Acceptance Scenarios**:

1. **Given** the README, **When** a reader looks for how to change a reviewer's model, effort or tools for one project, **Then** one section answers it, including the cost statement.
2. **Given** the `chorus-learn` tutorial, **When** it reaches project setup, **Then** it points to that section and does not restate it.

### Edge Cases

- **A copy forks the persona.** The copy replaces the whole file, so the reviewer's voice, gates and calibration stop receiving plugin updates, and the chorus installer does not update it. The recipe says so, tells the reader to change only the frontmatter keys `model`, `effort`, `tools`, and to re-compare the copy with the shipped file after a plugin update. This is the accepted cost of "just the files".
- **Which agent file the host picks, and global versus project installs.** The host's job (see Clarifications). The recipe links the host's documentation and says nothing more.
- **Reviewer name.** The copy must carry the same `name` as the shipped agent; the recipe says so in one line and links the host documentation.
- **Host version.** `effort` depends on the host version; the recipe names the version the smoke check ran on.
- **Other hosts.** The recipe is Claude Code only (R-14). A host with a different mechanism needs its own recipe; nothing in the canon changes.
- **Record visibility.** The review record does not show that a reviewer ran from a project copy. Out of scope (below).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Chorus MUST NOT read, apply, record, validate or resolve any per-reviewer run setting. No table, dispatch rule, record field, schema, validator, renderer or installer change is made for this feature.
- **FR-002**: The shipped agent files stay unchanged (`model: inherit`); no baseline values are added.
- **FR-003**: A single section in `README.md` ("Retuning a reviewer for one project") MUST give the recipe: copy the shipped agent file to the project's `.claude/agents/` under the same name; change only the frontmatter keys `model`, `effort`, `tools`; keep the body; write the reason as a comment in the file; re-compare with the shipped file after a plugin update.
- **FR-004**: The section MUST state the cost plainly: the copy replaces the whole file, forks the persona, and the chorus installer will not update it.
- **FR-005**: `skill/chorus-learn` MUST point to that section where it covers project setup, and MUST NOT restate it (cite, never restate).
- **FR-006**: For anything about how the host chooses or loads an agent file (precedence, whole-file replacement, unknown keys, global versus project), the section MUST link the host's own documentation and MUST NOT restate, test or add to it.
- **FR-007**: The recipe's own steps MUST be followed once on this repository (T001) and the result recorded in `research.md` with the host version, so the README does not publish a recipe that has never been run.

### Key Entities

- **Project-level agent file**: a copy of a shipped reviewer in the project's `.claude/agents/`, same `name`, changed frontmatter.
- **Recipe section**: the README section described in FR-003 and FR-004.

## Success Criteria *(mandatory)*

- **SC-001**: The change's diff contains only `README.md`, `skill/chorus-learn` text and this feature's spec files (no code, no canon, no agent files).
- **SC-002**: Following the recipe once in this repository produces a reviewer that runs with the changed setting (recorded in `research.md` with the host version).
- **SC-003**: A reader can perform the retune from the README section alone.
- **SC-004**: The README section makes no claim about host agent resolution beyond a link to the host's documentation.

## Out of scope

- **Any chorus-side config layer**: baseline, project table, conductor lookup, per-round override, central roster file, installer protection.
- **Resolving project-versus-global conflicts or telling the user which file is in force.** The host's job.
- **Showing the difference in the review record** (Q-33's third clause). It would need the conductor to know about run settings. Revisit only with a source that is not the conductor.
- **Keeping a project copy current.** No staleness check or merge tooling (R-7: dogfooding catches stale installs).
- **Tool enforcement or sandboxing**; **memory informing config**; **other hosts**.

## Open questions (resolved in plan, not escalated)

1. Where in the README the section sits, and whether `chorus-learn` has a project-setup step to point from (T002 reads both first).

## Assumptions

- The host documentation (code.claude.com/docs/en/sub-agents.md, read 2026-10-12) says what the recipe links to; chorus relies on it.
- Chorus dispatches reviewers by agent name, so the host's own resolution applies with no chorus change.
- Issue #9 is closed; nothing about record fields is touched here.
