with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# -----------------------------------------------------------------------------
# 1. Card 1 (Left) Styling: High contrast, proper buttons, readable text
# -----------------------------------------------------------------------------

# Left Card Aside Container
text = text.replace(
    'className={`absolute top-4 left-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#15110e]/95 backdrop-blur-md border border-[#bd9661]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto',
    'className={`absolute top-4 left-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#fefdfb]/98 backdrop-blur-md border border-[#dfd4c5] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto text-[#15110e]'
)

# Left Card Header
old_left_header = '''                {/* Header */}
                <div className="h-12 px-4 bg-[#1b1511] border-b border-[#2b221a] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <PaletteIcon className="w-4 h-4 text-[#bd9661]" />
                    <h3 className="font-serif text-xs font-bold text-[#fce4ca] tracking-wide">
                      Card Aesthetic &amp; Motion
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#241c16] text-[#bd9661] border border-[#bd9661]/30">
                      Base Card
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLeftCollapsed(true)}
                      className="w-6 h-6 rounded bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] flex items-center justify-center text-xs transition-all cursor-pointer"
                      title="Hide Panel"
                    >
                      <ChevronLeftIcon className="w-3.5 h-3.5 text-[#dfc194]" />
                    </button>
                  </div>
                </div>'''

new_left_header = '''                {/* Header */}
                <div className="h-12 px-4 bg-[#f8f4ee] border-b border-[#e8ded0] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#bd9661]/15 border border-[#bd9661]/30 flex items-center justify-center text-[#96713e]">
                      <PaletteIcon className="w-4 h-4 text-[#96713e]" />
                    </div>
                    <h3 className="font-serif text-xs font-bold text-[#15110e] tracking-wide">
                      Card Aesthetic &amp; Motion
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f0eae1] text-[#7a6248] border border-[#dfd4c5]">
                      Base Card
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLeftCollapsed(true)}
                      className="w-6 h-6 rounded bg-[#ede5d8] hover:bg-[#ded3c2] text-[#5c4632] flex items-center justify-center text-xs transition-all cursor-pointer"
                      title="Hide Panel"
                    >
                      <ChevronLeftIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>'''

if old_left_header in text:
    text = text.replace(old_left_header, new_left_header)
else:
    print("Warning: old_left_header not matched.")

# Left Card Section Headers and Shape Buttons
text = text.replace(
    'text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-2 flex items-center justify-between',
    'text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-2 flex items-center justify-between'
)

text = text.replace(
    '<span className="text-[9px] text-[#8b7b6b]">{activeShapeObj.name}</span>',
    '<span className="text-[9px] font-mono font-bold text-[#15110e] bg-[#f0eae1] px-1.5 py-0.5 rounded">{activeShapeObj.name}</span>'
)

# Silhouette shape buttons
old_shape_btn = '''                          className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            cardShape === shape.id
                              ? 'bg-[#2b221a] text-[#bd9661] font-bold border border-[#bd9661] ring-1 ring-[#bd9661]/50'
                              : 'bg-[#1d1713] border border-[#2b221a] hover:bg-[#241c16] text-[#c5b5a5]'
                          }`}'''

new_shape_btn = '''                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            cardShape === shape.id
                              ? 'bg-[#15110e] text-[#fce4ca] font-bold border border-[#bd9661] shadow-sm ring-1 ring-[#bd9661]'
                              : 'bg-[#faf7f2] border border-[#e2d8c9] hover:bg-white hover:border-[#bd9661] text-[#2c221a]'
                          }`}'''

text = text.replace(old_shape_btn, new_shape_btn)

text = text.replace(
    '<span className="w-4 h-4 rounded-xs border border-[#bd9661]/40 flex items-center justify-center text-[10px]">',
    '<span className="w-5 h-5 rounded border border-[#d0c4b2] bg-white text-[#5c4632] flex items-center justify-center text-xs font-bold">'
)

text = text.replace(
    '<span className="text-[9px] opacity-60 truncate max-w-[100px]">{shape.desc.slice(0, 16)}...</span>',
    '<span className="text-[9px] opacity-70 truncate max-w-[100px]">{shape.desc.slice(0, 16)}...</span>'
)

# Left Card Borders & Swatches
text = text.replace('pt-2 border-t border-[#2b221a] space-y-2', 'pt-3 border-t border-[#ede5d8] space-y-2')
text = text.replace('pt-2 border-t border-[#2b221a]', 'pt-3 border-t border-[#ede5d8]')

