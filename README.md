# chorus-review

A Claude Code skill that runs a structured multi-advisor review of your
project state. Seven persona advisors — Eric Evans (DDD), Mark Richards
(architecture), Alan Cooper (adversarial product), Don Norman (HCD),
Uncle Bob (clean code / SOLID), Kent Beck (TDD / simple design), and a
synthesized delivery-and-ops advisor — plus a security agent each review
your repo through their lens. Conflicts go to `advisor()`. Output is a
durable markdown artifact under `docs/reviews/` that you commit. The most
recent artifact is the next round's baseline.

## Why

Two patterns this skill is built to resist:

- **Findings dominated by legacy code.** Without an exclusion gate, every
  review collapses onto the same tech-debt directory and crowds out signal
  from the actively-developed surface. The skill's Phase-0 scope-exclusion
  gate prevents this by baking the project's "do not produce findings about
  these paths" list into every persona brief.
- **Naming-without-shipping.** A review document is not a fix. Phase 6
  forces the chorus to offer the highest-priority concrete fix as a PR draft
  immediately after sign-off, so the artifact does not replace the work it
  describes.

Two design choices worth knowing about:

- **RSVP per round.** Personas self-select into each round based on the
  since-last-chorus deltas. Quorum is odd (3 or 5) to avoid 2-vs-2
  deadlocks. If too few join, the round aborts honestly rather than fake a
  chorus.
- **Dijkstra-grounded integration layer.** The session running the skill is
  a thin orchestrator with explicit refusals — it routes between personas,
  the user, and `advisor()`, but never holds a lens, never adds findings of
  its own, never substitutes `advisor()` for cognitive work. See
  `skill/chorus-review/INTEGRATION-LAYER.md`.

## Install

### Canonical (clone + script)

```sh
git clone https://github.com/<your-org>/chorus-review.git
cd chorus-review
./install.sh
```

This copies the skill into `~/.claude/skills/chorus-review/` and the seven
persona agents into `~/.claude/agents/`. Existing same-named files are
preserved unless you pass `--force`.

Override the target with `CLAUDE_HOME=/path/to/claude ./install.sh`.

### Plugin (Claude Code plugin manifest)

The repo ships a `plugin.json` so it can be loaded via Claude Code's plugin
mechanism. See your Claude Code version's plugin-installation docs for the
exact incantation; the manifest at the root is the canonical entry point.

### Uninstall

```sh
./uninstall.sh
```

Removes only the skill dir and the seven named agent files. Your per-project
addenda and chorus artifacts under `docs/reviews/` are left untouched.

## Run a round

1. **Drop the template into your project:**

   ```sh
   cp ~/code/chorus-review/templates/CHORUS-PROJECT.template.md \
      docs/reviews/CHORUS-PROJECT.md
   ```

2. **Edit it.** Sections 2 (exclusions), 3 (anchor surface), and 5
   (project-specific security checklist) are required before the chorus can
   launch. The skill will interview you inline if the file is missing or
   incomplete, but a filled-in addendum makes every round faster.

3. **In Claude Code, say:**

   > spawn the chorus

   The orchestrator will load the addendum, confirm the scope-exclusion list
   with you, draft the round-context paragraph (deltas since the last
   round), and run the RSVP gate. Each persona that joins produces a Round 1
   report; cross-evaluation, conflict reconciliation via `advisor()`,
   ranking, and security follow. The final artifact lands at
   `docs/reviews/YYYY-MM-DD-chorus-review.md`. Commit it.

## What you get

A markdown artifact structured as:

- Roster (this round) — joiners, abstainers, why.
- Findings register — every finding `F1`, `F2`, … with severity, lens,
  target, one-sentence summary.
- Consolidation matrix — for ranking and scoring.
- Round briefs — what each round produced as a whole.
- Phase 3 conflict reconciliation — every `Cn`, what was disputed, how it
  was settled.
- Top-5 ranked recommendations — scored on Cost / Value / Convergence
  (and Constitutional ROI if your project has a governance doc).
- Pre-public-rollout gate — any 🔴 blockers tracked as a unit.
- TL;DR — three sentences at the top.
- Next-chorus baseline — what the next round should assume closed.

## When NOT to use this

- Single-lens questions — just spawn the relevant persona agent directly.
- Code review of a specific PR — use a dedicated review tool, not this.
- One-off architecture questions — invoke `mark-richards-architect` solo.

The chorus is for periodic project-state review. Cadence depends on your
project; quarterly or after-each-major-release is typical.

## License

CC BY 4.0. See `LICENSE`. You may copy, modify, and redistribute these
skills, agents, and procedure under the terms of that license, including
for commercial use — attribution required per the license text.

## Contributing

See `CONTRIBUTING.md`. Short version: PRs welcome; do not include
project-specific examples (paths, hostnames, user names, repo names) in
PR'd agent descriptions or skill prose.
