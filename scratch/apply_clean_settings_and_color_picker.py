import sys, re
sys.stdout.reconfigure(encoding='utf-8')

studio_file = 'src/components/SuperAdminCardStudio.tsx'
with open(studio_file, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add import for ColorPicker2D
if 'ColorPicker2D' not in code:
    code = "import { ColorPicker2D } from './ColorPicker2D';\n" + code
    print("Added ColorPicker2D import.")

# 2. Add 'corner-botanical' to SVG_ASSETS
corner_botanical_asset = """  'corner-botanical': {
    name: 'Corner Botanical Blossom',
    category: 'flower',
    render: (stroke, fill = '#ffffff') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        {/* Foliage Leaf Top */}
        <path d="M48 24 C36 12 55 8 72 16 C58 22 52 24 48 24 Z" fill="#4a5d4e" stroke={stroke} strokeWidth="1" />
        {/* Foliage Leaf Left */}
        <path d="M24 48 C12 36 8 55 16 72 C22 58 24 52 24 48 Z" fill="#5c6f58" stroke={stroke} strokeWidth="1" />
        {/* Soft Accent Leaf */}
        <path d="M38 38 C26 22 42 16 58 28 C46 32 40 36 38 38 Z" fill="#3a4a3e" stroke={stroke} strokeWidth="1" />
        {/* Delicate White Gardenia Petals */}
        <circle cx="32" cy="32" r="16" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="25" cy="25" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="39" cy="25" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="25" cy="39" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        <circle cx="39" cy="39" r="9" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.95" />
        {/* Center Heirloom Gold Bead */}
        <circle cx="32" cy="32" r="4.5" fill="#bd9661" stroke="#ffffff" strokeWidth="1" />
      </svg>
    ),
  },
"""

if "'corner-botanical'" not in code:
    code = code.replace("  // Flowers\n", "  // Flowers\n" + corner_botanical_asset)
    print("Added corner-botanical asset.")

# 3. Add Image 4 template as Template 1 in INITIAL_TEMPLATES
image4_template = """  {
    id: 'botanical-classic',
    name: 'Botanical Garden Classic',
    category: 'Botanical',
    animationType: 'Classic Envelope Flap Pop',
    sourceType: 'designer',
    baseColor: '#fcfbf7',
    foilColor: '#bd9661',
    envelopeColor: '#231c16',
    cardShape: 'classic-rounded',
    cardShimmer: 'none',
    duration: '1.4s',
    active: true,
    createdAt: 'Platform Built-in',
    elements: [
      { id: 'flw-corner', type: 'flower', content: 'corner-botanical', x: 13, y: 10, scale: 1.15, rotation: 0, color: '#bd9661', fillColor: '#ffffff' },
      { id: 'txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 14, fontSize: 9, fontFamily: 'serif', letterSpacing: '2.5px', isBold: true, color: '#bd9661' },
      { id: 'txt-2', type: 'text', content: 'Sophie Taylor', x: 50, y: 22, fontSize: 26, fontFamily: 'serif', isItalic: true, color: '#bd9661' },
      { id: 'txt-3', type: 'text', content: 'AND', x: 50, y: 29, fontSize: 8.5, fontFamily: 'serif', letterSpacing: '3px', color: '#8b7b6b' },
      { id: 'txt-4', type: 'text', content: 'Daniel Carter', x: 50, y: 36, fontSize: 26, fontFamily: 'serif', isItalic: true, color: '#bd9661' },
      { id: 'txt-5', type: 'text', content: 'INVITE YOU TO CELEBRATE THEIR WEDDING', x: 50, y: 44, fontSize: 8, fontFamily: 'sans', letterSpacing: '1.5px', color: '#bd9661' },
      { id: 'txt-6', type: 'text', content: 'SATURDAY   |   14   |   NOVEMBER 2026', x: 50, y: 51, fontSize: 10.5, fontFamily: 'serif', isBold: true, color: '#bd9661' },
      { id: 'txt-7', type: 'text', content: 'AT 4:00 PM', x: 50, y: 56, fontSize: 8.5, fontFamily: 'serif', letterSpacing: '1px', color: '#8b7b6b' },
      { id: 'txt-8', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY, NSW', x: 50, y: 62, fontSize: 9, fontFamily: 'sans', isBold: true, color: '#bd9661' },
      { id: 'div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 67, scale: 0.75, color: '#bd9661' },
      { id: 'qr-1', type: 'qrcode', content: 'qrcode-rsvp', x: 50, y: 78, scale: 0.9, color: '#bd9661', fillColor: '#ffffff' },
      { id: 'txt-9', type: 'text', content: 'DINNER & DANCING TO FOLLOW • SCAN TO RSVP', x: 50, y: 91, fontSize: 7.5, fontFamily: 'serif', letterSpacing: '1.5px', color: '#8b7b6b' },
    ],
  },
"""

if "'botanical-classic'" not in code:
    code = code.replace("const INITIAL_TEMPLATES: CustomCardTemplate[] = [\n", "const INITIAL_TEMPLATES: CustomCardTemplate[] = [\n" + image4_template)
    print("Added Image 4 template to INITIAL_TEMPLATES.")

# 4. Add Image 4 items to DESIGN_BOX_ITEMS
image4_items = """  // Image 4 Specialized Stationery Blocks
  { id: 'item-corner-blossom', type: 'flower', content: 'corner-botanical', name: 'Corner Blossom', category: 'flower', fillColor: '#ffffff' },
"""
if "'item-corner-blossom'" not in code:
    code = code.replace("  // Flowers\n", "  // Flowers\n" + image4_items)
    print("Added corner blossom to DESIGN_BOX_ITEMS.")

with open(studio_file, 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved preliminary updates to SuperAdminCardStudio.tsx.")