# 2D Spectrum Button in Left Card (paper & foil)
old_spectrum_toggle_paper = '''                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'paper' ? null : 'paper')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          activeColorPickerTab === 'paper'
                            ? 'bg-[#bd9661] text-[#15110e]'
                            : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                        }`}
                      >
                        <span>🎨 2D Spectrum</span>
                      </button>'''

new_spectrum_toggle_paper = '''                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'paper' ? null : 'paper')}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          activeColorPickerTab === 'paper'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                      >
                        <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                        <span>2D Spectrum</span>
                      </button>'''

text = text.replace(old_spectrum_toggle_paper, new_spectrum_toggle_paper)

old_spectrum_toggle_foil = '''                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'foil' ? null : 'foil')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          activeColorPickerTab === 'foil'
                            ? 'bg-[#bd9661] text-[#15110e]'
                            : 'bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c]'
                        }`}
                      >
                        <span>🎨 2D Spectrum</span>
                      </button>'''

new_spectrum_toggle_foil = '''                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'foil' ? null : 'foil')}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          activeColorPickerTab === 'foil'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                      >
                        <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                        <span>2D Spectrum</span>
                      </button>'''

text = text.replace(old_spectrum_toggle_foil, new_spectrum_toggle_foil)

# Color Preview boxes
text = text.replace(
    'flex items-center justify-between p-2 rounded-xl bg-[#1b1511] border border-[#2b221a]',
    'flex items-center justify-between p-2 rounded-xl bg-[#faf7f2] border border-[#e2d8c9]'
)
text = text.replace('text-xs font-mono font-bold text-[#fce4ca]', 'text-xs font-mono font-bold text-[#15110e]')
text = text.replace('darkMode={true}', 'darkMode={false}')

# Envelope toggle button in Left Card
old_env_btn = '''                          <button
                            type="button"
                            onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'envelope' ? null : 'envelope')}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#241c16] text-[#dfc194] hover:bg-[#2e231c] cursor-pointer"
                          >
                            🎨 Spectrum
                          </button>'''

new_env_btn = '''                          <button
                            type="button"
                            onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'envelope' ? null : 'envelope')}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                              activeColorPickerTab === 'envelope'
                                ? 'bg-[#bd9661] text-white'
                                : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                            }`}
                          >
                            <PaletteIcon className="w-3 h-3 inline mr-1 text-[#bd9661]" />
                            <span>Spectrum</span>
                          </button>'''

text = text.replace(old_env_btn, new_env_btn)

# Predefined 3D animation cards
old_anim_card = '''                          className={`p-2 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            animationType === anim.name
                              ? 'bg-[#2b221a] border border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]/40'
                              : 'bg-[#1d1713] border border-[#2b221a] hover:bg-[#241c16] text-[#c5b5a5]'
                          }`}'''

new_anim_card = '''                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            animationType === anim.name
                              ? 'bg-[#15110e] border border-[#bd9661] text-[#fce4ca] font-bold shadow-xs ring-1 ring-[#bd9661]'
                              : 'bg-[#faf7f2] border border-[#e2d8c9] hover:bg-white hover:border-[#bd9661] text-[#2c221a]'
                          }`}'''

text = text.replace(old_anim_card, new_anim_card)

# Animation bottom action buttons
old_anim_actions = '''                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePlayAnimation}
                        className="flex-1 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] border border-[#bd9661]/40 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>▶</span>
                        <span>{isPlayingMotion ? 'Simulating...' : 'Simulate Motion'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="py-1.5 px-2.5 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] border border-[#bd9661]/40 text-xs font-semibold cursor-pointer transition-all"
                        title="Upload bespoke animation file"
                      >
                        ⬆ Upload File
                      </button>
                    </div>'''

new_anim_actions = '''                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePlayAnimation}
                        className="flex-1 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <PlayIcon className="w-3 h-3 text-[#bd9661]" />
                        <span>{isPlayingMotion ? 'Simulating...' : 'Simulate Motion'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5] text-xs font-semibold cursor-pointer transition-all shadow-2xs flex items-center gap-1"
                        title="Upload bespoke animation file"
                      >
                        <UploadCloudIcon className="w-3.5 h-3.5 text-[#8c6b3e]" />
                        <span>Upload</span>
                      </button>
                    </div>'''

