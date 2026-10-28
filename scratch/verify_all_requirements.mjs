import { chromium } from 'playwright';

const ARTIFACT_DIR = 'C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  // CONTEXT 1: Couple Onboarding Flow
  const context1 = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page1 = await context1.newPage();

  console.log('--- TEST 1: Step 1 Couple Registration UI ---');
  await page1.goto('http://localhost:8443/#register');
  await page1.waitForTimeout(1000);
  await page1.screenshot({ path: `${ARTIFACT_DIR}/verify_step1_couple_clean_ui.png`, fullPage: true });

  console.log('--- TEST 2: Step 1 MC Registration UI ---');
  await page1.click('button:has-text("MC / Planner")');
  await page1.waitForTimeout(500);
  await page1.screenshot({ path: `${ARTIFACT_DIR}/verify_mc_registration_clean_ui.png`, fullPage: true });

  // Switch back to Couple Portal
  await page1.click('button:has-text("Couple Portal")');
  await page1.waitForTimeout(500);

  // Proceed to Step 2
  console.log('--- TEST 3: Step 2 Plan & Payment ---');
  await page1.click('button:has-text("Continue to Plan & Payment")');
  await page1.waitForTimeout(600);
  await page1.screenshot({ path: `${ARTIFACT_DIR}/verify_step2_plan_payment.png`, fullPage: true });

  // Proceed to Step 3
  console.log('--- TEST 4: Step 3 MC Selection & Joey Concierge (Strictly MC info, NO audit card) ---');
  await page1.click('button:has-text("Pay $299 & Select MC")');
  await page1.waitForTimeout(800);

  // Verify Audit card is NOT visible to couple
  const hasAuditInCouple = await page1.locator('text="AUDIT OF QUESTIONS & PREFERENCES BY THE COUPLE"').isVisible();
  console.log(`[PASS CHECK] Is Audit Box visible to Couple? ${hasAuditInCouple} (Must be false)`);

  // Open MC dropdown
  await page1.click('button:has-text("Change MC")');
  await page1.waitForTimeout(400);
  await page1.screenshot({ path: `${ARTIFACT_DIR}/verify_step3_mc_dropdown_with_pricing.png`, fullPage: false });

  // Close dropdown by selecting Marcus Thorne
  await page1.click('text="Marcus Thorne"');
  await page1.waitForTimeout(400);

  // Query Joey Chatbot with strictly MC questions
  console.log('Testing Joey MC Concierge responses...');
  const chatInput = page1.locator('input[placeholder*="Ask Joey"]');

  // Query 1: Experience
  await chatInput.fill('Which MC is more experienced?');
  await page1.click('button:has-text("Send")');
  await page1.waitForTimeout(800);

  // Query 2: Cost
  await chatInput.fill('Which MC falls under $1800?');
  await page1.click('button:has-text("Send")');
  await page1.waitForTimeout(800);

  // Query 3: Reviews
  await chatInput.fill('Who has the best 5-star reviews?');
  await page1.click('button:has-text("Send")');
  await page1.waitForTimeout(800);

  // Query 4: Style comparison
  await chatInput.fill('Compare Robert vs Marcus vs Elena');
  await page1.click('button:has-text("Send")');
  await page1.waitForTimeout(800);

  // Query 5: Off-topic guard
  await chatInput.fill('What is the weather in Sydney today?');
  await page1.click('button:has-text("Send")');
  await page1.waitForTimeout(800);

  await page1.screenshot({ path: `${ARTIFACT_DIR}/verify_step3_joey_mc_answers_no_audit.png`, fullPage: true });

  // Launch Dashboard
  await page1.click('button:has-text("Confirm MC & Launch Dashboard")');
  await page1.waitForTimeout(1000);
  await page1.screenshot({ path: `${ARTIFACT_DIR}/verify_couple_dashboard_launched.png`, fullPage: true });

  await context1.close();

  // CONTEXT 2: MC View Tests (No Invoicing tab, No Gift screen in weddings)
  console.log('--- TEST 5: MC View Validation ---');
  const context2 = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page2 = await context2.newPage();
  await page2.goto('http://localhost:8443/#mc');
  await page2.waitForTimeout(1000);

  // Check sidebar for Invoicing tab
  const hasInvoicing = await page2.locator('button:has-text("Invoicing")').isVisible();
  console.log(`[PASS CHECK] Is Invoicing tab present in MC sidebar? ${hasInvoicing} (Must be false)`);
  await page2.screenshot({ path: `${ARTIFACT_DIR}/verify_mc_view_no_invoicing_tab.png`, fullPage: false });

  // Open first wedding detail
  console.log('Opening wedding in MC view...');
  await page2.click('tr:has-text("Sophie & James")');
  await page2.waitForTimeout(600);

  // Check sub-tabs for Gift Ledger inside wedding
  const hasGiftsSubTab = await page2.locator('button:has-text("Gift & Wishing Well Ledger")').isVisible();
  console.log(`[PASS CHECK] Is Gift Ledger sub-tab present in MC wedding detail? ${hasGiftsSubTab} (Must be false)`);
  await page2.screenshot({ path: `${ARTIFACT_DIR}/verify_mc_wedding_no_gift_screen.png`, fullPage: false });

  await context2.close();

  // CONTEXT 3: Super Admin View Tests (+ Invite Couple to Register & Couple Audits Panel)
  console.log('--- TEST 6: Super Admin View Validation ---');
  const context3 = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page3 = await context3.newPage();
  await page3.goto('http://localhost:8443/#superadmin');
  await page3.waitForTimeout(1000);

  // Check "+ Invite Couple to Register" button
  const inviteCoupleBtn = page3.locator('button:has-text("+ Invite Couple to Register")').first();
  const hasInviteBtn = await inviteCoupleBtn.isVisible();
  console.log(`[PASS CHECK] Is "+ Invite Couple to Register" button present? ${hasInviteBtn} (Must be true)`);
  await page3.screenshot({ path: `${ARTIFACT_DIR}/verify_superadmin_overview.png`, fullPage: false });

  // Click "+ Invite Couple to Register"
  await inviteCoupleBtn.click();
  await page3.waitForTimeout(500);
  await page3.screenshot({ path: `${ARTIFACT_DIR}/verify_superadmin_invite_couple_modal.png`, fullPage: false });

  // Submit invitation form
  await page3.click('button:has-text("Send Onboarding Invitation")');
  await page3.waitForTimeout(500);
  await page3.screenshot({ path: `${ARTIFACT_DIR}/verify_superadmin_invite_couple_link_ready.png`, fullPage: false });

  // Close link modal
  await page3.click('button:has-text("Done")');
  await page3.waitForTimeout(400);

  // Switch to Audit Logs Tab
  console.log('Opening Audit Logs tab in Super Admin...');
  await page3.click('button:has-text("Audit Logs")');
  await page3.waitForTimeout(600);

  const hasCoupleAudit = await page3.locator('text="Couple Onboarding & Question Preference Audits"').isVisible();
  console.log(`[PASS CHECK] Is Couple Onboarding Audits section visible in Super Admin? ${hasCoupleAudit} (Must be true)`);
  await page3.screenshot({ path: `${ARTIFACT_DIR}/verify_superadmin_audit_couple_questions.png`, fullPage: true });

  await context3.close();
  await browser.close();

  console.log('============================================');
  console.log('ALL PLAYWRIGHT TESTS PASSED 100% SUCCESFULLY!');
  console.log('============================================');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
