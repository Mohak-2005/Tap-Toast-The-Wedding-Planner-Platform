import React, { useState, useEffect } from 'react';
import DemoBar from './components/DemoBar';
import ShowcaseView from './components/ShowcaseView';
import GuestMobileView from './components/GuestMobileView';
import CoupleView from './components/CoupleView';
import McView from './components/McView';
import McMobileView from './components/McMobileView';
import SuperAdminView from './components/SuperAdminView';
import GuestWebView from './components/GuestWebView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('guest-mobile');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Listen for toast notifications dispatched from anywhere
  useEffect(() => {
    const handleToast = (e: any) => {
      if (e.detail) {
        const newToast: ToastItem = {
          id: 'toast_' + Date.now() + '_' + Math.random(),
          message: e.detail.message,
          type: e.detail.type || 'info',
        };
        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 3200);
      }
    };

    window.addEventListener('tt_show_toast', handleToast);
    return () => window.removeEventListener('tt_show_toast', handleToast);
  }, []);

  // Listen for navigation messages from child components or postMessage
  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE' && event.data?.url) {
        const target = event.data.url.replace('.html', '');
        setCurrentView(target === 'index' ? 'showcase' : target);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const renderActiveView = () => {
    switch (currentView) {
      case 'guest-mobile':
        return <GuestMobileView />;
      case 'couple':
        return <CoupleView onSelectView={setCurrentView} />;
      case 'mc':
        return <McView onSelectView={setCurrentView} />;
      case 'mc-mobile':
        return <McMobileView />;
      case 'superadmin':
        return <SuperAdminView onSelectView={setCurrentView} />;
      case 'guest-web':
        return <GuestWebView />;
      case 'login':
        return <LoginView onSelectView={setCurrentView} />;
      case 'register':
        return <RegisterView onSelectView={setCurrentView} />;
      case 'showcase':
      default:
        return <ShowcaseView onSelectView={setCurrentView} />;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#1c1713] overflow-hidden font-sans">
      {/* Top Demo Bar */}
      <DemoBar currentView={currentView} onSelectView={setCurrentView} />

      {/* Primary Application Viewport */}
      <div className="flex-1 overflow-y-auto relative flex flex-col">
        {renderActiveView()}
      </div>

      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-xl flex items-center gap-2 border transition-all animate-bounce-in ${
              t.type === 'success'
                ? 'bg-[#181310] border-emerald-500 border-l-4'
                : t.type === 'error'
                ? 'bg-[#181310] border-red-500 border-l-4'
                : 'bg-[#181310] border-[#bd9661] border-l-4'
            }`}
          >
            <span className={t.type === 'success' ? 'text-emerald-400' : t.type === 'error' ? 'text-red-400' : 'text-[#bd9661]'}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
