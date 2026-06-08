# Feature Specification: RSVP Axis-Coverage Tie-Break

**Feature Branch**: `005-rsvp-axis-coverage-tiebreak`

**Created**: 2026-06-08

**Status**: **Parked** (2026-06-08) — Gate A design review blocked the design with 3 🔴
(FR-014/SC-001 falsified by the worked example; "axis coverage" is the wrong core
concept; SSOT violation), and the panel found the mechanism marginal on the standing
near-axis-disjoint roster. Uniform-disjoint seating ties are operator territory.
Parked pending a roster with real axis redundancy / rarity gradients. Full rationale:
[`agent-sdlc-log.md`](./agent-sdlc-log.md). Issue #3 closed with this finding.

**Input**: GitHub issue #3 — "RSVP seating: try max axis-coverage panel before asking the operator to break a relevance tie"

## Context

When a chorus review caps a panel at five seats, more than five lenses can JOIN.
Today the integration layer seats the top five by each lens's self-declared
relevance score, and **any tie spanning the fifth seat goes straight to the
operator** to break by hand. Because lenses tend to score their own relevance
high, identical scores are the common case — in the Gate A run on feature 004 all
nine core lenses joined at the top score, a nine-way tie for five seats. The
operator was forced to choose, and chose the slate that covered the most distinct
review axes (cost / product / architecture / security / domain-language) — exactly
what a mechanical coverage heuristic would have produced. The interruption added
latency without changing the outcome, and this fires on almost every gate where
scores converge.

This feature inserts a **mechanical axis-coverage tie-break** between the relevance
sort and the operator hand-off, so the operator is asked only when coverage cannot
decide. It changes review-orchestration *behaviour* described in skill/prompt
Markdown; there is no runtime code.

## Clarifications

### Session 2026-06-08

- Q: Where does the axis taxonomy + lens-to-axis mapping live so "maximum axis
  coverage" is reproducible? → A: **Derive from joiners.** Each joiner self-declares
  its primary axes at RSVP time (the same self-declaration channel as JOIN/ABSTAIN
  and the relevance score), seeded by and validated against the README 12-axis grid.
  This keeps the mapping roster-resilient, prevents staleness, and keeps the
  orchestrator out of merit judgment (the lens names its own axes; the orchestrator
  only counts coverage) — mirroring the anchor-discovery-procedure pattern.
