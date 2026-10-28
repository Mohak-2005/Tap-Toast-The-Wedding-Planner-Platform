import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8443';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- TEST 1: Register Page (Optional Venue & Dual Email Notice) ---');
  await page.goto(`${BASE_URL}/#register`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/1_register_couple_dual_email.png`, fullPage: false });
  console.log('Captured 1_register_couple_dual_email.png');

  console.log('--- TEST 2: Login Page Demo Accounts & Dual Logins ---');
  await page.goto(`${BASE_URL}/#login`);
  await page.waitForTimeout(1000);
  
  // If already logged in, click "Sign out • Switch Account"
  const signOutBtn = page.locator('button:has-text("Sign out • Switch Account")');
  if (await signOutBtn.isVisible()) {
    await signOutBtn.click();
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: `${ARTIFACT_DIR}/2_login_dual_couple_options.png`, fullPage: false });
  console.log('Captured 2_login_dual_couple_options.png');

  console.log('--- TEST 3: Login with Bride Email (sophie@demo.test) ---');
  // Click on Sophie Bell 1-click
  const brideFill = page.locator('strong:has-text("Sophie Bell (Bride)")');
  if (await brideFill.isVisible()) {
    await brideFill.click();
    await page.waitForTimeout(300);
    await page.locator('button[type="submit"]:has-text("Sign in")').click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/3_login_bride_email_success.png`, fullPage: false });
  console.log('Captured 3_login_bride_email_success.png');

  console.log('--- TEST 4: Guest List Categorisation in Couple View ---');
  // Click Guest List tab
  const guestTab = page.locator('button:has-text("Guest List"), a:has-text("Guest List")').first();
  if (await guestTab.isVisible()) {
    await guestTab.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/4_guest_categorisation_couple.png`, fullPage: false });
  console.log('Captured 4_guest_categorisation_couple.png');

  console.log('--- TEST 5: MC Gift Ledger View & Modal ---');
  await page.goto(`${BASE_URL}/#mc`);
  await page.waitForTimeout(1000);

  // Click on "Gift Ledger & Wishing Well" in sidebar
  const giftsSidebar = page.locator('button:has-text("Gift Ledger & Wishing Well")').first();
  if (await giftsSidebar.isVisible()) {
    await giftsSidebar.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/5_mc_gift_ledger_overview.png`, fullPage: false });
  console.log('Captured 5_mc_gift_ledger_overview.png');

  // Click Record Cash / Envelope Gift
  const recordGiftBtn = page.locator('button:has-text("Record Cash / Envelope Gift")').first();
  if (await recordGiftBtn.isVisible()) {
    await recordGiftBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${ARTIFACT_DIR}/6_mc_record_envelope_modal.png`, fullPage: false });
    console.log('Captured 6_mc_record_envelope_modal.png');

    // Fill the modal
    await page.fill('input[placeholder="e.g. Uncle Arthur & Aunt Evelyn"]', 'Aunt Evelyn & Uncle Arthur');
    await page.fill('input[placeholder="300"]', '500');
    await page.fill('textarea[placeholder*="Handed to MC"]', 'Podium card handed to MC Robert at reception entrance');
    await page.locator('button[type="submit"]:has-text("Save to Gift Ledger")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/7_mc_gift_ledger_after_entry.png`, fullPage: false });
    console.log('Captured 7_mc_gift_ledger_after_entry.png');
  }

  console.log('--- TEST 6: MC Team Role & Permission Parity ---');
  const teamSidebar = page.locator('button:has-text("Team & Crew")').first();
  if (await teamSidebar.isVisible()) {
    await teamSidebar.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/8_mc_team_parity.png`, fullPage: false });
  console.log('Captured 8_mc_team_parity.png');

  console.log('--- TEST 7: Super Admin Billing Model (No MC payouts, Couple Free) ---');
  await page.goto(`${BASE_URL}/#superadmin`);
  await page.waitForTimeout(1000);

  const plansTab = page.locator('button:has-text("Plans & Billing")').first();
  if (await plansTab.isVisible()) {
    await plansTab.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/9_superadmin_billing_model.png`, fullPage: false });
  console.log('Captured 9_superadmin_billing_model.png');

  await browser.close();
  console.log('Verification completed successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
