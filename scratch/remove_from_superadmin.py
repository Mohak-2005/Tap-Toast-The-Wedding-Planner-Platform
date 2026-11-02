import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminView.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove import
content = content.replace("import { SuperAdminCardStudio } from './SuperAdminCardStudio';\n", "")

# 2. Remove component usage
old_usage = """            {/* Section: Global Digital Invitation Card & Animation Studio */}
            <SuperAdminCardStudio />

"""
if old_usage in content:
    content = content.replace(old_usage, "")
    print("Removed SuperAdminCardStudio from SuperAdminView.tsx")
else:
    # try single line
    content = content.replace("<SuperAdminCardStudio />", "")
    print("Replaced <SuperAdminCardStudio /> in SuperAdminView.tsx")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved SuperAdminView.tsx")
