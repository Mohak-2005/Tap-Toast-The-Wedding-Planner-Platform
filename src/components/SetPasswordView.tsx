import React, { useState, useEffect } from 'react';
import { showToast } from '../lib/state';

interface SetPasswordViewProps {
  onSelectView?: (view: string) => void;
  email?: string;
  role?: 'couple' | 'mc';
}

export default function SetPasswordView({ onSelectView, email: initialEmail, role: initialRole }: SetPasswordViewProps) {
  const [email, setEmail] = useState(() => {
    return initialEmail || localStorage.getItem('tt_verify_email') || 'sophie.carter@example.com';
  });
  const [role, setRole] = useState<'couple' | 'mc'>(() => {
    return initialRole || (localStorage.getItem('tt_verify_role') as 'couple' | 'mc') || 'couple';
  });

  const [password, setPassword] = useState('TapToast2026!');
  const [confirmPassword, setConfirmPassword] = useState('TapToast2026!');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('tt_verify_email');
    if (savedEmail) setEmail(savedEmail);
    const savedRole = localStorage.getItem('tt_verify_role');
    if (savedRole === 'mc' || savedRole === 'couple') setRole(savedRole);
  }, []);

  // Password strength calculations
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNum].filter(Boolean).length;
  const strengthColor = strengthScore <= 1 ? '#d9534f' : strengthScore <= 3 ? '#e0a96d' : '#5ea866';
  const strengthLabel = strengthScore === 0 ? 'Password strength' : strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong';
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Please agree to the Terms of Service & Privacy Policy', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Persist password for this user
      localStorage.setItem(`tt_user_pwd_${email.toLowerCase()}`, password);
      localStorage.setItem('tt_login_email', email);
      localStorage.setItem('tt_login_role', role);
      // Set the pending registration flow so login knows where to route
      localStorage.setItem('tt_pending_reg_flow', role === 'couple' ? 'couple_payment' : 'mc_plan');

      showToast('Password successfully set! Please sign in to activate your account.', 'success');
      if (onSelectView) {
        onSelectView('login');
      } else {
        window.location.hash = 'login';
      }
    }, 400);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[40%_60%] min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* Left Hero Panel */}
      <div className="hidden md:flex bg-[#15110e] text-[#f8f6f2] p-10 lg:p-14 flex-col justify-between border-r border-[#29211a] relative">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[38px] h-[38px] border-[1.5px] border-[#bd9661] rounded-[4px] flex items-center justify-center text-[#bd9661] font-serif font-bold text-base">
              T
            </div>
            <div className="font-serif text-[24px] font-semibold text-white tracking-[0.5px]">
              Tap &amp; Toast
            </div>
          </div>

          <div className="my-4">
            <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
              <path d="M10 54V30C10 18.9543 18.9543 10 30 10C41.0457 10 50 18.9543 50 30V54" stroke="#bd9661" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 54V30C16 22.268 22.268 16 30 16C37.732 16 44 22.268 44 30V54" stroke="#bd9661" strokeWidth="0.75" strokeDasharray="3 3" />
              <circle cx="30" cy="30" r="2.5" fill="#bd9661" />
            </svg>
          </div>

          <h1 className="font-serif text-[30px] leading-[1.2] text-white mb-2 max-w-[400px]">
            Set your secure password.
          </h1>

          <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-6">
            ACCOUNT ACTIVATION · EMAIL VERIFIED
          </div>

          <div className="bg-[#1f1914] border border-[#3d3126] rounded-xl p-4 text-xs text-[#c9bbae] space-y-2 max-w-[360px]">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Email Verification Successful</span>
            </div>
            <p className="text-[11.5px] text-[#9b8b7b] leading-relaxed">
              You clicked the secure verification link sent to <strong>{email}</strong>. Create your password below to finalize your credentials and sign in.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-[#8b7b6b]">
          Tap &amp; Toast &bull; Australia's Premier Wedding Platform
        </div>
      </div>

      {/* Right Form Container */}
      <div className="bg-[#f8f6f2] px-4 py-8 sm:px-8 md:p-12 flex flex-col items-center justify-center overflow-y-auto w-full">
        <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-2xl w-full max-w-[560px] p-6 sm:p-9 shadow-sm space-y-6">
          {/* Header */}
          <div>
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#bd9661] mb-1">
              STEP 2 OF 2 &bull; CREDENTIALS &amp; SECURITY
            </div>
            <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-[#15110e] leading-tight">
              Set Your Password
            </h2>
            <p className="text-xs text-[#8b7b6b] mt-1">
              Establish a secure passcode for your {role === 'couple' ? 'Couple Wedding Suite' : 'MC Professional Portal'}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Card matching User Screenshot */}
            <div className="bg-[#faf8f5] p-4 sm:p-5 rounded-2xl border border-[#e8ded0] space-y-3.5 shadow-2xs">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#bd9661] pb-2 border-b border-[#ebdcc9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#bd9661]" />
                  <span>{role === 'couple' ? 'SHARED PORTAL SECURITY' : 'MC ACCOUNT SECURITY'}</span>
                </div>
                <span className="text-[9.5px] text-[#8b7b6b] font-medium tracking-normal">
                  {role === 'couple' ? 'COUPLE LOGIN PASSCODE' : 'HOST CREDENTIALS'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Password field */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    PASSWORD *
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-xl px-3 py-2.5 pr-11 text-xs text-[#15110e] outline-none shadow-2xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] cursor-pointer p-1 transition-colors"
                    >
                      {showPwd ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  <div className="w-full bg-[#e8ded0] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${(strengthScore / 4) * 100}%`, backgroundColor: strengthColor }}
                    />
                  </div>
                  <div className="text-[10.5px] text-[#5a493a] font-medium mt-1">
                    {strengthLabel}
                  </div>
                </div>

                {/* Confirm Password field */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    CONFIRM PASSWORD *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] focus:ring-1 focus:ring-[#bd9661] rounded-xl px-3 py-2.5 pr-11 text-xs text-[#15110e] outline-none shadow-2xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] hover:text-[#15110e] cursor-pointer p-1 transition-colors"
                    >
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div className={`text-[11px] mt-2 font-semibold flex items-center gap-1 ${passwordsMatch ? 'text-[#388e3c]' : 'text-[#d32f2f]'}`}>
                      <span>{passwordsMatch ? '✓' : '✕'}</span>
                      <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs text-[#524436] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#bd9661] focus:ring-[#bd9661] w-4 h-4 cursor-pointer"
                />
                <span>
                  I agree to the <span className="text-[#bd9661] underline font-semibold">Terms of Service</span> and <span className="text-[#bd9661] underline font-semibold">Privacy Policy</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || (confirmPassword.length > 0 && !passwordsMatch)}
                className="w-full py-3.5 px-5 bg-[#15110e] hover:bg-[#241c16] text-[#dfc194] hover:text-white rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Saving Password...' : 'Save Password & Continue to Sign In'}</span>
                <span>→</span>
              </button>
            </div>
          </form>

          {/* Quick back link */}
          <div className="text-center pt-2 border-t border-[#f0ede6]">
            <button
              type="button"
              onClick={() => onSelectView && onSelectView('registration-flow')}
              className="text-xs text-[#8b7b6b] hover:text-[#15110e] transition-colors cursor-pointer"
            >
              &larr; Back to Registration flow email inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
