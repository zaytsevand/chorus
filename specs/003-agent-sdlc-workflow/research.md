# Phase 0 Research: Agent-SDLC Workflow

All decisions resolve open mechanics in the approved design. No `NEEDS
CLARIFICATION` markers remained from the spec; these entries record the
*how* the plan commits to, with rationale and rejected alternatives.

## D1 — How the orchestrator invokes speckit phases

**Decision**: The SDLC orchestrator is the running Claude Code session. It
drives the lifecycle by sequentially invoking the speckit skills
(`/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`,
`/speckit-implement`) and dispatching persona agents for the gates — exactly the
mechanism the base chorus already uses to dispatch personas. SDLC mode is
procedure authored in `SDLC-LAYER.md`, executed by the session.

**Rationale**: Reuses the existing orchestration model; honors FR-001 (no new
skill, no hook extension). The session already has authority to invoke skills
and agents.

**Alternatives rejected**: A speckit hook extension wired into `extensions.yml`
(rejected by FR-001 — the feedback loop "agents advise → speckit revises" is
orchestration, not a fire-and-forget pre/post hook). A standalone new skill
(rejected — the design develops the *existing* integration layer).

## D2 — Deterministic vote → severity tally mapping

**Decision**: Severity is author-proposed, then moved up or down by a
deterministic, **symmetric** tally of the non-author votes — so convergence can
escalate and pushback can demote:

- Each finding carries an author-proposed severity (🔴/🟡/🟢) with evidence.
- Every **other** seated persona casts one vote on it: `PRIORITIZE` (at least as
  severe as proposed) or `OVER-RATE` (less severe than proposed). Abstention is
  allowed and counts toward neither.
- Let `P` = PRIORITIZE count, `O` = OVER-RATE count among non-author voters, and
  `net = P − O`:
  - **net ≥ +2** → escalate one level (🟢→🟡→🔴, capped at 🔴).
  - **net ≤ −2** → demote one level (🔴→🟡→🟢, 🟢→drop).
  - **|net| < 2** → hold author-proposed. (All-abstain is the `net = 0` case:
    hold and flag "unvoted" in the ledger.)
- Movement is **one level per tally**, regardless of margin (a 4–0 OVER-RATE
  demotes 🔴→🟡, not to nothing — the finding survives in the record).
- A finding is **gating** iff its post-tally severity is 🔴 — full stop. No
  additional judgment clause (S9: the vote is the confirmation).
- The tally is **fully deterministic**: identical votes always yield identical
  severities; there are no tally ties. (Operator tie-breaking applies only to
  cap-5 *seating*, not to the tally.)

**Rationale**: Symmetry encodes the existing chorus rule "two lenses converging
on a concern earn 🔴" (README) — a demote-only draft silently broke it and let
author-under-rated findings through. The ±2 threshold is a clear majority on the
≤ 4-voter panels the cap produces. Determinism keeps judgment out of the
arithmetic (S9); the author proposes but cannot self-confirm (S8). Reuses the
base round's existing "PRIORITIZE / OVER-RATE" Round-2 vocabulary, so the base
round adopts it without a new concept.

**Alternatives rejected**: Demote-only (cannot escalate; breaks convergence→🔴).
A ±3 threshold (needs near-unanimity on a ≤ 4-voter panel; too few escalations).
Numeric averaging (opaque). Single-grader confirmation (the author-grades-self
failure the back-test exposed). An extra "hard-invariant / confirmed-critical"
gating clause (re-introduces orchestrator judgment; violates S9).

## D3 — Extract-record schema and agent type

**Decision**: Stage 1 (Extract) runs read-only `Explore` / general-purpose
agents in parallel over the gate's corpus (spec for Gate A; plan+tasks for
Gate B; code+tests+spec for Gate C). Each emits **structured per-finding
records** — `{artifact, location (file:line), observation, raw_excerpt,
candidate_lens}` — that feed the authors and pre-seed the I8 evidence anchors.
Schema in `contracts/gate-primitive.md`.

**Rationale**: Separates cheap, parallel, read-only discovery from expensive
lens authoring; every downstream finding inherits a `file:line` anchor, which
directly serves the I8 evidence gate (S6).

**Alternatives rejected**: Personas read raw artifacts themselves with no
extract stage (the current base-round behavior — blends discovery with
authoring and gives the orchestrator no structured handle for the tally).

## D4 — Panel-overflow selection (cap of five)

**Decision**: Each RSVP reply carries a self-declared **relevance score 0–3**
for *this* gate. If > 5 personas JOIN, seat the top 5 by score (a mechanical
descending sort on persona-supplied integers). A tie spanning the 5th seat is
surfaced to the operator to break. If < 3 JOIN, apply the existing quorum rule
(re-ping once; abort honestly on the second failure).

