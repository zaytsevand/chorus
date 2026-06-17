# Phase 1 — Canon-edit contract

The feature's "interface" is the set of canon-doc edits. Each rule lands in **one** home; restatements elsewhere become citations (Principle I / FR-016). Implementation MUST match this contract; `quickstart.md` verifies it.

| # | Doc (home) | Edit | Spec ref |
|---|------------|------|----------|
| C1 | `SDLC-LAYER.md` seating (~L81) | Cap = **5 ordinary JOIN** seats; **exceptional entry** additive & uncapped, gated by the evidence bar (cite an uncovered delta or be refused; distinct deltas; no adjudicator); `board = min(roster, min(5,\|ordinary\|)+\|exceptional\|)`. | FR-001/002/002a/002b/004 |
| C2 | `SDLC-LAYER.md` S3 (~L242) | Reword: "No **ordinary** panel exceeds 5; exceptional entries are additive (evidence-anchored, D5), board ≤ roster." | FR-001/002, G2 |
| C3 | `GATE-PRIMITIVE.md` Stage 4 (~L108–114) | Replace fixed `net≥+2 / net≤−2` with **`T = max(1, floor(N/2))`**, `N` = non-author voters; escalate `net≥T`, demote `net≤−T`; note `T=2` at `N=4` (canon-compatible); no tally at `N<2`. | FR-006..011 |
| C4 | `GATE-PRIMITIVE.md` (~L130) | Tighten "SDLC cap-5 seating" → "SDLC **ordinary-seat** cap" (citation, not a definition). | FR-016 |
| C5 | `SKILL.md` Phase-2 tally prose (~L507–510) | Remove the restated `net≥+2 / net≤−2` numbers; **cite** GATE-PRIMITIVE Stage 4 for the threshold; keep the CONFIRM/convergence explanation at summary altitude. | FR-016, G2 |
| C6 | `SKILL.md` RSVP (Phase 0.5) | Add the **exceptional-entry** answer alongside JOIN/ABSTAIN (cite an uncovered delta; voice-not-weight; un-anchored refused). Cite SDLC-LAYER for seating. | FR-002/002a |
| C7 | `INTEGRATION-LAYER.md` | Add the **conductor side-note** as a declared, non-binding safety net (3 regimes; recorded + routed to operator; never alters severity). Flag-only; gating version deferred to a separate spec. | FR-012..015 |
| C8 | `DECISION-PRIMITIVE.md` | CHECK only: confirm the seating-decision rows + D5 still describe exceptional entry correctly (self-selected, evidence-anchored). Edit only if a row now misstates seating. | FR-002a (D5) |

**Invariants the contract must preserve**
- Severity stays arithmetic; no weighted/protected votes (Principle III).
- Each changed rule has exactly one home; no doc restates it elsewhere (Principle I / SC-009).
- `T=2` at `N=4` — backward-compatible (SC-004).
- Side-notes never move severity (SC-007).
