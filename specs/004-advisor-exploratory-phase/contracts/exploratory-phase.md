# Contract: Exploratory Phase (procedure)

Runs for each RSVP joiner after RSVP and before findings (Round 1 in the
project-state round; before the Author stage in an SDLC gate). Abstainers skip it.

**Cheapest-subset-first (FR-020)**: the steps are ordered cheapest-first —
profiles + reference harvest + one interview session run before any optional
deeper analysis — and the per-round cost is operator-controlled (FR-019), so the
phase shows value before more budget is spent.

**Memory is an index, not an endpoint (FR-021)**: every record entry is a locator
into live material; a finding re-grounds in the source, never in persisted memory
alone. A stored quote is a navigational hint, never evidence.

## Steps

The procedure — 8 steps (load profile → reuse + deltas → reference-first harvest,
addendum-first → bounded, operator-budget-controlled analysis → gap-questions →
emit record → orchestrator's sessioned operator interview → coverage check) — is
defined **canonically in `skill/chorus-review/EXPLORATORY-PHASE.md`** and is
**not restated here** (single source of truth; this contract would otherwise drift
from the mechanic). This contract pins only the schema, pre/postconditions, and
must-nots below.

Locator note: a lens's profile loads from its **agent file**
(`agents/<persona>.md`) — the schema for that section is
`contracts/information-needs-profile.md`, which is *not* where the profile lives.

## Preconditions

- RSVP complete; joiners known.
- Addendum located (or its absence handled as in the base procedure).

## Postconditions

- Every joiner has an understanding record whose profile needs are each:
  referenced, inferred (flagged provisional), operator-confirmed, or an explicit
  open gap.
- Project-wide operator-confirmed facts are authored in the addendum
  (operator-accepted, authoritative); any record copy is a cache carrying a
  reconciliation locator (FR-023), not a rival home.
- Findings produced afterward trace to the record **and re-ground in the live
  source** (SC-001/FR-021).
- The profile-coverage fitness function passes for each joiner (FR-022/SC-010).

## Must-not

- No advisor interviews the operator directly (orchestrator owns N+1).
- No copying of referenced sources beyond a short quote.
- No treating persisted memory as a finding's evidentiary endpoint (FR-021).
- No auto-write to the addendum without operator acceptance.
- No re-exploration of needs untouched by deltas / not stale.
