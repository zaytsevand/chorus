# Contract: the opt-in addendum scaffold

**Feature**: 007-chorus-learn-onboarding (cycle-3 regen) | Binds: `LEARN.md` S2
sub-step, `install.sh` (template deployment), `plugin.json` (plugin-channel
packaging — FR-015), `templates/CHORUS-PROJECT.template.md` (copy-safe preamble),
`SKILL.md` Phase-0 note (consumer behavior)

The tutorial's **only write**. Everything in this contract exists to keep that true
(FR-005/FR-007, SC-004), and to make the written file honest to its later consumer
(FR-014).

## Deployment precondition (both channels — FR-015)

**File-path channel** — `install.sh` deploys the template with the skill:

```
cp templates/CHORUS-PROJECT.template.md  →  $SKILL_DST/templates/
```

Without this, an installed skill cannot reach the template from a user project
(research.md R6 — install.sh:36 ships only `skill/chorus-review/*.md` today). The
installer's "Next:" prose leads with `chorus learn` and cites the installed template
location as the manual fallback (FR-013). **Check C5 asserts the installed side**:
after `./install.sh` into a temp `CLAUDE_HOME`, the template exists at
`$SKILL_DST/templates/`.

**Plugin channel** — `plugin.json` packages `templates/` (sibling of the skill root
in the plugin layout) and the **full persona-agent set** (R11). Without this,
`install.sh` never runs for plugin users and no template exists anywhere in their
world (G6/G12). **Check C5b asserts the packaging** (template path + 10/10 agents
vs the `agents/` directory).

## The scaffold action (S2 sub-step)

| Step | Contract |
|---|---|
| Offer | after explaining the addendum (sections 2/3/5), S2 offers the scaffold on a **dedicated confirmation question** — its own AskUserQuestion call, never an option on the navigation question (family D), **presented before S2's navigation question** (ordering pinned in navigation.md, G20) |
| Confirm | the write happens **only** on explicit acceptance of that dedicated question; any other answer writes nothing |
| Source | resolution order (R6): **(1)** inside this repo, the checkout's `templates/CHORUS-PROJECT.template.md` (authoritative source of structure); **(2)** `<skill-base>/templates/` — the running skill's own copy; **(3)** the plugin root's `templates/` (R11) — so **both install channels** genuinely deliver, not merely probe (FR-015) |
| Target | `docs/reviews/CHORUS-PROJECT.md` (creating `docs/reviews/` if needed — part of the accepted write) |
| Content | the template with: **(1)** the SCAFFOLDED marker as the first line after the title — `<!-- SCAFFOLDED by chorus learn YYYY-MM-DD — sections 2/3/5 unfilled; a chorus round treats this file as structure, not facts, until the marker is removed -->`; **(2)** sections 2/3/5 flagged `<!-- TO FILL -->`; **(3)** the template's copy-instructions preamble already comment-wrapped in the template itself, so the scaffolded file reads correctly post-copy (family G / F7) |
| Wrap-up | states what was created, the sections to fill, and that removing the marker is the "this is now real" signal (FR-014) |

The accept branch lives under a **pinned heading — `#### On accept`** — inside S2's
section of `LEARN.md`: check C6's mechanical locality assertion extracts the section
by this heading (run-2 BECK-4), so the heading is part of this contract, not a style
choice.

## Consumer behavior (the Phase-0 note — FR-014)

The registration edit adds to `SKILL.md`: an addendum bearing the SCAFFOLDED marker is
**present-but-unfilled** — the round orchestrator confirms the flagged sections with
the operator (as if absent but pre-structured) and never consumes placeholder text as
project facts. This closes the third state the cycle-1 gate found undefined (F33).

**Two creation paths, one structure**: this scaffold (pre-round structural form) and
the round's end-of-round addendum offer (`SKILL.md` Phase 5 — post-interview
distillation) are cross-referenced; the template is the single source of structure for
both (F22).

## Guards (all three required)

1. **Opt-in**: explicit acceptance on the dedicated confirm; decline ⇒ zero writes,
   tutorial proceeds (US3 sc. 2).
2. **No-overwrite**: target exists ⇒ the offer becomes "review/extend your existing
   addendum" (explanatory walk through its sections — and, if the existing file bears
   the SCAFFOLDED marker, a reminder of which sections remain unfilled); the file is
   **never** overwritten (US3 sc. 3).
3. **In-repo**: outside a git work tree ⇒ the offer is **replaced by a one-line
   notice** — what the scaffold would do, why it is unavailable here, and that
   re-running inside a project repo enables it (family N; never silent suppression);
   zero writes.

All four paths (accept / decline / existing-target / outside-repo) carry recorded
expected outcomes in **check C7** (R7).

## Failure honesty

If the template is missing at every source location in the resolution order (e.g. a
pre-R6 install), the scaffold states that plainly and points to the canonical source
resolved via the **running skill's base path**, plus the channel-matched remedy
(reinstall / re-run `install.sh` — R5) — it does **not** reconstruct the template
from memory. The same clause generalizes to every canonical pointer (R10/G1;
learn-mode.md Refusals).

**Dogfood note**: the walkthrough run in this repo **declines** the scaffold by
default — accepting would change this repo's Phase-0 behavior for every future round
(spec Assumptions; F61).
