import fs from 'fs';

let content = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Update imports
const importTarget = `import { useAppState, showToast } from '../lib/state';
import { Table, TableShape, Guest } from '../lib/types';`;

const importReplacement = `import { useAppState, showToast, getStoredSession } from '../lib/state';
import { Table, TableShape, Guest, SavedSeatingArrangement, AuditLogEntry } from '../lib/types';`;

if (!content.includes(importTarget)) {
  console.error('Import target not found');
  process.exit(1);
}
content = content.replace(importTarget, importReplacement);

// 2. Update props interface
const propsTarget = `interface SeatingPlannerSectionProps {
  onSelectView?: (view: string) => void;
  isMobileCompact?: boolean;
  weddingId?: string;
}`;

const propsReplacement = `interface SeatingPlannerSectionProps {
  onSelectView?: (view: string) => void;
  isMobileCompact?: boolean;
  weddingId?: string;
  isMcView?: boolean;
}`;

if (!content.includes(propsTarget)) {
  console.error('Props target not found');
  process.exit(1);
}
content = content.replace(propsTarget, propsReplacement);

// 3. Update component declaration to accept isMcView
const compTarget = `export const SeatingPlannerSection: React.FC<SeatingPlannerSectionProps> = ({
  onSelectView,
  isMobileCompact = false,
  weddingId,
}) => {`;

const compReplacement = `export const SeatingPlannerSection: React.FC<SeatingPlannerSectionProps> = ({
  onSelectView,
  isMobileCompact = false,
  weddingId,
  isMcView = false,
}) => {`;

if (!content.includes(compTarget)) {
  console.error('Comp target not found');
  process.exit(1);
}
content = content.replace(compTarget, compReplacement);

// 4. Add saved arrangements state and handlers
const stateTarget = `  // Active table in Level 2
  const activeTable = useMemo(() => {`;

const stateReplacement = `  // ==============================================================
  // SAVED SEATING ARRANGEMENTS & AUDIT LOG SYNC (Couple <-> MC)
  // ==============================================================
  const savedArrangements: SavedSeatingArrangement[] = useMemo(() => {
    return (currentWedding as any)?.savedSeatingArrangements || [];
  }, [currentWedding]);

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

  const handleSaveArrangement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const session = getStoredSession();
    const effectiveIsMc = isMcView || session?.role === 'mc';
    const authorName = effectiveIsMc
      ? (session?.name || currentWedding?.selectedMc?.name || 'Robert Galati (MC)')
      : (session?.name || currentWedding?.couple || 'Sophie & James (Couple)');
    const authorRole: 'couple' | 'mc' = effectiveIsMc ? 'mc' : 'couple';

    const defaultName = \`Seating Arrangement \${savedArrangements.length + 1}\`;
    const finalName = newArrangementName.trim() || defaultName;

    const newArr: SavedSeatingArrangement = {
      id: \`arr_\${Date.now()}\`,
      weddingId: currentWeddingId,
      name: finalName,
      savedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      savedBy: authorName,
      role: authorRole,
      notes: newArrangementNotes.trim() || \`Floor plan snapshot with \${tables.length} tables and \${weddingGuests.filter(g => g.tableId).length} seated guests.\`,
      tables: tables.map(t => ({ ...t })),
      guestAssignments: weddingGuests.map(g => ({
        guestId: g.id,
        tableId: g.tableId || null,
        seatIndex: g.seatIndex || null,
      })),
    };

    const auditEntry: AuditLogEntry = {
      id: \`aud_\${Date.now()}\`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: 'Seating Arrangement Saved',
      user: authorName,
      role: authorRole,
      category: 'Seating',
      details: \`Saved seating layout "\${newArr.name}" with \${tables.length} tables and \${weddingGuests.filter(g => g.tableId).length} seated guests for \${currentWedding?.couple || 'Wedding'}. Synced between Couple & MC consoles.\`,
    };

    const updatedWeddings = (state.weddings || []).map((w) => {
      if (w.id === currentWeddingId) {
        const existing = (w as any).savedSeatingArrangements || [];
        return {
          ...w,
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
    showToast(\`Saved "\${newArr.name}"! Synced to both Couple & MC consoles.\`, 'success');
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

    // 3. Super Admin Audit Log
    const auditEntry: AuditLogEntry = {
      id: \`aud_\${Date.now()}\`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: 'Seating Arrangement Loaded',
      user: authorName,
      role: authorRole,
      category: 'Seating',
      details: \`Switched active layout to "\${arr.name}" (saved by \${arr.savedBy}) for \${currentWedding?.couple || 'Wedding'}.\`,
    };

    setState({
      ...state,
      tables: updatedTables,
      guests: updatedGuests,
      auditLog: [auditEntry, ...(state.auditLog || [])],
    });

    setActiveArrangementId(arr.id);
    setActiveArrangementName(arr.name);
    if (showCompareArrangementsModal) setShowCompareArrangementsModal(false);
    showToast(\`Activated "\${arr.name}" (Saved by \${arr.savedBy})\`, 'info');
  };

  // Active table in Level 2
  const activeTable = useMemo(() => {`;

