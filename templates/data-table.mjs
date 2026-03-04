#!/usr/bin/env node

/**
 * Data table template — demonstrates plan-vs-codebase audit with KPI cards,
 * progress bars, requirements tables, risk breakdown, and collapsible details.
 *
 * Run: node templates/data-table.mjs
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

function progressBar(ratio, width = 30, label = '') {
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const pct = Math.round(ratio * 100);
  const color = ratio >= 0.8 ? chalk.green : ratio >= 0.5 ? chalk.yellow : chalk.red;
  const bar = color('█'.repeat(filled)) + chalk.dim('░'.repeat(empty));
  const suffix = label ? ` ${chalk.dim(label)}` : '';
  return `  ${bar} ${color(`${pct}%`)}${suffix}`;
}

function divider(label = '') {
  const width = Math.min(cols - 2, 78);
  if (!label) return chalk.dim('─'.repeat(width));
  const padded = ` ${label} `;
  const side = Math.floor((width - padded.length) / 2);
  return chalk.dim('─'.repeat(side)) + chalk.bold.cyan(padded) + chalk.dim('─'.repeat(width - side - padded.length));
}

const badge = {
  DONE:    chalk.bgGreen.black.bold(' DONE '),
  PARTIAL: chalk.bgYellow.black.bold(' PARTIAL '),
  MISSING: chalk.bgRed.white.bold(' MISSING '),
  LOW:     chalk.bgGreen.black.bold(' LOW '),
  MED:     chalk.bgYellow.black.bold(' MED '),
  HIGH:    chalk.bgRed.white.bold(' HIGH '),
  CRIT:    chalk.bgRed.white.bold(' CRIT '),
};

// ── Fake Data ────────────────────────────────────────────────────────────────

const requirements = [
  { id: 'REQ-001', name: 'User registration',         status: 'DONE',    risk: null,   file: 'src/auth/register.ts' },
  { id: 'REQ-002', name: 'Email verification',         status: 'DONE',    risk: null,   file: 'src/auth/verify.ts' },
  { id: 'REQ-003', name: 'Password reset flow',        status: 'DONE',    risk: null,   file: 'src/auth/reset.ts' },
  { id: 'REQ-004', name: 'OAuth2 Google login',        status: 'DONE',    risk: null,   file: 'src/auth/oauth/google.ts' },
  { id: 'REQ-005', name: 'OAuth2 GitHub login',        status: 'DONE',    risk: null,   file: 'src/auth/oauth/github.ts' },
  { id: 'REQ-006', name: 'JWT token rotation',         status: 'DONE',    risk: null,   file: 'src/auth/jwt.ts' },
  { id: 'REQ-007', name: 'Role-based access control',  status: 'DONE',    risk: null,   file: 'src/rbac/index.ts' },
  { id: 'REQ-008', name: 'Admin dashboard',            status: 'DONE',    risk: null,   file: 'src/admin/dashboard.ts' },
  { id: 'REQ-009', name: 'User profile CRUD',          status: 'DONE',    risk: null,   file: 'src/user/profile.ts' },
  { id: 'REQ-010', name: 'Rate limiting',              status: 'PARTIAL', risk: 'HIGH', file: 'src/middleware/rate-limit.ts', note: 'Global limits exist, per-user limits missing' },
  { id: 'REQ-011', name: 'Input validation',           status: 'PARTIAL', risk: 'MED',  file: 'src/middleware/validate.ts', note: 'Validates auth routes only, not CRUD' },
  { id: 'REQ-012', name: 'Audit logging',              status: 'PARTIAL', risk: 'MED',  file: 'src/shared/audit.ts', note: 'Logs auth events, missing admin actions' },
  { id: 'REQ-013', name: 'Session management',         status: 'PARTIAL', risk: 'LOW',  file: 'src/session/index.ts', note: 'Basic sessions work, concurrent limit not enforced' },
  { id: 'REQ-014', name: 'API versioning',             status: 'PARTIAL', risk: 'LOW',  file: 'src/gateway/versioning.ts', note: 'v1 prefix exists, no content negotiation' },
  { id: 'REQ-015', name: 'WebSocket notifications',    status: 'MISSING', risk: 'MED',  file: null },
  { id: 'REQ-016', name: 'Two-factor authentication',  status: 'MISSING', risk: 'CRIT', file: null },
  { id: 'REQ-017', name: 'Account deletion (GDPR)',    status: 'MISSING', risk: 'HIGH', file: null },
  { id: 'REQ-018', name: 'API rate limit dashboard',   status: 'MISSING', risk: 'LOW',  file: null },
];

const done    = requirements.filter(r => r.status === 'DONE').length;
const partial = requirements.filter(r => r.status === 'PARTIAL').length;
const missing = requirements.filter(r => r.status === 'MISSING').length;
const total   = requirements.length;
const completionRatio = (done + partial * 0.5) / total;


// ── Hero Title ───────────────────────────────────────────────────────────────

console.log();
console.log(boxen(
  chalk.bold.white('Plan vs Codebase Audit') + '\n' + chalk.dim('Authentication System — Sprint 4'),
  {
    padding: 1,
    borderStyle: 'double',
    borderColor: 'magenta',
    textAlignment: 'center',
  }
));


// ── KPI Cards ────────────────────────────────────────────────────────────────

console.log();
console.log(sideBySide([
  kpiCard(total, 'Requirements', 'magenta'),
  kpiCard(done, 'Implemented', 'green'),
  kpiCard(partial, 'Partial', 'yellow'),
  kpiCard(missing, 'Missing', 'red'),
]));


// ── Progress Bar ─────────────────────────────────────────────────────────────

console.log();
console.log(chalk.bold.cyan('── Completion ──'));
console.log();
console.log(progressBar(completionRatio, 40, `${done} done + ${partial} partial of ${total}`));


// ── Requirements Audit Table ─────────────────────────────────────────────────

console.log();
console.log();
console.log(chalk.bold.cyan('── Requirements Audit ──'));
console.log();

const table = new Table({
  head: ['ID', 'Requirement', 'Status', 'Risk', 'File'],
  style: { head: ['cyan', 'bold'], compact: true },
  colWidths: [10, 30, 12, 8, null],
  wordWrap: true,
});

for (const req of requirements) {
  table.push([
    chalk.dim(req.id),
    req.name,
    badge[req.status],
    req.risk ? badge[req.risk] : chalk.dim('—'),
    req.file ? chalk.dim(req.file) : chalk.dim('—'),
  ]);
}

console.log(table.toString());


// ── Risk Breakdown ───────────────────────────────────────────────────────────

console.log();
console.log();

const critItems = requirements.filter(r => r.risk === 'CRIT');
const highItems = requirements.filter(r => r.risk === 'HIGH');

const riskContent = [
  chalk.bold.red('Critical Risk Items'),
  '',
  ...critItems.map(r => `  ${badge.CRIT} ${r.name} ${chalk.dim(`(${r.id})`)}`),
  '',
  chalk.bold.yellow('High Risk Items'),
  '',
  ...highItems.map(r => `  ${badge.HIGH} ${r.name} ${chalk.dim(`(${r.id})`)}`),
].join('\n');

console.log(boxen(riskContent, {
  padding: { top: 1, right: 2, bottom: 1, left: 2 },
  borderStyle: 'round',
  borderColor: 'red',
  title: 'Risk Breakdown',
  titleAlignment: 'left',
}));


// ── Partial Implementations (Collapsible) ────────────────────────────────────

console.log();
console.log();
console.log(chalk.bold.cyan('── Partial Implementations ──'));
console.log();

const partials = requirements.filter(r => r.status === 'PARTIAL');
for (const req of partials) {
  console.log(`  ${chalk.bold('▸ ' + req.name)} ${badge.PARTIAL} ${req.risk ? badge[req.risk] : ''}`);
  console.log(chalk.dim(`    ${req.note}`));
  console.log(chalk.dim(`    File: ${req.file}`));
  console.log();
}


// ── Metadata (Recessed) ─────────────────────────────────────────────────────

console.log();
console.log(divider());
console.log(chalk.dim(`  Plan source: docs/auth-requirements.md`));
console.log(chalk.dim(`  Scanned: ${total} requirements across 14 source files`));
console.log(chalk.dim(`  Generated ${new Date().toISOString().slice(0, 16)} · terminal-explainer v0.1.0`));
console.log();
