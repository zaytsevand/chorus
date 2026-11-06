# Chorus review — 2026-11-06

- **Target**: docs/process-constants.md (branch worktree-process-constants): re-run with Goldratt, Test-Strategy and Evans seated by operator ruling; review the note's content and its home skill-wise
- **Mode**: project-state review
- **Baseline**: docs/reviews/2026-11-06-chorus-review.json

**Round context.** Since the first round today (docs/reviews/2026-11-06-chorus-review.md): I9 amended so the chorus signs its advice, not the result (539ca94); BRIEFS.md item 8 and the note allow a constant as a finding's principle unless code contradicts it (2608fbf); chorus-core 2.1.0 adds an operator seat override (57feef5). The operator ruled Goldratt, Test-Strategy and Evans into seats (brief ruling R-8). Prior rulings: lenses read the note and it ships; advisory; chorus bullets are rationale; known errors are advice for now; validation status shows in the record. Budgets: RSVP 3m, exploratory 15m, R1 15m, R2 10m.

**Bindings.** decision-sink: problem-brief · ruling-lookup: problem-brief · record-validator: chorus-core · record-renderer: chorus-core · arbiter: default · fixed-viewpoint: default · memory-recall: default

**Recovered without asking.** none

**Secret filter.** not run (No memory writes went through the conductor this round.).

## 1. TL;DR

The re-seated board (Evans, Test-Strategy, Goldratt by operator override, with Richards and Norman) raised 23 findings and 10 derives that the first round missed: 'principle' now has three meanings, borrowed words (incident, derivative, validation) collide with canon terms, the rule from R-7 lives in two files, and seven derivatives rows have no reader. The top five shape the one shipping change (R-10): a shared field for whether the result reached its goal (F9), oracles that state what they do not cover (F17), a PC-number check that scans agents/ and is shown to fail (F18), R-7 kept only in BRIEFS.md citing the moved note by path (F6), and cutting the unread rows before rewording (F20). F9, F17 and F18 are red and gate the shipping change; this record signs the chorus's advice, not the result, and two conflicts (C1 citation tooling now or later, C2 the field's name) remain for the operator.

## 2. Roster (this round)

