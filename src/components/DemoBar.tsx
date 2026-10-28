import React from 'react';
import { useSession, useAppState, showToast, setDemoSessionForRole } from '../lib/state';

interface DemoBarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export default function DemoBar({ currentView, onSelectView }: DemoBarProps) {
  const { resetState } = useAppState();

  const handleReset = () => {
    resetState();
    showToast('Demo data reset to initial seed state', 'success');
  };

  const navLinks = [
    { id: 'showcase', label: 'Showcase', role: null },
    { id: 'login', label: 'Sign In', role: null },
    { id: 'register', label: 'Register', role: null },
    { id: 'guest-mobile', label: 'Guest Mobile', role: null },
    { id: 'mc-mobile', label: 'MC Mobile', role: 'mc' },
    { id: 'sr-mobile', label: 'S/R mobile', role: null },
    { id: 'couple', label: 'Couple Dashboard', role: 'couple' },
    { id: 'planner', label: 'Wedding Planner', role: 'planner' },
    { id: 'mc', label: 'MC Pro', role: 'mc' },
    { id: 'superadmin', label: 'Super Admin', role: 'superadmin' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.role) {
      setDemoSessionForRole(link.role as any);
    }
    onSelectView(link.id);
  };

  return (
    <nav className="tt-demobar flex items-center justify-between gap-3 px-4 py-2 bg-[#110e0c] border-b border-[#2b221a] text-[#d9c9b8] text-[13px] sticky top-0 z-[1000] flex-wrap shadow-md select-none" aria-label="Demo Navigation">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectView('showcase')}
          className="flex items-center gap-2 text-left hover:opacity-90"
        >
          <span className="tt-mark inline-grid place-items-center w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-sm rounded-[3px]">
            T
          </span>
          <span className="font-serif text-[15px] text-white tracking-wide font-semibold">
            Tap <span className="gold-amp">&amp;</span> Toast
          </span>
        </button>
        <span className="bg-[#2a2119] text-[#e6cda6] border border-[#3d3126] text-[10px] px-1.5 py-0.5 rounded-[3px] tracking-wider font-semibold">
          DEMO SUITE
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {navLinks.map((link) => {
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#dfc194] text-[#15110e] font-bold'
                  : 'text-[#bfaea0] hover:text-white hover:bg-[#231c16]'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="bg-[#261e18] text-[#dfc194] border border-[#4a3a2d] hover:border-[#bd9661] hover:text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          title="Reset demo data to initial seed state"
        >
          <span>↻</span> Reset Demo Data
        </button>
      </div>
    </nav>
  );
}
