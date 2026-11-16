const fs = require('fs');
const filePath = 'C:/Users/Mohak/Desktop/tap&toast - Copy/src/components/CoupleView.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports to include WeddingEvent, GuestEventRsvp
content = content.replace(
  "import { Guest, PrivateRunSheetItem, WeddingVendor } from '../lib/types';",
  "import { Guest, PrivateRunSheetItem, WeddingVendor, WeddingEvent, GuestEventRsvp } from '../lib/types';"
);

// 2. Update CoupleTab to include 'events'
content = content.replace(
  "export type CoupleTab =\n  | 'overview'\n  | 'guests'",
  "export type CoupleTab =\n  | 'overview'\n  | 'events'\n  | 'guests'"
);

// 3. Add states and event handlers
const stateInsertionMarker = "  // Tab 2: Guest List State & Actions (Screenshot 23)";
const newStatesAndHandlers = `  // Tab: Events & Schedule State (Event-Specific Invitations)
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [managingEventGuests, setManagingEventGuests] = useState<WeddingEvent | null>(null);
  const [eventGuestSearch, setEventGuestSearch] = useState<string>('');
  const [guestEventFilter, setGuestEventFilter] = useState<string>('all');
  const [newGuestEventIds, setNewGuestEventIds] = useState<string[]>([]);

  // Add / Edit Event Form State
  const [eventFormName, setEventFormName] = useState('');
  const [eventFormCategory, setEventFormCategory] = useState<string>('ceremony');
  const [eventFormDate, setEventFormDate] = useState('2026-11-14');
  const [eventFormTime, setEventFormTime] = useState('14:00');
  const [eventFormEndTime, setEventFormEndTime] = useState('15:00');
  const [eventFormVenue, setEventFormVenue] = useState('Fernwood Estate');
  const [eventFormAddress, setEventFormAddress] = useState('124 Range Road, Mittagong NSW');
  const [eventFormDressCode, setEventFormDressCode] = useState('Cocktail / Black Tie Optional');
  const [eventFormDesc, setEventFormDesc] = useState('');

  // Guided Story Prompts & Cheers AI State
  const [showCheersAiModal, setShowCheersAiModal] = useState<boolean>(false);
  const [storyPromptHowWeMet, setStoryPromptHowWeMet] = useState('A rainy autumn afternoon in Bowral at a small corner bookstore.');
  const [storyPromptProposal, setStoryPromptProposal] = useState('During a sunset hike overlooking Lake Wakatipu in Queenstown with champagne.');
  const [storyPromptCherish, setStoryPromptCherish] = useState('Cooking pasta on Sunday mornings, road trips to coastal towns, and laughing through every adventure.');
  const [storyAiTone, setStoryAiTone] = useState<'romantic' | 'warm' | 'playful'>('romantic');
  const [cheersDraftOutput, setCheersDraftOutput] = useState<string>('');
  const [cheersIsDrafting, setCheersIsDrafting] = useState<boolean>(false);

  const resetEventForm = () => {
    setEventFormName('');
    setEventFormCategory('ceremony');
    setEventFormDate('2026-11-14');
    setEventFormTime('14:00');
    setEventFormEndTime('15:00');
    setEventFormVenue('Fernwood Estate');
    setEventFormAddress('124 Range Road, Mittagong NSW');
    setEventFormDressCode('Cocktail / Black Tie Optional');
    setEventFormDesc('');
    setEditingEvent(null);
  };

  const handleOpenAddEventModal = () => {
    resetEventForm();
    setShowAddEventModal(true);
  };

  const handleOpenEditEventModal = (evt: WeddingEvent) => {
    setEditingEvent(evt);
    setEventFormName(evt.name || '');
    setEventFormCategory(evt.category || 'ceremony');
    setEventFormDate(evt.date || '2026-11-14');
    setEventFormTime(evt.time || '14:00');
    setEventFormEndTime(evt.endTime || '');
    setEventFormVenue(evt.venue || '');
    setEventFormAddress(evt.address || '');
    setEventFormDressCode(evt.dressCode || '');
    setEventFormDesc(evt.description || '');
    setShowAddEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormName.trim()) return;

    const currentEvents = wedding.events || [];
    let updatedEvents: WeddingEvent[];

    if (editingEvent) {
      updatedEvents = currentEvents.map(ev => ev.id === editingEvent.id ? {
        ...ev,
        name: eventFormName.trim(),
        category: eventFormCategory,
        date: eventFormDate,
        time: eventFormTime,
        endTime: eventFormEndTime,
        venue: eventFormVenue.trim(),
        address: eventFormAddress.trim(),
        dressCode: eventFormDressCode.trim(),
        description: eventFormDesc.trim(),
      } : ev);
      showToast(\`Updated "\${eventFormName.trim()}"\`, 'success');
    } else {
      const newEventId = 'evt_' + Date.now();
      const newEvt: WeddingEvent = {
        id: newEventId,
        weddingId: wedding.id,
        name: eventFormName.trim(),
        category: eventFormCategory,
        date: eventFormDate,
        time: eventFormTime,
        endTime: eventFormEndTime,
        venue: eventFormVenue.trim(),
        address: eventFormAddress.trim(),
        dressCode: eventFormDressCode.trim(),
        description: eventFormDesc.trim(),
        order: currentEvents.length + 1,
      };
      updatedEvents = [...currentEvents, newEvt];
      // Automatically invite all current wedding guests by default
      const updatedGuests = (state.guests || []).map(g => ({
        ...g,
        invitedEventIds: g.invitedEventIds ? [...g.invitedEventIds, newEventId] : [newEventId],
      }));
      setState(prev => ({
        ...prev,
        guests: updatedGuests,
        weddings: (prev.weddings || []).map(w => w.id === wedding.id ? { ...w, events: updatedEvents } : w),
      }));
      setShowAddEventModal(false);
      resetEventForm();
      showToast(\`Created "\${eventFormName.trim()}" and added to guest schedule\`, 'success');
      return;
    }

    setState(prev => ({
      ...prev,
      weddings: (prev.weddings || []).map(w => w.id === wedding.id ? { ...w, events: updatedEvents } : w),
    }));
    setShowAddEventModal(false);
    resetEventForm();
  };

  const handleDeleteEvent = (eventId: string, eventName: string) => {
    if (!window.confirm(\`Are you sure you want to delete "\${eventName}"? Invited guests will no longer see it on their schedule.\`)) {
      return;
    }
    const currentEvents = wedding.events || [];
    const updatedEvents = currentEvents.filter(e => e.id !== eventId);
    const updatedGuests = (state.guests || []).map(g => ({
      ...g,
      invitedEventIds: (g.invitedEventIds || []).filter(id => id !== eventId),
    }));
    setState(prev => ({
      ...prev,
      guests: updatedGuests,
      weddings: (prev.weddings || []).map(w => w.id === wedding.id ? { ...w, events: updatedEvents } : w),
    }));
    showToast(\`Event "\${eventName}" deleted\`, 'info');
  };

  const handleToggleGuestEventInvitation = (guestId: string, eventId: string) => {
    const updatedGuests = (state.guests || []).map(g => {
      if (g.id !== guestId) return g;
      const currentList = g.invitedEventIds || (wedding.events || []).map(e => e.id);
      const isInvited = currentList.includes(eventId);
      const updatedList = isInvited ? currentList.filter(id => id !== eventId) : [...currentList, eventId];
      return {
        ...g,
        invitedEventIds: updatedList,
      };
    });
    setState(prev => ({ ...prev, guests: updatedGuests }));
  };

  const handleBulkGuestEventInvitation = (eventId: string, inviteAll: boolean) => {
    const updatedGuests = (state.guests || []).map(g => {
      const currentList = g.invitedEventIds || [];
      let updatedList: string[];
      if (inviteAll) {
        updatedList = currentList.includes(eventId) ? currentList : [...currentList, eventId];
      } else {
        updatedList = currentList.filter(id => id !== eventId);
      }
      return { ...g, invitedEventIds: updatedList };
    });
    setState(prev => ({ ...prev, guests: updatedGuests }));
    showToast(inviteAll ? 'All guests invited to this event' : 'All guests removed from this event', 'info');
  };

  const handleDraftWithCheers = () => {
    setCheersIsDrafting(true);
    setTimeout(() => {
      let draft = '';
      if (storyAiTone === 'romantic') {
        draft = \`From the moment we met—\${storyPromptHowWeMet.toLowerCase().replace(/\\.$/, '')}—our lives began intertwining in ways neither of us could have anticipated.\\n\\nYears of quiet laughter and shared dreams led us to that unforgettable milestone: \${storyPromptProposal.toLowerCase().replace(/\\.$/, '')}. With the world standing still around us, answering 'yes' was the easiest decision of our lives.\\n\\nToday, what we cherish most is the everyday magic we build together—\${storyPromptCherish.toLowerCase().replace(/\\.$/, '')}. As we begin this next chapter, we are deeply grateful to celebrate our love alongside our dearest family and friends.\`;
      } else if (storyAiTone === 'playful') {
        draft = \`It all started simply enough: \${storyPromptHowWeMet}\\n\\nBefore we knew it, coffee dates turned into road trips, inside jokes, and an unforgettable proposal—\${storyPromptProposal.toLowerCase().replace(/\\.$/, '')}. She/He said yes before the question was even fully out!\\n\\nWhat keeps us going? \${storyPromptCherish} We couldn't imagine tying the knot without the people who have laughed and celebrated with us along the way.\`;
      } else {
        draft = \`Our journey together began with \${storyPromptHowWeMet.toLowerCase().replace(/\\.$/, '')}. That spark quickly grew into a partnership built on trust, genuine warmth, and unconditional support.\\n\\nWhen the moment came—\${storyPromptProposal.toLowerCase().replace(/\\.$/, '')}—we both knew our futures were forever bound.\\n\\nAs we look ahead, what matters most to us is \${storyPromptCherish.toLowerCase().replace(/\\.$/, '')}. Thank you for being part of our story and celebrating this day with us.\`;
      }
      setCheersDraftOutput(draft);
      setCheersIsDrafting(false);
      showToast('Cheers AI crafted your love story draft!', 'success');
    }, 700);
  };

  const handleApplyCheersDraft = () => {
    if (!cheersDraftOutput.trim()) return;
    setContentPages(prev => ({
      ...prev,
      ourStory: {
        ...prev.ourStory,
        content: cheersDraftOutput,
        status: 'Published',
      },
    }));
    setShowCheersAiModal(false);
    showToast('Love story updated with Cheers AI draft!', 'success');
  };

`;

