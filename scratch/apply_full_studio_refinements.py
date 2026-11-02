import sys, re
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state for activeColorPickerTab and showEnvelopeBackdrop
state_marker = "const [gridStyle, setGridStyle] = useState<'dots' | 'lines' | 'blank'>('dots');"
new_state = state_marker + "\n  const [activeColorPickerTab, setActiveColorPickerTab] = useState<'paper' | 'foil' | 'envelope' | null>(null);\n  const [showEnvelopeBackdrop, setShowEnvelopeBackdrop] = useState(true);"

if state_marker in content and "activeColorPickerTab" not in content:
    content = content.replace(state_marker, new_state)
    print("Added state for 2D color picker tabs and envelope backdrop.")

# 2. Replace the compact section on Couple Settings
# Start from '{/* 1. COMPACT SECTION' to '{/* 2. FULL VIEWPORT WHITEBOARD'
compact_start = content.find('{/* 1. COMPACT SECTION')
compact_end = content.find('{/* =================================================================== */}\n      {/* 2. FULL VIEWPORT WHITEBOARD')

new_compact_section = """{/* 1. COMPACT SECTION ON PLATFORM SETTINGS (CLEAN BLACK & GOLD UI)    */}
      {/* =================================================================== */}
      <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ede4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] shrink-0 shadow-2xs">
              <span className="text-lg">💌</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base font-bold text-[#15110e]">
                  Bespoke Invitation Cards &amp; 3D Unboxing
                </h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#15110e] text-[#bd9661] border border-[#bd9661]/50 text-[11px] font-bold shadow-xs">
                  <span className="text-amber-400">✨</span>
                  <span>Coming Soon</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#faf5ee] text-[#8b7b6b] border border-[#e8ded0]">
                  {templates.length} Themes
                </span>
              </div>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                Design custom letterpress wedding invitations with tailored silhouettes, botanical flourishes, and hardware-accelerated 3D envelope unboxings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenNewDesign}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="text-[#bd9661]">🎨</span>
              <span>Open Studio Designer</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#bd9661]/20 text-[#bd9661] border border-[#bd9661]/30 ml-0.5 font-bold">
                Preview
              </span>
            </button>
          </div>
        </div>

        {/* Clean Theme Cards Grid - Simplified & Uncluttered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#faf8f5] hover:bg-[#fbf9f6] border border-[#e8ded0] hover:border-[#bd9661] rounded-xl p-4 transition-all duration-200 shadow-2xs flex flex-col justify-between gap-3 group"
            >
              <div>
                {/* Category & Clean Palette Dots */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#e2d8c9] text-[#786452]">
                    {tpl.category}
                  </span>
                  <div className="flex items-center gap-1.5" title="Paper, Foil, Envelope Palette">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.baseColor }} />
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.foilColor }} />
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.envelopeColor }} />
                  </div>
                </div>

                {/* Theme Name */}
                <h4 className="font-serif text-[15px] font-bold text-[#15110e] group-hover:text-[#bd9661] transition-colors line-clamp-1">
                  {tpl.name}
                </h4>

                {/* Subtle Clean Style Line */}
                <p className="text-[11px] text-[#8b7b6b] mt-1 line-clamp-1">
                  {CARD_SHAPES.find((s) => s.id === tpl.cardShape)?.name || 'Classic Silhouette'} &bull; Gilded Letterpress
                </p>
              </div>

              {/* Clean Bottom: Action button */}
              <div className="pt-2.5 border-t border-[#f0ede4] flex items-center justify-between">
                <span className="text-[10px] text-[#a09080] font-medium">Interactive Studio</span>
                <button
                  type="button"
                  onClick={() => handleOpenDesignerFor(tpl)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15110e] text-[#fce4ca] hover:bg-[#bd9661] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Preview Studio</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}

          {/* Quick Action: Create Blank Invitation */}
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
      </div>\n\n      """

if compact_start != -1 and compact_end != -1:
    content = content[:compact_start] + new_compact_section + content[compact_end:]
    print("Replaced compact section with clean, non-repeating UI.")
