---
name: project-chorus-exploratory-phase
description: chorus-review feature 004 (advisor exploratory phase) — deploy/ops findings from Gate C; digest-with-no-operator is the load-bearing risk
metadata:
  type: project
---

Feature 004 "advisor exploratory phase" of chorus-review (Markdown skill, no runtime). Gate C author-stage review findings:

**Deploy surface is clean.** `install.sh:36` globs `skill/chorus-review/*.md`, `install.sh:41` globs `agents/*.md`; `uninstall.sh:28` globs the same `agents/*.md` source-of-truth. New EXPLORATORY-PHASE.md and all ten personas deploy/remove with zero hardcoded-list drift. This glob-not-list pattern is the right cheap-to-keep choice — preserve it on future persona additions.

**Load-bearing risk (🔴): content-digest fingerprint has no computer.** EXPLORATORY-PHASE.md:115-129 specifies a "short content digest of the cited span" for staleness, rejecting mtime/commit-hash on false-fresh grounds. But no script/sha/tool exists — an LLM hand-writes `[fresh: <fingerprint>]` (understanding-record.md:17). An LLM-eyeballed digest is non-deterministic → structurally false-fresh-prone → reintroduces exactly the failure mtime was rejected for. Remedy: deterministic `git hash-object`/`sha256` of span.

**Why:** staleness detection is the spine of the two-tier cache (addendum-authoritative + per-advisor cache); an unoperated freshness mechanism collapses the whole reconciliation story.

**How to apply:** if revisiting feature 004 or any chorus freshness/cache mechanism, push for a deterministic digest engine before trusting drift detection. Also watch the "executable/grep-able check" label on the profile-coverage fitness function — it's actually LLM-judgment over freeform memory records, not a real grep.

Behavioral validation (T029 dogfood, T031 SC-001..010) deferred unchecked — honestly flagged in tasks.md:11-14, but means the skill ships with behavioral SCs unverified. Structural smokes (file existence + cross-refs) pass; mechanic behavior unproven.
