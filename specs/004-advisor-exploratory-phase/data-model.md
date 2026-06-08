# Phase 1 Data Model: Advisor Exploratory Phase

Conceptual entities of the procedure (not database tables). "Fields" are what the
procedure tracks; "transitions" are the lifecycle a value moves through. Storage
is Markdown (the addendum + per-advisor memory).

## Project base (the addendum)

The shared, operator-owned project memory — `docs/reviews/CHORUS-PROJECT.md`.

- **Fields**: existing sections (summary, exclusions, anchors, governance,
  security, baselines) + the new **Project understanding** section.
- **Relationships**: referenced by every per-advisor record; receives
  operator-accepted project-wide facts.
- **Invariants**: operator-authoritative — only operator-accepted additions land
  (FR-017); the **authoritative system of record** for project-wide facts —
  records may hold cached copies that reconcile to it, addendum-wins (FR-023/SC-008).

## Project understanding (addendum section)

The new structured area for gathered project-wide facts.

- **Fields**: entries grouped by topic/lens (e.g. architecture: ranked
  characteristics, style; product: real-users-yet, primary goal; security: trust
  boundaries; delivery: release path), each with the date accepted and provenance
  (operator-confirmed).
- **Transitions**: `proposed (by orchestrator) → accepted (by operator) → live`;
  a superseded fact is `replaced` (no stale contradiction left).

## Per-advisor understanding record (lens layer)

One per advisor, in its memory; thin layer over the base.

- **Fields**: `project-scoped` part (references into the addendum + lens
  inferences + lens gaps + **cached project-wide facts**, each with a
  reconciliation locator to the addendum) and `feature/spec deltas` (per target);
  each entry tagged **referenced / inferred / operator-confirmed** (the last
  carrying a `scope`); dates.
- **Relationships**: references the addendum; may cache its project-wide facts for
  read-locality (FR-023); a feature delta references the project-scoped part.
- **Transitions**: `absent → built → reused (delta-updated)`; rebuilt only for
  needs touched by round deltas or stale references (FR-010).
- **Invariants**: an **index of locators, not an evidentiary endpoint** — findings
  re-ground in the live source (FR-021); a cached project-wide fact carries a
  reconciliation locator to the authoritative addendum (FR-023); inferences flagged
  provisional (FR-011).

## Information-needs profile

Per lens; lives in the agent file.

- **Fields**: ordered list of **profile items**; names the single most
  load-bearing need.
- **Relationships**: drives what the advisor harvests/asks; seeded from
  `information-needs-profiles.md`.

## Profile item

- **Fields**: `need` (concise), `source` (referenced | inferred |
  operator-gathered), `why` (one clause), optional `load-bearing` flag.

## Source reference

- **Fields**: `locator` (path + section/anchor or `file:line`), `recorded_date`,
  `freshness` (fingerprint = a **content comparison of the cited span** at
  advisor re-read; not mtime, not a whole-file commit marker — R2, see
  `EXPLORATORY-PHASE.md`), optional short quote (≤ ~2 sentences) — a **navigational
  hint, never evidence** (FR-021).
- **Transitions**: `fresh → stale (fingerprint changed) → revalidated`. For a
  cached project-wide fact, revalidation reconciles against the authoritative
  addendum (FR-023).

## Gap

An unmet information need.

- **Fields**: `need`, `scope` (`project-wide` | `lens-specific`), `status`
  (`open` | `inferred` | `operator-confirmed`).
- **Transitions**: `open → inferred (provisional)` or `open → gap-question →
  operator-confirmed`.

## Gap-question

- **Fields**: `text` (≤ short), `asking lens`, `scope`
  (`project-wide` | `lens-specific`).
- **Transitions**: `raised → batched (deduped) → answered → routed`
  (`project-wide` → addendum; `lens-specific` → asking advisor's record).

## Operator interview batch

One per round.

- **Fields**: deduped gap-questions across joiners, the operator's answers, the
  routing of each answer, and **session state** (which questions are answered /
  deferred / pending).
- **Transitions**: `assembled → session 1 (≤5 Q) → [deferred → resumed] → … →
  complete | left-degraded`. A left-degraded interview yields a verdict-level
  **degradation summary** (FR-019).
- **Invariants**: orchestrator-owned; one interview (one or more **sessions of
  ≤ 5 questions**, re-entrant, operator-paced, each with an educational preamble)
  per round (FR-007/FR-019); project answers become operator-accepted addendum
  additions (FR-017).

## Confirmed-fact scope

The attribute that fixes a confirmed fact's canonical home.

- **Fields**: `scope` (`project-wide` | `lens-specific`).
- **Routing**: `project-wide` → authored in the addendum (authoritative; may be
  cached in records); `lens-specific` → only the asking advisor's record
  (FR-005/FR-023).
- **Invariant**: a `project-wide` fact is authored **only** via the
  operator-accepted addendum write-back; a record copy is a cache, not an author.

## Fitness function (profile coverage)

The executable conformance check for the phase (FR-022).

- **Inputs**: each participating advisor's information-needs profile + its
  understanding record.
- **Checks**: (1) every profile item resolves to a record entry tagged
  referenced / inferred / operator-confirmed / open-gap — no silent omission;
  (2) every cached `project-wide` fact carries a reconciliation locator to the
  addendum.
- **Result**: pass / fail per advisor; backs SC-001/003/005/007/008/010.
