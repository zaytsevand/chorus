---
name: project-007-learn-gatec-findings
description: Gate C (impl review) of feature 007 chorus learn LEARN.md — HCD findings on resume disclosure and jump-back disclosure asymmetry
metadata:
  type: project
---

Gate C implementation review of `chorus learn` (007), HCD lens, LEARN.md vs contracts/navigation.md. Reviewed 2026-06-12.

Verdict: concern (1 yellow). Q4 label/ordering conformance fully clean.

**NORM-1 (yellow) — resume offer's scope honesty depends on a wrap-up the silent-abandonment path skips.**
navigation.md:60-67 presents the resume question with no scope caveat at selection, relying on navigation.md:64 "the wrap-up has already disclosed" conversation-scope. But FR-010 tracks silent abandonment (LEARN.md:43-44) — a user who closed mid-step never reached a wrap-up, so meets the resume offer never having been told it is conversation-scoped. New session: offer silently absent, no explanation. Honesty hinges on a disclosure that path provably skipped. [gulf of evaluation]

**NORM-2 (yellow) — S1–S4 jump "back to where I was" option is undisclosed in realized prose.**
navigation.md:35-36 pins S1–S4 jump follow-up = 3 remaining steps + "back to where I was". S5's overflow rule is disclosed inline (LEARN.md:195) but S1–S4's "back" affordance never surfaces in LEARN prose — asymmetric disclosure. Minor; the "back" affordance is recoverable/obvious. [signifier]

Strengths: S2 consent-before-navigation (LEARN.md:105-107) correctly separates the write decision from the go-where decision. S1 exit-as-cheat-sheet label states the destination before selection (LEARN.md:36-37) — affordance signifies its consequence. Per-step depth state (LEARN.md:30-32,198) prevents the dead "Recap" option.

**Why:** these compound across future learn-mode edits — the resume disclosure is the one place the tutorial can lie to a user about persistence.
**How to apply:** at Gate B/C of any learn-mode change, re-check that resume scope is disclosed on a path the silent-abandonment user actually traverses, not only at the wrap-up.
