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

    # 1. Capture settings page with theme cards
    page.screenshot(path=f"{artifact_dir}/dualcards_01_settings.png")
    print("Saved dualcards_01_settings.png")

    # 2. Click 'Design ->' on first theme card
    design_btns = page.locator("button:has-text('Design →')")
    if design_btns.count() > 0:
        design_btns.first.click()
    else:
        # Fallback to Design New Theme
        page.locator("button:has-text('Design Theme')").first.click()

    time.sleep(2)

    # 3. Capture Overview of the Dual Equal Cards Studio
    page.screenshot(path=f"{artifact_dir}/dualcards_02_studio_overview.png")
    print("Saved dualcards_02_studio_overview.png")

    # 4. Check Right Card - Design Box: Click 'Flowers' category pill
    flower_pill = page.locator("button:has-text('Flowers')")
    if flower_pill.count() > 0:
        flower_pill.first.click()
        time.sleep(0.5)
        page.screenshot(path=f"{artifact_dir}/dualcards_03_design_box_flowers.png")
        print("Saved dualcards_03_design_box_flowers.png")

    # 5. Add a flower from Design Box
    orchid_btn = page.locator("button:has-text('White Orchid')")
    if orchid_btn.count() > 0:
        orchid_btn.first.click()
    else:
        # Click first design item
        first_item = page.locator("aside:has-text('Design Box') button.p-2\\.5").first
        if first_item.count() > 0:
            first_item.click()
    time.sleep(1)

    # 6. Click 'Leaves' category pill and add a leaf
    leaves_pill = page.locator("button:has-text('Leaves')")
    if leaves_pill.count() > 0:
        leaves_pill.first.click()
        time.sleep(0.5)
        laurel_btn = page.locator("button:has-text('Tuscan Laurel')")
        if laurel_btn.count() > 0:
            laurel_btn.first.click()
        page.screenshot(path=f"{artifact_dir}/dualcards_04_elements_added.png")
        print("Saved dualcards_04_elements_added.png")

    # 7. Switch Right Card to 'Inspector' tab
    inspector_tab = page.locator("button:has-text('Inspector')")
    if inspector_tab.count() > 0:
        inspector_tab.first.click()
        time.sleep(0.8)
        page.screenshot(path=f"{artifact_dir}/dualcards_05_inspector_tab.png")
        print("Saved dualcards_05_inspector_tab.png")

    # 8. In Inspector: Apply Shimmer/Glitter effect to the element (Gold Glitter or Fairy Dust)
    glitter_btn = page.locator("button:has-text('Gold Glitter')")
    if glitter_btn.count() > 0:
        glitter_btn.first.click()
        time.sleep(0.5)

    # Apply petal color (Emerald Green or Ivory Rose)
    emerald_color = page.locator("button[title='#1b4332']")
    if emerald_color.count() > 0:
        emerald_color.first.click()
    time.sleep(0.5)

    page.screenshot(path=f"{artifact_dir}/dualcards_06_element_glitter_applied.png")
    print("Saved dualcards_06_element_glitter_applied.png")

    # 9. In Left Card: Select Card Shimmer (Gold Stardust or Diamond Sparkle)
    card_shimmer_btn = page.locator("button:has-text('Gold Stardust')")
    if card_shimmer_btn.count() > 0:
        card_shimmer_btn.first.click()
        time.sleep(0.8)

    # Select Card Shape (Scalloped Flap or Arch Dome Top)
    shape_btn = page.locator("button:has-text('Scalloped Flap')")
    if shape_btn.count() > 0:
        shape_btn.first.click()
        time.sleep(0.8)

    page.screenshot(path=f"{artifact_dir}/dualcards_07_card_shimmer_and_shape.png")
    print("Saved dualcards_07_card_shimmer_and_shape.png")

    # 10. Test Play 3D Unboxing Motion
    play_motion_btn = page.locator("button:has-text('Play 3D Motion')")
    if play_motion_btn.count() > 0:
        play_motion_btn.first.click()
        time.sleep(1)
        page.screenshot(path=f"{artifact_dir}/dualcards_08_playing_3d_motion.png")
        print("Saved dualcards_08_playing_3d_motion.png")

    browser.close()
    print("All screenshots captured successfully!")
