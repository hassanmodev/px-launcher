import fs from 'fs';
import path from 'path';

import { openInCursor } from '../actions';
import { projectsRoot } from '../config';
import { saveProjects } from '../store';
import type { Project } from '../types';

export function mkProject(projects: Project[], args: string[]): void {
  const name = args[1];
  if (!name) {
    console.log('Usage: px mk <name>');
    process.exit(1);
  }
  if (!projectsRoot) {
    console.log('Set PROJECTS_DIR to your projects folder, e.g. setx PROJECTS_DIR "D:\\Projects"');
    process.exit(1);
  }
  const projPath = path.join(projectsRoot, name);
  fs.mkdirSync(projPath, { recursive: true });
  openInCursor(projPath);
  if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) return;
  projects.push({ name, path: projPath });
  saveProjects(projects);
  console.log(`Added: ${name}  ->  ${projPath}`);
}
