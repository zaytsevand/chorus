# Findings register — PR 32 review, Round 1

## F1 🔴 — mark-richards-architect (r1/richards.json#F1)
- Locator: `skill/chorus-core/GATE-PRIMITIVE.md:207-240`
- PULL-QUOTE (mark-richards-architect): "Two authors of the vote rule, and no alarm when they disagree."
- Claim: The Stage-4 rule has two authors in two repos: GATE-PRIMITIVE prose and coryphaeus tally(). Q-14 aligned them once, but nothing fails when they drift again, because the tests hand-copy cases. Ruling: SANCTIONED DIVERGENCE, since the repo boundary is deliberate. GATE-PRIMITIVE owns the rule and tally() implements it. The price is a parity test: a machine-readable case table in GATE-PRIMITIVE that a coryphaeus test loads from the installed chorus-core, failing on any mismatch.
- Conditional on: A2: conformance ranks first

## F2 🟡 — mark-richards-architect (r1/richards.json#F2)
- Locator: `skill/chorus-core/CONDUCTOR.md:270-278`
- PULL-QUOTE (mark-richards-architect): "The port contract is written twice and already reads two ways."
- Claim: Both repos restate the port table, and their defaults already disagree. For the validator, CONDUCTOR's unbound default is 'none, record says unvalidated' while coryphaeus lists validate.mjs. For memory recall and ruling lookup, CONDUCTOR has 'none' while coryphaeus lists agent-memory and local_rulings. Ruling: CONSOLIDATE. CONDUCTOR owns each port's contract and default, and coryphaeus keeps only a Binding column that cites the port by name.

## F3 🟡 — mark-richards-architect (r1/richards.json#F3)
- Locator: `skill/chorus-review/SKILL.md:159-172`
- PULL-QUOTE (mark-richards-architect): "The provider is re-deciding a rule the chorus owns."
- Claim: Two texts decide what happens to a reply that fails validation. The chorus says ABSTAIN with no retry, and coryphaeus says send it back once. That policy belongs to the chorus, and the binding should not re-decide it. Ruling: CONSOLIDATE into the record-validator row of CONDUCTOR, carrying whatever A4 settles, and delete the policy sentence from coryphaeus.
- Conditional on: A4: one retry, then fail loudly

## F4 🟡 — mark-richards-architect (r1/richards.json#F4)
- Locator: `/home/az/code/zaytsevand/coryphaeus/schema/finding-report.schema.json`
- PULL-QUOTE (mark-richards-architect): "A schema bump would read as ten abstentions, not as a version mismatch."
- Claim: The cross-repo contract has no version. Every schema pins schema_version const '1', but the chorus canon names no expected version, and coryphaeus has no version, tag or remote. On a breaking schema change every reply fails, counts as ABSTAIN, and the round aborts on quorum. That is loud by accident, and the root cause sits buried in roster reasons. The port contract should state the schema major it expects, and the validator should report a mismatch as its own error.
- Conditional on: A1 and A4

## F5 🟡 — mark-richards-architect (r1/richards.json#F5)
- Locator: `.github/workflows/integrity.yml:1-25`
- PULL-QUOTE (mark-richards-architect): "The rule-checking program itself goes unchecked."
- Claim: No automation ever runs the program that carries conformance, quality number one. Chorus CI runs only bash checks and an install round trip, which is correct under constitution 2.0.0. But coryphaeus has no CI and no remote, so its 63 tests run only when someone remembers to. The chorus install also never checks whether coryphaeus is present, so a round falls back to 'unvalidated' without anyone noticing.
- Conditional on: A2: conformance ranks first

## F6 🟢 — mark-richards-architect (r1/richards.json#F6)
- Locator: `.specify/memory/constitution.md:321-324`
- PULL-QUOTE (mark-richards-architect): "The direction is right today, and nothing keeps it right tomorrow."
- Claim: The dependency points the right way. Nothing under skill/, agents/, install.sh or plugin.json names coryphaeus or the brief, so R-1 and R-10 hold at runtime. But convention is the only thing enforcing it. A greppable FC in check-suite-integrity, which the constitution allows, would turn a future slip into a red build.

## F7 🟢 — mark-richards-architect (r1/richards.json#F7)
- Locator: `.claude-plugin/plugin.json:4-8`
- PULL-QUOTE (mark-richards-architect): "The manifest describes the previous version of the suite."
- Claim: The manifest still promises 'a durable markdown artifact' and points at the chorus-review repository. Both predate the JSON records and the Q-9 rename.

