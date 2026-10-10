# Builder for guest-mobile.html
import os
from shared_css import get_shared_css
from shared_js import get_shared_js
from chatbot_component import get_chatbot_html, get_chatbot_css, get_chatbot_js

def build_guest_mobile():
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
  <title>Sophie &amp; James | Tap &amp; Toast Guest Experience</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
{shared_css}
{chatbot_css}

/* Guest Mobile Specific Styles (Matches attached images 1, 2, 3) */
html {{
  height: 100% !important;
  overflow: hidden !important;
}}

body {{
  background: radial-gradient(circle at 50% 25%, #f6f3ed 0%, #e5e0d6 100%);
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
  max-height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important; /* Browser window strictly never scrolls */
}}
/* Phone Frame - Standard Normal Smartphone Size (402px x 874px design size) */
.phone-mockup-frame {{
  width: 402px !important;
  max-width: 402px !important;
  height: 874px !important;
  max-height: calc(100vh - 54px) !important;
  margin: auto auto !important;
  background: var(--cream);
  border-radius: 46px;
  border: 4px solid #1c1511;
  box-shadow: 0 20px 60px rgba(21, 17, 14, 0.22), 0 4px 14px rgba(21, 17, 14, 0.08);
  overflow: hidden !important;
  position: relative;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box;
}}

/* Splash Mode: Full Screen Dark Invitation Experience (Image 2 feedback) */
.phone-mockup-frame.splash-mode {{
  background: #15110e;
  border-color: #2b221a;
}}
.phone-mockup-frame.splash-mode .phone-status-bar {{
  background: #15110e;
  color: #f8f3eb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}}
.phone-mockup-frame.splash-mode .phone-status-signal {{
  color: #bd9661;
}}
.phone-mockup-frame.splash-mode .phone-status-battery {{
  border-color: #bd9661;
}}
.phone-mockup-frame.splash-mode .phone-status-battery::after {{
  background: #bd9661;
}}
.phone-mockup-frame.splash-mode .phone-battery-level {{
  background: #bd9661;
}}
.phone-mockup-frame.splash-mode .phone-home-indicator {{
  background: #2b221a;
  opacity: 0.6;
}}
.phone-mockup-frame.splash-mode .phone-bottom-nav {{
  display: none !important;
}}
.phone-mockup-frame.splash-mode .tt-chat-btn {{
  display: none !important;
}}

/* Strictly contain Joey Chatbot inside Phone Mockup Frame */
.phone-mockup-frame .tt-chat-btn {{
  position: absolute !important;
  bottom: 74px !important;
  right: 14px !important;
  width: 48px !important;
  height: 48px !important;
  z-index: 120 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35) !important;
}}

.phone-mockup-frame .tt-chat-panel {{
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  top: 44px !important;
  width: 100% !important;
  height: calc(100% - 44px) !important;
  max-height: none !important;
  border-radius: 0 0 36px 36px !important;
  z-index: 150 !important;
  box-shadow: none !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
}}

#pane-splash {{
  display: none;
  background: #15110e;
  height: 100%;
}}
#pane-splash.active {{
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  background: #15110e;
}}
@media (max-width: 480px) {{
  #pane-splash.active {{
    min-height: 100%;
  }}
}}

.phone-status-bar {{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 8px;
  font-size: 13.5px;
  font-weight: 700;
  color: #15110e;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  user-select: none;
  background: var(--cream);
  border-bottom: 1px solid rgba(0,0,0,0.04);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}}

.phone-status-icons {{
  display: flex;
  align-items: center;
  gap: 7px;
}}

.phone-status-signal {{
  font-size: 10px;
  letter-spacing: 1px;
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
  width: 85%;
  height: 100%;
  background: #2e7d32;
  border-radius: 1px;
}}

/* In-App Screen Navigation (Inside Phone Screen) */
.phone-in-app-nav {{
  background: #f1ede4;
  border-bottom: 1px solid var(--line);
  padding: 8px 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}}

.phone-in-app-scroll {{
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}}

.phone-in-app-scroll::-webkit-scrollbar {{
  display: none;
}}

.phone-tab-btn {{
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  background: #ffffff;
  color: var(--ink);
  border: 1px solid var(--line-strong);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  flex-shrink: 0;
}}

.phone-tab-btn:hover {{
  background: #faf6f0;
  border-color: var(--gold);
}}

.phone-tab-btn.active {{
  background: #15110e;
  color: #dfc194;
  border-color: #15110e;
}}

/* In-App Bottom Navigation Dock */
.phone-bottom-nav {{
  background: #ffffff;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 6px 4px 8px;
  position: relative;
  bottom: auto;
  z-index: 100;
  flex-shrink: 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.03);
}}

.phone-dock-item {{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 5px 3px 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: #7a6a5c;
  font-size: 10px;
  font-weight: 600;
  transition: all 0.15s ease;
  border-radius: 6px;
  flex: 1;
}}

.phone-dock-item .dock-icon {{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  line-height: 1;
}}

.phone-dock-item .dock-icon svg {{
  width: 18px;
  height: 18px;
  stroke: #7a6a5c;
  stroke-width: 2;
  transition: all 0.18s ease;
}}

.phone-dock-item:hover .dock-icon svg,
.phone-dock-item.active .dock-icon svg {{
  stroke: var(--gold-hover);
  transform: translateY(-1px);
}}

.phone-dock-item:hover .dock-label,
.phone-dock-item.active .dock-label {{
  color: var(--gold-hover);
  font-weight: 700;
}}

.phone-screen-scroll {{
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(189, 150, 97, 0.35) transparent;
}}
.phone-screen-scroll::-webkit-scrollbar {{
  width: 4px;
}}
.phone-screen-scroll::-webkit-scrollbar-thumb {{
  background: rgba(189, 150, 97, 0.35);
  border-radius: 4px;
}}

.phone-home-indicator {{
  width: 135px;
  height: 4.5px;
  background: #15110e;
  border-radius: 3px;
  margin: 6px auto 6px;
  opacity: 0.22;
  flex-shrink: 0;
}}

@media (max-width: 480px) {{
  body {{
    height: 100%;
    min-height: 100vh;
    overflow: auto;
  }}
  .phone-mockup-frame {{
    border: none;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
  }}
}}

/* RSVP Transitioned Status Card */
.rsvp-status-container {{
  padding: 24px 20px;
  animation: rsvpCardFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}}

@keyframes rsvpCardFadeIn {{
  from {{ opacity: 0; transform: translateY(12px) scale(0.98); }}
  to {{ opacity: 1; transform: translateY(0) scale(1); }}
}}

.rsvp-status-card {{
  background: var(--white);
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  border-radius: 12px;
  padding: 26px 18px;
  text-align: center;
  box-shadow: 0 4px 18px rgba(21, 17, 14, 0.06);
}}

.rsvp-status-icon-wrap {{
  margin: 0 auto 12px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fbf5ec;
  border: 1.5px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
}}

.rsvp-status-icon {{
  font-size: 24px;
  color: var(--gold);
}}

.rsvp-status-pill {{
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 12px;
  background: #e8eee4;
  color: #3c6a42;
  margin-bottom: 8px;
}}

.rsvp-status-pill.declined {{
  background: #fbeae8;
  color: #a8382c;
}}

.rsvp-status-title {{
  font-family: var(--font-heading);
  font-size: 26px;
  color: var(--ink);
  margin-bottom: 6px;
}}

.rsvp-status-sub {{
  font-size: 13.5px;
  color: var(--muted);
  margin-bottom: 22px;
  line-height: 1.45;
}}

