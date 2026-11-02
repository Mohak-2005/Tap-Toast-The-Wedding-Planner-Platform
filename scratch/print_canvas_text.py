import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(2045, 2085):
    print(f'{j+1}: {lines[j].rstrip()}')
