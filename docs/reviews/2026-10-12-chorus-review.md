# Chorus review — 2026-10-12

- **Target**: specs/017-per-reviewer-run-settings/spec.md
- **Mode**: project-state review
- **Baseline**: docs/reviews/2026-09-27-chorus-review-pr32.json

**Round context.** Since the last round: spec 017 (retuning a reviewer for one project) was written with plan, tasks and an accepted walkthrough; it was narrowed twice to files only, with no chorus mechanism, so a retune is a project-level agent file of the same name that Claude Code resolves; no code is built (the build is held by R-16); the suite-review brief was retired and issue 9 closed; spec 017 is in scope because the operator named it, though the addendum excludes specs.

**Bindings.** decision-sink: default · ruling-lookup: default · record-validator: coryphaeus · record-renderer: coryphaeus · arbiter: default · memory-recall: default

**Recovered without asking.** retry — security-and-trust-advisor (round-1): finding report failed the validator: 45 errors (unknown fields, missing lens, locator and proposed_severity, evidence given as strings, confidence value outside high/low); retry — eric-evans-advisor (round-1): finding report failed the validator on the same shape errors; retry — mark-richards-architect (round-1): finding report failed the validator on the same shape errors; the corrected report was then 778 words, over the 700 limit, and was cut; retry — alan-cooper-advisor (round-1): finding report failed the validator on the same shape errors; the corrected report was then 730 words, over the 700 limit, and was cut; retry — delivery-and-ops-advisor (round-1): finding report failed the validator on the same shape errors; the corrected report was then 704 words, over the 700 limit, and was cut; retry — security-and-trust-advisor (round-2): vote report failed the validator: unknown field proposed_severity on 5 votes; retry — mark-richards-architect (round-2): vote report failed the validator: evidence refs written as install.sh:37,131 instead of a single range; retry — alan-cooper-advisor (round-2): vote report was 887 words, over the 600 limit, and was cut; retry — delivery-and-ops-advisor (round-2): vote report was 778 words, over the 600 limit, and was cut; fallback — decision-sink: no decision sink bound; the two operator questions in the exploratory phase were asked in chat; fallback — ruling-lookup: no ruling sink bound; operator answers are held as local rulings in this record; fallback — arbiter: advisor() is not reachable from this session; the two conflicts are recorded unresolved for the operator

**Secret filter.** not run (the secret pre-filter was not run; the personas wrote understanding records to agent memory).

## 1. TL;DR

The chorus found one real hole in spec 017: in a per-project install the retuned file and the installer's own file sit at the same path, so a re-run with --force silently erases the retune (F32, escalated to 🔴; the claim that the installer never reaches the copy was dropped after its own author corrected it). Staleness is the other cluster: a copy never learns the plugin moved (F12, F16 escalated to 🔴). The cheapest zero-code fix is to stamp the shipped version in the reason comment, name the symptom, and give one diff command. Three 🔴 findings block calling the spec ready: F32 (the --force erase), F16 (no shipped-version stamp in a copy) and F12 (silent staleness with no named symptom). Docs-only is the right size at no maintainer capacity (F36), but the README must stay short (R2-32); two conflicts are left for the operator: whether to record an ADR, and how many sentences the README section may hold.

## 2. Roster (this round)

