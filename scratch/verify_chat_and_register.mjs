import { chromium } from 'playwright';
import path from 'path';

const artifactsDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // Test 1: Couple Chatbot Reordered Input Bar (Text box -> Attach -> Arrow)
  // -------------------------------------------------------------
  console.log('Testing Couple Chatbot reordered input bar...');
  const coupleContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const couplePage = await coupleContext.newPage();
  await couplePage.goto('http://localhost:8443/#couple');
  await couplePage.waitForTimeout(1000);

  // Open Joey chatbot
  const joeyBtn = couplePage.locator('button:has(img[alt="Joey AI"])').first();
  await joeyBtn.click();
  await couplePage.waitForTimeout(600);

  // Take full screenshot
  await couplePage.screenshot({
    path: path.join(artifactsDir, 'chat_input_reordered_layout.png'),
    fullPage: false,
  });
  console.log('Saved chat_input_reordered_layout.png');

  // Also take a close-up of the chat panel form
  const chatForm = couplePage.locator('form:has(input[placeholder*="Ask Joey"])').first();
  if (await chatForm.isVisible()) {
    await chatForm.screenshot({
      path: path.join(artifactsDir, 'chat_input_bar_closeup.png'),
    });
    console.log('Saved chat_input_bar_closeup.png');
  }

  await coupleContext.close();

  // -------------------------------------------------------------
  // Test 2: MC Mobile Chatbot Reordered Input Bar
  // -------------------------------------------------------------
  console.log('Testing MC Mobile Chatbot reordered input bar...');
  const mobileContext = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:8443/#mc-mobile');
  await mobilePage.waitForTimeout(1000);

  const mobileJoeyBtn = mobilePage.locator('button[title="Ask Joey"]').first();
  await mobileJoeyBtn.click();
  await mobilePage.waitForTimeout(600);

  await mobilePage.screenshot({
    path: path.join(artifactsDir, 'mc_mobile_chat_reordered.png'),
    fullPage: false,
  });
  console.log('Saved mc_mobile_chat_reordered.png');

  await mobileContext.close();

  // -------------------------------------------------------------
  // Test 3: Register Page - MC View (Matching Image 2)
  // -------------------------------------------------------------
  console.log('Testing Register Page - MC Mode...');
  const regContext = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
  const regPage = await regContext.newPage();
  await regPage.goto('http://localhost:8443/#register');
  await regPage.waitForTimeout(1000);

  // Click "I'm an MC / Planner"
  const mcTabBtn = regPage.locator('button:has-text("I\'m an MC / Planner")').first();
  await mcTabBtn.click();
  await regPage.waitForTimeout(400);

  await regPage.screenshot({
    path: path.join(artifactsDir, 'register_mc_normal.png'),
    fullPage: false,
  });
  console.log('Saved register_mc_normal.png');

  // -------------------------------------------------------------
  // Test 4: Register Page - Couple View (Enhanced with Groom, Bride, Wedding info)
  // -------------------------------------------------------------
  console.log('Testing Register Page - Couple Mode...');
  const coupleTabBtn = regPage.locator('button:has-text("I\'m a Couple")').first();
  await coupleTabBtn.click();
  await regPage.waitForTimeout(500);

  // Fill in some sample data to show active styling and match indicators
  await regPage.locator('input[placeholder="James Wilson"]').fill('James Wilson');
  await regPage.locator('input[placeholder="james.wilson@example.com"]').fill('james.wilson@luxuryweddings.demo');
  await regPage.locator('input[placeholder="0412 345 678"]').fill('0412345678');

  await regPage.locator('input[placeholder="Sophie Carter"]').fill('Sophie Carter');
  await regPage.locator('input[placeholder="sophie.carter@example.com"]').fill('sophie.carter@luxuryweddings.demo');
  await regPage.locator('input[placeholder="0423 456 789"]').fill('0423456789');

  // Set password and show strength indicator
  const pwdInput = regPage.locator('input[placeholder="Create a password"]').last();
  await pwdInput.fill('Wedding2026!');
  const confirmInput = regPage.locator('input[placeholder="Confirm password"]').last();
  await confirmInput.fill('Wedding2026!');

  await regPage.waitForTimeout(500);

  await regPage.screenshot({
    path: path.join(artifactsDir, 'register_couple_enhanced.png'),
    fullPage: true,
  });
  console.log('Saved register_couple_enhanced.png');

  await regContext.close();
  await browser.close();

  console.log('All verification screenshots captured successfully!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
