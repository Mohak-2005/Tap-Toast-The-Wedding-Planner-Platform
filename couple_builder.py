# Builder for couple.html
import os
from shared_css import get_shared_css
from shared_js import get_shared_js
from auth_component import get_auth_css, get_auth_html, get_auth_js
from chatbot_component import get_chatbot_html, get_chatbot_css, get_chatbot_js

def build_couple():
    shared_css = get_shared_css()
    shared_js = get_shared_js()
    auth_css = get_auth_css()
    auth_html = get_auth_html('couple')
    auth_js = get_auth_js('couple')
    chatbot_css = get_chatbot_css()
    chatbot_html = get_chatbot_html()
    chatbot_js = get_chatbot_js()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sophie &amp; James | Tap &amp; Toast Couple Dashboard</title>
  <script>
    (function() {{
      try {{
        const pageRole = 'couple';
        const raw = localStorage.getItem('tt_session');
        const currentFile = window.location.pathname.split('/').pop() || 'couple.html';
        if (!raw) {{
          window.location.replace('login.html?next=' + encodeURIComponent(currentFile));
          return;
        }}
        const sess = JSON.parse(raw);
        const now = Date.now();
        const maxAge = sess.keepSignedIn ? (7 * 24 * 60 * 60 * 1000) : (30 * 60 * 1000);
        if (!sess.at || (now - sess.at) > maxAge) {{
          localStorage.removeItem('tt_session');
          window.location.replace('login.html?next=' + encodeURIComponent(currentFile) + '&expired=1');
          return;
        }}
        sess.at = now;
        localStorage.setItem('tt_session', JSON.stringify(sess));
        if (sess.role !== pageRole) {{
          window.location.replace('login.html?next=' + encodeURIComponent(currentFile) + '&role_mismatch=' + encodeURIComponent(pageRole));
          return;
        }}
      }} catch (e) {{}}
    }})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
{shared_css}
{auth_css}
{chatbot_css}

.tt-unauthenticated .app-shell {{ display: none !important; }}
.tt-unauthenticated #tt-auth-overlay {{ display: grid !important; }}

/* Couple Dashboard Layout */
body {{
  background: var(--cream);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}}

.app-shell {{
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 42px);
}}

/* Sidebar */
.app-sidebar {{
  background: #15110e;
  color: #d9c9b8;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #29211a;
}}

.sidebar-brand {{
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #231b14;
}}

.sidebar-brand-name {{
  font-family: var(--font-heading);
  font-size: 19px;
  color: #ffffff;
  letter-spacing: 0.3px;
}}

.sidebar-menu {{
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}}

.sidebar-btn {{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  color: #bfaea0;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 4px;
  text-align: left;
  transition: all 0.15s ease;
  border-left: 3px solid transparent;
}}

.sidebar-btn:hover {{
  color: #ffffff;
  background: #251e18;
}}

.sidebar-btn.active {{
  background: #2b221a;
  color: #fce4ca;
  font-weight: 700;
  border-left-color: var(--gold);
}}

.sidebar-btn svg {{
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  stroke: #bfaea0;
  transition: stroke 0.15s ease;
}}

.sidebar-btn:hover svg {{
  stroke: #ffffff;
}}

.sidebar-btn.active svg {{
  stroke: var(--gold);
}}

.tab-pane {{
  display: none;
}}

.tab-pane.active {{
  display: block;
}}

.sidebar-footer {{
  padding: 18px 20px;
  border-top: 1px solid #231b14;
  font-size: 12px;
  color: #8c7b6c;
}}

/* Main Dashboard Area */
.app-main {{
  padding: 32px 40px;
  overflow-y: auto;
  max-width: 1400px;
}}

.page-header {{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}}

.header-eyebrow {{
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 700;
  margin-bottom: 4px;
}}

.header-title {{
  font-family: var(--font-heading);
  font-size: 36px;
  color: var(--ink);
  line-height: 1.15;
}}

.header-badge {{
  background: #17120f;
  color: #dfc194;
  border: 1px solid #382c20;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1px;
}}

/* Metric Cards Grid */
.metrics-grid {{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;
}}

.metric-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  border-radius: 6px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}

.metric-number {{
  font-family: var(--font-heading);
  font-size: 34px;
  color: var(--ink);
  line-height: 1.1;
  margin-bottom: 4px;
}}

.metric-label {{
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
}}

/* Two Column Layout */
.twocol-layout {{
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 24px;
}}

.content-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}}

