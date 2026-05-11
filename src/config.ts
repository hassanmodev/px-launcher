import type { PxState } from './types';

/** `PROJECTS_DIR` env overrides `projects_dir` saved in JSON. */
export function resolveProjectsRoot(state: Pick<PxState, 'projectsDir'>): string {
  const fromEnv = (process.env.PROJECTS_DIR || '').trim();
  if (fromEnv) return fromEnv;
  return (state.projectsDir || '').trim();
}
