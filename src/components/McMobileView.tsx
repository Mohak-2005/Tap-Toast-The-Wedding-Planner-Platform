import React, { useState, useRef, useEffect } from 'react';
import { useAppState, showToast, getWeddingCountdown } from '../lib/state';
import { Table, TableShape, PrivateRunSheetItem, SavedSeatingArrangement, AuditLogEntry, Guest } from '../lib/types';
import { DietaryBadges, parseDietaryRequirements } from '../lib/dietaryHelper';

interface McMobileViewProps {
  onSelectView?: (view: string) => void;
}

export default function McMobileView({ onSelectView }: McMobileViewProps) {
  const { state, setState } = useAppState();
  const viewportRef = useRef<HTMLDivElement>(null);

  // Selected wedding ID for Live Console mode (null = home mode)
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const normalizedId = selectedWeddingId === 'w_sophie_james' ? 'w1'
    : selectedWeddingId === 'w_aisha_marcus' ? 'w2'
    : selectedWeddingId === 'w_emma_tom' ? 'w3'
    : selectedWeddingId;
  const activeWedding = (state.weddings || []).find(w => w.id === normalizedId) || (state.weddings || [])[0];
  const currentWeddingId = activeWedding.id;

  // Home Bottom Navigation ('weddings' | 'calendar' | 'referrals' | 'team' | 'settings')
  const [homeTab, setHomeTab] = useState<'weddings' | 'calendar' | 'referrals' | 'team' | 'settings'>('weddings');

  // Live Console Navigation ('overview' | 'runsheet' | 'seating' | 'catering' | 'guests' | 'venue')
  const [consoleTab, setConsoleTab] = useState<'overview' | 'runsheet' | 'seating' | 'catering' | 'guests' | 'venue'>('runsheet');

  // Live Console Seating Sub-segment ('canvas' | 'tables' | 'unseated')
  const [seatingSubTab, setSeatingSubTab] = useState<'canvas' | 'tables' | 'unseated'>('canvas');
  const [selectedMobileTableId, setSelectedMobileTableId] = useState<string | null>(null);
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);

  // Saved Seating Arrangements (Synchronized with Couple & MC Pro)
  const savedArrangements: SavedSeatingArrangement[] = (activeWedding as any)?.savedSeatingArrangements || [];
  const [activeArrangementId, setActiveArrangementId] = useState<string>(
    savedArrangements[0]?.id || 'arr_1'
  );
  const [activeArrangementName, setActiveArrangementName] = useState<string>(
    savedArrangements[0]?.name || 'Seating Arrangement 1 (Classic Ballroom)'
  );
  const [showSaveArrangementModal, setShowSaveArrangementModal] = useState<boolean>(false);
  const [showCompareArrangementsModal, setShowCompareArrangementsModal] = useState<boolean>(false);
  const [newArrangementName, setNewArrangementName] = useState<string>('');
  const [newArrangementNotes, setNewArrangementNotes] = useState<string>('');

  // Dance Floor Position & Dragging State
  const [danceFloorPos, setDanceFloorPos] = useState<{ x: number; y: number }>(() => {
    return (activeWedding as any)?.danceFloorPos || { x: 50, y: 50 };
  });
  const [isDraggingDanceFloor, setIsDraggingDanceFloor] = useState<boolean>(false);

  // Sync dance floor and active arrangement when active wedding changes
  useEffect(() => {
    if ((activeWedding as any)?.danceFloorPos) {
      setDanceFloorPos((activeWedding as any).danceFloorPos);
    }
    if ((activeWedding as any)?.savedSeatingArrangements?.length) {
      const arr = (activeWedding as any).savedSeatingArrangements[0];
      setActiveArrangementId(arr.id);
      setActiveArrangementName(arr.name);
    }
  }, [currentWeddingId]);

  // Filter & Search states
  const [runSheetFilter, setRunSheetFilter] = useState<'all' | 'upcoming' | 'done'>('all');
  const [cueSearch, setCueSearch] = useState('');
  const [guestSearch, setGuestSearch] = useState('');
  const [guestRsvpFilter, setGuestRsvpFilter] = useState<'all' | 'confirmed' | 'awaiting' | 'declined'>('all');
  const [mobileGuestViewMode, setMobileGuestViewMode] = useState<'individual' | 'family'>('individual');
  const [cateringSearch, setCateringSearch] = useState('');

  // Add cue modal states
  const [showAddCueModal, setShowAddCueModal] = useState(false);
  const [newCueTime, setNewCueTime] = useState('17:00');
  const [newCueActivity, setNewCueActivity] = useState('');
  const [newCueNotes, setNewCueNotes] = useState('');
  const [newCuePrivateNotes, setNewCuePrivateNotes] = useState('');

  // Task input state for Overview
  const [newTaskInput, setNewTaskInput] = useState('');

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

  // Checklist items
  const [techChecklist, setTechChecklist] = useState({
    micA: true,
    micB: true,
    lapel: true,
    uplighting: false,
  });



  // Dynamic Calendar State
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 10, 1));
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(14);

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    setSelectedCalendarDay(null);
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    setSelectedCalendarDay(null);
  };

  // Profile settings form
  const [profileForm, setProfileForm] = useState({
    name: 'Robert Galati',
    role: 'Executive Lead Event Host',
    agency: 'Galati Events & Entertainment',
    bio: 'Years orchestrating luxury weddings across Sydney and the Southern Highlands. Renowned for seamless run-sheet flow, magnetic crowd engagement, and bilingual announcements.',
    phone: '+61 418 223 901',
    email: 'robert@galati.demo',
    website: 'www.galatievents.com.au',
  });

  // Seating Modal & Cheers AI States
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableShape, setNewTableShape] = useState<TableShape>('round');
  const [newTableCapacity, setNewTableCapacity] = useState(10);
  const [newTableCategory, setNewTableCategory] = useState('Family');

  interface MobileSeedTableCard {
    id: string;
    name: string;
    type: string;
    customType?: string;
    seats: number;
    location: string;
    customLocation?: string;
    reserved: string;
    customReserved?: string;
    isHead?: boolean;
  }

  // Interactive Cheers AI Chatbot in Mobile View
  const [isCheersChatOpen, setIsCheersChatOpen] = useState(false);
  const [cheersChatInput, setCheersChatInput] = useState('');
  const [cheersMessages, setCheersMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'cheers';
    text: string;
    timestamp: string;
    proposal?: {
      title: string;
      desc: string;
      count: number;
      changes: { guestId: string; tableId: string }[];
    };
    isApplied?: boolean;
    status?: 'pending' | 'confirmed' | 'rejected';
  }>>([
    {
      id: 'msg_welcome',
      sender: 'cheers',
      text: "Hello! I'm Cheers AI, your dedicated mobile seating concierge. I can group families together, seat VIPs at the head table, cluster dietary requirements, or help you seed tables. What would you like to arrange today?",
      timestamp: 'Just now',
    },
  ]);

  const [showCheersAiModal, setShowCheersAiModal] = useState(false);
  const [activeAiScenario, setActiveAiScenario] = useState<'households' | 'vips' | 'fill' | 'dietary'>('households');
  const [aiProposal, setAiProposal] = useState<{
    title: string;
    desc: string;
    count: number;
    changes: { guestId: string; tableId: string }[];
  } | null>(null);
  const [aiProposalStatus, setAiProposalStatus] = useState<'pending' | 'confirmed' | 'rejected'>('pending');

  // Mobile Seed Table Form State — 4 Essential Sections & Table Configuration
  const [showSeatingConfigModal, setShowSeatingConfigModal] = useState(false);
  const [configTableCount, setConfigTableCount] = useState(8);
  const [configSeatsPerTable, setConfigSeatsPerTable] = useState(10);
  const [configTableType, setConfigTableType] = useState<string>('Round Banquet');
  const [configCustomTableType, setConfigCustomTableType] = useState<string>('');
  const [configTableLocation, setConfigTableLocation] = useState<string>('Near Stage');
  const [configCustomLocation, setConfigCustomLocation] = useState<string>('');
  const [configReservedUse, setConfigReservedUse] = useState<string>('General Seating');
  const [configCustomReservedUse, setConfigCustomReservedUse] = useState<string>('');
  const [configTableShape, setConfigTableShape] = useState<'round' | 'rectangular' | 'king' | 'hybrid'>('round');
  const [configDietaryStrategy, setConfigDietaryStrategy] = useState<'cluster' | 'distributed' | 'vip_first' | 'standard'>('cluster');

  // Section 2: Guest Groups
  const [configFamilyGrouping, setConfigFamilyGrouping] = useState<'side_by_side' | 'separate' | 'combined'>('side_by_side');
  const [configSocialGrouping, setConfigSocialGrouping] = useState<'social_circles' | 'integrated_mix' | 'vip_proximity'>('social_circles');
  const [configChildrenGrouping, setConfigChildrenGrouping] = useState<'with_parents' | 'kids_table' | 'flexible_pods'>('with_parents');

  // Section 3: Seating Preferences
  const [configSitTogether, setConfigSitTogether] = useState<'couples_families' | 'households_strict' | 'friend_duos'>('couples_families');
  const [configSitSeparately, setConfigSitSeparately] = useState<'conflicts_buffer' | 'ex_partners' | 'none'>('conflicts_buffer');
  const [configFamilyCouplesChildren, setConfigFamilyCouplesChildren] = useState<'strict_family_unit' | 'young_kids_only' | 'standard'>('strict_family_unit');

  // Section 4: Special Seating Rules
  const [configIncludeHeadTable, setConfigIncludeHeadTable] = useState(true);
  const [configReserveVipTables, setConfigReserveVipTables] = useState(true);

  // Mobile Seed Tables Inventory
  const [mobileSeedTables, setMobileSeedTables] = useState<MobileSeedTableCard[]>([
    {
      id: 'mst_head',
      name: 'Head Table',
      type: 'Round Banquet',
      seats: 8,
      location: 'Near Stage',
      reserved: 'Head Table',
      isHead: true,
    },
    {
      id: 'mst_1',
      name: 'Table 1',
      type: 'Round Banquet',
      seats: 10,
      location: 'Near Stage',
      reserved: 'VIP Table',
      isHead: false,
    },
    {
      id: 'mst_2',
      name: 'Table 2',
      type: 'Round Banquet',
      seats: 10,
      location: 'Near Stage',
      reserved: 'VIP Table',
      isHead: false,
    },
    {
      id: 'mst_3',
      name: 'Table 3',
      type: 'Round Banquet',
      seats: 10,
      location: 'Dance Floor',
      reserved: "Bride's Family",
      isHead: false,
    },
    {
      id: 'mst_4',
      name: 'Table 4',
      type: 'Round Banquet',
      seats: 10,
      location: 'Dance Floor',
      reserved: "Groom's Family",
      isHead: false,
    },
    {
      id: 'mst_5',
      name: 'Table 5',
      type: 'Round Banquet',
      seats: 10,
      location: 'Quiet Area',
      reserved: 'General Seating',
      isHead: false,
    },
    {
      id: 'mst_6',
      name: 'Table 6',
      type: 'Round Banquet',
      seats: 10,
      location: 'Entrance',
      reserved: 'General Seating',
      isHead: false,
    },
    {
      id: 'mst_7',
      name: 'Table 7',
      type: 'Round Banquet',
      seats: 10,
      location: 'Kitchen/Service Area',
      reserved: 'General Seating',
      isHead: false,
    },
    {
      id: 'mst_8',
      name: 'Table 8',
      type: 'Round Banquet',
      seats: 10,
      location: 'Accessible Area',
      reserved: 'Accessible Seating',
      isHead: false,
    },
  ]);

  const [editingMobileGroupId, setEditingMobileGroupId] = useState<string | null>(null);

  // Grouping logic for mobile seed tables: identical column info collapses into 1 entry
  const mobileSeedTableGroups = React.useMemo(() => {
    interface MobileTableGroup {
      groupKey: string;
      tableIds: string[];
      displayName: string;
      count: number;
      type: string;
      customType?: string;
      seats: number;
      location: string;
      customLocation?: string;
      reserved: string;
      customReserved?: string;
      isHead: boolean;
    }

    const groups: MobileTableGroup[] = [];
    const map = new Map<string, MobileTableGroup>();

    for (const tbl of mobileSeedTables) {
      const displayType = tbl.type === 'Custom' ? (tbl.customType || 'Custom') : tbl.type;
      const displayLoc = tbl.location === 'Custom Location' ? (tbl.customLocation || 'Custom') : tbl.location;
      const displayRes = tbl.reserved === 'Custom' ? (tbl.customReserved || 'Custom') : tbl.reserved;
      const key = `${displayType}:::${tbl.seats}:::${displayLoc}:::${displayRes}:::${tbl.isHead ? 'head' : 'regular'}`;

      if (!map.has(key)) {
        const newGroup: MobileTableGroup = {
          groupKey: key,
          tableIds: [tbl.id],
          displayName: tbl.name,
          count: 1,
          type: tbl.type,
          customType: tbl.customType,
          seats: tbl.seats,
          location: tbl.location,
          customLocation: tbl.customLocation,
          reserved: tbl.reserved,
          customReserved: tbl.customReserved,
          isHead: !!tbl.isHead,
        };
        map.set(key, newGroup);
        groups.push(newGroup);
      } else {
        const existing = map.get(key)!;
        existing.tableIds.push(tbl.id);
        existing.count += 1;
      }
    }

    for (const grp of groups) {
      const matching = mobileSeedTables.filter(t => grp.tableIds.includes(t.id));
      const names = matching.map(t => t.name);
      if (names.length === 1) {
        grp.displayName = names[0];
      } else {
        const numbers: number[] = [];
        let allNumbered = true;
        for (const n of names) {
          const m = n.match(/^Table\s+(\d+)$/i);
          if (m) {
            numbers.push(parseInt(m[1], 10));
          } else {
            allNumbered = false;
            break;
          }
        }
        if (allNumbered && numbers.length > 0) {
          numbers.sort((a, b) => a - b);
          grp.displayName = `Table ${numbers.join(', ')}`;
        } else {
          grp.displayName = names.join(', ');
        }
      }
    }

    return groups;
  }, [mobileSeedTables]);

  const totalMobilePlannedCapacity = React.useMemo(() => {
    return mobileSeedTables.reduce((acc, t) => acc + (Number(t.seats) || 0), 0);
  }, [mobileSeedTables]);

  const handleUpdateMobileTableGroup = (tableIds: string[], updates: Partial<MobileSeedTableCard>) => {
    setMobileSeedTables((prev) =>
      prev.map((t) => (tableIds.includes(t.id) ? { ...t, ...updates } : t))
    );
  };

  const handleDeleteMobileTableGroup = (tableIds: string[]) => {
    if (mobileSeedTables.length <= tableIds.length) {
      showToast('At least one table must remain in your floor plan.', 'error');
      return;
    }
    setMobileSeedTables((prev) => prev.filter((t) => !tableIds.includes(t.id)));
    setConfigTableCount((prev) => Math.max(1, prev - tableIds.length));
    showToast('Table entry removed from setup', 'info');
  };

  const handleAddMobileConfiguredTables = (count: number = 1) => {
    const toAdd: MobileSeedTableCard[] = [];
    let currentNonHead = mobileSeedTables.filter((t) => !t.isHead).length;
    for (let i = 0; i < count; i++) {
      currentNonHead += 1;
      const isHead = configReservedUse === 'Head Table' && !mobileSeedTables.some(t => t.isHead) && i === 0;
      toAdd.push({
        id: `mst_custom_${Date.now()}_${i}`,
        name: isHead ? 'Head Table' : `Table ${currentNonHead}`,
        type: configTableType,
        customType: configCustomTableType || undefined,
        seats: configSeatsPerTable,
        location: configTableLocation,
        customLocation: configCustomLocation || undefined,
        reserved: configReservedUse,
        customReserved: configCustomReservedUse || undefined,
        isHead,
      });
    }
    setMobileSeedTables((prev) => [...prev, ...toAdd]);
    showToast(`Added ${count} table${count > 1 ? 's' : ''} to floor setup`, 'success');
  };

  const handleAddMobileSeedTable = (overrideSeats?: number) => {
    const nextNum = mobileSeedTables.filter((t) => !t.isHead).length + 1;
    const newTbl: MobileSeedTableCard = {
      id: `mst_custom_${Date.now()}`,
      name: `Table ${nextNum}`,
      type: configTableType,
      customType: configCustomTableType || undefined,
      seats: overrideSeats && overrideSeats > 0 ? overrideSeats : configSeatsPerTable,
      location: configTableLocation,
      customLocation: configCustomLocation || undefined,
      reserved: configReservedUse,
      customReserved: configCustomReservedUse || undefined,
      isHead: false,
    };
    setMobileSeedTables((prev) => [...prev, newTbl]);
    setConfigTableCount((prev) => prev + 1);
  };

  // Joey Chatbot inside Mobile
  const [showJoey, setShowJoey] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile({
      name: file.name,
      size: file.size,
      type: file.type || 'document',
    });
    showToast(`Attached: ${file.name}`, 'info');
  };

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'joey' | 'user';
    text: string;
    time: string;
    attachment?: {
      name: string;
      size: number;
      type: string;
    };
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
      text: 'How may I help you with the wedding schedule, seating canvas, or catering dietary summary?',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // -------------------------------------------------------------
  // Derived Wedding Metrics & Guests / Tables
  // -------------------------------------------------------------
  const weddingGuests = (state.guests || []).filter(g => (g.weddingId || 'w1') === currentWeddingId);
  const weddingTables = (state.tables || []).filter(t => (t.weddingId || 'w1') === currentWeddingId);
  const confirmedGuests = weddingGuests.filter(g => g.rsvpStatus === 'confirmed');
  const pendingGuests = weddingGuests.filter(g => g.rsvpStatus === 'awaiting');
  const declinedGuests = weddingGuests.filter(g => g.rsvpStatus === 'declined');
  const seatedGuestsCount = weddingGuests.filter(g => g.tableId).length;
  const unassignedGuests = weddingGuests.filter(g => !g.tableId && g.rsvpStatus !== 'declined');
  const confirmedGuestsCount = weddingGuests.filter((g) => g.rsvpStatus !== 'declined').length;
  const uniqueHouseholdsCount = new Set(weddingGuests.map((g) => g.household).filter(Boolean)).size;
  const dietaryGuestsCount = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary.trim() !== '').length;
  const suggestedMobileTables = Math.max(1, Math.ceil(Math.max(1, confirmedGuestsCount - (configIncludeHeadTable ? 8 : 0)) / configSeatsPerTable));

  const mobileCapacityShortfall = Math.max(0, confirmedGuestsCount - totalMobilePlannedCapacity);
  const isMobileCapacitySufficient = totalMobilePlannedCapacity >= confirmedGuestsCount;

  // Aggregated Family Groups for Mobile Guest List
  const mobileFamilyGroups = React.useMemo(() => {
    const map = new Map<string, Guest[]>();
    weddingGuests.forEach(g => {
      const key = (g.household || g.name).trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    });
    const groups: Array<{
      id: string;
      householdKey: string;
      familyName: string;
      members: Guest[];
      memberNames: string;
      category: string;
      rsvpStatus: 'confirmed' | 'declined' | 'awaiting';
      adultsCount: number;
      kidsCount: number;
      partyTotal: number;
      dietarySummary: string;
      tableLabel: string;
      initials: string;
    }> = [];

    map.forEach((members, householdKey) => {
      const primary = members[0];
      let adultsCount = 0;
      let kidsCount = 0;
      members.forEach(m => {
        const isChild = (m.kids || 0) > 0 && (!m.adults || m.adults === 0);
        if (isChild) kidsCount += 1;
        else adultsCount += 1;
      });
      let partyTotal = adultsCount + kidsCount;

      const dietCounts: Record<string, number> = {};
      members.forEach(m => {
        const parsed = parseDietaryRequirements(m.dietary);
        parsed.forEach(d => {
          const clean = d.replace(/^\d+x\s*/i, '').trim();
          if (clean) dietCounts[clean] = (dietCounts[clean] || 0) + 1;
        });
      });
      const dietEntries = Object.entries(dietCounts);
      let dietarySummary =
        dietEntries.length > 0
          ? dietEntries.map(([diet, count]) => `${count}x ${diet}`).join(', ')
          : 'None';

      const allConfirmed = members.every(m => m.rsvpStatus === 'confirmed');
      const allDeclined = members.every(m => m.rsvpStatus === 'declined');
      const rsvpStatus = allConfirmed ? 'confirmed' : allDeclined ? 'declined' : 'awaiting';

      const seated = members.filter(m => m.tableId);
      const tbl = seated.length > 0 ? weddingTables.find(t => t.id === seated[0].tableId) : null;
      let tableLabel = tbl ? tbl.name : 'Unassigned';

      let familyName = householdKey;
      if (!familyName || familyName.trim() === '' || familyName.toLowerCase() === 'individual' || familyName === members[0].name) {
        const parts = members[0].name.trim().split(' ');
        const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
        familyName = lastName ? `The ${lastName} Family` : `${members[0].name} Household`;
      }
      const memberNames = members.map(m => m.name).join(', ');

      const FAMILY_DEMO_PRESETS: Record<string, { adults: number; kids: number; dietary: string; table: string }> = {
        'uncle david household': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'Table 6' },
        'uncle david': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'Table 6' },
        'the johnson family': { adults: 2, kids: 2, dietary: 'Vegetarian, Gluten-Free', table: 'Table 4' },
        'the sharma family': { adults: 2, kids: 2, dietary: 'Vegetarian, Nut allergy', table: 'Table 4' },
        'the chen family': { adults: 3, kids: 2, dietary: 'Vegan, Nut allergy', table: 'Table 1' },
        'the whitfield family': { adults: 2, kids: 3, dietary: 'Vegan, Gluten-Free', table: 'Table 5' },
        'the whitfield household': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'Table 6' },
        'the o\'neill family': { adults: 2, kids: 1, dietary: 'Nut allergy, Dairy-Free', table: 'Table 2' },
        'the bell family': { adults: 2, kids: 2, dietary: 'Vegetarian, Halal', table: 'Head Table' },
        'the gordon family': { adults: 2, kids: 1, dietary: 'Vegan, Nut allergy', table: 'Head Table' },
        'the martin family': { adults: 3, kids: 1, dietary: 'Vegetarian, Gluten-Free', table: 'Head Table' },
        'the vance family': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'Head Table' },
      };

      const preset = FAMILY_DEMO_PRESETS[householdKey.toLowerCase()] || FAMILY_DEMO_PRESETS[familyName.toLowerCase()];
      if (preset) {
        adultsCount = preset.adults;
        kidsCount = preset.kids;
        partyTotal = adultsCount + kidsCount;
        dietarySummary = preset.dietary;
        if (!tbl || tableLabel === 'Unassigned') {
          tableLabel = preset.table;
        }
      } else if (adultsCount <= 1 && kidsCount === 0) {
        adultsCount = 2;
        kidsCount = 2;
        partyTotal = 4;
        if (dietarySummary === 'None') dietarySummary = 'Vegetarian, Nut allergy';
        if (!tbl || tableLabel === 'Unassigned') tableLabel = 'Table 4';
      }

      groups.push({
        id: `fam_${householdKey.replace(/[^a-zA-Z0-9]/g, '_')}`,
        householdKey,
        familyName,
        members,
        memberNames,
        category: primary.category || 'Uncategorised',
        rsvpStatus,
        adultsCount,
        kidsCount,
        partyTotal,
        dietarySummary,
        tableLabel,
        initials: householdKey.replace(/The\s+/i, '').slice(0, 2).toUpperCase() || 'FM',
      });
    });

    return groups;
  }, [weddingGuests, weddingTables]);

  // Dietary counts
  const vegCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('veg') && !(g.dietary || '').toLowerCase().includes('vegan')).length;
  const veganCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegan')).length;
  const gfCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('gluten') || (g.dietary || '').toLowerCase().includes('celiac')).length;
  const nutCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('nut')).length;
  const otherDietCount = confirmedGuests.filter(g => {
    const d = (g.dietary || '').toLowerCase().trim();
    return d !== '' && d !== 'none' && !d.includes('veg') && !d.includes('gluten') && !d.includes('celiac') && !d.includes('nut');
  }).length;

  const countdown = getWeddingCountdown(activeWedding.date);

  // -------------------------------------------------------------
  // Mobile Floor Plan Canvas Touch & Drag Handlers
  // -------------------------------------------------------------
  const handleTableCanvasDrop = (e: React.DragEvent, containerRect: DOMRect) => {
    e.preventDefault();
    if (isDraggingDanceFloor) {
      const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
      const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);
      const clampedX = Math.max(16, Math.min(84, relX));
      const clampedY = Math.max(18, Math.min(82, relY));
      setDanceFloorPos({ x: clampedX, y: clampedY });
      setIsDraggingDanceFloor(false);
      showToast('Dance Floor repositioned', 'info');
      return;
    }
    if (!draggingTableId) return;

    const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
    const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);

    const clampedX = Math.max(14, Math.min(86, relX));
    const clampedY = Math.max(16, Math.min(84, relY));

    const updatedTables = (state.tables || []).map((t) =>
      t.id === draggingTableId ? { ...t, mobileX: clampedX, mobileY: clampedY } : t
    );
    setState({ ...state, tables: updatedTables });
    setDraggingTableId(null);
    showToast('Table position updated on canvas', 'info');
  };

  const handleTouchMoveTable = (e: React.TouchEvent, tblId: string) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const el = document.getElementById('mobile_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(14, Math.min(86, Math.round(relX)));
    const clampedY = Math.max(16, Math.min(84, Math.round(relY)));

    const updatedTables = (state.tables || []).map((t) =>
      t.id === tblId ? { ...t, mobileX: clampedX, mobileY: clampedY } : t
    );
    setState({ ...state, tables: updatedTables });
  };

  const handleTouchStartDanceFloor = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDraggingDanceFloor(true);
  };

  const handleTouchMoveDanceFloor = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const el = document.getElementById('mobile_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(16, Math.min(84, Math.round(relX)));
    const clampedY = Math.max(18, Math.min(82, Math.round(relY)));
    setDanceFloorPos({ x: clampedX, y: clampedY });
  };

  const handleTouchEndDanceFloor = () => {
    setIsDraggingDanceFloor(false);
  };

  const handlePointerDownDanceFloor = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setIsDraggingDanceFloor(true);
  };

  const handlePointerMoveDanceFloor = (e: React.PointerEvent) => {
    if (!isDraggingDanceFloor) return;
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById('mobile_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(16, Math.min(84, Math.round(relX)));
    const clampedY = Math.max(18, Math.min(82, Math.round(relY)));
    setDanceFloorPos({ x: clampedX, y: clampedY });
  };

  const handlePointerUpDanceFloor = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDraggingDanceFloor(false);
  };

  const handleLoadArrangement = (arrId: string) => {
    const arr = savedArrangements.find((a) => a.id === arrId);
    if (!arr) return;

    const updatedTables = arr.tables && arr.tables.length > 0 ? arr.tables.map(t => ({ ...t })) : state.tables;
    const updatedGuests = (state.guests || []).map((g) => {
      const match = arr.guestAssignments?.find((a) => a.guestId === g.id);
      if (match) {
        return { ...g, tableId: match.tableId || null, seatIndex: match.seatIndex || null };
      }
      return g;
    });

    if (arr.danceFloorPos) {
      setDanceFloorPos(arr.danceFloorPos);
    }

    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: 'Seating Arrangement Switched',
      user: 'Robert Galati (MC)',
      role: 'mc',
      category: 'Seating',
      details: `Switched active floor plan to "${arr.name}" in MC Mobile Console. Synchronized with couple console.`,
    };

    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        return {
          ...w,
          danceFloorPos: arr.danceFloorPos ? { ...arr.danceFloorPos } : (w as any).danceFloorPos,
        };
      }
      return w;
    });

    setState({
      ...state,
      tables: updatedTables,
      guests: updatedGuests,
      weddings: updatedWeddings,
      auditLog: [auditEntry, ...(state.auditLog || [])],
    });

    setActiveArrangementId(arr.id);
    setActiveArrangementName(arr.name);
    if (showCompareArrangementsModal) setShowCompareArrangementsModal(false);
    showToast(`Loaded "${arr.name}"`, 'info');
  };

  const handleSaveArrangement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const defaultName = `Seating Arrangement ${savedArrangements.length + 1}`;
    const finalName = newArrangementName.trim() || defaultName;

    const newArr: SavedSeatingArrangement = {
      id: `arr_${Date.now()}`,
      weddingId: currentWeddingId,
      name: finalName,
      savedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      savedBy: 'Robert Galati (MC)',
      role: 'mc',
      danceFloorPos: { ...danceFloorPos },
      notes: newArrangementNotes.trim() || `Mobile snapshot with ${weddingTables.length} tables and ${seatedGuestsCount} seated guests.`,
      tables: weddingTables.map(t => ({ ...t })),
      guestAssignments: weddingGuests.map(g => ({
        guestId: g.id,
        tableId: g.tableId || null,
        seatIndex: g.seatIndex || null,
      })),
    };

    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: 'Seating Arrangement Saved',
      user: 'Robert Galati (MC)',
      role: 'mc',
      category: 'Seating',
      details: `Saved seating layout "${newArr.name}" via MC Mobile Console for ${activeWedding.couple}. Synced with Couple console.`,
    };

    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        const existing = (w as any).savedSeatingArrangements || [];
        return {
          ...w,
          danceFloorPos: { ...danceFloorPos },
          savedSeatingArrangements: [newArr, ...existing],
        };
      }
      return w;
    });

    setState({
      ...state,
      weddings: updatedWeddings,
      auditLog: [auditEntry, ...(state.auditLog || [])],
    });

    setActiveArrangementId(newArr.id);
    setActiveArrangementName(newArr.name);
    setShowSaveArrangementModal(false);
    setNewArrangementName('');
    setNewArrangementNotes('');
    showToast(`✓ Seating layout "${newArr.name}" saved!`, 'success');
  };

  // Helper for responsive mobile table coordinates around the dance floor
  const getMobileTableCoords = (tbl: Table, idx: number) => {
    if (typeof tbl.mobileX === 'number' && typeof tbl.mobileY === 'number') {
      return { x: tbl.mobileX, y: tbl.mobileY };
    }
    if (tbl.isHead || tbl.id === 'head' || tbl.name.toLowerCase().includes('head')) {
      return { x: 50, y: 15 };
    }
    const presetMobileCoords: { [key: number]: { x: number; y: number } } = {
      0: { x: 23, y: 34 },
      1: { x: 77, y: 34 },
      2: { x: 19, y: 55 },
      3: { x: 81, y: 55 },
      4: { x: 24, y: 78 },
      5: { x: 76, y: 78 },
      6: { x: 50, y: 88 },
    };
    return presetMobileCoords[idx % 7] || { x: 20 + (idx % 3) * 30, y: 35 + Math.floor(idx / 3) * 20 };
  };

  // -------------------------------------------------------------
  // Run Sheet Sync with activeWedding.privateRunSheet
  // -------------------------------------------------------------
  const weddingRunSheet: PrivateRunSheetItem[] = (activeWedding.privateRunSheet && activeWedding.privateRunSheet.length > 0)
    ? activeWedding.privateRunSheet
    : [
        {
          id: 'c1',
          time: '13:30',
          activity: 'Arrival, audio check with AV tech & Celebrant',
          notes: 'Audio check on Meadow Lawn sound system',
          privateNotes: 'Check wireless handheld mic A & B battery level.',
          done: true,
          order: 1,
        },
        {
          id: 'c2',
          time: '14:00',
          activity: 'Guest seating & ceremony processional commence',
          notes: 'Ceremony processional commences',
          privateNotes: 'Cue Celebrant Sarah with lapel mic transceiver.',
          done: false,
          order: 2,
        },
        {
          id: 'c3',
          time: '14:45',
          activity: 'Announce cocktail hour, direct guests to verandah',
          notes: 'Direct guests to garden verandah for champagne & canapes',
          privateNotes: 'Direct bridal party to estate vineyard for photography.',
          done: false,
          order: 3,
        },
        {
          id: 'c4',
          time: '17:30',
          activity: 'Grand entrance of newlyweds',
          notes: 'Welcome newlyweds Sophie & James with bridal party applause',
          privateNotes: 'Cue DJ track #4 (Upbeat grand entrance).',
          done: false,
          order: 4,
        },
        {
          id: 'c5',
          time: '18:15',
          activity: 'Welcome speeches & Father of the Bride toast',
          notes: 'First speeches block before entree service',
          privateNotes: 'Roving mic to Father of the Bride (David). Have spare mic ready.',
          done: false,
          order: 5,
        },
      ];

  const updateWeddingRunSheet = (newCues: PrivateRunSheetItem[]) => {
    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        return { ...w, privateRunSheet: newCues };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  const toggleCueDone = (id: string) => {
    const updated = weddingRunSheet.map((c) => (c.id === id ? { ...c, done: !c.done } : c));
    updateWeddingRunSheet(updated);
  };

  const moveCue = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === weddingRunSheet.length - 1)) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const copy = [...weddingRunSheet];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    updateWeddingRunSheet(copy);
  };

  const deleteCue = (id: string) => {
    const updated = weddingRunSheet.filter((c) => c.id !== id);
    updateWeddingRunSheet(updated);
    showToast('Cue removed from run sheet', 'info');
  };

  const handleAddCueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCueActivity.trim()) {
      showToast('Please enter an activity title', 'error');
      return;
    }
    const newCue: PrivateRunSheetItem = {
      id: 'c_' + Date.now(),
      time: newCueTime.trim() || '17:00',
      activity: newCueActivity.trim(),
      notes: newCueNotes.trim(),
      privateNotes: newCuePrivateNotes.trim(),
      done: false,
      order: weddingRunSheet.length + 1,
    };
    updateWeddingRunSheet([...weddingRunSheet, newCue]);
    setShowAddCueModal(false);
    setNewCueActivity('');
    setNewCueNotes('');
    setNewCuePrivateNotes('');
    showToast(`Added cue: ${newCue.activity}`, 'success');
  };

  // -------------------------------------------------------------
  // Wedding Tasks for Overview
  // -------------------------------------------------------------
  const weddingTasks = activeWedding.tasks || [
    { id: 't1', text: 'Confirm final guest RSVP list & dietary flags', completed: true, due: 'This week' },
    { id: 't2', text: 'Audio check: wireless roving mics & lapel transceivers', completed: true, due: 'This week' },
    { id: 't3', text: 'Confirm run sheet cues with DJ and Venue Manager', completed: true, due: 'This week' },
    { id: 't4', text: 'Review head table banquet layout & VIP placements', completed: false, due: 'This week' },
    { id: 't5', text: 'Coordinate first dance lighting & grand entrance track', completed: false, due: 'This week' },
  ];

  const handleToggleTask = (taskId: string) => {
    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        const currentTasks = w.tasks || weddingTasks;
        const updatedTasks = currentTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
        return { ...w, tasks: updatedTasks };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: 't_' + Date.now(),
      text: newTaskInput.trim(),
      completed: false,
      due: 'This week',
    };
    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        const currentTasks = w.tasks || weddingTasks;
        return { ...w, tasks: [...currentTasks, newTask] };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
    setNewTaskInput('');
    showToast(`Added task: ${newTask.text}`, 'success');
  };

  // -------------------------------------------------------------
  // Cheers AI Seating Recommendations Engine & Mobile Chatbot
  // -------------------------------------------------------------
  const executeMobileAiScenario = (scenario: 'households' | 'vips' | 'fill' | 'dietary') => {
    setActiveAiScenario(scenario);
    let title = '';
    let desc = '';
    const proposedChanges: { guestId: string; tableId: string }[] = [];

    const availableTables = weddingTables.map((t) => ({
      ...t,
      currentCount: weddingGuests.filter((g) => g.tableId === t.id).length,
    }));

    const unassigned = weddingGuests.filter((g) => !g.tableId && g.rsvpStatus !== 'declined');

    if (scenario === 'vips') {
      title = 'Seat VIPs & Bridal Party at Head Table';
      desc = 'Recommended placement for wedding party and immediate VIPs at Head Table with premier visibility.';

      const headTbl = availableTables.find((t) => t.isHead || t.name.toLowerCase().includes('head')) || availableTables[0];
      if (headTbl) {
        const vipNames = ['Sophie Bell', 'James Gordon', 'Hannah Martin', 'Oliver Vance', 'Charlotte Evans', 'Liam Fletcher', 'Grace Kelly', 'Alexander White'];
        const matchedVips = unassigned.filter((g) =>
          vipNames.some((vn) => g.name.toLowerCase().includes(vn.toLowerCase())) ||
          (g.household && (g.household.toLowerCase().includes('bell') || g.household.toLowerCase().includes('gordon'))) ||
          g.category === 'Bridal Party'
        );
        const candidates = matchedVips.length > 0 ? matchedVips : unassigned.slice(0, headTbl.capacity);
        candidates.slice(0, headTbl.capacity).forEach((g) => {
          if (headTbl.currentCount < headTbl.capacity) {
            proposedChanges.push({ guestId: g.id, tableId: headTbl.id });
            headTbl.currentCount++;
          }
        });
      }
    } else if (scenario === 'dietary') {
      title = 'Group Dietary Requirements for Catering';
      desc = 'Placed guests requiring Vegetarian, Vegan, Halal, or Gluten-Free meals at dedicated tables to assist banquet catering service.';

      const dietaryGuests = unassigned.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary !== '');
      const vegTable = availableTables.find((t) => t.name.includes('Table 2') || t.name.includes('Table 4') || t.name.includes('Garden')) || availableTables[1] || availableTables[0];

      if (vegTable) {
        dietaryGuests.forEach((g) => {
          if (vegTable.currentCount < vegTable.capacity) {
            proposedChanges.push({ guestId: g.id, tableId: vegTable.id });
            vegTable.currentCount++;
          }
        });
      }
    } else if (scenario === 'households') {
      title = 'Group Households & Families Together';
      desc = 'Scanned all unassigned guests and matched families into tables with sufficient capacity so households remain seated together.';

      const hhMap = new Map<string, typeof unassigned>();
      unassigned.forEach((g) => {
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
      if (proposedChanges.length === 0 && unassigned.length > 0) {
        const tbl = availableTables[0];
        if (tbl) {
          unassigned.slice(0, Math.min(8, tbl.capacity)).forEach(g => {
            proposedChanges.push({ guestId: g.id, tableId: tbl.id });
          });
        }
      }
    } else {
      title = 'Fill Table Vacancies Evenly';
      desc = 'Evenly distributed unassigned guests across tables with available vacancies to maintain balanced room density.';

      unassigned.forEach((g) => {
        const candidate = availableTables.find((t) => t.currentCount < t.capacity);
        if (candidate) {
          proposedChanges.push({ guestId: g.id, tableId: candidate.id });
          candidate.currentCount++;
        }
      });
    }

    return {
      title,
      desc,
      count: proposedChanges.length,
      changes: proposedChanges,
    };
  };

  const handleCheersChatAction = (action: 'households' | 'vips' | 'fill' | 'dietary' | 'audit' | 'seed' | 'reset') => {
    if (action === 'seed') {
      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '🌱 Open Table Seeding Form', timestamp: 'Just now' },
        { id: 'ch_' + Date.now(), sender: 'cheers', text: 'Opening the Table Seeding form for you to configure table types, seats per table, and room assignments.', timestamp: 'Just now' },
      ]);
      setShowSeatingConfigModal(true);
      return;
    }

    if (action === 'audit') {
      const seatedCount = weddingGuests.filter((g) => g.tableId).length;
      const unassignedCount = weddingGuests.filter((g) => !g.tableId && g.rsvpStatus !== 'declined').length;
      const totalCapacity = weddingTables.reduce((acc, t) => acc + (t.capacity || 0), 0);
      const dietaryCount = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary !== '').length;

      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '📊 Audit room capacity & seating balance', timestamp: 'Just now' },
        {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: `Room Audit Summary for ${activeWedding.couple}:\n• Total Guests: ${confirmedGuestsCount}\n• Currently Seated: ${seatedCount} / ${totalCapacity} seats (${Math.round((seatedCount / (totalCapacity || 1)) * 100)}% capacity)\n• Unassigned Guests: ${unassignedCount}\n• Active Tables: ${weddingTables.length}\n• Dietary Requirements: ${dietaryCount} guests`,
          timestamp: 'Just now',
        },
      ]);
      return;
    }

    if (action === 'reset') {
      const updatedGuests = (state.guests || []).map((g) =>
        (g.weddingId || 'w1') === currentWeddingId ? { ...g, tableId: null, seatIndex: null } : g
      );
      setState({ ...state, guests: updatedGuests });
      showToast('All guest table assignments have been reset', 'info');
      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '🧹 Reset all table assignments', timestamp: 'Just now' },
        { id: 'ch_' + Date.now(), sender: 'cheers', text: 'All seating assignments have been cleared. All guests are now in the unallocated list ready for fresh organization.', timestamp: 'Just now' },
      ]);
      return;
    }

    const proposal = executeMobileAiScenario(action);
    const actionLabel = action === 'households' ? 'Group households & families' : action === 'vips' ? 'Seat VIPs at Head Table' : action === 'dietary' ? 'Cluster dietary requirements' : 'Auto-fill vacant seats';

    let introText = '';
    if (action === 'vips') {
      introText = `👑 VIP & Head Table Recommendation:\nI've prepared ${proposal.count} seating allocations for the bridal party and immediate family at the Head Table.\n\nReview the proposed allocations below and tap 'Confirm & Auto-Seat' to apply them.`;
    } else if (action === 'dietary') {
      introText = `🥗 Catering & Dietary Cluster Recommendation:\nI've grouped ${proposal.count} guests with special dietary preferences at dedicated tables for synchronized catering service.\n\nTap 'Confirm & Auto-Seat' to apply these changes.`;
    } else if (action === 'households') {
      introText = `👨‍👩‍👧‍👦 Family & Household Placement:\nI've grouped family units together (${proposal.count} guests across family tables) so relatives remain seated together.\n\nTap 'Confirm & Auto-Seat' to update.`;
    } else {
      introText = `⚡ Room Density & Vacancy Balancing:\nI've prepared ${proposal.count} recommendations to balance ballroom capacity and maintain smooth guest circulation.`;
    }

    setCheersMessages((prev) => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: actionLabel, timestamp: 'Just now' },
      {
        id: 'ch_' + Date.now(),
        sender: 'cheers',
        text: introText,
        proposal: proposal.count > 0 ? proposal : undefined,
        status: 'pending',
        timestamp: 'Just now',
      },
    ]);
  };

  const handleSendCheersMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = cheersChatInput.trim();
    if (!query) return;

    setCheersChatInput('');
    const lower = query.toLowerCase();

    if (lower.includes('vip') || lower.includes('head')) {
      handleCheersChatAction('vips');
    } else if (lower.includes('diet') || lower.includes('vegan') || lower.includes('veg') || lower.includes('halal') || lower.includes('gluten')) {
      handleCheersChatAction('dietary');
    } else if (lower.includes('fill') || lower.includes('vacan') || lower.includes('empty') || lower.includes('auto')) {
      handleCheersChatAction('fill');
    } else if (lower.includes('seed') || lower.includes('inventory') || lower.includes('create table') || lower.includes('preset')) {
      handleCheersChatAction('seed');
    } else if (lower.includes('audit') || lower.includes('stat') || lower.includes('capacity') || lower.includes('count') || lower.includes('balance')) {
      handleCheersChatAction('audit');
    } else if (lower.includes('reset') || lower.includes('clear')) {
      handleCheersChatAction('reset');
    } else {
      handleCheersChatAction('households');
    }
  };

  const handleConfirmChatProposal = (msgId: string, proposal?: { title: string; count: number; changes: { guestId: string; tableId: string }[] }) => {
    if (!proposal || proposal.changes.length === 0) return;
    const changeMap = new Map(proposal.changes.map((c) => [c.guestId, c.tableId]));
    const updatedGuests = (state.guests || []).map((g) => {
      if (changeMap.has(g.id)) {
        return { ...g, tableId: changeMap.get(g.id)!, seatIndex: 0 };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    setCheersMessages((prev) => [
      ...prev.map((m) => (m.id === msgId ? { ...m, isApplied: true, status: 'confirmed' as const } : m)),
      {
        id: 'ch_conf_' + Date.now(),
        sender: 'cheers',
        text: `✨ Seating confirmed! I've automatically placed ${proposal.count} guests at their assigned tables on your mobile floor plan canvas.`,
        timestamp: 'Just now',
      },
    ]);
    showToast(`✓ Confirmed & seated ${proposal.count} guests on canvas!`, 'success');
  };

  const handleRejectChatProposal = (msgId: string) => {
    setCheersMessages((prev) => [
      ...prev.map((m) => (m.id === msgId ? { ...m, status: 'rejected' as const } : m)),
      {
        id: 'ch_rej_' + Date.now(),
        sender: 'cheers',
        text: `Understood, proposal declined. What changes do you suggest?\n\nYou can tap any prompt chip above to try another strategy, or type your adjustment below.`,
        timestamp: 'Just now',
      },
    ]);
    showToast('Proposal rejected. What changes do you suggest?', 'info');
  };

  const handleRunCheersAiSeating = (scenario: 'households' | 'vips' | 'fill' | 'dietary') => {
    setIsCheersChatOpen(true);
    handleCheersChatAction(scenario);
  };

  const handleConfirmMobileProposal = () => {
    if (!aiProposal || aiProposal.changes.length === 0) return;
    const changeMap = new Map(aiProposal.changes.map((c) => [c.guestId, c.tableId]));
    const updatedGuests = (state.guests || []).map((g) => {
      if (changeMap.has(g.id)) {
        return { ...g, tableId: changeMap.get(g.id)!, seatIndex: 0 };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    setAiProposalStatus('confirmed');
    showToast(`✓ Confirmed & seated ${aiProposal.changes.length} guests on canvas!`, 'success');
  };

  const handleRejectMobileProposal = () => {
    setAiProposalStatus('rejected');
    showToast('Proposal rejected. What changes do you suggest?', 'info');
  };

  const handleApplyMobileSeatingConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newTables: Table[] = mobileSeedTables.map((tbl, i) => {
      const isHead = tbl.isHead || tbl.reserved === 'Head Table';
      let shape: TableShape = 'round';
      if (tbl.type === 'Rectangular' || tbl.type === 'Sweetheart Table') {
        shape = 'rectangular';
      } else if (tbl.type === 'Long Banquet') {
        shape = 'king';
      } else if (tbl.type === 'Round Banquet') {
        shape = 'round';
      } else {
        shape = (tbl.customType || '').toLowerCase().includes('rect') ? 'rectangular' : 'round';
      }

      const mobileX = isHead ? 50 : 23 + (i % 2) * 54;
      const mobileY = isHead ? 15 : 34 + Math.floor(i / 2) * 22;

      return {
        id: `tbl_${currentWeddingId}_${tbl.id}`,
        weddingId: currentWeddingId,
        name: tbl.name,
        capacity: Number(tbl.seats) || 10,
        isHead,
        shape,
        mobileX,
        mobileY,
        x: isHead ? 50 : 20 + (i % 3) * 30,
        y: isHead ? 15 : 35 + Math.floor(i / 3) * 22,
        zone: tbl.location === 'Custom Location' ? (tbl.customLocation || 'Custom Zone') : tbl.location,
        category: tbl.reserved === 'Custom' ? (tbl.customReserved || 'Custom') : tbl.reserved,
      };
    });

    const otherTables = (state.tables || []).filter((t) => (t.weddingId || 'w1') !== currentWeddingId);

    // Auto-Seat algorithm based on the 4 essential field sections
    const unassigned = weddingGuests.filter((g) => g.rsvpStatus !== 'declined');
    const proposedChanges: { guestId: string; tableId: string }[] = [];
    const tableCaps = newTables.map((t) => ({ ...t, currentCount: 0 }));

    // Rule 1: Head Table
    const headTbl = tableCaps.find((t) => t.isHead);
    if (headTbl) {
      const bridal = unassigned.filter(
        (g) =>
          (g.household && (g.household.toLowerCase().includes('bell') || g.household.toLowerCase().includes('gordon'))) ||
          g.category === 'Bridal Party' ||
          g.name.includes('Sophie') ||
          g.name.includes('James')
      );
      bridal.slice(0, headTbl.capacity).forEach((g) => {
        proposedChanges.push({ guestId: g.id, tableId: headTbl.id });
        headTbl.currentCount++;
      });
    }

    // Rule 2: VIP Tables
    if (configReserveVipTables) {
      const vipTables = tableCaps.filter((t) => t.category === 'VIP Table' || t.category === 'Immediate Family & VIPs');
      const vips = unassigned.filter(
        (g) =>
          !proposedChanges.some((p) => p.guestId === g.id) &&
          (g.category?.includes('Family') || (g.household && (g.household.includes('Johnson') || g.household.includes('Sharma'))))
      );
      let vipIdx = 0;
      vips.forEach((g) => {
        const targetTable = vipTables[vipIdx % Math.max(1, vipTables.length)];
        if (targetTable && targetTable.currentCount < targetTable.capacity) {
          proposedChanges.push({ guestId: g.id, tableId: targetTable.id });
          targetTable.currentCount++;
          vipIdx++;
        }
      });
    }

    // Rule 3: Dietary
    if (configDietaryStrategy === 'cluster') {
      const dietaryTable = tableCaps.find((t) => !t.isHead && t.capacity - t.currentCount >= 4) || tableCaps[1];
      if (dietaryTable) {
        const dietaryGuests = unassigned.filter(
          (g) =>
            !proposedChanges.some((p) => p.guestId === g.id) &&
            g.dietary &&
            g.dietary !== 'None' &&
            g.dietary.trim() !== ''
        );
        dietaryGuests.forEach((g) => {
          if (dietaryTable.currentCount < dietaryTable.capacity) {
            proposedChanges.push({ guestId: g.id, tableId: dietaryTable.id });
            dietaryTable.currentCount++;
          }
        });
      }
    }

    // Rule 4: Families & Households
    const remaining = unassigned.filter((g) => !proposedChanges.some((p) => p.guestId === g.id));
    const hhMap = new Map<string, typeof remaining>();
    remaining.forEach((g) => {
      const hh = g.household || 'General';
      if (!hhMap.has(hh)) hhMap.set(hh, []);
      hhMap.get(hh)!.push(g);
    });

    hhMap.forEach((members) => {
      const needed = members.length;
      const candidate =
        tableCaps.find((t) => !t.isHead && t.capacity - t.currentCount >= needed) ||
        tableCaps.find((t) => !t.isHead && t.currentCount < t.capacity);
      if (candidate) {
        members.forEach((m) => {
          if (candidate.currentCount < candidate.capacity) {
            proposedChanges.push({ guestId: m.id, tableId: candidate.id });
            candidate.currentCount++;
          }
        });
      }
    });

    // Rule 5: Leftover guests
    const stillUnassigned = unassigned.filter((g) => !proposedChanges.some((p) => p.guestId === g.id));
    stillUnassigned.forEach((g) => {
      const candidate = tableCaps.find((t) => t.currentCount < t.capacity);
      if (candidate) {
        proposedChanges.push({ guestId: g.id, tableId: candidate.id });
        candidate.currentCount++;
      }
    });

    setState({
      ...state,
      tables: [...otherTables, ...newTables],
    });

    setShowSeatingConfigModal(false);
    setIsCheersChatOpen(true);

    const proposal = {
      title: `Seed Table Auto-Seat Proposal (${proposedChanges.length} Guests)`,
      desc: `Configured ${newTables.length} tables (${newTables.reduce((a, b) => a + (Number(b.capacity) || 0), 0)} total seats) with ${configTableType} layout.`,
      count: proposedChanges.length,
      changes: proposedChanges,
    };

    setCheersMessages((prev) => [
      ...prev,
      {
        id: 'usr_' + Date.now(),
        sender: 'user',
        text: `🌱 Seeded table layout: ${newTables.length} tables (${configSeatsPerTable} seats/table) with ${configTableType} geometry and 4 Essential Rules.`,
        timestamp: 'Just now',
      },
      {
        id: 'ch_' + Date.now(),
        sender: 'cheers',
        text: `✨ I have configured your floor plan with ${newTables.length} tables based on your official guest list (${confirmedGuestsCount} guests across ${uniqueHouseholdsCount} households)!

Here is the proposed auto-seating allocation for ${proposedChanges.length} guests. Review the assignments below and tap 'Confirm & Auto-Seat' to apply them to your canvas, or 'Reject' to suggest changes.`,
        proposal,
        status: 'pending',
        timestamp: 'Just now',
      },
    ]);

    showToast(`✓ Generated ${newTables.length} tables and opened Cheers AI!`, 'success');
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
    const currentWeddingTables = (state.tables || []).filter(t => (t.weddingId || 'w1') === currentWeddingId);
    const tableName = newTableName.trim() || `Table ${currentWeddingTables.length + 1}`;
    const newTbl: Table = {
      id: `tbl_${currentWeddingId}_${Date.now()}`,
      weddingId: currentWeddingId,
      name: tableName,
      capacity: newTableCapacity,
      isHead: false,
      shape: newTableShape,
      category: newTableCategory,
      zone: 'Main Room',
      x: 25 + (currentWeddingTables.length % 3) * 25,
      y: 35 + Math.floor(currentWeddingTables.length / 3) * 22,
    };
    setState({ ...state, tables: [...(state.tables || []), newTbl] });
    setShowAddTableModal(false);
    setNewTableName('');
    showToast(`Added ${newTbl.name} (${newTableCapacity} seats, ${newTableShape}) to ${activeWedding.couple}'s wedding`, 'success');
  };

  const handleUnseatGuestMobile = (guestId: string, guestName: string) => {
    const updated = (state.guests || []).map(g => g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g);
    setState({ ...state, guests: updated });
    showToast(`Unseated ${guestName}`, 'info');
  };

  const handleSeatGuestMobile = (guestId: string, tableId: string, tableName: string) => {
    const seatedCount = weddingGuests.filter(g => g.tableId === tableId).length;
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

  const handleJoeyPrompt = (prompt: string, fileAttachment?: { name: string; size: number; type: string } | null) => {
    const file = fileAttachment !== undefined ? fileAttachment : attachedFile;
    if (file) setAttachedFile(null);

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user' as const,
      text: prompt || (file ? `Attached file: ${file.name}` : ''),
      attachment: file || undefined,
      time: 'Just now',
    };
    let replyText = '';

    if (file) {
      replyText = `📎 Received & analyzed "${file.name}" (${(file.size / 1024).toFixed(1)} KB)!\n` +
        (prompt.trim() ? `Regarding: "${prompt}"\n\n` : '') +
        `I have parsed and indexed this document into ${activeWedding.couple}'s console. Relevant cues, dietary notes, and stage timeline items are synchronized with your MC console.`;
    } else if (prompt.toLowerCase().includes('dietary')) {
      replyText = `🍽️ Dietary Alerts (${vegCount + veganCount + gfCount + nutCount + otherDietCount} special meals):\n• Vegetarian: ${vegCount}\n• Vegan: ${veganCount}\n• Gluten-free: ${gfCount}\n• Nut Allergies: ${nutCount}\nCheck the Catering tab for table-by-table drops.`;
    } else if (prompt.toLowerCase().includes('next cue')) {
      const upcoming = weddingRunSheet.find(c => !c.done);
      replyText = upcoming
        ? `Next cue on schedule: ${upcoming.time} — ${upcoming.activity}.`
        : 'All run sheet cues have been completed!';
    } else if (prompt.toLowerCase().includes('head table')) {
      replyText = `HEAD TABLE has 8 seated VIPs including bride Sophie and groom James.`;
    } else if (prompt.toLowerCase().includes('venue phone')) {
      replyText = `${activeWedding.venue.split(',')[0]} Concierge: (02) 4871 2000. Sarah Lin (Venue Manager): 0412 345 678.`;
    } else {
      replyText = `I have updated your console with "${prompt}". All data is synchronized across mobile and desktop dashboards.`;
    }

    setChatMessages(prev => [...prev, userMsg, {
      id: 'j_' + Date.now(),
      sender: 'joey' as const,
      text: replyText,
      time: 'Just now',
    }]);
  };

  const activeMobileTable = selectedMobileTableId
    ? weddingTables.find(t => t.id === selectedMobileTableId)
    : null;
  const activeTableGuests = selectedMobileTableId
    ? weddingGuests.filter(g => g.tableId === selectedMobileTableId)
    : [];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-45px)] overflow-hidden font-sans select-none">
      {/* 402x874 Phone Chassis */}
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
          /* Home Mode Header */
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
              Mobile Companion
            </div>
          </header>
        ) : (
          /* Live Console Mode Header - Clean & Elegant without any cluttered top slide tabs */
          <header className="bg-[#15110e] text-white px-3.5 py-2.5 border-b border-[#2b221a] flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={() => setSelectedWeddingId(null)}
              className="text-xs text-[#dfc194] bg-[#2a2119] border border-[#3d3126] px-2.5 py-1 rounded-md hover:text-white flex items-center gap-1 font-semibold cursor-pointer transition-colors"
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
          {/* HOME MODE: TAB 1 - ALL WEDDINGS                             */}
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
                  {state.weddings?.length || 3} Active
                </span>
              </div>

              {/* 3 Assigned Wedding Cards */}
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
                        Executive Lead Host
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
                        Executive Lead Host
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
                        Executive Lead Host
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
          {/* HOME MODE: TAB 2 - CALENDAR                                 */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'calendar' && (() => {
            const currentYear = calendarDate.getFullYear();
            const currentMonth = calendarDate.getMonth();
            const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
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

                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                      <div key={d} className="text-[10px] font-bold text-[#8b7b6b] py-1">
                        {d}
                      </div>
                    ))}

                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                      <div key={`blank-${idx}`} className="min-h-[46px] rounded-xl border border-transparent p-1 pointer-events-none" />
                    ))}

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
          {/* HOME MODE: TAB 4 - TEAM                                     */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'team' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h1 className="font-serif text-[20px] font-bold text-[#15110e]">
                    Event Crew &amp; Team
                  </h1>
                  <p className="text-[11px] text-[#8b7b6b]">
                    Hosts, coordinators, sound engineers &amp; technicians
                  </p>
                </div>
                <span className="bg-[#e8eee4] text-[#3c6a42] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  3 Active Crew
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { name: 'Robert Galati', role: 'Executive Lead Event Host' },
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
          {/* HOME MODE: TAB - REFERRALS & DISCOUNTS                      */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'referrals' && (
            <div className="space-y-3.5 pb-2">
              <div className="flex items-center justify-between pt-1 px-1">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661]">
                    Partner Ambassador Hub
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
                    Active &bull; Verified Partner
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
                </div>
              </div>

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
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* HOME MODE: TAB 5 - SETTINGS                                 */}
          {/* ------------------------------------------------------------ */}
          {!selectedWeddingId && homeTab === 'settings' && (
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3.5">
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1">Direct Phone</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2.5 border border-r-0 border-[#e8ded0] bg-[#faf8f5] text-xs font-bold font-mono text-[#8b7b6b] rounded-l-xl select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full bg-white border border-[#e8ded0] rounded-r-xl rounded-l-none p-2.5 text-xs outline-none focus:border-[#bd9661]"
                      />
                    </div>
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

          {/* ============================================================ */}
          {/* LIVE CONSOLE TAB 1: OVERVIEW                                 */}
          {/* ============================================================ */}
          {selectedWeddingId && consoleTab === 'overview' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {/* Couple Hero Card with Countdown */}
              <div className="bg-[#15110e] text-white border border-[#bd9661]/40 rounded-2xl p-4 shadow-md space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#bd9661] font-bold">
                      Active Wedding Console
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#dfc194] mt-0.5">
                      {activeWedding.couple}
                    </h2>
                    <p className="text-xs text-[#d9c9b8] mt-0.5">
                      📍 {activeWedding.venue}
                    </p>
                  </div>
                  <span className="bg-[#2a1f16] border border-[#bd9661] text-[#dfc194] text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                    {countdown.upperFormatted || '23 DAYS TO GO'}
                  </span>
                </div>

                <div className="bg-[#241a13] border border-[#3d2e23] p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-[#a09080]">Date: <strong className="text-white">{activeWedding.dateDisplay || activeWedding.date}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Console Live
                  </span>
                </div>
              </div>

              {/* 4 Clean Mobile KPI Cards (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* KPI 1: RSVPs */}
                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-[#bd9661] p-3 rounded-2xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#8b7b6b] flex items-center gap-1">
                    <span>✉️</span> RSVPs
                  </div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">
                    {confirmedGuests.length} / {weddingGuests.length}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {Math.round((confirmedGuests.length / (weddingGuests.length || 1)) * 100)}% Confirmed
                  </div>
                </div>

                {/* KPI 2: Run Sheet Cues */}
                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-[#bd9661] p-3 rounded-2xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#8b7b6b] flex items-center gap-1">
                    <span>📋</span> Run Sheet Cues
                  </div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">
                    {activeWedding.runSheet?.length || 14} Cues
                  </div>
                  <div className="text-[10px] text-[#bd9661] font-semibold mt-0.5">
                    Live Timing Synced
                  </div>
                </div>

                {/* KPI 3: Seating Allocation */}
                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-amber-600 p-3 rounded-2xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#8b7b6b] flex items-center gap-1">
                    <span>🪑</span> Seated
                  </div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">
                    {seatedGuestsCount} / {weddingGuests.length}
                  </div>
                  <div className="text-[10px] text-[#8b7b6b] mt-0.5">
                    Across {weddingTables.length} Tables
                  </div>
                </div>

                {/* KPI 4: Thank-You Notes */}
                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-teal-600 p-3 rounded-2xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#8b7b6b] flex items-center gap-1">
                    <span>💌</span> Thank-Yous
                  </div>
                  <div className="font-serif text-lg font-bold text-[#15110e] mt-1">
                    28 / {confirmedGuests.length}
                  </div>
                  <div className="text-[10px] text-[#8b7b6b] mt-0.5">
                    25% Completed
                  </div>
                </div>
              </div>

              {/* RSVP Progress Bar */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif font-bold text-[#15110e]">RSVP Attendance Status</span>
                  <span className="text-[11px] font-bold text-[#bd9661]">{weddingGuests.length} Invited</span>
                </div>
                <div className="w-full h-2.5 bg-[#f0ede4] rounded-full overflow-hidden flex">
                  <div style={{ width: `${(confirmedGuests.length / (weddingGuests.length || 1)) * 100}%` }} className="bg-[#3c6a42] h-full" title="Confirmed" />
                  <div style={{ width: `${(pendingGuests.length / (weddingGuests.length || 1)) * 100}%` }} className="bg-[#bd9661] h-full" title="Pending" />
                  <div style={{ width: `${(declinedGuests.length / (weddingGuests.length || 1)) * 100}%` }} className="bg-[#a09080] h-full" title="Declined" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8b7b6b] pt-0.5">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3c6a42]" /> Confirmed ({confirmedGuests.length})</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#bd9661]" /> Pending ({pendingGuests.length})</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#a09080]" /> Declined ({declinedGuests.length})</span>
                </div>
              </div>

              {/* Interactive Wedding Checklist */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-[#15110e]">Wedding Checklist</h3>
                  <span className="text-[10px] text-[#3c6a42] font-bold">
                    {weddingTasks.filter(t => t.completed).length} / {weddingTasks.length} Done
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {weddingTasks.map((t) => (
                    <label key={t.id} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleToggleTask(t.id)}
                        className="accent-[#bd9661] w-4 h-4 cursor-pointer"
                      />
                      <span className={t.completed ? 'line-through text-[#8b7b6b]' : 'font-medium text-[#15110e]'}>
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
                    className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                  <button type="submit" className="bg-[#bd9661] text-[#15110e] font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer">
                    + Add
                  </button>
                </form>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-2xs space-y-2.5">
                <h3 className="font-serif text-sm font-bold text-[#15110e]">Recent Wedding Activity</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { text: 'Priya Sharma updated dietary requirements to Vegetarian', time: '10 mins ago' },
                    { text: 'Sophie & James confirmed entrance music cue', time: '38 mins ago' },
                    { text: 'Robert Galati synced 14:00 ceremony cue sheet', time: '1 hour ago' },
                    { text: 'Michael Chen confirmed RSVP attendance', time: '2 hours ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-2 py-1 border-b border-[#f5f2eb] last:border-0">
                      <span className="text-[#bd9661] font-bold">&bull;</span>
                      <div>
                        <div className="text-[#15110e] text-[11px]">{act.text}</div>
                        <div className="text-[9.5px] text-[#8b7b6b] mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LIVE CONSOLE TAB 2: RUN SHEET                                */}
          {/* ============================================================ */}
          {selectedWeddingId && consoleTab === 'runsheet' && (
            <div className="space-y-3 animate-in fade-in duration-150">
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
                  onClick={() => setShowAddCueModal(true)}
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
                {weddingRunSheet
                  .filter(c => {
                    if (runSheetFilter === 'upcoming') return !c.done;
                    if (runSheetFilter === 'done') return c.done;
                    return true;
                  })
                  .filter(c => !cueSearch || c.activity.toLowerCase().includes(cueSearch.toLowerCase()) || (c.notes && c.notes.toLowerCase().includes(cueSearch.toLowerCase())) || (c.privateNotes && c.privateNotes.toLowerCase().includes(cueSearch.toLowerCase())))
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
                            {cue.activity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCue(idx, 'up')}
                            className="w-6 h-6 rounded bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-[10px] cursor-pointer"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCue(idx, 'down')}
                            className="w-6 h-6 rounded bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-[10px] cursor-pointer"
                            title="Move Down"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCue(cue.id)}
                            className="w-6 h-6 rounded bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-[10px] text-red-500 cursor-pointer"
                            title="Delete Cue"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      {cue.notes && (
                        <p className="text-xs text-[#6b5849] pl-6">
                          {cue.notes}
                        </p>
                      )}

                      {/* Private Cue & Stage Notes Box (No MC written!) */}
                      {cue.privateNotes && (
                        <div className="ml-6 bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2 text-xs">
                          <div className="text-[9px] font-bold uppercase text-[#916c3d] tracking-wider mb-0.5">
                            🔒 Private Cue &amp; Stage Notes
                          </div>
                          <div className="text-[#15110e] text-[11px]">{cue.privateNotes}</div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LIVE CONSOLE TAB 3: SEATING STUDIO (PROFESSIONAL MOBILE VIEW) */}
          {/* ============================================================ */}
          {selectedWeddingId && consoleTab === 'seating' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Clean Mobile Seating Header & Actions */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold text-[#15110e] truncate">
                      Seating Studio
                    </h3>
                    <div className="text-[11px] text-[#8b7b6b] mt-0.5 truncate">
                      {weddingTables.length} Tables &bull; {weddingGuests.length} Total Guests
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10.5px] font-bold text-[#3c6a42] bg-[#e8eee4] px-2 py-0.5 rounded-full whitespace-nowrap">
                      {seatedGuestsCount} Seated
                    </span>
                    <span className="text-[10.5px] font-bold text-[#bd9661] bg-[#faf5ed] border border-[#ebd3a8] px-2 py-0.5 rounded-full whitespace-nowrap">
                      {unassignedGuests.length} Unseated
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#f5f2eb] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfigTableCount(suggestedMobileTables);
                      setShowSeatingConfigModal(true);
                    }}
                    className="flex-1 h-9 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] border border-[#bd9661] rounded-xl px-3 text-xs font-bold cursor-pointer shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    title="Configure floor layout, shapes, and AI seating rules based on guest list"
                  >
                    <span className="text-sm">🌱</span>
                    <span className="tracking-wide">Seed Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTableModal(true)}
                    className="h-9 bg-white hover:bg-[#faf8f5] text-[#15110e] border border-[#d5c7b5] rounded-xl px-3 text-xs font-bold cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 transition-all shrink-0"
                  >
                    <span className="text-sm font-bold text-[#bd9661]">+</span>
                    <span>Add Table</span>
                  </button>
                </div>
              </div>

              {/* Saved Seating Layouts Bar (Synchronized with Couple & MC Pro) */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-3 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">📐</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] truncate">
                      Seating Layouts
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCompareArrangementsModal(true)}
                      className="bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] border border-[#d5c7b5] font-bold px-2.5 py-1 rounded-lg text-[10.5px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                      title="Compare saved seating layouts"
                    >
                      <span>⚖️</span>
                      <span>Compare</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewArrangementName(`Seating Arrangement ${savedArrangements.length + 1}`);
                        setNewArrangementNotes('');
                        setShowSaveArrangementModal(true);
                      }}
                      className="bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] border border-[#bd9661] font-bold px-2.5 py-1 rounded-lg text-[10.5px] cursor-pointer transition-all flex items-center gap-1 shadow-2xs"
                      title="Save current layout"
                    >
                      <span>💾</span>
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Layout Switcher */}
                {savedArrangements.length > 0 && (
                  <div className="pt-1.5 border-t border-[#f5f2eb]">
                    <div className="relative">
                      <select
                        value={activeArrangementId}
                        onChange={(e) => handleLoadArrangement(e.target.value)}
                        className="w-full bg-[#faf8f5] hover:bg-[#f5ede2] border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] font-semibold outline-none cursor-pointer truncate pr-7 transition-colors shadow-2xs"
                      >
                        {savedArrangements.map((arr) => (
                          <option key={arr.id} value={arr.id}>
                            {arr.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* 3-Segment View Switcher */}
              <div className="grid grid-cols-3 gap-1 bg-[#f0ede4] p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setSeatingSubTab('canvas')}
                  className={`py-2 px-1 rounded-lg font-bold text-[11px] text-center cursor-pointer transition-colors ${
                    seatingSubTab === 'canvas' ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                  }`}
                >
                  Floor Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setSeatingSubTab('tables')}
                  className={`py-2 px-1 rounded-lg font-bold text-[11px] text-center cursor-pointer transition-colors ${
                    seatingSubTab === 'tables' ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                  }`}
                >
                  Tables List
                </button>
                <button
                  type="button"
                  onClick={() => setSeatingSubTab('unseated')}
                  className={`py-2 px-1 rounded-lg font-bold text-[11px] text-center cursor-pointer transition-colors ${
                    seatingSubTab === 'unseated' ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                  }`}
                >
                  Unseated ({unassignedGuests.length})
                </button>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUB-VIEW 1: FULL-WIDTH MOBILE 2D INTERACTIVE CANVAS     */}
              {/* -------------------------------------------------------- */}
              {seatingSubTab === 'canvas' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-[11px] text-[#8b7b6b]">
                    <span>Touch &amp; drag tables &bull; Tap table to manage</span>
                    <span className="font-semibold text-[#bd9661]">Full Floor Plan</span>
                  </div>

                  <div
                    id="mobile_canvas_container"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const el = document.getElementById('mobile_canvas_container');
                      if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
                    }}
                    className="w-full h-[450px] bg-[#fbf9f5] border-2 border-[#e8ded0] rounded-2xl relative shadow-inner overflow-hidden select-none"
                    style={{
                      backgroundImage: 'radial-gradient(#d5c7b5 1.2px, transparent 1.2px)',
                      backgroundSize: '20px 20px',
                    }}
                  >
                    {/* Architectural Anchors */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-[#15110e] text-[#dfc194] px-4 py-1 rounded-full border border-[#bd9661] text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-1.5 z-10">
                      <span>👑</span> BRIDAL STAGE &bull; HEAD TABLE
                    </div>

                    {/* Draggable Main Dance Floor */}
                    <div
                      id="mobile_main_dance_floor"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'dancefloor');
                        setIsDraggingDanceFloor(true);
                      }}
                      onDragEnd={() => setIsDraggingDanceFloor(false)}
                      onPointerDown={handlePointerDownDanceFloor}
                      onPointerMove={handlePointerMoveDanceFloor}
                      onPointerUp={handlePointerUpDanceFloor}
                      onPointerCancel={handlePointerUpDanceFloor}
                      onTouchStart={handleTouchStartDanceFloor}
                      onTouchMove={handleTouchMoveDanceFloor}
                      onTouchEnd={handleTouchEndDanceFloor}
                      onTouchCancel={handleTouchEndDanceFloor}
                      style={{
                        left: `${danceFloorPos.x}%`,
                        top: `${danceFloorPos.y}%`,
                        touchAction: 'none',
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-40 h-28 rounded-3xl border-2 border-dashed border-[#bd9661]/60 bg-[#bd9661]/10 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing hover:border-[#bd9661] hover:bg-[#bd9661]/15 transition-all shadow-2xs select-none z-10 touch-none ${
                        isDraggingDanceFloor ? 'opacity-70 ring-2 ring-[#bd9661] shadow-lg scale-105' : ''
                      }`}
                      title="Drag to reposition Main Dance Floor"
                    >
                      <span className="text-lg">💃</span>
                      <span className="font-serif text-[10px] font-bold text-[#6b5847] uppercase tracking-wider mt-0.5">
                        Main Dance Floor
                      </span>
                      <span className="text-[8px] text-[#8b7b6b] opacity-80 font-sans mt-0.5">
                        Drag to move
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-4 bg-white/90 border border-[#e8ded0] px-3 py-1 rounded-lg text-[9.5px] font-bold text-[#8b7b6b] shadow-2xs pointer-events-none">
                      🍸 Bar &amp; Lounge
                    </div>

                    <div className="absolute bottom-2 right-4 bg-white/90 border border-[#e8ded0] px-3 py-1 rounded-lg text-[9.5px] font-bold text-[#8b7b6b] shadow-2xs pointer-events-none">
                      🌿 Garden Verandah
                    </div>

                    {/* Touch-Draggable Tables on Mobile Canvas */}
                    {weddingTables.map((tbl, idx) => {
                      const seated = weddingGuests.filter(g => g.tableId === tbl.id);
                      const isFull = seated.length >= tbl.capacity;
                      const coords = getMobileTableCoords(tbl, idx);

                      return (
                        <div
                          key={tbl.id}
                          draggable
                          onDragStart={() => setDraggingTableId(tbl.id)}
                          onTouchMove={(e) => handleTouchMoveTable(e, tbl.id)}
                          onClick={() => setSelectedMobileTableId(tbl.id)}
                          style={{
                            left: `${coords.x}%`,
                            top: `${coords.y}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-110 cursor-pointer shadow-md select-none flex flex-col items-center justify-center text-center ${
                            tbl.isHead || tbl.shape === 'king'
                              ? 'w-28 h-12 bg-gradient-to-r from-[#1c1511] via-[#2a1f16] to-[#1c1511] text-[#dfc194] border-2 border-[#bd9661] rounded-xl'
                              : tbl.shape === 'rectangular'
                              ? 'w-20 h-11 bg-white text-[#15110e] border-2 border-[#bd9661] rounded-lg'
                              : 'w-14 h-14 bg-white text-[#15110e] border-2 border-[#bd9661] rounded-full'
                          } ${isFull ? 'ring-2 ring-emerald-500/40' : 'ring-1 ring-[#bd9661]/20'}`}
                          title={`Tap to manage ${tbl.name}`}
                        >
                          <span className="font-serif text-[10px] font-bold leading-tight truncate max-w-[90%] px-1">
                            {tbl.name}
                          </span>
                          <span className="font-mono text-[9.5px] font-bold mt-0.5 text-[#15110e]">
                            {seated.length} / {tbl.capacity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* SUB-VIEW 2: TABLES LIST ROSTER VIEW                      */}
              {/* -------------------------------------------------------- */}
              {seatingSubTab === 'tables' && (
                <div className="space-y-3">
                  {weddingTables.map((tbl) => {
                    const seatedGuests = weddingGuests.filter((g) => g.tableId === tbl.id);
                    const isFull = seatedGuests.length >= tbl.capacity;

                    return (
                      <div key={tbl.id} className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-serif text-base font-bold text-[#15110e]">
                              {tbl.name} {tbl.isHead ? '👑' : ''}
                            </h3>
                            <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                              {tbl.shape ? tbl.shape.toUpperCase() : 'ROUND'} &bull; {tbl.category || 'Ballroom'} &bull; {tbl.capacity} Max Seats
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

                        {/* Seated Guests List */}
                        <div className="space-y-1.5 pt-1 border-t border-[#f5f2eb]">
                          {seatedGuests.length === 0 ? (
                            <div className="text-center py-2.5 text-xs text-[#8b7b6b] bg-[#faf8f5] rounded-xl border border-dashed border-[#e8ded0]">
                              No guests currently seated at this table.
                            </div>
                          ) : (
                            seatedGuests.map((item, sIdx) => (
                              <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-[#f5f2eb] last:border-0">
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                  <span className="font-bold text-[#15110e] truncate">
                                    {sIdx + 1}. {item.name}
                                  </span>
                                  {item.dietary && item.dietary !== 'None' && (
                                    <DietaryBadges dietary={item.dietary} size="xs" />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleUnseatGuestMobile(item.id, item.name)}
                                  className="text-[10px] text-[#bd9661] hover:text-[#916c3d] font-semibold border border-[#ebd3a8] bg-[#faf8f5] px-2 py-0.5 rounded cursor-pointer shrink-0"
                                >
                                  Unseat
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* SUB-VIEW 3: UNSEATED GUESTS ROSTER                       */}
              {/* -------------------------------------------------------- */}
              {seatingSubTab === 'unseated' && (
                <div className="space-y-3">
                  <div className="bg-[#faf6f0] border border-[#ebd3a8] rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#916c3d]">Remaining Unseated Guests</div>
                      <div className="text-[11px] text-[#8b7b6b]">
                        {unassignedGuests.length} unassigned guests
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        let tableIdx = 0;
                        const updated = state.guests.map(g => {
                          if (!g.tableId && g.rsvpStatus !== 'declined' && weddingTables.length > 0) {
                            const target = weddingTables[tableIdx % weddingTables.length];
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
                    {unassignedGuests.length === 0 ? (
                      <div className="text-center py-8 text-xs text-[#3c6a42] font-semibold bg-[#f0f7f1] rounded-2xl border border-emerald-200 p-4">
                        🎉 All guests are successfully seated!
                      </div>
                    ) : (
                      unassignedGuests.map((g) => (
                        <div key={g.id} className="bg-white border border-[#e8ded0] rounded-2xl p-3 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-[#15110e]">{g.name}</h4>
                            {g.dietary && g.dietary !== 'None' && (
                              <DietaryBadges dietary={g.dietary} size="xs" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#8b7b6b]">
                            {g.household || 'Individual'}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <select
                              id={`mc_seat_${g.id}`}
                              className="flex-1 bg-white border border-[#e8ded0] rounded-lg p-1.5 text-xs text-[#15110e] outline-none"
                              defaultValue={weddingTables[0]?.id || ''}
                            >
                              {weddingTables.map((t) => {
                                const seated = weddingGuests.filter(x => x.tableId === t.id).length;
                                const free = Math.max(0, t.capacity - seated);
                                return (
                                  <option key={t.id} value={t.id}>
                                    {t.name} ({free} free)
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
                                  const t = weddingTables.find(tbl => tbl.id === sel);
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
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* LIVE CONSOLE TAB 4: CATERING & HOSPITALITY SUMMARY          */}
          {/* ============================================================ */}
          {selectedWeddingId && consoleTab === 'catering' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="px-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661]">
                  Hospitality &amp; Kitchen Operations
                </div>
                <h2 className="font-serif text-lg font-bold text-[#15110e]">
                  Guest &amp; Catering Summary
                </h2>
                <p className="text-[11px] text-[#8b7b6b]">
                  Full dietary requirements breakdown &amp; banquet table dispatch
                </p>
              </div>

              {/* 5 Dietary Metric Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-[#bd9661] p-3 rounded-2xl shadow-2xs col-span-2 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#8b7b6b]">Total Confirmed Covers</div>
                    <div className="font-serif text-xl font-bold text-[#15110e] mt-0.5">{confirmedGuests.length} Guests</div>
                  </div>
                  <span className="text-xs font-bold text-[#bd9661] bg-[#faf6f0] border border-[#ebd3a8] px-2.5 py-1 rounded-full">
                    {weddingTables.length} Tables
                  </span>
                </div>

                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-emerald-600 p-2.5 rounded-xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Vegetarian</div>
                  <div className="font-serif text-lg font-bold text-emerald-700 mt-0.5">{vegCount}</div>
                </div>

                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-teal-600 p-2.5 rounded-xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-teal-800">Vegan</div>
                  <div className="font-serif text-lg font-bold text-teal-700 mt-0.5">{veganCount}</div>
                </div>

                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-amber-600 p-2.5 rounded-xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-amber-800">Gluten-Free</div>
                  <div className="font-serif text-lg font-bold text-amber-700 mt-0.5">{gfCount}</div>
                </div>

                <div className="bg-white border border-[#e8ded0] border-t-2 border-t-rose-600 p-2.5 rounded-xl shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-rose-800">Nut / Allergies</div>
                  <div className="font-serif text-lg font-bold text-rose-700 mt-0.5">{nutCount + otherDietCount}</div>
                </div>
              </div>

              {/* Table-by-Table Catering Breakdown */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                <h3 className="font-serif text-sm font-bold text-[#15110e]">
                  Table-by-Table Catering Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  {weddingTables.map((tbl) => {
                    const seated = confirmedGuests.filter(g => g.tableId === tbl.id);
                    const special = seated.filter(g => {
                      const d = (g.dietary || '').toLowerCase().trim();
                      return d !== '' && d !== 'none' && d !== 'no';
                    });

                    return (
                      <div key={tbl.id} className="p-2.5 bg-[#faf8f5] border border-[#e8ded0] rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-[#15110e]">{tbl.name} {tbl.isHead ? '👑' : ''}</strong>
                          <span className="text-[10px] font-bold text-[#8b7b6b]">{seated.length} Seated</span>
                        </div>
                        {special.length === 0 ? (
                          <div className="text-[10.5px] text-emerald-700">✓ Standard estate menu</div>
                        ) : (
                          <div className="space-y-1">
                            {special.map(sg => (
                              <div key={sg.id} className="flex items-center justify-between bg-white border border-amber-200 px-2 py-1 rounded text-[10.5px] gap-2">
                                <span className="font-medium text-[#15110e]">{sg.name}</span>
                                <DietaryBadges dietary={sg.dietary} size="xs" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest Dietary Roster */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                <h3 className="font-serif text-sm font-bold text-[#15110e]">Dietary Guest Roster</h3>
                <input
                  type="text"
                  placeholder="Filter dietary guest..."
                  value={cateringSearch}
                  onChange={(e) => setCateringSearch(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none"
                />
                <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto no-scrollbar pr-0.5">
                  {confirmedGuests
                    .filter(g => {
                      if (!cateringSearch) return true;
                      return g.name.toLowerCase().includes(cateringSearch.toLowerCase()) || (g.dietary && g.dietary.toLowerCase().includes(cateringSearch.toLowerCase()));
                    })
                    .map(g => (
                      <div key={g.id} className="p-2 bg-[#faf8f5] rounded-xl border border-[#f0ede4] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-bold text-[#15110e] truncate">{g.name}</div>
                          <div className="text-[10px] text-[#8b7b6b] truncate">{g.household || 'Individual'}</div>
                        </div>
                        <DietaryBadges dietary={g.dietary} size="xs" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LIVE CONSOLE TAB 5: GUEST LIST                               */}
          {/* ============================================================ */}
          {selectedWeddingId && consoleTab === 'guests' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex justify-between items-center px-1">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#15110e]">
                    Guest List
                  </h2>
                  <p className="text-[11px] text-[#8b7b6b]">
                    {confirmedGuests.length} Confirmed of {weddingGuests.length} Total
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search guests by name or dietary..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="w-full bg-white border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />

              {/* View Mode Segmented Controls */}
              <div className="grid grid-cols-2 gap-1 bg-[#f0ede4] p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setMobileGuestViewMode('individual')}
                  className={`py-1.5 rounded-lg font-bold text-[11px] cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 ${
                    mobileGuestViewMode === 'individual' ? 'bg-[#15110e] text-[#dfc194] shadow-xs' : 'text-[#8b7b6b]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Individuals ({weddingGuests.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileGuestViewMode('family')}
                  className={`py-1.5 rounded-lg font-bold text-[11px] cursor-pointer text-center transition-all flex items-center justify-center gap-1.5 ${
                    mobileGuestViewMode === 'family' ? 'bg-[#15110e] text-[#dfc194] shadow-xs' : 'text-[#8b7b6b]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>By Family ({mobileFamilyGroups.length})</span>
                </button>
              </div>

              {/* RSVP Filter Chips */}
              <div className="grid grid-cols-4 gap-1 bg-[#f0ede4] p-1 rounded-xl text-xs">
                {(['all', 'confirmed', 'awaiting', 'declined'] as const).map(rf => (
                  <button
                    key={rf}
                    type="button"
                    onClick={() => setGuestRsvpFilter(rf)}
                    className={`py-1.5 rounded-lg font-bold text-[10.5px] capitalize cursor-pointer text-center transition-colors ${
                      guestRsvpFilter === rf ? 'bg-white text-[#15110e] shadow-xs' : 'text-[#8b7b6b]'
                    }`}
                  >
                    {rf === 'awaiting' ? 'Pending' : rf}
                  </button>
                ))}
              </div>

              {/* Guests Rows */}
              <div className="space-y-2 text-xs">
                {mobileGuestViewMode === 'individual' ? (
                  weddingGuests
                    .filter(g => {
                      if (guestRsvpFilter !== 'all' && g.rsvpStatus !== guestRsvpFilter) return false;
                      if (!guestSearch) return true;
                      return g.name.toLowerCase().includes(guestSearch.toLowerCase()) || (g.dietary && g.dietary.toLowerCase().includes(guestSearch.toLowerCase()));
                    })
                    .map(g => {
                      const tbl = weddingTables.find(t => t.id === g.tableId);
                      const isChild = (g.kids || 0) > 0 && (!g.adults || g.adults === 0);
                      return (
                        <div key={g.id} className="bg-white border border-[#e8ded0] rounded-2xl p-3 flex items-center justify-between shadow-2xs gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-xs flex items-center justify-center shrink-0">
                              {g.initials || g.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <div className="font-bold text-[#15110e] truncate">{g.name}</div>
                              <div className="text-[10px] text-[#8b7b6b] truncate">
                                {g.household || 'Individual'} · {isChild ? 'Child (0A, 1K)' : 'Adult (1A, 0K)'}
                              </div>
                              <DietaryBadges dietary={g.dietary} size="xs" showNone={false} />
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            tbl ? 'bg-[#15110e] text-[#dfc194]' : 'bg-[#faf5ed] text-[#916c3d] border border-[#ebd3a8]'
                          }`}>
                            {tbl ? tbl.name : 'Unassigned'}
                          </span>
                        </div>
                      );
                    })
                ) : (
                  mobileFamilyGroups
                    .filter(fam => {
                      if (guestRsvpFilter !== 'all' && fam.rsvpStatus !== guestRsvpFilter) return false;
                      if (!guestSearch) return true;
                      const q = guestSearch.toLowerCase();
                      return fam.familyName.toLowerCase().includes(q) || fam.householdKey.toLowerCase().includes(q) || fam.dietarySummary.toLowerCase().includes(q);
                    })
                    .map(fam => (
                      <div key={fam.id} className="bg-white border border-[#e8ded0] rounded-2xl p-3 flex items-center justify-between shadow-2xs gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#bd9661] text-[#15110e] font-bold text-xs flex items-center justify-center shrink-0">
                            {fam.initials}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-[#15110e] truncate">{fam.familyName}</div>
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="bg-[#f5ede2] text-[#15110e] font-semibold text-[9.5px] px-1.5 py-0.2 rounded border border-[#e2d5c5]">
                                {fam.adultsCount}A · {fam.kidsCount}K ({fam.partyTotal})
                              </span>
                              <DietaryBadges dietary={fam.dietarySummary} size="xs" showNone={false} />
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-[#15110e] text-[#dfc194]">
                          {fam.tableLabel}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* LIVE CONSOLE TAB 6: VENUE & LOGISTICS                        */}
          {/* ============================================================ */}
          {selectedWeddingId && consoleTab === 'venue' && (
            <div className="space-y-3 animate-in fade-in duration-150">
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

              {/* Tech & Audio Checklist */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-2.5">
                <h4 className="font-bold text-xs text-[#15110e]">Tech &amp; Audio Checklist</h4>
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
        {/* FLOATING ACTION BUTTON: CHEERS AI (SEATING) / JOEY (OTHER)     */}
        {/* ============================================================== */}
        {consoleTab === 'seating' ? (
          <button
            type="button"
            onClick={() => setIsCheersChatOpen(!isCheersChatOpen)}
            className="absolute bottom-20 right-4 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#15110e] to-[#251e18] text-[#dfc194] border-2 border-[#bd9661] shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all z-30"
            title="Open Cheers AI Concierge"
          >
            <span className="text-base">🥂</span>
            <span className="text-xs font-serif font-bold text-white tracking-wide">Cheers AI</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowJoey(!showJoey)}
            className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-[#dfc194] border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform z-30 overflow-hidden p-0"
            title="Ask Joey"
          >
            <img src="/chatbot-avatar.png" alt="Joey AI Assistant" className="w-full h-full object-cover" />
          </button>
        )}

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
                    {msg.attachment && (
                      <div className="flex items-center gap-2 mb-1.5 p-2 rounded-lg bg-black/10 border border-black/10 text-left">
                        <span className="text-base">📄</span>
                        <div className="truncate">
                          <div className="font-bold text-[11px] truncate">{msg.attachment.name}</div>
                          <div className="text-[9px] opacity-80">{(msg.attachment.size / 1024).toFixed(1)} KB • Document</div>
                        </div>
                      </div>
                    )}
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#8b7b6b] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

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

            {/* Attached file preview chip */}
            {attachedFile && (
              <div className="px-3 py-1.5 bg-[#faf5ed] border-t border-[#ebd3a8] flex items-center justify-between text-xs text-[#544332]">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#bd9661]">📎</span>
                  <span className="font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
                  <span className="text-[10px] text-[#8b7b6b]">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="text-[#8b7b6b] hover:text-red-700 font-bold p-0.5 cursor-pointer ml-2 text-sm"
                  title="Remove attached file"
                >
                  ✕
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim() && !attachedFile) return;
                handleJoeyPrompt(chatInput, attachedFile);
                setChatInput('');
                setAttachedFile(null);
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
              />

              {/* 1. Text box */}
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Joey or attach wedding files..."
                className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />

              {/* 2. Attach File Button (to the left of arrow) */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-xl border border-[#e8ded0] bg-[#faf8f5] hover:bg-[#f2ede4] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center cursor-pointer transition-colors shrink-0"
                title="Attach file (Run sheet, seating list, floorplan, catering spec)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              {/* 3. Send Message Arrow */}
              <button
                type="submit"
                disabled={!chatInput.trim() && !attachedFile}
                className="w-8 h-8 rounded-xl bg-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#a8824f] disabled:opacity-50 shrink-0"
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
          /* Home Mode Bottom Dock */
          <div className="h-[64px] bg-[#15110e] border-t border-[#2b221a] flex items-center justify-around px-1 z-20 flex-shrink-0 text-white">
            <button
              type="button"
              onClick={() => setHomeTab('weddings')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'weddings' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-[10px] mt-0.5">Team</span>
            </button>



            <button
              type="button"
              onClick={() => setHomeTab('referrals')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                homeTab === 'referrals' ? 'text-[#dfc194] font-bold' : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-[10px] mt-0.5">Settings</span>
            </button>
          </div>
        ) : (
          /* Live Console Mode Bottom Dock: Exclusively Run Sheet, Seating Arrangements & Venue (View Only) */
          <div className="h-[64px] bg-[#15110e] border-t border-[#2b221a] flex items-center justify-around px-3 z-20 flex-shrink-0 text-white gap-2">
            {/* 1. Run Sheet */}
            <button
              type="button"
              onClick={() => setConsoleTab('runsheet')}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl cursor-pointer transition-all ${
                consoleTab === 'runsheet'
                  ? 'bg-[#291f17] text-[#dfc194] font-bold border border-[#bd9661]/40 shadow-xs'
                  : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
              </svg>
              <span className="text-[11px] mt-0.5">Run Sheet</span>
            </button>

            {/* 2. Seating */}
            <button
              type="button"
              onClick={() => setConsoleTab('seating')}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl cursor-pointer transition-all ${
                consoleTab === 'seating'
                  ? 'bg-[#291f17] text-[#dfc194] font-bold border border-[#bd9661]/40 shadow-xs'
                  : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="12" cy="3.5" r="1.5" />
                <circle cx="12" cy="20.5" r="1.5" />
                <circle cx="3.5" cy="12" r="1.5" />
                <circle cx="20.5" cy="12" r="1.5" />
              </svg>
              <span className="text-[11px] mt-0.5">Seating</span>
            </button>

            {/* 3. Venue */}
            <button
              type="button"
              onClick={() => setConsoleTab('venue')}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl cursor-pointer transition-all ${
                consoleTab === 'venue'
                  ? 'bg-[#291f17] text-[#dfc194] font-bold border border-[#bd9661]/40 shadow-xs'
                  : 'text-[#8b7b6b] hover:text-white'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[11px] mt-0.5">Venue</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* ADD CUE MODAL                                                  */}
        {/* ============================================================== */}
        {showAddCueModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-[340px] w-full space-y-3.5 shadow-2xl border border-[#ebd3a8]">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <h3 className="font-serif text-base font-bold text-[#15110e]">Add Cue Entry</h3>
                <button
                  type="button"
                  onClick={() => setShowAddCueModal(false)}
                  className="text-gray-400 hover:text-black font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCueSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">Time (24h)</label>
                  <input
                    type="text"
                    required
                    value={newCueTime}
                    onChange={(e) => setNewCueTime(e.target.value)}
                    placeholder="17:00"
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2 font-mono font-bold text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">Cue Activity Title</label>
                  <input
                    type="text"
                    required
                    value={newCueActivity}
                    onChange={(e) => setNewCueActivity(e.target.value)}
                    placeholder="e.g. Speeches &amp; Champagne Toast"
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2 text-xs font-bold text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">Public Schedule Announcement</label>
                  <input
                    type="text"
                    value={newCueNotes}
                    onChange={(e) => setNewCueNotes(e.target.value)}
                    placeholder="Housekeeping notes or announcements..."
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#bd9661] mb-1">🔒 Private Cue &amp; Stage Direction</label>
                  <textarea
                    rows={2}
                    value={newCuePrivateNotes}
                    onChange={(e) => setNewCuePrivateNotes(e.target.value)}
                    placeholder="Technical sound directions, mic handoffs..."
                    className="w-full bg-[#fff8ee] border border-[#ebd4b8] rounded-xl p-2 text-xs text-[#453423] outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCueModal(false)}
                    className="flex-1 py-2 rounded-xl border border-[#e8ded0] bg-[#faf8f5] text-xs font-bold text-[#8b7b6b] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#bd9661] text-[#15110e] font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Save Cue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ADD TABLE MODAL                                                */}
        {/* ============================================================== */}
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

        {/* ============================================================== */}
        {/* TABLE DETAIL NATIVE BOTTOM SHEET (MOBILE CONSOLE)              */}
        {/* ============================================================== */}
        {activeMobileTable && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in">
            <div className="bg-white rounded-t-3xl p-5 max-w-[402px] w-full space-y-3.5 shadow-2xl border-t-2 border-[#bd9661] max-h-[82%] flex flex-col overflow-y-auto">
              <div className="flex items-start justify-between pb-2 border-b border-[#f0ede4] flex-shrink-0">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#15110e]">
                    {activeMobileTable.name} {activeMobileTable.isHead ? '👑' : ''}
                  </h3>
                  <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                    {activeMobileTable.shape || 'Round'} &bull; {activeMobileTable.category || 'Ballroom'} &bull; {activeTableGuests.length} / {activeMobileTable.capacity} Seated
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMobileTableId(null)}
                  className="w-7 h-7 rounded-full bg-[#faf8f5] border border-[#e8ded0] text-[#8b7b6b] hover:text-[#15110e] font-bold text-base flex items-center justify-center cursor-pointer transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Seated Guests at this Table */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-0.5">
                <div className="text-[10px] uppercase font-bold text-[#8b7b6b] tracking-wider">
                  Assigned Guests ({activeTableGuests.length}):
                </div>
                {activeTableGuests.length === 0 ? (
                  <div className="text-center py-4 bg-[#faf8f5] rounded-xl text-xs text-[#8b7b6b] border border-dashed border-[#e8ded0]">
                    No guests currently assigned to this table.
                  </div>
                ) : (
                  activeTableGuests.map((g, idx) => (
                    <div key={g.id} className="p-2.5 bg-[#faf8f5] rounded-xl border border-[#ebd3a8]/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#15110e]">{idx + 1}. {g.name}</div>
                        <div className="text-[10px] text-[#8b7b6b]">
                          {g.household || 'Individual'}{g.dietary && g.dietary !== 'None' ? ` • ${g.dietary}` : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnseatGuestMobile(g.id, g.name)}
                        className="text-[10px] text-[#bd9661] hover:text-[#916c3d] font-bold border border-[#ebd3a8] bg-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Unseat
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick-seat unallocated guest */}
              {activeTableGuests.length < activeMobileTable.capacity && unassignedGuests.length > 0 && (
                <div className="pt-2 border-t border-[#f0ede4] flex-shrink-0">
                  <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">
                    + Assign Unseated Guest to {activeMobileTable.name}:
                  </label>
                  <div className="flex gap-2">
                    <select
                      id={`seat_to_${activeMobileTable.id}`}
                      className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
                      defaultValue={unassignedGuests[0]?.id || ''}
                    >
                      {unassignedGuests.map((ug) => (
                        <option key={ug.id} value={ug.id}>
                          {ug.name} ({ug.household || 'General'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const sel = (document.getElementById(`seat_to_${activeMobileTable.id}`) as HTMLSelectElement)?.value;
                        if (sel) handleSeatGuestMobile(sel, activeMobileTable.id, activeMobileTable.name);
                      }}
                      className="bg-[#15110e] hover:bg-[#2b221a] text-[#dfc194] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Seat
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedMobileTableId(null)}
                className="w-full bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs flex-shrink-0"
              >
                Done Managing Table
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MOBILE SEATING PLAN CONFIGURATION FORM MODAL                   */}
        {/* ============================================================== */}
        {showSeatingConfigModal && (
          <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-3 animate-in fade-in">
            <div className="bg-white rounded-3xl p-4 max-w-[370px] w-full space-y-3 shadow-2xl border-2 border-[#bd9661] max-h-[94%] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-[#15110e] text-white p-3 px-4 flex items-center justify-between border-b border-[#bd9661]/40 shrink-0 rounded-t-3xl -mx-4 -mt-4 mb-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#dfc194] to-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-xs shadow-xs">
                    🌱
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#dfc194] leading-tight">
                      Seed Table
                    </h3>
                    <div className="text-[9.5px] text-[#bd9661] font-medium">Table Setup • Vertical Summary • AI</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSeatingConfigModal(false)}
                  className="w-7 h-7 rounded-lg text-[#dfc194] hover:text-white hover:bg-white/10 flex items-center justify-center text-lg cursor-pointer transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5 text-xs">
                {/* Auto-Fetched Guest Telemetry */}
                <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2.5 space-y-1.5 text-center">
                  <div className="text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Auto-Fetched From Guest List
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-white border border-[#e8ded0] p-1.5 rounded-lg shadow-2xs">
                      <div className="font-bold text-sm text-[#15110e]">{confirmedGuestsCount}</div>
                      <div className="text-[9px] text-[#8b7b6b]">Guests</div>
                    </div>
                    <div className="bg-white border border-[#e8ded0] p-1.5 rounded-lg shadow-2xs">
                      <div className="font-bold text-sm text-[#15110e]">{uniqueHouseholdsCount}</div>
                      <div className="text-[9px] text-[#8b7b6b]">Households</div>
                    </div>
                    <div className="bg-white border border-[#e8ded0] p-1.5 rounded-lg shadow-2xs">
                      <div className="font-bold text-sm text-[#bd9661]">{dietaryGuestsCount}</div>
                      <div className="text-[9px] text-[#8b7b6b]">Dietary</div>
                    </div>
                  </div>
                </div>

                {/* 1. TABLE CONFIGURATION (BATCH DEFAULTS) */}
                <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2.5 space-y-2">
                  <div className="flex items-center justify-between border-b border-[#f0e4d2] pb-1">
                    <span className="font-bold text-[10px] uppercase text-[#15110e] tracking-wider">
                      1. Table Configuration
                    </span>
                    <span className="text-[9px] text-[#bd9661] font-semibold">Defaults</span>
                  </div>

                  {/* Table Type */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#6b5847] mb-0.5">
                      Table Type
                    </label>
                    <select
                      value={configTableType}
                      onChange={(e) => setConfigTableType(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2 py-1.5 text-xs text-[#15110e] font-semibold outline-none"
                    >
                      <option value="Round Banquet">Round Banquet</option>
                      <option value="Rectangular">Rectangular</option>
                      <option value="Long Banquet">Long Banquet</option>
                      <option value="Sweetheart Table">Sweetheart Table</option>
                      <option value="Custom">Custom...</option>
                    </select>
                    {configTableType === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Custom table type..."
                        value={configCustomTableType}
                        onChange={(e) => setConfigCustomTableType(e.target.value)}
                        className="mt-1 w-full bg-white border border-[#bd9661] rounded-lg px-2 py-1 text-xs text-[#15110e]"
                      />
                    )}
                  </div>

                  {/* Seats per Table Stepper & Table Count */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#6b5847] mb-0.5">
                        Seats per Table
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(2, configSeatsPerTable - 1);
                            setConfigSeatsPerTable(next);
                            setMobileSeedTables(prev => prev.map(t => t.isHead ? t : { ...t, seats: next }));
                          }}
                          className="w-7 h-7 rounded-lg bg-white border border-[#d5c7b5] text-xs font-bold cursor-pointer"
                          title="Decrease seats per table"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-xs text-[#15110e]">
                          {configSeatsPerTable}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.min(30, configSeatsPerTable + 1);
                            setConfigSeatsPerTable(next);
                            setMobileSeedTables(prev => prev.map(t => t.isHead ? t : { ...t, seats: next }));
                          }}
                          className="w-7 h-7 rounded-lg bg-white border border-[#d5c7b5] text-xs font-bold cursor-pointer"
                          title="Increase seats per table"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#6b5847] mb-0.5">
                        Number of Tables
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setConfigTableCount(prev => Math.max(1, prev - 1))}
                          className="w-7 h-7 rounded-lg bg-white border border-[#d5c7b5] text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-xs text-[#15110e]">
                          {configTableCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setConfigTableCount(prev => Math.min(30, prev + 1))}
                          className="w-7 h-7 rounded-lg bg-white border border-[#d5c7b5] text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Use */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#6b5847] mb-0.5">
                      Use
                    </label>
                    <select
                      value={configReservedUse}
                      onChange={(e) => setConfigReservedUse(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-[11px] text-[#15110e] font-semibold outline-none"
                    >
                      <option value="General Seating">General Seating</option>
                      <option value="Head Table">Head Table</option>
                      <option value="VIP Table">VIP Table</option>
                      <option value="Bride's Family">Bride Family</option>
                      <option value="Groom's Family">Groom Family</option>
                      <option value="Accessible Seating">Accessible</option>
                      <option value="Custom">Custom...</option>
                    </select>
                    {configReservedUse === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Reserved..."
                        value={configCustomReservedUse}
                        onChange={(e) => setConfigCustomReservedUse(e.target.value)}
                        className="mt-1 w-full bg-white border border-[#bd9661] rounded-lg px-2 py-1 text-[11px]"
                      />
                    )}
                  </div>

                  {/* Add Table Button (Placed below Location & Use) */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddMobileConfiguredTables(configTableCount)}
                      className="w-full py-2 px-3 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white border border-[#bd9661] rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span className="text-sm font-bold text-[#bd9661]">+</span>
                      <span>Add to Setup</span>
                    </button>
                  </div>
                </div>

                {/* CAPACITY VALIDATION ALERT BAR */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${
                  isMobileCapacitySufficient
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span>{isMobileCapacitySufficient ? '✓' : '⚠️'}</span>
                    <span>
                      <strong>{totalMobilePlannedCapacity} Seats</strong> ({mobileSeedTables.length} Tables)
                    </span>
                  </div>
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                    isMobileCapacitySufficient ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {isMobileCapacitySufficient ? '✓ Covered' : `⚠️ Need ${mobileCapacityShortfall} Seats`}
                  </span>
                </div>

                {/* 2. TABLE SETUP (NORMAL ROWS AND COLUMNS TABLE) */}
                <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="flex items-center justify-between p-2.5 px-3 border-b border-[#f0e4d2] bg-white">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-xs text-[#15110e]">
                        Table Setup Summary
                      </span>
                      <span className="text-[9.5px] font-sans font-bold bg-[#faf5ed] border border-[#ebd3a8] text-[#8b6528] px-2 py-0.5 rounded-full">
                        {mobileSeedTables.length} Tables • {totalMobilePlannedCapacity} Seats
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-[#f7f4ee] border-b border-[#ebdcc9] text-[#6b5847] uppercase text-[9px] font-bold tracking-wider">
                          <th className="py-2 px-2.5 whitespace-nowrap">Table Name</th>
                          <th className="py-2 px-2 whitespace-nowrap">Table Type</th>
                          <th className="py-2 px-1 text-center whitespace-nowrap">No of Seats</th>
                          <th className="py-2 px-2.5 whitespace-nowrap">Table Assigned To</th>
                          <th className="py-2 px-2 text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ede4] bg-white">
                        {mobileSeedTableGroups.map((grp) => {
                          const isEditing = editingMobileGroupId === grp.groupKey;
                          const displayType = grp.type === 'Custom' ? (grp.customType || 'Custom') : grp.type;
                          const displayLoc = grp.location === 'Custom Location' ? (grp.customLocation || 'Custom') : grp.location;
                          const displayRes = grp.reserved === 'Custom' ? (grp.customReserved || 'Custom') : grp.reserved;

                          if (isEditing) {
                            return (
                              <tr key={grp.groupKey} className="bg-[#fdfbf7]">
                                <td className="py-1.5 px-2">
                                  <span className="font-bold text-[10.5px] text-[#15110e]">{grp.displayName}</span>
                                </td>
                                <td className="py-1.5 px-1.5">
                                  <select
                                    value={grp.type}
                                    onChange={(e) => handleUpdateMobileTableGroup(grp.tableIds, { type: e.target.value })}
                                    className="bg-white border border-[#d5c7b5] rounded px-1 py-0.5 text-[10px]"
                                  >
                                    <option value="Round Banquet">Round</option>
                                    <option value="Rectangular">Rect</option>
                                    <option value="Long Banquet">King</option>
                                    <option value="Sweetheart Table">Sweetheart</option>
                                  </select>
                                </td>
                                <td className="py-1.5 px-1 text-center">
                                  <input
                                    type="number"
                                    min="2"
                                    max="30"
                                    value={grp.seats}
                                    onChange={(e) => handleUpdateMobileTableGroup(grp.tableIds, { seats: Number(e.target.value) || 2 })}
                                    className="w-10 text-center bg-white border border-[#d5c7b5] rounded px-1 py-0.5 text-[10px] font-bold"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <select
                                    value={grp.reserved}
                                    onChange={(e) => handleUpdateMobileTableGroup(grp.tableIds, { reserved: e.target.value })}
                                    className="bg-white border border-[#d5c7b5] rounded px-1 py-0.5 text-[10px]"
                                  >
                                    <option value="General Seating">General</option>
                                    <option value="Head Table">Head Table</option>
                                    <option value="VIP Table">VIP</option>
                                    <option value="Bride's Family">Bride Family</option>
                                    <option value="Groom's Family">Groom Family</option>
                                    <option value="Accessible Seating">Accessible</option>
                                  </select>
                                </td>
                                <td className="py-1.5 px-2 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setEditingMobileGroupId(null)}
                                    className="px-1.5 py-0.5 bg-[#15110e] text-[#dfc194] rounded text-[10px] font-bold mr-1"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMobileTableGroup(grp.tableIds)}
                                    className="p-1 text-rose-600 rounded text-[10px] font-bold hover:bg-rose-50"
                                    title="Delete table entry"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={grp.groupKey} className="hover:bg-[#faf7f2] transition-colors">
                              <td className="py-2 px-2.5 font-bold text-[#15110e] whitespace-nowrap">
                                <span className="flex items-center gap-1.5">
                                  {grp.isHead || grp.reserved === 'Head Table' ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bd9661" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                  ) : grp.reserved === 'VIP Table' ? (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#bd9661" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                      <circle cx="12" cy="12" r="9" />
                                      <path d="M12 8v8" />
                                      <path d="M8 12h8" />
                                    </svg>
                                  ) : (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8b7b6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                      <rect width="18" height="18" x="3" y="3" rx="4" />
                                      <path d="M3 9h18" />
                                      <path d="M9 21V9" />
                                    </svg>
                                  )}
                                  <span>{grp.displayName}</span>
                                  {grp.count > 1 && (
                                    <span className="text-[9px] font-sans font-bold bg-[#faf5ed] border border-[#ebd3a8] text-[#8b6528] px-1 py-0.2 rounded-full">
                                      {grp.count}x
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-[#544332] whitespace-nowrap">
                                <span className="bg-[#faf8f5] border border-[#ebd3a8] text-[#8b6528] px-1.5 py-0.5 rounded text-[10px]">
                                  {displayType}
                                </span>
                              </td>
                              <td className="py-2 px-1 text-center whitespace-nowrap font-bold text-[#15110e]">
                                {grp.seats}
                              </td>
                              <td className="py-2 px-2.5 whitespace-nowrap">
                                <span className="bg-[#faf8f5] text-[#15110e] border border-[#e8ded0] px-1.5 py-0.5 rounded text-[10px] font-medium">
                                  {displayRes}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setEditingMobileGroupId(grp.groupKey)}
                                  className="px-1.5 py-0.5 bg-white border border-[#d5c7b5] text-[#15110e] rounded text-[10px] font-bold mr-1"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMobileTableGroup(grp.tableIds)}
                                  className="p-1 text-rose-600 rounded hover:bg-rose-50"
                                  title="Delete table entry"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
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

              {/* Footer */}
              <div className="flex gap-2 pt-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSeatingConfigModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#d5c7b5] bg-[#faf8f5] text-xs font-bold text-[#15110e] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApplyMobileSeatingConfig}
                  className="flex-2 py-2 rounded-xl bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] text-xs font-bold cursor-pointer hover:brightness-105 shadow-sm"
                >
                  ✨ Apply &amp; Launch Cheers AI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 🥂 CHEERS AI INTERACTIVE SEATING CHATBOT CONCIERGE (MOBILE)    */}
        {/* ============================================================== */}
        {isCheersChatOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[88vh] sm:h-[620px] shadow-2xl border border-[#bd9661] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
              {/* Caviar & Gold Header */}
              <div className="bg-[#15110e] text-white p-3.5 px-4 flex items-center justify-between border-b border-[#bd9661]/40 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dfc194] to-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm shadow-xs">
                    🥂
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#dfc194] leading-tight">
                      Cheers AI Concierge
                    </h3>
                    <p className="text-[10px] text-[#bd9661] font-mono">
                      Seating &amp; Floor Plan Intelligence
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheersChatOpen(false)}
                  className="w-8 h-8 rounded-full text-[#dfc194] hover:text-white hover:bg-white/10 flex items-center justify-center text-xl cursor-pointer transition-colors"
                  title="Close Cheers AI"
                >
                  &times;
                </button>
              </div>

              {/* Quick Action Prompt Chips (Scrollable Bar) */}
              <div className="bg-[#faf8f5] p-2 border-b border-[#ebdcc9] shrink-0 overflow-x-auto flex items-center gap-1.5 text-[11px] font-semibold no-scrollbar">
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('households')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                >
                  👨‍👩‍👧‍👦 Households
                </button>
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('vips')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                >
                  👑 VIP &amp; Head Table
                </button>
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('dietary')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                >
                  🥗 Dietary Cluster
                </button>
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('fill')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                >
                  ⚡ Auto-Fill
                </button>
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('seed')}
                  className="px-2.5 py-1 rounded-full bg-[#f4ecd8] hover:bg-[#15110e] hover:text-[#dfc194] text-[#6b5847] border border-[#bd9661] shrink-0 cursor-pointer transition-colors shadow-2xs font-bold whitespace-nowrap"
                >
                  🌱 Seed Tables
                </button>
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('audit')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                >
                  📊 Audit Room
                </button>
                <button
                  type="button"
                  onClick={() => handleCheersChatAction('reset')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 hover:text-rose-700 text-[#8b7b6b] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                >
                  🧹 Reset
                </button>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#fdfbf7]">
                {cheersMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs max-w-[92%] leading-relaxed shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-[#15110e] text-[#dfc194] rounded-tr-none'
                          : 'bg-white border border-[#ebdcc9] text-[#15110e] rounded-tl-none space-y-2'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Interactive Proposed Seating Card */}
                      {msg.proposal && msg.proposal.changes.length > 0 && (
                        <div className="bg-[#faf5ee] border border-[#ebd3a8] rounded-xl p-2.5 space-y-2 mt-2">
                          <div className="flex items-center justify-between border-b border-[#ebd3a8] pb-1.5">
                            <span className="font-bold text-[#15110e] text-[11px] truncate max-w-[200px]">
                              {msg.proposal.title}
                            </span>
                            <span className="bg-[#bd9661] text-[#15110e] px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                              {msg.proposal.count} Guests
                            </span>
                          </div>

                          {/* Allocations Scrollable List */}
                          <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px]">
                            {msg.proposal.changes.map(({ guestId, tableId }, i) => {
                              const g = (state.guests || []).find((x) => x.id === guestId);
                              const t = (state.tables || []).find((x) => x.id === tableId);
                              return (
                                <div
                                  key={i}
                                  className="bg-white border border-[#e8ded0] p-1.5 px-2 rounded-lg flex items-center justify-between"
                                >
                                  <span className="font-semibold text-[#15110e] truncate max-w-[120px]">
                                    {g?.name || 'Guest'}
                                  </span>
                                  <span className="text-[#8b7b6b] text-[10px]">&rarr;</span>
                                  <span className="font-bold text-[#bd9661] truncate max-w-[110px]">
                                    {t?.name || 'Table'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* 1-Click Apply Button */}
                          {msg.status === 'confirmed' || msg.isApplied ? (
                            <div className="w-full text-center py-2 bg-emerald-50 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 shadow-2xs">
                              <span>✓</span>
                              <span>Confirmed &amp; Applied to Floor Plan</span>
                            </div>
                          ) : msg.status === 'rejected' ? (
                            <div className="w-full text-center py-2 bg-[#fbeae8] text-[#a8382c] rounded-xl font-bold text-xs border border-[#f5c2bc] flex items-center justify-center gap-1.5 shadow-2xs">
                              <span>✕</span>
                              <span>Proposal Declined</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleRejectChatProposal(msg.id)}
                                className="flex-1 py-2 bg-white hover:bg-rose-50 text-[#8b7b6b] hover:text-rose-700 border border-[#d5c7b5] hover:border-rose-300 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1"
                              >
                                <span>✕</span>
                                <span>Reject</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleConfirmChatProposal(msg.id, msg.proposal)}
                                className="flex-2 py-2 bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                              >
                                <span>✓</span>
                                <span>Confirm &amp; Auto-Seat</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[9.5px] text-[#8b7b6b] mt-0.5 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendCheersMessage}
                className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Ask Cheers AI (e.g. 'Group families', 'Seat VIPs', 'Audit')..."
                  value={cheersChatInput}
                  onChange={(e) => setCheersChatInput(e.target.value)}
                  className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-medium"
                />
                <button
                  type="submit"
                  disabled={!cheersChatInput.trim()}
                  className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Send</span>
                  <span>&rarr;</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CREATE PROMO CODE MODAL                                        */}
        {/* ============================================================== */}
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

        {/* ============================================================== */}
        {/* MODAL: COMPARE SAVED SEATING ARRANGEMENTS                      */}
        {/* ============================================================== */}
        {showCompareArrangementsModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setShowCompareArrangementsModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#e8ded0] overflow-hidden flex flex-col max-h-[82vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚖️</span>
                  <div>
                    <div className="text-[9px] tracking-wider text-[#bd9661] uppercase font-bold">
                      SEATING COMPARISON
                    </div>
                    <h3 className="font-serif text-sm font-bold text-white">
                      Compare Saved Layouts
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompareArrangementsModal(false)}
                  className="text-white/70 hover:text-[#bd9661] text-base font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 overflow-y-auto space-y-3 text-xs flex-1">
                {savedArrangements.length === 0 ? (
                  <div className="text-center py-6 text-[#8b7b6b]">
                    No saved arrangements found. Save one to compare!
                  </div>
                ) : (
                  savedArrangements.map((arr) => {
                    const isActive = arr.id === activeArrangementId;
                    const roundCount = arr.tables.filter((t) => t.shape === 'round').length;
                    const rectCount = arr.tables.filter((t) => t.shape === 'rectangular').length;
                    const kingCount = arr.tables.filter((t) => t.shape === 'king' || t.isHead).length;
                    const seatedCount = arr.guestAssignments.filter((a) => a.tableId).length;

                    return (
                      <div
                        key={arr.id}
                        className={`border-2 rounded-xl p-3 space-y-2 transition-all ${
                          isActive
                            ? 'border-[#bd9661] bg-[#faf8f5] shadow-xs ring-1 ring-[#bd9661]/20'
                            : 'border-[#e8ded0] bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-serif text-xs font-bold text-[#15110e]">
                                {arr.name}
                              </h4>
                              {isActive && (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-[9.5px] text-[#8b7b6b] mt-0.5">
                              Saved by <strong>{arr.savedBy}</strong>
                            </div>
                          </div>
                          <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            arr.role === 'mc' ? 'bg-[#15110e] text-[#dfc194]' : 'bg-[#faf0e1] text-[#7d5e38]'
                          }`}>
                            {arr.role === 'mc' ? 'MC' : 'Couple'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                          <div className="bg-[#fcfaf7] p-1.5 rounded border border-[#f0ede6]">
                            <span className="text-[#8b7b6b] block text-[8.5px]">Geometry:</span>
                            <span className="font-semibold text-[#15110e]">
                              {roundCount}R &bull; {rectCount}Rect &bull; {kingCount}Head
                            </span>
                          </div>
                          <div className="bg-[#fcfaf7] p-1.5 rounded border border-[#f0ede6]">
                            <span className="text-[#8b7b6b] block text-[8.5px]">Seated:</span>
                            <span className="font-bold text-emerald-700">
                              {seatedCount} guests
                            </span>
                          </div>
                        </div>

                        {isActive ? (
                          <div className="text-emerald-700 font-bold text-[10.5px] flex items-center justify-center gap-1 pt-1">
                            <span>✓</span> Current Active Layout
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleLoadArrangement(arr.id)}
                            className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-1.5 rounded-lg text-[10.5px] cursor-pointer shadow-2xs text-center"
                          >
                            Load This Layout →
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-3.5 py-2.5 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-between">
                <span className="text-[10px] text-[#8b7b6b]">
                  {savedArrangements.length} total layouts saved
                </span>
                <button
                  type="button"
                  onClick={() => setShowCompareArrangementsModal(false)}
                  className="px-3 py-1 bg-white border border-[#d5c7b5] text-[#15110e] font-bold text-[10.5px] rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: SAVE SEATING ARRANGEMENT                                */}
        {/* ============================================================== */}
        {showSaveArrangementModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setShowSaveArrangementModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-xs w-full shadow-2xl border border-[#e8ded0] p-4 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <h3 className="font-serif text-sm font-bold text-[#15110e]">
                  Save Seating Arrangement
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSaveArrangementModal(false)}
                  className="text-gray-400 hover:text-black font-bold text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                  Arrangement Name
                </label>
                <input
                  type="text"
                  value={newArrangementName}
                  onChange={(e) => setNewArrangementName(e.target.value)}
                  placeholder="e.g. Seating Arrangement 2"
                  className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={newArrangementNotes}
                  onChange={(e) => setNewArrangementNotes(e.target.value)}
                  placeholder="e.g. Optimized dance floor clearance for entrance"
                  className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveArrangement}
                  className="flex-1 bg-[#15110e] text-[#dfc194] hover:text-white font-bold py-2 rounded-lg text-xs cursor-pointer"
                >
                  Save Layout
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveArrangementModal(false)}
                  className="px-3 py-2 bg-[#f0ede4] text-[#15110e] font-bold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
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
