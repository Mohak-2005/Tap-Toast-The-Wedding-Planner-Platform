with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(2310, 2370):
    print(f'{j+1}: {lines[j].rstrip()}')
