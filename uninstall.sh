#!/usr/bin/env bash
# chorus suite uninstaller.
#
# Removes exactly the files install.sh recorded in
# $CLAUDE_HOME/.chorus-install-manifest (the four suite skills and the persona
# agents it wrote), then the manifest itself. Agent files install.sh skipped
# because they already existed are not in the manifest and are left alone.
# Skill directories left empty are removed; nothing else is touched.
#
# Usage:
#   ./uninstall.sh                          # uninstall from ~/.claude
#   CLAUDE_HOME=$PWD/.claude ./uninstall.sh # per-project uninstall
#
set -euo pipefail

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
MANIFEST="$CLAUDE_HOME/.chorus-install-manifest"

if [[ ! -f "$MANIFEST" ]]; then
  echo "No chorus install manifest at $MANIFEST — nothing to remove."
  echo "(Installs made before the manifest existed: remove skills/chorus-* and the"
  echo " persona agents under $CLAUDE_HOME by hand.)"
  exit 0
fi

removed=0
dirs=()
while IFS= read -r rel; do
  [[ -z "$rel" || "$rel" == \#* ]] && continue
  # Refuse anything that could escape CLAUDE_HOME.
  if [[ "$rel" == /* || "$rel" == *..* ]]; then
    echo "  refuse $rel  (not a relative path inside CLAUDE_HOME)" >&2
    continue
  fi
  target="$CLAUDE_HOME/$rel"
  if [[ -f "$target" || -L "$target" ]]; then
    rm -f "$target"
    removed=$((removed + 1))
  fi
  case "$rel" in
    skills/*/*) dirs+=("$(dirname "$target")") ;;
  esac
done < "$MANIFEST"

# Remove skill directories (deepest first) that are now empty.
if [[ ${#dirs[@]} -gt 0 ]]; then
  printf '%s\n' "${dirs[@]}" | LC_ALL=C sort -ru | while IFS= read -r d; do
    rmdir "$d" 2>/dev/null || true
  done
fi

rm -f "$MANIFEST"

echo "Removed: $removed file(s) listed in the chorus install manifest."
echo "Note: per-project addenda at docs/reviews/CHORUS-PROJECT.md and any"
echo "chorus artifacts under docs/reviews/ are left untouched."
