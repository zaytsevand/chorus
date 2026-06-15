# Feature Specification: Cycle-End Memory Update Phase

**Feature Branch**: `010-cycle-end-memory-update`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User request — add a new dispatched **memory update phase** that runs **per SDLC
cycle, at cycle end** (sign-off), so each seated lens writes back what it learned and the
shared project addendum is kept current for the next cycle.

## Context

The chorus has a **two-tier memory** (`EXPLORATORY-PHASE.md`):

- **Project base** — the operator-owned, authoritative addendum `docs/reviews/CHORUS-PROJECT.md`.
  Per spec 004, the **only** write-direction into it is the scope-tagged, *operator-accepted*
  write-back (FR-005/FR-017); only `project-wide`-scoped facts are authored there.
- **Lens layer** — per-persona records under `~/.claude/agent-memory/<persona>/`: references,
  inferences, gaps, and cached project-wide facts (with reconciliation locators + freshness
  fingerprints).

Today memory is exercised **upstream**: the **exploratory phase** (spec 004) builds/reads each
lens's understanding *before* a gate. There is **no downstream bookend** — nothing that, at the
end of an SDLC run, dispatches the lenses to **write back** the cycle's learnings. The durable
product of a run (per `INTEGRATION-LAYER.md`: "the product is the durable understanding, not this
round's chorus doc") is therefore captured only ad hoc, in the per-feature ledger
(`specs/<feature>/agent-sdlc-log.md`), and never distilled into the two-tier memory the *next*
run reads. Each cycle re-learns what the last cycle already discovered.

This feature adds that bookend: a **cycle-end memory update phase**.

### Scope decisions (operator-confirmed for this spec)

- **Granularity** — the phase fires **once per full lifecycle**, at **sign-off** (after Gate C),
  not per gate and not per self-heal loop. Its source is the completed run's ledger.
- **Write scope** — each persona **autonomously** updates its **own** lens record; changes to the
  **shared** `CHORUS-PROJECT.md` addendum are surfaced as **proposals for operator confirmation**
  (never auto-applied), honoring spec 004's "operator-accepted write-back is the only way in" and
  the constitution's no-committed-secrets boundary.

### Constitution & canon check (Principle I — cite, never restate)

- **`EXPLORATORY-PHASE.md` (two-tier memory; "memory is an index, never the endpoint")** — this
  phase is the write-side counterpart to the read-side exploratory phase. What it writes is an
  **index of locators** plus ≤~2-sentence navigational hints, **never** authoritative
  conclusions/verdicts; this preserves the harvest-to-replay trust boundary (a reviewed repo's
  prose cannot inject a trusted payload into a later round).
- **Spec 004 write-back contract (FR-005/FR-017; `scope` = project-wide | lens-specific)** — this
  phase **operationalizes** that contract at a defined lifecycle moment; it does not invent a new
  write path. Only `project-wide` facts become addendum proposals; `lens-specific` facts stay in
  the persona's own record.
- **S1 / S8 / S9 (`SDLC-LAYER.md`, `GATE-PRIMITIVE.md`)** — the orchestrator **does not author**
  a persona's memory and **does not synthesize** what a lens "learned." The update is **dispatched
  to the real personas**; each writes its own record. The orchestrator only **collates** the
  proposed addendum diff for the operator and applies it on acceptance.
- **Self-unblocking decision discipline (spec 006 / `DECISION-PRIMITIVE.md`)** — per-lens writes
  are **mechanically-decidable → auto**. The shared-addendum write is **operator-owned →
  surfaced as a clean accept/reject proposal** (run forward by default; stop the human only for the
  call that is irreducibly theirs). A rejected/timed-out proposal leaves the addendum untouched and
  is recorded — never blocks sign-off.

### Relationship to open issues / specs

- **Composes with 004 (exploratory phase)** — read-side and write-side of the same two-tier memory.
- **Composes with 003 (SDLC ledger)** — the phase reads the completed ledger as its source and
  records its own outcome there.
- **Independent of 008/009** — does not touch the relay or the tally.

### Chorus review resolution (2026-06-12)

A 5-lens chorus review (Security / Richards / Cooper / Goldratt / Evans; author-excluded vote,
deterministic tally) produced four gating 🔴 against the first draft; all are resolved in the
requirements below:

- **FR-010** — removed the invented "bump the freshness fingerprint" mutator (it contradicted the
  no-runtime model); staleness now cites spec 004's read-side re-validation. *(clears DDD-4 🔴,
  ARCH-2 🟡, SEC-4 🟡 — one fix, three findings.)*