| Lens | Persona | Decision | Applies (cited deltas) | Expected stakes | Seat | Reason |
|---|---|---|---|---|---|---|
| DDD | eric-evans-advisor | JOIN | 2608fbf: 'principle' now means a C-id as well as a governance-named principle (CONDUCTOR.md:176,246); C1-C9 and ITIL terms entering lens vocabulary from the chorus-core home | 🟡-potential — CONDUCTOR.md:176 defines principle as named in governance; process-constants.md:97 lets a constant be one | ordinary | The new ruling stretches one canon term across two sources of authority, which is a language seam my lens owns. |
| architecture | mark-richards-architect | JOIN | 2608fbf writes the constant-as-principle rule twice: BRIEFS.md item 8 (shipped) and the note (docs/, unshipped); shipped BRIEFS.md:40 names 'a process constant' that no shipped file defines; baseline PROCESS-CONSTANTS.md home: C-id residence fitness function | 🟡-potential — BRIEFS.md:40 and docs/process-constants.md chorus section: one rule, two authors, no parity check | ordinary | The first round's predicted duplicate authority has now landed in canon, and ruling on it is my standing assignment. |
| adversarial product | alan-cooper-advisor | JOIN | 2608fbf: each code-vs-constant clash becomes an operator NEED_INFO question, a new per-round cost; 539ca94 I9: the operator owns whether the result reached its goal; does the record ever ask them?; note still cited nowhere in skill/ or agents/ | 🟡-potential — BRIEFS.md item 8 sends contradictions to the operator; CONDUCTOR I9 leaves validation open with no record slot | not seated | Both new rulings move cost and judgement onto the operator, the person my seat speaks for. |
| human-centred design | don-norman-advisor | JOIN | 2608fbf: constant-alone principle findings now legal; render.mjs:36 still shows bare '[principle]' (R2-4); 'no code contradicts it': operator cannot see whether that was checked; 539ca94 I9 vs sign-off wording the operator reads (F10); C2 ~4 slots stated as bedrock | 🟡-potential — BRIEFS.md:40 allows constant-only evidence; render.mjs:36 gives the operator nothing to follow | ordinary | The rulings legitimise findings the operator cannot evaluate, a gulf of evaluation my lens owns. |
| clean code | uncle-bob-architect | JOIN | 2608fbf authors one rule twice: BRIEFS.md item 8 and note l.99-102, worded differently; shipped BRIEFS.md uses 'process constant' with no anchor while the note sits in unshipped docs/ | 🟡-potential — skill/chorus-review/BRIEFS.md:40 'only when'/NEED_INFO vs docs/process-constants.md:99 'can be'/operator question | not seated | The duplicate authority I flagged last round as a risk has now landed in shipped canon, which is my remit. |
| TDD / simple design | kent-beck-persona | JOIN | 2608fbf wrote one rule twice: BRIEFS.md:40 and the note's constant-as-principle bullet, nothing checks they agree; I9's new oracle clause (539ca94) vs C8's 'every check needs an oracle': two authors, one meaning; what a move to chorus-core must test | 🟡-potential — skill/chorus-review/BRIEFS.md:40 and docs/process-constants.md give the constant-as-principle rule twice, and neither copy is tested | not seated | Today's rulings did what I warned about last round: they gave canon rules a second author, so whether tests can see the copies drift is my question. |
| test strategy | test-strategy-advisor | JOIN | l.83 pyramid row: 'what survives' omits diagnosis and C7 latency; amended I9: which check is the oracle that makes a result signable; 2608fbf 'unless code contradicts': what check detects the contradiction | 🟡-potential — docs/process-constants.md:83 prices tests by authoring/run cost only; diagnostic precision and feedback latency (C7) do not fall with cheap code | ordinary | The note recasts my lens's core heuristic as a derivative, and the new I9 oracle clause is a check-placement question. |
| delivery and ops | delivery-and-ops-advisor | JOIN | shipped BRIEFS.md item 8 now admits 'process constant' as principle while the note still sits in unshipped docs/; note line 85 DORA claim and line 63/105 KEDB advice unchanged since baseline F18/F20; home move: install/uninstall/FC4 coverage | 🟡-potential — skill/chorus-review/BRIEFS.md:40 ships a rule naming constants; install.sh copies no docs/, so installed lenses cite nothing | not seated | A shipped rule now depends on an unshipped file, which is a release-path gap. |
| security | security-and-trust-advisor | JOIN | KEDB bullet still sends recurring findings 'where the next round reads it' with no named store, filter or owner, unchanged since round 1; item 8 lets an uncontradicted constant stand as evidence, a laundering path | 🟡-potential — process-constants.md:103-105 unchanged; BRIEFS.md item 8 (2608fbf) | not seated | Known-error memory replayed into agents crosses a trust boundary nobody has drawn, and the note now ships to other projects. |
| constraint and flow | eliyahu-goldratt-advisor | JOIN | Sequencing: move plus twelve wording fixes queued while the note still has zero inbound citations; The cut: which constants, tables and history rows a lens actually cites; C1/C7/C8 overlap with my lens's cheap-generation clause | 🟡-potential — grep finds no reference to process-constants in skill/ or agents/; the baseline queues 12 wording fixes before any lens cites it | ordinary | The baseline decides where the note lives but not what to cut or when to polish, and those calls are my remit. |

Joiners: 10. Quorum: proceed. Seating decision: seating-1.

**Operator interview.** 1 session(s), 7 question(s), 2 of them gates.

- [gate] eliyahu-goldratt-advisor (project-wide): Should this round's findings go into the same change as the queued move to skill/chorus-core/PROCESS-CONSTANTS.md and the round-1 wording fixes, or into a separate pass after it? — "Same change"
- [gate] test-strategy-advisor (project-wide): Amended I9 says the chorus can sign a result only with an oracle its lenses 'can call'. In review mode, what counts as such an oracle? — "project's addendum can define such oracles, with explicitly stated area each covers. Lenses decide on per-case basis if verification can be performed & sufficient. Only high confidence allows a sign-off of the result."
- don-norman-advisor (project-wide): Ruling R-5: should 'validation still open, and who closes it' be a record field (schema and renderer) or a sentence in the summary? — "Record field"
- test-strategy-advisor (project-wide): When the C-number check lands (R-9), rename the constants to avoid the conflict ids C1, C2, and should the check also enforce that constants are defined only in PROCESS-CONSTANTS.md? — "Rename + residence"
- eliyahu-goldratt-advisor (project-wide): Which merges first: PRs #45/#47 or this branch? — deferred
- don-norman-advisor (lens-specific): Under R-7, who checks that no code contradicts a constant cited as a principle, and what counts as contradicting a cognition constant? — deferred
- test-strategy-advisor (lens-specific): Is there any history of flaky or escaped defects for the three integrity.yml jobs? — deferred

