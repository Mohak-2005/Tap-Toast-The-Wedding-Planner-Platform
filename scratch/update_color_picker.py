with open('src/components/ColorPicker2D.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''    <div
      className={`rounded-xl p-3 select-none transition-all ${
        darkMode
          ? 'bg-[#181310] border border-[#3d3024] shadow-md text-white'
          : 'bg-[#fcfbf9] border border-[#e8ded0] shadow-2xs text-[#15110e]'
      }`}
    >
      {/* 2D Spectrum Box + Vertical Lightness Bar (Exact Image 3 Layout) */}'''

replacement = '''    <div
      className={`rounded-xl p-3 select-none transition-all ${
        darkMode
          ? 'bg-[#181310] border border-[#3d3024] shadow-md text-white'
          : 'bg-[#fcfbf9] border border-[#e8ded0] shadow-2xs text-[#15110e]'
      }`}
    >
      {/* Custom Color Spectrum Header */}
      <div className={`flex items-center justify-between pb-1.5 mb-2 border-b ${darkMode ? 'border-[#3d3024]' : 'border-[#ede5d8]'}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🎨</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c6b3e]">
            Custom Color Spectrum
          </span>
        </div>
        <span className="text-[9px] text-[#8b7b6b]">
          Drag to pick custom shade
        </span>
      </div>

      {/* 2D Spectrum Box + Vertical Lightness Bar (Exact Image 3 Layout) */}'''

if target in text:
    text = text.replace(target, replacement)
    with open('src/components/ColorPicker2D.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated ColorPicker2D.tsx')
else:
    print('target not found')
