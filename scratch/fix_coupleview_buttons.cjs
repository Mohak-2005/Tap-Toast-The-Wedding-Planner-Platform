const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/CoupleView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /<div className="flex items-center gap-2\.5 flex-wrap">[\s\S]*?<span>Add Cue Entry<\/span>\s*<\/button>\s*<\/div>/;

const newButtons = `<div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowMcShareModal(true)}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Share or print read-only run sheet for vendors"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  <span>Share Vendor Copy</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenMcTemplateModal}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Import activities from standard wedding run sheet templates"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                  <span>Import Template</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenMcAiModal}
                  className="bg-[#241c15] hover:bg-[#382b21] text-[#dfc194] border border-[#bd9661]/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Cheers AI timeline generator and parser"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>
                  <span>Cheers AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg><span>Print Run Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCueModal(true)}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add Cue Entry</span>
                </button>
              </div>`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, newButtons);
  console.log('Replaced CoupleView MC header buttons successfully!');
} else {
  console.log('Target regex NOT matched in CoupleView!');
}

fs.writeFileSync(filePath, content, 'utf8');
