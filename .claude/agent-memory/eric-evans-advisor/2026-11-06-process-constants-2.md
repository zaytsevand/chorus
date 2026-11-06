---
name: process-constants-2-understanding
description: Evans understanding record for chorus round 2026-11-06-2 on docs/process-constants.md: Core Domain gate answer, language seams around "principle", C-ids and ITIL terms
metadata:
  type: project
---

Round 2026-11-06-2, target docs/process-constants.md (planned home skill/chorus-core/PROCESS-CONSTANTS.md).
Baseline record: docs/reviews/2026-11-06-chorus-review.md.

## Gate: Core Domain (standing answer)
- Core = the conductor's procedure and invariants (phase gates, I1-I9, refusals). Vote rules, personas,
  packaging and rendering are supporting. Source: docs/reviews/CHORUS-PROJECT.md § Domain (~line 128),
  operator-confirmed 2026-09-27; re-read 2026-11-06, still current.
- So the process-constants note is a Supporting artefact (advisory rationale, rulings R-2/R-3). It touches
  the Core only where it changes what the cascade/I8 accept, through "principle".

## Referenced (locators)
- "principle" defined as cascade terminus "named in governance": skill/chorus-core/CONDUCTOR.md:176,181.
- I8 `[principle]` must cite where established (constitution clause, prior chorus finding, project doc):
  CONDUCTOR.md:246-248.
- R-7 lets a constant be that principle unless code contradicts it: skill/chorus-review/BRIEFS.md:38-43;
  docs/process-constants.md "What this means for chorus" bullet 4 (commit 2608fbf).
- Validation sense: CONDUCTOR.md:38-39 ("validates the procedure") vs note C8 (validation = against reality);
  first round F9 already raised it.
- I9 now: chair decides nothing; chorus signs advice, not result (CONDUCTOR.md:254, commit 539ca94).

## Inferred (lens)
- Seam: "principle" now has two sources of authority, governance (binding) and a C-id (advisory, R-2).
  An advisory text terminating a Core cascade is the language drift to watch; a distinct tag or explicit
  mapping is the likely remedy (finding territory, not a gap).
- ITIL vocabulary (problem, incident, known error, KEDB) is imported with no canon home; R-4 says advice
  only, so it should stay labelled as borrowed vocabulary, not a suite term.
- "constant" vs "invariant": the note disclaims I1-I9 (line 8); C-ids vs I-ids share a letter+number shape.

## Open gaps
- none needing the operator; R-1..R-9 cover placement, status and the C-id check timing.
