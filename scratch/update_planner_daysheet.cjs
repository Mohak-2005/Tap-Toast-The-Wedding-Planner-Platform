const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/PlannerDaySheetSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
const oldImport = `import { Wedding, PrivateRunSheetItem } from '../lib/types';
import { showToast, logAudit, useAppState } from '../lib/state';`;

const newImport = `import { Wedding, PrivateRunSheetItem, RunSheetChangeRequest } from '../lib/types';
import { showToast, logAudit, useAppState } from '../lib/state';
import {
  STANDARD_RUN_SHEET_TEMPLATES,
  RunSheetTemplate,
  generateAiRunSheetDraft,
  parseRawRunSheetText,
} from '../lib/runSheetTemplates';`;

if (!content.includes('RunSheetChangeRequest')) {
  content = content.replace(oldImport, newImport);
}

// 2. Add extra icons
const extraIcons = `
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
`;

if (!content.includes('IconSparkles')) {
  content = content.replace('// Category specific clean SVG icon', extraIcons + '\n// Category specific clean SVG icon');
}

// 3. Add states and handlers inside PlannerDaySheetSection
const stateInsertionTarget = `  const [isNewMcCue, setIsNewMcCue] = useState(false);`;

const newStatesAndHandlers = `  const [isNewMcCue, setIsNewMcCue] = useState(false);

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
      \`Requested schedule change on MC cue "\${changeRequestTarget.activity}": proposed \${cr.proposedTime} ("\${cr.notes}")\`,
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
      \`Imported \${newCues.length} activities from template (\${templateImportMode} mode)\`,
      'Day Sheet'
    );
    showToast(\`Imported \${newCues.length} activities from template\`, 'success');
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
    showToast(\`Cheers AI drafted \${draft.length} paced milestones\`, 'success');
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
    showToast(\`Cheers AI parsed \${parsed.length} timeline entries\`, 'success');
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
      \`Saved \${newCues.length} AI generated/imported activities (\${aiImportMode} mode)\`,
      'Day Sheet'
    );
    showToast(\`Saved \${newCues.length} activities to Day Sheet\`, 'success');
    setShowAiModal(false);
  };

  // --- 4. Shareable Read-Only Vendor Copy ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareVendorFilter, setShareVendorFilter] = useState('all');
  const [shareCopied, setShareCopied] = useState(false);
`;

if (!content.includes('handleOpenChangeRequestModal')) {
  content = content.replace(stateInsertionTarget, newStatesAndHandlers);
}

// 4. Update the Cue Row Action buttons to support Request Change on MC cues
const oldRowActions = `{/* Activity Reorder & Delete Actions (Exact same icons and styles as MC Run Sheet: ▲, ▼, 🗑️) */}
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
                        </div>`;

const newRowActions = `{/* Activity Actions: On MC cues, planner can request a schedule change; on planner activities, reorder or delete */}
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
                        </div>`;

content = content.replace(oldRowActions, newRowActions);

// 5. Update header buttons to include Import Template, Cheers AI, and Share Vendor Copy
const oldHeaderButtons = `<div className="flex items-center gap-2.5 flex-wrap">
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
        </div>`;

const newHeaderButtons = `<div className="flex items-center gap-2 flex-wrap">
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
            onClick={handleOpenAiModal}
            className="bg-[#241c15] hover:bg-[#382b21] text-[#dfc194] border border-[#bd9661]/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            title="AI draft generator and spreadsheet/text timeline parser"
          >
            <IconSparkles />
            <span>Cheers AI</span>
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
            onClick={() => setShowAddModal(true)}
            className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <IconPlus />
            <span>Add Activity</span>
          </button>
        </div>`;

content = content.replace(oldHeaderButtons, newHeaderButtons);

