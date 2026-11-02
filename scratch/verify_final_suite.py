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

        # Click Settings tab in the left sidebar
        print("Clicking Settings tab...")
        settings_btn = page.locator("button:has-text('Settings')").first
        await settings_btn.click()
        await asyncio.sleep(1.5)

        # Scroll down to Bespoke Invitation Cards section
        print("Scrolling to Bespoke Invitation Cards...")
        cards_section = page.locator("text=Bespoke Invitation Cards & 3D Unboxing").first
        await cards_section.scroll_into_view_if_needed()
        await asyncio.sleep(1)

        # 1. Screenshot: Clean Settings Section
        s1 = os.path.join(OUT_DIR, "verify_01_clean_settings_section.png")
        await page.screenshot(path=s1)
        print(f"Captured: {s1}")

        # 2. Click "Preview Studio →" on the first card (Botanical Garden Classic)
        print("Opening Botanical Garden Classic studio...")
        preview_btn = page.locator("button:has-text('Preview Studio')").first
        await preview_btn.click()
        await asyncio.sleep(2)

        # 2. Screenshot: Image 4 Template in Full Studio
        s2 = os.path.join(OUT_DIR, "verify_02_image4_template_studio.png")
        await page.screenshot(path=s2)
        print(f"Captured: {s2}")

        # 3. In Left Card, click "2D Spectrum" for Card Background Paper
        print("Clicking 2D Spectrum on Card Background Paper...")
        spectrum_btn = page.locator("button:has-text('2D Spectrum')").first
        await spectrum_btn.click()
        await asyncio.sleep(1)

        # 3. Screenshot: 2D Spectrum Picker in Left Card (Image 3)
        s3 = os.path.join(OUT_DIR, "verify_03_image3_spectrum_left_card.png")
        await page.screenshot(path=s3)
        print(f"Captured: {s3}")

        # 4. Click on a text element on the card (e.g., 'Sophie Taylor') to open Inspector
        print("Selecting 'Sophie Taylor' text element on canvas...")
        sophie_el = page.locator("text=Sophie Taylor").first
        await sophie_el.click()
        await asyncio.sleep(1)

        # In Inspector, click "2D Spectrum" for Text Color
        print("Clicking 2D Spectrum for Text Color in Inspector...")
        text_spectrum_btn = page.locator("aside button:has-text('2D Spectrum')").last
        await text_spectrum_btn.click()
        await asyncio.sleep(1)

        # 4. Screenshot: Inspector 2D Spectrum Picker
        s4 = os.path.join(OUT_DIR, "verify_04_inspector_spectrum_picker.png")
        await page.screenshot(path=s4)
        print(f"Captured: {s4}")

        # 5. Switch to Design Box tab in Right Card
        print("Switching to Design Box tab...")
        design_box_tab = page.locator("button:has-text('Design Box')").first
        await design_box_tab.click()
        await asyncio.sleep(1)

        # 5. Screenshot: Design Box with professional icons
        s5 = os.path.join(OUT_DIR, "verify_05_design_box_professional_icons.png")
        await page.screenshot(path=s5)
        print(f"Captured: {s5}")

        await browser.close()
        print("All verification steps completed successfully!")

asyncio.run(main())
