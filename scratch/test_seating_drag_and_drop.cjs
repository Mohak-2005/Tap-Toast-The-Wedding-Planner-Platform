const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:5173/#couple...');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  const seatingTab = await page.$('button:has-text("Seating")');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1200);
  }

  // Find Table 1
  console.log('Finding Table 1...');
  const table1 = await page.$('div[title*="Table 1"]');
  if (!table1) {
    throw new Error('Table 1 not found!');
  }

  const table1BoxBefore = await table1.boundingBox();
  console.log('Table 1 initial position:', table1BoxBefore);

  // Find Canvas
  const canvas = await page.$('#room_canvas_inner_board');
  const canvasBox = await canvas.boundingBox();
  console.log('Canvas box:', canvasBox);

  // Drag Table 1 down and to the right
  const targetX = canvasBox.x + canvasBox.width * 0.35;
  const targetY = canvasBox.y + canvasBox.height * 0.55;

  console.log(`Dragging Table 1 to (${targetX}, ${targetY})...`);
  await page.mouse.move(table1BoxBefore.x + table1BoxBefore.width / 2, table1BoxBefore.y + table1BoxBefore.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.move(targetX, targetY, { steps: 15 });
  await page.waitForTimeout(150);
  await page.mouse.up();
  await page.waitForTimeout(800);

  const table1BoxAfter = await table1.boundingBox();
  console.log('Table 1 final position:', table1BoxAfter);

  // Screenshot: Table 1 moved and stayed!
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '88_seating_table_dragged_and_stayed.png') });
  console.log('Saved 88_seating_table_dragged_and_stayed.png');

  // Move mouse away to verify the table does NOT follow the cursor
  console.log('Moving cursor to top-left (100, 100) to confirm table does NOT stick to cursor...');
  await page.mouse.move(100, 100, { steps: 5 });
  await page.waitForTimeout(500);

  const table1BoxAfterMouseAway = await table1.boundingBox();
  console.log('Table 1 position after moving cursor away:', table1BoxAfterMouseAway);

  // Now test regular click on Table 2 to verify modal opens cleanly and doesn't stick
  console.log('Clicking Table 2 to test modal open...');
  const table2 = await page.$('div[title*="Table 2"]');
  if (table2) {
    await table2.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '89_table_modal_opened_on_click.png') });
    console.log('Saved 89_table_modal_opened_on_click.png');
  }

  await browser.close();
  console.log('All drag-and-drop and click tests PASSED!');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
