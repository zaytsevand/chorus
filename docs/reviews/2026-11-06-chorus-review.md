# Chorus review — 2026-11-06

- **Target**: docs/process-constants.md (branch worktree-process-constants, commit a6bf3af): (1) review the note's content; (2) find its home skill-wise — chorus-core canon, chorus-review, chorus-sdlc, persona agents, the project addendum, or stays a doc — and how lenses should cite it
- **Mode**: project-state review
- **Baseline**: docs/reviews/2026-10-29-chorus-review-pr47.json

**Round context.** Since PR #33 (7eea2c2): one new file docs/process-constants.md (commit a6bf3af) naming nine process constants C1-C9 (attention, working-memory slots, accountability, inter-person bandwidth, essential complexity, requirement uncertainty, reality-feedback latency, validation, Lehman change), a practice table tied to them, a derivatives table (Agile rituals, story points, CAB, etc.), and four implications for chorus. It deliberately avoids the word invariant to not clash with I1-I9 in skill/chorus-core/CONDUCTOR.md. Canon untouched; nothing references the note yet; docs/ is partly excluded by the addendum. Budgets: RSVP 3m, exploratory 15m, R1 15m, R2 10m.

**Bindings.** decision-sink: problem-brief · ruling-lookup: problem-brief · record-validator: chorus-core · record-renderer: chorus-core · arbiter: default · fixed-viewpoint: default · memory-recall: default

**Recovered without asking.** retry — mark-richards-architect (rsvp): (root): the reply is 84 words; the limit is 80; retry — alan-cooper-advisor (rsvp): (root): the reply is 84 words; the limit is 80; retry — security-and-trust-advisor (rsvp): (root): the reply is 83 words; the limit is 80

**Secret filter.** not run (No memory writes went through the conductor this round.).

## 1. TL;DR

Five seated lenses reviewed docs/process-constants.md and agreed it belongs in the shipped canon as an advisory reference, skill/chorus-core/PROCESS-CONSTANTS.md indexed in chorus-core's SKILL.md, because docs/ never reaches installed suites and CI skips docs/ citations; 20 graded findings and 6 ungraded derives, mostly on wording (imperatives that read as rules, 'validation' used in the opposite sense to CONDUCTOR.md, an overclaimed DORA line, missing tests-as-oracle row). The top five prioritize the review-mode sign-off contradiction with I9 (F6), moving the note to its shipped home (F1), keeping a C-id from standing alone as I8 evidence (F5), pointing the known-error advice at the existing baseline (F18), and aligning the meaning of 'validation' (F9). F6 is the only 🔴 and it gates: review mode lets the conductor fill sign-off while I9 names the operator, which is a pre-existing canon/code contradiction surfaced by this note rather than caused by it; two conflicts (C1 an FC check for C-ids now or later, C2 whether a C-id may be sole evidence) remain for the operator.

## 2. Roster (this round)

