import sys, os
sys.path.insert(0, os.path.abspath('scratch'))
sys.stdout.reconfigure(encoding='utf-8')
from update_studio_layout import new_studio_jsx

lines = new_studio_jsx.splitlines()

# Let's see lines 250-270, 690-710, and lines around 1200-1383
print("--- Lines around 250-270 ---")
for i in range(245, 275):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}")

print("\n--- Lines around 690-715 ---")
for i in range(690, 715):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}")

print("\n--- Lines from 1340 to end ---")
for i in range(1340, len(lines)):
    print(f"{i+1}: {lines[i]}")
