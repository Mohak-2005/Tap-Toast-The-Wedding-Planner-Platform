import os
import re

demo_dir = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo')
files = ['guest-mobile.html', 'guest-web.html', 'couple.html', 'mc.html', 'superadmin.html']

for f in files:
    filepath = os.path.join(demo_dir, f)
    with open(filepath, 'r', encoding='utf-8') as fp:
        html = fp.read()

    print(f"=== HTML Structure Audit: {f} ===")
    assert '<!DOCTYPE html>' in html
    assert '<meta charset="utf-8">' in html
    assert 'name="viewport"' in html
    assert '<title>' in html
    assert 'class="tt-demobar"' in html
    assert 'fonts.googleapis.com' in html
    assert 'fonts.gstatic.com' in html
    print(f"  File size: {len(html)} bytes")
    print("  Structure: PASS\n")

print("All files passed HTML structural audit!")
