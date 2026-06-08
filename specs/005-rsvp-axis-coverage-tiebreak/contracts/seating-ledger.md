# Contract: Seating ledger section (capped gates)

Extends the existing RSVP/seating section of the per-feature ledger
(`specs/<feature>/agent-sdlc-log.md`; round mode: the round artifact). Plain Markdown,
hand-replayable (FR-013 / SC-005).

## Required content for a capped gate

1. **RSVP table** — one row per joiner: `Lens | Decision | Relevance | Primary axes |
   Reason`. (The `Primary axes` column is the FR-016 addition.)
2. **Rarity ranking** (only when the rarity sub-rule was applied): `axis → champion
   count`, ascending, with the chosen rarest axis marked.
3. **Seating line** — the seated 5 and the dropped joiners (as today), each seated lens
   tagged with its **provenance**: relevance-settled / coverage-decided / rarity-decided
   / operator-decided.
4. **Operator prompt** (only if step 5 fired) — the exact residual choice surfaced and
   the operator's pick.

## Example (schematic)

```text
### RSVP & seating (Gate A, capped at 5)
| Lens | Decision | Relevance | Primary axes | Reason |
| ...  | JOIN     | 3         | [Arch]       | ...    |
...
Rarity (applied): Sec(1) < Dom(1) < ... < Craft(2)   # ascending champion count
Seated (5): Richards [relevance-settled], Security [rarity-decided: Sec rarest], ...
Dropped: Norman, Uncle Bob, ...
Operator prompt: none (cascade decisive).            # or: "<lens A> vs <lens B> on axis <X>" → chose <A>
```

## Acceptance checks

- A reviewer reconstructs the panel from the row data + rarity ranking alone (SC-005).
- Every seat carries exactly one provenance tag.
- If `Operator prompt: none`, no seat is tagged `operator-decided`, and vice-versa.