.rsvp-summary-box {{
  background: #fbf9f5;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}}

.rsvp-summary-row {{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  border-bottom: 1px dashed #ede2d5;
  padding-bottom: 8px;
}}

.rsvp-summary-row:last-child {{
  border-bottom: none;
  padding-bottom: 0;
}}

.rsvp-summary-label {{
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
}}

.rsvp-summary-val {{
  font-weight: 600;
  color: var(--ink);
  text-align: right;
}}

.rsvp-status-actions {{
  display: flex;
  flex-direction: column;
  gap: 10px;
}}

.mobile-viewport-wrapper {{
  width: 100%;
  background: var(--cream);
  display: flex;
  flex-direction: column;
  position: relative;
}}

/* App Navigation Header */
.app-header {{
  background: #15110e;
  color: #fff;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gold);
}}

.app-brand {{
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 16px;
  color: #ffffff;
}}

.app-tabs-nav {{
  display: flex;
  background: #241c16;
  border-bottom: 1px solid #382c22;
  overflow-x: auto;
  scrollbar-width: none;
}}
.app-tabs-nav::-webkit-scrollbar {{ display: none; }}

.app-tab-btn {{
  padding: 10px 14px;
  color: #bfaea0;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}}
.app-tab-btn:hover {{
  color: #fff;
}}
.app-tab-btn.active {{
  color: var(--gold-light);
  border-bottom-color: var(--gold);
  background: rgba(189, 150, 97, 0.08);
}}

/* Main Mobile Body */
.mobile-content {{
  flex: 1;
  padding-bottom: 40px;
}}

.tab-pane {{
  display: none;
}}
.tab-pane.active {{
  display: block;
}}

/* Screen 1: RSVP Screen */
.arch-hero {{
  background: #15110e;
  color: #ffffff;
  padding: 34px 20px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 0 8px 24px rgba(21, 17, 14, 0.25);
}}

.arch-svg {{
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 200px;
  pointer-events: none;
  opacity: 0.35;
}}

.arch-eyebrow {{
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--gold);
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 6px;
}}

.arch-title {{
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.15;
}}

.arch-meta {{
  font-size: 13.5px;
  color: #dfc194;
  margin-bottom: 4px;
}}

.arch-venue {{
  font-size: 12.5px;
  color: #bfaea0;
}}

.arch-divider {{
  width: 44px;
  height: 1px;
  background: var(--gold);
  margin: 14px auto 0;
}}

.rsvp-form-container {{
  padding: 24px 20px;
}}

.rsvp-greeting {{
  text-align: center;
  font-size: 14.5px;
  color: #4a3c31;
  margin-bottom: 20px;
  line-height: 1.5;
}}

.rsvp-toggle-group {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 22px;
}}

.rsvp-toggle-btn {{
  padding: 12px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--line-strong);
  background: var(--white);
  color: var(--ink);
  transition: all 0.2s ease;
}}

.rsvp-toggle-btn.active {{
  background: var(--ink);
  color: #ffffff;
  border-color: var(--ink);
  box-shadow: 0 4px 12px rgba(21, 17, 14, 0.2);
}}

.field-group {{
  margin-bottom: 18px;
}}

.field-label {{
  display: block;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 700;
  color: #8b7b6b;
  margin-bottom: 7px;
}}

.stepper {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  padding: 6px 14px;
}}

.stepper-btn {{
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--ink);
  font-size: 18px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
}}

.stepper-value {{
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}}

.text-input {{
  width: 100%;
  padding: 12px 14px;
  background: var(--white);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  font-size: 13.5px;
  outline: none;
}}

.text-input:focus {{
  border-color: var(--gold);
}}

.rsvp-footer-note {{
  text-align: center;
  font-size: 11.5px;
  color: #9c8c7c;
  margin-top: 18px;
}}

/* Screen 2: Guest Hub */
.hub-banner {{
  margin: 16px 18px 0;
  background: #191410;
  color: #f0e6d8;
  border: 1px solid #382c20;
  padding: 10px 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}}

.hub-banner-dot {{
  width: 8px;
  height: 8px;
  background: var(--gold);
  border-radius: 50%;
  flex-shrink: 0;
}}

.hub-card-thumb {{
  margin: 18px auto 14px;
  width: 160px;
  background: #17120f;
  border: 1px solid var(--gold);
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  color: #dfc194;
  box-shadow: 0 8px 20px rgba(21, 17, 14, 0.2);
}}

.hub-card-thumb-brand {{
  font-family: var(--font-heading);
  font-size: 11px;
  margin-bottom: 4px;
  color: #fff;
}}

.hub-welcome {{
  text-align: center;
  padding: 6px 18px 18px;
}}

.hub-welcome-eyebrow {{
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 700;
}}

.hub-welcome-name {{
  font-family: var(--font-heading);
  font-size: 27px;
  color: var(--ink);
  margin: 2px 0 4px;
}}

.hub-welcome-couple {{
  font-size: 13.5px;
  font-weight: 600;
  color: #4b3e34;
}}

.hub-welcome-date {{
  font-size: 12px;
  color: #8c7b6c;
  margin-top: 2px;
}}

.hub-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 18px;
  margin-bottom: 24px;
}}

.hub-tile {{
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 16px 14px;
  text-align: left;
  transition: all 0.18s ease;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 98px;
}}

.hub-tile:hover {{
  transform: translateY(-2px);
  border-color: var(--gold);
  box-shadow: var(--shadow-md);
}}

.hub-tile-icon {{
  font-size: 22px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  color: var(--gold-hover);
}}
.hub-tile-icon svg {{
  width: 22px;
  height: 22px;
  stroke: var(--gold-hover);
}}
.hub-tile[style*="#1c1612"] .hub-tile-icon svg {{
  stroke: #dfc194;
}}

.hub-tile-title {{
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
}}

.hub-tile-subtitle {{
  font-size: 11px;
  color: #8c7b6c;
  margin-top: 3px;
}}

.hub-feed-preview {{
  padding: 0 18px;
}}

.hub-feed-header {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}}

.hub-feed-title {{
  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 600;
}}

.hub-feed-link {{
  font-size: 12.5px;
  color: var(--gold-hover);
  font-weight: 600;
  background: none;
}}

.hub-preview-card {{
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
}}

.hub-preview-icon {{
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #faf6f0;
  border: 1px solid #ede3d5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}}
.hub-preview-icon svg {{
  width: 18px;
  height: 18px;
}}

.hub-preview-text b {{
  display: block;
  font-size: 13px;
  color: var(--ink);
}}

.hub-preview-text small {{
  font-size: 11px;
  color: #8c7b6c;
}}

/* Screen 3: Celebration Feed */
.feed-header {{
  background: #17120f;
  color: #ffffff;
  padding: 26px 20px 20px;
  text-align: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}}

.feed-header-eyebrow {{
  font-size: 10.5px;
  letter-spacing: 2px;
  color: var(--gold);
  text-transform: uppercase;
  font-weight: 700;
}}

.feed-header-title {{
  font-family: var(--font-heading);
  font-size: 26px;
  margin: 3px 0 10px;
}}

.feed-days-badge {{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #271f18;
  color: #dfc194;
  border: 1px solid #3d3024;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}}

.milestone-banner {{
  background: #191410;
  color: #ffffff;
  margin: 16px 18px 12px;
  border-radius: 8px;
  padding: 14px 16px;
  border-left: 4px solid var(--gold);
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}}

.milestone-title {{
  font-size: 14px;
  font-weight: 700;
  color: #f7e6cf;
}}

.milestone-sub {{
  font-size: 11.5px;
  color: #bfaea0;
  margin-top: 2px;
}}

.post-note-card {{
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  margin: 12px 18px;
  padding: 14px;
  box-shadow: var(--shadow-sm);
}}

.feed-items-list {{
  padding: 0 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}}

.feed-card {{
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 15px;
  box-shadow: var(--shadow-sm);
}}

.feed-card-header {{
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}}

.feed-glyph {{
  width: 34px;
  height: 34px;
  background: #faf4e9;
  border: 1px solid #ebd9c2;
  border-radius: 6px;
  display: grid;
  place-items: center;
  font-size: 17px;
  flex-shrink: 0;
}}

.feed-card-title {{
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
}}

.feed-card-subtitle {{
  font-size: 11.5px;
  color: #8c7b6c;
  margin-top: 2px;
}}

.feed-card-quote {{
  background: #fbf9f5;
  border-left: 3px solid var(--gold);
  padding: 10px 12px;
  border-radius: 0 6px 6px 0;
  font-style: italic;
  font-size: 13px;
  color: #4a3c30;
  margin: 8px 0;
}}

.feed-actions-row {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f2ece3;
}}

.feed-action-btn {{
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #7b6b5c;
  font-weight: 600;
}}
.feed-action-btn:hover {{ color: var(--gold-hover); }}

.feed-time {{
  font-size: 11px;
  color: #a49484;
}}

.feed-comments-container {{
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--line);
  display: flex;
  flex-direction: column;
  gap: 6px;
}}

.feed-comment-bubble {{
  background: #f6f2ea;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #403429;
}}

.bottom-banner {{
  margin: 18px;
  background: #17120f;
  color: #dfc194;
  padding: 12px 16px;
  border-radius: 6px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}}

/* Schedule Timeline */
.timeline-item {{
  display: flex;
  gap: 14px;
  padding: 14px 18px;
  border-left: 2px solid var(--gold);
  margin-left: 32px;
  position: relative;
}}
.timeline-item::before {{
  content: '';
  position: absolute;
  left: -7px;
  top: 18px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid #ffffff;
}}
.timeline-time {{
  font-weight: 700;
  font-size: 13px;
  color: var(--gold-hover);
  min-width: 65px;
}}
.timeline-desc {{
  font-size: 13px;
  color: var(--ink);
}}

/* Photo Wall */
.photo-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 14px 18px;
}}

