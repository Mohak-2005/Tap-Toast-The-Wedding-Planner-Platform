import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('rightCardMode === \'inspector\'')
if idx != -1:
    idx_shimmer = text.find('shimmer', idx)
    if idx_shimmer != -1:
        print(text[idx_shimmer-100:idx_shimmer+800])
    else:
        print("No shimmer in inspector!")
