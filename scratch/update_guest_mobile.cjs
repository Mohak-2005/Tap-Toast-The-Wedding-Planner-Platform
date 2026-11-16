const fs = require('fs');
const path = require('path');

// 1. Update seedData.ts
const seedFilePath = path.resolve('src/lib/seedData.ts');
let seedContent = fs.readFileSync(seedFilePath, 'utf8');

// Make table_7 an oval table in both saved arrangements and master tables
seedContent = seedContent.replace(
  `{ id: 'table_7', weddingId: 'w1', name: 'Table 7', capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 60, y: 65 }`,
  `{ id: 'table_7', weddingId: 'w1', name: 'Table 7 (Oval)', capacity: 8, isHead: false, shape: 'oval', category: 'Friends', zone: 'Center Ballroom', x: 60, y: 65 }`
);

seedContent = seedContent.replace(
  `{ id: "table_7", weddingId: "w1", name: "Table 7", capacity: 8, isHead: false, shape: 'round', category: 'Friends', zone: 'Center Ballroom', x: 60, y: 65 },`,
  `{ id: "table_7", weddingId: "w1", name: "Table 7 (Oval)", capacity: 8, isHead: false, shape: 'oval', category: 'Friends', zone: "Center Ballroom", x: 60, y: 65 },`
);

// Add allowGuestsSeeTablemates: true to wedding in seedData
if (!seedContent.includes('allowGuestsSeeTablemates:')) {
  seedContent = seedContent.replace(
    `danceFloorPos: { x: 50, y: 50 },`,
    `danceFloorPos: { x: 50, y: 50 },
      allowGuestsSeeTablemates: true,`
  );
}

fs.writeFileSync(seedFilePath, seedContent, 'utf8');
console.log('Successfully updated seedData.ts!');

// 2. Update GuestMobileView.tsx
const guestFilePath = path.resolve('src/components/GuestMobileView.tsx');
let guestContent = fs.readFileSync(guestFilePath, 'utf8');

const oldTableSetup = `          {activeTab === 'table' && (() => {
            const priyaGuest = state.guests.find(g => g.id === 'priya' || g.name.toLowerCase().includes('priya'));
            const myTable = priyaGuest?.tableId ? state.tables.find(t => t.id === priyaGuest.tableId) : null;
            const tableGuests = myTable ? state.guests.filter(g => g.tableId === myTable.id) : [];
            const capacity = myTable?.capacity || 8;
            const mySeatIndex = priyaGuest?.seatIndex ?? 3;`;

const newTableSetup = `          {activeTab === 'table' && (() => {
            const priyaGuest = state.guests.find(g => g.id === 'priya' || g.name.toLowerCase().includes('priya'));
            const myTable = priyaGuest?.tableId ? state.tables.find(t => t.id === priyaGuest.tableId) : null;
            const tableGuests = myTable ? state.guests.filter(g => g.tableId === myTable.id) : [];
            const capacity = myTable?.capacity || 8;
            const mySeatIndex = priyaGuest?.seatIndex ?? 3;
            const currentWedding = state.weddings?.[0];
            const allowTablemates = currentWedding?.allowGuestsSeeTablemates !== false;`;

if (!guestContent.includes('allowTablemates = currentWedding?.allowGuestsSeeTablemates')) {
  guestContent = guestContent.replace(oldTableSetup, newTableSetup);
}

