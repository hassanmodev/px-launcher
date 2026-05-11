const path = require('path');
const { projectsRoot } = require('../config');
const { saveProjects } = require('../store');

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

module.exports = addProject;
