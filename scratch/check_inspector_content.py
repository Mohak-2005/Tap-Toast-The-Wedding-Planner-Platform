import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('{/* TAB 2: INSPECTOR (STYLING')
if idx != -1:
    print(text[idx:idx+1500])
