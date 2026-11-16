const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to Planner Day Sheet...');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // If on wedding selection, click "Sophie & James"
  const weddingCard = await page.$('text=Sophie & James');
  if (weddingCard) {
    await weddingCard.click();
    await page.waitForTimeout(1000);
  }

  // 1. Planner Overview
  console.log('Capturing 52_planner_daysheet_overview.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '52_planner_daysheet_overview.png') });

  // 2. Open "Request Change" Modal on MC Cue
  console.log('Opening Request Change modal...');
  const reqBtn = await page.$('button:has-text("Request Change")');
  if (reqBtn) {
    await reqBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 53_planner_request_change_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '53_planner_request_change_modal.png') });

    // Fill in change
    const timeInp = await page.$('input[placeholder="e.g. 18:45"]');
    if (timeInp) await timeInp.fill('18:45');
    const noteArea = await page.$('textarea[placeholder*="kitchen needs"]');
    if (noteArea) await noteArea.fill('Kitchen needs 15 additional minutes for main course rest. Please slide speeches to 18:45.');

    const sendBtn = await page.$('button:has-text("Send Change Request to MC")');
    if (sendBtn) {
      await sendBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // 3. Open Template Modal
  console.log('Opening Template Modal...');
  const tplBtn = await page.$('button:has-text("Import Template")');
  if (tplBtn) {
    await tplBtn.click();
    await page.waitForTimeout(700);
    console.log('Capturing 54_runsheet_template_library_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '54_runsheet_template_library_modal.png') });

    const closeBtn = await page.$('div:has-text("Import Run Sheet Template") >> button:has-text("Cancel")');
    if (closeBtn) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);
  }

  // 4. Open Cheers AI Modal
  console.log('Opening Cheers AI Modal...');
  const aiBtn = await page.$('button:has-text("Cheers AI")');
  if (aiBtn) {
    await aiBtn.click();
    await page.waitForTimeout(700);
    console.log('Capturing 55_cheers_ai_runsheet_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '55_cheers_ai_runsheet_modal.png') });

    const closeBtn = await page.$('div:has-text("AI Run Sheet Generator") >> button:has-text("Cancel")');
    if (closeBtn) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);
  }

  // 5. Open Share Vendor Copy Modal
  console.log('Opening Share Vendor Copy Modal...');
  const shareBtn = await page.$('button:has-text("Share Vendor Copy")');
  if (shareBtn) {
    await shareBtn.click();
    await page.waitForTimeout(700);
    console.log('Capturing 56_vendor_share_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '56_vendor_share_modal.png') });

    const closeBtn = await page.$('button:has-text("Close")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(600);
  }

  // 6. Navigate to MC Pro View WITHOUT full page reload (using DemoBar link)
  console.log('Switching to MC Pro View via DemoBar...');
  const mcDemoBtn = await page.$('button:has-text("MC Pro")');
  if (mcDemoBtn) {
    await mcDemoBtn.click();
    await page.waitForTimeout(1000);
  } else {
    await page.goto('http://127.0.0.1:5173/#mc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  }

  // Select "Sophie & James" if on weddings list
  const mcWedding = await page.$('text=Sophie & James');
  if (mcWedding) {
    await mcWedding.click();
    await page.waitForTimeout(1000);
  }

  // Ensure on "Run Sheet" tab
  const mcRunSheetTab = await page.$('button:has-text("Run Sheet")');
  if (mcRunSheetTab) {
    await mcRunSheetTab.click().catch(() => {});
    await page.waitForTimeout(800);
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

  // 7. Navigate to Couple Dashboard -> Seating Studio
  console.log('Switching to Couple Dashboard via DemoBar...');
  const coupleDemoBtn = await page.$('button:has-text("Couple Dashboard")');
  if (coupleDemoBtn) {
    await coupleDemoBtn.click();
    await page.waitForTimeout(1000);
  } else {
    await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  }

  const seatingTab = await page.$('button:has-text("Seating"), [aria-label*="Seating"]');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
  }

  // Overall (65%) zoom
  const zoom65 = await page.$('button:has-text("Overall (65%)")');
  if (zoom65) {
    await zoom65.click();
    await page.waitForTimeout(600);
  }
  console.log('Capturing 59_seating_studio_zoom_overall.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '59_seating_studio_zoom_overall.png') });

  // Reset to 100%
  const zoom100 = await page.$('button:has-text("100%")');
  if (zoom100) {
    await zoom100.click();
    await page.waitForTimeout(600);
  }

  // Open Table 7 (Oval Table)
  const table7 = await page.$('div:has-text("Table 7")');
  if (table7) {
    await table7.click();
    await page.waitForTimeout(800);
    console.log('Capturing 60_seating_studio_oval_table_detail.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '60_seating_studio_oval_table_detail.png') });

    const backBtn = await page.$('button:has-text("Back to Room"), button:has-text("Return")');
    if (backBtn) await backBtn.click();
    await page.waitForTimeout(600);
  }

  // Open "+ Add Table"
  const addTblBtn = await page.$('button:has-text("Add Table")');
  if (addTblBtn) {
    await addTblBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 61_seating_studio_add_oval_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '61_seating_studio_add_oval_modal.png') });

    const closeBtn = await page.$('div:has-text("Add New Reception Table") >> button:has-text("×"), div:has-text("Add New Reception Table") >> button:has-text("Cancel")');
    if (closeBtn) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(600);
  }

  // Toggle Tablemates to Private (Hidden)
  const tablematesBtn = await page.$('button:has-text("Tablemates:")');
  if (tablematesBtn) {
    await tablematesBtn.click();
    await page.waitForTimeout(600);
    console.log('Capturing 62_seating_studio_tablemates_private.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '62_seating_studio_tablemates_private.png') });
  }

  // 8. Guest Mobile View
  console.log('Opening Guest Mobile View in mobile viewport...');
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

  // Toggle Tablemates back to Visible in Seating Studio
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
  console.log('Done capturing clean modals and views!');
}

main().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
