const fs = require('fs');
let content = fs.readFileSync('src/components/PlannerDaySheetSection.tsx', 'utf8');
const target = "import { showToast, logAudit, useAppState } from '../lib/state';";
const replacement = "import { showToast, logAudit, useAppState } from '../lib/state';\r\nimport { STANDARD_RUN_SHEET_TEMPLATES, generateAiRunSheetDraft, parseRawRunSheetText } from '../lib/runSheetTemplates';";

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/PlannerDaySheetSection.tsx', content, 'utf8');
  console.log('SUCCESSFULLY_UPDATED');
} else {
  console.log('TARGET_NOT_FOUND');
}
