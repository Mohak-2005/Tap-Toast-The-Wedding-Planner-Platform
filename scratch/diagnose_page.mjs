import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8443/#mc');
  await page.waitForTimeout(1500);

  const url = page.url();
  console.log('Current URL:', url);

  const buttons = await page.locator('button').allInnerTexts();
  console.log('Buttons found count:', buttons.length);
  console.log('Buttons sample:', buttons.slice(0, 15));

  await browser.close();
}

run().catch(console.error);
