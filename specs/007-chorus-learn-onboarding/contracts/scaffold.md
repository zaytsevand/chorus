# Contract: the opt-in addendum scaffold

**Feature**: 007-chorus-learn-onboarding | Binds: `LEARN.md` S2 sub-step, `install.sh`
(template deployment)

The tutorial's **only write**. Everything in this contract exists to keep that true
(FR-005/FR-007, SC-004).

## Deployment precondition (install.sh)

`install.sh` deploys the template with the skill:

```
cp templates/CHORUS-PROJECT.template.md  →  $SKILL_DST/templates/
```

Without this, the installed skill cannot reach the template from an arbitrary user
project (research.md R6 — today install.sh:36 ships only `skill/chorus-review/*.md`).
The installer's "Next:" prose is updated to mention that `chorus learn` can do the copy
interactively.

## The scaffold action (S2 sub-step)

| Step | Contract |
|---|---|
| Offer | after explaining the addendum (what sections 2/3/5 are for), S2 offers — via the navigation question or a dedicated confirm — "scaffold my addendum now?" |
| Confirm | the write happens **only** on explicit acceptance; any other answer writes nothing |
| Source | `<installed skill>/templates/CHORUS-PROJECT.template.md`; fallback to the repo checkout's `templates/` when running inside this repo |
| Target | `docs/reviews/CHORUS-PROJECT.md` (creating `docs/reviews/` if needed — part of the accepted write) |
| Content | the template verbatim, with sections **2 (scope exclusions), 3 (anchor surface), 5 (security data-surface)** flagged `<!-- TO FILL -->` (US3 scenario 1) |
| Wrap-up | the tutorial states what was created and which sections the user must fill before a first round |

## Guards (all three required)

1. **Opt-in**: explicit confirmation; decline ⇒ zero writes, tutorial proceeds (US3 sc. 2).
2. **No-overwrite**: target exists ⇒ the offer becomes "review/extend your existing
   addendum" (explanatory walk through its sections); the file is **never** overwritten
   (US3 sc. 3).
3. **In-repo**: outside a git work tree ⇒ the offer is suppressed entirely; the stage
   stays explanatory (edge case, SC-004).

## Failure honesty

If the template is missing at both source locations (e.g. pre-R6 install), the scaffold
states that plainly and falls back to citing the template's repo path — it does **not**
reconstruct the template from memory (that would be a restatement that can drift,
FR-008).
