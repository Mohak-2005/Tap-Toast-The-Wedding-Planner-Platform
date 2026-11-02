import sys, re
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change root container bg to #fbf8f2
content = content.replace(
    '<div className="fixed inset-0 w-screen h-screen z-[99999999] bg-[#120f0d] flex flex-col select-none overflow-hidden animate-fadeIn">',
    '<div className="fixed inset-0 w-screen h-screen z-[99999999] bg-[#fbf8f2] flex flex-col select-none overflow-hidden animate-fadeIn">'
)

# 2. Change canvas container background to cremish with dots/lines
old_canvas_bg = """            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center p-6 ${
                gridStyle === 'dots'
                  ? 'bg-[#181310] [background-image:radial-gradient(#3d3024_1.2px,transparent_1.2px)] [background-size:24px_24px]'
                  : gridStyle === 'lines'
                  ? 'bg-[#181310] [background-image:linear-gradient(to_right,#241c16_1px,transparent_1px),linear-gradient(to_bottom,#241c16_1px,transparent_1px)] [background-size:28px_28px]'
                  : 'bg-[#14100d]'
              }`}"""

new_canvas_bg = """            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center p-6 ${
                gridStyle === 'dots'
                  ? 'bg-[#fbf8f2] [background-image:radial-gradient(#cbbda8_1.2px,transparent_1.2px)] [background-size:24px_24px]'
                  : gridStyle === 'lines'
                  ? 'bg-[#fbf8f2] [background-image:linear-gradient(to_right,#e4dbcd_1px,transparent_1px),linear-gradient(to_bottom,#e4dbcd_1px,transparent_1px)] [background-size:28px_28px]'
                  : 'bg-[#fbf8f2]'
              }`}"""

if old_canvas_bg in content:
    content = content.replace(old_canvas_bg, new_canvas_bg)
    print("Replaced canvas background with creamy UI color.")
else:
    print("Warning: old_canvas_bg not found exactly!")

# 3. Remove all cardShimmer overlays from inside the card
# Search from 'Wedding Card Shimmer / Glitter Effect Overlay' to '3D Envelope Flap Overlay'
shimmer_start = content.find('{/* Wedding Card Shimmer / Glitter Effect Overlay */}')
flap_start = content.find('{/* 3D Envelope Flap Overlay for simulation */}')
if shimmer_start != -1 and flap_start != -1:
    content = content[:shimmer_start] + content[flap_start:]
    print("Removed all moving golden card shimmer overlays from wedding card.")
else:
    print(f"Warning: shimmer_start={shimmer_start}, flap_start={flap_start}")

# 4. Remove animated glowing classes on elements
# In style tag, replace keyframes
old_style_block = """            <style>{`
              @keyframes shimmerSweep {
                0% { transform: translateX(-150%) rotate(25deg); }
                100% { transform: translateX(250%) rotate(25deg); }
              }
              @keyframes goldGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 4px rgba(218, 165, 32, 0.7)) drop-shadow(0 0 1px rgba(255, 215, 0, 0.9)); }
                50% { filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.95)) drop-shadow(0 0 3px rgba(255, 245, 200, 1)); }
              }
              @keyframes diamondGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 1px rgba(220, 240, 255, 0.9)); }
                50% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 3px rgba(255, 255, 255, 1)); }
              }
              @keyframes fairyDustGlowPulse {
                0%, 100% { filter: drop-shadow(0 0 3px rgba(244, 114, 182, 0.7)); }
                50% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 3px rgba(244, 114, 182, 0.8)); }
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
                color: transparent;
                -webkit-background-clip: text;
                animation: textGoldSweep 3.5s linear infinite;
              }
              .animate-text-diamond {
                background: linear-gradient(90deg, #dfc194 0%, #ffffff 50%, #dfc194 100%);
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                animation: textGoldSweep 3s linear infinite;
              }
            `}</style>"""

new_style_block = """            <style>{`
              /* Crisp stationary letterpress styling - no moving glares */
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.1);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(189,150,97,0.4);
                border-radius: 4px;
              }
            `}</style>"""

if old_style_block in content:
    content = content.replace(old_style_block, new_style_block)
    print("Removed keyframes and moving gradient animations from style block.")
else:
    print("Warning: old_style_block not found exactly!")

