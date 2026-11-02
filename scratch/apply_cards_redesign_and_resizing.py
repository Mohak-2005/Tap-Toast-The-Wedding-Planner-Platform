with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# -----------------------------------------------------------------------------
# REQUIREMENT 3: Remove "6 Themes" and "Preview" from Settings Section
# -----------------------------------------------------------------------------
text = text.replace(
'''                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#faf5ee] text-[#8b7b6b] border border-[#e8ded0]">
                  {templates.length} Themes
                </span>''',
''
)

text = text.replace(
'''              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#bd9661]/20 text-[#bd9661] border border-[#bd9661]/30 ml-0.5 font-bold">
                Preview
              </span>''',
''
)

# -----------------------------------------------------------------------------
# REQUIREMENT 2: Add interactive 4-corner resizing logic like Word
# -----------------------------------------------------------------------------
# Find where handleElementPointerDown is defined and add corner resize handlers
corner_resize_handlers = '''  // =========================================================================
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
  };
'''

if 'const handleCornerResizeDown =' not in text:
    text = text.replace(
        '  // Pointer drag events for canvas elements\n  const handleElementPointerDown =',
        corner_resize_handlers + '\n  // Pointer drag events for canvas elements\n  const handleElementPointerDown ='
    )

# Replace the static 4 corner handles with interactive Word-style resize handles
old_corner_handles = '''                        {/* Selected Gold Bounding Box Dots (4 Corner Handles) */}
                        {isSelected && (
                          <>
                            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                          </>
                        )}'''

new_corner_handles = '''                        {/* Interactive Word-Style 4 Corner Resize Handles & Bounding Box */}
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

if old_corner_handles in text:
    text = text.replace(old_corner_handles, new_corner_handles)
else:
    print("Warning: old_corner_handles pattern not matched.")

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Step 1 & 2 applied.")
