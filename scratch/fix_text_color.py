with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Text Color</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">'''

replacement = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Text Color</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'text' ? null : 'text')}
                                      className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                        inspectorColorPicker === 'text'
                                          ? 'bg-[#bd9661] text-[#15110e]'
                                          : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3" />
                                      <span>2D Spectrum</span>
                                    </button>
                                  </div>
                                </div>

                                {inspectorColorPicker === 'text' && (
                                  <div className="animate-fadeIn pb-2">
                                    <ColorPicker2D
                                      color={selectedElement.color || foilColor}
                                      onChange={(c) => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: c } : el))
                                        );
                                      }}
                                      darkMode={true}
                                    />
                                  </div>
                                )}

                                <div className="grid grid-cols-6 gap-1.5">'''

if target in text:
    text = text.replace(target, replacement)
    with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated Text Color in Inspector successfully!")
else:
    print("Target not found!")
