#!/usr/bin/env node
/**
 * Detect which provider serves each chorus port, once per round or gate.
 *
 *   node bindings.mjs            # prints the record's `bindings` block as JSON
 *
 * Looks for a registered problem-brief skill (`problem-brief/SKILL.md`) in, in
 * order: <cwd>/.claude/skills, ${CLAUDE_HOME:-~/.claude}/skills, then each dir
 * in CHORUS_SKILL_PATH (colon-separated, for non-standard homes). With a brief,
 * the decision sink and ruling lookup route to it (BINDINGS.md); without, they
 * take the port defaults (CONDUCTOR.md § Ports). Where the brief was found, or
 * that it was not, goes to stderr. Exit 0 always: no brief is a normal state.
 * Zero dependencies; Node 18+.
 */

import { existsSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** The skill dirs searched, in order. */
export function skillDirs({ cwd = process.cwd(), env = process.env } = {}) {
  const home = env.CLAUDE_HOME || join(env.HOME || homedir(), ".claude");
  const extra = (env.CHORUS_SKILL_PATH || "").split(":").filter(Boolean);
  return [join(cwd, ".claude", "skills"), join(home, "skills"), ...extra];
}

/** The first problem-brief skill dir found, or null. */
export function findBrief(opts) {
  for (const d of skillDirs(opts)) {
    const dir = join(d, "problem-brief");
    if (existsSync(join(dir, "SKILL.md"))) return dir;
  }
  return null;
}

/** The `bindings` block a round record starts with. */
export function bindings(opts) {
  const brief = findBrief(opts);
  const sink = brief ? "problem-brief" : "default";
  return {
    brief,
    block: {
      ports: [
        { port: "decision-sink", provider: sink },
        { port: "ruling-lookup", provider: sink },
        { port: "record-validator", provider: "chorus-core" },
        { port: "record-renderer", provider: "chorus-core" },
        { port: "arbiter", provider: "default" },
        { port: "fixed-viewpoint", provider: "default" },
        { port: "memory-recall", provider: "default" },
      ],
      recoveries: [],
    },
  };
}

const invoked = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (invoked) {
  const { brief, block } = bindings();
  process.stderr.write(brief ? `problem-brief: found at ${brief}; route per BINDINGS.md\n` : "problem-brief: not found; port defaults apply (free-hand form)\n");
  process.stdout.write(JSON.stringify(block, null, 2) + "\n");
}
