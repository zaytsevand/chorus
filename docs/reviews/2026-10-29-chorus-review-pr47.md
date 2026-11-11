# Chorus review — 2026-10-29

- **Target**: PRs #45+#47 (branch worktree-scripted-spine @ be31e5c vs main 7eea2c2): coryphaeus folded into chorus-core; conductor as a program (conduct.mjs/engine.mjs), vocab registry, run-log schema
- **Mode**: design review of the PR's approach, not a line-by-line diff review
- **Baseline**: docs/reviews/2026-09-27-chorus-review-pr32.json

**Round context.** Since the PR32 round (2026-09-27, last record): #45 renames skill/coryphaeus/{schema,bin,test,examples} into skill/chorus-core/, deletes skill/coryphaeus, adds chorus-core/BINDINGS.md + bin/bindings.mjs (problem-brief detection via cwd/.claude/skills, CLAUDE_HOME, CHORUS_SKILL_PATH), rewrites FC6, install.sh RETIRED_SKILLS cleanup (renames edited SKILL.md to SKILL.md.retired), plugin.json down to four skills. #47 adds bin/conduct.mjs (764 lines, append-only <stem>.run.json, next/submit/fail/ack/answer/record, exit codes 0/1/2/3), bin/engine.mjs (pure rule functions citing canon sections), schema/vocab.schema.json + bin/vocab.mjs, schema/run-log.schema.json, test/vocab-lint.test.mjs, test/kit.mjs + scripted e2e; CONDUCTOR.md gains § The conductor loop; chorus-review/sdlc SKILL.md now say run conduct.mjs. 56 files, +2975/-445. Spec specs/018-scripted-spine/spec.md. Observed in dogfood install 2026-10-29: vocab-lint roster test fails inside ~/.claude (reads repo-root .claude-plugin/plugin.json); pre-manifest stale copies of SKILL.md files were skipped by install.sh until --force; docs/reviews/CHORUS-PROJECT.md still names skill/coryphaeus as composition root. Not yet run live with real persona agents before this round. Mode: design review of the PRs' approach, not a line-by-line diff review. Budgets: RSVP 3m, exploratory 15m, R1 15m, R2 10m.

**Bindings.** decision-sink: problem-brief · ruling-lookup: problem-brief · record-validator: chorus-core · record-renderer: chorus-core · arbiter: default · fixed-viewpoint: default · memory-recall: default

**Recovered without asking.** none

**Secret filter.** not run (The canonical pre-filter did not run; the conductor grepped the five new memory files and the run log for home paths, names, emails, tokens and secrets and found none.).

## 1. TL;DR

Five seated lenses (architecture, product, HCD, clean code, delivery-ops) found the scripted spine and the coryphaeus fold sound in the code but leaky at the edges: 35 findings and 11 derived, clustered on the upgrade path, the canon-vs-code authority wording, and the Node requirement. The top five are the silent mixed-version upgrade (F29), the inverted authority wording that tells agents to patch the installed script (F20), the committed run log failing CI (R2-11, ungraded), the stale Node-less fallback (F7), and conduct refusals that give the agent no recovery step (F15). The 🔴 findings F29, F8, F14, F9, F20, F7 and F15 gate merging #45/#47 for strangers; C1 (F9 vs F28 cohort), C2 (F20 harm) and C3 (F7 behaviour) are unresolved and await the operator.

## 2. Roster (this round)

