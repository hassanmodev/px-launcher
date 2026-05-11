const fs = require('fs');
const readline = require('readline');
const { findProject } = require('./match');
const { detectAndRunDev } = require('./actions');

function listProjects(projects) {
  if (projects.length === 0) {
    console.log('No projects. Use: px add [name]');
    return;
  }
  projects.forEach((p, i) => {
    const missing = fs.existsSync(p.path) ? '' : '  (missing)';
    console.log(`  ${String(i + 1).padStart(2)}. ${p.name.padEnd(24)} ${p.path}${missing}`);
  });
}

function interactiveMode(projects) {
  if (projects.length === 0) {
    console.log('No projects. Use: px add [name]');
    return;
  }
  console.log('');
  listProjects(projects);
  console.log('');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Select project (# or name): ', (answer) => {
    rl.close();
    answer = answer.trim();
    if (!answer) return;
    const num = parseInt(answer, 10);
    if (!isNaN(num) && num >= 1 && num <= projects.length) {
      detectAndRunDev(projects[num - 1]);
    } else {
      const match = findProject(projects, answer);
      if (match) detectAndRunDev(match);
      else console.log(`Not found: "${answer}"`);
    }
  });
}

function printHelp() {
  console.log(`
px - project launcher

  px                        interactive project list
  px ls                     list all projects
  px add [name]             add project (cwd, or PROJECTS_DIR/name when name is given)
  px mk <name>              create project with mk then add it
  px rm <name>              remove project
  px edit <name>            open project in Cursor
  px <name>                 fuzzy find & run dev/start or open in Cursor
  px <name> <command>       run command in project directory
`);
}

module.exports = { listProjects, interactiveMode, printHelp };
