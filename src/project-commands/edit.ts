import { openInCursor } from '../actions';
import { findProject } from '../match';
import type { Project } from '../types';

export function editProject(projects: Project[], args: string[]): void {
  const name = args[1];
  if (!name) {
    console.log('Usage: px edit <name>');
    process.exit(1);
  }
  const project = findProject(projects, name);
  if (project) {
    console.log(`Opening ${project.name} in Cursor...`);
    openInCursor(project.path);
  } else {
    console.log(`Not found: "${name}"`);
  }
}
