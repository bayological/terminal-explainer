# generate-diagram

Generate a rich terminal diagram for any system, concept, or codebase component.

## Instructions

1. Read `SKILL.md` for design principles and workflow.
2. Read `references/terminal-patterns.md` for the visual system — tiers, colors, badges, box-drawing patterns.
3. Read `references/libraries.md` for correct chalk, boxen, and cli-table3 API usage.
4. Review `templates/architecture.mjs` for structural guidance.
5. Analyze the user's request to determine what to diagram. If it's about existing code, read the relevant source files.
6. Generate a self-contained `.mjs` script that renders to stdout. The script must:
   - Import chalk, boxen, and cli-table3
   - Start with a hero title in double-border boxen (cyan accent)
   - Show 3-5 KPI metric cards side by side
   - Render a box-drawing diagram with components colored by role (services=cyan, databases=green, queues=yellow, external=magenta)
   - Keep the diagram under 80 columns wide and 20 lines tall
   - Include a component details table with status badges
   - End with a recessed file map or metadata section
   - Compute widths from `process.stdout.columns`
7. Save the script to `~/.agent/terminal-output/<topic>-diagram.mjs`
8. Run it with `node` and display the output.

## Anti-Patterns

- Do NOT use figlet or large ASCII art banners
- Do NOT use more than 3 accent colors
- Do NOT box every section — reserve boxen for hero title and KPI cards
- Do NOT hardcode column widths — compute from terminal size
- Do NOT use emoji for status — use chalk badge patterns instead
