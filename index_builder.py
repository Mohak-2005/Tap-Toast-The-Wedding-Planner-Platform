import os
from data_template import SEED_STATE
from shared_css import get_shared_css
from shared_js import get_shared_js

def build_index():
    shared_css = get_shared_css()
    shared_js = get_shared_js()

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tap &amp; Toast — Client Demo &amp; Interactive Prototype</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <style>
{shared_css}

/* Showcase Index Page Custom Styles */
body {{
  background: #fdfbf7;
  color: var(--ink);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}}

.showcase-hero {{
  background: #110e0c;
  color: #f8f6f2;
  padding: 64px 24px 56px;
  text-align: center;
  border-bottom: 2px solid var(--gold);
  position: relative;
}}

.showcase-hero-inner {{
  max-width: 880px;
  margin: 0 auto;
}}

.showcase-badge-pill {{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #231c16;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}}

.showcase-title {{
  font-family: var(--font-heading);
  font-size: 44px;
  line-height: 1.15;
  color: #ffffff;
  margin: 0 0 16px;
}}

.showcase-subline {{
  font-size: 16px;
  color: #c9bbae;
  max-width: 680px;
  margin: 0 auto 28px;
  line-height: 1.6;
}}

.showcase-hero-actions {{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}}

.showcase-container {{
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  flex: 1;
}}

.showcase-notice-card {{
  background: #fff8ee;
  border: 1px solid #ebd4b8;
  border-left: 4px solid var(--gold);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}}

.showcase-notice-text {{
  font-size: 13.5px;
  color: #6a4f2b;
  line-height: 1.5;
}}

.showcase-grid {{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}}

@media (max-width: 1024px) {{
  .showcase-grid {{
    grid-template-columns: repeat(2, 1fr);
  }}
}}

@media (max-width: 680px) {{
  .showcase-grid {{
    grid-template-columns: 1fr;
  }}
  .showcase-title {{
    font-size: 32px;
  }}
}}

.persona-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
}}

.persona-card:hover {{
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--gold);
}}

.persona-card-top {{
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f2ede7;
}}

.persona-card-tag {{
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
}}

