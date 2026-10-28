import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:8443/#mc ...');
  await page.goto('http://localhost:8443/#mc', { waitUntil: 'networkidle' });

  // Click on "Run Sheet →" for Sophie & James
  const runSheetBtn = page.locator('button:has-text("Run Sheet →")').first();
  await runSheetBtn.click();
  await page.waitForTimeout(1000);

  // Click on Seating tab inside MC wedding console
  const seatingBtn = page.locator('button:has-text("Seating"), a:has-text("Seating")').first();
  if (await seatingBtn.isVisible()) {
    await seatingBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_mc_wedding_seating_clean.png'),
    fullPage: false,
  });

  console.log('MC wedding seating screenshot taken.');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
