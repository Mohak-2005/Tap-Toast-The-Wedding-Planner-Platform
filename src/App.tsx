import { useState, useEffect } from 'react';

export default function App() {
  const [screen, setScreen] = useState('guest-mobile.html');
  const [iframeKey, setIframeKey] = useState(0);

  const screens = [
    { id: 'guest-mobile.html', label: '📱 Guest Mobile (402×874)' },
    { id: 'mc-mobile.html', label: '🎧 MC Mobile (402×874)' },
    { id: 'couple.html', label: '💍 Couple Portal & CMS' },
    { id: 'mc.html', label: '🎧 MC / DJ Portal' },
    { id: 'superadmin.html', label: '👑 Super Admin' },
    { id: 'showcase.html', label: '✨ Full Showcase Hub' },
  ];

  // Listen for navigation messages dispatched from within the iframe demobar
  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE' && event.data?.url) {
        const target = event.data.url;
        setScreen(target === 'index.html' ? 'showcase.html' : target);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const handleResetData = () => {
    try {
      localStorage.removeItem('tt_demo_v1');
      localStorage.removeItem('tt_session');
      setIframeKey(prev => prev + 1);
    } catch (err) {
      console.warn('Reset error', err);
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#1c1713', 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Portal Switcher Bar */}
      <header style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '10px 18px', 
        background: '#15110e', 
        borderBottom: '1px solid #332a22', 
        overflowX: 'auto', 
        alignItems: 'center',
        flexShrink: 0
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
          <span style={{ fontSize: '18px' }}>🥂</span>
          <span style={{ color: '#bd9661', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            Tap &amp; Toast
          </span>
        </div>

        {/* Portal Pills */}
        <div style={{ display: 'flex', gap: '8px', flex: 1, overflowX: 'auto' }}>
          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => setScreen(s.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                border: screen === s.id ? '1px solid #bd9661' : '1px solid #3d332a',
                background: screen === s.id ? '#bd9661' : '#231c17',
                color: screen === s.id ? '#15110e' : '#e6cda6',
                fontWeight: screen === s.id ? '700' : '500',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={handleResetData}
            style={{
              color: '#dfc194',
              background: '#261e18',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #4a3a2d',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Reset localStorage demo database to seed state"
          >
            ↻ Reset Demo
          </button>

          {/* Quick Open In Full Tab */}
          <a
            href={`/${screen}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#a89078',
              fontSize: '12px',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #332a22',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#1c1612'
            }}
            title="Open currently selected screen in full tab"
          >
            ↗ Open Tab
          </a>
        </div>
      </header>

      {/* Live Interactive Prototype */}
      <iframe
        key={`${screen}-${iframeKey}`}
        src={`/${screen}`}
        style={{ 
          flex: 1, 
          width: '100%', 
          height: '100%', 
          border: 'none', 
          background: '#f8f6f2' 
        }}
        allow="camera; microphone; clipboard-write; fullscreen"
        title="Tap & Toast Interactive Prototype"
      />
    </div>
  );
}
