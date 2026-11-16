const fs = require('fs');

let content = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');

// 1. Update filter bar to include Tablemates toggle & Zoom toolbar
const filterTarget = `              {/* Category Filter */}
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


          </div>`;

const filterReplacement = `              {/* Category Filter */}
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

            {/* Right side: Tablemates visibility toggle & Zoom toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const currentVal = currentWedding?.allowGuestsSeeTablemates !== false;
                  const nextVal = !currentVal;
                  const updatedWeddings = (state.weddings || []).map((w: any) =>
                    w.id === currentWeddingId ? { ...w, allowGuestsSeeTablemates: nextVal } : w
                  );
                  setState({ ...state, weddings: updatedWeddings });
                  showToast(
                    nextVal
                      ? '✓ Tablemates visible to guests'
                      : '🔒 Tablemates kept private (guests only see their table number)',
                    'info'
                  );
                }}
                className={\`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors flex items-center gap-1.5 cursor-pointer \${
                  currentWedding?.allowGuestsSeeTablemates !== false
                    ? 'bg-[#faf8f5] text-[#15110e] border-[#d5c7b5] hover:bg-[#ede5d8]'
                    : 'bg-[#15110e] text-[#dfc194] border-[#bd9661]'
                }\`}
                title="Toggle whether guests can see fellow tablemates in their mobile app"
              >
                <span>👥 Tablemates:</span>
                <span className="font-semibold underline">
                  {currentWedding?.allowGuestsSeeTablemates !== false ? 'Visible' : 'Private (Hidden)'}
                </span>
              </button>

              {/* Canvas Zoom Toolbar */}
              <div className="flex items-center bg-[#faf8f5] border border-[#d5c7b5] rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.max(0.55, Number((prev - 0.15).toFixed(2))))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-sm text-[#15110e] hover:bg-white rounded-lg cursor-pointer"
                  title="Zoom Out"
                >
                  &minus;
                </button>
                <span className="text-[11px] font-mono font-bold px-1 text-[#15110e]">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.min(1.45, Number((prev + 0.15).toFixed(2))))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-sm text-[#15110e] hover:bg-white rounded-lg cursor-pointer"
                  title="Zoom In"
                >
                  &#43;
                </button>
                <div className="w-px h-4 bg-[#d5c7b5] mx-0.5" />
                <button
                  type="button"
                  onClick={() => setZoomScale(0.65)}
                  className={\`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-colors \${
                    zoomScale === 0.65 ? 'bg-[#15110e] text-[#dfc194]' : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }\`}
                  title="Overall Bird's Eye View"
                >
                  Overall (65%)
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1.0)}
                  className={\`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-colors \${
                    zoomScale === 1.0 ? 'bg-[#15110e] text-[#dfc194]' : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }\`}
                  title="Standard View"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1.35)}
                  className={\`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-colors \${
                    zoomScale === 1.35 ? 'bg-[#15110e] text-[#dfc194]' : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }\`}
                  title="Detailed View"
                >
                  Detailed (135%)
                </button>
              </div>
            </div>
          </div>`;

// 2. Wrap room_canvas inner elements in scaled container
const canvasTarget = `                {/* Draggable Main Dance Floor */}
                <div
                  id="canvas_main_dance_floor"`;

const canvasReplacement = `                {/* Scaled Board for Zoom */}
                <div
                  id="room_canvas_inner_board"
                  className="w-full h-full relative"
                  style={{
                    transform: \`scale(\${zoomScale})\`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                {/* Draggable Main Dance Floor */}
                <div
                  id="canvas_main_dance_floor"`;

// Close inner board before the outer container closing tag
const canvasCloseTarget = `                <div className="absolute bottom-3 right-8 bg-white/90 border border-[#e8ded0] px-4 py-1.5 rounded-xl text-[10px] font-bold text-[#8b7b6b] shadow-xs">
                  🌿 Garden Verandah Access
                </div>

                {/* Draggable Tables on Canvas with Distinct Round / Rectangular Geometry & Shape Icons */}
                {filteredTables.map((tbl) => {`;

// 3. Add Oval option to Add Table Modal
const addTableModalTarget = `<option value="round">Round Banquet</option>
                    <option value="rectangular">Rectangular Table</option>
                    <option value="king">Long King Banquet (30-40)</option>`;

const addTableModalReplacement = `<option value="round">Round Banquet</option>
                    <option value="oval">Oval Banquet Table</option>
                    <option value="rectangular">Rectangular Table</option>
                    <option value="king">Long King Banquet (30-40)</option>`;

