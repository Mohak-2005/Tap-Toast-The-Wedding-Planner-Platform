import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add ChevronDownIcon after ChevronRightIcon
chevron_icon = '''const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
'''
if 'const ChevronDownIcon' not in code:
    code = code.replace(
        'const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (',
        chevron_icon + '\nconst ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => ('
    )

# 2. Update CanvasElement interface and CustomCardTemplate interface
code = code.replace(
    "fontFamily?: 'serif' | 'sans' | 'script';",
    "fontFamily?: string;"
)
code = code.replace(
    "category: 'Botanical' | 'Midnight' | 'Coastal' | 'Vineyard' | 'Architectural' | 'Modern';",
    "category: 'Botanical' | 'Midnight' | 'Coastal' | 'Vineyard' | 'Architectural' | 'Modern' | 'Native Floral';"
)

# 3. Add WEDDING_FONTS catalog and getFontFamilyCss helper
wedding_fonts_code = '''
export interface WeddingFontOption {
  name: string;
  category: 'Letterpress Serif' | 'Romantic Script' | 'Modern Sans';
  sample: string;
  family: string;
}

export const WEDDING_FONTS: WeddingFontOption[] = [
  // Editorial & Letterpress Serif
  { name: 'Playfair Display', category: 'Letterpress Serif', sample: 'The Wedding of Sophie & Daniel', family: 'Playfair Display, Georgia, serif' },
  { name: 'Cormorant Garamond', category: 'Letterpress Serif', sample: 'The Wedding of Sophie & Daniel', family: 'Cormorant Garamond, serif' },
  { name: 'Cinzel', category: 'Letterpress Serif', sample: 'THE WEDDING OF SOPHIE & DANIEL', family: 'Cinzel, serif' },
  { name: 'Bodoni Moda', category: 'Letterpress Serif', sample: 'The Wedding of Sophie & Daniel', family: 'Bodoni Moda, serif' },
  { name: 'Lora', category: 'Letterpress Serif', sample: 'The Wedding of Sophie & Daniel', family: 'Lora, serif' },
  { name: 'Prata', category: 'Letterpress Serif', sample: 'The Wedding of Sophie & Daniel', family: 'Prata, serif' },
  
  // Romantic Calligraphy & Script
  { name: 'Pinyon Script', category: 'Romantic Script', sample: 'Sophie & Daniel', family: 'Pinyon Script, cursive' },
  { name: 'Great Vibes', category: 'Romantic Script', sample: 'Sophie & Daniel', family: 'Great Vibes, cursive' },
  { name: 'Alex Brush', category: 'Romantic Script', sample: 'Sophie & Daniel', family: 'Alex Brush, cursive' },
  { name: 'Parisienne', category: 'Romantic Script', sample: 'Sophie & Daniel', family: 'Parisienne, cursive' },
  
  // Modern Architectural Sans
  { name: 'DM Sans', category: 'Modern Sans', sample: 'THE BOTANICAL GARDEN • SYDNEY', family: 'DM Sans, sans-serif' },
  { name: 'Montserrat', category: 'Modern Sans', sample: 'THE BOTANICAL GARDEN • SYDNEY', family: 'Montserrat, sans-serif' },
];

export const getFontFamilyCss = (font?: string): string => {
  if (!font) return 'Playfair Display, Georgia, serif';
  if (font === 'serif') return 'Playfair Display, Georgia, serif';
  if (font === 'script') return 'Pinyon Script, cursive';
  if (font === 'sans') return 'DM Sans, sans-serif';
  if (['Pinyon Script', 'Great Vibes', 'Alex Brush', 'Parisienne'].includes(font)) {
    return `"${font}", cursive`;
  }
  if (['DM Sans', 'Montserrat'].includes(font)) {
    return `"${font}", sans-serif`;
  }
  return `"${font}", serif`;
};
'''
if 'WEDDING_FONTS' not in code:
    code = code.replace(
        'export interface CustomCardTemplate {',
        wedding_fonts_code + '\nexport interface CustomCardTemplate {'
    )