- **FR-003a** — added a testable two-part predicate defining a **durable** learning (was undefined,
  yet gated FR-009). *(clears DDD-1 🔴.)*
- **FR-006** — split **reject** (discard) from **no-response** (defer + re-offer), so a learning is
  never silently lost to inattention. *(clears COOP-3 🔴.)*
- **FR-007** — moved the secrets boundary to a mechanical **pre-filter** that runs before any
  write/proposal and independently of the operator-confirm. *(clears ARCH-3 🔴, SEC-1/SEC-2 🟡.)*

Both held 🟡 are now **resolved** (2026-06-12, second pass):

- **TOC-3** (Goldratt — cheapest loop-closer) — the "one ledger-distillation pass" alternative is
  **rejected as canon-illegal**: a single pass that reads the run ledger and distills what each lens
  learned is *orchestrator synthesis of a learning*, which S1/S9 forbid. Per-lens dispatch is therefore
  the **minimum legal** mechanism, not gold-plating. It is made as cheap as the constraint allows
  (FR-002): each lens distills **only its own ledger contributions from this run** — a re-read of its
  own prior output, riding the context it already holds at sign-off, never a fresh corpus harvest.
  Cost-of-delay favors building now: the read-side (spec 004) is already shipped and pays nothing back
  until the write-side closes the loop — every run re-derives until it exists. *(clears TOC-3 🟡.)*
- **DDD-2** (Evans — ubiquitous language) — the spec no longer coins a parallel vocabulary. A
  "lens-specific delta" is named for what canon already calls it: a **scope=`lens-specific`
  operator-confirmed/referenced fact** written to the persona record (the same fact the exploratory
  phase writes, written at a new moment). A "project-wide proposal" is the **scope=`project-wide`,
  operator-accepted write-back** (spec 004 FR-005/FR-017) surfaced as accept/reject — not a new write
  path or entity. Only **deferred write-back** (the unanswered-`project-wide` state) is genuinely new,
  and it is defined as a *state of* that write-back, reusing the re-entrant interview's deferred-session
  notion. See the canon-mapped **Key Entities** below. *(clears DDD-2 🟡.)*

### Gate C implementation review (2026-06-12)

A 5-lens chorus SDLC implementation gate (Security / Goldratt / Evans / Richards / Cooper; seated
from 8 RSVP joiners, 5th seat a recorded 🟡 tie-default; author-excluded vote, deterministic tally)
reviewed the canon implementation. It produced **three gating 🔴**, all incorporated here (cycle 1):

- **SEC-1** (net +4, unanimous) — FR-007 called the secret pre-filter "**mechanical**," but the skill
  has no runtime, so it is a deny-rule the dispatched persona applies to itself — self-attestation, not
  a compiled pass. **Fix:** reframed as "**agent-applied, ledger-audited**"; the ledger drop-record is
  the verifiable guard, and the spec no longer claims a determinism the substrate can't give.
- **SEC-2** (net +2) — the detector class named only credential-shaped secrets; the constitution's
  boundary is broader ("private project facts"), and low-entropy private prose (internal hostnames,
  names, ticket IDs) sails past an entropy check. **Fix:** FR-007 now names a **two-part** detector
  class — credential-shaped **and** structured-private-fact.
- **COOP-2** (net +2) — FR-006's no-response → defer → re-offer had **no bound**: an unanswered
  proposal re-asked at every future sign-off (an aggregate with no terminal state; an ever-growing
  queue; a standing operator tax). **Fix:** bounded to **N = 3 re-offers**, then **lapse** to a
  passively-readable pending list — a terminal state distinct from reject.

Folded in the same cycle: **SEC-4** (held 🟡) — the ledger drop-record now logs drops on the auto
`lens-specific` path too, not just the proposal path.

Held 🟡 (recorded, non-gating; the operator proceeds at will):

