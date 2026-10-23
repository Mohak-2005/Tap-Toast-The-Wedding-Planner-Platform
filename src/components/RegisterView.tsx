import React, { useState } from 'react';
import { useAppState, setStoredSession, showToast } from '../lib/state';

interface RegisterViewProps {
  onSelectView?: (view: string) => void;
}

export default function RegisterView({ onSelectView }: RegisterViewProps) {
  const { state, setState } = useAppState();
  const getInitialAccountType = (): 'mc' | 'couple' => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('register-mc') || hash.includes('type=mc')) return 'mc';
    return 'couple'; // Default to Couple registration
  };
  const [accountType, setAccountType] = useState<'mc' | 'couple'>(getInitialAccountType);

  // Sync accountType if hash changes
  React.useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('register-mc') || hash.includes('type=mc')) {
      setAccountType('mc');
    } else if (hash.includes('register-couple') || hash === '#register') {
      setAccountType('couple');
    }
  }, []);

  // MC fields
  const [mcName, setMcName] = useState('');
  const [mcBusiness, setMcBusiness] = useState('');
  const [mcEmail, setMcEmail] = useState('');
  const [mcMobile, setMcMobile] = useState('');
  const [mcAbn, setMcAbn] = useState('');
  const [mcPassword, setMcPassword] = useState('');
  const [mcConfirmPassword, setMcConfirmPassword] = useState('');
  const [mcShowPwd, setMcShowPwd] = useState(false);
  const [mcShowConfirm, setMcShowConfirm] = useState(false);

  // Couple fields
  const [groomName, setGroomName] = useState('');
  const [groomEmail, setGroomEmail] = useState('');
  const [groomMobile, setGroomMobile] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideEmail, setBrideEmail] = useState('');
  const [brideMobile, setBrideMobile] = useState('');

  // Additional Wedding Details (added per client request)
  const [weddingDate, setWeddingDate] = useState('2026-11-14');
  const [venue, setVenue] = useState('');
  const [guestCount, setGuestCount] = useState<number>(110);
  const [weddingStyle, setWeddingStyle] = useState('Modern Luxury & Black Tie');
  const [preferredMc, setPreferredMc] = useState('Robert Galati (Galati MC Services)');

  const [couplePassword, setCouplePassword] = useState('');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('');
  const [coupleShowPwd, setCoupleShowPwd] = useState(false);
  const [coupleShowConfirm, setCoupleShowConfirm] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Couple Password strength logic
  const coupleHasMinLength = couplePassword.length >= 8;
  const coupleHasUpper = /[A-Z]/.test(couplePassword);
  const coupleHasLower = /[a-z]/.test(couplePassword);
  const coupleHasNum = /[0-9]/.test(couplePassword);
  const coupleStrengthScore = [coupleHasMinLength, coupleHasUpper, coupleHasLower, coupleHasNum].filter(Boolean).length;

  const coupleStrengthColor =
    coupleStrengthScore <= 1 ? '#d9534f' : coupleStrengthScore <= 3 ? '#e0a96d' : '#5ea866';
  const coupleStrengthLabel =
    coupleStrengthScore === 0
      ? 'Password strength'
      : coupleStrengthScore <= 1
      ? 'Weak'
      : coupleStrengthScore <= 3
      ? 'Medium'
      : 'Strong';

  const couplePasswordsMatch = couplePassword && coupleConfirmPassword && couplePassword === coupleConfirmPassword;

  // Password strength logic
  const hasMinLength = mcPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(mcPassword);
  const hasLower = /[a-z]/.test(mcPassword);
  const hasNum = /[0-9]/.test(mcPassword);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNum].filter(Boolean).length;

  const strengthColor =
    strengthScore <= 1 ? '#d9534f' : strengthScore <= 3 ? '#e0a96d' : '#5ea866';
  const strengthLabel =
    strengthScore === 0
      ? 'Password strength'
      : strengthScore <= 1
      ? 'Weak'
      : strengthScore <= 3
      ? 'Medium'
      : 'Strong';

  const passwordsMatch = mcPassword && mcConfirmPassword && mcPassword === mcConfirmPassword;

  const formatAuMobile = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 10);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  };

  const handleRegisterMC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newTenantId = 'tenant_' + Date.now();
      const newUser = {
        id: 'user_' + Date.now(),
        email: mcEmail,
        role: 'mc' as const,
        name: mcName,
        businessName: mcBusiness,
        tenantId: newTenantId,
        weddingId: null,
      };

      setState({
        ...state,
        users: [...state.users, newUser],
      });

      setStoredSession({
        role: 'mc',
        email: mcEmail,
        name: mcName,
        businessName: mcBusiness,
        tenantId: newTenantId,
        weddingId: null,
        keepSignedIn: true,
        at: Date.now(),
      });

      showToast(`Welcome to Tap & Toast, ${mcName}!`, 'success');
      if (onSelectView) onSelectView('mc');
    }, 500);
  };

  const handleRegisterCouple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couplePasswordsMatch) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bName = brideName.trim() || 'Sophie';
      const gName = groomName.trim() || 'James';
      const coupleName = `${bName} & ${gName}`;
      const primaryEmail = brideEmail.trim() || groomEmail.trim() || 'couple@example.com';
      const newWeddingId = 'wedding_' + Date.now();

      const bEmail = brideEmail.trim();
      const gEmail = groomEmail.trim();
      const coupleUsers: any[] = [];

      if (bEmail) {
        coupleUsers.push({
          id: 'user_bride_' + Date.now(),
          email: bEmail,
          role: 'couple' as const,
          name: `${bName} (${coupleName})`,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }
      if (gEmail && gEmail.toLowerCase() !== bEmail.toLowerCase()) {
        coupleUsers.push({
          id: 'user_groom_' + Date.now(),
          email: gEmail,
          role: 'couple' as const,
          name: `${gName} (${coupleName})`,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }
      if (coupleUsers.length === 0) {
        coupleUsers.push({
          id: 'user_' + Date.now(),
          email: 'couple@example.com',
          role: 'couple' as const,
          name: coupleName,
          partner1: bName,
          partner2: gName,
          tenantId: 'ten1',
          weddingId: newWeddingId,
        });
      }

      const daysCalc = Math.max(1, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        venue: venue.trim() || 'Venue TBD (To be confirmed)',
        region: 'NSW',
        daysRemaining: isNaN(daysCalc) ? 22 : daysCalc,
        invited: guestCount || 110,
        confirmed: 0,
        declined: 0,
        awaiting: guestCount || 110,
        tablesSeated: 0,
        totalTables: Math.ceil((guestCount || 110) / 10),
        giftsTotal: 0,
        status: 'Planning',
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements & ceremony arch', completed: false, due: 'This week' },
          { id: 't2', text: `Review run sheet with ${preferredMc.split(' ')[0] || 'MC Robert'}`, completed: false, due: 'This week' },
          { id: 't3', text: 'Finalize dietary requirements for venue catering', completed: false, due: 'Next week' },
          { id: 't4', text: 'Share digital QaRd invitation with wedding party', completed: true, due: 'Done' },
        ],
      };

      setState({
        ...state,
        users: [...state.users, ...coupleUsers],
        weddings: [...state.weddings, newWedding],
      });

      setStoredSession({
        role: 'couple',
        email: primaryEmail,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
        keepSignedIn: true,
        at: Date.now(),
      });

      showToast(`Welcome, ${coupleName}! Your wedding portal is ready.`, 'success');
      if (onSelectView) onSelectView('couple');
    }, 500);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[45%_55%] min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans">
      {/* Left Hero Panel (Desktop Only) */}
      <div className="hidden md:flex bg-[#15110e] text-[#f8f6f2] p-10 md:p-14 flex-col justify-center items-center text-center border-r border-[#29211a] relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[42px] h-[42px] border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-lg">
            T
          </div>
          <div className="font-serif text-[26px] font-semibold text-white tracking-[0.5px]">
            Tap &amp; Toast
          </div>
        </div>

        {/* Hero Arch SVG Motif */}
        <div className="my-4">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M10 54V30C10 18.9543 18.9543 10 30 10C41.0457 10 50 18.9543 50 30V54" stroke="#bd9661" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 54V30C16 22.268 22.268 16 30 16C37.732 16 44 22.268 44 30V54" stroke="#bd9661" strokeWidth="0.75" strokeDasharray="3 3"/>
            <circle cx="30" cy="30" r="2.5" fill="#bd9661"/>
          </svg>
        </div>

        <h1 className="font-serif text-[34px] leading-[1.2] text-white mb-3 max-w-[420px]">
          Every wedding, beautifully run.
        </h1>

        <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-7">
          AUSTRALIA'S PREMIER WEDDING MC &amp; PLANNING SUITE
        </div>

        <ul className="list-none p-0 m-0 max-w-[360px] text-left flex flex-col gap-3.5 text-[#c9bbae] text-[13.5px] leading-[1.4]">
          <li className="flex items-start gap-2.5">
            <span className="text-[#bd9661] font-bold">✓</span>
            <span>Multi-tenant run sheets, live cues, and floor plan builder for professional MCs</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#bd9661] font-bold">✓</span>
            <span>QaRd invitation tap-in, real-time RSVP tracking, and Gift &amp; Go wishing wells</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#bd9661] font-bold">✓</span>
            <span>Seamless collaboration between couples, MCs, and wedding coordinators</span>
          </li>
        </ul>
      </div>

      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] px-3.5 py-4 sm:px-6 md:p-10 flex flex-col items-center justify-start overflow-y-auto w-full">
        {/* Mobile Header Banner */}
        <div className="md:hidden flex flex-col items-center justify-center text-center mb-4 w-full max-w-[580px] pt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-base bg-[#15110e]">
              T
            </div>
            <div className="font-serif text-xl font-bold text-[#15110e] tracking-[0.5px]">
              Tap &amp; Toast
            </div>
          </div>
          <p className="text-[11px] text-[#8b7b6b] font-medium">
            Every wedding, beautifully run
          </p>
        </div>

        <div className={`bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl w-full ${accountType === 'couple' ? 'max-w-[580px]' : 'max-w-[480px]'} p-4 sm:p-7 md:p-9 shadow-sm relative my-1 sm:my-3 transition-all duration-200`}>
          <h2 className="font-serif text-[26px] font-bold text-[#15110e] leading-tight mb-1">
            Create your account
          </h2>
          <p className="text-[13.5px] text-[#8b7b6b] mb-6">
            Choose your account type below to get started.
          </p>

          {/* Prominent Account Mode Selector */}
          <div className="grid grid-cols-2 gap-2 bg-[#f0ebe3] p-1.5 rounded-xl mb-6 border border-[#e2d8cb]">
            <button
              type="button"
              onClick={() => {
                setAccountType('couple');
                window.location.hash = 'register';
              }}
              className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                accountType === 'couple'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-md ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
              }`}
            >
              <span className="text-base">👰🤵</span>
              <div className="text-left">
                <div className="leading-tight font-bold">Couple Portal</div>
                <div className="text-[10px] font-normal opacity-75">Groom &amp; Bride Registration</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setAccountType('mc');
                window.location.hash = 'register-mc';
              }}
              className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                accountType === 'mc'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-md ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e] hover:bg-[#e8ded0]/50'
              }`}
            >
              <span className="text-base">🎙️</span>
              <div className="text-left">
                <div className="leading-tight font-bold">MC / Planner</div>
                <div className="text-[10px] font-normal opacity-75">Business &amp; ABN Account</div>
              </div>
            </button>
          </div>

          {accountType === 'mc' ? (
            /* MC / PLANNER REGISTRATION FORM (Matches Screenshot 2) */
            <form onSubmit={handleRegisterMC} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={mcName}
                  onChange={(e) => setMcName(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  BUSINESS NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe Weddings"
                  value={mcBusiness}
                  onChange={(e) => setMcBusiness(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={mcEmail}
                  onChange={(e) => setMcEmail(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  MOBILE NUMBER *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-[4px] select-none">
                    +61
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="0412 345 678"
                    value={mcMobile}
                    onChange={(e) => setMcMobile(formatAuMobile(e.target.value))}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-r-[4px] rounded-l-none px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  AUSTRALIAN BUSINESS NUMBER (ABN) <span className="font-normal text-[#8b7b6b]">(OPTIONAL)</span>
                </label>
                <input
                  type="text"
                  placeholder="12 345 678 901"
                  value={mcAbn}
                  onChange={(e) => setMcAbn(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={mcShowPwd ? 'text' : 'password'}
                    required
                    placeholder="Create a password"
                    value={mcPassword}
                    onChange={(e) => setMcPassword(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMcShowPwd(!mcShowPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                  >
                    {mcShowPwd ? 'Hide' : 'Show'}
                  </button>
                </div>

                {/* Password strength meter */}
                <div className="w-full bg-[#e8ded0] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(strengthScore / 4) * 100}%`,
                      backgroundColor: strengthColor,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#8b7b6b] mt-1">
                  <span>{strengthLabel}</span>
                </div>

                {/* Rules checklist */}
                <ul className="mt-2 space-y-0.5 text-[11.5px] text-[#8b7b6b]">
                  <li className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : ''}`}>
                    <span>•</span> 8+ characters
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-700 font-semibold' : ''}`}>
                    <span>•</span> Uppercase letter
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-700 font-semibold' : ''}`}>
                    <span>•</span> Lowercase letter
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasNum ? 'text-emerald-700 font-semibold' : ''}`}>
                    <span>•</span> Number
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={mcShowConfirm ? 'text' : 'password'}
                    required
                    placeholder="Confirm password"
                    value={mcConfirmPassword}
                    onChange={(e) => setMcConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMcShowConfirm(!mcShowConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                  >
                    {mcShowConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {mcConfirmPassword && (
                  <div className={`text-[11px] mt-1 font-semibold ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-[#8b7b6b] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#bd9661]"
                  />
                  <span>
                    I agree to the <a href="#terms" className="text-[#bd9661] underline">Terms of Service</a> and <a href="#privacy" className="text-[#bd9661] underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-[4px] text-sm font-bold tracking-wide transition-all cursor-pointer mt-4"
              >
                {isSubmitting ? 'Creating account...' : 'Create MC Account \u2192'}
              </button>
            </form>
          ) : (
            /* COUPLE REGISTRATION FORM - ENHANCED WITH GROOM, BRIDE & WEDDING DETAILS */
            <form onSubmit={handleRegisterCouple} className="space-y-5">
              {/* SECTION 1: GROOM DETAILS */}
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8ded0] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc9]">
                  <span className="text-[#bd9661] text-xs font-bold uppercase tracking-wider">🤵 GROOM DETAILS</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    GROOM FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="James Wilson"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      GROOM EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="james.wilson@example.com"
                      value={groomEmail}
                      onChange={(e) => setGroomEmail(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      GROOM CONTACT NUMBER *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-[4px] select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="0412 345 678"
                        value={groomMobile}
                        onChange={(e) => setGroomMobile(formatAuMobile(e.target.value))}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-r-[4px] rounded-l-none px-3 py-2 text-sm text-[#15110e] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRIDE DETAILS */}
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8ded0] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc9]">
                  <span className="text-[#bd9661] text-xs font-bold uppercase tracking-wider">👰 BRIDE DETAILS</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    BRIDE FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sophie Carter"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      BRIDE EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sophie.carter@example.com"
                      value={brideEmail}
                      onChange={(e) => setBrideEmail(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      BRIDE CONTACT NUMBER *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-[4px] select-none">
                        +61
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="0423 456 789"
                        value={brideMobile}
                        onChange={(e) => setBrideMobile(formatAuMobile(e.target.value))}
                        className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-r-[4px] rounded-l-none px-3 py-2 text-sm text-[#15110e] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: WEDDING & EVENT DETAILS (Added according to your will) */}
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e8ded0] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#ebdcc9]">
                  <span className="text-[#bd9661] text-xs font-bold uppercase tracking-wider">💒 WEDDING &amp; VENUE DETAILS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      WEDDING DATE *
                    </label>
                    <input
                      type="date"
                      required
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      ESTIMATED GUEST COUNT
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={800}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    CEREMONY &amp; RECEPTION VENUE <span className="text-[10px] text-[#8b7b6b] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fernwood Estate, Hunter Valley (optional)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      CELEBRATION STYLE / THEME
                    </label>
                    <select
                      value={weddingStyle}
                      onChange={(e) => setWeddingStyle(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-xs text-[#15110e] outline-none cursor-pointer"
                    >
                      <option value="Modern Luxury & Black Tie">Modern Luxury & Black Tie</option>
                      <option value="Classic Ballroom Romance">Classic Ballroom Romance</option>
                      <option value="Rustic Vineyard & Estate">Rustic Vineyard & Estate</option>
                      <option value="Bespoke Bohemian Garden">Bespoke Bohemian Garden</option>
                      <option value="Coastal Waterfront Elegance">Coastal Waterfront Elegance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      PREFERRED MC / HOST
                    </label>
                    <select
                      value={preferredMc}
                      onChange={(e) => setPreferredMc(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-xs text-[#15110e] outline-none cursor-pointer"
                    >
                      <option value="Robert Galati (Galati MC Services)">Robert Galati (Galati MC Services)</option>
                      <option value="Sarah Jenkins (Associate Host)">Sarah Jenkins (Associate Host)</option>
                      <option value="Dave Miller (Audio & AV Lead)">Dave Miller (Audio & AV Lead)</option>
                      <option value="I will select an MC later">I will select an MC later</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: ACCOUNT SECURITY (Matching Image 2 password UI) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={coupleShowPwd ? 'text' : 'password'}
                      required
                      placeholder="Create a password"
                      value={couplePassword}
                      onChange={(e) => setCouplePassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCoupleShowPwd(!coupleShowPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {coupleShowPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div className="w-full bg-[#e8ded0] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(coupleStrengthScore / 4) * 100}%`,
                        backgroundColor: coupleStrengthColor,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#8b7b6b] mt-1">
                    <span>{coupleStrengthLabel}</span>
                  </div>

                  {/* Rules checklist */}
                  <ul className="mt-2 space-y-0.5 text-[11.5px] text-[#8b7b6b]">
                    <li className={`flex items-center gap-1.5 ${coupleHasMinLength ? 'text-emerald-700 font-semibold' : ''}`}>
                      <span>•</span> 8+ characters
                    </li>
                    <li className={`flex items-center gap-1.5 ${coupleHasUpper ? 'text-emerald-700 font-semibold' : ''}`}>
                      <span>•</span> Uppercase letter
                    </li>
                    <li className={`flex items-center gap-1.5 ${coupleHasLower ? 'text-emerald-700 font-semibold' : ''}`}>
                      <span>•</span> Lowercase letter
                    </li>
                    <li className={`flex items-center gap-1.5 ${coupleHasNum ? 'text-emerald-700 font-semibold' : ''}`}>
                      <span>•</span> Number
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={coupleShowConfirm ? 'text' : 'password'}
                      required
                      placeholder="Confirm password"
                      value={coupleConfirmPassword}
                      onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCoupleShowConfirm(!coupleShowConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {coupleShowConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {coupleConfirmPassword && (
                    <div className={`text-[11px] mt-1 font-semibold ${couplePasswordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                      {couplePasswordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: TERMS & SUBMIT */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-[#8b7b6b] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#bd9661]"
                  />
                  <span>
                    I agree to the <a href="#terms" className="text-[#bd9661] underline">Terms of Service</a> and <a href="#privacy" className="text-[#bd9661] underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-[4px] text-sm font-bold tracking-wide transition-all cursor-pointer mt-4 shadow-md"
              >
                {isSubmitting ? 'Creating couple portal...' : 'Create Couple Wedding Portal →'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-[#8b7b6b]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onSelectView && onSelectView('login')}
              className="text-[#bd9661] font-bold hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
