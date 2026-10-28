import { chromium } from 'playwright';

const LIVE_URL = 'https://mohak-2005.github.io/Tap-Toast-The-Wedding-Planner-Platform';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function testLive() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Loading live site...');
  await page.goto(`${LIVE_URL}/#showcase`);
  await page.waitForTimeout(2000);

  // Check top DemoBar for S/R mobile
  const srMobileBtn = page.locator('button:has-text("S/R mobile")');
  console.log('S/R mobile tab exists on live site:', await srMobileBtn.isVisible());

  console.log('2. Clicking S/R mobile tab on live site...');
  await srMobileBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live_gh_pages_sr_mobile.png` });
  console.log('Captured live_gh_pages_sr_mobile.png');

  console.log('3. Checking Register page (+61 boxes) on live site...');
  await page.goto(`${LIVE_URL}/#register`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live_gh_pages_register.png` });
  console.log('Captured live_gh_pages_register.png');

  console.log('4. Checking Couple Guest List on live site...');
  await page.goto(`${LIVE_URL}/#couple`);
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Guest List")').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live_gh_pages_guest_list.png` });
  console.log('Captured live_gh_pages_guest_list.png');

  await browser.close();
  console.log('All live tests completed successfully!');
}

testLive().catch(err => {
  console.error(err);
  process.exit(1);
});
