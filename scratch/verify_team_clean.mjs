import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8443';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Reset demo data to ensure fresh seedData is loaded into localStorage
  await page.goto(`${BASE_URL}/#mc`);
  await page.waitForTimeout(500);

  const resetBtn = page.locator('button:has-text("Reset Demo Data")');
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    await page.waitForTimeout(800);
  }

  // Navigate to MC Team
  await page.goto(`${BASE_URL}/#mc`);
  await page.waitForTimeout(500);

  const teamTab = page.locator('button:has-text("Team & Crew")');
  if (await teamTab.isVisible()) {
    await teamTab.click();
    await page.waitForTimeout(800);
  }

  await page.screenshot({ path: `${ARTIFACT_DIR}/8_mc_team_parity_clean.png`, fullPage: false });
  console.log('Captured 8_mc_team_parity_clean.png');

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
