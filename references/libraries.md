# Library Reference

API reference for terminal-explainer's core dependencies. All libraries are ESM-only in their latest versions.

## chalk 5+ (ESM-only)

```js
import chalk from 'chalk';
```

### Style Chaining

Styles chain left to right. The rightmost color wins for foreground/background:

```js
chalk.bold.red('error')           // bold + red foreground
chalk.bgRed.white.bold('ALERT')   // red background + white foreground + bold
chalk.dim.italic('metadata')      // dim + italic
```

### Available Styles

**Modifiers:** `bold`, `dim`, `italic`, `underline`, `inverse`, `strikethrough`, `hidden`

**Foreground colors:** `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`/`grey`

**Bright foreground:** `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

**Background colors:** `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`

**Bright background:** `bgRedBright`, `bgGreenBright`, `bgYellowBright`, `bgBlueBright`, `bgMagentaBright`, `bgCyanBright`, `bgWhiteBright`

### Dynamic Colors (256 / RGB)

```js
chalk.rgb(255, 136, 0)('orange text')
chalk.bgRgb(30, 30, 30)('dark background')
chalk.hex('#FF8800')('hex color')
chalk.ansi256(196)('256-color red')
```

### Template Literals

```js
const msg = chalk`{bold.red Error:} {dim file not found}`;
```

### Level Detection

```js
chalk.level  // 0 = none, 1 = basic (16), 2 = 256, 3 = truecolor
```

---

## boxen 8+ (ESM-only)

```js
import boxen from 'boxen';
```

### Basic Usage

```js
console.log(boxen('content', { padding: 1, borderStyle: 'double' }));
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `borderStyle` | string | `single`, `double`, `round`, `bold`, `singleDouble`, `doubleSingle`, `classic`, `arrow`, `none` |
| `borderColor` | string | Any chalk color name: `red`, `green`, `cyan`, `magenta`, etc. |
| `padding` | number \| object | Uniform padding or `{ top, right, bottom, left }` |
| `margin` | number \| object | Uniform margin or `{ top, right, bottom, left }` |
| `title` | string | Title text displayed on top border |
| `titleAlignment` | string | `left`, `center`, `right` |
| `width` | number | Fixed width (content will wrap) |
| `textAlignment` | string | `left`, `center`, `right` |
| `dimBorder` | boolean | Dim the border color |
| `fullscreen` | boolean \| function | Fill terminal width/height |

### Recommended Pairings by Tier

```js
// Hero tier — double border, bold content, bright border color
boxen(chalk.bold.white(title), {
  padding: 1,
  borderStyle: 'double',
  borderColor: 'cyan',
  textAlignment: 'center',
});

// Callout card — round border, colored border for semantics
boxen(content, {
  padding: { top: 0, right: 1, bottom: 0, left: 1 },
  borderStyle: 'round',
  borderColor: 'red',       // risk card
  title: 'Risk Breakdown',
  titleAlignment: 'left',
});

// KPI card — single border, compact padding
boxen(chalk.bold.magenta('42') + '\n' + chalk.dim('Total Items'), {
  padding: { top: 0, right: 2, bottom: 0, left: 2 },
  borderStyle: 'single',
  borderColor: 'magenta',
  textAlignment: 'center',
});
```

---

## cli-table3

```js
import Table from 'cli-table3';
```

### Basic Table

```js
const table = new Table({
  head: ['Name', 'Status', 'Risk'],
  style: { head: ['cyan', 'bold'] },
});

table.push(
  ['Auth module', chalk.green('DONE'), chalk.dim('—')],
  ['Rate limiter', chalk.yellow('PARTIAL'), chalk.yellow('MED')],
);

console.log(table.toString());
```

### Key Options

| Option | Type | Description |
|--------|------|-------------|
| `head` | string[] | Column headers |
| `colWidths` | number[] | Fixed column widths |
| `colAligns` | string[] | `left`, `center`, `right` per column |
| `style` | object | `head` (colors), `border` (colors), `compact` (boolean) |
| `wordWrap` | boolean | Wrap long text in cells |
| `wrapOnWordBoundary` | boolean | Wrap at word boundaries |
| `chars` | object | Override box-drawing characters |

### Compact Mode

Removes row separators for denser output:

```js
const table = new Table({
  style: { compact: true, head: ['cyan'] },
});
```

### Column Spanning

```js
table.push(
  [{ colSpan: 3, content: chalk.bold('Section Header'), hAlign: 'center' }],
  ['Col 1', 'Col 2', 'Col 3'],
);
```

### Borderless Key-Value Layout

```js
const table = new Table({
  chars: {
    top: '', 'top-mid': '', 'top-left': '', 'top-right': '',
    bottom: '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
    left: '', 'left-mid': '', mid: '', 'mid-mid': '',
    right: '', 'right-mid': '', middle: '  ',
  },
  style: { 'padding-left': 0, 'padding-right': 0 },
});

table.push(
  [chalk.dim('Author'), chalk.white('Jane Smith')],
  [chalk.dim('Date'), chalk.white('2026-03-04')],
);
```

### Computing Column Widths

```js
const cols = process.stdout.columns || 80;
const available = cols - 4; // account for table borders
const nameWidth = Math.floor(available * 0.35);
const statusWidth = Math.floor(available * 0.15);
const descWidth = available - nameWidth - statusWidth;
```

---

## cli-highlight (optional)

```js
import { highlight } from 'cli-highlight';
```

### Usage

```js
const code = `function hello() {\n  return 'world';\n}`;
console.log(highlight(code, { language: 'javascript' }));
```

Falls back to no highlighting if the language is unknown. Useful for code snippet display in diff reviews and implementation plans.
