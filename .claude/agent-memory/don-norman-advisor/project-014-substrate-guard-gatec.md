---
name: project-014-substrate-guard-gatec
description: Feature 014 chorus-suite decomposition — Gate-C verify of sibling-side chorus-core substrate guard message content (Norman F5/F19/GB2 follow-up)
metadata:
  type: project
---

Feature 014 decomposes the chorus suite into chorus-core (shared substrate) + two sibling skills (chorus-review, chorus-sdlc) that compose it by name. Skill loader does NOT enforce `REQUIRED:` markers, so each sibling must self-assert chorus-core reachability and fail loudly with an operator-actionable message.

**Gate-C verdict: CLEARED.** My Gate-A 🔴 F5/F19 + Gate-B GB2 (message must be operator-actionable, not just "fail loudly") landed in BOTH siblings.

The built text (chorus-review/SKILL.md:30-36, chorus-sdlc/SKILL.md:37-43) names chorus-core as missing, states it means "a broken or partial install of the chorus suite", and gives the two-branch recovery: re-install (`./install.sh`) OR check chorus-core was published/copied under its expected name, then retry. Closes the gulf of evaluation — operator does not have to guess.

The "fail loudly" phrase survives at :26-27 / :33-34 but only as the DECISION (stop, don't degrade silently); it is immediately followed by "Emit:" + the actionable block. So "fail loudly" did not degrade into the message — it gates it. Correct.

**Why:** the operator who hits this is mid-review with a broken install; a bare "fail loudly" would be a terminal state with no recovery path (Norman error-design: a mistake the user can't tell from a slip).
**How to apply:** if 014 message text is touched again, keep the three required content elements co-located: (1) names chorus-core missing, (2) "broken/partial install" meaning, (3) two-branch recovery. Watch for drift between the two siblings — they are currently character-identical except skill-name + downstream-noun.

Residual (not a Gate-C blocker, noted for any future contract test): the guard is prose instruction to the calling session, not a runtime assertion — there is no behavioural test pinning that the message actually emits on a missing-core path. Unasserted behaviour. See [[feedback-recovery-not-user-job]] tension: here loud-fail IS correct because no monitoring layer exists between operator and broken install.
