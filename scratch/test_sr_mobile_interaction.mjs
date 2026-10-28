import { chromium } from 'playwright';

async function testInteractions() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Test 1: Quick fill and login from S/R Mobile
  await page.goto('http://localhost:8443/#sr-mobile');
  await page.waitForTimeout(1000);
  
  // Click on Sophie Bell demo account
  const sophieCard = page.locator('div:has-text("Sophie Bell (Bride)")').last();
  await sophieCard.click();
  await page.waitForTimeout(500);

  // Submit sign in
  await page.locator('button:has-text("Sign In →")').first().click();
  await page.waitForTimeout(1000);

  // Should navigate to Couple Dashboard
  console.log('Current URL after Sign In:', page.url());
  if (page.url().includes('#couple')) {
    console.log('✓ Successfully signed in and navigated to #couple');
  } else {
    console.error('Failed to navigate to #couple');
  }

  await browser.close();
}

testInteractions().catch(err => {
  console.error(err);
  process.exit(1);
});
