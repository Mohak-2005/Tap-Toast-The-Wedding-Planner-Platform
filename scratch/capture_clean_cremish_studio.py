import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

artifact_dir = r"C:\Users\Mohak\.gemini\antigravity\brain\7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()

    print("Navigating to http://127.0.0.1:5173/#superadmin...")
    page.goto("http://127.0.0.1:5173/#superadmin", wait_until="networkidle")
    time.sleep(2)

    # 1. Click 'Platform Settings' in left sidebar
    print("Clicking Platform Settings...")
    page.locator("button:has-text('Platform Settings')").click()
    time.sleep(1.5)

    # 2. Click the 'Design' button on the first card
    print("Clicking Design button on first card...")
    # Find all buttons that contain 'Design'
    design_buttons = page.locator("button:has-text('Design')")
    print(f"Found {design_buttons.count()} design buttons.")
    # The second one is the first card's 'Design →' button (first is '+ Design New Theme')
    if design_buttons.count() > 1:
        design_buttons.nth(1).click()
    else:
        design_buttons.first.click()

    time.sleep(2)

    # 3. Capture Overview of the Dual Equal Cards Studio on Cremish Canvas
    page.screenshot(path=f"{artifact_dir}/clean_02_studio_cremish_overview.png")
    print("Saved clean_02_studio_cremish_overview.png")

    # 4. Check Right Card - Design Box: Click 'Flowers' category pill
    print("Filtering Design Box by Flowers...")
    flower_pill = page.locator("aside button:has-text('Flowers')")
    if flower_pill.count() > 0:
        flower_pill.first.click()
        time.sleep(0.8)
        page.screenshot(path=f"{artifact_dir}/clean_03_design_box_flowers.png")
        print("Saved clean_03_design_box_flowers.png")

    # 5. Add White Orchid to card
    print("Adding White Orchid from Design Box...")
    orchid_btn = page.locator("button:has-text('White Orchid')")
    if orchid_btn.count() > 0:
        orchid_btn.first.click()
        time.sleep(1)
        page.screenshot(path=f"{artifact_dir}/clean_04_flower_added.png")
        print("Saved clean_04_flower_added.png")

    # 6. Switch Right Card to 'Inspector' tab
    print("Switching to Inspector tab...")
    inspector_tab = page.locator("aside button:has-text('Inspector')")
    if inspector_tab.count() > 0:
        inspector_tab.first.click()
        time.sleep(1)
        page.screenshot(path=f"{artifact_dir}/clean_05_inspector_active.png")
        print("Saved clean_05_inspector_active.png")

    # 7. Apply Petal Color (Rose Coral or Emerald Green)
    print("Selecting Petal Color...")
    rose_color = page.locator("button[title='#e07a5f']")
    if rose_color.count() > 0:
        rose_color.first.click()
    time.sleep(0.8)
    page.screenshot(path=f"{artifact_dir}/clean_06_petal_color_applied.png")
    print("Saved clean_06_petal_color_applied.png")

    # 8. Change Card Shape to 'Scalloped Flap' or 'Cameo Oval' on Left Card
    print("Changing Card Shape on Left Card...")
    scallop_shape = page.locator("button:has-text('Scalloped Flap')")
    if scallop_shape.count() > 0:
        scallop_shape.first.click()
    time.sleep(1)
    page.screenshot(path=f"{artifact_dir}/clean_07_shape_changed.png")
    print("Saved clean_07_shape_changed.png")

    # 9. Test Play 3D Unboxing Motion
    print("Testing Play 3D Motion...")
    play_motion_btn = page.locator("header button:has-text('Play 3D Motion')")
    if play_motion_btn.count() > 0:
        play_motion_btn.first.click()
        time.sleep(0.8)
        page.screenshot(path=f"{artifact_dir}/clean_08_unboxing_motion.png")
        print("Saved clean_08_unboxing_motion.png")

    browser.close()
    print("All captures completed successfully!")
