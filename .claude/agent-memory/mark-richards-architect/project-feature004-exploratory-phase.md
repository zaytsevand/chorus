---
name: feature004-exploratory-phase
description: Gate A architecture findings on chorus feature 004 (advisor exploratory phase) — two-tier memory, fitness-function gap
metadata:
  type: project
---

Feature 004 "advisor exploratory phase" adds a pre-findings exploration step to the chorus skill: two-tier memory (operator-owned addendum `docs/reviews/CHORUS-PROJECT.md` "Project understanding" section as project base + thin per-advisor `understanding-<scope>.md` records that REFERENCE not copy the base). Markdown/prompt design, no runtime code.

**Why:** removes the cold-read; lets findings trace to a persistent per-lens understanding record (SC-001).

**How to apply (architecture lens for future gates on this feature):**
- Central unresolved tension is **prose SCs vs executable fitness functions**. The design names three grep-able invariants (every advisor has a profile; no project-wide fact duplicated across lens records SC-008; write-backs operator-accepted) but ships them as prose. I PRIORITIZED "add a fitness function for SC-008" as the Gate A 🔴. Watch whether Gate B/tasks add an actual CI/structural check.
- Staleness model (D5) only fingerprints *repo source* drift, not *addendum entry* supersession — records can go silently stale when operator supersedes a fact. Asymmetric afferent coupling.
- freshness fingerprint is under-specified: "mtime / commit marker / digest" collapsed into one "or"; only a section-scoped content digest is sound. False-fresh is the dangerous failure mode.
- feature/NNN delta records have no retirement/pruning rule — unbounded accretion across an SDLC lifecycle.
- Phase/Extract boundary (D8) is clean: Extract's file:line anchors remain authoritative for the I8 evidence gate, exploration only *feeds* it. Confirmed against GATE-PRIMITIVE.md:42-44.
