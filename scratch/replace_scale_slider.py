with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''                          {/* Common Scale, Rotation, Opacity */}
                          <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1">
                                <span>Scale</span>
                                <span className="font-mono text-[10px] text-[#fce4ca] font-bold">
                                  {selectedElement.scale ? `${selectedElement.scale}x` : '1x'}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="2.5"
                                step="0.05"
                                value={selectedElement.scale || 1}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setElements((prev) =>
                                    prev.map((el) => (el.id === selectedElement.id ? { ...el, scale: val } : el))
                                  );
                                }}
                                className="w-full accent-[#bd9661] cursor-pointer"
                              />
                            </div>'''

replacement = '''                          {/* Direct Word-Style Resize & Rotation */}
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

if target in text:
    text = text.replace(target, replacement)
    with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced scale slider with direct resize helper successfully!")
else:
    print("Target not found!")
