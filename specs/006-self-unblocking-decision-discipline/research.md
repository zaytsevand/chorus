# Phase 0 Research: Self-Unblocking Decision Discipline

Markdown skill authoring — the "unknowns" are mechanism-design choices, not technology
choices. Each decision records what the procedure commits to, with rationale and rejected
alternatives. The brainstorm design resolved the major forks; these pin the *how*. Two
honest design risks (R2, R4) are flagged for the agent-SDLC Gate to scrutinize.

## R1 — One canonical `DECISION-PRIMITIVE.md`, referenced by both modes

**Decision**: Author the three-band model, the two-axis signal, the DecisionRecord +
review-surface rendering, the decision catalog, and invariants D1–D5 **once** in a new
`skill/chorus-review/DECISION-PRIMITIVE.md`. `SDLC-LAYER.md`, `SKILL.md`, and
`INTEGRATION-LAYER.md` **reference** it (they do not restate it), exactly as both modes
reference `GATE-PRIMITIVE.md` today.

**Rationale**: FR-016/SC-007 require one definition, no divergent copy. The decision
discipline is cross-cutting across both modes (every decision point in both), so it earns
its own primitive file — the same factoring the gate primitive already established.

**Alternatives rejected**: Restating bands in each layer doc (the drift the gate-primitive
refactor fixed). Folding it into `GATE-PRIMITIVE.md` (that file is about *one review's*
four stages; decisions span the whole lifecycle — wrong altitude).

## R2 — Banding by declared predicate, and the catalog-correctness risk ⚠

