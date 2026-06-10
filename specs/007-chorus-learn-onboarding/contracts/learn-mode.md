# Contract: the `chorus learn` mode

**Feature**: 007-chorus-learn-onboarding | Binds: `SKILL.md` (mode registration),
`LEARN.md` (the procedure), `README.md` (discoverability)

## Trigger & registration

| Item | Contract |
|---|---|
| Trigger phrases | "chorus learn" / `/chorus learn` (FR-001) |
| Registration | `SKILL.md` mode list gains a third entry alongside the project-state round and agent-SDLC: one-paragraph summary + pointer to `LEARN.md`; no tutorial content in `SKILL.md` | 
| README | names all three modes with their triggers (FR-013) |
| Definition locus | `LEARN.md` is the **single canonical definition** of the mode; any change to stages, navigation, or the scaffold happens there, once |

## Mode behavior (normative)

1. **Entry**: on trigger, check ResumeState — if a prior tutorial was exited this
   conversation, offer **resume at `last_stage` / restart** (FR-010, SC-007); else
   start at S1.
2. **Stages**: the five-stage map of `data-model.md` runs in order S1→S5 unless
   navigation redirects. Each stage delivers its concise explanation **then** its
   single navigation question (FR-003). No stage dumps long prose; "go deeper" is the
   sanctioned path to more depth.
3. **Detection (S1)**: three read-only probes — skill installed / addendum present /
   inside a repo (research.md R5) — route the install sub-step and the S2
   scaffold-vs-review offer. Probes never write (FR-005).
4. **Both modes taught**: S3 teaches the project-state round, S4 the agent-SDLC
   lifecycle, each at newcomer altitude with pointers for mechanics (FR-009, US4).
5. **Exit**: every completed or exited path ends with the wrap-up — "you can now do X"
   naming the concrete next command ("spawn the chorus" / "run the agent-SDLC on
   feature 0NN") plus pointers to the canon for depth (FR-011).
6. **Non-expert floor**: no stage assumes the invariants, the roster, or the speckit
   pipeline; each term is introduced at first use (FR-012). The expert fast-exit
   (cheat-sheet option on S1) exists so the floor costs experts one choice.

## Write surface

The mode performs **no writes** except the S2 opt-in scaffold (contracts/scaffold.md).
This is the whole list. ResumeState is conversation-scoped (R4).

## Refusals

- Refuse to restate a canon-defined mechanic inline — summarize at onboarding altitude
  and cite (FR-008; checked by quickstart R7 scans).
- Refuse to scaffold without explicit confirmation, over an existing addendum, or
  outside a repo (scaffold.md).
- Refuse to quiz/assess — AskUserQuestion is for teaching + navigation only (spec
  Assumption 3).
