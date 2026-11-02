with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any lingering dark text and background colors inside the inspector
text = text.replace(
    '<span className="font-mono text-[10px] text-[#fce4ca] font-bold">\n                                    {selectedElement.rotation || 0}°',
    '<span className="font-mono text-[10px] text-[#15110e] font-bold bg-white px-1.5 py-0.5 rounded border border-[#e2d8c9]">\n                                    {selectedElement.rotation || 0}°'
)
text = text.replace(
    'className="text-[9px] text-[#8b7b6b] hover:text-[#bd9661] cursor-pointer"',
    'className="text-[10px] font-bold text-[#8c6b3e] hover:underline cursor-pointer"'
)
text = text.replace(
    'text-[10px] font-bold uppercase tracking-[1.2px] text-[#bd9661]',
    'text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]'
)
text = text.replace(
    'text-[9px] text-[#fce4ca] capitalize',
    'text-[10px] font-bold text-[#15110e] capitalize'
)
text = text.replace(
    'text-[9px] text-[#fce4ca]',
    'text-[10px] font-mono font-bold text-[#15110e]'
)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned lingering text colors in cards!")
