const { findProject } = require('./match');
const { runInProject, detectAndRunDev } = require('./actions');
const { listProjects, printHelp } = require('./cli');
const { addProject, mkProject, rmProject, editProject } = require('./project-commands');

const handlers = Object.fromEntries(
  [
    [['ls', 'l', 'list'], (p) => listProjects(p)],
    [['add'], (p, a) => addProject(p, a)],
    [['mk'], (p, a) => mkProject(p, a)],
    [['rm'], (p, a) => rmProject(p, a)],
    [['edit'], (p, a) => editProject(p, a)],
    [['help', '--help', '-h'], () => printHelp()],
  ].flatMap(([keys, fn]) => keys.map((k) => [k, fn]))
);

function dispatch(projects, args) {
  const token = args[0].toLowerCase();
  const handler = handlers[token];
  if (handler) {
    handler(projects, args);
    return;
  }

  const project = findProject(projects, args[0]);
  if (!project) {
    console.log(`Project "${args[0]}" not found. Use: px add [name]`);
    return;
  }
  if (args.length > 1) runInProject(project.path, args.slice(1).join(' '));
  else detectAndRunDev(project);
}

module.exports = { dispatch };
