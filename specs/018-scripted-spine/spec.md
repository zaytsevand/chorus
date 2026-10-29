# Feature Specification: Scripted Spine — the conductor as a program

**Feature Branch**: `worktree-scripted-spine` (stacked on `coryphaeus-into-core`)

**Created**: 2026-10-28

**Status**: Implemented (stage 1)

**Input**: "Spec and build a scripted spine for chorus to work. Enforce data
contracts, enums, etc. Validate that we're not using hand-rolled magic strings
in different parts of the app. Build a test system for it. Make orchestrator
more a script than an agent: it's already mechanical, and shall stay so."

## Outcome & Stage-1 proof

- **Primary outcome.** Every mechanical step of a chorus round or SDLC gate —
  seating, quorum, retry/abstain, who votes on what, NEED_INFO hold, the Stage-4
  tally, gate cycles and bounds, record assembly — is computed by one program
  (`skill/chorus-core/bin/conduct.mjs`) from an append-only run log. The agent
  that runs the round keeps only what a program cannot do: dispatch personas,
  put questions to the operator, frame conflicts, score the ranking, run speckit.
- **Stage-1 proof slice.** A scripted end-to-end round (fixture replies, no
  model) driven through `conduct` produces a `review-record` that the existing
  validator accepts and the renderer renders; the same for a three-gate SDLC
  ledger including a self-heal cycle and a bound-reached halt.
- **Stage boundary.** Out of this stage: running personas from the script
  (dispatch needs the agent's `Agent` tool), the exploratory interview's content,
  migrating old records, and any change to the canon's rules. The script
  implements the canon as written; it does not change what a round decides.

## Clarifications

### Session 2026-10-28 (assumptions taken without a live round-trip; operator may override)

- Q: Where does the orchestrator code live? → A: **chorus-core/bin**, beside the
  validator and renderer. A parallel branch (`coryphaeus-into-core`) folds
  coryphaeus into chorus-core; this feature stacks on it.
- Q: How does the agent talk to the script? → A: a CLI loop. `conduct next`
  prints one action as JSON; the agent performs it and feeds the result back
  with `conduct submit` / `conduct fail` / `conduct answer`. The loop repeats
  until the action is `done` or `halt`.
- Q: Where is run state? → A: an append-only run log, `<stem>.run.json`, next
  to the record (`docs/reviews/` for a round, `specs/<feature>/` for SDLC). The
  state is a pure function of the log (`derive`), so the record is reproducible
  and the log is the audit trail that "each gate fired honestly". Commit it.
- Q: Where is the single home of every closed vocabulary? → A: a new
  `schema/vocab.schema.json`. Record schemas `$ref` it; `bin/vocab.mjs` exposes
  it to code. No inline `enum` elsewhere; no bare vocabulary literal in code.
- Q: Ranking is "drafted by the conductor" — is that scripted? → A: the
  *scores* (cost, value, ROI) and the *order* stay agent input. Everything else
  in a top-five row (pull-quote, locator, final severity, convergence) is
  filled by the script from the register and tally, so the conductor can no
  longer paraphrase a quote or re-state a severity (I6, S9 made structural).
- Q: NEED_INFO routing — "peer when another seated persona can supply" is a
  judgment. → A: mechanical default (catalog row 14, 🟡): peer provision first
  (ask every seated non-raiser, non-author), operator provision if no peer
  supplies. The finding stays held if neither closes the gap.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — The agent runs a round by following the script (P1)

The agent calls `conduct init review …`, then loops on `conduct next`. Each
action names what to dispatch to whom, with which reply kind; every reply goes
through `conduct submit`, which validates it and records it. The script decides
seating, quorum, retries and abstentions, the vote fan-out (excluding each
author), held findings, and the tally; at the end `conduct record` writes the
validated `review-record` JSON and its rendered page.

**Acceptance**:
1. Given six JOIN replies with a strict order at the fifth seat, the script
   seats five, records band 🟢, and dispatches Round 1 only to the five.
2. Given two JOINs, the script re-asks all abstainers once; still below three,
   the action is `halt` with the abort recorded (I3).
3. A reply that fails validation produces a `retry` action carrying the
   validator's reason; a second failure records the persona ABSTAIN with an
   `abstention` recovery (CONDUCTOR § Ports).
4. A vote report that votes on its own finding is refused (S8) even if the
   persona omitted the finding from `own_findings` — the script knows authors.
5. The record the script writes validates with zero errors.

### User Story 2 — An SDLC run is a sequence of scripted gates (P1)

`conduct init sdlc --feature 0NN` drives Gate A → B → C → memory update. After a
gate's tally, a gating 🔴 yields `incorporate` (the gate's speckit cascade) while
`cycle < 3`, and `ask-operator` with result `bound-reached` at cycle 3. A
challenge run is one premise gate.

### User Story 3 — No hand-rolled magic strings (P1)

A test fails when (a) any schema other than `vocab.schema.json` declares an
inline `enum`, (b) code under `chorus-core/bin` spells a vocabulary member as a
string literal instead of importing it from `vocab.mjs`, (c) any skill or agent
markdown spells a vocabulary member in a near-miss form (`OVER_RATE`,
`need-info`, `minority_report`, `Bound-Reached`), or (d) the persona roster in
`vocab.schema.json`, `.claude-plugin/plugin.json` and `agents/` disagree.

### User Story 4 — The orchestrator has its own test system (P1)

