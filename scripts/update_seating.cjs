const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'SeatingPlannerSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Table shape drilldown condition
content = content.replace(
  "{(activeTable.shape === 'round' && !activeTable.isHead) && (",
  "{activeTable.shape === 'round' && ("
);

content = content.replace(
  "{(activeTable.shape === 'rectangular' || activeTable.shape === 'king' || activeTable.isHead) && (",
  "{(activeTable.shape === 'rectangular' || activeTable.shape === 'king') && ("
);

// 2. Canvas table shape check
content = content.replace(
  "const isRound = tbl.shape === 'round' && !tbl.isHead;\n                  const isKing = tbl.shape === 'king';\n                  const isRect = tbl.shape === 'rectangular' || tbl.isHead;",
  "const isRound = tbl.shape === 'round';\n                  const isKing = tbl.shape === 'king';\n                  const isRect = tbl.shape === 'rectangular';"
);
// In case CRLF:
content = content.replace(
  "const isRound = tbl.shape === 'round' && !tbl.isHead;\r\n                  const isKing = tbl.shape === 'king';\r\n                  const isRect = tbl.shape === 'rectangular' || tbl.isHead;",
  "const isRound = tbl.shape === 'round';\r\n                  const isKing = tbl.shape === 'king';\r\n                  const isRect = tbl.shape === 'rectangular';"
);

// 3. Segmented control active state for shape
content = content.replace(
  "activeTable.shape === shp\n                        ? 'bg-[#15110e] text-[#dfc194]'",
  "(activeTable.shape === shp || (shp === 'rectangular' && activeTable.shape === 'king'))\n                        ? 'bg-[#15110e] text-[#dfc194]'"
);
content = content.replace(
  "activeTable.shape === shp\r\n                        ? 'bg-[#15110e] text-[#dfc194]'",
  "(activeTable.shape === shp || (shp === 'rectangular' && activeTable.shape === 'king'))\r\n                        ? 'bg-[#15110e] text-[#dfc194]'"
);

// 4. Remove green dot from floating launcher
content = content.replace(
  `<span className="text-lg">🥂</span>\n          <span>Cheers AI</span>\n          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />`,
  `<span className="text-lg">🥂</span>\n          <span>Cheers AI</span>`
);
content = content.replace(
  `<span className="text-lg">🥂</span>\r\n          <span>Cheers AI</span>\r\n          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />`,
  `<span className="text-lg">🥂</span>\r\n          <span>Cheers AI</span>`
);

// 5. Update executeAiScenario & handleCheersChatAction
const startMarker = "  // CHEERS AI CHATBOT ENGINE\r\n  // -------------------------------------------------------------\r\n  const executeAiScenario =";
const startMarkerLF = "  // CHEERS AI CHATBOT ENGINE\n  // -------------------------------------------------------------\n  const executeAiScenario =";

const endMarker = "  const handleSendCheersMessage = (e: React.FormEvent) => {";

