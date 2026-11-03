import React, { useState } from 'react';
import { showToast } from '../lib/state';

interface RegistrationFlowViewProps {
  onSelectView?: (view: string) => void;
}

interface RecipientOption {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  role: 'couple' | 'mc';
  avatarInitials: string;
}

const DEMO_ACCOUNTS: RecipientOption[] = [
  {
    id: 'bride',
    name: 'Sophie Carter',
    email: 'sophie.carter@example.com',
    roleTitle: 'Bride · Couple Portal',
    role: 'couple',
    avatarInitials: 'SC',
  },
  {
    id: 'groom',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    roleTitle: 'Groom · Couple Portal',
    role: 'couple',
    avatarInitials: 'JW',
  },
  {
    id: 'mc',
    name: 'Anthony Rossi',
    email: 'anthony@rossievents.demo',
    roleTitle: 'Certified MC · Rossi Event Architecture',
    role: 'mc',
    avatarInitials: 'AR',
  },
];

export default function RegistrationFlowView({ onSelectView }: RegistrationFlowViewProps) {
  // Check if a specific recipient was recently registered
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(() => {
    const savedEmail = localStorage.getItem('tt_verify_email');
    const savedRole = localStorage.getItem('tt_verify_role');
    if (savedRole === 'mc') return 'mc';
    if (savedEmail?.toLowerCase().includes('james')) return 'groom';
    return 'bride';
  });

  const [activeClientTheme, setActiveClientTheme] = useState<'apple' | 'gmail'>('apple');

  const currentRecipient = DEMO_ACCOUNTS.find((a) => a.id === selectedRecipientId) || DEMO_ACCOUNTS[0];

  const handleOpenSetPassword = (recipient: RecipientOption) => {
    localStorage.setItem('tt_verify_email', recipient.email);
    localStorage.setItem('tt_verify_role', recipient.role);
    showToast(`Opening verification link for ${recipient.name} (${recipient.email})`, 'info');
    if (onSelectView) {
      onSelectView('set-password');
    } else {
      window.location.hash = 'set-password';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#ede8e1] min-h-[calc(100vh-45px)] font-sans select-none overflow-y-auto">
      {/* Top Mail Simulation Control Bar */}
      <div className="bg-[#181310] text-[#f8f6f2] px-4 py-3 border-b border-[#2d241c] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#bd9661] text-[#15110e] flex items-center justify-center font-serif font-bold text-base shadow-sm">
            ✉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                Registration Flow · Email Verification Inbox
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.5 rounded font-mono font-semibold uppercase">
                Simulated Webmail
              </span>
            </div>
            <p className="text-[11px] text-[#9b8b7b]">
              Simulating incoming verification emails sent to Bride, Groom, and MC after registration.
            </p>
          </div>
        </div>

        {/* Recipient Quick Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#251e18] p-1 rounded-xl border border-[#3d3126]">
          <span className="text-[10.5px] uppercase font-bold text-[#bd9661] px-2 hidden sm:inline">
            Switch Inbox:
          </span>
          {DEMO_ACCOUNTS.map((account) => {
            const isSelected = account.id === selectedRecipientId;
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => setSelectedRecipientId(account.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#dfc194] text-[#15110e] font-bold shadow-xs'
                    : 'text-[#b9a999] hover:text-white hover:bg-[#322820]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{account.name}</span>
                <span className="text-[10px] opacity-75 hidden md:inline">({account.role.toUpperCase()})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Mail Reading Pane */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-start">
        {/* Email Window Chrome */}
        <div className="bg-white rounded-2xl border border-[#ded5c6] shadow-xl overflow-hidden flex flex-col">
          {/* Email Window Header (macOS / Gmail style) */}
          <div className="bg-[#f7f5f0] border-b border-[#e8dfd0] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#e06c75] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#e5c07b] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#98c379] inline-block"></span>
              <span className="text-xs text-[#786b5c] font-medium ml-2">
                Inbox · {currentRecipient.roleTitle}
              </span>
            </div>

            {/* Client Theme Switcher */}
            <div className="flex items-center gap-1 bg-[#eae3d5] p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setActiveClientTheme('apple')}
                className={`px-2.5 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  activeClientTheme === 'apple' ? 'bg-white text-[#15110e] shadow-2xs font-semibold' : 'text-[#7a6f62]'
                }`}
              >
                Apple Mail
              </button>
              <button
                type="button"
                onClick={() => setActiveClientTheme('gmail')}
                className={`px-2.5 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                  activeClientTheme === 'gmail' ? 'bg-white text-[#15110e] shadow-2xs font-semibold' : 'text-[#7a6f62]'
                }`}
              >
                Gmail
              </button>
            </div>
          </div>

          {/* Email Metadata */}
          <div className="p-5 sm:p-6 bg-[#fcfbf9] border-b border-[#eee7db] space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#15110e] leading-snug">
                ✨ Action Required: Verify your email &amp; set your password for Tap &amp; Toast
              </h1>
              <span className="text-xs text-[#8b7b6b] whitespace-nowrap bg-white px-2.5 py-1 rounded-md border border-[#e8ded0]">
                Just Now &bull; Today
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-[#15110e] text-[#bd9661] font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-[#bd9661]/40 shadow-xs">
                T
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#15110e]">Tap &amp; Toast Security &amp; Onboarding</span>
                  <span className="text-[#8b7b6b] text-[11px]">&lt;welcome@tapandtoast.app&gt;</span>
                </div>
                <div className="text-[#8b7b6b] mt-0.5 flex items-center gap-1.5 text-[11.5px] flex-wrap">
                  <span>To:</span>
                  <span className="font-semibold text-[#15110e]">{currentRecipient.name}</span>
                  <span className="text-[#6e6052] font-mono">&lt;{currentRecipient.email}&gt;</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    {currentRecipient.role === 'couple' ? 'Couple Onboarding' : 'MC Professional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="p-6 sm:p-10 bg-white flex flex-col items-center">
            {/* Elegant Luxury Branded Email Card */}
            <div className="w-full max-w-xl border border-[#e8dfd0] rounded-2xl bg-[#fdfbf7] p-6 sm:p-8 shadow-xs relative overflow-hidden">
              {/* Luxury Gold Border Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#bd9661] via-[#e2c89f] to-[#bd9661]"></div>

              {/* Tap & Toast Brand Header */}
              <div className="text-center pb-6 border-b border-[#eee4d5] space-y-1.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#15110e] border border-[#bd9661] text-[#bd9661] font-serif font-bold text-xl shadow-xs">
                  T
                </div>
                <div className="font-serif text-2xl font-bold text-[#15110e] tracking-wide">
                  Tap <span className="text-[#bd9661]">&amp;</span> Toast
                </div>
                <div className="text-[9.5px] uppercase tracking-[2.5px] text-[#8b7b6b] font-bold">
                  AUSTRALIA'S PREMIER WEDDING INTELLIGENCE PLATFORM
                </div>
              </div>

              {/* Personalized Message Body */}
              <div className="py-6 space-y-4 text-xs sm:text-sm text-[#3d3228] leading-relaxed">
                <p className="font-serif text-base sm:text-lg text-[#15110e] font-semibold">
                  Dear {currentRecipient.name},
                </p>

                {currentRecipient.role === 'couple' ? (
                  <>
                    <p>
                      Welcome to <strong>Tap &amp; Toast</strong>! Your wedding celebration profile has been initiated. Both bride and groom receive their individual verification links so you can securely establish your shared wedding suite passcode.
                    </p>
                    <p>
                      Please verify your email address and set your account password below. Once set, you will be directed to sign in and proceed to <strong>Step 2: Choose Your Plan &amp; Payment</strong>, followed by your <strong>Step 3: Certified MC Setup</strong>.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Welcome to the <strong>Tap &amp; Toast MC Professional Network</strong>! Your Master of Ceremonies registration details have been received.
                    </p>
                    <p>
                      Please verify your email address and set your private password below. Once set, you will be directed to sign in and proceed straight to <strong>Select Your MC Subscription Plan</strong> to activate your host listing and launch your MC Portal.
                    </p>
                  </>
                )}

                {/* Primary CTA Button */}
                <div className="py-5 flex flex-col items-center justify-center text-center">
                  <button
                    type="button"
                    onClick={() => handleOpenSetPassword(currentRecipient)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#15110e] hover:bg-[#2b2118] text-[#dfc194] hover:text-white rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span>Verify email</span>
                  </button>
                </div>

                {/* Info Callout Box */}
                <div className="bg-[#f5ede0]/70 border border-[#e4d4bf] rounded-xl p-3.5 space-y-1 text-xs text-[#5a493a]">
                  <div className="font-bold flex items-center gap-1.5 text-[#15110e]">
                    <span className="text-[#bd9661]">🔒</span>
                    <span>Account Security Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#6d5b49]">
                    This secure activation link was generated for <strong>{currentRecipient.email}</strong>. It will expire in 24 hours. If you did not create a Tap &amp; Toast account, you can safely ignore this email.
                  </p>
                </div>
              </div>

              {/* Email Footer */}
              <div className="pt-6 border-t border-[#eee4d5] text-center space-y-1">
                <div className="text-[11px] font-semibold text-[#8b7b6b]">
                  Tap &amp; Toast SaaS &bull; Southern Highlands &amp; Sydney, Australia
                </div>
                <div className="text-[10px] text-[#a89b8d]">
                  Questions or need assistance? Reply directly to support@tapandtoast.app
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
