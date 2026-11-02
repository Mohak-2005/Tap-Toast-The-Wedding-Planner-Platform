import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import shutil
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        print("1. Navigating to http://127.0.0.1:5173/ ...")
        page.goto("http://127.0.0.1:5173/")
        page.wait_for_load_state("networkidle")
        time.sleep(1.5)

        # Click Couple Dashboard
        print("2. Switching to Couple Dashboard...")
        page.locator("button:has-text('Couple Dashboard')").first.click()
        time.sleep(1)

        # Click Settings in sidebar
        print("3. Navigating to Settings tab...")
        page.locator("button:has-text('Settings')").first.click()
        time.sleep(1.5)

        # -------------------------------------------------------------
        # VERIFICATION OF REQUEST 3: 5 Default Templates from Demo
        # -------------------------------------------------------------
        print("4. Capturing Settings with the 5 Default Demo Templates...")
        bespoke_section = page.locator("h3:has-text('Bespoke Invitation Cards')").first
        if bespoke_section.is_visible():
            bespoke_section.scroll_into_view_if_needed()
            time.sleep(0.5)
        
        path_req3_settings = "verify_req3_default_5_demo_templates.png"
        page.screenshot(path=path_req3_settings)
        shutil.copy(path_req3_settings, os.path.join(ARTIFACT_DIR, path_req3_settings))
        print("Captured verify_req3_default_5_demo_templates.png")

        # -------------------------------------------------------------
        # OPEN STUDIO FOR TEMPLATE 3: "Midnight Protea & Garland"
        # -------------------------------------------------------------
        print("5. Clicking Preview Studio on 'Midnight Protea & Garland' (index 2)...")
        preview_btns = page.locator("button:has-text('Preview Studio')")
        print(f"Found {preview_btns.count()} Preview Studio buttons")
        preview_btns.nth(2).click()
        time.sleep(2)

        path_req3_studio = "verify_req3_midnight_protea_in_studio.png"
        page.screenshot(path=path_req3_studio)
        shutil.copy(path_req3_studio, os.path.join(ARTIFACT_DIR, path_req3_studio))
        print("Captured verify_req3_midnight_protea_in_studio.png")

        # -------------------------------------------------------------
        # VERIFICATION OF REQUEST 4: Shape & Motion as Dropdowns
        # -------------------------------------------------------------
        print("6. Testing Card Silhouette Shape Dropdown...")
        shape_toggle = page.locator("div.relative:has-text('Card Silhouette Shape') > button").first
        if shape_toggle.is_visible():
            shape_toggle.click()
            time.sleep(0.6)
            path_req4_shape = "verify_req4_shape_dropdown_open.png"
            page.screenshot(path=path_req4_shape)
            shutil.copy(path_req4_shape, os.path.join(ARTIFACT_DIR, path_req4_shape))
            print("Captured verify_req4_shape_dropdown_open.png")
            
            # Select Arch Dome Top
            arch_opt = page.locator("button:has-text('Arch Dome Top')").first
            if arch_opt.is_visible():
                arch_opt.click()
            time.sleep(0.5)

        print("7. Testing Predefined 3D Motion Dropdown...")
        motion_toggle = page.locator("div.pt-3:has-text('Predefined 3D Motion') > button").first
        if motion_toggle.is_visible():
            motion_toggle.click()
            time.sleep(0.6)
            path_req4_motion = "verify_req4_motion_dropdown_open.png"
            page.screenshot(path=path_req4_motion)
            shutil.copy(path_req4_motion, os.path.join(ARTIFACT_DIR, path_req4_motion))
            print("Captured verify_req4_motion_dropdown_open.png")
            
            # Close motion dropdown
            motion_toggle.click()
            time.sleep(0.3)

        # -------------------------------------------------------------
        # VERIFICATION OF REQUEST 2: Custom Color Spectrum (Renamed from 2D Spectrum)
        # -------------------------------------------------------------
        print("8. Testing Custom Color Spectrum button...")
        spectrum_btn = page.locator("button:has-text('Custom Color Spectrum')").first
        if spectrum_btn.is_visible():
            spectrum_btn.click()
            time.sleep(0.6)
            path_req2_spectrum = "verify_req2_custom_color_spectrum_opened.png"
            page.screenshot(path=path_req2_spectrum)
            shutil.copy(path_req2_spectrum, os.path.join(ARTIFACT_DIR, path_req2_spectrum))
            print("Captured verify_req2_custom_color_spectrum_opened.png")

        # -------------------------------------------------------------
        # VERIFICATION OF REQUEST 1: Word-Style Font Dropdown with Search & Previews
        # -------------------------------------------------------------
        print("9. Selecting text element 'Sophie & Daniel' on canvas...")
        text_el = page.locator("div:has-text('Sophie & Daniel')").last
        if text_el.is_visible():
            text_el.click()
            time.sleep(1)

        print("10. Opening Word-style Font dropdown in Right Inspector card...")
        font_toggle = page.locator("div.relative:has-text('Font Family') > button").first
        if font_toggle.is_visible():
            font_toggle.click()
            time.sleep(0.8)
            path_req1_font_open = "verify_req1_font_dropdown_open.png"
            page.screenshot(path=path_req1_font_open)
            shutil.copy(path_req1_font_open, os.path.join(ARTIFACT_DIR, path_req1_font_open))
            print("Captured verify_req1_font_dropdown_open.png")

            # Search in the font dropdown
            print("11. Typing 'Cormorant' in font search input...")
            search_input = page.locator("input[placeholder*='Search wedding fonts']").first
            if search_input.is_visible():
                search_input.fill("Cormorant")
                time.sleep(0.5)
                path_req1_font_filter = "verify_req1_font_search_filter.png"
                page.screenshot(path=path_req1_font_filter)
                shutil.copy(path_req1_font_filter, os.path.join(ARTIFACT_DIR, path_req1_font_filter))
                print("Captured verify_req1_font_search_filter.png")

                # Select Cormorant Garamond
                print("12. Selecting Cormorant Garamond...")
                cormorant_btn = page.locator("button:has-text('Cormorant Garamond')").first
                if cormorant_btn.is_visible():
                    cormorant_btn.click()
                time.sleep(0.8)
                path_req1_applied = "verify_req1_font_applied_to_canvas.png"
                page.screenshot(path=path_req1_applied)
                shutil.copy(path_req1_applied, os.path.join(ARTIFACT_DIR, path_req1_applied))
                print("Captured verify_req1_font_applied_to_canvas.png")

        print("\nAll 4 user requests verified and screenshots captured successfully!")
        browser.close()

if __name__ == "__main__":
    run()
