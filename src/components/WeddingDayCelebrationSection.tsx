import React, { useState } from 'react';
import { showToast } from '../lib/state';

interface WeddingDayCelebrationSectionProps {
  onToggleWeddingDayMode: () => void;
  isWeddingDayMode: boolean;
}

export const WeddingDayCelebrationSection: React.FC<WeddingDayCelebrationSectionProps> = ({
  onToggleWeddingDayMode,
  isWeddingDayMode,
}) => {
  const [toastCount, setToastCount] = useState<number>(284);
  const [hasRaisedToast, setHasRaisedToast] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number>(2); // 0-indexed: stage 2 is Ceremony (2:00 PM)

  const weddingStages = [
    { id: 0, time: '10:00 AM', title: 'Bridal Prep & First Look', loc: 'Bridal Suite', status: 'completed' },
    { id: 1, time: '1:30 PM', title: 'Guest Arrival & Welcome Spritz', loc: 'Garden Verandah', status: 'completed' },
    { id: 2, time: '2:00 PM', title: 'Garden Wedding Ceremony', loc: 'Rose Arbor Gardenia', status: 'live' },
    { id: 3, time: '3:30 PM', title: 'Cocktail Hour & Jazz Trio', loc: 'Vineyard Lawn', status: 'upcoming' },
    { id: 4, time: '5:30 PM', title: 'Grand Reception Entrance', loc: 'Grand Ballroom', status: 'upcoming' },
    { id: 5, time: '7:00 PM', title: 'Formal Speeches & First Dance', loc: 'Main Dancefloor', status: 'upcoming' },
    { id: 6, time: '9:00 PM', title: 'Cake Cutting & Live Band', loc: 'Grand Ballroom', status: 'upcoming' },
    { id: 7, time: '11:30 PM', title: 'Sparkler Farewell Arch', loc: 'Estate Courtyard', status: 'upcoming' },
  ];

  const handleRaiseToast = () => {
    setToastCount((prev) => prev + 1);
    setHasRaisedToast(true);
    showToast('🥂 Cheers! You raised a digital toast to Sophie & James!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Golden Celebration Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#15110e] via-[#221811] to-[#15110e] border-2 border-[#bd9661] p-6 md:p-8 text-white shadow-2xl">
        {/* Subtle decorative confetti shimmer particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#dfc194_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Floating Celebration Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#2a1e14] border border-[#bd9661]/80 px-3 py-1 rounded-full text-xs font-bold text-[#dfc194] shadow-xs">
              <span className="animate-pulse text-sm">🎉</span>
              <span>IT&apos;S YOUR WEDDING DAY! &bull; SATURDAY, 14 NOVEMBER 2026</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white pt-1">
              Sophie <span className="text-[#dfc194] italic font-normal">&amp;</span> James
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#d9c9b8] pt-0.5">
              <span className="flex items-center gap-1">
                <span>📍</span> Fernwood Estate, Southern Highlands
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <span>☀️</span> 23°C Sunny &bull; Sunset 7:42 PM
              </span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Console Active
              </span>
            </div>
          </div>

          {/* Quick Demo Mode Switcher & Toast Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleRaiseToast}
              className={`px-5 py-3 rounded-2xl font-bold text-xs cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2 ${
                hasRaisedToast
                  ? 'bg-[#3c6a42] text-white border border-emerald-400'
                  : 'bg-gradient-to-r from-[#dfc194] via-[#bd9661] to-[#916c3d] text-[#15110e] hover:brightness-110'
              }`}
            >
              <span className="text-base">🥂</span>
              <span>{hasRaisedToast ? 'Toast Raised! (' + toastCount + ')' : 'Raise Digital Toast (' + toastCount + ')'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleWeddingDayMode}
              className="bg-[#2a2119] hover:bg-[#3d3126] text-[#dfc194] border border-[#4a3a2d] px-3.5 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
              title="Toggle back to planning countdown"
            >
              <span>⏳</span> Exit Day Mode
            </button>
          </div>
        </div>

        {/* Live Wedding Day Timeline Ticker */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#3d2e23]">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-[#dfc194] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#bd9661] animate-ping" />
              Live Stage: {weddingStages[activeStage].title}
            </span>
            <span className="text-[#a89787]">
              Time: 2:18 PM AEDT &bull; All cues on schedule
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {weddingStages.map((stage, idx) => {
              const isLive = stage.status === 'live';
              const isDone = stage.status === 'completed';
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isLive
                      ? 'bg-[#bd9661] text-[#15110e] border-[#dfc194] shadow-md font-bold'
                      : isDone
                      ? 'bg-[#1e1711] text-[#bdafa0] border-[#3a2d22] opacity-85'
                      : 'bg-[#1a1410] text-[#7d6f62] border-[#2d2218] hover:border-[#bd9661]/50'
                  }`}
                >
                  <div className="text-[10px] font-mono opacity-80 flex items-center justify-between">
                    <span>{stage.time}</span>
                    {isLive && <span className="text-[8px] uppercase bg-[#15110e] text-[#dfc194] px-1 rounded">LIVE</span>}
                    {isDone && <span className="text-emerald-400 text-xs">✓</span>}
                  </div>
                  <div className="text-[11px] font-bold mt-1 line-clamp-1">
                    {stage.title}
                  </div>
                  <div className="text-[9px] opacity-75 mt-0.5 line-clamp-1">
                    {stage.loc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Live Day-Of Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs uppercase text-[#8b7b6b] font-bold">Checked-In Guests</div>
            <div className="font-serif text-3xl font-bold text-[#15110e] mt-1.5">104 / 118</div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">88.1% of guests present</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f0f7f1] text-[#2d5f35] flex items-center justify-center text-xl">
            🎟️
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs uppercase text-[#8b7b6b] font-bold">Wishing Well Today</div>
            <div className="font-serif text-3xl font-bold text-emerald-700 mt-1.5">$5,650</div>
            <div className="text-xs text-[#bd9661] font-semibold mt-1">16 gifts arrived today</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#faf5ed] text-[#bd9661] flex items-center justify-center text-xl">
            💌
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs uppercase text-[#8b7b6b] font-bold">Photos Uploaded</div>
            <div className="font-serif text-3xl font-bold text-[#15110e] mt-1.5">186 Shots</div>
            <div className="text-xs text-[#8b7b6b] font-semibold mt-1">Live guest photostream</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f4f1ea] text-[#15110e] flex items-center justify-center text-xl">
            📸
          </div>
        </div>

        <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs uppercase text-[#8b7b6b] font-bold">MC Run Sheet Sync</div>
            <div className="font-serif text-2xl font-bold text-[#3c6a42] mt-1.5">On Schedule</div>
            <div className="text-xs text-[#8b7b6b] font-semibold mt-1">Next: Speeches (5:30 PM)</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f0f7f1] text-[#3c6a42] flex items-center justify-center text-xl">
            🎙️
          </div>
        </div>
      </div>

      {/* Live Guest Feed & Coordinator Dispatch Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Guest Arrival Stream */}
        <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#15110e] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Guest Arrivals &amp; QaRd Scans
            </h3>
            <span className="text-[11px] text-[#8b7b6b]">Auto-updating</span>
          </div>

          <div className="space-y-3">
            {[
              { guest: 'Priya Sharma & Family', table: 'Table 2 (Rose Garden)', time: '3 mins ago', note: 'Seated at ceremony row 2' },
              { guest: 'Hannah Martin', table: 'Table 4 (Fernwood Lawn)', time: '8 mins ago', note: 'Signed digital guestbook' },
              { guest: 'Michael & Sarah Chen', table: 'Table 1 (Bridal)', time: '14 mins ago', note: 'Sent wishing well gift' },
              { guest: 'The Whitfield family', table: 'Table 6 (Courtyard)', time: '21 mins ago', note: 'Checked in with MC Robert' },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#faf8f5] border border-[#f0ede4] rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#15110e]">{item.guest}</strong>
                  <div className="text-[11px] text-[#8b7b6b] mt-0.5">{item.table} &bull; {item.note}</div>
                </div>
                <span className="text-[10px] text-[#bd9661] font-mono whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => showToast('Refreshed guest attendance manifest', 'info')}
            className="w-full bg-white hover:bg-[#faf8f5] border border-[#d5c7b5] text-[#15110e] font-bold py-2 rounded-xl text-xs cursor-pointer transition-colors text-center"
          >
            View All 104 Checked-In Guests &rarr;
          </button>
        </div>

        {/* MC & Vendor Live Coordination */}
        <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#15110e]">
              On-Day Vendor Dispatch
            </h3>
            <span className="bg-[#e8eee4] text-[#3c6a42] text-[10px] font-bold px-2 py-0.5 rounded-full">
              4 Staff On-Site
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Robert Galati', role: 'Lead MC & Host', status: 'At Rose Arbor Gardenia', contact: '0412 345 678' },
              { name: 'Sarah Jenkins', role: 'Event Coordinator', status: 'Supervising Ballroom setup', contact: '0423 456 789' },
              { name: 'Marcus Taylor', role: 'Lead Photographer', status: 'Shooting Ceremony aisle', contact: '0434 567 890' },
              { name: 'Dave Miller', role: 'AV & Sound Engineer', status: 'Audio levels calibrated 100%', contact: '0445 678 901' },
            ].map((vendor, idx) => (
              <div key={idx} className="border border-[#e8ded0] rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#15110e]">{vendor.name}</strong>
                  <div className="text-[11px] text-[#8b7b6b]">{vendor.role} &bull; <span className="text-emerald-700">{vendor.status}</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Calling ${vendor.name} (${vendor.contact})...`, 'info')}
                  className="bg-[#faf8f5] border border-[#bd9661]/40 text-[#916c3d] font-bold px-2.5 py-1 rounded-lg text-[11px] hover:bg-[#bd9661] hover:text-white transition-colors cursor-pointer"
                >
                  Call
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#15110e] text-white p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">📢</span>
              <span className="text-[11px] text-[#dfc194]">Announce to all guests via smartphone notification</span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Broadcasted notification: "Cocktail hour begins in 15 minutes at the Vineyard Lawn"', 'success')}
              className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
            >
              Send Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
