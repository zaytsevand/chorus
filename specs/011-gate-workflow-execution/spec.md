# Feature Specification: Gate Execution on a Native Workflow Substrate

**Feature Branch**: `011-gate-workflow-execution`

**Created**: 2026-06-16

**Status**: Draft (rev 2 — Gate A 🔴 incorporated)

## Context

A chorus gate is four deterministic stages — **extract → author (uncapped) → vote →
tally** (`GATE-PRIMITIVE.md`). Today the orchestrator runs them by hand-dispatching `Agent`
calls and tallying in prose. This feature adds a **second execution substrate** for the
gate's mechanical core: a native Claude **Workflow** runner that fans out the Author and Vote
stages and computes the tally in code, returning structured results the orchestrator persists.

This is **not a new gate definition**. The gate's meaning lives once in `GATE-PRIMITIVE.md`
(Principle I); the runner is an alternative *executor* that MUST be tally-equivalent and
**conformance-locked** to that prose. The motivation is twofold, in priority order:

1. **The honesty invariants become structural, not disciplinary.** A Workflow script only runs
   JS and dispatches `agent()`s — it **cannot author a finding or cast a vote**. So S1
   (orchestrator authors nothing) and S9 (never synthesizes a vote) are enforced by the
   substrate, and the tally (`net = P − O`) is literal arithmetic in code (Principle II/III).