**Rationale**: The cap bounds cost without the orchestrator judging lens merit
(S3/I2) — it only sorts persona-supplied numbers.

**Alternatives rejected**: Orchestrator picks the "most relevant" five (violates
I2/S3); operator always picks (needless friction when scores already
disambiguate).

## D5 — Per-feature ledger format

**Decision**: A Markdown ledger at `specs/<feature>/agent-sdlc-log.md`, appended
once per gate execution, with a fixed section schema (RSVP table, findings
register, 🔴 resolution/waiver log, loop-cycle count). Schema in
`contracts/sdlc-ledger.md`. It is the audit trail proving each gate fired
honestly (Dijkstra "validate the procedure").

**Rationale**: Co-located with the feature's spec/plan/tasks (not in
`docs/reviews/`, which is for periodic project-state rounds); plain Markdown so a
reviewer reconstructs the run from the ledger alone (SC-007).

**Alternatives rejected**: One row in the global `docs/reviews/` index (conflates
per-feature lifecycle with periodic project review); a non-Markdown structured
log (not human-reconstructable without tooling).

## D6 — Minimal base-round backport

**Decision**: Backport is minimal and behavior-preserving. `GATE-PRIMITIVE.md`
becomes the canonical four-stage definition; `INTEGRATION-LAYER.md` Phases 1/2/4
are re-pointed to it and gain S8/S9 in the invariant set; `SKILL.md` phase text
is updated to name the stages and to **state authoring is uncapped**. The
current SKILL.md has *no explicit finding-count cap*, but its Phase-1 word limit
(500–700) can act as an implicit cap — clarify that the word limit bounds prose
density, **not** the number of findings.

**Rationale**: FR-016/FR-017/SC-006 require one definition adopted by both
modes, with the base round's user-facing flow preserved.

**Alternatives rejected**: Leaving the base round untouched (the "scope to SDLC
only" option the user explicitly rejected — would create two divergent
definitions and leave the base round vulnerable to author-grades-self).

## D7 — `spec-walkthrough` headless contract

**Decision** (confirmed against the installed skill at
`~/.claude/skills/spec-walkthrough/SKILL.md`): At **Gate C** the orchestrator
invokes it headless — `Skill(skill: "spec-walkthrough", args: "<NNN> headless")`.
The skill writes `<feature-dir>/walkthrough-headless.md` and returns a compact
digest: a traceability matrix keyed by handle, a flat list of every DRIFT and
SURPRISE, a GAP count, and the file path. Its verdict is advisory
(`CLEAN` / `DRIFT-FOUND`), never an acceptance. Each DRIFT/SURPRISE/GAP enters
stage-1 Extract as a record with `source: "spec-walkthrough"`, carrying its
handle and file anchor. It is **not authoritative** (FR-018): a persona must
author it into a finding for it to face the stage-3 vote, and a persona may
contradict it. A DRIFT/SURPRISE that no persona claims is logged in the ledger as
an **unclaimed extract record** (visible, non-gating) so a real spec↔code
divergence cannot silently vanish (I7).

**Gate placement**: Gate C **only**, not Gate B. The skill reconciles the spec
against **code**, and its own "when NOT to use" says not to run it before
`/speckit-plan`; at Gate B (post-tasks, pre-implementation) there is no new code
to reconcile against and it would emit mostly low-signal GAPs. Gate B may invoke
it solely when substantial *pre-existing* code is in scope.

**Rationale**: Reuses an already-documented integration — the skill documents the
`/chorus-review` headless call and positions its output as "prior art the
advisors react to" — so the wiring is confirmed, not invented. The not-gospel
rule is the skill's own stance (its headless verdict is explicitly advisory),
aligning with FR-018/S9.

**Alternatives rejected**: Treating the advisory verdict as a pass/fail gate
(lets a non-persona lens gate the pipeline; violates S9). Running it at Gate B on
a greenfield feature (no code to reconcile; noise). Dropping unclaimed DRIFTs
(silent loss of a real divergence).

## D8 — Incorporation cascade per gate

**Decision**: The spec is the source of truth. Findings are incorporated by
revising the spec and regenerating downstream artifacts via speckit, never by
hand-patching:

- **Gate A**: `/speckit-clarify` → `/speckit-plan`.
- **Gate B**: `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks`.
- **Gate C**: a direct code fix for a code defect, **or** `/speckit-clarify` →
  re-implement when the finding is a spec gap.

Each pass re-runs the gate (loop), bounded at three cycles (S7), then escalates.

**Rationale**: FR-011/S5 — keeps the artifacts derivable from the spec and keeps
authoring out of the orchestrator's hands.

**Alternatives rejected**: Patching plan/tasks directly from findings (drifts the
artifacts from the spec; violates S5).
