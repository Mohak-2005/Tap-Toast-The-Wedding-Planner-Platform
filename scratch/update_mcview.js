import fs from 'fs';

let content = fs.readFileSync('src/components/McView.tsx', 'utf8');
content = content.replace(/\r\n/g, '\n');

const target = `<SeatingPlannerSection weddingId={activeWedding.id} onSelectView={onSelectView} />`;
const replacement = `<SeatingPlannerSection weddingId={activeWedding.id} onSelectView={onSelectView} isMcView={true} />`;

if (!content.includes(target)) {
  console.error('Target not found in McView.tsx');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync('src/components/McView.tsx', content, 'utf8');
console.log('Successfully updated McView.tsx');
