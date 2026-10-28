import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:8443/#couple ...');
  await page.goto('http://localhost:8443/#couple', { waitUntil: 'networkidle' });

  // Click on Seating tab if not already on it
  const seatingBtn = page.locator('button:has-text("Seating"), a:has-text("Seating"), [data-tab="seating"]').first();
  if (await seatingBtn.isVisible()) {
    await seatingBtn.click();
    await page.waitForTimeout(1000);
  }

  // Find the Seating Arrangement Bar
  const seatingBar = page.locator('text=ACTIVE SEATING ARRANGEMENT:').first();
  await seatingBar.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Active Seating Arrangement bar found.');

  // Verify that "layouts saved" and "Synchronized" are NOT present
  const hasLayoutsSaved = await page.locator('text=layouts saved').isVisible().catch(() => false);
  const hasSynchronized = await page.locator('text=Synchronized').isVisible().catch(() => false);
  console.log('Has "layouts saved":', hasLayoutsSaved);
  console.log('Has "Synchronized":', hasSynchronized);

  // Check the select dropdown options
  const selectElem = page.locator('select').filter({ hasText: 'Seating Arrangement' }).first();
  const optionTexts = await selectElem.locator('option').allInnerTexts();
  console.log('Dropdown options:', optionTexts);

  // Verify options don't contain timestamp pattern (e.g. 2026-)
  const hasTimestampInOptions = optionTexts.some(txt => /202[0-9]-/.test(txt));
  console.log('Has timestamps in dropdown options:', hasTimestampInOptions);

  // Take screenshot of the arrangement bar and canvas
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_clean_seating_bar_and_tables.png'),
    fullPage: false,
  });
  console.log('Saved verify_clean_seating_bar_and_tables.png');

  // Verify table elements on canvas (#room_canvas_container)
  const canvas = page.locator('#room_canvas_container');
  const tableCards = canvas.locator('> div[draggable="true"]:has-text("/")');
  const tableCount = await tableCards.count();
  console.log(`Found ${tableCount} table cards on canvas.`);

  for (let i = 0; i < tableCount; i++) {
    const card = tableCards.nth(i);
    const text = await card.innerText();
    const hasFree = /free/i.test(text);
    const hasRoundWord = /round/i.test(text);
    const hasRectWord = /rectangular/i.test(text);
    const svgs = await card.locator('svg').count();
    console.log(`Table ${i + 1} text: "${text.replace(/\n/g, ' ')}", svgs inside: ${svgs}, has 'free': ${hasFree}, has 'round': ${hasRoundWord}, has 'rectangular': ${hasRectWord}`);
  }

  // Click "Compare Layouts" button
  const compareBtn = page.locator('button:has-text("Compare Layouts")').first();
  await compareBtn.click();
  await page.waitForTimeout(500);

  // Check Compare Layouts modal
  const compareModal = page.locator('text=Compare Saved Seating Arrangements').first();
  await compareModal.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Compare Seating Layouts modal opened.');

  // Check that the modal does NOT contain timestamps like 2026-
  const modalText = await compareModal.locator('xpath=ancestor::div[contains(@class, "fixed")]').innerText();
  const hasTimestampInModal = /202[0-9]-/.test(modalText);
  console.log('Has timestamps in Compare modal:', hasTimestampInModal);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'verify_compare_modal_no_timestamps.png'),
    fullPage: false,
  });
  console.log('Saved verify_compare_modal_no_timestamps.png');

  await browser.close();
  console.log('Test completed successfully.');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
