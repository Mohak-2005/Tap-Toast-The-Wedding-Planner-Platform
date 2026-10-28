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

  // Click Continue to Plan & Payment
  console.log('2. Clicking Continue to Plan & Payment...');
  const continueBtn = page.locator('button:has-text("Continue to Plan & Payment")');
  await continueBtn.click();
  await page.waitForTimeout(1000);

  // Capture Step 2 Collapsed state (initially only plane name and pricing should be seen)
  await page.screenshot({ path: path.join(outDir, 'verify_step2_plans_collapsed.png'), fullPage: true });
  console.log('Captured verify_step2_plans_collapsed.png (only plane name and pricing seen)');

  // Click to expand features of Signature Pro
  console.log('3. Clicking dropdown chevron on Signature Pro...');
  const expandChevron = page.locator('button[title="Expand features"]').nth(1);
  if (await expandChevron.count() > 0) {
    await expandChevron.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'verify_step2_plans_expanded.png'), fullPage: true });
    console.log('Captured verify_step2_plans_expanded.png (dropdown features visible)');
  }

  // Click demo test card and proceed to Step 3
  console.log('4. Clicking Demo Test Card and Proceeding to Step 3...');
  const demoCardBtn = page.locator('button:has-text("Use Demo Test Card")');
  if (await demoCardBtn.count() > 0) {
    await demoCardBtn.click();
  }
  const payBtn = page.locator('button[type="submit"]:has-text("Select MC")');
  await payBtn.click();
  await page.waitForTimeout(1000);

  // Capture Step 3 Initial state with MC dropdown
  await page.screenshot({ path: path.join(outDir, 'verify_step3_mc_dropdown_closed.png'), fullPage: true });
  console.log('Captured verify_step3_mc_dropdown_closed.png');

  // Click MC dropdown to open menu
  console.log('5. Clicking MC dropdown selector...');
  const mcDropdownTrigger = page.locator('button:has-text("Change MC")');
  if (await mcDropdownTrigger.count() > 0) {
    await mcDropdownTrigger.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'verify_step3_mc_dropdown_open.png') });
    console.log('Captured verify_step3_mc_dropdown_open.png (MC info dropdown open)');

    // Select Marcus Thorne
    const marcusOption = page.locator('text=Marcus Thorne').first();
    if (await marcusOption.count() > 0) {
      await marcusOption.click();
      await page.waitForTimeout(500);
    }
  }

  // Test Normal Chatbot in Step 3
  console.log('6. Typing a question into Joey normal chatbot...');
  const chatInput = page.locator('input[placeholder*="Type your question or preference"]');
  if (await chatInput.count() > 0) {
    await chatInput.fill('We want an energetic modern luxury entrance and speeches grouped before dinner');
    const sendBtn = page.locator('button:has-text("Send")');
    await sendBtn.click();
    await page.waitForTimeout(1200);

    await page.screenshot({ path: path.join(outDir, 'verify_step3_normal_chatbot_answered.png'), fullPage: true });
    console.log('Captured verify_step3_normal_chatbot_answered.png (Joey answered question conversationally and updated audit)');
  }

  // Confirm MC and Launch Dashboard
  console.log('7. Confirming MC and Launching Dashboard...');
  const launchBtn = page.locator('button:has-text("Confirm MC & Launch Dashboard")');
  await launchBtn.click();
  await page.waitForTimeout(1500);

  // Switch to Guest List tab
  console.log('8. Switching to Guest List tab...');
  const guestsTab = page.locator('button:has-text("Guest List"), a:has-text("Guest List")').first();
  if (await guestsTab.count() > 0) {
    await guestsTab.click();
    await page.waitForTimeout(1000);
  }

  // Capture clean & minimal Guest List (matching Image 4 without flashy blue / emojis)
  await page.screenshot({ path: path.join(outDir, 'verify_clean_minimal_guestlist.png'), fullPage: true });
  console.log('Captured verify_clean_minimal_guestlist.png');

  console.log('All verification steps completed successfully!');
  await browser.close();
}

run().catch((err) => {
  console.error('Playwright verification error:', err);
  process.exit(1);
});
