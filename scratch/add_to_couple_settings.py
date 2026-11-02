import sys, re
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update src/components/SuperAdminCardStudio.tsx
studio_file = 'src/components/SuperAdminCardStudio.tsx'
with open(studio_file, 'r', encoding='utf-8') as f:
    studio_code = f.read()

# Add interface and props
old_comp_decl = "export const SuperAdminCardStudio: React.FC = () => {"
new_comp_decl = """export interface SuperAdminCardStudioProps {
  mode?: 'superadmin' | 'couple';
  isComingSoon?: boolean;
}

export const SuperAdminCardStudio: React.FC<SuperAdminCardStudioProps> = ({
  mode = 'couple',
  isComingSoon = true,
}) => {"""

if old_comp_decl in studio_code:
    studio_code = studio_code.replace(old_comp_decl, new_comp_decl)
    print("Updated component declaration with props.")
else:
    print("Warning: old_comp_decl not found!")

# Update compact section header in SuperAdminCardStudio.tsx
old_compact_header = """            <div>
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenNewDesign()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="text-[#bd9661]">+</span>
              <span>Design New Theme</span>
            </button>
          </div>
        </div>"""

new_compact_header = """            <div>
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenNewDesign()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="text-[#bd9661]">🎨</span>
              <span>{mode === 'couple' ? 'Try Studio Preview' : 'Design New Theme'}</span>
              {isComingSoon && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#bd9661]/20 text-[#bd9661] border border-[#bd9661]/30 ml-0.5">
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
                💌
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
              onClick={() => handleOpenNewDesign()}
              className="px-3.5 py-2 rounded-lg bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>🎨 Try Studio Preview</span>
            </button>
          </div>
        )}"""

if old_compact_header in studio_code:
    studio_code = studio_code.replace(old_compact_header, new_compact_header)
    print("Updated compact section header with Coming Soon badge and banner.")
else:
    print("Warning: old_compact_header not found!")

# In the theme cards, update button text from 'Design →' to 'Preview Design →'
old_card_footer = """                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-[#f0ede4]">
                  <span className="text-[10px] text-[#8b7b6b]">3D ENGINE</span>
                  <button
                    type="button"
                    onClick={() => handleOpenDesignerFor(tpl)}
                    className="px-3 py-1.5 rounded-lg bg-[#15110e] hover:bg-[#2b221a] text-[#bd9661] hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Design</span>
                    <span>→</span>
                  </button>
                </div>"""

new_card_footer = """                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-[#f0ede4]">
                  <span className="text-[9px] font-bold text-[#bd9661] uppercase tracking-wider px-2 py-0.5 rounded bg-[#faf5ee] border border-[#e8ded0]">
                    Coming Soon
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenDesignerFor(tpl)}
                    className="px-3 py-1.5 rounded-lg bg-[#15110e] hover:bg-[#2b221a] text-[#bd9661] hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <span>{mode === 'couple' ? 'Preview' : 'Design'}</span>
                    <span>→</span>
                  </button>
                </div>"""

if old_card_footer in studio_code:
    studio_code = studio_code.replace(old_card_footer, new_card_footer)
    print("Updated theme cards footer with Coming Soon badge.")
else:
    print("Warning: old_card_footer not found!")

# In studio modal header, add couple preview badge
old_studio_badge = '<span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#241c16] text-[#bd9661] border border-[#bd9661]/30 hidden sm:inline-block font-mono">'
if old_studio_badge in studio_code:
    idx = studio_code.find(old_studio_badge)
    end_tag = studio_code.find('</span>', idx)
    studio_code = (
        studio_code[:idx] +
        '{mode === \'couple\' ? (\n'
        '                    <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#241c16] text-[#bd9661] border border-[#bd9661]/40 hidden sm:inline-flex items-center gap-1 font-mono font-bold">\n'
        '                      <span className="text-amber-400">✨</span> COUPLE PREVIEW • COMING SOON\n'
        '                    </span>\n'
        '                  ) : (\n'
        '                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#241c16] text-[#bd9661] border border-[#bd9661]/30 hidden sm:inline-block font-mono">\n'
        '                      WHITEBOARD STUDIO\n'
        '                    </span>\n'
        '                  )}' +
        studio_code[end_tag + 7:]
    )
    print("Updated studio modal header badge.")

with open(studio_file, 'w', encoding='utf-8') as f:
    f.write(studio_code)

print("Saved SuperAdminCardStudio.tsx")

# 2. Update src/components/CoupleView.tsx
couple_file = 'src/components/CoupleView.tsx'
with open(couple_file, 'r', encoding='utf-8') as f:
    couple_code = f.read()

# Add import
if 'SuperAdminCardStudio' not in couple_code:
    import_target = "import { initialVendors, weddingInfo } from '../lib/seedData';"
    couple_code = couple_code.replace(
        import_target,
        import_target + "\nimport { SuperAdminCardStudio } from './SuperAdminCardStudio';"
    )
    print("Added SuperAdminCardStudio import to CoupleView.tsx")

# Find Section 3 in Couple Settings and insert Section 4
section3_end = """              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">GUEST DRESS CODE STATEMENT</label>
                <input
                  type="text"
                  value={weddingSettings.dressCode}
                  onChange={(e) => setWeddingSettings({ ...weddingSettings, dressCode: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>
            </div>"""

section4_insertion = """              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">GUEST DRESS CODE STATEMENT</label>
                <input
                  type="text"
                  value={weddingSettings.dressCode}
                  onChange={(e) => setWeddingSettings({ ...weddingSettings, dressCode: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>
            </div>

            {/* Section 4: Bespoke Invitation Card Designer & 3D Unboxing (Coming Soon) */}
            <SuperAdminCardStudio mode="couple" isComingSoon={true} />"""

if section3_end in couple_code:
    couple_code = couple_code.replace(section3_end, section4_insertion)
    print("Inserted SuperAdminCardStudio into Couple Settings.")
else:
    print("Warning: section3_end not found!")

with open(couple_file, 'w', encoding='utf-8') as f:
    f.write(couple_code)

print("Saved CoupleView.tsx")
