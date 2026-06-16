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
