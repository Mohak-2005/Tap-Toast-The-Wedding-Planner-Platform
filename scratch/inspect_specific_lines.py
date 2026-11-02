import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=== Lines 1275-1310 ===")
for i in range(1274, min(1310, len(lines))):
    print(f"{i+1}: {lines[i]}", end="")

print("\n=== Lines 1790-1840 ===")
for i in range(1789, min(1840, len(lines))):
    print(f"{i+1}: {lines[i]}", end="")
