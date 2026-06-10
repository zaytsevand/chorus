# Contract: stage navigation (AskUserQuestion)

**Feature**: 007-chorus-learn-onboarding | Binds: every stage's question in `LEARN.md`

## The per-stage question

Exactly **one AskUserQuestion call, one question, exactly 4 options**, fitting the
tool's option budget with zero compression (research.md R3):

| Slot | Option | Behavior |
|---|---|---|
| 1 | **Continue → <next stage name>** (recommended, listed first) | advance Sn→Sn+1; S5 advances to the exit wrap-up |
| 2 | **Go deeper on <current topic>** | one expanded pass on the same stage, then re-present the question (at most one deeper level) |
| 3 | **Jump to another stage** | fires the jump follow-up (below) |
| 4 | **Exit the tutorial** | deliver the FR-011 wrap-up; record ResumeState |

The tool's built-in "Other" free-text needs no slot; arbitrary asks are answered, then
the question is re-presented.

## The jump follow-up

One question listing the **other** stages by name (≤4 options: 5 stages − current −
the next stage already offered in slot 1 = 3, plus "back to where I was"). Selecting a
stage lands there directly; skipped stages are **not** replayed (US2, SC-003).

## Invariants

- **N1**: every stage's question offers all four affordances — advance / deeper / jump /
  exit (FR-004). No stage traps the user.
- **N2**: any stage is reachable from any other in ≤2 interactions; from S1, "run a
  round" is reachable in **one** choice (SC-003) — S1's slot-3 follow-up or the S1
  expert fast-exit option set covers it.
- **N3**: questions present choices, never walls of text (FR-003); the explanation
  precedes the question, bounded to one interaction's worth.
- **N4**: navigation is single-select (mutually exclusive); never multiSelect.
- **N5**: the S1 question's option set may substitute the expert fast-exit ("I know
  the basics — addendum checklist / command cheat-sheet") for slot 2's deeper, since
  orientation has no deeper level for an expert (edge case, spec).

## Resume

On re-trigger with ResumeState present: one question — **resume at <last stage> /
restart from orientation** (FR-010, SC-007). Two options; no other slots needed.
