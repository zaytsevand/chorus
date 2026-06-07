# Contract: Information-Needs Profile (per lens)

Lives in the agent file (`agents/<persona>.md`) as an
`## Information needs (exploratory phase)` section. Lens-authored. Seeded from
`information-needs-profiles.md`.

## Format

```markdown
## Information needs (exploratory phase)

<one-line statement of what this lens must understand before it can review>

1. <need> — [ref | infer | op] · <one clause why this lens can't review without it>
2. ...
N. ...

Most load-bearing: <the single need that, unmet, most undermines this lens>.
```

## Field rules

- **need**: concrete and distinctive to this lens — not "read the code".
- **source tag**: the *typical* source —
  - `ref` = usually found in a repo artefact to reference (name the kind),
  - `infer` = usually requires the advisor's own analysis,
  - `op` = usually requires an operator interview.
  A need may combine, but tag the dominant source.
- **why**: one clause tying the need to the lens's judgement.
- **Most load-bearing**: exactly one need named; this is the need the advisor
  refuses to proceed without (it escalates to analysis/interview if unmet).

## Coverage rule

Every participating advisor (nine personas + any opt-in language lens) has this
section (SC-005). The opt-in language lens may mark items that exist only because
it is a language lens.

## Fitness function (FR-022 / SC-010)

The profile is the **executable conformance check** for the phase: every item
here MUST resolve to an entry in the advisor's understanding record — tagged
`referenced` / `inferred` / `operator-confirmed` / `open-gap` — with **no silent
omission**. A profile item with no corresponding record entry is a detectable
**coverage failure**, not a matter of interpretation. This is what makes
SC-001/003/005/007/008 checkable rather than prose-only.