.content-card-title {{
  font-family: var(--font-heading);
  font-size: 19px;
  color: var(--ink);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

/* RSVP Progress Bars */
.progress-row {{
  margin-bottom: 16px;
}}

.progress-labels {{
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 600;
  margin-bottom: 6px;
}}

.progress-bar-bg {{
  height: 8px;
  background: #ede6db;
  border-radius: 4px;
  overflow: hidden;
}}

.progress-bar-fill {{
  height: 100%;
  background: var(--ink);
  border-radius: 4px;
  transition: width 0.3s ease;
}}

/* Checklists */
.checklist-item {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f2ece3;
}}
.checklist-item:last-child {{ border-bottom: none; }}

.checklist-label {{
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  cursor: pointer;
}}

.checklist-input {{
  accent-color: var(--ink);
  width: 16px;
  height: 16px;
}}

/* Recent Activity */
.activity-stream {{
  display: flex;
  flex-direction: column;
}}

.activity-row {{
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f2ece3;
}}
.activity-row:last-child {{ border-bottom: none; }}

.activity-glyph {{
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #faf4e9;
  border: 1px solid #ebd9c2;
  display: grid;
  place-items: center;
  font-size: 15px;
  flex-shrink: 0;
}}

/* Seating Builder Specific Styles */
.seating-toolbar {{
  background: #17120f;
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}}

.seating-split {{
  display: grid;
  grid-template-columns: 1fr 280px;
  border: 1px solid var(--line);
  border-top: none;
  background: #ffffff;
  border-radius: 0 0 6px 6px;
  min-height: 540px;
}}

.floorplan-canvas {{
  background-color: #faf9f6;
  background-image: radial-gradient(#e4d6c2 1.2px, transparent 1.2px);
  background-size: 22px 22px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  overflow-x: auto;
}}

.head-table-block {{
  background: #1a1511;
  color: #dfc194;
  border: 1px solid var(--gold);
  border-radius: 6px;
  padding: 12px 28px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}}

.table-circle-grid {{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  justify-items: center;
  width: 100%;
  max-width: 780px;
}}

.round-table {{
  width: 118px;
  height: 118px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: var(--shadow-sm);
}}

.round-table-title {{
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}}

.round-table-count {{
  font-size: 11px;
  color: var(--muted);
}}

.seat-dot {{
  position: absolute;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #201a16;
  color: #dfc194;
  font-size: 9.5px;
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}}

.seat-dot:hover {{
  transform: scale(1.18);
}}

.seat-dot.empty {{
  background: #ffffff;
  border: 1px dashed #c7aa80;
  color: #bda27f;
}}

.unassigned-panel {{
  border-left: 1px solid var(--line);
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}}

.guest-card-draggable {{
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fbf9f6;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.15s ease;
}}

.guest-card-draggable:hover {{
  border-color: var(--gold);
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}}

/* QaRd Invitation Preview */
.qard-preview-frame {{
  max-width: 420px;
  margin: 0 auto;
  background: #15110e;
  border: 2px solid #382c20;
  border-radius: 18px;
  padding: 38px 28px;
  color: #ffffff;
  text-align: center;
  position: relative;
  box-shadow: 0 16px 45px rgba(0,0,0,0.3);
}}

.qard-inner-border {{
  border: 1px solid rgba(189, 150, 97, 0.4);
  border-radius: 12px;
  padding: 28px 20px;
}}

/* Data Table */
.data-table {{
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}}

.data-table th {{
  background: #faf7f2;
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
}}

.data-table td {{
  padding: 14px 16px;
  border-bottom: 1px solid #f2ece3;
}}

.data-table tr:hover td {{
  background: #fdfbf8;
}}

/* Responsive Breakpoints */
@media (max-width: 1024px) {{
  .metrics-grid {{ grid-template-columns: repeat(2, 1fr); }}
  .twocol-layout {{ grid-template-columns: 1fr; }}
  .table-circle-grid {{ grid-template-columns: repeat(2, 1fr); }}
}}

@media (max-width: 768px) {{
  .app-shell {{ grid-template-columns: 1fr; }}
  .app-sidebar {{ display: flex; flex-direction: row; overflow-x: auto; }}
  .sidebar-brand, .sidebar-footer {{ display: none; }}
  .sidebar-menu {{ flex-direction: row; padding: 6px; }}
  .sidebar-btn {{ padding: 8px 12px; white-space: nowrap; border-left: none; border-bottom: 3px solid transparent; }}
  .sidebar-btn.active {{ border-left: none; border-bottom-color: var(--gold); }}
  .app-main {{ padding: 20px 16px; }}
  .seating-split {{ grid-template-columns: 1fr; }}
  .unassigned-panel {{ border-left: none; border-top: 1px solid var(--line); }}
  .table-circle-grid {{ grid-template-columns: 1fr; }}
}}
</style>
</head>
<body>

  <!-- Demo Top Bar -->
  <nav class="tt-demobar" aria-label="Demo Navigation">
    <div class="tt-demobar-brand">
      <span class="tt-mark">T</span>
      <span class="tt-demobar-title">Tap <span class="gold-amp">&amp;</span> Toast</span>
      <span class="tt-demobar-badge">DEMO SUITE</span>
    </div>
    <div class="tt-demobar-links">
      <a href="index.html" class="tt-demobar-link" title="Showcase Hub">Showcase</a>
      <a href="login.html" class="tt-demobar-link">Sign In</a>
      <a href="register.html" class="tt-demobar-link">Register</a>
      <a href="guest-mobile.html" class="tt-demobar-link">Guest Mobile</a>
      <a href="guest-web.html" class="tt-demobar-link">Guest Web</a>
      <a href="couple.html" class="tt-demobar-link active" onclick="handleDemobarNav(event, 'couple', 'couple.html')">Couple Dashboard</a>
      <a href="mc.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
      <a href="superadmin.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'superadmin', 'superadmin.html')">Super Admin</a>
    </div>
    <div class="tt-demobar-actions">
      <button type="button" class="tt-demobar-reset" onclick="resetDemoData()">↺ Reset Demo Data</button>
    </div>
  </nav>

{auth_html}

  <!-- Application Shell -->
  <div class="app-shell">

    <!-- Left Sidebar -->
    <aside class="app-sidebar" aria-label="Couple Navigation">
      <div class="sidebar-brand">
        <span class="tt-mark">T</span>
        <span class="sidebar-brand-name">Tap <span class="gold-amp">&amp;</span> Toast</span>
      </div>

      <nav class="sidebar-menu">
        <button type="button" class="sidebar-btn active" data-tab="overview" onclick="switchCoupleTab('overview')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          Overview
        </button>
        <button type="button" class="sidebar-btn" data-tab="guests" onclick="switchCoupleTab('guests')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Guest List
        </button>
        <button type="button" class="sidebar-btn" data-tab="seating" onclick="switchCoupleTab('seating')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="3" r="2"></circle><circle cx="12" cy="21" r="2"></circle><circle cx="3" cy="12" r="2"></circle><circle cx="21" cy="12" r="2"></circle></svg>
          Seating
        </button>
        <button type="button" class="sidebar-btn" data-tab="invitations" onclick="switchCoupleTab('invitations')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Invitations
        </button>
        <button type="button" class="sidebar-btn" data-tab="gifts" onclick="switchCoupleTab('gifts')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
          Gift &amp; Go
        </button>
        <button type="button" class="sidebar-btn" data-tab="feed" onclick="switchCoupleTab('feed')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Celebration Feed
        </button>
        <button type="button" class="sidebar-btn" data-tab="venue" onclick="switchCoupleTab('venue')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Venue &amp; Travel
        </button>
        <button type="button" class="sidebar-btn" data-tab="settings" onclick="switchCoupleTab('settings')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </button>
      </nav>

      <div class="sidebar-footer">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#8c7b6c;margin-bottom:2px;">Signed in as</div>
        <div style="font-weight:600;color:#dfc194;" id="sidebar-user-name">Sophie &amp; James</div>
        <div style="font-size:11px;color:#8c7b6c;margin-bottom:8px;" id="sidebar-user-role">Couple Account</div>
        <button type="button" class="btn btn-outline btn-xs" onclick="handleLogout()" style="width:100%;font-size:11px;padding:5px 8px;border-color:#3d3126;color:#d9c9b8;">Logout</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="app-main">

      <!-- TAB 1: OVERVIEW -->
      <section id="pane-overview" class="tab-pane active" aria-labelledby="tab-overview">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">YOUR WEDDING</div>
            <h1 class="header-title">Sophie <span class="gold-amp">&amp;</span> James</h1>
          </div>
          <div class="header-badge" id="overview-days-badge">35 DAYS : 00 HRS : 00 MINS : 00 SECS REMAINING</div>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div>
              <div class="metric-number" id="metric-guests-invited">118</div>
              <div class="metric-label">Guests invited</div>
            </div>
            <div>
              <span class="tt-pill green" id="metric-confirmed-pill">96 confirmed</span>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-number" id="metric-awaiting-rsvp">22</div>
              <div class="metric-label">Awaiting RSVP</div>
            </div>
            <div>
              <button type="button" class="tt-pill warm btn-reminder-nav" id="metric-reminder-pill" onclick="switchCoupleTab('guests')" style="cursor:pointer;border:1px solid #d4b896;font-weight:600;display:inline-flex;align-items:center;gap:4px;" title="Open Guest List tab">Reminder due &rarr;</button>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-number" id="metric-tables-seated">14</div>
              <div class="metric-label">Tables seated</div>
            </div>
            <div>
              <small style="color:var(--muted);" id="metric-tables-sub">of 15</small>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-number" id="metric-gifts-received">$4,280</div>
              <div class="metric-label">Gifts received</div>
            </div>
            <div>
              <button type="button" class="tt-pill warm btn-thankyou-nav" id="metric-thankyou-pill" onclick="switchCoupleTab('gifts')" style="cursor:pointer;border:1px solid #d4b896;font-weight:600;display:inline-flex;align-items:center;gap:4px;" title="Open Gift &amp; Go tab">9 thank-yous due &rarr;</button>
            </div>
          </div>
        </div>

        <!-- Two Column Section -->
        <div class="twocol-layout">
          <div>
            <!-- RSVP Progress -->
            <div class="content-card">
              <h2 class="content-card-title">RSVP progress</h2>
              
              <div class="progress-row">
                <div class="progress-labels">
                  <span>Confirmed</span>
                  <span id="prog-confirmed-val">96</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" id="prog-confirmed-bar" style="width: 81%;"></div>
                </div>
              </div>

              <div class="progress-row">
                <div class="progress-labels">
                  <span>Declined</span>
                  <span id="prog-declined-val">9</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" id="prog-declined-bar" style="width: 8%; background:#b86c63;"></div>
                </div>
              </div>

              <div class="progress-row">
                <div class="progress-labels">
                  <span>Awaiting</span>
                  <span id="prog-awaiting-val">22</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" id="prog-awaiting-bar" style="width: 19%; background:#c7b198;"></div>
                </div>
              </div>

              <!-- This Week Tasks -->
              <h3 style="font-family:var(--font-heading);font-size:17px;margin:28px 0 14px;">This week</h3>
              <div id="overview-tasks-list">
                <!-- Checkboxes populated by JS -->
              </div>

              <div style="margin-top:14px;display:flex;gap:8px;">
                <input type="text" id="new-task-input" class="text-input" style="padding:8px 12px;font-size:12.5px;" placeholder="Add planning task...">
                <button type="button" class="btn btn-outline btn-sm" onclick="addPlanningTask()">+ Add Task</button>
              </div>
            </div>
          </div>

          <div>
            <!-- Recent Activity -->
            <div class="content-card">
              <h2 class="content-card-title">Recent activity</h2>
              <div class="activity-stream" id="overview-activity-stream">
                <!-- Injected by JS -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: GUEST LIST -->
      <section id="pane-guests" class="tab-pane" aria-labelledby="tab-guests">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">ATTENDEE MANAGEMENT</div>
            <h1 class="header-title">Guest List</h1>
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="exportGuestsCSV()">📥 Export CSV</button>
            <button type="button" class="btn btn-gold btn-sm" onclick="openAddGuestModal()">+ Add Guest</button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-send-reminders" onclick="sendRemindersToAllAwaiting()">✉️ <span id="btn-reminder-label">Send Reminder (22)</span></button>
          </div>
        </div>

        <div class="content-card" style="padding:16px 20px;">
          <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
            <input type="text" id="guest-search-input" class="text-input" style="max-width:280px;padding:8px 14px;" placeholder="Search guests..." oninput="filterGuestTable()">
            <select id="guest-status-filter" class="text-input" style="max-width:180px;padding:8px 12px;" onchange="filterGuestTable()">
              <option value="all">All RSVP Statuses</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="awaiting">Awaiting RSVP</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Guest / Household</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Party</th>
                  <th>Dietary</th>
                  <th>Table</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="guest-table-body">
                <!-- Populated by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 3: SEATING BUILDER -->
      <section id="pane-seating" class="tab-pane" aria-labelledby="tab-seating">
        <div class="seating-toolbar">
          <div style="display:flex;align-items:center;gap:16px;">
            <strong style="font-family:var(--font-heading);font-size:17px;">Seating — Sophie &amp; James</strong>
            <div style="background:#281f18;padding:3px;border-radius:4px;display:flex;gap:4px;">
              <button type="button" id="btn-view-floor" class="btn btn-sm btn-gold" onclick="setSeatingView('floor')">Floor plan</button>
              <button type="button" id="btn-view-list" class="btn btn-sm btn-outline" style="background:none;color:#dfc194;border:none;" onclick="setSeatingView('list')">List view</button>
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-gold btn-sm" onclick="openSuggestSeatingModal()">✨ Suggest seating</button>
            <button type="button" class="btn btn-outline btn-sm" onclick="addTableToFloor()">Add table</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="saveSeatingAssignments()">Save</button>
          </div>
        </div>

        <!-- Seating Split Area -->
        <div class="seating-split">
          
          <!-- Floor Canvas -->
          <div class="floorplan-canvas" id="floorplan-canvas">
            <div class="head-table-block">
              <span>HEAD TABLE · 8 SEATS</span>
              <div style="display:flex;gap:8px;" id="head-table-seats">
                <!-- 8 head seats -->
              </div>
            </div>

            <div class="table-circle-grid" id="tables-container">
              <!-- Tables 1 to 6 dynamically rendered -->
            </div>
          </div>

          <!-- List View (hidden by default) -->
          <div id="seating-list-view" style="display:none;padding:24px;overflow-y:auto;background:#fff;grid-column:1/-1;">
            <h3 style="font-family:var(--font-heading);font-size:18px;margin-bottom:14px;">Table Assignment Roster</h3>
            <div id="seating-roster-content"></div>
          </div>

          <!-- Unassigned Panel -->
          <div class="unassigned-panel" id="unassigned-panel">
            <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:2px;">Unassigned guests</h3>
            <div style="font-size:12px;color:var(--muted);margin-bottom:12px;" id="unassigned-count-label">14 guests still need a table</div>
            <input type="text" id="unassigned-search" class="text-input" style="padding:6px 10px;font-size:12px;margin-bottom:14px;" placeholder="Search guests..." oninput="filterUnassignedGuests()">
            <div id="unassigned-guests-list" style="overflow-y:auto;flex:1;">
              <!-- Cards populated by JS -->
            </div>
          </div>

        </div>
      </section>

      <!-- TAB 4: INVITATIONS -->
      <section id="pane-invitations" class="tab-pane" aria-labelledby="tab-invitations">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">DIGITAL &amp; PHYSICAL INVITATIONS</div>
            <h1 class="header-title">The QaRd Invitation</h1>
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button" class="btn btn-gold btn-sm" onclick="simulateScan()">📲 Simulate scan</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="sendAllInvitations()">✉️ Send invitations</button>
          </div>
        </div>

        <div class="twocol-layout">
          <div>
            <div class="content-card">
              <h2 class="content-card-title">QaRd Configuration</h2>
              <div class="field-group" style="margin-bottom:20px;">
                <label class="field-label" for="qard-guest-select" style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--muted);margin-bottom:8px;display:block;">PREVIEW FOR GUEST HOUSEHOLD</label>
                <div style="position:relative;">
                  <select id="qard-guest-select" class="text-input" onchange="updateQaRdPreview()" style="width:100%;height:44px;padding:10px 36px 10px 14px;background:#ffffff;border:1px solid #dcd3c8;border-radius:6px;font-size:13.5px;color:var(--ink);appearance:none;-webkit-appearance:none;cursor:pointer;font-family:var(--font-body);font-weight:500;box-shadow:var(--shadow-sm);">
                    <!-- Populated by JS -->
                  </select>
                  <div style="position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--gold);font-size:11px;">▼</div>
                </div>
              </div>

              <!-- 4 Card Color Designs (Item 4) -->
              <div class="field-group" style="margin-top:14px;">
                <label class="field-label">CARD DESIGN &amp; COLOUR PALETTE</label>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;" id="qard-palettes-grid">
                  <button type="button" class="qard-theme-btn active" id="qard-btn-obsidian" onclick="selectQardCardDesign('obsidian')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;border:2px solid #bd9661;background:#15110e;color:#fdf9f3;cursor:pointer;font-size:12px;font-weight:600;text-align:left;">
                    <span style="width:16px;height:16px;border-radius:50%;background:#15110e;border:2px solid #bd9661;display:inline-block;flex-shrink:0;"></span>
                    <span><strong>Obsidian Noir</strong><br><small style="color:#bdaea0;font-weight:normal;">Near-black &amp; Gold</small></span>
                  </button>
                  <button type="button" class="qard-theme-btn" id="qard-btn-champagne" onclick="selectQardCardDesign('champagne')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;border:1px solid #d8cfc4;background:#faf6f0;color:#2c221a;cursor:pointer;font-size:12px;font-weight:600;text-align:left;">
                    <span style="width:16px;height:16px;border-radius:50%;background:#faf6f0;border:2px solid #bd9661;display:inline-block;flex-shrink:0;"></span>
                    <span><strong>Champagne Ivory</strong><br><small style="color:#786858;font-weight:normal;">Warm Cream &amp; Gold</small></span>
                  </button>
                  <button type="button" class="qard-theme-btn" id="qard-btn-merlot" onclick="selectQardCardDesign('merlot')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;border:1px solid #d8cfc4;background:#351319;color:#fcecd7;cursor:pointer;font-size:12px;font-weight:600;text-align:left;">
                    <span style="width:16px;height:16px;border-radius:50%;background:#351319;border:2px solid #e3b879;display:inline-block;flex-shrink:0;"></span>
                    <span><strong>Burgundy Merlot</strong><br><small style="color:#debdb0;font-weight:normal;">Rich Wine &amp; Gold</small></span>
                  </button>
                  <button type="button" class="qard-theme-btn" id="qard-btn-sage" onclick="selectQardCardDesign('sage')" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;border:1px solid #d8cfc4;background:#1b2a20;color:#f0eade;cursor:pointer;font-size:12px;font-weight:600;text-align:left;">
                    <span style="width:16px;height:16px;border-radius:50%;background:#1b2a20;border:2px solid #c9bda5;display:inline-block;flex-shrink:0;"></span>
                    <span><strong>Botanical Sage</strong><br><small style="color:#b5c4ba;font-weight:normal;">Forest Olive &amp; Gold</small></span>
                  </button>
                </div>
              </div>

              <p style="font-size:12.5px;color:var(--muted);margin:14px 0 16px;">
                Each invitation is printed with a bespoke QR code linked directly to the guest's personalized mobile hub — no app download, login, or password required.
              </p>
              <div style="display:flex;gap:10px;">
                <button type="button" class="btn btn-outline" onclick="simulateScan()">Simulate Guest Scan</button>
                <button type="button" class="btn btn-outline" onclick="showToast('Printing mock vector sheet (300 DPI)', 'info')">Print Ready PDF</button>
              </div>
            </div>
          </div>

          <div>
            <!-- Physical Card Preview matching qard-invitation-card-sample.png -->
            <div class="qard-preview-frame" id="qard-card-frame">
              <div class="qard-inner-border">
                <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:18px;">
                  <span class="tt-mark" style="width:20px;height:20px;font-size:11px;">T</span>
                  <span style="font-family:var(--font-heading);font-size:14px;color:#ffffff;" class="qard-brand-text">Tap &amp; Toast</span>
                </div>
                <div style="font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;font-weight:700;margin-bottom:8px;">YOU'RE INVITED</div>
                <h2 style="font-family:var(--font-heading);font-size:30px;color:#ffffff;line-height:1.15;margin-bottom:8px;" class="qard-title-text">Sophie <span class="gold-amp">&amp;</span> James</h2>
                <div style="font-size:12.5px;color:#e8cda2;margin-bottom:4px;" id="qard-card-date">Saturday, 14 November 2026 · 2:00 PM</div>
                <div style="font-size:11px;color:#bdaea0;margin-bottom:14px;" id="qard-card-venue">Fernwood Estate, Southern Highlands</div>
                <div style="width:40px;height:1px;background:var(--gold);margin:0 auto 16px;"></div>

                <div id="qard-svg-container" style="background:#ffffff;padding:10px;border-radius:10px;width:150px;height:150px;margin:0 auto 14px;display:grid;place-items:center;">
                  <!-- QR code injected by JS -->
                </div>

                <div style="font-size:9.5px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;font-weight:700;margin-bottom:20px;">
                  SCAN TO OPEN YOUR INVITATION
                </div>

                <div style="font-size:12px;color:#bfaea0;font-style:italic;" id="qard-household-line">
                  For the Whitfield family
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 5: GIFT & GO -->
      <section id="pane-gifts" class="tab-pane" aria-labelledby="tab-gifts">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">DIGITAL WISHING WELL</div>
            <h1 class="header-title">Gift &amp; Go Manager</h1>
          </div>
          <div>
            <button type="button" class="btn btn-gold btn-sm" onclick="openRecordGiftModal()">+ Record Manual Gift</button>
          </div>
        </div>

        <div class="metrics-grid" style="grid-template-columns:repeat(3, 1fr);margin-bottom:24px;">
          <div class="metric-card">
            <div>
              <div class="metric-number" id="gift-total-stat">$4,280</div>
              <div class="metric-label">Total gifts received</div>
            </div>
          </div>
          <div class="metric-card">
            <div>
              <div class="metric-number" id="gift-thankyou-stat">9</div>
              <div class="metric-label">Thank-yous due</div>
            </div>
          </div>
          <div class="metric-card">
            <div>
              <div class="metric-number">$285</div>
              <div class="metric-label">Average gift contribution</div>
            </div>
          </div>
        </div>

        <div class="content-card" style="padding:16px 20px;">
          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Message</th>
                  <th>Thank-You Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="gifts-table-body">
                <!-- Injected by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 6: CELEBRATION FEED -->
      <section id="pane-feed" class="tab-pane" aria-labelledby="tab-feed">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">LIVE EVENT STREAM</div>
            <h1 class="header-title">Celebration Feed Moderation</h1>
          </div>
        </div>

        <div class="twocol-layout">
          <div>
            <div class="content-card">
              <h2 class="content-card-title">Live Posts &amp; Moderation</h2>
              <div id="couple-feed-list">
                <!-- Injected by JS -->
              </div>
            </div>
          </div>
          <div>
            <div class="content-card">
              <h2 class="content-card-title">Add Official Note</h2>
              <form onsubmit="handleCoupleAnnouncement(event)" style="display:flex;flex-direction:column;gap:12px;">
                <textarea id="couple-announcement-text" class="text-input" rows="3" placeholder="Post a thank-you or announcement from the couple..."></textarea>
                <button type="submit" class="btn btn-gold" style="align-self:flex-end;">Post to Feed</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 7: VENUE & TRAVEL -->
      <section id="pane-venue" class="tab-pane" aria-labelledby="tab-venue">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">LOCATION &amp; LOGISTICS</div>
            <h1 class="header-title">Venue &amp; Travel</h1>
            <div style="font-size:13.5px;color:var(--muted);margin-top:4px;">
              Essential travel directions, parking facilities, shuttle schedules, and venue map for guests &amp; vendors
            </div>
          </div>
          <div style="display:flex;gap:10px;">
            <a href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm" style="display:inline-flex;align-items:center;gap:6px;">
              📍 Open Google Maps ↗
            </a>
          </div>
        </div>

        <div class="venue-details-grid">
          <div class="venue-card-accent">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <div style="width:36px;height:36px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;font-size:18px;">🏛</div>
              <div>
                <h3 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);margin:0;">Wedding Venue &amp; Address</h3>
                <span style="font-size:12px;color:var(--muted);">Ceremony &amp; Reception Grounds</span>
              </div>
            </div>
            <div style="font-size:14px;color:var(--ink);line-height:1.6;margin-bottom:14px;">
              <strong id="venue-name-display">Fernwood Estate, Southern Highlands</strong><br>
              <span id="venue-address-display">124 Range Road, Mittagong NSW 2575</span><br>
              Australia
            </div>
            <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:12px 14px;font-size:12.5px;color:#5a4a3c;line-height:1.5;">
              <strong>Ceremony:</strong> 2:00 PM · The Lower Meadow Lawns<br>
              <strong>Cocktail Hour &amp; Reception:</strong> 5:00 PM · The Grand Pavilion<br>
              <strong>Venue Concierge:</strong> (02) 4871 2000 · concierge@fernwoodestate.demo
            </div>
          </div>

          <div class="venue-card-accent">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <div style="width:36px;height:36px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;font-size:18px;">🅿️</div>
              <div>
                <h3 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);margin:0;">Guest Parking Facilities</h3>
                <span style="font-size:12px;color:var(--muted);">On-Site Valet &amp; Dedicated Bays</span>
              </div>
            </div>
            <div style="font-size:13.5px;color:var(--ink);line-height:1.6;margin-bottom:12px;" id="venue-parking-display">
              Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.
            </div>
            <ul style="padding-left:18px;font-size:12.5px;color:#5a4a3c;line-height:1.6;">
              <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
              <li><strong>Valet attendants:</strong> Stationed at the porte-cochère from 1:15 PM.</li>
              <li><strong>EV Charging:</strong> 4 Type-2 chargers available at North Parking.</li>
              <li><strong>Overnight Parking:</strong> Permitted until 11:00 AM Sunday morning.</li>
            </ul>
          </div>

          <div class="venue-card-accent">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <div style="width:36px;height:36px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;font-size:18px;">🚌</div>
              <div>
                <h3 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);margin:0;">Transport &amp; Guest Shuttles</h3>
                <span style="font-size:12px;color:var(--muted);">Scheduled Private Charter Transfers</span>
              </div>
            </div>
            <div style="font-size:13.5px;color:var(--ink);line-height:1.6;margin-bottom:12px;">
              Private express mini-coaches operate between key Southern Highlands hotels and Fernwood Estate:
            </div>
            <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:12px 14px;font-size:12.5px;color:#5a4a3c;line-height:1.5;margin-bottom:12px;">
              <strong>Guest Arrival Shuttles:</strong><br>
              • 1:15 PM from Bowral Grand Hotel (Station St Entrance)<br>
              • 1:30 PM from Milton Park Country House Resort<br>
              <br>
              <strong>Evening Return Loops:</strong><br>
              • Continuous departures every 45 mins from 10:15 PM until 12:30 AM
            </div>
            <div style="font-size:12px;color:var(--muted);">
              Local rideshare (Uber) and Southern Highlands Taxis (02 4868 1234) are also active in Mittagong and Bowral.
            </div>
          </div>

          <div class="map-embed-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
              <div>
                <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:700;">LIVE NAVIGATION</div>
                <h3 style="font-family:var(--font-heading);font-size:20px;color:#ffffff;margin:2px 0 4px;">Interactive Google Map</h3>
                <span style="font-size:12px;color:#bdaea0;">Coordinates: 34.4512° S, 150.5369° E</span>
              </div>
              <a href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm" style="display:inline-flex;align-items:center;gap:6px;">
                Open in Google Maps ↗
              </a>
            </div>

            <div style="background:#221b15;border:1px solid #3d3023;border-radius:6px;padding:22px;text-align:center;margin-bottom:16px;">
              <div style="width:54px;height:54px;border-radius:50%;background:rgba(189,150,97,0.15);border:2px solid var(--gold);color:var(--gold);display:grid;place-items:center;font-size:24px;margin:0 auto 12px;">
                📍
              </div>
              <strong style="color:#ffffff;font-size:15px;display:block;margin-bottom:4px;">Fernwood Estate</strong>
              <div style="color:#dfc194;font-size:13px;margin-bottom:12px;">124 Range Road, Mittagong NSW 2575</div>
              <p style="font-size:12px;color:#bcaaa0;line-height:1.5;max-width:360px;margin:0 auto 16px;">
                Located 1.5 hours south of Sydney CBD via the M31 Hume Motorway. Take the Mittagong / Old Hume Highway exit.
              </p>
              <a href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="background:#15110e;color:#fcecd7;border-color:var(--gold);">
                Click to Open Direct Map Location
              </a>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:#9e8e7e;">
              <span>Approx. 8 mins drive from Bowral town centre</span>
              <span>Regional rail: Mittagong Station (4 km)</span>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 8: SETTINGS -->
      <section id="pane-settings" class="tab-pane" aria-labelledby="tab-settings">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">CONFIGURATION</div>
            <h1 class="header-title">Wedding Settings</h1>
          </div>
        </div>

        <div class="content-card" style="max-width:720px;">
          <form onsubmit="handleSaveSettings(event)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
              <div class="field-group">
                <label class="field-label">Partner 1 Name</label>
                <input type="text" id="set-partner1" class="text-input" value="Sophie">
              </div>
              <div class="field-group">
                <label class="field-label">Partner 2 Name</label>
                <input type="text" id="set-partner2" class="text-input" value="James">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
              <div class="field-group">
                <label class="field-label">Wedding Date &amp; Time</label>
                <input type="datetime-local" id="set-date" class="text-input" value="2026-11-14T14:00">
              </div>
              <div class="field-group">
                <label class="field-label">Dress Code</label>
                <input type="text" id="set-dress" class="text-input" value="Black Tie Optional / Formal Elegance">
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Venue Name</label>
              <input type="text" id="set-venue" class="text-input" value="Fernwood Estate, Southern Highlands">
            </div>

            <div class="field-group">
              <label class="field-label">Venue Address</label>
              <input type="text" id="set-address" class="text-input" value="124 Range Road, Mittagong NSW 2575">
            </div>

            <div class="field-group">
              <label class="field-label">Guest Parking Instructions</label>
              <textarea id="set-parking" class="text-input" rows="2">Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.</textarea>
            </div>

            <button type="submit" class="btn btn-gold" style="padding:12px 24px;">Save Settings</button>
          </form>
        </div>
      </section>

    </main>
  </div>

  <!-- Toast Notification Container -->
  <div id="tt-toast-container" class="tt-toast-container"></div>

  <!-- Suggest Seating Modal -->
  <div id="suggest-seating-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">AI Seating Suggestion</div>
        <button type="button" class="tt-modal-close" onclick="closeSuggestSeatingModal()">✕</button>
      </div>
      <div class="tt-modal-body">
        <p style="font-size:13.5px;color:var(--ink);margin-bottom:16px;">
          We've calculated optimal seat pairings based on party sizes, dietary restrictions, and remaining table capacities:
        </p>
        <div id="suggested-assignments-list" style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:12px;font-size:13px;max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
          <!-- Injected by JS -->
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeSuggestSeatingModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="applySuggestedSeating()">Confirm &amp; Apply</button>
      </div>
    </div>
  </div>

  <!-- Seat Guest to Table Modal -->
  <div id="seat-guest-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title" id="sg-modal-title">Assign Guest to Table</div>
        <button type="button" class="tt-modal-close" onclick="closeSeatGuestModal()">✕</button>
      </div>
      <div class="tt-modal-body">
        <input type="hidden" id="sg-preset-guest-id" value="">
        <input type="hidden" id="sg-preset-table-id" value="">
        <div class="field-group" id="sg-table-select-group">
          <label class="field-label">Target Table</label>
          <select id="sg-table-select" class="text-input">
            <!-- Injected by JS -->
          </select>
        </div>
        <div class="field-group" id="sg-guest-select-group">
          <label class="field-label">Choose Confirmed Guest</label>
          <select id="sg-guest-select" class="text-input">
            <!-- Injected by JS with unassigned confirmed guests -->
          </select>
        </div>
        <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:10px 12px;font-size:12px;color:#786858;">
          Assigned guests will occupy the first available seat on the chosen table.
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeSeatGuestModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="confirmSeatGuestModal()">Confirm Seating</button>
      </div>
    </div>
  </div>

  <!-- Thank You Note Modal -->
  <div id="thank-you-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal" style="max-width:620px;width:95%;">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Send Thank-You Note</div>
        <button type="button" class="tt-modal-close" onclick="closeThankYouModal()">✕</button>
      </div>
      <div class="tt-modal-body" style="padding:24px;">
        <!-- Digital Card Preview -->
        <div style="background:#17120f;color:#fdfaf5;border:1px solid #382c20;border-radius:8px;padding:22px;text-align:center;margin-bottom:20px;box-shadow:0 8px 24px rgba(0,0,0,0.18);">
          <div style="font-size:10px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;font-weight:700;">DIGITAL THANK-YOU NOTE</div>
          <h3 style="font-family:var(--font-heading);font-size:24px;color:#ffffff;margin:4px 0 6px;">Sophie <span class="gold-amp">&amp;</span> James</h3>
          <div style="font-size:12.5px;color:#dfc194;margin-bottom:12px;" id="ty-card-subline">To The Whitfield family · $250 Gift</div>
          <p id="ty-card-preview-text" style="font-style:italic;font-size:13.5px;color:#e8ded0;line-height:1.55;max-width:480px;margin:0 auto 12px;background:rgba(255,255,255,0.04);padding:12px 16px;border-radius:6px;border-left:3px solid var(--gold);text-align:left;">
            "Dear The Whitfield family, thank you so much for your wonderful and generous gift of $250! It means the world to have your love and support as we begin our new chapter together. Love, Sophie &amp; James."
          </p>
          <div style="font-size:11.5px;color:#9e8e7e;">With love and gratitude · Fernwood Estate 2026</div>
        </div>

        <div class="field-group" style="margin-bottom:16px;">
          <label class="field-label" for="ty-recipient">Recipient Guest / Household</label>
          <input type="text" id="ty-recipient" class="text-input" readonly style="background:#faf8f5;">
        </div>

        <!-- Pre-written loving messages templates -->
        <div class="field-group" style="margin-bottom:16px;">
          <label class="field-label" style="margin-bottom:8px;">SELECT A PRE-WRITTEN LOVING MESSAGE (OR WRITE YOUR OWN)</label>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button type="button" class="btn btn-outline btn-xs ty-template-option" style="text-align:left;font-size:12.5px;padding:10px 14px;line-height:1.45;white-space:normal;border-color:#dcd1c4;background:#ffffff;border-radius:6px;color:#33261a;" onclick="selectThankYouTemplate(1)">
              <div style="color:var(--gold-hover);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Option 1 · Warm &amp; Generous</div>
              <div style="color:#4a3b2f;">"Thank you so much for your wonderful and generous gift! It means the world to have your love and support as we begin our new chapter together."</div>
            </button>
            <button type="button" class="btn btn-outline btn-xs ty-template-option" style="text-align:left;font-size:12.5px;padding:10px 14px;line-height:1.45;white-space:normal;border-color:#dcd1c4;background:#ffffff;border-radius:6px;color:#33261a;" onclick="selectThankYouTemplate(2)">
              <div style="color:var(--gold-hover);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Option 2 · Honeymoon Adventure</div>
              <div style="color:#4a3b2f;">"We are so touched by your generosity! Your thoughtful gift is helping fund our dream honeymoon in Queenstown. With all our love!"</div>
            </button>
            <button type="button" class="btn btn-outline btn-xs ty-template-option" style="text-align:left;font-size:12.5px;padding:10px 14px;line-height:1.45;white-space:normal;border-color:#dcd1c4;background:#ffffff;border-radius:6px;color:#33261a;" onclick="selectThankYouTemplate(3)">
              <div style="color:var(--gold-hover);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Option 3 · Heartfelt Memories</div>
              <div style="color:#4a3b2f;">"Celebrating our special day with you was an absolute highlight. Thank you for your kindness, warm wishes, and wonderful gift!"</div>
            </button>
          </div>
        </div>

        <div class="field-group" style="margin-bottom:16px;">
          <label class="field-label" for="ty-message">Personal Message</label>
          <textarea id="ty-message" class="text-input" rows="3" style="resize:vertical;" oninput="document.getElementById('ty-card-preview-text').textContent = '&quot;' + this.value + '&quot;'"></textarea>
        </div>

        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink);cursor:pointer;margin-top:6px;">
          <input type="checkbox" id="ty-post-to-feed" checked>
          <span>Also post thank-you celebration note to Live Feed</span>
        </label>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeThankYouModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="confirmSendThankYou()">Send Thank-You Note</button>
      </div>
    </div>
  </div>

  <!-- Manual Gift Modal -->
  <div id="manual-gift-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Record Manual Gift</div>
        <button type="button" class="tt-modal-close" onclick="closeRecordGiftModal()">✕</button>
      </div>
      <form onsubmit="handleSaveManualGift(event)">
        <div class="tt-modal-body">
          <div class="field-group">
            <label class="field-label">Donor Name / Family</label>
            <input type="text" id="mg-donor" class="text-input" required placeholder="e.g. Uncle Arthur">
          </div>
          <div class="field-group">
            <label class="field-label">Amount in AUD</label>
            <input type="number" id="mg-amount" class="text-input" required value="250" min="10" step="5">
          </div>
          <div class="field-group">
            <label class="field-label">Note / Message</label>
            <textarea id="mg-msg" class="text-input" rows="2" placeholder="Wishing you both a wonderful future together!"></textarea>
          </div>
        </div>
        <div class="tt-modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeRecordGiftModal()">Cancel</button>
          <button type="submit" class="btn btn-gold">Record Gift</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Add Guest Modal -->
  <div id="add-guest-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Add Wedding Guest</div>
        <button type="button" class="tt-modal-close" onclick="closeAddGuestModal()">✕</button>
      </div>
      <form onsubmit="handleSaveNewGuest(event)">
        <div class="tt-modal-body">
          <div class="field-group">
            <label class="field-label">Guest Full Name</label>
            <input type="text" id="ag-name" class="text-input" required placeholder="e.g. Eleanor Vance">
          </div>
          <div class="field-group">
            <label class="field-label">Household / Family Name</label>
            <input type="text" id="ag-household" class="text-input" required placeholder="e.g. The Vance Family">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field-group">
              <label class="field-label">RSVP Status</label>
              <select id="ag-status" class="text-input">
                <option value="confirmed">Confirmed</option>
                <option value="awaiting" selected>Awaiting</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Party Count</label>
              <input type="number" id="ag-count" class="text-input" value="1" min="1" max="5">
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Dietary Requirements</label>
            <input type="text" id="ag-dietary" class="text-input" placeholder="e.g. Vegetarian, Gluten-Free, None">
          </div>
        </div>
        <div class="tt-modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeAddGuestModal()">Cancel</button>
          <button type="submit" class="btn btn-gold">Add to Guest List</button>
        </div>
      </form>
    </div>
  </div>

  <script>
{shared_js}
{auth_js}

