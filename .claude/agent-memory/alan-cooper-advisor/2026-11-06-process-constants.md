---
name: 2026-11-06-process-constants
description: Cooper-lens understanding record for the 2026-11-06 round on docs/process-constants.md (C1-C9 note, commit a6bf3af) and where it should live. Locators only.
metadata:
  type: project
---

# Understanding record: docs/process-constants.md (Cooper lens), explored 2026-11-06

Worktree: chorus `.claude/worktrees/process-constants`, commit a6bf3af. Prior: [[understanding-2026-10-29-pr47]].

## Gate: who is the user and how many (REFERENCED, but split)

- Suite audience: published plugin, strangers, one maintainer — `docs/reviews/CHORUS-PROJECT.md` § Product (:100-104, confirmed 2026-09-27 / 2026-10-29). Re-read today.
- Who reads what: calling agent reads conduct output; operator sees questions + final record (CHORUS-PROJECT.md :109-111).
- The NOTE's reader is not settled. Its header names "lenses, the conductor and the operator" (process-constants.md:3-5). Agents read it only if canon/persona cites it; the stranger-operator never meets docs/ (install ships skill/ + agents/). As a doc it has N=1 reader in practice: the maintainer. [inferred]

## Referenced

- Nothing cites the note (grep of skill/, agents/, README, constitution: no hits).
- C1 point already in canon: CONDUCTOR.md:32-34 (EWD 340, "user's attention ... scarcest"). Note overlaps, does not cite it.
- Constitution I "One Canonical Definition — cite, never restate" (constitution.md:69-76) governs any move into canon.
- Ruling-lookup / consult-before-raising already implement "nothing asked twice" (CONDUCTOR.md:277-286, BINDINGS.md problem-brief).
- Implication 3 (each lens names a constant or applies the 10x test) would add a per-finding citation to every lens's output — a cost borne by the operator reading the record (process-constants.md, "What this means for chorus").
- Implication 2: the operator closes validation (C8, C3); record must name the person.

## Inferred

- Implication 4 (recurring findings = problems with an owner + KEDB) is the one implication with direct operator value; no canon mechanism today carries findings across rounds except agent memory.
- The derivatives table makes claims (story points, line-by-line review, test pyramid) that land on Beck / test-strategy / ops lenses; not mine.

## Open gaps

- Q1 [gate, project-wide]: who is the intended reader — maintainer only (stays a doc), lenses (persona/ROSTER cite), or the stranger-operator (must ship via skill/)?
- Q2 [lens-specific]: is implication 3 a rule (every finding cites a constant) or an option lenses may use?
- Q3 [project-wide]: is cross-round recurrence tracking (implication 4) wanted as a mechanism, or only as advice?
