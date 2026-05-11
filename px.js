#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');
const { projectsRoot } = require('./px/config');
const { loadProjects, saveProjects } = require('./px/store');
const { findProject } = require('./px/match');
const { openInCursor, runInProject, detectAndRunDev } = require('./px/actions');
const { listProjects, interactiveMode, printHelp } = require('./px/cli');

const args = process.argv.slice(2);
const projects = loadProjects();

if (args.length === 0) {
  interactiveMode(projects);
  return;
}

const first = args[0].toLowerCase();

if (['ls', 'l', 'list'].includes(first)) {
  listProjects(projects);
} else if (first === 'add') {
  const name = args[1] ? args[1] : path.basename(process.cwd());
  let projPath;
  if (args[1]) {
    if (!projectsRoot) {
      console.log('Set PROJECTS_DIR to your projects folder, or run px add from inside the project (no name).');
      process.exit(1);
    }
    projPath = path.join(projectsRoot, args[1]);
  } else {
    projPath = process.cwd();
  }
  if (projects.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    console.log(`Already exists: "${name}"`);
  } else {
    projects.push({ name, path: projPath });
    saveProjects(projects);
    console.log(`Added: ${name}  ->  ${projPath}`);
  }
} else if (first === 'mk') {
  const name = args[1];
  if (!name) {
    console.log('Usage: px mk <name>');
    process.exit(1);
  }
  if (!projectsRoot) {
    console.log('Set PROJECTS_DIR to your projects folder (same path mk.cmd uses).');
    process.exit(1);
  }
  spawnSync('mk', [name], { stdio: 'inherit', shell: true });
  const projPath = path.join(projectsRoot, name);
  if (!projects.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    projects.push({ name, path: projPath });
    saveProjects(projects);
    console.log(`Added: ${name}  ->  ${projPath}`);
  }
} else if (first === 'rm') {
  const name = args[1];
  if (!name) {
    console.log('Usage: px rm <name>');
    process.exit(1);
  }
  const idx = projects.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
  if (idx === -1) {
    console.log(`Not found: "${name}"`);
  } else {
    const [removed] = projects.splice(idx, 1);
    saveProjects(projects);
    console.log(`Removed: ${removed.name}`);
  }
} else if (first === 'edit') {
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
} else if (['help', '--help', '-h'].includes(first)) {
  printHelp();
} else {
  const project = findProject(projects, args[0]);
  if (project) {
    if (args.length > 1) {
      runInProject(project.path, args.slice(1).join(' '));
    } else {
      detectAndRunDev(project);
    }
  } else {
    console.log(`Project "${args[0]}" not found. Use: px add [name]`);
  }
}
