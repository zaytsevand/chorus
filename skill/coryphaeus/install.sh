#!/usr/bin/env sh
# Install the coryphaeus skill.
#
#   ./install.sh    copy into ${CLAUDE_HOME:-~/.claude}/skills/coryphaeus
#
# Idempotent: re-running replaces the installed copy with this checkout.
# POSIX sh, no bashisms.

set -eu

SRC=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEST="${CLAUDE_HOME:-$HOME/.claude}/skills/coryphaeus"

command -v node >/dev/null 2>&1 || echo "warning: node not found; the validator needs Node 18+" >&2

TMP="$DEST.tmp.$$"
rm -rf "$TMP"
mkdir -p "$TMP"
for item in SKILL.md README.md LICENSE schema bin examples; do
  cp -R "$SRC/$item" "$TMP/"
done
rm -rf "$DEST"
mv "$TMP" "$DEST"
chmod +x "$DEST/bin/validate.mjs" "$DEST/bin/render.mjs"

echo "installed coryphaeus into $DEST"
