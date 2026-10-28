const fs = require('fs');

const file = 'src/components/SeatingPlannerSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                <h3 className="font-serif text-sm font-bold text-[#dfc194] leading-tight flex items-center gap-1.5">
                  <span>Cheers AI</span>
                </h3>
                <div className="text-[10px] text-[#bd9661] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive Floor Plan Intelligence</span>
                </div>`;

const replacement = `                <h3 className="font-serif text-sm font-bold text-[#dfc194] leading-tight">
                  Cheers AI
                </h3>`;

// Normalize line endings for replacement
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = target.replace(/\r\n/g, '\n');
const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  const isCrlf = content.includes('\r\n');
  const updated = normalizedContent.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync(file, isCrlf ? updated.replace(/\n/g, '\r\n') : updated, 'utf8');
  console.log('Successfully updated SeatingPlannerSection: removed green online dot, kept logo and name');
} else {
  console.log('Could not find target in SeatingPlannerSection');
}
