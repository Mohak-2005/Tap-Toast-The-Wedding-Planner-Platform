const fs = require('fs');

const file = 'src/components/RegisterView.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("mcChoiceMode === 'none'")) {
    console.log(`Found on line ${i+1}: ${lines[i]}`);
    // Check if next line is 'Launch Self-Hosted Dashboard'
    if (lines[i+1] && lines[i+1].includes('Launch Self-Hosted Dashboard')) {
      // Remove these two lines: lines[i] and lines[i+1]
      lines.splice(i, 2);
      console.log(`Removed lines ${i+1} and ${i+2}`);
      break;
    }
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Saved RegisterView.tsx without mcChoiceMode === none');
