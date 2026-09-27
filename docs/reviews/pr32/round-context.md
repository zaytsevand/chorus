# Round context — chorus review of PR #32 + coryphaeus (2026-09-27)

Mode: design review of the PR's approach and seams, not a line-by-line diff review.

Target: chorus PR #32 (https://github.com/zaytsevand/chorus/pull/32, branch suite-review/integration,
worktree /home/az/code/zaytsevand/chorus/.worktrees/suite-review; ~40 files, +1.4k/-2.2k vs main 29e6e16)
and the new root-skill repo coryphaeus (/home/az/code/zaytsevand/coryphaeus, local, 63 node tests).

Concrete deltas since the last chorus:
1. chorus-core/CONDUCTOR.md § Ports: seven declared ports (decision sink, ruling lookup, record validator,
   record renderer/publisher, arbiter, fixed viewpoint, memory recall), each with a default; the chorus names
   no other skill. "Consult before raising" and "cite, don't copy" rules.
2. Persona replies (rsvp, finding-report, vote-report) and records (review-record, sdlc-log) become JSON,
   checked by coryphaeus bin/validate.mjs (a Node program) and rendered by bin/render.mjs. Constitution
   2.0.0 lifts "Markdown-only, no runtime code" (programs live outside the chorus repo).
3. Mandates removed (Cooper/Security at Gate A); cap of five + exceptional entry on every board incl. the
   base review round. Seating and the deferral checklist moved into DECISION-PRIMITIVE; the constitution
   preview into GATE-PRIMITIVE; DEFERRAL-CHECKLIST.md, CONSTITUTION-PREVIEW.md, INTEGRATION-LAYER.md deleted.
4. Severity three-level (orange removed); GATE-PRIMITIVE Stage 4 gains six settled cases, N = P + C + O.
5. chorus-review/SKILL.md rewritten (899 -> ~450 lines, INTEGRATION-LAYER folded in): R2- findings ungraded,
   convergence P + C after the count, held findings out of the top five, advisor() fallback, one failure
   rule, per-phase budgets, SendMessage continuity, one record skeleton.
6. Persona files: pasted memory boilerplate removed; standing-answer (gate) upkeep; one owner per shared hard
   rule (contracts Richards, side effects Uncle Bob, tests Beck); full descriptions restored with four
   signature questions and trigger phrases each.
7. Packaging: .claude-plugin/plugin.json (plugin "chorus", 1.0.0); install.sh mirrors skills and records a
   manifest, uninstall removes only that; FC4/FC5 integrity checks; GitHub Actions CI; release = dogfooding.
8. coryphaeus: seven JSON schemas, validator with Stage-4 arithmetic, renderer, port bindings, and rules for
   translating a chorus decision into a problem-brief entry.

Out of scope (legacy/historical, not being invested in): specs/ (historical feature specs), tests/parity/
(historical evidence of the 014 split), older docs/reviews/* artefacts. The boundary between active code
and these paths is in scope; their internals are not.

Budgets: RSVP 3 min, exploratory 15 min, Round 1 15 min, Round 2 10 min.
Note: this round reviews changes to the chorus itself, made in the same session that runs it.
