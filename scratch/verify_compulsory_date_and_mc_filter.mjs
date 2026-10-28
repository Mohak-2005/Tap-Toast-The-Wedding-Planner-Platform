import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  console.log('=== TEST 1: Wedding Date is Compulsory on Step 1 ===');
  await page.goto('http://localhost:8443/#register-couple');
  await page.waitForTimeout(1000);

  // Check initial date value is empty
  const dateInput = page.locator('input[type="date"]');
  const initialDateVal = await dateInput.inputValue();
  console.log('Initial wedding date value (EXPECTED empty ""):', JSON.stringify(initialDateVal));

  // Try clicking Continue without filling wedding date
  console.log('Clicking Continue to Plan & Payment without entering wedding date...');
  await page.click('button:has-text("Continue to Plan & Payment")');
  await page.waitForTimeout(500);

  // Verify we are still on Step 1 (not payment)
  const isStillOnStep1 = await page.locator('text=Step 1 of 3 · Couple Onboarding').isVisible();
  console.log('Still on Step 1 after empty date submission (EXPECTED true):', isStillOnStep1);
  if (!isStillOnStep1) {
    throw new Error('Form proceeded without compulsory wedding date!');
  }

  // Verify error text is displayed (inline error and toast)
  const hasErrorMsg = await page.locator('text=Wedding Date is compulsory').first().isVisible();
  console.log('Compulsory error prompt visible (EXPECTED true):', hasErrorMsg);
  if (!hasErrorMsg) {
    throw new Error('Expected compulsory error prompt to be visible!');
  }

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_compulsory_wedding_date_error.png' });
  console.log('Saved verify_compulsory_wedding_date_error.png');

  console.log('=== TEST 2: Filter MCs for 2026-11-14 (Robert Available, Marcus & Elena Booked) ===');
  // Fill wedding date with 2026-11-14
  await dateInput.fill('2026-11-14');
  await page.waitForTimeout(300);

  // Now click Continue to Plan & Payment
  await page.click('button:has-text("Continue to Plan & Payment")');
  await page.waitForTimeout(600);

  const isStep2 = await page.locator('text=Step 2: Choose Your Plan').isVisible();
  console.log('Successfully reached Step 2:', isStep2);

  // Click Pay & Select MC
  await page.click('button:has-text("Pay $299 & Select MC")');
  await page.waitForTimeout(800);

  const isStep3 = await page.locator('text=Step 3: Select MC & Joey AI Setup').isVisible();
  console.log('Successfully reached Step 3:', isStep3);

  // Verify Date availability banner
  const bannerText = await page.locator('text=Selected Wedding Date').textContent();
  console.log('Banner text visible:', bannerText);

  // Click MC dropdown button to open dropdown list
  console.log('Opening MC dropdown list for 2026-11-14...');
  await page.click('button:has-text("SELECT YOUR CERTIFIED WEDDING MC") + div button, div:has-text("SELECT YOUR CERTIFIED WEDDING MC") ~ div button');
  await page.waitForTimeout(500);

  // Check which MCs are visible
  const dropdown = page.locator('.max-h-\\[300px\\]');
  const robertVisible = await dropdown.locator('text=Robert Galati').count();
  const marcusVisible = await dropdown.locator('text=Marcus Thorne').count();
  const elenaVisible = await dropdown.locator('text=Elena Rostova').count();
  const customVisible = await dropdown.locator('text=Invite My Own MC').count();

  console.log('On 2026-11-14:');
  console.log('  Robert Galati visible (EXPECTED: 1):', robertVisible);
  console.log('  Marcus Thorne visible (EXPECTED: 0 - Booked):', marcusVisible);
  console.log('  Elena Rostova visible (EXPECTED: 0 - Booked):', elenaVisible);
  console.log('  Invite My Own MC visible (EXPECTED: 1):', customVisible);

  if (robertVisible !== 1 || marcusVisible !== 0 || elenaVisible !== 0 || customVisible !== 1) {
    throw new Error('MC availability filtering on 2026-11-14 failed!');
  }

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_mc_filtered_for_2026_11_14.png' });
  console.log('Saved verify_mc_filtered_for_2026_11_14.png');

  console.log('=== TEST 3: Filter MCs for 2026-11-21 (Marcus & Elena Available, Robert Booked) ===');
  // Open fresh page to reset state to Step 1
  const page2 = await context.newPage();
  await page2.goto('http://localhost:8443/#register-couple');
  await page2.waitForTimeout(1000);

  const dateInput2 = page2.locator('input[type="date"]');
  await dateInput2.fill('2026-11-21');
  await page2.waitForTimeout(300);

  await page2.click('button:has-text("Continue to Plan & Payment")');
  await page2.waitForTimeout(600);

  await page2.click('button:has-text("Pay $299 & Select MC")');
  await page2.waitForTimeout(800);

  // Click MC dropdown button
  await page2.click('button:has-text("SELECT YOUR CERTIFIED WEDDING MC") + div button, div:has-text("SELECT YOUR CERTIFIED WEDDING MC") ~ div button');
  await page2.waitForTimeout(500);

  const dropdown2 = page2.locator('.max-h-\\[300px\\]');
  const robertVisible2 = await dropdown2.locator('text=Robert Galati').count();
  const marcusVisible2 = await dropdown2.locator('text=Marcus Thorne').count();
  const elenaVisible2 = await dropdown2.locator('text=Elena Rostova').count();
  const customVisible2 = await dropdown2.locator('text=Invite My Own MC').count();

  console.log('On 2026-11-21:');
  console.log('  Robert Galati visible (EXPECTED: 0 - Booked):', robertVisible2);
  console.log('  Marcus Thorne visible (EXPECTED: 1):', marcusVisible2);
  console.log('  Elena Rostova visible (EXPECTED: 1):', elenaVisible2);
  console.log('  Invite My Own MC visible (EXPECTED: 1):', customVisible2);

  if (robertVisible2 !== 0 || marcusVisible2 !== 1 || elenaVisible2 !== 1 || customVisible2 !== 1) {
    throw new Error('MC availability filtering on 2026-11-21 failed!');
  }

  await page2.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_mc_filtered_for_2026_11_21.png' });
  console.log('Saved verify_mc_filtered_for_2026_11_21.png');

  await browser.close();
  console.log('🎉 ALL DATE COMPULSORY & MC AVAILABILITY FILTER TESTS PASSED WITH 100% SUCCESS!');
}

run().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
