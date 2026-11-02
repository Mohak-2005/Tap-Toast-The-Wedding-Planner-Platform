with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'CanvasElement' in l:
        print(f'Line {i+1}: {l.strip()}')
