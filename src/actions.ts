import fs from 'fs';
import path from 'path';
import { spawnSync, spawn } from 'child_process';

import type { Project } from './types';

export function openInCursor(projPath: string): void {
  spawn('cursor', [projPath], { detached: true, stdio: 'ignore', shell: true }).unref();
}

export function runInProject(projPath: string, command: string): void {
  const result = spawnSync(command, { cwd: projPath, stdio: 'inherit', shell: true });
  process.exit(result.status ?? 0);
}

export function detectAndRunDev(project: Project): void {
  const pkgPath = path.join(project.path, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };
    const scripts = pkg.scripts || {};
    const cmd = scripts.dev ? 'dev' : scripts.start ? 'start' : null;
    if (cmd) {
      console.log(`Running npm run ${cmd} in ${project.name}...`);
      spawnSync('npm', ['run', cmd], { cwd: project.path, stdio: 'inherit', shell: true });
      return;
    }
  }
  console.log(`Opening ${project.name} in Cursor...`);
  openInCursor(project.path);
}
