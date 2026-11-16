const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();

  // 1. Visit Guest Mobile when tablemates are private (default or set)
  await page.goto('http://127.0.0.1:5173/#guest');
  await page.waitForTimeout(1500);

  // Click on "My Table" card
  const myTableCard = await page.waitForSelector('text=My Table');
  await myTableCard.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '63_guest_mobile_tablemates_private.png') });
  console.log('Saved 63_guest_mobile_tablemates_private.png');

  // Close modal
  const closeBtn = await page.$('button:has-text("Close")');
  if (closeBtn) await closeBtn.click();
  await page.waitForTimeout(500);

  // 2. Switch to Couple Settings and set tablemates visible
  const couplePage = await context.newPage();
  await couplePage.goto('http://127.0.0.1:5173/#couple');
  await couplePage.waitForTimeout(1200);

  // Click Settings
  const settingsTab = await couplePage.$('button:has-text("Settings")');
  if (settingsTab) {
    await settingsTab.click();
    await couplePage.waitForTimeout(600);
    // Find tablemates toggle button
    const toggle = await couplePage.$('button:has-text("Tablemates")');
    if (toggle) await toggle.click();
    await couplePage.waitForTimeout(600);
  }
  await couplePage.close();

  // Reload guest mobile to see tablemates visible
  await page.reload();
  await page.waitForTimeout(1000);
  const myTableCard2 = await page.waitForSelector('text=My Table');
  await myTableCard2.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '64_guest_mobile_tablemates_visible.png') });
  console.log('Saved 64_guest_mobile_tablemates_visible.png');

  await browser.close();
})();
