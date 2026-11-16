const fs = require('fs');
const filePath = 'C:/Users/Mohak/Desktop/tap&toast - Copy/src/components/CoupleView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetSection = `{activeTab === 'guests' && !isMcOrPlanner && (`;

const eventsSectionCode = `{/* ================================================================ */}
        {/* TAB: EVENTS & SCHEDULE (EVENT-SPECIFIC INVITATIONS)             */}
        {/* ================================================================ */}
        {activeTab === 'events' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  CELEBRATION TIMELINE &amp; INVITATIONS
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Events &amp; Schedule
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Create wedding events and customize exactly which guests receive invitations and see them on their private digital itinerary.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenAddEventModal}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <span>+</span>
                  <span>Create Wedding Event</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">TOTAL EVENTS</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">
                  {(wedding.events || []).length}
                </div>
                <div className="text-[10px] text-[#8b7b6b]">Across wedding schedule</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">TOTAL GUESTS</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">
                  {weddingGuests.length}
                </div>
                <div className="text-[10px] text-[#8b7b6b]">On your master guest list</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">CEREMONY ATTENDEES</div>
                <div className="font-serif text-2xl font-bold text-emerald-700 mt-0.5">
                  {weddingGuests.filter(g => (g.invitedEventIds || []).includes('evt_ceremony')).length}
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold">Invited to exchange of vows</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">RECEPTION BANQUET</div>
                <div className="font-serif text-2xl font-bold text-[#bd9661] mt-0.5">
                  {weddingGuests.filter(g => (g.invitedEventIds || []).includes('evt_reception')).length}
                </div>
                <div className="text-[10px] text-[#8b7b6b]">Invited to dinner &amp; dancing</div>
              </div>
            </div>

            {/* Event Cards Grid */}
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
            </div>

            {/* Modal: Create or Edit Event */}
            {showAddEventModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">
                        {editingEvent ? 'Edit Wedding Event' : 'Create Wedding Event'}
                      </h3>
                      <p className="text-xs text-[#8b7b6b]">
                        Define schedule details and dress code for this celebration
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddEventModal(false)}
                      className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Preset Suggestions for quick creation */}
                  {!editingEvent && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] block mb-1.5">
                        QUICK SUGGESTIONS:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'Wedding Ceremony', cat: 'ceremony', time: '14:00', end: '15:00', dress: 'Formal' },
                          { name: 'Sangeet Night', cat: 'sangeet', time: '18:00', end: '22:30', dress: 'Festive Traditional' },
                          { name: 'Evening Reception & Dinner', cat: 'reception', time: '17:30', end: '23:30', dress: 'Black Tie Optional' },
                          { name: 'After-Party', cat: 'after-party', time: '23:30', end: '02:00', dress: 'Party Casual' },
                          { name: 'Recovery Brunch', cat: 'breakfast', time: '10:00', end: '13:00', dress: 'Smart Casual' },
                        ].map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setEventFormName(preset.name);
                              setEventFormCategory(preset.cat);
                              setEventFormTime(preset.time);
                              setEventFormEndTime(preset.end);
                              setEventFormDressCode(preset.dress);
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-[#e8ded0] bg-[#faf8f5] hover:bg-[#f2ece3] text-[#15110e] transition-colors"
                          >
                            + {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        EVENT NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={eventFormName}
                        onChange={(e) => setEventFormName(e.target.value)}
                        placeholder="e.g. Sangeet Celebration, Wedding Ceremony, After-Party"
                        className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          CATEGORY
                        </label>
                        <select
                          value={eventFormCategory}
                          onChange={(e) => setEventFormCategory(e.target.value)}
                          className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                        >
                          <option value="ceremony">Ceremony</option>
                          <option value="sangeet">Sangeet</option>
                          <option value="reception">Reception</option>
                          <option value="after-party">After-Party</option>
                          <option value="breakfast">Recovery Brunch / Breakfast</option>
                          <option value="other">Other Celebration</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          DATE
                        </label>
                        <input
                          type="date"
                          value={eventFormDate}
                          onChange={(e) => setEventFormDate(e.target.value)}
                          className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          START TIME
                        </label>
                        <input
                          type="time"
                          value={eventFormTime}
                          onChange={(e) => setEventFormTime(e.target.value)}
                          className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          END TIME (OPTIONAL)
                        </label>
                        <input
                          type="time"
                          value={eventFormEndTime}
                          onChange={(e) => setEventFormEndTime(e.target.value)}
                          className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          VENUE / LOCATION
                        </label>
                        <input
                          type="text"
                          value={eventFormVenue}
                          onChange={(e) => setEventFormVenue(e.target.value)}
                          placeholder="e.g. Fernwood Estate Lawn"
                          className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          DRESS CODE
                        </label>
                        <input
                          type="text"
                          value={eventFormDressCode}
                          onChange={(e) => setEventFormDressCode(e.target.value)}
                          placeholder="e.g. Festive Traditional, Cocktail"
                          className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        DESCRIPTION / NOTES FOR GUESTS
                      </label>
                      <textarea
                        value={eventFormDesc}
                        onChange={(e) => setEventFormDesc(e.target.value)}
                        rows={3}
                        placeholder="Provide any instructions, arrival tips, or dietary notes for your invited guests..."
                        className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 outline-none focus:border-[#bd9661] resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-[#e8ded0]">
                      <button
                        type="button"
                        onClick={() => setShowAddEventModal(false)}
                        className="px-4 py-2 rounded-xl border border-[#e8ded0] text-[#8b7b6b] hover:bg-gray-50 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold shadow-xs transition-colors"
                      >
                        {editingEvent ? 'Save Event Changes' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Manage Guest List for an Event */}
            {managingEventGuests && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                        MANAGE INVITATIONS
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">
                        {managingEventGuests.name}
                      </h3>
                      <p className="text-xs text-[#8b7b6b]">
                        Choose which guests receive invitations and can view this event
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setManagingEventGuests(null)}
                      className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Search and Bulk Select Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <input
                      type="text"
                      placeholder="Search guests by name or household..."
                      value={eventGuestSearch}
                      onChange={(e) => setEventGuestSearch(e.target.value)}
                      className="flex-1 min-w-[200px] bg-white border border-[#e8ded0] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleBulkGuestEventInvitation(managingEventGuests.id, true)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#faf8f5] hover:bg-[#f0ede6] text-[#15110e] border border-[#e8ded0] rounded-lg cursor-pointer transition-colors"
                      >
                        Select All ({weddingGuests.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBulkGuestEventInvitation(managingEventGuests.id, false)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#faf8f5] hover:bg-[#f0ede6] text-[#a8382c] border border-[#f2a89f] rounded-lg cursor-pointer transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Guest Checklist */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 border border-[#e8ded0] rounded-xl p-3 bg-[#fdfbf8] divide-y divide-[#f2ece3]">
                    {weddingGuests
                      .filter(g =>
                        g.name.toLowerCase().includes(eventGuestSearch.toLowerCase()) ||
                        g.household.toLowerCase().includes(eventGuestSearch.toLowerCase()) ||
                        (g.category || '').toLowerCase().includes(eventGuestSearch.toLowerCase())
                      )
                      .map((g) => {
                        const isInvited = (g.invitedEventIds || []).includes(managingEventGuests.id);
                        const rsvp = g.eventRsvps?.[managingEventGuests.id];
                        const statusLabel = rsvp ? rsvp.status : isInvited ? 'invited' : 'not invited';

                        return (
                          <label
                            key={g.id}
                            className="flex items-center justify-between py-2 px-1 hover:bg-[#f5ede2] rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isInvited}
                                onChange={() => handleToggleGuestEventInvitation(g.id, managingEventGuests.id)}
                                className="w-4 h-4 accent-[#bd9661] rounded cursor-pointer"
                              />
                              <div>
                                <span className="font-semibold text-xs text-[#15110e] block">
                                  {g.name}
                                </span>
                                <span className="text-[10.5px] text-[#8b7b6b]">
                                  {g.household} &bull; {g.category || 'General Guest'}
                                </span>
                              </div>
                            </div>
                            <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full \${
                              statusLabel === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInvited
                                ? 'bg-[#faf4ec] text-[#bd9661] border border-[#ebd3a8]'
                                : 'bg-gray-100 text-gray-500'
                            }\`}>
                              {statusLabel}
                            </span>
                          </label>
                        );
                      })}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e8ded0]">
                    <div className="text-xs text-[#8b7b6b]">
                      Invited: <strong className="text-[#15110e]">{weddingGuests.filter(g => (g.invitedEventIds || []).includes(managingEventGuests.id)).length}</strong> of {weddingGuests.length} guests
                    </div>
                    <button
                      type="button"
                      onClick={() => setManagingEventGuests(null)}
                      className="px-5 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        ` + targetSection;

content = content.replace(targetSection, eventsSectionCode);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully inserted activeTab === "events" section into CoupleView.tsx');