.tag-couple {{ background: #fcf1e0; color: #8c5b1e; border: 1px solid #ebd0ad; }}
.tag-guest-m {{ background: #edf5fd; color: #1e5a8c; border: 1px solid #c2def7; }}
.tag-guest-w {{ background: #f0f7f2; color: #216e39; border: 1px solid #cce5d4; }}
.tag-mc {{ background: #1c1511; color: var(--gold-light); border: 1px solid #3d2f23; }}
.tag-admin {{ background: #f6eefe; color: #6b21a8; border: 1px solid #e0c8fb; }}
.tag-auth {{ background: #f5f2eb; color: #685b4d; border: 1px solid #dbd2c3; }}

.persona-card-title {{
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 6px;
}}

.persona-card-user {{
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 8px;
}}

.persona-card-desc {{
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
}}

.persona-card-body {{
  padding: 16px 24px;
  flex: 1;
}}

.persona-feature-list {{
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}}

.persona-feature-item {{
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  color: #4a3e35;
  line-height: 1.4;
}}

.persona-feature-check {{
  color: var(--gold);
  font-weight: 700;
  flex-shrink: 0;
}}

.persona-card-footer {{
  padding: 18px 24px 22px;
  background: #fdfaf7;
  border-top: 1px solid #f2ede7;
}}

.showcase-section-heading {{
  font-family: var(--font-heading);
  font-size: 26px;
  margin: 0 0 8px;
  color: var(--ink);
}}

.showcase-section-sub {{
  font-size: 14px;
  color: var(--muted);
  margin: 0 0 24px;
}}

.showcase-features-card {{
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
}}

.features-two-col {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}}

@media (max-width: 768px) {{
  .features-two-col {{
    grid-template-columns: 1fr;
  }}
}}

.feature-highlight-box {{
  padding: 16px;
  background: #faf7f2;
  border-radius: 8px;
  border-left: 3px solid var(--gold);
}}

.feature-highlight-title {{
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
  margin-bottom: 4px;
}}

.feature-highlight-desc {{
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.5;
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
      <a href="index.html" class="tt-demobar-link active" title="Showcase Hub">Showcase</a>
      <a href="login.html" class="tt-demobar-link">Sign In</a>
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

  <!-- Hero Header -->
  <header class="showcase-hero">
    <div class="showcase-hero-inner">
      <div class="showcase-badge-pill">✨ Interactive Client Showcase &bull; 2026 Edition</div>
      <h1 class="showcase-title">Tap <span class="gold-amp">&amp;</span> Toast</h1>
      <p class="showcase-subline">
        Australia's premier wedding MC &amp; planning suite. Explore all 5 interactive roles below with simulated live data, instant persona launch, and zero setup required.
      </p>
      <div class="showcase-hero-actions">
        <button type="button" class="btn btn-gold" onclick="launchDemoRole('couple', 'couple.html')">
          🚀 Open Couple Dashboard
        </button>
        <a href="guest-mobile.html" class="btn btn-outline" style="border-color:#5c4735;color:#fcecd7;background:#241d17;">
          📱 Open Guest Mobile View
        </a>
        <button type="button" class="btn btn-outline" style="border-color:#5c4735;color:#fcecd7;background:#241d17;" onclick="launchDemoRole('mc', 'mc.html')">
          🎙️ Open MC Pro Dashboard
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="showcase-container">

    <!-- Tip Notice -->
    <div class="showcase-notice-card">
      <div class="showcase-notice-text">
        <strong>📁 Client Handover Note:</strong> This suite runs completely standalone in your browser. All inter-role sessions, Joey AI chatbot responses, seating chart changes, and RSVPs update seamlessly in real time.
      </div>
      <div>
        <button type="button" class="btn btn-outline btn-sm" onclick="resetDemoData()" style="font-weight:700;">
          ↻ Reset Demo Data
        </button>
      </div>
    </div>

    <!-- 6 Persona Cards -->
    <div class="showcase-grid">

      <!-- Card 1: Couple Dashboard -->
      <div class="persona-card">
        <div class="persona-card-top">
          <span class="persona-card-tag tag-couple">Couple Experience</span>
          <h2 class="persona-card-title">Couple Dashboard</h2>
          <div class="persona-card-user">Sophie &amp; James &bull; Fernwood Estate (14 Nov 2026)</div>
          <p class="persona-card-desc">
            The core host dashboard for managing RSVPs, tables, loving thank-you notes, and live venue guidance.
          </p>
        </div>
        <div class="persona-card-body">
          <ul class="persona-feature-list">
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Live countdown in <strong>days : hrs : mins : secs</strong></span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Guest list with <strong>Send Reminder</strong> &amp; RSVP tracking</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Interactive <strong>circular table seating</strong> with drag &amp; drop</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Gift &amp; Go</strong> wishing well with loving note templates</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Venue &amp; Travel</strong> tab with parking &amp; Google Map</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Joey AI Assistant</strong> with action confirmation dialogs</span>
            </li>
          </ul>
        </div>
        <div class="persona-card-footer">
          <button type="button" class="btn btn-gold btn-block" onclick="launchDemoRole('couple', 'couple.html')">
            🚀 Launch Couple Dashboard &rarr;
          </button>
        </div>
      </div>

      <!-- Card 2: Guest Mobile -->
      <div class="persona-card">
        <div class="persona-card-top">
          <span class="persona-card-tag tag-guest-m">Guest Mobile Web</span>
          <h2 class="persona-card-title">Guest Mobile Tap-In</h2>
          <div class="persona-card-user">Mark &amp; Sarah Johnson &bull; Table 4, Seats 1 &amp; 2</div>
          <p class="persona-card-desc">
            Smartphone-optimized guest experience loaded directly upon scanning the luxury QaRd NFC invitation.
          </p>
        </div>
        <div class="persona-card-body">
          <ul class="persona-feature-list">
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Luxury QaRd scan splash with <strong>Tap to Enter</strong></span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Temporary auto-dismiss welcome greeting</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Circular <strong>visual table diagram</strong> showing assigned seats</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Clean "Add to Calendar"</strong> action button</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Joey AI Chatbot</strong> embedded inside the smartphone frame</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Day-of schedule modal &amp; venue location</span>
            </li>
          </ul>
        </div>
        <div class="persona-card-footer">
          <a href="guest-mobile.html" class="btn btn-gold btn-block" style="text-decoration:none;text-align:center;">
            📱 Launch Guest Mobile View &rarr;
          </a>
        </div>
      </div>

      <!-- Card 3: Guest Web -->
      <div class="persona-card">
        <div class="persona-card-top">
          <span class="persona-card-tag tag-guest-w">Guest Desktop Web</span>
          <h2 class="persona-card-title">Guest Desktop Portal</h2>
          <div class="persona-card-user">The Johnson Family &bull; Wedding Website</div>
          <p class="persona-card-desc">
            Editorial desktop experience featuring full RSVP management, travel guide, and celebration feed.
          </p>
        </div>
        <div class="persona-card-body">
          <ul class="persona-feature-list">
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>High-fashion editorial layout &amp; wedding schedule</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Celebration feed with <strong>red heart like reactions</strong></span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Digital wishing well contributions &amp; blessings</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Dedicated Venue Details popup &amp; directions</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Dietary preference submissions &amp; RSVP acceptance</span>
            </li>
          </ul>
        </div>
        <div class="persona-card-footer">
          <a href="guest-web.html" class="btn btn-gold btn-block" style="text-decoration:none;text-align:center;">
            💻 Launch Guest Desktop Portal &rarr;
          </a>
        </div>
      </div>

      <!-- Card 4: MC Pro -->
      <div class="persona-card">
        <div class="persona-card-top">
          <span class="persona-card-tag tag-mc">Professional MC &bull; Multi-Tenant</span>
          <h2 class="persona-card-title">MC Pro Console</h2>
          <div class="persona-card-user">Robert Galati &bull; Galati MC &amp; Entertainment</div>
          <p class="persona-card-desc">
            Professional stage &amp; reception controller with live run sheets, minute cues, and floor plan editor.
          </p>
        </div>
        <div class="persona-card-body">
          <ul class="persona-feature-list">
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Minute-by-minute <strong>Wedding Run Sheet</strong> with active cues</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Floor Plan Seating Builder</strong> with circular tables</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Venue &amp; Logistics tab</strong> with 1-click Google Maps</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Multi-tenant wedding switcher across client accounts</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>VIP speeches, housekeeping prompts &amp; dietary alerts</span>
            </li>
          </ul>
        </div>
        <div class="persona-card-footer">
          <button type="button" class="btn btn-gold btn-block" onclick="launchDemoRole('mc', 'mc.html')">
            🎙️ Launch MC Pro Dashboard &rarr;
          </button>
        </div>
      </div>

      <!-- Card 5: Super Admin -->
      <div class="persona-card">
        <div class="persona-card-top">
          <span class="persona-card-tag tag-admin">Platform Operations</span>
          <h2 class="persona-card-title">Platform Super Admin</h2>
          <div class="persona-card-user">Platform Admin &bull; Global Telemetry</div>
          <p class="persona-card-desc">
            SaaS administration console for tracking subscriptions, tenants, security audits, and impersonation.
          </p>
        </div>
        <div class="persona-card-body">
          <ul class="persona-feature-list">
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Platform revenue &amp; metrics ($14.2k MRR, active weddings)</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Tenant account management &amp; licensing statuses</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>Super Admin Impersonation</strong> of MC Robert Galati</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Real-time security audit log tracking logins &amp; actions</span>
            </li>
          </ul>
        </div>
        <div class="persona-card-footer">
          <button type="button" class="btn btn-gold btn-block" onclick="launchDemoRole('superadmin', 'superadmin.html')">
            ⚙️ Launch Super Admin &rarr;
          </button>
        </div>
      </div>

      <!-- Card 6: Authentication & Onboarding -->
      <div class="persona-card">
        <div class="persona-card-top">
          <span class="persona-card-tag tag-auth">Onboarding Flows</span>
          <h2 class="persona-card-title">Sign In &amp; Registration</h2>
          <div class="persona-card-user">Member Access &amp; Couple Onboarding Wizard</div>
          <p class="persona-card-desc">
            Seamless access gateway with prefilled demo credentials and a 3-step slideshow registration wizard.
          </p>
        </div>
        <div class="persona-card-body">
          <ul class="persona-feature-list">
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>1-click demo login presets for all three roles</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span><strong>3-Step Couple Wizard</strong> (Names &rarr; Partners &rarr; Password)</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Clean, focused UI without cluttered plan options</span>
            </li>
            <li class="persona-feature-item">
              <span class="persona-feature-check">✓</span>
              <span>Pre-populated invite code <code>SJ-2026</code> support</span>
            </li>
          </ul>
        </div>
        <div class="persona-card-footer">
          <div style="display:flex;gap:10px;">
            <a href="login.html" class="btn btn-outline" style="flex:1;text-decoration:none;text-align:center;">
              Sign In &rarr;
            </a>
            <a href="register.html" class="btn btn-gold" style="flex:1;text-decoration:none;text-align:center;">
              Register Wizard &rarr;
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Interactive Highlights Box -->
    <section class="showcase-features-card">
      <h3 class="showcase-section-heading">Client Evaluation Guide &amp; Key Test Scenarios</h3>
      <p class="showcase-section-sub">Quick guide to test the standout interactive features built into this demo:</p>

      <div class="features-two-col">
        <div class="feature-highlight-box">
          <div class="feature-highlight-title">🤖 1. Joey AI Wedding Assistant</div>
          <div class="feature-highlight-desc">
            Open the chatbot in <strong>Guest Mobile</strong> or <strong>Couple Dashboard</strong>. Joey greets you warmly. Type <em>"change me diet to vegetarion"</em> to see the interactive <strong>Accept / Reject / Correct</strong> confirmation card! Ask <em>"where do I park"</em> or <em>"what table am I seated at"</em>.
          </div>
        </div>

        <div class="feature-highlight-box">
          <div class="feature-highlight-title">🪑 2. Drag &amp; Drop Circular Seating</div>
          <div class="feature-highlight-desc">
            In <strong>Couple Dashboard</strong> or <strong>MC Pro</strong>, navigate to the <strong>Seating</strong> tab. Drag unassigned guests into tables, seat/unseat guests, create new tables, or click <strong>Suggest Seating</strong> to auto-fill tables.
          </div>
        </div>

        <div class="feature-highlight-box">
          <div class="feature-highlight-title">💌 3. Digital Thank-You Loving Templates</div>
          <div class="feature-highlight-desc">
            In <strong>Couple Dashboard</strong> &gt; <strong>Gift &amp; Go</strong> tab, click the <strong>pencil icon</strong> next to any gift with "Due" status. A popup opens with pre-written loving message templates and a custom text editor.
          </div>
        </div>

        <div class="feature-highlight-box">
          <div class="feature-highlight-title">📍 4. Venue &amp; Travel Logistics</div>
          <div class="feature-highlight-desc">
            In <strong>Couple Dashboard</strong> or <strong>MC Pro</strong>, view the dedicated <strong>Venue &amp; Travel</strong> tab with full address, parking details, transport options, and one-click Google Maps redirection to Fernwood Estate.
          </div>
        </div>
      </div>
    </section>

  </main>

  <footer style="text-align:center;padding:24px;font-size:12px;color:var(--muted);border-top:1px solid var(--line);background:#faf8f5;">
    Tap &amp; Toast &bull; Handcrafted for Luxury Wedding Experiences &bull; Australia
  </footer>

  <script>
{shared_js}

function launchDemoRole(role, targetFile) {{
  setDemoSessionForRole(role);
  window.location.href = targetFile;
}}
  </script>
</body>
</html>"""

    out_path = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo', 'index.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Built index.html successfully!")

if __name__ == '__main__':
    build_index()
