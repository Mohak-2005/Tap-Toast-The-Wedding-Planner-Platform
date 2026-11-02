import sys, re
sys.stdout.reconfigure(encoding='utf-8')

file_path = 'src/components/SuperAdminCardStudio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the 3 shimmer star spans
pattern = r'\{el\.shimmer === \'[^\']+\' && \(\s*<span className="absolute -top-1 -right-1[^\>]+>[^<]+</span>\s*\)\}'
content = re.sub(pattern, '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed all element star badges.")
