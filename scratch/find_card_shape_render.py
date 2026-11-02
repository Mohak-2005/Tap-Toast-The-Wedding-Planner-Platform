import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

portal_idx = text.find('createPortal(', 100)
# search activeShapeObj.borderRadius after portal_idx
idx = text.find('borderRadius', portal_idx)
print("Context around borderRadius in portal:")
print(text[idx-200:idx+1200])
