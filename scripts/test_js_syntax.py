import os
import re
import subprocess
import tempfile

demo_dir = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo')
files = [
    'login.html',
    'register.html',
    'guest-mobile.html',
    'guest-web.html',
    'couple.html',
    'mc.html',
    'superadmin.html'
]

all_valid = True
for filename in files:
    filepath = os.path.join(demo_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all content inside <script>...</script>
    scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    print(f"=== Testing JS syntax in {filename} (found {len(scripts)} scripts) ===")
    
    for i, script in enumerate(scripts):
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as tmp:
            tmp.write(script)
            tmp_path = tmp.name
        
        try:
            res = subprocess.run(['node', '-c', tmp_path], capture_output=True, text=True)
            if res.returncode == 0:
                print(f"  Script {i+1}: SYNTAX OK")
            else:
                print(f"  Script {i+1}: SYNTAX ERROR:\n{res.stderr}")
                all_valid = False
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

print(f"\nJavaScript Syntax Check: {'ALL PASS' if all_valid else 'FAIL'}")
