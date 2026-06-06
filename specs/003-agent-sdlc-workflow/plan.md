# Implementation Plan: Agent-SDLC Workflow

**Branch**: `003-agent-sdlc-workflow` | **Date**: 2026-06-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-agent-sdlc-workflow/spec.md`

**Design source**: `docs/superpowers/specs/2026-06-06-agent-sdlc-workflow-design.md` (approved)

## Summary

Develop the existing chorus integration layer into a higher-level orchestrator
that drives a speckit spec lifecycle, interleaving speckit phase-runners with
three scoped chorus gates (design / plan-tasks / implementation). Each gate runs
a four-stage primitive — extract → uncapped author → real adversarial vote →
deterministic tally — and blocks the pipeline only on an unresolved 🔴. The
four-stage primitive is defined once and adopted by both the new SDLC gates and
the existing project-state round (no drift). Delivery is entirely Markdown
skill/procedure authoring plus structural edits to the existing skill; there is
no compiled code.

## Technical Context

**Language/Version**: Markdown (CommonMark) skill, procedure, and agent-prompt
files. No programming-language runtime; orchestration is procedure executed by
the Claude Code session.

**Primary Dependencies**: the existing `chorus-review` skill
(`SKILL.md`, `INTEGRATION-LAYER.md`); the speckit skills (`/speckit-specify`,
`/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`);
the persona agents under `agents/`; the installed `spec-walkthrough` skill
(headless mode); the existing `advisor()` role.

**Storage**: filesystem Markdown artifacts. New per-feature ledger at
`specs/<feature>/agent-sdlc-log.md`.

**Testing**: procedural + structural validation — (a) a dogfooded SDLC dry-run
on a small feature, captured in `quickstart.md`; (b) structural assertions
(exactly one primitive definition; no per-author finding cap; ledger
completeness per `contracts/sdlc-ledger.md`). No unit-test framework applies.

**Target Platform**: Claude Code (CLI / desktop / web), operator-driven,
human-in-the-loop.

**Project Type**: documentation / skill (prompt-orchestration), single repo.

**Performance Goals**: bounded cost by construction — ≤ 5 personas per gate,
≤ 3 incorporation cycles per gate, RSVP abstention keeps irrelevant lenses out.
Latency is not a metric for this feature.

**Constraints**: introduce **no new skill** and **no speckit hook extension**
(SDLC mode is an operating mode of the existing skill, FR-001); preserve the
base round's user-facing flow (FR-017); reuse the existing roster, RSVP, and
`advisor()` (no persona file added or rewritten).

**Scale/Scope**: one feature per SDLC run; nine personas plus opt-in language
lenses; three gates per feature.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is an **unratified template** (placeholder
content only). There are therefore no concrete constitutional gates to evaluate
— **PASS by absence of ratified principles.**

The repository's de-facto governance is the chorus discipline cascade and
invariants **I1–I8** (`INTEGRATION-LAYER.md`). This feature is designed to
*extend* that governance with **S1–S9** rather than violate it, so it is
consistent with the de-facto constitution. Re-check after Phase 1: still PASS —
the design adds invariants, removes none.

## Project Structure

### Documentation (this feature)

```text
specs/003-agent-sdlc-workflow/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── gate-primitive.md     # four-stage contract: extract record, vote, tally→severity
│   ├── rsvp-and-panel.md     # RSVP reply schema, relevance score, cap-5 selection
│   ├── sdlc-ledger.md        # per-feature ledger schema
│   └── sdlc-invariants.md    # S1–S9 as checkable assertions
├── checklists/
│   └── requirements.md  # spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source artifacts (repository root)

This feature edits and adds Markdown skill artifacts; there is no `src/` or
`tests/` tree.

```text
skill/chorus-review/
├── GATE-PRIMITIVE.md     # NEW — single canonical four-stage primitive (extract→author→vote→tally), S8/S9
├── SDLC-LAYER.md         # NEW — lifecycle mode: pipeline, gates A/B/C, S1–S9, ledger; defers stage internals to GATE-PRIMITIVE.md
├── INTEGRATION-LAYER.md  # EDIT — Phases 1/2/4 reference GATE-PRIMITIVE.md; add S8/S9 to invariant set
└── SKILL.md              # EDIT — phase text → primitive; confirm uncapped authoring; add SDLC-mode section + trigger

README.md                 # EDIT — SDLC-mode subsection + "which mode when"
agents/                   # UNCHANGED (consumed via RSVP)
```

**Structure Decision**: documentation/skill project. The four-stage primitive
gets its **own** file (`GATE-PRIMITIVE.md`) rather than being folded into
`INTEGRATION-LAYER.md`, because it is shared by two modes (the base round and
SDLC gates); a shared contract needs a single home both can reference.
`SDLC-LAYER.md` mirrors the existing `INTEGRATION-LAYER.md` separation (the
lifecycle orchestrator is a distinct layer from the round orchestrator).

## Complexity Tracking

No constitution violations. One deliberate addition worth noting (not a
violation): two new docs (`GATE-PRIMITIVE.md` + `SDLC-LAYER.md`) instead of one.

| Choice | Why needed | Simpler alternative rejected because |
|--------|-----------|--------------------------------------|
| Separate `GATE-PRIMITIVE.md` | The four-stage mechanic is shared by the base round and the SDLC gates; one canonical definition prevents drift (FR-016, SC-006) | Folding it into `SDLC-LAYER.md` would make the base round depend on the SDLC doc, inverting the dependency and re-creating two definitions |
| Separate `SDLC-LAYER.md` | The lifecycle orchestrator is a higher level than the round orchestrator; mirrors the existing `INTEGRATION-LAYER.md` separation | Folding lifecycle mode into `SKILL.md` would bloat the entry doc and blur round-vs-lifecycle responsibilities |

## Phase 0 — Research

See [research.md](./research.md). Resolves: how the orchestrator invokes
speckit phases (D1); the deterministic vote→severity tally mapping (D2); the
extract-record schema and agent type (D3); panel-overflow selection (D4); the
ledger format (D5); the minimal base-round backport (D6); the `spec-walkthrough`
headless contract (D7); the incorporation cascade per gate (D8).

## Phase 1 — Design & Contracts

See [data-model.md](./data-model.md), [contracts/](./contracts/), and
[quickstart.md](./quickstart.md). Entities (Gate, Gate primitive, Finding, Vote,
Severity, Relevance score, RSVP reply, Panel, Ledger entry, SDLC run, Invariant)
and their state transitions are in `data-model.md`; the structured schemas the
procedure relies on are in `contracts/`.

**Agent context update**: the repository has no root `CLAUDE.md` with
`<!-- SPECKIT START/END -->` markers, so there is no agent-context file to
update. (`.specify/init-options.json` names `CLAUDE.md` as the context file, but
none exists at the repo root.) No action taken; noted for the record.

## Post-Design Constitution Re-check

PASS. The design adds invariants S1–S9 and a shared primitive; it removes no
existing invariant and introduces no new external dependency beyond the already
installed `spec-walkthrough` skill. Consistent with the de-facto constitution.
