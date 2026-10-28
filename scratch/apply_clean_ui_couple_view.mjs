import fs from 'fs';

let code = fs.readFileSync('src/components/CoupleView.tsx', 'utf8');
const normalize = (s) => s.replace(/\r\n/g, '\n');
code = normalize(code);

// 1. KPI Cards: Remove emojis from Adults and Kids
code = code.replace(/flex items-center gap-1">🍷 ADULTS \(18\+\)/g, '">ADULTS (18+)');
code = code.replace(/flex items-center gap-1">🧃 KIDS \(&lt;12\)/g, '">KIDS (<12)');
code = code.replace(/⚠️ Needs Category/g, 'Needs Category');

// 2. Table Row: Clean category select (remove flashy blue/rainbow classes)
const oldCatSelect = `                            <div className="flex items-center gap-1">
                              <select
                                value={g.category}
                                onChange={(e) => handleUpdateGuestCategory(g.id, e.target.value)}
                                className={\`text-[10.5px] rounded-md px-2 py-0.5 border cursor-pointer outline-none transition-colors \${
                                  g.category === 'Bridal Party'
                                    ? 'bg-amber-100 text-amber-900 border-[#bd9661] font-bold'
                                    : g.category === "Bride's Family"
                                    ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                                    : g.category === "Groom's Family"
                                    ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                                    : g.category === 'Mutual Friends' || g.category === 'Friends'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                                    : g.category === 'Work Colleagues' || g.category === 'Colleagues'
                                    ? 'bg-purple-50 text-purple-800 border-purple-200 font-semibold'
                                    : 'bg-stone-50 text-stone-700 border-stone-200 font-semibold'
                                }\`}
                              >`;

const newCatSelect = `                            <div className="flex items-center gap-1">
                              <select
                                value={g.category}
                                onChange={(e) => handleUpdateGuestCategory(g.id, e.target.value)}
                                className="text-[11px] font-medium text-[#15110e] bg-[#fbf9f6] border border-[#d5c7b5] hover:border-[#bd9661] focus:border-[#bd9661] rounded px-2.5 py-1 outline-none cursor-pointer transition-colors shadow-2xs"
                              >`;

if (!code.includes(normalize(oldCatSelect))) {
  console.error("Could not find oldCatSelect");
  process.exit(1);
}
code = code.replace(normalize(oldCatSelect), normalize(newCatSelect));

// 3. Table Row: Clean Adults, Kids and Total Party columns (no emojis, balanced typography)
const oldRowDemographics = `                        {/* ADULTS */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 bg-[#faf5ed] text-[#855c26] border border-[#ecd5b5] text-[11px] font-bold px-2 py-0.5 rounded-md">
                            🍷 {g.adults !== undefined ? g.adults : (g.partySize || 1)}
                          </span>
                        </td>

                        {/* KIDS */}
                        <td className="py-3 px-3 text-center">
                          <span className={\`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md \${
                            (g.kids || 0) > 0 ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'text-[#8b7b6b] bg-gray-50 border border-gray-200'
                          }\`}>
                            🧃 {g.kids || 0}
                          </span>
                        </td>

                        {/* PARTY TOTAL */}
                        <td className="py-3 px-3 text-center font-bold text-[#15110e]">
                          {(g.adults !== undefined ? g.adults : (g.partySize || 1)) + (g.kids || 0)}
                        </td>`;

const newRowDemographics = `                        {/* ADULTS */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold text-[#15110e] bg-[#f5ede2] border border-[#e2d5c5]">
                            {g.adults !== undefined ? g.adults : (g.partySize || 1)}
                          </span>
                        </td>

                        {/* KIDS */}
                        <td className="py-2.5 px-3 text-center">
                          <span className={\`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold \${
                            (g.kids || 0) > 0
                              ? 'text-[#6b5847] bg-[#f5ede2] border border-[#e2d5c5]'
                              : 'text-[#8b7b6b] bg-[#faf8f5] border border-[#e8ded0]'
                          }\`}>
                            {g.kids || 0}
                          </span>
                        </td>

                        {/* PARTY TOTAL */}
                        <td className="py-2.5 px-3 text-center font-bold text-xs text-[#15110e]">
                          {(g.adults !== undefined ? g.adults : (g.partySize || 1)) + (g.kids || 0)}
                        </td>`;

if (!code.includes(normalize(oldRowDemographics))) {
  console.error("Could not find oldRowDemographics");
  process.exit(1);
}
code = code.replace(normalize(oldRowDemographics), normalize(newRowDemographics));

// 4. Modal: Clean Adults & Kids labels
code = code.replace(/🍷 Adults \(18\+\)/g, 'Adults (18+)');
code = code.replace(/🧃 Kids \(&lt;12\)/g, 'Kids (<12)');

fs.writeFileSync('src/components/CoupleView.tsx', code, 'utf8');
console.log('CoupleView cleaned up successfully!');
