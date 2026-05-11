import { detectAndRunDev, runInProject } from './actions';
import { listProjects, printHelp } from './cli';
import { findProject } from './match';
import { addProject, editProject, mkProject, rmProject } from './project-commands';
import type { PxState } from './types';

type Handler = (state: PxState, args: string[]) => void;

const handlerEntries: [string[], Handler][] = [
  [['ls', 'l', 'list'], (s) => listProjects(s.projects)],
  [['add'], (s, a) => addProject(s, a)],
  [['mk'], (s, a) => mkProject(s, a)],
  [['rm'], (s, a) => rmProject(s, a)],
  [['edit'], (s, a) => editProject(s, a)],
  [['help', '--help', '-h', '?'], () => printHelp()],
];

const handlers: Record<string, Handler> = {};
for (const [keys, fn] of handlerEntries) {
  for (const k of keys) handlers[k] = fn;
}

export function dispatch(state: PxState, args: string[]): void {
  const token = args[0].toLowerCase();
  const handler = handlers[token];
  if (handler) {
    handler(state, args);
    return;
  }

  const project = findProject(state.projects, args[0]);
  if (!project) {
    console.log(`Project "${args[0]}" not found. Try: px help  |  px add [name]`);
    return;
  }
  if (args.length > 1) runInProject(project.path, args.slice(1).join(' '));
  else detectAndRunDev(project);
}