- **TOC-2 / TOC-3** (Goldratt) — *spec 004's read-side has never been exercised by a real run, and
  004 is itself still `Draft`*; building the write-side now buys correctness for a loop that has never
  closed once. The recorded cost-of-delay rationale (build now; 004 pays nothing back until the loop
  closes) is legible but unmeasured. **Cheapest experiment, deferred to the operator:** run **one**
  full lifecycle, persist write-back **by hand** into two or three lens records, and confirm run 2's
  exploratory phase reads them back — before relying on the automated phase. This did not gate (most
  voters CONFIRMed), but it is the most load-bearing strategic caveat on the feature.
- **ARCH-3** (Richards) — add a doc-test fitness function asserting the FR-010 section names no
  fingerprint write-verb, so the 004 reuse cannot silently fork later. Recommended, non-blocking.

Demoted to 🟢 by the tally (net −2): **SEC-6** (`.gitignore` — the memory dir is outside the repo, so
a repo ignore-rule was never its control surface), **DDD-2-bis** (rename "deferred write-back" →
"deferred proposal" — the room judged "write-back" names the trust-bearing direction more honestly),
**COOP-3** (re-present the diff outside sign-off — cuts against the deliberate sign-off-bookend design;
the bounded-lapse fix above already removes the fatigue tax).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lenses write back their own learnings at sign-off (Priority: P1)

When a spec run reaches sign-off, the orchestrator **dispatches each seated persona** to update
its own `~/.claude/agent-memory/<persona>/` record with this cycle's durable learnings — new
references, refined inferences, resolved/!still-open gaps — each as a **locator + short hint**,
tagged with `scope` and a freshness fingerprint. No persona's memory is written by the orchestrator.

**Why this priority**: This is the feature — closing the read/write loop so the next run starts
from the last run's understanding instead of re-deriving it.

**Independent Test**: After a run signs off, every seated persona's record contains at least the
cycle's confirmed `lens-specific` deltas as locators (not verdicts), and the orchestrator authored
none of them.

**Acceptance Scenarios**:

1. **Given** a signed-off run with N seated personas, **When** the memory update phase runs,
   **Then** N dispatch calls are made (one per persona) and each persona's record gains this
   cycle's `lens-specific` deltas as scope-tagged locators with freshness fingerprints.
2. **Given** a learning that is merely a conclusion with no live-source locator, **When** a persona
   tries to persist it, **Then** it is written as a navigational hint pointing at the source, never
   as a standalone authoritative claim (memory-is-an-index).
3. **Given** the orchestrator, **When** the phase runs, **Then** it performs no authoring of any
   persona's record and no synthesis of a learning (S1/S9).

---

### User Story 2 - Project-wide learnings are proposed to the operator, not auto-written (Priority: P1)

When a persona's learning is `project-wide` in scope, the phase does **not** write the shared
addendum. Instead the orchestrator **collates a clean proposed diff** to
`docs/reviews/CHORUS-PROJECT.md`'s "Project understanding" section and surfaces it for **operator
accept/reject**. On accept, the scope-tagged write-back is applied; on **reject** the fact is
discarded; on **no-response** the proposal is **deferred and re-offered next cycle** (never silently
lost). The addendum is untouched unless the operator accepts, and sign-off is never blocked on the answer.

**Why this priority**: The shared addendum is operator-owned and committed; auto-writing it would
violate spec 004's single-write-path rule and risk committing private/secret facts.

**Independent Test**: A run producing a `project-wide` learning yields a proposed addendum diff
that is applied iff the operator accepts; rejecting leaves `CHORUS-PROJECT.md` byte-unchanged and
logs the rejection.

**Acceptance Scenarios**:

1. **Given** ≥1 `project-wide` confirmed learning, **When** the phase runs, **Then** a single
   accept/reject proposal carrying the exact diff is surfaced (one operator ask, framed instantly).
2. **Given** the operator accepts, **When** applied, **Then** the addendum gains the scope-tagged
   facts via the spec-004 write-back path, with reconciliation locators/fingerprints intact.
3. **Given** the operator **rejects**, **When** the run completes, **Then** the addendum is unchanged,
   a DecisionRecord ("rejected") is written, the fact is not re-offered, and sign-off proceeds.
3a. **Given** the operator **does not answer**, **When** the run completes, **Then** the addendum is
   unchanged, the proposal is **queued as pending** and re-offered at the next sign-off, and sign-off
   proceeds — the learning is deferred, not discarded.
