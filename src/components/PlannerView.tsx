import React, { useState, useEffect } from 'react';
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
  const [plannerInitialTab, setPlannerInitialTab] = useState<'mc_runsheet' | 'seating' | 'venue' | 'vendors'>('mc_runsheet');
  const [activeTab, setActiveTab] = useState<'weddings' | 'calendar' | 'clients' | 'settings'>('weddings');

  // Calendar State
  const [calMonth, setCalMonth] = useState(10); // Nov (0-indexed = 10)
  const [calYear, setCalYear] = useState(2026);

  // Settings State with LocalStorage persistence
  const [profileForm, setProfileForm] = useState(() => {
    const saved = localStorage.getItem('tt_planner_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      // Identity & Studio
      name: 'Anthony Rossi',
      role: 'Lead Wedding Coordinator & Event Director',
      agency: 'Rossi Event Architecture',
      phone: '0421 884 991',
      email: 'anthony@rossievents.demo',
      abn: '48 912 345 678',
      website: 'www.rossieventarchitecture.com.au',
      regions: 'Southern Highlands, Sydney, Hunter Valley, Blue Mountains',
      bio: 'Over 12 years of luxury wedding coordination experience across Southern Highlands and Sydney.',

      // Timeline & Coordination Defaults
      bufferMargin: 15, // 5, 10, 15, 20
      timeFormat: '12h', // '12h' | '24h'
      cueLeadMinutes: 10, // 5, 10, 15
      weatherTriggerPercent: 40,
      visualOverrunWarning: true,

      // Vendor Concierge & Collaboration
      autoDispatchCueSheets: true,
      vendorArrivalTracking: true,
      vendorDietarySync: true,
      muteVendorPingsDuringSpeeches: true,

      // Client Collaboration & Timeline Lock
      allowCoupleEdits: true,
      timelineLockWindow: '48h', // 'never' | '24h' | '48h' | '72h'
      requirePlannerApprovalForSeating: true,
      hideBudgetFromVendors: true,

      // Real-Time Notification Preferences
      smsAlertsOverrun: true,
      vipStatusAlerts: true,
      dailyBriefingEmail: true,
      audioChimeCues: false,
    };
  });

  // Export JSON handler
  const handleExportPlannerData = () => {
    const exportObj = {
      exportedAt: new Date().toISOString(),
      plannerProfile: profileForm,
      activeWeddingsCount: (state.weddings || []).length,
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Planner settings & data exported successfully', 'success');
  };

  const handleResetPlannerDefaults = () => {
    const defaultData = {
      name: 'Anthony Rossi',
      role: 'Lead Wedding Coordinator & Event Director',
      agency: 'Rossi Event Architecture',
      phone: '0421 884 991',
      email: 'anthony@rossievents.demo',
      abn: '48 912 345 678',
      website: 'www.rossieventarchitecture.com.au',
      regions: 'Southern Highlands, Sydney, Hunter Valley, Blue Mountains',
      bio: 'Over 12 years of luxury wedding coordination experience across Southern Highlands and Sydney.',
      bufferMargin: 15,
      timeFormat: '12h',
      cueLeadMinutes: 10,
      weatherTriggerPercent: 40,
      visualOverrunWarning: true,
      autoDispatchCueSheets: true,
      vendorArrivalTracking: true,
      vendorDietarySync: true,
      muteVendorPingsDuringSpeeches: true,
      allowCoupleEdits: true,
      timelineLockWindow: '48h',
      requirePlannerApprovalForSeating: true,
      hideBudgetFromVendors: true,
      smsAlertsOverrun: true,
      vipStatusAlerts: true,
      dailyBriefingEmail: true,
      audioChimeCues: false,
    };
    setProfileForm(defaultData);
    localStorage.setItem('tt_planner_settings', JSON.stringify(defaultData));
    showToast('Planner preferences reset to defaults', 'info');
  };

  const handleSavePlannerSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('tt_planner_settings', JSON.stringify(profileForm));
    showToast('All planner preferences & settings saved successfully', 'success');
  };

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
                  
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e] leading-tight">
                    Your Weddings
                  </h1>
                </div>
                
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
                              📋 Day Sheet &rarr;
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

          

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <section className="space-y-6 max-w-4xl animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                    PREFERENCES &amp; STUDIO CONTROLS
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                    Planner Profile &amp; Settings
                  </h1>
                  <p className="text-xs text-[#8b7b6b] mt-1">
                    Manage your coordinator studio identity, run sheet automation, vendor concierge, client locking windows, and notifications.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportPlannerData}
                    className="px-3 py-2 bg-white hover:bg-[#faf7f2] border border-[#e8ded0] text-[#15110e] font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>📥</span>
                    <span>Export JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePlannerSettings()}
                    className="px-4 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>✓</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSavePlannerSettings} className="space-y-6">
                {/* Section 1: Planner Profile & Studio Identity */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">🏛️</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Coordinator Identity &amp; Studio Branding</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Agency / Business Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.agency}
                        onChange={(e) => setProfileForm({ ...profileForm, agency: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Contact Phone
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#e8ded0] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l-xl select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-r-xl rounded-l-none p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Australian Business Number (ABN)
                      </label>
                      <input
                        type="text"
                        value={profileForm.abn || '48 912 345 678'}
                        onChange={(e) => setProfileForm({ ...profileForm, abn: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Studio Website / Portfolio
                      </label>
                      <input
                        type="text"
                        value={profileForm.website || 'www.rossieventarchitecture.com.au'}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Primary Service Regions
                      </label>
                      <input
                        type="text"
                        value={profileForm.regions || 'Southern Highlands, Sydney, Hunter Valley'}
                        onChange={(e) => setProfileForm({ ...profileForm, regions: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Professional Bio &amp; Coordination Philosophy
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Timeline & Coordination Operational Defaults */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">⏱️</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Timeline &amp; Day Sheet Defaults</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Default Buffer Margin
                      </label>
                      <select
                        value={profileForm.bufferMargin ?? 15}
                        onChange={(e) => setProfileForm({ ...profileForm, bufferMargin: Number(e.target.value) })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      >
                        <option value={5}>5 minutes (Tight Schedule)</option>
                        <option value={10}>10 minutes (Standard)</option>
                        <option value={15}>15 minutes (Recommended for Luxury)</option>
                        <option value={20}>20 minutes (Relaxed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Day Sheet Time Display
                      </label>
                      <select
                        value={profileForm.timeFormat || '12h'}
                        onChange={(e) => setProfileForm({ ...profileForm, timeFormat: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      >
                        <option value="12h">12-Hour (e.g. 4:30 PM)</option>
                        <option value="24h">24-Hour Military (e.g. 16:30)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Vendor Cue Lead Alert
                      </label>
                      <select
                        value={profileForm.cueLeadMinutes ?? 10}
                        onChange={(e) => setProfileForm({ ...profileForm, cueLeadMinutes: Number(e.target.value) })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      >
                        <option value={5}>5 minutes before cue</option>
                        <option value={10}>10 minutes before cue (Standard)</option>
                        <option value={15}>15 minutes before cue</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f0ede4]">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Visual Overrun Warning Flasher</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Highlights items in amber on the active run sheet when an event exceeds schedule by more than 5 minutes.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.visualOverrunWarning ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, visualOverrunWarning: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 3: Vendor Concierge & Collaboration */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">🤝</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Vendor Concierge &amp; Live Collaboration</h3>
                  </div>

                  <div className="divide-y divide-[#f0ede4]">
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Auto-Dispatch Live Call Sheets</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Automatically email updated, filtered call sheets to confirmed vendors whenever milestone timings shift.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.autoDispatchCueSheets ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, autoDispatchCueSheets: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Real-Time Vendor Arrival Check-In</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Show mobile check-in buttons on vendor portal links and alert planner upon on-site arrival.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.vendorArrivalTracking ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, vendorArrivalTracking: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Vendor Crew Dietary Auto-Sync</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Sync vendor crew meal counts and allergies directly with catering run sheets and kitchen head counts.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.vendorDietarySync ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, vendorDietarySync: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Mute Non-Critical Pings During Formalities</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Suppress sound alerts and non-urgent vendor messages during speeches, vows, and cake cutting.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.muteVendorPingsDuringSpeeches ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, muteVendorPingsDuringSpeeches: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 4: Client Collaboration & Timeline Lock */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">🔒</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Client Collaboration &amp; Lock Windows</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Day Sheet Lock Window
                      </label>
                      <select
                        value={profileForm.timelineLockWindow || '48h'}
                        onChange={(e) => setProfileForm({ ...profileForm, timelineLockWindow: e.target.value })}
                        className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      >
                        <option value="never">Never (Always allow client edits)</option>
                        <option value="24h">Lock 24 Hours Prior to Ceremony</option>
                        <option value="48h">Lock 48 Hours Prior (Recommended)</option>
                        <option value="72h">Lock 72 Hours Prior</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider block mb-1">
                        Rain Contingency Trigger Threshold
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          min={10}
                          max={90}
                          value={profileForm.weatherTriggerPercent ?? 40}
                          onChange={(e) => setProfileForm({ ...profileForm, weatherTriggerPercent: Number(e.target.value) })}
                          className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-l-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                        <span className="inline-flex items-center px-3 border border-l-0 border-[#e8ded0] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-r-xl select-none">
                          % Rain Probability
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-[#f0ede4] pt-1">
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Allow Couple Direct Run Sheet Suggestions</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Couples can propose timing edits directly from their portal until the lock window activates.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.allowCoupleEdits ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, allowCoupleEdits: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Require Planner Approval for Late Seating Changes</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Prevent accidental table reshuffles within 72 hours of wedding day without coordinator sign-off.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.requirePlannerApprovalForSeating ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, requirePlannerApprovalForSeating: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Redact Budget Figures from Shared Vendor Call Sheets</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Strictly keep vendor contracts, deposit statuses, and couple spend hidden from third-party vendor downloads.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.hideBudgetFromVendors ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, hideBudgetFromVendors: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 5: Real-Time Alerts & Notification Center */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">🔔</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Alerts &amp; Notification Preferences</h3>
                  </div>

                  <div className="divide-y divide-[#f0ede4]">
                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Instant SMS on Schedule Overruns (&gt; 10 mins)</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Send emergency push/SMS to the lead coordinator phone if speeches or photo shoots drift +10 mins behind.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.smsAlertsOverrun ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, smsAlertsOverrun: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">VIP &amp; Bridal Party RSVP Alerts</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Notify immediately when immediate family, wedding party members, or VIP guests accept or decline.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.vipStatusAlerts ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, vipStatusAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Daily Morning Briefing Digest</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Receive a 7:00 AM summary of pending vendor confirmations, guest dietary flags, and upcoming milestone dates.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.dailyBriefingEmail ?? true}
                          onChange={(e) => setProfileForm({ ...profileForm, dailyBriefingEmail: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <strong className="text-xs text-[#15110e] block">Audio Chime on Imminent Cues</strong>
                        <span className="text-[11px] text-[#8b7b6b]">
                          Play a subtle audio cue tone when an on-screen run sheet milestone is 2 minutes away.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={profileForm.audioChimeCues ?? false}
                          onChange={(e) => setProfileForm({ ...profileForm, audioChimeCues: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 6: Studio Backup & System Reset */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                    <span className="text-lg">💾</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Studio Backup &amp; Defaults</h3>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs text-[#15110e] block">Reset Planner Preferences to Factory Default</strong>
                      <span className="text-[11px] text-[#8b7b6b]">
                        Restore all run sheet margins, buffer times, and concierge alerts to standard luxury settings.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPlannerDefaults}
                      className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors shrink-0"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="pt-3 pb-6 flex items-center justify-between border-t border-[#e8ded0]">
                  <span className="text-xs text-[#8b7b6b]">
                    Changes apply across all managed active weddings and client portals.
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleResetPlannerDefaults()}
                      className="px-4 py-2.5 border border-[#d5c7b5] text-[#15110e] font-bold text-xs rounded-xl hover:bg-[#faf7f2] transition-colors"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] font-bold text-xs rounded-xl shadow-xs hover:brightness-105 transition-all"
                    >
                      Save All Preferences
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
