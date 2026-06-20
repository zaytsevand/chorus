# Feature Specification: Human-Facing Relay — Verbatim Voice, Detail-Rich Findings

**Feature Branch**: `008-detail-rich-relay`

**Created**: 2026-06-12

**Status**: Draft (rev 3 — caveat cut; fan-out refinements folded; implemented in canon + quickstart)

**Input**: User description — "the integration layer should relay the concrete formulations
from each agent so we preserve each persona's unique voice and raise operator engagement;
and while we're here, a minority report from the orchestrator itself. Plus: rethink how
artifacts and findings from each agent are presented — the current formats lean heavily on
short identifiers and the output provides almost no detail."

## Context

The chorus produces a committed artifact at `docs/reviews/YYYY-MM-DD-chorus-review.md`. Its
human-facing surface today is built by the **integration layer** (the conductor), and it has
two recurring weaknesses the operator feels directly (a third concern — a named home for the
conductor's procedural dissent — was scoped out of this spec; see "Relationship to open
issues" and the cut note below):

1. **The conductor launders nine voices into one.** The Phase-2 **findings register**
   (`skill/chorus/SKILL.md`, Phase 2) carries a `Summary` column the integration layer
   writes itself — one ≤20-word sentence per finding, in the conductor's Dijkstra register.
   Nine distinct persona voices (Evans, Beck, Cooper, Goldratt, …) arrive as findings and
   leave as the same flat sentence. The canon already forbids the conductor from speaking in
   a persona's voice (`INTEGRATION-LAYER.md` — refusal "Speak in a persona's voice"; I6) and
   tells it to **re-read what a persona wrote rather than assume what it meant**
   (`INTEGRATION-LAYER.md`, the Conductor shtick). The `Summary` column quietly violates the
   spirit of both: it is the conductor restating a lens in its own words.

2. **The artifact is identifiers, not detail.** Findings are referenced as `F1`, `F2`,
   conflicts as `C1`, `C2`. The consolidation matrix is `[ID, severity, convergence count,
   lenses converged]` — pure identifiers and a number. The register's `Summary` is capped at
   20 words. An operator skimming the artifact sees `F7 🔴 (3 lenses)` and a one-liner, and
   must open the Round-1 report to learn what `F7` actually says, who said it, on what
   evidence, and why three lenses converged. The output is terse to the point of opacity.

This feature reworks the **human-facing presentation** of the artifact along two coupled
lines — verbatim voice and detail-rich findings — **without touching the procedure, the
tally, or the invariants.** A default run produces the **same severities and the same
gating** it produces today; only the artifact's legibility changes.

> **Cut note (rev 2).** An earlier draft carried a third line — a "Conductor's caveat": a
> named, optional artifact section for the conductor's procedure-only dissent (reduced
> quorum, convergence-on-agreement, the issue #13 inflation pattern). It was cut. An
> independent fan-out of all ten lenses landed every reservation on that story: the operator
> would read a procedure-only note next to a 🔴 as a soft verdict (Cooper, Norman); it
> palliates the #13 tally defect rather than fixing it and risks making the constraint
> *comfortable* therefore permanent (Goldratt); and a grammar litmus guards each sentence
> while the verdict rides in the *selection* of which findings get a caveat — judgment
> laundering (Security). The conductor's "dry marginal note" remains exactly where the canon
> already puts it (`INTEGRATION-LAYER.md`); it does not get a formalized home here.

### Relationship to open issues

- **Issue #9 (typed result-tail).** This is the *human-facing complement*, not a competitor.
  #9 adds a machine-read enum tail to drive control flow; this feature governs the
  *prose above that tail* — what the operator reads. They compose: when a result-tail
  exists, it supplies the provenance (finding id, lens, severity, convergence set) that the
  detail-rich presentation renders, and the verbatim quote is the prose the tail's
  `do not paraphrase above this line` boundary already protects. This spec does **not**
  depend on #9 landing first; it degrades to reading prose reports, exactly as the artifact
  does today.
- **Issue #13 (tally inflation: convergent agreement inflates 🟡 → 🔴).** **Out of scope.**
  An earlier draft tried to palliate #13 with a conductor's caveat that annotated the
  inflated 🔴 without re-grading; that story was cut (see the Cut note above). This spec no
  longer touches #13 in any form — it neither fixes nor annotates it. The real fix to #13
  remains its own spec; presentation is not the place to address a tally defect.

## Constitution check (Principle I — cite, never restate)

Every canon mechanic this feature touches is **cited, not redefined**:

- **I6** (`INTEGRATION-LAYER.md`) — the conductor never speaks for a lens it does not have.
  Verbatim relay *strengthens* I6: quoting with attribution is the opposite of speaking-for.
- **I9 / "the chair decides nothing"** (`INTEGRATION-LAYER.md`) — permitted first-person
  verbs are *halt, route, refuse, record, count.* This feature adds no sixth verb; relaying a
  persona's verbatim words is **record**, not judgment.
- **S8 / S9** (`skill/chorus/GATE-PRIMITIVE.md`) — author never grades self; the integration
  layer never synthesizes a vote or grade; severity is arithmetic over real votes. This
  feature renders that arithmetic; it never asserts or alters a severity.

No constitution clause and no invariant is amended by this feature. If any requirement below
appears to require an invariant change, that requirement is wrong, not the invariant.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verbatim voice relay replaces the conductor's paraphrase (Priority: P1)

An operator reads the findings register and hears **Beck and Evans, not Dijkstra ventriloquising
both.** Each finding's human-facing characterization is an **attributed, verbatim pull-quote
authored by the persona itself** — the persona's own one-line characterization of its finding —
relayed unedited by the integration layer. The conductor quotes; it does not reword.

**Why this priority**: This is the core of the request and the cheapest correct change: it
*removes* an authority the conductor should never have had (restating a lens) rather than
adding one. It is independently shippable and immediately visible to the operator.

**Independent Test**: Run a round (or replay a recorded one). Every finding's
characterization in the register is traceable, word-for-word, to a sentence the authoring
persona actually wrote; no characterization is phrased in the conductor's register; each
carries an explicit lens/persona attribution.

**Acceptance Scenarios**:

1. **Given** a persona authored a finding and **marked its own one-line pull-quote** in its
   report, **When** the integration layer builds the findings register, **Then** that
   finding's human-facing line is the marked pull-quote verbatim, attributed to the persona,
   not a conductor paraphrase and not a conductor-chosen excerpt.
2. **Given** a persona omitted to mark a pull-quote, **When** the integration layer assembles
   the entry, **Then** it routes the finding back to that persona to mark one — it never
   selects a span itself (conductor excerpting is restating-lite) and never paraphrases. If
   the persona cannot be re-reached, the entry records "no pull-quote supplied" and links the
   report; the conductor authors nothing.
3. **Given** a persona's pull-quote, **When** it is relayed, **Then** the persona marked
   **exactly one** short span as the pull-quote (the selection is the persona's, not the
   conductor's), and longer reasoning stays in the report, linked, not inlined.

---

### User Story 2 - Detail-rich findings, identifiers as anchors not as the whole story (Priority: P1)

An operator skimming the artifact understands **what a finding says, who said it, on what
evidence, and why lenses converged — without opening the Round-1 report.** Short identifiers
(`F1`, `C1`) remain as cross-reference anchors for traceability, but they are **never the
only representation** of a finding in a human-facing section. Convergence is shown as *which
lenses agreed and in whose words*, not merely a count.

**Why this priority**: The operator explicitly reported the output "provides almost no
detail" and "leans heavily on short identifiers." This is the legibility half of the request
and pairs with User Story 1 (voice) to make the artifact readable on its own.

**Independent Test**: Give the artifact to a reader who has not seen the Round-1 reports.
For any 🔴 or 🟡 finding, the reader can state the claim, its evidence locator, the authoring
lens, the severity and what moved it, and the converging lenses — using only the artifact.

**Acceptance Scenarios**:

1. **Given** a finding in the register, **When** the operator reads its entry, **Then** the
   entry surfaces at least: the authoring lens, the verbatim characterization (User Story 1),
   the evidence locator (`file:line` or the `[principle]`/`[principle:proposed]` tag), the
   final severity, and the convergence set as named lenses — not an ID and a number alone.
2. **Given** a convergent finding, **When** the operator reads it, **Then** the converging
   lenses are identified and each contributes its own short verbatim note, so "3 lenses
   converged" becomes legible as *which three and in what words*.
3. **Given** the detail-rich finding entries are the single human-facing source of truth,
   **When** the consolidation matrix is produced, **Then** the matrix is a **projection** of
   those entries (severity + convergence count, sorted) — derived from them, not a parallel
   table maintained by hand — and every identifier it uses resolves to its entry. No `Fn` is
   a dead-end reference, and severity appears authoritatively in exactly one place.
4. **Given** the top-5 ranking and any conflicts (`Cn`), **When** the operator reads them,
   **Then** each entry carries enough detail to be understood in place and traces back to its
   finding's detail-rich entry.

---

### Edge Cases

- **A persona marks no pull-quote.** Story 1 AS-2 governs: route back to that persona to
  mark one; the conductor never selects a span or paraphrases. If the persona cannot be
  re-reached, the entry records "no pull-quote supplied" and links the report — never a
  conductor-authored substitute.
- **A persona marks an over-long span.** The persona is asked to tighten its own pull-quote;
  the conductor does not trim it (trimming is conductor excerpting). The rest of the
  reasoning lives in the report, linked, not inlined.
- **Convergence with conflicting characterizations.** When converging lenses describe the
  same finding differently, each lens's verbatim note stands; the conductor does not
  reconcile them into one sentence (that would be synthesis).
- **A substituted/abstained lens.** Its absence is shown honestly (the artifact already
  surfaces abstentions); the detail-rich view marks substituted findings as such rather than
  presenting them as full persona findings.
- **Older artifacts without the new presentation.** The change is additive to the artifact
  format; prior committed artifacts remain valid baselines and parse unchanged.

## Requirements *(mandatory)*

### Functional Requirements

**Verbatim voice relay (User Story 1)**

- **FR-001**: The integration layer MUST present each finding's human-facing characterization
  as a verbatim span authored by the finding's persona, attributed to that persona/lens. It
  MUST NOT restate a finding in the conductor's own words. (Strengthens I6 and the
  "Speak in a persona's voice" refusal in `INTEGRATION-LAYER.md`.)
- **FR-002**: Each persona MUST **mark its own one-line pull-quote** (and the finding's
  evidence locator) in its report — the selection of which span represents the finding is the
  persona's, not the conductor's. The integration layer relays the marked span; it MUST NOT
  select, trim, or excerpt a span itself (conductor excerpting is restating-lite and re-opens
  the I6 wound). When a persona omits the mark, the layer routes back to that persona; it
  never substitutes its own selection or wording.
- **FR-003**: Exactly one short pull-quote per finding (the persona-marked span) is surfaced
  in the register-level view; longer persona reasoning is referenced (to the report), not
  inlined, preserving artifact economy (Dijkstra elegance — an artifact must not require its
  author standing beside it).

**Detail-rich presentation (User Story 2)**

- **FR-004**: Each human-facing finding entry MUST surface, at minimum: authoring lens, the
  verbatim characterization (FR-001), the evidence locator (`file:line` or the
  `[principle]`/`[principle:proposed]` tag per I8), the final severity, and the convergence
  set as **named lenses**. An identifier plus a count is not a sufficient entry.
- **FR-005**: Convergence MUST be rendered as which lenses converged and, for each, a short
  verbatim note (each converging persona marks its own agreement note, per FR-002's discipline)
  — replacing the bare "convergence count" as the *human-facing* convergence signal. The
  numeric count, if shown, is derived from this set (FR-007), not maintained separately.
- **FR-006**: Short identifiers (`Fn`, `Cn`) MUST be retained as cross-reference anchors and
  MUST resolve, within the same artifact, to a detail-rich entry. No human-facing identifier
  may be a dead-end reference.
- **FR-007**: The **detail-rich finding entry is the single human-facing source of truth** for
  a finding (severity, convergence set, locator, pull-quote). The consolidation matrix MUST be
  a **projection** of those entries (severity + convergence count, sorted for scoring) — derived,
  not a parallel hand-maintained table — so severity appears authoritatively in exactly one
  place and the two surfaces cannot drift. An operator who has not read the Round-1 reports
  MUST be able to understand any 🔴/🟡 finding from its entry alone.
- **FR-008**: The top-5 ranking and each conflict (`Cn`) MUST carry enough detail to be
  understood in place and MUST trace to the corresponding finding's detail-rich entry.

**Conformance & non-regression (cross-cutting)**

- **FR-009**: A default run MUST produce identical severities and identical gating to the
  current procedure. This feature changes *presentation*, never the tally, the stage
  separation, the quorum math, or any invariant.
- **FR-010**: The change MUST be additive to the artifact format: prior committed artifacts
  remain valid baselines and parse unchanged; absence of the new fields degrades to today's
  behavior.
- **FR-011**: A `quickstart.md` conformance check (Principle V) MUST define a **drift check**
  that any reviewer (or gate) can run **on every round**, not just a one-shot worked example:
  extract the severity + gating column from the round's artifact and assert it is unchanged by
  the presentation layer (a recorded baseline round re-rendered through the new format yields a
  byte-identical severity/gating set). The quickstart carries at least one worked example
  proving the check passes; the check is the durable surface, the example is its demonstration.

### Key Entities

- **Finding entry (human-facing)**: the **single source of truth** for one finding —
  identifier (anchor), authoring lens, persona-marked pull-quote, evidence locator, final
  severity, named convergence set with per-lens verbatim notes. The consolidation matrix is a
  projection of these entries, not a parallel record.
- **Verbatim pull-quote**: one short span of a persona's own words, **marked by that persona**,
  attributed, relayed unedited; the unit of voice preservation. The conductor relays it; it
  neither selects nor trims it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of human-facing finding characterizations are traceable word-for-word to a
  sentence the authoring persona wrote; 0% are phrased in the conductor's register.
- **SC-002**: A reader with no access to the Round-1 reports can, for every 🔴 and 🟡 finding,
  state the claim, evidence locator, authoring lens, final severity, and converging lenses
  using only the committed artifact (measured on the worked example: 100% of such findings).
- **SC-003**: Every human-facing short identifier (`Fn`, `Cn`) resolves to a detail-rich entry
  within the same artifact — 0 dead-end references.
- **SC-004**: The `quickstart.md` drift check (FR-011) passes on **every** recorded baseline
  round in the corpus — severity + gating byte-identical to the pre-change procedure on the
  same inputs, 0 rounds with drift — not merely on a single worked example.

## Assumptions

- The artifact remains a single committed Markdown document at
  `docs/reviews/YYYY-MM-DD-chorus-review.md`; this feature changes its presentation, not its
  location or its committed-baseline role.
- Personas can mark a one-line pull-quote + locator per finding in their report (their reports
  already carry a "required ending" / finding statement to mark); where they do not, FR-002's
  route-back governs. This per-finding mark is the same provenance the typed result-tail of
  issue #9 would carry — this feature does not mandate #9, but composes with it if present.
- "Detail-rich" is bounded by Dijkstra economy: enough that the artifact stands alone, not so
  much that it inlines whole reports. One pull-quote per finding plus structured fields, with
  deeper reasoning linked to the reports.
- No invariant, no constitution clause, and no element of the gate primitive's tally is
  modified. Severity and gating remain arithmetic over real votes (S9).
- The natural delivery vehicle is the agent-SDLC (Gates A/B/C); this spec is written to be
  gated through it, and is deliberately presentation-only so it cannot disturb the procedure
  it makes legible.
