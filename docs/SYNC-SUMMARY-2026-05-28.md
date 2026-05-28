# Chorus-review sync 2026-05-28 — one-page summary

Synced from `~/.claude/` back into the repo: 2 skill files + 7 persona agents
(872 insertions / 77 deletions across 9 files).

## Structural change (the only methodology shift)

**Discipline cascade + evidence gate.** `INTEGRATION-LAYER.md` gains a new
"discipline cascade" framing (EWD 340-style hierarchical abstraction:
integration → brief → persona → artefact → invariant) and a new invariant
**I8** that enforces every finding cite either `file:line`, a
`[principle]` / `[principle:proposed]` tag, or `[unsupported]`, with a
re-dispatch policy. `SKILL.md` adds the matching machinery:

- Section 7 "Anchor-discovery procedure" — anchors built dynamically (arch
  doc head-scan, spec head-scan, memory recall, spec-slug grep) rather than
  statically listed.
- Phase 1 brief item 4 rewrite — "why-why-why" mantra: chase artefacts until
  an invariant or dead end; specs are starting points, not endpoints.
- New section 5 "Prior position to challenge" + the `file:line` evidence rule.

This is the only change that affects how the chorus *runs*. Everything below
is metadata + tailoring.

## Persona-agent changes (recurring patterns)

| File | Change pattern |
|---|---|
| alan-cooper-advisor.md | `memory: user` frontmatter; book subtitle expansion; scope-exclusion ("not Guido's/Bjarne's"); memory section rewrite |
| delivery-and-ops-advisor.md | `memory: user`; retuned for "small-team startup" / Hetzner / crawler; new "Scope and Anchor Files" with concrete LinkedInTools anchors |
| don-norman-advisor.md | `memory: user`; example references spec `020-startup-logging`; scope-exclusion line |
| eric-evans-advisor.md | `memory: project`; examples reworked (`JobApplicationService`, `ClientInstallation`/`Heartbeat`); large memory-system template; "NOT real Evans" disclaimer dropped |
| kent-beck-persona.md | `memory: user`; scope example rewritten as `app/` vs `webapp/`; large memory-system template |
| mark-richards-architect.md | `memory: user`; "NOT real Richards" disclaimer dropped; LinkedInTools Constitution X/XI/XIII baked in; expanded Agent Memory section |
| uncle-bob-architect.md | `memory: user`; "NOT real Martin" disclaimer dropped; Constitution X/XI/XIII baked in; ORM-vs-REST layer rule; `db_config.get_db_connection()` legacy callout |

**Cross-cutting themes**

1. All 7 personas gain a `memory:` frontmatter key.
2. All 7 standardize on the same memory-system template.
3. Three personas (Evans, Richards, Uncle Bob) drop "I am NOT the real X" disclaimers.
4. Generic examples → LinkedInTools-specific examples across the board.
5. Project Constitution clauses (X API-first, XI no-side-effects, XIII TDD) baked into Richards, Uncle Bob, Beck.

## Follow-up scrub (2026-05-28, same session)

The synced content was authored against the **LinkedInTools** project and
carried project-specific bleed. The scrub pass:

1. **Preserved the removed content as excerpts** at
   [`excerpts/2026-05-28-linkedintools-bleed.md`](excerpts/2026-05-28-linkedintools-bleed.md).
   Nothing was lost — every quote, path, and example that came out of an
   agent file is reproduced verbatim with the rationale for removal.

2. **Promoted the three Constitution clauses to project-agnostic
   groundwork** at [`PRINCIPLES.md`](PRINCIPLES.md):

   | LinkedInTools clause | chorus-review groundwork |
   |---|---|
   | Constitution X (API-First) | **P1 — API-First** |
   | Constitution XI (No Side-Effects) | **P2 — No Side-Effects** |
   | Constitution XIII (TDD) | **P3 — Test-First** |

   Richards and Uncle Bob now reference P1/P2/P3 with relative links to
   `docs/PRINCIPLES.md` instead of project-numbered clauses. Project-
   specific layer rules ("models live only in `webapp/data/models.py`",
   "ORM in webapp, REST in linkedin_tools") were removed from the personas
   and delegated to each project's own `CHORUS-PROJECT.md` addendum.

3. **Replaced hardcoded memory paths with a single project-agnostic
   convention** — `~/.claude/agent-memory/<persona-name>/` — across all
   seven agents. The previous paths
   (`/home/az/.claude/projects/-home-az-code-masheraanna-LinkedInTools/…`,
   `/home/az/code/masheraanna/LinkedInTools/.claude/agent-memory/…`) are
   preserved in the excerpts file.

4. **Generalised project-specific examples** — `JobApplicationService`,
   `ClientInstallation`/`Heartbeat`, `app/` vs `webapp/`, Hetzner, spec
   `013`/`023`/`025`, `db_config.get_db_connection()` — to neutral
   placeholders or removed entirely. SKILL.md's `webapp/` examples were
   judged generic enough to keep as illustration.

5. **Updated the README** with a mermaid lifecycle diagram of the chorus
   workflow and a Principles section explaining how P1/P2/P3 are
   implemented across the phases.

**Verification.** `grep -E "(LinkedInTools|masheraanna|linkedin_tools|JobApplicationService|ClientInstallation|db_config|/home/az/\.claude|Constitution [IVX]+)" agents/*.md skill/chorus-review/*.md`
returns clean.

The **discipline-cascade + evidence-gate** changes in
`SKILL.md` / `INTEGRATION-LAYER.md` are kept unmodified — those are the
methodology shift this sync brought.
