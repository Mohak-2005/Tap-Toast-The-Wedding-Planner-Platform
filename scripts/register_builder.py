# Standalone register.html Builder for Tap & Toast
import os
from data_template import SEED_STATE
from shared_css import get_shared_css
from shared_js import get_shared_js
from auth_component import get_auth_css

def build_register():
    shared_css = get_shared_css()
    shared_js = get_shared_js()
    auth_css = get_auth_css()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Register | Tap &amp; Toast</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
{shared_css}
{auth_css}

/* Dedicated Standalone Register Styles */
body {{
  background: var(--cream);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}}

.tt-register-page-container {{
  display: grid;
  grid-template-columns: 45% 55%;
  flex: 1;
  min-height: calc(100vh - 42px);
}}

@media (max-width: 900px) {{
  .tt-register-page-container {{
    grid-template-columns: 1fr;
  }}
}}

/* Couple Registration Slideshow / Wizard */
.tt-wizard-nav {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 24px;
  padding: 0 10px;
}}

.tt-wizard-nav-line {{
  position: absolute;
  top: 16px;
  left: 36px;
  right: 36px;
  height: 2px;
  background: #e5dacd;
  z-index: 1;
}}

.tt-wizard-nav-progress {{
  position: absolute;
  top: 16px;
  left: 36px;
  width: 0%;
  max-width: calc(100% - 72px);
  height: 2px;
  background: var(--gold);
  z-index: 2;
  transition: width 0.3s ease;
}}

.tt-wizard-step-node {{
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
}}

