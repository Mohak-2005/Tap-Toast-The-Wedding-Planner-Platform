with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'PREDEFINED 3D MOTION' in l or 'CARD SILHOUETTE SHAPE' in l or 'CARD SHAPE SILHOUETTE' in l:
        print(f'Line {i+1}: {l.strip()}')
        for j in range(max(0, i-2), min(len(lines), i+35)):
            print(f'  {j+1}: {lines[j].rstrip()}')
        print('='*50)
