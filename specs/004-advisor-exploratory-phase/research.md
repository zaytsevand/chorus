# Phase 0 Research: Advisor Exploratory Phase

Decisions resolving the *how* the plan commits to. The spec had no open
`NEEDS CLARIFICATION` markers (two clarify sessions closed the forks); these
record mechanics with rationale and rejected alternatives.

## D1 — Phase placement

**Decision**: A dedicated **Exploratory phase runs after RSVP self-selection
(joiners only) and before findings**:
- Project-state round: a new step **between Phase 0.5 (RSVP) and Phase 1
  (Round 1)**.
- SDLC gate: **before the gate's Author stage** (`GATE-PRIMITIVE.md` stage 2).
Abstainers do not explore (FR-013).

**Rationale**: understanding must exist before authoring; gating it on RSVP
keeps it to participating lenses; placing it before Round 1 / the author stage
means findings are produced *from* the record.

**Alternatives rejected**: folding it into Round 1 (re-blends understanding with
authoring — the exact cold-read this feature removes); running it before RSVP
(wastes exploration on lenses that abstain).

## D2 — Two-tier memory format

**Decision**: Two tiers.
- **Project base = the addendum** (`docs/reviews/CHORUS-PROJECT.md`), shared and
  operator-owned, gaining a structured **"Project understanding"** section
  (schema: `contracts/addendum-project-understanding.md`).
- **Lens layer = per-advisor record** in the advisor's memory
  (`~/.claude/agent-memory/<persona>/`), holding references (incl. into the
  addendum), inferences, and gaps, split into a project-scoped part and
  feature/spec deltas (schema: `contracts/understanding-record.md`).

