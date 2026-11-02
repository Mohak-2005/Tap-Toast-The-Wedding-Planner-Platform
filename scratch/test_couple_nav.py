import sys
sys.stdout.reconfigure(encoding='utf-8')
import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://127.0.0.1:5173/')
    page.wait_for_load_state('networkidle')
    
    # 1. Click Couple Dashboard
    print('Clicking Couple Dashboard...')
    page.locator("button:has-text('Couple Dashboard')").first.click()
    page.wait_for_timeout(1000)
    
    # 2. Click Settings in sidebar
    print('Clicking Settings in sidebar...')
    page.locator("button:has-text('Settings')").first.click()
    page.wait_for_timeout(1500)
    
    # Check for the 5 templates
    for name in [
        "Magnolia & Gilded Frame",
        "Native Wattle & Protea",
        "Midnight Protea & Garland",
        "Sydney Harbor & Fairy Lights",
        "Hunter Valley Vineyard Arch"
    ]:
        cnt = page.locator(f"text={name}").count()
        print(f"Template '{name}': found {cnt}")
        
    btns = page.locator("button:has-text('Preview Studio')").count()
    print(f"Preview Studio buttons count: {btns}")
    
    browser.close()