# 4. Replace INITIAL_TEMPLATES with the exact 5 Invitation Demo templates
new_templates_code = '''const INITIAL_TEMPLATES: CustomCardTemplate[] = [
  {
    id: 'magnolia-gold',
    name: 'Magnolia & Gilded Frame',
    category: 'Botanical',
    animationType: 'Classic Envelope Flap Pop',
    sourceType: 'designer',
    baseColor: '#fdfbf7',
    foilColor: '#c59a58',
    envelopeColor: '#201812',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'gold-dust',
    duration: '1.4s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'mg-flw-top', type: 'flower', content: 'magnolia-bloom', x: 18, y: 13, scale: 1.1, rotation: -20, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-top', type: 'leaf', content: 'eucalyptus-sprig', x: 28, y: 11, scale: 0.95, rotation: -45, color: '#44614d', fillColor: '#f2f7f3' },
      { id: 'mg-txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 17, fontSize: 9.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#c59a58' },
      { id: 'mg-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 28, fontSize: 28, fontFamily: 'Playfair Display', isItalic: true, color: '#1c150c' },
      { id: 'mg-txt-3', type: 'text', content: 'REQUEST THE HONOR OF YOUR PRESENCE', x: 50, y: 38, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#8b7454' },
      { id: 'mg-txt-4', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', x: 50, y: 48, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#c59a58' },
      { id: 'mg-txt-5', type: 'text', content: 'AT FOUR O\\'CLOCK IN THE AFTERNOON', x: 50, y: 55, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#8b7454' },
      { id: 'mg-txt-6', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY', x: 50, y: 63, fontSize: 9.5, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.5px', color: '#1c150c' },
      { id: 'mg-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 70, scale: 0.85, color: '#c59a58' },
      { id: 'mg-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 81, scale: 0.95, color: '#c59a58', fillColor: '#c59a58' },
      { id: 'mg-txt-7', type: 'text', content: 'RECEPTION TO FOLLOW', x: 50, y: 92, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '2px', color: '#8b7454' },
      { id: 'mg-flw-bot', type: 'flower', content: 'magnolia-bloom', x: 82, y: 87, scale: 1.05, rotation: 160, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-bot', type: 'leaf', content: 'eucalyptus-sprig', x: 74, y: 89, scale: 0.9, rotation: 135, color: '#44614d', fillColor: '#f2f7f3' },
    ],
  },
  {
    id: 'native-wattle',
    name: 'Native Wattle & Protea',
    category: 'Native Floral',
    animationType: 'French Gatefold Double Blossom',
    sourceType: 'designer',
    baseColor: '#ffffff',
    foilColor: '#487252',
    envelopeColor: '#17271b',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'none',
    duration: '1.6s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'nw-leaf-top', type: 'leaf', content: 'fern-frond', x: 18, y: 12, scale: 1.1, rotation: 25, color: '#487252', fillColor: '#edf5ee' },
      { id: 'nw-flw-top', type: 'flower', content: 'corner-botanical', x: 26, y: 14, scale: 0.9, rotation: 10, color: '#f59e0b', fillColor: '#fef3c7' },
      { id: 'nw-txt-1', type: 'text', content: 'CELEBRATE THE MARRIAGE OF', x: 50, y: 17, fontSize: 9, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#487252' },
      { id: 'nw-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 28, fontSize: 27, fontFamily: 'Pinyon Script', isItalic: true, color: '#152418' },
      { id: 'nw-txt-3', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 38, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#487252' },
      { id: 'nw-txt-4', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', x: 50, y: 48, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#152418' },
      { id: 'nw-txt-5', type: 'text', content: 'AT FIVE O\\'CLOCK IN THE EVENING', x: 50, y: 55, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#487252' },
      { id: 'nw-txt-6', type: 'text', content: 'THE WOODLANDS ESTATE • BLUE MOUNTAINS', x: 50, y: 63, fontSize: 9, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.2px', color: '#152418' },
      { id: 'nw-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 70, scale: 0.85, color: '#f59e0b' },
      { id: 'nw-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 81, scale: 0.95, color: '#487252', fillColor: '#3c6645' },
      { id: 'nw-txt-7', type: 'text', content: 'DINNER & DANCING UNDER THE STARS', x: 50, y: 92, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '2px', color: '#487252' },
      { id: 'nw-flw-bot', type: 'flower', content: 'protea-rose', x: 82, y: 86, scale: 1.15, rotation: -30, color: '#dc2626', fillColor: '#ffe4e6' },
      { id: 'nw-leaf-bot', type: 'leaf', content: 'eucalyptus-sprig', x: 74, y: 89, scale: 0.95, rotation: -60, color: '#487252', fillColor: '#edf5ee' },
    ],
  },
  {
    id: 'midnight-protea',
    name: 'Midnight Protea & Garland',
    category: 'Midnight',
    animationType: 'Velvet Ribbon Slide & Tilt',
    sourceType: 'designer',
    baseColor: '#171921',
    foilColor: '#e27b91',
    envelopeColor: '#18191c',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'diamond-sparkle',
    duration: '1.5s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'mp-flw-top', type: 'flower', content: 'protea-rose', x: 50, y: 9, scale: 1.1, rotation: 0, color: '#e27b91', fillColor: '#8a2337' },
      { id: 'mp-leaf-tl', type: 'leaf', content: 'eucalyptus-sprig', x: 30, y: 10, scale: 0.85, rotation: -40, color: '#e27b91', fillColor: '#2a1b24' },
      { id: 'mp-leaf-tr', type: 'leaf', content: 'eucalyptus-sprig', x: 70, y: 10, scale: 0.85, rotation: 40, color: '#e27b91', fillColor: '#2a1b24' },
      { id: 'mp-txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 19, fontSize: 9.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#e27b91' },
      { id: 'mp-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 30, fontSize: 29, fontFamily: 'Great Vibes', isItalic: true, color: '#ffffff' },
      { id: 'mp-txt-3', type: 'text', content: 'REQUEST THE PLEASURE OF YOUR COMPANY', x: 50, y: 40, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#e27b91' },
      { id: 'mp-txt-4', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', x: 50, y: 49, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#ffffff' },
      { id: 'mp-txt-5', type: 'text', content: 'AT SIX O\\'CLOCK IN THE EVENING', x: 50, y: 56, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#d1b8c2' },
      { id: 'mp-txt-6', type: 'text', content: 'DOLTONE HOUSE • SYDNEY HARBOUR', x: 50, y: 64, fontSize: 9.5, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.5px', color: '#e27b91' },
      { id: 'mp-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 72, scale: 0.85, color: '#e27b91' },
      { id: 'mp-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 82, scale: 0.95, color: '#e27b91', fillColor: '#8a2337' },
      { id: 'mp-txt-7', type: 'text', content: 'BLACK TIE OPTIONAL • RECEPTION TO FOLLOW', x: 50, y: 92, fontSize: 7.5, fontFamily: 'Cinzel', letterSpacing: '1.5px', color: '#a8949e' },
    ],
  },
  {
    id: 'coastal-harbor',
    name: 'Sydney Harbor & Fairy Lights',
    category: 'Coastal',
    animationType: 'Pocketfold Elevation & Twinkle',
    sourceType: 'designer',
    baseColor: '#0e1c36',
    foilColor: '#fae392',
    envelopeColor: '#0b162c',
    showEnvelopeBackdrop: true,
    cardShape: 'classic-rounded',
    cardShimmer: 'diamond-sparkle',
    duration: '1.8s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'ch-lights', type: 'graphic', content: 'fairy-lights', x: 50, y: 8, scale: 1.15, color: '#d6b87d', fillColor: '#fae392' },
      { id: 'ch-star-l', type: 'graphic', content: 'celestial-stars', x: 22, y: 15, scale: 0.75, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-star-r', type: 'graphic', content: 'celestial-stars', x: 78, y: 15, scale: 0.75, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-txt-1', type: 'text', content: 'YOU ARE CORDIALLY INVITED TO CELEBRATE', x: 50, y: 19, fontSize: 9, fontFamily: 'Cinzel', letterSpacing: '2px', isBold: true, color: '#fae392' },
      { id: 'ch-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 30, fontSize: 28, fontFamily: 'Playfair Display', isItalic: true, color: '#ffffff' },
      { id: 'ch-txt-3', type: 'text', content: 'UNDER THE HARBOR TWILIGHT & STARS', x: 50, y: 40, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#d6b87d' },
      { id: 'ch-txt-4', type: 'text', content: 'SATURDAY, 28 NOVEMBER 2026', x: 50, y: 49, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#ffffff' },
      { id: 'ch-txt-5', type: 'text', content: 'AT FIVE IN THE EVENING', x: 50, y: 56, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#d6b87d' },
      { id: 'ch-txt-6', type: 'text', content: 'WATSONS BAY BOUTIQUE HOTEL • SYDNEY', x: 50, y: 64, fontSize: 9.5, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.5px', color: '#fae392' },
      { id: 'ch-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 72, scale: 0.85, color: '#fae392' },
      { id: 'ch-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 82, scale: 0.95, color: '#fae392', fillColor: '#d4af37' },
      { id: 'ch-txt-7', type: 'text', content: 'RECEPTION BY THE WATER TO FOLLOW', x: 50, y: 92, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '2px', color: '#b8c7db' },
    ],
  },
  {
    id: 'vineyard-arch',
    name: 'Hunter Valley Vineyard Arch',
    category: 'Vineyard',
    animationType: 'Architectural Arch Kinetic Snap',
    sourceType: 'designer',
    baseColor: '#faf7f2',
    foilColor: '#dfc194',
    envelopeColor: '#231b14',
    showEnvelopeBackdrop: true,
    cardShape: 'arch-dome',
    cardShimmer: 'gold-dust',
    duration: '1.2s',
    active: true,
    createdAt: 'Invitation Demo',
    elements: [
      { id: 'va-vine-top', type: 'leaf', content: 'grape-vine', x: 50, y: 13, scale: 1.15, rotation: 0, color: '#dfc194', fillColor: '#ede4d3' },
      { id: 'va-txt-1', type: 'text', content: 'PLEASE JOIN US FOR THE WEDDING OF', x: 50, y: 24, fontSize: 9, fontFamily: 'Cinzel', letterSpacing: '2px', isBold: true, color: '#dfc194' },
      { id: 'va-txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 35, fontSize: 27, fontFamily: 'Bodoni Moda', isItalic: true, color: '#211913' },
      { id: 'va-txt-3', type: 'text', content: 'AMIDST THE VINES & CELEBRATION', x: 50, y: 44, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '2px', color: '#96784d' },
      { id: 'va-txt-4', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', x: 50, y: 52, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#211913' },
      { id: 'va-txt-5', type: 'text', content: 'AT FOUR IN THE AFTERNOON', x: 50, y: 59, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#96784d' },
      { id: 'va-txt-6', type: 'text', content: 'BIMBADGEN ESTATE • HUNTER VALLEY', x: 50, y: 67, fontSize: 9.5, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.5px', color: '#211913' },
      { id: 'va-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 74, scale: 0.85, color: '#dfc194' },
      { id: 'va-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 83, scale: 0.95, color: '#dfc194', fillColor: '#96784d' },
      { id: 'va-txt-7', type: 'text', content: 'DINNER, LOCAL WINES & DANCING TO FOLLOW', x: 50, y: 92, fontSize: 7.5, fontFamily: 'Cinzel', letterSpacing: '1.5px', color: '#96784d' },
    ],
  },
];
'''

