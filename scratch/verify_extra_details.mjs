import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8443';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- TEST: Groom Login (james@demo.test) ---');
  await page.goto(`${BASE_URL}/#login`);
  await page.waitForTimeout(1000);
  const signOutBtn = page.locator('button:has-text("Sign out • Switch Account")');
  if (await signOutBtn.isVisible()) {
    await signOutBtn.click();
    await page.waitForTimeout(500);
  }

  const groomFill = page.locator('strong:has-text("James Gordon (Groom)")');
  if (await groomFill.isVisible()) {
    await groomFill.click();
    await page.waitForTimeout(300);
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/10_login_groom_email_success.png`, fullPage: false });
  console.log('Captured 10_login_groom_email_success.png');

  console.log('--- TEST: MC Wedding Detail with Gift Ledger Sub-Tab ---');
  await page.goto(`${BASE_URL}/#mc`);
  await page.waitForTimeout(1000);

  // Click on Sophie & James wedding card or "Open Console"
  const openWeddingBtn = page.locator('button:has-text("Open Wedding Console"), button:has-text("Console"), div:has-text("Sophie & James")').first();
  if (await openWeddingBtn.isVisible()) {
    await openWeddingBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click on "🎁 Gift & Wishing Well Ledger" subtab
  const giftSubTab = page.locator('button:has-text("Gift & Wishing Well Ledger")').first();
  if (await giftSubTab.isVisible()) {
    await giftSubTab.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/11_mc_wedding_detail_gift_ledger.png`, fullPage: false });
  console.log('Captured 11_mc_wedding_detail_gift_ledger.png');

  // Also re-capture MC team after assignedWeddings fix
  const teamSidebar = page.locator('button:has-text("Team & Crew")').first();
  if (await teamSidebar.isVisible()) {
    await teamSidebar.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/12_mc_team_parity_fixed.png`, fullPage: false });
  console.log('Captured 12_mc_team_parity_fixed.png');

  await browser.close();
  console.log('Extra verification completed!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
