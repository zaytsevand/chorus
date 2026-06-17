// gate-shell.mjs — the gate runner's imperative shell, as an injectable function.
//
// Gate C (CF-A) found the original gate-runner.mjs had zero executed coverage: its fan-out,
// S8 routing, and gaps recording could only run inside the live Workflow runtime. Fix: the
// shell logic lives here as `runGate`, taking the runtime primitives (agent/parallel/phase) as
// INJECTED dependencies. The Workflow entry (gate-runner.mjs) calls it with the real globals;
// the conformance suite calls it with mocks backed by the frozen fixture (C12), so the real
// shell — flatten, S8 routing, gaps, return assembly — is executed and asserted in node.
//
// Still delegates ALL deterministic decisions to gate-core (no gate meaning here). The only
// part that remains live-runtime-only is the Workflow binding itself (gate-runner.mjs's import
// + global resolution), which is irreducible and flagged there.

import { s8Voters, assembleFindings, authorStageOutcome, flattenAuthored, recordGap } from './gate-core.mjs';

export const FINDING_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'evidence', 'pull_quote', 'proposed_severity'],
        properties: {
          id: { type: 'string' }, evidence: { type: 'string', minLength: 1 },
          pull_quote: { type: 'string' }, proposed_severity: { enum: ['🟢', '🟡', '🔴'] },
        },
      },
    },
  },
};
export const BALLOT_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['ballot', 'reason'],
  properties: { ballot: { enum: ['PRIORITIZE', 'CONFIRM', 'OVER-RATE'] }, reason: { type: 'string' } },
};

// runGate — the shell. Primitives injected: agent(prompt, opts)→result|null, parallel(thunks)→[],
// phase(title)→void. Returns the finding-centric GateReturn (contracts/gate-return.md).
export async function runGate({ args, agent, parallel, phase }) {
  const { runId, bands, brief, corpusLocators, seated } = args;
  const gaps = [];
  const handle = (label) => ({ runId, agentLabel: label });

  phase('Author');
  const authorResults = await parallel(seated.map((lens) => () =>
    agent(`${brief}\n\nLens: ${lens}. Corpus: ${corpusLocators}. Author findings (uncapped); cite file:line or [principle].`,
      { label: `author:${lens}`, phase: 'Author', schema: FINDING_SCHEMA })
      .then((r) => (r ? { lens, findings: r.findings } : recordGap(gaps, 'author', lens)))
  ));
  const survivors = authorResults.filter(Boolean);
  const authored = flattenAuthored(survivors, handle); // pure, tested (CF-G fix)
  const stageOutcomes = { author: authorStageOutcome(survivors.length), vote: 'ok' };

  phase('Vote');
  await parallel(authored.map((f) => () => {
    const voters = s8Voters(seated, f.lens); // author excluded — S8
    return parallel(voters.map((vl) => () =>
      agent(`Vote on finding ${f.id} (proposed ${f.proposed_severity}): ${f.pull_quote}\nEvidence: ${f.evidence}\nReply PRIORITIZE / CONFIRM / OVER-RATE + one-line reason.`,
        { label: `vote:${f.id}:${vl}`, phase: 'Vote', schema: BALLOT_SCHEMA })
        .then((r) => (r ? { voter: vl, ballot: r.ballot, reason: r.reason, transcriptHandle: handle(`vote:${f.id}:${vl}`) }
                         : recordGap(gaps, 'vote', vl)))
    )).then((vs) => { f.votes = vs.filter(Boolean); });
  }));

  phase('Tally');
  const findings = assembleFindings(authored, bands); // tally + band in code (gate-core)

  return { runId, findings, gaps, stageOutcomes };
}
