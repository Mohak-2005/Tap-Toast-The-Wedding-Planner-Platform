with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(1260, 1320):
    print(f'{j+1}: {lines[j].rstrip()}')
