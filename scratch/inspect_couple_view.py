import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/CoupleView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

tabs = re.findall(r"activeTab === '([^']+)'", text)
print("Unique activeTabs:", set(tabs))

# Check for settings tab
for i, line in enumerate(text.splitlines()):
    if 'setting' in line.lower():
        print(f"Line {i+1}: {line.strip()[:100]}")
