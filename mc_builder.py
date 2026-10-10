# Builder for mc.html
import os
from shared_css import get_shared_css
from shared_js import get_shared_js
from auth_component import get_auth_css, get_auth_html, get_auth_js
from chatbot_component import get_chatbot_html, get_chatbot_css, get_chatbot_js

def build_mc():
    shared_css = get_shared_css()
    shared_js = get_shared_js()
    auth_css = get_auth_css()
    auth_html = get_auth_html('mc')
    auth_js = get_auth_js('mc')
    chatbot_css = get_chatbot_css()
    chatbot_html = get_chatbot_html()
    chatbot_js = get_chatbot_js()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Robert Galati | Tap &amp; Toast MC Hub</title>
  <script>
    (function() {{
      try {{
        const pageRole = 'mc';
        const raw = localStorage.getItem('tt_session');
        const currentFile = window.location.pathname.split('/').pop() || 'mc.html';
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
        const isImpersonating = (sess.role === 'superadmin' && sess.impersonating);
        if (sess.role !== pageRole && !isImpersonating) {{
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

/* MC Pro Hub Layout */
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
  padding: 24px 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}}

.sidebar-pro-badge {{
  font-size: 9.5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 700;
  padding: 0 20px 8px;
}}

.sidebar-menu {{
  padding: 8px 10px;
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

.sidebar-footer {{
  padding: 18px 20px;
  border-top: 1px solid #231b14;
}}

.sidebar-footer-name {{
  font-weight: 700;
  color: #ffffff;
  font-size: 13.5px;
}}

.sidebar-footer-role {{
  font-size: 11.5px;
  color: #8c7b6c;
}}

/* Main Content Area */
.app-main {{
  padding: 34px 42px;
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

/* Metric Cards */
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
}}

/* Content Card */
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
}}

/* Multi-Wedding Table */
.data-table {{
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}}

.data-table th {{
  background: #faf7f2;
  text-align: left;
  padding: 12px 18px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
}}

.data-table td {{
  padding: 16px 18px;
  border-bottom: 1px solid #f2ece3;
}}

.wedding-row {{
  cursor: pointer;
  transition: background 0.15s ease;
}}

.wedding-row:hover td {{
  background: #fbf8f4;
}}

.couple-cell {{
  display: flex;
  align-items: center;
  gap: 12px;
}}

.couple-avatar {{
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f2e9db;
  color: #4a3c30;
  border: 1px solid #decbb5;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}}

.progress-cell-bar {{
  width: 120px;
  height: 6px;
  background: #ebe4d8;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}}

.progress-cell-fill {{
  height: 100%;
  background: var(--ink);
  border-radius: 3px;
}}

/* Run Sheet Styles */
.runsheet-item {{
  display: grid;
  grid-template-columns: 36px 90px 1fr 80px;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f2ece3;
  background: #ffffff;
}}

.runsheet-item.done {{
  background: #faf7f2;
}}

.runsheet-item.done input[type="text"] {{
  text-decoration: line-through;
  color: #9c8c7c;
}}

/* Calendar Grid */
.calendar-grid {{
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 14px;
}}

.calendar-header-day {{
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--muted);
  padding: 8px 0;
}}

.calendar-day-cell {{
  min-height: 90px;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}}

.calendar-day-cell:hover {{
  border-color: var(--gold);
  background: #fdfbf8;
}}

.calendar-day-num {{
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 4px;
}}

.calendar-event-pill {{
  background: #17120f;
  color: #dfc194;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 600;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}}

/* Drawer for Client Contacts */
.slide-drawer-backdrop {{
  position: fixed;
  inset: 0;
  background: rgba(18, 14, 11, 0.5);
  backdrop-filter: blur(2px);
  z-index: 2500;
  display: flex;
  justify-content: flex-end;
}}

.slide-drawer {{
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  height: 100%;
  box-shadow: -8px 0 30px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  animation: slideDrawerIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}}

@keyframes slideDrawerIn {{
  from {{ transform: translateX(100%); }}
  to {{ transform: translateX(0); }}
}}

.drawer-header {{
  padding: 20px 24px;
  background: #15110e;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.drawer-body {{
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}}

/* Responsive Breakpoints */
@media (max-width: 1024px) {{
  .metrics-grid {{ grid-template-columns: repeat(2, 1fr); }}
}}

@media (max-width: 768px) {{
  .app-shell {{ grid-template-columns: 1fr; }}
  .app-sidebar {{ display: flex; flex-direction: row; overflow-x: auto; }}
  .sidebar-brand, .sidebar-pro-badge, .sidebar-footer {{ display: none; }}
  .sidebar-menu {{ flex-direction: row; padding: 6px; }}
  .sidebar-btn {{ padding: 8px 12px; white-space: nowrap; border-left: none; border-bottom: 3px solid transparent; }}
  .sidebar-btn.active {{ border-left: none; border-bottom-color: var(--gold); }}
  .app-main {{ padding: 20px 16px; }}
  .runsheet-item {{ grid-template-columns: 24px 70px 1fr 60px; }}
}}

@media print {{
  .tt-demobar, .app-sidebar, .page-header, .metrics-grid, .no-print {{ display: none !important; }}
  .app-shell {{ display: block; }}
  .app-main {{ padding: 0; }}
  .runsheet-print-title {{ display: block !important; }}
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
      <a href="couple.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'couple', 'couple.html')">Couple Dashboard</a>
      <a href="mc.html" class="tt-demobar-link active" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
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
    <aside class="app-sidebar" aria-label="MC Navigation">
      <div class="sidebar-brand">
        <span class="tt-mark">T</span>
        <span style="font-family:var(--font-heading);font-size:19px;color:#fff;">Tap <span class="gold-amp">&amp;</span> Toast</span>
      </div>
      <div class="sidebar-pro-badge">PRO ACCOUNT</div>

      <nav class="sidebar-menu">
        <button type="button" class="sidebar-btn active" data-tab="weddings" onclick="switchMCTab('weddings')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="12" r="6"></circle><circle cx="15" cy="12" r="6"></circle></svg>
          All Weddings
        </button>
        <button type="button" class="sidebar-btn" data-tab="calendar" onclick="switchMCTab('calendar')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Calendar
        </button>
        <button type="button" class="sidebar-btn" data-tab="clients" onclick="switchMCTab('clients')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Clients
        </button>
        <button type="button" class="sidebar-btn" data-tab="invoicing" onclick="switchMCTab('invoicing')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Invoicing
        </button>
        <button type="button" class="sidebar-btn" data-tab="team" onclick="switchMCTab('team')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          Team
        </button>
        <button type="button" class="sidebar-btn" data-tab="settings" onclick="switchMCTab('settings')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </button>
      </nav>

      <div class="sidebar-footer">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#8c7b6c;margin-bottom:2px;">Signed in as</div>
        <div class="sidebar-footer-name" id="sidebar-user-name">Robert Galati</div>
        <div class="sidebar-footer-role" id="sidebar-user-role">Master of Ceremonies</div>
        <button type="button" class="btn btn-outline btn-xs" onclick="handleLogout()" style="width:100%;margin-top:8px;font-size:11px;padding:5px 8px;border-color:#3d3126;color:#d9c9b8;">Logout</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="app-main">

      <!-- TAB 1: ALL WEDDINGS -->
      <section id="pane-weddings" class="tab-pane active" aria-labelledby="tab-weddings">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">PRO ACCOUNT</div>
            <h1 class="header-title">Your Weddings</h1>
          </div>
          <div>
            <button type="button" class="btn btn-primary" onclick="openNewWeddingWizard()">+ New Wedding</button>
          </div>
        </div>

        <!-- 4 Metric Cards matching 6-mc-multi-wedding-web.png -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-number">7</div>
            <div class="metric-label">Active weddings</div>
          </div>
          <div class="metric-card">
            <div class="metric-number">3</div>
            <div class="metric-label">This month</div>
          </div>
          <div class="metric-card">
            <div class="metric-number">642</div>
            <div class="metric-label">Guests managed</div>
          </div>
          <div class="metric-card">
            <div class="metric-number">89%</div>
            <div class="metric-label">Avg. RSVP rate</div>
          </div>
        </div>

        <!-- Multi-Wedding Table -->
        <div class="content-card" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Couple</th>
                <th>Date</th>
                <th>Guests</th>
                <th>RSVP Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="mc-weddings-tbody">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- WEDDING DETAIL VIEW (inside MC Hub) -->
      <section id="pane-wedding-detail" class="tab-pane" style="display:none;" aria-labelledby="tab-wedding-detail">
        <div class="page-header">
          <div>
            <button type="button" class="btn btn-outline btn-sm no-print" style="margin-bottom:10px;" onclick="closeWeddingDetail()">&larr; Back to All Weddings</button>
            <div class="header-eyebrow" id="detail-eyebrow">WEDDING DETAIL</div>
            <h1 class="header-title" id="detail-couple-title">Sophie &amp; James</h1>
            <div style="font-size:13.5px;color:var(--muted);margin-top:4px;" id="detail-venue-meta">
              Saturday, 14 Nov 2026 · Fernwood Estate, Southern Highlands
            </div>
          </div>
          <div class="no-print" style="display:flex;gap:8px;">
            <button type="button" class="btn btn-gold btn-sm" onclick="window.print()">🖨️ Print Run Sheet</button>
            <button type="button" class="btn btn-outline btn-sm" onclick="saveRunSheet()">Save Changes</button>
          </div>
        </div>

        <!-- Sub Tabs inside detail view -->
        <div class="no-print" style="display:flex;gap:6px;border-bottom:1px solid var(--line);margin-bottom:20px;">
          <button type="button" id="subtab-runsheet" class="btn btn-sm btn-gold" onclick="switchDetailSubTab('runsheet')">MC Run Sheet</button>
          <button type="button" id="subtab-seating" class="btn btn-sm btn-outline" onclick="switchDetailSubTab('seating')">Seating Floor Plan</button>
          <button type="button" id="subtab-guests" class="btn btn-sm btn-outline" onclick="switchDetailSubTab('guests')">Guest &amp; Catering Summary</button>
          <button type="button" id="subtab-venue" class="btn btn-sm btn-outline" onclick="switchDetailSubTab('venue')">Venue &amp; Travel</button>
        </div>

        <!-- Sub-pane 1: Run Sheet -->
        <div id="subpane-runsheet">
          <div class="content-card">
            <h3 class="content-card-title runsheet-print-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>Operational Run Sheet &amp; Cue Notes</span>
              <button type="button" class="btn btn-outline btn-sm no-print" onclick="addRunSheetRow()">+ Add Item</button>
            </h3>
            <div id="runsheet-list-container">
              <!-- Run sheet rows injected by JS -->
            </div>
          </div>
        </div>

        <!-- Sub-pane 2: Seating Floor Plan (Interactive Visual Builder matching Image 4) -->
        <div id="subpane-seating" style="display:none;">
          <div class="seating-toolbar">
            <div style="display:flex;align-items:center;gap:16px;">
              <strong style="font-family:var(--font-heading);font-size:17px;" id="mc-seating-title">Seating Floor Plan — Sophie &amp; James</strong>
              <div style="background:#281f18;padding:3px;border-radius:4px;display:flex;gap:4px;">
                <button type="button" id="btn-mc-view-floor" class="btn btn-sm btn-gold" onclick="setMCSeatingView('floor')">Floor plan</button>
                <button type="button" id="btn-mc-view-list" class="btn btn-sm btn-outline" style="background:none;color:#dfc194;border:none;" onclick="setMCSeatingView('list')">List view</button>
              </div>
            </div>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-gold btn-sm" onclick="openMCSuggestSeatingModal()">✨ Suggest seating</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="mcAddTableToFloor()">+ Add table</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="mcSaveSeatingAssignments()">Save</button>
            </div>
          </div>

          <!-- Seating Split Area -->
          <div class="seating-split">
            <!-- Floor Canvas -->
            <div class="floorplan-canvas" id="mc-floorplan-canvas">
              <div class="head-table-block">
                <span>HEAD TABLE · 8 SEATS</span>
                <div style="display:flex;gap:8px;" id="mc-head-table-seats">
                  <!-- 8 head seats -->
                </div>
              </div>

              <div class="table-circle-grid" id="mc-tables-container">
                <!-- Tables rendered dynamically -->
              </div>
            </div>

            <!-- List View (hidden by default) -->
            <div id="mc-seating-list-view" style="display:none;padding:24px;overflow-y:auto;background:#fff;grid-column:1/-1;">
              <h3 style="font-family:var(--font-heading);font-size:18px;margin-bottom:14px;">Table Assignment Roster</h3>
              <div id="mc-seating-roster-content"></div>
            </div>

            <!-- Unassigned Panel -->
            <div class="unassigned-panel" id="mc-unassigned-panel">
              <h3 style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:2px;">Unassigned guests</h3>
              <div style="font-size:12px;color:var(--muted);margin-bottom:12px;" id="mc-unassigned-count-label">14 guests still need a table</div>
              <input type="text" id="mc-unassigned-search" class="text-input" style="padding:6px 10px;font-size:12px;margin-bottom:14px;" placeholder="Search guests..." oninput="filterMCUnassignedGuests()">
              <div id="mc-unassigned-guests-list" style="overflow-y:auto;flex:1;">
                <!-- Cards populated by JS -->
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-pane 3: Catering & Dietaries -->
        <div id="subpane-guests" style="display:none;">
          <div class="content-card">
            <h3 class="content-card-title">Catering Breakdown &amp; Special Dietaries</h3>
            <div id="mc-catering-summary"></div>
          </div>
        </div>

        <!-- Sub-pane 4: Venue & Travel -->
        <div id="subpane-venue" style="display:none;">
          <div class="page-header" style="margin-bottom:20px;">
            <div>
              <div class="header-eyebrow">COUPLE LOCATION &amp; LOGISTICS</div>
              <h2 style="font-family:var(--font-heading);font-size:24px;color:var(--ink);margin:2px 0;">Venue &amp; Travel Roster</h2>
              <div style="font-size:13px;color:var(--muted);">
                Venue coordinates, guest parking facility details, shuttle timings and direct navigation for MC &amp; event vendors
              </div>
            </div>
            <div>
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
                <strong id="mc-venue-name">Fernwood Estate, Southern Highlands</strong><br>
                <span id="mc-venue-address">124 Range Road, Mittagong NSW 2575</span><br>
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
              <div style="font-size:13.5px;color:var(--ink);line-height:1.6;margin-bottom:12px;" id="mc-venue-parking">
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
        </div>
      </section>

      <!-- TAB 2: CALENDAR -->
      <section id="pane-calendar" class="tab-pane" aria-labelledby="tab-calendar">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">MC SCHEDULE</div>
            <h1 class="header-title">Wedding Calendar</h1>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="changeCalendarMonth(-1)">&larr; Previous</button>
            <span id="cal-month-title" style="font-family:var(--font-heading);font-size:17px;font-weight:700;padding:6px 12px;">November 2026</span>
            <button type="button" class="btn btn-outline btn-sm" onclick="changeCalendarMonth(1)">Next &rarr;</button>
          </div>
        </div>

        <div class="content-card" style="padding:16px;">
          <div class="calendar-grid" id="calendar-grid-header">
            <div class="calendar-header-day">SUN</div>
            <div class="calendar-header-day">MON</div>
            <div class="calendar-header-day">TUE</div>
            <div class="calendar-header-day">WED</div>
            <div class="calendar-header-day">THU</div>
            <div class="calendar-header-day">FRI</div>
            <div class="calendar-header-day">SAT</div>
          </div>
          <div class="calendar-grid" id="calendar-grid-days">
            <!-- Day cells populated by JS -->
          </div>
        </div>
      </section>

      <!-- TAB 3: CLIENTS -->
      <section id="pane-clients" class="tab-pane" aria-labelledby="tab-clients">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">DIRECTORY</div>
            <h1 class="header-title">Couple Clients</h1>
          </div>
        </div>

        <div class="content-card" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Couple</th>
                <th>Wedding Date</th>
                <th>Venue</th>
                <th>Package Tier</th>
                <th>Deposit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="clients-table-body">
              <!-- Injected by JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 4: INVOICING -->
      <section id="pane-invoicing" class="tab-pane" aria-labelledby="tab-invoicing">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">FINANCIALS</div>
            <h1 class="header-title">Invoicing</h1>
          </div>
          <button type="button" class="btn btn-gold btn-sm" onclick="openNewInvoiceModal()">+ New Invoice</button>
        </div>

        <div class="content-card" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Couple Client</th>
                <th>Issue Date</th>
                <th>Venue</th>
                <th>Amount (AUD)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="invoices-table-body">
              <!-- Injected by JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 5: TEAM -->
      <section id="pane-team" class="tab-pane" aria-labelledby="tab-team">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">STAFF &amp; CREW</div>
            <h1 class="header-title">MC Team &amp; Crew</h1>
          </div>
          <button type="button" class="btn btn-gold btn-sm" onclick="openInviteTeamModal()">+ Invite Member</button>
        </div>

        <div class="metrics-grid" style="grid-template-columns:repeat(3, 1fr);" id="team-cards-container">
          <!-- Injected by JS -->
        </div>
      </section>

      <!-- TAB 6: SETTINGS -->
      <section id="pane-settings" class="tab-pane" aria-labelledby="tab-settings">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">PROFESSIONAL ACCOUNT</div>
            <h1 class="header-title">MC Profile Settings</h1>
          </div>
        </div>

        <div class="content-card" style="max-width:680px;">
          <form onsubmit="handleSaveMCProfile(event)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
              <div class="field-group">
                <label class="field-label">MC Full Name</label>
                <input type="text" id="mcp-name" class="text-input" value="Robert Galati">
              </div>
              <div class="field-group">
                <label class="field-label">Business Name</label>
                <input type="text" id="mcp-biz" class="text-input" value="Robert Galati MC Services">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
              <div class="field-group">
                <label class="field-label">Contact Phone</label>
                <input type="text" id="mcp-phone" class="text-input" value="0418 223 901">
              </div>
              <div class="field-group">
                <label class="field-label">Base Rate (AUD / Event)</label>
                <input type="number" id="mcp-rate" class="text-input" value="1850">
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Bio &amp; Style Introduction</label>
              <textarea id="mcp-bio" class="text-input" rows="3">High-energy, warm, and sophisticated Master of Ceremonies with over 12 years of experience hosting premier luxury weddings across Sydney, Southern Highlands, and Hunter Valley.</textarea>
            </div>

            <button type="submit" class="btn btn-gold" style="padding:12px 24px;">Save Profile</button>
          </form>
        </div>
      </section>

    </main>
  </div>

  <!-- Toast Container -->
  <div id="tt-toast-container" class="tt-toast-container"></div>

  <!-- Client Contact Drawer -->
  <div id="client-drawer-backdrop" class="slide-drawer-backdrop" style="display:none;" aria-hidden="true" onclick="if(event.target===this)closeClientDrawer()">
    <div class="slide-drawer">
      <div class="drawer-header">
        <div>
          <div style="font-size:10px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;">CLIENT FILE</div>
          <h3 style="font-family:var(--font-heading);font-size:20px;color:#fff;" id="drawer-client-name">Sophie &amp; James</h3>
        </div>
        <button type="button" class="tt-modal-close" onclick="closeClientDrawer()">✕</button>
      </div>
      <div class="drawer-body" id="drawer-client-body">
        <!-- Injected by JS -->
      </div>
    </div>
  </div>

  <!-- New Wedding Wizard Modal -->
  <div id="new-wedding-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">New Wedding Booking</div>
        <button type="button" class="tt-modal-close" onclick="closeNewWeddingWizard()">✕</button>
      </div>
      <form onsubmit="handleCreateWedding(event)">
        <div class="tt-modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field-group">
              <label class="field-label">Partner 1</label>
              <input type="text" id="nw-p1" class="text-input" required placeholder="e.g. Liam">
            </div>
            <div class="field-group">
              <label class="field-label">Partner 2</label>
              <input type="text" id="nw-p2" class="text-input" required placeholder="e.g. Olivia">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field-group">
              <label class="field-label">Wedding Date</label>
              <input type="date" id="nw-date" class="text-input" required value="2027-09-18">
            </div>
            <div class="field-group">
              <label class="field-label">Estimated Guests</label>
              <input type="number" id="nw-guests" class="text-input" value="110" min="20">
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Venue</label>
            <input type="text" id="nw-venue" class="text-input" required placeholder="e.g. Bendooley Estate, Berrima">
          </div>
        </div>
        <div class="tt-modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeNewWeddingWizard()">Cancel</button>
          <button type="submit" class="btn btn-gold">Create Booking</button>
        </div>
      </form>
    </div>
  </div>

  <!-- New Invoice Modal -->
  <div id="new-invoice-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Create Invoice</div>
        <button type="button" class="tt-modal-close" onclick="closeNewInvoiceModal()">✕</button>
      </div>
      <form onsubmit="handleCreateInvoice(event)">
        <div class="tt-modal-body">
          <div class="field-group">
            <label class="field-label">Couple Client</label>
            <select id="ni-couple" class="text-input">
              <option value="Sophie &amp; James">Sophie &amp; James (Fernwood Estate)</option>
              <option value="Aisha &amp; Marcus">Aisha &amp; Marcus (Doltone House)</option>
              <option value="Emma &amp; Tom">Emma &amp; Tom (Dunbar House)</option>
              <option value="Katie &amp; Rob">Katie &amp; Rob (Dunbar House)</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Amount in AUD</label>
            <input type="number" id="ni-amount" class="text-input" required value="1850">
          </div>
          <div class="field-group">
            <label class="field-label">Status</label>
            <select id="ni-status" class="text-input">
              <option value="Pending">Pending Payment</option>
              <option value="Paid">Paid</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
        <div class="tt-modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeNewInvoiceModal()">Cancel</button>
          <button type="submit" class="btn btn-gold">Generate Invoice</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Suggest Seating Modal for MC Pro -->
  <div id="mc-suggest-seating-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">AI Seating Suggestion — MC Pro</div>
        <button type="button" class="tt-modal-close" onclick="closeMCSuggestSeatingModal()">✕</button>
      </div>
      <div class="tt-modal-body">
        <p style="font-size:13.5px;color:var(--ink);margin-bottom:16px;">
          Calculated optimal seat pairings for unassigned guests based on remaining table capacities and party relationships:
        </p>
        <div id="mc-suggested-assignments-list" style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:12px;font-size:13px;max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
          <!-- Injected by JS -->
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeMCSuggestSeatingModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="applyMCSuggestedSeating()">Confirm &amp; Apply</button>
      </div>
    </div>
  </div>

  <!-- Seat Guest to Table Modal for MC Pro -->
  <div id="mc-seat-guest-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title" id="mc-sg-modal-title">Assign Guest to Table</div>
        <button type="button" class="tt-modal-close" onclick="closeMCSeatGuestModal()">✕</button>
      </div>
      <div class="tt-modal-body">
        <input type="hidden" id="mc-sg-preset-guest-id" value="">
        <input type="hidden" id="mc-sg-preset-table-id" value="">
        <div class="field-group" id="mc-sg-table-select-group">
          <label class="field-label">Target Table</label>
          <select id="mc-sg-table-select" class="text-input">
            <!-- Injected by JS -->
          </select>
        </div>
        <div class="field-group" id="mc-sg-guest-select-group">
          <label class="field-label">Choose Confirmed Guest</label>
          <select id="mc-sg-guest-select" class="text-input">
            <!-- Injected by JS with unassigned confirmed guests -->
          </select>
        </div>
        <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:10px 12px;font-size:12px;color:#786858;">
          Assigned guests will occupy the chosen seat or the next available slot on the selected table.
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeMCSeatGuestModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="confirmMCSeatGuestModal()">Confirm Seating</button>
      </div>
    </div>
  </div>

  <script>
{shared_js}
{auth_js}

/* MC Hub Application Logic */
let calYear = 2026;
let calMonth = 10; // 0-indexed: 10 is November
let selectedDetailWeddingId = 'w1';

document.addEventListener('DOMContentLoaded', () => {{
  document.documentElement.classList.remove('tt-unauthenticated');
  if (!initAuthGuard('mc')) return;
  initMCHub();
  window.addEventListener('storage', () => {{
    if (initAuthGuard('mc')) initMCHub();
  }});
  window.addEventListener('tt_state_changed', () => {{
    if (initAuthGuard('mc')) initMCHub();
  }});
}});

function initMCHub() {{
  if (!getSession()) return;
  renderWeddingsTable();
  renderCalendar();
  renderClients();
  renderInvoices();
  renderTeam();
}}

function switchMCTab(tabKey) {{
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

function renderWeddingsTable() {{
  const tbody = document.getElementById('mc-weddings-tbody');
  if (!tbody) return;
  const state = loadState();
  const weddings = state.weddings || [];

  tbody.innerHTML = weddings.map((w, idx) => {{
    const daysOut = getDaysToGo(w.date);
    let confirmedCount = w.confirmed || 0;
    
    // For Sophie & James, calculate exact confirmed count from shared guests
    if (w.id === 'w1') {{
      const metrics = getGuestMetrics(state);
      confirmedCount = metrics.confirmedCount;
    }}
    
    const pct = Math.min(100, Math.round((confirmedCount / w.invited) * 100));

    let pillClass = 'warm';
    if (w.status === 'On track') pillClass = 'green';
    if (w.status === 'Planning') pillClass = 'lavender';

    const initials = w.couple.split('&').map(s => s.trim()[0]).join('&');

    return `
      <tr class="wedding-row" onclick="openWeddingDetail('${{w.id}}')">
        <td>
          <div class="couple-cell">
            <div class="couple-avatar">${{initials}}</div>
            <div>
              <strong style="font-size:14px;color:var(--ink);">${{escapeHtml(w.couple)}}</strong><br>
              <small style="color:var(--muted);">${{escapeHtml(w.venue.split(',')[0])}}</small>
            </div>
          </div>
        </td>
        <td>${{escapeHtml(w.dateDisplay)}}</td>
        <td>${{w.invited}} invited</td>
        <td>
          <div class="progress-cell-bar">
            <div class="progress-cell-fill" style="width: ${{pct}}%;"></div>
          </div>
          <small style="color:var(--muted);">${{confirmedCount}} confirmed · ${{daysOut}} days out</small>
        </td>
        <td><span class="tt-pill ${{pillClass}}">${{w.status}}</span></td>
      </tr>
    `;
  }}).join('');
}}

/* Wedding Detail Inside MC Hub */
function openWeddingDetail(weddingId) {{
  selectedDetailWeddingId = weddingId;
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === weddingId) || state.weddings[0];

  document.getElementById('detail-couple-title').innerHTML = wedding.couple.replace('&', '<span class="gold-amp">&amp;</span>');
  document.getElementById('detail-venue-meta').textContent = `Saturday, ${{wedding.dateDisplay}} · ${{wedding.venue}}`;
  if (document.getElementById('mc-seating-title')) {{
    document.getElementById('mc-seating-title').textContent = `Seating Floor Plan — ${{wedding.couple}}`;
  }}

  document.querySelectorAll('.tab-pane').forEach(p => {{
    p.classList.remove('active');
    p.style.display = 'none';
  }});

  const detailPane = document.getElementById('pane-wedding-detail');
  detailPane.classList.add('active');
  detailPane.style.display = 'block';

  renderRunSheet();
  renderMCSeatingFloor();
  renderDetailCateringSummary();
  renderMCVenueDetails();
}}

function closeWeddingDetail() {{
  document.getElementById('pane-wedding-detail').style.display = 'none';
  switchMCTab('weddings');
}}

function switchDetailSubTab(subKey) {{
  document.getElementById('subtab-runsheet').className = subKey === 'runsheet' ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('subtab-seating').className = subKey === 'seating' ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('subtab-guests').className = subKey === 'guests' ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('subtab-venue').className = subKey === 'venue' ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';

  document.getElementById('subpane-runsheet').style.display = subKey === 'runsheet' ? 'block' : 'none';
  document.getElementById('subpane-seating').style.display = subKey === 'seating' ? 'block' : 'none';
  document.getElementById('subpane-guests').style.display = subKey === 'guests' ? 'block' : 'none';
  document.getElementById('subpane-venue').style.display = subKey === 'venue' ? 'block' : 'none';

  if (subKey === 'seating') renderMCSeatingFloor();
  if (subKey === 'guests') renderDetailCateringSummary();
  if (subKey === 'venue') renderMCVenueDetails();
}}

function renderRunSheet() {{
  const container = document.getElementById('runsheet-list-container');
  if (!container) return;
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId) || state.weddings[0];
  const items = wedding.runSheet || [];

  container.innerHTML = items.map((item, idx) => `
    <div class="runsheet-item ${{item.done ? 'done' : ''}}" id="rs-row-${{idx}}">
      <input type="checkbox" class="checklist-input" ${{item.done ? 'checked' : ''}} onchange="toggleRunSheetDone(${{idx}}, this.checked)">
      <input type="text" class="text-input" style="padding:6px 8px;font-size:12.5px;font-weight:700;" value="${{escapeHtml(item.time)}}" onchange="updateRunSheetTime(${{idx}}, this.value)">
      <input type="text" class="text-input" style="padding:6px 10px;font-size:13px;" value="${{escapeHtml(item.note)}}" onchange="updateRunSheetNote(${{idx}}, this.value)">
      <div style="display:flex;gap:4px;" class="no-print">
        <button type="button" class="btn btn-outline btn-sm" onclick="moveRunSheetItem(${{idx}}, -1)">↑</button>
        <button type="button" class="btn btn-outline btn-sm" onclick="moveRunSheetItem(${{idx}}, 1)">↓</button>
        <button type="button" class="btn btn-outline btn-sm" onclick="deleteRunSheetItem(${{idx}})">✕</button>
      </div>
    </div>
  `).join('');
}}

function toggleRunSheetDone(index, isDone) {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId);
  if (wedding && wedding.runSheet && wedding.runSheet[index]) {{
    wedding.runSheet[index].done = isDone;
    saveState(state);
    renderRunSheet();
  }}
}}

function updateRunSheetTime(index, val) {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId);
  if (wedding && wedding.runSheet && wedding.runSheet[index]) {{
    wedding.runSheet[index].time = val;
    saveState(state);
  }}
}}

function updateRunSheetNote(index, val) {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId);
  if (wedding && wedding.runSheet && wedding.runSheet[index]) {{
    wedding.runSheet[index].note = val;
    saveState(state);
  }}
}}

function moveRunSheetItem(index, delta) {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId);
  if (!wedding || !wedding.runSheet) return;
  const target = index + delta;
  if (target < 0 || target >= wedding.runSheet.length) return;
  
  const temp = wedding.runSheet[index];
  wedding.runSheet[index] = wedding.runSheet[target];
  wedding.runSheet[target] = temp;
  
  saveState(state);
  renderRunSheet();
}}

function deleteRunSheetItem(index) {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId);
  if (wedding && wedding.runSheet) {{
    wedding.runSheet.splice(index, 1);
    saveState(state);
    renderRunSheet();
    showToast('Run sheet item deleted', 'info');
  }}
}}

function addRunSheetRow() {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId);
  if (!wedding) return;
  if (!wedding.runSheet) wedding.runSheet = [];
  
  wedding.runSheet.push({{
    id: 'rs_' + Date.now(),
    time: '18:00',
    note: 'Introduce couple for speeches',
    done: false
  }});
  
  saveState(state);
  renderRunSheet();
  showToast('Added new run sheet cue', 'success');
}}

