---
name: chorus-canon-language
description: Chorus-review check suite Published Language — the FAIL:-token contract at quickstart.md:5 is the boundary; cite-not-restate is the core discipline; install.sh and cross-feature cites are the leaky seams
metadata:
  type: project
---

The chorus-review feature's conformance suite (specs/0NN/quickstart.md, checks C1–C7) has a
**Published Language**: every stanza emits an explicit `FAIL:` token on failure; empty grep =
pass (quickstart.md:5, SC-008). This is the contract that crosses the operator boundary.

**Why:** Treat any stanza that violates this contract (C2 grep-silent, C5 echo-success-only)
as a real breach, not cosmetic. In feature 007 Gate B, BECK-1/DNO-1/DNO-2 all named the same
breach through different lenses — C2 and C5 don't emit `FAIL:`, so T002's red baseline is
unmeetable for them. All gating.

**How to apply:**
- The recurring leaky seams in this codebase: (1) install.sh as a shared mutable file —
  multiple [P]-marked tasks editing it is a false-parallelism smell (RICH-1, 007); (2)
  cross-feature cites (PR#5 / DECISION-PRIMITIVE.md) recorded as horizons but gating nothing
  (RICH-2, 007) — a Context Map edge with no enforced contract.
- Baseline-ordering: a red-baseline task in Phase 1 that exercises a check whose target is
  built in a later phase cannot distinguish not-built from check-broken (DNO-5, 007).
- Core discipline of the canon itself: cite-not-restate. The canon is the upstream Published
  Language; LEARN.md and addenda are downstream and must cite, never restate, pinned
  definitions.
