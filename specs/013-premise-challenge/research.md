# Phase 0 — Research: premise pass in Gate A

The v2 spec carries **0 NEEDS CLARIFICATION** and cleared Gate A at cycle 1. Phase 0 therefore resolves only the **design questions the plan must settle before authoring the canon edit** — each grounded in the cycle-0/1 ledger.

---

## D1 — Where does the premise-pass brief + red-team checklist live? (canonical home)

- **Decision**: a single new subsection in **`SDLC-LAYER.md`** — `### Gate A — premise pass (runs first)` — placed after `### Exploratory phase (per gate)` and before `### Block on 🔴`. It contains: the adversarial brief, the fixed red-team checklist, the honest-null rule, and the scope-tag-in-vote rule. `SKILL.md`'s `challenge` mode and the standalone invocation **cite** this subsection.
- **Rationale**: Gate A is the primary consumer; the premise pass *is* a re-brief of Gate A (FR-001). One home satisfies Principle I and resolves cycle-0 **F14** ("no canonical home named"). Crucially it is **not a new canon file** — that would re-introduce the K4 architecture reds (FR-007 / SC-005 forbid a new canonical doc).
- **Alternatives rejected**: (a) a new `CHALLENGE-LAYER.md` — explicitly forbidden by SC-005; (b) home in `SKILL.md` with SDLC-LAYER citing it — rejected because the lifecycle integration (ordering, ledger, vote-scope) is SDLC-layer machinery, so the home belongs where the integration lives.

## D2 — How is finding scope (premise vs within-frame) classified without a stanza?

- **Decision**: scope is a **finding attribute the author declares and the vote confirms**, reusing `GATE-PRIMITIVE.md` S8/S9 vote authority exactly as severity is. The author tags a finding `[premise]` or `[within-frame]`; non-author voters confirm/correct the tag in the vote stage. A `[within-frame]` finding is **parked** for Gate A's normal within-frame review (not discarded) and does not count as premise divergence.
- **Rationale**: directly implements the most convergent cycle-0 red **F6** (net +4 — "seat the boundary in the vote, not a regex"). Personas already hold authority over severity (a judgment); scope is the same kind of judgment. No text-matching/regex reads authorial intent (FR-004 / SC-002).
- **Alternatives rejected**: a conformance stanza / regex classifier (v1's approach) — Gate A judged it unable to read intent (F6, unanimous); a separate classifier agent — a new mechanic, forbidden by FR-007.

## D3 — What are the fixed, author-independent red-team checklist items?

- **Decision**: a short, prior-free list of premise questions that do **not** depend on the panel's training distribution, applied every premise pass with each item's outcome recorded. Working set (finalized in `data-model.md`): (1) Is the problem **observed or forecast**? (2) Symptom or **root cause**? (3) Does the feature **manufacture its own need**? (4) What is the **cheapest experiment** that would settle this instead of building? (5) Who is **harmed if we do nothing** — and is that harm evidenced? (6) Is the premise **falsifiable** — what would prove it wrong?
- **Rationale**: the floor beneath same-model persona attacks (§4d, cycle-0 **F1**). The items are *questions the panel must answer*, not a classifier — distinct from the F6 regex (cycle-1 Beck confirmed this distinction is acceptable). FR-005 / SC-003.
- **Alternatives rejected**: a long exhaustive checklist (operational cost on every run — cycle-0 F19/F21); a model-generated checklist (defeats the out-of-distribution purpose — it would share the panel's priors).

## D4 — How do premise-tagged findings "surface first" and stay reconstructable?

- **Decision**: ledger ordering is fixed by **FR-010** — the premise pass (RSVP, premise-tagged findings, red-team checklist outcomes, tally, honest-null) is recorded **first**, then within-frame findings, then parked-from-premise findings. A note is added to `SDLC-LAYER.md` `## The ledger` describing this Gate-A ordering. No schema change to the ledger contract (reuses the existing register + tally schema).
- **Rationale**: gives the operator the divergence *before* design discussion (US1); resolves cycle-0 **F12** (parked hand-off contract) with an ordered, in-process, auditable seam — no cross-phase dependency.
- **Alternatives rejected**: a separate premise-findings document (a new artefact/home, forbidden); interleaving premise + within-frame findings (loses "surface first," US1).

## D5 — What bounds the honest-null re-run? (cycle-1 R5)

- **Decision**: a premise pass judged to have *not genuinely attacked* the premise re-runs, **bounded at N = 3 cycles** (mirroring the gate self-heal bound, `SDLC-LAYER.md` Loop bound / S7); the third failed cycle **escalates to the operator** (a `DECISION-PRIMITIVE.md` 🔴 ask) rather than looping. This closes the unbounded-re-run gap cycle-1 Delivery flagged.
- **Rationale**: reuses the existing bounded-loop discipline (no new mechanic); keeps the pass self-unblocking yet finite (Principle X, bounded heal).
- **Alternatives rejected**: unbounded re-run (cycle-1 R5 objection); auto-pass after one re-run (would silently accept a hollow pass — violates the honest-null invariant F17/US3).

---

### Consolidated deferrals (carried to Complexity Tracking)

R1 (same-model floor limit — accept as stated limit; soften spec wording), R2 (shallow-but-formatted detector — defer, no evidence yet), R3 (sound-premise contrapositive fixture — add as a low-cost conformance task or defer), R4 (default-on cost — keep, watch). R5 is **closed here** by D5. All trace to Principle IX (defer what the next validated step won't exercise).
