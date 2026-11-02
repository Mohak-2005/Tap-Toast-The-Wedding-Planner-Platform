import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('{/* 3. Default Foil Border Color */}')
print(text[idx+500:idx+1500])
