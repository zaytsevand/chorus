# Implementation Plan: Constraint-and-Flow Advisor (Rational Product-First Counterweight)

**Branch**: `002-rational-product-voice` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-rational-product-voice/spec.md`

## Summary

Add a ninth chorus advisor — `constraint-and-flow-advisor` — that supplies the missing
*defer / cut / sequence* axis. Its spine is Goldratt's Theory of Constraints, modernized by
Reinertsen's product-development flow economics (cost of delay / CD3), with the binding
constraint named as the **validated-learning loop** (not the codebase). Ries / Duke / Cagan-Torres
are cited lineage, not co-equal voices.

The work is markdown-and-config, not application code: author one new persona agent file
following the `security-and-trust-advisor.md` anatomy, update every roster surface that counts or
enumerates personas (8 → 9), correct the stale `install.sh` text, and reinstall. The change is
**additive** (FR-014, SC-006) and reuses the existing chorus machinery — Phase 0.5 RSVP, evidence
gate I8, Phase 3 reconciliation, Phase 4 ranking — unchanged.

## Technical Context

**Language/Version**: Markdown (persona + skill definitions) + Bash (`install.sh`). No compiled code.

**Primary Dependencies**: Claude Code agent/skill runtime; the chorus-review skill machinery in
`skill/chorus-review/SKILL.md` (Phase 0.5 RSVP, Phase 3 reconciliation, Phase 4 ranking) and
`skill/chorus-review/INTEGRATION-LAYER.md` (invariants, incl. I8 evidence gate).

**Storage**: File-based. Source artefacts: `agents/constraint-and-flow-advisor.md`,
`skill/chorus-review/*.md`. Runtime persona memory at
`~/.claude/agent-memory/constraint-and-flow-advisor/`.

**Testing**: No automated harness. Validation is **behavioural** — a chorus dry-run (quickstart.md)
exercising SC-001…SC-007 — plus a **roster-consistency check** (a grep confirming every enumeration
surface agrees on "nine" and names the advisor; SC-005).

**Target Platform**: Claude Code, any OS; installed to `~/.claude/` via `./install.sh --force`.

**Project Type**: Single project — prompt/persona library (docs-as-code).

**Performance Goals**: N/A. Behavioural budget only: RSVP reply ≤ 80 words; the advisor abstains
rather than manufacturing findings (FR-003).

**Constraints**: Additive only — no existing persona edited or down-weighted (FR-014). Evidence gate
extended, not weakened (FR-007). Exactly one voice, no veto in reconciliation/ranking (FR-010).
Reach stops at hard invariants flagged by other personas (FR-009).

**Scale/Scope**: 1 new agent file (~90–120 lines); edits to ~5 roster surfaces + `install.sh`; 1
reinstall. No new chorus phase, no artifact-location change.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an **uninstantiated template** (all
placeholders), so the formal Constitution Check has **no concrete gates — N/A**. The feature is
instead evaluated against the chorus's own de-facto invariants, which act as the operative
constitution:

| Operative invariant | Source | Verdict |
|---------------------|--------|---------|
| Additive only — no existing persona removed/silenced/down-weighted | FR-014, SC-006 | ✅ PASS (new file + enumeration bumps only) |
| Evidence gate preserved — advisor clears I8 via a sanctioned constraint-argument form | I8 / FR-007 | ✅ PASS (gate extended, not relaxed) |
| One voice, no veto in reconciliation & ranking | FR-010 | ✅ PASS |
| Reach stops at hard correctness/security/data-integrity invariants | FR-009 | ✅ PASS |

No violations → **Complexity Tracking N/A**. *(Re-checked after Phase 1 design: unchanged — the
design adds no abstraction, no new flow, no coupling to other personas.)*

## Project Structure

### Documentation (this feature)

```text
specs/002-rational-product-voice/
├── plan.md            # this file (/speckit-plan output)
├── research.md        # Phase 0 — synthesis decisions (all resolved, no NEEDS CLARIFICATION)
├── data-model.md      # Phase 1 — persona + output entities, roster-surface inventory
├── quickstart.md      # Phase 1 — behavioural validation mapped to SC-001..SC-007
├── contracts/
│   ├── persona-contract.md      # the advisor's per-phase obligations (RSVP/evidence/reconcile/rank)
│   └── roster-consistency.md    # the 8→9 enumeration invariant (SC-005) + surface checklist
├── checklists/requirements.md   # (existing)
└── tasks.md           # Phase 2 — created by /speckit-tasks, NOT here
```

### Source (repository root) — files this feature touches

```text
agents/
└── constraint-and-flow-advisor.md   # NEW — persona; copy anatomy from security-and-trust-advisor.md

skill/chorus-review/
├── SKILL.md                 # EDIT — description persona list; Phase 0 "roster is eight"→"nine" + entry
└── INTEGRATION-LAYER.md     # EDIT — "Eight lenses" / "eight-lens" → "Nine" / "nine-lens" (2 spots)

README.md                    # EDIT — "Eight persona advisors…" → "Nine…" + name; Install "eight"→"nine";
                             #        Principles matrix → add "Constraint-and-Flow reads it as" column
templates/CHORUS-PROJECT.template.md  # VERIFY/EDIT — only if it references the default roster or count
install.sh                   # EDIT — L4 + L38 "seven" → "nine"  (already stale: said "seven" at 8 agents)
```

**Structure Decision**: Single-project docs-as-code. No `src/`/`tests/` tree applies. The "build" is
`./install.sh --force`, which copies `agents/*.md` and `skill/chorus-review/*.md` into `~/.claude/`.
Verification is behavioural (chorus dry-run) plus a consistency grep across enumeration surfaces.

> **Agent-context update**: the workflow's "update CLAUDE.md between SPECKIT markers" step is **skipped** —
> the repo has no root `CLAUDE.md` and no SPECKIT markers (verified). The project deliberately keeps no
> root agent-context file; none is created to avoid unrequested scope.

## Complexity Tracking

N/A — no constitution violations to justify.
