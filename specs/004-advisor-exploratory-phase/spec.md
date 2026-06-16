# Feature Specification: Advisor Exploratory Phase

**Feature Branch**: `004-advisor-exploratory-phase`

**Created**: 2026-06-07

**Status**: Ratified — read-side in active use across features 007/077/085/091/461
(per-persona records under `~/.claude/agent-memory/<persona>/`, indexed by each lens's
`MEMORY.md`; ~100+ locator+hint records accumulated, with cross-run read-back observed,
e.g. Norman's 007 "run-2 clean-slate revalidated"). The write-back contract 010 reuses is
thereby exercised, not merely specced. Goldratt's instrumented one-cycle round-trip
experiment (010 held 🟡 TOC-2/3) has additionally been run (see 010 commit 705f292,
2026-06-15): 3 hand-persisted records, 3 personas re-read on run 2, a planted stale
entry caught and flagged — the loop closes and fails safe. Caveat retired on both
counts: in-use evidence and a passing instrumented round-trip.

**Input**: User description: "advisor exploratory phase. Each advisor may need to
build a deeper understanding of the project and record it in its memory before
starting work. (1) Each advisor needs specific info collected — e.g. Mark
Richards needs the software architecture, the architectural characteristics
deemed important, and (if software is pre-existing) structural and behavioural
definitions. (2) The advisor collects or infers this from the repo itself; if
the repo already documents it (docs, ADRs, any written info), the advisor
references it rather than duplicating; if what's present is insufficient, the
advisor conducts exploratory analysis and interviews the operator to gather
what's missing."

## Overview

Today an advisor enters a review and reads artefacts cold each round. This
feature adds an **exploratory phase**: before producing findings, a
participating advisor builds a **lens-specific understanding** of the review
target and records it in its own memory, so its findings rest on real
understanding rather than a first-pass read — and so the next round reuses that
understanding instead of re-deriving it.

The understanding is harvested **reference-first**: where the repo already holds
the knowledge (documentation, ADRs, READMEs, specs, diagrams, comments), the
advisor records a pointer to it, not a copy. Only where the repo is insufficient
does the advisor run a bounded exploratory analysis and, for what analysis still
can't settle, interview the operator — asking only about genuine gaps, and
persisting the answers so the operator is asked once, not every round.

## Clarifications

### Session 2026-06-07

- Q: When an advisor's exploratory phase hits a gap that needs the operator, who
  conducts the interview? → A: The **orchestrator**. Advisors surface
  gap-questions; the orchestrator dedupes them across all participating advisors
  and runs **one batched operator interview per round**, writing answers back to
  each advisor's record. Advisors do not interview the operator directly (this
  preserves the integration layer's "orchestrator owns operator interaction"
  invariant).
- Q: How does an advisor's understanding relate across scopes (a single
  feature/spec gate vs. the whole project)? → A: **Layered** — a persisted
  project-level base plus feature/spec deltas that reference the base. A
  feature/spec review reads base + delta and rebuilds neither.
- Q: Where is each advisor's information-needs profile declared, and who authors
  it? → A: Each advisor **authors its own distinctive profile** (lens-owned,
  co-located with the persona); profiles are not a single imposed template. The
  nominated profiles from the first round are recorded in
  [`information-needs-profiles.md`](./information-needs-profiles.md).
- Q: How does the exploratory phase relate to the existing `CHORUS-PROJECT.md`
  addendum (the hand-written, cross-advisor project memory)? → A: The **addendum
  IS the shared project-level base layer**. The exploratory phase reads it as a
  primary reference source, and per-advisor records reference it rather than
  duplicate it. Operator-confirmed, project-wide facts are written back to the
  addendum as **proposed additions the operator accepts** (not auto-committed
  inferences); unconfirmed inferences stay in per-advisor records, flagged
  provisional.
- Q: Where do the additional project-wide facts the exploratory phase confirms
  (ranked characteristics, real-users-yet, trust boundaries, release path…) get
  stored? → A: **Extend the addendum** — it gains a structured "Project
  understanding" area (and the template gains the section), keeping one shared
  project memory rather than a second store.

