# Feature Specification: CONFIRM Vote — Separate Agreement from Escalation in the Tally

**Feature Branch**: `009-confirm-vote-tally`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description — fix issue #13: convergent *agreement* inflates a polish 🟡
into a gating 🔴 because the `PRIORITIZE` vote conflates "I agree, rank it high" with "this
is under-rated, escalate." Add a third vote value `CONFIRM` so the two are legibly distinct.

## Context

The gate primitive's stage-4 tally (`skill/chorus/GATE-PRIMITIVE.md`) sets a finding's
severity by a symmetric rule: among non-author voters, `net = PRIORITIZE − OVER-RATE`;
`net ≥ +2` escalates one level, `net ≤ −2` demotes one level, otherwise hold.

The defect (**issue #13**, the #6 successor): `PRIORITIZE` is defined as "at least as severe
as proposed," so a voter who merely **agrees** with a 🟡 and wants it ranked highly casts the
*same* `PRIORITIZE` as a voter who believes the finding is genuinely **under-rated**. The
tally cannot tell the two apart, so **convergent agreement on a polish 🟡 inflates it into a
merge-blocking 🔴** even when no author proposed it as gating.

This was observed three times, recorded in `specs/007-chorus-learn-onboarding/agent-sdlc-log.md`:
Gate A run-2 (🟢-accepts escalated to 🟡, 🟡→🔴 on findings whose own notes said "at correct
severity"), Gate B (DNO-5: 4–0 →🔴 with notes saying "correctly rated 🟡"), and Gate C (seven
author-proposed 🟡 polish findings escalated to gating 🔴 by convergent `PRIORITIZE` while the
scope lens explicitly voted "merge now"). The panel discriminated honestly elsewhere (BECK-4
demoted −2), so the votes were honest — **the defect is the primitive, not the voters.**

The constitution already records this as a known, unfixed defect: Principle III's
**counter-force** clause and the `TODO(TALLY_WART)` in the Sync Impact Report both name the
"convergence-vs-escalation ambiguity" and say a canon fix — *a CONFIRM vote value, or
escalation gated on an explicit under-rated claim* — is owed before the caveat can drop. This
feature is that fix (the CONFIRM-vote option).

### Relationship to open issues

- **Closes #13.** Implements its recommended option 1.
- **Composes with #9 (typed result-tail).** When a vote arrives as a typed enum,
  `PRIORITIZE | CONFIRM | OVER-RATE` *is* that enum; this feature makes it three-valued. It
  does **not** depend on #9.

## Constitution check (Principle I — cite, never restate; Principle III — the rule changed)

- **S8 / S9 / Principle III** (`GATE-PRIMITIVE.md`, constitution) — the tally remains
  deterministic arithmetic over **real** votes; the author never grades its own finding; the
  orchestrator never synthesizes a vote. This feature **strengthens** III: it removes the
  ambiguity the counter-force clause flagged, so III can finally drop its caveat. The vote
  vocabulary grows from two values to three; the arithmetic stays mechanical.
- **Principle I (cite, never restate)** — the canon mechanic is defined once in
  `GATE-PRIMITIVE.md`; SKILL/SDLC/ledger reference it. This feature edits the one canonical
  definition and updates the references, never forking the rule.
- **Mechanical, not prose** — `CONFIRM` vs `PRIORITIZE` is **declared by the voter**, never
  inferred by the orchestrator from prose. The tally still counts declared values only (no
  re-reading a note to decide which it "really" was).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A correctly-rated polish 🟡 stays 🟡 under convergent agreement (Priority: P1)

A panel of non-author voters all **agree** an author-proposed 🟡 is correctly rated and worth
ranking highly. Each casts `CONFIRM` (not `PRIORITIZE`). The finding **holds at 🟡** — it does
not become a gating 🔴 by popularity — yet it still ranks highly because the convergence count
includes their agreement.

**Why this priority**: This is the defect. Fixing it is the whole feature; everything else is
preserving the behaviors that already work.

**Independent Test**: Replay Gate C from `specs/007`'s ledger under the new tally — the seven
author-proposed 🟡 polish findings that escalated to 🔴 by convergent `PRIORITIZE` now hold at
🟡 when those votes are read as `CONFIRM`, while their top-5 ranking is unaffected.

**Acceptance Scenarios**:

1. **Given** an author-proposed 🟡 finding and three non-author voters each casting `CONFIRM`
   (agree, correctly rated), **When** the stage-4 tally runs, **Then** `net = 0` and the
   finding holds at 🟡 — not escalated.
2. **Given** the same finding, **When** Phase 4 ranking runs, **Then** its convergence count
   reflects the three agreeing lenses (it can rank in the top-5), even though its severity
   did not move.
3. **Given** a mix of two `CONFIRM` and one `PRIORITIZE` on a 🟡, **When** the tally runs,
   **Then** `net = +1` (only `PRIORITIZE` counts toward escalation) and the finding holds at
   🟡 — escalation requires `net ≥ +2` of genuine under-rated claims.

---

### User Story 2 - A genuinely under-rated finding still escalates (Priority: P1)

Two or more non-author voters believe a finding is **under-rated** and cast `PRIORITIZE`. The
finding escalates one level, exactly as the honest cases intend. The fix must not break the
signal that real under-rating convergence carries.

**Why this priority**: Over-correcting #13 by killing all escalation would be a worse defect.
Genuine under-rated convergence must still move severity.

**Independent Test**: A 🟡 finding with two non-author `PRIORITIZE` votes and zero `OVER-RATE`
escalates to 🔴; the same finding with two `CONFIRM` instead does not.

**Acceptance Scenarios**:

1. **Given** an author-proposed 🟡 and two non-author `PRIORITIZE` votes (under-rated), zero
   `OVER-RATE`, **When** the tally runs, **Then** `net = +2` and the finding escalates 🟡→🔴.
2. **Given** the BECK-4 case (clear over-rating), **When** the tally runs, **Then** the
   demote side is unchanged: `net ≤ −2` demotes one level.

---

### User Story 3 - The three values are recorded distinctly and dispatched legibly (Priority: P2)

Voters are asked a **three-way** question (under-rated / correctly-rated / over-rated), and
the ledger records `PRIORITIZE`, `CONFIRM`, and `OVER-RATE` in distinct columns, so any
reviewer can reconstruct why a severity did or did not move.

**Why this priority**: The fix only holds if voters can express CONFIRM and the record shows
it; otherwise the orchestrator is back to guessing from prose.

**Acceptance Scenarios**:

1. **Given** a Round-2 / SDLC vote dispatch, **When** the brief asks for the call, **Then** it
   offers three options — under-rated (PRIORITIZE), correctly-rated (CONFIRM), over-rated
   (OVER-RATE) — not a two-way priority/over-rated ask.
2. **Given** a completed gate, **When** the ledger's vote-tally table is written, **Then** it
   has a distinct `CONFIRM` column alongside `PRIORITIZE` and `OVER-RATE`.

---

### Edge Cases

- **All-abstain / no votes.** `net = 0`, holds, marked *unvoted* (non-gating) — unchanged.
- **A voter agrees but gives no value.** Treated as today's missing vote (does not count
  toward net); it is **not** silently read as CONFIRM or PRIORITIZE — the value is declared,
  never inferred (preserves S9).
