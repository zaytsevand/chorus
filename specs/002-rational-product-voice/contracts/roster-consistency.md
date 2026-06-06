# Contract — Roster consistency (8 → 9)

FR-013 / SC-005 require every surface that counts or enumerates the personas to agree on the new total
(**nine**) and to name `constraint-and-flow-advisor`. This is the checklist `/speckit-tasks` turns into
edit tasks and the quickstart's consistency grep verifies.

## Surfaces and required edits

| # | File | Element today | Required after |
|---|------|---------------|----------------|
| 1 | `agents/constraint-and-flow-advisor.md` | absent | present (new persona file) |
| 2 | `skill/chorus-review/SKILL.md` — `description` | lists 8 personas by initial | adds the new advisor |
| 3 | `skill/chorus-review/SKILL.md` — Phase 0 Brief | "Default chorus roster is **eight**:" + 8-item list | "**nine**" + 9-item list incl. new advisor |
| 4 | `skill/chorus-review/INTEGRATION-LAYER.md` | "**Eight** lenses…" and "**eight-lens** composition" | "Nine" / "nine-lens" (both occurrences) |
| 5 | `README.md` — headline | "**Eight** persona advisors — …" + 8 names | "**Nine** …" + new name added |
| 6 | `README.md` — Install section | "the **eight** persona agents" | "the **nine** persona agents" |
| 7 | `README.md` — Principles matrix | 8 persona columns | + column **"Constraint-and-Flow reads it as"** with its read of each cross-cutting concern |
| 8 | `templates/CHORUS-PROJECT.template.md` | (verify) any default-roster/count reference | updated if present; else no-op (record "verified, none") |
| 9 | `install.sh` — L4 comment | "the **seven** persona agents" *(already stale at 8)* | "the **nine** persona agents" |
| 10 | `install.sh` — L38 echo | "Installing **seven** persona agents" | "Installing **nine** persona agents" |
| 11 | `uninstall.sh` — `AGENTS` array + L4 comment | **7 files hard-coded** (already missing the 8th, `security-and-trust-advisor.md`) | all **9** files listed incl. `constraint-and-flow-advisor.md`; "seven"→"nine" |

> ⚠️ **Gotcha for future persona additions**: `install.sh` globs `agents/*.md` (auto-discovers new
> personas), but `uninstall.sh` keeps a **hard-coded `AGENTS` array** that must be edited by hand every
> time. It silently drifted out of date once already (the 8th persona was never added). Always update it.

## Acceptance (SC-005 / SC-006)

- **Consistency**: no surface states "eight" or "seven" for the default roster after the change.
  Suggested check:
  ```bash
  grep -rniE '\b(seven|eight)\b' \
    skill/chorus-review/SKILL.md skill/chorus-review/INTEGRATION-LAYER.md \
    README.md install.sh templates/CHORUS-PROJECT.template.md
  # expect: no hits referring to the default persona roster count
  ```
- **Naming**: every enumerating surface (rows 2,3,5,7) names `constraint-and-flow-advisor`.
- **Additive-only (SC-006)**: every existing persona's entry survives verbatim except for the
  inserted ninth; no existing persona is removed, reordered out, or reworded.
- **Installable set**: after `./install.sh --force`, `~/.claude/agents/` contains 9 advisor files.
