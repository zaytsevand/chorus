#!/usr/bin/env bash
# check-suite-integrity.sh — the three greppable fitness checks for the chorus
# suite (FR-014). Manually runnable; the automated harness (Jest/TS) is deferred
# (FR-019). Exits non-zero on any violation and prints the offending locators.
#
#   FC1  invariant-resolution + residence (FR-008, FR-008a)
#   FC2  no-fat-sibling-import (FR-006)
#   FC3  packaging-manifest sync + advisor count (FR-013)
#
# Runs on REPO SOURCE (no stale files). Installed-dir drift is out of scope
# (F6 waiver; see quickstart upgrade step).
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

SKILL_DIR="skill"
CORE="$SKILL_DIR/chorus-core"
REVIEW="$SKILL_DIR/chorus-review"
SDLC="$SKILL_DIR/chorus-sdlc"
PLUGIN="plugin.json"
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
# FC3 — packaging-manifest sync + advisor count
# ---------------------------------------------------------------------------
section "FC3 — packaging-manifest sync + advisor count (FR-013)"
fc3=0

# 3a. Every plugin.json skills[] entry exists on disk; every skill/*/ is listed.
manifest_skills="$(grep -oE '"skill/[^"]+"' "$PLUGIN" | tr -d '"' | sort -u)"
for s in $manifest_skills; do
  if [[ ! -d "$s" ]]; then note "MANIFEST VIOLATION: skills[] entry '$s' not on disk"; fc3=1; fi
done
for d in "$SKILL_DIR"/*/; do
  d="${d%/}"
  if ! grep -q "\"$d\"" "$PLUGIN"; then note "MANIFEST VIOLATION: on-disk skill '$d' not listed in plugin.json skills[]"; fc3=1; fi
done

# 3b. Every plugin.json agents[] entry exists; every agents/*.md is listed.
manifest_agents="$(grep -oE '"agents/[^"]+\.md"' "$PLUGIN" | tr -d '"' | sort -u)"
for a in $manifest_agents; do
  if [[ ! -f "$a" ]]; then note "MANIFEST VIOLATION: agents[] entry '$a' not on disk"; fc3=1; fi
done
for f in "$AGENTS_DIR"/*.md; do
  if ! grep -q "\"$f\"" "$PLUGIN"; then note "MANIFEST VIOLATION: on-disk agent '$f' not listed in plugin.json agents[]"; fc3=1; fi
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
section "RESULT"
if [[ $fail -ne 0 ]]; then
  echo "FAIL — one or more fitness checks reported violations (see locators above)."
  exit 1
fi
echo "OK — FC1, FC2, FC3 all pass."
exit 0
