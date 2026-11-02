with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(4000, 4275):
    if 'activeTab ===' in lines[i] or "activeTab == '" in lines[i]:
        print(f'{i+1}: {lines[i].strip()}')
