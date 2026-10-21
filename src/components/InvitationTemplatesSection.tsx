import React, { useState } from 'react';
import { showToast } from '../lib/state';

export interface InvitationTemplate {
  id: string;
  name: string;
  tagline: string;
  category: 'Regal' | 'Minimal' | 'Nature' | 'Vintage';
  primaryBg: string;
  accentColor: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  isDark: boolean;
  fontFamily: string;
  foilType: 'gold' | 'rosegold' | 'silver' | 'bronze';
  description: string;
}

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'royal-gold',
    name: 'Royal Gold & Baroque',
    tagline: 'Imperial gold filigree & ornate royal crests',
    category: 'Regal',
    primaryBg: '#15110e',
    accentColor: '#dfc194',
    textColor: '#ffffff',
    subtextColor: '#d9cbb8',
    borderColor: '#bd9661',
    isDark: true,
    fontFamily: 'font-serif',
    foilType: 'gold',
    description: 'Dual 24k gold filigree borders with royal crown monogram and Bodoni italic accents.',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal Arch',
    tagline: 'Curved architectural arch & crisp editorial type',
    category: 'Minimal',
    primaryBg: '#fcfaf7',
    accentColor: '#916c3d',
    textColor: '#15110e',
    subtextColor: '#5a4d41',
    borderColor: '#cbb89d',
    isDark: false,
    fontFamily: 'font-sans',
    foilType: 'gold',
    description: 'Scandinavian curved arch silhouette, airy negative space and high-contrast charcoal typography.',
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Sage & Olive',
    tagline: 'Delicate eucalyptus wreath & forest olive palette',
    category: 'Nature',
    primaryBg: '#1a261e',
    accentColor: '#b4cca0',
    textColor: '#f7faf5',
    subtextColor: '#d0ded0',
    borderColor: '#6f8a6b',
    isDark: true,
    fontFamily: 'font-serif',
    foilType: 'gold',
    description: 'Hand-drawn leafy laurel wreath, eucalyptus corner sprigs, and forest velvet tones.',
  },
  {
    id: 'art-deco',
    name: 'Art Deco 1920s Gatsby',
    tagline: 'Geometric chevrons & roaring twenties sunburst',
    category: 'Vintage',
    primaryBg: '#0b0e14',
    accentColor: '#dfc194',
    textColor: '#ffffff',
    subtextColor: '#c9bca4',
    borderColor: '#bd9661',
    isDark: true,
    fontFamily: 'font-serif',
    foilType: 'gold',
    description: 'Stepped chevron geometric corner angles and Chrysler-era radiating sunburst crest.',
  },
  {
    id: 'rustic-kraft',
    name: 'Rustic Kraft & Wax Seal',
    tagline: 'Handmade deckle edge, vintage twine & wax seal',
    category: 'Vintage',
    primaryBg: '#f6f1e8',
    accentColor: '#8c6239',
    textColor: '#24160d',
    subtextColor: '#5c4738',
    borderColor: '#b89f88',
    isDark: false,
    fontFamily: 'font-serif',
    foilType: 'bronze',
    description: 'Textured handmade parchment with crimson wax seal medallion and dashed saddle-stitch border.',
  },
  {
    id: 'celestial-midnight',
    name: 'Celestial Midnight Navy',
    tagline: 'Starlit constellations & deep cosmic galaxy',
    category: 'Regal',
    primaryBg: '#070d20',
    accentColor: '#fce082',
    textColor: '#ffffff',
    subtextColor: '#b0c8e8',
    borderColor: '#738db5',
    isDark: true,
    fontFamily: 'font-serif',
    foilType: 'silver',
    description: 'Deep midnight star map backdrop with constellation coordinates and star sparkle motifs.',
  },
  {
    id: 'boho-terracotta',
    name: 'Boho Terracotta & Palm',
    tagline: 'Sun-drenched desert terracotta & dried pampas',
    category: 'Nature',
    primaryBg: '#3a1914',
    accentColor: '#e59b77',
    textColor: '#fcf5f0',
    subtextColor: '#e0c2b2',
    borderColor: '#c0795c',
    isDark: true,
    fontFamily: 'font-sans',
    foilType: 'rosegold',
    description: 'Earthy Tuscan terracotta warmth, bohemian sun arch curves, and dried fan palm illustrations.',
  },
  {
    id: 'timeless-heritage',
    name: 'Timeless Heritage Monogram',
    tagline: 'Blind embossed crest & couture high-fashion',
    category: 'Minimal',
    primaryBg: '#ffffff',
    accentColor: '#bd9661',
    textColor: '#111111',
    subtextColor: '#555555',
    borderColor: '#d5ccc2',
    isDark: false,
    fontFamily: 'font-serif',
    foilType: 'gold',
    description: 'Blind debossed double hairline frame with interlocking couture monogram and high-contrast Didot type.',
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
  selectedQaRdPalette,
  setSelectedQaRdPalette,
  onSelectView,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customFoil, setCustomFoil] = useState<'gold' | 'rosegold' | 'silver' | 'bronze'>('gold');
  const [invitationHeading, setInvitationHeading] = useState<string>('Together with their families');
  const [isFoilShimmerActive, setIsFoilShimmerActive] = useState<boolean>(true);

  const currentTemplate = INVITATION_TEMPLATES[currentIndex];

  const handlePrevTemplate = () => {
    const nextIdx = currentIndex === 0 ? INVITATION_TEMPLATES.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIdx);
    setCustomFoil(INVITATION_TEMPLATES[nextIdx].foilType);
  };

  const handleNextTemplate = () => {
    const nextIdx = currentIndex === INVITATION_TEMPLATES.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIdx);
    setCustomFoil(INVITATION_TEMPLATES[nextIdx].foilType);
  };

  // Determine if the current card finish has a light or dark background
  const isLightBackground = () => {
    if (selectedQaRdPalette === 'champagne') return true;
    if (selectedQaRdPalette === 'merlot' || selectedQaRdPalette === 'sage') return false;
    // For 'obsidian' (Template Default), check current template's intrinsic tone
    return !currentTemplate.isDark;
  };

  const isLight = isLightBackground();

  // Dynamic card background based on selected card finish & palette
  const getCardBg = () => {
    if (selectedQaRdPalette === 'champagne') return '#faf6f0';
    if (selectedQaRdPalette === 'merlot') return '#2b1016';
    if (selectedQaRdPalette === 'sage') return '#152219';
    return currentTemplate.primaryBg;
  };

  // Primary text color (Sophie & James, primary labels) based on palette and finish
  const getEffectiveTextColor = () => {
    if (selectedQaRdPalette === 'champagne') return '#15110e'; // Rich obsidian ink
    if (selectedQaRdPalette === 'merlot') return '#fff8f2'; // Pearlescent ivory
    if (selectedQaRdPalette === 'sage') return '#f5faf6'; // Crisp botanical white
    // Obsidian / Template Default:
    return currentTemplate.isDark ? '#ffffff' : currentTemplate.textColor;
  };

  // Secondary subtext color (invitation phrases, locations, dates notes)
  const getEffectiveSubtextColor = () => {
    if (selectedQaRdPalette === 'champagne') return '#5a4d41'; // Warm mocha / espresso
    if (selectedQaRdPalette === 'merlot') return '#e2cec5'; // Soft blush champagne
    if (selectedQaRdPalette === 'sage') return '#c4d6c7'; // Soft eucalyptus sage
    // Obsidian / Template Default:
    return currentTemplate.subtextColor;
  };

  // Dynamic foil accents: Automatically adjusts tone for maximum contrast and legibility
  // On light backgrounds: Uses deep, burnished, rich metallic tones (e.g. slate platinum, deep gold)
  // On dark backgrounds: Uses bright, luminous, radiant metallic tones
  const getEffectiveFoil = () => {
    if (isLight) {
      const lightFoils: Record<string, { text: string; border: string }> = {
        gold: {
          text: '#946e33', // Deep burnished 24K gold
          border: '#bd9661',
        },
        rosegold: {
          text: '#a64d5e', // Deep rose bronze
          border: '#c47985',
        },
        silver: {
          text: '#374151', // Deep slate platinum (crisp & high-contrast on ivory/white)
          border: '#64748b',
        },
        bronze: {
          text: '#85471c', // Deep rich antique bronze
          border: '#b36932',
        },
      };
      return lightFoils[customFoil];
    } else {
      const darkFoils: Record<string, { text: string; border: string }> = {
        gold: {
          text: '#dfc194', // Luminous champagne gold
          border: '#bd9661',
        },
        rosegold: {
          text: '#f4c2c2', // Radiant luminous rose
          border: '#d48b8b',
        },
        silver: {
          text: '#e6eef5', // Radiant silver platinum
          border: '#9cb2c9',
        },
        bronze: {
          text: '#e5a663', // Radiant warm bronze
          border: '#cd7f32',
        },
      };
      return darkFoils[customFoil];
    }
  };

  const cardBg = getCardBg();
  const textColor = getEffectiveTextColor();
  const subtextColor = getEffectiveSubtextColor();
  const activeFoil = getEffectiveFoil();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
            DIGITAL &amp; PHYSICAL INVITATION SUITE
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#15110e]">
            Invitation Design Studio
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onSelectView) onSelectView('guest-mobile');
              showToast('Simulating guest scanning QaRd...', 'info');
            }}
            className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> Preview Guest Mobile
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Customization Controls (5 cols) - Starts directly from PREVIEW FOR GUEST HOUSEHOLD */}
        <div className="lg:col-span-5 bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-5">
          {/* Household Selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1.5">
              PREVIEW FOR GUEST HOUSEHOLD
            </label>
            <select
              value={selectedQaRdHousehold}
              onChange={(e) => setSelectedQaRdHousehold(e.target.value)}
              className="w-full bg-white border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
            >
              <option value="Priya Sharma (The Sharma Family)">Priya Sharma (The Sharma Family)</option>
              <option value="Hannah Martin">Hannah Martin (Solo)</option>
              <option value="The Whitfield family">The Whitfield family (4 Guests)</option>
              <option value="Michael & Sarah Chen">Michael &amp; Sarah Chen (Couple)</option>
            </select>
          </div>

          {/* Metallic Foil Finish Selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-2">
              METALLIC FOIL EMBOSSING
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'gold', name: '24K Gold', color: '#bd9661' },
                { id: 'rosegold', name: 'Rose Gold', color: '#d48b8b' },
                { id: 'silver', name: 'Platinum', color: '#a6a6a6' },
                { id: 'bronze', name: 'Bronze', color: '#cd7f32' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCustomFoil(f.id as any)}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    customFoil === f.id
                      ? 'border-2 border-[#15110e] bg-[#faf8f5] shadow-xs'
                      : 'border-[#e8ded0] hover:bg-[#faf8f5]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shadow-xs border border-white"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="text-[10px] font-bold text-[#15110e]">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Tint Override */}
          <div>
            <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-2">
              CARD FINISH &amp; PALETTE
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'obsidian', title: 'Obsidian Noir', sub: 'Template Default', bg: currentTemplate.primaryBg, text: currentTemplate.isDark ? '#ffffff' : '#15110e' },
                { id: 'champagne', title: 'Champagne Ivory', sub: 'Warm Cream Silk', bg: '#faf6f0', text: '#15110e' },
                { id: 'merlot', title: 'Burgundy Merlot', sub: 'Rich Wine Velvet', bg: '#2b1016', text: '#ffffff' },
                { id: 'sage', title: 'Botanical Sage', sub: 'Forest Olive Tint', bg: '#152219', text: '#ffffff' },
              ].map((pal) => (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setSelectedQaRdPalette(pal.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedQaRdPalette === pal.id ? 'border-2 border-[#bd9661] shadow-xs' : 'border-[#e8ded0]'
                  }`}
                  style={{ backgroundColor: pal.bg, color: pal.text }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-[#bd9661]" style={{ backgroundColor: pal.bg }} />
                    <strong className="text-xs">{pal.title}</strong>
                  </div>
                  <div className="text-[9.5px] opacity-75 mt-0.5">{pal.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Header Phrase */}
          <div>
            <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider mb-1.5">
              INVITATION INVITEE PHRASE
            </label>
            <input
              type="text"
              value={invitationHeading}
              onChange={(e) => setInvitationHeading(e.target.value)}
              placeholder="e.g. Together with their families"
              className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
            />
          </div>

          {/* Interactive Shimmer Toggle & Print PDF */}
          <div className="pt-2 border-t border-[#f0ede4] flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#15110e] cursor-pointer">
              <input
                type="checkbox"
                checked={isFoilShimmerActive}
                onChange={(e) => setIsFoilShimmerActive(e.target.checked)}
                className="accent-[#bd9661] w-4 h-4 cursor-pointer"
              />
              <span>Foil Shimmer Sheen Effect</span>
            </label>
            <button
              type="button"
              onClick={() => showToast('Generated print-ready PDF with 3mm bleeds & CMYK foil separation', 'success')}
              className="text-[11px] font-bold text-[#bd9661] hover:underline cursor-pointer"
            >
              Download PDF &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Live QaRd Card with Side Navigation Arrows (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Top Subcard: Only template name and category badge, nothing else */}
          <div className="w-full max-w-md bg-white border border-[#e8ded0] rounded-2xl py-3 px-5 mb-4 shadow-xs flex items-center justify-between">
            <h2 className="font-serif text-base md:text-lg font-bold text-[#15110e]">
              {currentTemplate.name}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#faf8f5] border border-[#bd9661] text-[#bd9661] px-2.5 py-0.5 rounded-full">
              {currentTemplate.category}
            </span>
          </div>

          {/* Interactive Card Presentation Container with Flanking Circular Gold/Obsidian Arrows */}
          <div className="relative w-full max-w-md flex items-center justify-center">
            {/* Left Circular Floating Arrow Button */}
            <button
              type="button"
              onClick={handlePrevTemplate}
              aria-label="Previous Template"
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#15110e] border-2 border-[#bd9661] text-[#dfc194] hover:bg-[#251e18] hover:text-white hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center cursor-pointer transition-all group"
              title="Previous Template"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Right Circular Floating Arrow Button */}
            <button
              type="button"
              onClick={handleNextTemplate}
              aria-label="Next Template"
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#15110e] border-2 border-[#bd9661] text-[#dfc194] hover:bg-[#251e18] hover:text-white hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center cursor-pointer transition-all group"
              title="Next Template"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* The Live QaRd Card with Authentic Fine-Art Wedding Stationery Design */}
            <div
              className={`w-full rounded-3xl p-7 border-4 shadow-2xl text-center transition-all relative overflow-hidden ${
                isFoilShimmerActive ? 'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/10 before:to-transparent before:pointer-events-none' : ''
              }`}
              style={{
                backgroundColor: cardBg,
                color: textColor,
                borderColor: activeFoil.border,
              }}
            >
              {/* ============================================================== */}
              {/* TEMPLATE 1: ROYAL GOLD & BAROQUE                               */}
              {/* ============================================================== */}
              {currentTemplate.id === 'royal-gold' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border-2 border-double"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Fine Baroque Corner Vectors */}
                  <svg className="absolute top-2 left-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                    <path d="M4 12V4h8M4 4l8 8" />
                  </svg>
                  <svg className="absolute top-2 right-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                    <path d="M20 12V4h-8M20 4l-8 8" />
                  </svg>
                  <svg className="absolute bottom-2 left-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                    <path d="M4 12v8h8M4 20l8-8" />
                  </svg>
                  <svg className="absolute bottom-2 right-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                    <path d="M20 12v8h-8M20 20l-8-8" />
                  </svg>

                  {/* Regal Wedding Monogram Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                    </svg>
                    <span className="font-serif text-[10px] font-bold tracking-[3px] uppercase" style={{ color: activeFoil.text }}>
                      T A P  &amp;  T O A S T
                    </span>
                  </div>

                  <div className="text-[10px] tracking-widest uppercase font-serif" style={{ color: activeFoil.text }}>
                    {invitationHeading.toUpperCase()}
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: textColor }}>
                    Sophie <span className="italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] italic" style={{ color: subtextColor }}>
                    request the honour of your presence at their wedding celebration
                  </div>

                  <div className="text-xs font-semibold" style={{ color: activeFoil.text }}>
                    Saturday, the Fourteenth of November, 2026
                  </div>
                  <div className="text-[11px]" style={{ color: subtextColor }}>
                    Two O'Clock in the Afternoon &bull; Fernwood Estate
                  </div>

                  {/* Symmetrical Fine Gold Divider */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-14 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                      <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                    </svg>
                    <div className="w-14 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-white p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-lg border" style={{ borderColor: activeFoil.border }}>
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-widest uppercase font-bold pt-1" style={{ color: activeFoil.text }}>
                    KINDLY SCAN TO CONFIRM ATTENDANCE
                  </div>
                  <div className="text-xs font-serif italic" style={{ color: subtextColor }}>
                    Prepared for {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 2: MODERN MINIMAL ARCH                                */}
              {/* ============================================================== */}
              {currentTemplate.id === 'modern-minimal' && (
                <div
                  className="rounded-t-[80px] rounded-b-2xl p-6 space-y-3.5 relative border"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Modern Arch Monogram */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: activeFoil.border }}>
                      <span className="font-serif text-xs font-bold" style={{ color: activeFoil.text }}>S · J</span>
                    </div>
                    <span className="text-[9px] font-sans uppercase tracking-[3px] font-bold mt-1.5" style={{ color: textColor }}>
                      T H E   W E D D I N G   O F
                    </span>
                  </div>

                  <div className="text-[10px] tracking-[2px] uppercase font-semibold" style={{ color: subtextColor }}>
                    {invitationHeading}
                  </div>

                  <h2 className="font-serif text-3xl font-normal tracking-wide leading-tight" style={{ color: textColor }}>
                    Sophie <span className="italic font-light" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    invite you to celebrate their wedding day
                  </div>

                  <div className="text-xs font-semibold tracking-wide" style={{ color: textColor }}>
                    14 . 11 . 2026 &bull; 2:00 PM
                  </div>
                  <div className="text-[11px] font-medium" style={{ color: subtextColor }}>
                    Fernwood Estate &bull; Southern Highlands
                  </div>

                  {/* Clean Hairline */}
                  <div className="w-16 h-[1px] mx-auto my-3" style={{ backgroundColor: activeFoil.border }} />

                  {/* QR Presentation */}
                  <div className="bg-white p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-md border border-[#e8ded0]">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-[2px] uppercase font-bold pt-1" style={{ color: textColor }}>
                    SCAN TO ACCESS EVENT CONSOLE
                  </div>
                  <div className="text-xs font-medium" style={{ color: subtextColor }}>
                    Guest Pass: {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 3: BOTANICAL SAGE & OLIVE                             */}
              {/* ============================================================== */}
              {currentTemplate.id === 'botanical-sage' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Fine-line Botanical Corner Accents */}
                  <svg className="absolute top-2 left-2 w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.2">
                    <path d="M3 21c3-6 8-10 18-12M3 21c6-3 10-8 12-18M7 17c2-3 4-5 9-6M17 7c-3 2-5 4-6 9" />
                  </svg>
                  <svg className="absolute top-2 right-2 w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.2">
                    <path d="M21 21c-3-6-8-10-18-12M21 21c-6-3-10-8-12-18M17 17c-2-3-4-5-9-6M7 7c3 2 5 4 6 9" />
                  </svg>

                  {/* Botanical Laurel Wreath Crest SVG */}
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 mb-0.5" viewBox="0 0 48 48" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <path d="M12 36c-4-6-4-16 2-22 4-4 10-6 10-6s6 2 10 6c6 6 6 16 2 22" />
                      <circle cx="24" cy="24" r="3" fill={activeFoil.text} />
                    </svg>
                    <span className="font-serif text-[10px] font-bold tracking-[2px] uppercase" style={{ color: activeFoil.text }}>
                      T A P  &amp;  T O A S T
                    </span>
                  </div>

                  <div className="text-[10px] tracking-widest uppercase font-serif" style={{ color: activeFoil.text }}>
                    {invitationHeading}
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: textColor }}>
                    Sophie <span className="italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    request the pleasure of your company to celebrate their marriage
                  </div>

                  <div className="text-xs font-medium" style={{ color: activeFoil.text }}>
                    Saturday, 14 November 2026 &bull; 2:00 PM
                  </div>
                  <div className="text-[11px]" style={{ color: subtextColor }}>
                    The Rose Arbor &bull; Fernwood Estate
                  </div>

                  {/* Botanical Foliage Line Divider */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <path d="M12 2C8 6 6 12 12 22c6-10 4-16 0-20z" />
                    </svg>
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-white p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-lg border border-emerald-800/40">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-widest uppercase font-bold pt-1" style={{ color: activeFoil.text }}>
                    SCAN TO CONFIRM YOUR ATTENDANCE
                  </div>
                  <div className="text-xs italic" style={{ color: subtextColor }}>
                    Reserved for {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 4: ART DECO 1920s GATSBY                              */}
              {/* ============================================================== */}
              {currentTemplate.id === 'art-deco' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border-2"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Geometric Stepped Corners */}
                  <svg className="absolute top-2 left-2 w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 22 12 12 22 2 12" />
                  </svg>
                  <svg className="absolute top-2 right-2 w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 22 12 12 22 2 12" />
                  </svg>
                  <svg className="absolute bottom-2 left-2 w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 22 12 12 22 2 12" />
                  </svg>
                  <svg className="absolute bottom-2 right-2 w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 22 12 12 22 2 12" />
                  </svg>

                  {/* Gatsby Sunburst Fan Crest */}
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 mb-0.5" viewBox="0 0 32 32" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <path d="M16 28V8M16 8l-6 8M16 8l6 8M4 28l12-20 12 20M8 28l8-14 8 14" />
                    </svg>
                    <span className="font-serif text-[10.5px] font-bold tracking-[4px] uppercase" style={{ color: activeFoil.text }}>
                      T A P  &amp;  T O A S T
                    </span>
                  </div>

                  <div className="text-[10px] tracking-[3px] uppercase font-bold" style={{ color: activeFoil.text }}>
                    {invitationHeading.toUpperCase()}
                  </div>

                  <h2 className="font-serif text-3xl font-extrabold tracking-wider leading-tight uppercase" style={{ color: textColor }}>
                    SOPHIE <span className="font-serif italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> JAMES
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    cordially invite you to celebrate their union
                  </div>

                  <div className="text-xs font-bold tracking-widest" style={{ color: activeFoil.text }}>
                    SATURDAY &bull; NOVEMBER 14TH &bull; 2026
                  </div>
                  <div className="text-[11px] tracking-wide" style={{ color: subtextColor }}>
                    The Grand Ballroom &bull; Fernwood Estate
                  </div>

                  {/* Stepped Diamond Vector Divider */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-10 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                      <polygon points="12 2 22 12 12 22 2 12" />
                    </svg>
                    <div className="w-10 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-white p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-xl border-2" style={{ borderColor: activeFoil.border }}>
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-[2px] uppercase font-bold pt-1" style={{ color: activeFoil.text }}>
                    BLACK TIE &bull; DINNER &amp; DANCING
                  </div>
                  <div className="text-xs font-serif italic" style={{ color: subtextColor }}>
                    Guest of Honour: {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 5: RUSTIC KRAFT & WAX SEAL                            */}
              {/* ============================================================== */}
              {currentTemplate.id === 'rustic-kraft' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border-2 border-dashed"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Handcrafted Crimson Wax Seal Medallion */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8c1f1f] via-[#751616] to-[#4d0b0b] shadow-md border border-[#b83535] flex items-center justify-center text-white">
                      <span className="font-serif text-xs font-bold tracking-widest text-[#f5d9a4] drop-shadow-sm">
                        S &amp; J
                      </span>
                    </div>
                    <span className="text-[9.5px] uppercase font-serif tracking-[2px] font-bold mt-1.5" style={{ color: textColor }}>
                      H E R I T A G E   M A N O R
                    </span>
                  </div>

                  <div className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: subtextColor }}>
                    {invitationHeading}
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: textColor }}>
                    Sophie <span className="italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    request the pleasure of your company on their wedding day
                  </div>

                  <div className="text-xs font-bold" style={{ color: activeFoil.text }}>
                    Saturday, the 14th of November, 2026
                  </div>
                  <div className="text-[11px] font-medium" style={{ color: subtextColor }}>
                    The Country Homestead &bull; Fernwood Estate
                  </div>

                  {/* Symmetrical Fine Twine Knot Divider */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-12 h-[1px] border-b border-dashed" style={{ borderColor: activeFoil.border }} />
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M3 12h6M15 12h6" />
                    </svg>
                    <div className="w-12 h-[1px] border-b border-dashed" style={{ borderColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-[#fffdfa] p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-md border border-[#d6c7b2]">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-wider uppercase font-bold pt-1" style={{ color: textColor }}>
                    PLEASE SCAN TO CONFIRM ATTENDANCE
                  </div>
                  <div className="text-xs font-serif italic" style={{ color: subtextColor }}>
                    Prepared for {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 6: CELESTIAL MIDNIGHT NAVY                            */}
              {/* ============================================================== */}
              {currentTemplate.id === 'celestial-midnight' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Fine-line Starlight Corner Vectors */}
                  <svg className="absolute top-2 left-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                  </svg>
                  <svg className="absolute top-2 right-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                  </svg>
                  <svg className="absolute bottom-2 left-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                  </svg>
                  <svg className="absolute bottom-2 right-2 w-3.5 h-3.5" viewBox="0 0 24 24" fill={activeFoil.text}>
                    <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                  </svg>

                  {/* Delicate Fine-line Celestial Crescent Crest */}
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 mb-0.5" viewBox="0 0 32 32" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <path d="M18 4a12 12 0 1 0 10 16 14 14 0 0 1-10-16z" />
                      <circle cx="20" cy="10" r="1.5" fill={activeFoil.text} />
                    </svg>
                    <span className="font-serif text-[10px] font-bold tracking-[3px] uppercase" style={{ color: activeFoil.text }}>
                      U N D E R   T H E   S T A R S
                    </span>
                  </div>

                  <div className="text-[10px] tracking-widest uppercase font-serif" style={{ color: subtextColor }}>
                    {invitationHeading}
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: textColor }}>
                    Sophie <span className="italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    invite you to celebrate their union under the heavens
                  </div>

                  <div className="text-xs font-semibold" style={{ color: activeFoil.text }}>
                    Saturday, 14 November 2026 &bull; Twilight Ceremony
                  </div>
                  <div className="text-[11px]" style={{ color: subtextColor }}>
                    The Stargazer Lawn &bull; Fernwood Estate
                  </div>

                  {/* Symmetrical Fine Starburst Divider */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                      <polygon points="12 2 14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5" />
                    </svg>
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-white p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-2xl border" style={{ borderColor: activeFoil.border }}>
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-widest uppercase font-bold pt-1" style={{ color: activeFoil.text }}>
                    SCAN TO JOIN UNDER THE NIGHT SKY
                  </div>
                  <div className="text-xs italic" style={{ color: subtextColor }}>
                    Reserved for {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 7: BOHO TERRACOTTA & PALM                             */}
              {/* ============================================================== */}
              {currentTemplate.id === 'boho-terracotta' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Fine-line Bohemian Sun Arch Crest SVG */}
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 mb-0.5" viewBox="0 0 32 32" fill="none" stroke={activeFoil.text} strokeWidth="1.5">
                      <path d="M4 24a12 12 0 0 1 24 0M10 24a6 6 0 0 1 12 0M16 4v4M6 10l3 3M26 10l-3 3" />
                    </svg>
                    <span className="font-serif text-[10px] font-bold tracking-[2px] uppercase" style={{ color: activeFoil.text }}>
                      T U S C A N   V I L L A
                    </span>
                  </div>

                  <div className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: activeFoil.text }}>
                    {invitationHeading}
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: textColor }}>
                    Sophie <span className="italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    invite you to join them in celebrating their love
                  </div>

                  <div className="text-xs font-bold" style={{ color: activeFoil.text }}>
                    Saturday, 14 November 2026 &bull; 2:00 PM
                  </div>
                  <div className="text-[11px]" style={{ color: subtextColor }}>
                    The Olive Grove &bull; Fernwood Estate
                  </div>

                  {/* Terracotta Sunburst Line Divider */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill={activeFoil.text}>
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="6" stroke={activeFoil.text} strokeWidth="1.5" />
                      <line x1="12" y1="18" x2="12" y2="22" stroke={activeFoil.text} strokeWidth="1.5" />
                      <line x1="2" y1="12" x2="6" y2="12" stroke={activeFoil.text} strokeWidth="1.5" />
                      <line x1="18" y1="12" x2="22" y2="12" stroke={activeFoil.text} strokeWidth="1.5" />
                    </svg>
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-[#fffbf8] p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-md border" style={{ borderColor: activeFoil.border }}>
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-widest uppercase font-bold pt-1" style={{ color: activeFoil.text }}>
                    FEAST &amp; LIVE MUSIC TO FOLLOW
                  </div>
                  <div className="text-xs italic" style={{ color: subtextColor }}>
                    With warmth for {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TEMPLATE 8: TIMELESS HERITAGE MONOGRAM                         */}
              {/* ============================================================== */}
              {currentTemplate.id === 'timeless-heritage' && (
                <div
                  className="rounded-2xl p-6 space-y-3 relative border-2"
                  style={{ borderColor: activeFoil.border }}
                >
                  {/* Interlocking Monogram Medallion */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full border flex items-center justify-center shadow-2xs" style={{ borderColor: activeFoil.border }}>
                      <span className="font-serif text-sm font-bold tracking-wider" style={{ color: activeFoil.text }}>
                        SJ
                      </span>
                    </div>
                    <span className="font-serif text-[9.5px] font-bold tracking-[3px] uppercase mt-1.5" style={{ color: textColor }}>
                      H E R I T A G E   E D I T I O N
                    </span>
                  </div>

                  <div className="text-[10px] tracking-[2px] uppercase font-semibold" style={{ color: subtextColor }}>
                    {invitationHeading}
                  </div>

                  <h2 className="font-serif text-3xl font-extrabold tracking-tight leading-tight" style={{ color: textColor }}>
                    Sophie <span className="font-serif italic font-normal" style={{ color: activeFoil.text }}>&amp;</span> James
                  </h2>

                  <div className="text-[11px] font-serif italic" style={{ color: subtextColor }}>
                    request the pleasure of your company at the celebration of their marriage
                  </div>

                  <div className="text-xs font-bold" style={{ color: activeFoil.text }}>
                    Saturday, the Fourteenth of November, Two Thousand Twenty-Six
                  </div>
                  <div className="text-[11px] font-medium" style={{ color: subtextColor }}>
                    Fernwood Estate &bull; Southern Highlands
                  </div>

                  {/* Symmetrical Fine Rule */}
                  <div className="flex items-center justify-center gap-2 my-2.5">
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={activeFoil.text}>
                      <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                    </svg>
                    <div className="w-12 h-[1px]" style={{ backgroundColor: activeFoil.border }} />
                  </div>

                  {/* QR Presentation */}
                  <div className="bg-white p-3 rounded-2xl w-[145px] h-[145px] mx-auto flex items-center justify-center shadow-lg border border-[#e8ded0]">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                      alt="Invitation QR Code"
                      className="w-[125px] h-[125px] object-contain"
                    />
                  </div>

                  <div className="text-[9.5px] tracking-[2px] uppercase font-bold pt-1" style={{ color: textColor }}>
                    BLACK TIE &bull; RECEPTION TO FOLLOW
                  </div>
                  <div className="text-xs font-serif italic" style={{ color: subtextColor }}>
                    Presented to {selectedQaRdHousehold.split(' (')[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
