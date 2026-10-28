const fs = require('fs');

const file = 'src/components/RegisterView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Line 665 fix
content = content.replace(
  "selectedMc: mcChoiceMode === 'none' || chosenMcs.length === 0 ? null : mcChoiceMode === 'own' ?",
  "selectedMc: chosenMcs.length === 0 ? null : mcChoiceMode === 'own' ?"
);

// Line 2512 fix
const oldButtonText = `: mcChoiceMode === 'own'
                      ? 'Confirm Preferred MC & Launch Dashboard'
                      : mcChoiceMode === 'none'
                      ? 'Launch Self-Hosted Dashboard'
                      : selectedMcIds.length > 1 ? \`Confirm \${selectedMcIds.length} MCs & Launch Dashboard\` : selectedMcIds.length === 0 ? 'Launch Dashboard' : 'Confirm MC & Launch Dashboard'}`;

const newButtonText = `: mcChoiceMode === 'own'
                      ? 'Confirm Preferred MC & Launch Dashboard'
                      : selectedMcIds.length > 1 ? \`Confirm \${selectedMcIds.length} MCs & Launch Dashboard\` : selectedMcIds.length === 0 ? 'Launch Dashboard' : 'Confirm MC & Launch Dashboard'}`;

content = content.replace(oldButtonText.replace(/\r\n/g, '\n'), newButtonText.replace(/\r\n/g, '\n'));

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed TypeScript errors in RegisterView.tsx');
