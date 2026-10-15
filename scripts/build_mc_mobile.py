import os
import json
import sys

# Add scripts directory to path to import shared modules
sys.path.insert(0, os.path.dirname(__file__))
from data_template import SEED_STATE

def build_mc_mobile_html():
    seed_json = json.dumps(SEED_STATE)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Tap &amp; Toast — MC Mobile Console (402×874)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --ink: #1c1511;
      --ink-soft: #2b221a;
      --cream: #faf7f2;
      --cream-dark: #f0eae1;
      --gold: #bd9661;
      --gold-hover: #a67f4c;
      --gold-light: #dfc194;
      --gold-tint: #fbf7ee;
      --muted: #7d7065;
      --line: #e8e2d8;
      --line-strong: #d5cbbe;
      --white: #ffffff;
      --success: #2e7d32;
      --danger: #b3261e;
      --font-heading: 'Playfair Display', Georgia, serif;
      --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --shadow-sm: 0 1px 3px rgba(28, 21, 17, 0.08);
      --shadow-md: 0 4px 14px rgba(28, 21, 17, 0.12);
      --shadow-lg: 0 16px 36px rgba(28, 21, 17, 0.22);
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }}

    body {{
      background: radial-gradient(circle at 50% 25%, #231c16 0%, #110e0b 100%);
      font-family: var(--font-body);
      color: var(--ink);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }}

    /* Top Demo Bar */
    .tt-demobar {{
      background: #140f0c;
      border-bottom: 1px solid #2b221a;
      padding: 7px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      z-index: 1000;
      flex-shrink: 0;
    }}
    .tt-demobar-brand {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .tt-mark {{
      display: inline-grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border: 1px solid var(--gold);
      color: var(--gold);
      font-family: var(--font-heading);
      font-size: 14px;
      font-weight: 700;
      border-radius: 4px;
    }}
    .tt-demobar-title {{
      font-family: var(--font-heading);
      font-size: 15px;
      color: #ffffff;
      font-weight: 600;
    }}
    .tt-demobar-badge {{
      background: #2a2018;
      color: var(--gold-light);
      border: 1px solid #4a382a;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }}
    .tt-demobar-links {{
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
    }}
    .tt-demobar-link {{
      color: #bfaea0;
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.15s ease;
      white-space: nowrap;
    }}
    .tt-demobar-link:hover {{
      color: #ffffff;
      background: #261e18;
    }}
    .tt-demobar-link.active {{
      background: var(--gold);
      color: #140f0c;
      font-weight: 700;
    }}
    .tt-demobar-reset {{
      background: #261e18;
      color: #dfc194;
      border: 1px solid #4a3a2d;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }}
    .tt-demobar-reset:hover {{
      background: #382c23;
      color: #fff;
    }}

    /* Phone Stage / Mockup Chassis */
    .mobile-stage {{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      overflow: hidden;
    }}

    .phone-mockup-frame {{
      width: 402px !important;
      max-width: 402px !important;
      height: 874px !important;
      max-height: calc(100vh - 54px) !important;
      background: var(--cream);
      border-radius: 46px;
      border: 4px solid #1c1511;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45), 0 6px 18px rgba(0, 0, 0, 0.25);
      overflow: hidden !important;
      position: relative;
      display: flex !important;
      flex-direction: column !important;
      box-sizing: border-box;
    }}

    @media (max-width: 480px) {{
      body {{
        background: var(--cream);
      }}
      .mobile-stage {{
        padding: 0;
      }}
      .phone-mockup-frame {{
        width: 100% !important;
        max-width: 100% !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }}
    }}

    /* Phone Status Bar */
    .phone-status-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px 8px;
      font-size: 13.5px;
      font-weight: 700;
      color: #15110e;
      user-select: none;
      background: var(--cream);
      border-bottom: 1px solid rgba(0,0,0,0.04);
      flex-shrink: 0;
      z-index: 50;
    }}
    .phone-status-icons {{
      display: flex;
      align-items: center;
      gap: 7px;
    }}
    .phone-status-battery {{
      width: 22px;
      height: 11px;
      border: 1.5px solid #15110e;
      border-radius: 3px;
      padding: 1px;
      position: relative;
      display: flex;
      align-items: center;
    }}
    .phone-status-battery::after {{
      content: '';
      position: absolute;
      right: -3.5px;
      top: 2.5px;
      width: 2px;
      height: 4px;
      background: #15110e;
      border-radius: 0 1px 1px 0;
    }}
    .phone-battery-level {{
      width: 90%;
      height: 100%;
      background: #2e7d32;
      border-radius: 1px;
    }}

    /* App Header */
    .mc-mobile-header {{
      background: #1c1511;
      color: #ffffff;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #33261e;
      flex-shrink: 0;
    }}
    .mc-header-left {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .mc-avatar-circle {{
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #2e231b;
      border: 1.5px solid var(--gold);
      color: var(--gold);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 13px;
    }}
    .mc-header-meta {{
      display: flex;
      flex-direction: column;
    }}
    .mc-header-name {{
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }}
    .mc-header-role {{
      font-size: 10.5px;
      color: var(--gold-light);
      display: flex;
      align-items: center;
      gap: 4px;
    }}
    .mc-signout-btn {{
      background: #2a2018;
      border: 1px solid #453426;
      color: #dfc194;
      font-size: 11px;
      padding: 5px 9px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }}
    .mc-signout-btn:hover {{
      background: #3b2d22;
      color: #ffffff;
    }}

    /* Wedding Selector Banner */
    .mc-wedding-banner {{
      background: #271f18;
      border-bottom: 1px solid #3d3024;
      padding: 7px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-shrink: 0;
    }}
    .mc-wedding-select {{
      background: #17120e;
      color: #f7ede1;
      border: 1px solid #544131;
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 11.5px;
      font-weight: 600;
      flex: 1;
      cursor: pointer;
      outline: none;
    }}
    .mc-wedding-badge {{
      background: #473215;
      color: #f2cb7b;
      border: 1px solid #6b4d24;
      font-size: 10px;
      padding: 3px 7px;
      border-radius: 12px;
      font-weight: 700;
      white-space: nowrap;
    }}

    /* Main Scrollable Content Container */
    .phone-content-scroll {{
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      background: var(--cream);
      display: flex;
      flex-direction: column;
    }}

    /* Bottom Navigation Bar */
    .phone-bottom-nav {{
      background: #181310;
      border-top: 1px solid #33261e;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 8px 4px 6px;
      flex-shrink: 0;
      z-index: 60;
    }}
    .nav-tab-btn {{
      background: transparent;
      border: none;
      color: #a49182;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.15s ease;
      flex: 1;
    }}
    .nav-tab-btn .tab-icon {{
      font-size: 17px;
    }}
    .nav-tab-btn.active {{
      color: var(--gold-light);
      background: rgba(189, 150, 97, 0.15);
    }}
    .nav-tab-btn:hover {{
      color: #ffffff;
    }}

    /* Phone Home Indicator */
    .phone-home-indicator {{
      width: 130px;
      height: 4.5px;
      background: #4a3d31;
      border-radius: 3px;
      margin: 4px auto 6px;
      flex-shrink: 0;
    }}

    /* UI Generic Components */
    .mc-pane {{
      display: none;
      padding: 14px;
      flex-direction: column;
      gap: 14px;
    }}
    .mc-pane.active {{
      display: flex;
    }}

    .card {{
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px;
      box-shadow: var(--shadow-sm);
    }}

    .btn {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      outline: none;
    }}
    .btn-gold {{
      background: var(--gold);
      color: #140f0c;
      border-color: var(--gold);
    }}
    .btn-gold:hover {{
      background: var(--gold-hover);
      border-color: var(--gold-hover);
      color: #ffffff;
    }}
    .btn-outline {{
      background: #ffffff;
      color: var(--ink);
      border-color: var(--line-strong);
    }}
    .btn-outline:hover {{
      background: var(--cream-dark);
    }}
    .btn-danger {{
      background: #fdf2f2;
      color: #b3261e;
      border-color: #f1b3b3;
    }}
    .btn-sm {{
      padding: 5px 10px;
      font-size: 11.5px;
    }}
    .btn-block {{
      width: 100%;
    }}

    .text-input {{
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      font-size: 12.5px;
      font-family: inherit;
      color: var(--ink);
      background: #ffffff;
      outline: none;
    }}
    .text-input:focus {{
      border-color: var(--gold);
      box-shadow: 0 0 0 2px rgba(189, 150, 97, 0.2);
    }}

    .pill {{
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }}
    .pill-gold {{ background: #fdf5e8; color: #8a6523; border: 1px solid #ebd3a8; }}
    .pill-green {{ background: #eaf6ec; color: #236c2a; border: 1px solid #bee3c3; }}
    .pill-dark {{ background: #261f18; color: #dfc194; border: 1px solid #4a3a2a; }}

    /* Runsheet Cue Cards */
    .cue-card {{
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
    }}
    .cue-card.done {{
      background: #f6faf6;
      border-color: #c9e6ca;
    }}
    .cue-top-row {{
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .cue-checkbox {{
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--gold);
    }}
    .cue-time-badge {{
      background: #f4ede1;
      border: 1px solid #d4c4b0;
      color: #3b2c1f;
      font-size: 11.5px;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }}
    .cue-title-input {{
      flex: 1;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid transparent;
      background: transparent;
      padding: 2px 4px;
      border-radius: 4px;
      color: var(--ink);
    }}
    .cue-title-input:focus {{
      background: #ffffff;
      border-color: var(--gold);
    }}
    .cue-card.done .cue-title-input {{
      text-decoration: line-through;
      color: #7b8e7c;
    }}
    .cue-actions {{
      display: flex;
      gap: 4px;
    }}
    .cue-actions button {{
      padding: 3px 6px;
      font-size: 11px;
      background: #f6f3ee;
      border: 1px solid #ddd3c5;
      border-radius: 4px;
      cursor: pointer;
      color: #382c21;
    }}
    .cue-actions button:hover {{
      background: #eae2d5;
    }}

    /* MC Cue Notes Box */
    .mc-cue-notes-box {{
      background: var(--gold-tint);
      border: 1px solid #eedec3;
      border-radius: 6px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }}
    .mc-cue-notes-label {{
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--gold-hover);
      display: flex;
      align-items: center;
      gap: 4px;
    }}
    .mc-cue-notes-input {{
      background: transparent;
      border: none;
      font-size: 12px;
      color: #3f2f1e;
      font-family: inherit;
      outline: none;
      width: 100%;
    }}

    /* Seating Circular Preview */
    .table-badge-row {{
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
    }}
    .table-pill-btn {{
      background: #ffffff;
      border: 1.5px solid var(--line-strong);
      border-radius: 18px;
      padding: 6px 12px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--ink);
      white-space: nowrap;
      cursor: pointer;
    }}
    .table-pill-btn.active {{
      background: var(--gold);
      border-color: var(--gold);
      color: #140f0c;
    }}

    /* Auth Screen Inside Mobile Chassis */
    #mc-mobile-auth {{
      display: flex;
      flex-direction: column;
      padding: 24px 20px;
      flex: 1;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: radial-gradient(circle at 50% 20%, #292019 0%, #15110e 100%);
      color: #ffffff;
      min-height: 100%;
    }}
    .auth-brand-logo {{
      width: 52px;
      height: 52px;
      border-radius: 8px;
      border: 2px solid var(--gold);
      display: grid;
      place-items: center;
      font-family: var(--font-heading);
      font-size: 26px;
      color: var(--gold);
      margin-bottom: 12px;
      box-shadow: 0 4px 18px rgba(189, 150, 97, 0.25);
    }}
    .auth-title {{
      font-family: var(--font-heading);
      font-size: 22px;
      color: #ffffff;
      margin-bottom: 4px;
    }}
    .auth-subtitle {{
      font-size: 12px;
      color: #c9b7a7;
      margin-bottom: 20px;
      max-width: 290px;
      line-height: 1.4;
    }}
    .auth-card {{
      background: #201813;
      border: 1px solid #453324;
      border-radius: 14px;
      padding: 16px;
      width: 100%;
      text-align: left;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }}
    .auth-tabs {{
      display: flex;
      border-bottom: 1px solid #3d2d20;
      margin-bottom: 14px;
    }}
    .auth-tab {{
      flex: 1;
      background: transparent;
      border: none;
      color: #9d8876;
      padding: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      border-bottom: 2px solid transparent;
    }}
    .auth-tab.active {{
      color: var(--gold-light);
      border-bottom-color: var(--gold);
    }}

    /* Toast */
    .toast-popup {{
      position: absolute;
      bottom: 60px;
      left: 16px;
      right: 16px;
      background: #181310;
      border: 1px solid var(--gold);
      color: #ffffff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12.5px;
      display: none;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 1000;
      animation: toastIn 0.2s ease forwards;
    }}
    @keyframes toastIn {{
      from {{ opacity: 0; transform: translateY(10px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}

    /* Modals */
    .mobile-modal-backdrop {{
      position: absolute;
      inset: 0;
      background: rgba(18, 14, 11, 0.7);
      backdrop-filter: blur(3px);
      z-index: 200;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }}
    .mobile-modal-sheet {{
      background: #ffffff;
      width: 100%;
      max-height: 85%;
      border-radius: 20px 20px 0 0;
      padding: 18px 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      box-shadow: 0 -8px 30px rgba(0,0,0,0.25);
    }}
    .sheet-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
    }}
    .sheet-title {{
      font-family: var(--font-heading);
      font-size: 17px;
      font-weight: 700;
      color: var(--ink);
    }}
    .sheet-close {{
      background: #f0eae1;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 13px;
      display: grid;
      place-items: center;
    }}
  </style>
</head>
<body>

  <!-- Top Demo Bar (Matching Suite) -->
  <nav class="tt-demobar" aria-label="Demo Navigation">
    <div class="tt-demobar-brand">
      <span class="tt-mark">T</span>
      <span class="tt-demobar-title">Tap &amp; Toast</span>
      <span class="tt-demobar-badge">MC MOBILE</span>
    </div>
    <div class="tt-demobar-links">
      <a href="index.html" class="tt-demobar-link" title="Showcase Hub">Showcase</a>
      <a href="login.html" class="tt-demobar-link">Sign In</a>
      <a href="register.html" class="tt-demobar-link">Register</a>
      <a href="guest-mobile.html" class="tt-demobar-link">Guest Mobile</a>
      <a href="mc-mobile.html" class="tt-demobar-link active">MC Mobile</a>
      <a href="couple.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'couple', 'couple.html')">Couple Dashboard</a>
      <a href="mc.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
      <a href="superadmin.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'superadmin', 'superadmin.html')">Super Admin</a>
    </div>
    <div class="tt-demobar-actions">
      <button type="button" class="tt-demobar-reset" onclick="resetDemoData()">↺ Reset Demo Data</button>
    </div>
  </nav>

  <!-- Phone Stage -->
  <div class="mobile-stage">
    <div class="phone-mockup-frame">
      <!-- Phone Status Bar -->
      <div class="phone-status-bar">
        <span id="phone-clock">9:41</span>
        <div class="phone-status-icons">
          <span style="font-size:11px;letter-spacing:1px;">􀙇 5G</span>
          <div class="phone-status-battery">
            <div class="phone-battery-level"></div>
          </div>
        </div>
      </div>

      <!-- App Header (When Logged In) -->
      <header class="mc-mobile-header" id="mc-app-header" style="display:none;">
        <div class="mc-header-left">
          <div class="mc-avatar-circle" id="mc-avatar">RG</div>
          <div class="mc-header-meta">
            <span class="mc-header-name" id="mc-user-name">Robert Galati</span>
            <span class="mc-header-role">🎧 Master of Ceremonies</span>
          </div>
        </div>
        <button type="button" class="mc-signout-btn" onclick="handleSignOut()">Sign Out</button>
      </header>

      <!-- Wedding Selector & Live Status Banner -->
      <div class="mc-wedding-banner" id="mc-wedding-banner" style="display:none;">
        <select class="mc-wedding-select" id="mc-wedding-selector" onchange="handleWeddingChange(this.value)">
          <option value="w1">💍 Sophie &amp; James (Fernwood Estate · Active)</option>
          <option value="w2">💍 Aisha &amp; Marcus (Belgenny Farm · Upcoming)</option>
          <option value="w3">💍 Elena &amp; Mateo (Bendooley Estate · Draft)</option>
        </select>
        <span class="mc-wedding-badge" id="mc-wedding-badge">LIVE RUN SHEET</span>
      </div>

      <!-- Scrollable Main Content -->
      <div class="phone-content-scroll" id="phone-content-scroll">
        
        <!-- ================= AUTH VIEW ================= -->
        <div id="mc-mobile-auth">
          <div class="auth-brand-logo">🥂</div>
          <h1 class="auth-title">MC Mobile Console</h1>
          <p class="auth-subtitle">Live cues, confidential MC notes, floor seating &amp; emergency broadcast at your fingertips.</p>

          <!-- 1-Click Demo Login -->
          <button type="button" class="btn btn-gold btn-block" style="margin-bottom:16px;padding:11px;font-size:13px;box-shadow:0 4px 14px rgba(189,150,97,0.35);" onclick="handleQuickMCDemoLogin()">
            ⚡ 1-Click MC Demo Sign In (Robert Galati)
          </button>

          <div class="auth-card">
            <div class="auth-tabs">
              <button type="button" class="auth-tab active" id="tab-login" onclick="switchAuthTab('login')">Sign In</button>
              <button type="button" class="auth-tab" id="tab-register" onclick="switchAuthTab('register')">Register New MC</button>
            </div>

            <!-- Login Form -->
            <form id="mc-login-form" onsubmit="handleMCLogin(event)">
              <div style="margin-bottom:10px;">
                <label style="font-size:11px;color:#c9b7a7;display:block;margin-bottom:4px;">MC Account Email</label>
                <input type="email" id="login-email" class="text-input" style="background:#17120e;border-color:#4a382b;color:#ffffff;" required value="robert@galati.demo" placeholder="name@domain.com">
              </div>
              <div style="margin-bottom:10px;">
                <label style="font-size:11px;color:#c9b7a7;display:block;margin-bottom:4px;">Master Password</label>
                <div style="position:relative;">
                  <input type="password" id="login-pwd" class="text-input" style="background:#17120e;border-color:#4a382b;color:#ffffff;padding-right:32px;" required value="demo123">
                  <span onclick="togglePasswordVisibility('login-pwd')" style="position:absolute;right:8px;top:8px;cursor:pointer;font-size:13px;color:#aa9787;">👁️</span>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:11px;color:#aa9787;">
                <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                  <input type="checkbox" id="login-remember" checked> Keep signed in
                </label>
                <a href="javascript:void(0)" onclick="openForgotModal(event)" style="color:var(--gold-light);text-decoration:none;">Forgot?</a>
              </div>
              <div id="login-error-box" style="display:none;color:#ff8585;font-size:11px;margin-bottom:8px;background:#381616;padding:6px 8px;border-radius:4px;border:1px solid #702626;"></div>
              <button type="submit" class="btn btn-gold btn-block" style="padding:10px;font-size:12.5px;">Sign In to Console</button>
            </form>

            <!-- Register Form -->
            <form id="mc-register-form" style="display:none;" onsubmit="handleMCRegister(event)">
              <div style="margin-bottom:8px;">
                <label style="font-size:11px;color:#c9b7a7;display:block;margin-bottom:2px;">Full Name</label>
                <input type="text" id="reg-name" class="text-input" style="background:#17120e;border-color:#4a382b;color:#ffffff;" required placeholder="e.g. Jordan Vance">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:11px;color:#c9b7a7;display:block;margin-bottom:2px;">MC Agency / Business Name</label>
                <input type="text" id="reg-biz" class="text-input" style="background:#17120e;border-color:#4a382b;color:#ffffff;" required placeholder="e.g. Vance MC &amp; Entertainment">
              </div>
              <div style="margin-bottom:8px;">
                <label style="font-size:11px;color:#c9b7a7;display:block;margin-bottom:2px;">Email Address</label>
                <input type="email" id="reg-email" class="text-input" style="background:#17120e;border-color:#4a382b;color:#ffffff;" required placeholder="mc@vance.demo">
              </div>
              <div style="margin-bottom:12px;">
                <label style="font-size:11px;color:#c9b7a7;display:block;margin-bottom:2px;">Password</label>
                <input type="password" id="reg-pwd" class="text-input" style="background:#17120e;border-color:#4a382b;color:#ffffff;" required placeholder="••••••••">
              </div>
              <button type="submit" class="btn btn-gold btn-block" style="padding:10px;font-size:12.5px;">Create MC Account</button>
            </form>
          </div>
        </div>

        <!-- ================= PANE 1: RUN SHEET ================= -->
        <div class="mc-pane" id="pane-runsheet">
          <!-- Emergency Alert Notice / Broadcast -->
          <div style="background:#201813;border:1px solid #4a382a;border-radius:10px;padding:10px 12px;color:#ffffff;display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
              <span style="font-size:16px;">📢</span>
              <span id="mc-broadcast-text" style="color:#f2e6d9;">All cues running on schedule · Audio tested</span>
            </div>
            <button type="button" class="btn btn-outline btn-sm" style="background:#2e2219;color:#dfc194;border-color:#5c4533;padding:3px 7px;font-size:11px;" onclick="openBroadcastModal()">Broadcast</button>
          </div>

          <!-- Controls Bar -->
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="display:flex;gap:4px;" id="rs-filter-pills">
              <button type="button" class="btn btn-gold btn-sm" onclick="filterRunSheet('all', this)">All</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="filterRunSheet('pending', this)">Upcoming</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="filterRunSheet('done', this)">Done</button>
            </div>
            <button type="button" class="btn btn-gold btn-sm" onclick="openAddCueModal()">+ Add Cue</button>
          </div>

          <!-- Search Input -->
          <div>
            <input type="text" class="text-input" placeholder="🔍 Filter cues, activities, or notes..." oninput="handleSearchCues(this.value)">
          </div>

          <!-- Run Sheet Items List -->
          <div id="mc-runsheet-list" style="display:flex;flex-direction:column;gap:10px;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- ================= PANE 2: SEATING & FLOOR ================= -->
        <div class="mc-pane" id="pane-seating">
          <!-- Metrics Overview -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div class="card" style="padding:10px;text-align:center;">
              <div style="font-size:18px;font-weight:800;color:var(--ink);" id="seat-metric-seated">118 / 120</div>
              <div style="font-size:11px;color:var(--muted);">Guests Seated (98%)</div>
            </div>
            <div class="card" style="padding:10px;text-align:center;">
              <div style="font-size:18px;font-weight:800;color:var(--gold-hover);" id="seat-metric-unassigned">2 Pending</div>
              <div style="font-size:11px;color:var(--muted);">Unassigned Guests</div>
            </div>
          </div>

          <!-- Dietary Highlights -->
          <div class="card" style="padding:10px;">
            <div style="font-size:11.5px;font-weight:700;color:var(--ink);margin-bottom:6px;display:flex;justify-content:space-between;">
              <span>🍽️ Catering Dietary Highlights</span>
              <span class="pill pill-gold">18 Special Meals</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <span class="pill pill-green">🌱 4 Vegan</span>
              <span class="pill pill-green">🥬 8 Vegetarian</span>
              <span class="pill pill-gold">🌾 6 Gluten-Free</span>
              <span class="pill pill-dark">🥜 2 Nut Allergy</span>
            </div>
          </div>

          <!-- Floor Plan Table Switcher -->
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Floor Plan &bull; Tap Table to View</div>
            <div class="table-badge-row" id="table-pill-row">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Selected Table Inspection -->
          <div class="card" id="selected-table-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid var(--line);padding-bottom:6px;">
              <strong style="font-size:13.5px;" id="st-name">Head Table</strong>
              <span class="pill pill-dark" id="st-capacity">10 / 10 Seated</span>
            </div>
            <div id="st-guests-list" style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
              <!-- Seated guests rendered here -->
            </div>
          </div>

          <!-- Unassigned Guests Section (With matching 32px height and Seat button) -->
          <div class="card" style="background:#fffcf7;border-color:#e0d0bb;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <strong style="font-size:13px;color:#5a3f1d;">🪑 Unassigned Guests</strong>
              <span class="pill pill-gold" id="unassigned-count-pill">2 to seat</span>
            </div>
            <div id="unassigned-guests-list" style="display:flex;flex-direction:column;gap:8px;">
              <!-- Unassigned cards rendered here -->
            </div>
          </div>
        </div>

        <!-- ================= PANE 3: GUESTS DIRECTORY ================= -->
        <div class="mc-pane" id="pane-guests">
          <div style="display:flex;gap:8px;">
            <input type="text" class="text-input" placeholder="🔍 Search guests or dietary requirement..." oninput="handleSearchGuests(this.value)">
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted);padding:0 2px;">
            <span id="guest-count-label">Showing 100 Guests</span>
            <span style="color:var(--success);font-weight:600;">✓ 96 Confirmed RSVPs</span>
          </div>
          <div id="mc-guest-directory-list" style="display:flex;flex-direction:column;gap:6px;">
            <!-- Guests rendered here -->
          </div>
        </div>

        <!-- ================= PANE 4: VENUE & LOGISTICS ================= -->
        <div class="mc-pane" id="pane-venue">
          <div class="card">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;">
              <div>
                <h3 style="font-family:var(--font-heading);font-size:16px;">Fernwood Estate</h3>
                <p style="font-size:12px;color:var(--muted);">1842 Range Road, Southern Highlands NSW</p>
              </div>
              <span class="pill pill-green">Verified</span>
            </div>
            <button type="button" class="btn btn-outline btn-block btn-sm" onclick="showToast('Directions link copied to clipboard')">📍 Open Navigation Directions</button>
          </div>

          <!-- Key Emergency & Vendor Contacts -->
          <div class="card">
            <div style="font-size:12.5px;font-weight:700;margin-bottom:8px;color:var(--ink);">📞 Key On-Site Vendor Contacts</div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#faf8f5;border-radius:6px;border:1px solid #ebd3a8;">
                <div>
                  <strong>Sarah Lin</strong> <span style="color:var(--muted);">· Venue Manager</span>
                </div>
                <a href="tel:0412345678" class="btn btn-gold btn-sm" style="text-decoration:none;">Call</a>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#faf8f5;border-radius:6px;border:1px solid #ebd3a8;">
                <div>
                  <strong>Chef Marco Rossi</strong> <span style="color:var(--muted);">· Catering Lead</span>
                </div>
                <a href="tel:0434567890" class="btn btn-gold btn-sm" style="text-decoration:none;">Call</a>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#faf8f5;border-radius:6px;border:1px solid #ebd3a8;">
                <div>
                  <strong>Dave Miller</strong> <span style="color:var(--muted);">· Sound &amp; AV Tech</span>
                </div>
                <a href="tel:0445678901" class="btn btn-gold btn-sm" style="text-decoration:none;">Call</a>
              </div>
            </div>
          </div>

          <!-- Sound & Mic Checklist -->
          <div class="card">
            <div style="font-size:12.5px;font-weight:700;margin-bottom:8px;color:var(--ink);">🎤 MC Tech &amp; Audio Checklist</div>
            <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" checked onchange="showToast('Sound check saved')"> Wireless Handheld Mic A (Battery 100%)
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" checked onchange="showToast('Sound check saved')"> Wireless Handheld Mic B (Spare)
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" checked onchange="showToast('Sound check saved')"> Celebrant Lapel Transceiver
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" onchange="showToast('Sound check saved')"> Dancefloor Uplighting &amp; First Dance Cue
              </label>
            </div>
          </div>
        </div>

        <!-- ================= PANE 5: GIGS & WEDDINGS ================= -->
        <div class="mc-pane" id="pane-gigs">
          <div style="font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Booked Wedding Engagements</div>
          <div id="mc-weddings-gigs-list" style="display:flex;flex-direction:column;gap:8px;">
            <!-- Rendered dynamically -->
          </div>
        </div>

      </div>

      <!-- Phone Bottom Nav Bar -->
      <nav class="phone-bottom-nav" id="mc-bottom-nav" style="display:none;">
        <button type="button" class="nav-tab-btn active" data-pane="pane-runsheet" onclick="switchPane('pane-runsheet', this)">
          <span class="tab-icon">📋</span>
          <span>Run Sheet</span>
        </button>
        <button type="button" class="nav-tab-btn" data-pane="pane-seating" onclick="switchPane('pane-seating', this)">
          <span class="tab-icon">🪑</span>
          <span>Seating</span>
        </button>
        <button type="button" class="nav-tab-btn" data-pane="pane-guests" onclick="switchPane('pane-guests', this)">
          <span class="tab-icon">👥</span>
          <span>Guests</span>
        </button>
        <button type="button" class="nav-tab-btn" data-pane="pane-venue" onclick="switchPane('pane-venue', this)">
          <span class="tab-icon">📍</span>
          <span>Venue</span>
        </button>
        <button type="button" class="nav-tab-btn" data-pane="pane-gigs" onclick="switchPane('pane-gigs', this)">
          <span class="tab-icon">📅</span>
          <span>Gigs</span>
        </button>
      </nav>

      <!-- Home Indicator -->
      <div class="phone-home-indicator"></div>

      <!-- Toast Popup -->
      <div class="toast-popup" id="toast-popup">
        <span id="toast-icon">✓</span>
        <span id="toast-msg">Action completed</span>
      </div>

      <!-- Add Run Sheet Cue Modal Sheet -->
      <div class="mobile-modal-backdrop" id="add-cue-sheet">
        <div class="mobile-modal-sheet">
          <div class="sheet-header">
            <h3 class="sheet-title">Add Schedule Cue</h3>
            <button type="button" class="sheet-close" onclick="closeAddCueModal()">&times;</button>
          </div>
          <form onsubmit="handleSaveNewCue(event)">
            <div style="margin-bottom:8px;">
              <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px;">Cue Time (24h or AM/PM)</label>
              <input type="text" id="new-cue-time" class="text-input" required placeholder="e.g. 19:45" value="19:45">
            </div>
            <div style="margin-bottom:8px;">
              <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px;">Activity Title</label>
              <input type="text" id="new-cue-title" class="text-input" required placeholder="e.g. First Dance &amp; Champagne Toast">
            </div>
            <div style="margin-bottom:8px;">
              <label style="font-size:11px;font-weight:700;color:var(--muted);display:block;margin-bottom:3px;">Public Schedule Notes</label>
              <input type="text" id="new-cue-public" class="text-input" placeholder="Guest announcements, song title...">
            </div>
            <div style="margin-bottom:12px;">
              <label style="font-size:11px;font-weight:700;color:var(--gold-hover);display:block;margin-bottom:3px;">MC Cue Notes</label>
              <input type="text" id="new-cue-private" class="text-input" style="background:#fcfaf6;border-color:#ebd3a8;" placeholder="Private sound directions, microphone cues...">
            </div>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-outline btn-block" onclick="closeAddCueModal()">Cancel</button>
              <button type="submit" class="btn btn-gold btn-block">Add to Run Sheet</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Emergency Broadcast Modal Sheet -->
      <div class="mobile-modal-backdrop" id="broadcast-sheet">
        <div class="mobile-modal-sheet">
          <div class="sheet-header">
            <h3 class="sheet-title">Emergency MC Broadcast</h3>
            <button type="button" class="sheet-close" onclick="closeBroadcastModal()">&times;</button>
          </div>
          <form onsubmit="handleSaveBroadcast(event)">
            <div style="margin-bottom:10px;">
              <label style="font-size:11.5px;color:var(--muted);display:block;margin-bottom:4px;">Urgent Banner Text for Event Crew</label>
              <input type="text" id="broadcast-input" class="text-input" required placeholder="e.g. Cake cutting delayed 10m - sound tech alerted" value="Cake cutting delayed 10m - sound tech alerted">
            </div>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-outline btn-block" onclick="closeBroadcastModal()">Cancel</button>
              <button type="submit" class="btn btn-gold btn-block">Broadcast Alert</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>

  <script>
    /* Tap & Toast Shared Core & State Synchronization */
    const STORAGE_KEY = 'tt_demo_v1';
    const SESSION_KEY = 'tt_session';
    const SEED_DATA = {seed_json};

    window._tt_in_memory_state = null;
    window._tt_in_memory_session = null;

    function loadState() {{
      try {{
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }} catch (e) {{
        console.warn('localStorage read error', e);
      }}
      if (window._tt_in_memory_state) return window._tt_in_memory_state;
      return JSON.parse(JSON.stringify(SEED_DATA));
    }}

    function saveState(state) {{
      window._tt_in_memory_state = state;
      try {{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }} catch (e) {{
        console.warn('localStorage save error', e);
      }}
      try {{
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {{
          window.parent.postMessage({{ type: 'STATE_UPDATED', state: state }}, '*');
        }}
      }} catch (e) {{}}
    }}

    function getSession() {{
      let session = null;
      try {{
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) session = JSON.parse(raw);
      }} catch (e) {{}}
      if (!session && window._tt_in_memory_session) session = window._tt_in_memory_session;
      return session;
    }}

    function setSession(sessionData) {{
      if (!sessionData.at) sessionData.at = Date.now();
      window._tt_in_memory_session = sessionData;
      try {{
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      }} catch (e) {{}}
      try {{
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {{
          window.parent.postMessage({{ type: 'SESSION_UPDATED', session: sessionData }}, '*');
        }}
      }} catch (e) {{}}
    }}

    function clearSession() {{
      window._tt_in_memory_session = null;
      try {{ localStorage.removeItem(SESSION_KEY); }} catch (e) {{}}
    }}

    function handleDemobarNav(e, role, targetUrl) {{
      if (e && e.preventDefault) e.preventDefault();
      try {{
        if (role === 'mc') {{
          setSession({{ role: 'mc', email: 'robert@galati.demo', name: 'Robert Galati', businessName: 'Galati MC & Entertainment', keepSignedIn: true, at: Date.now() }});
        }} else if (role === 'couple') {{
          setSession({{ role: 'couple', email: 'sophie.james@demo.test', name: 'Sophie & James', keepSignedIn: true, at: Date.now() }});
        }} else if (role === 'superadmin') {{
          setSession({{ role: 'superadmin', email: 'admin@tapandtoast.demo', name: 'Platform Admin', keepSignedIn: true, at: Date.now() }});
        }}
      }} catch (err) {{}}
      try {{
        if (window.parent && window.parent !== window) {{
          window.parent.postMessage({{ type: 'NAVIGATE', url: targetUrl, role: role }}, '*');
        }}
      }} catch (err) {{}}
      window.location.href = targetUrl;
    }}

    function resetDemoData() {{
      try {{ localStorage.removeItem(STORAGE_KEY); }} catch(e) {{}}
      window._tt_in_memory_state = null;
      showToast('Demo data successfully reset to seed state');
      setTimeout(() => location.reload(), 300);
    }}

    function showToast(msg, isSuccess = true) {{
      const toast = document.getElementById('toast-popup');
      const text = document.getElementById('toast-msg');
      const icon = document.getElementById('toast-icon');
      if (!toast) return;
      text.textContent = msg;
      icon.textContent = isSuccess ? '✓' : '⚠️';
      toast.style.display = 'flex';
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => {{
        toast.style.display = 'none';
      }}, 3200);
    }}

    function escapeHtml(str) {{
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }}

    /* Global MC State */
    let currentWeddingId = 'w1';
    let currentFilter = 'all';
    let currentCueSearch = '';
    let currentGuestSearch = '';
    let selectedTableId = 'head';

    /* App Initialization */
    window.addEventListener('DOMContentLoaded', () => {{
      updateClock();
      setInterval(updateClock, 1000);
      checkAuthAndRender();
    }});

    function updateClock() {{
      const d = new Date();
      const el = document.getElementById('phone-clock');
      if (el) {{
        let hours = d.getHours();
        let minutes = d.getMinutes();
        el.textContent = `${{hours}}:${{minutes < 10 ? '0' : ''}}${{minutes}}`;
      }}
    }}

    function checkAuthAndRender() {{
      const session = getSession();
      const authView = document.getElementById('mc-mobile-auth');
      const appHeader = document.getElementById('mc-app-header');
      const weddingBanner = document.getElementById('mc-wedding-banner');
      const bottomNav = document.getElementById('mc-bottom-nav');

      if (session && session.role === 'mc') {{
        authView.style.display = 'none';
        appHeader.style.display = 'flex';
        weddingBanner.style.display = 'flex';
        bottomNav.style.display = 'flex';
        document.getElementById('mc-user-name').textContent = session.name || 'Robert Galati';
        const initials = (session.name || 'RG').split(' ').map(x => x[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('mc-avatar').textContent = initials;
        
        renderAllPanes();
        switchPane('pane-runsheet');
      }} else {{
        authView.style.display = 'flex';
        appHeader.style.display = 'none';
        weddingBanner.style.display = 'none';
        bottomNav.style.display = 'none';
        document.querySelectorAll('.mc-pane').forEach(p => p.classList.remove('active'));
      }}
    }}

    /* Auth Handlers */
    function switchAuthTab(tab) {{
      const tabLogin = document.getElementById('tab-login');
      const tabReg = document.getElementById('tab-register');
      const formLogin = document.getElementById('mc-login-form');
      const formReg = document.getElementById('mc-register-form');

      if (tab === 'login') {{
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
        formLogin.style.display = 'block';
        formReg.style.display = 'none';
      }} else {{
        tabLogin.classList.remove('active');
        tabReg.classList.add('active');
        formLogin.style.display = 'none';
        formReg.style.display = 'block';
      }}
    }}

    function togglePasswordVisibility(id) {{
      const input = document.getElementById(id);
      if (input) {{
        input.type = input.type === 'password' ? 'text' : 'password';
      }}
    }}

    function handleQuickMCDemoLogin() {{
      const user = {{
        role: 'mc',
        email: 'robert@galati.demo',
        name: 'Robert Galati',
        businessName: 'Galati MC & Entertainment',
        keepSignedIn: true,
        at: Date.now()
      }};
      setSession(user);
      showToast('Signed in as Robert Galati (MC)');
      checkAuthAndRender();
    }}

    function handleMCLogin(e) {{
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const remember = document.getElementById('login-remember').checked;
      const user = {{
        role: 'mc',
        email: email,
        name: email.split('@')[0].replace('.', ' ').replace(/(^|\\s)\\S/g, l => l.toUpperCase()),
        businessName: 'Professional MC Console',
        keepSignedIn: remember,
        at: Date.now()
      }};
      setSession(user);
      showToast('Welcome to MC Mobile Console');
      checkAuthAndRender();
    }}

    function handleMCRegister(e) {{
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const biz = document.getElementById('reg-biz').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const user = {{
        role: 'mc',
        email: email,
        name: name,
        businessName: biz,
        keepSignedIn: true,
        at: Date.now()
      }};
      setSession(user);
      showToast('MC account registered successfully!');
      checkAuthAndRender();
    }}

    function handleSignOut() {{
      clearSession();
      showToast('Signed out from MC Mobile');
      checkAuthAndRender();
    }}

    function openForgotModal(e) {{
      if (e) e.preventDefault();
      showToast('Demo MC Login: robert@galati.demo / demo123 (or use 1-Click login)');
    }}

    /* Pane Switcher */
    function switchPane(paneId, btn) {{
      document.querySelectorAll('.mc-pane').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(paneId);
      if (target) target.classList.add('active');

      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
      if (btn) {{
        btn.classList.add('active');
      }} else {{
        const matched = document.querySelector(`.nav-tab-btn[data-pane="${{paneId}}"]`);
        if (matched) matched.classList.add('active');
      }}
      document.getElementById('phone-content-scroll').scrollTop = 0;
    }}

    function handleWeddingChange(wId) {{
      currentWeddingId = wId;
      showToast('Loaded wedding schedule for ' + (wId === 'w1' ? 'Sophie & James' : wId === 'w2' ? 'Aisha & Marcus' : 'Elena & Mateo'));
      renderAllPanes();
    }}

    function renderAllPanes() {{
      renderRunSheet();
      renderSeating();
      renderGuests();
      renderGigs();
    }}

    /* --- RUN SHEET LOGIC --- */
    function getActiveRunSheet() {{
      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || (state.weddings && state.weddings[0]);
      if (!wedding) return [];
      if (wedding.privateRunSheet && wedding.privateRunSheet.length > 0) {{
        return wedding.privateRunSheet;
      }}
      if (!wedding.runSheet) wedding.runSheet = [];
      wedding.privateRunSheet = wedding.runSheet.map((rs, i) => ({{
        id: rs.id || 'cue_' + (i + 1),
        time: rs.time || '16:00',
        activity: rs.note ? rs.note.split(';')[0] : 'Wedding Cue Item',
        notes: rs.note || 'Public schedule timing',
        privateNotes: 'MC Cue Notes: check wireless mic and audio cue.',
        done: !!rs.done
      }}));
      saveState(state);
      return wedding.privateRunSheet;
    }}

    function renderRunSheet() {{
      const container = document.getElementById('mc-runsheet-list');
      if (!container) return;
      const allItems = getActiveRunSheet();

      let items = allItems;
      if (currentFilter === 'pending') items = items.filter(x => !x.done);
      else if (currentFilter === 'done') items = items.filter(x => x.done);

      if (currentCueSearch) {{
        const q = currentCueSearch.toLowerCase();
        items = items.filter(x => (x.activity || '').toLowerCase().includes(q) || (x.notes || '').toLowerCase().includes(q) || (x.privateNotes || '').toLowerCase().includes(q));
      }}

      if (items.length === 0) {{
        container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:12px;">No cues match the selected filter.</div>';
        return;
      }}

      container.innerHTML = items.map(item => {{
        const realIdx = allItems.indexOf(item);
        return `
          <div class="cue-card ${{item.done ? 'done' : ''}}" id="cue-card-${{realIdx}}">
            <div class="cue-top-row">
              <input type="checkbox" class="cue-checkbox" ${{item.done ? 'checked' : ''}} onchange="toggleCueDone(${{realIdx}}, this.checked)">
              <span class="cue-time-badge">${{escapeHtml(item.time)}}</span>
              <input type="text" class="cue-title-input" value="${{escapeHtml(item.activity)}}" onchange="updateCueField(${{realIdx}}, 'activity', this.value)">
              <div class="cue-actions">
                <button type="button" title="Move Up" onclick="moveCue(${{realIdx}}, -1)" ${{realIdx === 0 ? 'disabled style="opacity:0.35;"' : ''}}>▲</button>
                <button type="button" title="Move Down" onclick="moveCue(${{realIdx}}, 1)" ${{realIdx === allItems.length - 1 ? 'disabled style="opacity:0.35;"' : ''}}>▼</button>
                <button type="button" style="color:#b3261e;" title="Delete" onclick="deleteCue(${{realIdx}})">🗑️</button>
              </div>
            </div>

            <!-- Public Notes -->
            <div style="font-size:11.5px;color:var(--muted);padding-left:26px;">
              <input type="text" class="text-input" style="padding:4px 8px;font-size:11.5px;background:#f9f6f0;" value="${{escapeHtml(item.notes || '')}}" placeholder="Public schedule note..." onchange="updateCueField(${{realIdx}}, 'notes', this.value)">
            </div>

            <!-- MC Cue Notes (Confidential) -->
            <div class="mc-cue-notes-box">
              <div class="mc-cue-notes-label">MC Cue Notes</div>
              <input type="text" class="mc-cue-notes-input" value="${{escapeHtml(item.privateNotes || '')}}" placeholder="Private cue notes, microphone directions, audio prompts..." onchange="updateCueField(${{realIdx}}, 'privateNotes', this.value)">
            </div>
          </div>
        `;
      }}).join('');
    }}

    function toggleCueDone(idx, isDone) {{
      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || state.weddings[0];
      const items = wedding.privateRunSheet || [];
      if (items[idx]) {{
        items[idx].done = isDone;
        saveState(state);
        showToast(isDone ? 'Marked cue as completed' : 'Marked cue pending');
        renderRunSheet();
      }}
    }}

    function updateCueField(idx, field, value) {{
      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || state.weddings[0];
      const items = wedding.privateRunSheet || [];
      if (items[idx]) {{
        items[idx][field] = value;
        saveState(state);
        showToast('Schedule cue updated');
      }}
    }}

    function moveCue(idx, dir) {{
      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || state.weddings[0];
      const items = wedding.privateRunSheet || [];
      const target = idx + dir;
      if (target >= 0 && target < items.length) {{
        const temp = items[idx];
        items[idx] = items[target];
        items[target] = temp;
        saveState(state);
        renderRunSheet();
      }}
    }}

    function deleteCue(idx) {{
      if (!confirm('Delete this cue from the schedule?')) return;
      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || state.weddings[0];
      wedding.privateRunSheet.splice(idx, 1);
      saveState(state);
      showToast('Cue removed from schedule');
      renderRunSheet();
    }}

    function filterRunSheet(filter, btn) {{
      currentFilter = filter;
      document.querySelectorAll('#rs-filter-pills button').forEach(b => {{
        b.className = 'btn btn-outline btn-sm';
      }});
      if (btn) btn.className = 'btn btn-gold btn-sm';
      renderRunSheet();
    }}

    function handleSearchCues(q) {{
      currentCueSearch = q;
      renderRunSheet();
    }}

    function openAddCueModal() {{
      document.getElementById('add-cue-sheet').style.display = 'flex';
    }}

    function closeAddCueModal() {{
      document.getElementById('add-cue-sheet').style.display = 'none';
    }}

    function handleSaveNewCue(e) {{
      e.preventDefault();
      const time = document.getElementById('new-cue-time').value.trim();
      const title = document.getElementById('new-cue-title').value.trim();
      const pubNotes = document.getElementById('new-cue-public').value.trim();
      const privNotes = document.getElementById('new-cue-private').value.trim();

      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || state.weddings[0];
      if (!wedding.privateRunSheet) wedding.privateRunSheet = [];

      wedding.privateRunSheet.push({{
        id: 'cue_' + Date.now(),
        time: time || '19:00',
        activity: title || 'New MC Cue',
        notes: pubNotes,
        privateNotes: privNotes || 'MC Cue Notes: check wireless mic level.',
        done: false
      }});

      saveState(state);
      closeAddCueModal();
      showToast('Added cue to schedule');
      renderRunSheet();
    }}

    function openBroadcastModal() {{
      document.getElementById('broadcast-sheet').style.display = 'flex';
    }}

    function closeBroadcastModal() {{
      document.getElementById('broadcast-sheet').style.display = 'none';
    }}

    function handleSaveBroadcast(e) {{
      e.preventDefault();
      const text = document.getElementById('broadcast-input').value.trim();
      document.getElementById('mc-broadcast-text').textContent = text;
      closeBroadcastModal();
      showToast('Emergency alert broadcasted');
    }}

    /* --- SEATING & FLOOR PLAN LOGIC --- */
    function renderSeating() {{
      const state = loadState();
      const tables = state.tables || [];
      const guests = state.guests || [];

      // Tables pill list
      const pillRow = document.getElementById('table-pill-row');
      if (pillRow) {{
        pillRow.innerHTML = tables.map(t => `
          <button type="button" class="table-pill-btn ${{t.id === selectedTableId ? 'active' : ''}}" onclick="selectTable('${{t.id}}')">
            ${{escapeHtml(t.name)}} (${{guests.filter(g => g.tableId === t.id).length}}/${{t.capacity}})
          </button>
        `).join('');
      }}

      // Selected table view
      const activeTable = tables.find(t => t.id === selectedTableId) || tables[0];
      if (activeTable) {{
        document.getElementById('st-name').textContent = activeTable.name;
        const seated = guests.filter(g => g.tableId === activeTable.id);
        document.getElementById('st-capacity').textContent = `${{seated.length}} / ${{activeTable.capacity}} Seated`;
        
        const listEl = document.getElementById('st-guests-list');
        if (seated.length === 0) {{
          listEl.innerHTML = '<div style="color:var(--muted);font-style:italic;">No guests seated at this table yet.</div>';
        }} else {{
          listEl.innerHTML = seated.map((g, i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;background:#f9f6f0;border-radius:6px;border:1px solid #eee5d8;">
              <span style="font-weight:600;">${{i+1}}. ${{escapeHtml(g.name)}}</span>
              <div style="display:flex;gap:4px;align-items:center;">
                ${{g.dietary && g.dietary !== 'None' ? `<span class="pill pill-gold" style="font-size:9.5px;">${{escapeHtml(g.dietary)}}</span>` : ''}}
                <button type="button" class="btn btn-outline btn-sm" style="padding:2px 6px;font-size:10px;" onclick="unseatGuest('${{g.id}}')">Unseat</button>
              </div>
            </div>
          `).join('');
        }}
      }}

      // Metrics
      const totalSeated = guests.filter(g => g.tableId).length;
      document.getElementById('seat-metric-seated').textContent = `${{totalSeated}} / ${{guests.length}}`;
      const unassigned = guests.filter(g => !g.tableId);
      document.getElementById('seat-metric-unassigned').textContent = `${{unassigned.length}} Pending`;
      document.getElementById('unassigned-count-pill').textContent = `${{unassigned.length}} to seat`;

      // Render Unassigned Guests with matched 32px height and Seat button
      const unassignedList = document.getElementById('unassigned-guests-list');
      if (unassigned.length === 0) {{
        unassignedList.innerHTML = '<div style="color:var(--muted);font-size:12px;text-align:center;padding:10px;">All guests have been allocated to tables!</div>';
      }} else {{
        unassignedList.innerHTML = unassigned.slice(0, 10).map(g => `
          <div style="background:#ffffff;border:1px solid #ebd8c0;border-radius:8px;padding:8px 10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <strong style="font-size:12.5px;color:var(--ink);display:block;">${{escapeHtml(g.name)}}</strong>
                <span style="font-size:11px;color:var(--muted);">${{g.plusOne ? '+1 guest' : 'No plus-one'}} ${{g.dietary && g.dietary !== 'None' ? '· ' + g.dietary : ''}}</span>
              </div>
            </div>
            <!-- Matched 32px height container and Seat button -->
            <div style="display:flex;gap:6px;margin-top:8px;align-items:center;">
              <select class="text-input" style="height:32px;padding:0 8px;font-size:12px;flex:1;border-radius:6px;border:1px solid #dcd3c8;background:#ffffff;box-sizing:border-box;" onchange="if(this.value){{assignGuestToTable('${{g.id}}', this.value);this.value='';}}">
                <option value="">Seat at Table...</option>
                ${{tables.map(t => `<option value="${{t.id}}">${{t.name}} (${{guests.filter(x => x.tableId === t.id).length}}/${{t.capacity}})</option>`).join('')}}
              </select>
              <button type="button" class="btn btn-gold" style="height:32px;padding:0 12px;font-size:12px;font-weight:600;border-radius:6px;box-sizing:border-box;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;" onclick="autoSeatGuest('${{g.id}}')" title="Seat guest at next free seat">Seat</button>
            </div>
          </div>
        `).join('');
      }}
    }}

    function selectTable(tblId) {{
      selectedTableId = tblId;
      renderSeating();
    }}

    function assignGuestToTable(guestId, tableId) {{
      const state = loadState();
      const guest = (state.guests || []).find(g => g.id === guestId);
      if (guest) {{
        guest.tableId = tableId;
        saveState(state);
        showToast(`Seated ${{guest.name}}`);
        renderSeating();
      }}
    }}

    function autoSeatGuest(guestId) {{
      const state = loadState();
      const tables = state.tables || [];
      const guests = state.guests || [];
      const targetTable = tables.find(t => guests.filter(g => g.tableId === t.id).length < t.capacity);
      if (targetTable) {{
        assignGuestToTable(guestId, targetTable.id);
      }} else {{
        showToast('All tables are at full capacity!', false);
      }}
    }}

    function unseatGuest(guestId) {{
      const state = loadState();
      const guest = (state.guests || []).find(g => g.id === guestId);
      if (guest) {{
        guest.tableId = null;
        saveState(state);
        showToast(`Unseated ${{guest.name}}`);
        renderSeating();
      }}
    }}

    /* --- GUESTS DIRECTORY LOGIC --- */
    function renderGuests() {{
      const state = loadState();
      let guests = state.guests || [];
      const tables = state.tables || [];

      if (currentGuestSearch) {{
        const q = currentGuestSearch.toLowerCase();
        guests = guests.filter(g => (g.name || '').toLowerCase().includes(q) || (g.dietary || '').toLowerCase().includes(q));
      }}

      document.getElementById('guest-count-label').textContent = `Showing ${{guests.length}} Guests`;
      const container = document.getElementById('mc-guest-directory-list');
      if (!container) return;

      container.innerHTML = guests.slice(0, 50).map(g => {{
        const table = tables.find(t => t.id === g.tableId);
        return `
          <div style="background:#ffffff;border:1px solid var(--line);border-radius:8px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="font-size:12.5px;color:var(--ink);">${{escapeHtml(g.name)}}</strong>
              <div style="font-size:11px;color:var(--muted);">${{g.plusOne ? '+1 guest' : 'Individual'}} ${{g.dietary && g.dietary !== 'None' ? '· ' + g.dietary : ''}}</div>
            </div>
            <span class="pill ${{table ? 'pill-dark' : 'pill-gold'}}" style="font-size:10px;">
              ${{table ? escapeHtml(table.name) : 'Unassigned'}}
            </span>
          </div>
        `;
      }}).join('');
    }}

    function handleSearchGuests(q) {{
      currentGuestSearch = q;
      renderGuests();
    }}

    /* --- GIGS & MULTI-WEDDING LOGIC --- */
    function renderGigs() {{
      const state = loadState();
      const weddings = state.weddings || [];
      const container = document.getElementById('mc-weddings-gigs-list');
      if (!container) return;

      container.innerHTML = weddings.map(w => `
        <div class="card" style="padding:12px;border-left:4px solid ${{w.id === currentWeddingId ? 'var(--gold)' : '#c0b4a6'}};">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <div>
              <h4 style="font-size:13.5px;font-weight:700;color:var(--ink);">${{escapeHtml(w.couple)}}</h4>
              <p style="font-size:11.5px;color:var(--muted);">${{escapeHtml(w.date)}} &bull; ${{escapeHtml(w.venue)}}</p>
            </div>
            <span class="pill ${{w.id === currentWeddingId ? 'pill-green' : 'pill-gold'}}">${{w.id === currentWeddingId ? 'Active Live' : 'Booked'}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:11.5px;color:var(--muted);">
            <span>MC Fee: <strong>$2,400 AUD</strong> (Deposit Paid)</span>
            ${{w.id !== currentWeddingId ? `<button type="button" class="btn btn-outline btn-sm" onclick="handleWeddingChange('${{w.id}}')">Switch to Wedding</button>` : '<span style="color:var(--gold-hover);font-weight:700;">Currently Active</span>'}}
          </div>
        </div>
      `).join('');
    }}
  </script>
</body>
</html>
"""
    with open('mc-mobile.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("mc-mobile.html generated successfully!")

if __name__ == '__main__':
    build_mc_mobile_html()
