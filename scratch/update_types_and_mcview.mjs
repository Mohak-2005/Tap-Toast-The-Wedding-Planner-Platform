import fs from 'fs';

// -------------------------------------------------------------
// 1. Update src/lib/types.ts
// -------------------------------------------------------------
const typesPath = 'src/lib/types.ts';
let typesContent = fs.readFileSync(typesPath, 'utf8').replace(/\r\n/g, '\n');

if (!typesContent.includes('weddingName?: string;')) {
  typesContent = typesContent.replace(
    `  partner1: string;\n  partner2: string;\n  date: string;`,
    `  partner1: string;\n  partner2: string;\n  weddingName?: string;\n  brideName?: string;\n  groomName?: string;\n  brideEmail?: string;\n  groomEmail?: string;\n  date: string;`
  );
  fs.writeFileSync(typesPath, typesContent, 'utf8');
  console.log('✓ Updated src/lib/types.ts with weddingName, brideName, groomName, brideEmail, groomEmail');
} else {
  console.log('src/lib/types.ts already has new fields');
}

// -------------------------------------------------------------
// 2. Update src/components/McView.tsx
// -------------------------------------------------------------
const mcViewPath = 'src/components/McView.tsx';
let mcView = fs.readFileSync(mcViewPath, 'utf8').replace(/\r\n/g, '\n');

// 2a. Replace modal state variables
const oldStates = `  // New Wedding Modal State
  const [showNewWeddingModal, setShowNewWeddingModal] = useState(false);
  const [nwP1, setNwP1] = useState('');
  const [nwP2, setNwP2] = useState('');
  const [nwDate, setNwDate] = useState('2027-09-18');
  const [nwGuests, setNwGuests] = useState(110);
  const [nwVenue, setNwVenue] = useState('');`;

const newStates = `  // New Wedding Modal State
  const [showNewWeddingModal, setShowNewWeddingModal] = useState(false);
  const [nwWeddingName, setNwWeddingName] = useState('');
  const [nwBrideName, setNwBrideName] = useState('');
  const [nwGroomName, setNwGroomName] = useState('');
  const [nwBrideEmail, setNwBrideEmail] = useState('');
  const [nwGroomEmail, setNwGroomEmail] = useState('');
  const [nwVenue, setNwVenue] = useState('');
  const [nwDate, setNwDate] = useState('2027-09-18');`;

if (mcView.includes(oldStates)) {
  mcView = mcView.replace(oldStates, newStates);
  console.log('✓ Updated modal state declarations in McView.tsx');
} else {
  console.log('Could not find oldStates in McView.tsx');
}

// 2b. Replace handleCreateWedding
const oldHandler = `  // New Wedding Handler
  const handleCreateWedding = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(nwDate);
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDisplay = \`\${d.getDate()} \${mNames[d.getMonth()]} \${d.getFullYear()}\`;

    const newW: Wedding = {
      id: 'w_' + Date.now(),
      couple: \`\${nwP1} & \${nwP2}\`,
      partner1: nwP1,
      partner2: nwP2,
      date: nwDate + 'T15:00:00',
      dateDisplay,
      timeDisplay: '3:00 PM',
      venue: nwVenue,
      venueAddress: nwVenue,
      parking: 'Complimentary on-site guest parking available.',
      dressCode: 'Formal Elegance',
      registry: 'Gift & Go wishing well',
      invited: Number(nwGuests),
      confirmed: 0,
      status: 'Planning',
      tasks: [],
      runSheet: [
        { id: 'rs_' + Date.now() + '_1', time: '14:30', note: 'MC Arrival & sound check', done: false },
        { id: 'rs_' + Date.now() + '_2', time: '15:00', note: 'Ceremony processional', done: false },
      ],
      privateRunSheet: [
        { id: 'pmc_' + Date.now() + '_1', time: '14:30', activity: 'MC Arrival & Audio Check', notes: 'Sound check with technicians.', privateNotes: 'Check cordless mics.', done: false, order: 1 },
      ],
    };

    setState({ ...state, weddings: [...state.weddings, newW] });
    logAudit(state, setState, 'New Wedding Created', 'Robert Galati', 'mc', \`Created booking for \${newW.couple} at \${nwVenue}\`, 'General');
    setShowNewWeddingModal(false);
    setNwP1('');
    setNwP2('');
    setNwVenue('');
    showToast(\`Created booking for \${newW.couple}!\`, 'success');
  };`;

