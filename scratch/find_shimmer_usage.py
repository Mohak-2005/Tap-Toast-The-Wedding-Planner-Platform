import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'shimmer:\s*[\'"][^\'"]+[\'"]', text):
    print(m.group(0))
