# Builder for guest-web.html
import os
from shared_css import get_shared_css
from shared_js import get_shared_js
from chatbot_component import get_chatbot_html, get_chatbot_css, get_chatbot_js

def build_guest_web():
    shared_css = get_shared_css()
    shared_js = get_shared_js()
    chatbot_html = get_chatbot_html()
    chatbot_css = get_chatbot_css()
    chatbot_js = get_chatbot_js()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sophie &amp; James | Tap &amp; Toast Guest Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
{shared_css}
{chatbot_css}

/* Guest Web Desktop Layout */
body {{
  background: var(--cream);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}}

.web-container {{
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
}}

/* Top Hero Section */
.web-hero {{
  background: #15110e;
  color: #ffffff;
  padding: 44px 32px 36px;
  border-bottom: 2px solid var(--gold);
  position: relative;
  overflow: hidden;
}}

.web-hero-content {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}}

.web-hero-left {{
  max-width: 650px;
}}

.web-hero-eyebrow {{
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--gold);
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 8px;
}}

.web-hero-title {{
  font-family: var(--font-heading);
  font-size: 42px;
  line-height: 1.15;
  color: #ffffff;
  margin-bottom: 10px;
}}

.web-hero-meta {{
  font-size: 15px;
  color: #e4cfae;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}}

.web-hero-right {{
  display: flex;
  align-items: center;
  gap: 16px;
}}

.web-qard-mini {{
  background: #1c1713;
  border: 1px solid var(--gold);
  border-radius: 8px;
  padding: 14px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}}

/* Guest Web Workspace Shell with Vertical Sidebar (Image 3) */
.guest-web-shell {{
  display: flex;
  min-height: calc(100vh - 41px);
}}

.guest-sidebar {{
  width: 260px;
  background: #17121b;
  color: #c9bed1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #281f2f;
  flex-shrink: 0;
  position: sticky;
  top: 41px;
  height: calc(100vh - 41px);
  overflow-y: auto;
  z-index: 90;
}}

.guest-sidebar-header {{
  padding: 24px 20px 14px;
}}

.guest-sidebar-eyebrow {{
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #8c7e96;
  text-transform: uppercase;
}}

.guest-sidebar-nav {{
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}}

.guest-nav-item {{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: transparent;
  color: #b8acbf;
  border: none;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  width: 100%;
}}

.guest-nav-item:hover {{
  background: #241c2c;
  color: #ffffff;
}}

.guest-nav-item.active {{
  background: #2f253a;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}}

.guest-nav-icon {{
  width: 18px;
  font-size: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: #dfc194;
}}

.guest-sidebar-help {{
  margin: 16px 12px;
  padding: 14px 16px;
  background: #221a28;
  border: 1px solid #33273c;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}}

.guest-sidebar-help:hover {{
  background: #2b2133;
}}

.guest-help-title {{
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}}

.guest-help-sub {{
  font-size: 11px;
  color: #9f91a8;
  margin-top: 4px;
}}

.guest-sidebar-footer {{
  padding: 14px 16px;
  border-top: 1px solid #281f2f;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #140f18;
}}

.guest-couple-avatar {{
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #2e2338;
  border: 1px solid #bd9661;
  color: #dfc194;
  display: grid;
  place-items: center;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}}

.guest-couple-info {{
  flex: 1;
  min-width: 0;
}}

.guest-couple-name {{
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}}

.guest-couple-sub {{
  font-size: 11px;
  color: #8c7e96;
}}

.guest-main-wrap {{
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}}

/* Web RSVP Transitioned Status Card (Image 4 feedback) */
.web-rsvp-status-card {{
  background: var(--white);
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  border-radius: 12px;
  padding: 36px 32px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  max-width: 580px;
  margin: 0 auto;
  animation: rsvpCardFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}}

@keyframes rsvpCardFadeIn {{
  from {{ opacity: 0; transform: translateY(12px) scale(0.98); }}
  to {{ opacity: 1; transform: translateY(0) scale(1); }}
}}

.web-rsvp-status-badge {{
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 14px;
  background: #e8eee4;
  color: #3c6a42;
  margin-bottom: 12px;
}}

.web-rsvp-status-badge.declined {{
  background: #fbeae8;
  color: #a8382c;
}}

.web-rsvp-summary-box {{
  background: #fbf9f5;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}}

@media (max-width: 900px) {{
  .guest-web-shell {{
    flex-direction: column;
  }}
  .guest-sidebar {{
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #281f2f;
  }}
  .guest-sidebar-nav {{
    flex-direction: row;
    overflow-x: auto;
    padding: 8px 12px;
  }}
  .guest-nav-item {{
    white-space: nowrap;
    width: auto;
  }}
  .guest-sidebar-help, .guest-sidebar-footer {{
    display: none;
  }}
}}

/* Main Section */
.web-main {{
  flex: 1;
  padding: 36px 0 60px;
}}

.tab-pane {{
  display: none;
}}

.tab-pane.active {{
  display: block;
}}

/* Grid & Card Layouts */
.grid-2col {{
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
}}

.grid-3col {{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}}

.grid-4col {{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}}

.web-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}}

.web-card-header {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}}

.web-card-title {{
  font-family: var(--font-heading);
  font-size: 20px;
  color: var(--ink);
}}

/* Hub Tiles in Web */
.web-tile-grid {{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}}

.web-hub-tile {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}}

.web-hub-tile:hover {{
  border-color: var(--gold);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}}

.web-hub-icon {{
  font-size: 28px;
  background: #faf5ee;
  border: 1px solid #ebdcc9;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}}

/* RSVP Web Form */
.rsvp-web-box {{
  max-width: 640px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 32px;
  box-shadow: var(--shadow-md);
}}

.rsvp-toggle-row {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}}

.rsvp-toggle-btn {{
  padding: 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  border: 1px solid var(--line-strong);
  background: #ffffff;
  transition: all 0.2s ease;
}}

.rsvp-toggle-btn.active {{
  background: var(--ink);
  color: #ffffff;
  border-color: var(--ink);
  box-shadow: 0 4px 12px rgba(21, 17, 14, 0.2);
}}

.field-group {{
  margin-bottom: 20px;
}}

.field-label {{
  display: block;
  font-size: 11.5px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--muted);
  margin-bottom: 8px;
}}

.stepper {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  padding: 8px 18px;
}}

.stepper-btn {{
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--ink);
  font-size: 20px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
}}

.text-input {{
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}}
.text-input:focus {{
  border-color: var(--gold);
}}

.qard-scanned-temporary {{
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 120px;
  opacity: 1;
  overflow: hidden;
}}

.qard-scanned-temporary.banner-hidden {{
  opacity: 0;
  max-height: 0;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: none !important;
}}

/* Timeline */
.timeline-item {{
  display: flex;
  gap: 20px;
  padding: 18px 24px;
  border-left: 2px solid var(--gold);
  margin-left: 24px;
  position: relative;
}}
.timeline-item::before {{
  content: '';
  position: absolute;
  left: -7px;
  top: 24px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid #ffffff;
}}
.timeline-time {{
  font-weight: 700;
  font-size: 14px;
  color: var(--gold-hover);
  min-width: 75px;
}}

/* Feed in Web */
.feed-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px 22px;
  margin-bottom: 14px;
  box-shadow: var(--shadow-sm);
}}

.feed-glyph {{
  width: 38px;
  height: 38px;
  background: #faf4e9;
  border: 1px solid #ebd9c2;
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 18px;
  flex-shrink: 0;
}}

/* Responsive Breakpoints */
@media (max-width: 900px) {{
  .grid-2col {{ grid-template-columns: 1fr; }}
  .grid-3col {{ grid-template-columns: repeat(2, 1fr); }}
  .grid-4col {{ grid-template-columns: repeat(2, 1fr); }}
  .web-hero-title {{ font-size: 34px; }}
}}

