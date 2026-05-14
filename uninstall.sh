#!/usr/bin/env bash
# chorus-review uninstaller.
#
# Removes the chorus-review skill and the seven named persona agents from
# your Claude Code config. Refuses to touch any other files.
#
# Usage:
#   ./uninstall.sh
#   CLAUDE_HOME=/tmp/x ./uninstall.sh
#
set -euo pipefail

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"

SKILL_DST="$CLAUDE_HOME/skills/chorus-review"
AGENTS_DST="$CLAUDE_HOME/agents"

AGENTS=(
  eric-evans-advisor.md
  mark-richards-architect.md
  alan-cooper-advisor.md
  don-norman-advisor.md
  uncle-bob-architect.md
  kent-beck-persona.md
  delivery-and-ops-advisor.md
)

if [[ -d "$SKILL_DST" ]]; then
  echo "Removing $SKILL_DST"
  rm -rf "$SKILL_DST"
fi

removed=0
for a in "${AGENTS[@]}"; do
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
