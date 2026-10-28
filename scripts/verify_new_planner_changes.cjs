const { chromium } = require('playwright');
const path = require('path');

const targetDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to Wedding Planner...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const plannerBtn = page.locator('button:has-text("Wedding Planner")').first();
  if (await plannerBtn.isVisible()) {
    await plannerBtn.click();
    await page.waitForTimeout(800);
  }

  // 1. Overview screenshot (confirm no client dropdown)
  const p1 = path.join(targetDir, 'verify_planner_overview_no_dropdown.png');
  await page.screenshot({ path: p1 });
  console.log('Captured Overview without dropdown:', p1);

  // 2. Settings screenshot (confirm planner info instead of controls)
  const settingsTab = page.locator('aside button:has-text("Settings")').first();
  if (await settingsTab.isVisible()) {
    await settingsTab.click();
    await page.waitForTimeout(800);
    const p2 = path.join(targetDir, 'verify_planner_settings_own_info.png');
    await page.screenshot({ path: p2 });
    console.log('Captured Settings with own info:', p2);
  }

  await browser.close();
}

run().catch(console.error);
