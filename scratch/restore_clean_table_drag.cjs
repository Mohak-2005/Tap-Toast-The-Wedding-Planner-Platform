const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('src/components/SeatingPlannerSection.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Remove activePointerDrag and tablePosOverrides state
const oldStateBlock = `  // Dragging tables around floor canvas
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
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

const newStateBlock = `  // Dragging tables around floor canvas
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);`;

if (content.includes(oldStateBlock)) {
  content = content.replace(oldStateBlock, newStateBlock);
  console.log('1. Replaced state block');
} else {
  console.log('1. Could not match oldStateBlock');
}

// 2. Replace handleDropOnTable & handleTableCanvasDrop & handleTouchMove
const oldHandlerStart = `  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {`;
const oldHandlerEnd = `      setState({ ...state, weddings: updatedWeddings });
      showToast('Table position saved', 'info');
    }
  };`;

const handlerIdx1 = content.indexOf(oldHandlerStart);
const handlerIdx2 = content.indexOf(oldHandlerEnd);

if (handlerIdx1 !== -1 && handlerIdx2 !== -1) {
  const newHandlers = `  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedTable = draggingTableId || e.dataTransfer.getData('tableId');
    if (isDraggingDanceFloor || e.dataTransfer.getData('text/plain') === 'dancefloor' || draggedTable) {
      const el = document.getElementById('room_canvas_inner_board') || document.getElementById('room_canvas_container');
      if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
      return;
    }
    const guestId = e.dataTransfer.getData('guestId') || e.dataTransfer.getData('text/plain') || draggedGuestId;
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
    const tableId = e.dataTransfer.getData('tableId') || draggingTableId;

    // Check if a guest is being dragged onto canvas - don't move tables
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) return;

    if (isDraggingDanceFloor || dragType === 'dancefloor') {
      const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
      const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);

      const clampedX = Math.max(12, Math.min(88, relX));
      const clampedY = Math.max(15, Math.min(85, relY));

      const newPos = { x: clampedX, y: clampedY };
      setDanceFloorPos(newPos);
      setIsDraggingDanceFloor(false);

      const updatedWeddings = (state.weddings || []).map((w: any) =>
        w.id === currentWeddingId ? { ...w, danceFloorPos: newPos } : w
      );
      setState({ ...state, weddings: updatedWeddings });
      showToast('Dance floor repositioned', 'info');
      return;
    }

    if (!tableId || tableId === 'dancefloor') return;

    const relX = Math.round(((e.clientX - containerRect.left) / containerRect.width) * 100);
    const relY = Math.round(((e.clientY - containerRect.top) / containerRect.height) * 100);

    const clampedX = Math.max(6, Math.min(92, relX));
    const clampedY = Math.max(12, Math.min(86, relY));

    const updatedTables = (state.tables || []).map((t) =>
      t.id === tableId ? { ...t, x: clampedX, y: clampedY } : t
    );
    setState({ ...state, tables: updatedTables });
    setDraggingTableId(null);
    const tblObj = tables.find((t) => t.id === tableId);
    showToast(\`\${(tblObj?.name || 'Table').replace(/\\s*\\([^)]*\\)/g, '').trim()} position saved\`, 'info');
  };

  const handleTouchMoveDanceFloor = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const el = document.getElementById('room_canvas_inner_board') || document.getElementById('room_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(12, Math.min(88, Math.round(relX)));
    const clampedY = Math.max(15, Math.min(85, Math.round(relY)));
    const newPos = { x: clampedX, y: clampedY };
    setDanceFloorPos(newPos);

    const updatedWeddings = (state.weddings || []).map((w: any) =>
      w.id === currentWeddingId ? { ...w, danceFloorPos: newPos } : w
    );
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleTouchMoveTable = (e: React.TouchEvent, tblId: string) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const el = document.getElementById('room_canvas_inner_board') || document.getElementById('room_canvas_container');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = ((touch.clientX - rect.left) / rect.width) * 100;
    const relY = ((touch.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(6, Math.min(92, Math.round(relX)));
    const clampedY = Math.max(12, Math.min(86, Math.round(relY)));

    const updatedTables = (state.tables || []).map((t) =>
      t.id === tblId ? { ...t, x: clampedX, y: clampedY } : t
    );
    setState({ ...state, tables: updatedTables });
  };`;

  content = content.slice(0, handlerIdx1) + newHandlers + content.slice(handlerIdx2 + oldHandlerEnd.length);
  console.log('2. Replaced handlers');
} else {
  console.log('2. Could not find handler indices', handlerIdx1, handlerIdx2);
}

