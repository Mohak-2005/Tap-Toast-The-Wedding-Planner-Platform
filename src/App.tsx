import { useState } from 'react';

export default function App() {
  const [screen, setScreen] = useState('guest-mobile.html');

  const screens = [
    { id: 'guest-mobile.html', label: '📱 Guest Mobile (402×874)' },
    { id: 'mc-mobile.html', label: '🎧 MC Mobile (402×874)' },
    { id: 'couple.html', label: '💍 Couple Portal & CMS' },
    { id: 'mc.html', label: '🎧 MC / DJ Portal' },
    { id: 'superadmin.html', label: '👑 Super Admin' },
    { id: 'index.html', label: '✨ Full Showcase Hub' },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#1c1713', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '14px' }}>
          <span style={{ fontSize: '18px' }}>🥂</span>
          <span style={{ color: '#bd9661', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
            Tap & Toast
          </span>
        </div>

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
            gap: '4px'
          }}
          title="Open currently selected screen in full tab"
        >
          ↗ Open Tab
        </a>
      </header>

      {/* Live Interactive Prototype */}
      <iframe
        key={screen}
        src={`/${screen}`}
        style={{ 
          flex: 1, 
          width: '100%', 
          height: '100%', 
          border: 'none', 
          background: '#f8f6f2' 
        }}
        title="Tap & Toast Interactive Prototype"
      />
    </div>
  );
}
