import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import shutil
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto("http://127.0.0.1:5173/")
    page.wait_for_load_state("networkidle")
    
    # 1. Switch to Couple Dashboard -> Settings
    print("Navigating to Couple Dashboard -> Settings...")
    page.locator("button:has-text('Couple Dashboard')").first.click()
    page.wait_for_timeout(800)
    page.locator("button:has-text('Settings')").first.click()
    page.wait_for_timeout(1000)
    
    # Scroll to Bespoke Invitation Cards section
    bespoke_section = page.locator("h3:has-text('Bespoke Invitation Cards')").first
    if bespoke_section.is_visible():
        bespoke_section.scroll_into_view_if_needed()
        page.wait_for_timeout(600)
        
    path_settings = "verify_req1_exact_5_card_designs_in_settings.png"
    page.screenshot(path=path_settings)
    shutil.copy(path_settings, os.path.join(ARTIFACT_DIR, path_settings))
    print(f"✓ Captured {path_settings}")
    
    # 2. Click Preview Studio on Sydney Harbor & Fairy Lights (Card index 3)
    print("Clicking Preview Studio on Sydney Harbor & Fairy Lights (Card index 3)...")
    page.locator("button:has-text('Preview Studio')").nth(3).click()
    page.wait_for_timeout(1500)
    
    path_coastal_studio = "verify_req1_coastal_harbor_exact_demo_design.png"
    page.screenshot(path=path_coastal_studio)
    shutil.copy(path_coastal_studio, os.path.join(ARTIFACT_DIR, path_coastal_studio))
    print(f"✓ Captured {path_coastal_studio}")
    
    # 3. Capture Left Card: Compact Custom Color button & Removed selected colors boxes
    path_left_card = "verify_req2_compact_color_btn_and_removed_boxes.png"
    page.screenshot(path=path_left_card)
    shutil.copy(path_left_card, os.path.join(ARTIFACT_DIR, path_left_card))
    print(f"✓ Captured {path_left_card}")
    
    # 4. Open Custom Color on Paper to verify sleek compact picker
    compact_color_btn = page.locator("button:has-text('Custom Color')").first
    if compact_color_btn.is_visible():
        compact_color_btn.click()
        page.wait_for_timeout(600)
        path_spectrum_clean = "verify_req2_custom_color_opened_clean.png"
        page.screenshot(path=path_spectrum_clean)
        shutil.copy(path_spectrum_clean, os.path.join(ARTIFACT_DIR, path_spectrum_clean))
        print(f"✓ Captured {path_spectrum_clean}")
        
    browser.close()
    print("All verification steps completed!")
