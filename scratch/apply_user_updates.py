import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_until = -1

# Let's inspect line by line and apply the updates cleanly:
for i, line in enumerate(lines):
    if i < skip_until:
        continue

    # 1. Rename to just "Show More Themes"
    if "Show More Themes (2 More & Blank)" in line:
        line = line.replace("Show More Themes (2 More & Blank)", "Show More Themes")

    # 2. Remove "CLASSIC ROUNDED" from Card Silhouette Shape header
    if "{activeShapeObj.name}</span>" in line and "Card Silhouette Shape" in lines[i-1]:
        # Skip this line
        continue

    # 3. Remove "PREDEFINED ONLY" from Predefined 3D Motion header
    if "Predefined Only" in line and "Predefined 3D Motion" in lines[i-1]:
        # Skip this line
        continue

    # 4. In Foil & Typography Color:
    # Rename "Custom Color Spectrum" to "Custom Color" and remove Active Foil Preview box
    if '<span>Custom Color Spectrum</span>' in line and i < 2000:
        line = line.replace('<span>Custom Color Spectrum</span>', '<span>Custom Color</span>')
        # Also adjust button classes on line i-7 or i-6 if needed
        # In lines[i-7:i], change px-2.5 py-1 to px-2 py-0.5 and PaletteIcon w-3 h-3 to w-2.5 h-2.5
    if 'text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs' in line and i < 1900:
        line = line.replace('text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs',
                            'text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap')
    if '<PaletteIcon className="w-3 h-3 text-[#bd9661]" />' in line and i < 1900:
        line = line.replace('w-3 h-3', 'w-2.5 h-2.5')

    # Remove Active Foil Preview box (Gilded Foil)
    if '{/* Active Foil Preview */}' in line:
        # Find where this box ends: </div\n
        end_idx = i
        while end_idx < len(lines) and 'Gilded Foil' not in lines[end_idx]:
            end_idx += 1
        end_idx += 1 # skip line with </div>
        skip_until = end_idx
        continue

    # 5. In Envelope Backdrop:
    # Clean up title: "Envelope Backdrop (Image 4)" -> "Envelope Backdrop"
    if 'Envelope Backdrop (Image 4)' in line:
        line = line.replace('Envelope Backdrop (Image 4)', 'Envelope Backdrop')

    # When showEnvelopeBackdrop is toggled on, move Custom Color button to header and remove the Active Envelope Preview box
    if '<label className="relative inline-flex items-center cursor-pointer">' in line and 'Envelope Backdrop' in lines[i-4]:
        # Add Custom Color button before the toggle switch
        custom_btn = '''                      <div className="flex items-center gap-2">
                        {showEnvelopeBackdrop && (
                          <button
                            type="button"
                            onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'envelope' ? null : 'envelope')}
                            className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                              activeColorPickerTab === 'envelope'
                                ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                                : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                            }`}
                            title="Pick custom envelope color from spectrum"
                          >
                            <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                            <span>Custom Color</span>
                          </button>
                        )}
'''
        new_lines.append(custom_btn)
        # Also need to close this div after the toggle switch
        # We will wrap the toggle in this div

    if '</label>' in line and 'showEnvelopeBackdrop' in lines[i-5]:
        new_lines.append(line)
        new_lines.append('                      </div>\n')
        continue

    # Remove Active Envelope box with [ #HEX Spectrum ]
    if '{showEnvelopeBackdrop && (' in line and i < 2000:
        new_lines.append(line)
        new_lines.append('                      <div className="space-y-1.5 animate-fadeIn">\n')
        # Skip the preview box
        end_idx = i + 1
        while end_idx < len(lines) and 'activeColorPickerTab === \'envelope\' && (' not in lines[end_idx]:
            end_idx += 1
        skip_until = end_idx
        continue

    # 6. In Inspector: Foil / Outline Stroke
    # Remove the hex text: <span className="font-mono text-[10px] font-mono font-bold text-[#15110e]">{selectedElement.color || foilColor}</span>
    if '{selectedElement.color || foilColor}</span>' in line and 'Foil / Outline Stroke' in lines[i-2]:
        # Replace the entire <div className="flex items-center gap-1.5"> with just the button
        continue

    if '<div className="flex items-center gap-1.5">' in line and 'Foil / Outline Stroke' in lines[i-1]:
        # Skip this wrapper div so button is directly aligned with title
        continue

    if '<span>Custom Color Spectrum</span>' in line and i > 2800:
        line = line.replace('<span>Custom Color Spectrum</span>', '<span>Custom Color</span>')
        # Replace button style
    if 'text-[9px] px-2.5 py-1 rounded-lg font-bold' in line and i > 2800:
        line = line.replace('text-[9px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs',
                            'text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap')
    if '<PaletteIcon className="w-3 h-3 text-[#bd9661]" />' in line and i > 2800:
        line = line.replace('w-3 h-3', 'w-2.5 h-2.5')

    if '</div>\n' in line and i > 2940 and i < 2960 and 'Custom Color' in lines[i-2]:
        # This was the closing tag for the gap-1.5 div wrapper
        continue

    # 7. In Inspector: Remove Direct Resizing helper text box
    if 'Direct Resizing' in line and 'uppercase tracking-[1.4px]' in line:
        # Find where this p-2.5 box starts and ends
        # The start was the previous line: <div className="p-2.5 rounded-xl bg-[#faf7f2] ...">
        # Remove the previously appended line if it was that container div
        if 'p-2.5 rounded-xl bg-[#faf7f2]' in new_lines[-1]:
            new_lines.pop()
        # Find where this box ends: after the </p> and </div>
        end_idx = i
        while end_idx < len(lines) and '<span>Rotation</span>' not in lines[end_idx]:
            end_idx += 1
        # Backtrack to the <div> before <span>Rotation</span>
        while '<div>' not in lines[end_idx]:
            end_idx -= 1
        skip_until = end_idx
        continue

    new_lines.append(line)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("SUCCESS: Transformed SuperAdminCardStudio.tsx successfully!")
