# Contract — the three fitness checks

Greppable, manually-runnable (e.g. `scripts/check-suite-integrity.sh`). The
automated harness (Jest/TS) that calls them is deferred to a follow-up spec
(FR-014/FR-019). Each check exits non-zero on violation and prints the offending
locators.

## FC1 — invariant-resolution (anti-drift guard)

- Scan every `skill/<suite>/` file for `I\d` / `S\d` / `D\d` tokens.
- For each token *reference*, assert its single definition is reachable via the
  skill's declared `REQUIRED:` composition (own dir or core).
- **Fail** if any token is defined in more than one file, or referenced by a skill
  whose composition cannot reach the definition.
- Cheapest concrete form: fail if any `I`-token appears in `chorus-sdlc` whose
  definition is not in `chorus-sdlc` or `chorus-core`. (Would fail the pre-fix
  design — its value.)
- **Residence clause (Gate A F4/F7, REQUIRED):** resolution alone is insufficient —
  FC1 MUST also fail if any `I` / `D` / `S8–S10` token is **defined** anywhere
  outside `chorus-core` (a sibling-local redefinition must not pass by resolving to
  itself). `S1–S7` are the sole tokens permitted to live outside core (in
  `chorus-sdlc`), and only as **references** to core's `I1–I9`.
- **Scope note (F6/F7):** FC1 runs on **repo source**, which has no stale files.
  Installed-dir drift (orphaned pre-split files double-defining `I1–I9`) is **out of
  FC1's scope** and is covered by the F6 waiver's manual upgrade step, not FC1.

## FC2 — no-fat-sibling-import

- Assert no file in `skill/chorus-review/` references a `skill/chorus-sdlc/`
  filename or path, and vice-versa.
- **Fail** on any cross-sibling reference. Encodes "nothing depends on a fat
  sibling."

## FC3 — packaging-manifest sync

- Assert `plugin.json`'s `skills[]` entries each exist on disk and every
  `skill/<dir>/` is listed.
- Assert `plugin.json`'s `agents[]` match `agents/*.md` on disk.
- Assert the manifest `description`'s advisor count matches the actual roster (nine
  lenses + optional Guido).
- **Fail** on any mismatch. (Would fail today — manifest claims a security agent it
  doesn't list and omits Goldratt/Guido.)
