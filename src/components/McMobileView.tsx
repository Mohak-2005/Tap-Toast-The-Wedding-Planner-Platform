import React, { useState, useRef } from 'react';
import { useAppState, showToast } from '../lib/state';
import { Table, TableShape } from '../lib/types';


interface McMobileViewProps {
  onSelectView?: (view: string) => void;
}

export default function McMobileView({ onSelectView }: McMobileViewProps) {
  const { state, setState } = useAppState();
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // Selected wedding ID for Live Console mode (null = home mode)
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);

  // Settings Sub-tab ('profile' | 'referrals')
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'referrals'>('profile');

  // Home Bottom Navigation ('weddings' | 'calendar' | 'invoice' | 'team' | 'settings')
  // Referral code modal & list states
  const [isCreateReferralOpen, setIsCreateReferralOpen] = useState(false);
  const [newReferralCode, setNewReferralCode] = useState('');
  const [newReferralDiscount, setNewReferralDiscount] = useState('15% OFF');
  const [newReferralDesc, setNewReferralDesc] = useState('');
  const [mobileReferralCodes, setMobileReferralCodes] = useState([
    { code: 'ROBERT-VIP-15', discount: '15% OFF', desc: 'Standard couple referral', uses: 12, status: 'Active' },
    { code: 'BRIDALEXPO2027', discount: '$100 OFF', desc: 'Sydney Bridal Expo promo', uses: 4, status: 'Active' },
    { code: 'SUMMERLOVE', discount: '10% OFF', desc: 'Summer 2027 packages', uses: 2, status: 'Active' },
  ]);

  const [homeTab, setHomeTab] = useState<'weddings' | 'calendar' | 'referrals' | 'invoice' | 'team' | 'settings'>('weddings');

  // Live Console Navigation ('runsheet' | 'seating' | 'venue' | 'profile' | 'weddings')
  const [consoleTab, setConsoleTab] = useState<'runsheet' | 'seating' | 'venue' | 'profile'>('runsheet');

  // Live Console Seating Sub-segment ('guestlist' | 'seatingarr' | 'unseated')
  const [seatingSubTab, setSeatingSubTab] = useState<'guestlist' | 'seatingarr' | 'unseated'>('guestlist');

  // Live Console Run Sheet Filter
  const [runSheetFilter, setRunSheetFilter] = useState<'all' | 'upcoming' | 'done'>('all');
  const [cueSearch, setCueSearch] = useState('');

  // Guest search in seating
  const [guestSearch, setGuestSearch] = useState('');
  const [shapeFilter, setShapeFilter] = useState<'all' | 'round' | 'rectangular' | 'king'>('all');

  // Checklist items
  const [techChecklist, setTechChecklist] = useState({
    micA: true,
    micB: true,
    lapel: true,
    uplighting: false,
  });

  // Invoice statuses
  const [invoiceStatuses, setInvoiceStatuses] = useState<Record<string, 'Paid' | 'Pending' | 'Draft'>>({
    'INV-1081': 'Paid',
    'INV-1082': 'Pending',
    'INV-1083': 'Draft',
    'INV-1084': 'Draft',
  });
  const [openInvoiceDropdown, setOpenInvoiceDropdown] = useState<string | null>(null);

  // Dynamic Calendar State
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 10, 1)); // November 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(14);

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    setSelectedCalendarDay(null);
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    setSelectedCalendarDay(null);
  };

  // MC Profile settings form
  const [profileForm, setProfileForm] = useState({
    name: 'Robert Galati',
    role: 'Executive Lead MC & Event Host',
    agency: 'Galati MC & Entertainment',
    bio: 'years orchestrating luxury weddings across Sydney and the Southern Highlands. Renowned for seamless run-sheet flow, magnetic crowd engagement, and bilingual announcements.',
    phone: '+61 418 223 901',
    email: 'robert@galati.demo',
    website: 'www.galatimc.com.au',
  });

  // Unseated guests
  const [unseatedGuests, setUnseatedGuests] = useState([
    { id: 'u1', name: 'Robert Chen', note: '+1 guest · Vegetarian', diet: 'Vegetarian' },
    { id: 'u2', name: 'Sarah Lee', note: 'No plus-one', diet: '' },
    { id: 'u3', name: 'David Whitfield', note: '+1 guest', diet: '' },
    { id: 'u4', name: 'Maya Kapoor', note: 'No plus-one · Gluten-free', diet: 'Gluten-free' },
  ]);
  const [selectedAssignTable, setSelectedAssignTable] = useState<Record<string, string>>({});

  // MC Mobile Seating Modal & Cheers AI States
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableShape, setNewTableShape] = useState<TableShape>('round');
  const [newTableCapacity, setNewTableCapacity] = useState(10);
  const [newTableCategory, setNewTableCategory] = useState('Family');

  const [showCheersAiModal, setShowCheersAiModal] = useState(false);
  const [activeAiScenario, setActiveAiScenario] = useState<'households' | 'vips' | 'fill' | 'dietary'>('households');
  const [aiProposal, setAiProposal] = useState<{
    title: string;
    desc: string;
    count: number;
    changes: { guestId: string; tableId: string }[];
  } | null>(null);

  // Cheers AI Seating Recommendations Engine for MC Mobile
  const handleRunCheersAiSeating = (scenario: 'households' | 'vips' | 'fill' | 'dietary') => {
    setActiveAiScenario(scenario);
    let title = '';
    let desc = '';
    const proposedChanges: { guestId: string; tableId: string }[] = [];

    const availableTables = (state.tables || []).map((t) => ({
      ...t,
      currentCount: (state.guests || []).filter((g) => g.tableId === t.id).length,
    }));

    const unassignedGuests = (state.guests || []).filter((g) => !g.tableId && g.rsvpStatus !== 'declined');

    if (scenario === 'households') {
      title = 'Group Households & Families Together';
      desc = 'Scanned all unassigned guests and matched families into tables with sufficient capacity so households remain seated together.';

      const hhMap = new Map<string, typeof unassignedGuests>();
      unassignedGuests.forEach((g) => {
        const hh = g.household || 'General';
        if (!hhMap.has(hh)) hhMap.set(hh, []);
        hhMap.get(hh)!.push(g);
      });

      hhMap.forEach((members) => {
        const needed = members.length;
        const candidate = availableTables.find((t) => (t.category === 'Family' || t.name.toLowerCase().includes('family')) && t.capacity - t.currentCount >= needed) ||
          availableTables.find((t) => t.capacity - t.currentCount >= needed);

        if (candidate) {
          members.forEach((m) => {
            proposedChanges.push({ guestId: m.id, tableId: candidate.id });
          });
          candidate.currentCount += needed;
        }
      });
    } else if (scenario === 'vips') {
      title = 'Seat VIPs & Bridal Party at Head / King Tables';
      desc = 'Recommended placement for wedding party and immediate VIPs at Head Table and King Table A.';

      const bridalGuests = (state.guests || []).filter((g) => !g.tableId && ((g.household && (g.household.includes('Bell') || g.household.includes('Gordon'))) || g.name.includes('Sophie') || g.name.includes('James')));
      const headTbl = availableTables.find((t) => t.isHead || t.name.toLowerCase().includes('head')) || availableTables[0];

      if (headTbl) {
        bridalGuests.forEach((g) => {
          if (headTbl.currentCount < headTbl.capacity) {
            proposedChanges.push({ guestId: g.id, tableId: headTbl.id });
            headTbl.currentCount++;
          }
        });
      }
    } else if (scenario === 'dietary') {
      title = 'Group Dietary Requirements for Catering';
      desc = 'Placed guests requiring Vegetarian, Vegan, Halal, or Gluten-Free meals at dedicated tables to assist banquet catering service.';

      const dietaryGuests = (state.guests || []).filter((g) => !g.tableId && g.dietary && g.dietary !== 'None' && g.dietary !== '');
      const vegTable = availableTables.find((t) => t.name.includes('Table 2') || t.name.includes('Garden')) || availableTables[1];

      if (vegTable) {
        dietaryGuests.forEach((g) => {
          if (vegTable.currentCount < vegTable.capacity) {
            proposedChanges.push({ guestId: g.id, tableId: vegTable.id });
            vegTable.currentCount++;
          }
        });
      }
    } else {
      title = 'Fill Table Vacancies Evenly';
      desc = 'Evenly distributed unassigned guests across tables with available vacancies to maintain balanced room density.';

      unassignedGuests.forEach((g) => {
        const candidate = availableTables.find((t) => t.currentCount < t.capacity);
        if (candidate) {
          proposedChanges.push({ guestId: g.id, tableId: candidate.id });
          candidate.currentCount++;
        }
      });
    }

    setAiProposal({
      title,
      desc,
      count: proposedChanges.length,
      changes: proposedChanges,
    });
    setShowCheersAiModal(true);
  };

  const handleApplyAiProposal = () => {
    if (!aiProposal || aiProposal.changes.length === 0) return;

    const changeMap = new Map(aiProposal.changes.map((c) => [c.guestId, c.tableId]));
    const updatedGuests = (state.guests || []).map((g) => {
      if (changeMap.has(g.id)) {
        return { ...g, tableId: changeMap.get(g.id)!, seatIndex: 0 };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    setShowCheersAiModal(false);
    showToast(`✨ Cheers AI successfully applied ${aiProposal.changes.length} seating recommendations!`, 'success');
  };

  const handleAddTableFromMobile = () => {
    const tableName = newTableName.trim() || `Table ${(state.tables || []).length + 1}`;
    const newTbl: Table = {
      id: `tbl_mob_${Date.now()}`,
      name: tableName,
      capacity: newTableCapacity,
      isHead: false,
      shape: newTableShape,
      category: newTableCategory,
      zone: 'Main Room',
      x: 50,
      y: 50,
    };
    setState({ ...state, tables: [...(state.tables || []), newTbl] });
    setShowAddTableModal(false);
    setNewTableName('');
    showToast(`Added ${newTbl.name} (${newTableCapacity} seats, ${newTableShape})`, 'success');
  };

  const handleUnseatGuestMobile = (guestId: string, guestName: string) => {
    const updated = (state.guests || []).map(g => g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g);
    setState({ ...state, guests: updated });
    showToast(`Unseated ${guestName}`, 'info');
  };

  const handleSeatGuestMobile = (guestId: string, tableId: string, tableName: string) => {
    const seatedCount = (state.guests || []).filter(g => g.tableId === tableId).length;
    const targetTbl = (state.tables || []).find(t => t.id === tableId);
    if (targetTbl && seatedCount >= targetTbl.capacity) {
      showToast(`Cannot seat guest: ${targetTbl.name} is at full capacity (${targetTbl.capacity})`, 'error');
      return;
    }
    const updated = (state.guests || []).map(g => g.id === guestId ? { ...g, tableId, seatIndex: seatedCount } : g);
    setState({ ...state, guests: updated });
    const guest = (state.guests || []).find(g => g.id === guestId);
    showToast(`Seated ${guest?.name || 'Guest'} at ${tableName}`, 'success');
  };

  // Joey Chatbot inside MC Mobile
  const [showJoey, setShowJoey] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'joey' | 'user';
    text: string;
    time: string;
  }>>([
    {
      id: 'm1',
      sender: 'joey',
      text: 'Hello, I am Joey, your wedding assistant.',
      time: 'Just now',
    },
    {
      id: 'm2',
      sender: 'joey',
      text: 'How may I help you?',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Cues state for active wedding
  const [cues, setCues] = useState([
    {
      id: 'c1',
      time: '13:30',
      title: 'MC arrival, audio check with AV tech & Celebrant',
      desc: 'MC arrival, audio check with AV tech & Celebrant Sarah',
      notes: 'MC Cue Notes: check wireless mic and audio cue.',
      done: false,
    },
    {
      id: 'c2',
      time: '14:00',
      title: 'Guest seating & ceremony processional commence',
      desc: 'Guest seating & ceremony processional commence',
      notes: 'MC Cue Notes: check wireless mic and audio cue.',
      done: false,
    },
    {
      id: 'c3',
      time: '14:45',
      title: 'Announce cocktail hour, direct guests to verandah',
      desc: 'Announce cocktail hour, direct guests to verandah & gardens',
      notes: 'Direct guests to bridal party photo area.',
      done: false,
    },
    {
      id: 'c4',
      time: '17:30',
      title: 'Grand entrance of bride and groom',
      desc: 'Welcome newlyweds Sophie & James with bridal party applause',
      notes: 'Cue DJ track #4 (Upbeat entrance).',
      done: false,
    },
  ]);

  const toggleCueDone = (id: string) => {
    setCues(cues.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const moveCue = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === cues.length - 1)) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const copy = [...cues];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setCues(copy);
  };

  const deleteCue = (id: string) => {
    setCues(cues.filter(c => c.id !== id));
    showToast('Cue removed', 'info');
  };

  const normalizedId = selectedWeddingId === 'w_sophie_james' ? 'w1'
    : selectedWeddingId === 'w_aisha_marcus' ? 'w2'
    : selectedWeddingId === 'w_emma_tom' ? 'w3'
    : selectedWeddingId;
  const activeWedding = (state.weddings || []).find(w => w.id === normalizedId) || (state.weddings || [])[0];

  const handleOpenConsole = (weddingId: string) => {
    const targetId = weddingId === 'w_sophie_james' ? 'w1'
      : weddingId === 'w_aisha_marcus' ? 'w2'
      : weddingId === 'w_emma_tom' ? 'w3'
      : weddingId;
    setSelectedWeddingId(weddingId);
    setConsoleTab('runsheet');
    setState({ ...state, currentWeddingId: targetId });
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
    const wed = (state.weddings || []).find(w => w.id === targetId);
    showToast(`✓ Opened ${wed?.couple || 'Sophie & James'} Wedding Console`, 'success');
  };

  const handleOpenDesktopConsole = (weddingId: string) => {
    const targetId = weddingId === 'w_sophie_james' ? 'w1'
      : weddingId === 'w_aisha_marcus' ? 'w2'
      : weddingId === 'w_emma_tom' ? 'w3'
      : weddingId;
    setState({ ...state, currentWeddingId: targetId });
    if (onSelectView) {
      onSelectView('mc');
    } else {
      window.location.hash = '#mc';
    }
    showToast('✓ Switched to full MC Pro Desktop Console', 'info');
  };

  const handleSeatGuest = (guestId: string) => {
    const table = selectedAssignTable[guestId] || 'Table 1';
    setUnseatedGuests(unseatedGuests.filter(g => g.id !== guestId));
    showToast(`Guest seated at ${table}`, 'success');
  };

  const handleSeatAll = () => {
    setUnseatedGuests([]);
    showToast('All remaining guests automatically seated across tables 2, 3, & 5', 'success');
  };

  const handleJoeyPrompt = (prompt: string) => {
    const userMsg = { id: 'u_' + Date.now(), sender: 'user' as const, text: prompt, time: 'Just now' };
    let replyText = '';

    if (prompt.toLowerCase().includes('dietary')) {
      replyText = `🍽️ Dietary Alerts (17 special meals):\n• Priya Sharma: Vegetarian\n• Hannah Martin: Vegetarian\n• Charlotte Evans: Gluten-free\n• Michael Chen: Vegetarian\n• Lucy Palmer: Nut allergy\n• Chloe Jenkins: Gluten-free\n• William Ford: Vegetarian\n• Grace Turner: Gluten-free\n+ 9 more in the Guest List tab`;
    } else if (prompt.toLowerCase().includes('next cue')) {
      replyText = `Next cue on schedule: 14:00 — Guest seating & ceremony processional commence on The Meadow Lawn.`;
    } else if (prompt.toLowerCase().includes('head table')) {
      replyText = `HEAD TABLE is fully confirmed with 8 seated VIPs: Sophie Bell, James Gordon, Hannah Martin, Oliver Vance, Charlotte Evans, Liam Fletcher, Grace Turner, and Benjamin Ross.`;
    } else if (prompt.toLowerCase().includes('venue phone')) {
      replyText = `Fernwood Estate Concierge: (02) 4871 2000. Sarah Lin (Venue Manager): 0412 345 678.`;
    } else {
      replyText = `I have updated your console with "${prompt}". All run sheet items are synced.`;
    }

    setChatMessages([...chatMessages, userMsg, {
      id: 'j_' + Date.now(),
      sender: 'joey' as const,
      text: replyText,
      time: 'Just now',
    }]);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-45px)] overflow-hidden font-sans select-none">
      {/* 402x874 Phone Chassis matching Screenshot 4, 10, 13-22 & mc-mobile.html */}
      <div className="w-[402px] max-w-[402px] h-[874px] max-h-[calc(100vh-60px)] bg-[#f8f6f2] rounded-[46px] border-[4px] border-[#1c1511] shadow-[0_20px_60px_rgba(21,17,14,0.22),_0_4px_14px_rgba(21,17,14,0.08)] overflow-hidden relative flex flex-col">
        
        {/* Phone Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[13px] font-bold text-[#15110e] bg-[#f8f6f2] z-20 flex-shrink-0">
          <span>17:28</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[#bd9661] font-bold">5G</span>
            <div className="w-5 h-2.5 border-[1.5px] border-[#15110e] rounded-xs p-0.5 flex items-center relative">
              <div className="w-[85%] h-full bg-[#bd9661] rounded-[1px]" />
              <div className="absolute -right-1 top-0.5 w-[2px] h-1 bg-[#15110e] rounded-r-xs" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* HEADER: HOME MODE vs LIVE CONSOLE MODE                         */}
        {/* ============================================================== */}
        {!selectedWeddingId ? (
          /* Home Mode Header (Screenshot 10) */
          <header className="bg-[#15110e] text-white px-5 py-3 border-b border-[#2b221a] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 border border-[#bd9661] rounded-[3px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-sm">
                T
              </div>
              <span className="font-serif text-[17px] font-bold text-white tracking-wide">
                Tap &amp; Toast
              </span>
            </div>
            <div className="text-[11px] font-semibold text-[#bd9661]">
              MC Companion
            </div>
          </header>
        ) : (
          /* Live Console Mode Header (Screenshot 13) */
          <header className="bg-[#15110e] text-white px-3 py-2.5 border-b border-[#2b221a] flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={() => setSelectedWeddingId(null)}
              className="text-xs text-[#dfc194] bg-[#2a2119] border border-[#3d3126] px-2.5 py-1 rounded-md hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
            >
              &larr; All Weddings
            </button>
            <div className="text-center">
              <div className="font-serif text-sm font-bold text-white truncate max-w-[150px]">
                {activeWedding?.couple || 'Sophie & James'}
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#48bb78]">
                LIVE CONSOLE
              </div>
            </div>
            <span className="text-[10px] bg-white text-[#15110e] font-bold px-2 py-0.5 rounded-full">
              {activeWedding?.dateDisplay ? activeWedding.dateDisplay.substring(0, 6) : '14 Nov'}
            </span>
          </header>
        )}

        {/* ============================================================== */}
        {/* SCROLLABLE VIEWPORT                                            */}
        {/* ============================================================== */}
        <div ref={viewportRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar relative flex flex-col">
          
          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 1 - ALL WEDDINGS (Screenshot 10: 172659.png) */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'weddings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h1 className="font-serif text-[20px] font-bold text-[#15110e]">
                    Assigned Weddings
                  </h1>
                  <p className="text-[11px] text-[#8b7b6b]">
                    Select a wedding to enter live run sheet &amp; floor plan
                  </p>
                </div>
                <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  4 Active
                </span>
              </div>

              {/* 4 Assigned Wedding Cards */}
              <div className="space-y-3 pt-1">
                {/* Wedding 1: Sophie & James */}
                <div className="bg-white border border-[#e8ded0] border-l-4 border-l-[#bd9661] rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <h2 className="font-serif text-base font-bold text-[#15110e]">
                      Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
                    </h2>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      Fernwood Estate, Southern Highlands
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ede4] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#15110e]">
                        Date: <strong>2026-11-14</strong>
                      </div>
                      <div className="text-[10px] font-bold uppercase text-[#916c3d] mt-0.5">
                        Executive Lead MC
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenConsole('w_sophie_james')}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Open Console &rarr;
                    </button>
                  </div>
                </div>

                {/* Wedding 2: Aisha & Marcus */}
                <div className="bg-white border border-[#e8ded0] border-l-4 border-l-[#bd9661] rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <h2 className="font-serif text-base font-bold text-[#15110e]">
                      Aisha <span className="text-[#bd9661] italic font-normal">&amp;</span> Marcus
                    </h2>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      Doltone House, Sydney
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ede4] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#15110e]">
                        Date: <strong>2027-05-02</strong>
                      </div>
                      <div className="text-[10px] font-bold uppercase text-[#916c3d] mt-0.5">
                        Executive Lead MC
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenConsole('w_aisha_marcus')}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Open Console &rarr;
                    </button>
                  </div>
                </div>

                {/* Wedding 3: Emma & Tom */}
                <div className="bg-white border border-[#e8ded0] border-l-4 border-l-[#bd9661] rounded-2xl p-4 shadow-sm space-y-3">
                  <div>
                    <h2 className="font-serif text-base font-bold text-[#15110e]">
                      Emma <span className="text-[#bd9661] italic font-normal">&amp;</span> Tom
                    </h2>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      Dunbar House, Watsons Bay
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ede4] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#15110e]">
                        Date: <strong>2027-06-20</strong>
                      </div>
                      <div className="text-[10px] font-bold uppercase text-[#916c3d] mt-0.5">
                        Executive Lead MC
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenConsole('w_emma_tom')}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Open Console &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 2 - CALENDAR (Screenshot 18: 172813.png)     */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'calendar' && (() => {
            const currentYear = calendarDate.getFullYear();
            const currentMonth = calendarDate.getMonth();
            const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
            const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            const getWeddingsForDay = (day: number) => {
              return state.weddings.filter(w => {
                if (!w.date) return false;
                const d = new Date(w.date);
                return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
              });
            };

            const selectedDayWeddings = selectedCalendarDay ? getWeddingsForDay(selectedCalendarDay) : [];

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-8 h-8 rounded-lg border border-[#e8ded0] flex items-center justify-center text-xs hover:bg-[#faf8f5] cursor-pointer transition-colors"
                      title="Previous Month"
                    >
                      &larr;
                    </button>
                    <div className="text-center">
                      <h2 className="font-serif text-base font-bold text-[#15110e]">
                        {monthName}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-lg border border-[#e8ded0] flex items-center justify-center text-xs hover:bg-[#faf8f5] cursor-pointer transition-colors"
                      title="Next Month"
                    >
                      &rarr;
                    </button>
                  </div>

                  {/* Month Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                      <div key={d} className="text-[10px] font-bold text-[#8b7b6b] py-1">
                        {d}
                      </div>
                    ))}

                    {/* Leading Blank Cells */}
                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                      <div key={`blank-${idx}`} className="min-h-[46px] rounded-xl border border-transparent p-1 pointer-events-none" />
                    ))}

                    {/* Days of the Month */}
                    {Array.from({ length: totalDaysInMonth }, (_, i) => i + 1).map((day) => {
                      const dayWeddings = getWeddingsForDay(day);
                      const hasWedding = dayWeddings.length > 0;
                      const isSelected = selectedCalendarDay === day;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedCalendarDay(day)}
                          className={`min-h-[46px] rounded-xl border p-1 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#bd9661] bg-[#faf6f0] ring-2 ring-[#bd9661]/50 shadow-xs'
                              : hasWedding
                              ? 'border-[#bd9661] bg-[#faf8f5] hover:bg-[#faf6f0]'
                              : 'border-[#f0ede4] bg-white hover:border-[#bd9661]/40'
                          }`}
                        >
                          <span className={`text-[11px] ${isSelected ? 'font-bold text-[#bd9661]' : 'font-medium text-[#15110e]'}`}>
                            {day}
                          </span>
                          {hasWedding && (
                            <div className="bg-[#15110e] text-[#dfc194] text-[9px] font-bold px-1 py-0.5 rounded truncate flex items-center gap-0.5 w-full">
                              <span>💍</span> {dayWeddings[0].partner1 || dayWeddings[0].couple.split(' ')[0]}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Day Schedule Details */}
                {selectedCalendarDay !== null && (
                  <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                          Selected Date
                        </div>
                        <h3 className="font-serif text-sm font-bold text-[#15110e]">
                          {new Date(currentYear, currentMonth, selectedCalendarDay).toLocaleDateString('en-US', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </h3>
                      </div>
                      {selectedDayWeddings.length > 0 && (
                        <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {selectedDayWeddings.length} Event{selectedDayWeddings.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {selectedDayWeddings.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedDayWeddings.map((w) => (
                          <div
                            key={w.id}
                            className="p-3 bg-[#faf8f5] border border-[#ebd3a8] rounded-xl space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-sm text-[#15110e] flex items-center gap-1.5">
                                  <span>💍</span> {w.couple}
                                </h4>
                                <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                                  📍 {w.venue}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-[#bd9661] bg-white px-2 py-0.5 rounded border border-[#e8ded0]">
                                {w.timeDisplay || '2:00 PM'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-[#5a4b3d]">
                                👥 {w.invited || 120} Guests &bull; {w.status || 'Finalising'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenConsole(w.id)}
                                className="bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                              >
                                Open Console &rarr;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center space-y-1.5">
                        <div className="text-xl">📅</div>
                        <p className="text-xs text-[#8b7b6b]">No weddings scheduled on this date.</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">Available for new client bookings</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 3 - INVOICE (Screenshot 19: 172822.png)      */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'invoice' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h1 className="font-serif text-[20px] font-bold text-[#15110e]">
                    Invoices &amp; Earnings
                  </h1>
                  <p className="text-[11px] text-[#8b7b6b]">
                    Payment milestones, contracts &amp; receipts
                  </p>
                </div>
                <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  Total: $7,400 AUD
                </span>
              </div>

              {/* Invoices List */}
              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'INV-1081', couple: 'Sophie & James', date: '08 Oct 2026', amount: '$1850 AUD' },
                  { id: 'INV-1082', couple: 'Aisha & Marcus', date: '15 Oct 2026', amount: '$1650 AUD' },
                  { id: 'INV-1083', couple: 'Emma & Tom', date: '01 Nov 2026', amount: '$1950 AUD' },
                  { id: 'INV-1084', couple: 'Katie & Rob', date: '12 Nov 2026', amount: '$1750 AUD' },
                ].map((inv) => (
                  <div key={inv.id} className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 shadow-xs flex items-center justify-between relative">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#15110e]">{inv.couple}</h3>
                      <div className="text-[11px] text-[#8b7b6b] mt-0.5">{inv.id} &bull; {inv.date}</div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-sm text-[#15110e]">{inv.amount}</span>
                      
                      {/* Status Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenInvoiceDropdown(openInvoiceDropdown === inv.id ? null : inv.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-pointer ${
                            invoiceStatuses[inv.id] === 'Paid'
                              ? 'bg-[#e8eee4] text-[#3c6a42] border-[#c9dcc3]'
                              : invoiceStatuses[inv.id] === 'Pending'
                              ? 'bg-[#faf6f0] text-[#916c3d] border-[#ebd3a8]'
                              : 'bg-[#15110e] text-white border-[#3d2e24]'
                          }`}
                        >
                          {invoiceStatuses[inv.id]} &#9662;
                        </button>

                        {openInvoiceDropdown === inv.id && (
                          <div className="absolute right-0 top-6 bg-white border border-[#e8ded0] rounded-xl shadow-lg p-1 z-30 min-w-[90px] flex flex-col gap-1">
                            {(['Paid', 'Pending', 'Draft'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  setInvoiceStatuses({ ...invoiceStatuses, [inv.id]: st });
                                  setOpenInvoiceDropdown(null);
                                  showToast(`Status updated to ${st}`, 'success');
                                }}
                                className={`text-[10px] font-bold px-2 py-1 rounded text-left cursor-pointer hover:bg-[#faf8f5] ${
                                  st === 'Paid' ? 'text-[#3c6a42]' : st === 'Pending' ? 'text-[#916c3d]' : 'text-[#15110e]'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 4 - TEAM (Screenshot 20: 172828.png)         */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'team' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h1 className="font-serif text-[20px] font-bold text-[#15110e]">
                    Event Crew &amp; Team
                  </h1>
                  <p className="text-[11px] text-[#8b7b6b]">
                    MC associates, sound engineers &amp; technicians
                  </p>
                </div>
                <span className="bg-[#e8eee4] text-[#3c6a42] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  3 Active Crew
                </span>
              </div>

              {/* 3 Crew Cards */}
              <div className="space-y-2.5 pt-1">
                {[
                  { name: 'Robert Galati', role: 'Lead Master of Ceremonies' },
                  { name: 'Sarah Jenkins', role: 'On-day Event Coordinator' },
                  { name: 'Dave Miller', role: 'Sound & AV Technician' },
                ].map((crew, idx) => (
                  <div key={idx} className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#15110e]">{crew.name}</h3>
                      <div className="text-xs text-[#8b7b6b] mt-0.5">{crew.role}</div>
                    </div>
                    <span className="bg-[#e8eee4] text-[#3c6a42] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 5 - SETTINGS (Screenshot 21: 172832.png)     */}
          {/* ------------------------------------------------------------ */}
          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB - REFERRALS & DISCOUNTS                      */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'referrals' && (
            <div className="space-y-3.5 pb-2">
              {/* Referrals Header */}
              <div className="flex items-center justify-between pt-1 px-1">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661]">
                    MC Partner Ambassador Hub
                  </div>
                  <h1 className="font-serif text-xl font-bold text-[#15110e]">
                    Referrals &amp; Discounts
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateReferralOpen(true)}
                  className="bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] border border-[#bd9661] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-xs flex items-center gap-1 transition-colors"
                >
                  <span>+</span> New Code
                </button>
              </div>

              {/* Primary Ambassador Code Card */}
              <div className="bg-[#15110e] text-white border border-[#bd9661]/50 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#2a1f16] border border-[#bd9661] text-[#dfc194] text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Primary Partner Code
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active &bull; Verified MC
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-[#8b7b6b] uppercase tracking-wider font-bold">
                    Your Referral Promo Code
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#dfc194] tracking-wider mt-0.5">
                    ROBERT-VIP-15
                  </div>
                </div>

                <div className="bg-[#241a13] border border-[#3d2e23] p-2.5 rounded-xl text-xs text-[#d9c9b8] leading-relaxed">
                  Couples receive <strong className="text-[#dfc194]">15% OFF</strong> platform fee. You earn <strong className="text-emerald-400">$150 AUD</strong> payout per confirmed wedding.
                </div>

                {/* Quick Copy Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('ROBERT-VIP-15');
                      showToast('✓ Code ROBERT-VIP-15 copied!', 'success');
                    }}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2 px-3 rounded-xl text-xs cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    Copy Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('https://tapandtoast.demo/signup?ref=ROBERT-VIP-15');
                      showToast('✓ Signup link copied!', 'success');
                    }}
                    className="bg-[#2a2119] hover:bg-[#3d3126] text-[#dfc194] border border-[#4a3a2d] font-bold py-2 px-3 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    Copy Link
                  </button>
                </div>

                {/* Direct Share Options */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const text = 'Hey! Use my exclusive MC promo code ROBERT-VIP-15 for 15% off your wedding platform on Tap & Toast: https://tapandtoast.demo/signup?ref=ROBERT-VIP-15';
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                      showToast('Opening WhatsApp to share', 'info');
                    }}
                    className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const body = encodeURIComponent('Hi! Here is my 15% discount code for Tap & Toast: ROBERT-VIP-15. Link: https://tapandtoast.demo/signup?ref=ROBERT-VIP-15');
                      window.open(`sms:?&body=${body}`, '_blank');
                      showToast('Opening SMS to share', 'info');
                    }}
                    className="flex-1 bg-white text-[#15110e] font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    SMS Text
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const subject = encodeURIComponent('15% Discount on Tap & Toast Wedding Platform');
                      const body = encodeURIComponent('Hi,\n\nUse my exclusive MC code ROBERT-VIP-15 at checkout to receive 15% off:\nhttps://tapandtoast.demo/signup?ref=ROBERT-VIP-15\n\nCheers,\nRobert Galati');
                      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                      showToast('Opening Email to share', 'info');
                    }}
                    className="flex-1 bg-[#2a2119] border border-[#bd9661]/40 text-[#dfc194] font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    Email
                  </button>
                </div>
              </div>

              {/* QR Code Scan Card */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl border border-[#e8ded0] shadow-xs flex-shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://tapandtoast.demo/signup?ref=ROBERT-VIP-15"
                    alt="Referral QR Code"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">Instant QR Redemption</div>
                  <h3 className="font-serif text-sm font-bold text-[#15110e]">Couple Scan &amp; Save</h3>
                  <p className="text-[10px] text-[#8b7b6b] leading-tight">Couples scan with smartphone camera to apply ROBERT-VIP-15 automatically at sign up.</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('https://tapandtoast.demo/signup?ref=ROBERT-VIP-15');
                      showToast('✓ QR signup link copied to clipboard!', 'success');
                    }}
                    className="text-[10px] font-bold text-[#bd9661] hover:underline pt-1 cursor-pointer block"
                  >
                    Share QR Link &rarr;
                  </button>
                </div>
              </div>

              {/* Mobile Referral Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white border border-[#e8ded0] p-3 rounded-xl">
                  <div className="text-[10px] text-[#8b7b6b] uppercase font-bold">Couples Referred</div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">18 Couples</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">+4 this month</div>
                </div>
                <div className="bg-white border border-[#e8ded0] p-3 rounded-xl">
                  <div className="text-[10px] text-[#8b7b6b] uppercase font-bold">Booked Weddings</div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">12 Booked</div>
                  <div className="text-[10px] text-[#bd9661] font-semibold">66.7% converted</div>
                </div>
                <div className="bg-white border border-[#e8ded0] p-3 rounded-xl">
                  <div className="text-[10px] text-[#8b7b6b] uppercase font-bold">Couples Saved</div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">$2,700 AUD</div>
                  <div className="text-[10px] text-[#8b7b6b]">15% avg discount</div>
                </div>
                <div className="bg-white border border-[#e8ded0] p-3 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#8b7b6b] uppercase font-bold">Total Commission</div>
                    <div className="font-serif text-lg font-bold text-emerald-700 mt-1">$1,800 AUD</div>
                  </div>
                  <span className="text-[9.5px] text-[#8b7b6b]">$600 available</span>
                </div>
              </div>

              {/* Payout Request Button */}
              <button
                type="button"
                onClick={() => showToast('✓ Payout request of $600 AUD submitted to St George Bank (Acc: ****4182)', 'success')}
                className="w-full bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs text-center"
              >
                Request Payout ($600 AUD Available) &rarr;
              </button>

              {/* Active Promo Codes List */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-[#15110e]">Active Promo Codes</h3>
                  <span className="text-[10px] text-[#8b7b6b]">{mobileReferralCodes.length} Codes Active</span>
                </div>
                <div className="space-y-2 text-xs">
                  {mobileReferralCodes.map((item, idx) => (
                    <div key={idx} className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#15110e]">{item.code}</span>
                          <span className="text-[10px] bg-[#bd9661] text-[#15110e] font-bold px-1.5 rounded">{item.discount}</span>
                        </div>
                        <div className="text-[10px] text-[#8b7b6b] mt-0.5">{item.desc} &bull; {item.uses} uses</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(item.code);
                          showToast(`✓ Code ${item.code} copied!`, 'success');
                        }}
                        className="text-[10px] bg-white border border-[#d5c7b5] px-2 py-1 rounded text-[#15110e] font-bold cursor-pointer hover:bg-[#f0ede4]"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referred Couples Ledger */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#15110e]">Referred Couples Ledger</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { couple: 'Sophie & James', date: 'Nov 2026', code: 'ROBERT-VIP-15', status: 'Booked', payout: '$150 Paid' },
                    { couple: 'Aisha & Marcus', date: 'May 2027', code: 'ROBERT-VIP-15', status: 'Booked', payout: '$150 Paid' },
                    { couple: 'Emma & Tom', date: 'Sep 2027', code: 'BRIDALEXPO2027', status: 'Deposit Paid', payout: '$150 Pending' },
                    { couple: 'Liam & Chloe', date: 'Dec 2027', code: 'ROBERT-VIP-15', status: 'Booked', payout: '$150 Paid' },
                    { couple: 'Harrison & Grace', date: 'Feb 2028', code: 'SUMMERLOVE', status: 'Inquiry', payout: 'Pending' },
                  ].map((r, i) => (
                    <div key={i} className="border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#15110e]">{r.couple}</div>
                        <div className="text-[10px] text-[#8b7b6b]">{r.date} &bull; Code: <span className="font-mono">{r.code}</span></div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          r.status === 'Booked' ? 'bg-[#e8eee4] text-[#3c6a42]' : 'bg-[#faf5ed] text-[#bd9661]'
                        }`}>
                          {r.status}
                        </span>
                        <div className="text-[10px] text-[#8b7b6b] mt-0.5">{r.payout}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Create Referral Code Modal */}
          {isCreateReferralOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Create Promo Code</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreateReferralOpen(false)}
                    className="text-gray-400 hover:text-black font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={newReferralCode}
                    onChange={(e) => setNewReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SPRINGLOVE"
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs font-mono font-bold text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">Discount Value</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['15% OFF', '$100 OFF', '10% OFF', '20% OFF'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewReferralDiscount(d)}
                        className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer border transition-colors ${
                          newReferralDiscount === d ? 'bg-[#15110e] text-[#dfc194] border-[#bd9661]' : 'border-[#e8ded0] hover:bg-[#faf8f5]' 
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">Campaign Description</label>
                  <input
                    type="text"
                    value={newReferralDesc}
                    onChange={(e) => setNewReferralDesc(e.target.value)}
                    placeholder="e.g. Spring 2027 VIP couples promotion"
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newReferralCode.trim()) {
                        showToast('Please enter a valid code name', 'error');
                        return;
                      }
                      setMobileReferralCodes([
                        {
                          code: newReferralCode.trim(),
                          discount: newReferralDiscount,
                          desc: newReferralDesc.trim() || 'Custom promo campaign',
                          uses: 0,
                          status: 'Active',
                        },
                        ...mobileReferralCodes,
                      ]);
                      showToast(`✓ Promo code ${newReferralCode} created and activated!`, 'success');
                      setNewReferralCode('');
                      setNewReferralDesc('');
                      setIsCreateReferralOpen(false);
                    }}
                    className="flex-1 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    Create &amp; Activate Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateReferralOpen(false)}
                    className="bg-[#f0ede4] hover:bg-[#e4dfd5] text-[#15110e] font-bold px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 5 - SETTINGS (Screenshot 21: 172832.png)     */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'settings' && (
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3.5">
              {/* Profile Avatar Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-[#f0ede4]">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-[#dfc194] border-2 border-white shadow-sm flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 w-5 h-5 bg-[#15110e] text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer">
                    📷
                  </button>
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-[#15110e]">
                    {profileForm.name}
                  </h2>
                  <div className="text-xs text-[#916c3d] font-semibold">{profileForm.role}</div>
                  <div className="text-[10px] text-[#8b7b6b] mt-0.5">Tap camera icon to change photo</div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Professional Role Title</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Agency / Business Name</label>
                  <input
                    type="text"
                    value={profileForm.agency}
                    onChange={(e) => setProfileForm({ ...profileForm, agency: e.target.value })}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">MC Biography &amp; Description</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Direct Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Direct Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Website / Portfolio</label>
                  <input
                    type="text"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Profile settings saved', 'success')}
                  className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* LIVE CONSOLE MODE: SUB-PANE 1 - RUN SHEET (Screenshot 13)    */}
          {/* ------------------------------------------------------------ */}
          {selectedWeddingId && consoleTab === 'runsheet' && (
            <div className="space-y-3">
              {/* Broadcast Banner */}
              <div className="bg-[#15110e] text-white p-3 rounded-xl flex items-center justify-between text-xs">
                <span>All cues running on schedule &bull; Audio tested</span>
                <button
                  type="button"
                  onClick={() => showToast('Broadcast sent to audio tech', 'info')}
                  className="bg-[#2a2119] border border-[#bd9661] text-[#dfc194] px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer hover:bg-[#3d3126]"
                >
                  Broadcast
                </button>
              </div>

              {/* Filters & Add Cue */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-1 bg-[#f0ede4] p-0.5 rounded-lg text-xs">
                  {(['all', 'upcoming', 'done'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setRunSheetFilter(f)}
                      className={`px-2.5 py-1 rounded-md font-bold capitalize cursor-pointer text-[11px] ${
                        runSheetFilter === f ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newCue = {
                      id: 'c_' + Date.now(),
                      time: '18:00',
                      title: 'Speeches & Toasts commence',
                      desc: 'Introduce Father of the Bride and Maid of Honor',
                      notes: 'Check roving mic battery.',
                      done: false,
                    };
                    setCues([...cues, newCue]);
                    showToast('New stage cue added', 'success');
                  }}
                  className="bg-[#bd9661] text-[#15110e] font-bold text-[11px] px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[#a8824f]"
                >
                  + Add Cue
                </button>
              </div>

              {/* Search Cues Input */}
              <div>
                <input
                  type="text"
                  value={cueSearch}
                  onChange={(e) => setCueSearch(e.target.value)}
                  placeholder="Filter cues, activities, or notes..."
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>

              {/* Cues List */}
              <div className="space-y-2.5">
                {cues
                  .filter(c => {
                    if (runSheetFilter === 'upcoming') return !c.done;
                    if (runSheetFilter === 'done') return c.done;
                    return true;
                  })
                  .filter(c => !cueSearch || c.title.toLowerCase().includes(cueSearch.toLowerCase()) || c.notes.toLowerCase().includes(cueSearch.toLowerCase()))
                  .map((cue, idx) => (
                    <div
                      key={cue.id}
                      className={`bg-white border rounded-2xl p-3 shadow-xs space-y-2 transition-all ${
                        cue.done ? 'border-emerald-200 bg-emerald-50/20 opacity-75' : 'border-[#e8ded0]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={cue.done}
                            onChange={() => toggleCueDone(cue.id)}
                            className="mt-1 accent-[#bd9661] w-4 h-4 cursor-pointer"
                          />
                          <span className="bg-[#faf8f5] border border-[#ebd3a8] text-[#916c3d] font-bold text-xs px-2 py-0.5 rounded-md">
                            {cue.time}
                          </span>
                          <span className="font-bold text-xs text-[#15110e] leading-snug">
                            {cue.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCue(idx, 'up')}
                            className="w-6 h-6 rounded bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-[10px] cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCue(idx, 'down')}
                            className="w-6 h-6 rounded bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-[10px] cursor-pointer"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCue(cue.id)}
                            className="w-6 h-6 rounded bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-[10px] text-red-500 cursor-pointer"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#6b5849] pl-6">
                        {cue.desc}
                      </p>

                      {/* MC Cue Notes Box */}
                      <div className="ml-6 bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2 text-xs">
                        <div className="text-[9px] font-bold uppercase text-[#916c3d] tracking-wider mb-0.5">
                          MC Cue Notes
                        </div>
                        <div className="text-[#15110e] text-[11px]">{cue.notes}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* LIVE CONSOLE MODE: SUB-PANE 2 - SEATING PLANNER (TWO-LEVEL)  */}
          {/* ------------------------------------------------------------ */}
          {selectedWeddingId && consoleTab === 'seating' && (() => {
            const allTables = state.tables || [];
            const allGuests = state.guests || [];
            const confirmedCount = allGuests.filter(g => g.rsvpStatus === 'confirmed').length;

            // Filter guests by search & table shape
            const filteredGuests = allGuests.filter((g) => {
              const matchesSearch = !guestSearch ||
                g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
                (g.dietary && g.dietary.toLowerCase().includes(guestSearch.toLowerCase())) ||
                (g.household && g.household.toLowerCase().includes(guestSearch.toLowerCase()));
              
              if (!matchesSearch) return false;

              if (shapeFilter === 'all') return true;
              const tbl = allTables.find(t => t.id === g.tableId);
              if (!tbl) return false;
              const shape = tbl.shape || (tbl.isHead || tbl.name.toLowerCase().includes('head') ? 'king' : 'round');
              if (shapeFilter === 'king') return shape === 'king';
              return shape === shapeFilter;
            });

            // Filter tables by shape
            const filteredTables = allTables.map(t => ({
              ...t,
              shape: t.shape || (t.isHead || t.name.toLowerCase().includes('head') ? 'king' : 'round'),
            })).filter((t) => {
              if (shapeFilter === 'all') return true;
              if (shapeFilter === 'king') return t.shape === 'king';
              return t.shape === shapeFilter;
            });

            return (
              <div className="space-y-3">
                {/* 3-Way Segment Switcher (Image 1) */}
                <div className="grid grid-cols-3 gap-1 bg-[#f0ede4] p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setSeatingSubTab('guestlist')}
                    className={`py-2 px-1 rounded-lg font-bold text-[11px] text-center cursor-pointer transition-colors ${
                      seatingSubTab === 'guestlist' ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                    }`}
                  >
                    Guest List
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatingSubTab('seatingarr')}
                    className={`py-2 px-1 rounded-lg font-bold text-[11px] text-center cursor-pointer transition-colors ${
                      seatingSubTab === 'seatingarr' ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                    }`}
                  >
                    Seating Arrangement
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatingSubTab('unseated')}
                    className={`py-2 px-1 rounded-lg font-bold text-[11px] text-center cursor-pointer transition-colors ${
                      seatingSubTab === 'unseated' ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                    }`}
                  >
                    Unseated Guests
                  </button>
                </div>

                {/* Search Bar + Shape Filter Dropdown to the right (Request 2) */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder="Search guests by name or dietary..."
                      className="w-full bg-white border border-[#e8ded0] rounded-xl pl-8 pr-2.5 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-2xs"
                    />
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>

                  <select
                    value={shapeFilter}
                    onChange={(e) => setShapeFilter(e.target.value as any)}
                    className="bg-white border border-[#e8ded0] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#15110e] outline-none shadow-2xs shrink-0 cursor-pointer max-w-[130px]"
                    title="Filter tables by shape"
                  >
                    <option value="all">All Tables</option>
                    <option value="round">⚪ Round</option>
                    <option value="rectangular">▯ Rectangle</option>
                    <option value="king">👑 King</option>
                  </select>
                </div>

                {/* Quick Action Toolbar: Cheers AI Assist + Add Table */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunCheersAiSeating('households')}
                    className="flex-1 bg-gradient-to-r from-[#15110e] to-[#2b221a] text-[#dfc194] hover:text-white border border-[#bd9661]/40 rounded-xl py-2 px-3 text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>✨ Cheers AI Assist</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTableModal(true)}
                    className="bg-white hover:bg-[#faf7f2] text-[#916c3d] border border-[#ebd3a8] rounded-xl py-2 px-3 text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1 transition-all shrink-0"
                  >
                    <span>+ Add Table</span>
                  </button>
                </div>

                {/* ============================================================== */}
                {/* SEGMENT 1: GUEST LIST (Matching Image 1)                        */}
                {/* ============================================================== */}
                {seatingSubTab === 'guestlist' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-[#8b7b6b] px-1">
                      <span>Showing {filteredGuests.length} Guests</span>
                      <span className="text-[#3c6a42] font-bold">{confirmedCount} Confirmed RSVPs</span>
                    </div>

                    <div className="space-y-2">
                      {filteredGuests.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[#8b7b6b] bg-white rounded-2xl border border-[#e8ded0] p-4">
                          No guests match the current filters.
                        </div>
                      ) : (
                        filteredGuests.map((g) => {
                          const tbl = allTables.find((t) => t.id === g.tableId);
                          const isHead = tbl?.isHead || tbl?.name?.toLowerCase().includes('head');
                          const tableName = tbl ? tbl.name : (g.tableId ? g.tableId.toUpperCase() : 'Unassigned');

                          return (
                            <div
                              key={g.id}
                              className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-[#bd9661] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-xs flex items-center justify-center shrink-0">
                                  {g.initials || g.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-[#15110e]">{g.name}</div>
                                  <div className="text-[10px] text-[#8b7b6b] mt-0.5">
                                    Individual {g.dietary && g.dietary !== 'None' ? `· ${g.dietary}` : ''}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    isHead
                                      ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]/40'
                                      : tbl
                                      ? 'bg-[#15110e] text-white'
                                      : 'bg-[#faf5ee] text-[#916c3d] border border-[#ebd3a8]'
                                  }`}
                                >
                                  {tableName}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* SEGMENT 2: SEATING ARRANGEMENT (Matching Image 4) */}
                {/* ============================================================== */}
                {seatingSubTab === 'seatingarr' && (
                  <div className="space-y-4">
                    <div className="text-center text-xs text-[#8b7b6b] py-0.5">
                      Scroll down to inspect all tables and seated guests
                    </div>

                    {filteredTables.map((tbl) => {
                      const seatedGuests = allGuests.filter((g) => g.tableId === tbl.id);
                      const isFull = seatedGuests.length >= tbl.capacity;
                      const unassignedGuests = allGuests.filter((g) => !g.tableId && g.rsvpStatus !== 'declined');

                      return (
                        <div key={tbl.id} className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3.5">
                          {/* Table Header matching Image 4 */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-serif text-base font-bold text-[#15110e] uppercase tracking-wide">
                                {tbl.name}
                              </h3>
                              <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                                {tbl.isHead ? 'VIP Head Table • Bridal Party' : `${tbl.category || 'Ballroom'} • ${tbl.capacity} max capacity`}
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                isFull ? 'bg-[#e8eee4] text-[#3c6a42]' : 'bg-[#faf5ed] text-[#916c3d] border border-[#ebd3a8]'
                              }`}
                            >
                              {seatedGuests.length} / {tbl.capacity} Seated
                            </span>
                          </div>

                          <div className="border-t border-[#f5f2eb]" />

                          {/* Visual Table Diagram matching Image 4 */}
                          <div
                            className="rounded-2xl border border-[#e8ded0] bg-[#fbf9f5] p-4 min-h-[220px] flex items-center justify-center relative shadow-inner overflow-hidden"
                            style={{
                              backgroundImage: 'radial-gradient(#d5c7b5 1.2px, transparent 1.2px)',
                              backgroundSize: '16px 16px',
                            }}
                          >
                            {/* ROUND TABLE VISUALIZATION (Image 4) */}
                            {tbl.shape === 'round' && (
                              <div className="relative w-[210px] h-[210px] flex items-center justify-center">
                                {/* Perimeter guide circle */}
                                <div className="absolute inset-2 rounded-full border border-dashed border-[#bd9661]/35 pointer-events-none" />

                                {/* Center table surface with gold ring */}
                                <div className="w-[104px] h-[104px] rounded-full bg-white border-2 border-[#bd9661] shadow-md flex flex-col items-center justify-center text-center z-10 p-2 select-none">
                                  <span className="font-serif text-[11px] font-bold text-[#15110e] line-clamp-1 leading-tight uppercase">
                                    {tbl.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#bd9661] mt-0.5">
                                    {seatedGuests.length} / {tbl.capacity}
                                  </span>
                                </div>

                                {/* Circular Seat Nodes (Initial Avatars) */}
                                {Array.from({ length: tbl.capacity }).map((_, i) => {
                                  const angle = (i / tbl.capacity) * 2 * Math.PI - Math.PI / 2;
                                  const radius = 78;
                                  const x = Math.cos(angle) * radius;
                                  const y = Math.sin(angle) * radius;
                                  const guest = seatedGuests[i];

                                  return (
                                    <div
                                      key={i}
                                      className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs select-none transition-transform hover:scale-110 ${
                                        guest
                                          ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                          : 'bg-white border border-dashed border-[#bd9661]/60 text-[#8b7b6b]'
                                      }`}
                                      style={{
                                        left: `calc(50% + ${x}px - 14px)`,
                                        top: `calc(50% + ${y}px - 14px)`,
                                      }}
                                      title={guest ? `${guest.name} (Seat #${i + 1})` : `Seat #${i + 1} (Empty)`}
                                    >
                                      {guest ? guest.initials || guest.name.slice(0, 2).toUpperCase() : `#${i + 1}`}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* RECTANGULAR TABLE VISUALIZATION */}
                            {tbl.shape === 'rectangular' && (
                              <div className="w-full flex flex-col items-center justify-center gap-2.5 py-1">
                                {/* Top row seats */}
                                <div className="flex justify-center gap-1.5 flex-wrap max-w-full">
                                  {Array.from({ length: Math.ceil(tbl.capacity / 2) }).map((_, i) => {
                                    const guest = seatedGuests[i];
                                    return (
                                      <div
                                        key={i}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shadow-xs select-none ${
                                          guest
                                            ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                            : 'bg-white border border-dashed border-[#bd9661]/60 text-[#8b7b6b]'
                                        }`}
                                        title={guest ? `${guest.name} (Seat #${i + 1})` : `Seat #${i + 1} (Empty)`}
                                      >
                                        {guest ? guest.initials || guest.name.slice(0, 2).toUpperCase() : `#${i + 1}`}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Table Surface */}
                                <div className="w-48 h-12 bg-white border-2 border-[#bd9661] rounded-xl shadow-xs flex flex-col items-center justify-center text-center px-2">
                                  <span className="font-serif text-[11px] font-bold text-[#15110e] uppercase line-clamp-1 leading-tight">
                                    {tbl.name}
                                  </span>
                                  <span className="text-[9.5px] font-bold text-[#bd9661]">
                                    {seatedGuests.length} / {tbl.capacity} &bull; Rectangular
                                  </span>
                                </div>

                                {/* Bottom row seats */}
                                <div className="flex justify-center gap-1.5 flex-wrap max-w-full">
                                  {Array.from({ length: Math.floor(tbl.capacity / 2) }).map((_, idx) => {
                                    const sIdx = Math.ceil(tbl.capacity / 2) + idx;
                                    const guest = seatedGuests[sIdx];
                                    return (
                                      <div
                                        key={sIdx}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shadow-xs select-none ${
                                          guest
                                            ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                            : 'bg-white border border-dashed border-[#bd9661]/60 text-[#8b7b6b]'
                                        }`}
                                        title={guest ? `${guest.name} (Seat #${sIdx + 1})` : `Seat #${sIdx + 1} (Empty)`}
                                      >
                                        {guest ? guest.initials || guest.name.slice(0, 2).toUpperCase() : `#${sIdx + 1}`}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* KING BANQUET TABLE VISUALIZATION */}
                            {tbl.shape === 'king' && (
                              <div className="w-full flex flex-col items-center justify-center gap-2 py-1">
                                {/* Top row seats */}
                                <div className="flex justify-center gap-1 overflow-x-auto max-w-full pb-1 no-scrollbar">
                                  {Array.from({ length: Math.ceil(tbl.capacity / 2) }).map((_, i) => {
                                    const guest = seatedGuests[i];
                                    return (
                                      <div
                                        key={i}
                                        className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[8.5px] font-bold shadow-xs select-none ${
                                          guest
                                            ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                            : 'bg-white border border-dashed border-[#bd9661]/60 text-[#8b7b6b]'
                                        }`}
                                        title={guest ? `${guest.name} (Seat #${i + 1})` : `Seat #${i + 1} (Empty)`}
                                      >
                                        {guest ? guest.initials || guest.name.slice(0, 2).toUpperCase() : `#${i + 1}`}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Royal Banquet Runner */}
                                <div className="w-full max-w-[270px] h-10 rounded-xl bg-gradient-to-r from-[#291f17] via-[#3d2e24] to-[#291f17] border-2 border-[#bd9661] text-white flex flex-col items-center justify-center text-center shadow-md px-2">
                                  <span className="font-serif text-[10.5px] font-bold text-[#dfc194] uppercase tracking-wider line-clamp-1">
                                    👑 {tbl.name}
                                  </span>
                                  <span className="text-[9px] text-[#e8ded0]">
                                    {seatedGuests.length} / {tbl.capacity} Places &bull; Banquet
                                  </span>
                                </div>

                                {/* Bottom row seats */}
                                <div className="flex justify-center gap-1 overflow-x-auto max-w-full pb-1 no-scrollbar">
                                  {Array.from({ length: Math.floor(tbl.capacity / 2) }).map((_, idx) => {
                                    const sIdx = Math.ceil(tbl.capacity / 2) + idx;
                                    const guest = seatedGuests[sIdx];
                                    return (
                                      <div
                                        key={sIdx}
                                        className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[8.5px] font-bold shadow-xs select-none ${
                                          guest
                                            ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                            : 'bg-white border border-dashed border-[#bd9661]/60 text-[#8b7b6b]'
                                        }`}
                                        title={guest ? `${guest.name} (Seat #${sIdx + 1})` : `Seat #${sIdx + 1} (Empty)`}
                                      >
                                        {guest ? guest.initials || guest.name.slice(0, 2).toUpperCase() : `#${sIdx + 1}`}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Seated Guests Section matching Image 4 */}
                          <div className="space-y-2 pt-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                              Seated Guests at {tbl.name}:
                            </div>

                            {seatedGuests.length === 0 ? (
                              <div className="text-center py-3 text-xs text-[#8b7b6b] bg-[#faf8f5] rounded-xl border border-dashed border-[#e8ded0]">
                                No guests currently seated at this table.
                              </div>
                            ) : (
                              seatedGuests.map((item, sIdx) => (
                                <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#f5f2eb] last:border-0">
                                  <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <span className="font-bold text-[#15110e] truncate">
                                      {sIdx + 1}. {item.name}
                                    </span>
                                    {item.dietary && item.dietary !== 'None' && (
                                      <span className="bg-[#fff1f0] text-[#c93b2b] text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                                        {item.dietary}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUnseatGuestMobile(item.id, item.name)}
                                    className="text-[11px] text-[#bd9661] hover:text-[#916c3d] font-semibold border border-[#ebd3a8] hover:border-[#bd9661] bg-[#faf8f5] hover:bg-[#f5ebd8] px-2.5 py-0.5 rounded-lg cursor-pointer transition-colors shrink-0"
                                  >
                                    Unseat
                                  </button>
                                </div>
                              ))
                            )}

                            {/* Quick Seat Guest Row if capacity available and unassigned guests exist */}
                            {!isFull && unassignedGuests.length > 0 && (
                              <div className="pt-2 flex items-center gap-1.5">
                                <select
                                  id={`quick_seat_${tbl.id}`}
                                  className="flex-1 min-w-0 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                                  defaultValue=""
                                >
                                  <option value="" disabled>+ Seat unassigned guest...</option>
                                  {unassignedGuests.map((g) => (
                                    <option key={g.id} value={g.id}>
                                      {g.name} ({g.household || 'General'}{g.dietary && g.dietary !== 'None' ? ` • ${g.dietary}` : ''})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const sel = (document.getElementById(`quick_seat_${tbl.id}`) as HTMLSelectElement)?.value;
                                    if (sel) handleSeatGuestMobile(sel, tbl.id, tbl.name);
                                  }}
                                  className="bg-[#15110e] hover:bg-[#2b221a] text-[#dfc194] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shrink-0 transition-colors"
                                >
                                  + Seat
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ============================================================== */}
                {/* SEGMENT 3: UNSEATED GUESTS                                     */}
                {/* ============================================================== */}
                {seatingSubTab === 'unseated' && (() => {
                  const unseatedList = allGuests.filter(g => !g.tableId && g.rsvpStatus !== 'declined');

                  return (
                    <div className="space-y-3">
                      <div className="bg-[#faf6f0] border border-[#ebd3a8] rounded-2xl p-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#916c3d]">Remaining Guests to Seat</div>
                          <div className="text-[11px] text-[#8b7b6b]">
                            {unseatedList.length} unassigned guests
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Assign unseated guests to available tables
                            let tableIdx = 0;
                            const updated = state.guests.map(g => {
                              if (!g.tableId && g.rsvpStatus !== 'declined' && allTables.length > 0) {
                                const target = allTables[tableIdx % allTables.length];
                                tableIdx++;
                                return { ...g, tableId: target.id, seatIndex: 0 };
                              }
                              return g;
                            });
                            setState({ ...state, guests: updated });
                            showToast('All remaining guests automatically seated across available tables', 'success');
                          }}
                          className="bg-[#bd9661] text-[#15110e] font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#a8824f]"
                        >
                          Seat All
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {unseatedList.length === 0 ? (
                          <div className="text-center py-8 text-xs text-[#3c6a42] font-semibold bg-[#f0f7f1] rounded-2xl border border-emerald-200 p-4">
                            🎉 All guests are successfully seated!
                          </div>
                        ) : (
                          unseatedList.map((g) => (
                            <div key={g.id} className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 shadow-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xs text-[#15110e]">{g.name}</h4>
                                {g.dietary && g.dietary !== 'None' && (
                                  <span className="bg-[#fff1f0] text-[#c93b2b] text-[10px] font-bold px-1.5 py-0.2 rounded">
                                    {g.dietary}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#8b7b6b]">
                                {g.household || 'Individual'}
                              </div>

                              <div className="flex gap-2 pt-1">
                                <select
                                  id={`mc_seat_${g.id}`}
                                  className="flex-1 bg-white border border-[#e8ded0] rounded-lg p-1.5 text-xs text-[#15110e] outline-none"
                                  defaultValue={allTables[0]?.id || ''}
                                >
                                  {allTables.map((t) => {
                                    const seated = allGuests.filter(x => x.tableId === t.id).length;
                                    const free = Math.max(0, t.capacity - seated);
                                    return (
                                      <option key={t.id} value={t.id}>
                                        {t.name} ({t.shape || 'round'} &bull; {free} free)
                                      </option>
                                    );
                                  })}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const sel = (document.getElementById(`mc_seat_${g.id}`) as HTMLSelectElement)?.value;
                                    if (sel) {
                                      const updated = state.guests.map(x => x.id === g.id ? { ...x, tableId: sel, seatIndex: 0 } : x);
                                      setState({ ...state, guests: updated });
                                      const t = allTables.find(tbl => tbl.id === sel);
                                      showToast(`Seated ${g.name} at ${t?.name || 'table'}`, 'success');
                                    }
                                  }}
                                  className="bg-[#bd9661] text-[#15110e] font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#a8824f]"
                                >
                                  Seat
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {selectedWeddingId && consoleTab === 'venue' && (
            <div className="space-y-3">
              {/* Venue Info Card */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      {activeWedding?.venue ? activeWedding.venue.split(',')[0] : 'Fernwood Estate'}
                    </h3>
                    <div className="text-xs text-[#8b7b6b] mt-0.5">
                      {activeWedding?.venueAddress || activeWedding?.venue || 'Fernwood Estate, Southern Highlands'}
                    </div>
                  </div>
                  <span className="bg-[#e8eee4] text-[#3c6a42] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${activeWedding?.venue ? activeWedding.venue.split(',')[0] + ', ' : ''}${activeWedding?.venueAddress || activeWedding?.venue || 'Fernwood Estate, Southern Highlands NSW'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => showToast('✓ Opened Navigation Directions in Google Maps', 'success')}
                  className="w-full bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold py-2 rounded-xl text-xs transition-colors cursor-pointer block text-center shadow-xs"
                >
                  Open Navigation Directions
                </a>
              </div>

              {/* Key Vendor Contacts */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-2.5">
                <h4 className="font-bold text-xs text-[#15110e]">Key On-Site Vendor Contacts</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Sarah Lin', role: 'Venue Manager', phone: '0412 345 678' },
                    { name: 'Chef Marco Rossi', role: 'Catering Lead', phone: '0434 567 890' },
                    { name: 'Dave Miller', role: 'Sound & AV Tech', phone: '0445 678 901' },
                  ].map((c, i) => (
                    <div key={i} className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2.5 flex items-center justify-between">
                      <div>
                        <strong className="text-[#15110e]">{c.name}</strong>
                        <span className="text-[#8b7b6b]"> &bull; {c.role}</span>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="bg-[#bd9661] text-[#15110e] font-bold text-[11px] px-3 py-1 rounded-lg cursor-pointer"
                      >
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* MC Tech & Audio Checklist */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-2.5">
                <h4 className="font-bold text-xs text-[#15110e]">MC Tech &amp; Audio Checklist</h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techChecklist.micA}
                      onChange={(e) => setTechChecklist({ ...techChecklist, micA: e.target.checked })}
                      className="accent-[#bd9661] w-4 h-4"
                    />
                    <span>Wireless Handheld Mic A (Battery 100%)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techChecklist.micB}
                      onChange={(e) => setTechChecklist({ ...techChecklist, micB: e.target.checked })}
                      className="accent-[#bd9661] w-4 h-4"
                    />
                    <span>Wireless Handheld Mic B (Spare)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techChecklist.lapel}
                      onChange={(e) => setTechChecklist({ ...techChecklist, lapel: e.target.checked })}
                      className="accent-[#bd9661] w-4 h-4"
                    />
                    <span>Celebrant Lapel Transceiver</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={techChecklist.uplighting}
                      onChange={(e) => setTechChecklist({ ...techChecklist, uplighting: e.target.checked })}
                      className="accent-[#bd9661] w-4 h-4"
                    />
                    <span>Dancefloor Uplighting &amp; First Dance Cue</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* JOEY CHATBOT FLOATING ACTION BUTTON                            */}
        {/* ============================================================== */}
        <button
          type="button"
          onClick={() => setShowJoey(!showJoey)}
          className="absolute bottom-18 right-4 w-12 h-12 rounded-full bg-[#dfc194] border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform z-30 overflow-hidden p-0"
          title="Ask Joey"
        >
          <img src="/chatbot-avatar.png" alt="Joey AI Assistant" className="w-full h-full object-cover" />
        </button>

        {/* ============================================================== */}
        {/* JOEY MODAL (Screenshots 11 & 22: 172705.png & 172839.png)       */}
        {/* ============================================================== */}
        {showJoey && (
          <div className="absolute inset-x-3 bottom-16 top-16 bg-white rounded-3xl border border-[#d5c7b5] shadow-2xl flex flex-col overflow-hidden z-40 animate-in fade-in zoom-in-95">
            <div className="bg-[#15110e] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#bd9661] flex items-center justify-center flex-shrink-0">
                  <img src="/chatbot-avatar.png" alt="Joey AI Assistant" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Joey</div>
                  <div className="text-[10px] text-[#bd9661]">The Wedding Assistant</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJoey(false)}
                className="text-white hover:text-[#bd9661] text-lg font-bold cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#faf8f5] text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl shadow-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#bd9661] text-[#15110e] font-medium'
                        : 'bg-white text-[#15110e] border border-[#e8ded0]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#8b7b6b] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Pills (Screenshot 11 & 22) */}
            <div className="p-2 bg-white border-t border-[#e8ded0] flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Next cue')}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer"
              >
                Next cue
              </button>
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Head Table')}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer"
              >
                Head Table
              </button>
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Dietary Alerts')}
                className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-full px-2.5 py-1 text-[11px] whitespace-nowrap cursor-pointer shadow-xs"
              >
                Dietary Alerts
              </button>
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Venue Phone')}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer"
              >
                Venue Phone
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                handleJoeyPrompt(chatInput);
                setChatInput('');
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Joey about cues, guests, tables..."
                className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#a8824f]"
              >
                ➤
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOTTOM NAVIGATION: HOME DOCK vs LIVE CONSOLE DOCK              */}
        {/* ============================================================== */}
        {!selectedWeddingId ? (
          /* Home Mode Bottom Dock (5 Tabs matching Screenshot 10, 18-21) */
          <div className="h-[64px] bg-[#15110e] border-t border-[#2b221a] flex items-center justify-around px-1 z-20 flex-shrink-0 text-white">
            <button
              type="button"
              onClick={() => setHomeTab('weddings')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'weddings' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="12" r="5" />
                <circle cx="15" cy="12" r="5" />
              </svg>
              <span className="text-[10px] mt-0.5">All Weddings</span>
            </button>

            <button
              type="button"
              onClick={() => setHomeTab('calendar')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'calendar' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[10px] mt-0.5">Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => setHomeTab('team')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'team' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-[10px] mt-0.5">Team</span>
            </button>

            <button
              type="button"
              onClick={() => setHomeTab('invoice')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'invoice' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="text-[10px] mt-0.5">Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => setHomeTab('referrals')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'referrals' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span className="text-[10px] mt-0.5">Referrals</span>
            </button>
            <button
              type="button"
              onClick={() => setHomeTab('settings')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'settings' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-[10px] mt-0.5">Settings</span>
            </button>
          </div>
        ) : (
          /* Live Console Mode Bottom Dock (5 Tabs matching Screenshot 13) */
          <div className="h-[64px] bg-[#15110e] border-t border-[#2b221a] flex items-center justify-around px-1 z-20 flex-shrink-0 text-white">
            <button
              type="button"
              onClick={() => setConsoleTab('runsheet')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                consoleTab === 'runsheet' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <line x1="9" y1="12" x2="11" y2="12" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
              <span className="text-[10px] mt-0.5">Run Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setConsoleTab('seating')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                consoleTab === 'seating' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
              </svg>
              <span className="text-[10px] mt-0.5">Seating</span>
            </button>

            <button
              type="button"
              onClick={() => setConsoleTab('venue')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                consoleTab === 'venue' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[10px] mt-0.5">Venue</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedWeddingId(null);
                setHomeTab('settings');
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer text-[#8b7b6b] hover:text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[10px] mt-0.5">Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedWeddingId(null)}
              className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer text-[#8b7b6b] hover:text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="text-[10px] mt-0.5">Weddings</span>
            </button>
          </div>
        )}

        {/* MC Mobile Add Table Modal */}
        {showAddTableModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-[340px] w-full space-y-4 shadow-2xl border border-[#e8ded0]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#15110e]">Add New Table</h3>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="text-[#8b7b6b] hover:text-[#15110e] text-lg font-bold p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Table Name / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 9, School Friends..."
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Table Shape
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'round', label: '⚪ Round' },
                      { id: 'rectangular', label: '▯ Rect' },
                      { id: 'king', label: '👑 King' },
                    ].map((shp) => (
                      <button
                        key={shp.id}
                        type="button"
                        onClick={() => setNewTableShape(shp.id as TableShape)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                          newTableShape === shp.id
                            ? 'bg-[#15110e] text-[#dfc194] border-[#15110e]'
                            : 'bg-[#faf8f5] border-[#e8ded0] text-[#8b7b6b]'
                        }`}
                      >
                        {shp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Seating Capacity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTableCapacity(Math.max(2, newTableCapacity - 2))}
                      className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-[#e8ded0] text-[#15110e] font-bold flex items-center justify-center cursor-pointer text-sm"
                    >
                      &minus;
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-sm text-[#15110e]">
                      {newTableCapacity} Seats
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewTableCapacity(Math.min(48, newTableCapacity + 2))}
                      className="w-9 h-9 rounded-xl bg-[#faf8f5] border border-[#e8ded0] text-[#15110e] font-bold flex items-center justify-center cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Category / Group
                  </label>
                  <select
                    value={newTableCategory}
                    onChange={(e) => setNewTableCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Bridal Party">Bridal Party</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#e8ded0] text-xs font-bold text-[#8b7b6b] cursor-pointer hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTableFromMobile}
                  className="flex-1 py-2.5 rounded-xl bg-[#15110e] text-[#dfc194] text-xs font-bold cursor-pointer hover:bg-[#2b221a]"
                >
                  Add Table
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MC Mobile Cheers AI Assist Modal (Enhanced matching Image 1 & 3) */}
        {showCheersAiModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
            <div className="bg-white rounded-3xl p-4 max-w-[340px] w-full space-y-3 shadow-2xl border border-[#ebd3a8] max-h-[92%] flex flex-col">
              <div className="flex items-center justify-between border-b pb-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#15110e]">
                      Cheers AI Seating Recommendation
                    </h3>
                    <div className="text-[10px] text-[#bd9661] font-semibold">{aiProposal?.title || 'Smart Seating'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheersAiModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-base font-bold p-1 cursor-pointer leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Strategy tabs */}
              <div className="grid grid-cols-4 gap-1 bg-[#faf8f5] p-1 rounded-2xl border border-[#ebd3a8] flex-shrink-0">
                {[
                  { id: 'households', label: 'Households', icon: '🏠' },
                  { id: 'vips', label: 'VIP & Head', icon: '👑' },
                  { id: 'dietary', label: 'Dietary', icon: '🥗' },
                  { id: 'fill', label: 'Auto-Fill', icon: '⚡' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleRunCheersAiSeating(st.id as any)}
                    className={`py-1.5 px-0.5 rounded-xl font-bold text-[9.5px] border-0 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      activeAiScenario === st.id
                        ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                        : 'text-[#8b7b6b] hover:text-[#15110e] hover:bg-white'
                    }`}
                  >
                    <span className="text-xs">{st.icon}</span>
                    <span className="truncate max-w-full">{st.label}</span>
                  </button>
                ))}
              </div>

              {/* AI Description & Proposed Allocations list */}
              {aiProposal && (
                <div className="space-y-2 flex-1 overflow-y-auto pr-0.5">
                  <p className="text-[11px] text-[#5a4d41] leading-relaxed">
                    {aiProposal.desc}
                  </p>

                  <div className="bg-[#faf5ee] border border-[#ebd3a8] rounded-2xl p-2.5 space-y-1.5 text-xs">
                    <div className="font-bold text-[#15110e] flex items-center justify-between text-xs">
                      <span>Proposed Allocations</span>
                      <span className="bg-[#bd9661] text-[#15110e] px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {aiProposal.count} Guests
                      </span>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                      {aiProposal.changes.map(({ guestId, tableId }, i) => {
                        const g = (state.guests || []).find((x) => x.id === guestId);
                        const t = (state.tables || []).find((x) => x.id === tableId);
                        return (
                          <div key={i} className="bg-white border border-[#e8ded0] py-1 px-2 rounded-lg flex items-center justify-between text-[10.5px] shadow-2xs">
                            <span className="font-semibold text-[#15110e] truncate max-w-[120px]">{g?.name || 'Guest'}</span>
                            <span className="text-[#8b7b6b] text-[10px]">&rarr;</span>
                            <span className="font-bold text-[#bd9661] truncate max-w-[100px]">{t?.name || 'Table'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[9.5px] text-[#8b7b6b] italic leading-tight flex-shrink-0">
                AI recommendations are suggestions only. You can modify or override any table or seat assignment afterwards.
              </div>

              <div className="flex gap-2 pt-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCheersAiModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#e8ded0] bg-[#faf8f5] hover:bg-[#f0ede4] text-xs font-bold text-[#15110e] cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  disabled={!aiProposal || aiProposal.changes.length === 0}
                  onClick={handleApplyAiProposal}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] text-xs font-bold cursor-pointer hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Apply Recommendations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 bg-[#15110e] flex items-center justify-center pb-1">
          <div className="w-28 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
