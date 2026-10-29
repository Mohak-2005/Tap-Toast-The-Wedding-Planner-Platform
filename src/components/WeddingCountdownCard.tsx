import React, { useState, useEffect } from 'react';
import { getWeddingCountdown } from '../lib/state';

export type WeddingThemeColor = 'merlot' | 'sage' | 'gold' | 'obsidian';

interface WeddingCountdownCardProps {
  targetDate?: string;
  coupleName?: string;
  venueName?: string;
  dateDisplay?: string;
  themeColor?: WeddingThemeColor;
  variant?: 'luxury' | 'card' | 'compact';
  className?: string;
}

export const WeddingCountdownCard: React.FC<WeddingCountdownCardProps> = ({
  targetDate = '2026-11-14T14:00:00',
  coupleName = 'Sophie & James',
  venueName = 'Fernwood Estate, Southern Highlands',
  dateDisplay = '14 November 2026',
  themeColor = 'merlot',
  variant = 'luxury',
  className = '',
}) => {
  const [countdown, setCountdown] = useState(getWeddingCountdown(targetDate));

  useEffect(() => {
    setCountdown(getWeddingCountdown(targetDate));
    const timer = setInterval(() => {
      setCountdown(getWeddingCountdown(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: String(Math.max(0, countdown.days)).padStart(2, '0') },
    { label: 'HOURS', value: String(Math.max(0, countdown.hours)).padStart(2, '0') },
    { label: 'MINS', value: String(Math.max(0, countdown.minutes)).padStart(2, '0') },
    { label: 'SECS', value: String(Math.max(0, countdown.seconds)).padStart(2, '0') },
  ];

  // Theme-specific styles
  const themeStyles: Record<WeddingThemeColor, {
    bgGradient: string;
    border: string;
    boxBg: string;
    boxBorder: string;
    numberColor: string;
    labelColor: string;
    tagBg: string;
    tagText: string;
    glow: string;
  }> = {
    merlot: {
      bgGradient: 'bg-gradient-to-r from-[#2b0d13] via-[#20090e] to-[#160609]',
      border: 'border-[#7a2233]/60',
      boxBg: 'bg-[#3d121b]/80 hover:bg-[#4d1722]',
      boxBorder: 'border-[#a8324a]/50',
      numberColor: 'text-[#ffd6de]',
      labelColor: 'text-[#e5a4b1]',
      tagBg: 'bg-[#4a1420]',
      tagText: 'text-[#ffc2cd]',
      glow: 'bg-[#a8324a]/15',
    },
    sage: {
      bgGradient: 'bg-gradient-to-r from-[#142318] via-[#0e1a12] to-[#08120b]',
      border: 'border-[#3f6848]/60',
      boxBg: 'bg-[#1e3424]/80 hover:bg-[#27442f]',
      boxBorder: 'border-[#558b61]/50',
      numberColor: 'text-[#d7eedc]',
      labelColor: 'text-[#a2cca9]',
      tagBg: 'bg-[#1f3726]',
      tagText: 'text-[#c0e4c6]',
      glow: 'bg-[#558b61]/15',
    },
    gold: {
      bgGradient: 'bg-gradient-to-r from-[#2b2012] via-[#1f170c] to-[#140e06]',
      border: 'border-[#bd9661]/60',
      boxBg: 'bg-[#3a2c19]/80 hover:bg-[#4a3920]',
      boxBorder: 'border-[#dfc194]/50',
      numberColor: 'text-[#fce4ca]',
      labelColor: 'text-[#dfc194]',
      tagBg: 'bg-[#3d2e1b]',
      tagText: 'text-[#f5d7b5]',
      glow: 'bg-[#bd9661]/15',
    },
    obsidian: {
      bgGradient: 'bg-gradient-to-r from-[#181310] via-[#120e0b] to-[#0c0907]',
      border: 'border-[#bd9661]/40',
      boxBg: 'bg-[#241c16]/80 hover:bg-[#2f241d]',
      boxBorder: 'border-[#bd9661]/35',
      numberColor: 'text-[#dfc194]',
      labelColor: 'text-[#a8988a]',
      tagBg: 'bg-[#291f18]',
      tagText: 'text-[#dfc194]',
      glow: 'bg-[#bd9661]/10',
    },
  };

  const currentTheme = themeStyles[themeColor] || themeStyles.merlot;

  if (variant === 'compact') {
    return (
      <div className={`${currentTheme.bgGradient} border ${currentTheme.border} rounded-2xl p-3 shadow-md text-white ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={currentTheme.labelColor}>Wedding Countdown</span>
          </div>
          <span className="text-[10px] text-white/60 font-medium">{dateDisplay}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {units.map((u) => (
            <div key={u.label} className={`${currentTheme.boxBg} border ${currentTheme.boxBorder} rounded-xl py-1.5 px-1`}>
              <div className={`font-serif text-base font-bold ${currentTheme.numberColor} leading-tight`}>
                {u.value}
              </div>
              <div className={`text-[8px] uppercase font-bold ${currentTheme.labelColor} tracking-wider mt-0.5`}>
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sleek, prominent, compact horizontal luxury banner (matching chosen wedding theme)
  return (
    <div
      className={`relative overflow-hidden ${currentTheme.bgGradient} border ${currentTheme.border} rounded-2xl p-3.5 sm:p-4 px-4 sm:px-6 shadow-md text-white flex flex-col md:flex-row md:items-center md:justify-between gap-3.5 ${className}`}
    >
      {/* Ambient Theme Glow */}
      <div className={`absolute -right-10 -top-10 w-48 h-48 ${currentTheme.glow} rounded-full blur-2xl pointer-events-none`} />

      {/* Left Details: Couple Name, Venue, Countdown Status */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[1.5px] px-2 py-0.5 rounded-full border border-white/10 select-none shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className={currentTheme.tagText}>Official Countdown</span>
          </span>
          <span className="text-xs text-white/60 font-medium">Until We Say &ldquo;I Do&rdquo;</span>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <strong className="font-serif text-sm sm:text-base text-white font-bold tracking-wide">
            {coupleName}
          </strong>
          <span className="text-white/40">&bull;</span>
          <span className="text-white/75 truncate max-w-[200px] sm:max-w-none">📍 {venueName}</span>
          <span className="text-white/40">&bull;</span>
          <span className={`font-bold ${currentTheme.numberColor}`}>{dateDisplay}</span>
        </div>
      </div>

      {/* Right / Center: 4 Compact Flip Counters */}
      <div className="relative z-10 flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
        {units.map((u, idx) => (
          <React.Fragment key={u.label}>
            <div
              className={`flex-1 sm:flex-initial w-16 sm:w-18 py-2 px-1 text-center rounded-xl border ${currentTheme.boxBg} ${currentTheme.boxBorder} shadow-xs transition-all hover:scale-105`}
            >
              <div className={`font-serif text-xl sm:text-2xl font-bold tracking-tight ${currentTheme.numberColor} leading-tight drop-shadow-xs`}>
                {u.value}
              </div>
              <div className={`text-[8.5px] font-bold uppercase tracking-[1.2px] ${currentTheme.labelColor} mt-0.5`}>
                {u.label}
              </div>
            </div>
            {idx < units.length - 1 && (
              <span className={`text-sm sm:text-base font-bold ${currentTheme.labelColor} opacity-50 select-none`}>
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
