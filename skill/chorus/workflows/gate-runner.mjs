// gate-runner.mjs — the bounded Workflow runner for a chorus gate (feature 011, Slice 1).
//
// This is the thin imperative SHELL: it fans out authors and voters via the Workflow runtime
// primitives (agent/parallel) and delegates ALL deterministic decisions to gate-core.mjs. It
// carries no gate meaning of its own. It owns no clock/RNG/filesystem (FR-010/FR-011); the
// inline orchestrator persists the ledger from the returned data.
//
// ┌─ INTEGRATION ASSUMPTION (flag for Gate C / the live SC-001 run) ───────────────────────┐
// │ Assumes the Workflow runtime resolves this local ESM import. If it does NOT (the tool   │
// │ contract says scripts are "self-contained"), gate-core's exports must be INLINED here    │
// │ and kept drift-free by a core-parity conformance stanza — the same "conformance-locked   │
// │ second copy" pattern used for the canon thresholds (CF-1). The deterministic guarantees  │
// │ (SC-001/002/003/006/007/009) are verified against gate-core directly, so this assumption │
// │ does not gate their verification — only the live fan-out depends on it.                  │
// └────────────────────────────────────────────────────────────────────────────────────────┘
import {
  s8Voters, assembleFindings, authorStageOutcome,
} from './gate-core.mjs';

export const meta = {
  name: 'chorus-gate-runner',
  description: 'Bounded Workflow runner for a chorus gate: Author → Vote → Tally (Slice 1)',
  phases: [
    { title: 'Author', detail: 'one author per seated lens (uncapped findings)' },
    { title: 'Vote', detail: 'route each finding to author-excluded voters (S8)' },
    { title: 'Tally', detail: 'in-code net = P − O + injected-threshold band' },
  ],
};

// args = { runId, bands:{escalateAt,demoteAt}, brief, corpusLocators, seated:[lens...], timeoutMs }
const { runId, bands, brief, corpusLocators, seated } = args;

const FINDING_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'evidence', 'pull_quote', 'proposed_severity'],
        properties: {
          id: { type: 'string' },
          evidence: { type: 'string', minLength: 1 },
          pull_quote: { type: 'string' },
          proposed_severity: { enum: ['🟢', '🟡', '🔴'] },
        },
      },
    },
  },
};
const BALLOT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['ballot', 'reason'],
  properties: { ballot: { enum: ['PRIORITIZE', 'CONFIRM', 'OVER-RATE'] }, reason: { type: 'string' } },
};

const gaps = [];
const handle = (label) => ({ runId, agentLabel: label });

// ── Phase: Author ─────────────────────────────────────────────────────────────────────────
phase('Author');
const authorResults = await parallel(seated.map((lens) => () =>
  agent(`${brief}\n\nLens: ${lens}. Corpus: ${corpusLocators}. Author findings (uncapped); each cites file:line or a [principle].`,
    { label: `author:${lens}`, phase: 'Author', schema: FINDING_SCHEMA })
    .then((r) => (r ? { lens, findings: r.findings } : (gaps.push({ stage: 'author', lens, reason: 'null-isolated' }), null)))
));
const survivors = authorResults.filter(Boolean);
const stageOutcomes = { author: authorStageOutcome(survivors.length), vote: 'ok' };

// Flatten to authored findings, tagging author lens + transcript handle.
const authored = survivors.flatMap(({ lens, findings }) =>
  findings.map((f) => ({ ...f, lens, transcriptHandle: handle(`author:${lens}`) })));

// ── Phase: Vote (S8-routed) ──────────────────────────────────────────────────────────────
phase('Vote');
await parallel(authored.map((f) => () => {
  const voters = s8Voters(seated, f.lens); // author excluded — S8
  return parallel(voters.map((vl) => () =>
    agent(`Vote on finding ${f.id} (proposed ${f.proposed_severity}): ${f.pull_quote}\nEvidence: ${f.evidence}\nReply PRIORITIZE / CONFIRM / OVER-RATE + one-line reason.`,
      { label: `vote:${f.id}:${vl}`, phase: 'Vote', schema: BALLOT_SCHEMA })
      .then((r) => (r ? { voter: vl, ballot: r.ballot, reason: r.reason, transcriptHandle: handle(`vote:${f.id}:${vl}`) }
                       : (gaps.push({ stage: 'vote', lens: vl, reason: 'null-isolated' }), null)))
  )).then((vs) => { f.votes = vs.filter(Boolean); });
}));

// ── Phase: Tally (deterministic core; injected thresholds) ──────────────────────────────────
phase('Tally');
const findings = assembleFindings(authored, bands); // tally + band in code (gate-core)

// Finding-centric Published-Language return (FR-008). The runner acts on nothing — bands are data.
return { runId, findings, gaps, stageOutcomes };
