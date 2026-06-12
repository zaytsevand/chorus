# `chorus learn` — the guided onboarding tutorial

This file is the **single canonical definition** of the `chorus learn` mode
(trigger: "chorus learn" / `/chorus learn`). It is a mode of the chorus-review
skill — explanatory and navigational. It mutates nothing except one **opt-in**
scaffold the user explicitly confirms (S2). The orchestrator running this mode
delivers each step as a short explanation **plus** an AskUserQuestion navigation
choice — never a wall of text (FR-003).

> **Steps vs stages.** A tutorial unit here is a **step** (S1–S5). The word
> *stage* is reserved for the review canon's four-stage flow (extract → author →
> vote → tally) that step S3 teaches — S3 disambiguates the two explicitly
> (FR-012).

**Three modes.** The chorus has three modes: two *review* modes — the
project-state round ("spawn the chorus") and the agent-SDLC lifecycle ("run the
agent-SDLC on feature 0NN") — and this navigational tutorial. The two review
modes share the gate primitive; this tutorial teaches, it does not gate.

## How navigation works (read once, applies to every step)

Each step ends with **exactly one** navigation question of **four** options, in
this pinned order — labels and ordering are normative in
`specs/007-chorus-learn-onboarding/contracts/navigation.md`:

1. **Continue → <next step>** (recommended, first). At **S5** this is **"Finish
   the tutorial"**, which delivers the wrap-up (a declared convergence with Exit —
   both reach the wrap-up; Finish marks completion).
2. **Go deeper on <current topic>** — one expanded pass on this step; afterward
   this slot re-presents on **this step** as **"Recap this step"** (depth bounded
   at one level, per-step — a step whose own deeper pass has not happened never
   shows "Recap").
3. **Jump to another step** — fires the jump follow-up (the other steps by name;
   the chosen step is not replayed from the start).
4. **Exit the tutorial.** At **S1** the label is **"Exit — get the cheat-sheet"**,
   because the S1 exit wrap-up *is* the expert cheat-sheet — the fast exit rides
   this affordance and displaces nothing.

All four appear at every step, S1 included (FR-004). The tool's built-in "Other"
free-text needs no slot; an arbitrary ask is answered, then the question
re-presents. Navigation is single-select (never multiSelect).

**Resume.** The last step reached is tracked at **every** transition (explicit
exit or silent abandonment). Re-invoking "chorus learn" **in the same
conversation** offers **resume at <last step> / restart from orientation**. This
offer is conversation-scoped — it does not survive a new session or a different
machine — and the wrap-up says so. The resume question sits *outside* a
navigation action: re-entering then jumping costs the resume question plus one
navigation action (FR-010).

**Reaching any step in one action.** From any step, Jump → <target> lands you
there directly (≤2 AskUserQuestion interactions). From S1, "run a round" is one
navigation action away (SC-003).

---

## S1 · orient

The chorus is a **multi-lens review**: a panel of persona advisors (architecture,
domain, product, human factors, clean code, simple design, delivery/ops,
security, and the scope/flow lens) each reads your target through one lens, and
their findings are scored by a deterministic vote — not by any single opinion. It
has **three modes**: two review modes (the project-state round and the agent-SDLC
lifecycle) and this tutorial. You do not need to read the companion docs first —
that is what this tutorial is for.

**What the orientation checks (read-only).** On entry the mode runs read-only
probes across **both** documented install channels (the file-path install and the
plugin install): is the addendum template reachable via the running skill's base
path, are the persona agents present, does a project addendum already exist, and
are you inside a repository. The mode running at all is itself evidence the skill
is reachable — the probes test *artefact availability*, not bare presence.

**Install sub-step (only if something the mode needs is genuinely missing).** If a
needed artefact is unreachable, S1 **instructs** — it never runs commands and
never writes — with remedy text matched to the detected channel:

- **file-path channel**: clone the repository and run its installer (`./install.sh`)
  to deploy the skill, its persona agents, and the template;
- **plugin channel**: reinstall or update the plugin so its packaged artefacts
  (the template and the full persona-agent set) deploy.

If nothing is missing, the sub-step does not appear.

Cites: skill/chorus-review/SKILL.md

