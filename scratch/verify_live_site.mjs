import { chromium } from 'playwright';
import path from 'path';

const artifactsDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Opening live GitHub Pages URL at #mc...');
  await page.goto('https://mohak-2005.github.io/Tap-Toast-The-Wedding-Planner-Platform/#mc');
  await page.waitForTimeout(2000);

  const newWedBtn = page.locator('button:has-text("+ New Wedding")').first();
  await newWedBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(artifactsDir, 'live_gh_pages_new_wedding_modal.png'),
    fullPage: false,
  });
  console.log('Saved live_gh_pages_new_wedding_modal.png');

  await browser.close();
}

run().catch(console.error);