@media (max-width: 600px) {{
  .grid-3col {{ grid-template-columns: 1fr; }}
  .grid-4col {{ grid-template-columns: 1fr; }}
  .web-tile-grid {{ grid-template-columns: 1fr; }}
  .web-hero {{ padding: 28px 18px; }}
  .web-hero-title {{ font-size: 28px; }}
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
      <a href="guest-web.html" class="tt-demobar-link active">Guest Web</a>
      <a href="couple.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'couple', 'couple.html')">Couple Dashboard</a>
      <a href="mc.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
      <a href="superadmin.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'superadmin', 'superadmin.html')">Super Admin</a>
    </div>
    <div class="tt-demobar-actions">
      <button type="button" class="tt-demobar-reset" onclick="resetDemoData()">↺ Reset Demo Data</button>
    </div>
  </nav>

  <div class="guest-web-shell">
    <!-- Left Vertical Sidebar (Matches Image 3) -->
    <aside class="guest-sidebar" aria-label="Guest Workspace Navigation">
      <div class="guest-sidebar-header">
        <div class="guest-sidebar-eyebrow">YOUR WORKSPACE</div>
      </div>

      <nav class="guest-sidebar-nav">
        <button type="button" class="guest-nav-item active" id="web-nav-hub" onclick="switchWebTab('hub')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </span>
          <span>Overview</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-rsvp" onclick="switchWebTab('rsvp')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>
          </span>
          <span>Guest RSVP</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-feed" onclick="switchWebTab('feed')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </span>
          <span>Celebration Feed</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-schedule" onclick="switchWebTab('schedule')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </span>
          <span>Schedule &amp; Events</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-table" onclick="switchWebTab('table')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="3" r="2"></circle><circle cx="12" cy="21" r="2"></circle><circle cx="3" cy="12" r="2"></circle><circle cx="21" cy="12" r="2"></circle></svg>
          </span>
          <span>My Table &amp; Seating</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-photos" onclick="switchWebTab('photos')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </span>
          <span>Photo Wall</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-pages" onclick="switchWebTab('pages')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </span>
          <span>Our Story &amp; Details</span>
        </button>
        <button type="button" class="guest-nav-item" id="web-nav-gifts" onclick="switchWebTab('gifts')">
          <span class="guest-nav-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
          </span>
          <span>Gift &amp; Go</span>
        </button>
      </nav>

      <!-- A little help? card (Matches Image 3) -->
      <div class="guest-sidebar-help" onclick="toggleChatbot()" title="Open Tap &amp; Toast Concierge">
        <div class="guest-help-title">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span>A little help?</span>
        </div>
        <div class="guest-help-sub">We're here for the happy days.</div>
      </div>

      <!-- Couple Footer Card (Matches Image 3) -->
      <div class="guest-sidebar-footer">
        <div class="guest-couple-avatar">SJ</div>
        <div class="guest-couple-info">
          <div class="guest-couple-name">Sophie &amp; James</div>
          <div class="guest-couple-sub">Your wedding, your way</div>
        </div>
      </div>
    </aside>

    <!-- Right Main Content Workspace -->
    <div class="guest-main-wrap">
      <!-- Hero Header -->
      <header class="web-hero">
        <div class="web-container web-hero-content">
          <div class="web-hero-left">
            <div class="web-hero-eyebrow">WEDDING GUEST PORTAL</div>
            <h1 class="web-hero-title">Sophie <span class="gold-amp">&amp;</span> James</h1>
            <div class="web-hero-meta">
              <span>📅 Saturday, 14 November 2026 · 2:00 PM</span>
              <span>📍 Fernwood Estate, Southern Highlands</span>
              <span class="tt-pill warm" id="web-days-badge" style="display:inline-flex;align-items:center;gap:6px;font-weight:600;"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span id="web-countdown-display">35 days : 00 hrs : 00 mins : 00 secs remaining</span></span>
            </div>
          </div>
          <div class="web-hero-right">
            <div class="web-qard-mini">
              <div style="font-size:11px;font-family:var(--font-heading);color:#fff;">QaRd Invitation</div>
              <div id="web-hero-qr" style="width:72px;height:72px;"></div>
              <div style="font-size:10px;color:var(--gold-light);" id="web-hero-guest">Welcome, Priya</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="web-main">
        <div class="web-container">

      <!-- PANE 1: HUB -->
      <section id="pane-hub" class="tab-pane active" aria-labelledby="tab-hub">
        <div id="web-qard-scanned-banner" class="qard-scanned-temporary" style="background:#17120f;color:#fff;border-radius:8px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <div>
              <strong>QaRd scanned — welcome in</strong><br>
              <span style="font-size:12px;color:#cbb8a6;">No app, no login. Just tapped or accessed via your unique invitation.</span>
            </div>
          </div>
          <span class="tt-pill warm" id="hub-welcome-pill">Guest: Priya Sharma</span>
        </div>

        <div class="grid-2col">
          <div>
            <h2 style="font-family:var(--font-heading);font-size:24px;margin-bottom:16px;">Quick Access Hub</h2>
            <div class="web-tile-grid">
              <button type="button" class="web-hub-tile" onclick="switchWebTab('schedule')">
                <div class="web-hub-icon">📋</div>
                <div>
                  <strong style="display:block;font-size:15px;color:var(--ink);">Today's Schedule</strong>
                  <span style="font-size:12.5px;color:var(--muted);" id="web-hub-ceremony">Ceremony at 2:00 PM</span>
                </div>
              </button>

              <button type="button" class="web-hub-tile" onclick="switchWebTab('table')">
                <div class="web-hub-icon">🪑</div>
                <div>
                  <strong style="display:block;font-size:15px;color:var(--ink);">My Table</strong>
                  <span style="font-size:12.5px;color:var(--muted);" id="web-hub-table">Table 4, Seat 3</span>
                </div>
              </button>

              <button type="button" class="web-hub-tile" onclick="switchWebTab('photos')">
                <div class="web-hub-icon">📷</div>
                <div>
                  <strong style="display:block;font-size:15px;color:var(--ink);">Photo Wall</strong>
                  <span style="font-size:12.5px;color:var(--muted);">Add &amp; browse photos</span>
                </div>
              </button>

              <button type="button" class="web-hub-tile" onclick="switchWebTab('gifts')">
                <div class="web-hub-icon">🎁</div>
                <div>
                  <strong style="display:block;font-size:15px;color:var(--ink);">Gift &amp; Go</strong>
                  <span style="font-size:12.5px;color:var(--muted);">Send a digital gift</span>
                </div>
              </button>

              <button type="button" class="web-hub-tile" onclick="switchWebTab('pages')">
                <div class="web-hub-icon">📖</div>
                <div>
                  <strong style="display:block;font-size:15px;color:var(--ink);">Our Story &amp; Menu</strong>
                  <span style="font-size:12.5px;color:var(--muted);">Story, dining menu &amp; updates</span>
                </div>
              </button>
            </div>

            <!-- Venue Details Card -->
            <div class="web-card" style="margin-top:24px;">
              <div class="web-card-header">
                <h3 class="web-card-title">Venue &amp; Arrival</h3>
                <span class="tt-pill green">Southern Highlands</span>
              </div>
              <p style="font-size:13.5px;color:#4c3f33;margin-bottom:10px;">
                <strong>Fernwood Estate</strong><br>
                124 Range Road, Mittagong NSW 2575
              </p>
              <p style="font-size:12.5px;color:var(--muted);">
                Complimentary on-site guest parking is available at the Main Lawn entrance. Follow the signs upon arrival.
              </p>
            </div>
          </div>

          <!-- Celebration Feed Highlights -->
          <div>
            <div class="web-card">
              <div class="web-card-header">
                <h3 class="web-card-title">Celebration Feed</h3>
                <button type="button" class="btn btn-outline btn-sm" onclick="switchWebTab('feed')">View all</button>
              </div>
              <div id="web-hub-feed-preview">
                <!-- Injected by JS -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PANE 2: RSVP -->
      <section id="pane-rsvp" class="tab-pane" aria-labelledby="tab-rsvp">
        <div class="rsvp-web-box">
          <div id="web-rsvp-form-container">
            <div style="text-align:center;margin-bottom:24px;">
              <div class="web-hero-eyebrow">YOUR INVITATION</div>
              <h2 style="font-family:var(--font-heading);font-size:28px;">Confirm Your Attendance</h2>
              <p style="font-size:14px;color:#6b5a4b;margin-top:4px;" id="web-rsvp-greeting">
                Hi <strong>Priya</strong> — we'd love for you to celebrate with us.
              </p>
            </div>

            <form id="web-rsvp-form" onsubmit="handleWebRSVPSubmit(event)">
              <div class="rsvp-toggle-row">
                <button type="button" id="web-btn-accept" class="rsvp-toggle-btn active" onclick="setWebRSVPOption('confirmed')">Joyfully Accepts</button>
                <button type="button" id="web-btn-decline" class="rsvp-toggle-btn" onclick="setWebRSVPOption('declined')">Regretfully Declines</button>
              </div>

              <div id="web-rsvp-attendance-fields">
                <div class="field-group">
                  <label class="field-label">GUESTS ATTENDING</label>
                  <div class="stepper">
                    <button type="button" class="stepper-btn" onclick="adjustWebGuestStepper(-1)">−</button>
                    <span id="web-guest-stepper-val" style="font-size:16px;font-weight:700;">2 guests</span>
                    <button type="button" class="stepper-btn" onclick="adjustWebGuestStepper(1)">+</button>
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label">DIETARY REQUIREMENTS</label>
                  <input type="text" id="web-rsvp-dietary" class="text-input" placeholder="Vegetarian, nut allergy, gluten-free...">
                </div>

                <div class="field-group">
                  <label class="field-label">SONG THAT'LL GET YOU ON THE DANCE FLOOR</label>
                  <input type="text" id="web-rsvp-song" class="text-input" placeholder="Optional song request">
                </div>
              </div>

              <div id="web-rsvp-declined-message" style="display:none;background:#fbf2eb;border-left:3px solid #d97768;padding:14px;border-radius:4px;font-size:13.5px;color:#6b3b34;margin-bottom:20px;">
                We'll miss you at the celebration! You can change this response anytime before the RSVP cutoff.
              </div>

              <button type="submit" class="btn btn-primary btn-block" style="padding:14px;font-size:15px;font-weight:700;">
                CONFIRM RSVP
              </button>
            </form>

            <div style="text-align:center;font-size:12px;color:var(--muted);margin-top:20px;">
              No account needed — this link is unique to your household
            </div>
          </div>

          <!-- Web RSVP Transitioned Status Card (Image 4 feedback) -->
          <div id="web-rsvp-status-container" style="display:none;">
            <div class="web-rsvp-status-card">
              <div class="rsvp-status-icon-wrap" id="web-rsvp-status-icon" style="margin:0 auto 14px;width:56px;height:56px;border-radius:50%;background:#f2f8f3;border:2px solid #2e7d32;display:flex;align-items:center;justify-content:center;font-size:26px;color:#2e7d32;">✓</div>
              <div class="web-rsvp-status-badge" id="web-rsvp-status-pill">✓ RSVP Confirmed</div>
              <h2 style="font-family:var(--font-heading);font-size:28px;margin-bottom:8px;" id="web-rsvp-status-headline">Joyfully Accepted!</h2>
              <p style="font-size:14px;color:#6b5a4b;margin-bottom:20px;" id="web-rsvp-status-sub">We can't wait to celebrate with you, Priya.</p>

              <div class="web-rsvp-summary-box">
                <div class="rsvp-summary-row" style="display:flex;justify-content:space-between;border-bottom:1px dashed #ede2d5;padding-bottom:10px;">
                  <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Attending</span>
                  <span style="font-weight:600;color:var(--ink);" id="web-rsvp-summary-guests">2 guests</span>
                </div>
                <div class="rsvp-summary-row" style="display:flex;justify-content:space-between;border-bottom:1px dashed #ede2d5;padding-bottom:10px;">
                  <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Dietary Requirements</span>
                  <span style="font-weight:600;color:var(--ink);" id="web-rsvp-summary-dietary">Vegetarian</span>
                </div>
                <div class="rsvp-summary-row" style="display:flex;justify-content:space-between;border-bottom:1px dashed #ede2d5;padding-bottom:10px;">
                  <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Dance Floor Song</span>
                  <span style="font-weight:600;color:var(--ink);" id="web-rsvp-summary-song">September - Earth, Wind &amp; Fire</span>
                </div>
                <div class="rsvp-summary-row" style="display:flex;justify-content:space-between;">
                  <span style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Assigned Seating</span>
                  <span style="font-weight:600;color:var(--ink);" id="web-rsvp-summary-table">Table 4, Seat 3</span>
                </div>
              </div>

              <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;">
                <button type="button" class="btn btn-outline" style="padding:12px 24px;" onclick="enableWebRSVPEdit()">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>Update / Change Response
                </button>
                <button type="button" class="btn btn-primary" style="padding:12px 24px;" onclick="switchWebTab('feed')">
                  View Celebration Feed &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PANE 3: CELEBRATION FEED -->
      <section id="pane-feed" class="tab-pane" aria-labelledby="tab-feed">
        <div class="grid-2col">
          <div>
            <!-- Post a Love Note / Thank-You / Anniversary Wish -->
            <div class="web-card">
              <div class="web-card-header">
                <div>
                  <h3 class="web-card-title" id="web-note-composer-title">Post a Love Note</h3>
                  <div style="font-size:12px;color:var(--muted);margin-top:2px;">Shared directly with Sophie &amp; James</div>
                </div>
              </div>

              <!-- Occasion Category Selector Pills -->
              <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
                <button type="button" class="btn btn-xs btn-gold web-note-cat-btn" id="wncat-general" onclick="selectWebNoteCategory('general')">💌 Love Note</button>
                <button type="button" class="btn btn-xs btn-outline web-note-cat-btn" id="wncat-thankyou" onclick="selectWebNoteCategory('thankyou')">🥂 Wedding Thank-You</button>
                <button type="button" class="btn btn-xs btn-outline web-note-cat-btn" id="wncat-anniversary" onclick="selectWebNoteCategory('anniversary')">💍 1st Anniversary</button>
                <button type="button" class="btn btn-xs btn-outline web-note-cat-btn" id="wncat-honeymoon" onclick="selectWebNoteCategory('honeymoon')">✈️ Honeymoon Love</button>
              </div>

              <!-- Quick Prompt Suggestion Chips -->
              <div id="web-note-quick-chips" style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
                <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('So excited to celebrate your special day with you both! 💕')">✨ So excited to celebrate!</button>
                <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Wishing you both a lifetime of love and happiness! 🥂')">🥂 Lifetime of happiness</button>
              </div>

              <form onsubmit="handleWebPostNoteSubmit(event)" style="display:flex;flex-direction:column;gap:10px;">
                <textarea id="web-new-note-text" class="text-input" rows="3" placeholder="Write a note of congratulations for Sophie &amp; James..."></textarea>
                <button type="submit" id="web-post-note-submit-btn" class="btn btn-gold" style="align-self:flex-end;">Post Love Note</button>
              </form>
            </div>

            <!-- Feed Items Stream -->
            <div id="web-feed-items-container">
              <!-- Injected by JS -->
            </div>
          </div>

          <div>
            <!-- Milestones & Stats Card with Celebration Phase Switcher -->
            <div class="web-card">
              <div class="web-card-header">
                <div>
                  <h3 class="web-card-title">Celebration Phase &amp; Milestones</h3>
                  <div style="font-size:12px;color:var(--muted);margin-top:2px;">Live countdown &amp; post-wedding milestones</div>
                </div>
                <div style="background:rgba(21,17,14,0.06);border:1px solid #ebdccb;border-radius:20px;padding:3px;display:flex;gap:4px;">
                  <button type="button" class="btn btn-xs btn-gold" id="btn-web-phase-countdown" onclick="setWebCelebrationPhase('countdown')" style="font-size:11px;padding:3px 10px;border-radius:14px;">⏳ Pre-Wedding</button>
                  <button type="button" class="btn btn-xs btn-outline" id="btn-web-phase-postwed" onclick="setWebCelebrationPhase('post_wedding')" style="font-size:11px;padding:3px 10px;border-radius:14px;border-color:transparent;">💍 Married &amp; Honeymoon</button>
                </div>
              </div>

              <div id="web-milestone-box" style="background:#15110e;color:#fff;padding:20px;border-radius:8px;border-left:4px solid var(--gold);margin-bottom:18px;">
                <div style="font-size:16px;font-weight:700;color:#fce4ca;display:flex;align-items:center;gap:8px;" id="web-milestone-headline">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>50 guests confirmed</span>
                </div>
                <div style="font-size:13px;color:#cfbfaf;margin-top:4px;" id="web-milestone-sub">You've hit the halfway mark on RSVPs!</div>
              </div>

              <div style="background:#faf8f5;border:1px solid var(--line);border-radius:8px;padding:16px;">
                <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:4px;">Guest Post-Wedding Guide</div>
                <p style="font-size:12.5px;color:#786858;margin:0;line-height:1.5;">
                  After the wedding celebration completes, guests can send 1st anniversary toasts, thank-you tributes, and react with emojis &amp; comments on Sophie &amp; James's live Honeymoon photo album.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PANE 4: SCHEDULE -->
      <section id="pane-schedule" class="tab-pane" aria-labelledby="tab-schedule">
        <div class="web-card">
          <div class="web-card-header">
            <div>
              <h2 class="web-card-title">Order of Events</h2>
              <div style="font-size:13px;color:var(--muted);margin-top:4px;">Saturday, 14 November 2026 · Fernwood Estate, Southern Highlands</div>
            </div>
            <div style="display:flex;gap:10px;">
              <button type="button" class="btn btn-outline btn-sm" onclick="downloadCalendarICS()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>Add to Calendar
              </button>
              <button type="button" class="btn btn-gold btn-sm" onclick="openWebVenueModal()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>Venue Details
              </button>
            </div>
          </div>
          <div id="web-schedule-timeline">
            <!-- Populated by JS -->
          </div>
        </div>
      </section>

      <!-- PANE 5: MY TABLE -->
      <section id="pane-table" class="tab-pane" aria-labelledby="tab-table">
        <div class="grid-2col">
          <div class="web-card" style="text-align:center;padding:36px;">
            <div style="margin-bottom:14px;">
              <span class="tt-pill warm" style="font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:5px;">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Confirmed Seating · View Only
              </span>
            </div>
            <div style="display:inline-grid;place-items:center;width:90px;height:90px;border-radius:50%;border:3px solid var(--gold);background:#fbf8f2;margin-bottom:16px;">
              <span style="font-family:var(--font-heading);font-size:32px;color:var(--gold-hover);font-weight:700;" id="web-table-number">4</span>
            </div>
            <h2 style="font-family:var(--font-heading);font-size:24px;margin-bottom:6px;" id="web-table-name">Table 4</h2>
            <div style="font-size:15px;color:var(--gold-hover);font-weight:600;" id="web-seat-name">Seat 3 · Priya Sharma</div>
            <p style="font-size:13px;color:#857565;margin-top:8px;">Main Pavilion, overlooking the courtyard gardens. Seating is assigned by the Couple and MC Pro. Guests can view their table and seat, but cannot modify assignments.</p>
          </div>

          <div class="web-card">
            <div class="web-card-header">
              <h3 class="web-card-title">Your Tablemates</h3>
              <span class="tt-pill warm">Table 4</span>
            </div>
            <div id="web-tablemates-list" style="display:flex;flex-direction:column;gap:10px;">
              <!-- Populated by JS -->
            </div>
          </div>
        </div>
      </section>

      <!-- PANE 6: PHOTO WALL -->
      <section id="pane-photos" class="tab-pane" aria-labelledby="tab-photos">
        <div class="web-card">
          <div class="web-card-header">
            <div>
              <h2 class="web-card-title">Photo Wall Gallery</h2>
              <div style="font-size:13px;color:var(--muted);">Snap and share wedding memories live with Sophie &amp; James</div>
            </div>
            <label class="btn btn-gold btn-sm" style="cursor:pointer;">
              📷 Upload Photo
              <input type="file" accept="image/*" style="display:none;" onchange="handleWebPhotoUpload(event)">
            </label>
          </div>
          <div class="grid-4col" id="web-photo-grid">
            <!-- Populated by JS -->
          </div>
        </div>
      </section>

      <!-- PANE 7: GIFTS -->
      <section id="pane-gifts" class="tab-pane" aria-labelledby="tab-gifts">
        <div class="rsvp-web-box">
          <div style="text-align:center;margin-bottom:24px;">
            <div class="web-hero-eyebrow">DIGITAL WISHING WELL</div>
            <h2 style="font-family:var(--font-heading);font-size:28px;">Gift &amp; Go</h2>
            <p style="font-size:14px;color:#6b5a4b;margin-top:6px;">
              Contribute to Sophie &amp; James's honeymoon fund securely.
            </p>
          </div>

          <div class="grid-2col" style="margin-bottom:20px;">
            <button type="button" class="preset-btn" onclick="selectWebGift(50)">$50 AUD</button>
            <button type="button" class="preset-btn active" onclick="selectWebGift(100)">$100 AUD</button>
            <button type="button" class="preset-btn" onclick="selectWebGift(150)">$150 AUD</button>
            <button type="button" class="preset-btn" onclick="selectWebGift(250)">$250 AUD</button>
          </div>

          <div class="field-group">
            <label class="field-label">OR CUSTOM AMOUNT (AUD)</label>
            <input type="number" id="web-custom-amount" class="text-input" placeholder="e.g. 300" oninput="handleWebCustomAmount(this.value)">
          </div>

          <div class="field-group">
            <label class="field-label">PERSONALISED MESSAGE</label>
            <textarea id="web-gift-note" class="text-input" rows="3" placeholder="Wishing you both a lifetime of love and laughter..."></textarea>
          </div>

          <button type="button" class="btn btn-primary btn-block" style="padding:14px;font-size:15px;font-weight:700;" onclick="openWebCheckoutModal()">
            Send <span id="web-gift-btn-amt">$100 AUD</span> Gift via Card / Apple Pay
          </button>
        </div>
      </section>

      <!-- PANE 8: REUSABLE CONTENT PAGES (Feature 1) -->
      <section id="pane-pages" class="tab-pane" aria-labelledby="tab-pages">
        <div class="web-card" style="max-width:880px;margin:0 auto 24px;">
          <div style="text-align:center;margin-bottom:20px;">
            <div class="web-hero-eyebrow">WEDDING STORIES &amp; DETAILS</div>
            <h2 style="font-family:var(--font-heading);font-size:28px;margin-bottom:6px;">Our Story &amp; Details</h2>
            <p style="font-size:13.5px;color:var(--muted);margin:0;">
              Explore the story of our journey, dedicated memoriam, dining menu, wedding party team, and honeymoon plans.
            </p>
          </div>

          <!-- Page Selection Pills -->
          <div style="display:flex;gap:8px;margin-bottom:24px;overflow-x:auto;padding-bottom:6px;justify-content:center;" id="web-pages-nav-strip">
            <button type="button" class="btn btn-sm btn-gold web-pnav-btn" id="wpnav-ourStory" onclick="selectGuestWebPage('ourStory')">📖 Our Story</button>
            <button type="button" class="btn btn-sm btn-outline web-pnav-btn" id="wpnav-inMemoriam" onclick="selectGuestWebPage('inMemoriam')">🕊️ In Memoriam</button>
            <button type="button" class="btn btn-sm btn-outline web-pnav-btn" id="wpnav-diningMenu" onclick="selectGuestWebPage('diningMenu')">🍽️ Dining &amp; Menu</button>
            <button type="button" class="btn btn-sm btn-outline web-pnav-btn" id="wpnav-meetTheTeam" onclick="selectGuestWebPage('meetTheTeam')">👥 Meet the Team</button>
            <button type="button" class="btn btn-sm btn-outline web-pnav-btn" id="wpnav-honeymoonUpdates" onclick="selectGuestWebPage('honeymoonUpdates')">✈️ Honeymoon Updates</button>
          </div>

          <!-- Active Page Reader Container -->
          <div id="web-page-reader-container" style="background:#faf8f5;border:1px solid var(--line);border-radius:10px;padding:32px 36px;box-shadow:var(--shadow-sm);">
            <!-- Rendered by JS -->
          </div>
        </div>
      </section>

      </div>
    </main>
  </div><!-- End guest-main-wrap -->
</div><!-- End guest-web-shell -->

  <!-- Chatbot Concierge Embedded -->
  {chatbot_html}

  <!-- Toast Notification Container -->
  <div id="tt-toast-container" class="tt-toast-container"></div>

  <!-- Mock Checkout Modal -->
  <div id="web-checkout-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Gift &amp; Go Checkout</div>
        <button type="button" class="tt-modal-close" onclick="closeWebCheckoutModal()">✕</button>
      </div>
      <div class="tt-modal-body">
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Contributing to Sophie &amp; James</div>
          <div style="font-family:var(--font-heading);font-size:32px;color:var(--gold-hover);font-weight:700;" id="web-modal-checkout-amt">$100 AUD</div>
        </div>

        <div style="background:#f9f6f0;border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:16px;">
          <div style="font-size:12px;font-weight:700;color:var(--ink);">Mock Payment Simulation</div>
          <div style="font-size:11.5px;color:#786858;">Instant test transaction — updates wedding gifts pool and celebration feed immediately.</div>
        </div>

        <div class="field-group">
          <label class="field-label">Cardholder Name</label>
          <input type="text" id="web-checkout-name" class="text-input" value="Priya Sharma">
        </div>
        <div class="field-group">
          <label class="field-label">Card Number</label>
          <input type="text" class="text-input" value="•••• •••• •••• 4242" readonly>
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeWebCheckoutModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="processWebMockPayment()">Pay Securely</button>
      </div>
    </div>
  </div>

  <!-- Guest Web Venue & Logistics Modal (Image 1 feedback) -->
  <div id="web-venue-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal" style="max-width:680px;max-height:90vh;overflow-y:auto;">
      <div class="tt-modal-header">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;">LOCATION &amp; LOGISTICS</div>
          <div class="tt-modal-title" style="font-family:var(--font-heading);font-size:22px;">Venue &amp; Travel Details</div>
        </div>
        <button type="button" class="tt-modal-close" onclick="closeWebVenueModal()">✕</button>
      </div>
      <div class="tt-modal-body" style="padding:22px 24px;">
        <!-- Venue Card -->
        <div style="background:#faf7f2;border:1px solid var(--line);border-top:3px solid var(--gold);border-radius:8px;padding:20px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="width:38px;height:38px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div>
              <h3 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);margin:0;">Fernwood Estate</h3>
              <span style="font-size:12.5px;color:var(--muted);">Southern Highlands, NSW</span>
            </div>
          </div>
          <div style="font-size:14px;color:var(--ink);line-height:1.5;margin-bottom:12px;">
            <strong>124 Range Road, Mittagong NSW 2575, Australia</strong>
          </div>
          <div style="background:#ffffff;border:1px solid var(--line);border-radius:6px;padding:12px 14px;font-size:12.5px;color:#5a4a3c;line-height:1.6;">
            <div><strong>Ceremony:</strong> 2:00 PM · The Lower Meadow Lawns</div>
            <div><strong>Cocktail Hour &amp; Reception:</strong> 5:00 PM · The Grand Pavilion</div>
            <div><strong>Venue Concierge:</strong> (02) 4871 2000 · concierge@fernwoodestate.demo</div>
          </div>
        </div>

        <!-- Parking & Transport Two Column -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <!-- Parking Facilities -->
          <div style="background:#ffffff;border:1px solid var(--line);border-radius:8px;padding:18px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <div style="width:32px;height:32px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>
              </div>
              <h4 style="font-family:var(--font-heading);font-size:15px;color:var(--ink);margin:0;">Guest Parking</h4>
            </div>
            <p style="font-size:12px;color:var(--ink);line-height:1.5;margin-bottom:8px;">
              Complimentary on-site guest parking is available at the Main Lawn entrance.
            </p>
            <ul style="padding-left:16px;margin:0;font-size:11.5px;color:#5a4a3c;line-height:1.5;">
              <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
              <li><strong>Valet attendants:</strong> From 1:15 PM at porte-cochère.</li>
              <li><strong>EV Charging:</strong> 4 Type-2 chargers at North Parking.</li>
              <li><strong>Overnight:</strong> Permitted until 11:00 AM Sunday.</li>
            </ul>
          </div>

          <!-- Transport & Shuttles -->
          <div style="background:#ffffff;border:1px solid var(--line);border-radius:8px;padding:18px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <div style="width:32px;height:32px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"></rect><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>
              </div>
              <h4 style="font-family:var(--font-heading);font-size:15px;color:var(--ink);margin:0;">Guest Shuttles</h4>
            </div>
            <p style="font-size:12px;color:var(--ink);line-height:1.5;margin-bottom:8px;">
              Scheduled transfers between Southern Highlands hotels and Fernwood Estate:
            </p>
            <div style="font-size:11.5px;color:#5a4a3c;line-height:1.5;">
              <div style="margin-bottom:6px;"><strong>Pickups:</strong> Bowral Grand &amp; Mittagong Station from 1:00 PM.</div>
              <div><strong>Return Shuttles:</strong> Leave at 10:00 PM &amp; 11:30 PM.</div>
            </div>
          </div>
        </div>

        <!-- Google Maps Link Card -->
        <div style="background:#17120f;color:#f7f3ee;border:1px solid #382c20;border-radius:8px;padding:18px;text-align:center;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;margin-bottom:4px;">INTERACTIVE NAVIGATION</div>
          <h4 style="font-family:var(--font-heading);font-size:17px;color:#fff;margin:0 0 6px;">Open in Google Maps</h4>
          <p style="font-size:12.5px;color:#cfbfaf;margin-bottom:14px;">Get turn-by-turn GPS driving instructions straight to the entrance gates.</p>
          <a href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575" target="_blank" rel="noopener noreferrer" class="btn btn-gold" style="text-decoration:none;font-size:13.5px;padding:10px 22px;display:inline-flex;align-items:center;gap:8px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            Open Live Map &amp; Directions ↗
          </a>
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-primary" onclick="closeWebVenueModal()">Close</button>
      </div>
    </div>
  </div>

  <script>
{shared_js}
{chatbot_js}

/* Guest Web Application Logic */
let activeGuest = null;
let webGuestCount = 2;
let webSelectedGift = 100;
let webRSVPStatus = 'confirmed';

document.addEventListener('DOMContentLoaded', () => {{
  initWebGuest();
  setInterval(updateWebCountdown, 1000);
  window.addEventListener('storage', () => initWebGuest());
  window.addEventListener('tt_state_changed', () => initWebGuest());
}});

function updateWebCountdown() {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  const cd = getWeddingCountdown(wedding.date);
  const display = document.getElementById('web-countdown-display');
  if (display) display.textContent = cd.formatted;
}}

