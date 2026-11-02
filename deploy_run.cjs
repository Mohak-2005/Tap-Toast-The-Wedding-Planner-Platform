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

console.log('1. Backing up dist to:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  console.log('2. Switching to gh-pages branch...');
  run('git checkout gh-pages');

  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  console.log('3. Copying fresh dist build to gh-pages root...');
  fs.cpSync(backupDir, rootDir, { recursive: true });

  const nojekyll = path.join(rootDir, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    fs.writeFileSync(nojekyll, '');
  }

  console.log('4. Staging files on gh-pages...');
  run('git add -A');

  const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  if (status) {
    console.log('5. Committing to gh-pages...');
    run('git commit -m "deploy: align S/R mobile registration, resize Skip & Launch Dashboard, and fix Enter button on Magnolia invitation theme"');
  } else {
    console.log('No new changes to commit on gh-pages.');
  }

  console.log('6. Pushing to origin gh-pages...');
  run('git push origin gh-pages');
  console.log('Successfully pushed to origin gh-pages!');
} finally {
  console.log('7. Returning to main branch...');
  run('git checkout main');
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
