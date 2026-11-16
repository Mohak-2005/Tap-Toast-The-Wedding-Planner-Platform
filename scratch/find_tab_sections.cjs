const fs = require('fs');
const content = fs.readFileSync('C:/Users/Mohak/Desktop/tap&toast - Copy/src/components/CoupleView.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes("activeTab === 'guests'") || line.includes("activeTab === 'overview'") || line.includes("activeTab === 'pages'") || line.includes("activeTab === 'invitations'")) {
    console.log((idx+1) + ': ' + line.trim());
  }
});
