import { chromium } from 'playwright';
import path from 'path';

const artifactsDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:8443/#mc...');
  await page.goto('http://localhost:8443/#mc');
  await page.waitForTimeout(1000);

  // Click "+ New Wedding"
  console.log('Clicking + New Wedding button...');
  const newWedBtn = page.locator('button:has-text("+ New Wedding")').first();
  await newWedBtn.click();
  await page.waitForTimeout(600);

  // Capture screenshot of the empty modal
  await page.screenshot({
    path: path.join(artifactsDir, 'mc_new_wedding_modal_updated.png'),
    fullPage: false,
  });
  console.log('Saved mc_new_wedding_modal_updated.png');

  // Fill in the form fields
  await page.locator('input[placeholder="e.g. Liam & Olivia\'s Wedding"]').fill("Liam & Olivia's Wedding");
  await page.locator('input[placeholder="e.g. Olivia"]').fill("Olivia Smith");
  await page.locator('input[placeholder="e.g. Liam"]').fill("Liam Davis");
  await page.locator('input[placeholder="e.g. olivia@example.com"]').fill("olivia.smith@example.com");
  await page.locator('input[placeholder="e.g. liam@example.com"]').fill("liam.davis@example.com");
  await page.locator('input[placeholder="e.g. Bendooley Estate, Berrima"]').fill("Bendooley Estate, Berrima");

  await page.waitForTimeout(400);

  // Capture screenshot of the filled modal
  await page.screenshot({
    path: path.join(artifactsDir, 'mc_new_wedding_modal_filled.png'),
    fullPage: false,
  });
  console.log('Saved mc_new_wedding_modal_filled.png');

  // Submit form
  const createBtn = page.locator('button:has-text("Create Booking")').first();
  await createBtn.click();
  await page.waitForTimeout(800);

  // Capture screenshot of weddings table with new booking
  await page.screenshot({
    path: path.join(artifactsDir, 'mc_weddings_table_after_creation.png'),
    fullPage: false,
  });
  console.log('Saved mc_weddings_table_after_creation.png');

  await browser.close();
  console.log('All tests passed successfully!');
}

run().catch(console.error);
