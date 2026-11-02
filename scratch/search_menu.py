with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line for line in text.split('\n') if 'Flowers' in line or 'Leaves' in line or 'Decor' in line]
for m in matches[:15]:
    print(m)
