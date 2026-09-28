#!/usr/bin/env bash
# chorus suite installer.
#
# Copies every suite skill directory (skill/*/ — the four skills chorus-core,
# chorus-review, chorus-sdlc, chorus-learn — including subfolders such as
# chorus-learn/templates/) and the persona agents into your Claude Code config.
#
# Every file it writes is recorded, with the hash of what it wrote, in
# $CLAUDE_HOME/.chorus-install-manifest. On a re-run each shipped file is:
#   current        already the shipped version; left as is
#   updated        unchanged since this installer wrote it; replaced
#   differs, kept  edited since this installer wrote it; left alone
#   skip           exists but was never written by this installer; left alone
#   installed      not there yet; written
# Files an earlier run wrote that this version no longer ships are pruned when
# unchanged, and reported as "differs, kept" when edited. --force overwrites
# every shipped file regardless. uninstall.sh uses the same hashes. No sudo.
#
# Usage:
#   ./install.sh                        # install into ~/.claude (all projects)
#   CLAUDE_HOME=$PWD/.claude ./install.sh   # per-project install (run in the project)
#   ./install.sh --force                # overwrite every shipped file
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

if command -v sha256sum >/dev/null 2>&1; then
  hash_of() { sha256sum "$1" | cut -d' ' -f1; }
elif command -v shasum >/dev/null 2>&1; then
  hash_of() { shasum -a 256 "$1" | cut -d' ' -f1; }
else
  echo "error: need sha256sum or shasum to record what was installed" >&2
  exit 1
fi

# The hash recorded for a path by an earlier run: the hash, "legacy" for a
# path recorded before hashes were, or nothing when the path is not ours.
# Manifest lines are "<sha256>  <path>" (older manifests: "<path>").
recorded_hash() {
  [[ -f "$MANIFEST" ]] || return 0
  awk -v r="$1" '
    /^#/ || NF == 0 { next }
    length($1) == 64 && $1 ~ /^[0-9a-f]+$/ && NF >= 2 { if (substr($0, 67) == r) { print $1; exit } ; next }
    $0 == r { print "legacy"; exit }
  ' "$MANIFEST"
}