/* Couple Dashboard Application Logic */
let activeGiftForTY = null;
let seatingViewMode = 'floor';
let draggedGuestId = null;

document.addEventListener('DOMContentLoaded', () => {{
  document.documentElement.classList.remove('tt-unauthenticated');
  if (!initAuthGuard('couple')) return;
  initCoupleDashboard();
  setInterval(updateCoupleCountdown, 1000);
  window.addEventListener('storage', () => {{
    if (initAuthGuard('couple')) initCoupleDashboard();
  }});
  window.addEventListener('tt_state_changed', () => {{
    if (initAuthGuard('couple')) initCoupleDashboard();
  }});
}});

function updateCoupleCountdown() {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  const cd = getWeddingCountdown(wedding.date);
  const badge = document.getElementById('overview-days-badge');
  if (badge) {{
    badge.textContent = `${{cd.days}} DAYS : ${{cd.hours}} HRS : ${{cd.minutes}} MINS : ${{cd.seconds}} SECS REMAINING`;
  }}
}}

function updateReminderButton(state) {{
  const s = state || loadState();
  const unsentAwaiting = (s.guests || []).filter(g => g.rsvpStatus === 'awaiting' && !g.reminderSent);
  const btn = document.getElementById('btn-send-reminders');
  const label = document.getElementById('btn-reminder-label');
  if (!btn) return;
  if (unsentAwaiting.length > 0) {{
    if (label) {{
      label.textContent = `Send Reminder (${{unsentAwaiting.length}})`;
    }} else {{
      btn.innerHTML = `✉️ <span id="btn-reminder-label">Send Reminder (${{unsentAwaiting.length}})</span>`;
    }}
  }} else {{
    if (label) {{
      label.textContent = 'Send Reminder';
    }} else {{
      btn.innerHTML = `✉️ <span id="btn-reminder-label">Send Reminder</span>`;
    }}
  }}
}}

