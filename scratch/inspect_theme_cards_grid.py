import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('{/* Clean Theme Cards Grid')
end = text.find('{/* Quick Action: New Theme Card */}')
print(text[start:end])
