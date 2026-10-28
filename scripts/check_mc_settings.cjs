const fs = require('fs');
const content = fs.readFileSync('src/components/McView.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes("activeTab === 'settings'") || l.includes('activeTab === "settings"') || l.includes('settings')) {
    if (l.includes('activeTab') || l.includes('Settings')) {
      console.log((i+1) + ': ' + l.trim());
    }
  }
});
