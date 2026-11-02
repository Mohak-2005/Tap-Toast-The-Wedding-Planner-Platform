import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('{/* 1. COMPACT SECTION')
end_idx = text.find('{/* 2. FULL VIEWPORT WHITEBOARD')
print(text[idx:end_idx])