code = re.sub(r'const INITIAL_TEMPLATES: CustomCardTemplate\[\] = \[[\s\S]*?\];\n', new_templates_code, code)

# 5. Add dropdown state variables inside SuperAdminCardStudio
state_additions = '''  // Dropdown States for Word-style Font selector, Shape, and Motion
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontSearchQuery, setFontSearchQuery] = useState('');
  const [isShapeDropdownOpen, setIsShapeDropdownOpen] = useState(false);
  const [isMotionDropdownOpen, setIsMotionDropdownOpen] = useState(false);
'''
code = code.replace(
    'const [isPlayingMotion, setIsPlayingMotion] = useState(false);',
    'const [isPlayingMotion, setIsPlayingMotion] = useState(false);\n' + state_additions
)

# 6. Update canvas element rendering to use getFontFamilyCss
old_canvas_font = '''                              fontFamily:
                                el.fontFamily === 'serif'
                                  ? 'Playfair Display, Georgia, serif'
                                  : el.fontFamily === 'script'
                                  ? 'Pinyon Script, cursive'
                                  : 'DM Sans, sans-serif','''
new_canvas_font = '''                              fontFamily: getFontFamilyCss(el.fontFamily),'''
code = code.replace(old_canvas_font, new_canvas_font)

# 7. Rename 2D Spectrum to Custom Color Spectrum
code = code.replace('<span>2D Spectrum</span>', '<span>Custom Color Spectrum</span>')

