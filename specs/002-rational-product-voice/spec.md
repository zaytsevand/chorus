# Feature Specification: Constraint-and-Flow Advisor (Rational Product-First Counterweight)

**Feature Branch**: `002-rational-product-voice`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "i feel like the current chorus is disbalanced and will benefit from a strenghtening of a rational approach. Let's add a voice that will advocate for rational decision making and product-first approach agressively trimming side branches if they could be defered. Here's a moto for it: Нет такой опции как правильное принятие решений. Важна только скорость итераций проверки гипотез. Всё правильные решения -- это исправление ошибок в неправильных. Противовес -- надо стремиться минимизировать число неправильных на одно правильное"

## Context & Motivation

The chorus roster today is weighted toward craftsmanship and correctness voices — domain
modelling (Evans), architecture characteristics (Richards), clean structure (Uncle Bob),
simple design (Beck), human-centred design (Norman), adversarial product critique (Cooper),
delivery/ops, and security/trust. Every one of these voices is biased, by construction,
toward *doing the thing well*. None is structurally responsible for asking whether the thing
should be done **now**, **at all**, or **after a cheaper hypothesis test**.

The result is a chorus that reliably pushes toward more rigor, more structure, and more
coverage — and never toward deferral. The user experiences this as **disbalance**: the
review surfaces twelve ways to make something more correct and zero arguments for cutting it.

This feature adds a single counterweight voice whose entire remit is rational,
product-first prioritisation. Its governing belief (translated from the user's motto):

> There is no such thing as a "correct decision." Only the speed of hypothesis-testing
> iterations matters. Every correct decision is the correction of an error in a wrong one.
> The counterweight: strive to minimise the number of wrong decisions per right one.

In other words: the goal is not to avoid mistakes (impossible) but to make them **cheap,
fast, and informative** — and to refuse work that buys correctness the project cannot yet
justify paying for.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A deferral voice in the room (Priority: P1)

A user runs a chorus round on a feature or codebase area. The craft-and-correctness
personas self-select and pile up findings, most of which argue for *adding* rigor. The user
wants at least one voice in the round that reads the same material and asks the opposite
question: which of this is deferrable, which is gold-plating, and what is the cheapest
experiment that would tell us whether any of it matters?

**Why this priority**: This is the whole point of the request — the chorus is missing the
deferral/opportunity-cost lens entirely. A single round in which this voice participates and
emits even one defensible "defer / cut / sequence behind a hypothesis test" recommendation
restores the missing axis and is independently valuable.

**Independent Test**: Run a chorus round on any area where the other personas recommend
non-trivial investment. Confirm the new advisor self-selects via the normal RSVP flow, reads
the same anchor files, and produces at least one recommendation framed as *defer / cut /
sequence* with an explicit opportunity-cost rationale (what is bought, what is paid, what
hypothesis would settle it).

**Acceptance Scenarios**:

1. **Given** a chorus round where craft personas recommend new abstractions, tests, or
   structure, **When** the new advisor participates, **Then** the round's output contains at
   least one recommendation to defer, cut, or sequence work behind a cheaper validation step,
   each with a stated cost/benefit and the hypothesis it would test.
2. **Given** a round where every surfaced finding is genuinely load-bearing and nothing is
   safely deferrable, **When** the new advisor evaluates it, **Then** it may decline to
   self-select (RSVP "no") or explicitly state "nothing deferrable this round" rather than
   manufacturing a deferral to justify its presence.
3. **Given** the new advisor's recommendations, **When** the user reads the artifact, **Then**
   each one is attributable to the advisor's stated belief (iteration speed over decision
   "correctness") and is distinguishable in voice from the craft personas' findings.

---

### User Story 2 - Opportunity cost made explicit in conflict reconciliation (Priority: P2)

