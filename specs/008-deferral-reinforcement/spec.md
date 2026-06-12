# Feature Specification: Deferral reinforcement + backtest/fitness harness

**Feature Branch**: `008-deferral-reinforcement`

**Created**: 2026-06-11

**Status**: Draft

**Input**: Operator description (distilled from a design dialogue): "A chorus
without a strong cut mandate over-builds. The scope/deferral lens (Goldratt) is
the only seat whose *primary* mandate is the cut, which makes its findings
structurally hard to escalate (they can rarely earn convergence severity). Open
the convergence pathway for the cut **without** flipping the chorus into an
under-build bias; band the five-whys depth by decision stakes instead of
applying it universally; and — critically — do not adopt any of this on
assertion. Validate it with a backtest whose fitness function rewards *correct*
cuts (against an external oracle), not raw cut count. Add a second, metric-
agnostic fitness gate to measure whether cuts actually reduce real carrying
cost / perf on a target repo."

## Overview

Three coupled changes, plus the measurement that decides whether to keep them.

1. **Band-scaled five-whys.** Five-whys is already mandated per advisor, but
   applying it at full depth to *every* finding is process gold-plating and
   dilutes the discipline into ritual. Depth is subordinated to the decision
   band (🟢 skip · 🟡 light · 🔴 full) defined by `DECISION-PRIMITIVE.md`
   (feature 006). Effort follows stakes.

