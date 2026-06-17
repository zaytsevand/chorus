# Agent-SDLC Log — Feature 011 (Gate Execution on a Native Workflow Substrate)

Lifecycle mode (`SDLC-LAYER.md`). This log is the durable ledger of the gates run on 011.
Run via plain `Agent` dispatches (no Workflow substrate — per standing operator guidance).

## Gate A — design review (2026-06-16)

### Run context

- **Target**: `specs/011-gate-workflow-execution/spec.md` (a spec; no plan.md/tasks.md exist,
  so Gate A is the right and only gate to run now — Gates B/C have nothing to review yet).
- **Honest deviations** (named, per Principle VIII / S-ordering):
  - The exploratory phase (Phase 0.7) was **folded into author briefs** rather than run as a
    standalone phase — proportionate to a single-file spec + cited canon. Each author brief
    carried a verified **Workflow substrate facts** block so authors re-grounded the spec's
    claims against the real tool contract (Principle V), not the spec's own paraphrase.
  - The orchestrator authored no finding and synthesized no vote (S1/S9). Consolidation of
    the authored findings into the register below is Extract/formatting, not authoring; every
    severity came from an author and every band from the deterministic tally.

### Roster (this round) — Phase 0.5 RSVP

| Lens | RSVP | Two-axis signal |
|------|------|-----------------|
| Richards (architecture) | JOIN | runner↔orchestrator seam; structural-vs-disciplinary claim · 🟡 |
| Goldratt (constraint/flow) | JOIN | is the runner on the constraint? batch size · 🟡 |
| Uncle Bob (clean-code/SOLID) | JOIN | runner/orchestrator SRP + DIP boundary · 🟡 |
| Beck (TDD/simple-design) | JOIN | SC-001 parity test falsifiability · 🟡 |
| Evans (DDD) | JOIN | Published Language at the seam; invariant enforcement · 🟡 |
| Delivery-and-Ops | JOIN | second-substrate run-cost / observability / determinism · 🟡 |
| Security-and-Trust | JOIN | autonomous artefact-mutation + trust-the-return channel · 🟡 |
| Cooper (adversarial product) | JOIN | beneficiary = authors not operator? · 🟡 |
| Norman (HCD) | **ABSTAIN** | FR-008 keeps every operator prompt inline → no operator-facing delta · 🟢 |
| Guido (Python) | **ABSTAIN** | language rule — Workflow scripts are JS, no Python in scope |

J = 8 joiners → full chorus.

### Findings register (consolidated; merged authorship)

| ID | Proposed | Finding | Authored by |
|----|----------|---------|-------------|
| CF-1 | 🔴 | Tally rule becomes a 2nd uncontrolled copy of the Core (Principle I); canon already evolved (009); no conformance fixture keeps code↔prose in lockstep | Richards, Evans, Delivery, Beck |
| CF-2 | 🔴 | SC-001 parity test unfalsifiable ("…or author-variance" escape hatch) → green-by-coincidence | Beck, Richards |
| CF-3 | 🔴 | No fail-closed default on a dropped/null escalation → silently-passed 🔴 (Principle VII) | Security |
| CF-4 | 🔴 | Self-heal can clear a 🔴 by editing the artefact it cites; trail records a band, not a diff | Security, Uncle Bob, Cooper |
| CF-5 | 🔴 | Batch too big (Principle IX); defer self-heal + extract behind a passed SC-001 | Goldratt, Beck |
| CF-6 | 🔴 | Observability regression: return gives conclusions, not per-agent deliberation; divergence undiagnosable | Delivery |
| CF-7 | 🔴 | Barrier latency unpriced; a hung author holds the fan-out hostage; non-interruptible background run | Delivery |
| CF-8 | 🟡 | Constitution collision: a JS runner is runtime code in a markdown-only repo (constitution:296-298) | Beck |
| CF-9 | 🟡 | Gate-return is an anemic bag, not a Published Language → orchestrator re-authors → S1 leak | Evans, Richards, Uncle Bob |
| CF-10 | 🟡 | Decision-band meaning leaks into the runner; it should emit predicate inputs, not bands | Evans |
| CF-11 | 🟡 | Self-heal in-flight signifier lost (spec-006 regression); background can't emit live | Richards, Cooper |
| CF-12 | 🟡 | Invariants enforced by inspection, not an executable S8 assertion | Evans, Uncle Bob |
| CF-14 | 🟡 | Frame: 2 of 3 motivations serve authors not operator; not priced on the constraint | Cooper, Goldratt |
| CF-15 | 🟡 | SC-006 overclaims byte-identical against non-deterministic agent outputs | Cooper, Delivery |
| CF-16 | 🟡 | Return trusted verbatim; no consistency check (re-derive band from votes) | Security |

