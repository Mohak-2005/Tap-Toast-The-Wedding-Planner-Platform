const { chromium } = require('playwright');

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Click Guest List
  await page.getByRole('button', { name: 'Guest List', exact: true }).first().click();
  await page.waitForTimeout(600);

  // Click Import Guests
  await page.locator('button:has-text("Import Guests")').click();
  await page.waitForTimeout(600);

  // Click Load Sample File
  await page.locator('button:has-text("Load Sample File")').click();
  await page.waitForTimeout(800);

  // Click Import 5 Guests as Drafts
  await page.locator('button:has-text("Import 5 Guests as Drafts")').click();
  await page.waitForTimeout(1000);

  const dump = await page.evaluate(() => {
    const raw = localStorage.getItem('tt_demo_v1');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed ? parsed.guests.filter(g => g.name.includes('Evelyn') || g.name.includes('Mehta') || g.name.includes('Dubois') || g.name.includes('Henderson') || g.name.includes('Mansoor')) : 'no state';
  });

  console.log('FIRST 10 GUESTS IN STATE:');
  console.log(JSON.stringify(dump, null, 2));

  await browser.close();
}

check().catch(console.error);
