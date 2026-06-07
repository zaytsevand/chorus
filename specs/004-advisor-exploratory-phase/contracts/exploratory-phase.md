# Contract: Exploratory Phase (procedure)

Runs for each RSVP joiner after RSVP and before findings (Round 1 in the
project-state round; before the Author stage in an SDLC gate). Abstainers skip it.

**Cheapest-subset-first (FR-020)**: the steps are ordered cheapest-first —
profiles + reference harvest + one interview session run before any optional
deeper analysis — and the per-round cost is operator-controlled (FR-019), so the
phase shows value before more budget is spent.

**Memory is an index, not an endpoint (FR-021)**: every record entry is a locator
into live material; a finding re-grounds in the source, never in persisted memory
alone. A stored quote is a navigational hint, never evidence.

## Steps (per advisor)

1. **Load profile** — the lens's information-needs profile from its agent file
   (`contracts/information-needs-profile.md`).
2. **Reuse** — load the advisor's prior understanding record; determine the
   round deltas (D6) and stale references (D5). Needs already satisfied and
   unaffected are carried forward untouched.
3. **Harvest (reference-first)** — for each unmet/affected need, search existing
   written knowledge **addendum first** (`docs/reviews/CHORUS-PROJECT.md`), then
   docs/ADRs/READMEs/specs/diagrams/comments. Record a **reference**, not a copy
   (`contracts/understanding-record.md`).
4. **Analyse** — for needs the repo doesn't answer, run a **bounded**,
   **operator-budget-controlled** analysis (sampling discipline; no
   enumerate-everything). Record findings as **inferred** (provisional).
5. **Raise gap-questions** — for needs neither reference nor analysis settled,
   emit gap-questions tagged project-wide or lens-specific
   (`contracts/gap-interview.md`). Do **not** interview the operator directly.
6. **Emit record** — write/update the per-advisor understanding record (referenced
   / inferred / operator-confirmed entries + open gaps + dates).

## Orchestrator steps (once per round)

7. **Batch interview** — collect gap-questions across all joiners, dedupe, run a
   single operator interview delivered in **resumable, operator-paced sessions of
   ≤ 5 questions** (each opening with a plain-language preamble; FR-019), route
   answers (project-wide → addendum write-back per
   `contracts/addendum-project-understanding.md`; lens-specific → asking advisor's
   record). A deferred/skipped session leaves open gaps and the verdict carries a
   **degradation summary** (gaps remaining, findings affected).
8. **Coverage check** — run the profile-coverage fitness function (FR-022): every
   profile item resolves to a record entry; every cached project-wide fact carries
   a reconciliation locator. Report pass/fail per advisor.

## Preconditions

- RSVP complete; joiners known.
- Addendum located (or its absence handled as in the base procedure).

## Postconditions

- Every joiner has an understanding record whose profile needs are each:
  referenced, inferred (flagged provisional), operator-confirmed, or an explicit
  open gap.
- Project-wide operator-confirmed facts are authored in the addendum
  (operator-accepted, authoritative); any record copy is a cache carrying a
  reconciliation locator (FR-023), not a rival home.
- Findings produced afterward trace to the record **and re-ground in the live
  source** (SC-001/FR-021).
- The profile-coverage fitness function passes for each joiner (FR-022/SC-010).

## Must-not

- No advisor interviews the operator directly (orchestrator owns N+1).
- No copying of referenced sources beyond a short quote.
- No treating persisted memory as a finding's evidentiary endpoint (FR-021).
- No auto-write to the addendum without operator acceptance.
- No re-exploration of needs untouched by deltas / not stale.
