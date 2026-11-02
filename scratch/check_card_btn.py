import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('handleOpenDesignerFor(tpl)')
print(text[idx-200:idx+300])
