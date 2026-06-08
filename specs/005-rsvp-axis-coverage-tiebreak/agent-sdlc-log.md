# Agent-SDLC Ledger — Feature 005 (RSVP axis-coverage tie-break)

- **Feature**: 005-rsvp-axis-coverage-tiebreak
- **Status**: **PARKED** (2026-06-08, operator decision) — Gate A ❌ BLOCKED (cycle 1/3) with 3 gating 🔴 (F1, F2, F4). Rather than incorporate, the operator parked the feature: the panel found the mechanism marginal on the standing near-axis-disjoint roster, and uniform-disjoint seating ties are operator territory. Revisit when the roster grows axis redundancy / rarity gradients. Issue #3 closed with this rationale.
- **Source**: GitHub issue #3
- **Pipeline position**: spec ✅ → clarify ✅ → plan ✅ → **Gate A (design) ❌** → tasks (blocked)

---

## Gate A — Design review (cycle 1)

**Corpus**: `specs/005-rsvp-axis-coverage-tiebreak/{spec.md, plan.md, research.md, data-model.md, contracts/*, quickstart.md}`. No `CHORUS-PROJECT.md` addendum (the project is the chorus-review skill itself); no scope exclusions (all-Markdown source).

### RSVP

| Lens | Decision | Relevance | Reason |
|------|----------|:---:|--------|
| Cooper (adversarial product) | JOIN | 3 | Mechanism serves the procedure, not the operator — squarely the user-cost lens. |
| Beck (TDD/simple design) | JOIN | 3 | The replay is a failing characterization test; does the simplest thing earn all four mechanisms? |
| Richards (architecture) | JOIN | 3 | Contract-fidelity at a seam; touches the S3/I2 invariant boundary. |
| Uncle Bob (clean/SOLID) | JOIN | 3 | Abstraction-vs-demonstrated-value; FR-014/SC-001 unsatisfiable. |
| Evans (DDD) | JOIN | 3 | Coverage model vs operator's real rule = ubiquitous-language fracture. |
| Constraint-and-Flow (deferral/cost) | JOIN | 2 | Gold-plates a non-constraint; R1 disproves the success criterion. |
| Norman (HCD) | ABSTAIN | (2) | Real HCD seam, but defers to Gate B once the residual-prompt/ledger surfaces are concrete. |
| Delivery-and-Ops | ABSTAIN | (1) | Only run-cost hook; no deploy/release/observability surface. |
| Security-and-Trust | ABSTAIN | (0) | No trust boundary, external input, or data surface; all personas first-party. |

**Seating**: J=6 → cap forces eviction. Relevance sort is **clean** (five 3s, then Constraint-and-Flow at 2) — no tie spanning the 5th seat, so S3 seats the top five with **no operator interruption** (the feature-005 cascade under review would not itself fire here). Seated: **Cooper, Beck, Richards, Uncle Bob, Evans.** Constraint-and-Flow evicted at relevance 2 (its concern echoed by Beck/Cooper; recorded, non-gating).

### Findings register

