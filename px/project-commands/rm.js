const { saveProjects } = require('../store');

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

module.exports = rmProject;
