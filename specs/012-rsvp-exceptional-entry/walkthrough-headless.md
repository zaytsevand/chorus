# Spec walkthrough — 012-rsvp-exceptional-entry

**Mode: headless · Verdict: advisory (CLEAN)** · Walked: 2026-06-17

Reconciles spec v3 against the **implemented canon** (post-edit `skill/chorus/*.md`). The transformation here is spec → canon-doc edits + conformance stanzas (markdown methodology repo; no runtime code).

## Phase 0 — Code-reality map (post-implementation)

- `GATE-PRIMITIVE.md` Stage 4 — tally now states `T = max(1, floor(N/2))` over non-author `N`; `T=2` at `N=4`; no tally at `N<2`; "no seat re-weighted."
- `SDLC-LAYER.md` — seating: cap 5 **ordinary** + uncapped **exceptional entry** (cite uncovered delta or refused; distinct deltas; no adjudicator; voice-not-weight; `board=min(roster,min(5,|ord|)+|exc|)`); S3 updated; ledger records the split + cited deltas.
- `SKILL.md` — RSVP Phase 0.5 lists exceptional entry; Phase-2 tally prose now **cites** GATE-PRIMITIVE (no restated `±2`).
- `INTEGRATION-LAYER.md` — conductor **side-note** declared safety net (3 regimes; recorded + routed to operator; never alters severity; flag-only, gating deferred).
- Conformance: `quickstart.md` CS-001..009; CS-009 grep confirms threshold formula lives only in GATE-PRIMITIVE; no stale `net≥+2`.

## Phase 1 — Structural

**Stage 1 · US articulation.** A lens that the round needs but the 5-cap would drop can enter by citing a concrete uncovered delta; a wider board then needs proportionally more agreement to promote a finding; and the conductor flags the edge cases for the operator.
- MATCH `«exceptional-entry»` — `SDLC-LAYER.md` seating realizes the evidence-gated tier.
- MATCH `«board-scaled-threshold»` — `GATE-PRIMITIVE.md` Stage 4 realizes the scaled `T`.
- MATCH `«conductor-side-notes»` — `INTEGRATION-LAYER.md` realizes the flag-only net.

**Stage 2 · Logical.** Entities: RSVP answer (+exceptional entry citing an uncovered delta), board (ordinary+exceptional), `N`, `T`, side-note, uncovered delta.
- MATCH `«uncovered-delta»` — introduced coherently as the entry object (`SDLC-LAYER.md`); duplicates collapse to one seat.
- MATCH `«arithmetic-severity»` — equal-weight votes preserved (`GATE-PRIMITIVE.md` "no seat re-weighted"); no protected flag anywhere.

**Stage 3 · Component-edges.** Outputs: the seating ledger (records exceptional split + cited deltas) and the gate ledger side-notes.
- MATCH `«seating-ledger»` — `SDLC-LAYER.md` mandates the record (SC-006 reconstructable).
- MATCH `«canon-hygiene»` (FR-016) — `SKILL.md:507` reconciled to a citation; CS-009 clean.

## Phase 2 — Per-US trace

### `«exceptional-entry»` (US1)
- Process — RSVP answer → seating evaluates the cited delta → seated or refused. MATCH `«evidence-gate»` (`SDLC-LAYER.md`).
- Observability — ledger records each exceptional seat + delta. MATCH `«seating-ledger»`.
- Value — WHAT: a lens enters on articulated value; HOW: a seat (voice, not weight). MATCH `«voice-not-weight»`.

### `«board-scaled-threshold»` (US2)
- Process — tally computes `net` vs `T=max(1,floor(N/2))`. MATCH `«scaled-tally»` (`GATE-PRIMITIVE.md`).
- Observability — `N`,`T`, severity reconstructable from recorded votes (SC-006). MATCH.
- Value — wide boards stay honest; `T=2` at `N=4` preserves canon. MATCH `«backward-compat-N4»`.
- **SURPRISE** `«base-round-reach»` — the threshold lives in `GATE-PRIMITIVE.md`, shared by **both** the base round (`SKILL.md` Phases 1/2/4, *uncapped*) and the SDLC gates. So scaling `T` also changes **base-round** tallies for wide base-round panels (e.g. 9 joiners → `N=8` → `T=4`, vs the old fixed `+2`). This is *consistent* with US2's intent (wide boards need more agreement) and is the correct single-home placement (Principle I), but US2's prose framed the change around exceptional entry / SDLC seating and did **not** state that base-round backward-compat holds only at `N=4`. Disposition: feed `/speckit-clarify` — add one line to the spec noting the scaled threshold applies wherever the gate primitive tallies (base round + gates), backward-compatible only at `N=4`.

### `«conductor-side-notes»` (US3)
- Process — gate completion checks the 3 declared regimes → emits/skips a note. MATCH `«regime-trigger»` (`INTEGRATION-LAYER.md`).
- Observability — note recorded in ledger, routed to operator. MATCH.
- Value — operator gets a human-catch flag; severity untouched (CS-007). MATCH `«flag-only»`.

## Synthesis

**Traceability:** every US → MATCH across all lenses; zero DRIFT; one SURPRISE (`«base-round-reach»`); zero blocking GAP (conformance stanzas exist as the verification surface; results recorded at Gate C).

**Verdict: advisory CLEAN** (zero DRIFT). The one SURPRISE (`«base-round-reach»`) is a spec-prose refinement, not an implementation divergence — the canon edit is faithful; the spec should add a sentence on the threshold's base-round reach.
