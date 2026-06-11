# Contract: Decision catalog

The declared band + predicate per decision point (research R2/R7). The **load-bearing
artefact** — each row's band is a design-time human decision the Gate should adjudicate;
the orchestrator only follows it. An unlisted point defaults to 🔴 (FR-006).

| # | Decision point | Band | Predicate | Reversibility justification |
|---|----------------|:---:|-----------|-----------------------------|
| 1 | RSVP seating — clean two-axis sort | 🟢 | strict order at the cap boundary | mechanical; no judgment |
| 2 | RSVP seating — tie at the cap | 🟡 | non-strict at boundary | seating is reversible (re-run gate); low-stakes |
| 3 | Gate finding severity (tally) | 🟢 | deterministic stage-4 tally | arithmetic; already a sensor |
| 4 | Proceed past 🟡/🟢 findings | 🟢 | non-gating | no decision to make |
| 5 | Gating 🔴 finding | 🟡→🔴 | `cycle < 3` → 🟡 (auto-incorporate + re-run); `cycle == 3` or waiver-only → 🔴 | incorporation is spec-sourced & reversible (S5); the bound/waiver is irreducible |
| 6 | Exploratory gap — inferable from a cited artefact | 🟢 | a `[ref]` anchor exists | fact present; fill + proceed |
| 7 | Exploratory gap — needs operator knowledge, reversible | 🟡 | no `[ref]`, lens did not flag blocking | recorded assumption + degradation note; correctable async |
| 8 | Exploratory gap — load-bearing AND irreversible | 🔴 | a seated lens **flags** "blocks my finding" AND no safe default | the lens declares it; no default is safe |
| 9 | Phase 0 scope/exclusion — addendum present | 🟢 | addendum file exists | read it; deterministic |
| 10 | Phase 0 scope/exclusion — addendum absent | 🟡 | no addendum | infer defaults + proceed + async confirm; correctable |
| 11 | Final feature sign-off / 🔴 waiver | 🔴 | always | high-stakes judgment; irreducibly the operator's |

## Acceptance checks

- Every operator touchpoint in `SDLC-LAYER.md` / `INTEGRATION-LAYER.md` maps to a row
  here (or is 🔴 by the unclassified default).
- Each 🟡 row names a concrete override path (its DecisionRecord `override` field).
- No row's predicate requires orchestrator merit-judgment — only a mechanical test or a
  persona-declared flag (D1/D4).
- Rows 5, 8, 11 (the 🔴/🔴-escalating ones) never apply a default automatically (D2).
