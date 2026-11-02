with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(2460, 2520):
    print(f'{j+1}: {lines[j].rstrip()}')
