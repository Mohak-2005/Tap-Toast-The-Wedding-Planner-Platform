const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/SeatingPlannerSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add zoomScale state
if (!content.includes('const [zoomScale, setZoomScale]')) {
  content = content.replace(
    `const [showAddTableModal, setShowAddTableModal] = useState<boolean>(false);`,
    `const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [showAddTableModal, setShowAddTableModal] = useState<boolean>(false);`
  );
}

// 2. Add Tablemate Visibility toggle in top toolbar
const oldToolbarButtons = `<div className="flex flex-wrap items-center gap-2">
          {/* Seed Tables Wizard */}
          <button
            type="button"
            onClick={() => setShowSeedTablesModal(true)}
            className="h-[34px] bg-white hover:bg-[#faf7f2] text-[#15110e] border border-[#d5c7b5] font-bold px-3 rounded-xl text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5 leading-none"
            title="Configure floor tables, shapes & AI seating rules based on guest list"
          >
            <span className="text-xs leading-none">🌱</span>
            <span>Seed Table</span>
          </button>`;

const newToolbarButtons = `<div className="flex flex-wrap items-center gap-2">
          {/* Couple Setting: Tablemate Visibility Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextVal = currentWedding?.allowGuestsSeeTablemates === false ? true : false;
              const updatedWeddings = (state.weddings || []).map((w) =>
                w.id === currentWeddingId ? { ...w, allowGuestsSeeTablemates: nextVal } : w
              );
              setState({ ...state, weddings: updatedWeddings });
              showToast(
                nextVal
                  ? '✓ Guests can now see their tablemates in mobile app'
                  : '🔒 Tablemates hidden from guests (privacy mode enabled)',
                'info'
              );
            }}
            className={\`h-[34px] border font-bold px-3 rounded-xl text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5 leading-none \${
              currentWedding?.allowGuestsSeeTablemates === false
                ? 'bg-[#2a1d13] text-[#dfc194] border-[#bd9661]'
                : 'bg-white hover:bg-[#faf7f2] text-[#15110e] border-[#d5c7b5]'
            }\`}
            title="Control whether guests can see their tablemates in the mobile guest hub"
          >
            <span>{currentWedding?.allowGuestsSeeTablemates === false ? '🔒' : '👥'}</span>
            <span>
              Tablemates: {currentWedding?.allowGuestsSeeTablemates === false ? 'Private (Hidden)' : 'Visible'}
            </span>
          </button>

          {/* Seed Tables Wizard */}
          <button
            type="button"
            onClick={() => setShowSeedTablesModal(true)}
            className="h-[34px] bg-white hover:bg-[#faf7f2] text-[#15110e] border border-[#d5c7b5] font-bold px-3 rounded-xl text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5 leading-none"
            title="Configure floor tables, shapes & AI seating rules based on guest list"
          >
            <span className="text-xs leading-none">🌱</span>
            <span>Seed Table</span>
          </button>`;

if (!content.includes('allowGuestsSeeTablemates === false')) {
  content = content.replace(oldToolbarButtons, newToolbarButtons);
}

// 3. Update handleTableCanvasDrop to account for zoomScale
const oldCanvasDrop = `    if (isDraggingDanceFloor || dragType === 'dancefloor') {
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
    const clampedY = Math.max(10, Math.min(85, relY));`;

const newCanvasDrop = `    const centerX = containerRect.left + containerRect.width / 2;
    const unscaledX = centerX + (e.clientX - centerX) / zoomScale;
    const unscaledY = containerRect.top + (e.clientY - containerRect.top) / zoomScale;

    if (isDraggingDanceFloor || dragType === 'dancefloor') {
      const relX = Math.round(((unscaledX - containerRect.left) / containerRect.width) * 100);
      const relY = Math.round(((unscaledY - containerRect.top) / containerRect.height) * 100);

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

    const relX = Math.round(((unscaledX - containerRect.left) / containerRect.width) * 100);
    const relY = Math.round(((unscaledY - containerRect.top) / containerRect.height) * 100);

    const clampedX = Math.max(5, Math.min(90, relX));
    const clampedY = Math.max(10, Math.min(85, relY));`;

