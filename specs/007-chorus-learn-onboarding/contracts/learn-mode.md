# Contract: the `chorus learn` mode

**Feature**: 007-chorus-learn-onboarding (cycle-2 regen) | Binds: `SKILL.md`
(registration + Phase-0 note), `LEARN.md` (the procedure), `README.md` and
`install.sh` (discoverability)

## Trigger & registration (the full edit surface — FR-013)

| Surface | Contract |
|---|---|
| Trigger phrases | "chorus learn" / `/chorus learn` (FR-001) |
| `SKILL.md` mode list | gains a third entry alongside the project-state round and agent-SDLC: one-paragraph summary + pointer to `LEARN.md`; no tutorial content in `SKILL.md` |
| `SKILL.md` **YAML frontmatter description** | carries the "chorus learn" trigger — this is the harness's actual routing surface (family I); asserted by C1 |
| `SKILL.md` "Two modes" region | reframed: **three modes** — the two *review* modes share the gate primitive; learn is navigational/explanatory. The stale "Two modes"/"Both modes" phrasing is removed (family J); asserted by C1 |
| `SKILL.md` **Phase-0 note** | a SCAFFOLDED-marker-bearing addendum is present-but-unfilled: confirm the flagged sections with the operator; do not consume placeholder text as project facts (FR-014, R9) |
| `README.md` | names all three modes with triggers; the quick-start **leads with `chorus learn`**, the manual template copy remains as the cited fallback (family M) |
| `install.sh` "Next:" | leads with `chorus learn`; cites the installed template location for the manual fallback |
| Definition locus | `LEARN.md` is the **single canonical definition** of the mode; any change to steps, navigation, or the scaffold happens there, once |

## Mode behavior (normative)

1. **Entry**: on trigger, check ResumeState — if a prior tutorial reached a step this
   conversation (explicit exit **or** silent abandonment; state updates per
   transition), offer **resume at `last_step` / restart** (FR-010, SC-007); else start
   at S1.
2. **Steps**: the five-step map of `data-model.md` runs S1→S5 unless navigation
   redirects. Each step delivers its concise explanation, its structured `Cites:`
   line, **then** its single navigation question (FR-003). "Go deeper" is the
   sanctioned path to more depth — once; then the slot re-presents as "recap this
   step".
3. **Detection (S1)**: read-only, artefact-grounded, **dual-channel** probes (R5):
   template availability via the running skill's own base path (file-path or plugin
   install), persona agents, addendum presence **and marker state**, repo context. The
   mode running is itself evidence the skill is reachable.
4. **Install sub-step (S1, instruct-only)**: for the user whose installation genuinely
   lacks a needed artefact (cohort: exploring from a checkout, or a partial install).
   It **presents** the commands (clone + `./install.sh`) and what they will do; it
   **never executes commands and never writes** (families E/F). Effects list: none.
5. **Both review modes taught**: S3 the project-state round — introducing the four
   review *stages* with the one-line step/stage disambiguation (FR-012) — S4 the
   agent-SDLC lifecycle, each at newcomer altitude with pointers (FR-009, US4).
6. **Exit**: every completed or exited path ends with the FR-011 wrap-up — the
   concrete next command, **the step reached and the resume scope** ("in a new
   session, say 'chorus learn' and jump straight to any step"), canon pointers, and —
   when a scaffold was created — the sections to fill and the marker to remove
   (FR-014). **At S1 the wrap-up is the expert cheat-sheet** (FR-004/R3): addendum
   checklist + command list.
7. **Non-expert floor**: no step assumes the invariants, the roster, or the speckit
   pipeline; each term introduced at first use (FR-012).

## Write surface

The mode performs **no writes** except the S2 opt-in scaffold
(contracts/scaffold.md), behind its dedicated confirm. This is the whole list — the
union of all declared SubStep effects (data-model.md). ResumeState is
conversation-scoped (R4). Asserted mechanically by C6 (write-idiom scan).

## Refusals

- Refuse to restate a canon-defined mechanic inline — summarize at onboarding altitude
  and cite via the step's `Cites:` line (FR-008; checks C3/C4).
- **Cite-failure honesty (R10)**: if a cited doc is missing at runtime, say so plainly,
  continue at summary altitude, and point to the repo path — never reconstruct canon
  from memory.
- Refuse to scaffold without the dedicated explicit confirmation, over an existing
  addendum, or outside a repo — and outside a repo, **say why the offer is absent**
  rather than suppressing it silently (family N; scaffold.md).
- Refuse to execute anything in the install sub-step — instruct-only.
- Refuse to quiz/assess — AskUserQuestion is for teaching + navigation only (spec
  Assumption 3).
