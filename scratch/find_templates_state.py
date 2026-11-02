with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'useState' in l and 'INITIAL_TEMPLATES' in l or 'localStorage' in l and 'custom_card_templates' in l:
        print(f'Line {i+1}: {l.strip()}')
        for j in range(max(0, i-2), min(len(lines), i+15)):
            print(f'  {j+1}: {lines[j].rstrip()}')
