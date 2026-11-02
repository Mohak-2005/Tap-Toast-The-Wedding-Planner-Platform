import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    # Increase height to 1050 to comfortably capture the 3 cards + button
    context = browser.new_context(viewport={'width': 1400, 'height': 1100})
    page = context.new_page()

    page.goto('http://127.0.0.1:5173/', wait_until='networkidle')
    page.wait_for_timeout(1000)

    # Navigate to Couple Dashboard
    page.locator("button:has-text('Couple Dashboard')").first.click()
    page.wait_for_timeout(1200)

    # Navigate to Settings
    page.locator("button:has-text('Settings'), a:has-text('Settings')").first.click()
    page.wait_for_timeout(1200)

    # Scroll directly to the Bespoke Invitation container
    studio_container = page.locator("div.bg-white:has-text('Bespoke Invitation Cards & 3D Unboxing')")
    studio_container.scroll_into_view_if_needed()
    page.wait_for_timeout(800)

    # 1. Capture initial state with 3 cards + Show More Themes button
    studio_container.screenshot(path=os.path.join(artifacts_dir, "req2_initial_3_themes_clean.png"))
    print("Captured req2_initial_3_themes_clean.png")

    # 2. Click Show More Themes button
    page.locator("button:has-text('Show More Themes')").click()
    page.wait_for_timeout(800)

    # 3. Capture expanded state with all 5 cards + Blank card + Show Less Themes button
    studio_container.screenshot(path=os.path.join(artifacts_dir, "req2_expanded_all_themes_clean.png"))
    print("Captured req2_expanded_all_themes_clean.png")

    browser.close()
