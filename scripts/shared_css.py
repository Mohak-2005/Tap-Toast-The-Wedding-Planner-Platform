# Shared Luxury CSS Design System for Tap & Toast
def get_shared_css():
    return """
:root {
  --ink: #15110e;
  --ink-soft: #231c17;
  --ink-card: #1c1713;
  --gold: #bd9661;
  --gold-hover: #a8824f;
  --gold-light: #e6cda6;
  --gold-subtle: #f8f2e9;
  --cream: #f8f6f2;
  --cream-dark: #f0ede4;
  --cream-card: #fdfbf7;
  --white: #ffffff;
  --line: #e8ded0;
  --line-strong: #d5c7b5;
  --muted: #8b7b6b;
  --muted-light: #a69888;
  --green-bg: #e8eee4;
  --green-text: #3c6a42;
  --warm-bg: #f5e8d4;
  --warm-text: #916c3d;
  --lav-bg: #f0eaf3;
  --lav-text: #765c80;
  --danger-bg: #fbeae8;
  --danger-text: #a8382c;
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  --shadow-sm: 0 2px 8px rgba(21, 17, 14, 0.04);
  --shadow-md: 0 8px 24px rgba(21, 17, 14, 0.08);
  --shadow-lg: 0 16px 40px rgba(21, 17, 14, 0.14);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--cream);
  color: var(--ink);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  overflow-x: hidden;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  transition: all 0.18s ease;
}

a {
  color: inherit;
  text-decoration: none;
}

.gold-amp {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--gold);
  font-weight: 400;
  padding: 0 2px;
}

/* Demo Top Bar */
.tt-demobar {
  background: #110e0c;
  color: #d9c9b8;
  border-bottom: 1px solid #2b221a;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.tt-demobar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tt-mark {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  border-radius: 3px;
}

.tt-demobar-title {
  font-family: var(--font-heading);
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ffffff;
}

.tt-demobar-badge {
  background: #2a2119;
  color: var(--gold-light);
  border: 1px solid #3d3126;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 1px;
  font-weight: 600;
}

.tt-demobar-links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tt-demobar-link {
  color: #bfaea0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.tt-demobar-link:hover {
  color: #ffffff;
  background: #231c16;
}

.tt-demobar-link.active {
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
}

.tt-demobar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tt-demobar-reset {
  background: #261e18;
  color: #dfc194;
  border: 1px solid #4a3a2d;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tt-demobar-reset:hover {
  background: #382c23;
  color: #fff;
  border-color: var(--gold);
}

/* Toast Notifications */
.tt-toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  pointer-events: none;
}

.tt-toast {
  background: #181310;
  color: #ffffff;
  border: 1px solid var(--gold);
  border-left: 4px solid var(--gold);
  padding: 12px 18px;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  pointer-events: auto;
  animation: ttToastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  max-width: 380px;
}

.tt-toast-success {
  border-left-color: #5ea866;
}

.tt-toast-error {
  border-left-color: #d9534f;
}

.tt-toast-icon {
  font-weight: bold;
  color: var(--gold-light);
  font-size: 15px;
}

.tt-toast-success .tt-toast-icon { color: #8ad292; }
.tt-toast-error .tt-toast-icon { color: #f28b82; }

.tt-toast-fadeout {
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.25s ease;
}

@keyframes ttToastIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tab Panes */
.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
}

/* Status Pills */
.tt-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
}

.tt-pill.finalising, .tt-pill.warm {
  background: var(--warm-bg);
  color: var(--warm-text);
  border: 1px solid #ebd4b7;
}

.tt-pill.on-track, .tt-pill.green {
  background: var(--green-bg);
  color: var(--green-text);
  border: 1px solid #d1dfcb;
}

.tt-pill.planning, .tt-pill.lavender {
  background: var(--lav-bg);
  color: var(--lav-text);
  border: 1px solid #dfd3e4;
}

.tt-pill.danger {
  background: var(--danger-bg);
  color: var(--danger-text);
  border: 1px solid #f2c7c2;
}

.tt-pill.not-started {
  background: #f0ebe4;
  color: #736353;
  border: 1px solid #ddd2c4;
}

.tt-pill.drafted {
  background: #fdf3e7;
  color: #a0631c;
  border: 1px solid #f2d5b1;
}

.tt-pill.sent {
  background: #edf4fb;
  color: #1f618d;
  border: 1px solid #c4dcf3;
}

.tt-pill.completed {
  background: #edf7ee;
  color: #236829;
  border: 1px solid #c7e8cc;
}

/* Common Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 4px;
  font-size: 13.5px;
  font-weight: 600;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--ink);
  color: #ffffff;
  border: 1px solid var(--ink);
}

.btn-primary:hover {
  background: var(--ink-soft);
  box-shadow: 0 4px 12px rgba(21, 17, 14, 0.2);
}

.btn-gold {
  background: var(--gold);
  color: var(--ink);
  border: 1px solid var(--gold);
  font-weight: 700;
}

.btn-gold:hover {
  background: var(--gold-hover);
  border-color: var(--gold-hover);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(189, 150, 97, 0.3);
}

.btn-outline {
  background: var(--white);
  color: var(--ink);
  border: 1px solid var(--line-strong);
}

.btn-outline:hover {
  background: var(--cream-dark);
  border-color: var(--ink);
}

.btn-sm {
  padding: 6px 11px;
  font-size: 12px;
}

.btn-block {
  width: 100%;
}

/* Common Modal and Backdrop */
.tt-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(18, 14, 11, 0.65);
  backdrop-filter: blur(3px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ttFadeIn 0.2s ease forwards;
}

.tt-modal {
  background: var(--white);
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: ttScaleUp 0.2s ease forwards;
}

.tt-modal-header {
  padding: 18px 22px;
  background: #181310;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
}

.tt-modal-title {
  font-family: var(--font-heading);
  font-size: 19px;
  color: #ffffff;
}

.tt-modal-close {
  color: #c9b8a6;
  font-size: 20px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.tt-modal-close:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

.tt-modal-body {
  padding: 22px;
}

.tt-modal-footer {
  padding: 16px 22px;
  background: var(--cream);
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

/* Global Form Elements */
.field-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}

.text-input {
  width: 100%;
  padding: 9px 12px;
  background: var(--white);
  border: 1px solid var(--line-strong);
  border-radius: 5px;
  font-size: 13.5px;
  color: var(--ink);
  font-family: var(--font-body);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.text-input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(189, 150, 97, 0.18);
}

/* Seating Floor Plan Styles (Shared across Couple & MC) */
.seating-toolbar {
  background: #17120f;
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.seating-split {
  display: grid;
  grid-template-columns: 1fr 280px;
  border: 1px solid var(--line);
  border-top: none;
  background: #ffffff;
  border-radius: 0 0 6px 6px;
  min-height: 540px;
}

.floorplan-canvas {
  background-color: #faf9f6;
  background-image: radial-gradient(#e4d6c2 1.2px, transparent 1.2px);
  background-size: 22px 22px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  overflow-x: auto;
}

.head-table-block {
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
}

.table-circle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  justify-items: center;
  width: 100%;
  max-width: 780px;
}

.round-table {
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
}

.round-table-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.round-table-count {
  font-size: 11px;
  color: var(--muted);
}

.seat-dot {
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
}

.seat-dot:hover {
  transform: scale(1.18);
}

.seat-dot.empty {
  background: #ffffff;
  border: 1px dashed #c7aa80;
  color: #bda27f;
}

.unassigned-panel {
  border-left: 1px solid var(--line);
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.guest-card-draggable {
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fbf9f6;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.15s ease;
}

.guest-card-draggable:hover {
  border-color: var(--gold);
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* Venue & Travel Shared Cards */
.venue-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.venue-card-accent {
  background: #ffffff;
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.map-embed-card {
  background: #17120f;
  color: #f7f3ee;
  border: 1px solid #382c20;
  border-radius: 8px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

@keyframes ttFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ttScaleUp {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
"""
