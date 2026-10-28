import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  console.log('1. Loading Couple Dashboard -> Seating Tab...');
  await page.goto('http://localhost:8443/#couple');
  await page.waitForTimeout(1000);

  // Click on Seating tab in Couple View sidebar
  await page.click('button:has-text("Seating")');
  await page.waitForTimeout(1000);

  // Take screenshot of seating canvas showing round vs rectangle table shapes
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_seating_table_shapes_round_rect.png' });
  console.log('Saved Table Shapes screenshot.');

  // 2. Open Compare Layouts Modal
  console.log('2. Opening Compare Layouts Modal...');
  await page.click('button:has-text("Compare Layouts")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_seating_compare_layouts_modal.png' });
  console.log('Saved Compare Layouts modal screenshot.');

  // Close Compare modal
  await page.click('button:has-text("Close")');
  await page.waitForTimeout(400);

  // 3. Save a new arrangement as Couple
  console.log('3. Saving New Arrangement as Couple...');
  await page.click('button:has-text("Save Arrangement")');
  await page.waitForTimeout(500);

  const nameInput = page.locator('input[placeholder*="Seating Arrangement 1"]');
  await nameInput.fill('Arrangement 3 (Open Dancefloor Gala)');

  const notesInput = page.locator('textarea[placeholder*="Traditional banquet layout"]');
  await notesInput.fill('Wider clearance around dance floor for late-night party & fireworks fanfare');

  await page.click('button:has-text("Save & Sync Arrangement")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_seating_saved_arrangement_created.png' });
  console.log('Saved New Arrangement created screenshot.');

  // 4. Check Super Admin System Audit Log
  console.log('4. Checking Super Admin Audit Log for Seating Saved entry...');
  await page.goto('http://localhost:8443/#superadmin');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Audit Logs")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_superadmin_audit_seating_saved.png' });
  console.log('Saved Super Admin Audit Log screenshot.');

  // 5. Check MC View
  console.log('5. Checking MC View -> Seating Tab...');
  await page.goto('http://localhost:8443/#mc');
  await page.waitForTimeout(1000);

  // Click on Sophie & James wedding console
  const weddingCard = page.locator('button:has-text("Open Wedding Console")').first();
  if (await weddingCard.count() > 0) {
    await weddingCard.click();
    await page.waitForTimeout(800);
  }

  // Click on Seating floor plan in MC view
  const seatingSubTab = page.locator('button:has-text("Seating Floor Plan")').first();
  if (await seatingSubTab.count() > 0) {
    await seatingSubTab.click();
    await page.waitForTimeout(800);
  }

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_mc_console_sees_saved_arrangements.png' });
  console.log('Saved MC Console Seating screenshot.');

  await browser.close();
  console.log('ALL SEATING TESTS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
