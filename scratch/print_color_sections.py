import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('setBaseColor')
start = text.rfind('{/* 2.', 0, idx)
end = text.find('{/* 4.', idx)
print(text[start:end])
