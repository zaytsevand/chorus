# Phase 0 — Research

Most unknowns were resolved during Gate A (cycles 0–2; see `agent-sdlc-log.md`). Two residuals remain; both resolve to deferrable defaults.

## R1 — How is "distinct delta" judged? (Gate-A cycle-2 finding H1, 🟡)

- **Decision**: For this feature, "distinct" is judged **structurally, not semantically** — an exceptional entry must cite a concrete round-context delta (a commit/PR/spec/incident/coverage-gap) that no seated ordinary lens already covers, anchored per the I8/D5 evidence rule. Two entries citing the *same* cited delta do not each earn a seat (FR-002b). A **semantic** validator (detecting "formally-distinct but substantively-duplicate" deltas) is **deferred** — the mitigation is operator guidance in the round brief plus the US3 side-note that flags board-widening for review.
- **Rationale**: A semantic-duplication checker is judgment the canon has no owner for (it would be the conductor adjudicating — forbidden, Principle II). Structural anchoring + visibility is the cheapest honest control and matches the operator's "no adjudicator" constraint.
- **Alternatives rejected**: (a) an adjudicator approves entries — rejected by the operator (limits self-selection); (b) a hard exceptional-entry quota — rejected (re-introduces an exclusionary cap); (c) building the semantic validator now — Principle IX inventory ahead of evidence.

## R2 — Which canon sites must FR-016 reconcile?

- **Decision (the reconciliation set)**, from a grep of `skill/chorus/`:
  - **Tally threshold** `net ≥ +2`: **home = `GATE-PRIMITIVE.md` Stage 4** (lines ~108–114) → edit to `T = max(1, floor(N/2))`. **Restatement to reconcile = `SKILL.md` ~507–510** (base-round Phase-2 prose restates `net ≥ +2 / net ≤ −2`) → replace the restated numbers with a **citation** to GATE-PRIMITIVE Stage 4 (keep the CONFIRM/convergence explanation, drop the duplicated arithmetic).
  - **Seating cap**: **home = `SDLC-LAYER.md`** seating rule (line ~81) and invariant **S3** (line ~242) → edit to "cap = 5 **ordinary** JOIN seats; exceptional entries additive & uncapped (evidence-bar gated); board ≤ roster". Passing reference **`GATE-PRIMITIVE.md`:130** ("SDLC cap-5 seating") → tighten to "SDLC ordinary-seat cap" (citation, not a restated definition).
- **Rationale**: Editing only the home while leaving SKILL.md:507 asserting `net ≥ +2` would make the canon self-contradict (exactly G2). Reconciliation = one home edited, others demoted to citations (Principle I).
- **Conformance**: SC-009 verifies no canon doc restates a changed rule outside its home after implementation.

## Resolved during Gate A (recorded, not re-litigated)

- Seating model (cap + uncapped exceptional entry); threshold basis (`N` = non-author voters, `T=max(1,floor(N/2))`); protected votes dropped; side-notes flag-only with gating deferred; the "exceptional" bar = cite an uncovered delta, no adjudicator. See `agent-sdlc-log.md` Clarifications.
