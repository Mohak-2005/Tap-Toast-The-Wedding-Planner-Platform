with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Lines 1874 to 1980 (Foil & Typography Color + Envelope Backdrop)
# Find start of Foil & Typography Color
foil_start = content.find('{/* 3. Default Foil & Border Color')
envelope_end = content.find('{/* 5. Predefined 3D Unboxing Motion')
assert foil_start != -1 and envelope_end != -1, "foil_start or envelope_end not found"

clean_foil_envelope = '''{/* 3. Default Foil & Border Color */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Foil &amp; Typography Color
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'foil' ? null : 'foil')}
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                          activeColorPickerTab === 'foil'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                        title="Pick custom foil color from spectrum"
                      >
                        <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                        <span>Custom Color</span>
                      </button>
                    </div>

                    {/* 2D Color Spectrum Picker */}
                    {activeColorPickerTab === 'foil' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={foilColor} onChange={setFoilColor} darkMode={false} />
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

                  {/* 4. Envelope Backdrop Presentation */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Envelope Backdrop
                      </div>
                      <div className="flex items-center gap-2">
                        {showEnvelopeBackdrop && (
                          <button
                            type="button"
                            onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'envelope' ? null : 'envelope')}
                            className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                              activeColorPickerTab === 'envelope'
                                ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                                : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                            }`}
                            title="Pick custom envelope color from spectrum"
                          >
                            <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                            <span>Custom Color</span>
                          </button>
                        )}
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
                    </div>

                    {showEnvelopeBackdrop && (
                      <div className="space-y-1.5 animate-fadeIn">
                        {activeColorPickerTab === 'envelope' && (
                          <div className="pt-1">
                            <ColorPicker2D color={envelopeColor} onChange={setEnvelopeColor} darkMode={false} />
                          </div>
                        )}

                        <div className="grid grid-cols-5 gap-1.5 pt-1">
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
                  </div>

                  '''

content = content[:foil_start] + clean_foil_envelope + content[envelope_end:]

# Fix 2: Around Rotation / Direct Resizing
old_resize_rot = '''                          {/* Direct Word-Style Resize & Rotation */}
                          <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                            <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e2d8c9] space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                <span>Rotation</span>'''

new_resize_rot = '''                          {/* Direct Word-Style Resize & Rotation */}
                          <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                <span>Rotation</span>'''

assert old_resize_rot in content, "old_resize_rot not found"
content = content.replace(old_resize_rot, new_resize_rot, 1)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Fixed SuperAdminCardStudio.tsx cleanly!")