content = content.replace(oldCanvasDrop, newCanvasDrop);

// 4. Update touch moves to account for zoomScale
const oldTouchDF = `    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;`;

const newTouchDF = `    const centerX = rect.left + rect.width / 2;
    const unscaledX = centerX + (touch.clientX - centerX) / zoomScale;
    const unscaledY = rect.top + (touch.clientY - rect.top) / zoomScale;
    const relX = ((unscaledX - rect.left) / rect.width) * 100;
    const relY = ((unscaledY - rect.top) / rect.height) * 100;`;

content = content.replace(oldTouchDF, newTouchDF);
content = content.replace(oldTouchDF, newTouchDF); // Second occurrence for table touch move

// 5. Update shape selector in Table Detail modal
const oldShapeSelector = `{(['round', 'rectangular'] as TableShape[]).map((shp) => (`;
const newShapeSelector = `{(['round', 'oval', 'rectangular'] as TableShape[]).map((shp) => (`;
content = content.replace(oldShapeSelector, newShapeSelector);

// 6. Add OVAL visualization in Table Detail modal
const oldRoundViz = `{/* ROUND TABLE VISUALIZATION */}
              {activeTable.shape === 'round' && (`;

const newOvalViz = `{/* OVAL TABLE VISUALIZATION */}
              {activeTable.shape === 'oval' && (
                <div className="relative w-[380px] h-[330px] flex items-center justify-center">
                  {/* Outer ellipse perimeter line */}
                  <div
                    className="absolute border-2 border-dashed border-[#bd9661]/40 pointer-events-none rounded-[190px/140px]"
                    style={{ width: '350px', height: '270px' }}
                  />

                  {/* Center table surface */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverTarget({ type: 'table', tableId: activeTable.id });
                    }}
                    onDragLeave={() => setDragOverTarget(null)}
                    onDrop={(e) => handleDropOnTable(e, activeTable.id)}
                    className={\`w-[180px] h-[115px] rounded-[55px/32px] bg-white border-2 shadow-lg flex flex-col items-center justify-center text-center z-10 p-3 select-none transition-all cursor-pointer \${
                      dragOverTarget?.type === 'table' && dragOverTarget?.tableId === activeTable.id
                        ? 'border-[#bd9661] ring-4 ring-[#bd9661]/40 bg-[#faf5ee] scale-105 shadow-xl'
                        : 'border-[#bd9661]'
                    }\`}
                    title="Drop any guest here to seat at next vacant place"
                  >
                    <span className="font-serif text-sm font-bold text-[#15110e]">{(activeTable.name || '').replace(/\\s*\\([^)]*\\)/g, '').trim()}</span>
                    <span className="text-[10px] uppercase font-bold text-[#8b7b6b] tracking-wider mt-0.5">Oval Banquet</span>
                    <span className="text-xs font-bold font-mono text-[#bd9661] mt-0.5">
                      {guestsAtActiveTable.length} / {activeTable.capacity}
                    </span>
                  </div>

                  {/* Radial seats around ellipse */}
                  {Array.from({ length: activeTable.capacity }).map((_, sIdx) => {
                    const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                    const angle = sIdx * (360 / activeTable.capacity);
                    const rad = ((angle - 90) * Math.PI) / 180;
                    const rx = 150;
                    const ry = 110;
                    const x = rx * Math.cos(rad);
                    const y = ry * Math.sin(rad);
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
                        style={{ transform: \`translate(\${x}px, \${y}px)\` }}
                        className={\`absolute w-11 h-11 rounded-full flex flex-col items-center justify-center text-center z-20 transition-all select-none shadow-md cursor-pointer \${
                          isOver
                            ? 'bg-[#bd9661] text-white border-2 border-white scale-125 ring-4 ring-[#bd9661]/50 z-30 shadow-xl'
                            : occupant
                            ? 'bg-[#15110e] border-2 border-[#bd9661] text-[#dfc194] cursor-grab active:cursor-grabbing hover:scale-110'
                            : draggedGuestId
                            ? 'bg-amber-50 border-2 border-dashed border-[#bd9661] text-[#bd9661] animate-pulse hover:bg-[#faf5ee]'
                            : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf5ee]'
                        }\`}
                        title={
                          occupant
                            ? \`\${occupant.name} (\${occupant.dietary || 'Standard'}) - Drag to move or swap seat\`
                            : \`Seat #\${sIdx + 1} (Empty) - Drop guest here\`
                        }
                      >
                        {occupant ? (
                          <>
                            <span className="text-[10px] font-bold leading-none">{occupant.initials || occupant.name.slice(0, 2).toUpperCase()}</span>
                            <span className="text-[7.5px] font-mono opacity-80 mt-0.5">#{sIdx + 1}</span>
                          </>
                        ) : (
                          <span className="text-[9px] font-bold">#{sIdx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ROUND TABLE VISUALIZATION */}
              {activeTable.shape === 'round' && (`;

