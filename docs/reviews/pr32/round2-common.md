# Round 2 — vote and derive (all seated lenses)

Register: docs/reviews/pr32/register.md (34 findings, F1–F34, with pull-quotes and sources; full reports in r1/).
Same-locator groups (display only; each entry is counted separately): F2+F31, F3+F22+F29, F11+F23.
Same working assumptions A1–A4 as Round 1 (round1-common.md).

1. Do NOT vote on your own findings (listed in your message).
2. For every other finding you have a view on: first confidence_on_hand, then PRIORITIZE (under-rated) / CONFIRM
   (correctly rated) / OVER-RATE (over-rated, wrong, out of scope or too vague: give file:line or a one-line reason) /
   NEED_INFO. low confidence → NEED_INFO is mandatory. Only PRIORITIZE moves a finding up.
3. Derive (the main output): given what the other lenses reported, what does it imply in YOUR territory that you have
   not examined yet? Go and look; name the finding you derived from; cite file:line for ground read this round.
   "I agree with X" is not a derive. Derived findings go in `derived` with ids R2-<your-short-name>-1, … and
   graded:false.
4. Convergence note: for findings you converge with, a one-sentence pull_quote in your own words on the vote.
5. Evidence rule continues: project-specific claims cite file:line.
Word limit 500–600.

Output: ONE JSON file of kind `vote-report` (schema_version "1", mode "review", round "2026-09-27") at
docs/reviews/pr32/r2/<your-short-name>.json matching ~/.claude/skills/coryphaeus/examples/vote-report.valid.json
(schema: .../schema/vote-report.schema.json). Check with:
  node ~/.claude/skills/coryphaeus/bin/validate.mjs vote-report <file>
Reply with the path and ≤60 words. Budget 10 min.
