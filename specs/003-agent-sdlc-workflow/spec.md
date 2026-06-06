# Feature Specification: Agent-SDLC Workflow

**Feature Branch**: `003-agent-sdlc-workflow`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "Agent-SDLC workflow for spec approval & acceptance.
General shape: (specify) discovery > (agents) review > (agents) scoping >
(specify) findings incorporation > (specify) implementation > (agents)
acceptance" — matured through brainstorming into the approved design at
`docs/superpowers/specs/2026-06-06-agent-sdlc-workflow-design.md`.

## Overview

The chorus integration layer is today a thin, refusal-capable orchestrator
that drives one procedure: a periodic project-state review round. This feature
develops that same layer into a higher-level orchestrator that drives a whole
speckit **spec lifecycle**, interleaving speckit phase-runners (specify, plan,
tasks, implement, clarify) with three scoped **chorus gates** — design review,
plan/tasks review, and implementation review. Each gate is a lightweight,
RSVP-scoped chorus review that blocks the pipeline only on an unresolved
critical (🔴) finding.

It is a new **operating mode** of the existing `chorus-review` skill — not a
new skill and not a speckit hook extension. The same Dijkstra-grounded posture
holds: the orchestrator routes between speckit phase-runners, the personas, and
the operator; it audits that each gate fired honestly; it refuses to author
artifacts or to pass a 🔴 silently.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drive a feature through gated lifecycle review (Priority: P1)

An operator runs a feature through the full lifecycle in one orchestrated
flow. After each speckit phase that produces a reviewable artifact, the
orchestrator convenes the relevant agents, collects their verdict, and either
proceeds (no 🔴) or halts and surfaces the 🔴 for the operator to resolve. The
run leaves behind a per-feature ledger that records what each gate decided.

**Why this priority**: This is the core value — turning a sequence of manual
speckit commands plus ad-hoc reviews into one disciplined, auditable pipeline
where nothing advances past an unresolved critical finding.

**Independent Test**: Invoke SDLC mode on a small feature; confirm the
orchestrator runs specify → plan → Gate A → (incorporation) → tasks → Gate B →
(incorporation) → implement → Gate C, halts when a 🔴 is open, proceeds when
none is, and writes a ledger capturing each gate's outcome.

**Acceptance Scenarios**:

1. **Given** a feature whose plan a panel rates with an open 🔴, **When** Gate A
   tallies its votes, **Then** the orchestrator halts the pipeline, surfaces
   the 🔴, and does not run `/speckit-tasks` until the 🔴 is resolved or
   explicitly waived with recorded rationale.
2. **Given** a gate whose panel returns only 🟡/🟢 findings, **When** the gate
   completes, **Then** the orchestrator records the findings and proceeds to
   the next phase without requiring resolution.
3. **Given** an incorporation loop that has run three cycles without clearing a
   🔴, **When** the third cycle ends still red, **Then** the orchestrator stops
   looping and escalates the decision to the operator.
4. **Given** any artifact change made during a run, **When** the ledger is
   inspected, **Then** every spec/plan/tasks/code change traces to a speckit
   phase-runner invocation, never to the orchestrator authoring it directly.

---

### User Story 2 - Trustworthy gate verdicts via stage separation (Priority: P2)

Each gate produces its verdict through four separable stages run by different
actors — extract, author, vote, tally — so that the agent who files a finding
is never the agent who grades it, and the orchestrator never invents a vote.

**Why this priority**: A back-test showed the verdict lives in this
separation: when one agent both authored and graded, it ranked a new lens dead
last; splitting authoring from a real adversarial vote brought the same lens
mid-pack. Without stage separation the gates produce confident but wrong
verdicts — the feature's gates would be theatre.

**Independent Test**: Run a single gate; confirm extraction produces structured
records with evidence anchors, authoring is uncapped, voting is performed by
seated personas other than each finding's author, and the tally is a
deterministic aggregation of those real votes with no synthesized grade.

**Acceptance Scenarios**:

1. **Given** a finding authored by persona X, **When** the vote stage runs,
   **Then** persona X does not vote on that finding and every recorded vote
   traces to a real seated persona.
2. **Given** a persona authoring findings in a gate, **When** authoring
   completes, **Then** the finding count reflects what the artifact warranted
   and was never clamped to a fixed target.
3. **Given** completed votes, **When** the tally runs, **Then** the 🔴/🟡/🟢
   set is computed deterministically from the votes alone, with no orchestrator
   judgment added.

---

### User Story 3 - One shared gate primitive, no drift (Priority: P3)

The four-stage primitive is defined once and used by both the new SDLC gates
and the existing project-state chorus round, so the two modes cannot diverge in
how a review is conducted.

**Why this priority**: The back-test lesson is about how *any* chorus review
runs. Encoding it in only one place would leave the base round vulnerable to
the same author-grades-self failure and create two definitions of "how a round
runs" that drift apart.

