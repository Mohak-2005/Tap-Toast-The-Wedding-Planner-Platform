import fs from 'fs';

const filePath = 'src/components/CoupleView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state for guest category
const stateTarget = `  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'declined' | 'awaiting'>('all');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestHousehold, setNewGuestHousehold] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestDiet, setNewGuestDiet] = useState('');`;

const stateReplacement = `  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'declined' | 'awaiting'>('all');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState<string>('all');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestHousehold, setNewGuestHousehold] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestDiet, setNewGuestDiet] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<string>('Uncategorised');

  const GUEST_CATEGORIES = [
    "Bridal Party",
    "Bride's Family",
    "Groom's Family",
    "Mutual Friends",
    "Work Colleagues",
    "VIP / Extended",
  ];

  const handleUpdateGuestCategory = (guestId: string, category: string) => {
    const updatedGuests = state.guests.map(g => (g.id === guestId ? { ...g, category } : g));
    setState({ ...state, guests: updatedGuests });
    showToast(\`Category updated to \${category}\`, 'success');
  };`;

// 2. Add category to new guest object
const newGuestTarget = `      reminderSent: false,
    };
    setState({
      ...state,
      guests: [newGuest, ...state.guests],
    });`;

const newGuestReplacement = `      category: newGuestCategory || 'Uncategorised',
      reminderSent: false,
    };
    setState({
      ...state,
      guests: [newGuest, ...state.guests],
    });`;

// 3. Update filteredGuests
const filterTarget = `  const filteredGuests = weddingGuests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.household.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.dietary.toLowerCase().includes(guestSearch.toLowerCase());
    const matchFilter = guestFilter === 'all' || g.rsvpStatus === guestFilter;
    return matchSearch && matchFilter;
  });`;

const filterReplacement = `  const filteredGuests = weddingGuests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.household.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.dietary.toLowerCase().includes(guestSearch.toLowerCase()) ||
      (g.category || '').toLowerCase().includes(guestSearch.toLowerCase());
    const matchFilter = guestFilter === 'all' || g.rsvpStatus === guestFilter;
    const matchCat =
      guestCategoryFilter === 'all'
        ? true
        : guestCategoryFilter === 'needs_category'
        ? (!g.category || g.category === 'Uncategorised')
        : g.category === guestCategoryFilter;
    return matchSearch && matchFilter && matchCat;
  });

  const uncategorisedCount = weddingGuests.filter(g => !g.category || g.category === 'Uncategorised').length;
  const bridalPartyCount = weddingGuests.filter(g => g.category === 'Bridal Party').length;
  const brideFamCount = weddingGuests.filter(g => g.category === "Bride's Family").length;
  const groomFamCount = weddingGuests.filter(g => g.category === "Groom's Family").length;
  const friendsCount = weddingGuests.filter(g => g.category === 'Mutual Friends' || g.category === 'Friends').length;
  const colleaguesCount = weddingGuests.filter(g => g.category === 'Work Colleagues' || g.category === 'Colleagues').length;`;

// 4. Update the Guest List table and filter bar
const tableTarget = `            {/* Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="flex-1 max-w-[280px] bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
                <select
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value as any)}
                  className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none"
                >
                  <option value="all">All RSVP Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="awaiting">Awaiting</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                      <th className="py-2.5 px-3">GUEST / HOUSEHOLD</th>
                      <th className="py-2.5 px-3">CONTACT</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">PARTY</th>
                      <th className="py-2.5 px-3">DIETARY</th>
                      <th className="py-2.5 px-3">TABLE</th>
                      <th className="py-2.5 px-3">ACTIONS</th>
                    </tr>
                  </thead>`;

