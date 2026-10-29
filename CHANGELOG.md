# Changelog

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
