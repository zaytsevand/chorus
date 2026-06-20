---
name: contract-now-control-later-trap
description: When a write-surface contract ships before its enforcing filter, specify the filter as a deny-default behavioral obligation AND a hard precondition on the deferred work — never as prose
metadata:
  type: feedback
---

The "contract-now, control-later" trap: committing a write-surface contract (e.g. findings → durable memory, carrying verbatim pull-quotes) while deferring the secret/exfil filter that guards it lets the deferred implementer ship conforming-but-unsafe — the contract is honoured, the boundary is not.

**Why:** a contract names *what crosses the boundary*; the filter names *what the boundary enforces*. Ship the first without binding the second and the trust boundary exists on paper only. Prose like "should redact secrets" is not a control — it gets adopted, ignored, and found six months later in the README and never in CI.

**How to apply:** when a verbatim/untrusted excerpt reaches durable or egress storage and its filter is deferred, demand two things, both as obligations not nouns:
1. **Deny-default behavioral obligation** — excerpt is *dropped unless it passes*; default outcome on any uncertainty is drop, never write. Pin a **named detector class** (credential-shaped / high-entropy / known-key patterns) and an **audit line**, so "did we do a good job?" is checkable.
2. **Hard precondition on the deferred work** — the deferred callback/impl spec MUST carry "implements <filter-FR> (secret pre-filter)" as a gate, so conforming-yet-unfiltered cannot ship.

Re-groundable pattern instance: `skill/chorus-core/CONDUCTOR.md` "Secret pre-filter — enforced behavioral obligation (FR-010a, deny-default)" section (~line 360) and the findings→memory consuming-contract section above it (~line 332); `specs/014-chorus-suite-decomposition/spec.md` FR-010a/FR-010b. Related: [[project-spec095-gateb-humanize-ea-trust]] (process-global default-deny DROP chokepoint as the enforcement shape).