const tableReplacement = `            {/* Uncategorised Alert Banner */}
            {uncategorisedCount > 0 && (
              <div className="bg-[#fff9eb] border border-[#f5d07e] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ebd296] text-[#6e4e1a] flex items-center justify-center text-lg font-bold shrink-0">
                    🏷️
                  </div>
                  <div>
                    <div className="font-bold text-[#15110e] text-sm">
                      {uncategorisedCount} {uncategorisedCount === 1 ? 'Guest Needs' : 'Guests Need'} Categorisation
                    </div>
                    <div className="text-xs text-[#8b7b6b]">
                      Assign categorical groups (Bride's Family, Groom's Family, Bridal Party, Mutual Friends) to streamline table seating &amp; reception coordination.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setGuestCategoryFilter(guestCategoryFilter === 'needs_category' ? 'all' : 'needs_category')}
                    className="px-3 py-1.5 rounded-lg bg-[#15110e] text-[#dfc194] text-xs font-bold hover:bg-[#251e18] transition-colors cursor-pointer"
                  >
                    {guestCategoryFilter === 'needs_category' ? 'Show All Guests' : \`View Uncategorised (\${uncategorisedCount})\`}
                  </button>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap items-center justify-between">
                <div className="flex gap-3 flex-wrap flex-1">
                  <input
                    type="text"
                    placeholder="Search guests by name, household, or category..."
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    className="flex-1 min-w-[220px] max-w-[320px] bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                  <select
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(e.target.value as any)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none"
                  >
                    <option value="all">All RSVP Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="awaiting">Awaiting</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div className="text-xs text-[#8b7b6b]">
                  Showing <strong className="text-[#15110e]">{filteredGuests.length}</strong> of {weddingGuests.length} guests
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-[#f2ece3] pt-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] mr-1 shrink-0">GROUP:</span>
                {[
                  { id: 'all', label: \`All (\${weddingGuests.length})\` },
                  { id: 'needs_category', label: \`⚠️ Needs Category (\${uncategorisedCount})\`, highlight: uncategorisedCount > 0 },
                  { id: 'Bridal Party', label: \`Bridal Party (\${bridalPartyCount})\` },
                  { id: "Bride's Family", label: \`Bride's Family (\${brideFamCount})\` },
                  { id: "Groom's Family", label: \`Groom's Family (\${groomFamCount})\` },
                  { id: 'Mutual Friends', label: \`Friends (\${friendsCount})\` },
                  { id: 'Work Colleagues', label: \`Colleagues (\${colleaguesCount})\` },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setGuestCategoryFilter(p.id)}
                    className={\`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors \${
                      guestCategoryFilter === p.id
                        ? 'bg-[#15110e] text-[#dfc194] shadow-2xs font-bold'
                        : p.highlight
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold hover:bg-amber-200'
                        : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                    }\`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                      <th className="py-2.5 px-3">GUEST / HOUSEHOLD</th>
                      <th className="py-2.5 px-3">CATEGORY</th>
                      <th className="py-2.5 px-3">CONTACT</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3">PARTY</th>
                      <th className="py-2.5 px-3">DIETARY</th>
                      <th className="py-2.5 px-3">TABLE</th>
                      <th className="py-2.5 px-3">ACTIONS</th>
                    </tr>
                  </thead>`;

// 5. In table row, add category selector cell
const rowTarget = `                        <td className="py-3 px-3">
                          <strong className="text-sm text-[#15110e] block">{g.name}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{g.household}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[#15110e] font-medium">{g.phone || '0412 884 992'}</div>
                          <div className="text-[11px] text-[#8b7b6b]">{g.email}</div>
                        </td>`;

