import React, { useState, useEffect } from 'react';
import { useAppState, showToast } from '../lib/state';
import { InvitationCardStage, LUXURY_THEMES } from './InvitationCardStage';

interface InvitationDemoViewProps {
  onSelectView?: (view: string) => void;
}

interface DemoRecipient {
  name: string;
  email: string;
  householdName: string;
}

const DEMO_RECIPIENTS: DemoRecipient[] = [
  { name: 'Priya Sharma', email: 'priya.sharma@example.com', householdName: 'The Sharma Family' },
  { name: 'Marcus Vance', email: 'marcus.vance@example.com', householdName: 'Marcus & Liam Vance' },
  { name: 'Eleanor Carter', email: 'eleanor.carter@example.com', householdName: 'The Carter Family' },
];

export const InvitationDemoView: React.FC<InvitationDemoViewProps> = ({ onSelectView }) => {
  const { state } = useAppState();
  const wedding = state.weddings?.[0] || { id: 'w1', couple: 'Sophie Carter & James Wilson' };

  // Read theme selected in Couple View -> Invitations studio
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('tt_invitation_theme') || 'magnolia-gold';
  });

  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'opening' | 'opened'>('sealed');
  const [selectedRecipient, setSelectedRecipient] = useState<DemoRecipient>(DEMO_RECIPIENTS[0]);
  const [clientTheme, setClientTheme] = useState<'apple' | 'gmail'>('apple');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync theme changes if updated in another tab or window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tt_invitation_theme' && e.newValue) {
        setSelectedThemeId(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    localStorage.setItem('tt_invitation_theme', themeId);
    setEnvelopeState('sealed');
    setTimeout(() => {
      executeOpenSequence(themeId);
    }, 280);
  };

  const executeOpenSequence = (themeId?: string) => {
    setEnvelopeState('opening');
    const tid = themeId || selectedThemeId;
    const duration = tid === 'vineyard-arch' ? 400 : 700;

    setTimeout(() => {
      setEnvelopeState('opened');
      showToast('💌 Wedding invitation opened!', 'success');
    }, duration);
  };

  const handleToggleEnvelope = () => {
    if (envelopeState === 'opened') {
      setEnvelopeState('sealed');
      showToast('Envelope re-sealed', 'info');
    } else {
      executeOpenSequence();
    }
  };

  const handleCopyLink = () => {
    const link = `https://tapandtoast.app/invite/sophie-daniel?guest=${encodeURIComponent(selectedRecipient.name)}&theme=${selectedThemeId}`;
    try {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      showToast('Guest invitation link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Link copied: ' + link, 'info');
    }
  };

  const handleGoToGuestMobile = () => {
    if (onSelectView) {
      onSelectView('guest-mobile');
    } else {
      window.location.hash = 'guest-mobile';
    }
  };

  // Helper to render celebratory design accents matching each invitation template
  const renderThemeCelebrationAccents = () => {
    switch (selectedThemeId) {
      case 'native-wattle':
        return (
          <>
            {/* Top-Left: Golden Wattle & Sage Gum Sprig framing Tap & Toast */}
            <div className="absolute -top-1 -left-1 w-20 h-20 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <ellipse cx="26" cy="20" rx="14" ry="5.5" transform="rotate(-30 26 20)" fill="#5a805e" opacity="0.6" />
                <path d="M4 32 Q 20 16, 42 10" stroke="#7bb086" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
                <circle cx="16" cy="14" r="3" fill="#eed259" />
                <circle cx="24" cy="10" r="3.2" fill="#f5dc6e" />
                <circle cx="34" cy="11" r="2.8" fill="#e5c545" />
              </svg>
            </div>

            {/* Right Flank: Visible Golden Mimosa Wattle Florets & Gum Leaves (Clear of Open button) */}
            <div className="absolute top-10 right-0 w-32 h-32 pointer-events-none select-none z-0">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                {/* Australian gum leaves */}
                <ellipse cx="75" cy="52" rx="22" ry="7" transform="rotate(30 75 52)" fill="#5a805e" opacity="0.7" />
                <ellipse cx="88" cy="74" rx="24" ry="8" transform="rotate(70 88 74)" fill="#789c7c" opacity="0.65" />
                <ellipse cx="58" cy="78" rx="18" ry="6.5" transform="rotate(-15 58 78)" fill="#44614d" opacity="0.6" />
                {/* Golden wattle florets cluster */}
                <circle cx="62" cy="42" r="4.5" fill="#eed259" />
                <circle cx="74" cy="36" r="5" fill="#f5dc6e" />
                <circle cx="85" cy="45" r="4.5" fill="#eed259" />
                <circle cx="72" cy="54" r="5" fill="#f5dc6e" />
                <circle cx="84" cy="62" r="4.2" fill="#eed259" />
                <circle cx="68" cy="68" r="4.8" fill="#dfb12c" />
                <circle cx="94" cy="55" r="3.8" fill="#f5dc6e" />
                {/* Celebratory golden sparkles */}
                <path d="M44 48 L45.5 52 L49.5 53.5 L45.5 55 L44 59 L42.5 55 L38.5 53.5 L42.5 52 Z" fill="#dfb12c" opacity="0.85" />
                <circle cx="48" cy="36" r="1.6" fill="#eed259" />
                <circle cx="42" cy="66" r="1.6" fill="#f5dc6e" />
              </svg>
            </div>

            {/* Bottom-Left: Native Gum Leaf & Wattle Buds */}
            <div className="absolute bottom-0 left-0 w-20 h-16 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 60" fill="none" className="w-full h-full">
                <path d="M2 58 Q 28 36, 56 22" stroke="#7bb086" strokeWidth="1.3" strokeLinecap="round" />
                <ellipse cx="24" cy="42" rx="10" ry="4" transform="rotate(-28 24 42)" fill="#5a805e" opacity="0.6" />
                <circle cx="38" cy="32" r="2.5" fill="#eed259" />
                <circle cx="48" cy="25" r="2.2" fill="#f5dc6e" />
                <path d="M58 18 L59 21 L62 22 L59 23 L58 26 L57 23 L54 22 L57 21 Z" fill="#eed259" opacity="0.9" />
              </svg>
            </div>
          </>
        );

      case 'midnight-protea':
        return (
          <>
            {/* Top-Left: Copper Starlight & Crimson Petal Accent */}
            <div className="absolute -top-1 -left-1 w-20 h-20 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <path d="M12 18 C20 12, 34 16, 40 22 C32 26, 20 28, 12 18 Z" fill="#8a2337" opacity="0.55" />
                <circle cx="22" cy="12" r="1.8" fill="#e27b91" />
                <circle cx="34" cy="10" r="1.5" fill="#dfc194" />
                <path d="M42 12 L43 15 L46 16 L43 17 L42 20 L41 17 L38 16 L41 15 Z" fill="#dfc194" opacity="0.8" />
              </svg>
            </div>

            {/* Right Flank: Velvet Protea Bloom & Copper Stardust (Clear of Open button) */}
            <div className="absolute top-10 right-0 w-32 h-32 pointer-events-none select-none z-0">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                {/* Protea petals */}
                <path d="M65 38 C55 60, 80 85, 105 58 Z" fill="#8a2337" opacity="0.75" />
                <path d="M74 48 C68 68, 92 80, 104 64 Z" fill="#b33951" opacity="0.8" />
                <path d="M82 56 C78 72, 96 82, 104 70 Z" fill="#e27b91" opacity="0.7" />
                {/* Central golden stardust & copper accents */}
                <circle cx="75" cy="52" r="3" fill="#dfc194" />
                <circle cx="85" cy="62" r="2.5" fill="#e27b91" />
                <circle cx="95" cy="52" r="2" fill="#dfc194" />
                {/* 4-point celebratory stars */}
                <path d="M48 50 L50 54 L54 56 L50 58 L48 62 L46 58 L42 56 L46 54 Z" fill="#dfc194" opacity="0.85" />
                <path d="M40 74 L41 77 L44 78 L41 79 L40 82 L39 79 L36 78 L39 77 Z" fill="#e27b91" opacity="0.8" />
                <circle cx="52" cy="70" r="1.5" fill="#dfc194" />
              </svg>
            </div>

            {/* Bottom-Left: Gilded Stars & Rose Tendril */}
            <div className="absolute bottom-0 left-0 w-20 h-16 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 60" fill="none" className="w-full h-full">
                <path d="M4 56 Q 28 38, 54 26" stroke="#8a2337" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                <circle cx="22" cy="44" r="2" fill="#e27b91" />
                <circle cx="36" cy="35" r="1.8" fill="#dfc194" />
                <path d="M52 20 L53.5 24 L57.5 25.5 L53.5 27 L52 31 L50.5 27 L46.5 25.5 L50.5 24 Z" fill="#dfc194" opacity="0.9" />
              </svg>
            </div>
          </>
        );

      case 'coastal-harbor':
        return (
          <>
            {/* Top Banner: Draped Glowing Fairy Lights Festoon */}
            <div className="absolute top-0 inset-x-0 h-12 pointer-events-none select-none z-0 overflow-hidden">
              <svg viewBox="0 0 400 45" fill="none" className="w-full h-full" preserveAspectRatio="none">
                {/* Draped wire */}
                <path d="M10 12 Q 100 28, 200 16 Q 300 28, 390 12" stroke="#fae392" strokeWidth="1" strokeDasharray="3 3" opacity="0.65" />
                {/* Glowing light bulbs with halo rings */}
                <circle cx="60" cy="22" r="5" fill="#ffd700" opacity="0.3" />
                <circle cx="60" cy="22" r="2.8" fill="#fae392" />
                <circle cx="120" cy="25" r="5" fill="#ffd700" opacity="0.3" />
                <circle cx="120" cy="25" r="2.8" fill="#ffffff" />
                <circle cx="180" cy="18" r="5" fill="#ffd700" opacity="0.3" />
                <circle cx="180" cy="18" r="2.8" fill="#fae392" />
                <circle cx="240" cy="24" r="5" fill="#ffd700" opacity="0.3" />
                <circle cx="240" cy="24" r="2.8" fill="#ffd700" />
                <circle cx="300" cy="24" r="5" fill="#ffd700" opacity="0.3" />
                <circle cx="300" cy="24" r="2.8" fill="#fae392" />
              </svg>
            </div>

            {/* Right Flank: Harbor Starlight & Twinkling Sparkles (Clear of Open button) */}
            <div className="absolute top-10 right-0 w-32 h-32 pointer-events-none select-none z-0">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                {/* 4-point celestial sparkle stars */}
                <path d="M68 45 L70 51 L76 53 L70 55 L68 61 L66 55 L60 53 L66 51 Z" fill="#fae392" opacity="0.9" />
                <circle cx="68" cy="53" r="7" fill="#fae392" opacity="0.25" />
                <path d="M88 65 L89.5 69 L93.5 70.5 L89.5 72 L88 76 L86.5 72 L82.5 70.5 L86.5 69 Z" fill="#ffd700" opacity="0.85" />
                <path d="M48 60 L49 63 L52 64 L49 65 L48 68 L47 65 L44 64 L47 63 Z" fill="#ffffff" opacity="0.85" />
                {/* Stardust constellation */}
                <circle cx="56" cy="42" r="1.8" fill="#fae392" />
                <circle cx="82" cy="40" r="1.5" fill="#ffffff" />
                <circle cx="76" cy="78" r="2" fill="#fae392" />
                <circle cx="50" cy="76" r="1.5" fill="#ffd700" />
              </svg>
            </div>

            {/* Bottom-Left: Twinkling Star Accent */}
            <div className="absolute bottom-0 left-0 w-20 h-16 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 60" fill="none" className="w-full h-full">
                <path d="M30 32 L31.5 36 L35.5 37.5 L31.5 39 L30 43 L28.5 39 L24.5 37.5 L28.5 36 Z" fill="#fae392" opacity="0.85" />
                <circle cx="30" cy="37.5" r="5" fill="#ffd700" opacity="0.25" />
                <circle cx="16" cy="46" r="1.8" fill="#ffffff" />
                <circle cx="44" cy="28" r="1.5" fill="#fae392" />
              </svg>
            </div>
          </>
        );

      case 'vineyard-arch':
        return (
          <>
            {/* Top-Left: Champagne Grapevine Tendril framing Tap & Toast */}
            <div className="absolute -top-1 -left-1 w-20 h-20 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <path d="M6 34 Q 22 18, 44 12" stroke="#dfc194" strokeWidth="1.2" strokeLinecap="round" />
                <ellipse cx="26" cy="18" rx="10" ry="4.5" transform="rotate(-30 26 18)" fill="#96784d" opacity="0.5" />
                <circle cx="18" cy="14" r="2" fill="#dfc194" />
                <circle cx="28" cy="10" r="2.2" fill="#bd9661" />
              </svg>
            </div>

            {/* Right Flank: Champagne Grapes & Vineyard Leaves (Clear of Open button) */}
            <div className="absolute top-10 right-0 w-32 h-32 pointer-events-none select-none z-0">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                {/* Vineyard leaves */}
                <ellipse cx="76" cy="50" rx="20" ry="7.5" transform="rotate(35 76 50)" fill="#96784d" opacity="0.65" />
                <ellipse cx="90" cy="72" rx="22" ry="8" transform="rotate(68 90 72)" fill="#bd9661" opacity="0.5" />
                {/* Grape cluster in champagne tones */}
                <circle cx="64" cy="44" r="4.2" fill="#dfc194" />
                <circle cx="75" cy="40" r="4.5" fill="#bd9661" />
                <circle cx="85" cy="48" r="4" fill="#dfc194" />
                <circle cx="72" cy="54" r="4.5" fill="#bd9661" />
                <circle cx="82" cy="60" r="4.2" fill="#dfc194" />
                <circle cx="70" cy="65" r="4" fill="#96784d" />
                {/* Curling vine tendril */}
                <path d="M50 48 Q 55 60, 48 70" stroke="#dfc194" strokeWidth="1.2" strokeLinecap="round" />
                {/* Celebratory golden sparkles */}
                <path d="M44 44 L45.5 48 L49.5 49.5 L45.5 51 L44 55 L42.5 51 L38.5 49.5 L42.5 48 Z" fill="#dfc194" opacity="0.85" />
                <circle cx="48" cy="62" r="1.6" fill="#bd9661" />
              </svg>
            </div>

            {/* Bottom-Left: Vineyard Leaf & Tendril */}
            <div className="absolute bottom-0 left-0 w-20 h-16 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 60" fill="none" className="w-full h-full">
                <path d="M2 58 Q 28 36, 56 22" stroke="#dfc194" strokeWidth="1.2" strokeLinecap="round" />
                <ellipse cx="24" cy="42" rx="10" ry="4" transform="rotate(-28 24 42)" fill="#96784d" opacity="0.5" />
                <circle cx="36" cy="32" r="2.2" fill="#dfc194" />
                <circle cx="46" cy="24" r="2" fill="#bd9661" />
                <path d="M58 18 L59 21 L62 22 L59 23 L58 26 L57 23 L54 22 L57 21 Z" fill="#dfc194" />
              </svg>
            </div>
          </>
        );

      case 'magnolia-gold':
      default:
        return (
          <>
            {/* Top-Left: Graceful Eucalyptus Sprig framing Tap & Toast */}
            <div className="absolute -top-1 -left-1 w-20 h-20 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <ellipse cx="25" cy="22" rx="14" ry="5.5" transform="rotate(-35 25 22)" fill="#5c7d67" opacity="0.65" />
                <ellipse cx="38" cy="14" rx="12" ry="5" transform="rotate(-15 38 14)" fill="#44614d" opacity="0.6" />
                <path d="M5 35 Q 22 18, 45 8" stroke="#dfc194" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
                <circle cx="18" cy="14" r="2" fill="#d4af37" />
                <circle cx="28" cy="9" r="1.8" fill="#bd9661" />
              </svg>
            </div>

            {/* Right Flank: Visible Ivory Magnolia Blossom & Eucalyptus (Clear of Open button) */}
            <div className="absolute top-10 right-0 w-32 h-32 pointer-events-none select-none z-0">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                {/* Lush eucalyptus foliage */}
                <ellipse cx="72" cy="52" rx="22" ry="8" transform="rotate(35 72 52)" fill="#44614d" opacity="0.75" />
                <ellipse cx="88" cy="74" rx="24" ry="9" transform="rotate(65 88 74)" fill="#5c7d67" opacity="0.8" />
                <ellipse cx="56" cy="80" rx="18" ry="7" transform="rotate(-20 56 80)" fill="#354e3d" opacity="0.7" />
                {/* Blooming ivory magnolia blossom */}
                <circle cx="74" cy="50" r="15" fill="#ffffff" stroke="#e8dfd1" strokeWidth="1.2" />
                <path d="M74 34 C69 43, 69 57, 74 66 C79 57, 79 43, 74 34 Z" fill="#fffdfa" />
                <path d="M58 50 C67 44, 81 44, 90 50 C81 56, 67 56, 58 50 Z" fill="#fcf8f0" />
                <circle cx="74" cy="50" r="4.5" fill="#d4af37" />
                {/* Celebratory golden sparkles */}
                <path d="M42 46 L43.5 50 L47.5 51.5 L43.5 53 L42 57 L40.5 53 L36.5 51.5 L40.5 50 Z" fill="#dfc194" opacity="0.85" />
                <circle cx="48" cy="34" r="1.8" fill="#d4af37" />
                <circle cx="40" cy="64" r="1.6" fill="#bd9661" />
              </svg>
            </div>

            {/* Bottom-Left: Gilded Leaf Vine & Celebration Sparkle */}
            <div className="absolute bottom-0 left-0 w-20 h-16 pointer-events-none select-none z-0">
              <svg viewBox="0 0 80 60" fill="none" className="w-full h-full">
                <path d="M4 56 Q 28 38, 55 24" stroke="#dfc194" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="20" cy="44" r="2.2" fill="#d4af37" />
                <circle cx="36" cy="34" r="2.2" fill="#d4af37" />
                <circle cx="50" cy="27" r="1.8" fill="#dfc194" />
                <path d="M58 20 L59 23 L62 24 L59 25 L58 28 L57 25 L54 24 L57 23 Z" fill="#dfc194" />
              </svg>
            </div>
          </>
        );
    }
  };

  // Dynamic styling for the celebration box based on template
  const getThemeBoxClasses = () => {
    switch (selectedThemeId) {
      case 'native-wattle':
        return 'bg-[#f8fbf7] border-[#7bb086]/70 shadow-[0_4px_16px_rgba(60,102,69,0.08)]';
      case 'midnight-protea':
        return 'bg-[#1b1c23] border-[#8a2337]/70 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]';
      case 'coastal-harbor':
        return 'bg-[#0f1d38] border-[#fae392]/60 text-white shadow-[0_4px_20px_rgba(11,22,44,0.4)]';
      case 'vineyard-arch':
        return 'bg-[#fbf8f3] border-[#dfc194] shadow-[0_4px_16px_rgba(150,120,77,0.08)]';
      case 'magnolia-gold':
      default:
        return 'bg-[#fdfbf7] border-[#dfc194] shadow-[0_4px_16px_rgba(197,154,88,0.1)]';
    }
  };

  const isDarkCard = selectedThemeId === 'midnight-protea' || selectedThemeId === 'coastal-harbor';

  return (
    <div className="flex-1 bg-[#ede8e1] min-h-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col items-center justify-start overflow-hidden">
      {/* ========================================================= */}
      {/* REALISTIC MAIL CLIENT WINDOW (ONLY THIS SECTION RENDERED) */}
      {/* ========================================================= */}
      <div className="w-full max-w-4xl bg-white border border-[#cfc3b4] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-65px)] max-h-[920px]">
        {/* macOS / Webmail Window Bar */}
        <div className="bg-[#f0ebe3] border-b border-[#ded5c8] px-4 py-2.5 flex items-center justify-between select-none shrink-0 gap-3 flex-wrap">
          {/* Traffic light window controls & Window Title */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-xs"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-xs"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-xs"></span>
            <span className="ml-2 text-xs font-semibold text-[#5a4e42]">
              {clientTheme === 'apple' ? 'Mail — Inbox' : 'Gmail — Primary'}
            </span>
          </div>

          {/* Quick Toolbar Controls inside Window Bar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Theme Selector (Synced with Couple Studio) */}
            <div className="flex items-center gap-1.5 bg-white border border-[#d2c7b8] px-2.5 py-1 rounded-lg text-xs shadow-2xs">
              <span className="text-[#8b7b6b] font-medium text-[11px]">Theme:</span>
              <select
                value={selectedThemeId}
                onChange={(e) => handleSelectTheme(e.target.value)}
                className="bg-transparent font-semibold text-[#15110e] outline-none cursor-pointer text-xs"
              >
                {LUXURY_THEMES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Recipient Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-[#d2c7b8] px-2.5 py-1 rounded-lg text-xs shadow-2xs">
              <span className="text-[#8b7b6b] font-medium text-[11px]">To:</span>
              <select
                value={selectedRecipient.name}
                onChange={(e) => {
                  const found = DEMO_RECIPIENTS.find(r => r.name === e.target.value);
                  if (found) setSelectedRecipient(found);
                }}
                className="bg-transparent font-semibold text-[#15110e] outline-none cursor-pointer text-xs"
              >
                {DEMO_RECIPIENTS.map(r => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Re-seal / Open Button */}
            <button
              type="button"
              onClick={handleToggleEnvelope}
              className="px-3.5 py-1 bg-[#15110e] text-[#dfc194] hover:bg-[#2a221b] rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>{envelopeState === 'opened' ? '↺ Close Envelope' : '✨ Open Invitation'}</span>
            </button>

            {/* Theme switcher */}
            <div className="flex items-center gap-0.5 bg-[#e4ded5] p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setClientTheme('apple')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  clientTheme === 'apple' ? 'bg-white text-[#15110e] shadow-2xs' : 'text-[#7a6f62]'
                }`}
              >
                Apple
              </button>
              <button
                type="button"
                onClick={() => setClientTheme('gmail')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  clientTheme === 'gmail' ? 'bg-white text-[#15110e] shadow-2xs' : 'text-[#7a6f62]'
                }`}
              >
                Gmail
              </button>
            </div>
          </div>
        </div>

        {/* Email Header / Metadata */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#f0ede4] space-y-2 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#15110e] leading-snug">
              ✨ You&apos;re Invited: Sophie &amp; Daniel&apos;s Wedding Celebration
            </h2>
            <div className="text-xs text-[#8b7b6b] whitespace-nowrap">
              Saturday, Nov 14, 2026 &bull; 10:15 AM
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dfc194] to-[#bd9661] text-[#15110e] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-xs border border-[#fff]">
              S&amp;D
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[#15110e]">Sophie Taylor &amp; Daniel Carter</span>
                <span className="text-[#8b7b6b] text-[11px]">&lt;invitations@tapandtoast.app&gt;</span>
              </div>
              <div className="text-[#8b7b6b] mt-0.5 flex items-center gap-1 text-[11px]">
                <span>To:</span>
                <span className="font-semibold text-[#15110e]">{selectedRecipient.name}</span>
                <span className="text-[#8b7b6b]">&lt;{selectedRecipient.email}&gt;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Body Content (SCROLLABLE INBOX READING PANE) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#faf8f5] flex flex-col items-center">
          {/* Letter / Salutation */}
          <div className="w-full max-w-xl text-left space-y-3 mb-6 shrink-0">
            <p className="font-serif text-lg text-[#15110e]">
              Dear {selectedRecipient.name},
            </p>
            <p className="text-xs sm:text-sm text-[#5a483a] leading-relaxed">
              We are overjoyed to invite you to celebrate our wedding day with us. You hold a very special place in our lives, and having you by our side as we exchange our vows would mean the world to us.
            </p>
            <p className="text-xs text-[#8b7b6b] italic">
              Please tap or click the sealed envelope below to open your personalized wedding invitation card:
            </p>
          </div>

          {/* ========================================================= */}
          {/* THE EXACT INVITATION UNBOXING STAGE AS SELECTED IN STUDIO */}
          {/* ========================================================= */}
          <div className="w-full max-w-lg my-2 flex flex-col items-center shrink-0">
            <InvitationCardStage
              themeId={selectedThemeId}
              recipientName={selectedRecipient.name}
              envelopeState={envelopeState}
              onExecuteOpen={executeOpenSequence}
              invitationHeading="Together with their families"
            />
          </div>

          {/* ========================================================= */}
          {/* GUEST VIEW: COMPACT CELEBRATORY PLATFORM HUB CARD */}
          {/* ========================================================= */}
          <div
            className={`w-full max-w-[430px] sm:max-w-[450px] mt-6 p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-500 border shrink-0 ${getThemeBoxClasses()}`}
          >
            {/* Inner Gilded Accent Line */}
            <div className={`absolute inset-2 border rounded-xl pointer-events-none ${
              isDarkCard ? 'border-white/10' : 'border-[#bd9661]/25'
            }`} />

            {/* Template-Based Festive Botanical Accents */}
            {renderThemeCelebrationAccents()}

            <div className="relative z-10 space-y-3">
              {/* Header Row: Tap & Toast Logo + Open Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-[3px] border border-[#bd9661] text-[#bd9661] font-serif font-bold text-xs inline-grid place-items-center bg-white/60">
                    T
                  </span>
                  <span className={`font-serif text-sm font-semibold tracking-wide ${isDarkCard ? 'text-white' : 'text-[#15110e]'}`}>
                    Tap <span className="text-[#bd9661] italic">&amp;</span> Toast
                  </span>
                  <span className="text-[10px] text-[#bd9661] ml-1">✨</span>
                </div>

                {/* Open Button */}
                <button
                  type="button"
                  onClick={handleGoToGuestMobile}
                  className="bg-gradient-to-r from-[#dfc194] to-[#bd9661] hover:brightness-105 text-[#15110e] px-5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <span>Open</span>
                  <span>&rarr;</span>
                </button>
              </div>

              {/* Title & Couple's Personal Message */}
              <div>
                <h4 className={`font-serif text-[15px] font-bold leading-snug ${isDarkCard ? 'text-white' : 'text-[#15110e]'}`}>
                  RSVP &amp; Digital Wedding Guide
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${isDarkCard ? 'text-white/80' : 'text-[#5a483a]'}`}>
                  &ldquo;Sophie &amp; Daniel invite you to celebrate! Confirm your attendance, select dietary choices &amp; access the live wedding guide.&rdquo;
                </p>
              </div>

              {/* Direct Link Pill with Dark Legible Text and Copy Button */}
              <div className={`pt-2 flex items-center justify-between gap-2 p-2 rounded-xl text-xs border ${
                isDarkCard ? 'bg-black/30 border-white/15' : 'bg-white/85 border-[#ebdcc9]'
              }`}>
                <span className={`font-semibold truncate font-mono text-[11px] ${isDarkCard ? 'text-white/90' : 'text-[#15110e]'}`}>
                  https://tapandtoast.app/invite/sophie-daniel?guest={encodeURIComponent(selectedRecipient.name)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-white border border-[#cfc3b4] hover:bg-[#f5ede2] text-[#15110e] rounded-lg font-bold text-[10.5px] cursor-pointer shrink-0 transition-colors shadow-2xs"
                >
                  {copiedLink ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Email Footer */}
          <div className="w-full max-w-xl mt-8 pt-6 border-t border-[#ded5c8] text-center text-xs text-[#8b7b6b] space-y-1.5">
            <p>
              Sent with love by Sophie &amp; Daniel via <span className="font-semibold text-[#15110e]">Tap &amp; Toast</span>
            </p>
            <p className="text-[11px]">
              If you have any questions or dietary queries, you can reply directly to this email or reach our wedding concierge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationDemoView;
