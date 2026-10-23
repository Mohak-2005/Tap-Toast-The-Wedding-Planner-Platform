import React, { useState, useMemo } from 'react';
import { useAppState, showToast } from '../lib/state';
import { Table, TableShape, Guest } from '../lib/types';

interface SeatingPlannerSectionProps {
  onSelectView?: (view: string) => void;
  isMobileCompact?: boolean;
  weddingId?: string;
}

export const SeatingPlannerSection: React.FC<SeatingPlannerSectionProps> = ({
  onSelectView,
  isMobileCompact = false,
  weddingId,
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

  // Modals & Panels
  const [showAddTableModal, setShowAddTableModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showCheersAiModal, setShowCheersAiModal] = useState<boolean>(false);
  const [aiProposal, setAiProposal] = useState<{ title: string; desc: string; count: number; changes: { guestId: string; tableId: string }[] } | null>(null);
  const [activeAiScenario, setActiveAiScenario] = useState<'households' | 'vips' | 'dietary' | 'fill'>('households');

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
      return { ...tbl, weddingId: currentWeddingId, shape, capacity, x, y, category, zone };
    });
  }, [state.tables, currentWeddingId]);

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

  // Assign a guest to a specific table & seat
  const handleAssignGuest = (guestId: string, tableId: string, seatIndex?: number) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable) return;

    const currentSeated = state.guests.filter((g) => g.tableId === tableId);
    if (currentSeated.length >= targetTable.capacity) {
      showToast(`${targetTable.name} is already full (${targetTable.capacity}/${targetTable.capacity} seats occupied)`, 'error');
      return;
    }

    let targetSeat = seatIndex !== undefined ? seatIndex : -1;
    if (targetSeat < 0 || currentSeated.some((g) => g.seatIndex === targetSeat)) {
      // Find first vacant seat index
      for (let i = 0; i < targetTable.capacity; i++) {
        if (!currentSeated.some((g) => g.seatIndex === i)) {
          targetSeat = i;
          break;
        }
      }
    }

    const updated = state.guests.map((g) => (g.id === guestId ? { ...g, tableId, seatIndex: targetSeat } : g));
    setState({ ...state, guests: updated });
    const guestObj = state.guests.find((g) => g.id === guestId);
    showToast(`Seated ${guestObj?.name || 'Guest'} at ${targetTable.name} (Seat ${targetSeat + 1})`, 'success');
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
    const guestId = e.dataTransfer.getData('text/plain') || draggedGuestId;
    if (guestId) {
      handleAssignGuest(guestId, tableId);
    }
    setDragOverTarget(null);
  };

  const handleDropOnSeat = (e: React.DragEvent, tableId: string, seatIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const guestId = e.dataTransfer.getData('text/plain') || draggedGuestId;
    if (guestId) {
      handleAssignGuest(guestId, tableId, seatIndex);
    }
    setDragOverTarget(null);
  };

  // Dragging table position on canvas
  const handleTableCanvasDrop = (e: React.DragEvent, containerRect: DOMRect) => {
    e.preventDefault();
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
      { id: 'head', name: 'HEAD TABLE (Bridal Party)', capacity: 8, isHead: true, shape: 'king', x: 50, y: 12, category: 'Bridal Party', zone: 'Stage & VIP Wing' },
      // King Table A & B (large banquets accommodating 32 guests each)
      { id: 'king_a', name: 'King Table A (Banquet)', capacity: 32, isHead: false, shape: 'king', x: 25, y: 78, category: 'Family', zone: 'North Wing' },
      { id: 'king_b', name: 'King Table B (Banquet)', capacity: 32, isHead: false, shape: 'king', x: 75, y: 78, category: 'Family', zone: 'South Wing' },
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
        name: `Table ${i} (${cat})`,
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
          {/* Cheers AI Assistance */}
          <button
            type="button"
            onClick={() => handleRunCheersAiSeating('households')}
            className="bg-gradient-to-r from-[#dfc194] via-[#bd9661] to-[#916c3d] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
            title="Get intelligent seating suggestions based on households & VIP preferences"
          >
            <span>✨</span>
            <span>Cheers AI Assist</span>
          </button>



          {/* Add Table */}
          <button
            type="button"
            onClick={() => setShowAddTableModal(true)}
            className="bg-white hover:bg-[#faf7f2] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1"
          >
            <span>+</span> Add Table
          </button>

          {/* Export & Print */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="bg-[#251b14] hover:bg-[#382b20] text-white border border-[#4a3a2d] font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <span>🖨️</span> Export
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
                onClick={() => setSelectedTableId(null)}
                className="bg-[#15110e] hover:bg-[#2b1f16] text-[#dfc194] font-bold px-4 py-2.5 rounded-2xl text-xs cursor-pointer transition-all flex items-center gap-2 shadow-md"
              >
                <span>&larr;</span> Return to Overall Room Layout
              </button>

              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661]">
                  LEVEL 2 &bull; INDIVIDUAL TABLE DETAIL
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="font-serif text-2xl font-bold text-[#15110e]">
                    {activeTable.name}
                  </h3>
                  <span className="bg-[#faf5ed] border border-[#bd9661]/50 text-[#916c3d] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {activeTable.shape} &bull; {activeTable.category || 'General'}
                  </span>
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activeTable.name}
                  onChange={(e) => handleUpdateTableDetails(activeTable.id, { name: e.target.value })}
                  className="bg-white border border-[#e8ded0] rounded-xl px-3 py-1.5 font-serif font-bold text-sm text-[#15110e] outline-none focus:border-[#bd9661] w-full max-w-xs shadow-2xs"
                  placeholder="e.g. Table 1 (Family)"
                />
              </div>
              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-[#8b7b6b]">Suggestions:</span>
                {['Family', 'School Friends', 'Paris', 'Rose Garden', 'Colleagues', 'VIP', 'Friends'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const prefix = activeTable.name.split('(')[0].trim() || 'Table';
                      handleUpdateTableDetails(activeTable.id, {
                        name: `${prefix} (${tag})`,
                        category: tag,
                      });
                    }}
                    className="bg-white hover:bg-[#faf5ee] border border-[#d5c7b5] text-[#15110e] px-2 py-0.5 rounded-full text-[10px] cursor-pointer transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Segmented Control */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                Table Shape
              </label>
              <div className="flex bg-white border border-[#e8ded0] rounded-xl p-1 shadow-2xs">
                {(['round', 'rectangular', 'king'] as TableShape[]).map((shp) => (
                  <button
                    key={shp}
                    type="button"
                    onClick={() => handleUpdateTableDetails(activeTable.id, { shape: shp })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer transition-colors ${
                      activeTable.shape === shp
                        ? 'bg-[#15110e] text-[#dfc194]'
                        : 'text-[#8b7b6b] hover:text-[#15110e]'
                    }`}
                  >
                    {shp === 'king' ? '👑 King Banquet' : shp}
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
            <div className="lg:col-span-7 bg-[#faf8f5] border border-[#e8ded0] rounded-2xl p-6 min-h-[460px] flex flex-col items-center justify-center relative shadow-inner">
              <div className="text-[11px] text-[#8b7b6b] mb-4 bg-white border border-[#e8ded0] px-3 py-1 rounded-full shadow-2xs">
                💡 Drag guests to rearrange seats, click &times; to unseat, or drop from unassigned list.
              </div>

              {/* ROUND TABLE VISUALIZATION */}
              {activeTable.shape === 'round' && (
                <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                  {/* Outer circle perimeter line */}
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#bd9661]/40" />

                  {/* Center table surface */}
                  <div className="w-[150px] h-[150px] rounded-full bg-white border-2 border-[#bd9661] shadow-lg flex flex-col items-center justify-center text-center z-10 p-3 select-none">
                    <span className="font-serif text-sm font-bold text-[#15110e]">{activeTable.name}</span>
                    <span className="text-xs font-bold text-[#bd9661] mt-0.5">
                      {guestsAtActiveTable.length} / {activeTable.capacity}
                    </span>
                    <span className="text-[9.5px] text-[#8b7b6b] uppercase tracking-wider mt-0.5">
                      {activeTable.shape}
                    </span>
                  </div>

                  {/* Radial seats */}
                  {Array.from({ length: activeTable.capacity }).map((_, sIdx) => {
                    const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                    const angle = sIdx * (360 / activeTable.capacity);
                    const radius = 130;
                    const rad = ((angle - 90) * Math.PI) / 180;
                    const x = radius * Math.cos(rad);
                    const y = radius * Math.sin(rad);

                    return (
                      <div
                        key={sIdx}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                        }}
                        onDragLeave={() => setDragOverTarget(null)}
                        onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                        className={`absolute w-12 h-12 rounded-full flex flex-col items-center justify-center text-center z-20 transition-all select-none shadow-md ${
                          occupant
                            ? 'bg-[#15110e] border-2 border-[#bd9661] text-[#dfc194] cursor-grab hover:scale-110'
                            : dragOverTarget?.seatIndex === sIdx
                            ? 'bg-[#bd9661] text-white border-2 border-white scale-125'
                            : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf5ee] cursor-pointer'
                        }`}
                        title={occupant ? `${occupant.name} (${occupant.dietary || 'Standard'})` : `Seat ${sIdx + 1} (Empty)`}
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

              {/* RECTANGULAR TABLE VISUALIZATION */}
              {activeTable.shape === 'rectangular' && (
                <div className="relative w-full max-w-[480px] p-8 flex flex-col items-center">
                  <div className="w-[320px] h-[120px] rounded-2xl bg-white border-2 border-[#bd9661] shadow-lg flex flex-col items-center justify-center text-center z-10 select-none">
                    <span className="font-serif text-base font-bold text-[#15110e]">{activeTable.name}</span>
                    <span className="text-xs font-bold text-[#bd9661]">
                      {guestsAtActiveTable.length} / {activeTable.capacity} Seated
                    </span>
                    <span className="text-[10px] text-[#8b7b6b] uppercase tracking-wider">Rectangular Table</span>
                  </div>

                  {/* Top & Bottom Seat rows */}
                  <div className="flex justify-between w-[320px] -mt-16 mb-4 z-20">
                    {Array.from({ length: Math.ceil(activeTable.capacity / 2) }).map((_, sIdx) => {
                      const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                      return (
                        <div
                          key={sIdx}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                          }}
                          onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                          className={`w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-md text-xs font-bold ${
                            occupant ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661]' : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661]'
                          }`}
                        >
                          {occupant ? occupant.initials || occupant.name.slice(0, 2) : `#${sIdx + 1}`}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between w-[320px] mt-16 z-20">
                    {Array.from({ length: Math.floor(activeTable.capacity / 2) }).map((_, idx) => {
                      const sIdx = Math.ceil(activeTable.capacity / 2) + idx;
                      const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                      return (
                        <div
                          key={sIdx}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                          }}
                          onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                          className={`w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-md text-xs font-bold ${
                            occupant ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661]' : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661]'
                          }`}
                        >
                          {occupant ? occupant.initials || occupant.name.slice(0, 2) : `#${sIdx + 1}`}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* KING / LONG BANQUET TABLE VISUALIZATION (30-40 SEATS) */}
              {activeTable.shape === 'king' && (
                <div className="w-full space-y-4">
                  <div className="bg-[#15110e] text-white p-3 rounded-xl border border-[#bd9661] text-center shadow-md flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#dfc194] flex items-center gap-1.5">
                      <span>👑</span> {activeTable.name} &bull; Long King Banquet Table ({activeTable.capacity} Seats)
                    </span>
                    <span className="text-xs text-[#d9cbb8]">
                      {guestsAtActiveTable.length} of {activeTable.capacity} places filled
                    </span>
                  </div>

                  <div className="overflow-x-auto p-4 bg-white border border-[#e8ded0] rounded-2xl shadow-inner">
                    <div className="min-w-[680px] space-y-3">
                      {/* Top Row Seats */}
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: Math.ceil(activeTable.capacity / 2) }).map((_, sIdx) => {
                          const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                          return (
                            <div
                              key={sIdx}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                              }}
                              onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                              className={`flex-1 min-w-[36px] h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer ${
                                occupant ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]' : 'bg-[#faf8f5] border border-dashed border-[#bd9661]/50 text-[#8b7b6b]'
                              }`}
                              title={occupant ? `${occupant.name} (#${sIdx + 1})` : `Seat #${sIdx + 1} (Empty)`}
                            >
                              <span>{occupant ? occupant.initials || occupant.name.slice(0, 2) : `#${sIdx + 1}`}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Long Wooden Table Board */}
                      <div className="h-10 rounded-xl bg-gradient-to-r from-[#291f17] via-[#3d2e24] to-[#291f17] border-2 border-[#bd9661] text-white flex items-center justify-center text-xs font-serif font-bold tracking-widest shadow-md">
                        ROYAL BANQUET RUNNER &bull; {activeTable.capacity} PLACES
                      </div>

                      {/* Bottom Row Seats */}
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: Math.floor(activeTable.capacity / 2) }).map((_, idx) => {
                          const sIdx = Math.ceil(activeTable.capacity / 2) + idx;
                          const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                          return (
                            <div
                              key={sIdx}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverTarget({ type: 'seat', tableId: activeTable.id, seatIndex: sIdx });
                              }}
                              onDrop={(e) => handleDropOnSeat(e, activeTable.id, sIdx)}
                              className={`flex-1 min-w-[36px] h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer ${
                                occupant ? 'bg-[#15110e] text-[#dfc194] border border-[#bd9661]' : 'bg-[#faf8f5] border border-dashed border-[#bd9661]/50 text-[#8b7b6b]'
                              }`}
                              title={occupant ? `${occupant.name} (#${sIdx + 1})` : `Seat #${sIdx + 1} (Empty)`}
                            >
                              <span>{occupant ? occupant.initials || occupant.name.slice(0, 2) : `#${sIdx + 1}`}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table Roster & Seat Assignment List (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#15110e]">
                    Assigned Guests ({guestsAtActiveTable.length})
                  </h4>
                  <p className="text-[11px] text-[#8b7b6b]">
                    Manage individual seat allocations &amp; dietary notes
                  </p>
                </div>

                {/* Edit Capacity Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[#8b7b6b]">Seats:</span>
                  <select
                    value={activeTable.capacity}
                    onChange={(e) => handleUpdateTableDetails(activeTable.id, { capacity: Number(e.target.value) })}
                    className="bg-[#faf8f5] border border-[#e8ded0] rounded-lg px-2 py-1 text-xs font-bold text-[#15110e] outline-none"
                  >
                    {[6, 8, 10, 12, 16, 20, 24, 30, 32, 40].map((num) => (
                      <option key={num} value={num}>
                        {num} Seats
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seated Guests List */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {guestsAtActiveTable.length === 0 ? (
                  <div className="bg-[#faf8f5] border border-dashed border-[#e8ded0] rounded-xl p-6 text-center text-xs text-[#8b7b6b]">
                    No guests currently seated at this table. Drag guests from below or use Quick Assign.
                  </div>
                ) : (
                  guestsAtActiveTable.map((g) => (
                    <div
                      key={g.id}
                      draggable
                      onDragStart={(e) => handleGuestDragStart(e, g.id)}
                      onDragEnd={handleGuestDragEnd}
                      className="bg-[#faf8f5] hover:bg-[#f5f0e6] border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between text-xs transition-colors cursor-grab"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#15110e] text-[#dfc194] font-bold text-[10px] flex items-center justify-center">
                          {g.initials || g.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-bold text-[#15110e] flex items-center gap-1.5">
                            <span>{g.name}</span>
                            <span className="text-[10px] font-mono text-[#bd9661] bg-white border px-1 rounded">
                              Seat {(g.seatIndex || 0) + 1}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8b7b6b] flex items-center gap-1.5 mt-0.5">
                            <span>{g.household}</span>
                            {g.dietary && g.dietary !== 'None' && (
                              <span className="bg-[#fff1f0] text-[#c93b2b] px-1 rounded font-semibold text-[9px]">
                                {g.dietary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUnseatGuest(g.id)}
                        className="text-[#8b7b6b] hover:text-[#c93b2b] text-base p-1 cursor-pointer"
                        title="Unseat guest"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Assign Household Dropdown */}
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
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    Seat All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* LEVEL 1: OVERALL FLOOR PLAN & ROOM LAYOUT                      */
        /* ============================================================== */
        <div className="space-y-4">
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

          {/* MAIN ROOM & UNALLOCATED GUESTS SIDE-BY-SIDE SPLIT */}
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

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-36 rounded-3xl border-2 border-dashed border-[#bd9661]/40 bg-[#bd9661]/5 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl">💃</span>
                  <span className="font-serif text-xs font-bold text-[#8b7b6b] uppercase tracking-wider">
                    Main Dance Floor
                  </span>
                </div>

                <div className="absolute bottom-3 left-8 bg-white/90 border border-[#e8ded0] px-4 py-1.5 rounded-xl text-[10px] font-bold text-[#8b7b6b] shadow-xs">
                  🍸 Main Bar &amp; Lounge
                </div>

                <div className="absolute bottom-3 right-8 bg-white/90 border border-[#e8ded0] px-4 py-1.5 rounded-xl text-[10px] font-bold text-[#8b7b6b] shadow-xs">
                  🌿 Garden Verandah Access
                </div>

                {/* Draggable Tables on Canvas */}
                {filteredTables.map((tbl) => {
                  const seatedCount = state.guests.filter((g) => g.tableId === tbl.id).length;
                  const isFull = seatedCount >= tbl.capacity;
                  const isEmpty = seatedCount === 0;

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
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl border-2 cursor-pointer transition-all shadow-md flex flex-col items-center justify-center text-center ${
                        tbl.shape === 'king'
                          ? 'min-w-[140px] bg-gradient-to-r from-[#1c1611] to-[#2b1f16] text-white border-[#bd9661]'
                          : isFull
                          ? 'bg-[#15110e] text-[#dfc194] border-[#bd9661]'
                          : isEmpty
                          ? 'bg-white text-[#15110e] border-[#d5c7b5]'
                          : 'bg-white text-[#15110e] border-[#bd9661] ring-2 ring-[#bd9661]/20'
                      } hover:scale-110 hover:shadow-xl`}
                      title={`Click to open Level 2 Table View for ${tbl.name}`}
                    >
                      <div className="text-[10px] font-bold font-serif leading-tight">
                        {tbl.name}
                      </div>
                      <div className="text-[11px] font-bold font-mono mt-0.5">
                        {seatedCount} / {tbl.capacity}
                      </div>
                      <div className="text-[8.5px] uppercase tracking-wider opacity-75 mt-0.5">
                        {tbl.shape} &bull; {tbl.capacity - seatedCount} free
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
                    <div className="flex items-center gap-2">
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
      {/* MODAL: CHEERS AI ASSISTANCE SUGGESTIONS                        */}
      {/* ============================================================== */}
      {showCheersAiModal && aiProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ebd3a8] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#15110e]">
                    Cheers AI Seating Recommendation
                  </h3>
                  <div className="text-[11px] text-[#bd9661] font-semibold">{aiProposal.title}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCheersAiModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Strategy Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#ebd3a8]">
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
                  className={`px-2 py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all flex items-center justify-center gap-1 ${
                    activeAiScenario === st.id
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                      : 'text-[#8b7b6b] hover:text-[#15110e] hover:bg-white'
                  }`}
                >
                  <span>{st.icon}</span>
                  <span>{st.label}</span>
                </button>
              ))}
            </div>

            <p className="text-xs text-[#5a4d41] leading-relaxed">
              {aiProposal.desc}
            </p>

            <div className="bg-[#faf5ee] border border-[#ebd3a8] rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-[#15110e] flex items-center justify-between">
                <span>Proposed Allocations</span>
                <span className="bg-[#bd9661] text-[#15110e] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {aiProposal.count} Guests
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {aiProposal.changes.map(({ guestId, tableId }, i) => {
                  const g = state.guests.find((x) => x.id === guestId);
                  const t = tables.find((x) => x.id === tableId);
                  return (
                    <div key={i} className="bg-white border border-[#e8ded0] p-2 rounded-lg flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#15110e]">{g?.name || 'Guest'}</span>
                      <span className="text-[#8b7b6b]">&rarr;</span>
                      <span className="font-bold text-[#bd9661]">{t?.name || 'Table'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] text-[#8b7b6b] italic">
              AI recommendations are suggestions only. You can modify or override any table or seat assignment afterwards.
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCheersAiModal(false)}
                className="flex-1 bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleApplyAiProposal}
                className="flex-1 bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] font-bold py-2.5 rounded-xl cursor-pointer shadow-md hover:brightness-110"
              >
                Apply Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
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
    </div>
  );
};

export default SeatingPlannerSection;
