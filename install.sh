#!/usr/bin/env bash
# chorus suite installer.
#
# Mirrors every suite skill directory (skill/*/ — the four skills chorus-core,
# chorus-review, chorus-sdlc, chorus-learn — including subfolders such as
# chorus-learn/templates/) and the persona agents into your Claude Code config.
#
# Every file it writes is recorded in $CLAUDE_HOME/.chorus-install-manifest, and
# uninstall.sh removes exactly those files. Idempotent: re-running replaces each
# installed skill directory with a fresh copy (so files deleted upstream go away)
# and rewrites the manifest. No sudo.
#
# Agent files that already exist are skipped unless you pass --force (you may
# have customized them). A skipped agent is NOT recorded in the manifest, so
# uninstall leaves it alone too — unless a previous run of this installer wrote
# it, in which case it stays recorded.
#
# Usage:
#   ./install.sh                        # install into ~/.claude (all projects)
#   CLAUDE_HOME=$PWD/.claude ./install.sh   # per-project install (run in the project)
#   ./install.sh --force                # overwrite existing agent files
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
MANIFEST="$CLAUDE_HOME/.chorus-install-manifest"

if [[ ! -d "$SKILLS_SRC" || ! -d "$AGENTS_SRC" ]]; then
  echo "error: cannot find skill/ or agents/ under $REPO_DIR" >&2
  exit 1
fi

mkdir -p "$SKILLS_DST" "$AGENTS_DST"

# Was this path written by a previous run of this installer? (Portable to
# bash 3.2 — no associative arrays.)
previously_ours() {
  [[ -f "$MANIFEST" ]] && grep -qxF "$1" "$MANIFEST"
}

new_manifest="$(mktemp)"
trap 'rm -f "$new_manifest"' EXIT
{
  echo "# chorus install manifest — files written by install.sh from $REPO_DIR"
  echo "# Paths are relative to CLAUDE_HOME ($CLAUDE_HOME). uninstall.sh removes exactly these."
} > "$new_manifest"

# Mirror each suite skill directory: remove the installed copy, then copy the
# whole tree (subfolders included).
for skill_src in "$SKILLS_SRC"/*/; do
  skill_src="${skill_src%/}"
  name="$(basename "$skill_src")"
  skill_dst="$SKILLS_DST/$name"
  echo "Installing $name skill -> $skill_dst"
  rm -rf "$skill_dst"
  cp -R "$skill_src" "$skill_dst"
  (cd "$SKILLS_SRC" && find "$name" -type f | LC_ALL=C sort) | sed 's|^|skills/|' >> "$new_manifest"
done

echo "Installing $(ls "$AGENTS_SRC"/*.md | wc -l | tr -d ' ') persona agents -> $AGENTS_DST"
installed=0
skipped=0
for src in "$AGENTS_SRC"/*.md; do
  base="$(basename "$src")"
  dst="$AGENTS_DST/$base"
  rel="agents/$base"
  if [[ -e "$dst" && $FORCE -eq 0 ]]; then
    if previously_ours "$rel"; then
      echo "  keep   $base  (installed earlier by this script; pass --force to refresh)"
      echo "$rel" >> "$new_manifest"
    else
      echo "  skip   $base  (exists, not installed by this script; pass --force to overwrite)"
    fi
    skipped=$((skipped + 1))
  else
    cp -f "$src" "$dst"
    echo "  ok     $base"
    echo "$rel" >> "$new_manifest"
    installed=$((installed + 1))
  fi
done

# Prune files an earlier install wrote that this version no longer ships
# (a skill or agent removed upstream).
if [[ -f "$MANIFEST" ]]; then
  while IFS= read -r old; do
    [[ -z "$old" || "$old" == \#* ]] && continue
    if ! grep -qxF "$old" "$new_manifest" && [[ -f "$CLAUDE_HOME/$old" ]]; then
      rm -f "$CLAUDE_HOME/$old"
      echo "  pruned $old  (no longer shipped)"
    fi
  done < "$MANIFEST"
fi

mv "$new_manifest" "$MANIFEST"
trap - EXIT

echo
echo "Installed: $installed agent(s). Skipped: $skipped."
echo "Manifest:  $MANIFEST"
echo
echo "Next:"
echo "  1. Set up the project addendum: in Claude Code say 'chorus learn' (it can"
echo "     scaffold it), or copy $SKILLS_DST/chorus-learn/templates/CHORUS-PROJECT.template.md"
echo "     to docs/reviews/CHORUS-PROJECT.md in your project and fill in sections"
echo "     2, 3, and 5 (exclusions, anchors, security)."
echo "  2. In Claude Code, say: 'spawn the chorus'."
echo
echo "chorus-review produces docs/reviews/YYYY-MM-DD-chorus-review.md as a durable"
echo "artifact you commit. The most recent artifact is the next round's baseline."
