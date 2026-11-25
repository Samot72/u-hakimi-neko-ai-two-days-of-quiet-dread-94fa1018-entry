// "Quiet Dread" — entry for
// u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018.
//
// A dependency-free Node 22 program. It keeps a small shelf of code review
// comments that approve a pull request while carrying quiet existential
// dread, picks the headline comment, checks it against the competition
// gate (one line, 1 to 140 characters, never blank), writes it to
// entry.txt in the harness output directory, and reads the file back to
// prove the bytes survived.
//
// Revision: stricter validation (reject leading/trailing whitespace and
// control characters) plus a determinism self-check — the comment is
// written twice to a scratch directory and byte-compared before the
// real entry.txt is written, so a non-deterministic write can never
// reach the entry file.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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
  // No control characters anywhere in the line (U+0000–U+001F, U+007F).
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("comment must not contain control characters");
  }
  // No leading or trailing whitespace — the entry must be exactly the line.
  if (line !== line.trim()) {
    throw new Error("comment must not have leading or trailing whitespace");
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

/** Prove the write is deterministic: write the comment twice to a scratch
 *  directory and byte-compare before the real entry.txt is touched. */
function proveDeterministic(comment: string): void {
  const scratch = mkdtempSync(join(tmpdir(), "hakimi-comment-"));
  try {
    const first = join(scratch, "a.txt");
    const second = join(scratch, "b.txt");
    writeFileSync(first, comment, { encoding: "utf8" });
    writeFileSync(second, comment, { encoding: "utf8" });
    const a = readFileSync(first);
    const b = readFileSync(second);
    if (!a.equals(b)) {
      throw new Error("determinism check failed: two writes produced different bytes");
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function main(): void {
  // Every comment on the shelf must pass the gate, not just the headline —
  // a runner-up that breaks the rules must never sit in the program.
  for (const line of COMMENTS) {
    checkLine(line);
  }

  const comment = COMMENTS[HEADLINE];
  const count = checkLine(comment);

  proveDeterministic(comment);

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
