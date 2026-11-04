const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd, cwd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8', stdio: 'inherit', cwd });
}

const rootDir = 'C:\\Users\\Mohak\\Desktop\\tap&toast - Copy';
const distDir = path.join(rootDir, 'dist');
const backupDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'dist_backup_' + Date.now());

console.log('1. Building production bundle...');
run('node ./node_modules/vite/bin/vite.js build', rootDir);

console.log('2. Staging and committing changes to main...');
run('git add -A', rootDir);
try {
  run('git commit -m "feat: lock MC Run Sheet cue creation in Planner Add Activity modal"', rootDir);
} catch (e) {
  console.log('Nothing to commit on main or already committed');
}

console.log('3. Pushing main to origin...');
try {
  run('git push origin main', rootDir);
} catch (e) {
  console.error('Warning pushing main:', e.message);
}

console.log('4. Backing up dist to:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  console.log('5. Switching to gh-pages...');
  run('git checkout gh-pages', rootDir);

  console.log('6. Cleaning old assets...');
  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  console.log('7. Copying dist build to gh-pages root and dist folder...');
  fs.cpSync(backupDir, rootDir, { recursive: true });
  const ghPagesDist = path.join(rootDir, 'dist');
  fs.cpSync(backupDir, ghPagesDist, { recursive: true });

  console.log('8. Staging and committing on gh-pages...');
  run('git add -A', rootDir);
  run('git commit -m "deploy: lock MC Run Sheet cue creation in Planner Add Activity modal"', rootDir);

  console.log('9. Pushing to origin gh-pages...');
  run('git push origin gh-pages', rootDir);
  console.log('Successfully deployed and pushed to origin gh-pages!');
} finally {
  console.log('10. Returning to main...');
  run('git checkout main', rootDir);
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