# 8. Convert Card Silhouette Shape to Dropdown
old_shape_block = '''                  {/* 1. Card Silhouette Shape */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-2 flex items-center justify-between">
                      <span>Card Silhouette Shape</span>
                      <span className="text-[9px] font-mono font-bold text-[#15110e] bg-[#f0eae1] px-1.5 py-0.5 rounded">{activeShapeObj.name}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {CARD_SHAPES.map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setCardShape(shape.id)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            cardShape === shape.id
                              ? 'bg-[#15110e] text-[#fce4ca] font-bold border border-[#bd9661] shadow-sm ring-1 ring-[#bd9661]'
                              : 'bg-[#faf7f2] border border-[#e2d8c9] hover:bg-white hover:border-[#bd9661] text-[#2c221a]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded border border-[#d0c4b2] bg-white text-[#5c4632] flex items-center justify-center text-xs font-bold">
                              {shape.id === 'arch-dome' ? '⌒' : shape.id === 'classic-rounded' ? '▢' : shape.id === 'cameo-oval' ? '⬯' : '▭'}
                            </span>
                            <span>{shape.name}</span>
                          </div>
                          <span className="text-[9px] opacity-70 truncate max-w-[100px]">{shape.desc.slice(0, 16)}...</span>
                        </button>
                      ))}
                    </div>
                  </div>'''

