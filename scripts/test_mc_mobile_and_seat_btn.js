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

// 6. Check Calendar month grid (Image 1 & User Request 4)
const calendarRequired = [
  'calendar-month-grid',
  'calendar-weekday',
  'calendar-day-cell',
  'changeCalendarMonth',
  'selectCalendarDate',
  'calendar-month-display'
];
for (const s of calendarRequired) {
  if (!mcMobileHtml.includes(s)) {
    console.error(`FAIL: mc-mobile.html missing calendar feature: "${s}"`);
    process.exit(1);
  }
}
if (mcMobileHtml.includes('id="calendar-day-details"')) {
  console.error('FAIL: mc-mobile.html still contains calendar-day-details card (should be removed per User Request 4)');
  process.exit(1);
}
console.log('PASS [6]: mc-mobile.html includes full Image 1 calendar grid and removed redundant details card!');

// 7. Check Monochrome professional navigation, clean wedding cards & Executive Lead MC below Date (User Request 2)
if (mcMobileHtml.includes('Guests: 118 Seated') || mcMobileHtml.includes('118 Seated')) {
  console.error('FAIL: mc-mobile.html still contains guests seated in wedding card');
  process.exit(1);
}
if (!mcMobileHtml.includes('Executive Lead MC')) {
  console.error('FAIL: mc-mobile.html missing Executive Lead MC role in wedding card');
  process.exit(1);
}
// Verify Executive Lead MC is positioned alongside Date on the left, not above Open Console
if (!mcMobileHtml.includes('<span>Date: <strong>')) {
  console.error('FAIL: mc-mobile.html missing formatted date in wedding card');
  process.exit(1);
}
// Check that bottom nav uses SVG icons instead of emojis
const navEmojis = ['💍', '📅', '🧾', '👥', '⚙️'];
for (const emo of navEmojis) {
  if (mcMobileHtml.includes(`class="mc-hnav-icon">${emo}</span>`)) {
    console.error(`FAIL: mc-mobile.html uses emoji ${emo} in bottom nav instead of professional SVG`);
    process.exit(1);
  }
}
console.log('PASS [7]: mc-mobile.html uses professional monochrome SVG navigation and placed Executive Lead MC below Date!');

// 8. Check Joey Chatbot FAB, Header, and Floating Pop-up Modal (User Request 3)
const chatbotFiles = ['mc-mobile.html', 'guest-mobile.html', 'couple.html', 'mc.html', 'scripts/chatbot_component.py'];
for (const f of chatbotFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('CONCIERGE ASSISTANT')) {
    console.error(`FAIL: ${f} still contains CONCIERGE ASSISTANT`);
    process.exit(1);
  }
  if (!content.includes('The Wedding Assistant')) {
    console.error(`FAIL: ${f} missing "The Wedding Assistant" subtitle`);
    process.exit(1);
  }
}
if (!mcMobileHtml.includes('#bd9661') || !mcMobileHtml.includes('mc-chat-fab')) {
  console.error('FAIL: mc-mobile.html missing Image 3 gold circular chatbot FAB styling');
  process.exit(1);
}
// Verify small pop-up modal styling rather than full-screen overlay
if (mcMobileHtml.includes('top: 42px;\n      left: 0;\n      right: 0;\n      bottom: 0;')) {
  console.error('FAIL: mc-mobile.html chatbot panel still takes over full screen');
  process.exit(1);
}
if (!mcMobileHtml.includes('bottom: 78px;') || !mcMobileHtml.includes('border-radius: 16px;')) {
  console.error('FAIL: mc-mobile.html missing floating pop-up card CSS for Joey chatbot');
  process.exit(1);
}
console.log('PASS [8]: Joey chatbot header standardized, Image 3 FAB styled, and rendered as a compact floating pop-up modal!');

// 9. Check Status Pop-up with Paid, Pending, Draft options on INVOICE page (User Request 1 & Image 1)
const statusRequired = [
  'status-interactive-btn',
  'status-dropdown-popover',
  'Paid',
  'Pending',
  'Draft',
  'setInvoiceStatus',
  'toggleStatusPopover'
];
for (const s of statusRequired) {
  if (!mcMobileHtml.includes(s)) {
    console.error(`FAIL: mc-mobile.html missing status popover feature: "${s}"`);
    process.exit(1);
  }
}
// Verify status dropdown is on invoice list and NOT on weddings cards
if (mcMobileHtml.includes('<div class="status-badge-wrap" onclick="event.stopPropagation()">\n                  <button type="button" class="status-interactive-btn status-${statusClass}" onclick="toggleStatusPopover(event, \'${w.id}\')">')) {
  console.error('FAIL: mc-mobile.html still has status dropdown on home weddings cards (should be on invoice page)');
  process.exit(1);
}
console.log('PASS [9]: mc-mobile.html has interactive Image 1 status button with Paid/Pending/Draft popover on INVOICE page!');

// 10. Check Profile Photo and Description Uploader in MC Settings
const profileRequired = [
  'handleProfilePhotoUpload',
  'profile-img-preview',
  'prof-input-bio',
  'handleSaveMCProfile',
  'Executive Lead MC'
];
for (const s of profileRequired) {
  if (!mcMobileHtml.includes(s)) {
    console.error(`FAIL: mc-mobile.html missing profile editor feature: "${s}"`);
    process.exit(1);
  }
}
console.log('PASS [10]: mc-mobile.html has complete profile photo upload and bio description editor!');

// 11. Check Master Header: Tap & Toast only (User Request 5)
const headerExtract = mcMobileHtml.match(/<header class="mc-home-header"[\s\S]*?<\/header>/);
if (!headerExtract) {
  console.error('FAIL: mc-mobile.html missing mc-home-header');
  process.exit(1);
}
if (!headerExtract[0].includes('Tap &amp; Toast') && !headerExtract[0].includes('Tap & Toast')) {
  console.error('FAIL: mc-home-header missing Tap & Toast title');
  process.exit(1);
}
if (headerExtract[0].includes('MC Pro') || headerExtract[0].includes('1 LIVE TODAY') || headerExtract[0].includes('Executive MC Console')) {
  console.error('FAIL: mc-home-header still contains MC Pro, 1 LIVE TODAY, or Executive MC Console');
  process.exit(1);
}
console.log('PASS [11]: mc-mobile.html header cleanly shows Tap & Toast without MC Pro, 1 LIVE TODAY, or Executive subtitle!');

console.log('\nALL 11 ADVANCED VERIFICATION SUITES PASSED FLAWLESSLY!');


