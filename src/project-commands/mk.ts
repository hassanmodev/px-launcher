import fs from 'fs';
import path from 'path';

import { openInCursor } from '../actions';
import { resolveProjectsRoot } from '../config';
import { saveState } from '../store';
import type { PxState } from '../types';

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
  openInCursor(projPath);
  if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) return;
  projects.push({ name, path: projPath });
  saveState(state);
  console.log(`Added: ${name}  ->  ${projPath}`);
}