// 6. Append the new Modals before </section>
const modalsBlock = `
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
                      className={\`p-3 text-left rounded-xl border transition-all cursor-pointer \${
                        selectedTemplateId === tmpl.id
                          ? 'bg-[#faf6ee] border-[#bd9661] ring-2 ring-[#bd9661]/30 shadow-xs'
                          : 'bg-white border-[#e0d4c3] hover:border-[#bd9661]'
                      }\`}
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

      {/* 7. Cheers AI Run Sheet Modal (Draft Generator & Raw Import) */}
      {showAiModal && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-[#bd9661] rounded-2xl max-w-3xl w-full max-h-[90vh] my-auto flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#e8ded0] flex items-center justify-between bg-[#faf8f5] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#241c15] text-[#dfc194] flex items-center justify-center border border-[#bd9661]/40 shrink-0">
                  <IconSparkles />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#bd9661]">
                    CHEERS AI WEDDING TIMELINE
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#15110e]">
                    AI Run Sheet Generator &amp; Import
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#ede5d8] text-[#8b7b6b] hover:text-[#15110e] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#e8ded0] px-5 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setAiModalTab('draft')}
                className={\`py-3 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer \${
                  aiModalTab === 'draft'
                    ? 'border-[#bd9661] text-[#15110e]'
                    : 'border-transparent text-[#8b7b6b] hover:text-[#15110e]'
                }\`}
              >
                ✨ AI Draft Generator
              </button>
              <button
                type="button"
                onClick={() => setAiModalTab('import')}
                className={\`py-3 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer \${
                  aiModalTab === 'import'
                    ? 'border-[#bd9661] text-[#15110e]'
                    : 'border-transparent text-[#8b7b6b] hover:text-[#15110e]'
                }\`}
              >
                📄 AI Document &amp; Raw Text Parser
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {aiModalTab === 'draft' ? (
                /* Tab 1: AI Draft Generator */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">
                        Ceremony Time
                      </label>
                      <input
                        type="text"
                        value={aiCeremonyTime}
                        onChange={(e) => setAiCeremonyTime(e.target.value)}
                        placeholder="15:30"
                        className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">
                        Reception Time
                      </label>
                      <input
                        type="text"
                        value={aiReceptionTime}
                        onChange={(e) => setAiReceptionTime(e.target.value)}
                        placeholder="18:00"
                        className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">
                        Sunset Golden Hour
                      </label>
                      <input
                        type="text"
                        value={aiSunsetTime}
                        onChange={(e) => setAiSunsetTime(e.target.value)}
                        placeholder="17:45"
                        className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4a3b2c] mb-1">
                        Reception Style
                      </label>
                      <select
                        value={aiStyle}
                        onChange={(e) => setAiStyle(e.target.value as any)}
                        className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl px-3 py-1.5 text-xs text-[#15110e] outline-none"
                      >
                        <option value="seated">Seated 3-Course Banquet</option>
                        <option value="cocktail">Cocktail &amp; Canapés</option>
                        <option value="buffet">Buffet &amp; Live Stations</option>
                        <option value="twilight">Twilight Black-Tie</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#4a3b2c]">Speeches Count:</span>
                      {[2, 3, 4, 5].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setAiSpeechesCount(cnt)}
                          className={\`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors \${
                            aiSpeechesCount === cnt
                              ? 'bg-[#15110e] text-[#dfc194]'
                              : 'bg-white border border-[#d5c7b5] text-[#6b5847] hover:bg-[#faf7f2]'
                          }\`}
                        >
                          {cnt} Toasts
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleRegenerateAiDraft}
                      className="px-3.5 py-1.5 bg-[#241c15] text-[#dfc194] hover:bg-[#382b21] rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <IconSparkles />
                      <span>Re-Generate Draft</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Tab 2: AI Document & Raw Text Parser */
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4a3b2c] mb-1">
                      Paste Schedule Notes or Itinerary (Emails, Word documents, Vendor timelines)
                    </label>
                    <textarea
                      rows={4}
                      value={aiRawText}
                      onChange={(e) => setAiRawText(e.target.value)}
                      placeholder={\`e.g.:
10:00am Hair and makeup setup
1:30pm Groom arrive at garden
3:00pm Ceremony begins - string quartet
3:45pm Confetti toss and family photos
5:30pm Bridal entrance to reception
6:15pm Speeches from parents
7:00pm Dinner served
8:30pm First dance and party begins\`}
                      className="w-full bg-[#faf8f5] border border-[#d5c7b5] focus:border-[#bd9661] rounded-xl p-3 text-xs text-[#15110e] font-mono outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#8b7b6b] hover:text-[#15110e] cursor-pointer">
                      <span>📁 Upload Timeline File (.txt, .csv)</span>
                      <input
                        type="file"
                        accept=".txt,.csv,.md"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => {
                              const content = re.target?.result as string;
                              if (content) {
                                setAiRawText(content);
                                const parsed = parseRawRunSheetText(content);
                                setAiParsedRows(parsed.map((p) => ({ ...p, selected: true })));
                                showToast(\`Parsed \${parsed.length} milestones from file\`, 'success');
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleParseRawText}
                      className="px-4 py-1.5 bg-[#241c15] text-[#dfc194] hover:bg-[#382b21] rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <IconSparkles />
                      <span>Parse with AI</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Review Table (For both tabs before saving) */}
              {aiParsedRows.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#e8ded0]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#15110e]">Mode:</span>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="aiImportMode"
                          checked={aiImportMode === 'replace'}
                          onChange={() => setAiImportMode('replace')}
                          className="accent-[#bd9661]"
                        />
                        <span>Replace sheet</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs ml-2">
                        <input
                          type="radio"
                          name="aiImportMode"
                          checked={aiImportMode === 'append'}
                          onChange={() => setAiImportMode('append')}
                          className="accent-[#bd9661]"
                        />
                        <span>Append to current</span>
                      </label>
                    </div>
                    <span className="text-[11px] text-[#8b7b6b]">
                      {aiParsedRows.filter((r) => r.selected).length} activities ready to save
                    </span>
                  </div>

                  <div className="border border-[#e8ded0] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#faf8f5] border-b border-[#e8ded0] text-[#7d6c5b] sticky top-0">
                        <tr>
                          <th className="p-2 w-8 text-center">
                            <input
                              type="checkbox"
                              checked={aiParsedRows.length > 0 && aiParsedRows.every((r) => r.selected)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setAiParsedRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
                              }}
                              className="accent-[#bd9661]"
                            />
                          </th>
                          <th className="p-2 w-20">Time</th>
                          <th className="p-2">Milestone / Activity</th>
                          <th className="p-2 w-36">Vendor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ebdcc9]/60">
                        {aiParsedRows.map((row, idx) => (
                          <tr key={idx} className={row.selected ? 'bg-white' : 'bg-[#f7f4ee]/70 opacity-60'}>
                            <td className="p-1.5 text-center">
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setAiParsedRows((prev) =>
                                    prev.map((r, i) => (i === idx ? { ...r, selected: checked } : r))
                                  );
                                }}
                                className="accent-[#bd9661]"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.time}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAiParsedRows((prev) =>
                                    prev.map((r, i) => (i === idx ? { ...r, time: val } : r))
                                  );
                                }}
                                className="w-16 bg-[#faf8f5] border border-[#d5c7b5] rounded px-1.5 py-0.5 font-mono font-bold text-xs"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.activity}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAiParsedRows((prev) =>
                                    prev.map((r, i) => (i === idx ? { ...r, activity: val } : r))
                                  );
                                }}
                                className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded px-2 py-0.5 font-semibold text-xs text-[#15110e]"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.vendorRole || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAiParsedRows((prev) =>
                                    prev.map((r, i) => (i === idx ? { ...r, vendorRole: val } : r))
                                  );
                                }}
                                className="w-full bg-[#faf8f5] border border-[#d5c7b5] rounded px-1.5 py-0.5 text-xs text-[#6b5847]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#e8ded0] bg-[#faf8f5] flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 border border-[#d5c7b5] text-[#15110e] hover:bg-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={aiParsedRows.filter((r) => r.selected).length === 0}
                onClick={handleApplyAiRows}
                className="px-5 py-2 bg-[#bd9661] disabled:opacity-40 hover:bg-[#a8824f] text-[#15110e] font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Save {aiParsedRows.filter((r) => r.selected).length} Activities to Day Sheet &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

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
                    value={\`https://taptoast.app/schedule/\${wedding.id || 'w1'}/vendor-access?token=vlive_2026\`}
                    className="flex-1 bg-white border border-[#d5c7b5] rounded-xl px-3 py-2 text-xs font-mono text-[#15110e] select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        \`https://taptoast.app/schedule/\${wedding.id || 'w1'}/vendor-access?token=vlive_2026\`
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
    </section>`;

content = content.replace('    </section>', modalsBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated PlannerDaySheetSection.tsx!');
