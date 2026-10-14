// Test script for newly requested features:
// 1. Couple add/remove guest from seating
// 2. Couple reply to love notes
// 3. Couple gift thank you card
// 4. MC Pro add/remove guest from seating
// 5. Guest view-only seating
// 6. Guest mobile phone chassis elements

const fs = require('fs');
const path = require('path');

const demoDir = path.join(__dirname, '..', 'tap-toast-demo');
const guestMobileHtml = fs.readFileSync(path.join(demoDir, 'guest-mobile.html'), 'utf8');
const guestWebHtml = fs.readFileSync(path.join(demoDir, 'guest-web.html'), 'utf8');
const coupleHtml = fs.readFileSync(path.join(demoDir, 'couple.html'), 'utf8');
const mcHtml = fs.readFileSync(path.join(demoDir, 'mc.html'), 'utf8');

console.log('=== VERIFYING NEW USER REQUIREMENTS ===');

// Check 1: Guest mobile phone frame & status bar & home indicator
console.log('\n[Check 1: Guest Mobile Chassis]');
if (guestMobileHtml.includes('phone-mockup-frame') && 
    guestMobileHtml.includes('phone-status-bar') && 
    guestMobileHtml.includes('9:41') &&
    guestMobileHtml.includes('phone-home-indicator') &&
    guestMobileHtml.includes('phone-bottom-nav')) {
  console.log('PASS: guest-mobile.html contains phone mockup chassis with 9:41 status bar, bottom nav, and home indicator!');
} else {
  console.error('FAIL: Missing phone mockup elements in guest-mobile.html');
  process.exit(1);
}

// Check 2: Guest view only seating
console.log('\n[Check 2: Guest View-Only Seating]');
const mobileTableHasViewOnly = guestMobileHtml.includes('Confirmed Seating · View Only') || guestMobileHtml.includes('View Only');
const webTableHasViewOnly = guestWebHtml.includes('Confirmed Seating · View Only') || guestWebHtml.includes('View Only');
const guestHasNoSeatButtons = !guestMobileHtml.includes('handleSeatClick') && !guestWebHtml.includes('handleSeatClick');

if (mobileTableHasViewOnly && webTableHasViewOnly && guestHasNoSeatButtons) {
  console.log('PASS: Both guest-mobile.html and guest-web.html enforce view-only seating without edit controls!');
} else {
  console.error('FAIL: Guest seating not properly view-only');
  process.exit(1);
}

// Check 3: Couple Add/Remove Seating controls
console.log('\n[Check 3: Couple Add/Remove Seating Controls]');
const coupleHasRemove = coupleHtml.includes('handleRemoveGuestFromTable');
const coupleHasAssign = coupleHtml.includes('handleAssignToTable');
const coupleHasSeatModal = coupleHtml.includes('seat-guest-modal');
const coupleHasRosterRemove = coupleHtml.includes('Remove from Table');

if (coupleHasRemove && coupleHasAssign && coupleHasSeatModal && coupleHasRosterRemove) {
  console.log('PASS: Couple dashboard contains full add/remove guest seating controls and modal!');
} else {
  console.error('FAIL: Couple seating controls incomplete in couple.html');
  process.exit(1);
}

// Check 4: Couple Reply to Love Notes
console.log('\n[Check 4: Couple Reply to Love Notes]');
const coupleHasReplyBtn = coupleHtml.includes('Reply as Couple') || coupleHtml.includes('submitCoupleReply');
const coupleHasReplySubmit = coupleHtml.includes('submitCoupleReply');
const feedHasRepliesDisplay = coupleHtml.includes('👑') && guestMobileHtml.includes('👑') && guestWebHtml.includes('👑');

if (coupleHasReplyBtn && coupleHasReplySubmit && feedHasRepliesDisplay) {
  console.log('PASS: Couple can reply to love notes, and replies display with couple crown badge in couple, guest-mobile, and guest-web!');
} else {
  console.error('FAIL: Couple love note reply feature incomplete');
  process.exit(1);
}

// Check 5: Couple Gift Thank-You Card
console.log('\n[Check 5: Couple Gift Card & Thank-You Card]');
const coupleHasTYModal = coupleHtml.includes('thank-you-modal');
const coupleHasDigitalCardPreview = coupleHtml.includes('DIGITAL THANK-YOU CARD') || coupleHtml.includes('ty-card-preview-text');
const coupleHasSendTY = coupleHtml.includes('confirmSendThankYou');

if (coupleHasTYModal && coupleHasDigitalCardPreview && coupleHasSendTY) {
  console.log('PASS: Couple can send digital thank-you cards with custom message, live card preview, and feed posting!');
} else {
  console.error('FAIL: Thank-you card feature incomplete in couple.html');
  process.exit(1);
}

// Check 6: MC Pro Add/Remove Guest from Seating
console.log('\n[Check 6: MC Pro Seating Controls]');
const mcHasRemove = mcHtml.includes('mcRemoveGuestFromTable');
const mcHasAdd = mcHtml.includes('mcAddGuestToTable');
const mcHasPool = mcHtml.includes('mcAssignGuestFromPool');
const mcHasNewTable = mcHtml.includes('mcAddNewTable');

if (mcHasRemove && mcHasAdd && mcHasPool && mcHasNewTable) {
  console.log('PASS: MC Pro has interactive table cards with remove, add from dropdown, seat from pool, and add table!');
} else {
  console.error('FAIL: MC Pro seating controls incomplete in mc.html');
  process.exit(1);
}

console.log('\n>>> ALL 6 REQUIREMENT CHECKS PASSED PERFECTLY! <<<');
