const fs = require('fs');

let content = fs.readFileSync('src/components/PlannerDaySheetSection.tsx', 'utf8');

const oldModalStart = '{/* 7. Cheers AI Run Sheet Modal (Draft Generator & Raw Import) */}';
const oldModalEnd = '{/* 8. Share Vendor Copy Modal (Clean read-only schedule for external vendors) */}';

const idxStart = content.indexOf(oldModalStart);
const idxEnd = content.indexOf(oldModalEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const replacement = `{/* 7. Cheers AI Run Sheet Chatbot with Chat & File Upload */}
      <CheersAiRunSheetChatbot
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApply={handleApplyAiChatbotItems}
        title="Cheers AI • Wedding Day Sheet Assistant"
        context="planner"
      />

      {/* Floating Cheers AI Launcher Button */}
      {!showAiModal && (
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#15110e] text-[#dfc194] hover:text-white border-2 border-[#bd9661] hover:border-[#dfc194] px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer font-serif font-bold text-sm tracking-wide"
          title="Open Cheers AI Chatbot"
        >
          <span className="text-lg">🥂</span>
          <span>Cheers AI</span>
        </button>
      )}

      `;

  content = content.slice(0, idxStart) + replacement + content.slice(idxEnd);
  console.log('✓ Successfully replaced static modal with CheersAiRunSheetChatbot');
  fs.writeFileSync('src/components/PlannerDaySheetSection.tsx', content, 'utf8');
} else {
  console.warn('✗ Could not find modal slice indices', idxStart, idxEnd);
}
