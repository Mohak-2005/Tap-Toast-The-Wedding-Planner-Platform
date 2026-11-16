const fs = require('fs');

let content = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');

// 1. Add activePointerDrag & tablePosOverrides state
const stateTarget = `  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);`;
const stateReplacement = `  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [activePointerDrag, setActivePointerDrag] = useState<{
    type: 'table' | 'dancefloor';
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  } | null>(null);
  const [tablePosOverrides, setTablePosOverrides] = useState<Record<string, { x: number; y: number }>>({});`;

if (content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
  console.log('✓ Added activePointerDrag & tablePosOverrides state');
}

// 2. Add pointer drag handlers before handleTableCanvasDrop
const handlerTarget = `  // Dragging table or dance floor position on canvas
  const handleTableCanvasDrop = (e: React.DragEvent, containerRect: DOMRect) => {`;

const handlerReplacement = `  // Butter-smooth Pointer Event Drag & Drop Engine (Google Maps & Figma style)
  const handleTablePointerDown = (e: React.PointerEvent, tblId: string, currentX: number, currentY: number) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}

    setActivePointerDrag({
      type: 'table',
      id: tblId,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentX,
      origY: currentY,
      hasMoved: false,
    });
  };

  const handleDanceFloorPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}

    setActivePointerDrag({
      type: 'dancefloor',
      id: 'dancefloor',
      startX: e.clientX,
      startY: e.clientY,
      origX: danceFloorPos.x,
      origY: danceFloorPos.y,
      hasMoved: false,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activePointerDrag) return;

    const inner = document.getElementById('room_canvas_inner_board');
    if (!inner) return;
    const rect = inner.getBoundingClientRect();

    const dx = (e.clientX - activePointerDrag.startX) / zoomScale;
    const dy = (e.clientY - activePointerDrag.startY) / zoomScale;

    if (!activePointerDrag.hasMoved && Math.hypot(dx, dy) < 4) {
      return;
    }

    if (!activePointerDrag.hasMoved) {
      setActivePointerDrag(prev => prev ? { ...prev, hasMoved: true } : null);
    }

    const effectiveWidth = (rect.width / zoomScale) || 800;
    const effectiveHeight = (rect.height / zoomScale) || 620;

    const deltaXPercent = (dx / effectiveWidth) * 100;
    const deltaYPercent = (dy / effectiveHeight) * 100;

    if (activePointerDrag.type === 'table') {
      const clampedX = Math.max(6, Math.min(94, Math.round(activePointerDrag.origX + deltaXPercent)));
      const clampedY = Math.max(10, Math.min(88, Math.round(activePointerDrag.origY + deltaYPercent)));

      setTablePosOverrides(prev => ({
        ...prev,
        [activePointerDrag.id]: { x: clampedX, y: clampedY },
      }));
    } else if (activePointerDrag.type === 'dancefloor') {
      const clampedX = Math.max(12, Math.min(88, Math.round(activePointerDrag.origX + deltaXPercent)));
      const clampedY = Math.max(15, Math.min(85, Math.round(activePointerDrag.origY + deltaYPercent)));
      setDanceFloorPos({ x: clampedX, y: clampedY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activePointerDrag) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (activePointerDrag.hasMoved) {
      if (activePointerDrag.type === 'table') {
        const override = tablePosOverrides[activePointerDrag.id];
        const finalX = override ? override.x : activePointerDrag.origX;
        const finalY = override ? override.y : activePointerDrag.origY;

        const updatedTables = (state.tables || []).map((t) =>
          t.id === activePointerDrag.id ? { ...t, x: finalX, y: finalY } : t
        );
        setState({ ...state, tables: updatedTables });
        const tblObj = tables.find(t => t.id === activePointerDrag.id);
        showToast(\`✓ \${(tblObj?.name || 'Table').replace(/\\s*\\([^)]*\\)/g, '').trim()} position saved\`, 'info');
      } else if (activePointerDrag.type === 'dancefloor') {
        const updatedWeddings = (state.weddings || []).map((w) =>
          w.id === currentWeddingId ? { ...w, danceFloorPos } : w
        );
        setState({ ...state, weddings: updatedWeddings });
        showToast('✓ Main Dance Floor position saved', 'info');
      }
    } else {
      if (activePointerDrag.type === 'table') {
        setSelectedTableId(activePointerDrag.id);
      }
    }

    setActivePointerDrag(null);
  };

  // Dragging table or dance floor position on canvas
  const handleTableCanvasDrop = (e: React.DragEvent, containerRect: DOMRect) => {`;

if (content.includes(handlerTarget)) {
  content = content.replace(handlerTarget, handlerReplacement);
  console.log('✓ Added pointer drag handlers');
}

// 3. Update room_canvas_container with explicit height
const oldContainerClass = "className={`bg-[#faf8f5] border-2 border-[#e8ded0] rounded-2xl md:rounded-3xl ${isMobileCompact ? 'p-3 min-h-[460px]' : 'p-6 min-h-[660px]'} relative shadow-inner overflow-hidden select-none`}";
const newContainerClass = "className={`bg-[#faf8f5] border-2 border-[#e8ded0] rounded-2xl md:rounded-3xl ${isMobileCompact ? 'p-3 min-h-[460px] h-[460px]' : 'p-6 min-h-[680px] h-[680px] md:h-[700px]'} relative shadow-inner overflow-hidden select-none flex flex-col`}";

