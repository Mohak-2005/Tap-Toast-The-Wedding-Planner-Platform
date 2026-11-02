import asyncio
import os
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(channel='msedge', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        print("Navigating to http://127.0.0.1:5173/...")
        await page.goto("http://127.0.0.1:5173/", wait_until='networkidle')
        await asyncio.sleep(1)

        # 1. Click Couple Dashboard
        print("Clicking Couple Dashboard...")
        couple_btn = page.locator("button:has-text('Couple Dashboard'), a:has-text('Couple Dashboard')").first
        await couple_btn.click()
        await asyncio.sleep(1)

        # 2. Click Settings Tab
        print("Clicking Settings tab...")
        settings_tab = page.locator("button:has-text('Settings'), div:has-text('Settings')").filter(has_text="Settings").first
        await settings_tab.click()
        await asyncio.sleep(1)

        # Scroll to Bespoke Invitation Cards
        print("Scrolling to Bespoke Invitation Cards section...")
        cards_section = page.locator("text=Bespoke Invitation Cards & 3D Unboxing").first
        await cards_section.scroll_into_view_if_needed()
        await asyncio.sleep(1)

        # Screenshot 1: Clean settings section
        out_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"
        s1 = os.path.join(out_dir, "verify_clean_settings_section.png")
        await page.screenshot(path=s1)
        print(f"Captured: {s1}")

        # 3. Click Preview Studio on Botanical Garden Classic
        print("Opening Botanical Garden Classic studio...")
        preview_btn = page.locator("button:has-text('Preview Studio')").first
        await preview_btn.click()
        await asyncio.sleep(2)

        # Screenshot 2: Botanical Garden Classic / Image 4 Template
        s2 = os.path.join(out_dir, "verify_image4_template_open.png")
        await page.screenshot(path=s2)
        print(f"Captured: {s2}")

        # 4. In Left Card, click 2D Spectrum for Card Background Paper
        print("Clicking 2D Spectrum button...")
        spectrum_btn = page.locator("button:has-text('🎨 2D Spectrum')").first
        await spectrum_btn.click()
        await asyncio.sleep(1)

        # Screenshot 3: 2D Color Spectrum Picker Active
        s3 = os.path.join(out_dir, "verify_image3_color_picker_active.png")
        await page.screenshot(path=s3)
        print(f"Captured: {s3}")

        await browser.close()
        print("Verification complete!")

asyncio.run(run())
