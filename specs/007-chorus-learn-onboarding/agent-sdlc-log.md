# Agent-SDLC ledger — feature 007 `chorus learn`

Audit trail for the gated lifecycle of `specs/007-chorus-learn-onboarding`. Schema:
`specs/003-agent-sdlc-workflow/contracts/sdlc-ledger.md`; decision records:
`DECISION-PRIMITIVE.md`.

---

## Gate A — design review (2026-06-12) — **CLEAR**

**Corpus**: `specs/007-chorus-learn-onboarding/{spec,plan,research,data-model,quickstart}.md`
+ `contracts/{learn-mode,navigation,scaffold}.md`, with the touched surfaces
(`skill/chorus-review/SKILL.md`, `install.sh`, `plugin.json`,
`templates/CHORUS-PROJECT.template.md`, `README.md`, `agents/`). No project addendum
exists (`docs/reviews/CHORUS-PROJECT.md` absent — recorded honestly; project-wide
facts come from the spec or the operator interview).

### RSVP (self-declared relevance 0–3; all replies are real dispatches)

| Lens | Decision | Rel. | One-line |
|---|---|---:|---|
| Cooper | JOIN | 3 | tutorial is interaction design end-to-end; my gate question is the spec's subject |
| Norman | JOIN | 3 | pure HCD surface: navigation contract, feedback, resume disclosure |
| Beck | JOIN | 3 | the contracts + C1–C7+C5b are this feature's only test surface |
| Goldratt | JOIN | 3 | cut seat; FR batch vs zero newcomers served — scope/defer terrain |
| Evans | JOIN | 2 | registration + three seam contracts are Published-Language surfaces |
| Richards | JOIN | 2 | coupling and conformance direction |
| Uncle Bob | JOIN | 2 | boundary/contract questions; structural conformance checks |
| D&Ops | JOIN | 2 | release-path surface (install.sh / plugin channel) |
| Security | JOIN | 1 | thin but real: sole-write invariant + consent gate |
| Guido | ABSTAIN | 0 | no Python in scope |

### Seating — DecisionRecord `gateA-seating`

- J = 9 → top 5 by mechanical relevance sort. Four seats at relevance 3 (Cooper,
  Norman, Beck, Goldratt — mandate guardrail satisfied: the scope/deferral lens is
  not out-seated on a new buildout, S3). **Tie at the 5th seat** (Evans / Richards /
  Uncle Bob / D&Ops, all 2) → **surfaced to the operator** (S3 / I9); operator seated
  **Evans**.
- band: 🟢 mechanical sort + 🔴 operator tie-break (owner: operator; recorded).

### Exploratory phase + operator interview (gates first — S10)

Each seated lens named its `[gate]` info-needs before authoring. Two held the gate
open until the operator answered (S10 fired pre-authoring — no inference past an
unmet gate):

| # | Question (owner lens) | Operator answer | Effect |
|---|---|---|---|
| 1 | Audience + count (Cooper gate) | **External/public** via README/plugin; cold-start framing and FR-015/C5b delivery scope correctly priced | Cooper + Goldratt grade at the external-newcomer bar |
| 2 | Core Domain (Evans gate) | **Canon = Core** (tutorial Supporting, deployment Generic) | Evans' modeling-effort pricing anchored |
| 3 | Navigation-contract enforcement (Beck) | **Dogfood-only is intended** — no mechanical nav check | nav conformance rests on the Gate C walkthrough by design |

Open gaps carried with stated defaults (degradation note): Goldratt — cost-of-delay
unpriced (no deadline/inflow named), priced conditionally; Evans — template-staleness
authority (default: installed copy operative); PR #5 merge horizon unstated (R8
serializes 007 behind it) → recorded open operator item in `plan.md`.

### Author + vote + tally

Stage 1: 33 extract records (one Explore agent; one record orchestrator-corrected
against the live `agents/` listing — the 2026-06-12 goldratt rename). Stage 2: **25
findings** (4 🔴 / 14 🟡 / 7 🟢-accepts filed as findings) + 35 recorded accepts.
Stage 3: real votes, 4 non-author voters per finding (S8), several re-verified against
the live repo before voting. I8 evidence gate: **0 demoted**. Stage 4 (symmetric tally,
arithmetic only — S9):

