const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  // 1. First save tablemates as Visible (64_guest_mobile_tablemates_visible.png)
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 420, height: 900 });
  await mobilePage.goto('http://127.0.0.1:5173/#guest');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.click('button:has-text("Table")');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, '64_guest_mobile_tablemates_visible.png') });
  console.log('Saved 64_guest_mobile_tablemates_visible.png');

  // 2. Open Couple Dashboard -> Seating Studio, toggle to Private
  const plannerPage = await context.newPage();
  await plannerPage.goto('http://127.0.0.1:5173/#couple');
  await plannerPage.waitForTimeout(1200);
  await plannerPage.click('button:has-text("Seating")');
  await plannerPage.waitForTimeout(1000);

  // Click the Tablemates button to toggle to Private
  const toggleBtn = await plannerPage.waitForSelector('button:has-text("Tablemates:")');
  console.log('Toggling tablemates to private...');
  await toggleBtn.click();
  await plannerPage.waitForTimeout(1000);
  await plannerPage.screenshot({ path: path.join(ARTIFACTS_DIR, '62_seating_studio_tablemates_private.png') });
  console.log('Saved 62_seating_studio_tablemates_private.png');

  // 3. Reload mobile guest view to see private view
  await mobilePage.reload();
  await mobilePage.waitForTimeout(1000);
  await mobilePage.click('button:has-text("Table")');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, '63_guest_mobile_tablemates_private.png') });
  console.log('Saved 63_guest_mobile_tablemates_private.png');

  await browser.close();
})();
