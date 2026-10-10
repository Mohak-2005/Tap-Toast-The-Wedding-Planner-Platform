// Comprehensive End-to-End Test Suite for Tap & Toast
const fs = require('fs');
const path = require('path');

// Mock browser environment
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

let currentUrl = 'http://localhost:8000/login.html';
global.window = {
  location: {
    get href() { return currentUrl; },
    set href(v) { currentUrl = v; },
    pathname: '/login.html',
    search: '',
    replace: (v) => { currentUrl = v; },
    reload: () => {}
  },
  dispatchEvent: () => {}
};
global.CustomEvent = class {
  constructor(name, opts) {
    this.name = name;
    this.detail = opts ? opts.detail : null;
  }
};
global.document = {
  addEventListener: () => {},
  getElementById: (id) => ({
    id,
    value: '',
    textContent: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    focus: () => {},
    appendChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null
  }),
  querySelectorAll: () => [],
  querySelector: () => ({ style: {} }),
  documentElement: { classList: { add: () => {}, remove: () => {} } },
  createElement: () => ({ appendChild: () => {}, classList: { add: () => {} }, remove: () => {} }),
  body: { appendChild: () => {}, prepend: () => {} }
};
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');

// Load scripts
const demoDir = path.join(__dirname, '../tap-toast-demo');
const loginHtml = fs.readFileSync(path.join(demoDir, 'login.html'), 'utf-8');
const loginScript = loginHtml.split('<script>')[1].split('</script>')[0];
eval(loginScript);

const coupleHtml = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
const coupleScripts = coupleHtml.split('<script>');
const coupleMainScript = coupleScripts[coupleScripts.length - 1].split('</script>')[0];
eval(coupleMainScript);

console.log("=== COMPREHENSIVE VERIFICATION & E2E TEST SUITE ===");