Unit tests cover each pure rule (seating, quorum, voters, tally, held,
minority, gate outcome); scenario tests replay fixture run logs end to end and
assert the action sequence and that the produced record validates; a
determinism test replays the same log twice and compares bytes.

### Edge Cases

- Exceptional entries with a duplicate uncovered delta: only the first seats.
- A persona not installed: ABSTAIN with no retry (failure `not-installed`).
- A finding with exactly one non-author voter: minority report.
- All voters abstain on a finding: unvoted, non-gating.
- An R2- derived finding: ungraded, never voted, never gating.
- A finding with no evidence: registered `unsupported`, outside vote and tally.
- A finding-report that only returns gate questions (S10): the script asks the
  operator (at most four per call) and re-dispatches that persona with answers.
- Version mismatch on a reply: reported once, not charged to the persona.
- A submit for a persona or phase the script did not ask for: refused.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** `vocab.schema.json` is the single home of every closed vocabulary
  the suite uses (severities, votes, RSVP decisions, failure kinds, tally
  status and movement, ports, recoveries, side-note regimes, gate ids and names,
  gate results, quorum branches, record kinds, modes, conductor actions and
  phases, invariant ids, the default persona roster).
- **FR-002** Record schemas reference vocabularies by `$ref`; an inline `enum`
  outside `vocab.schema.json` fails the lint.
- **FR-003** `bin/vocab.mjs` exposes each vocabulary as a frozen list and a
  frozen name→value map; all code imports from it.
- **FR-004** Code-literal lint: in `chorus-core/bin/*.mjs` (other than
  `vocab.mjs`), a string literal equal to a member of a distinctive vocabulary
  fails the lint. Generic words that are also ordinary English (`high`, `open`,
  `pass`) are checked by position (a comparison or property value against a
  vocabulary-typed field) rather than everywhere — see Assumptions.
- **FR-005** Prose lint: a token in skill or agent markdown that normalizes
  (case, `-`/`_`/space) to a vocabulary member but is spelled differently fails.
- **FR-006** Roster sync: `vocab` roster = `plugin.json` agents = `agents/*.md`
  names.
- **FR-007** `bin/engine.mjs` holds the mechanical rules as pure functions:
  seating, quorum, register-from-reports, voters-for-finding, tally (moved from
  the validator, which imports it), board tally, held list, ranking
  eligibility, gate outcome, mechanical side-notes.
- **FR-008** `bin/conduct.mjs` CLI: `init`, `next`, `submit`, `fail`, `answer`,
  `status`, `record`. State = `derive(runLog)`; action = `next(state)`.
- **FR-009** Every submitted reply is validated (`validate.mjs`) against the
  kind the current phase expects before it is logged; every agent input
  (`answer`) is validated against the schema fragment it fills.
- **FR-010** `conduct record` assembles the record from state, validates it,
  refuses to write an invalid one, and renders the page.
- **FR-011** The procedure docs (chorus-review, chorus-sdlc) tell the agent to
  run the loop; the mechanical rules stay defined once in the canon, and the
  script cites the section it implements.
- **FR-012** Tests run with `node --test skill/chorus-core/test/*.test.mjs`
  (CI already globs it). Zero dependencies; Node 18+.

### Key Entities

- **Run log** — `{kind: "run-log", schema_version, mode, header, events[]}`;
  events are `reply`, `failure`, `answer`, `ack`. Append-only.
- **Action** — `{action, phase, …}`: `dispatch`, `retry`, `ask-operator`,
  `frame-conflicts`, `rank`, `incorporate`, `run-skill`, `signoff`, `done`,
  `halt`.

## Success Criteria *(mandatory)*

- **SC-001** Scenario fixtures for a review round and an SDLC run produce
  records that validate with zero errors and render.
- **SC-002** Replaying a run log twice yields byte-identical records.
- **SC-003** `grep`-equivalent lint finds zero hand-rolled vocabulary literals
  in `chorus-core/bin` and zero inline enums outside `vocab.schema.json`.
- **SC-004** The quorum-branch drift between `review-record` and `sdlc-log`
  (and any other drift the lint finds) is resolved or explicitly mapped.
- **SC-005** All existing tests keep passing.

## Assumptions

- Generic vocabulary members (`high`, `low`, `open`, `pass`, `A`/`B`/`C`) appear
  in ordinary code as English; the code lint treats only distinctive members
  (contain an uppercase run, an emoji, or a hyphenated compound) as always
  forbidden, and the rest via `vocab.mjs` usage in engine/conduct by review.
- The two quorum-branch spellings are distinct record vocabularies today
  (round vs gate); unifying them changes schema major, so this feature names
  both in the registry and leaves unification to a later major.
- Existing validator messages and exit codes are unchanged.
- A side-note regime the canon names but the schema lacked (no security lens
  where trust is server-bound) is added as `missing-trust-lens` — additive, so
  schema major 1 holds.

## Known limits (recorded, not fixed in this stage)

- If more than five join and a seated joiner later fails (author or vote), the
  out-seated JOIN rows remain while the final JOIN count can drop to five; the
  validator's "joined but not seated" rule then fires. The script and the rule
  disagree only in that corner.
- S11 resolution makes one provision attempt per route; a re-vote that raises
  NEED_INFO again leaves the finding held. (Resolved 2026-10-29: held findings
  are now revised in one dispatch and re-voted on one ballot.)
- The self-audit's S1, S9 and S10 rows pass by construction of the loop (the
  script authors nothing and counts only logged, validated votes); they are not
  independent evidence that the calling session never hand-edited an artefact.
