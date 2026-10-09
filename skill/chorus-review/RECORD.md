# The round record: page order and failure modes

Reference for `chorus-review` Phase 5. The naming rule and "commit both" live in
`SKILL.md` § Artifact; this file holds the rendered page's order.

## Rendered page order

After the header, the bindings: which provider served each port, and every
retry, fallback and abstention by failure. Then:

1. **TL;DR** — 3 sentences: what the chorus found, what the top five
   prioritizes, and which 🔴 findings block public rollout (tracked as a unit
   even when outside the top five).
2. **Roster (this round)** — joiners, seating, abstainers with reasons.
3. **Findings register.**
4. **Consolidation matrix** — with the tally columns.
5. **Conflicts** — `Cn` entries.
6. **Top five.**
7. **Held findings and minority reports** — open `NEED_INFO` with reasons; one-voter findings, uncounted.
8. **Next-chorus baseline** — what the next round should assume closed or
   in progress vs re-evaluate.

Appendix: each lens's report, or links to it (file or memory-dir path).

## Failure modes

| Symptom | Fix |
|---|---|
| Findings dominated by legacy code | Scope exclusions in every brief (rows 9–10) |
| All personas join every round | Tighten the round context: concrete deltas only |
| Phase 2 takes longer than Phase 1 | Tighter numbered questions; own finding IDs listed explicitly |
| Project-fact inference every round | Phase 5 offers to write `CHORUS-PROJECT.md` |
| Artifact cites `Fn`/`Cn` with no description | Register (with pull-quotes) precedes the matrix; top five resolves to pull-quotes |
