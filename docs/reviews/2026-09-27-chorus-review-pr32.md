# Chorus review — 2026-09-27

- **Target**: chorus PR #32 and coryphaeus
- **Mode**: design review of the PR's approach, not a line-by-line diff review

**Round context.** Design review of chorus PR #32 (branch suite-review/integration; about 40 files, +1.4k/−2.2k against main) and the new coryphaeus repository. Deltas: seven declared ports in CONDUCTOR; persona replies and records as JSON checked by coryphaeus's validator; mandates removed and the cap of five on every board; seating and the deferral checklist moved into DECISION-PRIMITIVE; three-level severity and six settled vote-count cases; the review procedure rewritten with INTEGRATION-LAYER folded in; persona files reworked; plugin packaging, install manifest, integrity checks and CI; coryphaeus schemas, validator, renderer and port bindings. Out of scope: specs/, tests/parity/, older reviews.

## 1. TL;DR

Five reviewers raised 34 findings and 9 derived ones on PR 32 and coryphaeus; the seams hold in direction, but the contract between the two repositories is unversioned, operator-facing failures are recorded without reaching the operator, and several rules have two authors. The top five: route unresolved conflicts and dropped seats to the operator (F34), make the secret filter prove it ran (F10), fix ruling references that cannot resolve (F18), version the schema contract (F4), and announce unbound ports before the round (F23). Three findings ended at 🔴 (F34, F10, F18); six findings had one voter each and are recorded as minority reports (F1, F8, F15, F19, F21, F27), which keep their authored severity without gating.

## 2. Roster (this round)

| Lens | Persona | Decision | Applies (cited deltas) | Expected stakes | Seat | Reason |
|---|---|---|---|---|---|---|
| tests and simple design | kent-beck-persona | JOIN | coryphaeus validator Stage-4 arithmetic vs GATE-PRIMITIVE prose; 63 node tests: behaviour pinned or shape only; FC4/FC5 integrity checks and CI | 🟡-potential — N = P + C + O now has two authors; can any test see them disagree? | not seated | Rules moved from prose into a program; whether tests corner that move is my ground. |
| user goals and who benefits | alan-cooper-advisor | JOIN | malformed persona JSON silently counts as ABSTAIN (delta 2); Cooper/Security Gate A mandate removed (delta 3); install/uninstall promise to the operator (delta 7) | 🟡-potential — a program-validated JSON contract can drop a seat without telling the solo operator it happened | ordinary | Who the operator is, and what a rejected reply leaves them able to do, both belong to my lens. |
| delivery-and-ops | delivery-and-ops-advisor | JOIN | delta 7: install.sh manifest/uninstall, CI, release = dogfooding; delta 2: Node validator as runtime dependency of a Markdown suite; delta 8: coryphaeus local-only repo, 63 tests, no release path | 🟡-potential — release path and rollback for chorus+coryphaeus pairing unpriced; is CI gate real? | not seated | New runtime code, installer and CI change what it costs to ship, roll back and run the suite. |
| ddd | eric-evans-advisor | JOIN | CONDUCTOR.md § Ports: chorus/coryphaeus context boundary; coryphaeus decision-to-brief translation rules; severity and verdict vocabularies written by personas, matched by validator | 🟡-potential — one word may mean different things across chorus, schema and brief | ordinary | The chorus-coryphaeus split creates a new context seam, and I need to check whether its translation and shared vocabulary are explicit. |
| constraint/scope | eliyahu-goldratt-advisor | JOIN | delta 1: seven ports with defaults, only one provider bound; delta 2: JSON replies plus Node validator and renderer; delta 7: plugin packaging, install manifest, FC4/FC5, CI | 🟡-potential — seven ports and a CI pipeline for a one-operator tool: which part shortens the review verdict loop? | not seated | The PR adds a lot of infrastructure to internal tooling, so someone has to own the cut list. |
| python-idiom | guido-python-reviewer | ABSTAIN | — | 🟢 — no Python in the PR diff or in coryphaeus | not seated | The PR diff and coryphaeus contain zero .py files; the new runtime code is Node, so a Python language lens would only add noise. |
| human-centered design | don-norman-advisor | JOIN | persona replies and records become JSON checked by validate.mjs: what the operator sees when a reply is malformed and silently counts as ABSTAIN; seven ports with defaults: can the operator tell which binding is active; chorus-review rewrite: advisor() fallback and one failure rule, as operator feedback | 🟡-potential — validator failures that turn into ABSTAIN with no signal open a gulf of evaluation for the operator | ordinary | The operator's feedback and failure surfaces change in deltas 2, 1 and 5. |
| architecture | mark-richards-architect | JOIN | seven ports in CONDUCTOR.md as the chorus/coryphaeus seam; JSON schemas as cross-repo contract; Stage-4 arithmetic authored in GATE-PRIMITIVE and validate.mjs; constitution 2.0.0 runtime-code lift | 🔴-potential — Stage-4 rule now has two authors across two repos, with no parity test | ordinary | The PR draws a new cross-repo seam, and contracts at seams are the rule I own. |
| security | security-and-trust-advisor | JOIN | install.sh writes into ~/.claude and uninstalls by manifest; new GitHub Actions CI supply chain; validate.mjs executes on agent-authored JSON; Security Gate A mandate removed; deferral checklist trust column moved | 🟡-potential — new runtime code and install paths widen the trust boundary | ordinary | Delta 7 and delta 2 add executable surface, and delta 3 removes the security mandate that guarded it. |
| clean-architecture | uncle-bob-architect | JOIN | chorus-core/CONDUCTOR.md seven ports: dependency direction, chorus names no other skill; coryphaeus validate.mjs/render.mjs: SRP of validator with Stage-4 arithmetic; rules moved into DECISION-PRIMITIVE and GATE-PRIMITIVE: responsibility boundaries | 🟡-potential — validator also recomputes Stage-4 arithmetic, so two modules may decide one rule | not seated | Ports, dependency inversion and responsibility moves are this lens's home ground. |

