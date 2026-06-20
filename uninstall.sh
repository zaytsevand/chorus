#!/usr/bin/env bash
# chorus suite uninstaller.
#
# Removes every suite skill (chorus-core, chorus-review, chorus-sdlc) and the
# persona agents from your Claude Code config. Refuses to touch any other files.
#
# Usage:
#   ./uninstall.sh
#   CLAUDE_HOME=/tmp/x ./uninstall.sh
#
set -euo pipefail

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_SRC="$REPO_DIR/agents"
SKILLS_SRC="$REPO_DIR/skill"

SKILLS_DST="$CLAUDE_HOME/skills"
AGENTS_DST="$CLAUDE_HOME/agents"

# Derive the skill set from the repo's skill/ dir — the same source install.sh
# globs — so adding or removing a suite skill never needs editing a list here.
for skill_src in "$SKILLS_SRC"/*/; do
  name="$(basename "${skill_src%/}")"
  dst="$SKILLS_DST/$name"
  if [[ -d "$dst" ]]; then
    echo "Removing $dst"
    rm -rf "$dst"
  fi
done

# Derive the agent set from the repo's agents/ dir — the same source of truth
# install.sh globs — so adding or removing a persona never needs editing a list here.
removed=0
for src in "$AGENTS_SRC"/*.md; do
  a="$(basename "$src")"
  if [[ -f "$AGENTS_DST/$a" ]]; then
    rm -f "$AGENTS_DST/$a"
    echo "  removed $a"
    removed=$((removed + 1))
  fi
done

echo
echo "Removed: $removed agent file(s) + suite skill dirs."
echo "Note: per-project addenda at docs/reviews/CHORUS-PROJECT.md and any"
echo "chorus artifacts under docs/reviews/ are left untouched."
