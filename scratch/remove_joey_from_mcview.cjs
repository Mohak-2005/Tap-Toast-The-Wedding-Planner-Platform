const fs = require('fs');

let c = fs.readFileSync('src/components/McView.tsx', 'utf8');
c = c.replace(/\{\s*!\s*\(\s*selectedWeddingId\s*&&\s*detailSubTab\s*===\s*'seating'\s*\)\s*&&\s*<JoeyChatbot\s*context="mc"\s*\/>\s*\}/g, '');
fs.writeFileSync('src/components/McView.tsx', c, 'utf8');
console.log('✓ Removed JoeyChatbot from McView.tsx');
