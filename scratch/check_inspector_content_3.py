import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('rightCardMode === \'inspector\'')
if idx != -1:
    print(text[idx+1200:idx+3200])