- **Ranking vs severity divergence.** A finding can be high-convergence (many CONFIRM) yet
  non-gating 🟡 — this is intended, not a bug; the artifact must make both legible.
- **Author casts CONFIRM on own finding.** Forbidden by S8 (author never grades own finding);
  CONFIRM is a non-author vote like the others.
- **Old two-valued records.** Pre-change ledgers with only PRIORITIZE/OVER-RATE remain valid;
  see FR-009.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The stage-3 vote vocabulary MUST be three declared values: `PRIORITIZE`
  ("under-rated — escalate"), `CONFIRM` ("correctly rated — agree, hold"), and `OVER-RATE`
  ("over-rated — demote"). The value is **declared by the voter**, never inferred from prose.
- **FR-002**: The stage-4 tally MUST compute `net = PRIORITIZE − OVER-RATE` among non-author
  voters, **excluding `CONFIRM` from net**. `net ≥ +2` escalates one level; `net ≤ −2`
  demotes one level; otherwise hold. The demote side is unchanged from today.
- **FR-003**: The **convergence count** used for Phase 4 ranking MUST count all agreement
  (`PRIORITIZE` + `CONFIRM`), so a finding many lenses care about still ranks highly even
  when its severity holds. Severity **escalation** MUST count only `PRIORITIZE`. These two
  meanings of "convergence" are explicitly decoupled.
