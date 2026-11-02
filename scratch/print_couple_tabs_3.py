with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(1320, 1345):
    print(f'{j+1}: {lines[j].rstrip()}')
