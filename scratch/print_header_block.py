import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('flex flex-col sm:flex-row sm:items-center justify-between')
end = text.find('{/* Template Grid */}')
print(text[start:end])
