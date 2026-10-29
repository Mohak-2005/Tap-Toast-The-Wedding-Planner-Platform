import React, { useState, useEffect } from 'react';
import { useAppState, showToast, getWeddingCountdown } from '../lib/state';
import { WeddingCountdownCard } from './WeddingCountdownCard';

export default function GuestMobileView() {
  const { state, setState } = useAppState();
  const [activeTab, setActiveTab] = useState<'splash' | 'hub' | 'rsvp' | 'feed' | 'events' | 'table' | 'photos' | 'gifts' | 'story'>('hub');
  const [storyFilter, setStoryFilter] = useState<'all' | 'story' | 'menu' | 'memoriam' | 'party' | 'honeymoon'>('all');
  const [showJoey, setShowJoey] = useState(false);
  
  // RSVP State
  const [rsvpAttending, setRsvpAttending] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dietaryInput, setDietaryInput] = useState<string>('Vegetarian');
  const [songInput, setSongInput] = useState<string>('September — Earth, Wind & Fire');

  // Feed State
  const activeWedding = state.weddings?.[0];
  const countdown = getWeddingCountdown(activeWedding?.date || '2026-11-14T14:00:00');
  const isPastWedding = countdown.days <= 0 && countdown.hours <= 0 && countdown.minutes <= 0;
  const autoPhase: 'pre' | 'married' = isPastWedding ? 'married' : 'pre';
  const [feedNoteType, setFeedNoteType] = useState<'love' | 'thankyou'>('love');
  const [feedText, setFeedText] = useState<string>('');
  const [feedPosts, setFeedPosts] = useState<Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    badge?: string;
    quote: string;
    photo?: string;
    likes: number;
    comments: number;
    userLiked: boolean;
  }>>([
    {
      id: 'f_welcome',
      type: 'note',
      title: 'Sophie & James shared a welcome',
      time: 'Today, 10:00 AM',
      quote: 'Welcome to our celebration portal! We are so overjoyed to have you all celebrating with us at Fernwood Estate.',
      likes: 24,
      comments: 2,
      userLiked: true,
    },
    {
      id: 'f3',
      type: 'note',
      title: 'Aunty Carol left a note',
      time: '2 minutes ago',
      quote: "So excited for you both — can't wait to celebrate! 💕",
      likes: 5,
      comments: 1,
      userLiked: false,
    },
  ]);

  // Gifts State
  const [selectedGiftPreset, setSelectedGiftPreset] = useState<number>(100);
  const [customGiftAmount, setCustomGiftAmount] = useState<string>('');
  const [giftWish, setGiftWish] = useState<string>('Wishing you both a lifetime of happiness...');
  // Customizable Default Gifting Values & Drawer
  const [giftingPresets, setGiftingPresets] = useState<number[]>([50, 100, 150, 250]);
  const [isCustomizePresetsOpen, setIsCustomizePresetsOpen] = useState<boolean>(false);
  const [editPresets, setEditPresets] = useState<string[]>(['50', '100', '150', '250']);

  // Photos State
  const [photosList, setPhotosList] = useState([
    {
      id: 'ph1',
      title: 'Southern Highlands winery ceremony lawn',
      preview: 'Southern Highlands wine...',
      bg: '#e2dad1',
    },
    {
      id: 'ph2',
      title: 'Tasting session at Fernwood Estate',
      preview: 'Tasting session at Fernw...',
      bg: '#dad2c7',
    },
    {
      id: 'ph3',
      title: 'Floral arch preview in natural gum foliage',
      preview: 'Floral arch preview in nat...',
      bg: '#d6cfc4',
    },
    {
      id: 'ph4',
      title: 'Golden hour over the Mittagong ranges',
      preview: 'Golden hour over the Mit...',
      bg: '#dfd7cc',
    },
  ]);

  // Joey Chatbot inside Mobile
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'joey' | 'user';
    text?: string;
    isActionCard?: boolean;
    actionDetails?: {
      title: string;
      description: string;
    };
    time: string;
  }>>([
    {
      id: 'm1',
      sender: 'joey',
      text: 'Hello, I am Joey, your wedding assistant.',
      time: 'Just now',
    },
    {
      id: 'm2',
      sender: 'joey',
      text: 'How may I help you?',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Handle Send Gift
  const handleSendGift = () => {
    const amount = customGiftAmount ? parseFloat(customGiftAmount) : selectedGiftPreset;
    if (!amount || isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid gift amount', 'error');
      return;
    }
    const newGift = {
      id: 'gf_' + Date.now(),
      guestName: 'Priya Sharma',
      amount,
      type: 'wishing-well',
      date: 'Today',
      message: giftWish || 'Wishing you both a lifetime of happiness!',
      thankYouSent: false,
      thankYouStatus: 'Due' as const,
    };
    setState({
      ...state,
      gifts: [newGift, ...(state.gifts || [])],
    });
    showToast(`Payment of $${amount} AUD processed! Sophie & James thank you warmly.`, 'success');
    setCustomGiftAmount('');
  };

  // Handle Post Feed Note
  const handlePostNote = () => {
    if (!feedText.trim()) return;
    const newPost = {
      id: 'f_' + Date.now(),
      type: 'note',
      title: 'Priya Sharma left a note',
      time: 'Just now',
      quote: feedText,
      likes: 1,
      comments: 0,
      userLiked: true,
    };
    setFeedPosts([newPost, ...feedPosts]);
    setFeedText('');
    showToast('Love note posted to celebration feed!', 'success');
  };

  // Toggle Like on feed post
  const toggleLike = (postId: string) => {
    setFeedPosts(feedPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          userLiked: !p.userLiked,
        };
      }
      return p;
    }));
  };

  // Joey Interaction Helper
  const handleJoeyPrompt = (prompt: string) => {
    const userMsgId = 'u_' + Date.now();
    const newMsgs = [...chatMessages, {
      id: userMsgId,
      sender: 'user' as const,
      text: prompt,
      time: 'Just now',
    }];

    if (prompt.toLowerCase().includes('diet') || prompt.toLowerCase().includes('vegetarian')) {
      newMsgs.push({
        id: 'j_' + (Date.now() + 1),
        sender: 'joey' as const,
        text: "I've prepared that change for you:",
        isActionCard: true,
        actionDetails: {
          title: 'Changing diet to vegetarian',
          description: 'Update guest dietary requirement to Vegetarian for Priya Sharma?',
        },
        time: 'Just now',
      });
    } else if (prompt.toLowerCase().includes('accept')) {
      setRsvpAttending(true);
      newMsgs.push({
        id: 'j_' + (Date.now() + 1),
        sender: 'joey' as const,
        text: 'Your RSVP has been updated to Joyfully Accepted (2 guests). Looking forward to seeing you at Fernwood Estate!',
        time: 'Just now',
      });
    } else if (prompt.toLowerCase().includes('decline')) {
      setRsvpAttending(false);
      newMsgs.push({
        id: 'j_' + (Date.now() + 1),
        sender: 'joey' as const,
        text: 'We are sorry you cannot make it. Your RSVP has been recorded as Regretfully Declined.',
        time: 'Just now',
      });
    } else {
      newMsgs.push({
        id: 'j_' + (Date.now() + 1),
        sender: 'joey' as const,
        text: `I've noted: "${prompt}". Feel free to check the Schedule or Table tabs anytime.`,
        time: 'Just now',
      });
    }
    setChatMessages(newMsgs);
  };

  const handleConfirmJoeyDietAction = (accepted: boolean) => {
    if (accepted) {
      setDietaryInput('Vegetarian');
      showToast('Dietary updated to Vegetarian for Priya Sharma', 'success');
      setChatMessages(prev => [...prev, {
        id: 'j_conf_' + Date.now(),
        sender: 'joey',
        text: '✓ Dietary requirement successfully updated to Vegetarian.',
        time: 'Just now',
      }]);
    } else {
      showToast('Action cancelled', 'info');
      setChatMessages(prev => [...prev, {
        id: 'j_conf_' + Date.now(),
        sender: 'joey',
        text: 'Change cancelled.',
        time: 'Just now',
      }]);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-45px)] overflow-hidden font-sans select-none">
      {/* 402x874 Phone Chassis matching Screenshot 1-9 & guest-mobile.html */}
      <div className="w-[402px] max-w-[402px] h-[874px] max-h-[calc(100vh-60px)] rounded-[46px] border-[4px] border-[#1c1511] bg-[#f8f6f2] shadow-[0_20px_60px_rgba(21,17,14,0.22),_0_4px_14px_rgba(21,17,14,0.08)] overflow-hidden relative flex flex-col">
        
        {/* Phone Status Bar */}
        <div className={`flex justify-between items-center px-6 pt-3 pb-2 text-[13px] font-bold z-20 flex-shrink-0 transition-colors ${activeTab === 'splash' ? 'bg-[#15110e] text-white' : 'bg-[#f8f6f2] text-[#15110e]'}`}>
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[#bd9661] font-bold">5G</span>
            <div className={`w-5 h-2.5 border-[1.5px] rounded-xs p-0.5 flex items-center relative ${activeTab === 'splash' ? 'border-white' : 'border-[#15110e]'}`}>
              <div className="w-[85%] h-full bg-[#bd9661] rounded-[1px]" />
              <div className={`absolute -right-1 top-0.5 w-[2px] h-1 rounded-r-xs ${activeTab === 'splash' ? 'bg-white' : 'bg-[#15110e]'}`} />
            </div>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          
          {/* ============================================================== */}
          {/* SCREEN: INVITATION SPLASH / QR (Screenshot 1: 172526.png)       */}
          {/* ============================================================== */}
          {activeTab === 'splash' && (
            <div className="flex-1 flex flex-col items-center justify-between p-6 bg-[#15110e] text-white text-center min-h-[750px]">
              {/* Brand Header */}
              <div className="flex items-center gap-2 mt-4">
                <div className="w-8 h-8 rounded border border-[#bd9661] flex items-center justify-center font-serif text-[#bd9661] text-base font-bold">
                  T
                </div>
                <span className="font-serif text-lg tracking-wide text-white">Tap &amp; Toast</span>
              </div>

              {/* Arch Motif & Invitation Text */}
              <div className="flex flex-col items-center my-auto w-full px-4">
                {/* Dotted Arch SVG */}
                <div className="w-24 h-14 mb-4 flex items-center justify-center text-[#bd9661]">
                  <svg viewBox="0 0 100 60" width="90" height="54" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4">
                    <path d="M 10 55 A 40 40 0 0 1 90 55" />
                  </svg>
                </div>

                <div className="text-[11px] uppercase tracking-[0.25em] text-[#dfc194] font-bold mb-2">
                  You're Invited
                </div>
                <h1 className="font-serif text-3xl font-bold text-white mb-2 leading-tight">
                  Sophie <span className="text-[#dfc194] italic font-normal">&amp;</span> James
                </h1>
                <p className="text-xs text-[#c9bbae] mb-6">
                  Saturday, 14 Nov 2026 &bull; Fernwood Estate
                </p>

                {/* White QR Card */}
                <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center mb-6 w-[200px] h-[200px]">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=https://taptoast.demo/wedding/sophie-james?guest=priya"
                    alt="Wedding QR Code"
                    className="w-[170px] h-[170px] object-contain"
                  />
                </div>

                <div className="text-[11px] uppercase tracking-wider text-[#dfc194] font-bold mb-1">
                  Scan to Open Your Invitation
                </div>
                <div className="text-xs text-[#c9bbae]">
                  For the Whitfield family
                </div>
              </div>

              {/* Enter Button */}
              <div className="w-full pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('hub')}
                  className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-serif font-bold text-base py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Tap to Enter &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: HUB (Screenshot 2: 172534.png)                             */}
          {/* ============================================================== */}
          {activeTab === 'hub' && (
            <div className="p-4 space-y-3.5">
              {/* Welcome Header */}
              <div className="mt-2 text-left px-1">
                <h1 className="font-serif text-[28px] font-bold text-[#15110e] leading-tight mb-1">
                  Welcome, Priya
                </h1>
                <div className="text-base text-[#15110e] font-serif font-medium">
                  Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James's Wedding
                </div>
                <div className="text-xs text-[#8b7b6b] mt-0.5">
                  Fernwood Estate &bull; 14 Nov 2026
                </div>
              </div>

              {/* Prominent Wedding Countdown Card */}
              <WeddingCountdownCard
                targetDate={activeWedding?.date || '2026-11-14T14:00:00'}
                coupleName={activeWedding?.couple || 'Sophie & James'}
                venueName={activeWedding?.venue || 'Fernwood Estate'}
                dateDisplay={activeWedding?.dateDisplay || '14 Nov 2026'}
                variant="compact"
              />

              {/* 2x2 Hub Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Tile 1: Today's Schedule */}
                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="bg-[#1c1612] text-white border border-[#2e231a] rounded-xl p-3.5 text-left shadow-sm hover:scale-[1.01] transition-transform flex flex-col justify-between h-[116px] cursor-pointer"
                >
                  <div className="w-7 h-7 flex items-center justify-center text-[#dfc194]">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#dfc194]">Today's Schedule</div>
                    <div className="text-xs text-[#e8ded0]">Ceremony at 2:00 PM</div>
                  </div>
                </button>

                {/* Tile 2: My Table */}
                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className="bg-white border border-[#e8ded0] rounded-xl p-3.5 text-left shadow-sm hover:scale-[1.01] transition-transform flex flex-col justify-between h-[116px] cursor-pointer"
                >
                  <div className="w-7 h-7 flex items-center justify-center text-[#bd9661]">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="12" cy="3" r="2" />
                      <circle cx="12" cy="21" r="2" />
                      <circle cx="3" cy="12" r="2" />
                      <circle cx="21" cy="12" r="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#15110e]">My Table</div>
                    <div className="text-xs text-[#8b7b6b]">Table 4, Seat 4</div>
                  </div>
                </button>

                {/* Tile 3: Photo Wall */}
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="bg-white border border-[#e8ded0] rounded-xl p-3.5 text-left shadow-sm hover:scale-[1.01] transition-transform flex flex-col justify-between h-[116px] cursor-pointer"
                >
                  <div className="w-7 h-7 flex items-center justify-center text-[#bd9661]">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#15110e]">Photo Wall</div>
                    <div className="text-xs text-[#8b7b6b]">Add &amp; browse photos</div>
                  </div>
                </button>

                {/* Tile 4: Gift & Go */}
                <button
                  type="button"
                  onClick={() => setActiveTab('gifts')}
                  className="bg-white border border-[#e8ded0] rounded-xl p-3.5 text-left shadow-sm hover:scale-[1.01] transition-transform flex flex-col justify-between h-[116px] cursor-pointer"
                >
                  <div className="w-7 h-7 flex items-center justify-center text-[#bd9661]">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#15110e]">Gift &amp; Go</div>
                    <div className="text-xs text-[#8b7b6b]">Send a gift</div>
                  </div>
                </button>
              </div>

              {/* Wide Banner: Our Story & Details */}
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className="w-full bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#bd9661] hover:shadow-md transition-all active:scale-[0.99] text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <div className="font-bold text-sm text-[#15110e]">Our Story &amp; Details</div>
                    <div className="text-[11px] text-[#8b7b6b]">Story, memoriam, dinner menu &amp; updates</div>
                  </div>
                </div>
                <div className="text-xs text-[#bd9661] font-semibold">&rarr;</div>
              </button>

              {/* Celebration Feed Section Preview */}
              <div className="pt-1">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h2 className="font-serif text-[18px] font-bold text-[#15110e]">
                    Celebration Feed
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className="text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                  >
                    View all &rarr;
                  </button>
                </div>

                {/* Feed Card */}
                <div className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#faf6f0] border border-[#ebd3a8] flex items-center justify-center text-lg">
                        🎁
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#15110e]">Thank You, The Whitfield family!</div>
                        <div className="text-[10px] text-[#8b7b6b]">Just now</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#6b5849] italic bg-[#faf8f5] p-2.5 rounded-lg border-l-2 border-[#bd9661] leading-relaxed">
                    "Dear The Whitfield family, thank you so much for your wonderful and generous gift of $250! It means the world to have your love and support as we begin our new chapter together. Love, Sophie &amp; James."
                  </p>

                  <div className="pt-1 flex items-center gap-4 text-[11px] text-[#8b7b6b]">
                    <span>❤️ 3 Likes</span>
                    <span>💬 0 Comments</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: RSVP (Screenshot 3: 172542.png)                             */}
          {/* ============================================================== */}
          {activeTab === 'rsvp' && (
            <div className="p-4 space-y-4">
              {/* Arched Card */}
              <div className="bg-[#15110e] text-white p-5 rounded-3xl text-center shadow-md relative overflow-hidden">
                <div className="w-20 h-10 mx-auto mb-2 text-[#bd9661] opacity-70">
                  <svg viewBox="0 0 100 50" width="80" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3">
                    <path d="M 10 45 A 40 40 0 0 1 90 45" />
                  </svg>
                </div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[#bd9661] mb-1">
                  You're Invited
                </div>
                <h2 className="font-serif text-2xl font-bold text-white mb-1">
                  Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
                </h2>
                <div className="text-xs text-[#c9bbae]">
                  Saturday, 14 Nov 2026 &bull; 2:00 PM
                </div>
                <div className="text-[11px] text-[#a69888] mt-0.5">
                  Fernwood Estate, Southern Highlands
                </div>
                <div className="w-12 h-[1px] bg-[#bd9661] mx-auto mt-3 opacity-60" />
              </div>

              {/* Greeting */}
              <div className="text-center px-2">
                <p className="text-xs text-[#15110e] font-medium leading-relaxed">
                  Hi <strong>Priya</strong> &mdash; we'd love for you to celebrate with us. Let us know if you can make it.
                </p>
              </div>

              {/* Decision Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRsvpAttending(true);
                    showToast('RSVP: Joyfully Accepted selected', 'success');
                  }}
                  className={`py-3 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    rsvpAttending
                      ? 'bg-[#15110e] text-white shadow-sm'
                      : 'bg-white text-[#15110e] border border-[#e8ded0] hover:bg-[#faf8f5]'
                  }`}
                >
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRsvpAttending(false);
                    showToast('RSVP: Regretfully Declines selected', 'info');
                  }}
                  className={`py-3 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    !rsvpAttending
                      ? 'bg-[#15110e] text-white shadow-sm'
                      : 'bg-white text-[#15110e] border border-[#e8ded0] hover:bg-[#faf8f5]'
                  }`}
                >
                  Regretfully Declines
                </button>
              </div>

              {/* Guests Attending Counter */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b] mb-1.5">
                  Guests Attending
                </label>
                <div className="bg-white border border-[#e8ded0] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-9 h-9 rounded-full bg-[#f8f6f2] hover:bg-[#e8ded0] text-[#15110e] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    &minus;
                  </button>
                  <span className="font-bold text-sm text-[#15110e]">
                    {guestCount} guests
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestCount(guestCount + 1)}
                    className="w-9 h-9 rounded-full bg-[#f8f6f2] hover:bg-[#e8ded0] text-[#15110e] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    &#43;
                  </button>
                </div>
              </div>

              {/* Dietary Requirements */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b] mb-1.5">
                  Dietary Requirements
                </label>
                <input
                  type="text"
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  placeholder="e.g. Vegetarian, Gluten-Free, Nut allergy"
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-xs"
                />
              </div>

              {/* Song Request */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b] mb-1.5">
                  Song That'll Get You on the Dance Floor
                </label>
                <input
                  type="text"
                  value={songInput}
                  onChange={(e) => setSongInput(e.target.value)}
                  placeholder="e.g. September by Earth Wind & Fire"
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-xs"
                />
              </div>

              {/* Save RSVP Button */}
              <button
                type="button"
                onClick={() => showToast('RSVP preferences confirmed and saved!', 'success')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                Update &amp; Confirm RSVP
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: FEED (Screenshots 4 & 5: 172551.png & 172557.png)         */}
          {/* ============================================================== */}
          {activeTab === 'feed' && (
            <div className="p-4 space-y-3.5">
              {/* Header Countdown Banner */}
              <div className="bg-[#15110e] text-white p-4 rounded-2xl text-center shadow-md">
                <h2 className="font-serif text-xl font-bold text-white mb-2">
                  Sophie <span className="text-[#bd9661] italic font-normal">&amp;</span> James
                </h2>
                <div className="inline-block bg-[#231c17] border border-[#3d2e24] text-[#dfc194] text-[11px] font-bold px-3 py-1 rounded-full">
                  {countdown.days > 0 ? `${countdown.days} days : ${countdown.hours} hrs : ${countdown.minutes} mins : ${countdown.seconds} secs remaining` : 'Celebration Day & Married'}
                </div>
              </div>


              {/* Post a Love Note Card */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-sm space-y-3">
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                  Post a Love Note
                </div>

                {/* Sub-tabs: Love Note vs Wedding Thank-You */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedNoteType('love')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      feedNoteType === 'love'
                        ? 'bg-[#bd9661] text-[#15110e]'
                        : 'bg-white border border-[#e8ded0] text-[#15110e]'
                    }`}
                  >
                    <span>💌</span> Love Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedNoteType('thankyou')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      feedNoteType === 'thankyou'
                        ? 'bg-[#bd9661] text-[#15110e]'
                        : 'bg-white border border-[#e8ded0] text-[#15110e]'
                    }`}
                  >
                    <span>🥂</span> Wedding Thank-You
                  </button>
                </div>

                {/* Prompt Carousel Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  <button
                    type="button"
                    onClick={() => setFeedText('So excited to celebrate with you both!')}
                    className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    ✨ So excited to celebrate!
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedText('Wishing you a lifetime of endless happiness and love!')}
                    className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    🥂 Lifetime of happiness
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  value={feedText}
                  onChange={(e) => setFeedText(e.target.value)}
                  placeholder="Send Sophie &amp; James a lovely message..."
                  rows={3}
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-xs resize-none"
                />

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={handlePostNote}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-lg text-xs shadow-xs cursor-pointer transition-all"
                  >
                    Post Note
                  </button>
                </div>
              </div>

              {/* Feed Items List */}
              <div className="space-y-3 pt-1">
                {feedPosts.map((post) => (
                  <div key={post.id} className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#ebd3a8] flex items-center justify-center text-base">
                          {post.type === 'thankyou' ? '🎁' : post.type === 'milestone' ? '⭐' : '✉️'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#15110e]">{post.title}</div>
                          <div className="text-[10px] text-[#8b7b6b]">{post.time}</div>
                        </div>
                      </div>
                    </div>

                    {post.badge && (
                      <div className="text-[11px] text-[#8b7b6b] font-medium">
                        {post.badge}
                      </div>
                    )}

                    {post.quote && (
                      <div className="text-xs text-[#6b5849] italic bg-[#faf8f5] p-2.5 rounded-lg border-l-2 border-[#bd9661] leading-relaxed">
                        "{post.quote}"
                      </div>
                    )}

                    <div className="pt-1 flex items-center gap-4 text-[11px] text-[#8b7b6b]">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 cursor-pointer hover:text-[#bd9661] ${post.userLiked ? 'text-[#c54b38] font-bold' : ''}`}
                      >
                        ❤️ {post.likes} Likes
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Comments drawer', 'info')}
                        className="flex items-center gap-1 cursor-pointer hover:text-[#bd9661]"
                      >
                        💬 {post.comments} Comments
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: EVENTS / SCHEDULE (Screenshot 6: 172606.png)              */}
          {/* ============================================================== */}
          {activeTab === 'events' && (
            <div className="p-4 space-y-4">
              <div className="mt-1 px-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661] mb-0.5">
                  Order of Events
                </div>
                <h1 className="font-serif text-2xl font-bold text-[#15110e] leading-tight mb-1">
                  Today's Schedule
                </h1>
                <div className="text-xs text-[#8b7b6b]">
                  Saturday, 14 November 2026 &bull; Fernwood Estate
                </div>
              </div>

              {/* Timeline Container */}
              <div className="relative pl-6 space-y-6 pt-2">
                {/* Continuous Vertical Timeline Line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#bd9661]" />

                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white ring-2 ring-[#bd9661]/40" />
                  <div className="text-xs font-bold text-[#bd9661] mb-0.5">2:00 PM</div>
                  <h3 className="font-bold text-sm text-[#15110e]">Wedding Ceremony</h3>
                  <p className="text-xs text-[#8b7b6b] mt-0.5 leading-relaxed">
                    The Meadow Lawn. Please be seated 15 minutes prior.
                  </p>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white ring-2 ring-[#bd9661]/40" />
                  <div className="text-xs font-bold text-[#bd9661] mb-0.5">2:45 PM</div>
                  <h3 className="font-bold text-sm text-[#15110e]">Cocktails &amp; Canap&eacute;s</h3>
                  <p className="text-xs text-[#8b7b6b] mt-0.5 leading-relaxed">
                    The Verandah &amp; Estate Gardens.
                  </p>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white ring-2 ring-[#bd9661]/40" />
                  <div className="text-xs font-bold text-[#bd9661] mb-0.5">4:00 PM</div>
                  <h3 className="font-bold text-sm text-[#15110e]">Grand Reception Seating</h3>
                  <p className="text-xs text-[#8b7b6b] mt-0.5 leading-relaxed">
                    The Grand Pavilion. Welcome toasts and entrance.
                  </p>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white ring-2 ring-[#bd9661]/40" />
                  <div className="text-xs font-bold text-[#bd9661] mb-0.5">5:30 PM</div>
                  <h3 className="font-bold text-sm text-[#15110e]">Dinner &amp; Speeches</h3>
                  <p className="text-xs text-[#8b7b6b] mt-0.5 leading-relaxed">
                    Main dining hall. Three-course seasonal dining.
                  </p>
                </div>

                {/* Event 5 */}
                <div className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white ring-2 ring-[#bd9661]/40" />
                  <div className="text-xs font-bold text-[#bd9661] mb-0.5">7:15 PM</div>
                  <h3 className="font-bold text-sm text-[#15110e]">Cake Cutting &amp; First Dance</h3>
                  <p className="text-xs text-[#8b7b6b] mt-0.5 leading-relaxed">
                    Dance floor opens with live band.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: TABLE (Screenshot 7: 172617.png)                           */}
          {/* ============================================================== */}
          {activeTab === 'table' && (() => {
            const priyaGuest = state.guests.find(g => g.id === 'priya' || g.name.toLowerCase().includes('priya'));
            const myTable = priyaGuest?.tableId ? state.tables.find(t => t.id === priyaGuest.tableId) : null;
            const tableGuests = myTable ? state.guests.filter(g => g.tableId === myTable.id) : [];
            const capacity = myTable?.capacity || 8;
            const mySeatIndex = priyaGuest?.seatIndex ?? 3;

            return (
              <div className="p-4 space-y-4">
                <div className="mt-1 px-1">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661] mb-0.5">
                    Your Seating
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-[#15110e] leading-tight mb-1">
                    My Table
                  </h1>
                  <div className="text-xs text-[#8b7b6b]">
                    Confirmed Seating &bull; Live Guest Experience
                  </div>
                </div>

                {/* Circular / Banquet Graphic */}
                <div className="bg-[#fbf9f5] border border-[#e8ded0] rounded-2xl p-6 relative flex flex-col items-center justify-center shadow-xs overflow-hidden min-h-[300px]">
                  {/* Dotted Grid Background */}
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage: 'radial-gradient(#8b7b6b 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {myTable ? (
                    <>
                      {/* Circular arrangement container */}
                      <div className="relative w-[210px] h-[210px] flex items-center justify-center z-10">
                        {/* Outer circle line */}
                        <div className="absolute inset-0 rounded-full border border-[#bd9661]/60" />

                        {/* Center Table Circle */}
                        <div className="w-[110px] h-[110px] rounded-full bg-white border border-[#bd9661] flex flex-col items-center justify-center shadow-sm z-10 text-center p-2">
                          <span className="font-serif text-sm font-bold text-[#15110e] line-clamp-2 leading-tight">
                            {myTable.name}
                          </span>
                          <span className="text-xs text-[#8b7b6b] font-medium mt-0.5">
                            {tableGuests.length} / {capacity}
                          </span>
                        </div>

                        {/* Dynamic Outer Seat Badges */}
                        {Array.from({ length: Math.min(12, capacity) }).map((_, idx) => {
                          const angle = idx * (360 / Math.min(12, capacity));
                          const radius = 86;
                          const rad = ((angle - 90) * Math.PI) / 180;
                          const x = radius * Math.cos(rad);
                          const y = radius * Math.sin(rad);

                          const occupant = tableGuests.find((g) => g.seatIndex === idx) || (idx === mySeatIndex ? priyaGuest : null);
                          const isMe = occupant?.id === priyaGuest?.id || idx === mySeatIndex;
                          const initials = isMe ? 'PS' : occupant ? (occupant.initials || occupant.name.slice(0, 2).toUpperCase()) : `#${idx + 1}`;

                          return (
                            <div
                              key={idx}
                              style={{
                                transform: `translate(${x}px, ${y}px)`,
                              }}
                              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs cursor-pointer ${
                                isMe
                                  ? 'bg-[#dfc194] text-[#15110e] border-2 border-[#15110e] ring-2 ring-[#bd9661] z-20'
                                  : occupant
                                  ? 'bg-[#15110e] text-[#dfc194] border border-[#3d2e24]'
                                  : 'bg-white text-[#8b7b6b] border border-dashed border-[#d5c7b5]'
                              }`}
                              title={occupant ? `${occupant.name}${isMe ? ' (You)' : ''}` : `Vacant Seat ${idx + 1}`}
                            >
                              {initials}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 text-xs font-bold text-[#bd9661] z-10 text-center">
                        Seat {mySeatIndex + 1} &bull; {priyaGuest?.name || 'Priya Sharma'}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 z-10 space-y-2">
                      <div className="text-2xl">🥂</div>
                      <div className="font-serif text-sm font-bold text-[#15110e]">Seating in Progress</div>
                      <p className="text-xs text-[#8b7b6b] max-w-xs">
                        Sophie &amp; James are finalizing the table arrangements. Your table and place setting will appear here soon!
                      </p>
                    </div>
                  )}
                </div>

                {/* Tablemates List */}
                {myTable && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-serif text-base font-bold text-[#15110e]">
                        Your Tablemates
                      </h3>
                      <span className="text-xs text-[#8b7b6b]">
                        {tableGuests.length} Guests
                      </span>
                    </div>

                    {tableGuests.map((guest, idx) => {
                      const isMe = guest.id === priyaGuest?.id;
                      return (
                        <div
                          key={guest.id || idx}
                          className={`bg-white border rounded-xl p-3 flex items-center justify-between shadow-xs ${
                            isMe ? 'border-[#bd9661] bg-[#faf8f5]' : 'border-[#e8ded0]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                                isMe ? 'bg-[#bd9661] text-[#15110e]' : 'bg-[#15110e] text-[#dfc194]'
                              }`}
                            >
                              {guest.initials || guest.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#15110e] flex items-center gap-1.5">
                                <span>{guest.name}</span>
                                {isMe && <span className="text-[10px] bg-[#bd9661]/20 text-[#916c3d] px-1 rounded font-bold">You</span>}
                              </div>
                              <div className="text-[10px] text-[#8b7b6b]">
                                Seat {(guest.seatIndex !== undefined && guest.seatIndex !== null) ? guest.seatIndex + 1 : idx + 1}
                                {guest.household && ` • ${guest.household}`}
                              </div>
                            </div>
                          </div>
                          {guest.dietary && guest.dietary !== 'None' && (
                            <span className="text-[9.5px] bg-[#fff1f0] text-[#c93b2b] px-2 py-0.5 rounded-full font-semibold">
                              {guest.dietary}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ============================================================== */}
          {/* TAB: PHOTOS (Screenshot 8: 172628.png)                          */}
          {/* ============================================================== */}
          {activeTab === 'photos' && (
            <div className="p-4 space-y-4">
              <div className="mt-1 px-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661] mb-0.5">
                  Shared Memories
                </div>
                <h1 className="font-serif text-2xl font-bold text-[#15110e] leading-tight mb-1">
                  Photo Wall
                </h1>
                <div className="text-xs text-[#8b7b6b]">
                  Capture the moments! Snap a photo today and share it with the room.
                </div>
              </div>

              {/* Upload a Photo Button */}
              <button
                type="button"
                onClick={() => {
                  const newPhoto = {
                    id: 'ph_' + Date.now(),
                    title: 'New guest snapshot',
                    preview: 'Uploaded just now...',
                    bg: '#ded6cc',
                  };
                  setPhotosList([newPhoto, ...photosList]);
                  showToast('Photo uploaded to wedding gallery!', 'success');
                }}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>📷</span> Upload a Photo
              </button>

              {/* 2x2 Photo Cards Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {photosList.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl overflow-hidden border border-[#d5c7b5] shadow-xs flex flex-col h-[180px]"
                    style={{ backgroundColor: photo.bg }}
                  >
                    <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-xl mb-1 opacity-70">📷</span>
                      <p className="font-serif italic text-xs text-[#4a3b2c] leading-tight line-clamp-3">
                        {photo.title}
                      </p>
                    </div>
                    <div className="bg-[#15110e] text-white p-2 text-[10px] truncate text-center font-medium">
                      {photo.preview}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: GIFTS (Screenshot 9: 172633.png)                           */}
          {/* ============================================================== */}
          {activeTab === 'gifts' && (
            <div className="p-4 space-y-4">
              <div className="mt-1 px-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661] mb-0.5">
                  Digital Wishing Well
                </div>
                <h1 className="font-serif text-2xl font-bold text-[#15110e] leading-tight mb-1">
                  Gift &amp; Go
                </h1>
                <div className="text-xs text-[#8b7b6b] leading-relaxed">
                  Your presence is our present. If you would like to contribute towards our honeymoon in Queenstown, you can gift securely below.
                </div>
              </div>

              {/* Customizable Presets Header */}
              <div className="flex items-center justify-between pt-1 px-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                  Select Amount
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditPresets(giftingPresets.map(String));
                    setIsCustomizePresetsOpen(!isCustomizePresetsOpen);
                  }}
                  className="text-[11px] font-bold text-[#bd9661] hover:underline cursor-pointer"
                >
                  {isCustomizePresetsOpen ? 'Hide Customizer' : 'Customize Values'}
                </button>
              </div>

              {/* Inline Customizer Drawer */}
              {isCustomizePresetsOpen && (
                <div className="bg-[#faf8f5] border border-[#bd9661]/40 rounded-2xl p-3.5 space-y-3 animate-in fade-in duration-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#15110e]">Customize Default Presets</span>
                    <span className="text-[10px] text-[#8b7b6b]">4 preset values</span>
                  </div>

                  {/* Preset Packs Quick Select */}
                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-[#8b7b6b] mb-1.5">
                      Quick Preset Packs
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {[
                        { name: 'Standard', vals: [50, 100, 150, 250] },
                        { name: 'Generous', vals: [100, 200, 350, 500] },
                        { name: 'Intimate', vals: [30, 60, 90, 120] },
                        { name: 'Luxury', vals: [150, 300, 500, 1000] },
                      ].map((pack) => (
                        <button
                          key={pack.name}
                          type="button"
                          onClick={() => {
                            setGiftingPresets(pack.vals);
                            setEditPresets(pack.vals.map(String));
                            setSelectedGiftPreset(pack.vals[1]);
                            showToast(`Applied ${pack.name} preset pack`, 'info');
                          }}
                          className="bg-white border border-[#e8ded0] hover:border-[#bd9661] p-1.5 rounded-lg text-center cursor-pointer transition-colors"
                        >
                          <div className="font-bold text-[10px] text-[#15110e]">{pack.name}</div>
                          <div className="text-[8.5px] text-[#8b7b6b] mt-0.5">${pack.vals[0]}-${pack.vals[3]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4 Editable Value Inputs */}
                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-[#8b7b6b] mb-1.5">
                      Or Enter Custom Dollar Amounts (AUD)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {editPresets.map((val, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute left-2.5 top-2 text-xs text-[#8b7b6b]">$</span>
                          <input
                            type="number"
                            value={val}
                            onChange={(e) => {
                              const next = [...editPresets];
                              next[idx] = e.target.value;
                              setEditPresets(next);
                            }}
                            className="w-full bg-white border border-[#e8ded0] rounded-xl py-1.5 pl-6 pr-2 text-xs text-center font-bold text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = editPresets.map((v) => parseInt(v, 10)).filter((n) => !isNaN(n) && n > 0);
                        if (parsed.length === 4) {
                          setGiftingPresets(parsed);
                          setSelectedGiftPreset(parsed[1] || parsed[0]);
                          setIsCustomizePresetsOpen(false);
                          showToast('Custom default presets saved!', 'success');
                        } else {
                          showToast('Please enter 4 valid positive numbers', 'error');
                        }
                      }}
                      className="flex-1 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] font-bold py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Save &amp; Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGiftingPresets([50, 100, 150, 250]);
                        setEditPresets(['50', '100', '150', '250']);
                        setSelectedGiftPreset(100);
                        showToast('Reset to default presets: $50, $100, $150, $250', 'info');
                      }}
                      className="bg-white border border-[#d5c7b5] text-[#8b7b6b] hover:text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Preset Amount Cards */}
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                {giftingPresets.map((amt) => {
                  const isSelected = selectedGiftPreset === amt && !customGiftAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedGiftPreset(amt);
                        setCustomGiftAmount('');
                      }}
                      className={`py-4 rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#faf8f5] text-[#bd9661] border-2 border-[#bd9661] shadow-xs'
                          : 'bg-white text-[#15110e] border border-[#e8ded0] hover:bg-[#faf8f5]'
                      }`}
                    >
                      <span>${amt} AUD</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Increment Chips */}
              <div>
                <label className="block text-[9.5px] font-bold tracking-wider uppercase text-[#8b7b6b] mb-1.5">
                  Quick Adjust Amount
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {[25, 50, 100].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => {
                        const currentVal = customGiftAmount ? parseFloat(customGiftAmount) : selectedGiftPreset;
                        const newVal = (currentVal || 0) + inc;
                        setCustomGiftAmount(newVal.toString());
                      }}
                      className="bg-white border border-[#e8ded0] hover:border-[#bd9661] text-[#15110e] font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap shadow-2xs"
                    >
                      +${inc}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const currentVal = customGiftAmount ? parseFloat(customGiftAmount) : selectedGiftPreset;
                      const rounded = Math.ceil((currentVal || 100) / 100) * 100;
                      setCustomGiftAmount(rounded.toString());
                    }}
                    className="bg-white border border-[#e8ded0] hover:border-[#bd9661] text-[#15110e] font-bold text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap shadow-2xs"
                  >
                    Round to $100
                  </button>
                  {customGiftAmount && (
                    <button
                      type="button"
                      onClick={() => setCustomGiftAmount('')}
                      className="text-[11px] text-[#a8382c] font-bold px-2 py-1.5 cursor-pointer hover:underline whitespace-nowrap"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b] mb-1.5">
                  Custom Amount (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#8b7b6b]">$</span>
                  <input
                    type="number"
                    value={customGiftAmount}
                    onChange={(e) => {
                      setCustomGiftAmount(e.target.value);
                    }}
                    placeholder="e.g. 300"
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-3 pl-7 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-xs font-semibold"
                  />
                </div>
              </div>

              {/* Personalised Wish */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                    Personalised Wish
                  </label>
                  <button
                    type="button"
                    onClick={() => setGiftWish('May your love grow stronger with each passing year! Wishing you a lifetime of joy and adventures together. 💕')}
                    className="text-[10px] text-[#bd9661] font-bold hover:underline cursor-pointer"
                  >
                    Insert sample wish
                  </button>
                </div>
                <textarea
                  value={giftWish}
                  onChange={(e) => setGiftWish(e.target.value)}
                  placeholder="Wishing you both a lifetime of happiness..."
                  rows={3}
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-xs resize-none"
                />
              </div>

              {/* Payment Submit Button */}
              <button
                type="button"
                onClick={handleSendGift}
                className="w-full bg-[#15110e] hover:bg-[#231c17] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Send</span>
                <span className="text-[#dfc194]">
                  ${customGiftAmount || selectedGiftPreset} AUD
                </span>
                <span>via Card / Apple Pay</span>
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: OUR STORY & DETAILS                                       */}
          {/* ============================================================== */}
          {activeTab === 'story' && (
            <div className="p-4 space-y-4 animate-in fade-in duration-200">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('hub')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e8ded0] text-xs font-bold text-[#bd9661] hover:bg-[#faf8f5] shadow-xs cursor-pointer transition-colors"
                >
                  <span>&larr;</span> Back to Hub
                </button>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661]">
                  Sophie &amp; James
                </span>
              </div>

              {/* Title Section */}
              <div className="px-1">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#bd9661] mb-0.5">
                  The Wedding Companion
                </div>
                <h1 className="font-serif text-2xl font-bold text-[#15110e] leading-tight mb-1">
                  Our Story &amp; Details
                </h1>
                <div className="text-xs text-[#8b7b6b]">
                  Saturday, 14 November 2026 &bull; Fernwood Estate
                </div>
              </div>

              {/* Category Pills Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All Details' },
                  { id: 'story', label: '💍 Love Story' },
                  { id: 'menu', label: '🍽️ Feast & Menu' },
                  { id: 'memoriam', label: '🕊️ In Memoriam' },
                  { id: 'party', label: '👥 Bridal Party' },
                  { id: 'honeymoon', label: '✈️ Honeymoon' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setStoryFilter(chip.id as any)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-[11px] transition-all cursor-pointer ${
                      storyFilter === chip.id
                        ? 'bg-[#15110e] text-white shadow-xs'
                        : 'bg-white border border-[#e8ded0] text-[#5a4b3d] hover:bg-[#faf8f5]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* 1. LOVE STORY */}
              {(storyFilter === 'all' || storyFilter === 'story') && (
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💍</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">Our Love Story</h3>
                      <p className="text-[11px] text-[#bd9661] font-medium">Bowral to the Southern Highlands</p>
                    </div>
                  </div>
                  <div className="bg-[#fbf9f5] rounded-xl p-3 border border-[#f0e6d8] text-xs text-[#5a4b3d] leading-relaxed italic">
                    "We met on a rainy autumn afternoon in Bowral at a small corner bookstore. Five years, countless road trips, and one unforgettable sunset in Queenstown later, here we are celebrating our wedding with all the people who mean the most to us."
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">Milestones</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-bold text-[#bd9661] mt-0.5 whitespace-nowrap">2021</span>
                        <span className="text-[#3a2f26]">First met over vintage literature at the Bowral Corner Bookstore.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-bold text-[#bd9661] mt-0.5 whitespace-nowrap">2023</span>
                        <span className="text-[#3a2f26]">First international adventure campervanning around New Zealand.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-bold text-[#bd9661] mt-0.5 whitespace-nowrap">2025</span>
                        <span className="text-[#3a2f26]">Golden hour proposal overlooking Lake Wakatipu &amp; The Remarkables.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-bold text-[#bd9661] mt-0.5 whitespace-nowrap">Today</span>
                        <span className="text-[#3a2f26] font-semibold">Tying the knot surrounded by our cherished family &amp; friends!</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. WEDDING FEAST & MENU */}
              {(storyFilter === 'all' || storyFilter === 'menu') && (
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">Wedding Feast &amp; Menu</h3>
                      <p className="text-[11px] text-[#bd9661] font-medium">Curated by Estate Chef Marco Rossi</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="bg-[#fcfaf7] border border-[#f0e6d8] rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">Entr&eacute;e Selection</div>
                      <div className="space-y-1.5 text-[#3a2f26]">
                        <p><strong>&bull; Seared Southern Highlands Scallops</strong> &mdash; with cauliflower velvet, crisp prosciutto crumb &amp; lemon herb oil</p>
                        <p><strong>&bull; Heirloom Burrata (V)</strong> &mdash; with sun-ripened heritage tomatoes, aged balsamic reduction &amp; micro basil</p>
                      </div>
                    </div>

                    <div className="bg-[#fcfaf7] border border-[#f0e6d8] rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">Main Course</div>
                      <div className="space-y-1.5 text-[#3a2f26]">
                        <p><strong>&bull; Slow-Roasted Grass-Fed Beef Tenderloin</strong> &mdash; potato mousseline, Dutch carrots, charred shallots &amp; pinot noir jus</p>
                        <p><strong>&bull; Wild Forest Mushroom Risotto (V, GF)</strong> &mdash; arborio rice, black truffle essence, aged pecorino &amp; crisp sage</p>
                      </div>
                    </div>

                    <div className="bg-[#fcfaf7] border border-[#f0e6d8] rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] mb-1">Dessert &amp; Sweets</div>
                      <div className="space-y-1.5 text-[#3a2f26]">
                        <p><strong>&bull; Dark Chocolate Flourless Ganache</strong> &mdash; raspberry coulis, gold leaf &amp; clotted double cream</p>
                        <p><strong>&bull; Native Lemon Myrtle Panna Cotta</strong> &mdash; macadamia honeycomb brittle &amp; passionfruit pearls</p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#faf8f5] rounded-lg border border-[#e8ded0] text-[11px] text-[#8b7b6b]">
                      🍷 <strong>Wines &amp; Drinks:</strong> Fernwood Estate Pinot Noir, Hunter Valley Chardonnay, Craft Beers &amp; <em>"The Newlywed Spritz"</em> signature cocktail.
                    </div>
                  </div>
                </div>
              )}

              {/* 3. IN MEMORIAM */}
              {(storyFilter === 'all' || storyFilter === 'memoriam') && (
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🕊️</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">In Loving Memory</h3>
                      <p className="text-[11px] text-[#bd9661] font-medium">Always present in our hearts</p>
                    </div>
                  </div>
                  <div className="bg-[#fbf9f5] border border-[#e8ded0] rounded-xl p-3.5 space-y-2 text-xs text-[#5a4b3d] leading-relaxed">
                    <p className="italic">
                      "Though you cannot sit with us today, your love, guidance, and warmth surround every celebration, speech, and smile in this room."
                    </p>
                    <p className="font-semibold text-[#15110e] pt-1 border-t border-[#e8ded0]">
                      Dedicated in loving memory to Grandma Helen &amp; Uncle Robert.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. THE BRIDAL PARTY */}
              {(storyFilter === 'all' || storyFilter === 'party') && (
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">The Bridal Party</h3>
                      <p className="text-[11px] text-[#bd9661] font-medium">Lifelong friends &amp; partners in crime</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#fbf9f5] border border-[#e8ded0] rounded-xl space-y-0.5">
                      <div className="font-bold text-[#15110e]">Hannah Martin</div>
                      <div className="text-[10px] font-semibold text-[#bd9661]">Maid of Honor</div>
                      <div className="text-[11px] text-[#8b7b6b]">Sophie's best friend since kindergarten</div>
                    </div>
                    <div className="p-2.5 bg-[#fbf9f5] border border-[#e8ded0] rounded-xl space-y-0.5">
                      <div className="font-bold text-[#15110e]">Oliver Vance</div>
                      <div className="text-[10px] font-semibold text-[#bd9661]">Best Man</div>
                      <div className="text-[11px] text-[#8b7b6b]">James's brother &amp; lifelong companion</div>
                    </div>
                    <div className="p-2.5 bg-[#fbf9f5] border border-[#e8ded0] rounded-xl space-y-0.5">
                      <div className="font-bold text-[#15110e]">Charlotte &amp; Grace</div>
                      <div className="text-[10px] font-semibold text-[#bd9661]">Bridesmaids</div>
                      <div className="text-[11px] text-[#8b7b6b]">University squad &amp; travel partners</div>
                    </div>
                    <div className="p-2.5 bg-[#fbf9f5] border border-[#e8ded0] rounded-xl space-y-0.5">
                      <div className="font-bold text-[#15110e]">Liam &amp; Benjamin</div>
                      <div className="text-[10px] font-semibold text-[#bd9661]">Groomsmen</div>
                      <div className="text-[11px] text-[#8b7b6b]">High school crew &amp; golf buddies</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. HONEYMOON ADVENTURE */}
              {(storyFilter === 'all' || storyFilter === 'honeymoon') && (
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✈️</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">Honeymoon Adventure</h3>
                      <p className="text-[11px] text-[#bd9661] font-medium">Queenstown, New Zealand</p>
                    </div>
                  </div>
                  <div className="bg-[#fbf9f5] border border-[#e8ded0] rounded-xl p-3 text-xs text-[#5a4b3d] leading-relaxed space-y-1.5">
                    <p>
                      Following our wedding weekend, we are heading to Lake Wakatipu, Milford Sound, and Central Otago wineries for two weeks of crisp mountain air, hiking, and celebrating our new chapter!
                    </p>
                    <p className="text-[11px] text-[#8b7b6b]">
                      Thank you for all your well wishes and contributions towards our trip!
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Back Button */}
              <button
                type="button"
                onClick={() => setActiveTab('hub')}
                className="w-full bg-[#15110e] hover:bg-[#231c17] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>&larr;</span> Back to Wedding Hub
              </button>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* JOEY CHATBOT FLOATING ACTION BUTTON                            */}
        {/* ============================================================== */}
        {activeTab !== 'splash' && (
          <button
            type="button"
            onClick={() => setShowJoey(!showJoey)}
            className="absolute bottom-18 right-4 w-12 h-12 rounded-full bg-[#dfc194] border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform z-30 overflow-hidden p-0"
            title="Chat with Joey Assistant"
          >
            <img src="/chatbot-avatar.png" alt="Joey AI Assistant" className="w-full h-full object-cover" />
          </button>
        )}

        {/* ============================================================== */}
        {/* JOEY MODAL (Screenshots 11 & 12: 172705.png & 172723.png)       */}
        {/* ============================================================== */}
        {showJoey && (
          <div className="absolute inset-x-3 bottom-16 top-16 bg-white rounded-3xl border border-[#d5c7b5] shadow-2xl flex flex-col overflow-hidden z-40 animate-in fade-in zoom-in-95">
            {/* Dark Joey Header */}
            <div className="bg-[#15110e] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#bd9661] flex items-center justify-center flex-shrink-0">
                  <img src="/chatbot-avatar.png" alt="Joey AI Assistant" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Joey <span className="w-1.5 h-1.5 rounded-full bg-[#48bb78]" />
                  </div>
                  <div className="text-[10px] text-[#bd9661]">The Wedding Assistant</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJoey(false)}
                className="text-white hover:text-[#bd9661] text-lg font-bold cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#faf8f5] text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.text && (
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl shadow-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#bd9661] text-[#15110e] font-medium'
                          : 'bg-white text-[#15110e] border border-[#e8ded0]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Joey Action Confirmation Card (Screenshot 12: 172723.png) */}
                  {msg.isActionCard && msg.actionDetails && (
                    <div className="mt-2 bg-white border border-[#bd9661] rounded-xl p-3 shadow-sm max-w-[95%] space-y-2">
                      <div className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                        Action Confirmation
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#15110e]">
                        {msg.actionDetails.title}
                      </h4>
                      <p className="text-[11px] text-[#6b5849]">
                        {msg.actionDetails.description}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleConfirmJoeyDietAction(true)}
                          className="flex-1 bg-[#2f6f4e] hover:bg-[#25573d] text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          ✓ Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmJoeyDietAction(false)}
                          className="flex-1 bg-white hover:bg-[#fbf9f6] text-[#c54b38] border border-[#f2a89f] font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          ✕ Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Edit preference', 'info');
                          }}
                          className="bg-[#faf8f5] hover:bg-[#f0ede4] text-[#15110e] border border-[#d5c7b5] font-semibold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          ✎ Correct
                        </button>
                      </div>
                    </div>
                  )}
                  <span className="text-[9px] text-[#8b7b6b] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Suggestion Pills */}
            <div className="p-2 bg-white border-t border-[#e8ded0] flex gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Change my diet to vegetarian')}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer transition-colors"
              >
                Change diet to vegetarian
              </button>
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Accept RSVP')}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer transition-colors"
              >
                Accept RSVP
              </button>
              <button
                type="button"
                onClick={() => handleJoeyPrompt('Decline RSVP')}
                className="bg-[#faf8f5] hover:bg-[#f0ede4] border border-[#ebd3a8] rounded-full px-2.5 py-1 text-[11px] text-[#15110e] whitespace-nowrap cursor-pointer transition-colors"
              >
                Decline RSVP
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                handleJoeyPrompt(chatInput);
                setChatInput('');
              }}
              className="p-2.5 bg-white border-t border-[#e8ded0] flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Joey anything or request a change..."
                className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#bd9661] text-[#15110e] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-[#a8824f]"
              >
                ➤
              </button>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOTTOM PHONE DOCK (7 Tabs matching Screenshots 2-9)             */}
        {/* ============================================================== */}
        {activeTab !== 'splash' && (
          <div className="h-[64px] bg-white border-t border-[#e8ded0] flex items-center justify-around px-1 z-20 flex-shrink-0">
            {/* 1. Hub */}
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'hub' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-[10px] mt-0.5">Hub</span>
            </button>

            {/* 2. RSVP */}
            <button
              type="button"
              onClick={() => setActiveTab('rsvp')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'rsvp' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22 6 12 13 2 6" />
              </svg>
              <span className="text-[10px] mt-0.5">RSVP</span>
            </button>

            {/* 3. Feed */}
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'feed' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[10px] mt-0.5">Feed</span>
            </button>

            {/* 4. Events */}
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'events' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[10px] mt-0.5">Events</span>
            </button>

            {/* 5. Table */}
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'table' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="3" r="2" />
                <circle cx="12" cy="21" r="2" />
                <circle cx="3" cy="12" r="2" />
                <circle cx="21" cy="12" r="2" />
              </svg>
              <span className="text-[10px] mt-0.5">Table</span>
            </button>

            {/* 6. Photos */}
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'photos' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className="text-[10px] mt-0.5">Photos</span>
            </button>

            {/* 7. Gifts */}
            <button
              type="button"
              onClick={() => setActiveTab('gifts')}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors ${
                activeTab === 'gifts' ? 'text-[#bd9661] font-bold' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              <span className="text-[10px] mt-0.5">Gifts</span>
            </button>
          </div>
        )}

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 bg-white flex items-center justify-center pb-1">
          <div className="w-28 h-1 bg-[#15110e]/25 rounded-full" />
        </div>
      </div>
    </div>
  );
}
