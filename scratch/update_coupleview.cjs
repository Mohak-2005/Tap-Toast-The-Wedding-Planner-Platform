const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/CoupleView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports for runSheetTemplates
if (!content.includes('STANDARD_RUN_SHEET_TEMPLATES')) {
  content = content.replace(
    `import PlannerDaySheetSection from './PlannerDaySheetSection';`,
    `import PlannerDaySheetSection from './PlannerDaySheetSection';
import {
  STANDARD_RUN_SHEET_TEMPLATES,
  RunSheetTemplate,
  generateAiRunSheetDraft,
  parseRawRunSheetText,
} from '../lib/runSheetTemplates';`
  );
}

// 2. Add handlers and states for MC Accept/Decline and MC Templates/AI/Share
const targetHandlers = `  const handleDeleteCue = (cueId: string) => {
    const updated = runSheet.filter(c => c.id !== cueId);
    updateWeddingRunSheet(updated);
    showToast('Cue removed from run sheet', 'info');
  };`;

const newHandlers = `  const handleDeleteCue = (cueId: string) => {
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
    logAudit(state, setState, 'Change Request Accepted', 'Robert Galati', 'mc', \`Accepted planner change request for "\${cue.activity}": time set to \${cue.changeRequest.proposedTime}\`, 'Run Sheet');
    showToast(\`Accepted change request: updated to \${cue.changeRequest.proposedTime}\`, 'success');
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
    logAudit(state, setState, 'Change Request Declined', 'Robert Galati', 'mc', \`Declined planner change request for "\${cue.activity}"\`, 'Run Sheet');
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
    showToast(\`Imported \${newItems.length} cues from template\`, 'success');
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
    showToast(\`Saved \${newItems.length} AI activities to Run Sheet\`, 'success');
    setShowMcAiModal(false);
  };

  const [showMcShareModal, setShowMcShareModal] = useState(false);
  const [mcShareCopied, setMcShareCopied] = useState(false);`;

if (!content.includes('handleAcceptChangeRequest')) {
  content = content.replace(targetHandlers, newHandlers);
}

// 3. Add header buttons in MC Run Sheet tab
const oldMcHeaderButtons = `<div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white border border-[#d5c7b5] hover:bg-[#f5ede0] text-[#15110e] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg><span>Print Run Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCueModal(true)}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add Cue Entry</span>
                </button>
              </div>`;

const newMcHeaderButtons = `<div className="flex items-center gap-2 flex-wrap">
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
                  onClick={handleOpenMcAiModal}
                  className="bg-[#241c15] hover:bg-[#382b21] text-[#dfc194] border border-[#bd9661]/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Cheers AI timeline generator and parser"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>
                  <span>Cheers AI</span>
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
                  onClick={() => setShowAddCueModal(true)}
                  className="bg-[#bd9661] hover:bg-[#a8824f] text-[#15110e] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add Cue Entry</span>
                </button>
              </div>`;

if (!content.includes('setShowMcShareModal')) {
  content = content.replace(oldMcHeaderButtons, newMcHeaderButtons);
}

// 4. In each cue row in MC Run Sheet, render the Change Request Card from Planner
const oldCuePrivateNotes = `                          {/* Row 3: Private MC Stage & Audio Directions */}
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
                          </div>`;

const newCuePrivateNotes = `                          {/* Row 3: Private MC Stage & Audio Directions */}
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
                          )}`;

if (!content.includes('handleDeclineChangeRequest(cue.id)')) {
  content = content.replace(oldCuePrivateNotes, newCuePrivateNotes);
}

// 5. Add Tablemate Visibility Toggle to Settings tab
const oldTogglesTarget = `                  {
                    title: 'Guest Song Requests',
                    desc: 'Allow guests to submit song requests for the DJ / MC directly inside their digital itinerary.',
                    key: 'enableSongRequests' as const,
                  },`;

const newToggles = `                  {
                    title: 'Guest Song Requests',
                    desc: 'Allow guests to submit song requests for the DJ / MC directly inside their digital itinerary.',
                    key: 'enableSongRequests' as const,
                  },
                  {
                    title: 'Guest Tablemate Visibility',
                    desc: 'Allow guests to view their tablemates in their mobile guest hub. When disabled, guests only see their assigned table name & seat number while tablemates remain private.',
                    key: 'allowGuestsSeeTablemates' as const,
                  },`;

if (!content.includes('allowGuestsSeeTablemates')) {
  content = content.replace(oldTogglesTarget, newToggles);
}

// 6. Make sure weddingSettings toggle syncs with state.weddings allowGuestsSeeTablemates
const oldToggleSetting = `  const toggleSetting = (key: keyof typeof weddingSettings) => {
    setWeddingSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };`;

const newToggleSetting = `  const toggleSetting = (key: keyof typeof weddingSettings) => {
    const nextVal = !weddingSettings[key];
    setWeddingSettings((prev) => ({
      ...prev,
      [key]: nextVal,
    }));
    if (key === 'allowGuestsSeeTablemates') {
      const updatedWeddings = (state.weddings || []).map((w) =>
        w.id === wedding.id ? { ...w, allowGuestsSeeTablemates: nextVal } : w
      );
      setState({ ...state, weddings: updatedWeddings });
    }
  };`;

if (!content.includes('w.allowGuestsSeeTablemates: nextVal')) {
  content = content.replace(oldToggleSetting, newToggleSetting);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated CoupleView.tsx!');