function saveRunSheet() {{
  const state = loadState();
  logAudit('MC Run Sheet Saved', 'Robert Galati', `Saved run sheet timings for ${{state.weddings.find(w => w.id === selectedDetailWeddingId)?.couple}}`, 'Run Sheet');
  saveState(state);
  showToast('Run sheet successfully saved to wedding profile!', 'success');
}}

/* Interactive Seating Floor Plan Suite for MC Pro */
let mcSeatingViewMode = 'floor';
let mcActiveSeatTarget = null;

function setMCSeatingView(mode) {{
  mcSeatingViewMode = mode;
  const isFloor = mode === 'floor';
  document.getElementById('btn-mc-view-floor').className = isFloor ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('btn-mc-view-list').className = !isFloor ? 'btn btn-sm btn-gold' : 'btn btn-sm btn-outline';
  document.getElementById('mc-floorplan-canvas').style.display = isFloor ? 'flex' : 'none';
  document.getElementById('mc-unassigned-panel').style.display = isFloor ? 'flex' : 'none';
  document.getElementById('mc-seating-list-view').style.display = !isFloor ? 'block' : 'none';
  if (!isFloor) renderMCSeatingRoster();
}}

function renderMCSeatingFloor() {{
  const state = loadState();
  const tablesContainer = document.getElementById('mc-tables-container');
  const headSeats = document.getElementById('mc-head-table-seats');
  const unassignedList = document.getElementById('mc-unassigned-guests-list');
  if (!tablesContainer || !headSeats || !unassignedList) return;

  // Head Table 8 seats
  const headGuests = state.guests.filter(g => g.tableId === 'head');
  let headHtml = '';
  for (let i = 0; i < 8; i++) {{
    const g = headGuests.find(x => x.seatIndex === i);
    headHtml += `
      <div class="seat-dot ${{g ? '' : 'empty'}}" style="position:static;" title="${{g ? g.name : 'Empty seat'}}" onclick="handleMCSeatClick('head', ${{i}})">
        ${{g ? (g.initials || g.name.substring(0,2).toUpperCase()) : '+'}}
      </div>
    `;
  }}
  headSeats.innerHTML = headHtml;

  // Render Round Tables
  const roundTables = state.tables.filter(t => !t.isHead);
  tablesContainer.innerHTML = roundTables.map(t => {{
    const seated = state.guests.filter(g => g.tableId === t.id);
    return `
      <div class="round-table" id="mc-tbl-${{t.id}}">
        <span class="round-table-title">${{escapeHtml(t.name)}}</span>
        <span class="round-table-count">${{seated.length}}/${{t.capacity}}</span>
        ${{renderMCSeatDots(t)}}
      </div>
    `;
  }}).join('');

  // Render Unassigned Guests Panel
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  const countLabel = document.getElementById('mc-unassigned-count-label');
  if (countLabel) countLabel.textContent = `${{unassigned.length}} guests still need a table`;

  unassignedList.innerHTML = unassigned.map(g => `
    <div class="guest-card-draggable" id="mc-guest-${{g.id}}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:24px;height:24px;border-radius:50%;background:#e8ded0;display:grid;place-items:center;font-size:10px;font-weight:700;">
            ${{g.initials || g.name.substring(0,2).toUpperCase()}}
          </div>
          <div>
            <strong style="font-size:13px;color:var(--ink);">${{escapeHtml(g.name)}}</strong>
            <div style="font-size:11px;color:var(--muted);">${{g.guestCount > 1 ? '+' + (g.guestCount - 1) + ' guest' : 'No plus-one'}}</div>
          </div>
        </div>
        ${{g.dietary && g.dietary !== 'None' ? `<span class="tt-pill warm" style="font-size:9.5px;padding:2px 6px;">${{escapeHtml(g.dietary)}}</span>` : ''}}
      </div>
      <div style="display:flex;gap:6px;">
        <select class="text-input" style="padding:4px 6px;font-size:11.5px;flex:1;" onchange="mcAssignGuestToSeat('${{g.id}}', this.value, 0)">
          <option value="">Seat at Table...</option>
          <option value="head">Head Table</option>
          ${{roundTables.map(tbl => `<option value="${{tbl.id}}">${{tbl.name}} (${{state.guests.filter(x => x.tableId === tbl.id).length}}/${{tbl.capacity}})</option>`).join('')}}
        </select>
        <button type="button" class="btn btn-gold btn-xs" style="padding:4px 8px;" onclick="mcAutoAssignGuest('${{g.id}}')">Auto</button>
      </div>
    </div>
  `).join('');
}}

