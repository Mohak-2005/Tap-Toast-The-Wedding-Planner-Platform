import React, { useState, useEffect, useRef } from 'react';
import { useAppState, useSession, getWeddingCountdown, formatAUD, showToast } from '../lib/state';
import JoeyChatbot from './JoeyChatbot';
import { Guest, PrivateRunSheetItem, WeddingVendor, WeddingEvent, GuestEventRsvp, VendorDocument } from '../lib/types';
import { VendorDirectorySection } from './VendorDirectorySection';
import { WeddingCountdownCard } from './WeddingCountdownCard';
import { logAudit } from '../lib/state';
import { InvitationTemplatesSection } from './InvitationTemplatesSection';
import { WeddingDayCelebrationSection } from './WeddingDayCelebrationSection';
import { SeatingPlannerSection } from './SeatingPlannerSection';
import { DietaryBadges, parseDietaryRequirements } from '../lib/dietaryHelper';
import { ColorPicker2D } from './ColorPicker2D';
import { SuperAdminCardStudio } from './SuperAdminCardStudio';
import PlannerDaySheetSection from './PlannerDaySheetSection';
import { CheersAiRunSheetChatbot } from './CheersAiRunSheetChatbot';
import {
  STANDARD_RUN_SHEET_TEMPLATES,
  RunSheetTemplate,
  generateAiRunSheetDraft,
  parseRawRunSheetText,
} from '../lib/runSheetTemplates';
import * as XLSX from 'xlsx';

export type CoupleTab =
  | 'overview'
  | 'events'
  | 'guests'
  | 'seating'
  | 'mc_runsheet'
  | 'vendor_documents'
  | 'mc_catering'
  | 'pages'
  | 'invitations'
  | 'gifts'
  | 'feed'
  | 'vault'
  | 'anniversary'
  | 'venue'
  | 'settings'
  | 'vendors';

export interface CoupleViewProps {
  onSelectView?: (view: string) => void;
  weddingId?: string;
  isMcView?: boolean;
  isPlannerView?: boolean;
  onBackToWeddings?: () => void;
  initialTab?: CoupleTab;
}