Joiners: 9. Quorum: proceed. Seating decision: phase0-5-seating-1.

## 3. Findings register

| ID | Advisor · Lens | Authored severity | Target (locator) | Pull-quote (verbatim) | confidence_on_hand | need_info · reason | graded |
|---|---|---|---|---|---|---|---|
| F1 | mark-richards-architect · architecture | 🔴 | `skill/chorus-core/GATE-PRIMITIVE.md:207-240` | "Two authors of the vote rule, and no alarm when they disagree." | high | — | true |
| F2 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/CONDUCTOR.md:270-278` | "The port contract is written twice and already reads two ways." | high | — | true |
| F3 | mark-richards-architect · architecture | 🟡 | `skill/chorus-review/SKILL.md:159-172` | "The provider is re-deciding a rule the chorus owns." | high | — | true |
| F4 | mark-richards-architect · architecture | 🟡 | `/home/az/code/zaytsevand/coryphaeus/schema/finding-report.schema.json` | "A schema bump would read as ten abstentions, not as a version mismatch." | high | — | true |
| F5 | mark-richards-architect · architecture | 🟡 | `.github/workflows/integrity.yml:1-25` | "The rule-checking program itself goes unchecked." | high | — | true |
| F6 | mark-richards-architect · architecture | 🟢 | `.specify/memory/constitution.md:321-324` | "The direction is right today, and nothing keeps it right tomorrow." | high | — | true |
| F7 | mark-richards-architect · architecture | 🟢 | `.claude-plugin/plugin.json:4-8` | "The manifest describes the previous version of the suite." | high | — | true |
| F8 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/CONDUCTOR.md:266-282` | "The right trade, as long as the drift alarms ship with it." | high | — | true |
| F9 | security-and-trust-advisor · security | 🟡 | `skill/chorus-review/SKILL.md:164-166` | "The memory folder is a back door past the validator." | high | — | true |
| F10 | security-and-trust-advisor · security | 🟡 | `skill/chorus-core/CONDUCTOR.md:406-427` | "A filter that never ran now reads as zero drops." | high | — | true |
| F11 | security-and-trust-advisor · security | 🟡 | `skill/chorus-core/CONDUCTOR.md:274` | "A missing validator fails quietly or blames the wrong party." | high | — | true |
| F12 | security-and-trust-advisor · security | 🟢 | `install.sh:95-103` | "The two delete paths guard differently, and the weak one sets the rule." | high | — | true |
| F13 | security-and-trust-advisor · security | 🟢 | `/home/az/code/zaytsevand/coryphaeus/bin/render.mjs:23` | "Valid JSON is not trusted content." | high | — | true |
| F14 | security-and-trust-advisor · security | 🟢 | `.github/workflows/integrity.yml:3-9` | "This CI has no secrets to leak, and that is correct." | high | — | true |
| F15 | security-and-trust-advisor · security | 🟡 | `skill/chorus-core/DECISION-PRIMITIVE.md:235-237` | "The safety net catches the safer case and misses the worse one." | high | — | true |
| F16 | eric-evans-advisor · ddd | 🟡 | `/home/az/code/zaytsevand/coryphaeus/SKILL.md:102` | "In the chorus 'escalated' means blocked; in the brief it means not blocking, and the glossary skips the one word that flips." | high | — | true |
| F17 | eric-evans-advisor · ddd | 🟡 | `/home/az/code/zaytsevand/coryphaeus/schema/common.schema.json:232-239` | "One row can say held and hold, and they mean uncounted and counted-but-unmoved." | high | — | true |
| F18 | eric-evans-advisor · ddd | 🟡 | `/home/az/code/zaytsevand/coryphaeus/schema/common.schema.json:147` | "The citation key has two spellings, and the reader matches only one of them, locally, and none remotely." | high | — | true |
| F19 | eric-evans-advisor · ddd | 🟡 | `/home/az/code/zaytsevand/coryphaeus/schema/decision.schema.json:5` | "The chorus conforms to the brief, which is right, but nobody wrote it down or checks it." | high | — | true |
| F20 | eric-evans-advisor · ddd | 🟡 | `/home/az/code/zaytsevand/coryphaeus/SKILL.md:83-109` | "The layer translates outbound well; inbound it only knows the day the operator says yes." | high | — | true |
| F21 | eric-evans-advisor · ddd | 🟢 | `/home/az/code/zaytsevand/chorus/.worktrees/suite-review/skill/chorus-core/GATE-PRIMITIVE.md:237` | "The Core has one author and one enforcer; say which one wins, and keep the brief's rules out of it." | high | — | true |
| F22 | alan-cooper-advisor · user goals | 🟡 | `skill/chorus-review/SKILL.md:159-172` | "A seat can disappear mid-round and the operator finds out only from the record." | high | — | true |
| F23 | alan-cooper-advisor · user goals | 🟡 | `skill/chorus-core/CONDUCTOR.md:274` | "The record promises to say 'unvalidated' and has no place to say it." | high | — | true |
| F24 | alan-cooper-advisor · user goals | 🟡 | `install.sh:79-81` | "Dogfooding a release can leave last month's personas installed." | high | — | true |
| F25 | alan-cooper-advisor · user goals | 🟢 | `install.sh:13-16,87-89` | "--force destroys the very customization the installer says it protects." | high | — | true |
| F26 | alan-cooper-advisor · user goals | 🟢 | `install.sh:109-121` | "The installer never mentions the validator the whole redesign rests on." | high | — | true |
| F27 | alan-cooper-advisor · user goals | 🟡 | `skill/chorus-core/DECISION-PRIMITIVE.md:179,226` | "The deferral check still fires, but nobody is assigned to write the strip." | high | — | true |
| F28 | alan-cooper-advisor · user goals | 🟢 | `skill/chorus-review/SKILL.md:314-316,423-433` | "The page serves the operator well, except it cannot say whether the round was validated." | high | — | true |
| F29 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-review/SKILL.md:159-172` | "A broken reply is filed away while it could still be fixed, and the two texts disagree about whether it gets a second chance." | high | — | true |
| F30 | don-norman-advisor · human-centred design | 🟡 | `coryphaeus/SKILL.md:63-64` | "The promise not to fall back silently rests on a free-text note that nothing checks." | high | — | true |
| F31 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-core/CONDUCTOR.md:270-278` | "Two tables tell the operator two different stories about what runs when nothing is bound." | high | — | true |
| F32 | don-norman-advisor · human-centred design | 🟡 | `coryphaeus/bin/render.mjs:66-70` | "The page shows the verdict but hides the numbers that would let a reader check it." | high | — | true |
| F33 | don-norman-advisor · human-centred design | 🟢 | `coryphaeus/bin/validate.mjs:536-540` | "Broken JSON is answered with a usage message, which points the fixer the wrong way." | high | — | true |
| F34 | don-norman-advisor · human-centred design | 🟡 | `skill/chorus-review/SKILL.md:383-387` | "Unresolved for the operator is only a record, not a question the operator is asked." | high | — | true |
| R2-1 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/CONDUCTOR.md:268` | "Nothing says how a port gets bound, so nothing can report it." | high | — | false [ungraded] |
| R2-2 | mark-richards-architect · architecture | 🟡 | `/home/az/code/zaytsevand/coryphaeus/schema/ruling.schema.json:5` | "The ruling shape is copied field for field, and nothing notices when the original moves." | high | — | false [ungraded] |
| R2-3 | security-and-trust-advisor · security | 🟡 | `/home/az/code/zaytsevand/coryphaeus/bin/validate.mjs:204-225` | "The operator's authority is cited by id, and nobody checks the id." | high | — | false [ungraded] |
| R2-4 | security-and-trust-advisor · security | 🟢 | `install.sh:78-84` | "The chorus trusts the persona's name, not its text." | high | — | false [ungraded] |
| R2-5 | eric-evans-advisor · ddd | 🟡 | `/home/az/code/zaytsevand/coryphaeus/SKILL.md:53` | "'Unbound' covers two states, and the round actually has three." | high | — | false [ungraded] |
| R2-6 | alan-cooper-advisor · user goals | 🟡 | `install.sh:120-121` | "The installer tells the user to commit the file the next round does not read." | high | — | false [ungraded] |
| R2-7 | alan-cooper-advisor · user goals | 🟡 | `skill/chorus-review/SKILL.md:220-223` | "The abort's advice is to wait, and waiting does not fix a broken validator." | high | — | false [ungraded] |
| R2-8 | don-norman-advisor · human-centred design | 🟡 | `install.sh:79-81` | "Every agent file says 'keep', whether it is current or stale." | high | — | false [ungraded] |
| R2-9 | don-norman-advisor · human-centred design | 🟡 | `/home/az/code/zaytsevand/coryphaeus/schema/common.schema.json:171` | "A single version mismatch is shown as five personas failing separately." | high | — | false [ungraded] |

Converging lenses, in their own words:

- **F2**
  - eric-evans-advisor: "The port table exists twice and means two things by 'unbound'."
  - alan-cooper-advisor: "One contract, one table."
  - don-norman-advisor: "Whichever table the operator reads first becomes their model of what runs."
- **F3**
  - alan-cooper-advisor: "Decide the retry once, in the chorus."
  - don-norman-advisor: "One rule owned in one place is also one story told to the user."
- **F4**
  - security-and-trust-advisor: "A version mismatch has to name itself, or it blames the personas."
  - alan-cooper-advisor: "A version mismatch is blamed on the personas, and the advice is to wait."
  - don-norman-advisor: "A version bump shows up as a row of abstentions, and the operator will look for the fault in the personas."
- **F7**
  - alan-cooper-advisor: "Every surface the user reads first still describes the old artifact."
- **F9**
  - mark-richards-architect: "The memory folder is a second report channel, and it skips the gate."
- **F10**
  - don-norman-advisor: "A filter that never ran is reported as a clean pass, so the page itself is wrong."
- **F11**
  - mark-richards-architect: "An absent validator and an absent version pin fail the same quiet way."
  - alan-cooper-advisor: "An unvalidated round has to announce itself."
- **F15**
  - alan-cooper-advisor: "Removing the mandates left the side-note carrying more than it can."
- **F17**
  - don-norman-advisor: "Two near-identical words for uncounted and counted-but-unmoved, on a page that hides the counts."
- **F18**
  - security-and-trust-advisor: "A citation nobody resolves can speak with the operator's authority."
- **F19**
  - mark-richards-architect: "Conforming to the brief without a drift check is only a promise."
- **F21**
  - mark-richards-architect: "Two authors of one rule need a tiebreak written down."
- **F22**
  - don-norman-advisor: "The seat vanishes during the round, and the operator hears about it only after the round is over."
- **F23**
  - security-and-trust-advisor: "An unvalidated round that cannot say so reads as validated."
  - eric-evans-advisor: "A fallback is an event the round lives through, and the record has no word for it."
  - don-norman-advisor: "The record promises a label it has no field for."
- **F29**
  - alan-cooper-advisor: "The reply is filed away while it could still be fixed."
- **F30**
  - eric-evans-advisor: "Free text is where a model puts the things it has not named yet."
  - alan-cooper-advisor: "A fallback the page cannot show is a silent fallback."
- **F31**
  - mark-richards-architect: "One port table, two stories, the defaults already disagree."
- **F34**
  - eric-evans-advisor: "Unresolved should be a decision the sink carries, not a line in the record."
  - alan-cooper-advisor: "A log line is not a next step, and a card with a default is."
- **R2-1** (derived from F23)
- **R2-2** (derived from F19)
- **R2-3** (derived from F18)
- **R2-4** (derived from F24)
- **R2-5** (derived from F2)
- **R2-6** (derived from F7)
- **R2-7** (derived from F4)
- **R2-8** (derived from F24)
- **R2-9** (derived from F4)

## 4. Consolidation matrix

`net = P − O` over non-author voters (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = P + C.

| ID | Authored severity | P | C | O | net | Final severity | Convergence (P + C) | Status |
|---|---|---|---|---|---|---|---|---|
| F1 | 🔴 | 0 | 0 | 1 | — | 🔴 | — | minority-report |
| F2 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F3 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F4 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F5 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| F6 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F7 | 🟢 | 1 | 2 | 0 | 1 | 🟡 | 3 | graded |
| F8 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F9 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F10 | 🟡 | 1 | 2 | 0 | 1 | 🔴 | 3 | graded |
| F11 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F12 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F13 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F14 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F15 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F16 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F17 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| F18 | 🟡 | 1 | 1 | 0 | 1 | 🔴 | 2 | graded |
| F19 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F20 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| F21 | 🟢 | 1 | 0 | 0 | — | 🟢 | — | minority-report |
| F22 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F23 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F24 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F25 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F26 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F27 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F28 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F29 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F30 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F31 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F32 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F33 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F34 | 🟡 | 1 | 2 | 0 | 1 | 🔴 | 3 | graded |
| R2-1 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-2 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-3 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-4 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-5 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-6 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-7 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-8 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-9 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |

## 5. Conflicts

No genuine conflicts this round; phase skipped.

## 6. Top five

1. **F34** 🔴 — "Unresolved for the operator is only a record, not a question the operator is asked." `skill/chorus-review/SKILL.md:383-387`
   Cost low · Value: Turns recorded failures into questions the operator can answer; stops seats and conflicts vanishing silently. · Convergence 3
2. **F10** 🔴 — "A filter that never ran now reads as zero drops." `skill/chorus-core/CONDUCTOR.md:406-427`
   Cost low · Value: A filter that never ran stops looking like a clean pass. · Convergence 3
3. **F18** 🔴 — "The citation key has two spellings, and the reader matches only one of them, locally, and none remotely." `/home/az/code/zaytsevand/coryphaeus/schema/common.schema.json:147`
   Cost medium · Value: Ruling references resolve in one spelling; operator answers found by lookup are real. · Convergence 2
4. **F4** 🟡 — "A schema bump would read as ten abstentions, not as a version mismatch." `/home/az/code/zaytsevand/coryphaeus/schema/finding-report.schema.json`
   Cost medium · Value: A schema change fails as a version mismatch instead of five malformed seats and a quorum abort. · Convergence 4
5. **F23** 🟡 — "The record promises to say 'unvalidated' and has no place to say it." `skill/chorus-core/CONDUCTOR.md:274`
   Cost low · Value: The operator learns before the round which ports are bound and what runs unvalidated. · Convergence 4

## 7. Held findings and minority reports

None.

**Minority reports** (one voter each; not counted, never gating, authored severity kept):

- **F1** 🔴 — "Two authors of the vote rule, and no alarm when they disagree." `skill/chorus-core/GATE-PRIMITIVE.md:207-240` (P 0 · C 0 · O 1)
- **F8** 🟡 — "The right trade, as long as the drift alarms ship with it." `skill/chorus-core/CONDUCTOR.md:266-282` (P 0 · C 1 · O 0)
- **F15** 🟡 — "The safety net catches the safer case and misses the worse one." `skill/chorus-core/DECISION-PRIMITIVE.md:235-237` (P 0 · C 1 · O 0)
- **F19** 🟡 — "The chorus conforms to the brief, which is right, but nobody wrote it down or checks it." `/home/az/code/zaytsevand/coryphaeus/schema/decision.schema.json:5` (P 0 · C 1 · O 0)
- **F21** 🟢 — "The Core has one author and one enforcer; say which one wins, and keep the brief's rules out of it." `/home/az/code/zaytsevand/chorus/.worktrees/suite-review/skill/chorus-core/GATE-PRIMITIVE.md:237` (P 1 · C 0 · O 0)
- **F27** 🟡 — "The deferral check still fires, but nobody is assigned to write the strip." `skill/chorus-core/DECISION-PRIMITIVE.md:179,226` (P 0 · C 1 · O 0)

## 8. Next-chorus baseline

**Assume closed**: Dependency direction: the chorus canon names neither coryphaeus nor the brief (F6, confirmed).

**In progress**: Operator questions Q-18 to Q-22 in the suite-review brief; findings conditional on A1 to A4.

**Re-evaluate**: Stage-4 parity between GATE-PRIMITIVE and validate.mjs (F1, F21) once one-voter findings have a defined status.; Seating default: Beck, Uncle Bob, Delivery and Goldratt were out-seated by a tie (Q-18).

### Decisions

#### phase0-5-seating-1 — Default panel for a seven-way tie at seats three to five (🟡)

Nine reviewers joined a panel capped at five; seven tied on cited deltas and stakes for the last three seats.

- **Point**: RSVP seating — tie at the cap (catalog row 2)
- **Sensor**: two-axis RSVP sort → non-strict order at the fifth seat (docs/reviews/pr32/rsvp/: Richards and Security 4 deltas; seven at 3 deltas, all 🟡.)
- **Resolution**: default-applied · **Status**: open
- **Default** — Keep the default panel (roster order) (`keep-default`): Seat Evans, Cooper and Norman beside Richards and Security. *Cost*: None.
- Swap Beck and Goldratt in for Cooper and Norman (`swap-beck-goldratt`): Re-run from Round 1 with the swapped panel. *Cost*: Two new Round 1 reports and a re-vote.
- **Override**: Rule on the brief entry; the round re-runs from Round 1. (cost: Two dispatches per swapped reviewer.)
- **Published as**: Q-18 (docs/briefs/suite-review/brief.json)
- **Evidence**: docs/reviews/pr32/rsvp/ — Ten validated joining replies.

#### phase2-below-quorum-1 — Findings with only one voter have no defined status (🔴)

Six findings (F1, F8, F15, F19, F21, F27) received exactly one non-author vote. Stage 4 forbids counting at N < 2 but defines no status for them, and the schema has none, so the record cannot validate.

- **Point**: Tally of a finding with fewer than two voters (unlisted)
- **Sensor**: validator: a tally must not run at N < 2 → unlisted decision point, band forced to 🔴 (docs/reviews/pr32/draft-record.json: Six tally rows rejected.)
- **Resolution**: escalated · **Status**: decided
- **Default** — Add a "minority report" status: keeps its severity, does not block, listed apart (`minority-report`): One status in Stage 4, the schema and the validator; the six findings keep their authored severity and are listed separately. *Cost*: A line in Stage 4, one enum value, one validator branch and a test.
- Re-ask the other seated reviewers to vote on those six (`reask-voters`): Get N to two or more before counting. *Cost*: One short dispatch per reviewer.
- **Chosen**: `minority-report` on 2026-09-27 — Operator: "Add a minority report status" (brief Q-23).
- **Operator ruling**: Q-23 (docs/briefs/suite-review/brief.json)
- **Published as**: Q-23 (docs/briefs/suite-review/brief.json)
- **Evidence**: skill/chorus-core/GATE-PRIMITIVE.md § Stage 4 — "a tally MUST NOT run at N < 2", no status given.

### Side-notes (flag-only)

- **missing-scope-lens**: Goldratt (scope) was out-seated by the seating tie on a new buildout (coryphaeus); Beck (tests) likewise, although three joiners named program-versus-prose parity.
- **other**: The Round 2 brief asked for derived ids R2-<name>-n, which the schema rejects; four lenses noticed and used R2-n. The conductor renumbered them R2-1 to R2-9.

### Operator rulings relied on

- R-1 (docs/briefs/suite-review/brief.json)
- R-2 (docs/briefs/suite-review/brief.json)
- R-3 (docs/briefs/suite-review/brief.json)
- R-5 (docs/briefs/suite-review/brief.json)
- R-7 (docs/briefs/suite-review/brief.json)
- R-10 (docs/briefs/suite-review/brief.json)

## Appendix — lens reports

- alan-cooper-advisor: `docs/reviews/pr32/rsvp/cooper.json`, `docs/reviews/pr32/r1/cooper.json`, `docs/reviews/pr32/r2/cooper.json`
- don-norman-advisor: `docs/reviews/pr32/rsvp/norman.json`, `docs/reviews/pr32/r1/norman.json`, `docs/reviews/pr32/r2/norman.json`
- eric-evans-advisor: `docs/reviews/pr32/rsvp/evans.json`, `docs/reviews/pr32/r1/evans.json`, `docs/reviews/pr32/r2/evans.json`
- mark-richards-architect: `docs/reviews/pr32/rsvp/richards.json`, `docs/reviews/pr32/r1/richards.json`, `docs/reviews/pr32/r2/richards.json`
- security-and-trust-advisor: `docs/reviews/pr32/rsvp/security.json`, `docs/reviews/pr32/r1/security.json`, `docs/reviews/pr32/r2/security.json`
