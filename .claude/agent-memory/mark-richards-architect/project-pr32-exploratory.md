---
name: project-pr32-exploratory
description: PR #32 + coryphaeus exploratory (2026-09-27) — gate status, open gaps, anchors for the chorus/coryphaeus seam review
metadata:
  type: project
---

Round 2026-09-27, PR #32 (suite-review/integration) + new root repo coryphaeus. Seated board: Richards, Security, Evans, Cooper, Norman.

Gate (need 1, ranked characteristics): OPEN. No CHORUS-PROJECT.md addendum; constitution has no ranking; standing-rulings.md (R-1..R-10, Q-1..Q-17) rank nothing. My older ranking in [[understanding-project]] was *inferred*, not sourced — do not reuse as a gate answer. Asked operator 2026-09-27.
Bar assumed pending answer: internal tooling, single operator, dogfooded (suite-review/R-7, Q-8).

Why: the reliability/code-validation direction (R-2, R-3, Q-12) hints at conformance > simplicity, but that is inference.
How to apply: re-read standing-rulings.md next round; if the operator answered, record the ranking here with source id.

Coupling hotspots to chase: Stage-4 tally rule authored in GATE-PRIMITIVE.md AND coryphaeus bin/validate.mjs (Q-14 made prose follow code) — duplicate authority, needs ruling. Chorus has no visible version pin for coryphaeus schemas (grep found none) — contract-versioning gap to verify.

## Round 1 rulings (2026-09-27, r1/richards.json)
- Stage-4 rule (GATE-PRIMITIVE vs coryphaeus tally()): SANCTIONED DIVERGENCE; owner chorus-core; parity via machine-readable case table read by coryphaeus test. Proposed 🔴.
- Port table restated in coryphaeus SKILL.md with divergent defaults: CONSOLIDATE into CONDUCTOR.
- Validator-failure policy (ABSTAIN vs retry-once): CONSOLIDATE into CONDUCTOR.
- Verified: chorus canon names no coryphaeus/brief (direction correct, unenforced); installed coryphaeus == repo; coryphaeus has no CI/remote/version.