function renderMCSeatDots(table) {{
  const state = loadState();
  const seated = state.guests.filter(g => g.tableId === table.id);
  const total = table.capacity || 8;
  const radius = 48;
  const centerX = 59;
  const centerY = 59;
  let dots = '';

  for (let i = 0; i < total; i++) {{
    const angle = (i * (360 / total) - 90) * (Math.PI / 180);
    const x = Math.round(centerX + radius * Math.cos(angle) - 13.5);
    const y = Math.round(centerY + radius * Math.sin(angle) - 13.5);
    const guest = seated.find(g => g.seatIndex === i);

    dots += `
      <div class="seat-dot ${{guest ? '' : 'empty'}}" style="left:${{x}}px;top:${{y}}px;" title="${{guest ? guest.name : 'Seat ' + (i+1) + ' (Empty)'}}" onclick="handleMCSeatClick('${{table.id}}', ${{i}})">
        ${{guest ? (guest.initials || guest.name.substring(0,2).toUpperCase()) : '+'}}
      </div>
    `;
  }}
  return dots;
}}

function handleMCSeatClick(tableId, seatIndex) {{
  const state = loadState();
  const current = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
  if (current) {{
    if (confirm(`Remove ${{current.name}} from this seat?`)) {{
      current.tableId = null;
      current.seatIndex = null;
      logAudit('MC Seating Updated', 'Robert Galati', `Unseated ${{current.name}}`, 'Seating');
      saveState(state);
      renderMCSeatingFloor();
      showToast(`Removed ${{current.name}} from seat`, 'info');
    }}
  }} else {{
    openMCSeatGuestModal(tableId, seatIndex);
  }}
}}

