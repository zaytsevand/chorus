# Implementation Plan: Chorus Suite Decomposition

**Branch**: `014-chorus-suite-decomposition` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/014-chorus-suite-decomposition/spec.md`

## Summary

Split the single `chorus-review` skill (six files, ~1,880 lines, two workflows +
shared mechanics) into a composable suite over a shared substrate: `chorus-core`
(the three primitives moved as-is + a new `CONDUCTOR.md` carrying the
mode-independent discipline and the full `I1–I9` invariant catalog),
`chorus-review` (base round only), and `chorus-sdlc` (lifecycle only), each
composing `chorus-core` by name. Add a findings→memory configuration contract as
a designed seam (impl deferred). The decomposition relocates source without
changing behavior; parity is proven by full RED-GREEN pressure scenarios per
moved/split skill. Anti-drift is enforced by single-source invariants (all in
core) plus three greppable fitness checks.

## Technical Context

**Language/Version**: Markdown skill documents (Claude Code skill format) + Bash
(`install.sh`, fitness-check scripts); JSON (`plugin.json`). No application
runtime.

**Primary Dependencies**: Claude Code skill loader (frontmatter `name`/
`description` enforced; body `REQUIRED:` markers are advisory); the `superpowers`
skill-authoring discipline (writing-skills Iron Law); speckit phase-runners.

**Storage**: Filesystem — `skill/<name>/` source dirs in repo; installed to
`~/.claude/skills/<name>/`; persona agents in `~/.claude/agents/`; agent memory
in `~/.claude/agent-memory/<persona>/`.

**Testing**: tiered behavior parity (Gate A F11) — structural-equivalence +
reachability for the three byte-identical primitive moves; full writing-skills
RED-GREEN pressure/application scenarios (subagent-run) for the content-changed
skills; both tiers assert on observable output (ledger/artifact/phase sequence) and
demonstrate their own RED. Three greppable fitness-check scripts (manually runnable;
FC1 enforces token residence in core; automated Jest/TS harness deferred to a
follow-up spec).

**Target Platform**: Claude Code (CLI/desktop/web), any OS that runs the loader.

**Project Type**: Developer-tooling skill suite (documentation-as-procedure).

**Performance Goals**: N/A (no runtime hot path). The relevant non-functional
target is *per-invocation load* — a review must not load lifecycle-only content
and vice-versa.

**Constraints**: Behavior MUST be unchanged ("same procedure, relocated source").
Every invariant token defined in exactly one file, all in `chorus-core`. No
fat-sibling dependency. Installer does no stale-file migration (handled
out-of-band). No automated test harness in this feature.

**Scale/Scope**: 3 skills built now (core/review/sdlc), 3 + 1 reserved seams
(viewpoint-extraction, setup, memory-update, findings→memory callback). ~1,880
lines relocated/split across the suite + `CONDUCTOR.md` extraction.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an **unfilled
template** — no ratified principles. Therefore:

- No constitutional gates apply; none can be violated.
- The chorus Phase-4 **Constitutional-ROI** ranking dimension is **skipped** for
  this feature's gates (per the procedure's "skip if no codified governance doc").
- The governing discipline for this feature is instead the **skill-authoring Iron
  Law** (writing-skills): no skill edit without a failing test first — carried as
  FR-015 (full pressure-scenario parity).

**Result**: PASS (vacuously — no principles to check). No Complexity Tracking
entries required.

## Project Structure

### Documentation (this feature)

```text
specs/014-chorus-suite-decomposition/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions & rationale
├── data-model.md        # Phase 1 — entities: skills, invariant catalog, contracts
├── quickstart.md        # Phase 1 — how to install/verify the suite
├── contracts/           # Phase 1 — the seams as contracts
│   ├── chorus-core-substrate.md       # router + invariant single-source + reachability self-check
│   ├── findings-to-memory.md          # findings-artifact shape + agent-memory layout (seam)
│   └── fitness-checks.md              # the three greppable integrity checks
├── spec.md              # Feature spec (input)
├── checklists/          # requirements checklist
└── agent-sdlc-log.md    # the run ledger (orchestrator audit trail)
```

### Source Code (repository root)

```text
skill/
├── chorus-core/                 # NEW substrate skill
│   ├── SKILL.md                 # lean router + reachability self-check; substrate description (no user trigger)
│   ├── GATE-PRIMITIVE.md        # moved as-is (S8–S10)
│   ├── DECISION-PRIMITIVE.md    # moved as-is (D1–D5)
│   ├── EXPLORATORY-PHASE.md     # moved as-is
│   └── CONDUCTOR.md             # NEW — extracted shared discipline + full I1–I9 catalog
├── chorus-review/               # base round only (was the monolith)
│   ├── SKILL.md                 # Phases 0–5; "two modes" framing + SDLC pointer removed; REQUIRED: chorus-core
│   └── INTEGRATION-LAYER.md     # round-specific: position, per-phase pre/post 0–5, sees/does-not-see; references core I1–I9
└── chorus-sdlc/                 # NEW lifecycle skill
    └── SKILL.md                 # pipeline, gate mechanics, S1–S7 (extend core I1–I9), ledger, refusals; REQUIRED: chorus-core

scripts/
└── check-suite-integrity.sh     # the three fitness checks (greppable, manually runnable)

templates/
└── CHORUS-PROJECT.template.md   # gains a findings→memory configuration section

install.sh                       # loop over skill/*/ → ~/.claude/skills/<name>/
plugin.json                      # list suite skills; correct existing roster/agent drift

tests/                           # writing-skills pressure scenarios (parity proof)
└── parity/                      # per-skill RED-GREEN scenario records for core/review/sdlc
```

**Structure Decision**: A shared-substrate suite under `skill/`. `chorus-core` is
the single source of all invariants and shared mechanics; `chorus-review` and
`chorus-sdlc` are thin orchestration skills that compose it by name. This is the
only layout of the three considered (see research.md) that preserves the
"two modes cannot drift" invariant by construction while enabling future
extraction.

## Complexity Tracking

> No Constitution Check violations (no ratified constitution). Table omitted.
