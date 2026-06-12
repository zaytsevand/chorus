# Feature Specification: Human-Facing Relay — Verbatim Voice, Detail-Rich Findings, Conductor's Caveat

**Feature Branch**: `008-detail-rich-relay`

**Created**: 2026-06-12

**Status**: Draft

**Input**: User description — "the integration layer should relay the concrete formulations
from each agent so we preserve each persona's unique voice and raise operator engagement;
and while we're here, a minority report from the orchestrator itself. Plus: rethink how
artifacts and findings from each agent are presented — the current formats lean heavily on
short identifiers and the output provides almost no detail."

## Context

The chorus produces a committed artifact at `docs/reviews/YYYY-MM-DD-chorus-review.md`. Its
human-facing surface today is built by the **integration layer** (the conductor), and it has
two recurring weaknesses the operator feels directly:

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

3. **The conductor's one honest editorial signal has no home.** The conductor is already
   permitted exactly one editorial luxury — the **dry marginal note** ("a unanimous vote of
   people who read the same brief is one datum, not five"), filed as observation and routed
   to whoever owns the decision it implies (`INTEGRATION-LAYER.md`, the Conductor shtick).
   But there is no named place in the artifact for it, so a real procedural caveat — reduced
   quorum, convergence-on-agreement, the issue #13 inflation defect — is either dropped or
   smuggled into prose where it reads like a verdict.

This feature reworks the **human-facing presentation** of the artifact along three coupled
lines — verbatim voice, detail-rich findings, and a named procedural caveat — **without
touching the procedure, the tally, or the invariants.** A default run produces the **same
severities and the same gating** it produces today; only the artifact's legibility changes.

### Relationship to open issues

- **Issue #9 (typed result-tail).** This is the *human-facing complement*, not a competitor.
  #9 adds a machine-read enum tail to drive control flow; this feature governs the
  *prose above that tail* — what the operator reads. They compose: when a result-tail
  exists, it supplies the provenance (finding id, lens, severity, convergence set) that the
  detail-rich presentation renders, and the verbatim quote is the prose the tail's
  `do not paraphrase above this line` boundary already protects. This spec does **not**
  depend on #9 landing first; it degrades to reading prose reports, exactly as the artifact
  does today.
- **Issue #13 (tally inflation: convergent agreement inflates 🟡 → 🔴).** The conductor's
  caveat (User Story 3) is a **non-invasive palliative**, not a fix. The conductor may not
  re-grade an inflated finding (that is S9 — the tally is arithmetic over real votes), but it
  **may annotate** that a given 🔴 set was escalated by convergent PRIORITIZE *agreement*
  rather than an under-rated claim, and point the operator at defect #13. The severity is
  untouched; the operator simply sees the caveat next to it. The real fix to #13 remains its
  own spec.

> **Terminology.** This spec uses **caveat** (the conductor's procedural note), never
> *minority report*. "Minority report" implies a dissenting *verdict*, and the conductor
> holds no verdict to dissent with — I9, "the chair decides nothing," forbids it. The caveat
> is dissent about the **procedure's trustworthiness**, never about domain content.

## Constitution check (Principle I — cite, never restate)

Every canon mechanic this feature touches is **cited, not redefined**:

- **I6** (`INTEGRATION-LAYER.md`) — the conductor never speaks for a lens it does not have.
  Verbatim relay *strengthens* I6: quoting with attribution is the opposite of speaking-for.
- **I9 / "the chair decides nothing"** (`INTEGRATION-LAYER.md`) — permitted first-person
  verbs are *halt, route, refuse, record, count.* The caveat adds no sixth verb; it is a
  **recorded** observation about procedure state, never a judgment about a finding.
- **S8 / S9** (`skill/chorus/GATE-PRIMITIVE.md`) — author never grades self; the integration
  layer never synthesizes a vote or grade; severity is arithmetic over real votes. The caveat
  may **describe** how the tally arrived (e.g. "escalated by convergent PRIORITIZE"), reading
  the same arithmetic the tally recorded; it may never **assert or alter** a severity.

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

1. **Given** a persona authored a finding with a one-line characterization in its report,
   **When** the integration layer builds the findings register, **Then** that finding's
   human-facing line is the persona's sentence verbatim, attributed to the persona, not a
   conductor paraphrase.
2. **Given** a persona's report has no quotable one-line characterization, **When** the
   conductor would otherwise be tempted to paraphrase, **Then** it either quotes a verbatim
   span from the report **or** routes back to the persona for a one-line characterization —
   it never substitutes its own wording.
3. **Given** a finding's verbatim quote would exceed the artifact's economy, **When** the
   conductor relays it, **Then** exactly one short pull-quote per finding is surfaced (detail
   lives in the expanded view of User Story 2, not in an unbounded quote).

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
3. **Given** the consolidation matrix (the scoring surface), **When** the artifact is
   assembled, **Then** the matrix may stay terse for arithmetic, but every identifier it
   uses resolves to a detail-rich entry elsewhere in the same artifact — no `Fn` is a
   dead-end reference.
4. **Given** the top-5 ranking and any conflicts (`Cn`), **When** the operator reads them,
   **Then** each entry carries enough detail to be understood in place and traces back to its
   finding's detail-rich entry.

---

### User Story 3 - Conductor's caveat: a named home for procedural dissent (Priority: P2)

The conductor may register, **in its own Dijkstra voice**, an optional **caveat** about the
**procedure and the trustworthiness of the verdict** — never about domain content. The caveat
lives in a named, optional artifact section. It surfaces things the operator should weigh:
reduced quorum, convergence-on-agreement, an aborted or degraded gate, or the issue #13
inflation pattern.

**Why this priority**: It formalizes an editorial signal the canon already sanctions (the dry
marginal note) and gives issue #13 a non-invasive palliative. P2 because Stories 1–2 deliver
the bulk of the operator-facing value and this rides on the same artifact pass; it is
valuable but not the spine.

**Independent Test**: Run a round under a condition the caveat is meant to flag (e.g. reduced
quorum, or a 🔴 produced by convergent PRIORITIZE). The artifact carries a caveat section that
names the procedural concern, attributes it to the conductor, references the relevant
finding IDs and/or defect, and **never** asserts or contradicts a severity.

**Acceptance Scenarios**:

1. **Given** a round ran below full quorum, **When** the artifact is assembled, **Then** a
   caveat records the reduced quorum and what it degrades, attributed to the conductor as a
   procedural observation.
2. **Given** a 🔴 finding was escalated by convergent PRIORITIZE agreement (not an
   under-rated claim), **When** the caveat is written, **Then** it may note that pattern and
   reference defect #13, **without** changing the finding's severity and **without**
   asserting what the severity "should" be.
3. **Given** the conductor is composing a caveat, **When** any sentence would have subject
   "I" and verb *judge/decide/conclude/resolve/deem/choose* applied to domain content,
   **Then** that sentence is forbidden and the caveat is restricted to procedure-state verbs
   (*halt, route, refuse, record, count*) and the dry-marginal-note register.
4. **Given** a round with nothing procedurally notable, **When** the artifact is assembled,
   **Then** the caveat section is absent (it is optional, never a manufactured filler).

---

### Edge Cases

- **A persona writes no quotable line.** Story 1 AS-2 governs: quote a verbatim span or route
  for a one-liner; never paraphrase. If the persona cannot be re-reached, the entry records
  "no characterization supplied" rather than a conductor-authored substitute.
- **A verbatim quote is very long or rambling.** One short pull-quote is surfaced (Story 1
  AS-3); the rest of the persona's reasoning lives in its report, linked, not inlined.
- **Convergence with conflicting characterizations.** When converging lenses describe the
  same finding differently, each lens's verbatim note stands; the conductor does not
  reconcile them into one sentence (that would be synthesis).
- **The caveat is tempting to use as a back-door re-grade.** Story 3 AS-3 is the hard stop:
  any caveat sentence that asserts or contradicts a severity is forbidden by S9.
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
- **FR-002**: When no quotable one-line characterization exists in a persona's report, the
  integration layer MUST either quote a verbatim span from the report or route back to the
  persona for one — paraphrase is never a permitted third option.
- **FR-003**: Exactly one short pull-quote per finding is surfaced in the register-level view;
  longer persona reasoning is referenced (to the report), not inlined, preserving artifact
  economy (Dijkstra elegance — an artifact must not require its author standing beside it).

**Detail-rich presentation (User Story 2)**

- **FR-004**: Each human-facing finding entry MUST surface, at minimum: authoring lens, the
  verbatim characterization (FR-001), the evidence locator (`file:line` or the
  `[principle]`/`[principle:proposed]` tag per I8), the final severity, and the convergence
  set as **named lenses**. An identifier plus a count is not a sufficient entry.
- **FR-005**: Convergence MUST be rendered as which lenses converged and, for each, a short
  verbatim note — replacing the bare "convergence count" as the *human-facing* convergence
  signal. (The numeric count MAY remain in the scoring matrix.)
- **FR-006**: Short identifiers (`Fn`, `Cn`) MUST be retained as cross-reference anchors and
  MUST resolve, within the same artifact, to a detail-rich entry. No human-facing identifier
  may be a dead-end reference.
- **FR-007**: The consolidation matrix MAY remain terse as a scoring/arithmetic surface, but
  the artifact MUST also carry a detail-rich, reader-facing view of each finding such that an
  operator who has not read the Round-1 reports can understand any 🔴/🟡 finding from the
  artifact alone.
- **FR-008**: The top-5 ranking and each conflict (`Cn`) MUST carry enough detail to be
  understood in place and MUST trace to the corresponding finding's detail-rich entry.

**Conductor's caveat (User Story 3)**

- **FR-009**: The integration layer MAY append an **optional, named caveat section** to the
  artifact, attributed to the conductor, registering procedural dissent about the
  trustworthiness of the verdict (e.g. reduced quorum, convergence-on-agreement, degraded or
  aborted gates).
- **FR-010**: A caveat MUST be restricted to procedure state and the dry-marginal-note
  register. It MUST NOT assert, alter, or contradict any finding's severity, and MUST obey
  the grammatical litmus in `INTEGRATION-LAYER.md` (no first-person *judge/decide/conclude/
  resolve/deem/choose* over domain content). This preserves S9 and I9.
- **FR-011**: A caveat MAY reference specific finding IDs and known defects (notably defect
  #13: a 🔴 set escalated by convergent PRIORITIZE agreement rather than an under-rated claim)
  to make a procedural pattern legible, **without** re-grading.
- **FR-012**: The caveat section MUST be absent when nothing procedurally notable occurred; it
  is never manufactured filler (it remains an observation, not a required ritual).

**Conformance & non-regression (cross-cutting)**

- **FR-013**: A default run MUST produce identical severities and identical gating to the
  current procedure. This feature changes *presentation*, never the tally, the stage
  separation, the quorum math, or any invariant.
- **FR-014**: The change MUST be additive to the artifact format: prior committed artifacts
  remain valid baselines and parse unchanged; absence of the new fields degrades to today's
  behavior.
- **FR-015**: A `quickstart.md` conformance check (Principle V) MUST demonstrate, on a worked
  example, that the same round yields (a) identical severities/gating and (b) a detail-rich,
  verbatim-attributed artifact — proving presentation changed and decisions did not.

### Key Entities

- **Finding entry (human-facing)**: the reader-facing representation of one finding —
  identifier (anchor), authoring lens, verbatim characterization, evidence locator, final
  severity, named convergence set with per-lens verbatim notes. Distinct from the scoring
  matrix row, which may stay terse.
- **Verbatim pull-quote**: one short span of a persona's own words, attributed, relayed
  unedited; the unit of voice preservation.
- **Conductor's caveat**: an optional, attributed, procedure-only note about the verdict's
  trustworthiness; references finding IDs/defects but never a severity claim.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of human-facing finding characterizations are traceable word-for-word to a
  sentence the authoring persona wrote; 0% are phrased in the conductor's register.
- **SC-002**: A reader with no access to the Round-1 reports can, for every 🔴 and 🟡 finding,
  state the claim, evidence locator, authoring lens, final severity, and converging lenses
  using only the committed artifact (measured on the worked example: 100% of such findings).
- **SC-003**: Every human-facing short identifier (`Fn`, `Cn`) resolves to a detail-rich entry
  within the same artifact — 0 dead-end references.
- **SC-004**: Across a default run, severities and gating are **byte-identical** to the
  pre-change procedure on the same inputs (no decision drift attributable to presentation).
- **SC-005**: When a caveat is present, 100% of its sentences pass the grammatical litmus (no
  domain judgment) and 0 assert or contradict a severity.
- **SC-006**: A caveat is present in exactly the rounds with a procedural concern to record
  and absent otherwise (no manufactured caveats on clean rounds).

## Assumptions

- The artifact remains a single committed Markdown document at
  `docs/reviews/YYYY-MM-DD-chorus-review.md`; this feature changes its presentation, not its
  location or its committed-baseline role.
- Personas already produce a one-line characterization of each finding (their reports carry a
  "required ending" / finding statement); where they do not, FR-002 governs. This feature
  does not mandate the typed result-tail of issue #9, but composes with it if present.
- "Detail-rich" is bounded by Dijkstra economy: enough that the artifact stands alone, not so
  much that it inlines whole reports. One pull-quote per finding plus structured fields, with
  deeper reasoning linked to the reports.
- No invariant, no constitution clause, and no element of the gate primitive's tally is
  modified. Severity and gating remain arithmetic over real votes (S9).
- The natural delivery vehicle is the agent-SDLC (Gates A/B/C); this spec is written to be
  gated through it, and is deliberately presentation-only so it cannot disturb the procedure
  it makes legible.