// In the circular diagram seats:
const oldOccupantBadge = `                          const occupant = tableGuests.find((g) => g.seatIndex === idx) || (idx === mySeatIndex ? priyaGuest : null);
                          const isMe = occupant?.id === priyaGuest?.id || idx === mySeatIndex;
                          const initials = isMe ? 'PS' : occupant ? (occupant.initials || occupant.name.slice(0, 2).toUpperCase()) : \`#\${idx + 1}\`;

                          return (
                            <div
                              key={idx}
                              style={{
                                transform: \`translate(\${x}px, \${y}px)\`,
                              }}
                              className={\`absolute w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs cursor-pointer \${
                                isMe
                                  ? 'bg-[#dfc194] text-[#15110e] border-2 border-[#15110e] ring-2 ring-[#bd9661] z-20'
                                  : occupant
                                  ? 'bg-[#15110e] text-[#dfc194] border border-[#3d2e24]'
                                  : 'bg-white text-[#8b7b6b] border border-dashed border-[#d5c7b5]'
                              }\`}
                              title={occupant ? \`\${occupant.name}\${isMe ? ' (You)' : ''}\` : \`Vacant Seat \${idx + 1}\`}
                            >
                              {initials}
                            </div>
                          );`;

const newOccupantBadge = `                          const occupant = tableGuests.find((g) => g.seatIndex === idx) || (idx === mySeatIndex ? priyaGuest : null);
                          const isMe = occupant?.id === priyaGuest?.id || idx === mySeatIndex;
                          const initials = isMe
                            ? 'PS'
                            : !allowTablemates
                            ? \`#\${idx + 1}\`
                            : occupant
                            ? (occupant.initials || occupant.name.slice(0, 2).toUpperCase())
                            : \`#\${idx + 1}\`;

                          return (
                            <div
                              key={idx}
                              style={{
                                transform: \`translate(\${x}px, \${y}px)\`,
                              }}
                              className={\`absolute w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs cursor-pointer \${
                                isMe
                                  ? 'bg-[#dfc194] text-[#15110e] border-2 border-[#15110e] ring-2 ring-[#bd9661] z-20'
                                  : occupant && allowTablemates
                                  ? 'bg-[#15110e] text-[#dfc194] border border-[#3d2e24]'
                                  : occupant && !allowTablemates
                                  ? 'bg-[#faf6ee] text-[#8b7b6b] border border-[#d5c7b5]'
                                  : 'bg-white text-[#8b7b6b] border border-dashed border-[#d5c7b5]'
                              }\`}
                              title={
                                isMe
                                  ? \`\${priyaGuest?.name || 'Priya Sharma'} (You)\`
                                  : !allowTablemates
                                  ? \`Seat \${idx + 1} (Private)\`
                                  : occupant
                                  ? occupant.name
                                  : \`Vacant Seat \${idx + 1}\`
                              }
                            >
                              {initials}
                            </div>
                          );`;

guestContent = guestContent.replace(oldOccupantBadge, newOccupantBadge);

// In the Tablemates List:
const oldTablematesList = `                {/* Tablemates List */}
                {myTable && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-serif text-base font-bold text-[#15110e]">
                        Your Tablemates
                      </h3>
                      <span className="text-xs text-[#8b7b6b]">
                        {tableGuests.length} Guests
                      </span>
                    </div>

                    {tableGuests.map((guest, idx) => {
                      const isMe = guest.id === priyaGuest?.id;
                      return (
                        <div
                          key={guest.id || idx}
                          className={\`bg-white border rounded-xl p-3 flex items-center justify-between shadow-xs \${
                            isMe ? 'border-[#bd9661] bg-[#faf8f5]' : 'border-[#e8ded0]'
                          }\`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={\`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold \${
                                isMe ? 'bg-[#bd9661] text-[#15110e]' : 'bg-[#15110e] text-[#dfc194]'
                              }\`}
                            >
                              {guest.initials || guest.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#15110e] flex items-center gap-1.5">
                                <span>{guest.name}</span>
                                {isMe && <span className="text-[10px] bg-[#bd9661]/20 text-[#916c3d] px-1 rounded font-bold">You</span>}
                              </div>
                              <div className="text-[10px] text-[#8b7b6b]">
                                Seat {(guest.seatIndex !== undefined && guest.seatIndex !== null) ? guest.seatIndex + 1 : idx + 1}
                                {guest.household && \` • \${guest.household}\`}
                              </div>
                            </div>
                          </div>
                          {guest.dietary && guest.dietary !== 'None' && (
                            <span className="text-[9.5px] bg-[#fff1f0] text-[#c93b2b] px-2 py-0.5 rounded-full font-semibold">
                              {guest.dietary}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}`;

