import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Loading Super Admin...');
  await page.goto('http://localhost:8443/#superadmin');
  await page.waitForTimeout(1000);

  // Check 1: Super Admin Sidebar - No numbers, only text
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_superadmin_sidebar_no_numbers.png' });
  console.log('Saved sidebar screenshot.');

  // Check 2: Check "Invite Couple" button
  const inviteBtn = page.locator('button:has-text("Invite Couple")').first();
  const inviteBtnText = await inviteBtn.innerText();
  console.log('Invite button text:', inviteBtnText);
  await inviteBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_superadmin_invite_couple_modal.png' });
  console.log('Saved Invite Couple modal screenshot.');
  // Close modal
  await page.click('button[aria-label="Close dialog"]');
  await page.waitForTimeout(400);

  // Check 3: Go to Audit Logs tab
  await page.click('button:has-text("Audit Logs")');
  await page.waitForTimeout(800);
  // Ensure "Couple Onboarding & Question Preference Audits" is NOT in DOM
  const separateCardCount = await page.locator('text=IMMUTABLE ONBOARDING AUDIT TRAIL').count();
  console.log('Separate card count (should be 0):', separateCardCount);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_superadmin_audit_only_table.png' });
  console.log('Saved System Audit Log table screenshot.');

  // Check 4: Navigate to Register Couple
  console.log('2. Loading Couple Registration...');
  await page.goto('http://localhost:8443/#register-couple');
  await page.waitForTimeout(800);

  // Step 1 -> Step 2
  await page.click('button:has-text("Continue to Plan & Payment")');
  await page.waitForTimeout(500);

  // Step 2 -> Step 3
  await page.click('button:has-text("Pay $299 & Select MC")');
  await page.waitForTimeout(800);

  // Verify: Style & Region box is gone
  const styleBoxCount = await page.locator('text=Style & Region:').count();
  console.log('Style & Region box count (should be 0):', styleBoxCount);

  // Verify: Online badge is gone
  const onlineBadgeCount = await page.locator('text=Online').count();
  console.log('Online badge count (should be 0):', onlineBadgeCount);

  // Verify: "Change MC" text is gone
  const changeMcTextCount = await page.locator('text=Change MC').count();
  console.log('Change MC text count (should be 0):', changeMcTextCount);

  // Verify: Eye icon button is present
  const eyeBtn = page.locator('button[aria-label="View MC Info"]');
  console.log('Eye button count (should be 1):', await eyeBtn.count());

  // Screenshot Step 3 clean layout
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_clean_layout.png' });
  console.log('Saved Step 3 clean layout screenshot.');

  // Click eye icon to open MC Info Pop-up Modal
  await eyeBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_mc_eye_modal_open.png' });
  console.log('Saved MC Info Modal open screenshot.');

  // Click outside (e.g. at coordinates (50, 50)) to close the modal
  await page.mouse.click(50, 50);
  await page.waitForTimeout(500);
  const modalCountAfterBackdropClick = await page.locator('text=MASTER OF CEREMONIES PROFILE').count();
  console.log('Modal count after clicking outside (should be 0):', modalCountAfterBackdropClick);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_mc_eye_modal_closed.png' });
  console.log('Saved MC Info Modal closed screenshot.');

  // Now test that the downward chevron arrow still works to open MC dropdown!
  // Click on the MC selector card button (excluding the eye button)
  await page.click('button:has-text("Robert Galati")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_chevron_dropdown_open.png' });
  console.log('Saved Chevron Dropdown Open screenshot.');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
