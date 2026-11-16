const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- Navigating to http://127.0.0.1:5173/#planner ---');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Click on Sophie & James wedding card to enter planner wedding workspace
  console.log('Clicking on Sophie & James wedding...');
  const weddingCard = await page.$('text=Sophie & James');
  if (weddingCard) {
    await weddingCard.click();
    await page.waitForTimeout(1200);
  }

  // Screenshot: Planner Day Sheet header without top Cheers AI button
  console.log('Capturing 86_planner_daysheet_workspace.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '86_planner_daysheet_workspace.png') });

  // Click floating Cheers AI button at bottom-right
  console.log('Clicking floating Cheers AI button...');
  const cheersBtn = await page.$('button[title*="Cheers AI"]');
  if (cheersBtn) {
    await cheersBtn.click();
    await page.waitForTimeout(800);
    console.log('Capturing 87_planner_floating_cheers_widget_open.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '87_planner_floating_cheers_widget_open.png') });
  } else {
    console.log('Could not find cheersBtn with title');
    // Try text selector
    const btn = await page.$('button:has-text("Cheers AI")');
    if (btn) {
      await btn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '87_planner_floating_cheers_widget_open.png') });
    }
  }

  await browser.close();
  console.log('Done capturing planner screenshots!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