function initCoupleDashboard() {{
  if (!getSession()) return;
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  const metrics = getGuestMetrics(state);

  // Overview Header Countdown & Cards
  updateCoupleCountdown();
  document.getElementById('metric-guests-invited').textContent = metrics.totalInvited;
  document.getElementById('metric-confirmed-pill').textContent = `${{metrics.confirmedCount}} confirmed`;
  document.getElementById('metric-awaiting-rsvp').textContent = metrics.awaitingCount;
  document.getElementById('metric-tables-seated').textContent = metrics.seatedTablesCount;
  document.getElementById('metric-tables-sub').textContent = `of ${{metrics.totalTables}}`;
  document.getElementById('metric-gifts-received').textContent = formatAUD(metrics.giftsTotal);
  const thankyouPill = document.getElementById('metric-thankyou-pill');
  if (thankyouPill) {{
    thankyouPill.innerHTML = `${{metrics.thankYousDue}} thank-yous due &rarr;`;
  }}
  const reminderPill = document.getElementById('metric-reminder-pill');
  if (reminderPill) {{
    const unsentAwaiting = (state.guests || []).filter(g => g.rsvpStatus === 'awaiting' && !g.reminderSent);
    if (unsentAwaiting.length > 0) {{
      reminderPill.innerHTML = 'Reminder due &rarr;';
      reminderPill.className = 'tt-pill warm btn-reminder-nav';
    }} else {{
      reminderPill.innerHTML = 'Reminders sent &rarr;';
      reminderPill.className = 'tt-pill green btn-reminder-nav';
    }}
  }}
  updateReminderButton(state);

  // RSVP Progress Bars
  document.getElementById('prog-confirmed-val').textContent = metrics.confirmedCount;
  document.getElementById('prog-declined-val').textContent = metrics.declinedCount;
  document.getElementById('prog-awaiting-val').textContent = metrics.awaitingCount;
  
  const total = metrics.confirmedCount + metrics.declinedCount + metrics.awaitingCount || 1;
  document.getElementById('prog-confirmed-bar').style.width = `${{(metrics.confirmedCount / total) * 100}}%`;
  document.getElementById('prog-declined-bar').style.width = `${{(metrics.declinedCount / total) * 100}}%`;
  document.getElementById('prog-awaiting-bar').style.width = `${{(metrics.awaitingCount / total) * 100}}%`;

  renderOverviewTasks();
  renderOverviewActivity();
  renderGuestListTable();
  renderSeatingFloor();
  renderQaRdPreview();
  renderGiftsTable();
  renderCoupleFeed();
}}

