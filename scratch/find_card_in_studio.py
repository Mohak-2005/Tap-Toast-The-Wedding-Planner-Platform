import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

portal_idx = text.find('createPortal(', 100)
# search after portal_idx
idx = text.find('activeShapeObj', portal_idx)
print("Context around activeShapeObj in portal:")
print(text[idx-200:idx+1200])
