const fs = require('fs');

let content = fs.readFileSync('src/components/CoupleView.tsx', 'utf8');

// 1. Add import
if (!content.includes('CheersAiRunSheetChatbot')) {
  content = content.replace(
    "import { STANDARD_RUN_SHEET_TEMPLATES, generateAiRunSheetDraft, parseRawRunSheetText } from '../lib/runSheetTemplates';",
    "import { STANDARD_RUN_SHEET_TEMPLATES, generateAiRunSheetDraft, parseRawRunSheetText } from '../lib/runSheetTemplates';\r\nimport { CheersAiRunSheetChatbot } from './CheersAiRunSheetChatbot';"
  );
}

// 2. Add handleApplyMcAiChatbotItems
const targetHandler = `  const handleApplyMcAiRows = () => {`;
const newHandler = `  const handleApplyMcAiChatbotItems = (
    items: Array<Omit<PrivateRunSheetItem, 'id' | 'order' | 'done'>>,
    mode: 'replace' | 'append'
  ) => {
    const newItems: PrivateRunSheetItem[] = items.map((item, idx) => ({
      id: 'mc_ai_' + Date.now() + '_' + idx,
      time: item.time,
      activity: item.activity,
      notes: item.notes || '',
      privateNotes: item.privateNotes || '',
      done: false,
      order: idx + 1,
      section: item.section || 'afternoon',
    }));

    let updatedList: PrivateRunSheetItem[];
    if (mode === 'replace') {
      updatedList = newItems;
    } else {
      updatedList = [...(wedding.privateRunSheet || []), ...newItems];
    }

    wedding.privateRunSheet = updatedList;
    const updatedWeddings = (state.weddings || []).map((w: any) =>
      w.id === wedding.id ? { ...w, privateRunSheet: updatedList } : w
    );
    setState({ ...state, weddings: updatedWeddings });
    logAudit(
      state,
      setState,
      'Cheers AI MC Run Sheet Saved',
      'Robert Galati (MC)',
      'mc',
      \`Saved \${newItems.length} activities via Cheers AI Chatbot (\${mode} mode)\`,
      'Run Sheet'
    );
    showToast(\`Saved \${newItems.length} activities to MC Run Sheet\`, 'success');
  };

  const handleApplyMcAiRows = () => {`;

if (content.includes(targetHandler)) {
  content = content.replace(targetHandler, newHandler);
}

// 3. Replace static modal
const oldStart = '{/* MC Cheers AI Modal */}';
const oldEnd = '{/* MC Share Vendor Copy Modal */}';

const idxStart = content.indexOf(oldStart);
const idxEnd = content.indexOf(oldEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const replacement = `{/* MC Cheers AI Chatbot with Chat & File Upload */}
            <CheersAiRunSheetChatbot
              isOpen={showMcAiModal}
              onClose={() => setShowMcAiModal(false)}
              onApply={handleApplyMcAiChatbotItems}
              title="Cheers AI • MC Run Sheet & Cues Assistant"
              context="mc"
            />

            `;

  content = content.slice(0, idxStart) + replacement + content.slice(idxEnd);
  console.log('✓ Successfully replaced MC static modal with CheersAiRunSheetChatbot');
} else {
  console.warn('✗ Could not find MC modal slice indices', idxStart, idxEnd);
}

fs.writeFileSync('src/components/CoupleView.tsx', content, 'utf8');
console.log('Updated CoupleView.tsx for MC Cheers AI');
