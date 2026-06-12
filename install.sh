#!/usr/bin/env bash
# chorus-review installer.
#
# Copies the skill + its persona agents into your Claude Code config.
# Idempotent. No sudo. Refuses to overwrite agent files you may have customized
# unless you pass --force.
#
# Usage:
#   ./install.sh                  # install into $CLAUDE_HOME (default ~/.claude)
#   CLAUDE_HOME=/tmp/x ./install.sh
#   ./install.sh --force          # overwrite existing agent files
#
set -euo pipefail

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SRC="$REPO_DIR/skill/chorus-review"
AGENTS_SRC="$REPO_DIR/agents"

SKILL_DST="$CLAUDE_HOME/skills/chorus-review"
AGENTS_DST="$CLAUDE_HOME/agents"

if [[ ! -d "$SKILL_SRC" || ! -d "$AGENTS_SRC" ]]; then
  echo "error: cannot find skill/ or agents/ under $REPO_DIR" >&2
  exit 1
fi

mkdir -p "$SKILL_DST" "$AGENTS_DST"

echo "Installing chorus-review skill -> $SKILL_DST"
cp -f "$SKILL_SRC"/*.md "$SKILL_DST/"

echo "Installing addendum template -> $SKILL_DST/templates"
mkdir -p "$SKILL_DST/templates"
cp -f "$REPO_DIR/templates"/*.md "$SKILL_DST/templates/"

echo "Installing $(ls "$AGENTS_SRC"/*.md | wc -l) persona agents -> $AGENTS_DST"
installed=0
skipped=0
for src in "$AGENTS_SRC"/*.md; do
  base="$(basename "$src")"
  dst="$AGENTS_DST/$base"
  if [[ -e "$dst" && $FORCE -eq 0 ]]; then
    echo "  skip   $base  (exists; pass --force to overwrite)"
    skipped=$((skipped + 1))
  else
    cp -f "$src" "$dst"
    echo "  ok     $base"
    installed=$((installed + 1))
  fi
done

echo
echo "Installed: $installed agent(s). Skipped: $skipped."
echo
echo "Next:"
echo "  1. In Claude Code, say: 'chorus learn' — a guided tutorial that sets you"
echo "     up and teaches both review modes, one step at a time."
echo "  2. Or set up by hand: copy the installed template at"
echo "       $SKILL_DST/templates/CHORUS-PROJECT.template.md"
echo "     into your project at docs/reviews/CHORUS-PROJECT.md and fill in"
echo "     sections 2, 3, and 5 (exclusions, anchors, security)."
echo "  3. Then say: 'spawn the chorus'."
echo
echo "The skill produces docs/reviews/YYYY-MM-DD-chorus-review.md as a durable"
echo "artifact you commit. The most recent artifact is the next round's baseline."
