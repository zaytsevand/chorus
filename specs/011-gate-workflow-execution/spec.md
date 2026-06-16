# Feature Specification: Gate Execution on a Native Workflow Substrate

**Feature Branch**: `011-gate-workflow-execution`

**Created**: 2026-06-16

**Status**: Draft

## Context

A chorus gate is four deterministic stages — **extract → author (uncapped) → vote →
tally** (`GATE-PRIMITIVE.md`) — plus, in lifecycle mode, a **self-heal loop** that
re-verifies an incorporated 🔴 while `cycle < 3` (`SDLC-LAYER.md` § Block on 🔴;
spec 006). Today the orchestrator runs these stages by hand-dispatching `Agent` calls
and tallying in prose. This feature adds a **second execution substrate** for the
gate's mechanical core: a native Claude **Workflow** script that fans out the Author
and Vote stages, computes the tally in code, and runs the self-heal re-verify loop —
returning structured results to the orchestrator.

This is **not a new gate definition**. The gate's meaning lives once in
`GATE-PRIMITIVE.md` (Principle I); this feature is an alternative *runner* for it that
MUST produce tally-equivalent results. The motivation is twofold:

1. **The honesty invariants become structural, not disciplinary.** A Workflow script
   only runs JS and dispatches `agent()`s — it **cannot author a finding or cast a
   vote**. So S1 (orchestrator authors nothing) and S9 (orchestrator never synthesizes
   a vote) are enforced by the substrate, and the tally (`net = P − O`) is literal
   arithmetic in code, not a prose claim (Principle II, Principle III).
2. **Parallel fan-out** of N authors / N voters with schema-validated returns, instead
   of serial hand-dispatch.

### Scope decisions (operator-confirmed for this spec)

- **In scope:** Author, Vote, and Tally stages of a single gate; the self-heal
  re-verify loop up to — but not including — the `cycle == 3` operator escalation; the
  optional read-only Extract pre-pass.
- **Out of scope (stays in the inline integration layer):** every **operator-in-the-loop**
  point — the project-addendum / scope-exclusion confirmation, the exploratory-phase
  **batched operator interview**, the **🔴 hard-block + instant operator ask**, and
  gate sign-off. A background Workflow cannot prompt the operator (Principle VI/VII);
  these are not degraded into auto-decisions, they are kept inline. (Principle IX —
  convert only the constraint-relieving fan-out; defer the rest.)
- **Hybrid by construction:** the orchestrator scouts inline (seat the panel, build the
  exploratory understanding, assemble the brief), invokes the Workflow for the gate
  fan-out, then resumes inline to adjudicate any banded operator decision.

### Constitution & canon check (Principle I — cite, never restate)

- **Gate primitive (`GATE-PRIMITIVE.md`: extract → author → vote → tally; S1/S8/S9)** —
  this feature reuses it verbatim as the contract the Workflow runner must satisfy. It
  defines no new stage, severity, or threshold.
- **Self-heal loop (`SDLC-LAYER.md` § Block on 🔴; spec 006, catalog row 5)** — the
  Workflow may run the `cycle < 3` auto-incorporate + re-verify iterations (agent-only);
  the `cycle == 3` escalation to a 🔴 operator ask is returned to the orchestrator.
- **Decision banding (`DECISION-PRIMITIVE.md`; Principle VI/VII)** — the Workflow emits
  banded outcomes as **data**; it never performs a 🔴 block or a 🟡 operator-ask itself.
- **Tutorial / review modes (`SKILL.md`)** — unchanged; this is an execution detail of
  the gate, invisible to the operator-facing procedure.

### Relationship to open issues / specs

- Companion to the prior assessment that the gate fan-out fits a Workflow while the
  operator interactions do not — this spec encodes that hybrid boundary.
