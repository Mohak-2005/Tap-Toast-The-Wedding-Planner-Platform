import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Wedding, PrivateRunSheetItem, RunSheetChangeRequest } from '../lib/types';
import { showToast, logAudit, useAppState } from '../lib/state';
import { STANDARD_RUN_SHEET_TEMPLATES, generateAiRunSheetDraft, parseRawRunSheetText } from '../lib/runSheetTemplates';
import { CheersAiRunSheetChatbot } from './CheersAiRunSheetChatbot';
import * as XLSX from 'xlsx';

interface PlannerDaySheetSectionProps {
  wedding: Wedding;
  onUpdateWedding: (updatedWedding: Wedding) => void;
  onSelectView?: (view: string) => void;
  roleMode?: 'planner' | 'couple';
}

type SectionKey = 'morning' | 'afternoon' | 'evening';

interface CombinedCueItem extends PrivateRunSheetItem {
  isMcCue: boolean;
  computedSection: SectionKey;
}

// =========================================================================
// Clean, Professional SVG Icons Matching UI
// =========================================================================

const IconPrinter = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconFileSpreadsheet = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const IconMorning = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v4M4.93 10.93l2.83 2.83M19.07 10.93l-2.83 2.83M2 18h20M20 18a8 8 0 0 0-16 0" />
  </svg>
);

const IconAfternoon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const IconEvening = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const IconMicrophone = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
  </svg>
);

const IconClipboard = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconPencil = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


const IconShare = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconTemplate = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const IconSparkles = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

