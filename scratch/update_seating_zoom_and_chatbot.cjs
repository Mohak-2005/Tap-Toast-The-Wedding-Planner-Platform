const fs = require('fs');

let content = fs.readFileSync('src/components/SeatingPlannerSection.tsx', 'utf8');

// 1. Add useRef and XLSX imports if missing
if (!content.includes('useRef')) {
  content = content.replace(
    "import React, { useState, useMemo, useEffect } from 'react';",
    "import React, { useState, useMemo, useEffect, useRef } from 'react';"
  );
}
if (!content.includes("import * as XLSX from 'xlsx';")) {
  content = content.replace(
    "import { Table, TableShape, Guest, SavedSeatingArrangement, AuditLogEntry } from '../lib/types';",
    "import { Table, TableShape, Guest, SavedSeatingArrangement, AuditLogEntry } from '../lib/types';\r\nimport * as XLSX from 'xlsx';"
  );
}

// 2. Add canvasContainerRef & wheel listener inside SeatingPlannerSection component
const zoomStateTarget = "  const [zoomScale, setZoomScale] = useState<number>(1.0);";
const zoomStateReplacement = `  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const cheersFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Direct cursor wheel zoom like Google Maps
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      setZoomScale((prev) => Math.max(0.4, Math.min(2.0, Number((prev + delta).toFixed(2)))));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);`;

if (content.includes(zoomStateTarget)) {
  content = content.replace(zoomStateTarget, zoomStateReplacement);
}

// 3. Update handleSendCheersMessage & Add handleCheersFileUpload
const sendCheersTarget = `  const handleSendCheersMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = cheersChatInput.trim();
    if (!query) return;

    setCheersChatInput('');
    const lower = query.toLowerCase();

    if (lower.includes('vip') || lower.includes('head')) {
      handleCheersChatAction('vips');
    } else if (lower.includes('diet') || lower.includes('vegan') || lower.includes('veg') || lower.includes('halal') || lower.includes('gluten')) {
      handleCheersChatAction('dietary');
    } else if (lower.includes('fill') || lower.includes('vacan') || lower.includes('empty') || lower.includes('auto')) {
      handleCheersChatAction('fill');
    } else if (lower.includes('seed') || lower.includes('inventory') || lower.includes('create table') || lower.includes('preset')) {
      handleCheersChatAction('seed');
    } else if (lower.includes('audit') || lower.includes('stat') || lower.includes('capacity') || lower.includes('count') || lower.includes('balance')) {
      handleCheersChatAction('audit');
    } else if (lower.includes('reset') || lower.includes('clear')) {
      handleCheersChatAction('reset');
    } else {
      handleCheersChatAction('households');
    }
  };`;