text = text.replace(old_anim_actions, new_anim_actions)

# -----------------------------------------------------------------------------
# 2. Card 2 (Right) Styling: High contrast, proper buttons, readable text
# -----------------------------------------------------------------------------

# Right Card Aside Container
text = text.replace(
    'className={`absolute top-4 right-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#15110e]/95 backdrop-blur-md border border-[#bd9661]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto',
    'className={`absolute top-4 right-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#fefdfb]/98 backdrop-blur-md border border-[#dfd4c5] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto text-[#15110e]'
)

# Right Card Header Tabs
old_right_header = '''                {/* Header: Segmented Tabs */}
                <div className="h-12 px-3 bg-[#1b1511] border-b border-[#2b221a] flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center bg-[#15110e] p-0.5 rounded-xl border border-[#3d3024] flex-1">
                    <button
                      type="button"
                      onClick={() => setRightCardMode('design-box')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        rightCardMode === 'design-box'
                          ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-xs'
                          : 'text-[#c5b5a5] hover:text-white'
                      }`}
                    >
                      <GridIcon className="w-3.5 h-3.5 text-[#bd9661]" />
                      <span>Design Box</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRightCardMode('inspector')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                        rightCardMode === 'inspector'
                          ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-xs'
                          : 'text-[#c5b5a5] hover:text-white'
                      }`}
                    >
                      <InspectorIcon className="w-3.5 h-3.5 text-[#bd9661]" />
                      <span>Inspector</span>
                      {selectedElement && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661] animate-pulse ml-0.5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRightCollapsed(true)}
                    className="w-6 h-6 rounded bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] flex items-center justify-center text-xs transition-all cursor-pointer shrink-0"
                    title="Hide Panel"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5 text-[#dfc194]" />
                  </button>
                </div>'''

new_right_header = '''                {/* Header: Segmented Tabs */}
                <div className="h-12 px-3 bg-[#f8f4ee] border-b border-[#e8ded0] flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center bg-[#ede5d8] p-0.5 rounded-xl border border-[#ded3c2] flex-1">
                    <button
                      type="button"
                      onClick={() => setRightCardMode('design-box')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        rightCardMode === 'design-box'
                          ? 'bg-white text-[#15110e] font-bold shadow-xs border border-[#ded3c2]'
                          : 'text-[#6e5d4e] hover:text-[#15110e]'
                      }`}
                    >
                      <GridIcon className="w-3.5 h-3.5 text-[#96713e]" />
                      <span>Design Box</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRightCardMode('inspector')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                        rightCardMode === 'inspector'
                          ? 'bg-white text-[#15110e] font-bold shadow-xs border border-[#ded3c2]'
                          : 'text-[#6e5d4e] hover:text-[#15110e]'
                      }`}
                    >
                      <InspectorIcon className="w-3.5 h-3.5 text-[#96713e]" />
                      <span>Inspector</span>
                      {selectedElement && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661] animate-pulse ml-0.5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRightCollapsed(true)}
                    className="w-6 h-6 rounded bg-[#ede5d8] hover:bg-[#ded3c2] text-[#5c4632] flex items-center justify-center text-xs transition-all cursor-pointer shrink-0"
                    title="Hide Panel"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>'''

if old_right_header in text:
    text = text.replace(old_right_header, new_right_header)
else:
    print("Warning: old_right_header not matched.")

# Filter pills in Design Box
old_pills_class = '''                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                            designBoxCategory === cat.id
                              ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-xs'
                              : 'bg-[#1d1713] text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white border border-[#2b221a]'
                          }`}'''

new_pills_class = '''                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                            designBoxCategory === cat.id
                              ? 'bg-[#15110e] text-[#fce4ca] font-bold shadow-xs'
                              : 'bg-[#faf7f2] text-[#5c483a] hover:bg-white hover:text-[#15110e] border border-[#e2d8c9]'
                          }`}'''

text = text.replace(old_pills_class, new_pills_class)

