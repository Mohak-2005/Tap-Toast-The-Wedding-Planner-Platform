import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8443';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. MOBILE CONTEXT (iPhone 14 dimensions: 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();

  console.log('--- 1. Testing Mobile View: Sign-In ---');
  await mobilePage.goto(`${BASE_URL}/#login`);
  await mobilePage.waitForTimeout(800);
  const signOutBtn = mobilePage.locator('button:has-text("Sign out • Switch Account")');
  if (await signOutBtn.isVisible()) {
    await signOutBtn.click();
    await mobilePage.waitForTimeout(500);
  }
  await mobilePage.screenshot({ path: `${ARTIFACT_DIR}/mobile_signin_view.png`, fullPage: false });
  console.log('Captured mobile_signin_view.png');

  console.log('--- 2. Testing Mobile View: Register (Couple) ---');
  await mobilePage.goto(`${BASE_URL}/#register`);
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: `${ARTIFACT_DIR}/mobile_register_couple_view.png`, fullPage: false });
  console.log('Captured mobile_register_couple_view.png');

  console.log('--- 3. Testing Mobile View: Register (MC) ---');
  const mcTabBtn = mobilePage.locator('button:has-text("MC / Planner")');
  if (await mcTabBtn.isVisible()) {
    await mcTabBtn.click();
    await mobilePage.waitForTimeout(600);
  }
  await mobilePage.screenshot({ path: `${ARTIFACT_DIR}/mobile_register_mc_view.png`, fullPage: false });
  console.log('Captured mobile_register_mc_view.png');

  // 2. DESKTOP CONTEXT (1440x900)
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopContext.newPage();

  console.log('--- 4. Testing Desktop Register: Clean UI, No Box, Small (optional) ---');
  await page.goto(`${BASE_URL}/#register`);
  await page.waitForTimeout(800);
  const coupleTabBtn = page.locator('button:has-text("Couple Portal")');
  if (await coupleTabBtn.isVisible()) {
    await coupleTabBtn.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/clean_register_desktop.png`, fullPage: false });
  console.log('Captured clean_register_desktop.png');

  console.log('--- 5. Testing Guest List: 2 Pills + Category Dropdown ---');
  await page.goto(`${BASE_URL}/#login`);
  await page.waitForTimeout(800);
  const desktopSignOut = page.locator('button:has-text("Sign out • Switch Account")');
  if (await desktopSignOut.isVisible()) {
    await desktopSignOut.click();
    await page.waitForTimeout(500);
  }
  const brideFill = page.locator('strong:has-text("Sophie Bell (Bride)")');
  if (await brideFill.isVisible()) {
    await brideFill.click();
    await page.waitForTimeout(300);
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForTimeout(1200);
  }
  const guestTab = page.locator('button:has-text("Guest List"), a:has-text("Guest List")').first();
  if (await guestTab.isVisible()) {
    await guestTab.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/guest_list_2_pills_clean.png`, fullPage: false });
  console.log('Captured guest_list_2_pills_clean.png');

  console.log('--- 6. Testing MC Console: Sidebar Clean (No Gifts in Global Sidebar) ---');
  await page.goto(`${BASE_URL}/#mc`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/mc_sidebar_clean_no_gifts.png`, fullPage: false });
  console.log('Captured mc_sidebar_clean_no_gifts.png');

  console.log('--- 7. Testing Per-Wedding Console: Gift Ledger inside Wedding ---');
  // Click on wedding console
  const openConsoleBtn = page.locator('button:has-text("Open Wedding Console")').first();
  if (await openConsoleBtn.isVisible()) {
    await openConsoleBtn.click();
    await page.waitForTimeout(1000);
  }
  const giftTabInWedding = page.locator('button:has-text("Gift & Wishing Well Ledger"), button:has-text("Gift & Thank-You")').first();
  if (await giftTabInWedding.isVisible()) {
    await giftTabInWedding.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/mc_wedding_console_gift_ledger.png`, fullPage: false });
  console.log('Captured mc_wedding_console_gift_ledger.png');

  console.log('--- 8. Testing Super Admin: Banner Removed ---');
  await page.goto(`${BASE_URL}/#superadmin`);
  await page.waitForTimeout(800);
  const plansTab = page.locator('button:has-text("Plans & Billing")').first();
  if (await plansTab.isVisible()) {
    await plansTab.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/superadmin_clean_no_message.png`, fullPage: false });
  console.log('Captured superadmin_clean_no_message.png');

  await browser.close();
  console.log('All verification tasks finished!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