const newHandler = `  // New Wedding Handler
  const handleCreateWedding = (e: React.FormEvent) => {
    e.preventDefault();
    const bName = nwBrideName.trim() || 'Bride';
    const gName = nwGroomName.trim() || 'Groom';
    const coupleDisplay = \`\${bName} & \${gName}\`;
    const finalWeddingName = nwWeddingName.trim() || \`\${coupleDisplay}'s Wedding\`;
    const d = new Date(nwDate || '2027-09-18');
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateDisplay = \`\${d.getDate()} \${mNames[d.getMonth()]} \${d.getFullYear()}\`;

    const newW: Wedding = {
      id: 'w_' + Date.now(),
      couple: coupleDisplay,
      partner1: bName,
      partner2: gName,
      weddingName: finalWeddingName,
      brideName: bName,
      groomName: gName,
      brideEmail: nwBrideEmail.trim(),
      groomEmail: nwGroomEmail.trim(),
      date: (nwDate || '2027-09-18') + 'T15:00:00',
      dateDisplay,
      timeDisplay: '3:00 PM',
      venue: nwVenue,
      venueAddress: nwVenue,
      parking: 'Complimentary on-site guest parking available.',
      dressCode: 'Formal Elegance',
      registry: 'Gift & Go wishing well',
      invited: 110,
      confirmed: 0,
      status: 'Planning',
      tasks: [],
      runSheet: [
        { id: 'rs_' + Date.now() + '_1', time: '14:30', note: 'MC Arrival & sound check', done: false },
        { id: 'rs_' + Date.now() + '_2', time: '15:00', note: 'Ceremony processional', done: false },
      ],
      privateRunSheet: [
        { id: 'pmc_' + Date.now() + '_1', time: '14:30', activity: 'MC Arrival & Audio Check', notes: 'Sound check with technicians.', privateNotes: 'Check cordless mics.', done: false, order: 1 },
      ],
    };

    const newClient: Client = {
      id: 'c_' + Date.now(),
      couple: coupleDisplay,
      weddingDate: dateDisplay,
      venue: nwVenue,
      tier: 'Diamond Host Package',
      deposit: 'Paid ($500)',
      phone: '0412 345 678',
      email: nwBrideEmail.trim() || nwGroomEmail.trim(),
      notes: \`Booking for \${finalWeddingName}. Bride: \${bName} (\${nwBrideEmail}), Groom: \${gName} (\${nwGroomEmail}). Venue: \${nwVenue}.\`,
    };

    setState({
      ...state,
      weddings: [...state.weddings, newW],
      clients: [...(state.clients || []), newClient],
    });

    logAudit(state, setState, 'New Wedding Created', 'Robert Galati', 'mc', \`Created booking for \${finalWeddingName} at \${nwVenue}\`, 'General');
    setShowNewWeddingModal(false);
    setNwWeddingName('');
    setNwBrideName('');
    setNwGroomName('');
    setNwBrideEmail('');
    setNwGroomEmail('');
    setNwVenue('');
    showToast(\`Created booking for \${finalWeddingName}!\`, 'success');
  };`;

if (mcView.includes(oldHandler)) {
  mcView = mcView.replace(oldHandler, newHandler);
  console.log('✓ Updated handleCreateWedding in McView.tsx');
} else {
  console.log('Could not find oldHandler in McView.tsx');
}

// 2c. Replace Modal 3 JSX
const modalStartMarker = `{/* MODAL 3: NEW WEDDING WIZARD MODAL                                    */}`;
const modalEndMarker = `{/* MODAL 4: NEW INVOICE MODAL                                           */}`;

const startIdx = mcView.indexOf(modalStartMarker);
const endIdx = mcView.indexOf(modalEndMarker);

console.log('Modal indices:', { startIdx, endIdx });

const newModalJSX = `{/* MODAL 3: NEW WEDDING WIZARD MODAL                                    */}
      {/* ==================================================================== */}
      {showNewWeddingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border border-[#d5c7b5] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-[#f0ede4]">
              <div>
                <div className="text-[10px] tracking-[2px] text-[#bd9661] uppercase font-bold">
                  MC PRO BOOKING
                </div>
                <h3 className="font-serif text-xl font-bold text-[#15110e]">
                  New Wedding Booking
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewWeddingModal(false)}
                className="text-[#8b7b6b] hover:text-[#15110e] text-xl font-bold cursor-pointer p-1 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWedding} className="space-y-3.5 text-xs">
              {/* WEDDING NAME */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Wedding Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam & Olivia's Wedding"
                  value={nwWeddingName}
                  onChange={(e) => setNwWeddingName(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                />
              </div>

              {/* BRIDE NAME & GROOM NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Bride Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olivia"
                    value={nwBrideName}
                    onChange={(e) => {
                      setNwBrideName(e.target.value);
                      if (!nwWeddingName || nwWeddingName.includes('&')) {
                        const other = nwGroomName ? \` & \${nwGroomName}\` : '';
                        setNwWeddingName(\`\${e.target.value}\${other}'s Wedding\`);
                      }
                    }}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Groom Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={nwGroomName}
                    onChange={(e) => {
                      setNwGroomName(e.target.value);
                      if (!nwWeddingName || nwWeddingName.includes('&')) {
                        const first = nwBrideName ? \`\${nwBrideName} & \` : '';
                        setNwWeddingName(\`\${first}\${e.target.value}'s Wedding\`);
                      }
                    }}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
              </div>

              {/* BRIDE EMAIL & GROOM EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Bride Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. olivia@example.com"
                    value={nwBrideEmail}
                    onChange={(e) => setNwBrideEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                    Groom Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. liam@example.com"
                    value={nwGroomEmail}
                    onChange={(e) => setNwGroomEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                  />
                </div>
              </div>

              {/* VENUE LOCATION */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                  Venue Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bendooley Estate, Berrima"
                  value={nwVenue}
                  onChange={(e) => setNwVenue(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#f0ede4]">
                <button
                  type="button"
                  onClick={() => setShowNewWeddingModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-[#faf8f5] font-bold cursor-pointer text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold btn-sm px-5 py-2 font-bold shadow-2xs cursor-pointer"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      `;

if (startIdx !== -1 && endIdx !== -1) {
  mcView = mcView.substring(0, startIdx) + newModalJSX + mcView.substring(endIdx);
  fs.writeFileSync(mcViewPath, mcView, 'utf8');
  console.log('✓ Updated Modal 3 JSX in McView.tsx');
} else {
  console.log('Could not find modal start or end marker');
}
