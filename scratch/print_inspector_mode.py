with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'rightCardMode === \'inspector\'' in l:
        print(f'{i+1}: {l.strip()}')
        for j in range(max(0, i-2), min(len(lines), i+30)):
            print(f'  {j+1}: {lines[j].rstrip()}')
        break
