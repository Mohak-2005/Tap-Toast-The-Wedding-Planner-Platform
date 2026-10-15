import React, { useState } from 'react';
import { useAppState, useSession, showToast } from '../lib/state';
import { PrivateRunSheetItem } from '../lib/types';

interface McViewProps {
  onSelectView?: (view: string) => void;
}

export default function McView({ onSelectView }: McViewProps) {
  const { state, setState } = useAppState();
  const { session, setSession } = useSession();
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>('w1');
  const [activeTab, setActiveTab] = useState<'runsheet' | 'seating' | 'dietary' | 'logistics'>('runsheet');
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPrivateNotes, setNewPrivateNotes] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const wedding = state.weddings.find(w => w.id === selectedWeddingId) || state.weddings[0];
  const runSheet = wedding.privateRunSheet || [];

  const handleToggleDone = (cueId: string) => {
    const updatedCues = runSheet.map(c => {
      if (c.id === cueId) return { ...c, done: !c.done };
      return c;
    });
    updateWeddingRunSheet(updatedCues);
  };

  const handleMoveCue = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === runSheet.length - 1)) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...runSheet];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    updateWeddingRunSheet(updated);
    showToast('Run sheet cue reordered', 'info');
  };

  const handleDeleteCue = (cueId: string) => {
    const updated = runSheet.filter(c => c.id !== cueId);
    updateWeddingRunSheet(updated);
    showToast('Cue removed from run sheet', 'info');
  };

  const handleAddCue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newActivity) return;
    const newItem: PrivateRunSheetItem = {
      id: 'pmc_' + Date.now(),
      time: newTime,
      activity: newActivity,
      notes: newNotes,
      privateNotes: newPrivateNotes,
      done: false,
      order: runSheet.length + 1
    };
    updateWeddingRunSheet([...runSheet, newItem]);
    setNewTime('');
    setNewActivity('');
    setNewNotes('');
    setNewPrivateNotes('');
    setShowAddModal(false);
    showToast('New stage cue added to run sheet', 'success');
  };

  const updateWeddingRunSheet = (newCues: PrivateRunSheetItem[]) => {
    const updatedWeddings = state.weddings.map(w => {
      if (w.id === wedding.id) {
        return { ...w, privateRunSheet: newCues };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  // Dietary counts
  const dietCounts: Record<string, number> = {};
  state.guests.forEach(g => {
    if (g.dietary && g.dietary !== 'None') {
      dietCounts[g.dietary] = (dietCounts[g.dietary] || 0) + 1;
    }
  });

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-54px)] bg-[#f8f6f2] font-sans">
      {/* Impersonation Banner if applicable */}
      {session?.impersonating && (
        <div className="bg-[#bd9661] text-[#15110e] px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-[#a8824f]">
          <div className="flex items-center gap-2">
            <span>👑</span>
            <span>SUPER ADMIN IMPERSONATION MODE: Viewing Console as Robert Galati</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSession({ role: 'superadmin', email: 'admin@tapandtoast.demo', name: 'Platform Admin', keepSignedIn: true });
              if (onSelectView) onSelectView('superadmin');
            }}
            className="bg-[#15110e] text-white px-2.5 py-1 rounded text-xs hover:bg-[#231c17] transition-colors"
          >
            Exit Impersonation &rarr;
          </button>
        </div>
      )}

      {/* MC Pro Header */}
      <header className="bg-[#15110e] text-white p-5 border-b border-[#2b221a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#bd9661]">
              Professional MC Console
            </span>
            <span className="bg-[#2a2119] text-[#e6cda6] text-[10px] px-2 py-0.5 rounded border border-[#3d2f23] font-semibold">
              Galati MC &amp; Entertainment
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mt-0.5">
            Robert Galati · Lead Master of Ceremonies
          </h1>
        </div>

        {/* Wedding Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#a8988a] font-medium hidden sm:inline">Active Client:</label>
          <select
            value={selectedWeddingId}
            onChange={(e) => setSelectedWeddingId(e.target.value)}
            className="bg-[#241c16] text-[#dfc194] border border-[#4a3a2d] focus:border-[#bd9661] text-xs font-semibold rounded-lg px-3 py-2 outline-none"
          >
            {state.weddings.map(w => (
              <option key={w.id} value={w.id}>
                {w.couple} ({w.dateDisplay} · {w.venue.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Nav Tabs */}
      <div className="bg-[#241c16] px-5 flex items-center gap-1 border-b border-[#382c22] overflow-x-auto no-scrollbar">
        {[
          { id: 'runsheet', label: '⏱️ Live Wedding Run Sheet' },
          { id: 'seating', label: '🪑 Seating Floor Plan' },
          { id: 'dietary', label: '🍽️ Catering & Dietaries' },
          { id: 'logistics', label: '📍 Venue Logistics' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id
                ? 'border-[#bd9661] text-[#e6cda6] bg-[#bd9661]/10'
                : 'border-transparent text-[#bfaea0] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* ============================================================== */}
        {/* TAB 1: RUN SHEET                                               */}
        {/* ============================================================== */}
        {activeTab === 'runsheet' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#15110e]">
                  {wedding.couple} — Minute-by-Minute Run Sheet
                </h2>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Private cues, audio notes, and AV technician triggers. Reorder with ▲ and ▼.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs w-fit"
              >
                + Add Stage Cue
              </button>
            </div>

            {/* Run Sheet Table / Cards */}
            <div className="space-y-3">
              {runSheet.map((cue, idx) => (
                <div
                  key={cue.id}
                  className={`bg-white border rounded-xl p-4 shadow-xs transition-all ${
                    cue.done ? 'border-[#d1dfcb] bg-[#f9fbf9] opacity-75' : 'border-[#e8ded0] hover:border-[#bd9661]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={cue.done}
                        onChange={() => handleToggleDone(cue.id)}
                        className="w-4 h-4 mt-1 rounded text-[#bd9661] focus:ring-[#bd9661]"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#bd9661] bg-[#1a1511] px-2 py-0.5 rounded">
                            {cue.time}
                          </span>
                          <h4 className={`font-serif text-base font-bold ${cue.done ? 'line-through text-[#8b7b6b]' : 'text-[#15110e]'}`}>
                            {cue.activity}
                          </h4>
                        </div>
                        <p className="text-xs text-[#4a3e35] mt-1.5 leading-relaxed">
                          {cue.notes}
                        </p>
                        {cue.privateNotes && (
                          <div className="mt-2 p-2 bg-[#fff8ee] border border-[#ebd4b8] rounded text-xs text-[#8c5b1e] flex items-start gap-1.5">
                            <span className="font-bold uppercase text-[9px] bg-[#8c5b1e] text-white px-1 rounded flex-shrink-0 mt-0.5">
                              MC Confidential
                            </span>
                            <span>{cue.privateNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Reorder & Delete */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveCue(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="w-6 h-6 rounded bg-[#f5f2eb] hover:bg-[#e8ded0] disabled:opacity-30 text-[#15110e] text-xs font-bold flex items-center justify-center"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCue(idx, 'down')}
                        disabled={idx === runSheet.length - 1}
                        title="Move Down"
                        className="w-6 h-6 rounded bg-[#f5f2eb] hover:bg-[#e8ded0] disabled:opacity-30 text-[#15110e] text-xs font-bold flex items-center justify-center"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCue(cue.id)}
                        title="Delete Cue"
                        className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding new cue */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[2000]">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#d5c7b5]">
                  <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">Add Run Sheet Cue</h3>
                    <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black">✕</button>
                  </div>
                  <form onSubmit={handleAddCue} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">Time (24h or AM/PM):</label>
                      <input
                        type="text"
                        placeholder="e.g. 18:30 or 6:30 PM"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">Activity Title:</label>
                      <input
                        type="text"
                        placeholder="e.g. Bouquet Toss & Garter"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">Public Notes:</label>
                      <textarea
                        rows={2}
                        placeholder="Notes for venue staff and vendors..."
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">MC Confidential Notes:</label>
                      <textarea
                        rows={2}
                        placeholder="Private audio / lighting cues for Dave the AV tech..."
                        value={newPrivateNotes}
                        onChange={(e) => setNewPrivateNotes(e.target.value)}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2 rounded">
                        Add Cue
                      </button>
                      <button type="button" onClick={() => setShowAddModal(false)} className="px-3 border rounded text-[#8b7b6b]">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SEATING FLOOR PLAN                                      */}
        {/* ============================================================== */}
        {activeTab === 'seating' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#15110e]">
              Floor Plan Seating Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {state.tables.map(tbl => {
                const seated = state.guests.filter(g => g.tableId === tbl.id);
                return (
                  <div key={tbl.id} className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <h4 className="font-serif font-bold text-base text-[#15110e]">{tbl.name}</h4>
                      <span className="text-xs text-[#bd9661] font-semibold">{seated.length} / {tbl.capacity}</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {seated.map(g => (
                        <div key={g.id} className="flex items-center justify-between py-1">
                          <span className="font-semibold text-[#15110e]">{g.name}</span>
                          {g.dietary && g.dietary !== 'None' && (
                            <span className="text-[10px] text-red-700 bg-red-50 px-1.5 rounded">{g.dietary}</span>
                          )}
                        </div>
                      ))}
                      {seated.length === 0 && <span className="text-[#8b7b6b] italic">No guests seated</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: DIETARY SUMMARY                                         */}
        {/* ============================================================== */}
        {activeTab === 'dietary' && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl font-bold text-[#15110e]">
              Catering Dietary Manifest
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(dietCounts).map(([diet, count]) => (
                <div key={diet} className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">{diet}</span>
                  <div className="font-serif text-3xl font-bold text-[#a8382c] mt-1">{count}</div>
                  <div className="text-[11px] text-[#8b7b6b] mt-0.5">Guests with requirement</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: VENUE LOGISTICS                                         */}
        {/* ============================================================== */}
        {activeTab === 'logistics' && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl font-bold text-[#15110e]">
              Venue &amp; Vendor Contacts
            </h2>
            <div className="bg-white border border-[#e8ded0] p-5 rounded-xl shadow-xs space-y-3">
              <h4 className="font-serif text-xl font-bold text-[#15110e]">{wedding.venue}</h4>
              <p className="text-xs text-[#4a3e35]">{wedding.venueAddress}</p>
              <div className="p-3 bg-[#fbf9f6] border rounded text-xs space-y-1">
                <div><strong>AV Tech:</strong> Dave Miller (0418 223 903)</div>
                <div><strong>Celebrant:</strong> Sarah Jenkins (0418 223 902)</div>
                <div><strong>Caterer / Chef:</strong> Executive Chef Marco Rossi</div>
              </div>
              <a
                href="https://maps.google.com/?q=Fernwood+Estate+Mittagong+NSW"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#bd9661] hover:underline"
              >
                📍 Open Google Maps &rarr;
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