.tt-wizard-step-circle {{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #d4c8b6;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}}

.tt-wizard-step-node.active .tt-wizard-step-circle {{
  border-color: var(--gold);
  background: #15110e;
  color: #f7eedf;
  box-shadow: 0 0 0 3px rgba(189, 150, 97, 0.25);
}}

.tt-wizard-step-node.completed .tt-wizard-step-circle {{
  border-color: var(--gold);
  background: var(--gold);
  color: #ffffff;
}}

.tt-wizard-step-label {{
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
  transition: color 0.25s ease;
}}

.tt-wizard-step-node.active .tt-wizard-step-label {{
  color: var(--ink);
  font-weight: 700;
}}

.tt-wizard-step-node.completed .tt-wizard-step-label {{
  color: var(--gold);
}}

.tt-couple-slide {{
  display: none;
}}

.tt-couple-slide.active {{
  display: block;
  animation: slideFadeIn 0.25s ease-out;
}}

@keyframes slideFadeIn {{
  from {{
    opacity: 0;
    transform: translateY(6px);
  }}
  to {{
    opacity: 1;
    transform: translateY(0);
  }}
}}
  </style>
</head>
<body>
  <!-- Top Demo Bar -->
  <nav class="tt-demobar" aria-label="Demo Navigation">
    <div class="tt-demobar-brand">
      <div class="tt-demobar-logo">T</div>
      <span class="tt-demobar-title">Tap <span class="gold-amp">&amp;</span> Toast</span>
      <span class="tt-demobar-badge">DEMO SUITE</span>
    </div>
    <div class="tt-demobar-links">
      <a href="index.html" class="tt-demobar-link" title="Showcase Hub">Showcase</a>
      <a href="login.html" class="tt-demobar-link">Sign In</a>
      <a href="register.html" class="tt-demobar-link active">Register</a>
      <a href="guest-mobile.html" class="tt-demobar-link">Guest Mobile</a>
      <a href="guest-web.html" class="tt-demobar-link">Guest Web</a>
      <a href="couple.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'couple', 'couple.html')">Couple Dashboard</a>
      <a href="mc.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'mc', 'mc.html')">MC Pro</a>
      <a href="superadmin.html" class="tt-demobar-link" onclick="handleDemobarNav(event, 'superadmin', 'superadmin.html')">Super Admin</a>
    </div>
    <div class="tt-demobar-actions">
      <button type="button" class="tt-demobar-reset" onclick="resetDemoData()">↻ Reset Demo Data</button>
    </div>
  </nav>

  <!-- Split Screen Container -->
  <div class="tt-register-page-container">
    <!-- Left Hero Panel (45% desktop, collapsed on mobile) -->
    <div class="tt-auth-hero">
      <div class="tt-auth-brand-wrap">
        <div class="tt-auth-logo-box">T</div>
        <div class="tt-auth-brand-name">Tap &amp; Toast</div>
      </div>
      <div class="tt-auth-hero-arch">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M10 54V30C10 18.9543 18.9543 10 30 10C41.0457 10 50 18.9543 50 30V54" stroke="#bd9661" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M16 54V30C16 22.268 22.268 16 30 16C37.732 16 44 22.268 44 30V54" stroke="#bd9661" stroke-width="0.75" stroke-dasharray="3 3"/>
          <circle cx="30" cy="30" r="2.5" fill="#bd9661"/>
        </svg>
      </div>
      <h1 class="tt-auth-hero-title">Every wedding, beautifully run.</h1>
      <div class="tt-auth-hero-subline">AUSTRALIA'S PREMIER WEDDING MC &amp; PLANNING SUITE</div>
      <ul class="tt-auth-hero-bullets">
        <li>
          <span class="tt-auth-hero-bullet-icon">&#10003;</span>
          <span>Multi-tenant run sheets, live cues, and floor plan builder for professional MCs</span>
        </li>
        <li>
          <span class="tt-auth-hero-bullet-icon">&#10003;</span>
          <span>QaRd invitation tap-in, real-time RSVP tracking, and Gift &amp; Go wishing wells</span>
        </li>
        <li>
          <span class="tt-auth-hero-bullet-icon">&#10003;</span>
          <span>Seamless collaboration between couples, MCs, and wedding coordinators</span>
        </li>
      </ul>
    </div>

    <!-- Right Form Container (55%) -->
    <div class="tt-auth-form-wrap">
      <div class="tt-auth-card">

        <h2 class="tt-auth-title">Create your account</h2>
        <p class="tt-auth-sub">Choose your account type below to get started.</p>

        <!-- Segmented Mode Toggle: MC vs Couple (No Super Admin) -->
        <div class="tt-reg-mode-toggle">
          <button type="button" class="tt-reg-mode-btn active" id="reg-mode-btn-mc" onclick="setRegMode('mc')">I'm an MC / Planner</button>
          <button type="button" class="tt-reg-mode-btn" id="reg-mode-btn-couple" onclick="setRegMode('couple')">I'm a Couple</button>
        </div>

        <!-- MC / PLANNER REGISTRATION FORM -->
        <form id="reg-mc-form" onsubmit="event.preventDefault(); handleRegisterMC();">
          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-name">FULL NAME</label>
            <input class="tt-form-input" id="reg-mc-name" type="text" placeholder="Jane Doe" required />
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-business">BUSINESS NAME</label>
            <input class="tt-form-input" id="reg-mc-business" type="text" placeholder="Jane Doe Weddings" required />
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-email">EMAIL ADDRESS</label>
            <input class="tt-form-input" id="reg-mc-email" type="email" autocomplete="email" placeholder="jane@example.com" required onblur="checkEmailUniqueness(this.value, 'reg-mc-email-err')" />
            <div id="reg-mc-email-err" class="tt-pwd-match" style="color:#b42318;display:none;"></div>
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-mobile">AU MOBILE NUMBER</label>
            <input class="tt-form-input" id="reg-mc-mobile" type="tel" autocomplete="tel" placeholder="0412 345 678" required oninput="formatAuMobile(this)" />
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-abn">AUSTRALIAN BUSINESS NUMBER (ABN) <span style="font-weight:normal;color:var(--muted);">(OPTIONAL)</span></label>
            <input class="tt-form-input" id="reg-mc-abn" type="text" placeholder="12 345 678 901" oninput="formatAbn(this)" />
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-pwd">PASSWORD</label>
            <div class="tt-pwd-wrapper">
              <input class="tt-form-input" id="reg-mc-pwd" type="password" autocomplete="new-password" placeholder="Create a password" required oninput="updateLivePwdStrength(this.value, 'mc')" />
              <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('reg-mc-pwd')">Show</button>
            </div>
            <!-- Strength meter -->
            <div class="tt-pwd-meter">
              <div class="tt-pwd-meter-bar" id="reg-mc-meter-bar"></div>
            </div>
            <span class="tt-pwd-meter-text" id="reg-mc-meter-text" style="color:var(--muted);">Password strength</span>
            <!-- Rules checklist -->
            <ul class="tt-pwd-checklist">
              <li id="reg-mc-rule-len" class="tt-pwd-rule">&#8226; 8+ characters</li>
              <li id="reg-mc-rule-upper" class="tt-pwd-rule">&#8226; Uppercase letter</li>
              <li id="reg-mc-rule-lower" class="tt-pwd-rule">&#8226; Lowercase letter</li>
              <li id="reg-mc-rule-num" class="tt-pwd-rule">&#8226; Number</li>
            </ul>
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-pwd-confirm">CONFIRM PASSWORD</label>
            <div class="tt-pwd-wrapper">
              <input class="tt-form-input" id="reg-mc-pwd-confirm" type="password" autocomplete="new-password" placeholder="Confirm password" required oninput="checkPwdMatch('reg-mc-pwd', 'reg-mc-pwd-confirm', 'reg-mc-match-indicator')" />
              <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('reg-mc-pwd-confirm')">Show</button>
            </div>
            <div id="reg-mc-match-indicator" class="tt-pwd-match" style="display:none;"></div>
          </div>

          <div class="tt-terms-wrap">
            <input type="checkbox" id="reg-mc-terms" required checked />
            <label for="reg-mc-terms">I agree to the Tap &amp; Toast Terms of Service and Privacy Policy</label>
          </div>

          <div id="reg-mc-summary-err" class="tt-inline-error" style="display:none;"></div>

          <button type="submit" id="reg-mc-submit-btn" class="tt-auth-btn-primary">
            Register &rarr;
          </button>
        </form>

        <!-- COUPLE REGISTRATION FORM (SLIDESHOW WIZARD) -->
        <form id="reg-couple-form" style="display:none;" onsubmit="event.preventDefault(); handleRegisterCouple();">
          
          <!-- Wizard Step Navigation -->
          <div class="tt-wizard-nav">
            <div class="tt-wizard-nav-line"></div>
            <div class="tt-wizard-nav-progress" id="wizard-progress-bar"></div>
            <button type="button" class="tt-wizard-step-node active" id="step-node-1" onclick="goToCoupleSlide(1)">
              <div class="tt-wizard-step-circle">1</div>
              <div class="tt-wizard-step-label">Contact</div>
            </button>
            <button type="button" class="tt-wizard-step-node" id="step-node-2" onclick="goToCoupleSlide(2)">
              <div class="tt-wizard-step-circle">2</div>
              <div class="tt-wizard-step-label">Wedding</div>
            </button>
            <button type="button" class="tt-wizard-step-node" id="step-node-3" onclick="goToCoupleSlide(3)">
              <div class="tt-wizard-step-circle">3</div>
              <div class="tt-wizard-step-label">Security</div>
            </button>
          </div>

          <!-- SLIDE 1: Name, Email Address, Phone No, Invitation Code -->
          <div class="tt-couple-slide active" id="couple-slide-1">
            <div style="font-size:11.5px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;margin-bottom:4px;">Step 1 of 3 &bull; Contact &amp; Invitation</div>
            <h3 style="font-family:var(--font-heading);font-size:20px;color:var(--ink);margin:0 0 16px;">Who is registering?</h3>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-contact-name">FULL NAME</label>
              <input class="tt-form-input" id="reg-couple-contact-name" type="text" placeholder="Sophie Miller" value="Sophie Miller" required />
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-email">EMAIL ADDRESS</label>
              <input class="tt-form-input" id="reg-couple-email" type="email" autocomplete="email" placeholder="sophie@example.com" value="sophie@example.com" required onblur="checkEmailUniqueness(this.value, 'reg-couple-email-err')" />
              <div id="reg-couple-email-err" class="tt-pwd-match" style="color:#b42318;display:none;"></div>
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-mobile">AU MOBILE NUMBER</label>
              <input class="tt-form-input" id="reg-couple-mobile" type="tel" autocomplete="tel" placeholder="0412 345 678" value="0412 345 678" required oninput="formatAuMobile(this)" />
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-code">INVITATION CODE <span style="font-weight:normal;color:var(--muted);">(FROM YOUR MC)</span></label>
              <input class="tt-form-input" id="reg-couple-code" type="text" placeholder="e.g. SJ-2026" value="SJ-2026" required oninput="handleInviteCodeInput(this.value)" />
              <div id="reg-couple-code-err" class="tt-pwd-match" style="color:#b42318;display:none;"></div>
            </div>

            <!-- Gold info strip when code is valid -->
            <div id="reg-couple-info-strip" class="tt-invite-strip" style="display:none;margin-bottom:16px;">
              <div style="font-size:12px;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Wedding Invitation Verified</div>
              <div style="font-size:13.5px;color:var(--ink);font-weight:600;" id="reg-couple-wedding-label">Sophie &amp; James &bull; 14 Nov 2026</div>
              <div style="font-size:12px;color:var(--muted);" id="reg-couple-mc-label">Coordinated by Robert Galati (MC)</div>
            </div>

            <button type="button" class="tt-auth-btn-primary" onclick="goToCoupleSlide(2)">
              Next &rarr;
            </button>
          </div>

          <!-- SLIDE 2: Partner 1 Name, Partner 2 Name, Wedding Details -->
          <div class="tt-couple-slide" id="couple-slide-2">
            <div style="font-size:11.5px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;margin-bottom:4px;">Step 2 of 3 &bull; Wedding Details</div>
            <h3 style="font-family:var(--font-heading);font-size:20px;color:var(--ink);margin:0 0 16px;">About your celebration</h3>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div class="tt-form-group">
                <label class="tt-form-label" for="reg-couple-p1">PARTNER 1 NAME</label>
                <input class="tt-form-input" id="reg-couple-p1" type="text" placeholder="Sophie" value="Sophie" required />
              </div>
              <div class="tt-form-group">
                <label class="tt-form-label" for="reg-couple-p2">PARTNER 2 NAME</label>
                <input class="tt-form-input" id="reg-couple-p2" type="text" placeholder="James" value="James" required />
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div class="tt-form-group">
                <label class="tt-form-label" for="reg-couple-date">WEDDING DATE</label>
                <input class="tt-form-input" id="reg-couple-date" type="date" value="2026-11-14" required />
              </div>
              <div class="tt-form-group">
                <label class="tt-form-label" for="reg-couple-guests">ESTIMATED GUESTS</label>
                <input class="tt-form-input" id="reg-couple-guests" type="number" placeholder="100" value="100" min="1" max="500" required />
              </div>
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-venue">CEREMONY &amp; RECEPTION VENUE</label>
              <input class="tt-form-input" id="reg-couple-venue" type="text" placeholder="Fernwood Estate, Southern Highlands" value="Fernwood Estate, Southern Highlands" required />
            </div>

            <div style="display:flex;gap:12px;margin-top:20px;">
              <button type="button" class="btn btn-outline" style="flex:1;padding:12px;" onclick="goToCoupleSlide(1)">&larr; Back</button>
              <button type="button" class="tt-auth-btn-primary" style="flex:2;" onclick="goToCoupleSlide(3)">Next &rarr;</button>
            </div>
          </div>

          <!-- SLIDE 3: Password, Confirm Password, Register -->
          <div class="tt-couple-slide" id="couple-slide-3">
            <div style="font-size:11.5px;text-transform:uppercase;letter-spacing:1px;color:var(--gold);font-weight:700;margin-bottom:4px;">Step 3 of 3 &bull; Account Security</div>
            <h3 style="font-family:var(--font-heading);font-size:20px;color:var(--ink);margin:0 0 16px;">Set your password</h3>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-pwd">PASSWORD</label>
              <div class="tt-pwd-wrapper">
                <input class="tt-form-input" id="reg-couple-pwd" type="password" autocomplete="new-password" placeholder="Create a password" value="Demo1234!" required oninput="updateLivePwdStrength(this.value, 'couple')" />
                <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('reg-couple-pwd')">Show</button>
              </div>
              <div class="tt-pwd-meter">
                <div class="tt-pwd-meter-bar" id="reg-couple-meter-bar"></div>
              </div>
              <span class="tt-pwd-meter-text" id="reg-couple-meter-text" style="color:var(--muted);">Password strength</span>
              <ul class="tt-pwd-checklist">
                <li id="reg-couple-rule-len" class="tt-pwd-rule">&#8226; 8+ characters</li>
                <li id="reg-couple-rule-upper" class="tt-pwd-rule">&#8226; Uppercase letter</li>
                <li id="reg-couple-rule-lower" class="tt-pwd-rule">&#8226; Lowercase letter</li>
                <li id="reg-couple-rule-num" class="tt-pwd-rule">&#8226; Number</li>
              </ul>
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-pwd-confirm">CONFIRM PASSWORD</label>
              <div class="tt-pwd-wrapper">
                <input class="tt-form-input" id="reg-couple-pwd-confirm" type="password" autocomplete="new-password" placeholder="Confirm password" value="Demo1234!" required oninput="checkPwdMatch('reg-couple-pwd', 'reg-couple-pwd-confirm', 'reg-couple-match-indicator')" />
                <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('reg-couple-pwd-confirm')">Show</button>
              </div>
              <div id="reg-couple-match-indicator" class="tt-pwd-match" style="display:none;"></div>
            </div>

            <div class="tt-terms-wrap">
              <input type="checkbox" id="reg-couple-terms" required checked />
              <label for="reg-couple-terms">I agree to the Tap &amp; Toast Terms of Service and Privacy Policy</label>
            </div>

            <div id="reg-couple-summary-err" class="tt-inline-error" style="display:none;"></div>

            <div style="display:flex;gap:12px;margin-top:20px;">
              <button type="button" class="btn btn-outline" style="flex:1;padding:12px;" onclick="goToCoupleSlide(2)">&larr; Back</button>
              <button type="submit" id="reg-couple-submit-btn" class="tt-auth-btn-primary" style="flex:2;">
                Register &rarr;
              </button>
            </div>
          </div>

        </form>

        <!-- Footer Links -->
        <div style="margin-top:22px;text-align:center;font-size:13px;color:var(--muted);line-height:1.6;">
          <div>Already have an account? <a href="login.html" style="color:var(--gold);font-weight:600;text-decoration:underline;">Sign in</a></div>
          <div style="margin-top:8px;">Guest? No account needed. <a href="guest-mobile.html" style="color:var(--gold);font-weight:600;text-decoration:underline;">Scan your QaRd</a>.</div>
        </div>

      </div>
    </div>
  </div>

  <!-- MC WELCOME 2-STEP MODAL -->
  <div id="mc-welcome-modal" class="tt-modal-backdrop" style="display:none;">
    <div class="tt-modal-dialog" style="max-width:440px;text-align:center;">
      <div style="font-size:42px;margin-bottom:12px;">🎉</div>
      <h3 class="tt-modal-title" style="font-size:22px;margin-bottom:8px;">Welcome to Tap &amp; Toast Pro!</h3>
      <p style="font-size:13.5px;color:var(--muted);margin-bottom:20px;line-height:1.5;">
        Your account has been activated. Your multi-tenant dashboard is ready to organise run sheets, manage floor plans, and run flawless receptions.
      </p>
      <button type="button" class="tt-auth-btn-primary" onclick="window.location.href='mc.html'">
        Add Your First Wedding &rarr;
      </button>
    </div>
  </div>

  <script>
{shared_js}

let currentCoupleSlide = 1;
let selectedRegMode = 'mc';

document.addEventListener('DOMContentLoaded', () => {{
  initRegisterPage();
}});

function initRegisterPage() {{
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCodeParam = urlParams.get('invite');
  const modeParam = urlParams.get('mode');

  if (modeParam === 'couple' || inviteCodeParam) {{
    setRegMode('couple');
  }}

  if (inviteCodeParam) {{
    const codeInput = document.getElementById('reg-couple-code');
    if (codeInput) {{
      codeInput.value = inviteCodeParam;
      codeInput.setAttribute('readonly', 'true');
      codeInput.style.background = '#fcf8f2';
      handleInviteCodeInput(inviteCodeParam);
    }}
  }}
}}

function setRegMode(mode) {{
  selectedRegMode = mode;
  const mcBtn = document.getElementById('reg-mode-btn-mc');
  const coupleBtn = document.getElementById('reg-mode-btn-couple');
  const mcForm = document.getElementById('reg-mc-form');
  const coupleForm = document.getElementById('reg-couple-form');

  if (mode === 'mc') {{
    if (mcBtn) mcBtn.classList.add('active');
    if (coupleBtn) coupleBtn.classList.remove('active');
    if (mcForm) mcForm.style.display = 'block';
    if (coupleForm) coupleForm.style.display = 'none';
  }} else {{
    if (coupleBtn) coupleBtn.classList.add('active');
    if (mcBtn) mcBtn.classList.remove('active');
    if (mcForm) mcForm.style.display = 'none';
    if (coupleForm) coupleForm.style.display = 'block';
    goToCoupleSlide(1);
  }}
}}

function goToCoupleSlide(slideNum) {{
  if (slideNum < 1 || slideNum > 3) return;
  currentCoupleSlide = slideNum;
  for (let i = 1; i <= 3; i++) {{
    const slide = document.getElementById('couple-slide-' + i);
    const node = document.getElementById('step-node-' + i);
    if (slide) slide.classList.toggle('active', i === slideNum);
    if (node) {{
      node.classList.toggle('active', i === slideNum);
      node.classList.toggle('completed', i < slideNum);
    }}
  }}
  const progBar = document.getElementById('wizard-progress-bar');
  if (progBar) {{
    if (slideNum === 1) progBar.style.width = '0%';
    else if (slideNum === 2) progBar.style.width = '50%';
    else if (slideNum === 3) progBar.style.width = '100%';
  }}
}}

function formatAuMobile(input) {{
  let digits = input.value.replace(/\D/g, '');
  if (digits.startsWith('61')) digits = digits.substring(2);
  if (digits.length > 10) digits = digits.substring(0, 10);

  if (digits.length > 6) {{
    input.value = `${{digits.slice(0, 4)}} ${{digits.slice(4, 7)}} ${{digits.slice(7)}}`;
  }} else if (digits.length > 4) {{
    input.value = `${{digits.slice(0, 4)}} ${{digits.slice(4)}}`;
  }} else {{
    input.value = digits;
  }}
}}

function formatAbn(input) {{
  let digits = input.value.replace(/\D/g, '').substring(0, 11);
  if (digits.length > 8) {{
    input.value = `${{digits.slice(0, 2)}} ${{digits.slice(2, 5)}} ${{digits.slice(5, 8)}} ${{digits.slice(8)}}`;
  }} else if (digits.length > 5) {{
    input.value = `${{digits.slice(0, 2)}} ${{digits.slice(2, 5)}} ${{digits.slice(5)}}`;
  }} else if (digits.length > 2) {{
    input.value = `${{digits.slice(0, 2)}} ${{digits.slice(2)}}`;
  }} else {{
    input.value = digits;
  }}
}}

function checkEmailUniqueness(email, errElId) {{
  const errEl = document.getElementById(errElId);
  if (!errEl) return false;
  if (!email || !email.includes('@')) {{
    errEl.style.display = 'none';
    return false;
  }}
  const state = loadState();
  const users = state.users || [];
  const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {{
    errEl.innerHTML = `An account with this email already exists. <a href="login.html" style="color:var(--gold);text-decoration:underline;font-weight:600;">Sign in instead</a>`;
    errEl.style.display = 'block';
    return true;
  }} else {{
    errEl.style.display = 'none';
    return false;
  }}
}}

function handleInviteCodeInput(code) {{
  const cleanCode = (code || '').trim().toUpperCase();
  const errEl = document.getElementById('reg-couple-code-err');
  const infoStrip = document.getElementById('reg-couple-info-strip');
  const p1Input = document.getElementById('reg-couple-p1');
  const p2Input = document.getElementById('reg-couple-p2');

  if (!cleanCode) {{
    if (errEl) errEl.style.display = 'none';
    if (infoStrip) infoStrip.style.display = 'none';
    return;
  }}

  const state = loadState();
  const invites = state.invites || [];
  const invite = invites.find(i => i.code.toUpperCase() === cleanCode);

  if (!invite) {{
    if (infoStrip) infoStrip.style.display = 'none';
    if (errEl) {{
      errEl.textContent = "That invite code wasn't recognised. Ask your MC for a new one.";
      errEl.style.display = 'block';
    }}
    return;
  }}

  if (invite.used) {{
    if (infoStrip) infoStrip.style.display = 'none';
    if (errEl) {{
      errEl.textContent = 'This invite has already been used.';
      errEl.style.display = 'block';
    }}
    return;
  }}

  // Valid invite!
  if (errEl) errEl.style.display = 'none';
  if (infoStrip) {{
    infoStrip.style.display = 'block';
    const weddingLabel = document.getElementById('reg-couple-wedding-label');
    const mcLabel = document.getElementById('reg-couple-mc-label');
    if (weddingLabel) weddingLabel.textContent = `${{invite.couple}} • ${{invite.weddingDate}}`;
    if (mcLabel) mcLabel.textContent = `Coordinated by ${{invite.mc}} (MC)`;
  }}

  if (p1Input && !p1Input.value) p1Input.value = invite.partner1 || 'Sophie';
  if (p2Input && !p2Input.value) p2Input.value = invite.partner2 || 'James';
}}

function handleRegisterMC() {{
  const name = document.getElementById('reg-mc-name').value.trim();
  const business = document.getElementById('reg-mc-business').value.trim();
  const email = document.getElementById('reg-mc-email').value.trim().toLowerCase();
  const mobile = document.getElementById('reg-mc-mobile').value.trim();
  const abn = document.getElementById('reg-mc-abn').value.trim();
  const pwd = document.getElementById('reg-mc-pwd').value;
  const pwdConfirm = document.getElementById('reg-mc-pwd-confirm').value;
  const terms = document.getElementById('reg-mc-terms').checked;
  const summaryErr = document.getElementById('reg-mc-summary-err');
  if (summaryErr) summaryErr.style.display = 'none';

  const regName = name || 'Robert Galati';
  const regBusiness = business || 'Galati Events MC';
  const regEmail = email || 'mc.new@demo.test';

  const state = loadState();
  const tenantId = 'ten_' + Date.now();
  const userId = 'u_mc_' + Date.now();

  if (!state.tenants) state.tenants = [];
  state.tenants.push({{
    id: tenantId,
    name: regBusiness,
    contactName: regName,
    email: regEmail,
    phone: mobile || '0412 000 000',
    plan: 'Pro',
    status: 'Active',
    weddingsCount: 0,
    mrr: 299,
    joinedDate: 'Today'
  }});

  if (!state.users) state.users = [];
  state.users.push({{
    id: userId,
    email: regEmail,
    passwordHash: hashDemoPassword(pwd || 'Demo1234!'),
    name: regName,
    role: 'mc',
    tenantId: tenantId,
    business: regBusiness
  }});

  logAudit('New MC registered: ' + regBusiness, regName, 'Registered in demo', 'Tenants');
  saveState(state);

  const session = {{
    role: 'mc',
    email: regEmail,
    name: regName,
    tenantId: tenantId,
    keepSignedIn: true,
    at: Date.now()
  }};
  setSession(session);

  const welcomeModal = document.getElementById('mc-welcome-modal');
  if (welcomeModal) {{
    welcomeModal.style.display = 'flex';
  }} else {{
    showToast('Account registered successfully!', 'success');
    setTimeout(() => {{ window.location.href = 'mc.html'; }}, 500);
  }}
}}

function handleRegisterCouple() {{
  const contactName = document.getElementById('reg-couple-contact-name')?.value.trim() || 'Sophie Miller';
  const email = document.getElementById('reg-couple-email')?.value.trim().toLowerCase() || 'sophie@example.com';
  const mobile = document.getElementById('reg-couple-mobile')?.value.trim() || '0412 345 678';
  const code = document.getElementById('reg-couple-code')?.value.trim().toUpperCase() || 'SJ-2026';
  
  const p1 = document.getElementById('reg-couple-p1')?.value.trim() || 'Sophie';
  const p2 = document.getElementById('reg-couple-p2')?.value.trim() || 'James';
  const date = document.getElementById('reg-couple-date')?.value || '2026-11-14';
  const venue = document.getElementById('reg-couple-venue')?.value.trim() || 'Fernwood Estate, Southern Highlands';
  const guestCount = parseInt(document.getElementById('reg-couple-guests')?.value, 10) || 100;
  
  const pwd = document.getElementById('reg-couple-pwd')?.value || 'Demo1234!';
  const summaryErr = document.getElementById('reg-couple-summary-err');

  if (summaryErr) summaryErr.style.display = 'none';

  const state = loadState();
  const coupleName = `${{p1}} & ${{p2}}`;
  const userId = 'u_couple_' + Date.now();

  if (!state.users) state.users = [];
  state.users.push({{
    id: userId,
    email: email,
    phone: mobile,
    contactName: contactName,
    passwordHash: hashDemoPassword(pwd),
    name: coupleName,
    role: 'couple',
    weddingId: 'w1'
  }});

  // Update wedding info in state if w1 exists
  const wedding = (state.weddings || []).find(w => w.id === 'w1');
  if (wedding) {{
    wedding.partner1 = p1;
    wedding.partner2 = p2;
    wedding.couple = coupleName;
    wedding.date = date;
    wedding.venue = venue;
  }}

  logAudit('Couple registered: ' + coupleName, coupleName, 'Registered in demo', 'Security');
  saveState(state);

  const session = {{
    role: 'couple',
    email: email,
    name: coupleName,
    weddingId: 'w1',
    keepSignedIn: true,
    at: Date.now()
  }};
  setSession(session);

  showToast('Account registered successfully!', 'success');
  setTimeout(() => {{
    window.location.href = 'couple.html';
  }}, 500);
}}

function updateLivePwdStrength(val, prefix) {{
  const meterBar = document.getElementById(`reg-${{prefix}}-meter-bar`);
  const meterText = document.getElementById(`reg-${{prefix}}-meter-text`);
  const ruleLen = document.getElementById(`reg-${{prefix}}-rule-len`);
  const ruleUpper = document.getElementById(`reg-${{prefix}}-rule-upper`);
  const ruleLower = document.getElementById(`reg-${{prefix}}-rule-lower`);
  const ruleNum = document.getElementById(`reg-${{prefix}}-rule-num`);

  const hasLen = val.length >= 8;
  const hasUpper = /[A-Z]/.test(val);
  const hasLower = /[a-z]/.test(val);
  const hasNum = /[0-9]/.test(val);

  if (ruleLen) ruleLen.className = 'tt-pwd-rule ' + (hasLen ? 'valid' : 'invalid');
  if (ruleUpper) ruleUpper.className = 'tt-pwd-rule ' + (hasUpper ? 'valid' : 'invalid');
  if (ruleLower) ruleLower.className = 'tt-pwd-rule ' + (hasLower ? 'valid' : 'invalid');
  if (ruleNum) ruleNum.className = 'tt-pwd-rule ' + (hasNum ? 'valid' : 'invalid');

  let score = 0;
  if (hasLen) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNum) score++;

  if (!meterBar || !meterText) return;
  if (!val) {{
    meterBar.style.width = '0%';
    meterBar.className = 'tt-pwd-meter-bar';
    meterText.textContent = 'Password strength';
    meterText.style.color = 'var(--muted)';
  }} else if (score <= 2) {{
    meterBar.style.width = '33%';
    meterBar.className = 'tt-pwd-meter-bar weak';
    meterText.textContent = 'Weak';
    meterText.style.color = '#b42318';
  }} else if (score === 3) {{
    meterBar.style.width = '66%';
    meterBar.className = 'tt-pwd-meter-bar ok';
    meterText.textContent = 'Medium';
    meterText.style.color = 'var(--gold)';
  }} else {{
    meterBar.style.width = '100%';
    meterBar.className = 'tt-pwd-meter-bar strong';
    meterText.textContent = 'Strong';
    meterText.style.color = '#3c6a42';
  }}
}}

function checkPwdMatch(pwdId, confirmId, indicatorId) {{
  const pwd = document.getElementById(pwdId)?.value || '';
  const confirm = document.getElementById(confirmId)?.value || '';
  const indicator = document.getElementById(indicatorId);
  if (!indicator) return;

  if (!confirm) {{
    indicator.style.display = 'none';
  }} else if (pwd === confirm) {{
    indicator.style.display = 'block';
    indicator.textContent = 'Passwords match';
    indicator.style.color = '#3c6a42';
  }} else {{
    indicator.style.display = 'block';
    indicator.textContent = 'Passwords do not match';
    indicator.style.color = '#b42318';
  }}
}}

function togglePasswordVisibility(inputId) {{
  const input = document.getElementById(inputId);
  if (!input) return;
  const btn = event.currentTarget;
  if (input.type === 'password') {{
    input.type = 'text';
    if (btn) btn.textContent = 'Hide';
  }} else {{
    input.type = 'password';
    if (btn) btn.textContent = 'Show';
  }}
}}
  </script>
</body>
</html>"""

    out_path = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo', 'register.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Built register.html successfully!")

if __name__ == '__main__':
    build_register()
