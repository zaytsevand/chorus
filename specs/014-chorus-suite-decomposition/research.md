# Research — Chorus Suite Decomposition

All major unknowns were resolved during brainstorming (design doc) and
`/speckit-clarify`. This file consolidates the decisions, rationale, and rejected
alternatives so the plan has no open NEEDS CLARIFICATION.

## D1 — Decomposition shape

**Decision**: Shared-substrate suite — `chorus-core` + `chorus-review` +
`chorus-sdlc`, each composing core; nothing depends on a fat sibling.

**Rationale**: Only this shape preserves the "two modes cannot drift" invariant by
construction (single source in core) while leaving room to peel off future skills
(viewpoint-extraction, setup, memory-update) as clean peers.

**Alternatives rejected**:
- *Review owns primitives, sdlc depends on it* — recreates the fat-sibling
  dependency; every future skill would depend on the big review skill.
- *Two fully independent skills with duplicated primitives* — violates the
  anti-drift invariant outright.

## D2 — INTEGRATION-LAYER split (Fork A)

**Decision**: Split it. Shared discipline **and the full `I1–I9` invariant
catalog** → `chorus-core/CONDUCTOR.md`; round-specific phase gates →
`chorus-review/INTEGRATION-LAYER.md`.

**Rationale**: `SDLC-LAYER.md`'s `S1/S2/S4/S5/S6` explicitly *extend* `I1/I2/I7/I8`.
If those `I`-invariants stayed in review, `chorus-sdlc` would depend on
`chorus-review` through the audit-chain lineage — the exact coupling the suite
exists to kill (architecture review, source-verified against
`SDLC-LAYER.md:182,186,188,197,202` ↔ `INTEGRATION-LAYER.md:328-353`). Putting the
catalog in core makes it the single source for the numbering scheme the
anti-drift promise rests on.

**Alternative rejected**: leave INTEGRATION-LAYER whole in review (reintroduces the
dependency).

## D3 — Sibling→core wiring (Fork B)

**Decision**: Reference by name (skill-invoke): each sibling carries
`REQUIRED: chorus-core`; core's `SKILL.md` is a lean router (small index →
on-demand reads of its four files) and opens with a **reachability self-check**.

**Rationale**: Reference-by-name is the best-practice cross-skill mechanism and
keeps progressive disclosure via the router. Path-based cross-skill `Read` is
fragile and was rejected.

**Failure mode handled**: `REQUIRED:` is advisory (only `name`/`description` are
loader-enforced). A missing/renamed core would no-op silently → mitigated by the
router self-check (loud failure) + fitness checks #1/#3.

## D4 — Behavior-parity rigor (clarification Q1)

**Decision**: Full writing-skills RED-GREEN pressure/application scenarios for
every moved/split skill (`chorus-core`, `chorus-review`, `chorus-sdlc`) — baseline
captured pre-split, scenarios re-run post-split, equivalence demonstrated.

**Rationale**: The Iron Law governs (no skill edit without a failing test first);
structural relocation still demands behavioral proof, not assertion.

**Alternatives rejected**: structural-equivalence-only; lightweight manual parity.

## D5 — Fitness-check execution surface (clarification Q2)

**Decision**: Specify the three checks as greppable, manually-runnable contracts
now; defer the automated harness (a Jest/TS test suite) to a follow-up spec.

**Rationale**: The repo has no CI today; the checks are the source-of-truth
contracts a later harness will call. Keeps this feature focused.

## D6 — Installer migration (clarification Q3)

**Decision**: Installer keeps copy/iterate behavior; performs **no** stale-file
migration on existing installs. Obsolete-file cleanup is handled out-of-band via
Claude at integration time.

**Rationale**: The invariant-resolution check operates on repo source (no stale
files there), so installed-dir staleness does not affect deliverable correctness.

## D7 — Findings→memory contract (build-now seam)

**Decision**: Extend `CHORUS-PROJECT.md` (and its template) with a findings→memory
targets/policy section; document the findings-artifact shape + agent-memory layout
in `chorus-core`. Callback/hook **implementation deferred**.

**Rationale**: The memory layout and findings shape already exist in the running
system; naming them as a contract records load-bearing reality so a later callback
is a clean addition.

## D8 — Constitution / governance

**Decision**: The constitution is an unfilled template; the Constitutional-ROI
ranking dimension is skipped. The skill-authoring Iron Law is the governing
discipline for this feature.
