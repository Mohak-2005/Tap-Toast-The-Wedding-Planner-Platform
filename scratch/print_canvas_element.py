with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[:120]):
    if 'interface CanvasElement' in l or 'type CanvasElement' in l:
        print(f'Line {i+1}: {l.strip()}')
        for j in range(i, min(len(lines), i+25)):
            print(f'  {j+1}: {lines[j].rstrip()}')
        break
