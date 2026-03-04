#!/usr/bin/env node

/**
 * Architecture overview template — demonstrates hero titles, KPI cards,
 * box-drawing diagrams, component tables, and recessed file maps.
 *
 * Run: node templates/architecture.mjs
 */

import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

const cols = process.stdout.columns || 80;

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

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

function divider(label = '') {
  const width = Math.min(cols - 2, 78);
  if (!label) return chalk.dim('─'.repeat(width));
  const padded = ` ${label} `;
  const side = Math.floor((width - padded.length) / 2);
  return chalk.dim('─'.repeat(side)) + chalk.bold.cyan(padded) + chalk.dim('─'.repeat(width - side - padded.length));
}

const badge = {
  PASS: chalk.bgGreen.black.bold(' PASS '),
  DONE: chalk.bgGreen.black.bold(' DONE '),
  WARN: chalk.bgYellow.black.bold(' WARN '),
  FAIL: chalk.bgRed.white.bold(' FAIL '),
  PARTIAL: chalk.bgYellow.black.bold(' PARTIAL '),
};

// ── Hero Title ───────────────────────────────────────────────────────────────

console.log();
console.log(boxen(
  chalk.bold.white('Authentication System') + '\n' + chalk.dim('Architecture Overview'),
  {
    padding: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    textAlignment: 'center',
  }
));

// ── KPI Cards ────────────────────────────────────────────────────────────────

console.log();
console.log(sideBySide([
  kpiCard('6', 'Services', 'cyan'),
  kpiCard('2', 'Databases', 'green'),
  kpiCard('1', 'Queue', 'yellow'),
  kpiCard('99.7%', 'Uptime', 'magenta'),
]));


// ── System Diagram ───────────────────────────────────────────────────────────

console.log();
console.log();
console.log(chalk.bold.cyan('── System Architecture ──'));
console.log();

// Box drawing helper
function drawBox(label, colorFn) {
  const pad = 1;
  const inner = ' '.repeat(pad) + label + ' '.repeat(pad);
  const w = inner.length;
  return [
    colorFn('┌' + '─'.repeat(w) + '┐'),
    colorFn('│') + inner + colorFn('│'),
    colorFn('└' + '─'.repeat(w) + '┘'),
  ];
}

const client   = drawBox('Client App',   chalk.white);
const gateway  = drawBox('API Gateway',  chalk.cyan);
const auth     = drawBox('Auth Service', chalk.cyan);
const user     = drawBox('User Service', chalk.cyan);
const session  = drawBox('Session Svc',  chalk.cyan);
const redis    = drawBox('Redis',        chalk.green);
const postgres = drawBox('PostgreSQL',   chalk.green);
const queue    = drawBox('Event Queue',  chalk.yellow);

// Layout — render row by row
const indent = '  ';

// Row 1: Client
for (const line of client) console.log(indent + '                  ' + line);
console.log(indent + '                       │');
console.log(indent + '                       ▼');

// Row 2: API Gateway
for (const line of gateway) console.log(indent + '                 ' + line);
console.log(indent + '            ┌──────────┼──────────┐');
console.log(indent + '            ▼          ▼          ▼');

// Row 3: Three services side by side
for (let i = 0; i < 3; i++) {
  console.log(indent + '   ' + auth[i] + '   ' + user[i] + '   ' + session[i]);
}
console.log(indent + '        │          │            │');
console.log(indent + '        ▼          ▼            ▼');

// Row 4: Data stores
for (let i = 0; i < 3; i++) {
  console.log(indent + '    ' + redis[i] + '   ' + postgres[i] + '   ' + queue[i]);
}

console.log();

// Legend
console.log(indent + chalk.dim('Legend: ') +
  chalk.cyan('■') + chalk.dim(' Service  ') +
  chalk.green('■') + chalk.dim(' Database  ') +
  chalk.yellow('■') + chalk.dim(' Queue  ') +
  chalk.white('■') + chalk.dim(' Client'));


// ── Component Details Table ──────────────────────────────────────────────────

console.log();
console.log();
console.log(chalk.bold.cyan('── Component Details ──'));
console.log();

const table = new Table({
  head: ['Component', 'Type', 'Status', 'Port', 'Description'],
  style: { head: ['cyan', 'bold'], compact: true },
  wordWrap: true,
});

table.push(
  ['API Gateway',  chalk.cyan('service'),  badge.PASS,    ':8080', 'Rate limiting, routing, JWT validation'],
  ['Auth Service', chalk.cyan('service'),  badge.PASS,    ':3001', 'Login, registration, token issuance'],
  ['User Service', chalk.cyan('service'),  badge.PASS,    ':3002', 'Profile CRUD, avatar upload'],
  ['Session Svc',  chalk.cyan('service'),  badge.PARTIAL, ':3003', 'Session management, refresh tokens'],
  ['Redis',        chalk.green('database'), badge.PASS,    ':6379', 'Session cache, rate limit counters'],
  ['PostgreSQL',   chalk.green('database'), badge.PASS,    ':5432', 'User data, audit logs'],
  ['Event Queue',  chalk.yellow('queue'),   badge.WARN,    ':5672', 'Async events (email, audit)'],
);

console.log(table.toString());


// ── File Map (Recessed) ──────────────────────────────────────────────────────

console.log();
console.log();
console.log(chalk.bold.cyan('── File Map ──'));
console.log();

const files = [
  'src/gateway/index.ts',
  'src/gateway/middleware/rate-limit.ts',
  'src/gateway/middleware/jwt.ts',
  'src/auth/service.ts',
  'src/auth/routes.ts',
  'src/auth/strategies/local.ts',
  'src/user/service.ts',
  'src/user/routes.ts',
  'src/session/service.ts',
  'src/session/store.ts',
  'src/shared/db.ts',
  'src/shared/queue.ts',
  'docker-compose.yml',
  'migrations/001_users.sql',
  'migrations/002_sessions.sql',
];

const shown = 10;
for (let i = 0; i < shown && i < files.length; i++) {
  console.log(chalk.dim(`  ${files[i]}`));
}
if (files.length > shown) {
  console.log(chalk.dim(`  ... and ${files.length - shown} more`));
}


// ── Footer ───────────────────────────────────────────────────────────────────

console.log();
console.log(divider());
console.log(chalk.dim(`  Generated ${new Date().toISOString().slice(0, 16)} · terminal-explainer v0.1.0`));
console.log();
