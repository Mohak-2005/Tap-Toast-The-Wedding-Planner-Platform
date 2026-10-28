import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Cut modal from McGiftLedgerSection
const modalSection = `      {/* Modal: Record Reception Cash / Envelope Gift */}
      {showMcAddGiftModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8ded0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">
                  Record Reception Envelope / Gift
                </h3>
                <span className="text-xs text-[#8b7b6b]">Log physical cards or contributions handed to the MC</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMcAddGiftModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleMcAddGift} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  CONTRIBUTOR / GUEST NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uncle Arthur & Aunt Evelyn"
                  value={mcGiftName}
                  onChange={(e) => setMcGiftName(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    AMOUNT (AUD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="300"
                    value={mcGiftAmount}
                    onChange={(e) => setMcGiftAmount(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    GIFT TYPE
                  </label>
                  <select
                    value={mcGiftType}
                    onChange={(e) => setMcGiftType(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none"
                  >
                    <option value="Cash Envelope (Podium)">💌 Cash Envelope (Podium)</option>
                    <option value="Cheque in Greeting Card">📜 Cheque in Card</option>
                    <option value="Digital Wishing Well">📱 Wishing Well Transfer</option>
                    <option value="Physical Gift Box">🎁 Physical Boxed Gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  BLESSING MESSAGE / MC NOTE
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Handed to MC at reception podium with greeting card"
                  value={mcGiftMessage}
                  onChange={(e) => setMcGiftMessage(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg p-2 text-xs text-[#15110e] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                <button
                  type="button"
                  onClick={() => setShowMcAddGiftModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#d5c7b5] text-xs font-semibold text-[#8b7b6b] hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#bd9661] hover:bg-[#a6824e] text-[#15110e] text-xs font-bold shadow-sm"
                >
                  Save to Gift Ledger &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}`;

let norm = content.replace(/\r\n/g, '\n');
const normModal = modalSection.replace(/\r\n/g, '\n');

if (norm.includes(normModal)) {
  norm = norm.replace(normModal, '');
  console.log('Removed modal from McGiftLedgerSection!');
} else {
  console.error('Could not find modal in McGiftLedgerSection!');
}

// 2. Insert modal at the end of McView before the final closing tag
const finalEnd = `            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

const finalReplacement = `            </div>
          </div>
        </div>
      )}

${modalSection}
    </div>
  );
}`;

if (norm.includes(finalEnd)) {
  norm = norm.replace(finalEnd, finalReplacement);
  console.log('Inserted modal at end of McView!');
} else {
  console.error('Could not find finalEnd!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('Modal location fixed!');