if (!content.includes(stateTarget)) {
  console.error('State target not found');
  process.exit(1);
}
content = content.replace(stateTarget, stateReplacement);

// 5. Update canvas tables to render round shape as round icon/circle, rectangular as rectangle
const canvasTablesTarget = `{/* Draggable Tables on Canvas */}
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
                        left: \`\${tbl.x}%\`,
                        top: \`\${tbl.y}%\`,
                      }}
                      className={\`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl border-2 cursor-pointer transition-all shadow-md flex flex-col items-center justify-center text-center \${
                        tbl.shape === 'king'
                          ? 'min-w-[140px] bg-gradient-to-r from-[#1c1611] to-[#2b1f16] text-white border-[#bd9661]'
                          : isFull
                          ? 'bg-[#15110e] text-[#dfc194] border-[#bd9661]'
                          : isEmpty
                          ? 'bg-white text-[#15110e] border-[#d5c7b5]'
                          : 'bg-white text-[#15110e] border-[#bd9661] ring-2 ring-[#bd9661]/20'
                      } hover:scale-110 hover:shadow-xl\`}
                      title={\`Click to open Level 2 Table View for \${tbl.name}\`}
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
                })}`;

const canvasTablesReplacement = `{/* Draggable Tables on Canvas with Distinct Round / Rectangular Geometry & Shape Icons */}
                {filteredTables.map((tbl) => {
                  const seatedCount = state.guests.filter((g) => g.tableId === tbl.id).length;
                  const isFull = seatedCount >= tbl.capacity;
                  const isEmpty = seatedCount === 0;
                  const isRound = tbl.shape === 'round';
                  const isKing = tbl.shape === 'king' || tbl.isHead;

                  // Shape-specific card geometries
                  const shapeGeometryClass = isKing
                    ? 'min-w-[155px] sm:min-w-[170px] h-[78px] sm:h-[82px] rounded-xl px-4 py-2'
                    : isRound
                    ? 'w-[98px] h-[98px] sm:w-[106px] sm:h-[106px] rounded-full aspect-square p-2.5'
                    : 'min-w-[130px] sm:min-w-[145px] h-[72px] sm:h-[76px] rounded-lg px-3.5 py-1.5';

                  const shapeThemeClass = isKing
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
                        left: \`\${tbl.x}%\`,
                        top: \`\${tbl.y}%\`,
                      }}
                      className={\`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all shadow-md flex flex-col items-center justify-center text-center select-none \${shapeGeometryClass} \${shapeThemeClass} hover:scale-110 hover:shadow-xl\`}
                      title={\`Click to open Level 2 Table View for \${tbl.name} (\${tbl.shape} table)\`}
                    >
                      {/* Distinct Table Shape Icon (Circle for Round, Rect for Rectangular, Crown/King for Head) */}
                      <div className="flex items-center justify-center mb-0.5">
                        {isKing ? (
                          <svg width="18" height="11" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-90 shrink-0">
                            <rect x="1.5" y="2" width="21" height="12" rx="2.5" />
                            <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                            <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                          </svg>
                        ) : isRound ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-85 shrink-0">
                            <circle cx="12" cy="12" r="8.5" />
                            <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
                          </svg>
                        ) : (
                          <svg width="17" height="11" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-85 shrink-0">
                            <rect x="2" y="2" width="20" height="12" rx="2" />
                            <line x1="8" y1="2" x2="8" y2="14" strokeDasharray="1.5 2" />
                            <line x1="16" y1="2" x2="16" y2="14" strokeDasharray="1.5 2" />
                          </svg>
                        )}
                      </div>

                      <div className="text-[10px] font-bold font-serif leading-tight truncate max-w-[95%] px-1">
                        {tbl.name}
                      </div>
                      <div className="text-[11px] font-bold font-mono mt-0.5">
                        {seatedCount} / {tbl.capacity}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider opacity-75 mt-0.5">
                        {tbl.shape} &bull; {tbl.capacity - seatedCount} free
                      </div>
                    </div>
                  );
                })}`;

if (!content.includes(canvasTablesTarget)) {
  console.error('Canvas tables target not found');
  process.exit(1);
}
content = content.replace(canvasTablesTarget, canvasTablesReplacement);