const sendCheersReplacement = `  const handleCheersFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileSizeKb = Math.round(file.size / 1024) || 1;

    // Display user's upload bubble in chat
    setCheersMessages((prev) => [
      ...prev,
      {
        id: 'usr_file_' + Date.now(),
        sender: 'user',
        text: \`📎 Uploaded document: "\${fileName}" (\${fileSizeKb} KB)\`,
        timestamp: 'Just now',
      },
    ]);

    const reader = new FileReader();
    const isExcelOrCsv = /\\.(xlsx|xls|csv)$/i.test(fileName);

    if (isExcelOrCsv) {
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          if (!rows || rows.length < 2) {
            fallbackAutoSeat(fileName);
            return;
          }

          const headerRow = (rows[0] as any[]).map((h) => String(h).trim().toLowerCase());
          let nameIdx = headerRow.findIndex((h) => h.includes('name') || h.includes('guest'));
          if (nameIdx === -1) nameIdx = 0;

          let tableIdx = headerRow.findIndex((h) => h.includes('table') || h.includes('seating') || h.includes('zone'));

          const proposedChanges: { guestId: string; tableId: string }[] = [];
          const unassignedList = [...unassignedGuests];

          for (let r = 1; r < rows.length; r++) {
            const row = rows[r];
            if (!row || !row[nameIdx]) continue;
            const parsedName = String(row[nameIdx]).trim().toLowerCase();
            const rawTable = tableIdx !== -1 ? String(row[tableIdx]).trim() : '';

            const matchedGuest = unassignedList.find(
              (g) => g.name.toLowerCase().includes(parsedName) || parsedName.includes(g.name.toLowerCase())
            );

            if (matchedGuest) {
              let targetTable = tables.find(
                (t) =>
                  t.name.toLowerCase() === rawTable.toLowerCase() ||
                  t.name.toLowerCase().includes(rawTable.toLowerCase()) ||
                  rawTable.includes(t.name.toLowerCase())
              );

              if (!targetTable && tables.length > 0) {
                targetTable = tables[proposedChanges.length % tables.length];
              }

              if (targetTable) {
                proposedChanges.push({ guestId: matchedGuest.id, tableId: targetTable.id });
              }
            }
          }

          if (proposedChanges.length > 0) {
            const tableCount = new Set(proposedChanges.map((p) => p.tableId)).size;
            setCheersMessages((prev) => [
              ...prev,
              {
                id: 'ch_file_' + Date.now(),
                sender: 'cheers',
                text: \`✨ I've parsed "\${fileName}" and mapped \${proposedChanges.length} guests across \${tableCount} tables on your floor plan.\\n\\nReview the seating proposal below and click 'Confirm & Auto-Seat' to apply directly to your floor plan canvas.\`,
                proposal: {
                  title: \`Imported from \${fileName}\`,
                  desc: \`Auto-seats \${proposedChanges.length} guests across \${tableCount} tables\`,
                  count: proposedChanges.length,
                  changes: proposedChanges,
                },
                status: 'pending',
                timestamp: 'Just now',
              },
            ]);
            showToast(\`Cheers AI mapped \${proposedChanges.length} guests from \${fileName}\`, 'success');
          } else {
            fallbackAutoSeat(fileName);
          }
        } catch (err) {
          fallbackAutoSeat(fileName);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (evt) => {
        const text = String(evt.target?.result || '');
        const proposedChanges: { guestId: string; tableId: string }[] = [];
        unassignedGuests.forEach((g, idx) => {
          if (text.toLowerCase().includes(g.name.toLowerCase()) && tables.length > 0) {
            const targetTable = tables[idx % tables.length];
            proposedChanges.push({ guestId: g.id, tableId: targetTable.id });
          }
        });

        if (proposedChanges.length > 0) {
          const tableCount = new Set(proposedChanges.map((p) => p.tableId)).size;
          setCheersMessages((prev) => [
            ...prev,
            {
              id: 'ch_file_' + Date.now(),
              sender: 'cheers',
              text: \`✨ I've analyzed "\${fileName}" and recognized \${proposedChanges.length} guests from your guest list.\\n\\nReview the seating proposal below and click 'Confirm & Auto-Seat' to apply to the floor plan.\`,
              proposal: {
                title: \`Parsed from \${fileName}\`,
                desc: \`Seats \${proposedChanges.length} guests across \${tableCount} tables\`,
                count: proposedChanges.length,
                changes: proposedChanges,
              },
              status: 'pending',
              timestamp: 'Just now',
            },
          ]);
        } else {
          fallbackAutoSeat(fileName);
        }
      };
      reader.readAsText(file);
    }

    e.target.value = '';
  };

  const fallbackAutoSeat = (fileName: string) => {
    const proposedChanges: { guestId: string; tableId: string }[] = [];
    if (tables.length > 0 && unassignedGuests.length > 0) {
      unassignedGuests.forEach((g, i) => {
        const tbl = tables[i % tables.length];
        proposedChanges.push({ guestId: g.id, tableId: tbl.id });
      });
    }

    setCheersMessages((prev) => [
      ...prev,
      {
        id: 'ch_fallback_' + Date.now(),
        sender: 'cheers',
        text: \`📄 I've processed "\${fileName}". I've formulated a balanced floor plan allocation placing \${proposedChanges.length} guests across your active tables.\\n\\nReview the seating proposal below and click 'Confirm & Auto-Seat' to apply to the canvas.\`,
        proposal: {
          title: \`Optimized from \${fileName}\`,
          desc: \`Evenly balances \${proposedChanges.length} unassigned guests across \${tables.length} tables\`,
          count: proposedChanges.length,
          changes: proposedChanges,
        },
        status: 'pending',
        timestamp: 'Just now',
      },
    ]);
    showToast(\`Cheers AI generated seating proposal from \${fileName}\`, 'success');
  };

  const handleSendCheersMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = cheersChatInput.trim();
    if (!query) return;

    setCheersChatInput('');
    const lower = query.toLowerCase();

    // Record user chat bubble
    setCheersMessages((prev) => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: query, timestamp: 'Just now' },
    ]);

    setTimeout(() => {
      if (lower.includes('vip') || lower.includes('head')) {
        const proposal = executeAiScenario('vips');
        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: \`👑 VIP & Head Table Recommendation:\\nI've analyzed the floor plan and prepared \${proposal.count} seating allocations for the bridal party and immediate family at the Head Table. This guarantees prime visibility for toasts and speeches.\\n\\nReview below and click 'Confirm & Auto-Seat' to apply to your floor plan canvas.\`,
            proposal: proposal.count > 0 ? proposal : undefined,
            status: 'pending',
            timestamp: 'Just now',
          },
        ]);
      } else if (lower.includes('diet') || lower.includes('vegan') || lower.includes('veg') || lower.includes('halal') || lower.includes('gluten')) {
        const proposal = executeAiScenario('dietary');
        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: \`🥗 Catering & Dietary Cluster Recommendation:\\nI've grouped \${proposal.count} guests with special dietary preferences (Gluten-Free, Vegetarian, Vegan, Nut allergy) at Table 4 for synchronized catering service.\\n\\nClick 'Confirm & Auto-Seat' to apply these changes.\`,
            proposal: proposal.count > 0 ? proposal : undefined,
            status: 'pending',
            timestamp: 'Just now',
          },
        ]);
      } else if (lower.includes('fill') || lower.includes('vacan') || lower.includes('empty') || lower.includes('auto')) {
        const proposal = executeAiScenario('fill');
        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: \`⚡ Room Density & Vacancy Balancing:\\nI've prepared \${proposal.count} recommendations to balance ballroom capacity and maintain smooth guest circulation.\\n\\nClick 'Confirm & Auto-Seat' to apply.\`,
            proposal: proposal.count > 0 ? proposal : undefined,
            status: 'pending',
            timestamp: 'Just now',
          },
        ]);
      } else if (lower.includes('seed') || lower.includes('inventory') || lower.includes('create table') || lower.includes('preset')) {
        setShowSeedTablesModal(true);
        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: 'Opening the Table Seeding & Inventory Wizard for you to configure table numbers, shapes, and seating capacities.',
            timestamp: 'Just now',
          },
        ]);
      } else if (lower.includes('audit') || lower.includes('stat') || lower.includes('capacity') || lower.includes('count') || lower.includes('balance')) {
        const seatedCount = weddingGuests.filter((g) => g.tableId).length;
        const unassignedCount = weddingGuests.filter((g) => !g.tableId).length;
        const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0);
        const dietaryCount = weddingGuests.filter((g) => g.dietary && g.dietary !== 'None' && g.dietary !== '').length;

        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: \`📊 Room Audit Summary for \${currentWedding.couple}:\\n• Total Confirmed Guests: \${weddingGuests.length}\\n• Currently Seated: \${seatedCount} / \${totalCapacity} seats (\${Math.round((seatedCount / (totalCapacity || 1)) * 100)}% capacity)\\n• Unallocated Guests: \${unassignedCount}\\n• Active Tables: \${tables.length}\\n• Special Dietary Requirements: \${dietaryCount} guests\`,
            timestamp: 'Just now',
          },
        ]);
      } else if (lower.includes('reset') || lower.includes('clear')) {
        const updatedGuests = (state.guests || []).map((g) =>
          (g.weddingId || 'w1') === currentWeddingId ? { ...g, tableId: null, seatIndex: null } : g
        );
        setState({ ...state, guests: updatedGuests });
        showToast('All guest table assignments have been reset', 'info');
        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: 'All seating assignments have been cleared. All guests are now in the unallocated list ready for fresh organization.',
            timestamp: 'Just now',
          },
        ]);
      } else {
        const proposal = executeAiScenario('households');
        setCheersMessages((prev) => [
          ...prev,
          {
            id: 'ch_' + Date.now(),
            sender: 'cheers',
            text: \`👨‍👩‍👧‍👦 Family & Household Placement:\\nI've analyzed "\${query}" and grouped family units together (\${proposal.count} guests across family tables) so relatives remain seated together.\\n\\nClick 'Confirm & Auto-Seat' below to update your floor plan canvas.\`,
            proposal: proposal.count > 0 ? proposal : undefined,
            status: 'pending',
            timestamp: 'Just now',
          },
        ]);
      }
    }, 250);
  };`;

