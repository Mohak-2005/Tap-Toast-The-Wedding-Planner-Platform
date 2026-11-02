import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'SuperAdminCardStudio' in l:
        print(f"Line {i+1}: {l}", end="")
