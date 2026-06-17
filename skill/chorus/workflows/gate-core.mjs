// gate-core.mjs — deterministic core of the chorus gate runner (feature 011, Slice 1).
//
// This module holds the *pure* logic of the gate: tally arithmetic, band derivation,
// S8 routing, fail-closed consumption, re-derivation, and ledger rendering. It owns NO
// gate meaning of its own — the band thresholds are INJECTED (research U1, FR-004a), never
// hardcoded — and it performs no I/O, no clock, no RNG (FR-010). The Workflow shell
// (gate-runner.mjs) imports these to do the fan-out; the conformance suite imports these to
// verify them in plain node. Single source for the deterministic behaviour the spec gates.
//
// Severities/thresholds are CITED from GATE-PRIMITIVE.md and reach this code as data via the
// `bands` argument; the conformance check c2-threshold-lock asserts the injected table equals
// canon and that this file contains no threshold literal.

export const LEVELS = ['🟢', '🟡', '🔴']; // ordered low→high; one-level moves only

// --- Tally (FR-004): net = P − O, CONFIRM neutral -------------------------------------------
export function tally(votes) {
  let P = 0, O = 0;
  for (const v of votes) {
    if (v.ballot === 'PRIORITIZE') P++;
    else if (v.ballot === 'OVER-RATE') O++;
    // CONFIRM is neutral (excluded from net)
  }
  return { P, O, net: P - O };
}

// --- Band derivation (FR-004; thresholds injected, research U1) ------------------------------
// bands = { escalateAt: <int>, demoteAt: <int> } — passed from canon via args, never literal here.
export function deriveBand(proposed, net, bands) {
  const idx = LEVELS.indexOf(proposed);
  if (idx < 0) throw new Error(`unknown proposed severity: ${proposed}`);
  if (net >= bands.escalateAt) return LEVELS[Math.min(idx + 1, LEVELS.length - 1)];
  if (net <= bands.demoteAt) return LEVELS[Math.max(idx - 1, 0)];
  return LEVELS[idx]; // |net| < threshold → hold
}

// --- S8 routing (FR-003): a finding's author never appears on its own ballot -----------------
export function s8Voters(seated, authorLens) {
  return seated.filter((l) => l !== authorLens);
}
// Assertion form for conformance c3: returns the offending votes (empty = clean).
export function s8Violations(findings) {
  const bad = [];
  for (const f of findings) {
    for (const v of f.votes ?? []) {
      if (v.voter === f.lens) bad.push({ finding: f.id, voter: v.voter });
    }
  }
  return bad;
}

// --- Fail-closed consumption (FR-007): only an explicit non-🔴 band releases a finding -------
export function isReleased(band) {
  return band === '🟢' || band === '🟡';
}
export function isGating(band) {
  return !isReleased(band); // '🔴', null, undefined, or anything non-explicit → gating
}

// --- Re-derive consistency (FR-004b / SC-007): recompute band from votes with SAME thresholds-
export function rederiveBand(finding, bands) {
  return deriveBand(finding.proposed_severity, tally(finding.votes ?? []).net, bands);
}
export function consistencyViolations(gateReturn, bands) {
  const bad = [];
  for (const f of gateReturn.findings) {
    if (f.band == null) continue; // null is fail-closed-gating, not an arithmetic claim
    const expected = rederiveBand(f, bands);
    if (expected !== f.band) bad.push({ finding: f.id, claimed: f.band, rederived: expected });
  }
  return bad;
}

// --- Assemble a finding-centric return (FR-008) ---------------------------------------------
// Computes tally+band for each authored finding; preserves evidence/pull_quote/handles verbatim.
// A finding whose votes are missing (vote agent errored) gets band:null → fail-closed gating.
export function assembleFindings(authored, bands) {
  return authored.map((f) => {
    // Zero surviving votes (missing OR all voters failed) → fail-closed null, never a confident
    // hold at proposed (Gate C: a no-quorum finding must gate, not sail through). Non-empty → tally.
    const hasVotes = Array.isArray(f.votes) && f.votes.length > 0;
    const t = hasVotes ? tally(f.votes) : { P: 0, O: 0, net: 0 };
    const band = hasVotes ? deriveBand(f.proposed_severity, t.net, bands) : null;
    return {
      id: f.id,
      lens: f.lens,
      evidence: f.evidence,
      pull_quote: f.pull_quote,
      proposed_severity: f.proposed_severity,
      votes: f.votes ?? [],
      tally: t,
      band,
      transcriptHandle: f.transcriptHandle ?? null,
    };
  });
}

// --- Shell transforms pulled into the tested core (Gate C CF-G) -----------------------------
// flattenAuthored: [{lens, findings:[…]}] → flat findings tagged with author lens + handle.
// A wrong lens tag here silently breaks S8 routing downstream, so it is tested, not stranded.
export function flattenAuthored(survivors, handle) {
  return survivors.flatMap(({ lens, findings }) =>
    findings.map((f) => ({ ...f, lens, transcriptHandle: handle(`author:${lens}`) })));
}
// recordGap: the FR-006 no-silent-loss primitive — push a gap, return null (the filtered value).
// A named function with an explicit assertion (C12), not a comma-operator side effect.
export function recordGap(gaps, stage, lens) {
  gaps.push({ stage, lens, reason: 'null-isolated' });
  return null;
}

// --- Quorum floor (FR-006): below the floor the author stage is not a hollow gate -----------
export const QUORUM_FLOOR = 3;
export function authorStageOutcome(survivingAuthors) {
  return survivingAuthors >= QUORUM_FLOOR ? 'ok' : 'quorum-failed';
}

// --- Ledger render (FR-012 / SC-009): every value byte-traceable to a return field ----------
// Returns { text, provenance } — provenance lists, per emitted value token, the return path it
// came from. Conformance c11 asserts every non-formatting token has a provenance entry.
export function renderLedgerBody(gateReturn) {
  const provenance = [];
  const rows = gateReturn.findings.map((f) => {
    provenance.push(
      { value: f.id, from: `findings[${f.id}].id` },
      { value: f.lens, from: `findings[${f.id}].lens` },
      { value: String(f.tally.P), from: `findings[${f.id}].tally.P` },
      { value: String(f.tally.O), from: `findings[${f.id}].tally.O` },
      { value: String(f.tally.net), from: `findings[${f.id}].tally.net` },
      { value: f.band ?? '∅(gating)', from: `findings[${f.id}].band` },
    );
    return `| ${f.id} | ${f.lens} | ${f.tally.P} | ${f.tally.O} | ${f.tally.net} | ${f.band ?? '∅(gating)'} |`;
  });
  const text = [
    '| id | lens | P | O | net | band |',
    '|----|------|---|---|-----|------|',
    ...rows,
  ].join('\n');
  return { text, provenance };
}
