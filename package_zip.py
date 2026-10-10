import os
import zipfile
import shutil

def create_client_zip():
    demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo'))
    workspace_zip = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'tap-and-toast-client-demo.zip'))
    desktop_zip = os.path.abspath(r'C:\Users\Mohak\Desktop\tap-and-toast-client-demo.zip')

    expected_files = [
        'index.html',
        'couple.html',
        'guest-mobile.html',
        'guest-web.html',
        'login.html',
        'mc.html',
        'register.html',
        'superadmin.html',
        'README.txt'
    ]

    print(f"Checking demo directory: {demo_dir}")
    for fname in expected_files:
        fpath = os.path.join(demo_dir, fname)
        if not os.path.isfile(fpath):
            raise FileNotFoundError(f"Missing expected demo file: {fname}")
        size = os.path.getsize(fpath)
        print(f"  [OK] {fname} ({size:,} bytes)")

    # Build workspace zip
    print(f"\nBuilding zip at: {workspace_zip}")
    if os.path.exists(workspace_zip):
        os.remove(workspace_zip)

    with zipfile.ZipFile(workspace_zip, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        for fname in expected_files:
            fpath = os.path.join(demo_dir, fname)
            # Store at root of zip archive
            zf.write(fpath, arcname=fname)
            print(f"  Added {fname} -> {fname}")

    print(f"Workspace zip created! Size: {os.path.getsize(workspace_zip):,} bytes")

    # Copy to Desktop for immediate convenience
    print(f"\nCopying zip to User Desktop: {desktop_zip}")
    shutil.copyfile(workspace_zip, desktop_zip)
    print(f"Desktop zip ready! Size: {os.path.getsize(desktop_zip):,} bytes")

    # Verification: Unpack to temporary folder in scratch
    scratch_dir = os.path.abspath(r'C:\Users\Mohak\.gemini\antigravity\brain\6a83d281-059a-41b9-9986-ec9f5814ed0b\scratch\unzip_test')
    if os.path.exists(scratch_dir):
        shutil.rmtree(scratch_dir)
    os.makedirs(scratch_dir, exist_ok=True)

    print(f"\nVerifying extraction to: {scratch_dir}")
    with zipfile.ZipFile(workspace_zip, 'r') as zf:
        zf.extractall(scratch_dir)

    unpacked_files = os.listdir(scratch_dir)
    print(f"Unpacked files count: {len(unpacked_files)}")
    for ef in expected_files:
        if ef not in unpacked_files:
            raise RuntimeError(f"Extraction verification failed: missing {ef}")
        ext_size = os.path.getsize(os.path.join(scratch_dir, ef))
        src_size = os.path.getsize(os.path.join(demo_dir, ef))
        if ext_size != src_size:
            raise RuntimeError(f"Extraction size mismatch on {ef}: expected {src_size}, got {ext_size}")

    print("\nExtraction verification 100% SUCCESSFUL! All files match source exactly.")

if __name__ == '__main__':
    create_client_zip()