function switchCoupleTab(tabKey) {{
  document.querySelectorAll('.sidebar-btn').forEach(btn => {{
    const isTarget = btn.getAttribute('data-tab') === tabKey;
    btn.classList.toggle('active', isTarget);
  }});

  document.querySelectorAll('.tab-pane').forEach(pane => {{
    pane.classList.remove('active');
    pane.style.display = 'none';
  }});

  const activePane = document.getElementById('pane-' + tabKey);
  if (activePane) {{
    activePane.classList.add('active');
    activePane.style.display = 'block';
  }}
  window.scrollTo({{ top: 0, behavior: 'smooth' }});
}}

function renderOverviewTasks() {{
  const container = document.getElementById('overview-tasks-list');
  if (!container) return;
  const state = loadState();
  const tasks = state.weddings[0].tasks || [];

  container.innerHTML = tasks.map(t => `
    <div class="checklist-item">
      <label class="checklist-label">
        <input type="checkbox" class="checklist-input" ${{t.completed ? 'checked' : ''}} onchange="toggleTask('${{t.id}}', this.checked)">
        <span style="${{t.completed ? 'text-decoration:line-through;color:#9b8c7c;' : ''}}">${{escapeHtml(t.text)}}</span>
      </label>
      ${{t.due ? `<span style="font-size:12px;color:var(--muted);">${{escapeHtml(t.due)}}</span>` : ''}}
    </div>
  `).join('');
}}

function toggleTask(taskId, isCompleted) {{
  const state = loadState();
  const task = state.weddings[0].tasks.find(t => t.id === taskId);
  if (task) {{
    task.completed = isCompleted;
    saveState(state);
    renderOverviewTasks();
    showToast(`Task updated: "${{task.text}}"`, 'info');
  }}
}}

function addPlanningTask() {{
  const input = document.getElementById('new-task-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';

  const state = loadState();
  if (!state.weddings[0].tasks) state.weddings[0].tasks = [];
  state.weddings[0].tasks.push({{
    id: 't_' + Date.now(),
    text: text,
    completed: false,
    due: 'This week'
  }});
  saveState(state);
  renderOverviewTasks();
  showToast('Task added to planning checklist', 'success');
}}

function renderOverviewActivity() {{
  const container = document.getElementById('overview-activity-stream');
  if (!container) return;
  const state = loadState();
  const audit = state.auditLog || [];

  const icons = {{
    RSVP: '✔',
    Gifting: '🎁',
    Feed: '💌',
    Photos: '📷',
    Seating: '🪑',
    General: 'ℹ'
  }};

  container.innerHTML = audit.slice(0, 5).map(a => `
    <div class="activity-row">
      <div class="activity-glyph">${{icons[a.category] || '✔'}}</div>
      <div style="flex:1;">
        <div style="font-size:13.5px;font-weight:600;color:var(--ink);">${{escapeHtml(a.actor)}} — ${{escapeHtml(a.action)}}</div>
        <div style="font-size:11.5px;color:var(--muted);">${{escapeHtml(a.details)}}</div>
      </div>
      <span style="font-size:11px;color:#a49484;">${{escapeHtml(a.timestamp.split(' ')[1] || 'Today')}}</span>
    </div>
  `).join('');
}}

/* Guest List */
function renderGuestListTable() {{
  const tbody = document.getElementById('guest-table-body');
  if (!tbody) return;
  const state = loadState();
  const guests = state.guests || [];

  tbody.innerHTML = guests.map(g => {{
    let pillClass = 'green';
    let pillText = 'Confirmed';
    if (g.rsvpStatus === 'declined') {{ pillClass = 'danger'; pillText = 'Declined'; }}
    if (g.rsvpStatus === 'awaiting') {{ pillClass = 'lavender'; pillText = 'Awaiting'; }}

    const tableObj = state.tables.find(t => t.id === g.tableId);
    let tableDisplay = '';
    if (tableObj) {{
      tableDisplay = `<span>${{escapeHtml(tableObj.name)}} <small style="color:var(--muted);">(Seat ${{(g.seatIndex !== null && g.seatIndex !== undefined) ? g.seatIndex + 1 : '-'}})</small></span>`;
    }} else if (g.rsvpStatus === 'confirmed') {{
      tableDisplay = `
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="color:var(--muted);font-size:12px;">Unassigned</span>
          <button type="button" class="btn btn-gold btn-xs" style="padding:2px 8px;" onclick="openSeatGuestModalForGuest('${{g.id}}')">+ Seat</button>
        </div>
      `;
    }} else {{
      tableDisplay = '<span style="color:var(--muted);font-size:12px;">—</span>';
    }}

    return `
      <tr id="row-${{g.id}}">
        <td>
          <strong>${{escapeHtml(g.name)}}</strong><br>
          <small style="color:var(--muted);">${{escapeHtml(g.household)}}</small>
        </td>
        <td>
          <span style="font-size:12.5px;">${{escapeHtml(g.phone)}}</span><br>
          <small style="color:var(--muted);">${{escapeHtml(g.email)}}</small>
        </td>
        <td><span class="tt-pill ${{pillClass}}">${{pillText}}</span></td>
        <td>${{g.guestCount || (g.rsvpStatus === 'confirmed' ? 1 : 0)}}</td>
        <td>${{g.dietary && g.dietary !== 'None' ? `<span class="tt-pill warm">${{escapeHtml(g.dietary)}}</span>` : '<span style="color:var(--muted);">None</span>'}}</td>
        <td>${{tableDisplay}}</td>
        <td>
          <div style="display:flex;gap:6px;">
            ${{g.rsvpStatus === 'awaiting' ? `<button type="button" class="btn btn-outline btn-sm" onclick="sendIndividualReminder('${{g.id}}')">${{g.reminderSent ? 'Sent ✓' : 'Reminder'}}</button>` : ''}}
            <button type="button" class="btn btn-outline btn-sm" style="color:#b23b3b;border-color:#e4bcbc;padding:4px 10px;font-size:12px;" onclick="deleteGuest('${{g.id}}')">Remove</button>
          </div>
        </td>
      </tr>
    `;
  }}).join('');
}}

function filterGuestTable() {{
  const query = (document.getElementById('guest-search-input')?.value || '').toLowerCase();
  const status = document.getElementById('guest-status-filter')?.value || 'all';
  const rows = document.querySelectorAll('#guest-table-body tr');

  rows.forEach(r => {{
    const text = r.textContent.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    let matchesStatus = true;
    if (status !== 'all') {{
      matchesStatus = text.includes(status);
    }}
    r.style.display = matchesQuery && matchesStatus ? '' : 'none';
  }});
}}

function openAddGuestModal() {{
  document.getElementById('add-guest-modal').style.display = 'flex';
  document.getElementById('add-guest-modal').setAttribute('aria-hidden', 'false');
}}

function closeAddGuestModal() {{
  document.getElementById('add-guest-modal').style.display = 'none';
  document.getElementById('add-guest-modal').setAttribute('aria-hidden', 'true');
}}

function handleSaveNewGuest(e) {{
  e.preventDefault();
  const name = document.getElementById('ag-name').value.trim();
  const household = document.getElementById('ag-household').value.trim();
  const status = document.getElementById('ag-status').value;
  const count = parseInt(document.getElementById('ag-count').value, 10) || 1;
  const dietary = document.getElementById('ag-dietary').value.trim() || 'None';

  closeAddGuestModal();
  const state = loadState();
  const newGuest = {{
    id: 'g_' + Date.now(),
    name: name,
    initials: name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
    household: household,
    email: `${{name.toLowerCase().replace(/\\s+/g, '.')}}@example.com`,
    phone: '0412 000 111',
    rsvpStatus: status,
    guestCount: count,
    dietary: dietary,
    reminderSent: false,
    tableId: null,
    seatIndex: null
  }};

  state.guests.push(newGuest);
  logAudit('Guest Added', 'Couple', `Added ${{name}} (${{status}})`, 'RSVP');
  saveState(state);
  initCoupleDashboard();
  showToast(`Guest ${{name}} added successfully!`, 'success');
}}

function deleteGuest(guestId) {{
  const state = loadState();
  const idx = state.guests.findIndex(g => g.id === guestId);
  if (idx !== -1) {{
    const name = state.guests[idx].name;
    state.guests.splice(idx, 1);
    logAudit('Guest Removed', 'Couple', `Removed guest ${{name}}`, 'RSVP');
    saveState(state);
    initCoupleDashboard();
    showToast(`Removed ${{name}} from guest list`, 'info');
  }}
}}

function sendIndividualReminder(guestId) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (guest) {{
    guest.reminderSent = true;
    logAudit('RSVP Reminder Sent', 'Couple', `Sent reminder notification to ${{guest.name}}`, 'RSVP');
    saveState(state);
    initCoupleDashboard();
    showToast(`Reminder sent to ${{guest.name}}`, 'success');
  }}
}}

function sendRemindersToAllAwaiting() {{
  const state = loadState();
  const unsentAwaiting = (state.guests || []).filter(g => g.rsvpStatus === 'awaiting' && !g.reminderSent);
  
  if (unsentAwaiting.length > 0) {{
    unsentAwaiting.forEach(g => g.reminderSent = true);
    logAudit('Batch Reminders Sent', 'Couple', `Sent reminders to ${{unsentAwaiting.length}} awaiting guests`, 'RSVP');
    saveState(state);
    
    const remPill = document.getElementById('metric-reminder-pill');
    if (remPill) {{
      remPill.innerHTML = 'Reminders sent &rarr;';
      remPill.className = 'tt-pill green btn-reminder-nav';
    }}
    initCoupleDashboard();
    showToast(`Reminders successfully dispatched to ${{unsentAwaiting.length}} guests!`, 'success');
  }} else {{
    // If no awaiting guests remaining without reminder, dispatch reminder to all guests
    (state.guests || []).forEach(g => g.reminderSent = true);
    logAudit('All Reminders Sent', 'Couple', `Sent reminders to all ${{(state.guests || []).length}} guests`, 'RSVP');
    saveState(state);
    
    const remPill = document.getElementById('metric-reminder-pill');
    if (remPill) {{
      remPill.innerHTML = 'All reminded &rarr;';
      remPill.className = 'tt-pill green btn-reminder-nav';
    }}
    initCoupleDashboard();
    showToast(`Reminders successfully dispatched to all ${{(state.guests || []).length}} guests!`, 'success');
  }}
}}

function exportGuestsCSV() {{
  const state = loadState();
  const guests = state.guests || [];
  let csv = 'Name,Household,Email,Phone,RSVP_Status,Guests_Count,Dietary,Assigned_Table\\n';
  guests.forEach(g => {{
    const tableObj = state.tables.find(t => t.id === g.tableId);
    csv += `"${{g.name}}","${{g.household}}","${{g.email}}","${{g.phone}}","${{g.rsvpStatus}}",${{g.guestCount || 0}},"${{g.dietary || ''}}","${{tableObj ? tableObj.name : 'Unassigned'}}"\\n`;
  }});

  const blob = new Blob([csv], {{ type: 'text/csv;charset=utf-8' }});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'sophie-james-guest-list.csv';
  link.click();
  showToast('Guest list exported as CSV download', 'success');
}}