function openMCSeatGuestModal(tableId, seatIndex) {{
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  const select = document.getElementById('mc-sg-guest-select');
  const tblSelect = document.getElementById('mc-sg-table-select');
  if (!select || !tblSelect) return;

  mcActiveSeatTarget = {{ tableId, seatIndex }};
  document.getElementById('mc-sg-preset-guest-id').value = '';
  document.getElementById('mc-sg-preset-table-id').value = tableId;

  tblSelect.innerHTML = state.tables.map(t => `
    <option value="${{t.id}}" ${{t.id === tableId ? 'selected' : ''}}>${{t.name}} (${{state.guests.filter(g => g.tableId === t.id).length}}/${{t.capacity}})</option>
  `).join('');

  if (unassigned.length === 0) {{
    select.innerHTML = '<option value="">No unassigned confirmed guests remaining</option>';
  }} else {{
    select.innerHTML = unassigned.map(g => `
      <option value="${{g.id}}">${{escapeHtml(g.name)}} ${{g.dietary ? '(' + g.dietary + ')' : ''}}</option>
    `).join('');
  }}

  document.getElementById('mc-seat-guest-modal').style.display = 'flex';
  document.getElementById('mc-seat-guest-modal').setAttribute('aria-hidden', 'false');
}}

function closeMCSeatGuestModal() {{
  document.getElementById('mc-seat-guest-modal').style.display = 'none';
  document.getElementById('mc-seat-guest-modal').setAttribute('aria-hidden', 'true');
  mcActiveSeatTarget = null;
}}

