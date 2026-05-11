import readline from 'readline';

import { resolveProjectsRoot } from '../config';
import { saveState } from '../store';
import type { PxState } from '../types';

function question(rl: readline.Interface, q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

/** When no projects root (env or JSON), offer cwd, paste path, or exit. Mutates and saves `state` on success. */
export async function ensureProjectsDirInteractive(state: PxState): Promise<boolean> {
  if (resolveProjectsRoot(state)) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (!resolveProjectsRoot(state)) {
      console.log(`
No projects root configured (needed for px add <name> and px mk).

  1 — use current directory: ${process.cwd()}
  2 — paste a projects folder path
  3 — exit
`);
      const pick = (await question(rl, 'Pick (1-3): ')).trim();
      if (pick === '3') return false;
      if (pick === '1') {
        state.projectsDir = process.cwd();
        saveState(state);
        console.log('Saved projects_dir to px-state.json');
        return true;
      }
      if (pick === '2') {
        const raw = (await question(rl, 'Path: ')).trim().replace(/^["']|["']$/g, '');
        if (!raw) {
          console.log('Empty path, try again.');
          continue;
        }
        state.projectsDir = raw;
        saveState(state);
        console.log('Saved projects_dir to px-state.json');
        return true;
      }
      if (pick) console.log('Invalid choice.');
    }
    return true;
  } finally {
    rl.close();
  }
}
