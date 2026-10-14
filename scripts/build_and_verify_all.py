import os
from login_builder import build_login
from register_builder import build_register
from guest_mobile_builder import build_guest_mobile
from guest_web_builder import build_guest_web
from couple_builder import build_couple
from mc_builder import build_mc
from superadmin_builder import build_superadmin
from index_builder import build_index
from verify_rules import verify_file

print("Building all demo files...")
build_login()
build_register()
build_guest_mobile()
build_guest_web()
build_couple()
build_mc()
build_superadmin()
build_index()
print("\nAll 8 files rebuilt successfully!")

demo_dir = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo')
files = [
    'index.html',
    'login.html',
    'register.html',
    'guest-mobile.html',
    'guest-web.html',
    'couple.html',
    'mc.html',
    'superadmin.html'
]

all_pass = True
for f in files:
    if not verify_file(os.path.join(demo_dir, f)):
        all_pass = False

print(f"\nFinal Global Verification: {'ALL PASS' if all_pass else 'FAILURES DETECTED'}")
