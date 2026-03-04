# plan-review

Generate a terminal-rendered plan vs codebase audit showing implementation status.

## Instructions

1. Read `SKILL.md` for design principles and workflow.
2. Read `references/terminal-patterns.md` for the visual system.
3. Read `references/libraries.md` for correct API usage.
4. Review `templates/data-table.mjs` for structural guidance.
5. Gather data:
   - Read the plan document (user will provide the path or content)
   - Extract all requirements, features, or action items from the plan
   - For each item, search the codebase to determine implementation status (DONE, PARTIAL, MISSING)
   - Assess risk level for non-complete items (LOW, MED, HIGH, CRIT)
6. Generate a self-contained `.mjs` script that renders:
   - **Hero title** — double-border boxen with plan name as subtitle (magenta accent)
   - **KPI cards** — total requirements, implemented, partial, missing
   - **Completion progress bar** — filled/empty bar with percentage
   - **Requirements audit table** — ID, requirement name, status badge, risk badge, source file
   - **Risk breakdown** — red-bordered boxen listing CRIT and HIGH risk items
   - **Partial implementations** — collapsible detail pattern with bold summary + dim detail for each partial item
   - **Architecture comparison** — if the plan describes architecture, show current (dim) vs planned (green for new, yellow for modified)
   - **Understanding gaps** — list of plan items that couldn't be mapped to code
   - **Recessed metadata** — plan source, file count, timestamp
7. Save the script to `~/.agent/terminal-output/plan-review.mjs`
8. Run it with `node`.

## Anti-Patterns

- Do NOT mark items as DONE without verifying actual code exists
- Do NOT guess risk levels — base them on security impact, user impact, and blocking dependencies
- Do NOT skip partial implementation details — they're the most actionable part
