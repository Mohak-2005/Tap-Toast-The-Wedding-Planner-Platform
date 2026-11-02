import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'animate-bounce|animate-ping|animate-pulse', text):
    print(text[m.start()-50:m.start()+100])
    print("---")
