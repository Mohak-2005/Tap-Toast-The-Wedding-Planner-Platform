const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Navigating to Couple Dashboard...');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Check sidebar navigation items
  const sidebarText = await page.textContent('aside');
  console.log('Sidebar contains "Run Sheet":', sidebarText.includes('Run Sheet'));
  console.log('Sidebar contains "Vendor Documents":', sidebarText.includes('Vendor Documents'));

  // 2. Click "Run Sheet" tab
  console.log('2. Clicking "Run Sheet" tab...');
  const runSheetTab = page.locator('aside button').filter({ hasText: 'Run Sheet' });
  await runSheetTab.click();
  await page.waitForTimeout(1000);

  // Check header
  const runSheetHeader = await page.textContent('h1');
  console.log('Run Sheet Header:', runSheetHeader);

  // Click "Export / Download" dropdown
  const exportBtn = page.locator('button').filter({ hasText: 'Export / Download' });
  await exportBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '90_couple_runsheet_tab.png'), fullPage: false });
  console.log('Saved 90_couple_runsheet_tab.png');

  // Close dropdown
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 3. Click "Vendor Documents" tab
  console.log('3. Clicking "Vendor Documents" tab...');
  const vendorDocsTab = page.locator('aside button').filter({ hasText: 'Vendor Documents' });
  await vendorDocsTab.click();
  await page.waitForTimeout(1000);

  const vendorDocsHeader = await page.textContent('h1');
  console.log('Vendor Docs Header:', vendorDocsHeader);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '91_couple_vendor_documents_tab.png'), fullPage: false });
  console.log('Saved 91_couple_vendor_documents_tab.png');

  // 4. Test "Upload Vendor Document" Modal
  console.log('4. Testing Upload Vendor Document modal...');
  const uploadDocBtn = page.locator('button').filter({ hasText: 'Upload Vendor Document' }).first();
  await uploadDocBtn.click();
  await page.waitForTimeout(600);

  // Fill in modal
  await page.fill('input[placeholder*="Willow & Wolf"]', 'Luxe Photobooths Australia');
  const categorySelect = page.locator('form select').nth(0);
  await categorySelect.selectOption('Music & Entertainment');
  await page.fill('input[placeholder*="Public Liability"]', 'Public Liability Certificate ($10M)');
  await page.fill('input[placeholder*="PL-AU-883910-X"]', 'LUXE-PL-2026-99');
  await page.fill('input[type="date"]', '2027-06-30');
  await page.fill('textarea[placeholder*="Required by venue"]', 'Required for indoor ballroom setup near main dance floor.');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '92_vendor_document_modal.png'), fullPage: false });
  console.log('Saved 92_vendor_document_modal.png');

  // Submit modal
  const saveDocBtn = page.locator('button').filter({ hasText: 'Save Document to Vault' });
  await saveDocBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '93_vendor_document_added_success.png'), fullPage: false });
  console.log('Saved 93_vendor_document_added_success.png');

  // 5. Verify MC role view
  console.log('5. Verifying MC view at #mc...');
  await page.goto('http://127.0.0.1:5173/#mc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '94_mc_view_preserved.png'), fullPage: false });
  console.log('Saved 94_mc_view_preserved.png');

  // 6. Verify Planner role view
  console.log('6. Verifying Planner view at #planner...');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '95_planner_view_preserved.png'), fullPage: false });
  console.log('Saved 95_planner_view_preserved.png');

  await browser.close();
  console.log('All automated verifications complete!');
})();
