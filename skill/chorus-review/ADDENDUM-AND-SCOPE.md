# Project addendum and scope exclusions

Reference for `chorus-review` Phase 0 and every persona brief. Read before Phase 0.

## Project addendum

Each project may provide `docs/reviews/CHORUS-PROJECT.md`, read before Phase 0:

1. **Project summary** — 2–3 sentences: topology, primary languages, where the
   constitutional / governance docs live.
2. **Default scope exclusions** — paths the chorus must not produce findings
   about (legacy, runtime data, generated code), each with a one-line reason.
3. **Default anchor surface** — the actively-developed paths to focus on.
4. **Constitutional / governance principles** (if any) — used by Phase 4's
   Constitutional ROI; if none, that dimension is skipped.
5. **Security data-surface checklist** — project-specific items (token storage,
   PII flows, key exposure, log redaction, callback validation), passed verbatim
   to Security-and-Trust.
6. **Baseline references** — prior chorus artifacts; the most recent is the
   primary baseline.
7. **Anchor-discovery procedure** — how the orchestrator builds each lens's
   anchor list per round: architecture doc first, spec head-scan
   (`head -n 20 specs/<NNN-slug>/spec.md`), memory recall, spec-slug grep
   (`rg "specs/0[0-9]+"`) followed code → spec → invariant. Item 3 is the static
   fallback when discovery yields nothing.

**Scope confirmation follows catalog rows 9–10 only.** Addendum present → 🟢:
use its exclusions and anchors, no ask. Addendum absent → 🟡: infer defaults
from `CLAUDE.md` / `AGENTS.md` / repo layout, record them, proceed, and confirm
asynchronously with the operator; an override applies from the next dispatch.

## Scope exclusions in every brief

Bake the exclusion list into every persona brief except Security-and-Trust's:

> **Out of scope for this review:** the following paths are legacy POC code,
> runtime data directories, or generated code the team is not investing in. Do
> not produce findings about them; redirect that energy to the active surface.
>
> [verbatim exclusion list with one-line justifications]
>
> The boundary between active code and these paths is in scope; their internals
> are not.

## Security-and-Trust lens (scope override)

Security joins via RSVP like every other persona, but the general exclusion list
does NOT apply to it: exfil risk does not care about tech-debt labels. Its brief
omits the verbatim list and states instead that **legacy paths are in scope when
they expose attacker surface**, the exclusion list applying only to non-security
concerns; pass the addendum's item 5 verbatim on top of its default anchors (auth
surfaces, trust boundaries, supply chain, secrets, egress, log redaction). Its
findings take the next `Fn` IDs under the same severity scheme and evidence rule
(I8). When it abstains, no separate security pass runs; the abstention is recorded.
