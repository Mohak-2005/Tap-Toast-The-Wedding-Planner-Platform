import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove from SVG_ASSETS
bad_item = "  // Image 4 Specialized Stationery Blocks\n  { id: 'item-corner-blossom', type: 'flower', content: 'corner-botanical', name: 'Corner Blossom', category: 'flower', fillColor: '#ffffff' },\n"
if bad_item in code:
    code = code.replace(bad_item, "")
    print("Removed bad item from SVG_ASSETS.")
else:
    print("Warning: bad_item not found in SVG_ASSETS")

# 2. Add to DESIGN_BOX_ITEMS properly
design_box_marker = "const DESIGN_BOX_ITEMS: {\n  id: string;\n  type: CanvasElement['type'];\n  content: string;\n  name: string;\n  category: 'flower' | 'leaf' | 'decor' | 'text';\n  fillColor?: string;\n  fontSize?: number;\n  fontFamily?: CanvasElement['fontFamily'];\n  isBold?: boolean;\n  isItalic?: boolean;\n  letterSpacing?: string;\n  shimmer?: CanvasElement['shimmer'];\n}[] = [\n"

item_to_add = "  // Image 4 Corner Blossom\n  { id: 'item-corner-blossom', type: 'flower', content: 'corner-botanical', name: 'Corner Blossom', category: 'flower', fillColor: '#ffffff' },\n"

if design_box_marker in code and "id: 'item-corner-blossom'" not in code:
    code = code.replace(design_box_marker, design_box_marker + item_to_add)
    print("Added corner blossom to DESIGN_BOX_ITEMS.")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved file.")