function confirmMCSeatGuestModal() {{
  const guestId = document.getElementById('mc-sg-guest-select').value;
  const tableId = document.getElementById('mc-sg-table-select').value;
  if (!guestId || !tableId) {{
    closeMCSeatGuestModal();
    return;
  }}

  const seatIndex = (mcActiveSeatTarget && mcActiveSeatTarget.tableId === tableId) ? mcActiveSeatTarget.seatIndex : 0;
  closeMCSeatGuestModal();
  mcAssignGuestToSeat(guestId, tableId, seatIndex);
}}

function mcAutoAssignGuest(guestId) {{
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;

  for (const tbl of state.tables) {{
    const seated = state.guests.filter(g => g.tableId === tbl.id);
    if (seated.length < tbl.capacity) {{
      for (let s = 0; s < tbl.capacity; s++) {{
        if (!seated.some(x => x.seatIndex === s)) {{
          mcAssignGuestToSeat(guestId, tbl.id, s);
          return;
        }}
      }}
    }}
  }}
  showToast('All tables are currently at maximum capacity. Add a new table first.', 'error');
}}

function mcAssignGuestToSeat(guestId, tableId, seatIndex) {{
  if (!tableId) return;
  const state = loadState();
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;

  const existingOccupant = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
  if (existingOccupant && existingOccupant.id !== guestId) {{
    existingOccupant.tableId = null;
    existingOccupant.seatIndex = null;
  }}

  guest.tableId = tableId;
  guest.seatIndex = seatIndex;

  const tableObj = state.tables.find(t => t.id === tableId);
  logAudit('MC Seating Updated', 'Robert Galati', `Seated ${{guest.name}} at ${{tableObj ? tableObj.name : tableId}}, Seat ${{seatIndex + 1}}`, 'Seating');
  saveState(state);
  renderMCSeatingFloor();
  showToast(`Seated ${{guest.name}} at ${{tableObj ? tableObj.name : 'Table'}}, Seat ${{seatIndex + 1}}`, 'success');
}}

