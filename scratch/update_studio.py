import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update CanvasElement
old_canvas_el = '''  scale?: number; // 0.4 to 2.5
  opacity?: number; // 0.1 to 1.0'''

new_canvas_el = '''  scale?: number; // 0.4 to 2.5
  scaleX?: number; // Horizontal scale
  scaleY?: number; // Vertical scale
  opacity?: number; // 0.1 to 1.0'''

assert old_canvas_el in code, "old_canvas_el not found"
code = code.replace(old_canvas_el, new_canvas_el, 1)

# 2. Add showAllThemes state
old_tpl_state = '''  const [templates, setTemplates] = useState<CustomCardTemplate[]>(INITIAL_TEMPLATES);'''
new_tpl_state = '''  const [templates, setTemplates] = useState<CustomCardTemplate[]>(INITIAL_TEMPLATES);
  const [showAllThemes, setShowAllThemes] = useState(false);'''

assert old_tpl_state in code, "old_tpl_state not found"
code = code.replace(old_tpl_state, new_tpl_state, 1)

# 3. Update resizeStartRef and resize handlers
old_resize_block = '''  // =========================================================================
  // INTERACTIVE 4-CORNER DIRECT RESIZE & CENTER MOVE (LIKE MICROSOFT WORD)
  // =========================================================================
  const resizeStartRef = useRef<{
    id: string;
    corner: 'nw' | 'ne' | 'se' | 'sw';
    startX: number;
    startY: number;
    initialScale: number;
  } | null>(null);

  const [isResizing, setIsResizing] = useState(false);

  const handleCornerResizeDown = (
    e: React.PointerEvent,
    element: CanvasElement,
    corner: 'nw' | 'ne' | 'se' | 'sw'
  ) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      id: element.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      initialScale: element.scale || 1,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCornerResizeMove = (e: React.PointerEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    const deltaX = e.clientX - resizeStartRef.current.startX;
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const { corner, initialScale, id } = resizeStartRef.current;

    let distance = 0;
    if (corner === 'se') {
      distance = (deltaX + deltaY) / 2;
    } else if (corner === 'nw') {
      distance = (-deltaX - deltaY) / 2;
    } else if (corner === 'ne') {
      distance = (deltaX - deltaY) / 2;
    } else if (corner === 'sw') {
      distance = (-deltaX + deltaY) / 2;
    }

    const scaleFactor = 1 + distance / 70;
    const newScale = Math.max(0.35, Math.min(3.2, parseFloat((initialScale * scaleFactor).toFixed(2))));

    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, scale: newScale } : el))
    );
  };

  const handleCornerResizeUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      pushToHistory(elements);
    }
  };'''

new_resize_block = '''  // =========================================================================
  // INTERACTIVE 8-HANDLE DIRECT RESIZE (4 CORNERS + 4 EDGE MIDPOINTS - LIKE WORD)
  // Supports independent horizontal & vertical expansion or proportional corners
  // =========================================================================
  const resizeStartRef = useRef<{
    id: string;
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';
    startX: number;
    startY: number;
    initialScaleX: number;
    initialScaleY: number;
  } | null>(null);

  const [isResizing, setIsResizing] = useState(false);

  const handleResizeDown = (
    e: React.PointerEvent,
    element: CanvasElement,
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w'
  ) => {
    e.stopPropagation();
    setIsResizing(true);
    const curSx = element.scaleX ?? element.scale ?? 1;
    const curSy = element.scaleY ?? element.scale ?? 1;
    resizeStartRef.current = {
      id: element.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialScaleX: curSx,
      initialScaleY: curSy,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    const deltaX = e.clientX - resizeStartRef.current.startX;
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const { handle, initialScaleX, initialScaleY, id } = resizeStartRef.current;

    let newScaleX = initialScaleX;
    let newScaleY = initialScaleY;

    if (handle === 'e') {
      // Horizontal stretch/collapse from right edge
      const factorX = 1 + deltaX / 65;
      newScaleX = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
    } else if (handle === 'w') {
      // Horizontal stretch/collapse from left edge
      const factorX = 1 - deltaX / 65;
      newScaleX = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
    } else if (handle === 's') {
      // Vertical stretch/collapse from bottom edge
      const factorY = 1 + deltaY / 65;
      newScaleY = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'n') {
      // Vertical stretch/collapse from top edge
      const factorY = 1 - deltaY / 65;
      newScaleY = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'se') {
      // Bottom-Right corner: expand/collapse horizontally & vertically
      const factorX = 1 + deltaX / 70;
      const factorY = 1 + deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'nw') {
      // Top-Left corner
      const factorX = 1 - deltaX / 70;
      const factorY = 1 - deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'ne') {
      // Top-Right corner
      const factorX = 1 + deltaX / 70;
      const factorY = 1 - deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'sw') {
      // Bottom-Left corner
      const factorX = 1 - deltaX / 70;
      const factorY = 1 + deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    }

    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              scaleX: newScaleX,
              scaleY: newScaleY,
              scale: parseFloat(((newScaleX + newScaleY) / 2).toFixed(2)),
            }
          : el
      )
    );
  };

  const handleResizeUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      pushToHistory(elements);
    }
  };'''

