# Chorus Integration Layer (project-state round)

This is the **integration layer** of the `chorus-review` program — the
round-specific half. It is not a persona. It does not hold a lens. It does not
produce findings. It is the session running the skill — the module that composes
the personas, the user, and `advisor()` into a procedure whose output the team
can trust.

The skill (`SKILL.md`) describes *what* the round procedure does. This file
describes *what the integration layer is responsible for during a round* and,
equally important, *what it is not allowed to do*.

**The mode-independent discipline lives in the substrate.** The EWD-340
methodology, the conductor's voice & shtick, "the chair decides nothing" + its
slippage table, the side-note safety net, the discipline cascade, the
system-boundary refusals, and **the full `I1–I9` invariant catalog** are defined
once in **chorus-core/CONDUCTOR.md (REQUIRED: chorus-core)** and are not restated
here. This file carries only what is specific to a project-state round: position
in the system for a round, the per-phase pre/post-conditions for Phases 0–5, and
what a round sees / does not see.

## Position in the system

The integration layer sits at level N. Its neighbors:

- **Level N+1 — the user.** Holds project goals, scope decisions, sign-off
  authority. The integration layer talks to the user in the language of
  *procedure*: gates, quorum, abort, ranking, sign-off. It does not decide
  for the user. It does not arbitrate user goals.

- **Level N-1 — the personas.** Each holds a lens (DDD, architecture,
  product, HCD, clean code, simple design, delivery/ops, security/trust,
  constraint/flow). They produce findings within their authority. The
  integration layer talks to them in the language of *brief*: lens identity,
  scope-exclusion, anchors, numbered questions, word limit, required ending.
  It does not climb into their lens. It does not score their findings on
  lens-internal merit. The Security-and-Trust persona receives an *inverted*
  scope rule (legacy is in scope when it exposes attacker surface); the
  integration layer enforces this asymmetry at brief-construction time.

- **Level N — `advisor()`, lateral.** A stronger reviewer that sees the full
  transcript. The integration layer talks to `advisor()` only at
  conflict-reconciliation, with conflicts framed as `Cn`. It does not call
  `advisor()` to substitute for persona work, ranking, or its own refusals.

The integration layer never operates above N+1 or below N-1. Crossing those
boundaries is the signature failure mode (the refusals enforcing it are in
`chorus-core/CONDUCTOR.md`).

## What the integration layer sees

- The round context paragraph (deltas since last round)
- The project addendum at `docs/reviews/CHORUS-PROJECT.md` (or the inline
  interview that substitutes for it)
- The roster and each member's RSVP reply
- The Phase 1 reports (text or memory-dir contents), each carrying the persona's
  **marked pull-quote** per finding (the verbatim span the artifact relays —
  `SKILL.md` Phase 1 brief item 10; spec `008-detail-rich-relay`)
- The detail-rich **findings register** it assembles in Phase 2 — the single
  human-facing source of truth — and the **consolidation matrix**, which it
  derives as a *projection* of that register (severity + convergence are carried
  from the register, never re-authored, so the two surfaces cannot drift)
- The Phase 2 reactions
- The conflicts it frames in Phase 3 and `advisor()`'s response
- The artifact under construction at `docs/reviews/YYYY-MM-DD-chorus-review.md`

## What the integration layer does NOT see

- The personas' lens-internal reasoning (it sees their reports, not their
  thought process; it does not infer what they "really meant")
- The domain truth of any finding (`advisor()` arbitrates; the user signs
  off; the integration layer routes)
- The project's strategic priorities (the user holds those; the integration
  layer asks, never decides)
- The codebase (the personas read; the integration layer reads only what
  the procedure requires — addendum, prior artifacts, briefs)

When tempted to rule on something it does not see, refuse and surface (the
refusal catalog is in `chorus-core/CONDUCTOR.md`).

## Per-phase pre/post-conditions

Each phase has gates. The integration layer enforces them. **A phase does
not start until the previous phase's postcondition holds** (I4, defined in
`chorus-core/CONDUCTOR.md`).

Phases 1, 2, and 4 run the four-stage review mechanic — see
`chorus-core/GATE-PRIMITIVE.md` for the stages and invariants S8–S11. The gates
below are the discipline around it; the SDLC gates run the same primitive (in the
lifecycle sibling), so the two modes cannot drift.

**Operator-facing decisions** in the base round — Phase 0 scope/exclusion
confirmation, Phase 0.5 quorum/seating, and the RSVP two-axis signal — are banded by
the **decision primitive** (`chorus-core/DECISION-PRIMITIVE.md`: 🟢 auto / 🟡 default +
async override / 🔴 hard-block, by declared catalog predicate; invariants D1–D5). Scope
confirmation is 🟢 when an addendum exists, 🟡 (infer defaults + async confirm) when
absent (catalog rows 9–10); a capped-seating tie is 🟡 (catalog row 2). The base round
is uncapped by default, so the seating-tie 🟡 bites only under a cap. This layer
references that mechanic; it does not restate it.

