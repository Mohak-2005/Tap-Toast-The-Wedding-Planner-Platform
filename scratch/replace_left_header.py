with open('src/components/SuperAdminCardStudio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
text = re.sub(r'<span className="text-base">[\U00010000-\U0010ffff]</span>', '<PaletteIcon className="w-4 h-4 text-[#bd9661]" />', text)
text = text.replace(
    'title="Hide Panel"\n                    >\n                      ◀\n                    </button>',
    'title="Hide Panel"\n                    >\n                      <ChevronLeftIcon className="w-3.5 h-3.5 text-[#dfc194]" />\n                    </button>'
)

with open('src/components/SuperAdminCardStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Replaced left card header emoji successfully!")
