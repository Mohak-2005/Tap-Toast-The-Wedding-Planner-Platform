import sys
import asyncio
import traceback
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

async def main():
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(channel='msedge', headless=True)
            page = await browser.new_page(viewport={'width': 1440, 'height': 900})
            print("Navigating to http://127.0.0.1:5173/#superadmin ...")
            await page.goto('http://127.0.0.1:5173/#superadmin')
            await page.wait_for_timeout(2000)
            
            # Find and click Platform Settings
            buttons = await page.query_selector_all('button')
            clicked = False
            for b in buttons:
                txt = await b.inner_text()
                if 'Platform Settings' in txt:
                    print(f"Clicking tab: {txt}")
                    await b.click()
                    clicked = True
                    break
            
            if not clicked:
                print("Could not find Platform Settings tab!")
                return
                
            await page.wait_for_timeout(1000)
            await page.screenshot(path='localhost_settings_overview.png', full_page=True)
            print("Saved localhost_settings_overview.png")
            
            # Find the 'Design →' button on one of the theme cards
            design_btns = []
            for b in await page.query_selector_all('button'):
                t = await b.inner_text()
                if 'Design' in t:
                    design_btns.append((b, t))
            
            print(f"Found {len(design_btns)} design buttons")
            for b, t in design_btns:
                print(f" - Button: {t}")
                if '→' in t or 'Design' in t:
                    print(f"Clicking button: {t}")
                    await b.click()
                    break
            
            await page.wait_for_timeout(1200)
            await page.screenshot(path='localhost_studio_modal.png')
            print("Saved localhost_studio_modal.png")
            
            # Also test clicking a flower element on the canvas to see selection box
            flower_el = await page.query_selector('div.touch-none')
            if flower_el:
                print("Clicking canvas element...")
                await flower_el.click()
                await page.wait_for_timeout(500)
                await page.screenshot(path='localhost_studio_element_selected.png')
                print("Saved localhost_studio_element_selected.png")

            # Click Motion dropdown
            motion_btn = await page.query_selector('button:has-text("Motion")')
            if motion_btn:
                print("Opening Motion dropdown...")
                await motion_btn.click()
                await page.wait_for_timeout(500)
                await page.screenshot(path='localhost_studio_motion_dropdown.png')
                print("Saved localhost_studio_motion_dropdown.png")

            await browser.close()
    except Exception as e:
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(main())
