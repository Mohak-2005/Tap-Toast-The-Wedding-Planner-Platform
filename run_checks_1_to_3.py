import os
import re

files = ['guest-mobile.html', 'guest-web.html', 'couple.html', 'mc.html', 'superadmin.html']
demo_dir = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo')

print('--- CHECK 1: alert( ---')
check1_pass = True
for f in files:
    with open(os.path.join(demo_dir, f), 'r', encoding='utf-8') as fp:
        cnt = len(re.findall(r'alert\(', fp.read()))
        print(f'{f}: {cnt}')
        if cnt != 0: check1_pass = False

print('\n--- CHECK 2: href="#" ---')
check2_pass = True
for f in files:
    with open(os.path.join(demo_dir, f), 'r', encoding='utf-8') as fp:
        matches = re.findall(r'href=["\']#["\']', fp.read())
        print(f'{f}: {len(matches)}')
        if len(matches) != 0: check2_pass = False

print('\n--- CHECK 3: external URLs ---')
check3_pass = True
for f in files:
    with open(os.path.join(demo_dir, f), 'r', encoding='utf-8') as fp:
        urls = re.findall(r'https?://[^"\'\s<>\)]+', fp.read())
        bad = [u for u in urls if 'fonts.googleapis.com' not in u and 'fonts.gstatic.com' not in u]
        print(f'{f}: {len(bad)} disallowed ({bad})')
        if len(bad) != 0: check3_pass = False

print(f'\nResult: Check 1: {"PASS" if check1_pass else "FAIL"} | Check 2: {"PASS" if check2_pass else "FAIL"} | Check 3: {"PASS" if check3_pass else "FAIL"}')
