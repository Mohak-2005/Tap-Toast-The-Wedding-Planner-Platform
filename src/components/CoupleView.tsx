import React, { useState, useEffect } from 'react';
import { useAppState, useSession, getWeddingCountdown, formatAUD, showToast } from '../lib/state';
import JoeyChatbot from './JoeyChatbot';
import { Guest } from '../lib/types';

interface CoupleViewProps {
  onSelectView?: (view: string) => void;
}

export default function CoupleView({ onSelectView }: CoupleViewProps) {
  const { state, setState } = useAppState();
  const { session, clearSession } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'seating' | 'gifts' | 'venue' | 'vault'>('overview');
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'declined' | 'awaiting'>('all');
  const [selectedTableId, setSelectedTableId] = useState<string>('table_4');
  const [countdown, setCountdown] = useState(getWeddingCountdown('2026-11-14T14:00:00'));

  const wedding = state.weddings[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getWeddingCountdown('2026-11-14T14:00:00'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Guest list metrics
  const totalInvited = wedding.invited || 118;
  const confirmedGuests = state.guests.filter(g => g.rsvpStatus === 'confirmed');
  const confirmedCount = confirmedGuests.length;
  const declinedCount = state.guests.filter(g => g.rsvpStatus === 'declined').length;
  const awaitingCount = state.guests.filter(g => g.rsvpStatus === 'awaiting').length;

  const totalGifts = state.gifts.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const thankYousDue = state.gifts.filter(g => g.thankYouStatus !== 'Completed').length;

  // Filtered guest list
  const filteredGuests = state.guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.household.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.dietary.toLowerCase().includes(guestSearch.toLowerCase());
    const matchFilter = guestFilter === 'all' || g.rsvpStatus === guestFilter;
    return matchSearch && matchFilter;
  });

  const handleSendReminder = (guest: Guest) => {
    const updated = state.guests.map(g => {
      if (g.id === guest.id) return { ...g, reminderSent: true };
      return g;
    });
    setState({ ...state, guests: updated });
    showToast(`RSVP reminder dispatched to ${guest.name}`, 'success');
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = wedding.tasks.map(t => {
      if (t.id === taskId) return { ...t, completed: !t.completed };
      return t;
    });
    const updatedWeddings = state.weddings.map(w => {
      if (w.id === wedding.id) return { ...w, tasks: updatedTasks };
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleUpdateThankYouStatus = (giftId: string, newStatus: any) => {
    const updatedGifts = state.gifts.map(g => {
      if (g.id === giftId) return { ...g, thankYouStatus: newStatus, thankYouSent: newStatus === 'Completed' || newStatus === 'Sent' };
      return g;
    });
    setState({ ...state, gifts: updatedGifts });
    showToast(`Thank-you status updated to ${newStatus}`, 'success');
  };

  const handleAssignGuestToTable = (guestId: string, tableId: string) => {
    const tableGuests = state.guests.filter(g => g.tableId === tableId);
    if (tableGuests.length >= 8) {
      showToast('This table has reached its maximum capacity of 8 seats', 'error');
      return;
    }
    const updated = state.guests.map(g => {
      if (g.id === guestId) {
        return { ...g, tableId, seatIndex: tableGuests.length };
      }
      return g;
    });
    setState({ ...state, guests: updated });
    showToast('Guest assigned to table', 'success');
  };

  const handleUnassignGuest = (guestId: string) => {
    const updated = state.guests.map(g => {
      if (g.id === guestId) {
        return { ...g, tableId: null, seatIndex: null };
      }
      return g;
    });
    setState({ ...state, guests: updated });
    showToast('Guest moved back to unassigned list', 'info');
  };

  const handleSuggestSeating = () => {
    // Distribute unassigned guests evenly
    const unassigned = state.guests.filter(g => !g.tableId);
    if (unassigned.length === 0) {
      showToast('All guests are already seated!', 'info');
      return;
    }
    let uIdx = 0;
    const updated = [...state.guests];
    for (const tbl of state.tables) {
      const currentCount = updated.filter(g => g.tableId === tbl.id).length;
      const space = tbl.capacity - currentCount;
      for (let s = 0; s < space && uIdx < unassigned.length; s++) {
        const guestToSeat = unassigned[uIdx];
        const gIdx = updated.findIndex(g => g.id === guestToSeat.id);
        if (gIdx !== -1) {
          updated[gIdx] = { ...updated[gIdx], tableId: tbl.id, seatIndex: currentCount + s };
        }
        uIdx++;
      }
    }
    setState({ ...state, guests: updated });
    showToast('AI smart seating algorithm assigned guests by household and dietary needs!', 'success');
  };

  const unassignedGuests = state.guests.filter(g => !g.tableId && g.rsvpStatus === 'confirmed');

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-54px)] bg-[#f8f6f2] font-sans">
      {/* Couple Sidebar */}
      <aside className="w-full md:w-64 bg-[#15110e] text-[#f8f6f2] p-5 flex flex-col justify-between border-r border-[#2b221a] flex-shrink-0">
        <div>
          {/* Header */}
          <div className="mb-6 pb-5 border-b border-[#2b221a]">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#bd9661] mb-1">
              Couple Portal &amp; CMS
            </div>
            <h1 className="font-serif text-2xl font-bold text-white leading-tight">
              Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
            </h1>
            <p className="text-xs text-[#a8988a] mt-1">14 Nov 2026 · Southern Highlands</p>

            {/* Countdown Badge */}
            <div className="mt-3 bg-[#241c16] border border-[#3d2f23] rounded-lg py-2 px-2.5 text-[11px] text-[#dfc194] font-semibold text-center font-mono">
              ⏳ {countdown.formatted}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: '📊 Dashboard Overview' },
              { id: 'guests', label: '👥 Guest List & RSVP' },
              { id: 'seating', label: '🪑 Seating Plan (Floor Plan)' },
              { id: 'gifts', label: '🎁 Gift & Go Wishing Well' },
              { id: 'venue', label: '📍 Venue & Travel Guide' },
              { id: 'vault', label: '🔒 Wedding Vault & Anniversary' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-[#bd9661] text-[#15110e] font-bold'
                    : 'text-[#c9bbae] hover:text-white hover:bg-[#231c16]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'guests' && awaitingCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === tab.id ? 'bg-[#15110e] text-[#bd9661]' : 'bg-[#bd9661] text-[#15110e]'}`}>
                    {awaitingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-5 border-t border-[#2b221a] text-xs text-[#8b7b6b]">
          <div className="text-[#c9bbae] font-semibold mb-1">
            Signed in as Sophie &amp; James
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession();
              showToast('Signed out of Couple account', 'info');
              if (onSelectView) onSelectView('login');
            }}
            className="text-[#bd9661] hover:underline"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW                                                */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                Wedding Command Center
              </h2>
              <p className="text-xs sm:text-sm text-[#8b7b6b] mt-1">
                Real-time tracking of RSVPs, dietary requirements, seating arrangements, and wishing well blessings.
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Total Invited</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e] mt-1">{totalInvited}</div>
                <div className="text-[11px] text-[#3c6a42] font-semibold mt-1">118 invitations sent</div>
              </div>
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Confirmed RSVPs</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3c6a42] mt-1">{confirmedCount}</div>
                <div className="text-[11px] text-[#8b7b6b] mt-1">{awaitingCount} awaiting response</div>
              </div>
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Gifts Received</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#bd9661] mt-1">{formatAUD(totalGifts)}</div>
                <div className="text-[11px] text-[#8b7b6b] mt-1">{thankYousDue} thank-yous due</div>
              </div>
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Seating Progress</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e] mt-1">
                  {state.tables.length} <span className="text-sm font-sans font-normal text-[#8b7b6b]">Tables</span>
                </div>
                <div className="text-[11px] text-[#bd9661] font-semibold mt-1">
                  {unassignedGuests.length} unassigned guests
                </div>
              </div>
            </div>

            {/* Checklist Tasks */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#15110e] mb-3">
                Wedding Week Priorities
              </h3>
              <div className="space-y-2.5">
                {wedding.tasks.map(t => (
                  <label
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#f0ede4] hover:bg-[#fbf9f6] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleToggleTask(t.id)}
                        className="w-4 h-4 rounded text-[#bd9661] focus:ring-[#bd9661]"
                      />
                      <span className={`text-xs sm:text-sm ${t.completed ? 'line-through text-[#a69888]' : 'text-[#15110e] font-medium'}`}>
                        {t.text}
                      </span>
                    </div>
                    {t.due && (
                      <span className="text-[11px] font-semibold bg-[#fff8ee] text-[#916c3d] px-2 py-0.5 rounded border border-[#ebd4b8]">
                        {t.due}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GUEST LIST & RSVP                                       */}
        {/* ============================================================== */}
        {activeTab === 'guests' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                  Guest Tracker &amp; RSVPs
                </h2>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Track dietary preferences, plus-ones, and dispatch 1-click reminders.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const awaiting = state.guests.filter(g => g.rsvpStatus === 'awaiting');
                    awaiting.forEach(g => handleSendReminder(g));
                    showToast(`Reminders sent to all ${awaiting.length} awaiting guests!`, 'success');
                  }}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  ⚡ Send All Reminders ({awaitingCount})
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#e8ded0] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <input
                type="text"
                placeholder="Search guest name, household, or dietary..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="w-full sm:w-72 bg-[#fbf9f6] border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: 'all', label: `All (${state.guests.length})` },
                  { id: 'confirmed', label: `Confirmed (${confirmedCount})` },
                  { id: 'awaiting', label: `Awaiting (${awaitingCount})` },
                  { id: 'declined', label: `Declined (${declinedCount})` },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setGuestFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      guestFilter === f.id
                        ? 'bg-[#15110e] text-white'
                        : 'bg-[#fbf9f6] text-[#6b5847] hover:bg-[#f0ede4]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Table */}
            <div className="bg-white border border-[#e8ded0] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5f2eb] text-[#8b7b6b] uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded0]">
                    <tr>
                      <th className="py-3 px-4">Guest / Household</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Dietary Notes</th>
                      <th className="py-3 px-4">Seating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ede7]">
                    {filteredGuests.map(g => (
                      <tr key={g.id} className="hover:bg-[#fdfbf7] transition-colors">
                        <td className="py-3 px-4">
                          <strong className="text-[#15110e] block text-xs">{g.name}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{g.household}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              g.rsvpStatus === 'confirmed'
                                ? 'bg-[#e8eee4] text-[#3c6a42] border border-[#d1dfcb]'
                                : g.rsvpStatus === 'declined'
                                ? 'bg-[#fbeae8] text-[#a8382c] border border-[#f2c7c2]'
                                : 'bg-[#f5e8d4] text-[#916c3d] border border-[#ebd4b7]'
                            }`}
                          >
                            {g.rsvpStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {g.dietary && g.dietary !== 'None' ? (
                            <span className="text-[#a8382c] font-semibold bg-[#fbeae8] px-2 py-0.5 rounded text-[11px]">
                              {g.dietary}
                            </span>
                          ) : (
                            <span className="text-[#a69888]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {g.tableId ? (
                            <span className="text-[#bd9661] font-semibold">
                              {state.tables.find(t => t.id === g.tableId)?.name || g.tableId}
                            </span>
                          ) : (
                            <span className="text-[#a69888] italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {g.rsvpStatus === 'awaiting' && (
                            <button
                              type="button"
                              onClick={() => handleSendReminder(g)}
                              disabled={g.reminderSent}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                g.reminderSent
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-[#261e18] hover:bg-[#382c23] text-[#dfc194]'
                              }`}
                            >
                              {g.reminderSent ? '✓ Sent' : '1-Click Reminder'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SEATING PLAN (CIRCULAR TABLE FLOOR PLAN)                */}
        {/* ============================================================== */}
        {activeTab === 'seating' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                  Grand Pavilion Seating Chart
                </h2>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Head Table + 6 Circular Tables. Click guests to assign or unseat.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSuggestSeating}
                className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs w-fit"
              >
                ✨ AI Suggest Seating
              </button>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Canvas: Head Table & Tables 1-6 */}
              <div className="lg:col-span-2 bg-white border border-[#e8ded0] rounded-xl p-6 shadow-xs flex flex-col items-center">
                {/* Head Table */}
                <div className="bg-[#1a1511] text-[#dfc194] border border-[#bd9661] rounded-lg px-8 py-3 text-center mb-8 shadow-md">
                  <div className="text-[10px] tracking-widest uppercase font-bold">Bridal Party</div>
                  <div className="font-serif text-base font-bold text-white">HEAD TABLE (8 Seats)</div>
                  <div className="text-[11px] text-[#bd9661]">Sophie &amp; James, Maid of Honour &amp; Best Man</div>
                </div>

                {/* 6 Round Tables Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full justify-items-center">
                  {state.tables.filter(t => !t.isHead).map(tbl => {
                    const seated = state.guests.filter(g => g.tableId === tbl.id);
                    const isSelected = selectedTableId === tbl.id;
                    return (
                      <div
                        key={tbl.id}
                        onClick={() => setSelectedTableId(tbl.id)}
                        className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                          isSelected ? 'ring-4 ring-[#bd9661] bg-[#fffbf5]' : 'bg-white'
                        } border-2 border-[#bd9661] shadow-sm`}
                      >
                        <span className="font-serif font-bold text-sm text-[#15110e]">{tbl.name}</span>
                        <span className="text-[10px] text-[#8b7b6b]">{seated.length} / 8 Seated</span>

                        {/* Circular Seat Dots */}
                        {Array.from({ length: 8 }).map((_, idx) => {
                          const angle = (idx * (360 / 8) - 90) * (Math.PI / 180);
                          const radius = 58;
                          const x = Math.round(radius * Math.cos(angle));
                          const y = Math.round(radius * Math.sin(angle));
                          const occupant = seated[idx];

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (occupant) handleUnassignGuest(occupant.id);
                              }}
                              style={{ transform: `translate(${x}px, ${y}px)` }}
                              title={occupant ? `${occupant.name} (Click to remove)` : 'Empty Seat'}
                              className={`absolute w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
                                occupant
                                  ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661] hover:bg-red-800 hover:text-white'
                                  : 'bg-white text-[#bda27f] border border-dashed border-[#c7aa80]'
                              }`}
                            >
                              {occupant ? occupant.initials || occupant.name.slice(0, 2).toUpperCase() : '+'}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel: Selected Table Guests & Unassigned List */}
              <div className="space-y-4">
                {/* Selected Table Manifest */}
                <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">
                    Selected Table Details
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#15110e]">
                    {state.tables.find(t => t.id === selectedTableId)?.name} Manifest
                  </h4>
                  <div className="divide-y divide-[#f2ede7] mt-3">
                    {state.guests.filter(g => g.tableId === selectedTableId).map(g => (
                      <div key={g.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#15110e]">{g.name}</strong>
                          {g.dietary && g.dietary !== 'None' && (
                            <span className="block text-[10px] text-[#a8382c]">Diet: {g.dietary}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnassignGuest(g.id)}
                          className="text-[#a8382c] hover:underline text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {state.guests.filter(g => g.tableId === selectedTableId).length === 0 && (
                      <div className="py-4 text-center text-xs text-[#8b7b6b] italic">
                        No guests seated at this table yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Unassigned Guests Pool */}
                <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                      Unassigned Guests ({unassignedGuests.length})
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1.5 no-scrollbar">
                    {unassignedGuests.map(g => (
                      <div
                        key={g.id}
                        className="p-2 rounded border border-[#e8ded0] bg-[#fbf9f6] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-[#15110e]">{g.name}</span>
                          <span className="text-[10px] text-[#8b7b6b] block">{g.household}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAssignGuestToTable(g.id, selectedTableId)}
                          className="bg-[#15110e] hover:bg-[#bd9661] hover:text-[#15110e] text-white text-[10px] font-bold px-2 py-1 rounded transition-colors"
                        >
                          Seat here &rarr;
                        </button>
                      </div>
                    ))}
                    {unassignedGuests.length === 0 && (
                      <div className="p-3 text-center text-xs text-[#3c6a42] font-semibold">
                        ✓ All confirmed guests have been seated!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: GIFT & GO WISHING WELL                                  */}
        {/* ============================================================== */}
        {activeTab === 'gifts' && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                Gift &amp; Go™ Wishing Well &amp; Thank-You Manager
              </h2>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                Manage heartfelt wedding contributions and track handwritten thank-you note progress.
              </p>
            </div>

            {/* Gift Stat Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Total Received</span>
                <div className="font-serif text-3xl font-bold text-[#bd9661] mt-1">{formatAUD(totalGifts)}</div>
                <div className="text-[11px] text-[#3c6a42] font-semibold mt-1">12 loving contributions</div>
              </div>
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Thank-You Sent</span>
                <div className="font-serif text-3xl font-bold text-[#3c6a42] mt-1">
                  {state.gifts.filter(g => g.thankYouStatus === 'Completed' || g.thankYouStatus === 'Sent').length}
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-1">Handwritten cards dispatched</div>
              </div>
              <div className="bg-white border border-[#e8ded0] p-4 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Pending Notes</span>
                <div className="font-serif text-3xl font-bold text-[#916c3d] mt-1">{thankYousDue}</div>
                <div className="text-[11px] text-[#916c3d] font-semibold mt-1">Ready for drafting</div>
              </div>
            </div>

            {/* Gifts Table */}
            <div className="bg-white border border-[#e8ded0] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5f2eb] text-[#8b7b6b] uppercase text-[10px] font-bold tracking-wider border-b border-[#e8ded0]">
                    <tr>
                      <th className="py-3 px-4">From</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Blessing Message</th>
                      <th className="py-3 px-4">Thank-You Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ede7]">
                    {state.gifts.map(g => (
                      <tr key={g.id} className="hover:bg-[#fdfbf7] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#15110e]">{g.guestName}</td>
                        <td className="py-3 px-4 font-bold text-[#bd9661]">{formatAUD(g.amount)}</td>
                        <td className="py-3 px-4 text-[#4a3e35] max-w-xs">{g.message}</td>
                        <td className="py-3 px-4">
                          <select
                            value={g.thankYouStatus || 'Not Started'}
                            onChange={(e) => handleUpdateThankYouStatus(g.id, e.target.value)}
                            className="bg-white border border-[#d5c7b5] rounded px-2 py-1 text-xs font-semibold text-[#15110e] outline-none"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="Drafted">Drafted</option>
                            <option value="Sent">Sent</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: VENUE & TRAVEL                                          */}
        {/* ============================================================== */}
        {activeTab === 'venue' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                Fernwood Estate &amp; Travel Logistics
              </h2>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                Directions, parking arrangements, and local Southern Highlands accommodation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8ded0] border-t-4 border-t-[#bd9661] p-5 rounded-xl shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Venue Address &amp; Parking
                </span>
                <h4 className="font-serif text-xl font-bold text-[#15110e]">{wedding.venue}</h4>
                <p className="text-xs text-[#4a3e35] leading-relaxed">{wedding.venueAddress}</p>
                <div className="p-3 bg-[#fbf9f6] border border-[#e8ded0] rounded-lg text-xs text-[#6b5847] leading-relaxed">
                  <strong>Parking Guide:</strong> {wedding.parking}
                </div>
                <a
                  href="https://maps.google.com/?q=Fernwood+Estate+Mittagong+NSW"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bd9661] hover:underline"
                >
                  📍 Open in Google Maps &rarr;
                </a>
              </div>

              <div className="bg-[#17120f] text-white p-5 rounded-xl border border-[#382c20] shadow-md flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#bd9661] mb-1">
                    Guest Transportation &amp; Curfew
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white mb-2">
                    Southern Highlands Shuttle
                  </h4>
                  <p className="text-xs text-[#c9bbae] leading-relaxed mb-4">
                    Chartered guest buses depart Bowral Railway Station at 1:15 PM and Mittagong Town Hall at 1:25 PM. Return shuttles run every 30 minutes from 10:00 PM until 11:30 PM.
                  </p>
                </div>
                <div className="bg-[#241c16] p-3 rounded border border-[#3d2f23] text-xs text-[#dfc194]">
                  💡 <strong>Tip for Guests:</strong> Uber and rideshare availability is limited in the Southern Highlands after 10:00 PM; please make use of our pre-arranged coach transfers!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: WEDDING VAULT & ANNIVERSARY                             */}
        {/* ============================================================== */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#15110e]">
                Wedding Vault &amp; 1st Anniversary Celebration
              </h2>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                5 GB secure archival storage for vows, photos, speech audio, and anniversary greetings.
              </p>
            </div>

            <div className="bg-white border border-[#e8ded0] p-5 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f2ede7] pb-3">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#15110e]">Vault Storage Allocation</h4>
                  <p className="text-xs text-[#8b7b6b]">2.35 GB used of 5.0 GB total (Included for 1 Year Post-Wedding)</p>
                </div>
                <span className="bg-[#e8eee4] text-[#3c6a42] text-xs font-bold px-2.5 py-1 rounded border border-[#d1dfcb]">
                  Archived &amp; Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#fbf9f6] p-3 rounded border border-[#e8ded0]">
                  <strong className="text-[#15110e] block">📸 High-Res Media</strong>
                  <span className="text-[#8b7b6b]">1.42 GB · 284 Photos</span>
                </div>
                <div className="bg-[#fbf9f6] p-3 rounded border border-[#e8ded0]">
                  <strong className="text-[#15110e] block">🎵 Speech Audio &amp; Vows</strong>
                  <span className="text-[#8b7b6b]">450 MB · 18 Audio Clips</span>
                </div>
                <div className="bg-[#fbf9f6] p-3 rounded border border-[#e8ded0]">
                  <strong className="text-[#15110e] block">💌 Guest Love Notes</strong>
                  <span className="text-[#8b7b6b]">160 MB · 32 Messages</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Joey Chatbot */}
      <JoeyChatbot />
    </div>
  );
}
