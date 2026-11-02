import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update coastal-harbor elements in INITIAL_TEMPLATES to match Image 2 exactly
old_coastal_harbor = '''  {
    id: 'coastal-harbor',
    name: 'Sydney Harbor & Fairy Lights',
    category: 'Coastal',
    animationType: 'Pocketfold Elevation & Twinkle',
    sourceType: 'designer',
    baseColor: '#0e1c36',
    foilColor: '#fae392',
    envelopeColor: '#0b162c',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'diamond-sparkle',
    duration: '1.8s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'ch-lights', type: 'graphic', content: 'fairy-lights', x: 50, y: 8, scale: 1.15, color: '#d6b87d', fillColor: '#fae392' },
      { id: 'ch-star-l', type: 'graphic', content: 'celestial-stars', x: 22, y: 15, scale: 0.75, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-star-r', type: 'graphic', content: 'celestial-stars', x: 78, y: 15, scale: 0.75, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-txt-1', type: 'text', content: 'YOU ARE CORDIALLY INVITED TO CELEBRATE', x: 50, y: 19, fontSize: 9, fontFamily: 'Cinzel', letterSpacing: '2px', isBold: true, color: '#fae392' },
      { id: 'ch-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 30, fontSize: 28, fontFamily: 'Playfair Display', isItalic: true, color: '#ffffff' },
      { id: 'ch-txt-3', type: 'text', content: 'UNDER THE HARBOR TWILIGHT & STARS', x: 50, y: 40, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#d6b87d' },
      { id: 'ch-txt-4', type: 'text', content: 'SATURDAY, 28 NOVEMBER 2026', x: 50, y: 49, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#ffffff' },
      { id: 'ch-txt-5', type: 'text', content: 'AT FIVE IN THE EVENING', x: 50, y: 56, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#d6b87d' },
      { id: 'ch-txt-6', type: 'text', content: 'WATSONS BAY BOUTIQUE HOTEL • SYDNEY', x: 50, y: 64, fontSize: 9.5, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.5px', color: '#fae392' },
      { id: 'ch-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 72, scale: 0.85, color: '#fae392' },
      { id: 'ch-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 82, scale: 0.95, color: '#fae392', fillColor: '#d4af37' },
      { id: 'ch-txt-7', type: 'text', content: 'RECEPTION BY THE WATER TO FOLLOW', x: 50, y: 92, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '2px', color: '#b8c7db' },
    ],
  },'''

new_coastal_harbor = '''  {
    id: 'coastal-harbor',
    name: 'Sydney Harbor & Fairy Lights',
    category: 'Coastal',
    animationType: 'Pocketfold Elevation & Twinkle',
    sourceType: 'designer',
    baseColor: '#0e1c36',
    foilColor: '#fae392',
    envelopeColor: '#0b162c',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'diamond-sparkle',
    duration: '1.8s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'ch-lights', type: 'graphic', content: 'fairy-lights', x: 50, y: 7, scale: 1.15, color: '#d6b87d', fillColor: '#fae392' },
      { id: 'ch-star-l', type: 'graphic', content: 'celestial-stars', x: 19, y: 13, scale: 0.7, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-star-r', type: 'graphic', content: 'celestial-stars', x: 81, y: 13, scale: 0.7, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-txt-1', type: 'text', content: "YOU'RE INVITED TO THE WEDDING OF", x: 50, y: 17, fontSize: 8.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#fae392' },
      { id: 'ch-txt-2', type: 'text', content: 'Olivia & James', x: 50, y: 28, fontSize: 32, fontFamily: 'Great Vibes', isItalic: true, color: '#ffffff' },
      { id: 'ch-txt-3', type: 'text', content: 'LOVE • FAMILY • CELEBRATION', x: 50, y: 37, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '3px', color: '#9ec1ee' },
      { id: 'ch-txt-4', type: 'text', content: 'SAT   |   28   |   NOV 2026', x: 50, y: 45, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#fae392' },
      { id: 'ch-txt-5', type: 'text', content: 'WATSONS BAY BOUTIQUE HOTEL • SYDNEY, NSW', x: 50, y: 53, fontSize: 9, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1px', color: '#ffffff' },
      { id: 'ch-qr', type: 'qrcode', content: 'qrcode-rsvp', x: 50, y: 69, scale: 1.05, color: '#fae392', fillColor: '#ffffff' },
      { id: 'ch-txt-6', type: 'text', content: 'DINNER, DRINKS & DANCING • SCAN TO RSVP', x: 50, y: 84, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '1.5px', isBold: true, color: '#fae392' },
      { id: 'ch-txt-7', type: 'text', content: 'Delivered with love to Priya Sharma', x: 50, y: 92, fontSize: 7.5, fontFamily: 'DM Sans', isItalic: true, color: '#9ec1ee' },
    ],
  },'''