if (content.includes(oldContainerClass)) {
  content = content.replace(oldContainerClass, newContainerClass);
  console.log('✓ Updated room_canvas_container height');
}

// 4. Update room_canvas_inner_board with explicit height and pointer handlers
const oldInnerBoard = `<div
                  id="room_canvas_inner_board"
                  className="w-full h-full relative"
                  style={{
                    transform: \`scale(\${zoomScale})\`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }}
                >`;

const newInnerBoard = `<div
                  id="room_canvas_inner_board"
                  className={\`w-full relative \${isMobileCompact ? 'h-[420px]' : 'h-[630px] md:h-[650px]'}\`}
                  style={{
                    transform: \`scale(\${zoomScale})\`,
                    transformOrigin: 'top center',
                    transition: activePointerDrag ? 'none' : 'transform 0.15s ease-out',
                  }}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >`;

if (content.includes(oldInnerBoard)) {
  content = content.replace(oldInnerBoard, newInnerBoard);
  console.log('✓ Updated room_canvas_inner_board with explicit height and pointer move listeners');
}

// 5. Update canvas_main_dance_floor with pointer drag & touch-action
const oldDanceFloor = `                  style={{
                    left: \`\${danceFloorPos.x}%\`,
                    top: \`\${danceFloorPos.y}%\`,
                  }}
                  className={\`absolute -translate-x-1/2 -translate-y-1/2 w-48 h-36 rounded-3xl border-2 border-dashed border-[#bd9661]/60 bg-[#bd9661]/10 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing hover:border-[#bd9661] hover:bg-[#bd9661]/15 transition-shadow shadow-xs hover:shadow-md select-none group z-10 \${
                    isDraggingDanceFloor ? 'opacity-60 ring-2 ring-[#bd9661]' : ''
                  }\`}`;

const newDanceFloor = `                  onPointerDown={handleDanceFloorPointerDown}
                  style={{
                    left: \`\${danceFloorPos.x}%\`,
                    top: \`\${danceFloorPos.y}%\`,
                    touchAction: 'none',
                    zIndex: activePointerDrag?.type === 'dancefloor' ? 30 : 10,
                  }}
                  className={\`absolute -translate-x-1/2 -translate-y-1/2 w-48 h-36 rounded-3xl border-2 border-dashed border-[#bd9661]/60 bg-[#bd9661]/10 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing hover:border-[#bd9661] hover:bg-[#bd9661]/15 transition-shadow shadow-xs hover:shadow-md select-none group \${
                    isDraggingDanceFloor || activePointerDrag?.type === 'dancefloor' ? 'opacity-70 ring-2 ring-[#bd9661]' : ''
                  }\`}`;

if (content.includes(oldDanceFloor)) {
  content = content.replace(oldDanceFloor, newDanceFloor);
  console.log('✓ Updated canvas_main_dance_floor with onPointerDown');
}

// 6. Update table rendering to use curX, curY, onPointerDown and touchAction
const oldTableBlock = `                  return (
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
                      className={\`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all shadow-md flex flex-col items-center justify-center text-center select-none \${shapeGeometryClass} \${shapeThemeClass} hover:scale-110 hover:shadow-xl\`}`;

const newTableBlock = `                  const curX = tablePosOverrides[tbl.id]?.x ?? tbl.x;
                  const curY = tablePosOverrides[tbl.id]?.y ?? tbl.y;
                  const isCurrentDragged = activePointerDrag?.id === tbl.id;

                  return (
                    <div
                      key={tbl.id}
                      draggable
                      onDragStart={() => setDraggingTableId(tbl.id)}
                      onPointerDown={(e) => handleTablePointerDown(e, tbl.id, curX, curY)}
                      onTouchMove={(e) => handleTouchMoveTable(e, tbl.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverTarget({ type: 'table', tableId: tbl.id });
                      }}
                      onDragLeave={() => setDragOverTarget(null)}
                      onDrop={(e) => handleDropOnTable(e, tbl.id)}
                      style={{
                        left: \`\${curX}%\`,
                        top: \`\${curY}%\`,
                        touchAction: 'none',
                        zIndex: isCurrentDragged ? 30 : 10,
                      }}
                      className={\`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none \${isCurrentDragged ? 'scale-105 shadow-2xl ring-2 ring-[#bd9661]' : 'transition-all hover:scale-105'} shadow-md flex flex-col items-center justify-center text-center \${shapeGeometryClass} \${shapeThemeClass}\`}`;

if (content.includes(oldTableBlock)) {
  content = content.replace(oldTableBlock, newTableBlock);
  console.log('✓ Updated table rendering with pointer drag');
} else {
  console.warn('✗ Could not match oldTableBlock');
}

fs.writeFileSync('src/components/SeatingPlannerSection.tsx', content, 'utf8');
console.log('✓ Completed SeatingPlannerSection.tsx updates');
