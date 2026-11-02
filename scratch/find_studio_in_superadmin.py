import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('SuperAdminCardStudio')
while idx != -1:
    print(text[max(0, idx-100):min(len(text), idx+200)])
    print("="*40)
    idx = text.find('SuperAdminCardStudio', idx + 1)
