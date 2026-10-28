import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8443';
const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Guest List: All tab (Category Filter dropdown visible) ---');
  await page.goto(`${BASE_URL}/#couple`);
  await page.waitForTimeout(1000);
  const guestListTab = page.locator('button:has-text("Guest List")').first();
  await guestListTab.click();
  await page.waitForTimeout(800);

  // Check that All button text does not contain '$'
  const allBtnText = await page.locator('button:has-text("All (")').first().innerText();
  console.log('All button text:', allBtnText);

  // Verify dropdown is visible
  const categoryFilterDropdown = page.locator('select:has-text("All Categories")');
  console.log('Dropdown visible on All tab:', await categoryFilterDropdown.isVisible());

  await page.screenshot({ path: `${ARTIFACT_DIR}/guest_list_all_tab.png`, fullPage: false });
  console.log('Captured guest_list_all_tab.png');

  console.log('--- 2. Testing Guest List: Needs Category tab (Category Filter dropdown hidden) ---');
  const needsCategoryBtn = page.locator('button:has-text("Needs Category")').first();
  await needsCategoryBtn.click();
  await page.waitForTimeout(800);

  const needsCatBtnText = await page.locator('button:has-text("Needs Category")').first().innerText();
  console.log('Needs Category button text:', needsCatBtnText);

  const dropdownVisibleOnNeedsCategory = await categoryFilterDropdown.isVisible();
  console.log('Dropdown visible on Needs Category tab:', dropdownVisibleOnNeedsCategory);

  await page.screenshot({ path: `${ARTIFACT_DIR}/guest_list_needs_category_tab.png`, fullPage: false });
  console.log('Captured guest_list_needs_category_tab.png');

  await browser.close();
  console.log('All verification tasks finished!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
