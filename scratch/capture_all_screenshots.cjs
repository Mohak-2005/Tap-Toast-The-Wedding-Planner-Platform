const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Navigating to Planner View...');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on "Sophie & James" wedding card if on weddings selection list
  const weddingCard = await page.$('text=Sophie & James, text=Open Day Sheet, text=Manage Day Sheet');
  if (weddingCard) {
    await weddingCard.click();
    await page.waitForTimeout(1000);
  }

  // Switch to Day Sheet tab if not on it
  const daySheetTab = await page.$('button:has-text("Day Sheet"), button:has-text("Run Sheet")');
  if (daySheetTab) {
    await daySheetTab.click().catch(() => {});
    await page.waitForTimeout(600);
  }

  console.log('Capturing 52_planner_daysheet_overview.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '52_planner_daysheet_overview.png') });

  // 2. Click "Request Change" on an MC Cue
  console.log('Opening Request Change modal...');
  const reqBtn = await page.$('button:has-text("Request Change")');
  if (reqBtn) {
    await reqBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 53_planner_request_change_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '53_planner_request_change_modal.png') });

    // Fill in proposed change
    const timeInput = await page.$('input[placeholder="e.g. 18:45"]');
    if (timeInput) await timeInput.fill('18:45');
    const noteArea = await page.$('textarea[placeholder*="kitchen needs"]');
    if (noteArea) await noteArea.fill('Kitchen needs 15 additional minutes for main course rest. Please slide speeches to 18:45.');

    const sendBtn = await page.$('button:has-text("Send Change Request to MC")');
    if (sendBtn) {
      await sendBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // 3. Open Import Template Modal
  console.log('Opening Template Modal...');
  const tplBtn = await page.$('button:has-text("Import Template")');
  if (tplBtn) {
    await tplBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 54_runsheet_template_library_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '54_runsheet_template_library_modal.png') });

    const closeBtn = await page.$('button:has-text("Cancel"), button[title="Close"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 4. Open Cheers AI Modal
  console.log('Opening Cheers AI Modal...');
  const aiBtn = await page.$('button:has-text("Cheers AI")');
  if (aiBtn) {
    await aiBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 55_cheers_ai_runsheet_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '55_cheers_ai_runsheet_modal.png') });

    const closeBtn = await page.$('button:has-text("Cancel"), button[title="Close"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 5. Open Share Vendor Copy Modal
  console.log('Opening Share Vendor Copy Modal...');
  const shareBtn = await page.$('button:has-text("Share Vendor Copy")');
  if (shareBtn) {
    await shareBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 56_vendor_share_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '56_vendor_share_modal.png') });

    const closeBtn = await page.$('button:has-text("Close")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 6. Switch to MC Pro View
  console.log('Navigating to MC Pro View...');
  await page.goto('http://127.0.0.1:5173/#mc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const mcWeddingCard = await page.$('text=Sophie & James, text=Open Run Sheet, text=Run Sheet');
  if (mcWeddingCard) {
    await mcWeddingCard.click();
    await page.waitForTimeout(1000);
  }

  const mcRunSheetTab = await page.$('button:has-text("Run Sheet"), button:has-text("Private Run Sheet")');
  if (mcRunSheetTab) {
    await mcRunSheetTab.click().catch(() => {});
    await page.waitForTimeout(600);
  }

  console.log('Capturing 57_mc_runsheet_change_alert.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '57_mc_runsheet_change_alert.png') });

  // Click "Accept Change"
  const acceptBtn = await page.$('button:has-text("Accept Change")');
  if (acceptBtn) {
    await acceptBtn.click();
    await page.waitForTimeout(800);
    console.log('Capturing 58_mc_runsheet_accepted.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '58_mc_runsheet_accepted.png') });
  }

  // 7. Seating Studio
  console.log('Navigating to Seating Studio...');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const seatingTab = await page.$('button:has-text("Seating"), [aria-label*="Seating"]');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
  }

  // Overall (65%) zoom
  const zoom65 = await page.$('button:has-text("Overall (65%)")');
  if (zoom65) {
    await zoom65.click();
    await page.waitForTimeout(500);
  }
  console.log('Capturing 59_seating_studio_zoom_overall.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '59_seating_studio_zoom_overall.png') });

  // Reset to 100%
  const zoom100 = await page.$('button:has-text("100%")');
  if (zoom100) {
    await zoom100.click();
    await page.waitForTimeout(500);
  }

  // Open Table 7 (Oval Banquet Table)
  const table7 = await page.$('div:has-text("Table 7")');
  if (table7) {
    await table7.click();
    await page.waitForTimeout(800);
    console.log('Capturing 60_seating_studio_oval_table_detail.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '60_seating_studio_oval_table_detail.png') });

    const backBtn = await page.$('button:has-text("Back to Room"), button:has-text("Return")');
    if (backBtn) await backBtn.click();
    await page.waitForTimeout(500);
  }

  // Open "+ Add Table"
  const addTblBtn = await page.$('button:has-text("Add Table")');
  if (addTblBtn) {
    await addTblBtn.click();
    await page.waitForTimeout(500);
    console.log('Capturing 61_seating_studio_add_oval_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '61_seating_studio_add_oval_modal.png') });

    const closeBtn = await page.$('button:has-text("×"), button:has-text("Cancel")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // Toggle Tablemates to Private
  const tablematesBtn = await page.$('button:has-text("Tablemates:")');
  if (tablematesBtn) {
    await tablematesBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 62_seating_studio_tablemates_toggled.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '62_seating_studio_tablemates_toggled.png') });
  }

  // 8. Guest Mobile View
  console.log('Opening Guest Mobile View...');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:5173/#guest-mobile', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Click on "Table" tab
  const mobileTableTab = await mobilePage.$('button:has-text("Table"), div:has-text("Table"), [aria-label*="Table"]');
  if (mobileTableTab) {
    await mobileTableTab.click();
    await mobilePage.waitForTimeout(800);
  }

  console.log('Capturing 63_guest_mobile_tablemates_private.png...');
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '63_guest_mobile_tablemates_private.png') });

  // Toggle Tablemates back to Visible
  if (tablematesBtn) {
    await tablematesBtn.click();
    await page.waitForTimeout(600);
  }

  await mobilePage.reload({ waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  const mobileTableTab2 = await mobilePage.$('button:has-text("Table"), div:has-text("Table"), [aria-label*="Table"]');
  if (mobileTableTab2) {
    await mobileTableTab2.click();
    await mobilePage.waitForTimeout(800);
  }

  console.log('Capturing 64_guest_mobile_tablemates_visible.png...');
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '64_guest_mobile_tablemates_visible.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
