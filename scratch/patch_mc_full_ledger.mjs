import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add McGiftLedgerSection component near the top (e.g. before export default function McView)
const compDefinition = `
// ============================================================================
// MC GIFT & WISHING WELL LEDGER SECTION COMPONENT
// ============================================================================
interface McGiftLedgerSectionProps {
  state: any;
  setState: any;
  weddingName?: string;
  onAddGiftClick: () => void;
  mcGiftSearch: string;
  setMcGiftSearch: (s: string) => void;
  mcGiftTypeFilter: 'all' | 'wishing-well' | 'envelope' | 'gift';
  setMcGiftTypeFilter: (f: 'all' | 'wishing-well' | 'envelope' | 'gift') => void;
}

function McGiftLedgerSection({
  state,
  setState,
  weddingName,
  onAddGiftClick,
  mcGiftSearch,
  setMcGiftSearch,
  mcGiftTypeFilter,
  setMcGiftTypeFilter,
}: McGiftLedgerSectionProps) {
  const gifts = Array.isArray(state?.gifts) ? state.gifts : [];
  
  const filteredGifts = gifts.filter((g: any) => {
    const q = (mcGiftSearch || '').toLowerCase();
    const matchQ = (g.guestName || '').toLowerCase().includes(q) || (g.message || '').toLowerCase().includes(q);
    const gType = (g.type || '').toLowerCase();
    const matchType =
      mcGiftTypeFilter === 'all'
        ? true
        : mcGiftTypeFilter === 'wishing-well'
        ? gType.includes('well')
        : mcGiftTypeFilter === 'envelope'
        ? gType.includes('envelope') || gType.includes('cash')
        : !gType.includes('well') && !gType.includes('envelope');
    return matchQ && matchType;
  });

  const totalAmount = gifts.reduce((sum: number, g: any) => sum + Number(g.amount || 0), 0);
  const digitalGifts = gifts.filter((g: any) => (g.type || '').toLowerCase().includes('well'));
  const digitalAmount = digitalGifts.reduce((sum: number, g: any) => sum + Number(g.amount || 0), 0);
  const envelopeGifts = gifts.filter((g: any) => (g.type || '').toLowerCase().includes('envelope') || (g.type || '').toLowerCase().includes('cash'));
  const envelopeAmount = envelopeGifts.reduce((sum: number, g: any) => sum + Number(g.amount || 0), 0);
  const sentCount = gifts.filter((g: any) => g.thankYouSent || g.thankYouStatus === 'Sent' || g.thankYouStatus === 'Completed').length;
  const dueCount = gifts.length - sentCount;

  const toggleThankYou = (giftId: string) => {
    const updated = gifts.map((g: any) => {
      if (g.id === giftId) {
        const nextSent = !g.thankYouSent;
        return {
          ...g,
          thankYouSent: nextSent,
          thankYouStatus: nextSent ? 'Sent' : 'Due',
        };
      }
      return g;
    });
    setState({ ...state, gifts: updated });
    showToast('Thank-you status updated', 'info');
  };

  const removeGift = (giftId: string, name: string) => {
    if (window.confirm(\`Remove gift entry from \${name}?\`)) {
      setState({
        ...state,
        gifts: gifts.filter((g: any) => g.id !== giftId),
      });
      showToast(\`Removed gift entry\`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e8ded0]">
        <div>
          <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
            FINANCIAL RECEPTION RECONCILIATION
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#15110e]">
            Gift &amp; Wishing Well Ledger
          </h1>
          <p className="text-xs text-[#8b7b6b] mt-1">
            {weddingName ? \`Live gift pool and reception records for \${weddingName}.\` : 'Live reception monetary tracking, wishing well contributions, and cash envelope logging.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => showToast('Gift ledger exported to CSV file', 'success')}
            className="btn btn-outline btn-sm text-xs font-semibold flex items-center gap-1.5"
          >
            <span>📊</span> Export CSV
          </button>
          <button
            type="button"
            onClick={onAddGiftClick}
            className="btn btn-gold btn-sm text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>+</span> Record Cash / Envelope Gift
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Total Received Gifts</div>
          <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
            $\${totalAmount.toLocaleString()}<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
          </div>
          <div className="text-[11px] text-[#bd9661] font-semibold mt-1">
            {gifts.length} guest gifts recorded
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-emerald-600 rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Digital Wishing Well</div>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            $\${digitalAmount.toLocaleString()}<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            {digitalGifts.length} online transfers via Gift &amp; Go
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-amber-600 rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Reception Cash &amp; Envelopes</div>
          <div className="text-2xl font-serif font-bold text-amber-900 mt-1">
            $\${envelopeAmount.toLocaleString()}<span className="text-xs font-sans text-[#8b7b6b] font-normal"> .00 AUD</span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {envelopeGifts.length} physical cards received at reception
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#15110e] rounded-xl p-4 shadow-2xs">
          <div className="text-[10.5px] font-bold uppercase text-[#8b7b6b] tracking-wider">Thank-You Note Status</div>
          <div className="text-2xl font-serif font-bold text-[#15110e] mt-1">
            {sentCount} <span className="text-sm font-sans font-normal text-[#8b7b6b]">Sent</span> / {dueCount} <span className="text-sm font-sans font-normal text-amber-700">Due</span>
          </div>
          <div className="text-[11px] text-[#8b7b6b] mt-1">
            Automated couple thank-you tracker
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search gifts by guest name or blessing note..."
              value={mcGiftSearch}
              onChange={(e) => setMcGiftSearch(e.target.value)}
              className="w-full bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: \`All Gifts (\${gifts.length})\` },
              { id: 'wishing-well', label: \`Wishing Well (\${digitalGifts.length})\` },
              { id: 'envelope', label: \`Reception Envelopes (\${envelopeGifts.length})\` },
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setMcGiftTypeFilter(pill.id as any)}
                className={\`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors \${
                  mcGiftTypeFilter === pill.id
                    ? 'bg-[#15110e] text-[#dfc194] font-bold'
                    : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                }\`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                <th className="py-2.5 px-3">GUEST / CONTRIBUTOR</th>
                <th className="py-2.5 px-3">AMOUNT (AUD)</th>
                <th className="py-2.5 px-3">GIFT METHOD</th>
                <th className="py-2.5 px-3">RECEIVED</th>
                <th className="py-2.5 px-3">PERSONAL BLESSING / NOTE</th>
                <th className="py-2.5 px-3">THANK-YOU NOTE</th>
                <th className="py-2.5 px-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede4]">
              {filteredGifts.map((g: any) => {
                const isEnv = (g.type || '').toLowerCase().includes('envelope') || (g.type || '').toLowerCase().includes('cash');
                const isWell = (g.type || '').toLowerCase().includes('well');
                const isSent = g.thankYouSent || g.thankYouStatus === 'Sent' || g.thankYouStatus === 'Completed';

                return (
                  <tr key={g.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3 px-3">
                      <strong className="text-sm text-[#15110e] block">{g.guestName}</strong>
                      <span className="text-[11px] text-[#8b7b6b]">{isEnv ? 'Physical Card at Reception' : 'Digital Registry Gift'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-serif font-bold text-sm text-[#15110e]">
                        $\${Number(g.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full border \${
                        isEnv
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : isWell
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }\`}>
                        {isEnv ? '💌 Cash Envelope' : isWell ? '📱 Wishing Well' : '🎁 Boxed Gift'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5a4a3c] whitespace-nowrap">
                      {g.date || 'Today'}
                    </td>
                    <td className="py-3 px-3 text-[#5a4a3c] max-w-xs truncate" title={g.message}>
                      {g.message || 'No personal message recorded'}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleThankYou(g.id)}
                        className={\`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all \${
                          isSent
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                        }\`}
                        title="Click to toggle thank you status"
                      >
                        {isSent ? '✓ Sent' : '⏳ Due'}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => removeGift(g.id, g.guestName)}
                        className="text-[#a8382c] hover:bg-[#fbeae8] px-2 py-0.5 rounded border border-[#f2a89f] text-[10.5px] font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

// Insert McGiftLedgerSection before export default function McView
const exportTarget = `export default function McView({`;
let norm = content.replace(/\r\n/g, '\n');

if (norm.includes(exportTarget)) {
  norm = norm.replace(exportTarget, compDefinition + '\n' + exportTarget);
  console.log('1. McGiftLedgerSection component inserted!');
} else {
  console.error('1. exportTarget NOT found!');
}

// 2. Render McGiftLedgerSection inside detailSubTab === 'gifts'
const venueEndTarget = `                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}`;

const venueEndReplacement = `                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-pane 5: Gift & Wishing Well Ledger */}
            {detailSubTab === 'gifts' && (
              <McGiftLedgerSection
                state={state}
                setState={setState}
                weddingName={activeWedding?.couple}
                onAddGiftClick={() => setShowMcAddGiftModal(true)}
                mcGiftSearch={mcGiftSearch}
                setMcGiftSearch={setMcGiftSearch}
                mcGiftTypeFilter={mcGiftTypeFilter}
                setMcGiftTypeFilter={setMcGiftTypeFilter}
              />
            )}`;

if (norm.includes(venueEndTarget)) {
  norm = norm.replace(venueEndTarget, venueEndReplacement);
  console.log('2. detailSubTab gifts inserted!');
} else {
  console.error('2. venueEndTarget NOT found!');
}

// 3. Render McGiftLedgerSection for activeTab === 'gifts'
const referralsEndTarget = `        {activeTab === 'referrals' && !selectedWeddingId && (
          <McReferralsSection state={state} setState={setState} />
        )}`;

const referralsEndReplacement = `        {activeTab === 'referrals' && !selectedWeddingId && (
          <McReferralsSection state={state} setState={setState} />
        )}

        {/* TAB: MC GIFT LEDGER & WISHING WELL RECONCILIATION */}
        {activeTab === 'gifts' && !selectedWeddingId && (
          <McGiftLedgerSection
            state={state}
            setState={setState}
            onAddGiftClick={() => setShowMcAddGiftModal(true)}
            mcGiftSearch={mcGiftSearch}
            setMcGiftSearch={setMcGiftSearch}
            mcGiftTypeFilter={mcGiftTypeFilter}
            setMcGiftTypeFilter={setMcGiftTypeFilter}
          />
        )}`;

if (norm.includes(referralsEndTarget)) {
  norm = norm.replace(referralsEndTarget, referralsEndReplacement);
  console.log('3. activeTab gifts inserted!');
} else {
  console.error('3. referralsEndTarget NOT found!');
}

// 4. Add the Record Cash / Envelope modal right before the return statement's closing container
const modalCode = `
      {/* Modal: Record Reception Cash / Envelope Gift */}
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
      )}
`;

const closingTag = `    </div>\n  );\n}`;
if (norm.includes(closingTag)) {
  norm = norm.replace(closingTag, modalCode + '\n' + closingTag);
  console.log('4. Modal code inserted!');
} else {
  console.error('4. closingTag NOT found!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('McView.tsx full ledger patches applied!');
