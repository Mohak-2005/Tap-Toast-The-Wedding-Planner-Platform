import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

portal_idx = text.find('createPortal(', 100)
idx = text.find('flex-1 relative overflow-hidden', portal_idx)
print(text[idx-100:idx+600])
