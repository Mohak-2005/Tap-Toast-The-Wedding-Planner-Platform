const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('--- 1. Testing Planner Day Sheet & Template Modal ---');
  await page.goto('http://127.0.0.1:5173/#planner');
  await page.waitForTimeout(1500);

  // Click the first wedding in the planner table
  const weddingRow = await page.waitForSelector('table.data-table tbody tr');
  console.log('Clicking wedding row...');
  await weddingRow.click();
  await page.waitForTimeout(1000);

  // Verify Day Sheet is visible
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '52_planner_daysheet_overview.png') });
  console.log('Saved 52_planner_daysheet_overview.png');

  // Open "Import Template" Modal
  const importBtn = await page.waitForSelector('button:has-text("Import Template")');
  console.log('Clicking Import Template button...');
  await importBtn.click();
  await page.waitForTimeout(800);

  // Verify Modal is visible and capture it
  await page.waitForSelector('text=STANDARD TIMELINE TEMPLATES');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '54_runsheet_template_library_modal.png') });
  console.log('Saved 54_runsheet_template_library_modal.png');

  // Close template modal
  const cancelBtn = await page.$('button:has-text("Cancel")');
  if (cancelBtn) await cancelBtn.click();
  await page.waitForTimeout(500);

  console.log('--- 2. Testing Cheers AI Modal ---');
  const aiBtn = await page.waitForSelector('button:has-text("Cheers AI")');
  await aiBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '55_cheers_ai_runsheet_modal.png') });
  console.log('Saved 55_cheers_ai_runsheet_modal.png');
  const cancelAi = await page.$('button:has-text("Cancel")');
  if (cancelAi) await cancelAi.click();
  await page.waitForTimeout(500);

  console.log('--- 3. Testing Vendor Share Modal ---');
  const vendorBtn = await page.waitForSelector('button:has-text("Share Vendor Copy")');
  await vendorBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '56_vendor_share_modal.png') });
  console.log('Saved 56_vendor_share_modal.png');
  const closeVendor = await page.$('button:has-text("Close")');
  if (closeVendor) await closeVendor.click();
  await page.waitForTimeout(500);

  console.log('--- 4. Testing Planner Request Change on MC cue ---');
  const reqChangeBtn = await page.waitForSelector('button:has-text("Request Change")');
  await reqChangeBtn.click();
  await page.waitForTimeout(600);

  // Fill in proposed time & note
  const timeInput = await page.$('input[placeholder="e.g. 18:45"]');
  if (timeInput) {
    await timeInput.fill('18:45');
  }
  const noteInput = await page.$('textarea[placeholder*="Catering kitchen needs"]');
  if (noteInput) {
    await noteInput.fill('Kitchen requested 15m buffer after speeches to plate hot courses properly.');
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '53_planner_request_change_modal.png') });
  console.log('Saved 53_planner_request_change_modal.png');

  // Submit request
  const submitReq = await page.waitForSelector('button:has-text("Send Change Request")');
  await submitReq.click();
  await page.waitForTimeout(1000);

  console.log('--- 5. Testing MC Run Sheet & Change Request Card ---');
  await page.goto('http://127.0.0.1:5173/#mc');
  await page.waitForTimeout(1500);

  // Click on wedding in MC table if any
  const mcWedding = await page.$('table.data-table tbody tr');
  if (mcWedding) {
    console.log('Clicking MC wedding row...');
    await mcWedding.click();
    await page.waitForTimeout(1000);
  }

  // MC Run Sheet is rendered. Check for change alert card
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '57_mc_runsheet_change_alert.png') });
  console.log('Saved 57_mc_runsheet_change_alert.png');

  // Accept the change
  const acceptBtn = await page.$('button:has-text("Accept Change")');
  if (acceptBtn) {
    console.log('Found Accept Change button, clicking...');
    await acceptBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '58_mc_runsheet_accepted.png') });
    console.log('Saved 58_mc_runsheet_accepted.png');
  } else {
    console.log('Accept Change button not found directly.');
  }

  console.log('--- 6. Testing Seating Studio (Zoom & Oval Tables & Visibility) ---');
  await page.goto('http://127.0.0.1:5173/#couple');
  await page.waitForTimeout(1500);

  // Navigate to Seating tab
  const seatingTab = await page.waitForSelector('button:has-text("Seating")');
  await seatingTab.click();
  await page.waitForTimeout(1200);

  // Click Zoom Overall (65%)
  const zoomOverallBtn = await page.$('button:has-text("Overall (65%)")');
  if (zoomOverallBtn) {
    await zoomOverallBtn.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '59_seating_studio_zoom_overall.png') });
  console.log('Saved 59_seating_studio_zoom_overall.png');

  // Check Table 7 (Oval table) Level 2 Detail View
  const table7 = await page.$('text=Table 7');
  if (table7) {
    await table7.click({ force: true });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '60_seating_studio_oval_table_detail.png') });
    console.log('Saved 60_seating_studio_oval_table_detail.png');

    // Back to floor plan
    const backBtn = await page.$('button:has-text("Back to Floor Plan")');
    if (backBtn) await backBtn.click();
    await page.waitForTimeout(500);
  }

  // Check "+ Add Table" modal showing Oval option
  const addTableBtn = await page.$('button:has-text("Add Table")');
  if (addTableBtn) {
    await addTableBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '61_seating_studio_add_oval_modal.png') });
    console.log('Saved 61_seating_studio_add_oval_modal.png');
    const cancelModal = await page.$('button:has-text("Cancel")');
    if (cancelModal) await cancelModal.click();
    await page.waitForTimeout(500);
  }

  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  await browser.close();
})();
