#!/usr/bin/env bash
# check-suite-integrity.sh — the fitness checks for the chorus suite (FR-014,
# Q-10). Runs locally and in CI (.github/workflows/integrity.yml). Exits
# non-zero on any violation and prints the offending locators.
#
#   FC1  invariant-resolution + residence (FR-008, FR-008a)
#   FC2  no-fat-sibling-import (FR-006)
#   FC3  plugin manifest: `claude plugin validate` + skills[]/agents[] sync +
#        advisor count (FR-013)
#   FC4  reference integrity: markdown file references in skill/ and agents/
#        resolve; chorus-core cites no sibling skill file; chorus-core/SKILL.md
#        indexes every core file
#   FC5  stale-content guards: stale token ranges (I1–I8, S1–S9), the retired
#        🟠 severity, the wrong persona-memory path (.agents/agent-memory)
#   FC6  port boundary: the chorus skills and personas never name problem-brief
#        and never cite a coryphaeus file; only coryphaeus binds providers
#
# Runs on REPO SOURCE. Installed copies are not checked: a release is dogfooded
# through the real install channel instead (CONTRIBUTING "Releasing").
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

SKILL_DIR="skill"
CORE="$SKILL_DIR/chorus-core"
REVIEW="$SKILL_DIR/chorus-review"
SDLC="$SKILL_DIR/chorus-sdlc"
PLUGIN=".claude-plugin/plugin.json"
AGENTS_DIR="agents"

fail=0
note() { printf '  %s\n' "$1"; }
section() { printf '\n=== %s ===\n' "$1"; }

# A "definition" line for an invariant token looks like:  - **I1.** ...  /  - **S8 ...  / **D1
# (bold token followed by a number then a period or word boundary), as used in
# the catalog blocks. A "reference" is any other mention.
def_regex_I='^\s*-?\s*\*\*I[1-9]\.'
def_regex_S='^\s*-?\s*\*\*S(8|9|10|11)\b'
def_regex_D='^\s*-?\s*\*\*D[1-5]\b'

# ---------------------------------------------------------------------------
# FC1 — invariant-resolution + residence
# ---------------------------------------------------------------------------
section "FC1 — invariant-resolution + residence (FR-008/FR-008a)"
fc1=0

# 1a. RESIDENCE: no I / D / S8–S11 *definition* outside chorus-core.
for re in "$def_regex_I" "$def_regex_S" "$def_regex_D"; do
  hits="$(grep -rnE "$re" "$SKILL_DIR" 2>/dev/null | grep -v "^$CORE/" || true)"
  if [[ -n "$hits" ]]; then
    note "RESIDENCE VIOLATION: I/D/S8–S11 token defined outside chorus-core:"
    printf '%s\n' "$hits" | sed 's/^/    /'
    fc1=1
  fi
done

# 1b. RESIDENCE for S1–S7: must be defined in chorus-sdlc, nowhere else.
s17_def='^\s*-?\s*\*\*S[1-7]\b'
s17_hits="$(grep -rnE "$s17_def" "$SKILL_DIR" 2>/dev/null | grep -v "^$SDLC/" || true)"
if [[ -n "$s17_hits" ]]; then
  note "RESIDENCE VIOLATION: S1–S7 defined outside chorus-sdlc:"
  printf '%s\n' "$s17_hits" | sed 's/^/    /'
  fc1=1
fi

# 1c. RESOLUTION: any I-token referenced in chorus-sdlc must resolve to core
#     (chorus-sdlc references I1–I9; their definition is in chorus-core, reachable
#     via REQUIRED: chorus-core). Confirm chorus-sdlc declares the composition.
if grep -rqE 'REQUIRED:\s*chorus-core' "$SDLC" 2>/dev/null; then
  : # composition declared → I-token references resolve to core
else
  if grep -rqE '\bI[1-9]\b' "$SDLC" 2>/dev/null; then
    note "RESOLUTION VIOLATION: chorus-sdlc references I-tokens but does not declare REQUIRED: chorus-core"
    fc1=1
  fi
