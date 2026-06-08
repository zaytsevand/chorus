# Implementation Plan: Advisor Exploratory Phase

**Branch**: `004-advisor-exploratory-phase` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-advisor-exploratory-phase/spec.md`

**Companion artefact**: [information-needs-profiles.md](./information-needs-profiles.md)
(the 10 lens-authored profiles from the clarify round)

## Summary

Add an **exploratory phase** to the chorus: before producing findings, a
participating advisor builds a lens-specific understanding of the target and
records it, reference-first. The memory is **two-tier** — a shared
project-level base that *is* the existing `CHORUS-PROJECT.md` addendum (extended
with a "Project understanding" section), plus thin per-advisor lens layers
(project facts referenced, feature/spec deltas added). Gaps the repo can't
answer are gathered by bounded analysis, then a **single orchestrator-batched
operator interview** per round whose project-wide answers are written back to the
addendum as operator-accepted additions. Delivery is Markdown skill/persona/
template authoring — no code.

**Gate A incorporation (2026-06-07, cycle 1).** The design-review gate refined
five things (ledger: [`agent-sdlc-log.md`](./agent-sdlc-log.md)): the interview is
**sessioned** (≤ 5 questions, re-entrant, operator-paced, with an educational
preamble; a deferred session yields a verdict **degradation summary**); the phase
runs **cheapest-subset-first** with operator-controlled cost; **persisted memory
is an index of locators, never a finding's evidentiary endpoint** (findings
re-ground in live material); the addendum is the **authoritative system of record**
while records **may cache** project-wide facts under weak consistency reconciled by
a freshness fingerprint (a confirmed fact carries a `project-wide | lens-specific`
**scope**); and the phase has an executable **profile-coverage fitness function**.

## Technical Context

**Language/Version**: Markdown (CommonMark) — skill docs, persona agent files,
the addendum template. No runtime; the phase is procedure executed by the
Claude Code session and the persona subagents.

**Primary Dependencies**: the existing `chorus-review` skill (`SKILL.md`,
`INTEGRATION-LAYER.md`, `GATE-PRIMITIVE.md`, `SDLC-LAYER.md`); the nine persona
agents + opt-in Guido under `agents/`; the addendum
`docs/reviews/CHORUS-PROJECT.md` and its template; the per-advisor memory
surface (`memory: user` / `~/.claude/agent-memory/<persona>/`).

**Storage**: filesystem Markdown. **Project base** = the addendum (shared,
operator-owned). **Lens layers** = per-advisor memory records.

**Testing**: procedural + structural validation — a dogfood exploratory run on a
real target (this repo), plus the executable **profile-coverage fitness function**
(FR-022: every profile item resolves to a record entry; every cached project-wide
fact carries a reconciliation locator) and structural checks (every advisor has a
profile; project-wide facts are authored only in the addendum; addendum
write-backs are operator-accepted; the interview is sessioned with a degradation
summary). No unit-test framework.

**Target Platform**: Claude Code (CLI / desktop / web), operator-driven.

**Project Type**: documentation / skill (prompt-orchestration), single repo.

**Performance Goals**: bounded — exploratory phase runs for RSVP joiners only;
project base reused across rounds and across SDLC gates; bounded sampling in
analysis; one batched interview per round (not per advisor).

**Constraints**: persisted memory is an index of locators, never a finding's
evidentiary endpoint (findings re-ground in live material); advisors never
interview the operator directly (orchestrator owns N+1); the operator paces the
interview and controls its token/time budget; the addendum is the authoritative
system of record (write-backs are scope-tagged proposals the operator accepts;
records may cache but reconcile to it).

**Scale/Scope**: nine personas + opt-in language lenses; two memory tiers; one
target per run (project for a full sweep, a feature/spec for an SDLC gate).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is an **unratified template** (placeholders
only) — no concrete gates. **PASS by absence of ratified principles.**

De-facto governance is the chorus discipline cascade and invariants I1–I8
(`INTEGRATION-LAYER.md`) plus the gate-primitive S1–S9. This feature is
consistent with them: it adds an upstream understanding step that *feeds* the
gate primitive (it does not alter the find/vote/tally mechanic), it preserves
the "orchestrator owns operator interaction" boundary, and it strengthens the
I8 evidence discipline (provisional flagging of unconfirmed inferences). Re-check
after Phase 1: still PASS.

## Project Structure

### Documentation (this feature)

```text
specs/004-advisor-exploratory-phase/
├── plan.md                       # this file
├── research.md                   # Phase 0 — D1..D8 decisions
├── data-model.md                 # Phase 1 — entities & transitions
├── quickstart.md                 # Phase 1 — operator run-through + dogfood
├── contracts/                    # Phase 1
│   ├── exploratory-phase.md          # the phase procedure contract
│   ├── information-needs-profile.md  # per-lens profile schema
│   ├── understanding-record.md       # per-advisor lens-layer record schema
│   ├── addendum-project-understanding.md # the new addendum section schema
│   └── gap-interview.md              # gap-question + batched interview + write-back
├── checklists/requirements.md    # from /speckit-specify
├── information-needs-profiles.md  # the 10 lens-authored profiles (clarify round)
└── tasks.md                      # /speckit-tasks (not created here)
```

### Source artifacts (repository root)

Markdown skill / persona / template edits; no `src/` or `tests/`.

```text
skill/chorus-review/
├── EXPLORATORY-PHASE.md   # NEW — the phase mechanic: profile → harvest (addendum-first) → analyse → gap-questions → sessioned orchestrator interview → write-back → record → coverage check; two-tier memory (addendum authoritative, records may cache); memory-as-index-not-endpoint; staleness/reconciliation; deltas; profile-coverage fitness function
├── SKILL.md               # EDIT — insert the exploratory phase into the procedure (after RSVP, before Round 1) and note it in both modes
├── INTEGRATION-LAYER.md   # EDIT — orchestrator role: collect/dedupe gap-questions, run one batched interview, write operator-accepted project facts to the addendum; invariants
└── SDLC-LAYER.md          # EDIT — exploratory phase before a gate's author stage; project base reused across gates, per-gate deltas

