import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("el.type === 'flower'")
if idx != -1:
    print("Flower rendering:")
    print(text[idx-50:idx+600])

idx_txt = text.find("el.type === 'text'")
if idx_txt != -1:
    print("\nText rendering:")
    print(text[idx_txt-50:idx_txt+600])