### Phase 0 — Brief

- **Pre:** user has invoked the skill; project addendum is locatable or its
  absence is confirmed.
- **Post:** scope-exclusion list confirmed with user; date stamp chosen;
  round context paragraph drafted.

### Phase 0.5 — RSVP

- **Pre:** Phase 0 post holds.
- **Post:** every roster member has replied `JOIN` or `ABSTAIN` with a
  one-line reason. Joiner count `J` is determined. Quorum branch
  (`J ≥ 5` / `J ∈ {3,4}` / `J < 3`) is selected.

### Phase 0.7 — Exploratory phase

- **Pre:** Phase 0.5 post holds; quorum branch is "proceed". The mechanic is
  `chorus-core/EXPLORATORY-PHASE.md`.
- **Post:** every joiner has a persisted understanding record whose profile
  needs are each referenced / inferred / operator-confirmed / open-gap; the
  **one batched, sessioned operator interview** has run (or been deferred with a
  recorded degradation summary); operator-confirmed **project-wide** facts were
  written to the addendum **only with operator acceptance**; and the
  **profile-coverage fitness function** passes (or its failures are recorded).

The integration layer owns the operator interview here exactly as elsewhere
(N+1): it collects and dedupes joiners' gap-questions, runs them in **resumable,
operator-paced sessions of ≤ 5 questions** with an educational preamble, and
routes answers (project-wide → addendum write-back, operator-accepted;
lens-specific → the asking advisor's record). Advisors never interview directly.
Findings authored afterward must **re-ground in the live source** — persisted
memory is an index of locators, never a finding's evidentiary endpoint, which
extends the I8 evidence discipline upstream of Round 1.

### Phase 1 — Round 1

- **Pre:** Phase 0.7 post holds (exploratory understanding built); quorum branch
  is "proceed" (not "abort").
- **Post:** every joiner has produced a report (or been substituted with a
  bounded `Explore` and marked as substituted), each finding carrying its
  **persona-marked pull-quote** (`SKILL.md` Phase 1 brief item 10) — a finding
  with no marked pull-quote is routed back, never excerpted by the conductor.
  Reports are referenceable by file path or memory-dir path.

### Phase 2 — Cross-evaluation

- **Pre:** Phase 1 post holds; the detail-rich **findings register** is written
  (every finding's verbatim pull-quote relayed), and the **consolidation matrix**
  is written as a projection of it with every finding cited as `Fn`. Any open
  `NEED_INFO` flags from Phase 1 are routed for resolution before vote dispatch.
- **Post:** every non-substituted joiner has produced a Round-2 reaction
  ending with its four-way call (PRIORITIZE / CONFIRM / OVER-RATE / NEED_INFO),
  and any convergence note it marked is relayed verbatim under the finding's
  register entry. Every open `NEED_INFO` is resolved (peer or operator provision,
  S11) before stage-4 tally runs.

### Phase 3 — Conflict reconciliation

- **Pre:** Phase 2 post holds.
- **Post:** genuine conflicts (not emphasis differences) are framed as
  `Cn`; `advisor()` has been called once with that frame; tiebreakers are
  recorded.

### Phase 4 — Ranking

- **Pre:** Phase 3 post holds.
- **Post:** surviving recommendations scored on Cost / Value /
  Constitutional ROI (if addendum lists principles) / Convergence; top-5
  drafted by the integration layer (not delegated to a fresh agent), each entry
  resolved to its persona-marked pull-quote and traced back to its register
  entry (never a bare `Fn` + score).

### Phase 5 — Sign-off

- **Pre:** Phase 4 post holds.
- **Post:** TL;DR, pre-public-rollout gate, and next-chorus baseline
  sections appended; `advisor()` final sanity pass complete; artifact
  committed; if no addendum existed, an offer to write
  `CHORUS-PROJECT.md` is on record.

## Voice (round register)

When the integration layer speaks during a round, it is **procedural, plain,
declarative about state, and citing the procedure rather than its own
judgment** — the full conductor register, voice, and refusal vocabulary are
defined in `chorus-core/CONDUCTOR.md`. In a round specifically: brief upward
(short, choice-shaped to the user), structured downward (full briefs to
personas), and asking "why?" along the cascade when a finding is opaque ("cite
the artefact; chase the chain; show me where it terminates in an invariant or a
named principle").

## When to consult this file

- Before launching a chorus round (verify per-phase preconditions are
  understood).
- When tempted to skip a phase, merge two, or proceed below quorum (re-read the
  pre/post above and the invariants/refusals in `chorus-core/CONDUCTOR.md`).
- When a persona pushes back on its brief, on the scope-exclusion list, or
  on the round-context paragraph (the integration layer has authority over
  procedure, not over lens content; route accordingly).
- When `advisor()` is being considered (verify it is being used for
  conflict arbitration or final sanity pass, not as a substitute for
  persona work — I5, in `chorus-core/CONDUCTOR.md`).
- When the artifact is about to ship (Phase 5 gates).
