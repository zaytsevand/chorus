# Feature Specification: Chorus RSVP — Exceptional Entry & Board-Scaled Promotion

**Feature Branch**: `012-rsvp-exceptional-entry`

**Created**: 2026-06-17

**Status**: Draft (v3 — Gate A cycle-1 incorporation: exceptional-entry evidence bar + canon-reconciliation)

**Input**: User description: "agents RSVP system + voting power — US1: reinforce hard cap of seats per board = 5; introduce an 'I absolutely must be seated' RSVP answer above JOIN that signals the Integration Layer to prioritize the persona (a board composed of absolute joiners may exceed the cap). US2: dilute voting power for issue promotion when the board grows above 5 — required promote-votes = floor(board/2): 5→2, 6–7→3, 8–9→4."

> **v2 note.** Gate A (design review, 2026-06-17; ledger: `agent-sdlc-log.md`) returned 12 gating 🔴 with high convergence. In the operator dialogue that followed, the feature was reframed: the self-declared "ABSOLUTE / nobody-can-substitute-me" tier and the **protected-vote** mechanism were both removed (a lens must win by *persuasion*, not by *weight*; severity stays arithmetic — constitution Principle III). What survives: a **capped board (5) + uncapped *exceptional* entry**, the **board-scaled promotion threshold** (now load-bearing), and a new **conductor side-note safety net**. See Clarifications.

## Clarifications

### Session 2026-06-17 (initial)

