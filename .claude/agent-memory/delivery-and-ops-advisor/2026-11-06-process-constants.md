---
name: 2026-11-06-process-constants
description: D&O exploratory record, round 2026-11-06 on docs/process-constants.md (a6bf3af): how a docs/ note ships (it doesn't), citation resolution, KEDB/recurrence keep-on cost
metadata:
  type: project
---

Round 2026-11-06, target `docs/process-constants.md` (commit a6bf3af). Locators, not copies. Prior record reused: [[understanding-2026-10-29-pr47]] (release path, install channels; re-checked below).

## Referenced
- Ship path: `install.sh` header copies only `skill/*/` and `agents/`; `.claude-plugin/plugin.json` (now 2.0.0) lists only skills and agents. `docs/` reaches users only under `--plugin-dir <repo>`, never in a copy install.
- Citation resolution: `scripts/check-suite-integrity.sh` § 4a treats any `docs/…` path in skill/agents as a *target-project* file and does not check it. So canon citing `docs/process-constants.md` would pass CI and resolve to the user's own repo at runtime, where it does not exist.
- Release = merge + local integrity + one dogfood round: `CONTRIBUTING.md` § Releasing (~line 91). No change from prior record.
- Recurrence/upkeep machinery already in canon: `skill/chorus-core/EXPLORATORY-PHASE.md` § Gate upkeep (line ~148); persona memory dirs; problem-brief rulings. The note's implication 4 (known-error store "where the next round reads it") does not name any of these.
- Addendum `docs/reviews/CHORUS-PROJECT.md` § 1 now current (core is composition root); § 3 anchor surface does not list `docs/process-constants.md`.

## Inferred
- The note has no consumer today (nothing references it) — zero run cost, zero effect. Promoting it to canon makes it a shipped dependency with drift cost under Principle I (cite, never restate).
- A KEDB for chorus = a cross-round store with owner + upkeep; nearest existing home is persona memory / round records, which are scope-excluded from review.

## Open gaps
- Who maintains the note when a constant/practice row changes; is it meant to ship to users or stay maintainer-facing.
- Scale gate still unconfirmed: maintainer count, install count (see prior record § 6).