| Lens | Persona | Decision | Applies (cited deltas) | Expected stakes | Seat | Reason |
|---|---|---|---|---|---|---|
| delivery and ops | delivery-and-ops-advisor | JOIN | — | — | ordinary | Cited three deltas: a docs-only recipe whose upkeep has no owner, install behaviour, and the smoke-run record. |
| security | security-and-trust-advisor | JOIN | — | — | ordinary | Cited three deltas: a project copy that shadows a trusted reviewer, tools as a capability, and the public memory folder. |
| DDD | eric-evans-advisor | JOIN | — | — | ordinary | The spec fixes one name for a reviewer across two files; ubiquitous language is in play. |
| architecture | mark-richards-architect | JOIN | — | — | ordinary | A duplicate-authority seam between a shipped file and a project copy. |
| adversarial product | alan-cooper-advisor | JOIN | — | — | ordinary | The cost of a stale copy falls on the newcomer, not the author. |
| HCD | don-norman-advisor | JOIN | — | — | not seated | Joined; cited two deltas; not seated at the cap of five (tie spanning the fifth seat, default panel by roster order). |
| TDD / simple design | kent-beck-persona | JOIN | — | — | not seated | Joined; cited two deltas; not seated at the cap of five (default panel by roster order). |
| clean code / SOLID | uncle-bob-architect | JOIN | — | — | not seated | Joined; cited two deltas; not seated at the cap of five (default panel by roster order). |
| constraint and flow | eliyahu-goldratt-advisor | JOIN | — | — | not seated | Joined; cited two deltas; not seated at the cap of five (default panel by roster order). |
| Python | guido-python-reviewer | ABSTAIN | — | — | not seated | No Python in the anchor surface. |

Joiners: 9. Quorum: proceed. Seating decision: phase05-seating-tie-1.

## 3. Findings register

