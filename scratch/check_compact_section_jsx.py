import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('return (')
end_idx = text.find('{/* =================================================================== */}\n      {/* 2. FULL WINDOW WHITEBOARD DESIGN STUDIO MODAL')
print(text[idx:end_idx])
