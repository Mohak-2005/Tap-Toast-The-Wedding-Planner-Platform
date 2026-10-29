import React, { useState } from 'react';
import { showToast } from '../lib/state';

export interface LuxuryTheme {
  id: string;
  name: string;
  subtitle: string;
  category: 'Botanical' | 'Native Floral' | 'Midnight' | 'Coastal' | 'Vineyard';
  animationName: string;
  envelopeColor: string;
  envelopeFlapColor: string;
  linerPattern: 'magnolia-damask' | 'wattle-foliage' | 'protea-garland' | 'starlit-harbor' | 'vineyard-linen';
  sealColor: string;
  sealBorder: string;
  sealIcon: string;
  stageBg: string;
  paperName: string;
  cardBgColor: string;
  cardBorderColor: string;
  cardTextColor: string;
}

export const LUXURY_THEMES: LuxuryTheme[] = [
  {
    id: 'magnolia-gold',
    name: 'Magnolia & Gilded Frame',
    subtitle: 'White gardenia blossoms, eucalyptus foliage & double gold frame',
    category: 'Botanical',
    animationName: 'Classic 3D Top Flap Elevation',
    envelopeColor: '#201812',
    envelopeFlapColor: '#2c221a',
    linerPattern: 'magnolia-damask',
    sealColor: '#c59a58',
    sealBorder: '#f0d8a8',
    sealIcon: '👑',
    stageBg: 'radial-gradient(circle at 50% 30%, #f7f3ec 0%, #e8dec8 100%)',
    paperName: '350gsm French Vanilla Cotton',
    cardBgColor: '#f7f2e6',
    cardBorderColor: '#c59a58',
    cardTextColor: '#1e1812',
  },
  {
    id: 'native-wattle',
    name: 'Native Wattle & Protea',
    subtitle: 'Golden mimosa wattle, King Protea watercolor & raw linen',
    category: 'Native Floral',
    animationName: 'French Gatefold Double-Door Blossom',
    envelopeColor: '#17271b',
    envelopeFlapColor: '#213827',
    linerPattern: 'wattle-foliage',
    sealColor: '#3c6645',
    sealBorder: '#7bb086',
    sealIcon: '🌿',
    stageBg: 'radial-gradient(circle at 50% 30%, #f0f6f0 0%, #d8e5d9 100%)',
    paperName: 'Handmade Australian Deckled Linen',
    cardBgColor: '#273f2c',
    cardBorderColor: '#537d58',
    cardTextColor: '#ffffff',
  },
  {
    id: 'midnight-protea',
    name: 'Midnight Protea & Garland',
    subtitle: 'Dark slate charcoal, lush Protea floral border & copperplate script',
    category: 'Midnight',
    animationName: 'Velvet Ribbon Slide & Diagonal Sleeve Tilt',
    envelopeColor: '#18191c',
    envelopeFlapColor: '#23252a',
    linerPattern: 'protea-garland',
    sealColor: '#8a2337',
    sealBorder: '#e27b91',
    sealIcon: '🌹',
    stageBg: 'radial-gradient(circle at 50% 30%, #2a2d33 0%, #15171a 100%)',
    paperName: 'Matte Charcoal Slate Cardstock',
    cardBgColor: '#171921',
    cardBorderColor: '#8a2337',
    cardTextColor: '#ffffff',
  },
  {
    id: 'coastal-harbor',
    name: 'Sydney Harbor & Fairy Lights',
    subtitle: 'Glowing canopy fairy lights, harbor sunset bridge & ocean navy',
    category: 'Coastal',
    animationName: 'Pocketfold Elevation & Fairy Light Twinkle',
    envelopeColor: '#0b162c',
    envelopeFlapColor: '#122244',
    linerPattern: 'starlit-harbor',
    sealColor: '#d4af37',
    sealBorder: '#fae392',
    sealIcon: '✨',
    stageBg: 'radial-gradient(circle at 50% 30%, #1e2e4f 0%, #080d1a 100%)',
    paperName: 'Starlit Navy Iridescent Shimmer',
    cardBgColor: '#0e1c36',
    cardBorderColor: '#d6b87d',
    cardTextColor: '#ffffff',
  },
  {
    id: 'vineyard-arch',
    name: 'Hunter Valley Vineyard Arch',
    subtitle: 'Modern architectural dome arch, vineyard arbor & champagne palette',
    category: 'Vineyard',
    animationName: 'Arched Dome Lid Kinetic Snap & Slide',
    envelopeColor: '#231b14',
    envelopeFlapColor: '#30251c',
    linerPattern: 'vineyard-linen',
    sealColor: '#96784d',
    sealBorder: '#dfc194',
    sealIcon: '✦',
    stageBg: 'radial-gradient(circle at 50% 30%, #f9f6f0 0%, #e5ddcf 100%)',
    paperName: 'Curved Die-Cut Champagne Vellux',
    cardBgColor: '#2b1e16',
    cardBorderColor: '#dfc194',
    cardTextColor: '#ffffff',
  },
];

interface InvitationTemplatesSectionProps {
  selectedQaRdHousehold: string;
  setSelectedQaRdHousehold: (val: string) => void;
  selectedQaRdPalette: 'obsidian' | 'champagne' | 'merlot' | 'sage';
  setSelectedQaRdPalette: (val: 'obsidian' | 'champagne' | 'merlot' | 'sage') => void;
  onSelectView?: (view: string) => void;
}