| Lens | Persona | Decision | Applies (cited deltas) | Expected stakes | Seat | Reason |
|---|---|---|---|---|---|---|
| ddd | eric-evans-advisor | JOIN | #47 vocab.schema.json + vocab.mjs: one vocabulary registry is the Ubiquitous Language made executable; #47 run-log.schema.json: agent-script seam is a Published Language; #45 coryphaeus->chorus-core rename; CHORUS-PROJECT.md still names coryphaeus | 🟡-potential — Does the vocab registry own meaning, or do conduct.mjs and canon each mint the same terms privately? | not seated | New vocabulary authority and agent-script contract are exactly the language and seam questions my lens owns. |
| architecture | mark-richards-architect | JOIN | #47 engine.mjs/conduct.mjs encode rules that CONDUCTOR.md/GATE-PRIMITIVE.md also state: duplicate authority, canon vs script; #47 run-log.schema.json is the new agent-script seam contract; #45 vocab-lint and bindings.mjs couple to repo-root layout, which breaks in an install | 🔴-potential — Prose canon and the script engine now both own the conductor rules, and no parity check catches drift between them | ordinary | The ranked qualities come from the context. Seams, contracts and duplicate-authority rulings are this lens's work. |
| product | alan-cooper-advisor | JOIN | install.sh skips pre-manifest stale SKILL.md copies as 'not ours' until --force: upgrader silently keeps old skills; conduct.mjs exit codes 0/1/2/3 and fail/ack/answer verbs: a user-facing promise whose legibility is unproven; vocab-lint roster test fails inside an install | 🔴-potential — A stranger who upgrades gets no warning that they are still running the old chorus. | ordinary | Installer silence and the new CLI contract hit the operator first, and the round context says installer findings count at full severity. |
| hcd | don-norman-advisor | JOIN | #47 conduct.mjs exit codes 0/1/2/3 + run.json: the agent/operator feedback surface; install.sh skips stale pre-manifest SKILL.md as 'not ours' unless --force, so upgraders silently keep old skills; CHORUS-PROJECT.md still names skill/coryphaeus: the docs and the runtime disagree | 🔴-potential — A stranger who upgrades keeps the old skills and gets no signal: the gulf of evaluation sits at the installer | ordinary | New CLI exit-code contract, installer feedback and stale docs are all feedback and mental-model gaps a user hits |
| clean-code | uncle-bob-architect | JOIN | #47 bin/conduct.mjs: 764 lines carrying seven commands, the run-log I/O and the exit-code policy; #47 engine.mjs pure rules vs conduct.mjs effects: where the seam sits; #47 vocab.mjs + vocab-lint: one registry vs magic strings; #45 bindings.mjs: discovery across three paths | 🟡-potential — Is conduct.mjs one module with seven reasons to change, and does engine.mjs really stay pure? | ordinary | New Node modules with clear SRP, purity and dependency-direction questions |
| tdd | kent-beck-persona | JOIN | #47 vocab.mjs as the one vocabulary registry, plus vocab-lint.test.mjs: can the tests see two copies disagree?; vocab-lint roster test reads repo-root plugin.json and fails inside an install, so it can't be cornered without the environment; engine.mjs pure rules vs the 764-line conduct.mjs: which behaviour the e2e kit actually pins | 🟡-potential — a registry is only one author if a test can tell when a second author shows up | not seated | New Node tooling with tests and a single-authority claim. That's squarely the duplication-the-tests-can't-see lens. |
| test-strategy | test-strategy-advisor | JOIN | #47 test/vocab-lint.test.mjs roster check fails inside an install (reads repo-root plugin.json); #47 run-log.schema.json agent-script seam plus test/kit.mjs scripted e2e | 🟡-potential — A repo-only check ships into installs, and the agent-to-conduct.mjs seam may be proven only by scripted e2e runs, with no contract test pinning each side. | not seated | A new seam, a new e2e kit and a check running in the wrong place: all three are placement questions. |
| delivery-ops | delivery-and-ops-advisor | JOIN | install.sh RETIRED_SKILLS + 'not ours' skip: upgrade silently keeps stale skills until --force; vocab-lint test reads repo-root plugin.json, fails in installed copy; conduct.mjs exit codes 0/1/2/3 + append-only run.json: first live run | 🔴-potential — Upgrade path for strangers is unverified: the stale-skill skip fails silently, and nothing in the gate checks the installed copy | ordinary | Release/upgrade path and gate realism are core delivery-ops remit |
| security | security-and-trust-advisor | JOIN | bindings.mjs resolves problem-brief first from <cwd>/.claude/skills: the reviewed repo can plant the skill the conductor runs; install.sh RETIRED_SKILLS rm/mv under $CLAUDE_HOME plus the 'not ours' upgrade skip; SKILL.md now instructs running conduct.mjs: a canon capability grant | 🟡-potential — Who picks the code the chair executes: the reviewed repo's cwd or the install? | not seated | Three deltas cross the install/untrusted-repo trust boundary. |
| constraint-flow | eliyahu-goldratt-advisor | JOIN | #47: 764-line conduct.mjs + engine + vocab registry (56 files, +2975) shipped before its first live run, which is this round; Dogfood: install.sh silently keeps stale skills on upgrade; vocab-lint fails in an install | 🟡-potential — Who is Herbie: the scripted spine, or the stranger's install/upgrade path that drops them before any spine runs? | not seated | Batch size and constraint location are mine; nobody else is tasked with the cut list. |

