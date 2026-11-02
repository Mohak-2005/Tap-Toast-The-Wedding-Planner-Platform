import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://127.0.0.1:5173/')
    page.wait_for_load_state('networkidle')
    
    page.screenshot(path='initial_landing.png')
    
    btns = page.locator('button').all_text_contents()
    print('Initial page buttons:', [b.strip() for b in btns if b.strip()])
    
    browser.close()
