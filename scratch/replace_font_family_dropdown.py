with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                  Font Family
                                </label>
                                <div className="grid grid-cols-3 gap-1 text-[11px] font-medium">
                                  {[
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
                                  ))}
                                </div>
                              </div>'''

replacement = '''                              {/* Font Family: Word / Google Docs Style Searchable Dropdown with Live Previews */}
                              <div className="relative">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                                    Font Family
                                  </label>
                                  <span className="text-[9px] font-mono font-bold text-[#8c6b3e] bg-[#f0eae1] px-1.5 py-0.5 rounded">
                                    {selectedElement.fontFamily || 'Playfair Display'}
                                  </span>
                                </div>

                                {/* Dropdown Toggle Button */}
                                <button
                                  type="button"
                                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                                  className="w-full p-2 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] text-[#2c221a] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-xs font-serif font-bold text-[#8c6b3e] px-1.5 py-0.5 rounded bg-[#f0eae1] shrink-0">
                                      Aa
                                    </span>
                                    <div className="text-left truncate">
                                      <div className="text-xs font-bold text-[#15110e] truncate">
                                        {selectedElement.fontFamily || 'Playfair Display'}
                                      </div>
                                      <div
                                        className="text-[11px] text-[#8b7b6b] truncate"
                                        style={{ fontFamily: getFontFamilyCss(selectedElement.fontFamily) }}
                                      >
                                        {selectedElement.content?.slice(0, 24) || 'Sample Typography'}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronDownIcon className={`w-3.5 h-3.5 text-[#8c6b3e] shrink-0 transition-transform ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu with Search and Live Typeface Previews */}
                                {isFontDropdownOpen && (
                                  <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#fefdfb] border border-[#dfd4c5] rounded-xl shadow-2xl overflow-hidden p-2 space-y-2 animate-fadeIn max-h-[250px] flex flex-col">
                                    {/* Search Input Box */}
                                    <div className="relative shrink-0">
                                      <input
                                        type="text"
                                        value={fontSearchQuery}
                                        onChange={(e) => setFontSearchQuery(e.target.value)}
                                        placeholder="Search wedding fonts..."
                                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#faf7f2] border border-[#d5c7b5] focus:outline-none focus:border-[#bd9661] text-[#15110e] placeholder:text-[#a09080]"
                                        autoFocus
                                      />
                                      {fontSearchQuery && (
                                        <button
                                          type="button"
                                          onClick={() => setFontSearchQuery('')}
                                          className="absolute right-2 top-1.5 text-xs text-[#a09080] hover:text-[#15110e]"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>

                                    {/* Font Options List */}
                                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
                                      {WEDDING_FONTS.filter((f) =>
                                        f.name.toLowerCase().includes(fontSearchQuery.toLowerCase()) ||
                                        f.category.toLowerCase().includes(fontSearchQuery.toLowerCase())
                                      ).map((f) => {
                                        const isSelected =
                                          selectedElement.fontFamily === f.name ||
                                          (selectedElement.fontFamily === 'serif' && f.name === 'Playfair Display') ||
                                          (selectedElement.fontFamily === 'script' && f.name === 'Pinyon Script') ||
                                          (selectedElement.fontFamily === 'sans' && f.name === 'DM Sans');
                                        return (
                                          <button
                                            key={f.name}
                                            type="button"
                                            onClick={() => {
                                              setElements((prev) =>
                                                prev.map((el) =>
                                                  el.id === selectedElement.id ? { ...el, fontFamily: f.name } : el
                                                )
                                              );
                                              setIsFontDropdownOpen(false);
                                            }}
                                            className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer ${
                                              isSelected
                                                ? 'bg-[#15110e] text-[#fce4ca] font-bold border border-[#bd9661] shadow-2xs'
                                                : 'hover:bg-[#faf7f2] text-[#2c221a]'
                                            }`}
                                          >
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold">{f.name}</span>
                                                <span className="text-[9px] px-1 rounded bg-[#f0eae1] text-[#8c6b3e] font-sans">
                                                  {f.category}
                                                </span>
                                              </div>
                                              <div
                                                className="text-sm truncate mt-0.5"
                                                style={{
                                                  fontFamily: f.family,
                                                  color: isSelected ? '#fce4ca' : '#5c4632',
                                                }}
                                              >
                                                {f.sample}
                                              </div>
                                            </div>
                                            {isSelected && <span className="text-[#bd9661] text-xs font-bold ml-2">✓</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>'''

if target in text:
    text = text.replace(target, replacement)
    with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced Font Family buttons with MS Word-style Searchable Dropdown!")
else:
    print("Target block not found!")
