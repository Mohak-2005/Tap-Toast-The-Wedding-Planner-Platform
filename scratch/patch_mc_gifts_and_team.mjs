import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update activeTab and detailSubTab type definitions
const tabTarget = `  const [activeTab, setActiveTab] = useState<'weddings' | 'calendar' | 'clients' | 'invoicing' | 'team' | 'referrals' | 'settings'>('weddings');
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const [mcInitialTab, setMcInitialTab] = useState<CoupleTab>('overview');
  const [detailSubTab, setDetailSubTab] = useState<'runsheet' | 'seating' | 'guests' | 'venue'>('runsheet');`;

const tabReplacement = `  const [activeTab, setActiveTab] = useState<'weddings' | 'calendar' | 'clients' | 'invoicing' | 'team' | 'referrals' | 'gifts' | 'settings'>('weddings');
  const [selectedWeddingId, setSelectedWeddingId] = useState<string | null>(null);
  const [mcInitialTab, setMcInitialTab] = useState<CoupleTab>('overview');
  const [detailSubTab, setDetailSubTab] = useState<'runsheet' | 'seating' | 'guests' | 'venue' | 'gifts'>('runsheet');

  // MC Gift Ledger State
  const [mcGiftSearch, setMcGiftSearch] = useState('');
  const [mcGiftTypeFilter, setMcGiftTypeFilter] = useState<'all' | 'wishing-well' | 'envelope' | 'gift'>('all');
  const [showMcAddGiftModal, setShowMcAddGiftModal] = useState(false);
  const [mcGiftName, setMcGiftName] = useState('');
  const [mcGiftAmount, setMcGiftAmount] = useState('');
  const [mcGiftType, setMcGiftType] = useState('Cash Envelope (Podium)');
  const [mcGiftMessage, setMcGiftMessage] = useState('');
  const [mcGiftStatus, setMcGiftStatus] = useState<'Due' | 'Drafted' | 'Sent'>('Due');`;

// 2. Add handleMcAddGift
const handlerTarget = `  const handleInviteMember = (e: React.FormEvent) => {`;
const handlerReplacement = `  const handleMcAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcGiftName.trim()) {
      showToast('Please enter the guest or family name', 'error');
      return;
    }
    const amountVal = parseFloat(mcGiftAmount.replace(/[^0-9.]/g, '')) || 0;
    const newGift = {
      id: 'gf_' + Date.now(),
      guestName: mcGiftName.trim(),
      amount: amountVal,
      type: mcGiftType.toLowerCase().includes('envelope') ? 'cash-envelope' : mcGiftType.toLowerCase().includes('well') ? 'wishing-well' : 'gift',
      date: 'Today (Reception)',
      message: mcGiftMessage.trim() || 'Logged at reception podium by MC',
      thankYouSent: mcGiftStatus === 'Sent',
      thankYouStatus: mcGiftStatus as any,
    };
    setState({
      ...state,
      gifts: [newGift, ...(state.gifts || [])],
    });
    showToast(\`Successfully recorded $\${amountVal} gift from \${mcGiftName.trim()}\`, 'success');
    setShowMcAddGiftModal(false);
    setMcGiftName('');
    setMcGiftAmount('');
    setMcGiftMessage('');
  };

  const handleInviteMember = (e: React.FormEvent) => {`;

// 3. Update team invite state defaults to Full MC Dashboard Access
const teamStateTarget = `  const [invAccessLevel, setInvAccessLevel] = useState<'Full Access' | 'Host & Run Sheet' | 'Seating & Guests' | 'Audio & AV Lead'>('Host & Run Sheet');
  const [invWeddingScope, setInvWeddingScope] = useState<'all' | 'custom'>('all');
  const [invSelectedWeddings, setInvSelectedWeddings] = useState<string[]>(['w1']);
  const [invCanRunsheet, setInvCanRunsheet] = useState<boolean>(true);
  const [invCanSeating, setInvCanSeating] = useState<boolean>(false);
  const [invCanDietary, setInvCanDietary] = useState<boolean>(true);
  const [invCanMessaging, setInvCanMessaging] = useState<boolean>(true);`;

const teamStateReplacement = `  const [invAccessLevel, setInvAccessLevel] = useState<'Full MC Dashboard Access' | 'Full Access' | 'Host & Run Sheet' | 'Seating & Guests' | 'Audio & AV Lead'>('Full MC Dashboard Access');
  const [invWeddingScope, setInvWeddingScope] = useState<'all' | 'custom'>('all');
  const [invSelectedWeddings, setInvSelectedWeddings] = useState<string[]>(['w1']);
  const [invCanRunsheet, setInvCanRunsheet] = useState<boolean>(true);
  const [invCanSeating, setInvCanSeating] = useState<boolean>(true);
  const [invCanDietary, setInvCanDietary] = useState<boolean>(true);
  const [invCanMessaging, setInvCanMessaging] = useState<boolean>(true);
  const [invCanGiftLedger, setInvCanGiftLedger] = useState<boolean>(true);`;