**Rationale**: matches the FR-014/FR-016 layering and reuses what exists (the
addendum + the agents' `memory: user` surface); the addendum is the
**authoritative** source for project-wide facts and records may **cache** them
for read-locality (D11/FR-023), keeping lens layers thin.

**Alternatives rejected**: a single new shared store (duplicates the addendum's
role); everything in per-advisor memory (re-silos project facts).

## D3 — Orchestrator-batched interview mechanics

**Decision**: Each advisor's exploratory output includes a **gap-question list**
(needs unmet by reference or analysis). The orchestrator **collects across all
joiners, dedupes** semantically-equivalent questions, runs **one operator
interview per round**, then **routes answers back**: project-wide answers → the
addendum (D4); lens-specific answers → the asking advisor's record.

**Rationale**: preserves the integration-layer invariant that the orchestrator
owns operator interaction (N+1); one interview, deduped, minimizes operator
burden (FR-007).

**Alternatives rejected**: advisors interview directly (breaks N+1; up to 9
interviews); per-advisor mediated but un-batched (redundant questions reach the
operator).

## D4 — Write-back discipline

**Decision**: Only **operator-confirmed, project-wide** facts are written to the
addendum, and only as **proposed additions the operator accepts** (the
orchestrator drafts the addition to the "Project understanding" section; the
operator approves before it lands). Unconfirmed inferences and lens-specific
synthesis stay in the per-advisor record, flagged provisional (FR-011/FR-017).
Each confirmed fact carries a **scope** (`project-wide` | `lens-specific`); only
`project-wide` facts are authored in the addendum — the addendum is their
**authoritative system of record** (D11) — and the scope-tagged, operator-accepted
write-back is the *only* write-direction into it.

**Rationale**: keeps the addendum operator-authoritative; prevents agent
inference from silently polluting the shared base (SC-008).

**Alternatives rejected**: auto-committing gathered facts (pollutes the
authoritative base); writing inferences to the addendum (loses the
confirmed/provisional distinction).

## D5 — Reference-not-duplicate & staleness

**Decision**: A **source reference** records a locator (path, and section/anchor
or `file:line` where applicable) plus a **freshness marker** — the date recorded
and a cheap fingerprint. **Granularity (resolved, R2 / see EXPLORATORY-PHASE.md):**
the fingerprint is a **content comparison of the cited span** performed by the
advisor at re-read — *not* mtime (false-fresh risk) and *not* a whole-file commit
marker (false-stale). A short quote (≈ two sentences) is allowed; more is duplication.
On reuse, if the fingerprint differs, the reference is **flagged stale and
re-validated** (re-read) before it's trusted (FR-004/FR-012).

The same freshness fingerprint reconciles a **denormalized cache** of a
project-wide fact: on drift the cached copy re-validates against the authoritative
addendum (D11), which wins on conflict.

**Rationale**: keeps records a thin index over the project's own docs; staleness
detection is a cheap compare, not a re-exploration.

**Alternatives rejected**: copying content (goes stale, bloats memory); trusting
references forever (silent rot); full re-exploration each round (defeats reuse).

## D6 — Incremental delta detection

**Decision**: The exploratory phase reuses the round-context paragraph the chorus
already builds (commits/specs/infra/incidents since the last round). On a later
round an advisor **re-examines only the needs touched by those deltas** and any
references flagged stale (D5); everything else is reused from the record
(FR-010).

**Rationale**: the chorus already computes the since-last-round delta; binding
re-exploration to it is the cheapest correct incrementality.

**Alternatives rejected**: re-running the full profile each round (cost, operator
fatigue); time-based expiry (re-explores unchanged areas).

## D7 — Profile authoring & location

**Decision**: Each lens's information-needs profile lives **in its agent file**
(`agents/<persona>.md`), in an "Information needs (exploratory phase)" section,
**authored by that lens**. The clarify round already produced all ten; their
content (`information-needs-profiles.md`) is the **seed** transcribed into each
agent file. Each item carries its source tag (referenced / inferred /
operator-gathered) and the profile names its single most load-bearing need.

**Rationale**: lens-owned and co-located (the clarify decision); travels with the
agent on install; can't drift from the persona.

**Alternatives rejected**: central registry (drifts from personas); imposed
template (the user explicitly rejected this — each lens nominates its own).

## D8 — Relationship to the gate primitive & cost control

**Decision**: The exploratory phase is **upstream of** the gate primitive: it
produces a *persistent, per-lens understanding*; the primitive's **Stage 1
Extract** still gathers *per-review finding-records*. The exploratory record
**feeds** Extract (the lens starts from understanding, not a cold read) but does
not replace it. Cost is bounded by: joiners-only (FR-013), project-base reuse
across rounds and across SDLC gates (one base build, per-gate deltas), bounded
sampling in analysis, and one batched interview per round.

**Rationale**: clean separation — persistent understanding vs per-review
evidence; avoids re-deriving project context at every gate.

**Alternatives rejected**: merging exploration into Extract (loses persistence);
re-exploring per gate (cost).

---

*Decisions D9–D12 resolve the 2026-06-07 Gate A design-review findings (ledger:
`agent-sdlc-log.md`).*

## D9 — Sessioned, re-entrant, operator-paced interview (FR-019)

**Decision**: The batched operator interview is delivered in **sessions of ≤ 5
questions**, **re-entrant** (the operator may defer a session and resume later),
and **operator-paced** (the operator controls the token/time budget the phase
spends). Each session opens with a **plain-language preamble** — what the
interview is, what it costs, that it can be paused — assuming no familiarity with
chorus internals. A deferred/skipped session leaves open gaps (FR-011) and the
verdict carries an explicit **degradation summary** (gaps remaining, findings
affected), not only per-finding flags.

**Rationale**: bounds the operator burden on a thin-doc target (the common case
that made the un-capped interview a gating 🔴 — finding F8), removes the
single-barrier serialization (F5), and makes a skipped interview *informed*, not
silent (F10). The operator, not the design, sets the cadence.

**Alternatives rejected**: one unbounded batch (the original — F8); a hard
question cap that drops gaps silently (loses needs); per-advisor interviews
(breaks N+1).

## D10 — Memory is an index of locators, never the evidentiary endpoint (FR-021)

**Decision**: Persisted memory (per-advisor records and cached addendum facts) is
an **index of locators**. A finding's evidence **re-grounds in the live material**
via the locator (the founding why-why-why chain, applied fully); a persisted quote
is a **navigational hint only**, never the endpoint of an evidence chain.

**Rationale**: closes the harvest-to-replay trust surface (finding F18) — there is
no trusted persisted payload a reviewed repo's prose could inject into a later
round; and staleness is caught at re-read (F12/F19/F22) because the live source,
not the cache, is always the authority for a finding.

**Alternatives rejected**: persisting quotes as evidence (the injection payload);
a sanitizer/allowlist on harvested text (machinery not earned at single-operator
scale — Security's F23).

## D11 — Addendum authoritative; records may denormalize/cache (FR-023)

**Decision**: The addendum is the **authoritative system of record** for
project-wide facts and a deliberately **limited surface** (not force-read each
round). Per-advisor records **may cache** the project-wide facts their lens uses,
so a **directly-invoked** advisor need not read the addendum. Consistency is
**weak/eventual**: each cached copy carries a freshness fingerprint to its
addendum source and re-validates on drift (D5), addendum-wins. A confirmed fact's
**scope** (`project-wide` | `lens-specific`) fixes its home.

**Rationale**: resolves the F27 tier-seam ambiguity by naming the authority
*direction* rather than forbidding duplication — denormalization is a deliberate
read-locality choice, and the operator wanted the addendum's read-tax kept off
the per-round path. The trust guard is unchanged: the only *write* into the
operator-owned addendum stays scope-tagged + operator-accepted (D4).

**Alternatives rejected**: strict single-home / no-duplication (forces the
addendum-read tax on every directly-invoked advisor — the operator rejected it);
strong consistency (unachievable across independent agent memories).

## D12 — Per-advisor profile-coverage fitness function (FR-022)

**Decision**: The phase's executable fitness function is **per-advisor
information-needs-profile coverage**: every profile item resolves to a record
entry tagged referenced / inferred / operator-confirmed / open-gap (no silent
omission), and every project-wide confirmed fact carries a reconciliation locator
to the addendum. This is grep-able and replaces prose-only conformance for
SC-001/003/005/007/008.

**Rationale**: gives the design an executable check that survives its author
(finding F14) — a profile item with no corresponding record entry is a detectable
coverage failure, not a matter of prose interpretation.

**Alternatives rejected**: prose SCs only (F14 — nothing enforces them); a
heavyweight test harness (no runtime; over-built for a Markdown skill).
