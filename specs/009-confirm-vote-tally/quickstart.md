# Quickstart & Conformance: CONFIRM Vote (spec 009)

Verification surface (Principle V) for the issue-#13 fix. Shows the defect under the
old tally and its correct behavior under the new three-valued tally, side by side.

## The rule (new)

Non-author votes are one of three **declared** values:

| Vote | Meaning | Counts toward `net`? | Counts toward convergence (ranking)? |
|------|---------|----------------------|--------------------------------------|
| `PRIORITIZE` | under-rated → escalate | **yes** (+1) | yes |
| `CONFIRM` | correctly rated → agree, hold | **no** | yes |
| `OVER-RATE` | over-rated → demote | **yes** (−1) | no |

`net = PRIORITIZE − OVER-RATE`. `net ≥ +2` escalate one level; `net ≤ −2` demote one
level; else hold. **Convergence count = PRIORITIZE + CONFIRM** (ranking only, never
escalation).

## Worked example — Gate C's inflated polish finding

A real shape from `specs/007-chorus-learn-onboarding/agent-sdlc-log.md`: an
**author-proposed 🟡 polish** finding that four non-author lenses agree is worth doing,
and whose own vote notes say "at correct severity." The scope lens (Goldratt) votes
"merge now."

### Under the OLD tally (two-valued) — the defect

Agreement could only be expressed as `PRIORITIZE` (= "at least as severe as proposed").
So four agreeing lenses each cast `PRIORITIZE`:

```
F (author 🟡):  P=4  O=0   net = 4 − 0 = +4   →  +4 ≥ +2  →  escalate 🟡→🔴  →  GATING
```

A polish nit becomes a merge blocker **by popularity**. Wrong — and exactly what #13 reported.

### Under the NEW tally (three-valued) — fixed

The same four lenses agree at the proposed severity, so they cast `CONFIRM` (not
`PRIORITIZE`):

```
F (author 🟡):  P=0  C=4  O=0   net = 0 − 0 = 0   →  |net| < 2  →  hold 🟡  (agreed-at-severity)
                convergence = P + C = 4            →  ranks highly in the top-5
```

The finding **holds at 🟡**, does not gate the merge, and still ranks because four lenses
care about it. Correct.

### Contrast cases (must still work)

```
Genuinely under-rated 🟡:   P=2  C=0  O=0   net = +2  →  escalate 🟡→🔴   (under-rated convergence preserved, SC-002)
Mixed agree + one escalate: P=1  C=2  O=0   net = +1  →  hold 🟡           (one under-rated claim isn't enough)
Clear over-rating (BECK-4): P=0  C=0  O=2   net = −2  →  demote one level  (demote side unchanged, SC-003)
```

## Conformance checklist

- [ ] **FR-001** — votes are three declared values; the orchestrator never infers which.
- [ ] **FR-002 / SC-003** — `net = P − O`, CONFIRM excluded; demote side byte-identical to before.
- [ ] **FR-003 / SC-004** — convergence count = P + C drives ranking; only P drives escalation;
      a held-🟡 finding can still rank top-5.
- [ ] **FR-004** — the "two converging lenses earn 🔴" rule is amended in README + GATE-PRIMITIVE.
- [ ] **FR-005** — Round-2 / SDLC dispatch asks the three-way question.
- [ ] **FR-006** — ledger vote-tally table has a distinct `CONFIRM` column.
- [ ] **FR-007** — constitution Principle III caveat dropped; TALLY_WART closed; v1.1.0.
- [ ] **FR-008** — S8/S9 intact: author never grades own finding; tally is arithmetic over real votes.
- [ ] **SC-001** — replaying the three #13 cases holds every correctly-rated 🟡 at 🟡 (0 inflations).
- [ ] **SC-002** — ≥2 PRIORITIZE with 0 OVER-RATE still escalates one level.