**Navigation question (S1):** Continue → set up · Go deeper on the three modes ·
Jump to another step · **Exit — get the cheat-sheet**. (Exit here delivers the
expert cheat-sheet: the addendum checklist, the command list, and "in a new
session, say 'chorus learn' and jump straight to any step.")

---

## S2 · set up

Every project gives the chorus a one-page **addendum** at
`docs/reviews/CHORUS-PROJECT.md`: its scope exclusions, the anchor surface the
review should focus on, and a security data-surface checklist. The chorus reads
this at the start of every round. Authoring it is the single biggest setup
friction — so this step can **do** it for you, on request.

**The scaffold offer (opt-in, a dedicated question).** After this explanation, S2
presents a **separate, dedicated confirmation question** — *"Scaffold
`docs/reviews/CHORUS-PROJECT.md` from the template now? (creates one file;
sections 2, 3, and 5 are left for you to fill)"* — **before** the step's
navigation question (you decide the write first, then where to go). Consent is
never folded into a navigation option.

The source template resolves in order: inside this repo, the checkout's
`templates/CHORUS-PROJECT.template.md` (authoritative); otherwise
`<skill-base>/templates/` (the running skill's own copy); otherwise the plugin
root's `templates/`. So both install channels genuinely deliver, not merely probe.

#### On accept

The mode creates `docs/reviews/CHORUS-PROJECT.md` from the resolved template (the
folder is created if absent — this is part of the accepted action), with:

- a machine-readable **SCAFFOLDED marker** as the first line after the title —
  `<!-- SCAFFOLDED by chorus learn YYYY-MM-DD — sections 2/3/5 unfilled; a chorus
  round treats this file as structure, not facts, until the marker is removed -->`;
- sections **2, 3, and 5** flagged `<!-- TO FILL -->` (exclusions · anchors ·
  security checklist);
- the template's copy-instructions preamble already comment-wrapped, so the new
  file reads correctly.

This is the tutorial's **only** write, and it happens only on explicit acceptance
of the dedicated question. The wrap-up names the sections to fill and notes that
removing the marker is the "this is now real" signal.

**Other outcomes.** Decline → nothing is written and the tutorial proceeds. An
addendum already present → the offer becomes "review/extend your existing
addendum" (a walk through its sections; if it bears the SCAFFOLDED marker, a
reminder of which sections remain) — the file is **never** overwritten. Run
outside a repository → the offer is replaced by a one-line notice stating what the
scaffold would do, why it is unavailable here, and that re-running inside a
project repository enables it (never silent). In every non-accept case the write
count is zero.

Cites: templates/CHORUS-PROJECT.template.md, skill/chorus-review/SKILL.md, install.sh (file-path channel)

**Navigation question (S2):** Continue → run a round · Go deeper on the addendum ·
Jump to another step · Exit the tutorial.

---

## S3 · run a round

To review something, say **"spawn the chorus"** pointed at a spec or a design.
The personas **RSVP** (each self-selects in or out for that round), then the
review runs four **stages** — extract → author → vote → tally — and leaves a
durable artifact you commit. (These review *stages* are not this tutorial's
*steps*: a stage is one phase of a single review's machinery; a step is one
screen of this tutorial.) The severity of each finding comes from the vote
arithmetic, not from any one advisor — see `GATE-PRIMITIVE.md` for the mechanic;
this tutorial summarizes, it does not restate it.

Cites: skill/chorus-review/GATE-PRIMITIVE.md, skill/chorus-review/SKILL.md

**Navigation question (S3):** Continue → agent-SDLC · Go deeper on a round · Jump
to another step · Exit the tutorial.

---

## S4 · agent-SDLC

The second review mode **gates a speckit feature** as it moves through its
lifecycle. Say **"run the agent-SDLC on feature 0NN"**. It runs scoped review
gates after plan, after tasks, and after implementation. A gate that finds a
blocking issue (a 🔴) **halts** and either self-heals across a few bounded cycles
or asks you — it never passes a 🔴 silently, and operator decisions are *banded*
(some auto-resolve, some proceed with a recorded default you can override, some
hard-block for your call). The pipeline and the block-on-🔴 rule live in
`SDLC-LAYER.md`; the decision banding lives in `DECISION-PRIMITIVE.md`.

Cites: skill/chorus-review/SDLC-LAYER.md, skill/chorus-review/DECISION-PRIMITIVE.md

**Navigation question (S4):** Continue → work with results · Go deeper on
block-on-🔴 · Jump to another step · Exit the tutorial.

---

## S5 · work with results

Each round leaves `docs/reviews/YYYY-MM-DD-chorus-review.md` — **commit it**; the
most recent artifact is the next round's baseline, so the next round assumes its
top findings closed or carried forward rather than re-deriving them. Banded
operator decisions queue in the ledger's provisional-decisions section for async
override. That is the whole loop: set up → run → read the artifact → next round
builds on it.

Cites: skill/chorus-review/SKILL.md, skill/chorus-review/DECISION-PRIMITIVE.md

**Navigation question (S5):** **Finish the tutorial** · Go deeper on results ·
Jump (→ S1–S4; there is no "back" slot here — free-text/Other stays at S5) · Exit
the tutorial. (Finish and Exit converge on the wrap-up by declaration; Finish
marks completion. Depth state is per-step: if you went deeper on an earlier step,
S5 still shows "Go deeper", not "Recap".)

---

## The wrap-up (every completed or exited path — FR-011)

Conclude with a plain wrap-up: the concrete next command ("say 'spawn the
chorus'"), **the step reached and the resume scope** ("this resume offer lives in
this conversation — in a new session, say 'chorus learn' and jump straight to any
step"), and pointers to the canonical docs for depth (`SKILL.md`,
`GATE-PRIMITIVE.md`, `SDLC-LAYER.md`). When a scaffold was created, name the
sections to fill (2/3/5) and that removing the SCAFFOLDED marker is the "this is
now real" signal. **At S1 this wrap-up doubles as the expert cheat-sheet.**

If a cited doc is missing at runtime (e.g. a stale installed copy), say so
plainly, continue at summary altitude, and point to the canonical source resolved
via the **running skill's base path** — a pointer that exists in the failing
user's world — never reconstruct the content from memory.