### Session 2026-06-07 (Gate A chorus incorporation)

Resolutions to the Gate A design-review findings (ledger:
[`agent-sdlc-log.md`](./agent-sdlc-log.md)), operator-decided:

- Q: The batched operator interview is unbounded on a thinly-documented target
  (no cap, single barrier) — how is the operator's burden bounded? → A:
  **Sessioned, re-entrant, operator-paced.** Delivered in **sessions of ≤ 5
  questions**; the operator may **defer and resume** later and **controls the
  token/time budget**. Each session opens with a plain-language preamble (what it
  is, what it costs, that it can be paused) — assume no familiarity with chorus
  mechanics. A deferred/skipped session leaves open gaps and the verdict carries
  an explicit **degradation summary**, not only per-finding flags. (FR-019)
- Q: The per-round cost of the phase is unpriced. → A: Cost is
  **operator-controlled** (budget + pacing, above) and the phase runs
  **cheapest-subset-first** — profiles + reference harvest + one interview
  session before any optional deepening — so value is shown before more cost is
  spent. (FR-020)
- Q: Persisted advisor memory absorbs reviewed-repo prose and replays it
  (injection / stale-trust surface). → A: Persisted memory is an **index of
  locators, never the evidentiary endpoint**. A finding re-grounds in the live
  artefact (the founding why-why-why principle, applied fully); a cached quote is
  a **hint only**, never evidence. No trusted persisted payload exists, and
  staleness is caught at re-read. (FR-021)
- Q: The Success Criteria are prose with nothing enforcing them — is there an
  executable fitness function? → A: Yes — **per-advisor information-needs-profile
  coverage**: every profile item resolves to a record entry (referenced /
  inferred / operator-confirmed / open-gap), and every project-wide confirmed
  fact carries a reconciliation locator to the addendum. (FR-022)
- Q: A project-wide confirmed fact has two possible homes (addendum vs. record)
  with no attribute marking which; SC-008's "live once" is unenforceable. → A:
  The **addendum is the authoritative system of record** (operator-owned, a
  limited surface — not force-read). Records **may denormalize** (cache) the
  project-wide facts their lens uses so a directly-invoked advisor need not read
  the addendum. Consistency is **weak/eventual**: a cached copy carries a
  freshness fingerprint to its addendum source; on drift it is re-validated and
  the **addendum wins**. A confirmed fact carries an explicit **scope
  (`project-wide` | `lens-specific`)**; only `project-wide` facts are authored in
  the addendum, via operator-accepted write-back. (FR-023; revises SC-008)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grounded review via persisted lens understanding (Priority: P1)

Before an advisor produces findings, it assembles the things its lens must
understand about the target, records that understanding in memory, and reviews
from it. A later round on the same target reuses the recorded understanding
rather than starting cold.

**Why this priority**: This is the core value — findings grounded in a real,
persisted understanding of the project instead of a per-round cold read. Without
it, every round re-derives context and quality varies with how much an advisor
happened to read that round.

**Independent Test**: Run an advisor through the exploratory phase on a target;
confirm it produces an understanding record covering its lens's information
needs, then produces findings that trace to that record; run a second round and
confirm it reuses the record rather than rebuilding it.

**Acceptance Scenarios**:

1. **Given** an advisor with a defined information-needs profile, **When** it
   enters the exploratory phase, **Then** it produces an understanding record
   addressing each need (as a reference, an inference, an operator-confirmed
   fact, or an explicit open gap).
2. **Given** an understanding record from a prior round, **When** the same
   advisor reviews the same target again, **Then** it reuses the record and only
   revisits what changed since it was written.
3. **Given** a finding an advisor files, **When** its lens-critical assumptions
   are checked, **Then** each traces to an entry in the understanding record.

---

### User Story 2 - Reference existing knowledge, don't duplicate it (Priority: P2)

The advisor first harvests what the repo already documents and records pointers
to it; its memory holds references, its own synthesis, and named gaps — never a
copy of the source material.

