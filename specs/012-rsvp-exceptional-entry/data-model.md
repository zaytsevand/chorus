# Phase 1 — Data Model

Conceptual entities (this is a Markdown methodology feature; "model" = the canon vocabulary the edits introduce/extend).

## RSVP answer
- **Values**: `JOIN` · `ABSTAIN` · **exceptional entry** (new — a JOIN variant).
- **Exceptional entry fields**: `cited_delta` (the concrete round-context delta this lens uniquely covers), held to the I8/D5 evidence rule. An un-anchored exceptional claim is **refused** (FR-002a).
- Drops v1's `ABSOLUTE` tier and any `protected` flag.

## Board
- **Partition**: `ordinary` seats (≤ 5, cap + applicability/stakes tie-break) + `exceptional` seats (additive, uncapped, evidence-bar gated, rare).
- **Invariant**: `board_size = min(roster, min(5, |ordinary JOIN|) + |exceptional|)`; `board_size ≤ roster`.
- **Distinctness**: exceptional seats must cite **distinct** uncovered deltas (FR-002b).

## Uncovered delta (new)
- A round-context delta (commit/PR/spec/incident/coverage gap) **not covered by any seated ordinary lens**. The object an exceptional entry must cite. Judged structurally (R1); duplicates collapse to one seat.

## Voter count `N`
- `N` = non-author voters on a finding = `board_size − 1` for a seated author (S8).
- Constraint: a tally runs only at `N ≥ 2`.

## Vote
- Values: `PRIORITIZE` / `CONFIRM` / `OVER-RATE` (unchanged, GATE-PRIMITIVE). **All equal-weight** — no protected/veto flag anywhere.

## Threshold `T`
- `T = max(1, floor(N/2))`. Escalate iff `net ≥ T`; demote iff `net ≤ −T`; else hold. `net = PRIORITIZE − OVER-RATE` (CONFIRM excluded). Reduces to canon at `N=4` (`T=2`).

## Side-note (new)
- A non-binding conductor marginal observation. **Fields**: `regime` (board-widened-by-exceptional | marginal-`|net|==T` | same-brief-unanimity), `text` (Dijkstra-register), `routed_to` = operator. **Invariant**: never alters severity/gating/tally (FR-014). Recorded in the gate ledger.
- Out of scope (separate spec): any side-note that *changes* an outcome.

## Relationships
- exceptional entry → cites → **uncovered delta** → contributes a seat → raises `board_size` → raises `N` → raises `T` (the dilution that keeps a widened board honest).
- exceptional/ordinary seat → casts → **vote** (equal weight) → feeds → **tally** (`T`) → **severity**.
- board-widening / marginal tally / unanimity → triggers → **side-note** (observation only).
