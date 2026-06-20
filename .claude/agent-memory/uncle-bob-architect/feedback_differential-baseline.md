---
name: differential-baseline
description: When a test suite has pre-existing failures, refactor against a differential baseline rather than demanding green-from-zero
metadata:
  type: feedback
---

When establishing a regression net for a refactor and the baseline is NOT fully
green, do NOT stop dead. Characterize the pre-existing failures (prove they exist
on the untouched base branch), then treat the exact pass/fail SET as the baseline:
a behavior-preserving change must reproduce it identically (same N pass, same M
fail), introducing no new failures.

**Why:** Real codebases have rot — especially test tiers CI doesn't gate (e.g.
un-run integration suites that drifted from current behavior). Refusing to proceed
without green-from-zero blocks legitimate work; blindly trusting a red baseline
hides regressions. The differential set threads both.

**How to apply:** Run the baseline first. For each failure, confirm it's
pre-existing (on the base branch, before your edits) and explain *why* (stale test
vs real bug). Then either (a) refresh the stale tests to current/spec behavior to
get a clean green target, or (b) keep them as known-red and assert the post-change
set is identical. Always surface the rot as a finding. See [[fix-rotted-tests]].
