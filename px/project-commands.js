const path = require('path');
const { spawnSync } = require('child_process');
const { projectsRoot } = require('./config');
const { saveProjects } = require('./store');
const { findProject } = require('./match');
const { openInCursor } = require('./actions');

function addProject(projects, args) {
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
    return;
  }
  projects.push({ name, path: projPath });
  saveProjects(projects);
  console.log(`Added: ${name}  ->  ${projPath}`);
}

function mkProject(projects, args) {
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
  if (projects.find(p => p.name.toLowerCase() === name.toLowerCase())) return;
  projects.push({ name, path: projPath });
  saveProjects(projects);
  console.log(`Added: ${name}  ->  ${projPath}`);
}

function rmProject(projects, args) {
  const name = args[1];
  if (!name) {
    console.log('Usage: px rm <name>');
    process.exit(1);
  }
  const idx = projects.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
  if (idx === -1) {
    console.log(`Not found: "${name}"`);
    return;
  }
  const [removed] = projects.splice(idx, 1);
  saveProjects(projects);
  console.log(`Removed: ${removed.name}`);
}

function editProject(projects, args) {
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

module.exports = { addProject, mkProject, rmProject, editProject };