code = code.replace(old_coastal_harbor, new_coastal_harbor)

# 2. Update magnolia-gold elements in INITIAL_TEMPLATES to match Invitation Demo exactly
old_magnolia_gold = '''  {
    id: 'magnolia-gold',
    name: 'Magnolia & Gilded Frame',
    category: 'Botanical',
    animationType: 'Classic Envelope Flap Pop',
    sourceType: 'designer',
    baseColor: '#fdfbf7',
    foilColor: '#c59a58',
    envelopeColor: '#201812',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'gold-dust',
    duration: '1.4s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'mg-flw-top', type: 'flower', content: 'magnolia-bloom', x: 18, y: 13, scale: 1.1, rotation: -20, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-top', type: 'leaf', content: 'eucalyptus-sprig', x: 28, y: 11, scale: 0.95, rotation: -45, color: '#44614d', fillColor: '#f2f7f3' },
      { id: 'mg-txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 17, fontSize: 9.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#c59a58' },
      { id: 'mg-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 28, fontSize: 28, fontFamily: 'Playfair Display', isItalic: true, color: '#1c150c' },
      { id: 'mg-txt-3', type: 'text', content: 'REQUEST THE HONOR OF YOUR PRESENCE', x: 50, y: 38, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#8b7454' },
      { id: 'mg-txt-4', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', x: 50, y: 48, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#c59a58' },
      { id: 'mg-txt-5', type: 'text', content: 'AT FOUR O\\'CLOCK IN THE AFTERNOON', x: 50, y: 55, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#8b7454' },
      { id: 'mg-txt-6', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY', x: 50, y: 63, fontSize: 9.5, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.5px', color: '#1c150c' },
      { id: 'mg-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 70, scale: 0.85, color: '#c59a58' },
      { id: 'mg-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 81, scale: 0.95, color: '#c59a58', fillColor: '#c59a58' },
      { id: 'mg-txt-7', type: 'text', content: 'RECEPTION TO FOLLOW', x: 50, y: 92, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '2px', color: '#8b7454' },
      { id: 'mg-flw-bot', type: 'flower', content: 'magnolia-bloom', x: 82, y: 87, scale: 1.05, rotation: 160, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-bot', type: 'leaf', content: 'eucalyptus-sprig', x: 74, y: 89, scale: 0.9, rotation: 135, color: '#44614d', fillColor: '#f2f7f3' },
    ],
  },'''

new_magnolia_gold = '''  {
    id: 'magnolia-gold',
    name: 'Magnolia & Gilded Frame',
    category: 'Botanical',
    animationType: 'Classic Envelope Flap Pop',
    sourceType: 'designer',
    baseColor: '#fdfbf7',
    foilColor: '#c59a58',
    envelopeColor: '#201812',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'gold-dust',
    duration: '1.4s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'mg-flw-top', type: 'flower', content: 'magnolia-bloom', x: 18, y: 12, scale: 1.1, rotation: -20, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-top', type: 'leaf', content: 'eucalyptus-sprig', x: 28, y: 10, scale: 0.95, rotation: -45, color: '#44614d', fillColor: '#f2f7f3' },
      { id: 'mg-txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 16, fontSize: 9.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#c59a58' },
      { id: 'mg-txt-2', type: 'text', content: 'Sophie Taylor', x: 50, y: 25, fontSize: 26, fontFamily: 'Playfair Display', isItalic: true, color: '#966d29' },
      { id: 'mg-txt-and', type: 'text', content: 'AND', x: 50, y: 31, fontSize: 8.5, fontFamily: 'Cinzel', letterSpacing: '3px', color: '#665747' },
      { id: 'mg-txt-3', type: 'text', content: 'Daniel Carter', x: 50, y: 38, fontSize: 26, fontFamily: 'Playfair Display', isItalic: true, color: '#966d29' },
      { id: 'mg-txt-4', type: 'text', content: 'INVITE YOU TO CELEBRATE THEIR WEDDING', x: 50, y: 46, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '1.5px', color: '#665747' },
      { id: 'mg-txt-5', type: 'text', content: 'SATURDAY   |   14   |   NOVEMBER 2026', x: 50, y: 53, fontSize: 10.5, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1px', color: '#966d29' },
      { id: 'mg-txt-6', type: 'text', content: 'AT 4:00 PM', x: 50, y: 59, fontSize: 8.5, fontFamily: 'Cinzel', letterSpacing: '1px', color: '#665747' },
      { id: 'mg-txt-7', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY, NSW', x: 50, y: 66, fontSize: 9, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.2px', color: '#1c150c' },
      { id: 'mg-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 73, scale: 0.85, color: '#c59a58' },
      { id: 'mg-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 83, scale: 0.95, color: '#c59a58', fillColor: '#c59a58' },
      { id: 'mg-txt-8', type: 'text', content: 'DINNER & DANCING TO FOLLOW', x: 50, y: 93, fontSize: 7.5, fontFamily: 'Cinzel', letterSpacing: '1.5px', color: '#665747' },
      { id: 'mg-flw-bot', type: 'flower', content: 'magnolia-bloom', x: 82, y: 88, scale: 1.05, rotation: 160, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-bot', type: 'leaf', content: 'eucalyptus-sprig', x: 74, y: 90, scale: 0.9, rotation: 135, color: '#44614d', fillColor: '#f2f7f3' },
    ],
  },'''