function filterMCUnassignedGuests() {{
  const q = (document.getElementById('mc-unassigned-search')?.value || '').toLowerCase();
  document.querySelectorAll('#mc-unassigned-guests-list .guest-card-draggable').forEach(el => {{
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  }});
}}

function mcAddTableToFloor() {{
  const state = loadState();
  const currentCount = state.tables.filter(t => !t.isHead).length;
  const newTable = {{
    id: 'table_' + (currentCount + 1),
    name: `Table ${{currentCount + 1}}`,
    capacity: 8,
    isHead: false
  }};
  state.tables.push(newTable);
  logAudit('MC Table Added', 'Robert Galati', `Added ${{newTable.name}} (8 capacity)`, 'Seating');
  saveState(state);
  renderMCSeatingFloor();
  showToast(`Added ${{newTable.name}} (8 seats)`, 'success');
}}

function openMCSuggestSeatingModal() {{
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  const container = document.getElementById('mc-suggested-assignments-list');
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

  document.getElementById('mc-suggest-seating-modal').style.display = 'flex';
  document.getElementById('mc-suggest-seating-modal').setAttribute('aria-hidden', 'false');
}}

function closeMCSuggestSeatingModal() {{
  document.getElementById('mc-suggest-seating-modal').style.display = 'none';
  document.getElementById('mc-suggest-seating-modal').setAttribute('aria-hidden', 'true');
}}

function applyMCSuggestedSeating() {{
  closeMCSuggestSeatingModal();
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
  
  unassigned.forEach((g, idx) => {{
    const targetTableId = 'table_' + Math.min(6, 1 + Math.floor(idx / 3));
    g.tableId = targetTableId;
    g.seatIndex = idx % 8;
  }});

  logAudit('AI Seating Applied', 'Robert Galati', `Auto-assigned ${{unassigned.length}} guests`, 'Seating');
  saveState(state);
  renderMCSeatingFloor();
  showToast(`Applied seating suggestions for ${{unassigned.length}} guests!`, 'success');
}}

function mcSaveSeatingAssignments() {{
  const state = loadState();
  saveState(state);
  showToast('Seating plan saved successfully!', 'success');
}}

