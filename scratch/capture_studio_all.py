import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def capture_all():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1440, "height": 1100})

        print("Navigating to http://127.0.0.1:5173/#superadmin...")
        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Click "Platform Settings" in the sidebar
        print("Clicking Platform Settings...")
        settings_button = page.locator("button:has-text('Platform Settings')")
        await settings_button.first.click()
        await page.wait_for_timeout(1000)

        # Scroll to the studio section
        studio_heading = page.locator("h3:has-text('Global Invitation Card & Animation Studio')")
        await studio_heading.first.scroll_into_view_if_needed()
        await page.wait_for_timeout(800)

        # 1. Capture Designer tab
        shot1 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_designer.png")
        await page.screenshot(path=shot1)
        print(f"Captured: {shot1}")

        # 2. Click "Preview 3D Motion" button to see the unboxing animation
        preview_motion_btn = page.locator("button:has-text('Preview 3D Motion')")
        if await preview_motion_btn.count() > 0:
            print("Triggering Preview 3D Motion...")
            await preview_motion_btn.first.click()
            await page.wait_for_timeout(1500)
            shot2 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_animating.png")
            await page.screenshot(path=shot2)
            print(f"Captured: {shot2}")

        # 3. Click "Direct File Upload" tab
        upload_tab = page.locator("button:has-text('Direct File Upload')")
        if await upload_tab.count() > 0:
            print("Switching to Direct File Upload tab...")
            await upload_tab.first.click()
            await page.wait_for_timeout(600)

            # Click "Load Sample Lottie"
            sample_btn = page.locator("button:has-text('Load Sample Lottie')")
            if await sample_btn.count() > 0:
                await sample_btn.first.click()
                await page.wait_for_timeout(800)

            shot3 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_upload.png")
            await page.screenshot(path=shot3)
            print(f"Captured: {shot3}")

        # 4. Click "Catalog" tab
        catalog_tab = page.locator("button:has-text('Catalog')")
        if await catalog_tab.count() > 0:
            print("Switching to Catalog tab...")
            await catalog_tab.first.click()
            await page.wait_for_timeout(600)

            shot4 = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_catalog.png")
            await page.screenshot(path=shot4)
            print(f"Captured: {shot4}")

        await browser.close()
        print("All studio screenshots captured successfully!")

if __name__ == "__main__":
    asyncio.run(capture_all())