const IconMessage = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Category specific clean SVG icon
const CategoryIcon = ({ category }: { category?: string }) => {
  switch (category) {
    case 'setup':
      return (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'vendor':
      return (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'ceremony':
      return (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
        </svg>
      );
    case 'reception':
      return (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 22h8M12 11v11M19 3l-7 8-7-8h14z" />
        </svg>
      );
    case 'packdown':
      return (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};

export default function PlannerDaySheetSection({
  wedding,
  onUpdateWedding,
  onSelectView,
  roleMode = 'planner',
}: PlannerDaySheetSectionProps) {
  const { state, setState } = useAppState();

  // Export dropdown state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Filters (no parentheses)
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [timeSectionFilter, setTimeSectionFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [streamFilter, setStreamFilter] = useState<'all' | 'mc_only' | 'planner_only'>('all');
  const [daySheetFilter, setDaySheetFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [daySheetSearch, setDaySheetSearch] = useState('');

  // Inline editing title id
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Collapsible Sections State (default all expanded)
  const [collapsedSections, setCollapsedSections] = useState<Record<SectionKey, boolean>>({
    morning: false,
    afternoon: false,
    evening: false,
  });

  // Modal State for Adding Activity
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivityEventId, setNewActivityEventId] = useState<string>('');
  const [newTime, setNewTime] = useState('09:00');
  const [newActivity, setNewActivity] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPrivateNotes, setNewPrivateNotes] = useState('');
  const [newSection, setNewSection] = useState<SectionKey>('morning');
  const [newCategory, setNewCategory] = useState<'mc' | 'vendor' | 'ceremony' | 'setup' | 'reception' | 'packdown'>('setup');
  const [newVendorRole, setNewVendorRole] = useState('Hire & Styling');
  const [isNewMcCue, setIsNewMcCue] = useState(false);

  // --- 1. Change Request Flow (Planner requests change on MC cue, MC accepts/declines) ---
  const [changeRequestTarget, setChangeRequestTarget] = useState<CombinedCueItem | null>(null);
  const [changeProposedTime, setChangeProposedTime] = useState('');
  const [changeProposedActivity, setChangeProposedActivity] = useState('');
  const [changeProposedNotes, setChangeProposedNotes] = useState('');

  const handleOpenChangeRequestModal = (item: CombinedCueItem) => {
    setChangeRequestTarget(item);
    setChangeProposedTime(item.time);
    setChangeProposedActivity(item.activity);
    setChangeProposedNotes(item.changeRequest?.notes || '');
  };

  const handleSubmitChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeRequestTarget) return;

    const cr: RunSheetChangeRequest = {
      id: 'cr_' + Date.now(),
      proposedTime: changeProposedTime.trim() || changeRequestTarget.time,
      proposedActivity: changeProposedActivity.trim() || changeRequestTarget.activity,
      notes: changeProposedNotes.trim(),
      status: 'pending',
      requestedBy: 'Planner',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMcSheet = (wedding.privateRunSheet || []).map((c) =>
      c.id === changeRequestTarget.id ? { ...c, changeRequest: cr } : c
    );
    const nextWedding = { ...wedding, privateRunSheet: updatedMcSheet };
    onUpdateWedding(nextWedding);
    logAudit(
      state,
      setState,
      'MC Cue Change Requested',
      'Wedding Planner',
      'planner',
      `Requested schedule change on MC cue "${changeRequestTarget.activity}": proposed ${cr.proposedTime} ("${cr.notes}")`,
      'Day Sheet'
    );
    showToast('Change request sent to MC for review', 'success');
    setChangeRequestTarget(null);
  };

  const handleCancelChangeRequest = (item: CombinedCueItem) => {
    const updatedMcSheet = (wedding.privateRunSheet || []).map((c) => {
      if (c.id === item.id) {
        const { changeRequest, ...rest } = c;
        return rest;
      }
      return c;
    });
    onUpdateWedding({ ...wedding, privateRunSheet: updatedMcSheet });
    showToast('Change request cancelled', 'info');
  };

  // --- 2. Standard Run Sheet Template Library ---
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic-vineyard');
  const [templateImportMode, setTemplateImportMode] = useState<'replace' | 'append'>('replace');
  const [templateRows, setTemplateRows] = useState<Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'> & { selected: boolean }>>([]);

  const handleOpenTemplateModal = () => {
    const defaultTpl = STANDARD_RUN_SHEET_TEMPLATES[0];
    setSelectedTemplateId(defaultTpl.id);
    setTemplateRows(defaultTpl.items.map((i) => ({ ...i, selected: true })));
    setShowTemplateModal(true);
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = STANDARD_RUN_SHEET_TEMPLATES.find((t) => t.id === id);
    if (tmpl) {
      setTemplateRows(tmpl.items.map((i) => ({ ...i, selected: true })));
    }
  };

  const handleApplyTemplate = () => {
    const selectedItems = templateRows.filter((r) => r.selected);
    if (selectedItems.length === 0) {
      showToast('Please select at least one activity to import', 'error');
      return;
    }

    const newCues: PrivateRunSheetItem[] = selectedItems.map((item, idx) => ({
      id: 'pds_tpl_' + Date.now() + '_' + idx,
      time: item.time,
      activity: item.activity,
      notes: item.notes || '',
      privateNotes: item.privateNotes || '',
      done: false,
      order: idx + 1,
      section: item.section || getTimeSection(item.time),
      category: item.category as any,
      vendorRole: item.vendorRole || 'Coordinator / Vendor',
    }));

    let updatedPlannerSheet: PrivateRunSheetItem[];
    if (templateImportMode === 'replace') {
      updatedPlannerSheet = newCues;
    } else {
      updatedPlannerSheet = [...(wedding.plannerDaySheet || []), ...newCues];
    }

    onUpdateWedding({ ...wedding, plannerDaySheet: updatedPlannerSheet });
    logAudit(
      state,
      setState,
      'Template Imported to Day Sheet',
      'Wedding Planner',
      'planner',
      `Imported ${newCues.length} activities from template (${templateImportMode} mode)`,
      'Day Sheet'
    );
    showToast(`Imported ${newCues.length} activities from template`, 'success');
    setShowTemplateModal(false);
  };

  // --- 3. Cheers AI Run Sheet Draft & Raw Text Parser ---
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'draft' | 'import'>('draft');
  const [aiCeremonyTime, setAiCeremonyTime] = useState('15:30');
  const [aiReceptionTime, setAiReceptionTime] = useState('18:00');
  const [aiSunsetTime, setAiSunsetTime] = useState('17:45');
  const [aiStyle, setAiStyle] = useState<'seated' | 'cocktail' | 'buffet' | 'twilight'>('seated');
  const [aiSpeechesCount, setAiSpeechesCount] = useState<number>(3);
  const [aiRawText, setAiRawText] = useState('');
  const [aiParsedRows, setAiParsedRows] = useState<Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'> & { selected: boolean }>>([]);
  const [aiImportMode, setAiImportMode] = useState<'replace' | 'append'>('replace');

  const handleOpenAiModal = () => {
    setShowAiModal(true);
    if (aiParsedRows.length === 0) {
      const initialDraft = generateAiRunSheetDraft({
        ceremonyTime: aiCeremonyTime,
        receptionTime: aiReceptionTime,
        sunsetTime: aiSunsetTime,
        style: aiStyle,
        speechesCount: aiSpeechesCount,
      });
      setAiParsedRows(initialDraft.map((d) => ({ ...d, selected: true })));
    }
  };

  const handleRegenerateAiDraft = () => {
    const draft = generateAiRunSheetDraft({
      ceremonyTime: aiCeremonyTime,
      receptionTime: aiReceptionTime,
      sunsetTime: aiSunsetTime,
      style: aiStyle,
      speechesCount: aiSpeechesCount,
    });
    setAiParsedRows(draft.map((d) => ({ ...d, selected: true })));
    showToast(`Cheers AI drafted ${draft.length} paced milestones`, 'success');
  };

  const handleParseRawText = () => {
    if (!aiRawText.trim()) {
      showToast('Please paste schedule or timeline notes first', 'error');
      return;
    }
    const parsed = parseRawRunSheetText(aiRawText);
    if (parsed.length === 0) {
      showToast('Could not find timestamped activities in pasted text', 'error');
      return;
    }
    setAiParsedRows(parsed.map((p) => ({ ...p, selected: true })));
    showToast(`Cheers AI parsed ${parsed.length} timeline entries`, 'success');
  };

  const handleApplyAiChatbotItems = (
    items: Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>>,
    mode: 'replace' | 'append'
  ) => {
    const newCues: PrivateRunSheetItem[] = items.map((item, idx) => ({
      id: 'pds_ai_' + Date.now() + '_' + idx,
      time: item.time,
      activity: item.activity,
      notes: item.notes || '',
      privateNotes: item.privateNotes || '',
      done: false,
      order: idx + 1,
      section: item.section || getTimeSection(item.time),
      category: item.category as any,
      vendorRole: item.vendorRole || 'Coordinator / Vendor',
    }));

    let updatedPlannerSheet: PrivateRunSheetItem[];
    if (mode === 'replace') {
      updatedPlannerSheet = newCues;
    } else {
      updatedPlannerSheet = [...(wedding.plannerDaySheet || []), ...newCues];
    }

    onUpdateWedding({ ...wedding, plannerDaySheet: updatedPlannerSheet });
    logAudit(
      state,
      setState,
      'Cheers AI Run Sheet Saved',
      'Wedding Planner',
      'planner',
      `Saved ${newCues.length} activities via Cheers AI Chatbot (${mode} mode)`,
      'Day Sheet'
    );
    showToast(`Saved ${newCues.length} activities to Day Sheet`, 'success');
  };

  const handleApplyAiRows = () => {
    const selectedItems = aiParsedRows.filter((r) => r.selected);
    if (selectedItems.length === 0) {
      showToast('Please select at least one activity to import', 'error');
      return;
    }

    const newCues: PrivateRunSheetItem[] = selectedItems.map((item, idx) => ({
      id: 'pds_ai_' + Date.now() + '_' + idx,
      time: item.time,
      activity: item.activity,
      notes: item.notes || '',
      privateNotes: item.privateNotes || '',
      done: false,
      order: idx + 1,
      section: item.section || getTimeSection(item.time),
      category: item.category as any,
      vendorRole: item.vendorRole || 'Coordinator / Vendor',
    }));

    let updatedPlannerSheet: PrivateRunSheetItem[];
    if (aiImportMode === 'replace') {
      updatedPlannerSheet = newCues;
    } else {
      updatedPlannerSheet = [...(wedding.plannerDaySheet || []), ...newCues];
    }

    onUpdateWedding({ ...wedding, plannerDaySheet: updatedPlannerSheet });
    logAudit(
      state,
      setState,
      'Cheers AI Run Sheet Saved',
      'Wedding Planner',
      'planner',
      `Saved ${newCues.length} AI generated/imported activities (${aiImportMode} mode)`,
      'Day Sheet'
    );
    showToast(`Saved ${newCues.length} activities to Day Sheet`, 'success');
    setShowAiModal(false);
  };

  // --- 4. Shareable Read-Only Vendor Copy ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareVendorFilter, setShareVendorFilter] = useState('all');
  const [shareCopied, setShareCopied] = useState(false);

  // --- 5. Export Run Sheet to Excel & CSV ---
  const handleExportExcel = () => {
    setShowExportMenu(false);
    try {
      const exportData = combinedItems.map((item, idx) => ({
        '#': idx + 1,
        'Time': item.time,
        'Activity / Milestone': item.activity,
        'Category': item.category ? item.category.toUpperCase() : 'GENERAL',
        'Responsible / Vendor': item.vendorRole || (item.isMcCue ? 'Master of Ceremonies' : 'Coordinator'),
        'Time of Day': (item.computedSection || 'morning').toUpperCase(),
        'Logistics & Supplier Notes': item.notes || '',
        'Status': item.done ? 'Completed' : 'Pending',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet['!cols'] = [
        { wch: 5 },
        { wch: 10 },
        { wch: 35 },
        { wch: 15 },
        { wch: 25 },
        { wch: 14 },
        { wch: 45 },
        { wch: 12 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Wedding Run Sheet');
      
      const fileName = `${wedding.couple.replace(/[^a-zA-Z0-9]/g, '_')}_Wedding_Day_Sheet.xlsx`;
      XLSX.writeFile(workbook, fileName);
      showToast('Wedding Day Sheet exported to Excel (.xlsx)', 'success');
      logAudit(
        state,
        setState,
        'Run Sheet Exported',
        roleMode === 'couple' ? wedding.couple : 'Wedding Planner',
        roleMode === 'couple' ? 'couple' : 'planner',
        `Exported run sheet to Excel (${combinedItems.length} activities)`,
        'Run Sheet'
      );
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export Excel file', 'error');
    }
  };

  const handleExportCsv = () => {
    setShowExportMenu(false);
    try {
      const exportData = combinedItems.map((item, idx) => ({
        'Order': idx + 1,
        'Time': item.time,
        'Activity': item.activity,
        'Category': item.category ? item.category.toUpperCase() : 'GENERAL',
        'Responsible Party / Vendor': item.vendorRole || (item.isMcCue ? 'Master of Ceremonies' : 'Coordinator'),
        'Section': (item.computedSection || 'morning').toUpperCase(),
        'Logistics Details': (item.notes || '').replace(/"/g, '""'),
        'Status': item.done ? 'Completed' : 'Pending',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${wedding.couple.replace(/[^a-zA-Z0-9]/g, '_')}_Wedding_Day_Sheet.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Wedding Day Sheet exported to CSV (.csv)', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export CSV file', 'error');
    }
  };


  // Helper: Determine time section automatically
  const getTimeSection = (timeStr: string): SectionKey => {
    if (!timeStr) return 'afternoon';
    const clean = timeStr.trim().toLowerCase();
    const isPm = clean.includes('pm');
    const isAm = clean.includes('am');
    const parts = clean.replace(/[^\d:]/g, '').split(':');
    let hours = parseInt(parts[0], 10);
    if (isNaN(hours)) return 'afternoon';

    if (isPm && hours < 12) hours += 12;
    if (isAm && hours === 12) hours = 0;

    if (hours < 12) return 'morning';
    if (hours < 17) return 'afternoon';
    return 'evening';
  };

  // Convert time to comparable minutes for proper chronological sorting
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 9999;
    const clean = timeStr.trim().toLowerCase();
    const isPm = clean.includes('pm');
    const isAm = clean.includes('am');
    const parts = clean.replace(/[^\d:]/g, '').split(':');
    let hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;

    if (isPm && hours < 12) hours += 12;
    if (isAm && hours === 12) hours = 0;

    return hours * 60 + mins;
  };

  // Consolidate MC Run Sheet and Planner Day Sheet
  const combinedItems: CombinedCueItem[] = useMemo(() => {
    const mcItems = (wedding.privateRunSheet || []).map((item, idx) => ({
      ...item,
      isMcCue: true,
      category: (item.category || 'mc') as any,
      vendorRole: item.vendorRole || 'Master of Ceremonies',
      computedSection: item.section || getTimeSection(item.time),
      order: item.order ?? (idx + 1),
    }));

    const plannerItems = (wedding.plannerDaySheet || []).map((item, idx) => ({
      ...item,
      isMcCue: false,
      category: (item.category || 'setup') as any,
      vendorRole: item.vendorRole || 'Coordinator / Vendor',
      computedSection: item.section || getTimeSection(item.time),
      order: item.order ?? (idx + 1),
    }));

    const merged = [...mcItems, ...plannerItems];
    merged.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    return merged;
  }, [wedding.privateRunSheet, wedding.plannerDaySheet]);

  // Section toggle helpers
  const toggleSection = (sec: SectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  // Update handlers
  const handleToggleCueDone = (item: CombinedCueItem) => {
    if (item.isMcCue) {
      const updatedMcSheet = (wedding.privateRunSheet || []).map((c) =>
        c.id === item.id ? { ...c, done: !c.done } : c
      );
      onUpdateWedding({ ...wedding, privateRunSheet: updatedMcSheet });
    } else {
      const updatedPlannerSheet = (wedding.plannerDaySheet || []).map((c) =>
        c.id === item.id ? { ...c, done: !c.done } : c
      );
      onUpdateWedding({ ...wedding, plannerDaySheet: updatedPlannerSheet });
    }
  };

  const handleUpdateCueField = (
    item: CombinedCueItem,
    field: keyof PrivateRunSheetItem,
    value: any
  ) => {
    if (item.isMcCue) {
      // NOTE: Per user requirement, the Wedding Planner cannot see or edit MC's private notes
      if (field === 'privateNotes') return;

      const updatedMcSheet = (wedding.privateRunSheet || []).map((c) =>
        c.id === item.id ? { ...c, [field]: value } : c
      );
      onUpdateWedding({ ...wedding, privateRunSheet: updatedMcSheet });
    } else {
      const updatedPlannerSheet = (wedding.plannerDaySheet || []).map((c) =>
        c.id === item.id ? { ...c, [field]: value } : c
      );
      onUpdateWedding({ ...wedding, plannerDaySheet: updatedPlannerSheet });
    }
  };

  const handleDeleteCue = (item: CombinedCueItem) => {
    if (item.isMcCue) {
      const updated = (wedding.privateRunSheet || []).filter((c) => c.id !== item.id);
      onUpdateWedding({ ...wedding, privateRunSheet: updated });
      showToast(`Removed MC cue: "${item.activity}"`, 'info');
    } else {
      const updated = (wedding.plannerDaySheet || []).filter((c) => c.id !== item.id);
      onUpdateWedding({ ...wedding, plannerDaySheet: updated });
      showToast(`Removed activity: "${item.activity}"`, 'info');
    }
  };

  const handleMoveCue = (item: CombinedCueItem, direction: -1 | 1) => {
    const list = item.isMcCue
      ? [...(wedding.privateRunSheet || [])]
      : [...(wedding.plannerDaySheet || [])];

    const idx = list.findIndex((c) => c.id === item.id);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    if (item.isMcCue) {
      onUpdateWedding({ ...wedding, privateRunSheet: list });
    } else {
      onUpdateWedding({ ...wedding, plannerDaySheet: list });
    }
  };

  const handleAddDayActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newActivity.trim()) {
      showToast('Please enter both a time and activity title', 'error');
      return;
    }

    const targetEvtId = newActivityEventId || (selectedEventId !== 'all' ? selectedEventId : undefined);
    const targetEvt = (wedding.events || []).find((e) => e.id === targetEvtId);

    const newItem: PrivateRunSheetItem = {
      id: (isNewMcCue ? 'pmc_' : 'pds_') + Date.now(),
      eventId: targetEvtId,
      eventName: targetEvt?.name,
      time: newTime.trim(),
      activity: newActivity.trim(),
      notes: newNotes.trim(),
      privateNotes: isNewMcCue ? '' : newPrivateNotes.trim(),
      done: false,
      order: combinedItems.length + 1,
      section: newSection,
      category: isNewMcCue ? 'mc' : newCategory,
      vendorRole: isNewMcCue ? 'Master of Ceremonies' : newVendorRole,
    };

    if (isNewMcCue) {
      const updated = [...(wedding.privateRunSheet || []), newItem];
      onUpdateWedding({ ...wedding, privateRunSheet: updated });
      logAudit(
        state,
        setState,
        'MC Cue Added by Planner',
        'Wedding Planner',
        'planner',
        `Added MC cue: ${newItem.activity} at ${newItem.time} for ${wedding.couple}`,
        'Day Sheet'
      );
      showToast(`Added MC Cue "${newItem.activity}"`, 'success');
    } else {
      const updated = [...(wedding.plannerDaySheet || []), newItem];
      onUpdateWedding({ ...wedding, plannerDaySheet: updated });
      logAudit(
        state,
        setState,
        'Day Activity Added',
        'Wedding Planner',
        'planner',
        `Added day activity: ${newItem.activity} at ${newItem.time} for ${wedding.couple}`,
        'Day Sheet'
      );
      showToast(`Added Activity "${newItem.activity}"`, 'success');
    }

    // Reset Form
    setNewActivity('');
    setNewNotes('');
    setNewPrivateNotes('');
    setShowAddModal(false);
  };

  // Filter combined items
  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      // 0. Event Filter (Multi-Day Celebration Specific Run Sheets)
      if (selectedEventId !== 'all') {
        if (item.eventId) {
          if (item.eventId !== selectedEventId) return false;
        } else {
          // If no eventId attached, associate with ceremony / reception (main wedding day)
          if (selectedEventId !== 'evt_ceremony' && selectedEventId !== 'evt_reception') return false;
        }
      }

      // 1. Status Filter
      if (daySheetFilter === 'pending' && item.done) return false;
      if (daySheetFilter === 'done' && !item.done) return false;

      // 2. Stream Filter
      if (streamFilter === 'mc_only' && !item.isMcCue) return false;
      if (streamFilter === 'planner_only' && item.isMcCue) return false;

      // 3. Time Section Filter
      if (timeSectionFilter !== 'all' && item.computedSection !== timeSectionFilter) return false;

      // 4. Search Filter
      if (daySheetSearch.trim()) {
        const q = daySheetSearch.toLowerCase();
        const matchesActivity = item.activity.toLowerCase().includes(q);
        const matchesTime = item.time.toLowerCase().includes(q);
        const matchesNotes = (item.notes || '').toLowerCase().includes(q);
        const matchesPrivate = !item.isMcCue && (item.privateNotes || '').toLowerCase().includes(q);
        const matchesVendor = (item.vendorRole || '').toLowerCase().includes(q);
        if (!matchesActivity && !matchesTime && !matchesNotes && !matchesPrivate && !matchesVendor) {
          return false;
        }
      }

      return true;
    });
  }, [combinedItems, selectedEventId, daySheetFilter, streamFilter, timeSectionFilter, daySheetSearch]);

  // Group by sections
  const morningItems = useMemo(
    () => filteredItems.filter((c) => c.computedSection === 'morning'),
    [filteredItems]
  );
  const afternoonItems = useMemo(
    () => filteredItems.filter((c) => c.computedSection === 'afternoon'),
    [filteredItems]
  );
  const eveningItems = useMemo(
    () => filteredItems.filter((c) => c.computedSection === 'evening'),
    [filteredItems]
  );

  // Overall Statistics
  const totalCount = combinedItems.length;
  const doneCount = combinedItems.filter((c) => c.done).length;

  // Render a section group
  const renderSectionAccordion = (
    key: SectionKey,
    title: string,
    IconComponent: React.FC,
    items: CombinedCueItem[]
  ) => {
    const isCollapsed = collapsedSections[key];
    const totalInSection = combinedItems.filter((c) => c.computedSection === key).length;
    const doneInSection = combinedItems.filter((c) => c.computedSection === key && c.done).length;
    const mcInSection = combinedItems.filter((c) => c.computedSection === key && c.isMcCue).length;

    return (
      <div className="bg-white border border-[#e8ded0] rounded-2xl shadow-xs overflow-hidden transition-all">
        {/* Accordion Header (Clean: Title only, no text inside parens, no time pill or activity count) */}
        <div
          onClick={() => toggleSection(key)}
          className="p-4 sm:p-5 bg-gradient-to-r from-[#faf8f5] to-white border-b border-[#ebdcc9] flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#f6f1ea] transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="text-[#bd9661] shrink-0 p-2.5 bg-[#f0ebe1] rounded-xl border border-[#e3d7c7] flex items-center justify-center">
              <IconComponent />
            </span>
            <div className="min-w-0">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#15110e]">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Badges */}
            <div className="flex items-center gap-1.5 text-xs">
              {mcInSection > 0 && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#faf3e8] border border-[#d6ba90] text-[#936932]">
                  <IconMicrophone />
                  <span>{mcInSection} MC cues</span>
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#f4eee6] text-[#15110e] border border-[#dfcfb9]">
                {doneInSection} / {totalInSection} Done
              </span>
            </div>

            {/* Toggle Button:
                When sheet is down (open), shows ▲ to collapse.
                When sheet is collapsed (closed), shows ▼ to expand. */}
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white border border-[#d5c7b5] hover:bg-[#ede5d8] text-[#15110e] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
              aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Section Body */}
        {!isCollapsed && (
          <div className="p-4 sm:p-5 space-y-3 bg-[#fdfbf9]/60">
            {items.length === 0 ? (
              <div className="text-center py-8 bg-[#faf7f2] rounded-xl border border-dashed border-[#d8c8b4] text-xs text-[#8b7b6b]">
                <p className="font-semibold text-[#15110e]">No activities match your filter in this section.</p>
                <p className="mt-1">Click "+ Add Activity" above to schedule a cue.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-4 transition-all bg-[#faf8f5] border-[#ebd8c3] shadow-xs ${
                    item.done ? 'opacity-80' : 'hover:border-[#bd9661]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleCueDone(item)}
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                        item.done
                          ? 'bg-[#15110e] border-[#15110e] text-[#dfc194] shadow-xs'
                          : 'bg-white border-[#c9b9a6] hover:border-[#bd9661]'
                      }`}
                      title={item.done ? 'Mark as Pending' : 'Mark as Done'}
                    >
                      {item.done && <IconCheck />}
                    </button>

                    {/* Content Body */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      {/* Row 1: Time, Title, Badges, Action Buttons */}
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          {/* Scheduled Time */}
                          <span className="font-mono text-xs font-bold bg-[#15110e] text-[#dfc194] px-2.5 py-1 rounded-lg shrink-0">
                            {item.time}
                          </span>

                          {/* Activity Title (Editable toggle) */}
                          {editingTitleId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                defaultValue={item.activity}
                                autoFocus
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    handleUpdateCueField(item, 'activity', e.target.value.trim());
                                  }
                                  setEditingTitleId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (e.currentTarget.value.trim()) {
                                      handleUpdateCueField(item, 'activity', e.currentTarget.value.trim());
                                    }
                                    setEditingTitleId(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingTitleId(null);
                                  }
                                }}
                                className="text-sm font-bold bg-white border border-[#bd9661] rounded-lg px-2 py-0.5 text-[#15110e] outline-none"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-sm font-bold truncate ${
                                  item.done ? 'line-through text-[#8b7b6b]' : 'text-[#15110e]'
                                }`}
                              >
                                {item.activity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingTitleId(item.id)}
                                className="text-[#8b7b6b] hover:text-[#bd9661] p-1 transition-colors cursor-pointer"
                                title="Edit Title"
                              >
                                <IconPencil />
                              </button>
                            </div>
                          )}

                          {/* Badges: Event, Category and Vendor Role */}
                          {item.eventName && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#faf4ec] border border-[#ebd3a8] text-[#8b6534]">
                              🗓️ {item.eventName}
                            </span>
                          )}

                          {item.category && item.category !== 'mc' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold bg-white border border-[#dfd4c4] text-[#6b5843]">
                              <CategoryIcon category={item.category} />
                              <span className="capitalize">{item.category}</span>
                            </span>
                          )}

                          {item.vendorRole && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold bg-[#faf7f2] border border-[#e3d7c7] text-[#5c4a38]">
                              {item.vendorRole}
                            </span>
                          )}
                        </div>

                        {/* Activity Actions: On MC cues, planner can request a schedule change; on planner activities, reorder or delete */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.isMcCue ? (
                            item.changeRequest && item.changeRequest.status === 'pending' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#fff8eb] border border-[#f0c371] text-[#936319]">
                                <span>⏳</span>
                                <span>Pending MC: Proposed {item.changeRequest.proposedTime}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCancelChangeRequest(item)}
                                  className="ml-1 text-[#936319] hover:text-[#5e3b0b] font-bold cursor-pointer"
                                  title="Withdraw change request"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : item.changeRequest && item.changeRequest.status === 'accepted' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#eefaf3] border border-[#a2dfbe] text-[#1e6f47]">
                                <span>✓</span>
                                <span>MC Accepted ({item.changeRequest.proposedTime})</span>
                              </div>
                            ) : item.changeRequest && item.changeRequest.status === 'declined' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 border border-stone-200 text-stone-700">
                                <span>✕</span>
                                <span>MC Kept Original</span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenChangeRequestModal(item)}
                                  className="text-[10px] text-[#bd9661] hover:underline ml-1 cursor-pointer font-bold"
                                >
                                  Request Again
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenChangeRequestModal(item)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#faf3e8] border border-[#d6ba90] text-[#936932] hover:bg-[#f5e7d0] transition-colors cursor-pointer shadow-2xs"
                                title="Send a schedule change request to the MC"
                              >
                                <IconMessage />
                                <span>Request Change</span>
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleMoveCue(item, -1)}
                                className="bg-white border border-[#d5c7b5] hover:bg-[#f0ede6] text-[#15110e] text-xs font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveCue(item, 1)}
                                className="bg-white border border-[#d5c7b5] hover:bg-[#f0ede6] text-[#15110e] text-xs font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                                title="Move Down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCue(item)}
                                className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                                title="Delete Activity"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Public / Housekeeping / Vendor Logistics Notes */}
                      <div>
                        <label className="block text-[9.5px] uppercase font-bold text-[#8b7b6b] mb-1">
                          {item.isMcCue
                            ? 'Public Schedule Announcement & Stage Cues'
                            : 'Vendor Briefing & Logistics Details'}
                        </label>
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateCueField(item, 'notes', e.target.value)}
                          className="w-full text-xs bg-white border border-[#d4c5b3] rounded-lg px-3 py-1.5 text-[#15110e] focus:outline-none focus:border-[#bd9661]"
                          placeholder="Details for guests, wedding party or vendor team..."
                        />
                      </div>

                      {/* Row 3: Private Coordinator Notes */}
                      {/* NOTE: Per user request, the Wedding Planner cannot see the private notes added by the MC */}
                      {!item.isMcCue && (
                        <div className="bg-[#fff9f0] border border-[#ebd8be] rounded-xl p-2.5 space-y-1">
                          <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wider text-[#bd9661]">
                            <span className="inline-flex items-center gap-1.5">
                              <IconLock />
                              <span>Private Coordinator &amp; Vendor Contact Note</span>
                            </span>
                            <span className="text-[#a08e7a] font-normal normal-case text-[10px]">
                              Planner confidential
                            </span>
                          </div>
                          <input
                            type="text"
                            value={item.privateNotes || ''}
                            onChange={(e) => handleUpdateCueField(item, 'privateNotes', e.target.value)}
                            className="w-full text-xs bg-transparent border-0 border-b border-[#e3d4bf] text-[#453423] font-medium px-1 py-1 focus:outline-none focus:border-[#bd9661]"
                            placeholder="Supplier phone numbers, driver cell, secret surprises..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] tracking-[2px] uppercase text-[#bd9661] font-bold mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <IconClipboard />
              <span>{roleMode === 'couple' ? 'COUPLE • WEDDING DAY SHEET' : 'PLANNER MASTER COORDINATION SUITE'}</span>
            </span>
            <span className="text-[#8b7b6b]">&bull;</span>
            <span className="text-[#15110e] font-semibold">{wedding.couple}</span>
          </div>
          {(() => {
            const activeEvt = (wedding.events || []).find((e) => e.id === selectedEventId);
            if (!activeEvt) {
              return (
                <>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
                    {roleMode === 'couple' ? 'Wedding Day Sheet' : 'Wedding Planner Day Sheet'}
                  </h1>
                  <p className="text-xs text-[#8b7b6b] mt-1">
                    Saturday, {wedding.dateDisplay || wedding.date} &bull; {wedding.venue} &bull;{' '}
                    <strong className="text-[#15110e]">
                      {roleMode === 'couple'
                        ? `Build & manage preparations, vendor arrivals, ceremony and reception (${totalCount} entries)`
                        : `${totalCount} Master Schedule Entries`}
                    </strong>
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
                    {filteredItems.length} Event Specific Entries
                  </strong>
                </p>
              </>
            );
          })()}
        </div>

        {/* Header Action Buttons: Export / Download, Share Vendor Copy, Import Template, Print, Add Activity */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export / Download Dropdown Menu */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Download or export run sheet in Excel, CSV, or Print format"
            >
              <IconDownload />
              <span>Export / Download</span>
              <IconChevronDown />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-[#bd9661] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b] border-b border-[#f0e7dc]">
                  Export Formats
                </div>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#15110e] hover:bg-[#faf7f2] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md bg-[#eef8f2] text-emerald-700">
                    <IconFileSpreadsheet />
                  </span>
                  <div>
                    <div>Export to Excel (.xlsx)</div>
                    <div className="text-[10px] font-normal text-[#8b7b6b]">Standard spreadsheet for suppliers</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#15110e] hover:bg-[#faf7f2] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md bg-[#f4f2ee] text-[#15110e]">
                    <IconFileSpreadsheet />
                  </span>
                  <div>
                    <div>Export to CSV (.csv)</div>
                    <div className="text-[10px] font-normal text-[#8b7b6b]">Universal table data format</div>
                  </div>
                </button>
                <div className="border-t border-[#f0e7dc] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    window.print();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#15110e] hover:bg-[#faf7f2] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md bg-[#faf4ec] text-[#bd9661]">
                    <IconPrinter />
                  </span>
                  <div>
                    <div>Download PDF / Print</div>
                    <div className="text-[10px] font-normal text-[#8b7b6b]">Print clean run sheet or save to PDF</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    setShowShareModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#15110e] hover:bg-[#faf7f2] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="p-1 rounded-md bg-[#f4effa] text-[#8b4cb8]">
                    <IconShare />
                  </span>
                  <div>
                    <div>Share Vendor Copy Link</div>
                    <div className="text-[10px] font-normal text-[#8b7b6b]">Read-only link (no login needed)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Share or print read-only run sheet for vendors (excluding private notes)"
          >
            <IconShare />
            <span>Share Vendor Copy</span>
          </button>

          <button
            type="button"
            onClick={handleOpenTemplateModal}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="Import activities from standard wedding run sheet templates"
          >
            <IconTemplate />
            <span>Import Template</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <IconPrinter />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewActivityEventId(selectedEventId !== 'all' ? selectedEventId : (wedding.events?.[0]?.id || ''));
              setShowAddModal(true);
            }}
            className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <IconPlus />
            <span>Create Event Run Sheet</span>
          </button>
        </div>
      </div>

      {/* Event-Specific Run Sheet Tabs (Multi-Day Celebration Run Sheets) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#e8ded0]">
        <button
          type="button"
          onClick={() => setSelectedEventId('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            selectedEventId === 'all'
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
            onClick={() => setSelectedEventId(evt.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedEventId === evt.id
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

      {/* 2. KPI Banner & Dropdown Filters (No text in parentheses) */}
      <div className="bg-white border border-[#e8ded0] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Controls: Search & Dropdown Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search activities, vendors, times..."
                value={daySheetSearch}
                onChange={(e) => setDaySheetSearch(e.target.value)}
                className="bg-[#faf8f5] border border-[#d5c7b5] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#15110e] placeholder-[#a09080] focus:outline-none focus:border-[#bd9661] w-48 sm:w-60"
              />
              {daySheetSearch && (
                <button
                  type="button"
                  onClick={() => setDaySheetSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8b7b6b] hover:text-[#15110e] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Time of Day Filter Dropdown (Clean, no parens) */}
            <div className="relative">
              <select
                value={timeSectionFilter}
                onChange={(e) => setTimeSectionFilter(e.target.value as any)}
                className="appearance-none bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] text-[#15110e] text-xs font-semibold rounded-xl pl-3 pr-7 py-1.5 outline-none cursor-pointer"
              >
                <option value="all">All Day</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                <IconChevronDown />
              </span>
            </div>

            {/* Stream Filter Dropdown (Clean, no parens) */}
            <div className="relative">
              <select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value as any)}
                className="appearance-none bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] text-[#15110e] text-xs font-semibold rounded-xl pl-3 pr-7 py-1.5 outline-none cursor-pointer"
              >
                <option value="all">All Activities</option>
                <option value="mc_only">MC Cues</option>
                <option value="planner_only">Vendors &amp; Logistics</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                <IconChevronDown />
              </span>
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={daySheetFilter}
                onChange={(e) => setDaySheetFilter(e.target.value as any)}
                className="appearance-none bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] text-[#15110e] text-xs font-semibold rounded-xl pl-3 pr-7 py-1.5 outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Only</option>
                <option value="done">Completed / Done</option>
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7b6b] pointer-events-none">
                <IconChevronDown />
              </span>
            </div>
          </div>

          {/* Completed Text Box & Add Activity button beside it */}
          <div className="flex items-center gap-2.5">
            <div className="bg-[#faf6f0] border border-[#ebd3a8] px-3.5 py-1.5 rounded-xl font-medium text-[#15110e] text-xs">
              <span className="font-bold text-[#bd9661]">{doneCount}</span> / {totalCount} Completed
            </div>
            <button
              type="button"
              onClick={() => {
                setNewActivityEventId(selectedEventId !== 'all' ? selectedEventId : (wedding.events?.[0]?.id || ''));
                setShowAddModal(true);
              }}
              className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <IconPlus />
              <span>Add Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Collapsible Day Sheet Sections */}
      <div className="space-y-4">
        {/* SECTION 1: MORNING */}
        {(timeSectionFilter === 'all' || timeSectionFilter === 'morning') &&
          renderSectionAccordion(
            'morning',
            'Morning Coordination & Bump-In',
            IconMorning,
            morningItems
          )}

        {/* SECTION 2: AFTERNOON */}
        {(timeSectionFilter === 'all' || timeSectionFilter === 'afternoon') &&
          renderSectionAccordion(
            'afternoon',
            'Afternoon Ceremony & Cocktails',
            IconAfternoon,
            afternoonItems
          )}

        {/* SECTION 3: EVENING */}
        {(timeSectionFilter === 'all' || timeSectionFilter === 'evening') &&
          renderSectionAccordion(
            'evening',
            'Evening Reception & Pack-Down',
            IconEvening,
            eveningItems
          )}
      </div>

      {/* 4. Add Activity Modal (Dynamic design, z-[2000] above demo bar, guaranteed visible heading & scrollable body) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#bd9661] rounded-2xl max-w-lg w-full max-h-[88vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header (Fixed at top) */}
            <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between shrink-0 bg-[#faf8f5]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#15110e]">
                  Add Activity
                </h3>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Schedule a vendor arrival, setup milestone, ceremony phase, or MC run sheet cue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <IconClose />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleAddDayActivity} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Activity Stream Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1.5">
                  Activity Stream / Owner *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewMcCue(false);
                      setNewVendorRole('Coordinator & Vendor');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      !isNewMcCue
                        ? 'bg-[#15110e] text-[#dfc194] border-[#15110e] shadow-xs'
                        : 'bg-white text-[#8b7b6b] border-[#d5c7b5] hover:bg-[#faf8f5]'
                    }`}
                  >
                    <IconClipboard />
                    <span>Planner &amp; Vendor Activity</span>
                  </button>
                                    <button
                    type="button"
                    disabled
                    className="py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 bg-[#f4eee6]/80 text-[#9b8a78] border-[#dfd4c5] cursor-not-allowed opacity-85 select-none"
                    title="MC Run Sheet cue creation is locked for the wedding planner"
                  >
                    <IconMicrophone />
                    <span>MC Run Sheet Cue</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#e8ded0] text-[#7d6c5b] px-1.5 py-0.5 rounded ml-0.5">
                      <IconLock />
                      <span>Locked</span>
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#8b7b6b] mt-1.5">
                  <span className="text-[#bd9661] shrink-0">
                    <IconLock />
                  </span>
                  <span>
                    MC Run Sheet cues are managed by the Master of Ceremonies and synchronized to your Day Sheet. Cue creation is currently locked.
                  </span>
                </div>
              </div>

              {/* Event Selector for Event-Specific Run Sheets */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                  Celebration Event *
                </label>
                <select
                  value={newActivityEventId}
                  onChange={(e) => setNewActivityEventId(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none font-semibold"
                >
                  <option value="">Master Wedding Day (All Events)</option>
                  {(wedding.events || []).map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.date} • {e.time})
                    </option>
                  ))}
                </select>
              </div>

              {/* Time & Section Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    Scheduled Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => {
                      setNewTime(e.target.value);
                      setNewSection(getTimeSection(e.target.value));
                    }}
                    placeholder="e.g. 09:30 or 14:00"
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    Day Section *
                  </label>
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value as SectionKey)}
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              {/* Activity Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="e.g. Marquee Delivery & Setup, Guest Shuttle 1 Arrival, Speeches"
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none font-bold"
                />
              </div>

              {/* Vendor Role or Category (If not MC Cue) */}
              {!isNewMcCue && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none"
                    >
                      <option value="setup">Setup &amp; Bump-In</option>
                      <option value="vendor">Vendor Arrival</option>
                      <option value="ceremony">Ceremony Phase</option>
                      <option value="reception">Reception Phase</option>
                      <option value="packdown">Pack-Down &amp; Bump-Out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Vendor / Contact Role
                    </label>
                    <input
                      type="text"
                      value={newVendorRole}
                      onChange={(e) => setNewVendorRole(e.target.value)}
                      placeholder="e.g. Florist, Catering, Celebrant, Hire"
                      className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Public Notes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                  {isNewMcCue ? 'Public Schedule Notes' : 'Vendor Logistics & Public Details'}
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Deliveries gate, table placement, equipment counts, announcements..."
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl p-2.5 text-xs text-[#15110e] outline-none resize-none"
                />
              </div>

              {/* Private Coordinator Notes (Only for planner items) */}
              {!isNewMcCue && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1 flex items-center gap-1.5">
                    <IconLock />
                    <span>Private Coordinator &amp; Vendor Contact Phone</span>
                  </label>
                  <textarea
                    rows={2}
                    value={newPrivateNotes}
                    onChange={(e) => setNewPrivateNotes(e.target.value)}
                    placeholder="Supplier contact number, driver phone, secret couple surprises, contingency plan..."
                    className="w-full bg-[#fff9f0] border border-[#ebd8be] focus:border-[#bd9661] rounded-xl p-2.5 text-xs text-[#453423] outline-none resize-none"
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8ded0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-[#faf7f2] rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#15110e] hover:bg-[#28201a] text-[#dfc194] hover:text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                >
                  Add Activity &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Request Change Modal (Planner requesting adjustment on MC Cue) */}
      {changeRequestTarget && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#bd9661] rounded-2xl max-w-lg w-full my-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                  MC RUN SHEET COORDINATION
                </div>
                <h3 className="font-serif text-lg font-bold text-[#15110e]">
                  Request Schedule Change
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setChangeRequestTarget(null)}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleSubmitChangeRequest} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-[#faf7f2] border border-[#e8dfd1] rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8b7b6b]">Current MC Cue</span>
                <div className="font-serif text-sm font-bold text-[#15110e]">
                  <span className="font-mono bg-[#15110e] text-[#dfc194] px-1.5 py-0.5 rounded text-xs mr-2">
                    {changeRequestTarget.time}
                  </span>
                  {changeRequestTarget.activity}
                </div>
                {changeRequestTarget.notes && (
                  <p className="text-[11px] text-[#6b5847] mt-1 italic">
                    "{changeRequestTarget.notes}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    Proposed Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={changeProposedTime}
                    onChange={(e) => setChangeProposedTime(e.target.value)}
                    placeholder="e.g. 18:45"
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                    Proposed Title
                  </label>
                  <input
                    type="text"
                    value={changeProposedActivity}
                    onChange={(e) => setChangeProposedActivity(e.target.value)}
                    placeholder="e.g. Bridal Speeches & Toast"
                    className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-2 text-xs text-[#15110e] font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                  Reason / Coordinator Note for MC *
                </label>
                <textarea
                  required
                  rows={3}
                  value={changeProposedNotes}
                  onChange={(e) => setChangeProposedNotes(e.target.value)}
                  placeholder="e.g. Catering kitchen needs 15 additional minutes for main course rest. Please slide speeches to 18:45."
                  className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl p-2.5 text-xs text-[#15110e] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e8ded0]">
                <button
                  type="button"
                  onClick={() => setChangeRequestTarget(null)}
                  className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-[#faf7f2] rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Send Change Request to MC &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Standard Run Sheet Template Library Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#bd9661] rounded-2xl max-w-3xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                  STANDARD TIMELINE TEMPLATES
                </div>
                <h3 className="font-serif text-xl font-bold text-[#15110e]">
                  Import Run Sheet Template
                </h3>
                <p className="text-xs text-[#8b7b6b] mt-0.5">
                  Select a proven timeline structure, review and edit each row, then apply to your day sheet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Template selector cards */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-2">
                  Select Wedding Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {STANDARD_RUN_SHEET_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        selectedTemplateId === tmpl.id
                          ? 'bg-[#faf6ee] border-[#bd9661] ring-2 ring-[#bd9661]/30 shadow-xs'
                          : 'bg-white border-[#e0d4c3] hover:border-[#bd9661]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-xs text-[#15110e] truncate">
                          {tmpl.name}
                        </span>
                        <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#ebdcc9] text-[#715433]">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#7a6a59] line-clamp-2 leading-tight">
                        {tmpl.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Import Mode: Replace vs Append */}
              <div className="flex items-center justify-between p-3 bg-[#faf7f2] border border-[#e8ded0] rounded-xl flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#15110e]">Import Mode:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="templateImportMode"
                      checked={templateImportMode === 'replace'}
                      onChange={() => setTemplateImportMode('replace')}
                      className="accent-[#bd9661]"
                    />
                    <span>Replace existing day sheet</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs ml-2">
                    <input
                      type="radio"
                      name="templateImportMode"
                      checked={templateImportMode === 'append'}
                      onChange={() => setTemplateImportMode('append')}
                      className="accent-[#bd9661]"
                    />
                    <span>Append to current activities</span>
                  </label>
                </div>
                <div className="text-[11px] text-[#8b7b6b]">
                  {templateRows.filter((r) => r.selected).length} of {templateRows.length} activities selected
                </div>
              </div>

              {/* Editable Review Rows Table */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1.5">
                  Review &amp; Edit Template Activities ({templateRows.length})
                </label>
                <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#faf8f5] border-b border-[#e8ded0] text-[#7d6c5b] sticky top-0">
                      <tr>
                        <th className="p-2.5 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={templateRows.length > 0 && templateRows.every((r) => r.selected)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setTemplateRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
                            }}
                            className="accent-[#bd9661]"
                          />
                        </th>
                        <th className="p-2.5 w-24">Time</th>
                        <th className="p-2.5">Activity Title</th>
                        <th className="p-2.5 w-40">Vendor / Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebdcc9]/60">
                      {templateRows.map((row, idx) => (
                        <tr key={idx} className={row.selected ? 'bg-white' : 'bg-[#f7f4ee]/70 opacity-60'}>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={row.selected}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setTemplateRows((prev) =>
                                  prev.map((r, i) => (i === idx ? { ...r, selected: checked } : r))
                                );
                              }}
                              className="accent-[#bd9661]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.time}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTemplateRows((prev) =>
                                  prev.map((r, i) => (i === idx ? { ...r, time: val } : r))
                                );
                              }}
                              className="w-20 bg-[#faf8f5] border border-[#d5c7b5] rounded-md px-2 py-1 font-mono font-bold text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.activity}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTemplateRows((prev) =>
                                  prev.map((r, i) => (i === idx ? { ...r, activity: val } : r))
                                );
                              }}
                              className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-md px-2 py-1 font-semibold text-xs text-[#15110e]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.vendorRole || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTemplateRows((prev) =>
                                  prev.map((r, i) => (i === idx ? { ...r, vendorRole: val } : r))
                                );
                              }}
                              className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded-md px-2 py-1 text-xs text-[#6b5847]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyTemplate}
                className="px-5 py-2 bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Apply &amp; Save to Day Sheet ({templateRows.filter((r) => r.selected).length}) &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Cheers AI Run Sheet Chatbot with Chat & File Upload */}
      <CheersAiRunSheetChatbot
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApply={handleApplyAiChatbotItems}
        title="Cheers AI • Wedding Day Sheet Assistant"
        context={roleMode === 'couple' ? "couple" : "planner"}
      />

      {/* 8. Share Vendor Copy Modal (Clean read-only schedule for external vendors) */}
      {showShareModal && (
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
                  Clean, read-only run sheet for catering, florists, photographers and venue staff. Private MC stage directions and coordinator confidential notes are excluded.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Shareable Link Box */}
              <div className="p-3.5 bg-[#faf7f2] border border-[#e8dfd1] rounded-xl space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7b6b]">
                  Shareable Read-Only Link (No sign-in required)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://taptoast.app/schedule/${wedding.id || 'w1'}/vendor-access?token=vlive_2026`}
                    className="flex-1 bg-white border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs font-mono text-[#15110e] select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://taptoast.app/schedule/${wedding.id || 'w1'}/vendor-access?token=vlive_2026`
                      );
                      setShareCopied(true);
                      showToast('Vendor schedule link copied to clipboard', 'success');
                      setTimeout(() => setShareCopied(false), 2500);
                    }}
                    className="px-4 py-2 bg-[#15110e] hover:bg-[#28201a] text-[#dfc194] rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                  >
                    {shareCopied ? '✓ Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Vendor Filter */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-[#15110e]">
                  Filter Schedule for Specific Vendor:
                </label>
                <select
                  value={shareVendorFilter}
                  onChange={(e) => setShareVendorFilter(e.target.value)}
                  className="bg-[#faf8f5] border border-[#d5c7b5] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none"
                >
                  <option value="all">All Vendors (Master Schedule)</option>
                  <option value="Catering">Catering &amp; Bar</option>
                  <option value="Florist">Florist &amp; Styling</option>
                  <option value="Photographer">Photographer &amp; Video</option>
                  <option value="Celebrant">Celebrant</option>
                  <option value="Musicians">Musicians &amp; DJ</option>
                  <option value="Transport">Transport &amp; Shuttles</option>
                </select>
              </div>

              {/* Live Preview List */}
              <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <div className="bg-[#faf8f5] p-2.5 font-bold text-[11px] text-[#7d6c5b] border-b border-[#e8ded0] flex items-center justify-between">
                  <span>Vendor Briefing Preview ({combinedItems.filter((i) => !i.isMcCue && (shareVendorFilter === 'all' || (i.vendorRole || '').toLowerCase().includes(shareVendorFilter.toLowerCase()))).length} entries)</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Confidential notes excluded
                  </span>
                </div>
                <div className="divide-y divide-[#ebdcc9]/50">
                  {combinedItems
                    .filter(
                      (i) =>
                        !i.isMcCue &&
                        (shareVendorFilter === 'all' ||
                          (i.vendorRole || '').toLowerCase().includes(shareVendorFilter.toLowerCase()))
                    )
                    .map((item) => (
                      <div key={item.id} className="p-3 bg-white flex items-start gap-3">
                        <span className="font-mono text-xs font-bold bg-[#15110e] text-[#dfc194] px-2 py-0.5 rounded shrink-0">
                          {item.time}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-[#15110e] flex items-center gap-2">
                            <span>{item.activity}</span>
                            {item.vendorRole && (
                              <span className="text-[10px] text-[#8b7b6b] bg-[#faf7f2] px-1.5 py-0.5 rounded">
                                {item.vendorRole}
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-[#6b5847] mt-0.5">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-between gap-2.5 shrink-0">
              <span className="text-[11px] text-[#8b7b6b]">
                Prints in clean portrait format suitable for supplier briefings.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#15110e] hover:bg-[#28201a] text-[#dfc194] rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <IconPrinter />
                  <span>Print Vendor Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