- **FR-004**: The "two converging lenses earn 🔴" rule (`README.md`, `GATE-PRIMITIVE.md`
  symmetry note) MUST be amended to "two lenses claiming **under-rated** earn an escalation;
  mere agreement holds." This is a deliberate, recorded behavior change, not a regression.
- **FR-005**: The Round-2 (base round) and SDLC vote dispatch MUST ask a **three-way**
  question — under-rated / correctly-rated / over-rated — replacing the two-way
  priority/over-rated ask.
- **FR-006**: The SDLC ledger's vote-tally table MUST record `PRIORITIZE`, `CONFIRM`, and
  `OVER-RATE` in distinct columns.
- **FR-007**: The constitution MUST be updated: Principle III's **counter-force** clause drops
  the "known defect" caveat (the ambiguity is resolved), and the `TODO(TALLY_WART)` is closed
  with a pointer to this feature. S8/S9 are unchanged.
- **FR-008**: S8 (author never grades own finding) and S9 (orchestrator never synthesizes a
  vote/grade; tally is arithmetic over real votes) MUST remain intact; classification stays
  mechanical (declared values only).
- **FR-009**: The change MUST be backward-compatible in the record: pre-change two-valued
  ledgers remain valid and re-tally to the same severities (no CONFIRM present means net is
  computed exactly as before). Adoption is additive.

### Key Entities

- **Vote**: a non-author voter's declared call on one finding — one of `PRIORITIZE`,
  `CONFIRM`, `OVER-RATE`. `CONFIRM` is new; it expresses agreement-at-severity.
- **net**: `PRIORITIZE − OVER-RATE` among non-author voters; drives escalation/demotion.
  CONFIRM is excluded.
- **convergence count**: `PRIORITIZE + CONFIRM` among non-author voters; drives ranking, not
  severity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Replaying the three recorded #13 cases (`specs/007` ledger: Gate A run-2, Gate
  B DNO-5, Gate C's seven polish findings) under the new tally **holds every
  correctly-rated 🟡 at 🟡** — 0 agreement-driven escalations to 🔴.
- **SC-002**: A finding with ≥2 non-author `PRIORITIZE` (under-rated) and 0 `OVER-RATE` still
  escalates one level — genuine under-rated convergence is preserved (100% of such cases).
- **SC-003**: The demote side is byte-identical to the pre-change tally (`net ≤ −2` demotes
  one level) on every recorded case.
- **SC-004**: Every recorded #13-affected finding that holds at 🟡 can still appear in the
  top-5 by convergence count — severity and ranking are demonstrably decoupled.
- **SC-005**: A `quickstart.md` worked example reproduces the Gate C escalation under the old
  tally and its correct hold under the new tally, side by side.

## Assumptions

- The canon mechanic lives once in `GATE-PRIMITIVE.md`; SKILL/SDLC/ledger/constitution
  reference it. This feature edits that one definition and its references.
- Voters can express three values in their report (the dispatch asks for it); a missing value
  is a missing vote, never inferred.
- "Correctly rated" (CONFIRM) is relative to the **author-proposed** severity — the voter
  agrees with what the author proposed, exactly as PRIORITIZE/OVER-RATE are relative to it.
- The base-round register/matrix (spec 008) renders the resulting severity unchanged; this
  feature changes how severity is *computed*, not how it is *displayed*.
- This is a methodology change to Markdown canon; `quickstart.md` conformance is the
  first-class verification surface (Principle V).
