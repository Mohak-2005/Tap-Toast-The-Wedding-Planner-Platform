import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8443';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Register Page: +61 Prefix Box ---');
  await page.goto(`${BASE_URL}/#register`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/desktop_register_plus61_boxes.png`, fullPage: false });
  console.log('Captured desktop_register_plus61_boxes.png');

  console.log('--- 2. Testing S/R Mobile View: Sign In Phone Chassis ---');
  await page.goto(`${BASE_URL}/#sr-mobile`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/sr_mobile_signin.png`, fullPage: false });
  console.log('Captured sr_mobile_signin.png');

  console.log('--- 3. Testing S/R Mobile View: Register Phone Chassis (Couple) ---');
  const registerInsidePhoneBtn = page.locator('button:has-text("📝 Register")').first();
  await registerInsidePhoneBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ARTIFACT_DIR}/sr_mobile_register_couple.png`, fullPage: false });
  console.log('Captured sr_mobile_register_couple.png');

  console.log('--- 4. Testing S/R Mobile View: Register Phone Chassis (MC) ---');
  const mcBtn = page.locator('button:has-text("MC / Planner")').first();
  await mcBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ARTIFACT_DIR}/sr_mobile_register_mc.png`, fullPage: false });
  console.log('Captured sr_mobile_register_mc.png');

  await browser.close();
  console.log('All verification tasks finished!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
