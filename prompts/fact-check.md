# fact-check

Verify claims in a document against the actual codebase and render results in the terminal.

## Instructions

1. Read `SKILL.md` for design principles and workflow.
2. Read `references/terminal-patterns.md` for the visual system.
3. Read `references/libraries.md` for correct API usage.
4. Gather data:
   - Read the document to verify (user will provide the path or content)
   - Extract all factual claims (function names, file paths, behavior descriptions, architecture claims, dependency versions, config values)
   - For each claim, search the codebase to verify accuracy
   - Classify each claim: VERIFIED (matches code), INCORRECT (contradicts code), OUTDATED (was true but code changed), UNVERIFIABLE (can't determine from code alone)
5. Generate a self-contained `.mjs` script that renders:
   - **Hero title** — double-border boxen with document name (cyan accent)
   - **Accuracy bar** — progress bar showing verified percentage
   - **KPI cards** — total claims, verified, incorrect, outdated, unverifiable
   - **Claims audit table** — claim summary, verdict badge, source location, evidence
   - **Incorrect claims detail** — red section with each incorrect claim, what the doc says vs what the code shows
   - **Outdated claims detail** — yellow section with each outdated claim, what changed and when
   - **Recessed metadata** — document path, claims count, files checked, timestamp
6. Save the script to `~/.agent/terminal-output/fact-check.mjs`
7. Run it with `node`.

## Verdict Badges

- VERIFIED — `chalk.bgGreen.black.bold(' VERIFIED ')`
- INCORRECT — `chalk.bgRed.white.bold(' INCORRECT ')`
- OUTDATED — `chalk.bgYellow.black.bold(' OUTDATED ')`
- UNVERIFIABLE — `chalk.bgWhite.black(' UNVERIFIABLE ')`

## Anti-Patterns

- Do NOT mark claims as VERIFIED without checking the code
- Do NOT silently fix incorrect claims — report them with evidence
- Do NOT verify subjective claims (e.g., "clean architecture") — mark as UNVERIFIABLE
