# Feature Specification: Chorus `challenge` — a premise pass in Gate A

**Feature Branch**: `013-premise-challenge`

**Created**: 2026-06-18

**Status**: Draft (v2 — reframed after Gate A: a Gate-A premise pass, not a separate default-on phase)

**Input**: User description: "/chorus:challenge skill to grill the spec's premise. Also plug it to the full sdlc layer as a starting phase. Current Gate A mostly looks like a verification/discovery validation … it mostly assists in design development, not diverges from the frame that was given as an input."

> **v2 note.** v1 specced a *separate, default-on, every-feature* premise-challenge phase. Its own Gate A (ledger `agent-sdlc-log.md`) returned 9 gating 🔴 whose dominant verdict was: the divergence is reachable by **re-briefing Gate A** (which that gate itself demonstrated — it challenged the premise because it was briefed to), so a separate default-on phase is unearned; and the premise-vs-design classification belongs in the **vote stage**, not a conformance stanza. Operator decision: **reframe (option A)** — deliver the charter as a **premise pass inside Gate A**, keep the divergence guarantee + honest-null, move classification to the vote, add an out-of-distribution check. This v2 is markedly leaner: no new phase, no new mechanic, no new canonical home.

## Motivation (evidence)

A refreshed performance survey of the chorus (`chorus-and-repo-stats-v2.md`, 2026-06-17; ~975 findings across ~71 review events):

- **~69% of findings develop the design *within* the given frame** — requirements-discovery (32%), bug-finding (21%), inconsistency-fixing (16%).
- The two categories that **diverge from the frame** — reframes (9%) and descopes (8%) — are a thin **~17% tail**; pure validations/sign-offs (15%) land only **4%**.
- §4d: **AI-reviewing-AI is circular unless it diverges from the input.** The review stays honest only if a lens actually attacks the *premise*, not just polishes the design as framed.

Gate A reads as verification/discovery validation: it assumes the premise and helps build it well. Nothing in it is *chartered to ask whether the premise is right*. This feature adds that charter **to Gate A itself** — a premise pass that runs first, diverges from the frame, and is kept honest by an out-of-distribution check.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gate A runs a premise pass first (Priority: P1)

Gate A gains a **premise pass** that runs **before** its within-frame design review: the seated panel is briefed to adversarially attack the spec's *premise* — the stated problem, its necessity now, the chosen framing, and the load-bearing assumptions — and to **steelman the null or a named alternative** (don't-build / build-X-instead). Premise findings are **tagged** as premise-scoped and surface first; the operator sees the divergence (if any) before design discussion proceeds. This is a **re-brief of Gate A**, not a new pipeline phase: same gate, same primitive, an added pass and tag.

**Why this priority**: This is the feature. It moves the missing divergence to where the stats say it's absent (Gate A) at the moment it's cheapest (before design is elaborated), without buying a separate default-on phase.

**Independent Test**: Run Gate A on a feature whose premise is shaky (e.g., one that manufactures its own downstream problem). Confirm the premise pass runs first, surfaces ≥1 premise-tagged finding with a steelman, and the premise outcome is visible to the operator before the within-frame findings.

**Acceptance Scenarios**:

1. **Given** a spec entering Gate A, **When** the gate runs, **Then** the premise pass executes first and premise findings are tagged premise-scoped in the ledger, ahead of within-frame findings.
2. **Given** a spec whose problem rests on an unvalidated assumption, **When** the premise pass runs, **Then** ≥1 premise finding names the assumption and offers a steelman/reframe/cheapest-test, and it enters the tally as a premise-scoped finding.
3. **Given** a premise finding that tallies to 🔴, **When** the gate completes, **Then** it surfaces to the operator as a **premise-level block** (the operator reframes the spec, proceeds with a recorded override, or stops) — self-unblocking, operator-owned, never an auto-kill.
4. **Given** a genuinely sound premise, **When** the premise pass runs, **Then** it records an **honest-null** — the enumerated attacks attempted (each tied to a lens + steelman) — not a bare sign-off, and Gate A proceeds to its within-frame review.