**Decision**: Each decision **type** carries a declared band in the catalog
(`contracts/decision-catalog.md`). At runtime the orchestrator refines an instance using
**only**: a mechanical predicate (sort strictness at the cap, a cycle counter, an
artefact-presence test) or a **persona-declared flag** (a seated lens asserting "this gap
blocks my finding"). An **unclassified** decision defaults to 🔴 (FR-006). The
orchestrator never *infers* a band.

**Rationale**: This is the discipline parked 005 violated (it had the orchestrator
effectively judge seating merit). Declared-predicate banding keeps every runtime decision
merit-neutral (D1/D4, extending I2/S3/S9). The unclassified-→🔴 default makes the safe
direction the lazy direction.

**Risk (flagged for the Gate)**: the safety of "🟡 always proceeds" rests entirely on the
**catalog being correct** — a decision type *mis-declared* 🟡 that is actually irreversible
would proceed wrongly with a default. This is not an invariant breach (the mechanism is
sound); it is a **per-entry review obligation**. Mitigations: (a) unclassified → 🔴; (b)
the catalog is small and each entry states its reversibility justification; (c) the Gate A
review should adjudicate each catalog row's band on its own merits. The catalog is the
load-bearing artefact, and it is human-authored design data, not runtime inference.

**Alternatives rejected**: per-instance orchestrator classification (re-imports the 005/S9
judgment surface); a confidence-score estimator (an estimated judgment proxy — same trap).

## R3 — The two-axis RSVP signal replaces the 0–3 score

**Decision**: The RSVP reply's single `relevance: 0–3` is **replaced** by two
evidence-anchored axes (`contracts/rsvp-signal.md`):
- **A — applicability**: `applies: [<cited round-context delta>, …]` — ≥1 concrete delta
  the lens touches; empty → treated as not-applicable (abstain-eligible).
- **B — expected stakes**: `expected: 🟢|🟡|🔴-potential` + a one-line evidence hook.

The seating sensor sorts seated candidates by **(count/quality of A, then B)**, recording
the anchors. JOIN/ABSTAIN semantics are unchanged; only the relevance scalar is replaced.

**Rationale**: the single 0–3 degenerated to all-3s (FR-014 motivation), which is *why*
005's ties fired every gate. Evidence-anchoring (the I8 rule applied to scoring) makes the
score costly to max out and auditable. Self-declared, so the orchestrator never assigns
relevance (I2/D5).

**Bounded-benefit caveat**: on a round with broad deltas, many lenses can still cite a
delta, so applicability may not fully separate them — but a residual tie is now 🟡
(default + async review), not an operator stop, so the signal need not perfectly
discriminate. Sharpening reduces 🟡 *volume* and makes defaults defensible; it is not
load-bearing for correctness (SC-006/SC-008 are about removing interruption and the
no-citation case, not perfect ordering).

**Alternatives rejected**: keep 0–3 with rubric anchors (still self-placement, the thing
that failed); comparative-to-baseline (needs a per-lens baseline the system doesn't
track).

## R4 — The 🔴 self-heal loop, and the expectation-shift risk ⚠

**Decision**: A post-tally gating 🔴 finding is a 🟡 *decision* while `cycle < 3`: the
orchestrator auto-runs the existing incorporation cascade (`/speckit-clarify →
/speckit-plan` for Gate A; the per-gate cascade otherwise) and **re-runs the gate** — the
re-run *is* the verifying sensor. Each cycle is a 🟡 DecisionRecord on the review queue.
It escalates to a 🔴 operator ask when `cycle == 3` without clearing, or when a **waiver**
is the only resolution path.

**Rationale**: this is the largest reduction in operator involvement and stays fully
inside the existing guarantees — S4 (never pass a 🔴 silently: auto-incorporation
*resolves* it, the re-run *verifies* it, a waiver still escalates), S5 (spec-sourced
incorporation), S7 (the 3-cycle bound is the RED trigger). It is "verify before you ask"
applied to the gate loop.

**Risk (flagged for the Gate)**: it **shifts operator expectations** — today every
incorporation is operator-approved; now they happen automatically and land on the review
queue. If the queue does not surface in-flight self-heals prominently, this reads as
*runaway* rather than *self-unblocking*. Mitigation: each cycle posts a DecisionRecord with
the finding, the incorporation diff summary, and the re-run result; a regression (new 🔴)
is visible immediately and still bounded at 3. The Gate should weigh whether 3 automatic
cycles is the right bound or whether the *first* cycle should remain a 🟡-with-faster-
surfacing.

**Alternatives rejected**: keep per-cycle operator approval (today's friction; defeats the
feature); unbounded auto-heal (violates S7); auto-waiver at the bound (D2 — a waiver drops
a real concern and is irreducibly the operator's).

## R5 — DecisionRecord schema and the review-queue surface

**Decision**: Every decision emits a `DecisionRecord` (schema in
`contracts/decision-primitive.md`) rendered by band: 🟢 → a one-line audit row; 🟡 → a card
in a new ledger section `## Provisional decisions (review & override)` carrying the chosen
default, runner-up(s), `sensor.evidence`, and an **override action with its cost**; 🔴 → a
live framed card (2–4 options + consequences + evidence + highlighted default). Override
re-runs the workflow from the recorded point; dependent downstream provisional decisions
are re-evaluated and their records note the dependency.

**Rationale**: FR-007/008/009 + SC-004/005. Generalizes the per-seat provenance ledger the
005 Gate A panel affirmed. Plain Markdown, co-located in the existing ledger, so a reviewer
replays from one file.

**Alternatives rejected**: a separate decisions file (fragments the audit trail); recording
only finals (not replayable; can't tell auto from defaulted from escalated).

## R6 — Invariants D1–D5 placement

**Decision**: D1–D5 live in `DECISION-PRIMITIVE.md` (they bind both modes, like S8/S9 in
the gate primitive). They explicitly extend I1–I8 (integration) and S1–S9 (lifecycle/gate):
D1 declared-band-not-inferred (I2/S3/S9); D2 🔴-never-auto-proceeds (S4); D3 every-🟡-
recorded-and-reversible; D4 classification-mechanical (S9); D5 signals-evidence-anchored
(I8).

**Rationale**: co-locating the cross-cutting invariants with the cross-cutting mechanic
keeps them from drifting, exactly as S8/S9 sit with the gate primitive.

**Alternatives rejected**: scattering D1–D5 into each layer doc (drift).

## R7 — Base-round adoption (INTEGRATION-LAYER decision points)

**Decision**: The base round's own operator touchpoints get declared bands too: **Phase 0
scope/exclusion** — 🟢 if an addendum exists (read it), 🟡 if absent (infer defaults from
CLAUDE.md/repo layout + proceed + async confirm) — replacing today's mandatory inline ask;
**Phase 0.5 quorum** — 🟢 when `J ≥ 3` proceeds, the `J < 3` re-ping/abort path stays as
declared (its terminal abort is a 🔴-equivalent honest stop). The two-axis signal applies
to base-round RSVP as well.

**Rationale**: FR-016 — both modes adopt one definition; the base round should self-unblock
its decidable points too. Note the base round is uncapped by default (no seating eviction),
so the seating-tie 🟡 only bites under a cap — consistent with the parked-005 R3 finding.

**Alternatives rejected**: SDLC-only adoption (the "scope to one mode" option the project
has repeatedly rejected; would diverge the two modes).

## Cross-cutting

Every automated step sorts persona-supplied evidence/integers (applicability anchors,
expected-stakes class, cycle count) or follows a declared catalog band; none ranks a lens's
*view* as better than another's, and none lets the orchestrator infer a band. The two
honest risks (R2 catalog-correctness, R4 expectation-shift) are design-judgment calls best
adjudicated by the agent-SDLC Gate A — the dogfood that caught 005.
