import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/CoupleView.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = "import { ColorPicker2D } from './ColorPicker2D';"
replacement = target + "\nimport { SuperAdminCardStudio } from './SuperAdminCardStudio';"

if target in content and "import { SuperAdminCardStudio }" not in content:
    content = content.replace(target, replacement, 1)
    print("Added import for SuperAdminCardStudio to CoupleView.tsx")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved CoupleView.tsx.")
