# Builder for superadmin.html
import os
from shared_css import get_shared_css
from shared_js import get_shared_js
from auth_component import get_auth_css, get_auth_html, get_auth_js

def build_superadmin():
    shared_css = get_shared_css()
    shared_js = get_shared_js()
    auth_css = get_auth_css()
    auth_html = get_auth_html('superadmin')
    auth_js = get_auth_js('superadmin')

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Super Admin | Tap &amp; Toast SaaS Operations</title>
  <script>
    (function() {{
      try {{
        const pageRole = 'superadmin';
        const raw = localStorage.getItem('tt_session');
        const currentFile = window.location.pathname.split('/').pop() || 'superadmin.html';
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

.tt-unauthenticated .app-shell {{ display: none !important; }}
.tt-unauthenticated #tt-auth-overlay {{ display: grid !important; }}

/* Super Admin Portal Layout */
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

.sidebar-admin-badge {{
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

/* Metrics Grid */
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: 12px 18px;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
}}

.data-table td {{
  padding: 14px 18px;
  border-bottom: 1px solid #f2ece3;
}}

.data-table tr:hover td {{
  background: #fdfbf8;
}}

/* Feature Toggle Switch */
.toggle-switch-row {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f2ece3;
}}
.toggle-switch-row:last-child {{ border-bottom: none; }}

.switch-label strong {{
  display: block;
  font-size: 14px;
  color: var(--ink);
}}

.switch-label small {{
  font-size: 12px;
  color: var(--muted);
}}

.switch {{
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}}

.switch input {{
  opacity: 0;
  width: 0;
  height: 0;
}}

.slider {{
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #d1c7b8;
  transition: .3s;
  border-radius: 26px;
}}

.slider:before {{
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}}

input:checked + .slider {{
  background-color: var(--gold);
}}

input:checked + .slider:before {{
  transform: translateX(22px);
}}

/* Plan Cards */
.plan-cards-grid {{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}}

.plan-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 26px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}

.plan-card.featured {{
  border: 2px solid var(--gold);
  position: relative;
}}

.plan-featured-badge {{
  position: absolute;
  top: -12px;
  right: 20px;
  background: var(--gold);
  color: var(--ink);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 10px;
}}

.plan-price {{
  font-family: var(--font-heading);
  font-size: 32px;
  color: var(--ink);
  margin: 10px 0 16px;
}}

/* Slide Drawer */
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
  max-width: 480px;
  height: 100%;
  box-shadow: -8px 0 30px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
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
  .plan-cards-grid {{ grid-template-columns: 1fr; }}
}}

@media (max-width: 768px) {{
  .app-shell {{ grid-template-columns: 1fr; }}
  .app-sidebar {{ display: flex; flex-direction: row; overflow-x: auto; }}
  .sidebar-brand, .sidebar-admin-badge, .sidebar-footer {{ display: none; }}
  .sidebar-menu {{ flex-direction: row; padding: 6px; }}
  .sidebar-btn {{ padding: 8px 12px; white-space: nowrap; border-left: none; border-bottom: 3px solid transparent; }}
  .sidebar-btn.active {{ border-left: none; border-bottom-color: var(--gold); }}
  .app-main {{ padding: 20px 16px; }}
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
      <a href="mc.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
      <a href="superadmin.html" class="tt-demobar-link active" onclick="handleDemobarNav(event, 'superadmin', 'superadmin.html')">Super Admin</a>
    </div>
    <div class="tt-demobar-actions">
      <button type="button" class="tt-demobar-reset" onclick="resetDemoData()">↺ Reset Demo Data</button>
    </div>
  </nav>

{auth_html}

  <!-- Application Shell -->
  <div class="app-shell">

    <!-- Left Sidebar -->
    <aside class="app-sidebar" aria-label="Superadmin Navigation">
      <div class="sidebar-brand">
        <span class="tt-mark">T</span>
        <span style="font-family:var(--font-heading);font-size:19px;color:#fff;">Tap <span class="gold-amp">&amp;</span> Toast</span>
      </div>
      <div class="sidebar-admin-badge">SUPER ADMIN</div>

      <nav class="sidebar-menu">
        <button type="button" class="sidebar-btn active" data-tab="platform" onclick="switchAdminTab('platform')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Platform
        </button>
        <button type="button" class="sidebar-btn" data-tab="tenants" onclick="switchAdminTab('tenants')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path><line x1="9" y1="9" x2="9" y2="9.01"></line><line x1="9" y1="13" x2="9" y2="13.01"></line><line x1="9" y1="17" x2="9" y2="17.01"></line></svg>
          Tenants
        </button>
        <button type="button" class="sidebar-btn" data-tab="plans" onclick="switchAdminTab('plans')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          Plans &amp; Billing
        </button>
        <button type="button" class="sidebar-btn" data-tab="flags" onclick="switchAdminTab('flags')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
          Feature Flags
        </button>
        <button type="button" class="sidebar-btn" data-tab="audit" onclick="switchAdminTab('audit')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Audit Log
        </button>
        <button type="button" class="sidebar-btn" data-tab="support" onclick="switchAdminTab('support')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
          Support
        </button>
      </nav>

      <div class="sidebar-footer">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#8c7b6c;margin-bottom:2px;">Signed in as</div>
        <div style="font-weight:600;color:#dfc194;" id="sidebar-user-name">Platform Admin</div>
        <div style="font-size:11px;color:#8c7b6c;margin-bottom:8px;" id="sidebar-user-role">Super Admin</div>
        <button type="button" class="btn btn-outline btn-xs" onclick="handleLogout()" style="width:100%;font-size:11px;padding:5px 8px;border-color:#3d3126;color:#d9c9b8;">Logout</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="app-main">

      <!-- TAB 1: PLATFORM -->
      <section id="pane-platform" class="tab-pane active" aria-labelledby="tab-platform">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">GLOBAL OVERVIEW</div>
            <h1 class="header-title">Platform Operations</h1>
          </div>
          <div>
            <button type="button" onclick="openAsMc()" class="btn btn-outline btn-sm">Open as MC &rarr;</button>
          </div>
        </div>

        <!-- 4 Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-number" id="adm-tenants-stat">4</div>
            <div class="metric-label">Active MC Tenants</div>
          </div>
          <div class="metric-card">
            <div class="metric-number" id="adm-mrr-stat">$18,450</div>
            <div class="metric-label">Monthly Recurring Revenue (AUD)</div>
          </div>
          <div class="metric-card">
            <div class="metric-number">24</div>
            <div class="metric-label">Active Weddings Managed</div>
          </div>
          <div class="metric-card">
            <div class="metric-number">3,120</div>
            <div class="metric-label">Total Guest Profiles</div>
          </div>
        </div>

        <!-- Inline SVG Chart Card -->
        <div class="content-card">
          <div class="content-card-title">
            <span>MRR Revenue Growth (AUD) &amp; Booking Volume</span>
            <span class="tt-pill green">99.98% Service Uptime</span>
          </div>

          <div style="width:100%;height:220px;margin-top:12px;">
            <svg viewBox="0 0 800 200" style="width:100%;height:100%;overflow:visible;">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#bd9661" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#bd9661" stop-opacity="0.0"/>
                </linearGradient>
              </defs>

              <!-- Grid lines -->
              <line x1="50" y1="30" x2="780" y2="30" stroke="#f0e9df" stroke-width="1" />
              <line x1="50" y1="80" x2="780" y2="80" stroke="#f0e9df" stroke-width="1" />
              <line x1="50" y1="130" x2="780" y2="130" stroke="#f0e9df" stroke-width="1" />
              <line x1="50" y1="170" x2="780" y2="170" stroke="#e0d5c5" stroke-width="1.5" />

              <!-- Axis Labels -->
              <text x="15" y="34" font-size="10" fill="#8c7b6c">$20k</text>
              <text x="15" y="84" font-size="10" fill="#8c7b6c">$15k</text>
              <text x="15" y="134" font-size="10" fill="#8c7b6c">$10k</text>
              <text x="15" y="174" font-size="10" fill="#8c7b6c">$5k</text>

              <!-- Months -->
              <text x="100" y="190" font-size="11" fill="#8c7b6c">May 2026</text>
              <text x="240" y="190" font-size="11" fill="#8c7b6c">Jun 2026</text>
              <text x="380" y="190" font-size="11" fill="#8c7b6c">Jul 2026</text>
              <text x="520" y="190" font-size="11" fill="#8c7b6c">Aug 2026</text>
              <text x="640" y="190" font-size="11" fill="#8c7b6c">Sep 2026</text>
              <text x="750" y="190" font-size="11" fill="#8c7b6c">Oct 2026</text>

              <!-- Area Fill -->
              <path d="M 120 150 L 260 135 L 400 110 L 540 85 L 660 60 L 760 38 L 760 170 L 120 170 Z" fill="url(#chartGrad)"/>

              <!-- Trend Line -->
              <path d="M 120 150 L 260 135 L 400 110 L 540 85 L 660 60 L 760 38" fill="none" stroke="#bd9661" stroke-width="3" stroke-linecap="round"/>

              <!-- Data points -->
              <circle cx="120" cy="150" r="4.5" fill="#15110e" stroke="#bd9661" stroke-width="2"/>
              <circle cx="260" cy="135" r="4.5" fill="#15110e" stroke="#bd9661" stroke-width="2"/>
              <circle cx="400" cy="110" r="4.5" fill="#15110e" stroke="#bd9661" stroke-width="2"/>
              <circle cx="540" cy="85" r="4.5" fill="#15110e" stroke="#bd9661" stroke-width="2"/>
              <circle cx="660" cy="60" r="4.5" fill="#15110e" stroke="#bd9661" stroke-width="2"/>
              <circle cx="760" cy="38" r="5" fill="#bd9661" stroke="#ffffff" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- TAB 2: TENANTS -->
      <section id="pane-tenants" class="tab-pane" aria-labelledby="tab-tenants">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">ACCOUNTS</div>
            <h1 class="header-title">MC Tenants</h1>
          </div>
          <div>
            <button type="button" class="btn btn-gold btn-sm" onclick="openInviteMCModal()">+ Invite MC</button>
          </div>
        </div>

        <div class="content-card" style="padding:16px 20px;">
          <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
            <input type="text" id="tenant-search" class="text-input" style="max-width:280px;padding:8px 14px;" placeholder="Search MC business..." oninput="filterTenantsTable()">
            <select id="tenant-plan-filter" class="text-input" style="max-width:160px;padding:8px 12px;" onchange="filterTenantsTable()">
              <option value="all">All Plans</option>
              <option value="Pro">Pro</option>
              <option value="Standard">Standard</option>
              <option value="Starter">Starter</option>
            </select>
          </div>

          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>MC Business &amp; Contact</th>
                  <th>Plan Tier</th>
                  <th>Active Weddings</th>
                  <th>MRR</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="tenants-table-body">
                <!-- Populated by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 3: PLANS & BILLING -->
      <section id="pane-plans" class="tab-pane" aria-labelledby="tab-plans">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">SUBSCRIPTIONS</div>
            <h1 class="header-title">Plans &amp; Billing</h1>
          </div>
        </div>

        <div class="plan-cards-grid">
          <!-- Starter -->
          <div class="plan-card">
            <div>
              <div style="font-size:12px;letter-spacing:1px;font-weight:700;color:var(--muted);text-transform:uppercase;">STARTER</div>
              <h3 style="font-family:var(--font-heading);font-size:22px;">Independent Host</h3>
              <div class="plan-price">$149 <small style="font-size:14px;color:var(--muted);">AUD / mo</small></div>
              <ul style="font-size:13px;color:#5a4b3d;display:flex;flex-direction:column;gap:8px;list-style:none;padding:0;">
                <li>✓ 1 active wedding at a time</li>
                <li>✓ Digital RSVPs &amp; basic seating</li>
                <li>✓ Digital wishing well</li>
                <li>✓ Standard community support</li>
              </ul>
            </div>
            <div style="margin-top:24px;border-top:1px solid var(--line);padding-top:16px;">
              <div style="font-size:12px;color:var(--muted);">Active Subscribers: <strong id="plan-starter-count">1</strong></div>
            </div>
          </div>

          <!-- Pro -->
          <div class="plan-card featured">
            <div class="plan-featured-badge">MOST POPULAR</div>
            <div>
              <div style="font-size:12px;letter-spacing:1px;font-weight:700;color:var(--gold);text-transform:uppercase;">PRO</div>
              <h3 style="font-family:var(--font-heading);font-size:22px;">Master of Ceremonies</h3>
              <div class="plan-price">$299 <small style="font-size:14px;color:var(--muted);">AUD / mo</small></div>
              <ul style="font-size:13px;color:#5a4b3d;display:flex;flex-direction:column;gap:8px;list-style:none;padding:0;">
                <li>✓ Unlimited active weddings</li>
                <li>✓ QaRd physical QR generation</li>
                <li>✓ AI Seating Optimization Assistant</li>
                <li>✓ Live interactive run sheets &amp; cues</li>
                <li>✓ Collaborative coordinator logins</li>
              </ul>
            </div>
            <div style="margin-top:24px;border-top:1px solid var(--line);padding-top:16px;">
              <div style="font-size:12px;color:var(--muted);">Active Subscribers: <strong id="plan-pro-count">2</strong></div>
            </div>
          </div>

          <!-- Enterprise -->
          <div class="plan-card">
            <div>
              <div style="font-size:12px;letter-spacing:1px;font-weight:700;color:var(--muted);text-transform:uppercase;">ENTERPRISE</div>
              <h3 style="font-family:var(--font-heading);font-size:22px;">Multi-Host Agency</h3>
              <div class="plan-price">$599 <small style="font-size:14px;color:var(--muted);">AUD / mo</small></div>
              <ul style="font-size:13px;color:#5a4b3d;display:flex;flex-direction:column;gap:8px;list-style:none;padding:0;">
                <li>✓ Up to 10 MC performers</li>
                <li>✓ Custom domain &amp; white-label branding</li>
                <li>✓ Priority 24/7 Australian telephone concierge</li>
                <li>✓ Dedicated account manager</li>
              </ul>
            </div>
            <div style="margin-top:24px;border-top:1px solid var(--line);padding-top:16px;">
              <div style="font-size:12px;color:var(--muted);">Active Subscribers: <strong>1</strong></div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 4: FEATURE FLAGS -->
      <section id="pane-flags" class="tab-pane" aria-labelledby="tab-flags">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">ENVIRONMENT CONTROLS</div>
            <h1 class="header-title">Feature Flags</h1>
          </div>
        </div>

        <div class="content-card" style="max-width:760px;">
          <div class="toggle-switch-row">
            <div class="switch-label">
              <strong>Stripe Digital Gifting &amp; Wishing Well</strong>
              <small>Enable guest contributions via Apple Pay / Credit Card across wedding portals</small>
            </div>
            <label class="switch">
              <input type="checkbox" id="flag-gifting" onchange="toggleFeatureFlag('digitalGifting', this.checked)">
              <span class="slider"></span>
            </label>
          </div>

          <div class="toggle-switch-row">
            <div class="switch-label">
              <strong>AI Seating Optimization Assistant</strong>
              <small>Allow couples and MCs to auto-generate seat pairings by dietary and party constraints</small>
            </div>
            <label class="switch">
              <input type="checkbox" id="flag-seating" onchange="toggleFeatureFlag('aiSeating', this.checked)">
              <span class="slider"></span>
            </label>
          </div>

          <div class="toggle-switch-row">
            <div class="switch-label">
              <strong>Custom QaRd Printing Pipeline</strong>
              <small>Render high-resolution 300 DPI vector PDF print outputs for wedding stationery</small>
            </div>
            <label class="switch">
              <input type="checkbox" id="flag-printing" onchange="toggleFeatureFlag('qardPrinting', this.checked)">
              <span class="slider"></span>
            </label>
          </div>

          <div class="toggle-switch-row">
            <div class="switch-label">
              <strong>Real-time Photo Wall Moderation</strong>
              <small>Enable instant live photo stream with couple pre-approval filters</small>
            </div>
            <label class="switch">
              <input type="checkbox" id="flag-photo" onchange="toggleFeatureFlag('photoModeration', this.checked)">
              <span class="slider"></span>
            </label>
          </div>

          <div class="toggle-switch-row">
            <div class="switch-label">
              <strong>Automated SMS RSVP Reminders</strong>
              <small>Trigger automated Twilio SMS reminders 14 days before RSVP cutoff</small>
            </div>
            <label class="switch">
              <input type="checkbox" id="flag-sms" onchange="toggleFeatureFlag('smsReminders', this.checked)">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- TAB 5: AUDIT LOG -->
      <section id="pane-audit" class="tab-pane" aria-labelledby="tab-audit">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">COMPLIANCE &amp; LOGGING</div>
            <h1 class="header-title">System Audit Log</h1>
          </div>
          <div>
            <button type="button" class="btn btn-outline btn-sm" onclick="clearAuditLog()">Clear Log</button>
          </div>
        </div>

        <div class="content-card" style="padding:16px 20px;">
          <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
            <input type="text" id="audit-search" class="text-input" style="max-width:280px;padding:8px 14px;" placeholder="Filter audit trail..." oninput="filterAuditLog()">
            <select id="audit-category-filter" class="text-input" style="max-width:180px;padding:8px 12px;" onchange="filterAuditLog()">
              <option value="all">All Categories</option>
              <option value="RSVP">RSVP</option>
              <option value="Seating">Seating</option>
              <option value="Gifting">Gifting</option>
              <option value="Feed">Feed</option>
              <option value="Tenants">Tenants</option>
              <option value="General">General</option>
            </select>
          </div>

          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Category</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody id="audit-table-body">
                <!-- Injected by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 6: SUPPORT -->
      <section id="pane-support" class="tab-pane" aria-labelledby="tab-support">
        <div class="page-header">
          <div>
            <div class="header-eyebrow">HELPDESK</div>
            <h1 class="header-title">Support Tickets</h1>
          </div>
        </div>

        <div class="content-card" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Tenant</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="support-table-body">
              <!-- Injected by JS -->
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>

  <!-- Toast Container -->
  <div id="tt-toast-container" class="tt-toast-container"></div>

  <!-- Tenant Detail Drawer -->
  <div id="tenant-drawer-backdrop" class="slide-drawer-backdrop" style="display:none;" aria-hidden="true" onclick="if(event.target===this)closeTenantDrawer()">
    <div class="slide-drawer">
      <div class="drawer-header">
        <div>
          <div style="font-size:10px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;">TENANT RECORD</div>
          <h3 style="font-family:var(--font-heading);font-size:20px;color:#fff;" id="drawer-tenant-title">Robert Galati MC</h3>
        </div>
        <button type="button" class="tt-modal-close" onclick="closeTenantDrawer()">✕</button>
      </div>
      <div class="drawer-body" id="drawer-tenant-body">
        <!-- Injected by JS -->
      </div>
    </div>
  </div>

  <!-- Support Conversation Drawer -->
  <div id="support-drawer-backdrop" class="slide-drawer-backdrop" style="display:none;" aria-hidden="true" onclick="if(event.target===this)closeSupportDrawer()">
    <div class="slide-drawer">
      <div class="drawer-header">
        <div>
          <div style="font-size:10px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;">TICKET RESOLUTION</div>
          <h3 style="font-family:var(--font-heading);font-size:20px;color:#fff;" id="drawer-ticket-title">Ticket</h3>
        </div>
        <button type="button" class="tt-modal-close" onclick="closeSupportDrawer()">✕</button>
      </div>
      <div class="drawer-body" id="drawer-support-body">
        <!-- Injected by JS -->
      </div>
    </div>
  </div>

  <!-- Invite MC Modal -->
  <div id="invite-mc-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Invite New MC Tenant</div>
        <button type="button" class="tt-modal-close" onclick="closeInviteMCModal()">✕</button>
      </div>
      <form onsubmit="handleInviteMCSubmit(event)">
        <div class="tt-modal-body">
          <div class="field-group">
            <label class="field-label">MC Business Name</label>
            <input type="text" id="inv-biz" class="text-input" required placeholder="e.g. Hunter Valley Wedding Hosts">
          </div>
          <div class="field-group">
            <label class="field-label">Lead MC Name</label>
            <input type="text" id="inv-lead" class="text-input" required placeholder="e.g. Dean Campbell">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field-group">
              <label class="field-label">Email Address</label>
              <input type="email" id="inv-email" class="text-input" required placeholder="dean@hvmc.com.au">
            </div>
            <div class="field-group">
              <label class="field-label">Subscription Tier</label>
              <select id="inv-plan" class="text-input">
                <option value="Pro" selected>Pro ($299/mo)</option>
                <option value="Standard">Standard ($199/mo)</option>
                <option value="Starter">Starter ($149/mo)</option>
              </select>
            </div>
          </div>
        </div>
        <div class="tt-modal-footer">
          <button type="button" class="btn btn-outline" onclick="closeInviteMCModal()">Cancel</button>
          <button type="submit" class="btn btn-gold">Dispatch Invitation</button>
        </div>
      </form>
    </div>
  </div>

  <script>
{shared_js}
{auth_js}

/* Super Admin Logic */
let activeTicketId = null;

document.addEventListener('DOMContentLoaded', () => {{
  document.documentElement.classList.remove('tt-unauthenticated');
  if (!initAuthGuard('superadmin')) return;
  initAdminDashboard();
  window.addEventListener('storage', () => {{
    if (initAuthGuard('superadmin')) initAdminDashboard();
  }});
  window.addEventListener('tt_state_changed', () => {{
    if (initAuthGuard('superadmin')) initAdminDashboard();
  }});
}});

function initAdminDashboard() {{
  if (!getSession()) return;
  renderTenants();
  renderFeatureFlags();
  renderAuditTable();
  renderSupport();
}}

function switchAdminTab(tabKey) {{
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

/* Tenants */
function renderTenants() {{
  const tbody = document.getElementById('tenants-table-body');
  if (!tbody) return;
  const state = loadState();
  const tenants = state.tenants || [];

  document.getElementById('adm-tenants-stat').textContent = tenants.filter(t => t.status === 'Active').length;

  tbody.innerHTML = tenants.map(t => `
    <tr>
      <td>
        <strong>${{escapeHtml(t.business)}}</strong><br>
        <small style="color:var(--muted);">${{escapeHtml(t.lead)}} &bull; ${{escapeHtml(t.email)}}</small>
      </td>
      <td>
        <select class="text-input" style="padding:4px 8px;font-size:12px;max-width:110px;" onchange="changeTenantPlan('${{t.id}}', this.value)">
          <option value="Starter" ${{t.plan === 'Starter' ? 'selected' : ''}}>Starter</option>
          <option value="Standard" ${{t.plan === 'Standard' ? 'selected' : ''}}>Standard</option>
          <option value="Pro" ${{t.plan === 'Pro' ? 'selected' : ''}}>Pro</option>
        </select>
      </td>
      <td>${{t.weddings}} weddings</td>
      <td><strong>${{formatAUD(t.mrr)}}/mo</strong></td>
      <td>
        <span class="tt-pill ${{t.status === 'Active' ? 'green' : t.status === 'Trial' ? 'gold' : 'danger'}}">${{escapeHtml(t.status)}}</span>
      </td>
      <td>
        <div style="display:flex;gap:6px;">
          <button type="button" class="btn btn-outline btn-sm" onclick="toggleTenantStatus('${{t.id}}')">
            ${{t.status === 'Active' ? 'Suspend' : 'Activate'}}
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="openTenantDrawer('${{t.id}}')">Details</button>
        </div>
      </td>
    </tr>
  `).join('');
}}

function changeTenantPlan(tenantId, newPlan) {{
  const state = loadState();
  const t = state.tenants.find(x => x.id === tenantId);
  if (t) {{
    t.plan = newPlan;
    t.mrr = newPlan === 'Starter' ? 149 : newPlan === 'Standard' ? 199 : 299;
    logAudit('Tenant Plan Changed', 'Super Admin', `Updated ${{t.business}} to ${{newPlan}} tier`, 'Tenants');
    saveState(state);
    renderTenants();
    showToast(`Updated ${{t.business}} to ${{newPlan}} tier`, 'success');
  }}
}}

function toggleTenantStatus(tenantId) {{
  const state = loadState();
  const t = state.tenants.find(x => x.id === tenantId);
  if (t) {{
    t.status = t.status === 'Active' ? 'Suspended' : 'Active';
    logAudit('Tenant Status Updated', 'Super Admin', `${{t.status === 'Active' ? 'Activated' : 'Suspended'}} ${{t.business}}`, 'Tenants');
    saveState(state);
    renderTenants();
    showToast(`${{t.business}} is now ${{t.status}}`, 'info');
  }}
}}

function openTenantDrawer(tenantId) {{
  const state = loadState();
  const t = state.tenants.find(x => x.id === tenantId);
  if (!t) return;

  document.getElementById('drawer-tenant-title').textContent = t.business;
  document.getElementById('drawer-tenant-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label class="field-label">Lead Host / MC</label>
        <div style="font-weight:700;">${{escapeHtml(t.lead)}}</div>
      </div>
      <div>
        <label class="field-label">Email</label>
        <div>${{escapeHtml(t.email)}}</div>
      </div>
      <div>
        <label class="field-label">Current Subscription</label>
        <div>${{escapeHtml(t.plan)}} Plan (${{formatAUD(t.mrr)}} / month)</div>
      </div>
      <div>
        <label class="field-label">Managed Weddings Volume</label>
        <div>${{t.weddings}} active events in system</div>
      </div>
      <div>
        <label class="field-label">Stripe Connect Status</label>
        <div>${{t.stripeConnected ? '<span class="tt-pill green">Verified &amp; Payouts Active</span>' : '<span class="tt-pill warm">Pending KYC Verification</span>'}}</div>
      </div>
      <div>
        <label class="field-label">Platform Onboarding Date</label>
        <div>${{escapeHtml(t.joined)}}</div>
      </div>
    </div>
  `;

  document.getElementById('tenant-drawer-backdrop').style.display = 'flex';
  document.getElementById('tenant-drawer-backdrop').setAttribute('aria-hidden', 'false');
}}

function closeTenantDrawer() {{
  document.getElementById('tenant-drawer-backdrop').style.display = 'none';
  document.getElementById('tenant-drawer-backdrop').setAttribute('aria-hidden', 'true');
}}

function filterTenantsTable() {{
  const q = (document.getElementById('tenant-search')?.value || '').toLowerCase();
  const plan = document.getElementById('tenant-plan-filter')?.value || 'all';

  document.querySelectorAll('#tenants-table-body tr').forEach(r => {{
    const text = r.textContent.toLowerCase();
    const matchQ = !q || text.includes(q);
    const matchP = plan === 'all' || text.includes(plan.toLowerCase());
    r.style.display = matchQ && matchP ? '' : 'none';
  }});
}}

function openInviteMCModal() {{
  document.getElementById('invite-mc-modal').style.display = 'flex';
  document.getElementById('invite-mc-modal').setAttribute('aria-hidden', 'false');
}}

function closeInviteMCModal() {{
  document.getElementById('invite-mc-modal').style.display = 'none';
  document.getElementById('invite-mc-modal').setAttribute('aria-hidden', 'true');
}}

function handleInviteMCSubmit(e) {{
  e.preventDefault();
  const biz = document.getElementById('inv-biz').value.trim();
  const lead = document.getElementById('inv-lead').value.trim();
  const email = document.getElementById('inv-email').value.trim();
  const plan = document.getElementById('inv-plan').value;

  closeInviteMCModal();
  const state = loadState();
  if (!state.tenants) state.tenants = [];

  const newT = {{
    id: 'ten_' + Date.now(),
    business: biz,
    lead: lead,
    plan: plan,
    weddings: 0,
    mrr: plan === 'Starter' ? 149 : plan === 'Standard' ? 199 : 299,
    status: 'Active',
    joined: 'Today',
    stripeConnected: true,
    email: email
  }};

  state.tenants.push(newT);
  logAudit('MC Tenant Invited', 'Super Admin', `Onboarded ${{biz}} (${{plan}} plan)`, 'Tenants');
  saveState(state);
  renderTenants();
  showToast(`Onboarded new MC tenant: ${{biz}}!`, 'success');
}}

/* Feature Flags */
function renderFeatureFlags() {{
  const state = loadState();
  const flags = state.featureFlags || {{}};

  if (document.getElementById('flag-gifting')) document.getElementById('flag-gifting').checked = !!flags.digitalGifting;
  if (document.getElementById('flag-seating')) document.getElementById('flag-seating').checked = !!flags.aiSeating;
  if (document.getElementById('flag-printing')) document.getElementById('flag-printing').checked = !!flags.qardPrinting;
  if (document.getElementById('flag-photo')) document.getElementById('flag-photo').checked = !!flags.photoModeration;
  if (document.getElementById('flag-sms')) document.getElementById('flag-sms').checked = !!flags.smsReminders;
}}

function toggleFeatureFlag(flagKey, isEnabled) {{
  const state = loadState();
  if (!state.featureFlags) state.featureFlags = {{}};
  state.featureFlags[flagKey] = isEnabled;

  logAudit('Feature Flag Toggled', 'Super Admin', `${{flagKey}} set to ${{isEnabled}}`, 'General');
  saveState(state);
  showToast(`Feature Flag: ${{flagKey}} is now ${{isEnabled ? 'Enabled' : 'Disabled'}}`, 'info');
}}

/* Audit Log */
function renderAuditTable() {{
  const tbody = document.getElementById('audit-table-body');
  if (!tbody) return;
  const state = loadState();
  const audit = state.auditLog || [];

  tbody.innerHTML = audit.map(a => `
    <tr>
      <td><span style="font-size:12px;color:var(--muted);">${{escapeHtml(a.timestamp)}}</span></td>
      <td><strong>${{escapeHtml(a.actor)}}</strong></td>
      <td>${{escapeHtml(a.action)}}</td>
      <td><span class="tt-pill warm">${{escapeHtml(a.category || 'General')}}</span></td>
      <td style="font-size:12.5px;color:#4c3d31;">${{escapeHtml(a.details)}}</td>
    </tr>
  `).join('');
}}

function filterAuditLog() {{
  const q = (document.getElementById('audit-search')?.value || '').toLowerCase();
  const cat = document.getElementById('audit-category-filter')?.value || 'all';

  document.querySelectorAll('#audit-table-body tr').forEach(r => {{
    const text = r.textContent.toLowerCase();
    const matchQ = !q || text.includes(q);
    const matchC = cat === 'all' || text.includes(cat.toLowerCase());
    r.style.display = matchQ && matchC ? '' : 'none';
  }});
}}

function clearAuditLog() {{
  const state = loadState();
  state.auditLog = [];
  logAudit('Audit Log Cleared', 'Super Admin', 'Platform admin cleared log history', 'General');
  saveState(state);
  renderAuditTable();
  showToast('Audit log records reset', 'info');
}}

/* Support */
function renderSupport() {{
  const tbody = document.getElementById('support-table-body');
  if (!tbody) return;
  const state = loadState();
  const tickets = state.supportTickets || [];

  tbody.innerHTML = tickets.map(t => `
    <tr>
      <td><strong>${{escapeHtml(t.id)}}</strong></td>
      <td>${{escapeHtml(t.tenant)}}</td>
      <td>${{escapeHtml(t.subject)}}</td>
      <td>
        <span class="tt-pill ${{t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warm' : 'green'}}">
          ${{escapeHtml(t.priority)}}
        </span>
      </td>
      <td>
        <span class="tt-pill ${{t.status === 'Resolved' ? 'green' : t.status === 'In Progress' ? 'warm' : 'lavender'}}">
          ${{escapeHtml(t.status)}}
        </span>
      </td>
      <td>${{escapeHtml(t.date)}}</td>
      <td>
        <button type="button" class="btn btn-outline btn-sm" onclick="openSupportDrawer('${{t.id}}')">Reply</button>
      </td>
    </tr>
  `).join('');
}}

function openSupportDrawer(ticketId) {{
  activeTicketId = ticketId;
  const state = loadState();
  const ticket = (state.supportTickets || []).find(t => t.id === ticketId);
  if (!ticket) return;

  document.getElementById('drawer-ticket-title').textContent = `${{ticket.id}}: ${{ticket.subject}}`;
  
  const msgsHtml = (ticket.messages || []).map(m => `
    <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
        <strong>${{escapeHtml(m.sender)}}</strong>
        <span style="color:var(--muted);">${{escapeHtml(m.time)}}</span>
      </div>
      <div style="font-size:13px;color:#4c3f33;">${{escapeHtml(m.text)}}</div>
    </div>
  `).join('');

  document.getElementById('drawer-support-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div><strong>Tenant:</strong> ${{escapeHtml(ticket.tenant)}}</div>
        <select class="text-input" style="max-width:130px;padding:4px 8px;font-size:12px;" onchange="updateTicketStatus('${{ticket.id}}', this.value)">
          <option value="Open" ${{ticket.status === 'Open' ? 'selected' : ''}}>Open</option>
          <option value="In Progress" ${{ticket.status === 'In Progress' ? 'selected' : ''}}>In Progress</option>
          <option value="Resolved" ${{ticket.status === 'Resolved' ? 'selected' : ''}}>Resolved</option>
        </select>
      </div>

      <div style="margin-top:10px;">${{msgsHtml}}</div>

      <div style="margin-top:16px;">
        <label class="field-label">Send Support Response</label>
        <textarea id="reply-ticket-text" class="text-input" rows="3" placeholder="Type your response to ${{escapeHtml(ticket.tenant)}}..."></textarea>
        <button type="button" class="btn btn-gold btn-block" style="margin-top:8px;" onclick="sendTicketReply()">Send Reply</button>
      </div>
    </div>
  `;

  document.getElementById('support-drawer-backdrop').style.display = 'flex';
  document.getElementById('support-drawer-backdrop').setAttribute('aria-hidden', 'false');
}}

function closeSupportDrawer() {{
  document.getElementById('support-drawer-backdrop').style.display = 'none';
  document.getElementById('support-drawer-backdrop').setAttribute('aria-hidden', 'true');
}}

function updateTicketStatus(ticketId, newStatus) {{
  const state = loadState();
  const t = (state.supportTickets || []).find(x => x.id === ticketId);
  if (t) {{
    t.status = newStatus;
    logAudit('Support Ticket Updated', 'Super Admin', `Updated ticket ${{ticketId}} to ${{newStatus}}`, 'General');
    saveState(state);
    renderSupport();
    showToast(`Ticket ${{ticketId}} marked as ${{newStatus}}`, 'info');
  }}
}}

function sendTicketReply() {{
  const input = document.getElementById('reply-ticket-text');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();

  const state = loadState();
  const ticket = (state.supportTickets || []).find(t => t.id === activeTicketId);
  if (ticket) {{
    if (!ticket.messages) ticket.messages = [];
    ticket.messages.push({{
      sender: 'Tap & Toast Super Admin',
      text: text,
      time: 'Just now'
    }});
    logAudit('Support Reply Sent', 'Super Admin', `Replied to ticket ${{ticket.id}}`, 'General');
    saveState(state);
    renderSupport();
    openSupportDrawer(activeTicketId);
    showToast('Reply sent to tenant!', 'success');
  }}
}}

</script>
</body>
</html>
"""
    with open(os.path.join('c:\\Users\\Mohak\\Desktop\\tap&toast\\tap-toast-demo', 'superadmin.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("superadmin.html generated successfully!")

if __name__ == '__main__':
    build_superadmin()
