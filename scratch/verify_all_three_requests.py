import asyncio
import os
from playwright.async_api import async_playwright

OUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='msedge', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        print("Navigating to http://127.0.0.1:5173/#couple ...")
        await page.goto("http://127.0.0.1:5173/#couple", wait_until='networkidle')
        await asyncio.sleep(1.5)

        # 1. Click Settings Tab
        print("Clicking Settings tab in Couple Dashboard...")
        settings_btn = page.locator("button:has-text('Settings')").first
        await settings_btn.click()
        await asyncio.sleep(1.5)

        # Scroll to Bespoke Invitation Cards section
        cards_section = page.locator("text=Bespoke Invitation Cards & 3D Unboxing").first
        await cards_section.scroll_into_view_if_needed()
        await asyncio.sleep(1)

        # Screenshot 1: Clean settings section (No "6 Themes", No "Preview" badge on button)
        s1 = os.path.join(OUT_DIR, "verify_req3_settings_header_clean.png")
        await page.screenshot(path=s1)
        print(f"Captured: {s1}")

        # 2. Open Studio for Botanical Garden Classic
        print("Opening Botanical Garden Classic studio...")
        preview_btn = page.locator("button:has-text('Preview Studio')").first
        await preview_btn.click()
        await asyncio.sleep(2)

        # Screenshot 2: Full view of new high-contrast, beautiful porcelain cards with readable text and clear buttons
        s2 = os.path.join(OUT_DIR, "verify_req1_proper_buttons_and_backgrounds.png")
        await page.screenshot(path=s2)
        print(f"Captured: {s2}")

        # 3. Select "SATURDAY | 14 | NOVEMBER 2026" on the card
        print("Selecting 'SATURDAY | 14 | NOVEMBER 2026' text element...")
        date_el = page.locator("text=SATURDAY | 14 | NOVEMBER 2026").first
        await date_el.click()
        await asyncio.sleep(1)

        # Screenshot 3: Inspector view with readable text, proper buttons, no scale slider, direct resize guidance
        s3 = os.path.join(OUT_DIR, "verify_req1_inspector_high_contrast.png")
        await page.screenshot(path=s3)
        print(f"Captured: {s3}")

        # 4. Interact with corner handle to resize (simulate dragging bottom-right corner)
        print("Interacting with bottom-right corner handle to expand element...")
        se_handle = page.locator("span[title*='Drag corner to expand']").last
        box = await se_handle.bounding_box()
        if box:
            await page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
            await page.mouse.down()
            # Drag down-right by 40px to expand
            await page.mouse.move(box['x'] + box['width'] / 2 + 35, box['y'] + box['height'] / 2 + 35, steps=10)
            await asyncio.sleep(0.5)

            # Screenshot 4: Direct 4-Corner Word-style resizing in action with live scale badge
            s4 = os.path.join(OUT_DIR, "verify_req2_word_style_corner_resizing.png")
            await page.screenshot(path=s4)
            print(f"Captured: {s4}")

            await page.mouse.up()
            await asyncio.sleep(0.5)

        await browser.close()
        print("All verification steps finished successfully!")

asyncio.run(main())