// 4. Update canvas tables for oval shape
const shapeGeoTarget = `                  const isRound = tbl.shape === 'round';
                  const isKing = tbl.shape === 'king';
                  const isRect = tbl.shape === 'rectangular';

                  // Shape-specific card geometries
                  const shapeGeometryClass = isKing
                    ? 'min-w-[155px] sm:min-w-[170px] h-[78px] sm:h-[82px] rounded-xl px-4 py-2'
                    : isRound
                    ? 'w-[98px] h-[98px] sm:w-[106px] sm:h-[106px] rounded-full aspect-square p-2.5'
                    : 'min-w-[130px] sm:min-w-[145px] h-[72px] sm:h-[76px] rounded-lg px-3.5 py-1.5';`;

const shapeGeoReplacement = `                  const isRound = tbl.shape === 'round';
                  const isKing = tbl.shape === 'king';
                  const isRect = tbl.shape === 'rectangular';
                  const isOval = tbl.shape === 'oval';

                  // Shape-specific card geometries
                  const shapeGeometryClass = isKing
                    ? 'min-w-[155px] sm:min-w-[170px] h-[78px] sm:h-[82px] rounded-xl px-4 py-2'
                    : isOval
                    ? 'min-w-[145px] sm:min-w-[160px] h-[78px] sm:h-[84px] rounded-[48px/28px] px-4 py-2 border-2'
                    : isRound
                    ? 'w-[98px] h-[98px] sm:w-[106px] sm:h-[106px] rounded-full aspect-square p-2.5'
                    : 'min-w-[130px] sm:min-w-[145px] h-[72px] sm:h-[76px] rounded-lg px-3.5 py-1.5';`;

// 5. Add Oval Table Visualization to Level 2
const level2OvalTarget = `              {/* RECTANGULAR TABLE VISUALIZATION (Rectangular, King & Head Table) */}
              {(activeTable.shape === 'rectangular' || activeTable.shape === 'king') && (`;

const level2OvalReplacement = `              {/* OVAL TABLE VISUALIZATION */}
              {activeTable.shape === 'oval' && (
                <div className="relative w-full max-w-[480px] h-[360px] flex items-center justify-center">
                  <div className="absolute w-[360px] h-[240px] rounded-[180px/120px] border-2 border-dashed border-[#bd9661]/40 pointer-events-none" />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      setDragOverTarget({ type: 'table', tableId: activeTable.id });
                    }}
                    onDragLeave={() => setDragOverTarget(null)}
                    onDrop={(e) => handleDropOnTable(e, activeTable.id)}
                    className={\`w-[220px] h-[130px] rounded-[110px/65px] bg-white border-2 shadow-lg flex flex-col items-center justify-center text-center z-10 p-3 select-none transition-all cursor-pointer \${
                      dragOverTarget?.type === 'table' && dragOverTarget?.tableId === activeTable.id
                        ? 'border-[#bd9661] ring-4 ring-[#bd9661]/40 bg-[#faf5ee] scale-105 shadow-xl'
                        : 'border-[#bd9661]'
                    }\`}
                    title="Drop any guest here to seat at next vacant place"
                  >
                    <span className="font-serif text-base font-bold text-[#15110e]">{(activeTable.name || '').replace(/\\s*\\([^)]*\\)/g, '').trim()}</span>
                    <span className="text-sm font-bold font-mono text-[#bd9661] mt-0.5">
                      {guestsAtActiveTable.length} / {activeTable.capacity}
                    </span>
                    <span className="text-[10px] font-sans text-[#8b7b6b] uppercase tracking-wider">Oval Table</span>
                  </div>
                  {Array.from({ length: activeTable.capacity }).map((_, sIdx) => {
                    const occupant = guestsAtActiveTable.find((g) => g.seatIndex === sIdx);
                    const angle = sIdx * (360 / activeTable.capacity);
                    const rx = 150;
                    const ry = 110;
                    const rad = ((angle - 90) * Math.PI) / 180;
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
                        style={{
                          transform: \`translate(\${x}px, \${y}px)\`,
                        }}
                        className={\`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center shadow-md text-xs font-bold transition-all select-none cursor-pointer \${
                          isOver
                            ? 'bg-[#bd9661] text-white border-2 border-white scale-125 ring-4 ring-[#bd9661]/50 z-30 shadow-xl'
                            : occupant
                            ? 'bg-[#15110e] text-[#dfc194] border-2 border-[#bd9661] cursor-grab active:cursor-grabbing hover:scale-110 z-20'
                            : draggedGuestId
                            ? 'bg-amber-50 border-2 border-dashed border-[#bd9661] text-[#bd9661] animate-pulse hover:bg-[#faf5ee] z-10'
                            : 'bg-white border-2 border-dashed border-[#bd9661]/60 text-[#bd9661] hover:bg-[#faf5ee] z-10'
                        }\`}
                        title={occupant ? \`\${occupant.name} (\${occupant.dietary || 'Standard'}) - Drag to move or swap\` : \`Seat #\${sIdx + 1} (Empty) - Drop guest here\`}
                      >
                        {occupant ? occupant.initials || occupant.name.slice(0, 2) : \`#\${sIdx + 1}\`}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* RECTANGULAR TABLE VISUALIZATION (Rectangular, King & Head Table) */}
              {(activeTable.shape === 'rectangular' || activeTable.shape === 'king') && (`;