---

### User Story 2 - `chorus challenge` on demand (standalone) (Priority: P2)

The operator can invoke the premise pass **directly** on any spec, design note, or raw idea — `chorus challenge <target>` — outside a full Gate A, to grill a premise early (often before a spec exists). Same brief, same tagging, same honest-null; a thin standalone invocation of the Gate-A premise-pass charter.

**Why this priority**: Divergence is cheapest at the idea stage. A standalone invocation pressure-tests a premise before any design or spec is committed.

**Acceptance Scenarios**:

1. **Given** a raw premise (a paragraph, not a spec), **When** the operator runs `chorus challenge`, **Then** it returns premise-tagged findings + an honest-null/verdict, writing a durable artifact, with no feature directory required.
2. **Given** a full spec, **When** the operator runs `chorus challenge <spec>`, **Then** it grills the premise identically to Gate A's premise pass.

---

### User Story 3 - The divergence guarantee (Priority: P1)

The premise pass MUST NOT collapse into the within-frame design help the chorus defaults to. Three mechanisms, all moved out of v1's untestable conformance-stanza approach:

1. **Classification in the vote, not a stanza.** Whether a finding is *premise-scoped* (attacks problem/necessity/framing/assumption) or *within-frame* (improves the design as framed) is **declared by the authoring persona and confirmed in the vote stage** — the personas have authority over scope, exactly as they have authority over severity (`GATE-PRIMITIVE.md` S8/S9). A within-frame finding is **parked for the design review**, not discarded, and does not count as premise divergence. No text-matching stanza tries to read intent.
2. **Honest-null with substance.** When no genuine premise objection lands, the pass records an honest-null whose every "what we tried" entry carries a **lens + a steelman/reframe/doubt** (the same evidence shape as a real finding) — a boilerplate three-liner does not satisfy it. A pass in which the panel never attacked the premise is a **failed pass**, re-run, not a `sound`.
3. **Out-of-distribution check.** Because the challenger panel shares the spec author's training distribution (§4d), same-model steelmanning can only relocate the blind spot. The premise pass MUST apply a **fixed, author-independent red-team checklist** (markdown-native, prior-free — e.g. "is the problem observed or forecast? is this a symptom or root cause? does the feature manufacture its own need? what's the cheapest experiment instead?") whose items do not depend on the panel's priors, as a divergence floor beneath the persona attacks.

**Independent Test**: On a frozen fixture, confirm: a within-frame finding is parked (vote-classified) and excluded from premise divergence; the honest-null record's entries each carry a lens+steelman; the red-team checklist items are applied and recorded; and a sound-premise run still emits a non-empty, substantive "what we tried".

**Acceptance Scenarios**:

1. **Given** a finding a persona authors as a design improvement, **When** the vote classifies scope, **Then** it is parked for the within-frame review and does not count as premise divergence.
2. **Given** a premise pass, **When** it runs, **Then** the fixed red-team checklist is applied and each item's outcome is recorded (author-independent divergence floor).
3. **Given** no genuine premise objection, **When** the pass closes, **Then** the honest-null lists each attempted attack with a lens + steelman; a boilerplate/empty record fails the pass and triggers a re-run.

---

### Edge Cases

