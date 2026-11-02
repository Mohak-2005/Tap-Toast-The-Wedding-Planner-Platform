import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove 'corner-botanical': { ... } from DESIGN_BOX_ITEMS
idx = code.find("DESIGN_BOX_ITEMS: {")
idx_bad = code.find("  'corner-botanical': {", idx)
if idx_bad != -1:
    idx_end = code.find("  },\n", idx_bad)
    code = code[:idx_bad] + code[idx_end + 5:]
    print("Removed misplaced corner-botanical from DESIGN_BOX_ITEMS.")

# Ensure 'corner-botanical' IS in SVG_ASSETS
svg_assets_idx = code.find("const SVG_ASSETS:")
if "'corner-botanical':" not in code[:idx]:
    insert_pos = code.find("  // Flowers\n", svg_assets_idx) + len("  // Flowers\n")
    asset_str = """  'corner-botanical': {
    name: 'Corner Botanical Blossom',
    category: 'flower',
    render: (stroke, fill = '#ffffff') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M48 24 C36 12 55 8 72 16 C58 22 52 24 48 24 Z" fill="#4a5d4e" stroke={stroke} strokeWidth="1" />
        <path d="M24 48 C12 36 8 55 16 72 C22 58 24 52 24 48 Z" fill="#5c6f58" stroke={stroke} strokeWidth="1" />
        <path d="M38 38 C26 22 42 16 58 28 C46 32 40 36 38 38 Z" fill="#3a4a3e" stroke={stroke} strokeWidth="1" />
        <circle cx="32" cy="32" r="16" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="25" cy="25" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="39" cy="25" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="25" cy="39" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="39" cy="39" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="32" cy="32" r="4.5" fill="#bd9661" stroke="#ffffff" strokeWidth="1" />
      </svg>
    ),
  },
"""
    code = code[:insert_pos] + asset_str + code[insert_pos:]
    print("Added corner-botanical to SVG_ASSETS.")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved file.")
