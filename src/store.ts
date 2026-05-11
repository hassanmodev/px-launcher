import fs from 'fs';
import path from 'path';

import type { Project } from './types';

const PROJECTS_FILE = path.join(__dirname, '..', 'px-projects.json');

export function loadProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8')) as Project[];
}

export function saveProjects(projects: Project[]): void {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}
