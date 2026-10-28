import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:8443/#mc');
  await page.waitForTimeout(1000);
  await page.locator('tr:has-text("Sophie")').first().click();
  await page.waitForTimeout(1000);
  const giftTab = page.locator('button:has-text("Gift")').first();
  if (await giftTab.isVisible()) {
    await giftTab.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/mc_wedding_console_gift_ledger.png' });
  await browser.close();
  console.log('Done capturing mc_wedding_console_gift_ledger.png');
}

run();
