import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/ColorPicker2D.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("ColorPicker2D interface & root div:")
idx = text.find('interface ColorPicker2DProps')
idx_div = text.find('return (', idx)
print(text[idx:idx_div+250])
