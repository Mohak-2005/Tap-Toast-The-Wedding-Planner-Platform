import fs from 'fs';

const filePath = 'src/components/McView.tsx';
let content = fs.readFileSync(filePath, 'utf8');
let norm = content.replace(/\r\n/g, '\n');

// 1. Remove from sidebar navigation
const sidebarGiftsTarget = `              {
                id: 'gifts',
                label: 'Gift Ledger & Wishing Well',
                badge: \`\${(state.gifts || []).reduce((sum, g) => sum + Number(g.amount || 0), 0).toLocaleString()}\`,
                icon: (
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="13" rx="2" />
                    <path d="M12 8v13" />
                    <path d="M19 8a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0-3-3 3 3 0 0 0-3 3" />
                  </svg>
                ),
              },`;

if (norm.includes(sidebarGiftsTarget)) {
  norm = norm.replace(sidebarGiftsTarget, '');
  console.log('1. Sidebar gifts item removed!');
} else {
  console.error('1. sidebarGiftsTarget NOT found!');
}

// 2. Remove activeTab === 'gifts' && !selectedWeddingId section
const activeTabGiftsTarget = `        {/* TAB: MC GIFT LEDGER & WISHING WELL RECONCILIATION */}
        {activeTab === 'gifts' && !selectedWeddingId && (
          <McGiftLedgerSection
            state={state}
            setState={setState}
            onAddGiftClick={() => setShowMcAddGiftModal(true)}
            mcGiftSearch={mcGiftSearch}
            setMcGiftSearch={setMcGiftSearch}
            mcGiftTypeFilter={mcGiftTypeFilter}
            setMcGiftTypeFilter={setMcGiftTypeFilter}
          />
        )}
`;

if (norm.includes(activeTabGiftsTarget)) {
  norm = norm.replace(activeTabGiftsTarget, '');
  console.log('2. activeTab gifts section removed!');
} else {
  console.error('2. activeTabGiftsTarget NOT found!');
}

fs.writeFileSync(filePath, norm, 'utf8');
console.log('McView.tsx sidebar updated!');
