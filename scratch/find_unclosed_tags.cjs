const fs = require('fs');

const code = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');
const lines = code.split('\n');

const tagStack = [];
const regex = /<\/?([a-zA-Z0-9_\-]+)[^>]*?(\/)?>/g;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let match;
  while ((match = regex.exec(line)) !== null) {
    const full = match[0];
    const tag = match[1];
    const isSelfClosing = match[2] === '/' || full.endsWith('/>') || ['input', 'img', 'br', 'hr', 'col', 'line', 'circle', 'path', 'rect'].includes(tag.toLowerCase());
    const isClosing = full.startsWith('</');

    if (isClosing) {
      if (tagStack.length === 0) {
        console.log(`Extra closing </${tag}> at line ${i + 1}`);
      } else {
        const top = tagStack.pop();
        if (top.tag !== tag) {
          console.log(`Mismatched closing </${tag}> at line ${i + 1}, expected </${top.tag}> opened at line ${top.line}`);
        }
      }
    } else if (!isSelfClosing) {
      tagStack.push({ tag, line: i + 1, text: line.trim() });
    }
  }
}

console.log('Unclosed tags remaining:', tagStack.length);
tagStack.forEach(t => console.log(`Unclosed <${t.tag}> at line ${t.line}: ${t.text}`));
