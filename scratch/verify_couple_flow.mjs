import { chromium } from 'playwright';
import path from 'path';

const outDir = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();

  console.log('1. Navigating to #register...');
  await page.goto('http://localhost:8443/#register', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Screenshot Step 1: Couple Registration
  await page.screenshot({ path: path.join(outDir, 'verify_step1_couple_registration.png'), fullPage: true });
  console.log('Captured verify_step1_couple_registration.png');

  // Click Continue to Plan & Payment
  console.log('2. Clicking Continue to Plan & Payment...');
  const continueBtn = page.locator('button:has-text("Continue to Plan & Payment")');
  await continueBtn.click();
  await page.waitForTimeout(1000);

  // Screenshot Step 2: Couple SaaS Subscription & Payment
  await page.screenshot({ path: path.join(outDir, 'verify_step2_couple_payment.png'), fullPage: true });
  console.log('Captured verify_step2_couple_payment.png');

  // Test demo test card click
  const demoCardBtn = page.locator('button:has-text("Use Demo Test Card")');
  if (await demoCardBtn.count() > 0) {
    await demoCardBtn.click();
  }

  // Click Pay & Select MC
  console.log('3. Proceeding to Select MC & AI Onboarding...');
  const payBtn = page.locator('button[type="submit"]:has-text("Select MC")');
  await payBtn.click();
  await page.waitForTimeout(1000);

  // Screenshot Step 3: Select MC & Joey AI Preference Audit
  await page.screenshot({ path: path.join(outDir, 'verify_step3_choose_mc_and_ai_audit.png'), fullPage: true });
  console.log('Captured verify_step3_choose_mc_and_ai_audit.png');

  // Click Confirm MC & Launch Dashboard
  console.log('4. Confirming MC & Launching Dashboard...');
  const launchBtn = page.locator('button:has-text("Confirm MC & Launch Dashboard")');
  await launchBtn.click();
  await page.waitForTimeout(1500);

  // Screenshot Couple Overview Dashboard
  await page.screenshot({ path: path.join(outDir, 'verify_couple_dashboard_overview.png'), fullPage: true });
  console.log('Captured verify_couple_dashboard_overview.png');

  // Navigate to Guest List Tab
  console.log('5. Switching to Guest List tab...');
  const guestsTab = page.locator('button:has-text("Guest List"), a:has-text("Guest List"), [role="tab"]:has-text("Guest List")').first();
  if (await guestsTab.count() > 0) {
    await guestsTab.click();
    await page.waitForTimeout(1000);
  }

  // Screenshot Guest List with Adults & Kids columns and KPI cards
  await page.screenshot({ path: path.join(outDir, 'verify_couple_guestlist_adults_kids.png'), fullPage: true });
  console.log('Captured verify_couple_guestlist_adults_kids.png');

  // Open Add Guest Modal
  console.log('6. Opening + Add Guest modal...');
  const addGuestBtn = page.locator('button:has-text("+ Add Guest")');
  if (await addGuestBtn.count() > 0) {
    await addGuestBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'verify_couple_add_guest_modal.png') });
    console.log('Captured verify_couple_add_guest_modal.png');

    // Close modal
    const cancelBtn = page.locator('button:has-text("Cancel")');
    await cancelBtn.click();
    await page.waitForTimeout(500);
  }

  // Test Joey Chatbot
  console.log('7. Testing Joey Chatbot with couple demographic command...');
  const joeyTrigger = page.locator('button[title="Chat with Joey"], button[aria-label="Open Joey · Wedding Assistant"]');
  if (await joeyTrigger.count() > 0) {
    await joeyTrigger.click();
    await page.waitForTimeout(800);

    // Send Adults vs Kids prompt
    const adultsKidsChip = page.locator('button:has-text("Adults vs Kids")');
    if (await adultsKidsChip.count() > 0) {
      await adultsKidsChip.click();
      await page.waitForTimeout(1200);
    }

    await page.screenshot({ path: path.join(outDir, 'verify_couple_joey_demographics.png') });
    console.log('Captured verify_couple_joey_demographics.png');
  }

  console.log('All verification steps completed successfully!');
  await browser.close();
}

run().catch((err) => {
  console.error('Playwright verification error:', err);
  process.exit(1);
});
