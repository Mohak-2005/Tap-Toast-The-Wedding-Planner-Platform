// Simulation test for Cross-file flows 6, 8, 9, 10
const fs = require('fs');
const path = require('path');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.window = {
  location: { search: '?g=priya', reload: () => {} },
  dispatchEvent: () => {}
};
global.CustomEvent = class {};
global.document = {
  addEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => []
};

// Load code from shared_js.py
const sharedPy = fs.readFileSync(path.join(__dirname, 'shared_js.py'), 'utf-8');
const match = sharedPy.match(/f"""([\s\S]*?)"""/);
if (!match) throw new Error("Could not extract shared JS");
let sharedJs = match[1];

// We can extract SEED_DATA directly
const dataPy = fs.readFileSync(path.join(__dirname, 'data_template.py'), 'utf-8');
const seedMatch = dataPy.match(/SEED_STATE = (\{[\s\S]*?\n\})/);
const seedObj = eval('(' + seedMatch[1].replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null') + ')');

sharedJs = sharedJs.replace(/\{seed_json\}/, JSON.stringify(seedObj));
sharedJs = sharedJs.replace(/\{\{/g, '{').replace(/\}\}/g, '}');

eval(sharedJs);

// Also extract chatbot logic
const chatbotPy = fs.readFileSync(path.join(__dirname, 'chatbot_component.py'), 'utf-8');
const chatJsMatch = chatbotPy.match(/def get_chatbot_js\(\):[\s\S]*?return """([\s\S]*?)"""/);
let chatJs = chatJsMatch[1];
chatJs = chatJs.replace(/\{\{/g, '{').replace(/\}\}/g, '}');
eval(chatJs);

console.log("=== RUNNING SUITE OF VERIFICATION TESTS ===");

// 1. Initial State Check
let state = loadState();
console.log("\n[TEST 10: State Integrity]");
console.log("- Weddings:", state.weddings.length);
console.log("- Guests count:", state.guests.length);
console.log("- Tables count:", state.tables.length);
console.log("- Feed items:", state.feed.length);
console.log("- Gifts items:", state.gifts.length);
const initialMetrics = getGuestMetrics(state);
console.log(`- Initial confirmed: ${initialMetrics.confirmedCount}, declined: ${initialMetrics.declinedCount}, awaiting: ${initialMetrics.awaitingCount}`);
if (initialMetrics.confirmedCount !== 96 || initialMetrics.declinedCount !== 9 || initialMetrics.awaitingCount !== 22) {
  console.error("FAIL: Initial metrics mismatch!");
  process.exit(1);
} else {
  console.log("PASS: Initial metrics exactly match seed spec: 96 confirmed, 9 declined, 22 awaiting!");
}

// 2. Flow 6: Cross-file RSVP flow
console.log("\n[TEST 6: Cross-File RSVP Flow]");
// In guest-mobile: decline RSVP for Priya
let priya = state.guests.find(g => g.id === 'priya');
let prevPriyaCount = priya.guestCount; // 2
priya.rsvpStatus = 'declined';
priya.guestCount = 0;
saveState(state);

let declinedMetrics = getGuestMetrics(loadState());
console.log(`- After Priya declines: confirmed = ${declinedMetrics.confirmedCount}, declined = ${declinedMetrics.declinedCount}`);
if (declinedMetrics.confirmedCount !== (96 - prevPriyaCount) || declinedMetrics.declinedCount !== 10) {
  console.error("FAIL: Metrics didn't reflect decline properly!");
  process.exit(1);
}
console.log("PASS: Decline reflected in live state!");

// Now re-accept RSVP with 3 guests and "Vegetarian"
state = loadState();
priya = state.guests.find(g => g.id === 'priya');
priya.rsvpStatus = 'confirmed';
priya.guestCount = 3;
priya.dietary = 'Vegetarian';
saveState(state);

let reacceptedMetrics = getGuestMetrics(loadState());
console.log(`- After Priya re-accepts (3 guests, vegetarian): confirmed = ${reacceptedMetrics.confirmedCount}, declined = ${reacceptedMetrics.declinedCount}`);
if (reacceptedMetrics.confirmedCount !== 97 || reacceptedMetrics.declinedCount !== 9) {
  console.error("FAIL: Metrics didn't reflect re-acceptance properly!");
  process.exit(1);
}
console.log("PASS: Re-acceptance with 3 guests & vegetarian correctly updated confirmed count to 97!");