content = content.replace(stateInsertionMarker, newStatesAndHandlers + stateInsertionMarker);

// 4. Update sidebar tabs to include 'events'
const navMarker = `              {
                id: 'guests',
                label: 'Guest List',`;

const navReplacement = `              {
                id: 'events' as const,
                label: 'Events & Schedule',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
                badge: (wedding.events || []).length > 0 ? \`\${(wedding.events || []).length}\` : undefined,
              },
              {
                id: 'guests',
                label: 'Guest List',`;

content = content.replace(navMarker, navReplacement);

// 5. Update filteredGuests to filter by guestEventFilter
const filteredGuestsMarker = `    const matchCat =
      guestCategoryFilter === 'all'
        ? true
        : guestCategoryFilter === 'needs_category'
        ? (!g.category || g.category === 'Uncategorised')
        : g.category === guestCategoryFilter;
    return matchSearch && matchFilter && matchCat;`;

const filteredGuestsReplacement = `    const matchCat =
      guestCategoryFilter === 'all'
        ? true
        : guestCategoryFilter === 'needs_category'
        ? (!g.category || g.category === 'Uncategorised')
        : g.category === guestCategoryFilter;
    const matchEvent = guestEventFilter === 'all' || (g.invitedEventIds || []).includes(guestEventFilter);
    return matchSearch && matchFilter && matchCat && matchEvent;`;

content = content.replace(filteredGuestsMarker, filteredGuestsReplacement);

// 6. In handleAddNewGuest, assign invitedEventIds
const addGuestMarker = `      category: newGuestCategory || 'Uncategorised',
      reminderSent: false,
    };`;

const addGuestReplacement = `      category: newGuestCategory || 'Uncategorised',
      reminderSent: false,
      invitedEventIds: newGuestEventIds.length > 0 ? newGuestEventIds : (wedding.events || []).map(e => e.id),
      eventRsvps: {},
    };`;

content = content.replace(addGuestMarker, addGuestReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied Part 1 updates to CoupleView.tsx');
