import fs from 'fs';

let code = fs.readFileSync('src/components/CoupleView.tsx', 'utf8');
const normalize = (s) => s.replace(/\r\n/g, '\n');
code = normalize(code);

// 1. Add state for newGuestAdults and newGuestKids
const oldStateBlock = `  const [newGuestDiet, setNewGuestDiet] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<string>('Uncategorised');`;

const newStateBlock = `  const [newGuestDiet, setNewGuestDiet] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<string>('Uncategorised');
  const [newGuestAdults, setNewGuestAdults] = useState<number>(1);
  const [newGuestKids, setNewGuestKids] = useState<number>(0);`;

if (!code.includes(normalize(oldStateBlock))) {
  console.error("Could not find oldStateBlock");
  process.exit(1);
}
code = code.replace(normalize(oldStateBlock), normalize(newStateBlock));

// 2. Update handleAddNewGuest
const oldAddGuestBlock = `  const handleAddNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const newGuest: Guest = {
      id: 'g_' + Date.now(),
      name: newGuestName.trim(),
      initials: newGuestName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
      household: newGuestHousehold.trim() || newGuestName.trim(),
      email: \`\${newGuestName.toLowerCase().replace(/\\s+/g, '.')}@example.com\`,
      phone: newGuestPhone || '0400 000 000',
      rsvpStatus: 'awaiting',
      guestCount: 1,
      partySize: 1,
      dietary: newGuestDiet || 'None',
      tableId: null,
      seatIndex: null,
      category: newGuestCategory || 'Uncategorised',
      reminderSent: false,
    };
    setState({
      ...state,
      guests: [newGuest, ...state.guests],
    });
    setShowAddGuestModal(false);
    setNewGuestName('');
    setNewGuestHousehold('');
    setNewGuestPhone('');
    setNewGuestDiet('');
    showToast(\`Added \${newGuest.name} to Guest List\`, 'success');
  };`;

const newAddGuestBlock = `  const handleAddNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const adults = Math.max(1, newGuestAdults);
    const kids = Math.max(0, newGuestKids);
    const total = adults + kids;
    const newGuest: Guest = {
      id: 'g_' + Date.now(),
      name: newGuestName.trim(),
      initials: newGuestName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
      household: newGuestHousehold.trim() || newGuestName.trim(),
      email: \`\${newGuestName.toLowerCase().replace(/\\s+/g, '.')}@example.com\`,
      phone: newGuestPhone || '0400 000 000',
      rsvpStatus: 'awaiting',
      guestCount: total,
      partySize: total,
      adults,
      kids,
      dietary: newGuestDiet || 'None',
      tableId: null,
      seatIndex: null,
      category: newGuestCategory || 'Uncategorised',
      reminderSent: false,
    };
    setState({
      ...state,
      guests: [newGuest, ...state.guests],
    });
    setShowAddGuestModal(false);
    setNewGuestName('');
    setNewGuestHousehold('');
    setNewGuestPhone('');
    setNewGuestDiet('');
    setNewGuestAdults(1);
    setNewGuestKids(0);
    showToast(\`Added \${newGuest.name} (\${adults} adults, \${kids} kids) to Guest List\`, 'success');
  };`;

if (!code.includes(normalize(oldAddGuestBlock))) {
  console.error("Could not find oldAddGuestBlock");
  process.exit(1);
}
code = code.replace(normalize(oldAddGuestBlock), normalize(newAddGuestBlock));

// 3. Compute demographic totals
const oldTotalsBlock = `  const confirmedCount = confirmedGuests.length;
  const awaitingCount = awaitingGuests.length;
  const totalGifts = state.gifts.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const thankYousDue = state.gifts.filter(g => g.thankYouStatus !== 'Completed' && g.thankYouStatus !== 'Sent').length;`;