.photo-thumb-card {{
  aspect-ratio: 1;
  background: #e2d8cb;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  display: grid;
  place-items: center;
}}

.photo-thumb-img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
}}

.photo-thumb-caption {{
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  background: rgba(21, 17, 14, 0.7);
  color: #fff;
  font-size: 11px;
  padding: 4px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}}

/* Gift & Go Presets */
.preset-grid {{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}}

.preset-btn {{
  padding: 14px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  background: var(--white);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  transition: all 0.15s ease;
}}
.preset-btn.active {{
  border-color: var(--gold);
  background: #fbf7f0;
  color: var(--gold-hover);
  box-shadow: 0 2px 8px rgba(189, 150, 97, 0.2);
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
      <a href="guest-mobile.html" class="tt-demobar-link active">Guest Mobile</a>
      <a href="guest-web.html" class="tt-demobar-link">Guest Web</a>
      <a href="couple.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'couple', 'couple.html')">Couple Dashboard</a>
      <a href="mc.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
      <a href="superadmin.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'superadmin', 'superadmin.html')">Super Admin</a>
    </div>
    <div class="tt-demobar-actions">
      <button type="button" class="tt-demobar-reset" onclick="resetDemoData()">↺ Reset Demo Data</button>
    </div>
  </nav>

  <!-- Mobile Device Phone Chassis -->
  <div class="phone-mockup-frame splash-mode">
    <!-- Status Bar (9:41, cellular, wifi, battery) -->
    <div class="phone-status-bar" id="phone-status-bar">
      <span class="phone-status-time">9:41</span>
      <div class="phone-status-icons">
        <span class="phone-status-signal">●●●●</span>
        <svg class="phone-status-wifi" width="14" height="11" viewBox="0 0 16 12" fill="none">
          <path d="M8 10C8.82843 10 9.5 9.32843 9.5 8.5C9.5 7.67157 8.82843 7 8 7C7.17157 7 6.5 7.67157 6.5 8.5C6.5 9.32843 7.17157 10 8 10Z" fill="#e89e34"/>
          <path d="M12.5 5C10 2.5 6 2.5 3.5 5" stroke="#e89e34" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M15 2C11 -1 5 -1 1 2" stroke="#e89e34" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <div class="phone-status-battery">
          <div class="phone-battery-level"></div>
        </div>
      </div>
    </div>


    <!-- Phone Screen Scrollable Content -->
    <div class="phone-screen-scroll">

      <!-- Main Content Area -->
      <main class="mobile-content">

        <!-- PANE 0: QR INVITATION SPLASH (Default entry screen) -->
        <section id="pane-splash" class="tab-pane active" aria-label="Invitation splash screen">
          <div style="flex:1;min-height:100%;background:#15110e;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center;box-sizing:border-box;">
            <!-- Logo wordmark -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
              <div style="width:34px;height:34px;border:2px solid #bd9661;border-radius:6px;display:grid;place-items:center;">
                <span style="font-family:var(--font-heading);font-size:18px;color:#bd9661;font-weight:700;">T</span>
              </div>
              <span style="font-family:var(--font-heading);font-size:17px;color:#f8f3eb;font-weight:600;letter-spacing:0.3px;">Tap &amp; Toast</span>
            </div>
            <!-- Gold arch ornament -->
            <div style="margin-bottom:18px;">
              <svg width="80" height="50" viewBox="0 0 80 50" fill="none" aria-hidden="true">
                <path d="M10 48 Q10 8 40 8 Q70 8 70 48" stroke="#bd9661" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/>
                <path d="M20 48 Q20 16 40 16 Q60 16 60 48" stroke="#bd9661" stroke-width="1" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <!-- Eyebrow -->
            <div style="font-size:10.5px;letter-spacing:2.5px;text-transform:uppercase;color:#bd9661;font-weight:700;margin-bottom:8px;">You're Invited</div>
            <!-- Couple name -->
            <h1 style="font-family:var(--font-heading);font-size:30px;color:#f8f3eb;font-weight:700;margin:0 0 6px;line-height:1.2;">Sophie <span style="color:#bd9661;">&amp;</span> James</h1>
            <div style="font-size:13px;color:#c4b5a5;letter-spacing:0.5px;margin-bottom:24px;">Saturday, 14 Nov 2026 · Fernwood Estate</div>
            <!-- QR Code -->
            <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:18px;display:inline-block;box-shadow:0 8px 30px rgba(0,0,0,0.4);">
              <div id="splash-qr-code"></div>
            </div>
            <div style="font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:#9a8678;margin-bottom:6px;">Scan to open your invitation</div>
            <!-- Family label -->
            <div style="font-size:12px;color:#7a6858;margin-bottom:28px;">For the Whitfield family</div>
            <!-- Enter button -->
            <button type="button" onclick="enterGuestHub()" style="background:#bd9661;color:#15110e;border:none;border-radius:8px;padding:14px 32px;font-family:var(--font-body);font-size:15px;font-weight:700;letter-spacing:0.5px;cursor:pointer;width:100%;max-width:280px;transition:background 0.2s;">
              Tap to Enter &rarr;
            </button>
          </div>
        </section>

        <!-- PANE 1: HUB -->
        <section id="pane-hub" class="tab-pane" aria-labelledby="tab-hub">
          <div class="hub-welcome" style="margin-top:24px;">
            <h1 class="hub-welcome-name" id="hub-guest-name">Welcome, Priya</h1>
            <div class="hub-welcome-couple">Sophie <span class="gold-amp">&amp;</span> James's Wedding</div>
            <div class="hub-welcome-date" id="hub-wedding-date">Fernwood Estate · 14 Nov 2026</div>
          </div>

          <div class="hub-grid">
            <button type="button" class="hub-tile" style="background:#1c1612;color:#ffffff;border-color:#2e231a;" onclick="switchGuestTab('schedule')">
              <div>
                <div class="hub-tile-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div class="hub-tile-title" style="color:#dfc194;">Today's Schedule</div>
              </div>
              <div class="hub-tile-subtitle" style="color:#e8ded0;" id="hub-tile-ceremony">Ceremony at 2:00 PM</div>
            </button>

            <button type="button" class="hub-tile" onclick="switchGuestTab('table')">
              <div>
                <div class="hub-tile-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="3" r="2"></circle><circle cx="12" cy="21" r="2"></circle><circle cx="3" cy="12" r="2"></circle><circle cx="21" cy="12" r="2"></circle></svg>
                </div>
                <div class="hub-tile-title">My Table</div>
              </div>
              <div class="hub-tile-subtitle" id="hub-tile-table">Table 4, Seat 3</div>
            </button>

            <button type="button" class="hub-tile" onclick="switchGuestTab('photos')">
              <div>
                <div class="hub-tile-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </div>
                <div class="hub-tile-title">Photo Wall</div>
              </div>
              <div class="hub-tile-subtitle">Add &amp; browse photos</div>
            </button>

            <button type="button" class="hub-tile" onclick="switchGuestTab('gifts')">
              <div>
                <div class="hub-tile-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                </div>
                <div class="hub-tile-title">Gift &amp; Go</div>
              </div>
              <div class="hub-tile-subtitle">Send a gift</div>
            </button>
          </div>

        <div class="hub-feed-preview">
          <div class="hub-feed-header">
            <h2 class="hub-feed-title">Celebration Feed</h2>
            <button type="button" class="hub-feed-link" onclick="switchGuestTab('feed')">View all &rarr;</button>
          </div>
          <div id="hub-feed-preview-cards">
            <!-- Injected by JS -->
          </div>
        </div>

        <div style="text-align:center;font-size:11.5px;color:#9b8c7c;padding:18px 0 6px;">
          Scan your QaRd again anytime to jump back in
        </div>
      </section>

      <!-- PANE 2: RSVP -->
      <section id="pane-rsvp" class="tab-pane" aria-labelledby="tab-rsvp">
        <div class="arch-hero">
          <svg class="arch-svg" viewBox="0 0 280 200" fill="none">
            <path d="M 20 200 A 120 120 0 0 1 260 200" stroke="#bd9661" stroke-width="1.5" stroke-dasharray="3 3"/>
            <path d="M 40 200 A 100 100 0 0 1 240 200" stroke="#bd9661" stroke-width="1"/>
          </svg>
          <div class="arch-eyebrow">YOU'RE INVITED</div>
          <h1 class="arch-title">Sophie <span class="gold-amp">&amp;</span> James</h1>
          <div class="arch-meta" id="rsvp-meta-date">Saturday, 14 November 2026 · 2:00 PM</div>
          <div class="arch-venue" id="rsvp-meta-venue">Fernwood Estate, Southern Highlands</div>
          <div class="arch-divider"></div>
        </div>

        <div class="rsvp-form-container" id="rsvp-form-container">
          <p class="rsvp-greeting" id="rsvp-greeting-text">
            Hi <strong>Priya</strong> — we'd love for you to celebrate with us. Let us know if you can make it.
          </p>

          <form id="rsvp-form" onsubmit="handleGuestRSVPSubmit(event)">
            <div class="rsvp-toggle-group">
              <button type="button" id="btn-accept" class="rsvp-toggle-btn active" onclick="setRSVPOption('confirmed')">Joyfully Accepts</button>
              <button type="button" id="btn-decline" class="rsvp-toggle-btn" onclick="setRSVPOption('declined')">Regretfully Declines</button>
            </div>

            <div id="rsvp-attendance-fields">
              <div class="field-group">
                <label class="field-label" for="guest-stepper-val">GUESTS ATTENDING</label>
                <div class="stepper">
                  <button type="button" class="stepper-btn" onclick="adjustGuestStepper(-1)">−</button>
                  <span class="stepper-value" id="guest-stepper-val">2 guests</span>
                  <button type="button" class="stepper-btn" onclick="adjustGuestStepper(1)">+</button>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label" for="rsvp-dietary">DIETARY REQUIREMENTS</label>
                <input type="text" id="rsvp-dietary" class="text-input" placeholder="Vegetarian, nut allergy..." value="Vegetarian">
              </div>

              <div class="field-group">
                <label class="field-label" for="rsvp-song">SONG THAT'LL GET YOU ON THE DANCE FLOOR</label>
                <input type="text" id="rsvp-song" class="text-input" placeholder="Optional" value="September - Earth, Wind &amp; Fire">
              </div>
            </div>

            <div id="rsvp-declined-message" style="display:none;background:#fbf2eb;border-left:3px solid #d97768;padding:12px;border-radius:4px;font-size:13px;color:#6b3b34;margin-bottom:18px;">
              We'll miss you at the celebration! You can change this response anytime before the RSVP cutoff.
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="padding:14px;font-size:14px;letter-spacing:1px;font-weight:700;">
              CONFIRM RSVP
            </button>
          </form>

          <div class="rsvp-footer-note">
            No account needed — this link is just for you
          </div>
        </div>

        <!-- RSVP Transitioned Status Card (Image 4 feedback) -->
        <div class="rsvp-status-container" id="rsvp-status-container" style="display:none;">
          <div class="rsvp-status-card">
            <div class="rsvp-status-icon-wrap" id="rsvp-status-icon">✓</div>
            <div class="rsvp-status-pill" id="rsvp-status-pill">RSVP Confirmed</div>
            <h2 class="rsvp-status-title" id="rsvp-status-headline">Joyfully Accepted!</h2>
            <p class="rsvp-status-sub" id="rsvp-status-sub">We can't wait to celebrate with you, Priya.</p>

            <div class="rsvp-summary-box">
              <div class="rsvp-summary-row">
                <span class="rsvp-summary-label">Attending</span>
                <span class="rsvp-summary-val" id="rsvp-summary-guests">2 guests</span>
              </div>
              <div class="rsvp-summary-row">
                <span class="rsvp-summary-label">Dietary Requirements</span>
                <span class="rsvp-summary-val" id="rsvp-summary-dietary">Vegetarian</span>
              </div>
              <div class="rsvp-summary-row">
                <span class="rsvp-summary-label">Dance Floor Song</span>
                <span class="rsvp-summary-val" id="rsvp-summary-song">September - Earth, Wind &amp; Fire</span>
              </div>
              <div class="rsvp-summary-row">
                <span class="rsvp-summary-label">Table &amp; Seat</span>
                <span class="rsvp-summary-val" id="rsvp-summary-table">Table 4, Seat 3</span>
              </div>
            </div>

            <div class="rsvp-status-actions">
              <button type="button" class="btn btn-outline btn-block" onclick="enableRSVPEdit()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>Update / Change Response
              </button>
              <button type="button" class="btn btn-primary btn-block" onclick="switchGuestTab('feed')">
                View Celebration Feed &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- PANE 3: CELEBRATION FEED -->
      <section id="pane-feed" class="tab-pane" aria-labelledby="tab-feed">
        <div class="feed-header">
          <div class="feed-header-eyebrow">CELEBRATION FEED</div>
          <h1 class="feed-header-title">Sophie <span class="gold-amp">&amp;</span> James</h1>
          <div class="feed-days-badge" id="feed-days-badge">35 days : 00 hrs : 00 mins : 00 secs remaining</div>
        </div>

        <div class="milestone-banner" id="feed-milestone-banner">
          <div class="milestone-title" style="display:flex;align-items:center;gap:8px;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#bd9661" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>50 guests confirmed</span>
          </div>
          <div class="milestone-sub">You've hit the halfway mark on RSVPs</div>
        </div>

        <!-- Post a Love Note -->
        <div class="post-note-card">
          <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">
            Post a Love Note
          </div>
          <form onsubmit="handlePostNoteSubmit(event)" style="display:flex;flex-direction:column;gap:8px;">
            <textarea id="new-note-text" class="text-input" rows="2" placeholder="Send Sophie &amp; James a lovely message..."></textarea>
            <button type="submit" class="btn btn-gold btn-sm" style="align-self:flex-end;">Post Note</button>
          </form>
        </div>

        <!-- Feed List -->
        <div class="feed-items-list" id="feed-items-container">
          <!-- Injected by JS -->
        </div>

        <div class="bottom-banner" id="feed-bottom-banner">
          36 days to go — Invitations went out this week
        </div>
      </section>

      <!-- PANE 4: TODAY'S SCHEDULE -->
      <section id="pane-schedule" class="tab-pane" aria-labelledby="tab-schedule">
        <div style="padding: 22px 18px 10px;">
          <div class="hub-welcome-eyebrow">ORDER OF EVENTS</div>
          <h1 style="font-family:var(--font-heading);font-size:24px;margin:2px 0 14px;">Today's Schedule</h1>
          <p style="font-size:13px;color:#786858;margin-bottom:18px;">
            Saturday, 14 November 2026 · Fernwood Estate
          </p>
          <div class="timeline-container" id="schedule-timeline-container">
            <!-- Populated by JS -->
          </div>
          <button type="button" class="btn btn-outline btn-block" style="margin-top:20px;" onclick="downloadCalendarICS()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>Add to Calendar
          </button>
          <button type="button" class="btn btn-gold btn-block" style="margin-top:10px;" onclick="openGuestVenueModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>Venue Details
          </button>
        </div>
      </section>

      <!-- PANE 5: MY TABLE -->
      <section id="pane-table" class="tab-pane" aria-labelledby="tab-table">
        <div style="padding: 22px 18px;">
          <div class="hub-welcome-eyebrow">YOUR SEATING</div>
          <h1 style="font-family:var(--font-heading);font-size:24px;margin:2px 0 16px;">My Table</h1>
          
          <!-- Seating Diagram Card (matches image 5) -->
          <div style="background-image:radial-gradient(#d5ccbf 1.2px, transparent 1.2px);background-size:16px 16px;background-color:#faf8f5;border:1px solid var(--line);border-radius:12px;padding:26px 12px 18px;text-align:center;box-shadow:var(--shadow-sm);margin-bottom:20px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <!-- Circular Table Container -->
            <div id="circular-table-container" style="position:relative;width:220px;height:220px;margin:0 auto 12px;">
              <!-- Generated dynamically by renderTablemates() -->
            </div>
            <div style="font-size:14px;color:var(--gold-hover);font-weight:700;" id="table-seat-display">Seat 3 · Priya Sharma</div>
          </div>

          <h3 style="font-family:var(--font-heading);font-size:17px;margin-bottom:12px;">Your Tablemates</h3>
          <div id="tablemates-list" style="display:flex;flex-direction:column;gap:8px;">
            <!-- Populated by JS -->
          </div>
        </div>
      </section>

      <!-- PANE 6: PHOTO WALL -->
      <section id="pane-photos" class="tab-pane" aria-labelledby="tab-photos">
        <div style="padding: 22px 18px 10px;">
          <div class="hub-welcome-eyebrow">SHARED MEMORIES</div>
          <h1 style="font-family:var(--font-heading);font-size:24px;margin:2px 0 6px;">Photo Wall</h1>
          <p style="font-size:13px;color:#786858;margin-bottom:14px;">
            Capture the moments! Snap a photo today and share it with the room.
          </p>

          <label class="btn btn-gold btn-block" style="cursor:pointer;margin-bottom:16px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:middle;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>Upload a Photo
            <input type="file" accept="image/*" style="display:none;" onchange="handlePhotoUpload(event)">
          </label>

          <div class="photo-grid" id="guest-photo-grid">
            <!-- Photos injected by JS -->
          </div>
        </div>
      </section>

      <!-- PANE 7: GIFT & GO -->
      <section id="pane-gifts" class="tab-pane" aria-labelledby="tab-gifts">
        <div style="padding: 22px 18px;">
          <div class="hub-welcome-eyebrow">DIGITAL WISHING WELL</div>
          <h1 style="font-family:var(--font-heading);font-size:24px;margin:2px 0 6px;">Gift &amp; Go</h1>
          <p style="font-size:13px;color:#786858;margin-bottom:18px;">
            Your presence is our present. If you would like to contribute towards our honeymoon in Queenstown, you can gift securely below.
          </p>

          <div class="preset-grid">
            <button type="button" class="preset-btn" onclick="selectGiftAmount(50)">$50 AUD</button>
            <button type="button" class="preset-btn active" onclick="selectGiftAmount(100)">$100 AUD</button>
            <button type="button" class="preset-btn" onclick="selectGiftAmount(150)">$150 AUD</button>
            <button type="button" class="preset-btn" onclick="selectGiftAmount(250)">$250 AUD</button>
          </div>

          <div class="field-group">
            <label class="field-label" for="custom-gift-amount">CUSTOM AMOUNT (AUD)</label>
            <input type="number" id="custom-gift-amount" class="text-input" placeholder="e.g. 300" oninput="handleCustomAmount(this.value)">
          </div>

          <div class="field-group">
            <label class="field-label" for="gift-note">PERSONALISED WISH</label>
            <textarea id="gift-note" class="text-input" rows="2" placeholder="Wishing you both a lifetime of happiness..."></textarea>
          </div>

          <button type="button" class="btn btn-primary btn-block" style="padding:14px;" onclick="openGiftCheckoutModal()">
            Send <span id="gift-btn-amount">$100 AUD</span> via Card / Apple Pay
          </button>
        </div>
      </section>

    </main>
    </div><!-- End phone-screen-scroll -->

    <!-- In-App Bottom Navigation Dock (Inside Phone Screen) -->
    <nav class="phone-bottom-nav" aria-label="Bottom Navigation" style="display:none;">
      <button type="button" class="phone-dock-item active" id="dock-hub" onclick="switchGuestTab('hub')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </span>
        <span class="dock-label">Hub</span>
      </button>
      <button type="button" class="phone-dock-item" id="dock-rsvp" onclick="switchGuestTab('rsvp')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>
        </span>
        <span class="dock-label">RSVP</span>
      </button>
      <button type="button" class="phone-dock-item" id="dock-feed" onclick="switchGuestTab('feed')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </span>
        <span class="dock-label">Feed</span>
      </button>
      <button type="button" class="phone-dock-item" id="dock-schedule" onclick="switchGuestTab('schedule')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </span>
        <span class="dock-label">Events</span>
      </button>
      <button type="button" class="phone-dock-item" id="dock-table" onclick="switchGuestTab('table')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="3" r="2"></circle><circle cx="12" cy="21" r="2"></circle><circle cx="3" cy="12" r="2"></circle><circle cx="21" cy="12" r="2"></circle></svg>
        </span>
        <span class="dock-label">Table</span>
      </button>
      <button type="button" class="phone-dock-item" id="dock-photos" onclick="switchGuestTab('photos')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </span>
        <span class="dock-label">Photos</span>
      </button>
      <button type="button" class="phone-dock-item" id="dock-gifts" onclick="switchGuestTab('gifts')">
        <span class="dock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
        </span>
        <span class="dock-label">Gifts</span>
      </button>
    </nav>

    <!-- Phone Home Indicator Bar -->
    <div class="phone-home-indicator"></div>

    <!-- Joey Wedding Assistant Embedded Inside Phone Frame -->
    {chatbot_html}
  </div><!-- End phone-mockup-frame -->

  <!-- Toast Notification Container -->
  <div id="tt-toast-container" class="tt-toast-container"></div>

  <!-- Mock Checkout Modal -->
  <div id="gift-checkout-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal">
      <div class="tt-modal-header">
        <div class="tt-modal-title">Gift &amp; Go Checkout</div>
        <button type="button" class="tt-modal-close" onclick="closeGiftCheckoutModal()">✕</button>
      </div>
      <div class="tt-modal-body">
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Contributing to Sophie &amp; James</div>
          <div style="font-family:var(--font-heading);font-size:32px;color:var(--gold-hover);font-weight:700;" id="modal-checkout-amt">$100 AUD</div>
        </div>

        <div style="background:#f9f6f0;border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:16px;">
          <div style="font-size:12px;font-weight:700;color:var(--ink);">Mock Payment Simulation</div>
          <div style="font-size:11.5px;color:#786858;">Instant test transaction — updates wedding gifts pool and celebration feed immediately.</div>
        </div>

        <div class="field-group">
          <label class="field-label">Cardholder Name</label>
          <input type="text" id="checkout-name" class="text-input" value="Priya Sharma">
        </div>
        <div class="field-group">
          <label class="field-label">Card Number</label>
          <input type="text" class="text-input" value="•••• •••• •••• 4242" readonly>
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeGiftCheckoutModal()">Cancel</button>
        <button type="button" class="btn btn-gold" onclick="processMockGiftPayment()">Pay Securely</button>
      </div>
    </div>
  </div>

  <!-- Guest Venue & Logistics Modal (Image 1 feedback) -->
  <div id="guest-venue-modal" class="tt-modal-backdrop" style="display:none;" aria-hidden="true">
    <div class="tt-modal" style="max-width:560px;max-height:90vh;overflow-y:auto;">
      <div class="tt-modal-header">
        <div>
          <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;">LOCATION &amp; LOGISTICS</div>
          <div class="tt-modal-title" style="font-family:var(--font-heading);font-size:20px;">Venue &amp; Travel Details</div>
        </div>
        <button type="button" class="tt-modal-close" onclick="closeGuestVenueModal()">✕</button>
      </div>
      <div class="tt-modal-body" style="padding:18px 20px;">
        <!-- Venue Card -->
        <div style="background:#faf7f2;border:1px solid var(--line);border-top:3px solid var(--gold);border-radius:8px;padding:16px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:34px;height:34px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div>
              <h3 style="font-family:var(--font-heading);font-size:17px;color:var(--ink);margin:0;">Fernwood Estate</h3>
              <span style="font-size:12px;color:var(--muted);">Southern Highlands, NSW</span>
            </div>
          </div>
          <div style="font-size:13px;color:var(--ink);line-height:1.5;margin-bottom:10px;">
            <strong>124 Range Road, Mittagong NSW 2575, Australia</strong>
          </div>
          <div style="background:#ffffff;border:1px solid var(--line);border-radius:6px;padding:10px 12px;font-size:12px;color:#5a4a3c;line-height:1.5;">
            <div><strong>Ceremony:</strong> 2:00 PM · The Lower Meadow Lawns</div>
            <div><strong>Cocktail Hour &amp; Reception:</strong> 5:00 PM · The Grand Pavilion</div>
            <div><strong>Venue Concierge:</strong> (02) 4871 2000 · concierge@fernwoodestate.demo</div>
          </div>
        </div>

        <!-- Parking Facilities -->
        <div style="background:#ffffff;border:1px solid var(--line);border-radius:8px;padding:16px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:34px;height:34px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>
            </div>
            <div>
              <h3 style="font-family:var(--font-heading);font-size:16px;color:var(--ink);margin:0;">Guest Parking Facilities</h3>
              <span style="font-size:12px;color:var(--muted);">On-Site Valet &amp; Dedicated Bays</span>
            </div>
          </div>
          <p style="font-size:12.5px;color:var(--ink);line-height:1.5;margin-bottom:8px;">
            Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.
          </p>
          <ul style="padding-left:18px;margin:0;font-size:12px;color:#5a4a3c;line-height:1.5;">
            <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
            <li><strong>Valet attendants:</strong> Stationed at porte-cochère from 1:15 PM.</li>
            <li><strong>EV Charging:</strong> 4 Type-2 chargers available at North Parking.</li>
            <li><strong>Overnight Parking:</strong> Permitted until 11:00 AM Sunday morning.</li>
          </ul>
        </div>

        <!-- Transport & Guest Shuttles -->
        <div style="background:#ffffff;border:1px solid var(--line);border-radius:8px;padding:16px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:34px;height:34px;border-radius:6px;background:#fbf3e6;color:var(--gold-hover);display:grid;place-items:center;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"></rect><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>
            </div>
            <div>
              <h3 style="font-family:var(--font-heading);font-size:16px;color:var(--ink);margin:0;">Transport &amp; Guest Shuttles</h3>
              <span style="font-size:12px;color:var(--muted);">Private Charter Transfers</span>
            </div>
          </div>
          <p style="font-size:12.5px;color:var(--ink);line-height:1.5;margin-bottom:8px;">
            Scheduled transfers between key Southern Highlands hotels and Fernwood Estate:
          </p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:8px 10px;font-size:11.5px;">
              <div style="font-weight:700;color:var(--ink);">Departure Shuttle</div>
              <div style="color:var(--muted);">Pickups: Bowral Grand &amp; Mittagong Station from 1:00 PM</div>
            </div>
            <div style="background:#faf7f2;border:1px solid var(--line);border-radius:6px;padding:8px 10px;font-size:11.5px;">
              <div style="font-weight:700;color:var(--ink);">Evening Return</div>
              <div style="color:var(--muted);">Return shuttles leave at 10:00 PM &amp; 11:30 PM</div>
            </div>
          </div>
        </div>

        <!-- Google Maps Link Card -->
        <div style="background:#17120f;color:#f7f3ee;border:1px solid #382c20;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;margin-bottom:4px;">INTERACTIVE NAVIGATION</div>
          <h4 style="font-family:var(--font-heading);font-size:16px;color:#fff;margin:0 0 6px;">Open in Google Maps</h4>
          <p style="font-size:12px;color:#cfbfaf;margin-bottom:12px;">Get turn-by-turn GPS driving instructions straight to the entrance gates.</p>
          <a href="https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-block" style="text-decoration:none;font-size:13px;padding:10px 14px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            Open Live Map &amp; Directions ↗
          </a>
        </div>
      </div>
      <div class="tt-modal-footer">
        <button type="button" class="btn btn-primary btn-block" onclick="closeGuestVenueModal()">Close</button>
      </div>
    </div>
  </div>

  <script>
{shared_js}
{chatbot_js}

/* Guest Mobile Application Logic */
let activeGuest = null;
let currentGuestCount = 2;
let selectedGiftAUD = 100;
let currentRSVPStatus = 'confirmed';

document.addEventListener('DOMContentLoaded', () => {{
  initGuestExperience();
  setInterval(updateMobileCountdown, 1000);
  window.addEventListener('storage', () => initGuestExperience());
  window.addEventListener('tt_state_changed', () => initGuestExperience());
}});

function updateMobileCountdown() {{
  const state = loadState();
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  const cd = getWeddingCountdown(wedding.date);
  const badge = document.getElementById('feed-days-badge');
  if (badge) badge.textContent = cd.formatted;
  const bottomBanner = document.getElementById('feed-bottom-banner');
  if (bottomBanner) bottomBanner.textContent = `${{cd.formatted}} — Invitations sent`;
}}

function initGuestExperience() {{
  const state = loadState();
  const urlParams = new URLSearchParams(window.location.search);
  const guestId = urlParams.get('g') || 'priya';
  
  activeGuest = state.guests.find(g => g.id === guestId) || state.guests[0];
  const wedding = state.weddings.find(w => w.id === state.currentWeddingId) || state.weddings[0];
  
  // Set wedding dates and live countdown
  updateMobileCountdown();
  
  document.getElementById('hub-guest-name').textContent = 'Welcome, ' + activeGuest.name.split(' ')[0];
  document.getElementById('hub-wedding-date').textContent = `${{wedding.venue.split(',')[0]}} · ${{wedding.dateDisplay}}`;
  document.getElementById('rsvp-meta-date').textContent = `Saturday, ${{wedding.dateDisplay}} · ${{wedding.timeDisplay}}`;
  document.getElementById('rsvp-meta-venue').textContent = wedding.venue;
  
  // Ceremony time & table on Hub tiles
  document.getElementById('hub-tile-ceremony').textContent = `Ceremony at ${{wedding.timeDisplay}}`;
  
  const assignedTable = state.tables.find(t => t.id === activeGuest.tableId);
  const tableName = assignedTable ? assignedTable.name : 'Table 4';
  const seatNum = (activeGuest.seatIndex !== null && activeGuest.seatIndex !== undefined) ? activeGuest.seatIndex + 1 : 3;
  document.getElementById('hub-tile-table').textContent = `${{tableName}}, Seat ${{seatNum}}`;
  
  // Mini QR code on hub
  const miniQr = document.getElementById('hub-mini-qr');
  if (miniQr) miniQr.innerHTML = generateQrSvg(`guest-mobile.html?g=${{activeGuest.id}}`, 64);

  // Large Splash QR code
  const splashQr = document.getElementById('splash-qr-code');
  if (splashQr) splashQr.innerHTML = generateQrSvg(`guest-mobile.html?g=${{activeGuest.id}}`, 140);

  
  // RSVP Form setup
  currentGuestCount = activeGuest.guestCount || 2;
  currentRSVPStatus = activeGuest.rsvpStatus || 'confirmed';
  document.getElementById('guest-stepper-val').textContent = `${{currentGuestCount}} ${{currentGuestCount === 1 ? 'guest' : 'guests'}}`;
  document.getElementById('rsvp-dietary').value = activeGuest.dietary || '';
  document.getElementById('rsvp-song').value = activeGuest.song || '';
  document.getElementById('rsvp-greeting-text').innerHTML = `Hi <strong>${{escapeHtml(activeGuest.name.split(' ')[0])}}</strong> — we'd love for you to celebrate with us. Let us know if you can make it.`;
  
  setRSVPOption(currentRSVPStatus, false);
  
  // Render celebration feed
  renderFeed();
  renderSchedule();
  renderTablemates();
  renderPhotoWall();
}}

function enterGuestHub() {{
  const frame = document.querySelector('.phone-mockup-frame');
  if (frame) frame.classList.remove('splash-mode');
  const nav = document.querySelector('.phone-bottom-nav');
  if (nav) nav.style.display = 'flex';
  switchGuestTab('hub');
}}

function switchGuestTab(tabKey) {{
  const frame = document.querySelector('.phone-mockup-frame');
  const nav = document.querySelector('.phone-bottom-nav');
  if (tabKey === 'splash') {{
    if (frame) frame.classList.add('splash-mode');
    if (nav) nav.style.display = 'none';
  }} else {{
    if (frame) frame.classList.remove('splash-mode');
    if (nav) nav.style.display = 'flex';
  }}

  document.querySelectorAll('.phone-dock-item').forEach(btn => {{
    btn.classList.toggle('active', btn.id === 'dock-' + tabKey);
  }});
  
  document.querySelectorAll('.tab-pane').forEach(pane => {{
    pane.classList.remove('active');
  }});
  
  const activePane = document.getElementById('pane-' + tabKey);
  if (activePane) activePane.classList.add('active');
  
  const scrollArea = document.querySelector('.phone-screen-scroll');
  if (scrollArea) scrollArea.scrollTo({{ top: 0, behavior: 'smooth' }});
  window.scrollTo({{ top: 0, behavior: 'smooth' }});
}}

function setRSVPOption(status, triggerAudit = false) {{
  currentRSVPStatus = status;
  const isAccept = status === 'confirmed';
  document.getElementById('btn-accept').classList.toggle('active', isAccept);
  document.getElementById('btn-decline').classList.toggle('active', !isAccept);
  
  const fields = document.getElementById('rsvp-attendance-fields');
  const declineMsg = document.getElementById('rsvp-declined-message');
  
  if (isAccept) {{
    fields.style.display = 'block';
    declineMsg.style.display = 'none';
  }} else {{
    fields.style.display = 'none';
    declineMsg.style.display = 'block';
  }}
}}

function adjustGuestStepper(delta) {{
  currentGuestCount = Math.min(5, Math.max(1, currentGuestCount + delta));
  document.getElementById('guest-stepper-val').textContent = `${{currentGuestCount}} ${{currentGuestCount === 1 ? 'guest' : 'guests'}}`;
}}

function renderRSVPStatusView(guest) {{
  const isAccepted = guest.rsvpStatus === 'confirmed';
  const formWrap = document.getElementById('rsvp-form-container');
  const statusWrap = document.getElementById('rsvp-status-container');
  if (!formWrap || !statusWrap) return;
  
  formWrap.style.display = 'none';
  statusWrap.style.display = 'block';
  
  const icon = document.getElementById('rsvp-status-icon');
  const pill = document.getElementById('rsvp-status-pill');
  const headline = document.getElementById('rsvp-status-headline');
  const sub = document.getElementById('rsvp-status-sub');
  const guestsVal = document.getElementById('rsvp-summary-guests');
  const dietaryVal = document.getElementById('rsvp-summary-dietary');
  const songVal = document.getElementById('rsvp-summary-song');
  const tableVal = document.getElementById('rsvp-summary-table');
  
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
      pill.className = 'rsvp-status-pill';
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
      pill.className = 'rsvp-status-pill declined';
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

function enableRSVPEdit() {{
  const formWrap = document.getElementById('rsvp-form-container');
  const statusWrap = document.getElementById('rsvp-status-container');
  if (formWrap) formWrap.style.display = 'block';
  if (statusWrap) statusWrap.style.display = 'none';
}}

function handleGuestRSVPSubmit(e) {{
  e.preventDefault();
  const state = loadState();
  const guestIndex = state.guests.findIndex(g => g.id === activeGuest.id);
  if (guestIndex === -1) return;
  
  const dietary = document.getElementById('rsvp-dietary').value.trim();
  const song = document.getElementById('rsvp-song').value.trim();
  
  state.guests[guestIndex].rsvpStatus = currentRSVPStatus;
  state.guests[guestIndex].guestCount = currentRSVPStatus === 'confirmed' ? currentGuestCount : 0;
  state.guests[guestIndex].dietary = dietary;
  state.guests[guestIndex].song = song;
  
  // Add feed item for this confirmation
  const guestName = activeGuest.name;
  if (currentRSVPStatus === 'confirmed') {{
    state.feed.unshift({{
      id: 'f_rsvp_' + Date.now(),
      type: 'rsvp',
      author: guestName,
      title: `${{guestName}} confirmed`,
      subtitle: `Attending${{currentGuestCount > 1 ? ', +' + (currentGuestCount - 1) + ' guest' : ' · no plus-one'}}${{dietary ? ' · dietary: ' + dietary : ''}}`,
      time: 'Just now',
      likes: 1,
      comments: [],
      pinned: false,
      hidden: false
    }});
    logAudit('RSVP Confirmed', guestName, `Confirmed for ${{currentGuestCount}} guests (${{dietary || 'Standard'}})`, 'RSVP');
    showToast(`RSVP confirmed for ${{currentGuestCount}} guest(s)! Thank you!`, 'success');
  }} else {{
    logAudit('RSVP Declined', guestName, 'Declined wedding invitation', 'RSVP');
    showToast('RSVP response recorded. We will miss you!', 'info');
  }}
  
  saveState(state);
  activeGuest = state.guests[guestIndex];
  renderRSVPStatusView(activeGuest);
  renderFeed();
}}

function renderFeed() {{
  const state = loadState();
  const feedItems = state.feed || [];
  const container = document.getElementById('feed-items-container');
  const previewContainer = document.getElementById('hub-feed-preview-cards');
  if (!container) return;
  
  const visibleFeed = feedItems.filter(f => !f.hidden);
  
  // Render full feed
  container.innerHTML = visibleFeed.map(item => {{
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
    
    let quoteHtml = item.quote ? `<div class="feed-card-quote">"${{escapeHtml(item.quote)}}"</div>` : '';
    let photoHtml = item.photoDesc ? `<div style="background:#efe7db;padding:20px;border-radius:6px;text-align:center;font-style:italic;color:#6b5a4b;margin:8px 0;font-family:var(--font-heading);">"${{escapeHtml(item.photoDesc)}}"</div>` : '';
    
    let repliesHtml = '';
    if (item.replies && item.replies.length > 0) {{
      repliesHtml = item.replies.map(r => `
        <div style="background:#fcf9f2;border:1px solid #eadbca;border-left:3px solid var(--gold);padding:8px 12px;border-radius:4px;margin-top:8px;font-size:12px;">
          <div style="display:flex;align-items:center;gap:6px;font-weight:700;color:#9b723a;margin-bottom:2px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> <span>${{escapeHtml(r.author || 'Sophie & James')}} (Couple)</span>
          </div>
          <div style="color:#2a2018;">${{escapeHtml(r.text)}}</div>
          <div style="font-size:10px;color:#9b8c7c;margin-top:3px;">${{escapeHtml(r.time || 'Just now')}}</div>
        </div>
      `).join('');
    }}
    
    return `
      <div class="feed-card" id="${{item.id}}">
        <div class="feed-card-header">
          <div class="feed-glyph">${{glyph}}</div>
          <div style="flex:1;">
            <div class="feed-card-title">${{escapeHtml(item.title)}}</div>
            <div class="feed-card-subtitle">${{escapeHtml(item.subtitle || '')}}</div>
          </div>
          <span class="feed-time">${{escapeHtml(item.time)}}</span>
        </div>
        ${{quoteHtml}}
        ${{photoHtml}}
        ${{repliesHtml}}
        <div class="feed-actions-row">
          <button type="button" class="feed-action-btn" onclick="likeFeedItem('${{item.id}}')">
            ❤️ <span>${{item.likes || 0}}</span> Likes
          </button>
          <button type="button" class="feed-action-btn" onclick="toggleFeedComments('${{item.id}}')">
            💬 <span>${{item.comments ? item.comments.length : 0}}</span> Comments
          </button>
        </div>
        <div id="comments-${{item.id}}" class="feed-comments-container" style="display:none;">
          ${{(item.comments || []).map(c => `<div class="feed-comment-bubble">${{escapeHtml(c)}}</div>`).join('')}}
          <div style="display:flex;gap:6px;margin-top:6px;">
            <input type="text" id="input-comm-${{item.id}}" class="text-input" style="padding:6px 10px;font-size:12px;" placeholder="Write a comment...">
            <button type="button" class="btn btn-gold btn-sm" onclick="addFeedComment('${{item.id}}')">Send</button>
          </div>
        </div>
      </div>
    `;
  }}).join('');

  // Render Hub Preview cards (Image 3 feedback: clean professional SVG icons)
  if (previewContainer) {{
    const top2 = visibleFeed.slice(0, 2);
    previewContainer.innerHTML = top2.map(item => {{
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
        <div class="hub-preview-card">
          <div class="hub-preview-icon">${{icon}}</div>
          <div class="hub-preview-text">
            <b>${{escapeHtml(item.title)}}</b>
            <small>${{escapeHtml(item.subtitle || item.quote || item.time)}}</small>
          </div>
        </div>
      `;
    }}).join('');
  }}
}}

function handlePostNoteSubmit(e) {{
  e.preventDefault();
  const input = document.getElementById('new-note-text');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  
  const state = loadState();
  const authorName = activeGuest ? activeGuest.name : 'A Wedding Guest';
  
  state.feed.unshift({{
    id: 'f_note_' + Date.now(),
    type: 'note',
    author: authorName,
    title: `${{authorName}} left a note`,
    quote: text,
    time: 'Just now',
    likes: 1,
    comments: [],
    pinned: false,
    hidden: false
  }});
  
  logAudit('Love Note Added', authorName, `Posted: "${{text.substring(0, 30)}}..."`, 'Feed');
  saveState(state);
  showToast('Your Love Note has been shared on the feed!', 'success');
  renderFeed();
}}

function likeFeedItem(itemId) {{
  const state = loadState();
  const item = state.feed.find(f => f.id === itemId);
  if (item) {{
    item.likes = (item.likes || 0) + 1;
    saveState(state);
    renderFeed();
  }}
}}

function toggleFeedComments(itemId) {{
  const el = document.getElementById('comments-' + itemId);
  if (el) {{
    el.style.display = el.style.display === 'none' ? 'flex' : 'none';
  }}
}}

function addFeedComment(itemId) {{
  const input = document.getElementById('input-comm-' + itemId);
  if (!input || !input.value.trim()) return;
  const commentText = input.value.trim();
  input.value = '';
  
  const state = loadState();
  const item = state.feed.find(f => f.id === itemId);
  if (item) {{
    if (!item.comments) item.comments = [];
    item.comments.push(`${{activeGuest.name.split(' ')[0]}}: ${{commentText}}`);
    saveState(state);
    renderFeed();
    const commentEl = document.getElementById('comments-' + itemId);
    if (commentEl) commentEl.style.display = 'flex';
  }}
}}

function renderSchedule() {{
  const container = document.getElementById('schedule-timeline-container');
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
        <strong class="timeline-desc" style="display:block;font-size:14px;">${{e.title}}</strong>
        <span style="font-size:12px;color:#786858;">${{e.desc}}</span>
      </div>
    </div>
  `).join('');
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

function renderTablemates() {{
  const tableContainer = document.getElementById('circular-table-container');
  const listContainer = document.getElementById('tablemates-list');
  const state = loadState();
  
  const assignedTable = state.tables.find(t => t.id === activeGuest.tableId);
  const tableId = assignedTable ? assignedTable.id : 'table_4';
  const tableName = assignedTable ? assignedTable.name : 'Table 4';
  const capacity = assignedTable ? (assignedTable.capacity || 8) : 8;
  
  const seatDisplay = (activeGuest.seatIndex !== null && activeGuest.seatIndex !== undefined) ? activeGuest.seatIndex + 1 : 3;
  const seatLabelEl = document.getElementById('table-seat-display');
  if (seatLabelEl) {{
    seatLabelEl.textContent = `Seat ${{seatDisplay}} · ${{activeGuest.name}}`;
  }}
  
  // All guests assigned to this table
  const allTableGuests = state.guests.filter(g => g.tableId === tableId);
  
  // Render Circular Diagram (matching image 5)
  if (tableContainer) {{
    let diagramHtml = `
      <!-- Center Table Circle -->
      <div style="width:120px;height:120px;border-radius:50%;border:2px solid #bd9661;background:#ffffff;position:absolute;left:50px;top:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(189,150,97,0.14);z-index:2;">
        <strong style="font-family:var(--font-heading);font-size:18px;font-weight:700;color:#15110e;">${{escapeHtml(tableName)}}</strong>
        <span style="font-size:12px;color:#8c7d70;font-weight:600;margin-top:2px;">${{allTableGuests.length}} / ${{capacity}}</span>
      </div>
    `;
    
    // Render surrounding chair / guest circles (spaced evenly)
    for (let i = 0; i < capacity; i++) {{
      const angle = (i / capacity) * 2 * Math.PI - (Math.PI / 2);
      const radius = 82;
      const x = Math.round(110 + radius * Math.cos(angle) - 17);
      const y = Math.round(110 + radius * Math.sin(angle) - 17);
      
      const guestAtSeat = allTableGuests.find(g => g.seatIndex === i) || (allTableGuests[i] && allTableGuests[i].seatIndex === undefined ? allTableGuests[i] : null);
      
      if (guestAtSeat) {{
        const isMe = guestAtSeat.id === activeGuest.id;
        const initials = escapeHtml(guestAtSeat.initials || guestAtSeat.name.substring(0, 2).toUpperCase());
        const style = isMe 
          ? `background:#bd9661;color:#15110e;border:2px solid #15110e;box-shadow:0 0 0 2px #bd9661;font-weight:700;` 
          : `background:#15110e;color:#fcecd7;font-weight:600;`;
        
        diagramHtml += `
          <div title="Seat ${{i + 1}}: ${{escapeHtml(guestAtSeat.name)}}" style="position:absolute;left:${{x}}px;top:${{y}}px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:11px;z-index:3;cursor:default;${{style}}">
            ${{initials}}
          </div>
        `;
      }} else {{
        diagramHtml += `
          <div title="Seat ${{i + 1}}: Available chair" style="position:absolute;left:${{x}}px;top:${{y}}px;width:34px;height:34px;border-radius:50%;background:#e8e2d8;color:#8c7d70;border:1px dashed #b8aba0;display:grid;place-items:center;font-size:13px;z-index:3;">
            🪑
          </div>
        `;
      }}
    }}
    tableContainer.innerHTML = diagramHtml;
  }}
  
  if (listContainer) {{
    const mates = allTableGuests.filter(g => g.id !== activeGuest.id);
    if (mates.length === 0) {{
      listContainer.innerHTML = `<div style="text-align:center;padding:12px;color:var(--muted);font-size:13px;">No other tablemates seated here yet.</div>`;
      return;
    }}
    
    listContainer.innerHTML = mates.map(m => `
      <div style="background:var(--white);border:1px solid var(--line);border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:34px;height:34px;border-radius:50%;background:#15110e;color:#dfc194;display:grid;place-items:center;font-size:11px;font-weight:700;flex-shrink:0;">
            ${{escapeHtml(m.initials || m.name.substring(0, 2).toUpperCase())}}
          </div>
          <div>
            <div style="font-size:13.5px;font-weight:600;color:var(--ink);">${{escapeHtml(m.name)}}</div>
            <div style="font-size:11.5px;color:var(--muted);">Seat ${{ (m.seatIndex !== null && m.seatIndex !== undefined) ? m.seatIndex + 1 : '-' }}</div>
          </div>
        </div>
        ${{m.dietary && m.dietary !== 'None' ? `<span class="tt-pill warm" style="font-size:10.5px;">${{escapeHtml(m.dietary)}}</span>` : ''}}
      </div>
    `).join('');
  }}
}}

function renderPhotoWall() {{
  const grid = document.getElementById('guest-photo-grid');
  if (!grid) return;
  const state = loadState();
  const photos = state.photos || [];
  
  grid.innerHTML = photos.map((p, idx) => `
    <div class="photo-thumb-card" onclick="openPhotoLightbox('${{p.id}}')">
      ${{p.dataUrl ? `<img src="${{p.dataUrl}}" class="photo-thumb-img" alt="${{p.caption}}">` : 
      `<div style="font-family:var(--font-heading);font-style:italic;color:#5a493c;text-align:center;padding:12px;font-size:13px;">📷<br>${{escapeHtml(p.caption)}}</div>`}}
      <div class="photo-thumb-caption">${{escapeHtml(p.caption)}}</div>
    </div>
  `).join('');
}}

function handlePhotoUpload(e) {{
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
    
    // Add feed item
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
    renderPhotoWall();
    renderFeed();
  }};
  reader.readAsDataURL(file);
}}

function openPhotoLightbox(photoId) {{
  const state = loadState();
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  showToast(`Viewing: "${{photo.caption}}"`, 'info');
}}

function selectGiftAmount(amount) {{
  selectedGiftAUD = amount;
  document.querySelectorAll('.preset-btn').forEach(btn => {{
    btn.classList.toggle('active', btn.textContent.includes(amount));
  }});
  document.getElementById('custom-gift-amount').value = '';
  document.getElementById('gift-btn-amount').textContent = `$${{amount}} AUD`;
}}

function handleCustomAmount(val) {{
  const num = parseInt(val, 10);
  if (!isNaN(num) && num > 0) {{
    selectedGiftAUD = num;
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('gift-btn-amount').textContent = `$${{num}} AUD`;
  }}
}}

function openGiftCheckoutModal() {{
  document.getElementById('modal-checkout-amt').textContent = `$${{selectedGiftAUD}} AUD`;
  document.getElementById('gift-checkout-modal').style.display = 'flex';
  document.getElementById('gift-checkout-modal').setAttribute('aria-hidden', 'false');
}}

function closeGiftCheckoutModal() {{
  document.getElementById('gift-checkout-modal').style.display = 'none';
  document.getElementById('gift-checkout-modal').setAttribute('aria-hidden', 'true');
}}

function processMockGiftPayment() {{
  closeGiftCheckoutModal();
  const state = loadState();
  const note = document.getElementById('gift-note').value.trim() || 'Wishing you both all the happiness in the world!';
  const giftAmt = selectedGiftAUD;
  const giverName = activeGuest ? activeGuest.name : 'A Generous Guest';
  
  state.gifts.unshift({{
    id: 'gf_' + Date.now(),
    from: giverName,
    amount: giftAmt,
    date: 'Just now',
    message: note,
    thankYouSent: false
  }});
  
  // Add feed item
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
  renderFeed();
}}

function openGuestVenueModal() {{
  const modal = document.getElementById('guest-venue-modal');
  if (modal) {{
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }}
}}

function closeGuestVenueModal() {{
  const modal = document.getElementById('guest-venue-modal');
  if (modal) {{
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }}
}}

</script>
</body>
</html>
"""
    with open(os.path.join('c:\\Users\\Mohak\\Desktop\\tap&toast\\tap-toast-demo', 'guest-mobile.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print("guest-mobile.html generated successfully!")

if __name__ == '__main__':
    build_guest_mobile()
