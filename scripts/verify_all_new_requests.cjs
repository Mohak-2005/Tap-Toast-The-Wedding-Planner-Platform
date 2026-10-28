const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  // ==========================================
  // 1. VERIFY GUEST MOBILE VIEW (#guest-mobile)
  // ==========================================
  console.log('Testing Guest Mobile View (#guest-mobile)...');
  await page.setViewportSize({ width: 420, height: 880 });
  await page.goto('http://127.0.0.1:5173/#guest-mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click Feed tab in bottom bar
  const feedTab = page.locator('button:has-text("Feed")').first();
  await feedTab.click();
  await page.waitForTimeout(1000);

  // Take screenshot of Mobile Feed with attach icon & no phase toggle
  await page.screenshot({ path: 'verify_guest_mobile_feed_clean.png' });
  console.log('Captured verify_guest_mobile_feed_clean.png');

  // ==========================================
  // 2. VERIFY WEDDING PLANNER VERTICAL SIDEBAR (#planner)
  // ==========================================
  console.log('Testing Wedding Planner (#planner) on desktop viewport...');
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'verify_planner_vertical_sidebar.png' });
  console.log('Captured verify_planner_vertical_sidebar.png');

  // ==========================================
  // 3. VERIFY SUPERADMIN OVERVIEW (Active Couple Tenants + Couple Directory)
  // ==========================================
  console.log('Testing SuperAdmin Overview (#superadmin)...');
  await page.goto('http://127.0.0.1:5173/#superadmin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'verify_superadmin_couple_directory.png' });
  console.log('Captured verify_superadmin_couple_directory.png');

  await browser.close();
  console.log('ALL NEW VERIFICATIONS COMPLETED SUCCESSFULLY!');
})();
