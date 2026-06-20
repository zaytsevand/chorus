---
name: chorus-ubiquitous-language
description: The chorus's shared vocabulary (roster-as-bounded-context) and where terms drift, esp. after the 8→9 persona edit
metadata:
  type: project
---

`chorus-review` is a Claude Code skill/persona repo, not an app. Its domain model IS
the shared vocabulary the nine personas reason in. The Bounded Context is the roster:
`agents/*.md` (persona system-prompts), `skill/chorus-review/SKILL.md` (procedure +
roster list ~line 137), `skill/chorus-review/INTEGRATION-LAYER.md` (invariants I1–I8,
"discipline cascade"), `README.md` (Principles matrix ~line 127).

**Shared Published Language (terms every persona owns identically):** lens, persona,
finding, RSVP (JOIN/ABSTAIN), brief, evidence gate (I8), bedrock (Five-Whys terminus),
severity (🔴 when two lenses converge). These are well-governed — used the same way
across SKILL/INTEGRATION/README/agents.

**Persona anatomy is a Shared Kernel** (Central Thesis, Three Convictions, Accusations,
Five Whys→bedrock, "Relationship to Other Personas", memory block). Security and
Constraint-and-Flow conform to it. Each persona's bedrock is shaped identically: a
near-certain claim in that lens's vocabulary, with a contrasting "NOT: <shallow>" line.

**Feature 002 added the 9th persona** `constraint-and-flow-advisor` (Goldratt/Reinertsen/
Ries/Duke/Cagan-Torres). Its core terms: "the constraint", "validated-learning loop",
"congealed hypothesis", "cost of delay / CD3", throughput/inventory.

**Language watch (drift risk):**
- "the constraint" is overloaded. The new persona uses it as a domain term (the binding
  bottleneck, TOC sense). Beck's persona body and project-memory templates use
  "constraint" in the plain English sense (deadline/limit). Risk of a reader conflating
  them. Not yet a model defect — the new persona's sense is dominant and well-defined.
- YAGNI/opportunity-cost: Beck owns YAGNI (kent-beck-persona.md:27 empirical design),
  Cooper owns user-cost trade-offs. New persona explicitly defers to Beck on YAGNI and
  "prices" it (constraint-and-flow-advisor.md:76). Good Context Map — handoff is named.
- Cross-reference asymmetry: the 8 incumbent agent files were NOT edited to add a
  "Constraint-and-Flow" line to their Relationship sections. The new persona references
  all 8; none reference it back. One-directional Context Map edge.
