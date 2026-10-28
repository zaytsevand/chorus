#!/usr/bin/env bash
# test-install-roundtrip.sh — install -> verify -> uninstall -> verify, into a
# throwaway CLAUDE_HOME (mktemp -d). Used by CI (.github/workflows/integrity.yml)
# and runnable locally. Exits non-zero on the first failed expectation.
#
# Also checks the skip-existing-agent contract (an agent file that existed
# before install is neither overwritten by install without --force nor removed
# by uninstall) and the refresh contract: an installed file still as written is
# updated on re-run, a file the user edited is kept, on install and uninstall.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOME_DIR="$(mktemp -d)"
trap 'rm -rf "$HOME_DIR"' EXIT
export CLAUDE_HOME="$HOME_DIR"

fail() { echo "FAIL: $*" >&2; exit 1; }
# Is a path recorded in the manifest ("<sha256>  <path>" lines)?
in_manifest() { awk -v r="$1" 'substr($0, 67) == r { f = 1 } END { exit !f }' "$MANIFEST"; }

# A pre-existing, user-customized agent.
mkdir -p "$HOME_DIR/agents"
echo "user customization" > "$HOME_DIR/agents/kent-beck-persona.md"
# An unrelated file that must survive everything.
mkdir -p "$HOME_DIR/skills/other-skill"
echo "not ours" > "$HOME_DIR/skills/other-skill/SKILL.md"

MANIFEST="$HOME_DIR/.chorus-install-manifest"
out="$("$REPO_DIR/install.sh")"
[[ -f "$MANIFEST" ]] || fail "manifest not written"
[[ -f "$HOME_DIR/skills/chorus-core/bin/validate.mjs" ]] || fail "record tools not installed with chorus-core"
[[ ! -e "$HOME_DIR/skills/coryphaeus" ]] || fail "a fresh install still writes the retired coryphaeus skill"
grep -q "^Node: " <<<"$out" || fail "closing message does not report Node"
grep -q "^problem-brief: not found" <<<"$out" || fail "closing message does not report a missing problem-brief"
grep -q "git clone https://github.com/zaytsevand/problem-brief" <<<"$out" || fail "closing message gives no problem-brief install command"

# problem-brief present: reported as found, and never touched by the suite.
mkdir -p "$HOME_DIR/skills/problem-brief"
echo "someone else's skill" > "$HOME_DIR/skills/problem-brief/SKILL.md"

# Re-run with nothing changed: every file of ours is current.
out="$("$REPO_DIR/install.sh")"
grep -q "^  updated\|^  installed\|^  differs" <<<"$out" && fail "unchanged re-run changed something"
grep -q "^  current        agents/eric-evans-advisor.md" <<<"$out" || fail "unchanged file not reported current"
grep -q "^problem-brief: found" <<<"$out" || fail "installed problem-brief not reported as found"

# An older installed file (the manifest hash matches its old content) is updated
# without --force; a file the user edited is kept.
old="$HOME_DIR/agents/eric-evans-advisor.md"
edited="$HOME_DIR/skills/chorus-core/CONDUCTOR.md"
echo "last release's persona" > "$old"
old_hash="$( (sha256sum "$old" 2>/dev/null || shasum -a 256 "$old") | cut -d' ' -f1)"
awk -v h="$old_hash" 'substr($0, 67) == "agents/eric-evans-advisor.md" { $0 = h "  agents/eric-evans-advisor.md" } { print }' "$MANIFEST" > "$MANIFEST.t" && mv "$MANIFEST.t" "$MANIFEST"
echo "my local note" >> "$edited"
out="$("$REPO_DIR/install.sh")"
grep -q "^  updated        agents/eric-evans-advisor.md" <<<"$out" || fail "stale installed file not updated"
cmp -s "$REPO_DIR/agents/eric-evans-advisor.md" "$old" || fail "stale installed file not replaced"
grep -q "^  differs, kept  skills/chorus-core/CONDUCTOR.md" <<<"$out" || fail "edited file not reported as differs, kept"
grep -qx "my local note" "$edited" || fail "install overwrote a user-edited file"

