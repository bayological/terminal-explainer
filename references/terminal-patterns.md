# Terminal Patterns

Pattern library for terminal-explainer. Read this file before generating any output.

## Three-Tier Visual Depth

### Hero Tier

For titles, KPI cards, critical alerts. Maximum 1-2 per output.

```js
import boxen from 'boxen';
import chalk from 'chalk';

// Hero title
console.log(boxen(chalk.bold.white('Architecture Overview'), {
  padding: 1,
  borderStyle: 'double',
  borderColor: 'cyan',
  textAlignment: 'center',
}));

// Hero title with subtitle
console.log(boxen(
  chalk.bold.white('Diff Review') + '\n' + chalk.dim('main ← feature/auth-flow'),
  {
    padding: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    textAlignment: 'center',
  }
));
```

### Body Tier

Section headers, content, tables, analysis. The bulk of every output.

```js
// Section header
console.log(chalk.bold.cyan('── Component Details ──'));
console.log();

// Key-value pair
console.log(`  ${chalk.dim('Status')}  ${chalk.green('Active')}`);
console.log(`  ${chalk.dim('Version')} ${chalk.white('2.4.1')}`);

// Body paragraph with inline highlights
console.log(`  The ${chalk.cyan('AuthService')} handles token validation`);
console.log(`  and delegates to ${chalk.cyan('UserService')} for profile lookups.`);
console.log(`  ${chalk.yellow('Note:')} Rate limiting is not yet implemented.`);
```

### Recessed Tier

File paths, metadata, timestamps, secondary information.

```js
// Dim file list
console.log(chalk.dim('  src/auth/service.ts'));
console.log(chalk.dim('  src/auth/middleware.ts'));
console.log(chalk.dim('  src/auth/types.ts'));
console.log(chalk.dim('  ... and 12 more'));

// Metadata footer
console.log();
console.log(chalk.dim(`  Generated ${new Date().toISOString().slice(0, 16)} · terminal-explainer v0.1.0`));
```

---

## Section Dividers

```js
const cols = process.stdout.columns || 80;

// Plain divider
console.log(chalk.dim('─'.repeat(Math.min(cols - 2, 78))));

// Labeled divider
const label = ' Risk Analysis ';
const lineLen = Math.min(cols - 2, 78);
const side = Math.floor((lineLen - label.length) / 2);
console.log(chalk.dim('─'.repeat(side)) + chalk.bold.cyan(label) + chalk.dim('─'.repeat(lineLen - side - label.length)));
```

---

## Color Palette

| Color | chalk | Semantic Meaning |
|-------|-------|-----------------|
| Green | `chalk.green` / `chalk.bgGreen.black` | Success, added, positive, verified, PASS, DONE |
| Red | `chalk.red` / `chalk.bgRed.white` | Error, removed, risk, critical, incorrect, FAIL, CRIT |
| Yellow | `chalk.yellow` / `chalk.bgYellow.black` | Warning, changed, attention, partial, WARN, MED |
| Cyan | `chalk.cyan` / `chalk.bold.cyan` | Info, labels, identifiers, section headers |
| Magenta | `chalk.magenta` / `chalk.bold.magenta` | Accent, highlights, KPI values |
| White | `chalk.white` / `chalk.bold.white` | Primary text, hero content |
| Dim | `chalk.dim` | Secondary, metadata, file paths, timestamps |

---

## Status Badges

Consistent badge formatting for all status indicators:

```js
const badge = {
  // Status
  PASS:       chalk.bgGreen.black.bold(' PASS '),
  DONE:       chalk.bgGreen.black.bold(' DONE '),
  FAIL:       chalk.bgRed.white.bold(' FAIL '),
  WARN:       chalk.bgYellow.black.bold(' WARN '),
  PARTIAL:    chalk.bgYellow.black.bold(' PARTIAL '),
  MISSING:    chalk.bgRed.white.bold(' MISSING '),

  // Risk levels
  LOW:        chalk.bgGreen.black.bold(' LOW '),
  MED:        chalk.bgYellow.black.bold(' MED '),
  HIGH:       chalk.bgRed.white.bold(' HIGH '),
  CRIT:       chalk.bgRed.white.bold(' CRIT '),

  // Verification
  VERIFIED:   chalk.bgGreen.black.bold(' VERIFIED '),
  INCORRECT:  chalk.bgRed.white.bold(' INCORRECT '),
  OUTDATED:   chalk.bgYellow.black.bold(' OUTDATED '),
  UNVERIFIABLE: chalk.bgWhite.black(' UNVERIFIABLE '),

  // Generic
  NEW:        chalk.bgGreen.black.bold(' NEW '),
  MODIFIED:   chalk.bgYellow.black.bold(' MODIFIED '),
  REMOVED:    chalk.bgRed.white.bold(' REMOVED '),
  UNCHANGED:  chalk.dim(' UNCHANGED '),
};
```

