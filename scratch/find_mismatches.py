import sys, os
sys.path.insert(0, os.path.abspath('scratch'))
sys.stdout.reconfigure(encoding='utf-8')
from update_studio_layout import new_studio_jsx
import re

lines = new_studio_jsx.splitlines()

# Self-closing tags or tags in SVG
VOID_ELEMENTS = {'input', 'img', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'}

stack = [] # (tag, line_no, col)

for line_idx, line in enumerate(lines):
    line_no = line_idx + 1
    # Strip comments
    clean = re.sub(r'\{/\*.*?\*/\}', '', line)
    # Find all tags
    for match in re.finditer(r'<(/?[a-zA-Z0-9]+)([^>]*?)(/?)>', clean):
        tag_name = match.group(1)
        attrs = match.group(2)
        slash = match.group(3)
        
        if slash == '/' or tag_name.lower() in VOID_ELEMENTS:
            continue
            
        if tag_name.startswith('/'):
            closing_tag = tag_name[1:]
            if not stack:
                print(f"Line {line_no}: Unexpected closing tag </{closing_tag}> with empty stack!")
            else:
                top_tag, top_line = stack[-1]
                if top_tag == closing_tag:
                    stack.pop()
                else:
                    print(f"Line {line_no}: Closing </{closing_tag}> does not match expected </{top_tag}> (opened on line {top_line})")
        else:
            # Check if self-closing like <span ... />
            if attrs.strip().endswith('/'):
                continue
            stack.append((tag_name, line_no))

print("\n--- Remaining Unclosed Tags on Stack ---")
for tag, line_no in stack:
    print(f"<{tag}> opened on line {line_no}")