if (!content.includes('OVAL TABLE VISUALIZATION')) {
  content = content.replace(oldRoundViz, newOvalViz);
}

// 7. Update canvas table geometry for oval tables
const oldShapeGeom = `                  const isRound = tbl.shape === 'round';
                  const isKing = tbl.shape === 'king';
                  const isRect = tbl.shape === 'rectangular';

                  // Shape-specific card geometries
                  const shapeGeometryClass = isKing
                    ? 'min-w-[155px] sm:min-w-[170px] h-[78px] sm:h-[82px] rounded-xl px-4 py-2'
                    : isRound
                    ? 'w-[98px] h-[98px] sm:w-[106px] sm:h-[106px] rounded-full aspect-square p-2.5'
                    : 'min-w-[130px] sm:min-w-[145px] h-[72px] sm:h-[76px] rounded-lg px-3.5 py-1.5';`;

const newShapeGeom = `                  const isRound = tbl.shape === 'round';
                  const isKing = tbl.shape === 'king';
                  const isRect = tbl.shape === 'rectangular';
                  const isOval = tbl.shape === 'oval';

                  // Shape-specific card geometries
                  const shapeGeometryClass = isKing
                    ? 'min-w-[155px] sm:min-w-[170px] h-[78px] sm:h-[82px] rounded-xl px-4 py-2'
                    : isRound
                    ? 'w-[98px] h-[98px] sm:w-[106px] sm:h-[106px] rounded-full aspect-square p-2.5'
                    : isOval
                    ? 'min-w-[145px] sm:min-w-[160px] h-[78px] sm:h-[84px] rounded-[48px/28px] px-4 py-2'
                    : 'min-w-[130px] sm:min-w-[145px] h-[72px] sm:h-[76px] rounded-lg px-3.5 py-1.5';`;

content = content.replace(oldShapeGeom, newShapeGeom);

// 8. Add option in Add Table modal
const oldAddOptions = `<option value="round">Round Banquet</option>
                    <option value="rectangular">Rectangular Table</option>`;

const newAddOptions = `<option value="round">Round Banquet</option>
                    <option value="oval">Oval Banquet Table</option>
                    <option value="rectangular">Rectangular Table</option>`;

if (!content.includes('<option value="oval">')) {
  content = content.replace(oldAddOptions, newAddOptions);
}

// 9. Floating Zoom Toolbar inside room_canvas_container
const oldCanvasContainerStart = `<div
                id="room_canvas_container"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const el = document.getElementById('room_canvas_container');
                  if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
                }}
                className={\`bg-[#faf8f5] border-2 border-[#e8ded0] rounded-2xl md:rounded-3xl \${isMobileCompact ? 'p-3 min-h-[460px]' : 'p-6 min-h-[660px]'} relative shadow-inner overflow-hidden select-none\`}
                style={{
                  backgroundImage: 'radial-gradient(#d5c7b5 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              >`;

