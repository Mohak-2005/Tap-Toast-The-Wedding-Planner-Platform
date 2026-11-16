const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();

  // Go to guest page with clear storage so it's fresh
  await page.goto('http://127.0.0.1:5173/#guest');
  await page.waitForTimeout(1000);

  // If there's an envelope or splash, open it or click bottom navigation Table
  const tableNavBtn = await page.$('button:has-text("Table")');
  console.log('tableNavBtn found:', !!tableNavBtn);
  if (tableNavBtn) {
    await tableNavBtn.click();
    await page.waitForTimeout(1000);
  } else {
    // maybe splash screen, click envelope or "Open Invitation"
    const openBtn = await page.$('button:has-text("Open")');
    if (openBtn) {
      await openBtn.click();
      await page.waitForTimeout(1000);
    }
    const tBtn = await page.waitForSelector('button:has-text("Table")');
    await tBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '63_guest_mobile_tablemates_private.png') });
  console.log('Saved 63_guest_mobile_tablemates_private.png');

  await browser.close();
})();
