---
name: chorus-learn
description: Use when a user says "chorus learn" / "/chorus learn", or asks to learn / be onboarded to the chorus suite — a guided, staged tutorial that teaches setup (the per-project addendum) and both review modes (the project-state round in chorus-review and the agent-SDLC lifecycle in chorus-sdlc). Explanatory and navigational; it mutates nothing except one opt-in scaffold the user explicitly confirms. REQUIRED composition: chorus-core (shared substrate, for the primitive references it points to).
---

# `chorus learn` — the guided onboarding tutorial

This skill is the **single canonical definition** of the `chorus learn` mode
(trigger: "chorus learn" / `/chorus learn`). It is the **navigational** member of
the chorus suite — explanatory and teaching, not gating. It mutates nothing except
one **opt-in** scaffold the user explicitly confirms (S2). The orchestrator running
this skill delivers each step as a short explanation **plus** an AskUserQuestion
navigation choice — never a wall of text.

It is **cross-cutting**: it teaches the operator how to set up the chorus and how
to reach **both** review modes — the project-state round (`chorus-review`) and the
agent-SDLC lifecycle (`chorus-sdlc`). It refers to those sibling skills **by name**
(navigation targets the operator types), never to their internal file paths; it is
its own skill and does not live under either. For the shared mechanics it points
at, it composes the substrate.

## REQUIRED: chorus-core

This skill **composes the shared substrate skill `chorus-core`** for the mechanics
it points readers at — the four-stage gate (`chorus-core/GATE-PRIMITIVE.md`), the
decision banding (`chorus-core/DECISION-PRIMITIVE.md`), the exploratory phase
(`chorus-core/EXPLORATORY-PHASE.md`), and the conductor discipline + invariant
catalog (`chorus-core/CONDUCTOR.md`). It **summarizes and navigates to** those
files; it never restates their mechanics. (Unlike `chorus-review` and
`chorus-sdlc`, this skill *teaches* rather than *gates*, so a hard fail-loud
substrate guard is not required — but when it points at a primitive it points at
the real `chorus-core` file, and a runtime-missing doc is handled by the wrap-up's
"cited doc missing" rule below.)

**Three modes.** The chorus suite has three operator-facing entries: two *review*
modes — the project-state round (`chorus-review`, "spawn the chorus") and the
agent-SDLC lifecycle (`chorus-sdlc`, "run the agent-SDLC on feature 0NN") — and
this navigational tutorial. The two review modes share the gate primitive
(`chorus-core/GATE-PRIMITIVE.md`); this tutorial teaches, it does not gate.

## How navigation works (the same four choices on every step)

Every step ends with one question offering the same four choices:

1. **Continue** to the next step (the recommended first choice). On the last step
   this reads **"Finish the tutorial"** and takes you to the wrap-up.
2. **Go deeper** on the current step. After one deeper pass this choice becomes
   **"Recap this step"** on that step — going deeper is bounded to one level, and
   only the step you deepened shows "Recap".
3. **Jump to another step** — pick any step by name and land there directly,
   without replaying the ones you skipped. On steps S1–S4 the jump list also
   offers **"back to where I was"**; on S5 there is no "back" (you are at the end),
   and the question says so — typing free text keeps you on S5.
4. **Exit.** On S1 this reads **"Exit — get the cheat-sheet"**, because exiting
   from orientation hands an expert the whole command surface at once.

You can also just type what you want in the tool's free-text box. From any step,
one jump reaches any other step.

**Resume.** If you leave the tutorial — whether you exit or simply stop replying —
re-saying "chorus learn" **in the same conversation** offers to resume where you
left off or restart. That offer itself tells you it only lives in this
conversation: in a new session, say "chorus learn" and jump straight to any step.

---

## S1 · orient

By the end of this tutorial you will be able to set up the chorus on your project
and run your first review — without reading the dense companion docs first. That
is what this tutorial is for.

The chorus is a **multi-lens review**: a panel of persona advisors each reads your
target through one lens (architecture, domain, product, security, and more), and
their findings are scored by a vote rather than any single opinion. It has **three
modes** — two review modes (the project-state round `chorus-review` and the
agent-SDLC lifecycle `chorus-sdlc`) and this tutorial.

On entry the tutorial quietly checks that what it needs is reachable — the addendum
template, the persona agents, whether you already have a project addendum, and
whether you are inside a repository — across both ways the suite can be installed.
These checks only read; they change nothing. If something it needs is genuinely
missing, it shows you how to fix it (below) — it never runs anything for you.

**Install sub-step (only if something the mode needs is genuinely missing).** If a
needed artefact is unreachable, S1 **instructs** — it never runs commands and
never writes — with remedy text matched to the detected channel:

