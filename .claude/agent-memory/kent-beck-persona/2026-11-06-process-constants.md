---
name: 2026-11-06-process-constants
description: chorus-review round 2026-11-06 on docs/process-constants.md (C1–C9) — Beck exploratory record: feedback loop, where canon drift is cornered, duplication with CONDUCTOR
metadata:
  type: project
---

Exploratory record, round 2026-11-06, target docs/process-constants.md (commit a6bf3af). Pointers only; re-read before relying.

**Referenced**
- Feedback loop: `node --test skill/chorus-core/test/*.test.mjs` + `scripts/check-suite-integrity.sh` (FC1–FC7, also in CI .github/workflows/integrity.yml). Seconds, not minutes.
- Drift is cornered only between canon and code: skill/chorus-core/test/canon-drift.test.mjs ("fix whichever side does not own the rule"). Prose-to-prose drift is not tested.
- FC4 reference integrity scans skill/ and agents/ only; docs/ is outside every check. FC5 stale tokens cover I/S ranges, not C1–C9.
- Overlap candidates (two authors, one rule): CONDUCTOR.md:32 EWD "attention scarcest" vs C1; CONDUCTOR.md:284–286 "consult before raising / cite, don't copy" vs implication "rulings recorded so nothing is asked twice"; CONDUCTOR.md:260 "inventory, not throughput" vs the 10x test.
- Nothing cites the note (grep).

**Inferred**
- If the note moves into canon, its "What this means for chorus" bullets become a second author of CONDUCTOR rules with no test able to see them disagree.
- Implication 3 (lens names a constant) is a new lens obligation with no validator field or check — unenforceable as written.

**Open gaps** — see round questions: is the note normative (lenses must cite) or advisory; does the operator want it under a check.

Related: [[lesson-presence-test-vs-behavioral-proof]].
