import React, { useState } from 'react';
import { useAppState, showToast } from '../lib/state';
import JoeyChatbot from './JoeyChatbot';

export default function McMobileView() {
  const { state, setState } = useAppState();
  const [activeTab, setActiveTab] = useState<'runsheet' | 'seating' | 'dietary' | 'invoices'>('runsheet');
  const wedding = state.weddings[0];
  const cues = wedding.privateRunSheet || [];

  const handleToggleCue = (id: string) => {
    const updatedCues = cues.map(c => (c.id === id ? { ...c, done: !c.done } : c));
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, privateRunSheet: updatedCues } : w));
    setState({ ...state, weddings: updatedWeddings });
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-54px)] overflow-hidden font-sans">
      <div className="w-[402px] max-w-[402px] h-[874px] max-h-[calc(100vh-70px)] bg-[#f8f6f2] rounded-[46px] border-[4px] border-[#1c1511] shadow-2xl overflow-hidden relative flex flex-col">
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-2 text-[13.5px] font-bold select-none bg-[#15110e] text-[#f8f3eb] border-b border-white/5 flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[#bd9661]">5G</span>
            <div className="w-5 h-2.5 border-[1.5px] border-current rounded-xs p-0.5 flex items-center relative">
              <div className="w-[85%] h-full bg-[#bd9661] rounded-[1px]" />
              <div className="absolute -right-1 top-0.5 w-[2px] h-1 bg-current rounded-r-xs" />
            </div>
          </div>
        </div>

        {/* MC Mobile Header */}
        <header className="bg-[#15110e] text-white px-4 py-3 border-b-2 border-[#bd9661] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-[#bd9661] font-bold">
              MC Mobile Companion
            </div>
            <h2 className="font-serif text-lg font-bold text-white">Robert Galati</h2>
            <div className="text-[10px] text-[#a8988a]">Sophie &amp; James · 14 Nov 2026</div>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#bd9661] bg-[#261e18] flex items-center justify-center text-xs font-bold text-[#dfc194]">
            RG
          </div>
        </header>

        {/* Tab Selector */}
        <nav className="bg-[#241c16] px-2 flex items-center gap-1 border-b border-[#382c22] overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'runsheet', label: '⏱️ Run Sheet' },
            { id: 'seating', label: '🪑 Seating' },
            { id: 'dietary', label: '🍽️ Kitchen' },
            { id: 'invoices', label: '💳 Billing' },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.id
                  ? 'border-[#bd9661] text-[#e6cda6] bg-[#bd9661]/10'
                  : 'border-transparent text-[#bfaea0] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs no-scrollbar">
          {activeTab === 'runsheet' && (
            <div className="space-y-2.5">
              {cues.map(cue => (
                <div
                  key={cue.id}
                  className={`bg-white border rounded-xl p-3 shadow-xs ${
                    cue.done ? 'border-[#d1dfcb] bg-emerald-50/30 opacity-70' : 'border-[#e8ded0]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={cue.done}
                      onChange={() => handleToggleCue(cue.id)}
                      className="w-4 h-4 mt-0.5 rounded text-[#bd9661]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-[#bd9661] bg-[#1a1511] px-1.5 py-0.5 rounded">
                          {cue.time}
                        </span>
                        {cue.done && (
                          <span className="text-[10px] text-emerald-700 font-bold">✓ Cued</span>
                        )}
                      </div>
                      <div className={`font-serif font-bold text-sm mt-1 ${cue.done ? 'line-through text-[#8b7b6b]' : 'text-[#15110e]'}`}>
                        {cue.activity}
                      </div>
                      <p className="text-[#6b5847] mt-1 text-[11px] leading-relaxed">{cue.notes}</p>
                      {cue.privateNotes && (
                        <div className="mt-1.5 p-1.5 bg-[#fff8ee] border border-[#ebd4b8] rounded text-[10px] text-[#8c5b1e]">
                          <strong>Private:</strong> {cue.privateNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'seating' && (
            <div className="space-y-3">
              {state.tables.map(tbl => {
                const seated = state.guests.filter(g => g.tableId === tbl.id);
                return (
                  <div key={tbl.id} className="bg-white border border-[#e8ded0] p-3 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between font-bold text-sm mb-1.5 text-[#15110e]">
                      <span>{tbl.name}</span>
                      <span className="text-xs text-[#bd9661]">{seated.length} / {tbl.capacity}</span>
                    </div>
                    <div className="space-y-1">
                      {seated.map(g => (
                        <div key={g.id} className="flex items-center justify-between text-[11px]">
                          <span>{g.name}</span>
                          {g.dietary && g.dietary !== 'None' && (
                            <span className="text-[9px] bg-red-50 text-red-700 px-1 rounded">{g.dietary}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'dietary' && (
            <div className="space-y-3">
              <div className="bg-white border border-[#e8ded0] p-3 rounded-xl shadow-xs">
                <h4 className="font-bold text-sm text-[#15110e] mb-2">Kitchen Dietary Sheet</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b">
                    <span>Vegetarian:</span>
                    <strong className="text-red-700">7 guests</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Gluten-Free:</span>
                    <strong className="text-red-700">5 guests</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Nut Allergy:</span>
                    <strong className="text-red-700">3 guests (Strict)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Halal:</span>
                    <strong className="text-red-700">1 guest</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-3">
              <div className="bg-white border border-[#e8ded0] p-3 rounded-xl shadow-xs">
                <h4 className="font-bold text-sm text-[#15110e] mb-2">Invoice #INV-1081</h4>
                <div className="text-xs space-y-1 text-[#4a3e35]">
                  <div><strong>Client:</strong> Sophie &amp; James</div>
                  <div><strong>Amount:</strong> $1,850.00 AUD</div>
                  <div><strong>Status:</strong> <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">Paid ($925 Deposit + Balance)</span></div>
                  <div><strong>Stripe Transfer:</strong> Complete</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="w-32 h-1 bg-[#15110e] rounded-full mx-auto my-1.5 opacity-30 flex-shrink-0" />

        {/* Embedded Joey */}
        <JoeyChatbot embeddedInPhone={true} />
      </div>
    </div>
  );
}
