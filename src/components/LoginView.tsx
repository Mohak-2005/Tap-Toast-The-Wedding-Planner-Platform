import React, { useState, useEffect } from 'react';
import { useSession, useAppState, setStoredSession, showToast } from '../lib/state';

interface LoginViewProps {
  onSelectView?: (view: string) => void;
  targetRole?: 'mc' | 'couple' | 'superadmin';
}

export default function LoginView({ onSelectView, targetRole = 'mc' }: LoginViewProps) {
  const { session, clearSession } = useSession();
  const { state } = useAppState();
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Validate credentials
      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || password !== 'Demo1234!') {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutTimer(30);
          setErrorMsg('Too many failed attempts. Try again in 30s.');
        } else {
          setErrorMsg("That email and password don't match.");
        }
        return;
      }

      if (user.role !== role) {
        setErrorMsg(`This account belongs to a ${user.role.toUpperCase()} account.`);
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
    }, 450);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-54px)] bg-[#f8f6f2] font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-5/12 bg-[#15110e] text-white p-8 sm:p-12 flex flex-col justify-between border-r border-[#2b221a]">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="w-8 h-8 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-base rounded flex items-center justify-center">
              T
            </span>
            <span className="font-serif text-xl font-bold tracking-wide">
              Tap &amp; Toast
            </span>
          </div>

          <div className="w-16 h-0.5 bg-[#bd9661] mb-6" />

          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white mb-4">
            Every wedding, beautifully run.
          </h2>
          <p className="text-sm text-[#c9bbae] leading-relaxed">
            Australia&apos;s luxury MC and hospitality suite connecting couples, guests, and stage masters in perfect harmony.
          </p>
        </div>

        <div className="pt-8 text-xs text-[#8b7b6b]">
          Guest attending a wedding? No account needed.
          <button
            type="button"
            onClick={() => onSelectView && onSelectView('guest-mobile')}
            className="text-[#bd9661] hover:underline font-semibold block mt-1"
          >
            📱 Scan your luxury QaRd &rarr;
          </button>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-[#e8ded0] border-t-4 border-t-[#bd9661] rounded-2xl p-6 sm:p-8 shadow-md">
          {/* Role Tabs */}
          <div className="flex bg-[#f5f2eb] p-1 rounded-xl mb-6">
            {[
              { id: 'mc', label: 'MC / Pro' },
              { id: 'couple', label: 'Couple' },
              { id: 'superadmin', label: 'Super Admin' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleRoleChange(tab.id as any)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  role === tab.id
                    ? 'bg-[#bd9661] text-[#15110e] shadow-xs'
                    : 'text-[#8b7b6b] hover:text-[#15110e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#15110e] mb-1">
            Sign in to your {role.toUpperCase()} account
          </h3>
          <p className="text-xs text-[#8b7b6b] mb-6">
            Enter your credentials or use the 1-click presets below.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-[#fbeae8] border border-[#f2c7c2] rounded-lg text-xs text-[#a8382c] font-semibold flex items-center gap-2">
              <span>✕</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                Email Address:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                  Password:
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#bd9661] hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#6b5847] cursor-pointer">
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
                onClick={() => showToast('Password reset email simulated! Check console for code.', 'info')}
                className="text-[#bd9661] hover:underline text-[11px]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || lockoutTimer > 0}
              className="w-full bg-[#15110e] hover:bg-[#231c17] disabled:opacity-50 text-[#dfc194] font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Verifying...' : lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : 'Sign In \u2192'}
            </button>
          </form>

          {/* Preset Fill */}
          <div className="mt-6 pt-5 border-t border-[#f2ede7] text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] block mb-2">
              1-Click Demo Credentials:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('mc')}
                className="flex-1 p-2 bg-[#fbf9f6] border border-[#e8ded0] rounded text-[11px] text-[#6b5847] hover:border-[#bd9661] font-semibold"
              >
                Use MC (Robert)
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('couple')}
                className="flex-1 p-2 bg-[#fbf9f6] border border-[#e8ded0] rounded text-[11px] text-[#6b5847] hover:border-[#bd9661] font-semibold"
              >
                Use Couple (Sophie)
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center text-xs text-[#8b7b6b]">
            New to Tap &amp; Toast?{' '}
            <button
              type="button"
              onClick={() => onSelectView && onSelectView('register')}
              className="text-[#bd9661] font-bold hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
