import React, { useState, useEffect } from 'react';
import { useAppState, useSession, getWeddingCountdown, formatAUD, showToast } from '../lib/state';
import JoeyChatbot from './JoeyChatbot';
import { Guest } from '../lib/types';

interface CoupleViewProps {
  onSelectView?: (view: string) => void;
}

export default function CoupleView({ onSelectView }: CoupleViewProps) {
  const { state, setState } = useAppState();
  const { clearSession } = useSession();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'guests' | 'seating' | 'pages' | 'invitations' | 'gifts' | 'feed' | 'vault' | 'anniversary' | 'venue' | 'settings'
  >('overview');

  const wedding = state.weddings[0];

  // Overview Countdown
  const [countdown, setCountdown] = useState(getWeddingCountdown('2026-11-14T14:00:00'));
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getWeddingCountdown('2026-11-14T14:00:00'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Overview Tasks
  const [newTaskInput, setNewTaskInput] = useState('');
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = wedding.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, tasks: updatedTasks } : w));
    setState({ ...state, weddings: updatedWeddings });
  };
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: 'task_' + Date.now(),
      text: newTaskInput.trim(),
      completed: false,
      due: 'This week',
    };
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, tasks: [...w.tasks, newTask] } : w));
    setState({ ...state, weddings: updatedWeddings });
    setNewTaskInput('');
    showToast('New planning task added!', 'success');
  };

  // Tab 2: Guest List State & Actions (Screenshot 23)
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'declined' | 'awaiting'>('all');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestHousehold, setNewGuestHousehold] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestDiet, setNewGuestDiet] = useState('');

  const handleRemoveGuest = (guestId: string) => {
    setState({
      ...state,
      guests: state.guests.filter(g => g.id !== guestId),
    });
    showToast('Guest removed from guest list', 'info');
  };

  const handleAddNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const newGuest: Guest = {
      id: 'g_' + Date.now(),
      name: newGuestName.trim(),
      initials: newGuestName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
      household: newGuestHousehold.trim() || newGuestName.trim(),
      email: `${newGuestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newGuestPhone || '0400 000 000',
      rsvpStatus: 'awaiting',
      guestCount: 1,
      partySize: 1,
      dietary: newGuestDiet || 'None',
      tableId: null,
      seatIndex: null,
      reminderSent: false,
    };
    setState({
      ...state,
      guests: [newGuest, ...state.guests],
    });
    setShowAddGuestModal(false);
    setNewGuestName('');
    setNewGuestHousehold('');
    setNewGuestPhone('');
    setNewGuestDiet('');
    showToast(`Added ${newGuest.name} to Guest List`, 'success');
  };

  // Tab 3: Seating State & Actions (Screenshot 24)
  const [seatingViewMode, setSeatingViewMode] = useState<'floor' | 'list'>('floor');
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [tableAssignSelect, setTableAssignSelect] = useState<Record<string, string>>({});
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ type: 'table' | 'seat'; tableId?: string; seatIndex?: number } | null>(null);
  const [isDraggingOverUnassigned, setIsDraggingOverUnassigned] = useState(false);

  const handleGuestDragStart = (e: React.DragEvent, guestId: string, fromTableId?: string, fromSeatIndex?: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ guestId, fromTableId, fromSeatIndex }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedGuestId(guestId);
  };

  const handleGuestDragEnd = () => {
    setDraggedGuestId(null);
    setDragOverTarget(null);
    setIsDraggingOverUnassigned(false);
  };

  const handleDropOnTable = (e: React.DragEvent, targetTableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);

    let data: { guestId: string; fromTableId?: string; fromSeatIndex?: number };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      if (!draggedGuestId) return;
      data = { guestId: draggedGuestId };
    }
    const { guestId } = data;
    if (!guestId) return;

    const targetTbl = targetTableId === 'head'
      ? { id: 'head', name: 'HEAD TABLE', capacity: 8 }
      : state.tables.find(t => t.id === targetTableId || t.name.toLowerCase() === targetTableId.replace('_', ' ').toLowerCase());
    const targetId = targetTbl ? targetTbl.id : targetTableId;
    const targetName = targetTbl ? targetTbl.name : 'Table';

    const seatedGuests = state.guests.filter(g => g.tableId === targetId);
    if (seatedGuests.length >= 8) {
      showToast(`${targetName} is already full (8/8 seats occupied)`, 'error');
      return;
    }

    let firstEmptySeat = -1;
    for (let s = 0; s < 8; s++) {
      if (!seatedGuests.some(g => g.seatIndex === s)) {
        firstEmptySeat = s;
        break;
      }
    }
    if (firstEmptySeat === -1) firstEmptySeat = seatedGuests.length;

    const movingGuest = state.guests.find(g => g.id === guestId);
    const updatedGuests = state.guests.map(g => {
      if (g.id === guestId) {
        return { ...g, tableId: targetId, seatIndex: firstEmptySeat };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    showToast(`Seated ${movingGuest?.name || 'guest'} at ${targetName} (Seat ${firstEmptySeat + 1})!`, 'success');
  };

  const handleDropOnSeat = (e: React.DragEvent, targetTableId: string, targetSeatIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);

    let data: { guestId: string; fromTableId?: string; fromSeatIndex?: number };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      if (!draggedGuestId) return;
      data = { guestId: draggedGuestId };
    }
    const { guestId, fromTableId, fromSeatIndex } = data;
    if (!guestId) return;

    const targetTbl = targetTableId === 'head'
      ? { id: 'head', name: 'HEAD TABLE', capacity: 8 }
      : state.tables.find(t => t.id === targetTableId || t.name.toLowerCase() === targetTableId.replace('_', ' ').toLowerCase());
    const targetId = targetTbl ? targetTbl.id : targetTableId;
    const targetName = targetTbl ? targetTbl.name : 'Table';

    const occupant = state.guests.find(g => g.tableId === targetId && g.seatIndex === targetSeatIndex);
    const movingGuest = state.guests.find(g => g.id === guestId);

    let updatedGuests = [...state.guests];

    if (occupant && occupant.id !== guestId) {
      if (fromTableId && fromSeatIndex !== undefined) {
        updatedGuests = updatedGuests.map(g => {
          if (g.id === guestId) return { ...g, tableId: targetId, seatIndex: targetSeatIndex };
          if (g.id === occupant.id) return { ...g, tableId: fromTableId, seatIndex: fromSeatIndex };
          return g;
        });
        showToast(`Swapped seats between ${movingGuest?.name} and ${occupant.name}`, 'success');
      } else {
        updatedGuests = updatedGuests.map(g => {
          if (g.id === occupant.id) return { ...g, tableId: null, seatIndex: null };
          if (g.id === guestId) return { ...g, tableId: targetId, seatIndex: targetSeatIndex };
          return g;
        });
        showToast(`Seated ${movingGuest?.name} at ${targetName} (Seat ${targetSeatIndex + 1})`, 'success');
      }
    } else {
      updatedGuests = updatedGuests.map(g => {
        if (g.id === guestId) return { ...g, tableId: targetId, seatIndex: targetSeatIndex };
        return g;
      });
      showToast(`Seated ${movingGuest?.name} at ${targetName} (Seat ${targetSeatIndex + 1})`, 'success');
    }

    setState({ ...state, guests: updatedGuests });
  };

  const handleDropOnUnassigned = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverUnassigned(false);
    setDragOverTarget(null);

    let data: { guestId: string };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      if (!draggedGuestId) return;
      data = { guestId: draggedGuestId };
    }
    const { guestId } = data;
    if (!guestId) return;

    const movingGuest = state.guests.find(g => g.id === guestId);
    if (movingGuest && movingGuest.tableId) {
      const updatedGuests = state.guests.map(g => (g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g));
      setState({ ...state, guests: updatedGuests });
      showToast(`Unseated ${movingGuest.name}. Returned to unassigned list.`, 'info');
    }
  };

  const handleSeatDotClick = (tableId: string, seatIndex: number) => {
    const occupant = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
    if (occupant) {
      if (window.confirm(`Unseat ${occupant.name} from this seat?`)) {
        const updatedGuests = state.guests.map(g => (g.id === occupant.id ? { ...g, tableId: null, seatIndex: null } : g));
        setState({ ...state, guests: updatedGuests });
        showToast(`Unseated ${occupant.name}`, 'info');
      }
    } else {
      const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
      if (unassigned.length > 0) {
        const nextGuest = unassigned[0];
        const updatedGuests = state.guests.map(g => (g.id === nextGuest.id ? { ...g, tableId, seatIndex } : g));
        setState({ ...state, guests: updatedGuests });
        showToast(`Seated ${nextGuest.name} at Seat ${seatIndex + 1}!`, 'success');
      } else {
        showToast('All confirmed guests are currently seated.', 'info');
      }
    }
  };

  const handleSuggestSeating = () => {
    const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
    if (unassigned.length === 0) {
      showToast('All confirmed guests are already seated!', 'info');
      return;
    }
    const tableIds = ['head', 'table_1', 'table_2', 'table_3', 'table_4', 'table_5', 'table_6'];
    let currentUnassigned = [...unassigned];
    let updatedGuests = [...state.guests];
    let countAssigned = 0;

    for (const tblId of tableIds) {
      const seated = updatedGuests.filter(g => g.tableId === tblId);
      for (let s = 0; s < 8; s++) {
        if (!seated.some(g => g.seatIndex === s) && currentUnassigned.length > 0) {
          const nextGuest = currentUnassigned.shift()!;
          updatedGuests = updatedGuests.map(g => (g.id === nextGuest.id ? { ...g, tableId: tblId, seatIndex: s } : g));
          countAssigned++;
        }
      }
    }
    setState({ ...state, guests: updatedGuests });
    showToast(`✨ AI Seating: Optimally seated ${countAssigned} guests!`, 'success');
  };

  const handleAddTable = () => {
    const currentTableCount = state.tables.filter(t => !t.isHead).length;
    const newNum = currentTableCount + 1;
    const newTable = {
      id: 'table_' + newNum,
      name: 'Table ' + newNum,
      capacity: 8,
      isHead: false,
    };
    setState({ ...state, tables: [...state.tables, newTable] });
    showToast(`Added Table ${newNum} to ballroom floor plan`, 'success');
  };

  // Tab 4: Content & Stories State (Screenshot 25)
  const [contentSubTab, setContentSubTab] = useState<'ourStory' | 'inMemoriam' | 'diningMenu' | 'meetTheTeam' | 'honeymoonUpdates'>('ourStory');
  const [contentPages, setContentPages] = useState({
    ourStory: {
      title: 'Our Story',
      subtitle: 'From a chance encounter in Bowral to forever in the Southern Highlands',
      content: 'We met on a rainy autumn afternoon in Bowral at a small corner bookstore. Five years, countless road trips, and one unforgettable sunset in Queenstown later, here we are celebrating our wedding with all the people who mean the most to us.',
      caption: 'Bowral Autumn 2021',
      icon: '💍',
      status: 'Published',
    },
    inMemoriam: {
      title: 'In Loving Memory',
      subtitle: 'Honoring loved ones who are forever present in our hearts today',
      content: 'Though you cannot sit with us today, your love, guidance, and warmth surround every celebration and smile in this room. We dedicate this ceremony to Grandma Helen and Uncle Robert.',
      caption: 'Grandma Helen & Uncle Robert',
      icon: '🕊️',
      status: 'Published',
    },
    diningMenu: {
      title: 'Wedding Feast & Menu',
      subtitle: 'Three-course seasonal estate dining crafted by Chef Marco Rossi',
      content: 'Entrée: Seared Southern Highlands scallops or heirloom burrata.\nMain: Slow-roasted grass-fed beef tenderloin or wild mushroom truffle risotto.\nDessert: Dark chocolate flourless ganache or lemon myrtle panna cotta.',
      caption: 'Chef Marco Rossi Seasonal Menu',
      icon: '🍽️',
      status: 'Published',
    },
    meetTheTeam: {
      title: 'The Bridal Party & Crew',
      subtitle: 'Meet our lifelong friends, best men, and maid of honor',
      content: 'Maid of Honor: Hannah Martin\nBest Man: Oliver Vance\nBridesmaids: Charlotte Evans, Grace Turner\nGroomsmen: Liam Fletcher, Benjamin Ross',
      caption: 'The Bridal Party',
      icon: '👥',
      status: 'Published',
    },
    honeymoonUpdates: {
      title: 'Honeymoon in Queenstown',
      subtitle: 'Our upcoming alpine adventure across New Zealand South Island',
      content: 'Following our wedding, we are heading to Lake Wakatipu, Milford Sound, and Central Otago wineries for two weeks of crisp mountain air, hiking, and celebrating our new beginning!',
      caption: 'Lake Wakatipu & Remarkables',
      icon: '✈️',
      status: 'Draft',
    },
  });

  // Tab 5: Invitations State (Screenshot 26)
  const [selectedQaRdPalette, setSelectedQaRdPalette] = useState<'obsidian' | 'champagne' | 'merlot' | 'sage'>('obsidian');
  const [selectedQaRdHousehold, setSelectedQaRdHousehold] = useState<string>('Priya Sharma (The Sharma Family)');

  // Tab 6: Gift & Thank-You State (Screenshot 27)
  const [giftSubTab, setGiftSubTab] = useState<'registry' | 'thankyou'>('registry');
  const [showManualGiftModal, setShowManualGiftModal] = useState(false);
  const [manualGiftFrom, setManualGiftFrom] = useState('');
  const [manualGiftAmount, setManualGiftAmount] = useState('');
  const [manualGiftMessage, setManualGiftMessage] = useState('');

  interface CoupleGiftItem {
    id: string;
    from: string;
    amount: string;
    amountNum: number;
    date: string;
    msg: string;
    status: 'Sent' | 'Due' | 'Drafted' | 'Completed';
    noteDraft?: string;
  }

  const [coupleGifts, setCoupleGifts] = useState<CoupleGiftItem[]>([
    { id: 'cg1', from: 'The Whitfield family', amount: '$250', amountNum: 250, date: 'Today', msg: '"Wishing you both a lifetime of love and happiness!"', status: 'Sent', noteDraft: 'Dear The Whitfield family, thank you so much for your generous gift of $250! It means the world to have your love and support.' },
    { id: 'cg2', from: 'Sarah & Michael Chen', amount: '$300', amountNum: 300, date: 'Yesterday', msg: '"So thrilled for you Sophie and James!"', status: 'Due', noteDraft: 'Dear Sarah & Michael, thank you both for celebrating our special day and for your wonderful gift of $300!' },
    { id: 'cg3', from: 'Aunty Carol & Uncle Peter', amount: '$500', amountNum: 500, date: '2 days ago', msg: '"With all our love and blessings on your special day."', status: 'Due', noteDraft: 'Dear Aunty Carol & Uncle Peter, your blessings and generous gift of $500 touched our hearts deeply.' },
    { id: 'cg4', from: 'Emma & David Wilson', amount: '$200', amountNum: 200, date: '3 days ago', msg: '"Congratulations to the wonderful couple!"', status: 'Due', noteDraft: 'Dear Emma & David, thank you so much for traveling down to Mittagong and for your kind gift of $200.' },
    { id: 'cg5', from: 'Marcus & Olivia Vance', amount: '$350', amountNum: 350, date: '4 days ago', msg: '"Enjoy every second of the celebration!"', status: 'Due', noteDraft: 'Dear Marcus & Olivia, thank you for your radiant energy and generous gift of $350!' },
  ]);

  const [selectedGiftForThankYou, setSelectedGiftForThankYou] = useState<CoupleGiftItem | null>(null);
  const [thankYouNoteDraft, setThankYouNoteDraft] = useState('');
  const [thankYouStatusChoice, setThankYouStatusChoice] = useState<'Sent' | 'Due' | 'Drafted' | 'Completed'>('Due');

  // Tab 7: Celebration Feed State (Screenshot 28)
  const [officialNoteText, setOfficialNoteText] = useState('');
  interface FeedPost {
    id: string;
    title: string;
    time: string;
    tag?: string;
    quote?: string;
    likes: number;
    comments: number;
    expanded?: boolean;
    pinned?: boolean;
    replies?: Array<{ author: string; text: string; time: string }>;
  }
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 'fp1',
      title: 'Thank You, The Whitfield family!',
      time: 'Just now',
      tag: 'Digital Thank-You Card sent for $250 wishing well gift',
      quote: 'Dear The Whitfield family, thank you so much for your wonderful and generous gift of $250! It means the world to have your love and support as we begin our new chapter together. Love, Sophie & James.',
      likes: 3,
      comments: 0,
      expanded: true,
      replies: [],
    },
    {
      id: 'fp2',
      title: '50 guests confirmed',
      time: 'Just now',
      pinned: true,
      tag: "You've hit the halfway mark on RSVPs",
      likes: 24,
      comments: 0,
      expanded: false,
      replies: [],
    },
    {
      id: 'fp3',
      title: 'Aunty Carol left a note',
      time: '2 minutes ago',
      quote: "So excited for you both — can't wait to celebrate! 💕",
      likes: 5,
      comments: 1,
      expanded: false,
      replies: [
        { author: 'Sophie & James', text: 'Thank you Aunty Carol! Counting down the days to see you! 💕', time: 'Just now' },
      ],
    },
    {
      id: 'fp4',
      title: 'The Whitfield family sent a gift',
      time: '38 minutes ago',
      tag: '$250 AUD Wishing Well Contribution',
      likes: 8,
      comments: 0,
      expanded: false,
      replies: [],
    },
    {
      id: 'fp5',
      title: 'Michael Chen confirmed',
      time: '1 hour ago',
      tag: 'Attending (2 guests · Vegetarian)',
      likes: 12,
      comments: 0,
      expanded: false,
      replies: [],
    },
  ]);

  const [replyingPost, setReplyingPost] = useState<FeedPost | null>(null);
  const [replyText, setReplyText] = useState('');

  // Tab 8: Vault State (Screenshot 29)
  const [vaultPermission, setVaultPermission] = useState('couple_mc');

  // Tab 9: Anniversary State (Screenshots 30-32)
  const [anniversaryMode, setAnniversaryMode] = useState<'countdown' | 'preview'>('countdown');
  const [reflectionsInput, setReflectionsInput] = useState('Year one has flown by! We survived home renovations and our dream trip to New Zealand.');

  // Memory Pop-up Modal State
  interface WeddingMemory {
    id: string;
    title: string;
    desc: string;
    icon: string;
    type: 'gallery' | 'notes' | 'music' | 'vows' | 'toasts' | 'seating';
  }
  const [selectedMemory, setSelectedMemory] = useState<WeddingMemory | null>(null);

  // Tab 11: Settings State (Screenshot 34)
  const [weddingSettings, setWeddingSettings] = useState({
    partner1: 'Sophie',
    partner2: 'James',
    dateTime: '14-11-2026 14:00',
    receptionTime: '16:00',
    dressCode: 'Black Tie Optional / Formal Elegance',
    weddingHashtag: '#SophieAndJames2026',
    themeColor: 'merlot',
    venueName: 'Fernwood Estate, Southern Highlands',
    venueAddress: '124 Range Road, Mittagong NSW 2575',
    parkingInstructions: 'Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.',
    valetInstructions: 'Attendants stationed at the porte-cochère from 1:15 PM.',
    shuttleSchedule: '1:15 PM Bowral Grand Hotel, 1:30 PM Milton Park Country House.',
    weatherContingency: 'Ceremony moves to Glasshouse Orangery if rain probability exceeds 40%.',
    enableDigitalGifts: true,
    enableJoeyAI: true,
    enableCelebrationFeed: true,
    enableSongRequests: true,
    enableGuestPhotos: true,
    smsAlertsOnRsvp: true,
    dailyGiftDigest: true,
    hideSeatingUntilMorning: false,
  });

  // Filtered guests for list
  const filteredGuests = state.guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.household.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.dietary.toLowerCase().includes(guestSearch.toLowerCase());
    const matchFilter = guestFilter === 'all' || g.rsvpStatus === guestFilter;
    return matchSearch && matchFilter;
  });

  const confirmedCount = state.guests.filter(g => g.rsvpStatus === 'confirmed').length;
  const awaitingCount = state.guests.filter(g => g.rsvpStatus === 'awaiting').length;
  const totalGifts = state.gifts.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const thankYousDue = state.gifts.filter(g => g.thankYouStatus !== 'Completed' && g.thankYouStatus !== 'Sent').length;

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* 11-Item Dark Sidebar matching Screenshot 5, 23-34 & couple.html */}
      <aside className="w-full md:w-[240px] bg-[#15110e] text-[#d9c9b8] flex flex-col justify-between border-r border-[#29211a] flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 pb-4 flex items-center gap-2.5 border-b border-[#231b14]">
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
                id: 'overview',
                label: 'Overview',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                ),
              },
              {
                id: 'guests',
                label: 'Guest List',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                id: 'seating',
                label: 'Seating',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                id: 'pages',
                label: 'Content & Stories',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="4" y1="9" x2="20" y2="9" />
                  </svg>
                ),
              },
              {
                id: 'invitations',
                label: 'Invitations',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22 6 12 13 2 6" />
                  </svg>
                ),
              },
              {
                id: 'gifts',
                label: 'Gift & Thank-You',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                ),
              },
              {
                id: 'feed',
                label: 'Celebration Feed',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                id: 'vault',
                label: 'Wedding Vault',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
              },
              {
                id: 'anniversary',
                label: '1st Anniversary',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
              },
              {
                id: 'venue',
                label: 'Venue & Travel',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#291f17] text-[#dfc194] border-l-3 border-l-[#bd9661]'
                      : 'text-[#d9c9b8] hover:bg-[#1e1713] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 flex items-center justify-center text-[#bd9661]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#231b14] flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8b7b6b]">Signed in as</div>
            <div className="font-serif font-bold text-white text-sm">Sophie &amp; James</div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession();
              if (onSelectView) onSelectView('login');
              showToast('Signed out of couple dashboard', 'info');
            }}
            className="text-[11px] text-[#bd9661] hover:underline cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[1300px]">
        
        {/* ================================================================ */}
        {/* TAB 1: OVERVIEW (Screenshot 5)                                   */}
        {/* ================================================================ */}
        {activeTab === 'overview' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  YOUR WEDDING
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
                  Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
                </h1>
              </div>
              <div className="bg-[#15110e] text-[#dfc194] px-4 py-2 rounded-full font-bold text-xs tracking-wider shadow-sm">
                {countdown.days} DAYS : {countdown.hours} HRS : {countdown.minutes} MINS : {countdown.seconds} SECS REMAINING
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Total RSVPs Confirmed</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">45 of 118</div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">42.4% confirmation rate</div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Wishing Well Gifts</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">$4,850</div>
                <div className="text-xs text-[#bd9661] font-semibold mt-1">12 guest gifts received</div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Seated Guests</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">29 / 118</div>
                <div className="text-xs text-[#8b7b6b] font-semibold mt-1">6 active ballroom tables</div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Thank-Yous Due</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">8 Due</div>
                <div className="text-xs text-[#916c3d] font-semibold mt-1">Dispatched automatically</div>
              </div>
            </div>

            {/* RSVP Progress Bar Card */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-[#15110e]">RSVP Response Status</span>
                <span className="text-xs text-[#8b7b6b]">{confirmedCount} Confirmed &bull; {awaitingCount} Awaiting &bull; 8 Declined</span>
              </div>
              <div className="w-full h-3 bg-[#ede5d8] rounded-full overflow-hidden flex">
                <div style={{ width: `${(confirmedCount / 118) * 100}%` }} className="bg-[#3c6a42]" title="Confirmed" />
                <div style={{ width: `${(awaitingCount / 118) * 100}%` }} className="bg-[#bd9661]" title="Awaiting" />
                <div style={{ width: '6.8%' }} className="bg-[#a8382c]" title="Declined" />
              </div>
            </div>

            {/* Checklist & Activity Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Checklist */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#15110e]">This Week's Checklist</h3>
                <div className="space-y-2.5">
                  {wedding.tasks.map((t) => (
                    <label key={t.id} className="flex items-center gap-3 text-xs text-[#15110e] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleToggleTask(t.id)}
                        className="accent-[#bd9661] w-4 h-4 cursor-pointer"
                      />
                      <span className={t.completed ? 'line-through text-[#8b7b6b]' : 'font-medium'}>
                        {t.text}
                      </span>
                    </label>
                  ))}
                </div>
                <form onSubmit={handleAddTask} className="flex gap-2 pt-2 border-t border-[#f0ede4]">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Add a new wedding task..."
                    className="flex-1 bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#bd9661]"
                  />
                  <button type="submit" className="bg-[#bd9661] text-[#15110e] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                    Add Task
                  </button>
                </form>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#15110e]">Recent Activity</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { text: 'Priya Sharma updated dietary requirements to Vegetarian', time: '10 mins ago' },
                    { text: 'The Whitfield family sent $250 AUD to Wishing Well', time: '38 mins ago' },
                    { text: 'Robert Galati synced 14:00 ceremony cue sheet', time: '1 hour ago' },
                    { text: 'Michael Chen confirmed RSVP attendance', time: '2 hours ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-[#f5f2eb]">
                      <span className="text-[#bd9661] font-bold">&bull;</span>
                      <div>
                        <div className="text-[#15110e]">{act.text}</div>
                        <div className="text-[10px] text-[#8b7b6b] mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 2: GUEST LIST (Screenshot 23: 172854.png)                     */}
        {/* ================================================================ */}
        {activeTab === 'guests' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  ATTENDEE MANAGEMENT
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Guest List
                </h1>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => showToast('Guest list exported to CSV', 'success')}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>📊</span> Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(true)}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-xs"
                >
                  + Add Guest
                </button>
                <button
                  type="button"
                  onClick={() => showToast('RSVP reminders dispatched to 22 awaiting guests', 'success')}
                  className="bg-[#15110e] hover:bg-[#231c17] text-white font-bold px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>✉</span> Send Reminder (22)
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="flex-1 max-w-[280px] bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
                <select
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value as any)}
                  className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none"
                >
                  <option value="all">All RSVP Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="awaiting">Awaiting</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                      <th className="py-2.5 px-3">GUEST / HOUSEHOLD</th>
                      <th className="py-2.5 px-3">CONTACT</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">PARTY</th>
                      <th className="py-2.5 px-3">DIETARY</th>
                      <th className="py-2.5 px-3">TABLE</th>
                      <th className="py-2.5 px-3">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede4]">
                    {filteredGuests.map((g) => (
                      <tr key={g.id} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="py-3 px-3">
                          <strong className="text-sm text-[#15110e] block">{g.name}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{g.household}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[#15110e] font-medium">{g.phone || '0412 884 992'}</div>
                          <div className="text-[11px] text-[#8b7b6b]">{g.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            g.rsvpStatus === 'confirmed' ? 'bg-[#e8eee4] text-[#3c6a42]' : g.rsvpStatus === 'declined' ? 'bg-[#fbeae8] text-[#a8382c]' : 'bg-[#faf6f0] text-[#916c3d]'
                          }`}>
                            {g.rsvpStatus === 'confirmed' ? 'Confirmed' : g.rsvpStatus === 'declined' ? 'Declined' : 'Awaiting'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#15110e]">
                          {g.partySize || 1}
                        </td>
                        <td className="py-3 px-3">
                          {g.dietary && g.dietary !== 'None' ? (
                            <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] text-[10px] font-bold px-2 py-0.5 rounded">
                              {g.dietary}
                            </span>
                          ) : (
                            <span className="text-[#8b7b6b]">None</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#15110e]">
                          {g.tableId ? g.tableId.toUpperCase().replace('_', ' ') : 'Unassigned'}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveGuest(g.id)}
                            className="text-[#a8382c] hover:bg-[#fbeae8] px-2.5 py-1 rounded border border-[#f2a89f] text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Add Guest */}
            {showAddGuestModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">Add Wedding Guest</h3>
                    <button type="button" onClick={() => setShowAddGuestModal(false)} className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer">&times;</button>
                  </div>
                  <form onSubmit={handleAddNewGuest} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Guest Full Name</label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Household / Family Group</label>
                      <input
                        type="text"
                        value={newGuestHousehold}
                        onChange={(e) => setNewGuestHousehold(e.target.value)}
                        placeholder="e.g. The Sharma Family"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Mobile Phone (for QaRd)</label>
                      <input
                        type="text"
                        value={newGuestPhone}
                        onChange={(e) => setNewGuestPhone(e.target.value)}
                        placeholder="0412 884 992"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Dietary Requirements</label>
                      <input
                        type="text"
                        value={newGuestDiet}
                        onChange={(e) => setNewGuestDiet(e.target.value)}
                        placeholder="e.g. Vegetarian, Gluten-free"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                      <button type="button" onClick={() => setShowAddGuestModal(false)} className="px-3 py-1.5 rounded-lg border text-[#8b7b6b] hover:bg-gray-50">Cancel</button>
                      <button type="submit" className="bg-[#bd9661] text-[#15110e] font-bold px-4 py-1.5 rounded-lg">Save Guest</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 3: SEATING (Screenshot 24: 172903.png)                        */}
        {/* ================================================================ */}
        {activeTab === 'seating' && (
          <section className="space-y-4">
            {/* Toolbar */}
            <div className="bg-[#15110e] text-white p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="font-serif text-base font-bold">Seating &mdash; Sophie &amp; James</span>
                <div className="bg-[#291f17] p-1 rounded-lg flex gap-1">
                  <button
                    type="button"
                    onClick={() => setSeatingViewMode('floor')}
                    className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                      seatingViewMode === 'floor' ? 'bg-[#bd9661] text-[#15110e]' : 'text-[#dfc194]'
                    }`}
                  >
                    Floor plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatingViewMode('list')}
                    className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                      seatingViewMode === 'list' ? 'bg-[#bd9661] text-[#15110e]' : 'text-[#dfc194]'
                    }`}
                  >
                    List view
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSuggestSeating}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                >
                  ✨ Suggest seating
                </button>
                <button
                  type="button"
                  onClick={handleAddTable}
                  className="bg-white hover:bg-[#faf8f5] text-[#15110e] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                >
                  + Add table
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Seating assignments saved to live floor plan', 'success')}
                  className="bg-[#2a2119] border border-[#bd9661] hover:bg-[#382b21] text-[#dfc194] font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {seatingViewMode === 'floor' ? (
              /* Floor Plan Canvas & Unassigned Panel */
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Floor Canvas with Dotted Grid */}
                <div
                  className="lg:col-span-3 bg-[#faf8f5] border border-[#e8ded0] rounded-2xl p-6 min-h-[560px] relative flex flex-col items-center shadow-inner overflow-hidden"
                  style={{
                    backgroundImage: 'radial-gradient(#d5c7b5 1.2px, transparent 1.2px)',
                    backgroundSize: '20px 20px',
                  }}
                >
                  {/* Instructions banner */}
                  <div className="text-[11px] text-[#8b7b6b] mb-4 bg-white/80 backdrop-blur-xs border border-[#e8ded0] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span>💡 Drag unassigned guests onto tables/seats. Drag seated dots to swap or back to list to unseat.</span>
                  </div>

                  {/* HEAD TABLE · 8 SEATS Banner */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverTarget({ type: 'table', tableId: 'head' });
                    }}
                    onDragLeave={() => setDragOverTarget(null)}
                    onDrop={(e) => handleDropOnTable(e, 'head')}
                    className={`bg-[#15110e] text-white px-6 py-2.5 rounded-xl border transition-all shadow-md flex flex-col items-center mb-8 ${
                      dragOverTarget?.type === 'table' && dragOverTarget?.tableId === 'head'
                        ? 'border-[#bd9661] ring-2 ring-[#bd9661] scale-105'
                        : 'border-[#3d2e24]'
                    }`}
                  >
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#dfc194] mb-1.5 flex items-center gap-2">
                      <span>HEAD TABLE &bull; 8 SEATS</span>
                      <span className="text-[9px] text-[#bd9661]">
                        ({state.guests.filter((g) => g.tableId === 'head').length} / 8)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: 8 }).map((_, sIdx) => {
                        const occupant = state.guests.find((g) => g.tableId === 'head' && g.seatIndex === sIdx);
                        const isSeatTarget =
                          dragOverTarget?.type === 'seat' &&
                          dragOverTarget?.tableId === 'head' &&
                          dragOverTarget?.seatIndex === sIdx;

                        return (
                          <div
                            key={sIdx}
                            draggable={!!occupant}
                            onDragStart={(e) => occupant && handleGuestDragStart(e, occupant.id, 'head', sIdx)}
                            onDragEnd={handleGuestDragEnd}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDragOverTarget({ type: 'seat', tableId: 'head', seatIndex: sIdx });
                            }}
                            onDragLeave={() => setDragOverTarget(null)}
                            onDrop={(e) => handleDropOnSeat(e, 'head', sIdx)}
                            onClick={() => handleSeatDotClick('head', sIdx)}
                            title={
                              occupant
                                ? `${occupant.name} (${occupant.dietary && occupant.dietary !== 'None' ? occupant.dietary : 'No dietary'}) · Click to unseat or drag`
                                : `Head Table Seat ${sIdx + 1} (Empty - drop guest here)`
                            }
                            className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all select-none ${
                              occupant
                                ? 'bg-[#291f17] border border-[#bd9661] text-[#dfc194] cursor-grab active:cursor-grabbing hover:scale-110 shadow-xs'
                                : isSeatTarget
                                ? 'bg-[#bd9661] text-[#15110e] border-2 border-white scale-110'
                                : 'border border-dashed border-[#bd9661]/60 text-[#bd9661]/70 hover:border-[#bd9661] hover:bg-[#bd9661]/10 cursor-pointer'
                            }`}
                          >
                            {occupant
                              ? occupant.initials ||
                                occupant.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()
                              : '+'}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ballroom Tables Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-12 w-full max-w-[720px] my-auto">
                    {state.tables
                      .filter((t) => !t.isHead)
                      .map((tbl) => {
                        const seatedGuests = state.guests.filter((g) => g.tableId === tbl.id);
                        const isTableTarget = dragOverTarget?.type === 'table' && dragOverTarget?.tableId === tbl.id;

                        return (
                          <div
                            key={tbl.id}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverTarget({ type: 'table', tableId: tbl.id });
                            }}
                            onDragLeave={() => setDragOverTarget(null)}
                            onDrop={(e) => handleDropOnTable(e, tbl.id)}
                            className={`relative w-[150px] h-[150px] mx-auto flex items-center justify-center transition-transform ${
                              isTableTarget ? 'scale-105' : ''
                            }`}
                          >
                            {/* Outer Seat Ring */}
                            <div
                              className={`absolute inset-0 rounded-full border transition-colors ${
                                isTableTarget
                                  ? 'border-[#bd9661] border-2 bg-[#bd9661]/10'
                                  : 'border-dashed border-[#bd9661]/50'
                              }`}
                            />

                            {/* Center Table Circle */}
                            <div className="w-[82px] h-[82px] rounded-full bg-white border border-[#bd9661] shadow-xs flex flex-col items-center justify-center text-center z-10 pointer-events-none select-none">
                              <span className="font-serif text-xs font-bold text-[#15110e]">{tbl.name}</span>
                              <span className="text-[10px] font-semibold text-[#8b7b6b]">
                                {seatedGuests.length} / {tbl.capacity || 8}
                              </span>
                            </div>

                            {/* 8 Seat Circles */}
                            {Array.from({ length: tbl.capacity || 8 }).map((_, sIdx) => {
                              const occupant = state.guests.find(
                                (g) => g.tableId === tbl.id && g.seatIndex === sIdx
                              );
                              const angle = sIdx * (360 / (tbl.capacity || 8));
                              const radius = 62;
                              const rad = ((angle - 90) * Math.PI) / 180;
                              const x = radius * Math.cos(rad);
                              const y = radius * Math.sin(rad);
                              const isSeatTarget =
                                dragOverTarget?.type === 'seat' &&
                                dragOverTarget?.tableId === tbl.id &&
                                dragOverTarget?.seatIndex === sIdx;

                              return (
                                <div
                                  key={sIdx}
                                  draggable={!!occupant}
                                  onDragStart={(e) => occupant && handleGuestDragStart(e, occupant.id, tbl.id, sIdx)}
                                  onDragEnd={handleGuestDragEnd}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragOverTarget({ type: 'seat', tableId: tbl.id, seatIndex: sIdx });
                                  }}
                                  onDragLeave={() => setDragOverTarget(null)}
                                  onDrop={(e) => handleDropOnSeat(e, tbl.id, sIdx)}
                                  onClick={() => handleSeatDotClick(tbl.id, sIdx)}
                                  title={
                                    occupant
                                      ? `${occupant.name} (${
                                          occupant.dietary && occupant.dietary !== 'None' ? occupant.dietary : 'Standard'
                                        }) · Drag to move or click to unseat`
                                      : `${tbl.name} Seat ${sIdx + 1} (Empty - drop guest here)`
                                  }
                                  style={{ transform: `translate(${x}px, ${y}px)` }}
                                  className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-2xs z-20 transition-all select-none ${
                                    occupant
                                      ? 'bg-[#15110e] text-[#dfc194] border border-[#3d2e24] cursor-grab active:cursor-grabbing hover:scale-125'
                                      : isSeatTarget
                                      ? 'bg-[#bd9661] text-white border-2 border-white scale-125'
                                      : 'border border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf6f0] cursor-pointer'
                                  }`}
                                >
                                  {occupant
                                    ? occupant.initials ||
                                      occupant.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()
                                    : '+'}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right Panel: Unassigned Guests (Drop Zone) */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOverUnassigned(true);
                  }}
                  onDragLeave={() => setIsDraggingOverUnassigned(false)}
                  onDrop={handleDropOnUnassigned}
                  className={`bg-white border transition-colors rounded-2xl p-4 shadow-sm flex flex-col h-[560px] ${
                    isDraggingOverUnassigned ? 'border-2 border-dashed border-[#bd9661] bg-[#faf6f0]' : 'border-[#e8ded0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Unassigned guests</h3>
                    {isDraggingOverUnassigned && (
                      <span className="text-[10px] text-[#bd9661] font-bold animate-pulse">Drop to unseat</span>
                    )}
                  </div>
                  <div className="text-xs text-[#8b7b6b] mb-3">
                    {state.guests.filter((g) => g.rsvpStatus === 'confirmed' && !g.tableId).length} guests still need a table
                  </div>

                  <input
                    type="text"
                    value={unassignedSearch}
                    onChange={(e) => setUnassignedSearch(e.target.value)}
                    placeholder="Search unassigned guests..."
                    className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 text-xs outline-none focus:border-[#bd9661] mb-3"
                  />

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {state.guests
                      .filter(
                        (g) =>
                          g.rsvpStatus === 'confirmed' &&
                          !g.tableId &&
                          g.name.toLowerCase().includes(unassignedSearch.toLowerCase())
                      )
                      .map((ug) => (
                        <div
                          key={ug.id}
                          draggable={true}
                          onDragStart={(e) => handleGuestDragStart(e, ug.id)}
                          onDragEnd={handleGuestDragEnd}
                          className="bg-[#faf8f5] border border-[#e8ded0] hover:border-[#bd9661] rounded-xl p-3 space-y-2 cursor-grab active:cursor-grabbing select-none transition-shadow shadow-xs hover:shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#ebd3a8] text-[#15110e] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              {ug.initials ||
                                ug.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <strong className="text-xs text-[#15110e] block truncate">{ug.name}</strong>
                              <span className="text-[10px] text-[#8b7b6b] truncate block">
                                {ug.guestCount && ug.guestCount > 1 ? `+${ug.guestCount - 1} guest · ` : ''}
                                {ug.dietary && ug.dietary !== 'None' ? ug.dietary : 'No dietary notes'}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center pt-1 border-t border-[#f0ede4]">
                            <select
                              value={tableAssignSelect[ug.id] || ''}
                              onChange={(e) =>
                                setTableAssignSelect({ ...tableAssignSelect, [ug.id]: e.target.value })
                              }
                              className="flex-1 bg-white border border-[#e8ded0] rounded-md p-1.5 text-[11px] text-[#15110e] outline-none"
                            >
                              <option value="">Seat at Table...</option>
                              <option value="head">Seat at Head Table</option>
                              {state.tables
                                .filter((t) => !t.isHead)
                                .map((tbl) => (
                                  <option key={tbl.id} value={tbl.id}>
                                    Seat at {tbl.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const targetId = tableAssignSelect[ug.id] || 'table_1';
                                const fakeEvent = {
                                  preventDefault: () => {},
                                  stopPropagation: () => {},
                                  dataTransfer: { getData: () => JSON.stringify({ guestId: ug.id }) },
                                } as any;
                                handleDropOnTable(fakeEvent, targetId);
                              }}
                              className="bg-[#c89e65] hover:bg-[#b58b53] text-[#15110e] font-bold px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors shadow-2xs"
                            >
                              Seat
                            </button>
                          </div>
                        </div>
                      ))}
                    {state.guests.filter((g) => g.rsvpStatus === 'confirmed' && !g.tableId).length === 0 && (
                      <div className="text-center py-10 text-xs text-[#8b7b6b]">
                        🎉 All confirmed guests are seated!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.tables.map((tbl) => {
                    const seated = state.guests.filter((g) => g.tableId === tbl.id);
                    return (
                      <div key={tbl.id} className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#15110e]">{tbl.name}</h4>
                            <span className="text-[10px] text-[#8b7b6b]">Capacity: {tbl.capacity || 8} seats</span>
                          </div>
                          <span className="text-xs font-bold text-[#bd9661] bg-[#faf6f0] px-2 py-0.5 rounded">
                            {seated.length} / {tbl.capacity || 8} Seated
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {seated.map((g) => (
                            <div key={g.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#faf8f5]">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#15110e] text-[#dfc194] text-[9px] font-bold flex items-center justify-center">
                                  {g.seatIndex !== undefined ? g.seatIndex + 1 : '#'}
                                </span>
                                <div>
                                  <span className="font-semibold text-[#15110e] block">{g.name}</span>
                                  {g.dietary && g.dietary !== 'None' && (
                                    <span className="text-[10px] text-[#916c3d]">{g.dietary}</span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setState({
                                    ...state,
                                    guests: state.guests.map((x) => (x.id === g.id ? { ...x, tableId: null, seatIndex: null } : x)),
                                  });
                                  showToast(`Unseated ${g.name}`, 'info');
                                }}
                                className="text-[11px] text-[#a8382c] hover:underline cursor-pointer"
                              >
                                Unseat
                              </button>
                            </div>
                          ))}
                          {seated.length === 0 && (
                            <div className="text-xs text-[#8b7b6b] italic py-3 text-center">No guests seated yet</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 4: CONTENT & STORIES (Screenshot 25: 172910.png)             */}
        {/* ================================================================ */}
        {activeTab === 'pages' && (
          <section className="space-y-5">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                WEDDING EXPERIENCES &amp; MOMENTS
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Content &amp; Stories
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Craft and publish your love story, dinner menu, wedding party bios, memorial tributes, and honeymoon adventures for your guests.
              </p>
            </div>

            {/* Sub-tab Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: 'ourStory', label: '📖 Our Story' },
                { id: 'inMemoriam', label: '🕊️ In Memoriam' },
                { id: 'diningMenu', label: '🍽️ Dining & Menu' },
                { id: 'meetTheTeam', label: '👥 Meet the Team' },
                { id: 'honeymoonUpdates', label: '✈️ Honeymoon Updates' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setContentSubTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    contentSubTab === tab.id
                      ? 'bg-[#bd9661] text-[#15110e]'
                      : 'bg-white border border-[#e8ded0] text-[#15110e] hover:bg-[#faf8f5]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Split: Editor Card vs Live Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Editor Card */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                  <h3 className="font-serif text-base font-bold text-[#15110e]">
                    Edit Page &bull; {contentPages[contentSubTab].title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#e8eee4] text-[#3c6a42] text-[11px] font-bold px-2 py-0.5 rounded">
                      {contentPages[contentSubTab].status}
                    </span>
                    <button type="button" className="text-sm cursor-pointer" title="Version History">🕒</button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PAGE TITLE</label>
                    <input
                      type="text"
                      value={contentPages[contentSubTab].title}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], title: e.target.value }
                      })}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">SUBTITLE / DEDICATION</label>
                    <input
                      type="text"
                      value={contentPages[contentSubTab].subtitle}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], subtitle: e.target.value }
                      })}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PAGE STORY &amp; CONTENT</label>
                    <textarea
                      value={contentPages[contentSubTab].content}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], content: e.target.value }
                      })}
                      rows={6}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">FEATURED PHOTO CAPTION</label>
                      <input
                        type="text"
                        value={contentPages[contentSubTab].caption}
                        onChange={(e) => setContentPages({
                          ...contentPages,
                          [contentSubTab]: { ...contentPages[contentSubTab], caption: e.target.value }
                        })}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PHOTO BADGE ICON / THEME</label>
                      <select
                        value={contentPages[contentSubTab].icon}
                        onChange={(e) => setContentPages({
                          ...contentPages,
                          [contentSubTab]: { ...contentPages[contentSubTab], icon: e.target.value }
                        })}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none"
                      >
                        <option value="💍">💍 Proposal &amp; Love</option>
                        <option value="🕊️">🕊️ White Dove &amp; Memory</option>
                        <option value="🍽️">🍽️ Fine Dining &amp; Wine</option>
                        <option value="👥">👥 Bridal Party</option>
                        <option value="✈️">✈️ Travel &amp; Honeymoon</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#f0ede4]">
                    <span className="text-[11px] text-[#8b7b6b]">Last updated: Today</span>
                    <button
                      type="button"
                      onClick={() => showToast('Page content saved and published to guest hubs', 'success')}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Save Page Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Guest View Live Preview */}
              <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                    GUEST VIEW LIVE PREVIEW
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#e8eee4] text-[#3c6a42] text-[10px] font-bold px-2 py-0.5 rounded">
                      Live
                    </span>
                    <button type="button" className="bg-[#15110e] text-white p-1 rounded text-xs cursor-pointer">
                      👁️
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-xs text-center space-y-3">
                  <div className="text-3xl">{contentPages[contentSubTab].icon}</div>
                  <h2 className="font-serif text-2xl font-bold text-[#15110e]">
                    {contentPages[contentSubTab].title}
                  </h2>
                  <p className="text-xs text-[#8b7b6b] italic max-w-sm mx-auto">
                    {contentPages[contentSubTab].subtitle}
                  </p>

                  <div className="bg-[#ede5d8] border border-[#d5c7b5] rounded-xl p-8 my-4 text-center">
                    <span className="text-2xl opacity-60">📷</span>
                    <div className="text-xs font-bold text-[#15110e] mt-1">Featured Photo</div>
                    <div className="text-[10px] text-[#8b7b6b]">{contentPages[contentSubTab].caption}</div>
                  </div>

                  <p className="text-xs text-[#15110e] leading-relaxed text-left whitespace-pre-line bg-[#faf8f5] p-3 rounded-lg border border-[#f0ede4]">
                    {contentPages[contentSubTab].content}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 5: INVITATIONS (Screenshot 26: 172916.png)                    */}
        {/* ================================================================ */}
        {activeTab === 'invitations' && (
          <section className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                DIGITAL &amp; PHYSICAL INVITATIONS
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                The QaRd Invitation
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Configuration Card */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-5">
                <h2 className="font-serif text-lg font-bold text-[#15110e]">QaRd Configuration</h2>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1.5">
                    PREVIEW FOR GUEST HOUSEHOLD
                  </label>
                  <select
                    value={selectedQaRdHousehold}
                    onChange={(e) => setSelectedQaRdHousehold(e.target.value)}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none"
                  >
                    <option value="Priya Sharma (The Sharma Family)">Priya Sharma (The Sharma Family)</option>
                    <option value="Hannah Martin">Hannah Martin</option>
                    <option value="The Whitfield family">The Whitfield family</option>
                    <option value="Michael & Sarah Chen">Michael &amp; Sarah Chen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-2">
                    CARD DESIGN &amp; COLOUR PALETTE
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'obsidian', title: 'Obsidian Noir', sub: 'Near-black & Gold', bg: '#15110e', text: '#ffffff' },
                      { id: 'champagne', title: 'Champagne Ivory', sub: 'Warm Cream & Gold', bg: '#faf6f0', text: '#15110e' },
                      { id: 'merlot', title: 'Burgundy Merlot', sub: 'Rich Wine & Gold', bg: '#351319', text: '#ffffff' },
                      { id: 'sage', title: 'Botanical Sage', sub: 'Forest Olive & Gold', bg: '#1b2a20', text: '#ffffff' },
                    ].map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedQaRdPalette(pal.id as any)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedQaRdPalette === pal.id ? 'border-2 border-[#bd9661] shadow-xs' : 'border-[#e8ded0]'
                        }`}
                        style={{ backgroundColor: pal.bg, color: pal.text }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-[#bd9661]" style={{ backgroundColor: pal.bg }} />
                          <strong className="text-xs">{pal.title}</strong>
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">{pal.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectView) onSelectView('guest-mobile');
                      showToast('Simulating guest scanning QaRd...', 'info');
                    }}
                    className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>📲</span> Simulate Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Invitations dispatched via email & SMS', 'success')}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>✉</span> Send Invitations
                  </button>
                </div>
              </div>

              {/* Physical Card Rendering matching Screenshot 26 */}
              <div
                className="rounded-3xl p-8 border-4 border-[#3d2e24] shadow-2xl text-center max-w-md mx-auto transition-colors"
                style={{
                  backgroundColor:
                    selectedQaRdPalette === 'obsidian' ? '#15110e' :
                    selectedQaRdPalette === 'champagne' ? '#fbf8f2' :
                    selectedQaRdPalette === 'merlot' ? '#2e1015' : '#142118',
                  color: selectedQaRdPalette === 'champagne' ? '#15110e' : '#ffffff',
                }}
              >
                <div className="border border-[#bd9661]/40 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 rounded border border-[#bd9661] text-[10px] text-[#bd9661] font-bold flex items-center justify-center">T</span>
                    <span className="font-serif text-xs font-bold tracking-wider">Tap &amp; Toast</span>
                  </div>

                  <div className="text-[10px] tracking-widest uppercase text-[#dfc194] font-bold">
                    YOU'RE INVITED
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight">
                    Sophie <span className="text-[#dfc194] italic font-normal">&amp;</span> James
                  </h2>
                  <div className="text-xs text-[#dfc194]">
                    Saturday, 14 November 2026 &bull; 2:00 PM
                  </div>
                  <div className="text-[11px] opacity-75">
                    Fernwood Estate, Southern Highlands
                  </div>

                  <div className="w-10 h-[1px] bg-[#bd9661] mx-auto my-3" />

                  {/* QR Card */}
                  <div className="bg-white p-3 rounded-xl w-[150px] h-[150px] mx-auto flex items-center justify-center shadow-lg">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="QR Code"
                      className="w-[130px] h-[130px] object-contain"
                    />
                  </div>

                  <div className="text-[10px] tracking-widest uppercase text-[#dfc194] font-bold pt-2">
                    SCAN TO OPEN YOUR INVITATION
                  </div>
                  <div className="text-xs italic opacity-85">
                    For {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 6: GIFT & THANK-YOU (Screenshot 27: 172928.png)              */}
        {/* ================================================================ */}
        {activeTab === 'gifts' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  DIGITAL WISHING WELL &amp; APPRECIATION
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Gift &amp; Thank-You Manager
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Gift ledger exported', 'success')}
                  className="bg-white border border-[#d5c7b5] text-[#15110e] font-semibold px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-xs"
                >
                  📊 Export Status
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualGiftModal(true)}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-xs"
                >
                  + Record Manual Gift
                </button>
              </div>
            </div>

            {/* Sub-tabs: Gifting Registry vs Thank-You Manager */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGiftSubTab('registry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  giftSubTab === 'registry' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                }`}
              >
                🎁 Gifting Registry
              </button>
              <button
                type="button"
                onClick={() => setGiftSubTab('thankyou')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  giftSubTab === 'thankyou' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                }`}
              >
                💌 Thank-You Manager
              </button>
            </div>

            {/* 3 Metric Cards matching Screenshot 27 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm">
                <div className="font-serif text-3xl font-bold text-[#15110e]">$4,280</div>
                <div className="text-xs text-[#8b7b6b] mt-1">Total gifts received</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm">
                <div className="font-serif text-3xl font-bold text-[#15110e]">9</div>
                <div className="text-xs text-[#8b7b6b] mt-1">Thank-yous due</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm">
                <div className="font-serif text-3xl font-bold text-[#15110e]">$285</div>
                <div className="text-xs text-[#8b7b6b] mt-1">Average gift contribution</div>
              </div>
            </div>

            {/* Table matching Screenshot 27 */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                    <th className="py-2.5 px-3">FROM</th>
                    <th className="py-2.5 px-3">AMOUNT</th>
                    <th className="py-2.5 px-3">DATE</th>
                    <th className="py-2.5 px-3">MESSAGE</th>
                    <th className="py-2.5 px-3">THANK-YOU STATUS</th>
                    <th className="py-2.5 px-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede4]">
                  {coupleGifts.map((row) => (
                    <tr key={row.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-3 font-bold text-[#15110e]">{row.from}</td>
                      <td className="py-3 px-3 font-bold text-[#15110e]">{row.amount}</td>
                      <td className="py-3 px-3 text-[#8b7b6b]">{row.date}</td>
                      <td className="py-3 px-3 italic text-[#6b5849] max-w-[280px]">{row.msg}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          row.status === 'Sent' ? 'bg-[#e8eee4] text-[#3c6a42]' : 'bg-[#faf6f0] text-[#916c3d]'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGiftForThankYou(row);
                            setThankYouNoteDraft(
                              row.noteDraft ||
                              `Dear ${row.from}, thank you so much for your wonderful and generous gift of ${row.amount}! It means the world to have your love and support as we begin our new chapter together. Love, Sophie & James.`
                            );
                            setThankYouStatusChoice(row.status);
                          }}
                          title="Open Thank-You Note Editor"
                          aria-label={`Open thank-you note editor for ${row.from}`}
                          className="text-[#bd9661] hover:text-[#a8824f] p-1.5 text-sm cursor-pointer hover:bg-[#faf6f0] rounded transition-colors"
                        >
                          ✎
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Interactive Thank-You Note Pop-up */}
            {selectedGiftForThankYou && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-[#e8ded0]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">GIFT &amp; THANK-YOU MANAGER</div>
                      <h3 className="font-serif text-xl font-bold text-[#15110e]">Digital Thank-You Card</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedGiftForThankYou(null)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer"
                      aria-label="Close dialog"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Gift summary card */}
                  <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] text-[#8b7b6b]">Gift From:</div>
                        <strong className="text-sm text-[#15110e]">{selectedGiftForThankYou.from}</strong>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[#8b7b6b]">Contribution:</div>
                        <span className="font-serif text-lg font-bold text-[#15110e]">{selectedGiftForThankYou.amount}</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#6b5849] italic border-t border-[#f0ede4] pt-2">
                      {selectedGiftForThankYou.msg}
                    </div>
                  </div>

                  {/* Thank-You Card Preview */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8b7b6b] uppercase">Personalized Digital Thank-You Message</label>
                    <textarea
                      rows={5}
                      value={thankYouNoteDraft}
                      onChange={(e) => setThankYouNoteDraft(e.target.value)}
                      className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Status Choice */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8b7b6b] uppercase">Thank-You Status</label>
                    <div className="flex gap-2">
                      {(['Due', 'Drafted', 'Sent'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setThankYouStatusChoice(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            thankYouStatusChoice === st
                              ? st === 'Sent' ? 'bg-[#2e6d3c] text-white shadow-xs' : 'bg-[#bd9661] text-[#15110e] shadow-xs'
                              : 'bg-white border border-[#e8ded0] text-[#8b7b6b]'
                          }`}
                        >
                          {st === 'Sent' ? '✓ Sent' : st === 'Drafted' ? '✎ Drafted' : '⏳ Due'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#e8ded0] gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGiftForThankYou(null)}
                      className="bg-white border border-[#d5c7b5] text-[#15110e] font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#faf8f5] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCoupleGifts(coupleGifts.map(g => g.id === selectedGiftForThankYou.id ? { ...g, status: thankYouStatusChoice, noteDraft: thankYouNoteDraft } : g));
                          setSelectedGiftForThankYou(null);
                          showToast('Thank-you draft saved', 'info');
                        }}
                        className="bg-white border border-[#bd9661] text-[#916c3d] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#faf6f0] cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCoupleGifts(coupleGifts.map(g => g.id === selectedGiftForThankYou.id ? { ...g, status: 'Sent', noteDraft: thankYouNoteDraft } : g));
                          setSelectedGiftForThankYou(null);
                          showToast(`✓ Digital thank-you note dispatched to ${selectedGiftForThankYou.from}!`, 'success');
                        }}
                        className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        ✉ Send Thank-You Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Manual Gift */}
            {showManualGiftModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">Record Physical / Cash Gift</h3>
                    <button type="button" onClick={() => setShowManualGiftModal(false)} className="text-gray-400 font-bold text-lg">&times;</button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">From (Guest Name)</label>
                      <input
                        type="text"
                        value={manualGiftFrom}
                        onChange={(e) => setManualGiftFrom(e.target.value)}
                        placeholder="e.g. Grandma Helen"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Amount (AUD)</label>
                      <input
                        type="number"
                        value={manualGiftAmount}
                        onChange={(e) => setManualGiftAmount(e.target.value)}
                        placeholder="250"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Card Note / Message</label>
                      <textarea
                        value={manualGiftMessage}
                        onChange={(e) => setManualGiftMessage(e.target.value)}
                        placeholder="Heartfelt congratulations..."
                        rows={3}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button type="button" onClick={() => setShowManualGiftModal(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Recorded $${manualGiftAmount} gift from ${manualGiftFrom}`, 'success');
                          setShowManualGiftModal(false);
                        }}
                        className="bg-[#bd9661] text-[#15110e] font-bold px-4 py-1.5 rounded-lg"
                      >
                        Record Gift
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 7: CELEBRATION FEED (Screenshot 28: 172937.png)              */}
        {/* ================================================================ */}
        {activeTab === 'feed' && (
          <section className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                LIVE EVENT STREAM
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Celebration Feed Moderation
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Live Posts & Moderation */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#15110e]">Live Posts &amp; Moderation</h2>
                
                <div className="space-y-3">
                  {feedPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {post.pinned ? '🎉' : post.title.includes('Thank') ? '🎁' : post.title.includes('note') ? '💌' : '✅'}
                          </span>
                          <strong className="text-sm text-[#15110e]">{post.title}</strong>
                          {post.pinned && (
                            <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] text-[10px] font-bold px-2 py-0.5 rounded">
                              Pinned
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8b7b6b]">{post.time}</span>
                          <span className="text-xs text-[#bd9661] cursor-pointer">
                            {post.expanded ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>

                      {post.quote && (
                        <p className="text-xs italic text-[#6b5849] bg-[#faf8f5] p-3 rounded-xl border-l-2 border-[#bd9661] leading-relaxed">
                          {post.quote}
                        </p>
                      )}

                      {post.tag && (
                        <div className="text-xs text-[#8b7b6b]">{post.tag}</div>
                      )}

                      {/* Display replies if any */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                          {post.replies.map((rep, ri) => (
                            <div key={ri} className="bg-[#fcf8f2] rounded-xl p-2.5 text-xs border border-[#ebdcc9] flex items-start gap-2">
                              <span className="text-sm">💍</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <strong className="text-[11px] text-[#916c3d]">{rep.author}</strong>
                                  <span className="text-[10px] text-[#8b7b6b]">{rep.time}</span>
                                </div>
                                <p className="text-[11.5px] text-[#15110e] mt-0.5">{rep.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-[#f0ede4] text-xs">
                        <span className="text-[11px] text-[#8b7b6b]">
                          {post.time} &bull; {post.likes} likes &bull; {post.comments} comments
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingPost(post);
                              setReplyText('');
                            }}
                            className="bg-[#faf8f5] hover:bg-[#fff7ea] border border-[#ebd3a8] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>💬</span> Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedPosts(feedPosts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                            }}
                            className="bg-white border border-[#e8ded0] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-red-50 transition-colors"
                          >
                            <span>❤️</span> {post.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Add Official Note - Aligned horizontally in line with where messages start */}
              <div className="space-y-4 lg:mt-[38px]">
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#15110e]">Add Official Note</h3>
                  <textarea
                    value={officialNoteText}
                    onChange={(e) => setOfficialNoteText(e.target.value)}
                    placeholder="Post a thank-you or announcement from the couple..."
                    rows={4}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-3 text-xs outline-none focus:border-[#bd9661] resize-none leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!officialNoteText.trim()) return;
                      const newPost = {
                        id: 'fp_' + Date.now(),
                        title: 'Official Note from Sophie & James',
                        time: 'Just now',
                        pinned: true,
                        quote: officialNoteText,
                        likes: 1,
                        comments: 0,
                        expanded: true,
                        replies: [],
                      };
                      setFeedPosts([newPost, ...feedPosts]);
                      setOfficialNoteText('');
                      showToast('Announcement posted to feed!', 'success');
                    }}
                    className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Post to Feed
                  </button>
                </div>
              </div>
            </div>

            {/* Modal: Interactive Reply to Feed Post Pop-up */}
            {replyingPost && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">CELEBRATION FEED REPLY</div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">Reply to {replyingPost.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingPost(null)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer"
                      aria-label="Close dialog"
                    >
                      &times;
                    </button>
                  </div>

                  {replyingPost.quote && (
                    <div className="bg-[#faf8f5] p-3 rounded-xl border-l-2 border-[#bd9661] text-xs italic text-[#6b5849]">
                      "{replyingPost.quote}"
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8b7b6b] uppercase">Sophie &amp; James's Reply</label>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write a warm reply to ${replyingPost.title}...`}
                      className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none"
                    />
                    <div className="flex gap-1.5 pt-1 flex-wrap">
                      {['❤️ Thank you so much!', '💕 Can\'t wait to hug you!', '🥂 Cheers to that!', '🙏 So grateful for you!'].map((quick, qi) => (
                        <button
                          key={qi}
                          type="button"
                          onClick={() => setReplyText(quick)}
                          className="text-[10px] bg-[#faf8f5] border border-[#e8ded0] hover:border-[#bd9661] px-2 py-0.5 rounded-full text-[#6b5849] cursor-pointer"
                        >
                          {quick}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                    <button
                      type="button"
                      onClick={() => setReplyingPost(null)}
                      className="bg-white border border-[#d5c7b5] text-[#15110e] font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#faf8f5] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!replyText.trim()) return;
                        const updated = feedPosts.map(p => {
                          if (p.id === replyingPost.id) {
                            return {
                              ...p,
                              comments: p.comments + 1,
                              replies: [...(p.replies || []), { author: 'Sophie & James', text: replyText.trim(), time: 'Just now' }],
                            };
                          }
                          return p;
                        });
                        setFeedPosts(updated);
                        setReplyingPost(null);
                        showToast(`✓ Reply published to ${replyingPost.title}!`, 'success');
                      }}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 8: WEDDING VAULT (Screenshot 29: 172943.png)                 */}
        {/* ================================================================ */}
        {activeTab === 'vault' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  LIFETIME KEEPSAKE &amp; ARCHIVE
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Wedding Vault
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Your permanent digital keepsake preserving every cherished love note, toast, guest memory, and celebration photo for a lifetime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Vault manifest (.json) downloaded', 'success')}
                className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>📦</span> Download Vault Manifest
              </button>
            </div>

            {/* Storage Usage Card */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                    STORAGE ALLOCATION &amp; USAGE
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#15110e]">
                    2.35 GB used of 5.00 GB (47%)
                  </div>
                </div>
                <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] text-xs font-bold px-3 py-1 rounded-full">
                  ⏳ Archive Expiry: 30 Days
                </span>
              </div>

              {/* Multi-color Bar */}
              <div className="w-full h-3.5 bg-[#ede5d8] rounded-full overflow-hidden flex">
                <div style={{ width: '33.6%' }} className="bg-[#bd9661]" title="Photos & Videos" />
                <div style={{ width: '5.0%' }} className="bg-[#e6a15c]" title="Live Feed & Notes" />
                <div style={{ width: '5.0%' }} className="bg-[#4a7c59]" title="Gifts & Thank-Yous" />
                <div style={{ width: '2.4%' }} className="bg-[#3d6b99]" title="Guest RSVPs & Seating" />
                <div style={{ width: '1.0%' }} className="bg-[#7d5ba6]" title="MC Schedule" />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#bd9661]" /> Photos &amp; Videos (1.68 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#e6a15c]" /> Live Feed &amp; Notes (0.25 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#4a7c59]" /> Gifts &amp; Thank-Yous (0.25 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3d6b99]" /> Guest RSVPs &amp; Seating (0.12 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#7d5ba6]" /> MC Schedule (0.05 GB)</div>
                <div className="flex items-center gap-1.5 text-[#8b7b6b]"><span className="w-2.5 h-2.5 rounded-sm bg-[#ede5d8]" /> Free Space (2.65 GB)</div>
              </div>
            </div>

            {/* Split: Access Controls & Read-Only Records */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#15110e]">🔒 Vault Access Controls</h3>
                <p className="text-xs text-[#8b7b6b]">Specify who can view and access this read-only wedding vault archive.</p>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1.5">ACCESS PERMISSIONS LEVEL</label>
                  <select
                    value={vaultPermission}
                    onChange={(e) => setVaultPermission(e.target.value)}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none"
                  >
                    <option value="couple_mc">Couple + MC</option>
                    <option value="couple_only">Couple Only</option>
                    <option value="public_family">Family &amp; Guests with QaRd Link</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Vault security access level updated', 'success')}
                  className="bg-[#bd9661] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Save Access Settings
                </button>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#15110e]">📁 Read-Only Vault Records</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#faf8f5] rounded-xl flex items-center justify-between border border-[#f0ede4]">
                    <span>High-Resolution Photo Archive (42 images)</span>
                    <span className="text-[#3c6a42] font-bold">1.68 GB</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl flex items-center justify-between border border-[#f0ede4]">
                    <span>Love Notes &amp; Guest Wishes Stream (16 items)</span>
                    <span className="text-[#3c6a42] font-bold">0.25 GB</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl flex items-center justify-between border border-[#f0ede4]">
                    <span>Official MC Run Sheet &amp; Speeches Final PDF</span>
                    <span className="text-[#3c6a42] font-bold">0.05 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 9: 1ST ANNIVERSARY (Screenshots 30-32: 172951.png - 173005) */}
        {/* ================================================================ */}
        {activeTab === 'anniversary' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  1ST YEAR MILESTONE CELEBRATION
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  First Anniversary <span className="text-base text-[#bd9661] font-normal">(14 Nov 2027)</span>
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Celebrate your paper anniversary milestone, unlock your time capsule reflections, and relive every magical moment with your loved ones.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAnniversaryMode('countdown')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    anniversaryMode === 'countdown' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                  }`}
                >
                  ⏳ Planning Countdown
                </button>
                <button
                  type="button"
                  onClick={() => setAnniversaryMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    anniversaryMode === 'preview' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                  }`}
                >
                  🎉 Preview Anniversary Day (14 Nov 2027)
                </button>
              </div>
            </div>

            {/* Dark Hero Card matching Screenshot 30 */}
            <div className="bg-[#15110e] text-white p-6 rounded-2xl shadow-lg border border-[#3d2e24] space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#dfc194]">
                    🌟 1ST YEAR ANNIVERSARY
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white mt-1">
                    Sophie <span className="text-[#dfc194] italic font-normal">&amp;</span> James
                  </h2>
                  <div className="text-xs text-[#c9bbae] mt-0.5">
                    Married 14 November 2026 &bull; Celebrating 1 Year &bull; 14 November 2027
                  </div>
                </div>
                <span className="bg-[#291f17] border border-[#bd9661] text-[#dfc194] text-xs font-bold px-3 py-1.5 rounded-full">
                  ⏳ 396 Days to Anniversary
                </span>
              </div>

              <p className="text-xs italic text-[#dfc194] leading-relaxed border-l-2 border-[#bd9661] pl-3 py-1 bg-white/5 rounded-r-lg">
                "Happy 1st Anniversary Sophie &amp; James! Looking back on your magical day at Fernwood Estate with 127 loved ones!"
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-[#bd9661]">TRADITIONAL SYMBOL</div>
                  <div className="font-bold text-sm text-white mt-1">📜 Paper</div>
                  <p className="text-[11px] text-[#c9bbae] mt-0.5">
                    A clean, blank sheet waiting to be written with your life story and adventures.
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-[#bd9661]">MODERN SYMBOL</div>
                  <div className="font-bold text-sm text-white mt-1">⏰ Clocks</div>
                  <p className="text-[11px] text-[#c9bbae] mt-0.5">
                    Celebrating every cherished minute and precious memory shared throughout your first year.
                  </p>
                </div>
              </div>
            </div>

            {/* Relive Memories Section matching Screenshot 31 */}
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">✨ Relive Your Wedding Memories</h3>
                <p className="text-xs text-[#8b7b6b]">Quick access to key moments and keepsakes from your wedding celebration</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'mem1', title: 'Wedding Photo Gallery', desc: '42 curated moments and guest captures', icon: '📷', type: 'gallery' as const },
                  { id: 'mem2', title: 'Love Notes & Guest Wishes', desc: '16 heartfelt guest tributes from the feed', icon: '💌', type: 'notes' as const },
                  { id: 'mem3', title: 'First Dance & Music', desc: '"L-O-V-E" by Nat King Cole & reception songs', icon: '💃', type: 'music' as const },
                  { id: 'mem4', title: 'Wedding Vows & Ceremony', desc: 'Fernwood Lower Meadow Lawns at 2:00 PM', icon: '📜', type: 'vows' as const },
                  { id: 'mem5', title: 'Toasts & Speech Cues', desc: 'Maid of Honor, Best Man & Father of the Bride', icon: '🥂', type: 'toasts' as const },
                  { id: 'mem6', title: 'Final Seating & Guest Roll', desc: '127 seated guests across 12 tables', icon: '🪑', type: 'seating' as const },
                ].map((m) => (
                  <div key={m.id} className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="text-2xl mb-2">{m.icon}</div>
                      <h4 className="font-bold text-sm text-[#15110e]">{m.title}</h4>
                      <p className="text-xs text-[#8b7b6b] mt-1">{m.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(m)}
                      className="text-xs text-[#bd9661] hover:text-[#916c3d] font-bold text-left hover:underline cursor-pointer pt-2 flex items-center gap-1 transition-colors"
                    >
                      View Memory &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal: Interactive View Memory Keepsake Pop-up */}
            {selectedMemory && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0] max-h-[88vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-[#e8ded0]">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-[#faf6f0] border border-[#ebd3a8] rounded-xl">{selectedMemory.icon}</span>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">WEDDING VAULT KEEPSAKE</div>
                        <h3 className="font-serif text-xl font-bold text-[#15110e]">{selectedMemory.title}</h3>
                        <p className="text-xs text-[#8b7b6b]">{selectedMemory.desc}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(null)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer p-1"
                      aria-label="Close dialog"
                    >
                      &times;
                    </button>
                  </div>

                  {/* GALLERY CONTENT */}
                  {selectedMemory.type === 'gallery' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8b7b6b]">Showing 6 highlight moments &bull; 42 stored in Cloud Archive</span>
                        <button
                          type="button"
                          onClick={() => showToast('Full wedding gallery (.zip) downloaded!', 'success')}
                          className="bg-[#faf8f5] hover:bg-[#faf4ec] text-[#bd9661] border border-[#ebd3a8] px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          ⬇ Download All (1.68 GB)
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { title: 'The Meadow Processional', tag: 'Ceremony', time: '2:15 PM', color: '#684534' },
                          { title: 'First Kiss under Arch', tag: 'Ceremony', time: '2:38 PM', color: '#7a523a' },
                          { title: 'Champagne Tower Pour', tag: 'Cocktails', time: '3:15 PM', color: '#8c6145' },
                          { title: 'Golden Hour Vineyard Walk', tag: 'Portraits', time: '5:45 PM', color: '#573d2f' },
                          { title: 'First Dance & Sparklers', tag: 'Reception', time: '7:20 PM', color: '#452f23' },
                          { title: 'Sparkler Courtyard Exit', tag: 'Farewell', time: '10:15 PM', color: '#38251c' },
                        ].map((pic, idx) => (
                          <div key={idx} className="bg-[#fcfaf7] border border-[#ebdcc9] rounded-xl overflow-hidden shadow-xs group">
                            <div
                              className="h-28 flex items-center justify-center text-white font-serif text-xs font-semibold relative"
                              style={{ backgroundColor: pic.color }}
                            >
                              <span className="opacity-90">{pic.title}</span>
                              <span className="absolute top-2 right-2 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                                {pic.time}
                              </span>
                            </div>
                            <div className="p-2.5 flex items-center justify-between text-[11px]">
                              <span className="text-[#8b7b6b]">{pic.tag}</span>
                              <button
                                type="button"
                                onClick={() => showToast(`Saved "${pic.title}" in high resolution`, 'info')}
                                className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                              >
                                Save Photo &darr;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NOTES CONTENT */}
                  {selectedMemory.type === 'notes' && (
                    <div className="space-y-3">
                      <div className="text-xs text-[#8b7b6b]">Heartfelt guest tributes transcribed directly from the live wedding feed:</div>
                      <div className="space-y-2.5">
                        {[
                          { author: 'Aunty Carol & Uncle Peter', relation: 'Family', note: 'So excited for you both — can\'t wait to celebrate! You look like absolute royalty. May God bless your sacred journey together. 💕', time: 'Ceremony Day' },
                          { author: 'The Whitfield Family', relation: 'Bridal Party Friends', note: 'Dear Sophie & James, what an incredible and breathtaking night! Wishing you both a lifetime of love, laughter, and grand adventures.', time: 'Reception' },
                          { author: 'Sarah & Michael Chen', relation: 'Close Friends', note: 'Such an honor witnessing your vows. Your love is so evident to everyone in this room. Cheers to Mr & Mrs!', time: 'Cocktail Hour' },
                          { author: 'Robert Galati', relation: 'Master of Ceremonies', note: 'It was an absolute privilege steering the stage for you two. Love, energy, and radiant happiness all evening!', time: 'Farewell' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-3.5 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <strong className="text-[#15110e]">{item.author}</strong>
                                <span className="text-[#8b7b6b] text-[11px] ml-1.5">&bull; {item.relation}</span>
                              </div>
                              <span className="text-[10px] text-[#bd9661] font-semibold">{item.time}</span>
                            </div>
                            <p className="text-xs italic text-[#6b5849] leading-relaxed">"{item.note}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MUSIC CONTENT */}
                  {selectedMemory.type === 'music' && (
                    <div className="space-y-4">
                      {/* Featured First Dance */}
                      <div className="bg-[#15110e] text-white p-4 rounded-xl border border-[#3d2e24] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#dfc194] uppercase tracking-wider">OFFICIAL FIRST DANCE</span>
                          <span className="text-xs text-[#a8988a]">Duration 2:34</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => showToast('Playing "L-O-V-E" by Nat King Cole...', 'info')}
                            className="w-10 h-10 rounded-full bg-[#bd9661] text-[#15110e] font-bold flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                          >
                            ▶
                          </button>
                          <div>
                            <div className="font-serif text-lg font-bold text-white">L-O-V-E</div>
                            <div className="text-xs text-[#dfc194]">Nat King Cole &bull; Fernwood Grand Ballroom</div>
                          </div>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-lg text-xs italic text-[#dfc194] leading-relaxed">
                          "L is for the way you look at me &bull; O is for the only one I see &bull; V is very, very extraordinary &bull; E is even more than anyone that you adore..."
                        </div>
                      </div>

                      {/* Guest Requested Reception Tracks */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-[#15110e] uppercase tracking-wider">Top Reception Dance Tracks</div>
                        <div className="divide-y divide-[#f0ede4] text-xs">
                          {[
                            { song: "Can't Take My Eyes Off You", artist: 'Frankie Valli', requestedBy: 'Table 4 (The Wilsons)' },
                            { song: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', requestedBy: 'Head Table (Bridal Party)' },
                            { song: 'September', artist: 'Earth, Wind & Fire', requestedBy: 'Table 2 (University Friends)' },
                            { song: 'Dancing in the Moonlight', artist: 'Toploader', requestedBy: 'Table 6 (The Highlands Crew)' },
                          ].map((t, i) => (
                            <div key={i} className="py-2 flex items-center justify-between">
                              <div>
                                <strong className="text-[#15110e]">{t.song}</strong>
                                <span className="text-[#8b7b6b] ml-1.5">&bull; {t.artist}</span>
                              </div>
                              <span className="text-[11px] text-[#bd9661] font-semibold">{t.requestedBy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VOWS CONTENT */}
                  {selectedMemory.type === 'vows' && (
                    <div className="space-y-4">
                      <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center border-b border-[#ebd3a8] pb-1.5">
                          <strong className="font-serif text-base text-[#15110e]">Sophie's Vows to James</strong>
                          <span className="text-[10px] font-bold text-[#bd9661] uppercase">FERNWOOD LOWER MEADOW</span>
                        </div>
                        <p className="text-xs italic text-[#6b5849] leading-relaxed">
                          "James, from our very first rainy Sunday in Surry Hills to this golden afternoon in the Southern Highlands, you have been my greatest comfort, my deepest joy, and my truest home. I promise to always laugh with you through life's unexpected detours, dream with you under every night sky, and love you without reservation, today and for all the tomorrows to come."
                        </p>
                      </div>

                      <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center border-b border-[#ebd3a8] pb-1.5">
                          <strong className="font-serif text-base text-[#15110e]">James's Vows to Sophie</strong>
                          <span className="text-[10px] font-bold text-[#bd9661] uppercase">FERNWOOD LOWER MEADOW</span>
                        </div>
                        <p className="text-xs italic text-[#6b5849] leading-relaxed">
                          "Sophie, you bring a quiet grace, infectious laughter, and boundless warmth to every corner of my life. Standing before our families and dearest friends today, I promise to listen, to cherish, to protect our joy, and to walk beside you through every season ahead with an unwavering and loyal heart."
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TOASTS CONTENT */}
                  {selectedMemory.type === 'toasts' && (
                    <div className="space-y-3">
                      {[
                        { speaker: 'Chloe Mitchell', role: 'Maid of Honor', time: '6:45 PM', quote: 'To Sophie, my sister by heart since Kindergarten. Seeing you this radiant and loved by James brings tears of sheer gratitude.' },
                        { speaker: 'Liam Fletcher', role: 'Best Man', time: '7:00 PM', quote: 'James has always been the steadfast anchor in our crew, but Sophie is the compass that showed him where true happiness lives.' },
                        { speaker: 'Robert Evans', role: 'Father of the Bride', time: '7:15 PM', quote: 'Raising Sophie has been the great honor of my life. Handing her hand to a gentleman like James fills my heart with total peace.' },
                      ].map((t, idx) => (
                        <div key={idx} className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-3.5 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-[#15110e]">{t.speaker}</strong>
                              <span className="text-[#8b7b6b] ml-1.5">&bull; {t.role}</span>
                            </div>
                            <span className="text-[10px] text-[#bd9661] font-semibold">{t.time}</span>
                          </div>
                          <p className="text-xs italic text-[#6b5849] leading-relaxed">"{t.quote}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SEATING CONTENT */}
                  {selectedMemory.type === 'seating' && (
                    <div className="space-y-3">
                      <div className="text-xs text-[#8b7b6b]">Permanent archival record of the 127 seated guests across the Pavilion Ballroom:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#faf8f5] border border-[#bd9661] rounded-xl p-3 space-y-1">
                          <strong className="text-[#bd9661] uppercase text-[11px] block">HEAD TABLE (8 Guests)</strong>
                          <div className="text-[11.5px] text-[#15110e] space-y-0.5">
                            <div>1. Sophie (Bride) &bull; 2. James (Groom)</div>
                            <div>3. Hannah Martin &bull; 4. Oliver Vance</div>
                            <div>5. Charlotte Evans &bull; 6. Grace Turner</div>
                            <div>7. Liam Fletcher &bull; 8. Benjamin Ross</div>
                          </div>
                        </div>
                        <div className="bg-white border border-[#e8ded0] rounded-xl p-3 space-y-1">
                          <strong className="text-[#15110e] uppercase text-[11px] block">Table 1 · Highlands Suite (8/8)</strong>
                          <div className="text-[11px] text-[#6b5849]">The Whitfields, Sarah &amp; Michael Chen, Marcus Vance...</div>
                        </div>
                        <div className="bg-white border border-[#e8ded0] rounded-xl p-3 space-y-1">
                          <strong className="text-[#15110e] uppercase text-[11px] block">Table 2 · Pavilion Garden (6/8)</strong>
                          <div className="text-[11px] text-[#6b5849]">Aunty Carol, Uncle Peter, David Wilson...</div>
                        </div>
                        <div className="bg-white border border-[#e8ded0] rounded-xl p-3 space-y-1">
                          <strong className="text-[#15110e] uppercase text-[11px] block">Table 3 · Meadow Lawn (4/8)</strong>
                          <div className="text-[11px] text-[#6b5849]">Priya Sharma &amp; The Sharma Family Party...</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex justify-end pt-3 border-t border-[#e8ded0]">
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(null)}
                      className="bg-[#15110e] hover:bg-[#2b221a] text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                    >
                      Close Keepsake
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Time Capsule & Reflections Split matching Screenshot 31 & 32 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#15110e]">📝 Couple's 1st Year Time Capsule</h3>
                <p className="text-xs text-[#8b7b6b]">Handcrafted time capsule message written for opening on 14 November 2027:</p>
                <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#ebd3a8] text-xs italic text-[#6b5849] leading-relaxed">
                  "To our future selves on 14 November 2027: Remember the golden light through the pavilion windows..."
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#15110e]">🎉 1st Year Reflections</h3>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase">OUR REFLECTIONS ON YEAR ONE</label>
                <textarea
                  value={reflectionsInput}
                  onChange={(e) => setReflectionsInput(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('Anniversary reflections saved!', 'success')}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Save Reflection
                  </button>
                </div>
              </div>
            </div>

            {/* Guest Anniversary Wishes & Tributes matching Screenshot 32 */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#15110e]">💌 Guest Anniversary Wishes &amp; Tributes</h3>
                <span className="text-xs text-[#8b7b6b]">0 Guest Wishes</span>
              </div>
              <p className="text-xs text-[#8b7b6b]">Heartfelt anniversary toasts and blessings posted by guests from the celebration feed</p>
              <div className="text-center py-6 text-xs text-[#8b7b6b] italic bg-[#faf8f5] rounded-xl border border-dashed border-[#e8ded0] mt-3">
                No guest anniversary wishes received yet. When guests post anniversary love notes from the guest app, they will appear here!
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 10: VENUE & TRAVEL (Screenshot 33: 173018.png)                */}
        {/* ================================================================ */}
        {activeTab === 'venue' && (
          <section className="space-y-6">
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

            {/* 2x2 Venue Details Grid matching Screenshot 33 */}
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
                </div>
              </div>

              {/* Card 4: Interactive Google Map */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
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
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 11: SETTINGS (Screenshot 34: 173029.png)                      */}
        {/* ================================================================ */}
        {activeTab === 'settings' && (
          <section className="space-y-6 max-w-4xl">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                CONFIGURATION
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Wedding Settings &amp; Preferences
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Customize your ceremony parameters, venue logistics, aesthetic themes, and guest digital hub feature toggles.
              </p>
            </div>

            {/* Section 1: Couple & Ceremony Details */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">💍</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Couple &amp; Ceremony Schedule</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PARTNER 1 FULL NAME</label>
                  <input
                    type="text"
                    value={weddingSettings.partner1}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, partner1: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PARTNER 2 FULL NAME</label>
                  <input
                    type="text"
                    value={weddingSettings.partner2}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, partner2: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">WEDDING DATE &amp; TIME</label>
                  <input
                    type="text"
                    value={weddingSettings.dateTime}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, dateTime: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">RECEPTION TIME</label>
                  <input
                    type="text"
                    value={weddingSettings.receptionTime}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, receptionTime: e.target.value })}
                    placeholder="16:00"
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">OFFICIAL HASHTAG</label>
                  <input
                    type="text"
                    value={weddingSettings.weddingHashtag}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, weddingHashtag: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Venue, Valet & Weather */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">🏛️</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Venue Logistics &amp; Navigation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">VENUE NAME</label>
                  <input
                    type="text"
                    value={weddingSettings.venueName}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, venueName: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">FULL VENUE ADDRESS</label>
                  <input
                    type="text"
                    value={weddingSettings.venueAddress}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, venueAddress: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">GUEST PARKING INSTRUCTIONS</label>
                <textarea
                  value={weddingSettings.parkingInstructions}
                  onChange={(e) => setWeddingSettings({ ...weddingSettings, parkingInstructions: e.target.value })}
                  rows={2}
                  className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">SHUTTLE BUS SCHEDULE</label>
                  <input
                    type="text"
                    value={weddingSettings.shuttleSchedule}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, shuttleSchedule: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">WEATHER CONTINGENCY PLAN</label>
                  <input
                    type="text"
                    value={weddingSettings.weatherContingency}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, weatherContingency: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Aesthetics & Dress Code */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">🎨</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Aesthetic &amp; Dress Code</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1.5">WEDDING COLOR THEME</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'merlot', name: 'Burgundy Merlot', bg: '#2b1016', text: '#ffffff', sub: 'Rich Wine & Gold' },
                    { id: 'sage', name: 'Botanical Sage', bg: '#1c2820', text: '#ffffff', sub: 'Forest Olive & Gold' },
                    { id: 'gold', name: 'Champagne Gold', bg: '#302619', text: '#ffffff', sub: 'Warm Ochre & Cream' },
                    { id: 'obsidian', name: 'Obsidian Noir', bg: '#15110e', text: '#ffffff', sub: 'Deep Ink & Gold' },
                  ].map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setWeddingSettings({ ...weddingSettings, themeColor: pal.id })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        weddingSettings.themeColor === pal.id ? 'border-2 border-[#bd9661] shadow-xs' : 'border-[#e8ded0]'
                      }`}
                      style={{ backgroundColor: pal.bg, color: pal.text }}
                    >
                      <div className="text-xs font-bold">{pal.name}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">{pal.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">GUEST DRESS CODE STATEMENT</label>
                <input
                  type="text"
                  value={weddingSettings.dressCode}
                  onChange={(e) => setWeddingSettings({ ...weddingSettings, dressCode: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>
            </div>

            {/* Section 4: Guest Digital Hub Feature Toggles */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">⚙️</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Guest Hub Experience Toggles</h3>
              </div>

              <div className="divide-y divide-[#f0ede4]">
                {[
                  {
                    title: 'Digital Wishing Well & Gifting',
                    desc: 'Enable guests to send monetary wishing well gifts via credit card or Apple Pay directly from their mobile hub.',
                    key: 'enableDigitalGifts' as const,
                  },
                  {
                    title: 'Joey AI Wedding Assistant',
                    desc: 'Allow guests to ask questions about parking, dress code, their table seating, and request dietary updates via Joey.',
                    key: 'enableJoeyAI' as const,
                  },
                  {
                    title: 'Live Celebration Feed',
                    desc: 'Let guests share live photos, toasts, and notes during cocktail hour and reception with couple moderation.',
                    key: 'enableCelebrationFeed' as const,
                  },
                  {
                    title: 'Guest Song Requests',
                    desc: 'Allow guests to submit song requests for the DJ / MC directly inside their digital itinerary.',
                    key: 'enableSongRequests' as const,
                  },
                  {
                    title: 'Secret Seating Plan Reveal',
                    desc: 'Keep table numbers hidden until the morning of the wedding (8:00 AM) to maintain seating excitement.',
                    key: 'hideSeatingUntilMorning' as const,
                  },
                ].map((toggleItem) => (
                  <div key={toggleItem.key} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs text-[#15110e] block">{toggleItem.title}</strong>
                      <span className="text-[11px] text-[#8b7b6b]">{toggleItem.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={Boolean(weddingSettings[toggleItem.key])}
                        onChange={(e) => setWeddingSettings({ ...weddingSettings, [toggleItem.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Data Export & Save */}
            <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <strong className="text-sm font-serif text-[#15110e] block">Ready to apply changes?</strong>
                <p className="text-xs text-[#8b7b6b]">All updates reflect immediately in the Guest Hub and MC Run Sheet.</p>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Exported guest list (127 guests) as CSV', 'info');
                  }}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  📥 Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('✓ Wedding configuration settings saved successfully!', 'success');
                  }}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Joey AI Assistant */}
      <JoeyChatbot context="couple" />
    </div>
  );
}
