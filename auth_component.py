# Auth Component for Tap & Toast (Embedded into couple.html, mc.html, superadmin.html)

def get_auth_css():
    return """
/* Embedded Auth Component Styles */
#tt-auth-overlay {
  display: none;
  min-height: calc(100vh - 42px);
  width: 100%;
  background: var(--cream);
  grid-template-columns: 45% 55%;
  position: relative;
  z-index: 100;
}

.tt-auth-hero {
  background: #15110e;
  color: #f8f6f2;
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid #29211a;
  position: relative;
}

.tt-auth-brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.tt-auth-logo-box {
  width: 42px;
  height: 42px;
  border: 1.5px solid var(--gold);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
}

.tt-auth-brand-name {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.tt-auth-hero-arch {
  margin: 16px 0 20px;
}

.tt-auth-hero-title {
  font-family: var(--font-heading);
  font-size: 34px;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 12px;
  max-width: 420px;
}

.tt-auth-hero-subline {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 28px;
}

.tt-auth-hero-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 360px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tt-auth-hero-bullets li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: #c9bbae;
  line-height: 1.4;
}

.tt-auth-hero-bullet-icon {
  color: var(--gold);
  font-weight: 700;
}

/* Right Form Container */
.tt-auth-form-wrap {
  background: var(--cream);
  padding: 48px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.tt-auth-card {
  background: #ffffff;
  border: 1px solid var(--line);
  border-top: 3px solid var(--gold);
  border-radius: 8px;
  width: 100%;
  max-width: 480px;
  padding: 36px 36px 30px;
  box-shadow: var(--shadow-md);
  position: relative;
}

.tt-auth-role-tabs {
  display: flex;
  gap: 6px;
  background: #f0ebe3;
  padding: 4px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.tt-role-tab {
  flex: 1;
  padding: 9px 8px;
  font-size: 12.5px;
  font-weight: 700;
  text-align: center;
  border-radius: 4px;
  color: var(--muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.18s ease;
}

.tt-role-tab:hover {
  color: var(--ink);
}

.tt-role-tab.active {
  background: var(--gold);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(189, 150, 97, 0.35);
}

.tt-auth-title {
  font-family: var(--font-heading);
  font-size: 26px;
  color: var(--ink);
  margin-bottom: 6px;
  line-height: 1.2;
}

.tt-auth-sub {
  font-size: 13.5px;
  color: var(--muted);
  margin-bottom: 22px;
}

.tt-form-group {
  margin-bottom: 18px;
  text-align: left;
}

.tt-form-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 6px;
}

.tt-form-input {
  width: 100%;
  padding: 11px 14px;
  font-size: 14px;
  font-family: var(--font-body);
  border: 1px solid var(--line);
  border-radius: 4px;
  background: #ffffff;
  color: var(--ink);
  transition: all 0.15s ease;
}

.tt-form-input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(189, 150, 97, 0.2);
}

.tt-pwd-wrapper {
  position: relative;
  width: 100%;
}

.tt-pwd-wrapper input {
  padding-right: 60px;
}

.tt-pwd-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--gold);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
}

.tt-pwd-toggle:hover {
  color: var(--gold-hover);
}

.tt-auth-btn-primary {
  width: 100%;
  padding: 13px 18px;
  background: #15110e;
  color: #dfc194;
  border: 1px solid #2d241c;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tt-auth-btn-primary:hover:not(:disabled) {
  background: #241c16;
  color: #ffffff;
}

.tt-auth-btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.tt-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(223, 193, 148, 0.3);
  border-top-color: #dfc194;
  border-radius: 50%;
  animation: tt-spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes tt-spin {
  to { transform: rotate(360deg); }
}

@keyframes tt-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.tt-shake {
  animation: tt-shake 0.4s ease;
  border-color: #b42318 !important;
}

.tt-inline-error {
  background: #fef3f2;
  border: 1px solid #fecdca;
  color: #b42318;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tt-inline-lockout {
  background: #fef3f2;
  border: 1px solid #fecdca;
  color: #b42318;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.tt-link-btn {
  background: none;
  border: none;
  color: var(--gold);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tt-link-btn:hover {
  color: var(--gold-hover);
}

.tt-demo-accounts-details {
  margin-top: 24px;
  border: 1px dashed #d5c7b5;
  border-radius: 6px;
  padding: 10px 14px;
  background: #faf8f5;
}

.tt-demo-accounts-summary {
  font-size: 12px;
  font-weight: 700;
  color: #766352;
  cursor: pointer;
  user-select: none;
}

.tt-demo-acc-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ede7df;
  font-size: 12px;
}

.tt-demo-acc-card:last-child {
  border-bottom: none;
}

.tt-acc-sub {
  font-size: 11px;
  color: #8c7b6c;
  margin-top: 1px;
}

/* Password Strength & Checklist */
.tt-pwd-meter {
  height: 4px;
  width: 100%;
  background: #e8ded0;
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.tt-pwd-meter-bar {
  height: 100%;
  width: 0%;
  transition: width 0.25s ease, background-color 0.25s ease;
}

.tt-pwd-meter-text {
  font-size: 11.5px;
  font-weight: 700;
  margin-top: 4px;
  display: block;
}

.tt-pwd-checklist {
  list-style: none;
  margin-top: 8px;
  padding: 0;
  font-size: 11.5px;
  color: var(--muted);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.tt-pwd-rule.valid {
  color: #2e6930;
  font-weight: 600;
}

.tt-pwd-match {
  font-size: 11.5px;
  font-weight: 600;
  margin-top: 4px;
}

/* Gold info strip for invite code */
.tt-gold-info-strip {
  background: #fcf6ec;
  border: 1px solid #e8cfa7;
  border-left: 3px solid var(--gold);
  border-radius: 4px;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #6a4f28;
  margin: 12px 0 16px;
  line-height: 1.45;
}

/* Segmented mode toggle (Register) */
.tt-reg-mode-toggle {
  display: flex;
  border: 1px solid var(--line);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.tt-reg-mode-btn {
  flex: 1;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  background: #faf8f5;
  color: var(--muted);
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tt-reg-mode-btn.active {
  background: #15110e;
  color: #f8f6f2;
}

/* Plan selector cards */
.tt-plan-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.tt-plan-card {
  border: 1.5px solid var(--line);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  background: #faf8f5;
  transition: all 0.15s ease;
  position: relative;
}

.tt-plan-card.active {
  border-color: var(--gold);
  background: #fffdf9;
  box-shadow: 0 2px 8px rgba(189, 150, 97, 0.15);
}

.tt-plan-card-title {
  font-weight: 700;
  font-size: 13px;
  color: var(--ink);
}

.tt-plan-card-price {
  font-size: 15px;
  font-weight: 700;
  color: var(--gold);
  margin: 3px 0;
}

.tt-plan-card-sub {
  font-size: 10.5px;
  color: var(--muted);
}

/* Impersonation Banner */
#impersonation-banner {
  background: #bd9661;
  color: #15110e;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #9c7b4f;
  position: sticky;
  top: 41px;
  z-index: 999;
}

/* Responsive auth layout */
@media (max-width: 860px) {
  #tt-auth-overlay {
    grid-template-columns: 1fr;
  }
  .tt-auth-hero {
    padding: 28px 20px 24px;
    border-right: none;
    border-bottom: 1px solid #29211a;
  }
  .tt-auth-hero-arch {
    display: none;
  }
  .tt-auth-hero-title {
    font-size: 24px;
    margin-bottom: 6px;
  }
  .tt-auth-hero-subline {
    margin-bottom: 0;
  }
  .tt-auth-hero-bullets {
    display: none;
  }
  .tt-auth-form-wrap {
    padding: 28px 16px;
  }
  .tt-auth-card {
    padding: 24px 20px;
  }
}

/* Couple Registration Slideshow / Wizard */
.tt-wizard-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 24px;
  padding: 0 10px;
}

.tt-wizard-nav-line {
  position: absolute;
  top: 16px;
  left: 36px;
  right: 36px;
  height: 2px;
  background: #e5dacd;
  z-index: 1;
}

.tt-wizard-nav-progress {
  position: absolute;
  top: 16px;
  left: 36px;
  width: 0%;
  max-width: calc(100% - 72px);
  height: 2px;
  background: var(--gold);
  z-index: 2;
  transition: width 0.3s ease;
}

.tt-wizard-step-node {
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
}

.tt-wizard-step-circle {
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
}

.tt-wizard-step-node.active .tt-wizard-step-circle {
  border-color: var(--gold);
  background: #15110e;
  color: #f7eedf;
  box-shadow: 0 0 0 3px rgba(189, 150, 97, 0.25);
}

.tt-wizard-step-node.completed .tt-wizard-step-circle {
  border-color: var(--gold);
  background: var(--gold);
  color: #ffffff;
}

.tt-wizard-step-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
  transition: color 0.25s ease;
}

.tt-wizard-step-node.active .tt-wizard-step-label {
  color: var(--ink);
  font-weight: 700;
}

.tt-wizard-step-node.completed .tt-wizard-step-label {
  color: var(--gold);
}

.tt-couple-slide {
  display: none;
}

.tt-couple-slide.active {
  display: block;
  animation: slideFadeIn 0.25s ease-out;
}
"""