| Lens | Persona | Decision | Applies (cited deltas) | Expected stakes | Seat | Reason |
|---|---|---|---|---|---|---|
| DDD | eric-evans-advisor | JOIN | docs/process-constants.md: new C1-C9 vocabulary beside I1-I9, and ITIL terms (problem, incident, known error) entering the suite's language; Placement: which context owns the note, and what lenses cite when they quote it | 🟡-potential — process-constants.md tells lenses to name a constant and calls recurring findings problems, but nothing in canon defines either term | not seated | The note adds a citable term set and a placement question, and both are about language and context ownership. |
| architecture | mark-richards-architect | JOIN | home placement: canon vs doc vs addendum sets dependency direction; C1-C9 as a citation contract: duplicate-authority risk beside I1-I9 and ROSTER remits; fitness function so C-id citations resolve and cannot fork | 🟡-potential — 'What this means for chorus' states suite rules canon never references: two authors. | ordinary | Where the note lives and how lenses cite it decides coupling and rule ownership. |
| adversarial product | alan-cooper-advisor | JOIN | who reads the note, and how many; implication 3: per-finding constant citation as reader excise; implication 2: operator closes validation, real or rubber-stamp; home choice decides whether anyone reads it | 🟡-potential — Output is measured in operator attention (C1), yet every finding must now cite a constant; nothing references the note. | ordinary | The note redefines what the operator pays per review and who closes validation, which is my gate. |
| human-centred design | don-norman-advisor | JOIN | C1/C2 cognition claims (attention, ~4 slots) that lenses would cite as bedrock; 'What this means for chorus': operator attention as the review's output measure; Discoverability of an unreferenced note; C1-C9 beside I1-I9 as competing numbered catalogs | 🟡-potential — docs/process-constants.md:8 disclaims I1-I9, but nothing points a lens or operator to C1-C9 | ordinary | The note makes claims about human cognition and operator attention, and a homeless reference opens a gulf of execution for the lenses meant to cite it. |
| clean code | uncle-bob-architect | JOIN | home placement as dependency direction: portable personas/canon must not cite a project-local docs/ file; C1–C9 naming beside I1–I9 and duplication of chorus implications already stated in canon | 🟡-potential — docs/process-constants.md 'What this means for chorus' restates ranking/rulings rules canon owns; 'cite the constant' needs a stable inward-pointing anchor | not seated | Where the note lives and how lenses cite it is a dependency-direction and single-authority question, squarely my lens. |
| TDD | kent-beck-persona | JOIN | 'What this means for chorus' restates canon rules (ranking, rulings, known errors): a second author nothing checks; Implication 3 (lenses name a constant or the 10x test) adds a lens obligation with no validator or test; C8/test-first-at-goal-level row and the verification-vs-validation claim | 🟡-potential — docs/process-constants.md implications restate canon rules with no check that the two copies agree | ordinary | Duplication between the note and canon, plus a new unenforced lens rule, sits in simple-design ground. |
| test strategy | test-strategy-advisor | JOIN | docs/process-constants.md:83 derivatives row recasting test-pyramid proportions; C8 verification/validation split and the claim that gates confirm only verification (l.38, l.94); how my lens should cite C7/C8 when it prices checks | 🟡-potential — l.83 reduces the pyramid to authoring/run cost and drops diagnostic precision and feedback latency (C7), which do not fall with cheaper code | not seated | The note rewrites my lens's core heuristic as a derivative and draws the verification/validation line that every gate placement rests on. |
| delivery and ops | delivery-and-ops-advisor | JOIN | C7/C9 practice row (small reversible delivery, prod observability); KEDB and incident/problem split as a new keep-on practice for chorus; CAB/DORA derivative claim; home choice: keep-on cost of a canon-cited reference | 🟡-potential — Implication 4 prescribes a known-error store 'where the next round reads it' with no owner, home or upkeep cost priced | ordinary | The note prescribes operational practices (KEDB, recurring-finding ownership) whose run cost and home are unpriced. |
| security | security-and-trust-advisor | JOIN | KEDB implication writes recurring findings 'where the next round reads it': agent-replayed, possibly public persona memory (addendum item 5); C3/C8 operator closes validation; agent messages must not | 🟢-potential — 'known workaround belongs where the next round reads it' names no store, filter or owner | not seated | The note's home decides whether known-error memory crosses the public-memory and secret pre-filter boundary unexamined. |
| constraint and flow | eliyahu-goldratt-advisor | JOIN | placement decision: canon vs doc, sequencing of adoption; C1/C7/C8 and WIP/batch rows overlap my lens's own cheap-generation clause; the cut: which of nine constants and tables earn citation | 🟡-potential — docs/process-constants.md has zero inbound references; promoting it to canon before any lens cites it is inventory, not throughput | not seated | Where the note lives and what to cut before promotion is a sequencing and scope call, my remit. |

Joiners: 10. Quorum: proceed. Seating decision: seating-1.

**Operator interview.** 1 session(s), 4 question(s), 2 of them gates.

