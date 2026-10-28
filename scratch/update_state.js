import fs from 'fs';

let content = fs.readFileSync('src/lib/state.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

const target = `: (seedW?.privateRunSheet || [])
            };`;

const replacement = `: (seedW?.privateRunSheet || []),
              savedSeatingArrangements: (Array.isArray(w.savedSeatingArrangements) && w.savedSeatingArrangements.length > 0)
                ? w.savedSeatingArrangements
                : (seedW?.savedSeatingArrangements || [])
            };`;

if (!content.includes(target)) {
  console.error('Target not found in state.ts');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync('src/lib/state.ts', content, 'utf8');
console.log('Successfully updated state.ts');