def get_auth_html(current_page_role):
    # current_page_role: 'mc', 'couple', or 'superadmin'
    return f"""
<!-- AUTHENTICATION OVERLAY & EMBEDDED MODALS -->
<div id="tt-auth-overlay" style="display:none;" data-default-role="{current_page_role}">
  <!-- Left Hero Panel (45% on desktop, collapsed on mobile) -->
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

      <!-- WRONG ROLE VIEW (when signed in under wrong role) -->
      <div id="tt-wrong-role-view" style="display:none;text-align:center;">
        <div style="font-size:38px;margin-bottom:12px;">🔒</div>
        <h2 class="tt-auth-title" style="font-size:24px;">Switch Demo Persona</h2>
        <p class="tt-auth-sub" id="tt-wrong-role-msg" style="margin-bottom:20px;">
          This area is for authorized accounts.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button type="button" class="tt-auth-btn-primary" style="background:var(--gold);color:#15110e;font-weight:700;" onclick="quickDemoLogin('{current_page_role}')">
            ✨ Switch to {'Couple' if current_page_role == 'couple' else ('MC / Pro' if current_page_role == 'mc' else 'Super Admin')} Demo Account &rarr;
          </button>
          <button type="button" id="tt-wrong-role-switch-btn" class="btn btn-outline btn-block" onclick="goToUserRoleAccount()" style="padding:10px;">
            Return to current account &rarr;
          </button>
          <button type="button" class="btn btn-outline btn-block" onclick="handleLogout()" style="padding:10px;color:#991b1b;border-color:#fca5a5;">
            Sign out of this session
          </button>
        </div>
      </div>

      <!-- SIGN IN VIEW -->
      <div id="tt-signin-view">
        <!-- Role Tabs -->
        <div class="tt-auth-role-tabs">
          <button type="button" class="tt-role-tab {'active' if current_page_role == 'mc' else ''}" data-role="mc" onclick="selectAuthRole('mc')">MC / Pro</button>
          <button type="button" class="tt-role-tab {'active' if current_page_role == 'couple' else ''}" data-role="couple" onclick="selectAuthRole('couple')">Couple</button>
          <button type="button" class="tt-role-tab {'active' if current_page_role == 'superadmin' else ''}" data-role="superadmin" onclick="selectAuthRole('superadmin')">Super Admin</button>
        </div>

        <!-- Quick 1-Click Instant Demo Login Banner -->
        <div style="background:#fcf8f2;border:1.5px solid #dfc3a3;border-radius:6px;padding:12px;margin-bottom:18px;text-align:center;">
          <div style="font-size:11px;font-weight:700;color:#7a5a35;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">✨ Client Demo Evaluation</div>
          <p style="font-size:12.5px;color:#5a4325;margin:0 0 10px;line-height:1.4;">Instant access with simulated wedding data:</p>
          <button type="button" class="tt-auth-btn-primary" onclick="quickDemoLogin(activeAuthRole || '{current_page_role}')" style="margin:0;font-size:13px;padding:9px 14px;font-weight:700;width:100%;">
            Instant 1-Click Sign In as {'Couple' if current_page_role == 'couple' else ('MC / Pro' if current_page_role == 'mc' else 'Super Admin')} &rarr;
          </button>
        </div>

        <h2 class="tt-auth-title" id="tt-signin-headline">Sign in to your account</h2>
        <p class="tt-auth-sub" id="tt-signin-subline">Enter your credentials below to access your dashboard.</p>

        <!-- Lockout Message -->
        <div id="login-lockout-msg" class="tt-inline-lockout" style="display:none;">
          Too many attempts. Try again in <span id="lockout-timer">30</span>s
        </div>

        <!-- Inline Error Message -->
        <div id="login-error-msg" class="tt-inline-error" style="display:none;">
          <span id="login-error-text">That email and password don't match</span>
          <button type="button" id="login-switch-tab-btn" class="btn btn-outline btn-xs" style="display:none;background:#ffffff;color:#b42318;border-color:#b42318;padding:2px 8px;" onclick="switchTabFromError()">Switch Tab</button>
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
          <summary class="tt-demo-accounts-summary">Demo Accounts (1-Click Fill &amp; Enter)</summary>
          <div style="margin-top:8px;">
            <div class="tt-demo-acc-card">
              <div>
                <strong>Robert Galati</strong> (MC / Pro)
                <div class="tt-acc-sub">robert@galati.demo &bull; Demo1234!</div>
              </div>
              <div style="display:flex;gap:4px;">
                <button type="button" class="btn btn-outline btn-xs" onclick="fillDemoCredentials('robert@galati.demo', 'Demo1234!', 'mc')">Fill</button>
                <button type="button" class="btn btn-gold btn-xs" onclick="quickDemoLogin('mc')" style="font-weight:700;">Enter &rarr;</button>
              </div>
            </div>
            <div class="tt-demo-acc-card">
              <div>
                <strong>Sophie &amp; James</strong> (Couple)
                <div class="tt-acc-sub">sophie.james@demo.test &bull; Demo1234!</div>
              </div>
              <div style="display:flex;gap:4px;">
                <button type="button" class="btn btn-outline btn-xs" onclick="fillDemoCredentials('sophie.james@demo.test', 'Demo1234!', 'couple')">Fill</button>
                <button type="button" class="btn btn-gold btn-xs" onclick="quickDemoLogin('couple')" style="font-weight:700;">Enter &rarr;</button>
              </div>
            </div>
            <div class="tt-demo-acc-card">
              <div>
                <strong>Platform Admin</strong> (Super Admin)
                <div class="tt-acc-sub">admin@tapandtoast.demo &bull; Demo1234!</div>
              </div>
              <div style="display:flex;gap:4px;">
                <button type="button" class="btn btn-outline btn-xs" onclick="fillDemoCredentials('admin@tapandtoast.demo', 'Demo1234!', 'superadmin')">Fill</button>
                <button type="button" class="btn btn-gold btn-xs" onclick="quickDemoLogin('superadmin')" style="font-weight:700;">Enter &rarr;</button>
              </div>
            </div>
          </div>
        </details>

        <!-- Footer Links -->
        <div style="margin-top:22px;text-align:center;font-size:13px;color:var(--muted);line-height:1.6;">
          <div>Guest? No account needed. <a href="guest-mobile.html" style="color:var(--gold);font-weight:600;text-decoration:underline;">Scan your QaRd</a>.</div>
          <div style="margin-top:8px;">New here? <button type="button" class="tt-link-btn" onclick="showRegisterView()">Create an account</button></div>
        </div>
      </div>

      <!-- REGISTER VIEW -->
      <div id="tt-register-view" style="display:none;">
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
              <li id="reg-mc-rule-len" class="tt-pwd-rule">○ 8+ characters</li>
              <li id="reg-mc-rule-upper" class="tt-pwd-rule">○ Uppercase letter</li>
              <li id="reg-mc-rule-lower" class="tt-pwd-rule">○ Lowercase letter</li>
              <li id="reg-mc-rule-num" class="tt-pwd-rule">○ Number</li>
            </ul>
          </div>

          <div class="tt-form-group">
            <label class="tt-form-label" for="reg-mc-confirm-pwd">CONFIRM PASSWORD</label>
            <div class="tt-pwd-wrapper">
              <input class="tt-form-input" id="reg-mc-confirm-pwd" type="password" autocomplete="new-password" placeholder="Confirm your password" required oninput="checkPwdMatch('reg-mc-pwd', 'reg-mc-confirm-pwd', 'reg-mc-match-indicator')" />
              <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('reg-mc-confirm-pwd')">Show</button>
            </div>
            <div id="reg-mc-match-indicator" class="tt-pwd-match" style="display:none;"></div>
          </div>

          <div style="margin:16px 0 20px;">
            <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;font-size:12.5px;color:var(--muted);line-height:1.4;">
              <input type="checkbox" id="reg-mc-terms" required checked style="margin-top:2px;" />
              <span>I agree to the Tap &amp; Toast Terms of Service and Privacy Policy.</span>
            </label>
          </div>

          <div id="reg-mc-error-msg" class="tt-inline-error" style="display:none;"></div>

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
              <label class="tt-form-label" for="reg-couple-code">INVITATION CODE <span style="color:var(--ink);">(REQUIRED)</span></label>
              <input class="tt-form-input" id="reg-couple-code" type="text" placeholder="e.g. SJ-2026" value="SJ-2026" required oninput="handleInviteCodeInput(this.value)" />
              <div id="reg-couple-code-err" class="tt-pwd-match" style="color:#b42318;margin-top:5px;display:none;"></div>
              <div id="reg-couple-code-success" class="tt-gold-info-strip" style="display:none;"></div>
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
                <li id="reg-couple-rule-len" class="tt-pwd-rule">○ 8+ characters</li>
                <li id="reg-couple-rule-upper" class="tt-pwd-rule">○ Uppercase letter</li>
                <li id="reg-couple-rule-lower" class="tt-pwd-rule">○ Lowercase letter</li>
                <li id="reg-couple-rule-num" class="tt-pwd-rule">○ Number</li>
              </ul>
            </div>

            <div class="tt-form-group">
              <label class="tt-form-label" for="reg-couple-confirm-pwd">CONFIRM PASSWORD</label>
              <div class="tt-pwd-wrapper">
                <input class="tt-form-input" id="reg-couple-confirm-pwd" type="password" autocomplete="new-password" placeholder="Confirm your password" value="Demo1234!" required oninput="checkPwdMatch('reg-couple-pwd', 'reg-couple-confirm-pwd', 'reg-couple-match-indicator')" />
                <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('reg-couple-confirm-pwd')">Show</button>
              </div>
              <div id="reg-couple-match-indicator" class="tt-pwd-match" style="display:none;"></div>
            </div>

            <div style="margin:16px 0 20px;">
              <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;font-size:12.5px;color:var(--muted);line-height:1.4;">
                <input type="checkbox" id="reg-couple-terms" required checked style="margin-top:2px;" />
                <span>I agree to the Tap &amp; Toast Terms of Service and Privacy Policy.</span>
              </label>
            </div>

            <div id="reg-couple-error-msg" class="tt-inline-error" style="display:none;"></div>

            <div style="display:flex;gap:12px;margin-top:20px;">
              <button type="button" class="btn btn-outline" style="flex:1;padding:12px;" onclick="goToCoupleSlide(2)">&larr; Back</button>
              <button type="submit" id="reg-couple-submit-btn" class="tt-auth-btn-primary" style="flex:2;">
                Register &rarr;
              </button>
            </div>
          </div>

        </form>

        <div style="margin-top:22px;text-align:center;font-size:13px;color:var(--muted);line-height:1.6;">
          <div>Already have an account? <button type="button" class="tt-link-btn" onclick="showLoginView()">Sign in</button></div>
          <div style="margin-top:8px;">Guest? No account needed. <a href="guest-mobile.html" style="color:var(--gold);font-weight:600;text-decoration:underline;">Scan your QaRd</a>.</div>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- 3-STEP FORGOT PASSWORD MODAL -->
<div id="forgot-pwd-modal" class="tt-modal-backdrop" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="forgot-modal-title">
  <div class="tt-modal" style="max-width:440px;">
    <div class="tt-modal-header">
      <h3 id="forgot-modal-title" style="font-family:var(--font-heading);font-size:22px;">Reset Password</h3>
      <button type="button" class="tt-modal-close" onclick="closeForgotPasswordModal()" aria-label="Close modal">&times;</button>
    </div>
    <div class="tt-modal-body" style="padding:24px;">

      <!-- STEP 1: Enter Email -->
      <div id="forgot-step-1">
        <p style="font-size:13.5px;color:var(--muted);margin-bottom:18px;">
          Enter the email address associated with your account, and we will generate a password reset link.
        </p>
        <div class="tt-form-group">
          <label class="tt-form-label" for="forgot-input-email">EMAIL ADDRESS</label>
          <input class="tt-form-input" id="forgot-input-email" type="email" placeholder="robert@galati.demo" required />
        </div>
        <div id="forgot-step-1-err" class="tt-inline-error" style="display:none;"></div>
        <button type="button" class="tt-auth-btn-primary" onclick="submitForgotStep1()">
          Send Reset Link &rarr;
        </button>
      </div>

      <!-- STEP 2: Link Sent / Simulation -->
      <div id="forgot-step-2" style="display:none;text-align:center;">
        <div style="font-size:36px;margin-bottom:10px;">✉️</div>
        <h4 style="font-family:var(--font-heading);font-size:20px;margin-bottom:8px;">Check Your Inbox</h4>
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">
          If that email exists in our records, we've sent a secure reset link to <strong id="forgot-email-sent-display" style="color:var(--ink);"></strong>.
        </p>
        <div style="background:#faf8f5;border:1px dashed #d5c7b5;border-radius:6px;padding:12px;margin-bottom:18px;font-size:12px;color:var(--muted);">
          In this interactive client demo, you can simulate opening the email reset link directly:
        </div>
        <button type="button" class="tt-auth-btn-primary" onclick="submitForgotStep2()">
          Simulate Opening Email Link &rarr;
        </button>
      </div>

      <!-- STEP 3: Set New Password -->
      <div id="forgot-step-3" style="display:none;">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">
          Create a new password for <strong id="forgot-email-resetting-display" style="color:var(--ink);"></strong>:
        </p>
        <div class="tt-form-group">
          <label class="tt-form-label" for="forgot-new-pwd">NEW PASSWORD</label>
          <div class="tt-pwd-wrapper">
            <input class="tt-form-input" id="forgot-new-pwd" type="password" placeholder="NewPass123!" required oninput="updateLivePwdStrength(this.value, 'forgot')" />
            <button type="button" class="tt-pwd-toggle" onclick="togglePasswordVisibility('forgot-new-pwd')">Show</button>
          </div>
          <div class="tt-pwd-meter">
            <div class="tt-pwd-meter-bar" id="reg-forgot-meter-bar"></div>
          </div>
          <span class="tt-pwd-meter-text" id="reg-forgot-meter-text" style="color:var(--muted);">Password strength</span>
          <ul class="tt-pwd-checklist">
            <li id="reg-forgot-rule-len" class="tt-pwd-rule">○ 8+ characters</li>
            <li id="reg-forgot-rule-upper" class="tt-pwd-rule">○ Uppercase letter</li>
            <li id="reg-forgot-rule-lower" class="tt-pwd-rule">○ Lowercase letter</li>
            <li id="reg-forgot-rule-num" class="tt-pwd-rule">○ Number</li>
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
</div>

<!-- 2-STEP WELCOME MODAL FOR MC REGISTRATION -->
<div id="mc-welcome-modal" class="tt-modal-backdrop" style="display:none;" role="dialog" aria-modal="true">
  <div class="tt-modal" style="max-width:440px;text-align:center;">
    <div class="tt-modal-body" style="padding:32px 28px;">
      <div style="font-size:42px;margin-bottom:12px;">🎉</div>
      <h3 style="font-family:var(--font-heading);font-size:24px;margin-bottom:8px;">Account Created!</h3>
      <p style="font-size:14px;color:var(--muted);margin-bottom:20px;" id="mc-welcome-text">
        Welcome to Tap &amp; Toast! Your 14-day Pro trial is active.
      </p>
      <div style="background:#fcf6ec;border:1px solid #e8cfa7;border-radius:6px;padding:12px;font-size:12.5px;color:#6a4f28;margin-bottom:24px;">
        Next step: Add your first wedding client and set up their live run sheet.
      </div>
      <button type="button" class="tt-auth-btn-primary" onclick="window.location.href='mc.html'">
        Add Your First Wedding &rarr;
      </button>
    </div>
  </div>
</div>
"""

