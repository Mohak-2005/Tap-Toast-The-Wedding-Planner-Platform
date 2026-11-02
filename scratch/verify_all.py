import sys
import os
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    context = browser.new_context(viewport={'width': 1400, 'height': 900})
    page = context.new_page()

    print("Navigating to http://127.0.0.1:5173/...")
    page.goto('http://127.0.0.1:5173/', wait_until='networkidle')
    page.wait_for_timeout(1000)

    # 1. Navigate to Couple Dashboard
    couple_btn = page.locator("button:has-text('Couple Dashboard')")
    if couple_btn.count() > 0:
        couple_btn.first.click()
        print("Clicked Couple Dashboard")
        page.wait_for_timeout(1500)

    # 2. Navigate to Settings
    settings_btn = page.locator("button:has-text('Settings'), a:has-text('Settings')")
    if settings_btn.count() > 0:
        settings_btn.first.click()
        print("Clicked Settings tab")
        page.wait_for_timeout(1500)

    # Scroll to Bespoke Invitation Cards section
    section_heading = page.locator("text=Bespoke Invitation Cards & 3D Unboxing")
    if section_heading.count() > 0:
        section_heading.first.scroll_into_view_if_needed()
        print("Scrolled to Bespoke Invitation Cards section")
        page.wait_for_timeout(1000)

    # Verify Requirement 2: Initial 3 designs only
    cards = page.locator("h4:has-text('Magnolia'), h4:has-text('Native Wattle'), h4:has-text('Midnight Protea'), h4:has-text('Sydney Harbor'), h4:has-text('Hunter Valley')")
    visible_cards = [cards.nth(i).inner_text() for i in range(cards.count()) if cards.nth(i).is_visible()]
    print(f"Initially visible cards ({len(visible_cards)}): {visible_cards}")
    assert len(visible_cards) == 3, f"Expected 3 visible cards initially, got {len(visible_cards)}"

    blank_card_text = page.get_by_text("Create Blank Invitation", exact=True)
    print(f"Is blank card visible initially: {blank_card_text.is_visible()}")
    assert not blank_card_text.is_visible(), "Blank card should NOT be visible initially"

    show_more_btn = page.locator("button:has-text('Show More Themes')")
    assert show_more_btn.is_visible(), "Show More Themes button should be visible"
    print("✓ Requirement 2 Initial State: Only 3 designs shown + Show More Themes button present")

    # Capture initial 3 cards screenshot
    page.screenshot(path=os.path.join(artifacts_dir, "verify_req2_initial_3_themes.png"))

    # Click Show More Themes button
    show_more_btn.first.click()
    page.wait_for_timeout(800)

    # Verify all 5 cards + blank card are visible
    visible_cards_expanded = [cards.nth(i).inner_text() for i in range(cards.count()) if cards.nth(i).is_visible()]
    print(f"Expanded visible cards ({len(visible_cards_expanded)}): {visible_cards_expanded}")
    assert len(visible_cards_expanded) == 5, f"Expected 5 visible cards when expanded, got {len(visible_cards_expanded)}"
    assert blank_card_text.is_visible(), "Blank card should be visible when expanded"

    show_less_btn = page.locator("button:has-text('Show Less Themes')")
    assert show_less_btn.is_visible(), "Show Less Themes button should be visible when expanded"
    print("✓ Requirement 2 Expanded State: All 5 designs + Blank card shown + Show Less button")

    # Capture expanded state screenshot
    page.screenshot(path=os.path.join(artifacts_dir, "verify_req2_expanded_all_themes.png"))

    # Test Studio 8 Handles: Click Preview Studio on 'Sydney Harbor & Fairy Lights'
    print("Opening Studio for Sydney Harbor & Fairy Lights...")
    coastal_preview_btn = page.locator("div:has(h4:has-text('Sydney Harbor')) button:has-text('Preview Studio')")
    coastal_preview_btn.first.click()
    page.wait_for_timeout(1500)

    canvas = page.locator("div.w-\\[380px\\].h-\\[550px\\]")
    assert canvas.is_visible(), "Canvas should be visible"
    print("Canvas is open in studio")

    # Select an element on the canvas inside the studio
    canvas_elements = canvas.locator("div.touch-none")
    print(f"Number of canvas elements found: {canvas_elements.count()}")
    # Click on the couple text element (usually element 1 or 2)
    canvas_elements.nth(1).click(force=True)
    page.wait_for_timeout(500)

    # Verify 8 handles: 4 corners + 4 edge midpoints
    corner_nw = page.locator("span[title*='top-left corner']")
    corner_ne = page.locator("span[title*='top-right corner']")
    corner_sw = page.locator("span[title*='bottom-left corner']")
    corner_se = page.locator("span[title*='bottom-right corner']")
    edge_n = page.locator("span[title*='top edge']")
    edge_s = page.locator("span[title*='bottom edge']")
    edge_w = page.locator("span[title*='left edge']")
    edge_e = page.locator("span[title*='right edge']")

    assert corner_nw.count() > 0 and corner_nw.is_visible(), "NW corner handle visible"
    assert corner_ne.count() > 0 and corner_ne.is_visible(), "NE corner handle visible"
    assert corner_sw.count() > 0 and corner_sw.is_visible(), "SW corner handle visible"
    assert corner_se.count() > 0 and corner_se.is_visible(), "SE corner handle visible"
    assert edge_n.count() > 0 and edge_n.is_visible(), "Top edge N handle visible"
    assert edge_s.count() > 0 and edge_s.is_visible(), "Bottom edge S handle visible"
    assert edge_w.count() > 0 and edge_w.is_visible(), "Left edge W handle visible"
    assert edge_e.count() > 0 and edge_e.is_visible(), "Right edge E handle visible"
    print("✓ Requirement 1: All 8 Handles (4 Corners + 4 Edge Midpoints) are present and visible!")

    # Capture screenshot of element selected with 8 handles
    page.screenshot(path=os.path.join(artifacts_dir, "verify_req1_selected_8_handles.png"))

    # Test resizing: Drag right edge handle (e) horizontally to expand width
    e_box = edge_e.first.bounding_box()
    if e_box:
        print(f"Dragging right edge handle from ({e_box['x']}, {e_box['y']})...")
        page.mouse.move(e_box['x'] + e_box['width'] / 2, e_box['y'] + e_box['height'] / 2)
        page.mouse.down()
        page.mouse.move(e_box['x'] + e_box['width'] / 2 + 50, e_box['y'] + e_box['height'] / 2, steps=10)
        page.wait_for_timeout(300)
        # Capture screenshot while resizing showing live badge
        page.screenshot(path=os.path.join(artifacts_dir, "verify_req1_resizing_width_live.png"))
        page.mouse.up()
        page.wait_for_timeout(500)
        print("Completed horizontal width expansion")

    # Test resizing: Drag bottom edge handle (s) vertically to expand height
    s_box = edge_s.first.bounding_box()
    if s_box:
        print(f"Dragging bottom edge handle from ({s_box['x']}, {s_box['y']})...")
        page.mouse.move(s_box['x'] + s_box['width'] / 2, s_box['y'] + s_box['height'] / 2)
        page.mouse.down()
        page.mouse.move(s_box['x'] + s_box['width'] / 2, s_box['y'] + s_box['height'] / 2 + 40, steps=10)
        page.wait_for_timeout(300)
        page.mouse.up()
        page.wait_for_timeout(500)
        print("Completed vertical height expansion")

    # Capture final resized state screenshot
    page.screenshot(path=os.path.join(artifacts_dir, "verify_req1_horizontal_vertical_expanded.png"))

    print("ALL TESTS PASSED SUCCESSFULLY!")
    browser.close()
