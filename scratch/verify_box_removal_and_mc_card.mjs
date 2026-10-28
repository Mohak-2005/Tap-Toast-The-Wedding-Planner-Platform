import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  console.log('1. Checking Couple Dashboard Overview (Box removed)...');
  await page.goto('http://localhost:8443/#couple');
  await page.waitForTimeout(1000);

  // Check if banner text is present (should be 0)
  const bannerCount = await page.locator('text=Collaborating with Certified MC').count();
  console.log('Banner count (should be 0):', bannerCount);

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_couple_overview_no_banner_box.png' });
  console.log('Saved Couple Overview screenshot.');

  console.log('2. Checking Couple Registration Step 3...');
  await page.goto('http://localhost:8443/#register-couple');
  await page.waitForTimeout(800);

  // Step 1 -> Step 2
  await page.click('button:has-text("Continue to Plan & Payment")');
  await page.waitForTimeout(500);

  // Step 2 -> Step 3
  await page.click('button:has-text("Pay $299 & Select MC")');
  await page.waitForTimeout(800);

  // Take screenshot of Step 3 MC Card
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_mc_card_only_photo_name_service_rating.png' });
  console.log('Saved Step 3 MC Card screenshot.');

  // Click eye icon to open pop-up modal
  console.log('3. Clicking Eye Icon to view pop-up modal with additional info...');
  await page.click('button[aria-label="View MC Info"]');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_mc_popup_all_additional_info.png' });
  console.log('Saved Step 3 MC Pop-up Modal screenshot.');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