| ID | Advisor · Lens | Authored severity | Target (locator) | Pull-quote (verbatim) | confidence_on_hand | need_info · reason | graded |
|---|---|---|---|---|---|---|---|
| F1 | eric-evans-advisor · DDD | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:74-76` | "The copy shares the original's memory, so a stale persona quietly reads and writes the live one's records." | low | open · eric-evans-advisor: I have not checked how Claude Code scopes 'memory: project' when a project-level file shadows a plugin file of the same name.; alan-cooper-advisor: Held; host memory scoping unchecked. | true |
| F2 | eric-evans-advisor · DDD | 🟢 | `specs/017-per-reviewer-run-settings/spec.md:95` | "One word should name the thing a person retunes, and the README should define it once." | high | — | true |
| F3 | eric-evans-advisor · DDD | 🟢 | `specs/017-per-reviewer-run-settings/spec.md:78` | "The record will say 'Beck voted' when a modified Beck did." | high | — | true |
| F11 | mark-richards-architect · architecture | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:74` | "A sanctioned copy without a drift detector is a fork with a better story." | high | — | true |
| F12 | mark-richards-architect · architecture | 🟡 | `specs/017-per-reviewer-run-settings/plan.md:56-62` | "Silent staleness is paid for later, by someone who no longer remembers the copy exists." | high | — | true |
| F13 | mark-richards-architect · architecture | 🟡 | `skill/chorus-review/SKILL.md:114` | "The feature stands on a dispatch rule the canon never states." | low | open · mark-richards-architect: I did not read how the Round brief names the agent beyond SKILL.md line 135.; alan-cooper-advisor: Held; canon dispatch wording is outside my lens. | true |
| F14 | mark-richards-architect · architecture | 🟢 | `scripts/check-suite-integrity.sh:236-258` | "Our CI can guard the recipe, not the copies, and that is the right line." | high | — | true |
| F15 | mark-richards-architect · architecture | 🟢 | `specs/017-per-reviewer-run-settings/plan.md:40-45` | "The saved machinery is paid back in unseen fork drift." | high | — | true |
| F16 | mark-richards-architect · architecture | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:86-88` | "Stamp the version in the copy, and the fork can at least tell you how old it is." | high | — | true |
| F21 | alan-cooper-advisor · adversarial product | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:74` | "The author who accepted the cost will never be the one who pays it." | high | — | true |
| F22 | alan-cooper-advisor · adversarial product | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:55` | "The recipe hands over the dangerous lever and keeps the label off it." | low | open · alan-cooper-advisor: I did not verify which tools a persona's reply and memory writes actually need on the host. | true |
| F23 | alan-cooper-advisor · adversarial product | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:109` | "A record that hides who ran differently is cleaner for the builder and blinder for the reader." | high | — | true |
| F24 | alan-cooper-advisor · adversarial product | 🟢 | `specs/017-per-reviewer-run-settings/spec.md:88` | "Say what the reader loses, not what the repository did." | high | — | true |
| F31 | delivery-and-ops-advisor · delivery and ops | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:87-91` | "A check only one person ran once is a story, not a gate." | high | — | true |
| F32 | delivery-and-ops-advisor · delivery and ops | 🟡 | `install.sh:21-22,101` | "The one flag that overwrites the copy lives in the same directory the copy lives in." | high | — | true |
| F33 | delivery-and-ops-advisor · delivery and ops | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:79,87` | "If the record cannot say a copy ran, the README must at least say where to look and how to undo it." | high | — | true |
| F34 | delivery-and-ops-advisor · delivery and ops | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:74,110` | "A copy that does not say what it was copied from cannot be compared with anything." | high | — | true |
| F35 | delivery-and-ops-advisor · delivery and ops | 🟢 | `specs/017-per-reviewer-run-settings/spec.md:77,103` | "Unowned docs rot; dating them lets the reader discount them." | high | — | true |
| F36 | delivery-and-ops-advisor · delivery and ops | 🟢 | `specs/017-per-reviewer-run-settings/tasks.md:22` | "The cheapest operability is the code you did not ship." | high | — | true |
| F41 | security-and-trust-advisor · security | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:87-90` | "The copy changes who the file is trusted as, and the recipe does not say so." | high | — | true |
| F42 | security-and-trust-advisor · security | 🟢 | `specs/017-per-reviewer-run-settings/spec.md:55` | "A grant you make to yourself needs a warning, not a detector." | high | — | true |
| F43 | security-and-trust-advisor · security | 🟡 | `agents/kent-beck-persona.md:6` | "The retune changes the model, but the memory folder stays public." | high | — | true |
| F44 | security-and-trust-advisor · security | 🟢 | `install.sh:95-158` | "The installer never reaches the copy, so the risk is staleness, not damage." | high | — | true |
| F45 | security-and-trust-advisor · security | 🟡 | `specs/017-per-reviewer-run-settings/tasks.md:17` | "Three sentences hold when no one maintains them; a checker does not." | high | — | true |
| R2-1 | eric-evans-advisor · DDD | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:86-88` | "In a per-project install there is no copy to make, only an edit the installer can undo." | high | — | false [ungraded] |
| R2-11 | mark-richards-architect · architecture | 🟡 | `skill/chorus-review/SKILL.md:114-149` | "The by-name dispatch the whole feature relies on is implied by the roster, not stated." | high | — | false [ungraded] |
| R2-12 | mark-richards-architect · architecture | 🟡 | `install.sh:21-117` | "In a per-project install there is no override at all, only an edit of the installed file." | high | — | false [ungraded] |
| R2-21 | alan-cooper-advisor · adversarial product | 🟡 | `agents/kent-beck-persona.md:132` | "The body orders a write that the narrowed tools list forbids, and nobody hears about it." | high | — | false [ungraded] |
| R2-22 | alan-cooper-advisor · adversarial product | 🟡 | `install.sh:21-22` | "The installer's own hint on a kept file is the command that erases the retune." | high | — | false [ungraded] |
| R2-31 | delivery-and-ops-advisor · delivery and ops | 🟡 | `install.sh:21-22,37,83-118` | "Only the per-project install can reach the copy, and only --force can destroy it." | high | — | false [ungraded] |
| R2-32 | delivery-and-ops-advisor · delivery and ops | 🟡 | `specs/017-per-reviewer-run-settings/spec.md:63,102` | "Ten warnings are read as none; rank them and keep four." | high | — | false [ungraded] |
| R2-33 | delivery-and-ops-advisor · delivery and ops | 🟡 | `scripts/check-suite-integrity.sh:201` | "A diff needs two paths, and the recipe names neither." | high | — | false [ungraded] |
| R2-41 | security-and-trust-advisor · security | 🟡 | `install.sh:21-22,36,134-158` | "My claim that the installer never reaches the copy fails when the install is per-project and --force is used." | high | — | false [ungraded] |
| R2-42 | security-and-trust-advisor · security | 🟡 | `specs/017-per-reviewer-run-settings/tasks.md:17` | "A cloned repo can replace a trusted reviewer by giving a file the same name." | high | — | false [ungraded] |

Converging lenses, in their own words:

- **F2**
  - alan-cooper-advisor: "A reader who meets four names for one thing assumes four things."
- **F3**
  - alan-cooper-advisor: "The record will claim Beck voted when a modified Beck did."
  - delivery-and-ops-advisor: "If the record stays silent, one README sentence has to speak for it."
  - security-and-trust-advisor: "Tell the reader the record cannot show a retune, and the silence stops misleading."
- **F11**
  - eric-evans-advisor: "A ruled divergence needs an owner and a date, or it is only a fork."
  - alan-cooper-advisor: "A sanctioned copy nobody can diff is still a fork the newcomer pays for."
  - delivery-and-ops-advisor: "A fork needs an age on its label, and a version stamp is the cheapest label."
  - security-and-trust-advisor: "The fork is sanctioned, so what it owes is a legible source version."
- **F12**
  - alan-cooper-advisor: "A newcomer who is told the symptom can find the cause; one who is not calls it a chorus bug."
  - delivery-and-ops-advisor: "Name the symptom in the recipe and the stale copy becomes the first suspect."
- **F14**
  - alan-cooper-advisor: "Guard the recipe we ship, leave the copies to their owners."
  - delivery-and-ops-advisor: "Guard the recipe's links in CI and leave the copies to their owners."
- **F15**
  - alan-cooper-advisor: "Writing down who pays is what makes accepting it honest."
- **F16**
  - eric-evans-advisor: "A version stamp tells a reader which persona the copy claims to be."
  - alan-cooper-advisor: "The stamp turns an unknowable copy into one the reader can compare."
  - delivery-and-ops-advisor: "A stamped version turns an invisible fork into a dated one."
- **F21**
  - mark-richards-architect: "A manual re-compare with no trigger is a step nobody remembers to take."
  - delivery-and-ops-advisor: "Whoever accepts the cost on a newcomer's behalf should hand over the diff command too."
- **F23**
  - eric-evans-advisor: "The record's reader pays for what the retuner saved."
  - delivery-and-ops-advisor: "The record's reader needs a pointer to where the retune lives."
- **F24**
  - delivery-and-ops-advisor: "Tell the reader what they lose, in their words."
- **F31**
  - alan-cooper-advisor: "An instruction with no command is a wish."
- **F32**
  - eric-evans-advisor: "The installer cannot see a copy under the global home, but it lands on one under a per-project home."
  - mark-richards-architect: "In a per-project install the retune copy and the shipped file are the same path."
  - alan-cooper-advisor: "The retune is only safe until someone passes the flag the README itself suggests."
  - security-and-trust-advisor: "In per-project mode the installer and the copy share one path, and --force wins."
- **F33**
  - alan-cooper-advisor: "If the record stays silent, the README must say how to look and how to go back."
- **F34**
  - mark-richards-architect: "A version stamp gives the drift check something to compare against."
  - alan-cooper-advisor: "A copy that names its source can be checked; one that does not cannot."
  - security-and-trust-advisor: "A recorded source version turns re-compare from a hope into a diff."
- **F35**
  - alan-cooper-advisor: "A date lets the reader decide how far to trust the page."
- **F36**
  - mark-richards-architect: "Right-sized: the cheapest architecture is the one that adds no coupling point."
  - alan-cooper-advisor: "Fine to ship nothing, if the sentences that replace it are written."
  - security-and-trust-advisor: "No code means nothing for an absent maintainer to forget to run."
- **F41**
  - mark-richards-architect: "The recipe's allow-list of three keys is a hope, not a guard."
  - alan-cooper-advisor: "Telling people which three keys are safe says nothing about the rest."
  - delivery-and-ops-advisor: "Privileged keys deserve one named sentence, never a scanner."
- **F42**
  - alan-cooper-advisor: "A tools grant deserves a sentence of warning, not a detector."
  - delivery-and-ops-advisor: "A README warning is the whole control, and it costs nothing to keep."
- **F43**
  - eric-evans-advisor: "One name means one memory folder, whoever wrote the file behind it."
  - alan-cooper-advisor: "Keeping the body also keeps the writes, and the recipe never says so."
  - delivery-and-ops-advisor: "The retune does not change where findings get written, and the reader should know."
- **F45**
  - alan-cooper-advisor: "Plain sentences are the only control a stranger will actually see."
  - delivery-and-ops-advisor: "Sentences survive neglect that a checker would not."
- **R2-1** (derived from F32)
- **R2-11** (derived from F13)
- **R2-12** (derived from F32)
- **R2-21** (derived from F22)
- **R2-22** (derived from F32)
- **R2-31** (derived from F32)
- **R2-32** (derived from F45)
- **R2-33** (derived from F31)
- **R2-41** (derived from F44)
- **R2-42** (derived from F42)

## 4. Consolidation matrix

`net = P − O` over non-author voters (CONFIRM excluded); `T = max(1, floor(N / 2))`; convergence = P + C.

| ID | Authored severity | P | C | O | net | Final severity | Convergence (P + C) | Status |
|---|---|---|---|---|---|---|---|---|
| F1 | 🟡 | — | — | — | — | — | — | held |
| F2 | 🟢 | 0 | 1 | 0 | — | 🟢 | — | minority-report |
| F3 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F11 | 🟡 | 0 | 4 | 0 | 0 | 🟡 | 4 | graded |
| F12 | 🟡 | 1 | 1 | 0 | 1 | 🔴 | 2 | graded |
| F13 | 🟡 | — | — | — | — | — | — | held |
| F14 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F15 | 🟢 | 0 | 1 | 1 | -1 | dropped | 1 | graded |
| F16 | 🟡 | 1 | 2 | 0 | 1 | 🔴 | 3 | graded |
| F21 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| F22 | 🟡 | — | — | — | — | — | — | held |
| F23 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| F24 | 🟢 | 0 | 1 | 0 | — | 🟢 | — | minority-report |
| F31 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F32 | 🟡 | 3 | 1 | 0 | 3 | 🔴 | 4 | graded |
| F33 | 🟡 | 0 | 1 | 0 | — | 🟡 | — | minority-report |
| F34 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F35 | 🟢 | 0 | 1 | 0 | — | 🟢 | — | minority-report |
| F36 | 🟢 | 0 | 3 | 0 | 0 | 🟢 | 3 | graded |
| F41 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F42 | 🟢 | 0 | 2 | 0 | 0 | 🟢 | 2 | graded |
| F43 | 🟡 | 0 | 3 | 0 | 0 | 🟡 | 3 | graded |
| F44 | 🟢 | 0 | 0 | 4 | -4 | dropped | 0 | graded |
| F45 | 🟡 | 0 | 2 | 0 | 0 | 🟡 | 2 | graded |
| R2-1 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-11 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-12 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-21 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-22 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-31 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-32 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-33 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-41 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |
| R2-42 | 🟡 | — | — | — | — | 🟡 | — | ungraded [ungraded] |

## 5. Conflicts

- **C1** — mark-richards-architect vs delivery-and-ops-advisor on F15: Whether the trade (no config layer, in exchange for forks the installer never refreshes) needs an architecture decision record, or whether the spec Clarifications already hold it; an ADR is one more file nobody maintains.
  - Unresolved for the operator
- **C2** — delivery-and-ops-advisor vs security-and-trust-advisor vs alan-cooper-advisor on R2-32, F45: How many sentences the README section may carry: one lens wants the section capped at the recipe plus four ranked bullets, while others each ask for their own sentence (privileged keys, committed copies, public memory, tools minimum, record silence); a newcomer who reads fewer warnings sees fewer of the safety ones.
  - Unresolved for the operator

## 6. Top five

1. **F32** 🔴 — "The one flag that overwrites the copy lives in the same directory the copy lives in." `install.sh:21-22,101`
   Cost low · Value: Stops a per-project install with --force from silently erasing a reviewer retune; one README sentence, no code. · Convergence 4
2. **F16** 🔴 — "Stamp the version in the copy, and the fork can at least tell you how old it is." `specs/017-per-reviewer-run-settings/spec.md:86-88`
   Cost low · Value: A shipped-version stamp in the reason comment gives every copy an owner, a reason and a cheap age signal; zero chorus code. · Convergence 3
3. **F12** 🔴 — "Silent staleness is paid for later, by someone who no longer remembers the copy exists." `specs/017-per-reviewer-run-settings/plan.md:56-62`
   Cost low · Value: Naming the symptom (validation failures after an update: check your copy first) gives a newcomer a recovery path. · Convergence 2 · Escalated at exactly net = T on two voters (side-note).
4. **F11** 🟡 — "A sanctioned copy without a drift detector is a fork with a better story." `specs/017-per-reviewer-run-settings/spec.md:74`
   Cost low · Value: Rules the copy a sanctioned divergence with an owner, a reason and a manual drift check; four of four voters agree. · Convergence 4
5. **F41** 🟡 — "The copy changes who the file is trusted as, and the recipe does not say so." `specs/017-per-reviewer-run-settings/spec.md:87-90`
   Cost low · Value: One sentence that hooks, mcpServers and permissionMode run with the user's authority in a project-level copy. · Convergence 3

## 7. Held findings and minority reports

- **F1** (route: operator, phase2-need-info-routing-1): eric-evans-advisor — I have not checked how Claude Code scopes 'memory: project' when a project-level file shadows a plugin file of the same name.; alan-cooper-advisor — Held; host memory scoping unchecked.
- **F13** (route: peer): mark-richards-architect — I did not read how the Round brief names the agent beyond SKILL.md line 135.; alan-cooper-advisor — Held; canon dispatch wording is outside my lens.
- **F22** (route: peer): alan-cooper-advisor — I did not verify which tools a persona's reply and memory writes actually need on the host.

**Minority reports** (one voter each; not counted, never gating, authored severity kept):

- **F2** 🟢 — "One word should name the thing a person retunes, and the README should define it once." `specs/017-per-reviewer-run-settings/spec.md:95` (P 0 · C 1 · O 0)
- **F24** 🟢 — "Say what the reader loses, not what the repository did." `specs/017-per-reviewer-run-settings/spec.md:88` (P 0 · C 1 · O 0)
- **F31** 🟡 — "A check only one person ran once is a story, not a gate." `specs/017-per-reviewer-run-settings/spec.md:87-91` (P 0 · C 1 · O 0)
- **F33** 🟡 — "If the record cannot say a copy ran, the README must at least say where to look and how to undo it." `specs/017-per-reviewer-run-settings/spec.md:79,87` (P 0 · C 1 · O 0)
- **F35** 🟢 — "Unowned docs rot; dating them lets the reader discount them." `specs/017-per-reviewer-run-settings/spec.md:77,103` (P 0 · C 1 · O 0)

## 8. Next-chorus baseline

**Assume closed**: F44 installer-never-reaches-the-copy (dropped, corrected by its author in R2-41)

**In progress**: F32 per-project install and --force; F16 shipped-version stamp in the reason comment; F12 name the staleness symptom

**Re-evaluate**: F1 memory scoping under shadowing, once the host doc is read; F13 and R2-11 whether dispatch by agent name needs a stated sentence; F22 and R2-21 minimum tools list; C1 ADR or not; C2 README length

### Decisions

#### phase05-seating-tie-1 — Who takes the fifth seat when six lenses tie (🟡)

Nine lenses joined and the cap is five; Delivery-and-Ops and Security cited three deltas each, six others cited two, so the tie spans the fifth seat.

- **Point**: RSVP seating tie at the cap (catalog row 2)
- **Sensor**: tie at the cap boundary → 🟡: recorded default panel by roster order, async override (roster)
- **Resolution**: default-applied · **Status**: open
- **Default** — Seat the first tied lenses in roster order (`roster-order`): Evans, Richards and Cooper take the remaining seats with Delivery-and-Ops and Security. *Cost*: None. *Risk*: Norman, Beck, Uncle Bob and Goldratt are not heard this round.
- Swap in the human-centred-design lens for one seat (`seat-norman`): A newcomer-reader lens joins, at the price of one of the DDD, architecture or adversarial lenses. *Cost*: A re-run of the round.
- **Override**: Name the lens to swap in and re-run the round. (cost: One more round of dispatches.)
- **Evidence**: docs/reviews/CHORUS-PROJECT.md — The addendum holds the standing panel order.

#### phase2-need-info-routing-1 — How the host scopes memory for a shadowed reviewer (🟡)

Finding F1 cannot be graded until someone reads how Claude Code scopes the memory folder when a project agent file shadows a plugin one of the same name.

- **Point**: NEED_INFO resolution routing (catalog row 14)
- **Sensor**: open NEED_INFO with confidence_on_hand low → operator path: no seated persona holds the host fact (register F1)
- **Resolution**: default-applied · **Status**: open
- **Default** — Read the host sub-agent documentation on memory scope (`read-host-doc`): The finding stays held until the fact is read; then Evans revises or confirms it. *Cost*: One document read.
- Leave the finding held and cite it as open in the spec (`accept-as-is`): The round proceeds; the README carries the public-memory sentence regardless. *Cost*: None. *Risk*: The scoping stays unverified.
- **Override**: Ask for the host document to be read now. (cost: One lookup.)
- **Evidence**: specs/017-per-reviewer-run-settings/spec.md:74-76 — The finding concerns the same-name shadowing.

### Side-notes (flag-only)

- **threshold-boundary**: F12 and F16 were escalated to 🔴 at net = 1 with a threshold of 1, on two and three voters; F32 escalated clearly (net 3, threshold 2). (F12, F16)
- **missing-beneficiary-lens**: The human-centred-design lens (Norman) joined but was not seated at the cap of five; the newcomer reader was carried by Cooper alone.
- **other**: Beck, Uncle Bob and Goldratt also joined and were not seated; an async override is possible. Five findings with a single non-author voter are listed as minority reports: F2, F24, F31, F33, F35 (F31 is the delivery lens's own top recommendation). (F2, F24, F31, F33, F35)

### Local rulings (no ruling sink bound)

- **R-1** — What maintainer capacity can controls proposed against this repository count on? — "Impossible to say: it's an open repo." (chat, 2026-10-12 (exploratory-phase interview))
- **R-2** — Who retunes a reviewer for one project: operators of this repository, or newcomers? — "Both, a small number overall." (chat, 2026-10-12 (exploratory-phase interview))

## Appendix — lens reports

- eric-evans-advisor: `docs/reviews/2026-10-12-spec017-reports/r1-evans.json`, `docs/reviews/2026-10-12-spec017-reports/r2-evans.json`
- mark-richards-architect: `docs/reviews/2026-10-12-spec017-reports/r1-richards.json`, `docs/reviews/2026-10-12-spec017-reports/r2-richards.json`
- alan-cooper-advisor: `docs/reviews/2026-10-12-spec017-reports/r1-cooper.json`, `docs/reviews/2026-10-12-spec017-reports/r2-cooper.json`
- delivery-and-ops-advisor: `docs/reviews/2026-10-12-spec017-reports/r1-dops.json`, `docs/reviews/2026-10-12-spec017-reports/r2-dops.json`
- security-and-trust-advisor: `docs/reviews/2026-10-12-spec017-reports/r1-security.json`, `docs/reviews/2026-10-12-spec017-reports/r2-security.json`
