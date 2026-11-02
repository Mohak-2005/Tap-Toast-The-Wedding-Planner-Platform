import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_pos = text.find('{/* 4. Wedding Card Shimmer / Glitter Effect */}')
print(text[start_pos+1000:start_pos+2500])
