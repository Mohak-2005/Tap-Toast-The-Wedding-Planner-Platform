import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def test_small_section():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1440, "height": 1100})

        print("Navigating to http://127.0.0.1:5173/#superadmin...")
        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Click Platform Settings
        print("Opening Platform Settings...")
        await page.locator("button:has-text('Platform Settings')").first.click()
        await page.wait_for_timeout(1000)

        # 1. Capture the small section in settings page
        section_heading = page.locator("h3:has-text('Invitation Card Themes & 3D Unboxing Studio')")
        await section_heading.first.scroll_into_view_if_needed()
        await page.wait_for_timeout(600)

        shot1 = os.path.join(OUTPUT_DIR, "localhost_superadmin_settings_small_section.png")
        await page.screenshot(path=shot1)
        print(f"Captured: {shot1}")

        # 2. Click "Design" button on the first card (e.g. Magnolia & Gilded Frame)
        print("Clicking Design button on first theme card...")
        first_design_btn = page.locator("button:has-text('Design')").first
        await first_design_btn.click()
        await page.wait_for_timeout(1000)

        # Capture the opened full window design studio
        shot2 = os.path.join(OUTPUT_DIR, "localhost_superadmin_full_window_studio.png")
        await page.screenshot(path=shot2)
        print(f"Captured: {shot2}")

        # 3. Click "← Back to Settings" button in the modal header
        print("Clicking Back to Settings button...")
        back_btn = page.locator("button:has-text('Back to Settings')").first
        await back_btn.click()
        await page.wait_for_timeout(800)

        # Capture the returned normal settings page
        shot3 = os.path.join(OUTPUT_DIR, "localhost_superadmin_back_to_settings.png")
        await page.screenshot(path=shot3)
        print(f"Captured: {shot3}")

        await browser.close()
        print("Small section and full window studio tested successfully!")

if __name__ == "__main__":
    asyncio.run(test_small_section())
