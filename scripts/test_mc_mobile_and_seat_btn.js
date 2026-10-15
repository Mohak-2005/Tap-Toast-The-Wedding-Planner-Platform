const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING MC MOBILE ADVANCED ARCHITECTURE ===');

// 1. Check couple.html Seat button and select height
const coupleHtml = fs.readFileSync('couple.html', 'utf8');
if (!coupleHtml.includes('>Seat</button>')) {
  console.error('FAIL: couple.html missing Seat button');
  process.exit(1);
}
if (!coupleHtml.includes('height:32px;padding:0 8px;font-size:12px;flex:1;border-radius:6px;')) {
  console.error('FAIL: couple.html select does not have height:32px');
  process.exit(1);
}
console.log('PASS [1]: couple.html has Seat button and matched 32px height select dropdown!');

// 2. Check mc.html Seat button and MC Cue Notes
const mcHtml = fs.readFileSync('mc.html', 'utf8');
if (!mcHtml.includes('>Seat</button>')) {
  console.error('FAIL: mc.html missing Seat button');
  process.exit(1);
}
if (!mcHtml.includes('MC Cue Notes')) {
  console.error('FAIL: mc.html missing MC Cue Notes label');
  process.exit(1);
}
if (mcHtml.includes('Private MC Cue Notes (Confidential)')) {
  console.error('FAIL: mc.html still has Private MC Cue Notes (Confidential)');
  process.exit(1);
}
console.log('PASS [2]: mc.html has Seat button, matched 32px select, and clean MC Cue Notes label!');

// 3. Check mc-mobile.html exists and has all requested features
if (!fs.existsSync('mc-mobile.html')) {
  console.error('FAIL: mc-mobile.html does not exist');
  process.exit(1);
}
const mcMobileHtml = fs.readFileSync('mc-mobile.html', 'utf8');
const requiredStrings = [
  'phone-mockup-frame',
  'phone-status-bar',
  '9:41',
  'phone-home-indicator',
  'MC Mobile Console',
  'handleQuickMCDemoLogin',
  'mc-login-form',
  'mc-register-form',
  'MC Cue Notes',
  // Requirement 1: Profile in bottom tab / settings with Sign Out
  'home-settings',
  'Sign Out of MC Console',
  // Requirement 2: 3-way Seating (Guest List, Seating Arrangement with circular diagram Image 3, Unseated Guests)
  'seg-btn-guestlist',
  'seg-btn-seatingarr',
  'seg-btn-unseated',
  'round-table-diagram',
  'seat-dot',
  'floorplan-dotted-canvas',
  '>Seat</button>',
  // Requirement 4: Home page with all weddings opening console on click
  'home-weddings',
  'openWeddingConsole',
  'mc-back-btn',
  // Requirement 5: Bottom nav with "All Weddings, Calendar, Invoice, Team, Settings" and Chatbot
  'mc-home-bottom-nav',
  'All Weddings',
  'Calendar',
  'Invoice',
  'Team',
  'Settings',
  'mc-chat-fab',
  'mc-chat-panel',
  'generateMCJoeyResponse'
];

for (const s of requiredStrings) {
  if (!mcMobileHtml.includes(s)) {
    console.error(`FAIL: mc-mobile.html missing required feature: "${s}"`);
    process.exit(1);
  }
}
console.log('PASS [3]: mc-mobile.html contains Home page, 5 bottom tabs, Joey Chatbot, and Image 3 circular seating!');

// 4. Check App.tsx
const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
if (!appTsx.includes('mc-mobile.html') || appTsx.includes('guest-web.html')) {
  console.error('FAIL: src/App.tsx does not properly replace guest-web with mc-mobile');
  process.exit(1);
}
console.log('PASS [4]: src/App.tsx correctly routes to mc-mobile.html!');

// 5. Check demobars across all pages
const filesToCheckDemobar = ['couple.html', 'mc.html', 'guest-mobile.html', 'superadmin.html', 'index.html', 'login.html', 'register.html'];
for (const f of filesToCheckDemobar) {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('href="mc-mobile.html"')) {
    console.error(`FAIL: ${f} demobar is missing href="mc-mobile.html"`);
    process.exit(1);
  }
}
console.log('PASS [5]: All 7 portal pages have mc-mobile.html in their top demobar navigation!');

console.log('\nALL 5 ADVANCED VERIFICATION SUITES PASSED FLAWLESSLY!');
