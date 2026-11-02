import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import shutil
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:/Users/Mohak/.gemini/antigravity/brain/7e10416b-39bb-4843-a272-4703ed0fd71b"

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto("http://127.0.0.1:5173/")
    page.wait_for_load_state("networkidle")
    
    # Couple Dashboard -> Settings
    page.locator("button:has-text('Couple Dashboard')").first.click()
    page.wait_for_timeout(600)
    page.locator("button:has-text('Settings')").first.click()
    page.wait_for_timeout(800)
    
    # Open Studio for Midnight Protea
    page.locator("button:has-text('Preview Studio')").nth(2).click()
    page.wait_for_timeout(1200)
    
    # Select Sophie & Daniel
    target = page.locator("div.touch-none:has-text('Sophie & Daniel')").last
    target.dispatch_event('pointerdown')
    target.dispatch_event('click')
    page.wait_for_timeout(800)
    
    # Click the exact font family toggle button (innermost)
    font_section = page.locator("div.relative:has-text('Font Family')").last
    font_btn = font_section.locator("> button").first
    print("Found innermost font button! Clicking...")
    font_btn.click()
    page.wait_for_timeout(700)
    
    path_font_open = "verify_req1_font_dropdown_open.png"
    page.screenshot(path=path_font_open)
    shutil.copy(path_font_open, os.path.join(ARTIFACT_DIR, path_font_open))
    print("✓ Captured verify_req1_font_dropdown_open.png")
    
    # Test font search input
    search_input = page.locator("input[placeholder*='Search wedding fonts']").first
    print("Search input visible:", search_input.is_visible())
    if search_input.is_visible():
        search_input.fill("Cormorant")
        page.wait_for_timeout(500)
        
        path_search = "verify_req1_font_search_filter.png"
        page.screenshot(path=path_search)
        shutil.copy(path_search, os.path.join(ARTIFACT_DIR, path_search))
        print("✓ Captured verify_req1_font_search_filter.png")
        
        # Select Cormorant Garamond
        page.locator("button:has-text('Cormorant Garamond')").first.click()
        page.wait_for_timeout(700)
        
        path_applied = "verify_req1_font_applied_to_canvas.png"
        page.screenshot(path=path_applied)
        shutil.copy(path_applied, os.path.join(ARTIFACT_DIR, path_applied))
        print("✓ Captured verify_req1_font_applied_to_canvas.png")

    browser.close()