assert old_resize_block in code, "old_resize_block not found"
code = code.replace(old_resize_block, new_resize_block, 1)

# 4. Update the Settings Theme Grid & Show More Button
old_grid_start = '''        {/* Clean Theme Cards Grid - Simplified & Uncluttered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => ('''

new_grid_start = '''        {/* Clean Theme Cards Grid - Simplified & Uncluttered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAllThemes ? templates : templates.slice(0, 3)).map((tpl) => ('''

assert old_grid_start in code, "old_grid_start not found"
code = code.replace(old_grid_start, new_grid_start, 1)

old_blank_and_end = '''          {/* Quick Action: Create Blank Invitation */}
          <div
            onClick={handleOpenNewDesign}
            className="border-2 border-dashed border-[#d9cdbe] hover:border-[#bd9661] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all bg-[#faf8f5]/50 hover:bg-[#faf5ee] min-h-[120px] group"
          >
            <div className="w-8 h-8 rounded-full bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] group-hover:scale-110 transition-transform shadow-2xs">
              <span className="text-base font-bold">+</span>
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-[#15110e]">Create Blank Invitation</div>
              <div className="text-[11px] text-[#8b7b6b]">Design from scratch</div>
            </div>
          </div>
        </div>
      </div>'''

new_blank_and_end = '''          {/* Quick Action: Create Blank Invitation (Shown when Expanded) */}
          {showAllThemes && (
            <div
              onClick={handleOpenNewDesign}
              className="border-2 border-dashed border-[#d9cdbe] hover:border-[#bd9661] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all bg-[#faf8f5]/50 hover:bg-[#faf5ee] min-h-[120px] group"
            >
              <div className="w-8 h-8 rounded-full bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] group-hover:scale-110 transition-transform shadow-2xs">
                <span className="text-base font-bold">+</span>
              </div>
              <div>
                <div className="font-serif text-sm font-bold text-[#15110e]">Create Blank Invitation</div>
                <div className="text-[11px] text-[#8b7b6b]">Design from scratch</div>
              </div>
            </div>
          )}
        </div>

        {/* Show More / Show Less Toggle Button */}
        <div className="flex justify-center pt-3 pb-1">
          <button
            type="button"
            onClick={() => setShowAllThemes((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] hover:border-[#bd9661] text-[#2c221a] hover:text-[#bd9661] text-xs font-bold transition-all shadow-2xs cursor-pointer group"
          >
            <span>{showAllThemes ? 'Show Less Themes' : 'Show More Themes (2 More & Blank)'}</span>
            <ChevronDownIcon className={`w-3.5 h-3.5 text-[#bd9661] transition-transform duration-200 ${showAllThemes ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>'''

assert old_blank_and_end in code, "old_blank_and_end not found"
code = code.replace(old_blank_and_end, new_blank_and_end, 1)