// 6. Update handleTableCanvasDrop for zoom coordinate mapping
const dropTarget = `    if (isDraggingDanceFloor || dragType === 'dancefloor') {
      const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
      const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);`;

const dropReplacement = `    const centerX = containerRect.left + containerRect.width / 2;
    const unscaledX = centerX + (e.clientX - centerX) / zoomScale;
    const unscaledY = containerRect.top + (e.clientY - containerRect.top) / zoomScale;

    if (isDraggingDanceFloor || dragType === 'dancefloor') {
      const relX = Math.round(((unscaledX - containerRect.left) / containerRect.width) * 100);
      const relY = Math.round(((unscaledY - containerRect.top) / containerRect.height) * 100);`;

const dropTableTarget = `    if (!draggingTableId) return;

    const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
    const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);`;

const dropTableReplacement = `    if (!draggingTableId) return;

    const relX = Math.round(((unscaledX - containerRect.left) / containerRect.width) * 100);
    const relY = Math.round(((unscaledY - containerRect.top) / containerRect.height) * 100);`;

// Also close the inner board at end of canvas
const endCanvasTarget = `                </div>
              </div>
            </div>`;

// Check and replace
function safeReplace(str, target, replacement, desc) {
  // Normalize CRLF to LF for matching
  const normStr = str.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normRep = replacement.replace(/\r\n/g, '\n');
  if (normStr.includes(normTarget)) {
    console.log('✓ Replaced:', desc);
    return normStr.replace(normTarget, normRep);
  } else {
    console.warn('✗ Failed to find:', desc);
    return str;
  }
}

content = safeReplace(content, filterTarget, filterReplacement, 'Filter Bar & Zoom Toolbar');
content = safeReplace(content, addTableModalTarget, addTableModalReplacement, 'Add Table Modal Oval Option');
content = safeReplace(content, shapeGeoTarget, shapeGeoReplacement, 'Canvas Oval Geometry');
content = safeReplace(content, level2OvalTarget, level2OvalReplacement, 'Level 2 Oval Visual');
content = safeReplace(content, dropTarget, dropReplacement, 'Dance Floor Drop Zoom');
content = safeReplace(content, dropTableTarget, dropTableReplacement, 'Table Drop Zoom');

// For canvas wrapper, find room_canvas_container
const canvasStart = '<div\n                id="room_canvas_container"';
const canvasEnd = 'id="canvas_main_dance_floor"';
if (content.includes(canvasEnd) && !content.includes('room_canvas_inner_board')) {
  content = content.replace(canvasEnd, 'id="room_canvas_inner_board"\n                  className="w-full h-full relative"\n                  style={{\n                    transform: `scale(${zoomScale})`,\n                    transformOrigin: \'top center\',\n                    transition: \'transform 0.15s ease-out\',\n                  }}\n                >\n                <div\n                  id="canvas_main_dance_floor"');
  // Also close the inner div
  const closingMarker = '{/* Draggable Tables on Canvas with Distinct Round / Rectangular Geometry & Shape Icons */}\n                {filteredTables.map((tbl) => {';
  // We want to close it after filteredTables.map ends
  const afterTables = '                    );\n                })}\n              </div>';
  if (content.includes(afterTables)) {
    content = content.replace(afterTables, '                    );\n                })}\n                </div>\n              </div>');
    console.log('✓ Wrapped canvas in room_canvas_inner_board');
  }
}

fs.writeFileSync('src/components/SeatingPlannerSection.tsx', content, 'utf8');
console.log('Completed SeatingPlannerSection update.');
