# Changelog

## 2.2.0 — 2026-11-06

- **Process constants ship.** `chorus-core/PROCESS-CONSTANTS.md` (advisory): what
  stays fixed as tools change (`PC1–PC9`), the practices that rest on it, and the
  forms tuned to a falling cost. Indexed in chorus-core SKILL.md; ROSTER.md says
  every lens may cite it. Cut and reworded per both chorus rounds of 2026-11-06.
- **FC8** checks that each PC id is defined once, in its home, and that every
  citation in `skill/` or `agents/` resolves.
- **Citing a constant.** The round brief (chorus-review BRIEFS.md item 8) and I8
  mark a cited constant as advisory, resolved by its PC id, with a note of where
  the lens looked for contradicting code. A principle tag now renders its refs.
- **`goal_reached`** on every review record (required) and lifecycle ledger:
  open, oracle_verified or operator_ruled. The conductor only ever writes open;
  the round signs its advice, not the result (I9). Rendered under the TL;DR.
- **Declared oracles.** The project addendum may declare oracles, each with what
  it covers and does not cover (CONDUCTOR.md § Contract: declared oracles;
  addendum item 8).
- **Conductor fixes.** A conflict the record could not carry as a decision is
  refused when answered, not at record. A seat override is labelled as one. The
  ledger's memory heading no longer says "sign-off".

Run logs started by 2.1.0 replay only under 2.1.0. Review records written before
2.2.0 have no `goal_reached` and no longer validate; they are never rewritten.

## 2.1.0 — 2026-11-06

- **Operator seat override.** `conduct init review --seat a,b` rules lenses into a
  seat; each named lens that joined takes the place of the lowest-sorted seated lens
  not itself named, and the seating decision records each swap
  (DECISION-PRIMITIVE.md § Seating, `seat_override` in the run header).
- **The chorus signs its advice, not the result** (I9). A review round's sign-off is
  the chorus signing what it advises; the result is signable only with an oracle the
  lenses can call.
- **A process constant may be a finding's principle** while no project code
  contradicts it; where code does, which overrules the other is its own question
  (chorus-review BRIEFS.md item 8).

Run logs started by 2.0.0 replay only under 2.0.0.

## 2.0.0 — 2026-10-29

Breaking: `conduct.mjs` exit codes changed, the `coryphaeus` skill is folded into
`chorus-core`, and Node 20 is required.

- **The conductor is a program.** `chorus-core/bin/conduct.mjs` runs every round
  and gate from an append-only run log (`<stem>.run.json`). For the mechanical
  rules (seat cap, quorum, retries, ballots, routing, the vote count, the cycle
  bound) the code is the authority; the canon says what each rule is for, and
  `canon-drift.test.mjs` fails when prose restates a value the engine does not hold.
- **One exit code per meaning**, from the vocabulary registry: 0 ok, 1 refused,
  2 usage, 3 version mismatch, 4 not asked, 5 unreadable log, 6 not finished,
  7 bad init, 8 engine mismatch. Every refusal names the exact command to run
  next, and each ask in `conduct next` carries its command.
- **Run logs are versioned.** `init` stamps the chorus-core version; a log is
  replayed only by the version that started it.
- **The round, as the canon describes it.** The exploratory interview is a step
  of its own; findings at the same locator are grouped (`co_authors`); held
  findings are revised in one dispatch and re-voted on one ballot; an
  unresolved conflict becomes an open decision (catalog row 15).
- **Rules live in the engine.** S11 routing, revision, the S10 gate wait, the
  post-evidence quorum check and the failure rule (`unseat`) are pure engine
  functions with unit tests; the sequencer (`replayGate`) only orders phases and
  never edits engine output. A joiner the seat cap left out is marked `capped`.
  Self-audit rows and gate names are keyed by name; the speckit skills a
  lifecycle may run are a registry list.
- **`coryphaeus` folded into `chorus-core`** (schema, validator, renderer,
  provider bindings in `BINDINGS.md` and `bin/bindings.mjs`).
- **Installer.** Refuses Node below 20; recognises copies from before the
  manifest by their git history; exits 1 listing every shipped file left as it
  was; warns about a still-installed retired skill and never removes it; no
  longer installs `test/` or `examples/`; prints the installed version.
- **CI** validates committed run logs as run logs, and fetches full history for
  the install round trip.

Upgrade: `git pull && ./install.sh`. If it exits 1, it lists each file it left
alone and how to replace it. Downgrade: check out the older commit and re-run
`./install.sh`.
