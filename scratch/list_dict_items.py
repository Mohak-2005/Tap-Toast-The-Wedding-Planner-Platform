with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
keys = re.findall(r"'([a-z0-9\-]+)':\s*\{\s*name:\s*'([^']+)',\s*category:\s*'([^']+)'", text)
for k, name, cat in keys:
    print(f"Key: {k:22} | Name: {name:28} | Cat: {cat}")
