import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const INITIAL_TEMPLATES: CustomCardTemplate\[\] = (\[[\s\S]*?\n\];)', text)
if m:
    templates_code = m.group(1)
    pattern = re.compile(r"id:\s*'([^']+)',\s*name:\s*'([^']+)'", re.MULTILINE)
    matches = pattern.findall(templates_code)
    for tid, name in matches:
        print(f"ID: {tid} | Name: {name}")
