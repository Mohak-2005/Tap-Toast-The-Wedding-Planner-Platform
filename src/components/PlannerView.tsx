import React, { useState, useMemo } from 'react';
import { useAppState, useSession, getWeddingCountdown, showToast } from '../lib/state';
import SeatingPlannerSection from './SeatingPlannerSection';
import { InvitationTemplatesSection } from './InvitationTemplatesSection';

interface PlannerViewProps {
  onSelectView: (view: string) => void;
}

type PlannerTab = 'overview' | 'seating' | 'guest-list' | 'invitations' | 'venue' | 'settings';

export default function PlannerView({ onSelectView }: PlannerViewProps) {
  const { state } = useAppState();
  const { clearSession } = useSession();

  // Active Wedding Selection (Planner can switch among assigned weddings)
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>('w1');
  const [activeTab, setActiveTab] = useState<PlannerTab>('overview');
  const [guestSearch, setGuestSearch] = useState<string>('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'awaiting' | 'declined' | 'dietary'>('all');

  // Invitations State (Matching CoupleView)
  const [selectedQaRdHousehold, setSelectedQaRdHousehold] = useState<string>('all');
  const [selectedQaRdPalette, setSelectedQaRdPalette] = useState<'obsidian' | 'champagne' | 'merlot' | 'sage'>('obsidian');

  // Planner Profile & Settings (Matching MC Settings)
  const [plannerName, setPlannerName] = useState<string>('Anthony Rossi');
  const [plannerBiz, setPlannerBiz] = useState<string>('Rossi Event Management');
  const [plannerEmail, setPlannerEmail] = useState<string>('anthony@rossievents.demo');
  const [plannerPhone, setPlannerPhone] = useState<string>('0421 884 991');
  const [plannerRole, setPlannerRole] = useState<string>('Lead Wedding Coordinator & Event Director');
  const [plannerEmergencyPhone, setPlannerEmergencyPhone] = useState<string>('0419 772 311');
  const [plannerAgencyTagline, setPlannerAgencyTagline] = useState<string>('Luxury Estate & Destination Wedding Architecture');
  const [plannerBio, setPlannerBio] = useState<string>(
    'Over 12 years of luxury wedding coordination experience across Southern Highlands, Sydney, and Hunter Valley. Dedicated to meticulous day-of runsheet execution, vendor synergy, and bride & groom peace of mind.'
  );
  const [plannerNotes, setPlannerNotes] = useState<string>(
    'Coordinate with Bowral Florist for 1:30 PM arch setup. Head Table floral garland must not obstruct bride/groom sightlines.'
  );

  const activeWedding = useMemo(() => {
    return state.weddings.find((w) => w.id === selectedWeddingId) || state.weddings[0];
  }, [state.weddings, selectedWeddingId]);

  const weddingGuests = useMemo(() => {
    return (state.guests || []).filter((g) => (g.weddingId || 'w1') === activeWedding.id);
  }, [state.guests, activeWedding.id]);

  const weddingTables = useMemo(() => {
    return (state.tables || []).filter((t) => (t.weddingId || 'w1') === activeWedding.id);
  }, [state.tables, activeWedding.id]);

  const countdown = getWeddingCountdown(activeWedding.date);

  // Key metrics
  const totalGuests = weddingGuests.length;
  const confirmedGuests = weddingGuests.filter((g) => g.rsvpStatus === 'confirmed');
  const awaitingGuests = weddingGuests.filter((g) => g.rsvpStatus === 'awaiting');
  const declinedGuests = weddingGuests.filter((g) => g.rsvpStatus === 'declined');
  const dietaryGuests = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary.trim() !== '');
  const seatedGuests = weddingGuests.filter((g) => g.tableId);
  const totalCapacity = weddingTables.reduce((acc, t) => acc + t.capacity, 0);

  // Filtered guest list for Guest List tab
  const filteredGuests = useMemo(() => {
    return weddingGuests.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
        g.household.toLowerCase().includes(guestSearch.toLowerCase()) ||
        (g.dietary && g.dietary.toLowerCase().includes(guestSearch.toLowerCase()));
      if (!matchSearch) return false;

      if (guestFilter === 'confirmed') return g.rsvpStatus === 'confirmed';
      if (guestFilter === 'awaiting') return g.rsvpStatus === 'awaiting';
      if (guestFilter === 'declined') return g.rsvpStatus === 'declined';
      if (guestFilter === 'dietary') return g.dietary && g.dietary !== 'None' && g.dietary.trim() !== '';
      return true;
    });
  }, [weddingGuests, guestSearch, guestFilter]);

  const handleExportBrief = () => {
    showToast(`Generated comprehensive PDF briefing dossier for ${activeWedding.couple}`, 'success');
  };

  const handleLogout = () => {
    clearSession();
    showToast('Signed out of Wedding Planner Portal', 'info');
    onSelectView('login');
  };

  const navTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      id: 'seating',
      label: 'Seating Planner',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="12" cy="3" r="2" />
          <circle cx="12" cy="21" r="2" />
          <circle cx="3" cy="12" r="2" />
          <circle cx="21" cy="12" r="2" />
          <path d="M12 5v3.5M12 15.5v3.5M5 12h3.5M15.5 12h3.5" />
        </svg>
      ),
    },
    {
      id: 'guest-list',
      label: 'Guest List',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'invitations',
      label: 'Invitations & QaRd',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22 6 12 13 2 6" />
        </svg>
      ),
    },
    {
      id: 'venue',
      label: 'Venue & Travel',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* ============================================================== */}
      {/* 1. VERTICAL SIDEBAR ON EXTREME LEFT                           */}
      {/* ============================================================== */}
      <aside className="w-full md:w-[245px] bg-[#15110e] text-[#d9c9b8] flex flex-col justify-between border-r border-[#29211a] flex-shrink-0">
        <div>
          {/* Brand & Monogram Header */}
          <div className="p-5 pb-4 flex items-center justify-between border-b border-[#231b14]">
            <div className="flex items-center gap-2.5">
              <span className="tt-mark inline-grid place-items-center w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-sm rounded-[3px]">
                T
              </span>
              <span className="font-serif text-[18px] text-white font-semibold tracking-wide">
                Tap <span className="gold-amp">&amp;</span> Toast
              </span>
            </div>
            <span className="bg-[#291f16] text-[#dfc194] border border-[#bd9661]/40 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
              Planner
            </span>
          </div>

          {/* Navigation Tabs (Vertical List) */}
          <nav className="p-2 flex flex-col gap-1">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as PlannerTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-[13px] transition-all border-l-[3px] cursor-pointer ${
                    isActive
                      ? 'bg-[#291f17] text-[#fce4ca] font-bold border-l-[#bd9661] shadow-xs'
                      : 'text-[#bfaea0] hover:text-white hover:bg-[#201914] border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#bd9661]' : 'text-[#8b7b6b]'}>
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-[#231b14] text-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1 font-bold">
            Lead Coordinator
          </div>
          <div className="font-semibold text-[#dfc194]">{plannerName}</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3 truncate">{plannerBiz}</div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-1.5 px-3 border border-[#3d3126] text-[#d9c9b8] hover:text-white hover:bg-[#231c16] rounded text-xs transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN APPLICATION VIEWPORT                                   */}
      {/* ============================================================== */}
      <main className="flex-1 overflow-y-auto w-full min-w-0 bg-[#faf8f5] flex flex-col">
        <div className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">

          {/* ------------------------------------------------------------ */}
          {/* TAB 1: OVERVIEW                                             */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Clean Structured Hero Header & Client Switcher Section */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
                    WEDDING COORDINATOR SUITE
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                    {activeWedding.couple}
                  </h1>
                  <p className="text-xs text-[#8b7b6b] mt-1">
                    {activeWedding.venue} &bull;{' '}
                    <span className="font-semibold text-[#15110e]">
                      {(() => {
                        try {
                          const d = new Date(activeWedding.date);
                          if (!isNaN(d.getTime())) {
                            return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                          }
                        } catch {}
                        return activeWedding.date;
                      })()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{activeWedding.status || 'Finalising'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleExportBrief}
                    className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📄</span>
                    <span>Export Dossier</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Countdown Banner Card */}
              <div className="bg-[#15110e] text-white rounded-2xl p-4 px-6 shadow-md flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⏳</span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#bd9661]">
                      Ceremony Countdown
                    </div>
                    <div className="text-xs text-[#d9cbb8]">
                      Official time remaining until bride and groom walk down the aisle
                    </div>
                  </div>
                </div>
                <div className="bg-[#241c16] border border-[#3d2e24] text-[#dfc194] font-mono font-bold text-sm px-4 py-1.5 rounded-full shadow-inner">
                  {countdown.days} days : {countdown.hours} hrs : {countdown.minutes} mins : {countdown.seconds} secs remaining
                </div>
              </div>

              {/* 4 Clean Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8b7b6b] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">RSVP Completion</span>
                    <span className="text-base">📋</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-[#15110e]">
                      {Math.round((confirmedGuests.length / (totalGuests || 1)) * 100)}%
                    </span>
                    <span className="text-xs text-[#8b7b6b]">
                      ({confirmedGuests.length} / {totalGuests} confirmed)
                    </span>
                  </div>
                  <div className="w-full bg-[#f0ebe1] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[#bd9661] h-full rounded-full transition-all"
                      style={{ width: `${(confirmedGuests.length / (totalGuests || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8b7b6b] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Floor Plan Seated</span>
                    <span className="text-base">🪑</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-[#15110e]">
                      {seatedGuests.length}
                    </span>
                    <span className="text-xs text-[#8b7b6b]">
                      / {totalCapacity} seats ({weddingTables.length} tables)
                    </span>
                  </div>
                  <div className="w-full bg-[#f0ebe1] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[#15110e] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (seatedGuests.length / (totalCapacity || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8b7b6b] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Dietary Requirements</span>
                    <span className="text-base">🥗</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-[#bd9661]">
                      {dietaryGuests.length}
                    </span>
                    <span className="text-xs text-[#8b7b6b]">
                      special meals flagged for kitchen
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8b7b6b] mt-3 truncate font-medium">
                    Gluten-Free, Vegan, Vegetarian, Nut allergy
                  </div>
                </div>

                <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-[#8b7b6b] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Digital QaRd Invites</span>
                    <span className="text-base">💌</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-emerald-700">94.1%</span>
                    <span className="text-xs text-[#8b7b6b]">mobile passes viewed</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-3 flex items-center gap-1">
                    <span>✓</span>
                    <span>Synchronized pass delivery</span>
                  </div>
                </div>
              </div>

              {/* Two Clean Sections: Runsheet Milestones & VIP Quick Glance */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Runsheet Milestones (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#15110e]">
                        Coordinator Day-Of Runsheet
                      </h2>
                      <p className="text-xs text-[#8b7b6b]">
                        Key event cues synchronized with MC Robert Galati and catering team.
                      </p>
                    </div>
                    <span className="text-xs bg-[#faf5ee] border border-[#ebd3a8] text-[#8b6932] px-3 py-1 rounded-full font-bold">
                      Master Timeline
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { time: '12:00 PM', title: 'Vendor Load-In & Audio Soundcheck', note: 'Florist and audio engineers set up in Grand Pavilion', done: true },
                      { time: '02:00 PM', title: 'Guests Arrive & Welcome Refreshments', note: 'String quartet begins on Lower Meadow Lawns', done: true },
                      { time: '02:30 PM', title: 'Wedding Ceremony Begins', note: 'Bride entrance; celebrant vows & ring exchange', done: true },
                      { time: '03:15 PM', title: 'Family Photography & Cocktail Hour', note: 'Canapés served on the Verandah', done: false },
                      { time: '05:00 PM', title: 'Reception Ballroom Doors Open', note: 'Guests seated via visual seating floor plan', done: false },
                      { time: '05:30 PM', title: 'Grand Bridal Entrance & Speeches', note: 'Speeches by Father of the Bride, Groom & Best Man', done: false },
                      { time: '08:30 PM', title: 'Cake Cutting & First Dance', note: 'Dance floor spotlight cue with acoustic live band', done: false },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                          item.done
                            ? 'bg-[#faf8f5] border-[#ebdcc9] opacity-75'
                            : 'bg-white border-[#ebd3a8] shadow-2xs'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-[#15110e] text-[#dfc194]'
                        }`}>
                          {item.done ? '✓' : idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-bold text-xs text-[#15110e]">{item.title}</span>
                            <span className="font-mono text-xs font-bold text-[#bd9661] shrink-0">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8b7b6b] mt-0.5">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VIP Watchlist (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#15110e]">
                        Bridal Party &amp; VIP Watchlist
                      </h2>
                      <p className="text-xs text-[#8b7b6b]">
                        Head table placements and designated roles.
                      </p>
                    </div>
                    <span className="text-[11px] bg-[#bd9661]/15 text-[#8b6932] px-2.5 py-0.5 rounded-full font-bold">
                      Head Table Focus
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Sophie Bell', role: 'Bride', note: 'Head Table Seat 1' },
                      { name: 'James Gordon', role: 'Groom', note: 'Head Table Seat 2' },
                      { name: 'Hannah Martin', role: 'Maid of Honour', note: 'Speech at 6:45 PM · Head Table Seat 3' },
                      { name: 'Oliver Vance', role: 'Best Man', note: 'Holds wedding rings · Head Table Seat 4' },
                      { name: 'Charlotte Evans', role: 'Bridesmaid', note: 'Gluten-Free meal · Head Table Seat 5' },
                      { name: 'Liam Fletcher', role: 'Groomsman', note: 'Head Table Seat 6' },
                    ].map((vip, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-[#faf8f5] border border-[#ebdcc9] rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#15110e]">{vip.name}</span>
                          <span className="ml-2 text-[10px] bg-[#e8ded0] text-[#524438] px-1.5 py-0.2 rounded font-semibold">
                            {vip.role}
                          </span>
                          <div className="text-[11px] text-[#8b7b6b] mt-0.5">{vip.note}</div>
                        </div>
                        <span className="text-emerald-700 font-bold text-[11px]">✓ Confirmed</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 2: SEATING PLANNER (EMBEDDED)                            */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'seating' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <SeatingPlannerSection
                weddingId={activeWedding.id}
                onSelectView={onSelectView}
                isMcView={true}
              />
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 3: GUEST LIST ROSTER                                    */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'guest-list' && (
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-150">
              {/* Header & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#ebdcc9] pb-4">
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                    ATTENDEE MANAGEMENT
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                    Guest List
                  </h1>
                  <p className="text-xs text-[#8b7b6b] mt-1">
                    {confirmedGuests.length} Confirmed · {awaitingGuests.length} Awaiting ·{' '}
                    {dietaryGuests.length} Dietary Requirements
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => showToast('Guest list exported to CSV', 'success')}
                    className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>📊</span> Export CSV
                  </button>
                </div>
              </div>

              {/* Search & Filter Chips */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <input
                  type="text"
                  placeholder="Search guest, household, dietary..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] w-full sm:w-72 shadow-2xs"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: `All Guests (${weddingGuests.length})` },
                    { id: 'confirmed', label: `Confirmed (${confirmedGuests.length})` },
                    { id: 'awaiting', label: `Awaiting RSVP (${awaitingGuests.length})` },
                    { id: 'declined', label: `Declined (${declinedGuests.length})` },
                    { id: 'dietary', label: `Dietary Needs (${dietaryGuests.length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setGuestFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors whitespace-nowrap ${
                        guestFilter === f.id
                          ? 'bg-[#15110e] text-[#dfc194]'
                          : 'bg-[#faf8f5] text-[#8b7b6b] hover:text-[#15110e] border border-[#e8ded0]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Table */}
              <div className="border border-[#ebdcc9] rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] border-b border-[#ebdcc9] text-[#8b7b6b] uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Guest Name &amp; Household</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">RSVP Status</th>
                      <th className="py-3 px-4">Dietary Preference</th>
                      <th className="py-3 px-4">Table Assignment</th>
                      <th className="py-3 px-4 text-right">Party Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebdcc9]/60">
                    {filteredGuests.map((g) => {
                      const assignedTable = weddingTables.find((t) => t.id === g.tableId);
                      return (
                        <tr key={g.id} className="hover:bg-[#faf6f0] transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#15110e]">{g.name}</div>
                            <div className="text-[11px] text-[#8b7b6b]">{g.household}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#524438]">
                            <div>{g.phone || '0412 345 678'}</div>
                            <div className="text-[#8b7b6b] text-[10px]">{g.email || 'guest@rsvp.demo'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                                g.rsvpStatus === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : g.rsvpStatus === 'declined'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {g.rsvpStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {g.dietary && g.dietary !== 'None' ? (
                              <span className="bg-[#faf2e6] border border-[#ebd3a8] text-[#8b6932] px-2 py-0.5 rounded font-bold text-[10px]">
                                {g.dietary}
                              </span>
                            ) : (
                              <span className="text-[#a39281]">&mdash;</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {assignedTable ? (
                              <span className="font-bold text-[#bd9661] bg-[#faf8f5] border border-[#ebdcc9] px-2.5 py-1 rounded-lg">
                                {assignedTable.name}
                              </span>
                            ) : (
                              <span className="text-[#b39e8a] italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#15110e]">
                            {g.guestCount || 1}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#8b7b6b]">
                          No guests match your search or filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 4: INVITATIONS & DIGITAL QARD (SAME AS COUPLE)          */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'invitations' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <InvitationTemplatesSection
                selectedQaRdHousehold={selectedQaRdHousehold}
                setSelectedQaRdHousehold={setSelectedQaRdHousehold}
                selectedQaRdPalette={selectedQaRdPalette}
                setSelectedQaRdPalette={setSelectedQaRdPalette}
                onSelectView={onSelectView}
              />
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 5: VENUE & TRAVEL (2x2 GRID SAME AS COUPLE VIEW)        */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'venue' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  LOCATION &amp; LOGISTICS
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Venue &amp; Travel
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Essential travel directions, parking facilities, shuttle schedules, and venue map for guests &amp; vendors
                </p>
              </div>

              {/* 2x2 Venue Details Grid matching CoupleView */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Venue & Address */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#15110e]">Wedding Venue &amp; Address</h3>
                      <div className="text-xs text-[#8b7b6b]">Ceremony &amp; Reception Grounds</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#15110e] leading-relaxed">
                    <strong>Fernwood Estate, Southern Highlands</strong><br />
                    124 Range Road, Mittagong NSW 2575<br />
                    Australia
                  </div>
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebd3a8] text-xs text-[#6b5849] leading-relaxed space-y-1">
                    <div><strong>Ceremony:</strong> 2:00 PM &bull; The Lower Meadow Lawns</div>
                    <div><strong>Cocktail Hour &amp; Reception:</strong> 5:00 PM &bull; The Grand Pavilion</div>
                    <div><strong>Venue Concierge:</strong> (02) 4871 2000 &bull; concierge@fernwoodestate.demo</div>
                  </div>
                </div>

                {/* Card 2: Parking */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🅿️</span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#15110e]">Guest Parking Facilities</h3>
                      <div className="text-xs text-[#8b7b6b]">On-Site Valet &amp; Dedicated Bays</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#15110e]">
                    Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.
                  </p>
                  <ul className="text-xs text-[#6b5849] space-y-1 pl-4 list-disc">
                    <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
                    <li><strong>Valet attendants:</strong> Stationed at the porte-cochère from 1:15 PM.</li>
                    <li><strong>EV Charging:</strong> 4 Type-2 chargers available at North Parking.</li>
                    <li><strong>Overnight Parking:</strong> Permitted until 11:00 AM Sunday morning.</li>
                  </ul>
                </div>

                {/* Card 3: Shuttles */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚌</span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#15110e]">Transport &amp; Guest Shuttles</h3>
                      <div className="text-xs text-[#8b7b6b]">Scheduled Private Charter Transfers</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#15110e]">
                    Private express mini-coaches operate between key Southern Highlands hotels and Fernwood Estate:
                  </p>
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebd3a8] text-xs text-[#6b5849] space-y-1">
                    <strong>Guest Arrival Shuttles:</strong>
                    <div>&bull; 1:15 PM from Bowral Grand Hotel (Station St Entrance)</div>
                    <div>&bull; 1:30 PM from Milton Park Country House Resort</div>
                    <div className="pt-1 text-[#8b7b6b]"><strong>Return Shuttles:</strong> Depart every 30 mins from 10:30 PM until midnight.</div>
                  </div>
                </div>

                {/* Card 4: Interactive Google Map with Open in Google Maps */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">LIVE NAVIGATION</div>
                      <h3 className="font-serif text-base font-bold text-[#15110e]">Interactive Google Map</h3>
                      <div className="text-[11px] text-[#8b7b6b]">Coordinates: 34.4512&deg; S, 150.5369&deg; E</div>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>

                  {/* Map Graphic Container */}
                  <a
                    href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575"
                    target="_blank"
                    rel="noreferrer"
                    className="block relative bg-[#e5e3df] rounded-xl h-[160px] overflow-hidden border border-[#d5c7b5] cursor-pointer group"
                  >
                    <div
                      className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform"
                      style={{
                        backgroundImage: 'radial-gradient(#15110e 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />
                    <div className="absolute inset-x-4 bottom-4 bg-[#15110e]/90 text-white p-3 rounded-xl backdrop-blur-xs flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm shadow-sm">📍</span>
                      <div className="text-left">
                        <strong className="text-xs block">Fernwood Estate</strong>
                        <span className="text-[10px] text-[#c9bbae]">124 Range Road, Mittagong NSW 2575 &bull; Click to open</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 6: PLANNER SETTINGS & PROFILE                            */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  PLANNER PROFILE &amp; INFORMATION
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Coordinator Settings &amp; Profile
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Maintain your professional coordinator credentials, agency contact details, and private day-of briefing dossier.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Planner profile and settings updated successfully', 'success');
                }}
                className="space-y-6"
              >
                {/* Card 1: Professional Identity & Agency Details */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">📋</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Coordinator Identity &amp; Agency Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Planner Full Name *
                      </label>
                      <input
                        type="text"
                        value={plannerName}
                        onChange={(e) => setPlannerName(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Anthony Rossi"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Agency / Business Name *
                      </label>
                      <input
                        type="text"
                        value={plannerBiz}
                        onChange={(e) => setPlannerBiz(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Rossi Event Management"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Professional Title / Role
                      </label>
                      <input
                        type="text"
                        value={plannerRole}
                        onChange={(e) => setPlannerRole(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Lead Wedding Coordinator &amp; Event Director"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Specialty / Focus
                      </label>
                      <input
                        type="text"
                        value={plannerAgencyTagline}
                        onChange={(e) => setPlannerAgencyTagline(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-medium shadow-2xs"
                        placeholder="e.g. Luxury Estate &amp; Destination Weddings"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Direct Contact Credentials */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">📞</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Direct Contact &amp; Emergency Reachability
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Direct Phone *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l-xl select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          value={plannerPhone}
                          onChange={(e) => setPlannerPhone(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-r-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-mono shadow-2xs"
                          placeholder="421 884 991"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Professional Email *
                      </label>
                      <input
                        type="email"
                        value={plannerEmail}
                        onChange={(e) => setPlannerEmail(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] shadow-2xs"
                        placeholder="anthony@rossievents.demo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                        Day-Of Emergency Hotline
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l-xl select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          value={plannerEmergencyPhone}
                          onChange={(e) => setPlannerEmergencyPhone(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-r-xl px-3.5 py-2 text-xs outline-none focus:border-[#bd9661] text-[#15110e] font-mono shadow-2xs"
                          placeholder="419 772 311"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Bio & Background */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">📝</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Coordinator Bio &amp; Experience Overview
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                      Professional Background
                    </label>
                    <textarea
                      rows={3}
                      value={plannerBio}
                      onChange={(e) => setPlannerBio(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3.5 text-xs outline-none focus:border-[#bd9661] text-[#15110e] leading-relaxed shadow-2xs"
                      placeholder="Describe your coordination experience, past venues, and hosting philosophy..."
                    />
                  </div>
                </div>

                {/* Card 4: Coordinator Private Notes */}
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">🔒</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Coordinator Private Dossier &amp; Briefing Notes
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                      Private Day-Of Operational Notes
                    </label>
                    <textarea
                      rows={4}
                      value={plannerNotes}
                      onChange={(e) => setPlannerNotes(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3.5 text-xs outline-none focus:border-[#bd9661] text-[#15110e] leading-relaxed shadow-2xs"
                      placeholder="Enter private coordinator notes, load-in specifications, or vendor reminders..."
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#15110e] text-[#dfc194] hover:text-white rounded-xl font-bold text-xs border border-[#bd9661] shadow-md cursor-pointer transition-colors"
                  >
                    Save Planner Profile &amp; Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
