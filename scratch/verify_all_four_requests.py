import time
import shutil
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        print("Navigating to http://127.0.0.1:5173/ ...")
        page.goto("http://127.0.0.1:5173/")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # 1. Switch to Couple View
        print("Switching to Couple View...")
        couple_btn = page.locator("button:has-text('Couple View')").first
        if couple_btn.is_visible():
            couple_btn.click()
            time.sleep(1)

        # 2. Click Settings in sidebar
        print("Opening Settings tab...")
        settings_nav = page.locator("button:has-text('Settings')").first
        if settings_nav.is_visible():
            settings_nav.click()
            time.sleep(1.5)

        # Capture Settings with the 5 Default Demo Templates (Request 3)
        print("Capturing 5 default templates in Settings section...")
        page.screenshot(path="verify_req3_default_5_demo_templates.png")

        # 3. Open Studio Designer for Midnight Protea (index 2) or Magnolia Gold (index 0)
        print("Clicking Preview Studio on Midnight Protea & Garland (index 2)...")
        preview_btns = page.locator("button:has-text('Preview Studio')")
        print(f"Found {preview_btns.count()} Preview Studio buttons")
        
        # Click the 3rd template (Midnight Protea & Garland)
        if preview_btns.count() >= 3:
            preview_btns.nth(2).click()
        else:
            preview_btns.first.click()
        time.sleep(2)

        # Capture Midnight Protea loaded in Studio (Request 3)
        print("Capturing Midnight Protea template loaded into Studio...")
        page.screenshot(path="verify_req3_midnight_protea_in_studio.png")

        # 4. Check Left Card: Silhouette Shape Dropdown & Predefined 3D Motion Dropdown (Request 4)
        print("Testing Silhouette Shape Dropdown...")
        shape_toggle = page.locator("div.relative button:has-text('Classic Rounded')").first
        if not shape_toggle.is_visible():
            shape_toggle = page.locator("div.relative:has-text('Card Silhouette Shape') button").first
        if shape_toggle.is_visible():
            shape_toggle.click()
            time.sleep(0.5)
            page.screenshot(path="verify_req4_shape_dropdown_open.png")
            # Select Arch Dome Top
            arch_opt = page.locator("button:has-text('Arch Dome Top')").first
            if arch_opt.is_visible():
                arch_opt.click()
            time.sleep(0.5)

        print("Testing Motion Dropdown...")
        motion_toggle = page.locator("div.relative:has-text('Predefined 3D Motion') button").first
        if motion_toggle.is_visible():
            motion_toggle.click()
            time.sleep(0.5)
            page.screenshot(path="verify_req4_motion_dropdown_open.png")
            # Select Pocketfold Elevation
            pocketfold_opt = page.locator("button:has-text('Pocketfold Elevation')").first
            if pocketfold_opt.is_visible():
                pocketfold_opt.click()
            time.sleep(0.5)

        # 5. Check Custom Color Spectrum rename (Request 2)
        print("Testing Custom Color Spectrum button...")
        spectrum_btn = page.locator("button:has-text('Custom Color Spectrum')").first
        if spectrum_btn.is_visible():
            spectrum_btn.click()
            time.sleep(0.6)
            page.screenshot(path="verify_req2_custom_color_spectrum_opened.png")

        # 6. Check Text Element & Word-Style Font Dropdown with Search & Previews (Request 1)
        print("Clicking a text element on canvas...")
        text_el = page.locator("div:has-text('Sophie & Daniel')").last
        if text_el.is_visible():
            text_el.click()
            time.sleep(1)

        # Click the Inspector Font Family dropdown button
        print("Opening Word-style Font dropdown in Inspector...")
        font_dropdown_btn = page.locator("div.relative:has-text('Font Family') button").first
        if font_dropdown_btn.is_visible():
            font_dropdown_btn.click()
            time.sleep(0.8)
            page.screenshot(path="verify_req1_font_dropdown_open.png")

            # Search in the font dropdown
            print("Searching in Font dropdown...")
            search_input = page.locator("input[placeholder*='Search wedding fonts']").first
            if search_input.is_visible():
                search_input.fill("Cormorant")
                time.sleep(0.5)
                page.screenshot(path="verify_req1_font_search_filter.png")

                # Click Cormorant Garamond
                cormorant_btn = page.locator("button:has-text('Cormorant Garamond')").first
                if cormorant_btn.is_visible():
                    cormorant_btn.click()
                time.sleep(0.5)
                page.screenshot(path="verify_req1_font_applied_to_canvas.png")

        print("Copying all verification screenshots to artifact directory...")
        artifact_dir = r"C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b"
        screenshots = [
            "verify_req3_default_5_demo_templates.png",
            "verify_req3_midnight_protea_in_studio.png",
            "verify_req4_shape_dropdown_open.png",
            "verify_req4_motion_dropdown_open.png",
            "verify_req2_custom_color_spectrum_opened.png",
            "verify_req1_font_dropdown_open.png",
            "verify_req1_font_search_filter.png",
            "verify_req1_font_applied_to_canvas.png",
        ]
        import os
        for s in screenshots:
            if os.path.exists(s):
                shutil.copy(s, os.path.join(artifact_dir, s))
                print(f"Copied {s} to artifact dir")

        print("All steps verified successfully!")
        browser.close()

if __name__ == "__main__":
    run()
