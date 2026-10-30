import React, { useState, useEffect } from 'react';
import { getWeddingCountdown } from '../lib/state';

export type WeddingThemeColor = 'merlot' | 'sage' | 'gold' | 'obsidian' | string;

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

  if (variant === 'compact') {
    return (
      <div className={`bg-[#15110e] border border-[#2b211a] rounded-2xl p-3 shadow-md text-white ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dfc194] animate-pulse" />
            <span className="text-[#dfc194]">Wedding Countdown</span>
          </div>
          <span className="text-[10px] text-[#9d8570] font-medium">{dateDisplay}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {units.map((u) => (
            <div key={u.label} className="bg-[#201a15] border border-[#332820] rounded-xl py-1.5 px-1 shadow-inner">
              <div className="font-serif text-base font-bold text-[#faf4ec] leading-tight">
                {u.value}
              </div>
              <div className="text-[8px] uppercase font-bold text-[#9d8570] tracking-wider mt-0.5">
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Exact Match to Guest Timer: Dark Luxury Pill with Live Ticking & Envelope Florals
  return (
    <div
      className={`relative overflow-hidden bg-[#15110e] border border-[#2b211a] rounded-2xl p-3.5 sm:p-4 px-4 sm:px-6 shadow-md text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${className}`}
    >
      {/* Left Delicate Golden Botanical Branch */}
      <div className="absolute left-1 top-0 bottom-0 w-12 flex items-center pointer-events-none opacity-80" aria-hidden="true">
        <svg viewBox="0 0 50 85" width="44" height="74" fill="none">
          <path d="M40 5 Q18 28 10 80" stroke="#c59f60" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.75"/>
          <path d="M36 12 Q18 8 15 24 Q30 22 36 12Z" fill="#dfc194" opacity="0.7"/>
          <path d="M28 30 Q10 24 8 42 Q24 38 28 30Z" fill="#bd9661" opacity="0.65"/>
          <path d="M18 50 Q2 42 2 62 Q18 58 18 50Z" fill="#dfc194" opacity="0.7"/>
          <circle cx="34" cy="16" r="2" fill="#dfc194" opacity="0.75"/>
          <circle cx="24" cy="36" r="1.6" fill="#bd9661" opacity="0.7"/>
        </svg>
      </div>

      {/* Right Delicate Golden Botanical Branch */}
      <div className="absolute right-1 top-0 bottom-0 w-12 flex items-center justify-end pointer-events-none opacity-80" aria-hidden="true">
        <svg viewBox="0 0 50 85" width="44" height="74" fill="none" style={{transform:'scaleX(-1)'}}>
          <path d="M40 5 Q18 28 10 80" stroke="#c59f60" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.75"/>
          <path d="M36 12 Q18 8 15 24 Q30 22 36 12Z" fill="#dfc194" opacity="0.7"/>
          <path d="M28 30 Q10 24 8 42 Q24 38 28 30Z" fill="#bd9661" opacity="0.65"/>
          <path d="M18 50 Q2 42 2 62 Q18 58 18 50Z" fill="#dfc194" opacity="0.7"/>
          <circle cx="34" cy="16" r="2" fill="#dfc194" opacity="0.75"/>
          <circle cx="24" cy="36" r="1.6" fill="#bd9661" opacity="0.7"/>
        </svg>
      </div>

      {/* Left Details: Wedding Countdown, Couple Name & Venue */}
      <div className="relative z-10 pl-6 sm:pl-8 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dfc194] animate-pulse" />
            <span className="text-[9.5px] font-bold tracking-[2px] uppercase text-[#dfc194]">Wedding Countdown</span>
          </div>
          <span className="text-xs text-[#9d8570] font-medium hidden sm:inline">&bull; Until We Say &ldquo;I Do&rdquo;</span>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <strong className="font-serif text-sm sm:text-base text-[#faf4ec] font-bold tracking-wide">
            {coupleName}
          </strong>
          <span className="text-[#9d8570]">&bull;</span>
          <span className="text-[#c7b5a2] truncate max-w-[200px] sm:max-w-none">📍 {venueName}</span>
          <span className="text-[#9d8570]">&bull;</span>
          <span className="font-bold text-[#dfc194]">{dateDisplay}</span>
        </div>
      </div>

      {/* Right: 4 Counter Boxes (Matching Guest Timer Style Exactly) */}
      <div className="relative z-10 pr-6 sm:pr-8 flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex-1 sm:flex-initial w-16 sm:w-18 py-2 px-1 text-center rounded-xl bg-[#201a15] border border-[#332820] shadow-inner transition-all hover:scale-105"
          >
            <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#faf4ec] leading-none tabular-nums drop-shadow-xs">
              {u.value}
            </div>
            <div className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-[1.5px] text-[#9d8570] mt-1.5">
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
