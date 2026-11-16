const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to MC Pro console...');
  await page.goto('http://127.0.0.1:5173/#mc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Opening Cheers AI chatbot in MC Run Sheet...');
  const mcCheersBtn = await page.$('button:has-text("Cheers AI")');
  if (mcCheersBtn) {
    await mcCheersBtn.click();
    await page.waitForTimeout(1000);
    console.log('Capturing 74_mc_runsheet_cheers_chatbot.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '74_mc_runsheet_cheers_chatbot.png') });
  }

  await browser.close();
  console.log('✓ Captured MC Cheers AI chatbot screenshot successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
