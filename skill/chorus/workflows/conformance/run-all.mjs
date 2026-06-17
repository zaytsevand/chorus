// run-all.mjs — conformance suite for feature 011 Slice 1 (quickstart C1–C11).
// Runs in plain node against gate-core.mjs + the frozen fixture. The deterministic checks
// (C1–C3, C5, C6, C8, C9, C11) execute fully here; C7 (hang) and C10 (live transcript handles)
// require the live Workflow runtime and are explicit SKIPs (a skip is not a pass).
//
// Run:  node skill/chorus/workflows/conformance/run-all.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  tally, deriveBand, s8Violations, isReleased, isGating,
  consistencyViolations, assembleFindings, authorStageOutcome, renderLedgerBody,
} from '../gate-core.mjs';
import { runGate } from '../gate-shell.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const fx = JSON.parse(readFileSync(here('./fixtures/frozen-gate.json'), 'utf8'));
const coreSrc = readFileSync(here('../gate-core.mjs'), 'utf8');
const runnerSrc = readFileSync(here('../gate-runner.mjs'), 'utf8');
const shellSrc = readFileSync(here('../gate-shell.mjs'), 'utf8');
const canonSrc = readFileSync(here('../../GATE-PRIMITIVE.md'), 'utf8'); // the actual canon (CF-B fix)

// assembled findings from the frozen fixture (the deterministic output under test)
const assembled = assembleFindings(fx.authored, fx.bands);

const results = [];
const check = async (id, sc, fn) => {
  try { const d = await fn(); results.push({ id, sc, status: 'PASS', detail: d || '' }); }
  catch (e) { results.push({ id, sc, status: 'FAIL', detail: e.message }); }
};
const skip = (id, sc, why) => results.push({ id, sc, status: 'SKIP', detail: why });
const assert = (c, m) => { if (!c) throw new Error(m); };

// C1 — tally parity on the frozen fixture vs expected bands (SC-001)
await check('C1', 'SC-001', () => {
  for (const f of assembled) {
    const exp = fx.expectedBands[f.id];
    assert(f.band === exp, `${f.id}: got ${f.band}, expected ${exp}`);
  }
  return `${assembled.length} findings, all bands match expected (no escape hatch)`;
});

// C2 — thresholds locked to the ACTUAL canon table parsed from GATE-PRIMITIVE.md (FR-004a, CF-B)
await check('C2', 'FR-004a', () => {
  // Require EXACTLY one ≥ row and one ≤ row, so a second threshold-shaped line in canon trips the
  // guard instead of silently binding to the first (Gate C re-verify, Beck — fail loud, not wrong).
  const escAll = canonSrc.match(/net\s*≥\s*\+?(\d+)/g) || [];
  const demAll = canonSrc.match(/net\s*≤\s*[-−]\s*(\d+)/g) || [];
  assert(escAll.length === 1 && demAll.length === 1,
    `expected exactly one ≥ and one ≤ threshold row in canon, got ${escAll.length}/${demAll.length}`);
  const esc = canonSrc.match(/net\s*≥\s*\+?(\d+)/);
  const dem = canonSrc.match(/net\s*≤\s*[-−]\s*(\d+)/);
  assert(esc && dem, 'could not parse canon thresholds from GATE-PRIMITIVE.md');
  const canon = { escalateAt: Number(esc[1]), demoteAt: -Number(dem[1]) };
  assert(fx.bands.escalateAt === canon.escalateAt && fx.bands.demoteAt === canon.demoteAt,
    `injected bands ${JSON.stringify(fx.bands)} != canon ${JSON.stringify(canon)}`);
  const literal = /(escalateAt|demoteAt)\s*[:=]\s*-?\d/;
  for (const [n, s] of [['core', coreSrc], ['shell', shellSrc], ['runner', runnerSrc]])
    assert(!literal.test(s), `gate-${n} hardcodes a threshold literal`);
  return `bands == canon parsed from GATE-PRIMITIVE.md (${JSON.stringify(canon)}); no literal in source`;
});

