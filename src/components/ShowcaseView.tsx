import React from 'react';
import { useAppState, useSession, setDemoSessionForRole, showToast } from '../lib/state';

interface ShowcaseViewProps {
  onSelectView: (view: string) => void;
}

export default function ShowcaseView({ onSelectView }: ShowcaseViewProps) {
  const { state, resetState } = useAppState();
  const { session } = useSession();

  const handleLaunch = (role: 'couple' | 'mc' | 'superadmin' | null, viewId: string) => {
    if (role) {
      setDemoSessionForRole(role);
    }
    onSelectView(viewId);
  };

  const handleReset = () => {
    resetState();
    showToast('Demo data reset to initial seed state', 'success');
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-[#15110e] flex flex-col font-sans">
      {/* Hero Section */}
      <section className="bg-[#15110e] text-[#f8f6f2] pt-14 pb-16 px-6 text-center border-b-2 border-[#bd9661] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(189,150,97,0.18)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-[#bd9661] bg-[#1f1813] px-3.5 py-1 rounded-full text-xs font-bold text-[#dfc194] tracking-widest uppercase mb-5">
            <span>🥂</span>
            <span>Tap &amp; Toast · Interactive Client Prototype</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Australia&apos;s Premier Wedding MC &amp; Hospitality Platform
          </h1>
          <p className="text-base sm:text-lg text-[#c9bbae] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Experience the complete end-to-end wedding day operating system across all core personas: Couples, Guests, MC Professionals, and Platform Super Administrators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleLaunch('couple', 'couple')}
              className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-5 py-2.5 rounded text-sm transition-all shadow-md flex items-center gap-2"
            >
              💍 Launch Couple Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleLaunch(null, 'guest-mobile')}
              className="bg-[#241c16] hover:bg-[#332820] text-[#e6cda6] border border-[#4a3a2d] font-semibold px-5 py-2.5 rounded text-sm transition-all flex items-center gap-2"
            >
              📱 Guest Mobile (402×874)
            </button>
            <button
              type="button"
              onClick={() => handleLaunch('mc', 'mc')}
              className="bg-[#241c16] hover:bg-[#332820] text-[#e6cda6] border border-[#4a3a2d] font-semibold px-5 py-2.5 rounded text-sm transition-all flex items-center gap-2"
            >
              🎧 MC Pro Console
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Notice Card */}
        <div className="bg-[#fff8ee] border border-[#ebd4b8] border-l-4 border-l-[#bd9661] rounded-lg p-4 sm:p-5 mb-10 flex items-center justify-between gap-4 flex-wrap shadow-sm">
          <div className="text-sm text-[#6a4f2b] leading-relaxed max-w-3xl">
            <strong className="text-[#15110e] font-bold">Shared Real-Time State Database:</strong> All personas share the unified live demo database (<code>localStorage: tt_demo_v1</code>). Any update you make (seating arrangements, dietary notes, run sheet cues, or wishing well blessings) instantly syncs across all portals.
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="bg-[#261e18] hover:bg-[#382c23] text-[#dfc194] border border-[#4a3a2d] text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>↻</span> Reset Demo Database
          </button>
        </div>

        {/* 6 Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Couple */}
          <div className="bg-white border border-[#e8ded0] rounded-xl shadow-sm hover:shadow-md hover:border-[#bd9661] transition-all flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f2ede7]">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#fcf1e0] text-[#8c5b1e] border border-[#ebd0ad] mb-2.5">
                Couple Portal &amp; CMS
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-1">Sophie &amp; James</h2>
              <div className="text-xs font-semibold text-[#bd9661] mb-2">Fernwood Estate · 14 Nov 2026</div>
              <p className="text-xs text-[#8b7b6b] leading-relaxed">
                Central command center for wedding planning, seating coordination, and guest hospitality.
              </p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2 text-xs text-[#4a3e35]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Live Countdown</strong> in days : hrs : mins : secs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Guest Tracker</strong>: 118 invited, 96 confirmed, RSVP filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Circular Seating Chart</strong>: Head table + Tables 1–6</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Gift &amp; Go Wishing Well</strong>: $4,280 received with thank-you status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Joey AI Assistant</strong>: Interactive action confirmations</span>
                </li>
              </ul>
            </div>
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleLaunch('couple', 'couple')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                🚀 Launch Couple Dashboard &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: Guest Mobile */}
          <div className="bg-white border border-[#e8ded0] rounded-xl shadow-sm hover:shadow-md hover:border-[#bd9661] transition-all flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f2ede7]">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#edf5fd] text-[#1e5a8c] border border-[#c2def7] mb-2.5">
                Guest Mobile Tap-In
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-1">Guest Mobile</h2>
              <div className="text-xs font-semibold text-[#bd9661] mb-2">Mark &amp; Sarah Johnson · Table 4</div>
              <p className="text-xs text-[#8b7b6b] leading-relaxed">
                Luxury smartphone invitation chassis loaded directly via luxury QaRd NFC tap or QR scan.
              </p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2 text-xs text-[#4a3e35]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Luxury QaRd scan splash with <strong>Tap to Enter</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Circular Visual Table Diagram</strong>: Shows assigned seats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Instant RSVP &amp; Dietary</strong> change request submission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Clean "Add to Calendar"</strong> action button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Joey AI Chatbot</strong> embedded in phone chassis</span>
                </li>
              </ul>
            </div>
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleLaunch(null, 'guest-mobile')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                📱 Launch Guest Mobile View &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: MC Mobile */}
          <div className="bg-white border border-[#e8ded0] rounded-xl shadow-sm hover:shadow-md hover:border-[#bd9661] transition-all flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f2ede7]">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#1c1511] text-[#e6cda6] border border-[#3d2f23] mb-2.5">
                Mobile MC · 402×874 Chassis
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-1">MC Mobile Console</h2>
              <div className="text-xs font-semibold text-[#bd9661] mb-2">Robert Galati · Floor Companion</div>
              <p className="text-xs text-[#8b7b6b] leading-relaxed">
                High-precision mobile console for MCs roaming the reception floor with live minute cues.
              </p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2 text-xs text-[#4a3e35]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Live schedule cues with checkboxes &amp; time progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Confidential MC Cue Notes</strong> for private audio cues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Fast floor plan seating reference &amp; table headcount</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Catering dietary summary for Executive Chef coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>1-Click demo authentication &amp; tenant profile</span>
                </li>
              </ul>
            </div>
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleLaunch('mc', 'mc-mobile')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                🎧 Launch MC Mobile Console &rarr;
              </button>
            </div>
          </div>

          {/* Card 4: MC Pro Console */}
          <div className="bg-white border border-[#e8ded0] rounded-xl shadow-sm hover:shadow-md hover:border-[#bd9661] transition-all flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f2ede7]">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#1c1511] text-[#e6cda6] border border-[#3d2f23] mb-2.5">
                Professional MC · Multi-Tenant
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-1">MC Pro Console</h2>
              <div className="text-xs font-semibold text-[#bd9661] mb-2">Robert Galati · Galati MC &amp; Ent.</div>
              <p className="text-xs text-[#8b7b6b] leading-relaxed">
                Stage &amp; reception controller with editable run sheets, cue order arrows, and floor plans.
              </p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2 text-xs text-[#4a3e35]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Private Run Sheet</strong>: Reorderable (▲/▼), editable cues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Interactive <strong>Floor Plan Seating Builder</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Multi-Tenant Switcher</strong>: Sophie &amp; James, Aisha &amp; Marcus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Venue &amp; Logistics Tab</strong> with 1-click Google Maps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Catering summary with allergy counts</span>
                </li>
              </ul>
            </div>
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleLaunch('mc', 'mc')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                🎧 Launch MC Pro Console &rarr;
              </button>
            </div>
          </div>

          {/* Card 5: Super Admin */}
          <div className="bg-white border border-[#e8ded0] rounded-xl shadow-sm hover:shadow-md hover:border-[#bd9661] transition-all flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f2ede7]">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#f6eefe] text-[#6b21a8] border border-[#e0c8fb] mb-2.5">
                Platform Operations
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-1">Super Admin</h2>
              <div className="text-xs font-semibold text-[#bd9661] mb-2">Platform Admin · $14.2k MRR</div>
              <p className="text-xs text-[#8b7b6b] leading-relaxed">
                Global SaaS administration, tenant licensing, security audit logs, and account impersonation.
              </p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2 text-xs text-[#4a3e35]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>SaaS Metrics</strong>: $14.2k MRR, active tenants, 99.98% uptime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Tenant Accounts Management</strong> with status toggles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>1-Click MC Impersonation</strong> with exit banner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Security Audit Log</strong> tracking all logins &amp; data edits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Stripe billing &amp; payout status overview</span>
                </li>
              </ul>
            </div>
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleLaunch('superadmin', 'superadmin')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                👑 Launch Super Admin &rarr;
              </button>
            </div>
          </div>

          {/* Card 6: Guest Desktop Web */}
          <div className="bg-white border border-[#e8ded0] rounded-xl shadow-sm hover:shadow-md hover:border-[#bd9661] transition-all flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#f2ede7]">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-[#f0f7f2] text-[#216e39] border border-[#cce5d4] mb-2.5">
                Guest Desktop Website
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-1">Guest Web Portal</h2>
              <div className="text-xs font-semibold text-[#bd9661] mb-2">The Johnson Family · Full Desktop</div>
              <p className="text-xs text-[#8b7b6b] leading-relaxed">
                Editorial wedding website for desktop browsers with luxury typography and photo feed.
              </p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2 text-xs text-[#4a3e35]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Editorial ceremony &amp; banquet schedule breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Celebration Feed</strong> with love notes and heart reactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span><strong>Digital Wishing Well</strong> contribution gateway</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>Interactive Venue Directions &amp; Travel guide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3c6a42] font-bold">✓</span>
                  <span>No login required for guests</span>
                </li>
              </ul>
            </div>
            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleLaunch(null, 'guest-web')}
                className="w-full bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1"
              >
                💻 Launch Guest Web Portal &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Authentication & Onboarding Gateway */}
        <section className="bg-white border border-[#e8ded0] rounded-xl p-6 sm:p-8 mb-12 shadow-sm">
          <div className="max-w-2xl mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#bd9661]">
              Security &amp; Tenant Onboarding
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#15110e] mt-1 mb-2">
              Sign In &amp; Registration Portals
            </h3>
            <p className="text-xs sm:text-sm text-[#8b7b6b] leading-relaxed">
              Test manual role-based authentication with 1-click credential presets, lockout protections after 5 failed attempts, password reset simulations, and the 2-mode registration flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#fbf9f6] border border-[#e8ded0] p-5 rounded-lg flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#15110e] mb-1">🔐 Sign In Portal (login.html)</h4>
                <p className="text-xs text-[#6b5847] mb-4 leading-relaxed">
                  Role tabs (MC, Couple, Super Admin) with 1-click preset filling, lockout timer, forgot password modal, and session expiry handling.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectView('login')}
                className="bg-[#15110e] hover:bg-[#231c17] text-white text-xs font-bold py-2.5 px-4 rounded transition-colors w-fit flex items-center gap-2"
              >
                Open Sign In Portal &rarr;
              </button>
            </div>

            <div className="bg-[#fbf9f6] border border-[#e8ded0] p-5 rounded-lg flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#15110e] mb-1">📝 Registration Portal (register.html)</h4>
                <p className="text-xs text-[#6b5847] mb-4 leading-relaxed">
                  2-mode registration: MC / Planner open trial signup with AU mobile &amp; ABN validation, and Couple mode with invite code <code>SJ-2026</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectView('register')}
                className="bg-[#15110e] hover:bg-[#231c17] text-white text-xs font-bold py-2.5 px-4 rounded transition-colors w-fit flex items-center gap-2"
              >
                Open Registration Portal &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Technical Architecture Specs */}
        <section className="bg-[#15110e] text-[#f8f6f2] rounded-xl p-6 sm:p-8 border border-[#2b221a]">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6 border-b border-[#2b221a] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#bd9661]">
                Technical Foundation
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Unified React 19 + Vite + Tailwind CSS Architecture
              </h3>
            </div>
            <div className="text-xs text-[#c9bbae] bg-[#241c16] border border-[#3d2f23] px-3 py-1.5 rounded font-mono">
              localStorage: tt_demo_v1 · 100% Client-Side
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#c9bbae]">
            <div className="bg-[#1d1612] p-4 rounded-lg border border-[#33281e]">
              <div className="font-bold text-[#dfc194] text-sm mb-1">🎨 Design Fidelity</div>
              <p className="leading-relaxed">Exact reproduction of original typography (Playfair Display &amp; DM Sans), gold accents (#bd9661), and circular seating geometry.</p>
            </div>
            <div className="bg-[#1d1612] p-4 rounded-lg border border-[#33281e]">
              <div className="font-bold text-[#dfc194] text-sm mb-1">⚡ Reactive State</div>
              <p className="leading-relaxed">All changes to tables, guests, run sheets, and gifts update seamlessly in real time without page refreshes.</p>
            </div>
            <div className="bg-[#1d1612] p-4 rounded-lg border border-[#33281e]">
              <div className="font-bold text-[#dfc194] text-sm mb-1">🤖 Joey AI Assistant</div>
              <p className="leading-relaxed">Interactive confirmation cards with Accept, Reject, and Correct flows directly updating guest dietaries.</p>
            </div>
            <div className="bg-[#1d1612] p-4 rounded-lg border border-[#33281e]">
              <div className="font-bold text-[#dfc194] text-sm mb-1">📱 402×874 Chassis</div>
              <p className="leading-relaxed">Pixel-perfect smartphone viewport frame for mobile guest and mobile MC testing.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#15110e] text-[#8b7b6b] text-xs py-8 px-6 text-center border-t border-[#2b221a]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#c9bbae]">
            <span className="text-[#bd9661] font-serif font-bold">Tap &amp; Toast</span>
            <span>· Australia&apos;s Premier Wedding Platform</span>
          </div>
          <div>Interactive Prototype &amp; Client Demonstration Suite © 2026</div>
        </div>
      </footer>
    </div>
  );
}
