# Contract: step navigation (AskUserQuestion)

**Feature**: 007-chorus-learn-onboarding (cycle-3 regen) | Binds: every step's
navigation question in `LEARN.md`

> **This contract is the normative surface (R12).** The option **labels**, their
> **ordering**, the **per-step depth state**, and the **S2 confirm ordering** are
> pinned **here**. Walkthroughs (quickstart's included) are illustrative and must
> conform to this contract — never the reverse (G19/G24/G27).

## The per-step navigation question

Exactly **one navigation question per step, exactly 4 options** — all four affordances
at every step, S1 included (FR-004; the cycle-1 N5 substitution is struck, family A):

| Slot | Option (pinned label) | Behavior |
|---|---|---|
| 1 | **Continue → <next step name>** (recommended, listed first); **at S5: "Finish the tutorial"** | advance Sn→Sn+1. At S5, **Finish** delivers the FR-011 wrap-up — a **declared convergence** with slot 4 (both end the tutorial at the wrap-up; Finish marks completion, Exit leaves from anywhere). The convergence is deliberate, not a hidden duplicate (G3/G27) |
| 2 | **Go deeper on <current topic>**; after a deeper pass **on this step**: **"Recap this step"** | one expanded pass on the same step, then this slot re-presents as the recap (depth bounded at one level; no dead option — family L). **Depth state is per-step (G24)**: a deeper pass on Sn flips only Sn's slot 2 — a step whose own deeper pass has not happened never shows "Recap" |
| 3 | **Jump to another step** | fires the jump follow-up (below) |
| 4 | **Exit the tutorial**; **at S1: "Exit — get the cheat-sheet"** | deliver the FR-011 wrap-up (step reached + resume scope + next command). **At S1 this wrap-up IS the expert cheat-sheet, and the pinned label says so before selection** (G19) — the fast exit rides the exit affordance and displaces nothing (family A) |

The tool's built-in "Other" free-text needs no slot; arbitrary asks are answered, then
the question re-presents.

**Consent is not navigation**: the S2 scaffold confirm is a **separate dedicated
question** (contracts/scaffold.md) — never folded into a navigation slot (family D) —
and it is **presented before S2's navigation question** (ordering pinned here, G20:
the user decides the write, then where to go). The "exactly one" rule above is scoped
to the **navigation** question; declared sub-step confirms are sanctioned additional
calls.

## The jump follow-up

One question listing the **other** steps by name. Budget arithmetic, per step:
S1–S4 → the remaining 3 steps (next-step already on slot 1) + "back to where I was" =
4 options. **S5 → S1–S4 = 4 options, no "back" slot** (the user is at the end; "back"
rides the built-in Other) — and the follow-up's **question text discloses it**
("free-text/Other stays here at S5"), so the escape is stated, not assumed knowledge
of the tool (G21). The S5 overflow found at cycle 1 (F42/F15) is resolved by rule,
not by exception. Selecting a step lands there directly; skipped steps are **not**
replayed (US2).

## Invariants

- **N1**: every step's navigation question offers all four affordances — advance /
  deeper(recap) / jump / exit (FR-004). No step traps the user, and no step
  substitutes an affordance away.
- **N2**: any step is reachable from any other in **one navigation action** — one
  selection on the navigation question plus its follow-up if any, **≤2
  AskUserQuestion interactions** (SC-003's defined unit, family B). From S1, "run a
  round" is one navigation action: jump → S3.
- **N3**: explanations precede the question, bounded to one interaction's worth
  (FR-003); questions present choices, never walls of text.
- **N4**: navigation is single-select (mutually exclusive); never multiSelect.
- **N5**: *(struck at cycle 1 — replaced by slot 4's S1 rule: the exit wrap-up serves
  as the cheat-sheet; FR-004 holds universally.)*

## Resume

On re-trigger with ResumeState present (updated at **every transition** — explicit
exit or silent abandonment, FR-010): one question — **resume at <last step> / restart
from orientation** (SC-007). Two options; no other slots needed. The wrap-up has
already disclosed that this offer is conversation-scoped and that in a new session any
step is one jump away (family C). **This question is outside SC-003's
navigation-action unit** (G4): re-entering and then jumping costs the resume question
plus one navigation action — stated honestly rather than folded into the metric.