else:
    print(f"Warning: compact_start={compact_start}, compact_end={compact_end}")

# 3. Update Left Card color controls: replace Section 2 & Section 3
color_sec_start = content.find('{/* 2. Card Background Paper Texture */}')
color_sec_end = content.find('{/* 4. Predefined 3D Unboxing Motion */}')

new_color_sections = """{/* 2. Card Background Paper (2D Spectrum Picker matching Image 3) */}
                  <div className="pt-2 border-t border-[#2b221a] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661]">
                        Card Background Paper
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'paper' ? null : 'paper')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          activeColorPickerTab === 'paper'
                            ? 'bg-[#bd9661] text-[#15110e]'
                            : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                        }`}
                      >
                        <span>🎨 2D Spectrum</span>
                      </button>
                    </div>

                    {/* Active Color Preview & Hex Display */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1b1511] border border-[#2b221a]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md border border-white/30 shadow-xs shrink-0"
                          style={{ backgroundColor: baseColor }}
                        />
                        <span className="text-xs font-mono font-bold text-[#fce4ca]">{baseColor}</span>
                      </div>
                      <span className="text-[10px] text-[#8b7b6b]">Letterpress Paper</span>
                    </div>

                    {/* 2D Color Spectrum Picker (Image 3) */}
                    {activeColorPickerTab === 'paper' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={baseColor} onChange={setBaseColor} darkMode={true} />
                      </div>
                    )}

                    {/* Quick Curated Paper Swatches */}
                    <div className="grid grid-cols-7 gap-1.5 pt-1">
                      {[
                        { hex: '#fcfbf7', name: 'Linen Ivory' },
                        { hex: '#faf5ec', name: 'Warm Ecru' },
                        { hex: '#ffffff', name: 'Pure White' },
                        { hex: '#171921', name: 'Obsidian Noir' },
                        { hex: '#1b382b', name: 'Forest Sage' },
                        { hex: '#0f172a', name: 'Midnight Navy' },
                        { hex: '#fbf0ee', name: 'Blush Silk' },
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setBaseColor(col.hex)}
                          className={`h-6 rounded-md border shadow-xs cursor-pointer transition-transform ${
                            baseColor.toLowerCase() === col.hex.toLowerCase()
                              ? 'scale-110 border-white ring-2 ring-[#bd9661]'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 3. Default Foil & Border Color (2D Spectrum Picker) */}
                  <div className="pt-2 border-t border-[#2b221a] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661]">
                        Foil &amp; Typography Color
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'foil' ? null : 'foil')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          activeColorPickerTab === 'foil'
                            ? 'bg-[#bd9661] text-[#15110e]'
                            : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                        }`}
                      >
                        <span>🎨 2D Spectrum</span>
                      </button>
                    </div>

                    {/* Active Foil Preview */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1b1511] border border-[#2b221a]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md border border-white/30 shadow-xs shrink-0"
                          style={{ backgroundColor: foilColor }}
                        />
                        <span className="text-xs font-mono font-bold text-[#fce4ca]">{foilColor}</span>
                      </div>
                      <span className="text-[10px] text-[#8b7b6b]">Gilded Foil</span>
                    </div>

                    {/* 2D Color Spectrum Picker (Image 3) */}
                    {activeColorPickerTab === 'foil' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={foilColor} onChange={setFoilColor} darkMode={true} />
                      </div>
                    )}

                    {/* Quick Curated Foil Swatches */}
                    <div className="grid grid-cols-6 gap-1.5 pt-1">
                      {[
                        { hex: '#bd9661', name: 'Heirloom Gold' },
                        { hex: '#dfc194', name: 'Champagne Sheen' },
                        { hex: '#d4af9e', name: 'Rose Gold' },
                        { hex: '#d1d5db', name: 'Silver Platinum' },
                        { hex: '#966736', name: 'Rich Bronze' },
                        { hex: '#15110e', name: 'Ink Noir' },
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setFoilColor(col.hex)}
                          className={`h-6 rounded-md border shadow-xs cursor-pointer transition-transform ${
                            foilColor.toLowerCase() === col.hex.toLowerCase()
                              ? 'scale-110 border-white ring-2 ring-[#bd9661]'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 3B. Envelope Backdrop Presentation (Image 4 Style) */}
                  <div className="pt-2 border-t border-[#2b221a] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661]">
                        Envelope Backdrop (Image 4)
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showEnvelopeBackdrop}
                          onChange={(e) => setShowEnvelopeBackdrop(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-[#2b221a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#bd9661]"></div>
                      </label>
                    </div>

                    {showEnvelopeBackdrop && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#1b1511] border border-[#2b221a]">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-md border border-white/30 shadow-xs shrink-0"
                              style={{ backgroundColor: envelopeColor }}
                            />
                            <span className="text-xs font-mono font-bold text-[#fce4ca]">{envelopeColor}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'envelope' ? null : 'envelope')}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c] cursor-pointer"
                          >
                            🎨 Spectrum
                          </button>
                        </div>

                        {activeColorPickerTab === 'envelope' && (
                          <div className="pt-1">
                            <ColorPicker2D color={envelopeColor} onChange={setEnvelopeColor} darkMode={true} />
                          </div>
                        )}

                        <div className="grid grid-cols-5 gap-1.5">
                          {[
                            { hex: '#231c16', name: 'Deep Espresso' },
                            { hex: '#15110e', name: 'Onyx Noir' },
                            { hex: '#0e1c36', name: 'Midnight Navy' },
                            { hex: '#1c2e22', name: 'Hunter Green' },
                            { hex: '#faf5ec', name: 'Ecru Linen' },
                          ].map((col) => (
                            <button
                              key={col.hex}
                              type="button"
                              onClick={() => setEnvelopeColor(col.hex)}
                              className={`h-5 rounded border shadow-xs cursor-pointer transition-transform ${
                                envelopeColor.toLowerCase() === col.hex.toLowerCase()
                                  ? 'scale-110 border-white ring-2 ring-[#bd9661]'
                                  : 'border-white/20 hover:scale-105'
                              }`}
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>\n\n                  """