2. **Cut-convergence by cross-examination.** Builder lenses carry the cut only as
   a *secondary, self-directed* instinct (YAGNI on their own work; Richards'
   last-responsible-moment; Evans' reduce-the-language — a swing). The
   system-wide cut is Goldratt's *primary* mandate alone, so a real overbuild
   that crosses lens boundaries can go uncut: no builder lens is mandated to cut
   a *neighbour's* proposal, and a solitary cut finding rarely reaches the
   convergence that earns 🔴. This feature adds a **cross-examination duty**: a
   seated builder lens may converge with the cut mandate on a neighbour's
   cross-domain overbuild — opening the convergence pathway **without** adopting
   a standing YAGNI bias (which would merely move the bias from over-build to
   under-build).

3. **The backtest + fitness function.** None of the above is adopted on
   assertion. A backtest replays cut decisions over an existing FR corpus and
   scores them against an **external oracle** of which FRs were genuinely
   over-build. The fitness function is **not** "how many FRs a reinforced
   version drops" — raw cut count is the production-metric trap inverted, and
   maximising it tunes the chorus straight into the under-build over-correction.
   It is a confusion matrix favouring precision: reward catching true
   over-build, penalise cutting load-bearing work.

4. **The fitness gate (perf / carrying cost).** A second, **metric-agnostic**
   harness consumes a metrics snapshot from a target repo's own perf/analysis
   run, applies per-metric budgets (the fitness thresholds) and a baseline
   (regression detection), and emits a pass/fail verdict plus an aggregate
   fitness score. It answers the *payoff* question the backtest cannot: did the
   cuts actually reduce real carrying cost or perf regression. Metric-agnostic
   so it serves runtime-perf metrics (`p95_latency_ms`, `rss_mb`,
   `cost_per_req_usd`) **or** carrying-cost metrics (`dead_code_loc`,
   `unused_fr_count`, `cyclomatic_total`) — the operator points it at whichever
   characteristic binds.

## Clarifications

### Session 2026-06-11 (design dialogue)

- Q: Reinforce the cut by cranking YAGNI across the builder lenses, or by some
  other mechanism? → A: **Cross-examination, not standing bias.** Cranking YAGNI
  uniformly does not remove the over-build bias; it flips it to under-build. The
  builder lenses keep their primary mandate and gain a *duty to converge with
  the cut on a neighbour's cross-domain overbuild* — convergence-by-cross-
  examination, not convergence-by-shared-bias.
- Q: Apply the reinforced five-whys universally? → A: **No — band it.** Universal
  application is process gold-plating (the law eating its own tail) and degrades
  the discipline into ritual on trivial findings (an all-3s-style degeneracy in
  the why-chain). Depth is subordinated to the decision band: 🟢 skip, 🟡 one or
  two whys, 🔴 the full chain.
- Q: Fitness function = count of FRs the reinforced version drops? → A: **No.**
  Cut count is the inverted production trap — it rises when the chorus cuts more
  *aggressively*, so optimising it selects for the under-build failure mode. Use
  a confusion matrix against an oracle, favouring precision (a wrong cut of a
  load-bearing FR is costlier than a missed over-build).
- Q: Where does the oracle come from? → A: **External validation — the user
  interviews.** FRs the interviews/market invalidated (the blunder areas) are
  positive labels for *should-have-been-cut*; interview-confirmed FRs are
  load-bearing negatives (cutting them is a false positive). FRs with no external
  signal are `unknown` and excluded from precision/recall.
- Q: Is a pure current-vs-reinforced chorus diff a valid signal? → A: **Only
  partially.** The corpus is, by definition, what the chorus already passed, so
  over-build that *no lens* is sensitive to survives both variants and never
  appears in the self-delta (common-mode blindness). The oracle-labelled portion
  has independent validity; the self-delta is suggestive but inbred. Results MUST
  separate the two and weight the oracle-labelled signal.
- Q: Does the backtest also settle the universal-vs-banded five-whys question? →
  A: **Yes.** Run both variants over identical inputs against the same oracle; if
  universal does not lift correct-cut recall past an operator threshold, banded
  wins on overhead. One experiment, two answers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Score a reinforced chorus against an oracle (Priority: P1)

The operator has an FR corpus, a subset labelled by user interviews
(validated / invalidated), and the keep/cut decisions a baseline chorus and a
reinforced chorus each produced. They want to know whether the reinforcement
cuts the *right* FRs, not merely more of them.

**Why this priority**: This is the load-bearing measurement. Without it, the
reinforcement is adopted on assertion — the exact failure mode the feature
exists to avoid.

**Independent Test**: Run the cut backtest over a labelled corpus + two variants;
it emits a confusion matrix, precision, recall and a precision-favouring F-score
per variant, plus a separated self-delta. Fully testable on the bundled sample.

**Acceptance Scenarios**:

1. **Given** a corpus where variant B cuts 3 invalidated FRs and 1 validated FR
   that variant A kept, **When** the backtest runs, **Then** B shows higher
   recall *and* a recorded false-positive cut, and the verdict reflects the
   precision penalty rather than rewarding the larger cut count.
2. **Given** an oracle with `unknown`-labelled FRs, **When** the backtest runs,
   **Then** those FRs are excluded from precision/recall and reported only under
   the self-delta as unvalidated exploration surface.

### User Story 2 - Gate a target repo on a fitness budget (Priority: P2)

The operator runs a metric-agnostic fitness gate on the product repo to check
whether the system stays within its perf / carrying-cost budget as it evolves —
the payoff side of the cut.

**Why this priority**: Correct cuts (Story 1) are necessary but not sufficient;
this confirms the cuts buy down real cost and that the codebase does not regress.

**Independent Test**: Feed the gate a metrics snapshot + budgets (+ optional
baseline); it emits per-metric pass/fail, regression deltas, and an aggregate
verdict. Testable on the bundled sample.

**Acceptance Scenarios**:

1. **Given** a metric over budget, **When** the gate runs, **Then** it fails that
   metric and the aggregate verdict, naming the metric and the overage.
2. **Given** a baseline and a metric that regressed within budget, **When** the
   gate runs, **Then** it passes the budget but flags the regression delta.

### Edge Cases

- A decision references an FR id absent from the corpus → reported as an
  unscored decision, never silently counted.
- A variant abstains on an FR (neither keep nor cut) → excluded from that
  variant's matrix, counted as coverage gap.
- All oracle labels are `unknown` → precision/recall undefined; the harness says
  so plainly rather than emitting a misleading 0 or 1.
- A budget direction is omitted → the metric is rejected, not assumed
  lower-is-better.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Five-whys depth MUST be banded by the `DECISION-PRIMITIVE.md`
  decision band — 🟢 omit, 🟡 shallow, 🔴 full — not applied at uniform depth to
  every finding. *(Depends on feature 006.)*
- **FR-002**: A seated builder lens MUST be able to converge with the cut mandate
  on a neighbour lens's cross-domain over-build via a declared cross-examination
  step, without that lens adopting a standing cut/YAGNI bias on its own findings.
- **FR-003**: The reinforcement (FR-001, FR-002) MUST NOT be merged into the live
  roster on assertion; it MUST first clear the backtest fitness function against
  an oracle-labelled corpus.
- **FR-004**: The backtest MUST classify each cut decision against an oracle label
  (`invalidated` = over-build positive, `validated` = load-bearing negative,
  `unknown` = excluded) and emit a confusion matrix — not a raw cut count.
- **FR-005**: The fitness function MUST reward recall on over-build positives and
  penalise false-positive cuts on load-bearing negatives, favouring precision
  (configurable F-beta, default β < 1).
- **FR-006**: Results MUST separate oracle-labelled metrics (independently valid)
  from pure variant-vs-variant self-delta (common-mode-blind), and present the
  oracle-labelled signal as primary.
- **FR-007**: The backtest MUST compare ≥ 2 variants over identical inputs so that
  configuration questions (e.g. universal vs banded five-whys) are decided on one
  fitness function, not asserted.
- **FR-008**: The fitness gate MUST be metric-agnostic: it consumes named metrics
  from a target repo's own run and per-metric budgets with an explicit
  better-direction, and MUST NOT assume a direction.
- **FR-009**: The fitness gate MUST emit per-metric pass/fail against budget, an
  optional regression delta against a baseline snapshot, and an aggregate verdict
  suitable for a CI gate (non-zero exit on failure).
- **FR-010**: Both harnesses MUST run on the standard library alone (no third-
  party dependencies) and read/write plain JSON, to stay runnable under the
  product's minimal-infra constraint.

### Key Entities

- **FR record**: `{ id, oracle: validated|invalidated|unknown, source?, domain? }`.
- **Cut decision**: `{ fr_id, decision: keep|cut, band?, rationale? }`, grouped by
  named variant.
- **Backtest result**: per-variant confusion matrix (TP/FP/FN/TN over labelled
  FRs), precision, recall, F-beta; plus a pairwise self-delta split by oracle
  label.
- **Metric snapshot**: `{ metric_name: value }` emitted by the target repo's run.
- **Budget**: `{ metric_name: { max|min, direction: lower_better|higher_better } }`.
- **Fitness verdict**: per-metric pass/fail + regression delta + aggregate score
  and exit status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The cut backtest emits precision, recall and a precision-favouring
  F-score per variant from one run over a labelled corpus.
- **SC-002**: A reinforced variant is judged better **only** when it improves the
  precision-favouring F-score over baseline on the oracle-labelled set — never on
  cut count alone.
- **SC-003**: False-positive cuts on load-bearing negatives are reported per
  variant and can be held under an operator-set ceiling (the under-build guard).
- **SC-004**: The universal-vs-banded five-whys comparison yields a decisive
  verdict on identical inputs (banded preferred unless universal lifts correct-
  cut recall past the operator threshold).
- **SC-005**: The fitness gate, run on a target repo's metrics snapshot, returns a
  non-zero exit when any metric breaches budget, naming the metric and overage.

## Assumptions & Dependencies

- **Depends on feature 006** (`DECISION-PRIMITIVE.md`, decision bands) for FR-001.
  Feature 006 is in flight (PR #5); the band-scaled five-whys lands behind it.
  FR-002 (cross-examination) builds on the **mandate guardrail** already on
  `main` (issue #6). The two harnesses (FR-004…FR-010) are independent of both
  and can ship first as the measurement substrate.
- The oracle is operator-supplied and only as good as the external validation
  behind it; the harness does not manufacture labels. Coverage of the oracle
  (fraction of FRs labelled) bounds the strength of the verdict.
- The fitness gate consumes metrics the target repo already produces; collecting
  those metrics (benchmarks, static analysis) is out of scope — the gate scores
  and gates them, it does not measure them.
- Prototype scope: measurement only. This feature does **not** implement a
  reinforced chorus, nor wire either harness into the skill runtime; those follow
  once the fitness function says the reinforcement earns its place.
