import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# find cardShimmer occurrences
import re
for m in re.finditer(r'\{cardShimmer ===', text):
    start = m.start()
    print("--- CARD SHIMMER BLOCK ---")
    print(text[start-50:start+1200])