new_shape_block = '''                  {/* 1. Card Silhouette Shape (Compact Luxury Dropdown) */}
                  <div className="relative">
                    <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5 flex items-center justify-between">
                      <span>Card Silhouette Shape</span>
                      <span className="text-[9px] font-mono font-bold text-[#15110e] bg-[#f0eae1] px-1.5 py-0.5 rounded">{activeShapeObj.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsShapeDropdownOpen(!isShapeDropdownOpen);
                        setIsMotionDropdownOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] text-[#2c221a] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg border border-[#bd9661]/40 bg-[#fbf8f2] text-[#15110e] flex items-center justify-center text-xs font-bold shrink-0">
                          {cardShape === 'arch-dome' ? '⌒' : cardShape === 'classic-rounded' ? '▢' : cardShape === 'cameo-oval' ? '⬯' : '▭'}
                        </span>
                        <div className="text-left">
                          <div className="text-xs font-bold text-[#15110e]">{activeShapeObj.name}</div>
                          <div className="text-[10px] text-[#8b7b6b] truncate max-w-[170px]">{activeShapeObj.desc}</div>
                        </div>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 text-[#8c6b3e] transition-transform ${isShapeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isShapeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#fefdfb] border border-[#dfd4c5] rounded-xl shadow-xl overflow-hidden p-1.5 space-y-1 animate-fadeIn">
                        {CARD_SHAPES.map((shape) => (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => {
                              setCardShape(shape.id);
                              setIsShapeDropdownOpen(false);
                            }}
                            className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              cardShape === shape.id
                                ? 'bg-[#15110e] text-[#fce4ca] font-bold border border-[#bd9661] shadow-2xs'
                                : 'hover:bg-[#faf7f2] text-[#2c221a]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded border border-[#d0c4b2] bg-white text-[#5c4632] flex items-center justify-center text-xs font-bold shrink-0">
                                {shape.id === 'arch-dome' ? '⌒' : shape.id === 'classic-rounded' ? '▢' : shape.id === 'cameo-oval' ? '⬯' : '▭'}
                              </span>
                              <div>
                                <div className="font-semibold">{shape.name}</div>
                                <div className="text-[10px] opacity-75 leading-tight">{shape.desc}</div>
                              </div>
                            </div>
                            {cardShape === shape.id && <span className="text-[#bd9661] text-xs">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>'''

code = code.replace(old_shape_block, new_shape_block)

