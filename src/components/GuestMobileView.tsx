import React, { useState, useEffect } from 'react';
import { useAppState, getWeddingCountdown, showToast, generateQrSvg } from '../lib/state';
import JoeyChatbot from './JoeyChatbot';

export default function GuestMobileView() {
  const { state, setState } = useAppState();
  const [inApp, setInApp] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'seating' | 'schedule' | 'gifts'>('rsvp');
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [dietaryInput, setDietaryInput] = useState('1x Vegetarian, 1x Gluten-Free');
  const [isEditingDietary, setIsEditingDietary] = useState(false);
  const [wishInput, setWishInput] = useState('');
  const [countdown, setCountdown] = useState(getWeddingCountdown('2026-11-14T14:00:00'));

  const wedding = state.weddings[0];
  const table4 = state.tables.find(t => t.id === 'table_4') || state.tables[4];
  const table4Guests = state.guests.filter(g => g.tableId === 'table_4');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getWeddingCountdown('2026-11-14T14:00:00'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateDietary = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = state.guests.map(g => {
      if (g.id === 'johnson_fam') {
        return { ...g, dietary: dietaryInput };
      }
      return g;
    });
    setState({ ...state, guests: updated });
    setIsEditingDietary(false);
    showToast('Dietary preferences updated for Mark & Sarah', 'success');
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    const newGift = {
      id: 'gf_' + Date.now(),
      guestName: 'Mark & Sarah Johnson',
      amount: 200,
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
    showToast('Your loving note and blessing has been sent to Sophie & James!', 'success');
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tap and Toast//Wedding Calendar//EN
BEGIN:VEVENT
UID:sophie-james-2026
DTSTAMP:20261015T120000Z
DTSTART:20261114T030000Z
DTEND:20261114T120000Z
SUMMARY:Sophie & James Wedding
DESCRIPTION:Southern Highlands wedding celebration at Fernwood Estate. Table 4.
LOCATION:Fernwood Estate, 124 Range Road, Mittagong NSW 2575
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sophie-and-james-wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wedding event added to your calendar!', 'success');
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-54px)] overflow-hidden font-sans">
      {/* 402x874 Phone Chassis */}
      <div
        className={`w-[402px] max-w-[402px] h-[874px] max-h-[calc(100vh-70px)] rounded-[46px] border-[4px] border-[#1c1511] shadow-[0_20px_60px_rgba(21,17,14,0.22),_0_4px_14px_rgba(21,17,14,0.08)] overflow-hidden relative flex flex-col transition-colors ${
          !inApp ? 'bg-[#15110e] border-[#2b221a]' : 'bg-[#f8f6f2]'
        }`}
      >
        {/* Phone Status Bar */}
        <div
          className={`flex justify-between items-center px-5 pt-3 pb-2 text-[13.5px] font-bold select-none z-10 flex-shrink-0 ${
            !inApp ? 'bg-[#15110e] text-[#f8f3eb] border-b border-white/5' : 'bg-[#f8f6f2] text-[#15110e] border-b border-black/5'
          }`}
        >
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[#bd9661]">5G</span>
            <div className="w-5 h-2.5 border-[1.5px] border-current rounded-xs p-0.5 flex items-center relative">
              <div className="w-[85%] h-full bg-[#bd9661] rounded-[1px]" />
              <div className="absolute -right-1 top-0.5 w-[2px] h-1 bg-current rounded-r-xs" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODE 1: LUXURY QARD SCAN SPLASH SCREEN (TAP TO ENTER)           */}
        {/* ============================================================== */}
        {!inApp ? (
          <div className="flex-1 flex flex-col justify-between p-6 text-center text-[#f8f6f2] overflow-y-auto no-scrollbar relative">
            <div className="mt-4">
              <div className="inline-flex items-center gap-1.5 border border-[#bd9661]/40 bg-[#211a14] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#dfc194] mb-4">
                <span>✨</span> Luxury QaRd™ Invitation
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
                Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
              </h1>
              <p className="text-xs text-[#dfc194] font-medium tracking-wide">
                Southern Highlands · 14 Nov 2026
              </p>
            </div>

            {/* Luxury QaRd Graphic */}
            <div className="my-6 mx-auto w-full max-w-[280px] bg-gradient-to-b from-[#241c16] to-[#17120e] border border-[#bd9661]/60 rounded-2xl p-6 shadow-2xl relative flex flex-col items-center">
              <div className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-[#bd9661] font-bold font-serif">
                Tap &amp; Toast
              </div>
              <div className="absolute top-3 right-4 text-sm text-[#bd9661]">
                NFC ⚡
              </div>

              <div className="my-5 p-2 bg-white rounded-xl shadow-inner">
                <div
                  dangerouslySetInnerHTML={{
                    __html: generateQrSvg('https://tapandtoast.demo/guest?g=johnson_fam', 130)
                  }}
                />
              </div>

              <div className="font-serif text-base font-bold text-white mb-0.5">
                Mark &amp; Sarah Johnson
              </div>
              <div className="text-[11px] text-[#bd9661] font-semibold">
                Table 4 · Seats 1 &amp; 2
              </div>
              <div className="text-[10px] text-[#a69888] mt-2">
                Fernwood Estate · Grand Pavilion
              </div>
            </div>

            {/* Splash Actions */}
            <div className="space-y-3 mb-4">
              <p className="text-xs text-[#c9bbae] leading-relaxed px-4">
                You are warmly invited to celebrate with us. Tap below to access your guest schedule and table seating.
              </p>
              <button
                type="button"
                onClick={() => setInApp(true)}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <span>✨</span> TAP TO ENTER WEDDING PORTAL &rarr;
              </button>
            </div>

            <div className="w-32 h-1 bg-[#2b221a] rounded-full mx-auto opacity-60" />
          </div>
        ) : (
          /* ============================================================== */
          /* MODE 2: IN-APP SMARTPHONE EXPERIENCES                          */
          /* ============================================================== */
          <div className="flex-1 flex flex-col min-h-0 bg-[#f8f6f2] relative">
            {/* App Header */}
            <header className="bg-[#15110e] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#bd9661] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-xs rounded-xs flex items-center justify-center">
                  T
                </span>
                <span className="font-serif text-sm font-semibold tracking-wide text-white">
                  Tap &amp; Toast
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-[#2a2119] text-[#e6cda6] px-2 py-0.5 rounded border border-[#3d3126]">
                Mark &amp; Sarah
              </span>
            </header>

            {/* In-App Tab Pills */}
            <nav className="bg-[#241c16] px-2 flex items-center gap-1 border-b border-[#382c22] overflow-x-auto no-scrollbar flex-shrink-0">
              {[
                { id: 'rsvp', label: '💌 RSVP & Diet' },
                { id: 'seating', label: '🪑 Your Table' },
                { id: 'schedule', label: '📅 Schedule' },
                { id: 'gifts', label: '🎁 Wishing Well' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === t.id
                      ? 'border-[#bd9661] text-[#e6cda6] bg-[#bd9661]/10'
                      : 'border-transparent text-[#bfaea0] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {/* Scrollable Content Viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm no-scrollbar">
              {/* Auto-dismissable Welcome Greeting */}
              {!welcomeDismissed && (
                <div className="bg-[#fff8ee] border border-[#ebd4b8] border-l-4 border-l-[#bd9661] rounded-lg p-3 text-xs flex items-center justify-between gap-2 shadow-xs">
                  <div>
                    <strong className="text-[#6a4f2b]">Welcome, Mark &amp; Sarah!</strong>
                    <p className="text-[#8c6b43] mt-0.5">Your Table 4 seats are confirmed in the Grand Pavilion.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWelcomeDismissed(true)}
                    className="text-[#bd9661] hover:text-[#15110e] font-bold text-sm px-1.5"
                    title="Dismiss greeting"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* TAB 1: RSVP & DIETARY */}
              {activeTab === 'rsvp' && (
                <div className="space-y-4">
                  {/* Hero Arch */}
                  <div className="bg-[#15110e] text-white p-5 rounded-2xl text-center relative overflow-hidden shadow-md">
                    <div className="text-[10px] tracking-widest uppercase font-bold text-[#bd9661] mb-1">
                      Sophie &amp; James
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white mb-2">
                      Wedding Celebration
                    </h2>
                    <p className="text-xs text-[#c9bbae] mb-4">
                      Fernwood Estate · Southern Highlands
                    </p>
                    <div className="bg-[#241c16] border border-[#3d2f23] rounded-lg py-2 px-3 text-xs text-[#dfc194] font-semibold tracking-wider font-mono">
                      {countdown.formatted}
                    </div>
                  </div>

                  {/* RSVP Status Card */}
                  <div className="bg-white border border-[#e8ded0] border-t-4 border-t-[#bd9661] rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                        RSVP Status
                      </span>
                      <span className="bg-[#e8eee4] text-[#3c6a42] border border-[#d1dfcb] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        ✓ Attending (2 Confirmed)
                      </span>
                    </div>

                    <div className="space-y-2 text-xs border-y border-dashed border-[#e8ded0] py-3 mb-3">
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Guests:</span>
                        <strong className="text-[#15110e]">Mark Johnson &amp; Sarah Johnson</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Assigned Table:</span>
                        <strong className="text-[#bd9661]">Table 4 (Seats 1 &amp; 2)</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8b7b6b]">Dietary:</span>
                        <span className="text-[#15110e] font-medium">{dietaryInput}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b7b6b]">Song Request:</span>
                        <span className="text-[#6b5847] italic">Signed, Sealed, Delivered</span>
                      </div>
                    </div>

                    {!isEditingDietary ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingDietary(true)}
                        className="w-full bg-[#fbf9f6] hover:bg-[#f0ede4] text-[#15110e] border border-[#d5c7b5] font-semibold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        ✎ Update Dietary Preferences
                      </button>
                    ) : (
                      <form onSubmit={handleUpdateDietary} className="space-y-2 pt-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                          Specify Dietary Requirements:
                        </label>
                        <input
                          type="text"
                          value={dietaryInput}
                          onChange={(e) => setDietaryInput(e.target.value)}
                          className="w-full bg-white border border-[#bd9661] rounded p-2 text-xs text-[#15110e] outline-none"
                          placeholder="e.g. 1x Vegetarian, 1x Gluten-Free"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-[#15110e] hover:bg-[#231c17] text-white font-bold py-1.5 rounded text-xs"
                          >
                            Save Updates
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingDietary(false)}
                            className="px-3 bg-white border border-[#d5c7b5] text-[#8b7b6b] rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SEATING CHART */}
              {activeTab === 'seating' && (
                <div className="space-y-4">
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm text-center">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                      Grand Pavilion Seating
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#15110e] mt-1 mb-1">
                      Table 4 · Round Table
                    </h3>
                    <p className="text-xs text-[#8b7b6b] mb-4">
                      Mark &amp; Sarah, you are seated at Dots 1 &amp; 2
                    </p>

                    {/* Circular Diagram */}
                    <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center">
                      {/* Table Hub */}
                      <div className="w-24 h-24 rounded-full border-2 border-[#bd9661] bg-[#faf8f5] shadow-md flex flex-col items-center justify-center z-10">
                        <span className="font-serif font-bold text-sm text-[#15110e]">Table 4</span>
                        <span className="text-[10px] text-[#bd9661] font-semibold">8 Guests</span>
                      </div>

                      {/* 8 Circular Seat Dots */}
                      {[
                        { num: 1, name: 'MJ', isUser: true, title: 'Mark Johnson' },
                        { num: 2, name: 'SJ', isUser: true, title: 'Sarah Johnson' },
                        { num: 3, name: 'PS', isUser: false, title: 'Priya Sharma' },
                        { num: 4, name: 'BR', isUser: false, title: 'Benjamin Ross' },
                        { num: 5, name: 'IF', isUser: false, title: 'Isabella Foster' },
                        { num: 6, name: 'OT', isUser: false, title: 'Oliver Thomas' },
                        { num: 7, name: 'YR', isUser: false, title: 'Yuvraj Rao' },
                        { num: 8, name: 'NP', isUser: false, title: 'Natasha Price' },
                      ].map((seat, idx) => {
                        const angle = (idx * (360 / 8) - 90) * (Math.PI / 180);
                        const radius = 70;
                        const x = Math.round(radius * Math.cos(angle));
                        const y = Math.round(radius * Math.sin(angle));
                        return (
                          <div
                            key={seat.num}
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            title={`${seat.num}: ${seat.title}`}
                            className={`absolute w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform hover:scale-125 cursor-pointer ${
                              seat.isUser
                                ? 'bg-[#bd9661] text-[#15110e] border-2 border-[#15110e] ring-2 ring-[#bd9661]/50'
                                : 'bg-[#201a16] text-[#dfc194] border border-[#4a3a2d]'
                            }`}
                          >
                            {seat.name}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-[#fbf9f6] border border-[#e8ded0] rounded-lg p-3 text-left space-y-1.5 text-xs text-[#4a3e35]">
                      <div className="font-bold text-[#15110e] mb-1">Your Table Companions:</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#bd9661]" />
                        <span><strong>Mark &amp; Sarah Johnson</strong> (You)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#201a16]" />
                        <span>Priya Sharma (The Sharma Family)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#201a16]" />
                        <span>Benjamin Ross &amp; Isabella Foster</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#201a16]" />
                        <span>Oliver Thomas, Yuvraj Rao &amp; Natasha Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SCHEDULE */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                          Wedding Timeline
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#15110e]">
                          Saturday, 14 Nov 2026
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadCalendar}
                        className="bg-[#15110e] hover:bg-[#231c17] text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1"
                      >
                        📅 Add to Calendar
                      </button>
                    </div>

                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#ebdcc9]">
                      {[
                        { time: '1:30 PM', title: 'Guest Arrival & Prelude', desc: 'Main lawn seating, acoustic strings' },
                        { time: '2:00 PM', title: 'Ceremony Commences', desc: 'Processional, vows & ring exchange' },
                        { time: '2:45 PM', title: 'Cocktail Hour & Lawn Canapés', desc: 'Verandah champagne & bridal photos' },
                        { time: '4:00 PM', title: 'Grand Reception Entrance', desc: 'Grand Pavilion banqueting hall' },
                        { time: '5:30 PM', title: 'Toasts & Speeches', desc: 'Parents & bridal party speeches' },
                        { time: '7:15 PM', title: 'Cake Cutting & First Dance', desc: 'Dance floor open to all guests' },
                        { time: '10:15 PM', title: 'Sparkler Courtyard Send-Off', desc: 'Farewell Sophie & James!' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 pl-1 relative">
                          <div className="w-5 h-5 rounded-full bg-[#bd9661] text-[#15110e] text-[10px] font-bold flex items-center justify-center z-10 flex-shrink-0 mt-0.5">
                            •
                          </div>
                          <div className="bg-[#fbf9f6] border border-[#e8ded0] rounded-lg p-2.5 flex-1 text-xs">
                            <div className="font-bold text-[#bd9661] text-[11px]">{item.time}</div>
                            <div className="font-bold text-[#15110e]">{item.title}</div>
                            <div className="text-[#8b7b6b] text-[11px] mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Venue Location Card */}
                  <div className="bg-[#15110e] text-white p-4 rounded-xl text-xs space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#bd9661]">
                      Venue &amp; Parking
                    </div>
                    <div className="font-bold text-sm text-[#dfc194]">Fernwood Estate</div>
                    <p className="text-[#c9bbae] leading-relaxed">
                      124 Range Road, Mittagong NSW 2575. Follow on-site attendant directions to the Main Lawn car park.
                    </p>
                    <a
                      href="https://maps.google.com/?q=Mittagong+NSW"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#dfc194] hover:underline font-semibold mt-1"
                    >
                      📍 Open in Google Maps &rarr;
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 4: WISHING WELL */}
              {activeTab === 'gifts' && (
                <div className="space-y-4">
                  <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                      Gift &amp; Go™
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#15110e] mt-1 mb-1">
                      Digital Wishing Well
                    </h3>
                    <p className="text-xs text-[#8b7b6b] mb-4 leading-relaxed">
                      Your presence at our celebration is the greatest gift of all. If you wish to contribute to our honeymoon through Italy and the Swiss Alps, you may leave a blessing below.
                    </p>

                    <form onSubmit={handleSendWish} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                          From:
                        </label>
                        <input
                          type="text"
                          value="Mark & Sarah Johnson"
                          disabled
                          className="w-full bg-[#fbf9f6] border border-[#d5c7b5] rounded p-2 text-xs text-[#6b5847] cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                          Your Blessing / Loving Note:
                        </label>
                        <textarea
                          rows={3}
                          value={wishInput}
                          onChange={(e) => setWishInput(e.target.value)}
                          placeholder="Wishing you a lifetime of laughter, adventures and love..."
                          className="w-full bg-white border border-[#bd9661] rounded p-2 text-xs text-[#15110e] outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        💌 Send Wedding Blessing
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* In-App Bottom Navigation Dock */}
            <div className="bg-white border-t border-[#e8ded0] flex items-center justify-around py-2 px-1 flex-shrink-0 shadow-xs">
              {[
                { id: 'rsvp', label: 'RSVP', icon: '💌' },
                { id: 'seating', label: 'Table', icon: '🪑' },
                { id: 'schedule', label: 'Timeline', icon: '📅' },
                { id: 'gifts', label: 'Registry', icon: '🎁' },
              ].map((dock) => (
                <button
                  key={dock.id}
                  type="button"
                  onClick={() => setActiveTab(dock.id as any)}
                  className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors flex-1 ${
                    activeTab === dock.id ? 'text-[#bd9661]' : 'text-[#8b7b6b] hover:text-[#15110e]'
                  }`}
                >
                  <span className="text-base leading-none">{dock.icon}</span>
                  <span>{dock.label}</span>
                </button>
              ))}
            </div>

            {/* Phone Home Indicator */}
            <div className="w-32 h-1 bg-[#15110e] rounded-full mx-auto my-1.5 opacity-30 flex-shrink-0" />

            {/* Embedded Joey Chatbot */}
            <JoeyChatbot embeddedInPhone={true} />
          </div>
        )}
      </div>
    </div>
  );
}