def get_auth_js(current_page_role):
    return f"""
/* Authentication & Guard Engine */
let activeAuthRole = '{current_page_role}';
let failedLoginAttempts = 0;
let lockoutTimerInterval = null;
let selectedRegPlan = 'Starter';
let selectedRegMode = 'mc';

function initAuthGuard(pageRole) {{
  const session = getSession();
  const appShell = document.querySelector('.app-shell');
  const authOverlay = document.getElementById('tt-auth-overlay');

  // Check URL params for invite code e.g. ?invite=SJ-2026
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCodeParam = urlParams.get('invite');
  if (inviteCodeParam) {{
    showRegisterView();
    setRegMode('couple');
    const codeInput = document.getElementById('reg-couple-code');
    if (codeInput) {{
      codeInput.value = inviteCodeParam;
      codeInput.setAttribute('readonly', 'true');
      codeInput.style.background = '#fcf8f2';
      handleInviteCodeInput(inviteCodeParam);
    }}
  }}

  if (!session) {{
    // No session: show auth overlay for this page's role
    if (appShell) appShell.style.display = 'none';
    if (authOverlay) {{
      authOverlay.style.display = 'grid';
      selectAuthRole(pageRole);
    }}
    return false;
  }}

  if (session.expired) {{
    // Session expired: show error in auth overlay
    if (appShell) appShell.style.display = 'none';
    if (authOverlay) {{
      authOverlay.style.display = 'grid';
      selectAuthRole(pageRole);
      showAuthError("You were signed out. Please sign in again.");
    }}
    return false;
  }}

  // Check role matching:
  // Special exception: Superadmin impersonating MC on mc.html
  if (pageRole === 'mc' && session.role === 'superadmin' && session.impersonating) {{
    if (authOverlay) authOverlay.style.display = 'none';
    if (appShell) appShell.style.display = '';
    renderImpersonationBanner();
    updateSidebarUserInfo(session);
    return true;
  }}

  if (session.role !== pageRole) {{
    // Role mismatch!
    if (appShell) appShell.style.display = 'none';
    if (authOverlay) {{
      authOverlay.style.display = 'grid';
      showWrongRoleScreen(pageRole, session);
    }}
    return false;
  }}

  // Valid session matching role!
  if (authOverlay) authOverlay.style.display = 'none';
  if (appShell) appShell.style.display = '';
  updateSidebarUserInfo(session);
  return true;
}}

function updateSidebarUserInfo(session) {{
  const nameEl = document.getElementById('sidebar-user-name');
  const roleEl = document.getElementById('sidebar-user-role');
  if (nameEl) nameEl.textContent = session.name || 'User';
  if (roleEl) {{
    if (session.role === 'mc') {{
      roleEl.textContent = 'Master of Ceremonies';
    }} else if (session.role === 'couple') {{
      roleEl.textContent = 'Couple Account';
    }} else if (session.role === 'superadmin') {{
      roleEl.textContent = 'Platform Admin';
    }}
  }}
}}

function renderImpersonationBanner() {{
  let banner = document.getElementById('impersonation-banner');
  if (!banner) {{
    banner = document.createElement('div');
    banner.id = 'impersonation-banner';
    banner.innerHTML = `
      <span>Viewing as <strong>Robert Galati</strong> (Super Admin impersonation mode)</span>
      <button type="button" onclick="exitImpersonation()" style="background:#15110e;color:#f8f6f2;border:none;padding:5px 14px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:700;">Exit</button>
    `;
    const demobar = document.querySelector('.tt-demobar');
    if (demobar && demobar.nextSibling) {{
      demobar.parentNode.insertBefore(banner, demobar.nextSibling);
    }} else {{
      document.body.prepend(banner);
    }}
  }}
}}

function openAsMc() {{
  let session = getSession();
  if (!session) {{
    session = {{ role: 'superadmin', email: 'admin@tapandtoast.demo', name: 'Platform Admin' }};
  }}
  session.impersonating = true;
  setSession(session);
  logAudit('Impersonation started', 'Platform Admin', 'Superadmin impersonating MC Robert Galati', 'Security');
  window.location.href = 'mc.html';
}}

function exitImpersonation() {{
  const session = getSession();
  if (session) {{
    session.impersonating = false;
    session.role = 'superadmin';
    setSession(session);
  }}
  logAudit('Impersonation ended', 'Platform Admin', 'Exited MC impersonation mode', 'Security');
  window.location.href = 'superadmin.html';
}}

function showWrongRoleScreen(expectedRole, session) {{
  const signinView = document.getElementById('tt-signin-view');
  const regView = document.getElementById('tt-register-view');
  const wrongRoleView = document.getElementById('tt-wrong-role-view');
  if (signinView) signinView.style.display = 'none';
  if (regView) regView.style.display = 'none';
  if (wrongRoleView) {{
    wrongRoleView.style.display = 'block';
    const roleLabels = {{ mc: 'MC / Pro', couple: 'Couple', superadmin: 'Super Admin' }};
    const expectedName = roleLabels[expectedRole] || expectedRole;
    const currentName = roleLabels[session.role] || session.role;
    const msg = document.getElementById('tt-wrong-role-msg');
    if (msg) {{
      msg.innerHTML = `This area is for <strong>${{expectedName}}</strong> accounts.<br>You are currently signed in as <strong>${{escapeHtml(session.name)}}</strong> (${{currentName}}).`;
    }}
  }}
}}

function goToUserRoleAccount() {{
  const session = getSession();
  if (!session) {{
    window.location.reload();
    return;
  }}
  const targetFiles = {{ mc: 'mc.html', couple: 'couple.html', superadmin: 'superadmin.html' }};
  const target = targetFiles[session.role] || 'couple.html';
  window.location.href = target;
}}

function handleLogout() {{
  const session = getSession();
  const email = session ? session.email : '';
  const actor = session ? session.name : 'User';
  clearSession();
  logAudit('User signed out: ' + email, actor, 'Session cleared', 'Security');
  showToast('Signed out', 'info');
  setTimeout(() => {{
    window.location.href = 'login.html';
  }}, 300);
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
  const name = roleDisplayNames[role] || 'Account';
  if (headline) headline.textContent = `Sign in to your ${{name}} account`;

  clearAuthErrors();
}}

function fillDemoCredentials(email, password, role) {{
  selectAuthRole(role);
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  if (emailInput) emailInput.value = email;
  if (pwdInput) pwdInput.value = password;
  clearAuthErrors();
}}

function handleLoginSubmit() {{
  if (failedLoginAttempts >= 5) return;

  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  const rememberBox = document.getElementById('login-remember');
  const email = emailInput ? emailInput.value.trim() : '';
  const pwd = pwdInput ? pwdInput.value : '';

  if (!email || !pwd) {{
    showAuthError("Please enter your email and password.");
    return;
  }}

  const state = loadState();
  const users = state.users || [];
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  const expectedHash = hashDemoPassword(pwd);

  if (!user || user.passwordHash !== expectedHash) {{
    failedLoginAttempts++;
    logAudit('Failed login attempt: ' + email, 'Unknown', 'Incorrect credentials', 'Security');
    
    if (failedLoginAttempts >= 5) {{
      triggerLockout();
      return;
    }}

    showAuthError("That email and password don't match");
    if (emailInput) {{
      emailInput.classList.add('tt-shake');
      setTimeout(() => emailInput.classList.remove('tt-shake'), 400);
      emailInput.focus();
    }}
    return;
  }}

  // User credentials match! Check if signed in under wrong role tab:
  if (user.role !== activeAuthRole) {{
    const roleNames = {{ mc: 'MC / Pro', couple: 'Couple', superadmin: 'Super Admin' }};
    const actualRoleName = roleNames[user.role] || user.role;
    showAuthError(`This account is a ${{actualRoleName}} account`, user.role);
    return;
  }}

  // Successful login!
  failedLoginAttempts = 0;
  const submitBtn = document.getElementById('login-submit-btn');
  const btnText = document.getElementById('login-btn-text');
  const spinner = document.getElementById('login-btn-spinner');
  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (spinner) spinner.style.display = 'inline-block';

  setTimeout(() => {{
    setSession({{
      role: user.role,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId || null,
      weddingId: user.weddingId || null,
      keepSignedIn: rememberBox ? rememberBox.checked : true,
      at: Date.now()
    }});

    logAudit('User signed in: ' + user.email, user.name, 'Successful login', 'Security');
    showToast('Signed in', 'success');

    // Check ?next= param
    const params = new URLSearchParams(window.location.search);
    const nextUrl = params.get('next');
    if (nextUrl && (nextUrl.endsWith('.html') || nextUrl.includes('.html'))) {{
      window.location.href = nextUrl;
      return;
    }}

    const targetFiles = {{ mc: 'mc.html', couple: 'couple.html', superadmin: 'superadmin.html' }};
    const targetFile = targetFiles[user.role] || '{current_page_role}.html';

    // If current page matches user's role, simply reveal the app shell!
    if (window.location.pathname.endsWith(targetFile) || window.location.pathname === targetFile) {{
      const authOverlay = document.getElementById('tt-auth-overlay');
      const appShell = document.querySelector('.app-shell');
      if (authOverlay) authOverlay.style.display = 'none';
      if (appShell) appShell.style.display = '';
      updateSidebarUserInfo(user);
    }} else {{
      window.location.href = targetFile;
    }}
  }}, 700);
}}

function triggerLockout() {{
  const lockoutMsg = document.getElementById('login-lockout-msg');
  const errorMsg = document.getElementById('login-error-msg');
  const submitBtn = document.getElementById('login-submit-btn');
  const timerSpan = document.getElementById('lockout-timer');

  if (errorMsg) errorMsg.style.display = 'none';
  if (lockoutMsg) lockoutMsg.style.display = 'block';
  if (submitBtn) submitBtn.disabled = true;

  let timeLeft = 30;
  if (timerSpan) timerSpan.textContent = timeLeft;

  if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
  lockoutTimerInterval = setInterval(() => {{
    timeLeft--;
    if (timerSpan) timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {{
      clearInterval(lockoutTimerInterval);
      failedLoginAttempts = 0;
      if (lockoutMsg) lockoutMsg.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }}
  }}, 1000);
}}

function showAuthError(msg, switchRole = null) {{
  const errorBox = document.getElementById('login-error-msg');
  const errorText = document.getElementById('login-error-text');
  const switchBtn = document.getElementById('login-switch-tab-btn');
  if (errorText) errorText.textContent = msg;
  if (switchBtn) {{
    if (switchRole) {{
      switchBtn.style.display = 'inline-block';
      const roleNames = {{ mc: 'MC / Pro', couple: 'Couple', superadmin: 'Super Admin' }};
      switchBtn.textContent = 'Switch to ' + (roleNames[switchRole] || switchRole);
      switchBtn.onclick = () => {{
        selectAuthRole(switchRole);
        clearAuthErrors();
        const pwdInput = document.getElementById('login-password');
        if (pwdInput) pwdInput.focus();
      }};
    }} else {{
      switchBtn.style.display = 'none';
    }}
  }}
  if (errorBox) errorBox.style.display = 'flex';
}}

function clearAuthErrors() {{
  const errorBox = document.getElementById('login-error-msg');
  if (errorBox) errorBox.style.display = 'none';
}}

function togglePasswordVisibility(inputId) {{
  const input = document.getElementById(inputId);
  if (!input) return;
  const btn = input.parentElement.querySelector('.tt-pwd-toggle');
  if (input.type === 'password') {{
    input.type = 'text';
    if (btn) btn.textContent = 'Hide';
  }} else {{
    input.type = 'password';
    if (btn) btn.textContent = 'Show';
  }}
}}

function showRegisterView() {{
  const signinView = document.getElementById('tt-signin-view');
  const regView = document.getElementById('tt-register-view');
  const wrongRoleView = document.getElementById('tt-wrong-role-view');
  if (signinView) signinView.style.display = 'none';
  if (wrongRoleView) wrongRoleView.style.display = 'none';
  if (regView) regView.style.display = 'block';
}}

function showLoginView() {{
  const signinView = document.getElementById('tt-signin-view');
  const regView = document.getElementById('tt-register-view');
  const wrongRoleView = document.getElementById('tt-wrong-role-view');
  if (regView) regView.style.display = 'none';
  if (wrongRoleView) wrongRoleView.style.display = 'none';
  if (signinView) signinView.style.display = 'block';
}}

function setRegMode(mode) {{
  selectedRegMode = mode;
  const btnMc = document.getElementById('reg-mode-btn-mc');
  const btnCouple = document.getElementById('reg-mode-btn-couple');
  const formMc = document.getElementById('reg-mc-form');
  const formCouple = document.getElementById('reg-couple-form');

  if (mode === 'mc') {{
    if (btnMc) btnMc.classList.add('active');
    if (btnCouple) btnCouple.classList.remove('active');
    if (formMc) formMc.style.display = 'block';
    if (formCouple) formCouple.style.display = 'none';
  }} else {{
    if (btnMc) btnMc.classList.remove('active');
    if (btnCouple) btnCouple.classList.add('active');
    if (formMc) formMc.style.display = 'none';
    if (formCouple) formCouple.style.display = 'block';
    goToCoupleSlide(1);
  }}
}}

let currentCoupleSlide = 1;
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
  let val = input.value.replace(/[^0-9+]/g, '');
  if (val.startsWith('+61')) {{
    let digits = val.substring(3).replace(/[^0-9]/g, '');
    if (digits.length > 9) digits = digits.substring(0, 9);
    let formatted = '+61';
    if (digits.length > 0) formatted += ' ' + digits.substring(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
    if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);
    input.value = formatted;
  }} else {{
    let digits = val.replace(/[^0-9]/g, '');
    if (digits.length > 10) digits = digits.substring(0, 10);
    let formatted = '';
    if (digits.length > 0) formatted += digits.substring(0, 4);
    if (digits.length > 4) formatted += ' ' + digits.substring(4, 7);
    if (digits.length > 7) formatted += ' ' + digits.substring(7, 10);
    input.value = formatted;
  }}
}}

function formatAbn(input) {{
  let digits = input.value.replace(/[^0-9]/g, '');
  if (digits.length > 11) digits = digits.substring(0, 11);
  let formatted = '';
  if (digits.length > 0) formatted += digits.substring(0, 2);
  if (digits.length > 2) formatted += ' ' + digits.substring(2, 5);
  if (digits.length > 5) formatted += ' ' + digits.substring(5, 8);
  if (digits.length > 8) formatted += ' ' + digits.substring(8, 11);
  input.value = formatted;
}}

function checkEmailUniqueness(email, errorElId) {{
  const errEl = document.getElementById(errorElId);
  if (!errEl) return false;
  if (!email) {{
    errEl.style.display = 'none';
    return true;
  }}
  const state = loadState();
  const users = state.users || [];
  const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {{
    errEl.innerHTML = `An account with this email already exists. <button type="button" class="tt-link-btn" onclick="showLoginView(); fillDemoCredentials('${{escapeHtml(email)}}', '', 'mc');" style="color:#b42318;font-weight:700;">Sign in instead &rarr;</button>`;
    errEl.style.display = 'block';
    return false;
  }} else {{
    errEl.style.display = 'none';
    return true;
  }}
}}

function updateLivePwdStrength(pwd, prefix) {{
  const lenRule = document.getElementById(`reg-${{prefix}}-rule-len`);
  const upperRule = document.getElementById(`reg-${{prefix}}-rule-upper`);
  const lowerRule = document.getElementById(`reg-${{prefix}}-rule-lower`);
  const numRule = document.getElementById(`reg-${{prefix}}-rule-num`);
  const meterBar = document.getElementById(`reg-${{prefix}}-meter-bar`);
  const meterText = document.getElementById(`reg-${{prefix}}-meter-text`);

  const hasLen = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);

  if (lenRule) {{
    lenRule.className = 'tt-pwd-rule' + (hasLen ? ' valid' : '');
    lenRule.textContent = (hasLen ? '✓ ' : '○ ') + '8+ characters';
  }}
  if (upperRule) {{
    upperRule.className = 'tt-pwd-rule' + (hasUpper ? ' valid' : '');
    upperRule.textContent = (hasUpper ? '✓ ' : '○ ') + 'Uppercase letter';
  }}
  if (lowerRule) {{
    lowerRule.className = 'tt-pwd-rule' + (hasLower ? ' valid' : '');
    lowerRule.textContent = (hasLower ? '✓ ' : '○ ') + 'Lowercase letter';
  }}
  if (numRule) {{
    numRule.className = 'tt-pwd-rule' + (hasNum ? ' valid' : '');
    numRule.textContent = (hasNum ? '✓ ' : '○ ') + 'Number';
  }}

  let score = 0;
  if (hasLen) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNum) score++;

  if (meterBar && meterText) {{
    if (pwd.length === 0) {{
      meterBar.style.width = '0%';
      meterText.textContent = 'Password strength';
      meterText.style.color = 'var(--muted)';
    }} else if (score <= 2) {{
      meterBar.style.width = '33%';
      meterBar.style.backgroundColor = '#b42318'; // red
      meterText.textContent = 'Weak';
      meterText.style.color = '#b42318';
    }} else if (score === 3 || (score === 4 && pwd.length < 10)) {{
      meterBar.style.width = '66%';
      meterBar.style.backgroundColor = 'var(--gold)'; // gold
      meterText.textContent = 'Good';
      meterText.style.color = 'var(--gold)';
    }} else {{
      meterBar.style.width = '100%';
      meterBar.style.backgroundColor = '#2e6930'; // green
      meterText.textContent = 'Strong';
      meterText.style.color = '#2e6930';
    }}
  }}
}}

function checkPwdMatch(pwdId, confirmId, indicatorId) {{
  const pwd = document.getElementById(pwdId);
  const confirm = document.getElementById(confirmId);
  const ind = document.getElementById(indicatorId);
  if (!pwd || !confirm || !ind) return;

  if (!confirm.value) {{
    ind.style.display = 'none';
    return;
  }}

  if (pwd.value === confirm.value) {{
    ind.textContent = '✓ Passwords match';
    ind.style.color = '#2e6930';
    ind.style.display = 'block';
  }} else {{
    ind.textContent = '✕ Passwords do not match';
    ind.style.color = '#b42318';
    ind.style.display = 'block';
  }}
}}

function handleInviteCodeInput(code) {{
  const cleanCode = code.trim().toUpperCase();
  const errEl = document.getElementById('reg-couple-code-err');
  const succEl = document.getElementById('reg-couple-code-success');
  const p1Input = document.getElementById('reg-couple-p1');
  const p2Input = document.getElementById('reg-couple-p2');

  if (!cleanCode) {{
    if (errEl) errEl.style.display = 'none';
    if (succEl) succEl.style.display = 'none';
    return;
  }}

  const state = loadState();
  const invites = state.invites || [];
  const invite = invites.find(inv => inv.code.toUpperCase() === cleanCode);

  if (!invite) {{
    if (succEl) succEl.style.display = 'none';
    if (errEl) {{
      errEl.textContent = "That invite code wasn't recognised. Ask your MC for a new one.";
      errEl.style.display = 'block';
    }}
    return;
  }}

  if (invite.used) {{
    if (succEl) succEl.style.display = 'none';
    if (errEl) {{
      errEl.textContent = "This invite has already been used";
      errEl.style.display = 'block';
    }}
    return;
  }}

  // Code is valid and unused!
  if (errEl) errEl.style.display = 'none';
  if (succEl) {{
    succEl.innerHTML = `Wedding of <strong>${{escapeHtml(invite.couple)}}</strong> &bull; ${{escapeHtml(invite.weddingDate)}} &bull; ${{escapeHtml(invite.venue)}} &bull; MC: ${{escapeHtml(invite.mc)}}`;
    succEl.style.display = 'block';
  }}
  if (p1Input && !p1Input.value) p1Input.value = invite.partner1 || 'Sophie';
  if (p2Input && !p2Input.value) p2Input.value = invite.partner2 || 'James';
}}

function handleRegisterMC() {{
  const name = document.getElementById('reg-mc-name').value.trim();
  const business = document.getElementById('reg-mc-business').value.trim();
  const email = document.getElementById('reg-mc-email').value.trim();
  const mobile = document.getElementById('reg-mc-mobile').value.trim();
  const abn = document.getElementById('reg-mc-abn').value.trim();
  const pwd = document.getElementById('reg-mc-pwd').value;
  const confirmPwd = document.getElementById('reg-mc-confirm-pwd').value;
  const terms = document.getElementById('reg-mc-terms').checked;
  const errBox = document.getElementById('reg-mc-error-msg');

  if (!terms) {{
    if (errBox) {{
      errBox.textContent = 'Please accept the Terms of Service to continue.';
      errBox.style.display = 'block';
    }}
    return;
  }}

  if (pwd !== confirmPwd) {{
    if (errBox) {{
      errBox.textContent = 'Passwords do not match.';
      errBox.style.display = 'block';
    }}
    document.getElementById('reg-mc-confirm-pwd').focus();
    return;
  }}

  if (pwd.length < 8) {{
    if (errBox) {{
      errBox.textContent = 'Password must be at least 8 characters long.';
      errBox.style.display = 'block';
    }}
    document.getElementById('reg-mc-pwd').focus();
    return;
  }}

  if (!checkEmailUniqueness(email, 'reg-mc-email-err')) {{
    document.getElementById('reg-mc-email').focus();
    return;
  }}

  const state = loadState();
  const tenantId = 'ten_' + Date.now();
  const userId = 'u_' + Date.now();

  const newTenant = {{
    id: tenantId,
    business: business,
    lead: name,
    plan: selectedRegPlan,
    weddings: 0,
    mrr: selectedRegPlan === 'Pro' ? 299 : 99,
    status: 'Trial',
    joined: 'Today',
    stripeConnected: false,
    email: email
  }};

  const newUser = {{
    id: userId,
    email: email,
    passwordHash: hashDemoPassword(pwd),
    name: name,
    role: 'mc',
    tenantId: tenantId,
    business: business
  }};

  if (!state.tenants) state.tenants = [];
  state.tenants.unshift(newTenant);

  if (!state.users) state.users = [];
  state.users.push(newUser);

  logAudit('New tenant registered: ' + business, name, 'Plan: ' + selectedRegPlan + ' (Trial)', 'Registration');
  saveState(state);

  setSession({{
    role: 'mc',
    email: email,
    name: name,
    tenantId: tenantId,
    at: Date.now()
  }});

  // Show welcome modal
  const welcomeModal = document.getElementById('mc-welcome-modal');
  const welcomeText = document.getElementById('mc-welcome-text');
  if (welcomeText) {{
    welcomeText.textContent = `Welcome to Tap & Toast, ${{name}}! Your 14-day ${{selectedRegPlan}} trial for ${{business}} is now active.`;
  }}
  if (welcomeModal) welcomeModal.style.display = 'flex';
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
  const errBox = document.getElementById('reg-couple-error-msg');
  if (errBox) errBox.style.display = 'none';

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

  setSession({{
    role: 'couple',
    email: email,
    name: coupleName,
    weddingId: 'w1',
    keepSignedIn: true,
    at: Date.now()
  }});

  showToast('Account registered successfully!', 'success');
  setTimeout(() => {{
    window.location.href = 'couple.html';
  }}, 500);
}}

/* Forgot Password Modal Logic */
let forgotTargetEmail = '';

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

  if (!email || !email.includes('@')) {{
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
      err.textContent = 'Password must be at least 8 characters.';
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
    // Demo fallback: add user record if mock testing
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
  showLoginView();
  const loginEmail = document.getElementById('login-email');
  const loginPwd = document.getElementById('login-password');
  if (loginEmail) loginEmail.value = forgotTargetEmail;
  if (loginPwd) {{
    loginPwd.value = '';
    loginPwd.focus();
  }}

  showToast('Password updated. Please sign in with your new password.', 'success');
}}
"""