Recorded minor refinements (author-proposed 🟢, uncontested, not balloted): split FR-006 into
isolate/short-circuit (UB); characteristic ranking unsourced (R-F1); quorum floor undeclared
(R-F7); rename "self-heal trail" → "re-verification trail" / "orchestrator" overload (UB, E).
Affirmations: DIP boundary is clean (UB); the hybrid cut is correct (Cooper, Richards); SC-001
is genuine deferral not a fig leaf (Cooper); no new secret/PII surface (Security).

### Vote tally (Stage 3 → 4; `net = P − O`)

| ID | P | C | O | net | Rule | Final band |
|----|---|---|---|-----|------|-----------|
| CF-1 | 4 | 0 | 0 | +4 | escalate (capped) | 🔴 **gating** |
| CF-2 | 6 | 0 | 0 | +6 | escalate (capped) | 🔴 **gating** |
| CF-3 | 6 | 1 | 0 | +6 | escalate (capped) | 🔴 **gating** |
| CF-4 | 4 | 1 | 0 | +4 | escalate (capped) | 🔴 **gating** |
| CF-5 | 2 | 4 | 0 | +2 | escalate (capped) | 🔴 **gating** |
| CF-6 | 1 | 6 | 0 | +1 | hold | 🔴 **gating** |
| CF-7 | 1 | 6 | 0 | +1 | hold | 🔴 **gating** |
| CF-12 | 2 | 4 | 0 | +2 | **escalate 🟡→🔴** | 🔴 **gating** |
| CF-16 | 3 | 4 | 0 | +3 | **escalate 🟡→🔴** | 🔴 **gating** |
| CF-8 | 1 | 5 | 1 | 0 | hold | 🟡 held |
| CF-9 | 2 | 2 | 1 | +1 | hold | 🟡 held |
| CF-11 | 0 | 6 | 0 | 0 | hold | 🟡 held |
| CF-15 | 1 | 3 | 2 | −1 | hold | 🟡 held |
| CF-10 | 1 | 2 | 4 | −3 | **demote 🟡→🟢** | 🟢 demoted |
| CF-14 | 0 | 4 | 2 | −2 | **demote 🟡→🟢** | 🟢 demoted |

### Verdict: Gate A does NOT clear — 9 gating 🔴

The spec is well-framed (the hybrid cut, the SC-001 deferral, and the structural-honesty
motivation all drew explicit affirmations), but it does not pass as written. Nine 🔴, which
cluster into four remediation themes:

1. **Band integrity has no single enforced authority or fail-closed floor** — CF-1 (tally is a
   second copy with no conformance fixture), CF-2 (the one parity experiment is unfalsifiable),
   CF-3 (a dropped escalation fails *open*), CF-16 (the return is trusted verbatim). Multiple
   lenses noted these collapse into **one fix**: a frozen-vote conformance fixture + a
   fail-closed default (absence of an explicit non-🔴 band = gating) + a re-derive-band-from-votes
   consistency check.
2. **Self-heal is the riskiest, least-justified part and is mis-placed** — CF-4 (an autonomous
   edit can clear a 🔴 by erasing its cited evidence; the trail records a band, not a diff) and
   CF-5 (Principle IX: the self-heal + extract machinery is being specced before the parity
   verdict that would justify it). Defer self-heal and extract to a second slice.
3. **The substrate is operationally opaque** — CF-6 (the structured return loses the per-agent
   deliberation needed to diagnose a parity divergence) and CF-7 (a hung author holds the
   barrier hostage; the background run is non-interruptible with no timeout bound).