## F8 🟡 — mark-richards-architect (r1/richards.json#F8)
- Locator: `skill/chorus-core/CONDUCTOR.md:266-282`
- PULL-QUOTE (mark-richards-architect): "The right trade, as long as the drift alarms ship with it."
- Claim: Cost profile against A2. Conformance is bought properly, with code (R-3). Simplicity and portability pay: a Node runtime, two repos, two install channels. Evolvability pays through contract coupling: a tally change now means a lockstep edit across two repos with no tooling to make lockstep safe. Recommendation: accept the profile, but only with F1's parity test and F4's version check in the same change. Without them the conformance gain decays into drift.
- Conditional on: A2 ranking

## F9 🟡 — security-and-trust-advisor (r1/security.json#F1)
- Locator: `skill/chorus-review/SKILL.md:164-166`
- PULL-QUOTE (security-and-trust-advisor): "The memory folder is a back door past the validator."
- Claim: Memory recovery treats any new file in a persona's memory dir as its report, which gives the report two producers: a validated JSON reply and an unvalidated file. The effective control is the weaker one. It also contradicts EXPLORATORY-PHASE.md:105-107, which says memory is an index and never evidence. A persona prompt-injected by the repo it reviews can land an unchecked report through the file path.

## F10 🟡 — security-and-trust-advisor (r1/security.json#F2)
- Locator: `skill/chorus-core/CONDUCTOR.md:406-427`
- PULL-QUOTE (security-and-trust-advisor): "A filter that never ran now reads as zero drops."
- Claim: The secret pre-filter's only evidence is secret_drops, an integer the conductor reports about itself. render.mjs prints a missing value as 0, so a filter that never ran looks like a clean pass. The 'no runtime' justification is stale under constitution 2.0.0. Review-mode persona memory writes, which are committed, are never routed through the filter.
- Conditional on: A1 solo operator

## F11 🟡 — security-and-trust-advisor (r1/security.json#F3)
- Locator: `skill/chorus-core/CONDUCTOR.md:274`
- PULL-QUOTE (security-and-trust-advisor): "A missing validator fails quietly or blames the wrong party."
- Claim: The validator's default is fail-open ('the round runs, unvalidated'). Nothing pins which coryphaeus version the chorus canon expects. coryphaeus is local-only, with no remote and no CI, and its installer only warns when node is missing. A node-missing exit of 127 falls outside the 0/1/2 contract, so the conductor either reads it as unbound, and the round runs silently unvalidated, or counts every reply as ABSTAIN and blames the personas.
- Conditional on: A4 loud version mismatch

## F12 🟢 — security-and-trust-advisor (r1/security.json#F4)
- Locator: `install.sh:95-103`
- PULL-QUOTE (security-and-trust-advisor): "The two delete paths guard differently, and the weak one sets the rule."
- Claim: The prune loop deletes paths read from the old manifest with no absolute-path or '..' guard, and uninstall.sh has that guard. It crosses no boundary today: anyone who can write the manifest can already write ~/.claude hooks. The weaker of the two copies is still the one that sets the effective rule.

## F13 🟢 — security-and-trust-advisor (r1/security.json#F5)
- Locator: `/home/az/code/zaytsevand/coryphaeus/bin/render.mjs:23`
- PULL-QUOTE (security-and-trust-advisor): "Valid JSON is not trusted content."
- Claim: Agent-authored strings go into the markdown raw. Only table cells escape '|' and newlines. GitHub and VS Code sanitise HTML in markdown, so for a private operator the risk is not worth an escaping layer. The real point is that validation checks the shape of a reply, not whether its content can be trusted.
- Conditional on: A1 solo operator

## F14 🟢 — security-and-trust-advisor (r1/security.json#F6)
- Locator: `.github/workflows/integrity.yml:3-9`
- PULL-QUOTE (security-and-trust-advisor): "This CI has no secrets to leak, and that is correct."
- Claim: The CI setup is proportionate. It uses pull_request, not pull_request_target, and a contents:read token with no secrets, so a fork PR has nothing to take. SHA-pinning the first-party checkout action is not worth it at this scale.
- Conditional on: A1 solo operator

