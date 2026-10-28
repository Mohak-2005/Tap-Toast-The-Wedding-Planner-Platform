const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'CoupleView.tsx'), 'utf8');

const idxVenue = content.indexOf("activeTab === 'venue'");
const nextTab = content.indexOf("activeTab === 'settings'", idxVenue);
console.log(content.substring(idxVenue, nextTab !== -1 ? nextTab : idxVenue + 3000));
