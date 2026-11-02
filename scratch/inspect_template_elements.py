import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const INITIAL_TEMPLATES: CustomCardTemplate\[\] = (\[[\s\S]*?\n\];)', text)
if m:
    templates_code = m.group(1)
    # Split by { id:
    parts = templates_code.split("{ id:")
    for p in parts[1:]:
        first_line = p.split('\n')[0]
        name_line = [l for l in p.split('\n') if 'name:' in l][0]
        elements_count = p.count("type:")
        print(f"Template {first_line.strip()} | {name_line.strip()} | elements count: {elements_count}")
