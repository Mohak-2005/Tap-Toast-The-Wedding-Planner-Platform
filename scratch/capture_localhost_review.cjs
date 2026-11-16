const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Couple View: Events & Schedule ---');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Click on Events & Schedule tab
  const eventsTab = await page.$('button:has-text("Events & Schedule")');
  if (eventsTab) {
    await eventsTab.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '80_events_table_localhost.png') });
  console.log('Saved 80_events_table_localhost.png');

  // Test Manage Guest List modal
  const manageBtn = await page.$('button:has-text("Manage")');
  if (manageBtn) {
    await manageBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '81_manage_event_guests_modal.png') });
    console.log('Saved 81_manage_event_guests_modal.png');
    // Close modal
    const doneBtn = await page.$('button:has-text("Done")');
    if (doneBtn) await doneBtn.click();
    await page.waitForTimeout(500);
  }

  console.log('--- 2. Testing Seating Studio ---');
  const seatingTab = await page.$('button:has-text("Seating")');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '82_seating_studio_proper_layout.png') });
  console.log('Saved 82_seating_studio_proper_layout.png');

  // Open Cheers AI chatbot in Seating Studio
  const seatingCheersBtn = await page.$('button:has-text("Cheers AI")');
  if (seatingCheersBtn) {
    await seatingCheersBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '83_seating_cheers_chatbot.png') });
    console.log('Saved 83_seating_cheers_chatbot.png');
    // Close chatbot
    const closeCheers = await page.$('button[title*="Close Cheers AI"]');
    if (closeCheers) await closeCheers.click();
    await page.waitForTimeout(400);
  }

  console.log('--- 3. Testing Planner Day Sheet ---');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '84_planner_header_no_top_cheers.png') });
  console.log('Saved 84_planner_header_no_top_cheers.png');

  // Open floating Cheers AI in Planner
  const plannerCheersBtn = await page.$('button:has-text("Cheers AI")');
  if (plannerCheersBtn) {
    await plannerCheersBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '85_planner_floating_cheers_chatbot.png') });
    console.log('Saved 85_planner_floating_cheers_chatbot.png');
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