Joiners: 10. Quorum: proceed. Seating decision: seating-1.

## 3. Findings register

| ID | Advisor · Lens | Authored severity | Target (locator) | Pull-quote (verbatim) | confidence_on_hand | need_info · reason | graded |
|---|---|---|---|---|---|---|---|
| F1 | mark-richards-architect · architecture | 🟡 | `skill/chorus-review/SKILL.md:68` | "The suite now has one rule with two authors, and each says the other must yield." | high | — | true |
| F2 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/test/canon-drift.test.mjs:80` | "Prose that restates a number the code owns needs a test that fails when the two disagree." | high | — | true |
| F3 | mark-richards-architect · architecture | 🟡 | `install.sh:140` | "A test that only makes sense in the repo is shipping to users and failing there." | high | — | true |
| F4 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/schema/run-log.schema.json:89` | "Refusing a log from another version needs the log to say which version wrote it." | high | — | true |
| F5 | mark-richards-architect · architecture | 🟢 | `skill/chorus-core/bin/bindings.mjs:26` | "The binding probe knows the install.sh layout and nothing about plugin installs." | high | — | true |
| F6 | mark-richards-architect · architecture | 🟢 | `docs/reviews/CHORUS-PROJECT.md:106` | "The fold produced one root; only the addendum still describes the old one." | high | — | true |
| F7 | alan-cooper-advisor · product | 🔴 | `install.sh:188` | "The only written fallback for a stranger without Node is the free-hand round this PR exists to abolish." | high | — | true |
| F8 | alan-cooper-advisor · product | 🔴 | `install.sh:130` | "An upgrade that leaves the entry skill stale exits 0 and says 'spawn the chorus'." | high | — | true |
| F9 | alan-cooper-advisor · product | 🟡 | `install.sh:151` | "The oldest installs keep a retired skill loading, and the installer never mentions it." | high | — | true |
| F10 | alan-cooper-advisor · product | 🟡 | `skill/chorus-core/bin/conduct.mjs:355` | "A halted record says it awaits the operator who has already answered, and names no way forward." | high | — | true |
| F11 | alan-cooper-advisor · product | 🟡 | `skill/chorus-review/SKILL.md:67` | "'The script is fixed' is a maintainer's chore written into a stranger's runtime instructions." | high | — | true |
| F12 | alan-cooper-advisor · product | 🟡 | `install.sh:140` | "Shipping a test that is red in every install plants a false alarm on the user's disk." | high | — | true |
| F13 | alan-cooper-advisor · product | 🟢 | `specs/018-scripted-spine/spec.md:26` | "The spine delivers about three quarters of its headline; what it lacks is one real persona reply." | high | — | true |
| F14 | don-norman-advisor · hcd | 🔴 | `install.sh:130` | "An upgrade that keeps the old entry point and exits 0 tells the upgrading agent it succeeded when it did not." | high | — | true |
| F15 | don-norman-advisor · hcd | 🟡 | `skill/chorus-core/bin/conduct.mjs:596` | "The refusal describes the batch's state, not this persona's, so the agent cannot tell what to do next." | high | — | true |
| F16 | don-norman-advisor · hcd | 🟡 | `skill/chorus-core/schema/run-log.schema.json:93` | "A mistake made at init is reported only when the record is written, after the round's work is spent." | high | — | true |
| F17 | don-norman-advisor · hcd | 🟡 | `skill/chorus-core/bin/conduct.mjs:746` | "One exit code carries four meanings, so the agent has to read English to know which recovery applies." | high | — | true |
| F18 | don-norman-advisor · hcd | 🟡 | `install.sh:188` | "The installer still says a round can run without Node, which the skill it installs can no longer do." | high | — | true |
| F19 | don-norman-advisor · hcd | 🟢 | `skill/chorus-core/bin/conduct.mjs:155` | "The abort page cannot show that a re-ask happened, so the operator cannot tell one refusal from two." | high | — | true |
| F20 | uncle-bob-architect · clean-code | 🔴 | `skill/chorus-review/SKILL.md:67` | "The docs tell the agent to fix the authority to match its description." | high | — | true |
| F21 | uncle-bob-architect · clean-code | 🟡 | `skill/chorus-core/bin/conduct.mjs:213` | "S11 routing is a rule hiding inside the sequencer." | high | — | true |
| F22 | uncle-bob-architect · clean-code | 🟡 | `skill/chorus-core/bin/conduct.mjs:537` | "Position in a list is a magic number with better manners." | high | — | true |
| F23 | uncle-bob-architect · clean-code | 🟡 | `skill/chorus-core/bin/conduct.mjs:589` | "appendTo does not append; it rewrites the only copy in place." | high | — | true |
| F24 | uncle-bob-architect · clean-code | 🟡 | `skill/chorus-core/bin/conduct.mjs:160` | "The roster in the record is seat() plus edits nobody names." | high | — | true |
| F25 | uncle-bob-architect · clean-code | 🟡 | `install.sh:140` | "A repo-only test is shipped to a place without the repo." | high | — | true |
| F26 | uncle-bob-architect · clean-code | 🟢 | `skill/chorus-core/bin/conduct.mjs:687` | "text() reads files; the name does not admit it." | high | — | true |
| F27 | uncle-bob-architect · clean-code | 🟢 | `skill/chorus-core/bin/conduct.mjs:711` | "The lint guards comparisons; values still slip through as strings." | high | — | true |
| F28 | delivery-and-ops-advisor · delivery-ops | 🔴 | `install.sh:150` | "An install from before the manifest existed keeps coryphaeus loading next to chorus-core, and the installer exits 0 without a word." | high | — | true |
| F29 | delivery-and-ops-advisor · delivery-ops | 🔴 | `install.sh:130` | "A skipped SKILL.md inside our own skill is a silent mixed-version install, and exit 0 tells the upgrading agent it worked." | high | — | true |
| F30 | delivery-and-ops-advisor · delivery-ops | 🟡 | `install.sh:139` | "CI proves the repo works; nothing proves the installed copy does." | high | — | true |
| F31 | delivery-and-ops-advisor · delivery-ops | 🟡 | `.claude-plugin/plugin.json:3` | "An installed copy cannot say which version it is, so neither the bug report nor the upgrading agent can." | high | — | true |
| F32 | delivery-and-ops-advisor · delivery-ops | 🟢 | `CONTRIBUTING.md:89` | "The way back works today, but nothing writes it down or keeps it working." | high | — | true |
| F33 | delivery-and-ops-advisor · delivery-ops | 🟡 | `skill/chorus-core/bin/conduct.mjs:589` | "A torn run log is reported as the caller's usage error, and the round's replies go with it." | high | — | true |
| F34 | delivery-and-ops-advisor · delivery-ops | 🟢 | `skill/chorus-core/bin/conduct.mjs:667` | "A bad init answers with a stack trace and the wrong exit code." | high | — | true |
| F35 | delivery-and-ops-advisor · delivery-ops | 🟡 | `README.md:294` | "The floor is 20 now, but ten places still say 18 and the installer checks neither." | high | — | true |
| R2-1 | mark-richards-architect · architecture | 🟡 | `skill/chorus-core/CONDUCTOR.md:343` | "Code owns the rules now, so the rules need one home inside the code." | high | — | false [ungraded] |
| R2-2 | mark-richards-architect · architecture | 🔴 | `install.sh:97` | "Prose and program are one contract, yet they install and fail as separate files." | high | — | false [ungraded] |
| R2-3 | alan-cooper-advisor · product | 🔴 | `install.sh:125` | "Obey the doc once, and every later upgrade silently keeps your patched copy of the program." | high | — | false [ungraded] |
| R2-4 | alan-cooper-advisor · product | 🟡 | `README.md:1` | "The only feedback channel has no door marked for the stranger who needs it." | high | — | false [ungraded] |
| R2-5 | alan-cooper-advisor · product | 🟢 | `install.sh:72` | "The retired-skill cohort I named barely exists; the stale-entry-skill cohort does." | high | — | false [ungraded] |
| R2-6 | don-norman-advisor · hcd | 🟡 | `skill/chorus-core/bin/conduct.mjs:358` | "The page says the run awaits the operator; the code has already closed the door." | high | — | false [ungraded] |
| R2-7 | don-norman-advisor · hcd | 🟢 | `skill/chorus-core/CONDUCTOR.md:290` | "Three files tell the agent three different places the tools might be." | high | — | false [ungraded] |
| R2-8 | uncle-bob-architect · clean-code | 🟡 | `skill/chorus-core/bin/conduct.mjs:597` | "The one vocabulary left out of the registry is the one the agent branches on." | high | — | false [ungraded] |
| R2-9 | uncle-bob-architect · clean-code | 🟡 | `skill/chorus-core/schema/run-log.schema.json:93` | "One field, two schemas, two minimums: a duplicated authority." | high | — | false [ungraded] |
| R2-10 | delivery-and-ops-advisor · delivery-ops | 🟡 | `install.sh:124` | "An agent told to fix the installed script freezes that file out of every later upgrade." | high | — | false [ungraded] |
| R2-11 | delivery-and-ops-advisor · delivery-ops | 🔴 | `.github/workflows/integrity.yml:36` | "The run log this PR tells you to commit fails the CI gate this PR keeps." | high | — | false [ungraded] |