- [gate] delivery-and-ops-advisor (project-wide): Who should docs/process-constants.md be written for: lenses on installed suites (ship it under skill/), the maintainer only (stays in docs/), or the stranger-operator? — "Lenses (ship it)"
- [gate] kent-beck-persona (project-wide): Should the note bind lenses, or only advise them (advisory; binding only when a finding calls a practice obsolete or essential; binding on every finding)? — "Advisory"
- mark-richards-architect (lens-specific): The note's 'What this means for chorus' bullets partly repeat rules CONDUCTOR.md already owns. Replace them with citations of canon, or keep them as rationale? — "Use it as rationale for decisions, advisory, if needed."
- alan-cooper-advisor (project-wide): Should implication 4 (recurring findings are problems; their known workaround belongs where the next round reads it) become a mechanism with an owner and a known-errors store, or stay advice? — "Advice for now"

## 3. Findings register

| ID | Advisor · Lens | Authored severity | Target (locator) | Pull-quote (verbatim) | confidence_on_hand | need_info · reason | graded |
|---|---|---|---|---|---|---|---|
| F1 | mark-richards-architect · architecture<br>kent-beck-persona · TDD / simple design (🟢) | 🟡 | `docs/process-constants.md:1` | "The note has to live under skill/ to ship, and chorus-core is the only home every reader already depends on."<br>kent-beck-persona: "FC4 plus one index line already proves the note ships, and an advisory note doesn't earn a new check." | high | — | true |
| F2 | mark-richards-architect · architecture | 🟡 | `scripts/check-suite-integrity.sh:41` | "An advisory id still needs one home, because what breaks is the id drifting, not anyone's obligation to cite it." | high | — | true |
| F3 | mark-richards-architect · architecture | 🟡 | `docs/process-constants.md:91` | "Let the canon own the rule and the note own the why, joined by a token the build can check." | high | — | true |
| F4 | mark-richards-architect · architecture | 🟢 | `skill/chorus-core/ROSTER.md:111` | "One pointer in the roster beats ten in the personas." | high | — | true |
| F5 | alan-cooper-advisor · adversarial product | 🟡 | `skill/chorus-review/BRIEFS.md:38` | "A constant cited as evidence spares the lens the trace and charges the operator for the trust." | high | — | true |
| F6 | alan-cooper-advisor · adversarial product | 🟡 | `skill/chorus-core/bin/conduct.mjs:303` | "The note promises the operator closes validation; in a review round nobody asks them." | high | — | true |
| F7 | alan-cooper-advisor · adversarial product | 🟡 | `docs/process-constants.md:31` | "Every constant is the team's cost; the user shows up only as the oracle that grades them." | high | — | true |
| F8 | alan-cooper-advisor · adversarial product | 🟢 | `docs/process-constants.md:3` | "Ship lenses the constants and the tests; keep the history lesson for the maintainer." | high | — | true |
| F9 | don-norman-advisor · human-centred design | 🟡 | `docs/process-constants.md:38` | "The canon and the note agree on what a gate proves but use 'validate' in opposite senses, so a lens citing C8 inherits the wrong one." | high | — | true |
| F10 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-sdlc/SKILL.md:285` | "The operator sees 'cleared' and 'sign-off', which read as 'validated', yet only verification happened, and nothing on screen says so." | high | — | true |
| F11 | don-norman-advisor · human-centred design | 🟢 | `docs/process-constants.md:89-101` | "Written in imperatives, an advisory note teaches a lens that it is binding." | high | — | true |
| F12 | don-norman-advisor · human-centred design | 🟡 | `install.sh:4` | "A reference no installed suite receives, and no pointer names, cannot be cited at the moment a lens needs it." | high | — | true |
| F13 | kent-beck-persona · TDD / simple design | 🟡 | `docs/process-constants.md:94` | "Rationale written as imperatives turns into a second rulebook, and no test will notice when it drifts." | high | — | true |
| F14 | kent-beck-persona · TDD / simple design | 🟢 | `docs/process-constants.md:19` | "A test that only asks 'does it still make sense?' can't come back red." | high | — | true |
| F15 | kent-beck-persona · TDD / simple design | 🟡 | `docs/process-constants.md:83` | "The note lists the pyramid as derivative but never says the tests themselves rest on a constant." | high | — | true |
| F16 | kent-beck-persona · TDD / simple design | 🟢 | `docs/process-constants.md:84` | "An agent can be a second head, but it can't spread knowledge between people or share the accountability." | high | — | true |
| F17 | delivery-and-ops-advisor · delivery and ops | 🟡 | `scripts/check-suite-integrity.sh:266` | "Put it at skill/chorus-core/PROCESS-CONSTANTS.md and existing CI checks every citation for free; leave it in docs/ and every citation is a dangling pointer nothing catches." | high | — | true |
| F18 | delivery-and-ops-advisor · delivery and ops | 🟡 | `docs/process-constants.md:99` | "Advice that names a store nobody runs grows a dozen private stores nobody reads." | high | — | true |
| F19 | delivery-and-ops-advisor · delivery and ops | 🟡 | `skill/chorus-core/bin/conduct.mjs:782` | "Make the constant IDs the contract and never reuse a number; that versions the citations without touching VERSION." | high | — | true |
| F20 | delivery-and-ops-advisor · delivery and ops | 🟢 | `docs/process-constants.md:85` | "DORA found heavyweight external approval buys no stability and slows delivery, not that every CAB is useless; cite it that narrowly." | high | — | true |
| R2-1 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/bin/validate.mjs:319` | "A C-id can explain a finding, but it cannot carry the finding alone, and the validator can tell the two apart." | high | — | false [ungraded] |
| R2-2 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/test/conduct.test.mjs:25` | "The test pins one owner of sign-off and I9 names another, and nothing compares them." | high | — | false [ungraded] |
| R2-3 | alan-cooper-advisor · adversarial product | 🟡 | `skill/chorus-core/schema/review-record.schema.json:100` | "The place the next round reads already exists: it is the baseline, and it has no slot for an owner." | high | — | false [ungraded] |
| R2-4 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-core/bin/render.mjs:33-38` | "Cite a constant and the operator sees '[principle]' with nothing to follow." | high | — | false [ungraded] |
| R2-5 | kent-beck-persona · TDD / simple design | 🟢 | `skill/chorus-core/test/canon-drift.test.mjs:1` | "Say out loud which drift nothing checks, so a green build isn't read as proof the rationale still holds." | high | — | false [ungraded] |
| R2-6 | delivery-and-ops-advisor · delivery and ops | 🟢 | `scripts/check-suite-integrity.sh:41` | "Copy FC1's regex for C-ids and the check passes forever; match the table row or don't add it." | high | — | false [ungraded] |