4. **Given** a candidate fact matching the secret pre-filter, **When** the phase runs, **Then** it is
   dropped and flagged in the ledger **before** any record write or proposal — it never reaches the
   operator, and the outcome is identical whether or not the operator answers (the secrets gate is
   the pre-filter, not the confirm).

---

### User Story 3 - The update is auditable from the ledger (Priority: P2)

The phase records its outcome in the run's ledger (`specs/<feature>/agent-sdlc-log.md`): which
personas wrote back, how many `lens-specific` deltas each persisted, the proposed `project-wide`
diff, and the operator's accept/reject decision — so a reviewer can reconstruct what entered memory.

**Why this priority**: Memory writes are trust-bearing; the ledger is the audit trail. Without a
record, the two-tier memory could drift invisibly.

**Acceptance Scenarios**:

1. **Given** a completed phase, **When** the ledger is read, **Then** it has a
   `## Memory update (sign-off)` section listing per-persona write-back counts and the
   addendum-proposal decision (accepted/rejected/unanswered + the diff or its locator).
2. **Given** the end-of-run S1–S9 self-audit, **When** it runs, **Then** it includes a check that
   the orchestrator authored no persona record and synthesized no learning.

---

### Edge Cases

- **No durable learnings.** The phase runs, finds nothing to persist, records "no-op" in the
  ledger, and does not surface an empty operator proposal. Sign-off proceeds.
- **Persona has no memory dir / runs without persistent memory.** The phase degrades to a no-op for
  that lens (records the skip); it never fabricates a record.
- **Conflict with existing addendum fact.** A proposed `project-wide` fact that conflicts with an
  authoritative addendum entry is surfaced in the diff as a change-with-reconciliation-locator; the
  addendum stays authoritative on conflict until the operator accepts.
- **Run aborted before sign-off** (escalated 🔴, operator stop). The phase does **not** fire — it is
  a sign-off bookend; partial-run learnings remain only in the ledger.
- **Stale cache after write.** An accepted addendum write changes the cited span; caches in lens
  records re-validate via spec 004's read-side digest on next re-read (weak/eventual consistency,
  addendum authoritative). This phase adds no fingerprint mutator of its own.
- **Secret leakage.** The agent-applied, ledger-audited secret pre-filter (FR-007) runs on every
  candidate fact before any write or proposal and independently of the operator answer; matches
  (credential-shaped or structured-private-fact) are dropped and flagged in
  the ledger, never persisted or proposed (constitution security principle).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The SDLC pipeline MUST add a **memory update phase** that fires **once per lifecycle,
  at sign-off** (after Gate C clears), with the completed run's ledger as its source. It MUST NOT
  fire per gate, per self-heal cycle, or on an aborted run.
- **FR-002**: The phase MUST **dispatch to each seated persona** to update **its own**
  `~/.claude/agent-memory/<persona>/` record. The orchestrator MUST NOT author any persona's
  record or synthesize a learning (S1/S9). Each dispatched persona distills **only its own
  contributions to this run's ledger** (its findings-register rows + its understanding record),
  applying FR-003a — a re-read of its own prior output, not a fresh corpus harvest. The cheaper
  "orchestrator distills the whole ledger in one pass" alternative is **refused**: it would
  synthesize what a lens learned, violating S1/S9 (TOC-3 resolution above).
- **FR-003**: Persisted learnings MUST be **locators + ≤~2-sentence navigational hints**, never
  standalone authoritative conclusions — preserving "memory is an index, never the endpoint."
- **FR-003a (definition)**: A learning is **durable** — and therefore eligible to persist — iff it
  satisfies BOTH: (a) it carries a **re-groundable locator** into the live source (no locator → not
  durable, drop), and (b) it **generalizes beyond this run's spec delta** — it informs how a future
  feature would be reviewed, rather than restating a one-run artifact already captured in this run's
  ledger. A learning failing either test is ephemeral and is NOT persisted. This predicate is what
  FR-009's no-op test evaluates; it is applied by the persona, never inferred by the orchestrator.
- **FR-004**: Every persisted/proposed fact MUST carry a `scope` (`project-wide` | `lens-specific`)
  and a freshness fingerprint (spec 004 schema). `lens-specific` facts stay in the persona record.
- **FR-005**: `project-wide` learnings MUST be surfaced as a **single operator accept/reject
  proposal** carrying the exact diff to `docs/reviews/CHORUS-PROJECT.md`; they MUST NOT be
  auto-written. The shared addendum is written **only** via the accepted, scope-tagged write-back
  (spec 004 FR-005/FR-017).
