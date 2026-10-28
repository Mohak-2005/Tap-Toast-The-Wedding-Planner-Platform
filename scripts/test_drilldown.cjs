const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5173/#couple');
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Seating")').first().click();
  await page.waitForTimeout(1000);

  // Click HEAD TABLE card on canvas
  const headTblCard = page.locator('div[draggable="true"]:has-text("HEAD TABLE")').first();
  console.log('Found headTblCard count:', await headTblCard.count());
  await headTblCard.click();
  await page.waitForTimeout(1000);

  // Check if Level 2 is open
  const level2Heading = page.locator('text=LEVEL 2 • INDIVIDUAL TABLE DETAIL');
  console.log('Level 2 open:', await level2Heading.isVisible());

  // Click Round button
  const roundBtn = page.locator('button:text-is("round")').first();
  console.log('Round button visible:', await roundBtn.isVisible());
  await roundBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_head_table_round.png' });
  console.log('Captured verify_head_table_round.png');

  // Click Rectangular button
  const rectBtn = page.locator('button:text-is("rectangular")').first();
  await rectBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_head_table_rectangular.png' });
  console.log('Captured verify_head_table_rectangular.png');

  await browser.close();
  console.log('DONE!');
})();