**Why this priority**: Duplicated knowledge goes stale and bloats memory. A
reference stays correct as long as the source does, and keeps the advisor's
memory a thin index over the project's own documentation.

**Independent Test**: Point an advisor at a target that already documents its
lens's needs (e.g. an architecture doc / ADRs); confirm the understanding record
contains references to those documents, not reproductions of them.

**Acceptance Scenarios**:

1. **Given** the repo documents an information need, **When** the advisor
   records its understanding, **Then** the record references the source by
   location and does not reproduce its content beyond a short quote.
2. **Given** two sources conflict (e.g. an ADR contradicted by the code),
   **When** the advisor records its understanding, **Then** the conflict is
   recorded as a gap/drift and surfaced, not silently resolved.
3. **Given** a referenced source has changed since it was recorded, **When** the
   advisor reuses the record, **Then** the reference is re-validated rather than
   trusted blindly.

---

### User Story 3 - Fill gaps by analysis, then a targeted interview (Priority: P3)

Where the repo doesn't answer a need, the advisor runs a bounded exploratory
analysis; for what that still can't settle, it asks the operator targeted
questions limited to the genuine gaps, and the answers persist.

**Why this priority**: Closes the loop for projects whose knowledge isn't
written down — without turning every round into an interview. Persisting answers
means the operator is asked once.

**Independent Test**: Point an advisor at a target with an undocumented need;
confirm it attempts analysis first, asks the operator only about what remains,
records the answer, and on the next round does not ask again.

**Acceptance Scenarios**:

1. **Given** an information need the repo doesn't answer, **When** the advisor
   processes it, **Then** it attempts a bounded analysis before asking the
   operator.
2. **Given** a gap analysis cannot settle, **When** the advisor interviews the
   operator, **Then** the questions are limited to the genuine gaps and none
   asks for something already in the repo.
3. **Given** the operator answers a gap question, **When** a later round runs,
   **Then** the answer is reused and the question is not asked again (unless the
   underlying facts changed).

---

### Edge Cases

- **Fully documented target**: the repo answers every lens need → the
  exploratory phase completes with zero operator questions; the record is all
  references.
- **First round vs. later rounds**: no prior memory → full exploration; prior
  memory exists → only deltas since it was written.
- **Abstaining advisor**: an advisor that does not join the round (RSVP) does not
  run an exploratory phase.
- **Unknowable-before-review need**: a need that genuinely cannot be settled yet
  is recorded as an open gap; any finding depending on it is flagged provisional.
- **Stale reference**: a referenced doc changed since recording → the reference
  is marked stale and re-validated.
- **Conflicting sources**: doc/ADR vs. code disagreement → recorded as a drift
  and surfaced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each advisor MUST **author its own** lens-specific
  **information-needs profile** — the distinctive set of things *that lens* must
  understand about the target to review competently. The profile is lens-owned
  and co-located with the persona (not a single template imposed across
  advisors). (Example: the architecture lens needs the ranked architectural
  characteristics, the architecture style as-built, and — if the software
  pre-exists — its structural and behavioural definitions.) Each profile item
  declares whether it is typically **referenced** from a repo artefact,
  **inferred**, or gathered by **operator interview**, and each profile names the
  single need most load-bearing for that lens. The nominated profiles are
  recorded in `information-needs-profiles.md`.
- **FR-002**: Before an advisor produces findings, each of its information needs
  MUST be satisfied from one of: existing memory (a prior round), evidence in the
  target/repo, or newly gathered information.
- **FR-003**: The advisor MUST first search for existing written knowledge that
  answers its information needs — starting with the project addendum
  (`docs/reviews/CHORUS-PROJECT.md`, the shared project base), then documentation,
  ADRs, READMEs, specs, diagrams, and code comments — before inferring or asking.
- **FR-004**: When existing knowledge answers a need, the advisor MUST record a
  **reference** to it (by location) and MUST NOT duplicate its content beyond a
  short quote. A persisted quote is a **hint only, never evidence** — a finding
  re-grounds in the live source (see FR-021).