# 5. Clean up element rendering inside the wedding card so flowers, leaves, decor and text have NO moving glows or bounce stars
old_flower_render = """                        {/* Flower Element */}
                        {el.type === 'flower' && (
                          <div
                            className={`w-14 h-14 ${
                              el.shimmer === 'gold-glitter'
                                ? 'animate-gold-glitter'
                                : el.shimmer === 'diamond'
                                ? 'animate-diamond-sparkle'
                                : el.shimmer === 'fairy-dust'
                                ? 'animate-fairy-dust'
                                : ''
                            }`}
                          >
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                            {el.shimmer && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-[#fde047] pointer-events-none animate-bounce">✨</span>
                            )}
                          </div>
                        )}

                        {/* Leaf Element */}
                        {el.type === 'leaf' && (
                          <div
                            className={`w-14 h-14 ${
                              el.shimmer === 'gold-glitter'
                                ? 'animate-gold-glitter'
                                : el.shimmer === 'diamond'
                                ? 'animate-diamond-sparkle'
                                : el.shimmer === 'fairy-dust'
                                ? 'animate-fairy-dust'
                                : ''
                            }`}
                          >
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                            {el.shimmer && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-[#fde047] pointer-events-none animate-bounce">✨</span>
                            )}
                          </div>
                        )}

                        {/* Decor / Seal Element */}
                        {el.type === 'decor' && (
                          <div
                            className={`w-12 h-12 ${
                              el.shimmer === 'gold-glitter'
                                ? 'animate-gold-glitter'
                                : el.shimmer === 'diamond'
                                ? 'animate-diamond-sparkle'
                                : el.shimmer === 'fairy-dust'
                                ? 'animate-fairy-dust'
                                : ''
                            }`}
                          >
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                            {el.shimmer && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-[#fde047] pointer-events-none animate-bounce">✨</span>
                            )}
                          </div>
                        )}"""

new_flower_render = """                        {/* Flower Element */}
                        {el.type === 'flower' && (
                          <div className="w-14 h-14">
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                          </div>
                        )}

                        {/* Leaf Element */}
                        {el.type === 'leaf' && (
                          <div className="w-14 h-14">
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                          </div>
                        )}

                        {/* Decor / Seal Element */}
                        {el.type === 'decor' && (
                          <div className="w-12 h-12">
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                          </div>
                        )}"""

if old_flower_render in content:
    content = content.replace(old_flower_render, new_flower_render)
    print("Cleaned up flower, leaf, decor rendering.")
else:
    print("Warning: old_flower_render not found exactly!")

# 6. Clean up text element rendering so text has no moving gradient sweeps
old_text_render = """                        {/* Text Element */}
                        {el.type === 'text' && (
                          <div
                            className={`text-center select-none ${
                              el.shimmer === 'gold-glitter'
                                ? 'animate-text-gold'
                                : el.shimmer === 'diamond'
                                ? 'animate-text-diamond'
                                : ''
                            }`}
                            style={{
                              color: el.shimmer ? undefined : el.color || foilColor,
                              fontSize: `${el.fontSize || 14}px`,
                              fontFamily:
                                el.fontFamily === 'serif'
                                  ? 'Playfair Display, serif'
                                  : el.fontFamily === 'script'
                                  ? 'Pinyon Script, cursive'
                                  : 'DM Sans, sans-serif',
                              fontWeight: el.isBold ? 700 : 400,
                              fontStyle: el.isItalic ? 'italic' : 'normal',
                              letterSpacing: el.letterSpacing || 'normal',
                              whiteSpace: 'nowrap',
                              textShadow: el.color === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                            }}
                          >
                            {el.content}
                            {el.shimmer && (
                              <span className="inline-block ml-1 text-[10px] text-[#fde047] pointer-events-none align-super">✦</span>
                            )}
                          </div>
                        )}"""

new_text_render = """                        {/* Text Element */}
                        {el.type === 'text' && (
                          <div
                            className="text-center select-none"
                            style={{
                              color: el.color || foilColor,
                              fontSize: `${el.fontSize || 14}px`,
                              fontFamily:
                                el.fontFamily === 'serif'
                                  ? 'Playfair Display, serif'
                                  : el.fontFamily === 'script'
                                  ? 'Pinyon Script, cursive'
                                  : 'DM Sans, sans-serif',
                              fontWeight: el.isBold ? 700 : 400,
                              fontStyle: el.isItalic ? 'italic' : 'normal',
                              letterSpacing: el.letterSpacing || 'normal',
                              whiteSpace: 'nowrap',
                              textShadow: el.color === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
                            }}
                          >
                            {el.content}
                          </div>
                        )}"""

if old_text_render in content:
    content = content.replace(old_text_render, new_text_render)
    print("Cleaned up text element rendering.")
else:
    print("Warning: old_text_render not found exactly!")

# 7. Clean initial templates and design box items
content = re.sub(r"cardShimmer:\s*'[^']+',?", "cardShimmer: 'none',", content)
content = re.sub(r",\s*shimmer:\s*'[^']+'", "", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully written changes to SuperAdminCardStudio.tsx!")
