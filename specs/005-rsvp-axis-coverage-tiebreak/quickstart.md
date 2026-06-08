# Quickstart: the 004 Gate A worked example, replayed

This is the FR-014 worked example — the feature-004 Gate A nine-way tie — run through
the cascade by hand. **It is the empirical basis for research R1.** It shows what the
mechanical cascade actually does on the issue's own motivating case, honestly,
including where it diverges from the operator's historical choice.

## Inputs (from `specs/004-advisor-exploratory-phase/agent-sdlc-log.md`)

Nine JOINs, **all relevance 3** (the degenerate uniform-score tie), cap = 5. Primary
axes from each lens's standing remit (README grid):

| Lens | relevance | primary_axes |
|------|:---------:|--------------|
| Evans | 3 | Dom |
| Richards | 3 | Arch |
| Uncle Bob | 3 | Craft |
| Kent Beck | 3 | Craft, **Test** |
| Norman | 3 | UX |
| Cooper | 3 | Prod |
| Delivery-and-Ops | 3 | Deliv, **Obs** |
| Security-and-Trust | 3 | Sec |
| Constraint-and-Flow | 3 | Prio |

Operator's historical pick: **{Constraint-and-Flow, Cooper, Richards, Security,
Evans}** — 5 single-axis specialists, axes {Prio, Prod, Arch, Sec, Dom}.

## Step 1–2 — relevance sort

All nine tie at relevance 3 → the tie spans every seat. No `relevance-settled` seats;
all five seats are contested. (This is exactly the case the feature targets.)

## Step 3 — coverage maximization

Maximize distinct primary axes in a 5-lens panel. Only two lenses cover two axes each:
**Beck** {Craft, Test} and **Delivery-and-Ops** {Deliv, Obs}. Every other lens covers
one. Maximum achievable = 2 + 2 + 1 + 1 + 1 = **7 distinct axes**, and it requires
seating **Beck and Delivery-and-Ops**. (Uncle Bob's only axis, Craft, is already
covered by Beck — Bob is pure redundancy and never improves coverage.)

➡ Coverage seats **Beck** and **Delivery-and-Ops** (`coverage-decided`) — the two
lenses the operator **dropped**. Three seats remain, contested by the six single-axis
specialists {Evans·Dom, Richards·Arch, Norman·UX, Cooper·Prod, Security·Sec,
Constraint·Prio}, each adding one distinct, currently-uncovered axis → a
**different-axis equal-gain** tie.

## Step 4 — axis-rarity sub-rule

Champion counts across the roster for the six contested axes:

| Axis | Champions | Count |
|------|-----------|:-----:|
| Dom | Evans | 1 |
| Arch | Richards | 1 |
| UX | Norman | 1 |
| Prod | Cooper | 1 |
| Sec | Security | 1 |
| Prio | Constraint | 1 |

All six are tied at one champion each. Rarity **does not separate them**.

## Step 5 — operator fall-back

The cascade surfaces the residual choice — **pick 3 of the 6 single-axis specialists**
— to the operator. The operator picks {Constraint, Cooper, Richards, Security, Evans}'s
three remaining (Norman dropped), consistent with their historical design-axis
preference.

## Outcome — what actually happened

| | Operator (historical) | Mechanical cascade |
|---|---|---|
| Seated | Constraint, Cooper, Richards, Security, Evans | **Beck, Delivery-and-Ops** (forced by coverage) + operator picks 3 of {Evans, Richards, Norman, Cooper, Security, Constraint} |
| Axes covered | 5 {Prio, Prod, Arch, Sec, Dom} | 7 |
| Operator prompts | 1 (pick 5 of 9) | 1 (pick **3 of 6**) |

## What this proves (research R1)

1. **The cascade does not reproduce the operator's slate** (FR-014/SC-001 as written is
   unsatisfiable here). It *forces in* the two multi-axis lenses the operator
   deliberately dropped, because coverage breadth rewards generalists.
2. **It does not fully remove the prompt either** — the standing roster is nearly
   axis-disjoint with uniform single-champion axes, so coverage and rarity have little
   to bite on. The operator is still consulted, for a *smaller* residual (3 of 6
   instead of 5 of 9).
3. The operator's real decision rule was **gate-relevance** (design axes for a design
   gate), which is a relevance signal, not a coverage signal — and is exactly what
   S3/I2 forbid the orchestrator from inventing.

**Net for this example**: a marginal interruption reduction (3-of-6 < 5-of-9), at the
cost of forcing in two dropped lenses and diverging from the operator's intent. The
feature's clean wins are on gates that have **axis redundancy** (multiple lenses
sharing a primary axis to evict) and **rarity gradients** (Perf/Data/Sec under-
represented) — the 004 Gate A roster has neither.

## Recommended resolution (pending operator confirmation)

- **Reframe FR-014 / SC-001** to the honest claim: *on a uniform-score capped tie the
  cascade seats coverage-decided seats deterministically and reduces the operator's
  residual choice; it does not promise to reproduce a gate-relevance-driven slate.*
- Surface this to a **Gate A chorus review** (the user's agent-SDLC path) to decide
  whether the marginal benefit justifies shipping as-is, or whether the mechanism
  should change (e.g. accept that uniform-disjoint ties are operator territory and
  scope the feature to redundancy/rarity gates only).
