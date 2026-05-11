import path from 'path';

import { resolveProjectsRoot } from '../config';
import { saveState } from '../store';
import type { PxState } from '../types';

export function addProject(state: PxState, args: string[]): void {
  const { projects } = state;
  const name = args[1] ? args[1] : path.basename(process.cwd());
  const root = resolveProjectsRoot(state);
  let projPath: string;
  if (args[1]) {
    if (!root) {
      console.log(
        'Set projects_dir (run px and pick 1 or 2), set PROJECTS_DIR, or run px add with no name from inside the project.',
      );
      process.exit(1);
    }
    projPath = path.join(root, args[1]);
  } else {
    projPath = process.cwd();
  }
  if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
    console.log(`Already exists: "${name}"`);
    return;
  }
  projects.push({ name, path: projPath });
  saveState(state);
  console.log(`Added: ${name}  ->  ${projPath}`);
}
