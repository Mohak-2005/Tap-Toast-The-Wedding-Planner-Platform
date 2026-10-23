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

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Captured rendering exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f8f6f2] text-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-[#bd9661] flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
            !
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#15110e] mb-2">
            View Initialization Notice
          </h2>
          <p className="text-sm text-[#8b7b6b] max-w-md mb-6 leading-relaxed">
            A mismatch occurred with older saved demo data in this browser session. Clicking below will synchronize the latest platform schema.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem('tt_demo_v1');
                  localStorage.removeItem('tt_session');
                } catch (e) {}
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-[#bd9661] hover:bg-[#a8824f] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-md"
            >
              Sync &amp; Reset Demo Data
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#showcase';
                window.location.reload();
              }}
              className="px-5 py-2.5 border border-[#d4c5b3] text-[#15110e] hover:bg-[#eae3d8] font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Return to Showcase
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const getInitialView = () => {
    const hash = window.location.hash.replace('#', '');
    const validViews = ['showcase', 'login', 'register', 'register-mc', 'register-couple', 'guest-mobile', 'mc-mobile', 'couple', 'mc', 'superadmin', 'guest-web'];
    if (validViews.includes(hash)) {
      return hash;
    }
    return 'login';
  };

  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const handleSelectView = (view: string) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  // Sync with browser hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== currentView) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

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

  // Listen for navigation messages
  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE' && event.data?.url) {
        const target = event.data.url.replace('.html', '');
        handleSelectView(target === 'index' ? 'showcase' : target);
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
        return <CoupleView onSelectView={handleSelectView} />;
      case 'mc':
        return <McView onSelectView={handleSelectView} />;
      case 'mc-mobile':
        return <McMobileView onSelectView={handleSelectView} />;
      case 'superadmin':
        return <SuperAdminView onSelectView={handleSelectView} />;
      case 'guest-web':
        return <GuestWebView />;
      case 'login':
        return <LoginView onSelectView={handleSelectView} />;
      case 'register':
      case 'register-mc':
      case 'register-couple':
        return <RegisterView onSelectView={handleSelectView} />;
      case 'showcase':
      default:
        return <ShowcaseView onSelectView={handleSelectView} />;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#1c1713] overflow-hidden font-sans">
      {/* Top Demo Bar */}
      <DemoBar currentView={currentView} onSelectView={handleSelectView} />

      {/* Primary Application Viewport */}
      <div className="flex-1 overflow-y-auto relative flex flex-col bg-[#f8f6f2]">
        <ErrorBoundary key={currentView}>
          {renderActiveView()}
        </ErrorBoundary>
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
