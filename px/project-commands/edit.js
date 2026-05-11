const { findProject } = require('../match');
const { openInCursor } = require('../actions');

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

module.exports = editProject;