/* Seating Builder */
function setSeatingView(mode) {{
  seatingViewMode = mode;
  const isFloor = mode === 'floor';
  document.getElementById('btn-view-floor').className = isFloor ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('btn-view-list').className = !isFloor ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('floorplan-canvas').style.display = isFloor ? 'flex' : 'none';
  document.getElementById('unassigned-panel').style.display = isFloor ? 'flex' : 'none';
  document.getElementById('seating-list-view').style.display = !isFloor ? 'block' : 'none';
  if (!isFloor) renderSeatingRoster();
}}

function renderSeatingFloor() {{
  const state = loadState();
  const tablesContainer = document.getElementById('tables-container');
  const headSeats = document.getElementById('head-table-seats');
  const unassignedList = document.getElementById('unassigned-guests-list');
  if (!tablesContainer || !headSeats || !unassignedList) return;

  // Head Table 8 seats
  const headGuests = state.guests.filter(g => g.tableId === 'head');
  let headHtml = '';
  for (let i = 0; i < 8; i++) {{
    const g = headGuests.find(x => x.seatIndex === i);
    headHtml += `
      <div class="seat-dot ${{g ? '' : 'empty'}}" style="position:static;" title="${{g ? g.name : 'Empty seat'}}" onclick="handleSeatClick('head', ${{i}})">
        ${{g ? (g.initials || g.name.substring(0,2).toUpperCase()) : '+'}}
      </div>
    `;
  }}
  headSeats.innerHTML = headHtml;

  // Round Tables (Tables 1 to 6)
  const roundTables = state.tables.filter(t => !t.isHead);
  tablesContainer.innerHTML = roundTables.map(t => {{
    const seated = state.guests.filter(g => g.tableId === t.id);
    const countDisplay = `${{seated.length}} / ${{t.capacity}}`;

    let seatsHtml = '';
    for (let s = 0; s < t.capacity; s++) {{
      const g = seated.find(x => x.seatIndex === s);
      const angle = (s * (360 / t.capacity)) * (Math.PI / 180);
      const radius = 64;
      const x = 59 + radius * Math.cos(angle) - 13.5;
      const y = 59 + radius * Math.sin(angle) - 13.5;

      seatsHtml += `
        <div class="seat-dot ${{g ? '' : 'empty'}}" 
             style="left:${{x.toFixed(1)}}px;top:${{y.toFixed(1)}}px;" 
             title="${{g ? g.name + (g.dietary ? ' (' + g.dietary + ')' : '') : 'Empty seat ' + (s + 1)}}"
             ondragover="event.preventDefault()"
             ondrop="handleDropOnSeat('${{t.id}}', ${{s}})"
             onclick="handleSeatClick('${{t.id}}', ${{s}})">
          ${{g ? (g.initials || g.name.substring(0,2).toUpperCase()) : '+'}}
        </div>
      `;
    }}

    return `
      <div class="round-table" id="circle-${{t.id}}">
        <span class="round-table-title">${{escapeHtml(t.name)}}</span>
        <span class="round-table-count">${{countDisplay}}</span>
        ${{seatsHtml}}
      </div>
    `;
  }}).join('');

  // Unassigned Guests
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  document.getElementById('unassigned-count-label').textContent = `${{unassigned.length}} guests still need a table`;

  unassignedList.innerHTML = unassigned.map(g => `
    <div class="guest-card-draggable" draggable="true" ondragstart="handleGuestDragStart('${{g.id}}')">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:26px;height:26px;border-radius:50%;background:#e2d4c0;color:#3d2f23;font-size:10px;font-weight:700;display:grid;place-items:center;">
          ${{escapeHtml(g.initials || g.name.substring(0,2).toUpperCase())}}
        </div>
        <div style="flex:1;">
          <strong style="font-size:12.5px;color:var(--ink);display:block;">${{escapeHtml(g.name)}}</strong>
          <span style="font-size:11px;color:var(--muted);">
            ${{g.plusOne ? '+1 guest' : 'No plus-one'}} ${{g.dietary && g.dietary !== 'None' ? '· ' + g.dietary : ''}}
          </span>
        </div>
      </div>
      <div style="display:flex;gap:4px;margin-top:6px;align-items:center;">
        <select class="text-input" style="padding:3px 6px;font-size:11px;flex:1;" onchange="if(this.value){{handleAssignToTable('${{g.id}}', this.value);this.value='';}}">
          <option value="">Seat at Table...</option>
          <option value="head">Head Table</option>
          ${{roundTables.map(tbl => `<option value="${{tbl.id}}">${{tbl.name}} (${{state.guests.filter(x => x.tableId === tbl.id).length}}/${{tbl.capacity}})</option>`).join('')}}
        </select>
        <button type="button" class="btn btn-xs btn-gold" onclick="handleQuickAssign('${{g.id}}')" title="Auto-assign next free seat">Auto</button>
      </div>
    </div>
  `).join('');
}}

function handleGuestDragStart(guestId) {{
  draggedGuestId = guestId;
}}

function handleDropOnSeat(tableId, seatIndex) {{
  if (!draggedGuestId) return;
  assignGuestToSeat(draggedGuestId, tableId, seatIndex);
  draggedGuestId = null;
}}

function handleSeatClick(tableId, seatIndex) {{
  const state = loadState();
  const seated = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
  if (seated) {{
    handleRemoveGuestFromTable(seated.id);
  }}
}}

function handleRemoveGuestFromTable(guestId) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;
  const oldTable = state.tables.find(t => t.id === guest.tableId);
  const oldTableName = oldTable ? oldTable.name : 'Table';
  guest.tableId = null;
  guest.seatIndex = null;
  logAudit('Guest Removed from Seating', 'Couple', `Removed ${{guest.name}} from ${{oldTableName}}`, 'Seating');
  saveState(state);
  initCoupleDashboard();
  showToast(`Removed ${{guest.name}} from ${{oldTableName}}. Returned to unassigned pool.`, 'info');
}}

function handleAssignToTable(guestId, tableId) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;
  const table = state.tables.find(t => t.id === tableId);
  if (!table) return;
  const seated = state.guests.filter(g => g.tableId === tableId);
  if (seated.length >= table.capacity) {{
    showToast(`${{table.name}} is already full (${{table.capacity}}/${{table.capacity}})!`, 'error');
    return;
  }}
  let freeSeat = 0;
  for (let s = 0; s < table.capacity; s++) {{
    if (!seated.some(x => x.seatIndex === s)) {{
      freeSeat = s;
      break;
    }}
  }}
  guest.tableId = tableId;
  guest.seatIndex = freeSeat;
  logAudit('Guest Seated', 'Couple', `Seated ${{guest.name}} at ${{table.name}}, Seat ${{freeSeat + 1}}`, 'Seating');
  saveState(state);
  initCoupleDashboard();
  showToast(`Seated ${{guest.name}} at ${{table.name}}, Seat ${{freeSeat + 1}}`, 'success');
}}

function openSeatGuestModal(tableId) {{
  const state = loadState();
  const tableSelect = document.getElementById('sg-table-select');
  const guestSelect = document.getElementById('sg-guest-select');
  const modalTitle = document.getElementById('sg-modal-title');
  document.getElementById('sg-preset-table-id').value = tableId || '';
  document.getElementById('sg-preset-guest-id').value = '';

  const targetTable = state.tables.find(t => t.id === tableId);
  modalTitle.textContent = targetTable ? `Add Guest to ${{targetTable.name}}` : 'Assign Guest to Table';

  tableSelect.innerHTML = state.tables.map(t => {{
    const count = state.guests.filter(g => g.tableId === t.id).length;
    return `<option value="${{t.id}}" ${{t.id === tableId ? 'selected' : ''}}>${{escapeHtml(t.name)}} (${{count}}/${{t.capacity}} occupied)</option>`;
  }}).join('');

  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  if (unassigned.length === 0) {{
    guestSelect.innerHTML = '<option value="">No unassigned confirmed guests</option>';
  }} else {{
    guestSelect.innerHTML = unassigned.map(g => `<option value="${{g.id}}">${{escapeHtml(g.name)}} ${{g.dietary ? '(' + g.dietary + ')' : ''}}</option>`).join('');
  }}

  document.getElementById('sg-guest-select-group').style.display = 'block';
  document.getElementById('sg-table-select-group').style.display = 'block';

  document.getElementById('seat-guest-modal').style.display = 'flex';
  document.getElementById('seat-guest-modal').setAttribute('aria-hidden', 'false');
}}

function openSeatGuestModalForGuest(guestId) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;

  document.getElementById('sg-preset-guest-id').value = guestId;
  document.getElementById('sg-preset-table-id').value = '';
  document.getElementById('sg-modal-title').textContent = `Assign ${{guest.name}} to Table`;

  const tableSelect = document.getElementById('sg-table-select');
  const guestSelect = document.getElementById('sg-guest-select');

  tableSelect.innerHTML = state.tables.map(t => {{
    const count = state.guests.filter(g => g.tableId === t.id).length;
    return `<option value="${{t.id}}">${{escapeHtml(t.name)}} (${{count}}/${{t.capacity}} occupied)</option>`;
  }}).join('');

  guestSelect.innerHTML = `<option value="${{guest.id}}" selected>${{escapeHtml(guest.name)}}</option>`;

  document.getElementById('seat-guest-modal').style.display = 'flex';
  document.getElementById('seat-guest-modal').setAttribute('aria-hidden', 'false');
}}

function closeSeatGuestModal() {{
  document.getElementById('seat-guest-modal').style.display = 'none';
  document.getElementById('seat-guest-modal').setAttribute('aria-hidden', 'true');
}}

function confirmSeatGuestModal() {{
  const tableId = document.getElementById('sg-table-select').value;
  const guestId = document.getElementById('sg-guest-select').value;
  if (!tableId || !guestId) {{
    showToast('Please select both a table and a guest', 'error');
    return;
  }}
  closeSeatGuestModal();
  handleAssignToTable(guestId, tableId);
}}

function handleQuickAssign(guestId) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;

  for (const t of state.tables.filter(x => !x.isHead)) {{
    const seated = state.guests.filter(g => g.tableId === t.id);
    for (let s = 0; s < t.capacity; s++) {{
      if (!seated.some(x => x.seatIndex === s)) {{
        assignGuestToSeat(guestId, t.id, s);
        return;
      }}
    }}
  }}
  showToast('All tables are at maximum capacity! Use "Add table" to create more seats.', 'error');
}}

function assignGuestToSeat(guestId, tableId, seatIndex) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;

  // Clear existing occupant on that seat if any
  const existingOccupant = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
  if (existingOccupant) {{
    existingOccupant.tableId = null;
    existingOccupant.seatIndex = null;
  }}

  guest.tableId = tableId;
  guest.seatIndex = seatIndex;

  const tableObj = state.tables.find(t => t.id === tableId);
  logAudit('Seating Updated', 'Couple', `Seated ${{guest.name}} at ${{tableObj ? tableObj.name : tableId}}, Seat ${{seatIndex + 1}}`, 'Seating');
  saveState(state);
  initCoupleDashboard();
  showToast(`Seated ${{guest.name}} at ${{tableObj ? tableObj.name : 'Table'}}, Seat ${{seatIndex + 1}}`, 'success');
}}

function filterUnassignedGuests() {{
  const q = (document.getElementById('unassigned-search')?.value || '').toLowerCase();
  document.querySelectorAll('#unassigned-guests-list .guest-card-draggable').forEach(el => {{
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  }});
}}

