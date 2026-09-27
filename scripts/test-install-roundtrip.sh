#!/usr/bin/env bash
# test-install-roundtrip.sh — install -> verify -> uninstall -> verify, into a
# throwaway CLAUDE_HOME (mktemp -d). Used by CI (.github/workflows/integrity.yml)
# and runnable locally. Exits non-zero on the first failed expectation.
#
# Also checks the skip-existing-agent contract: an agent file that existed
# before install is neither overwritten by install (without --force) nor
# removed by uninstall.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOME_DIR="$(mktemp -d)"
trap 'rm -rf "$HOME_DIR"' EXIT
export CLAUDE_HOME="$HOME_DIR"

fail() { echo "FAIL: $*" >&2; exit 1; }

# A pre-existing, user-customized agent.
mkdir -p "$HOME_DIR/agents"
echo "user customization" > "$HOME_DIR/agents/kent-beck-persona.md"
# An unrelated file that must survive everything.
mkdir -p "$HOME_DIR/skills/other-skill"
echo "not ours" > "$HOME_DIR/skills/other-skill/SKILL.md"

"$REPO_DIR/install.sh" > /dev/null
"$REPO_DIR/install.sh" > /dev/null   # idempotent re-run

MANIFEST="$HOME_DIR/.chorus-install-manifest"
[[ -f "$MANIFEST" ]] || fail "manifest not written"

# Every repo skill file is installed (subfolders included) and recorded.
while IFS= read -r f; do
  rel="skills/${f#./}"
  [[ -f "$HOME_DIR/$rel" ]] || fail "missing installed file $rel"
  cmp -s "$REPO_DIR/skill/${f#./}" "$HOME_DIR/$rel" || fail "installed $rel differs from source"
  grep -qxF "$rel" "$MANIFEST" || fail "$rel not recorded in manifest"
done < <(cd "$REPO_DIR/skill" && find . -type f)

[[ -f "$HOME_DIR/skills/chorus-learn/templates/CHORUS-PROJECT.template.md" ]] \
  || fail "addendum template not installed"

# Agents: all installed except the pre-existing one, which is untouched and unrecorded.
for src in "$REPO_DIR"/agents/*.md; do
  base="$(basename "$src")"
  if [[ "$base" == "kent-beck-persona.md" ]]; then
    grep -qx "user customization" "$HOME_DIR/agents/$base" || fail "install overwrote a pre-existing agent"
    ! grep -qxF "agents/$base" "$MANIFEST" || fail "skipped agent recorded in manifest"
  else
    cmp -s "$src" "$HOME_DIR/agents/$base" || fail "agent $base not installed"
    grep -qxF "agents/$base" "$MANIFEST" || fail "agent $base not recorded"
  fi
done

"$REPO_DIR/uninstall.sh" > /dev/null

[[ ! -e "$MANIFEST" ]] || fail "manifest left behind"
for d in "$REPO_DIR"/skill/*/; do
  name="$(basename "$d")"
  [[ ! -e "$HOME_DIR/skills/$name" ]] || fail "skill dir skills/$name left behind"
done
for src in "$REPO_DIR"/agents/*.md; do
  base="$(basename "$src")"
  [[ "$base" == "kent-beck-persona.md" ]] && continue
  [[ ! -e "$HOME_DIR/agents/$base" ]] || fail "agent $base left behind"
done
grep -qx "user customization" "$HOME_DIR/agents/kent-beck-persona.md" \
  || fail "uninstall removed an agent install had skipped"
[[ -f "$HOME_DIR/skills/other-skill/SKILL.md" ]] || fail "uninstall removed an unrelated file"

echo "PASS — install -> verify -> uninstall -> verify round trip into a temp CLAUDE_HOME."