# Design box items
old_item_tile = '''                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              addElementToCanvas({
                                type: item.type,
                                content: item.content,
                                name: item.name,
                                fillColor: item.fillColor,
                                fontSize: item.fontSize,
                                fontFamily: item.fontFamily,
                                isBold: item.isBold,
                                isItalic: item.isItalic,
                                letterSpacing: item.letterSpacing,
                                shimmer: item.shimmer,
                              });
                            }}
                            className="p-2.5 rounded-xl bg-[#1d1713] border border-[#2b221a] hover:border-[#bd9661] hover:bg-[#241c16] flex flex-col items-center gap-2 transition-all cursor-pointer group shadow-2xs relative"
                          >
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#241c16] group-hover:bg-[#bd9661] text-[#bd9661] group-hover:text-[#15110e] text-[10px] font-bold inline-grid place-items-center transition-colors">
                              +
                            </span>

                            {item.type === 'text' ? (
                              <div
                                className="w-12 h-12 rounded-lg bg-[#15110e] border border-[#3d3024] flex items-center justify-center font-serif text-lg text-[#bd9661] font-bold group-hover:scale-105 transition-transform"
                                style={{
                                  fontFamily: item.fontFamily === 'script' ? 'Pinyon Script, cursive' : item.fontFamily === 'serif' ? 'Playfair Display, serif' : 'DM Sans, sans-serif'
                                }}
                              >
                                {item.fontFamily === 'script' ? 'S' : item.fontFamily === 'serif' ? 'A' : 'T'}
                              </div>
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {SVG_ASSETS[item.content]?.render(foilColor, item.fillColor || '#ffffff')}
                              </div>
                            )}

                            <span className="text-[11px] font-medium text-[#fce4ca] text-center leading-tight line-clamp-1">
                              {item.name}
                            </span>
                          </button>'''

new_item_tile = '''                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              addElementToCanvas({
                                type: item.type,
                                content: item.content,
                                name: item.name,
                                fillColor: item.fillColor,
                                fontSize: item.fontSize,
                                fontFamily: item.fontFamily,
                                isBold: item.isBold,
                                isItalic: item.isItalic,
                                letterSpacing: item.letterSpacing,
                                shimmer: item.shimmer,
                              });
                            }}
                            className="p-2.5 rounded-xl bg-white border border-[#e2d8c9] hover:border-[#bd9661] hover:shadow-xs flex flex-col items-center gap-2 transition-all cursor-pointer group shadow-2xs relative"
                          >
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#f2eae0] group-hover:bg-[#15110e] text-[#8c6b3e] group-hover:text-[#fce4ca] text-[10px] font-bold inline-grid place-items-center transition-colors">
                              +
                            </span>

                            {item.type === 'text' ? (
                              <div
                                className="w-12 h-12 rounded-lg bg-[#faf7f2] border border-[#e2d8c9] flex items-center justify-center font-serif text-lg text-[#96713e] font-bold group-hover:scale-105 transition-transform"
                                style={{
                                  fontFamily: item.fontFamily === 'script' ? 'Pinyon Script, cursive' : item.fontFamily === 'serif' ? 'Playfair Display, serif' : 'DM Sans, sans-serif'
                                }}
                              >
                                {item.fontFamily === 'script' ? 'S' : item.fontFamily === 'serif' ? 'A' : 'T'}
                              </div>
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {SVG_ASSETS[item.content]?.render(foilColor, item.fillColor || '#ffffff')}
                              </div>
                            )}

                            <span className="text-[11px] font-semibold text-[#15110e] text-center leading-tight line-clamp-1">
                              {item.name}
                            </span>
                          </button>'''

text = text.replace(old_item_tile, new_item_tile)

# Inspector Header Elements
old_inspector_header = '''                          {/* Element Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-[#2b221a]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-[#241c16] flex items-center justify-center text-[#bd9661]">
                                {selectedElement.type === 'flower' ? <FlowerIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'leaf' ? <LeafIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'text' ? <TypographyIcon className="w-3.5 h-3.5" /> : <DecorIcon className="w-3.5 h-3.5" />}
                              </span>
                              <span className="font-serif text-xs font-bold text-[#fce4ca] truncate max-w-[150px]">
                                {selectedElement.type === 'text' ? selectedElement.content || 'Text Element' : SVG_ASSETS[selectedElement.content]?.name || 'Artwork'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={duplicateSelectedElement}
                                className="w-6 h-6 rounded bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] flex items-center justify-center text-xs transition-all cursor-pointer"
                                title="Duplicate element"
                              >
                                ⧉
                              </button>
                              <button
                                type="button"
                                onClick={deleteSelectedElement}
                                className="w-6 h-6 rounded bg-[#241c16] hover:bg-red-950/40 text-red-400 flex items-center justify-center text-xs transition-all cursor-pointer"
                                title="Delete element"
                              >
                                🗑
                              </button>
                            </div>
                          </div>'''