agents/                    # EDIT ×10 — add each lens's "Information needs (exploratory phase)" section, seeded from information-needs-profiles.md
templates/CHORUS-PROJECT.template.md   # EDIT — add section 7 "Project understanding"
README.md                  # EDIT — brief mention of the exploratory phase + two-tier memory
docs/reviews/CHORUS-PROJECT.md         # (per-project, not in this repo) — gains the section when a project runs the phase
```

**Structure Decision**: the phase mechanic gets its **own** doc
(`EXPLORATORY-PHASE.md`), mirroring how `GATE-PRIMITIVE.md` / `SDLC-LAYER.md`
are separate from `SKILL.md`; both modes reference it. Each lens's profile lives
**in its agent file** (lens-owned, per the clarify decision), seeded from the
round's `information-needs-profiles.md`.

## Complexity Tracking

No constitution violations. One scope note (not a violation): this feature edits
**all ten** persona files to add their profile sections. That breadth is
inherent — each lens authors its own profile (FR-001) — not accidental coupling;
the content already exists in `information-needs-profiles.md`, so the edits are
mechanical transcription per persona.

## Phase 0 — Research

See [research.md](./research.md): D1 phase placement · D2 two-tier memory format
· D3 orchestrator-batched interview mechanics · D4 write-back discipline · D5
reference-not-duplicate & staleness · D6 incremental delta detection · D7 profile
authoring/location · D8 relationship to the gate primitive & cost control · D9
sessioned/re-entrant/operator-paced interview · D10 memory as index, never the
evidentiary endpoint · D11 addendum authoritative + denormalized cache · D12
profile-coverage fitness function. (D9–D12 from the Gate A incorporation.)

## Phase 1 — Design & Contracts

See [data-model.md](./data-model.md), [contracts/](./contracts/),
[quickstart.md](./quickstart.md).

**Agent context update**: the worktree has no root `CLAUDE.md` with
`<!-- SPECKIT START/END -->` markers, so there is no agent-context file to
update. No action taken; noted.

## Post-Design Constitution Re-check

PASS. The design adds an upstream understanding phase and a two-tier memory that
reuses the existing addendum; it removes no invariant, adds no external
dependency, and keeps the operator authoritative over the shared base. The Gate A
incorporation **strengthened** the I8/cascade discipline: memory-as-index (FR-021)
forces findings to re-ground in live material rather than trust persisted text,
and the profile-coverage fitness function (FR-022) gives the phase an executable
check instead of prose-only conformance.