function initWebGuest() {{
  const state = loadState();
  const urlParams = new URLSearchParams(window.location.search);
  const guestId = urlParams.get('g') || 'priya';
  
  activeGuest = state.guests.find(g => g.id === guestId) || state.guests[0];
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  
  updateWebCountdown();

  // Auto-dismiss temporary QaRd banner after 3.5s with smooth UI adjustment
  setTimeout(() => {{
    const banner = document.getElementById('web-qard-scanned-banner');
    if (banner) {{
      banner.classList.add('banner-hidden');
      setTimeout(() => {{
        banner.style.display = 'none';
      }}, 650);
    }}
  }}, 3500);

  document.getElementById('web-hero-guest').textContent = `Welcome, ${{activeGuest.name.split(' ')[0]}}`;
  document.getElementById('hub-welcome-pill').textContent = `Guest: ${{activeGuest.name}}`;
  document.getElementById('web-hero-qr').innerHTML = generateQrSvg(`guest-mobile.html?g=${{activeGuest.id}}`, 72);
  
  // Hub Tiles
  document.getElementById('web-hub-ceremony').textContent = `Ceremony at ${{wedding.timeDisplay}}`;
  const assignedTable = state.tables.find(t => t.id === activeGuest.tableId);
  const tableName = assignedTable ? assignedTable.name : 'Table 4';
  const seatNum = (activeGuest.seatIndex !== null && activeGuest.seatIndex !== undefined) ? activeGuest.seatIndex + 1 : 3;
  document.getElementById('web-hub-table').textContent = `${{tableName}}, Seat ${{seatNum}}`;
  
  // RSVP Form
  webGuestCount = activeGuest.guestCount || 2;
  webRSVPStatus = activeGuest.rsvpStatus || 'confirmed';
  document.getElementById('web-guest-stepper-val').textContent = `${{webGuestCount}} ${{webGuestCount === 1 ? 'guest' : 'guests'}}`;
  document.getElementById('web-rsvp-dietary').value = activeGuest.dietary || '';
  document.getElementById('web-rsvp-song').value = activeGuest.song || '';
  document.getElementById('web-rsvp-greeting').innerHTML = `Hi <strong>${{escapeHtml(activeGuest.name.split(' ')[0])}}</strong> — we'd love for you to celebrate with us.`;
  setWebRSVPOption(webRSVPStatus);
  
  renderWebFeed();
  renderWebSchedule();
  renderWebTablemates();
  renderWebPhotoWall();
  renderGuestWebPages();
}}

