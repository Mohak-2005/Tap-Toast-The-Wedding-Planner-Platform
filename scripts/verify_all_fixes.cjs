const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:5173/#couple...');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Navigate to Seating tab
  console.log('Navigating to Seating tab in sidebar...');
  await page.locator('button:has-text("Seating")').first().click();
  await page.waitForTimeout(1000);

  // 1. Verify Floating Cheers AI Button (No green dot)
  const cheersFloatingBtn = page.locator('button:has-text("Cheers AI")').last();
  await cheersFloatingBtn.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'verify_cheers_floating_no_dot.png', clip: { x: 1220, y: 860, width: 200, height: 80 } });
  console.log('Captured verify_cheers_floating_no_dot.png');

  // 2. Click HEAD TABLE on Canvas to open Level 2 Drilldown
  console.log('Clicking HEAD TABLE on canvas...');
  const headTblCard = page.locator('div[draggable="true"]:has-text("HEAD TABLE")').first();
  await headTblCard.click();
  await page.waitForTimeout(800);

  // Verify Rectangular initially
  await page.screenshot({ path: 'verify_head_table_rectangular.png' });
  console.log('Captured verify_head_table_rectangular.png');

  // Click [Round] button in drilldown
  console.log('Clicking round button in drilldown...');
  const roundBtn = page.locator('button:text-is("round")').first();
  await roundBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_head_table_round.png' });
  console.log('Captured verify_head_table_round.png');

  // Click [Rectangular] button back
  console.log('Clicking rectangular button in drilldown...');
  const rectBtn = page.locator('button:text-is("rectangular")').first();
  await rectBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_head_table_rectangular_swapped.png' });
  console.log('Captured verify_head_table_rectangular_swapped.png');

  // Return to Overall Room Layout
  const returnBtn = page.locator('button:has-text("Return to Overall Room Layout")');
  if (await returnBtn.isVisible()) {
    await returnBtn.click();
    await page.waitForTimeout(600);
  }

  // 3. Open Cheers AI Chatbot
  console.log('Opening Cheers AI Chatbot...');
  await cheersFloatingBtn.click();
  await page.waitForTimeout(800);

  // Click "👑 VIP & Head Table" chip
  console.log('Clicking VIP & Head Table chip...');
  const vipChip = page.locator('button:has-text("VIP & Head Table")');
  await vipChip.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_cheers_vip_proposal.png' });
  console.log('Captured verify_cheers_vip_proposal.png');

  // Click "🥗 Dietary Cluster" chip
  console.log('Clicking Dietary Cluster chip...');
  const dietaryChip = page.locator('button:has-text("Dietary Cluster")');
  await dietaryChip.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_cheers_dietary_proposal.png' });
  console.log('Captured verify_cheers_dietary_proposal.png');

  // 4. Verify Wedding Planner Screen (#planner)
  console.log('Navigating to Wedding Planner screen (#planner)...');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Overview tab screenshot
  await page.screenshot({ path: 'verify_planner_overview.png' });
  console.log('Captured verify_planner_overview.png');

  // Seating tab in Planner
  console.log('Testing Planner Seating tab...');
  const plannerSeatingTab = page.locator('button:has-text("Seating Planner")').first();
  await plannerSeatingTab.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify_planner_seating.png' });
  console.log('Captured verify_planner_seating.png');

  // Guest List tab in Planner
  console.log('Testing Planner Guest List tab...');
  const plannerGuestTab = page.locator('button:has-text("Guest List")').first();
  await plannerGuestTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_planner_guest_list.png' });
  console.log('Captured verify_planner_guest_list.png');

  // Invitations tab in Planner
  console.log('Testing Planner Invitations tab...');
  const plannerInvitesTab = page.locator('button:has-text("Invitations & QaRd")').first();
  await plannerInvitesTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_planner_invitations.png' });
  console.log('Captured verify_planner_invitations.png');

  // Venue & Travel tab in Planner
  console.log('Testing Planner Venue & Travel tab...');
  const plannerVenueTab = page.locator('button:has-text("Venue & Travel")').first();
  await plannerVenueTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_planner_venue.png' });
  console.log('Captured verify_planner_venue.png');

  // Settings tab in Planner
  console.log('Testing Planner Settings tab...');
  const plannerSettingsTab = page.locator('button:has-text("Settings & Controls")').first();
  await plannerSettingsTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_planner_settings.png' });
  console.log('Captured verify_planner_settings.png');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
})();