if color_sec_start != -1 and color_sec_end != -1:
    content = content[:color_sec_start] + new_color_sections + content[color_sec_end:]
    print("Replaced Left Card color controls with 2D Color Spectrum Pickers!")
else:
    print(f"Warning: color_sec_start={color_sec_start}, color_sec_end={color_sec_end}")

# 4. Add Envelope Backdrop presentation behind card (Image 4)
card_canvas_target = """              {/* ============================================================= */}
              {/* THE WEDDING CARD ON THE WHITEBOARD CANVAS                     */}
              {/* ============================================================= */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 relative"
              >"""

card_canvas_replacement = """              {/* ============================================================= */}
              {/* THE WEDDING CARD ON THE WHITEBOARD CANVAS (IMAGE 4 PRESENTATION) */}
              {/* ============================================================= */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 relative flex items-center justify-center"
              >
                {/* Envelope Presentation Backdrop (matching Image 4) */}
                {showEnvelopeBackdrop && (
                  <div
                    className="absolute -inset-x-6 -top-14 -bottom-6 rounded-3xl pointer-events-none transition-all duration-300 shadow-2xl z-0"
                    style={{ backgroundColor: envelopeColor }}
                  >
                    {/* Open Triangular Envelope Flap rising above card */}
                    <div
                      className="absolute -top-24 inset-x-0 h-32 pointer-events-none"
                      style={{
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                        backgroundColor: envelopeColor,
                        filter: 'brightness(1.18)',
                      }}
                    />
                    {/* Inner gold foil bevel accent on envelope rim */}
                    <div
                      className="absolute inset-2.5 rounded-2xl border pointer-events-none"
                      style={{ borderColor: `${foilColor}30`, borderWidth: '1px' }}
                    />
                  </div>
                )}"""

if card_canvas_target in content:
    content = content.replace(card_canvas_target, card_canvas_replacement)
    print("Added Envelope Backdrop presentation matching Image 4!")
else:
    print("Warning: card_canvas_target not found!")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved all refinements to SuperAdminCardStudio.tsx!")