- **FR-006**: The addendum MUST be left unchanged unless the operator **accepts**, and **sign-off
  MUST proceed** regardless (the proposal never blocks the run — self-unblocking discipline). The
  two non-accept outcomes are distinct and MUST NOT be collapsed:
  - **Reject** (the operator declines the fact) → **discard**; a DecisionRecord (default = "addendum
    unchanged, rejected") is written. The fact is not re-offered.
  - **No-response** (the operator did not answer) → **defer, do not discard**; the proposal is
    queued (recorded in the ledger's pending-proposals list) and **re-offered** at the next run's
    sign-off / read by the next exploratory phase. A `project-wide` learning is never silently lost
    to inattention — only to an explicit reject.
  - **Bounded re-offer (terminal state; COOP-2).** Re-offer is **not** unbounded. After **N = 3**
    consecutive sign-offs unanswered, the deferred proposal **auto-expires to a `lapsed` state** — a
    *terminal* state distinct from reject: not discarded with prejudice, but **no longer actively
    re-offered**. A lapsed proposal moves to a **passively-readable** pending list the operator may
    consult on their own initiative (and which the next exploratory phase may still read), but it
    **stops interrupting sign-off**. This bounds the deferred-proposal queue (it cannot grow without
    limit), gives the proposal aggregate a terminal state for chronic non-response (not only for
    accept/reject), and ensures "defer" never becomes a standing tax that re-asks at every future
    sign-off until the operator capitulates. Re-activation is operator-initiated from the pending
    list, never automatic.
- **FR-007**: An **agent-applied, ledger-audited secret pre-filter MUST run on every candidate fact
  BEFORE it is written to a lens record or surfaced in any proposal**, and MUST run regardless of
  whether the operator later answers — the secrets boundary is absolute (constitution: "No secrets,
  ever") and MUST NOT depend on the operator-confirm. A fact matching the filter is **dropped and
  flagged in the ledger**, never persisted and never proposed; the **ledger drop-record is where the
  filter's operation is audited**, and it MUST log drops on **both** paths — the `project-wide`
  proposal path **and** the auto `lens-specific` write path (the unwatched path; SEC-4). The detector
  class MUST be named in two parts:
  - **credential-shaped secrets** — high-entropy tokens, known credential/key prefixes, and
    `.env`/secret-file path captures;
  - **structured private project facts** — the constitution's boundary is broader than credentials
    (`.specify/memory/constitution.md`: a committed `CHORUS-PROJECT.md` carrying *private project
    facts*): internal hostnames/endpoints, personal or customer names, and ticket/issue identifiers.
    Low-entropy private prose sails past an entropy check, so it MUST be a named class, not an
    afterthought — it is exactly the surface a harvest-to-replay phase moves toward a committed file.
  **Substrate honesty (this skill has no runtime — see Assumptions):** the filter is a deny-rule the
  dispatched persona applies to itself before writing, **not** a compiled mechanical pass; its
  enforcement is **persona-applied discipline made verifiable by the ledger drop-record**, not a
  runtime guarantee. The spec MUST NOT call it "mechanical" — that word claims a determinism the
  substrate cannot give. The operator-confirm (FR-005) governs only **whether an already-secret-free
  `project-wide` fact is written** — it is not the secrets gate.
- **FR-008**: The phase MUST record its outcome in the ledger under a `## Memory update (sign-off)`
  section: per-persona write-back counts, the proposed `project-wide` diff (or its locator), and the
  operator decision. The end-of-run S1–S9 self-audit MUST include "orchestrator authored no record /
  synthesized no learning."
- **FR-009**: The phase MUST be a **no-op (recorded)** when there are no **durable** learnings (per
  FR-003a's two-part predicate) or a persona lacks a memory dir; it MUST NOT fabricate records or
  surface an empty proposal. The recorded no-op MUST state which test (no locator / does-not-
  generalize / no memory dir) produced it, so a reviewer can tell a correct no-op from a miss.
- **FR-010**: This phase MUST NOT introduce any freshness-fingerprint mechanic. An accepted
  addendum write changes the cited span, so staleness is detected by **spec 004's read-side
  re-validation** when a lens next re-reads the source (addendum authoritative on conflict;
  weak/eventual consistency). The write triggers the existing read-side digest; it does not
  "bump" a stored value (there is no runtime — see Assumptions).

### Key Entities

- **Memory update phase**: the sign-off lifecycle bookend that dispatches write-back.
- **Lens-specific delta** *(canon: a scope=`lens-specific` operator-confirmed/referenced fact)*: a
  locator+hint written autonomously to a persona's record — the exploratory-phase fact, written at
  sign-off. "Delta" is informal shorthand for this cycle's new such facts, never a new entity or
  write path.
- **Project-wide proposal** *(canon: the scope=`project-wide`, operator-accepted write-back, spec 004
  FR-005/FR-017)*: that existing write-back surfaced as a single accept/reject diff to the shared
  addendum (operator-owned) — not a new write path.
- **Deferred write-back**: a `project-wide` write-back the operator did not answer — a *state of* the
  write-back (reusing the re-entrant interview's deferred-session notion), queued in the ledger's
  pending list and re-offered at the next sign-off, **bounded to N = 3 re-offers** (FR-006). Distinct
  from a rejected write-back (discarded).
- **Lapsed proposal**: a deferred write-back that went unanswered for N = 3 consecutive sign-offs —
  a *terminal* state (distinct from reject): moved to a passively-readable pending list, no longer
  actively re-offered, re-activatable only on operator initiative. This is what bounds the queue and
  gives the proposal aggregate a terminal state for chronic non-response (COOP-2).
- **Secret pre-filter**: the **agent-applied, ledger-audited** deny-filter that drops secret-shaped
  **and structured-private-fact** candidate facts before any write or proposal, independent of the
  operator-confirm. Persona-applied discipline made verifiable by the ledger drop-record — not a
  runtime "mechanical" pass (this skill has no runtime).
- **Memory-update ledger section**: the audit record of what entered memory, what was deferred, and
  the operator decision.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a signed-off run, 100% of seated personas with a memory dir have their
  `lens-specific` confirmed deltas persisted as locators; the orchestrator authored 0 of them.
- **SC-002**: 0 auto-writes to `docs/reviews/CHORUS-PROJECT.md` — every shared-addendum change
  traces to an operator-accepted proposal.
- **SC-003**: A rejected or unanswered proposal leaves the addendum byte-identical and never blocks
  sign-off (run completes in 100% of such cases).
- **SC-003a**: A `project-wide` learning the operator did not answer is **re-offered at the next
  sign-off** in 100% of cases (0 silent losses to inattention); only an explicit reject discards it.
- **SC-003b**: A deferred proposal unanswered for **N = 3** consecutive sign-offs is **lapsed** (moved
  to the passively-readable pending list and no longer actively re-offered) in 100% of cases — the
  re-offer queue is bounded and never re-interrupts a fourth sign-off (COOP-2).
- **SC-004**: Every run's ledger contains a reconstructable `## Memory update (sign-off)` section;
  a reviewer can determine what entered memory from it alone.
- **SC-005**: 0 secret-shaped **and 0 structured-private-fact** candidates persisted or proposed
  across the conformance scenarios — every match is dropped by the FR-007 pre-filter **before** any
  write/proposal, with identical outcomes whether or not the operator answers (the secrets gate does
  not depend on the confirm). The detector covers **both** named classes (credential-shaped and
  structured private facts), and the **ledger drop-record logs drops on both the proposal path and
  the auto `lens-specific` path** — the pre-filter is the audited boundary, not the word "mechanical."
- **SC-006**: A `quickstart.md` worked example shows a two-run sequence where run 2's exploratory
  phase reads a fact that run 1's memory update phase persisted — demonstrating the closed loop.

## Assumptions

- "SDLC cycle" = one full spec lifecycle run (plan → A → impl → B → impl → C → sign-off); "cycle
  end" = sign-off. (Operator-confirmed.)
- The write-back contract, `scope` tagging, and addendum schema are owned by spec 004; this feature
  triggers them at a new moment and does not redefine them.
- The phase's source of truth for "what was learned" is the completed run ledger plus each persona's
  own in-context understanding — not an orchestrator-authored summary.
- This is Markdown skill/prompt-orchestration authoring; there is no runtime code.
  `quickstart.md` conformance is the first-class verification surface (Principle V).
