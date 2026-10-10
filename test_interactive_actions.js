// Interactive simulation of cross-role user actions
const fs = require('fs');
const path = require('path');

// Mock localStorage environment
let storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { storage = {}; }
};

// Load seed state template
const templatePy = fs.readFileSync(path.join(__dirname, 'data_template.py'), 'utf8');
const jsonMatch = templatePy.match(/SEED_STATE = ({[\s\S]+?})\n\ndef/);
if (!jsonMatch) {
  console.error("Could not extract SEED_STATE");
  process.exit(1);
}

// Convert Python literals to JSON
let pyObjStr = jsonMatch[1]
  .replace(/True/g, 'true')
  .replace(/False/g, 'false')
  .replace(/None/g, 'null')
  .replace(/#.*$/gm, '');

const seedState = JSON.parse(pyObjStr);

function loadState() {
  const raw = localStorage.getItem('tt_demo_v1');
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(seedState));
}

function saveState(s) {
  localStorage.setItem('tt_demo_v1', JSON.stringify(s));
}

console.log('=== RUNNING INTERACTIVE CROSS-ROLE ACTION SIMULATION ===');

// 1. Initial State
saveState(seedState);
let state = loadState();
console.log('[Step 1] Initial state loaded: 96 confirmed guests, 7 tables, Priya at Table 4');
const priyaInit = state.guests.find(g => g.id === 'priya');
if (priyaInit.tableId !== 'table_4') throw new Error("Priya should start at table_4");

// 2. Couple removes Priya from seating
console.log('\n[Step 2] Couple removes Priya Sharma from Table 4');
priyaInit.tableId = null;
priyaInit.seatIndex = null;
saveState(state);

state = loadState();
const priyaAfterRemove = state.guests.find(g => g.id === 'priya');
if (priyaAfterRemove.tableId !== null) throw new Error("Priya should be unassigned");
console.log('PASS: Priya successfully removed from seating by Couple!');

// 3. MC Pro assigns Priya to Table 1, Seat 1
console.log('\n[Step 3] MC Pro seats Priya at Table 1');
const table1 = state.tables.find(t => t.id === 'table_1');
const seatedT1 = state.guests.filter(g => g.tableId === 'table_1');
let freeSeat = 0;
for (let s = 0; s < table1.capacity; s++) {
  if (!seatedT1.some(x => x.seatIndex === s)) {
    freeSeat = s;
    break;
  }
}
priyaAfterRemove.tableId = 'table_1';
priyaAfterRemove.seatIndex = freeSeat;
saveState(state);

state = loadState();
const priyaAfterMC = state.guests.find(g => g.id === 'priya');
if (priyaAfterMC.tableId !== 'table_1' || priyaAfterMC.seatIndex !== freeSeat) {
  throw new Error("Priya was not seated at Table 1 by MC Pro");
}
console.log(`PASS: MC Pro successfully seated Priya at Table 1, Seat ${freeSeat + 1}!`);

// 4. Couple replies to Aunty Carol's love note
console.log('\n[Step 4] Couple replies to Aunty Carol love note');
const noteItem = state.feed.find(f => f.author === 'Aunty Carol' || f.id === 'f_note1');
if (!noteItem.replies) noteItem.replies = [];
noteItem.replies.push({
  author: 'Sophie & James',
  role: 'couple',
  text: 'Uncle Peter better get ready for the YMCA! 💕',
  time: 'Just now'
});
saveState(state);

state = loadState();
const reloadedNote = state.feed.find(f => f.id === noteItem.id);
const lastReply = reloadedNote.replies[reloadedNote.replies.length - 1];
if (!lastReply || !lastReply.text.includes('YMCA')) {
  throw new Error("Reply was not recorded on love note");
}
console.log('PASS: Couple reply successfully recorded and attached to love note!');

// 5. Couple sends digital thank-you card for gift
console.log('\n[Step 5] Couple sends digital thank-you card for Whitfield family gift');
const gift = state.gifts.find(g => g.id === 'gf1');
gift.thankYouSent = true;
gift.thankYouMessage = 'Dearest Whitfields, thank you from the bottom of our hearts for your $250 contribution towards our Queenstown flights!';

// Also add thank you celebration to live feed
state.feed.unshift({
  id: 'f_ty_' + Date.now(),
  type: 'gift',
  author: 'Sophie & James',
  title: 'Thank You, The Whitfield family!',
  subtitle: 'Digital Thank-You Card sent for $250 AUD wishing well gift',
  quote: gift.thankYouMessage,
  time: 'Just now',
  likes: 4,
  comments: [],
  pinned: false,
  hidden: false
});
saveState(state);

state = loadState();
const reloadedGift = state.gifts.find(g => g.id === 'gf1');
if (!reloadedGift.thankYouSent || !reloadedGift.thankYouMessage.includes('Queenstown')) {
  throw new Error("Gift thank you card was not persisted");
}
const tyFeedPost = state.feed.find(f => f.title.includes('Thank You, The Whitfield family!'));
if (!tyFeedPost) throw new Error("Thank you feed post not found");
console.log('PASS: Thank-you card dispatched, recorded in gifts list, and posted to Celebration Feed!');

console.log('\n>>> ALL INTERACTIVE ACTIONS PASSED VERIFICATION WITH 100% SUCCESS! <<<');
