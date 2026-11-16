const babel = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');

try {
  babel.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });
  console.log('NO_SYNTAX_ERROR');
} catch (err) {
  console.error('Syntax error at line', err.loc ? err.loc.line : 'unknown', 'col', err.loc ? err.loc.column : 'unknown');
  console.error(err.message);
  
  if (err.loc) {
    const lines = code.split('\n');
    const start = Math.max(0, err.loc.line - 15);
    const end = Math.min(lines.length, err.loc.line + 15);
    for (let i = start; i < end; i++) {
      console.log((i + 1) + (i + 1 === err.loc.line ? ' >> ' : '    ') + lines[i]);
    }
  }
}
