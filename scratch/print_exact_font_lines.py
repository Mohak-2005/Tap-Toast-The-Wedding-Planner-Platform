with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(2490, 2530):
    print(f'{j+1}: {repr(lines[j])}')
