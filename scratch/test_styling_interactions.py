import sys
import asyncio
import traceback
import shutil
import os
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

art_dir = r'C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b'

async def main():
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(channel='msedge', headless=True)
            page = await browser.new_page(viewport={'width': 1440, 'height': 900})
            print("Navigating to http://127.0.0.1:5173/#superadmin ...")
            await page.goto('http://127.0.0.1:5173/#superadmin')
            await page.wait_for_timeout(2000)

            # Click 'Platform Settings'
            for b in await page.query_selector_all('button'):
                t = await b.inner_text()
                if 'Platform Settings' in t:
                    await b.click()
                    break

            await page.wait_for_timeout(1000)

            # Click 'Design →' on first theme card
            design_btns = [b for b in await page.query_selector_all('button') if 'Design' in (await b.inner_text()) and '→' in (await b.inner_text())]
            if design_btns:
                await design_btns[0].click()

            await page.wait_for_timeout(1200)

            # Find the flower element on the canvas (Magnolia Bloom is at x: 20%, y: 15%)
            # We can find the touch-none element containing the SVG flower
            canvas_els = await page.query_selector_all('div.touch-none')
            print(f"Found {len(canvas_els)} elements on canvas")

            # Click flower element (index 1 is flower)
            if len(canvas_els) > 1:
                print("Clicking floral element...")
                await canvas_els[1].click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_flower_selected.png')
                shutil.copy('localhost_flower_selected.png', os.path.join(art_dir, 'localhost_flower_selected.png'))
                print("Saved localhost_flower_selected.png")

                # Click a petal fill color (e.g. Blush Pink or Crimson Rose)
                blush_btn = await page.query_selector('button[title="Blush Pink"]')
                if blush_btn:
                    print("Selecting Blush Pink petal fill...")
                    await blush_btn.click()
                    await page.wait_for_timeout(500)
                    await page.screenshot(path='localhost_flower_petal_color_applied.png')
                    shutil.copy('localhost_flower_petal_color_applied.png', os.path.join(art_dir, 'localhost_flower_petal_color_applied.png'))
                    print("Saved localhost_flower_petal_color_applied.png")

            # Click text element (e.g., 'Sophie & Daniel')
            sophie_el = await page.query_selector('text=Sophie & Daniel')
            if sophie_el:
                print("Clicking 'Sophie & Daniel' text element...")
                await sophie_el.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_text_selected.png')
                shutil.copy('localhost_text_selected.png', os.path.join(art_dir, 'localhost_text_selected.png'))
                print("Saved localhost_text_selected.png")

                # Click Bold button
                bold_btn = await page.query_selector('button:has-text("Bold (B)")')
                if bold_btn:
                    print("Clicking Bold button...")
                    await bold_btn.click()

                # Click Font size 32
                sz_32 = await page.query_selector('button:has-text("32")')
                if sz_32:
                    print("Setting font size 32...")
                    await sz_32.click()

                await page.wait_for_timeout(500)
                await page.screenshot(path='localhost_text_bold_size_applied.png')
                shutil.copy('localhost_text_bold_size_applied.png', os.path.join(art_dir, 'localhost_text_bold_size_applied.png'))
                print("Saved localhost_text_bold_size_applied.png")

            await browser.close()
            print("Done styling interactions test!")

    except Exception as e:
        print("Error during test:", e)
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(main())
