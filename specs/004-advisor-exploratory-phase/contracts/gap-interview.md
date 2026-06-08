# Contract: Gap-question + batched operator interview + write-back

How unmet needs become operator answers without advisors talking to the operator
directly. One batched interview per round (FR-007).

## Gap-question (emitted by an advisor)

```
{
  "lens":  "<persona>",
  "text":  "<question, <= ~20 words, answerable short>",
  "scope": "project-wide" | "lens-specific",
  "need":  "<the profile need it serves>"
}
```

- Raised only after reference-harvest and bounded analysis failed (steps 3–4 of
  `exploratory-phase.md`).
- Must not ask anything already answered by the addendum or repo docs (FR-008).

## Batching (orchestrator)

1. Collect all joiners' gap-questions.
2. **Dedupe** semantically-equivalent questions (one operator answer can satisfy
   many lenses) — record which lenses each answer serves.
3. Present as **one** operator interview, grouped, minimal, choice-shaped where
   possible — delivered in sessions per below.

## Sessioning (FR-019)

The interview is **not** one wall of questions. It is delivered in:

- **Sessions of ≤ 5 questions** each.
- **Re-entrant**: the operator may **defer** a session and **resume** it in a
  later sitting; session state (answered / deferred / pending) persists.
- **Operator-paced**: the operator controls how much token/time budget the phase
  spends — they decide when to stop and when to continue.
- **Educational preamble**: each session opens with a short plain-language note —
  what this interview is, what it costs, that it can be paused and resumed —
  written for an operator who has **not** read the chorus docs.

### Degradation summary (deferred / skipped)

If the operator leaves the interview before it completes, the unanswered needs
**stay open gaps** (provisional, per `understanding-record.md`) and the round's
verdict MUST carry an explicit **degradation summary**: how many gaps remain
unanswered and which findings are affected — so a skipped interview is an
*informed* trade-off, never a silent quality drop.

## Write-back (orchestrator, after answers)

- **project-wide** answer → draft a proposed addition to the addendum's
  "Project understanding" section; **operator accepts** → it lands in the
  **authoritative** addendum (`contracts/addendum-project-understanding.md`).
  Every lens that asked now references it, and may **cache** it with a
  reconciliation locator (FR-023).
- **lens-specific** answer → write to the asking advisor's record as an
  `operator-confirmed` entry (`scope: lens-specific`).

## Invariants

- Orchestrator owns the interview; advisors never interview directly (N+1).
- Exactly one batched interview per round.
- No project-wide fact written to the addendum without operator acceptance
  (SC-008).
- A gap left unanswered stays an **open gap** in the record (provisional; surfaced
  on any dependent finding) — never silently dropped.