function renderMCSeatingRoster() {{
  const container = document.getElementById('mc-seating-roster-content');
  if (!container) return;
  const state = loadState();
  const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;background:#fbf8f3;padding:12px 16px;border-radius:6px;border:1px solid var(--line);">
      <div>
        <strong style="color:var(--ink);">Unassigned Confirmed Guests:</strong>
        <span style="color:var(--gold-hover);font-weight:700;margin-left:6px;">${{unassigned.length}} guests</span>
      </div>
      <button type="button" class="btn btn-gold btn-sm" onclick="openMCSuggestSeatingModal()">✨ Auto-Seat All Remaining</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:16px;">
  `;

  state.tables.forEach(t => {{
    const seated = state.guests.filter(g => g.tableId === t.id);
    html += `
      <div style="border:1px solid var(--line);border-radius:6px;padding:14px;background:#ffffff;">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;border-bottom:1px solid #f2ece3;padding-bottom:6px;">
          <strong style="color:var(--ink);">${{escapeHtml(t.name)}}</strong>
          <span class="tt-pill ${{seated.length >= t.capacity ? 'warm' : 'green'}}" style="font-size:11px;">
            ${{seated.length}} / ${{t.capacity}} occupied
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${{seated.length === 0 ? '<small style="color:var(--muted);font-style:italic;">No guests seated</small>' : ''}}
          ${{seated.map(g => `
            <div style="display:flex;justify-content:space-between;font-size:12px;background:#fbf9f6;padding:4px 8px;border-radius:4px;">
              <span>Seat ${{(g.seatIndex !== null && g.seatIndex !== undefined) ? g.seatIndex + 1 : '-'}}: <strong>${{escapeHtml(g.name)}}</strong></span>
              <button type="button" style="color:#b23b3b;font-size:11px;cursor:pointer;" onclick="handleMCSeatClick('${{t.id}}', ${{g.seatIndex}})">✕</button>
            </div>
          `).join('')}}
        </div>
      </div>
    `;
  }});

  html += '</div>';
  container.innerHTML = html;
}}

function renderMCVenueDetails() {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === selectedDetailWeddingId) || state.weddings[0];
  if (document.getElementById('mc-venue-name')) {{
    document.getElementById('mc-venue-name').textContent = wedding.venue || 'Fernwood Estate, Southern Highlands';
  }}
  if (document.getElementById('mc-venue-address')) {{
    document.getElementById('mc-venue-address').textContent = wedding.venueAddress || '124 Range Road, Mittagong NSW 2575';
  }}
  if (document.getElementById('mc-venue-parking')) {{
    document.getElementById('mc-venue-parking').textContent = wedding.parking || 'Complimentary on-site guest parking is available at the Main Lawn entrance.';
  }}
}}

function renderDetailCateringSummary() {{
  const container = document.getElementById('mc-catering-summary');
  if (!container) return;
  const state = loadState();

  const confirmedGuests = state.guests.filter(g => g.rsvpStatus === 'confirmed');
  const counts = {{
    'Vegetarian': confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegetarian')).length,
    'Gluten-Free': confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('gluten')).length,
    'Nut Allergy': confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('nut')).length,
    'Vegan': confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegan')).length
  }};

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:14px;margin-bottom:18px;">
      ${{Object.entries(counts).map(([k, v]) => `
        <div class="metric-card" style="padding:14px;">
          <div class="metric-number">${{v}}</div>
          <div class="metric-label">${{k}} meals</div>
        </div>
      `).join('')}}
    </div>
    <div style="font-size:13px;color:var(--muted);">
      Total Headcount: ${{confirmedGuests.reduce((sum, g) => sum + (g.guestCount || 1), 0)}} confirmed covers.
    </div>
  `;
}}

/* Calendar Logic */
function renderCalendar() {{
  const grid = document.getElementById('calendar-grid-days');
  const title = document.getElementById('cal-month-title');
  if (!grid || !title) return;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  title.textContent = `${{monthNames[calMonth]}} ${{calYear}}`;

  const state = loadState();
  const weddings = state.weddings || [];

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();

  let cellsHtml = '';
  for (let i = 0; i < firstDay; i++) {{
    cellsHtml += `<div class="calendar-day-cell" style="background:#faf8f5;opacity:0.4;"></div>`;
  }}

  for (let d = 1; d <= totalDays; d++) {{
    const dayDate = new Date(calYear, calMonth, d);
    const dayStr = `${{d}} ${{monthNames[calMonth].substring(0, 3)}} ${{calYear}}`;
    
    // Check if any wedding on this date
    const matchedWeddings = weddings.filter(w => {{
      const wd = new Date(w.date);
      return wd.getFullYear() === calYear && wd.getMonth() === calMonth && wd.getDate() === d;
    }});

    const eventHtml = matchedWeddings.map(mw => `
      <div class="calendar-event-pill" onclick="event.stopPropagation();openWeddingDetail('${{mw.id}}')">
        💍 ${{escapeHtml(mw.couple.split('&')[0])}}
      </div>
    `).join('');

    cellsHtml += `
      <div class="calendar-day-cell" onclick="handleDayClick('${{dayStr}}')">
        <div class="calendar-day-num">${{d}}</div>
        ${{eventHtml}}
      </div>
    `;
  }}

  grid.innerHTML = cellsHtml;
}}

function changeCalendarMonth(delta) {{
  calMonth += delta;
  if (calMonth < 0) {{ calMonth = 11; calYear--; }}
  if (calMonth > 11) {{ calMonth = 0; calYear++; }}
  renderCalendar();
}}

function handleDayClick(dateStr) {{
  showToast(`MC Calendar selected: ${{dateStr}}`, 'info');
}}

/* Clients Directory */
function renderClients() {{
  const tbody = document.getElementById('clients-table-body');
  if (!tbody) return;
  const state = loadState();
  const clients = state.clients || [];

  tbody.innerHTML = clients.map(c => `
    <tr>
      <td><strong>${{escapeHtml(c.couple)}}</strong></td>
      <td>${{escapeHtml(c.weddingDate)}}</td>
      <td>${{escapeHtml(c.venue)}}</td>
      <td><span class="tt-pill warm">${{escapeHtml(c.tier)}}</span></td>
      <td>${{escapeHtml(c.deposit)}}</td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="openClientDrawer('${{c.id}}')">View Contact</button>
      </td>
    </tr>
  `).join('');
}}