---

## Box-Drawing Diagrams

For architecture and flow diagrams. Color boxes by role.

```js
// Color mapping by component role
const boxColor = {
  service:  chalk.cyan,
  database: chalk.green,
  queue:    chalk.yellow,
  external: chalk.magenta,
  client:   chalk.white,
};

// Single component box
function drawBox(label, color) {
  const c = color || chalk.cyan;
  const pad = 2;
  const inner = ' '.repeat(pad) + label + ' '.repeat(pad);
  const width = inner.length;
  return [
    c('┌' + '─'.repeat(width) + '┐'),
    c('│') + inner + c('│'),
    c('└' + '─'.repeat(width) + '┘'),
  ];
}

// Horizontal arrow
function hArrow(length = 6, label = '') {
  if (label) {
    const arrow = '─'.repeat(Math.max(1, length - label.length - 2)) + '▶';
    return chalk.dim(` ${label} ${arrow}`);
  }
  return chalk.dim('─'.repeat(length - 1) + '▶');
}

// Vertical arrow
function vArrow(height = 1) {
  const lines = [];
  for (let i = 0; i < height; i++) lines.push(chalk.dim('     │'));
  lines.push(chalk.dim('     ▼'));
  return lines;
}
```

### Layout Rules

- Maximum 80 columns wide, 20 lines tall
- Use `process.stdout.columns` to check available width
- Center diagrams if terminal is wider than content
- Connect components with `───▶` (horizontal) or `│` + `▼` (vertical)
- Group related components vertically
- Keep crossing lines to a minimum

---

## KPI / Metric Cards

Use boxen for metric cards. Display side by side with the `sideBySide()` helper.

```js
function kpiCard(value, label, color = 'magenta') {
  return boxen(
    chalk.bold[color](String(value)) + '\n' + chalk.dim(label),
    {
      padding: { top: 0, right: 2, bottom: 0, left: 2 },
      borderStyle: 'single',
      borderColor: color,
      textAlignment: 'center',
    }
  );
}

// Side-by-side layout: zip lines of multiple boxen outputs
function sideBySide(boxes, gap = 2) {
  const splits = boxes.map(b => b.split('\n'));
  const maxH = Math.max(...splits.map(s => s.length));
  const widths = splits.map(s => Math.max(...s.map(l => stripAnsi(l).length)));
  const lines = [];
  for (let i = 0; i < maxH; i++) {
    const parts = splits.map((s, idx) => {
      const line = s[i] || '';
      const visible = stripAnsi(line).length;
      return line + ' '.repeat(Math.max(0, widths[idx] - visible));
    });
    lines.push(parts.join(' '.repeat(gap)));
  }
  return lines.join('\n');
}

// Minimal ANSI strip (for width calculations)
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// Usage
console.log(sideBySide([
  kpiCard(42, 'Total Files'),
  kpiCard(18, 'Added', 'green'),
  kpiCard(7, 'Modified', 'yellow'),
  kpiCard(3, 'Deleted', 'red'),
]));
```

---

## Progress Bars

```js
function progressBar(ratio, width = 30, label = '') {
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const pct = Math.round(ratio * 100);
  const color = ratio >= 0.8 ? chalk.green : ratio >= 0.5 ? chalk.yellow : chalk.red;
  const bar = color('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
  const suffix = label ? ` ${chalk.dim(label)}` : '';
  return `  ${bar} ${color(`${pct}%`)}${suffix}`;
}
```

---

## Collapsible Detail Pattern

Use bold summary lines with dim indented details beneath:

```js
// Summary line (always shown)
console.log(`  ${chalk.bold('▸ Rate Limiting')} ${chalk.yellow('PARTIAL')}`);

// Detail (shown when expanded / in detailed mode)
console.log(chalk.dim('    Middleware exists but per-user limits not enforced.'));
console.log(chalk.dim('    See: src/middleware/rate-limit.ts:42'));
```

---

## Code Snippet Display

Simple keyword highlighting without cli-highlight dependency:

```js
function codeBlock(code, indent = 4) {
  const prefix = ' '.repeat(indent);
  const highlighted = code
    .replace(/\b(function|const|let|var|return|if|else|import|export|from|async|await)\b/g,
      match => chalk.magenta(match))
    .replace(/(["'`])(?:(?!\1).)*\1/g, match => chalk.green(match))
    .replace(/\/\/.*/g, match => chalk.dim(match));

  return highlighted
    .split('\n')
    .map(line => prefix + chalk.dim('│ ') + line)
    .join('\n');
}
```

---

## Terminal Width Awareness

Always compute layout from terminal dimensions:

```js
const cols = process.stdout.columns || 80;

// Scale table widths
const tableWidth = Math.min(cols - 4, 120);

// Scale dividers
const dividerWidth = Math.min(cols - 2, 78);

// Scale diagram width
const diagramWidth = Math.min(cols - 4, 76);
```
