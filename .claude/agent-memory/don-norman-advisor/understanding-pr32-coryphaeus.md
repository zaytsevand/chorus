---
name: understanding-pr32-coryphaeus
description: Norman-lens exploratory map for chorus PR #32 + coryphaeus round (2026-09-27) — gate standing answer, needs status, anchors
metadata:
  type: project
---

Round 2026-09-27, chorus review of PR #32 (suite-review/integration) + coryphaeus repo.

**Gate (#1 what the user came to do), standing answer, 2026-09-27:** users are the operator (solo dev
running rounds) and the persona/orchestrator agents acting as callers of the validator. Operator goal:
reliable persona output checked by code (suite-review/R-2, R-3), records they can read as pages (R-5),
installs that stay current by dogfooding (R-7, Q-8). Source: docs/reviews/pr32/standing-rulings.md.
Who/how many is Cooper's gate; re-read his answer before reuse.

**Why:** the rulings state goals, not tasks. Re-check freshness against the rulings file before trusting.

**How to apply:** judge feedback surfaces against "the operator can trust and read the round's output".

Needs: 1 referenced(rulings) · 2 referenced(CONDUCTOR § Ports) · 3 partial: failure-ABSTAIN recorded with
reason (chorus-review SKILL.md:160) and rendered as "(failure rule: …)" (coryphaeus bin/render.mjs:84) ·
4 referenced(validate.mjs exit 0/1/2, err/warn messages) · 5 referenced(SKILL.md, README) ·
6 inferred(port defaults) · 7 inferred · 8 inferred (operator vs agent-as-caller).
