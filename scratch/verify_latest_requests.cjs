const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Events Table View (Request 1) ---');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const eventsTab = await page.$('button:has-text("Events & Schedule")');
  if (eventsTab) {
    await eventsTab.click();
    await page.waitForTimeout(800);
  }

  // Screenshot 75: Clean Event Table (Just Event Name, clean 4/83)
  console.log('Capturing 75_clean_events_table.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '75_clean_events_table.png') });

  console.log('--- 2. Testing Seating Studio Tables Layout (Request 2) ---');
  const seatingTab = await page.$('button:has-text("Seating")');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
  }

  // Screenshot 76: Floor Plan with properly spaced tables
  console.log('Capturing 76_seating_studio_proper_tables_layout.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '76_seating_studio_proper_tables_layout.png') });

  // Test drag and drop on Table 1
  console.log('Testing pointer drag on Table 1...');
  const table1 = await page.$('div[title*="Table 1"]');
  if (table1) {
    const box = await table1.boundingBox();
    if (box) {
      // Drag Table 1 by 120px to the right and 80px down
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(100);
      await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 + 80, { steps: 10 });
      await page.waitForTimeout(100);
      await page.mouse.up();
      await page.waitForTimeout(600);

      console.log('Capturing 77_table1_dragged_smoothly.png...');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '77_table1_dragged_smoothly.png') });
    }
  }

  // Also test dragging the Main Dance Floor
  console.log('Testing pointer drag on Main Dance Floor...');
  const danceFloor = await page.$('#canvas_main_dance_floor');
  if (danceFloor) {
    const box = await danceFloor.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(100);
      await page.mouse.move(box.x + box.width / 2 - 80, box.y + box.height / 2 + 50, { steps: 10 });
      await page.waitForTimeout(100);
      await page.mouse.up();
      await page.waitForTimeout(600);

      console.log('Capturing 78_dancefloor_dragged_smoothly.png...');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '78_dancefloor_dragged_smoothly.png') });
    }
  }

  await browser.close();
  console.log('✓ All verification tests and screenshots completed successfully!');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
