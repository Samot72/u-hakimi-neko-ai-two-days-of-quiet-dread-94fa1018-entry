// "Quiet Dread" — entry for
// u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018.
//
// A dependency-free Node 22 program. It keeps a small shelf of code review
// comments that approve a pull request while carrying quiet existential
// dread, picks the headline comment, checks it against the competition
// gate (one line, 1 to 140 characters, never blank), writes it to
// entry.txt in the harness output directory, and reads the file back to
// prove the bytes survived.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The shelf, best comment first. Every comment approves the PR and lets
// the dread leak through — the winner is the approval that sounds most
// like a reviewer who has seen too many green builds.
const COMMENTS: readonly string[] = [
  "Approved. The diff is clean, the tests are green, and someday the sun will swallow this repo whole. Ship it.",
  "LGTM. The code is fine. The tests pass. Nothing we ship today will outlive the heat death of the universe, but this is fine.",
  "Approved. Merging this will not stop the eventual rewrite, but the rewrite will also be approved, so here we are.",
  "Ship it. The review is done, the pipeline is green, and entropy has already won — we are just tidying up before it arrives.",
  "Approved. I read every line. They were all correct. That has never once mattered in the end.",
];

const HEADLINE = 0;
const MIN_CHARS = 1;
const MAX_CHARS = 140;

/** Enforce the gate: one line, length counted in code points, never blank. */
function checkLine(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("comment must stay on a single line");
  }
  const count = Array.from(line).length;
  if (count < MIN_CHARS || count > MAX_CHARS) {
    throw new Error(
      `comment must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("comment must not be blank");
  }
  return count;
}

function main(): void {
  for (const line of COMMENTS) {
    checkLine(line);
  }

  const comment = COMMENTS[HEADLINE];
  const count = checkLine(comment);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = join(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, comment, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== comment) {
    throw new Error("verification failed: file content differs from the comment");
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(comment);
}

main();
