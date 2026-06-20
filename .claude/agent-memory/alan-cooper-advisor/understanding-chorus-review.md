---
name: understanding-chorus-review
description: Cooper-lens persisted understanding of the chorus-review repo — project-scoped facts + per-feature Gate deltas (current; feature 007 chorus learn, Gate A run 2 clean-slate cycle 1, 2026-06-12)
metadata:
  type: project
---

# Understanding record — chorus-review (Cooper lens)

Locators, not copies. Working repo for 007: `/home/az/code/chorus-review/.claude/worktrees/007-chorus-learn-onboarding`.

## Project-scoped (carry-forward)

- **What the product is**: a Claude Code skill/persona repo — markdown prompts, no runtime app. The "user" of every feature is the operator at the keyboard of a Claude Code session.
- **No project addendum exists in this repo itself** — `docs/reviews/CHORUS-PROJECT.md` absent (verified 2026-06-10). Standing fact; also no repo CLAUDE.md, no ratified constitution.
- **The addendum is the operator-owned surface** — my standing concern across rounds is writes to it without a genuine consent encounter ([[feedback-consent-encounter-not-display]], [[feedback-exploratory-phase-operator-tax]]).
- **install.sh contract** (verified cycle 2): honors `CLAUDE_HOME` env override (install.sh:9-15); `SKILL_DST=$CLAUDE_HOME/skills/chorus-review` (:25); skill `*.md` always `cp -f` (:36 — today ships ONLY `skill/chorus-review/*.md`; templates/ deployment is 007's R6 edit, still a gap on this branch). "Next:" prose is the installer's user-facing promise — 007 FR-013 re-scopes it to lead with `chorus learn`.

## Feature 007 — `chorus learn` (Gate A)

### Cycle 1 (explored 2026-06-10) — summary, locators superseded by cycle-2 regen

Needs 1–7 all evidenced; 12 findings authored (2 red / 7 yellow / 3 green); reds were T1 (SC-003 one-choice vs 2-interaction jump) and T2 (S1 affordance oversubscription / N5 self-contradiction). Voted 49 peer findings (41 PRIORITIZE / 3 OVER-RATE / 5 ABSTAIN). Gate BLOCKED: 38 reds, 14 families A–N. Most user-consequential cross-feature seam: Evans F33 — scaffolded-but-unfilled addendum read as content by the round's binary present/absent contract.

### Cycle 2 delta (2026-06-10, commits 5e15677→33ccdcb) — incremental re-validation

All cycle-1 file locators into spec/plan/research/data-model/contracts/quickstart are **stale by regeneration**; re-validated below.

**My three tensions: all resolved as I would have specified.**
- **T1 resolved** — SC-003's unit defined: one navigation action = one selection + its follow-up, ≤2 AskUserQuestion interactions (spec.md:337-341); N2 restated in that unit (navigation.md:40-43); quickstart now counts honestly ("two AskUserQuestion interactions", quickstart.md:69-71).
- **T2 resolved** — N5 struck (navigation.md:47-48); FR-004 universal (spec.md:249-255); expert fast-exit rides the exit affordance, S1's exit wrap-up IS the cheat-sheet (navigation.md:16, learn-mode.md item 6). Post-deeper the slot becomes "recap this step"; S5 jump lists S1-S4 with no "back" slot (navigation.md:28-33). No affordance displaced.
- **T3 resolved** — resume qualified to the conversation everywhere; tracked at EVERY transition (silent abandonment included); wrap-up MUST disclose step reached + scope + recovery ("in a new session… one jump away") — FR-010/011 (spec.md:284-292), US2 sc.3 (spec.md:138-141), shown in walkthrough Finish (quickstart.md:62-66).

**Other cycle-1 concerns of mine, resolved:**
- Scaffold consent fork → **dedicated confirmation question, never a navigation slot** (FR-007 spec.md:266-269; scaffold.md:30-31; navigation.md:21-24 "consent is not navigation"). The 060-demanded consent-encounter pattern, now contract-pinned.
- F33 seam → **SCAFFOLDED marker + FR-014 Phase-0 consumer note** (spec.md:305-309; scaffold.md:37-42; data-model.md:86). Present-but-unfilled is now a defined state for its consumer; wrap-up names sections to fill; "removing the marker is the 'this is now real' signal" (scaffold.md:35).
- Plugin-probe false negative → artefact-grounded **dual-channel** probes; "the mode running is itself evidence the skill is reachable" (FR-006 spec.md:259-265; learn-mode.md item 3).
- Outside-repo silent suppression → stated one-line unavailability, why + how to enable (scaffold.md guard 3 :57-60; SC-004).
- Cold-start discoverability → FR-013 widened to frontmatter description (the real routing surface) + README quick-start leads with learn + install.sh "Next:" (learn-mode.md registration table :9-18; C1 asserts incl. staleness grep).
- Manual-only guard checks → SC-008 mechanical: C6 write-idiom scan, C4 pinned canon-table delimiters incl. quorum table, C7 four-path scaffold matrix with recorded outcomes (quickstart.md:110-151).
- Install sub-step → **instruct-only, effects: none**, declared on the SubStep entity (data-model.md:39-49). Effects-at-call-site done right: the union of declared SubStep effects IS the write surface (learn-mode.md:51-56).

**Residuals (cycle-2, verified live and FILED at the cycle-2 author stage — none gate-blocking; all 14 families verdicted resolved):**
- **R-A (yellow): runtime canon-pointers are repo-relative; the runtime audience is installed.** CanonicalPointer.doc is a repo-relative path (data-model.md:100); the cite-failure clause says "point to the repo path" (data-model.md:101; learn-mode.md Refusals; scaffold.md:65-70). The cohort most likely to hit a missing cited doc — the stale/partial *installed* user, esp. plugin channel — is handed a recovery pointer in a coordinate system that doesn't exist on their disk. R6 already solves this for the template source ("the running skill's own templates/ copy"); the same base-path resolution is not specified for cite pointers. Gap question filed.
- **R-B (green note): S5 offers two terminal verbs** — slot 1 "Finish" advances to the exit wrap-up, slot 4 "Exit" delivers the same wrap-up (navigation.md:13,16; quickstart.md:60). Identical consequence, two labels. Consequence of FR-004 universality (my own T2 demand) — consistent, not relitigating; worth one line of label-honesty in LEARN.md authoring.
- **R-C (green note): same-conversation re-entry to a *different* step costs 3 interactions** (resume question + landing-step nav + jump follow-up); SC-003's ≤2 unit is scoped "from any step" so the resume question sits outside it. Honest as written; the disclosed promise ("new session… one jump away") is accurate for its scope.
- **R-D (hand to Beck/Bob): C5's snippet carries a vestigial dead first line** (`$CLAUDE_HOME_TMP_CHECK`, quickstart.md:127-128 — leaves a stray mktemp dir, asserts nothing); the operative assertion (:129-131) is correct, and install.sh:15 confirms `CLAUDE_HOME` is honored so the check is executable. Check mechanics, not my lens — flag, don't author.
- **R-E (carryforward, minor — sharpened at filing): README fallback path is contract-unpinned.** Family M's "fallback cites installed template path" is encoded for install.sh "Next:" (learn-mode.md:17) but NOT for the README (learn-mode.md:16 says only "remains as the cited fallback") — README.md:272's hardcoded `~/code/chorus-review/` could survive implement and still pass C1. Filed green.

**Cycle-1 gap answered**: dogfood residue — the in-repo walkthrough **declines the scaffold by default**; accepting is named a separate operator decision (spec Assumptions; scaffold.md:72-74; F61). Matches [[project-jobgenie-account-as-test-fixture]]-class concern handled correctly here.

### Cycle-2 vote stage (2026-06-10) — corrections to my own verdicts

- **T2 "resolved" needs one qualifier (Norman G19, verified)**: the exit-IS-cheat-sheet fix works at runtime, but navigation.md:16 pins the bare label "Exit the tutorial" with the cheat-sheet only in the behavior column — the expert cannot see at selection time that exit delivers the quick reference. The signifier half of family A is open until the contract pins the rendered label.
- **Plugin channel is structurally unserved (dno G6 / Richards G12, verified red)**: plugin.json roots the skill at `skill/chorus-review/` (no `templates/` there; verified by ls); install.sh's R6 edit serves only the file-path channel; scaffold.md:32's "both install channels work" is a written contract the corpus doesn't deliver. Compounds my R-A (repo-relative cite pointers) — the installed/plugin cohort is the systematically weakest-served user of 007. Also: plugin.json packages 7 of 10 agents (G16), so the FR-006 agent probe misreports for every plugin user, and FR-006's only remedy is clone+install.sh — wrong mental model for that cohort (Norman G18).
- **C6 write-idiom scan empirically dead for cp/tee/mkdir** (`\|` literal in ERE; reproduced myself) — SC-008 would certify the sole-write promise, the feature's single most user-protective invariant, on a gate that cannot fire. Voted with the red graders (G7/G23) over Richards' yellow (G13).
- Voted 22/22 PRIORITIZE — every cycle-2 claim verified true against the corpus; convergence on verified facts (plugin gap ×2, C6 regex ×3, C5 dead stanza ×4) is signal, not groupthink.

### Run 1 outcome (historical) and run 2 clean-slate (current)

Run 1: cycles 1→2→3 all BLOCKED (38→14→6 🔴, monotonic), S7 bound reached, gateA-escalation-1; operator instruction: *"clean slate rerun for the spec. let's try again."* Run-1 verdicts are dead; the cycle-3-regen corpus is live.

**Run 2 cycle-1 exploratory (2026-06-12) — re-validation of the cycle-3-regen corpus:**
- My prior residuals are RESOLVED in the regen: R-A cite pointers now base-path-resolved (research.md R10 — "pointer coordinates that exist in the failing user's world"); plugin channel now delivered, not just probed (FR-015, learn-mode.md plugin.json row: templates/ + 10/10 agents; C5b asserts); install sub-step remedy branches by detected channel (R5/G18); S5 Finish/Exit convergence is now a *declared* convergence (navigation.md slot 1, G3/G27); navigation.md declared THE normative surface (R12); exit-label/cheat-sheet pinning covered (quickstart acceptance map, G19).
- Guards re-verified: scaffold 3 guards + C7 four-path matrix (accept/decline/existing-byte-identical/outside-repo stated notice); SubStep declared-effects = whole write surface (data-model, FR-005, C6 now fixture-self-tested per acceptance map).
- **THE OPEN GATE (run 2): audience existence/count.** Spec frames a newcomer cold-start audience (spec.md Context) and prices for an external plugin-channel cohort (FR-015/C5b), but run-1 ledger records "zero newcomers" served (agent-sdlc-log.md:284,356) and C&F's RSVP already called it "a bet on an audience not yet evidenced" (:39). No operator confirmation anywhere. Filed as my exploratory open-gap with an exact operator question — N=1-operator vs known-colleagues vs unknown-external re-prices every channel/registration finding.

### Run 2 cycle-2 incorporation verification (2026-06-12, commits a7b53af+b934dd6)

- **Audience gate CLOSED**: operator confirmed external/public newcomers, canon=Core, dogfood-only nav enforcement; challenges to the dogfood decision demoted 4-0 (COOP-4 — do not re-file). **SC-010** added (spec.md:513-517): one real external newcomer session in the gate ledger within 30 days of merge; until then the ledger says the loop is open. This is the validated-learning closer I asked for.
- **Cluster A resolved** (my COOP-1): agents/ directory is the authoritative roster, no filename enumeration anywhere — contracts/learn-mode.md:18, plan.md:155-157, research.md R11. Residual counts ("7 of 10", "10/10") survive in rationale text only (research.md:163, plan.md:47, spec.md:91) — historical context, accepted.
- **Cluster B resolved** (COOP-2/3): quickstart C5b is bidirectional (every agents/*.md packaged AND no phantom entries) + description grep. **But the description grep is literal-bound to "[Ss]even"** — filed COOP-8 🟡: the description still carries a roster count that will stale on the next roster change and the check only catches yesterday's value. Cluster-A principle (no roster restatement) not applied to the count.
- **Cluster C mostly resolved** (COOP-5): C1 covers all 3 FR-013 surfaces with a stated phrasing family; spec normative text scanned with Clarifications excluded as a structural unit; ran C1 live myself — PASS (Context now "two review modes" spec.md:16; FR-013 "two-mode heading region" spec.md:423). **EXCEPT: C2 is a silent-polarity counterexample** to the suite-wide FAIL-token rule the quickstart header itself declares (quickstart.md:5-7) — C2 is a bare grep, emits nothing on failure; an empty LEARN.md passes the operator's grep-for-FAIL workflow. Filed COOP-7 🔴.
- **Cluster D resolved**: channel-resolvable cites — data-model.md:34 S2 annotation (install.sh cite = file-path channel only; plugin-channel resolves to packaged template+SKILL.md), C3 channel-awareness note.
- Lesson re-confirmed: when a suite declares a uniform contract ("every stanza emits FAIL:"), verify EVERY stanza against it — the team fixed the stanzas that were named in findings and missed the one that wasn't.

### Sequencing / environment facts (unchanged)

- Branch SKILL.md is pre-006 ("Two modes"); R8 corrected at cycle 2: 006 does NOT deliver a three-mode SKILL.md — **007 itself performs the reframe** (research.md R8). 007 lands after 006 (PR #5 open). Installed skill at ~/.claude carries 006-era canon.
