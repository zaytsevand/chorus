// gate-runner.mjs — the Workflow ENTRY for a chorus gate (feature 011, Slice 1).
//
// Deliberately tiny: it binds the Workflow runtime primitives (the ambient globals `args`,
// `agent`, `parallel`, `phase`) to the injectable shell `runGate` (gate-shell.mjs), which holds
// all the fan-out/S8/gaps logic and is executed+asserted in node by conformance C12. This file
// is the ONLY irreducibly live-runtime part: the local ESM import resolution + the global
// bindings. Everything testable lives behind runGate; this entry is what the live SC-001 run
// (the operator-gated adoption experiment) exercises.
//
// NOTE: this file is a Workflow script, not an importable ESM module — it ends in a top-level
// `return` and references runtime globals, so `node --check` will reject it by design.

import { runGate } from './gate-shell.mjs';

export const meta = {
  name: 'chorus-gate-runner',
  description: 'Bounded Workflow runner for a chorus gate: Author → Vote → Tally (Slice 1)',
  phases: [
    { title: 'Author', detail: 'one author per seated lens (uncapped findings)' },
    { title: 'Vote', detail: 'route each finding to author-excluded voters (S8)' },
    { title: 'Tally', detail: 'in-code P − O + injected-threshold band' },
  ],
};

// Bind ambient Workflow globals to the injectable shell and return its finding-centric result.
return runGate({ args, agent, parallel, phase });
