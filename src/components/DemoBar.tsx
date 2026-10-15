import React from 'react';
import { useSession, useAppState, showToast, setDemoSessionForRole } from '../lib/state';

interface DemoBarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export default function DemoBar({ currentView, onSelectView }: DemoBarProps) {
  const { session, clearSession } = useSession();
  const { resetState } = useAppState();

  const handleReset = () => {
    resetState();
    showToast('Demo data reset to initial seed state', 'success');
  };

  const handleLogout = () => {
    clearSession();
    showToast('Signed out of demo session', 'info');
    onSelectView('login');
  };

  const navItems = [
    { id: 'guest-mobile', label: '📱 Guest Mobile', role: null },
    { id: 'couple', label: '💍 Couple Portal', role: 'couple' },
    { id: 'mc', label: '🎧 MC Pro', role: 'mc' },
    { id: 'mc-mobile', label: '🎧 MC Mobile', role: 'mc' },
    { id: 'superadmin', label: '👑 Super Admin', role: 'superadmin' },
    { id: 'guest-web', label: '💻 Guest Web', role: null },
    { id: 'showcase', label: '✨ Showcase Hub', role: null },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.role) {
      setDemoSessionForRole(item.role as any);
    }
    onSelectView(item.id);
  };

  return (
    <header className="tt-demobar flex items-center justify-between gap-3 px-4 py-2 bg-[#110e0c] border-b border-[#2b221a] text-[#d9c9b8] text-[13px] sticky top-0 z-[1000] flex-wrap shadow-md">
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
            Tap &amp; Toast
          </span>
        </button>
        <span className="bg-[#2a2119] text-[#e6cda6] border border-[#3d3126] text-[10px] px-1.5 py-0.5 rounded-[3px] tracking-wider font-semibold uppercase">
          {currentView.toUpperCase().replace('-', ' ')}
        </span>
      </div>

      <nav className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavClick(item)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              currentView === item.id
                ? 'bg-[#bd9661] text-[#15110e] font-bold'
                : 'text-[#bfaea0] hover:text-white hover:bg-[#231c16]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {session && session.email && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#a8988a]">
            <span>Signed in as <strong className="text-[#e6cda6]">{session.name || session.email}</strong></span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[#bd9661] hover:underline"
            >
              (Sign out)
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="bg-[#261e18] text-[#dfc194] border border-[#4a3a2d] hover:border-[#bd9661] hover:text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all"
          title="Reset localStorage demo database to seed state"
        >
          <span>↻</span> Reset Demo Data
        </button>
      </div>
    </header>
  );
}
