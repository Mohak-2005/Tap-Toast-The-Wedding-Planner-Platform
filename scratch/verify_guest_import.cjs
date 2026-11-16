const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('1. Navigating to Couple Dashboard...');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  console.log('2. Opening Guest List Tab...');
  await page.getByRole('button', { name: 'Guest List', exact: true }).first().click();
  await page.waitForTimeout(600);

  console.log('3. Clicking Import Guests button...');
  const importBtn = page.locator('button:has-text("Import Guests")');
  await importBtn.waitFor({ state: 'visible' });
  await importBtn.click();
  await page.waitForTimeout(600);

  // Step 1: Upload Modal
  console.log('4. Capturing Step 1: Upload Modal...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '48_guest_import_step1_upload.png'), fullPage: false });
  console.log('Saved 48_guest_import_step1_upload.png');

  // Click "Load Sample File"
  console.log('5. Clicking Load Sample File to trigger Cheers AI Column Detection...');
  const sampleBtn = page.locator('button:has-text("Load Sample File")');
  await sampleBtn.click();
  await page.waitForTimeout(800);

  // Step 2: Review Screen
  console.log('6. Capturing Step 2: Review Screen...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '49_guest_import_step2_review_screen.png'), fullPage: false });
  console.log('Saved 49_guest_import_step2_review_screen.png');

  // Edit name in row 1
  console.log('7. Editing name of first guest...');
  const firstInput = page.locator('input[placeholder="Guest Name *"]').first();
  await firstInput.fill('Dr. Evelyn Reed (VIP)');
  await page.waitForTimeout(300);

  // Ensure Save as Drafts is selected (default) and click Import
  console.log('8. Clicking Import Guests as Drafts...');
  const commitBtn = page.locator('button:has-text("Import 5 Guests as Drafts")');
  await commitBtn.click();
  await page.waitForTimeout(1000);

  // Step 3: Updated Guest List Table
  console.log('9. Capturing updated Guest List showing imported guests at top...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '50_guest_list_after_import_drafts.png'), fullPage: false });
  console.log('Saved 50_guest_list_after_import_drafts.png');

  // Filter by Awaiting RSVP status
  console.log('10. Filter by Awaiting RSVP status to inspect imported drafts...');
  const rsvpFilter = page.locator('select').filter({ hasText: 'All RSVP Statuses' });
  await rsvpFilter.selectOption('awaiting');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '51_guest_list_awaiting_drafts.png'), fullPage: false });
  console.log('Saved 51_guest_list_awaiting_drafts.png');

  await browser.close();
  console.log('All guest import tests completed successfully!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
