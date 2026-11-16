const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to localhost:5173...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Navigate to Planner Day Sheet
  console.log('Switching to Planner Day Sheet...');
  // Click on view switcher demo bar or directly open Planner view
  const plannerBtn = await page.$('button:has-text("Planner View"), button:has-text("Day Sheet"), [title*="Planner"]');
  if (plannerBtn) {
    await plannerBtn.click();
    await page.waitForTimeout(800);
  } else {
    // If there is a demo bar at top, select planner
    const select = await page.$('select');
    if (select) {
      await select.selectOption({ label: 'Wedding Planner' }).catch(() => {});
    }
  }

  // Click on "Run Sheet" or "Day Sheet" tab if needed
  const runsheetTab = await page.$('button:has-text("Run Sheet"), button:has-text("Day Sheet")');
  if (runsheetTab) {
    await runsheetTab.click();
    await page.waitForTimeout(800);
  }

  // Take screenshot of Planner Day Sheet with header buttons and MC cues
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '52_planner_daysheet_overview.png') });
  console.log('Saved 52_planner_daysheet_overview.png');

  // 2. Open "Request Change" modal on an MC Cue
  const reqChangeBtn = await page.$('button:has-text("Request Change")');
  if (reqChangeBtn) {
    await reqChangeBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '53_planner_request_change_modal.png') });
    console.log('Saved 53_planner_request_change_modal.png');

    // Fill in proposed change and send
    const timeInput = await page.$('input[placeholder="e.g. 18:45"]');
    if (timeInput) {
      await timeInput.fill('18:45');
    }
    const noteInput = await page.$('textarea[placeholder*="kitchen needs"]');
    if (noteInput) {
      await noteInput.fill('Kitchen needs 15 additional minutes for main course resting. Please slide speeches to 18:45.');
    }
    const submitBtn = await page.$('button:has-text("Send Change Request to MC")');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // 3. Open Standard Template Import Modal
  const importTplBtn = await page.$('button:has-text("Import Template")');
  if (importTplBtn) {
    await importTplBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '54_runsheet_template_library_modal.png') });
    console.log('Saved 54_runsheet_template_library_modal.png');
    const closeBtn = await page.$('button:has-text("Cancel"), button[title="Close"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 4. Open Cheers AI Modal
  const cheersAiBtn = await page.$('button:has-text("Cheers AI")');
  if (cheersAiBtn) {
    await cheersAiBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '55_cheers_ai_runsheet_modal.png') });
    console.log('Saved 55_cheers_ai_runsheet_modal.png');
    const closeBtn = await page.$('button:has-text("Cancel"), button[title="Close"]');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 5. Open Share Vendor Copy Modal
  const shareVendorBtn = await page.$('button:has-text("Share Vendor Copy")');
  if (shareVendorBtn) {
    await shareVendorBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '56_vendor_share_modal.png') });
    console.log('Saved 56_vendor_share_modal.png');
    const closeBtn = await page.$('button:has-text("Close")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 6. Switch to MC Run Sheet View (to test MC receiving and accepting the change request)
  console.log('Switching to MC Run Sheet view...');
  // Click on role switcher in demo bar or select MC
  const mcRoleBtn = await page.$('button:has-text("MC View"), button:has-text("Master of Ceremonies")');
  if (mcRoleBtn) {
    await mcRoleBtn.click();
    await page.waitForTimeout(800);
  } else {
    // Try navigation directly to MC tab in CoupleView
    await page.evaluate(() => {
      window.location.hash = '#mc-runsheet';
    });
    await page.waitForTimeout(800);
  }

  // Locate the MC Run Sheet tab
  const mcTab = await page.$('button:has-text("Run Sheet"), button:has-text("MC Run Sheet")');
  if (mcTab) {
    await mcTab.click();
    await page.waitForTimeout(800);
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '57_mc_runsheet_change_alert.png') });
  console.log('Saved 57_mc_runsheet_change_alert.png');

  // Click "Accept Change" on the pending change request card
  const acceptChangeBtn = await page.$('button:has-text("Accept Change")');
  if (acceptChangeBtn) {
    await acceptChangeBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '58_mc_runsheet_accepted.png') });
    console.log('Saved 58_mc_runsheet_accepted.png');
  }

  // 7. Test Seating Studio: Zoom Controls, Oval Tables, Tablemate Visibility
  console.log('Navigating to Seating Studio...');
  const seatingTab = await page.$('button:has-text("Seating"), button:has-text("Seating Studio")');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
  }

  // Zoom to 65% Overall
  const overallZoomBtn = await page.$('button:has-text("Overall (65%)")');
  if (overallZoomBtn) {
    await overallZoomBtn.click();
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '59_seating_studio_zoom_overall.png') });
  console.log('Saved 59_seating_studio_zoom_overall.png');

  // Zoom back to 100% or Detailed (135%)
  const detailedZoomBtn = await page.$('button:has-text("Detailed (135%)")');
  if (detailedZoomBtn) {
    await detailedZoomBtn.click();
    await page.waitForTimeout(500);
  }

  // Click on Table 7 (Oval Table) to open Level 2 Detail View
  const table7 = await page.$('div:has-text("Table 7")');
  if (table7) {
    await table7.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '60_seating_studio_oval_table_detail.png') });
    console.log('Saved 60_seating_studio_oval_table_detail.png');

    // Close detail view
    const backBtn = await page.$('button:has-text("Back to Room"), button:has-text("Return")');
    if (backBtn) await backBtn.click();
    await page.waitForTimeout(500);
  }

  // Open "+ Add Table" modal to verify Oval option
  const addTableBtn = await page.$('button:has-text("Add Table")');
  if (addTableBtn) {
    await addTableBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '61_seating_studio_add_oval_modal.png') });
    console.log('Saved 61_seating_studio_add_oval_modal.png');
    const closeBtn = await page.$('button:has-text("×"), button:has-text("Cancel")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // Toggle Tablemates to Private (Hidden)
  const tablemateToggleBtn = await page.$('button:has-text("Tablemates:")');
  if (tablemateToggleBtn) {
    await tablemateToggleBtn.click();
    await page.waitForTimeout(600);
  }

  // 8. Test Guest Mobile View with Tablemates Private vs Visible
  console.log('Testing Guest Mobile View...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 }); // iPhone dimensions
  await mobilePage.goto('http://127.0.0.1:5173/#guest', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Switch to Table tab
  const tableNavBtn = await mobilePage.$('button:has-text("Table"), div:has-text("Table"), button[aria-label*="Table"]');
  if (tableNavBtn) {
    await tableNavBtn.click();
    await mobilePage.waitForTimeout(800);
  }

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '62_guest_mobile_tablemates_private.png') });
  console.log('Saved 62_guest_mobile_tablemates_private.png');

  // Now switch back to Seating Studio, toggle tablemates to Visible, and re-capture
  if (tablemateToggleBtn) {
    await tablemateToggleBtn.click();
    await page.waitForTimeout(600);
  }

  await mobilePage.reload({ waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  const tableNavBtn2 = await mobilePage.$('button:has-text("Table"), div:has-text("Table"), button[aria-label*="Table"]');
  if (tableNavBtn2) {
    await tableNavBtn2.click();
    await mobilePage.waitForTimeout(800);
  }
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, '63_guest_mobile_tablemates_visible.png') });
  console.log('Saved 63_guest_mobile_tablemates_visible.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
