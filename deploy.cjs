const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  const out = execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
  return out;
}

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const backupDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'dist_backup_' + Date.now());

console.log('Copying dist to backup:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  run('git checkout gh-pages');

  // remove existing assets dir in root if exists
  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  // copy everything from backupDir to rootDir
  console.log('Copying files to gh-pages root...');
  fs.cpSync(backupDir, rootDir, { recursive: true });

  run('git add -A');
  run('git commit -m "deploy: update MC Stripe registration, dual SuperAdmin subscriptions, and remove feature flags"');
  run('git push planner-platform gh-pages');
  console.log('Successfully deployed to gh-pages!');
} finally {
  console.log('Switching back to main branch...');
  run('git checkout main');
  // clean up backup
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