Converging lenses, in their own words:

- **R2-1** (derived from F5)
- **R2-2** (derived from F6)
- **R2-3** (derived from F18)
- **R2-4** (derived from F5)
- **R2-5** (derived from F3)
- **R2-6** (derived from F2)

## 4. Consolidation matrix

`net = P − O` over non-author voters (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = P + C.

| ID | Authored severity | P | C | O | net | Final severity | Convergence (P + C) | Status |
|---|---|---|---|---|---|---|---|---|
| F1 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F2 | 🟡 | 0 | 1 | 1 | -1 | 🟢 | 1 | graded |
| F3 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F4 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F5 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F6 | 🟡 | 1 | 2 | 0 | 1 | 🔴 | 3 | graded |
| F7 | 🟡 | 0 | 1 | 2 | -2 | 🟢 | 1 | graded |
| F8 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F9 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F10 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F11 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F12 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F13 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F14 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F15 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F16 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F17 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F18 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F19 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F20 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| R2-1 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-2 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-3 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-4 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-5 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-6 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |

## 5. Conflicts

- **C1** — mark-richards-architect vs kent-beck-persona on F2, R2-6: Check C-ids for drift now, or only when a lens first cites one? Richards (F2): an advisory id still needs one home and an FC check. Beck: nothing cites a C-id yet; add it with the first citation. Delivery-and-Ops (R2-6): if added, match the table rows, not FC1's regex. Outcome: CI red on a dangling C-id now, or no check yet. No arbiter port.
  - Unresolved for the operator (conflict-1)
- **C2** — alan-cooper-advisor vs don-norman-advisor on F5, F12: May a C-id stand alone as a finding's principle evidence? Norman (F12): cite it as a principle item. Cooper (F5), Richards (R2-1): rationale only, always beside a file:line; the validator warns if alone. Outcome: a finding resting on 'C1 attention' alone reaches the operator with nothing to check (R2-4), or every finding keeps a code anchor. No arbiter port.
  - Unresolved for the operator (conflict-2)

## 6. Top five

1. **F6** 🔴 — "The note promises the operator closes validation; in a review round nobody asks them." `skill/chorus-core/bin/conduct.mjs:303`
   Cost medium · Value: Only gating 🔴: review-mode sign-off is conductor-filled while I9 names the operator; resolving it (with R2-2's CONSOLIDATE vs SANCTIONED DIVERGENCE) removes a canon/code contradiction and decides who closes validation in both modes (with F10). · Constitutional ROI: II. The Chair Decides Nothing — a conductor-filled sign-off is the chair deciding. · Convergence 3
2. **F1** 🟡 — "The note has to live under skill/ to ship, and chorus-core is the only home every reader already depends on." `docs/process-constants.md:1`
   Cost low · Value: Unblocks the operator's 'ship it' ruling: the note moves to skill/chorus-core/PROCESS-CONSTANTS.md, indexed in SKILL.md; installer, uninstall manifest, roundtrip test and FC4 cover it with no new machinery (F12, F17 converge). · Constitutional ROI: I. One Canonical Definition — one shipped home instead of a docs/ copy nothing resolves. · Convergence 3
3. **F5** 🟡 — "A constant cited as evidence spares the lens the trace and charges the operator for the trust." `skill/chorus-review/BRIEFS.md:38`
   Cost low · Value: Stops a C-id from passing I8 on its own; one line in the note and BRIEFS keeps every finding anchored to code the operator can check (C2 unresolved; R2-1, R2-4 follow). · Constitutional ROI: IV. Every Lens Names Its Gates — evidence stays artefact-grounded, not borrowed from a reference. · Convergence 4
4. **F18** 🟡 — "Advice that names a store nobody runs grows a dozen private stores nobody reads." `docs/process-constants.md:99`
   Cost low · Value: One sentence points implication 4 at the existing baseline (R2-3) or says no known-error store exists, so lenses don't grow private stores nobody reads. · Convergence 4
5. **F9** 🟡 — "The canon and the note agree on what a gate proves but use 'validate' in opposite senses, so a lens citing C8 inherits the wrong one." `docs/process-constants.md:38`
   Cost low · Value: Aligns 'validation' with CONDUCTOR.md's usage (or names the difference) so a lens citing C8 doesn't inherit the opposite sense; wording-only fix in the note. · Constitutional ROI: I. One Canonical Definition — one meaning per term across canon and note. · Convergence 4

## 7. Held findings and minority reports

None.

**Minority reports** (one voter each; not counted, never gating, authored severity kept):

None.

## 8. Next-chorus baseline

**Assume closed**: Reader of the note: lenses on installed suites; it ships (operator ruling 2026-11-06).; The note is advisory, not binding; its chorus bullets are rationale, not rules (operator rulings 2026-11-06).; Known errors: advice only, no store or mechanism (operator ruling 2026-11-06).; DORA claim narrowed to formal external approval, sourced to dora.dev 'Streamlining change approval' (F20).

**In progress**: Move docs/process-constants.md to skill/chorus-core/PROCESS-CONSTANTS.md and apply the wording findings (F1, F3, F8, F9, F11, F13, F14, F15, F16, F18, F19, F20).; Show validation-open status and its owner in the record (F10, operator ruling 'Show it in the record'); land with the F6/R2-2 sign-off ruling so both record kinds stay in step.

**Re-evaluate**: F6 / R2-2: review-mode sign-off ownership vs I9 — CONSOLIDATE (ask the operator) or SANCTIONED DIVERGENCE (amend I9).; C1: integrity check for C-ids now vs at first citation (F2, R2-6).; C2: may a C-id stand as sole principle evidence (F5, F12, R2-1, R2-4).; R2-3: baseline items carry no owner slot.

### Decisions

#### seating-1 — Seating tie at seat 5: default panel seated (🟡)

10 personas joined for 5 ordinary seats; the two-axis signal (cited deltas, then expected stakes) ties across seat 5.

- **Point**: RSVP seating — tie at the cap (catalog row 2)
- **Sensor**: strict order at the cap boundary (DECISION-PRIMITIVE.md § Seating) → tie (mark-richards-architect, alan-cooper-advisor, don-norman-advisor, kent-beck-persona, delivery-and-ops-advisor)
- **Resolution**: default-applied · **Status**: complete
- **Default** — Seat the sorted panel (`sorted-panel`): Seat mark-richards-architect, alan-cooper-advisor, don-norman-advisor, kent-beck-persona, delivery-and-ops-advisor. *Cost*: none
- Swap a tied seat (`swap-seat`): Re-seat one tied persona in place of another and re-run the board. *Cost*: re-run the board
- **Override**: Name the tied persona to seat instead; the board re-runs. (cost: one board re-run)
- **Chosen**: `sorted-panel` on 2026-11-06
- **Evidence**: conduct.mjs seat()

#### conflict-1 — C1: mark-richards-architect, kent-beck-persona disagree on F2, R2-6 (🟡)

Check C-ids for drift now, or only when a lens first cites one? Richards (F2): an advisory id still needs one home and an FC check. Beck: nothing cites a C-id yet; add it with the first citation. Delivery-and-Ops (R2-6): if added, match the table rows, not FC1's regex. Outcome: CI red on a dangling C-id now, or no check yet. No arbiter port.

- **Point**: Unresolved conflict (Phase 3) (catalog row 15)
- **Resolution**: default-applied · **Status**: open
- **Default** — Let the counted severity stand (`counted-stands`): The vote's arithmetic stands; nothing changes in the ranking. *Cost*: none
- Rule on the disagreement (`operator-rules`): The operator decides which reading holds; the ruling annotates the ranking. *Cost*: one operator ruling
- **Override**: Rule on the conflict; the ruling annotates the ranking and never changes counted severity. (cost: one operator ruling)
- **Evidence**: F2; R2-6

#### conflict-2 — C2: alan-cooper-advisor, don-norman-advisor disagree on F5, F12 (🟡)

May a C-id stand alone as a finding's principle evidence? Norman (F12): cite it as a principle item. Cooper (F5), Richards (R2-1): rationale only, always beside a file:line; the validator warns if alone. Outcome: a finding resting on 'C1 attention' alone reaches the operator with nothing to check (R2-4), or every finding keeps a code anchor. No arbiter port.

- **Point**: Unresolved conflict (Phase 3) (catalog row 15)
- **Resolution**: default-applied · **Status**: open
- **Default** — Let the counted severity stand (`counted-stands`): The vote's arithmetic stands; nothing changes in the ranking. *Cost*: none
- Rule on the disagreement (`operator-rules`): The operator decides which reading holds; the ruling annotates the ranking. *Cost*: one operator ruling
- **Override**: Rule on the conflict; the ruling annotates the ranking and never changes counted severity. (cost: one operator ruling)
- **Evidence**: F5; F12

### Side-notes (flag-only)

- **threshold-boundary**: Moved at exactly the threshold: |net| == T. (F2, F6)

## Appendix — lens reports

- mark-richards-architect: `docs/reviews/2026-11-06-chorus-review.run.json`
- alan-cooper-advisor: `docs/reviews/2026-11-06-chorus-review.run.json`
- don-norman-advisor: `docs/reviews/2026-11-06-chorus-review.run.json`
- kent-beck-persona: `docs/reviews/2026-11-06-chorus-review.run.json`
- delivery-and-ops-advisor: `docs/reviews/2026-11-06-chorus-review.run.json`
