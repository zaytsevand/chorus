# Phase 0 Research: RSVP Axis-Coverage Tie-Break

This feature is Markdown skill/prompt authoring (no runtime code). The "unknowns"
are mechanism-design choices, not technology choices. Each decision below records
*what the procedure will commit to*, with rationale and rejected alternatives. One
decision (**R1**) is a finding that contradicts the spec as written and is flagged
for operator confirmation before the design is locked.

## R1 — The coverage objective, and the 004 Gate A worked example (⚠ spec-affecting)

**Finding**: The spec's FR-014 / SC-001 require the heuristic to reproduce the
operator's historically-chosen slate from the feature-004 Gate A nine-way tie. Worked
against the real ledger (`specs/004-advisor-exploratory-phase/agent-sdlc-log.md`
lines 21–38), a naive "maximize the count of distinct primary axes" objective **does
not** reproduce that slate — and would actively prefer a different panel.

The nine joiners and their primary (score-3) axes per the README grid:

| Lens | Primary axes (score 3) |
|------|------------------------|
| Evans | Dom |
| Richards | Arch |
| Uncle Bob | Craft |
| Kent Beck | Craft, **Test** |
| Norman | UX |
| Cooper | Prod |
| Delivery-and-Ops | Deliv, **Obs** |
| Security-and-Trust | Sec |
| Constraint-and-Flow | Prio |

The operator seated **{Constraint-and-Flow (Prio), Cooper (Prod), Richards (Arch),
Security (Sec), Evans (Dom)}** — five **single-axis specialists**, one per distinct
*design* axis — and dropped Norman, Delivery-and-Ops, Uncle Bob, Beck.

- The operator's panel covers **5** distinct axes: {Prio, Prod, Arch, Sec, Dom}.
- A literal max-distinct-axis-count objective prefers the **multi-axis** lenses:
  **{Beck (Craft+Test), Delivery-and-Ops (Deliv+Obs), Evans (Dom), Richards (Arch),
  Security (Sec)}** covers **7** distinct axes {Craft, Test, Deliv, Obs, Dom, Arch,
  Sec} — strictly more than 5.

So the naive objective seats a **different, coverage-superior** panel and **cannot**
reproduce the operator's choice. The operator did not maximize coverage breadth; they
applied **gate-relevance** — for a *design* gate they kept the design axes (domain,
architecture, product, security, cost/prioritization) and dropped the
implementation/runtime axes (craft, test, UX, delivery, observability), preferring
specialists. Gate-relevance is a relevance signal, not a coverage signal — and the
relevance scores in that round were uniformly 3, which is the very degeneracy this
feature exists to handle. **No purely-mechanical, non-merit coverage objective can
reproduce a gate-relevance-driven choice** without an axis-relevance-per-gate input,
which would reintroduce the orchestrator judgment S3/I2 forbid.

**Decision (recommended, pending operator confirmation)**: Keep the mechanical
"maximize distinct-axis coverage" objective and **reframe FR-014 / SC-001**. The
worked example's success criterion becomes:

- The heuristic seats a **deterministic, coverage-maximal, one-lens-per-axis** panel
  **with zero operator prompts** on the 004 Gate A inputs (the interruption is
  removed — the issue's actual goal).
- The recorded worked example **documents the divergence honestly**: the mechanical
  panel ({Beck, Delivery-and-Ops, Evans, Richards, Security}, 7 axes) is *broader*
  than the operator's historical 5-axis slate, and explains *why* they differ (the
  operator used gate-relevance; the heuristic uses coverage breadth). The claim
  "axis coverage reproduces the operator's exact choice" (issue #3's premise) is
  **retired as inaccurate**; the defensible claim is "axis coverage removes the
  interruption and seats a broad, reproducible panel."

**Rationale**: The issue's headline goal — *stop interrupting the operator on
uniform-score ties* — is fully served by a deterministic coverage panel. Its
secondary claim — *coverage would have reproduced the operator's pick* — is falsified
by the data and should not be encoded as an acceptance test. Honesty here is exactly
what an agent-SDLC Gate A is meant to enforce.

**Alternatives considered**:
- **Encode axis-relevance-per-gate** (so the heuristic reproduces the operator's
  design-axis pick). Rejected: it is the orchestrator judging which lenses matter —
  precisely the S3/I2 prohibition — and it re-creates the relevance signal that
  already exists (and was uniformly maxed). Reintroduces the friction it removes.
- **Prefer single-axis specialists over multi-axis generalists** (to mimic the
  operator's specialist pick). Rejected: penalizing a lens for *also* covering a
  second axis is anti-coverage and arbitrary; it has no principled basis and still
  would not uniquely yield the operator's specific five.
- **Keep FR-014/SC-001 as written**. Rejected: unsatisfiable — no mechanical
  non-merit rule reproduces the slate; shipping it guarantees a failing acceptance
  test.

**This decision changes the spec (FR-014, SC-001).** It is surfaced for operator
confirmation (or a Gate A chorus adjudication) before Phase 1 design is finalized.

## R2 — One canonical definition of the seating cascade, referenced by both modes

**Decision**: Author the full seating cascade **once**, canonically, in
`SDLC-LAYER.md` (which already owns the cap-of-5 and invariant S3), as a named block
— **"Capped-seating cascade"**: relevance sort → coverage maximization → axis-rarity
sub-rule → operator. `SKILL.md` Phase 0.5 **references** that block rather than
restating it (the project's established "one primitive, both adopt" discipline, as
with `GATE-PRIMITIVE.md`). The README "Lens coverage" grid is cited as the axis
taxonomy seed.

**Rationale**: FR-010 / SC-006 require a single definition with no divergent copy.

**Alternatives rejected**: Restating the cascade in both files (drift risk — the
exact failure the gate-primitive refactor fixed). A brand-new shared file like
`SEATING-PRIMITIVE.md` (over-factoring; the cascade is small and already lives beside
S3).

## R3 — Round mode is uncapped by default; the shared rule applies *conditionally*

**Decision**: Today `SKILL.md` Phase 0.5 has **no eviction cap** — `J ≥ 5` "proceed;
full chorus" seats *all* joiners. The cap-of-5 is an SDLC-gate concept. So the
axis-coverage cascade only *bites* when a cap forces eviction. Phase 0.5 will adopt
the canonical cascade **by reference, gated on a cap being in force**: the base round
remains uncapped by default (behaviour unchanged — FR-015), and the identical cascade
governs the moment any cap applies (e.g. an operator who caps a heavy round, or a
future lightweight per-spec mode). This satisfies the DoD ("Phase 0.5 gets the same
tie-break") without silently capping the base round.

**Rationale**: Faithful to FR-002 (the step runs only when the cap forces eviction)
and FR-015 (no behaviour change outside capped seating), while still giving both
modes one shared rule (FR-010).

**Alternatives rejected**: Imposing a cap-of-5 on the base round (a real behaviour
change the issue did not ask for, and the README positions the full round as
broad-by-design). Leaving Phase 0.5 untouched (fails the DoD; the two modes would
diverge if the base round is ever capped).

## R4 — Lens axis self-declaration (FR-016)

**Decision**: Extend the RSVP reply. Each JOIN already returns `{decision, relevance,
reason}`; it gains `primary_axes: [<axis>, …]` drawn from the named taxonomy. The
RSVP brief includes the axis vocabulary (the 12 grid keys) so declarations are
well-formed; an out-of-taxonomy axis is recorded but not counted (FR-016). The
orchestrator validates each declaration against the grid seed and counts coverage; it
never assigns axes itself (I2-consistent).

**Rationale**: Self-declaration keeps axis assignment with the lens (like JOIN/ABSTAIN
and the relevance score), so the mapping is roster-resilient and merit-neutral.

**Alternatives rejected**: Orchestrator looks each lens up in a static grid table
(goes stale as the roster grows; centralizes a judgment the lens should own). A
separate axis-declaration round (needless second round-trip; folds cleanly into RSVP).

## R5 — Axis-rarity sub-rule (FR-006a / FR-017)

**Decision**: When coverage maximization leaves a residual tie among candidates on
**different** axes, seat the candidate whose axis has the **fewest champions across
the roster** (champions = lenses declaring that axis primary). Rarity is computed over
the roster's declared mapping at gate time, so it tracks the README grid's
under-represented axes (Perf/Data have zero champions; Sec has one) and updates as the
roster grows. If rarity also ties (candidates cover equally-rare distinct axes, or the
**same** axis), the choice falls to the operator (FR-006b).

**Rationale**: Rarity is a coverage objective over the review surface — mechanical,
explainable, and merit-neutral — that cuts operator prompts on the different-axis
equal-gain case issue #3 never addressed.

**Caveat (interacts with R1)**: In the 004 Gate A case nearly every axis has exactly
one champion, so rarity is largely tied there too — the rarity rule does **not** rescue
the worked example into the operator's slate. It earns its keep on gates where the
roster has clear rarity gradients. This reinforces R1's reframing.

**Alternatives rejected**: A fixed canonical lens order as the tiebreak (deterministic
but arbitrary, coverage-blind). Going straight to the operator on any different-axis
tie (interrupts more than necessary — undercuts the feature's goal).

## R6 — Ledger additions (FR-013)

**Decision**: The per-gate ledger's RSVP/seating section gains, for capped gates: the
joiners' self-declared `primary_axes`, the axis-rarity ranking used (when applied),
and a per-seat **provenance** tag ∈ {relevance-settled, coverage-decided,
rarity-decided, operator-decided}. Plain Markdown, co-located in
`specs/<feature>/agent-sdlc-log.md` (round mode: the round artifact), so a reviewer
replays the seating from the ledger alone (SC-005).

**Rationale**: FR-013 / SC-005 require hand-replayable provenance.

**Alternatives rejected**: A separate seating-trace file (fragments the audit trail).
Recording only the final panel (not replayable — can't distinguish coverage- from
operator-decided seats).

## Cross-cutting

All decisions stay on the merit-neutral side of S3/I2: every step sorts
persona-supplied integers (relevance, then declared-axis coverage counts, then
champion counts) or defers to the operator. None ranks one lens's *view* as better
than another's. The single substantive risk is **R1**, which is a spec-fidelity
finding, not a mechanism choice — resolved by reframing the worked-example acceptance
criterion, pending operator confirmation.
