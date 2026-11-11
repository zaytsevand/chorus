#!/usr/bin/env bash
# check-records.sh — every committed review record and run log under
# docs/reviews/ validates against its schema. Runs locally, from the
# pre-commit hook (.githooks/pre-commit) and in CI (.github/workflows/integrity.yml).
# Checks every file before failing, so one run lists every broken record.
set -uo pipefail

cd "$(dirname "$0")/.."
validate=skill/chorus-core/bin/validate.mjs
failed=0
shopt -s nullglob
for f in docs/reviews/*.json; do
  case "$f" in
    *.run.json) kind=run-log ;;
    *) kind=review-record ;;
  esac
  if ! node "$validate" "$kind" "$f"; then
    echo "FAIL: $f does not validate as a $kind" >&2
    failed=1
  fi
done
exit "$failed"
