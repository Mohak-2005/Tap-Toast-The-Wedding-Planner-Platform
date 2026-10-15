import React, { useState } from 'react';
import { useAppState, useSession, setStoredSession, showToast } from '../lib/state';

interface RegisterViewProps {
  onSelectView?: (view: string) => void;
}

export default function RegisterView({ onSelectView }: RegisterViewProps) {
  const { state, setState } = useAppState();
  const { setSession } = useSession();
  const [mode, setMode] = useState<'mc' | 'couple'>('mc');

  // MC fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [abn, setAbn] = useState('');
  const [plan, setPlan] = useState('Pro ($299/mo)');

  // Couple fields
  const [inviteCode, setInviteCode] = useState('SJ-2026');
  const [partner1, setPartner1] = useState('Sophie');
  const [partner2, setPartner2] = useState('James');

  // Common fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'text-gray-400' };
    if (password.length < 6) return { label: 'Weak', color: 'text-red-600' };
    if (password.length < 10) return { label: 'Moderate', color: 'text-amber-600' };
    return { label: 'Strong', color: 'text-emerald-600' };
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Privacy Policy.');
      return;
    }

    if (mode === 'couple') {
      if (inviteCode.trim().toUpperCase() !== 'SJ-2026') {
        setErrorMsg("That invite code wasn't recognised. Ask your MC for a valid invite code.");
        return;
      }
      // Couple signup
      const newUser = {
        id: 'u_' + Date.now(),
        email,
        passwordHash: 'demo_hash',
        name: `${partner1} & ${partner2}`,
        role: 'couple' as const,
        weddingId: 'w1',
        partner1,
        partner2
      };
      setStoredSession({
        role: 'couple',
        email,
        name: `${partner1} & ${partner2}`,
        weddingId: 'w1',
        keepSignedIn: true,
        at: Date.now()
      });
      showToast('Account created! Welcome to Tap & Toast.', 'success');
      if (onSelectView) onSelectView('couple');
    } else {
      // MC signup
      const newTenant = {
        id: 'ten_' + Date.now(),
        businessName: businessName || `${fullName} Events`,
        contactName: fullName,
        email,
        plan,
        status: 'Trial' as const,
        weddingsCount: 1,
        mrr: 299,
        createdAt: 'Today'
      };
      setState({
        ...state,
        tenants: [newTenant, ...(state.tenants || [])]
      });
      setStoredSession({
        role: 'mc',
        email,
        name: fullName,
        businessName: newTenant.businessName,
        tenantId: newTenant.id,
        keepSignedIn: true,
        at: Date.now()
      });
      showToast('14-day trial account created! Welcome aboard.', 'success');
      if (onSelectView) onSelectView('mc');
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-54px)] bg-[#f8f6f2] font-sans">
      {/* Left Banner */}
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
            Join the new standard of wedding hospitality.
          </h2>
          <p className="text-sm text-[#c9bbae] leading-relaxed">
            Create an MC tenant account with 14-day trial, or redeem your couple invite code to unlock your custom planning dashboard.
          </p>
        </div>

        <div className="pt-8 text-xs text-[#8b7b6b]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onSelectView && onSelectView('login')}
            className="text-[#bd9661] hover:underline font-semibold"
          >
            Sign in &rarr;
          </button>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg bg-white border border-[#e8ded0] border-t-4 border-t-[#bd9661] rounded-2xl p-6 sm:p-8 shadow-md">
          {/* Segmented Mode Selector */}
          <div className="flex bg-[#f5f2eb] p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('mc');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'mc' ? 'bg-[#bd9661] text-[#15110e] shadow-xs' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              I&apos;m an MC / Planner (Trial)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('couple');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'couple' ? 'bg-[#bd9661] text-[#15110e] shadow-xs' : 'text-[#8b7b6b] hover:text-[#15110e]'
              }`}
            >
              I&apos;m a Couple (Invite Only)
            </button>
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#15110e] mb-1">
            {mode === 'mc' ? 'Start your 14-day MC Pro Trial' : 'Redeem your Couple Invitation'}
          </h3>
          <p className="text-xs text-[#8b7b6b] mb-6">
            {mode === 'mc'
              ? 'No credit card required. Full access to stage run sheets, floor plans & client portals.'
              : 'Enter the invite code provided by your Master of Ceremonies.'}
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-[#fbeae8] border border-[#f2c7c2] rounded-lg text-xs text-[#a8382c] font-semibold flex items-center gap-2">
              <span>✕</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {mode === 'couple' ? (
              <>
                <div className="p-3 bg-[#fff8ee] border border-[#ebd4b8] rounded-lg text-xs space-y-1">
                  <span className="font-bold text-[#8c5b1e] uppercase text-[10px]">Invite Code Resolved:</span>
                  <div className="font-bold text-[#15110e]">Sophie &amp; James Wedding · 14 Nov 2026</div>
                  <div className="text-[#8c5b1e]">Lead MC: Robert Galati (Galati MC &amp; Entertainment)</div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Invite Code:
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Partner 1:
                    </label>
                    <input
                      type="text"
                      required
                      value={partner1}
                      onChange={(e) => setPartner1(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Partner 2:
                    </label>
                    <input
                      type="text"
                      required
                      value={partner2}
                      onChange={(e) => setPartner2(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Business Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe Events"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      Mobile (AU Format):
                    </label>
                    <input
                      type="tel"
                      placeholder="04XX XXX XXX"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      ABN (Optional, 11 digits):
                    </label>
                    <input
                      type="text"
                      placeholder="12 345 678 901"
                      value={abn}
                      onChange={(e) => setAbn(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                Email Address:
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                    Password:
                  </label>
                  <span className={`text-[10px] font-bold ${strength.color}`}>{strength.label}</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-lg px-3 py-2 text-xs text-[#15110e] outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#6b5847] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-[#bd9661]"
              />
              <span>I agree to the Terms of Service &amp; Privacy Policy</span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] font-bold py-2.5 rounded-lg text-xs transition-colors shadow-xs"
            >
              {mode === 'mc' ? 'Create MC Pro Trial Account \u2192' : 'Unlock Couple Dashboard \u2192'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
