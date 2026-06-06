# Agent-SDLC Workflow — Design

- **Date:** 2026-06-06
- **Status:** Approved design, pre-plan
- **Topic:** A spec-lifecycle orchestration mode for the chorus integration layer:
  agent gates interleaved with the speckit cycle for design/plan/implementation
  review.

## 1. Summary

The chorus integration layer today drives one procedure — a project-state
review round. This design develops that same layer into a higher-level
orchestrator that drives the **whole spec lifecycle**, interleaving speckit
phase-runners (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`,
`/speckit-implement`, `/speckit-clarify`) with three **chorus gates** that
review the design, the build plan, and the implementation.

The chorus round becomes a reusable **gate primitive** inside the larger
procedure. The orchestrator keeps the Dijkstra posture it already has: it
routes, it audits that each gate fired, and it refuses across boundaries. It
never authors the spec, the plan, the tasks, or the code — it invokes the
speckit phase-runners for that. It never adds findings of its own — the
personas do that.

This is a new **mode** of an existing component, not a new skill and not a
speckit hook extension.

## 2. Context and the tension this resolves

- The existing integration layer (`skill/chorus-review/INTEGRATION-LAYER.md`)
  is a thin, refusal-capable orchestrator grounded in Dijkstra EWD 340:
  hierarchical abstraction, narrow interfaces, per-phase pre/postconditions,
  invariants I1–I8. The user holds sign-off (level N+1); personas hold lenses
  (level N-1); `advisor()` is lateral. The layer routes and audits; it does
  not decide.
- The chorus README explicitly says the full chorus is **not** for per-PR /
  per-spec review — it is a periodic *project-state* review (nine personas,
  RSVP, six phases). That is heavyweight by design.
- This workflow needs agents as **per-feature gates**. Running the full
  six-phase chorus three times per feature would be exactly the kind of
  process gold-plating the constraint-and-flow advisor exists to flag.
- **Resolution:** the gates run a **scoped** form of the chorus — per-gate
  RSVP, panel capped at five — not the full round. Cost scales with the
  feature's surface, not a fixed nine-by-three. SDLC mode is a distinct,
  lighter procedure that *reuses* the round machinery; it does not contradict
  the README's "not for per-spec" rule about the heavyweight round.

## 3. The pipeline

```
STEP                          ACTOR          GATE / LOOP
──────────────────────────────────────────────────────────────────────
1  /speckit-specify           speckit        —            → spec.md
2  /speckit-clarify           you (opt.)     —              (user-driven)
3  /speckit-plan              speckit        —            → plan.md
──────────────────────────────────────────────────────────────────────
4  CHORUS GATE A              agents         block on 🔴
   "design review"            product · architecture · devops · security
   (conceptual: right thing,    + constraint-and-flow (scope/defer angle)
    scoped right?)
5  incorporation              speckit+you    /speckit-clarify → /speckit-plan
   (chorus-driven)            └─ loop 4↔5 until no 🔴 open (bound N=3)
──────────────────────────────────────────────────────────────────────
6  /speckit-tasks             speckit        —            → tasks.md
7  CHORUS GATE B              agents         block on 🔴
   "plan/tasks review"        architect · domain · language · devops · security
   (technical: build plan sound?)
8  incorporation              speckit+you    /speckit-clarify → /speckit-plan
   (chorus-driven)               → /speckit-tasks
                              └─ loop 6/7↔8 until no 🔴 open (bound N=3)
──────────────────────────────────────────────────────────────────────
9  /speckit-implement         speckit        —            → code + tests
10 CHORUS GATE C              agents         block on 🔴
   "implementation review"    architect · domain · language · devops · security
   (technical: code itself sound — bugs, drift, quality)
   └─ fix (code) or /speckit-clarify → re-implement;
      re-review until no 🔴 open (bound N=3)
──────────────────────────────────────────────────────────────────────
```

The attendee lists are the **expected** RSVP outcomes, not fixed rosters.
Gate A is conceptual (product + architecture + devops + security, plus
constraint-and-flow for the scope/defer angle); Gates B and C are technical
(architecture + domain + language + devops + security — exactly five, which
the cap fits).

## 4. Gate mechanics

All three gates share one uniform semantic: **chorus review → findings →
block on 🔴 → incorporation loop → re-review until clean.**

### 4.1 RSVP per gate

- RSVP fires **independently at every gate**. A persona's JOIN/ABSTAIN at one
  gate never carries to another: constraint-and-flow may abstain on a code
  review yet join the design gate; Guido abstains when no code is in scope and
  joins a technical gate once there is Python.
- Each RSVP reply carries a **self-declared relevance score (0–3)** for *this
  gate*, on the same scale as the coverage chart.

### 4.2 Panel cap of five

- The panel seats at most **five** joiners (odd-quorum design, matching the
  existing chorus 3/5 quorum).
- If more than five JOIN, the orchestrator seats the **top five by
  persona-declared relevance score** — a mechanical sort on persona-supplied
  numbers, never an orchestrator judgment of lens merit (preserves I2).
- A tie or an over-five cluster at the cutoff line is **surfaced to the user**
  to break.
- If fewer than three JOIN, the gate follows the existing chorus quorum rule
  (re-ping once; abort honestly on second failure).

### 4.3 Block on 🔴 only

- The orchestrator **halts** the pipeline only on an unresolved 🔴 (a violated
  hard invariant or a finding the panel rates red). 🟡/🟢 findings are recorded
  and the user proceeds at will.
- The orchestrator refuses to pass a 🔴 **silently** (extends I7). It never
  overrides the user's call on ambers (the user holds sign-off, N+1).

### 4.4 Incorporation model

The **spec is the source of truth**; findings are incorporated by clarifying
the spec and regenerating downstream artifacts, not by hand-patching them.

- **Gate A:** `/speckit-clarify` → `/speckit-plan`.
- **Gate B:** `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks`.
- **Gate C:** a code fix, or — if the finding is a spec gap —
  `/speckit-clarify` → re-implement.

After each incorporation pass the gate **re-reviews** (loop).

### 4.5 Loop bound

Each gate loops until its 🔴 count reaches zero **or** the user explicitly
waives a 🔴 with recorded rationale. After **N = 3** incorporation cycles
without clearing, the orchestrator **halts and escalates to the user** rather
than looping indefinitely.

## 5. Why there is no acceptance gate

An earlier draft included a fourth gate: acceptance, verifying the
implementation against the spec's success criteria (SC-FAIL → halt). It is
**deliberately dropped.**

Rationale: in this workflow the implementation hews closely to a plan and
task list that were **themselves chorus-reviewed** (Gates A and B). The
deviation surface between "reviewed plan+tasks" and "produced code" is small
— unlike a legacy development cycle where code drifts far from any plan. A
chorus acceptance pass over that small surface would not yield meaningful
findings. Gate C therefore reviews the **code's own soundness** (bugs, drift,
quality), which is where the residual risk actually lives — not SC
conformance.

This is a design decision with a rationale, recorded so a future round does
not "restore the missing gate."

## 6. SDLC-layer invariants

These extend I1–I8 to the lifecycle level. They are the audit points that
keep SDLC mode honest; if any breaks, the procedure's correctness argument
breaks.

- **S1.** The orchestrator never authors spec, plan, tasks, or code. It
  invokes the speckit phase-runner. (Extends I1: never adds findings →
  never authors artifacts.)
- **S2.** RSVP fires at every gate independently. A JOIN/ABSTAIN never
  carries from one gate to the next. (Extends I2.)
- **S3.** The panel caps at five. Overflow is resolved by persona-declared
  relevance score, ties surfaced to the user — never by orchestrator
  lens-merit judgment. (Extends I2.)
- **S4.** No gate passes with an open 🔴. The incorporation loop runs until
  zero 🔴 or an explicit user waiver with recorded rationale. (Extends I7.)
- **S5.** Incorporation revises the spec and regenerates downstream
  artifacts via the speckit phase-runner. The orchestrator never hand-patches
  a finding into plan/tasks/code on its own judgment. (Extends I1/I6.)
- **S6.** Every gate finding obeys the I8 evidence gate (file:line or a
  principle tag). SDLC mode does not relax it.
- **S7.** Each gate loop is bounded at N = 3 cycles, then escalates to the
  user. The orchestrator never loops indefinitely chasing a 🔴.

## 7. Artifact

Each run writes a **per-feature SDLC ledger** at
`specs/<NNN-feature>/agent-sdlc-log.md`, co-located with the feature's spec,
plan, and tasks (distinguishing it from the periodic project-state artifacts
under `docs/reviews/`).

The ledger records, per gate: the RSVP result (who joined, who abstained, with
relevance scores), the findings register, each 🔴's resolution or waiver, and
the loop-iteration count. This is the audit trail that proves each gate fired
honestly — the Dijkstra "validate the procedure, not the artifact" property
(EWD 340 claim 3).

## 8. Packaging — files touched

- **New:** `skill/chorus-review/SDLC-LAYER.md` — the lifecycle-mode companion
  to `INTEGRATION-LAYER.md`. Contains the pipeline, gate mechanics, S1–S7,
  and the ledger format.
- **Edit:** `skill/chorus-review/SKILL.md` — a new section describing SDLC
  mode and its trigger (e.g., "run the agent-SDLC on feature 00X"), pointing
  at `SDLC-LAYER.md`.
- **Edit:** `README.md` — a short subsection introducing SDLC mode alongside
  the existing project-state round, and stating when to use which.
- **No** new skill, **no** speckit hook extension. SDLC mode is an operating
  mode of the existing skill.

## 9. Relationship to existing components

- **The project-state chorus round is unchanged.** SDLC mode is a sibling
  procedure that reuses the round as a gate primitive. "Spawn the chorus"
  still runs a periodic round; "run the agent-SDLC on feature X" runs this.
- **`advisor()`** keeps its lateral role: conflict arbitration within a gate
  and a final sanity pass, never a substitute for persona or orchestrator
  work (I5).
- **`spec-walkthrough` skill** (reconciles a spec against the codebase,
  traces user stories to code, runs headless as a review lens) is a natural
  candidate lens for **Gate C** — it is the lens that checks the produced code
  against the spec's intent. Wiring it in is in scope for the plan.

## 10. Out of scope / YAGNI

- No automated CI integration; this is a Claude-Code-driven, human-in-the-loop
  workflow.
- No acceptance/SC-verification gate (see §5).
- No change to the nine-persona roster or to any persona file; SDLC mode
  consumes the existing roster through RSVP.
- No parallelization of gates across multiple features; one feature at a time.
