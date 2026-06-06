# Phase 1 Data Model: Agent-SDLC Workflow

These are conceptual entities of the procedure (not database tables). "Fields"
are the attributes the procedure tracks; "transitions" are the lifecycle a value
moves through. Storage is Markdown (the ledger and the skill docs).

## SDLC run

A single execution of the lifecycle for one feature.

- **Fields**: feature id/dir; current phase; ordered phase history; overall
  status (`in-progress` / `halted-awaiting-operator` / `complete`).
- **Relationships**: contains three Gates (A, B, C); owns one Ledger.
- **Transitions**: `specify → (clarify?) → plan → GateA → tasks → GateB →
  implement → GateC → complete`. Any gate may move the run to
  `halted-awaiting-operator`; an operator decision resumes it.
- **Invariants**: S1 (orchestrator authors nothing), S2, FR-002 ordering.

## Gate

A scoped chorus review at a lifecycle checkpoint.

- **Fields**: id (`A`=design, `B`=plan/tasks, `C`=implementation); corpus
  (artifacts in scope); seated panel; loop-cycle count; outcome
  (`pass` / `halt`).
- **Relationships**: runs one Gate primitive instance; produces Findings;
  writes one Ledger entry.
- **Transitions**: `convened → extracted → authored → voted → tallied →
  (pass | halt → incorporate → re-convene)`. Loop bounded at 3 (S7).
- **Invariants**: S3 (cap 5), S4 (block on 🔴 only), S6 (I8 evidence), S7 (bound).

## Gate primitive

The four-stage mechanic shared by the base round and every gate. (Definition:
`contracts/gate-primitive.md`.)

- **Fields**: the four stages (Extract, Author, Vote, Tally), each with a
  distinct actor and success criterion.
- **Relationships**: referenced by both `INTEGRATION-LAYER.md` (base round) and
  `SDLC-LAYER.md` (gates). Exactly one canonical definition (SC-006).
- **Invariants**: S8 (author ≠ grader), S9 (no synthetic vote; deterministic
  tally).

## Extract record

A structured observation produced in stage 1, before any lens authors a finding.

- **Fields**: `artifact`, `location` (file:line), `observation`, `raw_excerpt`,
  `candidate_lens`, `source` (`explore` | `spec-walkthrough`).
- **Relationships**: zero-or-more records seed one Finding; carries the I8
  anchor a Finding inherits.
- **Transitions**: `extracted → consumed-by-author | unused`.

## Finding

A claim authored by one persona about one artifact.

- **Fields**: id (`F<n>`); authoring lens; `evidence` (file:line **or**
  `[principle]` / `[principle:proposed]` tag); author-proposed severity
  (🔴/🟡/🟢); summary (≤ 20 words); post-tally severity; gating? (bool);
  resolution (`open` / `resolved` / `waived(rationale)`).
- **Relationships**: receives many Votes (from non-author personas); rolls up to
  a Gate's findings register; logged in the Ledger.
- **Transitions**: `authored → voted → tallied(severity fixed) →
  open → (resolved | waived)`.
- **Invariants**: S6 (must satisfy I8 or be demoted to `[unsupported]` and
  excluded from the tally); S8 (author casts no vote on it).

## Vote

One persona's judgment on one finding it did not author.

- **Fields**: voter lens; target finding id; value (`PRIORITIZE` / `OVER-RATE`);
  optional rationale.
- **Relationships**: many Votes per Finding; aggregated by the Tally.
- **Invariants**: S8 (voter ≠ author), S9 (must be a real persona vote, never
  synthesized).

## Severity

- **Values**: 🔴 (gating: violated hard invariant or confirmed-critical defect),
  🟡 (recorded, non-gating), 🟢 (recorded, non-gating).
- **Derivation**: author-proposed, adjusted by the deterministic tally (D2 /
  `contracts/gate-primitive.md`).

## RSVP reply

A persona's response to a gate's call.

- **Fields**: lens; decision (`JOIN` / `ABSTAIN`); relevance score (0–3,
  required on JOIN); one-line reason.
- **Relationships**: drives Panel seating per gate.
- **Invariants**: S2 (independent per gate), S3 (score used only for overflow
  seating; orchestrator never overrides the decision).

## Panel

The seated personas for one gate.

- **Fields**: seated lenses (≤ 5); abstainers; overflow-tie escalations.
- **Transitions**: `rsvp-collected → seated (≤5) | re-ping (<3) | abort (<3
  twice)`.
- **Invariants**: S3.

## Ledger entry

One gate's audit record. (Schema: `contracts/sdlc-ledger.md`.)

- **Fields**: gate id; RSVP table (joiners/abstainers/scores); findings register;
  🔴 resolution/waiver log; loop-cycle count; timestamp/phase marker.
- **Relationships**: appended to the run's `agent-sdlc-log.md`.
- **Invariants**: completeness (SC-007); a waived 🔴 records its rationale (S4).

## Invariant (S1–S9)

The audit rules. (Checkable form: `contracts/sdlc-invariants.md`.)

- **Fields**: id; scope (`lifecycle` S1–S7 / `gate-primitive` S8–S9); the
  refusal it encodes; the I1–I8 invariant it extends.
- **Relationships**: each FR in the spec maps to one or more S-invariants.
