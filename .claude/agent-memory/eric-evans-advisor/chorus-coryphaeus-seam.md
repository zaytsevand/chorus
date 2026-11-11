---
name: chorus-coryphaeus-seam
description: PR #32 (2026-09-27) split — chorus declares 7 ports, coryphaeus is the composite root owning schema/validator/renderer/bindings; Core Domain gate answer (inferred, unconfirmed)
metadata:
  type: project
---

As of 2026-09-27 (PR #32, branch suite-review/integration) the suite has two contexts:
- **chorus** (skill/chorus-core, chorus-review, chorus-sdlc, agents/): the review procedure. Declares
  seven ports in skill/chorus-core/CONDUCTOR.md § Ports and names no other skill.
- **coryphaeus** (/home/az/code/zaytsevand/coryphaeus): composite root. Owns JSON schemas (schema/),
  bin/validate.mjs, bin/render.mjs, port bindings, and the decision -> problem-brief translation rules.
  problem-brief is the default provider; chorus and brief stay ignorant of each other (operator ruling
  suite-review/R-1, Q-1, Q-12, Q-15 in docs/reviews/pr32/standing-rulings.md).

**Ownership split (cite, don't copy):** operator rulings live with the decision-sink provider (brief R-n);
vote arithmetic lives only in chorus records; records cite rulings via `ruling_ref {id, record}`.

**Gate (Core Domain) standing answer:** INFERRED, not operator-confirmed (2026-09-27). My reading: the
Core is the gate/decision primitive — self-selection, P/C/O vote arithmetic, severity — plus the
decision contract; packaging, install, rendering are Supporting/Generic. Re-ask the operator before
relying on it for a modeling finding.

**Language watch:** `decided`/`complete` status and severity enums are shared across decision.schema.json
and the brief's vocabulary; `record: "#"` is a placeholder writer value for ruling_ref.record in the
default (unbound) sink. Related: [[chorus-ubiquitous-language]], [[chorus-review-domain]].
