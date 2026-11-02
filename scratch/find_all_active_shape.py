import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'activeShapeObj', text)]
print("Total occurrences of activeShapeObj:", len(matches))
for idx in matches:
    print(text[idx-50:idx+150])
    print("---")
