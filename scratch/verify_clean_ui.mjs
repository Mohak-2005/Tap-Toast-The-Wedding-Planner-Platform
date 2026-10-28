import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:8443/#superadmin...');
  await page.goto('http://localhost:8443/#superadmin', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Plans & Billing tab
  console.log('Clicking Plans & Billing tab in sidebar...');
  const sidebarButtons = await page.$$('aside button');
  for (const btn of sidebarButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Plans & Billing')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 1. Capture clean top overview
  console.log('Capturing clean billing overview...');
  await page.screenshot({
    path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/superadmin_clean_billing_overview.png',
    fullPage: false
  });

  // 2. Click "Open Xero Ledger" or "Open Xero" to capture the clean modal
  console.log('Clicking Open Xero...');
  const openXeroBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && (b.textContent.includes('Open Xero Ledger') || b.textContent.includes('Open Xero')));
  });
  if (openXeroBtn) {
    await openXeroBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/superadmin_clean_xero_modal.png',
      fullPage: false
    });

    // Close modal
    const closeBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.trim() === 'Close');
    });
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // 3. Scroll to MC transactions and capture
  console.log('Capturing MC transactions ledger...');
  await page.evaluate(() => {
    const el = document.getElementById('mc_transactions_ledger_section');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b/superadmin_clean_mc_transactions.png',
    fullPage: false
  });

  await browser.close();
  console.log('All clean verification screenshots captured successfully!');
})();
