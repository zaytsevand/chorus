---
name: chorus-suite-decomposition
description: Arch review of the chorus single-skill→suite split design (2026-06-20); the S1-S7→I1-I8 coupling that breaks the no-fat-sibling claim
metadata:
  type: project
---

Reviewed `docs/superpowers/specs/2026-06-20-chorus-suite-decomposition-design.md` — splitting one `chorus` skill into `chorus-core` (3 primitives + new CONDUCTOR.md from INTEGRATION-LAYER) + thin `chorus-review` + `chorus-sdlc`, each composing core by name.

**Why:** evolvability/discovery/per-invocation-load wins; design's load-bearing claim is "anti-drift preserved by construction, single-source invariants, chorus-sdlc has NO dependency on chorus-review."

**How to apply / the central finding (runtime-grounded):** the no-fat-sibling claim is FALSE as designed. `SDLC-LAYER.md:182` says "These extend I1–I9" and S1/S2/S4/S6 carry explicit "(Extends I1/I2/I7/I8.)" clauses (SDLC-LAYER.md:186/188/197/202). I1–I8 are REVIEW-SPECIFIC and live in INTEGRATION-LAYER.md:328-353. Design moves ONLY I9 to core/CONDUCTOR. So post-split chorus-sdlc dangling-references I1,I2,I7,I8 inside the fat sibling. Fix routes: (a) move the I-invariant *catalog* to core too, or (b) reframe S-invariants as standalone (drop "extends" or have them extend core-resident gate/decision invariants). This is the operator decision to route. Fork A's seam is real but cut one concept short.

Other verified: plugin.json ALREADY stale ("Seven persona advisors", 7 agents, missing Goldratt+Security) — live drift evidence, supports a packaging fitness function. install.sh:36 does hardcode single `cp` of one skill dir (design's loop claim correct). `specs/007-chorus-learn-onboarding/` EXISTS but design line 154 says LEARN.md "not present in repo source" — minor staleness. Published-name `chorus` (env) vs `chorus-review` (frontmatter+plugin.json) reconciliation flagged by design as explicit task — good.

Confidence: split is YES-WITH-CHANGES, earning its complexity (3 primitives are genuinely shared substrate, cohesive). YAGNI verdict: build-now scope sound; 3 reserved future skills are cheap doc-only seams (fine); findings→memory callback config is the one speculative piece to question at this scale.
