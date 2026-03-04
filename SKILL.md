# terminal-explainer

Generate rich styled terminal output using chalk, boxen, and cli-table3. A terminal-native alternative to visual-explainer — no browser required.

## Workflow

1. **Determine content type** — match the user's request to one of: architecture diagram, diff review, plan review, project recap, fact check, or implementation plan.
2. **Read references** — ALWAYS read `./references/terminal-patterns.md` before generating any output. This contains the design system, color palette, status badges, and layout patterns. Never skip this step.
3. **Read library reference** — Read `./references/libraries.md` for correct API usage of chalk, boxen, and cli-table3.
4. **Pick a template** — Review the matching template in `./templates/` for structural guidance. Use `architecture.mjs` for diagrams and overviews, `data-table.mjs` for audits and tabular data.
5. **Gather data** — Collect the relevant information (git diffs, file contents, plan documents, etc.) before generating.
6. **Generate script** — Write a self-contained `.mjs` script that imports chalk, boxen, and cli-table3. The script should render directly to stdout when run with `node`.
7. **Run it** — Execute the script with `node <script>.mjs`.
8. **Save output** — Save the generated script to `~/.agent/terminal-output/<filename>.mjs` for future reference.

## Design Principles

### Visual Weight — Three Tiers

Every element belongs to exactly one tier:

- **Hero tier** — `chalk.bold` + bright color + `boxen` with `double` or `round` border. Reserved for: titles, KPI metric cards, critical alerts. Maximum 1-2 hero elements per output.
- **Body tier** — Normal weight text, no border. Section headers use `chalk.bold.cyan('── Section Name ──')`. For: main content, tables, analysis paragraphs, component lists.
- **Recessed tier** — `chalk.dim()` everything. For: file paths, metadata, timestamps, footnotes, secondary lists.

### Whitespace as Structure

- One blank line between sections within a tier.
- Two blank lines between tier transitions (hero → body, body → recessed).
- Indent nested content with 2 spaces.
- Never let content touch the terminal edges — pad with at least 1 space.

### Semantic Color

Colors have fixed meanings. Never use a color for decoration alone:

| Color | Meaning |
|-------|---------|
| Green | Success, added, positive, verified |
| Red | Error, removed, risk, critical, incorrect |
| Yellow | Warning, changed, attention, partial |
| Cyan | Info, labels, identifiers, section headers |
| Magenta | Accent, highlights, KPI values |
| Dim | Secondary, metadata, file paths, timestamps |

### Tables Over ASCII Art

Use `cli-table3` for any structured data. Tables are scannable, dense, and handle variable-width terminals. Reserve box-drawing diagrams for architecture/flow relationships only.

### Box-Drawing Diagrams

For architecture and flow diagrams, use simple box-drawing characters:

- Color boxes by role: services = cyan, databases = green, queues = yellow, external = magenta.
- Keep diagrams under 80 columns wide and 20 lines tall.
- Use `─`, `│`, `┌`, `┐`, `└`, `┘` for boxes, `───▶` for arrows.
- Vertical connections use `│` with `▼` at endpoints.

## Anti-Patterns — Do NOT

- **Rainbow text** — Pick 2-3 accent colors max per output. Excessive color is noise.
- **Box everything** — Reserve `boxen` for hero tier and callout cards only. Body content should flow freely.
- **Figlet banners** — Large ASCII art titles waste vertical space and add no information.
- **Emoji walls** — Zero or minimal emoji. Use status badges and color instead.
- **Hardcoded widths** — Always compute from `process.stdout.columns` (default to 80 if unavailable).
- **Dense walls of text** — Break content into sections with headers and whitespace.
- **Inconsistent badge styles** — Always use the badge patterns from `terminal-patterns.md`.
