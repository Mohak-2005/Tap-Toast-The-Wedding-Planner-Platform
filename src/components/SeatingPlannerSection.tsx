import React, { useState, useMemo, useEffect } from 'react';
import { useAppState, showToast, getStoredSession } from '../lib/state';
import { Table, TableShape, Guest, SavedSeatingArrangement, AuditLogEntry } from '../lib/types';
import { SEED_DATA } from '../lib/seedData';

interface SeatingPlannerSectionProps {
  onSelectView?: (view: string) => void;
  isMobileCompact?: boolean;
  weddingId?: string;
  isMcView?: boolean;
}

export const SeatingPlannerSection: React.FC<SeatingPlannerSectionProps> = ({
  onSelectView,
  isMobileCompact = false,
  weddingId,
  isMcView = false,
}) => {
  const { state, setState } = useAppState();

  const currentWeddingId = weddingId || state.currentWeddingId || 'w1';
  const currentWedding = useMemo(() => {
    return (state.weddings || []).find((w) => w.id === currentWeddingId) || (state.weddings || [])[0];
  }, [state.weddings, currentWeddingId]);

  // Navigation: Level 1 (Overall Room) vs Level 2 (Individual Table View)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Floor plan display mode
  const [floorViewStyle, setFloorViewStyle] = useState<'canvas' | 'grid' | 'roster'>(isMobileCompact ? 'canvas' : 'grid');

  // Search and Filters
  const [tableSearch, setTableSearch] = useState<string>('');
  const [filterShape, setFilterShape] = useState<string>('all');
  const [filterOccupancy, setFilterOccupancy] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Unassigned panel filters
  const [unassignedSearch, setUnassignedSearch] = useState<string>('');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState<string>('all');
  const [isUnassignedDrawerOpen, setIsUnassignedDrawerOpen] = useState<boolean>(true);
  const [isGuestListCollapsed, setIsGuestListCollapsed] = useState<boolean>(false);

  // Drilldown Level 2 Roster Panel Tab & Search
  const [drilldownRosterTab, setDrilldownRosterTab] = useState<'assigned' | 'unassigned'>('assigned');
  const [drilldownGuestSearch, setDrilldownGuestSearch] = useState<string>('');

  // Modals & Panels
  const [showAddTableModal, setShowAddTableModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showCheersAiModal, setShowCheersAiModal] = useState<boolean>(false);
  const [aiProposal, setAiProposal] = useState<{ title: string; desc: string; count: number; changes: { guestId: string; tableId: string }[] } | null>(null);
  const [activeAiScenario, setActiveAiScenario] = useState<'households' | 'vips' | 'dietary' | 'fill'>('households');

  // Interactive Cheers AI Chatbot State
  const [isCheersChatOpen, setIsCheersChatOpen] = useState<boolean>(false);
  const [cheersChatInput, setCheersChatInput] = useState<string>('');
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
      text: "Hello! I'm Cheers AI, your dedicated seating & floor plan concierge. I can analyze your guest list, pair households together, arrange dietary preferences, seat VIPs at the head table, or help you seed new tables for your venue. How would you like to arrange your tables today?",
      timestamp: 'Just now',
    },
  ]);

  // -------------------------------------------------------------
  // Seed Table Form State: Table Configuration & Vertical Summary Cards
  // -------------------------------------------------------------
  interface SeedTableCard {
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

  const [showSeedTablesModal, setShowSeedTablesModal] = useState<boolean>(false);
  const [configTableCount, setConfigTableCount] = useState<number>(8);
  
  // Default / Batch Table Configuration
  const [configTableType, setConfigTableType] = useState<string>('Round Banquet');
  const [configCustomTableType, setConfigCustomTableType] = useState<string>('');
  const [configSeatsPerTable, setConfigSeatsPerTable] = useState<number>(10);
  const [configTableLocation, setConfigTableLocation] = useState<string>('Near Stage');
  const [configCustomLocation, setConfigCustomLocation] = useState<string>('');
  const [configReservedUse, setConfigReservedUse] = useState<string>('General Seating');
  const [configCustomReservedUse, setConfigCustomReservedUse] = useState<string>('');

  // Special Rules & Dietary Strategy
  const [configDietaryStrategy, setConfigDietaryStrategy] = useState<'cluster' | 'distributed' | 'vip_first' | 'standard'>('cluster');
  const [configIncludeHeadTable, setConfigIncludeHeadTable] = useState<boolean>(true);
  const [configReserveVipTables, setConfigReserveVipTables] = useState<boolean>(true);

  // Section 2: Guest Groups & Preferences
  const [configFamilyGrouping, setConfigFamilyGrouping] = useState<'side_by_side' | 'separate' | 'combined'>('side_by_side');
  const [configSocialGrouping, setConfigSocialGrouping] = useState<'social_circles' | 'integrated_mix' | 'vip_proximity'>('social_circles');
  const [configChildrenGrouping, setConfigChildrenGrouping] = useState<'with_parents' | 'kids_table' | 'flexible_pods'>('with_parents');
  const [configSitTogether, setConfigSitTogether] = useState<'couples_families' | 'households_strict' | 'friend_duos'>('couples_families');
  const [configSitSeparately, setConfigSitSeparately] = useState<'conflicts_buffer' | 'ex_partners' | 'none'>('conflicts_buffer');
  const [configFamilyCouplesChildren, setConfigFamilyCouplesChildren] = useState<'strict_family_unit' | 'young_kids_only' | 'standard'>('strict_family_unit');

  // Vertically Stacked Seed Table Summary Cards
  const [seedTables, setSeedTables] = useState<SeedTableCard[]>([
    {
      id: 'st_head',
      name: 'Head Table',
      type: 'Round Banquet',
      seats: 8,
      location: 'Near Stage',
      reserved: 'Head Table',
      isHead: true,
    },
    {
      id: 'st_1',
      name: 'Table 1',
      type: 'Round Banquet',
      seats: 10,
      location: 'Near Stage',
      reserved: 'VIP Table',
      isHead: false,
    },
    {
      id: 'st_2',
      name: 'Table 2',
      type: 'Round Banquet',
      seats: 10,
      location: 'Near Stage',
      reserved: 'VIP Table',
      isHead: false,
    },
    {
      id: 'st_3',
      name: 'Table 3',
      type: 'Round Banquet',
      seats: 10,
      location: 'Dance Floor',
      reserved: "Bride's Family",
      isHead: false,
    },
    {
      id: 'st_4',
      name: 'Table 4',
      type: 'Round Banquet',
      seats: 10,
      location: 'Dance Floor',
      reserved: "Groom's Family",
      isHead: false,
    },
    {
      id: 'st_5',
      name: 'Table 5',
      type: 'Round Banquet',
      seats: 10,
      location: 'Quiet Area',
      reserved: 'General Seating',
      isHead: false,
    },
    {
      id: 'st_6',
      name: 'Table 6',
      type: 'Round Banquet',
      seats: 10,
      location: 'Entrance',
      reserved: 'General Seating',
      isHead: false,
    },
    {
      id: 'st_7',
      name: 'Table 7',
      type: 'Round Banquet',
      seats: 10,
      location: 'Kitchen/Service Area',
      reserved: 'General Seating',
      isHead: false,
    },
    {
      id: 'st_8',
      name: 'Table 8',
      type: 'Round Banquet',
      seats: 10,
      location: 'Accessible Area',
      reserved: 'Accessible Seating',
      isHead: false,
    },
  ]);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  // Grouping logic: collapse tables with identical column info into 1 entry
  const seedTableGroups = useMemo(() => {
    interface TableGroup {
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

    const groups: TableGroup[] = [];
    const map = new Map<string, TableGroup>();

    for (const tbl of seedTables) {
      const displayType = tbl.type === 'Custom' ? (tbl.customType || 'Custom') : tbl.type;
      const displayLoc = tbl.location === 'Custom Location' ? (tbl.customLocation || 'Custom') : tbl.location;
      const displayRes = tbl.reserved === 'Custom' ? (tbl.customReserved || 'Custom') : tbl.reserved;
      const key = `${displayType}:::${tbl.seats}:::${displayLoc}:::${displayRes}:::${tbl.isHead ? 'head' : 'regular'}`;

      if (!map.has(key)) {
        const newGroup: TableGroup = {
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
          isHead: tbl.isHead,
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
      const matching = seedTables.filter(t => grp.tableIds.includes(t.id));
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
  }, [seedTables]);

  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  const handleUpdateTableGroup = (tableIds: string[], updates: Partial<SeedTableCard>) => {
    setSeedTables((prev) =>
      prev.map((t) => (tableIds.includes(t.id) ? { ...t, ...updates } : t))
    );
  };

  const handleDeleteTableGroup = (tableIds: string[]) => {
    if (seedTables.length <= tableIds.length) {
      showToast('At least one table must remain in your floor plan.', 'error');
      return;
    }
    setSeedTables((prev) => prev.filter((t) => !tableIds.includes(t.id)));
    setConfigTableCount((prev) => Math.max(1, prev - tableIds.length));
    showToast('Table entry removed from setup', 'info');
  };


  // New Table Form State
  const [newTableName, setNewTableName] = useState<string>('');
  const [newTableShape, setNewTableShape] = useState<TableShape>('round');
  const [newTableCapacity, setNewTableCapacity] = useState<number>(10);
  const [newTableCategory, setNewTableCategory] = useState<string>('Family');
  const [newTableZone, setNewTableZone] = useState<string>('Main Ballroom');

  // Drag and Drop state
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ type: 'table' | 'seat'; tableId?: string; seatIndex?: number } | null>(null);

  // Dragging tables around floor canvas
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);

  // Ensure tables have initial shape and coordinates if missing
  // Filter guests for this specific wedding
  const weddingGuests = useMemo(() => {
    return (state.guests || []).filter((g) => (g.weddingId || 'w1') === currentWeddingId);
  }, [state.guests, currentWeddingId]);

  // Auto-Fetched Guest Intelligence Telemetry for Cheers AI Configuration
  const confirmedGuestsCount = useMemo(() => {
    return weddingGuests.filter((g) => g.rsvpStatus !== 'declined').length;
  }, [weddingGuests]);

  const uniqueHouseholds = useMemo(() => {
    return Array.from(new Set(weddingGuests.map((g) => g.household).filter(Boolean)));
  }, [weddingGuests]);

  const dietaryGuestsCount = useMemo(() => {
    return weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary.trim() !== '').length;
  }, [weddingGuests]);

  // Dynamically calculate recommended tables needed based on guest count and seats per table
  const suggestedTablesCount = useMemo(() => {
    const guestsRemaining = Math.max(1, confirmedGuestsCount - (configIncludeHeadTable ? 8 : 0));
    return Math.max(1, Math.ceil(guestsRemaining / configSeatsPerTable));
  }, [confirmedGuestsCount, configIncludeHeadTable, configSeatsPerTable]);

  useEffect(() => {
    setConfigTableCount(suggestedTablesCount);
  }, [suggestedTablesCount]);

  // Total Planned Capacity & Validation Memos
  const totalPlannedCapacity = useMemo(() => {
    return seedTables.reduce((acc, t) => acc + (Number(t.seats) || 0), 0);
  }, [seedTables]);

  const capacityShortfall = Math.max(0, confirmedGuestsCount - totalPlannedCapacity);
  const isCapacitySufficient = totalPlannedCapacity >= confirmedGuestsCount;

  // Handlers for Vertical Table Summary operations
  const handleBatchCountChange = (newCount: number) => {
    const val = Math.max(1, Math.min(24, newCount));
    setConfigTableCount(val);
    setSeedTables((prev) => {
      const nonHead = prev.filter((t) => !t.isHead);
      const head = prev.find((t) => t.isHead);
      if (val > nonHead.length) {
        const added: SeedTableCard[] = [];
        for (let i = nonHead.length + 1; i <= val; i++) {
          added.push({
            id: `st_${Date.now()}_${i}`,
            name: `Table ${i}`,
            type: configTableType,
            customType: configCustomTableType || undefined,
            seats: configSeatsPerTable,
            location: configTableLocation,
            customLocation: configCustomLocation || undefined,
            reserved: configReservedUse,
            customReserved: configCustomReservedUse || undefined,
            isHead: false,
          });
        }
        return head ? [head, ...nonHead, ...added] : [...nonHead, ...added];
      } else if (val < nonHead.length) {
        const kept = nonHead.slice(0, val);
        return head ? [head, ...kept] : kept;
      }
      return prev;
    });
  };

  const handleAddConfiguredTables = (count: number = 1) => {
    const toAdd: SeedTableCard[] = [];
    let currentNonHead = seedTables.filter((t) => !t.isHead).length;
    for (let i = 0; i < count; i++) {
      currentNonHead += 1;
      const isHead = configReservedUse === 'Head Table' && !seedTables.some(t => t.isHead) && i === 0;
      toAdd.push({
        id: `st_custom_${Date.now()}_${i}`,
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
    setSeedTables((prev) => [...prev, ...toAdd]);
    showToast(`Added ${count} table${count > 1 ? 's' : ''} to floor setup`, 'success');
  };

  const handleAddSeedTable = (overrideSeats?: number) => {
    const nextNum = seedTables.filter((t) => !t.isHead).length + 1;
    const newTbl: SeedTableCard = {
      id: `st_custom_${Date.now()}`,
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
    setSeedTables((prev) => [...prev, newTbl]);
    setConfigTableCount((prev) => prev + 1);
    setEditingTableId(newTbl.id);
  };

  const handleDeleteSeedTable = (id: string) => {
    if (seedTables.length <= 1) {
      showToast('At least one table must remain in your floor plan.', 'error');
      return;
    }
    setSeedTables((prev) => prev.filter((t) => t.id !== id));
    setConfigTableCount((prev) => Math.max(1, prev - 1));
    showToast('Table removed from setup summary', 'info');
  };

  const handleUpdateSeedTable = (id: string, updates: Partial<SeedTableCard>) => {
    setSeedTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Ensure tables have initial shape and coordinates if missing, filtered by current wedding
  const tables: Table[] = useMemo(() => {
    const rawTables = (state.tables || []).filter((t) => (t.weddingId || 'w1') === currentWeddingId);
    return rawTables.map((tbl, idx) => {
      let shape: TableShape = tbl.shape || (tbl.isHead ? 'king' : idx % 3 === 0 ? 'rectangular' : 'round');
      let capacity = tbl.capacity || (tbl.isHead ? 8 : shape === 'king' ? 32 : 10);
      let x = tbl.x !== undefined ? tbl.x : 15 + (idx % 4) * 20;
      let y = tbl.y !== undefined ? tbl.y : 25 + Math.floor(idx / 4) * 16;
      let category = tbl.category || (tbl.isHead ? 'Bridal Party' : idx % 2 === 0 ? 'Family' : 'Friends');
      let zone = tbl.zone || 'Main Ballroom';
      const cleanName = (tbl.name || '').replace(/\s*\([^)]*\)/g, '').trim() || tbl.name || `Table ${idx + 1}`;
      return { ...tbl, name: cleanName, weddingId: currentWeddingId, shape, capacity, x, y, category, zone };
    });
  }, [state.tables, currentWeddingId]);

  // ==============================================================
  // SAVED SEATING ARRANGEMENTS & AUDIT LOG SYNC (Couple <-> MC)
  // ==============================================================
  const savedArrangements: SavedSeatingArrangement[] = useMemo(() => {
    const list: SavedSeatingArrangement[] = (currentWedding as any)?.savedSeatingArrangements || [];
    const defaultArrs = (SEED_DATA.weddings[0] as any)?.savedSeatingArrangements || [];
    const missing = defaultArrs.filter((d: SavedSeatingArrangement) => !list.some(a => a.id === d.id));
    return [...list, ...missing];
  }, [currentWedding]);

  // Comparison Mode States (Web View)
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [selectedCompareArrangementIds, setSelectedCompareArrangementIds] = useState<string[]>(['arr_1', 'arr_2']);
  const [isFloatingGuestListOpen, setIsFloatingGuestListOpen] = useState<boolean>(true);
  const [floatingGuestListPos, setFloatingGuestListPos] = useState<{ x: number; y: number }>(() => ({ x: typeof window !== 'undefined' ? Math.max(80, window.innerWidth - 380) : 700, y: 150 }));
  const [isDraggingFloatingList, setIsDraggingFloatingList] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeCompareTabArrId, setActiveCompareTabArrId] = useState<string>('arr_1');
  const [compareGuestSearch, setCompareGuestSearch] = useState<string>('');
  const [compareViewingTable, setCompareViewingTable] = useState<{ arrId: string; tableId: string } | null>(null);
  const [compareDraggingTable, setCompareDraggingTable] = useState<{ arrId: string; tableId: string } | null>(null);
  const [compareDraggingDanceFloor, setCompareDraggingDanceFloor] = useState<string | null>(null);
  const [addTableTargetArrangementId, setAddTableTargetArrangementId] = useState<string | null>(null);

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
    return (currentWedding as any)?.danceFloorPos || { x: 50, y: 50 };
  });
  const [isDraggingDanceFloor, setIsDraggingDanceFloor] = useState<boolean>(false);

  // Sync danceFloorPos when currentWedding changes
  useEffect(() => {
    if ((currentWedding as any)?.danceFloorPos) {
      setDanceFloorPos((currentWedding as any).danceFloorPos);
    }
  }, [currentWeddingId, currentWedding]);

  // Floating Draggable Guest List mousemove/mouseup listener
  useEffect(() => {
    if (!isDraggingFloatingList) return;
    const handleMouseMove = (e: MouseEvent) => {
      setFloatingGuestListPos({
        x: Math.max(10, Math.min(window.innerWidth - 370, e.clientX - dragOffset.x)),
        y: Math.max(10, Math.min(window.innerHeight - 160, e.clientY - dragOffset.y)),
      });
    };
    const handleMouseUp = () => {
      setIsDraggingFloatingList(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingFloatingList, dragOffset]);

  const handleFloatingMouseDown = (e: React.MouseEvent) => {
    setIsDraggingFloatingList(true);
    setDragOffset({
      x: e.clientX - floatingGuestListPos.x,
      y: e.clientY - floatingGuestListPos.y,
    });
  };

  // Update a specific saved seating arrangement
  const updateSavedArrangement = (
    arrId: string,
    updater: (arr: SavedSeatingArrangement) => SavedSeatingArrangement
  ) => {
    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        let existing: SavedSeatingArrangement[] = (w as any).savedSeatingArrangements || [];
        if (!existing.some((a) => a.id === arrId)) {
          const fallback = savedArrangements.find((a) => a.id === arrId);
          if (fallback) existing = [...existing, fallback];
        }
        const updated = existing.map((a) => (a.id === arrId ? updater(a) : a));
        return {
          ...w,
          savedSeatingArrangements: updated,
        };
      }
      return w;
    });

    const targetArr = savedArrangements.find((a) => a.id === arrId);
    if (targetArr && arrId === activeArrangementId) {
      const newArr = updater(targetArr);
      const updatedTables = (state.tables || []).map((t) => {
        if (t.weddingId === currentWeddingId) {
          const found = newArr.tables.find((st) => st.id === t.id);
          return found ? { ...found } : t;
        }
        return t;
      });
      const newTbls = newArr.tables.filter((st) => !state.tables.some((t) => t.id === st.id));
      const finalTables = [...updatedTables, ...newTbls];

      const updatedGuests = (state.guests || []).map((g) => {
        if (g.weddingId === currentWeddingId) {
          const assign = newArr.guestAssignments.find((a) => a.guestId === g.id);
          if (assign !== undefined) {
            return { ...g, tableId: assign.tableId, seatIndex: assign.seatIndex ?? null };
          }
        }
        return g;
      });

      setState({
        ...state,
        weddings: updatedWeddings,
        tables: finalTables,
        guests: updatedGuests,
      });
    } else {
      setState({
        ...state,
        weddings: updatedWeddings,
      });
    }
  };

  // Seat or unseat a guest in a specific arrangement
  const handleSeatGuestInArrangement = (
    arrId: string,
    guestId: string,
    tableId: string | null
  ) => {
    const arr = savedArrangements.find((a) => a.id === arrId);
    if (!arr) return;
    const targetTbl = arr.tables.find((t) => t.id === tableId);
    const guest = weddingGuests.find((g) => g.id === guestId);

    if (tableId && targetTbl) {
      const alreadySeated = arr.guestAssignments.filter((a) => a.tableId === tableId).length;
      if (alreadySeated >= targetTbl.capacity) {
        showToast(`Table "${targetTbl.name}" in ${arr.name} is already full!`, 'error');
        return;
      }
    }

    updateSavedArrangement(arrId, (currentArr) => {
      const otherAssignments = currentArr.guestAssignments.filter((a) => a.guestId !== guestId);
      const currentAtTable = otherAssignments.filter((a) => a.tableId === tableId);
      const nextSeatIndex = tableId ? currentAtTable.length : null;
      return {
        ...currentArr,
        guestAssignments: [
          ...otherAssignments,
          { guestId, tableId, seatIndex: nextSeatIndex },
        ],
      };
    });

    if (tableId && targetTbl && guest) {
      showToast(`Seated ${guest.name} at ${targetTbl.name} (${arr.name})`, 'success');
    } else if (guest) {
      showToast(`Unseated ${guest.name} from ${arr.name}`, 'info');
    }
  };

  // Reposition dance floor within an arrangement canvas
  const handleCompareDanceFloorDragEnd = (
    arrId: string,
    clientX: number,
    clientY: number,
    containerRect: DOMRect
  ) => {
    const rawX = ((clientX - containerRect.left) / containerRect.width) * 100;
    const rawY = ((clientY - containerRect.top) / containerRect.height) * 100;
    const clampedX = Math.max(16, Math.min(84, Math.round(rawX)));
    const clampedY = Math.max(18, Math.min(82, Math.round(rawY)));

    updateSavedArrangement(arrId, (currentArr) => ({
      ...currentArr,
      danceFloorPos: { x: clampedX, y: clampedY },
    }));

    if (arrId === activeArrangementId) {
      setDanceFloorPos({ x: clampedX, y: clampedY });
    }
  };

  // Reposition table within an arrangement canvas
  const handleCompareTableDragEnd = (
    arrId: string,
    tableId: string,
    clientX: number,
    clientY: number,
    containerRect: DOMRect
  ) => {
    const rawX = ((clientX - containerRect.left) / containerRect.width) * 100;
    const rawY = ((clientY - containerRect.top) / containerRect.height) * 100;
    const clampedX = Math.max(8, Math.min(92, Math.round(rawX)));
    const clampedY = Math.max(12, Math.min(88, Math.round(rawY)));

    updateSavedArrangement(arrId, (currentArr) => ({
      ...currentArr,
      tables: currentArr.tables.map((t) => (t.id === tableId ? { ...t, x: clampedX, y: clampedY } : t)),
    }));
  };

  // Open Level 2 table view directly from comparison mode
  const handleOpenTableFromComparison = (arrId: string, tableId: string) => {
    const targetArr = savedArrangements.find((a) => a.id === arrId);
    if (targetArr) {
      const otherTables = (state.tables || []).filter((t) => t.weddingId !== currentWeddingId);
      const updatedTables = [...otherTables, ...targetArr.tables.map((t) => ({ ...t }))];

      const updatedGuests = (state.guests || []).map((g) => {
        if (g.weddingId === currentWeddingId) {
          const assign = targetArr.guestAssignments.find((a) => a.guestId === g.id);
          return {
            ...g,
            tableId: assign ? assign.tableId : null,
            seatIndex: assign ? (assign.seatIndex ?? null) : null,
          };
        }
        return g;
      });

      setActiveArrangementId(targetArr.id);
      setActiveArrangementName(targetArr.name);
      setState({
        ...state,
        tables: updatedTables,
        guests: updatedGuests,
      });
    }
    setSelectedTableId(tableId);
  };

  // Add a new table to an arrangement in comparison mode
  const handleCompareAddTable = (arrId: string) => {
    const arr = savedArrangements.find((a) => a.id === arrId);
    if (!arr) return;
    const nextNum = arr.tables.filter((t) => !t.isHead).length + 1;
    const newTbl: Table = {
      id: `tbl_cmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      weddingId: currentWeddingId,
      name: `Table ${nextNum}`,
      shape: 'round',
      capacity: 10,
      x: 35 + (nextNum % 4) * 12,
      y: 40 + (nextNum % 3) * 12,
      category: 'General Seating',
      isHead: false,
    };

    updateSavedArrangement(arrId, (currentArr) => ({
      ...currentArr,
      tables: [...currentArr.tables, newTbl],
    }));

    showToast(`Added ${newTbl.name} to ${arr.name}!`, 'success');
  };

  // Compare Modal Selection handler
  const handleToggleSelectCompareArrangement = (arrId: string) => {
    if (selectedCompareArrangementIds.includes(arrId)) {
      setSelectedCompareArrangementIds((prev) => prev.filter((id) => id !== arrId));
    } else {
      if (selectedCompareArrangementIds.length >= 3) {
        showToast('Max limit : 3 reached', 'error');
        return;
      }
      setSelectedCompareArrangementIds((prev) => [...prev, arrId]);
    }
  };

  // Launch Comparison Mode
  const handleLaunchComparison = () => {
    if (selectedCompareArrangementIds.length < 2) {
      showToast('Please select at least 2 arrangements to compare', 'error');
      return;
    }
    setShowCompareArrangementsModal(false);
    setIsComparing(true);
    setIsFloatingGuestListOpen(true);
    setActiveCompareTabArrId(selectedCompareArrangementIds[0]);
  };

  // Compared arrangements objects
  const comparedArrangements = useMemo(() => {
    return selectedCompareArrangementIds
      .map((id) => savedArrangements.find((a) => a.id === id))
      .filter((a): a is SavedSeatingArrangement => Boolean(a));
  }, [selectedCompareArrangementIds, savedArrangements]);

  const activeCompareArrangement = useMemo(() => {
    return comparedArrangements.find((a) => a.id === activeCompareTabArrId) || comparedArrangements[0];
  }, [comparedArrangements, activeCompareTabArrId]);

  const activeCompareUnassignedGuests = useMemo(() => {
    if (!activeCompareArrangement) return [];
    return weddingGuests.filter((g) => {
      const isSeatedInThis = activeCompareArrangement.guestAssignments.some(
        (a) => a.guestId === g.id && a.tableId
      );
      if (isSeatedInThis) return false;
      if (compareGuestSearch.trim()) {
        const query = compareGuestSearch.toLowerCase();
        return (
          g.name.toLowerCase().includes(query) ||
          (g.category && g.category.toLowerCase().includes(query)) ||
          (g.dietary && g.dietary.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [activeCompareArrangement, weddingGuests, compareGuestSearch]);

  const compareViewingArrangement = useMemo(() => {
    if (!compareViewingTable) return null;
    return savedArrangements.find((a) => a.id === compareViewingTable.arrId) || null;
  }, [compareViewingTable, savedArrangements]);

  const compareViewingTableObj = useMemo(() => {
    if (!compareViewingArrangement || !compareViewingTable) return null;
    return compareViewingArrangement.tables.find((t) => t.id === compareViewingTable.tableId) || null;
  }, [compareViewingArrangement, compareViewingTable]);

  const compareViewingTableSeatedGuests = useMemo(() => {
    if (!compareViewingArrangement || !compareViewingTable) return [];
    const assignments = compareViewingArrangement.guestAssignments.filter(
      (a) => a.tableId === compareViewingTable.tableId
    );
    return assignments
      .map((a) => weddingGuests.find((g) => g.id === a.guestId))
      .filter((g): g is typeof weddingGuests[0] => Boolean(g));
  }, [compareViewingArrangement, compareViewingTable, weddingGuests]);

  const handleSaveArrangement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const session = getStoredSession();
    const effectiveIsMc = isMcView || session?.role === 'mc';
    const authorName = effectiveIsMc
      ? (session?.name || currentWedding?.selectedMc?.name || 'Robert Galati (MC)')
      : (session?.name || currentWedding?.couple || 'Sophie & James (Couple)');
    const authorRole: 'couple' | 'mc' = effectiveIsMc ? 'mc' : 'couple';

    const defaultName = `Seating Arrangement ${savedArrangements.length + 1}`;
    const finalName = newArrangementName.trim() || defaultName;

    const newArr: SavedSeatingArrangement = {
      id: `arr_${Date.now()}`,
      weddingId: currentWeddingId,
      name: finalName,
      savedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      savedBy: authorName,
      role: authorRole,
      danceFloorPos: { ...danceFloorPos },
      notes: newArrangementNotes.trim() || `Floor plan snapshot with ${tables.length} tables and ${weddingGuests.filter(g => g.tableId).length} seated guests.`,
      tables: tables.map(t => ({ ...t })),
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
      user: authorName,
      role: authorRole,
      category: 'Seating',
      details: `Saved seating layout "${newArr.name}" with ${tables.length} tables and ${weddingGuests.filter(g => g.tableId).length} seated guests for ${currentWedding?.couple || 'Wedding'}. Synced between Couple & MC consoles.`,
    };

    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        const existing = (w as any).savedSeatingArrangements || [];
        return {
          ...w,
          danceFloorPos: { ...danceFloorPos },
          savedSeatingArrangements: [...existing, newArr],
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
    showToast(`Saved "${newArr.name}"! Synced to both Couple & MC consoles.`, 'success');
  };

  const handleLoadArrangement = (arrId: string) => {
    const arr = savedArrangements.find((a) => a.id === arrId);
    if (!arr) return;

    const session = getStoredSession();
    const effectiveIsMc = isMcView || session?.role === 'mc';
    const authorName = effectiveIsMc
      ? (session?.name || currentWedding?.selectedMc?.name || 'Robert Galati (MC)')
      : (session?.name || currentWedding?.couple || 'Sophie & James (Couple)');
    const authorRole: 'couple' | 'mc' = effectiveIsMc ? 'mc' : 'couple';

    // 1. Update tables for this wedding
    const updatedTables = (state.tables || []).map((t) => {
      if (t.weddingId === currentWeddingId) {
        const savedTbl = arr.tables.find((st) => st.id === t.id);
        if (savedTbl) {
          return { ...savedTbl };
        }
      }
      return t;
    });

    // 2. Update guest assignments for this wedding
    const assignmentMap = new Map(arr.guestAssignments.map((a) => [a.guestId, a]));
    const updatedGuests = (state.guests || []).map((g) => {
      if (g.weddingId === currentWeddingId) {
        const assignment = assignmentMap.get(g.id);
        if (assignment) {
          return { ...g, tableId: assignment.tableId, seatIndex: assignment.seatIndex };
        }
      }
      return g;
    });

    // 3. Update Dance Floor Position if present in saved arrangement
    if (arr.danceFloorPos) {
      setDanceFloorPos(arr.danceFloorPos);
    }

    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        return {
          ...w,
          danceFloorPos: arr.danceFloorPos || w.danceFloorPos || { x: 50, y: 50 },
        };
      }
      return w;
    });

    // 4. Super Admin Audit Log
    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: 'Seating Arrangement Loaded',
      user: authorName,
      role: authorRole,
      category: 'Seating',
      details: `Switched active layout to "${arr.name}" (saved by ${arr.savedBy}) for ${currentWedding?.couple || 'Wedding'}.`,
    };

    setState({
      ...state,
      weddings: updatedWeddings,
      tables: updatedTables,
      guests: updatedGuests,
      auditLog: [auditEntry, ...(state.auditLog || [])],
    });

    setActiveArrangementId(arr.id);
    setActiveArrangementName(arr.name);
    if (showCompareArrangementsModal) setShowCompareArrangementsModal(false);
    showToast(`Activated "${arr.name}" (Saved by ${arr.savedBy})`, 'info');
  };

  // Active table in Level 2
  const activeTable = useMemo(() => {
    if (!selectedTableId) return null;
    return tables.find((t) => t.id === selectedTableId) || null;
  }, [selectedTableId, tables]);

  // Guests at active table
  const guestsAtActiveTable = useMemo(() => {
    if (!selectedTableId) return [];
    return weddingGuests.filter((g) => g.tableId === selectedTableId);
  }, [selectedTableId, weddingGuests]);

  // All unassigned guests across this wedding (independent of drawer filters)
  const allWeddingUnassignedGuests = useMemo(() => {
    return weddingGuests.filter((g) => !g.tableId || g.tableId === null);
  }, [weddingGuests]);

  // Filtered remaining guests for Level 2 drilldown panel
  const filteredDrilldownRemainingGuests = useMemo(() => {
    if (!drilldownGuestSearch.trim()) return allWeddingUnassignedGuests;
    const q = drilldownGuestSearch.toLowerCase();
    return allWeddingUnassignedGuests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.household && g.household.toLowerCase().includes(q)) ||
        (g.dietary && g.dietary.toLowerCase().includes(q))
    );
  }, [allWeddingUnassignedGuests, drilldownGuestSearch]);

  // All confirmed guests
  const confirmedGuests = useMemo(() => {
    return weddingGuests.filter((g) => g.rsvpStatus === 'confirmed');
  }, [weddingGuests]);

  // Unassigned guests list
  const unassignedGuests = useMemo(() => {
    return weddingGuests.filter((g) => {
      const isUnseated = !g.tableId || g.tableId === null;
      const matchesSearch = unassignedSearch === '' || g.name.toLowerCase().includes(unassignedSearch.toLowerCase()) || (g.household && g.household.toLowerCase().includes(unassignedSearch.toLowerCase()));
      const matchesCat = guestCategoryFilter === 'all' || (g.category && g.category === guestCategoryFilter);
      return isUnseated && matchesSearch && matchesCat;
    });
  }, [weddingGuests, unassignedSearch, guestCategoryFilter]);

  // Households grouping for unassigned guests
  const unassignedHouseholds = useMemo(() => {
    const map = new Map<string, Guest[]>();
    unassignedGuests.forEach((g) => {
      const hKey = g.household || g.name;
      if (!map.has(hKey)) map.set(hKey, []);
      map.get(hKey)!.push(g);
    });
    return Array.from(map.entries()).map(([household, members]) => ({
      household,
      members,
    }));
  }, [unassignedGuests]);

  // Filtered tables for Level 1 Floor Plan
  const filteredTables = useMemo(() => {
    return tables.filter((tbl) => {
      const matchesSearch = tableSearch === '' || tbl.name.toLowerCase().includes(tableSearch.toLowerCase()) || (tbl.category && tbl.category.toLowerCase().includes(tableSearch.toLowerCase()));
      const matchesShape = filterShape === 'all' || tbl.shape === filterShape;
      const seatedCount = weddingGuests.filter((g) => g.tableId === tbl.id).length;
      let matchesOcc = true;
      if (filterOccupancy === 'full') matchesOcc = seatedCount >= tbl.capacity;
      if (filterOccupancy === 'vacancies') matchesOcc = seatedCount < tbl.capacity && seatedCount > 0;
      if (filterOccupancy === 'empty') matchesOcc = seatedCount === 0;
      const matchesCat = filterCategory === 'all' || tbl.category === filterCategory;
      return matchesSearch && matchesShape && matchesOcc && matchesCat;
    });
  }, [tables, tableSearch, filterShape, filterOccupancy, filterCategory, state.guests]);

  // Statistics
  const totalSeats = useMemo(() => tables.reduce((acc, t) => acc + (t.capacity || 8), 0), [tables]);
  const totalSeated = useMemo(() => weddingGuests.filter((g) => !!g.tableId).length, [weddingGuests]);
  const totalAvailable = Math.max(0, totalSeats - totalSeated);
  const totalUnassigned = useMemo(() => weddingGuests.filter((g) => !g.tableId && g.rsvpStatus !== 'declined').length, [weddingGuests]);

  // --- Handlers ---

  // Assign a guest to a specific table & seat (handles drops, swaps & vacant placement)
  const handleAssignGuest = (guestId: string, tableId: string, seatIndex?: number) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable) return;

    const guestObj = state.guests.find((g) => g.id === guestId);
    if (!guestObj) return;

    const isAlreadyAtThisTable = guestObj.tableId === tableId;
    const currentSeated = state.guests.filter((g) => g.tableId === tableId);

    // If guest is coming from unassigned / another table, verify capacity
    if (!isAlreadyAtThisTable && currentSeated.length >= targetTable.capacity) {
      showToast(`${targetTable.name} is already at full capacity (${targetTable.capacity}/${targetTable.capacity} occupied)`, 'error');
      return;
    }

    // Moving / Swapping within the active table
    if (isAlreadyAtThisTable && seatIndex !== undefined) {
      const occupantAtTarget = currentSeated.find((g) => g.seatIndex === seatIndex && g.id !== guestId);
      if (occupantAtTarget) {
        // Swap seats between the two seated guests
        const oldSeat = guestObj.seatIndex ?? 0;
        const updated = state.guests.map((g) => {
          if (g.id === guestId) return { ...g, seatIndex };
          if (g.id === occupantAtTarget.id) return { ...g, seatIndex: oldSeat };
          return g;
        });
        setState({ ...state, guests: updated });
        showToast(`Swapped seats: ${guestObj.name} (Seat ${seatIndex + 1}) & ${occupantAtTarget.name} (Seat ${oldSeat + 1})`, 'info');
        return;
      } else {
        const updated = state.guests.map((g) => (g.id === guestId ? { ...g, seatIndex } : g));
        setState({ ...state, guests: updated });
        showToast(`Moved ${guestObj.name} to Seat ${seatIndex + 1}`, 'success');
        return;
      }
    }

    // Seating from unassigned or another table
    let targetSeat = seatIndex !== undefined ? seatIndex : -1;
    const isTargetOccupied = targetSeat >= 0 && currentSeated.some((g) => g.seatIndex === targetSeat && g.id !== guestId);

    if (targetSeat < 0 || targetSeat >= targetTable.capacity || isTargetOccupied) {
      // Find first vacant seat index
      let firstVacant = -1;
      for (let i = 0; i < targetTable.capacity; i++) {
        if (!currentSeated.some((g) => g.seatIndex === i)) {
          firstVacant = i;
          break;
        }
      }
      if (firstVacant === -1) {
        showToast(`No vacant seats available at ${targetTable.name}`, 'error');
        return;
      }
      targetSeat = firstVacant;
    }

    const updated = state.guests.map((g) => (g.id === guestId ? { ...g, tableId, seatIndex: targetSeat } : g));
    setState({ ...state, guests: updated });
    const guestObjUpdated = state.guests.find((g) => g.id === guestId);
    showToast(`Seated ${guestObjUpdated?.name || 'Guest'} at ${targetTable.name} (Seat ${targetSeat + 1})`, 'success');
  };

  // Unseat a guest
  const handleUnseatGuest = (guestId: string) => {
    const updated = state.guests.map((g) => (g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g));
    setState({ ...state, guests: updated });
    showToast('Guest returned to unassigned pool', 'info');
  };

  // Clear an entire table
  const handleClearTable = (tableId: string) => {
    const tbl = tables.find((t) => t.id === tableId);
    if (!window.confirm(`Unseat all guests from ${tbl?.name || 'this table'}?`)) return;
    const updated = state.guests.map((g) => (g.tableId === tableId ? { ...g, tableId: null, seatIndex: null } : g));
    setState({ ...state, guests: updated });
    showToast(`All guests unseated from ${tbl?.name}`, 'info');
  };

  // Assign entire household to active table
  const handleAssignHousehold = (householdMembers: Guest[], tableId: string) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable) return;

    const currentSeated = state.guests.filter((g) => g.tableId === tableId);
    const availableSeats = targetTable.capacity - currentSeated.length;

    if (householdMembers.length > availableSeats) {
      showToast(`Cannot fit entire household (${householdMembers.length} guests) into ${targetTable.name} (${availableSeats} places available)`, 'error');
      return;
    }

    let nextSeat = 0;
    const seatedSeatIndices = new Set(currentSeated.map((g) => g.seatIndex));

    const updatedGuests = state.guests.map((g) => {
      if (householdMembers.some((m) => m.id === g.id)) {
        while (seatedSeatIndices.has(nextSeat) && nextSeat < targetTable.capacity) {
          nextSeat++;
        }
        seatedSeatIndices.add(nextSeat);
        const assignedSeat = nextSeat;
        nextSeat++;
        return { ...g, tableId, seatIndex: assignedSeat };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    showToast(`Seated entire household of ${householdMembers.length} at ${targetTable.name}!`, 'success');
  };

  // Drag & drop handlers
  const handleGuestDragStart = (e: React.DragEvent, guestId: string) => {
    e.dataTransfer.setData('text/plain', guestId);
    setDraggedGuestId(guestId);
  };

  const handleGuestDragEnd = () => {
    setDraggedGuestId(null);
    setDragOverTarget(null);
  };

  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDraggingDanceFloor) {
      const el = document.getElementById('room_canvas_container');
      if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
      return;
    }
    const guestId = e.dataTransfer.getData('text/plain') || draggedGuestId;
    if (guestId && guestId !== 'dancefloor') {
      handleAssignGuest(guestId, tableId);
    }
    setDragOverTarget(null);
  };

  const handleDropOnSeat = (e: React.DragEvent, tableId: string, seatIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDraggingDanceFloor) return;
    const guestId = e.dataTransfer.getData('text/plain') || draggedGuestId;
    if (guestId && guestId !== 'dancefloor') {
      handleAssignGuest(guestId, tableId, seatIndex);
    }
    setDragOverTarget(null);
  };

  // Dragging table or dance floor position on canvas
  const handleTableCanvasDrop = (e: React.DragEvent, containerRect: DOMRect) => {
    e.preventDefault();
    const dragType = e.dataTransfer.getData('text/plain');

    if (isDraggingDanceFloor || dragType === 'dancefloor') {
      const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
      const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);

      const clampedX = Math.max(12, Math.min(88, relX));
      const clampedY = Math.max(15, Math.min(85, relY));

      const newPos = { x: clampedX, y: clampedY };
      setDanceFloorPos(newPos);
      setIsDraggingDanceFloor(false);

      const updatedWeddings = (state.weddings || []).map((w) =>
        w.id === currentWeddingId ? { ...w, danceFloorPos: newPos } : w
      );
      setState({ ...state, weddings: updatedWeddings });
      showToast('Dance floor repositioned', 'info');
      return;
    }

    if (!draggingTableId) return;

    const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
    const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);

    const clampedX = Math.max(5, Math.min(90, relX));
    const clampedY = Math.max(10, Math.min(85, relY));

    const updatedTables = (state.tables || []).map((t) => (t.id === draggingTableId ? { ...t, x: clampedX, y: clampedY } : t));
    setState({ ...state, tables: updatedTables });
    setDraggingTableId(null);
    showToast('Table position saved', 'info');
  };

  const handleTouchMoveDanceFloor = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const el = document.getElementById('room_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(12, Math.min(88, Math.round(relX)));
    const clampedY = Math.max(15, Math.min(85, Math.round(relY)));
    const newPos = { x: clampedX, y: clampedY };
    setDanceFloorPos(newPos);

    const updatedWeddings = (state.weddings || []).map((w) =>
      w.id === currentWeddingId ? { ...w, danceFloorPos: newPos } : w
    );
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleTouchMoveTable = (e: React.TouchEvent, tblId: string) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const el = document.getElementById('room_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(5, Math.min(90, Math.round(relX)));
    const clampedY = Math.max(10, Math.min(85, Math.round(relY)));

    const updatedTables = (state.tables || []).map((t) =>
      t.id === tblId ? { ...t, x: clampedX, y: clampedY } : t
    );
    setState({ ...state, tables: updatedTables });
  };

  // Add new table
  const handleCreateNewTable = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTableName.trim() || `Table ${tables.length + 1}`;
    const newId = `tbl_${currentWeddingId}_${Date.now()}`;
    const newTable: Table = {
      id: newId,
      weddingId: currentWeddingId,
      name: trimmed,
      capacity: newTableCapacity,
      shape: newTableShape,
      isHead: false,
      category: newTableCategory,
      zone: newTableZone,
      x: 20 + (tables.length % 4) * 20,
      y: 35 + Math.floor(tables.length / 4) * 16,
    };

    if (addTableTargetArrangementId) {
      const targetArr = savedArrangements.find((a) => a.id === addTableTargetArrangementId);
      updateSavedArrangement(addTableTargetArrangementId, (currentArr) => ({
        ...currentArr,
        tables: [...currentArr.tables, newTable],
      }));
      setAddTableTargetArrangementId(null);
      setShowAddTableModal(false);
      setNewTableName('');
      showToast(`Added ${newTable.name} (${newTableCapacity} seats, ${newTableShape}) to ${targetArr?.name || 'arrangement'}`, 'success');
      return;
    }

    setState({ ...state, tables: [...(state.tables || []), newTable] });
    setShowAddTableModal(false);
    setNewTableName('');
    showToast(`Added ${newTable.name} (${newTableCapacity} seats, ${newTableShape}) to ${currentWedding.couple}'s wedding`, 'success');
  };

  // Remove table
  const handleRemoveTable = (tableId: string) => {
    const tbl = tables.find((t) => t.id === tableId);
    if (!window.confirm(`Delete ${tbl?.name}? Any seated guests will be moved to the unassigned list.`)) return;

    const updatedGuests = (state.guests || []).map((g) => (g.tableId === tableId ? { ...g, tableId: null, seatIndex: null } : g));
    const updatedTables = (state.tables || []).filter((t) => t.id !== tableId);

    setState({ ...state, tables: updatedTables, guests: updatedGuests });
    if (selectedTableId === tableId) setSelectedTableId(null);
    showToast(`Deleted ${tbl?.name}`, 'info');
  };

  // Update existing table capacity or name
  const handleUpdateTableDetails = (tableId: string, updates: Partial<Table>) => {
    const updatedTables = (state.tables || []).map((t) => (t.id === tableId ? { ...t, ...updates } : t));
    setState({ ...state, tables: updatedTables });
    showToast('Table details updated', 'success');
  };

  // 1-Click Grand 40-Table Ballroom Template Generator
  const handleLoad40TableTemplate = () => {
    if (!window.confirm('Load 40-Table Grand Ballroom Layout? This sets up a reception room with 40 tables including King banquet tables, round tables, and rectangular tables.')) return;

    const new40Tables: Table[] = [
      // Head Table & Stage
      { id: 'head', name: 'HEAD TABLE', capacity: 8, isHead: true, shape: 'king', x: 50, y: 12, category: 'Bridal Party', zone: 'Stage & VIP Wing' },
      // King Table A & B (large banquets accommodating 32 guests each)
      { id: 'king_a', name: 'King Table A', capacity: 32, isHead: false, shape: 'king', x: 25, y: 78, category: 'Family', zone: 'North Wing' },
      { id: 'king_b', name: 'King Table B', capacity: 32, isHead: false, shape: 'king', x: 75, y: 78, category: 'Family', zone: 'South Wing' },
    ];

    // Generate remaining 37 tables (Round & Rectangular, 8-12 capacity each)
    const tableCategories = ['Family', 'Friends', 'School Friends', 'Paris', 'Rose Garden', 'Colleagues', 'VIP'];
    for (let i = 1; i <= 37; i++) {
      const shape: TableShape = i % 4 === 0 ? 'rectangular' : 'round';
      const capacity = shape === 'rectangular' ? 12 : 10;
      const cat = tableCategories[(i - 1) % tableCategories.length];
      const col = (i - 1) % 6;
      const row = Math.floor((i - 1) / 6);
      const x = 12 + col * 15;
      const y = 22 + row * 9;

      new40Tables.push({
        id: `tbl_40_${i}`,
        name: `Table ${i}`,
        capacity,
        shape,
        isHead: false,
        category: cat,
        zone: col < 2 ? 'Left Terrace' : col > 3 ? 'Right Garden' : 'Center Ballroom',
        x,
        y,
      });
    }

    // Keep existing seated guests where possible, or assign intelligently
    const otherWeddingTables = (state.tables || []).filter((t) => (t.weddingId || 'w1') !== currentWeddingId);
    const wedding40Tables = new40Tables.map(t => ({ ...t, weddingId: currentWeddingId }));
    setState({ ...state, tables: [...otherWeddingTables, ...wedding40Tables] });
    showToast('✨ 40-Table Grand Reception Room Layout Loaded Successfully!', 'success');
  };

  // Cheers AI Seating Recommendations Engine
  const handleRunCheersAiSeating = (scenario: 'households' | 'vips' | 'fill' | 'dietary') => {
    setActiveAiScenario(scenario);
    let title = '';
    let desc = '';
    const proposedChanges: { guestId: string; tableId: string }[] = [];

    const availableTables = tables.map((t) => ({
      ...t,
      currentCount: weddingGuests.filter((g) => g.tableId === t.id).length,
    }));

    if (scenario === 'households') {
      title = 'Group Households & Families Together';
      desc = 'Scanned all unassigned guests and matched families into tables with sufficient capacity so households remain seated together.';

      // Group unassigned by household
      unassignedHouseholds.forEach(({ household, members }) => {
        const needed = members.length;
        const candidate = availableTables.find((t) => t.category === 'Family' && t.capacity - t.currentCount >= needed) ||
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

      const bridalGuests = state.guests.filter((g) => !g.tableId && (g.household.includes('Bell') || g.household.includes('Gordon') || g.name.includes('Sophie') || g.name.includes('James')));
      const headTbl = availableTables.find((t) => t.isHead) || availableTables[0];

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

      const dietaryGuests = weddingGuests.filter((g) => !g.tableId && g.dietary && g.dietary !== 'None' && g.dietary !== '');
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
    const updatedGuests = state.guests.map((g) => {
      if (changeMap.has(g.id)) {
        return { ...g, tableId: changeMap.get(g.id)!, seatIndex: 0 };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    setShowCheersAiModal(false);
    showToast(`✨ Cheers AI successfully applied ${aiProposal.changes.length} seating recommendations!`, 'success');
  };

  // -------------------------------------------------------------
  // CHEERS AI CHATBOT ENGINE
  // -------------------------------------------------------------
  const executeAiScenario = (scenario: 'households' | 'vips' | 'fill' | 'dietary') => {
    setActiveAiScenario(scenario);
    let title = '';
    let desc = '';
    const proposedChanges: { guestId: string; tableId: string }[] = [];

    if (scenario === 'vips') {
      title = 'Seat VIPs & Bridal Party at Head Table';
      desc = 'Placed the bridal party and immediate family at the Head Table with premier visibility for speeches and photography.';
      const headTbl = tables.find((t) => t.isHead) || tables.find((t) => t.name.toLowerCase().includes('head')) || tables[0];
      if (headTbl) {
        const vipNames = ['Sophie Bell', 'James Gordon', 'Hannah Martin', 'Oliver Vance', 'Charlotte Evans', 'Liam Fletcher', 'Grace Kelly', 'Alexander White'];
        const matchedVips = weddingGuests.filter((g) =>
          vipNames.some((vn) => g.name.toLowerCase().includes(vn.toLowerCase())) ||
          g.household.toLowerCase().includes('bell') ||
          g.household.toLowerCase().includes('gordon') ||
          g.category === 'Bridal Party'
        );
        const candidates = matchedVips.length > 0 ? matchedVips : weddingGuests.slice(0, headTbl.capacity);
        candidates.slice(0, headTbl.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: headTbl.id });
        });
      }
    } else if (scenario === 'dietary') {
      title = 'Group Dietary Requirements for Catering';
      desc = 'Clustered guests with special dietary preferences (Gluten-Free, Vegan, Vegetarian, Nut allergy) at Table 4 for synchronized kitchen service.';
      const dietaryTbl = tables.find((t) => t.name.toLowerCase().includes('table 4')) || tables.find((t) => t.name.toLowerCase().includes('table 2')) || tables[1] || tables[0];
      if (dietaryTbl) {
        const dietaryGuests = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary.trim() !== '');
        const candidates = dietaryGuests.length > 0 ? dietaryGuests : weddingGuests.slice(0, dietaryTbl.capacity);
        candidates.slice(0, dietaryTbl.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: dietaryTbl.id });
        });
      }
    } else if (scenario === 'households') {
      title = 'Group Households & Families Together';
      desc = 'Paired family members and immediate relatives together into dedicated family tables so households remain seated together.';
      const familyTbl1 = tables.find((t) => t.name.toLowerCase().includes('table 1')) || tables[0];
      const familyTbl2 = tables.find((t) => t.name.toLowerCase().includes('table 3')) || tables[1];
      const bellFamily = weddingGuests.filter((g) => g.household.toLowerCase().includes('bell'));
      const gordonFamily = weddingGuests.filter((g) => g.household.toLowerCase().includes('gordon') || g.household.toLowerCase().includes('kelly'));

      if (familyTbl1 && bellFamily.length > 0) {
        bellFamily.slice(0, familyTbl1.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: familyTbl1.id });
        });
      }
      if (familyTbl2 && gordonFamily.length > 0) {
        gordonFamily.slice(0, familyTbl2.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: familyTbl2.id });
        });
      }
      if (proposedChanges.length === 0) {
        weddingGuests.slice(0, 8).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: (familyTbl1 || tables[0]).id });
        });
      }
    } else {
      title = 'Balanced Room & Vacancy Optimization';
      desc = 'Distributed unassigned guests evenly across all tables to balance ballroom capacity and guest flow.';
      const unassigned = weddingGuests.filter((g) => !g.tableId);
      const candidates = unassigned.length > 0 ? unassigned : weddingGuests.slice(0, 8);
      candidates.forEach((g, idx) => {
        const targetTbl = tables[idx % tables.length];
        if (targetTbl) {
          proposedChanges.push({ guestId: g.id, tableId: targetTbl.id });
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
        { id: 'usr_' + Date.now(), sender: 'user', text: '🌱 Open Table Seeding & Inventory Wizard', timestamp: 'Just now' },
        { id: 'ch_' + Date.now(), sender: 'cheers', text: 'Opening the Table Seeding & Inventory Wizard for you to configure table numbers, shapes, and seating capacities.', timestamp: 'Just now' },
      ]);
      setShowSeedTablesModal(true);
      return;
    }

    if (action === 'audit') {
      const seatedCount = weddingGuests.filter((g) => g.tableId).length;
      const unassignedCount = weddingGuests.filter((g) => !g.tableId).length;
      const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
      const dietaryCount = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary !== '').length;

      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '📊 Audit room capacity & seating balance', timestamp: 'Just now' },
        {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: `Room Audit Summary for ${currentWedding.couple}:\n• Total Confirmed Guests: ${weddingGuests.length}\n• Currently Seated: ${seatedCount} / ${totalCapacity} seats (${Math.round((seatedCount / (totalCapacity || 1)) * 100)}% capacity)\n• Unallocated Guests: ${unassignedCount}\n• Active Tables: ${tables.length}\n• Special Dietary Requirements: ${dietaryCount} guests`,
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

    const proposal = executeAiScenario(action);
    const actionLabel = action === 'households' ? 'Group households & families' : action === 'vips' ? 'Seat VIPs at Head Table' : action === 'dietary' ? 'Cluster dietary requirements' : 'Auto-fill vacant seats';

    let introText = '';
    if (action === 'vips') {
      introText = `👑 VIP & Head Table Recommendation:\nI've analyzed the floor plan and prepared ${proposal.count} seating allocations for the bridal party and immediate family at the Head Table. This guarantees prime visibility for toasts and speeches.\n\nReview the proposed allocations below and click 'Apply This Seating Plan to Canvas' to update your layout.`;
    } else if (action === 'dietary') {
      introText = `🥗 Catering & Dietary Cluster Recommendation:\nI've grouped ${proposal.count} guests with special dietary preferences (Gluten-Free, Vegetarian, Vegan, Nut allergy) at Table 4 for synchronized catering service.\n\nClick 'Apply This Seating Plan to Canvas' to apply these changes.`;
    } else if (action === 'households') {
      introText = `👨‍👩‍👧‍👦 Family & Household Placement:\nI've grouped family units together (${proposal.count} guests across family tables) so relatives remain seated together without splitting up parties.\n\nClick 'Apply This Seating Plan to Canvas' to update.`;
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
        text: `✨ Seating confirmed! I've automatically placed ${proposal.count} guests at their assigned tables on your floor plan canvas. The changes are synchronized live across the couple, MC, and wedding planner consoles.`,
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
        text: `Understood, proposal declined. What changes do you suggest or what would you like to adjust?\n\nYou can type your suggestions below (e.g. "Seat the Chen family closer to table 2", "Keep vegetarian guests together", "Make tables 8 seats instead of 10"), or click any quick action above to generate another option.`,
        timestamp: 'Just now',
      },
    ]);
    showToast('Proposal rejected. What changes do you suggest?', 'info');
  };

  // -------------------------------------------------------------
  // SEATING PLAN CONFIGURATION ENGINE (Passes seedTables to AI)
  // -------------------------------------------------------------
  const handleApplySeatingConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Map each table directly from the Vertical Table Summary
    const newTables: Table[] = seedTables.map((tbl, i) => {
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

      const x = isHead ? 50 : 20 + (i % 3) * 30;
      const y = isHead ? 15 : 35 + Math.floor(i / 3) * 22;

      return {
        id: `tbl_${currentWeddingId}_${tbl.id}`,
        weddingId: currentWeddingId,
        name: tbl.name,
        capacity: Number(tbl.seats) || 10,
        isHead,
        shape,
        x,
        y,
        zone: tbl.location === 'Custom Location' ? (tbl.customLocation || 'Custom Zone') : tbl.location,
        category: tbl.reserved === 'Custom' ? (tbl.customReserved || 'Custom') : tbl.reserved,
      };
    });

    // Preserve tables from other weddings
    const otherTables = (state.tables || []).filter((t) => (t.weddingId || 'w1') !== currentWeddingId);

    // Auto-Seat algorithm based on the 4 essential field sections
    const unassigned = weddingGuests.filter((g) => g.rsvpStatus !== 'declined');
    const proposedChanges: { guestId: string; tableId: string }[] = [];
    const tableCaps = newTables.map((t) => ({ ...t, currentCount: 0 }));

    // Rule 1: Special Seating Rule - Head Table for the Couple & Bridal Party
    const headTbl = tableCaps.find((t) => t.isHead);
    if (headTbl) {
      const bridal = unassigned.filter(
        (g) =>
          g.household.toLowerCase().includes('bell') ||
          g.household.toLowerCase().includes('gordon') ||
          g.category === 'Bridal Party' ||
          g.name.includes('Sophie') ||
          g.name.includes('James')
      );
      bridal.slice(0, headTbl.capacity).forEach((g) => {
        proposedChanges.push({ guestId: g.id, tableId: headTbl.id });
        headTbl.currentCount++;
      });
    }

    // Rule 2: Special Seating Rule - Reserved tables for VIPs or immediate family
    if (configReserveVipTables) {
      const vipTables = tableCaps.filter((t) => t.category === 'Immediate Family & VIPs');
      const vips = unassigned.filter(
        (g) =>
          !proposedChanges.some((p) => p.guestId === g.id) &&
          (g.category?.includes('Family') || g.household.includes('Johnson') || g.household.includes('Sharma'))
      );
      let vipIdx = 0;
      vips.forEach((g) => {
        const targetTable = vipTables[vipIdx % vipTables.length];
        if (targetTable && targetTable.currentCount < targetTable.capacity) {
          proposedChanges.push({ guestId: g.id, tableId: targetTable.id });
          targetTable.currentCount++;
          vipIdx++;
        }
      });
    }

    // Rule 3: Dietary Requirements per table
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

    // Rule 4: Seating Preferences & Guest Groups (Couples & children with family)
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

    // Update state tables
    setState({
      ...state,
      tables: [...otherTables, ...newTables],
    });

    setShowSeedTablesModal(false);
    setIsCheersChatOpen(true);

    const proposal = {
      title: `Seed Table Auto-Seat Proposal (${proposedChanges.length} Guests)`,
      desc: `Configured ${newTables.length} tables (${newTables.reduce((a, b) => a + b.capacity, 0)} total seats) with ${configTableType} layout, honoring all 4 Essential Field rules: Venue & Table Setup, Guest Groups, Seating Preferences, and Special VIP Rules.`,
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
        text: `✨ I have configured your floor plan with ${newTables.length} tables based on your official guest list (${confirmedGuestsCount} guests across ${uniqueHouseholds.length} households)!

Here is the proposed auto-seating allocation for ${proposedChanges.length} guests respecting your 4 essential seed rules. Review the assignments below and click 'Confirm & Auto-Seat' to apply them to your canvas, or 'Reject' to suggest changes.`,
        proposal,
        status: 'pending',
        timestamp: 'Just now',
      },
    ]);

    showToast(`✓ Seeded ${newTables.length} tables! Review seating proposal in Cheers AI.`, 'success');
  };

  // Export CSV
  const handleDownloadCsv = () => {
    const rows = [['Table Name', 'Shape', 'Capacity', 'Guest Name', 'Household', 'Seat #', 'Dietary', 'RSVP Status']];

    tables.forEach((t) => {
      const seated = state.guests.filter((g) => g.tableId === t.id);
      if (seated.length === 0) {
        rows.push([t.name, t.shape || 'round', String(t.capacity), '(Empty Table)', '', '', '', '']);
      } else {
        seated.forEach((g) => {
          rows.push([
            t.name,
            t.shape || 'round',
            String(t.capacity),
            g.name,
            g.household || '',
            String((g.seatIndex || 0) + 1),
            g.dietary || 'None',
            g.rsvpStatus,
          ]);
        });
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TapToast_Seating_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Seating Manifest CSV', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* TOP STATS & CONTROLS TOOLBAR                                    */}
      {/* ============================================================== */}
      <div className="bg-[#15110e] text-white p-4 md:p-5 rounded-2xl border border-[#3d2e23] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[2px] uppercase text-[#dfc194] font-bold">
              TAP &amp; TOAST &bull; SEATING STUDIO &bull; {currentWedding?.couple?.toUpperCase() || 'WEDDING'}
            </span>
            <span className="bg-[#2a1e14] border border-[#bd9661]/60 text-[#dfc194] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {tables.length} Tables Available
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white mt-1">
            Visual Reception Seating Planner
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#c7b7a6] mt-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <strong>{totalSeated}</strong> Seated Guests
            </span>
            <span>&bull;</span>
            <span><strong>{totalAvailable}</strong> Vacancies</span>
            <span>&bull;</span>
            <span className="text-[#dfc194]"><strong>{totalUnassigned}</strong> Unallocated Guests</span>
            <span>&bull;</span>
            <span><strong>{totalSeats}</strong> Room Capacity</span>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seed Tables Wizard */}
          <button
            type="button"
            onClick={() => setShowSeedTablesModal(true)}
            className="h-[34px] bg-white hover:bg-[#faf7f2] text-[#15110e] border border-[#d5c7b5] font-bold px-3 rounded-xl text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5 leading-none"
            title="Configure floor tables, shapes & AI seating rules based on guest list"
          >
            <span className="text-xs leading-none">🌱</span>
            <span>Seed Table</span>
          </button>

          {/* Add Table */}
          <button
            type="button"
            onClick={() => setShowAddTableModal(true)}
            className="h-[34px] bg-white hover:bg-[#faf7f2] text-[#15110e] border border-[#d5c7b5] font-bold px-3 rounded-xl text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1 leading-none"
          >
            <span className="text-sm font-bold leading-none text-[#bd9661]">+</span>
            <span>Add Table</span>
          </button>

          {/* Export & Print */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="h-[34px] bg-[#251b14] hover:bg-[#382b20] text-white border border-[#4a3a2d] font-bold px-3 rounded-xl text-xs cursor-pointer transition-colors inline-flex items-center gap-1.5 leading-none"
          >
            <span className="text-xs leading-none">🖨️</span>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LEVEL 2: INDIVIDUAL TABLE VIEW (FOCUSED DETAIL)                 */}
      {/* ============================================================== */}
      {selectedTableId && activeTable ? (
        <div className="bg-white border-2 border-[#bd9661] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          {/* Level 2 Top Banner: Return button & Table Properties */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ebd3a8]">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (isComparing) {
                    updateSavedArrangement(activeArrangementId, (currentArr) => {
                      const curTables = (state.tables || []).filter((t) => t.weddingId === currentWeddingId);
                      const curGuests = (state.guests || []).filter((g) => g.weddingId === currentWeddingId);
                      return {
                        ...currentArr,
                        tables: curTables.map((t) => ({ ...t })),
                        guestAssignments: curGuests.map((g) => ({
                          guestId: g.id,
                          tableId: g.tableId || null,
                          seatIndex: g.seatIndex ?? null,
                        })),
                      };
                    });
                  }
                  setSelectedTableId(null);
                }}
                className="bg-[#15110e] hover:bg-[#2b1f16] text-[#dfc194] font-bold px-4 py-2.5 rounded-2xl text-xs cursor-pointer transition-all flex items-center gap-2 shadow-md"
              >
                <span>&larr;</span> {isComparing ? 'Return to Comparison Mode' : 'Return to Overall Room Layout'}
              </button>

              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661]">
                  LEVEL 2 &bull; INDIVIDUAL TABLE DETAIL
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="font-serif text-2xl font-bold text-[#15110e]">
                    {(activeTable.name || '').replace(/\s*\([^)]*\)/g, '').trim()}
                  </h3>
                </div>
              </div>
            </div>

            {/* Quick Table Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="bg-[#faf8f5] border border-[#e8ded0] px-3 py-1.5 rounded-xl font-bold text-[#15110e]">
                Occupancy: <span className="text-[#bd9661] font-mono text-sm">{guestsAtActiveTable.length}</span> / {activeTable.capacity}
                <span className="ml-1.5 text-[11px] font-normal text-[#8b7b6b]">
                  ({activeTable.capacity - guestsAtActiveTable.length} places available)
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleClearTable(activeTable.id)}
                className="bg-[#fff1f0] hover:bg-[#ffe4e2] text-[#c93b2b] border border-[#f5c6cb] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
              >
                Clear All Guests
              </button>

              <button
                type="button"
                onClick={() => handleRemoveTable(activeTable.id)}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] text-[#8b7b6b] border border-[#d5c7b5] px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
              >
                Delete Table
              </button>
            </div>
          </div>

          {/* Table Configuration & Quick Rename Bar */}
          <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs">
            {/* Table Name & Suggestions */}
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                Table Name / Label
              </label>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={activeTable.name}
                  onChange={(e) => handleUpdateTableDetails(activeTable.id, { name: e.target.value })}
                  className="bg-white border border-[#e8ded0] rounded-xl px-3 py-1.5 font-serif font-bold text-sm text-[#15110e] outline-none focus:border-[#bd9661] w-full max-w-xs shadow-2xs"
                  placeholder="e.g. Table 1, Table 2, Head Table"
                />
              </div>

            </div>

            {/* Shape Segmented Control */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                Table Shape
              </label>
              <div className="flex bg-white border border-[#e8ded0] rounded-xl p-1 shadow-2xs">
                {(['round', 'rectangular'] as TableShape[]).map((shp) => (
                  <button
                    key={shp}
                    type="button"
                    onClick={() => handleUpdateTableDetails(activeTable.id, { shape: shp })}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize cursor-pointer transition-colors ${
                      (activeTable.shape === shp || (shp === 'rectangular' && activeTable.shape === 'king'))
                        ? 'bg-[#15110e] text-[#dfc194]'
                        : 'text-[#8b7b6b] hover:text-[#15110e]'
                    }`}
                  >
                    {shp}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Stepper */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                Capacity (Seats)
              </label>
              <div className="flex items-center gap-1 bg-white border border-[#e8ded0] rounded-xl p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    const nextCap = Math.max(guestsAtActiveTable.length, activeTable.capacity - 1);
                    if (nextCap < activeTable.capacity) {
                      handleUpdateTableDetails(activeTable.id, { capacity: nextCap });
                    }
                  }}
                  disabled={activeTable.capacity <= guestsAtActiveTable.length}
                  className="w-7 h-7 rounded-lg bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center text-sm"
                  title="Decrease capacity"
                >
                  &minus;
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-[#15110e]">
                  {activeTable.capacity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextCap = Math.min(48, activeTable.capacity + 1);
                    handleUpdateTableDetails(activeTable.id, { capacity: nextCap });
                  }}
                  className="w-7 h-7 rounded-lg bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] font-bold cursor-pointer flex items-center justify-center text-sm"
                  title="Increase capacity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Individual Table Seating Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Table Surface & Seat Ring (7 cols) */}
            <div className="lg:col-span-7 bg-[#faf8f5] border border-[#e8ded0] rounded-2xl p-6 min-h-[480px] flex flex-col items-center justify-center relative shadow-inner">


              {/* ROUND TABLE VISUALIZATION */}
              {activeTable.shape === 'round' && (
                <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                  {/* Outer circle perimeter line */}
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#bd9661]/40 pointer-events-none" />

                  {/* Center table surface (Accepts Drop to auto-assign to first vacant seat) */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverTarget({ type: 'table', tableId: activeTable.id });
                    }}
                    onDragLeave={() => setDragOverTarget(null)}
                    onDrop={(e) => handleDropOnTable(e, activeTable.id)}
                    className={`w-[150px] h-[150px] rounded-full bg-white border-2 shadow-lg flex flex-col items-center justify-center text-center z-10 p-3 select-none transition-all cursor-pointer ${
                      dragOverTarget?.type === 'table' && dragOverTarget?.tableId === activeTable.id
                        ? 'border-[#bd9661] ring-4 ring-[#bd9661]/40 bg-[#faf5ee] scale-105 shadow-xl'
                        : 'border-[#bd9661]'
                    }`}
                    title="Drop any guest here to seat at next vacant place"
                  >
                    <span className="font-serif text-base font-bold text-[#15110e]">{(activeTable.name || '').replace(/\s*\([^)]*\)/g, '').trim()}</span>
                    <span className="text-sm font-bold font-mono text-[#bd9661] mt-0.5">
                      {guestsAtActiveTable.length} / {activeTable.capacity}
                    </span>
                    {dragOverTarget?.type === 'table' && dragOverTarget?.tableId === activeTable.id && (
                      <span className="text-[9px] font-bold text-[#bd9661] mt-1 animate-pulse">
                        Drop to Seat
                      </span>
                    )}
                  </div>

                  {/* Radial seats */}
                  {Array.from({ length: activeTable.capacity }).map((_, sIdx) => {
                    const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                    const angle = sIdx * (360 / activeTable.capacity);
                    const radius = 130;
                    const rad = ((angle - 90) * Math.PI) / 180;
                    const x = radius * Math.cos(rad);
                    const y = radius * Math.sin(rad);
                    const isOver = dragOverTarget?.type === 'seat' && dragOverTarget?.seatIndex === sIdx;

                    return (
                      <div
                        key={sIdx}
                        draggable={!!occupant}
                        onDragStart={(e) => {
                          if (occupant) handleGuestDragStart(e, occupant.id);
                        }}
                        onDragEnd={handleGuestDragEnd}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                        }}
                        onDragLeave={() => setDragOverTarget(null)}
                        onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                        className={`absolute w-12 h-12 rounded-full flex flex-col items-center justify-center text-center z-20 transition-all select-none shadow-md cursor-pointer ${
                          isOver
                            ? 'bg-[#bd9661] text-white border-2 border-white scale-125 ring-4 ring-[#bd9661]/50 z-30 shadow-xl'
                            : occupant
                            ? 'bg-[#15110e] border-2 border-[#bd9661] text-[#dfc194] cursor-grab active:cursor-grabbing hover:scale-110'
                            : draggedGuestId
                            ? 'bg-amber-50 border-2 border-dashed border-[#bd9661] text-[#bd9661] animate-pulse hover:bg-[#faf5ee]'
                            : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf5ee]'
                        }`}
                        title={
                          occupant
                            ? `${occupant.name} (${occupant.dietary || 'Standard'}) - Drag to move or swap seat`
                            : `Seat #${sIdx + 1} (Empty) - Drop guest here`
                        }
                      >
                        {occupant ? (
                          <>
                            <span className="text-[11px] font-bold leading-none">{occupant.initials || occupant.name.slice(0, 2).toUpperCase()}</span>
                            <span className="text-[8px] font-mono opacity-80 mt-0.5">#{sIdx + 1}</span>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold">#{sIdx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* RECTANGULAR TABLE VISUALIZATION (Rectangular, King & Head Table) */}
              {(activeTable.shape === 'rectangular' || activeTable.shape === 'king') && (
                <div className="relative w-full max-w-[500px] p-6 flex flex-col items-center">
                  {/* Top Seat row - cleanly outside and above table */}
                  <div className="flex justify-between items-center w-[360px] max-w-full mb-3 z-20">
                    {Array.from({ length: Math.ceil(activeTable.capacity / 2) }).map((_, sIdx) => {
                      const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                      const isOver = dragOverTarget?.type === 'seat' && dragOverTarget?.seatIndex === sIdx;
                      return (
                        <div
                          key={sIdx}
                          draggable={!!occupant}
                          onDragStart={(e) => {
                            if (occupant) handleGuestDragStart(e, occupant.id);
                          }}
                          onDragEnd={handleGuestDragEnd}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                          }}
                          onDragLeave={() => setDragOverTarget(null)}
                          onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                          className={`w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-md text-xs font-bold transition-all select-none cursor-pointer ${
                            isOver
                              ? 'bg-[#bd9661] text-white border-2 border-white scale-125 ring-4 ring-[#bd9661]/50 z-30 shadow-xl'
                              : occupant
                              ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661] cursor-grab active:cursor-grabbing hover:scale-110'
                              : draggedGuestId
                              ? 'bg-amber-50 border-2 border-dashed border-[#bd9661] text-[#bd9661] animate-pulse hover:bg-[#faf5ee]'
                              : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf5ee]'
                          }`}
                          title={occupant ? `${occupant.name} (${occupant.dietary || 'Standard'}) - Drag to move or swap` : `Seat #${sIdx + 1} (Empty) - Drop guest here`}
                        >
                          {occupant ? occupant.initials || occupant.name.slice(0, 2) : `#${sIdx + 1}`}
                        </div>
                      );
                    })}
                  </div>

                  {/* Center Table Surface */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverTarget({ type: 'table', tableId: activeTable.id });
                    }}
                    onDragLeave={() => setDragOverTarget(null)}
                    onDrop={(e) => handleDropOnTable(e, activeTable.id)}
                    className={`w-[360px] max-w-full h-[100px] rounded-2xl bg-white border-2 shadow-lg flex flex-col items-center justify-center text-center z-10 select-none transition-all cursor-pointer ${
                      dragOverTarget?.type === 'table' && dragOverTarget?.tableId === activeTable.id
                        ? 'border-[#bd9661] ring-4 ring-[#bd9661]/40 bg-[#faf5ee] scale-105'
                        : 'border-[#bd9661]'
                    }`}
                    title="Drop any guest here to seat at next vacant place"
                  >
                    <span className="font-serif text-lg font-bold text-[#15110e]">{(activeTable.name || '').replace(/\s*\([^)]*\)/g, '').trim()}</span>
                    <span className="text-sm font-bold font-mono text-[#bd9661] mt-1">
                      {guestsAtActiveTable.length} / {activeTable.capacity}
                    </span>
                    {dragOverTarget?.type === 'table' && dragOverTarget?.tableId === activeTable.id && (
                      <span className="text-[9px] font-bold text-[#bd9661] mt-1 animate-pulse">
                        Drop to Seat
                      </span>
                    )}
                  </div>

                  {/* Bottom Seat row - cleanly outside and below table */}
                  <div className="flex justify-between items-center w-[360px] max-w-full mt-3 z-20">
                    {Array.from({ length: Math.floor(activeTable.capacity / 2) }).map((_, idx) => {
                      const sIdx = Math.ceil(activeTable.capacity / 2) + idx;
                      const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                      const isOver = dragOverTarget?.type === 'seat' && dragOverTarget?.seatIndex === sIdx;
                      return (
                        <div
                          key={sIdx}
                          draggable={!!occupant}
                          onDragStart={(e) => {
                            if (occupant) handleGuestDragStart(e, occupant.id);
                          }}
                          onDragEnd={handleGuestDragEnd}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                          }}
                          onDragLeave={() => setDragOverTarget(null)}
                          onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                          className={`w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-md text-xs font-bold transition-all select-none cursor-pointer ${
                            isOver
                              ? 'bg-[#bd9661] text-white border-2 border-white scale-125 ring-4 ring-[#bd9661]/50 z-30 shadow-xl'
                              : occupant
                              ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661] cursor-grab active:cursor-grabbing hover:scale-110'
                              : draggedGuestId
                              ? 'bg-amber-50 border-2 border-dashed border-[#bd9661] text-[#bd9661] animate-pulse hover:bg-[#faf5ee]'
                              : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf5ee]'
                          }`}
                          title={occupant ? `${occupant.name} (${occupant.dietary || 'Standard'}) - Drag to move or swap` : `Seat #${sIdx + 1} (Empty) - Drop guest here`}
                        >
                          {occupant ? occupant.initials || occupant.name.slice(0, 2) : `#${sIdx + 1}`}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              
            </div>

            {/* Table Roster & Seat Assignment List (5 cols) with 2 Tabs */}
            <div className="lg:col-span-5 bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-4">
              {/* Segmented 2-Tab Navigation */}
              <div className="flex p-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl">
                <button
                  type="button"
                  onClick={() => setDrilldownRosterTab('assigned')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    drilldownRosterTab === 'assigned'
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                      : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }`}
                >
                  <span>Assigned Guests</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      drilldownRosterTab === 'assigned'
                        ? 'bg-[#2a1e14] text-[#dfc194] border border-[#bd9661]/40'
                        : 'bg-[#e8ded0] text-[#15110e]'
                    }`}
                  >
                    {guestsAtActiveTable.length} / {activeTable.capacity}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDrilldownRosterTab('unassigned')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    drilldownRosterTab === 'unassigned'
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                      : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }`}
                >
                  <span>Remaining Guest List</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      drilldownRosterTab === 'unassigned'
                        ? 'bg-[#2a1e14] text-[#dfc194] border border-[#bd9661]/40'
                        : 'bg-[#e8ded0] text-[#15110e]'
                    }`}
                  >
                    {allWeddingUnassignedGuests.length}
                  </span>
                </button>
              </div>

              {/* TAB 1: ASSIGNED GUESTS */}
              {drilldownRosterTab === 'assigned' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* Seated Guests List */}
                  <div className="space-y-2 max-h-[430px] overflow-y-auto pr-1">
                    {guestsAtActiveTable.length === 0 ? (
                      <div className="bg-[#faf8f5] border border-dashed border-[#e8ded0] rounded-xl p-8 text-center text-xs text-[#8b7b6b] space-y-2">
                        <div className="text-2xl">🍽️</div>
                        <p className="font-bold text-[#15110e]">No guests currently seated at {activeTable.name}</p>
                        <p className="text-[11px]">
                          Switch to the{' '}
                          <button
                            type="button"
                            onClick={() => setDrilldownRosterTab('unassigned')}
                            className="text-[#bd9661] underline font-bold cursor-pointer"
                          >
                            Remaining Guest List
                          </button>{' '}
                          tab to drag guests onto seats.
                        </p>
                      </div>
                    ) : (
                      guestsAtActiveTable
                        .sort((a, b) => (a.seatIndex ?? 0) - (b.seatIndex ?? 0))
                        .map((g) => (
                          <div
                            key={g.id}
                            draggable
                            onDragStart={(e) => handleGuestDragStart(e, g.id)}
                            onDragEnd={handleGuestDragEnd}
                            className="bg-[#faf8f5] hover:bg-[#f5f0e6] border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between text-xs transition-colors cursor-grab active:cursor-grabbing shadow-2xs group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-1">
                              <span className="text-[#8b7b6b] opacity-40 group-hover:opacity-100 text-xs shrink-0 select-none">
                                ⋮⋮
                              </span>
                              <span className="w-6 h-6 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-[10px] flex items-center justify-center shrink-0">
                                {g.initials || g.name.slice(0, 2).toUpperCase()}
                              </span>
                              <div className="min-w-0">
                                <div className="font-bold text-[#15110e] flex items-center gap-1.5 truncate">
                                  <span className="truncate">{g.name}</span>
                                  <span className="text-[10px] font-mono text-[#bd9661] bg-white border border-[#ebdcc9] px-1.5 py-0.2 rounded shrink-0">
                                    Seat {(g.seatIndex || 0) + 1}
                                  </span>
                                </div>
                                <div className="text-[10px] text-[#8b7b6b] flex items-center gap-1.5 mt-0.5 truncate">
                                  <span className="truncate">{g.household}</span>
                                  {g.dietary && g.dietary !== 'None' && (
                                    <span className="bg-[#fff1f0] text-[#c93b2b] px-1 rounded font-semibold text-[9px] shrink-0">
                                      {g.dietary}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleUnseatGuest(g.id)}
                              className="text-[#8b7b6b] hover:text-[#c93b2b] text-base p-1 cursor-pointer shrink-0 ml-2"
                              title="Unseat guest"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Quick Assign Household Dropdown */}
                  {unassignedHouseholds.length > 0 && (
                    <div className="pt-3 border-t border-[#f0ede4] space-y-2">
                      <div className="text-[11px] font-bold text-[#8b7b6b] uppercase tracking-wider">
                        Quick Seat Entire Household
                      </div>
                      <div className="flex gap-2">
                        <select
                          id="household_quick_assign"
                          className="flex-1 bg-white border border-[#e8ded0] rounded-xl p-2 text-xs text-[#15110e] outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>Select unassigned household...</option>
                          {unassignedHouseholds.map(({ household, members }) => (
                            <option key={household} value={household}>
                              {household} ({members.length} guests)
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const sel = (document.getElementById('household_quick_assign') as HTMLSelectElement)?.value;
                            const hh = unassignedHouseholds.find((h) => h.household === sel);
                            if (hh) handleAssignHousehold(hh.members, activeTable.id);
                          }}
                          className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shadow-2xs"
                        >
                          Seat All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REMAINING GUEST LIST (DRAGGABLE TO SEATS) */}
              {drilldownRosterTab === 'unassigned' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* Search Bar for Remaining Guests */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search remaining guests by name or household..."
                      value={drilldownGuestSearch}
                      onChange={(e) => setDrilldownGuestSearch(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl pl-8 pr-7 py-2 text-xs outline-none focus:border-[#bd9661] shadow-2xs"
                    />
                    <svg className="w-3.5 h-3.5 text-[#8b7b6b] absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {drilldownGuestSearch && (
                      <button
                        type="button"
                        onClick={() => setDrilldownGuestSearch('')}
                        className="absolute right-2.5 top-2 text-[#8b7b6b] hover:text-[#15110e] text-xs cursor-pointer font-bold"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Draggable Remaining Guests List */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {filteredDrilldownRemainingGuests.length === 0 ? (
                      <div className="bg-[#f0f7f1] border border-emerald-200 rounded-xl p-8 text-center text-xs text-[#2b5930] space-y-1.5">
                        <div className="text-2xl">🎉</div>
                        <p className="font-bold">
                          {drilldownGuestSearch ? 'No matching unassigned guests found' : 'All wedding guests are seated!'}
                        </p>
                        <p className="text-[11px] text-[#4d7351]">
                          {drilldownGuestSearch
                            ? 'Try a different search term or clear the filter.'
                            : 'Every guest for this wedding has been placed at a table.'}
                        </p>
                      </div>
                    ) : (
                      filteredDrilldownRemainingGuests.map((g) => (
                        <div
                          key={g.id}
                          draggable
                          onDragStart={(e) => handleGuestDragStart(e, g.id)}
                          onDragEnd={handleGuestDragEnd}
                          className="bg-[#faf8f5] hover:bg-[#f5efe6] border border-[#e8ded0] hover:border-[#bd9661] rounded-xl p-2.5 flex items-center justify-between text-xs cursor-grab active:cursor-grabbing shadow-2xs transition-all group"
                          title={`Drag ${g.name} to any seat on ${activeTable.name}, or click "+ Seat"`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="text-[#8b7b6b] opacity-40 group-hover:opacity-100 text-xs shrink-0 select-none">
                              ⋮⋮
                            </span>
                            <span className="w-7 h-7 rounded-full bg-[#bd9661]/15 text-[#8a6836] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#bd9661]/30">
                              {g.initials || g.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-[#15110e] truncate">{g.name}</div>
                              <div className="text-[10px] text-[#8b7b6b] flex items-center gap-1.5 truncate mt-0.5">
                                <span className="truncate">{g.household}</span>
                                {g.dietary && g.dietary !== 'None' && (
                                  <span className="bg-[#fff1f0] text-[#c93b2b] px-1 rounded text-[9px] font-semibold shrink-0">
                                    {g.dietary}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={guestsAtActiveTable.length >= activeTable.capacity}
                            onClick={() => handleAssignGuest(g.id, activeTable.id)}
                            className={
                              guestsAtActiveTable.length >= activeTable.capacity
                                ? "bg-[#ede5d8] text-[#8b7b6b] border border-[#d5c7b5] font-bold text-[11px] px-2.5 py-1 rounded-lg cursor-not-allowed opacity-50 shrink-0 shadow-2xs flex items-center gap-1"
                                : "bg-white hover:bg-[#bd9661] text-[#15110e] hover:text-white border border-[#d5c7b5] hover:border-[#bd9661] font-bold text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs flex items-center gap-1"
                            }
                            title={
                              guestsAtActiveTable.length >= activeTable.capacity
                                ? `${activeTable.name} has reached maximum capacity (${activeTable.capacity}/${activeTable.capacity})`
                                : `Seat ${g.name} at next vacant position at ${activeTable.name}`
                            }
                          >
                            <span>+</span> Seat
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* LEVEL 1: OVERALL FLOOR PLAN & ROOM LAYOUT                      */
        /* ============================================================== */
        <div className="space-y-4">
          {/* ============================================================== */}
          {/* SAVED SEATING ARRANGEMENT MANAGEMENT BAR (Couple & MC Sync)    */}
          {/* ============================================================== */}
          {!isComparing && (
            <>
          <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#15110e] text-[#dfc194] border border-[#bd9661] flex items-center justify-center font-bold text-sm shrink-0">
                📐
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] flex items-center gap-2">
                  <span>ACTIVE SEATING ARRANGEMENT:</span>
                </div>
                <div className="font-serif text-sm font-bold text-[#15110e] flex items-center gap-2 mt-0.5">
                  <span>{activeArrangementName}</span>
                </div>
              </div>

              {/* Arrangement Switcher Dropdown */}
              <div className="flex items-center gap-1.5 ml-0 md:ml-3">
                <select
                  value={activeArrangementId}
                  onChange={(e) => handleLoadArrangement(e.target.value)}
                  className="bg-[#faf8f5] hover:bg-[#f5ede2] border border-[#d5c7b5] hover:border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] font-semibold outline-none cursor-pointer shadow-2xs transition-colors"
                >
                  {savedArrangements.map((arr) => (
                    <option key={arr.id} value={arr.id}>
                      {arr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowCompareArrangementsModal(true)}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] border border-[#d5c7b5] font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shadow-2xs transition-all flex items-center gap-1.5"
                title="Compare all saved seating arrangements"
              >
                <span>⚖️</span>
                <span>Compare Layouts</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewArrangementName(`Seating Arrangement ${savedArrangements.length + 1}`);
                  setNewArrangementNotes('');
                  setShowSaveArrangementModal(true);
                }}
                className="bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white border border-[#bd9661] font-bold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                title="Save current seating arrangement"
              >
                <span>💾</span>
                <span>Save Arrangement</span>
              </button>
            </div>
          </div>

          {/* Floor Plan Controls Filter Bar */}
          <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <input
                type="text"
                placeholder="Search tables or zones..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] w-48"
              />

              {/* Shape Filter */}
              <select
                value={filterShape}
                onChange={(e) => setFilterShape(e.target.value)}
                className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
              >
                <option value="all">All Shapes (Round, King, Rect)</option>
                <option value="round">Round Banquet Tables</option>
                <option value="rectangular">Rectangular Tables</option>
                <option value="king">Long King Banquet Tables (30-40)</option>
              </select>

              {/* Occupancy Filter */}
              <select
                value={filterOccupancy}
                onChange={(e) => setFilterOccupancy(e.target.value)}
                className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
              >
                <option value="all">All Capacities</option>
                <option value="vacancies">Has Available Places</option>
                <option value="full">Completely Full</option>
                <option value="empty">Empty Tables</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Bridal Party">Bridal Party</option>
                <option value="VIP">VIP</option>
              </select>
            </div>


          </div>
            </>
          )}

          {/* ============================================================== */}
          {/* SIDE-BY-SIDE SEATING ARRANGEMENT COMPARISON MODE (Web View)   */}
          {/* ============================================================== */}
          {!isMobileCompact && isComparing ? (
            <div className="space-y-4">
              {/* Top Comparison Action Bar */}
              <div className="bg-[#15110e] text-white border border-[#bd9661]/50 rounded-2xl p-4 px-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dfc194] to-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-lg shadow-sm">
                    ⚖️
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[2px] text-[#bd9661]">
                      Side-by-Side Comparison Mode
                    </div>
                    <h3 className="font-serif text-base md:text-lg font-bold text-white">
                      Comparing {comparedArrangements.length} Seating Arrangements
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsFloatingGuestListOpen((prev) => !prev)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isFloatingGuestListOpen
                        ? 'bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] ring-2 ring-[#bd9661]/40'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    <span>📋</span>
                    <span>{isFloatingGuestListOpen ? 'Guest List Active' : 'Open Guest List'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsComparing(false);
                      setIsFloatingGuestListOpen(false);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#29211a] hover:bg-[#382b20] text-[#dfc194] border border-[#bd9661]/40 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>✕</span>
                    <span>Exit Comparison</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison Canvas Columns */}
              <div className={`grid grid-cols-1 ${
                comparedArrangements.length === 3 ? 'xl:grid-cols-3' : 'lg:grid-cols-2'
              } gap-4 items-start`}>
                {comparedArrangements.map((arr) => {
                  const arrSeated = arr.guestAssignments.filter((a) => a.tableId).length;
                  const totalCap = arr.tables.reduce((acc, t) => acc + t.capacity, 0);

                  return (
                    <div
                      key={arr.id}
                      className="bg-white border-2 border-[#ebdcc9] rounded-2xl shadow-sm overflow-hidden flex flex-col"
                    >
                      {/* Arrangement Column Header */}
                      <div className="p-3.5 px-4 bg-[#fdfbf7] border-b border-[#ebdcc9] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif font-bold text-sm text-[#15110e] truncate">
                              {arr.name}
                            </h4>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                              arr.role === 'mc'
                                ? 'bg-[#15110e] text-[#dfc194]'
                                : 'bg-[#faf0e1] text-[#7d5e38]'
                            }`}>
                              {arr.role === 'mc' ? 'MC' : 'Couple'}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-[#8b7b6b] mt-0.5">
                            {arr.tables.length} Tables &bull; <strong className="text-emerald-700">{arrSeated}</strong> / {totalCap} Guests Seated
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setAddTableTargetArrangementId(arr.id);
                            const nextNum = arr.tables.filter((t) => !t.isHead).length + 1;
                            setNewTableName(`Table ${nextNum}`);
                            setNewTableShape('round');
                            setNewTableCapacity(8);
                            setShowAddTableModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#d5c7b5] text-[#15110e] font-bold text-xs rounded-xl cursor-pointer transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
                          title={`Add table to ${arr.name}`}
                        >
                          <span className="text-[#bd9661] font-bold text-sm">+</span>
                          <span>Add Table</span>
                        </button>
                      </div>

                      {/* Canvas Area for this Arrangement */}
                      <div
                        id={`compare_canvas_${arr.id}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const el = document.getElementById(`compare_canvas_${arr.id}`);
                          if (el) {
                            const rect = el.getBoundingClientRect();
                            if (compareDraggingDanceFloor === arr.id || e.dataTransfer.getData('compareDanceFloor') === arr.id) {
                              handleCompareDanceFloorDragEnd(arr.id, e.clientX, e.clientY, rect);
                              setCompareDraggingDanceFloor(null);
                              return;
                            }
                            if (compareDraggingTable && compareDraggingTable.arrId === arr.id) {
                              handleCompareTableDragEnd(arr.id, compareDraggingTable.tableId, e.clientX, e.clientY, rect);
                              setCompareDraggingTable(null);
                              return;
                            }
                          }
                        }}
                        className="bg-[#faf8f5] p-3 min-h-[580px] relative shadow-inner overflow-hidden select-none"
                        style={{
                          backgroundImage: 'radial-gradient(#d5c7b5 1.1px, transparent 1.1px)',
                          backgroundSize: '20px 20px',
                        }}
                      >
                        {/* Architectural Anchor: Bridal Stage */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-[#15110e] text-[#dfc194] px-4 py-1 rounded-full border border-[#bd9661] text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-1.5 whitespace-nowrap z-10">
                          <span>👑</span> BRIDAL STAGE
                        </div>

                        {/* Draggable Dance Floor */}
                        <div
                          id={`compare_dance_floor_${arr.id}`}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('compareDanceFloor', arr.id);
                            setCompareDraggingDanceFloor(arr.id);
                          }}
                          onDragEnd={() => setCompareDraggingDanceFloor(null)}
                          style={{
                            left: `${arr.danceFloorPos?.x ?? 50}%`,
                            top: `${arr.danceFloorPos?.y ?? 50}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-32 h-24 rounded-2xl border-2 border-dashed border-[#bd9661]/60 bg-[#bd9661]/10 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing hover:border-[#bd9661] hover:bg-[#bd9661]/20 transition-all select-none shadow-xs hover:shadow-md z-10 group ${
                            compareDraggingDanceFloor === arr.id ? 'opacity-60 ring-2 ring-[#bd9661]' : ''
                          }`}
                          title={`Drag and drop to reposition Dance Floor in ${arr.name}`}
                        >
                          <span className="text-base group-hover:scale-110 transition-transform">💃</span>
                          <span className="font-serif text-[10px] font-bold text-[#6b5847] uppercase tracking-wider mt-0.5">
                            Dance Floor
                          </span>
                          <span className="text-[8.5px] text-[#8b7b6b] opacity-80 font-sans flex items-center gap-1">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="5 9 2 12 5 15" />
                              <polyline points="9 5 12 2 15 5" />
                              <polyline points="15 19 12 22 9 19" />
                              <polyline points="19 9 22 12 19 15" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <line x1="12" y1="2" x2="12" y2="22" />
                            </svg>
                            Drag to move
                          </span>
                        </div>

                        {/* Tables */}
                        {arr.tables.map((tbl) => {
                          const seatedList = arr.guestAssignments.filter((a) => a.tableId === tbl.id);
                          const seatedCount = seatedList.length;
                          const isFull = seatedCount >= tbl.capacity;
                          const isEmpty = seatedCount === 0;
                          const isRound = tbl.shape === 'round';
                          const isKing = tbl.shape === 'king';

                          const shapeClasses = isKing
                            ? 'min-w-[125px] h-[64px] rounded-xl px-2.5 py-1.5'
                            : isRound
                            ? 'w-[82px] h-[82px] rounded-full aspect-square p-2'
                            : 'min-w-[105px] h-[58px] rounded-lg px-2.5 py-1.5';

                          const themeClasses = tbl.isHead
                            ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661] ring-2 ring-[#bd9661]/30 shadow-md'
                            : isFull
                            ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661]'
                            : isEmpty
                            ? 'bg-white text-[#15110e] border-2 border-[#d5c7b5]'
                            : 'bg-white text-[#15110e] border-2 border-[#bd9661] ring-1 ring-[#bd9661]/20';

                          return (
                            <div
                              key={tbl.id}
                              draggable
                              onDragStart={() => setCompareDraggingTable({ arrId: arr.id, tableId: tbl.id })}
                              onDragEnd={() => setCompareDraggingTable(null)}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const guestId = e.dataTransfer.getData('guestId');
                                if (guestId) {
                                  handleSeatGuestInArrangement(arr.id, guestId, tbl.id);
                                }
                              }}
                              onClick={() => handleOpenTableFromComparison(arr.id, tbl.id)}
                              style={{
                                left: `${tbl.x}%`,
                                top: `${tbl.y}%`,
                              }}
                              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing hover:scale-105 transition-all flex flex-col items-center justify-center text-center shadow-xs select-none ${shapeClasses} ${themeClasses}`}
                              title={`${tbl.name} (${tbl.shape}) — ${seatedCount}/${tbl.capacity} seated. Click to view table seats, or drag/drop guests here.`}
                            >
                              <div className="flex items-center gap-1 font-serif text-[10.5px] font-bold leading-tight">
                                {tbl.isHead && <span>👑</span>}
                                <span>{tbl.name}</span>
                              </div>
                              <span className={`text-[9px] font-sans font-bold mt-0.5 px-1.5 py-0.2 rounded-full ${
                                isFull
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : isEmpty
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-[#faf0e1] text-[#7d5e38]'
                              }`}>
                                {seatedCount} / {tbl.capacity}
                              </span>
                            </div>
                          );
                        })}

                        {/* Landmark indicators */}
                        <div className="absolute bottom-2 left-4 bg-white/90 border border-[#e8ded0] px-2.5 py-1 rounded-lg text-[9px] font-bold text-[#8b7b6b] shadow-2xs">
                          🍸 Bar
                        </div>
                        <div className="absolute bottom-2 right-4 bg-white/90 border border-[#e8ded0] px-2.5 py-1 rounded-lg text-[9px] font-bold text-[#8b7b6b] shadow-2xs">
                          🌿 Verandah
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
          /* Regular Seating Canvas Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT / MAIN: DRAGGABLE ROOM CANVAS (Image 3) */}
            <div className={`${isGuestListCollapsed ? 'col-span-12' : 'lg:col-span-8 xl:col-span-8 2xl:col-span-9'} transition-all duration-300 relative`}>
              <div
                id="room_canvas_container"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const el = document.getElementById('room_canvas_container');
                  if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
                }}
                className={`bg-[#faf8f5] border-2 border-[#e8ded0] rounded-2xl md:rounded-3xl ${isMobileCompact ? 'p-3 min-h-[460px]' : 'p-6 min-h-[660px]'} relative shadow-inner overflow-hidden select-none`}
                style={{
                  backgroundImage: 'radial-gradient(#d5c7b5 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Floating Open Guest List button when collapsed */}
                {isGuestListCollapsed && (
                  <button
                    type="button"
                    onClick={() => setIsGuestListCollapsed(false)}
                    className="absolute top-4 right-4 z-20 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] border border-[#bd9661] px-3.5 py-2 rounded-2xl text-xs font-bold shadow-xl cursor-pointer transition-all flex items-center gap-1.5 hover:scale-105"
                    title="Bring back unallocated guest list"
                  >
                    <span>&larr;</span>
                    <span>Open Guest List</span>
                  </button>
                )}
                {/* Room Architectural Anchors */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#15110e] text-[#dfc194] px-6 py-1.5 rounded-full border border-[#bd9661] text-xs font-bold tracking-widest shadow-md flex items-center gap-2">
                  <span>👑</span> BRIDAL STAGE &bull; HEAD TABLE
                </div>

                {/* Draggable Main Dance Floor */}
                <div
                  id="canvas_main_dance_floor"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', 'dancefloor');
                    setIsDraggingDanceFloor(true);
                  }}
                  onDragEnd={() => setIsDraggingDanceFloor(false)}
                  onTouchMove={handleTouchMoveDanceFloor}
                  style={{
                    left: `${danceFloorPos.x}%`,
                    top: `${danceFloorPos.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-48 h-36 rounded-3xl border-2 border-dashed border-[#bd9661]/60 bg-[#bd9661]/10 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing hover:border-[#bd9661] hover:bg-[#bd9661]/15 transition-shadow shadow-xs hover:shadow-md select-none group z-10 ${
                    isDraggingDanceFloor ? 'opacity-60 ring-2 ring-[#bd9661]' : ''
                  }`}
                  title="Drag and drop to reposition Main Dance Floor"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">💃</span>
                  <span className="font-serif text-xs font-bold text-[#6b5847] uppercase tracking-wider mt-1">
                    Main Dance Floor
                  </span>
                  <span className="text-[9px] text-[#8b7b6b] opacity-80 font-sans mt-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="5 9 2 12 5 15" />
                      <polyline points="9 5 12 2 15 5" />
                      <polyline points="15 19 12 22 9 19" />
                      <polyline points="19 9 22 12 19 15" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="12" y1="2" x2="12" y2="22" />
                    </svg>
                    Drag to move
                  </span>
                </div>

                <div className="absolute bottom-3 left-8 bg-white/90 border border-[#e8ded0] px-4 py-1.5 rounded-xl text-[10px] font-bold text-[#8b7b6b] shadow-xs">
                  🍸 Main Bar &amp; Lounge
                </div>

                <div className="absolute bottom-3 right-8 bg-white/90 border border-[#e8ded0] px-4 py-1.5 rounded-xl text-[10px] font-bold text-[#8b7b6b] shadow-xs">
                  🌿 Garden Verandah Access
                </div>

                {/* Draggable Tables on Canvas with Distinct Round / Rectangular Geometry & Shape Icons */}
                {filteredTables.map((tbl) => {
                  const seatedCount = state.guests.filter((g) => g.tableId === tbl.id).length;
                  const isFull = seatedCount >= tbl.capacity;
                  const isEmpty = seatedCount === 0;
                  const isRound = tbl.shape === 'round';
                  const isKing = tbl.shape === 'king';
                  const isRect = tbl.shape === 'rectangular';

                  // Shape-specific card geometries
                  const shapeGeometryClass = isKing
                    ? 'min-w-[155px] sm:min-w-[170px] h-[78px] sm:h-[82px] rounded-xl px-4 py-2'
                    : isRound
                    ? 'w-[98px] h-[98px] sm:w-[106px] sm:h-[106px] rounded-full aspect-square p-2.5'
                    : 'min-w-[130px] sm:min-w-[145px] h-[72px] sm:h-[76px] rounded-lg px-3.5 py-1.5';

                  const shapeThemeClass = tbl.isHead
                    ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661] ring-2 ring-[#bd9661]/40'
                    : isKing
                    ? 'bg-gradient-to-r from-[#1c1611] via-[#2b1f16] to-[#1c1611] text-[#dfc194] border-2 border-[#bd9661]'
                    : isFull
                    ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661]'
                    : isEmpty
                    ? 'bg-white text-[#15110e] border-2 border-[#d5c7b5]'
                    : 'bg-white text-[#15110e] border-2 border-[#bd9661] ring-2 ring-[#bd9661]/25';

                  return (
                    <div
                      key={tbl.id}
                      draggable
                      onDragStart={() => setDraggingTableId(tbl.id)}
                      onTouchMove={(e) => handleTouchMoveTable(e, tbl.id)}
                      onClick={() => setSelectedTableId(tbl.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverTarget({ type: 'table', tableId: tbl.id });
                      }}
                      onDragLeave={() => setDragOverTarget(null)}
                      onDrop={(e) => handleDropOnTable(e, tbl.id)}
                      style={{
                        left: `${tbl.x}%`,
                        top: `${tbl.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all shadow-md flex flex-col items-center justify-center text-center select-none ${shapeGeometryClass} ${shapeThemeClass} hover:scale-110 hover:shadow-xl`}
                      title={`${(tbl.name || '').replace(/\s*\([^)]*\)/g, '').trim()} • ${seatedCount} / ${tbl.capacity} Seated`}
                    >
                      {/* Clean minimalist table label: Clean Table Name and Occupancy only */}
                      <div className="text-xs sm:text-sm font-bold font-serif leading-tight truncate max-w-[92%] px-1">
                        {(tbl.name || '').replace(/\s*\([^)]*\)/g, '').trim()}
                      </div>
                      <div className="text-xs sm:text-[13px] font-bold font-mono mt-1">
                        {seatedCount} / {tbl.capacity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE: UNALLOCATED GUESTS & FAMILIES PANEL */}
            {!isGuestListCollapsed && (
              <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 bg-white border border-[#e8ded0] rounded-3xl p-5 shadow-sm space-y-3.5 sticky top-4 max-h-[660px] flex flex-col transition-all duration-300">
                {/* Header with Collapse Button */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#bd9661] animate-pulse" />
                      <h3 className="font-serif text-base font-bold text-[#15110e]">
                        Unallocated Guests
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsGuestListCollapsed(true)}
                      className="text-xs text-[#8b7b6b] hover:text-[#15110e] border border-[#e8ded0] bg-[#faf8f5] hover:bg-[#f0ede4] px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 font-semibold"
                      title="Collapse guest list"
                    >
                      <span>Collapse</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                    Drag any guest onto a table on the floor plan or use quick seat dropdown.
                  </p>
                </div>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search unassigned..."
                value={unassignedSearch}
                onChange={(e) => setUnassignedSearch(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#bd9661] shadow-2xs"
              />

              {/* Quick Seat Entire Household Box */}
              {unassignedHouseholds.length > 0 && (
                <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-2.5 space-y-1.5 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#916c3d]">
                    Quick Seat Household
                  </div>
                  <div className="flex gap-1.5">
                    <select
                      id="side_hh_sel"
                      className="flex-1 bg-white border border-[#e8ded0] rounded-lg p-1 text-[11px] outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Select family...</option>
                      {unassignedHouseholds.map(({ household, members }) => (
                        <option key={household} value={household}>
                          {household} ({members.length})
                        </option>
                      ))}
                    </select>
                    <select
                      id="side_tbl_sel"
                      className="flex-1 bg-white border border-[#e8ded0] rounded-lg p-1 text-[11px] outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>To table...</option>
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const hVal = (document.getElementById('side_hh_sel') as HTMLSelectElement)?.value;
                        const tVal = (document.getElementById('side_tbl_sel') as HTMLSelectElement)?.value;
                        const hh = unassignedHouseholds.find((x) => x.household === hVal);
                        if (hh && tVal) handleAssignHousehold(hh.members, tVal);
                      }}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-2 py-1 rounded-lg text-xs cursor-pointer"
                    >
                      Seat
                    </button>
                  </div>
                </div>
              )}

              {/* Scrollable Guest List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {unassignedGuests.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#3c6a42] font-semibold bg-[#f0f7f1] rounded-2xl border border-emerald-200 p-4">
                    🎉 All wedding guests are allocated to tables!
                  </div>
                ) : (
                  unassignedGuests.map((g) => (
                    <div
                      key={g.id}
                      draggable
                      onDragStart={(e) => handleGuestDragStart(e, g.id)}
                      onDragEnd={handleGuestDragEnd}
                      className="bg-[#faf8f5] hover:bg-[#f5efe6] border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between text-xs cursor-grab active:cursor-grabbing shadow-2xs transition-colors"
                      title="Drag onto any canvas table or select table below"
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 pr-1">
                        <span className="w-7 h-7 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-[10px] flex items-center justify-center shrink-0">
                          {g.initials || g.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-[#15110e] truncate">{g.name}</div>
                          <div className="text-[10px] text-[#8b7b6b] truncate flex items-center gap-1">
                            <span>{g.household}</span>
                            {g.dietary && g.dietary !== 'None' && (
                              <span className="bg-[#fff1f0] text-[#c93b2b] px-1 rounded text-[9px] font-semibold">
                                {g.dietary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Assign Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleAssignGuest(g.id, e.target.value);
                        }}
                        defaultValue=""
                        className="text-[10px] bg-white border border-[#e8ded0] rounded-lg px-2 py-1 outline-none cursor-pointer shrink-0 font-medium"
                      >
                        <option value="" disabled>Seat...</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SAVE SEATING ARRANGEMENT MODAL (Couple & MC)                   */}
      {/* ============================================================== */}
      {showSaveArrangementModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowSaveArrangementModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e8ded0] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💾</span>
                <div>
                  <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                    SEATING ARRANGEMENT &bull; SNAPSHOT
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Save Seating Arrangement
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveArrangementModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveArrangement} className="p-5 space-y-4 text-xs">
              <p className="text-[#8b7b6b] text-xs">
                Save the current floor plan layout and guest table assignments. This arrangement will be instantly accessible to both the Couple and MC consoles and logged into the audit trail.
              </p>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#15110e]">
                  Arrangement Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seating Arrangement 1, Arrangement 2, Option B - Open Dancefloor"
                  value={newArrangementName}
                  onChange={(e) => setNewArrangementName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#15110e]">
                  Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Traditional banquet layout, VIP family tables grouped near stage for speeches"
                  value={newArrangementNotes}
                  onChange={(e) => setNewArrangementNotes(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl p-2.5 text-xs text-[#15110e] outline-none"
                />
              </div>

              <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-[#8b7b6b]">
                  <span>Tables Included:</span>
                  <strong className="text-[#15110e]">{tables.length} tables</strong>
                </div>
                <div className="flex items-center justify-between text-[#8b7b6b]">
                  <span>Currently Seated Guests:</span>
                  <strong className="text-emerald-700 font-bold">{weddingGuests.filter(g => g.tableId).length} guests</strong>
                </div>
                <div className="flex items-center justify-between text-[#8b7b6b]">
                  <span>Saved Author:</span>
                  <strong className="text-[#bd9661]">
                    {isMcView ? 'Robert Galati (MC)' : `${currentWedding?.couple || 'Couple'} (Couple)`}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0ede6]">
                <button
                  type="button"
                  onClick={() => setShowSaveArrangementModal(false)}
                  className="btn btn-outline btn-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm cursor-pointer font-bold flex items-center gap-1.5"
                >
                  <span>Save &amp; Sync Arrangement</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* COMPARE SAVED ARRANGEMENTS MODAL                               */}
      {/* ============================================================== */}
      {showCompareArrangementsModal && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowCompareArrangementsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-[#e8ded0] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#15110e] text-white flex justify-between items-center border-b border-[#29211a]">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚖️</span>
                <div>
                  <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                    SEATING COMPARISON &bull; COUPLE &amp; MC
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Compare Saved Seating Arrangements
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareArrangementsModal(false)}
                className="text-white/70 hover:text-[#bd9661] text-xl font-bold cursor-pointer transition-colors p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <p className="text-[#8b7b6b] text-xs">
                Select any saved layout to instantly compare table configurations, capacities, and seating distributions. Both Couple and MC can switch arrangements anytime.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
                {savedArrangements.map((arr) => {
                  const isSelected = selectedCompareArrangementIds.includes(arr.id);
                  const roundCount = arr.tables.filter((t) => t.shape === 'round').length;
                  const rectCount = arr.tables.filter((t) => t.shape === 'rectangular').length;
                  const kingCount = arr.tables.filter((t) => t.shape === 'king' || t.isHead).length;
                  const seatedCount = arr.guestAssignments.filter((a) => a.tableId).length;

                  return (
                    <div
                      key={arr.id}
                      onClick={() => handleToggleSelectCompareArrangement(arr.id)}
                      className={`border-2 rounded-2xl p-4 transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#bd9661] bg-[#faf8f5] shadow-md ring-2 ring-[#bd9661]'
                          : 'border-[#e8ded0] bg-white hover:border-[#bd9661]/60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#15110e] leading-snug">
                            {arr.name}
                          </h4>
                          <div className="text-[10px] text-[#8b7b6b] mt-0.5">
                            Saved by <strong>{arr.savedBy}</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                          <div className="bg-[#fcfaf7] p-2 rounded-lg border border-[#f0ede6]">
                            <span className="text-[#8b7b6b] block text-[9.5px]">Table Geometry:</span>
                            <span className="font-semibold text-[#15110e]">
                              {roundCount} Round &bull; {rectCount} Rect &bull; {kingCount} King
                            </span>
                          </div>
                          <div className="bg-[#fcfaf7] p-2 rounded-lg border border-[#f0ede6]">
                            <span className="text-[#8b7b6b] block text-[9.5px]">Guests Seated:</span>
                            <span className="font-bold text-emerald-700">
                              {seatedCount} guests
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelectCompareArrangement(arr.id);
                          }}
                          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                            isSelected
                              ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661] hover:bg-[#251e18]'
                              : 'bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] text-[#15110e]'
                          }`}
                        >
                          {isSelected ? '✓ Selected' : '+ Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[#faf8f5] border-t border-[#e8ded0] flex items-center justify-between">
              <span className="text-[11px] text-[#8b7b6b]">
                {savedArrangements.length} total saved layouts for this wedding
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCompareArrangementsModal(false)}
                  className="btn btn-outline btn-sm cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleLaunchComparison}
                  className="btn btn-gold btn-sm cursor-pointer font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>⚖️</span>
                  <span>Compare</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FLOATING DRAGGABLE GUEST LIST FOR COMPARISON MODE              */}
      {/* ============================================================== */}
      {!isMobileCompact && isComparing && isFloatingGuestListOpen && (
        <div
          style={{
            left: `${floatingGuestListPos.x}px`,
            top: `${floatingGuestListPos.y}px`,
          }}
          className="fixed z-50 w-80 sm:w-88 bg-white border-2 border-[#bd9661] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Draggable Header */}
          <div
            onMouseDown={handleFloatingMouseDown}
            className="px-3.5 py-2.5 bg-[#15110e] text-[#dfc194] flex items-center justify-between cursor-grab active:cursor-grabbing select-none border-b border-[#29211a]"
            title="Click and drag to slide anywhere across screen"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#bd9661] text-sm">⠿</span>
              <span className="font-serif font-bold text-xs text-white">
                Floating Guest List
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#bd9661] bg-white/10 px-1.5 py-0.5 rounded font-sans">
                Slide Anywhere
              </span>
              <button
                type="button"
                onClick={() => setIsFloatingGuestListOpen(false)}
                className="text-white/60 hover:text-white text-sm font-bold p-1 cursor-pointer"
                title="Close floating drawer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Compared Arrangement Tabs */}
          <div className="p-2 bg-[#fdfbf7] border-b border-[#ebdcc9] flex gap-1 overflow-x-auto">
            {comparedArrangements.map((arr) => {
              const unseatedCount = weddingGuests.filter(
                (g) => !arr.guestAssignments.some((a) => a.guestId === g.id && a.tableId)
              ).length;
              const isTabActive = activeCompareTabArrId === arr.id;

              return (
                <button
                  key={arr.id}
                  type="button"
                  onClick={() => setActiveCompareTabArrId(arr.id)}
                  className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-xl text-[10.5px] font-bold cursor-pointer transition-all text-center ${
                    isTabActive
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                      : 'bg-white hover:bg-[#f0ede4] text-[#6b5847] border border-[#e8ded0]'
                  }`}
                >
                  <div className="truncate">{arr.name.split('(')[0]}</div>
                  <div className={`text-[9px] ${isTabActive ? 'text-[#bd9661]' : 'text-[#8b7b6b]'}`}>
                    {unseatedCount} unassigned
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="p-2 border-b border-[#f2ede4] bg-white">
            <input
              type="text"
              placeholder="Search unassigned guests..."
              value={compareGuestSearch}
              onChange={(e) => setCompareGuestSearch(e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-2.5 py-1.5 text-xs text-[#15110e] outline-none"
            />
          </div>

          {/* Guest List for Active Arrangement Tab */}
          <div className="p-2 overflow-y-auto max-h-72 space-y-1.5 bg-[#faf8f5]">
            {activeCompareUnassignedGuests.length === 0 ? (
              <div className="text-center py-6 text-xs text-emerald-800 font-semibold bg-emerald-50 rounded-xl border border-emerald-200">
                🎉 All guests are seated in this arrangement!
              </div>
            ) : (
              activeCompareUnassignedGuests.map((g) => (
                <div
                  key={g.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('guestId', g.id);
                    e.dataTransfer.setData('text/plain', g.id);
                  }}
                  className="bg-white border border-[#e8ded0] hover:border-[#bd9661] p-2 rounded-xl flex items-center justify-between gap-2 shadow-2xs cursor-grab active:cursor-grabbing hover:shadow-xs transition-all group"
                  title="Drag and drop onto any table in the canvases"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#15110e] truncate flex items-center gap-1.5">
                      <span className="text-[#8b7b6b] text-xs">⠿</span>
                      <span>{g.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px]">
                      {g.dietary && g.dietary !== 'None' && (
                        <span className="text-[#c93b2b] bg-rose-50 border border-rose-200 px-1 rounded font-semibold">
                          {g.dietary}
                        </span>
                      )}
                      <span className="text-[#8b7b6b]">{g.category || 'Guest'}</span>
                    </div>
                  </div>

                  {/* Quick Seat to Active Arrangement Tables */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSeatGuestInArrangement(activeCompareTabArrId, g.id, e.target.value);
                      }
                    }}
                    defaultValue=""
                    className="text-[10px] bg-[#faf8f5] border border-[#d5c7b5] rounded-lg px-1.5 py-1 text-[#15110e] font-semibold outline-none cursor-pointer shrink-0"
                  >
                    <option value="" disabled>Seat...</option>
                    {activeCompareArrangement?.tables.map((tbl) => (
                      <option key={tbl.id} value={tbl.id}>
                        {tbl.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 px-3 bg-[#fdfbf7] border-t border-[#ebdcc9] text-[10.5px] text-[#8b7b6b] flex items-center justify-between">
            <span>Drag card or use 'Seat...' to assign</span>
            <span className="font-bold text-[#15110e]">
              {activeCompareUnassignedGuests.length} left
            </span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW TABLE                                            */}
      {/* ============================================================== */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ebd3a8] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-[#15110e]">
                Add New Reception Table
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTableModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateNewTable} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">
                  Table Name or Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 7, Paris, or School Friends"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">
                    Table Shape
                  </label>
                  <select
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value as TableShape)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none"
                  >
                    <option value="round">Round Banquet</option>
                    <option value="rectangular">Rectangular Table</option>
                    <option value="king">Long King Banquet (30-40)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">
                    Guest Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Family, College, VIP"
                    value={newTableCategory}
                    onChange={(e) => setNewTableCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8b7b6b] uppercase text-[10px] mb-1">
                    Room Zone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. North Terrace, Ballroom"
                    value={newTableZone}
                    onChange={(e) => setNewTableZone(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="flex-1 bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 🪑 MODAL: SEATING PLAN CONFIGURATION WIZARD                   */}
      {/* ============================================================== */}
      {showSeedTablesModal && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-2 border-[#bd9661] max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header (Sticky Top) */}
            <div className="flex items-center justify-between border-b border-[#ebdcc9] p-5 pb-4 bg-gradient-to-r from-[#faf8f5] to-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#15110e] text-[#dfc194] border border-[#bd9661] flex items-center justify-center text-lg shadow-sm shrink-0">
                  🌱
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#15110e]">
                    Seed Table — Seating Setup &amp; Architecture
                  </h3>
                  <div className="text-[11px] text-[#bd9661] font-semibold">
                    Table Configuration • Vertical Table Summary • Capacity Validation • AI Seating
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSeedTablesModal(false)}
                className="w-8 h-8 rounded-full bg-[#faf8f5] hover:bg-[#f0ede4] text-[#8b7b6b] hover:text-[#15110e] font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Auto-Fetched Guest Intelligence Summary Bar */}
              <div className="bg-[#faf8f5] border border-[#ebdcc9] rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold uppercase text-[10.5px] text-[#8b7b6b] tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Auto-Fetched from Official Guest List
                  </span>
                  <span className="text-[11px] font-bold text-[#bd9661]">
                    {currentWedding?.couple || 'Sophie & James'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                    <div className="font-serif text-xl font-bold text-[#15110e]">{confirmedGuestsCount}</div>
                    <div className="text-[10.5px] text-[#8b7b6b] font-medium mt-0.5">Confirmed Guests</div>
                  </div>
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                    <div className="font-serif text-xl font-bold text-[#15110e]">{uniqueHouseholds.length}</div>
                    <div className="text-[10.5px] text-[#8b7b6b] font-medium mt-0.5">Family Households</div>
                  </div>
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                    <div className="font-serif text-xl font-bold text-[#bd9661]">{dietaryGuestsCount}</div>
                    <div className="text-[10.5px] text-[#8b7b6b] font-medium mt-0.5">Dietary Profiles</div>
                  </div>
                </div>
              </div>

              {/* 1. TABLE CONFIGURATION (ESSENTIAL FIELDS) */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#f5f2eb]">
                  <div>
                    <span className="font-bold uppercase text-[11px] text-[#15110e] tracking-wider">
                      1. Table Configuration
                    </span>
                    <p className="text-[10.5px] text-[#8b7b6b] mt-0.5">
                      Configure geometry and reserved assignments
                    </p>
                  </div>
                  <span className="text-[10px] text-[#bd9661] font-bold uppercase tracking-wider bg-[#faf5ed] border border-[#ebd3a8] px-2 py-0.5 rounded">
                    Batch Defaults
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Table Type */}
                  <div>
                    <label className="block font-bold text-[#6b5847] text-[11px] mb-1">
                      Table Type
                    </label>
                    <select
                      value={configTableType}
                      onChange={(e) => setConfigTableType(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] font-semibold outline-none focus:border-[#bd9661]"
                    >
                      <option value="Round Banquet">Round Banquet (Circular — 8-12 Seats)</option>
                      <option value="Rectangular">Rectangular (Double-Sided — 8-14 Seats)</option>
                      <option value="Long Banquet">Long Banquet (Royal King — 12-24 Seats)</option>
                      <option value="Sweetheart Table">Sweetheart Table (Newlyweds — 2 Seats)</option>
                      <option value="Custom">Custom Table Type...</option>
                    </select>
                    {configTableType === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom table type (e.g. Oval Pavilion)..."
                        value={configCustomTableType}
                        onChange={(e) => setConfigCustomTableType(e.target.value)}
                        className="mt-1.5 w-full bg-white border border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none"
                      />
                    )}
                  </div>

                  {/* Seats per Table Stepper */}
                  <div>
                    <label className="block font-bold text-[#6b5847] text-[11px] mb-1">
                      Seats per Table
                    </label>
                    <div className="flex items-center gap-1.5 h-[38px]">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(2, configSeatsPerTable - 1);
                          setConfigSeatsPerTable(next);
                          setSeedTables(prev => prev.map(t => t.isHead ? t : { ...t, seats: next }));
                        }}
                        className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#d5c7b5] hover:bg-[#f0ede4] text-[#15110e] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="Decrease seats per table"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-serif text-base font-bold text-[#15110e]">
                        {configSeatsPerTable}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(30, configSeatsPerTable + 1);
                          setConfigSeatsPerTable(next);
                          setSeedTables(prev => prev.map(t => t.isHead ? t : { ...t, seats: next }));
                        }}
                        className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#d5c7b5] hover:bg-[#f0ede4] text-[#15110e] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="Increase seats per table"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Use */}
                  <div>
                    <label className="block font-bold text-[#6b5847] text-[11px] mb-1">
                      Use
                    </label>
                    <select
                      value={configReservedUse}
                      onChange={(e) => setConfigReservedUse(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs text-[#15110e] font-semibold outline-none focus:border-[#bd9661]"
                    >
                      <option value="General Seating">General Seating (Friends &amp; Guests)</option>
                      <option value="Head Table">Head Table (Newlyweds &amp; Bridal)</option>
                      <option value="VIP Table">VIP Table (Immediate Family &amp; Honorees)</option>
                      <option value="Bride's Family">Bride's Family Table</option>
                      <option value="Groom's Family">Groom's Family Table</option>
                      <option value="Accessible Seating">Accessible Seating (Priority Access)</option>
                      <option value="Custom">Custom Assignment...</option>
                    </select>
                    {configReservedUse === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom reserved use (e.g. University Alumni)..."
                        value={configCustomReservedUse}
                        onChange={(e) => setConfigCustomReservedUse(e.target.value)}
                        className="mt-1.5 w-full bg-white border border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* Number of Tables Stepper & Add Table Button */}
                <div className="pt-2 border-t border-[#f5f2eb] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#6b5847] text-[11px]">Number of Tables:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfigTableCount(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#d5c7b5] hover:bg-[#f0ede4] text-[#15110e] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="Decrease table count"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-serif text-base font-bold text-[#15110e]">
                        {configTableCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfigTableCount(prev => Math.min(30, prev + 1))}
                        className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#d5c7b5] hover:bg-[#f0ede4] text-[#15110e] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                        title="Increase table count"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Replaces Auto-calculated recommendation text with Add to Setup button */}
                  <button
                    type="button"
                    onClick={() => handleAddConfiguredTables(configTableCount)}
                    className="h-8.5 px-4 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white border border-[#bd9661] rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                    title="Add table with this configuration to the setup below"
                  >
                    <span className="text-sm font-bold text-[#bd9661]">+</span>
                    <span>Add to Setup</span>
                  </button>
                </div>
              </div>

              {/* 2. CAPACITY VALIDATION & AUDIT ALERT */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isCapacitySufficient
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{isCapacitySufficient ? '✓' : '⚠️'}</span>
                    <div>
                      <div className="font-bold text-xs">
                        {isCapacitySufficient
                          ? `Seating Capacity Optimal: ${totalPlannedCapacity} seats across ${seedTables.length} tables`
                          : `Seating Capacity Alert: Planned ${totalPlannedCapacity} seats for ${confirmedGuestsCount} confirmed guests`}
                      </div>
                      <div className="text-[11px] opacity-80 mt-0.5">
                        {isCapacitySufficient
                          ? `All ${confirmedGuestsCount} guests covered with ${totalPlannedCapacity - confirmedGuestsCount} buffer seats remaining.`
                          : `Shortfall of ${capacityShortfall} seat${capacityShortfall > 1 ? 's' : ''}. Add more tables or expand capacity below.`}
                      </div>
                    </div>
                  </div>

                  {!isCapacitySufficient && (
                    <button
                      type="button"
                      onClick={() => handleAddSeedTable(capacityShortfall)}
                      className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      + Add Table ({capacityShortfall} Seats)
                    </button>
                  )}
                </div>
              </div>

              {/* 3. TABLE SETUP (NORMAL ROWS AND COLUMNS TABLE) */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl overflow-hidden shadow-2xs">
                {/* Table Header Controls */}
                <div className="flex items-center justify-between p-4 px-5 border-b border-[#f0ede6] bg-[#faf8f5]">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#15110e]">
                      Table Setup Summary
                    </h4>
                    <span className="text-[11px] font-sans font-bold bg-[#faf5ed] border border-[#ebd3a8] text-[#8b6528] px-2.5 py-0.5 rounded-full">
                      {seedTables.length} Tables • {totalPlannedCapacity} Seats
                    </span>
                  </div>
                </div>

                {/* Normal Table: Rows and Columns */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#f7f4ee] border-b border-[#ebdcc9] text-[#6b5847] uppercase text-[10px] font-bold tracking-wider">
                        <th className="py-3 px-4">Table Name</th>
                        <th className="py-3 px-3">Table Type</th>
                        <th className="py-3 px-3 text-center">No. of Seats</th>
                        <th className="py-3 px-4">Table Assigned To</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ede4]">
                      {seedTableGroups.map((grp) => {
                        const isEditing = editingGroupId === grp.groupKey;
                        const displayType = grp.type === 'Custom' ? (grp.customType || 'Custom') : grp.type;
                        const displayLoc = grp.location === 'Custom Location' ? (grp.customLocation || 'Custom') : grp.location;
                        const displayRes = grp.reserved === 'Custom' ? (grp.customReserved || 'Custom') : grp.reserved;

                        if (isEditing) {
                          return (
                            <tr key={grp.groupKey} className="bg-[#fdfbf7] ring-1 ring-[#bd9661]/30">
                              {/* Table Name */}
                              <td className="py-2.5 px-4">
                                <span className="font-bold text-[#15110e]">{grp.displayName}</span>
                                {grp.count > 1 && (
                                  <span className="block text-[10px] text-[#8b6528] mt-0.5">
                                    Applies to {grp.count} tables
                                  </span>
                                )}
                              </td>

                              {/* Table Type */}
                              <td className="py-2.5 px-3">
                                <select
                                  value={grp.type}
                                  onChange={(e) => handleUpdateTableGroup(grp.tableIds, { type: e.target.value })}
                                  className="w-full min-w-[120px] bg-white border border-[#d5c7b5] rounded-lg px-2 py-1 text-xs text-[#15110e] outline-none font-medium"
                                >
                                  <option value="Round Banquet">Round Banquet</option>
                                  <option value="Rectangular">Rectangular</option>
                                  <option value="Long Banquet">Long Banquet</option>
                                  <option value="Sweetheart Table">Sweetheart Table</option>
                                  <option value="Custom">Custom...</option>
                                </select>
                              </td>

                              {/* No. of Seats */}
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="number"
                                  min="2"
                                  max="30"
                                  value={grp.seats}
                                  onChange={(e) => handleUpdateTableGroup(grp.tableIds, { seats: Number(e.target.value) || 2 })}
                                  className="w-16 mx-auto text-center bg-white border border-[#d5c7b5] rounded-lg px-2 py-1 text-xs font-bold text-[#15110e] outline-none"
                                />
                              </td>

                              {/* Table Assigned To */}
                              <td className="py-2.5 px-4">
                                <select
                                  value={grp.reserved}
                                  onChange={(e) => handleUpdateTableGroup(grp.tableIds, { reserved: e.target.value })}
                                  className="w-full min-w-[130px] bg-white border border-[#d5c7b5] rounded-lg px-2 py-1 text-xs text-[#15110e] outline-none font-medium"
                                >
                                  <option value="General Seating">Friends & Guests (General)</option>
                                  <option value="Head Table">Head Table</option>
                                  <option value="VIP Table">VIP Table</option>
                                  <option value="Bride's Family">Bride's Family</option>
                                  <option value="Groom's Family">Groom's Family</option>
                                  <option value="Accessible Seating">Accessible Seating</option>
                                  <option value="Custom">Custom...</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingGroupId(null)}
                                    className="px-2.5 py-1 bg-[#15110e] text-[#dfc194] rounded-lg font-bold text-xs cursor-pointer hover:text-white transition-colors"
                                  >
                                    Done
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTableGroup(grp.tableIds)}
                                    className="p-1 text-[#8b7b6b] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete table entry"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      <line x1="10" y1="11" x2="10" y2="17" />
                                      <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        // Normal Row
                        return (
                          <tr key={grp.groupKey} className="hover:bg-[#faf7f2]/80 transition-colors group">
                            {/* Table Name */}
                            <td className="py-3 px-4 font-bold text-[#15110e] whitespace-nowrap">
                              <span className="flex items-center gap-2">
                                {grp.isHead || grp.reserved === 'Head Table' ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bd9661" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ) : grp.reserved === 'VIP Table' ? (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bd9661" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 8v8" />
                                    <path d="M8 12h8" />
                                  </svg>
                                ) : (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b7b6b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                    <rect width="18" height="18" x="3" y="3" rx="4" />
                                    <path d="M3 9h18" />
                                    <path d="M9 21V9" />
                                  </svg>
                                )}
                                <span>{grp.displayName}</span>
                                {grp.count > 1 && (
                                  <span className="text-[10px] font-sans font-bold bg-[#faf5ed] border border-[#ebd3a8] text-[#8b6528] px-1.5 py-0.2 rounded-full">
                                    {grp.count} Tables
                                  </span>
                                )}
                              </span>
                            </td>

                            {/* Table Type */}
                            <td className="py-3 px-3 text-[#544332] whitespace-nowrap">
                              <span className="bg-[#faf8f5] border border-[#ebd3a8] text-[#8b6528] px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                                {displayType}
                              </span>
                            </td>

                            {/* No. of Seats */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className="font-bold text-[#15110e] bg-white border border-[#d5c7b5] px-2.5 py-0.5 rounded-md text-[11px]">
                                {grp.seats}
                              </span>
                            </td>

                            {/* Table Assigned To */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 ${
                                grp.isHead || grp.reserved === 'Head Table'
                                  ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]'
                                  : grp.reserved === 'VIP Table'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : grp.reserved.includes('Family')
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : grp.reserved === 'Accessible Seating'
                                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                                  : 'bg-[#faf8f5] text-[#6b5847] border border-[#e8ded0]'
                              }`}>
                                <span>{displayRes}</span>
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => setEditingGroupId(grp.groupKey)}
                                  className="px-2 py-1 bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] text-[#15110e] rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTableGroup(grp.tableIds)}
                                  className="p-1 text-[#8b7b6b] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete table entry"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="flex items-center justify-end gap-3 p-4 px-6 border-t border-[#ebdcc9] bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSeedTablesModal(false)}
                  className="px-4 py-2 bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApplySeatingConfig}
                  className="px-5 py-2 bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Apply Floor Setup &amp; Launch Cheers AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPORT & PRINT SEATING MANIFEST                         */}
      {/* ============================================================== */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#ebd3a8] space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">
                  Seating Arrangement Manifest &amp; Export
                </h3>
                <p className="text-[11px] text-[#8b7b6b]">
                  {tables.length} Tables &bull; {totalSeated} Assigned Guests
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {tables.map((t) => {
                const seated = state.guests.filter((g) => g.tableId === t.id);
                return (
                  <div key={t.id} className="border border-[#e8ded0] rounded-xl p-3 bg-[#faf8f5]">
                    <div className="flex items-center justify-between font-bold text-[#15110e] border-b pb-1.5 mb-2">
                      <span className="font-serif text-sm">{t.name} ({t.shape})</span>
                      <span className="text-[#bd9661]">{seated.length} / {t.capacity} Seated</span>
                    </div>
                    {seated.length === 0 ? (
                      <div className="text-[#8b7b6b] italic text-[11px]">No guests assigned to this table yet.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {seated.map((g) => (
                          <div key={g.id} className="bg-white p-1.5 rounded border border-[#e8ded0] flex items-center justify-between">
                            <span className="font-medium text-[#15110e]">Seat {(g.seatIndex || 0) + 1}: {g.name}</span>
                            {g.dietary && g.dietary !== 'None' && (
                              <span className="text-[#c93b2b] text-[10px] font-semibold">{g.dietary}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-[#251b14] hover:bg-[#382b20] text-[#dfc194] font-bold py-2.5 rounded-xl cursor-pointer text-xs"
              >
                🖨️ Print Manifest
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="flex-1 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded-xl cursor-pointer text-xs"
              >
                📥 Download CSV
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* 🥂 CHEERS AI INTERACTIVE SEATING CHATBOT CONCIERGE             */}
      {/* ============================================================== */}
      {isCheersChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border-2 border-[#bd9661] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Caviar & Gold Header */}
          <div className="bg-[#15110e] text-white p-3.5 px-4 flex items-center justify-between border-b border-[#bd9661]/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dfc194] to-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm shadow-xs">
                🥂
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#dfc194] leading-tight">
                  Cheers AI
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsCheersChatOpen(false)}
                className="w-7 h-7 rounded-lg text-[#dfc194] hover:text-white hover:bg-white/10 flex items-center justify-center text-lg cursor-pointer transition-colors"
                title="Close Cheers AI"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Quick Action Prompt Chips (Scrollable Bar) */}
          <div className="bg-[#faf8f5] p-2 border-b border-[#ebdcc9] shrink-0 overflow-x-auto flex items-center gap-1.5 text-[11px] font-semibold no-scrollbar">
            <button
              type="button"
              onClick={() => handleCheersChatAction('households')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              👨‍👩‍👧‍👦 Households
            </button>
            <button
              type="button"
              onClick={() => handleCheersChatAction('vips')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              👑 VIP &amp; Head Table
            </button>
            <button
              type="button"
              onClick={() => handleCheersChatAction('dietary')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              🥗 Dietary Cluster
            </button>
            <button
              type="button"
              onClick={() => handleCheersChatAction('fill')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              ⚡ Auto-Fill
            </button>
            <button
              type="button"
              onClick={() => handleCheersChatAction('seed')}
              className="px-2.5 py-1 rounded-full bg-[#f4ecd8] hover:bg-[#15110e] hover:text-[#dfc194] text-[#6b5847] border border-[#bd9661] shrink-0 cursor-pointer transition-colors shadow-2xs font-bold"
            >
              🌱 Seed Tables
            </button>
            <button
              type="button"
              onClick={() => handleCheersChatAction('audit')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#15110e] hover:text-[#dfc194] text-[#15110e] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              📊 Audit Room
            </button>
            <button
              type="button"
              onClick={() => handleCheersChatAction('reset')}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 hover:text-rose-700 text-[#8b7b6b] border border-[#d5c7b5] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              🧹 Reset
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#fdfbf7]">
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
                        <span className="font-bold text-[#15110e] text-[11px]">{msg.proposal.title}</span>
                        <span className="bg-[#bd9661] text-[#15110e] px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {msg.proposal.count} Guests
                        </span>
                      </div>

                      {/* Allocations Scrollable List */}
                      <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-[11px]">
                        {msg.proposal.changes.map(({ guestId, tableId }, i) => {
                          const g = state.guests.find((x) => x.id === guestId);
                          const t = tables.find((x) => x.id === tableId);
                          return (
                            <div
                              key={i}
                              className="bg-white border border-[#e8ded0] p-1.5 px-2 rounded-lg flex items-center justify-between"
                            >
                              <span className="font-semibold text-[#15110e] truncate max-w-[130px]">
                                {g?.name || 'Guest'}
                              </span>
                              <span className="text-[#8b7b6b] text-[10px]">&rarr;</span>
                              <span className="font-bold text-[#bd9661] truncate max-w-[120px]">
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
                          <span>Confirmed &amp; Applied to Seating Canvas</span>
                        </div>
                      ) : msg.status === 'rejected' ? (
                        <div className="w-full text-center py-2 bg-[#fbeae8] text-[#a8382c] rounded-xl font-bold text-xs border border-[#f5c2bc] flex items-center justify-center gap-1.5 shadow-2xs">
                          <span>✕</span>
                          <span>Proposal Declined — Awaiting Your Suggestions</span>
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
              className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Send</span>
              <span>&rarr;</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Bottom-Right Launcher (When Chat is Closed) */}
      {!isCheersChatOpen && (
        <button
          type="button"
          onClick={() => setIsCheersChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#15110e] text-[#dfc194] hover:text-white border-2 border-[#bd9661] hover:border-[#dfc194] px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer font-serif font-bold text-sm tracking-wide"
          title="Open interactive Cheers AI"
        >
          <span className="text-lg">🥂</span>
          <span>Cheers AI</span>
        </button>
      )}

    </div>
  );
};

export default SeatingPlannerSection;
