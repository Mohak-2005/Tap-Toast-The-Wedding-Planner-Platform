const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  await page.goto('http://127.0.0.1:5173/#register-couple', { waitUntil: 'networkidle' });
  console.log('Page Title:', await page.title());
  console.log('Current URL:', page.url());
  const bodyText = await page.$eval('body', el => el.innerText);
  console.log('Body text snippet:', bodyText.slice(0, 300));
  await browser.close();
})();
