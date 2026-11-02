import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_pos = text.find('{/* 2. Card Background Paper Texture */}')
print(text[start_pos+1500:start_pos+3000])