- **Premise sound, design weak.** Premise pass records honest-null; design issues flow into Gate A's within-frame review as normal. Distinct concerns, one gate.
- **Premise 🔴, operator proceeds.** Recorded override + rationale; Gate A continues (chair decides nothing; operator owns scope).
- **The pass produces only within-frame findings.** A failed pass *only if* the panel never attacked the premise (re-run); if it attacked and the premise held (incl. the red-team checklist clearing), that is a legitimate honest-null.
- **Same-model steelman is shallow.** The red-team checklist is the floor that doesn't depend on the panel's priors; if even the checklist surfaces nothing, the honest-null records that the checklist was applied and cleared.
- **No spec yet (standalone).** US2 works on a raw premise; no feature directory needed.
- **No new mechanic.** The premise outcome is the **existing gate tally** over premise-tagged findings — there is no separate 3-band verdict, no 4-level→3-band mapping, and no new canonical doc (this dissolves v1's architecture reds).

## Requirements *(mandatory)*

<!-- Per Constitution Principle I, requirements cite the canon mechanic rather than restating it. -->

### Functional Requirements

#### The premise pass (US1) — a Gate-A re-brief

- **FR-001**: Gate A's brief (`SDLC-LAYER.md` gate mechanics) MUST gain a **premise pass** that runs **before** the within-frame design review: the seated panel is briefed to attack the premise (problem / necessity-now / framing / assumptions) and to **steelman the null or a named alternative** (`chorus-and-repo-stats-v2.md` §4d). It is an **added pass + brief**, not a new pipeline phase — the SDLC pipeline (spec → Gate A → tasks → Gate B → implement → Gate C) is otherwise unchanged.
- **FR-002**: The chorus MUST expose a **`challenge` mode** (a mode of the existing `chorus` skill — not a new skill) that invokes the premise-pass brief standalone on any target (spec / note / raw premise).
- **FR-003**: A premise finding MUST target a premise element and carry at least one of: a **steelman for not building**, a **reframe**, a **root-cause doubt**, or a **named unvalidated assumption + cheapest test**.

#### Divergence guarantee (US3)

- **FR-004**: Finding **scope** (premise-scoped vs within-frame) MUST be **declared by the author and confirmed in the vote stage** (`GATE-PRIMITIVE.md` S8/S9), not decided by a conformance stanza. A within-frame finding is **parked for the within-frame design review** and MUST NOT count as premise divergence.
- **FR-005**: The premise pass MUST apply a **fixed, author-independent red-team checklist** (prior-free premise questions) as a divergence floor beneath the persona attacks, and record each item's outcome — **lowering the §4d blind-spot floor** (a same-distribution panel cannot steelman past a shared blind spot; the checklist does not depend on the panel's priors, so it narrows — does not eliminate — the shared-blind-spot surface; cf. residual R1, plan).
- **FR-006**: A `sound`/honest-null outcome MUST record the enumerated attacks attempted, **each tied to a lens + a steelman/reframe/doubt** (substantive, not boilerplate) **and** the red-team checklist outcomes. A pass in which the panel did not genuinely attack the premise is a **failed pass**, re-run — never recorded as sound.

#### Outcome & composition

- **FR-007**: The premise outcome MUST be the **existing gate tally** (`GATE-PRIMITIVE.md` Stage 4) over premise-tagged findings — a premise finding that tallies to 🔴 is a **premise-level block**. There is **no new verdict mechanic, no severity→band mapping, and no new canonical doc** — the feature reuses Gate A's primitive and tag.
- **FR-008**: A premise-level 🔴 MUST be **operator-owned and self-unblocking** (`DECISION-PRIMITIVE.md`): it surfaces with the steelman; the operator reframes the spec, proceeds with a recorded override, or stops. It MUST NOT hard-block on its own (Principle II).
- **FR-009**: Gates B/C and the gate primitive's tally MUST be **byte-unchanged**; the only edits are Gate A's brief (the premise pass + scope tag), the `challenge` mode registration, and conformance stanzas. Markdown-only (Authoring Constraints).
- **FR-010**: The ledger MUST record, in order: the premise pass (RSVP, premise-tagged findings, red-team checklist outcomes, tally, honest-null), then the within-frame findings, then parked-from-premise findings — reconstructable end-to-end.

### Key Entities *(include if feature involves data)*