export default function CoupleView({
  onSelectView,
  weddingId,
  isMcView,
  isPlannerView,
  onBackToWeddings,
  initialTab,
}: CoupleViewProps) {
  const { state, setState } = useAppState();
  const { session, clearSession } = useSession();

  const activeWeddingId = weddingId || session?.weddingId || state.currentWeddingId || 'w1';
  const wedding = (state.weddings || []).find(w => w.id === activeWeddingId) || (state.weddings || [])[0];

  const isMcOrPlanner = Boolean(isMcView || isPlannerView || session?.role === 'mc' || session?.role === 'planner');

  const [activeTab, setActiveTab] = useState<CoupleTab>(() => {
    if (initialTab) return initialTab;
    try {
      const hash = window.location.hash.toLowerCase();
      const match = hash.match(/tab=([a-z0-9_]+)/);
      if (match && match[1]) return match[1] as CoupleTab;
    } catch {}
    return isMcOrPlanner ? 'mc_runsheet' : 'overview';
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else {
      try {
        const hash = window.location.hash.toLowerCase();
        const match = hash.match(/tab=([a-z0-9_]+)/);
        if (match && match[1]) {
          setActiveTab(match[1] as CoupleTab);
          return;
        }
      } catch {}
      if (isMcOrPlanner && activeTab !== 'mc_runsheet' && activeTab !== 'seating' && activeTab !== 'venue' && activeTab !== 'vendors') {
        setActiveTab('mc_runsheet');
      }
    }
  }, [initialTab, isMcOrPlanner]);

  const handleUpdateWeddingVendors = (newVendors: WeddingVendor[]) => {
    const updatedWeddings = (state.weddings || []).map(w => {
      if (w.id === wedding.id) {
        return { ...w, vendors: newVendors };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  // Wedding Day Celebration Mode (Interactive demo toggle)
  const [isWeddingDayMode, setIsWeddingDayMode] = useState<boolean>(false);

  // Overview Countdown
  const [countdown, setCountdown] = useState(getWeddingCountdown(wedding.date || '2026-11-14T14:00:00'));
  useEffect(() => {
    setCountdown(getWeddingCountdown(wedding.date || '2026-11-14T14:00:00'));
    const timer = setInterval(() => {
      setCountdown(getWeddingCountdown(wedding.date || '2026-11-14T14:00:00'));
    }, 1000);
    return () => clearInterval(timer);
  }, [wedding.date]);

  // Overview Tasks
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'pending'>('pending');
  const [taskFilter, setTaskFilter] = useState<'all' | 'urgent' | 'pending' | 'completed'>('all');
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = wedding.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, tasks: updatedTasks } : w));
    setState({ ...state, weddings: updatedWeddings });
  };
  const handleSetTaskPriority = (taskId: string, priority: 'urgent' | 'pending') => {
    const updatedTasks = wedding.tasks.map(t => (t.id === taskId ? { ...t, priority } : t));
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, tasks: updatedTasks } : w));
    setState({ ...state, weddings: updatedWeddings });
  };
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = wedding.tasks.filter(t => t.id !== taskId);
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, tasks: updatedTasks } : w));
    setState({ ...state, weddings: updatedWeddings });
    showToast('Task removed', 'info');
  };
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: 'task_' + Date.now(),
      text: newTaskInput.trim(),
      completed: false,
      due: 'This week',
      priority: newTaskPriority,
    };
    const updatedWeddings = state.weddings.map(w => (w.id === wedding.id ? { ...w, tasks: [...w.tasks, newTask] } : w));
    setState({ ...state, weddings: updatedWeddings });
    setNewTaskInput('');
    showToast('New planning task added!', 'success');
  };

  // Tab: Events & Schedule State (Event-Specific Invitations)
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
  const [storyChatInput, setStoryChatInput] = useState<string>('');
  const [storyChatMessages, setStoryChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'cheers';
    text: string;
    draft?: string;
    timestamp: string;
  }>>([
    {
      id: 'sc_init',
      sender: 'cheers',
      text: "Hello! I'm Cheers AI, your storytelling concierge. I can turn your romantic moments, milestone memories, and vows into a beautifully written 'Our Story' section for your wedding website. You can chat with me, choose a style, or upload notes from a file (.docx, .txt, .pdf)!",
      timestamp: 'Just now',
    },
  ]);
  const storyFileInputRef = useRef<HTMLInputElement | null>(null);
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
      showToast(`Updated "${eventFormName.trim()}"`, 'success');
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
      showToast(`Created "${eventFormName.trim()}" and added to guest schedule`, 'success');
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
    if (!window.confirm(`Are you sure you want to delete "${eventName}"? Invited guests will no longer see it on their schedule.`)) {
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
    showToast(`Event "${eventName}" deleted`, 'info');
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
        draft = `From the moment we met—${storyPromptHowWeMet.toLowerCase().replace(/\.$/, '')}—our lives began intertwining in ways neither of us could have anticipated.\n\nYears of quiet laughter and shared dreams led us to that unforgettable milestone: ${storyPromptProposal.toLowerCase().replace(/\.$/, '')}. With the world standing still around us, answering 'yes' was the easiest decision of our lives.\n\nToday, what we cherish most is the everyday magic we build together—${storyPromptCherish.toLowerCase().replace(/\.$/, '')}. As we begin this next chapter, we are deeply grateful to celebrate our love alongside our dearest family and friends.`;
      } else if (storyAiTone === 'playful') {
        draft = `It all started simply enough: ${storyPromptHowWeMet}\n\nBefore we knew it, coffee dates turned into road trips, inside jokes, and an unforgettable proposal—${storyPromptProposal.toLowerCase().replace(/\.$/, '')}. She/He said yes before the question was even fully out!\n\nWhat keeps us going? ${storyPromptCherish} We couldn't imagine tying the knot without the people who have laughed and celebrated with us along the way.`;
      } else {
        draft = `Our journey together began with ${storyPromptHowWeMet.toLowerCase().replace(/\.$/, '')}. That spark quickly grew into a partnership built on trust, genuine warmth, and unconditional support.\n\nWhen the moment came—${storyPromptProposal.toLowerCase().replace(/\.$/, '')}—we both knew our futures were forever bound.\n\nAs we look ahead, what matters most to us is ${storyPromptCherish.toLowerCase().replace(/\.$/, '')}. Thank you for being part of our story and celebrating this day with us.`;
      }
      setCheersDraftOutput(draft);
      setCheersIsDrafting(false);
      showToast('Cheers AI crafted your love story draft!', 'success');
    }, 700);
  };

  const handleSendStoryChatMessage = (customQuery?: string) => {
    const query = (customQuery || storyChatInput).trim();
    if (!query) return;

    if (!customQuery) setStoryChatInput('');

    // Add user bubble
    setStoryChatMessages((prev) => [
      ...prev,
      { id: 'usr_st_' + Date.now(), sender: 'user', text: query, timestamp: 'Just now' },
    ]);

    setTimeout(() => {
      let toneWord = 'romantic and timeless';
      let draftText = '';

      if (query.toLowerCase().includes('playful') || query.toLowerCase().includes('fun') || query.toLowerCase().includes('humor')) {
        toneWord = 'playful and joyful';
        draftText = `It all began simply enough: ${storyPromptHowWeMet}\n\nBefore we knew it, casual afternoon coffee turned into cross-country road trips, hundreds of inside jokes, and an unforgettable proposal—${storyPromptProposal.toLowerCase().replace(/\.$/, '')}. The answer was an immediate 'yes' before the question could even finish!\n\nWhat keeps us going? ${storyPromptCherish} We couldn't imagine celebrating this next chapter without the wonderful family and friends who have filled our journey with laughter.`;
      } else if (query.toLowerCase().includes('short') || query.toLowerCase().includes('concise') || query.toLowerCase().includes('brief')) {
        toneWord = 'warm and concise';
        draftText = `From our first meeting—${storyPromptHowWeMet.toLowerCase().replace(/\.$/, '')}—to our dream proposal—${storyPromptProposal.toLowerCase().replace(/\.$/, '')}—every moment has brought us closer.\n\nToday, what we cherish most is ${storyPromptCherish.toLowerCase().replace(/\.$/, '')}. We are overjoyed to celebrate our vows with those we love most.`;
      } else {
        draftText = `From the quiet moment we first met—${storyPromptHowWeMet.toLowerCase().replace(/\.$/, '')}—our paths aligned in ways neither of us could have predicted.\n\nYears of shared laughter, quiet evenings, and spontaneous adventures culminated in an unforgettable milestone: ${storyPromptProposal.toLowerCase().replace(/\.$/, '')}. In that moment, looking into each other's eyes, saying 'yes' felt as natural as breathing.\n\nWhat we cherish most today is the gentle magic of our everyday life—${storyPromptCherish.toLowerCase().replace(/\.$/, '')}. As we step forward into marriage, we are deeply grateful to share this celebration with everyone who has touched our hearts.`;
      }

      setCheersDraftOutput(draftText);
      setStoryChatMessages((prev) => [
        ...prev,
        {
          id: 'ch_st_' + Date.now(),
          sender: 'cheers',
          text: `✨ I've crafted a ${toneWord} version of your love story tailored to your request:\n\nReview the draft below and click 'Apply to Our Story' to publish it to your wedding website.`,
          draft: draftText,
          timestamp: 'Just now',
        },
      ]);
      showToast('Cheers AI drafted your couple story!', 'success');
    }, 300);
  };

  const handleStoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const reader = new FileReader();

    setStoryChatMessages((prev) => [
      ...prev,
      {
        id: 'usr_st_file_' + Date.now(),
        sender: 'user',
        text: `📎 Uploaded notes: "${fileName}" (${Math.round(file.size / 1024) || 1} KB)`,
        timestamp: 'Just now',
      },
    ]);

    reader.onload = (evt) => {
      const textContent = String(evt.target?.result || '').slice(0, 1000);
      const generatedDraft = `Our journey together is written in the moments that matter most—from our first chapter in Bowral to the sunset hike where forever was promised.\n\n"${textContent ? textContent.slice(0, 220) + '...' : storyPromptCherish}"\n\nWe are endlessly grateful for the warmth, humor, and unwavering love that our families and dearest friends bring to our lives as we begin this marriage.`;

      setCheersDraftOutput(generatedDraft);
      setStoryChatMessages((prev) => [
        ...prev,
        {
          id: 'ch_st_fres_' + Date.now(),
          sender: 'cheers',
          text: `📄 I've analyzed your notes from "${fileName}". I've woven your memories into an evocative couple story for your guests to enjoy.`,
          draft: generatedDraft,
          timestamp: 'Just now',
        },
      ]);
      showToast(`Story draft generated from ${fileName}`, 'success');
    };

    reader.readAsText(file);
    e.target.value = '';
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

  // Tab 2: Guest List State & Actions (Screenshot 23)
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'confirmed' | 'declined' | 'awaiting'>('all');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState<string>('all');
  const [guestViewMode, setGuestViewMode] = useState<'individual' | 'family'>('individual');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestHousehold, setNewGuestHousehold] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestDiet, setNewGuestDiet] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<string>('Uncategorised');
  const [newGuestAdults, setNewGuestAdults] = useState<number>(1);
  const [newGuestKids, setNewGuestKids] = useState<number>(0);
  const [familyPrimaryContacts, setFamilyPrimaryContacts] = useState<Record<string, string>>({});
  const [editingFamilyContact, setEditingFamilyContact] = useState<{
    householdKey: string;
    guestId?: string;
    name: string;
    phone: string;
    email: string;
  } | null>(null);

  const handleSetFamilyContact = (householdKey: string, guestId: string) => {
    setFamilyPrimaryContacts(prev => ({
      ...prev,
      [householdKey]: guestId,
    }));
    const member = state.guests.find(g => g.id === guestId);
    if (member) {
      showToast(`Primary contact set to ${member.name} for ${householdKey}`, 'info');
    }
  };

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
    showToast(`Category updated to ${category}`, 'success');
  };

  const handleRemoveGuest = (guestId: string) => {
    setState({
      ...state,
      guests: state.guests.filter(g => g.id !== guestId),
    });
    showToast('Guest removed from guest list', 'info');
  };

  const handleUpdateFamilyCategory = (householdKey: string, newCat: string) => {
    const updated = state.guests.map(g => {
      if ((g.household || g.name).trim() === householdKey.trim()) {
        return { ...g, category: newCat };
      }
      return g;
    });
    setState({ ...state, guests: updated });
    showToast(`Category for ${householdKey} updated to ${newCat}`, 'success');
  };

  const handleRemoveFamily = (householdKey: string) => {
    const membersToRemove = state.guests.filter(g => (g.household || g.name).trim() === householdKey.trim());
    const count = membersToRemove.length;
    const updated = state.guests.filter(g => (g.household || g.name).trim() !== householdKey.trim());
    setState({ ...state, guests: updated });
    showToast(`Removed ${householdKey} (${count} guest${count > 1 ? 's' : ''}) from list`, 'info');
  };

  // -------------------------------------------------------------
  // Guest List Import Types & State (CSV / XLSX with Cheers AI)
  // -------------------------------------------------------------
  interface ImportGuestRow {
    id: string;
    selected: boolean;
    name: string;
    household: string;
    email: string;
    phone: string;
    category: string;
    adults: number;
    kids: number;
    dietary: string;
    invitedEventIds: string[];
    status: 'ready' | 'review';
    warning?: string;
  }

  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'review'>('upload');
  const [importFileName, setImportFileName] = useState('');
  const [importRows, setImportRows] = useState<ImportGuestRow[]>([]);
  const [importSendMode, setImportSendMode] = useState<'drafts' | 'immediate'>('drafts');
  const [importDetectedMappings, setImportDetectedMappings] = useState<string[]>([]);
  const [importFilterStatus, setImportFilterStatus] = useState<'all' | 'ready' | 'review'>('all');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const normalizeImportKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

  const detectColumnMappings = (headers: string[]): Record<string, string> => {
    const map: Record<string, string> = {};
    const patterns: Record<string, RegExp> = {
      name: /^(name|fullname|guestname|guest|attendee|person|whoscoming|primaryguest)$/i,
      firstName: /^(firstname|first)$/i,
      lastName: /^(lastname|last|surname)$/i,
      household: /^(household|family|group|familygroup|familyname|party|tablegroup)$/i,
      email: /^(email|emailaddress|mail|e-mail)$/i,
      phone: /^(phone|mobile|cell|telephone|contact|phonenumber|mobilenumber|cellphone)$/i,
      category: /^(category|group|side|relationship|circle|guestcategory|type|relation)$/i,
      adults: /^(adults|adult|pax|partysize|adultcount|numberofadults|paxadults|guests)$/i,
      kids: /^(kids|children|child|infants|kidcount|numberofkids)$/i,
      dietary: /^(dietary|diet|allergies|allergy|food|specialmeal|foodrequirements|restrictions|dietaryrequirements|foodrestrictions)$/i,
      events: /^(events|invitedevents|celebrations|functions|whichevents)$/i,
    };

    headers.forEach(header => {
      const clean = normalizeImportKey(header);
      for (const [field, reg] of Object.entries(patterns)) {
        if (!map[field] && (reg.test(clean) || clean.includes(field.toLowerCase()))) {
          map[field] = header;
          break;
        }
      }
    });

    return map;
  };

  const normalizeImportPhone = (raw: any): string => {
    if (!raw) return '';
    const str = String(raw).trim();
    const digits = str.replace(/[^\d+]/g, '');
    if (digits.startsWith('04') && digits.length === 10) {
      return `+61 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    if (digits.startsWith('4') && digits.length === 9) {
      return `+61 4${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return str;
  };

  const mapImportCategory = (raw: string): string => {
    if (!raw) return "Mutual Friends";
    const s = raw.toLowerCase();
    if (s.includes('bridal') || s.includes('groomsmen') || s.includes('bridesmaid') || s.includes('party')) return "Bridal Party";
    if (s.includes('bride')) return "Bride's Family";
    if (s.includes('groom')) return "Groom's Family";
    if (s.includes('colleague') || s.includes('work')) return "Work Colleagues";
    if (s.includes('vip') || s.includes('extended')) return "VIP / Extended";
    return "Mutual Friends";
  };

  const handleProcessFileData = (data: ArrayBuffer | string, fileName: string) => {
    try {
      const workbook = XLSX.read(data, { type: typeof data === 'string' ? 'string' : 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

      if (!rawRows || rawRows.length === 0) {
        showToast('Spreadsheet appears to be empty or has no data rows', 'error');
        return;
      }

      const headers = Object.keys(rawRows[0] || {});
      const mapping = detectColumnMappings(headers);
      const mappingsList: string[] = [];

      if (mapping.name) mappingsList.push(`${mapping.name} ➔ Name`);
      else if (mapping.firstName) mappingsList.push(`${mapping.firstName} + ${mapping.lastName || ''} ➔ Name`);
      if (mapping.household) mappingsList.push(`${mapping.household} ➔ Household`);
      if (mapping.email) mappingsList.push(`${mapping.email} ➔ Email`);
      if (mapping.phone) mappingsList.push(`${mapping.phone} ➔ Phone`);
      if (mapping.category) mappingsList.push(`${mapping.category} ➔ Category`);
      if (mapping.dietary) mappingsList.push(`${mapping.dietary} ➔ Dietary`);
      if (mapping.events) mappingsList.push(`${mapping.events} ➔ Events`);

      const weddingEvents = wedding.events || [];
      const allEventIds = weddingEvents.map(e => e.id);

      const parsed: ImportGuestRow[] = rawRows.map((row, idx) => {
        let name = '';
        if (mapping.name && row[mapping.name]) {
          name = String(row[mapping.name]).trim();
        } else if (mapping.firstName && row[mapping.firstName]) {
          name = `${String(row[mapping.firstName]).trim()} ${String(row[mapping.lastName] || '').trim()}`.trim();
        } else {
          const possibleNameKey = Object.keys(row).find(k => /name/i.test(k));
          if (possibleNameKey) name = String(row[possibleNameKey]).trim();
        }

        let household = mapping.household && row[mapping.household] ? String(row[mapping.household]).trim() : '';
        if (!household && name) {
          household = `${name} Household`;
        }

        const email = mapping.email && row[mapping.email] ? String(row[mapping.email]).trim() : '';
        const phone = normalizeImportPhone(mapping.phone ? row[mapping.phone] : '');
        const category = mapImportCategory(mapping.category ? String(row[mapping.category]) : '');

        let adults = 1;
        if (mapping.adults && row[mapping.adults]) {
          const parsedAdults = parseInt(String(row[mapping.adults]), 10);
          if (!isNaN(parsedAdults) && parsedAdults > 0) adults = parsedAdults;
        }

        let kids = 0;
        if (mapping.kids && row[mapping.kids]) {
          const parsedKids = parseInt(String(row[mapping.kids]), 10);
          if (!isNaN(parsedKids) && parsedKids >= 0) kids = parsedKids;
        }

        const dietary = mapping.dietary && row[mapping.dietary] ? String(row[mapping.dietary]).trim() : '';

        // Match events if specified in spreadsheet
        let invitedEventIds: string[] = allEventIds;
        if (mapping.events && row[mapping.events]) {
          const rawEvtStr = String(row[mapping.events]).toLowerCase();
          const matched = weddingEvents.filter(evt => rawEvtStr.includes(evt.name.toLowerCase()) || rawEvtStr.includes(evt.name.split(' ')[0].toLowerCase()));
          if (matched.length > 0) {
            invitedEventIds = matched.map(m => m.id);
          }
        }

        let status: 'ready' | 'review' = 'ready';
        let warning = '';
        if (!name) {
          status = 'review';
          warning = 'Missing guest name';
        } else if (!email && !phone) {
          status = 'review';
          warning = 'Missing contact info';
        } else if (email && !email.includes('@')) {
          status = 'review';
          warning = 'Check email format';
        }

        return {
          id: `row_${Date.now()}_${idx}`,
          selected: true,
          name,
          household,
          email,
          phone,
          category,
          adults,
          kids,
          dietary,
          invitedEventIds,
          status,
          warning
        };
      });

      setImportFileName(fileName);
      setImportDetectedMappings(mappingsList);
      setImportRows(parsed);
      setImportStep('review');
      showToast(`✨ Cheers AI mapped ${parsed.length} guests from ${fileName}`, 'success');
    } catch (err: any) {
      console.error('Failed to parse spreadsheet:', err);
      showToast('Could not parse spreadsheet. Please verify the file format.', 'error');
    }
  };

  const handleLoadSampleSpreadsheet = () => {
    const sampleData = [
      {
        "Guest Name": "Dr. Evelyn Reed",
        "Family Unit": "The Reed Family",
        "Contact Email": "evelyn.reed@monash.edu",
        "Cell Phone": "0488 221 443",
        "Relation": "Bride's Family",
        "Pax Adults": 2,
        "Children": 1,
        "Food Restrictions": "Gluten-Free, Celiac",
        "Events": "Ceremony, Reception"
      },
      {
        "Guest Name": "Siddharth Mehta",
        "Family Unit": "Mehta Household",
        "Contact Email": "sid.mehta@sydneytech.io",
        "Cell Phone": "0419 555 782",
        "Relation": "Bridal Party",
        "Pax Adults": 2,
        "Children": 0,
        "Food Restrictions": "Vegan",
        "Events": "Ceremony, Sangeet, Reception, After-party"
      },
      {
        "Guest Name": "Claire & Oliver Dubois",
        "Family Unit": "Dubois Family",
        "Contact Email": "claire.dubois@artgallery.nsw",
        "Cell Phone": "0402 998 112",
        "Relation": "Mutual Friends",
        "Pax Adults": 2,
        "Children": 2,
        "Food Restrictions": "Dairy-Free for 1 child",
        "Events": "Ceremony, Reception, Breakfast"
      },
      {
        "Guest Name": "Thomas 'Tom' Henderson",
        "Family Unit": "Henderson",
        "Contact Email": "tom.hendo@melbournegym.com",
        "Cell Phone": "0433 112 904",
        "Relation": "Groom's Family",
        "Pax Adults": 1,
        "Children": 0,
        "Food Restrictions": "None",
        "Events": "Ceremony, Reception"
      },
      {
        "Guest Name": "Zara Al-Mansoor",
        "Family Unit": "Al-Mansoor",
        "Contact Email": "zara.m@canberralaw.com.au",
        "Cell Phone": "0421 776 339",
        "Relation": "VIP / Extended",
        "Pax Adults": 1,
        "Children": 0,
        "Food Restrictions": "Halal strictly",
        "Events": "Ceremony, Sangeet, Reception"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const arrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    handleProcessFileData(arrayBuffer, 'sample_wedding_guests.xlsx');
  };

  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const weddingEvents = wedding.events || [];
    const eventNames = weddingEvents.map(e => e.name).join(', ') || 'Ceremony, Reception';

    const templateRows = [
      {
        "Full Name": "Liam Chen",
        "Household / Group": "Chen Family",
        "Email Address": "liam.chen@example.com",
        "Mobile Phone": "+61 412 889 123",
        "Category": "Bridal Party",
        "Adults": 2,
        "Kids": 1,
        "Dietary Requirements": "Vegetarian",
        "Invited Events": eventNames
      },
      {
        "Full Name": "Aaliyah Patel",
        "Household / Group": "Patel Household",
        "Email Address": "aaliyah.patel@example.com",
        "Mobile Phone": "+61 423 456 789",
        "Category": "Bride's Family",
        "Adults": 2,
        "Kids": 0,
        "Dietary Requirements": "Halal, Nut Allergy",
        "Invited Events": eventNames
      },
      {
        "Full Name": "Marcus Vance",
        "Household / Group": "Marcus Vance",
        "Email Address": "marcus.vance@example.com",
        "Mobile Phone": "+61 434 567 890",
        "Category": "Mutual Friends",
        "Adults": 1,
        "Kids": 0,
        "Dietary Requirements": "None",
        "Invited Events": eventNames
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Guests");

    const fileName = `Tap_and_Toast_Guest_List_Template.${format}`;
    XLSX.writeFile(wb, fileName, { bookType: format });
    showToast(`Downloaded ${fileName}`, 'success');
  };

  const handleImportFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        handleProcessFileData(buffer, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleImportDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        handleProcessFileData(buffer, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const updateImportRow = (rowId: string, field: keyof ImportGuestRow, value: any) => {
    setImportRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const updated = { ...r, [field]: value };
      let status: 'ready' | 'review' = 'ready';
      let warning = '';
      if (!updated.name.trim()) {
        status = 'review';
        warning = 'Missing guest name';
      } else if (!updated.email.trim() && !updated.phone.trim()) {
        status = 'review';
        warning = 'Missing contact info';
      } else if (updated.email && !updated.email.includes('@')) {
        status = 'review';
        warning = 'Check email format';
      }
      updated.status = status;
      updated.warning = warning;
      return updated;
    }));
  };

  const toggleImportRowEvent = (rowId: string, eventId: string) => {
    setImportRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const exists = r.invitedEventIds.includes(eventId);
      const updatedEventIds = exists
        ? r.invitedEventIds.filter(id => id !== eventId)
        : [...r.invitedEventIds, eventId];
      return { ...r, invitedEventIds: updatedEventIds };
    }));
  };

  const handleAddBlankImportRow = () => {
    const newRow: ImportGuestRow = {
      id: `row_manual_${Date.now()}`,
      selected: true,
      name: '',
      household: '',
      email: '',
      phone: '',
      category: 'Mutual Friends',
      adults: 1,
      kids: 0,
      dietary: '',
      invitedEventIds: (wedding.events || []).map(e => e.id),
      status: 'review',
      warning: 'Enter guest name'
    };
    setImportRows(prev => [newRow, ...prev]);
  };

  const handleDeleteImportRow = (rowId: string) => {
    setImportRows(prev => prev.filter(r => r.id !== rowId));
  };

  const handleCommitImport = () => {
    const selectedRows = importRows.filter(r => r.selected);
    console.log('[Import] Commit button clicked. Selected rows:', selectedRows.length);
    if (selectedRows.length === 0) {
      showToast('Please select at least one guest to import', 'error');
      return;
    }

    const currentWeddingId = wedding?.id || 'w1';

    const newGuests: Guest[] = selectedRows.map((r, idx) => {
      const initials = r.name
        .split(' ')
        .map(p => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'G';

      const guestId = `guest_imported_${Date.now()}_${idx}`;

      const eventRsvps: Record<string, GuestEventRsvp> = {};
      (r.invitedEventIds || []).forEach(eventId => {
        eventRsvps[eventId] = {
          status: 'awaiting',
          dietary: r.dietary || '',
          updatedAt: new Date().toISOString()
        };
      });

      return {
        id: guestId,
        weddingId: wedding.id,
        name: r.name.trim() || 'Unnamed Guest',
        initials,
        household: r.household.trim() || `${r.name.trim()} Household`,
        email: r.email.trim(),
        phone: r.phone.trim(),
        rsvpStatus: 'awaiting' as const,
        adults: r.adults || 1,
        kids: r.kids || 0,
        partySize: (r.adults || 1) + (r.kids || 0),
        guestCount: (r.adults || 1) + (r.kids || 0),
        dietary: r.dietary.trim(),
        category: r.category || 'Mutual Friends',
        invitedEventIds: r.invitedEventIds && r.invitedEventIds.length > 0
          ? r.invitedEventIds
          : (wedding.events || []).map(e => e.id),
        eventRsvps,
        reminderSent: importSendMode === 'immediate',
        notes: importSendMode === 'drafts' ? 'Imported as Draft' : 'Invitation Dispatched on Import'
      };
    });

    const updatedGuests = [...newGuests, ...state.guests];
    const nextState = {
      ...state,
      guests: updatedGuests
    };
    setState(nextState);

    logAudit(
      nextState,
      setState,
      'GUESTS_IMPORTED',
      'Couple',
      'couple',
      `Imported ${newGuests.length} guests (${importSendMode === 'drafts' ? 'Drafts' : 'Immediate Dispatch'}) from ${importFileName || 'spreadsheet'}`,
      'Guests'
    );

    setShowImportModal(false);
    setImportRows([]);
    setImportFileName('');

    if (importSendMode === 'drafts') {
      showToast(`Successfully imported ${newGuests.length} guests as drafts!`, 'success');
    } else {
      showToast(`Imported ${newGuests.length} guests and dispatched digital invitations!`, 'success');
    }
  };

  const handleAddNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const adults = Math.max(1, newGuestAdults);
    const kids = Math.max(0, newGuestKids);
    const total = adults + kids;
    const newGuest: Guest = {
      id: 'g_' + Date.now(),
      name: newGuestName.trim(),
      initials: newGuestName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
      household: newGuestHousehold.trim() || newGuestName.trim(),
      email: `${newGuestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newGuestPhone || '0400 000 000',
      rsvpStatus: 'awaiting',
      guestCount: total,
      partySize: total,
      adults,
      kids,
      dietary: newGuestDiet || 'None',
      tableId: null,
      seatIndex: null,
      category: newGuestCategory || 'Uncategorised',
      reminderSent: false,
      invitedEventIds: newGuestEventIds.length > 0 ? newGuestEventIds : (wedding.events || []).map(e => e.id),
      eventRsvps: {},
    };
    setState({
      ...state,
      guests: [newGuest, ...state.guests],
    });
    setShowAddGuestModal(false);
    setNewGuestName('');
    setNewGuestHousehold('');
    setNewGuestPhone('');
    setNewGuestDiet('');
    setNewGuestAdults(1);
    setNewGuestKids(0);
    showToast(`Added ${newGuest.name} (${adults} adults, ${kids} kids) to Guest List`, 'success');
  };

  // Tab 3: Seating State & Actions (Screenshot 24)
  const [seatingViewMode, setSeatingViewMode] = useState<'floor' | 'list'>('floor');
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [tableAssignSelect, setTableAssignSelect] = useState<Record<string, string>>({});
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ type: 'table' | 'seat'; tableId?: string; seatIndex?: number } | null>(null);
  const [isDraggingOverUnassigned, setIsDraggingOverUnassigned] = useState(false);

  const handleGuestDragStart = (e: React.DragEvent, guestId: string, fromTableId?: string, fromSeatIndex?: number) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ guestId, fromTableId, fromSeatIndex }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedGuestId(guestId);
  };

  const handleGuestDragEnd = () => {
    setDraggedGuestId(null);
    setDragOverTarget(null);
    setIsDraggingOverUnassigned(false);
  };

  const handleDropOnTable = (e: React.DragEvent, targetTableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);

    let data: { guestId: string; fromTableId?: string; fromSeatIndex?: number };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      if (!draggedGuestId) return;
      data = { guestId: draggedGuestId };
    }
    const { guestId } = data;
    if (!guestId) return;

    const targetTbl = targetTableId === 'head'
      ? { id: 'head', name: 'HEAD TABLE', capacity: 8 }
      : state.tables.find(t => t.id === targetTableId || t.name.toLowerCase() === targetTableId.replace('_', ' ').toLowerCase());
    const targetId = targetTbl ? targetTbl.id : targetTableId;
    const targetName = targetTbl ? targetTbl.name : 'Table';

    const seatedGuests = state.guests.filter(g => g.tableId === targetId);
    if (seatedGuests.length >= 8) {
      showToast(`${targetName} is already full (8/8 seats occupied)`, 'error');
      return;
    }

    let firstEmptySeat = -1;
    for (let s = 0; s < 8; s++) {
      if (!seatedGuests.some(g => g.seatIndex === s)) {
        firstEmptySeat = s;
        break;
      }
    }
    if (firstEmptySeat === -1) firstEmptySeat = seatedGuests.length;

    const movingGuest = state.guests.find(g => g.id === guestId);
    const updatedGuests = state.guests.map(g => {
      if (g.id === guestId) {
        return { ...g, tableId: targetId, seatIndex: firstEmptySeat };
      }
      return g;
    });

    setState({ ...state, guests: updatedGuests });
    showToast(`Seated ${movingGuest?.name || 'guest'} at ${targetName} (Seat ${firstEmptySeat + 1})!`, 'success');
  };

  const handleDropOnSeat = (e: React.DragEvent, targetTableId: string, targetSeatIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);

    let data: { guestId: string; fromTableId?: string; fromSeatIndex?: number };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      if (!draggedGuestId) return;
      data = { guestId: draggedGuestId };
    }
    const { guestId, fromTableId, fromSeatIndex } = data;
    if (!guestId) return;

    const targetTbl = targetTableId === 'head'
      ? { id: 'head', name: 'HEAD TABLE', capacity: 8 }
      : state.tables.find(t => t.id === targetTableId || t.name.toLowerCase() === targetTableId.replace('_', ' ').toLowerCase());
    const targetId = targetTbl ? targetTbl.id : targetTableId;
    const targetName = targetTbl ? targetTbl.name : 'Table';

    const occupant = state.guests.find(g => g.tableId === targetId && g.seatIndex === targetSeatIndex);
    const movingGuest = state.guests.find(g => g.id === guestId);

    let updatedGuests = [...state.guests];

    if (occupant && occupant.id !== guestId) {
      if (fromTableId && fromSeatIndex !== undefined) {
        updatedGuests = updatedGuests.map(g => {
          if (g.id === guestId) return { ...g, tableId: targetId, seatIndex: targetSeatIndex };
          if (g.id === occupant.id) return { ...g, tableId: fromTableId, seatIndex: fromSeatIndex };
          return g;
        });
        showToast(`Swapped seats between ${movingGuest?.name} and ${occupant.name}`, 'success');
      } else {
        updatedGuests = updatedGuests.map(g => {
          if (g.id === occupant.id) return { ...g, tableId: null, seatIndex: null };
          if (g.id === guestId) return { ...g, tableId: targetId, seatIndex: targetSeatIndex };
          return g;
        });
        showToast(`Seated ${movingGuest?.name} at ${targetName} (Seat ${targetSeatIndex + 1})`, 'success');
      }
    } else {
      updatedGuests = updatedGuests.map(g => {
        if (g.id === guestId) return { ...g, tableId: targetId, seatIndex: targetSeatIndex };
        return g;
      });
      showToast(`Seated ${movingGuest?.name} at ${targetName} (Seat ${targetSeatIndex + 1})`, 'success');
    }

    setState({ ...state, guests: updatedGuests });
  };

  const handleDropOnUnassigned = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverUnassigned(false);
    setDragOverTarget(null);

    let data: { guestId: string };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      if (!draggedGuestId) return;
      data = { guestId: draggedGuestId };
    }
    const { guestId } = data;
    if (!guestId) return;

    const movingGuest = state.guests.find(g => g.id === guestId);
    if (movingGuest && movingGuest.tableId) {
      const updatedGuests = state.guests.map(g => (g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g));
      setState({ ...state, guests: updatedGuests });
      showToast(`Unseated ${movingGuest.name}. Returned to unassigned list.`, 'info');
    }
  };

  const handleSeatDotClick = (tableId: string, seatIndex: number) => {
    const occupant = state.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex);
    if (occupant) {
      if (window.confirm(`Unseat ${occupant.name} from this seat?`)) {
        const updatedGuests = state.guests.map(g => (g.id === occupant.id ? { ...g, tableId: null, seatIndex: null } : g));
        setState({ ...state, guests: updatedGuests });
        showToast(`Unseated ${occupant.name}`, 'info');
      }
    } else {
      const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
      if (unassigned.length > 0) {
        const nextGuest = unassigned[0];
        const updatedGuests = state.guests.map(g => (g.id === nextGuest.id ? { ...g, tableId, seatIndex } : g));
        setState({ ...state, guests: updatedGuests });
        showToast(`Seated ${nextGuest.name} at Seat ${seatIndex + 1}!`, 'success');
      } else {
        showToast('All confirmed guests are currently seated.', 'info');
      }
    }
  };

  const handleSuggestSeating = () => {
    const unassigned = state.guests.filter(g => g.rsvpStatus === 'confirmed' && !g.tableId);
    if (unassigned.length === 0) {
      showToast('All confirmed guests are already seated!', 'info');
      return;
    }
    const tableIds = ['head', 'table_1', 'table_2', 'table_3', 'table_4', 'table_5', 'table_6'];
    let currentUnassigned = [...unassigned];
    let updatedGuests = [...state.guests];
    let countAssigned = 0;

    for (const tblId of tableIds) {
      const seated = updatedGuests.filter(g => g.tableId === tblId);
      for (let s = 0; s < 8; s++) {
        if (!seated.some(g => g.seatIndex === s) && currentUnassigned.length > 0) {
          const nextGuest = currentUnassigned.shift()!;
          updatedGuests = updatedGuests.map(g => (g.id === nextGuest.id ? { ...g, tableId: tblId, seatIndex: s } : g));
          countAssigned++;
        }
      }
    }
    setState({ ...state, guests: updatedGuests });
    showToast(`✨ AI Seating: Optimally seated ${countAssigned} guests!`, 'success');
  };

  const handleAddTable = () => {
    const currentTableCount = state.tables.filter(t => !t.isHead).length;
    const newNum = currentTableCount + 1;
    const newTable = {
      id: 'table_' + newNum,
      name: 'Table ' + newNum,
      capacity: 8,
      isHead: false,
    };
    setState({ ...state, tables: [...state.tables, newTable] });
    showToast(`Added Table ${newNum} to ballroom floor plan`, 'success');
  };

  // Tab 4: Content & Stories State (Screenshot 25)
  const [contentSubTab, setContentSubTab] = useState<'ourStory' | 'inMemoriam' | 'diningMenu' | 'meetTheTeam' | 'honeymoonUpdates'>('ourStory');
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number>(0);
  const [contentPages, setContentPages] = useState<{
    [key in 'ourStory' | 'inMemoriam' | 'diningMenu' | 'meetTheTeam' | 'honeymoonUpdates']: {
      title: string;
      subtitle: string;
      content: string;
      caption: string;
      icon: string;
      status: string;
      layoutMode?: 'single' | 'collage';
      photos: string[];
    };
  }>({
    ourStory: {
      title: 'Our Story',
      subtitle: 'From a chance encounter in Bowral to forever in the Southern Highlands',
      content: 'We met on a rainy autumn afternoon in Bowral at a small corner bookstore. Five years, countless road trips, and one unforgettable sunset in Queenstown later, here we are celebrating our wedding with all the people who mean the most to us.',
      caption: 'Bowral Autumn 2021',
      icon: '💍',
      status: 'Published',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      ],
    },
    inMemoriam: {
      title: 'In Loving Memory',
      subtitle: 'Honoring loved ones who are forever present in our hearts today',
      content: 'Though you cannot sit with us today, your love, guidance, and warmth surround every celebration and smile in this room. We dedicate this ceremony to Grandma Helen and Uncle Robert.',
      caption: 'Grandma Helen & Uncle Robert',
      icon: '🕊️',
      status: 'Published',
      photos: [
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
      ],
    },
    diningMenu: {
      title: 'Wedding Feast & Menu',
      subtitle: 'Three-course seasonal estate dining crafted by Chef Marco Rossi',
      content: 'Entrée: Seared Southern Highlands scallops or heirloom burrata.\nMain: Slow-roasted grass-fed beef tenderloin or wild mushroom truffle risotto.\nDessert: Dark chocolate flourless ganache or lemon myrtle panna cotta.',
      caption: 'Chef Marco Rossi Seasonal Menu',
      icon: '🍽️',
      status: 'Published',
      photos: [
        'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      ],
    },
    meetTheTeam: {
      title: 'The Bridal Party & Crew',
      subtitle: 'Meet our lifelong friends, best men, and maid of honor',
      content: 'Maid of Honor: Hannah Martin\nBest Man: Oliver Vance\nBridesmaids: Charlotte Evans, Grace Turner\nGroomsmen: Liam Fletcher, Benjamin Ross',
      caption: 'The Bridal Party',
      icon: '👥',
      status: 'Published',
      photos: [
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
      ],
    },
    honeymoonUpdates: {
      title: 'Honeymoon in Queenstown',
      subtitle: 'Our upcoming alpine adventure across New Zealand South Island',
      content: 'Following our wedding, we are heading to Lake Wakatipu, Milford Sound, and Central Otago wineries for two weeks of crisp mountain air, hiking, and celebrating our new beginning!',
      caption: 'Lake Wakatipu & Remarkables',
      icon: '✈️',
      status: 'Draft',
      photos: [
        'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
      ],
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, mode?: 'single' | 'collage') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotos = contentPages[contentSubTab].photos || [];
    const maxSlots = mode === 'single' ? 1 : 5;
    const availableSlots = mode === 'single' ? 1 : Math.max(0, 5 - currentPhotos.length);
    if (availableSlots <= 0 && mode !== 'single') {
      showToast('Maximum of 5 photos reached for this page', 'error');
      return;
    }

    const filesToRead = Array.from(files).slice(0, availableSlots);
    const readers = filesToRead.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newPhotos) => {
      setContentPages((prev) => {
        const targetMode = mode || (prev[contentSubTab].layoutMode || (newPhotos.length > 1 ? 'collage' : 'single'));
        const updatedPhotos = mode === 'single'
          ? newPhotos.slice(0, 1)
          : [...(prev[contentSubTab].photos || []), ...newPhotos].slice(0, 5);
        return {
          ...prev,
          [contentSubTab]: {
            ...prev[contentSubTab],
            photos: updatedPhotos,
            layoutMode: targetMode,
          },
        };
      });
      setPreviewPhotoIndex(0);
      showToast(mode === 'single' ? 'Single hero photo uploaded' : `Added ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} to collage`, 'success');
      e.target.value = '';
    });
  };

  const handleRemovePhoto = (photoIdx: number) => {
    const currentPhotos = contentPages[contentSubTab].photos || [];
    const updated = currentPhotos.filter((_, idx) => idx !== photoIdx);
    setContentPages((prev) => ({
      ...prev,
      [contentSubTab]: {
        ...prev[contentSubTab],
        photos: updated,
      },
    }));
    if (previewPhotoIndex >= updated.length) {
      setPreviewPhotoIndex(Math.max(0, updated.length - 1));
    }
  };

  // Tab 5: Invitations State (Screenshot 26)
  const [selectedQaRdPalette, setSelectedQaRdPalette] = useState<'obsidian' | 'champagne' | 'merlot' | 'sage'>('obsidian');
  const [selectedQaRdHousehold, setSelectedQaRdHousehold] = useState<string>('Priya Sharma (The Sharma Family)');

  // Tab 6: Gift & Thank-You State (Screenshot 27)
  const [giftSubTab, setGiftSubTab] = useState<'registry' | 'thankyou'>('registry');
  const [showManualGiftModal, setShowManualGiftModal] = useState(false);
  const [manualGiftFrom, setManualGiftFrom] = useState('');
  const [manualGiftAmount, setManualGiftAmount] = useState('');
  const [manualGiftMessage, setManualGiftMessage] = useState('');

  interface CoupleGiftItem {
    id: string;
    from: string;
    amount: string;
    amountNum: number;
    date: string;
    msg: string;
    status: 'Sent' | 'Due' | 'Drafted' | 'Completed';
    noteDraft?: string;
    source?: 'stripe' | 'manual';
  }

  const [coupleGifts, setCoupleGifts] = useState<CoupleGiftItem[]>([
    { id: 'cg1', from: 'The Whitfield family', amount: '$250', amountNum: 250, date: 'Today', msg: '"Wishing you both a lifetime of love and happiness!"', status: 'Sent', noteDraft: 'Dear The Whitfield family, thank you so much for your generous gift of $250! It means the world to have your love and support.' },
    { id: 'cg2', from: 'Sarah & Michael Chen', amount: '$300', amountNum: 300, date: 'Yesterday', msg: '"So thrilled for you Sophie and James!"', status: 'Due', noteDraft: 'Dear Sarah & Michael, thank you both for celebrating our special day and for your wonderful gift of $300!' },
    { id: 'cg3', from: 'Aunty Carol & Uncle Peter', amount: '$500', amountNum: 500, date: '2 days ago', msg: '"With all our love and blessings on your special day."', status: 'Due', noteDraft: 'Dear Aunty Carol & Uncle Peter, your blessings and generous gift of $500 touched our hearts deeply.' },
    { id: 'cg4', from: 'Emma & David Wilson', amount: '$200', amountNum: 200, date: '3 days ago', msg: '"Congratulations to the wonderful couple!"', status: 'Due', noteDraft: 'Dear Emma & David, thank you so much for traveling down to Mittagong and for your kind gift of $200.' },
    { id: 'cg5', from: 'Marcus & Olivia Vance', amount: '$350', amountNum: 350, date: '4 days ago', msg: '"Enjoy every second of the celebration!"', status: 'Due', noteDraft: 'Dear Marcus & Olivia, thank you for your radiant energy and generous gift of $350!' },
  ]);

  const [selectedGiftForThankYou, setSelectedGiftForThankYou] = useState<CoupleGiftItem | null>(null);
  const [thankYouNoteDraft, setThankYouNoteDraft] = useState('');
  const [thankYouStatusChoice, setThankYouStatusChoice] = useState<'Sent' | 'Due' | 'Drafted' | 'Completed'>('Due');

  // Tab 7: Celebration Feed State (Single Stream, Authentic Notes Only)
  const [officialNoteText, setOfficialNoteText] = useState('');

  interface FeedPost {
    id: string;
    title: string;
    time: string;
    category?: 'guest' | 'couple';
    tag?: string;
    quote?: string;
    photo?: string;
    likes: number;
    comments: number;
    expanded?: boolean;
    pinned?: boolean;
    replies?: Array<{ author: string; text: string; time: string }>;
  }
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 'fp_couple_welcome',
      category: 'couple',
      title: 'Welcome Note from Sophie & James',
      time: 'Today, 10:00 AM',
      quote: "Welcome to our wedding celebration portal! We are so excited to celebrate our love with all of our dearest friends and family at Fernwood Estate. Please feel free to share love notes and wishes here!",
      likes: 19,
      comments: 2,
      expanded: true,
      replies: [
        { author: 'Aunty Carol', text: 'So proud of you both! ❤️', time: '1 hour ago' },
      ],
    },
    {
      id: 'fp_photo_moment',
      category: 'couple',
      title: 'Sophie & James shared an update',
      time: '2 hours ago',
      quote: 'Our menu tasting session at Fernwood Estate went wonderfully! We cannot wait for everyone to try the autumn banquet menu.',
      likes: 34,
      comments: 4,
      expanded: true,
      replies: [
        { author: 'Marcus Sterling', text: 'Looks divine! Can’t wait for November.', time: '1 hour ago' },
      ],
    },
    {
      id: 'fp3',
      category: 'guest',
      title: 'Aunty Carol left a note',
      time: '2 minutes ago',
      quote: "So excited for you both — can't wait to celebrate! 💕",
      likes: 5,
      comments: 1,
      expanded: false,
      replies: [
        { author: 'Sophie & James', text: 'Thank you Aunty Carol! Counting down the days to see you! 💕', time: 'Just now' },
      ],
    },
    {
      id: 'fp_guest_toast',
      category: 'guest',
      title: 'Liam & Olivia sent congratulations',
      time: '45 minutes ago',
      quote: 'Counting down the days! Pack your dancing shoes everyone, this is going to be legendary! 🥂🎉',
      likes: 12,
      comments: 0,
      expanded: false,
      replies: [],
    },
  ]);

  const [replyingPost, setReplyingPost] = useState<FeedPost | null>(null);
  const [replyText, setReplyText] = useState('');

  // Tab 8: Vault State (Screenshot 29)
  const [vaultPermission, setVaultPermission] = useState('couple_mc');

  // Tab 12: Settings - Invite MC / Wedding Planner state
  const [inviteMcName, setInviteMcName] = useState('');
  const [inviteMcEmail, setInviteMcEmail] = useState('');
  const [inviteMcPhone, setInviteMcPhone] = useState('');
  const [inviteMcCompany, setInviteMcCompany] = useState('');
  const [hasRequestedMcInvite, setHasRequestedMcInvite] = useState(false);
  const [isMcUnlinked, setIsMcUnlinked] = useState(false);

  const handleRequestMcInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteMcName.trim() || !inviteMcEmail.trim()) {
      showToast('Please enter MC/Wedding Planner Name and Email', 'error');
      return;
    }
    const auditEntry = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: 'MC / Wedding Planner Invite Requested',
      user: wedding?.couple || 'Sophie & James',
      role: 'couple' as const,
      category: 'Onboarding',
      details: `Couple requested SuperAdmin to send onboarding invite to MC/Wedding Planner: ${inviteMcName.trim()} (${inviteMcEmail.trim()}, Phone: +61 ${inviteMcPhone.trim() || 'N/A'}, Company: ${inviteMcCompany.trim() || 'N/A'})`,
    };
    setState({
      ...state,
      auditLog: [auditEntry, ...(state.auditLog || [])],
    });
    setHasRequestedMcInvite(true);
    showToast('✓ Invite request sent to SuperAdmin! SuperAdmin will dispatch the onboarding invite link.', 'success');
  };

  // Tab 9: Anniversary State (Screenshots 30-32)
  const [anniversaryMode, setAnniversaryMode] = useState<'countdown' | 'preview'>('countdown');
  const [reflectionsInput, setReflectionsInput] = useState('Year one has flown by! We survived home renovations and our dream trip to New Zealand.');

  // Memory Pop-up Modal State
  interface WeddingMemory {
    id: string;
    title: string;
    desc: string;
    icon: string;
    type: 'gallery' | 'notes' | 'music' | 'vows' | 'toasts' | 'seating';
  }
  const [selectedMemory, setSelectedMemory] = useState<WeddingMemory | null>(null);

  // Color Themes State (default palettes + custom user-added palettes)
  const [colorThemes, setColorThemes] = useState([
    { id: 'merlot', name: 'Burgundy Merlot', bg: '#2b1016', text: '#ffffff', sub: 'Rich Wine & Gold' },
    { id: 'sage', name: 'Botanical Sage', bg: '#1c2820', text: '#ffffff', sub: 'Forest Olive & Gold' },
    { id: 'gold', name: 'Champagne Gold', bg: '#302619', text: '#ffffff', sub: 'Warm Ochre & Cream' },
    { id: 'obsidian', name: 'Obsidian Noir', bg: '#15110e', text: '#ffffff', sub: 'Deep Ink & Gold' },
  ]);
  const [isDressCodeModalOpen, setIsDressCodeModalOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('Burgundy Merlot');
  const [newThemeSub, setNewThemeSub] = useState('Rich Wine & Gold');
  const [newThemeColor, setNewThemeColor] = useState('#8B1E3F');

  // Helper to extract embeddable Google Maps iframe URL
  const getGoogleMapsEmbedUrl = (rawUrl?: string, fallbackVenue?: string, fallbackAddress?: string) => {
    const trimmed = (rawUrl || '').trim();
    if (!trimmed) {
      const q = `${fallbackVenue || ''} ${fallbackAddress || ''}`.trim() || 'Fernwood Estate Mittagong NSW';
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    // If user pasted an iframe embed code
    if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
      const match = trimmed.match(/src=["']([^"']+)["']/);
      if (match && match[1]) return match[1];
    }
    // If user provided a URL with output=embed already
    if (trimmed.includes('output=embed')) {
      return trimmed;
    }
    let query = trimmed;
    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const parsed = new URL(trimmed);
        const qParam = parsed.searchParams.get('q') || parsed.searchParams.get('query');
        if (qParam) {
          query = qParam;
        } else if (parsed.pathname.includes('/place/')) {
          const parts = parsed.pathname.split('/place/')[1]?.split('/');
          if (parts && parts[0]) {
            query = decodeURIComponent(parts[0].replace(/\+/g, ' '));
          }
        }
      }
    } catch (e) {
      // fallback to trimmed
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const getGoogleMapsNavUrl = (rawUrl?: string, fallbackVenue?: string, fallbackAddress?: string) => {
    const trimmed = (rawUrl || '').trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const q = trimmed || `${fallbackVenue || ''} ${fallbackAddress || ''}`.trim() || 'Fernwood Estate Mittagong NSW';
    return `https://maps.google.com/?q=${encodeURIComponent(q)}`;
  };

  // Tab 11: Settings State (Screenshot 34)
  const [weddingSettings, setWeddingSettings] = useState(() => {
    const saved = localStorage.getItem(`tt_wedding_settings_${wedding.id || 'default'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
    partner1: 'Sophie',
    partner2: 'James',
    dateTime: '14-11-2026 14:00',
    receptionTime: '16:00',
    dressCode: 'Black Tie Optional / Formal Elegance',
    weddingHashtag: '#SophieAndJames2026',
    themeColor: 'merlot',
    venueName: 'Fernwood Estate, Southern Highlands',
    venueAddress: '124 Range Road, Mittagong NSW 2575',
    googleMapsUrl: wedding.googleMapsUrl || 'https://maps.google.com/?q=Fernwood+Estate+124+Range+Road+Mittagong+NSW+2575',
    parkingInstructions: 'Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival.',
    valetInstructions: 'Attendants stationed at the porte-cochère from 1:15 PM.',
    shuttleSchedule: '1:15 PM Bowral Grand Hotel, 1:30 PM Milton Park Country House.',
    weatherContingency: 'Ceremony moves to Glasshouse Orangery if rain probability exceeds 40%.',
    enableDigitalGifts: true,
    enableJoeyAI: true,
    enableCelebrationFeed: true,
    enableSongRequests: true,
    enableGuestPhotos: true,
    smsAlertsOnRsvp: true,
    dailyGiftDigest: true,
    hideSeatingUntilMorning: false,
    };
  });

  // Sync wedding settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`tt_wedding_settings_${wedding.id || 'default'}`, JSON.stringify(weddingSettings));
    } catch (e) {}
  }, [weddingSettings, wedding.id]);

  // Scoped guests for this active wedding
  const weddingGuests = (state.guests || []).filter(g => g.weddingId === wedding.id || (!g.weddingId && wedding.id === 'w1'));
  const confirmedGuests = weddingGuests.filter(g => g.rsvpStatus === 'confirmed');
  const awaitingGuests = weddingGuests.filter(g => g.rsvpStatus === 'awaiting');
  const declinedGuests = weddingGuests.filter(g => g.rsvpStatus === 'declined');

  const filteredGuests = weddingGuests.filter(g => {
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
    const matchEvent = guestEventFilter === 'all' || (g.invitedEventIds || []).includes(guestEventFilter);
    return matchSearch && matchFilter && matchCat && matchEvent;
  });

  // Group wedding guests into families / households
  interface FamilyGroupItem {
    id: string;
    householdKey: string;
    familyName: string;
    members: Guest[];
    memberNames: string;
    category: string;
    phone: string;
    email: string;
    rsvpStatus: 'confirmed' | 'declined' | 'awaiting';
    adultsCount: number;
    kidsCount: number;
    partyTotal: number;
    dietarySummary: string;
    tableId: string | null;
    tableLabel: string;
  }

  // Realistic UI demo presets for family/household view
  const FAMILY_DEMO_PRESETS: Record<string, { adults: number; kids: number; dietary: string; table: string }> = {
    'uncle david household': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'TABLE 6' },
    'uncle david': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'TABLE 6' },
    'the johnson family': { adults: 2, kids: 2, dietary: 'Vegetarian, Gluten-Free', table: 'TABLE 4' },
    'the sharma family': { adults: 2, kids: 2, dietary: 'Vegetarian, Nut allergy', table: 'TABLE 4' },
    'the chen family': { adults: 3, kids: 2, dietary: 'Vegan, Nut allergy', table: 'TABLE 1' },
    'the whitfield family': { adults: 2, kids: 3, dietary: 'Vegan, Gluten-Free', table: 'TABLE 5' },
    'the whitfield household': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'TABLE 6' },
    'the o\'neill family': { adults: 2, kids: 1, dietary: 'Nut allergy, Dairy-Free', table: 'TABLE 2' },
    'the bell family': { adults: 2, kids: 2, dietary: 'Vegetarian, Halal', table: 'HEAD TABLE' },
    'the gordon family': { adults: 2, kids: 1, dietary: 'Vegan, Nut allergy', table: 'HEAD TABLE' },
    'the martin family': { adults: 3, kids: 1, dietary: 'Vegetarian, Gluten-Free', table: 'HEAD TABLE' },
    'the vance family': { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'HEAD TABLE' },
    'the evans family': { adults: 2, kids: 2, dietary: 'Gluten-Free, Nut allergy', table: 'TABLE 1' },
    'the fletcher family': { adults: 2, kids: 1, dietary: 'Halal, Vegetarian', table: 'TABLE 2' },
    'the kelly family': { adults: 2, kids: 2, dietary: 'Vegan, Dairy-Free', table: 'TABLE 3' },
    'the wright family': { adults: 3, kids: 2, dietary: 'Nut allergy, Vegetarian', table: 'TABLE 3' },
    'the king family': { adults: 2, kids: 2, dietary: 'Vegan, Gluten-Free', table: 'TABLE 5' },
    'the palmer family': { adults: 2, kids: 1, dietary: 'Nut allergy, Vegan', table: 'TABLE 6' },
    'the lewis family': { adults: 2, kids: 2, dietary: 'Gluten-Free, Nut allergy', table: 'TABLE 7' },
    'the scott family': { adults: 2, kids: 3, dietary: 'Vegetarian, Vegan', table: 'TABLE 7' },
    'the miller family': { adults: 2, kids: 1, dietary: 'Halal, Gluten-Free', table: 'TABLE 8' },
    'the nelson family': { adults: 3, kids: 1, dietary: 'Nut allergy, Vegan', table: 'TABLE 8' },
    'the patel family': { adults: 2, kids: 2, dietary: 'Vegetarian, Vegan', table: 'TABLE 9' },
    'the turner family': { adults: 2, kids: 1, dietary: 'Gluten-Free, Nut allergy', table: 'TABLE 9' },
    'the abbas family': { adults: 2, kids: 2, dietary: 'Halal, Nut allergy', table: 'TABLE 10' },
    'the webb family': { adults: 3, kids: 1, dietary: 'Vegan, Nut allergy', table: 'TABLE 10' },
  };

  const DEMO_PATTERNS = [
    { adults: 2, kids: 3, dietary: 'Vegan, Nut allergy', table: 'TABLE 5' },
    { adults: 2, kids: 2, dietary: 'Vegetarian, Gluten-Free', table: 'TABLE 4' },
    { adults: 2, kids: 1, dietary: 'Gluten-Free, Nut allergy', table: 'TABLE 2' },
    { adults: 3, kids: 2, dietary: 'Halal, Vegetarian', table: 'TABLE 3' },
    { adults: 2, kids: 3, dietary: 'Vegan, Gluten-Free', table: 'TABLE 6' },
    { adults: 3, kids: 1, dietary: 'Vegetarian, Nut allergy', table: 'TABLE 7' },
    { adults: 2, kids: 2, dietary: 'Nut allergy, Dairy-Free', table: 'TABLE 8' },
    { adults: 2, kids: 1, dietary: 'Vegan, Vegetarian', table: 'TABLE 9' },
  ];

  const familyGroups: FamilyGroupItem[] = React.useMemo(() => {
    const map = new Map<string, Guest[]>();
    weddingGuests.forEach(g => {
      const key = (g.household || g.name).trim();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(g);
    });

    const groups: FamilyGroupItem[] = [];
    map.forEach((members, householdKey) => {
      // Couple chooses who to put as primary contact; default to first member
      const chosenGuestId = familyPrimaryContacts[householdKey];
      const primary = (chosenGuestId && members.find(m => m.id === chosenGuestId)) || members[0];

      let adultsCount = 0;
      let kidsCount = 0;
      members.forEach(m => {
        const isChild = (m.kids || 0) > 0 && (!m.adults || m.adults === 0);
        if (isChild) {
          kidsCount += 1;
        } else {
          adultsCount += 1;
        }
      });
      let partyTotal = adultsCount + kidsCount;

      const dietCounts: Record<string, number> = {};
      members.forEach(m => {
        const parsed = parseDietaryRequirements(m.dietary);
        parsed.forEach(d => {
          const clean = d.replace(/^\d+x\s*/i, '').trim();
          if (clean) {
            dietCounts[clean] = (dietCounts[clean] || 0) + 1;
          }
        });
      });
      const dietEntries = Object.entries(dietCounts);
      let dietarySummary =
        dietEntries.length > 0
          ? dietEntries.map(([diet, count]) => `${count}x ${diet}`).join(', ')
          : 'None';

      const allConfirmed = members.every(m => m.rsvpStatus === 'confirmed');
      const allDeclined = members.every(m => m.rsvpStatus === 'declined');
      const rsvpStatus: 'confirmed' | 'declined' | 'awaiting' = allConfirmed
        ? 'confirmed'
        : allDeclined
        ? 'declined'
        : 'awaiting';

      const seatedMembers = members.filter(m => m.tableId);
      const primaryTableId = seatedMembers.length > 0 ? seatedMembers[0].tableId : null;
      const tableObj = primaryTableId ? (state.tables || []).find(t => t.id === primaryTableId) : null;
      let tableLabel = tableObj ? tableObj.name.toUpperCase() : primaryTableId ? primaryTableId.toUpperCase().replace('_', ' ') : 'Unassigned';

      // Always showcase Family Name prominently per household row
      let familyName = householdKey;
      if (!familyName || familyName.trim() === '' || familyName.toLowerCase() === 'individual' || familyName === members[0].name) {
        const parts = members[0].name.trim().split(' ');
        const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
        familyName = lastName ? `The ${lastName} Family` : `${members[0].name} Household`;
      }
      const memberNames = members.map(m => m.name).join(', ');

      // Check if this family has preset demo stats or single-member UI fallback:
      const preset = FAMILY_DEMO_PRESETS[householdKey.toLowerCase()] ||
        FAMILY_DEMO_PRESETS[familyName.toLowerCase()];

      if (preset) {
        adultsCount = preset.adults;
        kidsCount = preset.kids;
        partyTotal = adultsCount + kidsCount;
        dietarySummary = preset.dietary;
        if (!primaryTableId || tableLabel === 'Unassigned') {
          tableLabel = preset.table;
        }
      } else if (adultsCount <= 1 && kidsCount === 0) {
        const hash = householdKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const pattern = DEMO_PATTERNS[hash % DEMO_PATTERNS.length];
        adultsCount = pattern.adults;
        kidsCount = pattern.kids;
        partyTotal = adultsCount + kidsCount;
        if (dietarySummary === 'None') {
          dietarySummary = pattern.dietary;
        }
        if (!primaryTableId || tableLabel === 'Unassigned') {
          tableLabel = pattern.table;
        }
      }

      groups.push({
        id: `fam_${householdKey.replace(/[^a-zA-Z0-9]/g, '_')}`,
        householdKey,
        familyName,
        members,
        memberNames,
        category: primary.category || 'Uncategorised',
        phone: primary.phone || '0412 884 991',
        email: primary.email || 'guest@example.com',
        rsvpStatus,
        adultsCount,
        kidsCount,
        partyTotal,
        dietarySummary,
        tableId: primaryTableId,
        tableLabel,
      });
    });

    return groups;
  }, [weddingGuests, state.tables, familyPrimaryContacts]);

  const filteredFamilies = familyGroups.filter(f => {
    const q = guestSearch.toLowerCase();
    const matchSearch =
      !guestSearch ||
      f.familyName.toLowerCase().includes(q) ||
      f.householdKey.toLowerCase().includes(q) ||
      f.memberNames.toLowerCase().includes(q) ||
      f.dietarySummary.toLowerCase().includes(q) ||
      (f.category || '').toLowerCase().includes(q);
    const matchFilter = guestFilter === 'all' || f.rsvpStatus === guestFilter;
    const matchCat =
      guestCategoryFilter === 'all'
        ? true
        : guestCategoryFilter === 'needs_category'
        ? (!f.category || f.category === 'Uncategorised')
        : f.category === guestCategoryFilter;
    return matchSearch && matchFilter && matchCat;
  });

  const uncategorisedCount = weddingGuests.filter(g => !g.category || g.category === 'Uncategorised').length;
  const bridalPartyCount = weddingGuests.filter(g => g.category === 'Bridal Party').length;
  const brideFamCount = weddingGuests.filter(g => g.category === "Bride's Family").length;
  const groomFamCount = weddingGuests.filter(g => g.category === "Groom's Family").length;
  const friendsCount = weddingGuests.filter(g => g.category === 'Mutual Friends' || g.category === 'Friends').length;
  const colleaguesCount = weddingGuests.filter(g => g.category === 'Work Colleagues' || g.category === 'Colleagues').length;

  const confirmedCount = confirmedGuests.length;
  const awaitingCount = awaitingGuests.length;
  const totalAdultsCount = weddingGuests.reduce((sum, g) => sum + (g.adults !== undefined ? g.adults : (g.partySize || 1)), 0);
  const totalKidsCount = weddingGuests.reduce((sum, g) => sum + (g.kids !== undefined ? g.kids : 0), 0);
  const totalPartyCount = totalAdultsCount + totalKidsCount;
  const totalGifts = state.gifts.reduce((sum, g) => sum + Number(g.amount || 0), 0);
  const thankYousDue = state.gifts.filter(g => g.thankYouStatus !== 'Completed' && g.thankYouStatus !== 'Sent').length;

  // -------------------------------------------------------------
  // Feature 1: Private MC Run Sheet State & Handlers
  // -------------------------------------------------------------
  const [runSheetFilter, setRunSheetFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [selectedRunSheetEventId, setSelectedRunSheetEventId] = useState<string>('all');
  const [cueEventId, setCueEventId] = useState<string>('');
  const [runSheetSearch, setRunSheetSearch] = useState('');
  const [showAddCueModal, setShowAddCueModal] = useState(false);
  const [cueTime, setCueTime] = useState('17:00');
  const [cueActivity, setCueActivity] = useState('');
  const [cueNotes, setCueNotes] = useState('');
  const [cuePrivateNotes, setCuePrivateNotes] = useState('');

  const runSheet = wedding.privateRunSheet || [];

  const updateWeddingRunSheet = (newCues: PrivateRunSheetItem[]) => {
    const updatedWeddings = (state.weddings || []).map(w => {
      if (w.id === wedding.id) {
        return { ...w, privateRunSheet: newCues };
      }
      return w;
    });
    setState({ ...state, weddings: updatedWeddings });
  };

  const handleToggleCueDone = (cueId: string) => {
    const updated = runSheet.map(c => (c.id === cueId ? { ...c, done: !c.done } : c));
    updateWeddingRunSheet(updated);
  };

  const handleUpdateCueField = (cueId: string, field: keyof PrivateRunSheetItem, value: any) => {
    const updated = runSheet.map(c => (c.id === cueId ? { ...c, [field]: value } : c));
    updateWeddingRunSheet(updated);
  };

  const handleMoveCue = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= runSheet.length) return;
    const newItems = [...runSheet];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateWeddingRunSheet(newItems);
  };

  const handleDeleteCue = (cueId: string) => {
    const updated = runSheet.filter(c => c.id !== cueId);
    updateWeddingRunSheet(updated);
    showToast('Cue removed from run sheet', 'info');
  };

  // MC Response to Planner Change Request
  const handleAcceptChangeRequest = (cueId: string) => {
    const cue = runSheet.find(c => c.id === cueId);
    if (!cue || !cue.changeRequest) return;
    const updated = runSheet.map(c => {
      if (c.id === cueId && c.changeRequest) {
        return {
          ...c,
          time: c.changeRequest.proposedTime || c.time,
          activity: c.changeRequest.proposedActivity || c.activity,
          changeRequest: {
            ...c.changeRequest,
            status: 'accepted' as const,
            respondedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        };
      }
      return c;
    });
    updateWeddingRunSheet(updated);
    logAudit(state, setState, 'Change Request Accepted', 'Robert Galati', 'mc', `Accepted planner change request for "${cue.activity}": time set to ${cue.changeRequest.proposedTime}`, 'Run Sheet');
    showToast(`Accepted change request: updated to ${cue.changeRequest.proposedTime}`, 'success');
  };

  const handleDeclineChangeRequest = (cueId: string) => {
    const cue = runSheet.find(c => c.id === cueId);
    if (!cue || !cue.changeRequest) return;
    const updated = runSheet.map(c => {
      if (c.id === cueId && c.changeRequest) {
        return {
          ...c,
          changeRequest: {
            ...c.changeRequest,
            status: 'declined' as const,
            respondedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        };
      }
      return c;
    });
    updateWeddingRunSheet(updated);
    logAudit(state, setState, 'Change Request Declined', 'Robert Galati', 'mc', `Declined planner change request for "${cue.activity}"`, 'Run Sheet');
    showToast('Declined change request: original schedule retained', 'info');
  };

  // MC Standard Template & Cheers AI & Vendor Share states
  const [showMcTemplateModal, setShowMcTemplateModal] = useState(false);
  const [selectedMcTemplateId, setSelectedMcTemplateId] = useState('classic-vineyard');
  const [mcTemplateImportMode, setMcTemplateImportMode] = useState<'replace' | 'append'>('append');
  const [mcTemplateRows, setMcTemplateRows] = useState<Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'> & { selected: boolean }>>([]);

  const handleOpenMcTemplateModal = () => {
    const defTpl = STANDARD_RUN_SHEET_TEMPLATES[0];
    setSelectedMcTemplateId(defTpl.id);
    setMcTemplateRows(defTpl.items.map(i => ({ ...i, selected: true })));
    setShowMcTemplateModal(true);
  };

  const handleApplyMcTemplate = () => {
    const selected = mcTemplateRows.filter(r => r.selected);
    if (selected.length === 0) {
      showToast('Select at least one activity', 'error');
      return;
    }
    const newItems: PrivateRunSheetItem[] = selected.map((s, idx) => ({
      id: 'pmc_tpl_' + Date.now() + '_' + idx,
      time: s.time,
      activity: s.activity,
      notes: s.notes || '',
      privateNotes: s.privateNotes || '',
      done: false,
      order: runSheet.length + idx + 1,
    }));
    const nextCues = mcTemplateImportMode === 'replace' ? newItems : [...runSheet, ...newItems];
    updateWeddingRunSheet(nextCues);
    showToast(`Imported ${newItems.length} cues from template`, 'success');
    setShowMcTemplateModal(false);
  };

  const [showMcAiModal, setShowMcAiModal] = useState(false);
  const [mcAiModalTab, setMcAiModalTab] = useState<'draft' | 'import'>('draft');
  const [mcAiCeremonyTime, setMcAiCeremonyTime] = useState('15:30');
  const [mcAiReceptionTime, setMcAiReceptionTime] = useState('18:00');
  const [mcAiRawText, setMcAiRawText] = useState('');
  const [mcAiParsedRows, setMcAiParsedRows] = useState<Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'> & { selected: boolean }>>([]);

  const handleOpenMcAiModal = () => {
    setShowMcAiModal(true);
    if (mcAiParsedRows.length === 0) {
      const draft = generateAiRunSheetDraft({
        ceremonyTime: mcAiCeremonyTime,
        receptionTime: mcAiReceptionTime,
        sunsetTime: '17:45',
        style: 'seated',
        speechesCount: 3,
      });
      setMcAiParsedRows(draft.map(d => ({ ...d, selected: true })));
    }
  };

  const handleApplyMcAiChatbotItems = (
    items: Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>>,
    mode: 'replace' | 'append'
  ) => {
    const newItems: PrivateRunSheetItem[] = items.map((item, idx) => ({
      id: 'pmc_ai_' + Date.now() + '_' + idx,
      time: item.time,
      activity: item.activity,
      notes: item.notes || '',
      privateNotes: item.privateNotes || '',
      done: false,
      order: mode === 'replace' ? idx + 1 : runSheet.length + idx + 1,
      section: item.section || 'afternoon',
    }));

    const nextCues = mode === 'replace' ? newItems : [...runSheet, ...newItems];
    updateWeddingRunSheet(nextCues);
    logAudit(
      state,
      setState,
      'Cheers AI MC Run Sheet Saved',
      'Robert Galati (MC)',
      'mc',
      `Saved ${newItems.length} activities via Cheers AI Chatbot (${mode} mode)`,
      'Run Sheet'
    );
    showToast(`Saved ${newItems.length} activities to MC Run Sheet`, 'success');
  };

  const handleApplyMcAiRows = () => {
    const selected = mcAiParsedRows.filter(r => r.selected);
    if (selected.length === 0) {
      showToast('Select at least one activity', 'error');
      return;
    }
    const newItems: PrivateRunSheetItem[] = selected.map((s, idx) => ({
      id: 'pmc_ai_' + Date.now() + '_' + idx,
      time: s.time,
      activity: s.activity,
      notes: s.notes || '',
      privateNotes: s.privateNotes || '',
      done: false,
      order: runSheet.length + idx + 1,
    }));
    updateWeddingRunSheet([...runSheet, ...newItems]);
    showToast(`Saved ${newItems.length} AI activities to Run Sheet`, 'success');
    setShowMcAiModal(false);
  };

  const [showMcShareModal, setShowMcShareModal] = useState(false);
  const [mcShareCopied, setMcShareCopied] = useState(false);

  const handleAddCue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cueTime || !cueActivity) return;
    const targetEvtId = cueEventId || (selectedRunSheetEventId !== 'all' ? selectedRunSheetEventId : undefined);
    const targetEvt = (wedding.events || []).find((e) => e.id === targetEvtId);

    const newItem: PrivateRunSheetItem = {
      id: 'pmc_' + Date.now(),
      eventId: targetEvtId,
      eventName: targetEvt?.name,
      time: cueTime,
      activity: cueActivity,
      notes: cueNotes,
      privateNotes: cuePrivateNotes,
      done: false,
      order: runSheet.length + 1,
    };
    updateWeddingRunSheet([...runSheet, newItem]);
    logAudit(state, setState, 'MC Cue Added', 'Robert Galati', 'mc', `Added schedule entry: ${newItem.activity} at ${newItem.time} for ${wedding.couple}`, 'Run Sheet');
    setCueTime('17:00');
    setCueActivity('');
    setCueNotes('');
    setCuePrivateNotes('');
    setShowAddCueModal(false);
    showToast(`Added "${newItem.activity}"${targetEvt ? ` to ${targetEvt.name}` : ''}`, 'success');
  };

  const filteredCues = runSheet.filter((cue) => {
    if (selectedRunSheetEventId !== 'all') {
      if (cue.eventId) {
        if (cue.eventId !== selectedRunSheetEventId) return false;
      } else {
        if (selectedRunSheetEventId !== 'evt_ceremony' && selectedRunSheetEventId !== 'evt_reception') return false;
      }
    }
    const matchesSearch = cue.activity.toLowerCase().includes(runSheetSearch.toLowerCase()) ||
      (cue.notes || '').toLowerCase().includes(runSheetSearch.toLowerCase()) ||
      (cue.privateNotes || '').toLowerCase().includes(runSheetSearch.toLowerCase()) ||
      cue.time.includes(runSheetSearch);
    const matchesStatus = runSheetFilter === 'all' || (runSheetFilter === 'done' ? cue.done : !cue.done);
    return matchesSearch && matchesStatus;
  });

  // -------------------------------------------------------------
  // Feature 2: Guest & Catering Summary State & Calculations
  // -------------------------------------------------------------
  const [cateringDietFilter, setCateringDietFilter] = useState<'all' | 'special' | 'vegetarian' | 'gluten' | 'vegan' | 'nut'>('all');
  const [cateringSearch, setCateringSearch] = useState('');

  const weddingTables = (state.tables || []).filter(t => t.weddingId === wedding.id || (!t.weddingId && wedding.id === 'w1'));

  const vegCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('veg') && !(g.dietary || '').toLowerCase().includes('vegan')).length;
  const veganCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('vegan')).length;
  const gfCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('gluten')).length;
  const nutCount = confirmedGuests.filter(g => (g.dietary || '').toLowerCase().includes('nut')).length;
  const otherDietCount = confirmedGuests.filter(g => {
    const d = (g.dietary || '').toLowerCase().trim();
    return d !== '' && d !== 'none' && d !== 'no' && !d.includes('veg') && !d.includes('gluten') && !d.includes('nut');
  }).length;

  const filteredCateringGuests = confirmedGuests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(cateringSearch.toLowerCase()) ||
      (g.dietary || '').toLowerCase().includes(cateringSearch.toLowerCase()) ||
      (g.household || '').toLowerCase().includes(cateringSearch.toLowerCase());

    const d = (g.dietary || '').toLowerCase();
    let matchesDiet = true;
    if (cateringDietFilter === 'special') matchesDiet = d !== '' && d !== 'none' && d !== 'no';
    else if (cateringDietFilter === 'vegetarian') matchesDiet = d.includes('veg') && !d.includes('vegan');
    else if (cateringDietFilter === 'vegan') matchesDiet = d.includes('vegan');
    else if (cateringDietFilter === 'gluten') matchesDiet = d.includes('gluten');
    else if (cateringDietFilter === 'nut') matchesDiet = d.includes('nut');

    return matchesSearch && matchesDiet;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-[#f8f6f2] font-sans select-none">
      {/* Navigation Sidebar (Couples Suite + MC Pro Live Console) */}
      <aside className="w-full md:w-[240px] bg-[#15110e] text-[#d9c9b8] flex flex-col justify-between border-r border-[#29211a] flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 pb-3 flex items-center gap-2.5">
            <span className="tt-mark inline-grid place-items-center w-6 h-6 border border-[#bd9661] text-[#bd9661] font-serif font-bold text-sm rounded-[3px]">
              T
            </span>
            <span className="font-serif text-[18px] text-white font-semibold tracking-wide">
              Tap <span className="gold-amp">&amp;</span> Toast
            </span>
          </div>

          {/* MC & Planner Mode Navigation Header */}
          {(isMcView || isPlannerView) && (
            <div className="px-3 pb-3 border-b border-[#231b14]">
              <button
                type="button"
                onClick={onBackToWeddings}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#2a2119] hover:bg-[#3d3024] text-[#dfc194] border border-[#bd9661]/50 rounded-xl text-xs font-bold transition-all cursor-pointer mb-2 shadow-xs"
              >
                <span>&larr;</span>
                <span>Back to All Weddings</span>
              </button>
              <div className="text-[9.5px] uppercase tracking-[1.5px] text-[#bd9661] font-bold px-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate">{isPlannerView || session?.role === 'planner' ? 'PLANNER SUITE' : 'MC SUITE'}: {wedding.couple}</span>
              </div>
            </div>
          )}

          {/* Navigation Links (Responsive mobile horizontal strip + desktop vertical sidebar) */}
          <nav className="p-2 flex md:flex-col flex-row overflow-x-auto gap-1 no-scrollbar shrink-0">
            {(isMcOrPlanner ? [
              {
                id: 'mc_runsheet' as const,
                label: isPlannerView ? 'Day Sheet' : 'Run Sheet',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M9 12h6M9 16h4" />
                  </svg>
                ),
              },
              {
                id: 'seating' as const,
                label: 'Seating Arrangements',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3.5" />
                    <circle cx="12" cy="3" r="2" />
                    <circle cx="12" cy="21" r="2" />
                    <circle cx="3" cy="12" r="2" />
                    <circle cx="21" cy="12" r="2" />
                    <path d="M12 5v3.5M12 15.5v3.5M5 12h3.5M15.5 12h3.5" />
                  </svg>
                ),
              },
              ...(isPlannerView || session?.role === 'planner' ? [
                {
                  id: 'vendors' as const,
                  label: 'Vendor Concierge',
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 21h18"/>
                      <path d="M5 21V7l7-4 7 4v14"/>
                      <path d="M9 10h6"/>
                      <path d="M9 14h6"/>
                    </svg>
                  ),
                },
              ] : []),
              {
                id: 'venue' as const,
                label: 'Venue & Travel',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
            ] : [
              {
                id: 'overview',
                label: 'Overview',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                ),
              },
              {
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
              },
              {
                id: 'guests',
                label: 'Guest List',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                id: 'seating',
                label: 'Seating',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3.5" />
                    <circle cx="12" cy="3" r="2" />
                    <circle cx="12" cy="21" r="2" />
                    <circle cx="3" cy="12" r="2" />
                    <circle cx="21" cy="12" r="2" />
                    <path d="M12 5v3.5M12 15.5v3.5M5 12h3.5M15.5 12h3.5" />
                  </svg>
                ),
              },
              {
                id: 'mc_runsheet' as const,
                label: 'Wedding Day Sheet',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
              {
                id: 'vendor_documents' as const,
                label: 'Vendor Documents',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                ),
              },
              {
                id: 'pages',
                label: 'Content & Stories',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="4" y1="9" x2="20" y2="9" />
                  </svg>
                ),
              },
              {
                id: 'invitations',
                label: 'Invitations',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22 6 12 13 2 6" />
                  </svg>
                ),
              },
              ...(!isMcView ? [
                {
                  id: 'gifts' as const,
                  label: 'Gift & Thank-You',
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  ),
                },
              ] : []),
              {
                id: 'feed',
                label: 'Celebration Feed',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                id: 'vault',
                label: 'Wedding Vault',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
              },
              {
                id: 'anniversary',
                label: '1st Anniversary',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
              },
              {
                id: 'venue',
                label: 'Venue & Travel',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
              },
            ]).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`shrink-0 md:w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#291f17] text-[#dfc194] md:border-l-[3px] md:border-l-[#bd9661] border-b-2 md:border-b-0 border-b-[#bd9661] shadow-xs'
                      : 'text-[#d9c9b8] hover:bg-[#1e1713] hover:text-white md:border-l-[3px] md:border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-4 h-4 flex items-center justify-center ${isActive ? 'text-[#bd9661]' : 'text-[#8b7b6b]'}`}>
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </div>

                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#231b14] text-xs">
          {isMcOrPlanner ? (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#bd9661] font-bold">
                {session?.role === 'planner' ? 'Wedding Planner' : 'MC Host Console'}
              </div>
              <div className="font-semibold text-white">
                {session?.name || (session?.role === 'planner' ? 'Wedding Planner' : 'Robert Galati')}
              </div>
              <div className="text-[11px] text-[#8c7b6c] truncate">
                Managing: {wedding.couple} &bull; Run Sheet &amp; Seating
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#8b7b6b]">Signed in as</div>
                <div className="font-serif font-bold text-white text-sm truncate max-w-[120px]">{wedding.couple}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  if (onSelectView) onSelectView('login');
                  showToast('Signed out of couple dashboard', 'info');
                }}
                className="text-[11px] text-[#bd9661] hover:underline cursor-pointer font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full min-w-0">
        <div className="max-w-[1300px] w-full mx-auto space-y-6">
        {/* MC Pro Live Header Banner */}
        {isMcView && (
          <div className="bg-[#1c140e] border border-[#3d2e20] rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-[#bd9661] bg-[#2d1f14] border border-[#bd9661]/40 px-2.5 py-1 rounded-xl text-[10px] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                MC Pro Hosting Mode
              </span>
              <div>
                <span className="text-white font-serif font-bold text-base block sm:inline">
                  {wedding.couple}
                </span>
                <span className="text-[#8c7b6c] hidden sm:inline"> &bull; </span>
                <span className="text-[#d9c9b8] text-xs">
                  {wedding.dateDisplay || wedding.date} ({wedding.venue})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeTab !== 'mc_runsheet' && activeTab !== 'mc_catering') {
                    setActiveTab('mc_runsheet');
                  }
                  setTimeout(() => window.print(), 100);
                }}
                className="bg-[#2a2119] hover:bg-[#382b21] text-[#dfc194] border border-[#bd9661]/40 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>🖨️</span> Print
              </button>
            </div>
          </div>
        )}
        
        {/* ================================================================ */}
        {/* TAB 1: OVERVIEW (Screenshot 5)                                   */}
        {/* ================================================================ */}
        {activeTab === 'overview' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  YOUR WEDDING &bull; COUPLE DASHBOARD
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
                  {wedding.couple}
                </h1>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isWeddingDayMode;
                    setIsWeddingDayMode(nextMode);
                    showToast(
                      nextMode ? '🎉 Wedding Day Celebration Mode Activated!' : 'Switched to Planning Countdown Mode',
                      nextMode ? 'success' : 'info'
                    );
                  }}
                  className={`px-3.5 py-2 rounded-full font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-xs ${
                    isWeddingDayMode
                      ? 'bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] border border-[#bd9661]'
                      : 'bg-[#15110e] hover:bg-[#251e19] text-[#dfc194] border border-[#bd9661]/40'
                  }`}
                >
                  <span>{isWeddingDayMode ? '🎉 Wedding Day Active' : '✨ Wedding Day Mode'}</span>
                </button>
              </div>
            </div>

            {/* Prominent Wedding Countdown Hero Card */}
            {!isWeddingDayMode && (
              <WeddingCountdownCard
                targetDate={wedding.date || '2026-11-14T14:00:00'}
                coupleName={wedding.couple}
                venueName={wedding.venue}
                dateDisplay={wedding.dateDisplay || '14 November 2026'}
                themeColor={weddingSettings.themeColor as any}
                variant="luxury"
              />
            )}

            {/* Wedding Day Celebration Experience (Active on Wedding Day) */}
            {isWeddingDayMode && (
              <WeddingDayCelebrationSection
                onToggleWeddingDayMode={() => setIsWeddingDayMode(false)}
                isWeddingDayMode={isWeddingDayMode}
              />
            )}

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Total RSVPs Confirmed</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">45 of 118</div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">42.4% confirmation rate</div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Wishing Well Gifts</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">$4,850</div>
                <div className="text-xs text-[#bd9661] font-semibold mt-1">12 guest gifts received</div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Seated Guests</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">29 / 118</div>
                <div className="text-xs text-[#8b7b6b] font-semibold mt-1">6 active ballroom tables</div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-xl p-5 shadow-sm">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Thank-Yous Due</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-2">8 Due</div>
                <div className="text-xs text-[#916c3d] font-semibold mt-1">Dispatched automatically</div>
              </div>
            </div>

            {/* RSVP Progress Bar Card */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-[#15110e]">RSVP Response Status</span>
                <span className="text-xs text-[#8b7b6b]">{confirmedCount} Confirmed &bull; {awaitingCount} Awaiting &bull; 8 Declined</span>
              </div>
              <div className="w-full h-3 bg-[#ede5d8] rounded-full overflow-hidden flex">
                <div style={{ width: `${(confirmedCount / 118) * 100}%` }} className="bg-[#3c6a42]" title="Confirmed" />
                <div style={{ width: `${(awaitingCount / 118) * 100}%` }} className="bg-[#bd9661]" title="Awaiting" />
                <div style={{ width: '6.8%' }} className="bg-[#a8382c]" title="Declined" />
              </div>
            </div>

            {/* Checklist & Activity Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Checklist */}
              {/* Planning Tasks (Urgent, Pending, Completed) */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">Planning Tasks &amp; Checklist</h3>
                    <div className="text-[11px] text-[#8b7b6b]">Track urgent deadlines, pending tasks, and guest requests</div>
                  </div>
                  {/* Priority Filter Pills */}
                  <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-xl border border-[#e8ded0] text-xs">
                    {(
                      [
                        { id: 'all', label: 'All', count: wedding.tasks.length, color: 'text-[#dfc194]' },
                        { id: 'urgent', label: 'Urgent', count: wedding.tasks.filter(t => !t.completed && t.priority === 'urgent').length, color: 'text-rose-600' },
                        { id: 'pending', label: 'Pending', count: wedding.tasks.filter(t => !t.completed && t.priority !== 'urgent').length, color: 'text-amber-700' },
                        { id: 'completed', label: 'Done', count: wedding.tasks.filter(t => t.completed).length, color: 'text-[#8b7b6b]' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTaskFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          taskFilter === f.id
                            ? 'bg-[#15110e] text-[#dfc194] shadow-2xs'
                            : 'text-[#8b7b6b] hover:text-[#15110e]'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`ml-1 text-[10px] ${taskFilter === f.id ? 'text-[#dfc194]' : f.color}`}>({f.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {wedding.tasks
                    .filter((t) => {
                      if (taskFilter === 'urgent') return !t.completed && t.priority === 'urgent';
                      if (taskFilter === 'pending') return !t.completed && t.priority !== 'urgent';
                      if (taskFilter === 'completed') return t.completed;
                      return true;
                    })
                    .map((t) => {
                      const isUrgent = !t.completed && t.priority === 'urgent';
                      return (
                        <div
                          key={t.id}
                          className={`flex items-center gap-3 text-xs p-3 rounded-xl transition-all duration-200 border ${
                            t.completed
                              ? 'bg-[#faf8f5]/80 text-[#8b7b6b] border-[#ebdcc9]'
                              : isUrgent
                              ? 'bg-rose-50/60 text-[#15110e] border-rose-200 hover:border-rose-300 shadow-2xs'
                              : 'bg-white hover:bg-[#faf8f5] text-[#15110e] border-[#ebd8c3]/80 shadow-2xs'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => handleToggleTask(t.id)}
                            className="accent-[#bd9661] w-4 h-4 cursor-pointer shrink-0"
                            title={t.completed ? 'Mark task as pending' : 'Mark task as completed'}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                <span className={`leading-snug transition-all ${t.completed ? 'line-through text-[#8b7b6b]' : 'font-semibold text-[#15110e]'}`}>
                                  {t.text}
                                </span>
                                {/* Priority / Status Badge */}
                                {t.completed ? (
                                  <span className="text-[9.5px] font-semibold text-[#6e5d4f] bg-[#f0ede6] border border-[#dcd2c4] px-2 py-0.5 rounded-full shrink-0">
                                    Done ✓
                                  </span>
                                ) : isUrgent ? (
                                  <span className="text-[9.5px] font-bold text-rose-700 bg-rose-100/90 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                    Urgent
                                  </span>
                                ) : (
                                  <span className="text-[9.5px] font-bold text-amber-700 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(t.id)}
                                className="text-[11px] font-medium text-[#9c8979] hover:text-rose-600 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="Delete task"
                              >
                                Delete
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-[#8b7b6b]">
                              <span>🗓️ Due: {t.due || 'This week'}</span>
                              {!t.completed && (
                                <>
                                  <span>&bull;</span>
                                  <button
                                    type="button"
                                    onClick={() => handleSetTaskPriority(t.id, t.priority === 'urgent' ? 'pending' : 'urgent')}
                                    className="font-semibold text-[#bd9661] hover:text-[#997441] hover:underline cursor-pointer"
                                  >
                                    Mark as {t.priority === 'urgent' ? 'Pending' : 'Urgent'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Add Task Form with Segemented Priority Selector */}
                <form onSubmit={handleAddTask} className="pt-3 border-t border-[#f0ede4] space-y-2.5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      placeholder="Add a new planning task or guest request..."
                      className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] focus:bg-white shadow-2xs transition-all"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-[#faf8f5] p-1 rounded-xl border border-[#e8ded0] text-xs">
                        <button
                          type="button"
                          onClick={() => setNewTaskPriority('pending')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            newTaskPriority === 'pending'
                              ? 'bg-[#15110e] text-[#dfc194] shadow-2xs'
                              : 'text-[#8b7b6b] hover:text-[#15110e]'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTaskPriority('urgent')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            newTaskPriority === 'urgent'
                              ? 'bg-rose-700 text-white shadow-2xs'
                              : 'text-[#8b7b6b] hover:text-rose-700'
                          }`}
                        >
                          Urgent
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-xs transition-colors shrink-0"
                      >
                        + Add Task
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#15110e]">Recent Activity</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { text: 'Priya Sharma updated dietary requirements to Vegetarian', time: '10 mins ago' },
                    { text: 'The Whitfield family sent $250 AUD to Wishing Well', time: '38 mins ago' },
                    { text: 'Robert Galati synced 14:00 ceremony cue sheet', time: '1 hour ago' },
                    { text: 'Michael Chen confirmed RSVP attendance', time: '2 hours ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-[#f5f2eb]">
                      <span className="text-[#bd9661] font-bold">&bull;</span>
                      <div>
                        <div className="text-[#15110e]">{act.text}</div>
                        <div className="text-[10px] text-[#8b7b6b] mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 2: GUEST LIST (Screenshot 23: 172854.png)                     */}
        {/* ================================================================ */}
        {/* ================================================================ */}
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
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('open_joey_chatbot', {
                        detail: { prompt: 'Show me our celebration events schedule and confirmed guest breakdown' }
                      })
                    );
                  }}
                  className="bg-white border border-[#d5c7b5] hover:border-[#bd9661] hover:bg-[#faf6f0] text-[#15110e] font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  title="Ask Joey AI Assistant about celebration events & schedule"
                >
                  <img src="./chatbot-avatar.png" alt="Joey AI" style={{ width: '20px', height: '20px', borderRadius: '9999px', objectFit: 'cover' }} />
                  <span>Ask Joey AI</span>
                </button>
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

            {/* Event Table View matching User Request 3 */}
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
                          {/* Event Name: Just event name (clean, no category box, dress code box, or text below) */}
                          <td className="py-4 px-4">
                            <span className="font-serif font-bold text-sm text-[#15110e]">
                              {evt.name}
                            </span>
                          </td>

                          {/* Event Date */}
                          <td className="py-4 px-4 text-xs text-[#15110e] font-medium whitespace-nowrap">
                            🗓️ {evt.date || 'Saturday, 14 Nov 2026'}
                          </td>

                          {/* Time */}
                          <td className="py-4 px-4 font-mono text-xs font-bold text-[#bd9661] whitespace-nowrap">
                            {evt.time}{evt.endTime ? ` - ${evt.endTime}` : ''}
                          </td>

                          {/* Loc */}
                          <td className="py-4 px-4 text-xs text-[#15110e]">
                            <div className="font-medium truncate max-w-[200px]">{evt.venue || 'Fernwood Estate'}</div>
                            {evt.address && (
                              <div className="text-[10.5px] text-[#8b7b6b] truncate max-w-[200px]">{evt.address}</div>
                            )}
                          </td>

                          {/* Confirmed Guests: shown as confirmed / total with no extra invited text or green box */}
                          <td className="py-4 px-4 whitespace-nowrap font-mono text-xs font-semibold text-[#15110e]">
                            {confirmedGuests.length} / {weddingGuests.length}
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
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              statusLabel === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInvited
                                ? 'bg-[#faf4ec] text-[#bd9661] border border-[#ebd3a8]'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
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

        {activeTab === 'guests' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  ATTENDEE MANAGEMENT
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Guest List
                </h1>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => showToast('Guest list exported to CSV', 'success')}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>📊</span> Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportStep('upload');
                    setImportRows([]);
                    setImportFileName('');
                    setShowImportModal(true);
                  }}
                  className="bg-[#faf6ee] hover:bg-[#f5ede2] border border-[#bd9661] text-[#8c6d3b] hover:text-[#15110e] font-bold px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <svg className="w-3.5 h-3.5 text-[#bd9661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Guests
                </button>
                <button
                  type="button"
                  onClick={() => { setNewGuestEventIds((wedding.events || []).map(e => e.id)); setShowAddGuestModal(true); }}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-xs"
                >
                  + Add Guest
                </button>
                <button
                  type="button"
                  onClick={() => showToast('RSVP reminders dispatched to 22 awaiting guests', 'success')}
                  className="bg-[#15110e] hover:bg-[#231c17] text-white font-bold px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>✉</span> Send Reminder (22)
                </button>
              </div>
            </div>

            {/* Demographic & Attendance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">TOTAL GUESTS</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">{totalPartyCount}</div>
                <div className="text-[10px] text-[#8b7b6b]">Across {weddingGuests.length} parties</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b] ">ADULTS (18+)</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">{totalAdultsCount}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">{Math.round((totalAdultsCount / (totalPartyCount || 1)) * 100)}% of reception</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">KIDS (&lt;12)</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">{totalKidsCount}</div>
                <div className="text-[10px] text-sky-700 font-semibold">{totalKidsCount} children meals</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">CONFIRMED</div>
                <div className="font-serif text-2xl font-bold text-emerald-700 mt-0.5">{confirmedCount}</div>
                <div className="text-[10px] text-[#8b7b6b]">RSVPs accepted</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">AWAITING</div>
                <div className="font-serif text-2xl font-bold text-[#bd9661] mt-0.5">{awaitingCount}</div>
                <div className="text-[10px] text-[#8b7b6b]">Pending response</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-bold uppercase text-[#8b7b6b]">CATEGORISED</div>
                <div className="font-serif text-2xl font-bold text-[#15110e] mt-0.5">
                  {weddingGuests.length - uncategorisedCount} / {weddingGuests.length}
                </div>
                <div className="text-[10px] text-[#a8382c] font-semibold">{uncategorisedCount} need category</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex gap-3 flex-wrap items-center justify-between">
                <div className="flex gap-3 flex-wrap flex-1 items-center">
                  <input
                    type="text"
                    placeholder="Search guests by name, household, or dietary..."
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    className="flex-1 min-w-[220px] max-w-[320px] bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                  <select
                    value={guestFilter}
                    onChange={(e) => setGuestFilter(e.target.value as any)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none cursor-pointer"
                  >
                    <option value="all">All RSVP Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="awaiting">Awaiting</option>
                    <option value="declined">Declined</option>
                  </select>

                  <select
                    value={guestEventFilter}
                    onChange={(e) => setGuestEventFilter(e.target.value)}
                    className="bg-white border border-[#e8ded0] rounded-lg px-3 py-1.5 text-xs text-[#15110e] outline-none cursor-pointer font-medium"
                  >
                    <option value="all">All Events ({(wedding.events || []).length})</option>
                    {(wedding.events || []).map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle: Individuals vs Family / Household */}
                  <div className="inline-flex p-0.5 bg-[#faf7f2] border border-[#e8ded0] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setGuestViewMode('individual')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                        guestViewMode === 'individual'
                          ? 'bg-[#15110e] text-[#dfc194] shadow-xs font-bold'
                          : 'text-[#6b5a4a] hover:text-[#15110e]'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Individual Guests ({weddingGuests.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuestViewMode('family')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                        guestViewMode === 'family'
                          ? 'bg-[#15110e] text-[#dfc194] shadow-xs font-bold'
                          : 'text-[#6b5a4a] hover:text-[#15110e]'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>By Family / Household ({familyGroups.length})</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-[#8b7b6b]">
                  {guestViewMode === 'individual' ? (
                    <>Showing <strong className="text-[#15110e]">{filteredGuests.length}</strong> of {weddingGuests.length} guests</>
                  ) : (
                    <>Showing <strong className="text-[#15110e]">{filteredFamilies.length}</strong> of {familyGroups.length} families ({weddingGuests.length} guests)</>
                  )}
                </div>
              </div>

              {/* Category Filter: 2 Pills ("All" and "Needs Category") + Category Filter Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f2ece3] pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestCategoryFilter('all')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      guestCategoryFilter !== 'needs_category'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-2xs font-bold'
                        : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                    }`}
                  >
                    All ({guestViewMode === 'individual' ? weddingGuests.length : familyGroups.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setGuestCategoryFilter('needs_category')}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      guestCategoryFilter === 'needs_category'
                        ? 'bg-[#15110e] text-[#dfc194] shadow-2xs font-bold'
                        : uncategorisedCount > 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold hover:bg-amber-200'
                        : 'bg-[#faf7f2] text-[#6b5a4a] border border-[#e8ded0] hover:bg-[#ede5d8]'
                    }`}
                  >
                    Needs Category ({uncategorisedCount})
                  </button>
                </div>

                {/* Filter dropdown that shows each individual category - ONLY shown on 'All' tab */}
                {guestCategoryFilter !== 'needs_category' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">FILTER CATEGORY:</span>
                    <select
                      value={guestCategoryFilter}
                      onChange={(e) => setGuestCategoryFilter(e.target.value)}
                      className="bg-white border border-[#e8ded0] rounded-lg px-2.5 py-1 text-xs text-[#15110e] outline-none cursor-pointer focus:border-[#bd9661]"
                    >
                      <option value="all">All Categories</option>
                      {GUEST_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto scrollbar-thin pb-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    {guestViewMode === 'individual' ? (
                      <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                        <th className="py-2.5 px-3 min-w-[160px]">GUEST / HOUSEHOLD</th>
                        <th className="py-2.5 px-2 min-w-[125px]">CATEGORY</th>
                        <th className="py-2.5 px-2 min-w-[130px]">CONTACT</th>
                        <th className="py-2.5 px-2 text-center min-w-[75px]">STATUS</th>
                        <th className="py-2.5 px-1.5 text-center w-14">ADULT</th>
                        <th className="py-2.5 px-1.5 text-center w-14">KID</th>
                        <th className="py-2.5 px-2 min-w-[140px]">DIETARY REQUIREMENTS</th>
                        <th className="py-2.5 px-2 text-center min-w-[85px]">TABLE</th>
                        <th className="py-2.5 px-3 text-right min-w-[75px]">ACTIONS</th>
                      </tr>
                    ) : (
                      <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                        <th className="py-2.5 px-3 min-w-[160px]">FAMILY NAME</th>
                        <th className="py-2.5 px-2 min-w-[125px]">CATEGORY</th>
                        <th className="py-2.5 px-2 min-w-[145px]">PRIMARY CONTACT</th>
                        <th className="py-2.5 px-2 text-center min-w-[75px]">STATUS</th>
                        <th className="py-2.5 px-1.5 text-center w-14">ADULTS</th>
                        <th className="py-2.5 px-1.5 text-center w-14">KIDS</th>
                        <th className="py-2.5 px-1.5 text-center w-22">TOTAL MEMBERS</th>
                        <th className="py-2.5 px-2 min-w-[140px]">DIETARY REQUIREMENTS</th>
                        <th className="py-2.5 px-2 text-center min-w-[85px]">TABLE</th>
                        <th className="py-2.5 px-3 text-right min-w-[75px]">ACTIONS</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-[#f0ede4]">
                    {guestViewMode === 'individual' ? (
                      filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-xs text-[#8b7b6b]">
                            No individual guests found matching the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g) => {
                          const isChild = (g.kids || 0) > 0 && (!g.adults || g.adults === 0);
                          const adultsVal = isChild ? 0 : 1;
                          const kidsVal = isChild ? 1 : 0;
                          return (
                            <tr key={g.id} className="hover:bg-[#faf8f5] transition-colors">
                              <td className="py-3 px-3">
                                <strong className="text-sm text-[#15110e] block">{g.name}</strong>
                                <span className="text-[11px] text-[#8b7b6b] block">{g.household}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(wedding.events || []).filter(e => (g.invitedEventIds || []).includes(e.id)).map(e => (
                                    <span
                                      key={e.id}
                                      className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f4ece1] text-[#7a5933] border border-[#e4d6c4]"
                                    >
                                      {e.category === 'ceremony' ? '💍 ' : e.category === 'reception' ? '🥂 ' : e.category === 'sangeet' ? '✨ ' : ''}{e.name}
                                    </span>
                                  ))}
                                </div>
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
                                      className="text-[11px] font-medium text-[#15110e] bg-[#fbf9f6] border border-[#d5c7b5] hover:border-[#bd9661] focus:border-[#bd9661] rounded px-2.5 py-1 outline-none cursor-pointer transition-colors shadow-2xs"
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
                                <div className="text-[#15110e] font-medium">{g.phone || '0412 884 991'}</div>
                                <div className="text-[11px] text-[#8b7b6b]">{g.email}</div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  g.rsvpStatus === 'confirmed' ? 'bg-[#e8eee4] text-[#3c6a42]' : g.rsvpStatus === 'declined' ? 'bg-[#fbeae8] text-[#a8382c]' : 'bg-[#faf6f0] text-[#916c3d]'
                                }`}>
                                  {g.rsvpStatus === 'confirmed' ? 'Confirmed' : g.rsvpStatus === 'declined' ? 'Declined' : 'Awaiting'}
                                </span>
                              </td>
                              {/* ADULTS: 1 if adult, 0 if child */}
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold text-[#15110e] bg-[#f5ede2] border border-[#e2d5c5]">
                                  {adultsVal}
                                </span>
                              </td>

                              {/* KIDS: 1 if child, 0 if adult */}
                              <td className="py-2.5 px-3 text-center">
                                <span className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold ${
                                  kidsVal > 0
                                    ? 'text-[#6b5847] bg-[#f5ede2] border border-[#e2d5c5]'
                                    : 'text-[#8b7b6b] bg-[#faf8f5] border border-[#e8ded0]'
                                }`}>
                                  {kidsVal}
                                </span>
                              </td>

                              {/* DIETARY REQUIREMENTS (PARTY TOTAL COLUMN REMOVED FOR INDIVIDUAL VIEW) */}
                              <td className="py-3 px-3">
                                <DietaryBadges dietary={g.dietary} size="sm" />
                              </td>
                              <td className="py-3 px-2 text-center font-semibold text-[#15110e]">
                                {g.tableId ? g.tableId.toUpperCase().replace('_', ' ') : 'Unassigned'}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGuest(g.id)}
                                  className="text-[#a8382c] hover:bg-[#fbeae8] px-2.5 py-1 rounded border border-[#f2a89f] text-[11px] font-semibold cursor-pointer transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )
                    ) : (
                      filteredFamilies.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-8 text-center text-xs text-[#8b7b6b]">
                            No families or households found matching the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredFamilies.map((fam) => {
                          const designatedGuestId = familyPrimaryContacts[fam.householdKey];
                          const activeContact = (designatedGuestId && fam.members.find(m => m.id === designatedGuestId)) || fam.members[0];
                          return (
                            <tr key={fam.id} className="hover:bg-[#faf8f5] transition-colors">
                              {/* 1. FAMILY NAME ONLY (NO SUBTITLE) */}
                              <td className="py-3 px-3">
                                <span className="text-sm font-bold text-[#15110e] block">{fam.familyName}</span>
                              </td>

                              {/* 2. CATEGORY */}
                              <td className="py-3 px-3">
                                {!fam.category || fam.category === 'Uncategorised' ? (
                                  <div className="flex items-center gap-1">
                                    <select
                                      value=""
                                      onChange={(e) => handleUpdateFamilyCategory(fam.householdKey, e.target.value)}
                                      className="text-[11px] font-bold bg-[#fff8e7] hover:bg-[#ffefc9] text-[#9b681e] border border-[#f1c583] rounded-md px-2 py-1 outline-none cursor-pointer transition-colors shadow-2xs"
                                    >
                                      <option value="" disabled>+ Categorise Family</option>
                                      {GUEST_CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <select
                                      value={fam.category}
                                      onChange={(e) => handleUpdateFamilyCategory(fam.householdKey, e.target.value)}
                                      className="text-[11px] font-medium text-[#15110e] bg-[#fbf9f6] border border-[#d5c7b5] hover:border-[#bd9661] focus:border-[#bd9661] rounded px-2.5 py-1 outline-none cursor-pointer transition-colors shadow-2xs"
                                    >
                                      {GUEST_CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                      ))}
                                      <option value="Uncategorised">Uncategorised</option>
                                    </select>
                                  </div>
                                )}
                              </td>

                              {/* 3. PRIMARY CONTACT: PERSON NAME & PHONE ONLY (NO EMAIL) */}
                              <td className="py-3 px-3">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    {fam.members.length > 1 ? (
                                      <select
                                        value={activeContact.id}
                                        onChange={(e) => handleSetFamilyContact(fam.householdKey, e.target.value)}
                                        className="text-xs font-semibold text-[#15110e] bg-[#fbf9f6] border border-[#d5c7b5] hover:border-[#bd9661] focus:border-[#bd9661] rounded px-1.5 py-0.5 outline-none cursor-pointer transition-colors shadow-2xs max-w-[130px] truncate"
                                        title="Choose primary contact person for this household"
                                      >
                                        {fam.members.map(m => (
                                          <option key={m.id} value={m.id}>
                                            {m.name}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className="text-xs font-semibold text-[#15110e] truncate max-w-[130px]">
                                        {activeContact.name}
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setEditingFamilyContact({
                                        householdKey: fam.householdKey,
                                        guestId: activeContact.id,
                                        name: activeContact.name,
                                        phone: activeContact.phone || fam.phone,
                                        email: activeContact.email || fam.email,
                                      })}
                                      className="text-[#8b7b6b] hover:text-[#bd9661] p-0.5 transition-colors cursor-pointer"
                                      title="Edit contact phone"
                                    >
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-[#524436] font-mono leading-tight">{activeContact.phone || fam.phone}</div>
                                </div>
                              </td>

                              {/* 4. STATUS */}
                              <td className="py-3 px-3 text-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  fam.rsvpStatus === 'confirmed' ? 'bg-[#e8eee4] text-[#3c6a42]' : fam.rsvpStatus === 'declined' ? 'bg-[#fbeae8] text-[#a8382c]' : 'bg-[#faf6f0] text-[#916c3d]'
                                }`}>
                                  {fam.rsvpStatus === 'confirmed' ? 'Confirmed' : fam.rsvpStatus === 'declined' ? 'Declined' : 'Awaiting'}
                                </span>
                              </td>

                              {/* 5. ADULTS COUNT */}
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold text-[#15110e] bg-[#f5ede2] border border-[#e2d5c5]">
                                  {fam.adultsCount}
                                </span>
                              </td>

                              {/* 6. KIDS COUNT */}
                              <td className="py-2.5 px-3 text-center">
                                <span className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-semibold ${
                                  fam.kidsCount > 0
                                    ? 'text-[#6b5847] bg-[#f5ede2] border border-[#e2d5c5]'
                                    : 'text-[#8b7b6b] bg-[#faf8f5] border border-[#e8ded0]'
                                }`}>
                                  {fam.kidsCount}
                                </span>
                              </td>

                              {/* 7. TOTAL MEMBERS */}
                              <td className="py-2.5 px-3 text-center font-bold text-xs text-[#15110e]">
                                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded text-xs font-bold text-[#15110e] bg-[#f5ede2] border border-[#e2d5c5]">
                                  {fam.partyTotal}
                                </span>
                              </td>

                              {/* 8. DIETARY REQUIREMENTS BASED ON INDIVIDUALS OF THAT FAMILY */}
                              <td className="py-3 px-3">
                                <DietaryBadges dietary={fam.dietarySummary} size="sm" />
                              </td>

                              {/* 9. TABLE ASSIGNED TO THAT FAMILY */}
                              <td className="py-3 px-2 text-center font-semibold text-[#15110e]">
                                {fam.tableLabel}
                              </td>

                              {/* 10. ACTION */}
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFamily(fam.householdKey)}
                                  className="text-[#a8382c] hover:bg-[#fbeae8] px-2.5 py-1 rounded border border-[#f2a89f] text-[11px] font-semibold cursor-pointer transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Add Guest */}
            {showAddGuestModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">Add Wedding Guest</h3>
                    <button type="button" onClick={() => setShowAddGuestModal(false)} className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer">&times;</button>
                  </div>
                  <form onSubmit={handleAddNewGuest} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Guest Full Name</label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Household / Family Group</label>
                      <input
                        type="text"
                        value={newGuestHousehold}
                        onChange={(e) => setNewGuestHousehold(e.target.value)}
                        placeholder="e.g. The Sharma Family"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Mobile Phone (for QaRd)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 border border-r-0 border-[#e8ded0] bg-[#faf8f5] text-xs font-bold font-mono text-[#8b7b6b] rounded-l-lg select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          value={newGuestPhone}
                          onChange={(e) => setNewGuestPhone(e.target.value)}
                          placeholder="0412 884 992"
                          className="w-full bg-white border border-[#e8ded0] rounded-r-lg rounded-l-none p-2 outline-none focus:border-[#bd9661] text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Guest Category / Group</label>
                      <select
                        value={newGuestCategory}
                        onChange={(e) => setNewGuestCategory(e.target.value)}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661] text-xs"
                      >
                        <option value="Uncategorised">Uncategorised (Assign later)</option>
                        {GUEST_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          Adults (18+)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={newGuestAdults}
                          onChange={(e) => setNewGuestAdults(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661] text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          Kids (&lt;12)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={newGuestKids}
                          onChange={(e) => setNewGuestKids(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Dietary Requirements</label>
                      <input
                        type="text"
                        value={newGuestDiet}
                        onChange={(e) => setNewGuestDiet(e.target.value)}
                        placeholder="e.g. Vegetarian, Gluten-free"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase">Invite to Events</label>
                        <span className="text-[10px] text-[#bd9661] font-semibold">{newGuestEventIds.length} events selected</span>
                      </div>
                      <div className="space-y-1 bg-[#faf8f5] p-2.5 rounded-xl border border-[#e8ded0] max-h-36 overflow-y-auto">
                        {(wedding.events || []).map((evt) => (
                          <label key={evt.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                            <input
                              type="checkbox"
                              checked={newGuestEventIds.includes(evt.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewGuestEventIds(prev => [...prev, evt.id]);
                                } else {
                                  setNewGuestEventIds(prev => prev.filter(id => id !== evt.id));
                                }
                              }}
                              className="accent-[#bd9661] rounded cursor-pointer"
                            />
                            <span className="text-xs text-[#15110e] font-medium">{evt.name}</span>
                            <span className="text-[10px] text-[#8b7b6b] ml-auto">({evt.time})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                      <button type="button" onClick={() => setShowAddGuestModal(false)} className="px-3 py-1.5 rounded-lg border text-[#8b7b6b] hover:bg-gray-50">Cancel</button>
                      <button type="submit" className="bg-[#bd9661] text-[#15110e] font-bold px-4 py-1.5 rounded-lg">Save Guest</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Guest List Import - Step 1: Upload & Download Template */}
            {showImportModal && importStep === 'upload' && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#e8decb] space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#e8decb]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#faf6ee] border border-[#e8decb] flex items-center justify-center text-[#bd9661] shadow-2xs font-serif font-bold text-sm">
                        T&T
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#15110e]">Import Guest List</h3>
                        <p className="text-xs text-[#8b7b6b]">Upload guest spreadsheet or start from our wedding template</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowImportModal(false)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Download Template Section */}
                  <div className="bg-[#faf8f5] border border-[#e8decb] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#15110e] flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#bd9661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Guest Template
                      </div>
                      <p className="text-[11px] text-[#8b7b6b]">
                        Includes pre-formatted columns for names, households, contact info, and celebrations.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate('xlsx')}
                        className="bg-white hover:bg-[#faf6ee] border border-[#d5c7b5] text-[#15110e] font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                      >
                        <span className="text-emerald-700 font-bold text-[11px]">XLSX</span> Template
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate('csv')}
                        className="bg-white hover:bg-[#faf6ee] border border-[#d5c7b5] text-[#15110e] font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                      >
                        <span className="text-[#bd9661] font-bold text-[11px]">CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* File Upload / Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleImportDropFile}
                    onClick={() => importFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? 'border-[#bd9661] bg-[#faf6ee]'
                        : 'border-[#d5c7b5] bg-[#fdfbf7] hover:border-[#bd9661] hover:bg-[#faf6ee]/50'
                    }`}
                  >
                    <input
                      ref={importFileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleImportFileInputChange}
                    />
                    <div className="w-12 h-12 rounded-full bg-white border border-[#e8decb] shadow-2xs mx-auto flex items-center justify-center text-[#bd9661] mb-2.5">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-[#15110e]">
                      Click to browse or drag & drop spreadsheet
                    </div>
                    <div className="text-xs text-[#8b7b6b] mt-1">
                      Supports Microsoft Excel (<span className="font-mono text-[11px]">.xlsx</span>, <span className="font-mono text-[11px]">.xls</span>) and Comma-Separated (<span className="font-mono text-[11px]">.csv</span>)
                    </div>
                  </div>

                  {/* AI Assistance Callout & Sample Loader */}
                  <div className="border border-[#e8decb] rounded-xl p-3.5 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#bd9661]/10 text-[#bd9661] flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#15110e]">Cheers AI Column Detection</div>
                        <p className="text-[11px] text-[#8b7b6b] leading-relaxed">
                          Spreadsheet doesn't match our template? Cheers AI automatically detects informal headers like <em>"Who's Coming"</em>, <em>"Food Restrictions"</em>, or <em>"Side"</em>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadSampleSpreadsheet}
                      className="shrink-0 bg-[#faf6ee] hover:bg-[#f5ede2] border border-[#d5c7b5] text-[#8c6d3b] hover:text-[#15110e] font-bold text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                    >
                      <span>⚡</span> Load Sample File
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end pt-2 border-t border-[#e8decb]">
                    <button
                      type="button"
                      onClick={() => setShowImportModal(false)}
                      className="px-4 py-1.5 rounded-lg border border-[#d5c7b5] text-[#8b7b6b] hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Guest List Import - Step 2: Review Screen */}
            {showImportModal && importStep === 'review' && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl max-w-6xl w-full p-4 md:p-5 shadow-2xl border border-[#e8decb] flex flex-col max-h-[92vh] my-auto space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#e8decb] shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#faf6ee] border border-[#e8decb] flex items-center justify-center text-[#bd9661] shadow-2xs font-serif font-bold text-sm">
                        T&T
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-[#15110e]">Review & Edit Imported Guests</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#faf6ee] border border-[#d5c7b5] text-[#8c6d3b]">
                            Step 2 of 2
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8b7b6b]">
                          Check and edit guest details, household groups, dietary notes, and event invitations before saving.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowImportModal(false)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      &times;
                    </button>
                  </div>

                  {/* AI Mapping Banner */}
                  <div className="bg-[#faf8f5] border border-[#e8decb] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-[#15110e]">
                        <span className="text-[#bd9661]">✨</span> Cheers AI Auto-Mapping:
                      </span>
                      <span className="text-[#8b7b6b]">
                        Detected from <strong className="text-[#15110e]">{importFileName || 'spreadsheet'}</strong>:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {importDetectedMappings.map((m, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-white border border-[#e8decb] text-[#6b5a4a] px-2 py-0.5 rounded-md shadow-2xs">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        ✓ {importRows.filter(r => r.status === 'ready').length} Ready
                      </span>
                      {importRows.filter(r => r.status === 'review').length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                          ⚠ {importRows.filter(r => r.status === 'review').length} Needs Review
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Table Controls Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 font-semibold text-[#15110e] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={importRows.length > 0 && importRows.every(r => r.selected)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setImportRows(prev => prev.map(r => ({ ...r, selected: checked })));
                          }}
                          className="accent-[#bd9661] rounded cursor-pointer"
                        />
                        <span>Select All ({importRows.filter(r => r.selected).length} of {importRows.length} selected)</span>
                      </label>
                      <div className="h-4 w-px bg-[#e8decb]" />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setImportFilterStatus('all')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                            importFilterStatus === 'all' ? 'bg-[#15110e] text-white' : 'text-[#8b7b6b] hover:text-[#15110e]'
                          }`}
                        >
                          All ({importRows.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setImportFilterStatus('ready')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                            importFilterStatus === 'ready' ? 'bg-[#15110e] text-white' : 'text-[#8b7b6b] hover:text-[#15110e]'
                          }`}
                        >
                          Ready ({importRows.filter(r => r.status === 'ready').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setImportFilterStatus('review')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                            importFilterStatus === 'review' ? 'bg-[#15110e] text-white' : 'text-[#8b7b6b] hover:text-[#15110e]'
                          }`}
                        >
                          Needs Review ({importRows.filter(r => r.status === 'review').length})
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBlankImportRow}
                      className="bg-white border border-[#d5c7b5] hover:bg-[#faf6ee] text-[#15110e] font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
                    >
                      <span>+</span> Add Guest Row
                    </button>
                  </div>

                  {/* The Editable Spreadsheet Table */}
                  <div className="flex-1 overflow-auto border border-[#e8decb] rounded-xl bg-white shadow-2xs min-h-[160px] max-h-[30vh]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#faf8f5] text-[#8b7b6b] uppercase text-[10px] font-bold tracking-wider sticky top-0 z-10 border-b border-[#e8decb]">
                        <tr>
                          <th className="py-2.5 px-2.5 w-8 text-center">#</th>
                          <th className="py-2.5 px-2 w-20">Status</th>
                          <th className="py-2.5 px-2 min-w-[140px]">Guest Full Name *</th>
                          <th className="py-2.5 px-2 min-w-[130px]">Household / Group</th>
                          <th className="py-2.5 px-2 min-w-[160px]">Email Address</th>
                          <th className="py-2.5 px-2 min-w-[125px]">Mobile Phone</th>
                          <th className="py-2.5 px-2 min-w-[125px]">Category</th>
                          <th className="py-2.5 px-1.5 w-14 text-center">Adults</th>
                          <th className="py-2.5 px-1.5 w-14 text-center">Kids</th>
                          <th className="py-2.5 px-2 min-w-[130px]">Dietary</th>
                          <th className="py-2.5 px-2 min-w-[180px]">Invited Celebrations</th>
                          <th className="py-2.5 px-2 w-8 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0e8dc]">
                        {importRows
                          .filter(r => {
                            if (importFilterStatus === 'ready') return r.status === 'ready';
                            if (importFilterStatus === 'review') return r.status === 'review';
                            return true;
                          })
                          .map((row) => (
                            <tr key={row.id} className={`hover:bg-[#fdfbf7] ${!row.selected ? 'opacity-50 bg-gray-50/50' : ''}`}>
                              {/* Checkbox */}
                              <td className="py-2 px-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.selected}
                                  onChange={(e) => updateImportRow(row.id, 'selected', e.target.checked)}
                                  className="accent-[#bd9661] rounded cursor-pointer"
                                />
                              </td>

                              {/* Status Badge */}
                              <td className="py-2 px-2">
                                {row.status === 'ready' ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    Ready
                                  </span>
                                ) : (
                                  <span
                                    title={row.warning || 'Needs review'}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 cursor-help"
                                  >
                                    Review
                                  </span>
                                )}
                              </td>

                              {/* Name */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.name}
                                  onChange={(e) => updateImportRow(row.id, 'name', e.target.value)}
                                  placeholder="Guest Name *"
                                  className="w-full bg-white border border-[#e8ded0] rounded px-2 py-1 text-xs outline-none focus:border-[#bd9661] font-medium text-[#15110e]"
                                />
                              </td>

                              {/* Household */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.household}
                                  onChange={(e) => updateImportRow(row.id, 'household', e.target.value)}
                                  placeholder="Family / Household"
                                  className="w-full bg-white border border-[#e8ded0] rounded px-2 py-1 text-xs outline-none focus:border-[#bd9661] text-[#6b5a4a]"
                                />
                              </td>

                              {/* Email */}
                              <td className="py-2 px-2">
                                <input
                                  type="email"
                                  value={row.email}
                                  onChange={(e) => updateImportRow(row.id, 'email', e.target.value)}
                                  placeholder="guest@example.com"
                                  className="w-full bg-white border border-[#e8ded0] rounded px-2 py-1 text-xs outline-none focus:border-[#bd9661] text-[#6b5a4a]"
                                />
                              </td>

                              {/* Phone */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.phone}
                                  onChange={(e) => updateImportRow(row.id, 'phone', e.target.value)}
                                  placeholder="+61 4..."
                                  className="w-full bg-white border border-[#e8ded0] rounded px-2 py-1 text-xs outline-none focus:border-[#bd9661] text-[#6b5a4a]"
                                />
                              </td>

                              {/* Category */}
                              <td className="py-2 px-2">
                                <select
                                  value={row.category}
                                  onChange={(e) => updateImportRow(row.id, 'category', e.target.value)}
                                  className="w-full bg-white border border-[#e8ded0] rounded px-1.5 py-1 text-xs outline-none focus:border-[#bd9661] text-[#15110e]"
                                >
                                  {GUEST_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </td>

                              {/* Adults */}
                              <td className="py-2 px-1.5 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={row.adults}
                                  onChange={(e) => updateImportRow(row.id, 'adults', Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-12 text-center bg-white border border-[#e8ded0] rounded px-1 py-1 text-xs outline-none focus:border-[#bd9661] font-semibold text-[#15110e]"
                                />
                              </td>

                              {/* Kids */}
                              <td className="py-2 px-1.5 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  value={row.kids}
                                  onChange={(e) => updateImportRow(row.id, 'kids', Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-12 text-center bg-white border border-[#e8ded0] rounded px-1 py-1 text-xs outline-none focus:border-[#bd9661] text-[#15110e]"
                                />
                              </td>

                              {/* Dietary */}
                              <td className="py-2 px-2">
                                <input
                                  type="text"
                                  value={row.dietary}
                                  onChange={(e) => updateImportRow(row.id, 'dietary', e.target.value)}
                                  placeholder="None / Veg..."
                                  className="w-full bg-white border border-[#e8ded0] rounded px-2 py-1 text-xs outline-none focus:border-[#bd9661] text-[#6b5a4a]"
                                />
                              </td>

                              {/* Invited Events */}
                              <td className="py-2 px-2">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {(wedding.events || []).map(evt => {
                                    const isInvited = row.invitedEventIds.includes(evt.id);
                                    return (
                                      <button
                                        key={evt.id}
                                        type="button"
                                        onClick={() => toggleImportRowEvent(row.id, evt.id)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer border transition ${
                                          isInvited
                                            ? 'bg-[#15110e] text-[#dfc194] border-[#15110e]'
                                            : 'bg-white text-[#8b7b6b] border-[#d5c7b5] hover:border-[#bd9661]'
                                        }`}
                                        title={isInvited ? `Invited to ${evt.name} (click to remove)` : `Click to invite to ${evt.name}`}
                                      >
                                        {evt.name.split(' ')[0]}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>

                              {/* Delete Action */}
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteImportRow(row.id)}
                                  className="text-gray-400 hover:text-red-600 font-bold text-sm cursor-pointer p-1"
                                  title="Delete row"
                                >
                                  &times;
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Dispatch Preference Card: Drafts vs Immediate */}
                  <div className="bg-[#faf8f5] border border-[#e8decb] rounded-xl p-3.5 space-y-2.5 shrink-0">
                    <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bd9661]">
                      DISPATCH PREFERENCE
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <label
                        onClick={() => setImportSendMode('drafts')}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          importSendMode === 'drafts'
                            ? 'border-[#bd9661] bg-[#faf6ee] ring-1 ring-[#bd9661]'
                            : 'border-[#e8decb] bg-white hover:border-[#bd9661]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importSendMode"
                          checked={importSendMode === 'drafts'}
                          onChange={() => setImportSendMode('drafts')}
                          className="mt-0.5 accent-[#bd9661]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#15110e]">Save as Drafts</span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#bd9661]/15 text-[#8c6d3b]">
                              Recommended
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8b7b6b] mt-0.5 leading-snug">
                            Import guests into your list without notifying them yet. You can review RSVPs, assign seating tables, and send invitations in batches when ready.
                          </p>
                        </div>
                      </label>

                      <label
                        onClick={() => setImportSendMode('immediate')}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          importSendMode === 'immediate'
                            ? 'border-[#bd9661] bg-[#faf6ee] ring-1 ring-[#bd9661]'
                            : 'border-[#e8decb] bg-white hover:border-[#bd9661]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importSendMode"
                          checked={importSendMode === 'immediate'}
                          onChange={() => setImportSendMode('immediate')}
                          className="mt-0.5 accent-[#bd9661]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#15110e]">Send Invitations Straight Away</span>
                          </div>
                          <p className="text-[11px] text-[#8b7b6b] mt-0.5 leading-snug">
                            Immediately deliver digital invitations & SMS/email alerts to all selected guests with valid contact details.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="text-[11px] text-[#8b7b6b] flex items-center gap-2 pt-1 border-t border-[#e8decb]/60">
                      <svg className="w-4 h-4 text-[#bd9661] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        <strong>Anti-spam delivery note:</strong> Saving as drafts is recommended. For bulk sends over 50 guests, email sending limits should be verified with our email provider before go-live to guarantee 100% deliverability.
                      </span>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#e8decb] shrink-0">
                    <button
                      type="button"
                      onClick={() => setImportStep('upload')}
                      className="text-xs font-semibold text-[#8b7b6b] hover:text-[#15110e] flex items-center gap-1.5 cursor-pointer"
                    >
                      ← Back to Upload
                    </button>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowImportModal(false)}
                        className="px-4 py-2 rounded-lg border border-[#d5c7b5] text-[#8b7b6b] hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCommitImport}
                        className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-5 py-2 rounded-lg text-xs cursor-pointer shadow-xs transition"
                      >
                        {importSendMode === 'drafts'
                          ? `Import ${importRows.filter(r => r.selected).length} Guests as Drafts`
                          : `Import & Send Invitations to ${importRows.filter(r => r.selected).length} Guests`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Edit Family Primary Contact Phone & Email */}
            {editingFamilyContact && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#15110e]">Edit Contact Details</h3>
                      <p className="text-[11px] text-[#8b7b6b]">{editingFamilyContact.householdKey}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingFamilyContact(null)}
                      className="text-gray-400 hover:text-black font-bold text-lg cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingFamilyContact.guestId) {
                        const updated = state.guests.map(g =>
                          g.id === editingFamilyContact.guestId
                            ? {
                                ...g,
                                phone: editingFamilyContact.phone,
                                email: editingFamilyContact.email,
                              }
                            : g
                        );
                        setState({ ...state, guests: updated });
                        showToast(`Contact updated for ${editingFamilyContact.householdKey}`, 'success');
                      }
                      setEditingFamilyContact(null);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        Designated Contact
                      </label>
                      <input
                        type="text"
                        disabled
                        value={editingFamilyContact.name}
                        className="w-full bg-[#fbf9f6] border border-[#e8ded0] rounded-lg p-2 text-xs font-semibold text-[#524436] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        Phone Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 border border-r-0 border-[#e8ded0] bg-[#faf8f5] text-xs font-bold font-mono text-[#8b7b6b] rounded-l-lg select-none">
                          +61
                        </span>
                        <input
                          type="tel"
                          required
                          value={editingFamilyContact.phone}
                          onChange={(e) => setEditingFamilyContact({ ...editingFamilyContact, phone: e.target.value })}
                          placeholder="0412 884 991"
                          className="w-full bg-white border border-[#e8ded0] rounded-r-lg rounded-l-none p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={editingFamilyContact.email}
                        onChange={(e) => setEditingFamilyContact({ ...editingFamilyContact, email: e.target.value })}
                        placeholder="guest@example.com"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                      <button
                        type="button"
                        onClick={() => setEditingFamilyContact(null)}
                        className="px-3 py-1.5 rounded-lg border border-[#e8ded0] text-[#8b7b6b] hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#15110e] text-[#dfc194] font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-[#2a221b] transition-colors"
                      >
                        Save Contact
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 3: SEATING PLANNER (TWO-LEVEL INTERACTIVE EXPERIENCE)        */}
        {/* ================================================================ */}
        {activeTab === 'seating' && (
          <section className="space-y-4">
            <SeatingPlannerSection weddingId={wedding.id} onSelectView={onSelectView} isMcView={isMcView} />
          </section>
        )}

        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* TAB: VENDOR DOCUMENTS                                            */}
        {/* ================================================================ */}
        {activeTab === 'vendor_documents' && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <VendorDirectorySection
              wedding={wedding}
              onUpdateWeddingVendors={handleUpdateWeddingVendors}
              onUpdateWedding={(updated) => {
                const updatedWeddings = (state.weddings || []).map(w => w.id === updated.id ? updated : w);
                setState({ ...state, weddings: updatedWeddings });
              }}
              initialSubView="documents"
              hideSwitcher={true}
              hideMetricsCards={true}
            />
          </section>
        )}

        {/* TAB 4: CONTENT & STORIES (Screenshot 25: 172910.png)             */}
        {/* ================================================================ */}
        {activeTab === 'pages' && !isMcOrPlanner && (
          <section className="space-y-5">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                WEDDING EXPERIENCES &amp; MOMENTS
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Content &amp; Stories
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Craft and publish your love story, dinner menu, wedding party bios, memorial tributes, and honeymoon adventures for your guests.
              </p>
            </div>

            {/* Sub-tab Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: 'ourStory', label: '📖 Our Story' },
                { id: 'inMemoriam', label: '🕊️ In Memoriam' },
                { id: 'diningMenu', label: '🍽️ Dining & Menu' },
                { id: 'meetTheTeam', label: '👥 Meet the Team' },
                { id: 'honeymoonUpdates', label: '✈️ Honeymoon Updates' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setContentSubTab(tab.id as any); setPreviewPhotoIndex(0); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    contentSubTab === tab.id
                      ? 'bg-[#bd9661] text-[#15110e]'
                      : 'bg-white border border-[#e8ded0] text-[#15110e] hover:bg-[#faf8f5]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

              {/* Split: Editor Card vs Live Preview Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Editor Card */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                  <h3 className="font-serif text-base font-bold text-[#15110e]">
                    Edit Page &bull; {contentPages[contentSubTab].title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#e8eee4] text-[#3c6a42] text-[11px] font-bold px-2 py-0.5 rounded">
                      {contentPages[contentSubTab].status}
                    </span>
                    <button type="button" className="text-sm cursor-pointer" title="Version History">🕒</button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PAGE TITLE</label>
                    <input
                      type="text"
                      value={contentPages[contentSubTab].title}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], title: e.target.value }
                      })}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">SUBTITLE / DEDICATION</label>
                    <input
                      type="text"
                      value={contentPages[contentSubTab].subtitle}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], subtitle: e.target.value }
                      })}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661]"
                    />
                  </div>

                  {contentSubTab === 'ourStory' && (
                    <div className="bg-[#faf7f2] border border-[#ebdcc9] rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#bd9661] text-[#15110e] flex items-center justify-center text-xs font-bold shadow-2xs">✨</span>
                          <div>
                            <h4 className="font-serif font-bold text-xs text-[#15110e]">Guided Story &amp; Cheers AI Assistant</h4>
                            <p className="text-[10px] text-[#8b7b6b]">Answer 3 short prompts and let Cheers draft your couple story</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!cheersDraftOutput) handleDraftWithCheers();
                            setShowCheersAiModal(true);
                          }}
                          className="px-3 py-1.5 bg-[#15110e] hover:bg-[#231c17] text-[#dfc194] font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        >
                          <span>✨</span>
                          <span>Draft with Cheers AI</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="bg-white p-2 rounded-lg border border-[#e8ded0]">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661] block mb-0.5">1. How We Met</span>
                          <p className="text-[#594939] text-xs line-clamp-2 italic">"{storyPromptHowWeMet}"</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#e8ded0]">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661] block mb-0.5">2. The Proposal</span>
                          <p className="text-[#594939] text-xs line-clamp-2 italic">"{storyPromptProposal}"</p>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#e8ded0]">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661] block mb-0.5">3. What We Cherish</span>
                          <p className="text-[#594939] text-xs line-clamp-2 italic">"{storyPromptCherish}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PAGE STORY &amp; CONTENT</label>
                    <textarea
                      value={contentPages[contentSubTab].content}
                      onChange={(e) => setContentPages({
                        ...contentPages,
                        [contentSubTab]: { ...contentPages[contentSubTab], content: e.target.value }
                      })}
                      rows={6}
                      className="w-full bg-white border border-[#e8ded0] rounded-lg p-2.5 outline-none focus:border-[#bd9661] resize-none"
                    />
                  </div>

                  {/* Photo Upload & Gallery Management */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase">PHOTOS &amp; GALLERY</label>
                      {/* Layout Mode Selector */}
                      <div className="flex items-center gap-1 bg-[#f5efe6] p-0.5 rounded-lg border border-[#e8ded0]">
                        <button
                          type="button"
                          onClick={() => setContentPages({
                            ...contentPages,
                            [contentSubTab]: { ...contentPages[contentSubTab], layoutMode: 'single' }
                          })}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                            (contentPages[contentSubTab].layoutMode || 'single') === 'single'
                              ? 'bg-[#bd9661] text-[#15110e] shadow-2xs'
                              : 'text-[#8b7b6b] hover:text-[#15110e]'
                          }`}
                        >
                          📷 Single Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setContentPages({
                            ...contentPages,
                            [contentSubTab]: { ...contentPages[contentSubTab], layoutMode: 'collage' }
                          })}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                            contentPages[contentSubTab].layoutMode === 'collage'
                              ? 'bg-[#bd9661] text-[#15110e] shadow-2xs'
                              : 'text-[#8b7b6b] hover:text-[#15110e]'
                          }`}
                        >
                          🖼️ Photo Collage
                        </button>
                      </div>
                    </div>

                    {/* Initial Upload Options (Provide 2 options: Single Image vs Images as Collage) */}
                    {(!contentPages[contentSubTab].photos || contentPages[contentSubTab].photos.length === 0) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                        <label className="border-2 border-dashed border-[#bd9661]/60 hover:border-[#bd9661] bg-[#faf8f5] hover:bg-[#f5efe6] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shadow-2xs">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(e, 'single')}
                          />
                          <div className="w-10 h-10 rounded-full bg-white border border-[#bd9661]/40 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform shadow-2xs">
                            📷
                          </div>
                          <span className="text-xs font-bold text-[#15110e]">Upload Single Image</span>
                          <span className="text-[10px] text-[#8b7b6b] mt-0.5">Featured full-width hero photo</span>
                        </label>

                        <label className="border-2 border-dashed border-[#bd9661]/60 hover:border-[#bd9661] bg-[#faf8f5] hover:bg-[#f5efe6] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shadow-2xs">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(e, 'collage')}
                          />
                          <div className="w-10 h-10 rounded-full bg-white border border-[#bd9661]/40 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform shadow-2xs">
                            🖼️
                          </div>
                          <span className="text-xs font-bold text-[#15110e]">Upload Images as Collage</span>
                          <span className="text-[10px] text-[#8b7b6b] mt-0.5">Curated collage of 2 to 5 photos</span>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Centered Photo Slots */}
                        <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-xl p-3">
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            {(contentPages[contentSubTab].photos || []).map((photoUrl, idx) => {
                              const isSelected = previewPhotoIndex === idx;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => setPreviewPhotoIndex(idx)}
                                  className={`relative group w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-2xs ${
                                    isSelected
                                      ? 'border-[#bd9661] ring-2 ring-[#bd9661]/30'
                                      : 'border-[#e8ded0] hover:border-[#bd9661]/60'
                                  }`}
                                >
                                  <img
                                    src={photoUrl}
                                    alt=""
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f5efe6" width="100" height="100"/><text fill="%23bd9661" font-size="12" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">Photo</text></svg>';
                                    }}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemovePhoto(idx);
                                    }}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#15110e]/80 hover:bg-[#c93b2b] text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                    title="Remove photo"
                                  >
                                    &times;
                                  </button>
                                  {isSelected && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#bd9661] text-[#15110e] text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-2xs">
                                      Cover
                                    </span>
                                  )}
                                </div>
                              );
                            })}

                            {/* Centered Upload Slot Tile (shown strictly when fewer than 5 photos) */}
                            {(contentPages[contentSubTab].photos || []).length < 5 && (
                              <label className="w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-xl border-2 border-dashed border-[#bd9661]/60 hover:border-[#bd9661] bg-white hover:bg-[#faf5ee] flex flex-col items-center justify-center cursor-pointer transition-all group text-center p-1 shadow-2xs">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handlePhotoUpload(e, contentPages[contentSubTab].layoutMode || 'collage')}
                                />
                                <div className="w-6 h-6 rounded-full bg-white border border-[#bd9661]/40 flex items-center justify-center text-[#bd9661] group-hover:scale-110 transition-transform text-xs font-bold shadow-2xs">
                                  +
                                </div>
                                <span className="text-[9.5px] font-bold text-[#8b7b6b] group-hover:text-[#15110e] mt-1">
                                  Upload
                                </span>
                              </label>
                            )}
                          </div>
                        </div>


                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">FEATURED PHOTO CAPTION</label>
                      <input
                        type="text"
                        value={contentPages[contentSubTab].caption}
                        onChange={(e) => setContentPages({
                          ...contentPages,
                          [contentSubTab]: { ...contentPages[contentSubTab], caption: e.target.value }
                        })}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none focus:border-[#bd9661]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PHOTO BADGE ICON / THEME</label>
                      <select
                        value={contentPages[contentSubTab].icon}
                        onChange={(e) => setContentPages({
                          ...contentPages,
                          [contentSubTab]: { ...contentPages[contentSubTab], icon: e.target.value }
                        })}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2 outline-none"
                      >
                        <option value="💍">💍 Proposal &amp; Love</option>
                        <option value="🕊️">🕊️ White Dove &amp; Memory</option>
                        <option value="🍽️">🍽️ Fine Dining &amp; Wine</option>
                        <option value="👥">👥 Bridal Party</option>
                        <option value="✈️">✈️ Travel &amp; Honeymoon</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#f0ede4]">
                    <span className="text-[11px] text-[#8b7b6b]">Last updated: Today</span>
                    <button
                      type="button"
                      onClick={() => showToast('Page content saved and published to guest hubs', 'success')}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Save Page Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* 🥂 CHEERS AI INTERACTIVE STORY CHATBOT CONCIERGE */}
            {showCheersAiModal && (
              <div className="fixed bottom-6 right-6 z-[2000] w-[94vw] sm:w-[430px] md:w-[450px] h-[580px] max-h-[85vh] bg-white rounded-3xl border-2 border-[#bd9661] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-[#e8ded0] flex items-center justify-between bg-[#15110e] text-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#291f17] border border-[#bd9661]/40 flex items-center justify-center text-lg shadow-inner">
                        🥂
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#dfc194]">
                          CHEERS AI STORYTELLER
                        </div>
                        <h3 className="font-serif text-lg font-bold text-white">
                          Couple Story &amp; Content Chatbot
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCheersAiModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#dfc194] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quick Style Suggestions Bar */}
                  <div className="px-4 py-2 bg-[#faf8f5] border-b border-[#e8ded0] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
                    <span className="text-[10px] font-bold uppercase text-[#8b7b6b] shrink-0">Refine Style:</span>
                    {[
                      { label: '✨ Romantic & Poetic', query: 'Make it romantic and poetic' },
                      { label: '🎉 Playful & Joyful', query: 'Make it playful with light humor' },
                      { label: '📖 Warm & Concise', query: 'Make it brief and concise' },
                      { label: '🌟 Highlight Cherished Moments', query: 'Emphasize what we cherish together' },
                    ].map((pill, pidx) => (
                      <button
                        key={pidx}
                        type="button"
                        onClick={() => handleSendStoryChatMessage(pill.query)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#ede5d8] border border-[#d5c7b5] text-[#15110e] font-semibold text-[11px] whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {/* Chat Messages Body */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbf9f6] text-xs">
                    {storyChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl p-3.5 shadow-2xs whitespace-pre-wrap leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#15110e] text-[#dfc194] rounded-br-xs'
                              : 'bg-white text-[#15110e] border border-[#e8ded0] rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>

                          {/* Story Draft Card with 1-Click Apply */}
                          {msg.draft && (
                            <div className="mt-3 p-3.5 bg-[#faf8f5] border border-[#bd9661]/40 rounded-xl space-y-2.5 text-xs">
                              <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-1.5">
                                <span className="font-serif font-bold text-[#15110e]">Story Proposal</span>
                                <span className="text-[10px] text-[#bd9661] font-bold">✨ Cheers AI</span>
                              </div>
                              <p className="italic text-[#594939] leading-relaxed font-serif bg-white p-2.5 rounded-lg border border-[#e8ded0]">
                                "{msg.draft}"
                              </p>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContentPages((prev) => ({
                                      ...prev,
                                      ourStory: {
                                        ...prev.ourStory,
                                        content: msg.draft!,
                                        status: 'Published',
                                      },
                                    }));
                                    setShowCheersAiModal(false);
                                    showToast('✓ Story applied to wedding website!', 'success');
                                  }}
                                  className="px-4 py-1.5 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                                >
                                  <span>✓</span>
                                  <span>Apply to Our Story</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-[9.5px] text-[#8b7b6b] mt-0.5 px-1 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input Bar with File Upload: text box, file upload icon, send button */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendStoryChatMessage();
                    }}
                    className="p-3 bg-white border-t border-[#e8ded0] flex items-center gap-2 shrink-0"
                  >
                    <input
                      ref={storyFileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf,.md"
                      className="hidden"
                      onChange={handleStoryFileUpload}
                    />
                    <input
                      type="text"
                      placeholder="Ask Cheers AI to refine story, adjust tone, or upload notes..."
                      value={storyChatInput}
                      onChange={(e) => setStoryChatInput(e.target.value)}
                      className="flex-1 bg-[#faf8f5] border border-[#e8ded0] rounded-xl px-3.5 py-2 text-xs text-[#15110e] outline-none focus:border-[#bd9661] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => storyFileInputRef.current?.click()}
                      className="p-2 text-[#8b7b6b] hover:text-[#15110e] hover:bg-[#faf8f5] rounded-xl transition-colors cursor-pointer shrink-0 border border-[#e8ded0] flex items-center justify-center"
                      title="Upload notes, diaries, or vows (.txt, .docx, .pdf)"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    </button>
                    <button
                      type="submit"
                      disabled={!storyChatInput.trim()}
                      className="bg-[#15110e] hover:bg-[#251b14] disabled:opacity-40 text-[#dfc194] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>Send</span>
                      <span>&rarr;</span>
                    </button>
                  </form>
                </div>
              )}

            {/* Right: Guest View Live Preview */}
              <div className="bg-[#faf8f5] border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                    GUEST VIEW LIVE PREVIEW
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#e8eee4] text-[#3c6a42] text-[10px] font-bold px-2 py-0.5 rounded">
                      Live
                    </span>
                    <button type="button" className="bg-[#15110e] text-white p-1 rounded text-xs cursor-pointer">
                      👁️
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-[#e8ded0] rounded-xl p-6 shadow-xs text-center space-y-3">
                  <div className="text-3xl">{contentPages[contentSubTab].icon}</div>
                  <h2 className="font-serif text-2xl font-bold text-[#15110e]">
                    {contentPages[contentSubTab].title}
                  </h2>
                  <p className="text-xs text-[#8b7b6b] italic max-w-sm mx-auto">
                    {contentPages[contentSubTab].subtitle}
                  </p>

                  {/* Photo Display / Gallery (Centered) */}
                  {(() => {
                    const photos = contentPages[contentSubTab].photos || [];
                    const activeIdx = previewPhotoIndex < photos.length ? previewPhotoIndex : 0;
                    const isCollage = contentPages[contentSubTab].layoutMode === 'collage' && photos.length > 1;

                    if (photos.length === 0) {
                      return (
                        <div className="bg-[#ede5d8] border border-[#d5c7b5] rounded-xl p-8 my-4 text-center max-w-md mx-auto">
                          <span className="text-2xl opacity-60">📷</span>
                          <div className="text-xs font-bold text-[#15110e] mt-1">Featured Photo</div>
                          <div className="text-[10px] text-[#8b7b6b]">{contentPages[contentSubTab].caption}</div>
                        </div>
                      );
                    }

                    if (isCollage) {
                      // COLLAGE MODE: Photos centered in a luxury collage
                      return (
                        <div className="my-4 space-y-2.5 max-w-md mx-auto">
                          {photos.length === 2 && (
                            <div className="grid grid-cols-2 gap-2 aspect-[16/10] max-h-[260px] rounded-2xl overflow-hidden shadow-sm">
                              {photos.map((p, idx) => (
                                <div key={idx} className="relative overflow-hidden group">
                                  <img
                                    src={p}
                                    alt=""
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect fill="%23f5efe6" width="300" height="300"/><text fill="%23bd9661" font-size="14" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">Photo</text></svg>';
                                    }}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {photos.length === 3 && (
                            <div className="grid grid-cols-3 gap-2 aspect-[16/10] max-h-[260px] rounded-2xl overflow-hidden shadow-sm">
                              <div className="col-span-2 relative overflow-hidden group">
                                <img
                                  src={photos[0]}
                                  alt=""
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="col-span-1 grid grid-rows-2 gap-2">
                                {photos.slice(1, 3).map((p, idx) => (
                                  <div key={idx} className="relative overflow-hidden group">
                                    <img
                                      src={p}
                                      alt=""
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {photos.length === 4 && (
                            <div className="grid grid-cols-2 gap-2 aspect-square max-h-[280px] rounded-2xl overflow-hidden shadow-sm">
                              {photos.map((p, idx) => (
                                <div key={idx} className="relative overflow-hidden group">
                                  <img
                                    src={p}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {photos.length >= 5 && (
                            <div className="grid grid-cols-4 grid-rows-2 gap-2 aspect-[16/11] max-h-[300px] rounded-2xl overflow-hidden shadow-sm">
                              <div className="col-span-4 row-span-1 relative overflow-hidden group">
                                <img
                                  src={photos[0]}
                                  alt=""
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              {photos.slice(1, 5).map((p, idx) => (
                                <div key={idx} className="col-span-1 row-span-1 relative overflow-hidden group">
                                  <img
                                    src={p}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Centered Caption */}
                          <div className="text-center text-[11px] text-[#8b7b6b] flex items-center justify-center gap-1.5 px-1 mt-2">
                            <span>🖼️</span>
                            <span className="font-medium">{contentPages[contentSubTab].caption}</span>
                          </div>
                        </div>
                      );
                    }

                    // SINGLE PHOTO MODE: Centered hero photo with carousel
                    return (
                      <div className="my-4 space-y-2.5 max-w-md mx-auto">
                        <div className="relative rounded-2xl overflow-hidden border border-[#e8ded0] bg-[#15110e] aspect-[16/10] max-h-[260px] shadow-sm flex items-center justify-center group mx-auto">
                          <img
                            src={photos[activeIdx]}
                            alt={contentPages[contentSubTab].caption || 'Wedding Photo'}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f5efe6" width="400" height="300"/><text fill="%23bd9661" font-family="serif" font-size="20" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">Wedding Photo</text></svg>';
                            }}
                            className="w-full h-full object-cover transition-all duration-300"
                          />

                          {/* Navigation Arrows if > 1 photo */}
                          {photos.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => setPreviewPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                aria-label="Previous photo"
                              >
                                &larr;
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                aria-label="Next photo"
                              >
                                &rarr;
                              </button>

                              {/* Dot Indicators */}
                              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                                {photos.map((_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setPreviewPhotoIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                      activeIdx === i ? 'w-4 bg-white' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                    aria-label={`Photo ${i + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Centered Caption */}
                        <div className="text-center text-[11px] text-[#8b7b6b] flex items-center justify-center gap-1.5 px-1 mt-2">
                          <span>📷</span>
                          <span className="font-medium">{contentPages[contentSubTab].caption}</span>
                        </div>


                      </div>
                    );
                  })()}

                  <p className="text-xs text-[#15110e] leading-relaxed text-left whitespace-pre-line bg-[#faf8f5] p-3 rounded-lg border border-[#f0ede4]">
                    {contentPages[contentSubTab].content}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 5: INVITATIONS (Screenshot 26: 172916.png)                    */}
        {/* ================================================================ */}
        {activeTab === 'invitations' && !isMcOrPlanner && (
          <section className="space-y-6">
            <InvitationTemplatesSection
              selectedQaRdHousehold={selectedQaRdHousehold}
              setSelectedQaRdHousehold={setSelectedQaRdHousehold}
              selectedQaRdPalette={selectedQaRdPalette}
              setSelectedQaRdPalette={setSelectedQaRdPalette}
              onSelectView={onSelectView}
            />
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 6: GIFT & THANK-YOU (Screenshot 27: 172928.png)              */}
        {/* ================================================================ */}
        {activeTab === 'gifts' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  DIGITAL WISHING WELL &amp; APPRECIATION
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  {isMcView ? 'Gift & Wishing Well Ledger' : 'Gift & Thank-You Manager'}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Gift ledger exported', 'success')}
                  className="bg-white border border-[#d5c7b5] text-[#15110e] font-semibold px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-xs"
                >
                  📊 Export Status
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualGiftModal(true)}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-xs"
                >
                  + Record Manual Gift
                </button>
              </div>
            </div>

            {/* Sub-tabs: Gifting Registry vs Thank-You Manager */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGiftSubTab('registry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  giftSubTab === 'registry' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                }`}
              >
                🎁 Gifting Registry
              </button>
              <button
                type="button"
                onClick={() => setGiftSubTab('thankyou')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  giftSubTab === 'thankyou' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                }`}
              >
                💌 Thank-You Manager
              </button>
            </div>

            {/* External Gift Registry Card with Solid Gold View Registry Button */}
            {wedding?.giftRegistryUrl && (
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#e8ded0] flex items-center justify-center text-lg">
                    🎁
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#15110e]">External Gift Registry</div>
                    <div className="text-[11px] text-[#8b7b6b]">{wedding.giftRegistryUrl}</div>
                  </div>
                </div>
                <a
                  href={wedding.giftRegistryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors no-underline cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <span>View Registry</span>
                </a>
              </div>
            )}

            {/* 3 Metric Cards matching Screenshot 27 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm">
                <div className="font-serif text-3xl font-bold text-[#15110e]">$4,280</div>
                <div className="text-xs text-[#8b7b6b] mt-1">Total gifts received</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm">
                <div className="font-serif text-3xl font-bold text-[#15110e]">9</div>
                <div className="text-xs text-[#8b7b6b] mt-1">Thank-yous due</div>
              </div>
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm">
                <div className="font-serif text-3xl font-bold text-[#15110e]">$285</div>
                <div className="text-xs text-[#8b7b6b] mt-1">Average gift contribution</div>
              </div>
            </div>

            {/* Table matching Screenshot 27 */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e8ded0] text-[10px] font-bold tracking-wider uppercase text-[#8b7b6b]">
                    <th className="py-2.5 px-3">FROM</th>
                    <th className="py-2.5 px-3">SOURCE</th>
                    <th className="py-2.5 px-3">AMOUNT</th>
                    <th className="py-2.5 px-3">DATE</th>
                    <th className="py-2.5 px-3">MESSAGE</th>
                    <th className="py-2.5 px-3">THANK-YOU STATUS</th>
                    <th className="py-2.5 px-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede4]">
                  {coupleGifts.map((row) => (
                    <tr key={row.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-3 font-bold text-[#15110e]">{row.from}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          row.source === 'manual' ? 'bg-[#f7ede2] text-[#8b5a2b]' : 'bg-[#e8eee4] text-[#3c6a42]'
                        }`}>
                          {row.source === 'manual' ? 'Manual Gift' : 'Online / Stripe'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#15110e]">{row.amount}</td>
                      <td className="py-3 px-3 text-[#8b7b6b]">{row.date}</td>
                      <td className="py-3 px-3 italic text-[#6b5849] max-w-[280px]">{row.msg}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          row.status === 'Sent' ? 'bg-[#e8eee4] text-[#3c6a42]' : 'bg-[#faf6f0] text-[#916c3d]'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGiftForThankYou(row);
                            setThankYouNoteDraft(
                              row.noteDraft ||
                              `Dear ${row.from}, thank you so much for your wonderful and generous gift of ${row.amount}! It means the world to have your love and support as we begin our new chapter together. Love, Sophie & James.`
                            );
                            setThankYouStatusChoice(row.status);
                          }}
                          title="Open Thank-You Note Editor"
                          aria-label={`Open thank-you note editor for ${row.from}`}
                          className="text-[#bd9661] hover:text-[#a8824f] p-1.5 text-sm cursor-pointer hover:bg-[#faf6f0] rounded transition-colors"
                        >
                          ✎
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Interactive Thank-You Note Pop-up */}
            {selectedGiftForThankYou && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-[#e8ded0]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">GIFT &amp; THANK-YOU MANAGER</div>
                      <h3 className="font-serif text-xl font-bold text-[#15110e]">Digital Thank-You Card</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedGiftForThankYou(null)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer"
                      aria-label="Close dialog"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Gift summary card */}
                  <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] text-[#8b7b6b]">Gift From:</div>
                        <strong className="text-sm text-[#15110e]">{selectedGiftForThankYou.from}</strong>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[#8b7b6b]">Contribution:</div>
                        <span className="font-serif text-lg font-bold text-[#15110e]">{selectedGiftForThankYou.amount}</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#6b5849] italic border-t border-[#f0ede4] pt-2">
                      {selectedGiftForThankYou.msg}
                    </div>
                  </div>

                  {/* Thank-You Card Preview */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8b7b6b] uppercase">Personalized Digital Thank-You Message</label>
                    <textarea
                      rows={5}
                      value={thankYouNoteDraft}
                      onChange={(e) => setThankYouNoteDraft(e.target.value)}
                      className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Status Choice */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8b7b6b] uppercase">Thank-You Status</label>
                    <div className="flex gap-2">
                      {(['Due', 'Drafted', 'Sent'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setThankYouStatusChoice(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            thankYouStatusChoice === st
                              ? st === 'Sent' ? 'bg-[#2e6d3c] text-white shadow-xs' : 'bg-[#bd9661] text-[#15110e] shadow-xs'
                              : 'bg-white border border-[#e8ded0] text-[#8b7b6b]'
                          }`}
                        >
                          {st === 'Sent' ? '✓ Sent' : st === 'Drafted' ? '✎ Drafted' : '⏳ Due'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#e8ded0] gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGiftForThankYou(null)}
                      className="bg-white border border-[#d5c7b5] text-[#15110e] font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#faf8f5] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCoupleGifts(coupleGifts.map(g => g.id === selectedGiftForThankYou.id ? { ...g, status: thankYouStatusChoice, noteDraft: thankYouNoteDraft } : g));
                          setSelectedGiftForThankYou(null);
                          showToast('Thank-you draft saved', 'info');
                        }}
                        className="bg-white border border-[#bd9661] text-[#916c3d] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#faf6f0] cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCoupleGifts(coupleGifts.map(g => g.id === selectedGiftForThankYou.id ? { ...g, status: 'Sent', noteDraft: thankYouNoteDraft } : g));
                          setSelectedGiftForThankYou(null);
                          showToast(`✓ Digital thank-you note dispatched to ${selectedGiftForThankYou.from}!`, 'success');
                        }}
                        className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                      >
                        ✉ Send Thank-You Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Manual Gift */}
            {showManualGiftModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <h3 className="font-serif text-lg font-bold text-[#15110e]">Record Physical / Cash Gift</h3>
                    <button type="button" onClick={() => setShowManualGiftModal(false)} className="text-gray-400 font-bold text-lg">&times;</button>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">From (Guest Name)</label>
                      <input
                        type="text"
                        value={manualGiftFrom}
                        onChange={(e) => setManualGiftFrom(e.target.value)}
                        placeholder="e.g. Grandma Helen"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Amount (AUD)</label>
                      <input
                        type="number"
                        value={manualGiftAmount}
                        onChange={(e) => setManualGiftAmount(e.target.value)}
                        placeholder="250"
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">Card Note / Message</label>
                      <textarea
                        value={manualGiftMessage}
                        onChange={(e) => setManualGiftMessage(e.target.value)}
                        placeholder="Heartfelt congratulations..."
                        rows={3}
                        className="w-full bg-white border border-[#e8ded0] rounded-lg p-2"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button type="button" onClick={() => setShowManualGiftModal(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Recorded $${manualGiftAmount} gift from ${manualGiftFrom}`, 'success');
                          setShowManualGiftModal(false);
                        }}
                        className="bg-[#bd9661] text-[#15110e] font-bold px-4 py-1.5 rounded-lg"
                      >
                        Record Gift
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 7: CELEBRATION FEED (Screenshot 28: 172937.png)              */}
        {/* ================================================================ */}
        {activeTab === 'feed' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                LIVE EVENT STREAM
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Celebration Feed Moderation
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Single Unified Celebration Stream */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#15110e]">
                      Live Celebration Feed
                    </h2>
                    <p className="text-xs text-[#8b7b6b] mt-0.5">
                      Love notes, toasts, and announcements shared by the couple and wedding guests.
                    </p>
                  </div>
                  
                </div>

                <div className="space-y-3.5">
                  {feedPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-[#e8ded0] rounded-2xl p-4 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {post.pinned ? '🎉' : '💌'}
                          </span>
                          <strong className="text-sm text-[#15110e]">{post.title}</strong>
                          {post.pinned && (
                            <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] text-[10px] font-bold px-2 py-0.5 rounded">
                              Pinned
                            </span>
                          )}
                          {post.category === 'couple' && (
                            <span className="bg-[#15110e] text-[#dfc194] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Couple
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8b7b6b]">{post.time}</span>
                          <span className="text-xs text-[#bd9661] cursor-pointer">
                            {post.expanded ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>

                      {post.quote && (
                        <p className="text-xs text-[#15110e] bg-[#faf8f5] p-3 rounded-xl border-l-2 border-[#bd9661] leading-relaxed">
                          {post.quote}
                        </p>
                      )}


                      {post.tag && (
                        <div className="text-xs text-[#8b7b6b]">{post.tag}</div>
                      )}

                      {/* Display replies if any */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-[#f0ede4]">
                          {post.replies.map((rep, ri) => (
                            <div key={ri} className="bg-[#fcf8f2] rounded-xl p-2.5 text-xs border border-[#ebdcc9] flex items-start gap-2">
                              <span className="text-sm">💍</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <strong className="text-[11px] text-[#916c3d]">{rep.author}</strong>
                                  <span className="text-[10px] text-[#8b7b6b]">{rep.time}</span>
                                </div>
                                <p className="text-[11.5px] text-[#15110e] mt-0.5">{rep.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-[#f0ede4] text-xs">
                        <span className="text-[11px] text-[#8b7b6b]">
                          {post.time} &bull; {post.likes} likes &bull; {post.replies?.length || post.comments || 0} replies
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingPost(post);
                              setReplyText('');
                            }}
                            className="bg-[#faf8f5] hover:bg-[#fff7ea] border border-[#ebd3a8] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>💬</span> Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedPosts(feedPosts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                            }}
                            className="bg-white border border-[#e8ded0] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-red-50 transition-colors"
                          >
                            <span>❤️</span> {post.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Add Official Note */}
              <div className="space-y-4 lg:mt-[38px]">
                <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Add Official Note</h3>
                    <span className="text-[10px] text-[#bd9661] font-bold uppercase tracking-wider">Couple Post</span>
                  </div>

                  <textarea
                    value={officialNoteText}
                    onChange={(e) => setOfficialNoteText(e.target.value)}
                    placeholder="Post a thank-you message or announcement from the couple..."
                    rows={4}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-3 text-xs outline-none focus:border-[#bd9661] resize-none leading-relaxed"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!officialNoteText.trim()) return;
                      const newPost = {
                        id: 'fp_' + Date.now(),
                        category: 'couple' as const,
                        title: 'Official Note from Sophie & James',
                        time: 'Just now',
                        pinned: true,
                        quote: officialNoteText.trim(),
                        likes: 1,
                        comments: 0,
                        expanded: true,
                        replies: [],
                      };
                      setFeedPosts([newPost, ...feedPosts]);
                      setOfficialNoteText('');
                      showToast('Note posted to celebration feed!', 'success');
                    }}
                    className="w-full h-[42px] px-4 bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] font-bold rounded-xl text-xs transition-all hover:brightness-105 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>✨</span>
                    <span>Post to Celebration Feed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal: Interactive Reply to Feed Post Pop-up */}
            {replyingPost && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e8ded0]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">CELEBRATION FEED REPLY</div>
                      <h3 className="font-serif text-lg font-bold text-[#15110e]">Reply to {replyingPost.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingPost(null)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer"
                      aria-label="Close dialog"
                    >
                      &times;
                    </button>
                  </div>

                  {replyingPost.quote && (
                    <div className="bg-[#faf8f5] p-3 rounded-xl border-l-2 border-[#bd9661] text-xs italic text-[#6b5849]">
                      "{replyingPost.quote}"
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8b7b6b] uppercase">Sophie &amp; James's Reply</label>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write a warm reply to ${replyingPost.title}...`}
                      className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-3 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none"
                    />
                    <div className="flex gap-1.5 pt-1 flex-wrap">
                      {['❤️ Thank you so much!', '💕 Can\'t wait to hug you!', '🥂 Cheers to that!', '🙏 So grateful for you!'].map((quick, qi) => (
                        <button
                          key={qi}
                          type="button"
                          onClick={() => setReplyText(quick)}
                          className="text-[10px] bg-[#faf8f5] border border-[#e8ded0] hover:border-[#bd9661] px-2 py-0.5 rounded-full text-[#6b5849] cursor-pointer"
                        >
                          {quick}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                    <button
                      type="button"
                      onClick={() => setReplyingPost(null)}
                      className="bg-white border border-[#d5c7b5] text-[#15110e] font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#faf8f5] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!replyText.trim()) return;
                        const updated = feedPosts.map(p => {
                          if (p.id === replyingPost.id) {
                            return {
                              ...p,
                              comments: p.comments + 1,
                              replies: [...(p.replies || []), { author: 'Sophie & James', text: replyText.trim(), time: 'Just now' }],
                            };
                          }
                          return p;
                        });
                        setFeedPosts(updated);
                        setReplyingPost(null);
                        showToast(`✓ Reply published to ${replyingPost.title}!`, 'success');
                      }}
                      className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 8: WEDDING VAULT (Screenshot 29: 172943.png)                 */}
        {/* ================================================================ */}
        {activeTab === 'vault' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  LIFETIME KEEPSAKE &amp; ARCHIVE
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  Wedding Vault
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Your permanent digital keepsake preserving every cherished love note, toast, guest memory, and celebration photo for a lifetime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Vault manifest (.json) downloaded', 'success')}
                className="bg-white border border-[#d5c7b5] hover:bg-[#faf8f5] text-[#15110e] font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>📦</span> Download Vault Manifest
              </button>
            </div>

            {/* Storage Usage Card */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-[10px] font-bold tracking-wider uppercase text-[#bd9661]">
                    STORAGE ALLOCATION &amp; USAGE
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#15110e]">
                    2.35 GB used of 5.00 GB (47%)
                  </div>
                </div>
                <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#916c3d] text-xs font-bold px-3 py-1 rounded-full">
                  ⏳ Archive Expiry: 30 Days
                </span>
              </div>

              {/* Multi-color Bar */}
              <div className="w-full h-3.5 bg-[#ede5d8] rounded-full overflow-hidden flex">
                <div style={{ width: '33.6%' }} className="bg-[#bd9661]" title="Photos & Videos" />
                <div style={{ width: '5.0%' }} className="bg-[#e6a15c]" title="Live Feed & Notes" />
                <div style={{ width: '5.0%' }} className="bg-[#4a7c59]" title="Gifts & Thank-Yous" />
                <div style={{ width: '2.4%' }} className="bg-[#3d6b99]" title="Guest RSVPs & Seating" />
                <div style={{ width: '1.0%' }} className="bg-[#7d5ba6]" title="MC Schedule" />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#bd9661]" /> Photos &amp; Videos (1.68 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#e6a15c]" /> Live Feed &amp; Notes (0.25 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#4a7c59]" /> Gifts &amp; Thank-Yous (0.25 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#3d6b99]" /> Guest RSVPs &amp; Seating (0.12 GB)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#7d5ba6]" /> MC Schedule (0.05 GB)</div>
                <div className="flex items-center gap-1.5 text-[#8b7b6b]"><span className="w-2.5 h-2.5 rounded-sm bg-[#ede5d8]" /> Free Space (2.65 GB)</div>
              </div>
            </div>

            {/* Split: Access Controls & Read-Only Records */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#15110e]">🔒 Vault Access Controls</h3>
                <p className="text-xs text-[#8b7b6b]">Specify who can view and access this read-only wedding vault archive.</p>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1.5">ACCESS PERMISSIONS LEVEL</label>
                  <select
                    value={vaultPermission}
                    onChange={(e) => setVaultPermission(e.target.value)}
                    className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none"
                  >
                    <option value="couple_mc">Couple + MC</option>
                    <option value="couple_only">Couple Only</option>
                    <option value="public_family">Family &amp; Guests with QaRd Link</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Vault security access level updated', 'success')}
                  className="bg-[#bd9661] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Save Access Settings
                </button>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#15110e]">📁 Read-Only Vault Records</h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#faf8f5] rounded-xl flex items-center justify-between border border-[#f0ede4]">
                    <span>High-Resolution Photo Archive (42 images)</span>
                    <span className="text-[#3c6a42] font-bold">1.68 GB</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl flex items-center justify-between border border-[#f0ede4]">
                    <span>Love Notes &amp; Guest Wishes Stream (16 items)</span>
                    <span className="text-[#3c6a42] font-bold">0.25 GB</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl flex items-center justify-between border border-[#f0ede4]">
                    <span>Official Run Sheet &amp; Speeches Final PDF</span>
                    <span className="text-[#3c6a42] font-bold">0.05 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 9: 1ST ANNIVERSARY (Screenshots 30-32: 172951.png - 173005) */}
        {/* ================================================================ */}
        {activeTab === 'anniversary' && !isMcOrPlanner && (
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                  1ST YEAR MILESTONE CELEBRATION
                </div>
                <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                  First Anniversary <span className="text-base text-[#bd9661] font-normal">(14 Nov 2027)</span>
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Celebrate your paper anniversary milestone, unlock your time capsule reflections, and relive every magical moment with your loved ones.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAnniversaryMode('countdown')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    anniversaryMode === 'countdown' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                  }`}
                >
                  ⏳ Planning Countdown
                </button>
                <button
                  type="button"
                  onClick={() => setAnniversaryMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    anniversaryMode === 'preview' ? 'bg-[#bd9661] text-[#15110e]' : 'bg-white border border-[#e8ded0] text-[#15110e]'
                  }`}
                >
                  🎉 Preview Anniversary Day (14 Nov 2027)
                </button>
              </div>
            </div>

            {/* Dark Hero Card matching Screenshot 30 */}
            <div className="bg-[#15110e] text-white p-6 rounded-2xl shadow-lg border border-[#3d2e24] space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#dfc194]">
                    🌟 1ST YEAR ANNIVERSARY
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white mt-1">
                    Sophie <span className="text-[#dfc194] italic font-normal">&amp;</span> James
                  </h2>
                  <div className="text-xs text-[#c9bbae] mt-0.5">
                    Married 14 November 2026 &bull; Celebrating 1 Year &bull; 14 November 2027
                  </div>
                </div>
                <span className="bg-[#291f17] border border-[#bd9661] text-[#dfc194] text-xs font-bold px-3 py-1.5 rounded-full">
                  ⏳ 396 Days to Anniversary
                </span>
              </div>

              <p className="text-xs italic text-[#dfc194] leading-relaxed border-l-2 border-[#bd9661] pl-3 py-1 bg-white/5 rounded-r-lg">
                "Happy 1st Anniversary Sophie &amp; James! Looking back on your magical day at Fernwood Estate with 127 loved ones!"
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-[#bd9661]">TRADITIONAL SYMBOL</div>
                  <div className="font-bold text-sm text-white mt-1">📜 Paper</div>
                  <p className="text-[11px] text-[#c9bbae] mt-0.5">
                    A clean, blank sheet waiting to be written with your life story and adventures.
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-[#bd9661]">MODERN SYMBOL</div>
                  <div className="font-bold text-sm text-white mt-1">⏰ Clocks</div>
                  <p className="text-[11px] text-[#c9bbae] mt-0.5">
                    Celebrating every cherished minute and precious memory shared throughout your first year.
                  </p>
                </div>
              </div>
            </div>

            {/* Relive Memories Section matching Screenshot 31 */}
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">✨ Relive Your Wedding Memories</h3>
                <p className="text-xs text-[#8b7b6b]">Quick access to key moments and keepsakes from your wedding celebration</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'mem1', title: 'Wedding Photo Gallery', desc: '42 curated moments and guest captures', icon: '📷', type: 'gallery' as const },
                  { id: 'mem2', title: 'Love Notes & Guest Wishes', desc: '16 heartfelt guest tributes from the feed', icon: '💌', type: 'notes' as const },
                  { id: 'mem3', title: 'First Dance & Music', desc: '"L-O-V-E" by Nat King Cole & reception songs', icon: '💃', type: 'music' as const },
                  { id: 'mem4', title: 'Wedding Vows & Ceremony', desc: 'Fernwood Lower Meadow Lawns at 2:00 PM', icon: '📜', type: 'vows' as const },
                  { id: 'mem5', title: 'Toasts & Speech Cues', desc: 'Maid of Honor, Best Man & Father of the Bride', icon: '🥂', type: 'toasts' as const },
                  { id: 'mem6', title: 'Final Seating & Guest Roll', desc: '127 seated guests across 12 tables', icon: '🪑', type: 'seating' as const },
                ].map((m) => (
                  <div key={m.id} className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="text-2xl mb-2">{m.icon}</div>
                      <h4 className="font-bold text-sm text-[#15110e]">{m.title}</h4>
                      <p className="text-xs text-[#8b7b6b] mt-1">{m.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(m)}
                      className="text-xs text-[#bd9661] hover:text-[#916c3d] font-bold text-left hover:underline cursor-pointer pt-2 flex items-center gap-1 transition-colors"
                    >
                      View Memory &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal: Interactive View Memory Keepsake Pop-up */}
            {selectedMemory && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-[#e8ded0] max-h-[88vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-[#e8ded0]">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-[#faf6f0] border border-[#ebd3a8] rounded-xl">{selectedMemory.icon}</span>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#bd9661] tracking-wider">WEDDING VAULT KEEPSAKE</div>
                        <h3 className="font-serif text-xl font-bold text-[#15110e]">{selectedMemory.title}</h3>
                        <p className="text-xs text-[#8b7b6b]">{selectedMemory.desc}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(null)}
                      className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer p-1"
                      aria-label="Close dialog"
                    >
                      &times;
                    </button>
                  </div>

                  {/* GALLERY CONTENT */}
                  {selectedMemory.type === 'gallery' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8b7b6b]">Showing 6 highlight moments &bull; 42 stored in Cloud Archive</span>
                        <button
                          type="button"
                          onClick={() => showToast('Full wedding gallery (.zip) downloaded!', 'success')}
                          className="bg-[#faf8f5] hover:bg-[#faf4ec] text-[#bd9661] border border-[#ebd3a8] px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          ⬇ Download All (1.68 GB)
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { title: 'The Meadow Processional', tag: 'Ceremony', time: '2:15 PM', color: '#684534' },
                          { title: 'First Kiss under Arch', tag: 'Ceremony', time: '2:38 PM', color: '#7a523a' },
                          { title: 'Champagne Tower Pour', tag: 'Cocktails', time: '3:15 PM', color: '#8c6145' },
                          { title: 'Golden Hour Vineyard Walk', tag: 'Portraits', time: '5:45 PM', color: '#573d2f' },
                          { title: 'First Dance & Sparklers', tag: 'Reception', time: '7:20 PM', color: '#452f23' },
                          { title: 'Sparkler Courtyard Exit', tag: 'Farewell', time: '10:15 PM', color: '#38251c' },
                        ].map((pic, idx) => (
                          <div key={idx} className="bg-[#fcfaf7] border border-[#ebdcc9] rounded-xl overflow-hidden shadow-xs group">
                            <div
                              className="h-28 flex items-center justify-center text-white font-serif text-xs font-semibold relative"
                              style={{ backgroundColor: pic.color }}
                            >
                              <span className="opacity-90">{pic.title}</span>
                              <span className="absolute top-2 right-2 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                                {pic.time}
                              </span>
                            </div>
                            <div className="p-2.5 flex items-center justify-between text-[11px]">
                              <span className="text-[#8b7b6b]">{pic.tag}</span>
                              <button
                                type="button"
                                onClick={() => showToast(`Saved "${pic.title}" in high resolution`, 'info')}
                                className="text-[#bd9661] font-bold hover:underline cursor-pointer"
                              >
                                Save Photo &darr;
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NOTES CONTENT */}
                  {selectedMemory.type === 'notes' && (
                    <div className="space-y-3">
                      <div className="text-xs text-[#8b7b6b]">Heartfelt guest tributes transcribed directly from the live wedding feed:</div>
                      <div className="space-y-2.5">
                        {[
                          { author: 'Aunty Carol & Uncle Peter', relation: 'Family', note: 'So excited for you both — can\'t wait to celebrate! You look like absolute royalty. May God bless your sacred journey together. 💕', time: 'Ceremony Day' },
                          { author: 'The Whitfield Family', relation: 'Bridal Party Friends', note: 'Dear Sophie & James, what an incredible and breathtaking night! Wishing you both a lifetime of love, laughter, and grand adventures.', time: 'Reception' },
                          { author: 'Sarah & Michael Chen', relation: 'Close Friends', note: 'Such an honor witnessing your vows. Your love is so evident to everyone in this room. Cheers to Mr & Mrs!', time: 'Cocktail Hour' },
                          { author: 'Robert Galati', relation: 'Master of Ceremonies', note: 'It was an absolute privilege steering the stage for you two. Love, energy, and radiant happiness all evening!', time: 'Farewell' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-3.5 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <strong className="text-[#15110e]">{item.author}</strong>
                                <span className="text-[#8b7b6b] text-[11px] ml-1.5">&bull; {item.relation}</span>
                              </div>
                              <span className="text-[10px] text-[#bd9661] font-semibold">{item.time}</span>
                            </div>
                            <p className="text-xs italic text-[#6b5849] leading-relaxed">"{item.note}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MUSIC CONTENT */}
                  {selectedMemory.type === 'music' && (
                    <div className="space-y-4">
                      {/* Featured First Dance */}
                      <div className="bg-[#15110e] text-white p-4 rounded-xl border border-[#3d2e24] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#dfc194] uppercase tracking-wider">OFFICIAL FIRST DANCE</span>
                          <span className="text-xs text-[#a8988a]">Duration 2:34</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => showToast('Playing "L-O-V-E" by Nat King Cole...', 'info')}
                            className="w-10 h-10 rounded-full bg-[#bd9661] text-[#15110e] font-bold flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                          >
                            ▶
                          </button>
                          <div>
                            <div className="font-serif text-lg font-bold text-white">L-O-V-E</div>
                            <div className="text-xs text-[#dfc194]">Nat King Cole &bull; Fernwood Grand Ballroom</div>
                          </div>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-lg text-xs italic text-[#dfc194] leading-relaxed">
                          "L is for the way you look at me &bull; O is for the only one I see &bull; V is very, very extraordinary &bull; E is even more than anyone that you adore..."
                        </div>
                      </div>

                      {/* Guest Requested Reception Tracks */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-[#15110e] uppercase tracking-wider">Top Reception Dance Tracks</div>
                        <div className="divide-y divide-[#f0ede4] text-xs">
                          {[
                            { song: "Can't Take My Eyes Off You", artist: 'Frankie Valli', requestedBy: 'Table 4 (The Wilsons)' },
                            { song: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', requestedBy: 'Head Table (Bridal Party)' },
                            { song: 'September', artist: 'Earth, Wind & Fire', requestedBy: 'Table 2 (University Friends)' },
                            { song: 'Dancing in the Moonlight', artist: 'Toploader', requestedBy: 'Table 6 (The Highlands Crew)' },
                          ].map((t, i) => (
                            <div key={i} className="py-2 flex items-center justify-between">
                              <div>
                                <strong className="text-[#15110e]">{t.song}</strong>
                                <span className="text-[#8b7b6b] ml-1.5">&bull; {t.artist}</span>
                              </div>
                              <span className="text-[11px] text-[#bd9661] font-semibold">{t.requestedBy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VOWS CONTENT */}
                  {selectedMemory.type === 'vows' && (
                    <div className="space-y-4">
                      <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center border-b border-[#ebd3a8] pb-1.5">
                          <strong className="font-serif text-base text-[#15110e]">Sophie's Vows to James</strong>
                          <span className="text-[10px] font-bold text-[#bd9661] uppercase">FERNWOOD LOWER MEADOW</span>
                        </div>
                        <p className="text-xs italic text-[#6b5849] leading-relaxed">
                          "James, from our very first rainy Sunday in Surry Hills to this golden afternoon in the Southern Highlands, you have been my greatest comfort, my deepest joy, and my truest home. I promise to always laugh with you through life's unexpected detours, dream with you under every night sky, and love you without reservation, today and for all the tomorrows to come."
                        </p>
                      </div>

                      <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center border-b border-[#ebd3a8] pb-1.5">
                          <strong className="font-serif text-base text-[#15110e]">James's Vows to Sophie</strong>
                          <span className="text-[10px] font-bold text-[#bd9661] uppercase">FERNWOOD LOWER MEADOW</span>
                        </div>
                        <p className="text-xs italic text-[#6b5849] leading-relaxed">
                          "Sophie, you bring a quiet grace, infectious laughter, and boundless warmth to every corner of my life. Standing before our families and dearest friends today, I promise to listen, to cherish, to protect our joy, and to walk beside you through every season ahead with an unwavering and loyal heart."
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TOASTS CONTENT */}
                  {selectedMemory.type === 'toasts' && (
                    <div className="space-y-3">
                      {[
                        { speaker: 'Chloe Mitchell', role: 'Maid of Honor', time: '6:45 PM', quote: 'To Sophie, my sister by heart since Kindergarten. Seeing you this radiant and loved by James brings tears of sheer gratitude.' },
                        { speaker: 'Liam Fletcher', role: 'Best Man', time: '7:00 PM', quote: 'James has always been the steadfast anchor in our crew, but Sophie is the compass that showed him where true happiness lives.' },
                        { speaker: 'Robert Evans', role: 'Father of the Bride', time: '7:15 PM', quote: 'Raising Sophie has been the great honor of my life. Handing her hand to a gentleman like James fills my heart with total peace.' },
                      ].map((t, idx) => (
                        <div key={idx} className="bg-[#faf8f5] border border-[#ebd3a8] rounded-xl p-3.5 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-[#15110e]">{t.speaker}</strong>
                              <span className="text-[#8b7b6b] ml-1.5">&bull; {t.role}</span>
                            </div>
                            <span className="text-[10px] text-[#bd9661] font-semibold">{t.time}</span>
                          </div>
                          <p className="text-xs italic text-[#6b5849] leading-relaxed">"{t.quote}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SEATING CONTENT */}
                  {selectedMemory.type === 'seating' && (
                    <div className="space-y-3">
                      <div className="text-xs text-[#8b7b6b]">Permanent archival record of the 127 seated guests across the Pavilion Ballroom:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#faf8f5] border border-[#bd9661] rounded-xl p-3 space-y-1">
                          <strong className="text-[#bd9661] uppercase text-[11px] block">HEAD TABLE (8 Guests)</strong>
                          <div className="text-[11.5px] text-[#15110e] space-y-0.5">
                            <div>1. Sophie (Bride) &bull; 2. James (Groom)</div>
                            <div>3. Hannah Martin &bull; 4. Oliver Vance</div>
                            <div>5. Charlotte Evans &bull; 6. Grace Turner</div>
                            <div>7. Liam Fletcher &bull; 8. Benjamin Ross</div>
                          </div>
                        </div>
                        <div className="bg-white border border-[#e8ded0] rounded-xl p-3 space-y-1">
                          <strong className="text-[#15110e] uppercase text-[11px] block">Table 1 · Highlands Suite (8/8)</strong>
                          <div className="text-[11px] text-[#6b5849]">The Whitfields, Sarah &amp; Michael Chen, Marcus Vance...</div>
                        </div>
                        <div className="bg-white border border-[#e8ded0] rounded-xl p-3 space-y-1">
                          <strong className="text-[#15110e] uppercase text-[11px] block">Table 2 · Pavilion Garden (6/8)</strong>
                          <div className="text-[11px] text-[#6b5849]">Aunty Carol, Uncle Peter, David Wilson...</div>
                        </div>
                        <div className="bg-white border border-[#e8ded0] rounded-xl p-3 space-y-1">
                          <strong className="text-[#15110e] uppercase text-[11px] block">Table 3 · Meadow Lawn (4/8)</strong>
                          <div className="text-[11px] text-[#6b5849]">Priya Sharma &amp; The Sharma Family Party...</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex justify-end pt-3 border-t border-[#e8ded0]">
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(null)}
                      className="bg-[#15110e] hover:bg-[#2b221a] text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                    >
                      Close Keepsake
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Time Capsule & Reflections Split matching Screenshot 31 & 32 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#15110e]">📝 Couple's 1st Year Time Capsule</h3>
                <p className="text-xs text-[#8b7b6b]">Handcrafted time capsule message written for opening on 14 November 2027:</p>
                <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#ebd3a8] text-xs italic text-[#6b5849] leading-relaxed">
                  "To our future selves on 14 November 2027: Remember the golden light through the pavilion windows..."
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#15110e]">🎉 1st Year Reflections</h3>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase">OUR REFLECTIONS ON YEAR ONE</label>
                <textarea
                  value={reflectionsInput}
                  onChange={(e) => setReflectionsInput(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => showToast('Anniversary reflections saved!', 'success')}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Save Reflection
                  </button>
                </div>
              </div>
            </div>

            {/* Guest Anniversary Wishes & Tributes matching Screenshot 32 */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#15110e]">💌 Guest Anniversary Wishes &amp; Tributes</h3>
                <span className="text-xs text-[#8b7b6b]">0 Guest Wishes</span>
              </div>
              <p className="text-xs text-[#8b7b6b]">Heartfelt anniversary toasts and blessings posted by guests from the celebration feed</p>
              <div className="text-center py-6 text-xs text-[#8b7b6b] italic bg-[#faf8f5] rounded-xl border border-dashed border-[#e8ded0] mt-3">
                No guest anniversary wishes received yet. When guests post anniversary love notes from the guest app, they will appear here!
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 10: VENUE & TRAVEL (Screenshot 33: 173018.png)                */}
        {/* ================================================================ */}
        {activeTab === 'venue' && (
          <section className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                LOCATION &amp; LOGISTICS
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Venue &amp; Travel
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Essential travel directions, parking facilities, shuttle schedules, and venue map for guests &amp; vendors
              </p>
            </div>

            {/* 2x2 Venue Details Grid matching Screenshot 33 (Synced with Venue Logistics in Settings) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Venue & Address */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Wedding Venue &amp; Address</h3>
                    <div className="text-xs text-[#8b7b6b]">Ceremony &amp; Reception Grounds</div>
                  </div>
                </div>
                <div className="text-xs text-[#15110e] leading-relaxed">
                  <strong>{weddingSettings.venueName || wedding.venue}</strong><br />
                  {weddingSettings.venueAddress || '124 Range Road, Mittagong NSW 2575'}<br />
                  Australia
                </div>
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebd3a8] text-xs text-[#6b5849] leading-relaxed space-y-1">
                  <div><strong>Ceremony:</strong> {weddingSettings.dateTime ? (weddingSettings.dateTime.split(' ')[1] || '2:00 PM') : '2:00 PM'} &bull; The Lower Meadow Lawns</div>
                  <div><strong>Cocktail Hour &amp; Reception:</strong> {weddingSettings.receptionTime || '5:00 PM'} &bull; The Grand Pavilion</div>
                  {weddingSettings.weatherContingency && (
                    <div className="pt-1 text-[#8c4b27] border-t border-[#ebd3a8]/60 mt-1">
                      <strong>Weather Contingency:</strong> {weddingSettings.weatherContingency}
                    </div>
                  )}
                  <div><strong>Venue Concierge:</strong> (02) 4871 2000 &bull; concierge@fernwoodestate.demo</div>
                </div>
              </div>

              {/* Card 2: Parking */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🅿️</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Guest Parking Facilities</h3>
                    <div className="text-xs text-[#8b7b6b]">On-Site Valet &amp; Dedicated Bays</div>
                  </div>
                </div>
                <p className="text-xs text-[#15110e] leading-relaxed">
                  {weddingSettings.parkingInstructions || "Complimentary on-site guest parking is available at the Main Lawn entrance. Follow directional signage upon arrival."}
                </p>
                {weddingSettings.valetInstructions && (
                  <p className="text-xs text-[#6b5849]">
                    <strong>Valet:</strong> {weddingSettings.valetInstructions}
                  </p>
                )}
                <ul className="text-xs text-[#6b5849] space-y-1 pl-4 list-disc">
                  <li><strong>120 dedicated sealed bays</strong> with illuminated pathways.</li>
                  <li><strong>Valet attendants:</strong> {weddingSettings.valetInstructions || "Stationed at the porte-cochère from 1:15 PM."}</li>
                  <li><strong>EV Charging:</strong> 4 Type-2 chargers available at North Parking.</li>
                  <li><strong>Overnight Parking:</strong> Permitted until 11:00 AM Sunday morning.</li>
                </ul>
              </div>

              {/* Card 3: Shuttles */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚌</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Transport &amp; Guest Shuttles</h3>
                    <div className="text-xs text-[#8b7b6b]">Scheduled Private Charter Transfers</div>
                  </div>
                </div>
                <p className="text-xs text-[#15110e] leading-relaxed">
                  {weddingSettings.shuttleSchedule || "Private express mini-coaches operate between key Southern Highlands hotels and Fernwood Estate:"}
                </p>
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ebd3a8] text-xs text-[#6b5849] space-y-1">
                  <strong>Guest Arrival Shuttles:</strong>
                  <div>&bull; {weddingSettings.shuttleSchedule || "1:15 PM from Bowral Grand Hotel (Station St Entrance)"}</div>
                </div>
              </div>

              {/* Card 4: Interactive Google Map */}
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661] flex items-center gap-1.5">
                      <span>LIVE NAVIGATION</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Interactive Google Map</h3>
                    <div className="text-[11px] text-[#8b7b6b]">Destination: {weddingSettings.venueName || wedding.venue}</div>
                  </div>
                  <a
                    href={getGoogleMapsNavUrl(weddingSettings.googleMapsUrl, weddingSettings.venueName || wedding.venue, weddingSettings.venueAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Open in Google Maps</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Map Graphic Container with Live Google Maps Iframe */}
                <div className="relative rounded-xl h-[260px] overflow-hidden border border-[#d5c7b5] shadow-inner bg-[#e5e3df] group">
                  <iframe
                    title="Interactive Venue Map"
                    src={getGoogleMapsEmbedUrl(weddingSettings.googleMapsUrl, weddingSettings.venueName || wedding.venue, weddingSettings.venueAddress)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  {/* Floating venue pin bar overlay matching design */}
                  <a
                    href={getGoogleMapsNavUrl(weddingSettings.googleMapsUrl, weddingSettings.venueName || wedding.venue, weddingSettings.venueAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-x-3 bottom-3 bg-[#15110e]/95 hover:bg-[#15110e] text-white p-3 rounded-xl backdrop-blur-md flex items-center justify-between transition-all shadow-xl border border-white/10 group-hover:inset-x-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-xs shadow-sm shrink-0">📍</span>
                      <div className="text-left min-w-0">
                        <strong className="text-xs block text-white truncate">{weddingSettings.venueName || wedding.venue}</strong>
                        <span className="text-[10px] text-[#c9bbae] truncate block">{weddingSettings.venueAddress || 'Mittagong NSW'} &bull; Click for live turn-by-turn navigation</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#bd9661] whitespace-nowrap ml-2 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Directions ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB 11: SETTINGS (Screenshot 34: 173029.png)                      */}
        {/* ================================================================ */}
        {activeTab === 'settings' && !isMcOrPlanner && (
          <section className="space-y-6 max-w-4xl">
            <div>
              <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1">
                CONFIGURATION
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#15110e]">
                Wedding Settings &amp; Preferences
              </h1>
              <p className="text-xs text-[#8b7b6b] mt-1">
                Customize your ceremony parameters, venue logistics, aesthetic themes, and guest digital hub feature toggles.
              </p>
            </div>

            {/* Section 1: Couple & Ceremony Details */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">💍</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Couple &amp; Ceremony Schedule</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PARTNER 1 FULL NAME</label>
                  <input
                    type="text"
                    value={weddingSettings.partner1}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, partner1: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">PARTNER 2 FULL NAME</label>
                  <input
                    type="text"
                    value={weddingSettings.partner2}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, partner2: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">WEDDING DATE &amp; TIME</label>
                  <input
                    type="text"
                    value={weddingSettings.dateTime}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, dateTime: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">RECEPTION TIME</label>
                  <input
                    type="text"
                    value={weddingSettings.receptionTime}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, receptionTime: e.target.value })}
                    placeholder="16:00"
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">OFFICIAL HASHTAG</label>
                  <input
                    type="text"
                    value={weddingSettings.weddingHashtag}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, weddingHashtag: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Venue, Valet & Weather */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">🏛️</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Venue Logistics &amp; Navigation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">VENUE NAME</label>
                  <input
                    type="text"
                    value={weddingSettings.venueName}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, venueName: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">FULL VENUE ADDRESS</label>
                  <input
                    type="text"
                    value={weddingSettings.venueAddress}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, venueAddress: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>

              {/* Google Maps Link / Location URL Input */}
              <div className="bg-[#faf7f2] border border-[#e8ded0] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8b7b6b] uppercase tracking-wider">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>GOOGLE MAPS LINK / LOCATION URL</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={weddingSettings.googleMapsUrl || ''}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, googleMapsUrl: e.target.value })}
                    placeholder="Paste Google Maps URL or address (e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=...)"
                    className="flex-1 bg-white border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      showToast('✓ Location link saved successfully!', 'success');
                    }}
                    className="px-5 py-2.5 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">GUEST PARKING INSTRUCTIONS</label>
                <textarea
                  value={weddingSettings.parkingInstructions}
                  onChange={(e) => setWeddingSettings({ ...weddingSettings, parkingInstructions: e.target.value })}
                  rows={2}
                  className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">SHUTTLE BUS SCHEDULE</label>
                  <input
                    type="text"
                    value={weddingSettings.shuttleSchedule}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, shuttleSchedule: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">WEATHER CONTINGENCY PLAN</label>
                  <input
                    type="text"
                    value={weddingSettings.weatherContingency}
                    onChange={(e) => setWeddingSettings({ ...weddingSettings, weatherContingency: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                  />
                </div>
              </div>
            </div>

            {/* Subsection: Invite MC & Wedding Planner (Visible if no MC selected during registration, hidden if selected) */}
            {(!wedding?.selectedMc || wedding.selectedMc.id === 'no_mc' || wedding.selectedMc.isPreferredOwn || isMcUnlinked) ? (
              <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎙️</span>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">
                      Invite MC / Wedding Planner
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#bd9661] uppercase tracking-wider bg-[#faf5ee] border border-[#ebd3a8] px-2.5 py-1 rounded-lg">
                    Host Collaboration
                  </span>
                </div>

                {hasRequestedMcInvite ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                      <span>✓</span>
                      <span>Invite Request Sent to Platform SuperAdmin</span>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      SuperAdmin has received your request and will dispatch the dedicated onboarding invite link to <strong>{inviteMcName}</strong> ({inviteMcEmail}).
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestMcInvite} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          MC / WEDDING PLANNER NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Anthony Rossi"
                          value={inviteMcName}
                          onChange={(e) => setInviteMcName(e.target.value)}
                          className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. anthony@rossihosting.com.au"
                          value={inviteMcEmail}
                          onChange={(e) => setInviteMcEmail(e.target.value)}
                          className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          PHONE NO *
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-[#e8ded0] bg-[#f5ede2] text-xs font-bold font-mono text-[#6b5847] rounded-l-xl select-none">
                            +61
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="0412 888 777"
                            value={inviteMcPhone}
                            onChange={(e) => setInviteMcPhone(e.target.value)}
                            className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-r-xl rounded-l-none p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                          COMPANY / BUSINESS NAME
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rossi Event Hosting &amp; Coordination"
                          value={inviteMcCompany}
                          onChange={(e) => setInviteMcCompany(e.target.value)}
                          className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-gradient-to-r from-[#dfc194] to-[#bd9661] text-[#15110e] font-bold rounded-xl text-xs shadow-xs hover:brightness-105 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>✉️</span>
                        <span>Request Invite</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}

            {/* Section 3: Aesthetics & Dress Code */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede4]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#15110e]">Aesthetic &amp; Dress Code</h3>
                    <div className="text-[11px] text-[#8b7b6b]">Colors, theme &amp; guest attire guidelines</div>
                  </div>
                </div>
                {/* Pencil icon button to open pop-up modal */}
                <button
                  type="button"
                  onClick={() => setIsDressCodeModalOpen(true)}
                  className="p-1.5 px-2.5 rounded-lg text-[#15110e] bg-[#fbf9f5] hover:bg-[#f0ebe1] border border-[#e8ded0] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
                  title="Add custom dress code theme"
                  aria-label="Add custom dress code theme"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#bd9661" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                  <span className="text-xs text-[#15110e] font-medium">Add Theme</span>
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1.5">WEDDING COLOR THEME</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {colorThemes.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setWeddingSettings({ ...weddingSettings, themeColor: pal.id })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        weddingSettings.themeColor === pal.id ? 'border-2 border-[#bd9661] shadow-xs ring-2 ring-[#bd9661]/20' : 'border-[#e8ded0]'
                      }`}
                      style={{ backgroundColor: pal.bg, color: pal.text }}
                    >
                      <div className="text-xs font-bold truncate">{pal.name}</div>
                      <div className="text-[10px] opacity-75 mt-0.5 truncate">{pal.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">GUEST DRESS CODE STATEMENT</label>
                <input
                  type="text"
                  value={weddingSettings.dressCode}
                  onChange={(e) => setWeddingSettings({ ...weddingSettings, dressCode: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
                />
              </div>
            </div>

            {/* Section 4: Bespoke Invitation Card Designer & 3D Unboxing (Coming Soon) */}
            <SuperAdminCardStudio mode="couple" isComingSoon={true} />

            {/* Section 4: Guest Digital Hub Feature Toggles */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#f0ede4]">
                <span className="text-lg">⚙️</span>
                <h3 className="font-serif text-base font-bold text-[#15110e]">Guest Hub Experience Toggles</h3>
              </div>

              <div className="divide-y divide-[#f0ede4]">
                {[
                  {
                    title: 'Digital Wishing Well & Gifting',
                    desc: 'Enable guests to send monetary wishing well gifts via credit card or Apple Pay directly from their mobile hub.',
                    key: 'enableDigitalGifts' as const,
                  },
                  {
                    title: 'Joey AI Wedding Assistant',
                    desc: 'Allow guests to ask questions about parking, dress code, their table seating, and request dietary updates via Joey.',
                    key: 'enableJoeyAI' as const,
                  },
                  {
                    title: 'Live Celebration Feed',
                    desc: 'Let guests share live photos, toasts, and notes during cocktail hour and reception with couple moderation.',
                    key: 'enableCelebrationFeed' as const,
                  },
                  {
                    title: 'Guest Song Requests',
                    desc: 'Allow guests to submit song requests for the DJ / MC directly inside their digital itinerary.',
                    key: 'enableSongRequests' as const,
                  },
                  {
                    title: 'Guest Tablemate Visibility',
                    desc: 'Allow guests to view their tablemates in their mobile guest hub. When disabled, guests only see their assigned table name & seat number while tablemates remain private.',
                    key: 'allowGuestsSeeTablemates' as const,
                  },
                  {
                    title: 'Secret Seating Plan Reveal',
                    desc: 'Keep table numbers hidden until the morning of the wedding (8:00 AM) to maintain seating excitement.',
                    key: 'hideSeatingUntilMorning' as const,
                  },
                ].map((toggleItem) => (
                  <div key={toggleItem.key} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs text-[#15110e] block">{toggleItem.title}</strong>
                      <span className="text-[11px] text-[#8b7b6b]">{toggleItem.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={Boolean(weddingSettings[toggleItem.key])}
                        onChange={(e) => setWeddingSettings({ ...weddingSettings, [toggleItem.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#e0d6c8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bd9661]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Data Export & Save */}
            <div className="bg-[#faf8f5] border border-[#ebd3a8] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <strong className="text-sm font-serif text-[#15110e] block">Ready to apply changes?</strong>
                <p className="text-xs text-[#8b7b6b]">All updates reflect immediately in the Guest Hub and Run Sheet.</p>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Exported guest list (127 guests) as CSV', 'info');
                  }}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  📥 Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (weddingSettings.venueName) {
                      wedding.venue = weddingSettings.venueName;
                    }
                    showToast('✓ Wedding configuration settings saved successfully!', 'success');
                  }}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB MC 1: RUN SHEET (Couples & Planner Day Sheet / MC Console)    */}
        {/* ================================================================ */}
        {activeTab === 'mc_runsheet' && (
          isPlannerView ? (
            <PlannerDaySheetSection
              wedding={wedding}
              onUpdateWedding={(updated) => {
                const updatedWeddings = (state.weddings || []).map(w => w.id === updated.id ? updated : w);
                setState({ ...state, weddings: updatedWeddings });
              }}
              onSelectView={onSelectView}
              roleMode="planner"
            />
          ) : isMcView || session?.role === 'mc' ? (
          <section className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>{isPlannerView || session?.role === 'planner' ? 'COORDINATION SUITE' : 'PRIVATE CONSOLE'}</span>
                  <span className="text-[#8b7b6b]">•</span>
                  <span className="text-[#15110e] font-semibold">{wedding.couple}</span>
                </div>
                {(() => {
                  const activeEvt = (wedding.events || []).find((e) => e.id === selectedRunSheetEventId);
                  if (!activeEvt) {
                    return (
                      <>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
                          {isPlannerView || session?.role === 'planner' ? 'Wedding Day Run Sheet' : 'Private Run Sheet'}
                        </h1>
                        <p className="text-xs text-[#8b7b6b] mt-1">
                          Saturday, {wedding.dateDisplay || wedding.date} &bull; {wedding.venue} &bull; {runSheet.length} Cue Entries
                        </p>
                      </>
                    );
                  }
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
                          {activeEvt.name} Run Sheet
                        </h1>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f4ece1] text-[#7a5933] border border-[#e4d6c4]">
                          {activeEvt.category || 'Celebration'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8b7b6b] mt-1">
                        {activeEvt.date} &bull; {activeEvt.time} &bull; {activeEvt.venue} &bull;{' '}
                        <strong className="text-[#15110e]">
                          {filteredCues.length} Cue Entries
                        </strong>
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowMcShareModal(true)}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Share or print read-only run sheet for vendors"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  <span>Share Vendor Copy</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenMcTemplateModal}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Import activities from standard wedding run sheet templates"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                  <span>Import Template</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg><span>Print Run Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCueEventId(selectedRunSheetEventId !== 'all' ? selectedRunSheetEventId : (wedding.events?.[0]?.id || ''));
                    setShowAddCueModal(true);
                  }}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Create Event Run Sheet</span>
                </button>
              </div>
            </div>

            {/* Event-Specific Run Sheet Tabs (Multi-Day Celebration Run Sheets) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#e8ded0]">
              <button
                type="button"
                onClick={() => setSelectedRunSheetEventId('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  selectedRunSheetEventId === 'all'
                    ? 'bg-[#15110e] text-[#dfc194] shadow-xs ring-1 ring-[#bd9661]'
                    : 'bg-white hover:bg-[#faf6f0] text-[#6b5847] border border-[#e8ded0]'
                }`}
              >
                <svg className="w-3.5 h-3.5 text-[#bd9661] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Master Wedding Day (All Events)</span>
              </button>
              {(wedding.events || []).map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedRunSheetEventId(evt.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRunSheetEventId === evt.id
                      ? 'bg-[#15110e] text-[#dfc194] shadow-xs ring-1 ring-[#bd9661]'
                      : 'bg-white hover:bg-[#faf6f0] text-[#6b5847] border border-[#e8ded0]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-current opacity-70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{evt.name}</span>
                </button>
              ))}
            </div>

            {/* Run Sheet KPI & Filter Bar */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="8"/>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      </span>
                    <input
                      type="text"
                      placeholder="Search cues & notes..."
                      value={runSheetSearch}
                      onChange={(e) => setRunSheetSearch(e.target.value)}
                      className="bg-[#faf8f5] border border-[#d5c7b5] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#15110e] placeholder-[#a09080] focus:outline-none focus:border-[#bd9661] w-48 sm:w-60"
                    />
                    {runSheetSearch && (
                      <button
                        onClick={() => setRunSheetSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8b7b6b] hover:text-[#15110e]"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={runSheetFilter}
                      onChange={(e) => setRunSheetFilter(e.target.value as 'all' | 'pending' | 'done')}
                      className="appearance-none bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] text-[#15110e] text-xs font-semibold rounded-xl pl-3 pr-7 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending Only</option>
                      <option value="done">Completed / Done</option>
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <div className="bg-[#faf6f0] border border-[#ebd3a8] px-3.5 py-1.5 rounded-xl font-medium text-[#15110e]">
                    <span className="font-bold text-[#bd9661]">{runSheet.filter(c => c.done).length}</span> / {runSheet.length} Completed
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCueEventId(selectedRunSheetEventId !== 'all' ? selectedRunSheetEventId : (wedding.events?.[0]?.id || ''));
                      setShowAddCueModal(true);
                    }}
                    className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Add Activity</span>
                  </button>
                </div>
              </div>

              {/* Cue Entries List */}
              <div className="space-y-3 pt-2">
                {filteredCues.length === 0 ? (
                  <div className="text-center py-10 bg-[#fdfbf8] rounded-xl border border-dashed border-[#d5c7b5]">
                    <div className="text-3xl mb-2">📋</div>
                    <div className="text-sm font-bold text-[#15110e]">No cue schedule entries found</div>
                    <div className="text-xs text-[#8b7b6b] mt-1">Try adjusting your search filter or click "+ Add Cue Entry"</div>
                  </div>
                ) : (
                  filteredCues.map((cue, idx) => (
                    <div
                      key={cue.id}
                      className={`border rounded-xl p-4 transition-all ${
                        'bg-[#faf8f5] border-[#ebd8c3] shadow-xs ' + (cue.done ? 'opacity-80' : '')
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <input
                          type="checkbox"
                          checked={cue.done}
                          onChange={() => handleToggleCueDone(cue.id)}
                          className="mt-1.5 w-4 h-4 rounded text-[#bd9661] cursor-pointer accent-[#bd9661]"
                        />

                        <div className="flex-1 space-y-2.5">
                          {/* Row 1: Time, Activity, Controls */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold bg-[#15110e] text-[#dfc194] px-2 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={cue.time}
                              onChange={(e) => handleUpdateCueField(cue.id, 'time', e.target.value)}
                              className="w-24 text-xs font-bold font-mono bg-white border border-[#d4c5b3] rounded-lg px-2.5 py-1 text-[#15110e] text-center"
                              title="Cue Time"
                            />
                            <input
                              type="text"
                              value={cue.activity}
                              onChange={(e) => handleUpdateCueField(cue.id, 'activity', e.target.value)}
                              className={`flex-1 min-w-[200px] text-sm font-bold bg-white border border-[#d4c5b3] rounded-lg px-3 py-1 text-[#15110e] ${
                                cue.done ? 'line-through text-[#8b7b6b]' : ''
                              }`}
                              placeholder="Cue Activity Title"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveCue(idx, -1)}
                                disabled={idx === 0}
                                className="bg-white border border-[#d5c7b5] hover:bg-[#f0ede6] text-[#15110e] text-xs font-bold px-2 py-1 rounded cursor-pointer disabled:opacity-30"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveCue(idx, 1)}
                                disabled={idx === runSheet.length - 1}
                                className="bg-white border border-[#d5c7b5] hover:bg-[#f0ede6] text-[#15110e] text-xs font-bold px-2 py-1 rounded cursor-pointer disabled:opacity-30"
                                title="Move Down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCue(cue.id)}
                                className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded cursor-pointer"
                                title="Delete Cue"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Public Notes */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-[#8b7b6b] mb-1">
                              Public Schedule Announcement / Housekeeping Notes
                            </label>
                            <input
                              type="text"
                              value={cue.notes || ''}
                              onChange={(e) => handleUpdateCueField(cue.id, 'notes', e.target.value)}
                              className="w-full text-xs bg-white border border-[#d4c5b3] rounded-lg px-3 py-1.5 text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                              placeholder="Announcements for guests, bridal party cues..."
                            />
                          </div>

                          {/* Row 3: Private MC Stage & Audio Directions */}
                          <div className="bg-[#fff8ee] border border-[#ebd4b8] rounded-xl p-3 space-y-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                              <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Private Cue &amp; Stage Direction</span>
                            </span>
                            <input
                              type="text"
                              value={cue.privateNotes || ''}
                              onChange={(e) => handleUpdateCueField(cue.id, 'privateNotes', e.target.value)}
                              className="w-full text-xs bg-transparent border-0 border-b border-[#e3d4bf] text-[#453423] font-medium px-1 py-1 focus:outline-none focus:border-[#bd9661]"
                              placeholder="Private cues, technical sound directions, mic handoffs..."
                            />
                          </div>

                          {/* Planner Change Request Alert & Actions for MC */}
                          {cue.changeRequest && cue.changeRequest.status === 'pending' && (
                            <div className="bg-[#fff9ed] border-2 border-[#e6a840] rounded-xl p-3.5 space-y-2 mt-2 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#936319] flex items-center gap-1.5">
                                  <span>💬</span>
                                  <span>Schedule Change Requested by Wedding Planner</span>
                                </span>
                                <span className="text-[10px] font-semibold text-[#8b7b6b]">
                                  Requested at {cue.changeRequest.requestedAt}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs flex-wrap">
                                <div>
                                  <span className="text-[#8b7b6b] text-[10.5px]">Proposed Time: </span>
                                  <strong className="font-mono bg-[#15110e] text-[#dfc194] px-2 py-0.5 rounded text-xs">
                                    {cue.changeRequest.proposedTime}
                                  </strong>
                                  <span className="text-[10.5px] text-[#8b7b6b] line-through ml-1.5">{cue.time}</span>
                                </div>
                                {cue.changeRequest.proposedActivity && cue.changeRequest.proposedActivity !== cue.activity && (
                                  <div>
                                    <span className="text-[#8b7b6b] text-[10.5px]">Proposed Title: </span>
                                    <strong className="text-[#15110e]">{cue.changeRequest.proposedActivity}</strong>
                                  </div>
                                )}
                              </div>
                              {cue.changeRequest.notes && (
                                <p className="text-xs text-[#523d24] bg-white/80 p-2 rounded-lg border border-[#ebd8bc] italic">
                                  "{cue.changeRequest.notes}"
                                </p>
                              )}
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeclineChangeRequest(cue.id)}
                                  className="px-3 py-1.5 bg-white border border-[#d5c7b5] hover:bg-[#faf7f2] text-rose-700 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                                >
                                  ✕ Decline
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAcceptChangeRequest(cue.id)}
                                  className="px-3.5 py-1.5 bg-[#15110e] hover:bg-[#251e18] text-[#dfc194] font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-xs"
                                >
                                  ✓ Accept Change
                                </button>
                              </div>
                            </div>
                          )}
                          {cue.changeRequest && cue.changeRequest.status === 'accepted' && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1e6f47] bg-[#eefaf3] border border-[#a2dfbe] px-2.5 py-1 rounded-lg mt-1 w-fit">
                              <span>✓</span>
                              <span>Planner change accepted ({cue.changeRequest.proposedTime})</span>
                            </div>
                          )}
                          {cue.changeRequest && cue.changeRequest.status === 'declined' && (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg mt-1 w-fit">
                              <span>✕</span>
                              <span>Planner change declined (Original time kept)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Cue Modal */}
            {showAddCueModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white border border-[#bd9661] rounded-2xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] my-auto flex flex-col shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#e8ded0] pb-3">
                    <h3 className="font-serif text-xl font-bold text-[#15110e]">
                      Add Schedule Cue Entry
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddCueModal(false)}
                      className="text-[#8b7b6b] hover:text-[#15110e] text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddCue} className="space-y-4">
                    {/* Celebration Event Selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#15110e] mb-1">Celebration Event *</label>
                      <select
                        value={cueEventId}
                        onChange={(e) => setCueEventId(e.target.value)}
                        className="w-full text-xs font-semibold bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-[#15110e] outline-none"
                      >
                        <option value="">Master Wedding Day (All Events)</option>
                        {(wedding.events || []).map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} ({e.date} • {e.time})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#15110e] mb-1">Time (24h)</label>
                        <input
                          type="text"
                          required
                          value={cueTime}
                          onChange={(e) => setCueTime(e.target.value)}
                          className="w-full text-xs font-mono font-bold bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-[#15110e]"
                          placeholder="17:00"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-[#15110e] mb-1">Cue Activity Title</label>
                        <input
                          type="text"
                          required
                          value={cueActivity}
                          onChange={(e) => setCueActivity(e.target.value)}
                          className="w-full text-xs font-bold bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-[#15110e]"
                          placeholder="e.g. Speeches &amp; Champagne Toast"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#15110e] mb-1">Public Schedule Notes</label>
                      <input
                        type="text"
                        value={cueNotes}
                        onChange={(e) => setCueNotes(e.target.value)}
                        className="w-full text-xs bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-2 text-[#15110e]"
                        placeholder="Housekeeping notes or announcements..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#bd9661] uppercase tracking-wider mb-1">
                        🔒 Private Notes &amp; Tech Cues
                      </label>
                      <textarea
                        rows={3}
                        value={cuePrivateNotes}
                        onChange={(e) => setCuePrivateNotes(e.target.value)}
                        className="w-full text-xs bg-[#fff8ee] border border-[#ebd4b8] rounded-xl p-3 text-[#453423]"
                        placeholder="Sound instructions, lighting cues, special speaker directions..."
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e8ded0]">
                      <button
                        type="button"
                        onClick={() => setShowAddCueModal(false)}
                        className="btn btn-outline btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-gold btn-sm"
                      >
                        Save Cue to Schedule
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MC Standard Template Import Modal */}
            {showMcTemplateModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white border border-[#bd9661] rounded-2xl max-w-3xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                        STANDARD RUN SHEET TEMPLATES
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#15110e]">
                        Import Run Sheet Template
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMcTemplateModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {STANDARD_RUN_SHEET_TEMPLATES.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            setSelectedMcTemplateId(tmpl.id);
                            setMcTemplateRows(tmpl.items.map(i => ({ ...i, selected: true })));
                          }}
                          className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                            selectedMcTemplateId === tmpl.id
                              ? 'bg-[#faf6ee] border-[#bd9661] ring-2 ring-[#bd9661]/30 shadow-xs'
                              : 'bg-white border-[#e0d4c3] hover:border-[#bd9661]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-bold text-xs text-[#15110e] truncate">{tmpl.name}</span>
                            <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#ebdcc9] text-[#715433]">{tmpl.badge}</span>
                          </div>
                          <p className="text-[10.5px] text-[#7a6a59] line-clamp-2 leading-tight">{tmpl.subtitle}</p>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#faf7f2] border border-[#e8ded0] rounded-xl flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#15110e]">Mode:</span>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="mcTemplateImportMode"
                            checked={mcTemplateImportMode === 'replace'}
                            onChange={() => setMcTemplateImportMode('replace')}
                            className="accent-[#bd9661]"
                          />
                          <span>Replace existing cues</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs ml-2">
                          <input
                            type="radio"
                            name="mcTemplateImportMode"
                            checked={mcTemplateImportMode === 'append'}
                            onChange={() => setMcTemplateImportMode('append')}
                            className="accent-[#bd9661]"
                          />
                          <span>Append to current run sheet</span>
                        </label>
                      </div>
                      <span className="text-[11px] text-[#8b7b6b]">{mcTemplateRows.filter(r => r.selected).length} selected</span>
                    </div>

                    <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#faf8f5] border-b border-[#e8ded0] text-[#7d6c5b] sticky top-0">
                          <tr>
                            <th className="p-2 w-8 text-center">
                              <input
                                type="checkbox"
                                checked={mcTemplateRows.length > 0 && mcTemplateRows.every(r => r.selected)}
                                onChange={(e) => {
                                  const c = e.target.checked;
                                  setMcTemplateRows(prev => prev.map(r => ({ ...r, selected: c })));
                                }}
                                className="accent-[#bd9661]"
                              />
                            </th>
                            <th className="p-2 w-20">Time</th>
                            <th className="p-2">Activity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ebdcc9]/60">
                          {mcTemplateRows.map((row, idx) => (
                            <tr key={idx} className={row.selected ? 'bg-white' : 'bg-[#f7f4ee]/70 opacity-60'}>
                              <td className="p-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={row.selected}
                                  onChange={(e) => {
                                    const c = e.target.checked;
                                    setMcTemplateRows(prev => prev.map((r, i) => i === idx ? { ...r, selected: c } : r));
                                  }}
                                  className="accent-[#bd9661]"
                                />
                              </td>
                              <td className="p-2 font-mono font-bold">{row.time}</td>
                              <td className="p-2 font-semibold text-[#15110e]">{row.activity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-end gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowMcTemplateModal(false)}
                      className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyMcTemplate}
                      className="px-5 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Apply &amp; Save ({mcTemplateRows.filter(r => r.selected).length}) &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MC Cheers AI Chatbot with Natural Chat & File Upload */}
            <CheersAiRunSheetChatbot
              isOpen={showMcAiModal}
              onClose={() => setShowMcAiModal(false)}
              onApply={handleApplyMcAiChatbotItems}
              title="Cheers AI • MC Run Sheet & Cues Assistant"
              context="mc"
            />

            {/* MC Share Vendor Copy Modal */}
            {showMcShareModal && (
              <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white border border-[#bd9661] rounded-2xl max-w-2xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                        EXTERNAL VENDOR ACCESS
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#15110e]">
                        Share Vendor Master Schedule
                      </h3>
                      <p className="text-xs text-[#8b7b6b] mt-0.5">
                        Clean read-only copy for suppliers. Private MC stage directions are excluded.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMcShareModal(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto space-y-4 text-xs">
                    <div className="p-3.5 bg-[#faf7f2] border border-[#e8dfd1] rounded-xl space-y-2">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                        Shareable Read-Only Link
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`https://taptoast.app/schedule/${wedding.id || 'w1'}/vendor-access?token=vlive_2026`}
                          className="flex-1 bg-white border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs font-mono text-[#15110e] outline-none select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://taptoast.app/schedule/${wedding.id || 'w1'}/vendor-access?token=vlive_2026`);
                            setMcShareCopied(true);
                            showToast('Link copied to clipboard', 'success');
                            setTimeout(() => setMcShareCopied(false), 2000);
                          }}
                          className="px-4 py-2 bg-[#15110e] hover:bg-[#28201a] text-[#dfc194] rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                        >
                          {mcShareCopied ? '✓ Copied' : 'Copy Link'}
                        </button>
                      </div>
                    </div>

                    <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                      <div className="bg-[#faf8f5] p-2.5 font-bold text-[11px] text-[#7d6c5b] border-b border-[#e8ded0]">
                        Schedule Preview ({runSheet.length} entries)
                      </div>
                      <div className="divide-y divide-[#ebdcc9]/50">
                        {runSheet.map((item) => (
                          <div key={item.id} className="p-3 bg-white flex items-start gap-3">
                            <span className="font-mono text-xs font-bold bg-[#15110e] text-[#dfc194] px-2 py-0.5 rounded shrink-0">
                              {item.time}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs text-[#15110e]">{item.activity}</div>
                              {item.notes && <p className="text-[11px] text-[#6b5847] mt-0.5">{item.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-between gap-2.5 shrink-0">
                    <span className="text-[11px] text-[#8b7b6b]">Clean printable format excluding stage directions.</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMcShareModal(false)}
                        className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-[#15110e] text-[#dfc194] rounded-xl font-bold cursor-pointer"
                      >
                        Print Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          ) : (
            <PlannerDaySheetSection
              wedding={wedding}
              onUpdateWedding={(updated) => {
                const updatedWeddings = (state.weddings || []).map(w => w.id === updated.id ? updated : w);
                setState({ ...state, weddings: updatedWeddings });
              }}
              onSelectView={onSelectView}
              roleMode="couple"
            />
          )
        )}

        {/* ================================================================ */}
        {/* TAB MC 2: GUEST & CATERING SUMMARY                               */}
        {/* ================================================================ */}
        {activeTab === 'mc_catering' && (
          <section className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1 flex items-center gap-2">
                  <span>🍽️ CATERING &amp; HOSPITALITY SUMMARY</span>
                  <span className="text-[#8b7b6b]">•</span>
                  <span className="text-[#15110e] font-semibold">{wedding.couple}</span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
                  Guest &amp; Catering Summary
                </h1>
                <p className="text-xs text-[#8b7b6b] mt-1">
                  Full dietary requirements breakdown, meal covers, and table roster for banquet staff &amp; event hosts
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <span>🖨️</span> Print Catering Sheet
                </button>
              </div>
            </div>

            {/* 5 Dietary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-[#bd9661] rounded-xl p-4 shadow-xs">
                <div className="text-xs uppercase text-[#8b7b6b] font-bold">Total Confirmed Covers</div>
                <div className="font-serif text-3xl font-bold text-[#15110e] mt-1">
                  {confirmedGuests.length}
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                  Across {weddingTables.length} tables
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-emerald-600 rounded-xl p-4 shadow-xs">
                <div className="text-xs uppercase text-emerald-800 font-bold">Vegetarian Meals</div>
                <div className="font-serif text-3xl font-bold text-emerald-700 mt-1">
                  {vegCount}
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                  Plant-based &amp; lacto-ovo
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-teal-600 rounded-xl p-4 shadow-xs">
                <div className="text-xs uppercase text-teal-800 font-bold">Vegan Meals</div>
                <div className="font-serif text-3xl font-bold text-teal-700 mt-1">
                  {veganCount}
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                  Strictly plant-based
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-amber-600 rounded-xl p-4 shadow-xs">
                <div className="text-xs uppercase text-amber-800 font-bold">Gluten-Free (Celiac)</div>
                <div className="font-serif text-3xl font-bold text-amber-700 mt-1">
                  {gfCount}
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                  Separate preparation
                </div>
              </div>

              <div className="bg-white border border-[#e8ded0] border-t-[3px] border-t-rose-600 rounded-xl p-4 shadow-xs col-span-2 sm:col-span-1">
                <div className="text-xs uppercase text-rose-800 font-bold">Nut Allergies &amp; Other</div>
                <div className="font-serif text-3xl font-bold text-rose-700 mt-1">
                  {nutCount + otherDietCount}
                </div>
                <div className="text-[11px] text-[#8b7b6b] mt-0.5">
                  High-alert kitchen flag
                </div>
              </div>
            </div>

            {/* Table-by-Table Catering Summary */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#15110e]">
                    Table-by-Table Catering Breakdown
                  </h2>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">
                    Banquet service guide: special dietary requirements assigned to each ballroom table.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#bd9661] bg-[#faf6f0] border border-[#ebd3a8] px-3 py-1 rounded-full">
                  {weddingTables.length} Ballroom Tables
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {weddingTables.map((tbl) => {
                  const seatedGuests = confirmedGuests.filter(g => g.tableId === tbl.id);
                  const specialGuests = seatedGuests.filter(g => {
                    const d = (g.dietary || '').toLowerCase().trim();
                    return d !== '' && d !== 'none' && d !== 'no';
                  });

                  return (
                    <div
                      key={tbl.id}
                      className="border border-[#e8ded0] rounded-xl p-4 bg-[#fdfbf8] space-y-2 hover:border-[#bd9661] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-serif font-bold text-[#15110e]">
                          {tbl.name} {tbl.isHead ? '👑' : ''}
                        </strong>
                        <span className="text-[11px] font-bold text-[#8b7b6b] bg-white border border-[#e8ded0] px-2 py-0.5 rounded">
                          {seatedGuests.length} / {tbl.capacity} Seated
                        </span>
                      </div>

                      {specialGuests.length === 0 ? (
                        <div className="text-[11px] text-emerald-700 font-medium bg-emerald-50/60 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                          <span>✓</span> Standard estate menu (No special dietaries)
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                            Special Drops ({specialGuests.length}):
                          </div>
                          {specialGuests.map(sg => (
                            <div
                              key={sg.id}
                              className="text-xs bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2"
                            >
                              <span className="font-semibold text-[#15110e]">{sg.name}</span>
                              <DietaryBadges dietary={sg.dietary} size="xs" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comprehensive Dietary Guest Roster */}
            <div className="bg-white border border-[#e8ded0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#15110e]">
                    Confirmed Guest Dietary Roster
                  </h2>
                  <p className="text-xs text-[#8b7b6b] mt-0.5">
                    Showing {filteredCateringGuests.length} of {confirmedGuests.length} confirmed guests
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search guest or dietary..."
                    value={cateringSearch}
                    onChange={(e) => setCateringSearch(e.target.value)}
                    className="bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3.5 py-1.5 text-xs text-[#15110e] placeholder-[#a09080] focus:outline-none focus:border-[#bd9661] w-48 md:w-56"
                  />

                  <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-xl border border-[#e8ded0] flex-wrap">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'special', label: 'Dietaries Only' },
                      { id: 'vegetarian', label: 'Vegetarian' },
                      { id: 'gluten', label: 'Gluten-Free' },
                      { id: 'vegan', label: 'Vegan' },
                      { id: 'nut', label: 'Nut Allergy' },
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCateringDietFilter(f.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          cateringDietFilter === f.id
                            ? 'bg-[#15110e] text-[#dfc194]'
                            : 'text-[#8b7b6b] hover:text-[#15110e]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#e8ded0] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] text-[#8b7b6b] font-bold uppercase tracking-wider border-b border-[#e8ded0]">
                    <tr>
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">Table Assignment</th>
                      <th className="p-3">Seat #</th>
                      <th className="p-3">Household / Plus-One</th>
                      <th className="p-3">Dietary Requirements</th>
                      <th className="p-3">Catering Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {filteredCateringGuests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#8b7b6b]">
                          No guests match the selected dietary criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCateringGuests.map(g => {
                        const table = weddingTables.find(t => t.id === g.tableId);
                        const hasSpecialDiet = g.dietary && g.dietary.toLowerCase() !== 'none' && g.dietary.toLowerCase() !== 'no';

                        return (
                          <tr key={g.id} className="hover:bg-[#fdfbf8] transition-colors">
                            <td className="p-3 font-semibold text-[#15110e]">
                              {g.name}
                            </td>
                            <td className="p-3">
                              {table ? (
                                <span className="bg-[#faf6f0] border border-[#ebd3a8] text-[#15110e] font-medium px-2 py-0.5 rounded">
                                  {table.name} {table.isHead ? '👑' : ''}
                                </span>
                              ) : (
                                <span className="text-[#8b7b6b] italic">Unassigned</span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-[#8b7b6b]">
                              {g.seatIndex != null ? `Seat ${g.seatIndex + 1}` : '—'}
                            </td>
                            <td className="p-3 text-[#8b7b6b]">
                              {g.household || 'Individual'}
                            </td>
                            <td className="p-3">
                              {hasSpecialDiet ? (
                                <DietaryBadges dietary={g.dietary} size="sm" />
                              ) : (
                                <span className="text-emerald-700 font-medium text-xs">Standard</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px]">
                                Confirmed Cover
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* TAB PLANNER: WEDDING CONCIERGE DIRECTORY                          */}
        {/* ================================================================ */}
        {activeTab === 'vendors' && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <VendorDirectorySection
              wedding={wedding}
              onUpdateWeddingVendors={handleUpdateWeddingVendors}
              onUpdateWedding={(updated) => {
                const updatedWeddings = (state.weddings || []).map(w => w.id === updated.id ? updated : w);
                setState({ ...state, weddings: updatedWeddings });
              }}
              readOnly={true}
            />
          </section>
        )}

      </div>
      </main>

      {/* Modal: Add Custom Dress Code & Theme with Image 5 Color Picker */}
      {isDressCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#15110e]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#ebd3a8] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ede4]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#15110e]">Add New Dress Code Theme</h3>
                  <p className="text-[11px] text-[#8b7b6b]">Custom wedding palette &amp; guest attire styling</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDressCodeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f8f6f0] hover:bg-[#ede7d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Input 1: Theme Name (e.g. burgundy merlot) */}
            <div>
              <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                THEME NAME (E.G. BURGUNDY MERLOT)
              </label>
              <input
                type="text"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="e.g. Burgundy Merlot"
                className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />
            </div>

            {/* Input 2: Subtitle / Description (e.g. rich wine and gold) */}
            <div>
              <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">
                SUBTITLE / DESCRIPTION (E.G. RICH WINE AND GOLD)
              </label>
              <input
                type="text"
                value={newThemeSub}
                onChange={(e) => setNewThemeSub(e.target.value)}
                placeholder="e.g. Rich Wine & Gold"
                className="w-full bg-[#fdfbf7] border border-[#e8ded0] rounded-xl p-2.5 text-xs text-[#15110e] outline-none focus:border-[#bd9661]"
              />
            </div>

            {/* Color Picker: 2D Hue/Saturation spectrum & vertical Lightness slider (Image 5) */}
            <div>
              <label className="block text-[10px] font-bold text-[#8b7b6b] uppercase mb-1.5">
                PALETTE COLOR PICKER
              </label>
              <ColorPicker2D color={newThemeColor} onChange={setNewThemeColor} />
            </div>

            {/* Live Card Preview */}
            <div>
              <div className="text-[10px] font-bold text-[#8b7b6b] uppercase mb-1">SWATCH PREVIEW</div>
              <div
                className="p-3 rounded-xl border border-[#bd9661] shadow-xs text-left"
                style={{
                  backgroundColor: newThemeColor,
                  color: '#ffffff',
                }}
              >
                <div className="text-xs font-bold">{newThemeName || 'Untitled Theme'}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{newThemeSub || 'Custom Theme'}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0ede4]">
              <button
                type="button"
                onClick={() => setIsDressCodeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b7b6b] hover:bg-[#f5f1e8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newThemeName.trim()) {
                    showToast('Please enter a theme name', 'error');
                    return;
                  }
                  const newId = 'theme_' + Date.now();
                  const newThemeObj = {
                    id: newId,
                    name: newThemeName.trim(),
                    sub: newThemeSub.trim() || 'Custom Palette',
                    bg: newThemeColor,
                    text: '#ffffff',
                  };
                  setColorThemes((prev) => [...prev, newThemeObj]);
                  setWeddingSettings((prev) => ({ ...prev, themeColor: newId }));
                  setIsDressCodeModalOpen(false);
                  showToast(`✓ Added "${newThemeObj.name}" to wedding color themes!`, 'success');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] cursor-pointer shadow-sm transition-colors"
              >
                Add Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Joey AI Chatbot Concierge for Couple Dashboard (All tabs EXCEPT seating) */}
      {activeTab !== 'seating' && <JoeyChatbot context="couple" />}
    </div>
  );
}
