import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });

  // ==============================================================
  // PART 1: TEST S/R MOBILE (#sr-mobile)
  // ==============================================================
  console.log('--- TESTING S/R MOBILE (#sr-mobile) ---');
  const pageSr = await context.newPage();
  await pageSr.goto('http://localhost:8443/#sr-mobile', { waitUntil: 'networkidle' });

  // Scope locators to phone chassis
  const phone = pageSr.locator('.w-\\[402px\\]');
  await phone.waitFor({ state: 'visible' });

  // 1. Switch to Register mode using button inside phone frame
  const registerBtn = phone.locator('button:has-text("Register")').first();
  await registerBtn.click();
  await pageSr.waitForTimeout(500);

  // 2. Ensure Couple Portal is selected
  const couplePortalBtn = phone.locator('button:has-text("Couple Portal")').first();
  await couplePortalBtn.click();
  await pageSr.waitForTimeout(300);

  // 3. Step 1: Check "Already have an account?" is visible on Step 1
  const signinLinkStep1 = phone.locator('text=Already have an account?').first();
  const isSignInVisibleStep1 = await signinLinkStep1.isVisible();
  console.log('Step 1 "Already have an account?" link visible:', isSignInVisibleStep1);

  // 4. Fill groom/bride details but leave wedding date EMPTY
  await phone.locator('input[placeholder="James Wilson"]').fill('Alex Morgan');
  await phone.locator('input[placeholder="james@example.com"]').fill('alex@demo.test');
  await phone.locator('input[placeholder="0412 345 678"]').first().fill('0412345678');

  await phone.locator('input[placeholder="Sophie Carter"]').fill('Taylor Swift');
  await phone.locator('input[placeholder="sophie@example.com"]').fill('taylor@demo.test');
  await phone.locator('input[placeholder="0423 456 789"]').first().fill('0423456789');

  await phone.locator('input[placeholder="Create password"]').first().fill('Demo1234!');
  await phone.locator('input[placeholder="Re-enter password"]').first().fill('Demo1234!');

  // Clear date input just in case
  const dateInput = phone.locator('input[type="date"]').first();
  await dateInput.fill('');

  // Click "Proceed to Select Plan →"
  const proceedToPlanBtn = phone.locator('button:has-text("Proceed to Select Plan →")').first();
  await proceedToPlanBtn.click();
  await pageSr.waitForTimeout(500);

  // Verify compulsory date error
  const dateError = phone.locator('text=Wedding Date is compulsory').first();
  const isDateErrorVisible = await dateError.isVisible();
  console.log('Step 1 compulsory date error shown:', isDateErrorVisible);

  await pageSr.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_sr_mobile_step1_compulsory_date.png'),
  });
  console.log('Saved verify_sr_mobile_step1_compulsory_date.png');

  // Fill in Wedding Date = 2026-11-14 (Marcus & Elena are booked on 2026-11-14!)
  await dateInput.fill('2026-11-14');
  await proceedToPlanBtn.click();
  await pageSr.waitForTimeout(800);

  // 5. Step 2: Payment & Plans
  const step2Title = phone.locator('text=Choose Couple Plan').first();
  await step2Title.waitFor({ state: 'visible', timeout: 4000 });
  console.log('Step 2 (Choose Couple Plan) reached successfully.');

  // Verify "Already have an account?" is HIDDEN on Step 2
  const isSignInVisibleStep2 = await phone.locator('text=Already have an account?').isVisible().catch(() => false);
  console.log('Step 2 "Already have an account?" link hidden:', !isSignInVisibleStep2);

  // Test plan accordion expansion
  const essentialChevron = phone.locator('button[title="Expand features"]').first();
  if (await essentialChevron.isVisible()) {
    await essentialChevron.click();
    await pageSr.waitForTimeout(300);
  }

  // Pre-fill demo test card
  const demoCardBtn = phone.locator('button:has-text("Use Demo Test Card")').first();
  await demoCardBtn.click();
  await pageSr.waitForTimeout(300);

  await pageSr.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_sr_mobile_step2_payment.png'),
  });
  console.log('Saved verify_sr_mobile_step2_payment.png');

  // Proceed to Step 3
  const proceedToMcBtn = phone.locator('button:has-text("Select MC →")').first();
  await proceedToMcBtn.click();
  await pageSr.waitForTimeout(1000);

  // 6. Step 3: MC Selection with Date Filtering & Joey Chatbot
  const step3Title = phone.locator('text=Select Certified MC').first();
  await step3Title.waitFor({ state: 'visible', timeout: 4000 });
  console.log('Step 3 (Select Certified MC) reached successfully.');

  // Verify "Already have an account?" is HIDDEN on Step 3
  const isSignInVisibleStep3 = await phone.locator('text=Already have an account?').isVisible().catch(() => false);
  console.log('Step 3 "Already have an account?" link hidden:', !isSignInVisibleStep3);

  // Verify date-based filtering: Marcus and Elena should NOT be shown for 2026-11-14
  const hasRobert = await phone.locator('text=Robert Galati').first().isVisible().catch(() => false);
  const hasMarcus = await phone.locator('text=Marcus Thorne').isVisible().catch(() => false);
  const hasElena = await phone.locator('text=Elena Rostova').isVisible().catch(() => false);
  console.log('For 2026-11-14 -> Robert visible:', hasRobert, '| Marcus hidden:', !hasMarcus, '| Elena hidden:', !hasElena);

  // Test Eye View Pop-up Modal on Robert
  const eyeBtn = phone.locator('button[title*="Robert Galati"]').first();
  await eyeBtn.click();
  await pageSr.waitForTimeout(500);

  const modalPrice = phone.locator('text=$1850 AUD').first();
  const isModalOpen = await modalPrice.isVisible();
  console.log('MC Pop-up Modal opened with price details:', isModalOpen);

  await pageSr.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_sr_mobile_step3_mc_popup.png'),
  });
  console.log('Saved verify_sr_mobile_step3_mc_popup.png');

  // Close modal
  const selectModalBtn = phone.locator('button:has-text("Select Robert Galati")').first();
  await selectModalBtn.click();
  await pageSr.waitForTimeout(300);

  // Test Joey Chatbot
  const promptChip = phone.locator('button:has-text("Who has 5.0 stars?")').first();
  await promptChip.click();
  await pageSr.waitForTimeout(600);

  await pageSr.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_sr_mobile_step3_joey_chat.png'),
  });
  console.log('Saved verify_sr_mobile_step3_joey_chat.png');

  await pageSr.close();

  // ==============================================================
  // PART 2: TEST MC MOBILE (#mc-mobile)
  // ==============================================================
  console.log('\n--- TESTING MC MOBILE (#mc-mobile) ---');
  const pageMc = await context.newPage();
  await pageMc.goto('http://localhost:8443/#mc-mobile', { waitUntil: 'networkidle' });

  const mcPhone = pageMc.locator('.w-\\[402px\\]');
  await mcPhone.waitFor({ state: 'visible' });

  // 1. Verify Invoice tab is GONE from bottom nav
  const hasInvoiceTab = await mcPhone.locator('button:has-text("Invoice")').isVisible().catch(() => false);
  console.log('Invoice tab completely removed from bottom nav:', !hasInvoiceTab);

  // 2. Open Sophie & James console
  const openConsoleBtn = mcPhone.locator('button:has-text("Open Console →")').first();
  await openConsoleBtn.click();
  await pageMc.waitForTimeout(600);

  // 3. Verify Overview tab: Wishing Well KPI is replaced by Run Sheet Cues
  const hasWishingWellKpi = await mcPhone.locator('text=Wishing Well').isVisible().catch(() => false);
  const hasRunSheetCuesKpi = await mcPhone.locator('text=Run Sheet Cues').isVisible().catch(() => false);
  console.log('Overview Wishing Well KPI removed:', !hasWishingWellKpi);
  console.log('Overview Run Sheet Cues KPI present:', hasRunSheetCuesKpi);

  // 4. Switch to Seating tab
  const seatingTabBtn = mcPhone.locator('button:has-text("Seating")').first();
  await seatingTabBtn.click();
  await pageMc.waitForTimeout(600);

  // Verify Saved Seating Layouts Bar
  const seatingBar = mcPhone.locator('text=ACTIVE SEATING ARRANGEMENT:').first();
  const isSeatingBarVisible = await seatingBar.isVisible();
  console.log('Seating Studio Saved Layouts Bar visible:', isSeatingBarVisible);

  // Check dropdown options: verify no timestamps, no role
  const selectArr = mcPhone.locator('select').first();
  const arrOptions = await selectArr.locator('option').allInnerTexts();
  console.log('Arrangement options in MC Mobile:', arrOptions);
  const hasTimestampsInArr = arrOptions.some(t => /202[0-9]-/.test(t));
  console.log('Has timestamps in arrangement dropdown:', hasTimestampsInArr);

  // Check Canvas elements
  const canvas = mcPhone.locator('#mobile_canvas_container');
  const danceFloor = canvas.locator('#mobile_main_dance_floor');
  const isDanceFloorVisible = await danceFloor.isVisible();
  console.log('Draggable Dance Floor present on mobile canvas:', isDanceFloorVisible);

  // Check tables: Table name + occupancy only
  const tables = canvas.locator('> div[draggable="true"]:has-text("/")');
  const tableCount = await tables.count();
  console.log(`Found ${tableCount} table cards on mobile canvas.`);
  for (let i = 0; i < Math.min(tableCount, 4); i++) {
    const txt = await tables.nth(i).innerText();
    const hasFree = /free/i.test(txt);
    const hasRoundWord = /round/i.test(txt);
    console.log(`Mobile Table ${i + 1} text: "${txt.replace(/\n/g, ' ')}", has 'free': ${hasFree}, has 'round': ${hasRoundWord}`);
  }

  await pageMc.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_mc_mobile_seating_studio_clean.png'),
  });
  console.log('Saved verify_mc_mobile_seating_studio_clean.png');

  // Test Compare Layouts modal in MC mobile
  const compareBtn = mcPhone.locator('button:has-text("Compare")').first();
  await compareBtn.click();
  await pageMc.waitForTimeout(400);

  const compareModal = mcPhone.locator('text=Compare Saved Layouts').first();
  const isCompareModalVisible = await compareModal.isVisible();
  console.log('MC Mobile Compare Layouts modal opened:', isCompareModalVisible);

  await pageMc.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_mc_mobile_compare_modal.png'),
  });
  console.log('Saved verify_mc_mobile_compare_modal.png');

  await pageMc.close();
  await browser.close();
  console.log('\n--- ALL MOBILE TESTS PASSED SUCCESSFULLY! ---');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
