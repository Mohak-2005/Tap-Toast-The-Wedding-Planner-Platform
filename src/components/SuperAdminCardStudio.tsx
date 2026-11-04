import { ColorPicker2D } from './ColorPicker2D';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { showToast } from '../lib/state';

// =============================================================================
// PROFESSIONAL LUXURY SVG ICONS (REPLACING GENERIC EMOJIS)
// =============================================================================
const EnvelopeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SparkleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
  </svg>
);

const PaletteIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.438 6.5 17.5 2 12 2z" />
  </svg>
);

const FlowerIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m4.5 0a4.5 4.5 0 1 1-4.5 4.5M16.5 12H12m-4.5 0a4.5 4.5 0 1 0 4.5 4.5M7.5 12H12m0 4.5V12" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const LeafIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const DecorIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TypographyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const InspectorIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const GridIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlayIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const UploadCloudIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const SearchDocIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DuplicateIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);


export interface CanvasElement {
  id: string;
  type: 'text' | 'flower' | 'leaf' | 'graphic' | 'seal' | 'divider' | 'qrcode';
  content: string;
  x: number; // Percentage 0 - 100
  y: number; // Percentage 0 - 100
  fontSize?: number;
  fontFamily?: string;
  color?: string; // Text color or Stroke/Foil color
  fillColor?: string; // Petal/leaf inner fill color
  textAlign?: 'left' | 'center' | 'right';
  rotation?: number; // -180 to 180 degrees
  scale?: number; // 0.4 to 2.5
  scaleX?: number; // Horizontal scale
  scaleY?: number; // Vertical scale
  opacity?: number; // 0.1 to 1.0
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  zIndex?: number;
  isBold?: boolean;
  isItalic?: boolean;
  letterSpacing?: string;
  shimmer?: 'none' | 'gold-glitter' | 'diamond' | 'fairy-dust';
}


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

export interface CustomCardTemplate {
  id: string;
  name: string;
  category: 'Botanical' | 'Midnight' | 'Coastal' | 'Vineyard' | 'Architectural' | 'Modern' | 'Native Floral';
  animationType: string;
  sourceType: 'designer' | 'uploaded_file';
  baseColor: string;
  foilColor: string;
  envelopeColor: string;
  showEnvelopeBackdrop?: boolean;
  cardShape: 'classic-rounded' | 'arch-dome' | 'sharp-regal' | 'scallop-ornate' | 'cameo-oval';
  cardShimmer?: 'none' | 'gold-dust' | 'diamond-sparkle' | 'champagne-sheen';
  backgroundImage?: string | null;
  backgroundPosX?: number;
  backgroundPosY?: number;
  backgroundScale?: number;
  backgroundOpacity?: number;
  elements: CanvasElement[];
  fileName?: string;
  fileSize?: string;
  duration: string;
  active: boolean;
  createdAt: string;
}

// =============================================================================
// VECTOR ARTWORK ASSETS (FLOWERS, LEAVES, DECOR, DIVIDERS)
// Supports strokeColor (outline/foil) AND fillColor (petals/interior body)
// =============================================================================
const SVG_ASSETS: Record<
  string,
  {
    name: string;
    category: 'flower' | 'leaf' | 'decor';
    render: (strokeColor: string, fillColor?: string) => React.ReactNode;
  }
> = {
  // Flowers
  'corner-botanical': {
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
  'magnolia-bloom': {
    name: 'Magnolia Bloom',
    category: 'flower',
    render: (stroke, fill = '#ffffff') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M50 20 C35 30 25 50 35 70 C45 80 55 80 65 70 C75 50 65 30 50 20 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M50 25 C40 38 35 55 45 68 C52 74 58 74 65 65" fill={fill} fillOpacity="0.85" stroke={stroke} strokeWidth="1.2" />
        <path d="M25 45 C15 55 20 70 35 75 C30 65 30 55 25 45 Z" fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.2" />
        <path d="M75 45 C85 55 80 70 65 75 C70 65 70 55 75 45 Z" fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.2" />
        <circle cx="50" cy="55" r="4.5" fill={stroke} />
        <circle cx="48" cy="53" r="1.5" fill="#ffffff" />
      </svg>
    ),
  },
  'protea-rose': {
    name: 'King Protea',
    category: 'flower',
    render: (stroke, fill = '#fff5f5') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M50 15 L58 45 L50 78 L42 45 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M35 25 L48 48 L42 78 L28 48 Z" fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.2" />
        <path d="M65 25 L72 48 L58 78 L52 48 Z" fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.2" />
        <path d="M22 38 L38 52 L35 76 L18 55 Z" fill={fill} fillOpacity="0.85" stroke={stroke} strokeWidth="1.2" />
        <path d="M78 38 L82 55 L65 76 L62 52 Z" fill={fill} fillOpacity="0.85" stroke={stroke} strokeWidth="1.2" />
        <path d="M47 78 L50 95 L53 78 Z" fill={stroke} />
      </svg>
    ),
  },
  'golden-rose': {
    name: 'Gilded Rose',
    category: 'flower',
    render: (stroke, fill = 'rgba(189,150,97,0.2)') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round">
        <circle cx="50" cy="50" r="28" fill={fill} stroke="none" />
        <circle cx="50" cy="50" r="8" fill={stroke} fillOpacity="0.25" />
        <path d="M46 45 C48 40 55 40 57 46 C58 52 52 57 46 54" />
        <path d="M42 42 C38 48 42 58 50 60 C58 62 64 54 62 46 C60 38 48 35 40 40" />
        <path d="M36 45 C32 55 38 68 50 70 C64 72 72 60 70 48 C68 34 52 30 38 36" />
      </svg>
    ),
  },
  'cherry-blossom': {
    name: 'Cherry Blossom',
    category: 'flower',
    render: (stroke, fill = '#fff8fa') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <path
            key={i}
            d="M50 50 C45 35 38 20 50 12 C62 20 55 35 50 50 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.3"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="5" fill={stroke} />
        <circle cx="50" cy="50" r="2" fill="#ffffff" />
      </svg>
    ),
  },
  'peony-bloom': {
    name: 'Royal Peony',
    category: 'flower',
    render: (stroke, fill = '#fcf5f7') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <circle cx="50" cy="50" r="30" fill={fill} stroke={stroke} strokeWidth="1.4" />
        <path d="M30 45 C35 30 65 30 70 45 C75 60 65 72 50 74 C35 72 25 60 30 45 Z" fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.2" />
        <path d="M40 48 C43 38 57 38 60 48 C62 58 55 64 50 65 C45 64 38 58 40 48 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <circle cx="50" cy="50" r="3" fill={stroke} />
      </svg>
    ),
  },

  // Leaves
  'eucalyptus-sprig': {
    name: 'Eucalyptus',
    category: 'leaf',
    render: (stroke, fill = '#f4f8f4') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M50 90 Q48 50 50 10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="30" r="11" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <circle cx="62" cy="42" r="12" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <circle cx="38" cy="56" r="13" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <circle cx="64" cy="68" r="14" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <circle cx="50" cy="18" r="9" fill={fill} stroke={stroke} strokeWidth="1.3" />
      </svg>
    ),
  },
  'olive-branch': {
    name: 'Olive Branch',
    category: 'leaf',
    render: (stroke, fill = '#f6f9f5') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M20 85 Q50 60 85 20" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="40" cy="55" rx="14" ry="5" transform="rotate(-35 40 55)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <ellipse cx="62" cy="38" rx="14" ry="5" transform="rotate(-35 62 38)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <ellipse cx="50" cy="68" rx="13" ry="5" transform="rotate(25 50 68)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <ellipse cx="72" cy="48" rx="13" ry="5" transform="rotate(25 72 48)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <circle cx="48" cy="50" r="3.5" fill={stroke} />
      </svg>
    ),
  },
  'fern-frond': {
    name: 'Woodland Fern',
    category: 'leaf',
    render: (stroke, fill = '#eef5ee') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M50 95 Q48 50 50 8" stroke={stroke} strokeWidth="1.5" />
        {[20, 32, 44, 56, 68, 80].map((y, i) => (
          <g key={i}>
            <path d={`M50 ${y} Q30 ${y - 8} 25 ${y - 4} Q35 ${y} 50 ${y}`} fill={fill} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
            <path d={`M50 ${y + 4} Q70 ${y - 4} 75 ${y} Q65 ${y + 4} 50 ${y + 4}`} fill={fill} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    ),
  },
  'grape-vine': {
    name: 'Vineyard Grapes',
    category: 'leaf',
    render: (stroke, fill = '#f3edf8') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M25 25 Q50 15 75 25 Q60 40 50 45" stroke={stroke} strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="50" r="5" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <circle cx="43" cy="58" r="5" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <circle cx="57" cy="58" r="5" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <circle cx="50" cy="66" r="5" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <circle cx="50" cy="74" r="4" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <path d="M30 30 Q15 20 25 10 Q40 15 30 30 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <path d="M70 30 Q85 20 75 10 Q60 15 70 30 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
      </svg>
    ),
  },

  // Decor & Accents
  'celestial-stars': {
    name: 'Celestial Stars',
    category: 'decor',
    render: (stroke, fill) => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill={fill || stroke}>
        <path d="M50 15 Q50 45 20 50 Q50 50 50 85 Q50 50 80 50 Q50 45 50 15 Z" stroke={stroke} strokeWidth="0.8" />
        <circle cx="25" cy="25" r="2.5" />
        <circle cx="75" cy="75" r="2.5" />
        <path d="M75 25 Q75 35 65 38 Q75 38 75 48 Q75 38 85 38 Q75 35 75 25 Z" opacity="0.8" />
      </svg>
    ),
  },
  'fairy-lights': {
    name: 'Fairy Light Garland',
    category: 'decor',
    render: (stroke, fill = '#fef08a') => (
      <svg viewBox="0 0 200 40" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M0 10 Q50 25 100 12 Q150 25 200 10" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" />
        {[20, 50, 80, 115, 150, 180].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={16 + (i % 2) * 4} r="4" fill={fill} stroke={stroke} strokeWidth="1" />
            <circle cx={cx} cy={16 + (i % 2) * 4} r="7" fill={fill} fillOpacity="0.25" />
          </g>
        ))}
      </svg>
    ),
  },
  'wax-seal': {
    name: 'Wax Seal Stamp',
    category: 'decor',
    render: (stroke, fill) => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="42" fill={fill || stroke} fillOpacity="0.95" stroke="#ffffff" strokeWidth="2" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="4 2" />
        <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontFamily="serif" fontSize="13" fontWeight="bold">
          S • D
        </text>
      </svg>
    ),
  },
  'flourish-divider': {
    name: 'Flourish Divider Line',
    category: 'decor',
    render: (stroke, fill) => (
      <svg viewBox="0 0 200 20" className="w-full h-full" fill="none">
        <line x1="20" y1="10" x2="85" y2="10" stroke={stroke} strokeWidth="1" />
        <circle cx="100" cy="10" r="3" fill={fill || stroke} stroke={stroke} />
        <path d="M96 10 L100 6 L104 10 L100 14 Z" fill={fill || stroke} />
        <line x1="115" y1="10" x2="180" y2="10" stroke={stroke} strokeWidth="1" />
      </svg>
    ),
  },
  'qrcode-rsvp': {
    name: 'QR Code RSVP Badge',
    category: 'decor',
    render: (stroke, fill = '#ffffff') => (
      <div className="w-full h-full rounded-lg p-2 border flex flex-col items-center justify-center shadow-xs" style={{ borderColor: stroke, backgroundColor: fill }}>
        <svg viewBox="0 0 100 100" className="w-16 h-16" fill="#15110e">
          <rect x="10" y="10" width="25" height="25" fill="none" stroke="#15110e" strokeWidth="5" />
          <rect x="17" y="17" width="11" height="11" fill="#15110e" />
          <rect x="65" y="10" width="25" height="25" fill="none" stroke="#15110e" strokeWidth="5" />
          <rect x="72" y="17" width="11" height="11" fill="#15110e" />
          <rect x="10" y="65" width="25" height="25" fill="none" stroke="#15110e" strokeWidth="5" />
          <rect x="17" y="72" width="11" height="11" fill="#15110e" />
          <rect x="45" y="15" width="8" height="8" />
          <rect x="45" y="30" width="8" height="8" />
          <rect x="45" y="45" width="8" height="8" />
          <rect x="65" y="45" width="8" height="8" />
          <rect x="55" y="65" width="8" height="8" />
          <rect x="70" y="65" width="8" height="8" />
          <rect x="80" y="80" width="8" height="8" />
        </svg>
        <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 text-[#5a483a]">Scan to RSVP</span>
      </div>
    ),
  },
  'white-orchid': {
    name: 'White Orchid',
    category: 'flower',
    render: (stroke, fill = '#ffffff') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <ellipse cx="50" cy="30" rx="14" ry="18" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <ellipse cx="32" cy="52" rx="16" ry="12" transform="rotate(-25 32 52)" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <ellipse cx="68" cy="52" rx="16" ry="12" transform="rotate(25 68 52)" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <path d="M42 62 C40 75 60 75 58 62 C62 55 38 55 42 62 Z" fill={fill} fillOpacity="0.9" stroke={stroke} strokeWidth="1.4" />
        <circle cx="50" cy="52" r="3.5" fill={stroke} />
      </svg>
    ),
  },
  'wild-jasmine': {
    name: 'Wild Jasmine',
    category: 'flower',
    render: (stroke, fill = '#fffef8') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <path
            key={i}
            d="M50 50 C44 38 42 22 50 14 C58 22 56 38 50 50 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="4" fill={stroke} />
        <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
      </svg>
    ),
  },
  'tuscan-laurel': {
    name: 'Tuscan Laurel',
    category: 'leaf',
    render: (stroke, fill = '#eef5ee') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M50 85 C30 85 20 60 25 30 C27 20 35 15 35 15" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="25" cy="35" rx="8" ry="4" transform="rotate(-30 25 35)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <ellipse cx="22" cy="50" rx="9" ry="4" transform="rotate(-15 22 50)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <ellipse cx="28" cy="65" rx="9" ry="4" transform="rotate(15 28 65)" fill={fill} stroke={stroke} strokeWidth="1.2" />
        <ellipse cx="38" cy="78" rx="8" ry="4" transform="rotate(35 38 78)" fill={fill} stroke={stroke} strokeWidth="1.2" />
      </svg>
    ),
  },
  'golden-monstera': {
    name: 'Golden Monstera',
    category: 'leaf',
    render: (stroke, fill = '#f2f8f2') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <path d="M50 90 Q48 50 50 15" stroke={stroke} strokeWidth="1.6" />
        <path d="M50 15 C30 20 18 45 22 75 C25 85 45 88 50 90 C55 88 75 85 78 75 C82 45 70 20 50 15 Z" fill={fill} stroke={stroke} strokeWidth="1.3" />
        <line x1="50" y1="35" x2="30" y2="30" stroke={stroke} strokeWidth="1.2" />
        <line x1="50" y1="50" x2="26" y2="48" stroke={stroke} strokeWidth="1.2" />
        <line x1="50" y1="65" x2="32" y2="68" stroke={stroke} strokeWidth="1.2" />
        <line x1="50" y1="35" x2="70" y2="30" stroke={stroke} strokeWidth="1.2" />
        <line x1="50" y1="50" x2="74" y2="48" stroke={stroke} strokeWidth="1.2" />
        <line x1="50" y1="65" x2="68" y2="68" stroke={stroke} strokeWidth="1.2" />
      </svg>
    ),
  },
  'ribbon-bow': {
    name: 'Velvet Ribbon Bow',
    category: 'decor',
    render: (stroke, fill = '#bd9661') => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
        <circle cx="50" cy="50" r="7" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <path d="M50 50 C35 30 15 35 22 55 C26 65 45 55 50 50 Z" fill={fill} fillOpacity="0.85" stroke={stroke} strokeWidth="1.3" />
        <path d="M50 50 C65 30 85 35 78 55 C74 65 55 55 50 50 Z" fill={fill} fillOpacity="0.85" stroke={stroke} strokeWidth="1.3" />
        <path d="M47 55 Q35 75 30 90" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M53 55 Q65 75 70 90" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
};

