import React, { useState } from 'react';
import { useAppState, useSession, showToast } from '../lib/state';
import CoupleView from './CoupleView';
import McReferralsSection from './McReferralsSection';

interface PlannerViewProps {
  onSelectView?: (view: string) => void;
}

export default function PlannerView({ onSelectView }: PlannerViewProps) {
  const { state, setState } = useAppState();
  const { clearSession } = useSession();

  // Active Wedding Selection (null = All Weddings home mode)
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const [plannerInitialTab, setPlannerInitialTab] = useState<'mc_runsheet' | 'seating' | 'venue'>('mc_runsheet');
  const [activeTab, setActiveTab] = useState<'weddings' | 'calendar' | 'clients' | 'referrals' | 'settings'>('weddings');

  // Calendar State
  const [calMonth, setCalMonth] = useState(10); // Nov (0-indexed = 10)
  const [calYear, setCalYear] = useState(2026);

  // Settings State
  const [profileForm, setProfileForm] = useState({
    name: 'Anthony Rossi',
    role: 'Lead Wedding Coordinator & Event Director',
    agency: 'Rossi Event Architecture',
    phone: '0421 884 991',
    email: 'anthony@rossievents.demo',
    bio: 'Over 12 years of luxury wedding coordination experience across Southern Highlands and Sydney.',
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const changeCalendarMonth = (delta: number) => {
    let nextMonth = calMonth + delta;
    let nextYear = calYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setCalMonth(nextMonth);
    setCalYear(nextYear);
  };

  const handleLogout = () => {
    clearSession();
    showToast('Signed out of Wedding Planner Portal', 'info');
    if (onSelectView) onSelectView('login');
  };

  const confirmedGuests = (state.guests || []).filter(g => g.rsvpStatus === 'confirmed');

  // --------------------------------------------------------------------------
  // INSIDE WEDDING MODE: IDENTICAL TO MC (COUPLE VIEW WITH 3 TABS ONLY)
  // --------------------------------------------------------------------------
  if (selectedWeddingId) {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <CoupleView
          weddingId={selectedWeddingId}
          isPlannerView={true}
          initialTab={plannerInitialTab || 'mc_runsheet'}
          onBackToWeddings={() => setSelectedWeddingId(null)}
          onSelectView={onSelectView}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // HOME MODE: ALL WEDDINGS OVERVIEW (IDENTICAL TO MC VIEW & IMAGE 2)
  // --------------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full md:w-[260px] bg-[#15110e] text-white flex-shrink-0 flex flex-col justify-between border-r border-[#231b14]">
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

          <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-[2px] text-[#bd9661]">
            PLANNER ACCOUNT
          </div>

          {/* Navigation Links */}
          <nav className="p-2 flex flex-col gap-1">
            {[
              {
                id: 'weddings',
                label: 'All Weddings',
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
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
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#231b14] text-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#8c7b6c] mb-1">Signed in as</div>
          <div className="font-semibold text-white">Wedding Planner</div>
          <div className="text-[11px] text-[#8c7b6c] mb-3">Professional Coordinator</div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-1.5 px-3 border border-[#3d3126] text-[#d9c9b8] hover:text-white hover:bg-[#231c16] rounded text-xs transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Application Viewport */}
      <main className="flex-1 p-6 md:p-9 overflow-y-auto w-full min-w-0">
        <div className="max-w-[1400px] w-full mx-auto space-y-6">

          {/* TAB 1: ALL WEDDINGS (EXACTLY MATCHING IMAGE 2) */}
          {activeTab === 'weddings' && (
            <section className="space-y-7 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                    PLANNER ACCOUNT
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e] leading-tight">
                    Your Weddings
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('New wedding booking draft created!', 'success')}
                  className="btn btn-primary"
                >
                  + New Wedding
                </button>
              </div>

              {/* 4 Metric Cards matching Image 2 */}
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

              {/* Weddings Table matching Image 2 */}
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
                    {(state.weddings || []).map((w, idx) => {
                      const initials = w.couple.split('&').map(p => p.trim()[0]).join('&');
                      const confirmedCount = w.id === 'w1' ? confirmedGuests.length : (w.confirmed || 0);
                      const percent = Math.min(100, Math.round((confirmedCount / (w.invited || 100)) * 100));
                      const statusClass = idx === 0 ? 'finalising' : idx === 2 ? 'on-track' : 'planning';
                      const statusLabel = idx === 0 ? 'Finalising' : idx === 2 ? 'On Track' : 'Planning';

                      return (
                        <tr
                          key={w.id}
                          className="cursor-pointer hover:bg-[#faf7f2] transition-colors"
                          onClick={() => {
                            setSelectedWeddingId(w.id);
                            setPlannerInitialTab('mc_runsheet');
                          }}
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
                                setPlannerInitialTab('mc_runsheet');
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

          {/* TAB 2: CALENDAR */}
          {activeTab === 'calendar' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                    PLANNER SCHEDULE
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
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                  <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const firstDay = new Date(calYear, calMonth, 1).getDay();
                    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
                    const cells = [];

                    for (let i = 0; i < firstDay; i++) {
                      cells.push(
                        <div key={`empty-${i}`} className="min-h-[90px] bg-[#faf8f5] opacity-40 rounded-lg border border-[#eee]" />
                      );
                    }

                    for (let d = 1; d <= totalDays; d++) {
                      const matchedWeddings = (state.weddings || []).filter(w => {
                        const wd = new Date(w.date);
                        return wd.getFullYear() === calYear && wd.getMonth() === calMonth && wd.getDate() === d;
                      });

                      cells.push(
                        <div
                          key={`day-${d}`}
                          onClick={() => showToast(`Calendar selected: ${d} ${monthNames[calMonth]} ${calYear}`, 'info')}
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
                                  setPlannerInitialTab('mc_runsheet');
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

          {/* TAB 3: CLIENTS */}
          {activeTab === 'clients' && (
            <section className="space-y-6 animate-in fade-in duration-150">
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
                        <td><span className="tt-pill warm text-xs">{client.tier}</span></td>
                        <td className="text-xs font-semibold text-[#15110e]">{client.deposit}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedWeddingId('w1');
                              setPlannerInitialTab('mc_runsheet');
                            }}
                            className="btn btn-outline btn-xs"
                          >
                            Open Wedding &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: REFERRALS */}
          {activeTab === 'referrals' && (
            <McReferralsSection state={state} setState={setState} />
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <section className="space-y-6 max-w-4xl animate-in fade-in duration-150">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  PREFERENCES
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Planner Profile &amp; Settings
                </h1>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8b7b6b] uppercase">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8b7b6b] uppercase">Role Title</label>
                    <input
                      type="text"
                      value={profileForm.role}
                      onChange={e => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="input w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8b7b6b] uppercase">Agency / Business Name</label>
                    <input
                      type="text"
                      value={profileForm.agency}
                      onChange={e => setProfileForm({ ...profileForm, agency: e.target.value })}
                      className="input w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8b7b6b] uppercase">Contact Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="input w-full mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-[#8b7b6b] uppercase">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="input w-full mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-[#8b7b6b] uppercase">Professional Bio</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="input w-full mt-1"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('Planner profile settings saved successfully', 'success')}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
