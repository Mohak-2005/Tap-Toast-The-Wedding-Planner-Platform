const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/CoupleView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetBeforeSection = `            )}
          </section>
          )
        )}`;

const mcModalsCode = `            )}

            {/* MC Standard Template Import Modal */}
            {showMcTemplateModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white border border-[#bd9661] rounded-2xl max-w-3xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                        STANDARD RUN SHEET TEMPLATES
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#15110e]">
                        Import Run Sheet Template
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMcTemplateModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {STANDARD_RUN_SHEET_TEMPLATES.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            setSelectedMcTemplateId(tmpl.id);
                            setMcTemplateRows(tmpl.items.map(i => ({ ...i, selected: true })));
                          }}
                          className={\`p-3 text-left rounded-xl border transition-all cursor-pointer \${
                            selectedMcTemplateId === tmpl.id
                              ? 'bg-[#faf6ee] border-[#bd9661] ring-2 ring-[#bd9661]/30 shadow-xs'
                              : 'bg-white border-[#e0d4c3] hover:border-[#bd9661]'
                          }\`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-bold text-xs text-[#15110e] truncate">{tmpl.name}</span>
                            <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#ebdcc9] text-[#715433]">{tmpl.badge}</span>
                          </div>
                          <p className="text-[10.5px] text-[#7a6a59] line-clamp-2 leading-tight">{tmpl.subtitle}</p>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#faf7f2] border border-[#e8ded0] rounded-xl flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#15110e]">Mode:</span>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="mcTemplateImportMode"
                            checked={mcTemplateImportMode === 'replace'}
                            onChange={() => setMcTemplateImportMode('replace')}
                            className="accent-[#bd9661]"
                          />
                          <span>Replace existing cues</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs ml-2">
                          <input
                            type="radio"
                            name="mcTemplateImportMode"
                            checked={mcTemplateImportMode === 'append'}
                            onChange={() => setMcTemplateImportMode('append')}
                            className="accent-[#bd9661]"
                          />
                          <span>Append to current run sheet</span>
                        </label>
                      </div>
                      <span className="text-[11px] text-[#8b7b6b]">{mcTemplateRows.filter(r => r.selected).length} selected</span>
                    </div>

                    <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#faf8f5] border-b border-[#e8ded0] text-[#7d6c5b] sticky top-0">
                          <tr>
                            <th className="p-2 w-8 text-center">
                              <input
                                type="checkbox"
                                checked={mcTemplateRows.length > 0 && mcTemplateRows.every(r => r.selected)}
                                onChange={(e) => {
                                  const c = e.target.checked;
                                  setMcTemplateRows(prev => prev.map(r => ({ ...r, selected: c })));
                                }}
                                className="accent-[#bd9661]"
                              />
                            </th>
                            <th className="p-2 w-20">Time</th>
                            <th className="p-2">Activity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebdcc9]/60">
                          {mcTemplateRows.map((row, idx) => (
                            <tr key={idx} className={row.selected ? 'bg-white' : 'bg-[#f7f4ee]/70 opacity-60'}>
                              <td className="p-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.selected}
                                  onChange={(e) => {
                                    const c = e.target.checked;
                                    setMcTemplateRows(prev => prev.map((r, i) => i === idx ? { ...r, selected: c } : r));
                                  }}
                                  className="accent-[#bd9661]"
                                />
                              </td>
                              <td className="p-2 font-mono font-bold">{row.time}</td>
                              <td className="p-2 font-semibold text-[#15110e]">{row.activity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-end gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowMcTemplateModal(false)}
                      className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyMcTemplate}
                      className="px-5 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Apply &amp; Save ({mcTemplateRows.filter(r => r.selected).length}) &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MC Cheers AI Modal */}
            {showMcAiModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white border border-[#bd9661] rounded-2xl max-w-3xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#241c15] text-[#dfc194] flex items-center justify-center border border-[#bd9661]/40 shrink-0">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                          CHEERS AI WEDDING TIMELINE
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#15110e]">
                          AI Run Sheet Generator &amp; Import
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMcAiModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex border-b border-[#e8ded0] px-5 bg-white shrink-0">
                    <button
                      type="button"
                      onClick={() => setMcAiModalTab('draft')}
                      className={\`py-3 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer \${
                        mcAiModalTab === 'draft' ? 'border-[#bd9661] text-[#15110e]' : 'border-transparent text-[#8b7b6b]'
                      }\`}
                    >
                      ✨ AI Draft Generator
                    </button>
                    <button
                      type="button"
                      onClick={() => setMcAiModalTab('import')}
                      className={\`py-3 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer \${
                        mcAiModalTab === 'import' ? 'border-[#bd9661] text-[#15110e]' : 'border-transparent text-[#8b7b6b]'
                      }\`}
                    >
                      📄 Document Parser
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto space-y-4 text-xs">
                    {mcAiModalTab === 'draft' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">Ceremony Time</label>
                          <input
                            type="text"
                            value={mcAiCeremonyTime}
                            onChange={(e) => setMcAiCeremonyTime(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-1.5 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">Reception Time</label>
                          <input
                            type="text"
                            value={mcAiReceptionTime}
                            onChange={(e) => setMcAiReceptionTime(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-1.5 font-mono font-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">Paste Raw Timeline</label>
                        <textarea
                          rows={4}
                          value={mcAiRawText}
                          onChange={(e) => setMcAiRawText(e.target.value)}
                          placeholder="15:00 Ceremony&#10;16:30 Canapes&#10;18:00 Grand Entrance&#10;19:30 Speeches"
                          className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl p-3 font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const p = parseRawRunSheetText(mcAiRawText);
                            setMcAiParsedRows(p.map(x => ({ ...x, selected: true })));
                          }}
                          className="mt-2 px-3 py-1 bg-[#15110e] text-[#dfc194] rounded-lg font-bold"
                        >
                          Parse Schedule
                        </button>
                      </div>
                    )}

                    {mcAiParsedRows.length > 0 && (
                      <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#faf8f5] border-b border-[#e8ded0]">
                            <tr>
                              <th className="p-2 w-8 text-center">✓</th>
                              <th className="p-2 w-20">Time</th>
                              <th className="p-2">Activity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#ebdcc9]/50">
                            {mcAiParsedRows.map((r, i) => (
                              <tr key={i} className={r.selected ? 'bg-white' : 'opacity-50'}>
                                <td className="p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={r.selected}
                                    onChange={(e) => {
                                      const c = e.target.checked;
                                      setMcAiParsedRows(prev => prev.map((x, idx) => idx === i ? { ...x, selected: c } : x));
                                    }}
                                    className="accent-[#bd9661]"
                                  />
                                </td>
                                <td className="p-2 font-mono font-bold">{r.time}</td>
                                <td className="p-2 font-semibold">{r.activity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-end gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowMcAiModal(false)}
                      className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={mcAiParsedRows.filter(r => r.selected).length === 0}
                      onClick={handleApplyMcAiRows}
                      className="px-5 py-2 bg-[#bd9661] disabled:opacity-40 text-[#15110e] font-bold rounded-xl shadow-sm cursor-pointer"
                    >
                      Save ({mcAiParsedRows.filter(r => r.selected).length}) to Run Sheet &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MC Share Vendor Copy Modal */}
            {showMcShareModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white border border-[#bd9661] rounded-2xl max-w-2xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                        EXTERNAL VENDOR ACCESS
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#15110e]">
                        Share Vendor Master Schedule
                      </h3>
                      <p className="text-xs text-[#8b7b6b] mt-0.5">
                        Clean read-only copy for suppliers. Private MC stage directions are excluded.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMcShareModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto space-y-4 text-xs">
                    <div className="p-3.5 bg-[#faf7f2] border border-[#e8dfd1] rounded-xl space-y-2">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                        Shareable Read-Only Link
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={\`https://taptoast.app/schedule/\${wedding.id || 'w1'}/vendor-access?token=vlive_2026\`}
                          className="flex-1 bg-white border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs font-mono text-[#15110e] outline-none select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(\`https://taptoast.app/schedule/\${wedding.id || 'w1'}/vendor-access?token=vlive_2026\`);
                            setMcShareCopied(true);
                            showToast('Link copied to clipboard', 'success');
                            setTimeout(() => setMcShareCopied(false), 2000);
                          }}
                          className="px-4 py-2 bg-[#15110e] hover:bg-[#28201a] text-[#dfc194] rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                        >
                          {mcShareCopied ? '✓ Copied' : 'Copy Link'}
                        </button>
                      </div>
                    </div>

                    <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                      <div className="bg-[#faf8f5] p-2.5 font-bold text-[11px] text-[#7d6c5b] border-b border-[#e8ded0]">
                        Schedule Preview ({runSheet.length} entries)
                      </div>
                      <div className="divide-y divide-[#ebdcc9]/50">
                        {runSheet.map((item) => (
                          <div key={item.id} className="p-3 bg-white flex items-start gap-3">
                            <span className="font-mono text-xs font-bold bg-[#15110e] text-[#dfc194] px-2 py-0.5 rounded shrink-0">
                              {item.time}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs text-[#15110e]">{item.activity}</div>
                              {item.notes && <p className="text-[11px] text-[#6b5847] mt-0.5">{item.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-between gap-2.5 shrink-0">
                    <span className="text-[11px] text-[#8b7b6b]">Clean printable format excluding stage directions.</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMcShareModal(false)}
                        className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-[#15110e] text-[#dfc194] rounded-xl font-bold cursor-pointer"
                      >
                        Print Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          )
        )}`;

if (!content.includes('showMcTemplateModal &&')) {
  content = content.replace(targetBeforeSection, mcModalsCode);
  console.log('Appended MC modals to CoupleView successfully!');
} else {
  console.log('MC modals already present or target not found!');
}

fs.writeFileSync(filePath, content, 'utf8');