## F15 🟡 — security-and-trust-advisor (r1/security.json#F7)
- Locator: `skill/chorus-core/DECISION-PRIMITIVE.md:235-237`
- PULL-QUOTE (security-and-trust-advisor): "The safety net catches the safer case and misses the worse one."
- Claim: The trust-boundary column survived the move (line 201), and row 12 is still 🔴. But once the mandate is gone, the only route to a security lens is self-selection plus a side-note that fires only when enforcement is server-bound. A completed row naming edge enforcement, the more dangerous case, triggers nothing. Recommendation: fire the side-note on any cross-user deferral when no security lens is seated. For F1, recover memory files as recall only. For F2, render a missing count as 'not run'. For F3, have the conductor run the validator on a known-good example first.

## F16 🟡 — eric-evans-advisor (r1/evans.json#F1)
- Locator: `/home/az/code/zaytsevand/coryphaeus/SKILL.md:102`
- PULL-QUOTE (eric-evans-advisor): "In the chorus 'escalated' means blocked; in the brief it means not blocking, and the glossary skips the one word that flips."
- Claim: 'escalated' inverts across the seam. Chorus: a 🔴 decision must have resolution 'escalated', a hard block. Brief: bearing 'escalated' means a decision that does not block the goal, and rule 4 maps a chorus 🟡 to it. sdlc-log adds a third sense (loop bound reached). Rule 1's glossary translates tally, gate, lens, held, park and frame, but not the one word that flips.
- Conditional on: A3: the decision contract is Core

## F17 🟡 — eric-evans-advisor (r1/evans.json#F2)
- Locator: `/home/az/code/zaytsevand/coryphaeus/schema/common.schema.json:232-239`
- PULL-QUOTE (eric-evans-advisor): "One row can say held and hold, and they mean uncounted and counted-but-unmoved."
- Claim: In one matrix row, status 'held' means an open NEED_INFO, not counted in N. Movement 'hold' and 'agreed: held with CONFIRM votes' mean counted, |net| under T, severity unmoved. GATE-PRIMITIVE uses both senses within a few lines. These are the two states the Core most needs to keep apart.
- Conditional on: A3: vote counting is Core

## F18 🟡 — eric-evans-advisor (r1/evans.json#F3)
- Locator: `/home/az/code/zaytsevand/coryphaeus/schema/common.schema.json:147`
- PULL-QUOTE (eric-evans-advisor): "The citation key has two spellings, and the reader matches only one of them, locally, and none remotely."
- Claim: ruling_ref carries three identities: ruling (R-n), brief entry (Q-n, reused as entry_ref) and operator reference. It accepts two spellings, bare 'R-3' and prefixed 'suite-review/R-3'. Ruling and brief ids are bare. Validator and renderer read '#' consistently, but the local lookup is an exact match, so a prefixed id never resolves. Remote refs are never dereferenced, so a prefixed id that matches nothing passes silently. The standing rulings prescribe the prefixed form.

## F19 🟡 — eric-evans-advisor (r1/evans.json#F4)
- Locator: `/home/az/code/zaytsevand/coryphaeus/schema/decision.schema.json:5`
- PULL-QUOTE (eric-evans-advisor): "The chorus conforms to the brief, which is right, but nobody wrote it down or checks it."
- Claim: The decision and ruling shapes conform to the brief ('aligned', 'same meanings', 'field-for-field'). That is Conformist, and rightly so: the brief is upstream. It is not a Shared Kernel, since the chorus cannot change it. But the relationship is never named, and nothing guards it: no test or validator step loads the brief's schema, so upstream drift goes unnoticed.
- Conditional on: A2: evolvability ranks second

## F20 🟡 — eric-evans-advisor (r1/evans.json#F5)
- Locator: `/home/az/code/zaytsevand/coryphaeus/SKILL.md:83-109`
- PULL-QUOTE (eric-evans-advisor): "The layer translates outbound well; inbound it only knows the day the operator says yes."
- Claim: Outbound, the rules are a real Anti-Corruption Layer: plain language, count before grouping, recommendation from the vote. Inbound, they cover only 'operator rules' and say nothing about a replaced ruling, a superseded entry, or a reopened entry, so the chorus ref can cite a dead ruling. Outbound, bearingReason and rolledUp have no source field, so 'mechanical' overstates it.