**Independent Test**: Confirm a single canonical definition of the four-stage
primitive exists, that the base project-state round references it (with its
prior finding caps removed), and that running a base round still presents the
same user-facing flow.

**Acceptance Scenarios**:

1. **Given** the codebase after this feature, **When** the gate primitive is
   located, **Then** there is exactly one canonical definition and both the
   base round and the SDLC gates reference it.
2. **Given** a base project-state round, **When** it runs, **Then** it uses the
   shared primitive (no per-author finding cap) while its user-facing flow is
   unchanged.

---

### Edge Cases

- **Too few joiners**: if fewer than three personas RSVP into a gate, the gate
  follows the existing chorus quorum rule (re-ping once; abort honestly on the
  second failure) rather than proceeding with a sub-quorum panel.
- **Too many joiners**: if more than five personas RSVP JOIN, the panel seats
  the top five by persona-declared relevance score; a tie at the cutoff line is
  surfaced to the operator to break, never resolved by the orchestrator judging
  lens merit.
- **Operator waiver of a 🔴**: the operator may waive a 🔴 to proceed; the
  waiver and its rationale are recorded in the ledger (a waived 🔴 is never a
  silently-passed 🔴).
- **Gate C finding that is a spec gap, not a code bug**: incorporation routes
  back through `/speckit-clarify` and re-implement, not a direct code patch.
- **spec-walkthrough contradicted by a persona**: the walkthrough is an input,
  not an authority; a persona may contest it, and its claims face the same
  evidence gate and vote as any finding.
- **A finding lacking evidence**: a finding without `file:line` or a principle
  tag is demoted per the existing I8 evidence gate and excluded from the tally.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workflow MUST be invocable as an operating mode of the
  existing `chorus-review` skill (e.g., "run the agent-SDLC on feature 003"),
  introducing no new skill and no speckit hook extension.
- **FR-002**: The orchestrator MUST drive the lifecycle in order — specify →
  (optional operator clarify) → plan → **Gate A** → incorporation loop → tasks
  → **Gate B** → incorporation loop → implement → **Gate C** → fix loop — and
  MUST NOT merge or skip these steps.
- **FR-003**: The orchestrator MUST NOT author the spec, plan, tasks, or code
  itself; it MUST produce each artifact by invoking the corresponding speckit
  phase-runner. *(invariant S1)*
- **FR-004**: Each gate MUST run as four separable stages — Extract (read-only
  agents produce structured per-finding records carrying `file:line` evidence
  anchors), Author (a seated persona files findings), Vote (seated personas
  vote PRIORITIZE / OVER-RATE in character), Tally (deterministic
  aggregation) — performed by distinct actors.
- **FR-005**: Authoring MUST be uncapped: the workflow MUST NOT impose a
  per-author finding target or quota.
- **FR-006**: The author of a finding MUST NOT vote on that finding; the vote
  stage MUST dispatch to seated personas other than the author. *(invariant S8)*
- **FR-007**: The orchestrator MUST NOT synthesize, predict, or substitute a
  vote or grade; the tally MUST aggregate real persona votes only. *(invariant
  S9)*
- **FR-008**: RSVP MUST fire independently at every gate; a persona's
  JOIN/ABSTAIN at one gate MUST NOT carry to another. *(invariant S2)*
- **FR-009**: A gate panel MUST seat at most five joiners. If more than five
  JOIN, the panel MUST seat the top five by persona-declared relevance score (a
  mechanical sort on persona-supplied 0–3 values), surfacing ties at the cutoff
  to the operator; if fewer than three JOIN, the existing quorum rule applies.
  *(invariant S3)*
- **FR-010**: Each gate MUST halt the pipeline on an unresolved 🔴 finding and
  MUST record 🟡/🟢 findings without halting. The orchestrator MUST NOT pass a
  🔴 silently and MUST NOT override the operator's decision on non-🔴 findings.
  *(invariant S4)*
- **FR-011**: Incorporation MUST treat the spec as the source of truth and
  regenerate downstream artifacts via speckit phase-runners — Gate A: clarify →
  plan; Gate B: clarify → plan → tasks; Gate C: a code fix, or clarify →
  re-implement for a spec gap — never by hand-patching a downstream artifact.
  *(invariant S5)*
- **FR-012**: Each gate's incorporation loop MUST be bounded at three cycles;
  after three cycles without clearing its 🔴, the orchestrator MUST stop and
  escalate to the operator. *(invariant S7)*
- **FR-013**: Every gate finding MUST satisfy the existing I8 evidence gate
  (`file:line`, or a `[principle]` / `[principle:proposed]` tag); findings that
  satisfy neither MUST be demoted and excluded from the tally. *(invariant S6)*
- **FR-014**: The workflow MUST NOT include an acceptance / success-criteria
  verification gate; Gate C MUST review the implementation for code soundness
  (bugs, drift, quality), and the absence of an acceptance gate MUST be
  recorded with its rationale.
