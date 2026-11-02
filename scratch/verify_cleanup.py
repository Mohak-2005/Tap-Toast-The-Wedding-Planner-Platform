import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    context = browser.new_context(viewport={'width': 1400, 'height': 1000})
    page = context.new_page()

    page.goto('http://127.0.0.1:5173/', wait_until='networkidle')
    page.wait_for_timeout(1000)

    # 1. Navigate to Couple Dashboard
    page.locator("button:has-text('Couple Dashboard')").first.click()
    page.wait_for_timeout(1000)

    # 2. Navigate to Settings
    page.locator("button:has-text('Settings'), a:has-text('Settings')").first.click()
    page.wait_for_timeout(1000)

    # Scroll to Bespoke Invitation section
    container = page.locator("div.bg-white:has-text('Bespoke Invitation Cards & 3D Unboxing')")
    container.scroll_into_view_if_needed()
    page.wait_for_timeout(600)

    # Verify Item 1: Button text is exactly "Show More Themes"
    show_more_btn = page.locator("button:has-text('Show More Themes')")
    btn_text = show_more_btn.inner_text().strip()
    print(f"Item 1: Button text is '{btn_text}'")
    assert btn_text == "Show More Themes", f"Expected 'Show More Themes', got '{btn_text}'"

    # Screenshot of Settings with "Show More Themes"
    container.screenshot(path=os.path.join(artifacts_dir, "verify_item1_show_more_themes.png"))
    print("Saved verify_item1_show_more_themes.png")

    # 3. Open Studio by clicking Preview Studio on Sydney Harbor
    coastal_btn = page.locator("div:has(h4:has-text('Sydney Harbor')) button:has-text('Preview Studio')")
    if not coastal_btn.is_visible():
        show_more_btn.click()
        page.wait_for_timeout(500)
    coastal_btn.first.click()
    page.wait_for_timeout(1200)

    # Left card element
    left_card = page.locator("aside:has-text('Card Aesthetic & Motion')")
    assert left_card.is_visible(), "Left card should be visible"

    # Verify Item 2: "PREDEFINED ONLY" and "CLASSIC ROUNDED" are NOT present in headers
    shape_header = left_card.locator("div.text-\\[10px\\].font-bold.uppercase:has-text('Card Silhouette Shape')").first
    print("Shape header text:", repr(shape_header.inner_text().strip()))
    assert "CLASSIC ROUNDED" not in shape_header.inner_text() and "Classic Rounded" not in shape_header.inner_text()

    motion_header = left_card.locator("div.text-\\[10px\\].font-bold.uppercase:has-text('Predefined 3D Motion')").first
    print("Motion header text:", repr(motion_header.inner_text().strip()))
    assert "PREDEFINED ONLY" not in motion_header.inner_text() and "Predefined Only" not in motion_header.inner_text()
    print("Item 2: Confirmed 'PREDEFINED ONLY' and 'CLASSIC ROUNDED' text removed from headers")

    # Verify Item 3 & 5: Foil section has "Custom Color" and NO "Gilded Foil" box
    left_text = left_card.inner_text()
    foil_btn = page.locator("button[title*='custom foil color']")
    assert foil_btn.is_visible(), "Foil section should have Custom Color button"
    assert "Custom Color Spectrum" not in left_text, "Custom Color Spectrum should not be present"
    assert "Gilded Foil" not in left_text, "Gilded Foil box should not be present"
    print("Item 3 & 5: Confirmed Foil section has 'Custom Color' and NO 'Gilded Foil' box")

    # Screenshot of Left Card
    left_card.screenshot(path=os.path.join(artifacts_dir, "verify_items2_3_5_left_card.png"))
    print("Saved verify_items2_3_5_left_card.png")

    # 4. Select an element on canvas to inspect Right Card
    canvas = page.locator("div.w-\\[380px\\].h-\\[550px\\]")
    canvas.locator("div.touch-none").nth(1).click(force=True)
    page.wait_for_timeout(600)

    right_card = page.locator("aside").filter(has_text="Design Box").last
    assert right_card.is_visible(), "Right card should be visible"
    
    # Ensure Inspector tab is active
    inspector_tab = right_card.locator("button:has-text('Inspector')")
    inspector_tab.click()
    page.wait_for_timeout(500)

    right_text = right_card.inner_text()

    # Verify Item 4: Direct Resizing tip text is NOT present
    assert "Press & drag any of the 4 corners" not in right_text, "Direct Resizing tip text should be removed"
    print("Item 4: Confirmed Direct Resizing helper text removed")

    # Click a graphic element on canvas to check Foil / Outline Stroke
    canvas.locator("div.touch-none").first.click(force=True)
    page.wait_for_timeout(600)
    stroke_btn = right_card.locator("button[title*='custom stroke color']")
    if stroke_btn.count() > 0:
        assert stroke_btn.first.is_visible(), "Foil stroke should have Custom Color button"
        print("Item 3 & 5 on Right Card: Confirmed Foil / Outline Stroke has 'Custom Color' button")

    # Screenshot of Right Card
    right_card.screenshot(path=os.path.join(artifacts_dir, "verify_items3_4_right_card.png"))
    print("Saved verify_items3_4_right_card.png")

    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!")
    browser.close()