new_inspector_header = '''                          {/* Element Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-[#ede5d8]">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-[#f2eae0] border border-[#e2d8c9] flex items-center justify-center text-[#96713e]">
                                {selectedElement.type === 'flower' ? <FlowerIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'leaf' ? <LeafIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'text' ? <TypographyIcon className="w-3.5 h-3.5" /> : <DecorIcon className="w-3.5 h-3.5" />}
                              </span>
                              <span className="font-serif text-xs font-bold text-[#15110e] truncate max-w-[150px]">
                                {selectedElement.type === 'text' ? selectedElement.content || 'Text Element' : SVG_ASSETS[selectedElement.content]?.name || 'Artwork'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={duplicateSelectedElement}
                                className="w-7 h-7 rounded-lg bg-[#faf7f2] hover:bg-white border border-[#e2d8c9] text-[#5c4632] flex items-center justify-center text-xs transition-all cursor-pointer shadow-2xs"
                                title="Duplicate element"
                              >
                                <DuplicateIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={deleteSelectedElement}
                                className="w-7 h-7 rounded-lg bg-[#faf7f2] hover:bg-red-50 border border-[#e2d8c9] text-red-500 flex items-center justify-center text-xs transition-all cursor-pointer shadow-2xs"
                                title="Delete element"
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>'''

text = text.replace(old_inspector_header, new_inspector_header)

# Text Content Textarea in Inspector
text = text.replace(
    'className="w-full bg-[#1b1511] border border-[#3d3024] focus:border-[#bd9661] rounded-lg p-2 text-xs text-white focus:outline-none font-serif resize-none"',
    'className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl p-2.5 text-xs text-[#15110e] focus:outline-none font-serif resize-none shadow-2xs"'
)

# Text 2D Spectrum Toggle in Inspector
old_inspector_text_spectrum_btn = '''                                    <button
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
                                    </button>'''

new_inspector_text_spectrum_btn = '''                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'text' ? null : 'text')}
                                      className={`text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                        inspectorColorPicker === 'text'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                                      <span>2D Spectrum</span>
                                    </button>'''

text = text.replace(old_inspector_text_spectrum_btn, new_inspector_text_spectrum_btn)

# Petal 2D Spectrum Toggle in Inspector
old_inspector_petal_spectrum_btn = '''                                    <button
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
                                    </button>'''

new_inspector_petal_spectrum_btn = '''                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'petal' ? null : 'petal')}
                                      className={`text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                        inspectorColorPicker === 'petal'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                                      <span>2D Spectrum</span>
                                    </button>'''

text = text.replace(old_inspector_petal_spectrum_btn, new_inspector_petal_spectrum_btn)

# Stroke 2D Spectrum Toggle in Inspector
old_inspector_stroke_spectrum_btn = '''                                    <button
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
                                    </button>'''

new_inspector_stroke_spectrum_btn = '''                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'stroke' ? null : 'stroke')}
                                      className={`text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                        inspectorColorPicker === 'stroke'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-3 h-3 text-[#bd9661]" />
                                      <span>2D Spectrum</span>
                                    </button>'''

text = text.replace(old_inspector_stroke_spectrum_btn, new_inspector_stroke_spectrum_btn)

# Font size presets in inspector
old_font_sz = '''                                  {[10, 14, 18, 24, 32].map((sz) => (
                                    <button
                                      key={sz}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fontSize: sz } : el))
                                        );
                                      }}
                                      className={`px-2 py-0.5 rounded border cursor-pointer ${
                                        selectedElement.fontSize === sz ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661]' : 'bg-[#241c16] border-[#3d3024] text-[#d9c9b8]'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  ))}'''

new_font_sz = '''                                  {[10, 14, 18, 24, 32].map((sz) => (
                                    <button
                                      key={sz}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fontSize: sz } : el))
                                        );
                                      }}
                                      className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                                        selectedElement.fontSize === sz
                                          ? 'bg-[#15110e] text-[#fce4ca] border-[#bd9661] shadow-xs'
                                          : 'bg-[#faf7f2] border-[#e0d6c7] text-[#2c221a] hover:bg-white'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  ))}'''

