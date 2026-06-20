---
name: project-feature007-gateA
description: Feature 007 (chorus learn) Gate A authored findings — S1 option-budget pigeonhole (red), S5 jump overflow, C3 regex broken both directions (verified), plugin-channel gap
metadata:
  type: project
---

Feature 007 `chorus learn` Gate A (2026-06-10), arch lens authored 10 findings (1 red, 4 yellow, 5 green).

**Why:** the navigation contract was sized with zero slack against the AskUserQuestion
4-option budget; both boundary stages break it.

Key findings (for the vote / cycle 2):
- RED: FR-004 (spec.md:164-166, all four affordances on EVERY stage) vs navigation.md N5
  (S1 substitutes expert fast-exit for deeper, per spec edge case :137-138). 5 demands,
  4 slots — spec is self-over-constrained at S1; contract resolves by violating the MUST.
- SC-003/US2 "one navigation choice" to S3 is glossed three different ways (R3:58-59,
  N2:30-32, quickstart:54-55) but the path is always 2 interactions.
- S5 jump follow-up = S1..S4 + back = 5 options > 4 (formula's subtraction term vanishes
  at terminal stage; navigation.md:22-24).
- C3 cite-resolution MECHANICALLY VERIFIED broken: `[A-Z-]+\.md` extracts
  CHORUS-PROJECT.md (guaranteed false positive — S2 prose must name it) and cannot match
  CHORUS-PROJECT.template.md (rename escapes; SC-005 promise broken). Same regex class
  issue I'd flagged in exploratory ([[understanding-project]]).
- Plugin install channel (README:252-256) invisible to R5 probe + scaffold source —
  FR-006 misdetects, FR-007 degrades for that channel.
- Positive green: R6 (install.sh:36 gap) and R8 (006 sequencing) runtime-verified true.

**How to apply:** at the 007 vote/cycle-2, check whether spec amended FR-004 + SC-003
metric and whether C3 moved to a structured per-stage "Cites:" list. If C3 still scrapes
prose with an uppercase-only regex, re-raise.

**Cycle-2 incremental exploratory (2026-06-10):** all three open items CLOSED at
contract level (C3 structured Cites; FR-014 ternary w/ Phase-0 locus verified at
installed SKILL.md:68-79; consent excluded from SC-003 unit, navigation.md:21-24).
NEW to author at cycle-2: C6 write-idiom regex empirically non-firing (ERE `\|`
literal — yellow, same H/K class); plugin-channel template path unresolvable
(plugin.json skill root vs repo-root templates/ — yellow); C1 staleness grep misses
SKILL.md:30 "Both modes run it" (nit); C5 vestigial $CLAUDE_HOME_TMP_CHECK lines
(nit). Full detail in [[understanding-project]] cycle-2 delta.

**Cycle-2 RSVP spot-check (2026-06-10, commits 5e15677→33ccdcb):** navigation.md
regenerated and verified on disk — N5 struck (:47-48), S1 exit-wrap-up-IS-cheat-sheet
(:16), S5 jump = S1-S4 no-back by rule (:28-33), SC-003 unit defined ≤2 interactions
(N2). Family-A red closed at contract level. Open for full review: (1) does SC-008/C3
consume FR-008's structured Cites or still regex prose; (2) NEW FR-014 SCAFFOLDED
marker makes Phase-0 consumer ternary (was binary per my F33 check) — cross-mode seam;
(3) consent-question exclusion from SC-003's unit vs US2 acceptance test.

**Cycle-2 AUTHORED (2026-06-10):** family verdicts 12/14 resolved; F and K false.
UPGRADED plugin-template finding yellow→red: scaffold.md:32 + research.md:79-81 claim
"both channels" but name `<skill-base>/templates/`, which exists only on the file-path
channel post-R6 (plugin.json roots skill at skill/chorus-review/; templates/ at repo
root; install.sh never runs for plugin) — F6-class misrouting recurs; tasks would
encode the wrong probe path. One-line fix: resolution rule names plugin-root fallback
(`<skill-base>/../../templates/`) or templates joins plugin packaging. C6 stayed
yellow (dead cp/tee/mkdir branches, empirically re-tested; redirection + Write/Edit
branches DO fire; C7 matrix + manual backstop exist). C4 pins verified NON-vacuous
against installed canon (net ≥ +2 GATE-PRIMITIVE.md:93; J ∈ {3,4} SKILL.md:229;
catalog DECISION-PRIMITIVE.md:143). Greens: C1 staleness misses SKILL.md:30; C5
vestigial draft lines (quickstart.md:127-129); plugin.json 7/10 agents (S1 probe will
surface it); FR-014 second consumer = per-advisor Cached tier
(EXPLORATORY-PHASE.md:48,73-87), mitigated by self-describing marker text.
