import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('{/* 2. Card Background Paper Texture */}')
print(text[idx+1000:idx+2500])