# 5. Update canvas element rendering and 8 handles
old_element_render = '''                  {/* Render Elements on Card */}
                  {elements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    const asset = SVG_ASSETS[el.content];

                    let elementGlowClass = '';

                    return (
                      <div
                        key={el.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                          setRightCardMode('inspector');
                        }}
                        onPointerDown={(e) => handleElementPointerDown(e, el)}
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg) scale(${el.scale || 1})`,
                          opacity: el.opacity ?? 1,
                          zIndex: isSelected ? 40 : el.zIndex || 10,
                          cursor: isDragging && isSelected ? 'grabbing' : 'grab',
                        }}
                        className={`absolute group touch-none ${
                          isSelected ? 'ring-2 ring-[#bd9661] ring-offset-2 ring-offset-transparent rounded-sm' : ''
                        }`}
                      >'''

new_element_render = '''                  {/* Render Elements on Card */}
                  {elements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    const asset = SVG_ASSETS[el.content];
                    const sx = el.scaleX ?? el.scale ?? 1;
                    const sy = el.scaleY ?? el.scale ?? 1;

                    let elementGlowClass = '';

                    return (
                      <div
                        key={el.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                          setRightCardMode('inspector');
                        }}
                        onPointerDown={(e) => handleElementPointerDown(e, el)}
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg) scale(${sx}, ${sy})`,
                          opacity: el.opacity ?? 1,
                          zIndex: isSelected ? 40 : el.zIndex || 10,
                          cursor: isDragging && isSelected ? 'grabbing' : 'grab',
                        }}
                        className={`absolute group touch-none ${
                          isSelected ? 'ring-2 ring-[#bd9661] ring-offset-2 ring-offset-transparent rounded-sm' : ''
                        }`}
                      >'''

assert old_element_render in code, "old_element_render not found"
code = code.replace(old_element_render, new_element_render, 1)

# 6. Update handles block
old_handles_block = '''                        {/* Interactive Word-Style 4 Corner Resize Handles & Bounding Box */}
                        {isSelected && (
                          <>
                            {/* Top-Left Corner Handle */}
                            <span
                              onPointerDown={(e) => handleCornerResizeDown(e, el, 'nw')}
                              onPointerMove={handleCornerResizeMove}
                              onPointerUp={handleCornerResizeUp}
                              className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag corner to expand or minimize (like Word)"
                            />
                            {/* Top-Right Corner Handle */}
                            <span
                              onPointerDown={(e) => handleCornerResizeDown(e, el, 'ne')}
                              onPointerMove={handleCornerResizeMove}
                              onPointerUp={handleCornerResizeUp}
                              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag corner to expand or minimize (like Word)"
                            />
                            {/* Bottom-Left Corner Handle */}
                            <span
                              onPointerDown={(e) => handleCornerResizeDown(e, el, 'sw')}
                              onPointerMove={handleCornerResizeMove}
                              onPointerUp={handleCornerResizeUp}
                              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag corner to expand or minimize (like Word)"
                            />
                            {/* Bottom-Right Corner Handle */}
                            <span
                              onPointerDown={(e) => handleCornerResizeDown(e, el, 'se')}
                              onPointerMove={handleCornerResizeMove}
                              onPointerUp={handleCornerResizeUp}
                              className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag corner to expand or minimize (like Word)"
                            />

                            {/* Live Scale Badge above element during corner resize */}
                            {isResizing && resizeStartRef.current?.id === el.id && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#15110e] text-[#fce4ca] border border-[#bd9661] text-[10px] font-mono font-bold shadow-lg pointer-events-none z-50 whitespace-nowrap animate-fadeIn">
                                {el.scale ? `${el.scale}x` : '1x'}
                              </div>
                            )}
                          </>
                        )}'''

