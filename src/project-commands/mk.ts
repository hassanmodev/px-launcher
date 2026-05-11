import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { openInCursor } from '../actions';
import { resolveProjectsRoot } from '../config';
import { saveState } from '../store';
import type { PxState } from '../types';

const MAIN_TEMPLATE = path.join(__dirname, '..', '..', 'mk', 'templates', 'main');
const COMMANDS_FILE = 'commands';

function copyTemplateIfPresent(dest: string): void {
  if (!fs.existsSync(MAIN_TEMPLATE)) return;
  fs.cpSync(MAIN_TEMPLATE, dest, {
    recursive: true,
    filter: (src) => path.basename(src) !== COMMANDS_FILE,
  });
}

function runCommandsFile(cwd: string, commandsFromDir: string): void {
  const file = path.join(commandsFromDir, COMMANDS_FILE);
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const cmd = line.trim();
    if (!cmd || cmd.startsWith('#')) continue;
    const r = spawnSync(cmd, { cwd, stdio: 'inherit', shell: true });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}

export function mkProject(state: PxState, args: string[]): void {
  const { projects } = state;
  const name = args[1];
  if (!name) {
    console.log('Usage: px mk <name>');
    process.exit(1);
  }
  const root = resolveProjectsRoot(state);
  if (!root) {
    console.log('Set projects_dir (run px and pick 1 or 2) or set PROJECTS_DIR.');
    process.exit(1);
  }
  const projPath = path.join(root, name);
  fs.mkdirSync(projPath, { recursive: true });
  copyTemplateIfPresent(projPath);
  runCommandsFile(projPath, MAIN_TEMPLATE);
  openInCursor(projPath);
  if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) return;
  projects.push({ name, path: projPath });
  saveState(state);
  console.log(`Added: ${name}  ->  ${projPath}`);
}
