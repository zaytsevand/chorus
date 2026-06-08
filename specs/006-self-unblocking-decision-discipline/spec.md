# Feature Specification: Self-Unblocking Decision Discipline

**Feature Branch**: `006-self-unblocking-decision-discipline`

**Created**: 2026-06-08

**Status**: Draft

**Input**: Approved design — `docs/superpowers/specs/2026-06-08-self-unblocking-decision-discipline-design.md` (supersedes parked feature 005 / GitHub issue #3)

## Context

The chorus-review agent-SDLC pulls in the human operator at many points — RSVP
seating ties, gate 🔴 resolution, sign-off, exploratory-phase gaps, scope
confirmation, loop escalation. Today most of these **hard-block** and wait. Parked
feature 005 tried to remove one of them (the seating tie) by **mechanically replicating
the operator's judgment**, and failed its own design gate: replicating judgment is
forbidden by the chorus's own invariants (the orchestrator must not judge lens merit).

This feature reframes the problem after Martin Fowler's 2026-04-29 *Fragments* article:
**don't replicate judgment — partition it.** A *computational sensor* classifies every
operator-facing decision as mechanically-decidable, reversible-judgment, or
irreducible-judgment, and the workflow **runs forward by default** — auto-resolving the
first, proceeding-with-a-recorded-default on the second, and stopping the human only for
the third, framed instantly and surfaced for review. Operator involvement collapses to
the few calls that are irreducibly theirs.

This is Markdown skill/prompt-orchestration authoring; there is no runtime code.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The workflow self-unblocks the decidable (Priority: P1)

When a decision point is mechanically decidable or a reversible/low-stakes judgment, the
workflow resolves it and proceeds **without asking the operator** — recording what it
did. The operator is no longer interrupted for decisions a sensor can settle or safely
default.

**Why this priority**: This is the feature's core value — minimizing operator
involvement. It is independently demonstrable on any single decision point (e.g. a
seating tie) and delivers the "self-unblocking" half of the goal.

**Independent Test**: Run a gate where the RSVP seating ties at the cap. The workflow
seats a recorded default panel and proceeds with **zero** operator prompts; the seating
appears on a review surface with a one-action override.

**Acceptance Scenarios**:

1. **Given** a decision point classified mechanically-decidable (🟢), **When** it is
   reached, **Then** the workflow auto-resolves it, writes an audit record, and proceeds
   with no operator prompt.
2. **Given** a decision point classified reversible-judgment (🟡), **When** it is
   reached, **Then** the workflow proceeds with a recorded default and posts a review
   card carrying the default, the runner-up(s), the sensor evidence, and a one-action
   override with its cost — no operator prompt.
3. **Given** the RSVP seating ties at the cap, **When** the panel is seated, **Then** it
   is a 🟡 decision (recorded default + async override), not an operator interruption.

---

### User Story 2 - The operator is still stopped for genuine, irreversible judgment (Priority: P1)

When a decision is genuine judgment **and** irreversible or high-stakes, the workflow
**hard-blocks** and asks the operator — instantly, minimally framed, with the specific
choice, its options, their consequences, and the evidence. The "balanced" half of the
goal: autonomy never silently makes a call that is irreducibly the operator's.

**Why this priority**: Without this guarantee, self-unblocking becomes runaway autonomy.
It is the safety counterweight and must ship with US1.

**Independent Test**: Reach a 🔴 decision (e.g. a gate's loop bound, or a waiver). The
workflow halts, presents a single framed decision card, and does not proceed until the
operator acts; no default is silently applied.

**Acceptance Scenarios**:

1. **Given** a decision classified irreducible-judgment (🔴), **When** it is reached,
   **Then** the workflow hard-blocks, applies no default, and surfaces a framed ask with
   2–4 options and their consequences.
2. **Given** a gating 🔴 finding, **When** it has not cleared after the bounded
   incorporation cycles, **Then** the decision escalates to 🔴 and the operator is asked.
3. **Given** any 🔴 decision, **When** the operator has not yet acted, **Then** the
   workflow never proceeds past it and never records a silent default.

---

### User Story 3 - Gate 🔴 findings self-heal up to the loop bound (Priority: P2)

A gating 🔴 finding no longer stops to ask "incorporate or waive?" each time. The
workflow **auto-runs the incorporation cascade** (revise the spec, regenerate downstream
artefacts) and **re-runs the gate** to verify — repeating until the finding clears or the
bounded number of cycles is reached, at which point it escalates to the operator.

**Why this priority**: This is the largest reduction in operator involvement, but it
depends on US1/US2's banding being in place, so it lands second.

**Independent Test**: Produce a gate with a gating 🔴 that a single incorporation pass
clears. The workflow incorporates, re-runs the gate, observes the 🔴 cleared, and
proceeds — with the operator asked **zero** times, and each cycle recorded on the review
surface.

**Acceptance Scenarios**:

1. **Given** a post-tally gating 🔴 and the cycle count below the bound, **When** the
   gate halts, **Then** the workflow auto-runs the incorporation cascade and re-runs the
   gate without an operator prompt, recording the cycle.
2. **Given** the incorporation clears the 🔴 on re-run, **When** the gate passes, **Then**
   the workflow proceeds with no operator involvement beyond the review surface.
3. **Given** the 🔴 persists after the third cycle, **When** the bound is reached, **Then**
   the decision escalates to a 🔴 operator ask (escalate or waive).
4. **Given** a finding can only be resolved by waiving a real concern, **When** that is
   the only path, **Then** it is a 🔴 ask, not an auto-waiver.

---

### User Story 4 - Every decision is reviewable and reversible (Priority: P2)

Every decision — auto-resolved, defaulted, or escalated — produces a record on a review
surface, scaled to its stakes, so the operator can reconstruct what was decided and why,
and reverse any provisional (🟡) decision after the fact.

**Why this priority**: The article's "build better review surfaces" — the trust
mechanism that makes self-unblocking acceptable. Reviewable-but-not-yet-overridable is
still a complete slice.

**Independent Test**: After a run with mixed 🟢/🟡/🔴 decisions, a reviewer reconstructs
each from the ledger alone (what was decided, the sensor evidence, the alternatives) and
exercises a 🟡 override, observing the documented reversal cost.

**Acceptance Scenarios**:

1. **Given** any decision, **When** it is resolved, **Then** a decision record exists
   capturing its point, band, sensor signal + evidence, resolution, chosen option,
   alternatives, and (for 🟡) an override action with its cost.
2. **Given** a 🟡 decision on the review queue, **When** the operator overrides it,
   **Then** the workflow re-runs from the recorded point at the documented cost.
3. **Given** a completed run, **When** a reviewer reads the ledger, **Then** every
   decision is reconstructable without consulting the orchestrator's reasoning.

---

### User Story 5 - The seating signal discriminates (Priority: P3)

The blunt 0–3 self-declared relevance score is replaced by a sharper, evidence-anchored
signal so seating bands crisply and ties are rarer and more defensible.

**Why this priority**: A quality improvement to the sensor; the workflow already
tolerates ties (they are 🟡), so this sharpens defaults rather than being load-bearing
for correctness — hence last.

**Independent Test**: Two personas RSVP the same gate; the one that cites a concrete
round-context delta and a stakes hook sorts above the one that cannot, and the seating
record shows the evidence that separated them.

**Acceptance Scenarios**:

1. **Given** a persona JOINs without citing any concrete round-context delta, **When**
   seating runs, **Then** that persona is treated as not-applicable (abstain-eligible)
   and is not seated over a persona that cited one.
2. **Given** two seated candidates, **When** the seating sensor sorts them, **Then** it
   orders by applicability evidence, then expected-stakes, and records the anchors used.

---

### Edge Cases

- **All joiners still tie after the sharper signal**: the seating is 🟡 (recorded default
  + async override), never an operator stop — the signal need not perfectly
  discriminate.
- **An incorporation cycle makes things worse** (new 🔴 appears): counts as a cycle
  toward the bound; the review surface shows the regression; escalates at the bound.
- **The operator overrides a 🟡 after the workflow has moved on**: the override re-runs
  from the recorded point; downstream provisional decisions dependent on it are
  re-evaluated (their records note the dependency).
- **A decision type is not in the catalog**: it defaults to 🔴 (ask) — unclassified
  means "treat as judgment until declared," never silently auto-resolve.
- **A persona over-flags a reversible gap as blocking**: it becomes a 🔴 ask
  (conservative); under-flagging a load-bearing gap is mitigated by the degradation note
  on the 🟡 default.
- **The operator is fully absent for a 🔴**: the workflow halts and records the pending
  decision plus a degradation summary; it does not invent a default.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST route every operator-facing decision point through a
  **sensor** that assigns one of three bands: 🟢 mechanically-decidable, 🟡
  reversible-judgment, 🔴 irreducible-judgment (irreversible/high-stakes).
- **FR-002**: A 🟢 decision MUST be auto-resolved and recorded, and the workflow MUST
  proceed without an operator prompt.
- **FR-003**: A 🟡 decision MUST proceed with a **recorded default** and post a review
  entry; it MUST NOT prompt the operator synchronously. (Per the chosen behavior, 🟡
  always proceeds — it is not modulated by operator presence.)
- **FR-004**: A 🔴 decision MUST hard-block the workflow, apply no default, and surface an
  instant, minimally-framed ask with the specific choice, 2–4 options, their
  consequences, and the sensor evidence.
- **FR-005**: The band of each decision **type** MUST be **declared once** in a decision
  catalog. The orchestrator MUST NOT infer a decision's band; per-instance refinement
  MUST use only mechanical predicates (e.g. sort strictness, a cycle counter,
  artefact-presence) or persona-declared flags.
- **FR-006**: An **unclassified** decision (no catalog entry) MUST default to 🔴 (ask) —
  never auto-resolved.
- **FR-007**: Every decision MUST emit a **decision record** capturing: point, band,
  sensor signal, sensor evidence, resolution (auto / default-applied / escalated), chosen
  option, alternatives weighed, and — for 🟡 — an override action with its cost.
- **FR-008**: Decision records MUST be rendered to a review surface **scaled by band**: 🟢
  → an audit log entry; 🟡 → a review-queue card (default + runner-up + evidence +
  one-action override) in a dedicated ledger section; 🔴 → a live framed decision card.
- **FR-009**: A 🟡 decision MUST be **reversible**: the operator can override it from the
  review queue, and the workflow re-runs from the recorded point at the documented cost.
- **FR-010**: The RSVP seating decision MUST be 🟢 when the seating signal yields a strict
  order at the cap boundary (auto-seat), and 🟡 when it ties at the boundary (seat a
  recorded default panel, queue for override). It MUST NOT escalate a seating tie to a 🔴
  operator ask.
- **FR-011**: A post-tally **gating 🔴 finding** MUST be handled as a 🟡 decision while the
  incorporation cycle count is below the bound: the workflow auto-runs the incorporation
  cascade and **re-runs the gate** to verify, recording each cycle.
- **FR-012**: A gating 🔴 finding MUST escalate to a 🔴 operator ask when the cycle bound
  is reached without clearing, **or** when the only resolution path is a **waiver** of a
  real concern. A waiver MUST never be applied automatically.
- **FR-013**: The self-heal loop MUST preserve the existing gate guarantees: no 🔴 is
  passed silently (auto-incorporation resolves it, the re-run verifies), incorporation
  revises the spec and regenerates downstream artefacts (no hand-patching), and the loop
  is bounded.
- **FR-014**: The RSVP seating signal MUST be **two evidence-anchored axes** replacing the
  single 0–3 score: (A) **applicability** — the persona cites ≥1 concrete round-context
  delta its lens touches; an un-cited claim is treated as not-applicable; (B) **expected
  stakes** — the finding class expected (🟢/🟡/🔴-potential) with a one-line evidence hook.
- **FR-015**: The seating sensor MUST sort joiners by (A applicability evidence, then B
  expected stakes), and MUST record the anchors that separated them.
- **FR-016**: The three-band model, the two-axis signal, the decision-record + review
  surfaces, the decision catalog, and the new invariants MUST be authored **once** in a
  single canonical definition and **referenced** (not restated) by both the base-round
  and the lifecycle orchestration documents.
- **FR-017**: The change MUST remain consistent with the existing invariants: the
  orchestrator never decides RSVP for a persona, never judges lens merit, never
  synthesizes a vote, and never passes a 🔴 silently. The new banding MUST add no
  orchestrator judgment surface (it counts and routes; it does not judge).
- **FR-018**: The feature MUST record new invariants stating: band is by declared
  predicate not inference; 🔴 never auto-proceeds; every 🟡 default is recorded and
  reversible; classification is mechanical; signals are evidence-anchored.
- **FR-019**: The feature MUST supersede parked feature 005 / issue #3: the seating tie is
  one 🟡 instance; no axis-coverage or rarity machinery is introduced.

### Key Entities

- **Decision point**: a place in the workflow where the operator is (today) consulted —
  e.g. RSVP seating, a gating 🔴, sign-off, an exploratory gap, scope confirmation.
- **Band**: 🟢 mechanically-decidable / 🟡 reversible-judgment / 🔴 irreducible-judgment —
  the sensor's classification of a decision instance.
- **Sensor signal**: the evidence the band rests on. For seating: the two axes
  (applicability with cited deltas; expected stakes with a hook). For others: the
  mechanical predicate or persona flag.
- **Decision record**: the per-decision audit object (point, band, signal, evidence,
  resolution, chosen, alternatives, override+cost). Rendered to the review surface by
  band.
- **Review surface**: where decision records are presented — an audit log (🟢), a
  provisional-decisions review queue with override actions (🟡), a live framed ask (🔴).
- **Decision catalog**: the declared mapping from each decision type to its band and the
  predicate that refines it per instance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a representative gate whose only operator touchpoints are
  mechanically-decidable or reversible (seating tie, a clearable 🔴), the operator is
  prompted **0** times; the run completes self-unblocked.
- **SC-002**: A gating 🔴 that a single incorporation pass clears is resolved with **0**
  operator prompts (down from 1 per 🔴 today), and each cycle is recorded.
- **SC-003**: In **100%** of cases where a decision is irreducible judgment (loop bound
  reached, waiver required, unclassified decision), the operator IS hard-stopped and **no**
  default is silently applied.
- **SC-004**: Every decision in a run is reconstructable from its decision record alone
  (point, band, evidence, resolution, alternatives) — **100%** coverage; no decision
  proceeds without a record.
- **SC-005**: Every 🟡 decision on the review queue carries a working override that
  re-runs from the recorded point — **100%** are reversible.
- **SC-006**: A seating tie causes **0** operator interruptions (it is 🟡), versus today's
  operator tie-break.
- **SC-007**: The three-band model and its catalog are defined in a **single** canonical
  document referenced by both modes; an inspection finds **no** divergent second copy.
- **SC-008**: With the two-axis signal, a persona that cannot cite a round-context delta
  is **not** seated over one that can, in **100%** of trials — the uniform-score
  degeneracy is removed.
- **SC-009**: The change introduces **0** new orchestrator judgment surfaces — every band
  assignment traces to a declared predicate or a persona-declared flag (auditable in the
  decision records).

## Assumptions

- **🟡 always proceeds** with a recorded default and async review; it is **not** modulated
  by operator presence (the chosen behavior — maximizes self-unblocking).
- **No confidence estimator**: bands come from mechanical predicates and persona flags,
  never an orchestrator-estimated confidence score (which would re-import the judgment
  surface 005 was killed for).
- **Reversibility / "load-bearing" for exploratory gaps** is established by a
  **persona-declared flag** ("this gap blocks my finding"), not orchestrator inference;
  conservative default is 🔴 when a lens flags a load-bearing irreversible gap.
- **The seating default panel's exact tiebreak** (when a tie persists) is a deterministic,
  recorded rule whose precise form is a planning detail — reversibility (🟡 + override)
  makes it non-critical to get "right."
- **Supersedes feature 005 / issue #3**: no axis-coverage or rarity mechanism is built;
  the Gate-A-affirmed pieces (one-definition discipline, the provenance ledger
  generalized into the decision record, evidence-anchored self-declaration) carry forward.
- This is Markdown skill/prompt-orchestration authoring — no runtime code, test harness,
  or deployment beyond `install.sh` redeploying the skill.
- The bands reuse the chorus's existing 🔴🟡🟢 vocabulary applied to **decisions**; this is
  distinct from a **finding's** severity (a severity-🔴 finding produces, at first, a 🟡
  *decision* — auto-incorporate — per FR-011).