// 3. Flow 8: Seating persistence & Priya chatbot isolation
console.log("\n[TEST 8: Seating Drag & Drop Persistence]");
state = loadState();
let maya = state.guests.find(g => g.name === 'Maya Kapoor');
console.log(`- Maya Kapoor initial table: ${maya.tableId}, seat: ${maya.seatIndex}`);
// Assign Maya to Table 6, Seat 0
maya.tableId = 'table_6';
maya.seatIndex = 0;
saveState(state);

// Reload state
let reloadedState = loadState();
let mayaReloaded = reloadedState.guests.find(g => g.name === 'Maya Kapoor');
console.log(`- Maya Kapoor reloaded table: ${mayaReloaded.tableId}, seat: ${mayaReloaded.seatIndex}`);
if (mayaReloaded.tableId !== 'table_6' || mayaReloaded.seatIndex !== 0) {
  console.error("FAIL: Maya assignment did not persist!");
  process.exit(1);
}
console.log("PASS: Maya assignment persisted on Table 6!");

// Verify Priya's seating is unaffected
let priyaReloaded = reloadedState.guests.find(g => g.id === 'priya');
console.log(`- Priya table: ${priyaReloaded.tableId}, seat: ${priyaReloaded.seatIndex}`);
if (priyaReloaded.tableId !== 'table_4') {
  console.error("FAIL: Priya seating changed!");
  process.exit(1);
}
let priyaChatbotSit = generateBotResponse('where do I sit');
console.log(`- Chatbot answer for Priya seating: "${priyaChatbotSit}"`);
if (!priyaChatbotSit.includes('Table 4')) {
  console.error("FAIL: Chatbot seating response incorrect!");
  process.exit(1);
}
console.log("PASS: Priya seating unaffected and correctly reported as Table 4!");

// 4. Flow 9: Chatbot Queries
console.log("\n[TEST 9: Chatbot Live Queries]");
const q1 = generateBotResponse('what time is the ceremony');
console.log('- "what time is the ceremony" =>', q1.replace(/<[^>]+>/g, ' ').substring(0, 80) + '...');
if (!q1.includes('2:00 PM')) { console.error("FAIL: Time missing"); process.exit(1); }

const q2 = generateBotResponse('where do I park');
console.log('- "where do I park" =>', q2.replace(/<[^>]+>/g, ' ').substring(0, 80) + '...');
if (!q2.toLowerCase().includes('parking') && !q2.toLowerCase().includes('lawn')) { console.error("FAIL: Parking missing"); process.exit(1); }

const q3 = generateBotResponse('am I coming');
console.log('- "am I coming" =>', q3.replace(/<[^>]+>/g, ' ').substring(0, 80) + '...');
if (!q3.includes('Joyfully Accepted') || !q3.includes('3 guest')) { console.error("FAIL: RSVP status missing"); process.exit(1); }

const q4 = generateBotResponse('asdfgh');
console.log('- "asdfgh" =>', q4.replace(/<[^>]+>/g, ' ').substring(0, 80) + '...');
if (!q4.includes('Tap & Toast wedding concierge')) { console.error("FAIL: Fallback missing"); process.exit(1); }
console.log("PASS: All chatbot queries answer accurately from live state!");

// 5. Test Reset Demo Data
console.log("\n[TEST: Reset Demo Data]");
resetDemoData();
let resetState = loadState();
let resetMetrics = getGuestMetrics(resetState);
console.log(`- Post-reset confirmed: ${resetMetrics.confirmedCount}, declined: ${resetMetrics.declinedCount}, awaiting: ${resetMetrics.awaitingCount}`);
if (resetMetrics.confirmedCount !== 96 || resetMetrics.declinedCount !== 9 || resetMetrics.awaitingCount !== 22) {
  console.error("FAIL: Reset didn't restore seed values!");
  process.exit(1);
}
console.log("PASS: Reset restored pristine seed data!");

console.log("\n>>> ALL CROSS-FILE SIMULATION TESTS PASSED! <<<");