// 6. Insert Saved Seating Arrangement Management Bar above Floor Plan controls filter bar
const filterBarTarget = `        <div className="space-y-4">
          {/* Floor Plan Controls Filter Bar */}
          <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">`;

const filterBarReplacement = `        <div className="space-y-4">
          {/* ============================================================== */}
          {/* SAVED SEATING ARRANGEMENT MANAGEMENT BAR (Couple & MC Sync)    */}
          {/* ============================================================== */}
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
                <div className="text-[11px] text-[#8b7b6b] flex items-center gap-1.5 mt-0.5">
                  <span>{savedArrangements.length} layouts saved</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span>✓</span> Synchronized to Couple &amp; MC consoles
                  </span>
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
                      {arr.name} ({arr.role === 'mc' ? 'MC' : 'Couple'} • {arr.savedAt})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                  setNewArrangementName(\`Seating Arrangement \${savedArrangements.length + 1}\`);
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
          <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">`;

if (!content.includes(filterBarTarget)) {
  console.error('Filter bar target not found');
  process.exit(1);
}
content = content.replace(filterBarTarget, filterBarReplacement);

// 7. Add Save Arrangement Modal and Compare Layouts Modal before MODAL: ADD NEW TABLE
const modalInsertTarget = `      {/* ============================================================== */}
      {/* MODAL: ADD NEW TABLE                                            */}
      {/* ============================================================== */}`;

const modalsContent = `      {/* ============================================================== */}
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
                    {isMcView ? 'Robert Galati (MC)' : \`\${currentWedding?.couple || 'Couple'} (Couple)\`}
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
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#e8ded0] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[85vh]"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {savedArrangements.map((arr) => {
                  const isActive = activeArrangementId === arr.id;
                  const roundCount = arr.tables.filter((t) => t.shape === 'round').length;
                  const rectCount = arr.tables.filter((t) => t.shape === 'rectangular').length;
                  const kingCount = arr.tables.filter((t) => t.shape === 'king' || t.isHead).length;
                  const seatedCount = arr.guestAssignments.filter((a) => a.tableId).length;

                  return (
                    <div
                      key={arr.id}
                      className={\`border-2 rounded-xl p-4 space-y-3 transition-all \${
                        isActive
                          ? 'border-[#bd9661] bg-[#faf8f5] shadow-sm ring-2 ring-[#bd9661]/20'
                          : 'border-[#e8ded0] bg-white hover:border-[#bd9661]/60'
                      }\`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-sm font-bold text-[#15110e]">
                              {arr.name}
                            </h4>
                            {isActive && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8b7b6b] mt-0.5">
                            Saved by <strong>{arr.savedBy}</strong> &bull; {arr.savedAt}
                          </div>
                        </div>

                        <span className={\`text-[9px] font-bold uppercase px-2 py-0.5 rounded \${
                          arr.role === 'mc'
                            ? 'bg-[#15110e] text-[#dfc194]'
                            : 'bg-[#faf0e1] text-[#7d5e38]'
                        }\`}>
                          {arr.role === 'mc' ? 'MC' : 'Couple'}
                        </span>
                      </div>

                      {arr.notes && (
                        <p className="text-[11px] text-[#554536] italic bg-white/70 p-2 rounded-lg border border-[#f0ede6]">
                          "{arr.notes}"
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        <div className="bg-[#fcfaf7] p-2 rounded-lg border border-[#f0ede6]">
                          <span className="text-[#8b7b6b] block text-[9.5px]">Table Geometry:</span>
                          <span className="font-semibold text-[#15110e]">
                            {roundCount} Round &bull; {rectCount} Rect &bull; {kingCount} King
                          </span>
                        </div>
                        <div className="bg-[#fcfaf7] p-2 rounded-lg border border-[#f0ede6]">
                          <span className="text-[#8b7b6b] block text-[9.5px]">Guest Seated:</span>
                          <span className="font-bold text-emerald-700">
                            {seatedCount} guests
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between">
                        {isActive ? (
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                            <span>✓</span> Currently Active Layout
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleLoadArrangement(arr.id)}
                            className="btn btn-gold btn-sm w-full cursor-pointer font-bold text-center"
                          >
                            Load This Arrangement &rarr;
                          </button>
                        )}
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
              <button
                type="button"
                onClick={() => setShowCompareArrangementsModal(false)}
                className="btn btn-outline btn-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW TABLE                                            */}
      {/* ============================================================== */}`;

if (!content.includes(modalInsertTarget)) {
  console.error('Modal insert target not found');
  process.exit(1);
}
content = content.replace(modalInsertTarget, modalsContent);

fs.writeFileSync('src/components/SeatingPlannerSection.tsx', content, 'utf8');
console.log('Successfully updated SeatingPlannerSection.tsx');
