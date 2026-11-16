const fs = require('fs');

let content = fs.readFileSync('src/components/CoupleView.tsx', 'utf8');

// 1. Remove badge property from events tab
content = content.replace(
  `                badge: (wedding.events || []).length > 0 ? \`\${(wedding.events || []).length}\` : undefined,\r\n`,
  ''
);
content = content.replace(
  `                badge: (wedding.events || []).length > 0 ? \`\${(wedding.events || []).length}\` : undefined,\n`,
  ''
);

// 2. Remove badge rendering from tab button
const badgeBlock = `                  {(tab as any).badge && (
                    <span className="text-[9px] font-bold bg-[#bd9661] text-[#15110e] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      {(tab as any).badge}
                    </span>
                  )}`;

const badgeBlockCRLF = badgeBlock.replace(/\n/g, '\r\n');

if (content.includes(badgeBlock)) {
  content = content.replace(badgeBlock, '');
  console.log('✓ Removed badge rendering block (LF)');
} else if (content.includes(badgeBlockCRLF)) {
  content = content.replace(badgeBlockCRLF, '');
  console.log('✓ Removed badge rendering block (CRLF)');
} else {
  console.warn('✗ Badge rendering block not found');
}

// 3. Replace Event cards grid with Event table
const cardsGridTarget = `            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(wedding.events || []).map((evt) => {
                const invitedGuests = weddingGuests.filter(g => (g.invitedEventIds || []).includes(evt.id));
                const confirmedGuests = invitedGuests.filter(g => {
                  const rsvp = g.eventRsvps?.[evt.id];
                  return rsvp ? rsvp.status === 'confirmed' : g.rsvpStatus === 'confirmed';
                });
                const declinedGuests = invitedGuests.filter(g => {
                  const rsvp = g.eventRsvps?.[evt.id];
                  return rsvp ? rsvp.status === 'declined' : g.rsvpStatus === 'declined';
                });
                const awaitingGuests = invitedGuests.length - confirmedGuests.length - declinedGuests.length;

                return (
                  <div
                    key={evt.id}
                    className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#bd9661]/60 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f4ece1] text-[#7a5933] border border-[#e4d6c4]">
                              {evt.category || 'Event'}
                            </span>
                            {evt.dressCode && (
                              <span className="text-[9.5px] text-[#8b7b6b] bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e8ded0]">
                                👔 {evt.dressCode}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-lg font-bold text-[#15110e]">
                            {evt.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditEventModal(evt)}
                            title="Edit Event"
                            className="p-1.5 text-xs text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf8f5] rounded-md transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(evt.id, evt.name)}
                            title="Delete Event"
                            className="p-1.5 text-xs text-[#a8382c] hover:bg-[#fbeae8] rounded-md transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Date, Time & Venue */}
                      <div className="space-y-1 text-xs text-[#594939]">
                        <div className="flex items-center gap-2">
                          <span className="text-[#bd9661]">🗓️</span>
                          <span className="font-semibold text-[#15110e]">{evt.date || 'Saturday, 14 Nov 2026'}</span>
                          <span className="text-[#8b7b6b]">&bull;</span>
                          <span className="font-mono text-[11px] text-[#bd9661] font-bold">
                            {evt.time}{evt.endTime ? \` - \${evt.endTime}\` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#bd9661]">📍</span>
                          <span className="truncate">{evt.venue || 'Fernwood Estate'}</span>
                          {evt.address && (
                            <span className="text-[11px] text-[#8b7b6b] truncate">({evt.address})</span>
                          )}
                        </div>
                      </div>

                      {evt.description && (
                        <p className="text-xs text-[#736353] leading-relaxed bg-[#faf8f5] p-2.5 rounded-xl border border-[#f0ede6]">
                          {evt.description}
                        </p>
                      )}

                      {/* Guest Invitations & RSVP Pill Summary */}
                      <div className="bg-[#fbf9f6] border border-[#e8ded0] rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                            INVITED GUESTS
                          </span>
                          <span className="font-bold text-[#15110e]">
                            {invitedGuests.length} of {weddingGuests.length} Guests
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-[#ede4d7] rounded-full overflow-hidden flex">
                          <div
                            style={{ width: \`\${(confirmedGuests.length / (invitedGuests.length || 1)) * 100}%\` }}
                            className="bg-emerald-600 h-full"
                            title={\`Confirmed: \${confirmedGuests.length}\`}
                          />
                          <div
                            style={{ width: \`\${(awaitingGuests / (invitedGuests.length || 1)) * 100}%\` }}
                            className="bg-[#bd9661] h-full"
                            title={\`Awaiting: \${awaitingGuests}\`}
                          />
                          <div
                            style={{ width: \`\${(declinedGuests.length / (invitedGuests.length || 1)) * 100}%\` }}
                            className="bg-rose-500 h-full"
                            title={\`Declined: \${declinedGuests.length}\`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-0.5">
                          <span className="text-emerald-700 font-semibold">✓ {confirmedGuests.length} Confirmed</span>
                          <span className="text-[#bd9661] font-semibold">⏳ {awaitingGuests} Awaiting</span>
                          <span className="text-[#a8382c] font-semibold">✕ {declinedGuests.length} Declined</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-[#f0ede4] flex items-center justify-between gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setManagingEventGuests(evt);
                          setEventGuestSearch('');
                        }}
                        className="w-full bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>Manage Guest List ({invitedGuests.length})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>`;

