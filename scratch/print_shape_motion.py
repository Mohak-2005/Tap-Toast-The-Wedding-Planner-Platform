import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(1535, 1815):
    print(f'{j+1}: {lines[j].rstrip()}')
