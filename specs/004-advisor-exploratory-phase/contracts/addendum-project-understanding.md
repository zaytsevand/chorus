# Contract: Addendum "Project understanding" section

A new section added to `docs/reviews/CHORUS-PROJECT.md` (and to
`templates/CHORUS-PROJECT.template.md` so new projects start with the slot).
Holds operator-confirmed, project-wide facts the lenses need. Operator-owned, and
the **authoritative system of record** for these facts — a deliberately limited
surface advisors are not forced to read each round; per-advisor records may cache
from it but reconcile back to it (FR-023).

## Format

```markdown
## 7. Project understanding

> Operator-confirmed, project-wide facts gathered by the advisor exploratory
> phase. Each entry was accepted by the operator. Advisors reference this section
> rather than re-asking. Edit freely; advisors propose additions, you accept them.

### Architecture
- Ranked architectural characteristics: <…>  [accepted <date>]
- Architecture style (as built): <…>

### Product
- Real users yet?: <yes/no/…>  · Primary user & goal: <…>

### Security
- Trust boundaries: <…>

### Delivery
- Release path (commit → prod): <…>  · Rollback: <…>

### Domain
- Core domain / ubiquitous-language pointers: <… or → reference>

<add topic groups as lenses confirm facts; keep one line per fact, reference
longer material elsewhere>
```

## Rules

- **Operator-accepted only**: the orchestrator drafts proposed additions from the
  batched interview; an addition lands only after the operator accepts it
  (FR-017). This is the **only** write-direction into this section.
- **Authoritative; caches reconcile here**: this section is the single
  authoritative home for project-wide facts. A per-advisor record may **cache** a
  fact for read-locality, but each cached copy carries a reconciliation locator +
  freshness marker back here and **yields to this section on conflict** (FR-023).
- **Project-wide only**: lens-specific or feature-scoped facts do not go here —
  they stay in per-advisor records (`scope: lens-specific`).
- **One fact, one line**; longer material is referenced, not pasted
  (reference-not-duplicate).
- **Supersede, don't accrete contradictions**: a changed fact replaces the prior
  line (with the new accepted date).
- Topic groups grow as needed; absence of a group = not yet gathered (an open
  gap, surfaced — not silently "n/a").
