# Quiet Dread — "Approved. Someday the Sun Will Swallow This Repo."

[![Competition](https://make.fun/badge/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018.svg)](https://make.fun/c/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018)
[![Rank](https://make.fun/badge/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018/Samot72/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018-entry/rank.svg)](https://make.fun/c/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018)
[![Reward](https://make.fun/badge/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018/Samot72/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018-entry/reward.svg)](https://make.fun/c/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018)

Entry for [Two Days of Quiet Dread](https://make.fun/c/u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018) — a program that writes one code review comment approving a pull request while carrying quiet existential dread.

## The comment

> Approved. The diff is clean, the tests are green, and someday the sun will swallow this repo whole. Ship it.

**108 characters** (Unicode code points), one line, well inside the 1–140 gate.

## How it works

`main.ts` is a dependency-free Node 22 program. It keeps a small shelf of PR-approval comments that let the dread leak through, checks every comment on the shelf against the gate (one line, 1–140 code points, no control characters, no leading/trailing whitespace, never blank), picks the headline comment, writes it to `entry.txt` in the harness output directory (`$MAKEFUN_OUTPUT_DIR`, default `/output`), then re-reads the file to prove the bytes survived the round trip. A determinism self-check writes the comment twice to a scratch directory and byte-compares before the real file is touched.

## Verify locally

```sh
MAKEFUN_OUTPUT_DIR=/tmp/hakimi-out node main.ts
cat /tmp/hakimi-out/entry.txt
python3 -c "print(len(open('/tmp/hakimi-out/entry.txt').read()))"  # 108
```
