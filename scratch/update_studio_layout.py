import sys
sys.stdout.reconfigure(encoding='utf-8')

new_studio_jsx = '''          <div className="fixed inset-0 w-screen h-screen z-[99999999] bg-[#120f0d] flex flex-col select-none overflow-hidden animate-fadeIn">
            {/* Shimmer & Animation Keyframes */}
            <style>{`
              @keyframes shimmerSweep {
                0% { transform: translateX(-150%) rotate(25deg); }
                100% { transform: translateX(250%) rotate(25deg); }
              }
              @keyframes goldGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 4px rgba(218, 165, 32, 0.7)) drop-shadow(0 0 1px rgba(255, 215, 0, 0.9)); }
                50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.95)) drop-shadow(0 0 3px rgba(255, 245, 200, 1)); }
              }
              @keyframes diamondGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 1px rgba(200, 230, 255, 0.9)); }
                50% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 3px rgba(255, 255, 255, 1)); }
              }
              @keyframes fairyDustGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 4px rgba(253, 224, 71, 0.7)) drop-shadow(0 0 6px rgba(244, 114, 182, 0.5)); }
                50% { filter: drop-shadow(0 0 8px rgba(253, 224, 71, 1)) drop-shadow(0 0 10px rgba(244, 114, 182, 0.8)); }
              }
              @keyframes textGoldSweep {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .animate-shimmer-sweep {
                animation: shimmerSweep 3.5s ease-in-out infinite;
              }
              .animate-gold-glitter {
                animation: goldGlowPulse 2.5s ease-in-out infinite;
              }
              .animate-diamond-sparkle {
                animation: diamondGlowPulse 2.5s ease-in-out infinite;
              }
              .animate-fairy-dust {
                animation: fairyDustGlowPulse 2.2s ease-in-out infinite;
              }
              .animate-text-gold {
                background: linear-gradient(90deg, #bd9661 0%, #fff6d6 50%, #bd9661 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: textGoldSweep 3s linear infinite;
              }
              .animate-text-diamond {
                background: linear-gradient(90deg, #ffffff 0%, #dbeafe 50%, #ffffff 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: textGoldSweep 2.5s linear infinite;
              }
            `}</style>

            {/* ============================================================= */}
            {/* UNIFIED TOP BAR: BACK, TITLE, CENTER TOOLBAR & RIGHT ACTIONS   */}
            {/* ============================================================= */}
            <header className="h-14 px-3 sm:px-4 bg-[#15110e] text-white border-b border-[#2b221a] flex items-center justify-between gap-2 sm:gap-4 shrink-0 shadow-lg z-50">
              {/* Left: Exit button & Title */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  title="Return to Super Admin Settings (Esc)"
                >
                  <span className="text-sm">←</span>
                  <span className="hidden sm:inline">Back to Settings</span>
                  <span className="sm:hidden">Exit</span>
                </button>

                <div className="h-5 w-px bg-[#3d3024] hidden md:block" />

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#241c16] border border-[#bd9661] text-[#bd9661] inline-grid place-items-center text-xs font-serif font-bold">
                    T
                  </span>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="font-serif text-xs sm:text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-[#bd9661] focus:border-[#bd9661] focus:outline-none px-1 max-w-[130px] sm:max-w-[210px] truncate"
                    title="Click to rename theme"
                  />
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#241c16] text-[#bd9661] border border-[#bd9661]/40 hidden xl:inline">
                    Whiteboard Studio
                  </span>
                </div>
              </div>

              {/* Center: Minimalist Whiteboard Navigation Controls */}
              <div className="flex items-center gap-1 bg-[#1d1713] border border-[#bd9661]/40 rounded-xl p-1 shadow-inner relative z-50">
                {/* 1. Pointer / Select tool */}
                <button
                  type="button"
                  onClick={() => setActiveTool('select')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    activeTool === 'select' ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-sm' : 'text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white'
                  }`}
                  title="Select & Move (V)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                </button>

                {/* 2. Pan / Hand Tool */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('pan');
                    showToast('Pan View mode', 'info');
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    activeTool === 'pan' ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-sm' : 'text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white'
                  }`}
                  title="Pan View (H)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
                    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                    <path d="M6 14v1a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6v-3a2 2 0 0 0-4 0v2" />
                  </svg>
                </button>

                {/* 3. Lock Canvas */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool(activeTool === 'lock' ? 'select' : 'lock');
                    showToast(activeTool === 'lock' ? 'Canvas unlocked' : 'Canvas locked', 'info');
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    activeTool === 'lock' ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-sm' : 'text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white'
                  }`}
                  title="Lock / Unlock Canvas"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* 4. Quick Add Text */}
                <button
                  type="button"
                  onClick={() => {
                    addElementToCanvas({
                      type: 'text',
                      content: 'Enter Wedding Details',
                      name: 'Text Box',
                      fontSize: 14,
                      fontFamily: 'sans',
                      isBold: true,
                    });
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] transition-all cursor-pointer font-serif font-bold"
                  title="Add Text Box (T)"
                >
                  T
                </button>

                {/* 5. Undo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                    historyIndex > 0 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                </button>

                {/* 6. Redo */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                    historyIndex < history.length - 1 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                  </svg>
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* 7. Clear Canvas */}
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs text-[#c5b5a5] hover:text-red-400 hover:bg-[#2b221a] transition-all cursor-pointer"
                  title="Clear Canvas Elements"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {/* Right: Motion preview, Save Theme, and Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePlayAnimation}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] border border-[#bd9661]/40 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                  title="Simulate unboxing motion on card"
                >
                  <span>▶</span>
                  <span className="hidden md:inline">{isPlayingMotion ? 'Simulating...' : 'Play Motion'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] hover:text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  title="Save & Deploy theme"
                >
                  <span>✓</span>
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] hover:text-white flex items-center justify-center text-xs font-bold border border-[#3d3024] transition-all cursor-pointer"
                  title="Close Studio (Esc)"
                >
                  ✕
                </button>
              </div>
            </header>

            {/* =============================================================== */}
            {/* WHITEBOARD MAIN STAGE (WITH SYMMETRIC EQUAL-SIZED DUAL CARDS)   */}
            {/* =============================================================== */}
            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center p-6 ${
                gridStyle === 'dots'
                  ? 'bg-[#181310] [background-image:radial-gradient(#3d3024_1.2px,transparent_1.2px)] [background-size:24px_24px]'
                  : gridStyle === 'lines'
                  ? 'bg-[#181310] [background-image:linear-gradient(to_right,#241c16_1px,transparent_1px),linear-gradient(to_bottom,#241c16_1px,transparent_1px)] [background-size:28px_28px]'
                  : 'bg-[#14100d]'
              }`}
              onClick={() => {
                setSelectedElementId(null);
              }}
            >
              {/* ============================================================= */}
              {/* CARD 1 (LEFT): CARD AESTHETIC, SHAPES, SHIMMER & 3D MOTION    */}
              {/* Equal width (w-[320px] 2xl:w-[340px]), matching height & style */}
              {/* ============================================================= */}
              <aside
                className={`absolute top-4 left-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#15110e]/95 backdrop-blur-md border border-[#bd9661]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto ${
                  isLeftCollapsed ? '-translate-x-[340px]' : 'translate-x-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="h-12 px-4 bg-[#1b1511] border-b border-[#2b221a] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎴</span>
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
                      ◀
                    </button>
                  </div>
                </div>

                {/* Body: Scrollable */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
                  {/* 1. Card Silhouette Shape */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-2 flex items-center justify-between">
                      <span>Card Silhouette Shape</span>
                      <span className="text-[9px] text-[#8b7b6b]">{activeShapeObj.name}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {CARD_SHAPES.map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setCardShape(shape.id)}
                          className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            cardShape === shape.id
                              ? 'bg-[#2b221a] text-[#bd9661] font-bold border border-[#bd9661] ring-1 ring-[#bd9661]/50'
                              : 'bg-[#1d1713] border border-[#2b221a] hover:bg-[#241c16] text-[#c5b5a5]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-xs border border-[#bd9661]/40 flex items-center justify-center text-[10px]">
                              {shape.id === 'arch-dome' ? '⌒' : shape.id === 'classic-rounded' ? '▢' : shape.id === 'cameo-oval' ? '⬯' : '▭'}
                            </span>
                            <span>{shape.name}</span>
                          </div>
                          <span className="text-[9px] opacity-60 truncate max-w-[100px]">{shape.desc.slice(0, 16)}...</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Card Background Paper Texture */}
                  <div className="pt-2 border-t border-[#2b221a]">
                    <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-2">
                      Card Background Paper
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { hex: '#fdfbf7', name: 'Linen Ivory' },
                        { hex: '#ffffff', name: 'Pure White' },
                        { hex: '#171921', name: 'Obsidian Noir' },
                        { hex: '#0e1c36', name: 'Coastal Navy' },
                        { hex: '#273f2c', name: 'Forest Emerald' },
                        { hex: '#2b1e16', name: 'Velvet Plum' },
                        { hex: '#fce7ea', name: 'Blush Pink' },
                        { hex: '#f7eedf', name: 'Warm Alabaster' },
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setBaseColor(col.hex)}
                          className={`h-7 rounded-lg border-2 shadow-xs cursor-pointer transition-transform flex items-center justify-center text-[9px] font-bold ${
                            baseColor === col.hex ? 'scale-105 border-white ring-2 ring-[#bd9661]' : 'border-black/40 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 3. Default Foil Border Color */}
                  <div className="pt-2 border-t border-[#2b221a]">
                    <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-2">
                      Default Foil / Border Color
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { hex: '#bd9661', name: 'Royal Gold' },
                        { hex: '#dfc194', name: 'Champagne Foil' },
                        { hex: '#e27b91', name: 'Rose Gold' },
                        { hex: '#eed259', name: 'Bright Gold' },
                        { hex: '#ffffff', name: 'White Silk' },
                        { hex: '#15110e', name: 'Ink Noir' },
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setFoilColor(col.hex)}
                          className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                            foilColor === col.hex ? 'scale-125 border-white ring-2 ring-[#bd9661]' : 'border-black/40 hover:scale-110'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 4. Wedding Card Shimmer / Glitter Effect */}
                  <div className="pt-2 border-t border-[#2b221a]">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-2">
                      <span>Card Shimmer / Glitter Effect</span>
                      <span className="text-[9px] text-[#fce4ca] capitalize">{cardShimmer}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'none', label: 'Classic Matte', icon: '⚪', desc: 'No shimmer' },
                        { id: 'gold-dust', label: 'Gold Stardust', icon: '✦', desc: 'Gilded foil sweep' },
                        { id: 'diamond-sparkle', label: 'Diamond Sparkle', icon: '✧', desc: 'Prismatic twinkle' },
                        { id: 'champagne-sheen', label: 'Champagne Sheen', icon: '✨', desc: 'Metallic glisten' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setCardShimmer(s.id as any)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            cardShimmer === s.id
                              ? 'bg-[#2b221a] border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]'
                              : 'bg-[#1d1713] border-[#2b221a] text-[#c5b5a5] hover:bg-[#241c16] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                            <span>{s.icon}</span>
                            <span className="truncate">{s.label}</span>
                          </div>
                          <div className="text-[9px] text-[#8b7b6b] mt-0.5">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Predefined 3D Unboxing Motion */}
                  <div className="pt-2 border-t border-[#2b221a]">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-2">
                      <span>Predefined 3D Motion</span>
                      <span className="text-[9px] text-[#8b7b6b]">Predefined Only</span>
                    </div>
                    <div className="space-y-1.5">
                      {PREDEFINED_ANIMATIONS.map((anim) => (
                        <div
                          key={anim.id}
                          onClick={() => {
                            setAnimationType(anim.name);
                            handlePlayAnimation();
                          }}
                          className={`p-2 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            animationType === anim.name
                              ? 'bg-[#2b221a] border border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]/40'
                              : 'bg-[#1d1713] border border-[#2b221a] hover:bg-[#241c16] text-[#c5b5a5]'
                          }`}
                        >
                          <span className="text-base">{anim.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{anim.name}</div>
                            <div className="text-[10px] text-[#8b7b6b] font-normal leading-tight mt-0.5">
                              {anim.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
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
                    </div>
                  </div>
                </div>
              </aside>

              {/* Collapsed Left Panel Opener */}
              {isLeftCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsLeftCollapsed(false)}
                  className="absolute top-4 left-4 z-30 px-3 py-2 rounded-xl bg-[#15110e]/95 border border-[#bd9661]/40 text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#241c16]"
                >
                  <span>▶</span>
                  <span>Card Aesthetic</span>
                </button>
              )}

              {/* ============================================================= */}
              {/* THE WEDDING CARD ON THE WHITEBOARD CANVAS                     */}
              {/* ============================================================= */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 relative"
              >
                <div
                  ref={canvasRef}
                  onPointerMove={handleElementPointerMove}
                  onPointerUp={handleElementPointerUp}
                  className={`relative w-[380px] h-[550px] shadow-2xl transition-all duration-700 ease-out select-none overflow-hidden ${activeShapeObj.roundedClass}`}
                  style={{
                    backgroundColor: baseColor,
                    borderColor: foilColor,
                    borderWidth: '2px',
                    boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.45), 0 0 30px ${foilColor}30`,
                    transform: isPlayingMotion
                      ? unboxingPhase === 'opening'
                        ? 'scale(1.05) translateY(-20px) rotateX(4deg)'
                        : 'scale(1.02) translateY(-10px)'
                      : 'none',
                    perspective: '1000px',
                  }}
                  onClick={(e) => {
                    if (e.target === canvasRef.current) {
                      setSelectedElementId(null);
                    }
                  }}
                >
                  {/* Inset Gilded Border Frame */}
                  <div
                    className={`absolute inset-3 border pointer-events-none transition-all ${activeShapeObj.roundedClass}`}
                    style={{ borderColor: `${foilColor}40`, borderWidth: '1px' }}
                  />

                  {/* Wedding Card Shimmer / Glitter Effect Overlay */}
                  {cardShimmer === 'gold-dust' && (
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden z-20 animate-shimmer-sweep"
                      style={{
                        background: 'linear-gradient(115deg, transparent 20%, rgba(255,215,0,0.18) 45%, rgba(255,245,210,0.5) 50%, rgba(255,215,0,0.18) 55%, transparent 80%)',
                        backgroundSize: '250% 100%',
                      }}
                    >
                      <span className="absolute top-[12%] left-[22%] text-xs text-[#ffd700] animate-pulse">✦</span>
                      <span className="absolute top-[38%] right-[18%] text-[10px] text-[#ffd700] animate-ping" style={{ animationDuration: '3s' }}>✧</span>
                      <span className="absolute bottom-[24%] left-[28%] text-xs text-[#ffd700] animate-pulse" style={{ animationDelay: '1s' }}>✦</span>
                      <span className="absolute top-[68%] right-[32%] text-[9px] text-[#fce4ca] animate-pulse" style={{ animationDelay: '1.5s' }}>✧</span>
                    </div>
                  )}

                  {cardShimmer === 'diamond-sparkle' && (
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden z-20 animate-shimmer-sweep"
                      style={{
                        background: 'linear-gradient(120deg, transparent 25%, rgba(255,255,255,0.25) 45%, rgba(230,245,255,0.65) 50%, rgba(255,255,255,0.25) 55%, transparent 75%)',
                        backgroundSize: '250% 100%',
                      }}
                    >
                      <span className="absolute top-[18%] right-[28%] text-sm text-white animate-pulse">✧</span>
                      <span className="absolute top-[48%] left-[18%] text-[11px] text-[#e0f2fe] animate-ping" style={{ animationDuration: '2.5s' }}>✦</span>
                      <span className="absolute bottom-[18%] right-[22%] text-xs text-white animate-pulse" style={{ animationDelay: '1.2s' }}>✧</span>
                    </div>
                  )}

                  {cardShimmer === 'champagne-sheen' && (
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden z-20 animate-shimmer-sweep"
                      style={{
                        background: 'linear-gradient(105deg, transparent 25%, rgba(223,193,148,0.2) 40%, rgba(252,228,202,0.45) 50%, rgba(223,193,148,0.2) 60%, transparent 75%)',
                        backgroundSize: '250% 100%',
                      }}
                    >
                      <span className="absolute top-[28%] left-[14%] text-[10px] text-[#dfc194] animate-pulse">✦</span>
                      <span className="absolute bottom-[32%] right-[14%] text-[10px] text-[#dfc194] animate-pulse" style={{ animationDelay: '0.8s' }}>✦</span>
                    </div>
                  )}

                  {/* 3D Envelope Flap Overlay for simulation */}
                  {isPlayingMotion && animationType.includes('Flap') && (
                    <div
                      className="absolute inset-x-0 top-0 h-44 bg-[#15110e] origin-top border-b border-[#bd9661] z-50 transition-all duration-700 ease-in-out flex items-end justify-center pb-2 shadow-2xl"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        transform: unboxingPhase === 'opening' ? 'rotateX(160deg)' : 'rotateX(0deg)',
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#bd9661] border border-white flex items-center justify-center text-white text-[10px] font-serif font-bold shadow-md">
                        S • D
                      </div>
                    </div>
                  )}

                  {/* 3D Gatefold Dual Door Overlay for simulation */}
                  {isPlayingMotion && animationType.includes('Gatefold') && (
                    <>
                      <div
                        className="absolute inset-y-0 left-0 w-1/2 bg-[#15110e] origin-left border-r border-[#bd9661] z-50 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                          transform: unboxingPhase === 'opening' ? 'rotateY(-110deg)' : 'rotateY(0deg)',
                        }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 w-1/2 bg-[#15110e] origin-right border-l border-[#bd9661] z-50 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                          transform: unboxingPhase === 'opening' ? 'rotateY(110deg)' : 'rotateY(0deg)',
                        }}
                      />
                    </>
                  )}

                  {/* Render Elements on Card */}
                  {elements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    const asset = SVG_ASSETS[el.content];

                    let elementGlowClass = '';
                    if (el.shimmer === 'gold-glitter') elementGlowClass = 'animate-gold-glitter';
                    else if (el.shimmer === 'diamond') elementGlowClass = 'animate-diamond-sparkle';
                    else if (el.shimmer === 'fairy-dust') elementGlowClass = 'animate-fairy-dust';

                    return (
                      <div
                        key={el.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                          setRightCardMode('inspector');
                        }}
                        onPointerDown={(e) => handleElementPointerDown(e, el)}
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg) scale(${el.scale || 1})`,
                          opacity: el.opacity ?? 1,
                          zIndex: isSelected ? 40 : el.zIndex || 10,
                          cursor: isDragging && isSelected ? 'grabbing' : 'grab',
                        }}
                        className={`absolute group touch-none ${
                          isSelected ? 'ring-2 ring-[#bd9661] ring-offset-2 ring-offset-transparent rounded-sm' : ''
                        }`}
                      >
                        {/* Text Element */}
                        {el.type === 'text' && (
                          <div
                            className={`px-2 py-0.5 whitespace-nowrap focus:outline-none ${
                              el.shimmer === 'gold-glitter'
                                ? 'animate-text-gold'
                                : el.shimmer === 'diamond'
                                ? 'animate-text-diamond'
                                : ''
                            }`}
                            style={{
                              fontFamily:
                                el.fontFamily === 'serif'
                                  ? 'Playfair Display, Georgia, serif'
                                  : el.fontFamily === 'script'
                                  ? 'Pinyon Script, cursive'
                                  : 'DM Sans, sans-serif',
                              fontSize: `${el.fontSize || 14}px`,
                              fontWeight: el.isBold ? 'bold' : 'normal',
                              fontStyle: el.isItalic ? 'italic' : 'normal',
                              letterSpacing: el.letterSpacing || 'normal',
                              color: el.shimmer && el.shimmer !== 'none' ? undefined : (el.color || foilColor),
                            }}
                          >
                            {el.content}
                          </div>
                        )}

                        {/* Flower or Leaf or Decor Element */}
                        {(el.type === 'flower' || el.type === 'leaf' || el.type === 'graphic' || el.type === 'seal' || el.type === 'divider') && (
                          <div className={`relative ${el.type === 'divider' ? 'w-44 h-6' : el.type === 'seal' ? 'w-14 h-14' : 'w-16 h-16'} ${elementGlowClass}`}>
                            {asset ? (
                              asset.render(el.color || foilColor, el.fillColor)
                            ) : (
                              <div className="w-12 h-12 rounded bg-amber-100/40 flex items-center justify-center text-xs">
                                {el.content}
                              </div>
                            )}

                            {/* Shimmer sparkle badge indicator */}
                            {el.shimmer === 'gold-glitter' && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-[#ffd700] pointer-events-none animate-pulse">✦</span>
                            )}
                            {el.shimmer === 'diamond' && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-white pointer-events-none animate-pulse">✧</span>
                            )}
                            {el.shimmer === 'fairy-dust' && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-[#fde047] pointer-events-none animate-bounce">✨</span>
                            )}
                          </div>
                        )}

                        {/* QR Code Element */}
                        {el.type === 'qrcode' && (
                          <div className="w-24 h-28">
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                          </div>
                        )}

                        {/* Selected Gold Bounding Box Dots (4 Corner Handles) */}
                        {isSelected && (
                          <>
                            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white shadow-xs pointer-events-none" />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================= */}
              {/* CARD 2 (RIGHT): DESIGN BOX (FLOWERS, LEAVES, DECOR, TEXT)     */}
              {/* AND ELEMENT INSPECTOR (PETAL FILLS, FONTS, SHIMMER/GLITTER)   */}
              {/* EXACT EQUAL SIZE TO CARD 1: w-[320px] 2xl:w-[340px]           */}
              {/* ============================================================= */}
              <aside
                className={`absolute top-4 right-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#15110e]/95 backdrop-blur-md border border-[#bd9661]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto ${
                  isRightCollapsed ? 'translate-x-[340px]' : 'translate-x-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header: Segmented Tabs */}
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
                      <span>🎨</span>
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
                      <span>⚙️</span>
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
                    ▶
                  </button>
                </div>

                {/* Body: Scrollable */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
                  {/* TAB 1: DESIGN BOX (FLOWERS, LEAVES, DECOR, TEXT) */}
                  {rightCardMode === 'design-box' && (
                    <div className="space-y-3.5 animate-fadeIn">
                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'flower', label: '🌸 Flowers' },
                          { id: 'leaf', label: '🌿 Leaves' },
                          { id: 'decor', label: '✦ Decor' },
                          { id: 'text', label: 'T Text' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setDesignBoxCategory(cat.id as any)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                              designBoxCategory === cat.id
                                ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-xs'
                                : 'bg-[#1d1713] text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white border border-[#2b221a]'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] text-[#8b7b6b] flex items-center justify-between px-1">
                        <span>Click any item to add to card</span>
                        <span>{DESIGN_BOX_ITEMS.filter((i) => designBoxCategory === 'all' || i.category === designBoxCategory).length} items</span>
                      </div>

                      {/* 2-Column Visual Design Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {DESIGN_BOX_ITEMS.filter((item) => designBoxCategory === 'all' || item.category === designBoxCategory).map((item) => (
                          <button
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
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ELEMENT INSPECTOR */}
                  {rightCardMode === 'inspector' && (
                    <div className="space-y-3.5 animate-fadeIn">
                      {selectedElement ? (
                        <>
                          {/* Element Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-[#2b221a]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">
                                {selectedElement.type === 'flower' ? '🌸' : selectedElement.type === 'leaf' ? '🌿' : selectedElement.type === 'text' ? '✍️' : '✦'}
                              </span>
                              <span className="text-[11px] font-bold text-[#fce4ca] capitalize truncate max-w-[150px]">
                                {selectedElement.content}
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
                          </div>

                          {/* A. TEXT ELEMENT INSPECTOR */}
                          {selectedElement.type === 'text' && (
                            <div className="space-y-3.5">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1">
                                  Text Content
                                </label>
                                <textarea
                                  rows={2}
                                  value={selectedElement.content}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, content: val } : el))
                                    );
                                  }}
                                  className="w-full bg-[#1b1511] border border-[#3d3024] focus:border-[#bd9661] rounded-lg p-2 text-xs text-white focus:outline-none font-serif resize-none"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Text Color</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">
                                  {[
                                    { hex: '#bd9661', name: 'Royal Gold' },
                                    { hex: '#dfc194', name: 'Champagne' },
                                    { hex: '#e27b91', name: 'Rose Gold' },
                                    { hex: '#eed259', name: 'Bright Gold' },
                                    { hex: '#15110e', name: 'Ink Noir' },
                                    { hex: '#ffffff', name: 'White Silk' },
                                    { hex: '#273f2c', name: 'Forest Emerald' },
                                    { hex: '#0e1c36', name: 'Coastal Navy' },
                                    { hex: '#2b1e16', name: 'Velvet Plum' },
                                    { hex: '#8a2b3b', name: 'Burgundy' },
                                    { hex: '#5c4838', name: 'Warm Mocha' },
                                    { hex: '#7a8b7b', name: 'Sage Green' },
                                  ].map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: col.hex } : el))
                                        );
                                      }}
                                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                                        (selectedElement.color || foilColor) === col.hex
                                          ? 'scale-125 border-white ring-2 ring-[#bd9661]'
                                          : 'border-black/40 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: col.hex }}
                                      title={col.name}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1">
                                  <span>Font Size</span>
                                  <span className="font-mono text-[10px] text-[#fce4ca] font-bold">
                                    {selectedElement.fontSize || 14}px
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="9"
                                  max="48"
                                  step="1"
                                  value={selectedElement.fontSize || 14}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, fontSize: val } : el))
                                    );
                                  }}
                                  className="w-full accent-[#bd9661] cursor-pointer"
                                />
                                <div className="flex items-center justify-between gap-1 mt-1 text-[10px] font-bold">
                                  {[10, 14, 18, 24, 32].map((sz) => (
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
                                  ))}
                                </div>
                              </div>

                              <div className="pt-2 border-t border-[#2b221a] flex items-center justify-between gap-1.5">
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
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1">
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
                                      className={`py-1 rounded-lg border cursor-pointer ${
                                        selectedElement.fontFamily === f.id
                                          ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661] font-bold'
                                          : 'bg-[#241c16] border-[#3d3024] text-[#d9c9b8] hover:bg-[#2b221a]'
                                      }`}
                                    >
                                      {f.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Text Shimmer / Metallic Sheen */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Text Shimmer / Foil Sheen</span>
                                  <span className="text-[9px] text-[#fce4ca] capitalize">{selectedElement.shimmer || 'none'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  {[
                                    { id: 'none', label: 'None', icon: '⚪' },
                                    { id: 'gold-glitter', label: 'Gold Sheen', icon: '✦' },
                                    { id: 'diamond', label: 'Diamond', icon: '✧' },
                                  ].map((sh) => (
                                    <button
                                      key={sh.id}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, shimmer: sh.id as any } : el))
                                        );
                                      }}
                                      className={`py-1 px-1.5 rounded-lg border text-center text-[10px] font-medium cursor-pointer transition-all ${
                                        (selectedElement.shimmer || 'none') === sh.id
                                          ? 'bg-[#2b221a] border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]'
                                          : 'bg-[#241c16] border-[#3d3024] text-[#c5b5a5] hover:bg-[#2b221a]'
                                      }`}
                                    >
                                      <span>{sh.icon} </span>
                                      <span>{sh.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* B. FLORAL & GRAPHIC ELEMENT INSPECTOR */}
                          {selectedElement.type !== 'text' && (
                            <div className="space-y-3.5">
                              {/* 1. Petal Fill Color */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Petal / Body Fill Color</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.fillColor || '#ffffff'}</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1.5">
                                  {[
                                    { hex: '#ffffff', name: 'White Silk' },
                                    { hex: '#fdfbf7', name: 'Linen Ivory' },
                                    { hex: '#fce7ea', name: 'Blush Pink' },
                                    { hex: '#f7eedf', name: 'Champagne Tint' },
                                    { hex: '#eef5ee', name: 'Pastel Sage' },
                                    { hex: '#f3edf8', name: 'Lavender Mist' },
                                    { hex: '#bd9661', name: 'Gold Fill' },
                                    { hex: '#15110e', name: 'Obsidian Noir' },
                                    { hex: '#273f2c', name: 'Deep Emerald' },
                                    { hex: '#8a2b3b', name: 'Crimson Rose' },
                                    { hex: '#ffd700', name: 'Warm Amber' },
                                    { hex: 'transparent', name: 'Transparent' },
                                  ].map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fillColor: col.hex } : el))
                                        );
                                      }}
                                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                                        (selectedElement.fillColor || '#ffffff') === col.hex
                                          ? 'scale-125 border-white ring-2 ring-[#bd9661]'
                                          : 'border-black/40 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: col.hex === 'transparent' ? '#333333' : col.hex }}
                                      title={col.name}
                                    >
                                      {col.hex === 'transparent' && <span className="text-[9px] text-white">∅</span>}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 2. Foil Stroke Color */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Foil / Outline Stroke</span>
                                  <span className="font-mono text-[9px] text-[#fce4ca]">{selectedElement.color || foilColor}</span>
                                </div>
                                <div className="grid grid-cols-5 gap-1.5">
                                  {[
                                    { hex: '#bd9661', name: 'Royal Gold' },
                                    { hex: '#dfc194', name: 'Champagne' },
                                    { hex: '#e27b91', name: 'Rose Gold' },
                                    { hex: '#eed259', name: 'Bright Gold' },
                                    { hex: '#15110e', name: 'Obsidian Noir' },
                                    { hex: '#ffffff', name: 'White Silk' },
                                    { hex: '#273f2c', name: 'Forest Emerald' },
                                    { hex: '#0e1c36', name: 'Coastal Navy' },
                                    { hex: '#2b1e16', name: 'Velvet Plum' },
                                    { hex: '#8a2b3b', name: 'Burgundy' },
                                  ].map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: col.hex } : el))
                                        );
                                      }}
                                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                                        (selectedElement.color || foilColor) === col.hex
                                          ? 'scale-125 border-white ring-2 ring-[#bd9661]'
                                          : 'border-black/40 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: col.hex }}
                                      title={col.name}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* 3. Floral / Foliage Shimmer & Glitter Effect (NEW FEATURE) */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1.5">
                                  <span>Shimmer &amp; Glitter Effect</span>
                                  <span className="text-[9px] text-[#fce4ca] capitalize">{selectedElement.shimmer || 'none'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { id: 'none', label: 'None (Matte)', icon: '⚪' },
                                    { id: 'gold-glitter', label: 'Gold Glitter', icon: '✦' },
                                    { id: 'diamond', label: 'Diamond Sparkle', icon: '✧' },
                                    { id: 'fairy-dust', label: 'Fairy Dust', icon: '✨' },
                                  ].map((sh) => (
                                    <button
                                      key={sh.id}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, shimmer: sh.id as any } : el))
                                        );
                                      }}
                                      className={`p-1.5 rounded-lg border text-left text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                                        (selectedElement.shimmer || 'none') === sh.id
                                          ? 'bg-[#2b221a] border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]'
                                          : 'bg-[#1d1713] border-[#2b221a] text-[#c5b5a5] hover:bg-[#241c16]'
                                      }`}
                                    >
                                      <span className="text-xs">{sh.icon}</span>
                                      <span className="truncate">{sh.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Common Scale, Rotation, Opacity */}
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
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661] mb-1">
                                <span>Rotation</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] text-[#fce4ca] font-bold">
                                    {selectedElement.rotation || 0}°
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setElements((prev) =>
                                        prev.map((el) => (el.id === selectedElement.id ? { ...el, rotation: 0 } : el))
                                      );
                                    }}
                                    className="text-[9px] text-[#8b7b6b] hover:text-[#bd9661] cursor-pointer"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                step="5"
                                value={selectedElement.rotation || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setElements((prev) =>
                                    prev.map((el) => (el.id === selectedElement.id ? { ...el, rotation: val } : el))
                                  );
                                }}
                                className="w-full accent-[#bd9661] cursor-pointer"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 text-center space-y-3 bg-[#1d1713]/40 rounded-xl border border-dashed border-[#3d3024]">
                          <div className="text-2xl">🔍</div>
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
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </aside>

              {/* Collapsed Right Panel Opener */}
              {isRightCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsRightCollapsed(false)}
                  className="absolute top-4 right-4 z-30 px-3 py-2 rounded-xl bg-[#15110e]/95 border border-[#bd9661]/40 text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#241c16]"
                >
                  <span>◀</span>
                  <span>Design Box &amp; Inspector</span>
                </button>
              )}

              {/* ============================================================= */}
              {/* FLOATING BOTTOM CONTROL BAR                                    */}
              {/* ============================================================= */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#15110e]/95 text-[#e5d8cc] border border-[#bd9661]/40 rounded-xl shadow-xl px-3 py-1.5 flex items-center gap-2 text-xs z-30 pointer-events-auto backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Zoom Out */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
                  className="px-1.5 py-0.5 rounded hover:bg-[#2b221a] font-bold text-[#bd9661] cursor-pointer"
                  title="Zoom Out"
                >
                  −
                </button>

                {/* Zoom Level Readout */}
                <span className="font-mono text-[11px] font-bold w-10 text-center text-[#fce4ca]">{zoomLevel}%</span>

                {/* Zoom In */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
                  className="px-1.5 py-0.5 rounded hover:bg-[#2b221a] font-bold text-[#bd9661] cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* Fit Screen */}
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="p-1 rounded hover:bg-[#2b221a] text-[#c5b5a5] hover:text-[#bd9661] cursor-pointer"
                  title="Fit to Screen"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>

                {/* Grid Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setGridStyle(gridStyle === 'dots' ? 'lines' : gridStyle === 'lines' ? 'blank' : 'dots');
                  }}
                  className={`p-1 rounded hover:bg-[#2b221a] transition-colors cursor-pointer ${
                    gridStyle !== 'blank' ? 'text-[#bd9661]' : 'text-gray-500'
                  }`}
                  title={`Grid mode: ${gridStyle}`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                  </svg>
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* Undo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`p-1 rounded transition-colors ${
                    historyIndex > 0 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                </button>

                {/* Redo */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`p-1 rounded transition-colors ${
                    historyIndex < history.length - 1 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                  </svg>
                </button>
              </div>'''

file_path = r'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find createPortal(
portal_idx = content.find('createPortal(')
if portal_idx == -1:
    print('Error: createPortal not found!')
    sys.exit(1)

# Find where the studio content starts after createPortal(\n
start_marker = '<div className="fixed inset-0 w-screen h-screen z-[99999999]'
start_pos = content.find(start_marker, portal_idx)

# Find where upload modal starts: {/* =============================================================== */}
# {/* 3. DIRECT FILE UPLOAD MODAL
end_marker = '{/* 3. DIRECT FILE UPLOAD MODAL (Lottie JSON / CSS / WebM)'
end_pos = content.find(end_marker, start_pos)

if start_pos == -1 or end_pos == -1:
    print(f'Error finding markers: start={start_pos}, end={end_pos}')
    sys.exit(1)

# Replace between start_pos and end_pos with new_studio_jsx + '\n\n            {/* =============================================================== */}\n            '
updated = content[:start_pos] + new_studio_jsx.strip() + '\n\n            {/* =============================================================== */}\n            ' + content[end_pos:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(updated)

print('Successfully updated SuperAdminCardStudio.tsx!')
