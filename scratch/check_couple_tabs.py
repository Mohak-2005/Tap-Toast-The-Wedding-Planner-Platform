import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("id: 'settings',")
print(text[idx-100:idx+300])