- **FR-005**: The advisor MUST record its understanding as a structured memory
  record that distinguishes **referenced** (sourced from the target),
  **inferred** (the advisor's own synthesis), and **operator-confirmed** entries.
  Each operator-confirmed entry carries a **scope** (`project-wide` |
  `lens-specific`) that fixes its canonical home (see FR-023).
- **FR-006**: For needs not answered by existing knowledge, the advisor MUST
  conduct a **bounded exploratory analysis** of the target before asking the
  operator.
- **FR-007**: For needs that analysis cannot settle, the advisor MUST raise
  **targeted gap-questions limited to the genuine gaps**; the **orchestrator**
  collects these across all participating advisors, dedupes them, and conducts a
  **single batched operator interview per round**, writing the answers back to
  each advisor's record. Advisors MUST NOT interview the operator directly. The
  interview is delivered per FR-019 (sessioned, re-entrant, operator-paced).
- **FR-008**: The advisor MUST NOT ask the operator anything already answered by
  existing knowledge in the target.
- **FR-009**: Operator answers and advisor inferences MUST be **persisted** so
  subsequent rounds reuse them rather than re-asking or re-deriving.
- **FR-010**: On a later round, the exploratory phase MUST be **incremental** —
  it revisits only what changed since the recorded understanding, not the whole
  profile.
- **FR-011**: Unconfirmed inferences and open gaps MUST be **marked as such**, so
  a finding that rests on one is visibly provisional (consistent with the
  evidence gate).
- **FR-012**: A referenced source that has changed since it was recorded MUST be
  **re-validated** (and flagged stale) rather than trusted blindly. This is also
  the reconciliation path for a denormalized cache of a project-wide fact: on
  fingerprint drift the cached copy is re-validated against the addendum, which
  is authoritative on conflict (FR-023).
- **FR-013**: The exploratory phase applies only to advisors **participating** in
  the round; advisors that abstain do not explore.
- **FR-014**: Each advisor's understanding MUST be **layered by scope**: a
  shared **project-level base** (the project addendum — see FR-016) plus
  per-advisor **feature/spec deltas** that reference the base. A feature/spec
  review (SDLC gate) reads base + delta and rebuilds neither; a full sweep
  maintains the base. Each layer is reused across rounds of the same scope.
- **FR-015**: A conflict between sources (e.g. an ADR contradicted by the code)
  MUST be recorded as a gap/drift and **surfaced**, not silently resolved.
- **FR-016**: The shared **project-level base layer IS the project addendum**
  (`docs/reviews/CHORUS-PROJECT.md`) and is the **authoritative system of record**
  for project-wide facts. The exploratory phase MUST read it as a primary
  reference source. Per-advisor records reference it; they MAY also
  **denormalize (cache)** the project-wide facts their lens uses for read-locality
  (FR-023), but every cached copy MUST carry a reconciliation locator + freshness
  marker back to the addendum, which wins on conflict.
- **FR-017**: Operator-confirmed, **project-wide** facts gathered during the
  exploratory phase MUST be written back to the addendum as **proposed additions
  the operator accepts** — never silently auto-committed; this scope-tagged,
  operator-accepted path is the **only** write-direction into the operator-owned
  addendum. Unconfirmed inferences and **lens-specific** facts stay in the
  per-advisor record (marked provisional per FR-011), not in the addendum.
- **FR-018**: The addendum MUST carry a structured **"Project understanding"**
  area for these gathered project-wide facts, alongside its existing sections;
  the addendum template (`templates/CHORUS-PROJECT.template.md`) MUST gain this
  section so new projects start with the slot.
- **FR-019**: The batched operator interview MUST be delivered in **sessions of
  ≤ 5 questions**, **re-entrant** (the operator may defer a session and resume it
  in a later sitting), and **operator-paced** (the operator controls how much
  token/time budget the phase spends). Each session MUST open with a
  plain-language preamble explaining what the interview is, what it costs, and
  that it can be paused and resumed — assuming **no familiarity with chorus
  internals** (full on the first session; a brief resumed-context reminder on
  later sessions, so a returning operator is oriented, not re-lectured). A deferred or skipped session leaves its needs as open gaps
  (FR-011) and the round's verdict MUST carry an explicit **degradation summary**
  (how many gaps remain and which findings are affected), not only per-finding
  provisional flags.
- **FR-020**: The exploratory phase MUST run **cheapest-subset-first** —
  information-needs profiles, addendum/reference harvest, and one interview
  session before any optional deeper analysis — and its per-round cost MUST be
  **operator-controlled and visible** (per FR-019), so the phase demonstrates
  value before more budget is spent.
- **FR-021**: Persisted memory (per-advisor records and cached addendum facts) is
  an **index of locators**, never the **evidentiary endpoint** of a finding.
  Every finding MUST re-ground in the live material via the locator; a persisted
  quote serves only as a navigational hint. This keeps persisted text
  non-authoritative — closing the harvest-to-replay trust surface and catching
  staleness at re-read.
- **FR-022**: The phase MUST be checkable by an executable **fitness function**:
  per-advisor **information-needs-profile coverage** — every profile item resolves
  to a record entry tagged referenced / inferred / operator-confirmed / open-gap
  (no silent omissions), and every project-wide operator-confirmed fact carries a
  reconciliation locator to the addendum (FR-023). This replaces prose-only
  conformance for SC-001 / SC-003 / SC-005 / SC-007 / SC-008.
- **FR-023**: The addendum is the **authoritative system of record** for
  project-wide facts and a deliberately **limited surface** (not force-read each
  round). Per-advisor records MAY **denormalize (cache)** the project-wide facts
  their lens uses so a **directly-invoked** advisor need not read the addendum.
  Consistency is **weak/eventual**: each cached copy carries a freshness
  fingerprint to its addendum source and is re-validated on drift (FR-012), with
  the **addendum authoritative** on conflict. A confirmed fact's **scope**
  (`project-wide` | `lens-specific`, FR-005) determines its home — only
  `project-wide` facts are authored in the addendum, via the operator-accepted
  write-back of FR-017.

### Key Entities

- **Information-needs profile**: per lens, the **lens-authored** checklist of
  what that advisor must understand to review competently, each item tagged
  referenced / inferred / operator-gathered, with the lens's most load-bearing
  need named. Co-located with the persona; nominated set in
  `information-needs-profiles.md`.
- **Project addendum (shared project base)**: `docs/reviews/CHORUS-PROJECT.md` —
  the operator-owned, cross-advisor project memory. Holds its existing sections
  (summary, exclusions, anchors, governance, security, baselines) plus a
  structured **Project understanding** area for gathered project-wide facts. It
  is the project-level base layer all advisors reference and write
  operator-confirmed project facts back to.
- **Understanding record**: the persisted, **per-advisor** memory entry holding
  the lens's feature/spec deltas and lens-specific synthesis — references
  (including into the addendum), inferences, open gaps, and **cached project-wide
  facts** (each with a reconciliation locator to the addendum), with the date each
  was written. It is an **index of locators, not an evidentiary endpoint**
  (FR-021): findings re-ground in the live source.
- **Source reference**: a pointer (locator) to existing knowledge in the target,
  with a **freshness fingerprint** for staleness detection and, for a cached
  project-wide fact, reconciliation against the authoritative addendum (FR-012,
  FR-023).
- **Confirmed-fact scope**: every operator-confirmed fact is tagged
  `project-wide` or `lens-specific`; the tag fixes its canonical home —
  `project-wide` → the addendum (authoritative, may be cached in records),
  `lens-specific` → only the asking advisor's record (FR-005, FR-023).
- **Gap**: an unmet information need; status `open` / `inferred` /
  `operator-confirmed`.
- **Operator interview**: the **orchestrator-owned, batched** set of gap-questions
  (deduped across all participating advisors) and the recorded answers, written
  back to each advisor's record. Delivered in **resumable, operator-paced sessions
  of ≤ 5 questions** with an educational preamble (FR-019). One interview (one or
  more sessions) per round.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every lens-critical assumption in an advisor's findings traces to
  its understanding record (a reference, an operator-confirmed fact, or a flagged
  inference) **and re-grounds in the live source, never in persisted memory
  alone** (FR-021) — zero ungrounded assumptions.
- **SC-002**: The understanding record references existing documents rather than
  copying them — no reproduction of a referenced source beyond a short quote.
- **SC-003**: The operator is asked only about genuine gaps — zero questions
  whose answer already exists in the target's written knowledge.
- **SC-004**: A second round on the same target reuses prior understanding —
  operator interaction is limited to deltas since the last round, and is zero
  when nothing relevant changed.
- **SC-005**: Every participating advisor (the nine personas plus any opt-in
  language lens) has a **self-authored** information-needs profile, each item
  tagged referenced / inferred / operator-gathered and naming its most
  load-bearing need (captured in `information-needs-profiles.md`).
- **SC-006**: A finding that rests on an unconfirmed inference or an open gap is
  visibly flagged as provisional.
- **SC-007**: When the target fully documents a lens's needs, the exploratory
  phase completes with zero operator questions.
- **SC-008**: The addendum is the single **authoritative** source for
  project-wide facts: every such fact is **authored only** in the addendum via an
  operator-accepted write-back (never auto-committed). Advisor records may hold
  **cached** copies for read-locality, but each cached copy carries a
  reconciliation locator + freshness marker to the addendum and yields to it on
  conflict (FR-023) — one source of truth even though copies exist.
- **SC-009**: The operator interview is delivered in resumable sessions of ≤ 5
  questions, each opening with a plain-language preamble; the operator can pause
  and resume, and a deferred session produces a verdict-level **degradation
  summary** rather than a silent quality drop (FR-019).
- **SC-010**: The per-advisor profile-coverage **fitness function** passes —
  every information-needs-profile item resolves to a tagged record entry, and
  every cached project-wide fact carries a reconciliation locator (FR-022).

## Assumptions

- **Placement**: the exploratory phase runs after RSVP self-selection (joiners
  only) and before findings are produced (before Round 1 in the project-state
  round; before the author stage in an SDLC gate). Exact wiring is a planning
  detail.
- **Memory substrate**: two tiers reusing what exists — the **project base** is
  the addendum (`docs/reviews/CHORUS-PROJECT.md`, shared, operator-owned); the
  **lens layers** are the per-advisor memory (the agents' `memory: user` surface /
  agent-memory directory). Exact record formats settled in planning.
- **Scope keying**: understanding is layered — a project-level base plus
  feature/spec deltas referencing it — per FR-014 (clarified 2026-06-07).
- **Bounded analysis**: exploratory analysis follows the chorus's existing
  sampling discipline (no "enumerate everything") and is
  **operator-budget-controlled** (FR-019 / FR-020); the analysis budget is part of
  what the operator paces.
- **Interview style**: gap questions are batched, minimal, and delivered in
  resumable ≤ 5-question sessions with an educational preamble (FR-019),
  consistent with the orchestrator's plain, choice-shaped operator interaction.
- **Reference-not-duplicate threshold**: a short quote (≈ two sentences) is
  acceptable; wholesale copying is not (mirrors `spec-walkthrough`'s "quote
  sparingly").
- **Relationship to existing anchors**: this phase supersedes per-round
  cold-reading by persisting what the existing "anchor-discovery procedure"
  surfaces, rather than replacing that procedure.

## Out of Scope

- Building a NEW project-wide knowledge store — the shared project base is the
  existing addendum (FR-016), not a new system; each advisor still keeps its own
  lens-scoped layer on top.
- Authoring the project's own documentation or ADRs — the advisor references
  existing docs or records their absence as a gap; it does not write the
  project's docs.
- Changing the finding / vote / tally mechanic (`GATE-PRIMITIVE.md`) — the
  exploratory phase feeds that mechanic; it does not alter it.
- Cross-advisor sharing of **lens-specific** records — each lens keeps its own
  layer; only the project base (the addendum) is shared across advisors.