text = text.replace(old_font_sz, new_font_sz)

# Bold & Italic buttons in inspector
old_bold_italic = '''                              <div className="pt-2 border-t border-[#2b221a] flex items-center justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, isBold: !el.isBold } : el))
                                    );
                                  }}
                                  className={`flex-1 py-1 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                                    selectedElement.isBold ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661] shadow-xs' : 'bg-[#241c16] border-[#3d3024] text-white hover:bg-[#2b221a]'
                                  }`}
                                  title="Toggle Bold"
                                >
                                  Bold (B)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, isItalic: !el.isItalic } : el))
                                    );
                                  }}
                                  className={`flex-1 py-1 rounded-lg border italic text-xs transition-all cursor-pointer ${
                                    selectedElement.isItalic ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661] shadow-xs font-bold' : 'bg-[#241c16] border-[#3d3024] text-white hover:bg-[#2b221a]'
                                  }`}
                                  title="Toggle Italic"
                                >
                                  Italic (I)
                                </button>
                              </div>'''

new_bold_italic = '''                              <div className="pt-2 border-t border-[#ede5d8] flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, isBold: !el.isBold } : el))
                                    );
                                  }}
                                  className={`flex-1 py-1.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                                    selectedElement.isBold ? 'bg-[#bd9661] text-white border-[#a8824f] shadow-xs' : 'bg-[#faf7f2] border-[#e0d6c7] text-[#2c221a] hover:bg-white'
                                  }`}
                                  title="Toggle Bold"
                                >
                                  Bold (B)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, isItalic: !el.isItalic } : el))
                                    );
                                  }}
                                  className={`flex-1 py-1.5 rounded-xl border italic text-xs transition-all cursor-pointer ${
                                    selectedElement.isItalic ? 'bg-[#bd9661] text-white border-[#a8824f] shadow-xs font-bold' : 'bg-[#faf7f2] border-[#e0d6c7] text-[#2c221a] hover:bg-white'
                                  }`}
                                  title="Toggle Italic"
                                >
                                  Italic (I)
                                </button>
                              </div>'''

text = text.replace(old_bold_italic, new_bold_italic)

# Font family buttons
old_font_fam = '''                                  {[
                                    { id: 'serif', label: 'Serif' },
                                    { id: 'script', label: 'Script' },
                                    { id: 'sans', label: 'Sans' },
                                  ].map((f) => (
                                    <button
                                      key={f.id}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fontFamily: f.id as any } : el))
                                        );
                                      }}
                                      className={`py-1 rounded-lg border cursor-pointer ${
                                        selectedElement.fontFamily === f.id
                                          ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661] font-bold'
                                          : 'bg-[#241c16] border-[#3d3024] text-[#d9c9b8] hover:bg-[#2b221a]'
                                      }`}
                                    >
                                      {f.label}
                                    </button>
                                  ))}'''

new_font_fam = '''                                  {[
                                    { id: 'serif', label: 'Serif' },
                                    { id: 'script', label: 'Script' },
                                    { id: 'sans', label: 'Sans' },
                                  ].map((f) => (
                                    <button
                                      key={f.id}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fontFamily: f.id as any } : el))
                                        );
                                      }}
                                      className={`py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                        selectedElement.fontFamily === f.id
                                          ? 'bg-[#15110e] text-[#fce4ca] border-[#bd9661] font-bold shadow-xs'
                                          : 'bg-[#faf7f2] border-[#e0d6c7] text-[#2c221a] hover:bg-white'
                                      }`}
                                    >
                                      {f.label}
                                    </button>
                                  ))}'''

text = text.replace(old_font_fam, new_font_fam)

# Shimmer buttons in inspector
old_shimmer_btn = '''                                      className={`py-1 px-1.5 rounded-lg border text-center text-[10px] font-medium cursor-pointer transition-all ${
                                        (selectedElement.shimmer || 'none') === sh.id
                                          ? 'bg-[#2b221a] border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]'
                                          : 'bg-[#241c16] border-[#3d3024] text-[#c5b5a5] hover:bg-[#2b221a]'
                                      }`}'''