function addTableToFloor() {{
  const state = loadState();
  const currentCount = state.tables.filter(t => !t.isHead).length;
  const newTable = {{
    id: 'table_' + (currentCount + 1),
    name: `Table ${{currentCount + 1}}`,
    capacity: 8,
    isHead: false
  }};
  state.tables.push(newTable);
  logAudit('Table Added', 'Couple', `Added ${{newTable.name}} (8 capacity)`, 'Seating');
  saveState(state);
  initCoupleDashboard();
  showToast(`Added ${{newTable.name}} (8 seats)`, 'success');
}}

function openSuggestSeatingModal() {{
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  const container = document.getElementById('suggested-assignments-list');
  if (!container) return;

  if (unassigned.length === 0) {{
    container.innerHTML = '<div>All guests are already assigned to tables!</div>';
  }} else {{
    container.innerHTML = unassigned.map((g, idx) => `
      <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #ebd9c2;">
        <strong>${{g.name}} ${{g.dietary ? '(' + g.dietary + ')' : ''}}</strong>
        <span style="color:var(--gold-hover);font-weight:600;">&rarr; Table ${{Math.min(6, 1 + Math.floor(idx / 3))}}, Seat ${{(idx % 8) + 1}}</span>
      </div>
    `).join('');
  }}

  document.getElementById('suggest-seating-modal').style.display = 'flex';
  document.getElementById('suggest-seating-modal').setAttribute('aria-hidden', 'false');
}}

function closeSuggestSeatingModal() {{
  document.getElementById('suggest-seating-modal').style.display = 'none';
  document.getElementById('suggest-seating-modal').setAttribute('aria-hidden', 'true');
}}

function applySuggestedSeating() {{
  closeSuggestSeatingModal();
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  
  // Fill available slots across tables
  unassigned.forEach((g, idx) => {{
    const targetTableId = 'table_' + Math.min(6, 1 + Math.floor(idx / 3));
    g.tableId = targetTableId;
    g.seatIndex = idx % 8;
  }});

  logAudit('AI Seating Applied', 'Couple', `Auto-assigned ${{unassigned.length}} guests`, 'Seating');
  saveState(state);
  initCoupleDashboard();
  showToast(`Applied seating suggestions for ${{unassigned.length}} guests!`, 'success');
}}

function saveSeatingAssignments() {{
  const state = loadState();
  saveState(state);
  showToast('Seating plan saved successfully!', 'success');
}}

