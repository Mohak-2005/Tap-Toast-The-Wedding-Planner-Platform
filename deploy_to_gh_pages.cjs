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

// 1. Stage and commit on main
console.log('1. Staging and committing changes to main...');
run('git add -A');
try {
  run('git commit -m "feat: add email verification flow, set password view, role-based onboarding, and map logistics"');
} catch (e) {
  console.log('Nothing to commit on main, proceeding.');
}

console.log('2. Pushing main branch to origin...');
try {
  run('git push origin main');
} catch (e) {
  console.log('Push to origin main notice:', e.message);
}

// 3. Backup dist
console.log('3. Backing up dist to:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  console.log('4. Switching to gh-pages branch...');
  run('git checkout gh-pages');

  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  console.log('5. Copying build to gh-pages root...');
  fs.cpSync(backupDir, rootDir, { recursive: true });

  const nojekyll = path.join(rootDir, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    fs.writeFileSync(nojekyll, '');
  }

  console.log('6. Staging files on gh-pages...');
  run('git add -A');

  const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  if (status) {
    console.log('7. Committing on gh-pages...');
    run('git commit -m "deploy: add email verification flow, set password view, role-based onboarding, and map logistics"');
  } else {
    console.log('No new changes to commit on gh-pages.');
  }

  console.log('8. Pushing to origin gh-pages...');
  try {
    run('git push origin gh-pages');
    console.log('Successfully pushed to origin gh-pages!');
  } catch (e) {
    console.log('Origin push error, attempting planner-platform:', e.message);
    run('git push planner-platform gh-pages');
  }
} finally {
  console.log('9. Returning to main...');
  run('git checkout main');
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
