with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # 1. Font size text color: put in black colour
    if 'text-[#fce4ca] font-bold' in line and 'Font Size' in lines[i-1]:
        lines[i] = line.replace('text-[#fce4ca]', 'text-[#15110e] bg-white px-1.5 py-0.5 rounded border border-[#e2d8c9]')
        print(f"Updated font size color at line {i+1}")

    # 2. Font family badge: remove this text no need
    if "{selectedElement.fontFamily || 'Playfair Display'}" in line and 'Font Family' in lines[i-3]:
        # Replace lines i-4 to i+2
        # line i-4 is: <div className="flex items-center justify-between mb-1">
        # line i-1 is: <span className="text-[9px] font-mono font-bold text-[#8c6b3e] bg-[#f0eae1] px-1.5 py-0.5 rounded">
        # line i is: {selectedElement.fontFamily || 'Playfair Display'}
        # line i+1 is: </span>
        # We can just remove lines i-1, i, i+1, and change line i-4 to <div className="mb-1">
        lines[i-4] = lines[i-4].replace('flex items-center justify-between mb-1', 'mb-1')
        lines[i-1] = ''
        lines[i] = ''
        lines[i+1] = ''
        print(f"Removed font family badge around line {i+1}")

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("SUCCESS: Finished update_font_ui.py!")
