const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5173/#couple');
  await page.waitForTimeout(1500);

  // Navigate to Seating tab
  const seatingTab = await page.waitForSelector('button:has-text("Seating")');
  await seatingTab.click();
  await page.waitForTimeout(1200);

  // Click Table 7 using evaluate click
  const table7El = await page.waitForSelector('div[title*="Table 7"]');
  console.log('Dispatching click on Table 7...');
  await table7El.evaluate(el => el.click());
  await page.waitForTimeout(1000);

  // Capture Level 2 Oval Table Detail View
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '60_seating_studio_oval_table_detail.png') });
  console.log('Saved 60_seating_studio_oval_table_detail.png');

  // Back to floor plan
  const backBtn = await page.waitForSelector('button:has-text("Return to Overall Room Layout")');
  await backBtn.click();
  await page.waitForTimeout(800);

  // Zoom to 65%
  const zoomOverallBtn = await page.waitForSelector('button:has-text("Overall (65%)")');
  await zoomOverallBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '59_seating_studio_zoom_overall.png') });
  console.log('Saved 59_seating_studio_zoom_overall.png');

  // Reset zoom to 100%
  const zoom100Btn = await page.waitForSelector('button:has-text("100%")');
  await zoom100Btn.click();
  await page.waitForTimeout(500);

  // Open Add Table Modal
  const addTableBtn = await page.waitForSelector('button:has-text("Add Table")');
  await addTableBtn.click();
  await page.waitForTimeout(600);

  // Select "Oval Banquet Table"
  const shapeSelect = await page.waitForSelector('select:has-text("Round Banquet")');
  await shapeSelect.selectOption('oval');
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '61_seating_studio_add_oval_modal.png') });
  console.log('Saved 61_seating_studio_add_oval_modal.png');

  console.log('DONE!');
  await browser.close();
})();
