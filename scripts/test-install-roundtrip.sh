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
# Run an installer, keeping its output (stderr too) in $out and its exit code in $rc.
run() { rc=0; out="$("$@" 2>&1)" || rc=$?; }

# A pre-existing, user-customized agent.
mkdir -p "$HOME_DIR/agents"
echo "user customization" > "$HOME_DIR/agents/kent-beck-persona.md"
# An unrelated file that must survive everything.
mkdir -p "$HOME_DIR/skills/other-skill"
echo "not ours" > "$HOME_DIR/skills/other-skill/SKILL.md"

MANIFEST="$HOME_DIR/.chorus-install-manifest"
run "$REPO_DIR/install.sh"
[[ $rc -eq 1 ]] || fail "install exited $rc with a skipped agent (expected 1)"
grep -q "^error: .*mixes versions" <<<"$out" || fail "skipped agent not reported as an error"
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
run "$REPO_DIR/install.sh"
[[ $rc -eq 1 ]] || fail "install exited $rc with a skipped agent (expected 1)"
grep -q "^error: .*mixes versions" <<<"$out" || fail "skipped agent not reported as an error"
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
run "$REPO_DIR/install.sh"
[[ $rc -eq 1 ]] || fail "install exited $rc with a skipped agent (expected 1)"
grep -q "^error: .*mixes versions" <<<"$out" || fail "skipped agent not reported as an error"
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
done < <(cd "$REPO_DIR/skill" && find . -type f -not -path '*/test/*' -not -path '*/examples/*')
[[ ! -e "$HOME_DIR/skills/chorus-core/test" && ! -e "$HOME_DIR/skills/chorus-core/examples" ]] || fail "repo-only test/ or examples/ was installed"

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

# Upgrade from a release that shipped coryphaeus: the retired skill is never
# removed (the operator's choice); the install warns with the removal command.
OLD_HOME="$(mktemp -d)"
trap 'rm -rf "$HOME_DIR" "$OLD_HOME"' EXIT
mkdir -p "$OLD_HOME/skills/coryphaeus/bin"
echo "old validator" > "$OLD_HOME/skills/coryphaeus/bin/validate.mjs"
echo "old skill, edited" > "$OLD_HOME/skills/coryphaeus/SKILL.md"
vhash="$( (sha256sum "$OLD_HOME/skills/coryphaeus/bin/validate.mjs" 2>/dev/null || shasum -a 256 "$OLD_HOME/skills/coryphaeus/bin/validate.mjs") | cut -d' ' -f1)"
printf '%s  %s\n%s  %s\n' "$vhash" skills/coryphaeus/bin/validate.mjs "$(printf '0%.0s' {1..64})" skills/coryphaeus/SKILL.md > "$OLD_HOME/.chorus-install-manifest"
run env CLAUDE_HOME="$OLD_HOME" "$REPO_DIR/install.sh"
[[ $rc -eq 0 ]] || fail "coryphaeus upgrade exited $rc: $out"
grep -qx "old validator" "$OLD_HOME/skills/coryphaeus/bin/validate.mjs" || fail "install removed a retired skill's file"
grep -qx "old skill, edited" "$OLD_HOME/skills/coryphaeus/SKILL.md" || fail "install touched a retired skill's SKILL.md"
grep -q "^warning: the retired skill 'coryphaeus' is still installed" <<<"$out" || fail "no warning about the retired coryphaeus skill"
grep -q "rm -rf \"$OLD_HOME/skills/coryphaeus\"" <<<"$out" || fail "warning gives no removal command"
grep -q "skills/coryphaeus/bin/validate.mjs" "$OLD_HOME/.chorus-install-manifest" || fail "retired file dropped from the manifest, so uninstall could not remove it"
# Without a manifest the retired skill is still found and warned about.
rm -f "$OLD_HOME/.chorus-install-manifest"
run env CLAUDE_HOME="$OLD_HOME" "$REPO_DIR/install.sh"
grep -q "^warning: the retired skill 'coryphaeus'" <<<"$out" || fail "retired skill not warned about without a manifest"

# Upgrade from a copy made before the manifest existed: a file whose content was
# once shipped is ours and is replaced; a file never shipped fails the install loudly.
PRE_HOME="$(mktemp -d)"
trap 'rm -rf "$HOME_DIR" "$OLD_HOME" "$PRE_HOME"' EXIT
older="$(git -C "$REPO_DIR" log --format=%H -- skill/chorus-review/SKILL.md | sed -n 2p)"
[[ -n "$older" ]] || fail "no earlier version of chorus-review/SKILL.md in git history (shallow clone? fetch-depth: 0)"
mkdir -p "$PRE_HOME/skills/chorus-review" "$PRE_HOME/skills/chorus-core"
git -C "$REPO_DIR" show "$older:skill/chorus-review/SKILL.md" > "$PRE_HOME/skills/chorus-review/SKILL.md"
run env CLAUDE_HOME="$PRE_HOME" "$REPO_DIR/install.sh"
[[ $rc -eq 0 ]] || fail "pre-manifest upgrade exited $rc: $out"
grep -q "^  updated        skills/chorus-review/SKILL.md  (an earlier shipped version)" <<<"$out" || fail "older shipped SKILL.md not recognised"
cmp -s "$REPO_DIR/skill/chorus-review/SKILL.md" "$PRE_HOME/skills/chorus-review/SKILL.md" || fail "older shipped SKILL.md not replaced"
echo "never shipped" > "$PRE_HOME/skills/chorus-core/CONDUCTOR.md"
run env CLAUDE_HOME="$PRE_HOME" "$REPO_DIR/install.sh"
[[ $rc -eq 1 ]] || fail "install exited $rc with a never-shipped CONDUCTOR.md (expected 1)"
grep -q "^  $PRE_HOME/skills/chorus-core/CONDUCTOR.md$" <<<"$out" || fail "error does not name the file left alone"
grep -qx "never shipped" "$PRE_HOME/skills/chorus-core/CONDUCTOR.md" || fail "install overwrote a file it never shipped"

echo "PASS — install -> re-run -> refresh -> uninstall round trip, the coryphaeus upgrade and the pre-manifest upgrade, into temp CLAUDE_HOMEs."