# Every repo skill file is installed (subfolders included) and recorded.
while IFS= read -r f; do
  rel="skills/${f#./}"
  [[ -f "$HOME_DIR/$rel" ]] || fail "missing installed file $rel"
  [[ "$rel" == skills/chorus-core/CONDUCTOR.md ]] || cmp -s "$REPO_DIR/skill/${f#./}" "$HOME_DIR/$rel" || fail "installed $rel differs from source"
  in_manifest "$rel" || fail "$rel not recorded in manifest"
done < <(cd "$REPO_DIR/skill" && find . -type f)

[[ -f "$HOME_DIR/skills/chorus-learn/templates/CHORUS-PROJECT.template.md" ]] \
  || fail "addendum template not installed"

# Agents: all installed except the pre-existing one, which is untouched and unrecorded.
for src in "$REPO_DIR"/agents/*.md; do
  base="$(basename "$src")"
  if [[ "$base" == "kent-beck-persona.md" ]]; then
    grep -qx "user customization" "$HOME_DIR/agents/$base" || fail "install overwrote a pre-existing agent"
    ! in_manifest "agents/$base" || fail "skipped agent recorded in manifest"
  else
    cmp -s "$src" "$HOME_DIR/agents/$base" || fail "agent $base not installed"
    in_manifest "agents/$base" || fail "agent $base not recorded"
  fi
done

out="$("$REPO_DIR/uninstall.sh")"
grep -q "^  differs, kept  skills/chorus-core/CONDUCTOR.md" <<<"$out" || fail "uninstall did not report the edited file"
grep -qx "my local note" "$edited" || fail "uninstall removed a user-edited file"
rm -f "$edited"; rmdir "$HOME_DIR/skills/chorus-core"

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
grep -qx "someone else's skill" "$HOME_DIR/skills/problem-brief/SKILL.md" || fail "uninstall touched problem-brief"

# Upgrade from a release that shipped coryphaeus: its unchanged files are
# pruned with their directories, and an edited SKILL.md stops loading as a skill.
OLD_HOME="$(mktemp -d)"
trap 'rm -rf "$HOME_DIR" "$OLD_HOME"' EXIT
mkdir -p "$OLD_HOME/skills/coryphaeus/bin"
echo "old validator" > "$OLD_HOME/skills/coryphaeus/bin/validate.mjs"
echo "old skill, edited" > "$OLD_HOME/skills/coryphaeus/SKILL.md"
vhash="$( (sha256sum "$OLD_HOME/skills/coryphaeus/bin/validate.mjs" 2>/dev/null || shasum -a 256 "$OLD_HOME/skills/coryphaeus/bin/validate.mjs") | cut -d' ' -f1)"
printf '%s  %s\n%s  %s\n' "$vhash" skills/coryphaeus/bin/validate.mjs "$(printf '0%.0s' {1..64})" skills/coryphaeus/SKILL.md > "$OLD_HOME/.chorus-install-manifest"
out="$(CLAUDE_HOME="$OLD_HOME" "$REPO_DIR/install.sh")"
grep -q "^  pruned         skills/coryphaeus/bin/validate.mjs" <<<"$out" || fail "stale coryphaeus file not pruned"
[[ ! -e "$OLD_HOME/skills/coryphaeus/bin" ]] || fail "stale coryphaeus bin/ left behind"
[[ ! -e "$OLD_HOME/skills/coryphaeus/SKILL.md" ]] || fail "edited coryphaeus SKILL.md still loads as a skill"
grep -qx "old skill, edited" "$OLD_HOME/skills/coryphaeus/SKILL.md.retired" || fail "edited coryphaeus SKILL.md not kept as SKILL.md.retired"

echo "PASS — install -> re-run -> refresh -> uninstall round trip, and the coryphaeus upgrade, into temp CLAUDE_HOMEs."
