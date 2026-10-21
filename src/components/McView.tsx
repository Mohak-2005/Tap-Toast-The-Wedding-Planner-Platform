import React, { useState } from 'react';
import { useAppState, useSession, showToast, logAudit } from '../lib/state';
import { PrivateRunSheetItem, Client, Invoice, Wedding, Guest } from '../lib/types';
import McReferralsSection from './McReferralsSection';

interface McViewProps {
  onSelectView?: (view: string) => void;
}

export default function McView({ onSelectView }: McViewProps) {
  const { state, setState } = useAppState();
  const { session, setSession, clearSession } = useSession();

  // Navigation state
  const [activeTab, setActiveTab] = useState<'weddings' | 'calendar' | 'clients' | 'invoicing' | 'team' | 'referrals' | 'settings'>('weddings');
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const [detailSubTab, setDetailSubTab] = useState<'runsheet' | 'seating' | 'guests' | 'venue'>('runsheet');

  // Calendar State
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(10); // 0-indexed: 10 is November

  // Client Drawer State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Run Sheet States
  const [runSheetFilter, setRunSheetFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [runSheetSearch, setRunSheetSearch] = useState('');
  const [showAddCueModal, setShowAddCueModal] = useState(false);
  const [cueTime, setCueTime] = useState('17:00');
  const [cueActivity, setCueActivity] = useState('');
  const [cueNotes, setCueNotes] = useState('');
  const [cuePrivateNotes, setCuePrivateNotes] = useState('');

  // Seating States
  const [seatingViewMode, setSeatingViewMode] = useState<'floor' | 'list'>('floor');
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [seatModalTarget, setSeatModalTarget] = useState<{ tableId: string; seatIndex: number } | null>(null);

  // New Wedding Modal State
  const [showNewWeddingModal, setShowNewWeddingModal] = useState(false);
  const [nwP1, setNwP1] = useState('');
  const [nwP2, setNwP2] = useState('');
  const [nwDate, setNwDate] = useState('2027-09-18');
  const [nwGuests, setNwGuests] = useState(110);
  const [nwVenue, setNwVenue] = useState('');

  // New Invoice Modal State
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [niCouple, setNiCouple] = useState('Sophie & James');
  const [niAmount, setNiAmount] = useState(1850);
  const [niStatus, setNiStatus] = useState<'Pending' | 'Paid' | 'Draft'>('Pending');

  // Profile Settings State
  const [mcName, setMcName] = useState('Robert Galati');
  const [mcBiz, setMcBiz] = useState('Robert Galati MC Services');
  const [mcEmail, setMcEmail] = useState('robert@galatimc.com.au');
  const [mcPhone, setMcPhone] = useState('0418 223 901');
  const [mcRate, setMcRate] = useState(1850);
  const [mcTagline, setMcTagline] = useState('Premier Luxury Wedding Host & Stage Director');
  const [mcInstagram, setMcInstagram] = useState('@robertgalati.mc');
  const [mcBio, setMcBio] = useState(
    'High-energy, warm, and sophisticated Master of Ceremonies with over 12 years of experience hosting premier luxury weddings across Sydney, Southern Highlands, and Hunter Valley.'
  );

  // Stage & Prompter Preferences
  const [prompterFontSize, setPrompterFontSize] = useState<'Medium' | 'Large' | 'Extra Large'>('Large');
  const [stageClockFormat, setStageClockFormat] = useState<'12h' | '24h'>('12h');
  const [overrunAlert, setOverrunAlert] = useState(true);
  const [cueBufferMargin, setCueBufferMargin] = useState(5);
  const [shareNotesWithCouple, setShareNotesWithCouple] = useState(false);
  const [autoSmsToSpeakers, setAutoSmsToSpeakers] = useState(true);
  const [djPlaylistSync, setDjPlaylistSync] = useState('https://open.spotify.com/playlist/37i9dQZF1DX4UtSsGT1Sbe');
  const [cueChimeSound, setCueChimeSound] = useState('Soft Bell');

  const activeWedding = state.weddings.find(w => w.id === selectedWeddingId) || state.weddings[0];
  const runSheet = activeWedding.privateRunSheet || [];

  const handleLogout = () => {
    clearSession();
    showToast('Signed out of MC Pro account', 'info');
    if (onSelectView) onSelectView('login');
  };

  // Run Sheet handlers
  const updateWeddingRunSheet = (newCues: PrivateRunSheetItem[]) => {
    const updatedWeddings = state.weddings.map(w => {
      if (w.id === activeWedding.id) {
        return { ...w, privateRunSheet: newCues };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleToggleDone = (cueId: string) => {
    const updated = runSheet.map(c => (c.id === cueId ? { ...c, done: !c.done } : c));
    updateWeddingRunSheet(updated);
  };

  const handleUpdateCueField = (cueId: string, field: keyof PrivateRunSheetItem, value: any) => {
    const updated = runSheet.map(c => (c.id === cueId ? { ...c, [field]: value } : c));
    updateWeddingRunSheet(updated);
  };

  const handleMoveCue = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= runSheet.length) return;
    const newItems = [...runSheet];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateWeddingRunSheet(newItems);
  };

  const handleDeleteCue = (cueId: string) => {
    const updated = runSheet.filter(c => c.id !== cueId);
    updateWeddingRunSheet(updated);
    showToast('Cue removed from run sheet', 'info');
  };

  const handleAddCue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cueTime || !cueActivity) return;
    const newItem: PrivateRunSheetItem = {
      id: 'pmc_' + Date.now(),
      time: cueTime,
      activity: cueActivity,
      notes: cueNotes,
      privateNotes: cuePrivateNotes,
      done: false,
      order: runSheet.length + 1,
    };
    updateWeddingRunSheet([...runSheet, newItem]);
    logAudit(state, setState, 'MC Cue Added', 'Robert Galati', 'mc', `Added schedule entry: ${newItem.activity} at ${newItem.time}`, 'Run Sheet');
    setCueTime('17:00');
    setCueActivity('');
    setCueNotes('');
    setCuePrivateNotes('');
    setShowAddCueModal(false);
    showToast(`Added "${newItem.activity}" to schedule`, 'success');
  };

  // Seating handlers
  const handleSeatClick = (tableId: string, seatIndex: number) => {
    const current = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
    if (current) {
      if (window.confirm(`Remove ${current.name} from this seat?`)) {
        const updatedGuests = state.guests.map(g => (g.id === current.id ? { ...g, tableId: null, seatIndex: null } : g));
        setState({ ...state, guests: updatedGuests });
        logAudit(state, setState, 'MC Seating Updated', 'Robert Galati', 'mc', `Unseated ${current.name}`, 'Seating');
        showToast(`Removed ${current.name} from seat`, 'info');
      }
    } else {
      setSeatModalTarget({ tableId, seatIndex });
    }
  };

  const assignGuestToTableAndSeat = (guestId: string, tableId: string, seatIndex: number) => {
    const updatedGuests = state.guests.map(g => (g.id === guestId ? { ...g, tableId, seatIndex } : g));
    setState({ ...state, guests: updatedGuests });
    logAudit(state, setState, 'MC Seating Updated', 'Robert Galati', 'mc', `Assigned guest to table ${tableId}`, 'Seating');
    showToast('Guest seated successfully!', 'success');
  };

  const handleAutoAssign = (guestId: string) => {
    for (const tbl of state.tables) {
      const seated = state.guests.filter(g => g.tableId === tbl.id);
      if (seated.length < tbl.capacity) {
        for (let s = 0; s < tbl.capacity; s++) {
          if (!seated.some(x => x.seatIndex === s)) {
            assignGuestToTableAndSeat(guestId, tbl.id, s);
            return;
          }
        }
      }
    }
    showToast('All tables are at maximum capacity', 'error');
  };

  // Calendar Helpers
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const changeCalendarMonth = (delta: number) => {
    let newM = calMonth + delta;
    let newY = calYear;
    if (newM < 0) {
      newM = 11;
      newY--;
    } else if (newM > 11) {
      newM = 0;
      newY++;
    }
    setCalMonth(newM);
    setCalYear(newY);
  };

  // Invoice Handlers
  const handleMarkInvoicePaid = (invId: string) => {
    const invoices = (state.invoices || []).map(i => (i.id === invId ? { ...i, status: 'Paid' as const } : i));
    setState({ ...state, invoices });
    logAudit(state, setState, 'Invoice Paid', 'Robert Galati', 'mc', `Marked invoice ${invId} as Paid`, 'General');
    showToast(`Invoice ${invId} marked as Paid!`, 'success');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: 'INV-' + (1080 + (state.invoices?.length || 0) + 1),
      couple: niCouple,
      date: 'Today',
      venue: niCouple.includes('Sophie') ? 'Fernwood Estate' : 'Dunbar House',
      amount: Number(niAmount),
      status: niStatus,
    };
    const invoices = [newInv, ...(state.invoices || [])];
    setState({ ...state, invoices });
    logAudit(state, setState, 'Invoice Generated', 'Robert Galati', 'mc', `Created invoice ${newInv.id} for ${niCouple}`, 'General');
    setShowNewInvoiceModal(false);
    showToast(`Generated invoice ${newInv.id}!`, 'success');
  };

  // New Wedding Handler
  const handleCreateWedding = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(nwDate);
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDisplay = `${d.getDate()} ${mNames[d.getMonth()]} ${d.getFullYear()}`;

    const newW: Wedding = {
      id: 'w_' + Date.now(),
      couple: `${nwP1} & ${nwP2}`,
      partner1: nwP1,
      partner2: nwP2,
      date: nwDate + 'T15:00:00',
      dateDisplay,
      timeDisplay: '3:00 PM',
      venue: nwVenue,
      venueAddress: nwVenue,
      parking: 'Complimentary on-site guest parking available.',
      dressCode: 'Formal Elegance',
      registry: 'Gift & Go wishing well',
      invited: Number(nwGuests),
      confirmed: 0,
      status: 'Planning',
      tasks: [],
      runSheet: [
        { id: 'rs_' + Date.now() + '_1', time: '14:30', note: 'MC Arrival & sound check', done: false },
        { id: 'rs_' + Date.now() + '_2', time: '15:00', note: 'Ceremony processional', done: false },
      ],
      privateRunSheet: [
        { id: 'pmc_' + Date.now() + '_1', time: '14:30', activity: 'MC Arrival & Audio Check', notes: 'Sound check with technicians.', privateNotes: 'Check cordless mics.', done: false, order: 1 },
      ],
    };

    setState({ ...state, weddings: [...state.weddings, newW] });
    logAudit(state, setState, 'New Wedding Created', 'Robert Galati', 'mc', `Created booking for ${newW.couple} at ${nwVenue}`, 'General');
    setShowNewWeddingModal(false);
    setNwP1('');
    setNwP2('');
    setNwVenue('');
    showToast(`Created booking for ${newW.couple}!`, 'success');
  };

  // Settings Save Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    logAudit(state, setState, 'MC Profile Updated', 'Robert Galati', 'mc', 'Updated professional rates and bio', 'General');
    showToast('MC profile settings updated successfully!', 'success');
  };

  // Run Sheet filtering
  const filteredCues = runSheet.filter(cue => {
    const matchSearch =
      cue.activity.toLowerCase().includes(runSheetSearch.toLowerCase()) ||
      (cue.notes && cue.notes.toLowerCase().includes(runSheetSearch.toLowerCase())) ||
      (cue.privateNotes && cue.privateNotes.toLowerCase().includes(runSheetSearch.toLowerCase())) ||
      cue.time.toLowerCase().includes(runSheetSearch.toLowerCase());
    const matchStatus = runSheetFilter === 'all' || (runSheetFilter === 'done' ? cue.done : !cue.done);
    return matchSearch && matchStatus;
  });

  // Confirmed & Unassigned guests for seating
  const confirmedGuests = state.guests.filter(g => g.rsvpStatus === 'confirmed');
  const unassignedGuests = confirmedGuests.filter(
    g => !g.tableId && g.name.toLowerCase().includes(unassignedSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* Super Admin Impersonation Banner */}
      {session?.impersonating && (
        <div className="w-full bg-[#bd9661] text-[#15110e] px-4 py-1.5 text-xs font-bold flex items-center justify-between border-b border-[#a8824f]">
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
            className="bg-[#15110e] text-white px-2 py-0.5 rounded text-xs hover:bg-[#231c17] cursor-pointer"
          >
            Exit Impersonation &rarr;
          </button>
        </div>
      )}

      {/* Sidebar Navigation matching Screenshots 35-39 */}
      <aside className="w-full md:w-[240px] bg-[#15110e] text-[#d9c9b8] flex flex-col justify-between border-r border-[#29211a] flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 pb-3 flex items-center gap-2.5">
            <span className="tt-mark inline-grid place-items-center w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-sm rounded-[3px]">
              T
            </span>
            <span className="font-serif text-[18px] text-white font-semibold tracking-wide">
              Tap <span className="gold-amp">&amp;</span> Toast
            </span>
          </div>
          <div className="text-[9.5px] tracking-[2px] uppercase text-[#bd9661] font-bold px-5 pb-3">
            PRO ACCOUNT
          </div>

          {/* Navigation Links */}
          <nav className="p-2 flex flex-col gap-1">
            {[
              {
                id: 'weddings',
                label: 'All Weddings',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="12" r="6" />
                    <circle cx="15" cy="12" r="6" />
                  </svg>
                ),
              },
              {
                id: 'calendar',
                label: 'Calendar',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                id: 'clients',
                label: 'Clients',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                id: 'invoicing',
                label: 'Invoicing',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                ),
              },
              {
                id: 'team',
                label: 'Team',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
              },
              {
                id: 'referrals',
                label: 'Referrals & Discounts',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
              },
            ].map(item => {
              const isActive = activeTab === item.id && !selectedWeddingId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSelectedWeddingId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-[13.5px] transition-all border-l-[3px] cursor-pointer ${
                    isActive
                      ? 'bg-[#2b221a] text-[#fce4ca] font-bold border-l-[#bd9661]'
                      : 'text-[#bfaea0] hover:text-white hover:bg-[#251e18] border-l-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-[#bd9661]' : 'text-[#bfaea0]'}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {(item as any).badge && (
                    <span className="text-[9px] font-bold bg-[#bd9661] text-[#15110e] px-1.5 py-0.5 rounded-full">
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#231b14] text-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1">Signed in as</div>
          <div className="font-semibold text-white">Robert Galati</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3">Master of Ceremonies</div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-1.5 px-3 border border-[#3d3126] text-[#d9c9b8] hover:text-white hover:bg-[#231c16] rounded text-xs transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-9 overflow-y-auto max-w-[1400px]">
        {/* ==================================================================== */}
        {/* TAB 1: ALL WEDDINGS & WEDDING DETAIL                                  */}
        {/* ==================================================================== */}
        {activeTab === 'weddings' && !selectedWeddingId && (
          <section className="space-y-7">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  PRO ACCOUNT
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e] leading-tight">
                  Your Weddings
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setShowNewWeddingModal(true)}
                className="btn btn-primary"
              >
                + New Wedding
              </button>
            </div>

            {/* 4 Metric Cards matching Screenshot 6 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">7</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Active weddings</div>
              </div>
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">3</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">This month</div>
              </div>
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">642</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Guests managed</div>
              </div>
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-[6px] p-5 shadow-sm">
                <div className="text-3xl font-serif font-bold text-[#15110e]">89%</div>
                <div className="text-xs text-[#8b7b6b] font-medium mt-0.5">Avg. RSVP rate</div>
              </div>
            </div>

            {/* Weddings Table matching Screenshot 6 */}
            <div className="bg-white border border-[#e8ded0] rounded-[6px] shadow-sm overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Couple</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>RSVP Progress</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.weddings.map((w, idx) => {
                    const initials = w.couple.split('&').map(p => p.trim()[0]).join('&');
                    const confirmedCount = w.id === 'w1' ? confirmedGuests.length : (w.confirmed || 0);
                    const percent = Math.min(100, Math.round((confirmedCount / (w.invited || 100)) * 100));
                    const statusClass = idx === 0 ? 'finalising' : idx === 2 ? 'on-track' : 'planning';
                    const statusLabel = idx === 0 ? 'Finalising' : idx === 2 ? 'On Track' : 'Planning';

                    return (
                      <tr
                        key={w.id}
                        className="cursor-pointer hover:bg-[#faf7f2] transition-colors"
                        onClick={() => setSelectedWeddingId(w.id)}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                            <div>
                              <strong className="text-sm font-serif text-[#15110e]">{w.couple}</strong>
                              <div className="text-[11px] text-[#8b7b6b]">{w.venue.split(',')[0]}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-xs text-[#15110e] font-medium">{w.dateDisplay || w.date}</td>
                        <td className="text-xs font-semibold">{w.invited} invited</td>
                        <td className="w-48">
                          <div className="space-y-1">
                            <div className="w-full bg-[#f0ede4] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#bd9661] h-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-[#8b7b6b]">
                              {confirmedCount} confirmed &bull; {percent}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`tt-pill ${statusClass}`}>{statusLabel}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWeddingId(w.id);
                            }}
                            className="btn btn-outline btn-xs"
                          >
                            📋 Run Sheet &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* WEDDING DETAIL VIEW (inside MC Hub) */}
        {selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedWeddingId(null)}
                  className="btn btn-outline btn-sm mb-2"
                >
                  &larr; Back to All Weddings
                </button>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold">
                  WEDDING DETAIL
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  {activeWedding.couple}
                </h1>
                <div className="text-xs text-[#8b7b6b] mt-1">
                  Saturday, {activeWedding.dateDisplay || activeWedding.date} &bull; {activeWedding.venue}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-gold btn-sm"
                >
                  🖨️ Print Run Sheet
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Private MC schedule saved successfully!', 'success')}
                  className="btn btn-outline btn-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex gap-2 border-b border-[#e8ded0] pb-2">
              {[
                { id: 'runsheet', label: '🔒 Private Run Sheet' },
                { id: 'seating', label: 'Seating Floor Plan' },
                { id: 'guests', label: 'Guest & Catering Summary' },
                { id: 'venue', label: 'Venue & Travel' },
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setDetailSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                    detailSubTab === sub.id
                      ? 'bg-[#bd9661] text-[#15110e]'
                      : 'bg-white text-[#8b7b6b] border border-[#d5c7b5]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-pane 1: Run Sheet (Private MC Run Sheet) */}
            {detailSubTab === 'runsheet' && (
              <div className="space-y-4">
                {/* Compliance Notice */}
                <div className="bg-[#fcfaf6] border border-[#e8ded0] border-l-4 border-l-[#bd9661] p-3 rounded text-xs text-[#5a4a3a]">
                  <strong>🔒 Private MC Run Sheet:</strong> Private MC schedule with editable, reorderable (▲/▼) and deletable entries containing time, activity, public notes and private cues. Restricted to authorised users; no AI scheduling.
                </div>

                <div className="bg-white border border-[#e8ded0] rounded-[6px] p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#15110e]">
                        Private MC Run Sheet &amp; Cue Schedule
                      </h2>
                      <div className="text-xs text-[#8b7b6b]">
                        {runSheet.length} Schedule Entries &bull; {activeWedding.couple} Wedding
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search schedule..."
                        value={runSheetSearch}
                        onChange={(e) => setRunSheetSearch(e.target.value)}
                        className="text-input max-w-[160px] text-xs py-1.5"
                      />
                      {['all', 'pending', 'done'].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setRunSheetFilter(st as any)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold capitalize border ${
                            runSheetFilter === st ? 'bg-[#15110e] text-[#dfc194] border-[#15110e]' : 'bg-white text-[#8b7b6b] border-[#d5c7b5]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowAddCueModal(true)}
                        className="btn btn-gold btn-sm"
                      >
                        + Add Cue Entry
                      </button>
                    </div>
                  </div>

                  {/* Cue Items List */}
                  <div className="space-y-3">
                    {filteredCues.map((cue, idx) => (
                      <div
                        key={cue.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          cue.done ? 'bg-emerald-50/20 border-emerald-200 opacity-75' : 'bg-[#fdfbf7] border-[#e8ded0]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={cue.done}
                            onChange={() => handleToggleDone(cue.id)}
                            className="mt-2 w-4 h-4 rounded text-[#bd9661] cursor-pointer"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-bold text-[#8b7b6b] uppercase">
                                #{idx + 1}
                              </span>
                              <input
                                type="text"
                                value={cue.time}
                                onChange={(e) => handleUpdateCueField(cue.id, 'time', e.target.value)}
                                className="w-24 text-xs font-bold bg-[#faf6f0] border border-[#d4c5b3] rounded px-2 py-1"
                              />
                              <input
                                type="text"
                                value={cue.activity}
                                onChange={(e) => handleUpdateCueField(cue.id, 'activity', e.target.value)}
                                className={`flex-1 text-sm font-bold bg-white border border-[#d4c5b3] rounded px-2 py-1 text-[#15110e] ${
                                  cue.done ? 'line-through text-[#8b7b6b]' : ''
                                }`}
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveCue(idx, -1)}
                                  disabled={idx === 0}
                                  className="btn btn-outline btn-xs px-1.5 py-0.5 disabled:opacity-30"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveCue(idx, 1)}
                                  disabled={idx === runSheet.length - 1}
                                  className="btn btn-outline btn-xs px-1.5 py-0.5 disabled:opacity-30"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCue(cue.id)}
                                  className="btn btn-outline btn-xs px-1.5 py-0.5 text-red-600 border-red-200"
                                  title="Delete Cue"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">
                                Public Schedule Notes
                              </label>
                              <input
                                type="text"
                                value={cue.notes || ''}
                                onChange={(e) => handleUpdateCueField(cue.id, 'notes', e.target.value)}
                                className="w-full text-xs bg-white border border-[#d4c5b3] rounded px-2 py-1"
                                placeholder="Public notes or announcements..."
                              />
                            </div>

                            <div className="bg-[#fff8ee] border border-[#ebd4b8] rounded p-2">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">
                                MC Cue Notes
                              </span>
                              <input
                                type="text"
                                value={cue.privateNotes || ''}
                                onChange={(e) => handleUpdateCueField(cue.id, 'privateNotes', e.target.value)}
                                className="w-full text-xs bg-transparent border-0 border-b border-[#e3d4bf] text-[#453423] px-1 py-0.5 focus:outline-none focus:border-[#bd9661]"
                                placeholder="Private cues, technical sound directions..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-pane 2: Seating Floor Plan */}
            {detailSubTab === 'seating' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#15110e]">
                      Seating Floor Plan &bull; {activeWedding.couple}
                    </h2>
                    <div className="text-xs text-[#8b7b6b]">
                      6 Circular Tables + Head Table (8 Seats)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSeatingViewMode('floor')}
                      className={`btn btn-sm ${seatingViewMode === 'floor' ? 'btn-gold' : 'btn-outline'}`}
                    >
                      Floor Plan View
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeatingViewMode('list')}
                      className={`btn btn-sm ${seatingViewMode === 'list' ? 'btn-gold' : 'btn-outline'}`}
                    >
                      List View
                    </button>
                  </div>
                </div>

                {seatingViewMode === 'floor' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Floor Plan Canvas */}
                    <div className="lg:col-span-2 bg-[#faf7f2] border border-[#e8ded0] rounded-xl p-6 relative min-h-[500px]">
                      {/* Head Table */}
                      <div className="bg-[#15110e] text-[#dfc194] rounded-lg p-4 mb-8 text-center max-w-md mx-auto shadow-md border border-[#3d2e20]">
                        <div className="text-[11px] uppercase tracking-wider font-bold mb-3 text-[#bd9661]">
                          HEAD TABLE (8 SEATS)
                        </div>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {Array.from({ length: 8 }).map((_, seatIdx) => {
                            const seatedGuest = state.guests.find(
                              g => g.tableId === 'head' && g.seatIndex === seatIdx
                            );
                            return (
                              <button
                                key={seatIdx}
                                type="button"
                                onClick={() => handleSeatClick('head', seatIdx)}
                                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                                  seatedGuest
                                    ? 'bg-[#bd9661] text-[#15110e] border border-white'
                                    : 'bg-[#2a221b] text-[#8c7b6c] border border-dashed border-[#544333] hover:border-[#bd9661]'
                                }`}
                                title={seatedGuest ? seatedGuest.name : `Seat ${seatIdx + 1} (Empty)`}
                              >
                                {seatedGuest ? (seatedGuest.initials || seatedGuest.name.slice(0, 2).toUpperCase()) : '+'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 6 Circular Tables */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 place-items-center">
                        {state.tables
                          .filter(t => !t.isHead)
                          .map(table => {
                            const seated = state.guests.filter(g => g.tableId === table.id);
                            return (
                              <div
                                key={table.id}
                                className="relative w-36 h-36 rounded-full bg-white border-2 border-[#d5c7b5] flex flex-col items-center justify-center shadow-sm"
                              >
                                <span className="font-serif text-xs font-bold text-[#15110e]">
                                  {table.name}
                                </span>
                                <span className="text-[10px] text-[#8b7b6b] font-semibold">
                                  {seated.length}/{table.capacity}
                                </span>

                                {/* Radial Seat Dots */}
                                {Array.from({ length: table.capacity }).map((_, sIdx) => {
                                  const angle = (sIdx * (360 / table.capacity) - 90) * (Math.PI / 180);
                                  const radius = 56;
                                  const x = Math.round(58 + radius * Math.cos(angle));
                                  const y = Math.round(58 + radius * Math.sin(angle));
                                  const g = seated.find(x => x.seatIndex === sIdx);

                                  return (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => handleSeatClick(table.id, sIdx)}
                                      style={{ left: `${x}px`, top: `${y}px` }}
                                      className={`absolute w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer ${
                                        g
                                          ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                          : 'bg-white text-[#8b7b6b] border border-[#d5c7b5] hover:border-[#bd9661]'
                                      }`}
                                      title={g ? g.name : `Seat ${sIdx + 1} (Empty)`}
                                    >
                                      {g ? (g.initials || g.name.slice(0, 2).toUpperCase()) : '+'}
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Unassigned Guests Sidebar Panel */}
                    <div className="bg-white border border-[#e8ded0] rounded-xl p-5 flex flex-col h-[500px]">
                      <h3 className="font-serif text-sm font-bold text-[#15110e]">
                        Unassigned Guests
                      </h3>
                      <div className="text-xs text-[#8b7b6b] mb-3">
                        {unassignedGuests.length} guests still need a table
                      </div>
                      <input
                        type="text"
                        placeholder="Search guests..."
                        value={unassignedSearch}
                        onChange={(e) => setUnassignedSearch(e.target.value)}
                        className="text-input text-xs py-1.5 mb-3"
                      />
                      <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                        {unassignedGuests.map(g => (
                          <div
                            key={g.id}
                            className="p-3 bg-[#faf7f2] border border-[#e8ded0] rounded-lg text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#15110e] text-[#dfc194] text-[10px] font-bold flex items-center justify-center">
                                  {g.initials || g.name.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-bold text-[#15110e]">{g.name}</span>
                              </div>
                              {g.dietary && g.dietary !== 'None' && (
                                <span className="tt-pill warm text-[9px]">{g.dietary}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <select
                                onChange={(e) => {
                                  if (e.target.value) assignGuestToTableAndSeat(g.id, e.target.value, 0);
                                }}
                                className="text-input text-[11px] py-1 flex-1 bg-white"
                                defaultValue=""
                              >
                                <option value="" disabled>Seat at table...</option>
                                <option value="head">Head Table</option>
                                {state.tables.filter(t => !t.isHead).map(tbl => (
                                  <option key={tbl.id} value={tbl.id}>
                                    {tbl.name} ({state.guests.filter(x => x.tableId === tbl.id).length}/{tbl.capacity})
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => handleAutoAssign(g.id)}
                                className="btn btn-gold btn-xs px-2 py-1"
                              >
                                Seat
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View Mode */
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-6">
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">
                      Table Assignment Roster
                    </h3>
                    {['head', ...state.tables.filter(t => !t.isHead).map(t => t.id)].map(tblId => {
                      const tblObj = tblId === 'head' ? { name: 'Head Table', capacity: 8 } : state.tables.find(t => t.id === tblId);
                      const guestsAtTable = state.guests.filter(g => g.tableId === tblId);
                      return (
                        <div key={tblId} className="border-b border-[#e8ded0] pb-4 last:border-b-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-serif font-bold text-sm text-[#15110e]">
                              {tblObj?.name}
                            </span>
                            <span className="text-xs text-[#8b7b6b]">
                              {guestsAtTable.length} / {tblObj?.capacity} seats
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {guestsAtTable.map(g => (
                              <div
                                key={g.id}
                                className="p-2 bg-[#faf7f2] border border-[#e8ded0] rounded flex items-center justify-between text-xs"
                              >
                                <span className="font-semibold text-[#15110e]">{g.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleSeatClick(tblId, g.seatIndex || 0)}
                                  className="text-red-600 hover:text-red-800 text-[11px] font-bold cursor-pointer"
                                >
                                  Unseat
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Sub-pane 3: Catering & Dietaries */}
            {detailSubTab === 'guests' && (
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#15110e]">
                  Catering Breakdown &amp; Special Dietaries
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegetarian')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Vegetarian meals</div>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('gluten')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Gluten-Free meals</div>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('nut')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Nut Allergy meals</div>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-4">
                    <div className="text-2xl font-serif font-bold text-[#15110e]">
                      {confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegan')).length}
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Vegan meals</div>
                  </div>
                </div>
                <div className="text-xs text-[#8b7b6b] pt-2">
                  Total Headcount: {confirmedGuests.reduce((sum, g) => sum + (g.guestCount || 1), 0)} confirmed covers.
                </div>
              </div>
            )}

            {/* Sub-pane 4: Venue & Travel */}
            {detailSubTab === 'venue' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold">
                      COUPLE LOCATION &amp; LOGISTICS
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#15110e] mt-1">
                      Venue &amp; Travel Roster
                    </h2>
                    <div className="text-xs text-[#8b7b6b]">
                      Venue coordinates, guest parking facility details, shuttle timings and direct navigation for MC &amp; event vendors
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-sm flex items-center gap-1.5"
                  >
                    📍 Open Google Maps ↗
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Venue & Address */}
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fbf3e6] text-[#bd9661] flex items-center justify-center text-lg">
                        🏛
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Wedding Venue &amp; Address
                        </h3>
                        <span className="text-xs text-[#8b7b6b]">Ceremony &amp; Reception Grounds</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#15110e] leading-relaxed">
                      <strong>Fernwood Estate, Southern Highlands</strong><br />
                      124 Range Road, Mittagong NSW 2575<br />
                      Australia
                    </div>
                    <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-3 text-xs text-[#5a4a3c] space-y-1">
                      <div><strong>Ceremony:</strong> 2:00 PM &bull; The Lower Meadow Lawns</div>
                      <div><strong>Cocktail Hour &amp; Reception:</strong> 5:00 PM &bull; The Grand Pavilion</div>
                      <div><strong>Venue Concierge:</strong> (02) 4871 2000 &bull; concierge@fernwoodestate.demo</div>
                    </div>
                  </div>

                  {/* Card 2: Parking */}
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fbf3e6] text-[#bd9661] flex items-center justify-center text-lg">
                        🅿️
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Guest Parking Facilities
                        </h3>
                        <span className="text-xs text-[#8b7b6b]">On-Site Valet &amp; Dedicated Bays</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#15110e]">
                      Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.
                    </p>
                    <ul className="list-disc pl-5 text-xs text-[#5a4a3c] space-y-1">
                      <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
                      <li><strong>Valet attendants:</strong> Stationed at the porte-cochère from 1:15 PM.</li>
                      <li><strong>EV Charging:</strong> 4 Type-2 chargers available at North Parking.</li>
                      <li><strong>Overnight Parking:</strong> Permitted until 11:00 AM Sunday morning.</li>
                    </ul>
                  </div>

                  {/* Card 3: Shuttles */}
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fbf3e6] text-[#bd9661] flex items-center justify-center text-lg">
                        🚌
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#15110e]">
                          Transport &amp; Guest Shuttles
                        </h3>
                        <span className="text-xs text-[#8b7b6b]">Scheduled Private Charter Transfers</span>
                      </div>
                    </div>
                    <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-lg p-3 text-xs text-[#5a4a3c] space-y-1.5">
                      <div><strong>Guest Arrival Shuttles:</strong></div>
                      <div>&bull; 1:15 PM from Bowral Grand Hotel (Station St Entrance)</div>
                      <div>&bull; 1:30 PM from Milton Park Country House Resort</div>
                      <div className="pt-1"><strong>Evening Return Loops:</strong></div>
                      <div>&bull; Continuous departures every 45 mins from 10:15 PM until 12:30 AM</div>
                    </div>
                  </div>

                  {/* Card 4: Interactive Google Map */}
                  <div className="bg-[#15110e] border border-[#3d2e20] text-white rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#bd9661] font-bold">
                          LIVE NAVIGATION
                        </div>
                        <h3 className="font-serif text-base font-bold text-white">Interactive Google Map</h3>
                        <span className="text-[11px] text-[#bdaea0]">Coordinates: 34.4512° S, 150.5369° E</span>
                      </div>
                      <a
                        href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-xs"
                      >
                        Open Maps ↗
                      </a>
                    </div>

                    <a
                      href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative h-48 rounded-lg overflow-hidden border border-[#3d3023] bg-[#e5e3df] group cursor-pointer"
                    >
                      <iframe
                        src="https://maps.google.com/maps?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575&t=&z=14&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        className="border-0 block pointer-events-none"
                        loading="lazy"
                        title="Google Maps Location"
                      />
                      <div className="absolute top-2 left-2 bg-[#191410]/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#4a3a2a] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                          📍
                        </div>
                        <div>
                          <strong className="text-white text-xs block leading-tight">Fernwood Estate</strong>
                          <span className="text-[#dfc194] text-[10px] block">124 Range Road, Mittagong NSW</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: CALENDAR (Screenshot 35)                                      */}
        {/* ==================================================================== */}
        {activeTab === 'calendar' && !selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  MC SCHEDULE
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Wedding Calendar
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(-1)}
                  className="btn btn-outline btn-sm"
                >
                  &larr; Previous
                </button>
                <span className="font-serif text-base font-bold text-[#15110e] px-3">
                  {monthNames[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  onClick={() => changeCalendarMonth(1)}
                  className="btn btn-outline btn-sm"
                >
                  Next &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const firstDay = new Date(calYear, calMonth, 1).getDay();
                  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
                  const cells = [];

                  // Empty cells for offset
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(
                      <div key={`empty-${i}`} className="min-h-[90px] bg-[#faf8f5] opacity-40 rounded-lg border border-[#eee]" />
                    );
                  }

                  // Day cells
                  for (let d = 1; d <= totalDays; d++) {
                    const matchedWeddings = state.weddings.filter(w => {
                      const wd = new Date(w.date);
                      return wd.getFullYear() === calYear && wd.getMonth() === calMonth && wd.getDate() === d;
                    });

                    cells.push(
                      <div
                        key={`day-${d}`}
                        onClick={() => showToast(`MC Calendar selected: ${d} ${monthNames[calMonth]} ${calYear}`, 'info')}
                        className="min-h-[90px] bg-white border border-[#e8ded0] rounded-lg p-2 transition-all hover:border-[#bd9661] hover:bg-[#fdfbf8] cursor-pointer flex flex-col justify-between"
                      >
                        <div className="text-xs font-bold text-[#15110e]">{d}</div>
                        <div className="space-y-1">
                          {matchedWeddings.map(mw => (
                            <div
                              key={mw.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWeddingId(mw.id);
                              }}
                              className="bg-[#17120f] text-[#dfc194] px-2 py-1 rounded text-[10.5px] font-semibold truncate hover:bg-[#2b221a] cursor-pointer"
                              title={`${mw.couple} at ${mw.venue}`}
                            >
                              💍 {mw.couple.split('&')[0].trim()}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return cells;
                })()}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CLIENTS (Screenshot 36)                                       */}
        {/* ==================================================================== */}
        {activeTab === 'clients' && !selectedWeddingId && (
          <section className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                DIRECTORY
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Couple Clients
              </h1>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] shadow-sm overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Couple</th>
                    <th>Wedding Date</th>
                    <th>Venue</th>
                    <th>Package Tier</th>
                    <th>Deposit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(state.clients || []).map(client => (
                    <tr key={client.id} className="hover:bg-[#faf7f2] transition-colors">
                      <td><strong className="text-sm font-serif text-[#15110e]">{client.couple}</strong></td>
                      <td className="text-xs text-[#15110e]">{client.weddingDate}</td>
                      <td className="text-xs text-[#8b7b6b]">{client.venue}</td>
                      <td>
                        <span className="tt-pill warm text-xs">{client.tier}</span>
                      </td>
                      <td className="text-xs font-semibold text-[#15110e]">{client.deposit}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedClient(client)}
                          className="btn btn-outline btn-xs"
                        >
                          View Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: INVOICING (Screenshot 37)                                     */}
        {/* ==================================================================== */}
        {activeTab === 'invoicing' && !selectedWeddingId && (
          <section className="space-y-6">
            {/* Ambassador Referral Payout Banner */}
            <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="text-xs font-bold text-[#15110e] flex items-center gap-2">
                    <span>Ambassador Referral Earnings:</span>
                    <span className="text-emerald-700 font-bold">$1,800 AUD</span>
                    <span className="bg-[#241a13] text-[#dfc194] px-2 py-0.5 rounded text-[10px] font-mono">ROBERT-VIP-15</span>
                  </div>
                  <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                    12 couples confirmed using your 15% discount code &bull; $600 AUD currently available for payout.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('referrals')}
                className="bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Open Referral Hub &rarr;
              </button>
            </div>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  FINANCIALS
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Invoicing
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(true)}
                className="btn btn-gold btn-sm"
              >
                + New Invoice
              </button>
            </div>

            <div className="bg-white border border-[#e8ded0] rounded-[6px] shadow-sm overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Couple Client</th>
                    <th>Issue Date</th>
                    <th>Venue</th>
                    <th>Amount (AUD)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(state.invoices || []).map(inv => (
                    <tr key={inv.id} className="hover:bg-[#faf7f2] transition-colors">
                      <td><strong className="text-xs font-mono text-[#15110e]">{inv.id}</strong></td>
                      <td className="text-xs font-serif font-bold text-[#15110e]">{inv.couple}</td>
                      <td className="text-xs text-[#8b7b6b]">{inv.date}</td>
                      <td className="text-xs text-[#8b7b6b]">{inv.venue}</td>
                      <td><strong className="text-xs font-semibold text-[#15110e]">${inv.amount.toLocaleString()} AUD</strong></td>
                      <td>
                        <span className={`tt-pill ${inv.status === 'Paid' ? 'green' : inv.status === 'Pending' ? 'warm' : 'lavender'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td>
                        {inv.status !== 'Paid' ? (
                          <button
                            type="button"
                            onClick={() => handleMarkInvoicePaid(inv.id)}
                            className="btn btn-outline btn-xs"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-xs text-[#8b7b6b]">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: TEAM (Screenshot 38)                                          */}
        {/* ==================================================================== */}
        {activeTab === 'team' && !selectedWeddingId && (
          <section className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  STAFF &amp; CREW
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  MC Team &amp; Crew
                </h1>
              </div>
              <button
                type="button"
                onClick={() => showToast('Invitation dispatched to team collaborator via email', 'success')}
                className="btn btn-gold btn-sm"
              >
                + Invite Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(state.team || []).map(m => (
                <div
                  key={m.id}
                  className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-5 shadow-sm space-y-3"
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">{m.name}</h3>
                    <div className="text-xs text-[#bd9661] font-bold mt-0.5">{m.role}</div>
                  </div>
                  <div className="space-y-1 text-xs text-[#8b7b6b]">
                    <div>{m.email}</div>
                    <div>{m.phone}</div>
                  </div>
                  <div className="pt-2">
                    <span className="tt-pill green text-[10px]">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: SETTINGS (Screenshot 39)                                      */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* TAB: REFERRALS & DISCOUNTS                                           */}
        {/* ==================================================================== */}
        {activeTab === 'referrals' && !selectedWeddingId && (
          <McReferralsSection state={state} setState={setState} />
        )}

        {/* ==================================================================== */}
        {/* TAB 6: SETTINGS (Screenshot 39)                                      */}
        {/* ==================================================================== */}
        {activeTab === 'settings' && !selectedWeddingId && (
          <section className="space-y-6 max-w-4xl">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                PROFESSIONAL ACCOUNT &amp; STAGE STUDIO
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                MC Pro Account &amp; Stage Preferences
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Configure your public MC branding, live stage prompter display, DJ sound sync, and client collaboration preferences.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Section 1: Profile & Business Branding */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                  <span className="text-lg">🎙️</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">MC Identity &amp; Public Branding</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      MC Full Name
                    </label>
                    <input
                      type="text"
                      value={mcName}
                      onChange={(e) => setMcName(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Business / Stage Name
                    </label>
                    <input
                      type="text"
                      value={mcBiz}
                      onChange={(e) => setMcBiz(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Direct Phone
                    </label>
                    <input
                      type="text"
                      value={mcPhone}
                      onChange={(e) => setMcPhone(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Professional Email
                    </label>
                    <input
                      type="email"
                      value={mcEmail}
                      onChange={(e) => setMcEmail(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Base Rate (AUD / Wedding)
                    </label>
                    <input
                      type="number"
                      value={mcRate}
                      onChange={(e) => setMcRate(Number(e.target.value))}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Tagline / Specialty
                    </label>
                    <input
                      type="text"
                      value={mcTagline}
                      onChange={(e) => setMcTagline(e.target.value)}
                      className="text-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Instagram / Portfolio Handle
                    </label>
                    <input
                      type="text"
                      value={mcInstagram}
                      onChange={(e) => setMcInstagram(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Bio &amp; Style Introduction (Seen by Couples on Proposals)
                  </label>
                  <textarea
                    rows={3}
                    value={mcBio}
                    onChange={(e) => setMcBio(e.target.value)}
                    className="text-input resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Live Stage & Prompter Display */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                  <span className="text-lg">⏱️</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Live Stage &amp; Teleprompter Preferences</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Prompter Script Font Size
                    </label>
                    <select
                      value={prompterFontSize}
                      onChange={(e) => setPrompterFontSize(e.target.value as any)}
                      className="text-input"
                    >
                      <option value="Medium">Medium (16px)</option>
                      <option value="Large">Large (20px - Stage Recommended)</option>
                      <option value="Extra Large">Extra Large (24px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Stage Clock Format
                    </label>
                    <select
                      value={stageClockFormat}
                      onChange={(e) => setStageClockFormat(e.target.value as any)}
                      className="text-input"
                    >
                      <option value="12h">12-Hour (e.g. 7:15 PM)</option>
                      <option value="24h">24-Hour Military (e.g. 19:15)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Default Buffer Margin
                    </label>
                    <select
                      value={cueBufferMargin}
                      onChange={(e) => setCueBufferMargin(Number(e.target.value))}
                      className="text-input"
                    >
                      <option value={0}>0 minutes (Tight Timing)</option>
                      <option value={5}>5 minutes (Standard Buffer)</option>
                      <option value={10}>10 minutes (Relaxed Schedule)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between py-2 border-t border-[#f0ede4]">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Visual Overrun Warning Flasher</strong>
                      <span className="text-[11px] text-[#8b7b6b]">Flash a gentle amber screen border when a speaker or speech cue exceeds +3 minutes.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={overrunAlert}
                        onChange={(e) => setOverrunAlert(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Audio & DJ Tech Sync */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                  <span className="text-lg">🎧</span>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Audio &amp; DJ Master Sync</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Master DJ / Spotify Playlist URI
                    </label>
                    <input
                      type="text"
                      value={djPlaylistSync}
                      onChange={(e) => setDjPlaylistSync(e.target.value)}
                      className="text-input font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Entrance Chime Sound
                    </label>
                    <select
                      value={cueChimeSound}
                      onChange={(e) => setCueChimeSound(e.target.value)}
                      className="text-input"
                    >
                      <option value="Soft Bell">Soft Crystal Bell (Subtle)</option>
                      <option value="Chime Trio">Orchestral Chime Trio</option>
                      <option value="Gavel">Warm Wooden Gavel</option>
                      <option value="Fanfare">Brass Fanfare Accompany</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-[#f0ede4] pt-1">
                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Auto-SMS Speech Reminders to Speakers</strong>
                      <span className="text-[11px] text-[#8b7b6b]">Sends a polite SMS cue to the Best Man &amp; Maid of Honor 15 minutes before their scheduled toast.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={autoSmsToSpeakers}
                        onChange={(e) => setAutoSmsToSpeakers(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Share Private MC Run Sheet with Couple</strong>
                      <span className="text-[11px] text-[#8b7b6b]">Allow the couple to view private MC run sheet notes in read-only mode from their dashboard.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={shareNotesWithCouple}
                        onChange={(e) => setShareNotesWithCouple(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Subscription & Save Actions */}
              <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded">ACTIVE LICENSE</span>
                    <strong className="font-serif text-sm text-[#15110e]">MC Pro Annual Plan ($590 AUD/yr)</strong>
                  </div>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">Renews automatically on 12 December 2026 &bull; Unlimited weddings &amp; run sheets.</p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="submit"
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Save MC Preferences
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: ADD CUE MODAL                                               */}
      {/* ==================================================================== */}
      {showAddCueModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#d5c7b5] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#15110e]">
                Add Schedule Cue Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCueModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCue} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 17:00"
                    value={cueTime}
                    onChange={(e) => setCueTime(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Golden Hour Photos"
                    value={cueActivity}
                    onChange={(e) => setCueActivity(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Public Notes / Running Details
                </label>
                <input
                  type="text"
                  placeholder="Public schedule guidance..."
                  value={cueNotes}
                  onChange={(e) => setCueNotes(e.target.value)}
                  className="text-input"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">
                  MC Cue Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Private cues, technical sound directions..."
                  value={cuePrivateNotes}
                  onChange={(e) => setCuePrivateNotes(e.target.value)}
                  className="text-input resize-none bg-[#fcfaf5] border-[#d4b483]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCueModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm">
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SEAT GUEST MODAL                                            */}
      {/* ==================================================================== */}
      {seatModalTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#d5c7b5] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#15110e]">
                Assign Guest to Table
              </h3>
              <button
                type="button"
                onClick={() => setSeatModalTarget(null)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Target Table
                </label>
                <div className="p-2 bg-[#faf7f2] border border-[#e8ded0] rounded text-xs font-bold text-[#15110e]">
                  {seatModalTarget.tableId === 'head'
                    ? 'Head Table (Seat ' + (seatModalTarget.seatIndex + 1) + ')'
                    : (state.tables.find(t => t.id === seatModalTarget.tableId)?.name || 'Table') + ' (Seat ' + (seatModalTarget.seatIndex + 1) + ')'}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Choose Confirmed Guest
                </label>
                <select
                  id="sg-modal-guest-select"
                  className="text-input text-xs"
                  defaultValue=""
                >
                  <option value="" disabled>Select unassigned guest...</option>
                  {confirmedGuests.filter(g => !g.tableId).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} {g.dietary && g.dietary !== 'None' ? `(${g.dietary})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSeatModalTarget(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = (document.getElementById('sg-modal-guest-select') as HTMLSelectElement)?.value;
                    if (sel) {
                      assignGuestToTableAndSeat(sel, seatModalTarget.tableId, seatModalTarget.seatIndex);
                      setSeatModalTarget(null);
                    }
                  }}
                  className="btn btn-gold btn-sm"
                >
                  Confirm Seating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: NEW WEDDING WIZARD MODAL                                    */}
      {/* ==================================================================== */}
      {showNewWeddingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#d5c7b5] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#15110e]">
                New Wedding Booking
              </h3>
              <button
                type="button"
                onClick={() => setShowNewWeddingModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateWedding} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Partner 1
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={nwP1}
                    onChange={(e) => setNwP1(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Partner 2
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olivia"
                    value={nwP2}
                    onChange={(e) => setNwP2(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    required
                    value={nwDate}
                    onChange={(e) => setNwDate(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Estimated Guests
                  </label>
                  <input
                    type="number"
                    min={20}
                    value={nwGuests}
                    onChange={(e) => setNwGuests(Number(e.target.value))}
                    className="text-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Venue Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bendooley Estate, Berrima"
                  value={nwVenue}
                  onChange={(e) => setNwVenue(e.target.value)}
                  className="text-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewWeddingModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: NEW INVOICE MODAL                                           */}
      {/* ==================================================================== */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#d5c7b5] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#15110e]">
                Create Invoice
              </h3>
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Couple Client
                </label>
                <select
                  value={niCouple}
                  onChange={(e) => setNiCouple(e.target.value)}
                  className="text-input"
                >
                  <option value="Sophie & James">Sophie &amp; James (Fernwood Estate)</option>
                  <option value="Aisha & Marcus">Aisha &amp; Marcus (Doltone House)</option>
                  <option value="Emma & Tom">Emma &amp; Tom (Dunbar House)</option>
                  <option value="Katie & Rob">Katie &amp; Rob (Bendooley Estate)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Amount in AUD
                </label>
                <input
                  type="number"
                  required
                  value={niAmount}
                  onChange={(e) => setNiAmount(Number(e.target.value))}
                  className="text-input"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Status
                </label>
                <select
                  value={niStatus}
                  onChange={(e) => setNiStatus(e.target.value as any)}
                  className="text-input"
                >
                  <option value="Pending">Pending Payment</option>
                  <option value="Paid">Paid</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SLIDE DRAWER: CLIENT FILE CONTACT DRAWER                             */}
      {/* ==================================================================== */}
      {selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex justify-end"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-[#15110e] text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[2px] uppercase text-[#bd9661] font-bold">
                  CLIENT FILE
                </div>
                <h3 className="font-serif text-xl font-bold">{selectedClient.couple}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="text-white hover:text-[#bd9661] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Wedding Date</label>
                <div className="font-bold text-sm text-[#15110e]">{selectedClient.weddingDate}</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Venue Location</label>
                <div className="text-[#15110e]">{selectedClient.venue}</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Primary Contact Phone</label>
                <a href={`tel:${selectedClient.phone}`} className="text-[#bd9661] font-bold hover:underline">
                  {selectedClient.phone}
                </a>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Email</label>
                <a href={`mailto:${selectedClient.email}`} className="text-[#bd9661] font-bold hover:underline">
                  {selectedClient.email}
                </a>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">Contract &amp; Package Tier</label>
                <div className="text-[#15110e]">{selectedClient.tier} ({selectedClient.deposit})</div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-0.5">MC Operational Notes</label>
                <p className="bg-[#faf7f2] p-3 rounded-lg border border-[#e8ded0] text-[#5a4a3c] leading-relaxed">
                  {selectedClient.notes}
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => showToast(`Initiating mock call to ${selectedClient.couple} (${selectedClient.phone})`, 'info')}
                  className="btn btn-gold w-full py-2.5 font-bold"
                >
                  Call Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
