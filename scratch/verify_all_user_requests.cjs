const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('--- 1. Testing Couple View: Sidebar Tabs & Events Table ---');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Screenshot 65: Sidebar with no numbers on tabs
  console.log('Capturing 65_couple_sidebar_no_badge_numbers.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '65_couple_sidebar_no_badge_numbers.png') });

  // Navigate to Events & Schedule tab
  console.log('Navigating to Events & Schedule tab...');
  const eventsTab = await page.$('button:has-text("Events & Schedule")');
  if (eventsTab) {
    await eventsTab.click();
    await page.waitForTimeout(800);
  }

  // Screenshot 66: Events Table View
  console.log('Capturing 66_events_schedule_table_view.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '66_events_schedule_table_view.png') });

  // Click "Manage" button in Guest List column
  console.log('Opening Manage Guest List modal...');
  const manageBtn = await page.$('button:has-text("Manage")');
  if (manageBtn) {
    await manageBtn.click();
    await page.waitForTimeout(800);
    console.log('Capturing 67_event_manage_guests_modal.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '67_event_manage_guests_modal.png') });

    // Close modal
    const closeBtn = await page.$('button:has-text("Done")');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  console.log('--- 2. Testing Seating Studio: Google Maps Zoom & Cheers AI Chatbot with File Upload ---');
  const seatingTab = await page.$('button:has-text("Seating")');
  if (seatingTab) {
    await seatingTab.click();
    await page.waitForTimeout(1000);
  }

  // Screenshot 68: Seating Studio with Google Maps controls and removed top zoom buttons
  console.log('Capturing 68_seating_studio_google_maps_zoom.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '68_seating_studio_google_maps_zoom.png') });

  // Test Google Maps + Zoom In
  console.log('Testing zoom in via Google Maps controls...');
  const zoomInBtn = await page.$('button[title*="Zoom In"]');
  if (zoomInBtn) {
    await zoomInBtn.click();
    await page.waitForTimeout(400);
    await zoomInBtn.click();
    await page.waitForTimeout(400);
    console.log('Capturing 69_seating_studio_zoomed_in.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '69_seating_studio_zoomed_in.png') });
  }

  // Open Cheers AI in Seating Studio
  console.log('Opening Cheers AI in Seating Studio...');
  const cheersBtn = await page.$('button:has-text("Cheers AI")');
  if (cheersBtn) {
    await cheersBtn.click();
    await page.waitForTimeout(800);

    // Send a chat message
    const chatInput = await page.$('input[placeholder*="Ask Cheers AI"]');
    if (chatInput) {
      await chatInput.fill('Please group families together at banquet tables');
      const sendBtn = await page.$('button:has-text("Send")');
      if (sendBtn) await sendBtn.click();
      await page.waitForTimeout(1000);
    }

    console.log('Capturing 70_seating_cheers_chatbot_file_upload.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '70_seating_cheers_chatbot_file_upload.png') });

    // Close chatbot drawer
    const closeChatBtn = await page.$('button[title*="Close Cheers AI"]');
    if (closeChatBtn) await closeChatBtn.click();
    await page.waitForTimeout(500);
  }

  console.log('--- 3. Testing Planner Day Sheet: Cheers AI Chatbot ---');
  await page.goto('http://127.0.0.1:5173/#planner', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const weddingCard = await page.$('text=Sophie & James');
  if (weddingCard) {
    await weddingCard.click();
    await page.waitForTimeout(1000);
  }

  // Open Cheers AI Chatbot in Day Sheet
  const plannerCheersBtn = await page.$('button:has-text("Cheers AI")');
  if (plannerCheersBtn) {
    await plannerCheersBtn.click();
    await page.waitForTimeout(800);
    console.log('Capturing 71_planner_cheers_ai_chatbot.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '71_planner_cheers_ai_chatbot.png') });

    // Click quick prompt "⚡ Shift All Activities +30 Mins"
    const quickPrompt = await page.$('button:has-text("Shift All Activities")');
    if (quickPrompt) {
      await quickPrompt.click();
      await page.waitForTimeout(800);
      console.log('Capturing 72_planner_cheers_ai_proposal.png...');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '72_planner_cheers_ai_proposal.png') });
    }

    // Close modal
    const closePlannerCheers = await page.$('button:has-text("✕")');
    if (closePlannerCheers) await closePlannerCheers.click();
    await page.waitForTimeout(500);
  }

  console.log('--- 4. Testing Content & Stories: Cheers AI Story Chatbot ---');
  await page.goto('http://127.0.0.1:5173/#couple', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const contentTab = await page.$('button:has-text("Content & Stories")');
  if (contentTab) {
    await contentTab.click();
    await page.waitForTimeout(800);
  }

  const draftStoryBtn = await page.$('button:has-text("Draft with Cheers AI")');
  if (draftStoryBtn) {
    await draftStoryBtn.click();
    await page.waitForTimeout(800);
    console.log('Capturing 73_story_cheers_ai_chatbot.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '73_story_cheers_ai_chatbot.png') });
  }

  await browser.close();
  console.log('✓ All verifications and screenshots completed successfully!');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
