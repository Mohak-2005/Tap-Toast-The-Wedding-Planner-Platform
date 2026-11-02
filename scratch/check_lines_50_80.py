import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(50, min(80, len(lines))):
    print(f"{i+1}: {lines[i]}", end="")