export const InvitationTemplatesSection: React.FC<InvitationTemplatesSectionProps> = ({
  selectedQaRdHousehold,
  setSelectedQaRdHousehold,
  onSelectView,
}) => {
  // Theme & Customization States
  const [selectedThemeId, setSelectedThemeId] = useState<string>('magnolia-gold');
  const [invitationHeading, setInvitationHeading] = useState<string>('Together with their families');
  const [isFoilShimmerActive, setIsFoilShimmerActive] = useState<boolean>(true);
  const [deliveryMethod, setDeliveryMethod] = useState<'digital' | 'email' | 'print'>('digital');

  // Unboxing Sequence State (Paperless Post interactive unboxing)
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'opening' | 'opened'>('opened');

  const currentTheme = LUXURY_THEMES.find(t => t.id === selectedThemeId) || LUXURY_THEMES[0];
  const recipientName = selectedQaRdHousehold.split(' (')[0] || 'Honoured Guest';

  // Open sequence
  const executeOpenSequence = (themeId: string) => {
    setEnvelopeState('opening');
    const targetTheme = LUXURY_THEMES.find(t => t.id === themeId) || currentTheme;
    const duration = targetTheme.id === 'vineyard-arch' ? 400 : 750;

    setTimeout(() => {
      setEnvelopeState('opened');
      showToast(`💌 ${targetTheme.name} presented!`, 'success');
    }, duration);
  };

  // When clicking ANY template, immediately play from the beginning automatically!
  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    setEnvelopeState('sealed');

    setTimeout(() => {
      executeOpenSequence(themeId);
    }, 280);
  };

  // Replay sequence manually
  const handleReplaySequence = () => {
    setEnvelopeState('sealed');
    setTimeout(() => {
      executeOpenSequence(selectedThemeId);
    }, 250);
  };

  // Dynamic QR Code URL for RSVP
  const guestQueryParam = encodeURIComponent(recipientName.toLowerCase().replace(/\s+/g, '-'));
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://taptoast.demo/wedding/sophie-james?guest=${guestQueryParam}&theme=${currentTheme.id}`;

  // ==========================================================================
  // TEMPLATE 1: Magnolia & Gilded Double Frame (Image 4 Top-Left)
  // ==========================================================================
  const renderMagnoliaGoldTemplate = () => (
    <div
      className="relative w-full rounded-2xl p-6 sm:p-7 border-[2px] border-[#c59a58] text-center shadow-2xl overflow-hidden select-none bg-[#fdfbf7] text-[#1c150c]"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)' }}
    >
      <div className="absolute inset-2.5 border border-[#c59a58]/60 rounded-xl pointer-events-none" />

      {/* Top-Left Magnolia & Eucalyptus Foliage Cluster */}
      <div className="absolute -top-3 -left-3 pointer-events-none select-none z-10">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <ellipse cx="28" cy="40" rx="20" ry="10" transform="rotate(-30 28 40)" fill="#44614d" opacity="0.85" />
          <ellipse cx="45" cy="25" rx="18" ry="9" transform="rotate(-60 45 25)" fill="#5c7d67" opacity="0.9" />
          <ellipse cx="65" cy="20" rx="16" ry="8" transform="rotate(-15 65 20)" fill="#354e3d" opacity="0.8" />
          <circle cx="36" cy="36" r="16" fill="#ffffff" stroke="#e8dfd1" strokeWidth="1.5" />
          <path d="M36 20 C32 28, 32 44, 36 52 C40 44, 40 28, 36 20 Z" fill="#fffdfa" />
          <path d="M20 36 C28 32, 44 32, 52 36 C44 40, 28 40, 20 36 Z" fill="#fcf8f0" />
          <circle cx="36" cy="36" r="4.5" fill="#d4af37" />
        </svg>
      </div>

      {/* Bottom-Right Magnolia & Eucalyptus Foliage Cluster */}
      <div className="absolute -bottom-3 -right-3 pointer-events-none select-none z-10 rotate-180">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <ellipse cx="28" cy="40" rx="20" ry="10" transform="rotate(-30 28 40)" fill="#44614d" opacity="0.85" />
          <ellipse cx="45" cy="25" rx="18" ry="9" transform="rotate(-60 45 25)" fill="#5c7d67" opacity="0.9" />
          <circle cx="36" cy="36" r="16" fill="#ffffff" stroke="#e8dfd1" strokeWidth="1.5" />
          <path d="M36 20 C32 28, 32 44, 36 52 C40 44, 40 28, 36 20 Z" fill="#fffdfa" />
          <circle cx="36" cy="36" r="4.5" fill="#d4af37" />
        </svg>
      </div>

      <div className="text-[10px] tracking-[2.5px] uppercase font-serif text-[#966d29] mb-1">
        {invitationHeading.toUpperCase()}
      </div>

      <div className="my-2">
        <h2 className="font-serif italic text-3xl sm:text-4xl text-[#966d29] leading-tight font-medium">
          Sophie Taylor
        </h2>
        <div className="text-[11px] font-serif uppercase tracking-[3px] text-[#665747] my-0.5">
          AND
        </div>
        <h2 className="font-serif italic text-3xl sm:text-4xl text-[#966d29] leading-tight font-medium">
          Daniel Carter
        </h2>
      </div>

      <div className="text-[11px] font-serif text-[#665747] my-2">
        INVITE YOU TO CELEBRATE THEIR WEDDING
      </div>

      {/* Date Bar: SATURDAY | 14 | NOVEMBER 2026 */}
      <div className="flex items-center justify-center gap-3 my-2 text-[#966d29] font-serif">
        <span className="text-[11px] uppercase tracking-wider font-semibold">SATURDAY</span>
        <span className="text-gray-300">|</span>
        <span className="text-xl font-bold">14</span>
        <span className="text-gray-300">|</span>
        <span className="text-[11px] uppercase tracking-wider font-semibold">NOVEMBER 2026</span>
      </div>

      <div className="text-[11px] font-serif text-[#665747]">
        AT 4:00 PM
      </div>
      <div className="text-xs font-serif font-bold text-[#1c150c] mt-1">
        THE BOTANICAL GARDEN &bull; SYDNEY, NSW
      </div>

      <div className="flex items-center justify-center gap-2 my-2.5">
        <div className="w-10 h-[1px] bg-[#c59a58]/50" />
        <span className="text-[10px] text-[#966d29]">♥</span>
        <div className="w-10 h-[1px] bg-[#c59a58]/50" />
      </div>

      {/* Elegant QR Code Section */}
      <div className="flex flex-col items-center justify-center my-1.5 z-20 relative">
        <div className="p-1.5 rounded-xl border border-[#c59a58] shadow-xs bg-white">
          <img
            src={qrCodeUrl}
            alt="Wedding RSVP QR Code"
            className="w-16 h-16 object-contain rounded-lg"
          />
        </div>
        <div className="text-[9px] font-serif font-bold uppercase tracking-[2px] mt-1 text-[#966d29]">
          DINNER &amp; DANCING TO FOLLOW &bull; SCAN TO RSVP
        </div>
      </div>

      <div className="text-[10px] font-serif text-[#665747]">
        Presented with honour to <strong className="text-[#1c150c] font-semibold">{recipientName}</strong>
      </div>
    </div>
  );

  // ==========================================================================
  // TEMPLATE 2: Native Wattle & Protea Watercolor (Image 1 & Image 4 Top-Right)
  // ==========================================================================
  const renderNativeWattleTemplate = () => (
    <div
      className="relative w-full rounded-2xl p-6 sm:p-7 border border-[#487252]/40 text-center shadow-2xl overflow-hidden select-none bg-white text-[#152418]"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)' }}
    >
      {/* Top-Left Soft Watercolor Mimosa Wattle & Leaf Sprigs */}
      <div className="absolute top-0 left-0 pointer-events-none select-none z-10">
        <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
          <ellipse cx="30" cy="20" rx="22" ry="7" transform="rotate(35 30 20)" fill="#789c7c" opacity="0.6" />
          <ellipse cx="50" cy="35" rx="26" ry="8" transform="rotate(15 50 35)" fill="#5a805e" opacity="0.7" />
          <ellipse cx="25" cy="50" rx="24" ry="7" transform="rotate(70 25 50)" fill="#8ba88f" opacity="0.6" />
          <circle cx="25" cy="30" r="4" fill="#eed259" opacity="0.85" />
          <circle cx="32" cy="26" r="4.5" fill="#f5dc6e" opacity="0.9" />
          <circle cx="38" cy="32" r="3.5" fill="#e5c545" opacity="0.85" />
          <circle cx="45" cy="28" r="4" fill="#eed259" opacity="0.85" />
          <circle cx="52" cy="36" r="4.5" fill="#f5dc6e" opacity="0.9" />
          <circle cx="40" cy="42" r="3.5" fill="#e5c545" opacity="0.8" />
          <circle cx="28" cy="42" r="4" fill="#eed259" opacity="0.8" />
        </svg>
      </div>

      {/* Bottom-Right Watercolor Pink Protea / Waratah Floral */}
      <div className="absolute -bottom-2 -right-2 pointer-events-none select-none z-10">
        <svg width="120" height="130" viewBox="0 0 120 130" fill="none">
          <ellipse cx="80" cy="110" rx="20" ry="6" transform="rotate(-30 80 110)" fill="#5a805e" opacity="0.7" />
          <path d="M70 120 C60 90, 65 60, 75 40 C80 60, 85 90, 70 120 Z" fill="#ea8c98" opacity="0.8" />
          <path d="M60 120 C50 95, 52 70, 60 55 C68 70, 72 95, 60 120 Z" fill="#f2aab4" opacity="0.85" />
          <path d="M80 120 C75 95, 82 70, 90 55 C88 70, 85 95, 80 120 Z" fill="#de7080" opacity="0.85" />
          <path d="M70 50 L70 35 M65 58 L60 44 M75 58 L80 44" stroke="#d49444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="text-[11px] font-serif text-[#4b6551] mb-1 italic">
        Kindly join us for the wedding of
      </div>

      {/* Couple Names - Flowing Signature Cursive Script */}
      <div className="my-2">
        <h2 className="font-serif italic text-4xl sm:text-5xl text-[#17271b] leading-tight font-normal">
          Isabelle
        </h2>
        <div className="text-xs font-serif italic text-[#4b6551] my-0.5">
          and
        </div>
        <h2 className="font-serif italic text-4xl sm:text-5xl text-[#17271b] leading-tight font-normal">
          Sergio
        </h2>
      </div>

      <div className="text-xs font-serif font-semibold text-[#17271b] mt-3">
        Saturday, November 14, 2026
      </div>
      <div className="text-[11px] font-serif text-[#4b6551] mt-0.5">
        3 o&rsquo;clock in the afternoon
      </div>

      <div className="text-xs font-serif font-bold text-[#17271b] mt-3">
        The Chapel &bull; Manor Circle
      </div>
      <div className="text-[10.5px] font-serif text-[#4b6551]">
        Sanctuary Cove &bull; 4212 Queensland
      </div>

      <div className="flex items-center justify-center gap-2 my-2.5 text-xs text-[#3c6645]">
        <span>🌿</span>
        <div className="w-12 h-[1px] bg-[#487252]/30" />
        <span>🌿</span>
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center my-1.5 z-20 relative">
        <div className="p-1.5 rounded-xl border border-[#7bb086] shadow-xs bg-white">
          <img
            src={qrCodeUrl}
            alt="Wedding RSVP QR Code"
            className="w-16 h-16 object-contain rounded-lg"
          />
        </div>
        <div className="text-[9px] font-serif uppercase tracking-[1.5px] mt-1 text-[#3c6645] font-semibold">
          RECEPTION TO FOLLOW &bull; SCAN TO RSVP
        </div>
      </div>

      <div className="text-[10px] font-serif text-[#4b6551]">
        With love for <strong className="text-[#17271b] font-semibold">{recipientName}</strong>
      </div>
    </div>
  );

  // ==========================================================================
  // TEMPLATE 3: Midnight Protea & Garland (Image 2)
  // ==========================================================================
  const renderMidnightProteaTemplate = () => (
    <div
      className="relative w-full rounded-2xl p-6 sm:p-7 border border-[#444a54] text-center shadow-2xl overflow-hidden select-none bg-[#24262b] text-white"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)' }}
    >
      {/* Top Floral Garland Border */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none select-none z-10 flex items-center justify-between px-3">
        <svg className="w-full h-14" viewBox="0 0 360 50" fill="none">
          <ellipse cx="40" cy="15" rx="25" ry="8" transform="rotate(-15 40 15)" fill="#688572" opacity="0.8" />
          <ellipse cx="90" cy="20" rx="30" ry="10" transform="rotate(10 90 20)" fill="#4e6957" opacity="0.85" />
          <ellipse cx="270" cy="20" rx="30" ry="10" transform="rotate(-10 270 20)" fill="#4e6957" opacity="0.85" />
          <ellipse cx="320" cy="15" rx="25" ry="8" transform="rotate(15 320 15)" fill="#688572" opacity="0.8" />
          <circle cx="65" cy="22" r="12" fill="#d97d8b" opacity="0.85" />
          <circle cx="180" cy="14" r="14" fill="#e89ca7" opacity="0.9" />
          <circle cx="295" cy="22" r="12" fill="#d97d8b" opacity="0.85" />
        </svg>
      </div>

      {/* Bottom Floral Garland Border */}
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none select-none z-10 flex items-center justify-between px-3 rotate-180">
        <svg className="w-full h-14" viewBox="0 0 360 50" fill="none">
          <ellipse cx="60" cy="20" rx="28" ry="9" transform="rotate(10 60 20)" fill="#4e6957" opacity="0.85" />
          <ellipse cx="300" cy="20" rx="28" ry="9" transform="rotate(-10 300 20)" fill="#4e6957" opacity="0.85" />
          <circle cx="180" cy="14" r="14" fill="#e89ca7" opacity="0.9" />
        </svg>
      </div>

      <div className="pt-7 text-[9px] font-serif uppercase tracking-[3px] text-[#d6d9de] mb-1">
        YOU ARE INVITED TO
      </div>

      <div className="font-serif italic text-2xl sm:text-3xl text-[#e89ca7] font-normal leading-none my-1">
        the Wedding of
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider leading-tight text-white my-1">
        RACHEL &amp; JOHN
      </h2>

      <div className="text-[11px] font-serif uppercase tracking-widest text-[#d6d9de] mt-2">
        SATURDAY, NOVEMBER 14, 2026
      </div>
      <div className="text-[10px] font-serif text-[#aab0b8] mt-0.5">
        AT 4 O&rsquo;CLOCK IN THE EVENING
      </div>

      <div className="text-xs font-serif font-bold text-white mt-2">
        HOTEL STARLIGHT
      </div>
      <div className="text-[10.5px] font-serif text-[#aab0b8]">
        5353 ROSEWOOD ROAD &bull; NAPA, CALIFORNIA
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center my-2 z-20 relative">
        <div className="p-1.5 rounded-xl border border-white/40 shadow-md bg-white">
          <img
            src={qrCodeUrl}
            alt="Wedding RSVP QR Code"
            className="w-16 h-16 object-contain rounded-lg"
          />
        </div>
        <div className="text-[9px] font-serif italic text-[#e89ca7] mt-1">
          reception to follow &bull; scan to rsvp
        </div>
      </div>

      <div className="text-[10px] font-serif text-[#aab0b8] pb-4">
        Reserved for <strong className="text-white font-semibold">{recipientName}</strong>
      </div>
    </div>
  );

  // ==========================================================================
  // TEMPLATE 4: Sydney Harbor & Fairy Lights (Image 4 Top-Middle & Bottom-Right)
  // ==========================================================================
  const renderCoastalHarborTemplate = () => (
    <div
      className="relative w-full rounded-2xl p-6 sm:p-7 border border-[#30476e] text-center shadow-2xl overflow-hidden select-none bg-[#0a1326] text-white"
      style={{
        backgroundImage: 'linear-gradient(to bottom, #0a1326 0%, #11203d 50%, #1e345e 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Golden Canopy Fairy Lights Draped Across Top */}
      <div className="absolute top-0 inset-x-0 h-14 pointer-events-none select-none z-10">
        <svg className="w-full h-12" viewBox="0 0 360 40" fill="none">
          <path d="M0 8 Q 90 28, 180 8 Q 270 28, 360 8" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
          <circle cx="45" cy="17" r="3.5" fill="#fae392" filter="drop-shadow(0 0 4px #ffd700)" />
          <circle cx="90" cy="20" r="3.5" fill="#fae392" filter="drop-shadow(0 0 4px #ffd700)" />
          <circle cx="135" cy="17" r="3.5" fill="#fae392" filter="drop-shadow(0 0 4px #ffd700)" />
          <circle cx="225" cy="17" r="3.5" fill="#fae392" filter="drop-shadow(0 0 4px #ffd700)" />
          <circle cx="270" cy="20" r="3.5" fill="#fae392" filter="drop-shadow(0 0 4px #ffd700)" />
          <circle cx="315" cy="17" r="3.5" fill="#fae392" filter="drop-shadow(0 0 4px #ffd700)" />
        </svg>
      </div>

      {/* Sydney Opera House & Harbor Bridge Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none select-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 400 100" fill="none" preserveAspectRatio="none">
          <path d="M220 100 C250 30, 350 30, 390 100" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M40 100 L70 50 L100 100 Z" fill="#ffffff" />
          <path d="M80 100 L110 40 L140 100 Z" fill="#ffffff" />
          <path d="M120 100 L150 55 L180 100 Z" fill="#ffffff" />
        </svg>
      </div>

      <div className="pt-4 text-[9px] font-sans font-bold uppercase tracking-[3px] text-[#fae392] mb-1">
        YOU&rsquo;RE INVITED TO THE WEDDING OF
      </div>

      <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight my-1">
        Olivia &amp; James
      </h2>

      <div className="text-[10px] font-mono tracking-[3px] uppercase text-[#9ec1ee] my-1">
        LOVE &bull; FAMILY &bull; AUSTRALIA
      </div>

      <div className="flex items-center justify-center gap-3 my-2 text-[#fae392] font-serif">
        <span className="text-[11px] uppercase tracking-wider font-semibold">SAT</span>
        <span className="text-white/30">|</span>
        <span className="text-xl font-bold">28</span>
        <span className="text-white/30">|</span>
        <span className="text-[11px] uppercase tracking-wider font-semibold">NOV 2026</span>
      </div>

      <div className="text-[11px] text-[#9ec1ee]">
        AT 4:30 PM
      </div>
      <div className="text-xs font-bold text-white mt-1">
        WATSONS BAY BOUTIQUE HOTEL &bull; SYDNEY, NSW
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center my-2 z-20 relative">
        <div className="p-1.5 rounded-xl border border-[#fae392] shadow-md bg-white">
          <img
            src={qrCodeUrl}
            alt="Wedding RSVP QR Code"
            className="w-16 h-16 object-contain rounded-lg"
          />
        </div>
        <div className="text-[9px] font-sans uppercase tracking-[2px] mt-1 text-[#fae392] font-semibold">
          DINNER, DRINKS &amp; DANCING TO FOLLOW &bull; SCAN TO RSVP
        </div>
      </div>

      <div className="text-[10px] text-[#9ec1ee] pb-1">
        Delivered with love to <strong className="text-white font-semibold">{recipientName}</strong>
      </div>
    </div>
  );

  // ==========================================================================
  // TEMPLATE 5: Hunter Valley Vineyard Arch (Image 4 Bottom-Middle)
  // ==========================================================================
  const renderVineyardArchTemplate = () => (
    <div
      className="relative w-full rounded-t-[140px] rounded-b-2xl p-6 sm:p-7 border border-[#dfc194] text-center shadow-2xl overflow-hidden select-none bg-[#faf7f2] text-[#211913]"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)' }}
    >
      <div className="absolute top-2.5 inset-x-5 h-28 rounded-t-[125px] border-t border-x border-[#dfc194]/60 pointer-events-none" />

      <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-[#6e583c] opacity-80">
        <span>🌿</span>
        <span className="text-[9px] font-serif font-bold tracking-[3px] uppercase">V I N E Y A R D &bull; A R C H</span>
        <span>🌿</span>
      </div>

      <div className="text-[10px] font-serif tracking-[2px] uppercase text-[#6e583c] mt-2 mb-1">
        {invitationHeading.toUpperCase()}
      </div>

      <div className="my-1.5">
        <h2 className="font-serif italic text-4xl sm:text-5xl text-[#96784d] leading-tight font-medium">
          Charlotte
        </h2>
        <div className="text-xs font-serif italic text-[#6e583c] my-0.5">
          &amp;
        </div>
        <h2 className="font-serif italic text-4xl sm:text-5xl text-[#96784d] leading-tight font-medium">
          Benjamin
        </h2>
      </div>

      <div className="text-[11px] font-serif text-[#6e583c] my-1">
        INVITE YOU TO CELEBRATE THEIR WEDDING
      </div>

      <div className="text-xs font-serif font-bold text-[#211913] mt-2">
        SATURDAY, 14 MARCH 2026
      </div>
      <div className="text-[10.5px] font-serif text-[#6e583c]">
        AT 4:00 PM
      </div>

      <div className="text-xs font-serif font-bold text-[#211913] mt-2">
        TAMBURLAINE ORGANIC WINES
      </div>
      <div className="text-[10px] font-serif text-[#6e583c]">
        HUNTER VALLEY, NSW
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center justify-center my-2 z-20 relative">
        <div className="p-1.5 rounded-xl border border-[#dfc194] shadow-xs bg-white">
          <img
            src={qrCodeUrl}
            alt="Wedding RSVP QR Code"
            className="w-16 h-16 object-contain rounded-lg"
          />
        </div>
        <div className="text-[9px] font-serif uppercase tracking-[1.5px] mt-1 text-[#96784d] font-semibold">
          FOOD, WINE &amp; DANCING TO FOLLOW &bull; SCAN TO RSVP
        </div>
      </div>

      <div className="text-[10px] font-serif text-[#6e583c]">
        Reserved for <strong className="text-[#211913] font-semibold">{recipientName}</strong>
      </div>
    </div>
  );

  // Template switch
  const renderSelectedTemplate = () => {
    switch (currentTheme.id) {
      case 'native-wattle':
        return renderNativeWattleTemplate();
      case 'midnight-protea':
        return renderMidnightProteaTemplate();
      case 'coastal-harbor':
        return renderCoastalHarborTemplate();
      case 'vineyard-arch':
        return renderVineyardArchTemplate();
      case 'magnolia-gold':
      default:
        return renderMagnoliaGoldTemplate();
    }
  };

  // ==========================================================================
  // 5 COMPLETELY DIFFERENT ENVELOPE STRUCTURES & UNBOXING ANIMATIONS
  // ==========================================================================

  // ANIMATION 1: Classic 3D Top Flap & Gilded Elevation (Magnolia Gold)
  const renderClassicTopFlapEnvelope = () => (
    <div
      className={`relative w-full h-[320px] rounded-2xl shadow-2xl transition-all duration-700 flex flex-col justify-end overflow-visible ${
        envelopeState === 'opened' ? 'translate-y-28 scale-95 opacity-85' : 'translate-y-0 scale-100 opacity-100'
      }`}
      style={{
        backgroundColor: currentTheme.envelopeColor,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="absolute inset-x-2 top-2 h-[280px] rounded-t-xl overflow-hidden opacity-90 border-t border-white/20 bg-white">
        <div className="w-full h-full bg-[radial-gradient(#c59a58_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40" />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[190px] sm:border-l-[220px] border-b-[180px] border-l-transparent" style={{ borderBottomColor: currentTheme.envelopeFlapColor, opacity: 0.95 }} />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[190px] sm:border-r-[220px] border-b-[180px] border-r-transparent" style={{ borderBottomColor: currentTheme.envelopeFlapColor, opacity: 0.95 }} />
        <div className="absolute bottom-0 inset-x-0 h-0 border-x-[190px] sm:border-x-[220px] border-b-[160px] border-x-transparent" style={{ borderBottomColor: currentTheme.envelopeColor }} />
      </div>

      <div
        className={`absolute top-0 inset-x-0 h-[170px] z-30 transition-transform duration-700 origin-top ${
          envelopeState === 'sealed' ? 'rotate-x-0' : '-rotate-x-180'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="w-0 h-0 border-x-[195px] sm:border-x-[225px] border-t-[160px] border-x-transparent mx-auto relative drop-shadow-md"
          style={{ borderTopColor: currentTheme.envelopeFlapColor }}
        >
          {envelopeState === 'sealed' && (
            <button
              type="button"
              onClick={() => executeOpenSequence(selectedThemeId)}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-transform hover:scale-110 active:scale-95 group pointer-events-auto"
              style={{
                backgroundColor: currentTheme.sealColor,
                border: `3px solid ${currentTheme.sealBorder}`,
                boxShadow: `0 8px 24px ${currentTheme.sealColor}99, inset 0 2px 4px rgba(255,255,255,0.4)`,
              }}
              title="Click wax seal to open invitation"
            >
              <span className="text-sm drop-shadow-xs group-hover:scale-110 transition-transform">{currentTheme.sealIcon}</span>
              <span className="text-[7.5px] font-bold text-white tracking-widest font-serif leading-none mt-0.5">S &bull; D</span>
              <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold tracking-wider uppercase text-[#15110e] bg-white/95 px-2 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Tap to Open
              </span>
            </button>
          )}
        </div>
      </div>

      {envelopeState === 'sealed' && (
        <div className="absolute inset-x-8 bottom-6 z-25 text-center pointer-events-none space-y-1">
          <div className="text-[9.5px] uppercase font-bold tracking-[2.5px] opacity-90 font-serif" style={{ color: currentTheme.sealBorder }}>
            DELIVERED WITH HONOUR TO
          </div>
          <div className="font-serif text-lg font-bold text-white tracking-wide">{recipientName}</div>
          <div className="text-[10px] text-white/70 italic">The Botanical Garden &bull; Sydney, NSW</div>
        </div>
      )}
    </div>
  );

  // ANIMATION 2: French Gatefold Double-Door Blossom (Native Wattle & Protea)
  const renderGatefoldEnvelope = () => (
    <div
      className={`relative w-full h-[320px] rounded-2xl shadow-2xl transition-all duration-700 flex flex-col justify-center overflow-visible ${
        envelopeState === 'opened' ? 'translate-y-28 scale-95 opacity-85' : 'translate-y-0 scale-100 opacity-100'
      }`}
      style={{
        backgroundColor: currentTheme.envelopeColor,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        perspective: '1200px',
      }}
    >
      <div className="absolute inset-2 rounded-xl overflow-hidden bg-[#fafcf9] border border-[#7bb086]/30 flex items-center justify-center">
        <span className="text-5xl opacity-20">🌿 🕊️ 🌿</span>
      </div>

      {/* Left Door */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 z-25 rounded-l-2xl border-r border-[#7bb086]/40 transition-transform duration-700 origin-left shadow-lg ${
          envelopeState === 'sealed' ? 'rotate-y-0' : '-rotate-y-120 opacity-70'
        }`}
        style={{
          backgroundColor: currentTheme.envelopeFlapColor,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-3 border border-dashed border-[#7bb086]/30 rounded-l-xl pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-xs opacity-60">🌿</div>
      </div>

      {/* Right Door */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 z-25 rounded-r-2xl border-l border-[#7bb086]/40 transition-transform duration-700 origin-right shadow-lg ${
          envelopeState === 'sealed' ? 'rotate-y-0' : 'rotate-y-120 opacity-70'
        }`}
        style={{
          backgroundColor: currentTheme.envelopeFlapColor,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-3 border border-dashed border-[#7bb086]/30 rounded-r-xl pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-xs opacity-60">🌿</div>
      </div>

      {/* Center Wax Seal */}
      {envelopeState === 'sealed' && (
        <button
          type="button"
          onClick={() => executeOpenSequence(selectedThemeId)}
          className="absolute z-35 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-transform hover:scale-110 active:scale-95 group pointer-events-auto"
          style={{
            backgroundColor: currentTheme.sealColor,
            border: `3px solid ${currentTheme.sealBorder}`,
            boxShadow: `0 8px 24px ${currentTheme.sealColor}99, inset 0 2px 4px rgba(255,255,255,0.4)`,
          }}
          title="Click to unfold botanical French doors"
        >
          <span className="text-sm drop-shadow-xs group-hover:scale-110 transition-transform">🌿</span>
          <span className="text-[7.5px] font-bold text-white tracking-widest font-serif leading-none mt-0.5">I &bull; S</span>
          <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold tracking-wider uppercase text-[#15110e] bg-white/95 px-2 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Open Doors
          </span>
        </button>
      )}

      {envelopeState === 'sealed' && (
        <div className="absolute inset-x-8 bottom-3 z-30 text-center pointer-events-none space-y-0.5">
          <div className="font-serif text-sm font-bold text-white tracking-wide">{recipientName}</div>
          <div className="text-[9.5px] text-white/70 italic">Sanctuary Cove &bull; Queensland</div>
        </div>
      )}
    </div>
  );

  // ANIMATION 3: Velvet Ribbon Slide & Diagonal Sleeve Tilt (Midnight Protea)
  const renderRibbonSleeveEnvelope = () => (
    <div
      className={`relative w-full h-[320px] rounded-2xl shadow-2xl transition-all duration-700 flex flex-col justify-center overflow-visible ${
        envelopeState === 'opened' ? 'translate-y-28 scale-95 opacity-85' : 'translate-y-0 scale-100 opacity-100'
      }`}
      style={{
        backgroundColor: currentTheme.envelopeColor,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}
    >
      <div className="absolute inset-2 rounded-xl bg-[#2b2e35] border border-white/10 flex items-center justify-center">
        <div className="text-center space-y-1 opacity-40">
          <div className="text-sm">🌹</div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-white">MIDNIGHT EDITION</div>
        </div>
      </div>

      {/* Horizontal Ribbon */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 z-25 shadow-xl transition-all duration-700 flex items-center justify-between px-6 ${
          envelopeState === 'sealed' ? 'translate-y-0 opacity-100' : 'translate-y-36 opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: '#3e131d',
          borderTop: '2px solid #e27b91',
          borderBottom: '2px solid #e27b91',
        }}
      >
        <span className="text-[9px] font-serif uppercase tracking-[2px] text-[#e89ca7] font-bold">R &amp; J</span>
        <span className="text-[9px] font-serif uppercase tracking-[2px] text-[#e89ca7] font-bold">NAPA 2026</span>
      </div>

      {envelopeState === 'sealed' && (
        <button
          type="button"
          onClick={() => executeOpenSequence(selectedThemeId)}
          className="absolute z-35 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-transform hover:scale-110 active:scale-95 group pointer-events-auto"
          style={{
            backgroundColor: currentTheme.sealColor,
            border: `3px solid ${currentTheme.sealBorder}`,
            boxShadow: `0 8px 24px ${currentTheme.sealColor}99, inset 0 2px 4px rgba(255,255,255,0.4)`,
          }}
          title="Click to release velvet ribbon"
        >
          <span className="text-sm drop-shadow-xs group-hover:scale-110 transition-transform">🌹</span>
          <span className="text-[7.5px] font-bold text-white tracking-widest font-serif leading-none mt-0.5">R &bull; J</span>
          <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold tracking-wider uppercase text-[#15110e] bg-white/95 px-2 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Release Ribbon
          </span>
        </button>
      )}

      {envelopeState === 'sealed' && (
        <div className="absolute inset-x-8 bottom-3 z-30 text-center pointer-events-none space-y-0.5">
          <div className="font-serif text-sm font-bold text-white tracking-wide">{recipientName}</div>
          <div className="text-[9.5px] text-[#e89ca7] italic">Hotel Starlight &bull; Napa, CA</div>
        </div>
      )}
    </div>
  );

  // ANIMATION 4: Pocketfold Elevation & Fairy Light Twinkle (Coastal Harbor)
  const renderPocketfoldEnvelope = () => (
    <div
      className={`relative w-full h-[320px] rounded-2xl shadow-2xl transition-all duration-700 flex flex-col justify-end overflow-visible ${
        envelopeState === 'opened' ? 'translate-y-28 scale-95 opacity-85' : 'translate-y-0 scale-100 opacity-100'
      }`}
      style={{
        backgroundColor: currentTheme.envelopeColor,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}
    >
      <div className="absolute inset-x-2 top-2 h-[280px] rounded-t-xl overflow-hidden opacity-90 border-t border-white/20 bg-[#070e1c]">
        <div className="w-full h-full bg-[radial-gradient(#fae392_1px,transparent_1px)] [background-size:14px_14px] opacity-40" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 z-20 rounded-b-2xl border-t-2 border-[#d4af37]/60 pointer-events-none" style={{ backgroundColor: currentTheme.envelopeFlapColor }}>
        <div className="absolute top-2 inset-x-0 flex items-center justify-center gap-1.5 text-xs text-[#fae392]">
          <span>✨</span>
          <span className="text-[9px] font-mono tracking-widest uppercase">SYDNEY HARBOUR POCKETFOLD</span>
          <span>✨</span>
        </div>
      </div>

      {/* Top Scalloped Flap with Fairy Light String on Rim */}
      <div
        className={`absolute top-0 inset-x-0 h-[160px] z-30 transition-transform duration-1000 origin-top rounded-t-2xl ${
          envelopeState === 'sealed' ? 'rotate-x-0' : '-rotate-x-180'
        }`}
        style={{
          backgroundColor: currentTheme.envelopeColor,
          transformStyle: 'preserve-3d',
          borderBottom: '2px solid #d4af37',
        }}
      >
        <div className="absolute bottom-1 inset-x-4 flex justify-between">
          <span className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[#fae392] shadow-[0_0_8px_#ffd700]" />
          <span className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[#fae392] shadow-[0_0_8px_#ffd700]" />
          <span className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] animate-pulse" />
        </div>

        {envelopeState === 'sealed' && (
          <button
            type="button"
            onClick={() => executeOpenSequence(selectedThemeId)}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-transform hover:scale-110 active:scale-95 group pointer-events-auto"
            style={{
              backgroundColor: currentTheme.sealColor,
              border: `3px solid ${currentTheme.sealBorder}`,
              boxShadow: `0 8px 24px ${currentTheme.sealColor}99, inset 0 2px 4px rgba(255,255,255,0.4)`,
            }}
            title="Click to illuminate fairy lights & open"
          >
            <span className="text-sm drop-shadow-xs group-hover:scale-110 transition-transform">✨</span>
            <span className="text-[7.5px] font-bold text-white tracking-widest font-serif leading-none mt-0.5">O &bull; J</span>
            <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold tracking-wider uppercase text-[#15110e] bg-white/95 px-2 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Illuminate
            </span>
          </button>
        )}
      </div>

      {envelopeState === 'sealed' && (
        <div className="absolute inset-x-8 bottom-4 z-25 text-center pointer-events-none space-y-0.5">
          <div className="font-serif text-sm font-bold text-white tracking-wide">{recipientName}</div>
          <div className="text-[9.5px] text-[#fae392] italic">Watsons Bay &bull; Sydney, NSW</div>
        </div>
      )}
    </div>
  );

  // ANIMATION 5: Arched Dome Lid Kinetic Snap & Slide (Hunter Valley Vineyard)
  const renderArchedDomeEnvelope = () => (
    <div
      className={`relative w-full h-[320px] rounded-t-[140px] rounded-b-2xl shadow-2xl transition-all duration-500 flex flex-col justify-end overflow-visible ${
        envelopeState === 'opened' ? 'translate-y-28 scale-95 opacity-85' : 'translate-y-0 scale-100 opacity-100'
      }`}
      style={{
        backgroundColor: currentTheme.envelopeColor,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="absolute inset-x-2 top-2 h-[280px] rounded-t-[130px] overflow-hidden opacity-90 border-t border-white/20 bg-[#faf7f2]">
        <div className="w-full h-full bg-[linear-gradient(45deg,#dfc194_25%,transparent_25%),linear-gradient(-45deg,#dfc194_25%,transparent_25%)] [background-size:24px_24px] opacity-20" />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none rounded-b-2xl overflow-hidden">
        <div className="absolute bottom-0 inset-x-0 h-44 rounded-t-3xl border-t-2 border-[#dfc194]/50" style={{ backgroundColor: currentTheme.envelopeFlapColor }}>
          <div className="pt-2 text-center text-[8.5px] font-mono tracking-widest text-[#dfc194] uppercase font-bold">
            ARCHITECTURAL DOME SERIES
          </div>
        </div>
      </div>

      {/* Rounded Arched Dome Lid */}
      <div
        className={`absolute top-0 inset-x-0 h-[140px] rounded-t-[140px] z-30 transition-transform duration-400 ease-out origin-top ${
          envelopeState === 'sealed' ? 'rotate-x-0' : '-rotate-x-180'
        }`}
        style={{
          backgroundColor: currentTheme.envelopeColor,
          transformStyle: 'preserve-3d',
          borderBottom: '2px solid #dfc194',
        }}
      >
        {envelopeState === 'sealed' && (
          <button
            type="button"
            onClick={() => executeOpenSequence(selectedThemeId)}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-transform hover:scale-110 active:scale-95 group pointer-events-auto"
            style={{
              backgroundColor: currentTheme.sealColor,
              border: `3px solid ${currentTheme.sealBorder}`,
              boxShadow: `0 8px 24px ${currentTheme.sealColor}99, inset 0 2px 4px rgba(255,255,255,0.4)`,
            }}
            title="Click to snap open architectural dome"
          >
            <span className="text-sm drop-shadow-xs group-hover:scale-110 transition-transform">✦</span>
            <span className="text-[7.5px] font-bold text-white tracking-widest font-serif leading-none mt-0.5">C &bull; B</span>
            <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold tracking-wider uppercase text-[#15110e] bg-white/95 px-2 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Snap Open
            </span>
          </button>
        )}
      </div>

      {envelopeState === 'sealed' && (
        <div className="absolute inset-x-8 bottom-4 z-25 text-center pointer-events-none space-y-0.5">
          <div className="font-serif text-sm font-bold text-white tracking-wide">{recipientName}</div>
          <div className="text-[9.5px] text-[#dfc194] italic">Hunter Valley &bull; NSW</div>
        </div>
      )}
    </div>
  );

  const renderEnvelopeAnimation = () => {
    switch (currentTheme.id) {
      case 'native-wattle':
        return renderGatefoldEnvelope();
      case 'midnight-protea':
        return renderRibbonSleeveEnvelope();
      case 'coastal-harbor':
        return renderPocketfoldEnvelope();
      case 'vineyard-arch':
        return renderArchedDomeEnvelope();
      case 'magnolia-gold':
      default:
        return renderClassicTopFlapEnvelope();
    }
  };

  const getCardTransitionMotion = () => {
    switch (currentTheme.id) {
      case 'native-wattle':
        return envelopeState === 'opened'
          ? 'relative -mt-64 scale-100 translate-y-0 rotate-0 opacity-100'
          : 'absolute top-10 scale-85 translate-y-8 -rotate-1 opacity-0 pointer-events-none';
      case 'midnight-protea':
        return envelopeState === 'opened'
          ? 'relative -mt-64 scale-100 translate-y-0 rotate-0 opacity-100'
          : 'absolute top-10 scale-90 translate-y-12 rotate-[-2deg] opacity-0 pointer-events-none';
      case 'coastal-harbor':
        return envelopeState === 'opened'
          ? 'relative -mt-64 scale-100 translate-y-0 opacity-100'
          : 'absolute top-10 scale-80 translate-y-10 opacity-0 pointer-events-none';
      case 'vineyard-arch':
        return envelopeState === 'opened'
          ? 'relative -mt-64 scale-100 translate-y-0 opacity-100'
          : 'absolute top-10 scale-95 translate-y-6 opacity-0 pointer-events-none';
      case 'magnolia-gold':
      default:
        return envelopeState === 'opened'
          ? 'relative -mt-64 scale-100 translate-y-0 opacity-100'
          : 'absolute top-10 scale-90 translate-y-8 opacity-0 pointer-events-none';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e8ded0]">
        <div>
          <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
            DIGITAL &amp; PHYSICAL INVITATION SUITE
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#15110e]">
            Invitation Design Studio
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => showToast('Generated high-resolution printable PDF invitation with QR & bleed marks', 'success')}
            className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>📄</span> Export PDF
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSelectView) onSelectView('guest-mobile');
              showToast('Previewing guest mobile hub view', 'info');
            }}
            className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>📱</span> Mobile View
          </button>
        </div>
      </div>

      {/* Main Workspace: Personalization & RSVP with 5 Theme Cards on Left, Hero Animation Stage on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Personalization & RSVP with Theme Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">

          <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-[#f0ede4] pb-2 flex items-center justify-between">
              <label className="text-[10.5px] font-bold text-[#8b7b6b] uppercase tracking-wider">
                PERSONALIZATION &amp; RSVP
              </label>
              <span className="text-[10px] text-[#bd9661] font-semibold">
                Email Invitation
              </span>
            </div>

            {/* 1. SELECT INVITATION THEME (5 Cards inside Personalization & RSVP, each matching template color) */}
            <div>
              <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-2">
                SELECT WEDDING INVITATION THEME
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LUXURY_THEMES.map((theme, idx) => {
                  const isSelected = selectedThemeId === theme.id;
                  const isFullWidth = idx === 4;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      style={{
                        backgroundColor: theme.cardBgColor,
                        borderColor: isSelected ? '#bd9661' : theme.cardBorderColor,
                        color: theme.cardTextColor,
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex items-center justify-between shadow-xs active:scale-95 ${
                        isFullWidth ? 'sm:col-span-2' : ''
                      } ${
                        isSelected
                          ? 'ring-2 ring-[#bd9661] ring-offset-1 shadow-md scale-[1.01]'
                          : 'opacity-90 hover:opacity-100 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-1">
                        <span className="text-base shrink-0">{theme.sealIcon}</span>
                        <div className="truncate">
                          <div className="font-serif font-bold text-xs truncate leading-snug">
                            {theme.name}
                          </div>
                          <div className="text-[9px] opacity-75 font-semibold truncate">
                            {theme.category}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#bd9661] text-[#15110e] flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DELIVER TO GUEST / HOUSEHOLD */}
            <div>
              <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1.5">
                DELIVER TO GUEST / HOUSEHOLD
              </label>
              <select
                value={selectedQaRdHousehold}
                onChange={(e) => setSelectedQaRdHousehold(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl p-2.5 text-xs text-[#15110e] font-semibold outline-none focus:border-[#bd9661] cursor-pointer"
              >
                <optgroup label="Families &amp; Households">
                  <option value="The Sharma Family (4 Guests)">The Sharma Family (4 Guests)</option>
                  <option value="The Whitfield Family (3 Guests)">The Whitfield Family (3 Guests)</option>
                  <option value="The Chen Household (2 Guests)">The Chen Household (2 Guests)</option>
                  <option value="The Taylor Family (4 Guests)">The Taylor Family (4 Guests)</option>
                  <option value="The Galati Family (VIP Household)">The Galati Family (VIP Household)</option>
                </optgroup>
                <optgroup label="Individual Guests">
                  <option value="Priya Sharma">Priya Sharma</option>
                  <option value="Hannah Martin">Hannah Martin</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="Sarah Chen">Sarah Chen</option>
                  <option value="Uncle David">Uncle David</option>
                  <option value="Aunt Carol">Aunt Carol</option>
                  <option value="Marcus Vance">Marcus Vance</option>
                  <option value="Olivia Smith">Olivia Smith</option>
                </optgroup>
              </select>
            </div>

            {/* 3. INVITATION OPENING PHRASE / CUSTOM MESSAGE (Manual Textbox) */}
            <div>
              <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1.5">
                INVITATION OPENING PHRASE / CUSTOM MESSAGE
              </label>
              <textarea
                rows={3}
                value={invitationHeading}
                onChange={(e) => setInvitationHeading(e.target.value)}
                placeholder="Write your custom invitation message or greeting here..."
                className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none leading-relaxed"
              />
            </div>

            {/* 4. FOIL SHIMMER SHEEN */}
            <div className="pt-2 border-t border-[#f0ede4] flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#15110e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFoilShimmerActive}
                  onChange={(e) => setIsFoilShimmerActive(e.target.checked)}
                  className="accent-[#bd9661] w-4 h-4 cursor-pointer"
                />
                <span>✨ Metallic Foil Shimmer Sheen</span>
              </label>
            </div>

            {/* 5. SEND INVITATION VIA EMAIL */}
            <div className="pt-3 border-t border-[#f0ede4]">
              <button
                type="button"
                onClick={() => {
                  showToast(`💌 Invitation dispatched to ${recipientName} via Email with live RSVP QR!`, 'success');
                }}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-serif font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>✉️</span>
                <span>Send Invitation to {recipientName.split(' ')[0] || 'Guest'} (Email)</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The Interactive Hero Presentation Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">

          {/* Clean Integrated Stage Header Bar: Centered Template Name & Replay Icon on Right */}
          <div className="w-full max-w-lg relative flex items-center justify-center pb-2 mb-2">
            <div className="font-serif font-bold text-sm text-[#15110e] tracking-wide text-center">
              {currentTheme.name}
            </div>

            <button
              type="button"
              onClick={handleReplaySequence}
              className="absolute right-0 w-8 h-8 rounded-full border border-[#d5c7b5] bg-white hover:bg-[#faf8f5] hover:border-[#bd9661] text-[#15110e] hover:text-[#bd9661] transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-90"
              title="Replay Unboxing Animation"
              aria-label="Replay Unboxing Sequence"
            >
              <span className="text-sm">↺</span>
            </button>
          </div>

          {/* THE HERO ANIMATION STAGE CONTAINER */}
          <div
            className="w-full max-w-lg min-h-[580px] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative shadow-xl overflow-hidden border border-[#d5c7b5]/60 transition-all duration-700"
            style={{
              background: currentTheme.stageBg,
              perspective: '1200px',
            }}
          >
            {/* Ambient Lighting Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/30 pointer-events-none" />

            <div className="relative w-full max-w-md flex flex-col items-center select-none">

              {/* The Dedicated Envelope Structure & Animation for this Theme */}
              {renderEnvelopeAnimation()}

              {/* THE INVITATION CARD (EXTRACTS OUT ACCORDING TO UNIQUE MOTION) */}
              <div
                className={`w-full max-w-[370px] sm:max-w-[400px] transition-all duration-700 ease-out z-40 ${getCardTransitionMotion()}`}
              >
                {renderSelectedTemplate()}
              </div>

              {/* Open Instruction Pill (Only shown if user manually leaves it sealed) */}
              {envelopeState === 'sealed' && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => executeOpenSequence(selectedThemeId)}
                    className="bg-[#15110e] text-[#dfc194] border border-[#bd9661] px-5 py-2 rounded-full font-serif font-bold text-xs shadow-lg cursor-pointer flex items-center gap-2 hover:bg-[#251e18] hover:scale-105 transition-all"
                  >
                    <span>✉️</span>
                    <span>Click Wax Seal to Open</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
