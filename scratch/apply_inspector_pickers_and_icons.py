import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace Settings section emojis
text = text.replace(
    '<span className="text-lg">💌</span>',
    '<EnvelopeIcon className="w-5 h-5 text-[#bd9661]" />'
)
text = text.replace(
    '<span className="text-amber-400">✨</span>',
    '<SparkleIcon className="w-3.5 h-3.5 text-[#bd9661]" />'
)
text = text.replace(
    '<span className="text-[#bd9661]">🎨</span>\n              <span>Open Studio Designer</span>',
    '<PaletteIcon className="w-4 h-4 text-[#bd9661]" />\n              <span>Open Studio Designer</span>'
)
text = text.replace(
    '<span>Preview Studio</span>\n                  <span>→</span>',
    '<span>Preview Studio</span>\n                  <ChevronRightIcon className="w-3.5 h-3.5" />'
)

# 2. Studio header icons
text = text.replace(
    '<span className="text-sm">←</span>\n                  <span className="hidden sm:inline">Back to Settings</span>',
    '<ChevronLeftIcon className="w-4 h-4 text-[#dfc194]" />\n                  <span className="hidden sm:inline">Back to Settings</span>'
)
text = text.replace(
    '<div className="w-7 h-7 rounded-lg bg-[#bd9661]/20 border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] text-xs font-serif font-bold shrink-0 shadow-inner">\n                    T\n                  </div>',
    '<div className="w-7 h-7 rounded-lg bg-[#bd9661]/20 border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] shrink-0 shadow-inner">\n                    <EnvelopeIcon className="w-3.5 h-3.5 text-[#bd9661]" />\n                  </div>'
)
text = text.replace(
    '<span className="text-xs">▶</span>\n                  <span className="hidden md:inline">Play Motion</span>',
    '<PlayIcon className="w-3 h-3 text-[#bd9661]" />\n                  <span className="hidden md:inline">Play Motion</span>'
)
text = text.replace(
    '<span className="text-xs">📁</span>\n                  <span className="hidden lg:inline">Upload File</span>',
    '<UploadCloudIcon className="w-3.5 h-3.5 text-[#bd9661]" />\n                  <span className="hidden lg:inline">Upload File</span>'
)
text = text.replace(
    '<span className="text-xs">✓</span>\n                  <span className="hidden sm:inline">Save Theme</span>',
    '<CheckIcon className="w-3.5 h-3.5" />\n                  <span className="hidden sm:inline">Save Theme</span>'
)

# 3. Left Card collapse and re-open buttons
text = text.replace(
    'title="Collapse Panel"\n                  >\n                    ◀\n                  </button>',
    'title="Collapse Panel"\n                  >\n                    <ChevronLeftIcon className="w-3.5 h-3.5 text-[#dfc194]" />\n                  </button>'
)
text = text.replace(
    '<span>▶</span>\n                  <span>Card Aesthetic</span>',
    '<ChevronRightIcon className="w-3.5 h-3.5 text-[#bd9661]" />\n                  <span>Card Aesthetic</span>'
)

# 4. Right Card tabs and collapse
text = text.replace(
    '<span>🎨</span>\n                      <span>Design Box</span>',
    '<GridIcon className="w-3.5 h-3.5 text-[#bd9661]" />\n                      <span>Design Box</span>'
)
text = text.replace(
    '<span>⚙️</span>\n                      <span>Inspector</span>',
    '<InspectorIcon className="w-3.5 h-3.5 text-[#bd9661]" />\n                      <span>Inspector</span>'
)
text = text.replace(
    'title="Hide Panel"\n                  >\n                    ▶\n                  </button>',
    'title="Hide Panel"\n                  >\n                    <ChevronRightIcon className="w-3.5 h-3.5 text-[#dfc194]" />\n                  </button>'
)
text = text.replace(
    '<span>◀</span>\n                  <span>Design Box &amp; Inspector</span>',
    '<ChevronLeftIcon className="w-3.5 h-3.5 text-[#bd9661]" />\n                  <span>Design Box &amp; Inspector</span>'
)

# 5. Right card Design Box category filter buttons
old_filter_pills = '''                        {[
                          { id: 'all', label: 'All' },
                          { id: 'flower', label: '🌸 Flowers' },
                          { id: 'leaf', label: '🌿 Leaves' },
                          { id: 'decor', label: '✦ Decor' },
                          { id: 'text', label: 'T Text' },
                        ].map((cat) => ('''

new_filter_pills = '''                        {[
                          { id: 'all', label: 'All', icon: <GridIcon className="w-3 h-3" /> },
                          { id: 'flower', label: 'Flowers', icon: <FlowerIcon className="w-3 h-3 text-[#bd9661]" /> },
                          { id: 'leaf', label: 'Leaves', icon: <LeafIcon className="w-3 h-3 text-[#bd9661]" /> },
                          { id: 'decor', label: 'Decor', icon: <DecorIcon className="w-3 h-3 text-[#bd9661]" /> },
                          { id: 'text', label: 'Text', icon: <TypographyIcon className="w-3 h-3 text-[#bd9661]" /> },
                        ].map((cat) => ('''

