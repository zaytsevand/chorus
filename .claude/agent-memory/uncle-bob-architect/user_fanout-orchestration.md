---
name: fanout-orchestration
description: User collaborates via multi-agent fan-out / Workflow orchestration and answers structured decision questions decisively
metadata:
  type: user
---

The user actively asks for "fan out" / collaborative multi-agent work and is
comfortable with Workflow-based orchestration (parallel subagents + a verify
barrier). They answer AskUserQuestion forks decisively and expect the agent to
drive execution once scope is set.

**How to apply:** For substantial refactors/reviews, propose a fan-out plan and use
parallel agents/Workflow for the mechanical breadth, but keep the design (carve-up,
import edges) and the verify/assembly barrier in your own hands — parallel agents
are inconsistent on fiddly details (e.g. relative-import depth), so give them exact
specs and verify centrally. Work happens in `.worktrees/<branch>/` isolation; gate
every step on the project's real CI checks (pytest, pyright, ruff, lint-imports).
