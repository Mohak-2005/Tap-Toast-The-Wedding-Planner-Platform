const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('src/components/SeatingPlannerSection.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

const markerStart = '  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {';
const markerEnd = '  // Add new table\n  const handleCreateNewTable = (e: React.FormEvent) => {';

const idxStart = content.indexOf(markerStart);
const idxEnd = content.indexOf(markerEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error('Could not find markers', idxStart, idxEnd);
  process.exit(1);
}

const replacement = `  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {
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
  };

`;

content = content.slice(0, idxStart) + replacement + content.slice(idxEnd);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully replaced handlers block!');
