const path = require('path');
const { spawnSync } = require('child_process');
const { projectsRoot } = require('../config');
const { saveProjects } = require('../store');

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

module.exports = mkProject;
