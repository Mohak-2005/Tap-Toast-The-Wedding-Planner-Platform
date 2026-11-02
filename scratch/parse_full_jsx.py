import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove comments
# JSX comments: {/* ... */}
no_comments = re.sub(r'\{/\*.*?\*/\}', '', text, flags=re.DOTALL)
# JS comments: // ...
no_comments = re.sub(r'//[^\n]*', '', no_comments)

# Find all JSX tags across multiple lines
# Match <Tag or </Tag or <Tag ... />
tag_pattern = re.compile(r'<(/?[a-zA-Z0-9_.-]+)(\s+[^>]*?)?(/?)>', re.DOTALL)

# Self-closing elements in HTML/SVG
VOID_ELEMENTS = {'input', 'img', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'}

stack = []

for m in tag_pattern.finditer(no_comments):
    tag_name = m.group(1)
    attrs = m.group(2) or ''
    slash = m.group(3)
    
    # Calculate line number
    line_no = text[:m.start()].count('\n') + 1

    # Check if self-closing
    if slash == '/' or attrs.strip().endswith('/') or tag_name.lower() in VOID_ELEMENTS:
        continue

    # Filter out TS generics or arrow comparisons like <el.length or <number> if any
    # Only keep valid HTML/React component tags
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9_.-]*$', tag_name.lstrip('/')):
        continue
    
    if tag_name.startswith('/'):
        closing = tag_name[1:]
        if not stack:
            print(f"Line {line_no}: Extraneous closing tag </{closing}>")
        else:
            top_tag, top_line = stack.pop()
            if top_tag != closing:
                print(f"Line {line_no}: Mismatched </{closing}>, expected </{top_tag}> (opened on line {top_line})")
                # push back to see remaining
                stack.append((top_tag, top_line))
    else:
        stack.append((tag_name, line_no))

print(f"\nTotal unclosed tags on stack: {len(stack)}")
for tag, line in stack[-20:]:
    print(f"  <{tag}> opened at line {line}")
