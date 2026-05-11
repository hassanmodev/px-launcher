#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');
const readline = require('readline');

const PROJECTS_FILE = path.join(__dirname, 'px-projects.json');
const projectsRoot = (process.env.PROJECTS_DIR || '').trim();

function loadProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
}

function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function fuzzyMatch(query, str) {
  query = query.toLowerCase();
  str = str.toLowerCase();
  if (str.includes(query)) return true;
  let qi = 0;
  for (let i = 0; i < str.length && qi < query.length; i++) {
    if (str[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

function findProject(projects, name) {
  const exact = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (exact) return exact;
  const matches = projects.filter(p => fuzzyMatch(name, p.name));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.log(`Multiple matches for "${name}":`);
    matches.forEach((p, i) => console.log(`  ${i + 1}. ${p.name}`));
    return null;
  }
  return null;
}

function openInCursor(projPath) {
  spawn('cursor', [projPath], { detached: true, stdio: 'ignore', shell: true }).unref();
}

function runInProject(projPath, command) {
  const result = spawnSync(command, { cwd: projPath, stdio: 'inherit', shell: true });
  process.exit(result.status || 0);
}

function detectAndRunDev(project) {
  const pkgPath = path.join(project.path, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const scripts = pkg.scripts || {};
    const cmd = scripts.dev ? 'dev' : scripts.start ? 'start' : null;
    if (cmd) {
      console.log(`Running npm run ${cmd} in ${project.name}...`);
      spawnSync('npm', ['run', cmd], { cwd: project.path, stdio: 'inherit', shell: true });
      return;
    }
  }
  console.log(`Opening ${project.name} in Cursor...`);
  openInCursor(project.path);
}

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
    const num = parseInt(answer);
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
  if (!name) { console.log('Usage: px mk <name>'); process.exit(1); }
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
  if (!name) { console.log('Usage: px rm <name>'); process.exit(1); }
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
  if (!name) { console.log('Usage: px edit <name>'); process.exit(1); }
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
  // px <name> or px <name> <command>
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