- Records the standing prior verdict (memory: *"ultra-mode experience strictly negative;
  run chorus gates via plain Agent dispatches"*) as the **riskiest assumption** this
  feature must retire before adoption — see Success Criteria / the cheapest experiment.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A gate's Author/Vote/Tally runs on the Workflow substrate (Priority: P1)

The orchestrator has seated a panel and built the brief. It invokes the gate Workflow
with the brief + corpus locators. The Workflow fans out one author `agent()` per seated
lens (uncapped findings, schema-validated), routes each finding to voters **excluding
its own author** (S8), fans out the Vote stage, computes `net = P − O` per finding in
code, applies the escalate/demote/hold thresholds, and returns the findings register +
per-finding tally + banded outcomes. The orchestrator persists the ledger from that
structured return.

**Acceptance:** for an identical brief + corpus, the Workflow gate's per-finding band
matches what the plain-Agent gate produces (tally-equivalent); the orchestrator authored
no finding and synthesized no vote (structurally — it only invoked the script).

### User Story 2 — Fault isolation preserves quorum; the spine short-circuits (Priority: P1)

One author subagent dies mid-run. The gate does **not** abort: the dead author resolves
to `null`, is filtered out, and the remaining lenses' findings proceed to vote — the gate
stays quorum-tolerant (mirrors RSVP's J<roster tolerance). **But** if the read-only
Extract pre-pass returns nothing usable, the Workflow short-circuits *before* authoring
(no point authoring against an empty extract) and returns a recorded `extract-failed`
outcome rather than a hollow gate.

**Acceptance:** an Author/Vote subagent failure leaves a `null`-isolated gap recorded in
the register, not an aborted gate; an Extract-stage failure stops the run with a recorded
reason; neither path fabricates a finding or a vote.

### User Story 3 — Self-heal runs in-substrate up to the escalation boundary (Priority: P2)

A gating 🔴 clears the tally. While `cycle < 3`, the Workflow auto-incorporates the fix
(an `agent()` edits the artefact) and re-verifies (re-dispatch authors/voters on the
changed finding). If a re-verify cycle clears it, the gate returns `cleared`. If it
reaches `cycle == 3` still gating, the Workflow returns `escalate-to-operator` with the
DecisionRecord-in-progress — and the **orchestrator**, inline, performs the 🔴 ask.

**Acceptance:** self-heal iterations leave a per-cycle re-verification trail in the
return; the `cycle == 3` boundary hands control back to the orchestrator and never
attempts an operator prompt from within the Workflow.

### Edge Cases

- **Operator decision reached inside the script.** Impossible by construction — the
  script has no operator channel. Any banded outcome that *requires* the operator
  (🔴 escalation, project-wide write-back proposal) is **returned as data**; the
  orchestrator acts on it inline. A reviewer can confirm no `AskUserQuestion`-equivalent
  is reachable from the script.
- **Non-determinism leak.** `Date.now()` / `Math.random()` are unavailable in scripts;
  the gate's date stamp and any per-run identifiers are passed in via `args` from the
  orchestrator, which owns the wall-clock. The ledger date is the orchestrator's, not the
  script's.
- **Author grading own finding (S8).** Routing is in code: a finding authored by lens L
  is never placed on L's own vote ballot. The exclusion is a script-side filter, asserted
  in the conformance examples — not left to voter discipline.
- **Tally divergence.** If the Workflow tally and a plain-Agent tally ever disagree on the
  same inputs, that is a defect in the runner, not a new gate semantics — the gate
  primitive is the single source of truth (Principle I/VIII).
- **Subagent file writes.** The script itself cannot touch the filesystem; all ledger /
  artefact / record writes happen **inside** dispatched `agent()`s, which carry full
  tools. The script orchestrates and returns data; it persists nothing directly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The feature MUST provide a Workflow runner for the gate primitive's
  **Author → Vote → Tally** stages (and the optional read-only Extract pre-pass) that is
  **tally-equivalent** to the plain-Agent gate on identical inputs. It MUST NOT define a
  new stage, severity scale, or threshold (Principle I).
- **FR-002**: The runner MUST dispatch **one author per seated lens** (uncapped findings)
  and return findings as **schema-validated** objects (file:line or `[principle]` tag per
  finding — Principle V is the authors' obligation, surfaced as a required schema field).
- **FR-003**: The runner MUST route each finding to voters **excluding its author** (S8),
  enforced by script-side filtering, and fan out the Vote stage with a schema-validated
  PRIORITIZE / CONFIRM / OVER-RATE ballot.
- **FR-004**: The runner MUST compute `net = P − O` per finding **in code** and apply the
  escalate (`net ≥ +2`) / demote (`net ≤ −2`) / hold (`|net| < 2`) rules from
  `GATE-PRIMITIVE.md` deterministically (Principle III). The orchestrator MUST NOT
  re-tally or override the arithmetic.
- **FR-005**: The runner MUST NOT contain any path by which the orchestrator-as-script
  authors a finding or casts/synthesizes a vote (S1/S9). This is satisfied structurally —
  the script only invokes `agent()` and computes on their returns — and MUST be asserted
  in the conformance surface.
- **FR-006 (fault policy)**: Author and Vote stages MUST be **fault-isolating** — a dead
  or skipped subagent resolves to `null`, is filtered, and does not abort the gate
  (quorum tolerance). The **Extract** pre-pass and any lifecycle-spine precondition MUST
  be **short-circuiting** — an empty/failed result stops the run with a recorded reason
  rather than authoring against nothing. Every isolated `null` and every short-circuit
  MUST be recorded, never silently dropped.
- **FR-007**: The runner MAY execute the self-heal loop's `cycle < 3` iterations
  (auto-incorporate via an `agent()` + re-verify) and MUST return a per-cycle
  re-verification trail. It MUST stop and return `escalate-to-operator` at `cycle == 3`
  without clearing, or for any 🔴 the catalog does not mark self-healable — the
  orchestrator performs the operator ask inline (Principle VII).
- **FR-008**: All **operator-in-the-loop** decisions (addendum/scope confirmation, the
  exploratory operator interview, the 🔴 block, gate sign-off, project-wide write-back
  proposal) MUST remain in the inline orchestrator. The runner MUST surface any such
  decision as **data in its return**, never attempt it, and never auto-resolve a 🔴/🟡 it
  cannot decide (Principle VI).
- **FR-009**: The runner MUST be **deterministic across resume**: no `Date.now()`,
  `Math.random()`, or argless `new Date()`. Timestamps, run identifiers, and the ledger
  date MUST be passed in via `args` from the orchestrator.
- **FR-010**: The runner MUST NOT write files directly. Ledger, artefact, and record
  writes MUST happen inside dispatched `agent()`s; the script returns structured data the
  orchestrator persists.
- **FR-011**: The runner's return MUST be sufficient for the orchestrator to reconstruct
  the ledger (`GATE-PRIMITIVE` register + tally + banded outcomes + self-heal trail) with
  no information authored by the orchestrator beyond formatting (Principle X — the
  artifact is regenerable from the procedure's output).

### Key Entities

- **Gate runner (Workflow script)** — a self-contained script whose `meta.phases` are the
  gate stages; body fans out authors/voters and computes the tally. Stateless except for
  its return value; owns no wall-clock and no filesystem.
- **Gate return (structured)** — `{ findings[], votes[], tally[], outcomes[], selfHeal[] }`
  with banded outcomes tagged (🟢 / 🟡 / 🔴 / `escalate-to-operator` / `extract-failed`).
  The orchestrator's single input for ledger persistence and inline adjudication.
- **Inline orchestrator (integration layer)** — unchanged role: seats the panel, runs the
  exploratory phase + operator interview, invokes the runner, persists the ledger,
  performs all banded operator decisions. The Workflow is its tool, not its replacement.
- **Self-heal trail** — per-cycle `{ cycle, incorporated, reVerifyBand }` rows the runner
  returns for cycles it executed; the boundary row (`cycle == 3` or non-self-healable)
  carries `escalate-to-operator`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (parity — the riskiest assumption)**: On one real gate run, the Workflow
  runner's per-finding band matches a plain-Agent run on the same brief + corpus for
  100% of findings (or every divergence is explained as an author-variance, not a tally
  defect). **This is the cheapest experiment that retires the prior "orchestration is
  strictly negative" verdict** before any broader adoption.
- **SC-002 (structural honesty)**: A reviewer reading the script confirms 0 code paths by
  which the orchestrator authors a finding or casts a vote; the tally is visibly `P − O`
  arithmetic. S1/S9/Principle III hold by inspection, not by trust.
- **SC-003 (S8 routing)**: Across the run, 0 findings appear on their own author's ballot.
- **SC-004 (fault policy)**: An injected Author/Vote subagent failure yields a recorded
  `null`-isolated gap and a completed gate; an injected Extract failure yields a recorded
  short-circuit and no authored findings. 0 silent drops.
- **SC-005 (operator boundary)**: 0 operator prompts originate inside the script; every
  🔴 escalation and project-wide proposal is present in the return as data and is acted on
  inline. A `cycle == 3` self-heal boundary returns control with the DecisionRecord
  in-progress.
- **SC-006 (determinism)**: A resumed run with the same `args` returns byte-identical
  banded outcomes (no wall-clock / RNG leak).
- **SC-007 (ledger reconstructable)**: The gate's `agent-sdlc-log.md` ledger is rebuildable
  from the runner's return alone, with the orchestrator contributing only formatting
  (Principle X).

### Out of scope (this feature)

- Converting the operator interview or the 🔴 block to run in-substrate (structurally
  impossible; kept inline by FR-008).
- Converting the project-state round mode — this feature targets the lifecycle gate; the
  project-state round may reuse the runner later but is not specified here.
- A standing decision to *replace* plain-Agent dispatch. This feature delivers the runner
  and the parity experiment (SC-001); adoption is a separate operator call, weighed
  against the recorded prior negative experience.
