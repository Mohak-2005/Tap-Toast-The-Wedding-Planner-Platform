const fs = require('fs');

const code = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');
const lines = code.split('\n');

const stack = [];

// Simple tokenizer tracking brackets
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '{') {
      stack.push({ line: i + 1, col: c + 1, text: line.trim() });
    } else if (ch === '}') {
      if (stack.length === 0) {
        console.log('Unmatched closing } at line', i + 1);
      } else {
        stack.pop();
      }
    }
  }
}

console.log('Remaining unclosed { count:', stack.length);
stack.forEach(item => {
  console.log('Unclosed { at line', item.line, ':', item.text);
});
