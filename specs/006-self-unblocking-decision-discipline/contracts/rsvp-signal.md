# Contract: RSVP signal (two evidence-anchored axes)

Replaces the single `relevance: 0–3` on each JOIN reply (FR-014/015). Applies to both
modes' RSVP step.

## Reply shape

```text
decision: JOIN | ABSTAIN
applies:  [<cited round-context delta>, ...]   # Axis A — ≥1 for a JOIN; empty → not-applicable
expected: 🟢|🟡|🔴-potential — <one-line evidence hook>   # Axis B
reason:   <one sentence>
```

## Rules

- **Axis A (applicability)** is required for JOIN. Each entry cites a **concrete delta**
  from the round-context the lens touches. A JOIN with empty `applies` is treated as
  **not-applicable** (abstain-eligible) — it is not seated over a lens that cited one
  (SC-008).
- **Axis B (expected stakes)** names the finding class the lens expects if seated, with a
  one-line hook. It is the secondary sort key.
- The seating sensor sorts seated candidates by **(count/quality of `applies`, then
  `expected`)** and records the anchors that separated them in the DecisionRecord.
- Self-declared: the orchestrator counts and sorts; it never assigns axes (I2/D5).
- JOIN/ABSTAIN semantics are unchanged (FR-017); only the relevance scalar is replaced.

## Brief addition

The RSVP brief instructs: "cite the specific round-context delta(s) your lens touches
(no citable delta → ABSTAIN), and name the finding class you expect with a one-line
reason." Cost: negligible (a few tokens per reply).

## Acceptance checks

- A JOIN with empty `applies` does not outrank a JOIN that cited a delta.
- The seating DecisionRecord shows the `applies`/`expected` anchors used to order the
  panel.
- A residual tie after sorting is banded 🟡 (default + override), never a 🔴 operator ask
  (SC-006).
