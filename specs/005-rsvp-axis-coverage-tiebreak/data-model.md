# Phase 1 Data Model: RSVP Axis-Coverage Tie-Break

These are conceptual entities in the seating procedure — there is no database or
runtime type; each maps to a section of an RSVP reply or the Markdown ledger.

## Entity: Axis taxonomy

The fixed vocabulary of review axes, seeded by the README "Lens coverage" grid.

| Field | Value |
|-------|-------|
| Axes | Dom, Arch, Craft, Test, UX, Prod, Prio, Deliv, Obs, Sec, Perf, Data (12) |
| Source of truth | README grid (human-readable seed); live mapping is joiner-declared (FR-009) |
| Extensibility | A joiner may declare an axis outside the list; recorded, not counted until the taxonomy is extended (FR-016) |

## Entity: Joiner (RSVP reply)

One per persona that replied JOIN at a gate.

| Field | Type | Rules |
|-------|------|-------|
| `lens` | identity | the persona's lens identity (unchanged) |
| `decision` | JOIN \| ABSTAIN | unchanged; only JOINs are seated |
| `relevance` | int 0–3 | unchanged; self-declared |
| `primary_axes` | list of axis | **NEW (FR-016)**; self-declared from the taxonomy; ≥1 expected for a JOIN; out-of-taxonomy entries recorded, not counted |
| `reason` | ≤1 sentence | unchanged |

Validation: `primary_axes` checked against the taxonomy seed; the orchestrator counts
coverage but never assigns axes (I2).

## Entity: Lens-to-axis mapping

Derived view over the joiner set: `{lens → primary_axes}`. Basis for coverage and
rarity. Rebuilt each gate from the JOIN replies (roster-resilient).

## Entity: Axis rarity

Derived view over the roster's declared mapping: `{axis → champion_count}` where
champion_count = number of joined lenses declaring that axis primary. Lower = rarer =
preferred when coverage gain ties (FR-006a / FR-017). Tracks the grid's
under-represented axes (Perf/Data = 0 champions; Sec = 1).

## Entity: Candidate panel

A set of ≤5 lenses = settled seats (untied relevance) + a choice of contested seats.
Its **coverage** = count of distinct primary axes across its members. The objective
selects the panel maximizing coverage, then applies the rarity sub-rule to residual
ties.

## Entity: Seating decision

The seated panel plus, per seat, a **provenance** tag:

| Provenance | Meaning |
|------------|---------|
| `relevance-settled` | seat fixed by an untied relevance score (no tie-break needed) |
| `coverage-decided` | seat chosen to maximize distinct-axis coverage |
| `rarity-decided` | seat chosen by the axis-rarity sub-rule on a different-axis tie |
| `operator-decided` | residual same-axis / rarity-tied seat broken by the operator |

Recorded in the ledger (FR-013) with the joiners' scores+axes and the rarity ranking,
sufficient to replay the seating by hand (SC-005).

## State / flow

```text
J JOINs ─▶ J ≤ 5 ? ─yes─▶ seat all (no tie-break)         [FR-002: cascade does not run]
            │no
            ▼
   relevance sort ─ clean top-5? ─yes─▶ seat top 5 (all relevance-settled)   [FR-003]
            │no (tie spans final seat)
            ▼
   maximize distinct-axis coverage of the panel  ──────────▶ coverage-decided seats   [FR-005]
            │ residual tie (equal coverage gain)
            ▼
   different-axis tie? ─yes─▶ seat rarest-axis candidate ──▶ rarity-decided seat       [FR-006a]
            │ same-axis tie, or rarity also ties
            ▼
   surface ONLY the residual choice to operator ───────────▶ operator-decided seat     [FR-006b/FR-007]
```

Determinism (FR-008/SC-004): identical `{lens, relevance, primary_axes}` inputs always
yield the identical panel and per-seat provenance; only `operator-decided` seats depend
on a human, and only the genuinely-undecidable residual reaches that step.