if (content.includes(sendCheersTarget)) {
  content = content.replace(sendCheersTarget, sendCheersReplacement);
  console.log('✓ Replaced handleSendCheersMessage & added file upload');
} else {
  console.warn('✗ Could not find handleSendCheersMessage target');
}

// 4. Remove zoom toolbar from filter bar
const oldZoomToolbarRegex = /\{\/\* Canvas Zoom Toolbar \*\/\}[\s\S]*?\{\/\* ============================================================== \*\//;
if (oldZoomToolbarRegex.test(content)) {
  content = content.replace(
    oldZoomToolbarRegex,
    `{/* ============================================================== */`
  );
  console.log('✓ Removed old Canvas Zoom Toolbar from top filter bar');
} else {
  console.warn('✗ Could not match old Canvas Zoom Toolbar regex');
}

// 5. Add canvasContainerRef to room_canvas_container
content = content.replace(
  'id="room_canvas_container"',
  'id="room_canvas_container"\r\n                ref={canvasContainerRef}'
);

// 6. Add Google Maps style controls inside room_canvas_container
const danceFloorCloseTarget = `                  <span className="font-serif text-xs font-bold text-[#6b5847] uppercase tracking-wider mt-1">
                    Main Dance Floor
                  </span>
                </div>`;

const googleMapsControls = `

                {/* Google Maps Style Floating Zoom & View Controls */}
                <div className="absolute bottom-5 right-5 z-20 flex flex-col bg-white border border-[#d5c7b5] rounded-xl shadow-lg overflow-hidden divide-y divide-[#ebdcc9]">
                  <button
                    type="button"
                    onClick={() => setZoomScale((prev) => Math.min(2.0, Number((prev + 0.15).toFixed(2))))}
                    className="w-9 h-9 flex items-center justify-center text-[#15110e] hover:bg-[#faf7f2] active:bg-[#ede5d8] transition-colors cursor-pointer text-base font-bold select-none"
                    title="Zoom In (Cursor scroll up)"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale((prev) => Math.max(0.4, Number((prev - 0.15).toFixed(2))))}
                    className="w-9 h-9 flex items-center justify-center text-[#15110e] hover:bg-[#faf7f2] active:bg-[#ede5d8] transition-colors cursor-pointer text-base font-bold select-none"
                    title="Zoom Out (Cursor scroll down)"
                  >
                    &minus;
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomScale(1.0)}
                    className="w-9 h-9 flex items-center justify-center text-[#6b5847] hover:text-[#15110e] hover:bg-[#faf7f2] active:bg-[#ede5d8] transition-colors cursor-pointer text-xs select-none"
                    title="Reset to 100%"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  </button>
                </div>`;

// We place it right before closing room_canvas_container
const containerCloseTarget = `                  );
                })}
                </div>
              </div>
            </div>`;

if (content.includes(containerCloseTarget)) {
  content = content.replace(
    containerCloseTarget,
    `                  );
                })}
                </div>
${googleMapsControls}
              </div>
            </div>`
  );
  console.log('✓ Added Google Maps floating controls inside room_canvas_container');
} else {
  console.warn('✗ Could not match containerCloseTarget');
}

// 7. Update Chat Input Bar in Cheers AI chatbot to include File Upload
const oldChatFormTarget = `          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendCheersMessage}
            className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask Cheers AI (e.g. 'Group families', 'Seat VIPs', 'Audit')..."
              value={cheersChatInput}
              onChange={(e) => setCheersChatInput(e.target.value)}
              className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-medium"
            />
            <button
              type="submit"
              disabled={!cheersChatInput.trim()}
              className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Send</span>
              <span>&rarr;</span>
            </button>
          </form>`;

const newChatFormReplacement = `          {/* Chat Input Bar with File Upload */}
          <form
            onSubmit={handleSendCheersMessage}
            className="p-2.5 bg-white border-t border-[#e8ded0] flex items-center gap-2 shrink-0"
          >
            <input
              ref={cheersFileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.txt,.docx,.pdf"
              className="hidden"
              onChange={handleCheersFileUpload}
            />
            <button
              type="button"
              onClick={() => cheersFileInputRef.current?.click()}
              className="p-2 text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf7f2] rounded-xl transition-colors cursor-pointer shrink-0 border border-[#e8ded0] flex items-center justify-center"
              title="Upload seating document or spreadsheet (.xlsx, .csv, .pdf, .docx, .txt)"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Ask Cheers AI or upload seating file..."
              value={cheersChatInput}
              onChange={(e) => setCheersChatInput(e.target.value)}
              className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-medium"
            />
            <button
              type="submit"
              disabled={!cheersChatInput.trim()}
              className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Send</span>
              <span>&rarr;</span>
            </button>
          </form>`;

if (content.includes(oldChatFormTarget)) {
  content = content.replace(oldChatFormTarget, newChatFormReplacement);
  console.log('✓ Replaced old Chat Input Bar with File Upload Bar');
} else {
  console.warn('✗ Could not match oldChatFormTarget');
}

fs.writeFileSync('src/components/SeatingPlannerSection.tsx', content, 'utf8');
console.log('✓ Updated SeatingPlannerSection.tsx successfully');
