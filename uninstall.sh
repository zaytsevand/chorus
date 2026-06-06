#!/usr/bin/env bash
# chorus-review uninstaller.
#
# Removes the chorus-review skill and its persona agents from
# your Claude Code config. Refuses to touch any other files.
#
# Usage:
#   ./uninstall.sh
#   CLAUDE_HOME=/tmp/x ./uninstall.sh
#
set -euo pipefail

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_SRC="$REPO_DIR/agents"

SKILL_DST="$CLAUDE_HOME/skills/chorus-review"
AGENTS_DST="$CLAUDE_HOME/agents"

if [[ -d "$SKILL_DST" ]]; then
  echo "Removing $SKILL_DST"
  rm -rf "$SKILL_DST"
fi

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
echo "Removed: $removed agent file(s) + skill dir."
echo "Note: per-project addenda at docs/reviews/CHORUS-PROJECT.md and any"
echo "chorus artifacts under docs/reviews/ are left untouched."
