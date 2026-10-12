---
name: project-pr32-trust-surface
description: PR #32 + coryphaeus (2026-09-27) trust surface map and gate #8 standing answer (solo operator, inferred) — pointers for Round 1
metadata:
  type: project
---

Gate #8 (operating capacity), standing answer as of 2026-09-27: **solo operator, single maintainer**. Status: INFERRED, not operator-confirmed. Source: `git log` on chorus shows one author, and docs/reviews/pr32/standing-rulings.md has no capacity ruling. Re-check that file for a ruling before reusing this.

Trust surfaces to chase (pointers, not evidence):
- install.sh prune loop (around lines 95-103) removes paths read from the old manifest with no absolute-path or `..` guard. uninstall.sh has that guard, so the same control has two writers of different strength.
- install.sh `rm -rf` on each skill dir; coryphaeus install.sh `rm -rf $DEST` under CLAUDE_HOME.
- .github/workflows/integrity.yml: actions pinned by tag (v4), not by SHA; permissions are contents:read.
- coryphaeus bin/validate.mjs and render.mjs run on agent-authored JSON. render escapes only `|` and newlines, and its output goes on into problem-brief pages.
- Chorus-to-coryphaeus dependency: installed separately, and nothing pins or checks one version against the other.
- Constitution 2.0.0 lifted the no-runtime-code rule, and the Security mandate at Gate A was removed (delta 3).

**Why:** this is the first time the suite ships executable code and writes into ~/.claude, so the trust surface changed kind.
**How to apply:** start Round 1 from these anchors, and ask the operator to confirm gate #8 before prescribing any control.