- Q: How should a must-seat tier interact with the cap? → A (superseded by Gate-A reframe below): additive seating. Now expressed as **capped board + uncapped exceptional entry**.
- Q: The scaled threshold `T = floor(N/2)` — what is `N`? → A: **`N` = the count of non-author voters on the finding** (canon excludes a finding's author, S8); `N = board_size − 1` for a seated author. This **supersedes the prompt's board-indexed table** — a 6-seat board has 5 voters → `T = 2`. The table keys on voters: `N` 3→1, 4→2, 5→2, 6→3, 7→3, 8→4. (Retained in v2.)

### Session 2026-06-17 (Gate A reframe — operator decision resolving `gateA-block-1`)

- Q: Keep protected votes (US3 v1)? → A: **No — dropped.** Protected/veto votes let one self-declared seat outvote the count, breaking "severity is arithmetic, not judgment" (constitution Principle III; reopens issue #13). "An expert lens must be very persuasive and win because of it, not because of its weight." The conviction US3 wanted to honor is served instead by guaranteed *entry* (US1) plus the *side-note* safety net (US3 v2) — neither of which touches the tally arithmetic.
- Q: Board cap? → A: **Capped board (5 ordinary JOIN seats) + uncapped *exceptional* entry.** The cap keeps boards small and legible (and keeps `floor(N/2)` dilution cheap and rare); a lens may enter *beyond* the cap on cited **exceptional reasoning** (additive, expected rare). Because exceptional entry is always available, the cap never *truly* excludes a deserving lens — resolving the "capping = exclusion" objection without widening the default board.
- Q: Why not codify mandatory-seating rules (generalize Goldratt's carve-out; Guido↔Python)? → A: **Rejected** — "mandates will limit the agents' self-selection." Exceptional entry is *self-selected with cited exceptional reasoning*, not an operator-pin or a codified must-seat rule.
- Q: Vote dilution (US2)? → A: **Kept and central.** Uncapped exceptional entry can widen the board; a fixed `net ≥ +2` over-escalates as voters grow, so the threshold scales with `N`. Linear `floor(N/2)` is acceptable precisely because the cap keeps `N` near 4 with rare exceptional bumps.
- Q: Conductor side-notes — how much should they do? → A: **This feature ships flag-only** (non-binding marginal notes, recorded + routed to the operator, severity untouched). Making a side-note *do more* — e.g. actually holding/gating a marginal escalation — is **deferred to a separate spec** (Goldratt deferral, constitution Principle IX): build it when a validated need appears.

### Session 2026-06-17 (Gate A cycle 1 reframe — resolves `gateA-c1-block`)

Cycle 1 verified all 12 cycle-0 🔴 cleared, but surfaced 4 new gating 🔴 collapsing to two fixes:

- Q: "Exceptional" was undefined — what is the bar, who adjudicates, what keeps it rare? (G3/G4/G7) → A: **Define it by evidence, not an adjudicator.** An exceptional entry MUST cite a **concrete round-specific delta that no seated (ordinary) lens covers**, and that citation is held to the same evidence rule as any RSVP signal — an un-anchored "I'm exceptional" claim is **demoted/refused**, exactly as `I8`/`D5` demote un-anchored signals. **No one approves it** (self-selection preserved — consistent with the rejection of pins/mandates); the bar is the *articulated, anchored* reason, and the US3 side-note flags every exceptional seat so abuse is visible.
- Q: Cooper's G3 framed this as "a modest lens loses its seat." → A (operator): **reframed — it is not modesty, it is value not articulated clearly.** A lens that cannot cite an uncovered delta has not *demonstrated* value; not seating it is the bar working, not a wrongful exclusion. G3 therefore collapses into the same evidence-bar fix (and the "exclusion" worry dissolves: the door is open to *articulated* value).
- Q: G2 — editing a rule's canonical home leaves stale restatements of cap-5 / `net≥+2` in 3–4 other canon docs. → A: incorporation MUST **reconcile every restatement** of a changed rule (update the home, demote the others to citations per Principle I). Recorded as a plan/tasks obligation (FR-016).

### Session 2026-06-17 (Gate C — implementation review)

- Q: The board-scaled threshold lives in `GATE-PRIMITIVE.md` Stage 4 — which the **base round** (`SKILL.md` Phases 1/2/4, *uncapped*) also runs, not just the SDLC gates. Does US2's reach extend there? → A: **Yes, intentionally.** The threshold scales **wherever the gate primitive tallies** — base round and SDLC gates alike — because the base round is itself uncapped and so is exactly the "wide board" US2 protects. Backward-compatibility holds **only at `N=4`** (SC-004); any panel with `N≠4` (a wide base round, or an SDLC board widened by exceptional entry) tallies under the scaled `T`. This is the correct single-home placement (Principle I); the note records that US2's reach is the whole primitive, not only exceptional-entry boards. (Gate C finding `«base-round-reach»`, non-gating.)

### Session 2026-06-17 (post-Gate-C — Goldratt carve-out replacement)

- Q: Does exceptional entry **replace** the hard-coded "scope/deferral lens (Goldratt) is never out-seated on a new buildout" carve-out (`SDLC-LAYER.md` Mandate guardrail + S3)? → A: **Yes — execute the replacement** (the round-1 intent, finally folded in). The carve-out existed because the *cap* could force the scope lens out (issue #6); uncapped exceptional entry removes that root cause for every lens. The scope/deferral lens now **secures its seat by exceptional entry** — a new buildout always presents an uncovered *scope/deferral delta* (the cut), so it cites that and, being uncapped, is never out-seated — the same evidence-gated path any lens uses (no bespoke mandate; consistent with "no mandates / value must be articulated"). The issue-#6 safety concern is met by a **new flag-only side-note regime** (US3): a *new-buildout gate seated without the scope/deferral lens* is surfaced to the operator — flag, never auto-seat. This retires a special-case (Principle I-friendly) and unifies must-seat under the feature's two mechanisms (evidence-gated entry + flag-only side-note). Edits: `SDLC-LAYER.md` Mandate guardrail + S3; `INTEGRATION-LAYER.md` side-note regimes; FR-002c + FR-012 below.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capped board + uncapped exceptional entry (Priority: P1)

Today a persona answers RSVP with `JOIN` or `ABSTAIN` (SKILL.md Phase 0.5) and the lifecycle gate caps a seated board at five (SDLC-LAYER.md seating rule). This story keeps the **5-seat cap on ordinary JOIN seating** and adds one path through it: a lens may enter *beyond* the cap via an **exceptional-reasoning entry**. Exceptional entries are **additive and uncapped** but expected to be **rare**. Entry buys a **voice, never extra vote weight**.

The bar is **evidence, not an adjudicator** (cycle-1 resolution): an exceptional entry MUST cite a **concrete round-specific delta that no seated ordinary lens covers**, and that citation is held to the same evidence rule as any RSVP signal — an un-anchored "I am exceptional" claim is refused, exactly as `I8`/`D5` demote un-anchored signals. No actor *approves* the entry (self-selection is preserved — no pin, no mandate); the bar is simply that the value be *articulated and anchored*. This reframes the apparent "a modest lens loses its seat" objection: a lens that cannot cite an uncovered delta has not **articulated** value, and not seating it is the bar working, not a wrongful exclusion. The door is open to articulated value; the cap keeps boards small and legible without truly excluding a lens that can make a real, cited case.

**Why this priority**: Foundational. The seating rule defines board composition; US2 (dilution) and US3 (side-notes) are consequences of boards that can occasionally exceed five. Nothing else is testable until seating exists.

**Independent Test**: Run the RSVP/seating step where (a) ≤5 JOIN, 0 exceptional → board = the joiners; (b) 7 JOIN, 0 exceptional → exactly 5 by the existing tie-break; (c) 5 JOIN + 2 exceptional → board = 7, ledger marks the 2 exceptional seats and their cited reasons. Verifiable from the seating ledger alone.

**Acceptance Scenarios**:

1. **Given** ≤5 personas answer `JOIN` and none make an exceptional entry, **When** the board is seated, **Then** all are seated and board size ≤ 5 (cap not breached).
2. **Given** 7 personas answer ordinary `JOIN` and none make an exceptional entry, **When** the board is seated, **Then** exactly 5 are seated by the existing (applicability, then expected-stakes) tie-break and the rest are recorded as not seated.
3. **Given** 5 ordinary `JOIN` plus 2 exceptional entries, **When** the board is seated, **Then** all 7 are seated (5 ordinary + 2 additive exceptional) and the ledger records which 2 are exceptional and the cited reasoning for each.
4. **Given** a lens out-seated by the cap that then makes an exceptional entry **citing a concrete uncovered delta**, **When** the board is seated, **Then** it is seated as an exceptional entry — demonstrating the cap never *truly* excludes articulated value.
5. **Given** an exceptional entrant casts a vote in a later stage, **When** the tally runs, **Then** its vote counts exactly as any ordinary seat's — entry confers a voice, **not** extra weight (no protected/veto behavior).
6. **Given** an exceptional entry whose cited reason names **no uncovered delta** (an un-anchored "I'm exceptional" claim), **When** seating is evaluated, **Then** the entry is **refused** (not seated as exceptional), exactly as `I8`/`D5` demote un-anchored signals — the bar is articulated, anchored value, with no adjudicator.
7. **Given** two exceptional entries citing the **same** delta, **When** seating is evaluated, **Then** at most the one with the stronger anchor is seated exceptional — distinct entries require distinct uncovered deltas, which self-limits board-packing.

---

### User Story 2 - Board-scaled promotion threshold (vote dilution) (Priority: P2)

The canon escalates a finding's severity by one level when `net = PRIORITIZE − OVER-RATE ≥ +2` among non-author voters (GATE-PRIMITIVE.md Stage 4 — Tally). That fixed `+2` was calibrated for a full five-seat board (4 non-author voters). When an exceptional entry (US1) widens the voter pool `N`, a fixed threshold over-escalates — a 2-vote faction promotes regardless of how many are in the room. This story scales the escalation/demotion threshold with the **non-author voter count** `N` so a wider board demands proportionally more agreement, keeping promotion honest on the rare wide board.

**Why this priority**: Depends on US1 (boards can exceed five via exceptional entry). It is the cure for the over-escalation that uncapped entry introduces — load-bearing the moment exceptional entry exists, not speculative.

**Independent Test**: With a frozen vote fixture, vary only `N` (= seated board − the finding's author) and confirm the required threshold matches `T = floor(N/2)` (N 3→1, 4→2, 5→2, 6→3, 7→3, 8→4) and that a finding promotes iff `net ≥ T`. Verifiable from the tally output alone.

**Acceptance Scenarios**:

1. **Given** a full board of 5 (`N` = 4 non-author voters) with net = +2, **When** the tally runs, **Then** the finding escalates one level (`T = floor(4/2) = 2`) — identical to today's canon, so the change is backward-compatible at the standard board.
2. **Given** a board of 7 (`N` = 6, widened by exceptional entries) with net = +2, **When** the tally runs, **Then** the finding does **not** escalate (`T = floor(6/2) = 3`, `+2 < 3`).
3. **Given** a board of 7 (`N` = 6) with net = +3, **When** the tally runs, **Then** the finding escalates one level.
4. **Given** a board of 9 (`N` = 8) with net = +4, **When** the tally runs, **Then** it escalates; with net = +3 it holds.
5. **Given** demotion (net ≤ −T), **When** the tally runs, **Then** the same scaled magnitude governs demotion symmetrically (`N` = 6 demotes at net ≤ −3).

---

### User Story 3 - Conductor procedural side-notes (safety net) (Priority: P3)

The seating and dilution changes open edge regimes a purely-arithmetic tally cannot self-flag: a board widened past five by exceptional entry, a finding escalated at the exact threshold boundary, or a high-convergence verdict among personas who all read the same brief. This story gives the Dijkstra-voiced integration layer (the conductor — `INTEGRATION-LAYER.md`) a **non-binding side-note**: a dry marginal observation, recorded in the gate ledger and routed to the operator (the decision owner), that names a risk regime the procedure has entered. Side-notes are a **human-catch safety net beside the tally** — they **never change severity** (that stays arithmetic, constitution Principle III). This is exactly the "dry marginal note" the integration-layer canon already grants the conductor, here made a declared safety net.

**Why this priority**: A refinement on US1+US2. The chorus is sound without it; it adds a safety net for the edge regimes the other two stories open.

**Independent Test**: Run a gate fixture that enters each declared risk regime and confirm a side-note is emitted (recorded in the ledger, routed to the operator); run a fixture in no risk regime and confirm none is emitted; confirm post-tally severities are byte-identical with and without the side-notes (they never move severity).

**Acceptance Scenarios**:

1. **Given** a board widened to 6 by an exceptional entry, **When** the gate completes, **Then** the conductor emits a side-note naming the exceptional seat; it is recorded and routed to the operator; no severity changes.
2. **Given** a finding that escalates at the exact threshold boundary (`net == T`), **When** the tally completes, **Then** a side-note flags the marginal promotion; the severity stands unchanged by the note.
3. **Given** a finding carried by unanimous agreement among personas who read the same round brief, **When** the gate completes, **Then** a side-note files the canon caution that "a unanimous vote of people who read the same brief is one datum, not five."
4. **Given** a gate that enters no declared risk regime, **When** it completes, **Then** no side-note is emitted (the mechanism is quiet unless a regime is entered).

**Out of scope (deferred to a separate spec):** making a side-note *do more* than flag — e.g. holding or gating a marginal escalation on a side-note's strength. Per constitution Principle IX, the gating version waits for a validated need; this story ships the flag-only safety net.

---

### Edge Cases

- **Exceptional entry beyond a reasonable bound.** Exceptional entries are additive and uncapped by rule, but self-limited by the evidence bar (FR-002a/b): each must cite a *distinct uncovered delta*, so a board can only widen as far as there are genuine uncovered deltas to cite. An unusually high count is still a risk regime the conductor side-notes (US3), not a hard error; the board never exceeds the roster size.
- **Un-anchored exceptional claim.** An entry asserting exceptionality without naming an uncovered delta is refused (FR-002a) — the same demotion the canon applies to any un-anchored signal (`I8`/`D5`). There is no adjudicator; the citation either anchors or it doesn't.
- **Odd vs. even voter count and floor().** `floor(N/2)` shares thresholds across consecutive `N` (N=6 and 7 both → 3); the spec must not round odd `N` up.
- **Voter count below 4.** Under reduced quorum a finding may have `N` = 2 or 3 → `T` = 1. At `N` ≤ 1, `T` = 0 — any single net would promote; the spec sets a floor of `T ≥ 1` for any finding that is voted on at all (a tally never runs at `N` < 2), closing the one-voter-promotes footgun rather than deferring it.
- **Net exactly at the threshold boundary.** `net == T` → promotes; `net == T − 1` → holds (comparison is `≥`, never `>`), preserving the canon's "no tally ties" property. This boundary is a declared side-note regime (US3 scenario 2).
- **Exceptional entry confers no vote weight.** An exceptional entrant's PRIORITIZE/CONFIRM/OVER-RATE counts exactly as an ordinary seat's — there is no protected/veto behavior anywhere in v2.

## Requirements *(mandatory)*

<!-- Per Constitution Principle I, requirements cite the canon mechanic rather than restating it. -->

### Functional Requirements

#### RSVP & seating (US1)

- **FR-001**: The seating rule MUST keep the hard cap of **5 ordinary (JOIN) seats** per board (SDLC-LAYER.md seating rule); when ordinary joiners exceed five, the existing (applicability, then expected-stakes) tie-break selects the five.
- **FR-002**: RSVP MUST accept an **exceptional-reasoning entry** — a JOIN variant that cites a **concrete round-specific delta no seated ordinary lens covers**. Exceptional entries are **additive to** and **exempt from** the 5-seat ordinary cap, and are expected to be rare. The board MUST NOT exceed the roster size.
- **FR-002a** *(the bar — evidence, not an adjudicator)*: An exceptional entry's cited delta MUST satisfy the same evidence rule as any RSVP signal (`I8`/`D5`): an entry that names **no uncovered delta** (an un-anchored "I'm exceptional" claim) is **refused** — not seated as exceptional. **No actor approves** the entry (self-selection preserved — no operator-pin, no mandate); the bar is the articulated, anchored reason itself. A lens that cannot articulate an uncovered delta has not demonstrated value, and not seating it is the bar functioning, not a wrongful exclusion.
- **FR-002b** *(self-limiting)*: Distinct exceptional entries MUST cite **distinct** uncovered deltas; duplicate-delta claims do not each earn a seat. This bounds board-packing without an adjudicator.
- **FR-002c** *(subsumes the scope-lens carve-out)*: The exceptional-entry path MUST **replace** the former hard rule "the scope/deferral lens is never out-seated on a new buildout" (`SDLC-LAYER.md` Mandate guardrail + S3). The scope/deferral lens seats by **exceptional entry** — a new buildout always presents an uncovered scope/deferral delta (the cut), which it cites like any lens; being uncapped, it is never out-seated. No bespoke mandate remains. (The issue-#6 safety concern is carried by the side-note regime in FR-012.)
- **FR-003**: An exceptional entry MUST confer a **seat (voice) only** — its vote in any later stage counts exactly as an ordinary seat's. No seat, exceptional or otherwise, carries protected, weighted, or veto voting power (the v1 protected-vote mechanism is removed).
- **FR-004**: The seated board size MUST equal `min(roster_size, min(5, |ordinary JOIN|) + |exceptional entries|)`.
- **FR-005**: The seating ledger MUST record, per seated persona, whether the seat is ordinary or exceptional, and for each exceptional seat the **cited reasoning**, so downstream rules (US2/US3) and any audit are reconstructable.

#### Board-scaled promotion (US2)

- **FR-006**: Severity escalation MUST use a voter-scaled threshold `T = floor(N / 2)` in place of the canon's fixed `+2`, where `N` is the count of **non-author voters** on the finding (GATE-PRIMITIVE.md S8 — the author never votes on its own finding); `N = board_size − 1` for a finding authored by a seated persona.
- **FR-007**: A finding MUST escalate one severity level (🟢→🟡→🔴, capped at 🔴) iff `net ≥ T`, where `net = PRIORITIZE − OVER-RATE` among non-author voters (CONFIRM excluded, per GATE-PRIMITIVE.md).
- **FR-008**: A finding MUST demote one severity level (🔴→🟡→🟢, 🟢→drop) iff `net ≤ −T`, preserving symmetric demotion.
- **FR-009**: On the standard board of 5 (`N` = 4) the rule MUST reduce exactly to the canon (`T = 2`), so gate behavior and the gating definition (gating iff post-tally severity is 🔴) are unchanged at the size the canon was calibrated for.
- **FR-010**: The threshold MUST be `T = floor(N/2)` with a floor of **`T ≥ 1`** for any voted finding (`N` 2→1, 3→1, 4→2, 5→2, 6→3, 7→3, 8→4); a tally MUST NOT run at `N` < 2. This supersedes the prompt's original board-indexed table.
- **FR-011**: The tally MUST remain arithmetic-only — identical votes and identical `N` always yield identical severities, no orchestrator judgment added (GATE-PRIMITIVE.md "no tally ties"; SKILL.md S9). No seat's vote is re-weighted.

#### Conductor side-notes (US3)

- **FR-012**: The integration layer MUST emit a **non-binding side-note** when the gate enters a declared risk regime: (a) the board was widened past the ordinary cap by an exceptional entry; (b) a finding escalated or demoted at the exact threshold boundary (`|net| == T`); (c) a finding is carried by unanimous agreement among same-brief voters; (d) a **new-buildout gate is seated without the scope/deferral lens** (the flag-only safety net that replaces the former hard carve-out, FR-002c). The set of regimes is declared (not orchestrator-inferred per finding).
- **FR-013**: Each side-note MUST be recorded in the gate ledger and routed to the operator (the decision owner). A side-note is the conductor's own dry marginal observation in its Dijkstra register (`INTEGRATION-LAYER.md`), not a persona finding and not a vote.
- **FR-014**: A side-note MUST NOT alter any finding's severity, gating status, or the tally — post-tally severities MUST be byte-identical with and without side-notes (Principle III).
- **FR-015**: Side-notes in this feature are **flag-only**. Any behavior where a side-note *holds, gates, or otherwise changes* an outcome is **out of scope** and deferred to a separate spec (constitution Principle IX); this spec MUST NOT implement it.

#### Canon hygiene (G2)

- **FR-016**: Incorporation MUST **reconcile every restatement** of a rule it changes. The seating cap and the tally threshold are currently echoed across multiple canon docs (e.g. `net ≥ +2` in `SKILL.md` and worked examples as well as `GATE-PRIMITIVE.md`); when this feature edits a rule's canonical home, all other occurrences MUST be updated to **cite** the home (not restate it), per constitution Principle I — so the edit cannot leave the canon self-contradicting. This is a plan/tasks obligation and a conformance check (no stale restatement of a changed rule remains).

### Key Entities *(include if feature involves data)*

- **RSVP answer**: `JOIN`, `ABSTAIN`, or **exceptional entry** (a JOIN variant citing a concrete uncovered delta; un-anchored claims refused, FR-002a). No "ABSOLUTE/protected" tier.
- **Board**: ordinary seats (≤5, cap-governed) + exceptional seats (additive, uncapped, rare, bounded by roster size).
- **Voter count (`N`)**: non-author voters on a finding, `= board_size − 1` for a seated author; drives the threshold; floored so a tally needs `N ≥ 2`.
- **Vote**: a non-author persona's `PRIORITIZE` / `CONFIRM` / `OVER-RATE` (GATE-PRIMITIVE.md). All votes are equal-weight — no protected flag.
- **Threshold (T)**: `floor(N / 2)`, `T ≥ 1`; the `net` magnitude to escalate/demote.
- **Side-note**: a non-binding conductor marginal observation, recorded in the ledger and routed to the operator; never alters severity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With ≤5 ordinary joiners and zero exceptional entries, the seated board is byte-identical to today's behavior (the feature is inert absent exceptional entry).
- **SC-002**: The seated board size equals `min(roster, min(5,|JOIN|) + |exceptional|)` across a conformance fixture covering ordinary-only, exceptional-only, and mixed cases; no ordinary seat exceeds 5; exceptional seats and their cited reasons are recorded.
- **SC-003**: The escalation/demotion threshold equals `max(1, floor(N/2))` for every non-author voter count `N` from 2 to 8 in a frozen-vote fixture (N 2→1, 3→1, 4→2, 5→2, 6→3, 7→3, 8→4).
- **SC-004**: On the standard board of 5 (`N` = 4), every finding in a regression fixture receives the identical post-tally severity it received under the pre-feature canon (backward compatibility; falsified by any single divergent severity).
- **SC-005**: On a board of 7 (`N` = 6), a finding with net = +2 holds and the same finding with net = +3 escalates (falsified if net = +2 promotes at `N` = 6).
- **SC-006**: The seating ledger and tally are reconstructable end-to-end: from the recorded RSVP answers (incl. exceptional flags + reasons) and votes, an independent reader rederives board composition, `N`, `T`, and each finding's final severity, with no orchestrator-supplied values beyond formatting.
- **SC-007**: Side-notes fire iff a declared risk regime is entered (one fixture per regime emits exactly one note recorded + routed to the operator; a no-regime fixture emits none), AND post-tally severities are byte-identical with side-notes enabled vs. disabled (a side-note never moves severity).
- **SC-008** *(the exceptional bar — G3/G4/G7)*: In a seating fixture, an exceptional entry that cites a concrete uncovered delta is seated; one that cites no uncovered delta (un-anchored) is **refused**; and two entries citing the same delta yield at most one exceptional seat — all decided by the cited evidence with **no adjudicator** in the loop (falsified if an un-anchored claim is seated, or if seating requires an approver).
- **SC-009** *(canon hygiene — G2)*: After incorporation, no canon doc restates a rule this feature changed except its single canonical home; every other occurrence cites the home (falsified by any doc still asserting `net ≥ +2` or a standalone cap-5 definition outside its home).

## Assumptions

- **"Board" vs. "roster" follow the canon's distinction** (SKILL.md): roster = the full persona set (default nine); board = the personas seated this round.
- **The cap of 5 governs ordinary (JOIN) seats**; exceptional entries are additive and uncapped but rare. The cap never truly excludes because exceptional entry is always available. (Confirmed in Clarifications.)
- **Exceptional entry is self-selected, gated by an evidence bar, not an adjudicator** — it must cite a concrete uncovered delta (FR-002a); un-anchored claims are refused. Not an operator-pin and not a codified mandatory-seating rule (those were rejected as limiting self-selection). "Value not articulated clearly" is correctly not seated — that is the bar working, not exclusion.
- **`floor()` over the non-author voter count `N`** is the threshold rule (`N = board_size − 1`), floored at `T ≥ 1`; the prompt's board-indexed table is superseded.
- **Severity stays arithmetic (Principle III)** — no seat carries weighted/protected/veto votes; side-notes never alter the tally.
- **This feature modifies the canon** (`GATE-PRIMITIVE.md` tally, `SDLC-LAYER.md` seating, `SKILL.md` RSVP, `INTEGRATION-LAYER.md` for the side-note) — each new rule gets a **single canonical home** (Principle I): seating in SDLC-LAYER, threshold in GATE-PRIMITIVE Stage 4, the side-note in INTEGRATION-LAYER. The feature's `quickstart.md` conformance stanzas are the first-class verification surface (Principle V).

## Dependencies

- Builds on the RSVP/seating step (SKILL.md Phase 0.5), the cap-5 lifecycle seating (SDLC-LAYER.md), the four-stage gate primitive's vote/tally (GATE-PRIMITIVE.md), and the conductor's marginal-note posture (INTEGRATION-LAYER.md).
- Related prior work: feature 009 (confirm-vote-tally) established the vote/tally surface this feature scales.
- **Forward dependency:** a **future spec** carries the gating ("do more") version of side-notes, deferred from US3 here.
