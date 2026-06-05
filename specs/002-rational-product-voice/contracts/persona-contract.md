# Contract — Constraint-and-Flow Advisor within the chorus

A persona has no API; its "contract" is the set of obligations it must honour at each chorus phase
gate. These are the testable interface points between the new voice and the existing machinery
(`skill/chorus-review/SKILL.md`, `INTEGRATION-LAYER.md`). Each row is an obligation a chorus dry-run
(quickstart.md) can observe.

## Phase 0.5 — RSVP (self-selection)

- **MUST** receive the same brief and reply JOIN / ABSTAIN itself; the orchestrator never infers it
  (invariant I2). Reply ≤ 80 words.
- **MUST** JOIN when scope, sequencing, or product value is at stake (FR-002).
- **MUST** be able to ABSTAIN, or JOIN and state "nothing deferrable this round," rather than
  manufacturing a finding (FR-003, US1 scenario 2).

## Phase 1 — Round 1 findings (evidence gate I8)

- **MUST** clear the I8 evidence gate. Because deferral findings rarely have a `file:line` anchor, the
  sanctioned form is a **falsifiable constraint argument**: named constraint + throughput/cost-of-delay
  reasoning + cheapest settling experiment, tagged as `[principle]`-class evidence (FR-007).
- **MUST** express each finding as a defer / cut / sequence judgement carrying explicit opportunity cost
  (bought vs. paid) and the hypothesis that settles it (FR-004).
- **MUST** be attributable to the governing belief and distinguishable in voice from craft findings
  (FR-006, SC-002).
- **MUST NOT** emit `[unsupported]` findings expecting inclusion (they are excluded from the matrix).

## Phase 3 — Conflict reconciliation

- When the advisor and a craft/correctness persona disagree on the same item, the round **MUST** record a
  priced trade-off: both positions, cost-now vs. cost-of-deferring, and the resolving experiment — not an
  auto-resolution toward "more rigor" or "ship it" (FR-008, SC-003).
- If the craft side is a hard correctness / security / data-integrity invariant, that side **wins** and the
  item is marked **ineligible for deferral** (FR-009, SC-004). The advisor's reach stops there.

## Phase 4 — Ranking

- **MUST** contribute a deferability / cost-of-learning dimension (CD3 / cost of delay) to the existing
  Cost / Value / Convergence scoring (FR-011, US3).
- A cheap high-information experiment **MAY** outrank an expensive low-information correctness investment,
  with recorded rationale (SC-007).
- Counts as **exactly one** voice; **MUST NOT** trump or veto craft findings (FR-010).

## Cross-phase invariants

- **Additive only**: the advisor's presence does not remove, silence, or down-weight any existing persona;
  a round can still surface the full prior set of craft/correctness findings (FR-014, SC-006).
- **Cheap-and-informative, not merely fast**: the counterweight rejects work — including reckless shipping —
  that yields no learning (zero throughput), not only slow work (FR-012).
- **No new flow**: the advisor uses the existing phases unchanged; it introduces no new phase, gate, or
  artifact location (spec scope boundary).
