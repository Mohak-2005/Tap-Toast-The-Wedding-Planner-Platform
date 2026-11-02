import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def capture_more():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1480, "height": 1100})

        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1200)

        await page.locator("button:has-text('Platform Settings')").first.click()
        await page.wait_for_timeout(800)

        # Open Figma Studio on Midnight Protea & Garland
        midnight_card = page.locator("div.bg-\\[\\#faf8f5\\]:has-text('Midnight Protea & Garland')")
        await midnight_card.locator("button:has-text('Design')").first.click()
        await page.wait_for_timeout(1000)

        shot1 = os.path.join(OUTPUT_DIR, "localhost_figma_midnight_dark_mode.png")
        await page.screenshot(path=shot1)
        print(f"Captured: {shot1}")

        # Switch to Motion tab
        await page.locator("button:has-text('Motion')").first.click()
        await page.wait_for_timeout(600)

        shot2 = os.path.join(OUTPUT_DIR, "localhost_figma_motion_tab.png")
        await page.screenshot(path=shot2)
        print(f"Captured: {shot2}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(capture_more())
