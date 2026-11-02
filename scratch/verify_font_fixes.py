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

    # 1. Navigate to Couple Dashboard -> Settings
    page.locator("button:has-text('Couple Dashboard')").first.click()
    page.wait_for_timeout(1000)

    page.locator("button:has-text('Settings'), a:has-text('Settings')").first.click()
    page.wait_for_timeout(1000)

    # 2. Open Studio
    open_studio_btn = page.locator("button:has-text('Open Studio Designer'), button:has-text('Preview Studio')").first
    open_studio_btn.click()
    page.wait_for_timeout(1500)

    # 3. Click on a text element on canvas (e.g. text element)
    canvas = page.locator("div.w-\\[380px\\].h-\\[550px\\]")
    text_el = canvas.locator("div:has-text('Sophie')").last
    text_el.click(force=True)
    page.wait_for_timeout(800)

    right_card = page.locator("aside").filter(has_text="Design Box").last
    inspector_tab = right_card.locator("button:has-text('Inspector')")
    inspector_tab.click()
    page.wait_for_timeout(500)

    # Verify Item 1: Font Family badge is removed from header
    font_family_header = right_card.locator("div:has(> label:has-text('Font Family'))").first
    header_text = font_family_header.inner_text().strip()
    print("Font Family header text:", repr(header_text))
    assert "Pinyon Script" not in header_text and "Playfair Display" not in header_text, "Font Family badge should be removed from header"
    print("✓ Item 1 Verified: Font Family badge removed from header")

    # Verify Item 2: Font Size is rendered in black color
    font_size_badge = right_card.locator("div:has(> span:has-text('Font Size')) span.font-mono").first
    size_text = font_size_badge.inner_text().strip()
    badge_class = font_size_badge.get_attribute("class") or ""
    print(f"Font Size text: '{size_text}', classes: '{badge_class}'")
    assert "text-[#15110e]" in badge_class, "Font Size badge should have black text class text-[#15110e]"
    print("✓ Item 2 Verified: Font Size is rendered in crisp black color")

    # Screenshot of Inspector with both font fixes
    right_card.screenshot(path=os.path.join(artifacts_dir, "verify_font_fixes_inspector.png"))
    print("Saved verify_font_fixes_inspector.png")

    print("ALL TESTS PASSED SUCCESSFULLY!")
    browser.close()