fi
# Same composition assertion for chorus-review (references I/S/D tokens).
if ! grep -rqE 'REQUIRED:\s*chorus-core' "$REVIEW" 2>/dev/null; then
  if grep -rqE '\b(I[1-9]|S(8|9|10|11)|D[1-5])\b' "$REVIEW" 2>/dev/null; then
    note "RESOLUTION VIOLATION: chorus-review references core tokens but does not declare REQUIRED: chorus-core"
    fc1=1
  fi
fi

# 1d. NO-DANGLING: every I / D / S8–S11 token *referenced* anywhere in the suite
#     MUST have a definition line present in chorus-core. Catches the
#     missing-CONDUCTOR (catalog deleted) case at the source level — a reference
#     whose single definition is gone is a dangling token (FR-008).
core_glob=("$CORE"/*.md)
def_present() { # $1 = token regex anchored as a definition; returns 0 if found in core
  grep -hqE "$1" "${core_glob[@]}" 2>/dev/null
}
for n in 1 2 3 4 5 6 7 8 9; do
  if grep -rqE "\bI$n\b" "$SKILL_DIR" 2>/dev/null; then
    def_present "^\s*-?\s*\*\*I$n\." || { note "DANGLING TOKEN: I$n is referenced but has no definition in chorus-core"; fc1=1; }
  fi
done
for n in 1 2 3 4 5; do
  if grep -rqE "\bD$n\b" "$SKILL_DIR" 2>/dev/null; then
    def_present "\*\*D$n\b" || { note "DANGLING TOKEN: D$n is referenced but has no definition in chorus-core"; fc1=1; }
  fi
done
for n in 8 9 10 11; do
  if grep -rqE "\bS$n\b" "$SKILL_DIR" 2>/dev/null; then
    def_present "\*\*S$n\b" || { note "DANGLING TOKEN: S$n is referenced but has no definition in chorus-core"; fc1=1; }
  fi
done

# 1e. CATALOG-COMPLETENESS (Gate C GC6): unconditionally assert the full catalog is
#     defined in its home — independent of whether a token is referenced elsewhere.
#     Closes the blind spot where a token defined-and-referenced only within its own
#     file (e.g. I3 inside CONDUCTOR.md) would vanish undetected when that file is
#     deleted (the no-dangling check at 1d skips unreferenced tokens).
for n in 1 2 3 4 5 6 7 8 9; do
  def_present "^\s*-?\s*\*\*I$n\." || { note "CATALOG-INCOMPLETE: I$n has no definition in chorus-core"; fc1=1; }
done
for n in 1 2 3 4 5; do
  def_present "\*\*D$n\b" || { note "CATALOG-INCOMPLETE: D$n has no definition in chorus-core"; fc1=1; }
done
for n in 8 9 10 11; do
  def_present "\*\*S$n\b" || { note "CATALOG-INCOMPLETE: S$n has no definition in chorus-core"; fc1=1; }
done

if [[ $fc1 -eq 0 ]]; then note "PASS — full I/D/S8–S11 catalog present & defined in chorus-core; S1–S7 in chorus-sdlc; references resolve via composition; no dangling/incomplete tokens."; fi
[[ $fc1 -ne 0 ]] && fail=1

# ---------------------------------------------------------------------------
# FC2 — no-fat-sibling-import
# ---------------------------------------------------------------------------
section "FC2 — no-fat-sibling-import (FR-006)"
fc2=0

# No file in chorus-review may reference a chorus-sdlc *file path or filename*,
# and vice-versa. This encodes "nothing depends on a fat sibling" — a file-level
# composition/import. A bare skill-name mention (a routing hint like "use the
# chorus-sdlc skill for the lifecycle mode") is NOT a dependency: it resolves to
# no file or invariant in the sibling (FR-006), so it is permitted. Violations
# are references to the sibling's directory path or to a markdown file that lives
# only in the sibling.
#
# Sibling-unique file basenames:
#   chorus-review: INTEGRATION-LAYER.md
#   chorus-sdlc:   (none unique by basename — guard by directory path)
r2s="$(grep -rnE 'skill/chorus-sdlc|chorus-sdlc/[A-Za-z0-9_.-]+\.md|SDLC-LAYER\.md' "$REVIEW" 2>/dev/null || true)"
if [[ -n "$r2s" ]]; then
  note "FAT-SIBLING VIOLATION: chorus-review references a chorus-sdlc file path:"
  printf '%s\n' "$r2s" | sed 's/^/    /'
  fc2=1
fi
s2r="$(grep -rnE 'skill/chorus-review|chorus-review/[A-Za-z0-9_.-]+\.md|INTEGRATION-LAYER\.md' "$SDLC" 2>/dev/null || true)"
if [[ -n "$s2r" ]]; then
  note "FAT-SIBLING VIOLATION: chorus-sdlc references a chorus-review file path:"
  printf '%s\n' "$s2r" | sed 's/^/    /'
  fc2=1
fi

if [[ $fc2 -eq 0 ]]; then note "PASS — no cross-sibling reference (review↔sdlc); both compose only chorus-core."; fi
[[ $fc2 -ne 0 ]] && fail=1

# ---------------------------------------------------------------------------
# FC3 — plugin manifest: validator + sync + advisor count
# ---------------------------------------------------------------------------
section "FC3 — plugin manifest: validator + skills[]/agents[] sync + advisor count (FR-013)"
fc3=0

if [[ ! -f "$PLUGIN" ]]; then
  note "MANIFEST VIOLATION: $PLUGIN not found (Claude Code reads the manifest from .claude-plugin/)."
  fc3=1
  PLUGIN=/dev/null
fi
if [[ -e plugin.json ]]; then
  note "MANIFEST VIOLATION: stray root plugin.json — the manifest lives at $PLUGIN only."
  fc3=1
fi

# 3a. Shape and paths: the Claude Code validator is the authority. Skipped with
#     a warning where the CLI is absent (e.g. CI runners).
if command -v claude >/dev/null 2>&1; then
  if ! vout="$(claude plugin validate "$REPO_DIR" 2>&1)"; then
    note "MANIFEST VIOLATION: claude plugin validate failed:"
    printf '%s\n' "$vout" | sed 's/^/    /'
    fc3=1
  fi
else
  note "WARN — claude CLI not found; skipping 'claude plugin validate' (run it locally before a release)."
fi

# 3b. Sync — the validator cannot know what the manifest leaves out: every
#     skill/*/ and agents/*.md on disk must be listed, and every listed entry
#     must exist.
manifest_skills="$(grep -oE '"\./skill/[^"]+"' "$PLUGIN" | tr -d '"' | sed 's|^\./||' | sort -u)"
for s in $manifest_skills; do
  if [[ ! -d "$s" ]]; then note "MANIFEST VIOLATION: skills[] entry './$s' not on disk"; fc3=1; fi
done
for d in "$SKILL_DIR"/*/; do
  d="${d%/}"
  if ! grep -q "\"\./$d\"" "$PLUGIN"; then note "MANIFEST VIOLATION: on-disk skill '$d' not listed in $PLUGIN skills[] (as \"./$d\")"; fc3=1; fi
done
manifest_agents="$(grep -oE '"\./agents/[^"]+\.md"' "$PLUGIN" | tr -d '"' | sed 's|^\./||' | sort -u)"
for a in $manifest_agents; do
  if [[ ! -f "$a" ]]; then note "MANIFEST VIOLATION: agents[] entry './$a' not on disk"; fc3=1; fi
done
for f in "$AGENTS_DIR"/*.md; do
  if ! grep -q "\"\./$f\"" "$PLUGIN"; then note "MANIFEST VIOLATION: on-disk agent '$f' not listed in $PLUGIN agents[] (as \"./$f\")"; fc3=1; fi
done

# 3c. Advisor count in the manifest description matches the roster.
#     Roster = nine default lenses + optional Guido = 10 agents on disk.
disk_agents="$(ls "$AGENTS_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')"
# The description must not undercount: it must state the nine-lens roster
# (and may name the optional Guido). We check it does not claim "seven"/"7"
# advisors, and that it names the full roster scale.
desc="$(grep -oE '"description":\s*"[^"]*"' "$PLUGIN" | head -1)"
if printf '%s' "$desc" | grep -qiE 'seven|[^0-9]7 (persona|advisor|agent|lens)'; then
  note "ADVISOR-COUNT VIOLATION: description undercounts the roster (says 'seven'/'7'); disk holds $disk_agents agents."
  note "    $desc"
  fc3=1
fi
if ! printf '%s' "$desc" | grep -qiE 'nine|9 (lens|advisor|persona)'; then
  note "ADVISOR-COUNT VIOLATION: description does not state the nine-lens roster (disk holds $disk_agents agents)."
  note "    $desc"
  fc3=1
fi

if [[ $fc3 -eq 0 ]]; then note "PASS — manifest skills[]/agents[] match disk; advisor count matches the nine-lens roster ($disk_agents agents on disk)."; fi
[[ $fc3 -ne 0 ]] && fail=1

# ---------------------------------------------------------------------------
# FC4 — reference integrity
# ---------------------------------------------------------------------------
section "FC4 — reference integrity (Q-10)"
fc4=0

# 4a. Every markdown file reference to a SUITE file in skill/ and agents/
#     resolves. References are backticked `*.md` names/paths and markdown link
#     targets. Which references are suite files, and where they resolve:
#       skill/… or agents/…            repo root
#       chorus-{core,review,sdlc,learn}/…, coryphaeus/…  skill/
#       ./…  ../…  templates/…         the citing file's directory
#       bare UPPER-CASE.md name        the citing file's directory, then
#                                      chorus-core (every skill composes core)
#     Target-project files (CLAUDE.md, AGENTS.md, MEMORY.md, CHORUS-PROJECT.md,
#     README.md, CONTRIBUTING.md, docs/…, specs/…, lower-case names) and
#     placeholders (<…>, *, YYYY) are not suite files and are not checked.
PROJECT_SIDE=' CLAUDE.md AGENTS.md MEMORY.md CHORUS-PROJECT.md README.md CONTRIBUTING.md '
ref_lines="$(grep -rnoE '`[^` ]+\.md([^A-Za-z0-9_`][^`]*)?`|\]\([^) ]+\.md(#[^)]*)?\)' \
  "$SKILL_DIR" "$AGENTS_DIR" --include='*.md' 2>/dev/null || true)"
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  file="${line%%:*}"; rest="${line#*:}"; lineno="${rest%%:*}"; m="${rest#*:}"
  ref="$(printf '%s' "$m" | sed -E 's/^(`|\]\()//; s/(\.md).*/\1/')"
  case "$ref" in *'<'*|*'*'*|*YYYY*|http*) continue ;; esac
  dir="$(dirname "$file")"
  ok=skip
  case "$ref" in
    skill/*|agents/*)                    [[ -f "$ref" ]] && ok=1 || ok=0 ;;
    chorus-core/*|chorus-review/*|chorus-sdlc/*|chorus-learn/*|coryphaeus/*)
                                         [[ -f "$SKILL_DIR/$ref" ]] && ok=1 || ok=0 ;;
    ./*|../*|templates/*)                [[ -f "$dir/$ref" ]] && ok=1 || ok=0 ;;
    */*) ;;                              # docs/…, specs/…, .specify/… — target project
    *)
      if [[ "$ref" =~ ^[A-Z][A-Z0-9_-]*\.md$ && "$PROJECT_SIDE" != *" $ref "* ]]; then
        [[ -f "$dir/$ref" || -f "$CORE/$ref" ]] && ok=1 || ok=0
      fi ;;
  esac
  if [[ "$ok" == 0 ]]; then
    note "BROKEN REFERENCE: $file:$lineno → $ref"
    fc4=1
  fi