// =============================================================================
// CARD SHAPES
// =============================================================================
const CARD_SHAPES: { id: CustomCardTemplate['cardShape']; name: string; desc: string; roundedClass: string }[] = [
  { id: 'arch-dome', name: 'Arch Dome Top', desc: 'Architectural arched dome top with smooth curve', roundedClass: 'rounded-t-[190px] rounded-b-2xl' },
  { id: 'classic-rounded', name: 'Classic Rounded', desc: 'Timeless smooth luxury rounded corners', roundedClass: 'rounded-2xl' },
  { id: 'scallop-ornate', name: 'Scalloped Flap', desc: 'Ornate curved corners with double border outline', roundedClass: 'rounded-3xl border-double border-[3px]' },
  { id: 'sharp-regal', name: 'Sharp Regal Rectangle', desc: 'Formal high-society crisp rectangular styling', roundedClass: 'rounded-none' },
  { id: 'cameo-oval', name: 'Cameo Oval', desc: 'Romantic pill oval curved top and bottom', roundedClass: 'rounded-[190px]' },
];

// =============================================================================
// PREDEFINED ANIMATIONS (UNBOXING MOTIONS)
// =============================================================================
const PREDEFINED_ANIMATIONS = [
  { id: 'flap-pop', name: 'Classic Envelope Flap Pop', desc: 'Flap hinges open 180°, wax seal pops, and card elevates.', icon: '✉️' },
  { id: 'gatefold', name: 'French Gatefold Double Blossom', desc: 'Dual botanical doors swing outward revealing the card.', icon: '🌿' },
  { id: 'ribbon-slide', name: 'Velvet Ribbon Slide & Tilt', desc: 'Belly band slips downward with smooth 3D sleeve tilt.', icon: '🌹' },
  { id: 'pocketfold', name: 'Pocketfold Elevation & Twinkle', desc: 'Pocketfold lower anchor with glowing fairy canopy lights.', icon: '✨' },
  { id: 'arch-snap', name: 'Architectural Arch Kinetic Snap', desc: 'Dome arch snaps open with elastic cubic-bezier easing.', icon: '✦' },
  { id: 'letterpress-float', name: 'Letterpress Float & Metallic Sheen', desc: 'Card floats forward with reflective metallic foil sheen.', icon: '⭐' },
];