const newScenarioBlock = `  // CHEERS AI CHATBOT ENGINE
  // -------------------------------------------------------------
  const executeAiScenario = (scenario: 'households' | 'vips' | 'fill' | 'dietary') => {
    setActiveAiScenario(scenario);
    let title = '';
    let desc = '';
    const proposedChanges: { guestId: string; tableId: string }[] = [];

    if (scenario === 'vips') {
      title = 'Seat VIPs & Bridal Party at Head Table';
      desc = 'Placed the bridal party and immediate family at the Head Table with premier visibility for speeches and photography.';
      const headTbl = tables.find((t) => t.isHead) || tables.find((t) => t.name.toLowerCase().includes('head')) || tables[0];
      if (headTbl) {
        const vipNames = ['Sophie Bell', 'James Gordon', 'Hannah Martin', 'Oliver Vance', 'Charlotte Evans', 'Liam Fletcher', 'Grace Kelly', 'Alexander White'];
        const matchedVips = weddingGuests.filter((g) =>
          vipNames.some((vn) => g.name.toLowerCase().includes(vn.toLowerCase())) ||
          g.household.toLowerCase().includes('bell') ||
          g.household.toLowerCase().includes('gordon') ||
          g.category === 'Bridal Party'
        );
        const candidates = matchedVips.length > 0 ? matchedVips : weddingGuests.slice(0, headTbl.capacity);
        candidates.slice(0, headTbl.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: headTbl.id });
        });
      }
    } else if (scenario === 'dietary') {
      title = 'Group Dietary Requirements for Catering';
      desc = 'Clustered guests with special dietary preferences (Gluten-Free, Vegan, Vegetarian, Nut allergy) at Table 4 for synchronized kitchen service.';
      const dietaryTbl = tables.find((t) => t.name.toLowerCase().includes('table 4')) || tables.find((t) => t.name.toLowerCase().includes('table 2')) || tables[1] || tables[0];
      if (dietaryTbl) {
        const dietaryGuests = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary.trim() !== '');
        const candidates = dietaryGuests.length > 0 ? dietaryGuests : weddingGuests.slice(0, dietaryTbl.capacity);
        candidates.slice(0, dietaryTbl.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: dietaryTbl.id });
        });
      }
    } else if (scenario === 'households') {
      title = 'Group Households & Families Together';
      desc = 'Paired family members and immediate relatives together into dedicated family tables so households remain seated together.';
      const familyTbl1 = tables.find((t) => t.name.toLowerCase().includes('table 1')) || tables[0];
      const familyTbl2 = tables.find((t) => t.name.toLowerCase().includes('table 3')) || tables[1];
      const bellFamily = weddingGuests.filter((g) => g.household.toLowerCase().includes('bell'));
      const gordonFamily = weddingGuests.filter((g) => g.household.toLowerCase().includes('gordon') || g.household.toLowerCase().includes('kelly'));

      if (familyTbl1 && bellFamily.length > 0) {
        bellFamily.slice(0, familyTbl1.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: familyTbl1.id });
        });
      }
      if (familyTbl2 && gordonFamily.length > 0) {
        gordonFamily.slice(0, familyTbl2.capacity).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: familyTbl2.id });
        });
      }
      if (proposedChanges.length === 0) {
        weddingGuests.slice(0, 8).forEach((g) => {
          proposedChanges.push({ guestId: g.id, tableId: (familyTbl1 || tables[0]).id });
        });
      }
    } else {
      title = 'Balanced Room & Vacancy Optimization';
      desc = 'Distributed unassigned guests evenly across all tables to balance ballroom capacity and guest flow.';
      const unassigned = weddingGuests.filter((g) => !g.tableId);
      const candidates = unassigned.length > 0 ? unassigned : weddingGuests.slice(0, 8);
      candidates.forEach((g, idx) => {
        const targetTbl = tables[idx % tables.length];
        if (targetTbl) {
          proposedChanges.push({ guestId: g.id, tableId: targetTbl.id });
        }
      });
    }

    return {
      title,
      desc,
      count: proposedChanges.length,
      changes: proposedChanges,
    };
  };

  const handleCheersChatAction = (action: 'households' | 'vips' | 'fill' | 'dietary' | 'audit' | 'seed' | 'reset') => {
    if (action === 'seed') {
      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '🌱 Open Table Seeding & Inventory Wizard', timestamp: 'Just now' },
        { id: 'ch_' + Date.now(), sender: 'cheers', text: 'Opening the Table Seeding & Inventory Wizard for you to configure table numbers, shapes, and seating capacities.', timestamp: 'Just now' },
      ]);
      setShowSeedTablesModal(true);
      return;
    }

    if (action === 'audit') {
      const seatedCount = weddingGuests.filter((g) => g.tableId).length;
      const unassignedCount = weddingGuests.filter((g) => !g.tableId).length;
      const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
      const dietaryCount = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary !== '').length;

      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '📊 Audit room capacity & seating balance', timestamp: 'Just now' },
        {
          id: 'ch_' + Date.now(),
          sender: 'cheers',
          text: \`Room Audit Summary for \${currentWedding.couple}:\\n• Total Confirmed Guests: \${weddingGuests.length}\\n• Currently Seated: \${seatedCount} / \${totalCapacity} seats (\${Math.round((seatedCount / (totalCapacity || 1)) * 100)}% capacity)\\n• Unallocated Guests: \${unassignedCount}\\n• Active Tables: \${tables.length}\\n• Special Dietary Requirements: \${dietaryCount} guests\`,
          timestamp: 'Just now',
        },
      ]);
      return;
    }

    if (action === 'reset') {
      const updatedGuests = (state.guests || []).map((g) =>
        (g.weddingId || 'w1') === currentWeddingId ? { ...g, tableId: null, seatIndex: null } : g
      );
      setState({ ...state, guests: updatedGuests });
      showToast('All guest table assignments have been reset', 'info');
      setCheersMessages((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), sender: 'user', text: '🧹 Reset all table assignments', timestamp: 'Just now' },
        { id: 'ch_' + Date.now(), sender: 'cheers', text: 'All seating assignments have been cleared. All guests are now in the unallocated list ready for fresh organization.', timestamp: 'Just now' },
      ]);
      return;
    }

    const proposal = executeAiScenario(action);
    const actionLabel = action === 'households' ? 'Group households & families' : action === 'vips' ? 'Seat VIPs at Head Table' : action === 'dietary' ? 'Cluster dietary requirements' : 'Auto-fill vacant seats';

    let introText = '';
    if (action === 'vips') {
      introText = \`👑 VIP & Head Table Recommendation:\\nI've analyzed the floor plan and prepared \${proposal.count} seating allocations for the bridal party and immediate family at the Head Table. This guarantees prime visibility for toasts and speeches.\\n\\nReview the proposed allocations below and click 'Apply This Seating Plan to Canvas' to update your layout.\`;
    } else if (action === 'dietary') {
      introText = \`🥗 Catering & Dietary Cluster Recommendation:\\nI've grouped \${proposal.count} guests with special dietary preferences (Gluten-Free, Vegetarian, Vegan, Nut allergy) at Table 4 for synchronized catering service.\\n\\nClick 'Apply This Seating Plan to Canvas' to apply these changes.\`;
    } else if (action === 'households') {
      introText = \`👨‍👩‍👧‍👦 Family & Household Placement:\\nI've grouped family units together (\${proposal.count} guests across family tables) so relatives remain seated together without splitting up parties.\\n\\nClick 'Apply This Seating Plan to Canvas' to update.\`;
    } else {
      introText = \`⚡ Room Density & Vacancy Balancing:\\nI've prepared \${proposal.count} recommendations to balance ballroom capacity and maintain smooth guest circulation.\`;
    }

    setCheersMessages((prev) => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: actionLabel, timestamp: 'Just now' },
      {
        id: 'ch_' + Date.now(),
        sender: 'cheers',
        text: introText,
        proposal: proposal.count > 0 ? proposal : undefined,
        timestamp: 'Just now',
      },
    ]);
  };\n\n`;

let startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  startIdx = content.indexOf(startMarkerLF);
}
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newScenarioBlock + content.substring(endIdx);
  console.log('Successfully replaced executeAiScenario block!');
} else {
  console.error('Could not find start or end marker', { startIdx, endIdx });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating SeatingPlannerSection.tsx');