# 9. Convert Predefined 3D Motion to Dropdown
old_motion_block = '''                  {/* 5. Predefined 3D Unboxing Motion */}
                  <div className="pt-3 border-t border-[#ede5d8]">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-2">
                      <span>Predefined 3D Motion</span>
                      <span className="text-[9px] text-[#8b7b6b]">Predefined Only</span>
                    </div>
                    <div className="space-y-1.5">
                      {PREDEFINED_ANIMATIONS.map((anim) => (
                        <div
                          key={anim.id}
                          onClick={() => {
                            setAnimationType(anim.name);
                            handlePlayAnimation();
                          }}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            animationType === anim.name
                              ? 'bg-[#15110e] border border-[#bd9661] text-[#fce4ca] font-bold shadow-xs ring-1 ring-[#bd9661]'
                              : 'bg-[#faf7f2] border border-[#e2d8c9] hover:bg-white hover:border-[#bd9661] text-[#2c221a]'
                          }`}
                        >
                          <span className="text-base">{anim.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{anim.name}</div>
                            <div className="text-[10px] text-[#8b7b6b] font-normal leading-tight mt-0.5">
                              {anim.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-2">'''

new_motion_block = '''                  {/* 5. Predefined 3D Unboxing Motion (Compact Luxury Dropdown) */}
                  <div className="pt-3 border-t border-[#ede5d8] relative">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                      <span>Predefined 3D Motion</span>
                      <span className="text-[9px] text-[#8b7b6b]">Predefined Only</span>
                    </div>

                    {/* Motion Dropdown Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMotionDropdownOpen(!isMotionDropdownOpen);
                        setIsShapeDropdownOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] text-[#2c221a] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base shrink-0">
                          {PREDEFINED_ANIMATIONS.find((a) => a.name === animationType)?.icon || '✉'}
                        </span>
                        <div className="text-left truncate">
                          <div className="text-xs font-bold text-[#15110e] truncate">{animationType}</div>
                          <div className="text-[10px] text-[#8b7b6b] truncate">
                            {PREDEFINED_ANIMATIONS.find((a) => a.name === animationType)?.desc.slice(0, 32)}...
                          </div>
                        </div>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 text-[#8c6b3e] shrink-0 transition-transform ${isMotionDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Motion Dropdown Menu */}
                    {isMotionDropdownOpen && (
                      <div className="absolute bottom-full mb-1 left-0 right-0 z-30 bg-[#fefdfb] border border-[#dfd4c5] rounded-xl shadow-xl overflow-hidden p-1.5 space-y-1 animate-fadeIn">
                        {PREDEFINED_ANIMATIONS.map((anim) => (
                          <button
                            key={anim.id}
                            type="button"
                            onClick={() => {
                              setAnimationType(anim.name);
                              setIsMotionDropdownOpen(false);
                              handlePlayAnimation();
                            }}
                            className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                              animationType === anim.name
                                ? 'bg-[#15110e] text-[#fce4ca] font-bold border border-[#bd9661] shadow-2xs'
                                : 'hover:bg-[#faf7f2] text-[#2c221a]'
                            }`}
                          >
                            <span className="text-base shrink-0 mt-0.5">{anim.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs truncate">{anim.name}</div>
                              <div className="text-[10px] opacity-75 leading-tight line-clamp-1">{anim.desc}</div>
                            </div>
                            {animationType === anim.name && <span className="text-[#bd9661] text-xs shrink-0 self-center">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-2">'''

code = code.replace(old_motion_block, new_motion_block)

# 10. Replace Font Family Buttons with MS Word-style Searchable Font Dropdown
old_font_buttons = '''                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                    Font Family
                                  </label>
                                  <div className="grid grid-cols-3 gap-1 text-[11px] font-medium">
                                    {[
                                      { id: 'serif', label: 'Serif' },
                                      { id: 'script', label: 'Script' },
                                      { id: 'sans', label: 'Sans' },
                                    ].map((f) => (
                                      <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => {
                                          setElements((prev) =>
                                            prev.map((el) => (el.id === selectedElement.id ? { ...el, fontFamily: f.id as any } : el))
                                          );
                                        }}
                                        className={`py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                          selectedElement.fontFamily === f.id
                                            ? 'bg-[#15110e] text-[#fce4ca] border-[#bd9661] font-bold shadow-xs'
                                            : 'bg-[#faf7f2] border-[#e0d6c7] text-[#2c221a] hover:bg-white'
                                        }`}
                                      >
                                        {f.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>'''

