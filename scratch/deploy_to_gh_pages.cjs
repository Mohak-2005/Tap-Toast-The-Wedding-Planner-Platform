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

console.log('1. Pushing main branch to origin...');
try {
  run('git push origin main');
  console.log('Successfully pushed main to origin!');
} catch (e) {
  console.error('Error pushing main:', e.message);
}

// 2. Backup dist
console.log('2. Backing up dist to:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  console.log('3. Switching to gh-pages branch...');
  run('git checkout gh-pages');

  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  const distInRoot = path.join(rootDir, 'dist');
  if (fs.existsSync(distInRoot)) {
    fs.rmSync(distInRoot, { recursive: true, force: true });
  }

  console.log('4. Copying fresh dist build to gh-pages root and dist/...');
  // Copy to root
  fs.cpSync(backupDir, rootDir, { recursive: true });
  // Copy to dist/
  fs.cpSync(backupDir, path.join(rootDir, 'dist'), { recursive: true });

  const nojekyll = path.join(rootDir, '.nojekyll');
  if (!fs.existsSync(nojekyll)) {
    fs.writeFileSync(nojekyll, '');
  }

  console.log('5. Staging files on gh-pages...');
  run('git add -A');

  const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  if (status) {
    console.log('6. Committing to gh-pages...');
    run('git commit -m "deploy: event-specific schedule, seating drag-and-drop, guest import, and Cheers AI assistant"');
  } else {
    console.log('No new changes to commit on gh-pages.');
  }

  console.log('7. Pushing to origin gh-pages...');
  run('git push origin gh-pages');
  console.log('Successfully pushed to origin gh-pages!');
} finally {
  console.log('8. Returning to main branch...');
  run('git checkout main');
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
