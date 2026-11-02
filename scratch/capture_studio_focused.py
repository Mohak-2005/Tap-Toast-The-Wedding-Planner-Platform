import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def capture_focused():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1400, "height": 1200})

        print("Navigating to http://127.0.0.1:5173/#superadmin...")
        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Click Platform Settings
        await page.locator("button:has-text('Platform Settings')").first.click()
        await page.wait_for_timeout(1000)

        # Locate the studio container (the parent div of the studio heading)
        studio_locator = page.locator("div.bg-white:has(h3:has-text('Global Invitation Card & Animation Studio'))")
        await studio_locator.first.scroll_into_view_if_needed()
        await page.wait_for_timeout(600)

        # 1. Capture Designer Mode element
        shot1 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_designer_view.png")
        await studio_locator.first.screenshot(path=shot1)
        print(f"Captured: {shot1}")

        # 2. Select French Gatefold animation option
        gatefold_card = page.locator("div:has-text('French Gatefold Double-Door Blossom')").last
        await gatefold_card.click()
        await page.wait_for_timeout(500)
        shot2 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_gatefold_view.png")
        await studio_locator.first.screenshot(path=shot2)
        print(f"Captured: {shot2}")

        # 3. Switch to Direct File Upload Tab
        await page.locator("button:has-text('Direct File Upload')").first.click()
        await page.wait_for_timeout(500)

        # Click "Load Lottie (.json)"
        await page.locator("button:has-text('Load Lottie (.json)')").first.click()
        await page.wait_for_timeout(800)

        shot3 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_upload_sandbox_view.png")
        await studio_locator.first.screenshot(path=shot3)
        print(f"Captured: {shot3}")

        # 4. Deploy to catalog
        await page.locator("button:has-text('Validate & Deploy to Global Catalog')").first.click()
        await page.wait_for_timeout(800)

        shot4 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_catalog_view.png")
        await studio_locator.first.screenshot(path=shot4)
        print(f"Captured: {shot4}")

        await browser.close()
        print("Done capturing focused screenshots!")

if __name__ == "__main__":
    asyncio.run(capture_focused())
