---
name: understanding-2026-10-29-pr47
description: Norman-lens exploratory record for the 2026-10-29 chorus review of PR #45 (coryphaeus folded into chorus-core) + PR #47 (scripted spine, conduct.mjs) — needs map, locators, open gaps
metadata:
  type: project
---

# Understanding record — chorus review 2026-10-29, PR #45 + #47

**Lens**: human-centred design. **Date**: 2026-10-29. **Mode**: PR design review
(approach and seams). Locators are repo-relative. Prior record:
[[understanding-chorus-review-007]] (project facts there partly stale: repo is now
a plugin with an addendum; coryphaeus is gone).

## Carried project facts (re-checked 2026-10-29)

- Addendum exists: `docs/reviews/CHORUS-PROJECT.md`. §7 Product: published plugin
  installed by strangers; installer/onboarding findings at full severity
  [operator-confirmed 2026-09-27]. §1 still names `skill/coryphaeus/` as the
  composition root — stale after #45 (system-image drift, addendum vs tree).
- Ranked qualities (§7 Architecture): conformance/reliability, portability, ease
  of change, simplicity.

## Needs map (this round)

1. **User + goal [gate]** — PARTLY REFERENCED. "Who": addendum §7 (strangers who
   install). New in #47: a second, direct user of the CLI — the calling agent
   session (spec `specs/018-scripted-spine/spec.md` US1 L61-80). Operator's goal
   for the spine as maintainer: spec Input L9-12 ("orchestrator more a script than
   an agent"). NOT referenced: what the round-running operator is meant to see or
   do with the spine (watch, intervene, resume, audit `.run.json`). → gap Q1.
2. **Entry points** — REFERENCED. `skill/chorus-core/CONDUCTOR.md` § The conductor
   loop (L334-358: init/next/submit/fail/ack/answer/record); `chorus-review/SKILL.md`
   L61-66; `chorus-sdlc/SKILL.md`. `<root>` resolution in an install unstated in
   the loop block (L294) — check at authoring.
3. **Feedback surface** — REFERENCED. Action table CONDUCTOR.md L359-366; `say()`
   routes exit-0 to stdout, else stderr (`bin/conduct.mjs` L727); halt → "the record
   says what awaits the operator" (L366). Live operator notice on halt unstated.
4. **Error catalog** — REFERENCED, candidate drift. conduct exit codes (CONDUCTOR.md
   L370-372): 0 ok · 1 refused · 2 not-asked-for OR usage · 3 version mismatch.
   Validator exit codes in the same file (L296, L318-323): 1 invalid · 2 usage.
   Same numbers, two tools, different semantics; conduct's 2 merges a slip (typo,
   usage) with a protocol mistake (submit nobody asked for); `record` returns 2 on
   assemble failure (conduct.mjs L746) — a third meaning. Candidate finding.
5. **Conceptual model** — REFERENCED. "Script computes, agent does what a program
   cannot" (spec Outcome L14-25; CONDUCTOR.md L336-344). One vocabulary home
   (`schema/vocab.schema.json`, CONDUCTOR.md L301-311).
6. **Cross-component contracts** — REFERENCED. `schema/run-log.schema.json`
   (agent↔script); validator kinds list CONDUCTOR.md L300-301.
7. **Spec/interface/runtime disagreement** — INFERRED candidates: (a) exit-code
   semantics above; (b) addendum §1 coryphaeus; (c) dogfood: `test/vocab-lint`
   roster check reads repo-root `.claude-plugin/plugin.json`, absent in an install
   (round context) — a shipped check that fails for the installed user with a
   message about a file they never had; (d) install.sh "not ours" skip of
   pre-manifest stale SKILL.md until `--force` — upgrader silently keeps old
   skills (gulf of evaluation on upgrade; round context, verify in install.sh).
   Spec Known limits L190-200 (out-seated JOIN vs validator) are disclosed, good.
8. **Operator vs user** — INFERRED. Three roles now: stranger-installer, operator
   running a round, calling agent driving `conduct`. The CLI's messages are
   written for the agent; the halt/record path is the operator's only window.

## Open gaps (sent to orchestrator)

See handback of 2026-10-29; Q1 is my gate.

## Files read

addendum (L1-30, L86-120); spec 018 (L1-120, L176-200); CONDUCTOR.md L294-372;
conduct.mjs grep of exit/usage (L689-764); chorus-review/SKILL.md grep.
Not read: engine.mjs, vocab-lint test body, install.sh diff, BINDINGS.md.

## Round 1 (2026-10-29) — gate settled, findings filed

- Gate Q1 OPERATOR-CONFIRMED 2026-10-29 (round interview): "Record only". The calling
  agent is the sole reader of conduct stdout, exit codes and run.json; the human sees
  operator questions and the final record. Upgrades are agent-driven and count at full
  severity, so loud, machine-actionable errors matter. Node is required. test/ is repo-only.
- Filed F1-F6 (install skip exits 0 with mixed-version skill; "nothing asks" refusal
  for explore/ack and premature retry; init-vs-record minLength mismatch surfacing at
  the end; exit-2 overload plus init stack trace; Node-optional model in install.sh/README;
  abort page hides re-ask). All were reproduced in a tmp dir, not only read.