new_shimmer_btn = '''                                      className={`py-1.5 px-2 rounded-xl border text-center text-[10px] font-semibold cursor-pointer transition-all ${
                                        (selectedElement.shimmer || 'none') === sh.id
                                          ? 'bg-[#15110e] border-[#bd9661] text-[#fce4ca] font-bold shadow-xs ring-1 ring-[#bd9661]'
                                          : 'bg-[#faf7f2] border-[#e0d6c7] text-[#5c483a] hover:bg-white'
                                      }`}'''

text = text.replace(old_shimmer_btn, new_shimmer_btn)

# Remove the scale slider and replace with direct Word-style resize guidance
old_scale_slider_block = '''                          {/* Common Scale, Rotation, Opacity */}
                          <div className="pt-2 border-t border-[#2b221a] space-y-2.5">
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

new_scale_slider_block = '''                          {/* Common Word-Style Direct Resize & Rotation */}
                          <div className="pt-2 border-t border-[#ede5d8] space-y-2.5">
                            <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#e2d8c9] space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold uppercase tracking-[1.2px] text-[#8c6b3e]">Interactive Size</span>
                                <span className="font-mono font-bold text-[#15110e] px-1.5 py-0.5 rounded bg-white border border-[#e2d8c9]">
                                  {selectedElement.scale ? `${selectedElement.scale}x` : '1x'}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#7a6b5c] leading-tight">
                                💡 Press and drag any of the <strong>4 corner handles</strong> on the canvas to expand or minimize (like in Word). Drag the center to move.
                              </p>
                            </div>'''

if old_scale_slider_block in text:
    text = text.replace(old_scale_slider_block, new_scale_slider_block)
else:
    print("Warning: old_scale_slider_block not matched.")

# Inspector empty state
old_empty_inspector = '''                        <div className="p-6 text-center space-y-3 bg-[#1d1713]/40 rounded-xl border border-dashed border-[#3d3024]">
                          <div className="w-10 h-10 rounded-full bg-[#241c16] border border-[#bd9661]/40 mx-auto flex items-center justify-center text-[#bd9661]"><SearchDocIcon className="w-5 h-5" /></div>
                          <div className="text-xs font-semibold text-[#fce4ca]">No Element Selected</div>
                          <div className="text-[11px] text-[#8b7b6b] leading-relaxed">
                            Click any floral, leaf, or text on the card canvas to customize its colors, petal fills, fonts, and glitter.
                          </div>
                          <button
                            type="button"
                            onClick={() => setRightCardMode('design-box')}
                            className="px-3 py-1.5 rounded-lg bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                          >
                            <span>+</span>
                            <span>Open Design Box</span>
                          </button>
                        </div>'''

new_empty_inspector = '''                        <div className="p-6 text-center space-y-3 bg-[#faf7f2] rounded-2xl border-2 border-dashed border-[#e2d8c9]">
                          <div className="w-12 h-12 rounded-full bg-white border border-[#bd9661]/40 mx-auto flex items-center justify-center text-[#96713e] shadow-2xs">
                            <SearchDocIcon className="w-6 h-6" />
                          </div>
                          <div className="font-serif text-sm font-bold text-[#15110e]">No Element Selected</div>
                          <div className="text-xs text-[#7a6b5c] leading-relaxed">
                            Click any floral, leaf, or text on the card canvas to customize colors, fonts, or drag its 4 corner handles to resize.
                          </div>
                          <button
                            type="button"
                            onClick={() => setRightCardMode('design-box')}
                            className="px-4 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                          >
                            <span>+</span>
                            <span>Open Design Box</span>
                          </button>
                        </div>'''

text = text.replace(old_empty_inspector, new_empty_inspector)

# Opener buttons for collapsed panels
text = text.replace(
    'className="absolute top-4 left-4 z-30 px-3 py-2 rounded-xl bg-[#15110e]/95 border border-[#bd9661]/40 text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#241c16]"',
    'className="absolute top-4 left-4 z-30 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#dfd4c5] text-[#15110e] hover:text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer hover:bg-[#faf7f2] backdrop-blur-md"'
)

text = text.replace(
    'className="absolute top-4 right-4 z-30 px-3 py-2 rounded-xl bg-[#15110e]/95 border border-[#bd9661]/40 text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#241c16]"',
    'className="absolute top-4 right-4 z-30 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#dfd4c5] text-[#15110e] hover:text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer hover:bg-[#faf7f2] backdrop-blur-md"'
)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Redesign applied successfully!")
