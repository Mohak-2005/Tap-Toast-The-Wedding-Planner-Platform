with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(1130, 1170):
    print(f'{j+1}: {lines[j].rstrip()}')
