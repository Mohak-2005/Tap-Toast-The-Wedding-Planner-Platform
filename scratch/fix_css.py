with open('src/index.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Swap line 0 and line 1
if lines[0].startswith('@import "tailwindcss"') and lines[1].startswith('@import url'):
    lines[0], lines[1] = lines[1], lines[0]
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Fixed @import order in src/index.css")
else:
    print("Lines were:", lines[:2])
