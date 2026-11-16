const fs = require('fs');
const content = fs.readFileSync('C:/Users/Mohak/Desktop/tap&toast - Copy/src/components/CoupleView.tsx', 'utf8');

const checks = [
  "import { Guest, PrivateRunSheetItem, WeddingVendor } from '../lib/types';",
  "export type CoupleTab =",
  "const [guestSearch, setGuestSearch] = useState('');",
  "const handleAddNewGuest = (e: React.FormEvent) => {",
  "id: 'guests',",
  "{activeTab === 'overview' && !isMcOrPlanner && (",
  "{activeTab === 'guests' && !isMcOrPlanner && (",
  "const filteredGuests = weddingGuests.filter(",
  "{showAddGuestModal && (",
  "{contentSubTab === 'vendorDirectory' ? (",
];

checks.forEach(c => {
  const found = content.includes(c);
  console.log(c.slice(0, 45) + '... => ' + (found ? 'FOUND' : 'NOT FOUND'));
});
