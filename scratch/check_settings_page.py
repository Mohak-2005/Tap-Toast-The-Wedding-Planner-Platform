from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://127.0.0.1:5173/')
    page.wait_for_load_state('networkidle')
    
    couple_btn = page.locator("button:has-text('Couple View')").first
    if couple_btn.is_visible():
        couple_btn.click()
    page.wait_for_timeout(1000)
    
    settings_btn = page.locator("button:has-text('Settings')").first
    if settings_btn.is_visible():
        settings_btn.click()
    page.wait_for_timeout(1500)
    
    print('Bespoke elements:', page.locator("text=Bespoke Invitation Cards").count())
    btns = page.locator("button").all_text_contents()
    print('Buttons with Studio or Preview:', [b.strip() for b in btns if 'Studio' in b or 'Preview' in b or 'Bespoke' in b])
    
    # Check all templates
    cards = page.locator("text=Magnolia & Gilded Frame").count()
    print('Magnolia count:', cards)
    cards2 = page.locator("text=Midnight Protea & Garland").count()
    print('Midnight Protea count:', cards2)
    
    browser.close()
