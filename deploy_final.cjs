const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
}

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const backupDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'dist_backup_' + Date.now());

console.log('Backing up dist to:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  run('git checkout gh-pages');

  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  console.log('Copying build to gh-pages root...');
  fs.cpSync(backupDir, rootDir, { recursive: true });

  run('git add -A');
  run('git commit -m "deploy: clean up badges, center MC stepper, use professional SVG icons, and sync S/R mobile registration flow"');
  run('git push planner-platform gh-pages');
  console.log('Successfully deployed to gh-pages!');
} finally {
  console.log('Returning to main...');
  run('git checkout main');
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