2. **Parallel fan-out** of authors/voters with schema-validated returns (secondary — at chorus
   scale this buys modest wall-clock; the load-bearing value is #1).

### Characteristic ranking (the bar this spec optimizes — stated, per Gate A R-F1)

Internal developer tooling for the chorus itself: single operator, no production traffic, no
SLA. Ranked: **(1) decision-integrity / tally-equivalence, (2) honesty-by-construction
(S1/S8/S9), (3) operability & diagnosability, (4) evolvability (lockstep with the prose
primitive)**. Raw parallelism is explicitly subordinate. When characteristics conflict, the
runner optimizes the higher-ranked one.

### Scope: two slices (Principle IX — Gate A CF-5)

Gate A found the original single-slice spec over-reached: it specced the riskiest, least-justified
machinery (self-heal, extract short-circuit) *before* the parity experiment that would justify it.
Resolved by splitting:

- **Slice 1 — the parity-experiment slice (THIS spec, P1).** Author → Vote → Tally only, with the
  decision-integrity guards. This is the thinnest probe that retires the recorded prior
  "orchestration strictly negative" verdict (SC-001). It writes **no files** and edits **no
  artefacts** — it reads a brief, fans out, computes, returns.
- **Slice 2 — deferred behind a PASSED SC-001 (out of scope now; obligations recorded below).**
  The optional Extract pre-pass + its short-circuit policy, and the self-heal re-verify loop.
  Slice 2 is not specced here; its known obligations (CF-4, CF-11) are parked in "Deferred
  obligations" so they are not lost.

### The hybrid boundary (affirmed at Gate A — Cooper/Richards)

ALL **operator-in-the-loop** points — the project-addendum / scope-exclusion confirmation, the
exploratory operator interview, the **🔴 hard-block + instant operator ask**, and gate sign-off —
**stay inline in the orchestrator**. A background Workflow cannot prompt the operator (Principle
VI/VII); these are kept inline, never degraded into auto-decisions. The orchestrator scouts inline,
invokes the runner for the fan-out, then resumes inline to adjudicate any banded outcome.

### Constitution & canon check (Principle I — cite, never restate)

- **Authoring Constraints (constitution, amended 2026-06-16, Gate A CF-8)** — a Workflow runner
  is now an enumerated third executable surface, **bounded**: it carries no gate *meaning*
  (severities/thresholds/banding stay single-sourced in canon) and owns no wall-clock/RNG/direct
  filesystem writes. This spec is the feature that amendment admits; the amendment is subject to
  its own review.
- **Gate primitive (`GATE-PRIMITIVE.md`: extract → author → vote → tally; S1/S8/S9)** — reused
  verbatim as the contract the runner must satisfy. No new stage, severity, or threshold.
- **Decision banding (`DECISION-PRIMITIVE.md`; Principle VI/VII)** — the runner emits banded
  outcomes as **data**; it never performs a 🔴 block or a 🟡 operator-ask itself.

### Gate A resolution (2026-06-16) — 9 🔴 incorporated

Gate A (8-lens chorus; ledger in `agent-sdlc-log.md`) did not clear. Resolutions, by theme:

- **Band integrity (CF-1, CF-2, CF-3, CF-16)** — added FR-004a (conformance fixture, thresholds
  cited from canon not transcribed), tightened SC-001 to the **deterministic tally tail** (the
  escape hatch is gone), added FR-007 (fail-closed default), FR-004b + SC-007 (re-derive-band
  consistency check).
- **Self-heal is risky + misplaced (CF-4, CF-5)** — deferred to Slice 2; CF-4's integrity
  requirement recorded as a Slice-2 obligation.
- **Operational opacity (CF-6, CF-7)** — FR-013 (per-agent transcript handle in the return) and
  FR-006a (barrier timeout bound + recorded `stage-timeout`).
- **Honesty by assertion not inspection (CF-12)** — FR-003a (executable S8 unit assertion) + SC-002.
- Held 🟡 folded cheaply: CF-9 (return modeled finding-centric on canon shapes, FR-008), CF-15
  (SC-006 scoped to bands, not bytes). Demoted 🟢 by the tally and left as-is: CF-10 (the runner
  *should* compute the band from fixed thresholds — Principle III), CF-14 (framing; already gated).

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A gate's Author/Vote/Tally runs on the Workflow substrate (Priority: P1)

The orchestrator has seated a panel and built the brief. It invokes the runner with the brief +
corpus locators. The runner fans out one author `agent()` per seated lens (uncapped findings,
schema-validated to the canon finding shape), routes each finding to voters **excluding its own
author** (S8), fans out the Vote stage, computes `net = P − O` per finding in code, applies the
canon thresholds, and returns a **finding-centric** structure (each finding carries its votes,
tally, post-tally band, evidence, pull_quote, and a per-agent transcript handle). The orchestrator
re-derives each band from the returned votes as a consistency check, then persists the ledger.

**Acceptance:** for a frozen `{findings, votes}` fixture the runner's per-finding band equals the
canon band table for 100% of cases (SC-001); the orchestrator authored no finding and synthesized
no vote (structural); the re-derived bands match the runner's (SC-007).

### User Story 2 — Fault isolation preserves quorum; a hung stage is bounded (Priority: P1)

One author subagent dies: it resolves to `null`, is filtered, **recorded as a gap** in the return,
and the remaining lenses proceed — quorum-tolerant down to a declared floor (≥3 surviving authors,
mirroring seating; below the floor the runner returns `quorum-failed`, not a hollow gate). A *hung*
(not dead) author cannot hold the barrier indefinitely: a per-stage timeout yields a recorded
`stage-timeout` the orchestrator surfaces.

**Acceptance:** an injected Author/Vote failure yields a recorded `null`-gap and a completed gate
(if quorum holds); below-floor yields `quorum-failed`; an injected hang yields `stage-timeout`. 0
silent drops.

### User Story 3 — A gating 🔴 is never silently released (Priority: P1)

A finding's terminal band is missing/`null` (its vote agent errored). The runner does **not** treat
absence as a pass: any finding without an explicit non-🔴 band is returned as **gating**. The
orchestrator, inline, performs the 🔴 ask. Only an explicit non-🔴 band releases a finding.

**Acceptance:** an injected null terminal band is returned gating, not cleared; sign-off is blocked
inline until the operator adjudicates (Principle VII).

### Edge Cases

- **Operator decision inside the script** — impossible by construction (no operator channel). Any
  decision requiring the operator is returned as data; the orchestrator acts inline.
- **Non-determinism leak** — `Date.now()` / `Math.random()` are unavailable in scripts; the gate
  date and run identifiers are passed via `args`. The runner's bands are deterministic given fixed
  `{findings, votes}` even though agent *prose* is not (SC-006 is scoped accordingly).
- **Author grading own finding (S8)** — script-side filter, backed by an executable unit assertion
  (FR-003a), not reviewer inspection.
- **Tally divergence** — if the runner's tally ever disagrees with the canon table on the same
  inputs, the conformance fixture (FR-004a) fails CI; the gate primitive is the single source of
  truth (Principle I/VIII).
- **Runner writes nothing** — in Slice 1 the runner and its agents perform no file writes and no
  artefact edits; the orchestrator persists the ledger inline.

## Requirements *(mandatory)*

### Functional Requirements — Slice 1

- **FR-001**: Provide a Workflow runner for the gate primitive's **Author → Vote → Tally** stages
  that is **tally-equivalent** to the canon definition on identical inputs. No new stage, severity,
  or threshold (Principle I).
- **FR-002**: Dispatch **one author per seated lens** (uncapped findings); return findings
  schema-validated to the **canon finding shape** `{id, lens, evidence (file:line or [principle]),
  proposed_severity, pull_quote}` (`GATE-PRIMITIVE.md`), not a reduced shape.
- **FR-003**: Route each finding to voters **excluding its author** (S8); fan out a schema-validated
  PRIORITIZE / CONFIRM / OVER-RATE ballot.
- **FR-003a (executable S8 — CF-12)**: Ship a unit assertion (pure code over data, no `agent()`)
  that **no finding appears on its author's ballot**. S8/S1/S9 are enforced by test, not by
  reviewer inspection.
- **FR-004**: Compute `net = P − O` per finding **in code** and apply the escalate (`≥+2`) / demote
  (`≤−2`) / hold (`|net|<2`), one-level-per-tally rules from `GATE-PRIMITIVE.md` deterministically
  (Principle III). The orchestrator MUST NOT re-tally or override the arithmetic.
- **FR-004a (conformance fixture — CF-1)**: The canon band thresholds MUST reach the code as **cited
  data**, not hand-transcribed literals; and a **frozen-vote conformance fixture** derived from the
  `GATE-PRIMITIVE.md` band table MUST run in CI against the runner's tally on **every change to the
  runner or the primitive**, so the two cannot silently drift (spec 009 proved the primitive moves).
- **FR-004b (consistency check — CF-16)**: The orchestrator MUST **re-derive** each finding's band
  from the returned `votes[]` and assert it equals the runner's claimed band before persisting. This
  is a verification of the runner's own arithmetic against its own data — distinct from the re-tally
  forbidden by FR-004. The orchestrator's re-derivation MUST read the **same cited canon thresholds**
  as FR-004a (not a second transcribed copy), so the single-source invariant holds across executor
  *and* auditor (Gate A re-verify, Richards).
- **FR-005**: No code path by which the orchestrator-as-script authors a finding or casts/synthesizes
  a vote (S1/S9) — structural; asserted in the conformance surface.
- **FR-006 (fault: isolate — CF-6)**: Author and Vote stages are **fault-isolating** — a dead/skipped
  subagent resolves to `null`, is filtered, and is **recorded as a gap** in the return (never silently
  dropped). Quorum is tolerated down to a **declared floor (≥3 surviving authors)**; below the floor
  the runner returns `quorum-failed`.
- **FR-006a (barrier latency bound — CF-7)**: Each fan-out stage MUST carry a per-stage timeout. On
  exceed, the runner returns a recorded `stage-timeout` outcome naming the unresponsive agent(s); a
  hung author cannot hold the gate indefinitely. (The run is non-interruptible by the operator mid-flight;
  the timeout is the bound that substitutes for an abort.)
- **FR-007 (fail-closed default — CF-3)**: Only an **explicit non-🔴 band** releases a finding. Any
  finding whose terminal band is `null`/absent/missing MUST be returned as **gating**. The absence of a
  clear is never a clear (Principle VII).
- **FR-008 (return = Published Language — CF-9)**: The return MUST be modeled on the canon shapes **by
  reference** — **finding-centric**: each finding carries its `votes[]`, its `tally` (`P`,`O`,`net`),
  its post-tally `band`, its `evidence`, its `pull_quote` (returned verbatim, never paraphrased by the
  orchestrator), plus recorded `gaps[]` and a per-agent transcript handle (FR-013). Not five loose
  parallel arrays the orchestrator must re-correlate (re-correlation is re-authoring → an S1 leak).
- **FR-009 (operator boundary)**: All operator-in-the-loop decisions stay in the inline orchestrator.
  The runner surfaces any such decision as **data**, never attempts it, never auto-resolves a 🔴/🟡.
- **FR-010 (determinism)**: No `Date.now()`, `Math.random()`, or argless `new Date()`. Timestamps, run
  identifiers, and the ledger date are passed via `args`.
- **FR-011 (no direct writes)**: The runner writes no files. In Slice 1 its dispatched agents perform no
  writes or artefact edits either; the orchestrator persists the ledger inline.
- **FR-012 (reconstructable)**: The return MUST be sufficient for the orchestrator to reconstruct the
  ledger with no information authored beyond formatting (Principle X).
- **FR-013 (diagnosability — CF-6)**: The return MUST carry a resolvable **per-agent transcript handle
  / run-id** for every author and voter, so a parity divergence (SC-001) can be **diagnosed**, not only
  detected.

### Deferred obligations — Slice 2 (recorded now so they are not lost; out of scope for this spec)

- **Extract pre-pass + short-circuit** — an empty/failed Extract stops the run with a recorded reason
  rather than authoring against nothing (the short-circuit counterpart to FR-006's isolation).
- **Self-heal re-verify loop** — the `cycle<3` auto-incorporate + re-verify. When specced, it MUST:
  (a) **CF-4** — carry a per-cycle **artefact diff/hash** in the re-verification trail and tell the
  re-verifier *what changed*, so a 🔴 cannot be cleared by editing away its cited evidence; the
  incorporating agent MUST cast no vote in the cycle it authored the fix (S8 across cycles); and
  (b) **CF-11** — the orchestrator MUST surface the in-flight self-heal signifier on resume
  (`DECISION-PRIMITIVE.md` in-progress record), since a background run cannot emit live — preserving
  the spec-006 progress-vs-runaway signal. The `cycle==3` escalation returns control to the orchestrator.

### Key Entities

- **Gate runner (Workflow script)** — `meta.phases` = the gate stages; body fans out authors/voters and
  computes the tally. Stateless except its return; owns no wall-clock, no RNG, no filesystem; carries no
  gate meaning. It is a **Domain Service** invoked by the orchestrator, **never an orchestrator itself**.
- **Gate return (finding-centric Published Language)** — a list of findings, each
  `{id, lens, evidence, pull_quote, proposed_severity, votes[], tally{P,O,net}, band}`, plus `gaps[]`
  (recorded nulls), `stageOutcomes` (`ok`/`stage-timeout`/`quorum-failed`), and per-agent transcript
  handles. Modeled on the canon finding shape by reference, not a new flattened DTO.
- **Inline orchestrator (integration layer)** — unchanged role: seats the panel, runs the exploratory
  phase + operator interview, invokes the runner, re-derives bands (FR-004b), persists the ledger,
  performs all banded operator decisions. The Workflow is its tool, not its replacement.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (parity — tightened, CF-2)**: Given a **frozen `{findings, votes}` fixture**, the runner's
  per-finding `band` equals the canon band table for **100% of cases**. There is no author-variance
  escape hatch — the fixture is frozen, so the test is fully falsifiable. Author-stage fan-out is
  validated separately as plumbing (US1), not as parity. This is the experiment that retires the prior
  "orchestration strictly negative" verdict; **adoption remains a separate operator call.**
- **SC-002 (structural honesty + executable S8, CF-12)**: 0 script paths author a finding or cast a
  vote (by inspection of the structural fact); AND the FR-003a S8 assertion passes (no finding on its
  author's ballot) — by test, not inspection.
- **SC-003 (fail-closed, CF-3)**: An injected null/absent terminal band is returned **gating**; 0
  findings are released without an explicit non-🔴 band.
- **SC-004 (fault policy, CF-6/CF-7)**: An injected Author/Vote failure yields a **recorded** `null`-gap
  (not a silent drop) and a completed gate when quorum holds; below the floor yields `quorum-failed`; an
  injected hang yields `stage-timeout`.
- **SC-005 (operator boundary)**: 0 operator prompts originate inside the script; every banded outcome
  is present in the return as data and acted on inline.
- **SC-006 (determinism — scoped, CF-15)**: Given fixed `{findings, votes}` inputs and fixed `args`, the
  runner returns **byte-identical bands** (not byte-identical agent prose). Assertable in CI by invoking
  the tally twice and diffing the bands.
- **SC-007 (consistency check, CF-16)**: The orchestrator's re-derived band equals the runner's claimed
  band for 100% of findings; any divergence fails the gate.
- **SC-008 (diagnosability, CF-6)**: Every finding and vote in the return carries a resolvable per-agent
  transcript handle; a parity divergence can be traced to the agent that produced it.
- **SC-009 (reconstructable — falsifiable, Principle X)**: From a frozen gate-return fixture, a
  deterministic renderer rebuilds the `agent-sdlc-log.md` ledger body, and **every register/tally/band
  value in the rendered ledger is byte-traceable to a field in the return** — 0 values the orchestrator
  supplied beyond formatting (headings, table scaffolding, dates from `args`). **Red:** any ledger value
  with no source field in the return, or any divergence between the rendered value and the return field,
  fails this criterion. (This gives SC-009 the named falsification the other SCs carry and that CF-12
  forced for S8 — an honesty invariant asserted in prose without an executable red is the gap, not the
  invariant.)

### Out of scope (this feature)

- **Slice 2**: the Extract pre-pass + short-circuit, and the self-heal re-verify loop (deferred behind a
  passed SC-001; obligations recorded above).
- Converting the operator interview or the 🔴 block to run in-substrate (structurally impossible; kept
  inline by FR-009).
- Converting the project-state round mode (this feature targets the lifecycle gate).
- A standing decision to **replace** plain-Agent dispatch — delivered here is the runner + the parity
  experiment (SC-001); adoption is a separate operator call, weighed against the recorded prior verdict.
