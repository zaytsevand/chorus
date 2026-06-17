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

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const fx = JSON.parse(readFileSync(here('./fixtures/frozen-gate.json'), 'utf8'));
const coreSrc = readFileSync(here('../gate-core.mjs'), 'utf8');
const runnerSrc = readFileSync(here('../gate-runner.mjs'), 'utf8');

// assembled findings from the frozen fixture (the deterministic output under test)
const assembled = assembleFindings(fx.authored, fx.bands);

const results = [];
const check = (id, sc, fn) => {
  try { const d = fn(); results.push({ id, sc, status: 'PASS', detail: d || '' }); }
  catch (e) { results.push({ id, sc, status: 'FAIL', detail: e.message }); }
};
const skip = (id, sc, why) => results.push({ id, sc, status: 'SKIP', detail: why });
const assert = (c, m) => { if (!c) throw new Error(m); };

// C1 — tally parity on the frozen fixture vs expected bands (SC-001)
check('C1', 'SC-001', () => {
  for (const f of assembled) {
    const exp = fx.expectedBands[f.id];
    assert(f.band === exp, `${f.id}: got ${f.band}, expected ${exp}`);
  }
  return `${assembled.length} findings, all bands match expected (no escape hatch)`;
});

// C2 — thresholds injected (canon-locked) + no literal in runner/core (FR-004a)
check('C2', 'FR-004a', () => {
  assert(JSON.stringify(fx.bands) === JSON.stringify(fx.canonBands), 'injected bands != canon table');
  const literal = /(escalateAt|demoteAt)\s*[:=]\s*-?\d/;
  assert(!literal.test(coreSrc), 'gate-core hardcodes a threshold literal');
  assert(!literal.test(runnerSrc), 'gate-runner hardcodes a threshold literal');
  return 'bands == canon; no threshold literal in core or runner';
});

// C3 — executable S8: no finding on its own author ballot; planted violation is caught (SC-002)
check('C3', 'SC-002', () => {
  assert(s8Violations(assembled).length === 0, 'clean fixture has an S8 violation');
  const planted = JSON.parse(JSON.stringify(assembled));
  planted[0].votes.push({ voter: planted[0].lens, ballot: 'PRIORITIZE', reason: 'self' });
  assert(s8Violations(planted).length === 1, 'planted self-vote not detected');
  return 'clean=0 violations; planted self-vote detected';
});

// C4 — structural honesty: runner delegates tally/band, never authors a finding/vote (SC-002/FR-005)
check('C4', 'SC-002', () => {
  // Strip comments + string literals so prose like "net = P − O" can't false-match (caught on first run).
  const code = runnerSrc
    .replace(/\/\/[^\n]*/g, '')          // line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')    // block comments
    .replace(/'[^']*'|"[^"]*"|`[^`]*`/g, "''"); // string/template literals
  assert(/agent\(/.test(code), 'runner does not dispatch agents');
  assert(/assembleFindings\(/.test(code), 'runner does not delegate tally to gate-core');
  assert(!/function\s+(tally|deriveBand)\b/.test(code), 'runner reimplements tally/band derivation');
  assert(!/\.(ballot|proposed_severity)\s*=/.test(code), 'runner assigns a vote/severity value itself');
  return 'runner dispatches + delegates to gate-core; no in-runner tally/authoring path';
});

// C5 — fail-closed: null/🔴 gate; only explicit 🟢/🟡 release (SC-003)
check('C5', 'SC-003', () => {
  const f5 = assembled.find((f) => f.id === 'F5');
  assert(f5.band === null, 'F5 (no votes) should have null band');
  assert(isGating(null) && !isReleased(null), 'null band must be gating');
  assert(isGating('🔴') && !isReleased('🔴'), '🔴 must be gating');
  assert(isReleased('🟢') && isReleased('🟡'), '🟢/🟡 must release');
  return 'null + 🔴 gate; 🟢/🟡 release';
});

// C6 — fault recorded + quorum floor (SC-004)
check('C6', 'SC-004', () => {
  assert(authorStageOutcome(3) === 'ok', '3 survivors should be ok');
  assert(authorStageOutcome(2) === 'quorum-failed', '<3 survivors should be quorum-failed');
  assert(authorStageOutcome(5) === 'ok', '5 survivors should be ok');
  return 'floor=3: 2→quorum-failed, 3/5→ok';
});

// C7 — hang bounded: requires the live Workflow runtime to inject a non-returning agent
skip('C7', 'SC-004', 'requires live Workflow runtime (substrate infra-timeout → null); see research U3');

// C8 — determinism: identical inputs → byte-identical bands (SC-006)
check('C8', 'SC-006', () => {
  const a = assembleFindings(fx.authored, fx.bands).map((f) => f.band);
  const b = assembleFindings(fx.authored, fx.bands).map((f) => f.band);
  assert(JSON.stringify(a) === JSON.stringify(b), 'bands differ across identical runs');
  return 'bands byte-identical across two runs';
});

// C9 — re-derive consistency, same injected thresholds; planted inconsistency caught (SC-007)
check('C9', 'SC-007', () => {
  assert(consistencyViolations({ findings: assembled }, fx.bands).length === 0, 'clean fixture inconsistent');
  const planted = JSON.parse(JSON.stringify(assembled));
  planted[0].band = planted[0].band === '🔴' ? '🟢' : '🔴'; // corrupt a claimed band
  assert(consistencyViolations({ findings: planted }, fx.bands).length === 1, 'planted inconsistency missed');
  return 'clean=0; planted band-corruption detected';
});

// C10 — diagnosable handles: live handles need the runtime; here assert the runner CONSTRUCTS them
check('C10', 'SC-008', () => {
  assert(/transcriptHandle/.test(runnerSrc) && /agentLabel/.test(runnerSrc), 'runner builds no transcript handle');
  assert(/author:\$\{lens\}/.test(runnerSrc) && /vote:\$\{f\.id\}/.test(runnerSrc), 'runner labels missing for author/vote');
  return 'runner constructs {runId,agentLabel} for author+vote (live resolution deferred to runtime)';
});

// C11 — ledger reconstructable: every rendered value traces to a return field (SC-009)
check('C11', 'SC-009', () => {
  const { text, provenance } = renderLedgerBody({ findings: assembled });
  const dataRows = text.split('\n').slice(2); // drop header + separator
  for (const f of assembled) {
    const cells = [f.id, f.lens, String(f.tally.P), String(f.tally.O), String(f.tally.net), f.band ?? '∅(gating)'];
    for (const c of cells) assert(provenance.some((p) => p.value === c), `value "${c}" (${f.id}) has no provenance`);
  }
  assert(dataRows.length === assembled.length, 'rendered row count != findings');
  return `${provenance.length} values, all byte-traceable to return fields`;
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