const newTotalsBlock = `  const confirmedCount = confirmedGuests.length;
  const awaitingCount = awaitingGuests.length;
  const totalAdultsCount = weddingGuests.reduce((sum, g) => sum + (g.adults !== undefined ? g.adults : (g.partySize || 1)), 0);
  const totalKidsCount = weddingGuests.reduce((sum, g) => sum + (g.kids !== undefined ? g.kids : 0), 0);
  const totalPartyCount = totalAdultsCount + totalKidsCount;
  const totalGifts = state.gifts.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const thankYousDue = state.gifts.filter(g => g.thankYouStatus !== 'Completed' && g.thankYouStatus !== 'Sent').length;`;

if (!code.includes(normalize(oldTotalsBlock))) {
  console.error("Could not find oldTotalsBlock");
  process.exit(1);
}
code = code.replace(normalize(oldTotalsBlock), normalize(newTotalsBlock));

// 4. In activeTab === 'overview': Add subscription & MC banner
const oldOverviewCountdown = `            {/* Wedding Day Celebration Experience (Active on Wedding Day) */}
            {isWeddingDayMode && (
              <WeddingDayCelebrationSection
                onToggleWeddingDayMode={() => setIsWeddingDayMode(false)}
                isWeddingDayMode={isWeddingDayMode}
              />
            )}`;

const newOverviewCountdown = `            {/* Wedding Day Celebration Experience (Active on Wedding Day) */}
            {isWeddingDayMode && (
              <WeddingDayCelebrationSection
                onToggleWeddingDayMode={() => setIsWeddingDayMode(false)}
                isWeddingDayMode={isWeddingDayMode}
              />
            )}

            {/* Couple SaaS Subscription & MC Collaboration Banner */}
            <div className="bg-gradient-to-r from-[#181310] via-[#241c16] to-[#181310] text-[#f8f6f2] p-4 sm:p-5 rounded-2xl border border-[#bd9661]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#bd9661] text-[#15110e] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {wedding.subscriptionPlan?.name || 'Signature Pro Wedding Suite'}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Couple License
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  Collaborating with Certified MC: <span className="text-[#dfc194]">{wedding.selectedMc?.name || 'Robert Galati'}</span> ({wedding.selectedMc?.business || 'Galati MC Services'})
                </div>
                <div className="text-xs text-[#a8988a]">
                  ✨ Reception preferences audited &amp; approved by Couple &bull; Joey AI Concierge connected
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="bg-white/10 hover:bg-white/20 border border-[#bd9661]/50 text-[#dfc194] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Subscription &amp; MC Details
                </button>
              </div>
            </div>`;

if (!code.includes(normalize(oldOverviewCountdown))) {
  console.error("Could not find oldOverviewCountdown");
  process.exit(1);
}
code = code.replace(normalize(oldOverviewCountdown), normalize(newOverviewCountdown));

// 5. In activeTab === 'guests': Add Demographic KPI Cards before filter bar
const oldGuestListHeader = `            {/* Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-4">`;

const newGuestListHeader = `            {/* Demographic & Attendance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">TOTAL GUESTS</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">{totalPartyCount}</div>
                <div className="text-[10px] text-[#8b7b6b]">Across {weddingGuests.length} parties</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b] flex items-center gap-1">🍷 ADULTS (18+)</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">{totalAdultsCount}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">{Math.round((totalAdultsCount / (totalPartyCount || 1)) * 100)}% of reception</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b] flex items-center gap-1">🧃 KIDS (&lt;12)</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">{totalKidsCount}</div>
                <div className="text-[10px] text-sky-700 font-semibold">{totalKidsCount} children meals</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">CONFIRMED</div>
                <div className="font-serif text-2xl font-bold text-emerald-700 mt-0.5">{confirmedCount}</div>
                <div className="text-[10px] text-[#8b7b6b]">RSVPs accepted</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">AWAITING</div>
                <div className="font-serif text-2xl font-bold text-[#bd9661] mt-0.5">{awaitingCount}</div>
                <div className="text-[10px] text-[#8b7b6b]">Pending response</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">CATEGORISED</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">
                  {weddingGuests.length - uncategorisedCount} / {weddingGuests.length}
                </div>
                <div className="text-[10px] text-[#a8382c] font-semibold">{uncategorisedCount} need category</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-4">`;

