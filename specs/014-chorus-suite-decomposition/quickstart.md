# Quickstart — Chorus Suite

## Install the suite

```bash
git clone <repo> chorus-review && cd chorus-review
./install.sh          # copies skill/chorus-core, skill/chorus-review, skill/chorus-sdlc
                      # → ~/.claude/skills/<name>/ ; persona agents → ~/.claude/agents/
```

`install.sh` iterates over `skill/*/` (no hardcoded single dir). It does not
migrate stale files from a prior single-skill install.

### Upgrading from the pre-suite single skill (REQUIRED manual step — Gate A F6 waiver)

The pre-split install put all six files in one dir. A copy-only re-install would
leave orphaned files (`SDLC-LAYER.md`, the three primitives, the old `SKILL.md`)
that **double-define the `I1–I9` catalog** in the live dir. Before re-installing the
suite, **delete the old skill dir**:

```bash
rm -rf ~/.claude/skills/chorus-review   # remove the pre-suite single-skill install
./install.sh                            # then install the suite fresh
```

This manual step is the operator-accepted mitigation for not adding installer
pruning (the chorus flagged the risk at Gate A; the operator waived the installer
fix in favor of this documented step).

## Use it

- **Project-state review**: say *"spawn the chorus"* → routes to `chorus-review`.
- **Lifecycle gating**: say *"run the agent-SDLC on feature 0NN"* → routes to
  `chorus-sdlc`.
- `chorus-core` is never invoked directly; the two siblings compose it by name.

## Verify integrity

```bash
scripts/check-suite-integrity.sh    # runs FC1 (invariant-resolution),
                                    # FC2 (no-fat-sibling-import), FC3 (manifest sync)
```

All three must exit 0. (Automated CI/Jest harness is a follow-up spec.)

## Configure findings → memory (optional seam)

In `docs/reviews/CHORUS-PROJECT.md`, fill the **findings→memory** section with
targets + policy. The callback that acts on it is not yet implemented (designed
seam only).

## Confirm behavior parity (maintainers)

Per-skill RED-GREEN pressure scenarios under `tests/parity/` demonstrate that
review and lifecycle execute the same procedure post-split as pre-split.