Converging lenses, in their own words:

- **R2-1** (derived from F21)
- **R2-2** (derived from F29)
- **R2-3** (derived from F20)
- **R2-4** (derived from F31)
- **R2-5** (derived from F28)
- **R2-6** (derived from F10)
- **R2-7** (derived from F5)
- **R2-8** (derived from F17)
- **R2-9** (derived from F16)
- **R2-10** (derived from F20)
- **R2-11** (derived from F4)

## 4. Consolidation matrix

`net = P − O` over non-author voters (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = P + C.

| ID | Authored severity | P | C | O | net | Final severity | Convergence (P + C) | Status |
|---|---|---|---|---|---|---|---|---|
| F1 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F2 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F3 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F4 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F5 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F6 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F7 | 🔴 | 0 | 3 | 1 | -1 | 🔴 | 3 | graded |
| F8 | 🔴 | 0 | 4 | 0 | 0 | 🔴 | 4 | graded |
| F9 | 🟡 | 2 | 2 | 0 | 2 | 🔴 | 4 | graded |
| F10 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F11 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F12 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F13 | 🟢 | 0 | 1 | 0 | — | 🟢 | — | minority-report |
| F14 | 🔴 | 0 | 4 | 0 | 0 | 🔴 | 4 | graded |
| F15 | 🟡 | 1 | 1 | 0 | 1 | 🔴 | 2 | graded |
| F16 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F17 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F18 | 🟡 | 1 | 3 | 0 | 1 | 🟡 | 4 | graded |
| F19 | 🟢 | 0 | 1 | 0 | — | 🟢 | — | minority-report |
| F20 | 🔴 | 0 | 3 | 1 | -1 | 🔴 | 3 | graded |
| F21 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F22 | 🟡 | 0 | 0 | 0 | 0 | 🟡 | 0 | unvoted |
| F23 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F24 | 🟡 | 0 | 0 | 0 | 0 | 🟡 | 0 | unvoted |
| F25 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F26 | 🟢 | 0 | 0 | 0 | 0 | 🟢 | 0 | unvoted |
| F27 | 🟢 | 0 | 0 | 0 | 0 | 🟢 | 0 | unvoted |
| F28 | 🔴 | 0 | 2 | 2 | -2 | 🟡 | 2 | graded |
| F29 | 🔴 | 0 | 4 | 0 | 0 | 🔴 | 4 | graded |
| F30 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F31 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F32 | 🟢 | 0 | 4 | 0 | 0 | 🟢 | 4 | graded |
| F33 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F34 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F35 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| R2-1 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-2 | 🔴 | — | — | — | — | 🔴 | — | ungraded [ungraded] |
| R2-3 | 🔴 | — | — | — | — | 🔴 | — | ungraded [ungraded] |
| R2-4 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-5 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-6 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-7 | 🟢 | — | — | — | — | 🟢 | — | ungraded [ungraded] |
| R2-8 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-9 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-10 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-11 | 🔴 | — | — | — | — | 🔴 | — | ungraded [ungraded] |

## 5. Conflicts

- **C1** — alan-cooper-advisor vs mark-richards-architect vs don-norman-advisor vs delivery-and-ops-advisor on F9, F28: Whether any install.sh user has a retired coryphaeus skill without a manifest. Cooper (OVER-RATE F28): coryphaeus/SKILL.md and the install manifest arrived in the same commit (#32, 8d16107), so the cohort is near-empty; Richards: the harm is clutter, not wrong records. Norman and Delivery-and-Ops (PRIORITIZE F9): a pre-manifest copy keeps a second skill claiming the validator/renderer role. Outcome differs: install.sh must or need not retire coryphaeus without the manifest. Same defect counted twice: F9 escalated to 🔴, F28 demoted to 🟡.
  - Unresolved for the operator
- **C2** — don-norman-advisor vs uncle-bob-architect vs mark-richards-architect vs delivery-and-ops-advisor vs alan-cooper-advisor on F20, F1, F11: How much harm 'the script is fixed' (chorus-review/SKILL.md:67) does in a stranger's install. Norman (OVER-RATE F20): it fires only when an agent detects a disagreement mid-round; F1 and F11 price the same root at 🟡. Others hold 🔴: Delivery-and-Ops and Cooper derive (R2-) that a patched installed conduct.mjs is then kept as 'differs, kept' on every upgrade with exit 0. Outcome differs: fix before merge (gating) or as follow-up.
  - Unresolved for the operator
- **C3** — mark-richards-architect vs alan-cooper-advisor vs don-norman-advisor on F7, F18: What a Node-less agent actually does. Richards (OVER-RATE F7): the installed SKILL.md routes every round through conduct.mjs, so it fails at the first command — 🟡, same as F18. Cooper and Norman: BINDINGS.md:20-22 sends the agent to the 'Free-hand form', so it runs an unscripted round. Outcome differs: a loud failure vs a silent unscripted round.
  - Unresolved for the operator

## 6. Top five

1. **F29** 🔴 — "A skipped SKILL.md inside our own skill is a silent mixed-version install, and exit 0 tells the upgrading agent it worked." `install.sh:130`
   Cost medium · Value: Every upgrader from before #32 ends with a mixed-version skill and exit 0; the operator ruled upgrades are agent-run, so exit 0 is read as success. Same locator as F8 and F14 (install.sh:130); Richards' R2-2 names the shared cause (file-by-file install of one contract). Fix: exit non-zero and name each skipped shipped file; recognise known shipped versions. · Constitutional ROI: VII Block on 🔴, Never Silently — the installer passes silently over a broken install. · Convergence 4
2. **F20** 🔴 — "The docs tell the agent to fix the authority to match its description." `skill/chorus-review/SKILL.md:67`
   Cost low · Value: Six or seven sentences say the canon wins and the script is fixed, against the operator's ruling that code is the authority (F1, F11 same root). Unblocks the drift test of F2 and removes the instruction whose consequence R2-3/R2-10 show: a patched installed conduct.mjs is frozen out of every later upgrade. · Constitutional ROI: I One Canonical Definition: Cite, Never Restate — the authority must be named once, the right way round. · Convergence 3 · C2 unresolved (Norman OVER-RATE vs four 🔴 holders); counted severity stands.
3. **R2-11** [ungraded] 🔴 — "The run log this PR tells you to commit fails the CI gate this PR keeps." `.github/workflows/integrity.yml:36`
   Cost low · Value: [ungraded] Committing this round's own run.json, as CONDUCTOR.md:342 directs, turns CI red (integrity.yml:36 validates every docs/reviews/*.json as a review-record). One-line fix; blocks committing any scripted round and the dogfood-before-release step. · Constitutional ROI: X Validate the Procedure, Not the Artifact — the procedure's own trail must pass its gate. · Convergence 0
4. **F7** 🔴 — "The only written fallback for a stranger without Node is the free-hand round this PR exists to abolish." `install.sh:188`
   Cost low · Value: Node is now required (operator ruling) but install.sh:188, README.md:294 and BINDINGS.md:20-22 still offer a Node-less path; F18 same root, F35 adds the missing version check. Fix the three texts and make install.sh fail below Node 20. · Convergence 3 · C3 unresolved (Richards: fails at first command vs Cooper/Norman: free-hand fallback); counted severity stands.
5. **F15** 🔴 — "The refusal describes the batch's state, not this persona's, so the agent cannot tell what to do next." `skill/chorus-core/bin/conduct.mjs:596`
   Cost low · Value: The calling agent is the only reader of conduct output (operator ruling); the most common refusal names the batch's state, not the persona's, and never says 'use ack', costing a round trip per misstep. Observed live in this round's explore step (asks carry kind: null). · Convergence 2

## 7. Held findings and minority reports

None.

**Minority reports** (one voter each; not counted, never gating, authored severity kept):

- **F10** 🟡 — "A halted record says it awaits the operator who has already answered, and names no way forward." `skill/chorus-core/bin/conduct.mjs:355` (P 0 · C 1 · O 0)
- **F13** 🟢 — "The spine delivers about three quarters of its headline; what it lacks is one real persona reply." `specs/018-scripted-spine/spec.md:26` (P 0 · C 1 · O 0)
- **F19** 🟢 — "The abort page cannot show that a re-ask happened, so the operator cannot tell one refusal from two." `skill/chorus-core/bin/conduct.mjs:155` (P 0 · C 1 · O 0)
- **F21** 🟡 — "S11 routing is a rule hiding inside the sequencer." `skill/chorus-core/bin/conduct.mjs:213` (P 0 · C 1 · O 0)

## 8. Next-chorus baseline

**Assume closed**: Operator rulings 2026-10-29: code is the authority for mechanical rules; operator sees questions and the record only; one maintainer, install.sh channel; ranking unchanged; tests repo-only; upgrades agent-run with loud errors; Node 20+ required; run logs refuse cross-version replay; downgrade = older commit + install.sh; program size alone is not a cost

**In progress**: #45/#47 fixes for the top five and their duplicates (F8/F14/F29, F1/F11/F20, F7/F18/F35, F3/F12/F25); Addendum CHORUS-PROJECT.md still names skill/coryphaeus (F6)

**Re-evaluate**: C1 cohort of pre-manifest coryphaeus installs; Unvoted F22, F24, F26, F27 and minority F10, F13, F19, F21; Conductor gaps seen live: no batched interview step, duplicates not grouped by locator, unresolved conflicts carry no decision

### Decisions

#### seating-1 — More than five joined: seated by the two-axis sort (🟢)

10 personas joined for five ordinary seats; the two-axis signal (cited deltas, then expected stakes) orders them strictly.

- **Point**: RSVP seating — clean two-axis sort (catalog row 1)
- **Sensor**: strict order at the cap boundary (DECISION-PRIMITIVE.md § Seating) → strict (mark-richards-architect, alan-cooper-advisor, don-norman-advisor, uncle-bob-architect, delivery-and-ops-advisor)
- **Resolution**: auto-resolved · **Status**: complete
- **Default** — Seat the sorted panel (`sorted-panel`): Seat mark-richards-architect, alan-cooper-advisor, don-norman-advisor, uncle-bob-architect, delivery-and-ops-advisor. *Cost*: none
- **Chosen**: `sorted-panel` on 2026-10-29
- **Evidence**: conduct.mjs seat()

### Side-notes (flag-only)

- **threshold-boundary**: Moved at exactly the threshold: |net| == T. (F9, F15, F28)

## Appendix — lens reports

- mark-richards-architect: `docs/reviews/2026-10-29-chorus-review-pr47.run.json`
- alan-cooper-advisor: `docs/reviews/2026-10-29-chorus-review-pr47.run.json`
- don-norman-advisor: `docs/reviews/2026-10-29-chorus-review-pr47.run.json`
- uncle-bob-architect: `docs/reviews/2026-10-29-chorus-review-pr47.run.json`
- delivery-and-ops-advisor: `docs/reviews/2026-10-29-chorus-review-pr47.run.json`
