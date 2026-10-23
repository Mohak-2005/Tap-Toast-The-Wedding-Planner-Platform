import React, { useState, useEffect } from 'react';
import { useSession, useAppState, setStoredSession, showToast, setDemoSessionForRole } from '../lib/state';

interface LoginViewProps {
  onSelectView?: (view: string) => void;
  targetRole?: 'mc' | 'couple' | 'superadmin';
}

export default function LoginView({ onSelectView, targetRole = 'mc' }: LoginViewProps) {
  const { session, clearSession } = useSession();
  const { state } = useAppState();
  const [showSwitchForm, setShowSwitchForm] = useState(false);
  const [role, setRole] = useState<'mc' | 'couple' | 'superadmin'>(targetRole);
  const [email, setEmail] = useState('robert@galati.demo');
  const [password, setPassword] = useState('Demo1234!');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleRoleChange = (newRole: 'mc' | 'couple' | 'superadmin') => {
    setRole(newRole);
    setErrorMsg('');
    if (newRole === 'mc') {
      setEmail('robert@galati.demo');
      setPassword('Demo1234!');
    } else if (newRole === 'couple') {
      setEmail('sophie.james@demo.test');
      setPassword('Demo1234!');
    } else {
      setEmail('admin@tapandtoast.demo');
      setPassword('Demo1234!');
    }
  };

  const handle1ClickFill = (fillRole: 'mc' | 'couple' | 'superadmin', fillEmail: string) => {
    setRole(fillRole);
    setEmail(fillEmail);
    setPassword('Demo1234!');
    setErrorMsg('');
    showToast(`Filled demo credentials for ${fillRole.toUpperCase()}`, 'info');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || password !== 'Demo1234!') {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutTimer(30);
          setErrorMsg('Too many attempts. Try again in 30s.');
        } else {
          setErrorMsg("That email and password don't match.");
        }
        return;
      }

      // Success
      setStoredSession({
        role: user.role,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        tenantId: user.tenantId,
        weddingId: user.weddingId,
        keepSignedIn,
        at: Date.now()
      });
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (onSelectView) {
        onSelectView(user.role === 'mc' ? 'mc' : user.role === 'couple' ? 'couple' : 'superadmin');
      }
    }, 400);
  };

  const handleContinueToDashboard = () => {
    if (!onSelectView) return;
    if (session?.role === 'couple') {
      onSelectView('couple');
    } else if (session?.role === 'superadmin') {
      onSelectView('superadmin');
    } else {
      onSelectView('mc');
    }
  };

  const handleSignOutToForm = () => {
    clearSession();
    setShowSwitchForm(true);
    showToast('Signed out. Please select an account or role.', 'info');
  };

  const isAlreadySignedIn = session && session.name && !showSwitchForm;

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
      <div className="bg-[#f8f6f2] px-3.5 py-6 sm:px-6 md:p-12 flex flex-col items-center justify-center overflow-y-auto w-full">
        {/* Mobile Header Banner */}
        <div className="md:hidden flex flex-col items-center justify-center text-center mb-5 w-full max-w-[460px] pt-1">
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

        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl w-full max-w-[460px] p-5 sm:p-7 md:p-9 shadow-sm relative">
          {/* ALREADY SIGNED IN VIEW (Matches Screenshot 1) */}
          {isAlreadySignedIn ? (
            <div className="text-center py-2">
              <div className="text-[38px] mb-3">👋</div>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-2">
                Welcome back
              </h2>
              <p className="text-[13.5px] text-[#8b7b6b] mb-6">
                You're currently signed in as <strong className="text-[#15110e]">{session.name}</strong> (<span className="text-[#bd9661] font-semibold uppercase">{session.role}</span>).
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleContinueToDashboard}
                  className="w-full py-3 px-4 bg-[#15110e] text-[#dfc194] hover:bg-[#241c16] hover:text-white rounded-[4px] text-sm font-bold tracking-wide transition-all cursor-pointer"
                >
                  Continue to Dashboard &rarr;
                </button>
                <button
                  type="button"
                  onClick={handleSignOutToForm}
                  className="w-full py-2.5 px-4 bg-white text-[#15110e] border border-[#d5c7b5] hover:bg-[#f0ede4] rounded-[4px] text-sm font-semibold transition-all cursor-pointer"
                >
                  Sign out &bull; Switch Account
                </button>
              </div>
            </div>
          ) : (
            /* SIGN IN FORM VIEW */
            <div>
              {/* Role Tabs */}
              <div className="flex gap-1.5 bg-[#f0ebe3] p-1 rounded-md mb-6">
                {[
                  { id: 'mc', label: 'MC / Pro' },
                  { id: 'couple', label: 'Couple' },
                  { id: 'superadmin', label: 'Super Admin' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleRoleChange(tab.id as any)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                      role === tab.id
                        ? 'bg-white text-[#15110e] shadow-xs font-bold'
                        : 'text-[#8b7b6b] hover:text-[#15110e]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <h2 className="font-serif text-[26px] text-[#15110e] leading-tight mb-1 font-bold">
                Sign in to your {role === 'mc' ? 'MC / Pro' : role === 'couple' ? 'Couple' : 'Super Admin'} account
              </h2>
              <p className="text-[13.5px] text-[#8b7b6b] mb-5">
                Enter your credentials below to access your dashboard.
              </p>

              {/* Lockout Message */}
              {lockoutTimer > 0 && (
                <div className="mb-4 p-3 bg-[#fbeae8] border border-[#f2c7c2] rounded text-xs text-[#a8382c] font-semibold">
                  Too many attempts. Try again in {lockoutTimer}s
                </div>
              )}

              {/* Error Message */}
              {errorMsg && lockoutTimer === 0 && (
                <div className="mb-4 p-3 bg-[#fbeae8] border border-[#f2c7c2] rounded text-xs text-[#a8382c] font-semibold flex items-center justify-between">
                  <span>{errorMsg}</span>
                  <button
                    type="button"
                    onClick={() => handleRoleChange(role === 'mc' ? 'couple' : 'mc')}
                    className="ml-2 px-2 py-0.5 bg-white border border-[#a8382c] text-[#a8382c] rounded text-[11px] font-bold"
                  >
                    Switch Tab
                  </button>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 text-sm text-[#15110e] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-[4px] px-3 py-2 pr-14 text-sm text-[#15110e] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bd9661] font-semibold hover:underline cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[13px] text-[#8b7b6b] pt-1 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="rounded text-[#bd9661]"
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Demo password is Demo1234!', 'info')}
                    className="text-[#bd9661] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || lockoutTimer > 0}
                  className="w-full py-3 px-4 bg-[#15110e] hover:bg-[#241c16] disabled:opacity-60 text-[#dfc194] hover:text-white rounded-[4px] text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Verifying...' : lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : 'Sign In \u2192'}
                </button>
              </form>

              {/* Demo Accounts Panel */}
              <details className="mt-5 border border-[#e8ded0] rounded-[4px] p-2.5 bg-[#fdfbf7] text-xs" open>
                <summary className="font-bold text-[#8b7b6b] cursor-pointer select-none uppercase tracking-wider text-[11px]">
                  Demo Accounts (1-Click Fill)
                </summary>
                <div className="mt-2.5 space-y-1.5">
                  <div
                    onClick={() => handle1ClickFill('mc', 'robert@galati.demo')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">Robert Galati</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(MC / Pro)</span>
                      <div className="text-[11px] text-[#8b7b6b]">robert@galati.demo &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>

                  <div
                    onClick={() => handle1ClickFill('couple', 'sophie@demo.test')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">Sophie Bell (Bride)</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(Shared Couple Portal)</span>
                      <div className="text-[11px] text-[#8b7b6b]">sophie@demo.test &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>

                  <div
                    onClick={() => handle1ClickFill('couple', 'james@demo.test')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">James Gordon (Groom)</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(Shared Couple Portal)</span>
                      <div className="text-[11px] text-[#8b7b6b]">james@demo.test &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>

                  <div
                    onClick={() => handle1ClickFill('superadmin', 'admin@tapandtoast.demo')}
                    className="p-2 border border-[#ebd4b7] rounded bg-white hover:border-[#bd9661] cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#15110e]">Super Admin</strong>{' '}
                      <span className="text-[#bd9661] font-semibold">(Platform Ops)</span>
                      <div className="text-[11px] text-[#8b7b6b]">admin@tapandtoast.demo &bull; Demo1234!</div>
                    </div>
                    <span className="text-xs text-[#bd9661] font-bold">Use &rarr;</span>
                  </div>
                </div>
              </details>

              {/* Bottom Register Link */}
              <div className="mt-5 text-center text-xs text-[#8b7b6b]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onSelectView && onSelectView('register')}
                  className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