const newCanvasContainerStart = `<div
                id="room_canvas_container"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const el = document.getElementById('room_canvas_container');
                  if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
                }}
                className={\`bg-[#faf8f5] border-2 border-[#e8ded0] rounded-2xl md:rounded-3xl \${isMobileCompact ? 'p-3 min-h-[460px]' : 'p-6 min-h-[660px]'} relative shadow-inner overflow-hidden select-none\`}
                style={{
                  backgroundImage: 'radial-gradient(#d5c7b5 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Floating Zoom In & Out Controls */}
                <div className="absolute top-3 left-4 z-20 bg-white/95 backdrop-blur-xs border border-[#d5c7b5] rounded-2xl shadow-lg p-1.5 flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomScale((prev) => Math.max(0.55, Math.round((prev - 0.15) * 100) / 100))}
                    className="w-7 h-7 rounded-xl hover:bg-[#faf6ee] text-[#15110e] font-bold flex items-center justify-center cursor-pointer transition-colors border border-transparent hover:border-[#bd9661]"
                    title="Zoom Out"
                  >
                    &minus;
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-xs text-[#15110e] select-none">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomScale((prev) => Math.min(1.45, Math.round((prev + 0.15) * 100) / 100))}
                    className="w-7 h-7 rounded-xl hover:bg-[#faf6ee] text-[#15110e] font-bold flex items-center justify-center cursor-pointer transition-colors border border-transparent hover:border-[#bd9661]"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <div className="h-4 w-px bg-[#e8ded0] mx-0.5" />
                  <button
                    type="button"
                    onClick={() => setZoomScale(0.65)}
                    className={\`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors \${
                      Math.abs(zoomScale - 0.65) < 0.05
                        ? 'bg-[#15110e] text-[#dfc194]'
                        : 'text-[#6b5847] hover:bg-[#faf6ee]'
                    }\`}
                    title="Bird's-eye overall view of floor plan"
                  >
                    Overall (65%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(1.0)}
                    className={\`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors \${
                      Math.abs(zoomScale - 1.0) < 0.05
                        ? 'bg-[#15110e] text-[#dfc194]'
                        : 'text-[#6b5847] hover:bg-[#faf6ee]'
                    }\`}
                    title="Reset to 100%"
                  >
                    100%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(1.35)}
                    className={\`px-2 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors \${
                      Math.abs(zoomScale - 1.35) < 0.05
                        ? 'bg-[#15110e] text-[#dfc194]'
                        : 'text-[#6b5847] hover:bg-[#faf6ee]'
                    }\`}
                    title="Detailed close-up view"
                  >
                    Detailed (135%)
                  </button>
                </div>

                <div
                  id="room_canvas_inner_board"
                  style={{
                    transform: \`scale(\${zoomScale})\`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
                    width: '100%',
                    minHeight: isMobileCompact ? '460px' : '660px',
                    position: 'relative',
                  }}
                >`;

if (!content.includes('id="room_canvas_inner_board"')) {
  content = content.replace(oldCanvasContainerStart, newCanvasContainerStart);
  // Also close the inner board div before the room_canvas_container closes!
  // The room_canvas_container closes right before {/* RIGHT SIDE: UNALLOCATED GUESTS & FAMILIES PANEL */}
  const canvasCloseTarget = `                })}
              </div>
            </div>

            {/* RIGHT SIDE: UNALLOCATED GUESTS & FAMILIES PANEL */}`;

  const newCanvasClose = `                })}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: UNALLOCATED GUESTS & FAMILIES PANEL */}`;
  content = content.replace(canvasCloseTarget, newCanvasClose);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SeatingPlannerSection.tsx!');
