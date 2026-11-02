with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'renderDesignBoxItem' in l or 'magnolia-bloom' in l or 'protea-rose' in l:
        print(f'Line {i+1}: {l.strip()}')
        for j in range(max(0, i-2), min(len(lines), i+20)):
            print(f'  {j+1}: {lines[j].rstrip()}')
        break
