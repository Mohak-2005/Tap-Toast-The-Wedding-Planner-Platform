const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  console.log('Navigating to planner...');
  await page.goto('http://127.0.0.1:5173/#planner');
  await page.waitForTimeout(1000);
  await page.locator('button').filter({ hasText: 'Day Sheet' }).first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '96_planner_day_sheet_inside.png') });

  console.log('Navigating to MC...');
  await page.goto('http://127.0.0.1:5173/#mc');
  await page.waitForTimeout(1000);
  await page.locator('button').filter({ hasText: 'Run Sheet' }).first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '97_mc_run_sheet_inside.png') });

  await browser.close();
  console.log('Saved 96 and 97!');
})();