- **Premise** — the spec's frame: stated problem, necessity-now, framing/approach, load-bearing assumptions (distinct from *design*, which Gate A's within-frame review handles).
- **Premise pass** — the adversarial pass at the front of Gate A (and the standalone `challenge` mode) that attacks the premise.
- **Premise-tagged finding** — a finding the author declares and the vote confirms as premise-scoped; vs a **parked within-frame finding** routed to the design review.
- **Red-team checklist** — a fixed, author-independent set of prior-free premise questions; the divergence floor that does not share the panel's training distribution.
- **Honest-null** — the substantive record of attacks attempted (each lens + steelman) + checklist outcomes when the premise survives.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a Gate A run, the **premise pass executes before** the within-frame review and its premise-tagged findings appear first in the ledger (falsified if within-frame review precedes it).
- **SC-002**: Finding scope is set by **author declaration + vote**, not a stanza: on a fixture, a design-improvement finding is parked by the vote and excluded from premise divergence (falsified if a stanza/regex decides scope, or a within-frame finding counts as divergence).
- **SC-003**: The **fixed red-team checklist is applied and its item outcomes recorded** every premise pass (falsified by a pass with no checklist record).
- **SC-004**: A `sound` honest-null carries **substantive entries** (each a lens + steelman/reframe/doubt) + checklist outcomes; a boilerplate or empty record **fails** the pass and triggers a re-run (falsified by a bare `sound`).
- **SC-005**: The premise outcome is the **existing gate tally** over premise-tagged findings — no new verdict mechanic, mapping, or canonical doc is introduced (falsified by any new tally/band rule or a new CHALLENGE-LAYER doc).
- **SC-006**: A premise 🔴 **never hard-blocks** — the operator can proceed with a recorded override (falsified if the lifecycle halts with no operator path).
- **SC-007**: On a known shaky-premise fixture (a feature that manufactures its own downstream need), the premise pass surfaces a premise 🔴/reframe with a stated steelman — it **diverges from the frame** where the frame deserves it (falsified if it returns sound).
- **SC-008**: Gates B/C and the gate-primitive tally are **byte-unchanged**; only Gate A's brief, the mode registration, and conformance stanzas change (falsified by any edit to the tally or to Gates B/C).

## Assumptions

- **A Gate-A re-brief, not a new phase** (operator decision, option A): the divergence charter is added to Gate A's brief + a scope tag; the SDLC pipeline gains no node. This was the dominant Gate-A verdict on v1 (a separate default-on phase was unearned vs. a re-brief).
- **A mode of the chorus skill, not a new skill** (Authoring Constraints).
- **Classification lives in the vote** (personas own scope, as they own severity) — not a conformance stanza, which v1's Gate A judged unable to read authorial intent.
- **No new mechanic** — the premise outcome reuses the existing gate tally over premise-tagged findings; this deliberately drops v1's 3-band verdict, 4→3 mapping, and separate canonical home (the v1 architecture reds).
- **Out-of-distribution floor** — a fixed red-team checklist is the prior-free divergence floor beneath same-model persona attacks (§4d); the honest-null records it.
- **Default behavior** — the premise pass is part of every Gate A by default (it is a brief change, low marginal cost — no separate phase to schedule); the operator may still skip it with a recorded note like any gate step.

## Dependencies

- Edits `SDLC-LAYER.md` (Gate A brief: the premise pass + scope tag), `SKILL.md` (the `challenge` mode), and adds `quickstart.md` conformance stanzas. **Reuses** `GATE-PRIMITIVE.md` (tally + S8/S9 vote authority) and `DECISION-PRIMITIVE.md` (self-unblocking, operator-owned) **by citation** — no new mechanic, no restatement (Principle I).
- Motivating evidence: `chorus-and-repo-stats-v2.md` (within-frame/divergence split; §4d circularity).
- Provenance: this spec's own v1 Gate A (`agent-sdlc-log.md`) produced the reframe — the chorus challenged this feature's premise and the operator acted on it.