## F21 🟢 — eric-evans-advisor (r1/evans.json#F6)
- Locator: `/home/az/code/zaytsevand/chorus/.worktrees/suite-review/skill/chorus-core/GATE-PRIMITIVE.md:237`
- PULL-QUOTE (eric-evans-advisor): "The Core has one author and one enforcer; say which one wins, and keep the brief's rules out of it."
- Claim: The Core has one prose owner (Stage 4, six settled cases) and one executable pin (the validator, bound by role per Q-15). That is right, but nothing says which wins on disagreement, and the validator also enforces a brief-derived rule (recommended option first). Recommendation: rename the F1 and F2 terms at source; scope ruling_ref to rulings with one id spelling; write inbound translation for replaced and superseded; declare the brief upstream with a drift check; state that canon wins over validator.
- Conditional on: A3: vote counting is Core

## F22 🟡 — alan-cooper-advisor (r1/cooper.json#F1)
- Locator: `skill/chorus-review/SKILL.md:159-172`
- PULL-QUOTE (alan-cooper-advisor): "A seat can disappear mid-round and the operator finds out only from the record."
- Claim: Counting a rejected reply as ABSTAIN helps the conductor, which gets one rule with no branches. The operator pays for it: a seat drops out, quorum can fall, and the only recovery is reading the roster after the round is over. Nothing tells the operator during the round and there is no way to re-dispatch. The two texts also disagree: coryphaeus sends the reply back once, chorus-review does not.
- Conditional on: A4: tell the operator live, one retry

## F23 🟡 — alan-cooper-advisor (r1/cooper.json#F2)
- Locator: `skill/chorus-core/CONDUCTOR.md:274`
- PULL-QUOTE (alan-cooper-advisor): "The record promises to say 'unvalidated' and has no place to say it."
- Claim: With no validator bound, the round runs and 'its record says unvalidated'. But Phase 0 never checks which ports are bound, so the operator learns this only afterwards. The review-record schema also has no field for 'unvalidated' or 'unrendered', so the promise has nowhere to be kept.

## F24 🟡 — alan-cooper-advisor (r1/cooper.json#F3)
- Locator: `install.sh:79-81`
- PULL-QUOTE (alan-cooper-advisor): "Dogfooding a release can leave last month's personas installed."
- Claim: An agent file an earlier run of the installer wrote is kept as it is, not refreshed, unless --force is passed. The round-trip test never exercises an upgrade. Under R-7/Q-8 (a release is done once dogfooded), the operator can dogfood a release whose persona edits (delta 6) never reach the installed agents, and 'Installed: 0. Skipped: 10.' reads like a normal run.

## F25 🟢 — alan-cooper-advisor (r1/cooper.json#F4)
- Locator: `install.sh:13-16,87-89`
- PULL-QUOTE (alan-cooper-advisor): "--force destroys the very customization the installer says it protects."
- Claim: The installer protects a customized agent file only when --force is not passed. With --force it overwrites the file without a backup and records it, so a later uninstall deletes it. The user's customization is gone twice, and nothing warns them before the first time.

## F26 🟢 — alan-cooper-advisor (r1/cooper.json#F5)
- Locator: `install.sh:109-121`
- PULL-QUOTE (alan-cooper-advisor): "The installer never mentions the validator the whole redesign rests on."
- Claim: Neither the chorus installer nor its README mentions coryphaeus or Node. An outside installer gets only the unvalidated, hand-written defaults and nothing points them to the program that makes the record trustworthy.
- Conditional on: A1: outside installers are a declared future group

## F27 🟡 — alan-cooper-advisor (r1/cooper.json#F6)
- Locator: `skill/chorus-core/DECISION-PRIMITIVE.md:179,226`
- PULL-QUOTE (alan-cooper-advisor): "The deferral check still fires, but nobody is assigned to write the strip."
- Claim: With the mandates gone, catalog rows 12 and 13 still fire because they key on what the corpus contains, not on who is seated. I credit that net. But only 'the product lens' authors the F-UV strip. If a tie at the cap out-seats Cooper, as nearly happened this round, row 13 asks for a strip nobody is assigned to write. Exceptional entry may also be refused, because Goldratt's role covers deferral.

