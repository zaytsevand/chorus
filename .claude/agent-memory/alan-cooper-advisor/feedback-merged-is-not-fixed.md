---
name: merged-is-not-fixed
description: A feature can pass a gate fully green while the originally-reported user defect is still live in production; name the merged-vs-fixed gap at the gate
metadata:
  type: feedback
---

When a spec's own scope explicitly defers the production action that actually resolves the reported defect (e.g. "operator chose to hold the redeploy"), the feature can merge green while the user who filed the bug still hits the dead-end. "Merged" and "fixed" are not the same promise.

**Why:** feature 108 (incremental-publish-uuid-links, Gate A, 2026-06-19) — spec.md:16 states the redeploy is held; SC-002 (404 lines drop in Loki) is a precondition that lives *outside* the merge. The feature exists to make a link durable, but on merge the originally-reported 404 is still live. Delivery filed this as 🟡 F10; I voted PRIORITIZE — the gap between gate-green and user-problem-solved is a user-facing fact, not an ops footnote.

**How to apply:** at any gate, check whether closing the user's reported problem depends on an action the spec marks out-of-scope or "held." If so, lead with it at the severity its user-cost warrants — do not let the verdict imply the defect is fixed when only the code is merged. Related: a found-but-unpublished row that's invisible to the watching operator is the same family of gap (gulf of evaluation), [[project-jobgenie-account-as-test-fixture]].
