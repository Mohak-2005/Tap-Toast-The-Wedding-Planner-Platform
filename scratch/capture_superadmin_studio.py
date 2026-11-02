import asyncio
import os
from playwright.async_api import async_playwright

OUTPUT_DIR = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

async def capture():
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True, channel="msedge")
        except Exception as e:
            print(f"Edge launch failed: {e}, trying chrome...")
            browser = await p.chromium.launch(headless=True, channel="chrome")
        context = await browser.new_context(viewport={"width": 1440, "height": 1050})
        page = await context.new_page()

        print("Navigating to http://127.0.0.1:5173/#superadmin...")
        await page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Click "Platform Settings" in sidebar
        print("Clicking Platform Settings sidebar button...")
        settings_btn = page.locator("button:has-text('Platform Settings')")
        if await settings_btn.count() > 0:
            await settings_btn.first.click()
            await page.wait_for_timeout(1000)
        else:
            print("Platform Settings button not found!")

        # Locate the studio section
        studio_section = page.locator("text=Global Digital Invitation Card & Animation Studio")
        if await studio_section.count() > 0:
            print("Studio section found! Scrolling into view...")
            await studio_section.first.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
        else:
            print("Studio section text not found directly, scrolling page...")
            await page.mouse.wheel(0, 600)
            await page.wait_for_timeout(1000)

        # Screenshot 1: Designer Tab
        shot1_path = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_designer.png")
        await page.screenshot(path=shot1_path, full_page=False)
        print(f"Captured: {shot1_path}")

        # Let's scroll specifically to the studio card
        studio_box = page.locator("div:has-text('Global Digital Invitation Card & Animation Studio')").first
        # Let's capture the studio container element or centered view
        card_preview_btn = page.locator("button:has-text('Preview 3D Motion')")
        if await card_preview_btn.count() > 0:
            await card_preview_btn.first.click()
            await page.wait_for_timeout(1500)
            shot1_anim_path = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_unboxed.png")
            await page.screenshot(path=shot1_anim_path, full_page=False)
            print(f"Captured: {shot1_anim_path}")

        # Tab 2: Direct Upload
        upload_tab_btn = page.locator("button:has-text('Direct Upload Animation File')")
        if await upload_tab_btn.count() > 0:
            print("Switching to Direct Upload tab...")
            await upload_tab_btn.first.click()
            await page.wait_for_timeout(500)
            
            # Click "Load Sample Lottie"
            sample_btn = page.locator("button:has-text('Load Sample Lottie')")
            if await sample_btn.count() > 0:
                await sample_btn.first.click()
                await page.wait_for_timeout(1000)

            shot2_path = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_upload.png")
            await page.screenshot(path=shot2_path, full_page=False)
            print(f"Captured: {shot2_path}")

        # Tab 3: Catalog
        catalog_tab_btn = page.locator("button:has-text('Active Platform Catalog')")
        if await catalog_tab_btn.count() > 0:
            print("Switching to Catalog tab...")
            await catalog_tab_btn.first.click()
            await page.wait_for_timeout(500)
            shot3_path = os.path.join(OUTPUT_DIR, "localhost_superadmin_studio_catalog.png")
            await page.screenshot(path=shot3_path, full_page=False)
            print(f"Captured: {shot3_path}")

        await browser.close()
        print("Done capturing screenshots!")

if __name__ == "__main__":
    asyncio.run(capture())
