---
name: project-feature004-gateC-vote
description: Feature 004 Gate C VOTE — runtime-grounded votes on other lenses' findings; C4/C6 over-rated against on-disk artifacts
metadata:
  type: project
---

Feature 004 (advisor exploratory phase) Gate C cross-vote, my architecture lens (C7/C8 excluded).

**Why:** Markdown/prompt skill, NO runtime. Operator deliberately deferred live dogfood (T029/T031) as an accepted acceptance step and skipped Gate B by choice.

**How to apply:** votes were runtime-grounded, not doc-trusting. Key disconfirmations:
- C4 (fingerprint names no algorithm) is STALE — EXPLORATORY-PHASE.md lines 115-129 now specify "short content digest of the cited span," reject mtime and whole-file marker, name false-fresh as the dangerous direction. Over-rated.
- C6 (one profile item has two tags, contract mandates single) is a MISREAD — contract information-needs-profile.md lines 28-29 explicitly say "A need may combine, but tag the dominant source"; combined tags are pervasive across all profiles. Over-rated.
- C2/C3 are accurate: quickstart.md smoke checks verify only section-presence/file-existence/grep; the profile-coverage FF needs understanding records that only exist post-dogfood (T029). Behavior ships unverified at impl gate — but this is the operator's accepted deferral, so severity is real yet consciously accepted.
- C1 (SSOT): EXPLORATORY-PHASE.md says "neither LAYER restates the mechanic" — referring to INTEGRATION/SDLC layers, not the speckit contract. Contract restating steps is normal design-artifact duplication, lower severity than a true runtime SSOT violation.

tasks.md: T001-T028 + T030 done; T029 (dogfood) + T031 (SC validation) are [ ].
