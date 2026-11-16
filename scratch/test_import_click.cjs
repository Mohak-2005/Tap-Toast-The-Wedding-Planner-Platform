const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('http://127.0.0.1:5173/#planner');
  await page.waitForTimeout(1000);
  const btn = await page.$('button:has-text("Import Template")');
  console.log('Button found:', !!btn);
  if (btn) {
    await btn.click();
    await page.waitForTimeout(1000);
  }
  const modal = await page.$('text=STANDARD TIMELINE TEMPLATES');
  console.log('Modal found:', !!modal);
  await page.screenshot({ path: 'scratch/template_test.png' });
  await browser.close();
})();
