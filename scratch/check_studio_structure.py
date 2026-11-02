import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/update_studio_layout.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect new_studio_jsx from scratch/update_studio_layout.py
lines = text.splitlines()
print(f"Total lines in update_studio_layout.py: {len(lines)}")
# Find where new_studio_jsx starts and ends
start_idx = None
end_idx = None
for i, l in enumerate(lines):
    if l.startswith("new_studio_jsx = '''"):
        start_idx = i
    elif l.endswith("'''") and start_idx is not None and i > start_idx:
        end_idx = i
        break

print(f"new_studio_jsx lines {start_idx} to {end_idx}")
for i in range(end_idx - 30, end_idx + 1):
    print(f"{i+1}: {lines[i]}")
