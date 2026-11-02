import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('select-none overflow-hidden ${activeShapeObj.roundedClass}')
print(text[idx-300:idx+1500])
