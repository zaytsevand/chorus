---
name: understanding-2026-10-29-pr47
description: Cooper-lens understanding record for the 2026-10-29 chorus review of PR #45 (coryphaeus folded into chorus-core) + PR #47 (scripted spine, conduct.mjs). Locators only.
metadata:
  type: project
---

# Understanding record: PR #45 + #47 (Cooper lens), explored 2026-10-29

Repo: the chorus repo at PR #47 tip be31e5c; base origin/main 7eea2c2. Locators are repo-relative.
Prior record: [[understanding-chorus-review]] (feature 007 era; its install.sh locators are stale, re-check before use).

## Gate: who is the user and how many (REFERENCED)

- `docs/reviews/CHORUS-PROJECT.md:97-99`: published plugin installed by people the operator does not know; installer/onboarding findings at full severity. Operator-confirmed 2026-09-27. Re-read today. The addendum is stale on the coryphaeus composition root (round context says so), but not on audience. Gate holds by reference.
- Count: unknown external strangers (N > 1, unbounded). So prices sit at the published-product bar, not a one-operator tool.

## Who uses what in this PR (referenced + inferred)

- **Spec 018's P1 actor is the agent, not a human** (`specs/018-scripted-spine/spec.md` User Story 1). The spec input is maintainer intent ("make orchestrator more a script"). The human beneficiaries are inferred: (a) the operator, who gets records the conductor cannot paraphrase (I6 made structural), (b) the maintainer, who gets conformance (ranked quality #1). [inferred]
- The **operator** meets conduct.mjs only indirectly: `ask-operator` questions, a halt ("the record says what awaits the operator", `skill/chorus-core/CONDUCTOR.md` § The conductor loop action table), and a committed `<stem>.run.json` in their own repo's `docs/reviews/`. [referenced]
- The **stranger installing/upgrading** meets install.sh and the shipped tests. [referenced]

## Promise surfaces worth checking in Round 1

- **Node prerequisite contradiction.** `README.md:294-295` and `skill/chorus-core/BINDINGS.md:22` promise a Node-less round still runs (unvalidated). `skill/chorus-review/SKILL.md` "Run it with the conductor loop" (around :61-68) makes the script the procedure, with no Node-absent branch. A stranger without Node gets no written answer to "can I run a round?" [referenced; open gap Q1]
- **Upgrade cohort silently on old skills.** `install.sh:130` reports pre-manifest files as "skip (not ours) ... pass --force"; the only signal is a summary count (`install.sh:182`). The round context's dogfood note confirms an upgrading user would keep old SKILL.md files beside new bin/. That is a mixed install whose procedure no longer matches its tools. Installer finding, so full severity. [referenced + operator observation in round context]
- **Shipped test that is red in every install.** The vocab-lint roster test reads repo-root `.claude-plugin/plugin.json`, which an install does not have (round-context dogfood note; `skill/chorus-core/test/vocab-lint.test.mjs`). A stranger who runs the tests sees a red that says nothing about their install. My half is the user cost; the check mechanics go to test strategy.
- **Exit codes / recovery.** conduct.mjs exits 0/1/2/3 (CONDUCTOR.md § The conductor loop, last paragraph). `init` on an existing log prints "continue it with: conduct next <file>" (`skill/chorus-core/bin/conduct.mjs:715`), which is a good recovery line. I have not found a written resume promise for a round cut off mid-way (session ends, context exhausted). [open gap Q4]
- **Halt legibility.** S7 bound-reached asks the operator to waive or leave open, and leaving open halts (`conduct.mjs:352-358`). Check in Round 1 that the halted record tells the operator what to do next, beyond the fact of the halt.

## F-UV obligation

- Spec 018 § Outcome & Stage-1 proof has a "Stage boundary" that defers persona dispatch from the script, exploratory interview content, and old-record migration. None of these is a cross-user reuse deferral. The headline ("every mechanical step computed by one program") looks largely delivered by v1. Still owe one F-UV finding in Round 1. Note that the stage-1 proof is fixture-only and this round is the first live run, so the "proof" has not yet met a real persona reply.

## Out of scope this round (from round context)

specs/ internals, tests/parity/, past docs/reviews rounds, .claude/agent-memory entries (memory contract in CONDUCTOR.md is in scope), .specify/, examples/ fixtures.

## Open gaps (sent to orchestrator)

See the gap-question list in this round's exploratory hand-back (Q1-Q5).

## Operator answers (2026-10-29, operator-confirmed via r1 brief)

- One maintainer; strangers mostly use the install.sh channel; broken upgrades come in as GitHub issues. Upgrades are run by operators' agents, so the bar is loud, machine-actionable errors, and human UX matters less.
- The human sees only the operator questions and the final record. The agent alone reads conduct stdout, exit codes and run.json.
- Node is required; conduct.mjs is the only supported path. Code is the authority for mechanical rules. test/ is repo-only.
- Round 1 filed F1-F7 (two red: the Node-less promise in three surfaces; a stale entry skill after an exit-0 upgrade, reproduced in a temp CLAUDE_HOME).
