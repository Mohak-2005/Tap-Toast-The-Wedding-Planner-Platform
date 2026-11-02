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
            await page.screenshot(path='localhost_settings_clean.png', full_page=True)
            print("Saved localhost_settings_clean.png")

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

            await page.wait_for_timeout(1200)
            await page.screenshot(path='localhost_whiteboard_full_studio.png')
            print("Saved localhost_whiteboard_full_studio.png")

            # Click a canvas element to show gold selection handles & property controls
            canvas_els = await page.query_selector_all('div.touch-none')
            if canvas_els:
                print(f"Found {len(canvas_els)} elements, selecting one...")
                await canvas_els[1].click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_whiteboard_element_selected.png')
                print("Saved localhost_whiteboard_element_selected.png")

            # Open Predefined Motion dropdown
            motion_btn = await page.query_selector('button[title*="Predefined"]')
            if motion_btn:
                print("Opening Motion dropdown...")
                await motion_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_whiteboard_motion_dropdown.png')
                print("Saved localhost_whiteboard_motion_dropdown.png")

            # Close motion dropdown by clicking canvas
            await page.click('body', position={'x': 100, 'y': 100})
            await page.wait_for_timeout(300)

            # Open Direct Upload modal
            upload_btn = await page.query_selector('button[title*="Direct Upload"]')
            if upload_btn:
                print("Opening Direct Upload modal...")
                await upload_btn.click()
                await page.wait_for_timeout(600)
                await page.screenshot(path='localhost_whiteboard_upload_modal.png')
                print("Saved localhost_whiteboard_upload_modal.png")

                # Close modal
                cancel_btn = await page.query_selector('button:has-text("Cancel")')
                if cancel_btn:
                    await cancel_btn.click()
                    await page.wait_for_timeout(400)

            # Click 'Play Motion' simulation
            play_btn = await page.query_selector('button:has-text("Play Motion")')
            if play_btn:
                print("Triggering Play Motion simulation...")
                await play_btn.click()
                await page.wait_for_timeout(400)
                await page.screenshot(path='localhost_whiteboard_playing_motion.png')
                print("Saved localhost_whiteboard_playing_motion.png")

            await browser.close()

            # Copy all generated images to artifact directory
            imgs = [
                'localhost_settings_clean.png',
                'localhost_whiteboard_full_studio.png',
                'localhost_whiteboard_element_selected.png',
                'localhost_whiteboard_motion_dropdown.png',
                'localhost_whiteboard_upload_modal.png',
                'localhost_whiteboard_playing_motion.png'
            ]
            for im in imgs:
                if os.path.exists(im):
                    dest = os.path.join(art_dir, im)
                    shutil.copyfile(im, dest)
                    print(f"Copied {im} to {dest}")

    except Exception as e:
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(main())
