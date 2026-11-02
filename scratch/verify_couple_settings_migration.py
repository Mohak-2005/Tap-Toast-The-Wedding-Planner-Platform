import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

artifact_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()

    # -------------------------------------------------------------
    # 1. VERIFY SUPERADMIN PLATFORM SETTINGS IS CLEAN (REMOVED)
    # -------------------------------------------------------------
    print("Navigating to SuperAdmin Settings...")
    page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
    time.sleep(2)
    page.locator("button:has-text('Platform Settings')").click()
    time.sleep(1.5)
    page.screenshot(path=f"{artifact_dir}/verify_01_superadmin_clean.png")
    print("Saved verify_01_superadmin_clean.png")

    # -------------------------------------------------------------
    # 2. NAVIGATE TO COUPLE VIEW -> SETTINGS TAB
    # -------------------------------------------------------------
    print("Navigating to Couple Dashboard...")
    # Click 'Couple Dashboard' in top DemoBar
    page.locator("button:has-text('Couple Dashboard')").first.click()
    time.sleep(2)

    # Click 'Settings' tab in Couple navigation
    print("Clicking Settings tab in Couple View...")
    settings_tab = page.locator("button:has-text('Settings')")
    settings_tab.first.click()
    time.sleep(1.5)

    # Scroll down to the Bespoke Invitation Cards section
    studio_section = page.locator("text=Bespoke Invitation Cards & 3D Unboxing")
    if studio_section.count() > 0:
        studio_section.first.scroll_into_view_if_needed()
        time.sleep(1)

    page.screenshot(path=f"{artifact_dir}/verify_02_couple_settings_coming_soon.png")
    print("Saved verify_02_couple_settings_coming_soon.png")

    # -------------------------------------------------------------
    # 3. CLICK 'PREVIEW STUDIO' TO OPEN WHITEBOARD STUDIO
    # -------------------------------------------------------------
    print("Clicking Preview Studio on first theme card...")
    preview_btn = page.locator("button:has-text('Preview Studio')").first
    if preview_btn.count() > 0:
        preview_btn.click()
        time.sleep(2)
        page.screenshot(path=f"{artifact_dir}/verify_03_couple_studio_modal.png")
        print("Saved verify_03_couple_studio_modal.png")

        # Test Back to Settings button
        print("Clicking Back to Settings...")
        back_btn = page.locator("header button:has-text('Back to Settings')")
        if back_btn.count() > 0:
            back_btn.first.click()
            time.sleep(1)
            page.screenshot(path=f"{artifact_dir}/verify_04_back_to_couple_settings.png")
            print("Saved verify_04_back_to_couple_settings.png")

    browser.close()
    print("Verification completed successfully!")
