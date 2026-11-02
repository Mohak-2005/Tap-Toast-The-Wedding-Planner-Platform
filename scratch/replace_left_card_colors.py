import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '{/* 2. Card Background Paper Texture */}'
end_marker = '{/* 5. Predefined 3D Unboxing Motion */}'

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

print(f"start_pos: {start_pos}, end_pos: {end_pos}")

new_left_card_colors = """{/* 2. Card Background Paper (2D Spectrum Picker matching Image 3) */}
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

                  {/* 4. Envelope Backdrop Presentation (Image 4 Style) */}
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

if start_pos != -1 and end_pos != -1:
    content = content[:start_pos] + new_left_card_colors + content[end_pos:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced Left Card color sections with 2D Spectrum Pickers!")
else:
    print(f"Error finding markers: start={start_pos}, end={end_pos}")
    sys.exit(1)
