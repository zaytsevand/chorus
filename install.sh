#!/usr/bin/env bash
# chorus suite installer.
#
# Copies every suite skill (skill/*/ — chorus-core, chorus-review, chorus-sdlc)
# + its persona agents into your Claude Code config.
# Idempotent. No sudo. Refuses to overwrite agent files you may have customized
# unless you pass --force.
#
# It does NOT prune stale files from a prior single-skill install (FR-012; F6
# waived). If you are upgrading from the pre-suite single skill, first run:
#   rm -rf "$CLAUDE_HOME/skills/chorus-review"
# then re-install (see quickstart.md / README "Upgrading").
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
SKILLS_SRC="$REPO_DIR/skill"
AGENTS_SRC="$REPO_DIR/agents"

SKILLS_DST="$CLAUDE_HOME/skills"
AGENTS_DST="$CLAUDE_HOME/agents"

if [[ ! -d "$SKILLS_SRC" || ! -d "$AGENTS_SRC" ]]; then
  echo "error: cannot find skill/ or agents/ under $REPO_DIR" >&2
  exit 1
fi

mkdir -p "$SKILLS_DST" "$AGENTS_DST"

# Iterate every suite skill directory (no hardcoded single dir) -> skills/<name>/.
for skill_src in "$SKILLS_SRC"/*/; do
  skill_src="${skill_src%/}"
  name="$(basename "$skill_src")"
  skill_dst="$SKILLS_DST/$name"
  mkdir -p "$skill_dst"
  echo "Installing $name skill -> $skill_dst"
  cp -f "$skill_src"/*.md "$skill_dst/"
done

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
echo "  1. Copy templates/CHORUS-PROJECT.template.md into your project at"
echo "       docs/reviews/CHORUS-PROJECT.md"
echo "     and fill in sections 2, 3, and 5 (exclusions, anchors, security)."
echo "  2. In Claude Code, say: 'spawn the chorus'."
echo
echo "The skill produces docs/reviews/YYYY-MM-DD-chorus-review.md as a durable"
echo "artifact you commit. The most recent artifact is the next round's baseline."
