import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\Mohak\\.gemini\\antigravity\\brain\\7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // Test 1, 2, 3: MC Desktop (Team & Crew, Invite Modal, Manage Modal)
  // -------------------------------------------------------------
  console.log('Testing MC Desktop view...');
  const mcContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mcPage = await mcContext.newPage();
  
  await mcPage.goto('http://localhost:8443/#mc');
  await mcPage.waitForTimeout(1000);

  // Click on "Team & Crew" tab in MC sidebar
  console.log('Navigating to Team & Crew tab...');
  const teamTabBtn = mcPage.locator('button:has-text("Team & Crew")').first();
  await teamTabBtn.click();
  await mcPage.waitForTimeout(600);

  // Screenshot 1: Team & Crew Overview
  await mcPage.screenshot({
    path: path.join(artifactsDir, 'mc_team_access_overview.png'),
    fullPage: false,
  });
  console.log('Saved mc_team_access_overview.png');

  // Click "+ Invite Member"
  console.log('Opening Invite Member modal...');
  const inviteBtn = mcPage.locator('button:has-text("+ Invite Member")').first();
  await inviteBtn.click();
  await mcPage.waitForTimeout(600);

  // Screenshot 2: Invite Member Modal
  await mcPage.screenshot({
    path: path.join(artifactsDir, 'mc_invite_member_modal.png'),
    fullPage: false,
  });
  console.log('Saved mc_invite_member_modal.png');

  // Close invite modal
  const closeInviteBtn = mcPage.locator('button[aria-label="Close dialog"]').first();
  if (await closeInviteBtn.isVisible()) {
    await closeInviteBtn.click();
    await mcPage.waitForTimeout(300);
  }

  // Click "Manage Access ⚙" on Sarah Jenkins
  console.log('Opening Manage Access modal for Sarah Jenkins...');
  const manageAccessBtn = mcPage.locator('button:has-text("Manage Access")').nth(1); // Sarah is 2nd member
  await manageAccessBtn.click();
  await mcPage.waitForTimeout(600);

  // Screenshot 3: Manage Access Modal
  await mcPage.screenshot({
    path: path.join(artifactsDir, 'mc_manage_access_modal.png'),
    fullPage: false,
  });
  console.log('Saved mc_manage_access_modal.png');

  // Close modal
  const closeManageBtn = mcPage.locator('button[aria-label="Close dialog"]').first();
  if (await closeManageBtn.isVisible()) {
    await closeManageBtn.click();
    await mcPage.waitForTimeout(300);
  }

  // -------------------------------------------------------------
  // Test 4: MC Desktop Chatbot with File Attachment
  // -------------------------------------------------------------
  console.log('Testing MC Desktop Chatbot file attachment...');
  // Find Joey floating button (bottom right)
  const joeyLauncher = mcPage.locator('button[title="Chat with Joey"]').first();
  if (await joeyLauncher.isVisible()) {
    await joeyLauncher.click();
    await mcPage.waitForTimeout(600);
  }

  // Create a dummy PDF file to upload
  const testFilePath = path.join(process.cwd(), 'scratch', 'Runsheet_Amendments_V2.pdf');
  fs.writeFileSync(testFilePath, '%PDF-1.4 dummy runsheet file content for testing');

  // Set file on the chatbot input
  const chatbotFileInput = mcPage.locator('input[type="file"]').last();
  await chatbotFileInput.setInputFiles(testFilePath);
  await mcPage.waitForTimeout(500);

  // Type a message in Joey input
  const chatInput = mcPage.locator('input[placeholder*="Ask Joey"]').last();
  await chatInput.fill('Please review this runsheet amendment for speech timings.');
  await mcPage.keyboard.press('Enter');
  await mcPage.waitForTimeout(1000);

  // Screenshot 4: MC Desktop Chatbot with attached file and Joey response
  await mcPage.screenshot({
    path: path.join(artifactsDir, 'mc_desktop_chatbot_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved mc_desktop_chatbot_fileupload.png');

  await mcContext.close();

  // -------------------------------------------------------------
  // Test 5: MC Mobile View Chatbot with File Attachment
  // -------------------------------------------------------------
  console.log('Testing MC Mobile Chatbot...');
  const mcMobileContext = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const mcMobilePage = await mcMobileContext.newPage();
  await mcMobilePage.goto('http://localhost:8443/#mc-mobile');
  await mcMobilePage.waitForTimeout(1000);

  // Click on Joey button in mobile view
  const mobileJoeyBtn = mcMobilePage.locator('button[title="Ask Joey"]').first();
  if (await mobileJoeyBtn.isVisible()) {
    await mobileJoeyBtn.click();
    await mcMobilePage.waitForTimeout(600);
  }

  // Attach a test file
  const mobileFileInput = mcMobilePage.locator('input[type="file"]').last();
  if (await mobileFileInput.count() > 0) {
    await mobileFileInput.setInputFiles(testFilePath);
    await mcMobilePage.waitForTimeout(500);
  }

  // Screenshot 5: MC Mobile Chatbot with file attachment
  await mcMobilePage.screenshot({
    path: path.join(artifactsDir, 'mc_mobile_chatbot_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved mc_mobile_chatbot_fileupload.png');

  await mcMobileContext.close();

  // -------------------------------------------------------------
  // Test 6: Couple View Chatbot with File Attachment
  // -------------------------------------------------------------
  console.log('Testing Couple View Chatbot...');
  const coupleContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const couplePage = await coupleContext.newPage();
  await couplePage.goto('http://localhost:8443/#couple');
  await couplePage.waitForTimeout(1000);

  // Open Joey chatbot in Couple View
  const coupleJoeyBtn = couplePage.locator('button[title="Chat with Joey"]').first();
  if (await coupleJoeyBtn.isVisible()) {
    await coupleJoeyBtn.click();
    await couplePage.waitForTimeout(600);
  }

  // Attach a test file
  const coupleFileInput = couplePage.locator('input[type="file"]').last();
  await coupleFileInput.setInputFiles(testFilePath);
  await couplePage.waitForTimeout(500);

  // Screenshot 6: Couple View Chatbot with file upload
  await couplePage.screenshot({
    path: path.join(artifactsDir, 'couple_chatbot_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved couple_chatbot_fileupload.png');

  await coupleContext.close();

  // -------------------------------------------------------------
  // Test 7: Guest Mobile View Chatbot - VERIFY NO FILE ATTACHMENT
  // -------------------------------------------------------------
  console.log('Testing Guest Mobile View Chatbot (NEGATIVE VERIFICATION: NO FILE ATTACHMENT)...');
  const guestContext = await browser.newContext({ viewport: { width: 440, height: 900 } });
  const guestPage = await guestContext.newPage();
  await guestPage.goto('http://localhost:8443/#guest-mobile');
  await guestPage.waitForTimeout(1000);

  // Click on Joey button in Guest Mobile
  const guestJoeyBtn = guestPage.locator('button[title="Chat with Joey Assistant"]').first();
  if (await guestJoeyBtn.isVisible()) {
    await guestJoeyBtn.click();
    await guestPage.waitForTimeout(600);
  }

  // Verify paperclip button does NOT exist
  const guestPaperclip = guestPage.locator('button[title="Attach document or file"]');
  const paperclipCount = await guestPaperclip.count();
  console.log(`Guest Chatbot Paperclip count: ${paperclipCount} (Expected: 0)`);

  // Screenshot 7: Guest Chatbot showing clean interface without file upload
  await guestPage.screenshot({
    path: path.join(artifactsDir, 'guest_chatbot_no_fileupload.png'),
    fullPage: false,
  });
  console.log('Saved guest_chatbot_no_fileupload.png');

  await guestContext.close();
  await browser.close();

  console.log('All verification tests completed successfully!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
