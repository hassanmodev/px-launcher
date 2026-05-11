import { detectAndRunDev, runInProject } from './actions';
import { listProjects, printHelp } from './cli';
import { findProject } from './match';
import { addProject, editProject, mkProject, rmProject } from './project-commands';
import type { Project } from './types';

type Handler = (projects: Project[], args: string[]) => void;

const handlerEntries: [string[], Handler][] = [
  [['ls', 'l', 'list'], (p) => listProjects(p)],
  [['add'], (p, a) => addProject(p, a)],
  [['mk'], (p, a) => mkProject(p, a)],
  [['rm'], (p, a) => rmProject(p, a)],
  [['edit'], (p, a) => editProject(p, a)],
  [['help', '--help', '-h', '?'], () => printHelp()],
];

const handlers: Record<string, Handler> = {};
for (const [keys, fn] of handlerEntries) {
  for (const k of keys) handlers[k] = fn;
}

export function dispatch(projects: Project[], args: string[]): void {
  const token = args[0].toLowerCase();
  const handler = handlers[token];
  if (handler) {
    handler(projects, args);
    return;
  }

  const project = findProject(projects, args[0]);
  if (!project) {
    console.log(`Project "${args[0]}" not found. Try: px help  |  px add [name]`);
    return;
  }
  if (args.length > 1) runInProject(project.path, args.slice(1).join(' '));
  else detectAndRunDev(project);
}
