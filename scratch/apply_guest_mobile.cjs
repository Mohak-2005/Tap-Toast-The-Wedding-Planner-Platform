const fs = require('fs');
const filePath = 'C:/Users/Mohak/Desktop/tap&toast - Copy/src/components/GuestMobileView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import GuestEventRsvp, WeddingEvent from types
content = content.replace(
  "import { useAppState, showToast, getWeddingCountdown, logAudit } from '../lib/state';",
  "import { useAppState, showToast, getWeddingCountdown, logAudit } from '../lib/state';\nimport { GuestEventRsvp, WeddingEvent } from '../lib/types';"
);

// 2. Add activeGuest and guestEvents computation and handleToggleEventRsvp
const searchTarget = "  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'opening' | 'opened'>('sealed');";

const additions = `  // Dynamic active guest and invited events
  const activeGuest = (state.guests || []).find((g) => {
    const gName = g.name.toLowerCase().trim();
    const target = (guestLeadName || 'Priya Sharma').toLowerCase().trim();
    return (
      gName === target ||
      gName.includes(target) ||
      target.includes(gName) ||
      (target.includes('priya') && g.id === 'priya')
    );
  }) || (state.guests || [])[0];

  const invitedEventIds = (activeGuest && activeGuest.invitedEventIds && activeGuest.invitedEventIds.length > 0)
    ? activeGuest.invitedEventIds
    : (wedding?.events || []).map(e => e.id);

  const guestEvents = (wedding?.events || []).filter(e => invitedEventIds.includes(e.id));

  const handleToggleEventRsvp = (eventId: string, isAccept: boolean) => {
    const targetName = (guestLeadName || 'Priya Sharma').toLowerCase().trim();

    const updatedGuests = (state.guests || []).map((g) => {
      const gName = g.name.toLowerCase().trim();
      if (
        gName === targetName ||
        gName.includes(targetName) ||
        targetName.includes(gName) ||
        (targetName.includes('priya') && g.id === 'priya')
      ) {
        const currentRsvps = g.eventRsvps || {};
        const updatedRsvps = {
          ...currentRsvps,
          [eventId]: {
            status: (isAccept ? 'confirmed' : 'declined') as 'confirmed' | 'declined',
            attending: isAccept,
            updatedAt: new Date().toISOString(),
          },
        };
        const hasAnyConfirmed = Object.values(updatedRsvps).some(r => r.status === 'confirmed');
        const hasAllDeclined = Object.values(updatedRsvps).length > 0 && Object.values(updatedRsvps).every(r => r.status === 'declined');
        const newOverallStatus = hasAnyConfirmed ? 'confirmed' : hasAllDeclined ? 'declined' : 'awaiting';

        return {
          ...g,
          rsvpStatus: newOverallStatus as 'confirmed' | 'declined' | 'awaiting',
          eventRsvps: updatedRsvps,
        };
      }
      return g;
    });

    setState({
      ...state,
      guests: updatedGuests,
    });

    const evt = (wedding?.events || []).find(e => e.id === eventId);
    showToast(isAccept ? \`Attending \${evt?.name || 'event'}! 🥂\` : \`Declined \${evt?.name || 'event'}\`, isAccept ? 'success' : 'info');
  };

  const handleBulkAcceptAllEvents = (isAccept: boolean) => {
    const targetName = (guestLeadName || 'Priya Sharma').toLowerCase().trim();
    const updatedGuests = (state.guests || []).map((g) => {
      const gName = g.name.toLowerCase().trim();
      if (
        gName === targetName ||
        gName.includes(targetName) ||
        targetName.includes(gName) ||
        (targetName.includes('priya') && g.id === 'priya')
      ) {
        const eventsToUpdate = (g.invitedEventIds && g.invitedEventIds.length > 0)
          ? g.invitedEventIds
          : (wedding?.events || []).map(e => e.id);

        const newRsvps: Record<string, GuestEventRsvp> = {};
        eventsToUpdate.forEach(id => {
          newRsvps[id] = {
            status: isAccept ? 'confirmed' : 'declined',
            attending: isAccept,
            updatedAt: new Date().toISOString(),
          };
        });

        return {
          ...g,
          rsvpStatus: (isAccept ? 'confirmed' : 'declined') as 'confirmed' | 'declined',
          eventRsvps: newRsvps,
        };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    setRsvpAttending(isAccept);
    showToast(isAccept ? 'Accepted invitations to all your events! 🥂' : 'Declined all events', isAccept ? 'success' : 'info');
  };
`;

