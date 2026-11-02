import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def test_interactions():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1440, "height": 1150})

        print("Navigating to http://127.0.0.1:5173/#superadmin...")
        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Click Platform Settings
        await page.locator("button:has-text('Platform Settings')").first.click()
        await page.wait_for_timeout(1000)

        # Scroll to Studio
        studio_heading = page.locator("h3:has-text('Global Invitation Card & Animation Studio')")
        await studio_heading.first.scroll_into_view_if_needed()
        await page.wait_for_timeout(600)

        # 1. Switch to French Gatefold animation option
        gatefold_card = page.locator("div:has-text('French Gatefold Double-Door Blossom')").last
        await gatefold_card.click()
        await page.wait_for_timeout(500)

        # Capture Gatefold selection
        shot1 = os.path.join(OUTPUT_DIR, "localhost_superadmin_gatefold_selected.png")
        await page.screenshot(path=shot1)
        print(f"Captured: {shot1}")

        # 2. Switch to Direct File Upload Tab
        await page.locator("button:has-text('Direct File Upload')").first.click()
        await page.wait_for_timeout(600)

        # Click "Load Lottie (.json)"
        await page.locator("button:has-text('Load Lottie (.json)')").first.click()
        await page.wait_for_timeout(1000)

        # Scroll down to sandbox player
        player_heading = page.locator("text=Animation Simulation Sandbox & Playback Scrubber")
        if await player_heading.count() > 0:
            await player_heading.first.scroll_into_view_if_needed()
            await page.wait_for_timeout(600)

        shot2 = os.path.join(OUTPUT_DIR, "localhost_superadmin_lottie_loaded.png")
        await page.screenshot(path=shot2)
        print(f"Captured: {shot2}")

        # 3. Deploy uploaded file to Catalog
        deploy_btn = page.locator("button:has-text('Validate & Deploy to Global Catalog')")
        if await deploy_btn.count() > 0:
            await deploy_btn.first.click()
            await page.wait_for_timeout(1000)

        shot3 = os.path.join(OUTPUT_DIR, "localhost_superadmin_catalog_deployed.png")
        await page.screenshot(path=shot3)
        print(f"Captured: {shot3}")

        await browser.close()
        print("Done testing interactions!")

if __name__ == "__main__":
    asyncio.run(test_interactions())
