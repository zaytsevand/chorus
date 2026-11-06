---
name: understanding-2026-11-06-process-constants-2
description: Exploratory record for re-run 2026-11-06-2 on the process-constants note; R-7 rule now in two files (BRIEFS item 8 + note), C-id integrity-check shape
metadata:
  type: project
---

# Understanding: Mark Richards, process-constants re-run (2026-11-06-2)
Built 2026-11-06. Prior record: [[understanding-2026-11-06-process-constants]]. Baseline: `docs/reviews/2026-11-06-chorus-review.md` (home `skill/chorus-core/PROCESS-CONSTANTS.md`, my F1-F3).

## Gates (re-read today, fresh)
- #1 ranking: `docs/reviews/CHORUS-PROJECT.md` § Architecture: conformance/reliability > portability > ease of change > simplicity [op 2026-09-27]. Bar: published plugin for strangers (§ Product).
- #2 constraints: § Hard constraints. Shape rule: one rule, one file, others refer by path [op 2026-09-28].
- Operator rulings R-1..R-9 are in the round's explore brief (advisory, ships, integrity check lands with first C-citation).

## Referenced
- R-7 rule authored twice by 2608fbf: `skill/chorus-review/BRIEFS.md:40-43` (item 8, shipped) and `docs/process-constants.md` chorus section bullet 4 (unshipped).
- BRIEFS.md:40 says "a process constant" without a path; no shipped file defines the term today.
- FC1 residence regexes `scripts/check-suite-integrity.sh` ~L41-57 match list-form defs (`- **I1.**`). The note defines C1-C9 as table rows (`| C1 | **Attention**`), which those regexes do not match.
- Dependency direction: chorus-review REQUIRES chorus-core, so BRIEFS -> core/PROCESS-CONSTANTS.md points inward. That is fine.

## Inferred (verify in R1)
- Duplicate authority on R-7: the likely ruling is CONSOLIDATE. BRIEFS item 8 owns the rule and the note's bullet becomes rationale with a path back (R-3). The other choice is a parity test, but R-3 already says the bullets are rationale, not rules.
- An R-9 check copied from FC1 would miss table-form C-defs. It needs a residence regex for the table form.
- The note's bullets 1-2 (ranking, rulings, I9 owner) still restate canon. Baseline F3 is still open.

## Open gaps
- Does the R-9 check police residence (C-ids defined only in PROCESS-CONSTANTS.md) or only resolution (cited ids exist)?