// 4. Update sidebar navigation: add Gift Ledger
const sidebarTarget = `              {
                id: 'invoicing',
                label: 'Invoicing',`;

const sidebarReplacement = `              {
                id: 'gifts',
                label: 'Gift Ledger & Wishing Well',
                badge: \`$\${(state.gifts || []).reduce((sum, g) => sum + Number(g.amount || 0), 0).toLocaleString()}\`,
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="13" rx="2" />
                    <path d="M12 8v13" />
                    <path d="M19 8a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0-3-3 3 3 0 0 0-3 3" />
                  </svg>
                ),
              },
              {
                id: 'invoicing',
                label: 'Invoicing',`;

// 5. Update detail sub-tabs: add Gift Ledger sub-tab
const subTabTarget = `            {/* Sub-Tabs */}
            <div className="flex gap-2 border-b border-[#e8ded0] pb-2">
              {[
                { id: 'runsheet', label: '🔒 Private Run Sheet' },
                { id: 'seating', label: 'Seating Floor Plan' },
                { id: 'guests', label: 'Guest & Catering Summary' },
                { id: 'venue', label: 'Venue & Travel' },
              ].map(sub => (`;

const subTabReplacement = `            {/* Sub-Tabs */}
            <div className="flex gap-2 border-b border-[#e8ded0] pb-2 overflow-x-auto">
              {[
                { id: 'runsheet', label: '🔒 Private Run Sheet' },
                { id: 'seating', label: 'Seating Floor Plan' },
                { id: 'guests', label: 'Guest & Catering Summary' },
                { id: 'venue', label: 'Venue & Travel' },
                { id: 'gifts', label: '🎁 Gift & Wishing Well Ledger' },
              ].map(sub => (`;

// 6. Update open invite modal values
const openInviteTarget = `                  setInvName('');
                  setInvEmail('');
                  setInvPhone('');
                  setInvRole('Associate MC & Host');
                  setInvAccessLevel('Host & Run Sheet');
                  setInvWeddingScope('all');
                  setInvSelectedWeddings(state.weddings.map(w => w.id));
                  setInvCanRunsheet(true);
                  setInvCanSeating(false);
                  setInvCanDietary(true);
                  setInvCanMessaging(true);
                  setShowInviteMemberModal(true);`;

const openInviteReplacement = `                  setInvName('');
                  setInvEmail('');
                  setInvPhone('');
                  setInvRole('Associate MC & Co-Pilot');
                  setInvAccessLevel('Full MC Dashboard Access');
                  setInvWeddingScope('all');
                  setInvSelectedWeddings(state.weddings.map(w => w.id));
                  setInvCanRunsheet(true);
                  setInvCanSeating(true);
                  setInvCanDietary(true);
                  setInvCanMessaging(true);
                  setInvCanGiftLedger(true);
                  setShowInviteMemberModal(true);`;

// 7. Update Team & Crew subtitle
const teamSubtitleTarget = `<p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl">
                  Manage agency team members, assign specific weddings, and customize granular stage &amp; console access permissions.
                </p>`;

const teamSubtitleReplacement = `<p className="text-xs text-[#8b7b6b] mt-1 max-w-2xl">
                  Manage agency team members and co-pilots. All team members share equal MC role parity, identical console permissions, and unified dashboard access.
                </p>`;

let norm = content.replace(/\r\n/g, '\n');

if (norm.includes(tabTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(tabTarget.replace(/\r\n/g, '\n'), tabReplacement);
  console.log('1. Tabs replaced!');
} else {
  console.error('1. Tabs NOT found!');
}

if (norm.includes(handlerTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(handlerTarget.replace(/\r\n/g, '\n'), handlerReplacement);
  console.log('2. Handler replaced!');
} else {
  console.error('2. Handler NOT found!');
}

if (norm.includes(teamStateTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(teamStateTarget.replace(/\r\n/g, '\n'), teamStateReplacement);
  console.log('3. Team state replaced!');
} else {
  console.error('3. Team state NOT found!');
}

if (norm.includes(sidebarTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(sidebarTarget.replace(/\r\n/g, '\n'), sidebarReplacement);
  console.log('4. Sidebar replaced!');
} else {
  console.error('4. Sidebar NOT found!');
}

if (norm.includes(subTabTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(subTabTarget.replace(/\r\n/g, '\n'), subTabReplacement);
  console.log('5. Sub-tabs replaced!');
} else {
  console.error('5. Sub-tabs NOT found!');
}

if (norm.includes(openInviteTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(openInviteTarget.replace(/\r\n/g, '\n'), openInviteReplacement);
  console.log('6. Open invite replaced!');
} else {
  console.error('6. Open invite NOT found!');
}

if (norm.includes(teamSubtitleTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(teamSubtitleTarget.replace(/\r\n/g, '\n'), teamSubtitleReplacement);
  console.log('7. Team subtitle replaced!');
} else {
  console.error('7. Team subtitle NOT found!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('McView.tsx base patches applied!');
