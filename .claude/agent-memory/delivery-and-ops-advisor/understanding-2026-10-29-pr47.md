---
name: understanding-2026-10-29-pr47
description: Delivery/ops understanding record for the 2026-10-29 chorus round on PRs #45+#47 (release/upgrade path, CI gate, conduct.mjs run log)
metadata:
  type: project
---

Exploratory-phase record, round 2026-10-29 (PR #45 + #47, tip be31e5c, base origin/main). Locators, not copies. No prior record from this lens existed.

## 1. Release path, end to end [ref]
- Two shipping channels: copy install (`install.sh`, header comment + `place()`) and plugin load (`claude --plugin-dir <repo>`, README § install, `.claude-plugin/plugin.json`).
- "Release" = merge with CI green + local `check-suite-integrity.sh` (only place `claude plugin validate` runs) + one dogfood round: `CONTRIBUTING.md` § Releasing. No tags in the repo; `plugin.json` version is static `1.0.0`, unchanged by the 56-file diff.
- Upgrade = re-run `install.sh`; per-file state machine current/updated/differs-kept/skip/installed, keyed on `$CLAUDE_HOME/.chorus-install-manifest` hashes. Prune + RETIRED_SKILLS rename block near the end of `install.sh`.

## 2. Rollback [ref]
- No documented rollback. Implicit: check out an older commit and re-run `install.sh` (prune would remove files the newer version added, if unedited). Untested by `scripts/test-install-roundtrip.sh`.
- For `conduct.mjs` runs: no resume/repair path for a damaged `<stem>.run.json`; `appendTo()` in `skill/chorus-core/bin/conduct.mjs` rewrites the whole file with `writeFileSync` (no temp+rename) after validating it.

## 3. What CI asserts [ref]
- `.github/workflows/integrity.yml`: three jobs. `install-roundtrip` runs the bash round trip only; it never runs Node from the installed tree. `record-tools` runs `node --test` against the repo layout, Node 20 only (installer and README claim Node 18+).
- `test/` ships to users (install.sh copies all of `skill/*/`). `test/vocab-lint.test.mjs` resolves `REPO = CORE/../..` and reads `.claude-plugin/plugin.json`, `agents/`, README, CONTRIBUTING: valid in repo and `--plugin-dir`, broken in a copy install (operator observed this today). Nothing in CI exercises the installed layout's tests or tools.
- Roundtrip covers: fresh install, idempotent re-run, refresh vs. user-edited, uninstall, coryphaeus upgrade *with a manifest*. It does not cover the pre-manifest stale copy (classified "skip, not ours" — indistinguishable from a user's own file), which is the path the operator hit today.

## 4. Bundled steps [infer]
- `install.sh` single run = install + update + prune + retire-rename + manifest rewrite. Manifest is written last (`mv`); an abort mid-run under `set -e` leaves files written but unrecorded, which the next run classifies as "skip, not ours".
- `conduct record` writes `<stem>.json` and `<stem>.md` back to back.

## 5. Observability surface [op]
- Installer: per-file status lines + counts summary; Node and problem-brief presence reported. The "Skipped (not ours)" count is the only signal for a silently stale upgrade; no exit code or warning distinguishes it.
- Conductor: exit codes 0/1/2/3 (`CONDUCTOR.md` § Record tools, § The conductor loop); validator exit 3 = install drift, "reported once". The run log itself is the audit trail (`docs/reviews/2026-10-29-chorus-review-pr47.run.json` is this round's, uncommitted).

## 6. Scale [gate] [op]
- `docs/reviews/CHORUS-PROJECT.md` § operator-confirmed facts (2026-09-27): installed by strangers; installer findings at full severity; ranked qualities conformance/reliability > portability > ease of change > simplicity.
- NOT confirmed: maintainer count, user/install count, how users learn an upgrade exists, who gets the bug report. Assumed solo maintainer (single git author) — unconfirmed.
- Addendum is stale: still names `skill/coryphaeus/` as composition root and anchor (§ 1, § 3, lines ~14–48).

## 7. Failure history [ref]
- Operator dogfood 2026-10-29: vocab-lint fails in `~/.claude`; pre-manifest stale SKILL.md files kept until `--force`. Prior round record `docs/reviews/2026-09-27-chorus-review-pr32.json` holds no delivery-lens findings.
