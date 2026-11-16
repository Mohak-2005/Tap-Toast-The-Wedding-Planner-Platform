const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/PlannerDaySheetSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the cue row action buttons
const rowActionPattern = /\{\/\* Activity Reorder & Delete Actions[\s\S]*?<\/button>\s*<\/div>/;
const newRowActionCode = `{/* Activity Actions: On MC cues, planner can request a schedule change; on planner activities, reorder or delete */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isMcCue ? (
                            item.changeRequest && item.changeRequest.status === 'pending' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#fff8eb] border border-[#f0c371] text-[#936319]">
                                <span>⏳</span>
                                <span>Pending MC: Proposed {item.changeRequest.proposedTime}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCancelChangeRequest(item)}
                                  className="ml-1 text-[#936319] hover:text-[#5e3b0b] font-bold cursor-pointer"
                                  title="Withdraw change request"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : item.changeRequest && item.changeRequest.status === 'accepted' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#eefaf3] border border-[#a2dfbe] text-[#1e6f47]">
                                <span>✓</span>
                                <span>MC Accepted ({item.changeRequest.proposedTime})</span>
                              </div>
                            ) : item.changeRequest && item.changeRequest.status === 'declined' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 border border-stone-200 text-stone-700">
                                <span>✕</span>
                                <span>MC Kept Original</span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenChangeRequestModal(item)}
                                  className="text-[10px] text-[#bd9661] hover:underline ml-1 cursor-pointer font-bold"
                                >
                                  Request Again
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenChangeRequestModal(item)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#faf3e8] border border-[#d6ba90] text-[#936932] hover:bg-[#f5e7d0] transition-colors cursor-pointer shadow-2xs"
                                title="Send a schedule change request to the MC"
                              >
                                <IconMessage />
                                <span>Request Change</span>
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleMoveCue(item, -1)}
                                className="bg-white border border-[#d5c7b5] hover:bg-[#f0ede6] text-[#15110e] text-xs font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveCue(item, 1)}
                                className="bg-white border border-[#d5c7b5] hover:bg-[#f0ede6] text-[#15110e] text-xs font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                                title="Move Down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCue(item)}
                                className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                                title="Delete Activity"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>`;

if (rowActionPattern.test(content)) {
  content = content.replace(rowActionPattern, newRowActionCode);
  console.log('Replaced row actions successfully!');
} else {
  console.log('Row action pattern NOT found!');
}

// 2. Replace the Header Buttons
const headerButtonPattern = /\{\/\* Header Action Buttons[\s\S]*?<IconPlus \/>\s*<span>Add Activity<\/span>\s*<\/button>\s*<\/div>/;
const newHeaderButtonCode = `{/* Header Action Buttons: Share Vendor Copy, Import Template, Cheers AI, Print, Add Activity */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Share or print read-only run sheet for vendors (excluding private notes)"
          >
            <IconShare />
            <span>Share Vendor Copy</span>
          </button>

          <button
            type="button"
            onClick={handleOpenTemplateModal}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Import activities from standard wedding run sheet templates"
          >
            <IconTemplate />
            <span>Import Template</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAiModal}
            className="bg-[#241c15] hover:bg-[#382b21] text-[#dfc194] border border-[#bd9661]/40 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="AI draft generator and spreadsheet/text timeline parser"
          >
            <IconSparkles />
            <span>Cheers AI</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <IconPrinter />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <IconPlus />
            <span>Add Activity</span>
          </button>
        </div>`;

if (headerButtonPattern.test(content)) {
  content = content.replace(headerButtonPattern, newHeaderButtonCode);
  console.log('Replaced header buttons successfully!');
} else {
  console.log('Header button pattern NOT found!');
}

fs.writeFileSync(filePath, content, 'utf8');