const newTablematesList = `                {/* Tablemates List */}
                {myTable && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="font-serif text-base font-bold text-[#15110e]">
                        Your Tablemates
                      </h3>
                      <span className="text-xs text-[#8b7b6b]">
                        {allowTablemates ? \`\${tableGuests.length} Guests\` : 'Private Setting'}
                      </span>
                    </div>

                    {allowTablemates ? (
                      tableGuests.map((guest, idx) => {
                        const isMe = guest.id === priyaGuest?.id;
                        return (
                          <div
                            key={guest.id || idx}
                            className={\`bg-white border rounded-xl p-3 flex items-center justify-between shadow-xs \${
                              isMe ? 'border-[#bd9661] bg-[#faf8f5]' : 'border-[#e8ded0]'
                            }\`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={\`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold \${
                                  isMe ? 'bg-[#bd9661] text-[#15110e]' : 'bg-[#15110e] text-[#dfc194]'
                                }\`}
                              >
                                {guest.initials || guest.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[#15110e] flex items-center gap-1.5">
                                  <span>{guest.name}</span>
                                  {isMe && <span className="text-[10px] bg-[#bd9661]/20 text-[#916c3d] px-1 rounded font-bold">You</span>}
                                </div>
                                <div className="text-[10px] text-[#8b7b6b]">
                                  Seat {(guest.seatIndex !== undefined && guest.seatIndex !== null) ? guest.seatIndex + 1 : idx + 1}
                                  {guest.household && \` • \${guest.household}\`}
                                </div>
                              </div>
                            </div>
                            {guest.dietary && guest.dietary !== 'None' && (
                              <span className="text-[9.5px] bg-[#fff1f0] text-[#c93b2b] px-2 py-0.5 rounded-full font-semibold">
                                {guest.dietary}
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-[#faf7f2] border border-[#e8dfd1] rounded-xl p-3.5 text-center space-y-1">
                          <span className="text-lg">🔒</span>
                          <div className="font-serif text-sm font-bold text-[#15110e]">
                            Tablemates Kept Private
                          </div>
                          <p className="text-xs text-[#7d6c5b] leading-relaxed max-w-xs mx-auto">
                            The couple has chosen to keep other table guest names private until reception seating. Your table assignment is confirmed above!
                          </p>
                        </div>

                        {/* Show only the current guest row */}
                        <div className="bg-[#faf8f5] border border-[#bd9661] rounded-xl p-3 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-[#bd9661] text-[#15110e]">
                              {priyaGuest?.initials || 'PS'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#15110e] flex items-center gap-1.5">
                                <span>{priyaGuest?.name || 'Priya Sharma'}</span>
                                <span className="text-[10px] bg-[#bd9661]/20 text-[#916c3d] px-1 rounded font-bold">You</span>
                              </div>
                              <div className="text-[10px] text-[#8b7b6b]">
                                Seat {(priyaGuest?.seatIndex !== undefined && priyaGuest?.seatIndex !== null) ? priyaGuest.seatIndex + 1 : mySeatIndex + 1}
                              </div>
                            </div>
                          </div>
                          {priyaGuest?.dietary && priyaGuest.dietary !== 'None' && (
                            <span className="text-[9.5px] bg-[#fff1f0] text-[#c93b2b] px-2 py-0.5 rounded-full font-semibold">
                              {priyaGuest.dietary}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}`;

if (!guestContent.includes('Tablemates Kept Private')) {
  guestContent = guestContent.replace(oldTablematesList, newTablematesList);
}

fs.writeFileSync(guestFilePath, guestContent, 'utf8');
console.log('Successfully updated GuestMobileView.tsx!');
