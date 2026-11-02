import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('elementGlowClass')
if idx != -1:
    print(text[idx-100:idx+300])
