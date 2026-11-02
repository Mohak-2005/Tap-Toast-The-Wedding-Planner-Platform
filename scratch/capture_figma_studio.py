import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def capture_figma():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1480, "height": 1100})

        print("Navigating to http://127.0.0.1:5173/#superadmin...")
        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Open Platform Settings
        print("Opening Platform Settings...")
        await page.locator("button:has-text('Platform Settings')").first.click()
        await page.wait_for_timeout(1000)

        # 1. Capture clean cards on settings page
        section_box = page.locator("h3:has-text('Invitation Card Themes')")
        await section_box.first.scroll_into_view_if_needed()
        await page.wait_for_timeout(600)

        shot1 = os.path.join(OUTPUT_DIR, "localhost_figma_clean_cards.png")
        await page.screenshot(path=shot1)
        print(f"Captured: {shot1}")

        # 2. Click "Design" on Magnolia & Gilded Frame
        print("Clicking Design button to open Figma Studio...")
        card_el = page.locator("div.bg-\\[\\#faf8f5\\]:has-text('Magnolia & Gilded Frame')")
        await card_el.locator("button:has-text('Design')").first.click()
        await page.wait_for_timeout(1000)

        shot2 = os.path.join(OUTPUT_DIR, "localhost_figma_studio_opened.png")
        await page.screenshot(path=shot2)
        print(f"Captured: {shot2}")

        # 3. Click on the couple names on canvas to select it
        print("Selecting couple names on canvas...")
        names_text = page.locator("div:has-text('Sophie & Daniel')").last
        await names_text.click()
        await page.wait_for_timeout(600)

        shot3 = os.path.join(OUTPUT_DIR, "localhost_figma_element_selected.png")
        await page.screenshot(path=shot3)
        print(f"Captured: {shot3}")

        # 4. Switch to "Style" tool tab to show Card Shapes & Backgrounds
        print("Switching to Style tool tab...")
        style_tab_btn = page.locator("button:has-text('Style')").first
        await style_tab_btn.click()
        await page.wait_for_timeout(600)

        shot4 = os.path.join(OUTPUT_DIR, "localhost_figma_style_and_shapes.png")
        await page.screenshot(path=shot4)
        print(f"Captured: {shot4}")

        await browser.close()
        print("Figma studio screenshots captured successfully!")

if __name__ == "__main__":
    asyncio.run(capture_figma())
