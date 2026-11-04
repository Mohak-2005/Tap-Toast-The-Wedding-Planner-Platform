import React, { useState, useMemo } from 'react';
import { Wedding, PrivateRunSheetItem } from '../lib/types';
import { showToast, logAudit, useAppState } from '../lib/state';

interface PlannerDaySheetSectionProps {
  wedding: Wedding;
  onUpdateWedding: (updatedWedding: Wedding) => void;
  onSelectView?: (view: string) => void;
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
}: PlannerDaySheetSectionProps) {
  const { state, setState } = useAppState();

  // Filters (no parentheses)
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
  const [newTime, setNewTime] = useState('09:00');
  const [newActivity, setNewActivity] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPrivateNotes, setNewPrivateNotes] = useState('');
  const [newSection, setNewSection] = useState<SectionKey>('morning');
  const [newCategory, setNewCategory] = useState<'mc' | 'vendor' | 'ceremony' | 'setup' | 'reception' | 'packdown'>('setup');
  const [newVendorRole, setNewVendorRole] = useState('Hire & Styling');
  const [isNewMcCue, setIsNewMcCue] = useState(false);

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

    const newItem: PrivateRunSheetItem = {
      id: (isNewMcCue ? 'pmc_' : 'pds_') + Date.now(),
      time: newTime.trim(),
      activity: newActivity.trim(),
      notes: newNotes.trim(),
      privateNotes: isNewMcCue ? '' : newPrivateNotes.trim(),
      done: false,
      order: combinedItems.length + 1,
      section: newSection,
      category: isNewMcCue ? 'mc' : newCategory,
      vendorRole: isNewMcCue ? 'Master of Ceremonies' : newVendorRole,
      isMcCue: isNewMcCue,
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
  }, [combinedItems, daySheetFilter, streamFilter, timeSectionFilter, daySheetSearch]);

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

                          {/* Badges: Just Category and Vendor Role */}
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

                        {/* Activity Reorder & Delete Actions (Exact same icons and styles as MC Run Sheet: ▲, ▼, 🗑️) */}
                        <div className="flex items-center gap-1">
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
              <span>PLANNER MASTER COORDINATION SUITE</span>
            </span>
            <span className="text-[#8b7b6b]">&bull;</span>
            <span className="text-[#15110e] font-semibold">{wedding.couple}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#15110e]">
            Wedding Planner Day Sheet
          </h1>
          <p className="text-xs text-[#8b7b6b] mt-1">
            Saturday, {wedding.dateDisplay || wedding.date} &bull; {wedding.venue} &bull;{' '}
            <strong className="text-[#15110e]">{totalCount} Master Schedule Entries</strong>
          </p>
        </div>

        {/* Header Action Buttons (Collapse All Sections button removed per user request) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <IconPrinter />
            <span>Print Day Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <IconPlus />
            <span>Add Activity</span>
          </button>
        </div>
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

          {/* Completed Text Box Only (Clean, no text beside it, no progress bar) */}
          <div className="bg-[#faf6f0] border border-[#ebd3a8] px-3.5 py-1.5 rounded-xl font-medium text-[#15110e] text-xs">
            <span className="font-bold text-[#bd9661]">{doneCount}</span> / {totalCount} Completed
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
    </section>
  );
}
