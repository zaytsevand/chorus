---
name: understanding-2026-11-06-process-constants-2
description: Norman-lens exploratory record, round 2026-11-06-2 on docs/process-constants.md after rulings R-1..R-9 (I9 amend, constant-as-principle)
metadata:
  type: project
---

# Understanding record: round 2026-11-06-2, docs/process-constants.md

Lens: human-centred design. Prior: [[understanding-2026-11-06-process-constants]] (round 1, my F9-F12, R2-4).
Baseline: `docs/reviews/2026-11-06-chorus-review.md` (home skill/chorus-core/PROCESS-CONSTANTS.md).

## Referenced (re-read 2026-11-06)

- **Gate (user/goal)**: answered by operator ruling R-1 (readers = lenses on installed suites) plus
  addendum `docs/reviews/CHORUS-PROJECT.md` §7 (operator reads questions + final record). Second
  reader = operator reading constant-cited findings. Source: round-2 explore brief.
- R-7 landed: `skill/chorus-review/BRIEFS.md:40-43`, note L97-101. Constant-only principle evidence is now legal.
- Principle evidence carries `ref` (where established): `skill/chorus-core/schema/common.schema.json:84-89`.
- Renderer drops that ref for findings: `skill/chorus-core/bin/render.mjs:33-38` (tagOf returns bare
  "[principle]"), used at L64, L189. Decisions do render refs (L56). My R2-4 still unaddressed.
- I9 amended: `skill/chorus-core/CONDUCTOR.md:254-268` (chorus signs advice; result's goal stays open, operator's).
- R-5 (record shows validation open + who closes): no goal/validation field in
  `skill/chorus-core/schema/review-record.schema.json` (grep goal/result/sign: none).
- Note still unreferenced from skill/, agents/, install.sh (grep empty) — expected until move.

## Inferred (candidates)

- R-7 widens the gulf of evaluation: the operator meets "[principle]" with no C-id or pointer, and cannot
  see whether the lens checked "no code contradicts it". The condition is invisible at the point of trust.
- R-5/I9 are told in canon prose only; the system image the operator actually reads (rendered record)
  says nothing about validation being open. Spec and runtime disagree.
- "Contradicting code" is undefined for a cognition constant (C1/C2): what code could contradict "~4 slots"?
  Lenses will form divergent models of the exemption.

## Open gaps

- Is R-5 meant to be a record field (schema/render) or summary prose? Decides whether its absence is a finding.
- Who verifies the "no contradicting code" condition: the authoring lens alone, or cross-eval?