done <<< "$ref_lines"

# 4b. chorus-core is the substrate: it may name sibling skills, but must not
#     cite a sibling skill FILE (path) or a sibling-only file.
core_sib="$(grep -rnE '(skill/)?chorus-(review|sdlc|learn)/[A-Za-z0-9_.-]*|SDLC-LAYER|INTEGRATION-LAYER' "$CORE" 2>/dev/null || true)"
if [[ -n "$core_sib" ]]; then
  note "CORE→SIBLING VIOLATION: chorus-core cites a sibling skill file:"
  printf '%s\n' "$core_sib" | sed 's/^/    /'
  fc4=1
fi

# 4c. chorus-core/SKILL.md indexes every core file.
for f in "$CORE"/*.md; do
  b="$(basename "$f")"
  [[ "$b" == "SKILL.md" ]] && continue
  if ! grep -qF "\`$b\`" "$CORE/SKILL.md"; then
    note "INDEX VIOLATION: $CORE/SKILL.md does not list \`$b\`"
    fc4=1
  fi
done

if [[ $fc4 -eq 0 ]]; then note "PASS — suite file references resolve; chorus-core cites no sibling file; core index complete."; fi
[[ $fc4 -ne 0 ]] && fail=1

# ---------------------------------------------------------------------------
# FC5 — stale-content guards
# ---------------------------------------------------------------------------
section "FC5 — stale-content guards (Q-10)"
fc5=0
DOCS=("$SKILL_DIR" "$AGENTS_DIR" README.md CONTRIBUTING.md)

stale="$(grep -rnE 'I1[–-]I8([^0-9]|$)|S1[–-]S9([^0-9]|$)' "${DOCS[@]}" 2>/dev/null || true)"
if [[ -n "$stale" ]]; then
  note "STALE RANGE: I1–I8 / S1–S9 (the catalogs are I1–I9, S1–S7 + S8–S11):"
  printf '%s\n' "$stale" | sed 's/^/    /'
  fc5=1
fi

orange="$(grep -rn '🟠' "$SKILL_DIR" 2>/dev/null || true)"
if [[ -n "$orange" ]]; then
  note "RETIRED SEVERITY: 🟠 in skill/ (severity is three-level: 🔴 🟡 🟢):"
  printf '%s\n' "$orange" | sed 's/^/    /'
  fc5=1
fi

mem="$(grep -rnF '.agents/agent-memory' "${DOCS[@]}" 2>/dev/null || true)"
if [[ -n "$mem" ]]; then
  note "WRONG MEMORY PATH: persona memory lives at .claude/agent-memory/:"
  printf '%s\n' "$mem" | sed 's/^/    /'
  fc5=1
fi

if [[ $fc5 -eq 0 ]]; then note "PASS — no stale token range, no 🟠, no .agents/agent-memory."; fi
[[ $fc5 -ne 0 ]] && fail=1

# ---------------------------------------------------------------------------
# FC6 — port boundary
# ---------------------------------------------------------------------------
section "FC6 — port boundary"
fc6=0
CHORUS_SIDE=("$SKILL_DIR"/chorus-* "$AGENTS_DIR")

names="$(grep -rniE 'problem[- ]brief' "${CHORUS_SIDE[@]}" 2>/dev/null || true)"
if [[ -n "$names" ]]; then
  note "BOUNDARY VIOLATION: the chorus names problem-brief (only coryphaeus binds it):"
  printf '%s\n' "$names" | sed 's/^/    /'
  fc6=1
fi

leans="$(grep -rnE '(skill/)?coryphaeus/[A-Za-z0-9_./-]+' "${CHORUS_SIDE[@]}" 2>/dev/null || true)"
if [[ -n "$leans" ]]; then
  note "BOUNDARY VIOLATION: the chorus cites a coryphaeus file (refer to the bound port instead):"
  printf '%s\n' "$leans" | sed 's/^/    /'
  fc6=1
fi

if [[ $fc6 -eq 0 ]]; then note "PASS — the chorus names no provider and cites no coryphaeus file."; fi
[[ $fc6 -ne 0 ]] && fail=1

# ---------------------------------------------------------------------------
section "RESULT"
if [[ $fail -ne 0 ]]; then
  echo "FAIL — one or more fitness checks reported violations (see locators above)."
  exit 1
fi
echo "OK — FC1 to FC6 all pass."
exit 0
