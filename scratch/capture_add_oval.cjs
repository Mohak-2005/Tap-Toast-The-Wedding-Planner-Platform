const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Navigate to Seating tab
  const seatingTab = await page.waitForSelector('button:has-text("Seating")');
  await seatingTab.click();
  await page.waitForTimeout(1000);

  // Open Add Table Modal
  const addTableBtn = await page.waitForSelector('button:has-text("Add Table")');
  await addTableBtn.click();
  await page.waitForTimeout(600);

  // Select "oval" inside the modal
  await page.waitForSelector('text=Add New Reception Table');
  const modalSelect = await page.waitForSelector('div[class*="fixed"] select');
  await modalSelect.selectOption('oval');
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '61_seating_studio_add_oval_modal.png') });
  console.log('Saved 61_seating_studio_add_oval_modal.png');

  await browser.close();
})();