code = code.replace(old_magnolia_gold, new_magnolia_gold)

# 3. Reduce size of Custom Color Spectrum button and remove selected color bar in CARD BACKGROUND PAPER
old_paper_color_section = '''                  {/* 2. Card Background Paper (2D Spectrum Picker matching Image 3) */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Card Background Paper
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'paper' ? null : 'paper')}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          activeColorPickerTab === 'paper'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                      >
                        <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                        <span>Custom Color Spectrum</span>
                      </button>
                    </div>

                    {/* Active Color Preview & Hex Display */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf7f2] border border-[#e2d8c9]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md border border-white/30 shadow-xs shrink-0"
                          style={{ backgroundColor: baseColor }}
                        />
                        <span className="text-xs font-mono font-bold text-[#15110e]">{baseColor}</span>
                      </div>
                      <span className="text-[10px] text-[#8b7b6b]">Letterpress Paper</span>
                    </div>

                    {/* 2D Color Spectrum Picker (Image 3) */}
                    {activeColorPickerTab === 'paper' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={baseColor} onChange={setBaseColor} darkMode={false} />
                      </div>
                    )}'''

new_paper_color_section = '''                  {/* 2. Card Background Paper */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Card Background Paper
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'paper' ? null : 'paper')}
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                          activeColorPickerTab === 'paper'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                        title="Pick custom paper color from spectrum"
                      >
                        <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                        <span>Custom Color</span>
                      </button>
                    </div>

                    {/* 2D Color Spectrum Picker */}
                    {activeColorPickerTab === 'paper' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={baseColor} onChange={setBaseColor} darkMode={false} />
                      </div>
                    )}'''

code = code.replace(old_paper_color_section, new_paper_color_section)

# 4. Reduce size of Custom Color button and remove selected color bar in FOIL & TYPOGRAPHY COLOR
old_foil_color_section = '''                  {/* 3. Default Foil & Border Color (2D Spectrum Picker) */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Foil &amp; Typography Color
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'foil' ? null : 'foil')}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          activeColorPickerTab === 'foil'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                      >
                        <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                        <span>Custom Color Spectrum</span>
                      </button>
                    </div>

                    {/* Active Color Preview & Hex Display */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf7f2] border border-[#e2d8c9]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md border border-white/30 shadow-xs shrink-0"
                          style={{ backgroundColor: foilColor }}
                        />
                        <span className="text-xs font-mono font-bold text-[#15110e]">{foilColor}</span>
                      </div>
                      <span className="text-[10px] text-[#8b7b6b]">Gilded Foil</span>
                    </div>

                    {/* 2D Color Spectrum Picker (Image 3) */}
                    {activeColorPickerTab === 'foil' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={foilColor} onChange={setFoilColor} darkMode={false} />
                      </div>
                    )}'''

new_foil_color_section = '''                  {/* 3. Default Foil & Border Color */}
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
                    )}'''

