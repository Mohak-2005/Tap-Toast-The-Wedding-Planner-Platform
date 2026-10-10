# Standalone login.html Builder for Tap & Toast
import os
from data_template import SEED_STATE
from shared_css import get_shared_css
from shared_js import get_shared_js
from auth_component import get_auth_css

def build_login():
    shared_css = get_shared_css()
    shared_js = get_shared_js()
    auth_css = get_auth_css()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In | Tap &amp; Toast</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
{shared_css}
{auth_css}

/* Dedicated Standalone Page Styles */
body {{
  background: var(--cream);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}}

.tt-login-page-container {{
  display: grid;
  grid-template-columns: 45% 55%;
  flex: 1;
  min-height: calc(100vh - 42px);
}}

@media (max-width: 900px) {{
  .tt-login-page-container {{
    grid-template-columns: 1fr;
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
      <a href="login.html" class="tt-demobar-link active">Sign In</a>
      <a href="register.html" class="tt-demobar-link">Register</a>
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
  <div class="tt-login-page-container">
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

        <!-- ALREADY SIGNED IN VIEW -->
        <div id="tt-already-signed-in-view" style="display:none;text-align:center;">
          <div style="font-size:38px;margin-bottom:12px;">👋</div>
          <h2 class="tt-auth-title" style="font-size:24px;">Welcome back</h2>
          <p class="tt-auth-sub" style="margin-bottom:20px;">
            You're currently signed in as <strong id="already-signed-in-name" style="color:var(--ink);">User</strong> (<span id="already-signed-in-role" style="color:var(--gold);font-weight:600;">MC</span>).
          </p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <button type="button" class="tt-auth-btn-primary" onclick="continueToDashboard()">
              Continue to Dashboard &rarr;
            </button>
            <button type="button" class="btn btn-outline btn-block" onclick="signOutToForm()" style="padding:11px;">
              Sign out &bull; Switch Account
            </button>
          </div>
        </div>

        <!-- SIGN IN VIEW -->
        <div id="tt-signin-view">
          <!-- Role Tabs -->
          <div class="tt-auth-role-tabs">
            <button type="button" class="tt-role-tab active" data-role="mc" onclick="selectAuthRole('mc')">MC / Pro</button>
            <button type="button" class="tt-role-tab" data-role="couple" onclick="selectAuthRole('couple')">Couple</button>
            <button type="button" class="tt-role-tab" data-role="superadmin" onclick="selectAuthRole('superadmin')">Super Admin</button>
          </div>

          <h2 class="tt-auth-title" id="tt-signin-headline">Sign in to your MC / Pro account</h2>
          <p class="tt-auth-sub" id="tt-signin-subline">Enter your credentials below to access your dashboard.</p>

          <!-- Lockout Message -->
          <div id="login-lockout-msg" class="tt-inline-lockout" style="display:none;">
            Too many attempts. Try again in <span id="lockout-timer">30</span>s
          </div>

          <!-- Inline Error Message -->
          <div id="login-error-msg" class="tt-inline-error" style="display:none;">
            <span id="login-error-text">That email and password don't match</span>
            <button type="button" id="login-switch-tab-btn" class="btn btn-outline btn-xs" style="display:none;background:#ffffff;color:#b42318;border-color:#b42318;padding:2px 8px;margin-left:8px;" onclick="switchTabFromError()">Switch Tab</button>
          </div>

          <!-- Sign In Form -->
          <form id="tt-signin-form" onsubmit="event.preventDefault(); handleLoginSubmit();">
            <div class="tt-form-group">
              <label class="tt-form-label" for="login-email">EMAIL ADDRESS</label>
              <input class="tt-form-input" id="login-email" type="email" autocomplete="email" placeholder="name@example.com" required />
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="login-password">PASSWORD</label>
              <div class="tt-pwd-wrapper">
                <input class="tt-form-input" id="login-password" type="password" autocomplete="current-password" placeholder="••••••••" required />
                <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('login-password')">Show</button>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 20px;">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--muted);user-select:none;">
                <input type="checkbox" id="login-remember" checked /> Keep me signed in
              </label>
              <button type="button" class="tt-link-btn" onclick="openForgotPasswordModal()">Forgot password?</button>
            </div>

            <button type="submit" id="login-submit-btn" class="tt-auth-btn-primary">
              <span id="login-btn-text">Sign In &rarr;</span>
              <span id="login-btn-spinner" class="tt-spinner" style="display:none;"></span>
            </button>
          </form>

          <!-- Demo Accounts Panel -->
          <details class="tt-demo-accounts-details" open>
            <summary class="tt-demo-accounts-summary">Demo Accounts (1-Click Fill)</summary>
            <div style="margin-top:8px;">
              <div class="tt-demo-acc-card">
                <div>
                  <strong>Robert Galati</strong> (MC / Pro)
                  <div class="tt-acc-sub">robert@galati.demo &bull; Demo1234!</div>
                </div>
                <button type="button" class="btn btn-outline btn-xs" onclick="fillDemoCredentials('robert@galati.demo', 'Demo1234!', 'mc')">Use</button>
              </div>
              <div class="tt-demo-acc-card">
                <div>
                  <strong>Sophie &amp; James</strong> (Couple)
                  <div class="tt-acc-sub">sophie.james@demo.test &bull; Demo1234!</div>
                </div>
                <button type="button" class="btn btn-outline btn-xs" onclick="fillDemoCredentials('sophie.james@demo.test', 'Demo1234!', 'couple')">Use</button>
              </div>
              <div class="tt-demo-acc-card">
                <div>
                  <strong>Platform Admin</strong> (Super Admin)
                  <div class="tt-acc-sub">admin@tapandtoast.demo &bull; Demo1234!</div>
                </div>
                <button type="button" class="btn btn-outline btn-xs" onclick="fillDemoCredentials('admin@tapandtoast.demo', 'Demo1234!', 'superadmin')">Use</button>
              </div>
            </div>
          </details>

          <!-- Footer Links -->
          <div style="margin-top:22px;text-align:center;font-size:13px;color:var(--muted);line-height:1.6;">
            <div style="margin-top:8px;">New here? <a href="register.html" style="color:var(--gold);font-weight:600;text-decoration:underline;">Create an account</a></div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- FORGOT PASSWORD MODAL (3 STEPS) -->
  <div id="forgot-pwd-modal" class="tt-modal-backdrop" style="display:none;" onclick="if(event.target===this)closeForgotPasswordModal()">
    <div class="tt-modal-dialog">
      <div class="tt-modal-header">
        <h3 class="tt-modal-title">Reset Your Password</h3>
        <button type="button" class="tt-modal-close" onclick="closeForgotPasswordModal()" aria-label="Close modal">&times;</button>
      </div>

      <!-- Step 1: Request -->
      <div id="forgot-step-1" class="tt-modal-body">
        <p style="font-size:13.5px;color:var(--muted);margin-bottom:16px;">
          Enter the email address associated with your account and we will send you a password reset link.
        </p>
        <div class="tt-form-group">
          <label class="tt-form-label" for="forgot-input-email">EMAIL ADDRESS</label>
          <input class="tt-form-input" id="forgot-input-email" type="email" placeholder="name@example.com" required />
        </div>
        <div id="forgot-step-1-err" class="tt-inline-error" style="display:none;margin-top:10px;"></div>
        <button type="button" class="tt-auth-btn-primary" style="margin-top:16px;" onclick="submitForgotStep1()">
          Send Reset Link &rarr;
        </button>
      </div>

      <!-- Step 2: Simulated Email Sent -->
      <div id="forgot-step-2" class="tt-modal-body" style="display:none;text-align:center;">
        <div style="font-size:36px;margin-bottom:12px;">✉️</div>
        <h4 style="font-family:var(--font-heading);font-size:18px;margin-bottom:8px;">Reset Link Sent</h4>
        <p style="font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.5;">
          If that email exists in our system, we have sent a secure password reset link to <strong id="forgot-email-sent-display" style="color:var(--ink);"></strong>.
        </p>
        <div style="background:#fcf8f2;border:1px dashed var(--gold);padding:14px;border-radius:6px;margin-bottom:20px;text-align:left;">
          <div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:4px;">Demo Simulation</div>
          <div style="font-size:12.5px;color:var(--muted);">In production, you would click the link received via email. For this demo, click below to open the reset form.</div>
        </div>
        <button type="button" class="tt-auth-btn-primary" onclick="submitForgotStep2()">
          Simulate Opening the Email &rarr;
        </button>
      </div>

      <!-- Step 3: New Password Form -->
      <div id="forgot-step-3" class="tt-modal-body" style="display:none;">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">
          Create a new password for <strong id="forgot-email-resetting-display" style="color:var(--ink);"></strong>.
        </p>
        <div class="tt-form-group">
          <label class="tt-form-label" for="forgot-new-pwd">NEW PASSWORD</label>
          <div class="tt-pwd-wrapper">
            <input class="tt-form-input" id="forgot-new-pwd" type="password" placeholder="New password" required oninput="updateLivePwdStrength(this.value, 'forgot')" />
            <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('forgot-new-pwd')">Show</button>
          </div>
          <div class="tt-pwd-meter">
            <div class="tt-pwd-meter-bar" id="reg-forgot-meter-bar"></div>
          </div>
          <span class="tt-pwd-meter-text" id="reg-forgot-meter-text" style="color:var(--muted);">Password strength</span>
          <ul class="tt-pwd-checklist">
            <li id="reg-forgot-rule-len" class="tt-pwd-rule">&#8226; 8+ characters</li>
            <li id="reg-forgot-rule-upper" class="tt-pwd-rule">&#8226; Uppercase letter</li>
            <li id="reg-forgot-rule-lower" class="tt-pwd-rule">&#8226; Lowercase letter</li>
            <li id="reg-forgot-rule-num" class="tt-pwd-rule">&#8226; Number</li>
          </ul>
        </div>

        <div class="tt-form-group">
          <label class="tt-form-label" for="forgot-confirm-pwd">CONFIRM NEW PASSWORD</label>
          <div class="tt-pwd-wrapper">
            <input class="tt-form-input" id="forgot-confirm-pwd" type="password" placeholder="Confirm new password" required oninput="checkPwdMatch('forgot-new-pwd', 'forgot-confirm-pwd', 'forgot-match-indicator')" />
            <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('forgot-confirm-pwd')">Show</button>
          </div>
          <div id="forgot-match-indicator" class="tt-pwd-match" style="display:none;"></div>
        </div>

        <div id="forgot-step-3-err" class="tt-inline-error" style="display:none;"></div>

        <button type="button" class="tt-auth-btn-primary" onclick="submitForgotStep3()">
          Save New Password &rarr;
        </button>
      </div>
    </div>
  </div>

  <script>
{shared_js}

let activeAuthRole = 'mc';
let failedLoginAttempts = 0;
let lockoutTimerInterval = null;
let suggestedTargetRole = null;
let forgotTargetEmail = '';

document.addEventListener('DOMContentLoaded', () => {{
  initLoginPage();
}});

function initLoginPage() {{
  const urlParams = new URLSearchParams(window.location.search);
  const nextParam = urlParams.get('next');
  const expiredParam = urlParams.get('expired');
  const mismatchParam = urlParams.get('role_mismatch');
  const switchParam = urlParams.get('switch');

  // Handle expiration message
  if (expiredParam === '1') {{
    showAuthError("You were signed out. Please sign in again.");
  }}

  // Handle role mismatch message
  if (mismatchParam) {{
    const roleNames = {{ mc: 'MC / Pro', couple: 'Couple', superadmin: 'Super Admin' }};
    const targetName = roleNames[mismatchParam] || mismatchParam;
    showAuthError(`This area is for ${{targetName}} accounts. Please sign in below.`);
    selectAuthRole(mismatchParam);
  }} else if (nextParam) {{
    if (nextParam.includes('couple')) selectAuthRole('couple');
    else if (nextParam.includes('superadmin')) selectAuthRole('superadmin');
    else if (nextParam.includes('mc')) selectAuthRole('mc');
  }}

  // Check existing session
  const session = getSession();
  if (session && !session.expired && !mismatchParam && !switchParam) {{
    const alreadyView = document.getElementById('tt-already-signed-in-view');
    const signinView = document.getElementById('tt-signin-view');
    const nameEl = document.getElementById('already-signed-in-name');
    const roleEl = document.getElementById('already-signed-in-role');

    if (alreadyView && signinView) {{
      alreadyView.style.display = 'block';
      signinView.style.display = 'none';
      if (nameEl) nameEl.textContent = session.name || 'User';
      if (roleEl) {{
        const roleLabels = {{ mc: 'MC / Pro', couple: 'Couple', superadmin: 'Super Admin' }};
        roleEl.textContent = roleLabels[session.role] || session.role;
      }}
    }}
  }}
}}

function continueToDashboard() {{
  const session = getSession();
  const urlParams = new URLSearchParams(window.location.search);
  const nextParam = urlParams.get('next');
  if (nextParam && isNextValidForRole(nextParam, session ? session.role : '')) {{
    window.location.href = nextParam;
    return;
  }}
  if (!session) {{
    signOutToForm();
    return;
  }}
  if (session.role === 'mc') window.location.href = 'mc.html';
  else if (session.role === 'couple') window.location.href = 'couple.html';
  else if (session.role === 'superadmin') window.location.href = 'superadmin.html';
  else window.location.href = 'mc.html';
}}

function signOutToForm() {{
  clearSession();
  const alreadyView = document.getElementById('tt-already-signed-in-view');
  const signinView = document.getElementById('tt-signin-view');
  if (alreadyView) alreadyView.style.display = 'none';
  if (signinView) signinView.style.display = 'block';
  showToast('Signed out', 'info');
}}

function selectAuthRole(role) {{
  activeAuthRole = role;
  const tabs = document.querySelectorAll('.tt-role-tab');
  tabs.forEach(tab => {{
    if (tab.getAttribute('data-role') === role) {{
      tab.classList.add('active');
    }} else {{
      tab.classList.remove('active');
    }}
  }});

  const headline = document.getElementById('tt-signin-headline');
  const roleDisplayNames = {{
    mc: 'MC / Pro',
    couple: 'Couple',
    superadmin: 'Super Admin'
  }};
  if (headline) {{
    headline.textContent = `Sign in to your ${{roleDisplayNames[role] || 'account'}} account`;
  }}
}}

function fillDemoCredentials(email, pwd, role) {{
  selectAuthRole(role);
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  if (emailInput) emailInput.value = email;
  if (pwdInput) pwdInput.value = pwd;
  hideAuthError();
}}

function handleLoginSubmit() {{
  if (failedLoginAttempts >= 5) {{
    showToast('Login locked. Please wait for countdown.', 'error');
    return;
  }}

  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  const rememberInput = document.getElementById('login-remember');
  const submitBtn = document.getElementById('login-submit-btn');
  const btnText = document.getElementById('login-btn-text');
  const btnSpinner = document.getElementById('login-btn-spinner');

  const email = emailInput ? emailInput.value.trim() : '';
  const pwd = pwdInput ? pwdInput.value : '';
  const keepSignedIn = rememberInput ? rememberInput.checked : true;

  // Design demo mode: whatever email, username or password is typed logs the user in immediately!
  const state = loadState();
  const users = state.users || [];

  let role = activeAuthRole || 'mc';
  let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  let userName = '';
  let tenantId = null;
  let weddingId = null;

  if (role === 'mc') {{
    userName = matchedUser ? matchedUser.name : (email ? (email.split('@')[0]) : 'Robert Galati');
    tenantId = (matchedUser && matchedUser.tenantId) ? matchedUser.tenantId : 'ten1';
  }} else if (role === 'couple') {{
    userName = matchedUser ? matchedUser.name : 'Sophie & James';
    weddingId = (matchedUser && matchedUser.weddingId) ? matchedUser.weddingId : 'w1';
  }} else if (role === 'superadmin') {{
    userName = matchedUser ? matchedUser.name : 'Platform Admin';
  }} else {{
    role = 'mc';
    userName = 'Robert Galati';
    tenantId = 'ten1';
  }}

  hideAuthError();
  failedLoginAttempts = 0;

  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  setTimeout(() => {{
    const sessionData = {{
      role: role,
      email: email || (role === 'mc' ? 'robert@galati.demo' : role === 'couple' ? 'sophie.james@demo.test' : 'admin@tapandtoast.demo'),
      name: userName,
      tenantId: tenantId,
      weddingId: weddingId,
      keepSignedIn: keepSignedIn,
      at: Date.now()
    }};
    setSession(sessionData);
    logAudit('User signed in: ' + sessionData.email, sessionData.name, 'Successful sign in', 'Security');
    showToast('Signed in as ' + sessionData.name, 'success');

    const urlParams = new URLSearchParams(window.location.search);
    const nextParam = urlParams.get('next');
    if (nextParam && isNextValidForRole(nextParam, role)) {{
      window.location.href = nextParam;
    }} else {{
      if (role === 'mc') window.location.href = 'mc.html';
      else if (role === 'couple') window.location.href = 'couple.html';
      else if (role === 'superadmin') window.location.href = 'superadmin.html';
      else window.location.href = 'mc.html';
    }}
  }}, 400);
}}

function isNextValidForRole(nextUrl, role) {{
  if (!nextUrl) return false;
  const target = nextUrl.toLowerCase();
  if (role === 'mc' && target.includes('mc.html')) return true;
  if (role === 'couple' && target.includes('couple.html')) return true;
  if (role === 'superadmin' && (target.includes('superadmin.html') || target.includes('mc.html'))) return true;
  return false;
}}

function showAuthError(msg, showSwitchBtn = false) {{
  const errBox = document.getElementById('login-error-msg');
  const errText = document.getElementById('login-error-text');
  const switchBtn = document.getElementById('login-switch-tab-btn');
  if (errText) errText.textContent = msg;
  if (switchBtn) switchBtn.style.display = showSwitchBtn ? 'inline-block' : 'none';
  if (errBox) errBox.style.display = 'flex';
}}

function hideAuthError() {{
  const errBox = document.getElementById('login-error-msg');
  if (errBox) errBox.style.display = 'none';
}}

function switchTabFromError() {{
  if (suggestedTargetRole) {{
    selectAuthRole(suggestedTargetRole);
    hideAuthError();
    const pwdInput = document.getElementById('login-password');
    if (pwdInput) pwdInput.focus();
  }}
}}

function shakeLoginForm() {{
  const card = document.querySelector('.tt-auth-card');
  if (card) {{
    card.classList.remove('tt-shake');
    void card.offsetWidth;
    card.classList.add('tt-shake');
  }}
}}

function triggerLockoutCountdown() {{
  const lockoutBox = document.getElementById('login-lockout-msg');
  const timerSpan = document.getElementById('lockout-timer');
  const submitBtn = document.getElementById('login-submit-btn');
  hideAuthError();

  if (lockoutBox) lockoutBox.style.display = 'block';
  if (submitBtn) submitBtn.disabled = true;

  let seconds = 30;
  if (timerSpan) timerSpan.textContent = seconds;

  if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
  lockoutTimerInterval = setInterval(() => {{
    seconds--;
    if (timerSpan) timerSpan.textContent = seconds;
    if (seconds <= 0) {{
      clearInterval(lockoutTimerInterval);
      failedLoginAttempts = 0;
      if (lockoutBox) lockoutBox.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }}
  }}, 1000);
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

/* Forgot Password Modal Logic */
function openForgotPasswordModal() {{
  const modal = document.getElementById('forgot-pwd-modal');
  const step1 = document.getElementById('forgot-step-1');
  const step2 = document.getElementById('forgot-step-2');
  const step3 = document.getElementById('forgot-step-3');
  const err = document.getElementById('forgot-step-1-err');
  const emailInput = document.getElementById('forgot-input-email');
  const currentEmail = document.getElementById('login-email');

  if (emailInput && currentEmail && currentEmail.value) {{
    emailInput.value = currentEmail.value;
  }}
  if (err) err.style.display = 'none';
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'none';
  if (modal) modal.style.display = 'flex';
}}

function closeForgotPasswordModal() {{
  const modal = document.getElementById('forgot-pwd-modal');
  if (modal) modal.style.display = 'none';
}}

function submitForgotStep1() {{
  const emailInput = document.getElementById('forgot-input-email');
  const err = document.getElementById('forgot-step-1-err');
  const email = emailInput ? emailInput.value.trim() : '';

  if (!email || !email.includes('@') || !email.includes('.')) {{
    if (err) {{
      err.textContent = 'Please enter a valid email address.';
      err.style.display = 'block';
    }}
    return;
  }}

  forgotTargetEmail = email;
  const step1 = document.getElementById('forgot-step-1');
  const step2 = document.getElementById('forgot-step-2');
  const display = document.getElementById('forgot-email-sent-display');
  if (display) display.textContent = email;
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'block';
}}

function submitForgotStep2() {{
  const step2 = document.getElementById('forgot-step-2');
  const step3 = document.getElementById('forgot-step-3');
  const display = document.getElementById('forgot-email-resetting-display');
  if (display) display.textContent = forgotTargetEmail;
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'block';
}}

function submitForgotStep3() {{
  const newPwd = document.getElementById('forgot-new-pwd').value;
  const confirmPwd = document.getElementById('forgot-confirm-pwd').value;
  const err = document.getElementById('forgot-step-3-err');

  if (newPwd !== confirmPwd) {{
    if (err) {{
      err.textContent = 'Passwords do not match.';
      err.style.display = 'block';
    }}
    return;
  }}

  if (newPwd.length < 8) {{
    if (err) {{
      err.textContent = 'Password must be at least 8 characters long.';
      err.style.display = 'block';
    }}
    return;
  }}

  const state = loadState();
  const users = state.users || [];
  const user = users.find(u => u.email.toLowerCase() === forgotTargetEmail.toLowerCase());

  if (user) {{
    user.passwordHash = hashDemoPassword(newPwd);
    logAudit('Password reset: ' + user.email, user.name, 'Password updated via reset link', 'Security');
    saveState(state);
  }} else {{
    // Create or add user with new password
    users.push({{
      id: 'u_' + Date.now(),
      email: forgotTargetEmail,
      passwordHash: hashDemoPassword(newPwd),
      name: 'User (' + forgotTargetEmail + ')',
      role: activeAuthRole
    }});
    state.users = users;
    logAudit('Password reset: ' + forgotTargetEmail, forgotTargetEmail, 'New user password set', 'Security');
    saveState(state);
  }}

  closeForgotPasswordModal();
  const loginEmail = document.getElementById('login-email');
  const loginPwd = document.getElementById('login-password');
  if (loginEmail) loginEmail.value = forgotTargetEmail;
  if (loginPwd) {{
    loginPwd.value = '';
    loginPwd.focus();
  }}
  showToast('Password updated. Please sign in.', 'success');
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
  </script>
</body>
</html>"""

    out_path = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo', 'login.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Built login.html successfully!")

if __name__ == '__main__':
    build_login()
