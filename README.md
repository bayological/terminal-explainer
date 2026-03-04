# terminal-explainer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Agent skill that generates rich styled terminal output for diagrams, diff reviews, plan audits, and project recaps — no browser required.

## Why

Tools like [visual-explainer](https://github.com/nicobailon/visual-explainer) generate beautiful HTML pages, but viewing them means switching to a browser. If you're working in the terminal, that context switch breaks flow. terminal-explainer generates the same kinds of outputs — architecture diagrams, diff reviews, data tables — directly in your terminal using chalk, boxen, and cli-table3.

## Install

### Claude Code

```bash
git clone https://github.com/bayological/terminal-explainer.git ~/.claude/skills/terminal-explainer
cd ~/.claude/skills/terminal-explainer && npm install
cp prompts/*.md ~/.claude/commands/
```

### Pi

Add to your Pi configuration:

```json
{
  "packages": ["terminal-explainer"]
}
```

## Commands

| Command | Description |
|---------|-------------|
| `/generate-diagram` | Box-drawing architecture diagrams with KPIs and component tables |
| `/diff-review` | Git diff analysis with before/after architecture, code review, Good/Bad/Ugly |
| `/plan-review` | Plan vs codebase audit with completion tracking and risk assessment |
| `/project-recap` | Context-switching snapshot with recent activity and cognitive debt hotspots |
| `/fact-check` | Document verification against actual code with verdict badges |
| `/generate-plan` | Implementation plan with architecture diagrams and step-by-step breakdown |

## How It Works

```
SKILL.md (design principles)
    ↓
references/terminal-patterns.md (visual patterns, badges, layouts)
references/libraries.md (chalk, boxen, cli-table3 API)
    ↓
templates/*.mjs (structural examples)
    ↓
Generated .mjs script → node → terminal output
```

The agent reads the skill definition and reference files, gathers data (git diffs, source files, plan documents), generates a self-contained `.mjs` script, and runs it with `node`.

## Design System

| Tier | Style | Used For |
|------|-------|----------|
| **Hero** | `chalk.bold` + bright color + `boxen` double/round border | Titles, KPI cards, critical alerts |
| **Body** | Normal weight, `chalk.bold.cyan` section headers | Content, tables, analysis, diagrams |
| **Recessed** | `chalk.dim` everything | File paths, metadata, timestamps |

Semantic colors: green=success, red=error, yellow=warning, cyan=info, magenta=accent, dim=secondary.

## Tradeoffs

| | terminal-explainer | visual-explainer |
|-|-------------------|-----------------|
| **Output** | Terminal (stdout) | HTML (browser) |
| **Diagrams** | Box-drawing characters | SVG / CSS |
| **Interactivity** | None | Hover, expand/collapse |
| **Context switch** | None — stays in terminal | Opens browser tab |
| **Rich formatting** | ANSI colors, tables | Full CSS, animations |
| **Dependencies** | chalk, boxen, cli-table3 | None (standalone HTML) |
| **Sharing** | Screenshot or pipe to file | Send HTML file |

## Limitations

- Box-drawing diagrams are limited to ~80 columns and ~20 lines — complex architectures may need simplification.
- No interactivity — everything is static output. Use visual-explainer if you need hover states or collapsible sections.
- Color support depends on terminal capabilities. Most modern terminals support 256 colors; some CI environments may not.
- Output width adapts to terminal size but may not render well below 60 columns.

## Credits

- [visual-explainer](https://github.com/nicobailon/visual-explainer) by Nico Bailon — the HTML-based skill this project adapts for the terminal.
- Anthropic's frontend-design skill — inspiration for the agent skill pattern.
