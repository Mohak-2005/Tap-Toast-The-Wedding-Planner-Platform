import sys
sys.stdout.reconfigure(encoding='utf-8')

studio_file = 'src/components/SuperAdminCardStudio.tsx'
with open(studio_file, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update compact header
target_header = """          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] shrink-0 shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 8l9 6 9-6" />
                <circle cx="12" cy="14" r="2" fill="#bd9661" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-[#15110e]">Invitation Card Themes</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#faf5ee] text-[#bd9661] border border-[#bd9661]/30">
                  {templates.length} Themes
                </span>
              </div>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                Manage digital card designs &amp; predefined 3D unboxing animations. Click "Design" to open Whiteboard Studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenNewDesign}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#15110e] text-[#fce4ca] hover:bg-[#2b221a] text-xs font-semibold border border-[#bd9661]/50 shadow-xs cursor-pointer transition-all"
            >
              <span className="text-sm">+</span>
              <span>Design New Theme</span>
            </button>
          </div>
        </div>"""

replacement_header = """          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] shrink-0 shadow-2xs">
              <span className="text-lg">💌</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base font-bold text-[#15110e]">
                  {mode === 'couple' ? 'Bespoke Invitation Cards & 3D Unboxing' : 'Invitation Card Themes'}
                </h3>
                {isComingSoon && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#15110e] text-[#bd9661] border border-[#bd9661]/50 text-[11px] font-bold shadow-xs">
                    <span className="text-amber-400">✨</span>
                    <span>Coming Soon</span>
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#faf5ee] text-[#8b7b6b] border border-[#e8ded0]">
                  {templates.length} Themes
                </span>
              </div>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                {mode === 'couple'
                  ? 'Design bespoke letterpress wedding invitations with custom silhouettes, botanical art, and hardware-accelerated 3D unboxing motions for your guests.'
                  : 'Manage digital card designs & predefined 3D unboxing animations. Click "Design" to open Whiteboard Studio.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenNewDesign}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#15110e] text-[#fce4ca] hover:bg-[#2b221a] text-xs font-semibold border border-[#bd9661]/50 shadow-xs cursor-pointer transition-all"
            >
              <span className="text-[#bd9661]">🎨</span>
              <span>{mode === 'couple' ? 'Try Studio Preview' : 'Design New Theme'}</span>
              {isComingSoon && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#bd9661]/20 text-[#bd9661] border border-[#bd9661]/30 ml-0.5 font-bold">
                  Coming Soon
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Coming Soon Announcement Banner for Couple View */}
        {isComingSoon && (
          <div className="bg-[#faf7f2] border border-[#ebd3a8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#15110e] border border-[#bd9661]/40 text-[#bd9661] flex items-center justify-center text-lg shrink-0 shadow-2xs">
                ✨
              </div>
              <div>
                <div className="font-bold text-[#15110e] flex items-center gap-2">
                  <span>Interactive 3D Invitation Studio</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#bd9661]/20 text-[#bd9661] text-[10px] font-bold uppercase tracking-wider border border-[#bd9661]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661] animate-pulse"></span>
                    Coming Soon
                  </span>
                </div>
                <p className="text-[#8b7b6b] text-[11px] mt-0.5">
                  Soon you will be able to fully personalize your wedding card silhouette, wax seals, botanical florals, and envelope unboxing motions directly from your Couple Dashboard.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenNewDesign}
              className="px-3.5 py-2 rounded-lg bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>🎨 Try Studio Preview</span>
            </button>
          </div>
        )}"""

if target_header in code:
    code = code.replace(target_header, replacement_header)
    print("Updated compact header with Coming Soon features!")
else:
    print("Warning: target_header not found!")

# 2. Add Coming Soon badge on each card's palette row
target_palette = """                  <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-md border border-[#e2d8c9]" title="Paper / Foil / Envelope">
                    <span className="text-[9px] text-[#8b7b6b] font-medium mr-0.5">Palette</span>
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.baseColor }} />
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.foilColor }} />
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.envelopeColor }} />
                  </div>"""

replacement_palette = """                  <div className="flex items-center gap-1.5">
                    {isComingSoon && (
                      <span className="text-[9px] font-bold text-[#bd9661] uppercase tracking-wider px-2 py-0.5 rounded bg-[#faf5ee] border border-[#e8ded0]">
                        Coming Soon
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-md border border-[#e2d8c9]" title="Paper / Foil / Envelope">
                      <span className="text-[9px] text-[#8b7b6b] font-medium mr-0.5">Palette</span>
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.baseColor }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.foilColor }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: tpl.envelopeColor }} />
                    </div>
                  </div>"""

if target_palette in code:
    code = code.replace(target_palette, replacement_palette)
    print("Added Coming Soon badge to theme card palette rows!")
else:
    print("Warning: target_palette not found!")

with open(studio_file, 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved SuperAdminCardStudio.tsx!")
