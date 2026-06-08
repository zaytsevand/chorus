# Contract: RSVP reply (axis-declaration extension)

The only additive change to the RSVP mechanism (FR-015/FR-016). Applies to both modes'
RSVP step.

## Reply shape

A JOIN reply, ≤80 words plus the structured fields:

```text
decision:     JOIN | ABSTAIN
relevance:    <int 0–3>            # unchanged — self-declared relevance for THIS gate
primary_axes: [<axis>, ...]       # NEW — self-declared, from the taxonomy
reason:       <one sentence>       # unchanged
```

## Rules

- `primary_axes` is **required for JOIN**, omitted/ignored for ABSTAIN.
- Axes are drawn from the taxonomy vocabulary supplied in the RSVP brief (the 12 grid
  keys). The brief lists them so declarations are well-formed.
- An axis outside the taxonomy is **recorded but not counted** toward coverage until the
  taxonomy is extended (FR-016).
- The lens declares its **own** axes; the orchestrator validates against the README grid
  seed and counts coverage, but never assigns or overrides axes (I2).
- Declaring `primary_axes` does not change JOIN/ABSTAIN or relevance semantics
  (FR-015): a lens that would have joined still joins; the axes only inform *seating
  under a cap*.

## Brief addition

The RSVP brief gains one line: the axis vocabulary (12 keys with one-word glosses,
copied from the README grid's axis key) plus the instruction "name the primary axis/axes
your lens owns for this target." Cost: negligible (a few tokens per reply).

## Acceptance checks

- A JOIN reply without `primary_axes` is treated as under-specified: the orchestrator
  re-pings that lens once for its axes (it does not guess).
- The seed grid and a joiner's self-declaration agree for the standing roster (a
  consistency check, not a hard gate — a lens may legitimately scope its axes to the
  target).
