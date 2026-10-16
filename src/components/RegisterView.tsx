import React, { useState } from 'react';
import { useAppState, setStoredSession, showToast } from '../lib/state';

interface RegisterViewProps {
  onSelectView?: (view: string) => void;
}

export default function RegisterView({ onSelectView }: RegisterViewProps) {
  const { state, setState } = useAppState();
  const [accountType, setAccountType] = useState<'mc' | 'couple'>('mc');

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
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-11-14');
  const [venue, setVenue] = useState('');
  const [coupleEmail, setCoupleEmail] = useState('');
  const [couplePassword, setCouplePassword] = useState('');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (couplePassword !== coupleConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const coupleName = `${partner1} & ${partner2}`;
      const newWeddingId = 'wedding_' + Date.now();
      const newUser = {
        id: 'user_' + Date.now(),
        email: coupleEmail,
        role: 'couple' as const,
        name: coupleName,
        tenantId: 'tenant_galati',
        weddingId: newWeddingId,
      };

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1,
        partner2,
        date: weddingDate,
        venue: venue || 'Southern Highlands Estate',
        region: 'NSW',
        daysRemaining: 30,
        invited: 100,
        confirmed: 0,
        declined: 0,
        awaiting: 100,
        tablesSeated: 0,
        totalTables: 12,
        giftsTotal: 0,
        status: 'Planning',
        tasks: [
          { id: 't1', text: 'Confirm floral arrangements', completed: false, due: 'This week' },
          { id: 't2', text: 'Review run sheet with MC Robert', completed: false, due: 'This week' },
        ],
      };

      setState({
        ...state,
        users: [...state.users, newUser],
        weddings: [...state.weddings, newWedding],
      });

      setStoredSession({
        role: 'couple',
        email: coupleEmail,
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
      {/* Left Hero Panel */}
      <div className="bg-[#15110e] text-[#f8f6f2] p-10 md:p-14 flex flex-col justify-center items-center text-center border-r border-[#29211a] relative">
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
      <div className="bg-[#f8f6f2] p-8 md:p-12 flex items-center justify-center overflow-y-auto">
        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-lg w-full max-w-[480px] p-9 shadow-md relative my-6">
          <h2 className="font-serif text-[26px] font-bold text-[#15110e] leading-tight mb-1">
            Create your account
          </h2>
          <p className="text-[13.5px] text-[#8b7b6b] mb-6">
            Choose your account type below to get started.
          </p>

          {/* Segmented Mode Toggle: MC vs Couple */}
          <div className="flex bg-[#f0ebe3] p-1 rounded-md mb-6">
            <button
              type="button"
              onClick={() => setAccountType('mc')}
              className={`flex-1 py-2 text-xs font-bold rounded transition-all cursor-pointer ${
                accountType === 'mc'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                  : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              I'm an MC / Planner
            </button>
            <button
              type="button"
              onClick={() => setAccountType('couple')}
              className={`flex-1 py-2 text-xs font-bold rounded transition-all cursor-pointer ${
                accountType === 'couple'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-xs'
                  : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              I'm a Couple
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
                  AU MOBILE NUMBER
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0412 345 678"
                  value={mcMobile}
                  onChange={(e) => setMcMobile(formatAuMobile(e.target.value))}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
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
            /* COUPLE REGISTRATION FORM */
            <form onSubmit={handleRegisterCouple} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    PARTNER 1 NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sophie"
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    PARTNER 2 NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="James"
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  WEDDING DATE
                </label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  VENUE OR REGION
                </label>
                <input
                  type="text"
                  placeholder="Fernwood Estate, Hunter Valley"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="sophie.james@example.com"
                  value={coupleEmail}
                  onChange={(e) => setCoupleEmail(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={couplePassword}
                    onChange={(e) => setCouplePassword(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    CONFIRM
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={coupleConfirmPassword}
                    onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-[4px] text-sm font-bold tracking-wide transition-all cursor-pointer mt-4"
              >
                {isSubmitting ? 'Creating portal...' : 'Create Couple Account \u2192'}
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