| ID | summary (short) | prop | P | O | A | net | post | gating |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| COOP-1 | contract names renamed-away agent file | 🔴 | 4 | 0 | 0 | +4 | 🔴 | ✅ |
| COOP-2 | C5b blind to phantom plugin.json entries | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| COOP-3 | claimed C5b description assert doesn't exist | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| COOP-4 | nav labels lack mechanical floor [challenges recorded decision] | 🟡 | 0 | 4 | 0 | −4 | 🟢↓ | — |
| COOP-5 | FR-013 third staleness surface unchecked | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| COOP-6 | C3 granularity recorded accept | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| NORM-1 | S2 cites install.sh — unresolvable on either install channel | 🔴 | 4 | 0 | 0 | +4 | 🔴 | ✅ |
| NORM-2 | stale roster enumeration teaches a dead name | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| NORM-3 | nav labels unasserted [challenges recorded decision] | 🟡 | 0 | 4 | 0 | −4 | 🟢↓ | — |
| NORM-4 | cite-failure honesty (accept) | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| NORM-5 | reds resolved (accept) | 🟢 | 3 | 0 | 1 | +3 | 🟡↑ | — |
| NORM-6 | accepts landed (accept) | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| BECK-1 | C5b one-directional | 🔴 | 3 | 1 | 0 | +2 | 🔴 | ✅ |
| BECK-2 | per-step cite cardinality unasserted (C3 global floor) | 🟡 | 3 | 1 | 0 | +2 | 🔴↑ | ✅ |
| BECK-3 | failure-signal polarity inconsistent across suite | 🟡 | 3 | 1 | 0 | +2 | 🔴↑ | ✅ |
| BECK-4 | C6 locality eyeball-judged | 🟡 | 2 | 1 | 1 | +1 | 🟡 | — |
| BECK-5 | roster restated by name — cite-not-restate self-violation | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| BECK-6 | dogfood residue recorded (accept) | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |
| GOLD-1 | PR #5 merge horizon unnamed | 🟡 | 1 | 1 | 2 | 0 | 🟡 | — |
| GOLD-2 | verdict-closer unnamed; SCs satisfiable by self-dogfood | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| GOLD-3 | dead path ships if implemented as written | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| GOLD-4 | cost of delay unpriced [principle-only] | 🟡 | 0 | 2 | 2 | −2 | 🟢↓ | — |
| GOLD-5 | implement is the constraint-shortening move (accept) | 🟢 | 2 | 0 | 2 | +2 | 🟡↑ | — |
| EVAN-1 | named edit surface enumerates nonexistent file | 🔴 | 4 | 0 | 0 | +4 | 🔴 | ✅ |
| EVAN-2 | C5b blind to phantom entries | 🟡 | 4 | 0 | 0 | +4 | 🔴↑ | ✅ |
| EVAN-3 | C1 "ANY phrasing" claim vs two-literal scan | 🟡 | 3 | 1 | 0 | +2 | 🔴↑ | ✅ |
| EVAN-4 | template staleness accepted w/ version-line mitigation | 🟢 | 4 | 0 | 0 | +4 | 🟡↑ | — |

**Verdict at author/vote/tally: 15 gating 🔴 in 5 clusters** (all spec/check-text
edits; no architectural rework):

| Cluster | Findings | Fix direction (spec-sourced) |
|---|---|---|
| A stale roster name | COOP-1 NORM-2 BECK-5 GOLD-3 EVAN-1 | refresh the 3 stale lines (research.md, plan.md, learn-mode.md) AND declare `agents/` the authoritative roster — enumerations derived, never restated |
| B C5b gaps | COOP-2 BECK-1 EVAN-2 COOP-3 | add the reverse direction (every plugin.json agent path resolves) + the description grep the contract already claims |
| C claim-vs-check | COOP-5 EVAN-3 BECK-2 BECK-3 | C1 gains the spec-refs surface and an honest phrasing-family scope; C3 asserts per-step cardinality; every stanza emits an explicit FAIL token |
| D S2 cite | NORM-1 | make the S2 `install.sh` cite channel-resolvable — the plugin newcomer must not cite-fail on a healthy install |
| E validation loop | GOLD-2 | add a ledger-recorded first-external-newcomer SC (the verdict-closer) |

Working-as-designed notes: the two challenges to the recorded dogfood-only decision
(COOP-4, NORM-3) were demoted 4-0 to 🟢 — the vote defended the operator's recorded
decision rather than re-arming it. GOLD-4 (principle-only, no corpus evidence)
demoted. S10 fired pre-authoring (two gates held the gate until the operator answered).

### Incorporation — DecisionRecord `gateA-incorporate` (band 🟡)

Clusters A–E resolved by revising the **spec** and regenerating downstream artefacts
via `/speckit-clarify` → `/speckit-plan` (S5 — no downstream hand-patch). Commits:

- `a7b53af` — 5 gate-sourced clarifications into spec 007 (FR-008/013/015 revised,
  SC-008/009 revised, SC-010 added).
- `b934dd6` — plan/research/data-model/quickstart/contracts regenerated from the
  revised spec.

