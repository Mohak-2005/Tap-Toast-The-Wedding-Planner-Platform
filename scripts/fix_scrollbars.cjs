const fs = require('fs');
const path = require('path');

// 1. CoupleView.tsx
const couplePath = path.join(__dirname, '..', 'src', 'components', 'CoupleView.tsx');
let couple = fs.readFileSync(couplePath, 'utf8');

couple = couple.replace(
  '<main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1300px]">',
  '<main className="flex-1 p-4 md:p-8 overflow-y-auto w-full min-w-0">\r\n        <div className="max-w-[1300px] w-full mx-auto space-y-6">'
);
if (!couple.includes('min-w-0">')) {
  couple = couple.replace(
    '<main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1300px]">',
    '<main className="flex-1 p-4 md:p-8 overflow-y-auto w-full min-w-0">\n        <div className="max-w-[1300px] w-full mx-auto space-y-6">'
  );
}
// Close div right before </main>
couple = couple.replace('</main>', '</div>\r\n      </main>');
fs.writeFileSync(couplePath, couple, 'utf8');
console.log('Fixed scrollbar in CoupleView.tsx');

// 2. McView.tsx
const mcPath = path.join(__dirname, '..', 'src', 'components', 'McView.tsx');
let mc = fs.readFileSync(mcPath, 'utf8');

mc = mc.replace(
  '<main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]">',
  '<main className="flex-1 p-6 md:p-9 overflow-y-auto w-full min-w-0">\r\n        <div className="max-w-[1400px] w-full mx-auto space-y-6">'
);
if (!mc.includes('min-w-0">')) {
  mc = mc.replace(
    '<main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]">',
    '<main className="flex-1 p-6 md:p-9 overflow-y-auto w-full min-w-0">\n        <div className="max-w-[1400px] w-full mx-auto space-y-6">'
  );
}
mc = mc.replace('</main>', '</div>\r\n      </main>');
fs.writeFileSync(mcPath, mc, 'utf8');
console.log('Fixed scrollbar in McView.tsx');
