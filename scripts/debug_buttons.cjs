const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5173/#couple');
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Seating")').first().click();
  await page.waitForTimeout(1000);
  await page.locator('text=HEAD TABLE').first().click();
  await page.waitForTimeout(1000);

  const btns = await page.locator('button').allInnerTexts();
  console.log('Buttons:', btns.map(b => b.trim()).filter(b => b.length > 0));
  await browser.close();
})();