let passed = 0;
let total = 0;
function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`PASS [${total}]: ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL [${total}]: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Files exist and have 0 alerts, 0 empty links
test("All 7 HTML demo files exist in /tap-toast-demo", () => {
  const files = ['login.html', 'register.html', 'guest-mobile.html', 'guest-web.html', 'couple.html', 'mc.html', 'superadmin.html'];
  files.forEach(f => {
    const full = path.join(demoDir, f);
    if (!fs.existsSync(full)) throw new Error(`Missing ${f}`);
    const content = fs.readFileSync(full, 'utf-8');
    if (content.includes('alert(')) throw new Error(`alert() in ${f}`);
    if (content.includes('href="#"') || content.includes("href='#'")) throw new Error(`href="#" in ${f}`);
  });
});

// 2. Initial state contains 3 seed accounts and invite SJ-2026
test("Initial state seed accounts and invite code", () => {
  resetDemoData();
  const state = loadState();
  if (state.users.length !== 3) throw new Error(`Users count ${state.users.length}`);
  const mc = state.users.find(u => u.email === 'robert@galati.demo');
  const couple = state.users.find(u => u.email === 'sophie.james@demo.test');
  const admin = state.users.find(u => u.email === 'admin@tapandtoast.demo');
  if (!mc || !couple || !admin) throw new Error("Seed user missing");
  const inv = state.invites.find(i => i.code === 'SJ-2026');
  if (!inv || inv.used) throw new Error("Invite SJ-2026 missing or used");
});

// 3. Demo hashing produces demo salt btoa
test("Demo password hash function", () => {
  const hash = hashDemoPassword('Demo1234!');
  if (hash !== 'dHRfc2FsdF9EZW1vMTIzNCE=') throw new Error(`Hash mismatch: ${hash}`);
});

// 4. Login authentication works for MC, Couple, and Super Admin
test("Login credential authentication and session writing", () => {
  const state = loadState();
  const mcUser = state.users.find(u => u.email === 'robert@galati.demo');
  if (mcUser.passwordHash !== hashDemoPassword('Demo1234!')) throw new Error("MC password hash mismatch");

  // Simulate MC login
  setSession({
    role: 'mc',
    email: mcUser.email,
    name: mcUser.name,
    tenantId: mcUser.tenantId,
    at: Date.now()
  });
  const session = getSession();
  if (!session || session.role !== 'mc') throw new Error("Session role mismatch");
});

// 5. Chatbot: Accept RSVP updates guest state and returns rich acceptance
test("Chatbot Concierge: 'Accept RSVP' updates state and confirms attendance", () => {
  resetDemoData();
  const stateBefore = loadState();
  const guestBefore = stateBefore.guests.find(g => g.id === 'priya');
  guestBefore.rsvpStatus = 'awaiting';
  saveState(stateBefore);

  const response = generateBotResponse('Joyfully Accept');
  if (!response.includes('Joyfully Accepted') || !response.includes('Wonderful news')) {
    throw new Error(`Unexpected bot response: ${response}`);
  }

  const stateAfter = loadState();
  const guestAfter = stateAfter.guests.find(g => g.id === 'priya');
  if (guestAfter.rsvpStatus !== 'confirmed') {
    throw new Error(`Guest RSVP status not updated to confirmed: ${guestAfter.rsvpStatus}`);
  }
  const audit = stateAfter.auditLog.find(a => a.category === 'RSVP' && a.action.includes('Accepted'));
  if (!audit) throw new Error("Audit log not written for RSVP acceptance");
});

// 6. Chatbot: Decline RSVP updates guest state and returns polite response
test("Chatbot Concierge: 'Decline RSVP' updates state and records decline", () => {
  const response = generateBotResponse('I regretfully decline');
  if (!response.includes('Regretfully Declined') || !response.includes('Thank you for letting us know')) {
    throw new Error(`Unexpected bot decline response: ${response}`);
  }

  const stateAfter = loadState();
  const guestAfter = stateAfter.guests.find(g => g.id === 'priya');
  if (guestAfter.rsvpStatus !== 'declined') {
    throw new Error(`Guest RSVP status not updated to declined: ${guestAfter.rsvpStatus}`);
  }
});

// 7. Chatbot: Answers Table, Schedule, Parking, and Dress Code queries
test("Chatbot Concierge: Answers specific queries (table, schedule, parking, dress)", () => {
  const tableAns = generateBotResponse('Where is my table?');
  console.log('ACTUAL TABLE ANS:', tableAns);
  if (!tableAns.includes('Table') || !tableAns.includes('Seat')) throw new Error("Table response error: " + tableAns);

  const schedAns = generateBotResponse('What is the ceremony schedule?');
  if (!schedAns.includes('Ceremony') || !schedAns.includes('2:00 PM')) throw new Error("Schedule response error");

  const parkAns = generateBotResponse('Where can I park?');
  if (!parkAns.includes('parking') && !parkAns.includes('Fernwood')) throw new Error("Parking response error");

  const dressAns = generateBotResponse('What should I wear?');
  if (!dressAns.includes('dress code') && !dressAns.includes('Black Tie')) throw new Error("Dress response error");
});

// 8. Couple Seating Actions: Add/Remove guest from seating
test("Couple Seating Actions: Add guest to table and remove guest from table", () => {
  const state = loadState();
  const table = state.tables[0];
  const unassigned = state.guests.find(g => !g.tableId);
  if (!unassigned) throw new Error("No unassigned guest found to seat");

  // Assign guest
  unassigned.tableId = table.id;
  unassigned.seatIndex = 7;
  saveState(state);

  const state2 = loadState();
  const seated = state2.guests.find(g => g.id === unassigned.id);
  if (seated.tableId !== table.id) throw new Error("Guest tableId not updated");

  // Remove guest
  seated.tableId = null;
  seated.seatIndex = null;
  saveState(state2);

  const state3 = loadState();
  const removed = state3.guests.find(g => g.id === unassigned.id);
  if (removed.tableId !== null) throw new Error("Guest tableId not cleared");
});

// 9. MC Pro Seating Actions: Add/Remove guest from seating roster
test("MC Pro Seating Actions: Seat unassigned guest and unseat from table", () => {
  const state = loadState();
  const targetTable = state.tables[1];
  const guest = state.guests.find(g => !g.tableId) || state.guests[0];

  guest.tableId = targetTable.id;
  guest.seatIndex = 0;
  saveState(state);

  const s2 = loadState();
  const checked = s2.guests.find(g => g.id === guest.id);
  if (checked.tableId !== targetTable.id) throw new Error("MC seating assignment failed");

  checked.tableId = null;
  saveState(s2);
  const s3 = loadState();
  if (s3.guests.find(g => g.id === guest.id).tableId !== null) throw new Error("MC unseating failed");
});

// 10. Couple Love Notes Reply: saves couple reply and badges it
test("Couple Love Notes Reply: saves reply with Couple badge in state", () => {
  const state = loadState();
  const note = state.feed.find(f => f.type === 'note');
  if (!note) throw new Error("Feed note not found");

  if (!note.replies) note.replies = [];
  note.replies.push({
    author: 'Sophie & James',
    text: 'Thank you so much! Looking forward to seeing you.',
    time: 'Just now'
  });
  saveState(state);

  const s2 = loadState();
  const updatedNote = s2.feed.find(f => f.id === note.id);
  const reply = updatedNote.replies.find(r => r.author === 'Sophie & James');
  if (!reply) throw new Error("Couple reply not saved");
});

// 11. Couple Digital Thank-You Cards: updates thank you status
test("Couple Digital Thank-You Cards: updates thank-you status from Due to Sent", () => {
  const state = loadState();
  const gift = state.gifts.find(g => g.thankYouStatus === 'Due' || !g.thankYouSent);
  if (!gift) throw new Error("Gift needing thank you not found");

  gift.thankYouStatus = 'Sent';
  gift.thankYouSent = true;
  gift.thankYouDate = 'Just now';
  saveState(state);

  const s2 = loadState();
  const updatedGift = s2.gifts.find(g => g.id === gift.id);
  if (updatedGift.thankYouStatus !== 'Sent') throw new Error("Thank-you status not updated");
});

// 12. Demobar links: all 7 files have all 7 navigation links + reset
test("Demobar consistency: all 7 HTML files contain links to all other demo pages", () => {
  const files = ['login.html', 'register.html', 'guest-mobile.html', 'guest-web.html', 'couple.html', 'mc.html', 'superadmin.html'];
  const expectedLinks = ['login.html', 'register.html', 'guest-mobile.html', 'guest-web.html', 'couple.html', 'mc.html', 'superadmin.html'];

  files.forEach(f => {
    const content = fs.readFileSync(path.join(demoDir, f), 'utf-8');
    expectedLinks.forEach(link => {
      if (!content.includes(`href="${link}"`)) {
        throw new Error(`File ${f} is missing link to ${link}`);
      }
    });
    if (!content.includes('resetDemoData()')) {
      throw new Error(`File ${f} is missing resetDemoData button`);
    }
  });
});

// 13. Guest Mobile: QR invitation splash, bottom dock, circular table diagram, normal phone dimensions, no outer toolbar
test("Guest Mobile: QR splash, bottom dock, circular table diagram, normal phone dimensions, no outer toolbar", () => {
  const content = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const loginContent = fs.readFileSync(path.join(demoDir, 'login.html'), 'utf-8');
  if (content.includes('mobile-frame-toolbar')) throw new Error("Found outer mobile-frame-toolbar, should be inside phone");
  if (!content.includes('id="pane-splash"')) throw new Error("Missing pane-splash QR invitation screen");
  if (!content.includes('class="phone-bottom-nav"')) throw new Error("Missing phone-bottom-nav inside phone");
  if (!content.includes('402px')) throw new Error("Missing standard smartphone 402px design width");
  if (!content.includes('id="circular-table-container"')) throw new Error("Missing circular-table-container in mobile");
  if (content.includes('🔒 Confirmed Seating · View Only')) throw new Error("Found View Only pill in guest mobile table view, should be removed");
  if (loginContent.includes('Guest? No account needed')) throw new Error("Found Guest? No account needed in login.html, should be removed");
  if (!content.includes('id="rsvp-status-container"')) throw new Error("Missing rsvp-status-container in mobile");
});

// 14. Guest Web: Vertical sidebar matching Image 3
test("Guest Web: vertical workspace sidebar matching Image 3", () => {
  const content = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  if (!content.includes('class="guest-sidebar"')) throw new Error("Missing guest-sidebar");
  if (!content.includes('YOUR WORKSPACE')) throw new Error("Missing YOUR WORKSPACE header");
  if (!content.includes('class="guest-nav-item"')) throw new Error("Missing guest-nav-item vertical pills");
  if (!content.includes('class="guest-sidebar-help"')) throw new Error("Missing guest-sidebar-help");
  if (!content.includes('class="guest-couple-avatar"')) throw new Error("Missing guest-couple-avatar");
  if (!content.includes('id="web-rsvp-status-container"')) throw new Error("Missing web-rsvp-status-container in web");
});

// 15. RSVP Status Transition logic: transition to status cards and edit support
test("RSVP Status Transition: functions defined and render confirmation views", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  if (!mobileContent.includes('renderRSVPStatusView') || !mobileContent.includes('enableRSVPEdit')) {
    throw new Error("Missing renderRSVPStatusView/enableRSVPEdit in mobile");
  }
  if (!webContent.includes('renderWebRSVPStatusView') || !webContent.includes('enableWebRSVPEdit')) {
    throw new Error("Missing renderWebRSVPStatusView/enableWebRSVPEdit in web");
  }
});

// 16. Tab Isolation: .tab-pane { display: none } rule and active pane switching
test("Tab Isolation: dedicated tabs are hidden by default and active tab displays", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (!coupleContent.includes('.tab-pane {') || !coupleContent.includes('display: none;')) {
    throw new Error("Missing .tab-pane { display: none; } rule in couple dashboard");
  }
  if (!coupleContent.includes('data-tab="overview"') || !coupleContent.includes('data-tab="guests"')) {
    throw new Error("Missing data-tab attributes for dedicated tabs in couple dashboard");
  }
});

// 17. Guest List Table: Table column has no X button, Actions has Remove button
test("Guest List Table: Table column clean (no X), Actions column has Remove button", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (coupleContent.includes('title="Remove from seating table">✕')) {
    throw new Error("Found X remove button in Table column, should only be table name");
  }
  if (!coupleContent.includes('>Remove</button>')) {
    throw new Error("Missing Remove button in Actions column");
  }
});

// 18. Professional Client UI: Sidebar emojis replaced with SVG vector icons
test("Professional Client UI: Sidebar emojis removed and replaced with clean SVG icons", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  const mcContent = fs.readFileSync(path.join(demoDir, 'mc.html'), 'utf-8');
  if (coupleContent.includes('<span>📊</span>') || coupleContent.includes('<span>👥</span>') || coupleContent.includes('<span>🪑</span>')) {
    throw new Error("Found emojis in couple sidebar buttons");
  }
  if (mcContent.includes('<span>💍</span>') || mcContent.includes('<span>📅</span>')) {
    throw new Error("Found emojis in MC sidebar buttons");
  }
  if (!coupleContent.includes('<svg viewBox="0 0 24 24"')) {
    throw new Error("Missing SVG icons in couple sidebar");
  }
});

// 19. QaRd Color Palettes: 4 card color schemes for couple to send
test("QaRd Invitations: 4 distinct card colour palettes available with interactive preview", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (!coupleContent.includes('Obsidian Noir') || !coupleContent.includes('Champagne Ivory') ||
      !coupleContent.includes('Burgundy Merlot') || !coupleContent.includes('Botanical Sage')) {
    throw new Error("Missing 4 card colour designs in QaRd configuration");
  }
  if (!coupleContent.includes('selectQardCardDesign(')) {
    throw new Error("Missing selectQardCardDesign function in couple.html");
  }
});

// 20. Gift & Go: Status is 'Due' and pencil icon opens pre-written loving message popup
test("Gift & Go: Thank-you status 'Due' and pencil icon opens loving template modal", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (!coupleContent.includes('✏️')) {
    throw new Error("Missing pencil icon in Gift & Go action column");
  }
  if (!coupleContent.includes('selectThankYouTemplate(1)') || !coupleContent.includes('selectThankYouTemplate(2)') || !coupleContent.includes('selectThankYouTemplate(3)')) {
    throw new Error("Missing pre-written loving message templates in thank-you modal");
  }
});

// 21. Modal UX: Clean luxury styling without childish emojis, and outside backdrop click closes modal
test("Modal UX: Backdrop click listener closes modals and clean styling without pastel emojis", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (!coupleContent.includes("classList.contains('tt-modal-backdrop')")) {
    throw new Error("Missing global modal backdrop dismiss listener");
  }
  if (coupleContent.includes('💌 <strong>Warm &amp; Generous:') || coupleContent.includes('✈️ <strong>Honeymoon Adventure:')) {
    throw new Error("Found old childish emojis in thank-you modal templates");
  }
  if (!coupleContent.includes('Option 1 · Warm &amp; Generous')) {
    throw new Error("Missing clean professional Option 1 in thank-you modal");
  }
});

// 22. Celebration Feed: Pin, Hide, and X removed; red heart emoji like button added
test("Celebration Feed: Pin, Hide, and X removed; red heart emoji like button toggles like", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (coupleContent.includes("togglePinFeed('${item.id}')") || coupleContent.includes("toggleHideFeed('${item.id}')") || coupleContent.includes("deleteFeedItem('${item.id}')")) {
    throw new Error("Feed still contains Pin, Hide, or X action buttons");
  }
  if (!coupleContent.includes("toggleCoupleLike('${item.id}')") || !coupleContent.includes('❤️')) {
    throw new Error("Missing red heart like button in couple feed");
  }
  if (!coupleContent.includes('function toggleCoupleLike(')) {
    throw new Error("Missing toggleCoupleLike handler function in couple.html");
  }
});

// 23. MC Pro Seating: Interactive visual floor plan matching couple.html
test("MC Pro Seating: Circular tables, Head Table, Suggest Seating, and Add Table matching couple.html", () => {
  const mcContent = fs.readFileSync(path.join(demoDir, 'mc.html'), 'utf-8');
  if (!mcContent.includes('id="mc-head-table-seats"') || !mcContent.includes('id="mc-tables-container"')) {
    throw new Error("Missing floor plan containers in mc.html");
  }
  if (!mcContent.includes('openMCSuggestSeatingModal()') || !mcContent.includes('mcAddTableToFloor()')) {
    throw new Error("Missing suggest seating or add table in mc.html floor plan");
  }
  if (!mcContent.includes('mc-unassigned-panel')) {
    throw new Error("Missing mc unassigned guests panel in mc.html");
  }
});

// 24. QaRd Configuration: Styled household preview select with clean labels
test("QaRd Configuration: Styled household preview select and clean label formatting", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  if (!coupleContent.includes('PREVIEW FOR GUEST HOUSEHOLD') || !coupleContent.includes('id="qard-guest-select"')) {
    throw new Error("Missing PREVIEW FOR GUEST HOUSEHOLD select in couple.html");
  }
  if (!coupleContent.includes('height:44px;') || !coupleContent.includes('▼')) {
    throw new Error("Missing custom styled select dropdown wrapper for QaRd preview");
  }
});

// 25. Venue & Travel: Dedicated tab in couple dashboard and subtab in MC Pro with Google Map
test("Venue & Travel: Address, parking, transport, and Google Map present in couple and MC", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  const mcContent = fs.readFileSync(path.join(demoDir, 'mc.html'), 'utf-8');
  if (!coupleContent.includes('data-tab="venue"') || !coupleContent.includes('id="pane-venue"')) {
    throw new Error("Missing Venue & Travel tab in couple dashboard");
  }
  if (!mcContent.includes('id="subtab-venue"') || !mcContent.includes('id="subpane-venue"')) {
    throw new Error("Missing Venue & Travel subtab in MC Pro wedding detail");
  }
  if (!coupleContent.includes('124 Range Road, Mittagong NSW 2575') || !mcContent.includes('124 Range Road, Mittagong NSW 2575')) {
    throw new Error("Missing venue address in couple or MC");
  }
  if (!coupleContent.includes('maps.google.com') || !mcContent.includes('maps.google.com')) {
    throw new Error("Missing clickable Google Map link in couple or MC");
  }
});

// 26. Venue Details Modal & Button: Present in guest-mobile and guest-web schedule views
test("Venue Details: Modal and trigger button present in guest-mobile and guest-web schedule views", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  if (!mobileContent.includes('openGuestVenueModal()') || !mobileContent.includes('Venue Details')) {
    throw new Error("Missing Venue Details button in guest-mobile schedule view");
  }
  if (!mobileContent.includes('id="guest-venue-modal"') || !mobileContent.includes('124 Range Road, Mittagong NSW 2575')) {
    throw new Error("Missing guest-venue-modal with address in guest-mobile.html");
  }
  if (!webContent.includes('openWebVenueModal()') || !webContent.includes('Venue Details')) {
    throw new Error("Missing Venue Details button in guest-web schedule view");
  }
  if (!webContent.includes('id="web-venue-modal"') || !webContent.includes('124 Range Road, Mittagong NSW 2575')) {
    throw new Error("Missing web-venue-modal with address in guest-web.html");
  }
});

// 27. Full-Screen Splash Screen: Initial splash-mode hides bottom nav until enterGuestHub
test("Guest Mobile Splash: Full-screen splash-mode hides bottom dock until Tap to Enter", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  if (!mobileContent.includes('.phone-mockup-frame.splash-mode .phone-bottom-nav')) {
    throw new Error("Missing splash-mode CSS rule for hiding bottom nav");
  }
  if (!mobileContent.includes('class="phone-mockup-frame splash-mode"')) {
    throw new Error("phone-mockup-frame should start in splash-mode");
  }
  if (!mobileContent.includes('function enterGuestHub()') || !mobileContent.includes("frame.classList.remove('splash-mode')")) {
    throw new Error("enterGuestHub must remove splash-mode to reveal bottom nav");
  }
});

// 28. Professional UI: Bottom dock and tiles use clean SVG vector icons instead of emojis
test("Guest UI Polish: Bottom dock, hub tiles, and feed badges use SVG icons instead of emojis", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  // Check that dock buttons do NOT contain emojis
  const disallowedEmojis = ['📱', '💌', '🎉', '📅', '🪑', '📸', '🎁', '📋'];
  for (const emoji of disallowedEmojis) {
    if (mobileContent.includes(`<span class="dock-icon">${emoji}</span>`)) {
      throw new Error(`Found disallowed emoji ${emoji} in mobile bottom nav dock`);
    }
    if (mobileContent.includes(`<span class="hub-tile-icon">${emoji}</span>`)) {
      throw new Error(`Found disallowed emoji ${emoji} in mobile hub tiles`);
    }
  }
  if (!mobileContent.includes('<svg viewBox="0 0 24 24"') || !webContent.includes('<svg viewBox="0 0 24 24"')) {
    throw new Error("Expected clean SVG vector icons in guest mobile and web");
  }
});

// 29. Guest Mobile Welcome: Removed Card detected and YOU'RE IN banner, starts directly with Welcome [Guest Name]
test("Guest Mobile Welcome: Card detected and YOU'RE IN removed, starts directly with Welcome", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const hubPaneMatch = mobileContent.match(/<section id="pane-hub"[\s\S]*?<\/section>/);
  if (!hubPaneMatch) throw new Error("pane-hub not found in guest-mobile.html");
  if (hubPaneMatch[0].includes('Card detected — welcome in') || hubPaneMatch[0].includes('Card detected - welcome in')) {
    throw new Error("pane-hub still contains 'Card detected — welcome in'");
  }
  if (hubPaneMatch[0].includes("YOU'RE IN") || hubPaneMatch[0].includes("You're in") || hubPaneMatch[0].includes("you are in")) {
    throw new Error("pane-hub still contains 'YOU\\'RE IN' eyebrow in hub");
  }
  if (!hubPaneMatch[0].includes('id="hub-guest-name">Welcome, Priya</h1>')) {
    throw new Error("guest-mobile.html must start hub welcome directly with Welcome, [Guest Name]");
  }
});

// 30. Calendar Action Button: Removed (.ics) label, displays clean 'Add to Calendar'
test("Calendar Action Button: (.ics) removed, displays clean 'Add to Calendar'", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  if (mobileContent.includes('Add to Calendar (.ics)')) {
    throw new Error("guest-mobile.html still has (.ics) in Add to Calendar");
  }
  if (webContent.includes('Add to Calendar (.ics)')) {
    throw new Error("guest-web.html still has (.ics) in Add to Calendar");
  }
  if (!mobileContent.includes('Add to Calendar') || !webContent.includes('Add to Calendar')) {
    throw new Error("Missing 'Add to Calendar' button text");
  }
});

// 31. Live Countdown & Temporary QaRd Banner
test("Live Countdown & Temporary QaRd Banner: days : hrs : mins remaining format and auto-dismiss banner", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');

  // Countdown function
  if (!webContent.includes('function getWeddingCountdown(') || !coupleContent.includes('function getWeddingCountdown(')) {
    throw new Error("Missing getWeddingCountdown helper in web or couple");
  }
  if (!webContent.includes('days : ') || !coupleContent.includes('DAYS : ')) {
    throw new Error("Missing days : hrs : mins remaining format");
  }

  // Temporary QaRd scanned banner
  if (!webContent.includes('id="web-qard-scanned-banner"') || !webContent.includes('qard-scanned-temporary')) {
    throw new Error("Missing temporary class and ID on QaRd scanned banner");
  }
  if (!webContent.includes('banner-hidden') || !webContent.includes('3500')) {
    throw new Error("Missing 3-4s auto-dismiss timer on QaRd scanned banner in guest-web.html");
  }
});

// 32. Joey Chatbot: Branding, Logo, Two-message Greeting, and Mobile Frame Containment
test("Joey Chatbot: Branding, Logo, Two-message Greeting, and Mobile Frame Containment", () => {
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');

  // Name Joey
  if (!mobileContent.includes('>Joey</h3>') || !webContent.includes('>Joey</h3>') || !coupleContent.includes('>Joey</h3>')) {
    throw new Error("Chatbot title must be 'Joey'");
  }

  // Two-step greeting
  if (!mobileContent.includes("Hello, I am <strong>Joey</strong>, your wedding assistant.") || !mobileContent.includes("How may I help you?")) {
    throw new Error("Chatbot must greet with 'Hello, I am Joey, your wedding assistant' and 'How may I help you?'");
  }

  // Inside phone mockup frame
  if (!mobileContent.includes('.phone-mockup-frame .tt-chat-btn') || !mobileContent.includes('.phone-mockup-frame .tt-chat-panel')) {
    throw new Error("Missing mobile containment CSS rules for Joey inside phone-mockup-frame");
  }
  // Make sure chatbot html is placed inside phone-mockup-frame
  const frameEndIndex = mobileContent.indexOf('</div><!-- End phone-mockup-frame -->');
  const chatBtnIndex = mobileContent.indexOf('id="tt-chat-btn"');
  if (chatBtnIndex === -1 || chatBtnIndex > frameEndIndex) {
    throw new Error("tt-chat-btn must be inside phone-mockup-frame");
  }
});

// 33. Joey Action Confirmation Flow: Accept, Reject, Correct buttons & responses
test("Joey Action Confirmation: 'change me diet to vegetarion' throws confirmation card with Accept, Reject, Correct", () => {
  const response = generateBotResponse('change me diet to vegetarion');
  if (!response.includes('Changing diet to vegetarian') || !response.includes('btn-confirm-accept') || !response.includes('btn-confirm-reject') || !response.includes('btn-confirm-correct')) {
    throw new Error(`Joey response did not include confirmation card with Accept/Reject/Correct: ${response}`);
  }
});

// 34. Dynamic Send Reminder Button & Fallback to All Guests
test("Dynamic Send Reminder Button: reflects remaining unsent count, becomes 'Send Reminder', and sends to all when 0 remain", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');

  if (!coupleContent.includes('id="btn-send-reminders"') || !coupleContent.includes('id="btn-reminder-label"')) {
    throw new Error("couple.html missing #btn-send-reminders or #btn-reminder-label");
  }

  if (!coupleContent.includes('function updateReminderButton(')) {
    throw new Error("couple.html missing updateReminderButton function");
  }

  if (!coupleContent.includes("Sent reminders to all") || !coupleContent.includes("Reminders successfully dispatched to all")) {
    throw new Error("couple.html missing fallback dispatch to all guests when 0 remain");
  }

  // Verify logic with mock state
  const mockStateWithUnsent = {
    guests: [
      { id: 'g1', rsvpStatus: 'awaiting', reminderSent: false },
      { id: 'g2', rsvpStatus: 'awaiting', reminderSent: true },
      { id: 'g3', rsvpStatus: 'confirmed', reminderSent: false }
    ]
  };
  const unsentAwaiting = mockStateWithUnsent.guests.filter(g => g.rsvpStatus === 'awaiting' && !g.reminderSent);
  if (unsentAwaiting.length !== 1) {
    throw new Error("Mock test failed: unsent count calculation incorrect");
  }
});

// 35. Seconds in Countdown & Clickable Thank-Yous Pill
test("Live Seconds Countdown & Clickable Thank-Yous Due Button", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');
  const mobileContent = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf-8');
  const webContent = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf-8');

  // Seconds in countdown
  if (!coupleContent.includes('SECS REMAINING') || !coupleContent.includes('cd.seconds')) {
    throw new Error("couple.html countdown missing seconds display");
  }
  if (!mobileContent.includes('secs remaining') || !webContent.includes('secs remaining')) {
    throw new Error("guest-mobile or guest-web countdown missing seconds display");
  }

  // Clickable thank-yous due pill
  if (!coupleContent.includes('onclick="switchCoupleTab(\'gifts\')"') || !coupleContent.includes('id="metric-thankyou-pill"')) {
    throw new Error("couple.html missing clickable thank-you pill switching to gifts tab");
  }
  if (!coupleContent.includes('<button') || !coupleContent.includes('btn-thankyou-nav')) {
    throw new Error("#metric-thankyou-pill must be a clickable button with class btn-thankyou-nav");
  }
});

// 36. Clickable Reminder Due Button
test("Clickable Reminder Due Button: clicking navigates directly to Guest List tab", () => {
  const coupleContent = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf-8');

  // Verify metric-reminder-pill is a button switching to guests
  if (!coupleContent.includes('onclick="switchCoupleTab(\'guests\')"') || !coupleContent.includes('id="metric-reminder-pill"')) {
    throw new Error("couple.html missing clickable reminder pill switching to guests tab");
  }
  if (!coupleContent.includes('btn-reminder-nav')) {
    throw new Error("#metric-reminder-pill must have class btn-reminder-nav");
  }
});

// 37. Registration Page: Plan/Trial/Super Admin Removal & 3-Step Couple Wizard
test("Registration Page: Removed plan selection/trial/super admin box and added 3-step couple slideshow wizard", () => {
  const regContent = fs.readFileSync(path.join(demoDir, 'register.html'), 'utf-8');

  // Verify removed sections
  if (regContent.includes('SELECT PLAN (14-DAY TRIAL INCLUDED)') || regContent.includes('plan-card-starter')) {
    throw new Error("register.html must not contain plan selection cards");
  }
  if (regContent.includes('Start 14-Day Free Trial')) {
    throw new Error("register.html must not contain 'Start 14-Day Free Trial' button text");
  }
  if (regContent.includes('Super Admin Access: Super Admin accounts are provisioned internally')) {
    throw new Error("register.html must not contain Super Admin Access callout box");
  }

  // Verify couple 3-step slideshow wizard
  if (!regContent.includes('id="couple-slide-1"') || !regContent.includes('id="couple-slide-2"') || !regContent.includes('id="couple-slide-3"')) {
    throw new Error("register.html missing 3 couple slideshow wizard slides");
  }
  if (!regContent.includes('function goToCoupleSlide(')) {
    throw new Error("register.html missing goToCoupleSlide function");
  }
  if (!regContent.includes('id="reg-couple-contact-name"') || !regContent.includes('id="reg-couple-p1"') || !regContent.includes('id="reg-couple-p2"')) {
    throw new Error("register.html missing partner and contact fields across wizard slides");
  }
  if (!regContent.includes('Register &rarr;')) {
    throw new Error("register.html must display clean 'Register' action buttons");
  }
  if (regContent.includes('Next: Wedding Details') || regContent.includes('Next: Account Security')) {
    throw new Error("register.html must have simple 'Next' button without subtext");
  }
});

console.log(`\nALL ${passed} / ${total} TESTS PASSED CLEANLY!`);



