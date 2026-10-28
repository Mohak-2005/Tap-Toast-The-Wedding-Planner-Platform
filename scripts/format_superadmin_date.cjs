const fs = require('fs');

const file = 'src/components/SuperAdminView.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="font-medium text-[#15110e]">{w.date}</div>`;
const replacement = `<div className="font-medium text-[#15110e]">
                              {(() => {
                                try {
                                  const d = new Date(w.date);
                                  if (!isNaN(d.getTime())) {
                                    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                                  }
                                } catch {}
                                return w.dateDisplay || w.date;
                              })()}
                            </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated SuperAdminView date formatting!');
} else {
  console.log('Target not found in SuperAdminView');
}