Deferred answers cost: Merge order unknown: findings that touch chorus-core may need a rebase onto #45/#47. Who checks R-7's 'no contradicting code' is left to the lenses' own findings. CI trust history is inferred from the workflow files only.

## 3. Findings register

| ID | Advisor · Lens | Authored severity | Target (locator) | Pull-quote (verbatim) | confidence_on_hand | need_info · reason | graded |
|---|---|---|---|---|---|---|---|
| F1 | eric-evans-advisor · DDD | 🟡 | `skill/chorus-core/CONDUCTOR.md:176` | "One word now ends a chain with authority and without it, and the record can't tell which." | high | — | true |
| F2 | eric-evans-advisor · DDD | 🟡 | `docs/process-constants.md:52` | "Shipped into chorus-core, 'the brief' both means the wrong brief and names a provider the canon promises never to name." | high | — | true |
| F3 | eric-evans-advisor · DDD | 🟡 | `docs/process-constants.md:103` | "Borrow ITIL's ideas, not its nouns: the canon already spends 'incident', 'derive' and 'validate' on other things." | high | — | true |
| F4 | eric-evans-advisor · DDD | 🟢 | `docs/process-constants.md:29` | "Call them PC1-PC9, so the id says 'process constant' and borrows nobody else's word." | high | — | true |
| F5 | eric-evans-advisor · DDD | 🟢 | `docs/process-constants.md:87` | "A derivative that can't name the practice it degrades from leaves the lens a chain with a missing link." | high | — | true |
| F6 | mark-richards-architect · architecture | 🟡 | `skill/chorus-review/BRIEFS.md:40` | "Once the note sits in core it may not point at BRIEFS.md, so the second copy has to go, not just link back." | high | — | true |
| F7 | mark-richards-architect · architecture | 🟡 | `scripts/check-suite-integrity.sh:41` | "A residence check that only reads list-form lines will pass green over a table it never saw." | high | — | true |
| F8 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/CONDUCTOR.md:471` | "The oracle is I9's word, so it lives where I9 lives, and the review item list just points to it." | high | — | true |
| F9 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/schema/common.schema.json:1` | "One shared shape for both record kinds is the parity test; two copies would need one." | high | — | true |
| F10 | mark-richards-architect · architecture | 🟢 | `skill/chorus-core/SKILL.md:60` | "Index before you cite, and land the check with its first caller, and every step stays green." | high | — | true |
| F11 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-core/bin/render.mjs:116` | "An 'open' with no observation that would close it tells the operator what is missing, not what to look for." | high | — | true |
| F12 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-core/bin/render.mjs:33-38` | "The record already knows which constant a finding rests on and throws that away just before the operator reads it." | high | — | true |
| F13 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-review/BRIEFS.md:40-43` | "A condition nobody records having checked looks to the operator exactly like a condition nobody checked." | high | — | true |
| F14 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-learn/SKILL.md:164-191` | "The tutorial still teaches the model the canon has just retired." | high | — | true |
| F15 | don-norman-advisor · human-centred design | 🟢 | `docs/process-constants.md:3-10` | "The note tells a lens what it is not, and never says what it is at the place the lens actually lands." | high | — | true |
| F16 | test-strategy-advisor · test strategy | 🟡 | `docs/process-constants.md:83` | "Cheap code makes tests cheap to write, not quick to answer or precise when red, so the pyramid's reasons outlive its ratios." | high | — | true |
| F17 | test-strategy-advisor · test strategy | 🟡 | `skill/chorus-core/CONDUCTOR.md:266` | "Green CI verifies the records, the structure and a Linux install; it says nothing about whether a prose rule is right." | high | — | true |
| F18 | test-strategy-advisor · test strategy | 🟡 | `scripts/check-suite-integrity.sh:96` | "Add the prefix to FC1, scan agents/ too, and show once that the check can go red." | high | — | true |
| F19 | test-strategy-advisor · test strategy | 🟡 | `skill/chorus-core/test/conduct.test.mjs:25` | "Test who fills the validation field at the engine, where a red names the culprit; the move itself is already covered." | high | — | true |
| F20 | eliyahu-goldratt-advisor · constraint and flow | 🟡 | `docs/process-constants.md:77-87` | "The change gets reviewed by one person in one sitting, so cut the rows no lens reads before you polish them." | high | — | true |
| F21 | eliyahu-goldratt-advisor · constraint and flow | 🟡 | `docs/process-constants.md:31` | "A trend says where to look first; only evidence says where the constraint is." | high | — | true |
| F22 | eliyahu-goldratt-advisor · constraint and flow | 🟡 | `docs/process-constants.md:96-98` | "Two rounds of counting tell us whether citing constants earns its keep; until then, build no check." | high | — | true |
| F23 | eliyahu-goldratt-advisor · constraint and flow | 🟢 | `docs/process-constants.md:61` | "Don't teach the lenses to want a store the operator declined." | high | — | true |
| R2-1 | eric-evans-advisor · DDD | 🟡 | `skill/chorus-core/schema/common.schema.json:1` | "A field called 'validation' that closes on 'verified' teaches the confusion the note was written to prevent." | high | — | false [ungraded] |
| R2-2 | eric-evans-advisor · DDD | 🟢 | `skill/chorus-core/schema/run-log.schema.json:45` | "One 'sign-off' now signs advice in review and the result in lifecycle; name the two apart." | high | — | false [ungraded] |
| R2-3 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/schema/vocab.schema.json:5` | "Put the constant ids in a schema enum and advice becomes a contract the validator enforces." | high | — | false [ungraded] |
| R2-4 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-core/schema/common.schema.json:1` | "A status that can only ever say 'open' soon stops being read." | high | — | false [ungraded] |
| R2-5 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-core/bin/render.mjs:217` | "The ledger labels a memory write 'sign-off', and the operator reads it as the result being signed." | high | — | false [ungraded] |
| R2-6 | don-norman-advisor · human-centred design | 🟢 | `skill/chorus-core/CONDUCTOR.md:266-267` | "Show what the oracle can't see at the moment the operator trusts it." | high | — | false [ungraded] |
| R2-7 | test-strategy-advisor · test strategy | 🟡 | `skill/chorus-core/CONDUCTOR.md:336` | "A 'verified' that names an oracle nobody declared should fail validation, the same way a missing ruling does." | high | — | false [ungraded] |
| R2-8 | test-strategy-advisor · test strategy | 🟢 | `scripts/check-suite-integrity.sh:339` | "The boundary check guards the provider's name, not its nicknames; fix the word, don't widen the regex." | high | — | false [ungraded] |
| R2-9 | eliyahu-goldratt-advisor · constraint and flow | 🟡 | `skill/chorus-review/BRIEFS.md:40-43` | "Build the citation machinery for the first citation, not ahead of it." | high | — | false [ungraded] |
| R2-10 | eliyahu-goldratt-advisor · constraint and flow | 🟢 | `docs/process-constants.md:96-98` | "The note's own value is the first open validation the new field should carry." | high | — | false [ungraded] |

Converging lenses, in their own words:

- **R2-1** (derived from F9)
- **R2-2** (derived from F19)
- **R2-3** (derived from F1)
- **R2-4** (derived from F9)
- **R2-5** (derived from F1)
- **R2-6** (derived from F17)
- **R2-7** (derived from F9)
- **R2-8** (derived from F2)
- **R2-9** (derived from F13)
- **R2-10** (derived from F11)

## 4. Consolidation matrix

`net = P − O` over non-author voters (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = P + C.

| ID | Authored severity | P | C | O | net | Final severity | Convergence (P + C) | Status |
|---|---|---|---|---|---|---|---|---|
| F1 | 🟡 | 1 | 2 | 1 | 0 | 🟡 | 3 | graded |
| F2 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F3 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F4 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F5 | 🟢 | 0 | 2 | 1 | -1 | dropped | 2 | graded |
| F6 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F7 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F8 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F9 | 🟡 | 2 | 2 | 0 | 2 | 🔴 | 4 | graded |
| F10 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F11 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F12 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F13 | 🟡 | 1 | 2 | 1 | 0 | 🟡 | 3 | graded |
| F14 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F15 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F16 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F17 | 🟡 | 2 | 2 | 0 | 2 | 🔴 | 4 | graded |
| F18 | 🟡 | 1 | 2 | 0 | 1 | 🔴 | 3 | graded |
| F19 | 🟡 | 0 | 3 | 1 | -1 | 🟡 | 3 | graded |
| F20 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F21 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| F22 | 🟡 | 0 | 0 | 4 | -4 | 🟢 | 0 | graded |
| F23 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| R2-1 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-2 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-3 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-4 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-5 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-6 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-7 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-8 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-9 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-10 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |

## 5. Conflicts

- **C1** — eliyahu-goldratt-advisor vs eric-evans-advisor on F1, F13, R2-9: Build the citation tooling now or with the first real citation? Goldratt (R2-9; OVER-RATE on F1, F13): the principle split and the recording duty wait for a lens to cite a constant. Evans (F1, PRIORITIZE F12), Norman and Richards: land them in this change. Outcome: a smaller change now, or citation rules ready before anyone cites. R-10 says one change. No arbiter port.
  - Unresolved for the operator (conflict-1)
- **C2** — eric-evans-advisor vs mark-richards-architect on F9, R2-1: What to call the R-12 field. Richards (F9) and Norman (F11): a shared 'validation' definition with a 'verified' status. Evans (R2-1): that name repeats the confusion the note warns against; name it for I9 (whether the result reached its goal) with statuses open, oracle_verified, operator_ruled. Outcome: which word the operator reads on every record. No arbiter port.
  - Unresolved for the operator (conflict-2)

## 6. Top five

1. **F9** 🔴 — "One shared shape for both record kinds is the parity test; two copies would need one." `skill/chorus-core/schema/common.schema.json:1`
   Cost medium · Value: Carries R-5/R-12: one shared field definition keeps review and lifecycle records in step without a parity test, and lets the validator require it (C2 settles its name). · Constitutional ROI: I. One Canonical Definition — one schema definition, two consumers. · Convergence 4
2. **F17** 🔴 — "Green CI verifies the records, the structure and a Linux install; it says nothing about whether a prose rule is right." `skill/chorus-core/CONDUCTOR.md:266`
   Cost low · Value: Carries R-11: each declared oracle states what it does not cover, so green CI is not read as 'the canon change is right'; prevents the over-trust the I9 amendment is meant to stop. · Convergence 4
3. **F18** 🔴 — "Add the prefix to FC1, scan agents/ too, and show once that the check can go red." `scripts/check-suite-integrity.sh:96`
   Cost low · Value: Carries R-9/R-13: the PC-number check must scan agents/ (where lenses cite) and be shown once to fail, or it passes green while blind. · Convergence 3
4. **F6** 🟡 — "Once the note sits in core it may not point at BRIEFS.md, so the second copy has to go, not just link back." `skill/chorus-review/BRIEFS.md:40`
   Cost low · Value: R-7 gets one home (BRIEFS.md item 8) citing chorus-core/PROCESS-CONSTANTS.md by path; that path citation is the first constant citation, which brings the R-9 check into this same change. · Constitutional ROI: I. One Canonical Definition — the rule stops living in two files. · Convergence 4
5. **F20** 🟡 — "The change gets reviewed by one person in one sitting, so cut the rows no lens reads before you polish them." `docs/process-constants.md:77-87`
   Cost low · Value: Shrinks the single change R-10 asks for by deleting seven derivatives rows and the history frame no lens reads, which also retires two round-1 wording fixes (F8, F20 of round 1). · Convergence 4

## 7. Held findings and minority reports

None.

**Minority reports** (one voter each; not counted, never gating, authored severity kept):

None.

## 8. Next-chorus baseline

**Assume closed**: Home: skill/chorus-core/PROCESS-CONSTANTS.md (round 1, R-1).; One shipping change carries the move, round-1 wording and this round's findings (R-10).; Constants renamed to PC1–PC9; the check enforces residence and resolution (R-13; F4 of this round names the prefix).; Oracles are defined by the addendum per area; sign-off of a result needs high confidence (R-11).

**In progress**: The shipping change, in Richards's order (F10): move and rename; index and roster pointer; check run red then green; BRIEFS.md path citation; oracle section; shared field with schema, renderer and tests; version bump.; W-7 of the brief: this re-run itself, closed by this record.

**Re-evaluate**: C1: citation tooling (F1 principle split, F13 recorded search) now or with the first lens citation.; C2: name of the R-12 field — 'validation' or a name tied to I9 with statuses open, oracle_verified, operator_ruled.; R2-10: whether lenses citing constants improves a round is itself unconfirmed; count it over the next two rounds (F22's experiment, demoted but not dropped).

### Decisions

#### seating-1 — Seating tie at seat 5: default panel seated (🟡)

10 personas joined for 5 ordinary seats; the two-axis signal (cited deltas, then expected stakes) ties across seat 5.

- **Point**: RSVP seating — tie at the cap (catalog row 2)
- **Sensor**: strict order at the cap boundary (DECISION-PRIMITIVE.md § Seating) → tie (eric-evans-advisor, mark-richards-architect, don-norman-advisor, test-strategy-advisor, eliyahu-goldratt-advisor)
- **Resolution**: default-applied · **Status**: complete
- **Default** — Seat the sorted panel (`sorted-panel`): Seat eric-evans-advisor, mark-richards-architect, don-norman-advisor, test-strategy-advisor, eliyahu-goldratt-advisor. *Cost*: none
- Swap a tied seat (`swap-seat`): Operator's seat override (run header seat_override): eliyahu-goldratt-advisor in for kent-beck-persona; eric-evans-advisor in for alan-cooper-advisor. *Cost*: re-run the board
- **Override**: Name the tied persona to seat instead; the board re-runs. (cost: one board re-run)
- **Chosen**: `swap-seat` on 2026-11-06
- **Evidence**: conduct.mjs seat()

#### conflict-1 — C1: eliyahu-goldratt-advisor, eric-evans-advisor disagree on F1, F13, R2-9 (🟡)

Build the citation tooling now or with the first real citation? Goldratt (R2-9; OVER-RATE on F1, F13): the principle split and the recording duty wait for a lens to cite a constant. Evans (F1, PRIORITIZE F12), Norman and Richards: land them in this change. Outcome: a smaller change now, or citation rules ready before anyone cites. R-10 says one change. No arbiter port.

- **Point**: Unresolved conflict (Phase 3) (catalog row 15)
- **Resolution**: default-applied · **Status**: open
- **Default** — Let the counted severity stand (`counted-stands`): The vote's arithmetic stands; nothing changes in the ranking. *Cost*: none
- Rule on the disagreement (`operator-rules`): The operator decides which reading holds; the ruling annotates the ranking. *Cost*: one operator ruling
- **Override**: Rule on the conflict; the ruling annotates the ranking and never changes counted severity. (cost: one operator ruling)
- **Evidence**: F1; F13; R2-9

#### conflict-2 — C2: eric-evans-advisor, mark-richards-architect disagree on F9, R2-1 (🟡)

What to call the R-12 field. Richards (F9) and Norman (F11): a shared 'validation' definition with a 'verified' status. Evans (R2-1): that name repeats the confusion the note warns against; name it for I9 (whether the result reached its goal) with statuses open, oracle_verified, operator_ruled. Outcome: which word the operator reads on every record. No arbiter port.

- **Point**: Unresolved conflict (Phase 3) (catalog row 15)
- **Resolution**: default-applied · **Status**: open
- **Default** — Let the counted severity stand (`counted-stands`): The vote's arithmetic stands; nothing changes in the ranking. *Cost*: none
- Rule on the disagreement (`operator-rules`): The operator decides which reading holds; the ruling annotates the ranking. *Cost*: one operator ruling
- **Override**: Rule on the conflict; the ruling annotates the ranking and never changes counted severity. (cost: one operator ruling)
- **Evidence**: F9; R2-1

### Side-notes (flag-only)

- **threshold-boundary**: Moved at exactly the threshold: |net| == T. (F5, F9, F17, F18)
- **unanimous-same-brief**: Unanimous among voters who read the same brief: one datum, not several. (F22)

## Appendix — lens reports

- eric-evans-advisor: `docs/reviews/2026-11-06-chorus-review-2.run.json`
- mark-richards-architect: `docs/reviews/2026-11-06-chorus-review-2.run.json`
- don-norman-advisor: `docs/reviews/2026-11-06-chorus-review-2.run.json`
- test-strategy-advisor: `docs/reviews/2026-11-06-chorus-review-2.run.json`
- eliyahu-goldratt-advisor: `docs/reviews/2026-11-06-chorus-review-2.run.json`