4. **Honesty by inspection, not assertion** — CF-12 (S8/S1/S9 rest on "a reviewer reading the
   script", escalated to 🔴): the S8 routing is pure code over data and is directly unit-testable.

Held 🟡 (non-gating, recorded): CF-8 (constitution markdown-only collision — **operator-owned
governance call**, see below), CF-9 (anemic return shape — largely subsumed by the CF-1/16 fix),
CF-11 (lost in-flight signifier), CF-15 (tighten SC-006 wording to the band, not the bytes).

Demoted to 🟢 by the tally: CF-10 (computing a band from fixed thresholds in code is Principle III
done right, not orchestrator inference — net −3) and CF-14 (framing critique; the spec already
names the prior verdict and gates adoption on SC-001 — net −2).

### Block on 🔴 — escalated to operator (NOT auto-healed)

Per Principle VII / `DECISION-PRIMITIVE.md`: a gating 🔴 is normally a self-heal 🟡 (auto-incorporate
while cycle<3). This gate was **escalated to the operator instead of auto-healed**, for two honest
reasons: (a) **CF-8 is a constitution/governance decision** the catalog does not mark self-healable
— amending "markdown-only, no runtime code" is operator-owned (Principle VI); and (b) **CF-5** is a
strategic "defer half the FRs" call on the operator's own design. Auto-rewriting the spec nine times
would synthesize design decisions that belong to the operator. DecisionRecord: `gateA-block-1`,
state = **escalated**, awaiting operator direction.

### Operator decision (2026-06-16) — `gateA-block-1` resolved

Operator directed: (a) **amend the constitution** to admit a bounded Workflow runner as a third
executable surface (CF-8 resolved — `.specify/memory/constitution.md` Authoring Constraints,
"Markdown-first; executable surfaces are enumerated and bounded"); (b) **incorporate the fixes
into a v2 spec and re-verify** (self-heal cycle 1).

### Self-heal cycle 1 — incorporation + re-verification

The spec was revised to rev 2 (see § "Gate A resolution (2026-06-16)" in `spec.md`). Re-verification
dispatched to the lenses that raised each theme. All nine 🔴 **CLEARED**; no new gating issue.

| 🔴 | Resolution in rev 2 | Verifier | Verdict |
|----|--------------------|----------|---------|
| CF-1 | FR-004a: thresholds as cited data + frozen-vote conformance fixture in CI on every runner/primitive change | Richards | CLEARED |
| CF-2 | SC-001 rewritten: parity on a frozen `{findings,votes}` fixture vs canon band table; escape hatch removed | Beck | CLEARED |
| CF-3 | FR-007 + US3 + SC-003: only an explicit non-🔴 band releases; null/absent = gating (fail-closed) | Security | CLEARED |
| CF-4 | Self-heal deferred to Slice 2; integrity (diff/hash, told-what-changed, no self-vote) recorded as binding obligation; FR-011 makes Slice 1 write-nothing | Security | CLEARED (by deferral) |
| CF-5 | Scope split: Slice 1 = Author→Vote→Tally + integrity; self-heal + extract deferred behind a passed SC-001 | Goldratt | CLEARED |
| CF-6 | FR-013 + SC-008: per-agent transcript handle on every finding/vote → divergence diagnosable | Delivery | CLEARED |
| CF-7 | FR-006a: per-stage timeout → recorded `stage-timeout`; non-interruptibility named, timeout is the bound | Delivery | CLEARED |
| CF-12 | FR-003a + SC-002: executable S8 assertion (no finding on own ballot), by test not inspection | Beck | CLEARED |
| CF-16 | FR-004b + SC-007: orchestrator re-derives band from votes, asserts == claimed (audit, not re-tally) | Richards | CLEARED |

Also folded: CF-9 (finding-centric Published Language return, FR-008) confirmed cleared; R-F1
(characteristic ranking) now explicit. One cheap re-verify residual applied immediately: FR-004b
now reads the **same cited canon thresholds** as FR-004a (Richards — else CF-1 reappears at the
auditor layer).

### Held 🟡 (non-gating; recorded for Slice 2 / tasks.md — operator proceeds at will)

- **Throughput axis unmeasured (Goldratt F3)** — every SC measures conformance; none measures
  cycle-time / operator-minutes, the axis the prior "strictly negative" verdict turned on. The
  eventual *adoption* call is blind on that axis. Add a CD-facing measurement to the SC-001 run.
- **CF-4 obligation is prose, not CI (Security)** — when Slice 2 is specced, the diff/hash
  re-verification-trail requirement must become an FR-004a-style conformance fixture, or it lapses.
- **SC-009 names no falsification (Beck)** — ~~"reconstructable… only formatting" has no named red,
  unlike the other eight SCs.~~ **RESOLVED 2026-06-17**: a 4-haiku sanity-check workflow re-flagged
  this as the same pattern as CF-12 (honesty invariant by inspection, no executable red). SC-009
  rewritten with a falsifiable red (frozen-return fixture → byte-traceability of every rendered ledger
  value to a return field; 0 orchestrator-supplied values beyond formatting). Consistent with CF-12's
  FR-003a/SC-002 fix.
- **FR-006a pins no timeout value (Delivery)** — tasks.md must pin a concrete default (single-digit
  minutes via `args`) + owner, so the bound is concrete not aspirational.

### Gate A verdict (post cycle 1): **CLEARS**

0 unresolved gating 🔴. The held 🟡 are recorded and non-blocking. Slice 2 (self-heal + extract)
remains deferred behind a passed SC-001. Next gate is **Gate B (plan/tasks)** if/when the operator
advances 011 to `/speckit-plan`.

### S-invariant self-audit (Gate A)

| Invariant | Status |
|-----------|--------|
| S1 (orchestrator authors nothing) | held — all findings author-sourced; consolidation was Extract/formatting |
| S8 (author never grades own finding) | held — every voter's authored findings explicitly excluded |
| S9 (orchestrator synthesizes no vote) | held — every band from the deterministic tally, not orchestrator judgment |
| Self-heal bound (S7) | held — cleared at cycle 1; escalation to operator occurred before any auto-rewrite |
| Block on 🔴 (Principle VII) | held — gate escalated, not silently passed; operator adjudicated |

## /speckit-plan → /speckit-tasks → /speckit-implement (2026-06-17)

**Gate B (plan/tasks review) was SKIPPED** by operator direction (went plan→tasks→implement
directly). Recorded so Gate C weighs the plan/tasks unreviewed.

**Plan/tasks**: plan.md (Constitution PASS pre & post; one justified deviation = runtime code under
the CF-8 carve-out), research.md (U1/U2/U4 resolved; U3 bounded residual), data-model.md,
contracts/gate-return.md, quickstart.md (C1–C11), tasks.md (29 tasks). A stale `.specify/feature.json`
pinned to feature 010 made both setup scripts misfire to 010; repointed to 011.

**Implementation (Slice 1)**:
- `skill/chorus/workflows/gate-core.mjs` — pure deterministic core (tally, deriveBand with injected
  thresholds, S8, fail-closed, re-derive, ledger render). Owns no gate meaning.
- `skill/chorus/workflows/gate-runner.mjs` — bounded Workflow shell (Author→Vote→Tally fan-out),
  delegates all decisions to gate-core. **Integration assumption flagged** (Gate C): assumes the
  Workflow runtime resolves the local ESM import of gate-core; if not, inline + core-parity-lock.
- `skill/chorus/workflows/conformance/` — frozen fixture + `run-all.mjs` suite.

**Conformance result**: `node …/run-all.mjs` → **10 pass / 0 fail / 1 runtime-deferred skip** (exit 0).
C1 SC-001, C2 FR-004a, C3 SC-002(S8), C4 SC-002(honesty), C5 SC-003, C6 SC-004, C8 SC-006, C9 SC-007,
C10 SC-008, C11 SC-009 all PASS. C7 (hang) SKIP — needs the live runtime. *(C4 caught a real false
positive on first run — a prose `net = P − O` string in the runner — fixed by comment/string-stripping;
evidence the suite can fail.)*

### Inputs for Gate C (implementation review)

- **Gate B was skipped** — Gate C should also sanity-check plan/tasks coherence, not just the code.
- **Integration assumption (runtime import)** — gate-runner imports gate-core; unverified against the
  live Workflow runtime. The deterministic guarantees are verified against gate-core directly, so this
  affects only the live fan-out, but Gate C should weigh it.
- **U3 timeout-without-a-clock residual** — a hung author is bounded only by the substrate's infra
  timeout (→ null → recorded gap); a *named* `stage-timeout` distinct from error needs a substrate
  signal that may not exist. Fail-safe holds regardless.
- **The live half of SC-001 is unrun** — only the deterministic tally tail is proven in node. The live
  fan-out parity (Workflow gate vs plain-Agent gate on the same corpus) is the operator-gated adoption
  experiment, intentionally not run here ([[no-ultracode-mode]]).
- **Standing held 🟡 (from Gate A)**: throughput-axis SC unmeasured (Goldratt); CF-4 diff/hash is a
  Slice-2 obligation; FR-006a timeout *value* — pinned conceptually to the orchestrator's run-level
  bound (T020), but the runner cannot self-enforce it (U3).
- **Deviations**: 11 conformance stanzas implemented as one suite file; C7/C10 runtime-deferred.