- **FR-015**: Each run MUST write a per-feature ledger at
  `specs/<feature>/agent-sdlc-log.md` recording, per gate: the RSVP result
  (joiners, abstainers, relevance scores), the findings register, each 🔴's
  resolution or waiver-with-rationale, and the loop-cycle count.
- **FR-016**: The four-stage primitive MUST have exactly one canonical
  definition, referenced by both the SDLC gates and the base project-state
  round.
- **FR-017**: The base project-state chorus round MUST adopt the shared
  primitive — removing any per-author finding cap and conducting authoring,
  voting, and tally per the primitive — while preserving its existing
  user-facing flow.
- **FR-018**: The `spec-walkthrough` reconciliation MUST be wired as a fixed
  viewpoint at **Gate C**, fed to the panel as one Extract input; it MUST NOT be
  treated as authoritative — its claims face the same evidence gate and vote as
  any finding, a persona may contradict it, and a DRIFT/SURPRISE no persona
  claims MUST still be logged as an unclaimed record. (Gate B invokes it only
  when substantial pre-existing code is in scope to reconcile against.)

### Key Entities

- **Gate**: a scoped chorus review at a lifecycle checkpoint (A = design,
  B = plan/tasks, C = implementation). Attributes: placement, expected
  attendees, four stages, block-on-🔴 outcome.
- **Gate primitive**: the four-stage mechanic (extract → author → vote →
  tally) shared by the base round and all SDLC gates; the single definition
  of how a review is conducted.
- **Finding**: a record authored by one persona about one artifact. Attributes:
  authoring lens, evidence (`file:line` or principle tag), proposed severity,
  and the vote tally that confirms or demotes it.
- **Relevance score**: a persona-declared 0–3 value, supplied in its RSVP
  reply, expressing how load-bearing its lens is for *this* gate; used only to
  seat the panel when more than five join.
- **SDLC ledger**: the per-feature audit artifact at
  `specs/<feature>/agent-sdlc-log.md` proving each gate fired honestly.
- **SDLC invariants (S1–S9)**: the audit rules extending the existing I1–I8;
  S1–S7 bind the SDLC orchestrator, S8–S9 bind the gate primitive (and thus the
  base round too).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For any completed run, 100% of spec/plan/tasks/code changes trace
  to a speckit phase-runner invocation recorded in the ledger; zero artifacts
  are authored by the orchestrator.
- **SC-002**: No gate is ever recorded as passed with an open 🔴; every gate
  entry in the ledger shows either zero open 🔴 or an explicit operator waiver
  with rationale.
- **SC-003**: In every gate, zero findings are voted on by their own author,
  and 100% of recorded votes trace to a real seated persona (no synthesized
  grades).
- **SC-004**: Authoring finding counts vary with the artifact under review
  rather than converging on a fixed number — demonstrating no per-author cap.
- **SC-005**: On the constraint-and-flow back-test corpus, the lens that was
  ranked last under author-grades-self is no longer ranked last under the
  separated pipeline — the separation measurably changes the verdict.
- **SC-006**: Exactly one canonical definition of the four-stage primitive
  exists; both the base round and the SDLC gates reference it (no second copy).
- **SC-007**: A reviewer can reconstruct, for each gate, who joined, what was
  found, how each 🔴 was resolved, and how many loop cycles ran, using the
  ledger alone — without consulting any other artifact.
- **SC-008**: No gate panel ever exceeds five seated personas, and the overflow
  selection is reproducible from the recorded relevance scores.

## Assumptions

- **Operator-driven, human-in-the-loop.** SDLC mode runs inside Claude Code at
  the operator's direction; it is not an unattended CI job. The operator holds
  sign-off (level N+1) at every gate.
- **Severity mapping.** A finding's 🔴/🟡/🟢 severity is its author-proposed
  severity as confirmed or demoted by the deterministic tally of the vote
  (PRIORITIZE confirms/raises, OVER-RATE demotes); the exact mapping is settled
  in planning. A 🔴 corresponds to a violated hard invariant or a finding the
  panel confirms as critical.
- **Reuse of the existing roster and RSVP.** SDLC mode consumes the existing
  nine-persona roster plus opt-in language lenses through the existing RSVP
  mechanism; no persona file is added or rewritten by this feature.
- **Reuse of `advisor()`.** Conflict arbitration within a gate and a final
  sanity pass use the existing `advisor()` role; it is never a substitute for
  persona work, ranking, or the orchestrator's refusals.
- **Loop bound and panel cap are defaults.** N = 3 cycles and a 5-seat cap are
  the defaults; whether the operator may override them per run is a planning
  detail, not a scope question.
- **One feature at a time.** A single SDLC run drives one feature; parallel
  runs across features are out of scope.
- **Authoritative design source.** The approved design at
  `docs/superpowers/specs/2026-06-06-agent-sdlc-workflow-design.md` governs any
  ambiguity not resolved here.

## Out of Scope

- No automated CI/CD integration; no unattended execution.
- No acceptance / success-criteria verification gate (see FR-014).
- No change to the persona roster or to any individual persona file.
- No parallelization of SDLC runs across multiple features.