When a craft-or-correctness persona recommends investment and the product voice argues it is
deferrable, the user wants the disagreement recorded as an explicit, priced trade-off — not
silently resolved in favour of "more rigor" (the chorus's default lean) nor in favour of
"ship it" (the new voice's default lean).

**Why this priority**: The counterweight only rebalances the chorus if its dissent survives
reconciliation. If conflicts still collapse toward the majority of craft voices, the
disbalance returns. This story makes the tension visible and decidable by the user.

**Independent Test**: Construct a round with a direct conflict between a craft persona's
"invest now" finding and the product voice's "defer behind a test" position. Confirm the
reconciliation output presents both sides with their costs, names the hypothesis that would
resolve the bet, and leaves the user a clear decision rather than auto-resolving.

**Acceptance Scenarios**:

1. **Given** a craft persona and the product voice reach opposing recommendations on the same
   item, **When** reconciliation runs, **Then** the artifact records both positions, the cost
   of acting now vs. deferring, and the cheapest experiment that would settle which is right.
2. **Given** the product voice argues to cut work that another persona flags as a hard
   correctness or security invariant, **When** reconciliation runs, **Then** the hard
   invariant wins and the artifact notes that this item was **not** eligible for deferral.

---

### User Story 3 - Deferability as a ranking dimension (Priority: P3)

The user wants the chorus's final ranked recommendations to reflect not just severity and
craft value but also *deferability* and *cost-of-learning* — so that cheap, high-information
experiments rank above expensive, low-information correctness work.

**Why this priority**: Ranking is where the review becomes action. Adding an iteration-speed /
opportunity-cost dimension makes the rebalanced judgement flow all the way through to what the
user does first. Valuable, but it depends on US1 existing and is a refinement rather than the
core fix.

**Independent Test**: Run a full round through ranking. Confirm the final ranking reflects a
deferability / cost-of-learning dimension contributed by the new advisor, and that a cheap
validating experiment can outrank an expensive correctness investment when justified.

**Acceptance Scenarios**:

1. **Given** a completed round, **When** recommendations are ranked, **Then** the ranking
   accounts for a deferability / cost-of-learning dimension sourced from the new advisor.
2. **Given** two recommendations of comparable severity, **When** one is a cheap hypothesis
   test and the other an expensive correctness investment, **Then** the ranking can place the
   cheap experiment higher with a recorded rationale.

---

### Edge Cases

- **Nothing to trim**: A round where all findings are load-bearing. The advisor must be able
  to abstain or say "nothing deferrable" rather than inventing scope to cut. (Covered by US1
  scenario 2.)
- **Over-trimming a load-bearing invariant**: The advisor proposes deferring something that is
  actually a hard security, correctness, or data-integrity invariant. Hard invariants must
  override the deferral; the advisor's reach stops at genuinely optional work. (Covered by US2
  scenario 2.)
- **Becoming the new dominant voice**: A counterweight that overcorrects re-introduces
  disbalance in the opposite direction. The advisor must argue opportunity cost, not veto
  craft wholesale, and its weight in reconciliation/ranking must be one voice among the
  roster, not a trump card.
- **Evidence gate for deferral**: The chorus requires every finding to carry evidence (a
  concrete code anchor or a principle tag). Deferral recommendations often have no single line
  of code to point at. The advisor needs a sanctioned evidence form — an explicit
  opportunity-cost statement and the hypothesis under test — that satisfies the evidence gate
  without a `file:line` anchor.
- **Reckless-speed misread**: Speed-over-correctness could be misread as "ship anything fast."
  The motto's counterweight clause (minimise wrong-per-right) must be expressed so the advisor
  optimises for *cheap, informative* mistakes, not merely fast ones — it still rejects work
  that produces no learning.
- **No product context available**: The advisor reasons about product value and hypotheses; a
  pure-infrastructure repo with no user-facing hypotheses may give it little to anchor on. It
  should scope to delivery/iteration-cost arguments in that case rather than fabricate product
  claims.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The chorus roster MUST include a new advisor whose remit is rational,
  product-first prioritisation — deferral, cutting, and sequencing of work — as a deliberate
  counterweight to the existing craft-and-correctness voices.
- **FR-002**: The new advisor MUST participate through the same self-selection (RSVP) flow as
  every other persona, opting into rounds where scope, sequencing, or product value is at
  stake and declining rounds where it has nothing to contribute.
- **FR-003**: The new advisor MUST be able to decline a round explicitly (or state "nothing
  deferrable") rather than manufacturing recommendations to justify participation.
- **FR-004**: The advisor's recommendations MUST be expressed as defer / cut / sequence
  judgements, each carrying an explicit opportunity-cost rationale: what correctness or value
  is bought, what it costs, and the cheapest hypothesis test that would settle whether it is
  worth paying for now.
- **FR-005**: The advisor MUST carry a stated governing belief derived from the user's motto —
  decision "correctness" is a myth, iteration speed of hypothesis testing is the metric, right
  decisions are corrections of wrong ones, and the aim is to minimise wrong decisions per right
  one — and its outputs MUST be traceable to that belief.
- **FR-006**: The advisor's voice and recommendations MUST be distinguishable from the other
  personas' so a reader can attribute the deferral lens to it specifically.
- **FR-007**: The advisor MUST satisfy the chorus's evidence requirement through a sanctioned
  form for deferral arguments (an explicit opportunity-cost statement plus the hypothesis under
  test) when no single `file:line` anchor applies.
- **FR-008**: During conflict reconciliation, a disagreement between the advisor and a
  craft/correctness persona MUST be recorded as an explicit, priced trade-off — both positions,
  their costs, and the experiment that would resolve them — rather than silently resolved
  toward either default.
- **FR-009**: The advisor MUST NOT be able to defer or cut work that another persona has flagged
  as a hard correctness, security, or data-integrity invariant; such items MUST be marked
  ineligible for deferral in the output.
- **FR-010**: The advisor MUST count as exactly one voice in reconciliation and ranking — it
  rebalances by argument, not by veto power over craft findings.
- **FR-011**: The final ranking MUST be able to reflect a deferability / cost-of-learning
  dimension contributed by the advisor, allowing a cheap high-information experiment to outrank
  an expensive low-information correctness investment when justified.
- **FR-012**: The advisor's counterweight clause MUST be expressed so it optimises for cheap and
  informative mistakes, not merely fast ones — it MUST still reject work (including reckless
  shipping) that yields no learning.
- **FR-013**: The roster surfaces that enumerate the personas (review skill, integration model,
  and user-facing documentation) MUST be updated so the new advisor is counted, described, and
  discoverable alongside the existing voices.
- **FR-014**: Adding the advisor MUST NOT remove, silence, or down-weight any existing persona;
  the change is additive and restores a missing axis rather than replacing an existing one.

### Key Entities *(include if feature involves data)*

- **Constraint-and-Flow Advisor** (`constraint-and-flow-advisor`): A new persona definition.
  Attributes: governing belief (Theory-of-Constraints spine fused with the motto, the binding
  constraint named as learning-loop cycle time), the defer/cut/sequence judgement vocabulary
  expressed as *subordinate the non-constraint*, a sanctioned non-`file:line` evidence form (a
  falsifiable constraint argument: named constraint + throughput/cost-of-delay reasoning +
  cheapest settling experiment), scope of reach (optional work only — stops at hard invariants),
  and its relationship to the other personas (counterweight holding global throughput against
  their local optimisation, one voice among many). Bedrock (Five-Whys terminus): a 99%-defensible
  claim that a piece of work is off the learning constraint.
- **Deferral recommendation**: A unit of advisor output. Attributes: the work proposed for
  deferral/cut/sequencing, the opportunity cost (bought vs. paid), the cheapest hypothesis test
  that would resolve it, and its eligibility status (deferrable vs. blocked by a hard invariant).
- **Priced trade-off record**: The reconciliation artifact when the advisor conflicts with a
  craft/correctness persona. Attributes: both positions, cost of acting-now vs. deferring, the
  resolving experiment, and the user-facing decision left open.
- **Deferability ranking dimension**: The cost-of-learning / iteration-speed axis the advisor
  contributes to final ranking, alongside the existing severity and value dimensions — computed
  via Reinertsen's cost-of-delay / CD3 so a cheap high-information experiment can outrank an
  expensive low-information correctness investment by economics rather than assertion.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a chorus round where craft personas recommend non-trivial investment, the new
  advisor self-selects and produces at least one defer / cut / sequence recommendation with an
  explicit opportunity-cost rationale and a named hypothesis test.
- **SC-002**: A reader can attribute every deferral recommendation in an artifact to the new
  advisor's governing belief, with no deferral recommendation mis-attributable to a craft
  persona.
- **SC-003**: In a round with a genuine conflict between an "invest now" craft finding and a
  "defer behind a test" position, the reconciliation output records both sides with their costs
  and the resolving experiment, in 100% of such conflicts, rather than auto-resolving.
- **SC-004**: When the advisor proposes deferring an item that another persona flagged as a hard
  invariant, the artifact marks that item ineligible for deferral in 100% of such cases.
- **SC-005**: After this change the roster count and persona descriptions in the review skill,
  the integration model, and the user-facing documentation all agree on the new total and all
  name the advisor.
- **SC-006**: No existing persona is removed or down-weighted; a round can still surface the full
  prior set of craft/correctness findings with the new voice added (additive-only check).
- **SC-007**: In ranking, a cheap high-information experiment can be placed above an expensive
  low-information correctness investment with a recorded rationale, demonstrating the deferability
  dimension is active.

## Assumptions

- **Persona synthesis (confirmed)**: Like the existing synthesized personas (Delivery-and-Ops,
  Security-and-Trust), this voice blends recognised thinkers rather than copying one — published
  as `constraint-and-flow-advisor`. Its **spine** is Eliyahu Goldratt's Theory of Constraints
  (first principles: a system has exactly one binding constraint at a time; total throughput is
  governed by it alone; the sum of local optima is not the global optimum; identify → exploit →
  subordinate → elevate → repeat, never letting yesterday's policy become today's constraint).
  Its **load-bearing modernization** is Donald Reinertsen's *Principles of Product Development
  Flow* — cost of delay, CD3 (cost-of-delay ÷ duration), WIP limits, small batches, and queueing
  theory — which translates Goldratt's plant into software product development and supplies the
  math behind the deferability ranking (FR-011) and the priced trade-off (FR-008). Cited as
  lineage and flavour, not co-equal voices: Eric Ries (Build–Measure–Learn cycle time as the
  quantity to minimise), Annie Duke (decision quality and the expected value of quitting/
  deferring), and Marty Cagan / Teresa Torres (riskiest-assumption discovery for the cheapest
  settling experiment). **Naming the constraint is what keeps the persona from naïve
  manufacturing-metaphor:** the binding constraint of a software product is *not* the codebase or
  code quality — it is the cycle time of the validated-learning loop. The codebase is congealed
  hypothesis: a guess awaiting verification, whose only economic meaning is whether it speeds up
  or slows down the next verdict. This resolves the spec's two standing edge cases by
  construction — the "bottleneck of the codebase" misread (the bottleneck is never the codebase)
  and the "reckless-speed" misread (a loop that yields no learning has zero throughput, so it is
  rejected, not rushed).
- **Mechanism reuse**: The advisor reuses the existing chorus machinery — per-round RSVP
  self-selection, cross-evaluation, conflict reconciliation, and ranked recommendations — rather
  than introducing a new flow. It is "another persona," structurally identical in plumbing to the
  Security-and-Trust addition.
- **Scope boundary**: This feature adds the voice and integrates it into the roster, evidence
  gate, reconciliation, and ranking. It does **not** redesign the chorus phases, change the
  artifact location (`docs/reviews/YYYY-MM-DD-chorus-review.md`), or alter any other persona.
- **Evidence gate**: The chorus's existing requirement that findings carry evidence (a code
  anchor or a principle-style tag) is extended, not weakened — the advisor gets a sanctioned
  deferral-evidence form so it can clear the same bar without a `file:line` anchor.
- **Relationship to sibling feature**: The advisor-skill-memory feature
  (`001-advisor-skill-memory`) is independent. This advisor could later request project
  preflight knowledge (e.g., the product's current bets/hypotheses) through that mechanism, but
  this spec does not require it.
- **Calibration**: Like Delivery-and-Ops and Security-and-Trust, the advisor is calibrated for
  small-team / startup scale, where the cost of over-investing in correctness is highest and the
  deferral lens pays back fastest.