// 3. Replace inner board & dancefloor & table JSX
const oldCanvasPart = `<div
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

const newCanvasPart = `<div
                  id="room_canvas_inner_board"
                  className={\`w-full relative \${isMobileCompact ? 'h-[420px]' : 'h-[630px] md:h-[650px]'}\`}
                  style={{
                    transform: \`scale(\${zoomScale})\`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    const el = document.getElementById('room_canvas_inner_board') || document.getElementById('room_canvas_container');
                    if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
                  }}
                >`;

if (content.includes(oldCanvasPart)) {
  content = content.replace(oldCanvasPart, newCanvasPart);
  console.log('3. Replaced canvas inner board JSX');
} else {
  console.log('3. Could not match oldCanvasPart');
}

// 4. Replace dancefloor JSX
const oldDanceFloorStart = `<div
                  id="canvas_main_dance_floor"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', 'dancefloor');
                    setIsDraggingDanceFloor(true);
                  }}
                  onDragEnd={() => setIsDraggingDanceFloor(false)}
                  onTouchMove={handleTouchMoveDanceFloor}
                  onPointerDown={handleDanceFloorPointerDown}`;

const oldDanceFloorEnd = `title="Drag and drop to reposition Main Dance Floor"
                >`;

const dfIdx1 = content.indexOf(oldDanceFloorStart);
const dfIdx2 = content.indexOf(oldDanceFloorEnd, dfIdx1);

if (dfIdx1 !== -1 && dfIdx2 !== -1) {
  const newDanceFloorJSX = `<div
                  id="canvas_main_dance_floor"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', 'dancefloor');
                    setIsDraggingDanceFloor(true);
                  }}
                  onDragEnd={() => setIsDraggingDanceFloor(false)}
                  onTouchMove={handleTouchMoveDanceFloor}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('room_canvas_inner_board') || document.getElementById('room_canvas_container');
                    if (el) handleTableCanvasDrop(e, el.getBoundingClientRect());
                  }}
                  style={{
                    left: \`\${danceFloorPos.x}%\`,
                    top: \`\${danceFloorPos.y}%\`,
                  }}
                  className={\`absolute -translate-x-1/2 -translate-y-1/2 w-48 h-36 rounded-3xl border-2 border-dashed border-[#bd9661]/60 bg-[#bd9661]/10 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing hover:border-[#bd9661] hover:bg-[#bd9661]/15 transition-shadow shadow-xs hover:shadow-md select-none group z-10 \${
                    isDraggingDanceFloor ? 'opacity-60 ring-2 ring-[#bd9661]' : ''
                  }\`}
                  title="Drag and drop to reposition Main Dance Floor"
                >`;

  content = content.slice(0, dfIdx1) + newDanceFloorJSX + content.slice(dfIdx2 + oldDanceFloorEnd.length);
  console.log('4. Replaced dance floor JSX');
} else {
  console.log('4. Could not match dance floor JSX', dfIdx1, dfIdx2);
}

// 5. Replace table map JSX
const oldTableMapPattern = `                  const curX = tablePosOverrides[tbl.id]?.x ?? tbl.x;
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

const newTableMapPattern = `                  return (
                    <div
                      key={tbl.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', tbl.id);
                        e.dataTransfer.setData('tableId', tbl.id);
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggingTableId(tbl.id);
                      }}
                      onDragEnd={() => setDraggingTableId(null)}
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
                        zIndex: draggingTableId === tbl.id ? 30 : 10,
                      }}
                      className={\`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none shadow-md flex flex-col items-center justify-center text-center transition-all hover:scale-105 \${shapeGeometryClass} \${shapeThemeClass} \${draggingTableId === tbl.id ? 'opacity-50 ring-2 ring-[#bd9661] scale-105' : ''}\`}`;

if (content.includes(oldTableMapPattern)) {
  content = content.replace(oldTableMapPattern, newTableMapPattern);
  console.log('5. Replaced table map JSX');
} else {
  console.log('5. Could not match oldTableMapPattern');
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated SeatingPlannerSection.tsx');
