const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

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

module.exports = { openInCursor, runInProject, detectAndRunDev };