code = code.replace(old_foil_color_section, new_foil_color_section)

# 5. Inspector Text Color: reduce button size & remove selected color hex display
old_inspector_text_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Text Color</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-mono font-bold text-[#15110e]">{selectedElement.color || foilColor}</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'text' ? null : 'text')}
                                      className={`text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                        inspectorColorPicker === 'text'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                                      <span>Custom Color Spectrum</span>
                                    </button>
                                  </div>
                                </div>'''

new_inspector_text_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Text Color</span>
                                  <button
                                    type="button"
                                    onClick={() => setInspectorColorPicker(inspectorColorPicker === 'text' ? null : 'text')}
                                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                      inspectorColorPicker === 'text'
                                        ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                        : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                    }`}
                                    title="Pick custom text color from spectrum"
                                  >
                                    <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                                    <span>Custom Color</span>
                                  </button>
                                </div>'''

code = code.replace(old_inspector_text_color, new_inspector_text_color)

# 6. Inspector Petal/Body Fill Color: reduce button size & remove selected color hex display
old_inspector_petal_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Petal / Body Fill Color</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-mono font-bold text-[#15110e]">{selectedElement.fillColor || '#ffffff'}</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'petal' ? null : 'petal')}
                                      className={`text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                        inspectorColorPicker === 'petal'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                                      <span>Custom Color Spectrum</span>
                                    </button>
                                  </div>
                                </div>'''

new_inspector_petal_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Petal / Body Fill Color</span>
                                  <button
                                    type="button"
                                    onClick={() => setInspectorColorPicker(inspectorColorPicker === 'petal' ? null : 'petal')}
                                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                      inspectorColorPicker === 'petal'
                                        ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                        : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                    }`}
                                    title="Pick custom fill color from spectrum"
                                  >
                                    <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                                    <span>Custom Color</span>
                                  </button>
                                </div>'''

code = code.replace(old_inspector_petal_color, new_inspector_petal_color)

# 7. Inspector Stroke / Foil Color: reduce button size & remove selected color hex display
old_inspector_stroke_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Stroke &amp; Foil Color</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-mono font-bold text-[#15110e]">{selectedElement.color || foilColor}</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'stroke' ? null : 'stroke')}
                                      className={`text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                        inspectorColorPicker === 'stroke'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                                      <span>Custom Color Spectrum</span>
                                    </button>
                                  </div>
                                </div>'''

new_inspector_stroke_color = '''                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Stroke &amp; Foil Color</span>
                                  <button
                                    type="button"
                                    onClick={() => setInspectorColorPicker(inspectorColorPicker === 'stroke' ? null : 'stroke')}
                                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                      inspectorColorPicker === 'stroke'
                                        ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                        : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                    }`}
                                    title="Pick custom stroke color from spectrum"
                                  >
                                    <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                                    <span>Custom Color</span>
                                  </button>
                                </div>'''

code = code.replace(old_inspector_stroke_color, new_inspector_stroke_color)

# 8. Settings Grid: Add Visual Miniature Card Previews to the 5 Cards and remove palette dots
old_settings_card = '''              <div>
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
              </div>'''

new_settings_card = '''              <div>
                {/* Category Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#e2d8c9] text-[#786452]">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] text-[#8b7b6b] font-medium">
                    {CARD_SHAPES.find((s) => s.id === tpl.cardShape)?.name || 'Classic Silhouette'}
                  </span>
                </div>

                {/* Exact Card Design Visual Preview (Thumbnail Matching Invitation Demo) */}
                <div
                  className="relative w-full h-44 rounded-xl overflow-hidden p-3.5 my-2 flex flex-col items-center justify-center text-center shadow-md select-none border transition-all duration-300 group-hover:shadow-lg cursor-pointer"
                  onClick={() => handleOpenDesignerFor(tpl)}
                  style={{
                    backgroundColor: tpl.baseColor,
                    borderColor: tpl.foilColor + '60',
                  }}
                >
                  {/* Envelope backdrop hint */}
                  <div
                    className="absolute -bottom-3 inset-x-2 h-10 rounded-t-xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: tpl.envelopeColor }}
                  />

                  {/* Inner gilded silhouette frame */}
                  <div
                    className={`absolute inset-2 border pointer-events-none transition-all ${
                      tpl.cardShape === 'arch-dome'
                        ? 'rounded-t-[34px] rounded-b-lg'
                        : tpl.cardShape === 'scallop-ornate'
                        ? 'rounded-2xl'
                        : 'rounded-lg'
                    }`}
                    style={{ borderColor: tpl.foilColor + '70' }}
                  />

                  {/* Design Highlights & Artwork for this Theme */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-1">
                    {/* Decorative Top Accent */}
                    <div className="text-xs tracking-widest" style={{ color: tpl.foilColor }}>
                      {tpl.id === 'coastal-harbor' && (
                        <span className="font-mono text-[10px] tracking-[4px] drop-shadow-xs">✨ • • ✨ • • ✨</span>
                      )}
                      {tpl.id === 'midnight-protea' && (
                        <span className="text-[11px] tracking-[3px]">🌹 ✦ 🌿 ✦ 🌹</span>
                      )}
                      {tpl.id === 'native-wattle' && (
                        <span className="text-[11px] tracking-[3px]">🌿 ✦ 🌼 ✦ 🌿</span>
                      )}
                      {tpl.id === 'vineyard-arch' && (
                        <span className="text-[11px] tracking-[3px]">🍇 ✦ ⌒ ✦ 🍇</span>
                      )}
                      {tpl.id === 'magnolia-gold' && (
                        <span className="text-[11px] tracking-[3px]">🌸 ✦ 👑 ✦ 🌸</span>
                      )}
                    </div>

                    {/* Header Line */}
                    <div
                      className="text-[8px] font-sans font-bold uppercase tracking-[2px] opacity-80"
                      style={{ color: tpl.foilColor }}
                    >
                      {tpl.id === 'coastal-harbor'
                        ? "YOU'RE INVITED"
                        : tpl.id === 'native-wattle'
                        ? 'CELEBRATE THE MARRIAGE'
                        : 'TOGETHER WITH FAMILIES'}
                    </div>

                    {/* Couple Name rendered in authentic font */}
                    <div
                      className="font-serif italic text-lg leading-tight font-medium drop-shadow-2xs"
                      style={{
                        color: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? '#ffffff' : tpl.foilColor,
                        fontFamily: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? 'Great Vibes, cursive' : 'Playfair Display, serif',
                      }}
                    >
                      {tpl.id === 'coastal-harbor' ? 'Olivia & James' : 'Sophie & Daniel'}
                    </div>

                    {/* Date Bar */}
                    <div
                      className="text-[8.5px] font-serif font-bold tracking-wider uppercase opacity-90 px-2 py-0.5 rounded"
                      style={{
                        color: tpl.id === 'coastal-harbor' ? '#fae392' : tpl.foilColor,
                        backgroundColor: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      {tpl.id === 'coastal-harbor' ? 'SAT | 28 NOV 2026' : 'SAT | 14 NOV 2026'}
                    </div>

                    {/* Venue / Location */}
                    <div
                      className="text-[8px] font-sans font-medium tracking-wide opacity-80 line-clamp-1"
                      style={{ color: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? '#ffffff' : '#2c221a' }}
                    >
                      {tpl.id === 'coastal-harbor'
                        ? 'Watsons Bay Boutique Hotel • Sydney'
                        : tpl.id === 'midnight-protea'
                        ? 'Doltone House • Sydney Harbour'
                        : tpl.id === 'native-wattle'
                        ? 'Woodlands Estate • Blue Mountains'
                        : tpl.id === 'vineyard-arch'
                        ? 'Bimbadgen Estate • Hunter Valley'
                        : 'The Botanical Garden • Sydney'}
                    </div>

                    {/* Seal / QR icon hint */}
                    <div className="pt-0.5 opacity-85">
                      {tpl.id === 'coastal-harbor' ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-black font-mono font-bold">QR RSVP</span>
                      ) : (
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white shadow-xs"
                          style={{ backgroundColor: tpl.foilColor }}
                        >
                          {tpl.id === 'midnight-protea' ? '🌹' : tpl.id === 'native-wattle' ? '🌿' : tpl.id === 'vineyard-arch' ? '✦' : '👑'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Theme Name */}
                <h4 className="font-serif text-[15px] font-bold text-[#15110e] group-hover:text-[#bd9661] transition-colors line-clamp-1 mt-1">
                  {tpl.name}
                </h4>
              </div>'''

code = code.replace(old_settings_card, new_settings_card)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("SuperAdminCardStudio.tsx updated successfully with design previews & clean color controls!")
