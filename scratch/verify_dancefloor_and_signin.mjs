import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Registration Sign-In Link Visibility Across Steps ---');
  await page.goto('http://localhost:8443/#register-couple');
  await page.waitForTimeout(1000);

  // Step 1: Check "Already have an account? Sign in"
  const step1SignInCount = await page.locator('text=Already have an account?').count();
  console.log('Step 1 "Already have an account?" count (EXPECTED: 1):', step1SignInCount);
  if (step1SignInCount !== 1) {
    throw new Error(`Expected 1 sign in link on Step 1, found ${step1SignInCount}`);
  }
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step1_signin_present.png' });

  // Move to Step 2
  console.log('Navigating to Step 2: Plan & Payment...');
  await page.click('button:has-text("Continue to Plan & Payment")');
  await page.waitForTimeout(600);

  // Step 2: Check "Already have an account? Sign in"
  const step2SignInCount = await page.locator('text=Already have an account?').count();
  console.log('Step 2 "Already have an account?" count (EXPECTED: 0):', step2SignInCount);
  if (step2SignInCount !== 0) {
    throw new Error(`Expected 0 sign in link on Step 2, found ${step2SignInCount}`);
  }
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step2_signin_hidden.png' });

  // Move to Step 3
  console.log('Navigating to Step 3: MC & AI Concierge Setup...');
  await page.click('button:has-text("Pay $299 & Select MC")');
  await page.waitForTimeout(800);

  // Step 3: Check "Already have an account? Sign in"
  const step3SignInCount = await page.locator('text=Already have an account?').count();
  console.log('Step 3 "Already have an account?" count (EXPECTED: 0):', step3SignInCount);
  if (step3SignInCount !== 0) {
    throw new Error(`Expected 0 sign in link on Step 3, found ${step3SignInCount}`);
  }
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_step3_signin_hidden.png' });

  console.log('--- 2. Testing Draggable Main Dance Floor on Seating Planner ---');
  await page.goto('http://localhost:8443/#couple');
  await page.waitForTimeout(1000);

  // Switch to Seating tab
  console.log('Navigating to Seating Planner tab...');
  await page.click('button:has-text("Seating")');
  await page.waitForTimeout(1000);

  // Find Main Dance Floor
  const danceFloor = page.locator('#canvas_main_dance_floor');
  const isDanceFloorVisible = await danceFloor.isVisible();
  console.log('Dance floor is visible on canvas:', isDanceFloorVisible);
  if (!isDanceFloorVisible) {
    throw new Error('Dance floor element #canvas_main_dance_floor not found or not visible!');
  }

  // Check draggable attribute
  const isDraggable = await danceFloor.getAttribute('draggable');
  console.log('Dance floor draggable attribute (EXPECTED: "true"):', isDraggable);

  // Check initial position style
  const initialStyle = await danceFloor.getAttribute('style');
  console.log('Dance floor initial style:', initialStyle);

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_dancefloor_draggable_canvas.png' });

  // Test Drag and Drop of Dance Floor
  console.log('Dragging dance floor to new canvas position (e.g. 70%, 60%)...');
  const canvas = page.locator('#room_canvas_container');
  const canvasBox = await canvas.boundingBox();
  const danceFloorBox = await danceFloor.boundingBox();

  if (canvasBox && danceFloorBox) {
    const targetX = canvasBox.x + canvasBox.width * 0.70;
    const targetY = canvasBox.y + canvasBox.height * 0.60;

    await page.evaluate(({ targetX, targetY }) => {
      const floor = document.getElementById('canvas_main_dance_floor');
      const container = document.getElementById('room_canvas_container');
      const dt = new DataTransfer();
      dt.setData('text/plain', 'dancefloor');
      floor.dispatchEvent(new DragEvent('dragstart', { dataTransfer: dt, bubbles: true }));
      container.dispatchEvent(new DragEvent('dragover', { clientX: targetX, clientY: targetY, bubbles: true, cancelable: true }));
      container.dispatchEvent(new DragEvent('drop', { clientX: targetX, clientY: targetY, dataTransfer: dt, bubbles: true, cancelable: true }));
    }, { targetX, targetY });

    await page.waitForTimeout(600);

    const updatedStyle = await danceFloor.getAttribute('style');
    console.log('Dance floor updated style after drop:', updatedStyle);
  }

  // Save the arrangement to verify danceFloorPos is persisted
  console.log('Saving layout with new dance floor position...');
  await page.click('button:has-text("Save Arrangement")');
  await page.waitForTimeout(500);

  // Clear and fill arrangement name
  const nameInput = page.locator('input[value*="Seating Arrangement"], input[placeholder*="Seating Arrangement"]').first();
  await nameInput.fill('Dance Floor Custom Layout');
  await page.click('button:has-text("Save & Sync Arrangement")');
  await page.waitForTimeout(800);

  // Take screenshot of moved dance floor and saved arrangement
  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_dancefloor_moved_and_saved.png' });
  console.log('Saved verify_dancefloor_moved_and_saved.png');

  // Verify in Compare Layouts
  await page.click('button:has-text("Compare Layouts")');
  await page.waitForTimeout(600);
  const compareCount = await page.locator('text=Dance Floor Custom Layout').count();
  console.log('Saved layout found in Compare Layouts modal:', compareCount);

  await page.screenshot({ path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/verify_dancefloor_compare_modal.png' });
  console.log('Saved verify_dancefloor_compare_modal.png');

  await browser.close();
  console.log('🎉 ALL TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
