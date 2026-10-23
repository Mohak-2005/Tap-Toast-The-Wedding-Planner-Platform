import React, { useState } from 'react';
import { useAppState, useSession, showToast, logAudit, setStoredSession } from '../lib/state';

interface SrMobileViewProps {
  onSelectView?: (view: string) => void;
}

export default function SrMobileView({ onSelectView }: SrMobileViewProps) {
  const { state, setState } = useAppState();
  const { session, setSession } = useSession();

  // Mode: 'signin' or 'register'
  const [activeMode, setActiveMode] = useState<'signin' | 'register'>('signin');

  // ==========================================
  // SIGN IN STATE
  // ==========================================
  const [loginRole, setLoginRole] = useState<'mc' | 'couple' | 'superadmin'>('mc');
  const [loginEmail, setLoginEmail] = useState('robert@galati.demo');
  const [loginPassword, setLoginPassword] = useState('Demo1234!');
  const [loginShowPwd, setLoginShowPwd] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Quick fill handler
  const handleQuickFill = (email: string, role: 'mc' | 'couple' | 'superadmin', name: string) => {
    setLoginRole(role);
    setLoginEmail(email);
    setLoginPassword('Demo1234!');
    showToast(`Filled credentials for ${name}`, 'info');
  };

  // Sign in submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      let sessionName = 'Robert Galati';
      let weddingId: string | undefined = undefined;

      if (loginRole === 'superadmin') {
        sessionName = 'Platform Admin';
      } else if (loginRole === 'couple') {
        const found = state.users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
        sessionName = found ? found.name : 'Sophie & James';
        weddingId = found?.weddingId || 'w1';
      } else {
        sessionName = 'Robert Galati';
      }

      const newSession = {
        role: loginRole,
        email: loginEmail,
        name: sessionName,
        weddingId,
        keepSignedIn: loginRemember,
      };

      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'User Login (Mobile)', sessionName, loginRole, `Logged in via S/R Mobile as ${loginRole}`, 'Security');
      showToast(`Welcome back, ${sessionName}!`, 'success');

      if (onSelectView) {
        if (loginRole === 'superadmin') onSelectView('superadmin');
        else if (loginRole === 'couple') onSelectView('couple');
        else onSelectView('mc');
      }
    }, 400);
  };

  // ==========================================
  // REGISTER STATE
  // ==========================================
  const [regAccountType, setRegAccountType] = useState<'couple' | 'mc'>('couple');

  // MC fields
  const [mcName, setMcName] = useState('');
  const [mcBusiness, setMcBusiness] = useState('');
  const [mcEmail, setMcEmail] = useState('');
  const [mcMobile, setMcMobile] = useState('');
  const [mcAbn, setMcAbn] = useState('');
  const [mcPassword, setMcPassword] = useState('');
  const [mcConfirmPassword, setMcConfirmPassword] = useState('');
  const [mcShowPwd, setMcShowPwd] = useState(false);

  // Couple fields
  const [groomName, setGroomName] = useState('');
  const [groomEmail, setGroomEmail] = useState('');
  const [groomMobile, setGroomMobile] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideEmail, setBrideEmail] = useState('');
  const [brideMobile, setBrideMobile] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-11-14');
  const [guestCount, setGuestCount] = useState<number>(110);
  const [venue, setVenue] = useState('');

  const [couplePassword, setCouplePassword] = useState('');
  const [coupleConfirmPassword, setCoupleConfirmPassword] = useState('');
  const [coupleShowPwd, setCoupleShowPwd] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Phone formatter
  const formatAuMobile = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 10);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  };

  // Password strength logic
  const activePassword = regAccountType === 'mc' ? mcPassword : couplePassword;
  const hasMinLength = activePassword.length >= 8;
  const hasUpper = /[A-Z]/.test(activePassword);
  const hasLower = /[a-z]/.test(activePassword);
  const hasNum = /[0-9]/.test(activePassword);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNum].filter(Boolean).length;
  const strengthColor =
    strengthScore === 0 ? '#e5e7eb' : strengthScore <= 2 ? '#ef4444' : strengthScore === 3 ? '#eab308' : '#10b981';
  const strengthLabel =
    strengthScore === 0 ? 'Empty' : strengthScore <= 2 ? 'Weak password' : strengthScore === 3 ? 'Medium strength' : 'Strong password';

  // Registration submit: MC
  const handleRegisterMC = (e: React.FormEvent) => {
    e.preventDefault();
    if (mcPassword !== mcConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to terms', 'error');
      return;
    }
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      const newMcUser = {
        id: 'user_mc_' + Date.now(),
        email: mcEmail.trim(),
        role: 'mc' as const,
        name: mcName.trim() || 'New MC',
        tenantId: 'tenant_' + Date.now(),
      };
      setState({
        ...state,
        users: [...state.users, newMcUser],
      });
      const newSession = {
        role: 'mc' as const,
        email: mcEmail.trim(),
        name: mcName.trim() || 'New MC',
        keepSignedIn: true,
      };
      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'MC Registration (Mobile)', newMcUser.name, 'mc', 'New MC registered via S/R Mobile', 'Security');
      showToast(`Welcome to Tap & Toast, ${newMcUser.name}!`, 'success');
      if (onSelectView) onSelectView('mc');
    }, 450);
  };

  // Registration submit: Couple
  const handleRegisterCouple = (e: React.FormEvent) => {
    e.preventDefault();
    if (couplePassword !== coupleConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to terms', 'error');
      return;
    }
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      const bName = brideName.trim() || 'Sophie';
      const gName = groomName.trim() || 'James';
      const coupleName = `${bName} & ${gName}`;
      const newWeddingId = 'wedding_' + Date.now();
      const bEmail = brideEmail.trim();
      const gEmail = groomEmail.trim();

      const newUsers: any[] = [];
      if (bEmail) {
        newUsers.push({
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
        newUsers.push({
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
      if (newUsers.length === 0) {
        newUsers.push({
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

      const newWedding = {
        id: newWeddingId,
        tenantId: 'tenant_galati',
        couple: coupleName,
        partner1: bName,
        partner2: gName,
        date: weddingDate,
        dateDisplay: new Date(weddingDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        venue: venue.trim() || 'Venue TBD',
        region: 'NSW',
        daysRemaining: 180,
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
          { id: 't2', text: 'Review run sheet with MC Robert', completed: false, due: 'This week' },
        ],
      };

      setState({
        ...state,
        users: [...state.users, ...newUsers],
        weddings: [...state.weddings, newWedding],
      });

      const newSession = {
        role: 'couple' as const,
        email: bEmail || gEmail || 'couple@example.com',
        name: coupleName,
        weddingId: newWeddingId,
        keepSignedIn: true,
      };
      setStoredSession(newSession);
      setSession(newSession);
      logAudit(state, setState, 'Couple Registration (Mobile)', coupleName, 'couple', 'Registered couple via S/R Mobile', 'Security');
      showToast(`Welcome ${coupleName}! Your wedding workspace is ready.`, 'success');
      if (onSelectView) onSelectView('couple');
    }, 450);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[radial-gradient(circle_at_50%_25%,_#f6f3ed_0%,_#e5e0d6_100%)] min-h-[calc(100vh-45px)] overflow-hidden font-sans select-none">
      {/* 402x874 Phone Chassis matching Guest & MC Mobile */}
      <div className="w-[402px] max-w-[402px] h-[874px] max-h-[calc(100vh-60px)] rounded-[46px] border-[4px] border-[#1c1511] bg-[#f8f6f2] shadow-[0_20px_60px_rgba(21,17,14,0.22),_0_4px_14px_rgba(21,17,14,0.08)] overflow-hidden relative flex flex-col">
        {/* Phone Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[13px] font-bold z-20 flex-shrink-0 bg-[#f8f6f2] text-[#15110e]">
          <span>9:41</span>
          <div className="w-20 h-4 bg-[#15110e] rounded-full mx-auto" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[#bd9661] font-bold">5G</span>
            <div className="w-5 h-2.5 border-[1.5px] border-[#15110e] rounded-xs p-0.5 flex items-center relative">
              <div className="w-[85%] h-full bg-[#bd9661] rounded-[1px]" />
              <div className="absolute -right-1 top-0.5 w-[2px] h-1 rounded-r-xs bg-[#15110e]" />
            </div>
          </div>
        </div>

        {/* Brand App Bar */}
        <div className="px-5 pt-1.5 pb-2.5 bg-[#f8f6f2] border-b border-[#e8ded0] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#15110e] text-[#bd9661] font-serif font-bold text-sm rounded flex items-center justify-center border border-[#bd9661]/40">
              T
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-[#15110e] leading-none">
                Tap &amp; Toast
              </div>
              <div className="text-[9px] text-[#8b7b6b] tracking-wider uppercase">
                Mobile Auth Suite
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-[#bd9661]/15 text-[#8a6839] font-bold px-2 py-0.5 rounded-full border border-[#bd9661]/30">
            S/R Mobile
          </span>
        </div>

        {/* Primary Segment Switcher: Sign In vs Register */}
        <div className="p-3 bg-[#f8f6f2] border-b border-[#e8ded0] flex-shrink-0">
          <div className="grid grid-cols-2 p-1 bg-[#ede6da] rounded-xl border border-[#dfd4c3]">
            <button
              type="button"
              onClick={() => setActiveMode('signin')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeMode === 'signin'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e]'
              }`}
            >
              <span>🔑</span> Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeMode === 'register'
                  ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                  : 'text-[#6b5847] hover:text-[#15110e]'
              }`}
            >
              <span>📝</span> Register
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMode === 'signin' ? (
            /* ========================================================== */
            /* MODE 1: MOBILE SIGN IN                                      */
            /* ========================================================== */
            <div className="space-y-4">
              {/* Role selector pill tabs */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  Select Login Portal
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#ede6da] rounded-xl border border-[#dfd4c3]">
                  {(['mc', 'couple', 'superadmin'] as const).map((r) => {
                    const label = r === 'mc' ? 'MC / Pro' : r === 'couple' ? 'Couple' : 'Super Admin';
                    const active = loginRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setLoginRole(r);
                          if (r === 'mc') setLoginEmail('robert@galati.demo');
                          else if (r === 'couple') setLoginEmail('sophie@demo.test');
                          else setLoginEmail('admin@tapandtoast.demo');
                        }}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-[#15110e] shadow-xs border border-[#bd9661]'
                            : 'text-[#6b5847] hover:text-[#15110e]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Header */}
              <div>
                <h2 className="font-serif text-xl font-bold text-[#15110e]">
                  Sign in to your {loginRole === 'mc' ? 'MC / Pro' : loginRole === 'couple' ? 'Couple' : 'Super Admin'} account
                </h2>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Enter your credentials below to access your dashboard.
                </p>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={loginShowPwd ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 pr-12 text-xs text-[#15110e] outline-none"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPwd(!loginShowPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {loginShowPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8b7b6b] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginRemember}
                      onChange={(e) => setLoginRemember(e.target.checked)}
                      className="rounded text-[#bd9661]"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link sent to registered email', 'info');
                    }}
                    className="text-[#bd9661] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm mt-1"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In →'}
                </button>
              </form>

              {/* Demo Accounts (1-Click Fill) */}
              <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                  Demo Accounts (1-Click Fill)
                </div>
                <div className="space-y-1.5 text-xs">
                  <div
                    onClick={() => handleQuickFill('robert@galati.demo', 'mc', 'Robert Galati (MC)')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">Robert Galati (MC / Pro)</div>
                      <div className="text-[10px] text-[#8b7b6b]">robert@galati.demo</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>

                  <div
                    onClick={() => handleQuickFill('sophie@demo.test', 'couple', 'Sophie Bell (Bride)')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">Sophie Bell (Bride)</div>
                      <div className="text-[10px] text-[#8b7b6b]">sophie@demo.test</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>

                  <div
                    onClick={() => handleQuickFill('james@demo.test', 'couple', 'James Gordon (Groom)')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">James Gordon (Groom)</div>
                      <div className="text-[10px] text-[#8b7b6b]">james@demo.test</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>

                  <div
                    onClick={() => handleQuickFill('admin@tapandtoast.demo', 'superadmin', 'Platform Admin')}
                    className="p-2 bg-white rounded-lg border border-[#ebdcc9] flex items-center justify-between cursor-pointer hover:border-[#bd9661] transition-all"
                  >
                    <div>
                      <div className="font-semibold text-[#15110e] text-[11px]">Platform Super Admin</div>
                      <div className="text-[10px] text-[#8b7b6b]">admin@tapandtoast.demo</div>
                    </div>
                    <span className="text-[#bd9661] font-bold text-[11px]">Use →</span>
                  </div>
                </div>
              </div>

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-[#8b7b6b] pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveMode('register')}
                  className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /* MODE 2: MOBILE REGISTER                                     */
            /* ========================================================== */
            <div className="space-y-4">
              {/* Account Type Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegAccountType('couple')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regAccountType === 'couple'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                        : 'bg-white border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e]'
                    }`}
                  >
                    <span>👰🤵</span> Couple Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegAccountType('mc')}
                    className={`py-2 px-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      regAccountType === 'mc'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-sm ring-1 ring-[#bd9661]'
                        : 'bg-white border border-[#d5c7b5] text-[#6b5847] hover:text-[#15110e]'
                    }`}
                  >
                    <span>🎙️</span> MC / Planner
                  </button>
                </div>
              </div>

              {regAccountType === 'couple' ? (
                /* COUPLE REGISTRATION FORM */
                <form onSubmit={handleRegisterCouple} className="space-y-4">
                  {/* Groom Section */}
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>🤵</span> Groom Details
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Groom Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        placeholder="James Wilson"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Groom Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={groomEmail}
                        onChange={(e) => setGroomEmail(e.target.value)}
                        placeholder="james@example.com"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Groom Contact Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 py-1.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          value={groomMobile}
                          onChange={(e) => setGroomMobile(formatAuMobile(e.target.value))}
                          placeholder="0412 345 678"
                          className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bride Section */}
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>👰</span> Bride Details
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Bride Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        placeholder="Sophie Carter"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Bride Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={brideEmail}
                        onChange={(e) => setBrideEmail(e.target.value)}
                        placeholder="sophie@example.com"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Bride Contact Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 py-1.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          value={brideMobile}
                          onChange={(e) => setBrideMobile(formatAuMobile(e.target.value))}
                          placeholder="0423 456 789"
                          className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wedding Details */}
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>💒</span> Wedding &amp; Venue
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={weddingDate}
                          onChange={(e) => setWeddingDate(e.target.value)}
                          className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                          Guests *
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={guestCount}
                          onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Ceremony &amp; Reception Venue <span className="font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Fernwood Estate, Hunter Valley"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                  </div>

                  {/* Password & Security */}
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>🔒</span> Account Password
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={coupleShowPwd ? 'text' : 'password'}
                          required
                          value={couplePassword}
                          onChange={(e) => setCouplePassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 pr-12 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                        <button
                          type="button"
                          onClick={() => setCoupleShowPwd(!coupleShowPwd)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#bd9661] font-bold"
                        >
                          {coupleShowPwd ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {/* Password strength */}
                      <div className="w-full bg-[#e8ded0] h-1 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${(strengthScore / 4) * 100}%`,
                            backgroundColor: strengthColor,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={coupleShowPwd ? 'text' : 'password'}
                        required
                        value={coupleConfirmPassword}
                        onChange={(e) => setCoupleConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                      {coupleConfirmPassword && (
                        <div
                          className={`text-[10px] mt-0.5 font-semibold ${
                            couplePassword === coupleConfirmPassword ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {couplePassword === coupleConfirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 text-[11px] text-[#8b7b6b] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#bd9661]"
                    />
                    <span>I agree to the Terms of Service &amp; Privacy Policy</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm"
                  >
                    {isRegistering ? 'Creating Couple Account...' : 'Create Couple Account →'}
                  </button>
                </form>
              ) : (
                /* MC REGISTRATION FORM */
                <form onSubmit={handleRegisterMC} className="space-y-3.5">
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>🎙️</span> MC Profile Details
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={mcName}
                        onChange={(e) => setMcName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={mcBusiness}
                        onChange={(e) => setMcBusiness(e.target.value)}
                        placeholder="Jane Doe Weddings"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={mcEmail}
                        onChange={(e) => setMcEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 py-1.5 border border-r-0 border-[#d5c7b5] bg-[#f5ede2] text-xs font-bold text-[#6b5847] rounded-l-lg select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          value={mcMobile}
                          onChange={(e) => setMcMobile(formatAuMobile(e.target.value))}
                          placeholder="0412 345 678"
                          className="w-full bg-white border border-[#d5c7b5] rounded-r-lg rounded-l-none px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        ABN <span className="font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={mcAbn}
                        onChange={(e) => setMcAbn(e.target.value)}
                        placeholder="12 345 678 901"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebdcc9] space-y-2.5">
                    <div className="text-[#bd9661] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-[#ebdcc9]">
                      <span>🔒</span> Password
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={mcShowPwd ? 'text' : 'password'}
                          required
                          value={mcPassword}
                          onChange={(e) => setMcPassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 pr-12 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                        <button
                          type="button"
                          onClick={() => setMcShowPwd(!mcShowPwd)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#bd9661] font-bold"
                        >
                          {mcShowPwd ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div className="w-full bg-[#e8ded0] h-1 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${(strengthScore / 4) * 100}%`,
                            backgroundColor: strengthColor,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b7b6b] mt-0.5">{strengthLabel}</div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#8b7b6b] mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={mcShowPwd ? 'text' : 'password'}
                        required
                        value={mcConfirmPassword}
                        onChange={(e) => setMcConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-white border border-[#d5c7b5] rounded-lg px-2.5 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 text-[11px] text-[#8b7b6b] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#bd9661]"
                    />
                    <span>I agree to the Terms of Service &amp; Privacy Policy</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-2.5 px-4 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm"
                  >
                    {isRegistering ? 'Creating MC Account...' : 'Create MC Account →'}
                  </button>
                </form>
              )}

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-[#8b7b6b] pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveMode('signin')}
                  className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Phone Bottom Home Bar */}
        <div className="py-2 flex justify-center bg-[#f8f6f2] flex-shrink-0 border-t border-[#ebdcc9]/50">
          <div className="w-32 h-1 bg-[#15110e]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
