import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('1. Checking out source index.html from main...');
execSync('git checkout main -- index.html', { stdio: 'inherit' });

console.log('2. Building Vite production bundle...');
execSync('node ./node_modules/vite/bin/vite.js build', { stdio: 'inherit' });

console.log('3. Copying dist/ files to root for GitHub Pages...');
// Read dist/index.html
const distIndex = fs.readFileSync('dist/index.html', 'utf8');

// Write to index.html and 404.html
fs.writeFileSync('index.html', distIndex, 'utf8');
fs.writeFileSync('404.html', distIndex, 'utf8');
fs.writeFileSync('.nojekyll', '', 'utf8');

// Copy dist/assets to assets/
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets', { recursive: true });
}

const distAssets = fs.readdirSync('dist/assets');
for (const file of distAssets) {
  const src = path.join('dist/assets', file);
  const dest = path.join('assets', file);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${file} -> assets/${file}`);
}

console.log('4. Done preparing gh-pages build!');
