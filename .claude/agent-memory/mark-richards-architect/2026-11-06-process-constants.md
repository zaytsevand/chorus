---
name: understanding-2026-11-06-process-constants
description: Exploratory record for round 2026-11-06 on docs/process-constants.md (C1-C9 note), covering its home and how lenses cite it; gates referenced from the addendum
metadata:
  type: project
---

# Understanding: Mark Richards, process-constants note (round 2026-11-06)
Built 2026-11-06. Target: `docs/process-constants.md` @ a6bf3af. Prior record: [[understanding-2026-10-29-pr47]].

## Gates
- **#1 Ranked characteristics**: REFERENCED from `docs/reviews/CHORUS-PROJECT.md` § Architecture (~L114): 1 conformance/reliability, 2 portability, 3 ease of change, 4 simplicity [operator-confirmed 2026-09-27]. Re-read today. It is still fresh: the note is docs-only and does not change the style.
- Bar: a published plugin that strangers install (§ Product ~L100).
- **#2 Constraints**: REFERENCED from § Hard constraints (~L132): canon is markdown, Claude Code only, and **only the canon, `bin/` and `schema/` reach users**. `docs/` does not ship.
- Shape rule (§ Architecture ~L116): each rule lives in one file and other files refer to it by path.

## Referenced (locators)
- Residence rule: `skill/chorus-core/SKILL.md` § Invariant residence (~L68). It covers the I/D/S8-S11 tokens. FC1 in `scripts/check-suite-integrity.sh` (~L46) enforces it.
- I1-I9: `skill/chorus-core/CONDUCTOR.md` ~L224. I9 says the chair decides nothing.
- Nothing in skill/, agents/, scripts/ or the constitution references the note (grep run 2026-11-06).

## Inferred (provisional, to verify in Round 1)
- **Portability.** `docs/` is not shipped, so a lens or the canon that cites `docs/process-constants.md` by path leaves a dangling reference in an installed plugin. Ranked quality #2 is at stake.
- **New token family.** C1-C9 is unpoliced. FC1 does not cover a C-prefix, so the ids could fork or be redefined in several places.
- **Duplicate authority.** § "What this means for chorus" restates rules that the canon already owns: ranking, one way out per question, rulings recorded so nothing is asked twice, and I9 named owner. That gives each rule a second author with no parity check between them.

## Open gaps
See the handback questions Q1-Q3 for this round.