## F28 🟢 — alan-cooper-advisor (r1/cooper.json#F7)
- Locator: `skill/chorus-review/SKILL.md:314-316,423-433`
- PULL-QUOTE (alan-cooper-advisor): "The page serves the operator well, except it cannot say whether the round was validated."
- Claim: The JSON is for the tooling and the rendered page is for the operator, and that split is right. The register is 'the single human-facing source of truth', and the roster shows each failure-rule abstention with a typed reason. The page is enough for someone who never opens the JSON, except that it cannot say whether the round was validated. Recommendation: add a required bindings block (port, bound or default, and the default's consequence) to review-record, print it in page section 2, and have Phase 0 announce unbound ports before the RSVP.

## F29 🟡 — don-norman-advisor (r1/norman.json#F1)
- Locator: `skill/chorus-review/SKILL.md:159-172`
- PULL-QUOTE (don-norman-advisor): "A broken reply is filed away while it could still be fixed, and the two texts disagree about whether it gets a second chance."
- Claim: A rejected reply reaches no one while it can still be fixed. The review skill turns it straight into ABSTAIN with the reason written to the roster; coryphaeus says it goes back to the persona once. The persona never learns what was wrong (gulf of execution), and the operator learns only by reading the finished roster (gulf of evaluation). The procedure already knows the better pattern: a zero-tool-use report gets one re-dispatch with an instruction.
- Conditional on: A4: told live, one retry

## F30 🟡 — don-norman-advisor (r1/norman.json#F2)
- Locator: `coryphaeus/SKILL.md:63-64`
- PULL-QUOTE (don-norman-advisor): "The promise not to fall back silently rests on a free-text note that nothing checks."
- Claim: Coryphaeus says a port that falls back to its default is never silent, but the record has no place for this. It could only go into optional free-text side_notes, which the validator cannot check. On the rendered page, the only clue is a Local rulings heading. An operator cannot see which bindings ran, so a round that fell back looks the same as one that did not.

## F31 🟡 — don-norman-advisor (r1/norman.json#F3)
- Locator: `skill/chorus-core/CONDUCTOR.md:270-278`
- PULL-QUOTE (don-norman-advisor): "Two tables tell the operator two different stories about what runs when nothing is bound."
- Claim: The two port tables give different defaults. CONDUCTOR says an unbound validator means none (the record says unvalidated), while coryphaeus names bin/validate.mjs. The same happens for memory recall (none versus agent-memory) and the renderer (hand-written unrendered page versus render.mjs). Whichever file the operator reads, that is the model they form of what runs when nothing is bound.

## F32 🟡 — don-norman-advisor (r1/norman.json#F4)
- Locator: `coryphaeus/bin/render.mjs:66-70`
- PULL-QUOTE (don-norman-advisor): "The page shows the verdict but hides the numbers that would let a reader check it."
- Claim: Held findings, ungraded findings and the Held section do show on the page. The tally, though, cannot be checked from it. Rows carry n, threshold and movement, but the matrix leaves them out, so settled cases 1 (N = P + C + O) and 2 (CONFIRM with |net| < T) can be read only in the JSON. Case 4 says an ungraded 🔴 is surfaced to the operator, but the page has no place that does this beyond an [ungraded] tag.

## F33 🟢 — don-norman-advisor (r1/norman.json#F5)
- Locator: `coryphaeus/bin/validate.mjs:536-540`
- PULL-QUOTE (don-norman-advisor): "Broken JSON is answered with a usage message, which points the fixer the wrong way."
- Claim: Field errors are written for the fixer: path, message, and a hint taken from the schema. Missing-field and cross-field errors carry no hint; for example, an empty applies does not say that it is allowed only with ABSTAIN. Unparseable JSON exits 2 and prints usage text, so the caller is told it called the tool wrong when the real fault is its JSON.

## F34 🟡 — don-norman-advisor (r1/norman.json#F6)
- Locator: `skill/chorus-review/SKILL.md:383-387`
- PULL-QUOTE (don-norman-advisor): "Unresolved for the operator is only a record, not a question the operator is asked."
- Claim: When advisor() is unavailable, a conflict is recorded as unresolved for the operator, but nothing turns it into a question. The conflict's decision_ref is optional, and no rule sends the conflict through the decision sink. The failure rule and a quorum abort work the same way: they record what happened without giving the operator a next step. Recommendation: send every unresolved conflict and every failure-rule ABSTAIN through the decision sink as a card with a default. The operator then gets a question with a recovery path, not just a log line.