new_handles_block = '''                        {/* Interactive Word-Style 8 Handles (4 Corners + 4 Edge Midpoints) */}
                        {isSelected && (
                          <>
                            {/* 4 Corner Circular Handles */}
                            {/* Top-Left nw */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'nw')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag top-left corner to resize"
                            />
                            {/* Top-Right ne */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'ne')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag top-right corner to resize"
                            />
                            {/* Bottom-Left sw */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'sw')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag bottom-left corner to resize"
                            />
                            {/* Bottom-Right se */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'se')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag bottom-right corner to resize"
                            />

                            {/* 4 Edge Midpoint Handles (Horizontal & Vertical Direct Expand/Collapse) */}
                            {/* Top Edge n (Vertical) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'n')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateX(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -top-1.5 left-1/2 w-4 h-2.5 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ns-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag top edge to expand/collapse vertically"
                            />
                            {/* Bottom Edge s (Vertical) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 's')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateX(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -bottom-1.5 left-1/2 w-4 h-2.5 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ns-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag bottom edge to expand/collapse vertically"
                            />
                            {/* Left Edge w (Horizontal) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'w')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateY(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -left-1.5 top-1/2 w-2.5 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ew-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag left edge to expand/collapse horizontally"
                            />
                            {/* Right Edge e (Horizontal) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'e')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateY(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -right-1.5 top-1/2 w-2.5 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ew-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag right edge to expand/collapse horizontally"
                            />

                            {/* Live Scale Badge above element during resize */}
                            {isResizing && resizeStartRef.current?.id === el.id && (
                              <div
                                style={{ transform: `translateX(-50%) scale(${1 / sx}, ${1 / sy})` }}
                                className="absolute -top-7 left-1/2 px-2 py-0.5 rounded bg-[#15110e] text-[#fce4ca] border border-[#bd9661] text-[10px] font-mono font-bold shadow-lg pointer-events-none z-50 whitespace-nowrap animate-fadeIn"
                              >
                                {el.scaleX !== undefined && el.scaleY !== undefined && el.scaleX !== el.scaleY
                                  ? `W: ${el.scaleX}x • H: ${el.scaleY}x`
                                  : `${el.scaleX ?? el.scale ?? 1}x`}
                              </div>
                            )}
                          </>
                        )}'''

assert old_handles_block in code, "old_handles_block not found"
code = code.replace(old_handles_block, new_handles_block, 1)

# 7. Update Inspector panel scale readout and tip
old_inspector_scale = '''                          {/* Direct Word-Style Resize & Rotation */}
                          <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                            <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e2d8c9] space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">Direct Resizing</span>
                                <span className="font-mono font-bold text-[#15110e] px-1.5 py-0.5 rounded bg-white border border-[#e2d8c9]">
                                  {selectedElement.scale ? `${selectedElement.scale}x` : '1x'}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#7a6b5c] leading-tight">
                                💡 Press &amp; drag any of the <strong>4 corner handles</strong> on the canvas to expand or minimize (like in Word). Drag center to move.
                              </p>
                            </div>'''

new_inspector_scale = '''                          {/* Direct Word-Style Resize & Rotation */}
                          <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                            <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e2d8c9] space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">Direct Resizing</span>
                                <span className="font-mono font-bold text-[#15110e] px-1.5 py-0.5 rounded bg-white border border-[#e2d8c9]">
                                  {selectedElement.scaleX !== undefined && selectedElement.scaleY !== undefined && selectedElement.scaleX !== selectedElement.scaleY
                                    ? `${selectedElement.scaleX}x × ${selectedElement.scaleY}x`
                                    : `${selectedElement.scaleX ?? selectedElement.scale ?? 1}x`}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#7a6b5c] leading-tight">
                                💡 Press &amp; drag any of the <strong>4 corners</strong> or <strong>4 edge handles</strong> on the canvas to expand or collapse horizontally / vertically (like in Word). Drag center to move.
                              </p>
                            </div>'''

assert old_inspector_scale in code, "old_inspector_scale not found"
code = code.replace(old_inspector_scale, new_inspector_scale, 1)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: SuperAdminCardStudio.tsx updated successfully!")
