---
name: project-chorus-exploratory-phase-trust
description: Feature 004 (advisor exploratory phase) trust surface — harvested reviewed-repo content becomes persisted advisor memory replayed into later reasoning
metadata:
  type: project
---

Feature 004 "advisor exploratory phase" for the chorus-review skill adds a new
data flow with an undrawn trust boundary.

**The flow:** advisors harvest text (quotes, refs) from a REVIEWED repo's
docs/ADRs/READMEs/comments (FR-003), persist it in `~/.claude/agent-memory/<persona>/understanding-*.md`,
and replay it into later-round reasoning. The orchestrator drafts project-wide
facts and writes them back into operator-owned `docs/reviews/CHORUS-PROJECT.md`
after operator acceptance (FR-017).

**Why it matters (trust):** the reviewed repo is the lowest-trust input in the
system, yet its prose flows into agent reasoning and a persisted, replayed,
cross-round, operator-owned artifact. A README/ADR can steer a future advisor
(prompt-injection / inference-poisoning), and a fingerprint misfire trusts stale
content. The spec body never names this boundary — only the RSVP log
(agent-sdlc-log.md:28) records that Security-and-Trust raised it.

**Why:** GATE A design review, 2026-06-07. Small-team, single-operator scale —
machinery is rarely earned; the honest remedy is usually "name the boundary +
provenance tag," not a sanitizer.

**Gate A cycle 2 (2026-06-07) — F18 RESOLVED.** Revised FR-021 makes persisted
memory an "index of locators, never the evidentiary endpoint": a finding must
re-ground in live material via the locator; a cached quote is a navigational hint
only. This strips authority from the persisted payload, so the *replay* primitive
(one-time harvest, persistent trusted effect) is removed. Residual non-gating risk:
a cached ≤2-sentence quote still *anchors/steers* a later round's prior before
re-grounding, and a budget-pressured advisor may skip re-grounding an "obvious"
hint — FR-021 forbids the quote as endpoint, not as anchor. F19/F22 substantially
addressed (freshness fingerprint + re-validate-on-drift FR-012; locators-not-copy
FR-004/SC-002). FR-023 caching of project-wide facts did NOT reopen a replay path —
reconciliation-locator + addendum-wins-on-conflict keep the cache non-authoritative.
No regression. Sanitizer/allowlist correctly rejected as unearned at single-operator
scale (D10).

**Gate C vote (2026-06-07) — staleness mechanism is the live trust seam.** Authored
no findings (F18 verified landed verbatim). Through the trust lens, only the
staleness/fingerprint findings have lens authority: PRIORITIZED C4 (content-digest
fingerprint names no algorithm and no *executor* — in a no-runtime skill the executor
is an LLM eyeballing a digest, which IS the false-fresh primitive mtime was rejected
for; my F18/F21 stale-trust concern made concrete) and C7 (R2's resolution didn't
back-propagate to research.md/data-model.md, so they still carry the rejected false-fresh
phrasing — a reader grounding trust decisions inherits it). C4 and C7 are the same
trust defect split across two ratings: the content-digest decision is both under-defined
and under-propagated. OVER-RATED C3 (ships-unverified — operator chose to defer dogfood;
no runtime / no live data surface makes it a quality risk, not exploitable). Abstained
on C1/C2/C5/C6/C8/C9 (SSOT, verification-honesty, locator correctness, taxonomy, smoke
coverage, run-cost sequencing — all out of trust lens).

**How to apply:** on later rounds, watch the residual *anchor* steer — whether
re-grounding is actually performed under budget pressure, not just specified. Treat
the index-not-endpoint rule as the load-bearing control; if a future change lets any
cached text become a finding's endpoint, F18 reopens. See also
[[project-spec085-pagination-antibot-footprint]].
