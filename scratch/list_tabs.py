with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'activeTab ===' in l or 'activeTab ===' in l.lower():
        print(f'{i+1}: {l.strip()}')
