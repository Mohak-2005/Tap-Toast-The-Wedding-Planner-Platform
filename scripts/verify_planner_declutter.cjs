const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // 1. Planner Overview
  console.log('Navigating to Planner View...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const plannerBtn = page.locator('button:has-text("Wedding Planner")').first();
  if (await plannerBtn.isVisible()) {
    await plannerBtn.click();
    await page.waitForTimeout(1000);
  }

  const p1 = path.join(targetDir, 'verify_planner_declutter_overview.png');
  await page.screenshot({ path: p1 });
  console.log('Captured:', p1);

  // 2. Planner Guest List Tab
  const guestListTab = page.locator('aside button:has-text("Guest List")').first();
  if (await guestListTab.isVisible()) {
    await guestListTab.click();
    await page.waitForTimeout(800);
    const p2 = path.join(targetDir, 'verify_planner_declutter_guestlist.png');
    await page.screenshot({ path: p2 });
    console.log('Captured:', p2);
  }

  // 3. Planner Invitations & QaRd Tab
  const invTab = page.locator('aside button:has-text("Invitations & QaRd")').first();
  if (await invTab.isVisible()) {
    await invTab.click();
    await page.waitForTimeout(800);
    const p3 = path.join(targetDir, 'verify_planner_declutter_invitations.png');
    await page.screenshot({ path: p3 });
    console.log('Captured:', p3);
  }

  // 4. Planner Venue & Travel Tab
  const venueTab = page.locator('aside button:has-text("Venue & Travel")').first();
  if (await venueTab.isVisible()) {
    await venueTab.click();
    await page.waitForTimeout(800);
    const p4 = path.join(targetDir, 'verify_planner_declutter_venue.png');
    await page.screenshot({ path: p4 });
    console.log('Captured:', p4);
  }

  // 5. Seating Tab (no duplicate header) and Cheers AI Chat popup (no green dot)
  const seatingTab = page.locator('aside button:has-text("Seating Planner")').first();
  if (await seatingTab.isVisible()) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
    const cheersBtn = page.locator('button:has-text("Cheers AI")').last();
    if (await cheersBtn.isVisible()) {
      await cheersBtn.click();
      await page.waitForTimeout(800);
    }
    const p5 = path.join(targetDir, 'verify_cheers_ai_no_green_dot.png');
    await page.screenshot({ path: p5 });
    console.log('Captured:', p5);
  }

  // 6. Super Admin View (Couple Directory)
  console.log('Testing Super Admin View...');
  const superAdminBtn = page.locator('button:has-text("Super Admin")').first();
  if (await superAdminBtn.isVisible()) {
    await superAdminBtn.click();
    await page.waitForTimeout(1000);
  }
  const p7 = path.join(targetDir, 'verify_superadmin_couple_directory.png');
  await page.screenshot({ path: p7 });
  console.log('Captured:', p7);

  // 7. Guest Mobile View - Feed Tab
  console.log('Testing Guest Mobile View...');
  const mobileContext = await browser.newContext({
    viewport: { width: 412, height: 915 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const guestMobileBtn = mobilePage.locator('button:has-text("Guest Mobile")').first();
  if (await guestMobileBtn.isVisible()) {
    await guestMobileBtn.click();
    await mobilePage.waitForTimeout(1000);
  }

  // Click on "View all ->" or the bottom nav Feed icon/label
  const feedBtn = mobilePage.locator('nav button:has-text("Feed"), button:has-text("View all")').first();
  if (await feedBtn.isVisible()) {
    await feedBtn.click();
    await mobilePage.waitForTimeout(800);
  }

  const p6 = path.join(targetDir, 'verify_guest_mobile_feed_clean.png');
  await mobilePage.screenshot({ path: p6 });
  console.log('Captured:', p6);
  await mobileContext.close();

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});