content = content.replace(searchTarget, additions + '\n' + searchTarget);

// 3. Demo guest switcher pill above phone chassis
const chassisMarker = `      {/* 402x874 Phone Chassis matching Screenshot 1-9 & guest-mobile.html */}`;
const demoSwitcherPill = `      {/* Demo Guest Switcher Pill (for instant testing of event-specific schedule & RSVP) */}
      <div className="mb-2 flex items-center gap-2 text-xs bg-white/90 backdrop-blur-md border border-[#e8ded0] px-3.5 py-1.5 rounded-full shadow-2xs z-30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">Viewing As Guest:</span>
        <select
          value={guestLeadName}
          onChange={(e) => setGuestLeadName(e.target.value)}
          className="bg-transparent text-xs font-bold text-[#15110e] outline-none cursor-pointer"
        >
          <option value="Priya Sharma">Priya Sharma (4 events: Sangeet, Ceremony, Reception, After-party)</option>
          <option value="Mark Johnson">Mark Johnson (3 events: Ceremony, Reception, Recovery Brunch)</option>
          <option value="Sophie Bell">Sophie Bell (5 events: All celebrations)</option>
        </select>
      </div>
`;
content = content.replace(chassisMarker, demoSwitcherPill + '\n' + chassisMarker);

// 4. Update the RSVP tab decision buttons to include the Event-Specific RSVP Cards
const rsvpGreetingMarker = `              {/* Greeting */}
              <div className="text-center px-2">
                <p className="text-xs text-[#15110e] font-medium leading-relaxed">
                  Hi <strong>Priya</strong> &mdash; we'd love for you to celebrate with us. Let us know if you can make it.
                </p>
              </div>`;

const rsvpGreetingReplacement = `              {/* Greeting */}
              <div className="text-center px-2">
                <p className="text-xs text-[#15110e] font-medium leading-relaxed">
                  Hi <strong>{activeGuest?.name || guestLeadName || 'Priya'}</strong> &mdash; we'd love for you to celebrate with us. You're invited to {guestEvents.length} celebration{guestEvents.length === 1 ? '' : 's'}. Please confirm your attendance for each event below.
                </p>
              </div>

              {/* Quick Bulk Action Bar */}
              <div className="bg-[#faf7f2] border border-[#ebd3a8] rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#15110e]">Your Event Invitations</span>
                  <span className="text-[10.5px] font-bold text-[#bd9661] bg-white px-2 py-0.5 rounded-full border border-[#e8ded0]">
                    {guestEvents.length} Events
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkAcceptAllEvents(true)}
                    className="py-2 px-2 bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                  >
                    <span>🥂</span>
                    <span>Accept All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAcceptAllEvents(false)}
                    className="py-2 px-2 bg-white hover:bg-[#fbf9f6] text-[#6b5847] font-semibold border border-[#e8ded0] rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <span>💌</span>
                    <span>Decline All</span>
                  </button>
                </div>
              </div>

              {/* Event-Specific RSVP Cards */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b] px-1">
                  RSVP PER CELEBRATION ({guestEvents.length})
                </div>
                {guestEvents.map((evt) => {
                  const rsvp = activeGuest?.eventRsvps?.[evt.id];
                  const isConfirmed = rsvp ? rsvp.status === 'confirmed' : activeGuest?.rsvpStatus === 'confirmed';
                  const isDeclined = rsvp ? rsvp.status === 'declined' : activeGuest?.rsvpStatus === 'declined';

                  return (
                    <div
                      key={evt.id}
                      className={\`bg-white border rounded-2xl p-3.5 shadow-xs transition-all \${
                        isConfirmed
                          ? 'border-emerald-300 ring-1 ring-emerald-200'
                          : isDeclined
                          ? 'border-rose-200 opacity-80'
                          : 'border-[#e8ded0]'
                      }\`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f4ece1] text-[#7a5933] border border-[#e4d6c4]">
                            {evt.category || 'Celebration'}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#15110e] mt-1">
                            {evt.name}
                          </h4>
                        </div>
                        <span
                          className={\`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 \${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDeclined
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }\`}
                        >
                          {isConfirmed ? '✓ Attending' : isDeclined ? '✕ Declined' : 'Pending'}
                        </span>
                      </div>

                      <div className="text-xs text-[#6b5847] space-y-0.5 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#bd9661]">🗓️</span>
                          <span className="font-medium text-[#15110e]">{evt.date || '14 Nov 2026'} &bull; {evt.time}{evt.endTime ? \` - \${evt.endTime}\` : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#bd9661]">📍</span>
                          <span className="truncate">{evt.venue}</span>
                        </div>
                        {evt.dressCode && (
                          <div className="text-[10.5px] text-[#8b7b6b]">
                            👔 Dress: {evt.dressCode}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0ede4]">
                        <button
                          type="button"
                          onClick={() => handleToggleEventRsvp(evt.id, true)}
                          className={\`py-2 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 \${
                            isConfirmed
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-[#faf8f5] text-[#15110e] border border-[#e8ded0] hover:bg-emerald-50'
                          }\`}
                        >
                          <span>🥂</span>
                          <span>Attending</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleEventRsvp(evt.id, false)}
                          className={\`py-2 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 \${
                            isDeclined
                              ? 'bg-rose-700 text-white shadow-xs'
                              : 'bg-[#faf8f5] text-[#15110e] border border-[#e8ded0] hover:bg-rose-50'
                          }\`}
                        >
                          <span>💌</span>
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>`;

