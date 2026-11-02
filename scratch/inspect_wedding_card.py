import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('{/* Interactive Wedding Invitation Card (Physical Canvas) */}')
print(text[start:start+1800])
