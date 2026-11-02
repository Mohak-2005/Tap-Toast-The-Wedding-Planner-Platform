import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def test_specific_theme():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1440, "height": 1100})

        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        await page.locator("button:has-text('Platform Settings')").first.click()
        await page.wait_for_timeout(1000)

        # Click Design on "Midnight Protea & Garland" card
        midnight_card = page.locator("div.bg-\\[\\#faf8f5\\]:has-text('Midnight Protea & Garland')")
        design_btn = midnight_card.locator("button:has-text('Design')")
        await design_btn.click()
        await page.wait_for_timeout(1000)

        shot = os.path.join(OUTPUT_DIR, "localhost_superadmin_midnight_loaded_studio.png")
        await page.screenshot(path=shot)
        print(f"Captured: {shot}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_specific_theme())
