import { saveState } from '../store';
import type { PxState } from '../types';

export function rmProject(state: PxState, args: string[]): void {
  const { projects } = state;
  const name = args[1];
  if (!name) {
    console.log('Usage: px rm <name>');
    process.exit(1);
  }
  const idx = projects.findIndex((p) => p.name.toLowerCase() === name.toLowerCase());
  if (idx === -1) {
    console.log(`Not found: "${name}"`);
    return;
  }
  const [removed] = projects.splice(idx, 1);
  saveState(state);
  console.log(`Removed: ${removed.name}`);
}