function renderSeatingRoster() {{
  const container = document.getElementById('seating-roster-content');
  if (!container) return;
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;background:#fbf8f3;padding:12px 16px;border-radius:6px;border:1px solid var(--line);">
      <div>
        <strong style="color:var(--ink);">Unassigned Confirmed Guests:</strong>
        <span style="color:var(--gold-hover);font-weight:700;margin-left:6px;">${{unassigned.length}} guests</span>
      </div>
      <button type="button" class="btn btn-gold btn-sm" onclick="openSuggestSeatingModal()">✨ Auto-Seat All Remaining</button>
    </div>
  `;

  html += state.tables.map(t => {{
    const seated = state.guests.filter(g => g.tableId === t.id);
    return `
      <div class="content-card" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <h4 style="font-family:var(--font-heading);font-size:16px;margin:0;">
              ${{escapeHtml(t.name)}}
            </h4>
            <span style="font-size:12px;color:var(--muted);">${{seated.length}} of ${{t.capacity}} seats filled</span>
          </div>
          <button type="button" class="btn btn-sm btn-gold" onclick="openSeatGuestModal('${{t.id}}')">
            + Add Guest to ${{escapeHtml(t.name)}}
          </button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${{seated.length === 0 ? '<div style="font-size:12px;color:var(--muted);padding:8px;font-style:italic;">No guests seated at this table yet.</div>' : ''}}
          ${{seated.map(g => `
            <div style="display:flex;justify-content:space-between;align-items:center;background:#fbf9f6;padding:8px 12px;border-radius:4px;font-size:13px;border:1px solid #f2ece3;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-weight:700;color:var(--gold-hover);min-width:55px;">Seat ${{(g.seatIndex !== null && g.seatIndex !== undefined) ? g.seatIndex + 1 : '-'}}:</span>
                <strong style="color:var(--ink);">${{escapeHtml(g.name)}}</strong>
                ${{g.dietary && g.dietary !== 'None' ? `<span class="tt-pill warm" style="font-size:10px;">${{escapeHtml(g.dietary)}}</span>` : ''}}
              </div>
              <button type="button" class="btn btn-outline btn-xs" style="color:#b23b3b;border-color:#e4bcbc;" onclick="handleRemoveGuestFromTable('${{g.id}}')">
                ✕ Remove from Table
              </button>
            </div>
          `).join('')}}
        </div>
      </div>
    `;
  }}).join('');

  container.innerHTML = html;
}}

/* QaRd Invitation Preview */
function renderQaRdPreview() {{
  const state = loadState();
  const select = document.getElementById('qard-guest-select');
  if (!select) return;

  select.innerHTML = state.guests.slice(0, 15).map(g => {{
    const label = (g.household && g.household !== g.name) ? `${{g.name}} (${{g.household}})` : g.name;
    return `<option value="${{g.id}}">${{escapeHtml(label)}}</option>`;
  }}).join('');

  updateQaRdPreview();
}}

let currentQardTheme = 'obsidian';

function selectQardCardDesign(theme) {{
  currentQardTheme = theme;
  const frame = document.getElementById('qard-card-frame');
  const inner = frame ? frame.querySelector('.qard-inner-border') : null;
  const dates = document.getElementById('qard-card-date');
  const venue = document.getElementById('qard-card-venue');
  const household = document.getElementById('qard-household-line');

  document.querySelectorAll('.qard-theme-btn').forEach(btn => {{
    const isTarget = btn.id === 'qard-btn-' + theme;
    btn.classList.toggle('active', isTarget);
    btn.style.border = isTarget ? '2px solid #bd9661' : '1px solid #d8cfc4';
  }});

  if (!frame || !inner) return;

  if (theme === 'champagne') {{
    frame.style.background = '#faf6f0';
    frame.style.color = '#15110e';
    frame.style.borderColor = '#d4c5b3';
    inner.style.borderColor = 'rgba(189,150,97,0.7)';
    if (dates) dates.style.color = '#8c6b45';
    if (venue) venue.style.color = '#6a584a';
    if (household) household.style.color = '#6a584a';
    frame.querySelectorAll('.qard-brand-text, .qard-title-text').forEach(el => el.style.color = '#15110e');
  }} else if (theme === 'merlot') {{
    frame.style.background = '#351319';
    frame.style.color = '#fcecd7';
    frame.style.borderColor = '#522027';
    inner.style.borderColor = 'rgba(227,184,121,0.6)';
    if (dates) dates.style.color = '#ffd8a0';
    if (venue) venue.style.color = '#debdb0';
    if (household) household.style.color = '#debdb0';
    frame.querySelectorAll('.qard-brand-text, .qard-title-text').forEach(el => el.style.color = '#ffffff');
  }} else if (theme === 'sage') {{
    frame.style.background = '#1b2a20';
    frame.style.color = '#f0eade';
    frame.style.borderColor = '#2c4233';
    inner.style.borderColor = 'rgba(202,185,150,0.6)';
    if (dates) dates.style.color = '#e4d5be';
    if (venue) venue.style.color = '#bcc6be';
    if (household) household.style.color = '#bcc6be';
    frame.querySelectorAll('.qard-brand-text, .qard-title-text').forEach(el => el.style.color = '#ffffff');
  }} else {{
    frame.style.background = '#15110e';
    frame.style.color = '#dfc194';
    frame.style.borderColor = '#2e241c';
    inner.style.borderColor = 'rgba(189,150,97,0.4)';
    if (dates) dates.style.color = '#e8cda2';
    if (venue) venue.style.color = '#bdaea0';
    if (household) household.style.color = '#bfaea0';
    frame.querySelectorAll('.qard-brand-text, .qard-title-text').forEach(el => el.style.color = '#ffffff');
  }}

  showToast(`Card design updated to ${{theme.charAt(0).toUpperCase() + theme.slice(1)}}`, 'info');
}}

function updateQaRdPreview() {{
  const select = document.getElementById('qard-guest-select');
  const guestId = select ? select.value : 'priya';
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId) || state.guests[0];

  document.getElementById('qard-household-line').textContent = `For ${{guest.household}}`;
  document.getElementById('qard-svg-container').innerHTML = generateQrSvg(`guest-mobile.html?g=${{guest.id}}`, 130);
}}

function simulateScan() {{
  const select = document.getElementById('qard-guest-select');
  const guestId = select ? select.value : 'priya';
  window.open(`guest-mobile.html?g=${{guestId}}`, '_blank');
}}

function sendAllInvitations() {{
  const state = loadState();
  logAudit('Invitations Dispatched', 'Couple', 'Digital & physical QaRd cards dispatched to 118 households', 'General');
  
  state.feed.unshift({{
    id: 'f_invites_' + Date.now(),
    type: 'banner',
    author: 'Sophie & James',
    title: 'Invitations went out this week',
    subtitle: 'All QaRds have been dispatched via express post',
    time: 'Just now',
    likes: 18,
    comments: [],
    pinned: false,
    hidden: false
  }});

  saveState(state);
  initCoupleDashboard();
  showToast('Invitations marked as sent! Updated celebration feed and audit log.', 'success');
}}

/* Gift & Go */
function renderGiftsTable() {{
  const tbody = document.getElementById('gifts-table-body');
  if (!tbody) return;
  const state = loadState();
  const gifts = state.gifts || [];

  tbody.innerHTML = gifts.map(g => `
    <tr>
      <td><strong>${{escapeHtml(g.from)}}</strong></td>
      <td><span style="font-weight:700;color:var(--ink);">${{formatAUD(g.amount)}}</span></td>
      <td>${{escapeHtml(g.date)}}</td>
      <td style="max-width:280px;font-style:italic;">"${{escapeHtml(g.message || 'Congratulations!')}}"</td>
      <td>
        <span class="tt-pill ${{g.thankYouSent ? 'green' : 'warm'}}">
          ${{g.thankYouSent ? 'Sent' : 'Due'}}
        </span>
      </td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" style="padding:4px 10px;font-size:13px;border-radius:6px;border-color:#cfbead;" onclick="openThankYouModal('${{g.id}}')" title="Write thank-you note">
          ✏️
        </button>
      </td>
    </tr>
  `).join('');
}}

function selectThankYouTemplate(num) {{
  if (!activeGiftForTY) return;
  let text = '';
  if (num === 1) {{
    text = `Dear ${{activeGiftForTY.from}}, thank you so much for your wonderful and generous gift of ${{formatAUD(activeGiftForTY.amount)}}! It means the world to have your love and support as we begin our new chapter together. Love, Sophie & James.`;
  }} else if (num === 2) {{
    text = `Dearest ${{activeGiftForTY.from}}, we are so touched by your generosity! Your thoughtful gift is helping fund our dream honeymoon in Queenstown. With all our love, Sophie & James.`;
  }} else {{
    text = `Dear ${{activeGiftForTY.from}}, celebrating our special wedding day with you was an absolute highlight! Thank you from the bottom of our hearts for your kindness, warm wishes, and wonderful gift. Love, Sophie & James.`;
  }}
  const msgInput = document.getElementById('ty-message');
  const preview = document.getElementById('ty-card-preview-text');
  if (msgInput) msgInput.value = text;
  if (preview) preview.textContent = `"${{text}}"`;
}}

function openThankYouModal(giftId) {{
  const state = loadState();
  activeGiftForTY = state.gifts.find(g => g.id === giftId);
  if (!activeGiftForTY) return;

  document.getElementById('ty-recipient').value = activeGiftForTY.from;
  document.getElementById('ty-card-subline').textContent = `To ${{activeGiftForTY.from}} · ${{formatAUD(activeGiftForTY.amount)}} Gift`;
  const defaultMsg = activeGiftForTY.thankYouMessage || `Dear ${{activeGiftForTY.from}}, thank you so much for your wonderful and generous gift of ${{formatAUD(activeGiftForTY.amount)}} towards our new chapter! It means the world to have your love and support. Love, Sophie & James.`;
  document.getElementById('ty-message').value = defaultMsg;
  document.getElementById('ty-card-preview-text').textContent = `"${{defaultMsg}}"`;

  document.getElementById('thank-you-modal').style.display = 'flex';
  document.getElementById('thank-you-modal').setAttribute('aria-hidden', 'false');
}}

function closeThankYouModal() {{
  document.getElementById('thank-you-modal').style.display = 'none';
  document.getElementById('thank-you-modal').setAttribute('aria-hidden', 'true');
}}

function confirmSendThankYou() {{
  if (!activeGiftForTY) return;
  const state = loadState();
  const gift = state.gifts.find(g => g.id === activeGiftForTY.id);
  const msg = document.getElementById('ty-message').value.trim() || 'Thank you so much for your generous gift!';
  const postToFeed = document.getElementById('ty-post-to-feed')?.checked;

  closeThankYouModal();

  if (gift) {{
    gift.thankYouSent = true;
    gift.thankYouMessage = msg;

    if (postToFeed) {{
      state.feed.unshift({{
        id: 'f_ty_' + Date.now(),
        type: 'gift',
        author: 'Sophie & James',
        title: `Thank You, ${{gift.from}}!`,
        subtitle: `Digital Thank-You Card sent for ${{formatAUD(gift.amount)}} wishing well gift`,
        quote: msg,
        time: 'Just now',
        likes: 3,
        comments: [],
        pinned: false,
        hidden: false
      }});
    }}

    logAudit('Thank-You Card Sent', 'Sophie & James', `Sent digital thank-you card to ${{gift.from}} (${{formatAUD(gift.amount)}})`, 'Gifting');
    saveState(state);
    initCoupleDashboard();
    showToast(`Thank-you card dispatched to ${{gift.from}}!`, 'success');
  }}
}}

function openRecordGiftModal() {{
  document.getElementById('manual-gift-modal').style.display = 'flex';
  document.getElementById('manual-gift-modal').setAttribute('aria-hidden', 'false');
}}

function closeRecordGiftModal() {{
  document.getElementById('manual-gift-modal').style.display = 'none';
  document.getElementById('manual-gift-modal').setAttribute('aria-hidden', 'true');
}}

function handleSaveManualGift(e) {{
  e.preventDefault();
  const donor = document.getElementById('mg-donor').value.trim();
  const amount = parseInt(document.getElementById('mg-amount').value, 10) || 100;
  const msg = document.getElementById('mg-msg').value.trim() || 'Warm congratulations!';
  
  closeRecordGiftModal();
  const state = loadState();
  state.gifts.unshift({{
    id: 'gf_' + Date.now(),
    from: donor,
    amount: amount,
    date: 'Today',
    message: msg,
    thankYouSent: false
  }});
  logAudit('Manual Gift Logged', 'Couple', `Recorded ${{formatAUD(amount)}} from ${{donor}}`, 'Gifting');
  saveState(state);
  initCoupleDashboard();
  showToast(`Recorded gift of ${{formatAUD(amount)}} from ${{donor}}`, 'success');
}}

/* Celebration Feed Moderation */
function renderCoupleFeed() {{
  const container = document.getElementById('couple-feed-list');
  if (!container) return;
  const state = loadState();
  const feed = state.feed || [];

  container.innerHTML = feed.map(item => {{
    let repliesHtml = '';
    if (item.replies && item.replies.length > 0) {{
      repliesHtml = `
        <div style="margin-top:8px;padding-left:10px;border-left:3px solid var(--gold);display:flex;flex-direction:column;gap:6px;">
          ${{item.replies.map(r => `
            <div style="background:#faf7f0;border:1px solid #ebd9c2;border-radius:4px;padding:6px 10px;font-size:12px;display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <strong style="color:#bd9661;">👑 ${{escapeHtml(r.author || 'Sophie & James')}} (Couple):</strong>
                <span style="color:#2a2018;margin-left:4px;">${{escapeHtml(r.text)}}</span>
              </div>
              <span style="font-size:10px;color:var(--muted);white-space:nowrap;margin-left:8px;">${{escapeHtml(r.time || 'Just now')}}</span>
            </div>
          `).join('')}}
        </div>
      `;
    }}

    return `
      <div class="feed-card" style="opacity:${{item.hidden ? '0.5' : '1'}};margin-bottom:12px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:6px;">
              <strong>${{escapeHtml(item.title)}}</strong>
              ${{item.pinned ? '<span class="tt-pill gold" style="font-size:10px;">Pinned</span>' : ''}}
              ${{item.hidden ? '<span class="tt-pill danger" style="font-size:10px;">Hidden</span>' : ''}}
            </div>
            ${{item.quote ? `<div style="background:#fcf9f4;border-left:3px solid var(--gold);padding:8px 12px;border-radius:0 4px 4px 0;font-style:italic;margin:8px 0;font-size:13px;color:#4a3c30;">"${{escapeHtml(item.quote)}}"</div>` : ''}}
            ${{item.subtitle ? `<div style="font-size:12px;color:var(--muted);margin-top:2px;">${{escapeHtml(item.subtitle)}}</div>` : ''}}
            <div style="font-size:11px;color:#a89686;margin-top:4px;">${{escapeHtml(item.time)}} · ${{item.likes || 0}} likes · ${{(item.comments || []).length}} comments</div>
            ${{repliesHtml}}
          </div>
          <div style="display:flex;gap:8px;margin-left:12px;flex-shrink:0;align-items:center;">
            <button type="button" class="btn btn-gold btn-sm" onclick="toggleCoupleReplyBox('${{item.id}}')">💬 Reply</button>
            <button type="button" class="btn btn-outline btn-sm couple-like-btn" style="color:#e02424;border-color:${{item.coupleLiked ? '#e02424' : '#e2d9cf'}};background:${{item.coupleLiked ? '#fef2f2' : '#ffffff'}};font-size:14px;padding:5px 12px;display:flex;align-items:center;gap:6px;border-radius:6px;cursor:pointer;" onclick="toggleCoupleLike('${{item.id}}')" title="Love note">
              <span style="font-size:16px;line-height:1;display:inline-block;">❤️</span>
              <span style="font-size:12.5px;font-weight:700;color:${{item.coupleLiked ? '#c81e1e' : '#5c4d40'}};">${{item.likes || 0}}</span>
            </button>
          </div>
        </div>
        <div id="couple-reply-row-${{item.id}}" style="display:none;margin-top:10px;padding-top:10px;border-top:1px dashed #ebd9c2;">
          <div style="display:flex;gap:6px;">
            <input type="text" id="couple-reply-input-${{item.id}}" class="text-input" style="padding:6px 10px;font-size:12px;" placeholder="Write personal reply from Sophie &amp; James...">
            <button type="button" class="btn btn-gold btn-sm" onclick="submitCoupleReply('${{item.id}}')">Send Reply</button>
          </div>
        </div>
      </div>
    `;
  }}).join('');
}}

function toggleCoupleReplyBox(itemId) {{
  const row = document.getElementById('couple-reply-row-' + itemId);
  if (row) {{
    row.style.display = row.style.display === 'none' ? 'block' : 'none';
    if (row.style.display === 'block') {{
      const input = document.getElementById('couple-reply-input-' + itemId);
      if (input) input.focus();
    }}
  }}
}}

function submitCoupleReply(itemId) {{
  const input = document.getElementById('couple-reply-input-' + itemId);
  if (!input) return;
  const replyText = input.value.trim();
  if (!replyText) {{
    showToast('Please type a reply first', 'error');
    return;
  }}
  const state = loadState();
  const item = state.feed.find(f => f.id === itemId);
  if (!item) return;

  if (!item.replies) item.replies = [];
  item.replies.push({{
    author: 'Sophie & James',
    role: 'couple',
    text: replyText,
    time: 'Just now'
  }});

  logAudit('Couple Replied', 'Sophie & James', `Replied to ${{item.author || item.title}}: "${{replyText.substring(0, 30)}}..."`, 'Feed');
  saveState(state);
  initCoupleDashboard();
  showToast('Reply from Sophie & James published to celebration feed!', 'success');
}}

function toggleCoupleLike(itemId) {{
  const state = loadState();
  const item = (state.feed || []).find(f => f.id === itemId);
  if (item) {{
    item.coupleLiked = !item.coupleLiked;
    if (item.coupleLiked) {{
      item.likes = (item.likes || 0) + 1;
      logAudit('Note Loved', 'Sophie & James', `Loved note: "${{item.title}}"`, 'Feed');
      showToast('Loved note with red heart! ❤️', 'success');
    }} else {{
      item.likes = Math.max(0, (item.likes || 1) - 1);
      showToast('Heart reaction removed', 'info');
    }}
    saveState(state);
    renderCoupleFeed();
  }}
}}

function togglePinFeed(id) {{
  const state = loadState();
  const item = state.feed.find(f => f.id === id);
  if (item) {{
    item.pinned = !item.pinned;
    saveState(state);
    initCoupleDashboard();
    showToast(item.pinned ? 'Pinned to top of celebration feed' : 'Unpinned from feed', 'info');
  }}
}}

function toggleHideFeed(id) {{
  const state = loadState();
  const item = state.feed.find(f => f.id === id);
  if (item) {{
    item.hidden = !item.hidden;
    saveState(state);
    initCoupleDashboard();
    showToast(item.hidden ? 'Post hidden from guest view' : 'Post visible to guests', 'info');
  }}
}}

function deleteFeedItem(id) {{
  const state = loadState();
  const idx = state.feed.findIndex(f => f.id === id);
  if (idx !== -1) {{
    state.feed.splice(idx, 1);
    saveState(state);
    initCoupleDashboard();
    showToast('Feed item removed', 'info');
  }}
}}

function handleCoupleAnnouncement(e) {{
  e.preventDefault();
  const input = document.getElementById('couple-announcement-text');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const state = loadState();
  state.feed.unshift({{
    id: 'f_ann_' + Date.now(),
    type: 'note',
    author: 'Sophie & James',
    title: 'Announcement from Sophie & James',
    quote: text,
    time: 'Just now',
    likes: 5,
    comments: [],
    pinned: true,
    hidden: false
  }});
  logAudit('Announcement Posted', 'Couple', `Posted: "${{text.substring(0, 30)}}..."`, 'Feed');
  saveState(state);
  initCoupleDashboard();
  showToast('Announcement posted to celebration feed!', 'success');
}}

/* Settings */
function handleSaveSettings(e) {{
  e.preventDefault();
  const state = loadState();
  const p1 = document.getElementById('set-partner1').value.trim();
  const p2 = document.getElementById('set-partner2').value.trim();
  const dt = document.getElementById('set-date').value;
  const dress = document.getElementById('set-dress').value.trim();
  const venue = document.getElementById('set-venue').value.trim();
  const addr = document.getElementById('set-address').value.trim();
  const park = document.getElementById('set-parking').value.trim();

  state.weddings[0].partner1 = p1;
  state.weddings[0].partner2 = p2;
  state.weddings[0].couple = `${{p1}} & ${{p2}}`;
  state.weddings[0].date = dt ? dt + ':00' : state.weddings[0].date;
  state.weddings[0].dressCode = dress;
  state.weddings[0].venue = venue;
  state.weddings[0].venueAddress = addr;
  state.weddings[0].parking = park;

  logAudit('Settings Updated', 'Couple', 'Updated wedding date, venue, and guest instructions', 'General');
  saveState(state);
  initCoupleDashboard();
  showToast('Wedding settings saved successfully!', 'success');
}}

{chatbot_js}
</script>
{chatbot_html}
</body>
</html>
"""
    with open(os.path.join('c:\\Users\\Mohak\\Desktop\\tap&toast\\tap-toast-demo', 'couple.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("couple.html generated successfully!")

if __name__ == '__main__':
    build_couple()
