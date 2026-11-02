import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

portal_idx = text.find('createPortal(', 100)
idx = text.find('cardShimmer ===', portal_idx)
while idx != -1:
    print(text[idx-50:idx+300])
    print("="*40)
    idx = text.find('cardShimmer ===', idx + 1)
