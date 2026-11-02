with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'step="0.05"', text)]
for idx in matches:
    print('--- MATCH ---')
    print(text[idx-250:idx+250])
