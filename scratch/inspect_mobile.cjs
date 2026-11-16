const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  await page.goto('http://127.0.0.1:5173/#guest-mobile', { waitUntil: 'networkidle' });
  await browser.close();
})();