- Q: What counts as a lens "covering" an axis for the coverage objective? → A:
  **Primary remit only** (the grid's score-3 / champion axes). Secondary and
  incidental strengths (scores 2/1) are not counted toward distinct-axis coverage,
  so a lens cannot win a contested seat on an incidental strength.
- Q: When maximizing distinct-axis coverage ties between candidates on **different**
  axes (each adds one new axis, equal total coverage) — not the same-axis case issue
  #3 names — what happens? → A: **Rarest axis first, then operator.** Prefer the
  candidate covering the axis with the fewest champions across the roster (the grid
  already marks under-represented axes such as Performance / Data / Security). This
  is mechanical and coverage-motivated, not lens-merit. Only if candidates remain
  genuinely indistinguishable on coverage *and* axis-rarity does the choice fall to
  the operator.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Coverage breaks an identical-score tie without interrupting the operator (Priority: P1)

When more than five lenses JOIN a gate and their relevance scores tie across the
final seat(s), the orchestrator seats the panel that covers the most distinct
review axes — automatically, with no operator prompt — provided coverage yields a
decisive panel.

**Why this priority**: This is the friction the issue targets. Identical scores
are the common case; today every such gate stops for a human whose choice the
heuristic can reproduce. Removing that interruption is the feature's core value
and is independently shippable.

**Independent Test**: Replay the feature-004 Gate A nine-way tie (nine lenses, all
relevance 3, five seats). The orchestrator seats a five-lens panel by maximum
distinct-axis coverage and proceeds **without** an operator prompt; the seated
slate matches the axis-coverage slate the operator picked by hand.

**Acceptance Scenarios**:

1. **Given** six or more lenses JOIN and a relevance-score tie spans the fifth
   seat, **When** the orchestrator seats the panel, **Then** it selects seats to
   maximize the count of distinct axes the panel covers and proceeds without
   asking the operator, **provided** the coverage objective yields a single
   best panel.
2. **Given** some seats are already settled by an untied relevance score and the
   remaining seats are contested by a tie, **When** the orchestrator fills the
   remaining seats, **Then** it prefers tied lenses whose axes are **not yet
   covered** by the already-seated lenses.
3. **Given** the relevance sort already yields a clean top five (no tie across the
   fifth seat), **When** the orchestrator seats the panel, **Then** behaviour is
   unchanged — no axis-coverage step runs.

---

### User Story 2 - The operator is still asked when coverage cannot decide (Priority: P2)

When the axis-coverage objective does not produce a single best panel — two or
more candidate lenses cover the **same** remaining axis and still tie for the final
seat — the orchestrator surfaces only that genuinely-ambiguous choice to the
operator, not the whole panel.

**Why this priority**: Preserves the operator's authority over the truly
undecidable case (the N+1 tie-breaker) while keeping the prompt scoped to the
residual ambiguity. Without this, the heuristic would silently make a coverage-
neutral choice the operator should own.

**Independent Test**: Construct a tie where, after coverage is maximized, two
remaining lenses cover an identical single axis and compete for the last seat.
The orchestrator presents exactly those candidates (with their shared axis) to the
operator and seats the rest without prompting.

**Acceptance Scenarios**:

1. **Given** axis coverage is maximized but two or more tied lenses cover the same
   remaining axis and tie for the final seat, **When** the orchestrator cannot
   decide on coverage, **Then** it surfaces only the residual same-axis choice to
   the operator and seats every coverage-decided seat without prompting.
2. **Given** the operator picks one of the surfaced candidates, **When** the panel
   is seated, **Then** the ledger records both the coverage-decided seats and the
   operator-decided seat distinctly.

---

### User Story 3 - The seating is reproducible and auditable (Priority: P3)

A reviewer can reconstruct any capped seating decision from the ledger alone: the
joiners and their scores, the axis taxonomy used, the coverage each candidate
panel achieved, and whether the final seat was coverage-decided or operator-decided.

**Why this priority**: The tie-break is only defensible if it is explainable and
deterministic — the same inputs must always seat the same panel. The issue
explicitly requires a worked example proving the heuristic reproduces the operator's
historical choice. This makes the mechanism legible without changing seating
behaviour, so it lands last.

**Independent Test**: From a recorded gate's ledger entry, a reader replays the
seating by hand and arrives at the identical panel, including which axis each
seated lens contributed and why each evicted lens was dropped.

**Acceptance Scenarios**:

1. **Given** a capped gate has run, **When** a reviewer reads the ledger entry,
   **Then** it shows the joiner set with scores, the axes each candidate covers,
   the coverage objective's outcome, and the coverage-vs-operator provenance of
   each seat.
2. **Given** the same joiner set and scores, **When** the seating is computed
   twice, **Then** it produces the identical panel (deterministic).

---

### Edge Cases

- **All joiners self-score identically** (the motivating case): the relevance sort
  carries no signal, so the entire panel is seated by axis coverage. This must not
  be treated as an error or an automatic operator hand-off.
- **A tied lens covers multiple axes**: the objective is distinct-axis coverage of
  the *whole panel*, so a multi-axis lens may be preferred for the marginal new
  axes it adds; ties on marginal coverage fall through to the axis-rarity sub-rule
  (FR-006a), then to the operator only if still indistinguishable.
- **A tied lens's only axis is already covered by an untied, already-seated lens**:
  it is deprioritized relative to a tied lens that adds an uncovered axis.
- **Two candidates each add a distinct uncovered axis (equal coverage gain)**: the
  axis-rarity sub-rule seats the one whose axis has the fewest roster champions; the
  operator is not interrupted unless rarity also ties.
- **A joiner declares a primary axis outside the taxonomy** (e.g. a new lens): it is
  recorded but does not count toward coverage until the taxonomy is extended; seating
  proceeds on the recognized axes.
- **Coverage is fully decisive**: no operator prompt fires at all — the desired
  outcome on the common case.
- **Roster grows / a lens declares an axis not in the current taxonomy**: the axis
  source must accommodate new lenses without going stale (see Assumptions).
- **Seat-all range (`3 ≤ J ≤ 5`)**: the cap does not force eviction, so the
  axis-coverage step never runs — seating is unchanged.
- **Quorum failure (`J < 3`)**: unchanged — re-ping once, then abort honestly. The
  tie-break is irrelevant below quorum.
- **A genuine residual tie persists even after the operator step is offered and the
  operator declines to choose**: the existing operator-escalation behaviour governs;
  this feature does not remove the human as the final backstop.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The seating procedure MUST insert an axis-coverage tie-break step
  **between** the relevance-score sort and the operator hand-off. The order is:
  relevance sort → (on a tie spanning the last seat) axis-coverage tie-break →
  (only if coverage is not decisive) operator.
- **FR-002**: The axis-coverage step MUST run **only when the cap forces eviction**
  (`J ≥ 6` with a relevance tie spanning the final seat). It MUST NOT run in the
  seat-all range (`3 ≤ J ≤ 5`) or below quorum (`J < 3`).
- **FR-003**: When the relevance sort already yields a clean top five (no tie across
  the fifth seat), seating MUST be unchanged — the axis-coverage step does not run.
- **FR-004**: Seats already settled by an untied relevance score MUST be retained;
  the axis-coverage step decides only the contested seat(s) spanned by the tie.
- **FR-005**: The axis-coverage objective MUST seat the panel to **maximize the
  number of distinct review axes covered**, preferring candidate lenses whose axes
  are not yet covered by an already-seated lens. A lens "covers" only its **primary
  (score-3 / champion) axes** per the taxonomy (FR-009); secondary and incidental
  strengths (scores 2/1) are not counted toward distinct-axis coverage. Selection is
  a coverage objective, **not** a lens-merit judgment: it MUST NOT rank two lenses on
  whose view is "better," only on whether their axis is already represented.
- **FR-006**: When maximizing distinct-axis coverage leaves a residual tie for the
  final seat(s), the procedure MUST resolve it by the following deterministic
  cascade before involving the operator:
  - **(a)** If the tied candidates cover **different** uncovered axes (equal total
    coverage gain), seat the candidate whose axis is **rarest across the roster** —
    the axis held as a primary remit by the fewest lenses (the taxonomy already marks
    under-represented axes such as Performance / Data / Security). This is mechanical
    and coverage-motivated, never a judgment of which lens's view is better.
  - **(b)** The procedure MUST fall back to the **operator only when the residual tie
    is not resolvable by coverage or axis-rarity** — i.e. the tied candidates cover
    the **same** remaining axis, or remain indistinguishable on both distinct-axis
    coverage and axis-rarity, and still tie for the final seat(s).
- **FR-007**: On the operator fall-back, the orchestrator MUST surface **only the
  genuinely-ambiguous residual choice** (the tied candidates for the final seat that
  coverage and axis-rarity could not separate), not the whole panel. Every seat
  decided by relevance, coverage, or axis-rarity is seated without a prompt.
- **FR-008**: The seating MUST be **deterministic**: identical joiner sets and
  relevance scores MUST always yield the identical panel and the identical
  coverage-vs-operator provenance for each seat.
- **FR-009**: A reproducible **axis taxonomy** MUST be named so "maximum axis
  coverage" is well-defined and not ad-hoc, together with a mapping from each lens to
  the primary axis (or axes) it covers. The taxonomy is the existing README 12-axis
  grid (Dom, Arch, Craft, Test, UX, Prod, Prio, Deliv, Obs, Sec, Perf, Data). The
  per-lens mapping is **derived from each joiner's self-declaration at RSVP time** —
  each JOIN reply names the lens's primary axes alongside its relevance score —
  **seeded by and validated against** the grid. The orchestrator never assigns axes
  to a lens; it only counts coverage over the axes the lenses declare. This keeps the
  mapping roster-resilient (new lenses declare their own axes) and consistent with
  I2 (the orchestrator does not infer on a persona's behalf).
- **FR-010**: The same tie-break cascade MUST apply to **both** seating modes that
  share the cap rule: the agent-SDLC per-gate seating (`SDLC-LAYER.md` invariant S3
  and the seating section) and the round-mode RSVP/quorum step (`SKILL.md`
  Phase 0.5). The two modes MUST NOT diverge.
- **FR-011**: Invariant **S3** MUST be updated to describe the axis-coverage-then-
  operator cascade while preserving its core prohibition: the orchestrator never
  seats by judging lens merit. The spec MUST make explicit that axis coverage is
  consistent with that prohibition (it judges coverage of the review surface, which
  is mechanical and explainable, not the merit of any lens's view).
- **FR-012**: The change MUST remain consistent with **I2** (the integration layer
  never decides a persona's JOIN/ABSTAIN). The tie-break operates only on the set
  of lenses that already chose to JOIN; it never adds, removes, or infers an RSVP.
- **FR-013**: The ledger MUST record, for any capped gate: the joiner set with
  relevance scores and **self-declared primary axes**, the axis taxonomy source used,
  the axes each candidate covers, the coverage outcome, the **axis-rarity ranking**
  where it was applied, and the per-seat provenance (relevance-settled /
  coverage-decided / rarity-decided / operator-decided) — sufficient to replay the
  seating by hand.
- **FR-014**: A **worked example** MUST be recorded — the feature-004 Gate A
  nine-way tie — demonstrating that the heuristic reproduces the operator's
  historically-chosen slate.
- **FR-015**: The feature MUST NOT change behaviour outside capped seating: relevance
  scoring, RSVP self-selection, quorum re-ping/abort, the gate primitive, and the
  vote/tally are untouched. The one additive change to RSVP is FR-016 (lenses now
  also declare their primary axes); JOIN/ABSTAIN and scoring semantics are unchanged.
- **FR-016**: Each JOIN RSVP reply MUST carry the lens's **self-declared primary
  axes** (drawn from the named taxonomy) in addition to its relevance score. A
  declared axis outside the taxonomy is recorded but does not count toward coverage
  until the taxonomy is extended.
- **FR-017**: "Axis rarity" (FR-006a) MUST be computed over the **roster's**
  declared primary-axis mapping (how many lenses champion each axis), so the rarity
  ranking is reproducible and updates automatically as the roster grows.

### Key Entities

- **Joiner set**: the lenses that replied JOIN to a gate's RSVP, each with a
  self-declared relevance score (0–3) **and self-declared primary axes** (FR-016).
  Input to seating; never modified by this feature.
- **Axis taxonomy**: the named, reproducible set of review axes (the README 12-axis
  grid: domain, architecture, code craft, testing, UX, product, prioritization,
  delivery, observability, security, performance, data) against which panel coverage
  is measured. Serves as the seed and human-readable reference for the mapping.
- **Lens-to-axis mapping**: for each joined lens, the primary axes it declared
  (seeded by the grid) — the basis for computing a panel's distinct-axis coverage.
- **Axis rarity**: for each axis, the count of roster lenses that champion it; the
  basis for the FR-006a rarity sub-rule. Lower count = rarer = preferred when
  coverage gain ties.
- **Candidate panel**: a set of five lenses (settled seats + a choice of contested
  seats) whose distinct-axis coverage the objective maximizes.
- **Seating decision**: the seated panel plus, per seat, its provenance —
  relevance-settled, coverage-decided, rarity-decided, or operator-decided — as
  recorded in the ledger.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Replaying the feature-004 Gate A nine-way tie, the axis-coverage
  heuristic seats a panel **identical** to the slate the operator chose by hand,
  with **zero** operator prompts.
- **SC-002**: For capped gates where the relevance scores of the joiners are
  identical and axis coverage is decisive, the operator is prompted **0** times
  (down from 1 prompt per such gate today).
- **SC-003**: The operator is still prompted in **100%** of cases where, after
  coverage is maximized, a same-axis residual tie remains for a final seat — and
  the prompt contains **only** the residual tied candidates, not the full panel.
- **SC-004**: Seating is deterministic — computing the panel twice from the same
  joiner set and scores yields the identical panel and per-seat provenance in
  **100%** of trials.
- **SC-005**: A reviewer can reconstruct any capped seating decision from the
  ledger entry alone (joiners, scores, self-declared axes, coverage outcome,
  axis-rarity ranking, per-seat provenance) without consulting the orchestrator's
  reasoning.
- **SC-006**: Both seating modes (agent-SDLC per-gate and round-mode Phase 0.5)
  reference a **single** definition of the tie-break cascade; an inspection finds
  no divergent second copy of the rule.
- **SC-007**: No behaviour outside capped seating changes — the seat-all range,
  quorum re-ping/abort, RSVP self-selection, and the vote/tally produce identical
  outcomes to before the change on a representative gate.

## Assumptions

- **Axis taxonomy source** *(resolved — Clarifications 2026-06-08)*: the canonical
  12-axis taxonomy is the existing README "Lens coverage" grid (Dom, Arch, Craft,
  Test, UX, Prod, Prio, Deliv, Obs, Sec, Perf, Data). The per-lens mapping is
  **derived from each joiner's self-declaration at RSVP time** (each JOIN names its
  primary axes), seeded by and validated against the grid — not a frozen hand-edited
  list. The grid remains the human-readable reference and seed; the live mapping
  comes from the joiners, so it stays current as the roster grows (matching the
  *anchor-discovery-procedure* pattern). The exact RSVP-reply shape and validation
  step are planning details.
- **"Covers an axis"** *(resolved)* means the lens holds that axis as a **primary
  remit** (score 3 in the grid). Secondary/incidental strengths (scores 2/1) are not
  counted toward distinct-axis coverage.
- **Residual-tie resolution** *(resolved)*: when the coverage objective leaves a
  tie, a deterministic **axis-rarity** sub-rule applies first (seat the rarest
  uncovered axis); the operator is consulted only for a tie that neither coverage
  nor axis-rarity can separate (FR-006). Axis-rarity is a coverage objective over the
  roster, not a lens-merit ranking, so it does not smuggle merit judgment into the
  seating.
- **Scope keying**: this feature only edits capped-seating behaviour and its
  documentation/ledger; it does not alter relevance scoring, the gate primitive, the
  vote/tally, or the exploratory phase.
- **Both modes share one rule**: `SDLC-LAYER.md` S3 and `SKILL.md` Phase 0.5 will
  point at a single canonical statement of the cascade (one definition, two
  references), consistent with the project's existing "one primitive, both adopt"
  discipline.
- This is a Markdown skill/prompt-authoring change; there is no runtime code, test
  harness, or deployment beyond `install.sh` redeploying the skill.
