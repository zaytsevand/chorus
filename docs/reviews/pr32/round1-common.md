# Round 1 — common brief (all seated lenses)

You are one of 5 advisors in a chorus review (Richards, Security-and-Trust, Evans, Cooper, Norman).
Round context: docs/reviews/pr32/round-context.md. Out of scope (except for Security): specs/, tests/parity/,
older docs/reviews/*; the boundary with them is in scope, their internals are not.

Target: chorus PR #32 at the chorus repository (diff: git -C <path> diff main...HEAD)
and coryphaeus at the coryphaeus repository. Mode: design review of the approach and seams.

Working assumptions (operator questions queued in the operator's brief, not yet answered; state which finding
depends on which in `conditional_on`):
- A1 (suite-review/Q-19): the operator alone uses it now; outside installers are a declared future group.
- A2 (Q-20): ranked qualities 1 conformance/reliability, 2 ease of change (evolvability), 3 simplicity, 4 portability.
- A3 (Q-21): the core is the vote counting and the decision contract.
- A4 (Q-22): the operator should be told live when a reply fails validation, one retry is allowed, and a version
  mismatch should fail loudly. Note: today the two texts disagree — coryphaeus SKILL.md ("When to run it") sends
  an invalid reply back once; chorus-review/SKILL.md (Dispatch rules) counts it as ABSTAIN with no retry.
Standing rulings: docs/reviews/pr32/standing-rulings.md (cite by id; operator answers, not evidence).

Rules:
- Chase each artefact until you reach an invariant (an executable assertion or a constitution principle) or run out
  of pointers. Specs and prose are starting points. Attack declared intentions with behavioural evidence; respect
  invariants by citing where they are enforced, or surface the missing enforcement as the finding.
- Every finding cites file:line, or carries [principle] / [principle:proposed].
- Each finding: one short sentence in your own words as its pull_quote.
- confidence_on_hand high|low per finding; low → need_info true with need_info_reason. Do not invent past a gap.
- Severity you propose: 🔴 / 🟡 / 🟢. The vote decides the final severity, not you.
- 500–700 words of prose across the report; the count of findings is not capped.

Output: write ONE JSON file of kind `finding-report` (schema_version "1", mode "review", round "2026-09-27")
to docs/reviews/pr32/r1/<your-short-name>.json, matching ~/.claude/skills/coryphaeus/examples/finding-report.valid.json
(schema: ~/.claude/skills/coryphaeus/schema/finding-report.schema.json). Use finding ids F1, F2, ... (the
conductor renumbers across lenses). You may check it with:
  node ~/.claude/skills/coryphaeus/bin/validate.mjs finding-report <file>
A file that fails validation counts as ABSTAIN. Then reply with the file path and ≤80 words. End your report's last
finding with a recommendation.
