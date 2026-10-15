import React, { useState } from 'react';
import { useAppState, getWeddingCountdown, formatAUD, showToast } from '../lib/state';

export default function GuestWebView() {
  const { state, setState } = useAppState();
  const [feedLikes, setFeedLikes] = useState<Record<string, number>>({
    f1: 24,
    f2: 8,
    f3: 5,
    f4: 12
  });
  const [wishInput, setWishInput] = useState('');
  const countdown = getWeddingCountdown('2026-11-14T14:00:00');
  const wedding = state.weddings[0];

  const handleLike = (id: string) => {
    setFeedLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    showToast('Sent celebration love note reaction ❤️', 'info');
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    const newGift = {
      id: 'gf_' + Date.now(),
      guestName: 'Mark & Sarah Johnson',
      amount: 150,
      type: 'wishing-well',
      date: 'Just now',
      message: wishInput,
      thankYouSent: false,
      thankYouStatus: 'Not Started' as const
    };
    setState({
      ...state,
      gifts: [newGift, ...(state.gifts || [])]
    });
    setWishInput('');
    showToast('Your loving blessing has been sent to the happy couple!', 'success');
  };

  return (
    <div className="flex-1 bg-[#f8f6f2] text-[#15110e] font-sans">
      {/* Editorial Hero */}
      <section className="bg-[#15110e] text-white py-16 px-6 text-center border-b-2 border-[#bd9661] relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase font-bold tracking-widest text-[#bd9661] mb-2">
            The Wedding of
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight mb-3">
            Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
          </h1>
          <p className="text-sm sm:text-base text-[#c9bbae] mb-6">
            Saturday, 14 November 2026 · Fernwood Estate, Southern Highlands
          </p>
          <div className="inline-block bg-[#241c16] border border-[#3d2f23] rounded-xl px-5 py-2.5 text-xs text-[#dfc194] font-mono tracking-wider">
            ⏳ {countdown.formatted}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Schedule & Venue */}
        <div className="md:col-span-2 space-y-8">
          {/* Schedule */}
          <div className="bg-white border border-[#e8ded0] p-6 rounded-xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
              Day-of Proceedings
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#15110e] mt-1 mb-6">
              Order of Events
            </h3>
            <div className="space-y-4">
              {[
                { time: '1:30 PM', title: 'Arrival & Welcome Drinks', desc: 'Main lawn seating, acoustic strings' },
                { time: '2:00 PM', title: 'Marriage Ceremony', desc: 'Exchange of vows at the garden arch' },
                { time: '2:45 PM', title: 'Cocktail Reception', desc: 'Canapés, champagne & lawn games' },
                { time: '4:00 PM', title: 'Grand Pavilion Banquet', desc: 'Entrée service and celebration toasts' },
                { time: '7:15 PM', title: 'Cake Cutting & Dancing', desc: 'First dance and live entertainment' },
                { time: '10:15 PM', title: 'Courtyard Send-Off', desc: 'Farewell Sophie & James!' },
              ].map((ev, i) => (
                <div key={i} className="flex items-start gap-4 pb-3 border-b border-[#f2ede7] last:border-none">
                  <span className="font-mono text-xs font-bold text-[#bd9661] w-20 flex-shrink-0 pt-0.5">
                    {ev.time}
                  </span>
                  <div>
                    <h5 className="font-serif font-bold text-sm text-[#15110e]">{ev.title}</h5>
                    <p className="text-xs text-[#8b7b6b] mt-0.5">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebration Feed with Like Reactions */}
          <div className="bg-white border border-[#e8ded0] p-6 rounded-xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
              Celebration Wall
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#15110e] mt-1 mb-6">
              Love Notes &amp; Blessings
            </h3>
            <div className="space-y-4">
              {[
                { id: 'f1', author: 'Aunty Carol', time: '2h ago', note: "So excited for you both — can't wait to dance with you at the Grand Pavilion! 💕" },
                { id: 'f2', author: 'The Whitfield family', time: '4h ago', note: 'Wishing you both a lifetime of love and unforgettable happiness together.' },
                { id: 'f3', author: 'Michael Chen', time: 'Yesterday', note: 'Suit is pressed and ready! Looking forward to an incredible night.' },
              ].map(item => (
                <div key={item.id} className="p-4 bg-[#fbf9f6] border border-[#e8ded0] rounded-xl flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-[#15110e]">{item.author}</strong>
                      <span className="text-[10px] text-[#a69888]">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#4a3e35] mt-1.5 leading-relaxed">{item.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-1 text-xs text-[#a8382c] bg-white border border-[#ebd4b8] px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0 font-bold"
                  >
                    <span>❤️</span>
                    <span>{feedLikes[item.id] || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Wishing Well & Venue */}
        <div className="space-y-6">
          <div className="bg-white border border-[#e8ded0] p-5 rounded-xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
              Gift &amp; Go™
            </span>
            <h4 className="font-serif text-lg font-bold text-[#15110e] mt-1 mb-2">
              Digital Wishing Well
            </h4>
            <p className="text-xs text-[#8b7b6b] mb-4 leading-relaxed">
              If you wish to honor our marriage with a gift, a wishing well contribution towards our honeymoon is warmly appreciated.
            </p>
            <form onSubmit={handleSendWish} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Write a message to Sophie & James..."
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                className="w-full text-xs p-2.5 border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs py-2.5 rounded-lg transition-colors"
              >
                Send Wedding Blessing &rarr;
              </button>
            </form>
          </div>

          <div className="bg-[#15110e] text-white p-5 rounded-xl shadow-md text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
              Venue &amp; Location
            </span>
            <h4 className="font-serif text-base font-bold text-[#dfc194]">Fernwood Estate</h4>
            <p className="text-[#c9bbae] leading-relaxed">
              124 Range Road, Mittagong NSW 2575. Complimentary parking available on-site at Main Lawn.
            </p>
            <a
              href="https://maps.google.com/?q=Fernwood+Estate+Mittagong+NSW"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#dfc194] hover:underline font-semibold pt-1"
            >
              📍 Open Google Maps &rarr;
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
