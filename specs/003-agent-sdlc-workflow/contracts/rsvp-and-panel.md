# Contract: RSVP reply & panel seating

Governs how a gate's panel is selected. Reuses the base round's RSVP mechanism;
adds a per-gate relevance score and the cap-of-five seating rule.

## RSVP reply (per persona, per gate)

```
{
  "lens":      "<persona name>",
  "decision":  "JOIN" | "ABSTAIN",
  "relevance": 0 | 1 | 2 | 3,        // REQUIRED on JOIN; how load-bearing this lens is for THIS gate
  "reason":    "<one line>"
}
```

- The `decision` is the **persona's** call, never the orchestrator's inference
  (S2 / I2).
- RSVP fires **independently at every gate**; a reply at Gate A does not carry to
  Gate B or C (S2).
- `relevance` uses the same 0–3 scale as the coverage chart (0 = not my lens,
  3 = squarely my lens).

## Seating rule

Given the set of `JOIN` replies for a gate:

1. **J ≥ 6** → seat the **top 5 by `relevance`** (descending integer sort). If a
   tie spans the 5th seat (e.g. three 2s competing for one slot), **surface the
   tie to the operator** to break. The orchestrator never breaks it by judging
   lens merit (S3 / I2).
2. **3 ≤ J ≤ 5** → seat all joiners.
3. **J < 3** → re-ping once. If still `J < 3`, **abort the gate honestly** and
   record the abstention in the ledger (existing quorum rule).

## Expected (not enforced) attendance

The roster self-selects; these are the *typical* RSVP outcomes per gate, used
only to sanity-check that the scale fits — never as a fixed roster:

- **Gate A (design)**: product (Cooper / Norman), architecture (Richards),
  delivery-and-ops, security-and-trust, + constraint-and-flow (scope/defer).
- **Gate B (plan/tasks)**: architecture, domain (Evans), language lens (e.g.
  Guido, if code is in scope), delivery-and-ops, security-and-trust.
- **Gate C (implementation)**: same technical set as Gate B.

## Invariants enforced here

- **S2** — independent RSVP per gate.
- **S3** — cap 5; overflow by persona-declared score; ties to operator.
