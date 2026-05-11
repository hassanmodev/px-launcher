const fs = require('fs');
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, '..', 'px-projects.json');

function loadProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
}

function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

module.exports = { loadProjects, saveProjects };