// =============================================================================
// DESIGN BOX ITEMS (FLOWERS, LEAVES, DECOR, TEXT)
// =============================================================================
const DESIGN_BOX_ITEMS: {
  id: string;
  type: CanvasElement['type'];
  content: string;
  name: string;
  category: 'flower' | 'leaf' | 'decor' | 'text';
  fillColor?: string;
  fontSize?: number;
  fontFamily?: CanvasElement['fontFamily'];
  isBold?: boolean;
  isItalic?: boolean;
  letterSpacing?: string;
  shimmer?: CanvasElement['shimmer'];
}[] = [
  // Image 4 Corner Blossom
  { id: 'item-corner-blossom', type: 'flower', content: 'corner-botanical', name: 'Corner Blossom', category: 'flower', fillColor: '#ffffff' },
  // Flowers
  { id: 'item-flw-1', type: 'flower', content: 'magnolia-bloom', name: 'Magnolia Bloom', category: 'flower', fillColor: '#ffffff' },
  { id: 'item-flw-2', type: 'flower', content: 'protea-rose', name: 'King Protea', category: 'flower', fillColor: '#fff5f5' },
  { id: 'item-flw-3', type: 'flower', content: 'golden-rose', name: 'Gilded Rose', category: 'flower', fillColor: 'rgba(189,150,97,0.25)' },
  { id: 'item-flw-4', type: 'flower', content: 'cherry-blossom', name: 'Cherry Blossom', category: 'flower', fillColor: '#fff8fa' },
  { id: 'item-flw-5', type: 'flower', content: 'peony-bloom', name: 'Royal Peony', category: 'flower', fillColor: '#fcf5f7' },
  { id: 'item-flw-6', type: 'flower', content: 'white-orchid', name: 'White Orchid', category: 'flower', fillColor: '#ffffff' },
  { id: 'item-flw-7', type: 'flower', content: 'wild-jasmine', name: 'Wild Jasmine', category: 'flower', fillColor: '#fffef8' },

  // Leaves
  { id: 'item-leaf-1', type: 'leaf', content: 'eucalyptus-sprig', name: 'Eucalyptus Sprig', category: 'leaf', fillColor: '#f4f8f4' },
  { id: 'item-leaf-2', type: 'leaf', content: 'olive-branch', name: 'Olive Branch', category: 'leaf', fillColor: '#f6f9f5' },
  { id: 'item-leaf-3', type: 'leaf', content: 'fern-frond', name: 'Woodland Fern', category: 'leaf', fillColor: '#eef5ee' },
  { id: 'item-leaf-4', type: 'leaf', content: 'grape-vine', name: 'Vineyard Grapes', category: 'leaf', fillColor: '#f3edf8' },
  { id: 'item-leaf-5', type: 'leaf', content: 'golden-monstera', name: 'Golden Monstera', category: 'leaf', fillColor: '#f2f8f2' },
  { id: 'item-leaf-6', type: 'leaf', content: 'tuscan-laurel', name: 'Tuscan Laurel', category: 'leaf', fillColor: '#eef5ee' },

  // Decor & Seals
  { id: 'item-dec-1', type: 'seal', content: 'wax-seal', name: 'Wax Seal Stamp', category: 'decor', fillColor: '#bd9661' },
  { id: 'item-dec-2', type: 'divider', content: 'flourish-divider', name: 'Flourish Divider Line', category: 'decor', fillColor: '#bd9661' },
  { id: 'item-dec-3', type: 'graphic', content: 'celestial-stars', name: 'Celestial Stars', category: 'decor', fillColor: '#bd9661' },
  { id: 'item-dec-4', type: 'graphic', content: 'fairy-lights', name: 'Fairy Light Garland', category: 'decor', fillColor: '#fef08a' },
  { id: 'item-dec-5', type: 'qrcode', content: 'qrcode-rsvp', name: 'RSVP QR Badge', category: 'decor', fillColor: '#ffffff' },
  { id: 'item-dec-6', type: 'graphic', content: 'ribbon-bow', name: 'Velvet Ribbon Bow', category: 'decor', fillColor: '#bd9661' },

  // Typography Elements
  { id: 'item-txt-1', type: 'text', content: 'Sophie & Daniel', name: 'Couple Name Script', category: 'text', fontSize: 26, fontFamily: 'script', isItalic: true },
  { id: 'item-txt-2', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', name: 'Formal Serif Header', category: 'text', fontSize: 10, fontFamily: 'serif', isBold: true, letterSpacing: '2px' },
  { id: 'item-txt-3', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', name: 'Event Date & Time', category: 'text', fontSize: 11, fontFamily: 'sans', isBold: true, letterSpacing: '1px' },
  { id: 'item-txt-4', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY', name: 'Venue Location Line', category: 'text', fontSize: 9, fontFamily: 'sans', letterSpacing: '1px' },
];

// =============================================================================
// INITIAL BUILT-IN TEMPLATES
// =============================================================================
const INITIAL_TEMPLATES: CustomCardTemplate[] = [
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
      { id: 'mg-flw-top', type: 'flower', content: 'magnolia-bloom', x: 18, y: 12, scale: 1.1, rotation: -20, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-top', type: 'leaf', content: 'eucalyptus-sprig', x: 28, y: 10, scale: 0.95, rotation: -45, color: '#44614d', fillColor: '#f2f7f3' },
      { id: 'mg-txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 16, fontSize: 9.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#c59a58' },
      { id: 'mg-txt-2', type: 'text', content: 'Sophie Taylor', x: 50, y: 25, fontSize: 26, fontFamily: 'Playfair Display', isItalic: true, color: '#966d29' },
      { id: 'mg-txt-and', type: 'text', content: 'AND', x: 50, y: 31, fontSize: 8.5, fontFamily: 'Cinzel', letterSpacing: '3px', color: '#665747' },
      { id: 'mg-txt-3', type: 'text', content: 'Daniel Carter', x: 50, y: 38, fontSize: 26, fontFamily: 'Playfair Display', isItalic: true, color: '#966d29' },
      { id: 'mg-txt-4', type: 'text', content: 'INVITE YOU TO CELEBRATE THEIR WEDDING', x: 50, y: 46, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '1.5px', color: '#665747' },
      { id: 'mg-txt-5', type: 'text', content: 'SATURDAY   |   14   |   NOVEMBER 2026', x: 50, y: 53, fontSize: 10.5, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1px', color: '#966d29' },
      { id: 'mg-txt-6', type: 'text', content: 'AT 4:00 PM', x: 50, y: 59, fontSize: 8.5, fontFamily: 'Cinzel', letterSpacing: '1px', color: '#665747' },
      { id: 'mg-txt-7', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY, NSW', x: 50, y: 66, fontSize: 9, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1.2px', color: '#1c150c' },
      { id: 'mg-div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 73, scale: 0.85, color: '#c59a58' },
      { id: 'mg-seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 83, scale: 0.95, color: '#c59a58', fillColor: '#c59a58' },
      { id: 'mg-txt-8', type: 'text', content: 'DINNER & DANCING TO FOLLOW', x: 50, y: 93, fontSize: 7.5, fontFamily: 'Cinzel', letterSpacing: '1.5px', color: '#665747' },
      { id: 'mg-flw-bot', type: 'flower', content: 'magnolia-bloom', x: 82, y: 88, scale: 1.05, rotation: 160, color: '#c59a58', fillColor: '#ffffff' },
      { id: 'mg-leaf-bot', type: 'leaf', content: 'eucalyptus-sprig', x: 74, y: 90, scale: 0.9, rotation: 135, color: '#44614d', fillColor: '#f2f7f3' },
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
      { id: 'nw-txt-5', type: 'text', content: 'AT FIVE O\'CLOCK IN THE EVENING', x: 50, y: 55, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#487252' },
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
      { id: 'mp-txt-5', type: 'text', content: 'AT SIX O\'CLOCK IN THE EVENING', x: 50, y: 56, fontSize: 8.5, fontFamily: 'Cormorant Garamond', letterSpacing: '1px', color: '#d1b8c2' },
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
      { id: 'ch-lights', type: 'graphic', content: 'fairy-lights', x: 50, y: 7, scale: 1.15, color: '#d6b87d', fillColor: '#fae392' },
      { id: 'ch-star-l', type: 'graphic', content: 'celestial-stars', x: 19, y: 13, scale: 0.7, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-star-r', type: 'graphic', content: 'celestial-stars', x: 81, y: 13, scale: 0.7, color: '#fae392', fillColor: '#fae392' },
      { id: 'ch-txt-1', type: 'text', content: "YOU'RE INVITED TO THE WEDDING OF", x: 50, y: 17, fontSize: 8.5, fontFamily: 'Cinzel', letterSpacing: '2.5px', isBold: true, color: '#fae392' },
      { id: 'ch-txt-2', type: 'text', content: 'Olivia & James', x: 50, y: 28, fontSize: 32, fontFamily: 'Great Vibes', isItalic: true, color: '#ffffff' },
      { id: 'ch-txt-3', type: 'text', content: 'LOVE • FAMILY • CELEBRATION', x: 50, y: 37, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '3px', color: '#9ec1ee' },
      { id: 'ch-txt-4', type: 'text', content: 'SAT   |   28   |   NOV 2026', x: 50, y: 45, fontSize: 11, fontFamily: 'Cinzel', isBold: true, letterSpacing: '1.5px', color: '#fae392' },
      { id: 'ch-txt-5', type: 'text', content: 'WATSONS BAY BOUTIQUE HOTEL • SYDNEY, NSW', x: 50, y: 53, fontSize: 9, fontFamily: 'DM Sans', isBold: true, letterSpacing: '1px', color: '#ffffff' },
      { id: 'ch-qr', type: 'qrcode', content: 'qrcode-rsvp', x: 50, y: 69, scale: 1.05, color: '#fae392', fillColor: '#ffffff' },
      { id: 'ch-txt-6', type: 'text', content: 'DINNER, DRINKS & DANCING • SCAN TO RSVP', x: 50, y: 84, fontSize: 8, fontFamily: 'Cinzel', letterSpacing: '1.5px', isBold: true, color: '#fae392' },
      { id: 'ch-txt-7', type: 'text', content: 'Delivered with love to Priya Sharma', x: 50, y: 92, fontSize: 7.5, fontFamily: 'DM Sans', isItalic: true, color: '#9ec1ee' },
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

export interface SuperAdminCardStudioProps {
  mode?: 'superadmin' | 'couple';
  isComingSoon?: boolean;
}

export const SuperAdminCardStudio: React.FC<SuperAdminCardStudioProps> = ({
  mode = 'couple',
  isComingSoon = true,
}) => {
  // Modal State for full window design studio
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Prevent background scroll when studio modal is active
  useEffect(() => {
    if (isStudioOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isStudioOpen]);

  // Active Tool selection in the Whiteboard Top Bar
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'lock'>('select');

  // Dual Side Cards Collapse Toggles
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Card Shimmer / Glitter Effect
  const [cardShimmer, setCardShimmer] = useState<'none' | 'gold-dust' | 'diamond-sparkle' | 'champagne-sheen'>('none');

  // Right Card Tab Mode: 'design-box' or 'inspector'
  const [rightCardMode, setRightCardMode] = useState<'design-box' | 'inspector'>('design-box');

  // Design Box Category Filter
  const [designBoxCategory, setDesignBoxCategory] = useState<'all' | 'flower' | 'leaf' | 'decor' | 'text'>('all');

  // Upload Animation Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  // Grid Style (Dots, Fine Lines, Blank)
  const [gridStyle, setGridStyle] = useState<'dots' | 'lines' | 'blank'>('dots');
  const [activeColorPickerTab, setActiveColorPickerTab] = useState<'paper' | 'foil' | 'envelope' | null>(null);
  const [showEnvelopeBackdrop, setShowEnvelopeBackdrop] = useState(true);
  const [inspectorColorPicker, setInspectorColorPicker] = useState<'text' | 'petal' | 'stroke' | null>(null);

  // =========================================================================
  // DESIGNER CANVAS STATE
  // =========================================================================
  const [cardName, setCardName] = useState('Royal Heritage Gilded Noir');
  const [cardCategory, setCardCategory] = useState<CustomCardTemplate['category']>('Botanical');
  const [animationType, setAnimationType] = useState('Classic Envelope Flap Pop');
  const [cardShape, setCardShape] = useState<CustomCardTemplate['cardShape']>('arch-dome');
  const [baseColor, setBaseColor] = useState('#171921');
  const [foilColor, setFoilColor] = useState('#bd9661');
  const [envelopeColor, setEnvelopeColor] = useState('#15110e');
  const [elements, setElements] = useState<CanvasElement[]>(INITIAL_TEMPLATES[0].elements);

  // Background Photo Wallpaper State
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bgPosX, setBgPosX] = useState(50); // percentage 0 - 100
  const [bgPosY, setBgPosY] = useState(50); // percentage 0 - 100
  const [bgScale, setBgScale] = useState(1); // 1.0 to 2.5
  const [bgOpacity, setBgOpacity] = useState(1); // 0.3 to 1.0
  const [isRepositioningBg, setIsRepositioningBg] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);
  const bgDragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number } | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // Zoom scale state for whiteboard
  const [zoomLevel, setZoomLevel] = useState(100);

  // Selection & Drag State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ id: string; startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<CanvasElement[][]>([INITIAL_TEMPLATES[0].elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Animation Playback Preview State
  const [isPlayingMotion, setIsPlayingMotion] = useState(false);
  // Dropdown States for Word-style Font selector, Shape, and Motion
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontSearchQuery, setFontSearchQuery] = useState('');
  const [isShapeDropdownOpen, setIsShapeDropdownOpen] = useState(false);
  const [isMotionDropdownOpen, setIsMotionDropdownOpen] = useState(false);

  const [unboxingPhase, setUnboxingPhase] = useState<'closed' | 'opening' | 'opened'>('closed');

  // =========================================================================
  // CATALOG STATE
  // =========================================================================
  const [templates, setTemplates] = useState<CustomCardTemplate[]>(INITIAL_TEMPLATES);
  const [showAllThemes, setShowAllThemes] = useState(false);

  // Save to History for Undo / Redo
  const pushToHistory = (newElements: CanvasElement[]) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setElements(JSON.parse(JSON.stringify(history[prev])));
      setSelectedElementId(null);
      showToast('Undo performed', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setElements(JSON.parse(JSON.stringify(history[next])));
      setSelectedElementId(null);
      showToast('Redo performed', 'info');
    }
  };

  // Background Photo Wallpaper Handlers
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/)) {
      showToast('Please upload a valid JPG, PNG, or WEBP image', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) {
        setBackgroundImage(result);
        setBgPosX(50);
        setBgPosY(50);
        setBgScale(1);
        setBgOpacity(1);
        setIsRepositioningBg(true);
        showToast('Photo uploaded! Drag on the card to fit silhouette.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBgImage = () => {
    setBackgroundImage(null);
    setIsRepositioningBg(false);
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
    showToast('Background photo removed', 'info');
  };

  const handleBgPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingBg(true);
    bgDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: bgPosX,
      initialPosY: bgPosY,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleBgPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingBg || !bgDragStartRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = e.clientX - bgDragStartRef.current.startX;
    const deltaY = e.clientY - bgDragStartRef.current.startY;

    const deltaPercentX = (deltaX / rect.width) * 100;
    const deltaPercentY = (deltaY / rect.height) * 100;

    const newX = Math.round(bgDragStartRef.current.initialPosX + deltaPercentX);
    const newY = Math.round(bgDragStartRef.current.initialPosY + deltaPercentY);

    setBgPosX(Math.max(-50, Math.min(150, newX)));
    setBgPosY(Math.max(-50, Math.min(150, newY)));
  };

  const handleBgPointerUp = (e: React.PointerEvent) => {
    if (isDraggingBg) {
      setIsDraggingBg(false);
      bgDragStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleBgWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    setBgScale((prev) => Math.max(0.4, Math.min(3.0, parseFloat((prev + zoomDelta).toFixed(2)))));
  };

  // Close full window on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isUploadModalOpen) {
          setIsUploadModalOpen(false);
        } else if (isStudioOpen) {
          setIsStudioOpen(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          deleteSelectedElement();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStudioOpen, isUploadModalOpen, selectedElementId, historyIndex, history]);

  // Open Designer for an existing template
  const handleOpenDesignerFor = (tpl: CustomCardTemplate) => {
    setEditingTemplateId(tpl.id);
    setCardName(tpl.name);
    setCardCategory(tpl.category);
    setAnimationType(tpl.animationType);
    setCardShape(tpl.cardShape || 'classic-rounded');
    setCardShimmer(tpl.cardShimmer || 'gold-dust');
    setBaseColor(tpl.baseColor);
    setFoilColor(tpl.foilColor);
    setEnvelopeColor(tpl.envelopeColor);
    setShowEnvelopeBackdrop(tpl.showEnvelopeBackdrop ?? (tpl.id === 'botanical-classic'));
    setBackgroundImage(tpl.backgroundImage || null);
    setBgPosX(tpl.backgroundPosX ?? 50);
    setBgPosY(tpl.backgroundPosY ?? 50);
    setBgScale(tpl.backgroundScale ?? 1);
    setBgOpacity(tpl.backgroundOpacity ?? 1);
    setIsRepositioningBg(false);
    const initialEls = JSON.parse(JSON.stringify(tpl.elements));
    setElements(initialEls);
    setHistory([initialEls]);
    setHistoryIndex(0);
    setSelectedElementId(null);
    setRightCardMode('design-box');
    setIsStudioOpen(true);
  };

  // Open Designer for a new template
  const handleOpenNewDesign = () => {
    setEditingTemplateId(null);
    setCardName('Bespoke Royal Monogram');
    setCardCategory('Modern');
    setAnimationType('Classic Envelope Flap Pop');
    setCardShape('arch-dome');
    setCardShimmer('gold-dust');
    setBaseColor('#fdfbf7');
    setFoilColor('#bd9661');
    setEnvelopeColor('#15110e');
    setBackgroundImage(null);
    setBgPosX(50);
    setBgPosY(50);
    setBgScale(1);
    setBgOpacity(1);
    setIsRepositioningBg(false);
    const newEls: CanvasElement[] = [
      { id: 'txt-1', type: 'text', content: 'TOGETHER WITH THEIR FAMILIES', x: 50, y: 15, fontSize: 9, fontFamily: 'sans', letterSpacing: '2px', isBold: true, color: '#bd9661' },
      { id: 'txt-2', type: 'text', content: 'Sophie & Daniel', x: 50, y: 28, fontSize: 26, fontFamily: 'serif', isItalic: true, color: '#bd9661' },
      { id: 'flw-1', type: 'flower', content: 'magnolia-bloom', x: 22, y: 16, scale: 0.9, color: '#bd9661', fillColor: '#ffffff' },
      { id: 'txt-3', type: 'text', content: 'SATURDAY, 14 NOVEMBER 2026', x: 50, y: 45, fontSize: 10, fontFamily: 'serif', isBold: true, color: '#bd9661' },
      { id: 'txt-4', type: 'text', content: 'THE BOTANICAL GARDEN • SYDNEY', x: 50, y: 55, fontSize: 9, fontFamily: 'sans', color: '#bd9661' },
      { id: 'div-1', type: 'divider', content: 'flourish-divider', x: 50, y: 65, scale: 0.9, color: '#bd9661' },
      { id: 'seal-1', type: 'seal', content: 'wax-seal', x: 50, y: 80, scale: 0.95, color: '#bd9661', fillColor: '#bd9661' },
    ];
    setElements(newEls);
    setHistory([newEls]);
    setHistoryIndex(0);
    setSelectedElementId(null);
    setRightCardMode('design-box');
    setIsStudioOpen(true);
  };

  // Trigger animation unboxing simulation
  const handlePlayAnimation = () => {
    setIsPlayingMotion(true);
    setUnboxingPhase('opening');
    setTimeout(() => {
      setUnboxingPhase('opened');
    }, 900);
    setTimeout(() => {
      setIsPlayingMotion(false);
      setUnboxingPhase('closed');
    }, 2400);
  };

  // Save/Deploy Template
  const handleSaveTemplate = () => {
    if (editingTemplateId) {
      setTemplates(templates.map((t) => (t.id === editingTemplateId ? {
        ...t,
        name: cardName,
        category: cardCategory,
        animationType,
        cardShape,
        cardShimmer,
        baseColor,
        foilColor,
        envelopeColor,
        showEnvelopeBackdrop,
        backgroundImage,
        backgroundPosX: bgPosX,
        backgroundPosY: bgPosY,
        backgroundScale: bgScale,
        backgroundOpacity: bgOpacity,
        elements,
        duration: '1.5s',
      } : t)));
      showToast(`✓ Template "${cardName}" saved and deployed to platform!`, 'success');
    } else {
      const newTemplate: CustomCardTemplate = {
        id: `tpl-${Date.now()}`,
        name: cardName || 'Bespoke Custom Card',
        category: cardCategory,
        animationType,
        cardShape,
        cardShimmer,
        sourceType: 'designer',
        baseColor,
        foilColor,
        envelopeColor,
        showEnvelopeBackdrop,
        backgroundImage,
        backgroundPosX: bgPosX,
        backgroundPosY: bgPosY,
        backgroundScale: bgScale,
        backgroundOpacity: bgOpacity,
        elements,
        duration: '1.5s',
        active: true,
        createdAt: 'SuperAdmin Whiteboard',
      };
      setTemplates([newTemplate, ...templates]);
      showToast(`✓ New card theme "${cardName}" deployed to platform!`, 'success');
    }
  };

  // =========================================================================
  // INTERACTIVE 8-HANDLE DIRECT RESIZE (4 CORNERS + 4 EDGE MIDPOINTS - LIKE WORD)
  // Supports independent horizontal & vertical expansion or proportional corners
  // =========================================================================
  const resizeStartRef = useRef<{
    id: string;
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';
    startX: number;
    startY: number;
    initialScaleX: number;
    initialScaleY: number;
  } | null>(null);

  const [isResizing, setIsResizing] = useState(false);

  const handleResizeDown = (
    e: React.PointerEvent,
    element: CanvasElement,
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w'
  ) => {
    e.stopPropagation();
    setIsResizing(true);
    const curSx = element.scaleX ?? element.scale ?? 1;
    const curSy = element.scaleY ?? element.scale ?? 1;
    resizeStartRef.current = {
      id: element.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialScaleX: curSx,
      initialScaleY: curSy,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    const deltaX = e.clientX - resizeStartRef.current.startX;
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const { handle, initialScaleX, initialScaleY, id } = resizeStartRef.current;

    let newScaleX = initialScaleX;
    let newScaleY = initialScaleY;

    if (handle === 'e') {
      // Horizontal stretch/collapse from right edge
      const factorX = 1 + deltaX / 65;
      newScaleX = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
    } else if (handle === 'w') {
      // Horizontal stretch/collapse from left edge
      const factorX = 1 - deltaX / 65;
      newScaleX = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
    } else if (handle === 's') {
      // Vertical stretch/collapse from bottom edge
      const factorY = 1 + deltaY / 65;
      newScaleY = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'n') {
      // Vertical stretch/collapse from top edge
      const factorY = 1 - deltaY / 65;
      newScaleY = Math.max(0.2, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'se') {
      // Bottom-Right corner: expand/collapse horizontally & vertically
      const factorX = 1 + deltaX / 70;
      const factorY = 1 + deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'nw') {
      // Top-Left corner
      const factorX = 1 - deltaX / 70;
      const factorY = 1 - deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'ne') {
      // Top-Right corner
      const factorX = 1 + deltaX / 70;
      const factorY = 1 - deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    } else if (handle === 'sw') {
      // Bottom-Left corner
      const factorX = 1 - deltaX / 70;
      const factorY = 1 + deltaY / 70;
      newScaleX = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleX * factorX).toFixed(2))));
      newScaleY = Math.max(0.25, Math.min(3.8, parseFloat((initialScaleY * factorY).toFixed(2))));
    }

    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              scaleX: newScaleX,
              scaleY: newScaleY,
              scale: parseFloat(((newScaleX + newScaleY) / 2).toFixed(2)),
            }
          : el
      )
    );
  };

  const handleResizeUp = (e: React.PointerEvent) => {
    if (isResizing) {
      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      pushToHistory(elements);
    }
  };

  // Pointer drag events for canvas elements
  const handleElementPointerDown = (e: React.PointerEvent, element: CanvasElement) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
    setRightCardMode('inspector');
    setIsDragging(true);
    dragStartRef.current = {
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x,
      initialY: element.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleElementPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;
    const newX = Math.round(Math.max(5, Math.min(95, dragStartRef.current.initialX + deltaX)));
    const newY = Math.round(Math.max(5, Math.min(95, dragStartRef.current.initialY + deltaY)));

    setElements((prev) =>
      prev.map((el) => (el.id === dragStartRef.current!.id ? { ...el, x: newX, y: newY } : el))
    );
  };

  const handleElementPointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
      pushToHistory(elements);
    }
  };

  // Add an element to canvas from the whiteboard tool buttons
  const addElementToCanvas = (item: {
    type: CanvasElement['type'];
    content: string;
    name: string;
    fontSize?: number;
    fontFamily?: CanvasElement['fontFamily'];
    isBold?: boolean;
    isItalic?: boolean;
    fillColor?: string;
    shimmer?: CanvasElement['shimmer'];
    letterSpacing?: string;
  }) => {
    const newElement: CanvasElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: item.type,
      content: item.content,
      x: 50,
      y: Math.min(85, 20 + elements.length * 7),
      fontSize: item.fontSize || (item.type === 'text' ? 16 : undefined),
      fontFamily: item.fontFamily || 'serif',
      color: foilColor,
      fillColor: item.fillColor || (item.type === 'flower' ? '#ffffff' : item.type === 'leaf' ? '#f4f8f4' : foilColor),
      shimmer: item.shimmer || 'none',
      rotation: 0,
      scale: 1,
      opacity: 1,
      borderStyle: 'solid',
      zIndex: elements.length + 1,
      isBold: item.isBold || false,
      isItalic: item.isItalic || false,
      letterSpacing: item.letterSpacing || 'normal',
    };
    const updated = [...elements, newElement];
    setElements(updated);
    pushToHistory(updated);
    setSelectedElementId(newElement.id);
    setRightCardMode('inspector');
    showToast(`Added ${item.name} to card`, 'info');
  };

  // Duplicate selected element
  const duplicateSelectedElement = () => {
    if (!selectedElement) return;
    const cloned: CanvasElement = {
      ...JSON.parse(JSON.stringify(selectedElement)),
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: Math.min(90, selectedElement.x + 5),
      y: Math.min(90, selectedElement.y + 5),
      zIndex: elements.length + 1,
    };
    const updated = [...elements, cloned];
    setElements(updated);
    pushToHistory(updated);
    setSelectedElementId(cloned.id);
    showToast('Element duplicated', 'info');
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    const updated = elements.filter((el) => el.id !== selectedElementId);
    setElements(updated);
    pushToHistory(updated);
    setSelectedElementId(null);
    showToast('Element deleted', 'info');
  };

  // Clear all elements
  const handleClearCanvas = () => {
    if (window.confirm('Clear all elements from canvas?')) {
      setElements([]);
      pushToHistory([]);
      setSelectedElementId(null);
      showToast('Canvas cleared', 'info');
    }
  };

  // File Upload Handler for custom card animation
  const handleFileDrop = (file: File) => {
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'Custom Animation',
    });
    setAnimationType(`Custom: ${file.name}`);
    setIsUploadModalOpen(false);
    showToast(`✓ Animation file "${file.name}" uploaded successfully!`, 'success');
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const activeShapeObj = CARD_SHAPES.find((s) => s.id === cardShape) || CARD_SHAPES[0];

  return (
    <>
      {/* =================================================================== */}
      {/* 1. COMPACT SECTION ON PLATFORM SETTINGS (CLEAN BLACK & GOLD UI)    */}
      {/* =================================================================== */}
      <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ede4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] shrink-0 shadow-2xs">
              <EnvelopeIcon className="w-5 h-5 text-[#bd9661]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base font-bold text-[#15110e]">
                  Bespoke Invitation Cards &amp; 3D Unboxing
                </h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#15110e] text-[#bd9661] border border-[#bd9661]/50 text-[11px] font-bold shadow-xs">
                  <SparkleIcon className="w-3.5 h-3.5 text-[#bd9661]" />
                  <span>Coming Soon</span>
                </span>

              </div>
              <p className="text-xs text-[#8b7b6b] mt-0.5">
                Design custom letterpress wedding invitations with tailored silhouettes, botanical flourishes, and hardware-accelerated 3D envelope unboxings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenNewDesign}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PaletteIcon className="w-4 h-4 text-[#bd9661]" />
              <span>Open Studio Designer</span>

            </button>
          </div>
        </div>

        {/* Clean Theme Cards Grid - Simplified & Uncluttered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAllThemes ? templates : templates.slice(0, 3)).map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#faf8f5] hover:bg-[#fbf9f6] border border-[#e8ded0] hover:border-[#bd9661] rounded-xl p-4 transition-all duration-200 shadow-2xs flex flex-col justify-between gap-3 group"
            >
              <div>
                {/* Category Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#e2d8c9] text-[#786452]">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] text-[#8b7b6b] font-medium">
                    {CARD_SHAPES.find((s) => s.id === tpl.cardShape)?.name || 'Classic Silhouette'}
                  </span>
                </div>

                {/* Exact Card Design Visual Preview (Thumbnail Matching Invitation Demo) */}
                <div
                  className="relative w-full h-44 rounded-xl overflow-hidden p-3.5 my-2 flex flex-col items-center justify-center text-center shadow-md select-none border transition-all duration-300 group-hover:shadow-lg cursor-pointer"
                  onClick={() => handleOpenDesignerFor(tpl)}
                  style={{
                    backgroundColor: tpl.baseColor,
                    borderColor: tpl.foilColor + '60',
                  }}
                >
                  {/* Envelope backdrop hint */}
                  <div
                    className="absolute -bottom-3 inset-x-2 h-10 rounded-t-xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: tpl.envelopeColor }}
                  />

                  {/* Background photo preview if uploaded */}
                  {tpl.backgroundImage && (
                    <img
                      src={tpl.backgroundImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
                    />
                  )}

                  {/* Inner gilded silhouette frame */}
                  <div
                    className={`absolute inset-2 border pointer-events-none transition-all ${
                      tpl.cardShape === 'arch-dome'
                        ? 'rounded-t-[34px] rounded-b-lg'
                        : tpl.cardShape === 'scallop-ornate'
                        ? 'rounded-2xl'
                        : 'rounded-lg'
                    }`}
                    style={{ borderColor: tpl.foilColor + '70' }}
                  />

                  {/* Design Highlights & Artwork for this Theme */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-1">
                    {/* Decorative Top Accent */}
                    <div className="text-xs tracking-widest" style={{ color: tpl.foilColor }}>
                      {tpl.id === 'coastal-harbor' && (
                        <span className="font-mono text-[10px] tracking-[4px] drop-shadow-xs">✨ • • ✨ • • ✨</span>
                      )}
                      {tpl.id === 'midnight-protea' && (
                        <span className="text-[11px] tracking-[3px]">🌹 ✦ 🌿 ✦ 🌹</span>
                      )}
                      {tpl.id === 'native-wattle' && (
                        <span className="text-[11px] tracking-[3px]">🌿 ✦ 🌼 ✦ 🌿</span>
                      )}
                      {tpl.id === 'vineyard-arch' && (
                        <span className="text-[11px] tracking-[3px]">🍇 ✦ ⌒ ✦ 🍇</span>
                      )}
                      {tpl.id === 'magnolia-gold' && (
                        <span className="text-[11px] tracking-[3px]">🌸 ✦ 👑 ✦ 🌸</span>
                      )}
                    </div>

                    {/* Header Line */}
                    <div
                      className="text-[8px] font-sans font-bold uppercase tracking-[2px] opacity-80"
                      style={{ color: tpl.foilColor }}
                    >
                      {tpl.id === 'coastal-harbor'
                        ? "YOU'RE INVITED"
                        : tpl.id === 'native-wattle'
                        ? 'CELEBRATE THE MARRIAGE'
                        : 'TOGETHER WITH FAMILIES'}
                    </div>

                    {/* Couple Name rendered in authentic font */}
                    <div
                      className="font-serif italic text-lg leading-tight font-medium drop-shadow-2xs"
                      style={{
                        color: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? '#ffffff' : tpl.foilColor,
                        fontFamily: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? 'Great Vibes, cursive' : 'Playfair Display, serif',
                      }}
                    >
                      {tpl.id === 'coastal-harbor' ? 'Olivia & James' : 'Sophie & Daniel'}
                    </div>

                    {/* Date Bar */}
                    <div
                      className="text-[8.5px] font-serif font-bold tracking-wider uppercase opacity-90 px-2 py-0.5 rounded"
                      style={{
                        color: tpl.id === 'coastal-harbor' ? '#fae392' : tpl.foilColor,
                        backgroundColor: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      {tpl.id === 'coastal-harbor' ? 'SAT | 28 NOV 2026' : 'SAT | 14 NOV 2026'}
                    </div>

                    {/* Venue / Location */}
                    <div
                      className="text-[8px] font-sans font-medium tracking-wide opacity-80 line-clamp-1"
                      style={{ color: tpl.id === 'coastal-harbor' || tpl.id === 'midnight-protea' ? '#ffffff' : '#2c221a' }}
                    >
                      {tpl.id === 'coastal-harbor'
                        ? 'Watsons Bay Boutique Hotel • Sydney'
                        : tpl.id === 'midnight-protea'
                        ? 'Doltone House • Sydney Harbour'
                        : tpl.id === 'native-wattle'
                        ? 'Woodlands Estate • Blue Mountains'
                        : tpl.id === 'vineyard-arch'
                        ? 'Bimbadgen Estate • Hunter Valley'
                        : 'The Botanical Garden • Sydney'}
                    </div>

                    {/* Seal / QR icon hint */}
                    <div className="pt-0.5 opacity-85">
                      {tpl.id === 'coastal-harbor' ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-black font-mono font-bold">QR RSVP</span>
                      ) : (
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white shadow-xs"
                          style={{ backgroundColor: tpl.foilColor }}
                        >
                          {tpl.id === 'midnight-protea' ? '🌹' : tpl.id === 'native-wattle' ? '🌿' : tpl.id === 'vineyard-arch' ? '✦' : '👑'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Theme Name */}
                <h4 className="font-serif text-[15px] font-bold text-[#15110e] group-hover:text-[#bd9661] transition-colors line-clamp-1 mt-1">
                  {tpl.name}
                </h4>
              </div>

              {/* Clean Bottom: Action button */}
              <div className="pt-2.5 border-t border-[#f0ede4] flex items-center justify-between">
                <span className="text-[10px] text-[#a09080] font-medium">Interactive Studio</span>
                <button
                  type="button"
                  onClick={() => handleOpenDesignerFor(tpl)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15110e] text-[#fce4ca] hover:bg-[#bd9661] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Preview Studio</span>
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick Action: Create Blank Invitation (Shown when Expanded) */}
          {showAllThemes && (
            <div
              onClick={handleOpenNewDesign}
              className="border-2 border-dashed border-[#d9cdbe] hover:border-[#bd9661] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all bg-[#faf8f5]/50 hover:bg-[#faf5ee] min-h-[120px] group"
            >
              <div className="w-8 h-8 rounded-full bg-[#15110e] border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] group-hover:scale-110 transition-transform shadow-2xs">
                <span className="text-base font-bold">+</span>
              </div>
              <div>
                <div className="font-serif text-sm font-bold text-[#15110e]">Create Blank Invitation</div>
                <div className="text-[11px] text-[#8b7b6b]">Design from scratch</div>
              </div>
            </div>
          )}
        </div>

        {/* Show More / Show Less Toggle Button */}
        <div className="flex justify-center pt-3 pb-1">
          <button
            type="button"
            onClick={() => setShowAllThemes((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#d5c7b5] hover:border-[#bd9661] text-[#2c221a] hover:text-[#bd9661] text-xs font-bold transition-all shadow-2xs cursor-pointer group"
          >
            <span>{showAllThemes ? 'Show Less Themes' : 'Show More Themes'}</span>
            <ChevronDownIcon className={`w-3.5 h-3.5 text-[#bd9661] transition-transform duration-200 ${showAllThemes ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. FULL VIEWPORT WHITEBOARD STUDIO (REACT PORTAL INTO BODY)        */}
      {/* Covers entire screen 100vw x 100vh, breaks out of any parent,      */}
      {/* eliminates any button cutoff and bottom background bleed-through.  */}
      {/* =================================================================== */}
      {isStudioOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen z-[99999999] bg-[#fbf8f2] flex flex-col select-none overflow-hidden animate-fadeIn">
            {/* Shimmer & Animation Keyframes */}
            <style>{`/* Clean Letterpress Styling - No Moving Sheens */`}</style>

            {/* ============================================================= */}
            {/* UNIFIED TOP BAR: BACK, TITLE, CENTER TOOLBAR & RIGHT ACTIONS   */}
            {/* ============================================================= */}
            <header className="h-14 px-3 sm:px-4 bg-[#15110e] text-white border-b border-[#2b221a] flex items-center justify-between gap-2 sm:gap-4 shrink-0 shadow-lg z-50">
              {/* Left: Exit button & Title */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  title="Return to Super Admin Settings (Esc)"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-[#dfc194]" />
                  <span className="hidden sm:inline">Back to Settings</span>
                  <span className="sm:hidden">Exit</span>
                </button>

                <div className="h-5 w-px bg-[#3d3024] hidden md:block" />

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#241c16] border border-[#bd9661] text-[#bd9661] inline-grid place-items-center text-xs font-serif font-bold">
                    T
                  </span>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="font-serif text-xs sm:text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-[#bd9661] focus:border-[#bd9661] focus:outline-none px-1 max-w-[130px] sm:max-w-[210px] truncate"
                    title="Click to rename theme"
                  />
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#241c16] text-[#bd9661] border border-[#bd9661]/40 hidden xl:inline">
                    Whiteboard Studio
                  </span>
                </div>
              </div>

              {/* Center: Minimalist Whiteboard Navigation Controls */}
              <div className="flex items-center gap-1 bg-[#1d1713] border border-[#bd9661]/40 rounded-xl p-1 shadow-inner relative z-50">
                {/* 1. Pointer / Select tool */}
                <button
                  type="button"
                  onClick={() => setActiveTool('select')}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    activeTool === 'select' ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-sm' : 'text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white'
                  }`}
                  title="Select & Move (V)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                </button>

                {/* 2. Pan / Hand Tool */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('pan');
                    showToast('Pan View mode', 'info');
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    activeTool === 'pan' ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-sm' : 'text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white'
                  }`}
                  title="Pan View (H)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
                    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                    <path d="M6 14v1a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6v-3a2 2 0 0 0-4 0v2" />
                  </svg>
                </button>

                {/* 3. Lock Canvas */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool(activeTool === 'lock' ? 'select' : 'lock');
                    showToast(activeTool === 'lock' ? 'Canvas unlocked' : 'Canvas locked', 'info');
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                    activeTool === 'lock' ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-sm' : 'text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white'
                  }`}
                  title="Lock / Unlock Canvas"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* 4. Quick Add Text */}
                <button
                  type="button"
                  onClick={() => {
                    addElementToCanvas({
                      type: 'text',
                      content: 'Enter Wedding Details',
                      name: 'Text Box',
                      fontSize: 14,
                      fontFamily: 'sans',
                      isBold: true,
                    });
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] transition-all cursor-pointer font-serif font-bold"
                  title="Add Text Box (T)"
                >
                  T
                </button>

                {/* 5. Undo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                    historyIndex > 0 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                </button>

                {/* 6. Redo */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                    historyIndex < history.length - 1 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                  </svg>
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* 7. Clear Canvas */}
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs text-[#c5b5a5] hover:text-red-400 hover:bg-[#2b221a] transition-all cursor-pointer"
                  title="Clear Canvas Elements"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {/* Right: Motion preview, Save Theme, and Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePlayAnimation}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] border border-[#bd9661]/40 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                  title="Simulate unboxing motion on card"
                >
                  <span>▶</span>
                  <span className="hidden md:inline">{isPlayingMotion ? 'Simulating...' : 'Play Motion'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] hover:text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  title="Save & Deploy theme"
                >
                  <span>✓</span>
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] hover:text-white flex items-center justify-center text-xs font-bold border border-[#3d3024] transition-all cursor-pointer"
                  title="Close Studio (Esc)"
                >
                  ✕
                </button>
              </div>
            </header>

            {/* =============================================================== */}
            {/* WHITEBOARD MAIN STAGE (WITH SYMMETRIC EQUAL-SIZED DUAL CARDS)   */}
            {/* =============================================================== */}
            <div
              className={`flex-1 relative overflow-hidden flex items-center justify-center p-6 ${
                gridStyle === 'dots'
                  ? 'bg-[#fbf8f2] [background-image:radial-gradient(#cbbda8_1.2px,transparent_1.2px)] [background-size:24px_24px]'
                  : gridStyle === 'lines'
                  ? 'bg-[#fbf8f2] [background-image:linear-gradient(to_right,#e4dbcd_1px,transparent_1px),linear-gradient(to_bottom,#e4dbcd_1px,transparent_1px)] [background-size:28px_28px]'
                  : 'bg-[#fbf8f2]'
              }`}
              onClick={() => {
                setSelectedElementId(null);
              }}
            >
              {/* ============================================================= */}
              {/* CARD 1 (LEFT): CARD AESTHETIC, SHAPES, SHIMMER & 3D MOTION    */}
              {/* Equal width (w-[320px] 2xl:w-[340px]), matching height & style */}
              {/* ============================================================= */}
              <aside
                className={`absolute top-4 left-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#fefdfb]/98 backdrop-blur-md border border-[#dfd4c5] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto text-[#15110e] ${
                  isLeftCollapsed ? '-translate-x-[340px]' : 'translate-x-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="h-12 px-4 bg-[#f8f4ee] border-b border-[#e8ded0] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#bd9661]/15 border border-[#bd9661]/30 flex items-center justify-center text-[#96713e]">
                      <PaletteIcon className="w-4 h-4 text-[#96713e]" />
                    </div>
                    <h3 className="font-serif text-xs font-bold text-[#15110e] tracking-wide">
                      Card Aesthetic &amp; Motion
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f0eae1] text-[#7a6248] border border-[#dfd4c5]">
                      Base Card
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLeftCollapsed(true)}
                      className="w-6 h-6 rounded bg-[#ede5d8] hover:bg-[#ded3c2] text-[#5c4632] flex items-center justify-center text-xs transition-all cursor-pointer"
                      title="Hide Panel"
                    >
                      <ChevronLeftIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body: Scrollable */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
                  {/* 1. Card Silhouette Shape (Compact Luxury Dropdown) */}
                  <div className="relative">
                    <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5 flex items-center justify-between">
                      <span>Card Silhouette Shape</span>
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
                  </div>

                  {/* 2. Card Background (Paper Color & Photo Wallpaper) */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Card Background
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'paper' ? null : 'paper')}
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                          activeColorPickerTab === 'paper'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                        title="Pick custom paper color from spectrum"
                      >
                        <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                        <span>Paper Color</span>
                      </button>
                    </div>

                    {/* 2D Color Spectrum Picker */}
                    {activeColorPickerTab === 'paper' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={baseColor} onChange={setBaseColor} darkMode={false} />
                      </div>
                    )}

                    {/* Quick Curated Paper Swatches */}
                    <div className="grid grid-cols-7 gap-1.5 pt-0.5">
                      {[
                        { hex: '#fcfbf7', name: 'Linen Ivory' },
                        { hex: '#faf5ec', name: 'Warm Ecru' },
                        { hex: '#ffffff', name: 'Pure White' },
                        { hex: '#171921', name: 'Obsidian Noir' },
                        { hex: '#1b382b', name: 'Forest Sage' },
                        { hex: '#0f172a', name: 'Midnight Navy' },
                        { hex: '#fbf0ee', name: 'Blush Silk' },
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setBaseColor(col.hex)}
                          className={`h-6 rounded-md border shadow-xs cursor-pointer transition-transform ${
                            baseColor.toLowerCase() === col.hex.toLowerCase()
                              ? 'scale-110 border-white ring-2 ring-[#bd9661]'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>

                    {/* Hidden File Input for Background Photo */}
                    <input
                      ref={bgFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={handleBgImageUpload}
                    />

                    {/* Photo Wallpaper State: Upload Button or Active Controls */}
                    {!backgroundImage ? (
                      <button
                        type="button"
                        onClick={() => bgFileInputRef.current?.click()}
                        className="w-full mt-1 py-2 px-3 rounded-xl border border-dashed border-[#bd9661]/60 hover:border-[#bd9661] bg-[#fbf8f2] hover:bg-[#f6eee2] text-[#4a3b2c] flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
                      >
                        <UploadCloudIcon className="w-4 h-4 text-[#bd9661] group-hover:scale-110 transition-transform" />
                        <span>Upload custom background</span>
                      </button>
                    ) : (
                      <div className="mt-2 p-3 bg-white border border-[#e4dcd0] rounded-xl space-y-3 shadow-2xs">
                        {/* Thumbnail & Title */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-16 shrink-0 border border-[#bd9661]/60 overflow-hidden relative shadow-xs bg-[#15110e] ${activeShapeObj.roundedClass}`}
                          >
                            <img
                              src={backgroundImage}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#15110e] truncate">Background Photo</div>
                            <div className="text-[10px] text-[#8b7b6b] mt-0.5">Auto-fits card silhouette</div>
                          </div>
                        </div>

                        {/* Minimize / Maximize Zoom Scale Controls */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-medium text-[#5c4632]">
                            <span>Minimize / Maximize (Zoom)</span>
                            <span className="font-bold text-[#15110e]">{Math.round(bgScale * 100)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setBgScale((prev) => Math.max(0.4, parseFloat((prev - 0.1).toFixed(2))))}
                              className="w-7 h-7 rounded-lg border border-[#d5c7b5] bg-white hover:bg-[#faf7f2] text-[#4a3b2c] flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-[#bd9661]"
                              title="Minimize / Zoom Out (-10%)"
                            >
                              −
                            </button>
                            <input
                              type="range"
                              min="0.4"
                              max="3.0"
                              step="0.05"
                              value={bgScale}
                              onChange={(e) => setBgScale(parseFloat(e.target.value))}
                              className="flex-1 h-1.5 bg-[#e5dcce] rounded-lg appearance-none cursor-pointer accent-[#bd9661]"
                            />
                            <button
                              type="button"
                              onClick={() => setBgScale((prev) => Math.min(3.0, parseFloat((prev + 0.1).toFixed(2))))}
                              className="w-7 h-7 rounded-lg border border-[#d5c7b5] bg-white hover:bg-[#faf7f2] text-[#4a3b2c] flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-[#bd9661]"
                              title="Maximize / Zoom In (+10%)"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Photo Opacity Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-medium text-[#5c4632]">
                            <span>Photo Opacity</span>
                            <span className="font-bold">{Math.round(bgOpacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.3"
                            max="1"
                            step="0.05"
                            value={bgOpacity}
                            onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-[#e5dcce] rounded-lg appearance-none cursor-pointer accent-[#bd9661]"
                          />
                        </div>

                        {/* Reset to Center */}
                        <button
                          type="button"
                          onClick={() => {
                            setBgPosX(50);
                            setBgPosY(50);
                            setBgScale(1);
                            showToast('Position reset to center', 'info');
                          }}
                          className="w-full py-1.5 rounded-lg border border-[#e0d6c8] bg-white hover:bg-[#faf7f2] text-[#5c4632] text-[10px] font-medium transition-all cursor-pointer text-center"
                        >
                          Reset Position to Center
                        </button>

                        {/* Below Reset Position: Save / Reposition Button & Replace / Remove Buttons */}
                        <div className="pt-1 border-t border-[#ede5d8] space-y-2">
                          {/* Direct Drag Reposition Mode Toggle (Save / Drag) */}
                          <button
                            type="button"
                            onClick={() => setIsRepositioningBg(!isRepositioningBg)}
                            className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                              isRepositioningBg
                                ? 'bg-[#15110e] text-[#fce4ca] border-[#bd9661] shadow-xs ring-1 ring-[#bd9661]'
                                : 'bg-[#faf7f2] hover:bg-[#f3ede3] text-[#2c221a] border-[#d5c7b5]'
                            }`}
                          >
                            <span className="text-sm">{isRepositioningBg ? '✓' : '⠿'}</span>
                            <span>{isRepositioningBg ? 'Save' : 'Drag to Reposition on Card'}</span>
                          </button>

                          {/* Replace and Remove buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => bgFileInputRef.current?.click()}
                              className="py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-white hover:bg-[#fbf8f2] border border-[#d5c7b5] text-[#5c4632] hover:text-[#15110e] transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                              title="Choose a different image file"
                            >
                              <svg className="w-3.5 h-3.5 text-[#bd9661]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                <path d="M16 21h5v-5" />
                              </svg>
                              <span>Replace</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveBgImage}
                              className="py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-[#fff8f8] hover:bg-[#fee2e2] border border-[#fca5a5]/70 text-[#dc2626] transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                              title="Remove photo and return to paper color"
                            >
                              <TrashIcon className="w-3.5 h-3.5 text-[#dc2626]" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Default Foil & Border Color */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Foil &amp; Typography Color
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveColorPickerTab(activeColorPickerTab === 'foil' ? null : 'foil')}
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                          activeColorPickerTab === 'foil'
                            ? 'bg-[#bd9661] text-white border border-[#a8824f] shadow-xs'
                            : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                        }`}
                        title="Pick custom foil color from spectrum"
                      >
                        <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                        <span>Custom Color</span>
                      </button>
                    </div>

                    {/* 2D Color Spectrum Picker */}
                    {activeColorPickerTab === 'foil' && (
                      <div className="animate-fadeIn pt-1">
                        <ColorPicker2D color={foilColor} onChange={setFoilColor} darkMode={false} />
                      </div>
                    )}

                    {/* Quick Curated Foil Swatches */}
                    <div className="grid grid-cols-6 gap-1.5 pt-1">
                      {[
                        { hex: '#bd9661', name: 'Heirloom Gold' },
                        { hex: '#dfc194', name: 'Champagne Sheen' },
                        { hex: '#d4af9e', name: 'Rose Gold' },
                        { hex: '#d1d5db', name: 'Silver Platinum' },
                        { hex: '#966736', name: 'Rich Bronze' },
                        { hex: '#15110e', name: 'Ink Noir' },
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setFoilColor(col.hex)}
                          className={`h-6 rounded-md border shadow-xs cursor-pointer transition-transform ${
                            foilColor.toLowerCase() === col.hex.toLowerCase()
                              ? 'scale-110 border-white ring-2 ring-[#bd9661]'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 4. Envelope Backdrop Presentation */}
                  <div className="pt-3 border-t border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                        Envelope Backdrop
                      </div>
                      <div className="flex items-center gap-2">
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
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEnvelopeBackdrop}
                            onChange={(e) => setShowEnvelopeBackdrop(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-[#2b221a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#bd9661]"></div>
                        </label>
                      </div>
                    </div>

                    {showEnvelopeBackdrop && (
                      <div className="space-y-1.5 animate-fadeIn">
                        {activeColorPickerTab === 'envelope' && (
                          <div className="pt-1">
                            <ColorPicker2D color={envelopeColor} onChange={setEnvelopeColor} darkMode={false} />
                          </div>
                        )}

                        <div className="grid grid-cols-5 gap-1.5 pt-1">
                          {[
                            { hex: '#231c16', name: 'Deep Espresso' },
                            { hex: '#15110e', name: 'Onyx Noir' },
                            { hex: '#0e1c36', name: 'Midnight Navy' },
                            { hex: '#1c2e22', name: 'Hunter Green' },
                            { hex: '#faf5ec', name: 'Ecru Linen' },
                          ].map((col) => (
                            <button
                              key={col.hex}
                              type="button"
                              onClick={() => setEnvelopeColor(col.hex)}
                              className={`h-5 rounded border shadow-xs cursor-pointer transition-transform ${
                                envelopeColor.toLowerCase() === col.hex.toLowerCase()
                                  ? 'scale-110 border-white ring-2 ring-[#bd9661]'
                                  : 'border-white/20 hover:scale-105'
                              }`}
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Predefined 3D Unboxing Motion (Compact Luxury Dropdown) */}
                  <div className="pt-3 border-t border-[#ede5d8] relative">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                      <span>Predefined 3D Motion</span>
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

                    {/* Motion Dropdown Menu (In-flow right below button, pushes Simulate & Upload down) */}
                    {isMotionDropdownOpen && (
                      <div className="mt-1.5 bg-[#fefdfb] border border-[#dfd4c5] rounded-xl shadow-lg max-h-[260px] overflow-y-auto p-1.5 space-y-1 animate-fadeIn">
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

                    {/* Simulate and Upload buttons (always below the dropdown) */}
                    <div className="pt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePlayAnimation}
                        className="flex-1 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] border border-[#bd9661]/40 text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <PlayIcon className="w-3 h-3 text-[#bd9661]" />
                        <span>{isPlayingMotion ? 'Simulating...' : 'Simulate Motion'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5] text-xs font-semibold cursor-pointer transition-all shadow-2xs flex items-center gap-1"
                        title="Upload bespoke animation file"
                      >
                        <UploadCloudIcon className="w-3.5 h-3.5 text-[#8c6b3e]" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Collapsed Left Panel Opener */}
              {isLeftCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsLeftCollapsed(false)}
                  className="absolute top-4 left-4 z-30 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#dfd4c5] text-[#15110e] hover:text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer hover:bg-[#faf7f2] backdrop-blur-md"
                >
                  <ChevronRightIcon className="w-3.5 h-3.5 text-[#bd9661]" />
                  <span>Card Aesthetic</span>
                </button>
              )}

              {/* ============================================================= */}
              {/* THE WEDDING CARD ON THE WHITEBOARD CANVAS (IMAGE 4 PRESENTATION) */}
              {/* ============================================================= */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 relative flex items-center justify-center"
              >
                {/* Envelope Presentation Backdrop (matching Image 4) */}
                {showEnvelopeBackdrop && (
                  <div
                    className="absolute -inset-x-6 -top-14 -bottom-6 rounded-3xl pointer-events-none transition-all duration-300 shadow-2xl z-0"
                    style={{ backgroundColor: envelopeColor }}
                  >
                    {/* Open Triangular Envelope Flap rising above card */}
                    <div
                      className="absolute -top-24 inset-x-0 h-32 pointer-events-none"
                      style={{
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                        backgroundColor: envelopeColor,
                        filter: 'brightness(1.18)',
                      }}
                    />
                    {/* Inner gold foil bevel accent on envelope rim */}
                    <div
                      className="absolute inset-2.5 rounded-2xl border pointer-events-none"
                      style={{ borderColor: `${foilColor}30`, borderWidth: '1px' }}
                    />
                  </div>
                )}
                <div
                  ref={canvasRef}
                  onPointerMove={handleElementPointerMove}
                  onPointerUp={handleElementPointerUp}
                  className={`relative w-[380px] h-[550px] shadow-2xl transition-all duration-700 ease-out select-none overflow-hidden ${activeShapeObj.roundedClass}`}
                  style={{
                    backgroundColor: baseColor,
                    borderColor: foilColor,
                    borderWidth: '2px',
                    boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.45), 0 0 30px ${foilColor}30`,
                    transform: isPlayingMotion
                      ? unboxingPhase === 'opening'
                        ? 'scale(1.05) translateY(-20px) rotateX(4deg)'
                        : 'scale(1.02) translateY(-10px)'
                      : 'none',
                    perspective: '1000px',
                  }}
                  onClick={(e) => {
                    if (e.target === canvasRef.current) {
                      setSelectedElementId(null);
                    }
                  }}
                  onDoubleClick={(e) => {
                    if (backgroundImage && (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'IMG')) {
                      setIsRepositioningBg(true);
                    }
                  }}
                >
                  {/* Background Photo Wallpaper (Auto-fitted to card silhouette and freely repositionable) */}
                  {backgroundImage && (
                    <div
                      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${activeShapeObj.roundedClass}`}
                    >
                      <img
                        src={backgroundImage}
                        alt="Card Background Wallpaper"
                        draggable={false}
                        className="absolute max-w-none select-none transition-transform will-change-transform"
                        style={{
                          left: `${bgPosX}%`,
                          top: `${bgPosY}%`,
                          transform: `translate(-50%, -50%) scale(${bgScale})`,
                          minWidth: '100%',
                          minHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'cover',
                          opacity: bgOpacity,
                        }}
                      />
                    </div>
                  )}

                  {/* Repositioning Interaction Overlay & Floating Guide */}
                  {isRepositioningBg && backgroundImage && (
                    <>
                      {/* Full-canvas drag surface with pointer capture */}
                      <div
                        onPointerDown={handleBgPointerDown}
                        onPointerMove={handleBgPointerMove}
                        onPointerUp={handleBgPointerUp}
                        onWheel={handleBgWheel}
                        className="absolute inset-0 z-35 cursor-grab active:cursor-grabbing touch-none select-none"
                        title="Click and drag to reposition photo within card silhouette"
                      />

                      {/* Floating pill guide with minimize, maximize zoom controls and Save */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[340px] z-40 flex items-center justify-between px-3 py-1.5 rounded-full bg-[#15110e]/95 backdrop-blur-md border border-[#bd9661] text-white shadow-2xl animate-fadeIn pointer-events-auto">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[#bd9661] text-xs font-mono shrink-0">⠿</span>
                          <span className="font-semibold text-[11px] text-[#fce4ca] truncate">Drag to move</span>
                        </div>

                        {/* Minimize & Maximize controls directly on floating guide */}
                        <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-white/10 border border-white/15">
                          <button
                            type="button"
                            onClick={() => setBgScale((prev) => Math.max(0.4, parseFloat((prev - 0.1).toFixed(2))))}
                            className="w-5 h-5 rounded-full hover:bg-white/20 text-[#fce4ca] text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="Minimize / Zoom out"
                          >
                            −
                          </button>
                          <span className="text-[10px] font-mono font-bold text-[#fce4ca] min-w-[32px] text-center">
                            {Math.round(bgScale * 100)}%
                          </span>
                          <button
                            type="button"
                            onClick={() => setBgScale((prev) => Math.min(3.0, parseFloat((prev + 0.1).toFixed(2))))}
                            className="w-5 h-5 rounded-full hover:bg-white/20 text-[#fce4ca] text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="Maximize / Zoom in"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsRepositioningBg(false)}
                          className="px-3 py-1 rounded-full bg-[#bd9661] hover:bg-[#d4a870] text-[#15110e] text-[11px] font-bold transition-all shadow-xs cursor-pointer shrink-0 ml-1.5"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}

                  {/* Inset Gilded Border Frame */}
                  <div
                    className={`absolute inset-3 border pointer-events-none transition-all ${activeShapeObj.roundedClass}`}
                    style={{ borderColor: `${foilColor}40`, borderWidth: '1px' }}
                  />

                  {/* 3D Envelope Flap Overlay for simulation */}
                  {isPlayingMotion && animationType.includes('Flap') && (
                    <div
                      className="absolute inset-x-0 top-0 h-44 bg-[#15110e] origin-top border-b border-[#bd9661] z-50 transition-all duration-700 ease-in-out flex items-end justify-center pb-2 shadow-2xl"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        transform: unboxingPhase === 'opening' ? 'rotateX(160deg)' : 'rotateX(0deg)',
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#bd9661] border border-white flex items-center justify-center text-white text-[10px] font-serif font-bold shadow-md">
                        S • D
                      </div>
                    </div>
                  )}

                  {/* 3D Gatefold Dual Door Overlay for simulation */}
                  {isPlayingMotion && animationType.includes('Gatefold') && (
                    <>
                      <div
                        className="absolute inset-y-0 left-0 w-1/2 bg-[#15110e] origin-left border-r border-[#bd9661] z-50 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                          transform: unboxingPhase === 'opening' ? 'rotateY(-110deg)' : 'rotateY(0deg)',
                        }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 w-1/2 bg-[#15110e] origin-right border-l border-[#bd9661] z-50 transition-all duration-700 ease-in-out shadow-2xl"
                        style={{
                          transform: unboxingPhase === 'opening' ? 'rotateY(110deg)' : 'rotateY(0deg)',
                        }}
                      />
                    </>
                  )}

                  {/* Render Elements on Card */}
                  {elements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    const asset = SVG_ASSETS[el.content];
                    const sx = el.scaleX ?? el.scale ?? 1;
                    const sy = el.scaleY ?? el.scale ?? 1;

                    let elementGlowClass = '';

                    return (
                      <div
                        key={el.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                          setRightCardMode('inspector');
                        }}
                        onPointerDown={(e) => handleElementPointerDown(e, el)}
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg) scale(${sx}, ${sy})`,
                          opacity: el.opacity ?? 1,
                          zIndex: isSelected ? 40 : el.zIndex || 10,
                          cursor: isDragging && isSelected ? 'grabbing' : 'grab',
                          pointerEvents: isRepositioningBg ? 'none' : 'auto',
                        }}
                        className={`absolute group touch-none ${
                          isSelected ? 'ring-2 ring-[#bd9661] ring-offset-2 ring-offset-transparent rounded-sm' : ''
                        }`}
                      >
                        {/* Text Element */}
                        {el.type === 'text' && (
                          <div
                            className="px-2 py-0.5 whitespace-nowrap focus:outline-none select-none" 
                            style={{
                              fontFamily: getFontFamilyCss(el.fontFamily),
                              fontSize: `${el.fontSize || 14}px`,
                              fontWeight: el.isBold ? 'bold' : 'normal',
                              fontStyle: el.isItalic ? 'italic' : 'normal',
                              letterSpacing: el.letterSpacing || 'normal',
                              color: el.color || foilColor,
                            }}
                          >
                            {el.content}
                          </div>
                        )}

                        {/* Flower or Leaf or Decor Element */}
                        {(el.type === 'flower' || el.type === 'leaf' || el.type === 'graphic' || el.type === 'seal' || el.type === 'divider') && (
                          <div className={`relative ${el.type === 'divider' ? 'w-44 h-6' : el.type === 'seal' ? 'w-14 h-14' : 'w-16 h-16'} ${elementGlowClass}`}>
                            {asset ? (
                              asset.render(el.color || foilColor, el.fillColor)
                            ) : (
                              <div className="w-12 h-12 rounded bg-amber-100/40 flex items-center justify-center text-xs">
                                {el.content}
                              </div>
                            )}

                            {/* Shimmer sparkle badge indicator */}
                            
                            
                            
                          </div>
                        )}

                        {/* QR Code Element */}
                        {el.type === 'qrcode' && (
                          <div className="w-24 h-28">
                            {asset ? asset.render(el.color || foilColor, el.fillColor || '#ffffff') : null}
                          </div>
                        )}

                        {/* Interactive Word-Style 8 Handles (4 Corners + 4 Edge Midpoints) */}
                        {isSelected && (
                          <>
                            {/* 4 Corner Circular Handles */}
                            {/* Top-Left nw */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'nw')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag top-left corner to resize"
                            />
                            {/* Top-Right ne */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'ne')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag top-right corner to resize"
                            />
                            {/* Bottom-Left sw */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'sw')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag bottom-left corner to resize"
                            />
                            {/* Bottom-Right se */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'se')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag bottom-right corner to resize"
                            />

                            {/* 4 Edge Midpoint Handles (Horizontal & Vertical Direct Expand/Collapse) */}
                            {/* Top Edge n (Vertical) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'n')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateX(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -top-1.5 left-1/2 w-4 h-2.5 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ns-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag top edge to expand/collapse vertically"
                            />
                            {/* Bottom Edge s (Vertical) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 's')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateX(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -bottom-1.5 left-1/2 w-4 h-2.5 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ns-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag bottom edge to expand/collapse vertically"
                            />
                            {/* Left Edge w (Horizontal) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'w')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateY(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -left-1.5 top-1/2 w-2.5 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ew-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag left edge to expand/collapse horizontally"
                            />
                            {/* Right Edge e (Horizontal) */}
                            <span
                              onPointerDown={(e) => handleResizeDown(e, el, 'e')}
                              onPointerMove={handleResizeMove}
                              onPointerUp={handleResizeUp}
                              onPointerCancel={handleResizeUp}
                              style={{ transform: `translateY(-50%) scale(${1 / sx}, ${1 / sy})` }}
                              className="absolute -right-1.5 top-1/2 w-2.5 h-4 rounded-full bg-white border-2 border-[#bd9661] shadow-md cursor-ew-resize hover:scale-125 transition-transform z-50 pointer-events-auto"
                              title="Drag right edge to expand/collapse horizontally"
                            />

                            {/* Live Scale Badge above element during resize */}
                            {isResizing && resizeStartRef.current?.id === el.id && (
                              <div
                                style={{ transform: `translateX(-50%) scale(${1 / sx}, ${1 / sy})` }}
                                className="absolute -top-7 left-1/2 px-2 py-0.5 rounded bg-[#15110e] text-[#fce4ca] border border-[#bd9661] text-[10px] font-mono font-bold shadow-lg pointer-events-none z-50 whitespace-nowrap animate-fadeIn"
                              >
                                {el.scaleX !== undefined && el.scaleY !== undefined && el.scaleX !== el.scaleY
                                  ? `W: ${el.scaleX}x • H: ${el.scaleY}x`
                                  : `${el.scaleX ?? el.scale ?? 1}x`}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================= */}
              {/* CARD 2 (RIGHT): DESIGN BOX (FLOWERS, LEAVES, DECOR, TEXT)     */}
              {/* AND ELEMENT INSPECTOR (PETAL FILLS, FONTS, SHIMMER/GLITTER)   */}
              {/* EXACT EQUAL SIZE TO CARD 1: w-[320px] 2xl:w-[340px]           */}
              {/* ============================================================= */}
              <aside
                className={`absolute top-4 right-4 bottom-4 w-[320px] 2xl:w-[340px] z-30 bg-[#fefdfb]/98 backdrop-blur-md border border-[#dfd4c5] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 pointer-events-auto text-[#15110e] ${
                  isRightCollapsed ? 'translate-x-[340px]' : 'translate-x-0'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header: Segmented Tabs */}
                <div className="h-12 px-3 bg-[#f8f4ee] border-b border-[#e8ded0] flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center bg-[#ede5d8] p-0.5 rounded-xl border border-[#ded3c2] flex-1">
                    <button
                      type="button"
                      onClick={() => setRightCardMode('design-box')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        rightCardMode === 'design-box'
                          ? 'bg-white text-[#15110e] font-bold shadow-xs border border-[#ded3c2]'
                          : 'text-[#6e5d4e] hover:text-[#15110e]'
                      }`}
                    >
                      <GridIcon className="w-3.5 h-3.5 text-[#96713e]" />
                      <span>Design Box</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRightCardMode('inspector')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                        rightCardMode === 'inspector'
                          ? 'bg-white text-[#15110e] font-bold shadow-xs border border-[#ded3c2]'
                          : 'text-[#6e5d4e] hover:text-[#15110e]'
                      }`}
                    >
                      <InspectorIcon className="w-3.5 h-3.5 text-[#96713e]" />
                      <span>Inspector</span>
                      {selectedElement && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bd9661] animate-pulse ml-0.5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRightCollapsed(true)}
                    className="w-6 h-6 rounded bg-[#ede5d8] hover:bg-[#ded3c2] text-[#5c4632] flex items-center justify-center text-xs transition-all cursor-pointer shrink-0"
                    title="Hide Panel"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body: Scrollable */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
                  {/* TAB 1: DESIGN BOX (FLOWERS, LEAVES, DECOR, TEXT) */}
                  {rightCardMode === 'design-box' && (
                    <div className="space-y-3.5 animate-fadeIn">
                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                        {[
                          { id: 'all', label: 'All', icon: <GridIcon className="w-3 h-3" /> },
                          { id: 'flower', label: 'Flowers', icon: <FlowerIcon className="w-3 h-3 text-[#bd9661]" /> },
                          { id: 'leaf', label: 'Leaves', icon: <LeafIcon className="w-3 h-3 text-[#bd9661]" /> },
                          { id: 'decor', label: 'Decor', icon: <DecorIcon className="w-3 h-3 text-[#bd9661]" /> },
                          { id: 'text', label: 'Text', icon: <TypographyIcon className="w-3 h-3 text-[#bd9661]" /> },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setDesignBoxCategory(cat.id as any)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                              designBoxCategory === cat.id
                                ? 'bg-[#bd9661] text-[#15110e] font-bold shadow-xs'
                                : 'bg-[#1d1713] text-[#c5b5a5] hover:bg-[#2b221a] hover:text-white border border-[#2b221a]'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">{cat.icon}<span>{cat.label}</span></span>
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] text-[#8b7b6b] flex items-center justify-between px-1">
                        <span>Click any item to add to card</span>
                        <span>{DESIGN_BOX_ITEMS.filter((i) => designBoxCategory === 'all' || i.category === designBoxCategory).length} items</span>
                      </div>

                      {/* 2-Column Visual Design Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {DESIGN_BOX_ITEMS.filter((item) => designBoxCategory === 'all' || item.category === designBoxCategory).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              addElementToCanvas({
                                type: item.type,
                                content: item.content,
                                name: item.name,
                                fillColor: item.fillColor,
                                fontSize: item.fontSize,
                                fontFamily: item.fontFamily,
                                isBold: item.isBold,
                                isItalic: item.isItalic,
                                letterSpacing: item.letterSpacing,
                                shimmer: item.shimmer,
                              });
                            }}
                            className="p-2.5 rounded-xl bg-white border border-[#e2d8c9] hover:border-[#bd9661] hover:shadow-xs flex flex-col items-center gap-2 transition-all cursor-pointer group shadow-2xs relative"
                          >
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#f2eae0] group-hover:bg-[#15110e] text-[#8c6b3e] group-hover:text-[#fce4ca] text-[10px] font-bold inline-grid place-items-center transition-colors">
                              +
                            </span>

                            {item.type === 'text' ? (
                              <div
                                className="w-12 h-12 rounded-lg bg-[#faf7f2] border border-[#e2d8c9] flex items-center justify-center font-serif text-lg text-[#96713e] font-bold group-hover:scale-105 transition-transform"
                                style={{
                                  fontFamily: item.fontFamily === 'script' ? 'Pinyon Script, cursive' : item.fontFamily === 'serif' ? 'Playfair Display, serif' : 'DM Sans, sans-serif'
                                }}
                              >
                                {item.fontFamily === 'script' ? 'S' : item.fontFamily === 'serif' ? 'A' : 'T'}
                              </div>
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {SVG_ASSETS[item.content]?.render(foilColor, item.fillColor || '#ffffff')}
                              </div>
                            )}

                            <span className="text-[11px] font-semibold text-[#15110e] text-center leading-tight line-clamp-1">
                              {item.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ELEMENT INSPECTOR */}
                  {rightCardMode === 'inspector' && (
                    <div className="space-y-3.5 animate-fadeIn">
                      {selectedElement ? (
                        <>
                          {/* Element Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-[#2b221a]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-[#241c16] flex items-center justify-center text-[#bd9661]">
                                {selectedElement.type === 'flower' ? <FlowerIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'leaf' ? <LeafIcon className="w-3.5 h-3.5" /> : selectedElement.type === 'text' ? <TypographyIcon className="w-3.5 h-3.5" /> : <DecorIcon className="w-3.5 h-3.5" />}
                              </span>
                              <span className="text-[11px] font-bold text-[#fce4ca] capitalize truncate max-w-[150px]">
                                {selectedElement.content}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={duplicateSelectedElement}
                                className="w-6 h-6 rounded bg-[#241c16] hover:bg-[#34271f] text-[#dfc194] flex items-center justify-center text-xs transition-all cursor-pointer"
                                title="Duplicate element"
                              >
                                ⧉
                              </button>
                              <button
                                type="button"
                                onClick={deleteSelectedElement}
                                className="w-6 h-6 rounded bg-[#241c16] hover:bg-red-950/40 text-red-400 flex items-center justify-center text-xs transition-all cursor-pointer"
                                title="Delete element"
                              >
                                🗑
                              </button>
                            </div>
                          </div>

                          {/* A. TEXT ELEMENT INSPECTOR */}
                          {selectedElement.type === 'text' && (
                            <div className="space-y-3.5">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                  Text Content
                                </label>
                                <textarea
                                  rows={2}
                                  value={selectedElement.content}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, content: val } : el))
                                    );
                                  }}
                                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl p-2.5 text-xs text-[#15110e] focus:outline-none font-serif resize-none shadow-2xs"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Text Color</span>
                                  <button
                                    type="button"
                                    onClick={() => setInspectorColorPicker(inspectorColorPicker === 'text' ? null : 'text')}
                                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                      inspectorColorPicker === 'text'
                                        ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                        : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                    }`}
                                    title="Pick custom text color from spectrum"
                                  >
                                    <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                                    <span>Custom Color</span>
                                  </button>
                                </div>

                                {inspectorColorPicker === 'text' && (
                                  <div className="animate-fadeIn pb-2">
                                    <ColorPicker2D
                                      color={selectedElement.color || foilColor}
                                      onChange={(c) => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: c } : el))
                                        );
                                      }}
                                      darkMode={false}
                                    />
                                  </div>
                                )}

                                <div className="grid grid-cols-6 gap-1.5">
                                  {[
                                    { hex: '#bd9661', name: 'Royal Gold' },
                                    { hex: '#dfc194', name: 'Champagne' },
                                    { hex: '#e27b91', name: 'Rose Gold' },
                                    { hex: '#eed259', name: 'Bright Gold' },
                                    { hex: '#15110e', name: 'Ink Noir' },
                                    { hex: '#ffffff', name: 'White Silk' },
                                    { hex: '#273f2c', name: 'Forest Emerald' },
                                    { hex: '#0e1c36', name: 'Coastal Navy' },
                                    { hex: '#2b1e16', name: 'Velvet Plum' },
                                    { hex: '#8a2b3b', name: 'Burgundy' },
                                    { hex: '#5c4838', name: 'Warm Mocha' },
                                    { hex: '#7a8b7b', name: 'Sage Green' },
                                  ].map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: col.hex } : el))
                                        );
                                      }}
                                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                                        (selectedElement.color || foilColor) === col.hex
                                          ? 'scale-125 border-white ring-2 ring-[#bd9661]'
                                          : 'border-black/40 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: col.hex }}
                                      title={col.name}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                  <span>Font Size</span>
                                  <span className="font-mono text-[10px] text-[#15110e] bg-white px-1.5 py-0.5 rounded border border-[#e2d8c9] font-bold">
                                    {selectedElement.fontSize || 14}px
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="9"
                                  max="48"
                                  step="1"
                                  value={selectedElement.fontSize || 14}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, fontSize: val } : el))
                                    );
                                  }}
                                  className="w-full accent-[#bd9661] cursor-pointer"
                                />
                                <div className="flex items-center justify-between gap-1 mt-1 text-[10px] font-bold">
                                  {[10, 14, 18, 24, 32].map((sz) => (
                                    <button
                                      key={sz}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fontSize: sz } : el))
                                        );
                                      }}
                                      className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                                        selectedElement.fontSize === sz
                                          ? 'bg-[#15110e] text-[#fce4ca] border-[#bd9661] shadow-xs'
                                          : 'bg-[#faf7f2] border-[#e0d6c7] text-[#2c221a] hover:bg-white'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-[#ede5d8] flex items-center justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, isBold: !el.isBold } : el))
                                    );
                                  }}
                                  className={`flex-1 py-1 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                                    selectedElement.isBold ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661] shadow-xs' : 'bg-[#241c16] border-[#3d3024] text-white hover:bg-[#2b221a]'
                                  }`}
                                  title="Toggle Bold"
                                >
                                  Bold (B)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setElements((prev) =>
                                      prev.map((el) => (el.id === selectedElement.id ? { ...el, isItalic: !el.isItalic } : el))
                                    );
                                  }}
                                  className={`flex-1 py-1 rounded-lg border italic text-xs transition-all cursor-pointer ${
                                    selectedElement.isItalic ? 'bg-[#bd9661] text-[#15110e] border-[#bd9661] shadow-xs font-bold' : 'bg-[#241c16] border-[#3d3024] text-white hover:bg-[#2b221a]'
                                  }`}
                                  title="Toggle Italic"
                                >
                                  Italic (I)
                                </button>
                              </div>

                              {/* Font Family: Word / Google Docs Style Searchable Dropdown with Live Previews */}
                              <div className="relative">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e]">
                                    Font Family
                                  </label>
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

                                {/* Dropdown Menu with Search and Live Typeface Previews */}
                                {isFontDropdownOpen && (
                                  <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#fefdfb] border border-[#dfd4c5] rounded-xl shadow-2xl overflow-hidden p-2 space-y-2 animate-fadeIn max-h-[250px] flex flex-col">
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
                              </div>

                              {/* Text Shimmer / Metallic Sheen */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Text Shimmer / Foil Sheen</span>
                                  <span className="text-[10px] font-bold text-[#15110e] capitalize">{selectedElement.shimmer || 'none'}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  {[
                                    { id: 'none', label: 'None', icon: '⚪' },
                                    { id: 'gold-glitter', label: 'Gold Sheen', icon: '✦' },
                                    { id: 'diamond', label: 'Diamond', icon: '✧' },
                                  ].map((sh) => (
                                    <button
                                      key={sh.id}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, shimmer: sh.id as any } : el))
                                        );
                                      }}
                                      className={`py-1.5 px-2 rounded-xl border text-center text-[10px] font-semibold cursor-pointer transition-all ${
                                        (selectedElement.shimmer || 'none') === sh.id
                                          ? 'bg-[#15110e] border-[#bd9661] text-[#fce4ca] font-bold shadow-xs ring-1 ring-[#bd9661]'
                                          : 'bg-[#faf7f2] border-[#e0d6c7] text-[#5c483a] hover:bg-white'
                                      }`}
                                    >
                                      <span>{sh.icon} </span>
                                      <span>{sh.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* B. FLORAL & GRAPHIC ELEMENT INSPECTOR */}
                          {selectedElement.type !== 'text' && (
                            <div className="space-y-3.5">
                              {/* 1. Petal Fill Color */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Petal / Body Fill Color</span>
                                  <button
                                    type="button"
                                    onClick={() => setInspectorColorPicker(inspectorColorPicker === 'petal' ? null : 'petal')}
                                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                      inspectorColorPicker === 'petal'
                                        ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                        : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                    }`}
                                    title="Pick custom fill color from spectrum"
                                  >
                                    <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                                    <span>Custom Color</span>
                                  </button>
                                </div>

                                {inspectorColorPicker === 'petal' && (
                                  <div className="animate-fadeIn pb-2">
                                    <ColorPicker2D
                                      color={selectedElement.fillColor && selectedElement.fillColor !== 'transparent' ? selectedElement.fillColor : '#ffffff'}
                                      onChange={(c) => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fillColor: c } : el))
                                        );
                                      }}
                                      darkMode={false}
                                    />
                                  </div>
                                )}

                                <div className="grid grid-cols-6 gap-1.5">
                                  {[
                                    { hex: '#ffffff', name: 'White Silk' },
                                    { hex: '#fdfbf7', name: 'Linen Ivory' },
                                    { hex: '#fce7ea', name: 'Blush Pink' },
                                    { hex: '#f7eedf', name: 'Champagne Tint' },
                                    { hex: '#eef5ee', name: 'Pastel Sage' },
                                    { hex: '#f3edf8', name: 'Lavender Mist' },
                                    { hex: '#bd9661', name: 'Gold Fill' },
                                    { hex: '#15110e', name: 'Obsidian Noir' },
                                    { hex: '#273f2c', name: 'Deep Emerald' },
                                    { hex: '#8a2b3b', name: 'Crimson Rose' },
                                    { hex: '#ffd700', name: 'Warm Amber' },
                                    { hex: 'transparent', name: 'Transparent' },
                                  ].map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, fillColor: col.hex } : el))
                                        );
                                      }}
                                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                                        (selectedElement.fillColor || '#ffffff') === col.hex
                                          ? 'scale-125 border-white ring-2 ring-[#bd9661]'
                                          : 'border-black/40 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: col.hex === 'transparent' ? '#333333' : col.hex }}
                                      title={col.name}
                                    >
                                      {col.hex === 'transparent' && <span className="text-[9px] text-white">∅</span>}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 2. Foil Stroke Color */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Foil / Outline Stroke</span>
                                    <button
                                      type="button"
                                      onClick={() => setInspectorColorPicker(inspectorColorPicker === 'stroke' ? null : 'stroke')}
                                      className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                                        inspectorColorPicker === 'stroke'
                                          ? 'bg-[#bd9661] text-white border border-[#a8824f]'
                                          : 'bg-white hover:bg-[#faf7f2] text-[#4a3b2c] border border-[#d5c7b5]'
                                      }`}
                                    >
                                      <PaletteIcon className="w-2.5 h-2.5 text-[#bd9661]" />
                                      <span>Custom Color</span>
                                    </button>
                                </div>

                                {inspectorColorPicker === 'stroke' && (
                                  <div className="animate-fadeIn pb-2">
                                    <ColorPicker2D
                                      color={selectedElement.color || foilColor}
                                      onChange={(c) => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: c } : el))
                                        );
                                      }}
                                      darkMode={false}
                                    />
                                  </div>
                                )}

                                <div className="grid grid-cols-5 gap-1.5">
                                  {[
                                    { hex: '#bd9661', name: 'Royal Gold' },
                                    { hex: '#dfc194', name: 'Champagne' },
                                    { hex: '#e27b91', name: 'Rose Gold' },
                                    { hex: '#eed259', name: 'Bright Gold' },
                                    { hex: '#15110e', name: 'Obsidian Noir' },
                                    { hex: '#ffffff', name: 'White Silk' },
                                    { hex: '#273f2c', name: 'Forest Emerald' },
                                    { hex: '#0e1c36', name: 'Coastal Navy' },
                                    { hex: '#2b1e16', name: 'Velvet Plum' },
                                    { hex: '#8a2b3b', name: 'Burgundy' },
                                  ].map((col) => (
                                    <button
                                      key={col.hex}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, color: col.hex } : el))
                                        );
                                      }}
                                      className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer transition-transform ${
                                        (selectedElement.color || foilColor) === col.hex
                                          ? 'scale-125 border-white ring-2 ring-[#bd9661]'
                                          : 'border-black/40 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: col.hex }}
                                      title={col.name}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* 3. Floral / Foliage Shimmer & Glitter Effect (NEW FEATURE) */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1.5">
                                  <span>Shimmer &amp; Glitter Effect</span>
                                  <span className="text-[10px] font-bold text-[#15110e] capitalize">{selectedElement.shimmer || 'none'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { id: 'none', label: 'None (Matte)', icon: '⚪' },
                                    { id: 'gold-glitter', label: 'Gold Glitter', icon: '✦' },
                                    { id: 'diamond', label: 'Diamond Sparkle', icon: '✧' },
                                    { id: 'fairy-dust', label: 'Fairy Dust', icon: '✨' },
                                  ].map((sh) => (
                                    <button
                                      key={sh.id}
                                      type="button"
                                      onClick={() => {
                                        setElements((prev) =>
                                          prev.map((el) => (el.id === selectedElement.id ? { ...el, shimmer: sh.id as any } : el))
                                        );
                                      }}
                                      className={`p-1.5 rounded-lg border text-left text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                                        (selectedElement.shimmer || 'none') === sh.id
                                          ? 'bg-[#2b221a] border-[#bd9661] text-[#bd9661] font-bold ring-1 ring-[#bd9661]'
                                          : 'bg-[#1d1713] border-[#2b221a] text-[#c5b5a5] hover:bg-[#241c16]'
                                      }`}
                                    >
                                      <span className="text-xs">{sh.icon}</span>
                                      <span className="truncate">{sh.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Direct Word-Style Resize & Rotation */}
                          <div className="pt-3 border-t border-[#ede5d8] space-y-2.5">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[1.4px] text-[#8c6b3e] mb-1">
                                <span>Rotation</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] text-[#15110e] font-bold bg-white px-1.5 py-0.5 rounded border border-[#e2d8c9]">
                                    {selectedElement.rotation || 0}°
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setElements((prev) =>
                                        prev.map((el) => (el.id === selectedElement.id ? { ...el, rotation: 0 } : el))
                                      );
                                    }}
                                    className="text-[10px] font-bold text-[#8c6b3e] hover:underline cursor-pointer"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                step="5"
                                value={selectedElement.rotation || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setElements((prev) =>
                                    prev.map((el) => (el.id === selectedElement.id ? { ...el, rotation: val } : el))
                                  );
                                }}
                                className="w-full accent-[#bd9661] cursor-pointer"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 text-center space-y-3 bg-[#faf7f2] rounded-2xl border-2 border-dashed border-[#e2d8c9]">
                          <div className="w-12 h-12 rounded-full bg-white border border-[#bd9661]/40 mx-auto flex items-center justify-center text-[#96713e] shadow-2xs">
                            <SearchDocIcon className="w-6 h-6" />
                          </div>
                          <div className="font-serif text-sm font-bold text-[#15110e]">No Element Selected</div>
                          <div className="text-xs text-[#7a6b5c] leading-relaxed">
                            Click any floral, leaf, or text on the card canvas to customize colors, fonts, or drag its 4 corner handles to resize.
                          </div>
                          <button
                            type="button"
                            onClick={() => setRightCardMode('design-box')}
                            className="px-4 py-2 rounded-xl bg-[#15110e] hover:bg-[#251e18] text-[#fce4ca] hover:text-[#bd9661] text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                          >
                            <span>+</span>
                            <span>Open Design Box</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </aside>

              {/* Collapsed Right Panel Opener */}
              {isRightCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsRightCollapsed(false)}
                  className="absolute top-4 right-4 z-30 px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#dfd4c5] text-[#15110e] hover:text-[#bd9661] text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer hover:bg-[#faf7f2] backdrop-blur-md"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5 text-[#bd9661]" />
                  <span>Design Box &amp; Inspector</span>
                </button>
              )}

              {/* ============================================================= */}
              {/* FLOATING BOTTOM CONTROL BAR                                    */}
              {/* ============================================================= */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#15110e]/95 text-[#e5d8cc] border border-[#bd9661]/40 rounded-xl shadow-xl px-3 py-1.5 flex items-center gap-2 text-xs z-30 pointer-events-auto backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Zoom Out */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
                  className="px-1.5 py-0.5 rounded hover:bg-[#2b221a] font-bold text-[#bd9661] cursor-pointer"
                  title="Zoom Out"
                >
                  −
                </button>

                {/* Zoom Level Readout */}
                <span className="font-mono text-[11px] font-bold w-10 text-center text-[#fce4ca]">{zoomLevel}%</span>

                {/* Zoom In */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
                  className="px-1.5 py-0.5 rounded hover:bg-[#2b221a] font-bold text-[#bd9661] cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* Fit Screen */}
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="p-1 rounded hover:bg-[#2b221a] text-[#c5b5a5] hover:text-[#bd9661] cursor-pointer"
                  title="Fit to Screen"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>

                {/* Grid Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setGridStyle(gridStyle === 'dots' ? 'lines' : gridStyle === 'lines' ? 'blank' : 'dots');
                  }}
                  className={`p-1 rounded hover:bg-[#2b221a] transition-colors cursor-pointer ${
                    gridStyle !== 'blank' ? 'text-[#bd9661]' : 'text-gray-500'
                  }`}
                  title={`Grid mode: ${gridStyle}`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                  </svg>
                </button>

                <div className="w-px h-4 bg-[#3d3024] mx-1" />

                {/* Undo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`p-1 rounded transition-colors ${
                    historyIndex > 0 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                </button>

                {/* Redo */}
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`p-1 rounded transition-colors ${
                    historyIndex < history.length - 1 ? 'text-[#c5b5a5] hover:text-[#bd9661] hover:bg-[#2b221a] cursor-pointer' : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
                  </svg>
                </button>
              </div>

              {/* Canvas Status Indicator */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#15110e]/80 border border-[#3d3024] text-[11px] text-[#8b7b6b]">
                <span className="text-[#bd9661]">✦</span>
                <span>Equal Dual-Card Whiteboard Studio</span>
              </div>
            </div>

            {/* =============================================================== */}
            {/* 3. DIRECT FILE UPLOAD MODAL (Lottie JSON / CSS / WebM)           */}
            {/* =============================================================== */}
            {isUploadModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#15110e] border border-[#bd9661]/50 rounded-2xl shadow-2xl p-6 w-full max-w-md text-white space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-[#2b221a] pb-3">
                    <div className="flex items-center gap-2">
                      <UploadCloudIcon className="w-5 h-5 text-[#bd9661]" />
                      <h3 className="font-serif text-base font-bold text-[#bd9661]">
                        Direct Card Animation File Upload
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="text-gray-400 hover:text-white text-sm cursor-pointer p-1 rounded hover:bg-[#2b221a]"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#d9c9b8] leading-relaxed">
                    SuperAdmin can directly upload a bespoke card unboxing animation file. Supports <strong>Lottie JSON</strong>, <strong>CSS3 3D Keyframes</strong>, or <strong>WebM Alpha</strong> transparent video.
                  </p>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileDrop(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json,.css,.webm,.zip';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files[0]) handleFileDrop(files[0]);
                      };
                      input.click();
                    }}
                    className="border-2 border-dashed border-[#bd9661]/40 hover:border-[#bd9661] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer bg-[#241c16]/50 hover:bg-[#241c16] transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#15110e] border border-[#bd9661]/50 flex items-center justify-center text-[#bd9661] text-xl group-hover:scale-110 transition-transform">
                      ↑
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#fce4ca]">
                        Click to Browse or Drag Animation File
                      </div>
                      <div className="text-[11px] text-[#8b7b6b] mt-1">
                        .JSON (Lottie), .CSS, .WebM (Max 25MB)
                      </div>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="p-3 rounded-lg bg-[#241c16] border border-[#bd9661]/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span className="font-semibold text-[#fce4ca]">{uploadedFile.name}</span>
                        <span className="text-[10px] text-gray-400">({uploadedFile.size})</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#bd9661]">Active File</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ede5d8]">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#241c16] hover:bg-[#34271f] text-xs font-semibold text-[#c5b5a5] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!uploadedFile) {
                          setUploadedFile({
                            name: 'royal_gatefold_lottie.json',
                            size: '184.2 KB',
                            type: 'application/json',
                          });
                          setAnimationType('Custom Lottie: royal_gatefold_lottie.json');
                        }
                        setIsUploadModalOpen(false);
                        showToast('Animation file linked to theme', 'success');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] hover:text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Use Sample Animation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};
