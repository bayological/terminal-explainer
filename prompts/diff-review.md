# diff-review

Generate a terminal-rendered diff review with architecture comparison and code analysis.

## Instructions

1. Read `SKILL.md` for design principles and workflow.
2. Read `references/terminal-patterns.md` for the visual system.
3. Read `references/libraries.md` for correct API usage.
4. Gather diff data:
   - Run `git diff --stat` for file change summary
   - Run `git diff` for full changes
   - Run `git log --oneline -5` for recent commit context
   - Identify the base and head branches/commits
5. Analyze the diff: categorize changes, identify architectural impact, assess risk.
6. Generate a self-contained `.mjs` script that renders:
   - **Hero title** — double-border boxen with branch info as subtitle (cyan accent)
   - **KPI cards** — files changed, additions, deletions, net change
   - **Before/After architecture** — two box-drawing diagrams side by side or stacked, with changed components highlighted in yellow and new ones in green
   - **Code review table** — cli-table3 with columns: File, Change Type (badge), Risk, Summary
   - **The Good** — green-bordered round boxen listing positive changes
   - **The Bad** — yellow-bordered round boxen listing concerns
   - **The Ugly** — red-bordered round boxen listing risks and issues (omit if none)
   - **Decision log** — table of key decisions with rationale
   - **Recessed metadata** — reviewer info, timestamp, commit range
7. Save the script to `~/.agent/terminal-output/diff-review.mjs`
8. Run it with `node`.

## Anti-Patterns

- Do NOT dump raw diffs — summarize and categorize
- Do NOT show every file — focus on significant changes, group trivial ones
- Do NOT skip the architecture comparison for non-trivial changes