new_font_dropdown = '''                                {/* Font Family: MS Word / Google Docs Searchable Dropdown */}
                                <div className="relative">
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                                      Font Family
                                    </label>
                                    <span className="text-[9px] font-mono font-bold text-[#8c6b3e] bg-[#f0eae1] px-1.5 py-0.5 rounded">
                                      {selectedElement.fontFamily || 'Playfair Display'}
                                    </span>
                                  </div>

                                  {/* Dropdown Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                                    className="w-full p-2 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] text-[#2c221a] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <span className="text-xs font-serif font-bold text-[#8c6b3e] px-1.5 py-0.5 rounded bg-[#f0eae1] shrink-0">
                                        Aa
                                      </span>
                                      <div className="text-left truncate">
                                        <div className="text-xs font-bold text-[#15110e] truncate">
                                          {selectedElement.fontFamily || 'Playfair Display'}
                                        </div>
                                        <div
                                          className="text-[11px] text-[#8b7b6b] truncate"
                                          style={{ fontFamily: getFontFamilyCss(selectedElement.fontFamily) }}
                                        >
                                          {selectedElement.content?.slice(0, 24) || 'Sample Typography'}
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronDownIcon className={`w-3.5 h-3.5 text-[#8c6b3e] shrink-0 transition-transform ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
                                  </button>

                                  {/* Dropdown Menu with Search and Live Previews */}
                                  {isFontDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-[#fefdfb] border border-[#dfd4c5] rounded-xl shadow-2xl overflow-hidden p-2 space-y-2 animate-fadeIn max-h-[250px] flex flex-col">
                                      {/* Search Input Box */}
                                      <div className="relative shrink-0">
                                        <input
                                          type="text"
                                          value={fontSearchQuery}
                                          onChange={(e) => setFontSearchQuery(e.target.value)}
                                          placeholder="Search wedding fonts..."
                                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#faf7f2] border border-[#d5c7b5] focus:outline-none focus:border-[#bd9661] text-[#15110e] placeholder:text-[#a09080]"
                                          autoFocus
                                        />
                                        {fontSearchQuery && (
                                          <button
                                            type="button"
                                            onClick={() => setFontSearchQuery('')}
                                            className="absolute right-2 top-1.5 text-xs text-[#a09080] hover:text-[#15110e]"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>

                                      {/* Font Options List */}
                                      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
                                        {WEDDING_FONTS.filter((f) =>
                                          f.name.toLowerCase().includes(fontSearchQuery.toLowerCase()) ||
                                          f.category.toLowerCase().includes(fontSearchQuery.toLowerCase())
                                        ).map((f) => {
                                          const isSelected =
                                            selectedElement.fontFamily === f.name ||
                                            (selectedElement.fontFamily === 'serif' && f.name === 'Playfair Display') ||
                                            (selectedElement.fontFamily === 'script' && f.name === 'Pinyon Script') ||
                                            (selectedElement.fontFamily === 'sans' && f.name === 'DM Sans');
                                          return (
                                            <button
                                              key={f.name}
                                              type="button"
                                              onClick={() => {
                                                setElements((prev) =>
                                                  prev.map((el) =>
                                                    el.id === selectedElement.id ? { ...el, fontFamily: f.name } : el
                                                  )
                                                );
                                                setIsFontDropdownOpen(false);
                                              }}
                                              className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer ${
                                                isSelected
                                                  ? 'bg-[#15110e] text-[#fce4ca] font-bold border border-[#bd9661] shadow-2xs'
                                                  : 'hover:bg-[#faf7f2] text-[#2c221a]'
                                              }`}
                                            >
                                              <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-xs font-semibold">{f.name}</span>
                                                  <span className="text-[9px] px-1 rounded bg-[#f0eae1] text-[#8c6b3e] font-sans">
                                                    {f.category}
                                                  </span>
                                                </div>
                                                <div
                                                  className="text-sm truncate mt-0.5"
                                                  style={{
                                                    fontFamily: f.family,
                                                    color: isSelected ? '#fce4ca' : '#5c4632',
                                                  }}
                                                >
                                                  {f.sample}
                                                </div>
                                              </div>
                                              {isSelected && <span className="text-[#bd9661] text-xs font-bold ml-2">✓</span>}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>'''

code = code.replace(old_font_buttons, new_font_dropdown)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("SuperAdminCardStudio.tsx updated successfully!")
