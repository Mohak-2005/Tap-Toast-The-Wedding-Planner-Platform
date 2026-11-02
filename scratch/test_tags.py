import sys, os
sys.path.insert(0, os.path.abspath('scratch'))
sys.stdout.reconfigure(encoding='utf-8')
from update_studio_layout import new_studio_jsx
import re

# Append </div>
test_jsx = new_studio_jsx + "\n            </div>"

# Let's count tags in test_jsx
# Remove strings and style contents first to avoid false positives
clean_text = re.sub(r'<style>.*?</style>', '', test_jsx, flags=re.DOTALL)
clean_text = re.sub(r'\{`.*?`\}', '', clean_text, flags=re.DOTALL)
clean_text = re.sub(r'\"[^\"]*\"', '""', clean_text)
clean_text = re.sub(r'\'[^\']*\'', "''", clean_text)

# Count tags
for tag in ['div', 'aside', 'header', 'button', 'svg', 'span', 'p', 'h3', 'h4']:
    opens = len(re.findall(r'<' + tag + r'(\s|>)', clean_text))
    closes = len(re.findall(r'</' + tag + r'>', clean_text))
    print(f'{tag}: opens={opens}, closes={closes}, diff={opens - closes}')
