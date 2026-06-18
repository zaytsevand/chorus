# Implementation Plan: Chorus `challenge` — a premise pass in Gate A

**Branch**: `013-premise-challenge` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/013-premise-challenge/spec.md` (v2 — reframed after Gate A; cleared at Gate A cycle 1, ledger `agent-sdlc-log.md`)

## Summary

Add a **premise pass** to Gate A: before its within-frame design review, the seated panel is adversarially briefed to attack the spec's *premise* (problem / necessity-now / framing / load-bearing assumptions) and steelman the null or a named alternative. Premise findings are **author-declared and vote-confirmed** as premise-scoped (not classified by a stanza), surface first in the ledger, and run through Gate A's **existing tally** — no new verdict mechanic. A **fixed, author-independent red-team checklist** is the out-of-distribution divergence floor (§4d). The same brief is invocable standalone as `chorus challenge <target>`. **Technical approach:** a markdown re-brief — one new subsection in `SDLC-LAYER.md` (the canonical home of the premise-pass brief + checklist), a `challenge` mode registration in `SKILL.md` that cites it, and conformance stanzas in this feature's `quickstart.md`. `GATE-PRIMITIVE.md` and `DECISION-PRIMITIVE.md` are reused **by citation**, byte-unchanged.

## Technical Context

**Language/Version**: Markdown (Claude Code skill/prompt authoring) — N/A runtime.

**Primary Dependencies**: the chorus canon under `skill/chorus/` (`SDLC-LAYER.md`, `SKILL.md`, `GATE-PRIMITIVE.md`, `DECISION-PRIMITIVE.md`); deployed by `install.sh`.

**Storage**: N/A (prose canon + per-feature ledger).

**Testing**: conformance-check stanzas in `quickstart.md` (the project's first-class verification surface, Principle V) + the dogfooding gate trail in `agent-sdlc-log.md`.

**Target Platform**: Claude Code (the chorus skill, installed to `~/.claude/skills/chorus/`).

**Project Type**: single methodology repo (markdown).

**Performance Goals**: N/A — the design constraint is *marginal cost per Gate A run* (the premise pass must be a brief edit, not a separate panel cycle; see Gate A cycle-0 F19/F16).

**Constraints**: Markdown-only, no runtime code beyond `install.sh` + check stanzas (Authoring Constraints); new capability is a **mode** of `chorus`, not a new skill; **no new mechanic / mapping / canonical doc** (FR-007, the dissolved K4 reds); Gates B/C and the gate-primitive tally **byte-unchanged** (FR-009 / SC-008).

**Scale/Scope**: 2 canon files edited (`SDLC-LAYER.md`, `SKILL.md`) + 1 quickstart added + this feature's spec/plan artifacts. No persona/agent files change.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I — Cite, never restate**: ✅ The premise-pass brief + red-team checklist get **exactly one** canonical home (`SDLC-LAYER.md`); `SKILL.md`'s `challenge` mode and the standalone invocation **cite** it. The outcome reuses `GATE-PRIMITIVE.md` Stage 4 by citation — no tally restated (FR-007). Conformance stanza C-CITE pins it.
- **V — Evidence**: ✅ Every FR cites a spec line / canon target; the conformance suite (`quickstart.md`) is named as the verification surface. The red-team checklist is itself an evidence floor (prior-free items, recorded outcomes — FR-005).
- **VIII — Spec is source of truth**: ✅ Gate-A incorporation revised the **spec** (v1→v2) and this plan is regenerated from it; no downstream artefact hand-patched. The conformance stanzas converge the canon toward the spec, recorded.
- **IX — Build on the constraint**: ✅ The binding constraint is **chorus verdict-trustworthiness** (§4d: AI-review is circular unless it diverges). The plan buys exactly the divergence floor and defers everything else (no new phase, no mechanic). Deferrals (R1–R5) stated in Complexity Tracking.
- **Authoring constraints**: ✅ Markdown-only; `challenge` is a **mode** of `chorus` (registered in `SKILL.md` mode list + frontmatter, `README.md`, `install.sh`); canon layout unchanged (edits land in existing files, no new canon doc — FR-007).

**Post-Phase-1 re-check**: ✅ no new violation introduced by the design artifacts (see Complexity Tracking for the one watched item: default-on cost, R4 — a deferred 🟡, not a violation).

## Project Structure

### Documentation (this feature)

```text
specs/013-premise-challenge/
├── spec.md              # v2 (cleared Gate A cycle 1)
├── plan.md              # This file
├── research.md          # Phase 0 — the 5 settled design questions
├── data-model.md        # Phase 1 — premise-pass entities + the red-team checklist content
├── contracts/
│   └── canon-edits.md   # Phase 1 — exact edit surface (file → insertion → cited mechanic)
├── quickstart.md        # Phase 1 — conformance stanzas (C-* checks) + walkthrough
├── checklists/
│   └── requirements.md  # spec-quality checklist (v2)
└── agent-sdlc-log.md    # the gate ledger (Gate A cleared, cycle 1)
```

### Source surface (canon under `skill/chorus/`)

```text
skill/chorus/
├── SDLC-LAYER.md        # EDIT — new "### Gate A — premise pass (runs first)" subsection:
│                        #        the canonical brief + fixed red-team checklist + honest-null
│                        #        + scope-tag-in-vote rule; placed after "### Exploratory phase",
│                        #        before "### Block on 🔴". Ledger-ordering note in "## The ledger".
├── SKILL.md             # EDIT — register `chorus challenge` as a mode (three-modes list +
│                        #        when-to-use + YAML frontmatter); CITES the SDLC-LAYER brief.
├── GATE-PRIMITIVE.md    # UNCHANGED — reused by citation (Stage 4 tally, S8/S9 vote authority).
└── DECISION-PRIMITIVE.md# UNCHANGED — reused by citation (self-unblocking 🔴, operator-owned).
```

Deployment surfaces updated for the new mode (Authoring Constraints): `README.md`, `install.sh`.

**Structure Decision**: The premise-pass brief + red-team checklist have a **single canonical home in `SDLC-LAYER.md`** (Gate A is the primary consumer; resolves cycle-0 F14). `SKILL.md`'s `challenge` mode and the standalone invocation cite that home rather than restating it (Principle I). This is the leanest shape consistent with v2's "no new canonical doc" (FR-007) — the home is an existing file's new subsection, not a new file.

> **Trade-off recorded (Gate B Richards B2):** the subsection carries five labelled parts (brief / scope-tag / red-team checklist / honest-null / outcome) cited from three sites — functionally a sub-document. This is a deliberate choice of **maintenance-locality over file-splitting** (Gate A is the sole primary consumer). It must NOT be "tidied" into a separate `CHALLENGE-LAYER.md` by a future editor — that is exactly the new canonical doc SC-005 forbids. C-CITE guards the boundary.

## Complexity Tracking

No constitution **violations**. The table records the cycle-1 residual 🟡 (R1–R5) as **deliberate deferrals** under Principle IX (build-on-constraint; defer the rest), each with the counter-force that justifies carrying it rather than closing it now.

| Item (residual) | Why carried, not closed now | Counter-force / disposition |
|-----------------|----------------------------|------------------------------|
| **R1** — red-team checklist can't fully escape same-model blind spot (§4d) | Inherent limit of same-model review, not a fixable bug; the floor *narrows* the blind spot, which is the available win | Soften spec.md:97 wording ("lowers the floor for", not "directly addressing") in tasks; accept the residual as a stated limit, not a defect |
| **R2** — honest-null sincerity is asymptotic (shallow-but-formatted entries undetected) | A detector for "shallow but well-formatted" is itself a same-model judgment — building it now is inventory ahead of evidence | Re-run discipline degrades gracefully (a no-attack pass fails-closed); revisit only if a real shallow-pass is observed |
| **R3** — SC-007 lacks a behavioral honest-null **contrapositive** (sound premise ⇒ honest-null, not a manufactured red) | ~~deferrable~~ → **CLOSED at Gate B**: Beck + Goldratt converged that the false-red is an adversarial brief's riskiest failure mode — *on* the constraint, not off it | **Promoted to mandatory** — C-008 + sound-premise fixture (T017, quickstart.md); the two fixtures prove the pass discriminates |
| **R4** — default-on still taxes 100% of Gate A runs for a ~17% divergence tail | Cost **collapsed** to a brief change; the floor is defensible as *buying the §4d invariant* rather than hoping for divergence | Keep default-on (operator may skip with a recorded note); watch per-run honest-null authoring cost on the sound path |
| **R5** — `SC-004` re-run has **no ceiling** | A boilerplate-judged honest-null could re-run unbounded | **Close in tasks**: cap re-run at N cycles, then operator-override like any 🔴 (mirror the 3-cycle self-heal bound, S7) |

> **Note (not a 013 task):** Constitution Principle IX still reads "the scope/deferral lens is never out-seated on a new buildout" (constitution.md:253) — superseded by feature 012's exceptional-entry seating (now installed; `SDLC-LAYER.md` § seating). A constitution patch is owed but is **out of scope for 013**; flagged for a follow-up amendment.