# A manifest path must stay inside CLAUDE_HOME (same guard as uninstall.sh).
safe_rel() { [[ "$1" != /* && "$1" != *..* ]]; }

mkdir -p "$SKILLS_DST" "$AGENTS_DST"

new_manifest="$(mktemp)"
shipped="$(mktemp)"
trap 'rm -f "$new_manifest" "$shipped"' EXIT
{
  echo "# chorus install manifest — files written by install.sh from $REPO_DIR"
  echo "# Lines are '<sha256 as written>  <path relative to CLAUDE_HOME ($CLAUDE_HOME)>'."
  echo "# uninstall.sh removes these when unchanged and reports the ones you edited."
} > "$new_manifest"

counts_installed=0 counts_updated=0 counts_current=0 counts_kept=0 counts_skipped=0

# Place one shipped file. $1 source, $2 path relative to CLAUDE_HOME.
place() {
  local src="$1" rel="$2" dst="$CLAUDE_HOME/$2" new cur rec
  new="$(hash_of "$src")"
  echo "$rel" >> "$shipped"
  if [[ ! -e "$dst" ]]; then
    mkdir -p "$(dirname "$dst")"
    cp -f "$src" "$dst"
    echo "  installed      $rel"
    counts_installed=$((counts_installed + 1))
    echo "$new  $rel" >> "$new_manifest"
    return
  fi
  cur="$(hash_of "$dst")"
  rec="$(recorded_hash "$rel")"
  if [[ "$cur" == "$new" ]]; then
    echo "  current        $rel"
    counts_current=$((counts_current + 1))
    echo "$new  $rel" >> "$new_manifest"
  elif [[ $FORCE -eq 1 || ( -n "$rec" && "$rec" == "$cur" ) ]]; then
    cp -f "$src" "$dst"
    echo "  updated        $rel"
    counts_updated=$((counts_updated + 1))
    echo "$new  $rel" >> "$new_manifest"
  elif [[ -n "$rec" ]]; then
    if [[ "$rec" == "legacy" ]]; then
      echo "  differs, kept  $rel  (recorded before hashes were; pass --force to replace)"
      echo "$rel" >> "$new_manifest"
    else
      echo "  differs, kept  $rel  (edited since install; pass --force to replace)"
      echo "$rec  $rel" >> "$new_manifest"
    fi
    counts_kept=$((counts_kept + 1))
  else
    echo "  skip           $rel  (exists, not installed by this script; pass --force to overwrite)"
    counts_skipped=$((counts_skipped + 1))
  fi
}

for skill_src in "$SKILLS_SRC"/*/; do
  name="$(basename "$skill_src")"
  echo "Skill $name -> $SKILLS_DST/$name"
  while IFS= read -r f; do
    place "$SKILLS_SRC/$f" "skills/$f"
  done < <(cd "$SKILLS_SRC" && find "$name" -type f | LC_ALL=C sort)
done

echo "Persona agents -> $AGENTS_DST"
for src in "$AGENTS_SRC"/*.md; do
  place "$src" "agents/$(basename "$src")"
done

# Prune files an earlier install wrote that this version no longer ships
# (a skill file or agent removed upstream), unless you edited them.
if [[ -f "$MANIFEST" ]]; then
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    rec="" old="$line"
    if [[ "$line" =~ ^[0-9a-f]{64}\ \ (.*)$ ]]; then rec="${line%% *}"; old="${BASH_REMATCH[1]}"; fi
    grep -qxF "$old" "$shipped" && continue
    if ! safe_rel "$old"; then
      echo "  refuse         $old  (not a relative path inside CLAUDE_HOME)" >&2
      continue
    fi
    target="$CLAUDE_HOME/$old"
    [[ -f "$target" ]] || continue
    if [[ -n "$rec" && "$(hash_of "$target")" == "$rec" ]]; then
      rm -f "$target"
      rmdir "$(dirname "$target")" 2>/dev/null || true
      echo "  pruned         $old  (no longer shipped)"
    else
      echo "  differs, kept  $old  (no longer shipped, but edited or unhashed; now yours)"
    fi
  done < "$MANIFEST"
fi

mv "$new_manifest" "$MANIFEST"
rm -f "$shipped"
trap - EXIT

echo
echo "Installed: $counts_installed. Updated: $counts_updated. Current: $counts_current."
echo "Differs, kept: $counts_kept. Skipped (not ours): $counts_skipped."
echo "Manifest:  $MANIFEST"
echo
echo "Required: coryphaeus, the record validator and renderer every round uses"
echo "(Node 18 or later). Install it from its checkout: ./install.sh in the"
echo "coryphaeus repository, with the same CLAUDE_HOME."
if [[ -f "$SKILLS_DST/coryphaeus/bin/validate.mjs" ]]; then
  echo "  found: $SKILLS_DST/coryphaeus"
else
  echo "  not found under $SKILLS_DST: rounds will run unvalidated until it is installed."
fi
command -v node >/dev/null 2>&1 || echo "  node not found: the validator needs Node 18 or later."
echo
echo "Next:"
echo "  1. Set up the project addendum: in Claude Code say 'chorus learn' (it can"
echo "     scaffold it), or copy $SKILLS_DST/chorus-learn/templates/CHORUS-PROJECT.template.md"
echo "     to docs/reviews/CHORUS-PROJECT.md in your project and fill in sections"
echo "     2, 3, and 5 (exclusions, anchors, security)."
echo "  2. In Claude Code, say: 'spawn the chorus'."
echo
echo "chorus-review writes docs/reviews/YYYY-MM-DD-chorus-review.json, the record,"
echo "and the page rendered from it. Commit both; the most recent record is the"
echo "next round's baseline."
