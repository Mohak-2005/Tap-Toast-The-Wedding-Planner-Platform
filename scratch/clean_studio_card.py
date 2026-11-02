import sys, re
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Default cardShimmer to 'none'
content = content.replace(
    "const [cardShimmer, setCardShimmer] = useState<'none' | 'gold-dust' | 'diamond-sparkle' | 'champagne-sheen'>('gold-dust');",
    "const [cardShimmer, setCardShimmer] = useState<'none' | 'gold-dust' | 'diamond-sparkle' | 'champagne-sheen'>('none');"
)

# 2. Clean element glow class
old_glow_calc = """                    let elementGlowClass = '';
                    if (el.shimmer === 'gold-glitter') elementGlowClass = 'animate-gold-glitter';
                    else if (el.shimmer === 'diamond') elementGlowClass = 'animate-diamond-sparkle';
                    else if (el.shimmer === 'fairy-dust') elementGlowClass = 'animate-fairy-dust';"""

new_glow_calc = """                    let elementGlowClass = '';"""

if old_glow_calc in content:
    content = content.replace(old_glow_calc, new_glow_calc)
    print("Cleaned element glow class calculation.")
else:
    print("Warning: old_glow_calc not found")

# 3. Clean text element classes
old_text_class = """                        {/* Text Element */}
                        {el.type === 'text' && (
                          <div
                            className={`px-2 py-0.5 whitespace-nowrap focus:outline-none ${
                              el.shimmer === 'gold-glitter'
                                ? 'animate-text-gold'
                                : el.shimmer === 'diamond'
                                ? 'animate-text-diamond'
                                : ''
                            }`}"""

new_text_class = """                        {/* Text Element */}
                        {el.type === 'text' && (
                          <div
                            className="px-2 py-0.5 whitespace-nowrap focus:outline-none select-none" """

if old_text_class in content:
    content = content.replace(old_text_class, new_text_class)
    print("Cleaned text element class.")
else:
    print("Warning: old_text_class not found")

# 4. Clean text element color override
old_text_color = "color: el.shimmer && el.shimmer !== 'none' ? undefined : (el.color || foilColor),"
new_text_color = "color: el.color || foilColor,"
if old_text_color in content:
    content = content.replace(old_text_color, new_text_color)
    print("Cleaned text element color.")
else:
    print("Warning: old_text_color not found")

# 5. Remove shimmer sparkle badge indicator
old_badge = """                            {/* Shimmer sparkle badge indicator */}
                            {el.shimmer === 'gold-glitter' && (
                              <span className="absolute -top-1 -right-1 text-[11px] text-[#fde047] pointer-events-none animate-bounce">✨</span>
                            )}"""

if old_badge in content:
    content = content.replace(old_badge, "")
    print("Removed shimmer sparkle badge indicator.")
else:
    print("Warning: old_badge not found")

# 6. Remove animated keyframes from style tag
style_regex = r'<style>\{\`.*?\`\}</style>'
content = re.sub(style_regex, '<style>{`/* Clean Letterpress Styling - No Moving Sheens */`}</style>', content, flags=re.DOTALL)
print("Replaced style tag keyframes with clean styling.")

# 7. Make sure canvas background is completely cremish
canvas_bg_regex = r"gridStyle === 'dots'\s*\?\s*'[^']+'\s*:\s*gridStyle === 'lines'\s*\?\s*'[^']+'\s*:\s*'[^']+'"
new_canvas_bg_expr = (
    "gridStyle === 'dots'\n"
    "                  ? 'bg-[#fbf8f2] [background-image:radial-gradient(#cbbda8_1.2px,transparent_1.2px)] [background-size:24px_24px]'\n"
    "                  : gridStyle === 'lines'\n"
    "                  ? 'bg-[#fbf8f2] [background-image:linear-gradient(to_right,#e4dbcd_1px,transparent_1px),linear-gradient(to_bottom,#e4dbcd_1px,transparent_1px)] [background-size:28px_28px]'\n"
    "                  : 'bg-[#fbf8f2]'"
)
content = re.sub(canvas_bg_regex, new_canvas_bg_expr, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished cleaning studio card in SuperAdminCardStudio.tsx!")
