import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# find w-[360px] or cardShape or baseColor
idx = text.find('baseColor')
while idx != -1:
    line_start = text.rfind('\n', 0, idx)
    line_end = text.find('\n', idx)
    line = text[line_start:line_end]
    if 'style={{' in line or 'backgroundColor:' in line or 'cardShape' in line:
        print(f"Pos {idx}: {line}")
        print("Context:")
        print(text[max(0, idx-300):min(len(text), idx+600)])
        print("="*60)
        break
    idx = text.find('baseColor', idx + 1)