- **file-path channel**: clone the repository and run its installer (`./install.sh`)
  to deploy the suite skills, the persona agents, and the template;
- **plugin channel**: reinstall or update the plugin so its packaged artefacts
  (the template and the full persona-agent set) deploy.

If nothing is missing, the sub-step does not appear.

Cites: the `chorus-review` and `chorus-sdlc` skills (the two review modes).

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

The tutorial creates `docs/reviews/CHORUS-PROJECT.md` from the template (creating
the folder if needed). The new file carries a **SCAFFOLDED marker** as its first
line, and its sections 2, 3, and 5 (exclusions · anchors · security checklist) are
flagged for you to fill. This is the tutorial's **only** write, and only on explicit
acceptance of the dedicated question. When you have filled the sections, deleting the
marker line is how you tell the chorus the file is now real. (The exact marker text,
and how a later review round reads it, are defined in the `chorus-review` skill and
the scaffold contract.)

**Other outcomes.** Decline → nothing is written and the tutorial proceeds. An
addendum already present → the offer becomes "review/extend your existing
addendum" (a walk through its sections; if it bears the SCAFFOLDED marker, a
reminder of which sections remain) — the file is **never** overwritten. Run
outside a repository → the offer is replaced by a one-line notice stating what the
scaffold would do, why it is unavailable here, and that re-running inside a
project repository enables it (never silent). In every non-accept case the write
count is zero.

Cites: `templates/CHORUS-PROJECT.template.md`, the `chorus-review` skill (it reads
the addendum), `install.sh` (file-path channel).

**Navigation question (S2):** Continue → run a round · Go deeper on the addendum ·
Jump to another step · Exit the tutorial.

---

## S3 · run a round

To review something, say **"spawn the chorus"** pointed at a spec or a design —
this is the `chorus-review` skill. The personas **RSVP** (each self-selects in or
out for that round), then the review runs four **stages** — extract → author →
vote → tally — and leaves a durable artifact you commit. (These review *stages*
are not this tutorial's *steps*: a stage is one phase of a single review's
machinery; a step is one screen of this tutorial.) The severity of each finding
comes from the vote arithmetic, not from any one advisor — unless a persona declares
`confidence_on_hand: low` or raises `NEED_INFO` (formulation, remediation, or
confidence gap), in which case tally waits for peer or operator resolution (`chorus-core/GATE-PRIMITIVE.md`, S11). See
`chorus-core/GATE-PRIMITIVE.md` for the mechanic; this tutorial summarizes, it
does not restate it.

Cites: the `chorus-review` skill, `chorus-core/GATE-PRIMITIVE.md`.

**Navigation question (S3):** Continue → agent-SDLC · Go deeper on a round · Jump
to another step · Exit the tutorial.

---

## S4 · agent-SDLC

The second review mode **gates a speckit feature** as it moves through its
lifecycle — this is the `chorus-sdlc` skill. Say **"run the agent-SDLC on feature
0NN"**. It runs scoped review gates after plan, after tasks, and after
implementation. A gate that finds a blocking issue (a 🔴) **halts** and either
self-heals across a few bounded cycles or asks you — it never passes a 🔴
silently, and operator decisions are *banded* (some auto-resolve, some proceed
with a recorded default you can override, some hard-block for your call). The
pipeline and the block-on-🔴 rule live in the `chorus-sdlc` skill; the decision
banding lives in `chorus-core/DECISION-PRIMITIVE.md`.

Cites: the `chorus-sdlc` skill, `chorus-core/DECISION-PRIMITIVE.md`.

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

Cites: the `chorus-review` skill, `chorus-core/DECISION-PRIMITIVE.md`.

**Navigation question (S5):** **Finish the tutorial** · Go deeper on results ·
Jump to an earlier step (S1–S4) · Exit the tutorial. (No "back" slot here — you
are at the end; typing free text keeps you on S5.)

---

## The wrap-up (every completed or exited path)

Conclude with a plain wrap-up: the concrete next command ("say 'spawn the
chorus'"), **the step reached and the resume scope** ("this resume offer lives in
this conversation — in a new session, say 'chorus learn' and jump straight to any
step"), and pointers to the canonical docs for depth (the `chorus-review` and
`chorus-sdlc` skills, and the substrate primitives `chorus-core/GATE-PRIMITIVE.md`
and `chorus-core/DECISION-PRIMITIVE.md`). When a scaffold was created, name the
sections to fill (2/3/5) and that removing the SCAFFOLDED marker is the "this is
now real" signal. **At S1 this wrap-up doubles as the expert cheat-sheet.**

If a cited doc is missing at runtime (e.g. a stale installed copy), say so
plainly, continue at summary altitude, and point to the canonical source resolved
via the **running skill's base path** — a pointer that exists in the failing
user's world — never reconstruct the content from memory.
