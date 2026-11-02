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
    page.wait_for_timeout(800)
    page.locator("button:has-text('Settings')").first.click()
    page.wait_for_timeout(1000)
    
    # Open Studio for Midnight Protea
    page.locator("button:has-text('Preview Studio')").nth(2).click()
    page.wait_for_timeout(1500)
    
    # Switch Right Card to Inspector mode by clicking the Inspector tab button
    print("Switching right card to Inspector...")
    inspector_tab = page.locator("button:has-text('Inspector')").first
    if inspector_tab.is_visible():
        inspector_tab.click()
        page.wait_for_timeout(500)
        
    # Click text element "Sophie & Daniel" on canvas
    print("Clicking Sophie & Daniel...")
    text_el = page.locator("div.select-none:has-text('Sophie & Daniel')").first
    if text_el.is_visible():
        text_el.click()
        page.wait_for_timeout(800)
        
    # Check if Font Family is in the inspector
    print("Looking for Font Family button...")
    font_section = page.locator("div.relative:has-text('Font Family')")
    print("Font section count:", font_section.count())
    
    font_btn = page.locator("label:has-text('Font Family') + div button, div.relative:has-text('Font Family') button").first
    if font_btn.is_visible():
        print("Clicking Font Family dropdown button...")
        font_btn.click()
        page.wait_for_timeout(600)
        
        path_font_open = "verify_req1_font_dropdown_open.png"
        page.screenshot(path=path_font_open)
        shutil.copy(path_font_open, os.path.join(ARTIFACT_DIR, path_font_open))
        print("✓ Captured verify_req1_font_dropdown_open.png")
        
        # Test font search
        print("Testing font search input...")
        search_input = page.locator("input[placeholder*='Search wedding fonts']").first
        if search_input.is_visible():
            search_input.fill("Cormorant")
            page.wait_for_timeout(500)
            
            path_search = "verify_req1_font_search_filter.png"
            page.screenshot(path=path_search)
            shutil.copy(path_search, os.path.join(ARTIFACT_DIR, path_search))
            print("✓ Captured verify_req1_font_search_filter.png")
            
            # Click Cormorant Garamond
            print("Clicking Cormorant Garamond...")
            page.locator("button:has-text('Cormorant Garamond')").first.click()
            page.wait_for_timeout(600)
            
            path_applied = "verify_req1_font_applied_to_canvas.png"
            page.screenshot(path=path_applied)
            shutil.copy(path_applied, os.path.join(ARTIFACT_DIR, path_applied))
            print("✓ Captured verify_req1_font_applied_to_canvas.png")
            
    browser.close()
