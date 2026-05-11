import path from 'path';

import { projectsRoot } from '../config';
import { saveProjects } from '../store';
import type { Project } from '../types';

export function addProject(projects: Project[], args: string[]): void {
  const name = args[1] ? args[1] : path.basename(process.cwd());
  let projPath: string;
  if (args[1]) {
    if (!projectsRoot) {
      console.log('Set PROJECTS_DIR to your projects folder, or run px add from inside the project (no name).');
      process.exit(1);
    }
    projPath = path.join(projectsRoot, args[1]);
  } else {
    projPath = process.cwd();
  }
  if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
    console.log(`Already exists: "${name}"`);
    return;
  }
  projects.push({ name, path: projPath });
  saveProjects(projects);
  console.log(`Added: ${name}  ->  ${projPath}`);
}
