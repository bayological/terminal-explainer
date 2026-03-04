# project-recap

Generate a terminal-rendered project context snapshot for resuming work after context switches.

## Instructions

1. Read `SKILL.md` for design principles and workflow.
2. Read `references/terminal-patterns.md` for the visual system.
3. Read `references/libraries.md` for correct API usage.
4. Gather project state:
   - Run `git log --oneline -20` for recent commits
   - Run `git log --since="7 days ago" --oneline` for weekly activity
   - Run `git diff --stat HEAD~10` for recent change scope
   - Run `git branch -a` for branch context
   - Read key config files (package.json, README, etc.) for project overview
   - Identify recently modified files with `git log --diff-filter=M --name-only --since="7 days ago"`
5. Analyze: identify architecture, recent decisions, work in progress, and cognitive debt.
6. Generate a self-contained `.mjs` script that renders:
   - **Hero title** — double-border boxen with project name and branch (cyan accent)
   - **KPI cards** — commits (7d), files changed, contributors, open branches
   - **Architecture snapshot** — box-drawing diagram of current system structure
   - **Recent activity table** — date, commit, author, files changed, summary
   - **Decision log** — inferred decisions from commits/code with rationale
   - **Cognitive debt hotspots** — files with frequent changes, TODOs, complex functions, identified via git churn and grep
   - **What to look at first** — prioritized list of 3-5 items to review, based on recency and importance
   - **Recessed metadata** — project root, branch, last commit, timestamp
7. Save the script to `~/.agent/terminal-output/project-recap.mjs`
8. Run it with `node`.

## Anti-Patterns

- Do NOT list every commit — group and summarize by theme
- Do NOT guess at architecture — base it on actual project structure
- Do NOT include stale information — focus on the last 1-2 weeks
