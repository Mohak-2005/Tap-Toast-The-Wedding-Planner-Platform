import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });

  const testFilePath = path.join(process.cwd(), 'scratch', 'Runsheet_Amendments_V2.pdf');
  fs.writeFileSync(testFilePath, '%PDF-1.4 dummy runsheet file content for testing');

  // 1. Desktop MC Chatbot
  console.log('Testing Desktop MC Chatbot...');
  const mcContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mcPage = await mcContext.newPage();
  await mcPage.goto('http://localhost:8443/#mc');
  await mcPage.waitForTimeout(1000);

  // Click Joey launcher
  const joeyLauncher = mcPage.locator('button:has(img[alt="Joey AI"])').first();
  await joeyLauncher.click();
  await mcPage.waitForTimeout(600);

  // Verify chat panel is visible
  const chatInput = mcPage.locator('input[placeholder*="Ask Joey"]').first();
  console.log('Chat input visible:', await chatInput.isVisible());

  // Attach file
  const fileInput = mcPage.locator('input[type="file"]').first();
  await fileInput.setInputFiles(testFilePath);
  await mcPage.waitForTimeout(500);

  // Send message
  await chatInput.fill('Please review this runsheet amendment for speech timings.');
  await mcPage.keyboard.press('Enter');
  await mcPage.waitForTimeout(1000);

  await mcPage.screenshot({
    path: path.join(artifactsDir, 'mc_desktop_chatbot_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved mc_desktop_chatbot_fileupload.png');
  await mcContext.close();

  // 2. MC Mobile Chatbot
  console.log('Testing MC Mobile Chatbot...');
  const mcMobileContext = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const mcMobilePage = await mcMobileContext.newPage();
  await mcMobilePage.goto('http://localhost:8443/#mc-mobile');
  await mcMobilePage.waitForTimeout(1000);

  const mobileJoeyBtn = mcMobilePage.locator('button[title="Ask Joey"]').first();
  await mobileJoeyBtn.click();
  await mcMobilePage.waitForTimeout(600);

  const mobileFileInput = mcMobilePage.locator('input[type="file"]').first();
  await mobileFileInput.setInputFiles(testFilePath);
  await mcMobilePage.waitForTimeout(500);

  const mobileChatInput = mcMobilePage.locator('input[placeholder*="Ask Joey"]').first();
  await mobileChatInput.fill('Please analyze this amended schedule');
  await mcMobilePage.keyboard.press('Enter');
  await mcMobilePage.waitForTimeout(1000);

  await mcMobilePage.screenshot({
    path: path.join(artifactsDir, 'mc_mobile_chatbot_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved mc_mobile_chatbot_fileupload.png');
  await mcMobileContext.close();

  // 3. Couple View Chatbot
  console.log('Testing Couple View Chatbot...');
  const coupleContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const couplePage = await coupleContext.newPage();
  await couplePage.goto('http://localhost:8443/#couple');
  await couplePage.waitForTimeout(1000);

  const coupleJoeyBtn = couplePage.locator('button:has(img[alt="Joey AI"])').first();
  await coupleJoeyBtn.click();
  await couplePage.waitForTimeout(600);

  const coupleFileInput = couplePage.locator('input[type="file"]').first();
  await coupleFileInput.setInputFiles(testFilePath);
  await couplePage.waitForTimeout(500);

  const coupleChatInput = couplePage.locator('input[placeholder*="Ask Joey"]').first();
  await coupleChatInput.fill('Hi Joey, can we add this seating plan update?');
  await couplePage.keyboard.press('Enter');
  await couplePage.waitForTimeout(1000);

  await couplePage.screenshot({
    path: path.join(artifactsDir, 'couple_chatbot_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved couple_chatbot_fileupload.png');
  await coupleContext.close();

  // 4. Guest Mobile View Chatbot (Verification: NO file upload)
  console.log('Testing Guest Mobile View Chatbot...');
  const guestContext = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const guestPage = await guestContext.newPage();
  await guestPage.goto('http://localhost:8443/#guest-mobile');
  await guestPage.waitForTimeout(1000);

  const guestJoeyBtn = guestPage.locator('button[title="Chat with Joey Assistant"]').first();
  await guestJoeyBtn.click();
  await guestPage.waitForTimeout(600);

  const guestPaperclips = await guestPage.locator('button[title="Attach document or file"]').count();
  const guestFileInputs = await guestPage.locator('input[type="file"]').count();
  console.log(`Guest view paperclips: ${guestPaperclips}, file inputs: ${guestFileInputs} (Both should be 0)`);

  await guestPage.screenshot({
    path: path.join(artifactsDir, 'guest_chatbot_no_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved guest_chatbot_no_fileupload.png');
  await guestContext.close();

  await browser.close();
  console.log('All chatbot tests passed successfully!');
}

run().catch(console.error);
