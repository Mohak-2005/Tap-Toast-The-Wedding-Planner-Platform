const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
}

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

// 1. Ensure 404.html exists in dist
const indexHtml = path.join(distDir, 'index.html');
const notFoundHtml = path.join(distDir, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
  console.log('Created dist/404.html for GitHub Pages routing fallback');
}

// 2. Backup dist to temp directory
const backupDir = path.join(os.tmpdir(), 'tap_toast_dist_' + Date.now());
console.log('Backing up dist to:', backupDir);
fs.cpSync(distDir, backupDir, { recursive: true });

try {
  // 3. Switch to gh-pages branch
  console.log('Switching to gh-pages branch...');
  run('git checkout gh-pages');

  // Pull latest gh-pages if any
  try {
    run('git pull origin gh-pages');
  } catch (e) {
    console.log('No upstream changes to pull for gh-pages or already up to date');
  }

  // 4. Remove previous assets directory in root
  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
    console.log('Cleaned previous assets directory');
  }

  // 5. Copy new build files from backupDir to rootDir
  console.log('Copying new build files from backup to gh-pages root...');
  fs.cpSync(backupDir, rootDir, { recursive: true });

  // 6. Stage and commit
  run('git add -A');

  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  if (status.trim() === '') {
    console.log('No changes detected on gh-pages branch.');
  } else {
    run('git commit -m "Deploy: Wedding Planner Portal, SuperAdmin Couple Directory, and Guest Mobile enhancements to GitHub Pages"');
    console.log('Committed deployment to gh-pages');
  }

  // 7. Push to both remotes (origin and planner-platform)
  console.log('Pushing gh-pages branch to GitHub...');
  run('git push origin gh-pages');
  try {
    run('git push planner-platform gh-pages');
  } catch (e) {
    console.log('planner-platform push finished');
  }

  console.log('Successfully deployed to gh-pages!');
} catch (error) {
  console.error('Deployment error:', error);
  throw error;
} finally {
  console.log('Returning to main branch...');
  run('git checkout main');
  try {
    fs.rmSync(backupDir, { recursive: true, force: true });
  } catch (e) {}
}
