# Quickstart: Self-Unblocking Decision Discipline — worked examples

Three decisions through the sensor, by hand, showing the bands and the review surfaces.

## Example 1 — A seating tie (🟡, the parked-005 case, now trivial)

Six lenses JOIN a capped (5-seat) gate. Two-axis signal: five cite a strong delta +
🔴/🟡-potential stakes; the sixth cites the same delta but only 🟢-potential.

- Sensor: catalog row 2 (seating tie at cap). The sort separates the sixth (lower
  expected stakes) → actually **strict** → catalog row 1 → **🟢 auto-seat**. No prompt.
- Had the sort tied at seat 5: catalog row 2 → **🟡**. Seat a recorded default panel,
  post a queue card:

```
DecisionRecord seating-1 [🟡]
  point: RSVP seating tie (cap 5)
  sensor.evidence: applies=[delta-X×6], expected=[🔴,🔴,🟡,🟡,🟡,🟡] — tie at seat 5 between L5,L6
  resolution: default-applied
  chosen: {L1..L4, L5}  · alternatives: {…L6}
  override: "re-run gate from seating with L6 → cost: 1 cycle"
```

Operator is **not** interrupted. No axis-coverage machinery. (Contrast: 005 tried to make
this 🟢 by replicating the operator's judgment and failed Gate A.)

## Example 2 — A gating 🔴 that self-heals (🟡 → proceed)

Gate A tally yields one gating 🔴 (a missing acceptance criterion). `cycle = 1 < 3`.

- Sensor: catalog row 5 → **🟡** (auto-incorporate). The orchestrator runs
  `/speckit-clarify → /speckit-plan` (spec-sourced, S5), then **re-runs Gate A** — the
  re-run is the verifying sensor.
- Re-run tally: the 🔴 cleared. Queue card records the cycle; the workflow proceeds to
  `/speckit-tasks`. **Operator prompted 0 times.**

```
DecisionRecord gateA-🔴-1 [🟡]
  point: gating 🔴 finding (cycle 1/3)
  sensor.evidence: finding F=<id>; incorporation diff = "+SC-011, +FR-020"; re-run tally: F demoted 🟢
  resolution: default-applied (auto-incorporate + re-run)
  chosen: incorporate · alternatives: {escalate, waive}
  override: "revert incorporation commit; re-open F → cost: 1 cycle"
```

S4 holds: the 🔴 was *resolved and verified*, never passed silently.

## Example 3 — A waiver (🔴, the human is needed)

Same gate, but the only way to clear the 🔴 is to drop a real concern (a deliberate scope
cut). `cycle` irrelevant — a waiver is needed.

- Sensor: catalog row 5 → escalate to **🔴** (waiver-only path). Hard-block. Live card:

```
DecisionRecord gateA-🔴-2 [🔴]
  point: gating 🔴 finding — waiver required
  sensor.evidence: F=<id>; incorporation cannot resolve without dropping requirement R
  resolution: escalated
  chosen: <pending operator>  · alternatives: {waive R (record rationale), escalate to redesign}
  override: n/a (RED never auto-proceeds — D2)
```

The workflow **waits**. No default is applied. This is the irreducible-judgment case the
discipline preserves for the operator (S4/D2).

## What these prove

- 🟢/🟡 decisions self-unblock (Examples 1–2): the operator is prompted **0** times across
  a seating tie and a clearable 🔴 (SC-001/002/006).
- 🔴 decisions still stop the human (Example 3): a waiver never auto-applies (SC-003/D2).
- Every decision left a replayable DecisionRecord with its sensor evidence (SC-004), and
  the 🟡s carry working overrides (SC-005).
- No band came from orchestrator judgment — each traces to a catalog row + a mechanical
  predicate or persona flag (SC-009).