const eventTableReplacement = `            {/* Event Table View matching User Request 3 */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#e8ded0] text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                      <th className="py-3.5 px-4 font-bold">Event Name</th>
                      <th className="py-3.5 px-4 font-bold">Event Date</th>
                      <th className="py-3.5 px-4 font-bold">Time</th>
                      <th className="py-3.5 px-4 font-bold">Loc</th>
                      <th className="py-3.5 px-4 font-bold">Confirmed Guests</th>
                      <th className="py-3.5 px-4 font-bold text-center">Guest List</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {(wedding.events || []).map((evt) => {
                      const invitedGuests = weddingGuests.filter(g => (g.invitedEventIds || []).includes(evt.id));
                      const confirmedGuests = invitedGuests.filter(g => {
                        const rsvp = g.eventRsvps?.[evt.id];
                        return rsvp ? rsvp.status === 'confirmed' : g.rsvpStatus === 'confirmed';
                      });

                      return (
                        <tr
                          key={evt.id}
                          className="hover:bg-[#faf7f2] transition-colors"
                        >
                          {/* Event Name */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-[#15110e]">
                                {evt.name}
                              </span>
                              {evt.category && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f4ece1] text-[#7a5933] border border-[#e4d6c4]">
                                  {evt.category}
                                </span>
                              )}
                              {evt.dressCode && (
                                <span className="text-[9.5px] text-[#8b7b6b] bg-[#faf8f5] px-1.5 py-0.5 rounded border border-[#e8ded0]">
                                  👔 {evt.dressCode}
                                </span>
                              )}
                            </div>
                            {evt.description && (
                              <p className="text-[11px] text-[#8b7b6b] mt-0.5 line-clamp-1 max-w-md">
                                {evt.description}
                              </p>
                            )}
                          </td>

                          {/* Event Date */}
                          <td className="py-4 px-4 text-xs text-[#15110e] font-medium whitespace-nowrap">
                            🗓️ {evt.date || 'Saturday, 14 Nov 2026'}
                          </td>

                          {/* Time */}
                          <td className="py-4 px-4 font-mono text-xs font-bold text-[#bd9661] whitespace-nowrap">
                            {evt.time}{evt.endTime ? \` - \${evt.endTime}\` : ''}
                          </td>

                          {/* Loc */}
                          <td className="py-4 px-4 text-xs text-[#15110e]">
                            <div className="font-medium truncate max-w-[200px]">{evt.venue || 'Fernwood Estate'}</div>
                            {evt.address && (
                              <div className="text-[10.5px] text-[#8b7b6b] truncate max-w-[200px]">{evt.address}</div>
                            )}
                          </td>

                          {/* Confirmed Guests: shown as confirmed / total */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                {confirmedGuests.length} / {weddingGuests.length}
                              </span>
                              <span className="text-[11px] text-[#8b7b6b]">
                                ({invitedGuests.length} invited)
                              </span>
                            </div>
                          </td>

                          {/* Guest List Column with button called 'Manage' */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setManagingEventGuests(evt);
                                setEventGuestSearch('');
                              }}
                              className="bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              <span>Manage</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditEventModal(evt)}
                                title="Edit Event"
                                className="p-1.5 text-xs text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf8f5] rounded-md transition-colors cursor-pointer"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(evt.id, evt.name)}
                                title="Delete Event"
                                className="p-1.5 text-xs text-[#a8382c] hover:bg-[#fbeae8] rounded-md transition-colors cursor-pointer"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>`;

// Safe replacement
const normContent = content.replace(/\r\n/g, '\n');
const normTarget = cardsGridTarget.replace(/\r\n/g, '\n');
const normRep = eventTableReplacement.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  content = normContent.replace(normTarget, normRep);
  console.log('✓ Successfully replaced Event cards grid with Event table');
} else {
  console.warn('✗ Failed to find cardsGridTarget');
}

fs.writeFileSync('src/components/CoupleView.tsx', content, 'utf8');
console.log('Updated CoupleView.tsx');