if old_filter_pills in text:
    text = text.replace(old_filter_pills, new_filter_pills)
    text = text.replace('{cat.label}\n                          </button>', '<span className="flex items-center gap-1.5">{cat.icon}<span>{cat.label}</span></span>\n                          </button>')

# 6. Inspector Header Element Type Icon & actions
old_inspector_header_icon = '''                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">
                                {selectedElement.type === 'flower' ? '🌸' : selectedElement.type === 'leaf' ? '🌿' : selectedElement.type === 'text' ? '✍️' : '✦'}
                              </span>'''

new_inspector_header_icon = '''                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-[#241c16] flex items-center justify-center text-[#bd9661]">
                                {selectedElement.type === 'flower' ? <FlowerIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'leaf' ? <LeafIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'text' ? <TypographyIcon className="w-3.5 h-3.5" /> : <DecorIcon className="w-3.5 h-3.5" />}
                              </span>'''

if old_inspector_header_icon in text:
    text = text.replace(old_inspector_header_icon, new_inspector_header_icon)

# 7. Inspector empty state icon
text = text.replace(
    '<div className="text-2xl">🔍</div>',
    '<div className="w-10 h-10 rounded-full bg-[#241c16] border border-[#bd9661]/40 mx-auto flex items-center justify-center text-[#bd9661]"><SearchDocIcon className="w-5 h-5" /></div>'
)

# 8. Upload modal icons
text = text.replace(
    '<span className="text-lg">📁</span>\n                      <h3 className="font-serif text-base font-bold text-[#bd9661]">\n                        Direct Card Animation File Upload',
    '<UploadCloudIcon className="w-5 h-5 text-[#bd9661]" />\n                      <h3 className="font-serif text-base font-bold text-[#bd9661]">\n                        Direct Card Animation File Upload'
)
text = text.replace(
    'className="text-gray-400 hover:text-white text-sm cursor-pointer"\n                    >\n                      ✕\n                    </button>',
    'className="text-gray-400 hover:text-white text-sm cursor-pointer p-1 rounded hover:bg-[#2b221a]"\n                    >\n                      <CloseIcon className="w-4 h-4" />\n                    </button>'
)

# 9. 2D Spectrum Picker in Inspector for Text Color
old_text_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Text Color</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                </div>
                                <div className="grid grid-cols-5 gap-1.5">'''

new_text_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
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

                                <div className="grid grid-cols-5 gap-1.5">'''

if old_text_color in text:
    text = text.replace(old_text_color, new_text_color)
else:
    print("Warning: old_text_color pattern not matched exactly.")

# 10. 2D Spectrum Picker in Inspector for Petal Fill Color
old_petal_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Petal / Body Fill Color</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.fillColor || '#ffffff'}</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">'''

new_petal_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Petal / Body Fill Color</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.fillColor || '#ffffff'}</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'petal' ? null : 'petal')}
                                      className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                        inspectorColorPicker === 'petal'
                                          ? 'bg-[#bd9661] text-[#15110e]'
                                          : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3" />
                                      <span>2D Spectrum</span>
                                    </button>
                                  </div>
                                </div>

                                {inspectorColorPicker === 'petal' && (
                                  <div className="animate-fadeIn pb-2">
                                    <ColorPicker2D
                                      color={selectedElement.fillColor && selectedElement.fillColor !== 'transparent' ? selectedElement.fillColor : '#ffffff'}
                                      onChange={(c) => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fillColor: c } : el))
                                        );
                                      }}
                                      darkMode={true}
                                    />
                                  </div>
                                )}

                                <div className="grid grid-cols-6 gap-1.5">'''

if old_petal_color in text:
    text = text.replace(old_petal_color, new_petal_color)
else:
    print("Warning: old_petal_color pattern not matched exactly.")

# 11. 2D Spectrum Picker in Inspector for Foil / Outline Stroke
old_stroke_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Foil / Outline Stroke</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                </div>
                                <div className="grid grid-cols-5 gap-1.5">'''

new_stroke_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Foil / Outline Stroke</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'stroke' ? null : 'stroke')}
                                      className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                        inspectorColorPicker === 'stroke'
                                          ? 'bg-[#bd9661] text-[#15110e]'
                                          : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3" />
                                      <span>2D Spectrum</span>
                                    </button>
                                  </div>
                                </div>

                                {inspectorColorPicker === 'stroke' && (
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

                                <div className="grid grid-cols-5 gap-1.5">'''

if old_stroke_color in text:
    text = text.replace(old_stroke_color, new_stroke_color)
else:
    print("Warning: old_stroke_color pattern not matched exactly.")

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Inspector color pickers and professional icons applied successfully.")
