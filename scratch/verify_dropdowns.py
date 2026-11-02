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
                    print("Clicking Platform Settings tab...")
                    await b.click()
                    break

            await page.wait_for_timeout(1000)

            # Click 'Design →' on first theme card
            design_btns = [b for b in await page.query_selector_all('button') if 'Design' in (await b.inner_text()) and '→' in (await b.inner_text())]
            if design_btns:
                print("Opening Whiteboard Studio for theme...")
                await design_btns[0].click()
            else:
                new_btn = await page.query_selector('button:has-text("Design New Theme")')
                if new_btn:
                    print("Opening Whiteboard Studio for new theme...")
                    await new_btn.click()

            await page.wait_for_timeout(1000)
            await page.screenshot(path='localhost_studio_open.png')
            shutil.copy('localhost_studio_open.png', os.path.join(art_dir, 'localhost_studio_open.png'))
            print("Saved localhost_studio_open.png")

            # Click Leaves dropdown
            leaves_btn = None
            for b in await page.query_selector_all('button'):
                t = await b.inner_text()
                if 'Leaves' in t:
                    leaves_btn = b
                    break
            if leaves_btn:
                print("Clicking Leaves dropdown...")
                await leaves_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_dropdown_leaves.png')
                shutil.copy('localhost_dropdown_leaves.png', os.path.join(art_dir, 'localhost_dropdown_leaves.png'))
                print("Saved localhost_dropdown_leaves.png")

            # Click Flowers dropdown
            flowers_btn = None
            for b in await page.query_selector_all('button'):
                t = await b.inner_text()
                if 'Flowers' in t:
                    flowers_btn = b
                    break
            if flowers_btn:
                print("Clicking Flowers dropdown...")
                await flowers_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_dropdown_flowers.png')
                shutil.copy('localhost_dropdown_flowers.png', os.path.join(art_dir, 'localhost_dropdown_flowers.png'))
                print("Saved localhost_dropdown_flowers.png")

            # Click Motion dropdown
            motion_btn = None
            for b in await page.query_selector_all('button'):
                t = await b.inner_text()
                if 'Motion' in t:
                    motion_btn = b
                    break
            if motion_btn:
                print("Clicking Motion dropdown...")
                await motion_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_dropdown_motion.png')
                shutil.copy('localhost_dropdown_motion.png', os.path.join(art_dir, 'localhost_dropdown_motion.png'))
                print("Saved localhost_dropdown_motion.png")

            await browser.close()
            print("Completed verification successfully!")

    except Exception as e:
        print("Error during execution:", e)
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(main())
