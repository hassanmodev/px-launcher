import fs from 'fs';
import path from 'path';

import type { Project, PxState } from './types';

const FILE = path.join(__dirname, '..', 'px-state.json');

export function loadState(): PxState {
  if (!fs.existsSync(FILE)) return { projectsDir: '', projects: [] };
  try {
    const o = JSON.parse(fs.readFileSync(FILE, 'utf8')) as Record<string, unknown>;
    return {
      projectsDir: String(o.projects_dir ?? ''),
      projects: (Array.isArray(o.projects) ? o.projects : []) as Project[],
    };
  } catch {
    return { projectsDir: '', projects: [] };
  }
}

export function saveState(s: PxState): void {
  fs.writeFileSync(FILE, JSON.stringify({ projects_dir: s.projectsDir, projects: s.projects }, null, 2));
}