function openClientDrawer(clientId) {{
  const state = loadState();
  const client = (state.clients || []).find(c => c.id === clientId) || state.clients[0];
  if (!client) return;

  document.getElementById('drawer-client-name').textContent = client.couple;
  document.getElementById('drawer-client-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label class="field-label">Wedding Date</label>
        <div style="font-weight:700;">${{escapeHtml(client.weddingDate)}}</div>
      </div>
      <div>
        <label class="field-label">Venue Location</label>
        <div>${{escapeHtml(client.venue)}}</div>
      </div>
      <div>
        <label class="field-label">Primary Contact Phone</label>
        <div><a href="tel:${{escapeHtml(client.phone)}}" style="color:var(--gold-hover);font-weight:600;">${{escapeHtml(client.phone)}}</a></div>
      </div>
      <div>
        <label class="field-label">Email</label>
        <div><a href="mailto:${{escapeHtml(client.email)}}" style="color:var(--gold-hover);font-weight:600;">${{escapeHtml(client.email)}}</a></div>
      </div>
      <div>
        <label class="field-label">Contract &amp; Package Tier</label>
        <div>${{escapeHtml(client.tier)}} (${{escapeHtml(client.deposit)}})</div>
      </div>
      <div>
        <label class="field-label">MC Operational Notes</label>
        <p style="background:#faf7f2;padding:12px;border-radius:6px;font-size:13px;border:1px solid var(--line);">${{escapeHtml(client.notes)}}</p>
      </div>
      <div style="display:flex;gap:10px;margin-top:10px;">
        <button type="button" class="btn btn-gold btn-block" onclick="showToast('Initiating mock call to ' + '${{escapeHtml(client.couple)}}', 'info')">Call Client</button>
      </div>
    </div>
  `;

  document.getElementById('client-drawer-backdrop').style.display = 'flex';
  document.getElementById('client-drawer-backdrop').setAttribute('aria-hidden', 'false');
}}

function closeClientDrawer() {{
  document.getElementById('client-drawer-backdrop').style.display = 'none';
  document.getElementById('client-drawer-backdrop').setAttribute('aria-hidden', 'true');
}}

/* Invoicing */
function renderInvoices() {{
  const tbody = document.getElementById('invoices-table-body');
  if (!tbody) return;
  const state = loadState();
  const invoices = state.invoices || [];

  tbody.innerHTML = invoices.map((inv, idx) => `
    <tr>
      <td><strong>${{escapeHtml(inv.id)}}</strong></td>
      <td>${{escapeHtml(inv.couple)}}</td>
      <td>${{escapeHtml(inv.date)}}</td>
      <td>${{escapeHtml(inv.venue)}}</td>
      <td><strong>${{formatAUD(inv.amount)}}</strong></td>
      <td>
        <span class="tt-pill ${{inv.status === 'Paid' ? 'green' : inv.status === 'Pending' ? 'warm' : 'lavender'}}">
          ${{escapeHtml(inv.status)}}
        </span>
      </td>
      <td>
        ${{inv.status !== 'Paid' ? `<button type="button" class="btn btn-outline btn-sm" onclick="markInvoicePaid('${{inv.id}}')">Mark Paid</button>` : '<span style="color:var(--muted);font-size:12px;">Settled</span>'}}
      </td>
    </tr>
  `).join('');
}}

function markInvoicePaid(invoiceId) {{
  const state = loadState();
  const inv = (state.invoices || []).find(i => i.id === invoiceId);
  if (inv) {{
    inv.status = 'Paid';
    logAudit('Invoice Paid', 'Robert Galati', `Marked invoice ${{inv.id}} (${{formatAUD(inv.amount)}}) as Paid`, 'General');
    saveState(state);
    renderInvoices();
    showToast(`Invoice ${{inv.id}} marked as Paid!`, 'success');
  }}
}}

function openNewInvoiceModal() {{
  document.getElementById('new-invoice-modal').style.display = 'flex';
  document.getElementById('new-invoice-modal').setAttribute('aria-hidden', 'false');
}}

function closeNewInvoiceModal() {{
  document.getElementById('new-invoice-modal').style.display = 'none';
  document.getElementById('new-invoice-modal').setAttribute('aria-hidden', 'true');
}}

function handleCreateInvoice(e) {{
  e.preventDefault();
  const couple = document.getElementById('ni-couple').value;
  const amt = parseInt(document.getElementById('ni-amount').value, 10) || 1850;
  const status = document.getElementById('ni-status').value;

  closeNewInvoiceModal();
  const state = loadState();
  if (!state.invoices) state.invoices = [];
  
  const newInv = {{
    id: 'INV-' + (1080 + state.invoices.length + 1),
    couple: couple,
    date: 'Today',
    venue: couple.includes('Sophie') ? 'Fernwood Estate' : 'Dunbar House',
    amount: amt,
    status: status
  }};

  state.invoices.unshift(newInv);
  logAudit('Invoice Generated', 'Robert Galati', `Created invoice ${{newInv.id}} for ${{couple}}`, 'General');
  saveState(state);
  renderInvoices();
  showToast(`Generated invoice ${{newInv.id}}!`, 'success');
}}

/* Team */
function renderTeam() {{
  const container = document.getElementById('team-cards-container');
  if (!container) return;
  const state = loadState();
  const team = state.team || [];

  container.innerHTML = team.map(m => `
    <div class="metric-card">
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--ink);">${{escapeHtml(m.name)}}</div>
        <div style="font-size:12.5px;color:var(--gold-hover);font-weight:600;margin-bottom:8px;">${{escapeHtml(m.role)}}</div>
        <div style="font-size:12px;color:var(--muted);">${{escapeHtml(m.email)}}</div>
        <div style="font-size:12px;color:var(--muted);">${{escapeHtml(m.phone)}}</div>
      </div>
      <div style="margin-top:14px;">
        <span class="tt-pill green">${{escapeHtml(m.status)}}</span>
      </div>
    </div>
  `).join('');
}}

function openInviteTeamModal() {{
  showToast('Invitation dispatched to team collaborator via email', 'success');
}}

/* New Wedding Wizard */
function openNewWeddingWizard() {{
  document.getElementById('new-wedding-modal').style.display = 'flex';
  document.getElementById('new-wedding-modal').setAttribute('aria-hidden', 'false');
}}

function closeNewWeddingWizard() {{
  document.getElementById('new-wedding-modal').style.display = 'none';
  document.getElementById('new-wedding-modal').setAttribute('aria-hidden', 'true');
}}

function handleCreateWedding(e) {{
  e.preventDefault();
  const p1 = document.getElementById('nw-p1').value.trim();
  const p2 = document.getElementById('nw-p2').value.trim();
  const dt = document.getElementById('nw-date').value;
  const guests = parseInt(document.getElementById('nw-guests').value, 10) || 100;
  const venue = document.getElementById('nw-venue').value.trim();

  closeNewWeddingWizard();
  const state = loadState();

  const d = new Date(dt);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateDisplay = `${{d.getDate()}} ${{monthNames[d.getMonth()]}} ${{d.getFullYear()}}`;

  const newW = {{
    id: 'w_' + Date.now(),
    couple: `${{p1}} & ${{p2}}`,
    partner1: p1,
    partner2: p2,
    date: dt + 'T15:00:00',
    dateDisplay: dateDisplay,
    timeDisplay: '3:00 PM',
    venue: venue,
    venueAddress: venue,
    invited: guests,
    confirmed: 0,
    status: 'Planning',
    runSheet: [
      {{ id: 'rs_init_1', time: '14:30', note: 'MC Arrival & sound check', done: false }},
      {{ id: 'rs_init_2', time: '15:00', note: 'Ceremony processional', done: false }}
    ]
  }};

  state.weddings.push(newW);
  logAudit('New Wedding Created', 'Robert Galati', `Created booking for ${{newW.couple}} at ${{venue}}`, 'General');
  saveState(state);
  initMCHub();
  showToast(`Created booking for ${{newW.couple}}!`, 'success');
}}

/* Settings */
function handleSaveMCProfile(e) {{
  e.preventDefault();
  const name = document.getElementById('mcp-name').value.trim();
  const biz = document.getElementById('mcp-biz').value.trim();
  logAudit('MC Profile Updated', 'Robert Galati', 'Updated professional rates and bio', 'General');
  showToast('MC profile settings updated successfully!', 'success');
}}

{chatbot_js}
</script>
{chatbot_html}
</body>
</html>
"""
    with open(os.path.join('c:\\Users\\Mohak\\Desktop\\tap&toast\\tap-toast-demo', 'mc.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("mc.html generated successfully!")

if __name__ == '__main__':
    build_mc()
