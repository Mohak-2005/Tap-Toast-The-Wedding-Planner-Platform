const fs = require('fs');
const content = fs.readFileSync('src/components/CoupleView.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes("activeTab === 'settings'") || line.includes("Settings") && line.includes("Tab")) {
    console.log((i+1) + ': ' + line);
  }
});