if (!code.includes(normalize(oldGuestListHeader))) {
  console.error("Could not find oldGuestListHeader");
  process.exit(1);
}
code = code.replace(normalize(oldGuestListHeader), normalize(newGuestListHeader));

// 6. Table Header: Add ADULTS, KIDS, PARTY TOTAL
const oldTableHead = `                    <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                      <th className="py-2.5 px-3">GUEST / HOUSEHOLD</th>
                      <th className="py-2.5 px-3">CATEGORY</th>
                      <th className="py-2.5 px-3">CONTACT</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">PARTY</th>
                      <th className="py-2.5 px-3">DIETARY</th>
                      <th className="py-2.5 px-3">TABLE</th>
                      <th className="py-2.5 px-3">ACTIONS</th>
                    </tr>`;

const newTableHead = `                    <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                      <th className="py-2.5 px-3">GUEST / HOUSEHOLD</th>
                      <th className="py-2.5 px-3">CATEGORY</th>
                      <th className="py-2.5 px-3">CONTACT</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-center">ADULTS</th>
                      <th className="py-2.5 px-3 text-center">KIDS</th>
                      <th className="py-2.5 px-3 text-center">PARTY TOTAL</th>
                      <th className="py-2.5 px-3">DIETARY</th>
                      <th className="py-2.5 px-3">TABLE</th>
                      <th className="py-2.5 px-3">ACTIONS</th>
                    </tr>`;

if (!code.includes(normalize(oldTableHead))) {
  console.error("Could not find oldTableHead");
  process.exit(1);
}
code = code.replace(normalize(oldTableHead), normalize(newTableHead));

// 7. Table Row: Add Adults & Kids columns
const oldPartyTd = `                        <td className="py-3 px-3 font-semibold text-[#15110e]">
                          {g.partySize || 1}
                        </td>`;

const newPartyTd = `                        {/* ADULTS */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 bg-[#faf5ed] text-[#855c26] border border-[#ecd5b5] text-[11px] font-bold px-2 py-0.5 rounded-md">
                            🍷 {g.adults !== undefined ? g.adults : (g.partySize || 1)}
                          </span>
                        </td>

                        {/* KIDS */}
                        <td className="py-3 px-3 text-center">
                          <span className={\`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md \${
                            (g.kids || 0) > 0 ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'text-[#8b7b6b] bg-gray-50 border border-gray-200'
                          }\`}>
                            🧃 {g.kids || 0}
                          </span>
                        </td>

                        {/* PARTY TOTAL */}
                        <td className="py-3 px-3 text-center font-bold text-[#15110e]">
                          {(g.adults !== undefined ? g.adults : (g.partySize || 1)) + (g.kids || 0)}
                        </td>`;

if (!code.includes(normalize(oldPartyTd))) {
  console.error("Could not find oldPartyTd");
  process.exit(1);
}
code = code.replace(normalize(oldPartyTd), normalize(newPartyTd));

// 8. In Add Guest Modal: Add Adults and Kids inputs
const oldModalDietary = `                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Dietary Requirements</label>`;

const newModalDietary = `                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          🍷 Adults (18+)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={newGuestAdults}
                          onChange={(e) => setNewGuestAdults(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661] text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          🧃 Kids (&lt;12)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={newGuestKids}
                          onChange={(e) => setNewGuestKids(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Dietary Requirements</label>`;

if (!code.includes(normalize(oldModalDietary))) {
  console.error("Could not find oldModalDietary");
  process.exit(1);
}
code = code.replace(normalize(oldModalDietary), normalize(newModalDietary));

fs.writeFileSync('src/components/CoupleView.tsx', code, 'utf8');
console.log('CoupleView updated successfully!');
