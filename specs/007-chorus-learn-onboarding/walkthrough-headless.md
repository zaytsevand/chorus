# Spec walkthrough — 007 `chorus learn`

**Mode: headless · Verdict: advisory (CLEAN)** · Walked 2026-06-12

Reconciliation of spec 007 intent against the **implemented reality in the
worktree** (commit `2cc010f`; the conformance suite C1–C6+C5b runs green, 0 `FAIL:`
tokens). Phase-0 map built by an independent `Explore` over the worktree files.

> Phase-0 SURPRISE (process, not spec): the first `Explore` mapped the **main
> checkout** (`/home/az/code/chorus-review/`), where 007 is unimplemented, and
> reported everything ABSENT. Subagents default their cwd to the main repo, not the
> active worktree. Re-dispatched with absolute worktree paths; this map reflects the
> real implemented tree.

## TL;DR

The five-step tutorial, its registration across every cold-start surface, and the
dual-channel delivery are all implemented and pass the SC-008 conformance suite.
No transformation DRIFT: spec intent and code agree on every user story. The only
open item is an evidence GAP — no real external newcomer has run the tutorial yet
(SC-010), which is a post-merge obligation the ledger already tracks, not a build gap.

## US→code traceability map (keyed by handle)

| US (handle) | Logical | Edges | Process | Observability | Value | Verdict |
|---|---|---|---|---|---|---|
| «guided-five-step-arc» (US1, P1) | MATCH — Step/SubStep/NavigationChoice realized in LEARN.md | MATCH — registration on SKILL.md (frontmatter+list), README, install.sh | MATCH — trigger→ResumeState→S1 probes→steps | MATCH — C1/C2 green (mode registered, 5 steps present) | MATCH — newcomer reaches a first round via the registered mode | traced |
| «choose-your-path-nav» (US2, P2) | MATCH — four affordances + per-step depth + resume in LEARN.md | MATCH — navigation.md is the normative surface LEARN.md conforms to | MATCH — advance/jump/deeper(recap)/exit transitions stated | GAP (intended) — nav conformance is **dogfood-only** by recorded decision; no mechanical check | MATCH — any step reachable in ≤2 interactions | traced |
| «optional-scaffold» (US3, P2) | MATCH — AddendumScaffold + SCAFFOLDED marker + guards | MATCH — install.sh deploys templates/; plugin.json packages templates/ + 10 agents | MATCH — dedicated confirm → `#### On accept` single write | MATCH — C5/C5b/C6/C7 green (delivery both channels, write-idiom locality) | MATCH — user leaves setup with a real file (opt-in) | traced |
| «cite-not-restate» (US4, P3) | MATCH — CanonicalPointer per step | MATCH — Cites: lines resolve incl. DECISION-PRIMITIVE.md (PR#5 merged) | MATCH — S3/S4 summarize + link canon | MATCH — C3 (per-step cardinality) + C4 (no restatement) green | MATCH — tutorial cannot drift from canon | traced |

## DRIFT (spec says X, code implies Y — blocks acceptance)

- **(none)** — zero transformation drift. The implementation conforms to spec intent
  on every cell; the mechanical suite is the objective witness.

## SURPRISE (code reveals something the spec didn't account for)

- «subagent-cwd-defaults-to-main» — *process, not spec*: a Phase-0 `Explore` read the
  main checkout instead of the worktree. No spec implication; recorded so the next
  walk/gate passes absolute worktree paths to subagents.

## GAP (intent needs something that doesn't exist yet — the build/obligation list)

- «first-newcomer-record» (SC-010) — no real external-newcomer `chorus learn` session
  is recorded in the gate ledger yet. This is a **post-merge obligation within 30
  days**, already tracked in `agent-sdlc-log.md` (and the day-30 owner is named per
  GOLD-6). The validated-learning loop is OPEN until that row exists. ⚠ scoped: this
  is an evidence gap, not a missing-code gap — it cannot be closed pre-merge.
- «nav-dogfood-only» (US2 observability) — navigation labels/ordering have no
  mechanical check by **recorded operator decision** (dogfood-only); proven at the
  Gate C walkthrough, not by C1–C7. ⚠ intended, not a defect.

**GAP count: 2** (both intended/forward — neither is a pre-merge build item).

## Advisory verdict: **CLEAN**

Every US traces cleanly; zero open DRIFT. The two GAPs are a forward obligation
(SC-010) and an intended design decision (dogfood-only nav), both recorded. No author
present, so this verdict is advisory and feeds Gate C as prior art.
