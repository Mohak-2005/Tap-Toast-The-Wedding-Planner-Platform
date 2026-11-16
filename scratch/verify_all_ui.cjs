const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // ==========================================
  // 1. GUIDED ONBOARDING (STEPS 1, 2, 3)
  // ==========================================
  console.log('1. Testing Guided Couple Onboarding...');
  await page.goto('http://127.0.0.1:5173/#register-couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Screenshot Step 1: Who is celebrating?
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '36_guided_onboarding_step1.png'), fullPage: false });
  console.log('Captured 36_guided_onboarding_step1.png');

  // Click "Continue to Date & Venue"
  await page.locator('button:has-text("Continue to Date & Venue")').click();
  await page.waitForTimeout(600);

  // Screenshot Step 2: Date & Venue
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '37_guided_onboarding_step2.png'), fullPage: false });
  console.log('Captured 37_guided_onboarding_step2.png');

  // Click "Continue to Celebration Vibe"
  await page.locator('button:has-text("Continue to Celebration Vibe")').click();
  await page.waitForTimeout(600);

  // Screenshot Step 3: Size & Style
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '38_guided_onboarding_step3.png'), fullPage: false });
  console.log('Captured 38_guided_onboarding_step3.png');

  // ==========================================
  // 2. COUPLE DASHBOARD - EVENTS & SCHEDULE
  // ==========================================
  console.log('2. Testing Events & Schedule in Couple Dashboard...');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Click "Events & Schedule" sidebar tab
  await page.locator('button:has-text("Events & Schedule")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '39_couple_events_dashboard.png'), fullPage: false });
  console.log('Captured 39_couple_events_dashboard.png');

  // Click "Manage Guest List" on Sangeet Night event
  const manageGuestButtons = page.locator('button:has-text("Manage Guest List")');
  if (await manageGuestButtons.count() > 0) {
    await manageGuestButtons.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '40_manage_event_guest_list_modal.png'), fullPage: false });
    console.log('Captured 40_manage_event_guest_list_modal.png');
    // Close modal
    await page.locator('button:has-text("Done")').click();
    await page.waitForTimeout(300);
  }

  // Click "+ Create Wedding Event" button
  await page.locator('button:has-text("Create Wedding Event")').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '41_create_wedding_event_modal.png'), fullPage: false });
  console.log('Captured 41_create_wedding_event_modal.png');
  // Close modal
  await page.locator('button:has-text("Cancel")').first().click();
  await page.waitForTimeout(300);

  // ==========================================
  // 3. GUEST LIST TAB - EVENT FILTER & BADGES
  // ==========================================
  console.log('3. Testing Guest List Tab...');
  await page.getByRole('button', { name: 'Guest List', exact: true }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '42_guest_list_event_filter.png'), fullPage: false });
  console.log('Captured 42_guest_list_event_filter.png');

  // ==========================================
  // 4. CONTENT & STORIES - OUR STORY & CHEERS AI
  // ==========================================
  console.log('4. Testing Content & Stories and Cheers AI...');
  await page.getByRole('button', { name: 'Content & Stories', exact: true }).click();
  await page.waitForTimeout(600);

  // Click "Draft with Cheers AI" button
  await page.locator('button:has-text("Draft with Cheers AI")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '43_our_story_cheers_ai_modal.png'), fullPage: false });
  console.log('Captured 43_our_story_cheers_ai_modal.png');

  // ==========================================
  // 5. GUEST MOBILE VIEW - PRIYA SHARMA (4 EVENTS)
  // ==========================================
  console.log('5. Testing Guest Mobile View for Priya Sharma...');
  await page.goto('http://127.0.0.1:5173/#guest-mobile?tab=rsvp', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '44_guest_mobile_priya_rsvp.png'), fullPage: false });
  console.log('Captured 44_guest_mobile_priya_rsvp.png');

  // Schedule tab for Priya Sharma
  await page.goto('http://127.0.0.1:5173/#guest-mobile?tab=events', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '45_guest_mobile_priya_schedule.png'), fullPage: false });
  console.log('Captured 45_guest_mobile_priya_schedule.png');

  // ==========================================
  // 6. GUEST MOBILE VIEW - MARK JOHNSON (3 EVENTS)
  // ==========================================
  console.log('6. Testing Guest Mobile View for Mark Johnson...');
  const guestSelect = page.locator('select').first();
  if (await guestSelect.isVisible()) {
    await guestSelect.selectOption('Mark Johnson');
    await page.waitForTimeout(600);

    // Schedule tab for Mark Johnson
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '46_guest_mobile_mark_schedule.png'), fullPage: false });
    console.log('Captured 46_guest_mobile_mark_schedule.png');

    // RSVP tab for Mark Johnson
    await page.goto('http://127.0.0.1:5173/#guest-mobile?tab=rsvp', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const guestSelect2 = page.locator('select').first();
    if (await guestSelect2.isVisible()) {
      await guestSelect2.selectOption('Mark Johnson');
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '47_guest_mobile_mark_rsvp.png'), fullPage: false });
    console.log('Captured 47_guest_mobile_mark_rsvp.png');
  }

  await browser.close();
  console.log('All verification screenshots successfully completed!');
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