const rowReplacement = `                        <td className="py-3 px-3">
                          <strong className="text-sm text-[#15110e] block">{g.name}</strong>
                          <span className="text-[11px] text-[#8b7b6b]">{g.household}</span>
                        </td>
                        <td className="py-3 px-3">
                          {!g.category || g.category === 'Uncategorised' ? (
                            <div className="flex items-center gap-1">
                              <select
                                value=""
                                onChange={(e) => handleUpdateGuestCategory(g.id, e.target.value)}
                                className="text-[11px] font-bold bg-[#fff8e7] hover:bg-[#ffefc9] text-[#9b681e] border border-[#f1c583] rounded-md px-2 py-1 outline-none cursor-pointer transition-colors shadow-2xs"
                              >
                                <option value="" disabled>+ Categorise Guest</option>
                                {GUEST_CATEGORIES.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <select
                                value={g.category}
                                onChange={(e) => handleUpdateGuestCategory(g.id, e.target.value)}
                                className={\`text-[10.5px] rounded-md px-2 py-0.5 border cursor-pointer outline-none transition-colors \${
                                  g.category === 'Bridal Party'
                                    ? 'bg-amber-100 text-amber-900 border-[#bd9661] font-bold'
                                    : g.category === "Bride's Family"
                                    ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                                    : g.category === "Groom's Family"
                                    ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                                    : g.category === 'Mutual Friends' || g.category === 'Friends'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                                    : g.category === 'Work Colleagues' || g.category === 'Colleagues'
                                    ? 'bg-purple-50 text-purple-800 border-purple-200 font-semibold'
                                    : 'bg-stone-50 text-stone-700 border-stone-200 font-semibold'
                                }\`}
                              >
                                {GUEST_CATEGORIES.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                                <option value="Uncategorised">Uncategorised</option>
                              </select>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[#15110e] font-medium">{g.phone || '0412 884 992'}</div>
                          <div className="text-[11px] text-[#8b7b6b]">{g.email}</div>
                        </td>`;

// 6. In Add Guest modal, add category field
const modalFieldTarget = `                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      DIETARY REQUIREMENTS
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Gluten-free (optional)"
                      value={newGuestDiet}
                      onChange={(e) => setNewGuestDiet(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-md px-3 py-1.5 text-xs text-[#15110e] outline-none"
                    />
                  </div>`;

const modalFieldReplacement = `                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      GUEST CATEGORY / GROUP
                    </label>
                    <select
                      value={newGuestCategory}
                      onChange={(e) => setNewGuestCategory(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-md px-3 py-1.5 text-xs text-[#15110e] outline-none"
                    >
                      <option value="Uncategorised">Uncategorised (Assign later)</option>
                      {GUEST_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b7b6b] mb-1">
                      DIETARY REQUIREMENTS
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Gluten-free (optional)"
                      value={newGuestDiet}
                      onChange={(e) => setNewGuestDiet(e.target.value)}
                      className="w-full bg-white border border-[#d5c7b5] focus:border-[#bd9661] rounded-md px-3 py-1.5 text-xs text-[#15110e] outline-none"
                    />
                  </div>`;

// Apply replacements with newline normalization
let norm = content.replace(/\r\n/g, '\n');

if (norm.includes(stateTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(stateTarget.replace(/\r\n/g, '\n'), stateReplacement);
  console.log('1. State replaced!');
} else {
  console.error('1. State NOT found!');
}

if (norm.includes(newGuestTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(newGuestTarget.replace(/\r\n/g, '\n'), newGuestReplacement);
  console.log('2. New guest replaced!');
} else {
  console.error('2. New guest NOT found!');
}

if (norm.includes(filterTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(filterTarget.replace(/\r\n/g, '\n'), filterReplacement);
  console.log('3. Filter replaced!');
} else {
  console.error('3. Filter NOT found!');
}

if (norm.includes(tableTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(tableTarget.replace(/\r\n/g, '\n'), tableReplacement);
  console.log('4. Table replaced!');
} else {
  console.error('4. Table NOT found!');
}

if (norm.includes(rowTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(rowTarget.replace(/\r\n/g, '\n'), rowReplacement);
  console.log('5. Row replaced!');
} else {
  console.error('5. Row NOT found!');
}

if (norm.includes(modalFieldTarget.replace(/\r\n/g, '\n'))) {
  norm = norm.replace(modalFieldTarget.replace(/\r\n/g, '\n'), modalFieldReplacement);
  console.log('6. Modal field replaced!');
} else {
  console.error('6. Modal field NOT found!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('CoupleView.tsx updated with guest categorisation!');
