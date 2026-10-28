import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8443/#mc');
  await page.waitForTimeout(1500);

  const joeyButtons = await page.locator('button[aria-label="Open Joey · Wedding Assistant"], button[title="Chat with Joey"], button:has(img[alt="Joey AI"])').count();
  console.log('Joey buttons count:', joeyButtons);

  if (joeyButtons > 0) {
    const btn = page.locator('button[title="Chat with Joey"]').first();
    console.log('Button isVisible:', await btn.isVisible());
    const box = await btn.boundingBox();
    console.log('Button boundingBox:', box);
  }

  await browser.close();
}

run().catch(console.error);
