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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
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

    /* Phone Stage / Mockup Chassis (402px x 874px) */
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

    /* Professional Home Header (Level 1) */
    .mc-home-header {{
      background: #19130f;
      color: #ffffff;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #33261e;
      flex-shrink: 0;
    }}
    .mc-home-brand {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .mc-home-logo-box {{
      width: 34px;
      height: 34px;
      border-radius: 6px;
      background: #2b2018;
      border: 1.5px solid var(--gold);
      color: var(--gold);
      display: grid;
      place-items: center;
      font-family: var(--font-heading);
      font-size: 17px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(189,150,97,0.25);
    }}
    .mc-home-title-box {{
      display: flex;
      flex-direction: column;
    }}
    .mc-home-title {{
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.3px;
    }}
    .mc-home-subtitle {{
      font-size: 10px;
      color: var(--gold-light);
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }}
    .mc-home-badge {{
      background: #38281a;
      color: #dfc194;
      border: 1px solid #5a422d;
      font-size: 10.5px;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 700;
    }}

    /* Active Wedding Console Header (Level 2) */
    .mc-wedding-header {{
      background: #19130f;
      color: #ffffff;
      padding: 9px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #33261e;
      flex-shrink: 0;
    }}
    .mc-back-btn {{
      background: #2b2018;
      border: 1px solid #4a382a;
      color: #dfc194;
      font-size: 11.5px;
      font-weight: 600;
      padding: 5px 9px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }}
    .mc-back-btn:hover {{
      background: #3d2d20;
      color: #ffffff;
    }}
    .mc-wedding-info {{
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }}
    .mc-wedding-name {{
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 5px;
    }}
    .mc-wedding-live-pill {{
      font-size: 9.5px;
      color: #7ce382;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
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
      position: relative;
    }}

    /* Bottom Navigation Bars */
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
      font-size: 9.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 6px;
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

    /* 3-Way Seating Segment Switcher (Requirement 2) */
    .seating-segment-bar {{
      display: flex;
      background: #ece5d9;
      border-radius: 8px;
      padding: 3px;
      gap: 3px;
      margin-bottom: 12px;
    }}
    .seating-segment-btn {{
      flex: 1;
      background: transparent;
      border: none;
      padding: 7px 4px;
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
      white-space: nowrap;
    }}
    .seating-segment-btn.active {{
      background: #ffffff;
      color: var(--ink);
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }}

    /* Circular Table Canvas & Diagram (Image 3) */
    .floorplan-dotted-canvas {{
      background-color: #faf9f6;
      background-image: radial-gradient(#d5cbbe 1.2px, transparent 1.2px);
      background-size: 16px 16px;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 36px 16px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }}
    .round-table-diagram {{
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }}
    .round-table-name {{
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
      text-align: center;
      padding: 0 8px;
      line-height: 1.2;
    }}
    .round-table-count {{
      font-size: 11px;
      color: var(--muted);
      margin-top: 3px;
      font-weight: 600;
    }}
    .seat-dot {{
      position: absolute;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #1c1511;
      color: #dfc194;
      font-size: 9.5px;
      font-weight: 700;
      display: grid;
      place-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.25);
      border: 1.5px solid #2e231b;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;
      z-index: 5;
    }}
    .seat-dot:hover {{
      transform: scale(1.18);
      background: #3b2c21;
    }}
    .seat-dot.empty {{
      background: #ffffff;
      border: 1.5px dashed #c4b5a0;
      color: #b5a48e;
      box-shadow: none;
    }}

    /* Floating Joey Chatbot Button & Panel (Requirement 5) */
    .mc-chat-fab {{
      position: absolute;
      bottom: 74px;
      right: 14px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #1c1511;
      border: 2px solid var(--gold);
      color: var(--gold);
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      z-index: 120;
      transition: transform 0.15s ease;
    }}
    .mc-chat-fab:hover {{
      transform: scale(1.08);
      background: #2b211a;
    }}
    .mc-chat-fab-pulse {{
      position: absolute;
      width: 10px;
      height: 10px;
      background: #2e7d32;
      border: 2px solid #1c1511;
      border-radius: 50%;
      top: 1px;
      right: 1px;
    }}

    /* Chat Panel inside Mockup Frame */
    .mc-chat-panel {{
      position: absolute;
      top: 42px;
      left: 0;
      right: 0;
      bottom: 0;
      background: #ffffff;
      z-index: 150;
      display: none;
      flex-direction: column;
      border-radius: 0 0 42px 42px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }}
    .mc-chat-header {{
      background: #181310;
      color: #ffffff;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #33261e;
      flex-shrink: 0;
    }}
    .mc-chat-title-wrap {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .mc-chat-avatar {{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #2e231b;
      border: 1.5px solid var(--gold);
      display: grid;
      place-items: center;
      color: var(--gold);
      font-size: 15px;
    }}
    .mc-chat-body {{
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #fbf9f6;
    }}
    .chat-bubble {{
      max-width: 82%;
      padding: 9px 12px;
      border-radius: 12px;
      font-size: 12.5px;
      line-height: 1.4;
    }}
    .chat-bubble-bot {{
      background: #ffffff;
      border: 1px solid var(--line);
      color: var(--ink);
      align-self: flex-start;
      border-bottom-left-radius: 3px;
    }}
    .chat-bubble-user {{
      background: #1c1511;
      color: #ffffff;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }}
    .chat-chips-row {{
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 6px 14px;
      background: #f4ede3;
      border-top: 1px solid var(--line);
      scrollbar-width: none;
    }}
    .chat-chip {{
      background: #ffffff;
      border: 1px solid var(--line-strong);
      padding: 4px 9px;
      border-radius: 14px;
      font-size: 11px;
      font-weight: 600;
      color: var(--ink);
      white-space: nowrap;
      cursor: pointer;
    }}
    .chat-chip:hover {{
      background: var(--gold);
      border-color: var(--gold);
      color: #140f0c;
    }}
    .mc-chat-footer {{
      padding: 10px 14px;
      background: #ffffff;
      border-top: 1px solid var(--line);
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
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

      <!-- Level 1: Master Home Header (Professional Branding) -->
      <header class="mc-home-header" id="mc-home-header" style="display:none;">
        <div class="mc-home-brand">
          <div class="mc-home-logo-box">T</div>
          <div class="mc-home-title-box">
            <span class="mc-home-title">Tap &amp; Toast <span style="color:var(--gold);">MC Pro</span></span>
            <span class="mc-home-subtitle">Executive MC Console</span>
          </div>
        </div>
        <span class="mc-home-badge" id="mc-home-active-badge">🟢 1 LIVE TODAY</span>
      </header>

      <!-- Level 2: Active Wedding Console Header (With Back to All Weddings) -->
      <header class="mc-wedding-header" id="mc-wedding-header" style="display:none;">
        <button type="button" class="mc-back-btn" onclick="navigateToHome('home-weddings')">
          ← All Weddings
        </button>
        <div class="mc-wedding-info">
          <span class="mc-wedding-name" id="mc-active-wedding-title">💍 Sophie &amp; James</span>
          <span class="mc-wedding-live-pill" id="mc-active-wedding-sub">🟢 LIVE CONSOLE</span>
        </div>
        <div style="width:75px;text-align:right;">
          <span class="pill pill-gold" style="font-size:9.5px;padding:2px 6px;" id="mc-quick-day-pill">Nov 14</span>
        </div>
      </header>

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

        <!-- ================= LEVEL 1: MASTER HOME PANES ================= -->

        <!-- Home Pane 1: ALL WEDDINGS (Requirement 4) -->
        <div class="mc-pane" id="home-weddings">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h2 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);">Assigned Weddings</h2>
              <p style="font-size:11.5px;color:var(--muted);">Select a wedding to enter live run sheet &amp; floor plan</p>
            </div>
            <span class="pill pill-gold" id="home-weddings-count-pill">3 Active</span>
          </div>

          <div id="home-weddings-card-list" style="display:flex;flex-direction:column;gap:12px;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Home Pane 2: CALENDAR -->
        <div class="mc-pane" id="home-calendar">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h2 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);">MC Gigs &amp; Calendar</h2>
              <p style="font-size:11.5px;color:var(--muted);">Upcoming call times, rehearsals &amp; bookings</p>
            </div>
            <span class="pill pill-green">2026 / 2027</span>
          </div>

          <div class="card" style="padding:12px;">
            <div style="font-size:12.5px;font-weight:700;margin-bottom:8px;color:var(--ink);">📅 Upcoming Schedule Overview</div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#fbf8f3;border-radius:8px;border-left:3px solid var(--gold);">
                <div>
                  <strong>Sat, 14 Nov 2026</strong> &bull; 13:30 Call Time
                  <div style="font-size:11px;color:var(--muted);">Sophie &amp; James &bull; Fernwood Estate</div>
                </div>
                <span class="pill pill-green">Today</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#fbf8f3;border-radius:8px;border-left:3px solid #8e7c6b;">
                <div>
                  <strong>Sun, 02 May 2027</strong> &bull; 14:00 Call Time
                  <div style="font-size:11px;color:var(--muted);">Aisha &amp; Marcus &bull; Doltone House</div>
                </div>
                <span class="pill pill-gold">Confirmed</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:#fbf8f3;border-radius:8px;border-left:3px solid #8e7c6b;">
                <div>
                  <strong>Sun, 20 Jun 2027</strong> &bull; 13:30 Call Time
                  <div style="font-size:11px;color:var(--muted);">Emma &amp; Tom &bull; Dunbar House</div>
                </div>
                <span class="pill pill-dark">Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Home Pane 3: INVOICE -->
        <div class="mc-pane" id="home-invoice">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h2 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);">Invoices &amp; Earnings</h2>
              <p style="font-size:11.5px;color:var(--muted);">Payment milestones, contracts &amp; receipts</p>
            </div>
            <span class="pill pill-gold">Total: $7,400 AUD</span>
          </div>

          <div id="home-invoice-list" style="display:flex;flex-direction:column;gap:8px;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Home Pane 4: TEAM -->
        <div class="mc-pane" id="home-team">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h2 style="font-family:var(--font-heading);font-size:18px;color:var(--ink);">Event Crew &amp; Team</h2>
              <p style="font-size:11.5px;color:var(--muted);">MC associates, sound engineers &amp; technicians</p>
            </div>
            <span class="pill pill-green">3 Active Crew</span>
          </div>

          <div id="home-team-list" style="display:flex;flex-direction:column;gap:8px;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Home Pane 5: SETTINGS / PROFILE (Requirement 1) -->
        <div class="mc-pane" id="home-settings">
          <div class="card" style="text-align:center;padding:20px 14px;">
            <div style="width:58px;height:58px;border-radius:50%;background:#2e231b;border:2px solid var(--gold);color:var(--gold);display:grid;place-items:center;font-size:22px;font-weight:700;margin:0 auto 10px;">
              RG
            </div>
            <h3 style="font-size:16px;font-weight:700;color:var(--ink);" id="settings-user-name">Robert Galati</h3>
            <p style="font-size:12px;color:var(--gold-hover);font-weight:600;margin-bottom:4px;">🎧 Master of Ceremonies &amp; Event Host</p>
            <p style="font-size:11px;color:var(--muted);">Galati MC &amp; Entertainment &bull; ABN 48 192 847 291</p>
          </div>

          <div class="card">
            <div style="font-size:12.5px;font-weight:700;margin-bottom:8px;color:var(--ink);">MC Account Details</div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f0eae1;padding-bottom:5px;">
                <span style="color:var(--muted);">Email:</span>
                <strong id="settings-user-email">robert@galati.demo</strong>
              </div>
              <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f0eae1;padding-bottom:5px;">
                <span style="color:var(--muted);">Direct Line:</span>
                <strong>+61 418 223 901</strong>
              </div>
              <div style="display:flex;justify-content:space-between;border-bottom:1px solid #f0eae1;padding-bottom:5px;">
                <span style="color:var(--muted);">Service Tier:</span>
                <span class="pill pill-gold">Elite MC / Producer</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:var(--muted);">Security:</span>
                <span style="color:var(--success);font-weight:600;">✓ 2FA Verified</span>
              </div>
            </div>
          </div>

          <!-- Sign Out Button (Requirement 1) -->
          <button type="button" class="btn btn-outline btn-block" style="color:#b3261e;border-color:#f1b3b3;background:#fff8f8;padding:12px;font-size:13px;font-weight:700;" onclick="handleSignOut()">
            🚪 Sign Out of MC Console
          </button>
        </div>


        <!-- ================= LEVEL 2: ACTIVE WEDDING CONSOLE PANES ================= -->

        <!-- Wedding Pane 1: RUN SHEET -->
        <div class="mc-pane" id="wedding-runsheet">
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

        <!-- Wedding Pane 2: SEATING & GUESTS (Requirement 2 & Image 2/3) -->
        <div class="mc-pane" id="wedding-seating">
          <!-- 3-Way Segment Switcher (Requirement 2) -->
          <div class="seating-segment-bar">
            <button type="button" class="seating-segment-btn active" id="seg-btn-guestlist" onclick="switchSeatingSegment('guestlist')">
              👥 Guest List
            </button>
            <button type="button" class="seating-segment-btn" id="seg-btn-seatingarr" onclick="switchSeatingSegment('seatingarr')">
              🪑 Seating Arrangement
            </button>
            <button type="button" class="seating-segment-btn" id="seg-btn-unseated" onclick="switchSeatingSegment('unseated')">
              ⏳ Unseated Guests
            </button>
          </div>

          <!-- Segment 1: ENTIRE GUEST LIST -->
          <div id="seating-seg-guestlist" style="display:flex;flex-direction:column;gap:10px;">
            <div>
              <input type="text" class="text-input" placeholder="🔍 Search guests by name or dietary..." oninput="handleSearchGuestList(this.value)">
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted);padding:0 2px;">
              <span id="gl-count-label">Showing 100 Guests</span>
              <span style="color:var(--success);font-weight:600;">✓ 96 Confirmed RSVPs</span>
            </div>
            <div id="gl-roster-list" style="display:flex;flex-direction:column;gap:6px;">
              <!-- Roster rendered dynamically -->
            </div>
          </div>

          <!-- Segment 2: SEATING ARRANGEMENT OF EACH TABLE (Image 3 - Circular diagrams with scrollbar) -->
          <div id="seating-seg-seatingarr" style="display:none;flex-direction:column;gap:16px;">
            <div style="font-size:11.5px;color:var(--muted);text-align:center;">
              Scroll down to inspect all tables and seated guests
            </div>
            <div id="seating-tables-scroll-list" style="display:flex;flex-direction:column;gap:18px;">
              <!-- All tables with Image 3 circular diagrams rendered dynamically -->
            </div>
          </div>

          <!-- Segment 3: UNSEATED / REMAINING GUESTS -->
          <div id="seating-seg-unseated" style="display:none;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;background:#fff8ee;padding:10px 12px;border-radius:8px;border:1px solid #ebd3a8;">
              <div>
                <strong style="font-size:13px;color:#6b4d1b;">Remaining Guests to Seat</strong>
                <div style="font-size:11px;color:var(--muted);">Assign remaining guests to free seats</div>
              </div>
              <button type="button" class="btn btn-gold btn-sm" onclick="autoSeatAllRemaining()">Seat All</button>
            </div>
            <div id="unseated-cards-list" style="display:flex;flex-direction:column;gap:8px;">
              <!-- Unassigned cards with matching 32px height select and Seat button -->
            </div>
          </div>
        </div>

        <!-- Wedding Pane 3: VENUE & LOGISTICS -->
        <div class="mc-pane" id="wedding-venue">
          <div class="card">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;">
              <div>
                <h3 style="font-family:var(--font-heading);font-size:16px;" id="venue-title">Fernwood Estate</h3>
                <p style="font-size:12px;color:var(--muted);" id="venue-address">1842 Range Road, Southern Highlands NSW</p>
              </div>
              <span class="pill pill-green">Verified</span>
            </div>
            <button type="button" class="btn btn-outline btn-block btn-sm" onclick="showToast('Directions copied to clipboard')">📍 Open Navigation Directions</button>
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

      </div>

      <!-- Floating Joey Chatbot Trigger (Requirement 5) -->
      <button type="button" class="mc-chat-fab" id="mc-chat-trigger" style="display:none;" onclick="toggleChatPanel()" aria-label="Open Joey Assistant" title="Open Joey MC Assistant">
        <span style="font-size:22px;">💬</span>
        <span class="mc-chat-fab-pulse"></span>
      </button>

      <!-- Joey Chatbot Modal Panel (Requirement 5) -->
      <div class="mc-chat-panel" id="mc-chat-panel">
        <div class="mc-chat-header">
          <div class="mc-chat-title-wrap">
            <div class="mc-chat-avatar">🤖</div>
            <div>
              <div style="font-size:13.5px;font-weight:700;">Joey &bull; MC Assistant</div>
              <div style="font-size:10.5px;color:var(--gold-light);">AI Stage &amp; Run Sheet Companion</div>
            </div>
          </div>
          <button type="button" style="background:transparent;border:none;color:#ffffff;font-size:16px;cursor:pointer;" onclick="toggleChatPanel()">&times;</button>
        </div>

        <div class="mc-chat-body" id="mc-chat-messages">
          <div class="chat-bubble chat-bubble-bot">
            Hello Robert! I am <strong>Joey</strong>, your MC AI Assistant.
          </div>
          <div class="chat-bubble chat-bubble-bot">
            I can check schedule timing, look up seated guests, dietary requirements, or vendor contacts.
          </div>
        </div>

        <div class="chat-chips-row">
          <span class="chat-chip" onclick="sendQuickChat('Next schedule cue')">⏰ Next cue</span>
          <span class="chat-chip" onclick="sendQuickChat('Who is at Head Table?')">👑 Head Table</span>
          <span class="chat-chip" onclick="sendQuickChat('Dietary alerts')">🥜 Allergies</span>
          <span class="chat-chip" onclick="sendQuickChat('Venue Manager phone')">📞 Venue phone</span>
        </div>

        <form class="mc-chat-footer" onsubmit="handleChatSubmit(event)">
          <input type="text" id="chat-input" class="text-input" style="padding:7px 10px;font-size:12px;" placeholder="Ask Joey about cues, guests, tables..." required>
          <button type="submit" class="btn btn-gold btn-sm" style="padding:7px 12px;">➤</button>
        </form>
      </div>

      <!-- LEVEL 1: HOME BOTTOM NAV (Requirement 5: all weddings, calendar, invoice, team, settings) -->
      <nav class="phone-bottom-nav" id="mc-home-bottom-nav" style="display:none;">
        <button type="button" class="nav-tab-btn active" data-home-pane="home-weddings" onclick="switchHomePane('home-weddings', this)">
          <span class="tab-icon">💍</span>
          <span>All Weddings</span>
        </button>
        <button type="button" class="nav-tab-btn" data-home-pane="home-calendar" onclick="switchHomePane('home-calendar', this)">
          <span class="tab-icon">📅</span>
          <span>Calendar</span>
        </button>
        <button type="button" class="nav-tab-btn" data-home-pane="home-invoice" onclick="switchHomePane('home-invoice', this)">
          <span class="tab-icon">🧾</span>
          <span>Invoice</span>
        </button>
        <button type="button" class="nav-tab-btn" data-home-pane="home-team" onclick="switchHomePane('home-team', this)">
          <span class="tab-icon">👥</span>
          <span>Team</span>
        </button>
        <button type="button" class="nav-tab-btn" data-home-pane="home-settings" onclick="switchHomePane('home-settings', this)">
          <span class="tab-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

      <!-- LEVEL 2: ACTIVE WEDDING BOTTOM NAV -->
      <nav class="phone-bottom-nav" id="mc-wedding-bottom-nav" style="display:none;">
        <button type="button" class="nav-tab-btn active" data-wedding-pane="wedding-runsheet" onclick="switchWeddingPane('wedding-runsheet', this)">
          <span class="tab-icon">📋</span>
          <span>Run Sheet</span>
        </button>
        <button type="button" class="nav-tab-btn" data-wedding-pane="wedding-seating" onclick="switchWeddingPane('wedding-seating', this)">
          <span class="tab-icon">🪑</span>
          <span>Seating</span>
        </button>
        <button type="button" class="nav-tab-btn" data-wedding-pane="wedding-venue" onclick="switchWeddingPane('wedding-venue', this)">
          <span class="tab-icon">📍</span>
          <span>Venue</span>
        </button>
        <button type="button" class="nav-tab-btn" onclick="navigateToHome('home-settings')">
          <span class="tab-icon">👤</span>
          <span>Profile</span>
        </button>
        <button type="button" class="nav-tab-btn" onclick="navigateToHome('home-weddings')">
          <span class="tab-icon">🏠</span>
          <span>Weddings</span>
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
      showToast('Demo data reset to seed state');
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

    /* Global Navigation State */
    let currentAppLevel = 'home'; // 'home' or 'wedding'
    let currentWeddingId = 'w1';
    let currentRunSheetFilter = 'all';
    let currentCueSearch = '';
    let currentGuestSearch = '';
    let activeSeatingSegment = 'guestlist';

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
      const homeHeader = document.getElementById('mc-home-header');
      const weddingHeader = document.getElementById('mc-wedding-header');
      const homeBottomNav = document.getElementById('mc-home-bottom-nav');
      const weddingBottomNav = document.getElementById('mc-wedding-bottom-nav');
      const chatFab = document.getElementById('mc-chat-trigger');

      if (session && session.role === 'mc') {{
        authView.style.display = 'none';
        chatFab.style.display = 'grid';

        document.getElementById('settings-user-name').textContent = session.name || 'Robert Galati';
        document.getElementById('settings-user-email').textContent = session.email || 'robert@galati.demo';

        if (currentAppLevel === 'home') {{
          homeHeader.style.display = 'flex';
          weddingHeader.style.display = 'none';
          homeBottomNav.style.display = 'flex';
          weddingBottomNav.style.display = 'none';
          renderHomePanes();
          switchHomePane('home-weddings');
        }} else {{
          homeHeader.style.display = 'none';
          weddingHeader.style.display = 'flex';
          homeBottomNav.style.display = 'none';
          weddingBottomNav.style.display = 'flex';
          renderWeddingPanes();
          switchWeddingPane('wedding-runsheet');
        }}
      }} else {{
        authView.style.display = 'flex';
        homeHeader.style.display = 'none';
        weddingHeader.style.display = 'none';
        homeBottomNav.style.display = 'none';
        weddingBottomNav.style.display = 'none';
        chatFab.style.display = 'none';
        document.querySelectorAll('.mc-pane').forEach(p => p.classList.remove('active'));
      }}
    }}

    /* Auth Actions */
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
      currentAppLevel = 'home';
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
      currentAppLevel = 'home';
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
      currentAppLevel = 'home';
      checkAuthAndRender();
    }}

    function handleSignOut() {{
      clearSession();
      currentAppLevel = 'home';
      showToast('Signed out from MC Mobile');
      checkAuthAndRender();
    }}

    function openForgotModal(e) {{
      if (e) e.preventDefault();
      showToast('Demo MC Login: robert@galati.demo / demo123 (or use 1-Click login)');
    }}

    /* Navigation Level 1 (Home Page) */
    function switchHomePane(paneId, btn) {{
      document.querySelectorAll('.mc-pane').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(paneId);
      if (target) target.classList.add('active');

      document.querySelectorAll('#mc-home-bottom-nav .nav-tab-btn').forEach(b => b.classList.remove('active'));
      if (btn) {{
        btn.classList.add('active');
      }} else {{
        const matched = document.querySelector(`#mc-home-bottom-nav .nav-tab-btn[data-home-pane="${{paneId}}"]`);
        if (matched) matched.classList.add('active');
      }}
      document.getElementById('phone-content-scroll').scrollTop = 0;
    }}

    function navigateToHome(initialPane = 'home-weddings') {{
      currentAppLevel = 'home';
      checkAuthAndRender();
      switchHomePane(initialPane);
    }}

    function openWeddingConsole(wId) {{
      currentWeddingId = wId;
      currentAppLevel = 'wedding';
      const state = loadState();
      const wedding = (state.weddings || []).find(w => w.id === wId) || state.weddings[0];

      document.getElementById('mc-active-wedding-title').textContent = `💍 ${{wedding.couple}}`;
      document.getElementById('mc-active-wedding-sub').textContent = wId === 'w1' ? '🟢 LIVE CONSOLE' : '📅 SCHEDULE CONSOLE';
      document.getElementById('venue-title').textContent = wedding.venue ? wedding.venue.split(',')[0] : 'Wedding Venue';
      document.getElementById('venue-address').textContent = wedding.venue || '1842 Range Road, Southern Highlands NSW';

      checkAuthAndRender();
      showToast(`Opened ${{wedding.couple}} Wedding Console`);
    }}

    /* Navigation Level 2 (Wedding Console) */
    function switchWeddingPane(paneId, btn) {{
      document.querySelectorAll('.mc-pane').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(paneId);
      if (target) target.classList.add('active');

      document.querySelectorAll('#mc-wedding-bottom-nav .nav-tab-btn').forEach(b => b.classList.remove('active'));
      if (btn) {{
        btn.classList.add('active');
      }} else {{
        const matched = document.querySelector(`#mc-wedding-bottom-nav .nav-tab-btn[data-wedding-pane="${{paneId}}"]`);
        if (matched) matched.classList.add('active');
      }}
      document.getElementById('phone-content-scroll').scrollTop = 0;
    }}

    /* Render Home Level Panes */
    function renderHomePanes() {{
      const state = loadState();
      const weddings = state.weddings || [];

      // Render All Weddings Cards (Requirement 4)
      const listEl = document.getElementById('home-weddings-card-list');
      if (listEl) {{
        listEl.innerHTML = weddings.map((w, idx) => `
          <div class="card" style="padding:14px;border-left:4px solid ${{idx === 0 ? 'var(--gold)' : '#b5a593'}};box-shadow:var(--shadow-sm);cursor:pointer;" onclick="openWeddingConsole('${{w.id}}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
              <div>
                <h3 style="font-family:var(--font-heading);font-size:16px;color:var(--ink);">💍 ${{escapeHtml(w.couple)}}</h3>
                <p style="font-size:11.5px;color:var(--muted);margin-top:2px;">📍 ${{escapeHtml(w.venue)}}</p>
              </div>
              <span class="pill ${{idx === 0 ? 'pill-green' : 'pill-gold'}}">${{idx === 0 ? '🟢 Live Today' : '📅 Booked'}}</span>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;background:#fbf8f3;padding:8px 10px;border-radius:8px;margin-top:8px;font-size:11.5px;">
              <span>📅 Date: <strong>${{escapeHtml(w.date ? w.date.split('T')[0] : '2026-11-14')}}</strong></span>
              <span>Guests: <strong>${{idx === 0 ? '118 Seated' : '95 Confirmed'}}</strong></span>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
              <span style="font-size:11.5px;color:var(--gold-hover);font-weight:700;">Executive MC + Sound Tier</span>
              <button type="button" class="btn btn-gold btn-sm" onclick="event.stopPropagation();openWeddingConsole('${{w.id}}')">
                Open Console &rarr;
              </button>
            </div>
          </div>
        `).join('');
      }}

      // Invoices
      const invList = document.getElementById('home-invoice-list');
      if (invList) {{
        const invoices = state.invoices || [];
        invList.innerHTML = invoices.map(inv => `
          <div class="card" style="padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="font-size:13px;display:block;">${{escapeHtml(inv.couple)}}</strong>
              <span style="font-size:11px;color:var(--muted);">${{escapeHtml(inv.id)}} &bull; ${{escapeHtml(inv.date)}}</span>
            </div>
            <div style="text-align:right;">
              <div style="font-weight:700;font-size:13px;">$${{inv.amount}} AUD</div>
              <span class="pill pill-green" style="font-size:9.5px;">${{escapeHtml(inv.status)}}</span>
            </div>
          </div>
        `).join('');
      }}

      // Team
      const teamList = document.getElementById('home-team-list');
      if (teamList) {{
        const team = state.team || [];
        teamList.innerHTML = team.map(tm => `
          <div class="card" style="padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="font-size:13px;display:block;">${{escapeHtml(tm.name)}}</strong>
              <span style="font-size:11px;color:var(--gold-hover);">${{escapeHtml(tm.role)}}</span>
            </div>
            <span class="pill pill-green" style="font-size:9.5px;">${{escapeHtml(tm.status || 'Active')}}</span>
          </div>
        `).join('');
      }}
    }}

    /* Render Wedding Level Panes */
    function renderWeddingPanes() {{
      renderRunSheet();
      renderSeatingSegmentContent();
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
        privateNotes: 'MC technical cue: check wireless microphone level and audio cue.',
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
      if (currentRunSheetFilter === 'pending') items = items.filter(x => !x.done);
      else if (currentRunSheetFilter === 'done') items = items.filter(x => x.done);

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

            <!-- MC Cue Notes (Clean label as requested in Part 2) -->
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
      currentRunSheetFilter = filter;
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

    /* --- SEATING & GUESTS 3-WAY SEGMENT SWITCHER (Requirement 2 & Image 2/3) --- */
    function switchSeatingSegment(seg) {{
      activeSeatingSegment = seg;
      document.querySelectorAll('.seating-segment-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = document.getElementById(`seg-btn-${{seg}}`);
      if (activeBtn) activeBtn.classList.add('active');

      document.getElementById('seating-seg-guestlist').style.display = (seg === 'guestlist') ? 'flex' : 'none';
      document.getElementById('seating-seg-seatingarr').style.display = (seg === 'seatingarr') ? 'flex' : 'none';
      document.getElementById('seating-seg-unseated').style.display = (seg === 'unseated') ? 'flex' : 'none';

      renderSeatingSegmentContent();
    }}

    function renderSeatingSegmentContent() {{
      if (activeSeatingSegment === 'guestlist') {{
        renderGuestListSegment();
      }} else if (activeSeatingSegment === 'seatingarr') {{
        renderSeatingArrangementSegment();
      }} else if (activeSeatingSegment === 'unseated') {{
        renderUnseatedSegment();
      }}
    }}

    /* Segment 1: Entire Guest List */
    function renderGuestListSegment() {{
      const state = loadState();
      let guests = state.guests || [];
      const tables = state.tables || [];

      if (currentGuestSearch) {{
        const q = currentGuestSearch.toLowerCase();
        guests = guests.filter(g => (g.name || '').toLowerCase().includes(q) || (g.dietary || '').toLowerCase().includes(q));
      }}

      document.getElementById('gl-count-label').textContent = `Showing ${{guests.length}} Guests`;
      const container = document.getElementById('gl-roster-list');
      if (!container) return;

      container.innerHTML = guests.map(g => {{
        const table = tables.find(t => t.id === g.tableId);
        const initials = (g.name || 'G').split(' ').map(x => x[0]).join('').substring(0,2).toUpperCase();
        return `
          <div style="background:#ffffff;border:1px solid var(--line);border-radius:8px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:30px;height:30px;border-radius:50%;background:#1c1511;color:#dfc194;font-size:10px;font-weight:700;display:grid;place-items:center;">
                ${{initials}}
              </div>
              <div>
                <strong style="font-size:12.5px;color:var(--ink);">${{escapeHtml(g.name)}}</strong>
                <div style="font-size:11px;color:var(--muted);">${{g.plusOne ? '+1 guest' : 'Individual'}} ${{g.dietary && g.dietary !== 'None' ? '· ' + g.dietary : ''}}</div>
              </div>
            </div>
            <span class="pill ${{table ? 'pill-dark' : 'pill-gold'}}" style="font-size:10px;">
              ${{table ? escapeHtml(table.name) : 'Unassigned'}}
            </span>
          </div>
        `;
      }}).join('');
    }}

    function handleSearchGuestList(q) {{
      currentGuestSearch = q;
      renderGuestListSegment();
    }}

    /* Segment 2: Seating Arrangement of Each Table (Image 3 - Circular diagrams scrollable) */
    function renderSeatingArrangementSegment() {{
      const state = loadState();
      const tables = state.tables || [];
      const guests = state.guests || [];
      const container = document.getElementById('seating-tables-scroll-list');
      if (!container) return;

      container.innerHTML = tables.map(tbl => {{
        const seated = guests.filter(g => g.tableId === tbl.id);
        const total = tbl.capacity || 8;
        const radius = 65; // Radius to center seat dots exactly on gold ring
        const centerX = 65;
        const centerY = 65;
        let seatDotsHtml = '';

        for (let i = 0; i < total; i++) {{
          const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
          const x = Math.round(centerX + radius * Math.cos(angle) - 14);
          const y = Math.round(centerY + radius * Math.sin(angle) - 14);
          const guest = seated[i];
          const initials = guest ? ((guest.name || 'G').split(' ').map(p => p[0]).join('').substring(0,2).toUpperCase()) : '+';

          seatDotsHtml += `
            <div class="seat-dot ${{guest ? '' : 'empty'}}" style="left:${{x}}px;top:${{y}}px;" title="${{guest ? escapeHtml(guest.name) : 'Empty Seat'}}" onclick="showToast('${{guest ? escapeHtml(guest.name) + ' (' + (guest.dietary || 'Standard Meal') + ')' : 'Seat available'}}')">
              ${{initials}}
            </div>
          `;
        }}

        return `
          <div class="card" style="padding:14px;display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding-bottom:8px;">
              <div>
                <strong style="font-size:14px;color:var(--ink);">${{escapeHtml(tbl.name)}}</strong>
                <div style="font-size:11px;color:var(--muted);">${{tbl.id === 'head' ? 'VIP Head Table &bull; Bridal Party' : 'Banquet Round Table'}}</div>
              </div>
              <span class="pill ${{seated.length >= total ? 'pill-green' : 'pill-gold'}}">
                ${{seated.length}} / ${{total}} Seated
              </span>
            </div>

            <!-- Circular Floorplan Canvas (Image 3) -->
            <div class="floorplan-dotted-canvas">
              <div class="round-table-diagram">
                <span class="round-table-name">${{escapeHtml(tbl.name)}}</span>
                <span class="round-table-count">${{seated.length}} / ${{total}}</span>
                ${{seatDotsHtml}}
              </div>
            </div>

            <!-- Seated Guests List Accordion / Roster -->
            <div style="display:flex;flex-direction:column;gap:5px;margin-top:4px;">
              <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;">Seated Guests at ${{escapeHtml(tbl.name)}}:</div>
              ${{seated.length === 0 ? '<div style="color:var(--muted);font-style:italic;font-size:11.5px;">No guests seated at this table yet.</div>' : seated.map((g, idx) => `
                <div style="display:flex;justify-content:space-between;align-items:center;background:#faf8f5;border:1px solid #ede4d7;padding:5px 8px;border-radius:6px;font-size:12px;">
                  <span><strong>${{idx + 1}}.</strong> ${{escapeHtml(g.name)}}</span>
                  <div style="display:flex;align-items:center;gap:4px;">
                    ${{g.dietary && g.dietary !== 'None' ? `<span class="pill pill-gold" style="font-size:9px;padding:1px 5px;">${{escapeHtml(g.dietary)}}</span>` : ''}}
                    <button type="button" class="btn btn-outline btn-sm" style="padding:2px 6px;font-size:10px;" onclick="unseatGuest('${{g.id}}')">Unseat</button>
                  </div>
                </div>
              `).join('')}}
            </div>
          </div>
        `;
      }}).join('');
    }}

    /* Segment 3: Unseated Guests (With matched 32px height select and Seat button) */
    function renderUnseatedSegment() {{
      const state = loadState();
      const tables = state.tables || [];
      const guests = state.guests || [];
      const unassigned = guests.filter(g => !g.tableId);
      const container = document.getElementById('unseated-cards-list');
      if (!container) return;

      if (unassigned.length === 0) {{
        container.innerHTML = '<div style="color:var(--success);font-size:13px;text-align:center;padding:24px;font-weight:600;">✓ All guests have been successfully seated at tables!</div>';
        return;
      }}

      container.innerHTML = unassigned.map(g => `
        <div style="background:#ffffff;border:1px solid #ebd8c0;border-radius:8px;padding:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="font-size:13px;color:var(--ink);display:block;">${{escapeHtml(g.name)}}</strong>
              <span style="font-size:11px;color:var(--muted);">${{g.plusOne ? '+1 guest' : 'No plus-one'}} ${{g.dietary && g.dietary !== 'None' ? '· ' + g.dietary : ''}}</span>
            </div>
            ${{g.dietary && g.dietary !== 'None' ? `<span class="pill pill-gold" style="font-size:9.5px;">${{escapeHtml(g.dietary)}}</span>` : ''}}
          </div>
          <!-- Matched 32px height container and Seat button (Part 1 feedback) -->
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

    function assignGuestToTable(guestId, tableId) {{
      const state = loadState();
      const guest = (state.guests || []).find(g => g.id === guestId);
      if (guest) {{
        guest.tableId = tableId;
        saveState(state);
        showToast(`Seated ${{guest.name}}`);
        renderSeatingSegmentContent();
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

    function autoSeatAllRemaining() {{
      const state = loadState();
      const tables = state.tables || [];
      const guests = state.guests || [];
      const unassigned = guests.filter(g => !g.tableId);
      let count = 0;

      for (const g of unassigned) {{
        const targetTable = tables.find(t => guests.filter(x => x.tableId === t.id).length < t.capacity);
        if (targetTable) {{
          g.tableId = targetTable.id;
          count++;
        }}
      }}

      if (count > 0) {{
        saveState(state);
        showToast(`Auto-seated ${{count}} remaining guests!`);
        renderSeatingSegmentContent();
      }} else {{
        showToast('No remaining seats available', false);
      }}
    }}

    function unseatGuest(guestId) {{
      const state = loadState();
      const guest = (state.guests || []).find(g => g.id === guestId);
      if (guest) {{
        guest.tableId = null;
        saveState(state);
        showToast(`Unseated ${{guest.name}}`);
        renderSeatingSegmentContent();
      }}
    }}

    /* --- JOEY MC CHATBOT LOGIC (Requirement 5) --- */
    function toggleChatPanel() {{
      const panel = document.getElementById('mc-chat-panel');
      const isVisible = panel.style.display === 'flex';
      panel.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {{
        setTimeout(() => {{
          const input = document.getElementById('chat-input');
          if (input) input.focus();
        }}, 100);
      }}
    }}

    function handleChatSubmit(e) {{
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendChatMessage(text);
    }}

    function sendQuickChat(text) {{
      sendChatMessage(text);
    }}

    function sendChatMessage(text) {{
      const body = document.getElementById('mc-chat-messages');

      // Append User Message
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble chat-bubble-user';
      userBubble.textContent = text;
      body.appendChild(userBubble);
      body.scrollTop = body.scrollHeight;

      // Generate Intelligent MC Assistant Reply
      setTimeout(() => {{
        const botReply = generateMCJoeyResponse(text);
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble chat-bubble-bot';
        botBubble.innerHTML = botReply;
        body.appendChild(botBubble);
        body.scrollTop = body.scrollHeight;
      }}, 300);
    }}

    function generateMCJoeyResponse(prompt) {{
      const state = loadState();
      const q = prompt.toLowerCase();
      const wedding = (state.weddings || []).find(w => w.id === currentWeddingId) || state.weddings[0];
      const cues = wedding.privateRunSheet || wedding.runSheet || [];
      const guests = state.guests || [];

      if (q.includes('next') || q.includes('cue') || q.includes('schedule') || q.includes('time')) {{
        const pending = cues.filter(c => !c.done);
        if (pending.length > 0) {{
          const next = pending[0];
          return `⏰ <strong>Next Cue:</strong> at <strong>${{escapeHtml(next.time)}}</strong> &bull; ${{escapeHtml(next.activity)}}.<br><br><em>MC Cue Notes:</em> ${{escapeHtml(next.privateNotes || 'Check wireless mic batteries.')}}`;
        }}
        return 'All scheduled cues for today have been marked as completed!';
      }}

      if (q.includes('head table') || q.includes('bridal party')) {{
        const headGuests = guests.filter(g => g.tableId === 'head');
        return `👑 <strong>Head Table (${{headGuests.length}} guests seated):</strong><br>` + headGuests.map(g => `&bull; ${{escapeHtml(g.name)}} ${{g.dietary && g.dietary !== 'None' ? '(' + g.dietary + ')' : ''}}`).join('<br>');
      }}

      if (q.includes('dietary') || q.includes('allergy') || q.includes('allergies') || q.includes('vegan') || q.includes('gluten')) {{
        const special = guests.filter(g => g.dietary && g.dietary !== 'None');
        const count = special.length;
        return `🍽️ <strong>Dietary Alerts (${{count}} special meals):</strong><br>` + special.slice(0, 8).map(g => `&bull; ${{escapeHtml(g.name)}}: <strong>${{escapeHtml(g.dietary)}}</strong>`).join('<br>') + (count > 8 ? `<br><em>+ ${{count - 8}} more in the Guest List tab</em>` : '');
      }}

      if (q.includes('venue') || q.includes('sarah') || q.includes('phone') || q.includes('contact') || q.includes('manager')) {{
        return `📍 <strong>Fernwood Estate Contacts:</strong><br>&bull; Sarah Lin (Venue Manager): <strong>0412 345 678</strong><br>&bull; Chef Marco Rossi (Catering): <strong>0434 567 890</strong><br>&bull; Dave Miller (Sound Tech): <strong>0445 678 901</strong>`;
      }}

      if (q.includes('unseated') || q.includes('remaining') || q.includes('pending seat')) {{
        const unseated = guests.filter(g => !g.tableId);
        return `🪑 There are currently <strong>${{unseated.length}} unseated guests</strong>. You can seat them from the <strong>Seating &rarr; Unseated Guests</strong> tab using the 'Seat All' button!`;
      }}

      return `Understood! I've logged your query regarding "<strong>${{escapeHtml(prompt)}}</strong>". All cues and seating data for ${{escapeHtml(wedding.couple)}} are synced live with the Couple and MC Pro consoles.`;
    }}
  </script>
</body>
</html>
"""
    with open('mc-mobile.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("mc-mobile.html generated successfully with Master Home, Circular Seating, and Joey Chatbot!")

if __name__ == '__main__':
    build_mc_mobile_html()
