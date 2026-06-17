# Implementation Plan: Gate Execution on a Native Workflow Substrate (Slice 1)

**Branch**: `011-gate-workflow-execution` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-gate-workflow-execution/spec.md` (rev 2; Gate A cleared)

## Summary

Deliver **Slice 1** of a native-Workflow *runner* for the chorus gate primitive's Author → Vote →
Tally stages — an alternative *executor* (not a new gate definition) that is tally-equivalent to and
conformance-locked against `GATE-PRIMITIVE.md`. The runner is a bounded Workflow script: it dispatches
one author `agent()` per seated lens, routes findings to author-excluded voters (S8), computes
`net = P − O` and the canon bands **in code**, and returns a finding-centric structure the inline
orchestrator re-derives and persists. It owns no wall-clock, no RNG, no filesystem, and **no gate
meaning** (thresholds are injected, conformance-locked). Self-heal and the Extract pre-pass are
deferred to Slice 2 behind a passed SC-001. The deliverable is **the runner script + a conformance
suite (quickstart stanzas) + the gate-return contract**, not application code.

## Technical Context

**Language/Version**: Plain JavaScript (Claude Code Workflow script dialect — no TypeScript, no
Node/FS APIs, `Date.now()`/`Math.random()`/argless `new Date()` unavailable). Canon remains Markdown.

**Primary Dependencies**: Claude Code Workflow substrate primitives (`agent()`, `parallel()`,
`schema`-validated structured output, `args`); the seated persona subagent types; `GATE-PRIMITIVE.md`
as the cited contract.

**Storage**: N/A in-runner (stateless; returns data only). The inline orchestrator persists the ledger
to `specs/<feature>/agent-sdlc-log.md` — outside the runner (FR-011).

**Testing**: Conformance fixtures, run as the quickstart verification surface (Principle V/X) — there is
no application runtime: (1) frozen-vote → band-table parity (SC-001), (2) S8 routing assertion (SC-002),
(3) fail-closed default (SC-003), (4) fault/timeout recording (SC-004), (5) determinism diff (SC-006),
(6) re-derive consistency (SC-007), (7) threshold-table == canon lock (FR-004a).

**Target Platform**: Claude Code Workflow runtime (background, non-interruptible execution).

**Project Type**: Single — a skill-internal execution substrate (one Workflow runner script + canon
citations + conformance stanzas). A *mode of how a gate runs*, not a new skill.

**Performance Goals**: Explicitly subordinate (characteristic ranking #4). The bar is decision-integrity
and honesty-by-construction, not throughput. Only liveness target: a fan-out stage must terminate
(no unbounded hang — FR-006a, see research U3).

**Constraints**: Bounded runner (no gate meaning in code); operator-in-the-loop stays inline (FR-009);
deterministic across resume (FR-010); markdown-first canon; runner writes nothing (FR-011).

**Scale/Scope**: One gate per invocation; ≤~8 seated lenses; low-tens of agents; quorum floor ≥3 surviving
authors. Slice 1 = Author→Vote→Tally only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — both passes below.*

- **I — Cite, never restate**: the runner cites `GATE-PRIMITIVE.md` for stages, severities, thresholds;
  it transcribes none of them as code literals. Thresholds reach the runner as injected `args` data and
  are **conformance-locked** to canon by FR-004a's fixture. ✅ (pre & post).
- **V — Evidence**: every SC names a falsifiable red; the conformance suite is the first-class
  verification surface (there is no other runtime). SC-009 was given an explicit red (post-Gate-A). ✅.
- **VIII — Spec is source of truth**: this plan changes no spec/canon by hand. The one residual unknown
  (U3, timeout-without-a-clock) is recorded as a research finding for Gate B to weigh; it is **not**
  hand-patched into the spec here. ✅.
- **IX — Build on the constraint**: the binding constraint is the trustworthiness of the gate verdict
  (decision integrity). Slice 1 carries only what SC-001 (the parity experiment) needs; self-heal + extract
  are deferred behind a passed SC-001. Deferrals are explicit (spec § Deferred obligations). ✅.
- **Authoring constraints**: the runner is **runtime code**, which the markdown-only rule forbade — this
  is the carve-out amended at Gate A (CF-8): a bounded Workflow runner is now an enumerated third
  executable surface. Recorded in Complexity Tracking. New capability is a *mode of how a gate executes*,
  not a new skill. ✅ (under the amendment).

**Result: PASS** (pre-Phase-0 and post-Phase-1). One justified constitution deviation (runtime code),
tracked below under its governing amendment.

## Project Structure

### Documentation (this feature)

```text
specs/011-gate-workflow-execution/
├── spec.md              # rev 2 (Gate A cleared)
├── agent-sdlc-log.md    # Gate A ledger (+ this plan's Gate B when run)
├── plan.md              # This file
├── research.md          # Phase 0 — unknowns resolved (U1–U4)
├── data-model.md        # Phase 1 — entities (runner, gate return, vote, finding)
├── contracts/
│   └── gate-return.md   # Phase 1 — the finding-centric Published-Language return contract
├── quickstart.md        # Phase 1 — conformance stanzas mapped to SC-001…SC-009
└── tasks.md             # Phase 2 — NOT created here (/speckit-tasks)
```

### Source surface (repository root)

```text
skill/chorus/
├── GATE-PRIMITIVE.md         # cited contract (unchanged by this feature)
└── workflows/
    └── gate-runner.mjs       # NEW — the bounded Workflow runner script (Slice 1)
.specify/memory/constitution.md  # amended at Gate A (executable-surface carve-out) — already committed
```

**Structure Decision**: Skill-internal. The only new executable artefact is one Workflow runner script
under `skill/chorus/workflows/`. Everything else is spec/contract/conformance Markdown. No `src/`,
`tests/` tree — conformance fixtures live as quickstart stanzas (the repo's testing idiom), matching how
features 009/010 verify.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Runtime code (a JS Workflow runner) in a markdown-first repo | The whole feature is to test whether the gate's mechanical core can run on the Workflow substrate with S1/S9 enforced *structurally* (SC-001 parity experiment) — impossible without an executable runner | Prose-only cannot execute a tally or enforce S1/S9 by construction; the bounded carve-out (no gate meaning, conformance-locked) admits exactly this one surface and was operator-accepted at Gate A (CF-8). Counter-force: the carve-out is bounded and reviewed, not an open door. |