content = content.replace(rsvpGreetingMarker, rsvpGreetingReplacement);

// 5. Update Schedule / Events Tab to dynamically render guestEvents
const timelineMarkerStart = `{/* Timeline Container */}
              <div className="relative pl-6 space-y-6 pt-2">
                {/* Continuous Vertical Timeline Line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#bd9661]" />`;

const timelineMarkerEnd = `              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: TABLE (Screenshot 7: 172617.png)                           */}`;

const oldTimelineSubstr = content.slice(content.indexOf(timelineMarkerStart), content.indexOf(timelineMarkerEnd));

const newTimelineSubstr = `{/* Timeline Container */}
              <div className="relative pl-6 space-y-6 pt-2">
                {/* Continuous Vertical Timeline Line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#bd9661]" />

                {guestEvents.length === 0 ? (
                  <div className="text-xs text-[#8b7b6b] py-6">
                    No scheduled events found for your invitation.
                  </div>
                ) : (
                  guestEvents.map((ev) => {
                    const rsvp = activeGuest?.eventRsvps?.[ev.id];
                    const isAttending = rsvp ? rsvp.status === 'confirmed' : activeGuest?.rsvpStatus === 'confirmed';

                    return (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-[#bd9661] border-2 border-white ring-2 ring-[#bd9661]/40" />
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-[#bd9661]">
                            {ev.time}{ev.endTime ? \` - \${ev.endTime}\` : ''}
                          </span>
                          <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#f4ece1] text-[#7a5933]">
                            {ev.category || 'Event'}
                          </span>
                          {rsvp && (
                            <span className={\`text-[9.5px] font-bold px-1.5 py-0.5 rounded ml-auto \${
                              isAttending ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }\`}>
                              {isAttending ? '✓ Attending' : '✕ Declined'}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[#15110e]">
                          {ev.name}
                        </h3>
                        <p className="text-xs text-[#6b5847] font-medium mt-0.5">
                          📍 {ev.venue}{ev.address ? \` • \${ev.address}\` : ''}
                        </p>
                        {ev.dressCode && (
                          <p className="text-[11px] text-[#8b7b6b] mt-0.5">
                            👔 Dress: {ev.dressCode}
                          </p>
                        )}
                        {ev.description && (
                          <p className="text-xs text-[#8b7b6b] mt-1 leading-relaxed bg-[#faf8f5] p-2 rounded-lg border border-[#e8ded0]">
                            {ev.description}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}`;

content = content.replace(oldTimelineSubstr, newTimelineSubstr);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated GuestMobileView.tsx with event-specific invitations and schedule filtering');
