const { chromium } = require('playwright');
const path = require('path');

const targetDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const superAdminBtn = page.locator('button:has-text("Super Admin")').first();
  if (await superAdminBtn.isVisible()) {
    await superAdminBtn.click();
    await page.waitForTimeout(800);
  }

  const p = path.join(targetDir, 'verify_superadmin_couple_directory.png');
  await page.screenshot({ path: p });
  console.log('Recaptured Super Admin screenshot with formatted dates:', p);

  await browser.close();
}

run().catch(console.error);