let currentGuestWebPageKey = 'ourStory';

function renderGuestWebPages() {{
  const state = loadState();
  const pages = state.reusablePages || {{}};
  const page = pages[currentGuestWebPageKey] || {{
    title: 'Our Story',
    subtitle: 'From a chance encounter in Bowral to forever in the Southern Highlands',
    status: 'Published',
    content: 'Sophie and James first met on a crisp autumn afternoon in Bowral. What began as a conversation over flat whites at a local bakery quickly turned into long weekend drives through the rolling hills of the Southern Highlands.',
    photoCaption: 'A crisp autumn afternoon in Bowral where our journey began',
    photoTheme: '💍'
  }};

  ['ourStory', 'inMemoriam', 'diningMenu', 'meetTheTeam', 'honeymoonUpdates'].forEach(k => {{
    const btn = document.getElementById('wpnav-' + k);
    if (btn) {{
      btn.className = (k === currentGuestWebPageKey) ? 'btn btn-sm btn-gold web-pnav-btn' : 'btn btn-sm btn-outline web-pnav-btn';
    }}
  }});

  const container = document.getElementById('web-page-reader-container');
  if (!container) return;

  if (page.status !== 'Published') {{
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;">
        <div style="font-size:36px;margin-bottom:12px;">⏳</div>
        <h3 style="font-family:var(--font-heading);font-size:20px;color:var(--ink);margin-bottom:6px;">${{escapeHtml(page.title)}}</h3>
        <p style="font-size:13.5px;color:var(--muted);max-width:440px;margin:0 auto;">
          This story section is currently being drafted by Sophie &amp; James and will be published closer to wedding day.
        </p>
      </div>
    `;
    return;
  }}

  if (currentGuestWebPageKey === 'honeymoonUpdates' && page.photos && page.photos.length > 0) {{
    const photosHtml = page.photos.map(photo => {{
      const reactions = photo.reactions || {{ love: 0, toast: 0, stunning: 0, voyage: 0 }};
      const comments = photo.comments || [];
      return `
        <div class="web-card" style="margin-bottom:24px;padding:24px;border:1px solid #e8ded0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;font-weight:700;color:var(--gold-hover);letter-spacing:1px;text-transform:uppercase;">📍 ${{escapeHtml(photo.location)}}</span>
            <span style="font-size:22px;">${{photo.icon || '✈️'}}</span>
          </div>
          <h3 style="font-family:var(--font-heading);font-size:22px;color:var(--ink);margin:0 0 10px;">${{escapeHtml(photo.title)}}</h3>

          <!-- Photo Canvas Mockup -->
          <div style="background:linear-gradient(135deg, #2b221a 0%, #15110e 100%);color:#fff;border-radius:10px;padding:36px 24px;text-align:center;margin-bottom:16px;">
            <div style="font-size:48px;margin-bottom:10px;">${{photo.icon || '✈️'}}</div>
            <div style="font-size:15px;color:#dfc194;font-style:italic;max-width:580px;margin:0 auto;line-height:1.6;">"${{escapeHtml(photo.caption)}}"</div>
          </div>

          <!-- Interactive Live Reactions Bar -->
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;">
            <button type="button" class="btn btn-outline btn-sm hm-react-btn" onclick="reactToWebHoneymoonPhoto('${{photo.id}}', 'love')">
              ❤️ Love <span id="react-count-web-${{photo.id}}-love">${{reactions.love || 0}}</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm hm-react-btn" onclick="reactToWebHoneymoonPhoto('${{photo.id}}', 'toast')">
              🥂 Toast <span id="react-count-web-${{photo.id}}-toast">${{reactions.toast || 0}}</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm hm-react-btn" onclick="reactToWebHoneymoonPhoto('${{photo.id}}', 'stunning')">
              😍 Stunning <span id="react-count-web-${{photo.id}}-stunning">${{reactions.stunning || 0}}</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm hm-react-btn" onclick="reactToWebHoneymoonPhoto('${{photo.id}}', 'voyage')">
              ✈️ Bon Voyage <span id="react-count-web-${{photo.id}}-voyage">${{reactions.voyage || 0}}</span>
            </button>
          </div>

          <!-- Guest Comments Thread -->
          <div style="background:#faf8f5;border-radius:8px;padding:16px 20px;border:1px solid #ebdccb;">
            <div style="font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px;">
              💬 Guest Comments (${{comments.length}})
            </div>
            <div id="web-hm-comments-list-${{photo.id}}" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
              ${{comments.map(c => `
                <div style="font-size:13px;line-height:1.45;background:#fff;padding:8px 12px;border-radius:6px;border:1px solid #eedecf;">
                  <strong style="color:var(--ink);">${{escapeHtml(c.author)}}:</strong>
                  <span style="color:#4a3c30;">${{escapeHtml(c.text)}}</span>
                  <span style="font-size:11px;color:var(--muted);margin-left:8px;">${{escapeHtml(c.time || 'Recently')}}</span>
                </div>
              `).join('')}}
            </div>
            <div style="display:flex;gap:10px;">
              <input type="text" id="input-web-hm-${{photo.id}}" class="text-input" style="padding:8px 12px;font-size:13px;" placeholder="Leave a sweet comment for Sophie &amp; James...">
              <button type="button" class="btn btn-gold btn-sm" onclick="postWebHoneymoonComment('${{photo.id}}')">Post Comment</button>
            </div>
          </div>
        </div>
      `;
    }}).join('');

    container.innerHTML = `
      <div style="text-align:center;margin-bottom:24px;border-bottom:1px solid #ebdccb;padding-bottom:20px;">
        <div style="font-size:36px;margin-bottom:8px;">✈️</div>
        <h2 style="font-family:var(--font-heading);font-size:30px;color:var(--ink);margin:0 0 8px;">${{escapeHtml(page.title)}}</h2>
        <div style="font-size:14.5px;color:var(--gold-hover);font-style:italic;">${{escapeHtml(page.subtitle)}}</div>
        <p style="font-size:14px;color:var(--muted);max-width:680px;margin:10px auto 0;line-height:1.6;">
          ${{escapeHtml(page.content || '').replace(/\\n/g, '<br>')}}
        </p>
      </div>

      <div style="max-width:820px;margin:0 auto;">
        <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold-hover);margin-bottom:12px;">
          📷 Live Honeymoon Photo Stream &amp; Guest Reactions
        </div>
        ${{photosHtml}}
      </div>
    `;
    return;
  }}

  const paragraphs = (page.content || '').split('\\n\\n').filter(Boolean).map(p => `<p style="font-size:14.5px;line-height:1.75;color:#453628;margin-bottom:16px;">${{escapeHtml(p).replace(/\\n/g, '<br>')}}</p>`).join('');

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:24px;border-bottom:1px solid #ebdccb;padding-bottom:20px;">
      <div style="font-size:36px;margin-bottom:8px;">${{page.photoTheme || '✨'}}</div>
      <h2 style="font-family:var(--font-heading);font-size:30px;color:var(--ink);margin:0 0 8px;">${{escapeHtml(page.title)}}</h2>
      ${{page.subtitle ? `<div style="font-size:14.5px;color:var(--gold-hover);font-style:italic;">${{escapeHtml(page.subtitle)}}</div>` : ''}}
    </div>

    <!-- Featured Photo Display -->
    <div style="background:linear-gradient(135deg, #f5efe6 0%, #ece2d3 100%);border:1px solid #d9c8b4;border-radius:10px;padding:32px 24px;text-align:center;margin-bottom:28px;">
      <div style="font-size:36px;margin-bottom:8px;">📷</div>
      <div style="font-size:14px;color:#4f3d2e;font-weight:600;">${{escapeHtml(page.photoCaption || 'Featured Photograph')}}</div>
      <div style="font-size:11.5px;color:#8f7d6d;margin-top:4px;">Captured in the Southern Highlands · Fernwood Estate</div>
    </div>

    <div style="max-width:720px;margin:0 auto;text-align:left;">
      ${{paragraphs}}
    </div>
  `;
}}

function selectGuestWebPage(key) {{
  currentGuestWebPageKey = key;
  renderGuestWebPages();
}}

function switchWebTab(tabKey) {{
  document.querySelectorAll('.guest-nav-item').forEach(btn => {{
    btn.classList.toggle('active', btn.id === 'web-nav-' + tabKey);
  }});

  document.querySelectorAll('.tab-pane').forEach(pane => {{
    pane.classList.remove('active');
  }});
  
  const activePane = document.getElementById('pane-' + tabKey);
  if (activePane) activePane.classList.add('active');
  window.scrollTo({{ top: 0, behavior: 'smooth' }});
}}

function setWebRSVPOption(status) {{
  webRSVPStatus = status;
  const isAccept = status === 'confirmed';
  document.getElementById('web-btn-accept').classList.toggle('active', isAccept);
  document.getElementById('web-btn-decline').classList.toggle('active', !isAccept);
  
  const fields = document.getElementById('web-rsvp-attendance-fields');
  const declineMsg = document.getElementById('web-rsvp-declined-message');
  
  if (isAccept) {{
    fields.style.display = 'block';
    declineMsg.style.display = 'none';
  }} else {{
    fields.style.display = 'none';
    declineMsg.style.display = 'block';
  }}
}}

function adjustWebGuestStepper(delta) {{
  webGuestCount = Math.min(5, Math.max(1, webGuestCount + delta));
  document.getElementById('web-guest-stepper-val').textContent = `${{webGuestCount}} ${{webGuestCount === 1 ? 'guest' : 'guests'}}`;
}}

function renderWebRSVPStatusView(guest) {{
  const isAccepted = guest.rsvpStatus === 'confirmed';
  const formWrap = document.getElementById('web-rsvp-form-container');
  const statusWrap = document.getElementById('web-rsvp-status-container');
  if (!formWrap || !statusWrap) return;
  
  formWrap.style.display = 'none';
  statusWrap.style.display = 'block';
  
  const icon = document.getElementById('web-rsvp-status-icon');
  const pill = document.getElementById('web-rsvp-status-pill');
  const headline = document.getElementById('web-rsvp-status-headline');
  const sub = document.getElementById('web-rsvp-status-sub');
  const guestsVal = document.getElementById('web-rsvp-summary-guests');
  const dietaryVal = document.getElementById('web-rsvp-summary-dietary');
  const songVal = document.getElementById('web-rsvp-summary-song');
  const tableVal = document.getElementById('web-rsvp-summary-table');
  
  const guestFirstName = guest.name ? guest.name.split(' ')[0] : 'Guest';
  
  if (isAccepted) {{
    if (icon) {{
      icon.textContent = '✓';
      icon.style.background = '#f2f8f3';
      icon.style.borderColor = '#2e7d32';
      icon.style.color = '#2e7d32';
    }}
    if (pill) {{
      pill.textContent = '✓ RSVP Confirmed';
      pill.className = 'web-rsvp-status-badge';
    }}
    if (headline) headline.textContent = 'Joyfully Accepted!';
    if (sub) sub.textContent = `We can\\'t wait to celebrate with you, ${{guestFirstName}}.`;
    if (guestsVal) guestsVal.textContent = `${{guest.guestCount || 1}} ${{(guest.guestCount || 1) === 1 ? 'guest' : 'guests'}}`;
    if (dietaryVal) dietaryVal.textContent = guest.dietary || 'None specified';
    if (songVal) songVal.textContent = guest.song || 'None requested';
  }} else {{
    if (icon) {{
      icon.textContent = '💌';
      icon.style.background = '#fcf4f2';
      icon.style.borderColor = '#d97768';
      icon.style.color = '#d97768';
    }}
    if (pill) {{
      pill.textContent = 'Response Recorded';
      pill.className = 'web-rsvp-status-badge declined';
    }}
    if (headline) headline.textContent = 'Regretfully Declined';
    if (sub) sub.textContent = `We\\'ll miss you at the celebration, ${{guestFirstName}}!`;
    if (guestsVal) guestsVal.textContent = '0 guests';
    if (dietaryVal) dietaryVal.textContent = 'N/A';
    if (songVal) songVal.textContent = 'N/A';
  }}
  
  const state = loadState();
  const assignedTable = state.tables.find(t => t.id === guest.tableId);
  const tableName = assignedTable ? assignedTable.name : 'Table 4';
  const seatNum = (guest.seatIndex !== null && guest.seatIndex !== undefined) ? guest.seatIndex + 1 : 3;
  if (tableVal) {{
    tableVal.textContent = isAccepted ? `${{tableName}}, Seat ${{seatNum}}` : 'Not attending';
  }}
}}

function enableWebRSVPEdit() {{
  const formWrap = document.getElementById('web-rsvp-form-container');
  const statusWrap = document.getElementById('web-rsvp-status-container');
  if (formWrap) formWrap.style.display = 'block';
  if (statusWrap) statusWrap.style.display = 'none';
}}

function handleWebRSVPSubmit(e) {{
  e.preventDefault();
  const state = loadState();
  const guestIndex = state.guests.findIndex(g => g.id === activeGuest.id);
  if (guestIndex === -1) return;
  
  const dietary = document.getElementById('web-rsvp-dietary').value.trim();
  const song = document.getElementById('web-rsvp-song').value.trim();
  
  state.guests[guestIndex].rsvpStatus = webRSVPStatus;
  state.guests[guestIndex].guestCount = webRSVPStatus === 'confirmed' ? webGuestCount : 0;
  state.guests[guestIndex].dietary = dietary;
  state.guests[guestIndex].song = song;
  
  const guestName = activeGuest.name;
  if (webRSVPStatus === 'confirmed') {{
    state.feed.unshift({{
      id: 'f_rsvp_' + Date.now(),
      type: 'rsvp',
      author: guestName,
      title: `${{guestName}} confirmed`,
      subtitle: `Attending${{webGuestCount > 1 ? ', +' + (webGuestCount - 1) + ' guest' : ' · no plus-one'}}${{dietary ? ' · dietary: ' + dietary : ''}}`,
      time: 'Just now',
      likes: 1,
      comments: [],
      pinned: false,
      hidden: false
    }});
    logAudit('RSVP Confirmed', guestName, `Confirmed for ${{webGuestCount}} guests (${{dietary || 'Standard'}})`, 'RSVP');
    showToast(`RSVP confirmed for ${{webGuestCount}} guest(s)! Thank you!`, 'success');
  }} else {{
    logAudit('RSVP Declined', guestName, 'Declined wedding invitation', 'RSVP');
    showToast('RSVP response recorded. We will miss you!', 'info');
  }}
  
  saveState(state);
  activeGuest = state.guests[guestIndex];
  renderWebRSVPStatusView(activeGuest);
  renderWebFeed();
}}

function renderWebFeed() {{
  const state = loadState();
  const feedItems = state.feed || [];
  const container = document.getElementById('web-feed-items-container');
  const preview = document.getElementById('web-hub-feed-preview');
  if (!container) return;
  
  const visible = feedItems.filter(f => !f.hidden);
  
  container.innerHTML = visible.map(item => {{
    let glyph = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>';
    if (item.type === 'gift') {{
      glyph = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line></svg>';
    }} else if (item.type === 'rsvp') {{
      glyph = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    }} else if (item.type === 'photo') {{
      glyph = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
    }} else if (item.type === 'milestone') {{
      glyph = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    }}
    
    let quoteHtml = item.quote ? `<div style="background:#fbf9f5;border-left:3px solid var(--gold);padding:10px 14px;border-radius:0 6px 6px 0;font-style:italic;color:#4a3c30;margin:10px 0;">"${{escapeHtml(item.quote)}}"</div>` : '';
    let photoHtml = item.photoDesc ? `<div style="background:#efe7db;padding:24px;border-radius:6px;text-align:center;font-style:italic;color:#6b5a4b;margin:10px 0;font-family:var(--font-heading);">"${{escapeHtml(item.photoDesc)}}"</div>` : '';
    
    let repliesHtml = '';
    if (item.replies && item.replies.length > 0) {{
      repliesHtml = item.replies.map(r => `
        <div style="background:#fcf9f2;border:1px solid #eadbca;border-left:3px solid var(--gold);padding:8px 12px;border-radius:4px;margin-top:8px;font-size:12.5px;">
          <div style="display:flex;align-items:center;gap:6px;font-weight:700;color:#9b723a;margin-bottom:2px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> <span>${{escapeHtml(r.author || 'Sophie & James')}} (Couple)</span>
          </div>
          <div style="color:#2a2018;">${{escapeHtml(r.text)}}</div>
          <div style="font-size:10px;color:#9b8c7c;margin-top:3px;">${{escapeHtml(r.time || 'Just now')}}</div>
        </div>
      `).join('');
    }}
    
    return `
      <div class="feed-card" id="web-${{item.id}}">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px;">
          <div class="feed-glyph">${{glyph}}</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span>${{escapeHtml(item.title)}}</span>
              ${{item.badge ? `<span class="tt-pill gold" style="font-size:10px;padding:2px 6px;">${{escapeHtml(item.badge)}}</span>` : ''}}
            </div>
            <div style="font-size:12px;color:var(--muted);">${{escapeHtml(item.subtitle || '')}}</div>
          </div>
          <span style="font-size:11.5px;color:#a49484;">${{escapeHtml(item.time)}}</span>
        </div>
        ${{quoteHtml}}
        ${{photoHtml}}
        ${{repliesHtml}}
        <div style="display:flex;align-items:center;gap:16px;margin-top:10px;padding-top:8px;border-top:1px solid #f2ece3;">
          <button type="button" class="feed-action-btn" onclick="likeFeedItem('${{item.id}}')">
            ❤️ <span>${{item.likes || 0}}</span> Likes
          </button>
          <button type="button" class="feed-action-btn" onclick="toggleFeedComments('web-${{item.id}}')">
            💬 <span>${{item.comments ? item.comments.length : 0}}</span> Comments
          </button>
        </div>
        <div id="comments-web-${{item.id}}" style="display:none;flex-direction:column;gap:6px;margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);">
          ${{(item.comments || []).map(c => `<div style="background:#f6f2ea;padding:6px 12px;border-radius:6px;font-size:12.5px;">${{escapeHtml(c)}}</div>`).join('')}}
          <div style="display:flex;gap:6px;margin-top:6px;">
            <input type="text" id="input-web-comm-${{item.id}}" class="text-input" style="padding:6px 10px;font-size:12px;" placeholder="Write a comment...">
            <button type="button" class="btn btn-gold btn-sm" onclick="addWebFeedComment('${{item.id}}')">Send</button>
          </div>
        </div>
      </div>
    `;
  }}).join('');

  if (preview) {{
    const top3 = visible.slice(0, 3);
    preview.innerHTML = top3.map(item => {{
      let icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>';
      if (item.type === 'milestone') {{
        icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
      }} else if (item.type === 'gift') {{
        icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line></svg>';
      }} else if (item.type === 'rsvp') {{
        icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      }} else if (item.type === 'photo') {{
        icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
      }}
      return `
        <div style="padding:10px 0;border-bottom:1px solid #f2ece3;display:flex;gap:12px;align-items:center;">
          <div style="width:32px;height:32px;border-radius:6px;background:#faf6f0;border:1px solid #ede3d5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${{icon}}
          </div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:600;">${{escapeHtml(item.title)}}</div>
            <div style="font-size:11.5px;color:var(--muted);">${{escapeHtml(item.subtitle || item.quote || item.time)}}</div>
          </div>
        </div>
      `;
    }}).join('');
  }}
}}

let currentWebNoteCategory = 'general';
let currentWebCelebrationPhase = 'countdown';

function selectWebNoteCategory(cat) {{
  currentWebNoteCategory = cat;
  document.querySelectorAll('.web-note-cat-btn').forEach(b => {{
    b.className = b.id === 'wncat-' + cat ? 'btn btn-xs btn-gold web-note-cat-btn' : 'btn btn-xs btn-outline web-note-cat-btn';
  }});

  const textarea = document.getElementById('web-new-note-text');
  const pill = document.getElementById('web-note-category-pill');
  const title = document.getElementById('web-note-composer-title');
  const btn = document.getElementById('web-post-note-submit-btn');
  const chips = document.getElementById('web-note-quick-chips');

  if (cat === 'thankyou') {{
    if (pill) pill.textContent = '🥂 Wedding Thank-You';
    if (title) title.textContent = 'Thank Couple for Wedding';
    if (btn) btn.textContent = 'Post Thank-You';
    if (textarea) textarea.placeholder = 'Thank Sophie & James for an unforgettable wedding...';
    if (chips) {{
      chips.innerHTML = `
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Thank you Sophie &amp; James for the most magnificent wedding day! Truly unforgettable. 🥂')">🥂 Most magnificent wedding day</button>
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Honoured to celebrate your love! Everything was flawless from ceremony to dancing. ✨')">✨ Everything was flawless</button>
      `;
    }}
  }} else if (cat === 'anniversary') {{
    if (pill) pill.textContent = '💍 1st Anniversary';
    if (title) title.textContent = 'Send 1st Anniversary Toast';
    if (btn) btn.textContent = 'Send Anniversary Toast';
    if (textarea) textarea.placeholder = 'Wish Sophie & James a Happy 1st Wedding Anniversary...';
    if (chips) {{
      chips.innerHTML = `
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Happy 1st Anniversary Sophie &amp; James! Wishing you both endless love, laughter, and joy! 💍')">💍 Happy 1st Anniversary!</button>
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('One year down, a lifetime of love to go! Celebrating you both today! 🥂')">🥂 One year down, lifetime to go</button>
      `;
    }}
  }} else if (cat === 'honeymoon') {{
    if (pill) pill.textContent = '✈️ Honeymoon Love';
    if (title) title.textContent = 'Send Honeymoon Wish';
    if (btn) btn.textContent = 'Send Honeymoon Wish';
    if (textarea) textarea.placeholder = 'Send Sophie & James love for their honeymoon adventure...';
    if (chips) {{
      chips.innerHTML = `
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Have the time of your lives in Italy &amp; Switzerland! Soak in every sunset! ✈️')">✈️ Have the time of your lives!</button>
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Enjoy every Vespa ride and glass of Tuscan wine! Sending so much love! 🍷')">🍷 Enjoy every Vespa ride &amp; wine</button>
      `;
    }}
  }} else {{
    if (pill) pill.textContent = '💌 Love Note';
    if (title) title.textContent = 'Post a Love Note';
    if (btn) btn.textContent = 'Post Love Note';
    if (textarea) textarea.placeholder = 'Write a note of congratulations for Sophie &amp; James...';
    if (chips) {{
      chips.innerHTML = `
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('So excited to celebrate your special day with you both! 💕')">✨ So excited to celebrate!</button>
        <button type="button" class="btn btn-xs btn-outline" style="font-size:11px;padding:3px 8px;background:#faf6f0;border-color:#e4d7c7;" onclick="insertWebNotePreset('Wishing you both a lifetime of love and happiness! 🥂')">🥂 Lifetime of happiness</button>
      `;
    }}
  }}
}}

function insertWebNotePreset(text) {{
  const textarea = document.getElementById('web-new-note-text');
  if (textarea) {{
    textarea.value = text;
    textarea.focus();
  }}
}}

function setWebCelebrationPhase(phase) {{
  currentWebCelebrationPhase = phase;
  const btnCount = document.getElementById('btn-web-phase-countdown');
  const btnPost = document.getElementById('btn-web-phase-postwed');
  if (btnCount) {{
    btnCount.className = phase === 'countdown' ? 'btn btn-xs btn-gold' : 'btn btn-xs btn-outline';
    if (phase !== 'countdown') {{ btnCount.style.borderColor = 'transparent'; }}
  }}
  if (btnPost) {{
    btnPost.className = phase === 'post_wedding' ? 'btn btn-xs btn-gold' : 'btn btn-xs btn-outline';
    if (phase !== 'post_wedding') {{ btnPost.style.borderColor = 'transparent'; }}
  }}

  const box = document.getElementById('web-milestone-box');
  if (phase === 'post_wedding') {{
    if (box) {{
      box.style.background = '#201813';
      box.style.border = '1px solid #73593b';
      box.innerHTML = `
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);">💍 1ST ANNIVERSARY &amp; HONEYMOON MEMORIES</div>
        <div style="font-size:18px;font-weight:700;color:#fff;margin:6px 0 3px;">Sophie &amp; James are Celebrating 1 Year!</div>
        <div style="font-size:13px;color:#dfc194;margin-bottom:12px;">Married 14 November 2026 · Exploring Italy &amp; Swiss Alps</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-xs btn-gold" onclick="selectWebNoteCategory('anniversary'); document.getElementById('web-new-note-text').scrollIntoView({{behavior:'smooth'}});">🥂 Send 1st Anniversary Toast</button>
          <button type="button" class="btn btn-xs btn-outline" style="color:#dfc194;border-color:#73593b;" onclick="openWebGuestHoneymoonGallery()">✈️ Honeymoon Photos &amp; React</button>
        </div>
      `;
    }}
    selectWebNoteCategory('anniversary');
  }} else {{
    if (box) {{
      box.style.background = '#15110e';
      box.style.border = '';
      box.innerHTML = `
        <div style="font-size:16px;font-weight:700;color:#fce4ca;display:flex;align-items:center;gap:8px;" id="web-milestone-headline">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>50 guests confirmed</span>
        </div>
        <div style="font-size:13px;color:#cfbfaf;margin-top:4px;" id="web-milestone-sub">You've hit the halfway mark on RSVPs!</div>
      `;
    }}
    selectWebNoteCategory('general');
  }}
}}

function openWebGuestHoneymoonGallery() {{
  switchWebTab('pages');
  selectGuestWebPage('honeymoonUpdates');
}}

function reactToWebHoneymoonPhoto(photoId, reactType) {{
  const state = loadState();
  const page = state.reusablePages && state.reusablePages.honeymoonUpdates;
  if (!page || !page.photos) return;
  const photo = page.photos.find(p => p.id === photoId);
  if (!photo) return;
  if (!photo.reactions) photo.reactions = {{ love: 0, toast: 0, stunning: 0, voyage: 0 }};
  photo.reactions[reactType] = (photo.reactions[reactType] || 0) + 1;
  saveState(state);
  
  const span = document.getElementById(`react-count-web-${{photoId}}-${{reactType}}`);
  if (span) span.textContent = photo.reactions[reactType];
  
  const icons = {{ love: '❤️ Love', toast: '🥂 Toast', stunning: '😍 Stunning', voyage: '✈️ Bon Voyage' }};
  showToast(`Reaction sent! Sophie & James will see your ${{icons[reactType] || 'reaction'}}!`, 'success');
}}

function postWebHoneymoonComment(photoId) {{
  const input = document.getElementById(`input-web-hm-${{photoId}}`);
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';

  const state = loadState();
  const page = state.reusablePages && state.reusablePages.honeymoonUpdates;
  if (!page || !page.photos) return;
  const photo = page.photos.find(p => p.id === photoId);
  if (!photo) return;
  if (!photo.comments) photo.comments = [];
  
  const author = activeGuest ? activeGuest.name : 'Priya Sharma';
  photo.comments.push({{
    author: author,
    text: text,
    time: 'Just now'
  }});
  saveState(state);
  showToast('Comment posted on honeymoon update!', 'success');
  renderGuestWebPages();
}}

function handleWebPostNoteSubmit(e) {{
  e.preventDefault();
  const input = document.getElementById('web-new-note-text');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  
  const state = loadState();
  const authorName = activeGuest ? activeGuest.name : 'A Wedding Guest';

  let badgeText = '💌 Love Note';
  let noteDesc = 'note';
  if (currentWebNoteCategory === 'thankyou') {{ badgeText = '🥂 Wedding Thank-You'; noteDesc = 'wedding thank-you'; }}
  if (currentWebNoteCategory === 'anniversary') {{ badgeText = '💍 1st Anniversary Toast'; noteDesc = '1st anniversary toast'; }}
  if (currentWebNoteCategory === 'honeymoon') {{ badgeText = '✈️ Honeymoon Love'; noteDesc = 'honeymoon wish'; }}
  
  state.feed.unshift({{
    id: 'f_note_' + Date.now(),
    type: 'note',
    author: authorName,
    title: `${{authorName}} left a ${{noteDesc}}`,
    category: currentWebNoteCategory,
    badge: badgeText,
    quote: text,
    time: 'Just now',
    likes: 1,
    comments: [],
    pinned: false,
    hidden: false
  }});

  // If anniversary toast, also record into firstAnniversary.guestWishes for the couple's anniversary vault
  if (currentWebNoteCategory === 'anniversary') {{
    if (!state.firstAnniversary) state.firstAnniversary = {{}};
    if (!state.firstAnniversary.guestWishes) state.firstAnniversary.guestWishes = [];
    state.firstAnniversary.guestWishes.unshift({{
      id: 'gw_' + Date.now(),
      author: authorName,
      text: text,
      time: 'Just now'
    }});
  }}
  
  logAudit('Love Note Added', authorName, `Posted [${{badgeText}}]: "${{text.substring(0, 30)}}..."`, 'Feed');
  saveState(state);
  showToast(`Your ${{badgeText}} has been shared on the feed!`, 'success');
  renderWebFeed();
}}

function addWebFeedComment(itemId) {{
  const input = document.getElementById('input-web-comm-' + itemId);
  if (!input || !input.value.trim()) return;
  const commentText = input.value.trim();
  input.value = '';
  
  const state = loadState();
  const item = state.feed.find(f => f.id === itemId);
  if (item) {{
    if (!item.comments) item.comments = [];
    item.comments.push(`${{activeGuest.name.split(' ')[0]}}: ${{commentText}}`);
    saveState(state);
    renderWebFeed();
    const commentEl = document.getElementById('comments-web-' + itemId);
    if (commentEl) commentEl.style.display = 'flex';
  }}
}}

function renderWebSchedule() {{
  const container = document.getElementById('web-schedule-timeline');
  if (!container) return;
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  
  const events = [
    {{ time: wedding.timeDisplay, title: 'Wedding Ceremony', desc: 'The Meadow Lawn. Please be seated 15 minutes prior.' }},
    {{ time: '2:45 PM', title: 'Cocktails &amp; Canapés', desc: 'The Verandah &amp; Estate Gardens.' }},
    {{ time: '4:00 PM', title: 'Grand Reception Seating', desc: 'The Grand Pavilion. Welcome toasts and entrance.' }},
    {{ time: '5:30 PM', title: 'Dinner &amp; Speeches', desc: 'Main dining hall. Three-course seasonal dining.' }},
    {{ time: '7:15 PM', title: 'Cake Cutting &amp; First Dance', desc: 'Dance floor opens with live band.' }},
    {{ time: '10:30 PM', title: 'Sparkler Farewell', desc: 'Courtyard Gates. Send off the bride and groom.' }}
  ];

  container.innerHTML = events.map(e => `
    <div class="timeline-item">
      <div class="timeline-time">${{e.time}}</div>
      <div>
        <strong style="display:block;font-size:15px;color:var(--ink);">${{e.title}}</strong>
        <span style="font-size:13px;color:#786858;">${{e.desc}}</span>
      </div>
    </div>
  `).join('');
}}

function renderWebTablemates() {{
  const container = document.getElementById('web-tablemates-list');
  if (!container) return;
  const state = loadState();
  
  const assignedTable = state.tables.find(t => t.id === activeGuest.tableId);
  const tableId = assignedTable ? assignedTable.id : 'table_4';
  const tableName = assignedTable ? assignedTable.name : 'Table 4';
  
  document.getElementById('web-table-name').textContent = tableName;
  const seatDisplay = (activeGuest.seatIndex !== null && activeGuest.seatIndex !== undefined) ? activeGuest.seatIndex + 1 : 3;
  document.getElementById('web-seat-name').textContent = `Seat ${{seatDisplay}} · ${{activeGuest.name}}`;
  document.getElementById('web-table-number').textContent = tableName.replace(/\D/g, '') || '4';
  
  const mates = state.guests.filter(g => g.tableId === tableId && g.id !== activeGuest.id);
  
  if (mates.length === 0) {{
    container.innerHTML = `<div style="text-align:center;padding:16px;color:var(--muted);font-size:13px;">No other tablemates seated here yet.</div>`;
    return;
  }}
  
  container.innerHTML = mates.map(m => `
    <div style="background:#faf8f5;border:1px solid var(--line);border-radius:6px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:34px;height:34px;border-radius:50%;background:#231c16;color:#dfc194;display:grid;place-items:center;font-size:12px;font-weight:700;">
          ${{escapeHtml(m.initials || m.name.substring(0, 2).toUpperCase())}}
        </div>
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--ink);">${{escapeHtml(m.name)}}</div>
          <div style="font-size:11.5px;color:var(--muted);">Seat ${{(m.seatIndex !== null && m.seatIndex !== undefined) ? m.seatIndex + 1 : '-'}}</div>
        </div>
      </div>
      ${{m.dietary && m.dietary !== 'None' ? `<span class="tt-pill warm">${{escapeHtml(m.dietary)}}</span>` : ''}}
    </div>
  `).join('');
}}

function renderWebPhotoWall() {{
  const grid = document.getElementById('web-photo-grid');
  if (!grid) return;
  const state = loadState();
  const photos = state.photos || [];
  
  grid.innerHTML = photos.map(p => `
    <div style="aspect-ratio:1;background:#ede6dc;border-radius:8px;overflow:hidden;position:relative;cursor:pointer;box-shadow:var(--shadow-sm);" onclick="openPhotoLightbox('${{p.id}}')">
      ${{p.dataUrl ? `<img src="${{p.dataUrl}}" style="width:100%;height:100%;object-fit:cover;" alt="${{p.caption}}">` : 
      `<div style="font-family:var(--font-heading);font-style:italic;color:#5a493c;text-align:center;padding:18px;font-size:14px;display:grid;place-items:center;height:100%;">📷<br>${{escapeHtml(p.caption)}}</div>`}}
      <div style="position:absolute;bottom:0;inset-inline:0;background:rgba(21,17,14,0.75);color:#fff;font-size:11.5px;padding:6px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
        ${{escapeHtml(p.caption)}}
      </div>
    </div>
  `).join('');
}}

function handleWebPhotoUpload(e) {{
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {{
    const dataUrl = evt.target.result;
    const state = loadState();
    const newPhoto = {{
      id: 'p_' + Date.now(),
      caption: `Photo by ${{activeGuest.name.split(' ')[0]}}`,
      author: activeGuest.name,
      time: 'Just now',
      dataUrl: dataUrl
    }};
    if (!state.photos) state.photos = [];
    state.photos.unshift(newPhoto);
    
    state.feed.unshift({{
      id: 'f_photo_' + Date.now(),
      type: 'photo',
      author: activeGuest.name,
      title: 'New photo added',
      subtitle: `${{activeGuest.name.split(' ')[0]}} uploaded a photo to the gallery`,
      time: 'Just now',
      likes: 0,
      comments: [],
      pinned: false,
      hidden: false
    }});
    
    logAudit('Photo Uploaded', activeGuest.name, 'Uploaded photo to celebration gallery', 'Photos');
    saveState(state);
    showToast('Photo uploaded successfully to the Photo Wall!', 'success');
    renderWebPhotoWall();
    renderWebFeed();
  }};
  reader.readAsDataURL(file);
}}

function selectWebGift(amount) {{
  webSelectedGift = amount;
  document.querySelectorAll('.preset-btn').forEach(btn => {{
    btn.classList.toggle('active', btn.textContent.includes(amount));
  }});
  document.getElementById('web-custom-amount').value = '';
  document.getElementById('web-gift-btn-amt').textContent = `$${{amount}} AUD`;
}}

function handleWebCustomAmount(val) {{
  const num = parseInt(val, 10);
  if (!isNaN(num) && num > 0) {{
    webSelectedGift = num;
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('web-gift-btn-amt').textContent = `$${{num}} AUD`;
  }}
}}

function openWebCheckoutModal() {{
  document.getElementById('web-modal-checkout-amt').textContent = `$${{webSelectedGift}} AUD`;
  document.getElementById('web-checkout-modal').style.display = 'flex';
  document.getElementById('web-checkout-modal').setAttribute('aria-hidden', 'false');
}}

function closeWebCheckoutModal() {{
  document.getElementById('web-checkout-modal').style.display = 'none';
  document.getElementById('web-checkout-modal').setAttribute('aria-hidden', 'true');
}}

function processWebMockPayment() {{
  closeWebCheckoutModal();
  const state = loadState();
  const note = document.getElementById('web-gift-note').value.trim() || 'Wishing you both all the happiness in the world!';
  const giftAmt = webSelectedGift;
  const giverName = activeGuest ? activeGuest.name : 'A Generous Guest';
  
  state.gifts.unshift({{
    id: 'gf_' + Date.now(),
    from: giverName,
    amount: giftAmt,
    date: 'Just now',
    message: note,
    thankYouSent: false
  }});
  
  state.feed.unshift({{
    id: 'f_gift_' + Date.now(),
    type: 'gift',
    author: giverName,
    title: `${{giverName}} sent a gift`,
    subtitle: `via Gift & Go — thank-you not yet sent`,
    time: 'Just now',
    likes: 1,
    comments: [],
    pinned: false,
    hidden: false
  }});
  
  logAudit('Gift & Go Received', giverName, `Contributed ${{formatAUD(giftAmt)}} with message`, 'Gifting');
  saveState(state);
  showToast(`Thank you! Your gift of ${{formatAUD(giftAmt)}} has been sent to Sophie & James!`, 'success');
  renderWebFeed();
}}

function downloadCalendarICS() {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tap and Toast//Wedding Calendar//EN
BEGIN:VEVENT
UID:${{wedding.id}}@tapandtoast.au
DTSTAMP:20261009T000000Z
DTSTART:20261114T030000Z
DTEND:20261114T130000Z
SUMMARY:Sophie & James's Wedding
DESCRIPTION:Wedding celebration for Sophie & James at Fernwood Estate.
LOCATION:${{wedding.venueAddress}}
END:VEVENT
END:VCALENDAR`;
  
  const blob = new Blob([icsContent], {{ type: 'text/calendar;charset=utf-8' }});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'sophie-james-wedding.ics';
  link.click();
  showToast('Calendar invite downloaded (.ics)', 'success');
}}

function openPhotoLightbox(photoId) {{
  const state = loadState();
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  showToast(`Viewing: "${{photo.caption}}"`, 'info');
}}

function openWebVenueModal() {{
  const modal = document.getElementById('web-venue-modal');
  if (modal) {{
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }}
}}

function closeWebVenueModal() {{
  const modal = document.getElementById('web-venue-modal');
  if (modal) {{
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }}
}}

</script>
</body>
</html>
"""
    with open(os.path.join('c:\\Users\\Mohak\\Desktop\\tap&toast\\tap-toast-demo', 'guest-web.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("guest-web.html generated successfully!")

if __name__ == '__main__':
    build_guest_web()
