---
name: process-constants-round-2-understanding
description: Test-strategy understanding record for chorus round 2026-11-06-2 on docs/process-constants.md — risk map, check layers, oracle/I9 locators, open gaps
metadata:
  type: project
---

Round 2026-11-06-2, target `docs/process-constants.md` (baseline record `docs/reviews/2026-11-06-chorus-review.md`). Seated by operator override (R-8). Pointers, not evidence; re-read sources before reuse.

## Referenced
- Check layers as they run: `.github/workflows/integrity.yml` — three jobs: `scripts/check-suite-integrity.sh` (FC1–FC7, grep/structure fitness checks), `node --test skill/chorus-core/test/*.test.mjs` (+ committed records validate), `scripts/test-install-roundtrip.sh` (install -> verify -> uninstall). No docs/ checks.
- Gate risk map (addendum `docs/reviews/CHORUS-PROJECT.md` §7, 2026-10-29): conformance/reliability first; install/upgrade full severity; code is authority for mechanical rules, canon for ports/failure policy; `canon-drift.test.mjs` is the canon/code seam check ("fix whichever side does not own the rule").
- I9 oracle clause: `skill/chorus-core/CONDUCTOR.md:264-268` — result signable only with an oracle the lenses can call; else open, operator's.
- Sign-off order pinned by `skill/chorus-core/test/conduct.test.mjs:25` (provide:signoff) and :203 (sdlc operator sign-off).
- Constant-as-principle rule: `skill/chorus-review/BRIEFS.md:38-43` (item 8), prose-only; no validator/FC check.
- Note l.83 derivatives row: "Test-pyramid proportions" tuned to write/run cost; survives as "which risk ... nothing cheaper".

## Inferred
- No C-number is cited anywhere in skill/ or agents/ yet (grep 2026-11-06); R-9 check is not due.
- ID collision: records already use `C1`, `C2` for conflicts (`examples/review-record.valid.json:342`, `conduct.test.mjs:359`, baseline record). A future C-number integrity check (R-9) must tell process constants from conflict ids — a check placed by regex would misfire.
- l.83 omits diagnostic precision and red-to-culprit time (C7 latency inside the loop); those don't fall with cheap code, so part of the pyramid's rationale rests on a constant, not on a derivative (Beck F15 adjacent, not identical).
- "Unless code contradicts it" (BRIEFS item 8) has no check; detection is left to lens judgement each round.

## Open gaps
- Which oracle(s) the operator accepts as "callable" under I9 (CI green? round-trip? none for reviews?).
- Escaped defects / flake history for the three CI jobs: unknown.