// C3 — executable S8: no finding on its own author ballot; planted violation is caught (SC-002)
await check('C3', 'SC-002', () => {
  assert(s8Violations(assembled).length === 0, 'clean fixture has an S8 violation');
  const planted = JSON.parse(JSON.stringify(assembled));
  planted[0].votes.push({ voter: planted[0].lens, ballot: 'PRIORITIZE', reason: 'self' });
  assert(s8Violations(planted).length === 1, 'planted self-vote not detected');
  return 'clean=0 violations; planted self-vote detected';
});

// C4 — structural honesty: runner delegates tally/band, never authors a finding/vote (SC-002/FR-005)
await check('C4', 'SC-002', () => {
  // The shell (gate-shell.mjs) now holds the fan-out; check IT delegates and never authors.
  // Strip comments + string literals so prose like "net = P − O" can't false-match (caught on first run).
  const code = shellSrc
    .replace(/\/\/[^\n]*/g, '')          // line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')    // block comments
    .replace(/'[^']*'|"[^"]*"|`[^`]*`/g, "''"); // string/template literals
  assert(/agent\(/.test(code), 'shell does not dispatch agents');
  assert(/assembleFindings\(/.test(code), 'shell does not delegate tally to gate-core');
  assert(!/function\s+(tally|deriveBand)\b/.test(code), 'shell reimplements tally/band derivation');
  assert(!/\.(ballot|proposed_severity)\s*=/.test(code), 'shell assigns a vote/severity value itself');
  return 'shell dispatches + delegates to gate-core; no in-shell tally/authoring path (also executed by C12)';
});

// C5 — fail-closed: null/🔴 gate; only explicit 🟢/🟡 release (SC-003)
await check('C5', 'SC-003', () => {
  const f5 = assembled.find((f) => f.id === 'F5');
  assert(f5.band === null, 'F5 (no votes) should have null band');
  assert(isGating(null) && !isReleased(null), 'null band must be gating');
  assert(isGating('🔴') && !isReleased('🔴'), '🔴 must be gating');
  assert(isReleased('🟢') && isReleased('🟡'), '🟢/🟡 must release');
  return 'null + 🔴 gate; 🟢/🟡 release';
});

// C6 — fault recorded + quorum floor (SC-004)
await check('C6', 'SC-004', () => {
  assert(authorStageOutcome(3) === 'ok', '3 survivors should be ok');
  assert(authorStageOutcome(2) === 'quorum-failed', '<3 survivors should be quorum-failed');
  assert(authorStageOutcome(5) === 'ok', '5 survivors should be ok');
  return 'floor=3: 2→quorum-failed, 3/5→ok';
});

// C7 — hang bounded: requires the live Workflow runtime to inject a non-returning agent
skip('C7', 'SC-004', 'requires live Workflow runtime (substrate infra-timeout → null); see research U3');

// C8 — determinism: identical inputs → byte-identical bands (SC-006)
await check('C8', 'SC-006', () => {
  const a = assembleFindings(fx.authored, fx.bands).map((f) => f.band);
  const b = assembleFindings(fx.authored, fx.bands).map((f) => f.band);
  assert(JSON.stringify(a) === JSON.stringify(b), 'bands differ across identical runs');
  return 'bands byte-identical across two runs';
});

// C9 — re-derive consistency, same injected thresholds; planted inconsistency caught (SC-007)
await check('C9', 'SC-007', () => {
  assert(consistencyViolations({ findings: assembled }, fx.bands).length === 0, 'clean fixture inconsistent');
  const planted = JSON.parse(JSON.stringify(assembled));
  planted[0].band = planted[0].band === '🔴' ? '🟢' : '🔴'; // corrupt a claimed band
  assert(consistencyViolations({ findings: planted }, fx.bands).length === 1, 'planted inconsistency missed');
  return 'clean=0; planted band-corruption detected';
});

// C10 — diagnosable handles: the shell CONSTRUCTS them (statically); C12 asserts they appear in the return
await check('C10', 'SC-008', () => {
  assert(/transcriptHandle/.test(shellSrc) && /agentLabel/.test(shellSrc), 'shell builds no transcript handle');
  assert(/author:\$\{lens\}/.test(shellSrc) && /vote:\$\{f\.id\}/.test(shellSrc), 'shell labels missing for author/vote');
  return 'shell constructs {runId,agentLabel} for author+vote (presence in return asserted by C12)';
});

// C11 — ledger reconstructable: every rendered value traces to a return field (SC-009)
await check('C11', 'SC-009', () => {
  const { text, provenance } = renderLedgerBody({ findings: assembled });
  const dataRows = text.split('\n').slice(2); // drop header + separator
  for (const f of assembled) {
    const cells = [f.id, f.lens, String(f.tally.P), String(f.tally.O), String(f.tally.net), f.band ?? '∅(gating)'];
    for (const c of cells) assert(provenance.some((p) => p.value === c), `value "${c}" (${f.id}) has no provenance`);
  }
  assert(dataRows.length === assembled.length, 'rendered row count != findings');
  return `${provenance.length} values, all byte-traceable to return fields`;
});

// C12 — END-TO-END: execute the REAL shell (runGate) with mocked runtime primitives (SC-001 live-ish, CF-A/CF-G)
// Drives the actual fan-out, flattenAuthored, S8 routing, recordGap, and assembleFindings against the
// frozen fixture — the integration the static checks could not reach. The only unexercised part is the
// Workflow runtime's own import/global binding (gate-runner.mjs), which is irreducibly live-only.
await check('C12', 'SC-001', async () => {
  const byLens = {};
  for (const f of fx.authored) (byLens[f.lens] ??= []).push(f);
  const strip = (f) => ({ id: f.id, evidence: f.evidence, pull_quote: f.pull_quote, proposed_severity: f.proposed_severity });

  const agentMock = async (_prompt, opts) => {
    const label = opts.label;
    if (label.startsWith('author:')) {
      const lens = label.slice('author:'.length);
      return { findings: (byLens[lens] ?? []).map(strip) };
    }
    // vote:<id>:<voter>
    const [, id, voter] = label.split(':');
    const f = fx.authored.find((x) => x.id === id);
    const v = (f.votes ?? []).find((x) => x.voter === voter);
    return v ? { ballot: v.ballot, reason: v.reason } : null; // no fixture vote → simulate vote-agent failure
  };
  const parallelMock = async (thunks) => Promise.all(thunks.map((t) => t()));
  const phaseMock = () => {};

  const ret = await runGate({
    args: { runId: 'test-run', bands: fx.bands, brief: 'b', corpusLocators: 'c', seated: fx.seated },
    agent: agentMock, parallel: parallelMock, phase: phaseMock,
  });

  // bands match expected (the real shell produced them, not gate-core in isolation)
  for (const f of ret.findings) {
    const exp = fx.expectedBands[f.id];
    assert(f.band === exp, `${f.id}: shell produced ${f.band}, expected ${exp}`);
  }
  // S8 holds on the live-produced return
  assert(s8Violations(ret.findings).length === 0, 'S8 violated in shell-produced return');
  // F5's voters all failed → recorded as gaps, not silently dropped (FR-006), and band fail-closed null
  const f5gaps = ret.gaps.filter((g) => g.stage === 'vote');
  assert(f5gaps.length === 4, `expected 4 vote gaps for F5, got ${f5gaps.length}`);
  assert(ret.findings.find((f) => f.id === 'F5').band === null, 'F5 (all voters failed) must be fail-closed null');
  // handles present in the return (SC-008 live)
  assert(ret.findings.every((f) => f.transcriptHandle?.agentLabel), 'a finding lacks a transcript handle');
  assert(ret.stageOutcomes.author === 'ok', '5 authors should be ok');
  return `runGate executed: ${ret.findings.length} findings, bands match, S8 clean, ${f5gaps.length} gaps recorded, F5 fail-closed`;
});

// ── report ──────────────────────────────────────────────────────────────────────────────
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
console.log('\n  Conformance — feature 011 Slice 1\n  ' + '-'.repeat(64));
for (const r of results) {
  const mark = r.status === 'PASS' ? '✓' : r.status === 'SKIP' ? '–' : '✗';
  console.log(`  ${mark} ${pad(r.id, 4)} ${pad(r.sc, 9)} ${pad(r.status, 5)} ${r.detail}`);
}
const fails = results.filter((r) => r.status === 'FAIL').length;
const skips = results.filter((r) => r.status === 'SKIP').length;
const passes = results.filter((r) => r.status === 'PASS').length;
console.log('  ' + '-'.repeat(64));
console.log(`  ${passes} pass, ${fails} fail, ${skips} skip (runtime-deferred)\n`);
process.exit(fails > 0 ? 1 : 0);
