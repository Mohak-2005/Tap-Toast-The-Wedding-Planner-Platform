const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'CoupleView.tsx'), 'utf8');

const idxVenue = content.indexOf("activeTab === 'venue'");
console.log('Venue tab index:', idxVenue);
if (idxVenue !== -1) {
  console.log('--- VENUE TAB PREVIEW (CoupleView) ---');
  console.log(content.substring(idxVenue, idxVenue + 1500));
}

const idxInv = content.indexOf("activeTab === 'invitations'");
console.log('\nInvitations tab index:', idxInv);
if (idxInv !== -1) {
  console.log('--- INVITATIONS TAB PREVIEW (CoupleView) ---');
  console.log(content.substring(idxInv, idxInv + 1500));
}
