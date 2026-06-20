---
name: project-chorus-exploratory-phase
description: chorus-review skill feature 004 (exploratory phase) — infra-only target; constraint = chorus's own verdict-quality/cycle-time; phase built ahead of proof
metadata:
  type: project
---

Feature 004 "advisor exploratory phase" adds a pre-findings step: per-joiner load lens profile → reuse prior record + compute deltas/staleness → addendum-first harvest → bounded analysis → gap-questions → ONE orchestrator-batched operator interview/round → write-back (operator-accepted) to CHORUS-PROJECT.md addendum.

**Constraint location (GATE A finding):** This is an infrastructure-only target (the chorus reviewing itself). No market hypothesis → binding constraint is the chorus's OWN throughput: verdict quality per round + cycle time. The exploratory phase bets that review quality is constraint-limited by missing per-lens understanding ("cold reads produce weak findings"). That bet is ASSERTED, not evidenced — SC-001..SC-008 measure conformance (does it trace/reference-once), none measures verdict improvement.

**Why:** Reinertsen — validate learning before scaling the investment; price the delay not the effort. The per-round tax (operator interview minutes, per-lens analysis × up-to-10 lenses, staleness re-validation) is unpriced — research.md D8 "cost controls" are assertions of boundedness with no quantified ceiling, and FR-006 "bounded analysis" has no stopping rule.

**How to apply:** On future rounds of feature 004 / the exploratory phase, (1) ask whether any round has yet shown a verdict-quality lift from grounding; (2) push for the cheaper subset = profiles + addendum-first harvest + one interview, DEFER staleness-fingerprinting (D5) + incremental deltas (D6/FR-010) + per-lens persisted records until a second round proves reuse pays back; (3) do NOT touch the operator-accept write-back gate (FR-017/D4) — that's a data-integrity invariant, on the constraint by definition.

**Gate A cycle 2 (2026-06-07) — resolution of my 4 gating findings:**
- F2 (unpriced per-round tax) → RESOLVED: FR-019 operator-paced/budgeted + FR-020 cheapest-first & visible + D6 delta-only later rounds.
- F4 (bounded analysis had no budget) → RESOLVED: exploratory-phase.md step 4 made operator-budget-controlled, gated behind the cheap subset.
- F5 (one batched interview serialized the panel) → RESOLVED: FR-019 sessioning — ≤5-q re-entrant defer/resume sessions + degradation summary on skip.
- F1 (phase built ahead of proof that understanding IS the constraint) → PARTIAL, no longer gating. Cheapest-subset-first made a wrong bet *cheap*; it did NOT *validate* the claim. FR-022 fitness fn measures profile coverage, not grounded-vs-cold finding quality. Settling experiment (A/B round: record vs cold-read, compare finding quality/cost) still un-run — carry as 🟢 follow-up.
Verdict: gating findings CLEARED; gate not halted on my lens. The constraint claim is now inexpensive-to-falsify rather than expensive-and-unbounded.

Related: [[project-linkedintools-constraint]] (a market-facing target where the constraint is learning-loop cycle time, not iteration cost).