Cluster outcomes: **A** `agents/` directory authoritative, no filename enumeration in
any artefact. **B** C5b bidirectional (every `agents/*.md` packaged AND every packaged
path resolves) + description grep. **C** C1 three surfaces + stated phrasing family +
spec normative-text scan; C3 per-step cardinality (awk); explicit FAIL tokens
suite-wide. **D** FR-008 revised, S2 `install.sh` cite annotated file-path-channel-only
in data-model. **E** SC-010 — a real external-newcomer session recorded in this ledger
within 30 days of merge. Non-gating folds: C6 mechanical locality (pinned `#### On
accept` heading); PR #5 merge horizon recorded as an open operator item in `plan.md`.

### Verification (post-incorporation re-grounding)

The seated scope/deferral lens (Goldratt) re-grounded against the regenerated corpus
and confirmed each cluster **resolved-by-reference** with `file:line`; the remaining
clusters' fixes are carried by the commits above:

| Cluster | Resolved | Evidence |
|---|:-:|---|
| A roster | ✅ | spec.md:441 (`agents/` authoritative, no restatement); contracts/learn-mode.md:18; research.md R11 |
| B C5b | ✅ | spec.md:444 (both directions); quickstart.md:174 |
| C claim-check parity | ✅ | spec.md:166-170 (explicit FAIL token per stanza); spec.md:393-395 (per-step cite cardinality); quickstart.md:155 |
| D cite channel | ✅ | spec.md:396 + spec.md:175-179; quickstart.md:142 |
| E verdict-closer | ✅ | spec.md:513-517 (SC-010: 30 days post-merge, one real external newcomer, channel + outcome in this ledger) |

The verification priced the incorporation as **holding the line**: zero new FRs, the
sole addition is the verdict-closer SC-010 (GOLD-7 🟢). One non-gating residue carried:

- **GOLD-6 🟡** — SC-010's day-30 expiry names no reader and no decision; the
  ledger-says-open clause prevents a silent *record*, not silent *inaction*. One-sentence
  post-merge fix (a named reader logs continue/extend/retire at day 30); **not** a design
  change, does **not** block Gate A.

### Gate A verdict: **CLEAR** (no open 🔴; one 🟡 carried)

All gating 🔴 resolved in the spec and verified resolved-by-reference; GOLD-6 🟡 and
GOLD-1 🟡 are non-gating and recorded for the operator. Gate A does not block (S4).

### S1–S10 self-audit

| # | Invariant | Pass | Evidence |
|---|---|:-:|---|
| S1 | orchestrator authored no artefact | ✅ | every spec/plan change traces to `a7b53af`/`b934dd6` via speckit runners |
| S2 | RSVP fired this gate | ✅ | RSVP table above (9 replies, real dispatches) |
| S3 | cap-5; tie surfaced to operator; scope lens not out-seated | ✅ | `gateA-seating` (Evans seated by operator; Goldratt seated under the mandate guardrail) |
| S4 | no 🔴 passed silently; none waived | ✅ | 15 gating 🔴 all resolved in-spec; verdict CLEAR |
| S5 | incorporation via speckit; no hand-patch | ✅ | `gateA-incorporate` (clarify → plan; commits) |
| S6 / I8 | every counted finding cites file:line or a principle tag | ✅ | I8 gate: 0 demoted |
| S7 | within loop bound | ✅ | single incorporation + verification; no escalation |
| S8 | author excluded from own finding's vote | ✅ | tally: 4 non-author voters per finding |
| S9 | severity is tally arithmetic, not synthesis | ✅ | post column = symmetric net rule, verbatim |
| S10 | gates named; unmet gates prompted, never inferred | ✅ | interview Q1/Q2 held Cooper + Evans gates until operator answered |
| I9 | every decision routed to a named owner | ✅ | seating tie → operator; verdict-closer → operator interview; severity → tally |

**Watch signal (recorded, not patched mid-gate — I7):** under the symmetric tally a
convergent agreement vote and an escalation vote are indistinguishable (PRIORITIZE =
"at least as severe as proposed"), so unanimous agreement lifts 🟡→🔴 and the 🟢-accepts
to 🟡 even when vote notes read as endorsements. Candidate canon fix for a future
round: a third vote value (CONFIRM = severity is right), or escalation requiring an
explicit "under-rated" claim. Successor to issue #6.

### Next-gate baseline (Gate B — plan/tasks)

Assume closed: clusters A–E (roster derivation, C5b bidirectional, claim-check parity +
FAIL tokens, channel-resolvable cites, SC-010). Re-evaluate at Gate B: GOLD-6 (SC-010
day-30 owner), GOLD-1 (PR #5 merge horizon), and whether `/speckit-tasks` preserves the
per-step C3 cardinality and the bidirectional C5b in the task breakdown.
