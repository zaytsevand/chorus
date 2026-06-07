# Contract: Per-Advisor Understanding Record (lens layer)

One per advisor, in the advisor's memory
(`~/.claude/agent-memory/<persona>/understanding-<scope>.md`). A thin layer over
the addendum — an **index of locators, never a finding's evidentiary endpoint**
(FR-021): findings re-ground in the live source. It may **cache** project-wide
facts for read-locality but reconciles them to the authoritative addendum
(FR-023).

## Format

```markdown
# Understanding — <persona> — <scope: project | feature/NNN>
Built: <date> · Base: docs/reviews/CHORUS-PROJECT.md

## Referenced  (sourced; not duplicated)
- <need> → <locator> [fresh: <fingerprint/date>]  ("<≤2-sentence quote if essential>")

## Inferred  (my analysis — provisional until confirmed)
- <need> → <one-line synthesis>  [provisional]

## Operator-confirmed
- <need> → <answer>  [confirmed <date>; scope: project-wide | lens-specific]

## Cached (from addendum — read-locality; reconciles to source)
- <need> → <fact>  → addendum:<locator> [fresh: <fingerprint/date>]

## Open gaps
- <need> → <why unresolved>  [blocks: <which findings if any>]
```

## Rules

- **Scope**: a `project`-scoped record holds the lens's references into the
  addendum + lens inferences/gaps; a `feature/NNN` record holds only deltas and
  references the project record (FR-014).
- **Referenced** entries carry a freshness marker; on reuse a changed fingerprint
  → re-validate (FR-012).
- **Inferred** entries are provisional; a finding resting on one is flagged
  (FR-011 / SC-006).
- **Operator-confirmed** facts carry a `scope`. `project-wide` facts are authored
  canonically in the **authoritative** addendum; a record may hold them only as a
  **cache** with a reconciliation locator (never their sole home). `lens-specific`
  facts live only here (SC-008 / FR-023).
- **Index, not endpoint**: no entry is a finding's evidentiary endpoint — a stored
  quote is a navigational hint; the finding re-grounds in the live source (FR-021).
- No duplication of a referenced source beyond a short quote (FR-004 / SC-002).
- On a later round, only delta-touched or stale entries are rebuilt (FR-010); a
  cached fact whose addendum fingerprint drifted is re-validated (FR-012).
- **Coverage**: every information-needs-profile item must appear here as
  referenced / inferred / operator-confirmed / open-gap — the profile-coverage
  fitness function checks this (FR-022 / SC-010).
