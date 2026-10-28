import { chromium } from 'playwright';
import path from 'path';

const artifactsDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('Navigating directly to http://localhost:8443/#register...');
  await page.goto('http://localhost:8443/#register');
  await page.waitForTimeout(1000);

  // Take full screenshot directly on load
  await page.screenshot({
    path: path.join(artifactsDir, 'register_direct_load_couple.png'),
    fullPage: true,
  });
  console.log('Saved register_direct_load_couple.png');

  // Verify that Groom Full Name and Bride Full Name fields are in DOM and visible
  const groomField = page.locator('input[placeholder="James Wilson"]');
  const brideField = page.locator('input[placeholder="Sophie Carter"]');
  console.log('Groom field visible:', await groomField.isVisible());
  console.log('Bride field visible:', await brideField.isVisible());

  // Also click on MC tab to confirm smooth switching
  const mcTab = page.locator('button:has-text("MC / Planner")').first();
  await mcTab.click();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(artifactsDir, 'register_switched_to_mc.png'),
    fullPage: false,
  });
  console.log('Saved register_switched_to_mc.png');

  await browser.close();
  console.log('Verification done!');
}

run().catch(console.error);
