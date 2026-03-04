# generate-plan

Generate a terminal-rendered implementation plan with architecture diagrams and step-by-step breakdown.

## Instructions

1. Read `SKILL.md` for design principles and workflow.
2. Read `references/terminal-patterns.md` for the visual system.
3. Read `references/libraries.md` for correct API usage.
4. Analyze the task:
   - Understand the feature or change being planned
   - Read relevant existing source files
   - Identify affected components, dependencies, and integration points
   - Determine what's new, what's modified, and what's unchanged
5. Generate a self-contained `.mjs` script that renders:
   - **Hero title** — double-border boxen with feature name (cyan accent)
   - **Problem statement** — brief description of current state and why the change is needed
   - **Architecture diagram** — box-drawing diagram showing:
     - New components in green
     - Modified components in yellow
     - Unchanged components in dim
     - Connections and data flow with arrows
   - **Implementation steps table** — step number, task, files affected, complexity (LOW/MED/HIGH badge), estimated scope
   - **Edge cases** — numbered list of edge cases to handle, with severity badges
   - **Code snippets** — key implementation patterns using the code block display pattern (dim `│` prefix with keyword highlighting)
   - **Dependencies** — table of packages, APIs, or services required, with status (EXISTS/NEEDED badge)
   - **Recessed metadata** — affected file count, new file count, timestamp
6. Save the script to `~/.agent/terminal-output/plan-<feature>.mjs`
7. Run it with `node`.

## Component Colors in Diagrams

- New components: `chalk.green` borders and labels
- Modified components: `chalk.yellow` borders and labels
- Unchanged components: `chalk.dim` borders and labels
- External dependencies: `chalk.magenta` borders and labels

## Anti-Patterns

- Do NOT plan vaguely — every step should reference specific files and functions
- Do NOT skip edge cases — they're what separates a plan from a wish list
- Do NOT include implementation details for unchanged components