| ID | Author(s) | Proposed | Evidence | Summary |
|----|-----------|:---:|----------|---------|
| F1 | all 5 (convergence) | 🔴 | quickstart Outcome table; research R1; spec FR-014/SC-001 | Spec asserts the cascade reproduces the operator's 004 slate; its own quickstart refutes it (forces in the 2 dropped lenses, still prompts 3-of-6). |
| F2 | Evans | 🔴 | research R1; quickstart Step 3–5; spec SC-001 | Model fracture: "axis coverage" is not the operator's real concept (gate-relevance); core abstraction names the wrong thing. |
| F3 | Beck, Bob | 🟡 | FR-006a/017, FR-016, FR-013; R5 caveat; quickstart Step 4 `[principle: YAGNI]` | Rarity + self-declaration + 4-tag provenance unforced by any demonstrated case — defer rarity. |
| F4 | Uncle Bob | 🔴 | FR-009; data-model:13; rsvp-reply.md:39–41; README.md:189-201 `[principle: SSOT/DRY]` | Two sources of axis truth (README grid "seed" vs joiner self-declaration) allowed to silently diverge; name the authority. |
| F5 | Cooper, Beck, Evans | 🟡 | research R1 alternatives; quickstart:90–94 | Rescope, don't merely reframe — bound feature to redundancy/rarity gates; return uniform-disjoint ties to the operator. |
| F6 | Richards, Bob | 🟡 | R2/R3; SKILL.md:216; seating-cascade.md preconditions | "One definition, both modes" references a cascade round-mode never executes (uncapped); document the dormancy at the seam. |
| F7 | Beck, Cooper | 🟡 | quickstart Step 3; FR-005 | Coverage objective silently prefers generalists over specialists — unstated consequence contradicting operator intent. |
| F8 | Evans | 🟡 | spec Context:22; R1:46 | Glossary clash: "relevance" (the score) vs "gate-relevance" (operator's true rule); disambiguate. |
| F9 | Beck, Richards | 🟢 | R2; FR-010/SC-006; contracts/seating-cascade.md | Canonical single-definition cascade is the right structural move; keep. |
| F10 | Richards, Cooper, Evans | 🟢 | FR-008/FR-013; R6; SC-004/005 | Determinism + per-seat provenance ledger is a genuine hand-replayable fitness function; keep. |
| F11 | Evans, Richards | 🟢 | FR-009/FR-016; R4; I2 | Self-declared primary_axes is the correct boundary (orchestrator counts, never assigns); keep. |
| F12 | Uncle Bob | 🟡→🟢 | data-model:52–59; ledger contract:36 | 4-valued provenance tag becomes a dead enum if rarity deferred → 3-valued. |
| F13 | Uncle Bob | 🟢 | spec FR-002/003 vs seating-cascade.md:18 | Naming drift "fifth seat" vs "seat C"; harmonize on the named cap constant. |

### Vote tally (stage 4, deterministic)

Non-author votes only (S8). PRIORITIZE explicitly capped at the proposed level is recorded as affirm-at-level, not escalation (S9 — real stated severities aggregated, not blunt-counted).

| ID | Votes (non-author) | net | Post-tally | Gating |
|----|--------------------|:---:|:---:|:---:|
| F1 | unanimous independent convergence (5/5) | — | 🔴 | **YES** |
| F2 | Cooper P, Beck P, Richards P, Bob P | +4 | 🔴 (capped) | **YES** |
| F4 | Cooper P, Beck P, Richards P, Evans P | +4 | 🔴 (capped) | **YES** |
| F3 | Cooper P, Richards P(🟡), Evans P(🔴) | — | 🟡 (capped by 2 architects) | no |
| F5 | Richards P, Bob P | +2 | 🟡 (affirm-rescope; not escalated above authors' 🟡) | no |
| F6 | Cooper P, Beck P(🟡), Evans P(🟡) | — | 🟡 | no |
| F7 | Richards P, Bob P, Evans P (all 🟡) | — | 🟡 | no |
| F8 | Cooper/Beck/Richards/Bob P (all 🟡) | — | 🟡 | no |
| F12 | Cooper P, Evans P / Beck O, Richards O | 0 | 🟢 (conditional on F3) | no |
| F9/F10/F11 | affirmed keep | — | 🟢 | no |
| F13 | affirmed | — | 🟢 | no |

### Phase 3 — conflict reconciliation

- **C1 — F3 (cut self-declaration FR-016) vs F11 (keep self-declaration as the correct boundary).** Resolved (Richards' proposal): **keep** self-declaration but **bind it as a subset of the README grid**, which is named the **SSOT authority** for axes. A lens may scope down to a subset of its grid row, never declare an axis outside it. This simultaneously discharges **F4** (one authority, divergence rejected) and preserves F11's boundary. Carried by F4's remediation.

### 🔴 resolution / incorporation (owed — cycle 1/3)

Gate halts per S4. Incorporation cascade = `/speckit-clarify` → `/speckit-plan`, then re-run Gate A (cycle 2). Required to clear the three 🔴 (and fold the strong 🟡 directives):

1. **F1 + F2 (🔴):** Retire FR-014/SC-001's "reproduces the operator's slate" claim. Reframe the core concept from *"maximize axis coverage to mimic the operator"* to *"evict axis-redundant lenses to preserve coverage breadth."* The operator's real rule (gate-relevance) is merit and stays the operator's (S3/I2).
2. **F4 (🔴):** Name the README 12-axis grid the **SSOT authority**; self-declaration must validate as a **subset** of the lens's grid score-3 row (closes C1).
3. **F5 (🟡, strong):** Rescope — the cascade governs **redundancy/rarity gates**; **uniform-disjoint ties are explicitly operator territory** (the feature does not claim to resolve them).
4. **F3 + F12 (🟡):** **Defer rarity** (FR-006a/FR-017) until a real rarity-gradient gate exists; collapse provenance to **3-valued**.
5. **F6/F7/F8 (🟡):** Document the dormant round-mode reference at the seam; name the generalist-over-specialist consequence; disambiguate "relevance" vs "gate-relevance."
6. **Keep (🟢):** canonical cascade (F9), provenance ledger (F10), self-declaration boundary bounded by the grid (F11), `seat C` naming (F13).

**Awaiting operator direction**: incorporate (clarify→plan rework, cycle 2), waive specific 🔴 with rationale (S4), or reconsider scope/defer the feature.

### S1–S9 self-audit

- **S1** pass — review authored no spec/plan/code; the corpus traces to `/speckit-specify|clarify|plan`.
- **S2** pass — RSVP fired independently at this (first) gate.
- **S3** pass — J=6, seated 5 by declared relevance; clean sort, no operator tie-break, no lens-merit judgment.
- **S4** pass (correctly blocking) — 3 open 🔴; gate halted, not passed; none silently passed.
- **S5** pending — incorporation will revise the spec via clarify→plan; no downstream hand-patch.
- **S6** pass — every counted finding carries file:line / FR ref / principle tag; unsupported claims none.
- **S7** pass — cycle 1 of 3.
- **S8** pass — authors excluded from voting on own findings (per-voter skip lists).
- **S9** pass — severity from real dispatched votes + deterministic tally; no synthesized vote.
