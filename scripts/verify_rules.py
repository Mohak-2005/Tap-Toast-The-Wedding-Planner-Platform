import os
import re

def verify_file(filepath):
    print(f"=== Verifying {os.path.basename(filepath)} ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. alert(
    alerts = re.findall(r'alert\(', content)
    print(f"alert() occurrences: {len(alerts)}")

    # 2. href="#"
    empty_links = re.findall(r'href=["\']#["\']', content)
    print(f'href="#" occurrences: {len(empty_links)}')

    # 3. External URLs
    urls = re.findall(r'https?://[^\s"\'<>]+', content)
    allowed_domains = ['fonts.googleapis.com', 'fonts.gstatic.com', 'maps.google.com', 'google.com/maps']
    disallowed_urls = []
    for u in urls:
        # Ignore sample test strings like registry.example.com or tapandtoast.au
        if not any(dom in u for dom in allowed_domains):
            disallowed_urls.append(u)
    print(f"Disallowed external URLs: {disallowed_urls}")

    passed = (len(alerts) == 0 and len(empty_links) == 0 and len(disallowed_urls) == 0)
    print(f"Status: {'PASS' if passed else 'FAIL'}\n")
    return passed

if __name__ == '__main__':
    demo_dir = os.path.join(os.path.dirname(__file__), '..', 'tap-toast-demo')
    files = [f for f in os.listdir(demo_dir) if f.endswith('.html')]
    all_pass = True
    for f in sorted(files):
        if not verify_file(os.path.join(demo_dir, f)):
            all_pass = False
    print(f"Overall Verification: {'ALL PASS' if all_pass else 'FAILURES DETECTED'}")
