import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/ColorPicker2D.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx_ret = text.find('return (')
print(text[idx_ret:])
