import fs from 'fs';

const filePath = 'src/components/CoupleView.tsx';
let content = fs.readFileSync(filePath, 'utf8');
let norm = content.replace(/\r\n/g, '\n');

// 1. Remove Uncategorised Alert Banner
const bannerTarget = `            {/* Uncategorised Alert Banner */}
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

`;

if (norm.includes(bannerTarget)) {
  norm = norm.replace(bannerTarget, '');
  console.log('1. Banner removed!');
} else {
  console.error('1. Banner NOT found!');
}

// 2. Replace 5-7 pills with 2 pills ("All" and "Needs Category") + filter dropdown
const pillsTarget = `              {/* Category Filter Pills */}
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
              </div>`;

const pillsReplacement = `              {/* Category Filter: 2 Pills ("All" and "Needs Category") + Category Filter Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f2ece3] pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestCategoryFilter('all')}
                    className={\`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors \${
                      guestCategoryFilter === 'all'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-2xs font-bold'
                        : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                    }\`}
                  >
                    All (\${weddingGuests.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuestCategoryFilter('needs_category')}
                    className={\`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors \${
                      guestCategoryFilter === 'needs_category'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-2xs font-bold'
                        : uncategorisedCount > 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold hover:bg-amber-200'
                        : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                    }\`}
                  >
                    ⚠️ Needs Category (\${uncategorisedCount})
                  </button>
                </div>

                {/* Filter dropdown that shows each individual category */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">FILTER CATEGORY:</span>
                  <select
                    value={guestCategoryFilter === 'needs_category' ? 'all' : guestCategoryFilter}
                    onChange={(e) => setGuestCategoryFilter(e.target.value)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-2.5 py-1 text-xs text-[#15110e] outline-none cursor-pointer focus:border-[#bd9661]"
                  >
                    <option value="all">All Categories</option>
                    {GUEST_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>`;

if (norm.includes(pillsTarget)) {
  norm = norm.replace(pillsTarget, pillsReplacement);
  console.log('2. 2-pill + dropdown replacement applied!');
} else {
  console.error('2. pillsTarget NOT found!');
}

// 3. Update tab label when isMcView: 'Gift & Wishing Well Ledger'
const tabLabelTarget = `              {
                id: 'gifts',
                label: 'Gift & Thank-You',`;

const tabLabelReplacement = `              {
                id: 'gifts',
                label: isMcView ? 'Gift & Wishing Well Ledger' : 'Gift & Thank-You',`;

if (norm.includes(tabLabelTarget)) {
  norm = norm.replace(tabLabelTarget, tabLabelReplacement);
  console.log('3. Tab label updated!');
} else {
  console.error('3. Tab label NOT found!');
}

// 4. Update tab title when isMcView
const titleTarget = `<h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Gift &amp; Thank-You Manager
                </h1>`;

const titleReplacement = `<h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  {isMcView ? 'Gift &amp; Wishing Well Ledger' : 'Gift &amp; Thank-You Manager'}
                </h1>`;

if (norm.includes(titleTarget)) {
  norm = norm.replace(titleTarget, titleReplacement);
  console.log('4. Tab title updated!');
} else {
  console.error('4. Title target NOT found!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('CoupleView.tsx updated!');
